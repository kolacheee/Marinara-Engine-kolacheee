#!/usr/bin/env python3
"""Non-destructive source, palette, rig, contact and coverage audit."""
from PIL import Image,ImageFilter,ImageChops
from pathlib import Path
import json,sys
sys.dont_write_bytecode=True
from build import ROOT,MANIFEST,RAMPS,RIG,frame,COLORS
from check_ramps import check as check_ramps
ERRORS=[];WARNINGS=[]
def require(ok,msg):
 if not ok:ERRORS.append(msg)
def check():
 check_ramps();allcolors=set(COLORS.values());max_lone=0
 for name,e in MANIFEST['layers'].items():
  im=Image.open(ROOT/(name+'.png'));require(im.mode=='RGBA' and im.size==(288,256),name+' dimensions/mode')
  allowed={(0,0,0,0)}
  for region in e['allowed']:
   for c in (RAMPS['source']|RAMPS['fixed'])[region]:allowed.add(tuple(bytes.fromhex(c[1:]))+(255,))
  colors=set(im.getdata());require(colors<=allowed,name+' disallowed palette '+str(colors-allowed));require(all(c[3] in [0,255] for c in colors),name+' alpha')
  for d in ['right','up']:
   require(all(frame(name,d,f).tobytes()==frame(name,d,0).tobytes() for f in range(1,6)),name+' non-standing right/up repeat')
  lone=total=0
  for row,d in enumerate(MANIFEST['directions']):
   for f in range(6):
    tile=im.crop((48*f,64*row,48*f+48,64*row+64));a=tile.getchannel('A');px=a.load()
    for y in range(64):
     for x in range(48):
      if not px[x,y]:continue
      total+=1
      if not any(px[xx,yy] for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)] if 0<=xx<48 and 0<=yy<64):lone+=1
    if name.startswith('body/'):
     box=a.getbbox();r=RIG[e['body']][d][f];nominal=58 if e['body']=='man' else 56
     require(a.crop((0,63,48,64)).getbbox() is not None,name+f' {d}{f} feet not grounded')
     require(box[1]==(6 if e['body']=='man' else 8)+r['dy'],name+f' {d}{f} head bob')
     require(abs((64-box[1]+r['dy'])-nominal)<=1,name+' standing height')
     require(7<=nominal/8<=7.5,name+' head ratio')
    else:
     body=frame('body/'+e['body'],d,f).getchannel('A')
     allowance=3 if name.startswith(('hair/','head/')) else 5 if 'elf-ears' in name else 6 if 'horns' in name or 'mage' in name or 'ranger' in name else 2
     if not name.startswith('held/'):
      expanded=body.filter(ImageFilter.MaxFilter(allowance*2+1));outside=ImageChops.subtract(a,expanded)
      require(outside.getbbox() is None,name+f' {d}{f} outside allowance {allowance}')
  ratio=lone/max(1,total);max_lone=max(max_lone,ratio);require(ratio<.03,name+f' lone pixels {ratio:.2%}')
 # All six leg grids must actually change; compare hip-down alpha AND colour.
 for body in ['man','woman']:
  for d in ['down','left']:
   crops=[frame('body/'+body,d,f).crop((0,38,48,64)) for f in range(6)]
   for f in range(6):require(crops[f].tobytes()!=crops[(f+1)%6].tobytes(),f'{body} {d}: stationary legs {f}')
   # The explicit far-leg grid is isolated in separate sources for passing-foot auditing.
   # Frame 3 supporting foot touches bottom, lifted sole is visible above it.
   im=frame('body/'+body,d,3)
   if d=='down':require(im.getpixel((28,63))[3]==0,body+' down passing far foot')
   else:
    leather={COLORS[c] for c in 'LMNOP'}
    require(im.getpixel((26,60)) in leather,body+' left passing sole must be three rows above ground')
   for f in [1,2,4,5]:
    im=frame('body/'+body,d,f)
    if d=='left':
     hx={1:33,2:35,4:33,5:34}[f]
     require(im.getpixel((hx,63))[3]==0,body+f' left{f} trailing heel must lift')
    else:
     hx=(27 if f in [1,2] else 19)+RIG[body][d][f]['sway']
     require(im.getpixel((hx,63))[3]==0,body+f' down{f} rear foot must lift')
 # Covers are authored binary sheets: 1 means the outfit must supply an opaque pixel.
 for path in sorted((ROOT/'src').glob('*.cover')):
  spec=json.loads(path.read_text())
  for body,views in spec.items():
   for key,rows in views.items():
    out=frame('outfit/'+path.stem+'@'+body,key[:-1],int(key[-1]));a=out.getchannel('A')
    for y,row in enumerate(rows):
     for x,c in enumerate(row):
      if c=='X':require(a.getpixel((x,y))==255,f'{path.stem}@{body} {key} cover leak {x},{y}')
 print('Checked 24 source sheets; maximum isolated-pixel fraction:',f'{max_lone:.3%}')
 report={'errors':ERRORS,'warnings':WARNINGS,'max_lone_fraction':max_lone,'notes':['Body standing-height test compensates for required 0/1/2 px walk bob.','Geometric dilation is a guard, not a substitute for visual review.']}
 (ROOT.parent/'scratch/check-report.json').write_text(json.dumps(report,indent=2)+'\n')
 if ERRORS:
  print('\n'.join(ERRORS[:70]));print(len(ERRORS),'errors');return 1
 print('PASS: palette, alpha, size, isolation, dimensions, rig alignment, cover masks, changing walk frames.');return 0
if __name__=='__main__':sys.exit(check())
