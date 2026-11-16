"""Independent source modes, repair provenance, protected assets and review replay."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
from collections import Counter
import importlib.util, json, hashlib, sys
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('repair',R/'r16-B-redraw3-build.py');r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
b=r.b
m=json.loads((R/'r16-B-measurements.json').read_text());before=json.loads((R/'r16-B-redraw3-before.json').read_text());checks=[]
def check(name,ok):
    checks.append({'check':name,'pass':bool(ok)})
    if not ok:print('FAIL',name,flush=True)
def equal(a,c):return a.mode==c.mode and a.size==c.size and a.tobytes()==c.tobytes()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
mode_blocks=0
records=json.loads((R/'r16-B-redraw3-candidates.json').read_text())
for v in 'abc':
    rec=records[v]['drawing'];stem=f'redraw3-fog-{v}'
    reg=Image.open(R/f'r16-B-registered-{stem}.png');mode=Image.open(R/f'r16-B-mode-{stem}.png');rp=list(reg.getdata());expected=[]
    for y in range(192):
        for x in range(192):
            votes=Counter(rp[(y*8+sy)*1536+x*8+sx] for sy in range(8) for sx in range(8))
            expected.append(min(votes,key=lambda p:(-votes[p],p)))
    check(stem+' every 64-sample native mode',expected==list(mode.getdata()));mode_blocks+=36864
    check(stem+' binary working alpha',set(reg.getchannel('A').getdata())<={0,255})
    for j in rec['removed']:expected[j]=(0,0,0,0)
    check(stem+' source component cleanup replay',expected==list(Image.open(R/f'r16-B-clean-{stem}.png').getdata()))
    for j in rec['contour_recolours']:expected[j]=(*r.PAL[1],255)
    check(stem+' one-pixel contour replay',expected==list(Image.open(R/f'r16-B-contour-{stem}.png').getdata()))
frames={family:[Image.open(b.OUT/f'{family}-f{f}.png').convert('RGBA') for f in range(4)] for family in ['fog','heat_wave']}
hashes={};new=Image.open(R/'r16-B-contour-redraw3-fog-b.png');mask=Image.open(R/'r16-B-redraw3-mask-b.png');newdata=list(new.getdata());maskdata=list(mask.getdata())
newweather=[(*p[:3],r.ALPHA[r.PAL.index(p[:3])]) if p[3] else (0,0,0,0) for p in newdata]
for family,ff in frames.items():
    for f,im in enumerate(ff):
        name=f'{family}-f{f}.png';hashes[name]=sha(b.OUT/name)
        check(name+' RGBA / correct size',Image.open(b.OUT/name).mode=='RGBA' and im.size==(192,192))
        stats=b.stats(im);check(name+' measured cover',stats==m['files'][name])
        check(name+' cover limit',35<=stats['cover_percent']<=55 if family=='fog' else 0<stats['cover_percent']<=10)
        check(name+' fixed alpha',set(stats['alpha_levels'])<=({0,24,48,80} if family=='fog' else {0,24,40,56}))
        check(name+' zero hidden RGB',all(p[:3]==(0,0,0) for p in im.getdata() if not p[3]))
        if family=='fog':check(name+' no isolated specks or vertical hairlines',not r.cleanup(im.getchannel('A'),True)[1])
        else:check(name+' existing heat-stroke component floor preserved',not b.components(im.getchannel('A'),3,True)[1])
        if family=='fog':
            old=Image.open(R/f'r16-B-redraw3-original-fog-f{f}.png');data=list(old.getdata());expected=[newweather[i] if maskdata[i] else p for i,p in enumerate(data)]
            for i in m['selected']['cleanup_removed'][f]:expected[i]=(0,0,0,0)
            check(name+' every final pixel comes from old or new drawing',expected==list(im.getdata()))
            for side,box in [('n',(0,0,192,3)),('s',(0,189,192,192)),('e',(189,0,192,192)),('w',(0,0,3,192))]:check(name+' unchanged seam '+side,equal(im.crop(box),old.crop(box)))
            beforedelta=ImageChops.difference(old,Image.open(R/f'r16-B-redraw3-original-fog-f{(f+1)%4}.png'))
            check(name+' original small transition preserved including closing step',equal(ImageChops.difference(im,ff[(f+1)%4]),beforedelta))
        else:check(name+' passing PNG byte-identical',hashes[name]==before[f'art-drop/out/weather16/{name}'])
    check(family+' four distinct frames',len({im.tobytes() for im in ff})==4)
    deltas=[v['alpha_mean_absolute_delta'] for v in m['motion'][family]]
    check(family+' small comparable adjacent / closing steps',max(deltas)<3 and max(deltas)/min(deltas)<1.25)
edges={k:Image.open(b.OUT/f'fog-edge-{k}.png').convert('RGBA') for k in 'nsew'}
for k,edge in edges.items():
    name=f'fog-edge-{k}.png';hashes[name]=sha(b.OUT/name)
    check(name+' correct size / RGBA',Image.open(b.OUT/name).mode=='RGBA' and edge.size==((192,48) if k in 'ns' else (48,192)))
    check(name+' fixed alpha',set(edge.getchannel('A').getdata())<={0,24,48,80})
    check(name+' zero hidden RGB',all(p[:3]==(0,0,0) for p in edge.getdata() if not p[3]))
    check(name+' no isolated specks or vertical hairlines',not r.cleanup(edge.getchannel('A'),True)[1])
    check(name+' measured cover',b.stats(edge)==m['files'][name])
    old=Image.open(R/f'r16-B-redraw3-original-fog-edge-{k}.png').convert('RGBA')
    if k in 'sw':check(name+' passing PNG byte-identical',hashes[name]==before[f'art-drop/out/weather16/{name}'])
    else:
        for x,y in m['edge_cleanup_coordinates'][k]:old.putpixel((x,y),(0,0,0,0))
        check(name+' exactly critic-listed pixels removed',equal(old,edge))
    outer={'n':(0,0,192,1),'s':(0,47,192,48),'e':(47,0,48,192),'w':(0,0,1,192)}[k]
    inner={'n':(0,45,192,48),'s':(0,0,192,3),'e':(0,0,3,192),'w':(45,0,48,192)}[k]
    continuation={'n':(0,189,192,192),'s':(0,0,192,3),'e':(0,0,3,192),'w':(189,0,192,192)}[k]
    check(name+' clear outer edge',not edge.crop(outer).getbbox())
    for f,field in enumerate(frames['fog']):check(name+f' exact inner-three continuation f{f}',equal(edge.crop(inner),field.crop(continuation)))
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

allowed={f'art-drop/out/weather16/fog-f{i}.png' for i in range(4)}|{'art-drop/out/weather16/fog-edge-n.png','art-drop/out/weather16/fog-edge-e.png','art-drop/NOTES.md'}
protected={p:h for p,h in before.items() if p not in allowed and not p.startswith('art-drop/review/r16-B-')}
changed=[p for p,h in protected.items() if not (b.ROOT.parent/p).exists() or sha(b.ROOT.parent/p)!=h]
check('every protected art/reference/critic file byte-identical',not changed)
for k in 'nsew':check(k+' original drawn feather cap byte-identical',sha(R/f'r16-B-cap-{k}.png')==before[f'art-drop/review/r16-B-cap-{k}.png'])
# Historical source, processing and independent critic evidence stays intact.
historical=[p for p in before if p.startswith('art-drop/review/r16-B-') and any(s in p for s in ['source-','registered-','mode-','clean-','contour-','redraw1-','redraw2-'])]
check('historical generation and processing evidence unchanged',all(sha(b.ROOT.parent/p)==before[p] for p in historical))
result=dict(passed=all(x['pass'] for x in checks),checks_passed=sum(x['pass'] for x in checks),checks_total=len(checks),native_mode_blocks=mode_blocks,mode_samples=mode_blocks*64,repeat_proofs=proofs,protected_files=len(protected),changed_protected_files=changed,final_sha256=hashes,checks=checks,playback='GIF decoded states, exact PNG correspondence and timing verified; perceived real-time motion and in-engine playback not observed.')
for filename in ['r16-B-redraw3-validation.json','r16-B-validation.json']:(R/filename).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['checks','final_sha256']},indent=2))
if not result['passed']:raise SystemExit(1)
