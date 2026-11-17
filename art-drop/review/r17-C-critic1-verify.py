"""Independent saved-pixel checks for the C critic1 redraw and protected art."""
from pathlib import Path
from collections import Counter
from PIL import Image, ImageChops
import hashlib, importlib.util, json
R=Path(__file__).resolve().parent;ART=R.parent;ROOT=ART.parent;O=ART/'out/city17'
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
c=module('c',O/'compose.py');p=module('p',R/'r17-C-critic1-process.py');review=module('review',R/'r17-C-review.py')
def rgba(path):return Image.open(path).convert('RGBA')
def eq(a,b):return a.size==b.size and a.tobytes()==b.tobytes()
checks=[];fail=[]
def check(ok,label):
 checks.append(label)
 if not ok:fail.append(label)
names=review.exports();records=json.loads((R/'r17-C-critic1-generation.json').read_text());processing=json.loads((R/'r17-C-critic1-processing.json').read_text());joins=json.loads((R/'r17-C-critic1-native-joins.json').read_text());critic=json.loads((R/'critic-r17C-1.json').read_text());before=json.loads((R/'r17-C-critic1-before.json').read_text())
palette=set(p.PAL)|set(p.BASE)|set(p.GROUND_PAL)|set(p.GREEN_PAL)|{(120,121,108),(146,143,125),(162,150,122)}
measurements=[]
for name in names:
 a=rgba(O/(name+'.png'));w,h=a.size;vals=list(a.get_flattened_data())
 check(all(v[3] in (0,255) for v in vals),name+': hard alpha')
 check(all(v==(0,0,0,0) for v in vals if not v[3]),name+': hidden RGB zero')
 check(all(v[:3] in palette for v in vals if v[3]),name+': fixed palettes')
 if name.startswith(('back-','side-ground','side-storey')) or name.endswith('-storey'):
  check(h==48 and w in (48,96,144),name+': native wall dimensions')
  check(eq(a.crop((0,0,w,1)),p.course(w)) and eq(a.crop((0,47,w,48)),p.course(w)),name+': exact courses')
 if name.startswith(('roof-back','side-roof')) or name.endswith('-roof'):
  check(h in (96,144) and w in (48,96,144),name+': whole-cell cap')
  check(eq(a.crop((0,h-1,w,h)),p.course(w)),name+': eave contact')
 if not name.startswith(('yard-','fence-','mud-edge')):check(a.getchannel('A').getextrema()==(255,255),name+': square opaque coverage')
 unseen={i for i,v in enumerate(vals) if v[3]};sizes=[]
 while unseen:
  seed=unseen.pop();stack=[seed];count=0
  while stack:
   i=stack.pop();count+=1;x,y=i%w,i//w
   for yy in range(max(0,y-1),min(h,y+2)):
    for xx in range(max(0,x-1),min(w,x+2)):
     j=yy*w+xx
     if j in unseen:unseen.remove(j);stack.append(j)
  sizes.append(count)
 check(not sizes or min(sizes)>2,name+': no alpha specks')
 sheet=rgba(R/f'r17-C-file-{name}.png');mounted=review.mount(name,a);baseline=199
 check(eq(sheet.crop((12,baseline-h,12+w,baseline)),mounted),name+': literal1x proof')
 x=12+w+144+20;y=55+max(h,144)*4-h*4
 check(eq(sheet.crop((x,y,x+4*w,y+4*h)),mounted.resize((4*w,4*h),Image.Resampling.NEAREST)),name+': literal4x proof')
 measurements.append(dict(file=name,size=[w,h],alpha_components=sorted(sizes),colours=len({v[:3] for v in vals if v[3]})))
for n in ('side-ground','side-storey'):check(eq(rgba(O/(n+'.png')),rgba(O/(n+'-E.png'))),n+': E alias')
for w in (1,2,3):check(hashlib.sha256((O/f'back-plain-ground-w{w}.png').read_bytes()).hexdigest()==before[f'art-drop/out/city17/back-plain-w{w}.png'],f'rear ground w{w}: retained ground-only drawing')

# Recount the source's registered64 samples, then replay all colour/outline
# cleanup and native contact transfers. No production output is trusted here.
samples=0;replay={}
for rec in processing:
 n=rec['id'];w,h=rec['size'];a=rgba(R/f'r17-C-critic1-registered-{n}.png');v=list(a.get_flattened_data());sw=w*8;mode=[]
 for y in range(h):
  for x in range(w):
   counts=Counter(q for yy in range(8) for q in v[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);mode.append(min(counts,key=lambda q:(-counts[q],q)))
 samples+=w*h*64;im=Image.new('RGBA',(w,h));im.putdata(mode)
 check(eq(im,rgba(R/f'r17-C-critic1-mode-{n}.png')),n+': exact64-sample mode')
 for x,y,old,new in rec['cleanup']:
  check(im.getpixel((x,y))==tuple(old),n+f': cleanup source{x},{y}');im.putpixel((x,y),tuple(new))
 check(eq(im,rgba(R/f'r17-C-critic1-clean-{n}.png')),n+': cleanup replay')
 if rec['selected']:replay[rec['output']]=im
for rec in joins:
 im=replay[rec['output']]
 for x,y,old,new in rec['changes']:
  check(im.getpixel((x,y))==tuple(old),rec['output']+': native transfer source');im.putpixel((x,y),tuple(new))
for name,im in replay.items():check(eq(im,rgba(O/(name+'.png'))),name+': final redraw replay')
for name in ('street-main','street-side','street-junction','lane','mud-edge'):
 a=rgba(O/(name+'.png'));im=review.repeat(a,(a.width*3,a.height*3))
 if name=='mud-edge':bg=review.repeat(review.GROUND,im.size);bg.alpha_composite(im);im=bg
 for scale in (1,4):check(eq(rgba(R/f'r17-C-repeat-{name}-{scale}x.png'),im.resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST)),name+': literal repeat'+str(scale))
 if name!='mud-edge':
  # Regression: the former paving was an exact12/16row stamp.
  check(all(a.crop((0,0,a.width,a.height-period)).tobytes()!=a.crop((0,period,a.width,a.height)).tobytes() for period in (12,16)),name+': no short exact stamp')

routes={};roofs={};shadows={}
for name,layout in c.c_layouts().items():
 im,placements=c.c_render(layout);check(eq(im,rgba(R/f'r17-C-critic-{name}-1x.png')),name+': native scene replay')
 for scale in (1,3):
  enlarged=im.resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST)
  check(eq(enlarged,rgba(R/f'r17-C-critic-{name}-{scale}x.png')),name+': scale'+str(scale))
  sheet=rgba(R/f'r17-C-critic-{name}-comparison-{scale}x.png');check(eq(sheet.crop((12,34,12+enlarged.width,34+enlarged.height)),enlarged),name+': comparison'+str(scale))
  y=12
  for ref in ('round15-street','current-town'):
   a=rgba(ART/f'reference/r17/{ref}.png');x=enlarged.width+36
   check(eq(sheet.crop((x,y+22,x+a.width,y+22+a.height)),a),name+': unscaled reference '+ref+str(scale));y+=a.height+40
 check(eq(im.convert('L').convert('RGBA'),rgba(R/f'r17-C-critic-{name}-squint-1x.png')),name+': greyscale')
 occupied=Image.new('L',tuple(layout['size']));roofmask=Image.new('L',occupied.size)
 for b in layout['lots']:
  a,_=c.build_c(b['spec']);x,y=b['x'],b['base']-a.height;occupied.paste(a.getchannel('A'),(x,y));floors=b['spec'].get('floors',1+len(b['spec'].get('storeys',[])));rh=a.height-48*floors
  roofmask.paste(a.getchannel('A').crop((0,0,a.width,rh)),(x,y))
 if layout.get('joined_l'):
  j=layout['joined_l'];a=c.joined_l_roof(j.get('colour',0));roofmask.paste(a.getchannel('A'),(j['x'],j['y']))
 for prop in layout['props']:
  if prop['file']=='pilot-person':continue
  a=c.asset(prop['file']) if not prop.get('path') else rgba(ART/prop['path']);mask=Image.new('L',occupied.size);mask.paste(a.getchannel('A'),(prop['x'],prop['base']-a.height));occupied=ImageChops.lighter(occupied,mask)
 routes[name]=[];roofs[name]=[]
 for x,y,w,h in layout.get('clear_routes',[]):
  count=sum(v>0 for v in occupied.crop((x,y,x+w,y+h)).get_flattened_data());routes[name].append(dict(rect=[x,y,w,h],blocked=count));check(count==0,name+': clear route'+str([x,y,w,h]))
 for x,y,w,h in layout.get('required_roofs',[]):
  count=sum(v<255 for v in roofmask.crop((x,y,x+w,y+h)).get_flattened_data());roofs[name].append(dict(rect=[x,y,w,h],uncovered=count));check(count==0,name+': roof coverage'+str([x,y,w,h]))
 ground=c.c_ground(tuple(layout['size']),layout['roads']);dark=0
 for b in layout['lots']:
  a,_=c.build_c(b['spec']);x,y=b['x'],b['base'];h=min(6,im.height-y)
  if h>0:dark+=sum(v<t for v,t in zip(im.crop((x,y,x+a.width,y+h)).convert('L').get_flattened_data(),ground.crop((x,y,x+a.width,y+h)).convert('L').get_flattened_data()))
 shadows[name]=dark;check(dark>0,name+': visible street shadows')
check(c.c_layouts()['L-block']['size']==[768,576],'L-block16x12cells')
passed=[n for n,d in critic['files'].items() if d['status']=='pass'];changed=[];protected=0
allowed_png={n+'.png' for n in critic['failed'] if n!='compose.py'}
for rel,digest in before.items():
 path=ROOT/rel
 if rel=='art-drop/NOTES.md' or rel=='art-drop/out/city17/compose.py' or (path.parent==R and path.name.startswith('r17-C-')) or (path.parent==O and path.name in allowed_png):continue
 okay=path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest()==digest
 check(okay,'protected '+rel);protected+=int(okay)
 if not okay:changed.append(rel)
for n in passed:
 rel='art-drop/out/city17/'+n+'.png';check(hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()==before[rel],n+': passing file byte-identical')
for n in critic['failed']:
 rel='art-drop/out/city17/'+(n if n=='compose.py' else n+'.png')
 check(hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()!=before[rel],n+': failed file repaired')
for scene,layout in c.c_layouts().items():
 for road in layout['roads']:
  if road['file']=='street-junction':continue
  x,y,w,h=road['rect'];length=w if road.get('horizontal') else h
  check(length<=384,scene+': street segment at most eight cells '+str(road['rect']))
report=dict(status='PASS' if not fail else 'FAIL',checks=len(checks),failures=fail,exports=len(names),new_image_drawings=sum(x['source'].startswith('r17-C-critic1-source') for x in records),mode_samples_replayed=samples,passing_files_unchanged=len(passed),protected_files_unchanged=protected,protected_changes=changed,route_clearance=routes,roof_coverage=roofs,shadow_darkened_pixels=shadows,measurements=measurements,limitations=['Saved-art self-review, not independent or in-engine approval.','Current civic proxies defer final D skyline/gate and six distinct stall drawings.'])
(R/'r17-C-critic1-verification.json').write_text(json.dumps(report,indent=2)+'\n')
(R/'r17-C-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('measurements','route_clearance','roof_coverage')},indent=2))
raise SystemExit(bool(fail))
