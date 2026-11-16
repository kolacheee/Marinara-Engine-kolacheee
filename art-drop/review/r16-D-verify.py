"""Independent file, pixel, source-vote, animation and scope checks for Part D."""
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
from collections import Counter
import hashlib,json,math

ROOT=Path(__file__).resolve().parents[1];REV=ROOT/'review';OUT=ROOT/'out/weather16';REF=ROOT/'reference/r16'
M=json.loads((REV/'r16-D-measurements.json').read_text());checks=[];vote_blocks=0

def check(name,passed,details=None):
    rec={'name':name,'pass':bool(passed)}
    if details is not None:rec['details']=details
    checks.append(rec)

def equal(a,b):return a.mode==b.mode and a.size==b.size and a.tobytes()==b.tobytes()

expected={f'lightning-{i}-f{f}.png':(48,144) for i in range(3) for f in range(3)}
expected.update({f'wind-{i}-f{f}.png':(144,48) for i in range(4) for f in range(4)});expected['lightning-flash.png']=(192,192)
check('exact 26 output names',set(expected)==set(M['files']))
files={}
for name,size in expected.items():
    im=Image.open(OUT/name);files[name]=im;p=list(im.get_flattened_data());levels=sorted({v[3] for v in p})
    check(name+' dimensions/mode',im.mode=='RGBA' and im.size==size)
    check(name+' alpha',levels==([0,8,16,28,44,64,88] if name=='lightning-flash.png' else [0,255]))
    check(name+' hidden RGB zero',all(v[:3]==(0,0,0) for v in p if v[3]==0))
    check(name+' fixed palette',{v for v in p if v[3]}=={tuple(v) for v in M['files'][name]['palette']})
    check(name+' no magenta fringe',all(not(v[0]>v[1]+45 and v[2]>v[1]+45) for v in p if v[3]))
    check(name+' clear margins',not any(im.getpixel((x,y))[3] for x in range(im.width) for y in [0,im.height-1]) and not any(im.getpixel((x,y))[3] for y in range(im.height) for x in [0,im.width-1]))
    check(name+' hash',hashlib.sha256((OUT/name).read_bytes()).hexdigest()==M['files'][name]['sha256'])
    check(name+' no detached specks',min(M['files'][name]['components'])>=5)
    proof=Image.open(REV/f'r16-D-file-{name}');x,y,w,h=json.loads(proof.info['native_rect']);xx,yy,ww,hh=json.loads(proof.info['four_rect'])
    small=proof.crop((x,y,x+w,y+h));large=proof.crop((xx,yy,xx+ww,yy+hh))
    check(name+' exact 1x/4x proof',equal(small.resize((w*4,h*4),Image.Resampling.NEAREST),large))
    if name.startswith('wind'):bg=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((72,72,216,120))
    elif name=='lightning-flash.png':bg=Image.open(REF/'ref-modern-city.png').convert('RGBA').crop((48,48,240,240))
    else:bg=Image.new('RGBA',size,(38,47,64,255))
    bg.alpha_composite(im);check(name+' 1x proof matches final PNG',equal(bg.convert('RGB'),small))

for i in range(3):
    ims=[files[f'lightning-{i}-f{f}.png'] for f in range(3)]
    check(f'bolt {i} full alpha identical',ims[0].getchannel('A').tobytes()==ims[1].getchannel('A').tobytes()==ims[2].getchannel('A').tobytes())
    check(f'bolt {i} one connected channel',len(M['files'][f'lightning-{i}-f0.png']['components'])==1)
    check(f'bolt {i} every RGB channel dims strictly',all(all(a[k]>b[k]>c[k] for k in range(3)) for a,b,c in zip(*(im.get_flattened_data() for im in ims)) if a[3]))
    for f in range(3):
        master=Image.open(REV/f'r16-D-clean-{M["selected"][i]}.png');mp=list(master.get_flattened_data());pal=[tuple(v) for v in M['bolt_palettes'][0]];target=M['bolt_palettes'][f]
        expected_pixels=[tuple(target[pal.index(p[:3])])+ (255,) if p[3] else (0,0,0,0) for p in mp]
        check(f'bolt {i} f{f} exact palette transfer',list(ims[f].get_flattened_data())==expected_pixels)

for i in range(4):
    ms=[M['files'][f'wind-{i}-f{f}.png'] for f in range(4)]
    check(f'wind {i} moves east every phase',all(ms[f]['centroid'][0]<ms[f+1]['centroid'][0] for f in range(3)))
    check(f'wind {i} drawn cover tapers after peak',ms[1]['covered_pixels']>ms[2]['covered_pixels']>ms[3]['covered_pixels'])
    check(f'wind {i} brightness tapers after peak',ms[1]['mean_luma']>ms[2]['mean_luma']>ms[3]['mean_luma'])
    check(f'wind {i} peak sparse',ms[1]['cover_percent']<10)
    master=Image.open(REV/f'r16-D-clean-{M["selected"][3+i]}.png');pal=[tuple(v) for v in M['wind_palettes'][1]]
    for f in range(4):
        crop=master.crop((0,f*48,144,(f+1)*48));target=M['wind_palettes'][f]
        expected_pixels=[tuple(target[pal.index(p[:3])])+ (255,) if p[3] else (0,0,0,0) for p in crop.get_flattened_data()]
        check(f'wind {i} f{f} exact drawing and palette transfer',list(files[f'wind-{i}-f{f}.png'].get_flattened_data())==expected_pixels)

for stage in M['stages']:
    ident=stage['id'];reg=Image.open(REV/f'r16-D-registered-{ident}.png');mode=Image.open(REV/f'r16-D-mode-{ident}.png');clean=Image.open(REV/f'r16-D-clean-{ident}.png');w,h=mode.size
    rp=list(reg.get_flattened_data());mp=list(mode.get_flattened_data());cp=list(clean.get_flattened_data());replay=[]
    for y in range(h):
        for x in range(w):
            votes={}
            for dy in range(8):
                for dx in range(8):
                    pixel=rp[(y*8+dy)*w*8+x*8+dx];votes[pixel]=votes.get(pixel,0)+1
            replay.append(sorted(votes,key=lambda p:(-votes[p],p))[0])
    vote_blocks+=w*h
    check(ident+' all exact RGBA mode votes',replay==mp,{'blocks':w*h,'samples':w*h*64})
    reconstructed=mp.copy()
    for e in stage['cleanup']:
        check(ident+' cleanup source '+str(e['index']),list(reconstructed[e['index']])==e['before'])
        reconstructed[e['index']]=tuple(e['after'])
    check(ident+' exact cleanup replay',reconstructed==cp)
    for j in stage['source_supported_joins']:
        y,x=divmod(j['index'],w);samples=[rp[(y*8+dy)*w*8+x*8+dx] for dy in range(8) for dx in range(8)];opaque=[p for p in samples if p[3]]
        check(ident+' drawn support for join '+str(j['index']),len(opaque)==j['source_opaque_samples'] and len(opaque)>=8 and tuple(j['rgba']) in opaque)
    check(ident+' all alpha additions are documented drawn joins',{i for i,(a,b) in enumerate(zip(mp,cp)) if not a[3] and b[3]}<={j['index'] for j in stage['source_supported_joins']})
    check(ident+' working hard alpha and zero hidden RGB',all(p[3] in [0,255] and (p[3] or p[:3]==(0,0,0)) for p in rp+mp+cp))
    # Replay registration from the unmodified image-tool source.
    raw=Image.open(REV/stage['source']).convert('RGB');keyed=Image.new('RGBA',raw.size)
    keyed.putdata([(0,0,0,0) if r>g+45 and b>g+45 and r>135 and b>135 else (r,g,b,255) for r,g,b in raw.get_flattened_data()])
    x,y,bw,bh=stage['placement'];draft=Image.new('RGBA',(w*8,h*8));draft.paste(keyed.crop(stage['source_crop']).resize((bw*8,bh*8),Image.Resampling.BOX),(x*8,y*8))
    palette=([tuple(p) for p in M['wind_palettes'][1]] if ident.startswith('wind') else [tuple(p) for p in M['bolt_palettes'][0]] if ident.startswith('bolt') else [(v,v,v) for v in [48,85,128,174,222,252]])
    cache={};pixels=[]
    for p in draft.get_flattened_data():
        if p[3]<128:pixels.append((0,0,0,0));continue
        rgb=p[:3]
        if rgb not in cache:cache[rgb]=min(palette,key=lambda q:sum((a-b)**2 for a,b in zip(rgb,q)))
        pixels.append((*cache[rgb],255))
    check(ident+' source registration and palette replay',pixels==rp)

flash=files['lightning-flash.png'];ring_means=[]
for low,high in [(0,16),(16,32),(32,48),(48,64),(64,80),(80,96)]:
    vals=[flash.getpixel((x,y))[3] for y in range(192) for x in range(192) if low<=math.hypot(x-95.5,y-95.5)<high];ring_means.append(sum(vals)/len(vals))
check('flash radial alpha decreases outward',all(a>b for a,b in zip(ring_means,ring_means[1:])),ring_means)
check('flash one pale RGB colour',{p[:3] for p in flash.get_flattened_data() if p[3]}=={(228,234,255)})

for r in M['animations']:
    gif=Image.open(REV/r['gif']);dur=[];decoded=[]
    for f in range(gif.n_frames):gif.seek(f);dur.append(gif.info['duration']);decoded.append(gif.convert('RGB'))
    check(r['gif']+' frames/timing',gif.n_frames==len(r['phases']) and dur==r['duration_ms'])
    check(r['gif']+' repeating event',gif.info.get('loop')==0)
    strip=Image.open(REV/(Path(r['gif']).stem+'-1x.png'))
    errors=[]
    for f in range(3 if r['kind']=='bolt' else 4):
        width=288 if r['kind']=='bolt' else 192;height=288 if r['kind']=='bolt' else 96
        panel=strip.crop((f*width,24,(f+1)*width,24+height));actual=decoded[f+1 if r['kind']=='bolt' else f]
        errors.append(sum(ImageStat.Stat(ImageChops.difference(panel,actual)).mean)/3)
    check(r['gif']+' matches reviewed PNG frames',max(errors)<6,{'mean_abs_rgb_error_per_phase':errors})
    enlarged=Image.open(REV/(Path(r['gif']).stem+'-4x.png'))
    check(r['gif']+' strip exact 4x',equal(strip.resize((strip.width*4,strip.height*4),Image.Resampling.NEAREST),enlarged))

for refpath in sorted(REF.glob('ref-*.png')):
    for family in ['lightning','wind']:
        names=[n for n in M['files'] if n.startswith(family)];sheet=Image.open(REV/f'r16-D-context-{refpath.stem[4:]}-{family}-all-1x.png')
        good=True
        for i,name in enumerate(names):
            im=files[name];bg=Image.open(refpath).convert('RGBA');bg.alpha_composite(im,((288-im.width)//2,(288-im.height)//2));x=(i%4)*288;y=(i//4)*312+24
            good &= equal(bg.convert('RGB'),sheet.crop((x,y,x+288,y+288)))
        check(refpath.name+' all '+family+' placements',good,{'placements':len(names)})

small=Image.open(REV/'r16-D-overview-1x.png');big=Image.open(REV/'r16-D-overview-4x.png');check('overview exact 4x',equal(small.resize((small.width*4,small.height*4),Image.Resampling.NEAREST),big))
protected=json.loads((REV/'r16-D-protected.json').read_text());changed=[p for p,h in protected['files'].items() if not Path(p).is_file() or hashlib.sha256(Path(p).read_bytes()).hexdigest()!=h]
check('all pre-existing art files byte-identical',not changed,{'files':len(protected['files']),'changed':changed})
notes=(ROOT/'NOTES.md').read_bytes();marker=b'# Round 16 \xe2\x80\x94 Part C\n';pos=notes.find(marker)
check('earlier NOTES content byte-identical',pos>=0 and hashlib.sha256(notes[pos:]).hexdigest()==protected['notes_sha256'])
report={'passed':sum(c['pass'] for c in checks),'total':len(checks),'mode_blocks':vote_blocks,'source_samples':vote_blocks*64,'protected_files':len(protected['files']),'checks':checks}
(REV/'r16-D-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
for c in checks:
    if not c['pass']:print('FAIL',c)
raise SystemExit(0 if all(c['pass'] for c in checks) else 1)
