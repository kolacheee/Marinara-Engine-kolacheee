"""Saved-pixel, source replay and scoped compositor regression checks."""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json, re
from PIL import Image

REV=Path(__file__).resolve().parent;ART=REV.parent;OUT=ART/'out/city17'
def module(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
city=module('city_b_repair',OUT/'compose.py');p=module('pixel_b_repair',REV/'r17-B-process.py')
def image(path):return Image.open(path).convert('RGBA')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
checks=[]
def check(condition,label):checks.append({'pass':bool(condition),'check':label})
before=json.loads((REV/'r17-B-critic1-before-hashes.json').read_text())
critic=json.loads((REV/'critic-r17B-1.json').read_text())
index=json.loads((REV/'r17-B-files.json').read_text())
allowed=set(p.PAL+sum(p.RAMPS,[])+[(30,30,30),(27,32,39),(38,31,23)])
failed_pngs={n+'.png' for n in critic['failed'] if n!='compose.py'}
check(len(index)==137,'complete Part B inventory: 137 PNGs')
for name,r in index.items():
    a=image(OUT/name);px=list(a.get_flattened_data());shadow=name.startswith('shadow-')
    check(a.size==tuple(r['size']),name+' reviewed dimensions')
    check(all(v[3] in ((0,112) if shadow else (0,255)) for v in px),name+' required alpha')
    check(all(v[3] or v[:3]==(0,0,0) for v in px),name+' zero hidden RGB')
    check(all(v[:3] in allowed for v in px if v[3]),name+' palette')
    check(hashlib.sha256(a.tobytes()).hexdigest()==r['pixels_sha256'],name+' reviewed pixels')
    if name not in failed_pngs:
        check(sha(OUT/name)==before['art-drop/out/city17/'+name],name+' passing file byte-identical')
    else:check(sha(OUT/name)!=before['art-drop/out/city17/'+name],name+' failed file replaced')
    if name.startswith(('roof-','firewall-')):check(a.getchannel('A').getextrema()==(255,255),name+' opaque roof footprint')
    if re.match(r'roof-(gable|ridge|hip|flat)-w[123]',name):
        check(a.height in (96,144),name+' whole two/three-cell depth')
        check(a.crop((0,a.height-1,a.width,a.height)).tobytes()==p.course(a.width).tobytes(),name+' contact course')
    proof=Image.open(REV/r['proof']);pw,ph=json.loads(proof.info['PairSize']);q1,q4=json.loads(proof.info['PairOrigins'])
    native=proof.crop((q1[0],q1[1],q1[0]+pw,q1[1]+ph));large=proof.crop((q4[0],q4[1],q4[0]+pw*4,q4[1]+ph*4))
    check(native.resize(large.size,Image.Resampling.NEAREST).tobytes()==large.tobytes(),name+' exact 1x/4x reference proof')
    if '-c' in name:
        base=re.sub(r'-c[012](?=\.png$)','',name);c=int(name[-5])
        check(a.getchannel('A').tobytes()==image(OUT/base).getchannel('A').tobytes(),name+' colourway silhouette')
        check(a.tobytes()==p.colour(image(OUT/base),c).tobytes(),name+' colourway remap')

blocks=0;edits=0
for r in json.loads((REV/'r17-B-critic1-processing.json').read_text()):
    w,h=r['size'];reg=image(REV/f"r17-B-registered-{r['id']}.png");vals=list(reg.get_flattened_data());voted=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(v for dy in range(8) for v in vals[(y*8+dy)*w*8+x*8:(y*8+dy)*w*8+x*8+8])
            voted.append(min(votes,key=lambda v:(-votes[v],v)))
    mode=image(REV/f"r17-B-mode-{r['id']}.png")
    check(voted==list(mode.get_flattened_data()),r['id']+' exact 64-sample mode')
    replay=voted[:]
    for x,y,old,new in r['cleanup']:
        check(replay[y*w+x]==tuple(old),r['id']+f' source-supported edit {x},{y}')
        replay[y*w+x]=tuple(new)
    check(replay==list(image(REV/f"r17-B-clean-{r['id']}.png").get_flattened_data()),r['id']+' complete processing replay')
    blocks+=w*h;edits+=len(r['cleanup'])

for c in range(3):
    fill=image(OUT/f'roof-fill-w1-c{c}.png')
    check(fill.crop((0,0,16,16)).tobytes()!=fill.crop((16,16,32,32)).tobytes(),f'fill c{c}: not a repeated 16x16 stamp')
    check(city.repeat(fill,(144,144)).tobytes()==image(REV/f'r17-B-repeat-roof-fill-w1-c{c}-1x.png').tobytes(),f'fill c{c}: literal 3x3')
    for w in (2,3):
        a=image(OUT/f'shadow-street-w{w}-c{c}.png')
        check(a.crop((8,0,a.width,32)).getchannel('A').getextrema()==(112,112),f'w{w} c{c}: continuous full-depth street shadow')
    check(image(OUT/f'roof-hip-end-c{c}.png').size==(48,96),f'hip c{c}: matches two-cell terminal receiver')
valley=image(OUT/'roof-valley.png')
check(sum(valley.getpixel((47-y,y))[:3]==p.BASE[7] for y in range(48))>=40,'valley: continuous painted lead channel survives cleanup')

layouts=city.critic_layouts()
for name,layout in layouts.items():
    a,records=city.scene(layout)
    check(a.tobytes()==image(REV/f'r17-B-critic-{name}-1x.png').tobytes(),name+' native scene replay')
    check(a.resize((a.width*3,a.height*3),Image.Resampling.NEAREST).tobytes()==image(REV/f'r17-B-critic-{name}-3x.png').tobytes(),name+' exact 3x scene')
    check(a.convert('L').convert('RGBA').tobytes()==image(REV/f'r17-B-critic-{name}-squint-1x.png').tobytes(),name+' greyscale replay')
    for b in city.neighbours(layout['buildings']):
        built,parts=city.build(b['spec'])
        check(b['base']>=built.height,b['id']+' fits scene')
        for part in parts:
            z=image(ART/part['file']);z=z.crop(part['crop']) if part['crop'] else z
            check(0<=part['x']<=built.width-z.width and 0<=part['y']<=built.height-z.height,b['id']+' lot-bounded '+part['layer'])
        for wall in b['spec'].get('firewalls',[]):
            body=[part for part in parts if part['layer']=='firewall body']
            check(len({part['x'] for part in body})>=3,b['id']+' full masonry bay, no four-pixel facade stripe')
    check(any(r.get('side')=='south' for r in records),name+' street receives shade')
check(tuple(layouts['L-block']['size'])==(768,576),'16x12 L-block')
check('joined_l' in layouts['L-block'],'L-block exercises valley and actual hip termination')
bad=city.make_spec(2,1,roof='gable');bad['roof_overlays']=[dict(file='skylight-0',x=40,y=30)]
try:city.build(bad);rejected=False
except ValueError:rejected=True
check(rejected,'reject skylight crossing central ridge')
deep=city.make_spec(2,1,roof='ridge');deep['roof_depth']=5
_,parts=city.build(deep)
check(next(p for p in parts if p['layer']=='roof ridge')['y']==0,'extended roof keeps ridge at north end')
check(all(p['y']>=28 for p in parts if p['layer']=='roof fill'),'extension fills correct south slope')

protected=0
for path,digest in before.items():
    rel=Path(path);name=rel.name
    if path in ('art-drop/NOTES.md','art-drop/out/city17/compose.py'):continue
    if path.startswith('art-drop/review/r17-B-'):continue
    if path.startswith('art-drop/out/city17/') and name in failed_pngs:continue
    check(rel.exists() and sha(rel)==digest,'protected '+path);protected+=1
notes_before=REV/'r17-B-critic1-notes-before.txt'
if notes_before.exists():check((ART/'NOTES.md').read_bytes().endswith(notes_before.read_bytes()),'earlier NOTES unchanged')
failures=[c['check'] for c in checks if not c['pass']]
report=dict(passed=len(checks)-len(failures),total=len(checks),failures=failures,
            repaired_pngs=41,passing_pngs_unchanged=96,protected_files=protected,
            mode_blocks=blocks,mode_samples=blocks*64,recorded_edits=edits,checks=checks)
for name in ('r17-B-critic1-validation.json','r17-B-validation.json'):
    (REV/name).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
raise SystemExit(bool(failures))
