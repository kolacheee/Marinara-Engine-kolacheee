"""Register whole image-tool paintings, lock palette, exact64-sample mode.

Only registration, cleanup, wrapping, recolouring and paint transfers occur.
"""
from pathlib import Path
from collections import Counter
import json, hashlib, importlib.util
from PIL import Image, ImageDraw
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'; B=R/'r17-E-critic1-before'
sp=importlib.util.spec_from_file_location('old',R/'r17-E-process.py');old=importlib.util.module_from_spec(sp);sp.loader.exec_module(old)
NN=Image.Resampling.NEAREST
ROAD=[(117,120,108),(123,126,113),(129,132,119),(136,139,125),(143,146,132),(150,153,139)]
logs=[]
def process(ident,size,kind='prop',box=None):
 src=Image.open(R/f'r17-E-critic1-source-{ident}.png').convert('RGBA')
 src.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>g*2 and b>g*2 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
 cropbox=(0,0,*src.size) if kind=='mud' else src.getbbox(); crop=src.crop(cropbox);w,h=size
 reg=Image.new('RGBA',(w*8,h*8))
 if kind in ('road','mud','plaque','shutter-fit'):reg=crop.resize((w*8,h*8),Image.Resampling.BOX)
 else:
  k=min((w-2)/crop.width,(h-2)/crop.height);rw,rh=round(crop.width*k*8),round(crop.height*k*8)
  reg.paste(crop.resize((rw,rh),Image.Resampling.BOX),((w*8-rw)//2,h*8-rh-8))
 palette=ROAD if kind=='road' else (old.prior.BASE[:15]+old.prior.BASE[15:18] if ident.startswith('shutter') else old.PAL)
 if kind=='road':
  lum=[(r*3+g*6+b)/10 for r,g,b,a in reg.get_flattened_data()];vals=sorted(lum);lo,hi=vals[len(vals)//100],vals[len(vals)*99//100]
  reg.putdata([ROAD[min(5,max(0,round((l-lo)*5/max(1,hi-lo))))]+(255,) for l in lum])
 else:
  pal=Image.new('P',(1,1));pal.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c]);rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB');rgb.putalpha(reg.getchannel('A'));reg=rgb
 alpha=reg.getchannel('A').point(lambda a:255 if a>=128 else 0);reg.putalpha(alpha);reg.paste((0,0,0,0),mask=alpha.point(lambda a:255-a))
 raw=[]
 for y in range(h):
  row=list(reg.crop((0,y*8,w*8,(y+1)*8)).get_flattened_data())
  for x in range(w):
   votes=Counter(c for yy in range(8) for c in row[yy*w*8+x*8:yy*w*8+x*8+8]);raw.append(min(votes,key=lambda c:(-votes[c],c)))
 pixels=old.prior.clean_pixels(raw,w,h) if kind=='prop' else raw[:]
 out=Image.new('RGBA',size);out.putdata(pixels)
 reg.save(R/f'r17-E-critic1-registered-{ident}-{w}x{h}.png')
 mode=Image.new('RGBA',size);mode.putdata(raw);mode.save(R/f'r17-E-critic1-mode-{ident}-{w}x{h}.png')
 out.save(R/f'r17-E-critic1-clean-{ident}-{w}x{h}.png')
 logs.append(dict(id=ident,size=size,kind=kind,source=f'r17-E-critic1-source-{ident}.png',source_sha256=hashlib.sha256((R/f'r17-E-critic1-source-{ident}.png').read_bytes()).hexdigest(),crop=cropbox,palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=[[i%w,i//w,a,b] for i,(a,b) in enumerate(zip(raw,pixels)) if a!=b]))
 return out
def wrap(a,vertical=True):
 # Copy the opposite native edge paint; never repeat a small motif internally.
 a=a.copy();a.paste(a.crop((0,0,1,a.height)),(a.width-1,0))
 if vertical:a.paste(a.crop((0,0,a.width,1)),(0,a.height-1))
 return a
def recolour(a,m):
 a=a.copy();a.putdata([tuple(m.get(q[:3],q[:3]))+(q[3],) if q[3] else (0,0,0,0) for q in a.get_flattened_data()]);return a
def run(install=False):
 images={}
 for family,size,kind in [('cobble-large',(48,48),'road'),('cobble-small',(48,48),'road'),('mud-edge',(48,48),'mud'),('candles',(32,32),'prop'),('shutter',(24,24),'prop'),('tankard',(14,16),'plaque')]:
  for v in 'ab':images[family+'-'+v]=process(family+'-'+v,size,kind)
 # Candidate contact sheet: native and8x; neutral mount is presentation only.
 sheet=Image.new('RGBA',(1100,6*460),(49,53,43,255));d=ImageDraw.Draw(sheet)
 for i,(n,a) in enumerate(images.items()):
  x=(i%2)*550;y=(i//2)*460;d.text((x+10,y+8),n,fill='white');sheet.alpha_composite(a,(x+10,y+30));sheet.alpha_composite(a.resize((a.width*8,a.height*8),NN),(x+100,y+50))
 sheet.save(R/'r17-E-critic1-candidates.png')
 if install:install_images(images)
 (R/'r17-E-critic1-processing.json').write_text(json.dumps(logs,indent=2))
def install_images(images):
 files=json.loads((R/'r17-E-files.json').read_text());transfers=[]
 def put(n,a,source,**kw):
  a.save(O/(n+'.png'));q=list(a.get_flattened_data());files[n].update(source=source,colours=len(set(v[:3] for v in q if v[3])),opaque=sum(v[3]>0 for v in q),alpha=sorted(set(v[3] for v in q)),sha256=hashlib.sha256((O/(n+'.png')).read_bytes()).hexdigest(),**kw)
  for obsolete in ('period','period_y'):files[n].pop(obsolete,None)
 large=wrap(images['cobble-large-b']);small=wrap(images['cobble-small-b'])
 put('cobble-large',large,'critic1:cobble-large-b',painted_field=[48,48]);put('cobble-small',small,'critic1:cobble-small-b',painted_field=[48,48])
 for n,w,field,k in [('street-main',96,large,4),('street-side',48,small,4),('lane',24,small,3)]:
  a=old.repeat(field,(w,48));before=Image.open(B/(n+'.png')).convert('RGBA')
  for x in (0,w-k):a.paste(before.crop((x,0,x+k,48)),(x,0))
  put(n,a,['critic1:'+('cobble-large-b' if w==96 else 'cobble-small-b'),'retained drawn kerb/gutter'],painted_field=[48,48])
 put('mud-edge',wrap(images['mud-edge-b'],False),'critic1:mud-edge-b',painted_field=[48,48])
 put('district-temple-candles',images['candles-a'],'critic1:candles-a')
 put('district-poor-shutter',images['shutter-b'],'critic1:shutter-b')
 plaque=images['tankard-a']
 for n in ['inn-front','inn-front-w2']+[f'inn-front-w2-c{i}' for i in range(3)]:
  a=Image.open(B/(n+'.png')).convert('RGBA');a.alpha_composite(plaque,(40,19));put(n,a,'critic1:tankard-a + retained inn',emblem=[40,19,14,16]);transfers.append(dict(target=n,source='tankard-a',rect=[40,19,14,16]))
 # Rebuild only the failed derivatives from their unpatched approved donor.
 # Coordinates are inside each observed recess, leaving the sill untouched.
 poor=json.loads((R/'r17-E-districts.json').read_text())['poor']['wall_ramp'];mapping=dict(zip(old.prior.BASE[7:15],poor))
 for n,donor,box in [
  ('district-poor-storey-w2','storey-plaster-w2-c0',(17,15,17,16)),
  ('district-poor-ground-v1-w2','ground-door-w2-c0',(60,13,20,16)),
  ('district-poor-storey-v1-w2','storey-timber-w2-c0',(18,15,14,17)),
  ('district-poor-ground-v2-w2','ground-door-v1-w2-c0',(20,15,12,12)),
  ('district-poor-storey-v2-w2','storey-oriel-w2-c0',(36,14,11,13))]:
  a=recolour(Image.open(O/(donor+'.png')).convert('RGBA'),mapping);x,y,w,h=box;shutter=process('shutter-b',(w,h),'shutter-fit');a.alpha_composite(shutter,(x,y));put(n,a,[donor,'critic1:shutter-b']);transfers.append(dict(target=n,source='shutter-b',rect=box,donor=donor))
 (R/'r17-E-files.json').write_text(json.dumps(files,indent=2));(R/'r17-E-critic1-transfers.json').write_text(json.dumps(transfers,indent=2))
if __name__=='__main__':
 import sys
 run('--install' in sys.argv)
