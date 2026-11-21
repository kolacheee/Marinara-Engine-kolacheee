"""Refresh only the named canon guide placements; preserve all source crops."""
import json
from PIL import Image,ImageDraw,ImageFont
from draw_style_samples import CANON,SWATCHES,c,RAMPS
from build_palette import lightness,roles
from pathlib import Path
R=CANON.parents[3]/'review-d0a'
FONT=ImageFont.load_default_imagefont()
BG=c('void-mass',1);INK=c('bone',5);MUTED=c('limestone',5)
def label(d,xy,t,col=INK):
 d.fontmode='1';d.text(xy,t,fill=col,font=FONT)
def run():
 # Start from the delivered guide so all untouched reference placements remain.
 im=Image.open(CANON/'style-guide.png').convert('RGB');d=ImageDraw.Draw(im)
 for name,x in [('crate',48),('chest',592),('column',1136)]:
  p=Image.open(CANON/'props'/f'{name}.png');d.rectangle((x,148,x+47,148+p.height-1),fill=BG);im.paste(p,(x,148),p)
 # Rebuild each native scale backing, preserving labels and legacy party source.
 items=[('door',1,(48,96)),('table',2,(96,96)),('chest',3,(48,48)),('column',4,(48,96)),('crate',5,(48,48))]
 for n,i,sz in items:
  x=48+i*272;back=c('limestone',2) if n in ('chest','column') else c('ash',2)
  d.rectangle((x,376,x+143,519),fill=back)
  for xx in range(x,x+145,48):d.line((xx,376,xx,519),fill=c('void-mass',4))
  for yy in range(376,521,48):d.line((x,yy,x+143,yy),fill=c('void-mass',4))
  p=Image.open(CANON/'props'/f'{n}.png');im.paste(p,(x+48-(24 if sz[0]==96 else 0),520-sz[1]),p)
 d.rectangle((48,616,191,711),fill=c('ash',2));p=Image.open(CANON/'props/crate.png');im.paste(p,(104,646),p)
 d.line((68,622,95,648),fill=c('wood-oak',6));d.line((87,648,95,648,95,640),fill=c('wood-oak',6))
 for i,n in enumerate(SWATCHES):
  x=48+i%7*240;y=800+i//7*94
  im.paste(Image.open(CANON/'swatches'/f'{n}.png'),(x,y))
  if n=='station_hydro':
   d.rectangle((x+56,y+17,x+233,y+29),fill=BG);label(d,(x+56,y+17),'planters / growth / leaks')
  d.rectangle((x+56,y+34,x+233,y+46),fill=BG);label(d,(x+56,y+34),'48 px / material cutaway',MUTED)
 for xy,name,size in [((704,1524),'props/table.png',(96,96)),((1032,1524),'swatches/keep.png',(48,48))]:
  d.rectangle((xy[0],xy[1],xy[0]+size[0]-1,xy[1]+size[1]-1),fill=BG)
  p=Image.open(CANON/name);im.paste(p,xy,p)
 # Paint each complete ramp row, including the explicit reference-only label.
 for i,(n,cols) in enumerate(RAMPS.items()):
  x=48+i//21*552;y=1720+i%21*62
  d.rectangle((x,y,x+535,y+61),fill=BG);label(d,(x,y),n)
  for j,col in enumerate(cols):
   xx=x+j*80;d.rectangle((xx,y+14,xx+63,y+33),fill=col)
   ref=' REF' if j+1 in roles(n).get('reference-only',[]) else ''
   label(d,(xx,y+36),f'{j+1} L*{lightness(col):.0f}'+ref)
   label(d,(xx,y+48),col,MUTED)
 d.rectangle((48,64,1640,76),fill=BG)
 label(d,(48,64),'Version D0a-C.2 / owner corrections applied / native 48 px / orthographic top + front; no side faces',MUTED)
 d.rectangle((48,992,1670,1008),fill=BG)
 label(d,(48,992),'Material cutaways include wall, floor and trim. Part C proofs test surface values and prop/floor contrast.',MUTED)
 # Synchronize annotation pigments too, preserving verbatim source regions.
 old=json.loads((R/'C-before-palette.json').read_text())
 mapping={tuple(bytes.fromhex(old[n][i][1:])):tuple(bytes.fromhex(col[1:])) for n,cols in RAMPS.items() for i,col in enumerate(cols) if old[n][i]!=col}
 mask=Image.new('1',im.size,0);md=ImageDraw.Draw(mask)
 for x,y,u,v in json.loads((R/'B-guide-exemptions.json').read_text()):md.rectangle((x,y,u-1,v-1),fill=1)
 im.putdata([mapping.get(v,v) if not m else v for v,m in zip(im.get_flattened_data(),mask.get_flattened_data())])
 im.save(CANON/'style-guide.png')
 # Changed prose preserves all other canon guidance.
 p=CANON/'STYLE.md';s=p.read_text().replace('Version D0a-B.1','Version D0a-C.2')
 s=s.replace("Use the master PNG's high three-quarter view, visible top planes, narrow side faces, joinery and material detail.",
 "Use an orthographic high three-quarter view: a top plane and front face, parallel verticals, no side faces and no converging edges. Match the master PNG's art-pixel scale, joinery and material detail. The master is stored at 2×: one art pixel is one registered 2×2 source block.")
 s=s.replace('The chest has a teal body, gold bands and a central lock.','The chest has a teal body, gold bands and a plain rectangular hasp.')
 s=s.replace('These establish colour and texture; Part C supplies the larger wall/floor/prop proofs and production patterns.',
 'These cutaways show wall finish, floor material and characteristic trim. Their full value range is not a floor pairing. Part C supplies the larger wall/floor/prop proofs; production patterns follow later.')
 s=s.replace('The pale steps marked reference-only stay out of scene art.',
 'Active adjacent steps are at least 6 L* apart. Marble 6, clean-tile 6, bone 6 and blue-ice 6 are reference-only and stay out of scene art.')
 p.write_text(s)
if __name__=='__main__':run()
