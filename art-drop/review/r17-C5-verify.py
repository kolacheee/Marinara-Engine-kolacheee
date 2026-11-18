"""Replay the source reduction; inspect final exported paint and scene geometry."""
from pathlib import Path
from PIL import Image,ImageChops
from collections import Counter
import importlib.util,hashlib,json,copy
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
checks=[]
def check(name,value,**data):checks.append(dict(name=name,passed=bool(value),**data))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def components(a):
 w,h=a.size;todo={i for i,v in enumerate(a.getchannel('A').get_flattened_data()) if v};out=[]
 while todo:
  stack=[todo.pop()];n=0
  while stack:
   i=stack.pop();n+=1;x,y=i%w,i//w
   for yy in range(max(0,y-1),min(h,y+2)):
    for xx in range(max(0,x-1),min(w,x+2)):
     j=yy*w+xx
     if j in todo:todo.remove(j);stack.append(j)
  out.append(n)
 return out
files=json.loads((R/'r17-C5-files.json').read_text())
for n,r in files.items():
 a=c.asset(n);v=list(a.get_flattened_data());islands=components(a)
 check(n+' export integrity',list(a.size)==r['size'] and sha(O/(n+'.png'))==r['sha256'] and set(q[3] for q in v)<={0,255} and all(q==(0,0,0,0) for q in v if not q[3]),size=list(a.size),colours=len(set(q for q in v if q[3])))
 check(n+' no detached alpha specks',all(k>2 for k in islands),components=islands)
 a1=Image.open(R/f'r17-C5-piece-{n}-1x.png');a4=Image.open(R/f'r17-C5-piece-{n}-4x.png');check(n+' native and exact4x review',a4.tobytes()==a1.resize((a1.width*4,a1.height*4),c.NEAREST).tobytes())
 if n.endswith(('-slate','-brown')):
  donor=c.asset(n.rsplit('-',1)[0]);check(n+' silhouette preserved',a.getchannel('A').tobytes()==donor.getchannel('A').tobytes())
 if n.startswith(('ground-','storey-','floor-','inn-front-c5','shop-')):
  donor=c.asset('ground-shop-w2-c0');x=48 if '-right-c5-w1' in n else 0
  check(n+' fixed courses0/47',all(a.crop((0,y,a.width,y+1)).tobytes()==donor.crop((x,y,x+a.width,y+1)).tobytes() for y in (0,47)))
samples=0
for rec in json.loads((R/'r17-C5-processing.json').read_text())['drawings']:
 n=rec['id'];a=Image.open(R/f'r17-C5-registered-{n}.png').convert('RGBA');mode=Image.open(R/f'r17-C5-mode-{n}.png').convert('RGBA');w,h=mode.size;v=list(a.get_flattened_data());expected=[]
 for y in range(h):
  for x in range(w):
   votes=Counter(p for yy in range(8) for p in v[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);expected.append(min(votes,key=lambda p:(-votes[p],p)))
 samples+=w*h*64;check(n+' exact64vote mode and source',expected==list(mode.get_flattened_data()) and sha(R/rec['source'])==rec['source_sha256'],samples=w*h*64)
protected=json.loads((R/'r17-C5-before-hashes.json').read_text())
allowed={'art-drop/out/city17/compose.py','art-drop/NOTES.md'}|{'art-drop/review/'+n for n in ('r17-city-final.png','r17-city-final-2x.png','r17-city-final-squint.png','r17-city-final-vs-r15-vs-today.png','r17-city-final-crop-square-3x.png','r17-city-final-crop-street-3x.png','r17-city-final-crop-gate-3x.png')}
changed=[p for p,h in protected.items() if p not in allowed and sha(Path(p))!=h]
check('prior files outside named scope byte identical',not changed,protected=len(protected)-len(allowed),changed=changed)
l=c.c5_city_layout();a=c.c4_instance_audit(l);(R/'r17-C5-repeat-audit.json').write_text(json.dumps(a,indent=2));check('final instance repetition including exposed paint',not a['failures'],**a)
rs=importlib.util.spec_from_file_location('review',R/'r17-C5-review.py');rv=importlib.util.module_from_spec(rs);rs.loader.exec_module(rv)
proof=rv.acceptance_layout();pa=c.c4_instance_audit(proof);check('C5 L/T exact acceptance layout repetition',not pa['failures'],**pa)
for n,p in c.e_layouts().items():
 a=c.c4_instance_audit(p);check(n+' instance repetition',not a['failures'],**a)
for n in ('L-block','market','height-test'):
 q=c.e_entrance_approaches(c.e_layouts()[n]);check(n+' retained door approaches',all(not p['blocked_pixels'] and p['inside_canvas'] for p in q),count=len(q))
bad=copy.deepcopy(c.e_layouts()['L-block'])
for b in bad['lots']:
 if b['id']=='north-rear-3':b['spec'].pop('roof_file',None)
check('original rear cap defect detected',bool(c.c4_instance_audit(bad)['failures']))
bad=copy.deepcopy(c.e_layouts()['market'])
for b in bad['lots']:
 if b['id'].startswith('trade-'):b['spec']['ground_file']='ground-shop-v1-w2-c0'
check('original eight trade front defect detected',bool(c.c4_instance_audit(bad)['failures']))
bad=copy.deepcopy(l);b=next(b for b in bad['lots'] if b['id']=='square-apothecary');b['spec']['panels'][1:]=['storey-recessed-c4-w2']*4
check('northeast repeated vertical stack detected',bool(c.c4_instance_audit(bad)['failures']))
hist=Counter(b['spec']['floors'] for b in l['lots']);check('one-storey share below25percent',hist[1]/len(l['lots'])<=.25,storeys=dict(hist),buildings=len(l['lots']),percent=100*hist[1]/len(l['lots']))
ancillary=sum(p['file'] in ('lean-to-c4','stable-range-c4','townhall-market-c5') for p in l['props'])
inclusive=hist.copy();inclusive[1]+=ancillary
for p in l['props']:
 if p.get('storeys'):inclusive[p['storeys']]+=1
check('including sheds stable and open market hall at most25percent',inclusive[1]/sum(inclusive.values())<=.25,storeys=dict(inclusive),buildings=sum(inclusive.values()),percent=100*inclusive[1]/sum(inclusive.values()),scope='Modular residential/trade/rear buildings plus all seven separate one-storey ancillary ranges and the two-storey staircourt closure; porch and gate toll attachment belong to their parent landmark. Church, guildhall and defensive towers are separate landmark structures, not house stacks.')
check('48px registration',l['size']==[1920,1440] and all(b['x']%48==0 and b['base']%48==0 for b in l['lots']))
check('six stalls and occupied square',len([p for p in l['props'] if p.get('id','').startswith('stall-')])==6 and all(any(p.get('id')==n for p in l['props']) for n in ['fountain','market-cross','market-hall','church-east-door']))
check('no frontage lawn',not l['gardens'] and all('grass' not in r['file'] for r in l['roads']))
check('10x7 notched square',l['square'][2:]==[480,336] and l['square_notch'][2:]==[96,96])
xs=sorted(p['x'] for p in l['props'] if p.get('id','').startswith('north-tower-'));gaps=[(b-a)//48 for a,b in zip(xs,xs[1:])]
check('single NW tower and unequal intervals',xs.count(0)==1 and len(set(gaps))>2,gaps=gaps)
check('three south tower positions',all(any(p.get('wall') and 'tower-' in p['file'] and p['x']==x and p['base']==1440 for p in l['props']) for x in (432,816,1584)))
check('south wall A B C A B', [next(p['file'] for p in l['props'] if p.get('chain')=='south-curtain' and p['x']==x) for x in range(192,672,96)]==['wall-top-'+v+'-c5' for v in 'abcab'])
mask=Image.new('L',tuple(l['size']));paint=[]
for b in l['lots']+l['props']:
 a=c.build_c(b['spec'])[0] if 'spec' in b else c.c4_owned_prop(l,b);m=a.getchannel('A').copy()
 if b.get('foreground_mask'):m.paste(0,tuple(b['foreground_mask']))
 q=Image.new('L',mask.size);q.paste(m,(b['x'],b['base']-a.height));mask=ImageChops.lighter(mask,q);paint.append((b.get('id',b.get('file')),q))
entrances=[]
for b in l['lots']+l['props']:
 if not b.get('entrance') or b.get('id')=='gatehouse':continue
 x,y=b['entrance'];w=48 if b.get('id') in ('cathedral','guildhall','gate-road-inn','church-east-door') else 24;h=48 if w==48 else 32;di=b.get('entrance_direction','S');box=(x-w//2,y,x+w//2,y+h)
 if di=='W':box=(x-h,y-w//2,x,y+w//2)
 if di=='E':box=(x,y-w//2,x+h,y+w//2)
 if di=='N':box=(x-w//2,y-h,x+w//2,y)
 blocked=sum(v>0 for v in mask.crop(box).get_flattened_data());entrances.append(dict(id=b['id'],box=box,blocked=blocked))
check('all usable door landings clear',all(not e['blocked'] for e in entrances),count=len(entrances),failures=[e for e in entrances if e['blocked']])
routes=[]
for r in l['roads']:
 if not r.get('clear'):continue
 x,y,w,h=r['rect'];box=(x,y,x+w,y+h);n=sum(v>0 for v in mask.crop(box).get_flattened_data());routes.append(dict(id=r['id'],rect=r['rect'],blocked=n,owners=[p for p,q in paint if q.crop(box).getbbox()] if n else []))
check('every declared route clear of ground paint',all(not r['blocked'] for r in routes),count=len(routes),failures=[r for r in routes if r['blocked']])
check('main96 side48 lane24',all(min(r['rect'][2:])>={'main':96,'side':48,'lane':24,'square':288}[r['kind']] for r in l['roads']))
# All straight road reaches between actual T nodes and elbows. The long
# northern wall lane is split by the real guild service branch at x1008.
reaches=c.c4_route_reaches(l)
check('no unbranched street reach exceeds8cells',all(r['length']<=384 for r in reaches),maximum=max(r['length'] for r in reaches),failures=[r for r in reaches if r['length']>384])
check('gate arch96px clear ground',not mask.crop((1200,1392,1296,1440)).getbbox())
check('inn court west48px clear',not mask.crop((1488,864,1536,1056)).getbbox())
check('west court48px opening',not mask.crop((288,912,336,1008)).getbbox())
check('connector closes east bypass',any(p.get('id')=='gate-east-connector' and p.get('footprint')==[1296,1392,48,48] for p in l['props']))
g=c.asset('gate-supports-c4').copy();g.alpha_composite(c.asset('gate-overhead-c4'));check('gate masks reconstruct gate',g.tobytes()==c.asset('gatehouse-c4').tobytes())
signs=[]
for b in l['lots']:
 for p in b['spec'].get('overlays',[]):
  a=c.asset(p['file']);signs.append(dict(lot=b['id'],contained=0<=p['x'] and p['x']+a.width<=b['spec']['width']*48,above_door=p.get('y_offset',-144)+a.height<=-48))
check('all signs contained and above ground doors',all(p['contained'] and p['above_door'] for p in signs),signs=signs)
vis=c.c4_visibility(l);actors=[]
for p in l['props']:
 if p.get('role') or p.get('file','').startswith('person'):
  ident=p.get('id',p['file']+':'+str(p['x'])+':'+str(p['base']));v=vis.get((ident,'prop'),b'');actors.append(dict(id=ident,visible=sum(bool(x) for x in v)))
check('no fully hidden actors',all(a['visible'] for a in actors),actors=actors)
im,_,shade=c.c5_render(l);check('final image matches composer',im.tobytes()==Image.open(R/'r17-city-final.png').convert('RGBA').tobytes());check('exact2x final',im.resize((3840,2880),c.NEAREST).tobytes()==Image.open(R/'r17-city-final-2x.png').tobytes());check('native greyscale',im.convert('L').tobytes()==Image.open(R/'r17-city-final-squint.png').tobytes())
for n,box in {'square':(672,624,1392,1152),'street':(96,240,720,816),'gate':(1104,768,1776,1440)}.items():
 a=im.crop(box);check(n+' exact3x crop',a.resize((a.width*3,a.height*3),c.NEAREST).tobytes()==Image.open(R/f'r17-city-final-crop-{n}-3x.png').tobytes())
for n in ['roof-fill-left-c5','roof-fill-right-c5','square-slabs-c5','workyard-c4','main-paving-c4','cobble-c3','street-main-c3','street-side-c3','lane-c3','ditch-c3']:
 a=c.asset(n);g=c.asset_path_grass() if n=='ditch-c3' else c.asset('cobble-c3');expected=c.repeat(g,(a.width*3,a.height*3))
 for yy in range(3):
  for xx in range(3):expected.alpha_composite(a,(xx*a.width,yy*a.height))
 a1=Image.open(R/f'r17-C5-repeat-{n}-1x.png');a4=Image.open(R/f'r17-C5-repeat-{n}-4x.png');check(n+' literal3x3 and exact4x',a1.tobytes()==expected.tobytes() and a4.tobytes()==a1.resize((a1.width*4,a1.height*4),c.NEAREST).tobytes())
# Connected public rectangles: touching along an edge must have nonzero span.
public=[r for r in l['roads'] if r.get('clear') or r['kind']=='square']
def meet(a,b):
 x,y,w,h=a;u,v,r,t=b;dx=min(x+w,u+r)-max(x,u);dy=min(y+h,v+t)-max(y,v)
 return dx>=0 and dy>=0 and (dx>0 or dy>0)
seen={i for i,r in enumerate(public) if r['rect'][0]<=1248<r['rect'][0]+r['rect'][2] and r['rect'][1]<=1439<r['rect'][1]+r['rect'][3]}
while True:
 more={j for j,r in enumerate(public) if j not in seen and any(meet(r['rect'],public[i]['rect']) for i in seen)}
 if not more:break
 seen|=more
check('all declared public streets connect to gate',len(seen)==len(public),segments=len(public),disconnected=[r for i,r in enumerate(public) if i not in seen])
# The repeat test must reject aliases and three matching silhouettes as well.
bad=copy.deepcopy(l)
for b in bad['lots']:
 if b['id'] in ('south-L-3','south-L-4','south-square-west'):b['spec']['roof_file']='roof-gable-c5-w1'
check('three repeated south narrow caps detected',bool(c.c4_instance_audit(bad)['failures']))
roof_hist=Counter(b['spec'].get('tone') or 'terracotta' for b in l['lots'])
check('mixed roof families roughly half terracotta',.4<=roof_hist['terracotta']/len(l['lots'])<=.6 and roof_hist['slate']>0 and roof_hist['brown']>0,counts=dict(roof_hist))
vendors=Counter(p['file'] for p in l['props'] if p.get('role')=='vendor')
check('three distinct vendors each twice',len(vendors)==3 and set(vendors.values())=={2},counts=dict(vendors))
check('shadows union capped below50percent',all(p['opacity']<=127 and p['receiver'][2]>0 and p['whole_caster'] for p in shade),opacity=96,casters=len(shade))
check('fountain has48px clear to south hall',next(p for p in l['props'] if p.get('id')=='market-hall')['base']-144-next(p for p in l['props'] if p.get('id')=='fountain')['base']==48)
check('three matching trade goods panels',all(next(b for b in l['lots'] if b['id']==ident)['spec']['panels'][0]==file for ident,file in [('square-apothecary','ground-apothecary-c5-w2'),('west-cobbler','ground-cobbler-c5-w2'),('east-tailor','ground-tailor-c5-w2')]))
data=dict(passed=sum(x['passed'] for x in checks),failed=sum(not x['passed'] for x in checks),checks=checks,mode_samples=samples,exports=len(files),buildings=len(l['lots']),storeys=dict(hist),single_storey_percent=100*hist[1]/len(l['lots']),roof_mix=dict(roof_hist),inclusive_storeys=dict(inclusive),inclusive_buildings=sum(inclusive.values()),actors=len(actors),entrances=entrances,routes=routes)
(R/'r17-C5-geometry-inspect.json').write_text(json.dumps(dict(entrances=entrances,routes=routes),indent=2))
(R/'r17-C5-verification.json').write_text(json.dumps(data,indent=2));print(json.dumps({k:v for k,v in data.items() if k not in ('checks','entrances','routes')},indent=2))
for q in checks:
 if not q['passed']:print(json.dumps(q))
if data['failed']:raise SystemExit(1)
