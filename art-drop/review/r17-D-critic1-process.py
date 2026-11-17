"""Part D redraw: register paint, palette-lock, exact 64-sample mode, clean.

No architecture, masonry, goods, noise or shadows are constructed here.
Only the four failed exports are replaced. Passing PNGs are read-only.
"""
from pathlib import Path
from collections import Counter
import json, hashlib, importlib.util
from PIL import Image, ImageDraw
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
spec=importlib.util.spec_from_file_location('old_process',R/'r17-D-process.py')
old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)
PAL=old.PAL
NN=Image.Resampling.NEAREST
SIZES={'gateA':(144,400),'gateB':(144,400),'gateC':(144,400),
 'wallA':(288,144),'wallB':(96,144),'wallC':(192,144),
 'stairA':(192,144),'stairB':(192,144),'stairC':(192,144),'wallClean':(192,144),'fishA':(48,48),'fishB':(48,48),'paving':(96,96)}

def register(rec):
 ident=rec['id'];src=Image.open(R/rec['source']).convert('RGBA')
 src.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>g*2 and b>g*2 else (r,g,b,255) for r,g,b,_ in src.get_flattened_data()])
 bounds=src.getbbox();src=src.crop(bounds);w,h=SIZES[ident]
 reg=Image.new('RGBA',(w*8,h*8));geom={'bounds':bounds}
 if ident=='stairC':
  src=src.crop((22,0,src.width-12,src.height));geom['cut_edge_crop']=[22,0,bounds[2]-bounds[0]-12,bounds[3]-bounds[1]]
 if ident.startswith('fish'):
  reg.paste(src.resize((44*8,44*8),Image.Resampling.BOX),(16,24));geom['destination']=[2,3,44,44]
 elif ident=='gateC':
  # Register the already drawn arch/jamb landmarks. Only the lower arch
  # has this small correction; upper tower volumes keep their full width.
  src_y=[0,1580,1690,src.height];dst_y=[1,316,335,399]
  bands=Image.new('RGBA',(src.width,h*8))
  for s0,s1,d0,d1 in zip(src_y,src_y[1:],dst_y,dst_y[1:]):
   bands.paste(src.crop((0,s0,src.width,s1)).resize((src.width,(d1-d0)*8),Image.Resampling.BOX),(0,d0*8))
  cuts=[0,134,594,src.width];ordinary=[round(v*w*8/src.width) for v in cuts]
  for yy in range(h*8):
   blend=max(0,min(1,(yy/8-312)/23))
   dest=[round(a*(1-blend)+b*8*blend) for a,b in zip(ordinary,[0,23,121,144])]
   for s0,s1,d0,d1 in zip(cuts,cuts[1:],dest,dest[1:]):
    reg.paste(bands.crop((s0,yy,s1,yy+1)).resize((d1-d0,1),Image.Resampling.BOX),(d0,yy))
  geom.update(y_registration=[src_y,dst_y],lower_arch_x_registration=[cuts,[0,23,121,144]],blend_native_y=[312,335])
 elif ident in ('wallClean','stairC'):
  sy=[0,194,233,284,src.height] if ident=='wallClean' else [0,192,242,320,src.height]
  dy=[0,36,42,52,144]
  for s0,s1,d0,d1 in zip(sy,sy[1:],dy,dy[1:]):
   reg.paste(src.crop((0,s0,src.width,s1)).resize((w*8,(d1-d0)*8),Image.Resampling.BOX),(0,d0*8))
  geom['y_registration']=[sy,dy]
 elif ident in ('wallC','stairB'):
  # Match the drawn landing / walk coping, not arbitrary crop edges.
  landing=194 if ident=='wallC' else 197
  sy=[0,landing,src.height];dy=[0,36,144]
  for s0,s1,d0,d1 in zip(sy,sy[1:],dy,dy[1:]):
   reg.paste(src.crop((0,s0,src.width,s1)).resize((w*8,(d1-d0)*8),Image.Resampling.BOX),(0,d0*8))
  geom['y_registration']=[sy,dy]
 elif ident=='paving':
  # Crop one source edge pixel to remove key-colour boundary only.
  src=src.crop((1,1,src.width-1,src.height-1));reg=src.resize((w*8,h*8),Image.Resampling.BOX)
 else:
  reg.paste(src.resize((w*8,(h-2)*8),Image.Resampling.BOX),(0,8))
 palette=PAL
 if ident in ('wallC','stairB','wallClean','stairC'):
  palette=[old.BASE[i] for i in [0,7,8,10,12,13]]
 if ident=='paving':
  # Existing muted neutral ramp, not new texture or a generated palette.
  palette=sorted(set(old.BASE[7:19]+old.BASE[22:]))
 p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
 rgb=reg.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGB')
 alpha=reg.getchannel('A').point(lambda v:255 if v>=128 else 0)
 reg=rgb.convert('RGBA');reg.putalpha(alpha);reg.paste((0,0,0,0),mask=alpha.point(lambda v:255-v))
 raw=[];sw=w*8
 for y in range(h):
  data=list(reg.crop((0,y*8,sw,y*8+8)).get_flattened_data())
  for x in range(w):
   votes=Counter(q for yy in range(8) for q in data[yy*sw+x*8:yy*sw+x*8+8])
   raw.append(min(votes,key=lambda q:(-votes[q],q)))
 # The established silhouette/fleck cleanup, preserving intentional fish
 # eyes: single dark pixels inside the fish are drawn recognition details.
 cleaned=old.clean_pixels(raw,w,h)
 if ident in ('wallC','stairB'):
  # Remove detached 1-3 pixel colour chips, retaining connected mortar
  # courses, coping and outlines. This is a cleanup of sampled paint.
  for _ in range(2):
   before=cleaned[:];seen=set()
   for i,q in enumerate(before):
    if i in seen or not q[3] or q==old.DARK:continue
    todo=[i];seen.add(i);group=[];border=[]
    while todo:
     j=todo.pop();group.append(j);x,y=j%w,j//w
     for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
      k=yy*w+xx
      if not(0<=xx<w and 0<=yy<h):continue
      if before[k]==q and k not in seen:seen.add(k);todo.append(k)
      elif before[k]!=q and before[k][3]:border.append(before[k])
    if len(group)<=3 and border:
     replacement=Counter(border).most_common(1)[0][0]
     for j in group:cleaned[j]=replacement
 if ident.startswith('fish'):
  for i,q in enumerate(raw):
   if q[3] and max(q[:3])<80 and cleaned[i][3]:cleaned[i]=q
 if ident in ('wallC','stairB','wallClean','stairC','paving'):
  # Cut masonry/ground edges are mating surfaces, not exposed silhouettes.
  for y in range(h):
   for x in (0,w-1):cleaned[y*w+x]=raw[y*w+x]
  if ident=='paving':cleaned=raw[:]
 edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,cleaned)) if a!=b]
 prefix=R/f'r17-D-critic1-{ident}'
 reg.save(str(prefix)+'-registered.png')
 mode=Image.new('RGBA',(w,h));mode.putdata(raw);mode.save(str(prefix)+'-mode.png')
 out=Image.new('RGBA',(w,h));out.putdata(cleaned);out.save(str(prefix)+'-clean.png')
 return out,dict(id=ident,source=rec['source'],size=[w,h],registration=geom,palette=palette,cleanup=edits,mode_blocks=w*h,samples_per_block=64,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest())

def run():
 records=json.loads((R/'r17-D-critic1-generation.json').read_text());ims={};logs=[]
 for rec in records:
  print('Register/mode',rec['id'],flush=True);im,log=register(rec);ims[rec['id']]=im;logs.append(log)
 for name,ident in [('gatehouse','gateC'),('wall-walk-stair','stairC'),('stall-2','fishB')]:ims[ident].save(O/(name+'.png'))
 # Crop different portions of ONE newly drawn two-cell masonry surface.
 # Keep each native painted pixel; no 48px repeat or synthetic seam line.
 wall=ims['wallClean'];wall.crop((24,0,120,144)).save(O/'wall-walk.png')
 wall.crop((72,0,168,144)).save(R/'r17-D-critic1-wall-walk-alternate.png')
 ims['paving'].save(R/'r17-D-critic1-gate-paving.png')
 (R/'r17-D-critic1-processing.json').write_text(json.dumps(logs,indent=2))
 (R/'r17-D-critic1-native-joins.json').write_text(json.dumps({'wall-walk':{'source':'wallClean','crop':[24,0,120,144]},'wall-walk-alternate':{'source':'wallClean','crop':[72,0,168,144]}},indent=2))
 files=json.loads((R/'r17-D-files.json').read_text())
 for name in ['gatehouse','wall-walk','wall-walk-stair','stall-2']:
  a=Image.open(O/(name+'.png')).convert('RGBA');v=list(a.get_flattened_data())
  files[name].update(size=list(a.size),colours=len(set(q[:3] for q in v if q[3])),opaque=sum(q[3]>0 for q in v),sha256=hashlib.sha256((O/(name+'.png')).read_bytes()).hexdigest())
 (R/'r17-D-files.json').write_text(json.dumps(files,indent=2))
 sheet=Image.new('RGBA',(1248,720),(49,53,43,255));d=ImageDraw.Draw(sheet);x=8
 for ident in ['gateA','gateB','gateC','wallA','wallB','wallC']:
  a=ims[ident];sheet.alpha_composite(a,(x,420-a.height));d.text((x,430),ident,fill='white');x+=a.width+12
 for i,ident in enumerate(['stairA','stairB','fishA','fishB','paving','wallClean','stairC']):
  a=ims[ident];x=[8,224,440,520,620,736,948][i];sheet.alpha_composite(a,(x,640-a.height));d.text((x,650),ident,fill='white')
 sheet.save(R/'r17-D-critic1-selection-1x.png')
 print('Saved four failed exports and review-only drawing crops.')
if __name__=='__main__':run()
