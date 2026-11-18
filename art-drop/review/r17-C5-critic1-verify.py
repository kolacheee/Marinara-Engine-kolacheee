"""Focused critic repair checks against the pre-repair checkout."""
from pathlib import Path
from collections import Counter
from PIL import Image,ImageChops
import json,hashlib,importlib.util
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
s=importlib.util.spec_from_file_location('rv',R/'r17-C5-review.py');rv=importlib.util.module_from_spec(s);s.loader.exec_module(rv)
checks=[]
def check(name,ok,**data):checks.append(dict(name=name,passed=bool(ok),**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
before=json.loads((R/'r17-C5-critic1-before-hashes.json').read_text());critic=json.loads((R/'critic-r17C5-1.json').read_text());processing=json.loads((R/'r17-C5-critic1-processing.json').read_text())
passfiles=[];failfiles=[]
for n,v in critic['files'].items():
 p=O/(n+'.png');key=str(p.relative_to(R.parent.parent))
 if not p.exists() or key not in before:continue
 if v['status']=='pass':passfiles.append(key);check(n+' passing export unchanged',sha(p)==before[key])
 elif v['status']=='fail':failfiles.append(key);check(n+' failed export replaced',sha(p)!=before[key])
# No prior non-C5 art, brief, reference, or other part is modified.
allowed={'art-drop/NOTES.md','art-drop/out/city17/compose.py'}|set(failfiles)
changed=[]
for name,h in before.items():
 p=R.parent.parent/name
 if name in allowed or name.startswith('art-drop/review/r17-C5-') or name.startswith('art-drop/review/r17-city-final'):continue
 if not p.exists() or sha(p)!=h:changed.append(name)
check('all other prior files byte-identical',not changed,changed=changed)
samples=0
for r in processing['drawings']:
 n=r['id'];a=Image.open(R/f'r17-C5-critic1-registered-{n}.png').convert('RGBA');m=Image.open(R/f'r17-C5-critic1-mode-{n}.png').convert('RGBA');w,h=m.size;v=list(a.get_flattened_data());expected=[]
 for y in range(h):
  for x in range(w):
   count=Counter(q for yy in range(8) for q in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);expected.append(min(count,key=lambda q:(-count[q],q)))
 samples+=w*h*64;check(n+' registered64vote mode and source hash',expected==list(m.get_flattened_data()) and sha(R/r['source'])==r['source_sha256'])
exports=[q['output'] for q in processing['native'] if 'output' in q]
for n in exports:
 a=c.asset(n);check(n+' hard alpha and hiddenRGB',all(q[3] in (0,255) and (q[3] or q[:3]==(0,0,0)) for q in a.get_flattened_data()))
for n in ('roof-fill-left-c5','roof-fill-right-c5','square-slabs-c5'):
 a=c.asset(n);check(n+' fully painted period',a.getchannel('A').getextrema()==(255,255))
 check(n+' no tile frame',len(set(a.crop((0,0,a.width,1)).get_flattened_data()))>1)
for n in ('roof-gable-d2-c5-w2','roof-hip-d2-c5-w2'):
 a=c.asset(n);sp=[]
 for y in (47,48):
  xs=[x for x in range(a.width) if a.getpixel((x,y))[3]];sp.append((min(xs),max(xs)))
 check(n+' continuous through old splice',max(abs(x-y) for x,y in zip(*sp))<=2,spans=sp)
l=c.c5_city_layout();principal={b['id']:b for b in l['lots']};yards=[p for p in l['plots'] if p.get('principal')]
check('yards registered to principal ground footprint',all(p['yard'][1]+48==principal[p['principal']]['footprint'][1] and p['yard'][0]==principal[p['principal']]['x'] for p in yards),plots=yards)
check('two inhabited bays on each long slot',all(sum(b['x']==x and b['spec'].get('complete_file','').startswith('side-house') for b in l['lots'])>=2 for x in (336,1392)))
check('proper guard noticeboard',next(p for p in l['props'] if p.get('id')=='guard-notice')['file']=='guard-notice-c5r1')
check('southern elbow reclaimed and east court enclosed',any(b['id']=='south-L-return' for b in l['lots']) and any(p['id']=='east-wall-service-court' for p in l['courts']))
# Exact saved proof geometry, including people and all solid supports.
proof=rv.acceptance_layout();mask=Image.new('L',tuple(proof['size']))
for b in proof['lots']+proof['props']:
 a=c.c5_build(b['spec'])[0] if 'spec' in b else c.r_prop_image(b);q=Image.new('L',mask.size);q.paste(a.getchannel('A'),(b['x'],b['base']-a.height));mask=ImageChops.lighter(mask,q)
blocked=[]
for r in proof['roads']:
 x,y,w,h=r['rect'];count=sum(v>0 for v in mask.crop((x,y,x+w,y+h)).get_flattened_data())
 if count:blocked.append(dict(rect=r['rect'],pixels=count))
check('L/T proof clear routes',not blocked,blocked=blocked)
a=c.c4_instance_audit(proof);check('L/T proof exact resolved pieces',not a['failures'],failures=a['failures'])
# Unlike-height proofs really receive sloped connections in both orientations.
for floors in ((5,1),(1,5)):
 q=dict(lots=[])
 for j,n in enumerate(floors):
  spec=c.c5_spec(2,n,j)
  if n==1:spec['roof_file']='roof-gable-d2-c5-w2'
  q['lots'].append(dict(id=str(j),x=j*96,base=480,spec=spec))
 c.c5_contacts(q);high=next(b for b in q['lots'] if b['spec']['floors']==5);low=next(b for b in q['lots'] if b['spec']['floors']==1)
 check(str(floors)+' real receiving slope and lower adapter',bool(high['spec']['roof_contacts']) and bool(low['spec']['abutments']))
# Compare exact scene crops in normal/reveal, not labels or whole-sheet hashes.
proof=json.loads((R/'r17-C5-actor-proof-layout.json').read_text());normal,_,_=c.c5_render(proof);revealed,_,_=c.c5_render(proof,True)
box=(672,960,720,1008);check('church reveal changes actual doorway pixels',normal.crop(box).tobytes()!=revealed.crop(box).tobytes())
# Every final raster derivative was checked by the general verifier; retain its result.
general=json.loads((R/'r17-C5-verification.json').read_text());check('general acceptance suite passes',general['failed']==0,suite_passed=general['passed'],suite_failed=general['failed'])
result=dict(passed=sum(q['passed'] for q in checks),failed=sum(not q['passed'] for q in checks),sources=len(processing['drawings']),mode_samples=samples,replaced=len(failfiles),passing_unchanged=len(passfiles),exports=len(exports),checks=checks)
(R/'r17-C5-critic1-verification.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
for q in checks:
 if not q['passed']:print(json.dumps(q))
if result['failed']:raise SystemExit(1)
