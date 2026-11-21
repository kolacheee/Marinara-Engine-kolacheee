"""Operator C redraw: native 48 px pencil construction, no resampling.
The tuples below are individually laid-out stone/plane footprints and grain runs.
Loops assemble the drawn pieces; no random noise or filtered texture is used.
Run with PYTHONDONTWRITEBYTECODE=1. Review-only zooms live in review-d0a.
"""
from PIL import Image, ImageDraw
import json, hashlib
from draw_proofs import BASE, REVIEW, S, P, c
from redraw_proofs_c1 import Pen
import redraw_proofs_c3 as old
from check_proofs import light, rgb

def fields(im, colors, box=None, stone=True):
 from operator_c_materials import texture
 layer=Image.new('RGBA',(144,144),c(*colors[0]))
 if colors[0][0]!='parquet':texture(layer,[colors[0]],colors[1],colors[2],(0,0,144,144))
 if box:im.paste(layer.crop(box),box[:2])
 else:im.paste(layer,(0,0))
 return im

FLOOR={
 'keep':[('limestone',3),('iron',3),('limestone',2),('limestone',3)],
 'temple':[('marble',2),('marble',3),('marble',2),('marble',3)],
 'manor':[('parquet',4),('timber',4),('parquet',3),('parquet',4)],
 'crypt':[('dark-masonry',4),('bone',2),('lichen',3),('dark-masonry',4)],
 'cave_rock':[('grey-brown-rock',3),('mud',4),('mud',5),('grey-brown-rock',4)],
 'cave_ice':[('blue-ice',3),('frost',2),('snowdrift',3),('blue-ice',3)],
 'cave_crystal':[('dark-rock',4),('violet-crystal',3),('dark-rock',4),('violet-crystal',3)],
 'cave_lava':[('basalt',5),('ash',3),('basalt',5),('ash',3)],
 'dungeon_sewer':[('brick',4),('sewer-water',3),('brick',3),('brick',4)],
 'station_engine':[('soot',5),('oil',4),('pipes',3),('soot',5)],
 'yard':[('yard-grass',3),('yard-path',3),('yard-grass',4),('yard-grass',3)],
}

def floor(n):
 im=Image.new('RGBA',(144,144));d=Pen(im)
 if n in ('station_corridor','station_lab','station_hydro'):
  # Deliberately smooth manufactured material: broad surfaces with bevels,
  # fastening flanges and controlled speculars; no rock texture stamped on it.
  base,lo,hi={'station_corridor':(('station-panels',3),('hazard-paint',2),('station-panels',3)),
   'station_lab':(('clean-tile',3),('clean-tile',2),('tank-glass',3)),
   'station_hydro':(('leaks',3),('overgrowth',3),('planters',3))}[n]
  d.r((0,0,143,143),*base)
  for y in (0,48,96):
   for x in (0,48,96):
    d.r((x,y,x+47,y+1),*lo);d.r((x,y,x+1,y+47),*lo)
    d.r((x+3,y+3,x+44,y+3),*hi);d.r((x+3,y+4,x+3,y+44),*hi)
    if n=='station_corridor':
     d.r((x+5,y+41,x+42,y+44),*lo);d.r((x+40,y+6,x+43,y+39),*lo)
     for a,b in ((7,7),(35,35)):
      d.r((x+a,y+b,x+a+3,y+b+2),*lo)
    elif n=='station_lab':
     d.r((x+5,y+6,x+6,y+17),*hi);d.r((x+7,y+5,x+17,y+6),*hi)
  if n=='station_corridor':
   d.r((54,96,64,143),'hazard-paint',2)
   for y in (96,112,128):d.p(f'54,{y} 59,{y} 64,{y+5} 64,{y+10} 54,{y}', 'station-panels',3)
  elif n=='station_lab':
   d.p('29,96 32,96 32,101 34,101 34,106 38,106 38,111 31,111 31,108 29,108','spills',3)
   d.r((30,97,31,103),'tank-glass',3)
   d.p('21,110 28,110 28,107 39,107 39,110 47,110 47,114 53,114 53,120 48,120 48,124 37,124 37,122 28,122 28,119 21,119', 'spills',3)
   d.p('24,111 30,111 30,109 38,109 38,112 46,112 46,115 40,115 40,118 30,118 30,116 24,116','tank-glass',3)
  else:
   # A contained rooted patch, not a rectangular bed reset at period edges.
   d.p('6,100 18,100 18,103 27,103 27,108 35,108 35,115 29,115 29,123 20,123 20,120 13,120 13,115 7,115','overgrowth',3)
   d.p('54,107 63,107 63,110 69,110 69,116 77,116 77,124 69,124 69,129 59,129 59,126 52,126 52,118 49,118 49,112 54,112','planters',3)
   d.r((56,113,61,119),'leaks',3);d.r((60,120,67,124),'leaks',3)
 else:
  fields(im,FLOOR[n],stone=n not in ('manor','temple','yard'))
  if n in ('keep','temple','crypt','dungeon_sewer'):
   seam={'keep':('iron',3),'temple':('marble',2),'crypt':('bone',2),'dungeon_sewer':('sewer-water',3)}[n]
   for a in (0,48,96):d.r((a,0,a,143),*seam);d.r((0,a,143,a),*seam)
  if n=='keep':
   for x in (0,48,96):
    for y in (0,48,96):
     d.r((x+2,y+1,x+44,y+2),'limestone',3)
     d.r((x+46,y+3,x+47,y+45),'iron',3)
     d.r((x+3,y+46,x+47,y+47),'iron',3)
  if n=='manor':
   # All panels have the same board direction: the three-cell period wraps.
   for y in (0,48,96):
    for x in (0,48,96):
     d.r((x,y,x+47,y+1),'parquet',3);d.r((x,y,x+1,y+47),'parquet',3)
     for a in (12,24,36):d.r((x+2,y+a,x+47,y+a),'parquet',3)
     d.r((x+44,y+2,x+45,y+47),'timber',4)
   # Long grain, each run explicitly chosen; these are not crack paths.
   old.stroke(d,'4,10 17,10; 25,9 39,9; 7,22 23,22; 28,21 41,21; 5,34 14,34; 20,33 38,33; 6,45 25,45; 32,44 40,44; 53,7 64,7; 69,9 87,9; 55,19 76,19; 80,21 89,21; 52,32 66,32; 72,34 87,34; 54,44 83,44; 101,8 121,8; 128,10 138,10; 100,21 112,21; 117,19 137,19; 102,32 126,32; 130,34 138,34; 100,44 119,44; 125,43 138,43; 5,58 22,58; 28,56 40,56; 7,70 34,70; 4,81 19,81; 23,83 41,83; 8,93 31,93; 53,57 80,57; 84,59 90,59; 51,69 69,69; 75,71 88,71; 53,82 76,82; 81,80 90,80; 55,93 85,93; 100,57 117,57; 123,59 136,59; 102,69 132,69; 100,82 122,82; 128,81 140,81; 104,93 135,93; 6,105 30,105; 34,107 41,107; 4,118 20,118; 27,116 40,116; 8,130 31,130; 35,128 42,128; 5,141 26,141; 31,140 41,140; 52,105 69,105; 76,106 90,106; 54,117 80,117; 85,119 91,119; 51,130 65,130; 72,128 88,128; 55,142 83,142; 100,105 124,105; 130,107 140,107; 103,118 119,118; 125,117 139,117; 100,129 113,129; 120,131 138,131; 102,141 133,141','parquet',3)
  elif n=='temple':
   # One mineral vein with broad cloudy shoulders, not repeated zigzag cracks.
   d.p('13,96 22,96 22,105 29,105 29,111 38,111 38,119 46,119 46,127 55,127 55,134 64,134 64,143 57,143 57,138 48,138 48,131 40,131 40,123 32,123 32,116 24,116 24,109 17,109 17,102 13,102','marble',3)
  elif n=='cave_lava':
   # One fissure with rock lips and several connected ember pockets.
   d.p('45,96 54,96 54,102 59,102 59,110 65,110 65,118 72,118 72,127 78,127 78,135 82,135 82,143 72,143 72,137 66,137 66,130 61,130 61,121 56,121 56,114 50,114 50,105 45,105','embers',3)
   d.r((48,98,51,103),'embers',4);d.r((54,107,57,111),'embers',4);d.r((61,116,64,122),'embers',4);d.r((69,129,72,134),'embers',4);d.r((75,138,78,142),'embers',4)
  elif n=='cave_ice':
   d.p('2,131 8,131 8,128 17,128 17,130 25,130 25,133 32,133 32,137 37,137 37,141 7,141 7,138 2,138','snowdrift',3)
   d.p('7,132 14,132 14,131 20,131 20,134 28,134 28,137 14,137 14,136 7,136','frost',2)
  elif n=='station_engine':
   for y in (0,48,96):
    for x in (0,48,96):
     d.r((x,y,x+47,y+1),'oil',4);d.r((x,y,x+1,y+47),'oil',4)
     for a in (8,16,24,32,40):
      d.r((x+6,y+a,x+41,y+a+2),'oil',4);d.r((x+7,y+a+3,x+40,y+a+3),'pipes',3)
  elif n=='yard':
   old.yard_floor(d)
   for y,u in [(0,9),(136,143)]:d.r((75,y,135,u),'yard-path',3)
   for y in (-8,136):
    for x,u,k in [(77,94,2),(98,114,3),(119,134,2)]:
     d.p(f'{x+k},{y} {u-2},{y} {u-2},{y+2} {u},{y+2} {u},{y+10} {u-3},{y+10} {u-3},{y+13} {x+2},{y+13} {x+2},{y+11} {x},{y+11} {x},{y+3} {x+k},{y+3}','yard-cobble',3)
     d.p(f'{x+k},{y+1} {u-3},{y+1} {u-3},{y+3} {u-1},{y+3} {u-1},{y+8} {u-5},{y+8} {u-5},{y+10} {x+2},{y+10} {x+2},{y+4} {x+k},{y+4}','yard-cobble',4)
     d.r((x+4,y+5,u-5,y+6),'roof-slate',3)
   from operator_c_materials import texture
   texture(im,[('yard-path',3)],('yard-path',4),('yard-path',3),(0,0,144,144))
   texture(im,[('yard-cobble',4)],('yard-cobble',3),('yard-cobble',4),(0,0,144,144))
  elif n=='dungeon_sewer':
   d.p('3,99 17,99 17,102 26,102 26,105 22,105 22,111 15,111 15,116 7,116 7,112 3,112','slime',3)
   d.r((7,103,14,105),'sewer-water',3);d.r((10,108,16,110),'sewer-water',3)
 # Individually placed continuations at the inspected wide mineral gaps.
 if n in FLOOR and n!='manor':
  ink=FLOOR[n][1]
  if n=='yard':ink=('yard-path',4)
  for x,y in [(54,3),(113,5),(111,10),(91,30),(92,50),(54,57),(59,34),(139,27),(83,41),(112,42),(65,45),(24,52),(59,53),(89,50),(61,49),(24,57),(55,39),(55,71),(25,70),(115,57),(115,72),(24,86),(59,83),(55,86),(84,87),(25,99),(55,101),(58,98),(86,101),(116,102),(59,113),(25,115),(55,116),(86,117),(116,117),(25,131),(55,131),(59,128),(85,132),(116,132)]:
   d.r((x,y,x+3,y+1),*ink)
 if n=='manor':
  old.stroke(d,'6,17 25,17; 6,29 17,29; 70,29 88,29; 132,29 139,29; 5,65 39,65; 72,65 90,65; 123,54 138,54; 84,54 91,54; 23,77 41,77; 54,77 78,77; 102,77 125,77; 36,90 42,90; 35,102 43,102; 129,102 139,102; 5,113 25,113; 84,113 90,113; 102,113 122,113; 5,125 32,125; 54,125 69,125; 118,125 137,125; 54,137 89,137','timber',4)
 return im

# Wall pigmentation separates the dark cap from the illuminated front.
WALL={
 'keep':[('iron',2),('limestone',2),('iron',2),('iron',3)],
 'temple':[('sandstone',1),('sandstone',2),('brass',2),('sandstone',3)],
 'crypt':[('dark-masonry',3),('dark-masonry',4),('lichen',2),('dark-masonry',4)],
 'dungeon_sewer':[('brick',2),('brick',3),('sewer-water',2),('brick',4)],
 'yard':[('roof-slate',1),('yard-cobble',2),('roof-slate',2),('yard-cobble',3)],
 'cave_rock':[('mud',2),('grey-brown-rock',2),('mud',3),('grey-brown-rock',3)],
 'cave_ice':[('blue-ice',1),('blue-ice',2),('frost',1),('frost',2)],
 'cave_crystal':[('dark-rock',3),('dark-rock',4),('violet-crystal',2),('dark-rock',4)],
 'cave_lava':[('basalt',3),('basalt',4),('ash',2),('basalt',5)],
}

def wall(n):
 from operator_c_materials import texture,top,natural_wall
 im=old.wall(n);d=Pen(im)
 if n in WALL:
  cols=WALL[n]
  if n.startswith('cave_'):
   natural_wall(im,cols)
  else:
   # Preserve masonry bond, replace all diagram scratches before mineral work.
   d.r((0,48,143,94),*S[n][1]);old.masonry(d,n)
   texture(im,[S[n][1]],cols[2],cols[3],(0,48,144,95))
  cap={
   'keep':[('iron',2),('limestone',1),('iron',2)],
   'temple':[('marble',1),('sandstone',1),('marble',1)],
   'crypt':[('lichen',1),('dark-masonry',2),('dark-masonry',3)],
   'yard':[('yard-cobble',1),('roof-slate',1),('roof-slate',2)],
   'cave_rock':[('mud',2),('grey-brown-rock',1),('mud',3)],
   'cave_ice':[('blue-ice',1),('frost',1),('snowdrift',1)],
   'cave_crystal':[('dark-rock',2),('violet-crystal',2),('dark-rock',2)],
   'cave_lava':[('basalt',3),('basalt',2),('embers',2)],
   'dungeon_sewer':[('brick',2),('brick',1),('sewer-water',2)]}[n]
  top(im,n,cap)
  if n=='cave_lava':
   d.p('44,26 51,26 51,29 57,29 57,34 52,34 52,39 47,39 47,35 43,35','embers',2)
   d.r((47,29,50,32),'embers',3)
   d.p('79,60 84,60 84,68 88,68 88,73 84,73 84,81 80,81 80,76 77,76 77,67 79,67','embers',2)
   d.r((81,65,83,70),'embers',3)
 elif n=='manor':
  d.r((0,48,143,94),'plaster',2)
  texture(im,[('plaster',2)],('timber',3),('plaster',2),(0,48,144,95))
  for x in (0,69,138):
   d.r((x,48,x+5,94),'timber',2);d.r((x+1,48,x+1,94),'timber',3)
   d.r((x+3,54,x+3,69),'timber',1);d.r((x+3,77,x+4,88),'timber',1)
  d.r((0,88,143,94),'timber',2);d.r((0,88,143,88),'timber',4)
  top(im,n,[('timber',2),('timber',1),('timber',3)])
 else:
  tr,ts=S[n][0]
  cap={'station_corridor':[('hazard-paint',1),('station-panels',1),('station-panels',2)],'station_lab':[('clean-tile',1),('tank-glass',1),('tank-glass',2)],'station_engine':[('soot',3),('soot',2),('pipes',2)],'station_hydro':[('overgrowth',1),('planters',1),('leaks',2)]}[n]
  top(im,n,cap)
  d.r((0,46,143,46),*cap[2])
  r={'station_corridor':'station-panels','station_lab':'tank-glass','station_engine':'pipes','station_hydro':'leaks'}[n]
  for x,y,u,v in [(7,53,17,56),(53,76,65,79),(122,58,134,61),(78,85,89,88)]:
   d.r((x,y,u,v),r,2);d.r((x,y,u,y),r,3);d.r((x,y+1,x+2,v),r,1)
  if n=='station_engine':texture(im,[('pipes',2)],('soot',3),('pipes',2),(0,48,144,95))
  elif n=='station_lab':
   for x,y,u in [(5,55,16),(55,77,68),(103,55,117)]:
    d.r((x,y,u,y+1),'clean-tile',2);d.r((x,y+2,x+1,y+10),'clean-tile',2)
 # Connected cap flakes at five former 9–10px untouched islands.
 cap_ink={'keep':('limestone',1),'temple':('sandstone',1),'manor':('timber',1),'crypt':('dark-masonry',2),'cave_rock':('grey-brown-rock',1),'cave_ice':('frost',1),'cave_crystal':('violet-crystal',2),'cave_lava':('basalt',2),'dungeon_sewer':('brick',1),'yard':('roof-slate',1)}.get(n)
 if cap_ink:
  for x,y in [(3,16),(55,22),(83,21),(102,43),(132,42)]:d.r((x,y,x+3,y+1),*S[n][0])
 if n in ('manor','cave_crystal'):
  ink=('timber',3) if n=='manor' else ('violet-crystal',2)
  for x,y in [(24,55),(55,55),(58,53),(113,57),(25,71),(55,71),(115,72),(59,83)]:d.r((x,y,x+3,y+1),*ink)
 if n=='station_hydro':
  for path in ['15,54 18,54 22,58 23,63 20,63 16,59','32,60 38,57 44,57 42,61 37,64 32,64','8,65 12,66 15,69 14,72 10,71 7,68','23,74 27,70 31,69 32,72 29,76 24,78','33,78 38,75 44,76 43,79 38,82 33,81','12,83 16,84 18,88 17,91 13,89 11,86']:
   d.p(path,'overgrowth',3)
  old.stroke(d,'17,56 20,60; 35,60 40,59; 9,67 12,69; 26,74 29,71; 36,78 40,77; 13,85 16,88','overgrowth',4)
  d.r((76,84,78,94),'leaks',3)
 d.r((0,95,143,95),S[n][1][0],1)
 return im


def crate():
 im=old.crate();d=Pen(im);r='wood-oak'
 # Six top boards with long grain, bevels and interrupted end grain.
 d.r((6,8,41,15),r,4)
 for x,u in [(7,11),(13,18),(20,25),(27,33),(35,40)]:
  d.r((x,8,u,14),r,5);d.r((x,8,x,14),r,6);d.r((u,9,u,15),r,3)
 old.stroke(d,'9,9 9,12; 15,10 15,13; 22,9 22,11; 24,12 24,14; 29,10 29,14; 32,9 32,11; 37,10 37,12',r,4)
 # Fine grain follows the vertical boards and stops at the diagonal brace.
 old.stroke(d,'10,29 10,36; 12,31 12,37; 15,32 15,36; 16,33 16,37; 20,25 20,27; 23,25 23,28; 26,24 26,29; 28,25 28,30; 31,24 31,29; 34,25 34,29; 37,24 37,30; 39,27 39,33; 19,33 19,37; 22,35 22,37; 26,36 26,38',r,4)
 old.stroke(d,'11,29 11,32; 14,33 14,36; 25,25 25,28; 33,24 33,27; 38,27 38,31; 20,35 20,37',r,6)
 # Brace grain has a thinner low edge; rail intersections retain clear pegs.
 old.stroke(d,'12,24 16,26 21,28; 24,30 29,32 34,34; 9,40 16,40; 23,41 31,41; 35,40 39,40',r,4)
 return im


def chest():
 im=old.chest();d=Pen(im);r='textiles-teal'
 # Lid is intentionally step 2/4; no isolated step-3 pixels in the dark rim.
 d.r((16,10,31,18),r,2)
 d.r((16,10,31,11),r,4);d.r((17,12,30,14),r,3)
 old.stroke(d,'18,13 24,13; 26,14 30,14; 17,16 23,16; 26,17 30,17; 17,23 23,23; 26,24 30,24; 18,29 22,29; 25,32 30,32; 18,36 24,36; 27,38 30,38',r,4)
 for x,y in [(12,7),(8,9),(8,10),(6,12),(6,13),(6,14)]:d.r((x,y,x,y),r,2)
 for x,y in [(35,7),(39,9),(39,10),(41,12),(41,13),(41,14)]:d.r((x,y,x,y),r,1)
 # Restore rectangular hasp over the board work.
 old.outlined_rect(d,(21,18,27,29),'loot-gold',4)
 d.r((22,19,26,21),'loot-gold',5);d.r((23,24,25,26),'loot-gold',1)
 return im


def table():
 im=old.table();d=Pen(im)
 # Each tabletop plank has its own connected growth bands.
 bands=['16,21 33,21 33,22 48,22 48,24 31,24 31,23 16,23',
 '49,22 60,22 60,21 77,21 77,23 63,23 63,24 49,24',
 '17,29 28,29 28,28 42,28 42,30 36,30 36,32 19,32 19,31 17,31',
 '45,28 54,28 54,30 62,30 62,28 78,28 78,30 65,30 65,32 53,32 53,30 45,30',
 '16,35 30,35 30,36 44,36 44,38 29,38 29,37 16,37',
 '48,37 60,37 60,35 76,35 76,37 66,37 66,39 48,39',
 '17,42 30,42 30,44 44,44 44,45 27,45 27,44 17,44',
 '48,43 58,43 58,42 77,42 77,44 64,44 64,45 48,45']
 old.patches(d,';'.join(bands),'wood-oak',4)
 old.stroke(d,'20,22 29,22; 54,22 60,22; 22,30 31,30; 68,29 75,29; 19,36 28,36; 55,38 62,38; 21,43 27,43; 65,43 74,43','wood-oak',3)
 for x,y in ((11,22),(83,23),(11,42),(83,42)):
  d.r((x,y,x+1,y+1),'wood-oak',2);d.r((x,y,x+1,y),'wood-oak',6)
 return im


def spire(crystal):
 im=Image.new('RGBA',(48,48));d=Pen(im)
 r='violet-crystal' if crystal else 'blue-ice'
 # Build each silhouette filled first, then draw its one-pixel contour.
 shapes= [('22,3 25,3 25,5 27,5 27,9 29,9 29,15 30,15 30,35 27,41 21,41 18,35 18,15 19,15 19,9 20,9 20,5 22,5',4 if crystal else 2),
 ('8,16 11,16 11,18 14,18 14,22 16,22 16,28 18,28 18,34 21,34 21,40 16,42 12,37 12,31 9,31 9,25 7,25 7,19 8,19',4 if crystal else 2),
 ('36,14 39,14 40,18 39,25 37,31 34,37 30,42 26,41 28,34 30,28 32,22',4 if crystal else 2)]
 d.p('8,37 14,35 31,35 38,38 42,41 38,44 13,44 6,41','dark-rock' if crystal else 'snowdrift',5 if crystal else 2)
 for path,s in shapes:
  d.p(path,r,s)
  # ImageDraw uses a one-pixel native contour, with no resampled edge.
  d.d.line([tuple(map(int,q.split(','))) for q in (path+' '+path.split()[0]).split()],fill=c(r,1),width=1)
 if crystal:
  d.p('22,6 23,6 23,15 22,15 22,35 20,37 19,34 19,16 20,16 20,10 21,10 21,6','violet-crystal',5)
  d.r((24,16,25,34),'violet-crystal',3)
  old.stroke(d,'9,19 11,24 13,30 16,36; 35,19 33,25 31,31 29,37','violet-crystal',5)
  old.patches(d,'8,39 12,38 16,41 12,42; 32,41 36,39 39,41 35,43','dark-rock',6)
 else:
  d.p('22,7 23,7 23,16 22,16 22,25 20,25 20,34 19,34 19,16 20,16 20,10 21,10 21,7','frost',3)
  d.r((26,17,27,31),'frost',2)
  old.stroke(d,'10,21 12,26 14,31 16,36; 36,18 34,24 32,30 30,36','frost',3)
  d.p('9,39 16,37 27,37 34,39 38,41 32,43 16,43 9,41','snowdrift',2)
  d.p('14,39 19,38 26,38 30,40 20,41 14,40','snowdrift',3)
 return im


def replace_colors(im,mapping):
 table={tuple(bytes.fromhex(a[1:]))+(255,):tuple(bytes.fromhex(b[1:]))+(255,) for a,b in mapping.items()}
 im.putdata([table.get(v,v) for v in im.get_flattened_data()]);return im


def prop(n):
 if n=='keep':return crate()
 if n in ('cave_ice','cave_crystal'):
  im=spire(n=='cave_crystal')
  if n=='cave_ice':
   remap={c('blue-ice',2):c('frost',4),c('snowdrift',2):c('snowdrift',4),c('frost',3):c('frost',5)}
   im=replace_colors(im,remap)
  return im
 im=old.prop(n)
 if n=='cave_rock':im=replace_colors(im,{c('fungus',4):c('mud',6)})
 d=Pen(im)
 if n=='manor':
  # Remove double exterior dark lines by filling the interior shoulder.
  d.r((5,11,5,18),'textiles-sage',4);d.r((42,11,42,18),'textiles-sage',3)
  old.patches(d,'10,10 17,10 17,12 24,12 24,14 13,14 13,13 10,13; 28,10 36,10 36,12 33,12 33,14 28,14','textiles-sage',5)
  old.stroke(d,'12,16 18,16; 28,16 35,16; 10,29 10,31; 37,29 37,32','textiles-sage',3)
 elif n in ('temple','crypt','yard'):
  r='brass' if n=='temple' else 'dark-masonry' if n=='crypt' else 'yard-cobble'
  old.patches(d,'7,13 14,13 14,15 20,15 20,16 10,16 10,15 7,15; 29,13 37,13 37,14 41,14 41,16 32,16 32,15 29,15' if n!='yard' else '9,29 16,29 16,31 21,31 21,33 13,33 13,32 9,32; 28,34 34,34 34,32 38,32 38,36 31,36 31,37 28,37',r,3 if n=='temple' else 4)
  if n=='crypt':
   d.r((10,12,37,15),'dark-masonry',2)
   old.stroke(d,'11,13 18,13; 25,14 35,14','bone',3)
   old.patches(d,'16,26 19,26 19,28 28,28 28,26 31,26 31,30 28,30 28,29 19,29 19,31 16,31','bone',3)
   d.r((18,27,20,28),'bone',4)
 elif n=='cave_rock':
  old.patches(d,'14,13 18,11 23,11 23,13 18,15 14,15; 25,9 29,10 31,12 27,13 24,12; 27,17 33,16 36,18 34,20 29,20','fungus',5)
  old.stroke(d,'13,19 18,21 25,21; 26,24 30,23 35,22; 18,25 18,29; 23,26 23,31','fungus',2)
 elif n=='cave_lava':
  old.patches(d,'12,24 16,24 16,28 20,28 20,31 16,31 16,34 13,32; 27,25 32,24 32,29 29,33 26,33','ash',3)
  old.stroke(d,'15,25 15,28; 20,34 25,35; 28,26 30,25','ash',5)
 elif n=='dungeon_sewer':
  d.r((22,6,25,10),'sewer-water',5);d.r((22,6,24,7),'sewer-water',6)
  old.stroke(d,'6,28 6,33; 10,39 18,40; 28,39 34,39; 10,16 16,16; 30,16 37,16','sewer-water',4)
 elif n=='station_corridor':
  old.patches(d,'8,13 19,13 19,14 25,14 25,16 9,16; 10,24 14,24 14,33 12,33 12,30 10,30','station-panels',5)
  old.stroke(d,'28,14 36,14; 24,37 34,37','station-panels',3)
 elif n=='station_lab':
  d.r((14,20,15,29),'tank-glass',5);d.r((16,19,17,23),'tank-glass',6)
  d.r((29,24,30,31),'tank-glass',3)
 elif n=='station_engine':
  old.stroke(d,'12,18 13,15 17,13; 11,24 12,29 15,32; 18,34 26,34; 35,8 36,11','pipes',5)
  d.p('21,22 26,22 28,24 28,28 26,30 21,30 19,28 19,24','pipes',2)
  d.r((21,24,26,28),'pipes',4);d.r((21,24,25,24),'pipes',5)
  d.r((14,15,17,18),'pipes',2);d.r((30,31,33,34),'pipes',2)
  d.r((15,15,17,16),'pipes',5);d.r((30,31,32,32),'pipes',5)
  d.r((34,18,40,20),'pipes',4);d.r((35,18,39,18),'pipes',5)
 elif n=='station_hydro':
  d.p('20,19 17,15 18,11 21,9 24,10 24,13 22,14 22,18','overgrowth',4)
  d.p('29,23 32,20 38,20 41,23 39,25 35,24 32,25','overgrowth',4)
  old.stroke(d,'19,13 21,11 22,12; 33,22 37,22','overgrowth',5)
  old.patches(d,'10,32 16,32 16,34 22,34 22,36 14,36 14,35 10,35; 29,30 36,30 36,33 32,33 32,35 29,35','planters',4)
 return im


def build():
 # Preserve before images for review; reruns never replace this evidence.
 backup=REVIEW/'C-operator-before';backup.mkdir(exist_ok=True)
 for folder in ('proof','canon/props','canon/swatches'):
  for path in (BASE/folder).glob('*.png'):
   dest=backup/(folder.replace('/','-')+'-'+path.name)
   if not dest.exists():dest.write_bytes(path.read_bytes())
 for name in S:
  f,w,p=floor(name),wall(name),prop(name)
  from operator_c_cleanup import cleanup
  cleanup(f,name)
  if name in ('temple','cave_crystal','cave_lava'):
   final_pen=Pen(f)
   for x,y in [(32,30),(119,31),(93,83),(76,94),(137,94)]:
    final_pen.r((x,y,x+3,y+1),*FLOOR[name][1])
  if name=='yard':
   final_pen=Pen(f)
   final_pen.r((75,0,76,0),'yard-path',4);final_pen.r((135,0,135,0),'yard-path',4)
   final_pen.r((86,137,86,138),'yard-cobble',3);final_pen.r((97,141,97,142),'yard-path',3)
  im=f.copy();im.paste(w,(0,0));im.alpha_composite(p,(90 if name=='station_lab' else 86,96))
  im.save(BASE/f'proof/{name}.png');im.convert('L').convert('RGBA').save(BASE/f'proof/{name}-grey.png')
  # Opaque, single-colour shadow mask, displayed once at 35% in the review.
  shadow=Image.new('RGBA',(144,144));sd=Pen(shadow)
  sd.p('93,133 125,133 125,135 132,135 132,139 128,139 128,142 96,142 96,140 90,140 90,136 93,136','void-mass',1)
  if name in ('station_lab','station_engine','cave_ice','cave_crystal'):
   shadow=Image.new('RGBA',(144,144));sd=Pen(shadow);sd.p('99,135 119,135 119,137 126,137 126,140 121,140 121,143 97,143 97,141 92,141 92,138 99,138','void-mass',1)
  shadow.save(BASE/f'proof/{name}-shadow.png')
  for tag,layer in [('floor',f),('wall',w),('prop',p)]:layer.save(REVIEW/f'C-layer-{name}-{tag}.png')
  repeat=Image.new('RGBA',(432,432))
  for y in range(3):
   for x in range(3):repeat.paste(f,(x*144,y*144))
  repeat.save(REVIEW/f'proof-3x3repeat-{name}.png')
  if name!='crypt':
   # Match every failed material study to the redrawn surface at 1:1.
   sw=Image.new('RGBA',(48,48));sw.paste(w.crop((0,48,48,72)),(0,0));sw.paste(f.crop((0,96,48,120)),(0,24))
   pen=Pen(sw)
   if name=='cave_lava':
    sw.paste(w.crop((36,24,84,48)),(0,0));sw.paste(f.crop((40,96,88,120)),(0,24))
   elif name=='station_corridor':sw.paste(f.crop((48,96,96,120)),(0,24))
   elif name=='station_hydro':sw.paste(w.crop((6,60,54,84)),(0,0))
   elif name=='keep':pen.r((39,0,44,23),'wood-oak',3);pen.r((39,0,39,23),'wood-oak',5)
   elif name=='temple':pen.r((0,22,47,23),'brass',2);pen.r((0,22,47,22),'brass',3)
   if name=='cave_crystal':
    pen.p('28,6 31,6 34,11 32,16 29,14 27,10','violet-crystal',4)
    pen.r((29,8,30,12),'violet-crystal',5)
   elif name=='station_corridor':pen.r((2,25,6,29),'hazard-paint',3)
   cleanup(sw,'study-'+name)
   if name=='station_hydro':
    for x,y in [(3,8),(5,9),(23,12),(22,13),(21,14)]:pen.r((x,y,x,y),'overgrowth',4)
    pen.r((12,0,14,0),'overgrowth',4);pen.r((29,18,31,18),'overgrowth',4)
    pen.r((3,11,3,11),'overgrowth',3);pen.r((18,12,18,12),'overgrowth',3)
   sw.save(BASE/f'canon/swatches/{"building-yard" if name=="yard" else name}.png')
 for name,im in [('crate',crate()),('chest',chest()),('table',table())]:im.save(BASE/f'canon/props/{name}.png')
 old.guide()
 print('Drew 14 proofs, 14 greys, 14 shadow masks, 13 studies and 3 canon props at native 48 px.')

if __name__=='__main__':build()
