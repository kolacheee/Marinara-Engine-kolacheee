"""Registered image-tool paint only: palette lock, 64-sample mode, cleanup, wraps."""
from pathlib import Path
from collections import Counter
import json, hashlib, importlib.util, sys
from PIL import Image
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'; NN=Image.Resampling.NEAREST
sp=importlib.util.spec_from_file_location('prior',R/'r17-D-process.py');prior=importlib.util.module_from_spec(sp);sp.loader.exec_module(prior)
PAL=sorted(set(prior.PAL+[(66,54,86),(91,74,120),(127,111,155),(37,67,43),(68,100,52),(108,143,66),(158,179,105),(119,43,32),(162,58,37)]))
# Same quiet paving ramp as C; additional midtones retain the shallow stone face.
ROAD=[(105,108,96),(115,118,105),(130,133,119),(140,142,127),(148,150,135),(157,159,143)]
DARK=(43,40,29,255)
def process(rec):
 src=Image.open(R/rec['source']).convert('RGBA')
 src.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>g*2 and b>g*2 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
 box=rec.get('crop',src.getbbox());crop=src.crop(box);w,h=rec['size'];reg=Image.new('RGBA',(w*8,h*8));geom={'bounds':box}
 if rec['id'] in ('cobble-large-patch','cobble-small-patch'):
  # Register observed painted mortar bands to one pixel. Each interval is
  # sampled from its own source paint; no line or stone is constructed.
  large=rec['id']=='cobble-large-patch'
  bands=([(0,5,0,1,None),(5,105,1,6,([0,105,115,313,323,433],[0,6,7,18,19,24])),(105,115,6,7,None),(115,215,7,12,([0,198,207,407,417,433],[0,11,12,23,24,24]))] if large else
         [(0,5,0,1,None),(5,105,1,4,([0,105,115,313,323,433],[0,3,4,9,10,12])),(105,115,4,5,None),(115,215,5,8,([0,198,207,407,417,433],[0,5,6,11,12,12]))])
  for sy0,sy1,dy0,dy1,xreg in bands:
   if xreg is None:reg.paste(crop.crop((0,sy0,crop.width,sy1)).resize((w*8,(dy1-dy0)*8),Image.Resampling.BOX),(0,dy0*8))
   else:
    xs,xd=xreg
    for sx0,sx1,dx0,dx1 in zip(xs,xs[1:],xd,xd[1:]):
     if dx1>dx0:reg.paste(crop.crop((sx0,sy0,sx1,sy1)).resize(((dx1-dx0)*8,(dy1-dy0)*8),Image.Resampling.BOX),(dx0*8,dy0*8))
  geom['painted_bands']=bands
 elif rec.get('crop'):
  reg=crop.resize((w*8,h*8),Image.Resampling.BOX);geom['registration']='observed complete painted courses'
 elif rec['kind']=='road':
  # Full rectangular painted interior; select observed straight courses.
  if rec['id']=='lane':crop=crop.crop((0,0,crop.width,round(crop.width*2)))
  # Register every source row extent to the exact square-grid footprint.
  rows=Image.new('RGBA',(w*8,crop.height))
  for y in range(crop.height):
   row=crop.crop((0,y,crop.width,y+1));bb=row.getbbox()
   if bb:rows.paste(row.crop(bb).resize((w*8,1),Image.Resampling.BOX),(0,y))
  reg=rows.resize((w*8,h*8),Image.Resampling.BOX);geom['registration']='painted row extents'
 elif rec['kind'] in ('facade','roof'):
  if rec['kind']=='roof':
   # Omit source ridge-tip protrusions before the first solid painted row.
   for yy in range(min(crop.height//4,240)):
    row=crop.crop((0,yy,crop.width,yy+1));bb=row.getbbox()
    if bb and bb[2]-bb[0]>crop.width*.85 and min(row.crop(bb).getchannel('A').get_flattened_data())==255:
     crop=crop.crop((0,yy,crop.width,crop.height));geom['top_trim']=yy;break
   for yy in range(crop.height-1,max(0,crop.height-240),-1):
    row=crop.crop((0,yy,crop.width,yy+1));bb=row.getbbox()
    if bb and bb[2]-bb[0]>crop.width*.85 and min(row.crop(bb).getchannel('A').get_flattened_data())==255:
     geom['bottom_trim']=crop.height-yy-1;crop=crop.crop((0,0,crop.width,yy+1));break
  # Exclude top bracket protrusion on A. Register straight architectural rows.
  if rec['id']=='inn-front-a':crop=crop.crop((0,28,crop.width,crop.height))
  rows=Image.new('RGBA',(w*8,crop.height))
  for y in range(crop.height):
   row=crop.crop((0,y,crop.width,y+1));bb=row.getbbox()
   if bb:rows.paste(row.crop(bb).resize((w*8,1),Image.Resampling.BOX),(0,y))
  reg=rows.resize((w*8,h*8),Image.Resampling.BOX);geom['registration']='painted row extents'
 elif rec['kind']=='mud':
  # Original canvas retains top-half magenta; no silhouette shape is invented.
  reg=src.resize((w*8,h*8),Image.Resampling.BOX);geom['registration']='whole canvas'
 else:
  scale=min((w-2)/crop.width,(h-2)/crop.height)
  bw,bh=round(crop.width*scale*8),round(crop.height*scale*8);x,y=(w*8-bw)//2,h*8-bh-8
  reg.paste(crop.resize((bw,bh),Image.Resampling.BOX),(x,y));geom['paint_box_8x']=[x,y,bw,bh]
 palette=ROAD if rec['kind']=='road' else sorted(set(prior.BASE[:15])) if rec['kind']=='roof' else PAL
 # Road colours are intentionally mapped through a compressed luminance ramp.
 if rec['kind']=='road':
  q=[]
  for r,g,b,a in reg.get_flattened_data():
   lum=(r*3+g*6+b)/10
   idx=0 if lum<60 else 1 if lum<85 else 2 if lum<110 else 3 if lum<140 else 4 if lum<170 else 5
   q.append(ROAD[idx]+(a,))
  reg.putdata(q)
 else:
  p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c]);rgb=reg.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGB');rgb.putalpha(reg.getchannel('A'));reg=rgb
 alpha=reg.getchannel('A').point(lambda a:255 if a>=128 else 0);reg.putalpha(alpha);reg.paste((0,0,0,0),mask=alpha.point(lambda a:255-a))
 raw=[];sw=w*8
 for y in range(h):
  locked=list(reg.crop((0,y*8,sw,(y+1)*8)).get_flattened_data())
  for x in range(w):
   votes=Counter(c for yy in range(8) for c in locked[yy*sw+x*8:yy*sw+x*8+8]);raw.append(min(votes,key=lambda c:(-votes[c],c)))
 out=prior.clean_pixels(raw,w,h) if rec['kind'] not in ('road','mud') else raw[:]
 if rec['kind'] in ('facade','roof'):
  donor=Image.open(O/'ground-door-w2.png').convert('RGBA')
  for y in ((0,47) if rec['kind']=='facade' else (h-1,)):
   out[y*w:(y+1)*w]=list(donor.crop((0,47 if y else 0,w,48 if y else 1)).get_flattened_data())
 for suffix,pixels in [('mode',raw),('clean',out)]:
  im=Image.new('RGBA',(w,h));im.putdata(pixels);im.save(R/f'r17-E-{suffix}-{rec["id"]}.png')
 reg.save(R/f'r17-E-registered-{rec["id"]}.png')
 return im,dict(id=rec['id'],size=[w,h],source=rec['source'],source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),registration=geom,palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,out)) if a!=b])
def repeat(a,size):
 im=Image.new('RGBA',size)
 for y in range(0,size[1],a.height):
  for x in range(0,size[0],a.width):im.paste(a,(x,y))
 return im

def run():
 records=json.loads((R/'r17-E-generation.json').read_text());logs=[];images={};only=set(sys.argv[1:])
 previous={r['id']:r for r in json.loads((R/'r17-E-processing.json').read_text())} if (R/'r17-E-processing.json').exists() else {}
 for rec in records:
  if rec['id'] in ('street-main-b','street-side'):continue # rejected subject drift
  if only and rec['id'] not in only and rec['id'] in previous:im=Image.open(R/f'r17-E-clean-{rec["id"]}.png').convert('RGBA');log=previous[rec['id']]
  else:im,log=process(rec)
  images[rec['id']]=im;logs.append(log)
 (R/'r17-E-processing.json').write_text(json.dumps(logs,indent=2))
 # Candidate previews; final selection/transfer is explicit in install().
 print('Processed',len(images),'drawings;',sum(x['mode_blocks']*64 for x in logs),'mode samples')
 return images
if __name__=='__main__':run()
