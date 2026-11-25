#!/usr/bin/env python3
"""Render exact indexed text grids through the common rig. No drawing primitives."""
from pathlib import Path
from PIL import Image
import json,argparse,subprocess,sys
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[1]; SRC=ROOT/'src'
RAMPS=json.loads((ROOT/'ramps.json').read_text()); LEGEND=json.loads((ROOT/'tools/legend.json').read_text()); RIG=json.loads((ROOT/'tools/rig.json').read_text()); MANIFEST=json.loads((SRC/'manifest.json').read_text())
COLORS={'.':(0,0,0,0)}
for glyph,entry in LEGEND.items():
 if entry:
  color=(RAMPS['source']|RAMPS['fixed'])[entry['ramp']][entry['shade']]
  COLORS[glyph]=tuple(bytes.fromhex(color[1:]))+(255,)
def grid(path):
 rows=(SRC/path).read_text().splitlines();w=len(rows[0]);assert all(len(r)==w for r in rows),path
 im=Image.new('RGBA',(w,len(rows)))
 im.putdata([COLORS[c] for row in rows for c in row]);return im
def frame(name,d,f):
 e=MANIFEST['layers'][name];r=RIG[e['body']][d][f];im=Image.new('RGBA',(48,64))
 for part in e['frames'][d+str(f)]:
  a=part['anchor'];dx,dy=part.get('offset',[0,0])
  if a=='head':x,y=r['head'];y+=r['dy']
  elif a=='torso':x,y=r['sway'],r['dy']
  else:x,y=r['sway'],0
  drawing=grid(part['grid'])
  if name.startswith(('hair/long@','hair/braid@')) and r.get('hair_lag'):
   # Crown, face and ear clearance are rigid; only hanging ends lag the stride.
   im.alpha_composite(drawing.crop((0,0,drawing.width,10)),(x+dx,y+dy))
   im.alpha_composite(drawing.crop((0,10,drawing.width,drawing.height)),(x+dx+r['hair_lag'],y+dy+10))
  else:im.alpha_composite(drawing,(x+dx,y+dy))
 return im
def build():
 for name,e in MANIFEST['layers'].items():
  sheet=Image.new('RGBA',(288,256))
  for row,d in enumerate(MANIFEST['directions']):
   for f in range(6):sheet.alpha_composite(frame(name,d,f),(48*f,64*row))
  p=ROOT/(name+'.png');p.parent.mkdir(parents=True,exist_ok=True);sheet.save(p)
 print('Built',len(MANIFEST['layers']),'source sheets from text grids.')
def underlay(name,d='down',f=0):
 target=frame(name,d,f);body=frame('body/'+MANIFEST['layers'][name]['body'],d,f)
 body.putalpha(body.getchannel('A').point(lambda a:a//3));body.alpha_composite(target)
 p=ROOT.parent/'scratch/review';p.mkdir(parents=True,exist_ok=True)
 body.resize((192,256),Image.Resampling.NEAREST).save(p/('underlay-'+name.replace('/','-')+'-'+d+str(f)+'.png'))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--underlay');p.add_argument('--direction',choices=MANIFEST['directions'],default='down');p.add_argument('--frame',type=int,choices=range(6),default=0);p.add_argument('--no-check',action='store_true');args=p.parse_args()
 build()
 if args.underlay:underlay(args.underlay,args.direction,args.frame)
 if not args.no_check:subprocess.run([sys.executable,str(ROOT/'tools/check.py')],check=True)
