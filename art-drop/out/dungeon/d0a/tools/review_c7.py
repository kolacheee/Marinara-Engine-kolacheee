"""Refresh the current C review sheets from saved native deliverables."""
import json
from PIL import Image,ImageDraw
from draw_proofs import BASE as B,REVIEW as R,S
from review_canon_c3 import RAMPS,roles,lightness,text
from review_operator_c import run as contacts

def run():
 contacts()
 # Every actual art sample, with direct native placement and diagnostic copies.
 for category in ('props','swatches'):
  paths=sorted((B/'canon'/category).glob('*.png'))
  for page,start in enumerate(range(0,len(paths),7),1):
   subset=paths[start:start+7];sheet=Image.new('RGB',(1056,48+320*len(subset)),'#222630');d=ImageDraw.Draw(sheet)
   text(d,(12,8),f'C.7 / {category} / 1x, 2x, 3x nearest; grey; quarter-size squint')
   for i,p in enumerate(subset):
    y=48+i*320;im=Image.open(p).convert('RGBA');g=im.convert('L')
    text(d,(12,y-16),p.stem)
    for pic,x in [(im,12),(im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST),132),
     (im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST),348),(g,660),
     (g.resize((g.width*2,g.height*2),Image.Resampling.NEAREST),780),
     (g.resize((g.width//4,g.height//4),Image.Resampling.NEAREST),996)]:
     sheet.paste(pic,(x,y),pic if pic.mode=='RGBA' else None)
   sheet.save(R/f'C-canon-{category}-{page}.png')
 # Complete ramp diagnostics: full native 48px chips, plus exact nearest copies.
 for page,start in enumerate(range(0,len(RAMPS),10),1):
  rows=list(RAMPS.items())[start:start+10];panel=Image.new('RGB',(672,72*len(rows)+24),'#222630');d=ImageDraw.Draw(panel)
  for i,(n,cols) in enumerate(rows):
   y=24+i*72;text(d,(4,y+4),n)
   for j,col in enumerate(cols):
    x=180+j*80;d.rectangle((x,y,x+47,y+47),fill=col)
    text(d,(x,y+50),f'{lightness(col):.1f}'+(' REF' if j+1 in roles(n).get('reference-only',[]) else ''))
  for scale in (1,2,3):panel.resize((panel.width*scale,panel.height*scale),Image.Resampling.NEAREST).save(R/f'C-palette-{page}-{scale}x.png')
  panel.convert('L').save(R/f'C-palette-{page}-grey.png')
  panel.convert('L').resize((panel.width//4,panel.height//4),Image.Resampling.NEAREST).save(R/f'C-palette-{page}-squint.png')
 # Guide review sections retain every source/annotation pixel, with grey/zoom views.
 guide=Image.open(B/'canon/style-guide.png')
 for name,box in json.loads((R/'B-guide-sections.json').read_text()):
  pic=guide.crop(box)
  for scale in (1,2,3):pic.resize((pic.width*scale,pic.height*scale),Image.Resampling.NEAREST).save(R/f'C-guide-{name}-{scale}x.png')
  pic.convert('L').save(R/f'C-guide-{name}-grey.png')
  pic.convert('L').resize((max(1,pic.width//4),max(1,pic.height//4)),Image.Resampling.NEAREST).save(R/f'C-guide-{name}-squint.png')

 # Refresh the original contact names as well as the detailed current views.
 for scale in (1,2):
  for grey in (False,True):
   src=R/f'C-operator-contact-{scale}x{"-grey" if grey else ""}.png'
   dst=R/f'C-contact-{"grey-" if grey else ""}{scale}x.png'
   dst.write_bytes(src.read_bytes())
 (R/'C-squint-review.png').write_bytes((R/'C-operator-squints.png').read_bytes())
 # Native prop contour sheets are diagnostics, never art inputs.
 for n in ('cave_ice','cave_crystal'):
  p=Image.open(R/f'C-layer-{n}-prop.png')
  p.resize((384,384),Image.Resampling.NEAREST).save(R/f'C7-{n}-contour.png')
if __name__=='__main__':run()
