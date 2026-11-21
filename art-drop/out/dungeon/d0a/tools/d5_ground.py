"""Native pencil repairs using the previous image source as a layout reference.
All vertices describe art pixels. No bitmap is resized or filtered here.
"""
from PIL import Image, ImageDraw, ImageChops
from draw_proofs import BASE, REVIEW, c, pts
from redraw_critic21 import box,line,poly,canvas
from d_sprites import new
from d4_caves import RAMPS

# Individual exposed stone planes: contours traced afresh, not image quantisation.
# The paths include the back/left/top and then the front lip, clockwise.
BEDS=[
 '-28,5 36,-14 73,-6 83,14 64,34 42,34 28,48 -6,47 -28,30',
 '78,-10 126,-18 159,-4 169,14 151,30 130,29 111,45 79,37 67,23',
 '197,-18 238,-12 264,2 263,20 239,37 212,46 190,33 178,14',
 '16,59 47,44 71,44 92,34 113,46 111,72 82,95 49,103 26,87',
 '120,46 151,36 174,15 195,35 185,59 168,69 163,88 135,103 112,84',
 '199,65 229,48 254,44 275,28 307,36 319,60 292,79 272,81 255,99 220,98 197,85',
 '-33,113 -4,92 19,91 35,110 27,128 5,141 -13,140 -29,130',
 '42,119 76,108 102,88 123,109 116,133 99,145 93,164 62,183 41,166 29,145',
 '133,114 163,101 186,78 207,99 204,122 178,148 155,150 137,163 115,146',
 '219,115 250,111 276,91 302,100 316,123 292,141 267,144 252,158 225,151 212,134',
 '-30,188 6,153 28,148 47,177 32,198 16,205 11,222 -17,235 -32,214',
 '49,195 79,184 110,157 135,177 136,199 108,223 84,230 67,244 38,229 34,213',
 '150,176 173,162 196,135 217,151 220,176 197,196 183,213 154,224 134,204',
 '236,179 266,164 297,149 319,170 312,195 289,205 268,226 242,227 222,205',
 '-10,256 19,234 41,241 54,258 36,275 17,287 -9,289 -25,273',
 '75,254 102,239 128,214 149,236 145,259 124,277 101,282 90,297 64,282',
 '165,244 190,223 216,207 238,230 231,253 209,264 190,286 167,282 152,266',
 '250,252 279,239 306,230 326,251 317,273 293,285 278,303 249,289 238,271']

def edge_points(q):
 # Substantial slab polygons remain clean; contour pixel steps are native.
 return pts(q) if isinstance(q,str) else q

def slab(im,q,r,depth=5,lip=2):
 q=edge_points(q);d=ImageDraw.Draw(im)
 # Front face is the whole slab translated downward; the top covers its back.
 d.polygon([(x,y+depth) for x,y in q], fill=c(*r[0].split(':')[:1],int(r[0].split(':')[1])))
 d.polygon(q,fill=c(*r[2].split(':')[:1],int(r[2].split(':')[1])))
 # Light only the upper-facing contour; do not outline the entire stone.
 k=min(range(len(q)),key=lambda i:q[i][1]);upper=[q[k-1],q[k],q[(k+1)%len(q)]]
 if r[3]!=r[2]:
  light=Image.new('RGBA',im.size);ld=ImageDraw.Draw(light);ld.line(upper,fill=c(*r[3].split(':')[:1],int(r[3].split(':')[1])),width=lip)
  m=Image.new('L',im.size);ImageDraw.Draw(m).polygon(q,fill=255);light.putalpha(ImageChops.multiply(light.getchannel('A'),m));im.alpha_composite(light)
 # A single broad cleavage plane gives mass without fine contour tracing.
 a=q[0];b=q[-1];m=q[-2]
 if abs(a[1]-b[1])>10:
  d.polygon([a,(a[0]+8,a[1]+4),(b[0]+12,b[1]-4),m,b],fill=c(*r[1].split(':')[:1],int(r[1].split(':')[1])))

def wrap_poly(im,tag,q):
 q=pts(q)
 for dx in (-288,0,288):
  for dy in (-288,0,288):
   ImageDraw.Draw(im).polygon([(x+dx,y+dy) for x,y in q],fill=c(tag.split(':')[0],int(tag.split(':')[1])))
def wrap_line(im,tag,q,width=1):
 q=pts(q)
 for dx in (-288,0,288):
  for dy in (-288,0,288):
   ImageDraw.Draw(im).line([(x+dx,y+dy) for x,y in q],fill=c(tag.split(':')[0],int(tag.split(':')[1])),width=width)

def pattern(name):
 r={'cave_rock':['grey-brown-rock:3','mud:4','grey-brown-rock:4','grey-brown-rock:4'], 'cave_ice':['blue-ice:2','frost:2','blue-ice:3','snowdrift:3'], 'cave_crystal':['dark-rock:4','dark-rock:4','dark-rock:5','dark-rock:5'], 'cave_lava':['basalt:5','ash:3','basalt:6','basalt:6']}[name];im=canvas((288,288),r[1])
 # Wrapped drawing of each unique plane continues through opposite edges.
 for q in BEDS:
  for dx in (-288,0,288):
   for dy in (-288,0,288):slab(im,[(x+dx,y+dy) for x,y in pts(q)],r,5)
 detail_pattern(im,name)
 if name=='cave_rock':
  pass
 elif name=='cave_ice':
  # Connected snow tongues over blue ice; frost is a broad edge, not fringe.
  for p in ['20,88 38,80 60,76 84,80 94,86 78,86 66,90 48,90 36,96 24,96','120,224 144,210 166,210 188,216 180,224 158,224 146,230 130,232','238,224 258,216 280,218 290,226 290,234 272,232 258,232 250,238 238,236']:
   wrap_poly(im,'snowdrift:3',p)
  for p in ['143,76 159,82 170,82 180,92 198,92','40,28 54,34 68,34 76,42','253,112 265,116 283,116 291,122']:
   wrap_line(im,'blue-ice:2',p,3)
 elif name=='cave_crystal':
  # Mineral seams are inside rock, never a violet moat around every stone.
  imdata=list(im.get_flattened_data());a=tuple(bytes.fromhex(c('violet-crystal',3)[1:]))+(255,);b=tuple(bytes.fromhex(c('dark-rock',4)[1:]))+(255,)
  im.putdata([b if p==a else p for p in imdata])
  for p in ['126,20 138,26 152,26 162,34 178,34','84,158 100,158 112,166 132,166 142,174','238,244 254,244 264,252 286,252']:
   wrap_line(im,'violet-crystal:3',p,3)
   q=pts(p);wrap_line(im,'dark-rock:5',' '.join(f'{x},{y-2}' for x,y in q[1:-1]),2)
 elif name=='cave_lava':lava(im)
 return im

def detail_pattern(im,name):
 dark,mid,light={
 'cave_rock':('grey-brown-rock:3','mud:5','grey-brown-rock:4'),
 'cave_ice':('blue-ice:2','frost:3','snowdrift:3'),
 'cave_crystal':('dark-rock:4','violet-crystal:3','dark-rock:5'),
 'cave_lava':('basalt:5','ash:3','basalt:6')}[name]
 # Bedding planes are unequal and attached to fracture fronts; they never form
 # repeated concentric rock stickers. All paths are authored against BEDS above.
 planes=['30,73 45,76 63,72 76,62 100,56 101,69 79,87 49,96 34,84',
 '125,68 141,66 155,54 177,42 176,58 158,70 154,83 136,94 120,82',
 '210,76 236,69 251,59 275,56 290,48 304,48 306,59 286,72 266,74 250,91 222,90',
 '46,139 64,135 84,118 99,108 110,114 105,131 89,143 84,157 63,173 47,162 37,146',
 '144,134 160,123 175,108 190,104 192,120 174,140 151,141 137,152 126,143',
 '226,133 245,133 262,121 285,111 299,112 305,121 286,134 262,136 249,149 229,144',
 '50,216 72,212 88,198 109,184 125,181 126,197 104,214 82,221 66,235 46,226',
 '153,200 164,185 186,172 202,154 208,161 209,174 191,190 178,206 157,215 143,203',
 '235,207 247,194 267,188 283,172 301,166 308,175 302,189 283,198 264,218 246,219',
 '77,272 91,263 109,251 129,231 138,239 135,255 118,267 98,274 89,287 73,279',
 '166,267 186,257 200,241 220,226 227,232 221,248 201,257 185,278 170,275']
 for p in planes:wrap_poly(im,dark,p)
 for p in ['33,61 48,54 62,54 78,46','126,52 147,46 159,35','219,57 238,54 252,50','50,126 65,122 83,110','137,118 156,112 170,96','229,122 248,120 266,108','47,205 61,199 76,195','156,179 168,173 181,156','241,187 259,181 274,171','82,257 99,248 113,234','171,246 189,231 205,222']:
  wrap_line(im,mid,p,3)
 # Chips meet an existing fracture and leave a blunt, connected missing corner.
 for p in ['68,88 74,82 79,82 79,88 73,93','145,85 151,79 157,79 157,84 151,90','259,84 264,80 271,80 271,84 265,89','71,165 76,158 82,158 82,165 76,170','167,140 174,134 179,134 179,141 173,146','88,216 95,210 100,210 100,215 94,222','170,209 176,201 181,201 181,207 175,214','267,216 274,210 280,210 280,214 273,221']:
  wrap_poly(im,mid,p)

def lava(im):
 # One continuous fault: same y profile at x=0 and x=288, with interlocking banks.
 north=[(-12,112),(22,112),(34,100),(62,100),(76,114),(100,114),(112,130),(140,130),(154,118),(180,118),(194,106),(220,106),(236,118),(258,118),(272,112),(300,112)]
 south=[(-12,144),(20,144),(32,132),(56,132),(72,148),(96,148),(110,164),(138,164),(154,152),(180,152),(194,140),(218,140),(234,152),(260,152),(274,144),(300,144)]
 d=ImageDraw.Draw(im);d.polygon(north+south[::-1],fill=c('embers',3))
 # Molten surface has open pools and crust tongues, with no rectangular channel.
 wrap_line(im,'embers:4','0,132 22,132 36,120 55,120 72,134 100,136 116,152 136,152 154,138 180,138 196,126 216,126 236,140 258,138 276,132 287,132',4)
 for a,b,dep in [(0,4,8),(3,7,12),(6,10,6),(9,13,10),(12,15,8)]:
  q=north[a:b+1];d.polygon(q+[(x,y+dep) for x,y in q[::-1]],fill=c('basalt',5));d.line(q,fill=c('basalt',6),width=2)
 for q in ['43,121 55,120 65,128 61,134 50,134','126,140 138,136 148,140 143,147 130,148','205,124 216,126 225,132 220,136 210,134']:
  wrap_poly(im,'ash:3',q)
 wrap_line(im,'basalt:6','0,146 20,146 32,134 56,134 72,150 96,150 110,166 138,166 154,154 180,154 194,142 218,142 234,154 260,154 274,146 287,146',2)

# Large cave: individually composed plates along the existing source bed layout.
# Explicit locations/widths/heights/notches: none reuses an atlas section.
SCENE_BEDS=[
 (246,210,112,66,22),(370,201,141,73,31),(524,202,105,58,18),(648,158,108,66,26),(775,162,96,72,20),
 (248,292,100,71,18),(365,292,138,75,34),(523,291,118,68,24),(660,252,104,82,28),(770,275,93,65,16),
 (228,363,96,62,20),(341,375,116,59,28),(470,372,140,65,32),(624,362,100,78,24),(730,364,104,66,22),
 (315,463,114,70,26),(446,470,118,83,22),(584,513,132,64,34),(724,555,108,61,26),
 (193,548,126,77,26),(333,560,114,76,30),(462,579,126,68,20),(212,653,107,67,18),(335,658,125,62,32),
 (943,224,107,70,22),(1066,235,126,72,32),(1207,260,121,61,24),(1324,285,132,75,22),
 (975,325,112,72,30),(1095,325,132,80,24),(1242,350,118,63,28),(1378,381,108,65,18),
 (975,421,123,65,28),(1106,427,120,69,22),(1244,436,108,58,26),
 (1524,245,98,68,20),(1642,234,115,74,30),(1768,247,97,61,24),
 (1544,329,111,69,30),(1667,322,109,77,20),(1784,329,100,69,28),
 (1500,440,109,68,28),(1622,427,119,76,30),(1762,436,94,67,20),
 (873,572,118,75,20),(1008,548,124,69,34),(1148,574,116,74,24),(1327,586,120,73,20),
 (706,658,126,73,30),(849,677,110,66,22),(977,651,110,83,26),(1104,678,114,69,30),(1365,691,112,73,24),(1500,682,99,88,20),
 (720,755,124,76,28),(858,759,128,84,32),(1001,750,119,79,26),(1136,790,133,73,24),(1284,779,120,75,32),(1433,794,116,74,22),
 (773,859,115,74,26),(904,857,123,65,28),(1040,873,128,78,24),(1183,883,115,72,30),(1327,881,109,70,22),
 (1459,914,98,70,26),(1590,922,99,68,20),(1658,1000,106,74,28),
 (126,938,106,78,24),(243,954,112,68,28),(361,1001,126,62,30),(489,1007,117,77,20),
 (153,1043,104,69,20),(275,1067,112,79,30),(402,1093,113,69,28),(526,1093,120,74,20),
 (203,1152,111,72,26),(331,1175,106,69,24),(455,1177,128,70,32),
 (705,1041,112,79,26),(825,1033,121,78,22),(950,1087,112,81,28),(1075,1052,123,73,30),(1209,1039,105,74,24),(1331,1068,111,64,22),
 (725,1141,119,69,24),(846,1166,112,76,30),(1010,1198,114,69,24),(1141,1187,113,78,22),(1261,1158,120,77,28),(1399,1153,112,74,24)]

def cave_scene(size):
 im=canvas(size,'mud:4');r=['grey-brown-rock:3','mud:4','grey-brown-rock:4','grey-brown-rock:4']
 # Worn earth is the connected background between the plates, rather than a
 # stripe over them. Slabs are placed around the route and never cover it anew.
 for i,(x,y,w,h,n) in enumerate(SCENE_BEDS):
  profiles=[
   [(x,y+18),(x+n,y+6),(x+w-28,y-9),(x+w+9,y+6),(x+w-7,y+29),(x+w-28,y+39),(x+w-33,y+h-7),(x+18,y+h+3),(x-4,y+h-15)],
   [(x-9,y+22),(x+16,y+7),(x+w-31,y),(x+w+12,y+23),(x+w-12,y+44),(x+w-17,y+h),(x+25,y+h-7),(x+9,y+43)],
   [(x,y+16),(x+28,y),(x+w-21,y+11),(x+w+16,y+36),(x+w-7,y+h-3),(x+47,y+h+7),(x+32,y+h-11),(x-8,y+h-6)],
   [(x-10,y+21),(x+19,y+4),(x+n+25,y+10),(x+w-14,y-8),(x+w+8,y+15),(x+w-14,y+41),(x+w-18,y+h),(x+21,y+h+6),(x+4,y+46)],
   [(x,y+8),(x+n,y-6),(x+w-32,y+1),(x+w+6,y+20),(x+w-5,y+38),(x+w-29,y+44),(x+w-38,y+h+8),(x+12,y+h-3),(x-6,y+31)]
  ]
  q=profiles[i%5];slab(im,q,r,5,2)
  # Fracture face follows the same geological split as this plate's contour.
  a,b=q[-3],q[-2]
  ImageDraw.Draw(im).polygon([a,b,(b[0]+9,b[1]-10),(a[0]-8,a[1]-10)],fill=c('grey-brown-rock',3))
  if i in (0,3,5,8,11,15,17,20,22,26,29,31,34,36,39,42,44,47,50,53,55,59,62,64,66,69,72,75):
   line(im,'mud:5',f'{x+n},{y+14} {x+n+17},{y+14} {x+n+27},{y+20} {x+w-26},{y+20}',3)
  # One long bedding cleavage on selected broad plates, each with its own run.
  if i in (1,6,10,18,23,27,30,37,43,51,56,61,67,74):
   line(im,'mud:4',f'{x+20},{y+h//2} {x+w//2},{y+h//2} {x+w//2+8},{y+h//2+6} {x+w-20},{y+h//2+6}',2)
 # Damp contacts are broad connected shapes under the original pools.
 for p in ['852,249 874,239 919,242 942,264 942,380 924,410 865,408 840,384 846,292','505,682 532,658 578,660 606,689 598,724 566,750 526,738 508,714']:
  poly(im,'mud:4',p)
 # Scree is clustered against wall toes, three differently sized stones per site.
 for x,y,w,h in [(267,249,20,10),(285,262,14,8),(304,248,26,13),(634,122,25,12),(660,134,16,9),(680,127,22,11),(1480,328,26,12),(1508,340,18,10),(1525,334,23,12),(1778,509,24,11),(1804,502,16,9),(1822,495,28,14),(655,816,23,13),(680,831,17,10),(700,824,26,12),(1471,1081,28,12),(1503,1075,18,10),(1523,1085,24,12)]:
  slab(im,[(x,y+4),(x+6,y),(x+w-6,y),(x+w,y+5),(x+w-4,y+h),(x+4,y+h)],r,3,1)
 return im

def masonry(im,mask,look):
 """Joint-aligned worn planes on the existing floor, preserving its rugs."""
 r={'keep':('limestone:2','limestone:3','iron:3'),'temple':('sandstone:2','sandstone:3','mud:5'),'crypt':('dark-masonry:4','dark-masonry:5','lichen:3'),'manor':('sandstone:2','sandstone:3','mud:5')}[look]
 art=im.copy();d=ImageDraw.Draw(art)
 # Broad hand-chosen worn slabs follow the occupied rooms and approach.
 sets={
 'keep':[(384,816,96,48,19),(480,816,48,96,12),(528,768,96,48,28),(624,816,96,48,22),(720,768,96,96,18),(384,912,96,48,28),(480,960,96,48,20),(576,912,96,48,26),(672,912,48,96,15),(720,960,96,48,32),(432,768,48,48,12),(528,864,48,48,18),(384,960,48,48,10),(720,864,96,48,23),(432,384,48,96,17),(480,480,96,48,20),(576,576,48,96,12),(720,240,96,48,24),(1056,288,96,96,27),(1152,480,96,48,18)],
 'temple':[(240,432,96,48,24),(336,480,96,48,20),(432,432,96,96,28),(528,528,96,48,32),(624,432,96,96,22),(240,528,48,96,16),(336,576,96,48,24),(480,576,48,96,15),(624,576,96,48,28),(240,768,96,96,30),(336,768,48,96,14),(384,816,96,48,26),(480,768,96,96,20),(576,816,96,48,22),(624,864,96,48,28),(240,864,96,48,21),(336,912,96,48,18),(432,912,96,48,25),(528,912,96,48,20),(720,768,96,96,26),(144,672,48,96,12),(816,480,48,96,16),(960,384,48,96,16),(1008,480,48,48,18),(1152,384,96,48,28),(1248,576,96,96,22)],
 'crypt':[(240,480,96,48,24),(336,528,48,96,15),(384,480,96,96,28),(480,528,96,48,30),(576,480,48,96,17),(624,576,48,96,14),(240,624,48,96,17),(288,720,96,48,30),(384,672,96,96,24),(480,720,48,96,19),(528,624,96,48,28),(576,720,96,96,22),(288,816,96,48,26),(384,816,96,48,20),(528,816,96,48,23),(576,192,48,96,18),(624,288,96,48,28),(720,288,48,96,16),(768,336,96,48,22),(912,816,96,48,24),(1008,864,96,48,28),(1104,816,96,48,22),(1200,864,96,48,20),(1296,816,96,48,26),(1152,480,96,96,24),(1296,576,96,48,22)],
 'manor':[(1152,192,96,48,24),(1248,240,96,48,22),(1152,288,96,96,26),(1248,384,96,48,28),(1344,192,48,96,12),(1392,432,48,48,15),(1488,192,96,96,28),(1584,288,96,48,24),(1680,192,96,48,30),(1488,384,96,48,20),(1584,432,96,48,22),(1680,336,96,96,28)]}
 for x,y,w,h,n in sets[look]:
  # Worn top and left arris, connected with the masonry joint. Each slab's
  # shoulder/notch differs; centres remain broad enough for token readability.
  q=[(x+3,y+3),(x+w-n,y+3),(x+w-n,y+6),(x+w-8,y+6),(x+w-8,y+10),(x+w-20,y+10),(x+w-20,y+8),(x+n,y+8),(x+n,y+12),(x+7,y+12),(x+7,y+h-n),(x+3,y+h-n)]
  d.polygon(q,fill=c(*r[0].split(':')[:1],int(r[0].split(':')[1])))
  line(art,r[2],f'{x+n+2},{y+10} {x+w-24},{y+10}',2)
  # Front abrasion is a flat shallow plane, not fine isolated scratch lines.
  poly(art,r[0],f'{x+12},{y+h-8} {x+w//2},{y+h-8} {x+w//2},{y+h-12} {x+w-7},{y+h-12} {x+w-7},{y+h-5} {x+12},{y+h-5}')
 # Surface strata are placed within the selected flags. Each goes in one
 # differently sized stone; broad filled wear avoids isolated scratch marks.
 for j,(x,y,w,h,n) in enumerate(sets[look]):
  if j%3==0:
   poly(art,r[2],f'{x+14},{y+19} {x+n+13},{y+19} {x+n+13},{y+22} {x+w-13},{y+22} {x+w-13},{y+26} {x+n+7},{y+26} {x+n+7},{y+23} {x+14},{y+23}')
  elif j%3==1:
   poly(art,r[2],f'{x+12},{y+19} {x+19},{y+19} {x+19},{y+h//2} {x+26},{y+h//2} {x+26},{y+h//2+5} {x+16},{y+h//2+5} {x+16},{y+26} {x+12},{y+26}')
  else:
   poly(art,r[2],f'{x+14},{y+h//2} {x+w-n},{y+h//2} {x+w-n},{y+h//2-3} {x+w-11},{y+h//2-3} {x+w-11},{y+h//2+3} {x+14},{y+h//2+3}')
 # Floor-only clipping also protects earlier colour zones and textiles.
 allowed={tuple(bytes.fromhex(c(a,int(b))[1:])) for a,b in [v.split(':') for v in r]}
 p=im.load();m=Image.new('L',im.size);mp=m.load();fm=mask.load()
 for yy in range(im.height):
  for xx in range(im.width):
   if fm[xx,yy] and p[xx,yy][:3] in allowed:mp[xx,yy]=255
 im.paste(art,(0,0),m);return im

if __name__=='__main__':
 for n in RAMPS:pattern(n).save(BASE/f'canon/surfaces/{n}-floor.png')
