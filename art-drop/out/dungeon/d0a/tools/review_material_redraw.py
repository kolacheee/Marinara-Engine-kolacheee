"""Review-only comparisons for the critic 2 redraw; never an art input."""
from PIL import Image,ImageDraw
from draw_style_samples import CANON,ROOT,c
from redraw_material_studies import FAILED
from check_style_guide import text
R=ROOT/'art-drop/review-d0a'
master=Image.open(ROOT/'art-drop/dungeon/reference/master-interiors-mock.png')
sheet=Image.new('RGB',(1104,1920),c('void-mass',1));d=ImageDraw.Draw(sheet)
for i,n in enumerate(sorted(FAILED)):
 y=i*192;im=Image.open(CANON/'swatches'/f'{n}.png').convert('RGB')
 ref=(Image.open(CANON/'crops/overworld-grass.png').crop((0,0,96,48)) if n=='building-yard' else
      Image.open(CANON/'crops/floor.png').crop((0,0,96,48)) if n=='manor' else
      master.crop((1944,2112,2040,2160)))
 text(d,(12,y+4),n+' / native / source / 2x / source 2x / 3x / grey / squint')
 for pic,xy in [(im,(12,y+24)),(ref,(72,y+24)),
  (im.resize((96,96),Image.Resampling.NEAREST),(180,y+24)),
  (ref.resize((192,96),Image.Resampling.NEAREST),(288,y+24)),
  (im.resize((144,144),Image.Resampling.NEAREST),(492,y+24)),
  (im.convert('L'),(648,y+24)),
  (im.convert('L').resize((12,12),Image.Resampling.NEAREST),(708,y+24))]:sheet.paste(pic,xy)
sheet.save(R/'B-material-overview.png');sheet.save(R/'B-critic2-materials.png')
guide=Image.open(CANON/'style-guide.png')
for name,box in [('top',(0,0,1728,760)),('studies',(0,760,1728,1016)),('do-dont',(0,1240,1728,1680))]:
 guide.crop(box).save(R/f'B-final-guide-{name}-1x.png')
# Concrete alternative for the pending owner decision. No deliverable uses it.
candidate=guide.crop((0,320,1728,576));d=ImageDraw.Draw(candidate)
for i,n in [(1,'door'),(2,'table'),(5,'crate')]:
 x=48+i*272;d.rectangle((x,56,x+143,199),fill=c('ash',2))
 sprite=Image.open(CANON/'props'/f'{n}.png')
 candidate.paste(sprite,(x+48-(24 if sprite.width==96 else 0),200-sprite.height),sprite)
d.rectangle((0,230,1727,255),fill=c('void-mass',1))
text(d,(48,234),'PROPOSAL: oak examples use L*30.34 DISPLAY BACKING, outside the L*35-55 scene-floor rule.')
candidate.save(R/'B-proposed-display-backing.png')
