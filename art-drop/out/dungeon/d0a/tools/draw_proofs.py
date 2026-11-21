"""D0a C: native 48px pencil drawings. No random texture or image resampling.
All point paths are authored at final resolution; loops place structural joins.
Diagnostic layers are saved only in review-d0a for the independent pixel checks.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw
BASE=Path(__file__).resolve().parents[1]
REVIEW=BASE.parents[2]/'review-d0a'
P=json.loads((BASE/'canon/palette.json').read_text())
def c(r,s):return P[r][s-1]
def pts(t):return [tuple(map(int,v.split(','))) for v in t.split()]
class Pencil:
 def __init__(self,im):self.im=im;self.d=ImageDraw.Draw(im)
 def rect(self,b,r,s):self.d.rectangle(b,fill=c(r,s))
 def poly(self,t,r,s):self.d.polygon(pts(t),fill=c(r,s))
 def line(self,t,r,s,w=1):self.d.line(pts(t),fill=c(r,s),width=w)
 def paths(self,paths,r,s,w=1):
  for t in paths:self.line(t,r,s,w)
# top, face, floor, floor wear, allowed families, prop name
S={
 'keep': [('iron',2),('limestone',2),('limestone',3),('iron',3),['limestone','wood-oak','iron'],'oak supply crate'],
 'temple':[('marble',1),('sandstone',2),('marble',2),('sandstone',2),['sandstone','marble','brass'],'marble offering altar'],
 'manor':[('timber',2),('plaster',2),('parquet',3),('timber',4),['plaster','timber','parquet','textiles-russet','textiles-teal','textiles-sage'],'upholstered stool'],
 'crypt':[('lichen',1),('dark-masonry',3),('dark-masonry',4),('lichen',3),['dark-masonry','bone','lichen'],'ossuary chest'],
 'cave_rock':[('mud',2),('grey-brown-rock',2),('grey-brown-rock',3),('mud',4),['grey-brown-rock','mud','fungus'],'shelf fungus cluster'],
 'cave_ice':[('blue-ice',1),('blue-ice',2),('blue-ice',3),('snowdrift',3),['blue-ice','frost','snowdrift'],'ice spur and snow cap'],
 'cave_crystal':[('dark-rock',2),('dark-rock',3),('dark-rock',4),('violet-crystal',3),['dark-rock','violet-crystal'],'violet geode'],
 'cave_lava':[('basalt',3),('basalt',4),('basalt',5),('ash',3),['basalt','embers','ash'],'ash ceramic crucible'],
 'dungeon_sewer':[('brick',2),('brick',3),('brick',4),('slime',3),['brick','slime','sewer-water'],'sluice inspection pedestal'],
 'station_corridor':[('hazard-paint',1),('station-panels',2),('station-panels',3),('hazard-paint',2),['station-panels','hazard-paint'],'sealed equipment case'],
 'station_lab':[('clean-tile',1),('tank-glass',2),('clean-tile',3),('tank-glass',3),['clean-tile','tank-glass','spills'],'specimen tank'],
 'station_engine':[('soot',3),('pipes',2),('soot',5),('oil',4),['soot','oil','pipes'],'pump motor'],
 'station_hydro':[('overgrowth',1),('planters',2),('planters',3),('overgrowth',3),['planters','overgrowth','leaks'],'ceramic grow bed'],
 'yard':[('yard-cobble',1),('yard-cobble',2),('yard-grass',3),('yard-grass',4),['yard-grass','yard-path','yard-cobble','roof-slate'],'stone watering trough']}
# Nine unequal worn areas, each designed once across the 3-cell floor period.
WEAR=[
 '8,14 17,14 17,16 23,16 23,19 19,19 19,21 13,21 13,19 8,19',
 '61,8 72,8 72,10 79,10 79,12 76,12 76,14 65,14 65,12 61,12',
 '113,24 122,24 122,22 130,22 130,25 134,25 134,28 128,28 128,30 120,30 120,28 113,28',
 '18,68 24,68 24,65 30,65 30,69 34,69 34,72 29,72 29,75 22,75 22,73 18,73',
 '59,79 65,79 65,76 74,76 74,79 81,79 81,82 73,82 73,85 64,85 64,83 59,83',
 '105,61 117,61 117,63 126,63 126,66 120,66 120,68 111,68 111,66 105,66',
 '9,117 15,117 15,114 22,114 22,117 27,117 27,121 22,121 22,124 16,124 16,122 9,122',
 '68,104 79,104 79,106 86,106 86,109 82,109 82,111 74,111 74,109 68,109',
 '112,128 118,128 118,125 127,125 127,128 134,128 134,132 128,132 128,135 119,135 119,132 112,132']
FRACTURES=['27,4 27,9 30,9 30,13 34,13 34,16 39,16',
 '88,31 84,31 84,35 80,35 80,38 73,38',
 '102,43 108,43 108,40 113,40 113,36',
 '5,88 10,88 10,85 14,85 14,81',
 '55,55 60,55 60,59 65,59 65,64 69,64',
 '138,79 133,79 133,84 129,84 129,88 123,88',
 '33,133 38,133 38,129 41,129 41,124',
 '54,119 59,119 59,122 63,122 63,127 67,127',
 '103,104 108,104 108,108 113,108 113,110 118,110']
def floor(name):
 cfg=S[name]; im=Image.new('RGBA',(144,144),c(*cfg[2]));d=Pencil(im);r,s=cfg[3]
 if name=='manor':
  # Panel divisions stay on 48px cells; grain inside them is not a joint.
  for x in (0,48,96):d.rect((x,0,x,143),'timber',4)
  for y in (0,48,96):d.rect((0,y,143,y),'timber',4)
  d.paths(['7,12 28,12 28,13 38,13','9,25 16,25 16,24 32,24',
   '7,36 22,36 22,38 30,38 30,36 40,36',
   '60,7 60,25 62,25 62,39','73,6 73,17 75,17 75,32',
   '85,11 85,29 83,29 83,39','105,15 118,15 118,17 134,17',
   '108,29 120,29 120,27 130,27 130,29 137,29',
   '15,56 15,69 17,69 17,87','30,55 30,72 28,72 28,83',
   '56,63 70,63 70,61 83,61','60,78 68,78 68,80 87,80',
   '109,54 109,69 111,69 111,89','129,57 129,76 127,76 127,87',
   '7,108 19,108 19,110 37,110','11,128 25,128 25,126 40,126',
   '61,103 61,120 64,120 64,135','79,105 79,121 77,121 77,138',
   '105,108 119,108 119,106 133,106','108,126 121,126 121,129 135,129'],r,s)
 elif name=='yard':
  # Irregular turf edges, a winding dirt strip, and cobbled threshold.
  d.poly('33,0 71,0 71,19 65,19 65,38 60,38 60,65 68,65 68,85 79,85 79,110 73,110 73,126 71,126 71,143 33,143 33,132 32,132 32,118 38,118 38,93 29,93 29,69 23,69 23,44 28,44 28,21 33,21','yard-path',3)
  d.paths(['42,4 48,4 48,18 44,18 44,29','36,49 39,49 39,57 45,57','49,80 54,80 54,89 60,89 60,97','44,116 49,116 49,128 55,128'],'yard-path',4,2)
  # Each cobble has a different stepped silhouette, in 48px threshold cells.
  stones=['100,3 111,3 115,7 115,18 111,22 101,22 98,19 98,7',
   '121,1 136,1 140,5 140,15 136,19 124,19 120,15 120,5',
   '102,28 118,28 122,32 122,43 118,47 106,47 100,41 100,32',
   '128,25 138,25 142,29 142,41 138,45 130,45 126,41 126,29',
   '98,54 109,54 113,58 113,70 108,75 99,75 97,73 97,57',
   '120,52 135,52 140,57 140,70 136,74 123,74 117,68 117,57',
   '102,81 116,81 120,85 120,94 115,99 105,99 100,94 100,84',
   '128,80 139,80 142,83 142,95 138,99 126,99 123,96 123,85',
   '99,106 110,106 116,112 116,123 111,128 101,128 97,124 97,110',
   '125,105 136,105 141,110 141,121 138,124 124,124 120,120 120,110',
   '102,133 117,133 121,137 121,143 99,143 99,136',
   '129,130 139,130 143,134 143,143 126,143 126,133']
  d.rect((96,0,143,143),'yard-cobble',3)
  for t in stones:d.poly(t,'yard-cobble',4)
  d.paths(['103,8 109,8 109,10 112,10','125,7 133,7 133,9 136,9',
   '107,34 114,34 114,37 118,37','130,31 135,31 135,35',
   '100,60 106,60 106,65','123,58 131,58 131,60 136,60',
   '105,87 112,87 112,90','129,86 137,86 137,89',
   '101,113 108,113 108,116 111,116','125,111 133,111 133,115',
   '105,138 113,138','131,136 139,136'],'yard-cobble',3,2)
  d.paths(['8,6 8,11 11,11 11,8','17,23 17,28 20,28 20,25 22,25',
   '7,39 7,43 10,43 10,40','12,62 12,66 15,66 15,63',
   '9,83 9,89 12,89 12,86','19,104 19,109 22,109 22,106',
   '8,127 8,132 11,132 11,129','82,13 82,19 85,19 85,16',
   '76,39 76,45 79,45 79,42 81,42','84,62 84,68 87,68 87,65',
   '88,107 88,112 91,112 91,109','84,130 84,136 87,136 87,133'],r,s)
 else:
  for t in WEAR:d.poly(t,r,s)
  if name in ('keep','temple','crypt','dungeon_sewer','station_corridor','station_lab','station_engine','station_hydro'):
   # Engine/temple floors are slabs, not repeated sub-cell mini tiles.
   for x in (0,48,96):d.rect((x,0,x,143),r,s)
   for y in (0,48,96):d.rect((0,y,143,y),r,s)
  d.paths(FRACTURES,r,s)
  if name=='cave_ice':
   d.poly('8,60 21,60 21,62 29,62 29,65 37,65 37,68 29,68 29,66 19,66 19,64 8,64','frost',3)
   d.poly('55,116 63,116 63,113 69,113 69,111 76,111 76,114 70,114 70,117 64,117 64,120 55,120','frost',3)
  if name=='cave_lava':
   d.paths(['7,34 16,34 16,37 23,37 23,40 30,40','86,61 89,61 89,68 93,68 93,75','54,135 60,135 60,131 66,131'],'embers',3,2)
  if name=='station_engine':
   d.poly('5,104 14,104 14,106 20,106 20,109 25,109 25,113 20,113 20,115 12,115 12,112 5,112','oil',4)
 return im

def wall(name):
 cfg=S[name];im=Image.new('RGBA',(144,96),c('void-mass',2));d=Pencil(im)
 d.rect((0,8,143,47),*cfg[0]);d.rect((0,48,143,94),*cfg[1]);d.rect((0,95,143,95),cfg[1][0],1)
 r,s=cfg[0];fr,fs=cfg[1]
 # Three dispersed top-plane wear shapes: no horizontal stone courses on top.
 d.poly('5,18 17,18 17,20 23,20 23,24 18,24 18,27 10,27 10,24 5,24',r,max(1,s-1))
 d.poly('66,31 73,31 73,28 82,28 82,31 88,31 88,35 81,35 81,38 71,38 71,35 66,35',r,max(1,s-1))
 d.poly('112,12 122,12 122,15 129,15 129,19 123,19 123,22 116,22 116,19 112,19',r,max(1,s-1))
 if name.startswith('cave_'):
  # Individually drawn broad rock facets, with connected seams and shelf lips.
  d.paths(['0,62 16,62 16,66 28,66 28,71 39,71 39,77 48,77 48,94',
   '45,48 45,55 50,55 50,59 60,59 60,64 72,64 72,69 91,69',
   '98,48 98,57 94,57 94,62 89,62 89,68',
   '144,77 127,77 127,81 117,81 117,87 106,87 106,94'],fr,1,2)
  d.paths(['4,65 15,65 15,69 26,69','52,54 63,54 63,57 76,57',
   '103,53 114,53 114,56 125,56','60,84 72,84 72,87 84,87'],r,s,2)
  if name=='cave_ice':
   d.paths(['19,48 19,56 23,56 23,64','74,49 74,55 78,55 78,61','132,50 132,58 135,58 135,64'],'frost',1,2)
  if name=='cave_lava':d.paths(['91,69 95,69 95,74 101,74 101,79 105,79','28,49 28,55 32,55 32,59'],'embers',2,2)
 elif name=='manor':
  # Plaster between timber uprights, a broad skirting beam, no wall brickwork.
  for x in (8,74,131):
   d.rect((x,48,x+6,94),'timber',2);d.rect((x+1,48,x+2,89),'timber',3)
  d.rect((0,89,143,94),'timber',2);d.rect((0,89,143,89),'timber',3)
  d.paths(['23,64 29,64 29,66 35,66','49,78 56,78 56,80 61,80','94,55 100,55 100,58 107,58','113,74 119,74 119,77'],'plaster',1)
 elif name.startswith('station_'):
  for x in (0,48,96):
   d.rect((x,49,x+1,94),fr,1)
   d.rect((x+6,56,x+39,83),*cfg[0])
   d.rect((x+7,57,x+38,81),fr,fs)
  d.rect((0,88,143,90),*cfg[0])
  d.paths(['9,61 17,61 17,64','57,78 66,78 66,75','112,60 121,60 121,63'],fr,1)
  if name=='station_corridor':
   d.rect((6,83,41,86),'hazard-paint',2)
   for x in (8,20,32):d.poly(f'{x},83 {x+4},83 {x+1},86 {x-3},86','station-panels',1)
  if name=='station_lab':d.rect((102,68,129,69),'tank-glass',1)
  if name=='station_engine':
   d.rect((17,49,25,94),'pipes',1);d.rect((18,49,22,94),'pipes',2)
   for y in (57,80):d.rect((16,y,26,y+3),'soot',3)
  if name=='station_hydro':d.paths(['115,49 115,58 111,58 111,64 106,64 106,70','37,50 37,56 33,56 33,61'],'overgrowth',2,2)
 else:
  # Masonry with two-pixel mortar beds, unequal bonds, and worn block corners.
  for y in (62,78):d.rect((0,y,143,y+1),*cfg[0])
  for y,ends in ((48,(24,61,110)),(64,(40,83,127)),(80,(18,67,103))):
   for x in ends:d.rect((x,y,x+1,y+13),*cfg[0])
  d.paths(['6,54 12,54 12,56 17,56','48,69 53,69 53,72 59,72',
   '89,86 94,86 94,89 99,89','119,51 126,51 126,54 131,54'],*cfg[0])
  if name=='crypt':d.paths(['9,83 13,83 13,85 18,85','72,68 76,68 76,71 81,71'],'lichen',2,2)
  if name=='dungeon_sewer':d.paths(['89,80 89,86 94,86 94,92','10,89 19,89 19,92 26,92'],'slime',2,2)
 return im

def prop(name):
 im=Image.new('RGBA',(48,48));d=Pencil(im)
 if name=='keep':
  # Native Part B shape; remap body planes for this floor pairing only.
  im=Image.open(BASE/'canon/props/crate.png').convert('RGBA')
  mapping={c('wood-oak',3):c('wood-oak',5),c('wood-oak',4):c('wood-oak',5)}
  for y in range(48):
   for x in range(48):
    p=im.getpixel((x,y));h='#%02x%02x%02x'%p[:3]
    if p[3] and h in mapping:im.putpixel((x,y),tuple(bytes.fromhex(mapping[h][1:]))+(255,))
  d=Pencil(im)
  d.paths(['14,11 19,12 24,13','20,8 23,8 26,9','10,24 10,28 11,28 11,31','22,33 24,33 24,35'],'wood-oak',2)
 elif name=='temple':
  # Low marble altar with deep recess, brass dish, and moulded stone cornice.
  d.poly('5,19 15,9 40,14 43,17 43,37 33,45 5,40','marble',1)
  d.poly('7,21 31,25 31,42 7,38','sandstone',4)
  d.poly('32,25 41,18 41,36 32,43','brass',4)
  d.poly('9,25 28,28 28,38 9,35','marble',1)
  d.poly('11,26 26,29 26,35 11,33','sandstone',2)
  d.rect((17,28,21,34),'brass',4);d.rect((18,29,19,32),'brass',5)
  d.poly('4,18 14,8 41,13 43,17 32,27 4,22','marble',1)
  d.poly('6,18 15,10 39,14 31,23','marble',3)
  d.line('6,20 31,25 41,17','sandstone',4)
  d.line('7,18 15,10 38,14','marble',4)
  d.paths(['12,17 17,17 17,18 23,18','26,15 30,16 33,16'],'marble',3)
  d.poly('17,10 21,7 30,7 34,10 34,13 30,16 21,16 17,13','brass',1)
  d.poly('18,10 22,8 29,8 33,10 29,13 22,13','brass',4)
  d.line('18,11 22,14 29,14 33,11','brass',3)
  d.line('21,9 29,9','brass',5)
  d.line('6,39 32,44 42,37','marble',2)
 elif name=='manor':
  for x,y in ((8,27),(32,29),(13,19),(37,21)):
   d.poly(f'{x},{y} {x+4},{y} {x+3},{y+15} {x},{y+16}','timber',1)
   d.rect((x+1,y+1,x+2,y+13),'timber',5)
  d.poly('5,15 15,5 38,9 43,14 43,25 33,34 5,28','timber',1)
  d.poly('6,24 33,29 41,22 41,26 33,32 6,27','timber',5)
  d.poly('6,15 16,6 37,10 41,14 32,24 6,20','textiles-sage',1)
  d.poly('8,15 17,8 36,12 39,15 31,22 8,19','textiles-sage',4)
  d.poly('7,21 32,25 40,18 40,23 32,29 7,24','textiles-sage',2)
  d.line('8,16 16,9 36,13','textiles-sage',5)
  d.paths(['15,15 19,16 22,16','28,15 31,16 33,16','18,20 21,21 25,21'],'textiles-sage',3)
  d.line('8,25 30,29','timber',6)
 elif name=='crypt':
  d.poly('4,19 13,10 40,14 43,18 43,35 33,44 4,39','dark-masonry',1)
  d.poly('5,22 32,26 32,42 5,37','dark-masonry',6)
  d.poly('33,26 41,19 41,34 33,41','lichen',4)
  d.poly('4,17 13,8 40,12 43,16 33,26 4,21','dark-masonry',1)
  d.poly('6,17 14,10 39,14 32,22','dark-masonry',6)
  d.line('6,19 32,24 41,17','bone',3)
  # Skull relief, cheek planes and two connected recessed eye sockets.
  d.poly('13,27 17,24 23,25 27,29 26,34 23,36 17,35 14,32','bone',1)
  d.poly('15,27 18,26 22,27 25,29 24,33 21,34 17,33','bone',3)
  d.rect((16,28,18,29),'dark-masonry',2);d.rect((21,29,23,30),'dark-masonry',2)
  d.line('18,33 22,34','bone',4)
  d.paths(['8,14 13,14 13,16 17,16','34,29 36,29 36,32 39,32'],'lichen',4)
 elif name=='cave_rock':
  # A single connected fungus colony with three unequal caps.
  d.poly('8,38 16,32 30,32 39,37 41,42 34,45 16,45 8,42','grey-brown-rock',1)
  d.poly('10,38 17,34 29,34 37,38 35,42 17,43','mud',6)
  d.poly('21,18 28,18 29,38 26,41 22,39','fungus',1)
  d.poly('23,19 26,19 27,37 25,39 23,37','fungus',4)
  d.poly('8,14 11,9 17,5 27,5 34,9 38,14 38,18 32,22 16,22 8,18','fungus',1)
  d.poly('9,14 12,10 18,7 26,7 32,10 36,14 32,17 16,17','fungus',4)
  d.line('11,14 14,11 19,8 25,8','fungus',5)
  d.paths(['13,19 19,20 29,20 34,18','22,11 27,11 30,13'],'fungus',2)
  d.poly('8,30 13,26 20,26 24,30 23,33 17,35 10,34','fungus',1)
  d.poly('10,30 14,28 19,28 22,30 18,32 12,32','fungus',4)
  d.line('15,35 15,39 18,40','fungus',4,2)
  d.poly('31,30 35,26 40,27 43,30 42,33 36,34 31,32','fungus',1)
  d.poly('33,30 36,28 39,29 41,31 36,32','fungus',4)
  d.line('36,34 36,38 33,40','fungus',4,2)
 elif name in ('cave_ice','cave_crystal'):
  ice=name=='cave_ice';r='blue-ice' if ice else 'violet-crystal';body=2 if ice else 4
  d.poly('4,36 12,30 29,28 41,35 44,41 38,45 13,45 4,41',r,1)
  d.poly('6,36 14,32 29,31 39,36 41,40 36,43 14,43',r,body)
  crystals=[('17,8 24,2 31,8 31,33 25,40 17,34','18,9 24,4 24,37 18,33','25,5 29,9 29,32 25,37'),
   ('5,24 10,15 15,19 18,37 13,41 7,37','7,24 10,18 12,20 15,37 12,38','11,18 14,20 16,36 14,38'),
   ('31,25 37,16 42,21 40,36 34,41 30,37','32,26 37,19 37,35 33,38','38,19 40,22 38,35 35,38')]
  for edge,left,right in crystals:
   d.poly(edge,r,1);d.poly(left,r,body);d.poly(right,'snowdrift' if ice else r,2 if ice else 4)
  d.paths(['19,10 23,6','8,24 10,20','33,27 36,23'],r,3 if ice else 5)
  if ice:
   d.poly('13,39 18,36 25,36 29,38 34,38 38,41 35,43 17,43','snowdrift',2)
   d.line('15,39 19,37 24,37','snowdrift',4)
  else:d.paths(['26,12 26,25','12,25 14,34','36,28 35,34'],r,5)
 elif name=='cave_lava':
  d.poly('10,13 15,7 33,7 39,13 39,20 35,37 30,43 18,43 12,37 9,20','ash',1)
  d.poly('11,17 36,17 34,35 29,40 19,40 14,35','ash',4)
  d.poly('28,19 36,18 33,35 28,40 25,40','ash',2)
  d.poly('10,13 16,9 32,9 37,13 37,18 32,22 16,22 11,18','ash',1)
  d.poly('12,13 17,10 31,10 35,13 31,17 17,17','ash',5)
  d.poly('16,13 19,11 29,11 32,13 29,16 19,16','basalt',1)
  d.paths(['19,13 23,13 23,15 27,15','30,25 28,25 28,29 25,29'],'embers',3)
  d.line('12,18 17,20 31,20 36,17','ash',4)
  d.paths(['15,25 15,31 18,35','20,39 27,39'],'ash',5)
  d.poly('6,22 10,21 12,25 11,30 8,31 5,28','ash',1)
  d.line('8,24 7,26 8,28','ash',4)
 elif name=='dungeon_sewer':
  d.poly('5,19 15,9 40,13 43,17 43,36 33,45 5,40','brick',1)
  d.poly('6,22 32,27 32,42 6,38','sewer-water',5)
  d.poly('33,27 41,19 41,35 33,42','slime',4)
  d.poly('5,18 15,8 40,12 43,16 32,26 5,22','sewer-water',1)
  d.poly('7,18 16,10 39,14 31,23','sewer-water',5)
  d.line('7,20 31,25 41,17','sewer-water',3)
  for x in (12,18,24):d.poly(f'{x},17 {x+5},12 {x+8},13 {x+3},19','sewer-water',1)
  d.poly('11,29 27,32 27,38 11,35','sewer-water',1)
  d.line('13,31 25,33','sewer-water',3)
  d.paths(['36,22 37,22 37,29 35,29 35,33','7,36 11,36 11,38 16,39'],'slime',4,2)
 elif name=='station_corridor':
  d.poly('4,17 14,7 39,11 44,17 44,36 34,44 4,39','station-panels',1)
  d.poly('6,19 33,24 33,41 6,37','station-panels',4)
  d.poly('34,24 42,18 42,35 34,41','hazard-paint',4)
  d.poly('6,16 15,9 38,13 41,17 33,22','station-panels',4)
  d.line('7,16 15,9 37,13','station-panels',5)
  d.poly('10,24 28,27 28,36 10,33','station-panels',2)
  d.line('12,25 26,28','station-panels',3)
  d.poly('13,13 17,10 28,12 29,14 26,17 15,15','station-panels',1)
  d.line('16,13 18,12 26,13','station-panels',4)
  d.rect((8,20,11,24),'hazard-paint',4);d.rect((27,23,30,27),'hazard-paint',4)
  d.paths(['8,35 12,36','27,38 31,39','37,26 39,24 39,31'],'station-panels',5)
 elif name=='station_lab':
  # Opaque glass planes, not transparency or a glow.
  d.poly('7,37 13,31 35,31 41,37 41,42 35,46 13,46 7,42','tank-glass',1)
  d.poly('9,37 14,33 34,33 39,37 34,42 14,42','tank-glass',4)
  d.line('9,41 14,44 34,44 39,41','clean-tile',3)
  d.poly('11,11 16,6 32,6 37,11 37,35 32,40 16,40 11,35','tank-glass',1)
  d.poly('13,12 18,8 30,8 35,12 35,34 30,38 18,38 13,34','tank-glass',4)
  d.rect((30,13,34,34),'tank-glass',2)
  d.poly('21,19 26,16 29,20 28,25 25,29 25,34 20,34 19,29 21,25','spills',2)
  d.poly('22,20 25,18 27,21 25,25 23,27 21,25','spills',4)
  d.paths(['15,14 15,27','16,31 16,34 19,36'],'tank-glass',5)
  d.poly('10,10 16,4 32,4 38,10 38,14 32,18 16,18 10,14','tank-glass',1)
  d.poly('12,10 17,6 31,6 36,10 31,14 17,14','clean-tile',4)
  d.line('12,13 17,16 31,16 36,13','tank-glass',4)
  d.rect((20,8,27,10),'tank-glass',2)
 elif name=='station_engine':
  d.poly('3,30 12,22 38,25 44,32 44,40 35,46 3,40','pipes',1)
  d.poly('5,32 34,37 34,43 5,38','pipes',4)
  d.poly('35,37 42,32 42,39 35,43','pipes',4)
  d.poly('9,19 14,13 30,13 36,19 36,32 30,38 14,35 9,30','pipes',1)
  d.poly('11,19 16,15 29,15 34,19 34,31 29,35 15,32 11,29','pipes',4)
  for x in (15,20,25):d.line(f'{x},20 {x},30','soot',3,2)
  d.line('13,18 17,16 28,16','pipes',5)
  d.poly('31,7 39,7 41,10 41,25 36,30 32,27 32,14 28,14 25,11 25,8','pipes',1)
  d.poly('28,9 38,9 39,11 39,24 36,27 34,25 34,12 28,12','pipes',4)
  d.line('29,9 37,9 38,10 38,23','pipes',5)
  d.rect((32,19,42,22),'soot',3);d.rect((33,19,41,20),'pipes',3)
  d.paths(['7,35 12,36','29,39 32,40'],'oil',3)
 elif name=='station_hydro':
  d.poly('4,23 14,13 40,18 43,23 39,39 32,45 9,40','planters',1)
  d.poly('6,25 32,30 37,26 35,38 31,42 11,38','planters',4)
  d.poly('4,22 14,12 40,17 43,22 33,32 4,27','planters',1)
  d.poly('6,22 15,14 39,19 40,22 32,29 6,25','planters',4)
  d.poly('10,22 16,17 36,20 32,25','overgrowth',1)
  # Four different leaf masses grow from one centre.
  d.paths(['23,25 23,18 18,12','24,24 29,17 34,12','22,22 15,21 10,17','24,24 31,25 37,22'],'overgrowth',2,2)
  for shape in ['12,5 17,6 21,10 23,17 19,18 15,14 12,9',
   '30,6 37,4 38,9 35,14 28,19 25,17 27,11',
   '5,12 12,12 17,16 18,21 13,22 8,18 5,16',
   '33,18 40,17 44,20 41,24 34,27 28,25 28,22']:
   d.poly(shape,'overgrowth',4)
  d.paths(['14,7 16,11 20,15','35,7 32,11 29,15','8,14 12,16 15,19','40,20 36,22 31,23'],'overgrowth',5)
  d.line('8,25 31,30','planters',5)
  d.paths(['12,32 12,35 16,36','27,36 30,37 32,35'],'planters',3)
 elif name=='yard':
  d.poly('3,21 14,10 40,15 44,20 42,37 33,45 4,39','yard-cobble',1)
  d.poly('5,24 32,29 32,42 6,37','yard-cobble',5)
  d.poly('33,29 42,21 40,36 33,42','yard-cobble',5)
  d.poly('3,20 14,9 40,14 44,19 33,30 3,25','yard-cobble',1)
  d.poly('5,20 15,11 39,16 41,19 32,27 5,23','yard-cobble',5)
  d.poly('10,21 17,14 35,17 37,19 31,24','roof-slate',1)
  d.poly('13,21 18,17 34,19 30,23','roof-slate',3)
  d.line('6,20 15,11 38,16','yard-cobble',6)
  d.paths(['9,30 13,31 13,34','23,36 27,36 27,38','35,32 38,29'],'yard-cobble',3)
  d.line('16,20 22,21 29,21','roof-slate',4)
 return im

def build():
 REVIEW.mkdir(exist_ok=True);(BASE/'proof').mkdir(exist_ok=True)
 for name,cfg in S.items():
  from proof_finish import finish_floor, finish_wall, finish_prop
  f=finish_floor(floor(name),name);w=finish_wall(wall(name),name);p=finish_prop(prop(name),name)
  im=f.copy();im.paste(w,(0,0));im.alpha_composite(p,(86,96))
  im.save(BASE/'proof'/f'{name}.png')
  im.convert('L').convert('RGBA').save(BASE/'proof'/f'{name}-grey.png')
  for tag,layer in (('floor',f),('wall',w),('prop',p)):
   layer.save(REVIEW/f'C-layer-{name}-{tag}.png')
  tiled=Image.new('RGBA',(432,432))
  for y in range(3):
   for x in range(3):tiled.paste(f,(144*x,144*y))
  tiled.save(REVIEW/f'proof-3x3repeat-{name}.png')
if __name__=='__main__':build()
