"""Audit saved Part C art, mode provenance, native composition and scope."""
from pathlib import Path
from collections import Counter, deque
from PIL import Image, ImageChops
import hashlib, importlib.util, json

R=Path(__file__).resolve().parent;ART=R.parent;ROOT=ART.parent;O=ART/'out/city17'
NN=Image.Resampling.NEAREST
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
c=module('c',O/'compose.py');p=module('p',R/'r17-C-process.py');reviews=module('reviews',R/'r17-C-review.py')
checks=[];failures=[]
def check(condition,label):
 checks.append(label)
 if not condition:failures.append(label)
def rgba(path):return Image.open(path).convert('RGBA')
def equal(a,b):return a.size==b.size and a.tobytes()==b.tobytes()
names=reviews.exports();records=json.loads((R/'r17-C-generation.json').read_text());processing=json.loads((R/'r17-C-processing.json').read_text());joins=json.loads((R/'r17-C-native-joins.json').read_text())
chosen={r['output']:r for r in records if r.get('selected') and not r.get('review_only')}
chosen.update({'side-ground':chosen['side-ground-E'],'side-storey':chosen['side-storey-E']})
check(len(names)==40,'40 named exports')
palette=set(p.PAL)|{(120,121,108),(146,143,125),(162,150,122)}
components={};colour_counts={}
for n in names:
 a=rgba(O/(n+'.png'));w,h=a.size;vals=list(a.get_flattened_data());r=chosen[n]
 check(a.size==tuple(r['size']),n+': exact native dimensions')
 check(all(v[3] in (0,255) for v in vals),n+': hard alpha')
 check(all(v==(0,0,0,0) for v in vals if not v[3]),n+': zero hidden RGB')
 check(all(v[:3] in palette for v in vals if v[3]),n+': approved palette only')
 colour_counts[n]=len({v[:3] for v in vals if v[3]})
 if not r.get('overlay') and not r.get('edge'):
  check(a.getchannel('A').getextrema()==(255,255),n+': full rectangular footprint')
 if r.get('course'):
  check(equal(a.crop((0,0,w,1)),p.course(w)) and equal(a.crop((0,h-1,w,h)),p.course(w)),n+': fixed course rows')
 if n.startswith('roof-back') or n.endswith('-roof') or n.startswith('side-roof'):
  check(equal(a.crop((0,h-1,w,h)),p.course(w)),n+': roof contact course')
 unseen={i for i,v in enumerate(vals) if v[3]};sizes=[]
 while unseen:
  seed=unseen.pop();stack=[seed];size=0
  while stack:
   i=stack.pop();size+=1;x,y=i%w,i//w
   for yy in range(max(0,y-1),min(h,y+2)):
    for xx in range(max(0,x-1),min(w,x+2)):
     j=yy*w+xx
     if j in unseen:unseen.remove(j);stack.append(j)
  sizes.append(size)
 components[n]=sorted(sizes)
 check(not sizes or min(sizes)>=3,n+': no isolated 1/2-pixel alpha specks')
 sheet=rgba(R/f'r17-C-file-{n}.png');mounted=reviews.mount(n,a);base=55+144
 check(equal(sheet.crop((12,base-h,12+w,base)),mounted),n+': literal native review')
 x=12+w+144+20;y=55+max(h,144)*4-h*4
 check(equal(sheet.crop((x,y,x+w*4,y+h*4)),mounted.resize((w*4,h*4),NN)),n+': exact 4x review')
 for scale in (1,4):check((R/f'r17-C-seam-{n}-{scale}x.png').is_file(),n+f': seam proof {scale}x')

# Independently re-count every registered 8x8 block and replay every logged
# native-pixel cleanup/transfer, including unselected alternatives.
samples=0;export_replay={}
for rec in processing:
 n=rec['id'];w,h=rec['size'];reg=rgba(R/f'r17-C-registered-{n}.png');vals=list(reg.get_flattened_data());sw=w*8;mode=[]
 check(reg.size==(w*8,h*8),n+': registered at 8x')
 for y in range(h):
  for x in range(w):
   ct=Counter(v for yy in range(8) for v in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);mode.append(min(ct,key=lambda v:(-ct[v],v)))
 samples+=w*h*64
 mi=Image.new('RGBA',(w,h));mi.putdata(mode)
 check(equal(mi,rgba(R/f'r17-C-mode-{n}.png')),n+': exact mode replay')
 final=mi.copy()
 for x,y,before,after in rec['cleanup']:
  check(final.getpixel((x,y))==tuple(before),n+f': cleanup source {x},{y}')
  final.putpixel((x,y),tuple(after))
 check(equal(final,rgba(R/f'r17-C-clean-{n}.png')),n+': cleanup replay')
 if rec['selected']:export_replay[rec['output']]=final
for rec in joins:
 key=Path(rec['output']).stem;im=export_replay[key]
 for x,y,before,after in rec['changes']:
  check(im.getpixel((x,y))==tuple(before),key+f': join source {x},{y}');im.putpixel((x,y),tuple(after))
for n in names:
 key=chosen[n]['output'];check(equal(rgba(O/(n+'.png')),export_replay[key]),n+': final export replay')
for n in ('street-main','street-side','street-junction','lane','mud-edge'):
 a=rgba(O/(n+'.png'));native=reviews.repeat(a,(a.width*3,a.height*3))
 if n=='mud-edge':bg=reviews.repeat(reviews.GROUND,native.size);bg.alpha_composite(native);native=bg
 for scale in (1,4):check(equal(rgba(R/f'r17-C-repeat-{n}-{scale}x.png'),native.resize((native.width*scale,native.height*scale),NN)),n+f': literal 3x3 at {scale}x')

layouts=c.c_layouts();route_counts={};roof_counts={};shadow_counts={}
for name,layout in layouts.items():
 native,placements=c.c_render(layout);check(equal(native,rgba(R/f'r17-C-critic-{name}-1x.png')),name+': composer replay')
 check(equal(native.resize((native.width*3,native.height*3),NN),rgba(R/f'r17-C-critic-{name}-3x.png')),name+': exact 3x critic')
 check(equal(native.convert('L').convert('RGBA'),rgba(R/f'r17-C-critic-{name}-squint-1x.png')),name+': greyscale squint')
 for scale in (1,3):
  sheet=rgba(R/f'r17-C-critic-{name}-comparison-{scale}x.png');a=native.resize((native.width*scale,native.height*scale),NN)
  check(equal(sheet.crop((12,34,12+a.width,34+a.height)),a),name+f': comparison scene {scale}x')
  y=12
  for ref in ('round15-street','current-town'):
   a=rgba(ART/f'reference/r17/{ref}.png');x=native.width*scale+36
   check(equal(sheet.crop((x,y+22,x+a.width,y+22+a.height)),a),name+f': literal {ref} reference {scale}x');y+=a.height+40
 occupied=Image.new('L',tuple(layout['size']));roofmask=Image.new('L',occupied.size)
 for b in layout['lots']:
  a,_=c.build_c(b['spec']);x,y=b['x'],b['base']-a.height;occupied.paste(a.getchannel('A'),(x,y))
  floors=b['spec'].get('floors',1+len(b['spec'].get('storeys',[])));rh=a.height-floors*48
  roofmask.paste(a.getchannel('A').crop((0,0,a.width,rh)),(x,y))
 if layout.get('joined_l'):
  j=layout['joined_l'];a=c.joined_l_roof(j.get('colour',0));roofmask.paste(a.getchannel('A'),(j['x'],j['y']))
 for prop in layout.get('props',[]):
  if prop['file']=='pilot-person':continue
  a=c.asset(prop['file']) if not prop.get('path') else rgba(ART/prop['path'])
  layer=Image.new('L',occupied.size);layer.paste(a.getchannel('A'),(prop['x'],prop['base']-a.height));occupied=ImageChops.lighter(occupied,layer)
 route_counts[name]=[]
 for x,y,w,h in layout.get('clear_routes',[]):
  count=sum(v>0 for v in occupied.crop((x,y,x+w,y+h)).get_flattened_data());route_counts[name].append(dict(rect=[x,y,w,h],blocked_pixels=count));check(count==0,name+f': clear route {x},{y},{w},{h}')
 roof_counts[name]=[]
 for x,y,w,h in layout.get('required_roofs',[]):
  count=sum(v<255 for v in roofmask.crop((x,y,x+w,y+h)).get_flattened_data());roof_counts[name].append(dict(rect=[x,y,w,h],uncovered_pixels=count));check(count==0,name+f': covered roof {x},{y},{w},{h}')
 # Known south road receivers contain actual darkened drawn ground.
 ground=c.c_ground(tuple(layout['size']),layout['roads']);darkened=0
 for b in layout['lots']:
  a,_=c.build_c(b['spec']);x,y=b['x'],b['base'];h=min(6,native.height-y)
  if h>0:
   fg=list(native.crop((x,y,x+a.width,y+h)).convert('L').get_flattened_data());bg=list(ground.crop((x,y,x+a.width,y+h)).convert('L').get_flattened_data());darkened+=sum(v<t for v,t in zip(fg,bg))
 shadow_counts[name]=darkened;check(darkened>0,name+': visible south shadows')

snapshot=json.loads((R/'r17-C-before.json').read_text());protected=0;changed=[]
allowed={'art-drop/NOTES.md','art-drop/out/city17/compose.py'}
for rel,digest in snapshot.items():
 if rel in allowed:continue
 f=ROOT/rel;okay=f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==digest
 check(okay,'protected: '+rel);protected+=int(okay)
 if not okay:changed.append(rel)
new_files=[]
for f in ART.rglob('*'):
 if not f.is_file():continue
 rel=str(f.relative_to(ROOT))
 if rel in snapshot:continue
 new_files.append(rel);check((f.parent==R and f.name.startswith('r17-C-')) or (f.parent==O and f.stem in names and f.suffix=='.png'),'new file scope: '+rel)
report=dict(status='PASS' if not failures else 'FAIL',checks=len(checks),failures=failures,source_drawings=len(records),selected_drawings=sum(bool(r.get('selected')) for r in records),exports=len(names),pixel_unique_exports=len({rgba(O/(n+'.png')).tobytes() for n in names}),mode_samples_replayed=samples,colour_range=[min(colour_counts.values()),max(colour_counts.values())],protected_files_unchanged=protected,protected_changes=changed,route_clearance=route_counts,roof_coverage=roof_counts,shadow_receiver_darkened_pixels=shadow_counts,alpha_components=components,new_files=len(new_files),limitations=['Saved-art self-review; no independent or engine approval.','Current halls/well/two stall drawings are labelled Part D proxies; final landmark/gate hierarchy awaits D.','24px lane is exported but not used as a required clear route.'])
(R/'r17-C-verification.json').write_text(json.dumps(report,indent=2)+'\n')
(R/'r17-C-source-hashes.json').write_text(json.dumps({r['source']:hashlib.sha256((R/r['source']).read_bytes()).hexdigest() for r in records},indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('alpha_components','route_clearance','roof_coverage')},indent=2))
raise SystemExit(bool(failures))
