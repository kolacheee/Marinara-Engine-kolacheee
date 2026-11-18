"""Critic repair: only register/reduce/clean/wrap/composite image-tool paint."""
from pathlib import Path
from collections import Counter
import importlib.util,json,hashlib
from PIL import Image,ImageDraw,ImageChops,ImageFilter
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',R/'r17-C5-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
NN=Image.Resampling.NEAREST
recs=json.loads((R/'r17-C5-critic1-generation.json').read_text());drawings={};logs=[];exports={};ops=[]

def reduce(r):
 n=r['id'];w,h=r['size'];w=w+12 if n.startswith('fill-') else w+16 if n=='slabs' else w;h=w if n.startswith('fill-') or n=='slabs' else h;src=p.key(Image.open(R/r['source']));box=src.getbbox();src=src.crop(box)
 texture=n.startswith(('fill-','wall-')) or n=='slabs'
 # Registration excludes the surrounding key and puts exact source paint on an8x lattice.
 if texture:
  # Exclude irregular paint edges, not material or course geometry.
  src=src.crop((3,3,src.width-3,src.height-3))
 reg=src.resize((w*8,h*8),Image.Resampling.BOX)
 raw=list(reg.getdata());palette_colours=None
 pal=p.RED if n.startswith(('gable','hip','fill-')) else p.STONE if n.startswith('wall-') else p.FLOOR
 if n.startswith('abut-'):pal=p.RED+p.STONE+[(96,109,115),(118,131,134)]
 if n=='slabs':pal=[(151,150,136),(157,156,142),(163,162,148),(169,168,154),(175,174,160)]
 if texture or n.startswith(('gable','hip')):
  lum=lambda q:q[0]*.299+q[1]*.587+q[2]*.114
  ls=sorted(lum(q) for q in raw if q[3]>128);lo,hi=ls[len(ls)//100],ls[len(ls)*99//100]
  vals=[(*pal[round(max(0,min(1,(lum(q)-lo)/max(1,hi-lo)))*(len(pal)-1))],255) if q[3]>=128 else (0,0,0,0) for q in raw]
 else:
  palette=Image.new('P',(1,1));palette.putpalette([c for rgb in pal+[pal[-1]]*(256-len(pal)) for c in rgb])
  mapped=reg.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB')
  vals=[(*q,255) if r[3]>=128 else (0,0,0,0) for q,r in zip(mapped.getdata(),raw)]
 reg.putdata(vals);out=[]
 for y in range(h):
  for x in range(w):
   votes=Counter(q for yy in range(8) for q in vals[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);out.append(min(votes,key=lambda q:(-votes[q],q)))
 mode=Image.new('RGBA',(w,h));mode.putdata(out)
 clean=mode.copy()
 if not texture:clean.putdata(p.prior.clean_pixels(out,w,h))
 if n in ('oriel','recess','cobbler-a','inn-a','inn-b','guard'):
  # Register square facade shoulders from the drawn near-edge, maintaining original courses.
  for x in (0,w-1):
   for y in range(h):
    if clean.getpixel((x,y))[3]==0:clean.putpixel((x,y),clean.getpixel((min(w-1,max(0,x+ (1 if x==0 else -1))),y)))
 for suffix,a in [('registered',reg),('mode',mode),('clean',clean)]:a.save(R/f'r17-C5-critic1-{suffix}-{n}.png')
 logs.append(dict(id=n,source=r['source'],source_sha256=hashlib.sha256((R/r['source']).read_bytes()).hexdigest(),bounds=list(box),size=[w,h],palette=pal,mode_blocks=w*h,samples_per_pixel=64,texture=texture))
 return clean
for r in recs:drawings[r['id']]=reduce(r)

def read(n):return exports[n].copy() if n in exports else Image.open(O/(n+'.png')).convert('RGBA')
def put(n,a,**kw):exports[n]=a.copy();ops.append(dict(output=n,**kw))
def wrap_painted(a,period):
 # Minimum-error tile wrap: select ONLY source pixels along a low-error cut
 # through the overlap. Opposite outside edges are consecutive source rows.
 def axis(im,n):
  overlap=im.width-n;h=im.height;cost=[]
  for y in range(h):
   cost.append([sum((im.getpixel((x,y))[k]-im.getpixel((x+n,y))[k])**2 for k in range(3)) for x in range(overlap)])
  lo=2;hi=overlap-3;dp={x:cost[0][x] for x in range(lo,hi+1)};paths=[]
  for y in range(1,h):
   prev={};new={}
   for x in dp:
    q=min((k for k in (x-1,x,x+1) if k in dp),key=lambda k:dp[k]);new[x]=dp[q]+cost[y][x];prev[x]=q
   paths.append(prev);dp=new
  seam=[min(dp,key=dp.get)]
  for q in reversed(paths):seam.append(q[seam[-1]])
  seam.reverse();out=im.crop((0,0,n,h))
  for y,k in enumerate(seam):out.paste(im.crop((n,y,n+k,y+1)),(0,y))
  return out,seam
 a,sx=axis(a,period);a,sy=axis(a.transpose(Image.Transpose.TRANSPOSE),period)
 return a.transpose(Image.Transpose.TRANSPOSE),dict(method='minimum-error cut selects original painted overlap; no blending or new marks',horizontal_cut=sx,vertical_cut=sy)
for n in ('fill-left','fill-right','slabs'):
 drawings[n],op=wrap_painted(drawings[n],96 if n=='slabs' else 48);ops.append(dict(drawing=n,**op))
sel={'gable':'b','hip':'a','inn':'a','church':'c','side-east':'b','side-west':'a'}
for n,key in [('roof-abut-left-c5r1','abut-left'),('roof-abut-right-c5r1','abut-right'),('roof-gable-d2-c5-w2','gable-b'),('roof-hip-d2-c5-w2','hip-a'),('roof-fill-left-c5','fill-left'),('roof-fill-right-c5','fill-right'),('shop-cobbler-c5-w1','cobbler-a'),('inn-front-c5-w2','inn-a'),('church-porch-c5','church-c'),('gate-guard-bay-c5','guard'),('floor-b-left-c5-w1','oriel'),('floor-c-left-c5-w1','recess'),('square-slabs-c5','slabs'),('guard-notice-c5r1','notice'),('side-house-east-c5r1','side-east-b'),('side-house-west-c5r1','side-west-a')]:put(n,drawings[key],drawing=key)
# Preserve the approved parapet profile; only the failed masonry body is replaced.
for n,key in [('wall-curtain-c5','wall-a'),('wall-curtain-c-c5','wall-c')]:
 a=read(n);a.paste(drawings[key],(0,48));put(n,a,drawing=key,retained='original top48px parapet')
a=read('shop-cobbler-c5-w1');b=read('ground-cobbler-c5-w2');b.paste(a,(0,0));put('ground-cobbler-c5-w2',b,donors=['shop-cobbler-c5-w1','retained right door bay'])
# Directional interior fills sit under the original painted ridge, hip/end
# contours and eave. Mask ownership comes from source alpha, never drawn shapes.
a=read('roof-gable-c5-w2');field=Image.new('RGBA',a.size)
for hand,x in [('left',0),('right',48)]:
 tile=read('roof-fill-'+hand+'-c5')
 for y in range(0,a.height,48):field.paste(tile,(x,y))
mask=a.getchannel('A').filter(ImageFilter.MinFilter(9));mask.paste(0,(44,0,52,a.height));mask.paste(0,(0,a.height-6,a.width,a.height))
filled=Image.composite(field,a,mask);put('roof-filled-gable-c5r1-w2',filled,donors=['roof-gable-c5-w2','roof-fill-left-c5','roof-fill-right-c5'],operation='opaque native slope fills under retained painted silhouette/ridge/eave mask')
ramps={'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]}
for n,a in list(exports.items()):
 if n.startswith('roof-'):
  for tone,ramp in ramps.items():
   b=a.copy();mp=dict(zip(p.RED,ramp));b.putdata([(*mp.get(q[:3],q[:3]),q[3]) for q in b.getdata()]);put(n+'-'+tone,b,donor=n,operation='palette partner, identical alpha')
# Relit side houses have independent drawings; recolour only their roof paint.
for n in ['side-house-east-c5r1','side-house-west-c5r1']:
 a=read(n);b=a.copy()
 for y in range(96):
  for x in range(96):
   q=a.getpixel((x,y))
   if q[3] and q[0]>q[1]*1.25 and q[0]>q[2]*1.35:
    lum=q[0]*.299+q[1]*.587+q[2]*.114;j=min(range(6),key=lambda i:abs(sum(p.RED[i])/3-lum));b.putpixel((x,y),ramps['slate'][j]+(255,))
 put(n+'-slate',b,donor=n,operation='roof-only palette substitution; all silhouette retained')
files=json.loads((R/'r17-C5-files.json').read_text())
for n,a in exports.items():
 if n.startswith(('ground-','floor-','inn-front','shop-')):
  donor=read('ground-shop-w2-c0')
  for y in (0,47):a.paste(donor.crop((0,y,a.width,y+1)),(0,y))
 a.putdata([q if q[3] else (0,0,0,0) for q in a.getdata()]);a.save(O/(n+'.png'))
 v=list(a.getdata());files[n]=dict(size=list(a.size),sha256=hashlib.sha256((O/(n+'.png')).read_bytes()).hexdigest(),colours=len(set(q[:3] for q in v if q[3])),alpha=sorted(set(q[3] for q in v)),hidden_rgb=sum(any(q[:3]) for q in v if not q[3]))
(R/'r17-C5-files.json').write_text(json.dumps(files,indent=2));(R/'r17-C5-critic1-processing.json').write_text(json.dumps(dict(drawings=logs,native=ops,selected=sel),indent=2))
# Native and4x candidate selection sheets do not create asset paint.
for ids,n in [(['gable-a','gable-b'],'gable'),(['hip-a','hip-b'],'hip'),(['inn-a','inn-b'],'inn'),(['church-a','church-b','church-c'],'church'),(['side-east-a','side-east-b'],'side-east'),(['side-west-a','side-west-b'],'side-west')]:
 a=Image.new('RGBA',(sum(drawings[i].width+16 for i in ids),max(drawings[i].height for i in ids)+24),(85,90,80,255));d=ImageDraw.Draw(a);x=8
 for i in ids:d.text((x,2),i,fill='white');a.alpha_composite(drawings[i],(x,24));x+=drawings[i].width+16
 for z in (1,4):a.resize((a.width*z,a.height*z),NN).save(R/f'r17-C5-critic1-selection-{n}-{z}x.png')
print(len(recs),'source drawings;',len(exports),'exports')
