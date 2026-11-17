"""Critic-1 redraws: source registration, palette locking and exact mode only."""
from pathlib import Path
from PIL import Image
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('old',R/'r17-C4-process.py');old=importlib.util.module_from_spec(s);s.loader.exec_module(old)
RED=old.RED
def read(n):return Image.open(O/(n+'.png')).convert('RGBA')
def run():
 recs=json.loads((R/'r17-C4-critic1-generation.json').read_text());drawings={};logs=[];exports={};native=[]
 for rec in recs:
  ident=rec['id'];pal=RED+old.STONE[1:5] if ident.startswith(('junction','valley')) else RED if ident.startswith(('ridge','hip-')) else old.STONE+[(91,85,70),(118,112,94),(142,134,114)] if ident.startswith('wall-side') else old.prior.PAL
  box=(52,96,972,1438) if ident=='north-shop-b' else None
  a,log=old.register(rec,'critic1-'+ident,box=box,rows=ident.startswith('ridge'),palette=pal)
  drawings[ident]=a;logs.append(log)
  if ident.startswith('ridge'):
   # Quiet internal joints, retaining the painted exterior contour.
   for y in range(1,a.height-1):
    for x in range(1,a.width-1):
     if a.getpixel((x,y))[:3]==RED[0]:a.putpixel((x,y),(*RED[1],255))
  if ident in ('tower-b','tower-c'):exports['wall-'+ident+'-c4']=a
  if ident in ('wall-side-b','wall-side-c'):
   donor=read('wall-side-a-c4')
   for y in (0,143):a.paste(donor.crop((0,y,48,y+1)),(0,y))
   exports[ident+'-c4']=a
  if ident.startswith('fence-h-'):
   donor=read('fence-0')
   # Matching drawn end posts retain compatible modular rail contacts.
   for x in (0,46):a.paste(donor.crop((x,0,x+2,24)),(x,0))
   exports[ident+'-c4']=a
  if ident.startswith('fence-v-'):
   b=Image.new('RGBA',(24,48));b.paste(a,(7,0));exports[ident+'-c4']=b
 if 'ridge-c' in drawings:
  donor=drawings['ridge-a'].copy()
  for y in range(1,95):
   for x in range(1,143):
    q=donor.getpixel((x,y))
    if q[:3] in (RED[0],RED[1]):donor.putpixel((x,y),(*RED[2],255))
  # Ridge and eave contact courses come from the first painted candidate;
  # all interior marks come from C, whose pitch matches the retained hip.
  donor.paste(drawings['ridge-a'].crop((0,0,144,2)),(0,0));donor.paste(drawings['ridge-a'].crop((0,94,144,96)),(0,94))
  exports['roof-ridge-c4-w3']=donor
  for w,x in [(1,48),(2,24)]:
   a=donor.crop((x,0,x+w*48,96))
   a.paste(donor.crop((0,0,1,96)),(0,0));a.paste(donor.crop((143,0,144,96)),(w*48-1,0));exports['roof-ridge-c4-w'+str(w)]=a
 if 'junction-c' in drawings:
  a=drawings['junction-c'].crop((0,0,96,48));hip=read('roof-hip-c4-w2')
  a.paste(a.crop((0,1,96,2)),(0,0))
  # Transfer the receiving course; its continuous ridge meets native x48.
  a.paste(hip.crop((0,47,96,48)),(0,47));exports['roof-junction-c4']=a
 for k in ('valley','hip-end'):
  if k in drawings:exports['roof-'+k+'-c4']=drawings[k].crop((24,24,72,72))
 if 'hip-w3' in drawings:exports['roof-hip-c4-w3']=drawings['hip-w3']
 if 'ridge-c' in drawings:
  for w in (1,2):
   for kind,acc in [('back','chimney-1-c0'),('dormer','dormer-0-c0')]:
    a=exports['roof-ridge-c4-w'+str(w)].copy();p=read(acc)
    ramp=dict(zip(old.prior.RED,[RED[min(4,i*5//7)] for i in range(7)]));p.putdata([(*ramp.get(q[:3],q[:3]),q[3]) for q in p.get_flattened_data()])
    a.alpha_composite(p,(6,24));exports['roof-'+kind+'-c4-w'+str(w)]=a
 for src,out in [('west-wing-b','side-house-west-c4'),('east-wing','side-house-east-c4'),('north-shop-b','north-shop-court-c4'),('court-passage','court-passage-c4')]:
  if src not in drawings:continue
  a=drawings[src].copy()
  for y in range(a.height):
   for x in range(a.width):
    q=a.getpixel((x,y))
    if q[:3] in old.prior.RED:
     i=old.prior.RED.index(q[:3]);a.putpixel((x,y),(*RED[min(4,i*5//7)],q[3]))
  exports[out]=a
 if 'north-shop-court-c4' in exports:
  donor=exports['north-shop-court-c4'];donor.paste(exports['roof-ridge-c4-w2'],(0,48));a=Image.new('RGBA',(96,96));a.paste(donor.crop((0,0,96,48)),(0,0));a.paste(exports['roof-ridge-c4-w2'].crop((0,48,96,96)),(0,48));exports['north-shop-court-short-c4']=a
  a=Image.new('RGBA',(48,144));a.paste(donor.crop((16,0,64,48)),(0,0));a.paste(exports['roof-ridge-c4-w1'],(0,48));exports['north-shop-court-c4-w1']=a
 if 'court-passage-c4' in exports:
  a=exports['court-passage-c4'];b=a.copy();b.paste((0,0,0,0),(0,0,96,20));exports['court-passage-supports-c4']=b
  b=a.copy();b.paste((0,0,0,0),(0,20,96,48));exports['court-passage-overhead-c4']=b
 for name,a in list(exports.items()):
  if name.startswith(('roof-ridge','roof-junction','roof-back','roof-dormer','roof-hip-c4-w3')):
   for tone,ramp in {'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77)]}.items():
    b=a.copy();mapping=dict(zip(RED,ramp));b.putdata([(*mapping.get(p[:3],p[:3]),p[3]) for p in b.get_flattened_data()]);exports[name+'-'+tone]=b
 files=json.loads((R/'r17-C4-files.json').read_text())
 for n,a in exports.items():
  a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);p=O/(n+'.png');a.save(p);v=list(a.get_flattened_data())
  files[n]=dict(size=list(a.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len(set(p[:3] for p in v if p[3])),alpha=sorted(set(p[3] for p in v)),hidden_rgb=sum(p[:3]!=(0,0,0) for p in v if not p[3]))
 native=[dict(output=n,sha256=files[n]['sha256']) for n in exports]
 (R/'r17-C4-files.json').write_text(json.dumps(files,indent=2));(R/'r17-C4-critic1-processing.json').write_text(json.dumps(dict(drawings=logs,native=native,exports=list(exports),selection={'ridge':'A: correct angular pitch, internal dark joints remapped to muted midtone; B too coarse, C too faint at native size','junction':'C: whole deep cap preserves common angular pitch; A/B lost thin joints under mode reduction','west-wing':'B: true west-facing threshold; A rejected frontal door','north-shop':'B: bounded court and northward threshold, joined to corrected common roof; A rejected coarse roof'}),indent=2))
 print('Redraw components',len(logs),'exports',len(exports))
if __name__=='__main__':run()
