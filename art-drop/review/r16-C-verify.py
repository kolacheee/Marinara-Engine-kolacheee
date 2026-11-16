"""Independent saved-file audit for Round 16 C. Requires only Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw
from collections import Counter
import json, hashlib, sys

ROOT=Path(__file__).resolve().parents[1]
REV=ROOT/'review';OUT=ROOT/'out/weather16';REF=ROOT/'reference/r16'
NN=Image.Resampling.NEAREST
M=json.loads((REV/'r16-C-measurements.json').read_text())
checks=[]

def check(name,passed,detail=None):
    row={'check':name,'passed':bool(passed)}
    if detail is not None:row['detail']=detail
    checks.append(row)

def same(a,b):return a.mode==b.mode and a.size==b.size and a.tobytes()==b.tobytes()
def pixels(im):return list(im.get_flattened_data())
def read(p):return Image.open(p).convert('RGBA')
def comps(im,colour=None):
    w,h=im.size;ps=pixels(im);remaining={i for i,p in enumerate(ps) if p[3] and (colour is None or p[:3]==colour)};sizes=[]
    while remaining:
        start=remaining.pop();todo=[start];n=0
        while todo:
            p=todo.pop();n+=1;y,x=divmod(p,w)
            for dy in (-1,0,1):
                for dx in (-1,0,1):
                    xx,yy=x+dx,y+dy;q=yy*w+xx
                    if 0<=xx<w and 0<=yy<h and q in remaining:remaining.remove(q);todo.append(q)
        sizes.append(n)
    return sorted(sizes,reverse=True)

def audit_sources():
    total=0;pal=[tuple(p) for p in M['light_palette']]
    for rec in M['stages']:
        ident=rec['id'];w,h=rec['native_size'];reg=read(REV/f'r16-C-registered-{ident}.png');mode=read(REV/f'r16-C-mode-{ident}.png');clean=read(REV/f'r16-C-clean-{ident}.png')
        raw=Image.open(REV/rec['source']).convert('RGB');key=Image.new('RGBA',raw.size)
        key.putdata([(0,0,0,0) if r>g+45 and b>g+45 and r>135 and b>135 else (r,g,b,255) for r,g,b in pixels(raw)])
        check(f'{ident}: source crop',list(key.getbbox())==rec['source_crop'])
        x,y,r,b=rec['registered_paint_bounds'];replay=Image.new('RGBA',(w*8,h*8))
        replay.paste(key.crop(tuple(rec['source_crop'])).resize(((r-x)*8,(b-y)*8),Image.Resampling.BOX),(x*8,y*8))
        lookup={};locked=[]
        for sample in pixels(replay):
            if sample[3]<128:locked.append((0,0,0,0));continue
            rgb=sample[:3]
            if rgb not in lookup:lookup[rgb]=min(pal,key=lambda c:sum((v-q)**2 for v,q in zip(rgb,c)))
            locked.append((*lookup[rgb],255))
        replay.putdata(locked);check(f'{ident}: source registration and palette replay',same(reg,replay))
        rp=pixels(reg);voted=[]
        for yy in range(h):
            for xx in range(w):
                votes=[]
                for sy in range(8):votes.extend(rp[(yy*8+sy)*w*8+xx*8:(yy*8+sy)*w*8+xx*8+8])
                count=Counter(votes);voted.append(sorted(count,key=lambda p:(-count[p],p))[0])
        check(f'{ident}: exact 64-sample RGBA mode',voted==pixels(mode),{'blocks':w*h,'samples':w*h*64});total+=w*h
        for edit in rec['cleanup']:
            p=edit['index'];assert list(voted[p])==edit['before'];voted[p]=tuple(edit['after'])
        check(f'{ident}: cleanup replay',voted==pixels(clean))
        for stage,im in [('registered',reg),('mode',mode),('clean',clean)]:
            ps=pixels(im);check(f'{ident} {stage}: hard working alpha',set(p[3] for p in ps)<={0,255});check(f'{ident} {stage}: zero hidden RGB',all(p[:3]==(0,0,0) for p in ps if not p[3]))
        check(f'{ident}: component measurements',comps(clean)==rec['components'])
    return total

def audit_files():
    check('18 requested outputs',len(M['files'])==18)
    for name,rec in M['files'].items():
        im=read(OUT/name);ps=pixels(im);visible=[p for p in ps if p[3]];w,h=im.size
        check(name+': dimensions',list(im.size)==rec['size'])
        check(name+': exact 0/192 alpha',set(p[3] for p in ps)=={0,192})
        check(name+': zero hidden RGB',all(p[:3]==(0,0,0) for p in ps if not p[3]))
        kind=name.split('-')[1];allowed=M['light_palette'] if kind=='light' else M['dark_palette'] if kind=='dark' else [M['shadow_colour']]
        check(name+': fixed palette',all(list(p[:3]) in allowed for p in visible))
        check(name+': no magenta',all(not(p[0]>p[1]+45 and p[2]>p[1]+45 and p[0]>135 and p[2]>135) for p in visible))
        check(name+': count and bounds',len(visible)==rec['covered_pixels'] and list(im.getbbox())==rec['bounds'])
        check(name+': coverage measurement',round(100*len(visible)/(w*h),4)==rec['coverage_percent'])
        check(name+': alpha-weighted measurement',round(100*sum(p[3] for p in ps)/(255*w*h),4)==rec['alpha_weighted_cover_percent'])
        check(name+': no detached specks',min(comps(im))>=3)
        if kind!='shadow':check(name+': no isolated colour grains',all(min(comps(im,tuple(c)) or [3])>=3 for c in allowed))
        x,y,r,b=im.getbbox();check(name+': clear margin',min(x,y,w-r,h-b)>=4)
        check(name+': SHA-256',hashlib.sha256((OUT/name).read_bytes()).hexdigest()==rec['sha256'])
        sheet=Image.open(REV/f'r16-C-file-{name}');small=json.loads(sheet.info['native_rect']);large=json.loads(sheet.info['four_rect'])
        bg=Image.new('RGBA',im.size,(171,183,177,255) if kind=='shadow' else (63,78,78,255));bg.alpha_composite(im);bg=bg.convert('RGB')
        for label,rect,expected in [('1x',small,bg),('4x',large,bg.resize((w*4,h*4),NN))]:
            x,y,ww,hh=rect;check(name+': review '+label,same(sheet.crop((x,y,x+ww,y+hh)),expected))
    pal=[tuple(c) for c in M['light_palette']];dp=[tuple(c) for c in M['dark_palette']]
    for i,ident in enumerate(M['selected']):
        light=read(OUT/f'cloud-light-{i}.png');dark=read(OUT/f'cloud-dark-{i}.png');shadow=read(OUT/f'cloud-shadow-{i}.png');clean=read(REV/f'r16-C-clean-{ident}.png')
        check(f'{i}: full alpha byte equality in all three files',light.getchannel('A').tobytes()==dark.getchannel('A').tobytes()==shadow.getchannel('A').tobytes())
        check(f'{i}: source silhouette equality',light.getchannel('A').point(lambda a:255 if a else 0).tobytes()==clean.getchannel('A').tobytes())
        check(f'{i}: light paint replay',pixels(light)==[(*p[:3],192) if p[3] else p for p in pixels(clean)])
        check(f'{i}: storm LUT replay',pixels(dark)==[(*dp[pal.index(p[:3])],192) if p[3] else p for p in pixels(light)])
        check(f'{i}: shadow is exactly one flat colour',len({p for p in pixels(shadow) if p[3]})==1)
    hashes=[hashlib.sha256(read(OUT/f'cloud-light-{i}.png').getchannel('A').tobytes()).hexdigest() for i in range(6)]
    check('all six silhouettes distinct',len(set(hashes))==6)

def audit_reviews():
    for label,rec in M['sky_reviews'].items():
        town,kind=label.split('-');base=read(REF/rec['reference']).crop(tuple(rec['crop']));sky=base.copy();mask=Image.new('RGBA',base.size)
        check(label+': 12 clouds',rec['clouds']==len(rec['placements'])==12)
        check(label+': native reference crop',same(base.convert('RGB'),Image.open(REV/f'r16-C-sky-{town}-base.png')))
        for idx,x,y in rec['placements']:
            sh=read(OUT/f'cloud-shadow-{idx}.png');sh.putalpha(sh.getchannel('A').point(lambda a:rec['shadow_preview_alpha'] if a else 0));dx,dy=rec['shadow_offset'];sky.alpha_composite(sh,(x+dx,y+dy))
        for n,(idx,x,y) in enumerate(rec['placements']):
            ck=kind if kind!='mixed' else ('dark' if n in [3,5,7,10] else 'light');im=read(OUT/f'cloud-{ck}-{idx}.png');sky.alpha_composite(im,(x,y));mask.alpha_composite(im,(x,y))
        sky=sky.convert('RGB');saved=Image.open(REV/f'r16-C-sky-{label}-1x.png')
        check(label+': native composite replay',same(sky,saved))
        a=pixels(mask.getchannel('A'));check(label+': sky coverage',round(100*sum(v>0 for v in a)/len(a),4)==rec['coverage_percent'])
        for scale in [3,4]:check(label+f': exact nearest-neighbour {scale}x',same(saved.resize((saved.width*scale,saved.height*scale),NN),Image.open(REV/f'r16-C-sky-{label}-{scale}x.png')))
    for rp in sorted(REF.glob('ref-*.png')):
        sheet=Image.open(REV/f'r16-C-context-{rp.stem[4:]}-1x.png');ref=read(rp)
        for row,kind in enumerate(['light','dark']):
            for idx in range(6):
                cloud=read(OUT/f'cloud-{kind}-{idx}.png');sha=read(OUT/f'cloud-shadow-{idx}.png');sha.putalpha(sha.getchannel('A').point(lambda a:56 if a else 0));x=(288-cloud.width)//2;y=(288-cloud.height)//2
                expected=ref.copy();expected.alpha_composite(sha,(x+18,y+14));expected.alpha_composite(cloud,(x,y))
                check(f'{rp.stem} {kind}-{idx}: exact context',same(sheet.crop((idx*288,row*314+26,(idx+1)*288,row*314+314)),expected.convert('RGB')))
    overview=Image.open(REV/'r16-C-overview-1x.png');check('overview exact 4x',same(overview.resize((overview.width*4,overview.height*4),NN),Image.open(REV/'r16-C-overview-4x.png')))

def audit_scope():
    baseline=json.loads((REV/'r16-C-baseline.json').read_text());unchanged=[];changed=[]
    checkout=ROOT.parent
    for name,expected in baseline.items():
        if name=='art-drop/NOTES.md':continue
        p=checkout/name
        (unchanged if p.exists() and hashlib.sha256(p.read_bytes()).hexdigest()==expected else changed).append(name)
    check('all pre-existing art and reviews unchanged',not changed,{'unchanged':len(unchanged),'changed':changed})
    notes=(ROOT/'NOTES.md').read_bytes();old=notes
    if notes.startswith(b'# Round 16') and notes.splitlines()[0].decode()=='# Round 16 — Part C':old=notes.split(b'\n---\n\n',1)[1]
    check('earlier NOTES content preserved',hashlib.sha256(old).hexdigest()==baseline['art-drop/NOTES.md'])
    allowed=set('art-drop/out/weather16/'+p for p in M['files']);bad=[]
    for p in ROOT.rglob('*'):
        if not p.is_file():continue
        name=str(p.relative_to(checkout))
        if name not in baseline and name not in allowed and not (p.parent==REV and p.name.startswith('r16-C-')):bad.append(name)
    check('new files limited to Part C outputs and review prefix',not bad,bad)
    return len(unchanged)

blocks=audit_sources();audit_files();audit_reviews();unchanged=audit_scope()
failed=[c for c in checks if not c['passed']]
report={'passed':len(checks)-len(failed),'total':len(checks),'failed':failed,'mode_blocks':blocks,'mode_samples':blocks*64,'unchanged_preexisting_files':unchanged,'checks':checks}
(REV/'r16-C-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
sys.exit(bool(failed))
