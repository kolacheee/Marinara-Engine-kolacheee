"""Focused saved-art checks, without claiming an independent visual verdict."""
from pathlib import Path
from collections import Counter
from PIL import Image,ImageChops
import json,hashlib,importlib.util,copy,itertools
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';ROOT=R.parent.parent
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
c=module('c',O/'compose.py');rv=module('rv',R/'r17-C5-review.py');checks=[]
def check(name,ok,**data):checks.append(dict(name=name,passed=bool(ok),**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
before=json.loads((R/'r17-C5-critic2-before-hashes.json').read_text());critic=json.loads((R/'critic-r17C5-2.json').read_text());proc=json.loads((R/'r17-C5-critic2-processing.json').read_text())
passing=[];failed=[]
for n,v in critic['files'].items():
 path=O/(n+'.png');key=str(path.relative_to(ROOT))
 if key not in before:continue
 if v['status']=='pass':passing.append(key);check(n+' passing file preserved',sha(path)==before[key])
 else:failed.append(key);check(n+' failed drawing replaced',sha(path)!=before[key])
allowed=set(failed)|{'art-drop/out/city17/compose.py','art-drop/NOTES.md'}
changed=[n for n,h in before.items() if n not in allowed and not n.startswith(('art-drop/review/r17-C5-','art-drop/review/r17-city-final')) and (not (ROOT/n).exists() or sha(ROOT/n)!=h)]
check('all prior files outside C5 scope preserved',not changed,changed=changed)
samples=0
for r in proc['drawings']:
 n=r['id'];reg=Image.open(R/f'r17-C5-critic2-registered-{n}.png');mode=Image.open(R/f'r17-C5-critic2-mode-{n}.png');w,h=mode.size;v=list(reg.get_flattened_data());out=[]
 for y in range(h):
  for x in range(w):
   counts=Counter(q for yy in range(8) for q in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);out.append(min(counts,key=lambda q:(-counts[q],q)))
 samples+=w*h*64;check(n+' exact 64-vote mode and source hash',out==list(mode.get_flattened_data()) and sha(R/r['source'])==r['source_sha256'])
for name,key in proc['selected'].items():
 a=c.asset(name);v=list(a.get_flattened_data());check(name+' hard alpha and zero hidden RGB',all(q[3] in (0,255) and (q[3] or q[:3]==(0,0,0)) for q in v))
 if key in proc['roof_boundary_polygons']:
  mask=Image.open(R/f'r17-C5-critic2-roof-mask-{key}.png');tones=['slate'] if name.startswith('side-') else ['slate','brown'] if name.startswith('roof-') else []
  for tone in tones:
   b=c.asset(name+'-'+tone);unchanged=all(p==q for p,q,m in zip(a.get_flattened_data(),b.get_flattened_data(),mask.get_flattened_data()) if not m)
   check(name+' '+tone+' only traced roof material changes',unchanged and a.getchannel('A').tobytes()==b.getchannel('A').tobytes())
l=c.c5_city_layout()
for b in l['lots']:
 if b['spec'].get('complete_file','').startswith('side-house'):
  local=b['landing_anchor_local'];a=c.c5_build(b['spec'])[0];x=min(95,max(0,local[0]));y=local[1]
  check(b['id']+' anchor touches painted side landing',bool(a.getchannel('A').crop((max(0,x-2),y-3,min(96,x+3),y+4)).getbbox()) and b['painted_threshold'][1]!=b['painted_threshold'][3],local=local,threshold=b['painted_threshold'])
  check(b['id']+' no slate facade cutoff',not b['spec']['complete_file'].endswith('slate') or c.asset(b['spec']['complete_file']).crop((0,96,96,192)).tobytes()==c.asset(b['spec']['complete_file'].removesuffix('-slate')).crop((0,96,96,192)).tobytes())
for ws in itertools.product((1,2,3),repeat=2):
 for ns in ((5,1),(1,5)):
  q=dict(lots=[dict(id=str(j),x=sum(ws[:j])*48,base=480,spec=c.c5_spec(w,n,j)) for j,(w,n) in enumerate(zip(ws,ns))]);c.c5_contacts(q)
  high=next(b for b in q['lots'] if b['spec']['floors']==5);low=next(b for b in q['lots'] if b['spec']['floors']==1)
  parts=c.c5_build(high['spec'])[1];lp=c.c5_build(low['spec'])[1]
  check(str(ws)+str(ns)+' single taller-lot receiving wall and cap-specific flashing',bool(high['spec']['roof_contacts']) and any(p['layer'].startswith('cap-specific') for p in parts) and not low['spec']['abutments'] and not any('abutment overlay' in p['layer'] for p in lp))
proof=rv.acceptance_layout();wing=next(b for b in proof['lots'] if b['id']=='proof-connected-rear-wing');prior=next(b for b in proof['lots'] if b['x']+48*b['spec']['width']==wing['x'] and b['base']==wing['base'])
a=c.c5_build(prior['spec'])[0];b=c.c5_build(wing['spec'])[0];touch=sum(a.getpixel((a.width-1,a.height-1-y))[3]>0 and b.getpixel((0,b.height-1-y))[3]>0 for y in range(min(a.height,b.height)))
check('L frontage and integral rear wing are physically connected',touch>=48 and wing['spec']['complete_file']=='house-rear-wing-c5r2',touching_rows=touch,principal=wing['footprint'],rear_wing=wing['rear_wing_footprint'])
check('rear wing has painted notch and continuous valley silhouette',b.getchannel('A').crop((0,0,40,72)).getbbox() is None and b.getchannel('A').crop((56,24,88,144)).getbbox() is not None)
check('actual L/T layout repetition',not c.c4_instance_audit(proof)['failures'])
im,records,shadows=c.c5_render(l);f=next(p for p in l['props'] if p.get('id')=='fountain');fa=c.r_prop_image(f);foot=f['base']-fa.height+fa.getchannel('A').getbbox()[3]-1;shadow=next(p for p in shadows if p['owner']=='fountain');mask=c.asset('fountain-shadow-c5').getchannel('A')
check('fountain broad contact joins painted foot without blank row',shadow['receiver'][1]==foot and sum(v>0 for v in mask.crop((0,0,96,1)).get_flattened_data())>=80,painted_foot=foot,shadow_top=shadow['receiver'][1],contact_width=sum(v>0 for v in mask.crop((0,0,96,1)).get_flattened_data()))
check('fountain union opacity below 50percent',shadow['opacity']<=127)
for ident in ['west-lane-workshop','west-2','north-middle-0','middle-side-workshop','east-lane-workshop','merchant-2']:
 a=Image.open(R/f'r17-C5-side-entry-{ident}-1x.png');z=Image.open(R/f'r17-C5-side-entry-{ident}-3x.png');check(ident+' exact native/reveal proof scaling',z.tobytes()==a.resize((a.width*3,a.height*3),Image.Resampling.NEAREST).tobytes())
general=json.loads((R/'r17-C5-verification.json').read_text());check('general geometry exports repetition and exact final derivatives pass',general['failed']==0,suite_passed=general['passed'])
check('saved final matches current composer',im.tobytes()==Image.open(R/'r17-city-final.png').tobytes())
comparison=Image.open(R/'r17-city-final-vs-r15-vs-today.png');x=16
for file in [R.parent/'reference/r17/current-town.png',R/'r15-city-mockup.png',R/'r17-city-final.png']:
 a=Image.open(file).convert('RGBA');check(file.stem+' literal 1x comparison panel',comparison.crop((x,32,x+a.width,32+a.height)).tobytes()==a.tobytes());x+=a.width+16
result=dict(passed=sum(t['passed'] for t in checks),failed=sum(not t['passed'] for t in checks),replaced=len(failed),passing_preserved=len(passing),source_drawings=len(proc['drawings']),mode_samples=samples,checks=checks)
(R/'r17-C5-critic2-verification.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
for q in checks:
 if not q['passed']:print(json.dumps(q))
if result['failed']:raise SystemExit(1)
