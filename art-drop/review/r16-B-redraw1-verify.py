"""Independent native-mode replay, output and review validation for the redraw."""
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
from collections import Counter
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('repair',R/'r16-B-redraw1-build.py');b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
m=json.loads((R/'r16-B-measurements.json').read_text());before=json.loads((R/'r16-B-redraw1-before.json').read_text());checks=[]
def check(name,ok):
    checks.append({'check':name,'pass':bool(ok)})
    if not ok:print('FAIL',name,flush=True)
def equal(a,c):return a.mode==c.mode and a.size==c.size and a.tobytes()==c.tobytes()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
mode_blocks=0;cleanup=0;contours=0;parts=[]
for v,recs in m['drawings'].items():
    for i,rec in enumerate(recs):
        stem=f'redraw1-fog-{v}-{i}'
        reg=Image.open(R/f'r16-B-registered-{stem}.png');mode=Image.open(R/f'r16-B-mode-{stem}.png')
        clean=Image.open(R/f'r16-B-clean-{stem}.png');contour=Image.open(R/f'r16-B-contour-{stem}.png')
        w,h=mode.size;rp=list(reg.getdata());expected=[]
        for y in range(h):
            for x in range(w):
                votes=Counter(rp[(y*8+sy)*w*8+x*8+sx] for sy in range(8) for sx in range(8))
                expected.append(min(votes,key=lambda p:(-votes[p],p)))
        check(stem+' every 64-sample mode',expected==list(mode.getdata()));mode_blocks+=w*h
        check(stem+' binary working alpha',set(reg.getchannel('A').getdata())<={0,255})
        for j in rec['removed']:expected[j]=(0,0,0,0)
        check(stem+' cleanup replay',expected==list(clean.getdata()));cleanup+=len(rec['removed'])
        for j in rec['contour_recolours']:expected[j]=(*b.PAL[1],255)
        check(stem+' one-pixel contour replay',expected==list(contour.getdata()));contours+=len(rec['contour_recolours'])
        check(stem+' contour preserves silhouette',equal(clean.getchannel('A'),contour.getchannel('A')))
        parts.append(b.ids_from(contour))
frames={f:[Image.open(b.OUT/f'{f}-f{i}.png').convert('RGBA') for i in range(4)] for f in ['fog','heat_wave']}
hashes={}
for family,ff in frames.items():
    for f,im in enumerate(ff):
        name=f'{family}-f{f}.png';hashes[name]=sha(b.OUT/name)
        check(name+' RGBA 192 square',Image.open(b.OUT/name).mode=='RGBA' and im.size==(192,192))
        check(name+' cover and measurements',b.stats(im)==m['files'][name])
        stats=b.stats(im);check(name+' requested cover',35<=stats['cover_percent']<=55 if family=='fog' else 0<stats['cover_percent']<=10)
        alphas={0,24,48,80,112} if family=='fog' else {0,24,40,56}
        check(name+' fixed alpha levels',set(stats['alpha_levels'])<=alphas)
        check(name+' zero hidden RGB',all(p[:3]==(0,0,0) for p in im.getdata() if not p[3]))
        check(name+' no detached one/two pixel specks',not b.components(im.getchannel('A'),3,True)[1])
        if family=='fog':
            ids=b.render(parts,m['instances'],f)
            check(name+' matches image-drawn placements',equal(im,b.rgba(ids)))
            check(name+' independent unwrapped 3x3 equals literal repeat',equal(b.repeat(im,(576,576)),b.rgba(b.render(parts,m['instances'],f,576,True))))
        else:check(name+' passing asset byte-identical',hashes[name]==before[str(b.OUT/name).split(str(b.ROOT.parent)+'/')[-1]])
    check(family+' four distinct frames',len({im.tobytes() for im in ff})==4)
    deltas=[x['alpha_mean_absolute_delta'] for x in m['motion'][family]]
    check(family+' all transitions small including f3-f0',max(deltas)<3)
    check(family+' wrap transition comparable to interior steps',max(deltas)/min(deltas)<1.25)
check('fog fifth state equals first',equal(frames['fog'][0],b.rgba(b.render(parts,m['instances'],4))))
check('25 distinct source drawings used once each',len({it['part'] for it in m['instances']})==25)
for it in m['instances']:
    if it['moving']:
        for f in range(4):
            p=b.MOTION[(f+it['phase'])%4];q=b.MOTION[(f+1+it['phase'])%4]
            check(f'donor {it["part"]} phase {f} one-pixel advance',abs(p[0]-q[0])+abs(p[1]-q[1])==1)
edges,removed=b.edges_from(frames['fog'][0])
for k,edge in edges.items():
    name=f'fog-edge-{k}.png';delivered=Image.open(b.OUT/name);hashes[name]=sha(b.OUT/name)
    check(name+' drawn-cap continuation replay',equal(edge,delivered))
    check(name+' correct size',edge.size==((192,48) if k in 'ns' else (48,192)))
    outer={'n':(0,0,192,1),'s':(0,47,192,48),'e':(47,0,48,192),'w':(0,0,1,192)}[k]
    inner={'n':(0,45,192,48),'s':(0,0,192,3),'e':(0,0,3,192),'w':(45,0,48,192)}[k]
    continuation={'n':(0,189,192,192),'s':(0,0,192,3),'e':(0,0,3,192),'w':(189,0,192,192)}[k]
    check(name+' outermost edge clear',not edge.crop(outer).getbbox())
    check(name+' no detached one/two pixel specks',not b.components(edge.getchannel('A'),3,True)[1])
    check(name+' zero hidden RGB',all(p[:3]==(0,0,0) for p in edge.getdata() if not p[3]))
    for f,field in enumerate(frames['fog']):check(name+f' exact 3-pixel join f{f}',equal(edge.crop(inner),field.crop(continuation)))
    check(name+' measurements',b.stats(edge)==m['files'][name])
refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(b.REF.glob('ref-*.png'))}
proofs=0
for family,ff in frames.items():
    for f,im in enumerate(ff):
        for name,ref in refs.items():
            expected=b.composite(b.repeat(ref,(576,576)),b.repeat(im,(576,576)))
            for scale in (1,3,4):
                path=R/f'r16-B-repeat-{family}-f{f}-{name}-{scale}x.png'
                check(path.name+' exact repeat / nearest enlargement',equal(Image.open(path),expected.resize((576*scale,576*scale),b.NN)));proofs+=1
        ref=refs['fantasy-town' if family=='fog' else 'desert-sand'].crop((0,0,192,192))
        expected=b.composite(ref,im);sheet=Image.open(R/f'r16-B-file-{family}-f{f}.png')
        check(f'{family} {f} native review',equal(sheet.crop((12,32,204,224)),expected))
        check(f'{family} {f} 4x review',equal(sheet.crop((220,32,988,800)),expected.resize((768,768),b.NN)))
for k,im in edges.items():
    w,h=im.size;expected=b.composite(refs['fantasy-grass'].crop((0,0,w,h)),im);sheet=Image.open(R/f'r16-B-file-fog-edge-{k}.png')
    check(f'edge {k} native review',equal(sheet.crop((12,32,12+w,32+h)),expected))
    check(f'edge {k} 4x review',equal(sheet.crop((w+28,32,w*5+28,h*4+32)),expected.resize((w*4,h*4),b.NN)))
areas=[b.area_overlay(f,edges) for f in frames['fog']]
for f,a in enumerate(areas):
    check(f'area {f} exact 2x2 core',equal(a.crop((96,96,480,480)),b.repeat(frames['fog'][f],(384,384))))
    check(f'area {f} clear margin',all(not a.crop(box).getbbox() for box in [(0,0,576,48),(0,528,576,576),(0,0,48,576),(528,0,576,576)]))
for name,ref in refs.items():
    expected=b.composite(b.repeat(ref,(576,576)),areas[0])
    for scale in (1,4):check(f'area {name} {scale}x exact',equal(Image.open(R/f'r16-B-fog-area-{name}-{scale}x.png'),expected.resize((576*scale,576*scale),b.NN)))
for family,ff in frames.items():
    source=b.gif_panels(ff,family,refs);pal=source[0].quantize(256,method=Image.Quantize.MEDIANCUT);gif=Image.open(R/f'r16-B-{family}.gif')
    check(family+' GIF four phases and infinite loop',gif.n_frames==4 and gif.info['loop']==0)
    for f in range(4):
        gif.seek(f);expected=source[f].quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
        check(family+f' GIF f{f} matches PNG composites',equal(gif.convert('RGB'),expected))
        check(family+f' GIF f{f} duration 360ms',gif.info['duration']==360)
source=[b.composite(b.repeat(refs['fantasy-town'],(576,576)),a) for a in areas]
pal=source[0].quantize(256,method=Image.Quantize.MEDIANCUT);gif=Image.open(R/'r16-B-fog-area.gif')
check('area GIF four phases and infinite loop',gif.n_frames==4 and gif.info['loop']==0)
for f in range(4):
    gif.seek(f);check(f'area GIF f{f} exact PNG composite',equal(gif.convert('RGB'),source[f].quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')))
    check(f'area GIF f{f} duration',gif.info['duration']==360)
allowed={f'art-drop/out/weather16/fog-f{i}.png' for i in range(4)}|{f'art-drop/out/weather16/fog-edge-{k}.png' for k in 'nsew'}|{'art-drop/NOTES.md'}
protected={p:h for p,h in before.items() if p not in allowed and not p.startswith('art-drop/review/r16-B-')}
changed=[p for p,h in protected.items() if not (b.ROOT.parent/p).exists() or sha(b.ROOT.parent/p)!=h]
check('all other art, reference and critic files byte-identical',not changed)
for k in 'nsew':
    p=f'art-drop/review/r16-B-cap-{k}.png';check(f'{k} original drawn feather cap byte-identical',sha(b.ROOT.parent/p)==before[p])
# Inspection panels retain all four literal native repeat fields and every junction at 3x.
for name in refs:
    panel=Image.new('RGB',(1152,1200),(28,32,38));d=ImageDraw.Draw(panel)
    joins=Image.new('RGB',(1152,612),(28,32,38));jd=ImageDraw.Draw(joins)
    for f in range(4):
        im=Image.open(R/f'r16-B-repeat-fog-f{f}-{name}-1x.png');x=f%2*576;y=f//2*600
        panel.paste(im,(x,y+24));d.text((x+6,y+6),f'{name} / f{f} / native 3x3 repeat',fill='white')
        for j,(cx,cy) in enumerate([(192,192),(384,192),(192,384),(384,384)]):
            crop=im.crop((cx-24,cy-24,cx+24,cy+24)).resize((144,144),b.NN)
            xx=f*288+(j%2)*144;yy=24+(j//2)*288
            joins.paste(crop,(xx,yy));jd.text((f*288+5,5),f'f{f} joins / 3x',fill='white')
    panel.save(R/f'r16-B-redraw1-inspect-{name}.png');joins.save(R/f'r16-B-redraw1-junctions-{name}.png')
result=dict(passed=all(x['pass'] for x in checks),checks_passed=sum(x['pass'] for x in checks),checks_total=len(checks),native_mode_blocks=mode_blocks,mode_samples=mode_blocks*64,removed_donor_pixels=cleanup,one_pixel_contour_recolours=contours,removed_edge_pixels={k:len(v) for k,v in removed.items()},repeat_proofs=proofs,protected_files=len(protected),changed_protected_files=changed,final_sha256=hashes,checks=checks,playback='Exported GIF frames, timing and continuity verified; live perceived playback and in-engine playback not tested.')
for filename in ['r16-B-redraw1-validation.json','r16-B-validation.json']:(R/filename).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['checks','final_sha256']},indent=2))
if not result['passed']:raise SystemExit(1)
