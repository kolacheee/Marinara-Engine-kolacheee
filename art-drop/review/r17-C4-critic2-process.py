"""Critic 2: register painted sources, exact mode reduction, native composites."""
from pathlib import Path
from PIL import Image
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('old',R/'r17-C4-process.py');old=importlib.util.module_from_spec(sp);sp.loader.exec_module(old)
def read(n):return Image.open(O/(n+'.png')).convert('RGBA')
def run():
 recs=json.loads((R/'r17-C4-critic2-generation.json').read_text());drawings={};logs=[];exports={};native=[]
 for rec in recs:
  ident=rec['id'];pal=old.RED if ident.startswith('roof') else old.FLOOR if ident.startswith('floor') else old.prior.PAL
  use=rec
  if ident=='narrow-b':
   # Register the drawn north doorway to a 24px mouth; retain every complete
   # booth and boundary, compressing only the two flanking source regions.
   src=old.key(Image.open(R/rec['source']));src=src.crop(src.getbbox());w,h=src.size
   cuts=[0,round(w*10/48),round(w*24/48),w];dest=[0,4,28,48]
   reg=Image.new('RGBA',(384,384))
   for x0,x1,d0,d1 in zip(cuts,cuts[1:],dest,dest[1:]):reg.paste(src.crop((x0,0,x1,h)).resize(((d1-d0)*8,384),Image.Resampling.BOX),(d0*8,0))
   name='r17-C4-critic2-landmarks-narrow-b.png';reg.save(R/name);use=dict(rec,source=name)
   native.append(dict(drawing=ident,source=rec['source'],source_x=cuts,registered_x=dest,operation='horizontal painted-landmark registration; whole booth retained'))
  a,log=old.register(use,'critic2-'+ident,rows=ident.startswith('floor'),palette=pal);drawings[ident]=a;logs.append(log)
  if ident.startswith('floor'):
   donor=read('ground-shop-w2-c0')
   for yy in (0,47):a.paste(donor.crop((0,yy,96,yy+1)),(0,yy))
   exports['storey-arrangement-'+ident[-1]+'-c4-w2']=a
   native.append(dict(output='storey-arrangement-'+ident[-1]+'-c4-w2',drawing=ident,course_donor='ground-shop-w2-c0',course_rows=[0,47]))
 a=read('north-shop-court-c4-w1');a.paste(drawings['narrow-b'],(0,0));exports['north-shop-court-c4-w1']=a
 native.append(dict(output='north-shop-court-c4-w1',drawing='narrow-b',region=[0,0,48,48],retained='roof-ridge-c4-w1'))
 # A whole drawn shutter bay; the adjacent blank bay still receives the sign.
 a=read('storey-sign-bay-right-w2');a.paste(drawings['floor-c'].crop((0,0,32,48)),(0,0))
 donor=read('ground-shop-w2-c0')
 for yy in (0,47):a.paste(donor.crop((0,yy,96,yy+1)),(0,yy))
 exports['storey-sign-bay-shutter-right-c4-w2']=a
 native.append(dict(output='storey-sign-bay-shutter-right-c4-w2',drawing='floor-c',crop=[0,0,32,48],receiver='storey-sign-bay-right-w2',reserved_sign_bay=[32,0,64,48]))
 # End adapters and receiving caps share one continuous painted source.
 for side in ('left','right'):
  a=drawings['roof-'+side+'-b'];hx=0 if side=='left' else 48;gx=96 if side=='left' else 0
  hip=a.crop((hx,0,hx+96,144));gable=a.crop((gx,0,gx+48,144));ax=48 if side=='left' else 0
  adapter=hip.crop((ax,96,ax+48,144));hip.paste((0,0,0,0),(ax,96,ax+48,144))
  exports['roof-receiver-'+side+'-c4-w2']=hip;exports['roof-companion-'+side+'-c4-w1']=gable;exports['roof-adapter-'+side+'-c4']=adapter
  native.append(dict(drawing='roof-'+side+'-b',receiving_cap=[hx,0,hx+96,144],companion=[gx,0,gx+48,144],adapter=[hx+ax,96,hx+ax+48,144],restore=[ax,96]))
 files=json.loads((R/'r17-C4-files.json').read_text())
 for n,a in exports.items():
  a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);p=O/(n+'.png');a.save(p);v=list(a.get_flattened_data())
  files[n]=dict(size=list(a.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len(set(p[:3] for p in v if p[3])),alpha=sorted(set(p[3] for p in v)),hidden_rgb=sum(p[:3]!=(0,0,0) for p in v if not p[3]))
 (R/'r17-C4-files.json').write_text(json.dumps(files,indent=2))
 (R/'r17-C4-critic2-processing.json').write_text(json.dumps(dict(drawings=logs,native=native,exports=list(exports),selection={'narrow':'B: complete counter and boundary; A contains an unwanted human shadow','roof-left':'B: finer courses and one continuous receiving contact','roof-right':'B: quieter course joints, correctly relit opposite hand','floors':'A/B/C are different structural arrangements of recessed/shuttered windows; all retained'}),indent=2))
 print('Registered',len(logs),'drawings;',len(exports),'exports;',sum(x['mode_blocks']*64 for x in logs),'mode samples')
if __name__=='__main__':run()
