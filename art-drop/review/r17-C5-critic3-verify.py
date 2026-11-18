"""Focused saved-art regression checks for the actual final southern district."""
from pathlib import Path
from PIL import Image
from collections import Counter
import copy, hashlib, importlib.util, json
R=Path(__file__).resolve().parent;ROOT=R.parent.parent;O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
checks=[]
def check(name,ok,**detail):checks.append(dict(name=name,passed=bool(ok),**detail))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
before=json.loads((R/'r17-C5-critic3-before-hashes.json').read_text());critic=json.loads((R/'critic-r17C5-3.json').read_text())
protected=[]
for name,v in critic['files'].items():
    if v['status']!='pass':continue
    for p in (O/(name+'.png'),R/(name+'.png')):
        key=str(p.relative_to(ROOT))
        if key in before:protected.append(key);check(name+' passing PNG unchanged',sha(p)==before[key])
allowed={'art-drop/out/city17/compose.py','art-drop/NOTES.md'}
changed=[p for p,h in before.items() if p not in allowed and not p.startswith(('art-drop/review/r17-C5-','art-drop/review/r17-city-final')) and (not (ROOT/p).exists() or sha(ROOT/p)!=h)]
check('all prior files outside named C5 scope preserved',not changed,changed=changed)

def physical(a,b):
    # Independent interval arithmetic: no base-distance proxy or paint bounds.
    x,y,w,h=a;u,v,r,t=b
    vertical=max(0,min(y+h,v+t)-max(y,v)) if x+w==u or u+r==x else 0
    horizontal=max(0,min(x+w,u+r)-max(x,u)) if y+h==v or v+t==y else 0
    return max(vertical,horizontal)
def area(a,b):
    x,y,w,h=a;u,v,r,t=b
    return max(0,min(x+w,u+r)-max(x,u))*max(0,min(y+h,v+t)-max(y,v))
l=c.c5_city_layout();lots={b['id']:b for b in l['lots']}
pairs=[('south-L-0','south-L-1'),('south-L-1','south-L-2'),('south-L-return','south-L-3'),('south-L-3','south-L-4'),('south-L-4','south-square-west')]
for aa,bb in pairs:
    a,b=lots[aa],lots[bb];length=physical(a['footprint'],b['footprint'])
    check(aa+' / '+bb+' actual shared ground wall',length>=48,length=length,edges=c.shared_ground_edges(a,b))
    ai=c.c5_build(a['spec'])[0];bi=c.c5_build(b['spec'])[0]
    if a['x']>b['x']:a,b,ai,bi=b,a,bi,ai
    y0=max(a['footprint'][1],b['footprint'][1]);y1=min(a['base'],b['base'])
    painted=sum(ai.getpixel((ai.width-1,y-a['base']+ai.height))[3]>0 and bi.getpixel((0,y-b['base']+bi.height))[3]>0 for y in range(y0,y1))
    check(aa+' / '+bb+' wall paint fills shared edge',painted>=48,painted_contact=painted)
check('detached workshop incorporated into attached return','south-corner-workshop' not in lots and lots['south-L-2'].get('incorporated_lots')==['south-corner-workshop'])
southern=[b for b in l['lots'] if b['id'].startswith('south-L') or b['id']=='south-square-west']
overlaps=[dict(lot=b['id'],route=r['id'],area=area(b['footprint'],r['rect'])) for b in southern for r in l['roads'] if r.get('clear') and area(b['footprint'],r['rect'])]
check('southern footprints preserve public and private routes',not overlaps,overlaps=overlaps)
check('48px bent alley remains',any(r['id']=='south-L-bent-alley' and r['rect']==[480,1104,48,144] for r in l['roads']))
check('24px service passage remains',any(r['kind']=='lane' and r['rect']==[384,1104,24,144] for r in l['roads']))
check('southern yards remain',all(any(p['id']==n for p in l['plots']) for n in ['south-L-0-legal-yard','south-L-1-legal-yard']))
for a,b in [('south-L-1','south-L-2'),('south-L-return','south-L-3')]:
    bad=copy.deepcopy(lots[b]);bad['base']=1248 if b=='south-L-2' else 1344;bad['footprint'][1]=bad['base']-96
    check(a+' former corner-only connection rejected',not c.shared_ground_edges(lots[a],bad) and physical(lots[a]['footprint'],bad['footprint'])==0)
    p={'lots':[copy.deepcopy(lots[a]),bad]};c.c5_contacts(p)
    check(a+' corner-only roof receiving treatment rejected',all(not b['spec']['roof_contacts'] for b in p['lots']))
for b in l['lots']:
    for q in b['spec'].get('roof_contacts',[]):check(b['id']+' receiving wall has real ground adjacency',physical(b['footprint'],lots[q['neighbour']]['footprint'])>0)
aud=c.c4_instance_audit(l)
check('audit frontage edges all have real physical wall contact',all(c.shared_ground_edges(lots[a],lots[b]) for a,b in aud['adjacency_edges']))
check('final repetition remains within two-in-five',not aud['failures'],windows=aud['windows'])
proof=json.loads((R/'r17-C5-southern-connectivity.json').read_text())
check('ground plan uses final district footprints',all(p['footprint']==lots[p['id']]['footprint'] for p in proof['lots']) and all(e['length']>=48 for e in proof['edges']))

proc=json.loads((R/'r17-C5-critic3-processing.json').read_text());samples=0
for rec in proc['drawings']:
    reg=Image.open(R/f"r17-C5-registered-{rec['id']}.png");mode=Image.open(R/f"r17-C5-mode-{rec['id']}.png");w,h=mode.size;v=list(reg.get_flattened_data());out=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(p for yy in range(8) for p in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);out.append(min(votes,key=lambda p:(-votes[p],p)))
    samples+=w*h*64;check(rec['id']+' exact 64-vote mode and saved source',out==list(mode.get_flattened_data()) and sha(R/rec['source'])==rec['source_sha256'])
for depth in (3,4,5):
    im,owner,records=c.c5_modular_roof(depth);files=[c.asset(n) for n in records['sources']];counts=Counter(owner.get_flattened_data());mismatch=0
    for y in range(im.height):
        for x in range(144):
            k=owner.getpixel((x,y))
            if k<4:p=files[k-1].getpixel((x%48,y%48))
            else:
                sy=64+(y-48)%16 if x in (0,143) and 48<=y<im.height-48 else y if y<64 else y-im.height+144
                p=files[3].getpixel((x,sy))
            mismatch+=im.getpixel((x,y))!=p
    check(str(depth)+' cell assembly actual exported-paint provenance',mismatch==0 and all(counts[k]>600 for k in (1,2,3,4)),source_pixels=dict(counts),mismatches=mismatch)
    check(str(depth)+' cell cap/fill/ridge/end has no interior alpha gaps',all(im.getpixel((x,y))[3]==255 for y in range(48,im.height-48) for x in range(144)))
    check(str(depth)+' cell source labels match saved proof',owner.tobytes()==Image.open(R/f'r17-C5-roof-ownership-{depth}.png').tobytes())
for n in ['cap-fill-joins','cap-fill-contact-guides','southern-ground-plan','complete-cap-comparison']:
    a=Image.open(R/f'r17-C5-{n}-1x.png');b=Image.open(R/f'r17-C5-{n}-4x.png');check(n+' exact nearest4x',a.resize((a.width*4,a.height*4),Image.Resampling.NEAREST).tobytes()==b.tobytes())
for n in ['cap-to-fill','fill-to-ridge','fill-to-end','fill-repeat']:
    a=Image.open(R/f'r17-C5-roof-contact-{n}-1x.png');b=Image.open(R/f'r17-C5-roof-contact-{n}-8x.png');check(n+' exact nearest8x contact',a.resize((a.width*8,a.height*8),Image.Resampling.NEAREST).tobytes()==b.tobytes())
general=json.loads((R/'r17-C5-verification.json').read_text())
check('general exports routes thresholds repetition and final derivatives pass',general['failed']==0,suite_passed=general['passed'])
comparison=Image.open(R/'r17-city-final-vs-r15-vs-today.png');x=16
for path in [R.parent/'reference/r17/current-town.png',R/'r15-city-mockup.png',R/'r17-city-final.png']:
    a=Image.open(path).convert('RGBA');check(path.stem+' comparison literal1x',comparison.crop((x,32,x+a.width,32+a.height)).tobytes()==a.tobytes());x+=a.width+16
result=dict(passed=sum(q['passed'] for q in checks),failed=sum(not q['passed'] for q in checks),passing_pngs_preserved=len(protected),new_production_pngs=4,source_drawings=2,mode_samples=samples,checks=checks)
(R/'r17-C5-critic3-verification.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
for q in checks:
    if not q['passed']:print(json.dumps(q))
if result['failed']:raise SystemExit(1)
