"""Critic-5 pencil finishing: hand-drawn edge deposits and native corrections.
No filters, morphological operations, texture stamping or random placement.
"""
from PIL import ImageDraw
from draw_proofs import c,pts
from redraw_proofs_c1 import Pen


def poly(d, paths, r, s):
 for p in paths.split(';'):
  if p.strip():d.p(p.strip(),r,s)

def lines(d, paths,r,s):
 for p in paths.split(';'):
  if p.strip():d.l(p.strip(),r,s)

def remap(im,src,dst):
 a=tuple(bytes.fromhex(c(*src)[1:]))+(255,);b=tuple(bytes.fromhex(c(*dst)[1:]))+(255,)
 im.putdata([b if v==a else v for v in im.get_flattened_data()])


def finish(n,f,w,p):
 d=Pen(f);wd=Pen(w)
 if n=='dungeon_sewer':remap(f,('sewer-water',4),('brick',4))
 if n=='station_corridor':remap(f,('hazard-paint',3),('station-panels',3))
 if n=='crypt':
  # Bone is recessed detail; the main stone front retains 60.8 L*.
  remap(p,('bone',3),('dark-masonry',6))
 if n=='cave_crystal':
  # Keep the walking rock mid-value and all geode faces >10 L* brighter.
  remap(f,('dark-rock',5),('violet-crystal',3))
 if n=='cave_rock':
  remap(f,('mud',5),('fungus',3))
  # Unequal damp contacts, not the bright concentric pancakes of the block-in.
  poly(d,'5,105 11,104 18,107 26,107 24,110 17,110 10,108 5,108; 49,127 58,125 65,127 63,129 56,129 51,131 49,130; 110,60 120,59 126,62 131,62 130,65 123,65 116,62 110,63','mud',5)
 if n=='manor':
  # Fine plaster is a smooth material: soften only by using closer palette
  # steps, never alpha. Its shaded islands remain entirely plaster pigment.
  # Plaster1/2 is too large a value jump for interior islands; add an edge
  # colour using plaster2 and keep plaster1 close to timber and the foot.
  # The plaster is rebuilt from native islands instead of a camouflage field.
  wd.r((6,48,68,87),'plaster',2);wd.r((75,48,137,87),'plaster',2)
  poly(wd,'6,48 12,48 12,52 15,52 15,55 11,55 11,59 6,59; 61,48 68,48 68,63 65,63 65,58 62,58; 6,77 10,77 10,81 15,81 15,85 25,85 25,87 6,87; 55,86 60,86 60,82 65,82 65,75 68,75 68,87 55,87; 75,48 81,48 81,52 84,52 84,56 79,56 79,60 75,60; 131,48 137,48 137,60 134,60 134,55 131,55; 75,81 79,81 79,84 85,84 85,87 75,87; 124,87 124,85 130,85 130,81 134,81 134,76 137,76 137,87','plaster',1)
  poly(wd,'18,50 24,50 24,52 28,52 28,54 24,54 24,55 19,55; 35,50 41,50 41,52 46,52 46,54 39,54 39,53 35,53; 52,51 57,51 57,54 59,54 59,56 54,56 54,54 52,54; 11,63 16,63 16,61 22,61 22,63 26,63 26,66 19,66 19,65 13,65; 33,59 39,59 39,61 43,61 43,64 39,64 39,63 34,63; 48,62 54,62 54,60 59,60 59,63 63,63 63,66 56,66 56,65 49,65; 9,71 15,71 15,69 19,69 19,72 24,72 24,75 17,75 17,74 12,74; 30,69 36,69 36,71 42,71 42,74 35,74 35,73 30,73; 49,71 55,71 55,69 61,69 61,73 57,73 57,75 50,75; 20,80 26,80 26,78 31,78 31,81 35,81 35,84 28,84 28,83 22,83; 39,80 45,80 45,78 50,78 50,81 54,81 54,83 47,83 47,84 41,84; 89,50 97,50 97,53 100,53 100,55 94,55 94,54 89,54; 107,50 114,50 114,52 120,52 120,55 113,55 113,54 107,54; 122,58 129,58 129,60 132,60 132,63 126,63 126,62 122,62; 83,61 90,61 90,59 95,59 95,62 99,62 99,65 91,65 91,64 84,64; 104,61 110,61 110,59 116,59 116,62 118,62 118,65 112,65 112,64 106,64; 78,71 84,71 84,68 89,68 89,71 94,71 94,74 86,74 86,73 79,73; 101,70 107,70 107,68 113,68 113,71 117,71 117,74 110,74 110,73 103,73; 123,69 128,69 128,67 133,67 133,72 130,72 130,74 124,74; 84,80 91,80 91,77 96,77 96,80 100,80 100,83 94,83 94,84 87,84; 107,80 113,80 113,78 119,78 119,82 122,82 122,84 114,84 114,83 109,83','plaster',3)
 if n in ('keep','crypt','dungeon_sewer'):
  # Irregular chipped mineral edges. Every stroke is a different native path;
  # this list is a separate edge layer, not the former 12-pixel flake template.
  r,s={'keep':('limestone',2),'crypt':('lichen',3),'dungeon_sewer':('sewer-water',3)}[n]
  poly(d,'5,6 10,6 10,8 15,8 15,10 12,10 12,9 7,9 7,8 5,8; 25,13 30,13 30,15 36,15 36,17 32,17 32,16 27,16 27,15 25,15; 7,24 13,24 13,26 19,26 19,28 14,28 14,27 9,27; 27,28 33,28 33,29 39,29 39,31 35,31 35,30 29,30; 7,37 13,37 13,39 18,39 18,41 14,41 14,40 9,40; 28,39 33,39 33,41 40,41 40,43 35,43 35,42 29,42; 51,12 57,12 57,10 63,10 63,8 67,8 67,11 61,11 61,13 55,13 55,14 51,14; 75,8 81,8 81,10 88,10 88,12 83,12 83,11 77,11; 56,24 63,24 63,22 67,22 67,25 62,25 62,27 56,27; 75,24 81,24 81,26 88,26 88,28 83,28 83,27 77,27; 53,36 59,36 59,34 63,34 63,37 59,37 59,39 53,39; 72,39 78,39 78,41 86,41 86,39 90,39 90,42 84,42 84,44 77,44 77,42 72,42; 101,11 108,11 108,13 115,13 115,15 109,15 109,14 103,14; 124,12 129,12 129,10 136,10 136,8 140,8 140,11 134,11 134,13 128,13 128,14 124,14; 103,27 109,27 109,25 114,25 114,28 110,28 110,30 103,30; 125,27 130,27 130,25 136,25 136,24 140,24 140,27 134,27 134,29 128,29; 101,41 108,41 108,38 112,38 112,41 117,41 117,43 110,43 110,44 103,44; 127,41 132,41 132,38 139,38 139,36 142,36 142,40 135,40 135,43 127,43','%s'%r,s)
  # Second and third row edge routes, each without duplicate islands.
  poly(d,'5,57 11,57 11,59 18,59 18,61 12,61 12,60 7,60; 27,60 33,60 33,58 39,58 39,61 35,61 35,63 29,63; 9,73 15,73 15,71 20,71 20,74 16,74 16,76 9,76; 28,76 34,76 34,78 41,78 41,80 35,80 35,79 30,79; 9,87 15,87 15,89 22,89 22,91 16,91 16,90 11,90; 28,90 35,90 35,88 40,88 40,91 34,91 34,93 28,93; 55,57 61,57 61,55 65,55 65,58 60,58 60,60 55,60; 75,60 82,60 82,62 90,62 90,64 83,64 83,63 77,63; 54,73 61,73 61,71 66,71 66,74 60,74 60,76 54,76; 75,76 81,76 81,78 89,78 89,80 82,80 82,79 77,79; 55,87 62,87 62,85 66,85 66,88 61,88 61,90 55,90; 76,90 82,90 82,92 91,92 91,94 83,94 83,93 78,93; 103,58 110,58 110,60 118,60 118,62 111,62 111,61 105,61; 127,62 133,62 133,59 139,59 139,62 134,62 134,64 127,64; 103,73 110,73 110,75 117,75 117,77 111,77 111,76 105,76; 126,78 133,78 133,76 139,76 139,79 132,79 132,81 126,81; 103,88 110,88 110,90 117,90 117,92 111,92 111,91 105,91; 126,91 132,91 132,89 139,89 139,92 134,92 134,94 127,94',r,s)
  poly(d,'5,106 12,106 12,108 18,108 18,110 13,110 13,109 7,109; 28,111 34,111 34,113 41,113 41,115 35,115 35,114 30,114; 7,122 13,122 13,120 18,120 18,123 14,123 14,125 7,125; 28,126 34,126 34,128 40,128 40,130 35,130 35,129 30,129; 8,138 15,138 15,136 20,136 20,139 14,139 14,141 8,141; 30,138 36,138 36,140 42,140 42,142 36,142 36,141 32,141; 53,106 60,106 60,104 65,104 65,107 59,107 59,109 53,109; 75,110 81,110 81,112 89,112 89,114 82,114 82,113 77,113; 54,122 61,122 61,124 67,124 67,126 61,126 61,125 56,125; 77,126 83,126 83,124 90,124 90,127 84,127 84,129 78,129; 54,138 60,138 60,136 66,136 66,139 61,139 61,141 54,141; 78,139 84,139 84,137 91,137 91,140 85,140 85,142 78,142; 102,106 109,106 109,108 116,108 116,110 110,110 110,109 104,109; 128,110 134,110 134,108 141,108 141,111 135,111 135,113 129,113; 104,122 110,122 110,124 117,124 117,126 111,126 111,125 106,125; 128,125 134,125 134,127 141,127 141,129 135,129 135,128 130,128; 103,138 110,138 110,136 116,136 116,139 110,139 110,141 103,141; 128,137 134,137 134,139 141,139 141,141 135,141 135,140 130,140',r,s)
 if n.startswith('station_'):
  # Stops on cap ribs and nonuniform service access distinguish the sections.
  r={'station_corridor':'station-panels','station_lab':'tank-glass','station_engine':'pipes','station_hydro':'planters'}[n]
  wd.r((43,17,48,36),r,2);wd.r((44,19,46,34),r,1)
  wd.r((93,25,100,33),r,2);wd.r((95,27,98,31),r,1)
  if n=='station_lab':
   wd.r((10,23,29,25),'tank-glass',2);wd.r((12,26,27,28),'tank-glass',1)
  elif n=='station_hydro':
   wd.r((113,13,117,41),'leaks',2);wd.r((114,14,115,39),'planters',2)
  elif n=='station_corridor':
   wd.r((111,20,132,31),'station-panels',1)
   for y in (20,24,28):wd.r((112,y,131,y),'station-panels',2)
 if n=='station_hydro':
  # Connect diagonal highlight pixels into three-pixel leaf planes.
  poly(d,'15,103 18,101 19,102 16,104; 6,112 9,114 8,115 5,113; 20,110 23,107 24,108 21,111; 15,118 18,121 17,122 14,119; 29,116 32,114 33,115 30,117; 26,126 29,128 28,129 25,127','leaks',3)
 if n=='station_lab':d.r((29,119,33,120),'spills',3)
 # Extra hand-planned geometry is in a second small pencil module.
 from finish_c5_materials import finish_materials
 finish_materials(n,f,w,p)
 # Recorded individual contour corrections; this table has no generated art.
 from c5_pixel_repairs import FLOOR,STUDY
 for color,points in FLOOR.get(n,[]):
  for x,y in points:f.putpixel((x,y),tuple(color))


def study_finish(n,im):
 from c5_pixel_repairs import STUDY
 for color,points in STUDY.get(n,[]):
  for x,y in points:im.putpixel((x,y),tuple(color))
