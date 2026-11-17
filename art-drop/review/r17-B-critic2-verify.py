"""Scoped saved-art checks and regressions for critic-r17B-2."""
from pathlib import Path
from collections import Counter
import hashlib,importlib.util,json,re
from PIL import Image
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17'
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
c=module('city_verify',O/'compose.py');p=module('process_verify',R/'r17-B-process.py')
def image(path):return Image.open(path).convert('RGBA')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
checks=[]
def check(ok,label):checks.append(dict(check=label,passed=bool(ok)))
before=json.loads((R/'r17-B-critic2-before-hashes.json').read_text())
failed={'roof-fill-w1'+suffix+'.png' for suffix in ('','-c0','-c1','-c2')}
index=json.loads((R/'r17-B-files.json').read_text())
allowed=set(p.PAL+sum(p.RAMPS,[])+[(30,30,30),(27,32,39),(38,31,23)])
check(len(index)==137,'137 Part B exports retained')
for name,info in index.items():
 a=image(O/name);px=list(a.get_flattened_data());shadow=name.startswith('shadow-')
 check(a.size==tuple(info['size']),name+' native dimensions')
 check(all(v[3] in ((0,112) if shadow else (0,255)) for v in px),name+' alpha contract')
 check(all(v[3] or v[:3]==(0,0,0) for v in px),name+' zero hidden RGB')
 check(all(v[:3] in allowed for v in px if v[3]),name+' fixed palette')
 check(hashlib.sha256(a.tobytes()).hexdigest()==info['pixels_sha256'],name+' current proof pixels')
 check((sha(O/name)!=before['art-drop/out/city17/'+name]) if name in failed else sha(O/name)==before['art-drop/out/city17/'+name],name+(' redrawn' if name in failed else ' passing file byte-identical'))
 if name.startswith(('roof-','firewall-')):check(a.getchannel('A').getextrema()==(255,255),name+' opaque footprint')
 if re.search(r'-c[012]\.png$',name):
  base=re.sub(r'-c[012](?=\.png$)','',name)
  check(a.getchannel('A').tobytes()==image(O/base).getchannel('A').tobytes(),name+' colourway silhouette')
  check(a.tobytes()==p.colour(image(O/base),int(name[-5])).tobytes(),name+' exact material remap')
 proof=Image.open(R/info['proof']);w,h=json.loads(proof.info['PairSize']);q1,q4=json.loads(proof.info['PairOrigins'])
 check(proof.crop((*q1,q1[0]+w,q1[1]+h)).resize((w*4,h*4),Image.Resampling.NEAREST).tobytes()==proof.crop((*q4,q4[0]+w*4,q4[1]+h*4)).tobytes(),name+' exact 1x/4x beside reference')
 pending={i for i,v in enumerate(px) if v[3]};small=[]
 while pending:
  seed=pending.pop();queue=[seed];count=0
  while queue:
   i=queue.pop();count+=1;y,x=divmod(i,a.width)
   for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
    k=yy*a.width+xx
    if 0<=xx<a.width and 0<=yy<a.height and k in pending:pending.remove(k);queue.append(k)
  if count<3:small.append(count)
 check(not small,name+' no detached alpha specks')
blocks=0;edits=0
for r in json.loads((R/'r17-B-critic2-processing.json').read_text()):
 w,h=r['size'];reg=image(R/f"r17-B-registered-{r['id']}.png");v=list(reg.get_flattened_data());votes=[]
 for y in range(h):
  for x in range(w):
   counts=Counter(k for dy in range(8) for k in v[(y*8+dy)*w*8+x*8:(y*8+dy)*w*8+x*8+8])
   votes.append(min(counts,key=lambda k:(-counts[k],k)))
 check(votes==list(image(R/f"r17-B-mode-{r['id']}.png").get_flattened_data()),r['id']+' exact 64-sample mode')
 for x,y,old,new in r['cleanup']:
  check(votes[y*w+x]==tuple(old),r['id']+' recorded cleanup source');votes[y*w+x]=tuple(new)
 a=Image.new('RGBA',(w,h));a.putdata(votes)
 if r.get('assembly'):
  b=Image.new('RGBA',(48,48));b.paste(a,(0,0));b.paste(a.crop((0,0,16,48)),(32,0));a=b
 check(a.tobytes()==image(R/f"r17-B-clean-{r['id']}.png").tobytes(),r['id']+' complete registration/cleanup/wrap replay')
 blocks+=w*h;edits+=len(r['cleanup'])
for colour in range(3):
 fill=c.asset(f'roof-fill-w1-c{colour}')
 check(fill.size==(48,48),'48px fill contract c'+str(colour))
 check(c.repeat(fill,(144,144)).tobytes()==image(R/f'r17-B-repeat-roof-fill-w1-c{colour}-1x.png').tobytes(),'literal 3x3 fill c'+str(colour))
 for width in (1,2,3):
  cap=c.asset(f'roof-ridge-w{width}-c{colour}')
  for depth in (3,4,5):
   spec=c.make_spec(width,1,'door',0,0,'ridge');spec.update(roof_depth=depth,roof_colour=colour)
   a,parts=c.build(spec);roof=a.crop((0,0,a.width,48*depth))
   check(roof.size==(48*width,48*depth),f'w{width} c{colour} d{depth} exact extent')
   check(roof.getchannel('A').getextrema()==(255,255),f'w{width} c{colour} d{depth} no ground holes')
   check(all(roof.getpixel((x,y))==p.DARK for x in (0,roof.width-1) for y in range(roof.height)),f'w{width} c{colour} d{depth} continuous one-pixel verges')
   split,_=c.CAP_COURSES[width];extra=48*(depth-2)
   check(roof.crop((0,0,roof.width,split)).tobytes()==cap.crop((0,0,cap.width,split)).tobytes(),f'w{width} c{colour} d{depth} intact north interface')
   check(roof.crop((0,split+extra,roof.width,roof.height)).tobytes()==cap.crop((0,split,cap.width,cap.height)).tobytes(),f'w{width} c{colour} d{depth} intact south interface')
   check(sum(z['crop'][3]-z['crop'][1] for z in parts if z['layer']=='roof fill adapter')==extra,f'w{width} c{colour} d{depth} native course adapters cover extension')
 join=c.joined_l_roof(colour).convert('L')
 mean=lambda b:sum(join.crop(b).get_flattened_data())/((b[2]-b[0])*(b[3]-b[1]))
 check(mean((4,4,43,140))-mean((52,4,91,140))>10,f'L c{colour} distinct west/east planes')
 check(mean((100,198,280,232))-mean((100,148,280,186))>6,f'L c{colour} distinct south/north planes')
layouts=c.critic_layouts()
for name,layout in layouts.items():
 a,records=c.scene(layout)
 check(a.tobytes()==image(R/f'r17-B-critic-{name}-1x.png').tobytes(),name+' native scene replay')
 check(a.resize((a.width*3,a.height*3),Image.Resampling.NEAREST).tobytes()==image(R/f'r17-B-critic-{name}-3x.png').tobytes(),name+' exact 3x')
 check(a.convert('L').convert('RGBA').tobytes()==image(R/f'r17-B-critic-{name}-squint-1x.png').tobytes(),name+' exact greyscale')
 check(any(r.get('side')=='south' for r in records),name+' visible street receiving shadows')
 if name=='L-block':
  for ident in ('L-south-1-dormer-1','L-south-2-chimney-2'):
   r=next(r for r in records if r.get('id')==ident);overlay=c.asset(r['file'])
   check(all(a.getpixel((r['x']+x,r['y']+y))==overlay.getpixel((x,y)) for y in range(overlay.height) for x in range(overlay.width) if overlay.getpixel((x,y))[3]==255),ident+' every opaque accent pixel survives final join')
   check(r['y']+overlay.height<=430 or r['y']>=434,ident+' stays on one final L plane')
 if name=='height-test':
  for lot in c.neighbours(layout['buildings']):
   built,parts=c.build(lot['spec'])
   if len(lot['spec']['storeys'])!=4:continue
   for sh in [z for z in parts if z['layer']=='jetty shade']:
    for wall in lot['spec']['firewalls']:
     x0=0 if wall['side']=='left' else built.width-48;x1=x0+48
     check(sh['x']+sh['crop'][2]-sh['crop'][0]<=x0 or sh['x']>=x1,lot['id']+' jetty shade excludes bare firewall')
for name,layout in json.loads((R/'r17-B-critic2-narrow-layouts.json').read_text()).items():
 a,_=c.scene(layout);check(a.tobytes()==image(R/f'r17-B-critic2-{name}-1x.png').tobytes(),name+' renders formerly rejected arrangement')
 for lot in c.neighbours(layout['buildings']):
  s=lot['spec'];built,parts=c.build(s)
  if len(s['storeys'])!=4:continue
  check(c.wall_reveal(s)==4,name+' narrow masonry return')
  names=[c.ground_name(s)]+[f"storey-{z['kind']}-w{s['width']}-c{z['colour']}" for z in s['storeys']]
  for floor,n in enumerate(names):
   y=built.height-48*(floor+1)
   check(built.crop((4,y+8,built.width-4,y+40)).tobytes()==c.asset(n).crop((4,8,built.width-4,40)).tobytes(),name+f' floor {floor} central doors/windows intact')
protected=0
for path,digest in before.items():
 if path in ('art-drop/NOTES.md','art-drop/out/city17/compose.py'):continue
 if path.startswith('art-drop/review/r17-B-'):continue
 if path.startswith('art-drop/out/city17/') and Path(path).name in failed:continue
 check(Path(path).exists() and sha(Path(path))==digest,'protected '+path);protected+=1
check((A/'NOTES.md').read_bytes().endswith((R/'r17-B-critic2-notes-before.txt').read_bytes()),'earlier NOTES byte-identical')
failures=[r['check'] for r in checks if not r['passed']]
report=dict(total=len(checks),passed=len(checks)-len(failures),failures=failures,repaired_pngs=4,passing_pngs_unchanged=133,protected_files=protected,mode_blocks=blocks,mode_samples=blocks*64,recorded_cleanup_edits=edits,checks=checks)
for n in ('r17-B-critic2-validation.json','r17-B-validation.json'):(R/n).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
raise SystemExit(bool(failures))
