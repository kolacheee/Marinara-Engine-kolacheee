"""Replay measurements for native E art, scene assembly and protected files."""
from pathlib import Path
from PIL import Image,ImageChops
from collections import Counter
import json,hashlib,importlib.util
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17';checks=[]
def check(n,ok,detail=None):checks.append(dict(check=n,pass_=bool(ok),detail=detail))
def rgba(path):return Image.open(path).convert('RGBA')
sp=importlib.util.spec_from_file_location('compose',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
files=json.loads((R/'r17-E-files.json').read_text());samples=0
for name,rec in files.items():
 im=rgba(O/(name+'.png'));p=list(im.get_flattened_data());check(name+' dimensions',list(im.size)==rec['size']);check(name+' hard alpha',set(v[3] for v in p)<={0,255});check(name+' zero hidden RGB',all(v[:3]==(0,0,0) for v in p if not v[3]));check(name+' hash',hashlib.sha256((O/(name+'.png')).read_bytes()).hexdigest()==rec['sha256']);check(name+' review', (R/f'r17-E-piece-{name}-1x4x.png').exists())
 if rec['kind'] in ('ground','facade','roof'):check(name+' square opaque footprint',all(v[3]==255 for v in p))
 if name.startswith('sign-'):check(name+' twice Round15 maximum canvas',im.size==(64,72))
 # No detached single/two-pixel painted islands.
 seen=set();small=0;w,h=im.size
 for i,q in enumerate(p):
  if not q[3] or i in seen:continue
  st=[i];seen.add(i);count=0
  while st:
   v=st.pop();count+=1;x,y=v%w,v//w
   for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
    j=yy*w+xx
    if 0<=xx<w and 0<=yy<h and j not in seen and p[j][3]:seen.add(j);st.append(j)
  if count<3:small+=1
 check(name+' no alpha specks',small==0,small)
 if rec['kind'].startswith('ground'):
  rep=rgba(R/f'r17-E-repeat-{name}-1x.png')
  check(name+' literal3x3',all(rep.crop((x*w,y*h,(x+1)*w,(y+1)*h)).tobytes()==im.tobytes() for y in range(3) for x in range(3)))
  check(name+' repeat4x',rgba(R/f'r17-E-repeat-{name}-4x.png').tobytes()==rep.resize((w*12,h*12),Image.Resampling.NEAREST).tobytes())
for rec in json.loads((R/'r17-E-processing.json').read_text()):
 ident=rec['id'];w,h=rec['size'];reg=rgba(R/f'r17-E-registered-{ident}.png');mode=rgba(R/f'r17-E-mode-{ident}.png');mp=list(mode.get_flattened_data());valid=True
 for y in range(h):
  row=list(reg.crop((0,y*8,w*8,y*8+8)).get_flattened_data())
  for x in range(w):
   votes=Counter(q for yy in range(8) for q in row[yy*w*8+x*8:yy*w*8+x*8+8]);v=min(votes,key=lambda q:(-votes[q],q));valid &= v==mp[y*w+x];samples+=64
 check(ident+' exact64sample mode',valid)
 for x,y,before,after in rec['cleanup']:
  valid &= list(mp[y*w+x])==before;mp[y*w+x]=tuple(after)
 check(ident+' logged cleanup',valid and mp==list(rgba(R/f'r17-E-clean-{ident}.png').get_flattened_data()))
 check(ident+' source retained',hashlib.sha256((R/rec['source']).read_bytes()).hexdigest()==rec['source_sha256'])
layouts=json.loads((R/'r17-E-scenes.json').read_text());stats={}
for name,l in layouts.items():
 check(name+' one or two cell frontages',all(1<=b['spec'].get('width',b['spec'].get('depth',1))<=2 for b in l['lots']))
 im=rgba(R/f'r17-E-critic-{name}-1x.png');shadow,_=c.c_shadow_layer(l);mask=Image.new('L',tuple(l['size']));roofmask=Image.new('L',tuple(l['size']))
 for b in l['lots']:
  a,_=c.build_c(b['spec']);x,y=b['x'],b['base']-a.height;piece=Image.new('L',mask.size);piece.paste(a.getchannel('A'),(x,y));mask=ImageChops.lighter(mask,piece)
  floors=b['spec'].get('floors',1+len(b['spec'].get('storeys',[])));rh=a.height-floors*48;piece=Image.new('L',mask.size);piece.paste(a.crop((0,0,a.width,rh)).getchannel('A'),(x,y));roofmask=ImageChops.lighter(roofmask,piece)
 for p in l['props']:
  if p.get('overhead') or p['file'] in ('pilot-person','cat','pigeon'):continue
  a=rgba(A/p['path']) if p.get('path') else c.asset(p['file']);layer=Image.new('L',mask.size);layer.paste(a.getchannel('A'),(p['x'],p['base']-a.height));mask=ImageChops.lighter(mask,layer)
 if l.get('joined_l'):
  p=l['joined_l'];a=c.joined_l_roof(p.get('colour',0));layer=Image.new('L',mask.size);layer.paste(a.getchannel('A'),(p['x'],p['y']));roofmask=ImageChops.lighter(roofmask,layer)
 blocked=[]
 for box in l.get('clear_routes',[]):
  x,y,w,h=box;n=sum(v>0 for v in mask.crop((x,y,x+w,y+h)).get_flattened_data());blocked.append(n)
 check(name+' route clearance',not any(blocked),blocked)
 holes=[]
 for x,y,w,h in l.get('required_roofs',[]):holes.append(sum(v==0 for v in roofmask.crop((x,y,x+w,y+h)).get_flattened_data()))
 check(name+' required roof coverage',not any(holes),holes)
 shade_by_road={};segments=[]
 for idx,r in enumerate(l['roads']):
  if r['file']=='mud-edge':continue
  x,y,w,h=r['rect'];n=sum(v>0 for v in shadow.crop((x,y,x+w,y+h)).getchannel('A').get_flattened_data());shade_by_road[r['file']]=shade_by_road.get(r['file'],0)+n
  if r['file'] in ('street-main','street-side','lane'):
   segments.append(dict(index=idx,file=r['file'],rect=r['rect'],shadow_pixels=n));check(name+' shadow on street segment '+str(idx),n>0,segments[-1])
 check(name+' exact3x',rgba(R/f'r17-E-critic-{name}-3x.png').tobytes()==im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST).tobytes());check(name+' greyscale',rgba(R/f'r17-E-critic-{name}-squint-1x.png').tobytes()==im.convert('L').convert('RGBA').tobytes())
 stats[name]=dict(blocked=blocked,roof_holes=holes,shadow_pixels=shade_by_road,street_segments=segments)
for key in ('market','temple','craft','rich','poor'):
 for layer in ('ground','roof'):
  hashes=[files[f'district-{key}-{layer}{suffix}-w2']['sha256'] for suffix in ('','-v1','-v2')]
  check(key+' '+layer+' three distinct variants',len(set(hashes))==3)
protected=json.loads((R/'r17-E-protected.json').read_text());changed=[n for n,sha in protected.items() if not (A/n).exists() or hashlib.sha256((A/n).read_bytes()).hexdigest()!=sha];check('protected files unchanged',not changed,changed)
report=dict(checks=len(checks),passed=sum(x['pass_'] for x in checks),failures=[x for x in checks if not x['pass_']],mode_samples=samples,protected_files=len(protected),files=len(files),scenes=stats,results=checks)
(R/'r17-E-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:report[k] for k in ['checks','passed','failures','mode_samples','protected_files','files']},indent=2))
