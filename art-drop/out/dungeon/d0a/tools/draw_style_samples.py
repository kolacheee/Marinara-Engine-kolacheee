"""Part B native drawings: integer pencil geometry and individually placed clusters."""
import json
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parents[5]
CANON = ROOT / 'art-drop/out/dungeon/d0a/canon'
RAMPS = json.loads((CANON / 'palette.json').read_text())
def c(r,s): return RAMPS[r][s-1]
def canvas(w=48,h=48): return Image.new('RGBA',(w,h))
def rect(d,b,r,s): d.rectangle(b,fill=c(r,s))
def poly(d,p,r,s,outline=None): d.polygon(p,fill=c(r,s),outline=c(r,outline) if outline else None)
def line(d,p,r,s): d.line(p,fill=c(r,s),width=1)
def marks(d,r,s,paths):
 for p in paths: line(d,p,r,s)
def patches(d,r,s,shapes):
 for p in shapes: poly(d,p,r,s)

def crate():
 im=canvas();d=ImageDraw.Draw(im);r='wood-oak'
 # Three full planes, one shared contour. Sloping rails have five-pixel runs.
 poly(d,[(5,15),(17,3),(42,8),(42,31),(30,43),(5,38)],r,3)
 poly(d,[(5,15),(17,3),(42,8),(30,20)],r,5)
 poly(d,[(5,15),(30,20),(30,43),(5,38)],r,5)
 # Coordinates on the front face; x/5 is its authored stair-step slope.
 def face(points,s): poly(d,[(5+x,15+y+x//5) for x,y in points],r,s)
 face([(3,4),(21,4),(21,19),(3,19)],2)
 face([(4,5),(8,5),(8,18),(4,18)],4)
 face([(10,5),(14,5),(14,18),(10,18)],3)
 face([(16,5),(20,5),(20,18),(16,18)],4)
 face([(4,5),(6,5),(6,11),(4,10)],5)
 face([(11,6),(13,6),(13,13),(11,15)],4)
 face([(18,6),(20,6),(20,10),(18,12)],5)
 face([(1,1),(23,1),(23,3),(1,3)],6)
 face([(1,4),(2,4),(2,20),(1,20)],4)
 face([(22,4),(24,4),(24,21),(22,21)],4)
 face([(3,20),(21,20),(21,22),(3,22)],4)
 face([(3,20),(19,20),(19,20),(3,20)],6)
 # A solid diagonal brace with a single lower shadow and a worn lit arris.
 face([(3,5),(6,5),(21,17),(21,20),(18,20),(3,8)],2)
 face([(3,5),(5,5),(21,18),(21,19),(19,19),(3,7)],5)
 face([(4,5),(6,6),(19,17),(18,17)],6)
 face([(9,9),(12,12),(12,13),(9,11)],4)
 # Right frame and its inset panel are shaded, not another front face.
 poly(d,[(32,21),(40,13),(40,30),(32,38)],r,2)
 poly(d,[(33,22),(38,17),(38,29),(33,34)],r,3)
 line(d,[(35,21),(35,32)],r,4)
 poly(d,[(32,24),(34,24),(39,29),(39,32),(37,32),(32,27)],r,4)
 line(d,[(32,24),(38,30)],r,5)
 line(d,[(32,39),(41,30)],r,5)
 line(d,[(41,13),(41,29)],r,4)
 # Inset top boards and substantial top rails.
 poly(d,[(10,14),(18,6),(37,10),(29,18)],r,3)
 poly(d,[(12,13),(18,7),(35,10),(29,16)],r,4)
 marks(d,r,5,[[(13,12),(30,15)],[(16,9),(33,12)],[(10,15),(29,19)],[(18,4),(40,8)]])
 marks(d,r,6,[[(7,15),(16,6)],[(18,5),(25,6)],[(30,18),(39,9)]])
 # Connected end-grain, knots and rail chips, each drawn once.
 patches(d,r,4,[[(20,8),(24,8),(26,9),(24,10),(20,9)],[(8,17),(12,18),(12,19),(8,18)],[(24,39),(27,39),(28,40),(25,40)]])
 marks(d,r,2,[[(7,35),(8,35),(8,37)],[(27,23),(28,23),(28,25)]])
 marks(d,r,3,[[(11,27),(12,28),(12,30)],[(24,30),(26,30),(26,32)],[(16,36),(18,36),(20,37)]])
 marks(d,r,6,[[(6,28),(6,31)],[(22,21),(25,22)],[(9,37),(12,38)]])
 # Final single-width silhouette and sole face boundary.
 line(d,[(5,15),(17,3),(42,8),(42,31),(30,43),(5,38),(5,15)],r,1)
 line(d,[(5,15),(30,20),(42,8)],r,1)
 line(d,[(30,20),(30,43)],r,1)
 line(d,[(5,15),(17,3),(42,8)],r,2)
 return im

def chest():
 im=canvas();d=ImageDraw.Draw(im);r='textiles-teal';g='loot-gold'
 # Barrel lid viewed from above and the left; a visible eight-pixel return.
 poly(d,[(4,21),(5,16),(7,12),(10,9),(14,7),(32,7),(36,9),(39,12),(41,16),(42,21),(42,35),(34,42),(4,39)],r,3)
 poly(d,[(4,21),(5,16),(7,12),(10,9),(14,7),(32,7),(36,9),(39,12),(41,16),(34,24)],r,4)
 poly(d,[(8,13),(11,10),(15,9),(31,9),(35,11),(36,13),(29,16),(12,15)],r,5)
 poly(d,[(5,18),(8,15),(30,18),(33,21),(34,24),(4,21)],r,3)
 poly(d,[(5,24),(33,27),(33,39),(5,36)],r,4)
 poly(d,[(35,26),(41,21),(41,34),(35,39)],r,2)
 # Lid boards follow the bowed top. Body planks have substantial colour clusters.
 marks(d,r,3,[[(12,11),(29,11),(34,13)],[(9,14),(28,16),(31,18)],[(7,29),(31,32)]])
 patches(d,r,5,[[(8,25),(15,26),(18,28),(16,29),(8,28)],[(25,34),(31,34),(31,36),(27,36),(25,35)]])
 patches(d,r,3,[[(16,33),(21,33),(23,35),(20,36),(14,35),(14,34)],[(25,26),(30,27),(30,29),(28,29)]])
 # Raised bands: several hard metal planes along the lid curvature.
 for x in (9,27):
  poly(d,[(x+6,8),(x+8,8),(x+4,11),(x+2,15),(x+1,20),(x+2,24),(x+2,38),(x-1,38),(x-1,23),(x-2,19),(x-1,14),(x+2,10)],g,2)
  poly(d,[(x+5,9),(x+6,9),(x+2,12),(x,16),(x,20),(x+1,23),(x+1,36),(x,36),(x,23),(x-1,19),(x,14),(x+2,11)],g,5)
  marks(d,g,6,[[(x+2,11),(x+4,9)],[(x,14),(x,17)]])
  line(d,[(x,26),(x,30)],g,4)
  line(d,[(x,33),(x,35)],g,6)
 # Lip sits over the body; the recessed lock bridges it.
 line(d,[(4,22),(34,25),(42,18)],r,1)
 line(d,[(5,23),(33,26)],r,5)
 poly(d,[(18,22),(24,23),(25,25),(25,30),(23,32),(18,31),(17,29),(17,24)],g,1)
 poly(d,[(19,23),(23,24),(24,26),(24,29),(22,30),(19,29)],g,4)
 line(d,[(19,24),(22,24),(23,25)],g,6)
 rect(d,(20,26,22,27),g,1);rect(d,(21,28,21,29),g,1)
 marks(d,r,5,[[(36,29),(38,27)],[(36,34),(38,32)]])
 # Separate small feet beneath the rim.
 rect(d,(6,40,10,42),r,1);rect(d,(29,42,33,44),r,1)
 line(d,[(4,21),(5,16),(7,12),(10,9),(14,7),(32,7),(36,9),(39,12),(41,16),(42,21),(42,35),(34,42),(4,39),(4,21)],r,1)
 line(d,[(4,21),(5,16),(7,12),(10,9),(14,7),(32,7)],r,2)
 line(d,[(34,25),(34,42)],r,1)
 line(d,[(5,37),(33,40),(41,34)],r,2)
 # Inset foot faces and one-pixel lid/side junction.
 rect(d,(7,40,9,41),r,2);rect(d,(30,43,32,43),r,2)
 rect(d,(41,18,41,19),r,3)
 return im

def column():
 im=canvas(48,96);d=ImageDraw.Draw(im);r='limestone'
 # Octagonal stone base: 1:1 corners, broad top, thin stepped mouldings.
 poly(d,[(8,78),(14,72),(33,72),(39,78),(39,86),(34,91),(13,91),(8,86)],r,3)
 poly(d,[(9,78),(15,73),(32,73),(38,78),(33,83),(14,83)],r,4)
 poly(d,[(12,78),(16,74),(31,74),(35,78),(31,81),(16,81)],r,5)
 marks(d,r,2,[[(8,78),(14,84),(33,84),(39,78)],[(9,86),(14,90),(33,90),(38,85)]])
 line(d,[(10,85),(14,88),(32,88)],r,4)
 # Shaft is a cylinder with recessed flutes, rings, and local chipped planes.
 poly(d,[(14,23),(33,23),(33,74),(30,78),(18,78),(14,74)],r,4)
 poly(d,[(15,26),(18,28),(18,72),(20,75),(29,75),(31,72),(32,27),(32,74),(29,77),(19,77),(15,74)],r,3)
 poly(d,[(16,27),(18,29),(18,67),(17,70),(16,68)],r,5)
 poly(d,[(21,28),(23,26),(25,28),(25,68),(23,72),(21,69)],r,5)
 poly(d,[(26,29),(28,27),(29,29),(29,69),(27,72),(26,69)],r,3)
 line(d,[(27,30),(27,66)],r,2)
 marks(d,r,4,[[(22,30),(22,42)],[(22,48),(22,66)],[(30,31),(30,51)],[(30,57),(30,70)]])
 # Narrow collar; broad lit planes do not extend as stripes through the capital.
 poly(d,[(13,23),(34,23),(34,26),(30,29),(18,29),(13,26)],r,3)
 line(d,[(14,24),(18,27),(30,27),(33,24)],r,5)
 poly(d,[(14,71),(18,74),(29,74),(33,71),(33,74),(29,78),(18,78),(14,74)],r,4)
 line(d,[(15,73),(19,76),(28,76)],r,5)
 # Capital top uses four equal 1:1 corner advances.
 poly(d,[(8,13),(14,7),(33,7),(39,13),(39,19),(34,24),(13,24),(8,19)],r,3)
 poly(d,[(9,13),(15,8),(32,8),(37,13),(33,17),(13,17)],r,5)
 poly(d,[(13,13),(16,10),(30,10),(33,13),(30,15),(16,15)],r,4)
 line(d,[(9,14),(13,18),(34,18),(38,14)],r,2)
 line(d,[(10,18),(14,22),(33,22)],r,4)
 line(d,[(14,19),(18,20),(27,20)],r,5)
 line(d,[(15,9),(30,9)],r,6)
 # Individual fractures and bevel chips, joined to the plane they break.
 patches(d,r,3,[[(17,11),(20,11),(21,12),(19,13),(17,13)],[(29,15),(32,14),(34,14),(32,16),(29,16)],[(15,43),(18,43),(20,45),(20,48),(18,46),(15,46)],[(23,60),(25,58),(26,58),(26,61),(24,63),(23,63)]])
 marks(d,r,5,[[(16,47),(18,48),(18,50)],[(23,64),(24,64),(24,66)]])
 patches(d,r,2,[[(31,35),(32,35),(32,39),(30,41),(30,39)],[(34,82),(36,80),(38,80),(36,83),(34,84)]])
 marks(d,r,5,[[(15,79),(19,80),(23,80)],[(12,85),(14,86),(17,86)]])
 marks(d,r,4,[[(25,86),(29,86),(31,85)],[(34,19),(36,17)]])
 line(d,[(8,13),(14,7),(33,7),(39,13),(39,19),(34,24),(33,24),(33,72),(39,78),(39,86),(34,91),(13,91),(8,86),(8,78),(14,72),(14,25),(13,24),(8,19),(8,13)],r,1)
 line(d,[(8,13),(14,7),(33,7)],r,2)
 return im

def door():
 im=canvas(48,96);d=ImageDraw.Draw(im);r='limestone';w='wood-oak'
 outer=[(3,85),(3,32),(4,26),(6,22),(9,19),(13,17),(19,16),(28,16),(34,17),(38,19),(41,22),(43,26),(44,32),(44,85)]
 poly(d,outer,r,3)
 # A continuous inner recess, with a warm reflected edge on the left jamb.
 inner=[(10,85),(10,33),(11,29),(13,26),(16,24),(20,23),(27,23),(31,24),(34,26),(36,29),(37,33),(37,85)]
 poly(d,inner,w,1)
 leaf=[(13,83),(13,34),(14,30),(16,27),(20,25),(27,25),(31,27),(33,30),(34,34),(34,83)]
 poly(d,leaf,w,4)
 # Each plank has its own broad grain and exposed edge.
 poly(d,[(14,34),(16,28),(18,27),(18,82),(14,82)],w,5)
 poly(d,[(20,26),(22,26),(22,82),(20,82)],w,5)
 rect(d,(24,27,27,82),w,5);rect(d,(30,31,32,82),w,3)
 marks(d,w,2,[[(19,27),(19,83)],[(23,26),(23,83)],[(29,29),(29,83)]])
 patches(d,w,4,[[(14,41),(16,39),(17,41),(17,48),(16,51),(14,50)],[(24,31),(26,33),(27,38),(27,44),(25,42),(24,37)],[(20,63),(22,65),(22,73),(20,71)],[(25,74),(27,72),(28,75),(28,80),(26,81),(25,79)]])
 marks(d,w,6,[[(14,34),(15,32),(16,32)],[(20,30),(20,37)],[(25,46),(27,47),(27,50)],[(14,73),(15,75),(15,79)]])
 marks(d,w,3,[[(16,55),(17,57),(17,63)],[(25,57),(26,56),(27,58),(27,61)],[(21,75),(21,79)]])
 # Individually bevelled jamb blocks. Joint shadow is one pixel wide.
 for x,x1,blocks in [(4,9,[(34,45,4),(47,59,5),(61,73,4),(75,84,4)]),(38,43,[(34,44,3),(46,58,4),(60,72,3),(74,84,4)])]:
  for y,y1,s in blocks:
   rect(d,(x,y,x1,y1),r,s)
   line(d,[(x,y1),(x1,y1)],r,2)
   line(d,[(x,y),(x1-1,y)],r,s+1)
   line(d,[(x,y),(x,y1-1)],r,s+1 if x==4 else s)
   line(d,[(x1,y+1),(x1,y1-1)],r,3 if x==4 else 2)
 # Arch stones have wedge construction, curved shoulders are explicit runs.
 patches(d,r,4,[[(5,32),(6,27),(8,24),(11,27),(10,32)],[(8,23),(11,20),(15,19),(17,23),(13,25)],[(16,18),(20,17),(20,22),(18,23)],[(22,17),(27,17),(28,22),(22,22)],[(29,18),(33,19),(36,21),(33,25),(30,23)],[(37,23),(40,25),(42,32),(38,32),(36,28)]])
 marks(d,r,5,[[(6,30),(7,27),(8,26)],[(10,22),(13,20),(15,20)],[(17,19),(18,19),(18,21)],[(23,18),(26,18)],[(30,19),(32,20)],[(38,25),(40,28)]])
 marks(d,r,2,[[(11,21),(13,24)],[(20,17),(20,22)],[(28,18),(29,23)],[(37,22),(34,26)]])
 # Chips interrupt bevels with connected small shapes.
 marks(d,r,3,[[(5,39),(6,40),(6,42)],[(6,54),(8,55),(8,57)],[(5,68),(6,68),(7,70)],[(39,50),(41,51),(41,53)],[(40,79),(42,80)]])
 marks(d,r,5,[[(6,63),(7,64),(7,65)],[(39,63),(40,64),(41,64)]])
 # Tapered iron hinges, modest in scale; no large rectangular lock plate.
 for y in (43,69):
  poly(d,[(13,y),(29,y),(32,y+1),(29,y+2),(13,y+2)],'iron',2)
  line(d,[(14,y),(28,y)],'iron',3)
  rect(d,(14,y+1,15,y+1),'iron',4)
 poly(d,[(29,53),(31,51),(33,52),(34,55),(33,59),(30,60),(28,57),(28,55)],'iron',1)
 line(d,[(29,54),(31,53),(32,54),(32,57),(30,58),(29,57)],'iron',4)
 line(d,[(30,54),(31,54),(31,56)],'iron',2)
 line(d,outer+[outer[0]],r,1)
 line(d,[(3,85),(3,32),(4,26),(6,22),(9,19),(13,17),(19,16),(28,16)],r,2)
 rect(d,(3,86,44,89),r,1);rect(d,(4,86,43,87),r,5)
 line(d,[(4,88),(43,88)],r,4)
 return im

def table():
 im=canvas(96,96);d=ImageDraw.Draw(im);r='wood-oak'
 # Trestle joinery, separated legs and a mortised stretcher under the apron.
 for x,y in [(19,45),(70,45),(11,54),(78,54)]:
  poly(d,[(x,y),(x+6,y),(x+6,81),(x+4,85),(x,85)],r,3,1)
  rect(d,(x+1,y+2,x+2,81),r,5)
  line(d,[(x+4,y+4),(x+4,79)],r,4)
 poly(d,[(16,70),(78,70),(78,75),(16,75)],r,2)
 rect(d,(18,70,76,71),r,4);line(d,[(22,73),(68,73)],r,3)
 poly(d,[(17,56),(30,56),(18,69)],r,2)
 poly(d,[(65,56),(78,56),(77,68)],r,2)
 marks(d,r,4,[[(18,58),(27,58),(18,66)],[(68,58),(76,58),(76,65)]])
 # Side slopes exactly one x pixel for two y pixels.
 poly(d,[(20,24),(75,24),(87,48),(87,53),(83,57),(12,57),(8,53),(8,48)],r,3)
 poly(d,[(20,24),(75,24),(87,48),(8,48)],r,5)
 # Boards carry broad grain bands and inset joins, no surface outlines.
 poly(d,[(19,28),(76,28),(78,32),(17,32)],r,4)
 poly(d,[(18,30),(76,30),(77,31),(18,31)],r,5)
 poly(d,[(16,35),(80,35),(80,37),(15,37)],r,4)
 poly(d,[(15,39),(82,39),(84,43),(13,43)],r,4)
 poly(d,[(14,40),(81,40),(82,41),(14,41)],r,5)
 line(d,[(21,25),(74,25)],r,6)
 marks(d,r,3,[[(18,33),(78,33)],[(15,38),(81,38)],[(12,44),(84,44)]])
 marks(d,r,6,[[(19,34),(34,34)],[(46,34),(71,34)],[(16,39),(27,39)],[(55,45),(81,45)]])
 # Different connected grain and knot shapes in each board.
 patches(d,r,4,[[(24,26),(37,26),(40,27),(49,27),(49,28),(38,28),(35,27),(24,27)],[(55,26),(67,26),(70,28),(66,29),(58,29),(55,28)],[(23,35),(28,34),(34,35),(38,36),(35,37),(27,37)],[(44,35),(53,35),(56,36),(64,36),(64,37),(52,37),(49,36),(44,36)],[(18,41),(29,41),(34,42),(42,42),(42,43),(30,43),(27,42),(18,42)],[(45,40),(49,39),(54,40),(59,42),(56,43),(48,43),(44,42)],[(21,46),(38,46),(42,47),(47,47),(47,48),(38,48),(34,47),(21,47)],[(67,46),(77,46),(79,47),(73,48),(66,48),(64,47)]])
 marks(d,r,3,[[(58,27),(64,27),(66,28)],[(25,35),(28,35),(30,36)],[(47,41),(50,40),(53,41),(51,42),(48,42)]])
 marks(d,r,6,[[(39,29),(48,29),(51,30)],[(66,36),(72,36),(75,37)],[(20,42),(25,42)],[(57,47),(62,47)]])
 # Top thickness, narrow apron, and pegged corner joints.
 line(d,[(9,49),(86,49)],r,6)
 line(d,[(10,51),(85,51)],r,4)
 line(d,[(12,54),(83,54)],r,2)
 rect(d,(15,55,80,56),r,4)
 marks(d,r,5,[[(18,52),(24,52)],[(36,52),(49,52)],[(68,52),(74,52)]])
 marks(d,r,2,[[(13,57),(15,57),(15,60)],[(79,58),(81,58),(81,61)]])
 marks(d,r,4,[[(12,67),(13,68),(13,73)],[(80,75),(82,77),(82,80)]])
 # Final contour does not redraw a leg boundary alongside another dark edge.
 line(d,[(20,24),(75,24),(87,48),(87,53),(83,57),(12,57),(8,53),(8,48),(20,24)],r,1)
 line(d,[(8,48),(20,24),(75,24)],r,2)
 return im

SWATCHES={
 'keep':('limestone',3),'temple':('sandstone',3),'manor':('parquet',3),
 'crypt':('dark-masonry',4),'cave_rock':('grey-brown-rock',3),'cave_ice':('blue-ice',3),
 'cave_crystal':('dark-rock',4),'cave_lava':('basalt',5),'dungeon_sewer':('brick',3),
 'station_corridor':('station-panels',3),'station_lab':('clean-tile',3),
 'station_engine':('soot',4),'station_hydro':('clean-tile',3),'building-yard':('yard-grass',3)}
def swatch(name):
 from redraw_critic3 import FAILED, draw as revised
 if name in FAILED:return revised(name)
 from draw_material_studies import draw
 return draw(name)
def build():
 for folder in ('props','swatches'):(CANON/folder).mkdir(parents=True,exist_ok=True)
 for name in ('crate','chest','column','door','table'):
  p=CANON/'props'/f'{name}.png'
  if not p.exists():globals()[name]().save(p)
 for name in SWATCHES:
  # Passing studies are preserved byte for byte; only synthesize if missing.
  p=CANON/'swatches'/f'{name}.png'
  if not p.exists():swatch(name).save(p)
if __name__=='__main__':build()
