"""C.2: native integer pencil drawings. No resize, filters or generated texture.
Lists are deliberately placed mineral, grain and wear strokes. Repeated loops
construct only joints, planks, fasteners and other manufactured geometry.
"""
import json
from PIL import Image, ImageDraw
from redraw_proofs_c1 import Pen, BASE, REVIEW, S, c, prop as old_prop, station_wall

# Hand-placed clusters across a full 144px period. Each path has a different
# contour/length; paths are not stamped or scattered by a random generator.
GRAIN = [
'7,8 12,8 12,9 15,9','24,6 29,6 29,8 33,8 33,9 35,9',
'8,21 11,21 11,23 16,23 16,22 19,22','28,17 31,17 31,18 37,18',
'5,34 9,34 9,36 12,36','19,31 23,31 23,30 28,30 28,32 30,32',
'33,38 39,38 39,40 43,40','13,42 18,42 18,41 21,41',
'55,5 60,5 60,7 66,7','73,13 78,13 78,11 83,11 83,12 87,12',
'58,24 62,24 62,22 66,22 66,23 70,23','78,29 85,29 85,31 89,31',
'53,38 58,38 58,36 63,36','68,42 75,42 75,43 78,43',
'84,40 88,40 88,38 92,38','103,7 109,7 109,6 113,6',
'123,8 128,8 128,10 136,10','102,23 105,23 105,25 112,25 112,24 116,24',
'125,20 131,20 131,18 135,18 135,19 140,19','106,36 110,36 110,38 115,38',
'123,33 127,33 127,34 133,34 133,36 138,36','100,43 106,43 106,42 109,42',
'8,56 13,56 13,57 19,57','28,54 34,54 34,56 39,56 39,57 42,57',
'5,69 9,69 9,71 15,71 15,70 18,70','24,66 29,66 29,64 35,64',
'9,83 13,83 13,85 20,85','30,79 36,79 36,81 41,81',
'24,91 29,91 29,88 34,88 34,90 38,90','56,55 61,55 61,54 65,54 65,56 68,56',
'77,59 81,59 81,57 87,57 87,58 91,58','54,72 62,72 62,75 67,75',
'70,68 77,68 77,71 83,71 83,69 87,69','53,87 60,87 60,85 64,85 64,86 69,86',
'76,83 80,83 80,81 85,81 85,82 89,82','70,93 75,93 75,91 79,91',
'102,56 107,56 107,58 112,58 112,57 115,57','126,54 133,54 133,55 139,55',
'100,72 106,72 106,70 111,70 111,71 114,71','121,67 127,67 127,65 132,65 132,66 136,66',
'105,86 111,86 111,84 117,84','125,80 131,80 131,82 135,82 135,83 139,83',
'122,93 128,93 128,91 132,91','7,102 13,102 13,104 18,104 18,103 22,103',
'27,109 34,109 34,107 41,107','5,119 11,119 11,121 14,121 14,120 18,120',
'24,122 32,122 32,125 36,125 36,123 41,123','8,134 14,134 14,132 19,132 19,133 24,133 24,134 26,134',
'30,137 37,137 37,135 42,135','56,103 62,103 62,101 67,101 67,102 72,102',
'78,108 83,108 83,106 90,106','54,117 61,117 61,119 65,119 65,118 69,118',
'75,123 82,123 82,120 87,120 87,122 93,122','55,134 60,134 60,136 64,136 64,135 68,135',
'74,138 81,138 81,135 86,135 86,137 92,137','102,104 110,104 110,100 117,100',
'125,108 130,108 130,110 136,110 136,109 140,109','101,119 108,119 108,116 113,116 113,118 119,118',
'126,126 132,126 132,124 138,124 138,125 141,125','103,136 111,136 111,132 116,132 116,135 123,135',
'128,140 134,140 134,138 139,138']
# Adjacent filled mineral grains, all individually bounded rather than speckle.
CHIPS = [
'17,13 22,13 22,14 24,14 24,16 19,16 19,15 17,15',
'36,26 42,26 42,28 39,28 39,29 35,29 35,27 36,27',
'6,43 10,43 10,45 14,45 14,46 7,46',
'64,14 69,14 69,16 72,16 72,18 67,18 67,17 64,17',
'86,23 91,23 91,24 93,24 93,27 90,27 90,26 86,26',
'112,13 119,13 119,14 121,14 121,16 115,16 115,15 112,15',
'116,42 121,42 121,41 126,41 126,43 123,43 123,44 117,44',
'15,62 20,62 20,64 23,64 23,66 19,66 19,65 15,65',
'19,77 25,77 25,78 27,78 27,80 22,80 22,79 19,79',
'38,87 43,87 43,88 46,88 46,90 41,90 41,89 38,89',
'62,61 68,61 68,63 72,63 72,65 66,65 66,64 62,64',
'86,75 92,75 92,77 94,77 94,79 89,79 89,78 86,78',
'111,62 116,62 116,63 120,63 120,65 115,65 115,64 111,64',
'135,72 140,72 140,74 143,74 143,76 138,76 138,75 135,75',
'114,91 118,91 118,89 122,89 122,92 125,92 125,94 117,94 117,93 114,93',
'19,110 25,110 25,112 29,112 29,115 24,115 24,113 19,113',
'15,127 20,127 20,126 24,126 24,129 21,129 21,130 16,130',
'42,131 46,131 46,134 44,134 44,137 41,137 41,133 42,133',
'66,109 71,109 71,111 75,111 75,113 70,113 70,112 66,112',
'64,129 70,129 70,127 74,127 74,131 72,131 72,133 66,133 66,131 64,131',
'88,132 93,132 93,134 95,134 95,137 91,137 91,135 88,135',
'114,111 120,111 120,113 125,113 125,116 119,116 119,114 114,114',
'116,127 122,127 122,129 126,129 126,132 120,132 120,130 116,130']

# Colour pairs chosen per material, all texture remains inside a 15 L* window.
FLOOR = {
'keep': [('limestone',3),('iron',3),('wood-oak',4)],
 'temple':[('marble',3),('marble',2),('sandstone',3)],
 'manor':[('parquet',3),('timber',4),('parquet',3)],
 'crypt':[('dark-masonry',4),('lichen',3),('dark-masonry',4)],
 'cave_rock':[('grey-brown-rock',3),('mud',4),('fungus',3)],
 'cave_ice':[('blue-ice',3),('snowdrift',3),('frost',3)],
 'cave_crystal':[('dark-rock',4),('violet-crystal',3),('dark-rock',4)],
 'cave_lava':[('basalt',5),('ash',3),('embers',3)],
 'dungeon_sewer':[('brick',4),('brick',3),('sewer-water',3)],
 'station_corridor':[('station-panels',3),('hazard-paint',2),('station-panels',3)],
 'station_lab':[('clean-tile',3),('tank-glass',3),('spills',3)],
 'station_engine':[('soot',5),('oil',4),('oil',5)],
 'station_hydro':[('planters',3),('overgrowth',3),('leaks',3)],
 'yard':[('yard-grass',3),('yard-cobble',3),('yard-path',3)]}

def floor(n):
 base,low,accent=FLOOR[n];im=Image.new('RGBA',(144,144),c(*base));d=Pen(im)
 # Pattern drawing uses the explicit paths above, not copied cells.
 if n=='yard':return yard_floor()
 if n=='manor':
  # Parquet cells, with grain parallel to the boards in each selected panel.
  for x in (0,48,96):d.r((x,0,x+1,143),'timber',4)
  for y in (0,48,96):d.r((0,y,143,y+1),'timber',4)
  d.ls(GRAIN,'timber',4);d.ps(CHIPS,'timber',4)
  return im
 # Stone fields, clean industrial panels and rock have different mark densities.
 if not n.startswith('station_'):
  d.ls(GRAIN,*low);d.ps(CHIPS,*(accent if n not in ('cave_lava','cave_crystal','dungeon_sewer') else low))
 else:
  d.ls(GRAIN[::3],*low)
  d.ps(CHIPS[::3],*low)
 if n in ('keep','temple','crypt','dungeon_sewer') or n.startswith('station_'):
  joint=low
  for x in (0,48,96):d.r((x,0,x+1,143),*joint)
  for y in (0,48,96):d.r((0,y,143,y+1),*joint)
  if n.startswith('station_'):
   # Metal fittings are construction, allowed to repeat on the structural grid.
   for y in (0,48,96):
    for x in (0,48,96):
     if n=='station_lab':
      d.r((x+3,y+3,x+5,y+5),'tank-glass',3);d.r((x+4,y+3,x+6,y+3),'clean-tile',2)
      d.l(f'{x+3},{y+7} {x+3},{y+40}','tank-glass',3)
     else:
      d.r((x+4,y+4,x+7,y+6),*low);d.r((x+5,y+4,x+7,y+4),*accent)
      d.r((x+39,y+39,x+42,y+41),*low)
      d.l(f'{x+10},{y+3} {x+41},{y+3}',*low)
 if n=='temple':
  # A marble vein narrows into separate mineral inclusions, never a broad ribbon.
  d.ls(['4,17 11,17 11,18 17,18 17,20 21,20 21,23 23,23',
   '24,24 28,24 28,26 33,26 33,27 41,27','58,79 64,79 64,77 69,77 69,74 74,74',
   '75,73 78,73 78,72 82,72 82,70 88,70','103,123 109,123 109,125 114,125 114,128 119,128',
   '120,128 125,128 125,129 131,129 131,130 140,130'], 'sandstone',3)
 elif n=='crypt':
  d.ps(['47,17 51,17 51,20 54,20 54,22 50,22 50,26 47,26',
   '91,46 99,46 99,49 104,49 104,52 99,52 99,51 95,51 95,49 91,49',
   '1,113 5,113 5,116 8,116 8,118 4,118 4,122 1,122'], 'lichen',3)
  d.ls(['50,24 54,24 54,27 56,27','98,50 101,50 101,54 106,54','3,120 7,120 7,123 10,123'], 'dark-masonry',5)
 elif n=='cave_rock':
  # Mud collects in small depressions, separate from the mineral lips.
  d.ps(['25,36 33,36 33,38 38,38 38,40 34,40 34,42 27,42 27,40 23,40 23,38 25,38',
   '77,54 84,54 84,56 89,56 89,59 85,59 85,61 79,61 79,59 75,59 75,57 77,57',
   '38,103 44,103 44,105 50,105 50,107 47,107 47,110 41,110 41,108 37,108'], 'mud',4)
  d.ls(['26,36 31,36 31,37 35,37','78,54 82,54 82,55 86,55','38,103 43,103 43,104 47,104'], 'fungus',3)
 elif n=='cave_ice':
  # Four short branching fractures and compact snow scuds.
  d.ls(['11,8 11,14 13,14 13,20 17,20 17,24 22,24','13,17 18,17 18,15 23,15',
   '69,47 69,53 67,53 67,58 63,58 63,62 58,62','67,55 73,55 73,58 77,58',
   '130,86 130,91 127,91 127,96 122,96 122,100 116,100','127,95 132,95 132,98 136,98',
   '35,112 35,117 38,117 38,123 42,123 42,127 47,127'], 'snowdrift',3)
  d.ps(['3,31 10,31 10,30 15,30 15,32 19,32 19,34 16,34 16,36 8,36 8,35 3,35',
   '82,82 89,82 89,80 95,80 95,83 99,83 99,86 94,86 94,88 87,88 87,86 82,86',
   '61,125 67,125 67,124 72,124 72,126 78,126 78,129 75,129 75,131 68,131 68,129 61,129'], 'snowdrift',3)
  d.ls(['6,32 12,32 12,33 16,33','84,84 90,84 90,83 94,83','65,126 70,126 70,127 75,127'],'frost',3)
 elif n=='cave_crystal':
  d.ps(['15,17 20,17 20,19 23,19 23,22 25,22 25,25 23,25 23,22 20,22 20,20 16,20',
   '83,45 85,45 85,49 88,49 88,51 92,51 92,53 88,53 88,51 85,51 85,49 83,49',
   '43,94 46,94 46,97 49,97 49,100 52,100 52,102 49,102 49,100 46,100 46,97 43,97',
   '132,120 135,120 135,123 138,123 138,125 135,125 135,123 132,123'], 'violet-crystal',3)
 elif n=='cave_lava':
  # Local fissures use 2-4px connected ember interiors, ash has broken broad lips.
  d.ps(['14,26 20,26 20,28 24,28 24,31 27,31 27,35 25,35 25,32 22,32 22,30 18,30 18,28 14,28',
   '81,64 84,64 84,68 87,68 87,71 91,71 91,74 88,74 88,72 84,72 84,69 81,69',
   '55,114 61,114 61,116 65,116 65,120 68,120 68,122 64,122 64,119 60,119 60,117 55,117'], 'embers',3)
  d.ls(['15,27 19,27 19,29 22,29','82,65 82,68 85,68 85,70','56,115 60,115 60,116 63,116'], 'embers',4)
  d.ps(['26,39 31,39 31,41 35,41 35,42 30,42 30,41 26,41',
   '88,77 94,77 94,79 97,79 97,81 91,81 91,80 88,80','67,124 72,124 72,125 76,125 76,127 71,127 71,126 67,126'], 'ash',3)
 elif n=='dungeon_sewer':
  d.ps(['0,29 4,29 4,33 7,33 7,36 5,36 5,40 2,40 2,44 0,44',
   '46,64 50,64 50,69 53,69 53,72 50,72 50,78 47,78 47,73 45,73',
   '91,96 101,96 101,98 106,98 106,101 102,101 102,100 97,100 97,99 91,99'], 'slime',3)
  d.ls(['3,34 5,34 5,38 3,38','48,66 48,70 51,70','98,98 103,98 103,99 107,99'], 'slime',3)
 elif n=='station_corridor':
  for a,b in ((12,29),(62,82),(111,132)):
   d.r((a,88,b,92),'hazard-paint',2)
   for x in range(a+1,b-3,7):d.p(f'{x},88 {x+2},88 {x+5},91 {x+3},91','station-panels',3)
 elif n=='station_lab':
  d.ps(['45,29 49,29 49,31 54,31 54,33 57,33 57,36 54,36 54,38 49,38 49,36 45,36',
   '51,40 55,40 55,39 58,39 58,42 55,42 55,43 51,43',
   '89,79 96,79 96,81 101,81 101,84 98,84 98,86 93,86 93,84 89,84'], 'spills',3)
  d.ls(['46,31 49,31 49,32 53,32','91,80 95,80 95,82 99,82'],'tank-glass',3)
 elif n=='station_engine':
  d.ps(['31,33 39,33 39,34 43,34 43,37 40,37 40,39 35,39 35,37 31,37',
   '37,41 41,41 41,40 45,40 45,42 43,42 43,44 38,44',
   '78,105 84,105 84,106 88,106 88,109 85,109 85,111 80,111 80,109 78,109'], 'oil',4)
  d.ls(['34,34 38,34 38,35 41,35','39,42 42,42 42,41 45,41','80,106 83,106 83,107 86,107',
   '30,40 26,40 26,41 21,41','80,112 75,112 75,114 70,114'], 'oil',5)
 elif n=='station_hydro':
  d.ps(['45,15 49,15 49,20 52,20 52,23 50,23 50,28 47,28 47,24 45,24',
   '90,92 97,92 97,94 102,94 102,97 98,97 98,99 94,99 94,96 90,96'], 'overgrowth',3)
  d.ps(['9,78 14,78 14,77 18,77 18,79 22,79 22,81 18,81 18,83 12,83 12,81 9,81',
   '56,125 63,125 63,123 67,123 67,126 71,126 71,128 66,128 66,130 60,130 60,128 56,128'], 'leaks',3)
  d.ls(['46,17 48,17 48,22 50,22','93,93 96,93 96,95 100,95','11,79 16,79 16,80 19,80'], 'overgrowth',3)
 return im


def yard_floor():
 im=Image.new('RGBA',(144,144),c('yard-grass',3));d=Pen(im)
 # Fixed-width worn path through turf into packed paving, no diagonal ribbon.
 d.r((48,0,77,143),'yard-path',3);d.r((78,0,143,143),'yard-cobble',3)
 # Close-packed cobbles: unequal stone widths and staggered joints, with
 # native stepped shoulders and broad worn crowns. No outline around floor art.
 rows=[(0,11,[78,94,113,130,146]),(12,24,[72,86,103,120,138,154]),
 (25,37,[78,98,116,133,148]),(38,48,[70,88,107,124,143,160]),
 (49,61,[78,95,114,132,149]),(62,74,[73,89,108,127,144,161]),
 (75,86,[78,97,115,134,150]),(87,98,[71,87,105,123,141,157]),
 (99,111,[78,94,112,131,147]),(112,124,[72,90,109,126,144,162]),
 (125,135,[78,96,116,133,151]),(136,143,[71,88,107,124,143,159])]
 cob=Image.new('RGBA',(144,144),c('yard-cobble',3));q=Pen(cob)
 for y,z,ends in rows:
  for a,b in zip(ends,ends[1:]):
   q.p(f'{a+4},{y+1} {b-5},{y+1} {b-5},{y+2} {b-3},{y+2} {b-3},{y+4} {b-2},{y+4} {b-2},{z-3} {b-4},{z-3} {b-4},{z-1} {a+4},{z-1} {a+4},{z-2} {a+2},{z-2} {a+2},{y+4} {a+4},{y+4}','roof-slate',3)
   q.p(f'{a+5},{y+2} {b-6},{y+2} {b-6},{y+3} {b-4},{y+3} {b-4},{y+5} {b-7},{y+5} {b-7},{y+7} {a+4},{y+7} {a+4},{y+4} {a+5},{y+4}','yard-cobble',4)
 im.paste(cob.crop((78,0,144,144)),(78,0))
 # Marks are clipped by material regions, not synthesized from pixels.
 for t in GRAIN:
  ps=[tuple(map(int,p.split(','))) for p in t.split()];x=ps[0][0]
  if max(a for a,b in ps)<45:d.l(t,'yard-grass',4)
  elif 51<min(a for a,b in ps) and max(a for a,b in ps)<75:d.l(t,'yard-path',4)
  elif min(a for a,b in ps)>80:d.l(t,'yard-cobble',4)
 d.ps(['43,9 49,9 49,12 52,12 52,14 47,14 47,16 43,16',
 '45,40 50,40 50,43 53,43 53,46 49,46 49,48 45,48',
 '44,81 49,81 49,84 52,84 52,86 48,86 48,89 44,89',
 '46,116 51,116 51,119 54,119 54,122 50,122 50,125 46,125'],'yard-grass',3)
 d.ls(['44,11 47,11 47,13 49,13','46,42 48,42 48,45 51,45',
 '45,83 48,83 48,85 50,85','47,118 50,118 50,120 52,120'],'yard-grass',4)
 d.ps(['20,18 23,18 23,20 27,20 27,22 24,22 24,24 20,24',
 '30,68 34,68 34,69 39,69 39,71 36,71 36,73 32,73 32,71 30,71',
 '9,109 14,109 14,111 17,111 17,114 13,114 13,115 10,115'],'yard-path',3)
 return im

# Top/face finishes are redrawn with small planes instead of boulder stamps.
def wall(n):
 im=Image.new('RGBA',(144,96),c('void-mass',2));d=Pen(im);tr,ts=S[n][0];fr,fs=S[n][1]
 d.r((0,8,143,47),tr,ts);d.r((0,48,143,94),fr,fs)
 if n.startswith('station_'):
  station_wall(d,n)
  # Additional fabrication seams, corner tabs and connected abrasion.
  r='station-panels' if n=='station_corridor' else 'tank-glass' if n=='station_lab' else 'pipes' if n=='station_engine' else 'leaks'
  d.ls(['6,58 11,58 11,59 15,59','30,80 35,80 35,82 40,82',
   '56,87 61,87 61,85 66,85','76,54 81,54 81,55 86,55',
   '104,60 110,60 110,62 114,62','126,84 131,84 131,86 138,86'],r,3)
  d.ps(['15,68 19,68 19,69 22,69 22,71 17,71 17,70 15,70',
   '66,78 70,78 70,79 74,79 74,81 68,81 68,80 66,80',
   '125,65 129,65 129,67 132,67 132,68 127,68 127,67 125,67'],r,2)
 elif n in ('keep','temple','crypt','dungeon_sewer','yard'):
  courses={'keep':[(48,64,[-12,28,73,118,153]),(66,82,[-24,18,65,104,153]),(84,94,[-8,36,84,126,159])],
   'temple':[(48,70,[-10,45,101,155]),(72,94,[-30,23,82,146])],
   'crypt':[(48,62,[-9,24,64,101,151]),(64,80,[-20,15,54,93,132,167]),(82,94,[-4,38,79,116,155])],
   'dungeon_sewer':[(48,58,[-7,29,65,104,145]),(60,70,[-24,12,51,89,129,167]),(72,82,[-3,34,72,112,153]),(84,94,[-21,18,59,99,139,174])],
   'yard':[(48,68,[-12,25,69,112,155]),(70,94,[-29,12,57,99,146])]}[n]
  for y,z,ends in courses:
   d.r((0,y,143,y+1),tr,ts)
   for a,b in zip(ends,ends[1:]):
    d.r((a,y+2,a+1,z),tr,ts)
    # Top edge and a broken lip; the one-step bevel is subordinate to the face.
    d.l(f'{a+3},{y+2} {b-4},{y+2}',fr,min(6,fs+1))
  shade={'keep':('iron',2),'temple':('sandstone',1),'crypt':('dark-masonry',2),'dungeon_sewer':('brick',2),'yard':('roof-slate',2)}[n]
  lit={'keep':('iron',3),'temple':('sandstone',3),'crypt':('dark-masonry',4),'dungeon_sewer':('brick',4),'yard':('yard-cobble',3)}[n]
  # Grain uses small connected islands with individual edges, not outlined holes.
  for t in CHIPS[7:15]:d.p(t,*shade)
  for t in GRAIN[22:43]:d.l(t,*lit)
  if n in ('crypt','dungeon_sewer'):
   r='lichen' if n=='crypt' else 'slime'
   d.ps(['1,85 5,85 5,81 8,81 8,84 11,84 11,88 7,88 7,92 1,92',
    '93,67 97,67 97,70 100,70 100,74 97,74 97,78 94,78 94,73 92,73'],r,2)
   d.ls(['3,85 6,85 6,87 8,87','94,69 96,69 96,72 98,72'],r,3)
 elif n=='manor':
  d.r((0,48,143,94),'plaster',2)
  for x in (0,68,138):
   d.r((x,48,x+5,94),'timber',2);d.l(f'{x+1},49 {x+1},93','timber',4)
  d.r((0,90,143,94),'timber',2);d.l('0,90 143,90','timber',4)
  d.ps(CHIPS[7:15],'plaster',1);d.ls(GRAIN[22:43],'plaster',3)
  # Chips are cropped plaster at lower timber joints, not giant dark cutouts.
  d.ps(['52,86 58,86 58,84 61,84 61,87 65,87 65,89 52,89',
   '73,50 78,50 78,52 81,52 81,54 76,54 76,53 73,53'],'plaster',1)
 else:
  # Connected rock strata: a few irregular facet boundaries, small ledges and
  # fractures interrupt the continuous face; no row of rounded boulders.
  r={'cave_rock':'grey-brown-rock','cave_crystal':'dark-rock','cave_lava':'basalt','cave_ice':'blue-ice'}[n]
  base={'cave_rock':3,'cave_crystal':3,'cave_lava':4,'cave_ice':2}[n]
  d.r((0,48,143,94),r,base)
  d.ps(['0,48 27,48 27,51 22,51 22,55 17,55 17,59 12,59 12,62 0,62',
   '39,58 51,58 51,55 63,55 63,52 78,52 78,49 94,49 94,54 85,54 85,58 74,58 74,62 61,62 61,65 48,65 48,63 39,63',
   '105,48 143,48 143,62 136,62 136,65 128,65 128,61 117,61 117,56 105,56',
   '0,79 12,79 12,75 24,75 24,71 34,71 34,75 29,75 29,81 23,81 23,86 13,86 13,90 0,90',
   '44,87 57,87 57,82 68,82 68,77 80,77 80,73 90,73 90,78 85,78 85,84 77,84 77,90 64,90 64,94 44,94',
   '100,82 112,82 112,77 123,77 123,73 134,73 134,70 143,70 143,83 134,83 134,87 124,87 124,91 111,91 111,94 100,94'],r,max(1,base-1))
  d.ls(['1,63 12,63 12,60 17,60 17,56 23,56','42,59 49,59 49,57 55,57',
   '56,66 62,66 62,63 72,63 72,60 80,60','119,62 127,62 127,66 134,66',
   '2,80 10,80 10,77 17,77','46,88 55,88 55,84 63,84','105,83 111,83 111,79 119,79'],r,min(6,base+1))
  d.ps(CHIPS[7:15],r,max(1,base-1));d.ls(GRAIN[22:43],r,base)
  if n=='cave_crystal':
   d.ls(['35,49 35,55 37,55 37,61 40,61 40,65 45,65',
    '96,67 96,72 99,72 99,77 103,77 103,81'],'violet-crystal',2)
   d.ps(['36,56 39,56 39,59 41,59 41,62 38,62 38,60 36,60',
    '98,73 101,73 101,76 104,76 104,78 101,78 101,76 98,76'],'violet-crystal',3)
  if n=='cave_lava':
   d.ps(['32,59 35,59 35,64 37,64 37,68 40,68 40,71 37,71 37,68 34,68 34,64 32,64',
    '94,80 97,80 97,84 101,84 101,87 98,87 98,85 94,85'],'embers',3)
   d.ls(['33,60 33,64 35,64 35,67','95,81 95,84 98,84'],'embers',4)
  if n=='cave_ice':
   d.ls(['26,48 26,55 29,55 29,62 33,62 33,67 39,67','88,59 88,65 91,65 91,70 96,70',
    '118,79 118,84 115,84 115,90 111,90'],'frost',3)
   d.ps(['8,91 13,91 13,89 19,89 19,91 24,91 24,94 8,94','71,92 77,92 77,90 83,90 83,92 88,92 88,94 71,94'],'snowdrift',3)
 # Quiet irregular top chips, same native density as wall-face grain.
 if not n.startswith('station_'):
  d.r((0,8,143,47),tr,ts)
  for t in CHIPS[:7]:d.p(t,tr,max(1,ts-1))
  for t in GRAIN[:22]:d.l(t,tr,ts+1)
 d.r((0,95,143,95),fr,1)
 return im


def outlined_rect(d,box,r,s):
 x,y,u,v=box;d.r(box,r,1);d.r((x+1,y+1,u-1,v-1),r,s)

def crate():
 im=Image.new('RGBA',(48,48));d=Pen(im);r='wood-oak'
 # 42px wide: rectangular top, full-width parallel front; no side return.
 outlined_rect(d,(3,5,44,43),r,5)
 d.r((4,17,43,18),r,2)
 for x in (9,19,30,39):d.l(f'{x},7 {x},15',r,2)
 d.ls(['4,6 43,6','4,6 4,16','4,19 4,42','5,41 42,41'],r,6)
 d.r((8,21,39,38),r,2);d.r((9,22,38,37),r,5)
 for x in (17,27):d.l(f'{x},22 {x},37',r,2)
 d.r((5,19,7,40),r,5);d.r((40,19,42,40),r,5)
 d.p('7,21 10,21 38,35 40,35 40,39 37,39 9,25 7,25',r,2)
 d.p('7,20 10,20 38,34 40,34 40,37 37,37 9,23 7,23',r,5)
 d.l('7,20 10,20 38,34 40,34',r,6)
 d.ls(['11,8 14,8 14,9 17,9','22,12 26,12 26,11 29,11','32,8 35,8 35,10 37,10',
  '10,28 11,28 11,32 13,32 13,35','21,24 23,24 23,27','32,24 34,24 34,28',
  '20,34 20,37','29,38 34,38'],r,3)
 d.ls(['10,26 10,29','30,23 30,27','22,35 22,37','12,14 16,14','32,14 37,14'],r,6)
 for x,y in ((5,20),(41,20),(5,39),(41,39)):
  d.r((x,y,x+1,y+1),'iron',2);d.r((x,y,x+1,y),'iron',4)
 return im

def chest():
 im=Image.new('RGBA',(48,48));d=Pen(im);r='textiles-teal'
 d.p('5,14 7,10 11,7 17,5 30,5 36,7 40,10 42,14 42,39 40,42 7,42 5,39',r,3,1)
 # The rolled lid spans the same width as the front. Its curved bands are
 # cross-sections, not converging perspective edges.
 d.r((6,17,41,20),r,2);d.r((6,21,41,39),r,3)
 d.ls(['8,11 12,8 18,6 29,6 35,8 39,11','6,22 6,38','8,40 39,40'],r,4)
 for x in (11,32):
  d.p(f'{x},7 {x+3},6 {x+3},18 {x+3},40 {x},40 {x},18','loot-gold',3,('loot-gold',1))
  d.l(f'{x+1},8 {x+1},16','loot-gold',4)
  d.l(f'{x+1},23 {x+1},38','loot-gold',4)
 d.ls(['17,10 23,10 23,11 29,11','18,14 22,14 22,15 29,15',
  '18,29 21,29 21,30 28,30','18,35 24,35 24,34 28,34'],r,2)
 # Simple hanging hasp: rectangle, round pin, slot. No letter-shaped glyph.
 outlined_rect(d,(21,18,27,29),'loot-gold',4)
 d.r((22,19,26,21),'loot-gold',5);d.r((23,24,25,26),'loot-gold',1)
 d.l('22,28 26,28','loot-gold',3)
 return im

def table():
 im=Image.new('RGBA',(96,96));d=Pen(im);r='wood-oak'
 # Preserve trestle construction while removing the trapezoidal tabletop.
 for x in (20,68):
  outlined_rect(d,(x,40,x+7,77),r,4)
  outlined_rect(d,(x-8,76,x+15,81),r,3)
  d.l(f'{x+1},43 {x+1},75',r,5)
 outlined_rect(d,(24,65,71,70),r,3);d.l('25,66 70,66',r,5)
 outlined_rect(d,(8,18,87,52),r,5)
 d.r((9,46,86,51),r,3);d.l('10,47 85,47',r,5)
 d.l('9,19 86,19',r,6);d.l('9,19 9,45',r,6)
 for y in (26,34,42):d.l(f'10,{y} 85,{y}',r,2);d.l(f'11,{y+1} 84,{y+1}',r,4)
 d.ls(['14,22 23,22 23,23 35,23 35,22 45,22','53,21 62,21 62,23 72,23 72,22 80,22',
  '15,30 26,30 26,29 31,29 31,31 46,31','55,29 63,29 63,31 73,31 73,30 81,30',
  '13,38 23,38 26,36 31,36 34,38 49,38','19,40 24,40 27,38 30,38 33,40 43,40',
  '57,38 65,38 65,37 73,37 73,39 82,39','14,44 28,44','58,44 75,44'],r,4)
 d.ls(['12,24 19,24','35,32 43,32','54,40 62,40','76,25 83,25'],r,6)
 return im

def altar(d,crypt=False):
 r='dark-masonry' if crypt else 'brass';body=6 if crypt else 4
 outlined_rect(d,(8,19,39,40),r,body)
 outlined_rect(d,(5,37,42,43),r,body)
 outlined_rect(d,(3,9,44,19),r,body)
 d.l('4,10 43,10',r,min(6,body+1));d.l('4,10 4,17',r,min(6,body+1))
 d.l('4,18 43,18',r,3);d.l('6,38 41,38',r,min(6,body+1))
 for x in (11,34):
  d.r((x,21,x+2,35),r,2);d.l(f'{x+1},22 {x+1},34',r,body)
 if crypt:
  # Bone medallion with joined eye and nose recesses, no skull-letter icon.
  d.p('20,23 27,23 30,26 30,31 27,34 20,34 17,31 17,26','bone',3,('bone',1))
  d.r((20,27,22,28),'bone',1);d.r((25,27,27,28),'bone',1)
  d.r((23,30,24,32),'bone',2)
  d.ls(['9,15 15,15 15,14 20,14','31,12 35,12 35,13 39,13','8,40 14,40 14,41 18,41'],'lichen',4)
 else:
  # Marble inset and muted brass offering bowl.
  outlined_rect(d,(16,22,31,35),'marble',3)
  d.ls(['18,25 22,25 22,27 26,27','24,31 28,31'],'marble',2)
  d.p('17,7 20,5 27,5 30,7 30,10 27,13 20,13 17,10','brass',4,1)
  d.l('19,7 22,6 26,6 28,7','brass',5);d.l('19,9 28,9','brass',2)
  d.ls(['7,14 12,14 12,15 16,15','30,15 36,15 36,14 41,14'],'sandstone',3)

def stool(d):
 for x in (8,35):
  outlined_rect(d,(x,24,x+4,43),'timber',5)
  d.l(f'{x+1},27 {x+1},41','timber',6)
 outlined_rect(d,(9,32,38,36),'timber',4);d.l('10,33 37,33','timber',5)
 outlined_rect(d,(5,18,42,26),'timber',5);d.l('6,19 41,19','timber',6)
 d.p('7,7 40,7 43,10 43,19 40,22 7,22 4,19 4,10','textiles-sage',4,1)
 d.r((5,18,42,19),'textiles-teal',2);d.l('8,8 39,8','textiles-sage',5)
 d.ls(['8,11 8,15 11,17','38,11 38,15 35,17','18,10 20,10 20,12','28,15 31,15 31,13'],'textiles-sage',3)
 d.l('11,20 36,20','textiles-sage',4)

def case(d):
 r='station-panels';outlined_rect(d,(3,9,44,42),r,4)
 d.r((4,19,43,21),r,2);d.l('4,10 43,10',r,5);d.l('4,10 4,18',r,5)
 outlined_rect(d,(16,5,31,12),r,4);d.r((19,8,28,11),r,1)
 outlined_rect(d,(10,25,37,36),r,2);d.r((12,27,35,32),r,3)
 d.ls(['13,28 24,28','13,30 29,30','6,38 6,40 15,40','32,39 40,39'],r,5)
 for x in (7,37):
  outlined_rect(d,(x,16,x+3,25),'hazard-paint',4);d.l(f'{x+1},18 {x+1},22','hazard-paint',5)
 d.ls(['8,13 12,13 12,14 16,14','34,14 39,14','24,40 28,40'],r,3)

def sluice(d):
 r='sewer-water'
 outlined_rect(d,(3,24,44,42),r,5);d.r((6,26,41,32),r,2)
 d.l('4,25 43,25',r,6);d.l('5,40 42,40',r,4)
 for x in (8,36):outlined_rect(d,(x,15,x+3,36),r,5)
 outlined_rect(d,(11,19,36,31),r,5)
 for x in (15,21,27,33):d.l(f'{x},22 {x},29',r,3)
 outlined_rect(d,(6,14,41,18),r,5);d.l('7,15 40,15',r,6)
 d.r((23,7,25,24),r,1);d.l('24,8 24,23',r,5)
 d.p('17,5 20,3 28,3 31,5 32,8 31,11 28,13 20,13 17,11 16,8','slime',4,1)
 d.p('19,6 21,5 27,5 29,6 30,8 29,10 27,11 21,11 19,10 18,8',r,1)
 d.ls(['18,8 30,8','24,4 24,12'],r,5)
 d.ls(['7,35 13,35 13,36 18,36','29,37 35,37 35,36 40,36'],'slime',4)

def planter(d,stone=False):
 r='yard-cobble' if stone else 'planters';s=5
 outlined_rect(d,(7,24,40,42),r,s)
 d.l('8,25 8,40',r,s+1);d.l('10,41 37,41',r,s-1)
 outlined_rect(d,(3,17,44,27),r,s);d.l('4,18 43,18',r,s+1)
 d.r((8,20,39,24),r,1)
 if stone:
  d.r((9,21,38,24),'roof-slate',3);d.l('12,22 22,22 22,23 30,23','roof-slate',4)
  d.ls(['10,30 15,30 15,31 18,31','27,36 31,36 31,38 36,38','9,37 13,37 13,38 18,38'],r,3)
  d.ls(['12,19 20,19','31,25 39,25','10,29 14,29'],r,6)
 else:
  d.ls(['10,31 14,31 14,32 20,32','28,37 33,37 33,35 37,35','17,39 22,39'],r,3)
  d.l('24,22 24,8','overgrowth',1)
  for t in ['23,16 19,16 15,13 13,9 13,5 18,6 21,9 23,13',
   '25,13 27,8 31,5 36,4 37,7 35,11 31,14 26,16',
   '22,22 17,22 12,20 8,17 7,13 11,13 16,15 20,18',
   '25,21 29,17 34,15 40,15 41,18 38,21 33,23 28,23']:
   d.p(t,'overgrowth',5,1)
  d.ls(['15,7 17,10 21,14','35,6 31,9 28,13','10,15 14,17 18,20','38,17 34,18 30,21'],'overgrowth',6)

def pump(d):
 r='pipes'
 # Full-width front-facing grille with attached machined mounts.
 for x in (9,32):
  outlined_rect(d,(x,32,x+7,41),r,4);outlined_rect(d,(x-3,39,x+10,44),r,4)
  d.l(f'{x-2},40 {x+9},40',r,5);d.r((x,41,x+2,42),r,1)
 d.p('11,13 16,10 30,10 35,13 38,18 38,29 35,34 30,37 16,37 11,34 8,29 8,18',r,4,1)
 d.l('10,17 13,13 17,11 29,11 33,13',r,5)
 d.p('15,18 19,16 27,16 31,18 34,22 34,27 31,31 27,33 19,33 15,31 12,27 12,22',r,2,1)
 for x in (17,21,25,29):d.r((x,20,x+1,29),'soot',1);d.l(f'{x+1},21 {x+1},28',r,4)
 d.ls(['10,23 10,28 13,32','34,17 36,20 36,28'],r,3)
 # Elbow centred above motor, collars join the horizontal and vertical pipe.
 d.p('25,3 36,3 40,5 42,9 42,17 35,17 35,11 33,10 25,10',r,4,1)
 d.l('26,4 35,4 38,6 40,9',r,5)
 outlined_rect(d,(33,14,44,19),r,4);d.l('34,15 43,15',r,5)
 outlined_rect(d,(23,2,27,11),r,4);d.l('24,3 24,10',r,5)

def prop(n):
 if n=='keep':return crate()
 if n in ('cave_rock','cave_ice','cave_crystal','cave_lava','station_lab'):
  im=old_prop(n);d=Pen(im)
  if n=='cave_lava':
   d.ps(['17,11 23,11 23,12 29,12 29,14 25,14 25,15 19,15 19,13 17,13'],'embers',3)
   d.l('20,12 23,12 23,13 27,13','embers',4)
  if n=='station_lab':
   d.ls(['12,12 16,14 22,15 29,15 35,13','13,41 18,43 28,43 34,41'],'tank-glass',2)
   d.ls(['15,20 15,29','17,22 17,26','32,20 33,20 33,29'],'tank-glass',5)
   d.r((18,9,20,11),'tank-glass',2);d.r((29,9,31,11),'tank-glass',2)
   d.ps(['22,20 24,20 24,22 26,22 26,24 23,24 23,26 21,26 21,23 22,23'],'spills',3)
  # Excluded pale pigments remain available only in reference atlases.
  from build_palette import RAMPS,roles
  rr={tuple(bytes.fromhex(v[i-1][1:])):tuple(bytes.fromhex(v[i-2][1:])) for r,v in RAMPS.items() for i in roles(r).get('reference-only',[])}
  im.putdata([(*rr.get(v[:3],v[:3]),v[3]) for v in im.get_flattened_data()]);return im
 im=Image.new('RGBA',(48,48));d=Pen(im)
 if n=='temple':altar(d)
 elif n=='crypt':altar(d,True)
 elif n=='manor':stool(d)
 elif n=='dungeon_sewer':sluice(d)
 elif n=='station_corridor':case(d)
 elif n=='station_engine':pump(d)
 elif n=='station_hydro':planter(d)
 elif n=='yard':planter(d,True)
 return im

BODY={
'keep':[('wood-oak',5)],'temple':[('brass',4)],
'manor':[('timber',5),('textiles-sage',4),('textiles-teal',2)],
'crypt':[('dark-masonry',6),('bone',3)],'cave_rock':[('fungus',4),('mud',6)],
'cave_ice':[('blue-ice',2),('frost',2),('snowdrift',2)],
'cave_crystal':[('violet-crystal',4),('dark-rock',6)],'cave_lava':[('ash',4),('ash',2)],
'dungeon_sewer':[('sewer-water',5),('slime',4)],'station_corridor':[('station-panels',4),('hazard-paint',4)],
'station_lab':[('tank-glass',4),('tank-glass',2)],'station_engine':[('pipes',4)],
'station_hydro':[('planters',5),('overgrowth',5)],'yard':[('yard-cobble',5)]}

def studies():
 # Study panels demonstrate a material's structure, wear and characteristic
 # trim, rather than pretending that six widely spaced tones fit one floor.
 # Native cutaways: wall finish above floor, with a small material trim below.
 for n in S:
  if n=='crypt':continue
  name='building-yard' if n=='yard' else n
  im=Image.new('RGBA',(48,48));f=floor(n);w=wall(n)
  from finish_proofs_c2 import finish
  f,w,_=finish(n,f,w,prop(n))
  im.paste(w.crop((0,48,48,72)),(0,0));im.paste(f.crop((0,96,48,120)),(0,24));d=Pen(im)
  if n=='keep':
   d.r((38,0,42,23),'wood-oak',3);d.l('38,0 38,23','wood-oak',5);d.l('40,3 40,11 41,11 41,19','wood-oak',2)
  elif n=='temple':
   d.r((0,22,47,24),'brass',2);d.l('1,22 46,22','brass',3)
  elif n=='manor':
   d.r((0,22,47,24),'timber',3);d.l('1,22 46,22','timber',5)
  elif n=='cave_rock':
   d.ps(['4,34 10,34 10,35 14,35 14,38 11,38 11,40 6,40 6,38 3,38'],'mud',5)
  elif n=='cave_ice':
   d.ps(['0,20 8,20 8,18 13,18 13,21 18,21 18,24 11,24 11,26 4,26 4,24 0,24'],'frost',3)
   d.l('2,21 7,21 7,20 11,20','snowdrift',3)
  elif n=='cave_crystal':
   d.ps(['25,16 28,16 28,20 31,20 31,24 35,24 35,27 32,27 32,24 28,24 28,21 25,21'],'violet-crystal',3)
   d.l('26,17 26,20 29,20 29,23','violet-crystal',4)
  elif n=='cave_lava':
   d.ps(['14,23 18,23 18,27 21,27 21,31 25,31 25,34 22,34 22,31 18,31 18,28 14,28'],'embers',3)
   d.l('15,24 15,27 19,27 19,30','embers',4)
  elif n=='dungeon_sewer':
   d.ps(['0,22 5,22 5,25 8,25 8,29 5,29 5,33 1,33 1,28 0,28'],'slime',3)
   d.l('2,24 4,24 4,28 6,28','sewer-water',4)
  elif n=='station_corridor':
   d.r((36,4,42,11),'station-panels',3)
   d.l('37,5 41,5','station-panels',4)
   d.r((0,19,47,24),'hazard-paint',3)
   for x in (4,16,28,40):d.p(f'{x},19 {x+3},19 {x+8},24 {x+5},24','station-panels',2)
  elif n=='station_lab':
   d.ps(['20,31 25,31 25,29 29,29 29,32 34,32 34,35 31,35 31,38 25,38 25,36 20,36'],'spills',3)
   d.l('23,32 26,32 26,31 28,31','tank-glass',3)
   d.r((39,4,43,9),'clean-tile',3)
  elif n=='station_engine':
   d.ps(['19,33 25,33 25,31 29,31 29,34 34,34 34,37 30,37 30,40 23,40 23,38 19,38'],'oil',4)
   d.l('21,34 25,34 25,33 28,33','oil',5)
  elif n=='station_hydro':
   d.r((0,19,47,24),'planters',3);d.l('0,20 47,20','planters',4)
   d.ps(['7,19 10,19 10,22 13,22 13,25 10,25 10,29 7,29'],'overgrowth',3)
   d.ps(['15,37 21,37 21,36 26,36 26,38 30,38 30,41 24,41 24,43 18,43 18,41 15,41'],'leaks',3)
  elif n=='yard':
   im.paste(f.crop((40,96,88,120)),(0,24))
  # Native cleanup at cropped wall/floor intersections, not a filtering pass.
  if n=='keep':d.r((16,23,17,23),'iron',2)
  elif n=='cave_crystal':d.r((47,24,47,25),'violet-crystal',3)
  elif n=='cave_lava':
   d.r((32,15,32,17),'embers',3);d.r((33,16,35,16),'embers',4)
  elif n=='station_corridor':d.r((4,2,6,2),'station-panels',3)
  elif n=='station_lab':d.r((7,6,9,6),'clean-tile',3)
  elif n=='station_engine':d.r((5,6,7,6),'pipes',2)
  elif n=='station_hydro':
   d.r((0,0,47,18),'planters',2);d.r((1,1,46,2),'planters',3)
   d.l('8,4 15,4 15,5 20,5','planters',4)
   d.r((30,5,32,18),'overgrowth',2)
   d.p('24,4 28,4 28,6 31,6 31,10 28,10 28,8 25,8 25,6 24,6','overgrowth',3)
   d.p('33,8 38,8 38,6 42,6 42,9 39,9 39,12 34,12 34,14 31,14 31,11 33,11','overgrowth',4)
   d.p('24,13 28,13 28,15 31,15 31,18 27,18 27,16 24,16','overgrowth',3)
   d.r((5,28,6,28),'planters',3)
  im.save(BASE/'canon/swatches'/f'{name}.png')

def build():
 for n in S:
  f,w,p=floor(n),wall(n),prop(n)
  from finish_proofs_c2 import finish
  f,w,p=finish(n,f,w,p)
  im=f.copy();im.paste(w,(0,0));im.alpha_composite(p,(86,96))
  im.save(BASE/'proof'/f'{n}.png');im.convert('L').convert('RGBA').save(BASE/'proof'/f'{n}-grey.png')
  for tag,layer in (('floor',f),('wall',w),('prop',p)):layer.save(REVIEW/f'C-layer-{n}-{tag}.png')
  tiled=Image.new('RGBA',(432,432))
  for y in range(3):
   for x in range(3):tiled.paste(f,(x*144,y*144))
  tiled.save(REVIEW/f'proof-3x3repeat-{n}.png')
 for name,im in [('crate',crate()),('chest',chest()),('table',table())]:im.save(BASE/'canon/props'/f'{name}.png')
 studies()
if __name__=='__main__':build()
