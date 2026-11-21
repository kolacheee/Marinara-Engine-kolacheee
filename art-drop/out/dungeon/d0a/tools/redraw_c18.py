"""Round 18 native drawings. All coordinates below are final 48-cell art pixels.

C17 compositions are visual references only: no sampled surface pixel is read.
Only the frozen, separately authored prop sprites are composited from PNGs.
Rectangles and orthogonal paths are the pencil; no noise or filtering is used.
"""
from collections import Counter
from PIL import Image, ImageDraw
from draw_proofs import BASE, REVIEW, S, c

NAMES = ['keep','temple','manor','crypt','cave_rock','cave_ice',
         'cave_crystal','cave_lava','dungeon_sewer','yard']

class Pencil:
    def __init__(self, size, colour):
        self.im = Image.new('RGBA', size, colour)
        self.d = ImageDraw.Draw(self.im)
    def rect(self, box, colour): self.d.rectangle(box, fill=colour)
    def path(self, points, colour, width=1):
        self.d.line(points, fill=colour, width=width)
    def poly(self, points, colour): self.d.polygon(points, fill=colour)


def masonry(name):
    # Each list describes actual cut stones, not a generated texture field.
    ramps = {
        'keep': ('limestone', c('iron',2), c('limestone',2), c('iron',3)),
        'temple': ('sandstone', c('marble',1), c('sandstone',2), c('sandstone',3)),
        'crypt': ('dark-masonry', c('dark-masonry',3), c('dark-masonry',4), c('dark-masonry',5)),
        'dungeon_sewer': ('brick', c('brick',2), c('brick',3), c('brick',4)),
        'yard': ('yard-cobble', c('yard-cobble',1), c('yard-cobble',2), c('yard-cobble',3)),
    }
    ramp, topfill, facefill, light = ramps[name]
    dark = c(ramp, 2 if name=='crypt' else 1)
    top = Pencil((144,40),dark)
    # Three large capstones; edge chips are individual authored additions below.
    for a,b in [(1,46),(49,94),(97,142)]:
        top.rect((a,2,b,38),topfill)
        top.path([(a,37),(a,2),(b-2,2)], facefill)
    top.path([(20,2),(20,3),(30,3)],topfill)
    top.path([(92,34),(92,36),(88,36),(88,38)],dark)
    top.path([(115,2),(115,4),(120,4)],topfill)
    if name=='keep':
        top.path([(12,18),(17,18),(17,17),(21,17)],facefill)
        top.path([(66,27),(72,27)],facefill)
        top.path([(126,17),(130,17),(130,16),(135,16)],facefill)
    elif name=='temple':
        top.rect((4,5,17,6),c('sandstone',2))
        top.rect((66,4,77,5),c('sandstone',2))
        top.path([(110,31),(115,31),(115,30),(119,30)],c('sandstone',2))
    elif name=='crypt':
        top.path([(2,8),(9,8),(9,6),(15,6),(15,4)],facefill)
        top.path([(71,2),(71,5),(75,5),(75,8),(79,8)],dark)
        top.rect((103,34,113,36),facefill)
    elif name=='dungeon_sewer':
        top.rect((4,3,17,3),facefill)
        top.rect((61,3,74,3),facefill)
        top.path([(122,37),(125,37),(125,35),(130,35)],dark)
    else:
        top.path([(6,30),(6,33),(12,33)],facefill)
        top.rect((78,3,85,3),facefill)
        top.path([(128,36),(136,36),(136,35)],facefill)
    face=Pencil((144,47),dark)
    joints={
        'keep':[(0,51,116,144),(0,59,127,144),(0,38,103,144)],
        'temple':[(0,114,144),(0,56,144),(0,124,144)],
        'crypt':[(0,12,68,144),(0,43,125,144),(0,15,88,144)],
        'dungeon_sewer':[(0,18,144),(0,31,81,144),(0,57,116,144)],
        'yard':[(0,21,61,108,144),(0,39,93,144),(0,10,83,126,144)],
    }[name]
    # Two-pixel recesses, one continuous upper lip; no dotted mortar edges.
    for y,ends in zip((0,16,32),joints):
        for a,b in zip(ends,ends[1:]):
            face.rect((a+1,y+2,b-2,min(y+14,46)),facefill)
            face.path([(a+1,y+13),(a+1,y+2),(b-2,y+2)],light)
    if name=='keep':
        face.rect((23,12,30,14),dark)
        face.rect((26,11,30,11),facefill)
        face.path([(79,7),(89,7)],light)
        face.path([(118,26),(124,26),(124,28)],dark)
        face.path([(49,41),(54,41),(54,40),(60,40)],light)
    elif name=='temple':
        face.path([(32,12),(37,12),(37,10),(42,10)],dark)
        face.path([(32,13),(38,13),(38,11),(42,11)],light)
        face.rect((77,40,88,41),facefill)
    elif name=='crypt':
        face.path([(8,4),(8,9),(10,9),(10,13)],c('lichen',2),2)
        face.path([(15,20),(15,25),(17,25),(17,30),(14,30),(14,38)],c('lichen',2),2)
        face.path([(95,26),(101,26),(101,24),(105,24)],dark)
    elif name=='dungeon_sewer':
        face.poly([(16,2),(20,2),(20,11),(18,11),(18,17),(21,17),(21,23),(18,23),(18,32),(20,32),(20,38),(17,38),(17,46),(14,46),(14,35),(15,35),(15,26),(16,26)],c('slime',2))
        face.path([(109,11),(117,11),(117,10),(120,10)],c('brick',2))
        face.rect((65,42,73,43),c('brick',2))
    else:
        face.path([(31,11),(35,11),(35,12),(40,12)],light)
        face.path([(69,26),(77,26)],light)
        face.path([(113,36),(113,40),(117,40)],dark)
    return top.im,face.im


def manor():
    top=Pencil((144,40),c('timber',2))
    for x in (0,48,96):
        top.rect((x,0,x,39),c('timber',1))
        top.path([(x+1,38),(x+1,1),(x+46,1)],c('timber',3))
    for path in [[(7,31),(21,31),(21,30),(29,30)],[(58,28),(62,28),(62,29),(78,29)],[(105,32),(119,32),(119,31),(131,31)]]:
        top.path(path,c('timber',3))
    face=Pencil((144,47),c('plaster',2))
    face.rect((0,0,143,11),c('timber',3))
    face.rect((0,0,143,0),c('timber',4))
    face.rect((0,10,143,12),c('timber',2))
    for x in (0,48,96):
        face.rect((x,0,x+9,46),c('timber',3))
        face.rect((x,13,x+1,46),c('timber',2))
        face.rect((x+3,4,x+6,6),c('timber',4))
    # Separate grain paths, following the long fibres; no stippled plaster.
    for path in [[(4,18),(4,25),(5,25),(5,36)],[(7,29),(7,43)],[(51,21),(51,32),(53,32),(53,44)],[(55,15),(55,24)],[(101,17),(101,28),(103,28),(103,39)]]:
        face.path(path,c('timber',4))
    floor=Pencil((144,48),c('parquet',3))
    # Three 48px parquet panels. The inset lines are wood grain, not extra joints.
    for x in (0,48,96):
        floor.rect((x+1,1,x+47,47),c('timber',4))
    floor.rect((2,2,22,23),c('parquet',4))
    floor.rect((26,25,46,46),c('parquet',4))
    floor.rect((50,25,70,46),c('parquet',4))
    floor.rect((74,2,94,23),c('parquet',4))
    floor.rect((98,2,118,23),c('parquet',4))
    floor.rect((122,25,142,46),c('parquet',4))
    for path in [[(3,8),(17,8),(17,9),(21,9)],[(3,16),(12,16),(12,17),(20,17)],[(29,27),(29,42),(30,42),(30,45)],[(39,28),(39,38),(40,38),(40,44)],[(52,31),(64,31),(64,32),(69,32)],[(53,39),(61,39),(61,40),(69,40)],[(79,4),(79,14),(80,14),(80,21)],[(88,3),(88,18)],[(101,7),(111,7),(111,8),(116,8)],[(100,17),(106,17),(106,16),(115,16)],[(127,28),(127,36),(128,36),(128,45)],[(137,29),(137,42)]]:
        floor.path(path,c('timber',4))
    for path in [[(27,7),(27,18)],[(35,5),(35,15),(36,15),(36,21)],[(43,8),(43,20)],[(5,29),(14,29),(14,30),(21,30)],[(4,38),(19,38)],[(5,45),(14,45)],[(53,6),(63,6),(63,7),(69,7)],[(52,15),(60,15),(60,16),(68,16)],[(77,28),(77,40)],[(86,26),(86,36),(85,36),(85,44)],[(92,32),(92,43)],[(100,29),(111,29),(111,30),(117,30)],[(101,39),(115,39)],[(124,5),(124,16)],[(133,4),(133,13),(134,13),(134,21)],[(140,7),(140,18)]]:
        floor.path(path,c('parquet',3))
    return top.im,face.im,floor.im


def cave(name):
    # Large continuous planes. All boundaries use explicit orthogonal runs.
    values={
      'cave_rock':('mud',2,'grey-brown-rock',1,2,3),
      'cave_ice':('frost',1,'blue-ice',1,2,3),
      'cave_crystal':('dark-rock',2,'dark-rock',1,3,4),
      'cave_lava':('basalt',3,'basalt',2,4,5),
    }
    tr,ts,r,ds,fs,ls=values[name]
    dark,front,lit=c(r,ds),c(r,fs),c(r,ls)
    top=Pencil((144,40),c(tr,ts));face=Pencil((144,47),front)
    if name=='cave_rock':
        # Connected upper-left plate fracture and a broad lower lip.
        top.poly([(0,0),(25,0),(25,7),(23,7),(23,13),(28,13),(28,17),(34,17),(34,20),(42,20),(42,23),(50,23),(50,27),(46,27),(46,32),(40,32),(40,36),(33,36),(33,39),(0,39)],c('mud',1))
        top.poly([(0,0),(24,0),(24,6),(22,6),(22,14),(27,14),(27,18),(33,18),(33,21),(41,21),(41,24),(47,24),(47,27),(43,27),(43,31),(37,31),(37,34),(30,34),(30,36),(0,36)],c('mud',2))
        top.path([(24,0),(24,6),(22,6)],front)
        top.path([(27,15),(27,18),(33,18),(33,21),(41,21),(41,24),(47,24)],front)
        top.path([(31,36),(39,36),(39,33),(46,33),(46,29),(51,29),(51,23),(61,23),(61,21),(72,21),(72,18),(86,18)],dark,2)
        top.path([(96,0),(96,8),(93,8),(93,15),(88,15),(88,19),(94,19),(94,23),(99,23),(99,28),(103,28),(103,36),(109,36),(109,39)],dark,2)
        top.path([(3,38),(19,38),(19,36),(29,36)],front)
        top.path([(111,38),(126,38),(126,35),(137,35),(137,37),(143,37)],front)
        face.path([(24,0),(24,11),(27,11),(27,19),(31,19),(31,27),(34,27),(34,40),(30,40),(30,46)],dark,2)
        face.path([(54,0),(54,4),(60,4),(60,7),(73,7),(73,5),(80,5),(80,0)],dark,2)
        face.path([(113,0),(113,12),(110,12),(110,23),(106,23),(106,33),(102,33),(102,46)],dark,2)
        face.path([(3,43),(22,43),(22,42),(27,42)],lit)
        face.path([(127,43),(135,43),(135,42),(143,42)],lit)
    elif name=='cave_ice':
        # Monotonic bowed lip; a uniform connected one-pixel top-left highlight.
        bow=[(4,28),(12,28),(12,30),(20,30),(20,32),(30,32),(30,34),(42,34),(42,36),(58,36),(58,35),(70,35),(70,33),(80,33),(80,30),(88,30),(88,26),(94,26),(94,21),(99,21),(99,15),(103,15),(103,8),(106,8),(106,0)]
        top.poly(bow+[(143,0),(143,39),(0,39),(0,28)],dark)
        top.path(bow,front)
        fracture=[(35,0),(35,4),(31,4),(31,8),(27,8),(27,12),(23,12),(23,16),(19,16),(19,22),(16,22),(16,30),(14,30),(14,39)]
        top.path(fracture,dark,3)
        top.path([(37,0),(37,4),(33,4),(33,8),(29,8),(29,12),(25,12),(25,16),(21,16),(21,22),(18,22),(18,30),(16,30),(16,39)],front)
        top.rect((19,23,19,23),c('frost',1))
        top.path([(107,23),(115,23),(115,27),(122,27),(122,31),(128,31),(128,34),(134,34),(134,37),(143,37)],front)
        for path in [[(18,0),(18,8),(16,8),(16,16),(14,16),(14,24),(11,24),(11,31),(8,31),(8,38),(5,38),(5,46)],[(112,0),(112,7),(110,7),(110,15),(107,15),(107,23),(103,23),(103,30),(98,30),(98,36),(92,36),(92,41),(85,41),(85,46)]]:
            face.path(path,c('frost',3))
        face.poly([(20,0),(39,0),(39,6),(36,6),(36,13),(32,13),(32,21),(28,21),(28,30),(24,30),(24,39),(20,39),(20,46),(8,46),(8,39),(11,39),(11,32),(14,32),(14,25),(17,25),(17,17),(19,17)],c('frost',1))
    elif name=='cave_crystal':
        lip=[(12,0),(12,8),(14,8),(14,14),(18,14),(18,19),(23,19),(23,23),(29,23),(29,26),(36,26),(36,29),(44,29),(44,32),(53,32),(53,35),(63,35)]
        top.poly(lip+[(63,39),(44,39),(44,36),(36,36),(36,33),(29,33),(29,30),(23,30),(23,26),(18,26),(18,22),(14,22),(14,18),(10,18),(10,10),(9,10),(9,0)],dark)
        top.path(lip,front)
        top.path([(121,0),(121,5),(118,5),(118,10),(114,10),(114,15),(109,15),(109,19),(103,19),(103,23),(96,23),(96,26),(88,26),(88,29),(79,29),(79,33),(73,33),(73,39)],dark,2)
        top.path([(102,25),(111,25),(111,27),(119,27),(119,29),(126,29),(126,32),(132,32),(132,36),(137,36),(137,39)],front)
        seam=[(51,0),(51,6),(48,6),(48,12),(44,12),(44,18),(39,18),(39,24),(34,24),(34,30),(28,30),(28,36),(22,36),(22,42),(17,42),(17,46)]
        face.path(seam,c('dark-rock',2),3)
        face.path([(49,1),(49,6),(46,6),(46,12),(42,12),(42,18),(37,18),(37,24),(32,24),(32,30)],c('violet-crystal',3),2)
        face.path([(25,35),(25,39),(21,39),(21,43),(17,43)],c('violet-crystal',2),2)
        face.path([(20,0),(20,10),(18,10),(18,20),(21,20),(21,27),(26,27)],c('dark-rock',2))
        face.path([(115,0),(115,9),(113,9),(113,18),(110,18),(110,27),(106,27),(106,35),(101,35),(101,46)],lit)
        face.path([(113,0),(113,9),(111,9),(111,18),(108,18),(108,27),(104,27),(104,35),(99,35),(99,46)],c('dark-rock',2))
    else:
        # Broad basalt plates meeting at fractures; muted heat follows the clefts.
        for path in [[(24,0),(28,0),(28,12),(31,12),(31,20),(38,20),(38,23),(45,23),(45,27),(51,27),(51,32),(53,32),(53,39)],[(38,23),(31,23),(31,26),(25,26),(25,30),(21,30),(21,34),(17,34),(17,39)],[(131,0),(129,0),(129,19),(126,19),(126,24),(119,24),(119,27),(110,27),(110,31),(103,31),(103,39)]]:
            top.path(path,dark,2)
        top.path([(4,36),(12,36),(12,38),(29,38),(29,36),(43,36)],front)
        top.path([(69,37),(83,37),(83,35),(91,35)],front)
        fractures=[[(18,0),(18,7),(15,7),(15,15),(20,15),(20,21),(28,21),(28,26),(37,26),(37,32),(44,32),(44,40),(48,40),(48,46)],[(51,0),(51,8),(47,8),(47,15),(43,15),(43,22),(37,22),(37,32)],[(80,0),(80,7),(76,7),(76,12),(66,12),(66,16),(59,16),(59,24),(53,24),(53,33),(57,33),(57,41),(61,41),(61,46)],[(80,7),(85,7),(85,16),(91,16),(91,21),(103,21),(103,28),(110,28),(110,36),(115,36),(115,46)],[(119,0),(119,6),(115,6),(115,15),(111,15),(111,23),(103,23)]]
        for path in fractures:face.path(path,dark,2)
        face.path([(46,10),(46,15),(42,15),(42,22),(38,22)],c('embers',2))
        face.path([(114,15),(114,22),(110,22),(110,28)],c('embers',2))
        face.rect((42,26,43,30),c('embers',3))
        face.rect((113,38,114,42),c('embers',3))
    return top.im,face.im


def floors(name):
    fill={'keep':('limestone',3),'temple':('marble',3),'crypt':('dark-masonry',5),
      'cave_rock':('mud',4),'cave_ice':('blue-ice',3),'cave_crystal':('dark-rock',4),
      'cave_lava':('ash',3),'dungeon_sewer':('brick',4),'yard':('yard-grass',3)}[name]
    p=Pencil((144,48),c(*fill))
    joints={'keep':('iron',3),'temple':('marble',2),'crypt':('dark-masonry',4),'dungeon_sewer':('brick',3)}
    if name in joints:
        for x in (0,48,96):p.rect((x,0,x,47),c(*joints[name]))
        p.rect((0,0,143,0),c(*joints[name]))
    if name=='keep':
        p.path([(12,13),(19,13),(19,12),(23,12)],c('iron',3))
        p.path([(65,33),(73,33),(73,32),(79,32)],c('iron',3))
        p.poly([(48,25),(51,25),(51,28),(53,28),(53,30),(50,30),(50,33),(48,33)],c('iron',3))
    elif name=='temple':
        p.path([(14,34),(14,31),(18,31),(18,28),(21,28),(21,24),(23,24),(23,20)],c('marble',2),2)
        p.path([(61,28),(65,28),(65,26),(68,26)],c('marble',2))
        p.path([(76,19),(80,19)],c('marble',2))
    elif name=='crypt':
        # One finite chip on the first slab; all other grid edges stay straight.
        p.poly([(0,29),(3,29),(3,32),(6,32),(6,35),(10,35),(10,38),(6,38),(6,40),(3,40),(3,43),(0,43)],c('dark-masonry',4))
        p.path([(66,14),(73,14),(73,12),(77,12)],c('dark-masonry',4))
        p.rect((121,38,128,39),c('lichen',3))
    elif name=='cave_rock':
        p.poly([(22,22),(25,22),(25,19),(30,19),(30,17),(39,17),(39,19),(43,19),(43,22),(45,22),(45,27),(41,27),(41,29),(26,29),(26,27),(22,27)],c('grey-brown-rock',3))
        p.path([(24,23),(27,23),(27,20),(31,20),(31,19),(37,19)],c('grey-brown-rock',4),2)
    elif name=='cave_ice':
        p.poly([(12,16),(15,16),(15,13),(20,13),(20,11),(29,11),(29,12),(35,12),(35,14),(41,14),(41,17),(45,17),(45,19),(38,19),(38,21),(28,21),(28,23),(20,23),(20,25),(13,25),(13,22),(11,22),(11,18),(12,18)],c('snowdrift',3))
        p.path([(13,25),(19,25),(19,23),(27,23),(27,21),(37,21),(37,19),(44,19)],c('blue-ice',2),2)
        p.path([(67,29),(75,29),(75,27),(81,27),(81,24),(87,24)],c('blue-ice',2))
        # Close three one-pixel snow slivers left where the lower lip turns.
        for xy in [(38,21),(28,23),(20,25)]: p.rect((*xy,*xy),c('blue-ice',2))
    elif name=='cave_crystal':
        p.poly([(20,25),(26,25),(26,23),(30,23),(30,20),(34,20),(34,18),(39,18),(39,21),(35,21),(35,24),(31,24),(31,27),(24,27),(24,28),(20,28)],c('dark-rock',5))
    elif name=='cave_lava':
        # One connected lava channel, forked upstream, with one bright core.
        path=[(16,17),(20,17),(20,19),(27,19),(27,18),(34,18),(34,21),(39,21),(39,25),(45,25),(45,28),(54,28),(54,31),(62,31),(62,34),(69,34),(69,32),(75,32),(75,29),(81,29),(81,26)]
        p.path(path,c('basalt',5),7)
        p.path(path,c('embers',3),5)
        p.path(path,c('embers',4),2)
        fork=[(36,20),(36,16),(40,16),(40,12),(44,12),(44,9),(49,9),(49,6)]
        p.path(fork,c('basalt',5),5);p.path(fork,c('embers',3),3)
        p.path([(39,16),(39,20),(43,20),(43,23),(48,23)],c('embers',4),2)
        p.rect((42,22,45,22),c('embers',3))
    elif name=='dungeon_sewer':
        p.poly([(15,1),(19,1),(19,7),(22,7),(22,13),(20,13),(20,19),(17,19),(17,23),(13,23),(13,19),(15,19),(15,12),(14,12),(14,6),(15,6)],c('slime',3))
        p.path([(66,34),(73,34),(73,32),(78,32)],c('brick',3))
    elif name=='yard':
        p.poly([(54,0),(87,0),(87,47),(54,47),(54,41),(51,41),(51,34),(48,34),(48,26),(51,26),(51,18),(54,18)],c('yard-path',4))
        p.rect((88,0,133,47),c('yard-path',3))
        # Four different cobbles: rounded stepped shoulders and broad upper planes.
        stones=[
          ([(94,4),(99,4),(99,2),(110,2),(110,4),(114,4),(114,7),(116,7),(116,13),(113,13),(113,16),(98,16),(98,14),(93,14),(93,10),(91,10),(91,7),(94,7)],
           [(97,5),(102,5),(102,3),(109,3),(109,5),(113,5),(113,8),(110,8),(110,10),(96,10),(96,8),(94,8),(94,6),(97,6)]),
          ([(119,9),(123,9),(123,6),(130,6),(130,9),(133,9),(133,19),(130,19),(130,21),(120,21),(120,18),(117,18),(117,12),(119,12)],
           [(121,10),(125,10),(125,8),(129,8),(129,11),(131,11),(131,15),(120,15),(120,12),(121,12)]),
          ([(91,24),(95,24),(95,21),(105,21),(105,23),(110,23),(110,27),(113,27),(113,34),(110,34),(110,37),(96,37),(96,35),(92,35),(92,31),(90,31),(90,27),(91,27)],
           [(95,25),(98,25),(98,23),(104,23),(104,25),(108,25),(108,28),(110,28),(110,30),(94,30),(94,27),(95,27)]),
          ([(119,30),(124,30),(124,27),(132,27),(132,29),(135,29),(135,35),(133,35),(133,39),(129,39),(129,42),(119,42),(119,39),(116,39),(116,33),(119,33)],
           [(121,32),(126,32),(126,29),(131,29),(131,32),(133,32),(133,35),(128,35),(128,37),(119,37),(119,34),(121,34)])]
        for body,plane in stones:
            p.poly(body,c('yard-cobble',3));p.poly(plane,c('yard-cobble',4))
        # Compact clump with four connected blades, not a lone branching twig.
        p.poly([(28,24),(28,20),(26,20),(26,15),(29,15),(29,19),(32,19),(32,13),(35,13),(35,21),(38,21),(38,17),(41,17),(41,20),(39,20),(39,25),(35,25),(35,27),(30,27),(30,25)],c('yard-grass',4))
        p.path([(62,36),(68,36),(68,35),(72,35)],c('yard-path',3),2)
    return p.im


def run():
    for name in NAMES:
        if name=='manor':top,face,floor=manor()
        else:
            top,face=cave(name) if name.startswith('cave_') else masonry(name)
            floor=floors(name)
        wall=Image.new('RGBA',(144,96),c('void-mass',2))
        wall.paste(top,(0,8));wall.paste(face,(0,48))
        ImageDraw.Draw(wall).line((0,95,143,95),fill=c(S[name][1][0],1))
        prop=Image.open(REVIEW/f'C-layer-{name}-prop.png').convert('RGBA')
        proof=Image.new('RGBA',(144,144));proof.paste(wall);proof.paste(floor,(0,96));proof.alpha_composite(prop,(86,96))
        for tag,im in [('top',top),('face',face),('floor',floor),('wall',wall),('proof',proof)]:
            im.save(REVIEW/f'C18-{name}-{tag}.png')
        proof.save(BASE/f'proof/{name}.png')
        proof.convert('L').convert('RGBA').save(BASE/f'proof/{name}-grey.png')
        wall.save(REVIEW/f'C-layer-{name}-wall.png')
        backing=Image.new('RGBA',(144,144),Counter(floor.get_flattened_data()).most_common(1)[0][0])
        backing.paste(floor,(0,96));backing.save(REVIEW/f'C-layer-{name}-floor.png')

if __name__=='__main__':run()
