"""Focused redraw audit: unchanged passing art, exact mode, joins and mounting."""
from pathlib import Path
from collections import Counter
from PIL import Image,ImageChops
import json,hashlib,importlib.util
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17';B=R/'r17-E-critic1-before'
checks=[]
def check(n,ok,detail=None):checks.append(dict(check=n,passed=bool(ok),detail=detail))
def im(p):return Image.open(p).convert('RGBA')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
crit=json.loads((R/'critic-r17E-1.json').read_text());failed=set(crit['failed']);before=json.loads((B/'hashes.json').read_text())
changed=[];protected=0
for path,digest in before.items():
 p=Path(path)
 if p.resolve().parent==O and p.name not in {n if n.endswith('.py') else n+'.png' for n in failed}:
  protected+=1
  if sha(p)!=digest:changed.append(path)
check('all passing and earlier production assets byte-identical',not changed,dict(files=protected,changed=changed))
for n in failed:
 p=O/(n if n.endswith('.py') else n+'.png');check(n+' repaired',sha(p)!=sha(B/p.name))
 if n!='compose.py':
  a=im(p);b=im(B/p.name);check(n+' dimensions unchanged',a.size==b.size)
  if a.size==(96,48):
   if not n.startswith('street'):check(n+' course rows preserved',all(a.crop((0,y,96,y+1)).tobytes()==b.crop((0,y,96,y+1)).tobytes() for y in (0,47)))
   if not n.startswith('street'):check(n+' alpha preserved',a.getchannel('A').tobytes()==b.getchannel('A').tobytes())
samples=0
for rec in json.loads((R/'r17-E-critic1-processing.json').read_text()):
 n=rec['id'];w,h=rec['size'];tag=f'{n}-{w}x{h}';reg=im(R/f'r17-E-critic1-registered-{tag}.png');mode=im(R/f'r17-E-critic1-mode-{tag}.png');p=list(mode.get_flattened_data());valid=True
 for y in range(h):
  row=list(reg.crop((0,y*8,w*8,y*8+8)).get_flattened_data())
  for x in range(w):
   votes=Counter(q for yy in range(8) for q in row[yy*w*8+x*8:yy*w*8+x*8+8]);valid &= min(votes,key=lambda q:(-votes[q],q))==p[y*w+x];samples+=64
 check(tag+' exact64sample mode',valid)
 for x,y,a,b in rec['cleanup']:
  valid &= list(p[y*w+x])==a;p[y*w+x]=tuple(b)
 check(tag+' logged cleanup',valid and p==list(im(R/f'r17-E-critic1-clean-{tag}.png').get_flattened_data()))
 check(tag+' retained source',sha(R/rec['source'])==rec['source_sha256'])
for n in ('cobble-large','cobble-small'):
 a=im(O/(n+'.png'))
 periods=[]
 for step in (2,3,4,6,8,12,16,24):
  for axis in (0,1):
   same=(a.crop((step,0,48,48)).tobytes()==a.crop((0,0,48-step,48)).tobytes()) if axis==0 else (a.crop((0,step,48,48)).tobytes()==a.crop((0,0,48,48-step)).tobytes())
   if same:periods.append([axis,step])
 check(n+' no small source period',not periods,periods)
 check(n+' wrapped opposite paint',a.crop((0,0,1,48)).tobytes()==a.crop((47,0,48,48)).tobytes() and a.crop((0,0,48,1)).tobytes()==a.crop((0,47,48,48)).tobytes())
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
layouts=json.loads((R/'r17-E-scenes.json').read_text());mounted=[];washing={}
for name,l in layouts.items():
 for b in l['lots']:
  spec=b['spec']
  for o in spec.get('overlays',[]):
   if o['file'].startswith('sign-'):
    mounted.append(o['file']);check(name+' '+b['id']+' sign clear of right door',o['x']+c.asset(o['file']).width<=68)
 # Test each washing-line against every later-drawn opaque object/building.
 for p in l['props']:
  if p['file']!='washing-line':continue
  a=c.asset(p['file']);x,y=p['x'],p['base']-a.height;later=Image.new('L',a.size)
  for b in l['lots']:
   if b['base']>p['base']:
    bb,_=c.build_c(b['spec']);layer=Image.new('L',a.size);layer.paste(bb.getchannel('A'),(b['x']-x,b['base']-bb.height-y));later=ImageChops.lighter(later,layer)
  for q in l['props']:
   if q is p or q['base']<=p['base']:continue
   bb=im(A/q['path']) if q.get('path') else c.asset(q['file']);layer=Image.new('L',a.size);layer.paste(bb.getchannel('A'),(q['x']-x,q['base']-bb.height-y));later=ImageChops.lighter(later,layer)
  covered=sum(v>0 for v in ImageChops.multiply(a.getchannel('A'),later).get_flattened_data());washing[name]=covered;check(name+' complete washing silhouette visible',covered==0,covered)
check('all eight trades mounted',set(mounted)=={'sign-'+n for n in ('smith','baker','apothecary','cobbler','inn','scribe','tailor','butcher')},sorted(set(mounted)))
base=json.loads((R/'r17-E-verification.json').read_text());check('full E audit passes',base['checks']==base['passed'],base['failures'])
segments=sum(len(v['street_segments']) for v in base['scenes'].values())
result=dict(checks=len(checks),passed=sum(x['passed'] for x in checks),failures=[x for x in checks if not x['passed']],new_mode_samples=samples,protected_production_files=protected,street_segments=segments,washing_occluded_pixels=washing,results=checks)
(R/'r17-E-critic1-verification.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='results'},indent=2))
