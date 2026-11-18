"""Critic2 visible-pixel and property-boundary acceptance proofs, not runtime tests."""
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
from collections import Counter,deque
import importlib.util,hashlib,json,copy
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
NN=Image.Resampling.NEAREST
checks=[]
def check(n,v,d=None):checks.append(dict(name=n,passed=bool(v),detail=d))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(n,im,scales=(1,4)):
 for z in scales:im.resize((im.width*z,im.height*z),NN).save(R/f'r17-C6-critic2-proof-{n}-{z}x.png')
def touch(a,b):
 return ((a[0]+a[2]==b[0] or b[0]+b[2]==a[0]) and min(a[1]+a[3],b[1]+b[3])>max(a[1],b[1])) or ((a[1]+a[3]==b[1] or b[1]+b[3]==a[1]) and min(a[0]+a[2],b[0]+b[2])>max(a[0],b[0]))
def run():
 l=c.c6_city_layout();im,_,shadows=c.c6_render(l)
 before=json.loads((R/'r17-C6-critic2-before-hashes.json').read_text());critic=json.loads((R/'critic-r17C6-2.json').read_text());failed=set(critic['failed']);protected=[];changed=[]
 for path,h in before.items():
  p=Path(path)
  if p.parent.resolve()==O.resolve() and p.suffix=='.png' and p.stem not in failed:
   protected.append(path)
   if sha(p)!=h:changed.append(path)
 check('all passing and earlier city PNGs byte-identical',not changed,dict(count=len(protected),changed=changed))
 for n in failed:
  p=O/(n+'.png')
  if p.exists():check(n+' failed drawing actually replaced',sha(p)!=before[str(p.relative_to(Path.cwd()))])
 check('fresh native equals saved final',im.tobytes()==Image.open(R/'r17-city-final.png').convert('RGBA').tobytes())
 for n,box in {'square':(480,336,1200,1200),'street':(96,240,720,816),'gate':(1104,768,1776,1440)}.items():
  a=im.crop(box);check(n+' exact3x crop',a.resize((a.width*3,a.height*3),NN).tobytes()==Image.open(R/f'r17-city-final-crop-{n}-3x.png').tobytes())
 for hand in ('left','right'):
  a=c.asset('receiving-wall-'+hand+'-c6r1');rows=[y for y in range(a.height) if not a.crop((0,y,16,y+1)).getbbox()]
  check(hand+' full240px receiver has no transparent slit',not rows,rows)
  check(hand+' all16 columns opaque throughout body',a.crop((0,1,16,240)).getchannel('A').getextrema()==(255,255))
  check(hand+' single-pixel straight exposed outline',len({a.getpixel((15,y)) for y in range(1,240)})==1)
  panel=c.repeat(c.asset('cobble-c3'),(32,256));panel.alpha_composite(a,(8,8));save('receiver-'+hand,panel)
 for n in ('ground-house-a-c6r1','storey-house-a-c6r1','storey-house-b-c6r1','storey-house-c-c6r1'):
  check(n+' left margin keeps full80px facade without window clipping',c.c6_end_panel(n,'left').crop((16,0,96,48)).tobytes()==c.asset(n).crop((0,0,80,48)).tobytes())
 b=next(b for b in l['lots'] if b['id']=='west-1');a=c.c6_build(b['spec'])[0]
 check('northwest24px passage retains exact entrance paint and coordinates',a.crop((60,a.height-48,84,a.height)).tobytes()==c.asset('ground-passage-w2-c6').crop((60,0,84,48)).tobytes())
 for n in ('inn-rear-west','inn-rear-middle','inn-rear-east','tailor-rear','scribe-rear'):
  b=next(b for b in l['lots'] if b['id']==n);minimum=3 if n.startswith('inn-') else 2
  check(n+' district-specific commercial height',b['spec']['floors']>=minimum,b['spec']['floors'])
 # Check the actual source-pixel gate assembly; no rectangular subtraction.
 gate=next(p for p in l['props'] if p.get('id')=='gatehouse');source=c.r_prop_image(gate);owned=c.c4_owned_prop(l,gate)
 check('all original gate tower and portal pixels retained',source.tobytes()==owned.tobytes())
 x0=gate['x'];y0=gate['base']-source.height
 obsolete=[]
 for y in range(216,267):
  for x in range(24,120):
   q=source.getpixel((x,y))
   if q[3] and q[2]>q[0]*1.1 and q[1]>q[0]:obsolete.append((x,y))
 residual=[(x,y) for x,y in obsolete if (lambda q:q[2]>q[0]*1.1 and q[1]>q[0])(im.getpixel((x+x0,y+y0)))]
 check('no obsolete slate pixels visible over the bridge',not residual,dict(inspected=len(obsolete),residual=residual))
 bearing=next(p for p in l['props'] if p.get('id')=='gate-bearing');paint=c.r_prop_image(bearing);overlap=[]
 for lo,hi in ((0,48),(96,144)):
  count=0
  for y in range(paint.height):
   for x in range(paint.width):
    sx=bearing['x']-gate['x']+x;sy=bearing['base']-paint.height-y0+y
    if lo<=sx<hi and paint.getpixel((x,y))[3] and source.getpixel((sx,sy))[3]:count+=1
  overlap.append(count)
 check('bearing paint meets both intact tower faces',min(overlap)>100,overlap)
 # The drawn boundary masks, independently from any closed=True declaration.
 bounds=Image.new('L',im.size);private=Image.new('L',im.size);solid=Image.new('L',im.size)
 d=ImageDraw.Draw(private)
 for p in l['plots']:
  x,y,w,h=p['yard'];d.rectangle((x,y,x+w-1,y+h-1),fill=255)
 d=ImageDraw.Draw(solid)
 for b in l['lots']+l['props']:
  if b.get('overhead'):continue
  for x,y,w,h in b.get('ground_footprints',b.get('footprints',[b['footprint']] if b.get('footprint') else [])):d.rectangle((x,y,x+w-1,y+h-1),fill=255)
 visible_boundary=c.c6_ground(l)
 for p in l['props']:
  if not p.get('boundary_rect'):continue
  a=c.r_prop_image(p);mask=Image.new('L',im.size);mask.paste(a.getchannel('A'),(p['x'],p['base']-a.height));bounds=ImageChops.lighter(bounds,mask);visible_boundary.alpha_composite(a,(p['x'],p['base']-a.height))
  x,y,w,h=p['boundary_rect']
  check(p.get('id',p['owner'])+' continuous actual boundary paint',all(mask.getpixel((xx,yy)) for yy in range(y,y+h) for xx in range(x,x+w)))
 # Named strips cover every formerly unassigned interval, with no paving gaps.
 for name,rect in {'northwest':[240,432,96,192],'middle':[528,480,96,144],'east':[1680,480,96,144],'southwest-west':[144,1056,96,144],'southwest-middle':[240,1056,96,192],'inn':[1200,816,288,144],'eastern-trades':[1584,816,192,144]}.items():
  x,y,w,h=rect;check(name+' former rear/front gap entirely assigned to connected working strips',private.crop((x,y,x+w,y+h)).getextrema()==(255,255))
 check('every rear strip48/96px wide and deep',all(p['yard'][2] in (48,96) and p['yard'][3] in (48,96) for p in l['plots']))
 for p in l['plots']:
  todo=deque([p['id']]);seen=set(todo);connected=False
  while todo:
   ident=todo.popleft();cur=next(q for q in l['plots'] if q['id']==ident)
   if touch(cur['yard'],p['front']):connected=True;break
   for q in l['plots']:
    if q['id'] not in seen and touch(cur['yard'],q['yard']):seen.add(q['id']);todo.append(q['id'])
  check(p['id']+' connected to actual principal footprint',connected,p['front'])
 check('churchyard full288px west boundary has no open row',all(bounds.getpixel((483,y)) for y in range(768,1056)))
 check('northwest24px passage crosses both subdivided rear strips',not any(bounds.getpixel((x,y)) for y in (528,) for x in range(300,324)))
 # Proofs use the finished scene and the actual drawn fences without roofs.
 for name,box in {'northwest':(144,336,432,720),'middle-yards':(480,384,672,720),'east-yards':(1632,384,1776,720),'southern-yards':(144,1008,384,1344),'commercial-heights':(1152,576,1776,1056),'churchyard':(456,744,552,1072),'gate-bearing':(1176,1224,1344,1392)}.items():save(name,im.crop(box))
 for name,box in {'northwest-boundaries':(232,424,344,632),'middle-boundaries':(472,424,680,632),'southern-boundaries':(136,1048,392,1256),'trade-boundaries':(1192,808,1496,968)}.items():save(name,visible_boundary.crop(box))
 for depth in (96,144):
  for tone in ('','slate','brown'):
   a,parts=c.c6_unlike_roofs(depth,tone);check('unlike'+str(depth)+tone+' both contacts contain no ground holes',all(a.getpixel((x,y))[3] for y in range(12,depth) for x in list(range(40,56))+list(range(136,152))))
 old=Image.open(R/'r17-C6-critic2-before-r17-city-final.png').convert('RGBA');comparison=Image.new('RGBA',(3840,1472),(35,39,34,255));d=ImageDraw.Draw(comparison);d.text((12,8),'CRITIC2 INPUT / NATIVE1X',fill='white');d.text((1932,8),'CRITIC2 REPAIR / NATIVE1X',fill='white');comparison.alpha_composite(old,(0,32));comparison.alpha_composite(im,(1920,32));comparison.save(R/'r17-C6-critic2-before-after-1x.png')
 hist=Counter(b['spec']['floors'] for b in l['lots']);allhist=hist.copy()
 for p in l['props']:
  if p['file'].startswith(('lean-to','stable-range','court-closure','market-hall')):allhist[2 if p['file'].startswith('court-closure') else 1]+=1
 check('one-storey fraction below25percent including ancillary buildings',allhist[1]/sum(allhist.values())<=.25,dict(allhist))
 report=dict(checks=checks,passed=sum(x['passed'] for x in checks),failed=[x for x in checks if not x['passed']],protected_city_pngs=len(protected),storeys=dict(hist),storeys_including_ancillary=dict(allhist),one_storey_fraction=allhist[1]/sum(allhist.values()),scope='Saved-art self-checks; not independent panel approval or runtime collision/navigation tests')
 (R/'r17-C6-critic2-final-proof.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
if __name__=='__main__':run()
