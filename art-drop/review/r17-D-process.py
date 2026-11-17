"""Register image-tool paint, lock palette, exact 8x8 mode, clean; never draw art."""
from pathlib import Path
from collections import Counter, deque
import json, hashlib, sys
from PIL import Image, ImageDraw
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
BASE=[tuple(c) for c in json.loads(Image.open(R/'r15-A-palette.png').info['Palette'])]
RED=[(77,42,28),(110,48,29),(143,58,30),(171,74,33),(194,94,42),(215,122,68),(231,148,79)]
# Quiet cloth ramps supplement the established timber/stone/roof palette.
CLOTH=[(48,63,91),(67,83,121),(92,115,153),(41,82,77),(49,112,101),(84,147,130),(71,79,34),(105,120,48),(139,148,66),(77,47,70),(112,64,99),(152,91,130)]
PAL=sorted(set(BASE[:19]+RED+BASE[22:]+CLOTH)); DARK=(43,40,29,255)
NN=Image.Resampling.NEAREST
SELECT={'cathedral':'cathedral-a','guildhall':'guildhall-a','gatehouse':'gatehouse-c','wall-walk-stair':'wall-walk-c'}
for n in ['townhall-market','fountain','wall-tower','market-cross','shrine']+[f'stall-{i}' for i in range(6)]:SELECT[n]=n

def clean_pixels(raw,w,h):
 a=raw[:];seen=set()
 for i,q in enumerate(a):
  if not q[3] or i in seen:continue
  stack=[i];seen.add(i);group=[]
  while stack:
   v=stack.pop();group.append(v);x,y=v%w,v//w
   for xx,yy in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
    j=yy*w+xx
    if 0<=xx<w and 0<=yy<h and a[j][3] and j not in seen:seen.add(j);stack.append(j)
  if len(group)<=2:
   for j in group:a[j]=(0,0,0,0)
 for _ in range(2):
  p=a[:]
  for y in range(1,h-1):
   for x in range(1,w-1):
    q=p[y*w+x];near=[p[yy*w+xx] for yy in range(y-1,y+2) for xx in range(x-1,x+2) if (xx,yy)!=(x,y)]
    if q[3] and all(c[3] for c in near) and q not in near:a[y*w+x]=Counter(near).most_common(1)[0][0]
 p=a[:]
 for y in range(h):
  for x in range(w):
   if p[y*w+x][3] and (x==0 or y==0 or x==w-1 or y==h-1 or any(not p[yy*w+xx][3] for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)))):a[y*w+x]=DARK
 return a

def process(rec):
 src=Image.open(R/rec['source']).convert('RGBA')
 src.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>g*2 and b>g*2 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
 box=src.getbbox();crop=src.crop(box);w,h=rec['size'];reg=Image.new('RGBA',(w*8,h*8));geom={'bounds':box}
 if rec['id'] in ('gatehouse-b','gatehouse-c'):
  # Register observed tower/portal landmarks as whole vertical paint bands.
  cuts=([0,196,554,crop.width] if rec['id']=='gatehouse-b' else [0,338,746,crop.width]);dest=[0,24,120,144]
  for x0,x1,d0,d1 in zip(cuts,cuts[1:],dest,dest[1:]):reg.paste(crop.crop((x0,0,x1,crop.height)).resize(((d1-d0)*8,(h-2)*8),Image.Resampling.BOX),(d0*8,8))
  geom['x_registration']=[cuts,dest]
 elif rec['id'].startswith('stall-'):
  reg.paste(crop.resize((44*8,44*8),Image.Resampling.BOX),(16,24));geom['box']=[2,3,44,44]
 else:
  bw,bh=w-2,h-2
  if rec['id']=='market-cross':bw,bh=40,94
  if rec['id']=='shrine':bw,bh=42,44
  if rec['id']=='fountain':bw,bh=92,84
  reg.paste(crop.resize((bw*8,bh*8),Image.Resampling.BOX),((w-bw)*4,(h-bh-1)*8));geom['box']=[(w-bw)//2,h-bh-1,bw,bh]
 palette=sorted(set([BASE[0],BASE[1],BASE[2]]+BASE[7:19])) if rec['id']=='gatehouse-c' else PAL
 if rec['id']=='stall-3':palette=sorted(set(PAL+[(119,43,32),(162,58,37),(198,78,41),(183,145,45),(212,177,62),(234,205,108)]))
 p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
 rgb=reg.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGB')
 alpha=reg.getchannel('A').point(lambda a:255 if a>=128 else 0);reg=rgb.convert('RGBA');reg.putalpha(alpha);reg.paste((0,0,0,0),mask=alpha.point(lambda a:255-a))
 raw=[];sw=w*8
 for y in range(h):
  locked=list(reg.crop((0,y*8,sw,(y+1)*8)).get_flattened_data())
  for x in range(w):
   votes=Counter(c for yy in range(8) for c in locked[yy*sw+x*8:yy*sw+x*8+8])
   raw.append(min(votes,key=lambda c:(-votes[c],c)))
 out=clean_pixels(raw,w,h);edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,out)) if a!=b]
 reg.save(R/f"r17-D-registered-{rec['id']}.png");mode=Image.new('RGBA',(w,h));mode.putdata(raw);mode.save(R/f"r17-D-mode-{rec['id']}.png");im=Image.new('RGBA',(w,h));im.putdata(out);im.save(R/f"r17-D-clean-{rec['id']}.png")
 log=dict(id=rec['id'],source=rec['source'],size=[w,h],registration=geom,palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=edits,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest())
 return im,log

def run():
 records=json.loads((R/'r17-D-generation.json').read_text());logs=[];images={};only=set(sys.argv[1:]);previous={r['id']:r for r in json.loads((R/'r17-D-processing.json').read_text())} if only else {}
 for rec in records:
  if only and rec['id'] not in only:im=Image.open(R/f"r17-D-clean-{rec['id']}.png").convert('RGBA');log=previous[rec['id']]
  else:im,log=process(rec)
  images[rec['id']]=im;logs.append(log);print(rec['id'],flush=True)
  rec['selected']=rec['id'] in SELECT.values()
 for name,ident in SELECT.items():images[ident].save(O/(name+'.png'))
 # Tile-wrap a complete painted merlon/corbel period from the stair wall's
 # plain left portion. No artificial wall edges or masonry are constructed.
 donor=images['wall-walk-c'];period=donor.crop((40,0,88,144));walk=Image.new('RGBA',(96,144));walk.paste(period,(0,0));walk.paste(period,(48,0));walk.save(O/'wall-walk.png')
 (R/'r17-D-native-joins.json').write_text(json.dumps({'wall-walk':{'donor':'wall-walk-stair.png','crop':[40,0,88,144],'repeat':[2,1]}},indent=2))
 (R/'r17-D-processing.json').write_text(json.dumps(logs,indent=2));(R/'r17-D-generation.json').write_text(json.dumps(records,indent=2))
 files={}
 for name in list(SELECT)+['wall-walk']:
  im=Image.open(O/(name+'.png'));a=list(im.get_flattened_data());files[name]=dict(size=list(im.size),colours=len(set(c[:3] for c in a if c[3])),opaque=sum(c[3]>0 for c in a),sha256=hashlib.sha256((O/(name+'.png')).read_bytes()).hexdigest())
 footprints={'cathedral':[5,6],'guildhall':[4,4],'townhall-market':[4,3],'gatehouse':[3,4],'fountain':[2,2],'wall-tower':[2,3],'market-cross':[1,2],'shrine':[1,1],'wall-walk':[2,1],'wall-walk-stair':[4,2]}
 for name,rec in files.items():rec.update(footprint_cells=footprints.get(name,[1,1]),anchor_bottom_left=[0,rec['size'][1]],season='summer',alpha=[0,255])
 (R/'r17-D-files.json').write_text(json.dumps(files,indent=2))
 print('Saved',len(files),'exports')
if __name__=='__main__':
 redraw=R/'r17-D-critic2-process.py'
 if not redraw.exists():redraw=R/'r17-D-critic1-process.py'
 if redraw.exists():
  import runpy
  runpy.run_path(str(redraw),run_name='__main__')
 else:run()
