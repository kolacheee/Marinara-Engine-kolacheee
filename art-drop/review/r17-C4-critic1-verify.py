"""Independent saved-paint checks for the C4 critic-1 repair."""
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
from collections import Counter
import importlib.util,json,hashlib,copy
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
checks=[]
def check(n,v,**data):checks.append(dict(name=n,passed=bool(v),**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
critic=json.loads((R/'critic-r17C4-1.json').read_text());before=json.loads((R/'r17-C4-critic1-protected.json').read_text())
allowed={str(O/(n+'.png')) for n in critic['failed'] if n!='compose.py'}|{str(O/'compose.py')}
changed=[];unallowed=[];passing=[]
for name,h in before.items():
 p=Path(name);p=p if p.is_absolute() else ART.parent/p
 if sha(p)!=h:
  changed.append(p.name)
  if str(p) not in allowed:unallowed.append(str(p))
for name,r in critic['files'].items():
 if r['status']=='pass':
  p=O/(name+'.png');key=next(k for k in before if k.endswith('/city17/'+p.name));passing.append(sha(p)==before[key])
check('only failed old assets and compose.py changed',not unallowed,changed=changed,unexpected=unallowed)
check('all passing C4 PNGs byte identical',all(passing),count=len(passing))
log=json.loads((R/'r17-C4-critic1-processing.json').read_text());samples=0
for d in log['drawings']:
 n=d['id'];a=Image.open(R/f'r17-C4-registered-{n}.png').convert('RGBA');m=Image.open(R/f'r17-C4-mode-{n}.png').convert('RGBA');w,h=m.size;v=list(a.get_flattened_data());out=[]
 for y in range(h):
  for x in range(w):
   votes=Counter(q for yy in range(8) for q in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);out.append(min(votes,key=lambda q:(-votes[q],q)))
 samples+=w*h*64;check(n+' exact64vote mode/source',out==list(m.get_flattened_data()) and sha(R/d['source'])==d['source_sha256'])
l=c.c4_city_layout();im,_,_=c.r_render(l)
# The whole perimeter is inspected as drawn, not just declared rectangles.
wall=Image.new('L',tuple(l['size']))
for p in l['props']:
 if p.get('wall'):
  a=c.c4_owned_prop(l,p);v=Image.new('L',wall.size);v.paste(a.getchannel('A'),(p['x'],p['base']-a.height));wall=ImageChops.lighter(wall,v)
for name,box in [('west',(1152,1392,1176,1440)),('east',(1296,1392,1344,1440))]:
 vals=list(wall.crop(box).get_flattened_data());check(name+' gate bypass fully masonry',all(vals),painted=sum(bool(v) for v in vals),area=len(vals))
check('controlled ground arch stays96px clear',not wall.crop((1200,1392,1296,1440)).getbbox())
closed=wall.copy();ImageDraw.Draw(closed).rectangle((1200,1392,1295,1439),fill=255)
# Flood only transparent exterior pixels; the arch is closed for this test.
for x in range(closed.width):
 for y in (0,closed.height-1):
  if closed.getpixel((x,y))==0:ImageDraw.floodfill(closed,(x,y),128)
for y in range(closed.height):
 for x in (0,closed.width-1):
  if closed.getpixel((x,y))==0:ImageDraw.floodfill(closed,(x,y),128)
leaks=[]
for y in range(240,1392,24):
 for x in range(96,1824,24):
  if closed.getpixel((x,y))==128:leaks.append([x,y])
check('entire perimeter excludes exterior flood with arch closed',not leaks,leaks=leaks[:40])
closed.save(R/'r17-C4-critic1-perimeter-mask.png')
# No later curtain may overwrite opaque paint belonging to a tower.
occlusions=[]
for p in l['props']:
 if not p.get('wall') or not p['file'].startswith(('wall-side','wall-walk','wall-top')):continue
 a=c.c4_owned_prop(l,p);x,y=p['x'],p['base']-a.height
 for t in l['props']:
  if not t.get('wall') or 'tower-' not in t['file']:continue
  b=c.r_prop_image(t);m=Image.new('L',a.size);m.paste(b.getchannel('A'),(t['x']-x,t['base']-b.height-y))
  if ImageChops.multiply(a.getchannel('A'),m).getbbox():occlusions.append([p.get('id',p['file']),t['id']])
check('tower owns every curtain contact across base rows',not occlusions,failures=occlusions)
# Every moved directional entry is tied to a painted threshold in its source.
entries=[]
for b in l['lots']:
 if not b.get('threshold_paint'):continue
 t=b['threshold_paint'];a=c.asset(t['file']);x,y=t['point'];x=min(a.width-1,max(0,x));y=min(a.height-1,max(0,y));patch=a.crop((max(0,x-2),max(0,y-2),min(a.width,x+3),min(a.height,y+3)))
 entries.append(dict(id=b['id'],direction=t['direction'],painted=bool(patch.getbbox()),anchor=b['entrance']))
check('directional entries point to painted thresholds',all(p['painted'] for p in entries),entries=entries)
signs=[]
for b in l['lots']:
 s=b['spec']
 for p in s.get('overlays',[]):
  if not p['file'].startswith('sign-'):continue
  a=c.asset(p['file']);left=p['x']==0;blank='storey-sign-bay-'+('left' if left else 'right')+'-w2'
  # These reserved panels have their principal windows in the other bay.
  panel_clear=s['panels'][1:3]==[blank,blank];overlap=0
  for yy in range(a.height):
   wy=p['y_offset']+yy
   for xx in range(a.width):
    wx=p['x']+xx
    if a.getpixel((xx,yy))[3] and ((left and 64<=wx<94) or (not left and 2<=wx<32)) and -144<=wy<-48:overlap+=1
  signs.append(dict(id=b['id'],clear_beam=panel_clear and p['y_offset']==-144,window_overlap=overlap,above_doors=p['y_offset']+a.height<=-48))
check('actual sign brackets clear principal windows and doors',all(s['clear_beam'] and not s['window_overlap'] and s['above_doors'] for s in signs),signs=signs)
audit=c.c4_instance_audit(l);inventory=audit['inventory']
check('architectural inventory covers returns flashing stairs church walls',all(any(pred(t) for t in inventory) for pred in [lambda t:t['owner']=='north-wall-stair',lambda t:t['layer']=='receiving return',lambda t:t['layer']=='lower roof flashing',lambda t:t['file']=='wall-side-a-c4' and t['rect']==[704,696,8,72],lambda t:t['file']=='court-stair',lambda t:t['file']=='north-shop-court-c4']),instances=len(inventory))
renamed=copy.deepcopy(l)
for i,b in enumerate(renamed['lots']):b['frontage_group']='untrusted-label-'+str(i)
other=c.c4_instance_audit(renamed)
check('frontage scan independent of manual labels',audit['adjacency_edges']==other['adjacency_edges'] and audit['failures']==other['failures'] and audit['windows']==other['windows'])
check('universal placed-instance repetition',not audit['failures'],instances=audit['instances'],windows=audit['windows'],failures=audit['failures'])
# Exact source-coordinate closeups, never repaired review pixels.
for n,box in {'nw-contact':(288,336,480,528),'east-tower':(1824,480,1920,576),'gate-west':(1128,1368,1224,1440),'square-south':(696,1008,1104,1344),'square-east':(1104,768,1392,1104),'north-yard':(240,384,360,720),'south-yard':(504,1056,672,1344)}.items():
 a=im.crop(box)
 for z in (1,4):a.resize((a.width*z,a.height*z),c.NEAREST).save(R/f'r17-C4-critic1-{n}-{z}x.png')
# A compact full export inspection atlas, at literal1x and exact4x.
names=log['exports'];pages=[]
for i in range(0,len(names),9):
 a=Image.new('RGBA',(720,1056),(50,53,44,255));d=ImageDraw.Draw(a)
 for j,n in enumerate(names[i:i+9]):
  x=(j%3)*240;y=(j//3)*352;b=c.asset(n);d.text((x+8,y+8),n,fill='white');a.alpha_composite(b,(x+12,y+36))
 for z in (1,4):a.resize((a.width*z,a.height*z),c.NEAREST).save(R/f'r17-C4-critic1-exports-{i//9+1}-{z}x.png')
 pages.append(i//9+1)
old=json.loads((R/'r17-C4-verification.json').read_text());check('existing full acceptance suite',old['failed']==0,passed_checks=old['passed'],failed_checks=old['failed'])
report=dict(passed=sum(q['passed'] for q in checks),failed=sum(not q['passed'] for q in checks),mode_samples=samples,source_drawings=len(log['drawings']),repaired_or_added_exports=len(names),protected_passing=len(passing),checks=checks)
(R/'r17-C4-critic1-verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
for q in checks:
 if not q['passed']:print(json.dumps(q))
if report['failed']:raise SystemExit(1)
