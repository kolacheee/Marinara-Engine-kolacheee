"""Operator D repair. Native integer pencil strokes and 1:1 source copies only."""
import json,copy,shutil
from PIL import Image,ImageDraw,ImageChops
import d_frames as F
import d2_scene as S
import d3_scene as T
import d_redraw_scene as R
from d_layouts import MAPS
from draw_proofs import BASE,REVIEW,c,pts
from redraw_critic21 import box,line,poly,canvas
from d_sprites import new,framed
from d3_props import brazier

ORIGINAL=copy.deepcopy(MAPS)

def flags(im,b,base,joint,lip,period=48):
 x,y,u,v=b;box(im,base,b)
 # Regular joints are architecture. Every weathering mark is placed separately.
 for yy in range((y//period)*period,v+1,period):
  if yy>=y:line(im,joint,f'{x},{yy} {u},{yy}',1)
 for xx in range((x//48)*48,u+1,48):
  if xx>=x:line(im,joint,f'{xx},{y} {xx},{v}',1)
 for yy in range(((y+47)//48)*48,v,48):
  for xx in range(((x+47)//48)*48,u,96):line(im,lip,f'{xx+3},{yy+2} {min(xx+42,u)},{yy+2}',1)

def rug(im,b,r='textiles-teal',motif=True):
 x,y,u,v=b;box(im,r+':1',b);box(im,r+':3',(x+2,y+2,u-2,v-2));box(im,r+':2',(x+7,y+7,u-7,v-7))
 for yy in (y+4,v-4):line(im,r+':4',f'{x+4},{yy} {u-4},{yy}',1)
 for xx in (x+4,u-4):line(im,r+':4',f'{xx},{y+4} {xx},{v-4}',1)
 for xx in range(x+8,u-7,8):line(im,r+':3',f'{xx},{y-3} {xx},{y-1}',2);line(im,r+':3',f'{xx},{v+1} {xx},{v+3}',2)
 if motif:
  cx=(x+u)//2;cy=(y+v)//2;rx=min(44,(u-x)//4);ry=min(60,(v-y)//4)
  poly(im,r+':3',f'{cx-rx},{cy} {cx},{cy-ry} {cx+rx},{cy} {cx},{cy+ry}')
  poly(im,r+':2',f'{cx-rx+6},{cy} {cx},{cy-ry+6} {cx+rx-6},{cy} {cx},{cy+ry-6}')
  line(im,r+':4',f'{cx-8},{cy} {cx+8},{cy}',2);line(im,r+':4',f'{cx},{cy-8} {cx},{cy+8}',2)

def boards(im,b):
 x,y,u,v=b;box(im,'parquet:3',b)
 for yy in range(y+16,v,16):
  line(im,'timber:4',f'{x},{yy} {u},{yy}',1)
  for xx in range(x+48+(yy-y)//16%3*48,u,144):line(im,'timber:4',f'{xx},{yy-15} {xx},{yy}',1)
 # Long, joined grain belongs to planks, and occurs once in each room.
 for dx,dy,w in [(12,24,59),(83,59,34),(26,93,81),(109,151,62),(48,203,45),(131,247,92)]:
  if y+dy<v and x+dx+w<u:line(im,'parquet:4',f'{x+dx},{y+dy} {x+dx+w},{y+dy}',1)

def ground(im,mask,look):
 art=new(*im.size)
 if look=='cave_rock':
  source=Image.open(REVIEW/'D-cave-native-locked.png')
  # Source pixels are copied unchanged. The second panel uses a different source
  # offset and a natural bed boundary, never a miniature or stretched texture.
  for y in range(0,im.height,1152):
   for x in range(0,im.width,1152):art.paste(source,(x,y))
  # Worn route narrows between mineral banks; broad fills follow source passages.
  route=[(300,408),(445,420),(600,466),(745,524),(928,521),(1120,490),(1250,525),(1371,552),(1485,610),(1566,710),(1585,838),(1480,940),(1350,1010),(1140,1006),(1040,1050),(960,1140)]
  d=ImageDraw.Draw(art);d.line(route,fill=c('grey-brown-rock',3),width=26)
  # Damp shelves touch the actual pools, never random stains.
  for p in ['852,256 866,244 925,244 933,261 933,380 918,401 868,396 848,375', '512,678 544,665 583,672 596,699 582,731 546,739 522,716']:
   poly(art,'mud:4',p)
 elif look in ('keep','temple','crypt'):
  pair={'keep':('limestone:3','limestone:2','iron:3'), 'temple':('sandstone:3','sandstone:2','mud:5'),'crypt':('dark-masonry:5','dark-masonry:4','lichen:3')}[look]
  flags(art,(0,0,im.width-1,im.height-1),*pair)
  if look=='keep':
   # Treasury paving, hall runner, and the worn approach/kitchen zone.
   flags(art,(720,192,1343,575),'iron:3','limestone:2','limestone:3')
   rug(art,(799,278,1007,539),'textiles-teal')
   rug(art,(443,543,608,713),'textiles-russet',False)
   flags(art,(96,768,815,1007),'limestone:3','iron:3','limestone:3',96)
   for p in ['435,346 467,346 467,400 480,400 480,466 451,466 451,425 435,425','704,630 737,630 737,773 714,793 704,793','370,848 440,848 440,863 487,863 487,881 419,881 419,865 370,865']:
    poly(art,'iron:3',p)
  elif look=='temple':
   flags(art,(552,144,839,311),'mud:5','sandstone:2','sandstone:3')
   # Warm marble altar precinct, with a sandstone nave and a quiet brass inlay.
   flags(art,(96,432,863,1007),'sandstone:3','sandstone:2','mud:5',96)
   for b in [(192,480,719,528),(192,912,719,960),(192,528,240,912),(672,528,720,912)]:box(art,'mud:5',b)
   for b in [(245,536,665,540),(245,898,665,902)]:box(art,'sandstone:2',b)
   rug(art,(920,179,1068,305),'textiles-sage',False)
   for p in ['970,363 1004,363 1004,415 1026,415 1026,478 1011,478 1011,437 986,437 986,392 970,392','1092,405 1120,405 1120,518 1097,518','746,517 790,517 790,538 832,538 832,554 762,554']:
    poly(art,'sandstone:2',p)
  else:
   flags(art,(168,240,672,431),'dark-masonry:4','dark-masonry:5','lichen:3')
   flags(art,(864,864,1415,911),'dark-masonry:4','dark-masonry:5','dark-masonry:4')
   rug(art,(748,206,894,275),'sanctum-cloth',False)
   # Broad mineral residue at the chamber perimeter, separate from ritual circle.
   for p in ['217,641 232,641 232,784 261,784 261,831 237,831 217,804','322,853 590,853 590,870 335,870','1104,486 1130,486 1130,583 1114,583']:
    poly(art,'dark-masonry:4',p)
 elif look=='manor':
  art=F.fill_pattern(im.size,Image.open(BASE/'canon/surfaces/manor-floor.png'))
  # The source's functional zones: study/hall, kitchen/service, dining,
  # sleeping alcove and stone entrance/armoury.
  boards(art,(144,162,527,1079));boards(art,(528,264,719,367))
  boards(art,(720,162,1079,365));rug(art,(769,263,1024,310),'textiles-teal',False)
  flags(art,(1080,162,1824,529),'sandstone:3','sandstone:2','mud:5')
  flags(art,(1344,530,1824,865),'grey-brown-rock:3','mud:4','mud:5')
  boards(art,(336,456,959,681));rug(art,(400,566,592,624),'textiles-sage',False)
  rug(art,(700,561,900,624),'textiles-teal',False)
  boards(art,(336,700,959,1060));rug(art,(504,728,867,847),'textiles-russet')
  rug(art,(504,919,867,1038),'textiles-sage')
  boards(art,(1080,552,1331,792));rug(art,(1082,574,1238,632),'textiles-russet',False)
  flags(art,(960,866,1247,1080),'marble:2','marble:3','marble:2')
  flags(art,(1248,902,1824,1080),'grey-brown-rock:3','mud:4','grey-brown-rock:4')
  rug(art,(185,291,314,422),'textiles-sage')
  # Source runners remain in their original L-shaped gallery.
  for p in MAPS[F.CURRENT].get('rugs',[]):R.rug(art,p)
 else:return im
 # Individually placed slab wear follows joints and differs at each location.
 # Coordinates name native stone cells, never a random scatter or repeated stamp.
 if look in ('keep','temple','crypt'):
  rr={'keep':('limestone:2','iron:3'),'temple':('sandstone:2','mud:5'),'crypt':('dark-masonry:4','lichen:3')}[look]
  marks={'keep':[(240,288,24,14),(432,384,30,18),(576,480,19,12),(720,240,33,17),(1056,288,27,21),(1248,240,22,13),(768,480,29,16),(1104,528,21,20),(480,768,35,18),(576,864,26,24),(384,912,31,15),(720,960,23,17)],
  'temple':[(432,240,22,14),(624,240,31,17),(768,192,26,21),(960,384,28,13),(1152,432,34,18),(1296,576,24,23),(480,432,32,17),(192,576,25,19),(336,864,28,22),(576,960,33,18),(720,864,24,16),(480,768,31,24)],
  'crypt':[(192,240,23,17),(336,288,32,15),(576,192,27,22),(816,336,31,19),(1200,288,24,21),(1344,480,29,18),(1200,576,33,21),(288,768,25,19),(480,816,32,18),(624,672,21,22),(912,864,30,17),(1248,816,26,23)]}[look]
  for x,y,w,h in marks:
   poly(art,rr[0],f'{x},{y} {x+w},{y} {x+w},{y+3} {x+w-8},{y+3} {x+w-8},{y+6} {x+7},{y+6} {x+7},{y+h} {x+3},{y+h} {x+3},{y+h+8} {x},{y+h+8}')
   line(art,rr[1],f'{x+8},{y+7} {x+w-9},{y+7}',2)
 # Wall-foot dirt is a continuous contact area, not repeated stamps.
 if look not in ('cave_rock','manor'):
  d=ImageDraw.Draw(art);mp=mask.load();r={'keep':'limestone:2','temple':'sandstone:2','crypt':'dark-masonry:4'}[look]
  for x in range(im.width):
   prev=False
   for y in range(im.height):
    cur=bool(mp[x,y])
    if cur and not prev:d.line((x,y,x,min(y+4,im.height-1)),fill=c(*r.split(':')[:1],int(r.split(':')[1])))
    prev=cur
 im.paste(art,(0,0),mask);return im

def manor_wall(im,mask):
 # A continuous plaster face and timber dado replace repeated window panels.
 # Preserve the supplied wall-mask landmarks; simplify the treatment of stubs.
 wall=Image.open(BASE/'canon/surfaces/manor-wall.png').copy()
 box(wall,'plaster:2',(0,48,143,79));box(wall,'timber:2',(0,80,143,94))
 line(wall,'timber:3','0,79 143,79',1);line(wall,'timber:1','0,95 143,95',1)
 line(wall,'plaster:1','0,48 143,48',2)
 line(wall,'plaster:1','0,49 143,49',1)
 # Local temporary strip consumed by the standard native wall projection.
 target=BASE/'canon/surfaces/manor-wall.png';old=target.read_bytes();wall.save(target)
 try:im=R.original_walls(im,mask,'manor')
 finally:target.write_bytes(old)
 return im

def outcrop(im,p):
 q=F.path(p);x=min(a for a,b in q);u=max(a for a,b in q);y=min(b for a,b in q);v=max(b for a,b in q)
 # Wall-style rock mass: broad crown, 48-pixel front, same native rock surface
 # as the surrounding cave. Footprint centres stay at the original islands.
 shape=[(x+12,y-30),(x+36,y-45),(u-28,y-41),(u-5,y-22),(u+1,v-15),(u-15,v+4),(x+20,v+1),(x-3,v-19),(x,y-4)]
 mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(shape,fill=255)
 wall=Image.open(BASE/'canon/surfaces/cave_rock-wall.png').convert('RGBA')
 top=wall.crop((0,8,144,48)).convert('RGBA')
 colourmap={tuple(bytes.fromhex(c('grey-brown-rock',1)[1:])):tuple(bytes.fromhex(c('grey-brown-rock',2)[1:])),tuple(bytes.fromhex(c('grey-brown-rock',2)[1:])):tuple(bytes.fromhex(c('grey-brown-rock',3)[1:])),tuple(bytes.fromhex(c('mud',3)[1:])):tuple(bytes.fromhex(c('mud',5)[1:]))}
 top.putdata([(*colourmap.get(p[:3],p[:3]),p[3]) for p in top.get_flattened_data()])
 art=F.fill_pattern(im.size,top)
 d=ImageDraw.Draw(art);front=[(x+2,v-50),(x+22,v-43),(u-18,v-46),(u,v-57),(u,v-15),(u-15,v+4),(x+20,v+1),(x-3,v-19)]
 fm=Image.new('L',im.size);ImageDraw.Draw(fm).polygon(front,fill=255)
 face=F.fill_pattern(im.size,wall.crop((0,48,144,95)));art.paste(face,(0,0),fm)
 d=ImageDraw.Draw(art)
 d.line([(x+12,y-29),(x+36,y-44),(u-28,y-40),(u-8,y-22)],fill=c('grey-brown-rock',4),width=2)
 d.line([(x+2,v-50),(x+22,v-43),(u-18,v-46),(u,v-57)],fill=c('grey-brown-rock',3),width=2)
 d.line([(x-3,v-19),(x+20,v+1),(u-15,v+4),(u,v-15)],fill=c('grey-brown-rock',1),width=1)
 # Two broad planes and connected mineral clefts follow this crown's shape.
 for pp in [f'{x+36},{y-43} {x+31},{y-22} {x+42},{y-11} {x+38},{v-51}',f'{u-30},{y-38} {u-36},{y-15} {u-27},{y+3} {u-33},{v-49}']:
  line(art,'grey-brown-rock:2',pp,2)
 line(art,'grey-brown-rock:4',f'{x+15},{y-26} {x+35},{y-39} {x+59},{y-35}',2)
 im.paste(art,(0,0),mask)

def yard(im,mask):
 art=canvas(im.size,'yard-grass:3')
 # Broad turf banks around paths and a tended herb garden; no tiled grass stamp.
 for p in ['0,0 1967,0 1967,32 1728,32 1728,49 1440,49 1440,30 1104,30 1104,51 720,51 720,29 336,29 336,48 0,48','0,180 62,180 62,420 83,420 83,735 57,735 57,971 80,971 80,1247 0,1247','1880,70 1967,70 1967,1247 1872,1247 1872,1120 1903,1120 1903,795 1889,795']:
  poly(art,'yard-grass:4',p)
 # A path encircles the house and joins the southern entrance, with larger calm
 # verges rather than repeating blades/camouflage texture.
 for b in [(87,104,120,1159),(87,1133,1847,1163),(1844,120,1876,1163),(960,1100,1055,1247)]:box(art,'yard-path:3',b)
 for pp in ['92,324 115,324 115,542','91,865 116,865 116,1014','270,1140 534,1140','1173,1156 1448,1156','1852,320 1852,570']:
  line(art,'yard-path:4',pp,3)
 # Kitchen herb beds along the east side, a bench and a well west of the house.
 for b in [(1890,255,1948,395),(1890,437,1948,601),(1890,650,1948,817)]:
  framed(art,b,'timber',2);x,y,u,v=b
  box(art,'mud:4',(x+4,y+4,u-4,v-4))
  for xx,yy,w,h in [(x+12,y+13,16,22),(x+31,y+45,13,29),(x+10,y+81,21,24)]:
   poly(art,'overgrowth:3',f'{xx},{yy} {xx+w},{yy} {xx+w},{yy+h} {xx+4},{yy+h} {xx+4},{yy+8} {xx},{yy+8}')
   line(art,'overgrowth:4',f'{xx+5},{yy+3} {xx+5},{yy+h-4}',2)
 # Well and water bucket, authored in high 3/4 without a side face.
 framed(art,(23,572,75,607),'yard-cobble',2);box(art,'sewer-water:2',(30,579,68,591))
 for xx in (27,69):box(art,'timber:2',(xx,541,xx+4,590))
 line(art,'timber:4','26,542 74,542',4);line(art,'iron:3','51,545 51,585',2)
 framed(art,(35,605,65,621),'yard-cobble',3)
 # Garden bench on the north path and compost/tool corner, each unique.
 framed(art,(1492,41,1601,57),'wood-oak',3)
 for xx in (1500,1590):box(art,'wood-oak:1',(xx,58,xx+5,68))
 for pp in ['1718,1178 1782,1178 1782,1208 1718,1208','1740,1170 1764,1170 1764,1176 1740,1176']:
  poly(art,'mud:4',pp)
 # Preserve house and wall band; yard exists only beyond the exterior silhouette.
 outer=Image.new('1',im.size);d=ImageDraw.Draw(outer);p=F.path(MAPS[F.CURRENT]['outline']);d.polygon(p,fill=1);d.line(p+[p[0]],fill=1,width=40)
 im.paste(art,(0,0),outer.convert('L').point(lambda v: 0 if v else 255));return im

def walls(im,mask,look):
 R.FLOOR_MASK=mask
 if F.CURRENT=='station_lab':return S.walls(im,mask,look)
 im=ground(im,mask,look)
 for p in MAPS[F.CURRENT].get('pools',[]):F.pool(im,p)
 if look=='manor':
  im=yard(im,mask);im=manor_wall(im,mask)
 else:im=R.original_walls(im,mask,look)
 if look=='cave_rock':
  for p in MAPS[F.CURRENT]['holes']:outcrop(im,p)
 return im

# Coin profiles are deliberately different in width, stack height, and overlap.
def coin(im,x,y,w=11,h=5,r='loot-gold'):
 poly(im,r+':2',f'{x+2},{y} {x+w-2},{y} {x+w},{y+2} {x+w},{y+h} {x+w-2},{y+h+2} {x+2},{y+h+2} {x},{y+h} {x},{y+2}')
 box(im,r+':4',(x+1,y+2,x+w-1,y+h));line(im,r+':6',f'{x+2},{y+1} {x+w-2},{y+1}',1)
 line(im,r+':5',f'{x+2},{y+h} {x+w-2},{y+h}',1)

def goblet(im,x,y,w=17):
 T.goblet(im,x,y,w)
 # Its highlights are loot gold, distinct from the bronze mound below.
 line(im,'loot-gold:6',f'{x-w//2+2},{y+1} {x+w//2-2},{y+1}',1)
 line(im,'loot-gold:5',f'{x-w//2+2},{y+3} {x-w//2+2},{y+6} {x-3},{y+10}',2)
 line(im,'loot-gold:5',f'{x},{y+12} {x},{y+22}',2)

def hoard(im,bounds):
 x,y,u,v=map(F.at,bounds);f=new(u-x+1,v-y+1)
 poly(f,'hoard-bronze:2','10,198 10,162 22,162 22,130 38,130 38,91 61,91 61,59 91,59 91,29 117,29 117,14 151,14 151,27 180,27 180,53 205,53 205,91 224,91 224,132 244,132 244,186 254,186 254,218 225,234 43,234 10,215')
 poly(f,'hoard-bronze:3','16,195 26,160 48,136 44,108 71,81 69,66 100,44 125,20 148,20 166,40 197,62 193,102 218,115 219,157 239,181 246,213 221,225 44,226 16,211')
 # Coin banks have stepped shoulders; no rectangular cargo forms in the heap.
 for p in ['30,171 54,151 84,149 101,168 97,198 69,215 36,206','70,86 96,64 131,67 149,91 138,119 100,126 75,109','144,116 172,95 204,105 218,131 211,158 180,173 148,152','107,172 130,155 162,161 180,185 174,213 142,224 110,205']:
  poly(f,'hoard-bronze:4',p)
 rows=[(31,[(123,13,5),(140,11,8)]),(48,[(101,12,7),(119,15,5),(145,12,6),(163,10,8)]),(68,[(80,13,6),(98,11,9),(117,13,6),(150,15,5),(180,12,7)]),(90,[(64,11,7),(84,14,5),(106,10,8),(130,13,6),(164,12,7),(188,15,6)]),(116,[(44,13,7),(65,11,6),(91,14,8),(117,13,5),(151,12,9),(184,11,7),(207,10,6)]),(141,[(34,12,6),(55,14,8),(80,13,7),(105,11,6),(139,14,7),(162,11,8),(188,13,5),(221,12,6)]),(167,[(26,11,8),(48,13,6),(71,12,7),(96,15,5),(123,13,8),(150,11,7),(178,15,5),(205,12,7),(231,10,6)]),(192,[(21,13,6),(45,11,8),(67,15,5),(94,12,7),(120,11,6),(146,14,8),(171,11,7),(197,13,5),(222,12,8)]),(215,[(38,11,6),(59,14,7),(85,10,5),(107,13,7),(133,11,6),(156,14,5),(180,13,6),(207,15,7)])]
 for yy,row in rows:
  for xx,w,h in row:
   coin(f,xx-3,yy+5,w-2,4,'hoard-bronze')
   coin(f,xx+4,yy+8,w-3,4,'hoard-bronze')
   coin(f,xx,yy,w,h)
   if w>=13:coin(f,xx+2,yy-4,w-4,4)
 for xx,yy,w in [(76,118,18),(153,69,21),(195,177,16),(46,191,15),(115,197,17)]:goblet(f,xx,yy,w)
 # A chased crown supplies a distinct treasure silhouette among the vessels.
 poly(f,'hoard-bronze:1','179,74 183,82 189,77 196,84 204,75 203,98 180,98')
 poly(f,'loot-gold:4','181,79 184,86 189,81 196,88 202,81 201,96 182,96')
 line(f,'loot-gold:6','183,92 200,92',2)
 for xx in (185,191,197):box(f,'textiles-teal:4',(xx,94,xx+2,96))
 # A broad chased platter interrupts the coin rhythm, with visible rim and bowl.
 S.platter(f,158,136,37);line(f,'loot-gold:6','166,137 188,137',2)
 fx=F.at(448)-x;fy=F.at(1280)-y;brazier(f,fx,fy)
 im.alpha_composite(f,(x,y));return [fx+x,fy+y]

def breach(im,points):
 xy=[(F.at(x),F.at(y)) for x,y in points];d=ImageDraw.Draw(im)
 # Wide undercut cavity follows the original spine; banks vary independently.
 top=[(144,660),(176,657),(195,679),(227,675),(250,682),(282,671),(306,650),(332,651),(350,662),(378,672),(405,623),(431,607),(468,608),(500,632),(526,660),(563,689),(595,681),(627,680),(657,654),(690,642),(712,605),(746,611),(772,624),(816,642)]
 bottom=[(144,721),(176,733),(197,747),(232,751),(260,737),(285,733),(316,723),(342,718),(366,740),(391,722),(420,680),(448,666),(473,674),(500,695),(524,718),(551,750),(580,756),(608,746),(641,739),(668,721),(697,704),(722,670),(747,665),(779,688),(816,686)]
 d.polygon(top+bottom[::-1],fill=c('breach-stone',1))
 # Deep north face, with exposed vertical fractures.
 inner=[(x,y+17+(i%3)*3) for i,(x,y) in enumerate(top)]
 d.polygon(top+inner[::-1],fill=c('sandstone',2));d.line(top,fill=c('sandstone',4),width=2)
 for i in range(1,len(top)-1,2):
  x,y=top[i];line(im,'sandstone:1',f'{x},{y+2} {x},{y+14} {x+4},{y+14} {x+4},{y+21}',2)
 # Disconnected ember pools light the cavity floor, leaving dark void visible.
 for p in ['151,704 184,708 213,724 243,723 259,713 280,714 251,735 218,738 188,722 151,717','300,701 330,688 354,695 377,704 391,693 411,658 437,644 463,644 451,657 425,674 401,714 377,726 352,710 329,703','480,659 507,675 527,700 558,728 586,728 614,716 637,709 626,729 594,743 562,744 533,727 508,699','648,690 680,672 709,638 733,635 754,642 779,659 807,667 807,676 775,671 749,654 728,650 711,657 693,683 664,702']:
  poly(im,'lair-breach:4',p)
 for pp in ['159,709 181,714 214,731 239,731','397,699 419,666 438,653 456,653','539,722 564,735 583,735 608,725','682,685 713,647 731,643 750,649']:
  line(im,'lair-breach:6',pp,3)
 d.line(bottom,fill=c('sandstone',3),width=4)
 for x,y,w,h in [(166,651,27,15),(249,669,24,18),(323,638,35,19),(425,593,31,17),(502,617,25,18),(588,673,35,18),(698,599,30,21),(764,608,33,19),(279,734,25,14),(472,685,29,14),(632,744,26,17)]:S.shard(im,x,y,w,h)
 x,y=xy[-1];framed(im,(x-14,y-59,x+14,y-13),'breach-stone',3);box(im,'lair-breach:1',(x-8,y-54,x+8,y-17));line(im,'lair-breach:6',f'{x},{y-50} {x},{y-39} {x-3},{y-39} {x-3},{y-29} {x+2},{y-29} {x+2},{y-20}',3)
 return [x,y-35]

COUNTS={}
def variant(name,idx):
 im=F.sprite(name).copy()
 if name in ('bones','crypt-study'):
  im=new(48,48)
  if name=='crypt-study' and idx%3==0:
   framed(im,(5,19,43,40),'dark-masonry',3);box(im,'dark-masonry:5',(6,20,42,25));line(im,'dark-masonry:2','10,29 37,29',2)
   line(im,'bone:3',f'{12+idx%5},23 {30+idx%6},23',3)
  else:
   # Different anatomies at the source bone-pile centres: rib fan, pelvis,
   # vertebral run and long bones. No repeated skull stencil.
   x=10+idx%4*3;y=13+idx%3*4
   for off,ln in [(0,15),(5,19),(10,14)]:
    line(im,'bone:2',f'{x},{y+off} {x+ln},{y+off} {x+ln+3},{y+off+4}',3)
    line(im,'bone:4',f'{x+1},{y+off} {x+ln},{y+off}',1)
   line(im,'bone:3',f'{x+3},{y-4} {x+3},{y+17}',3)
   for xx,yy,w in [(5,37,16),(29,33,11)]:
    line(im,'bone:2',f'{xx},{yy} {xx+w},{yy-3}',3);line(im,'bone:4',f'{xx},{yy-1} {xx+w},{yy-4}',1)
 elif name=='chair':
  # Source dining seats remain numerous; varied upholstery and grain break stamps.
  a=list(im.get_flattened_data());old=[tuple(bytes.fromhex(c('textiles-sage',k)[1:])) for k in range(1,7)];r=['textiles-sage','textiles-teal','textiles-russet'][idx%3]
  lut={p:tuple(bytes.fromhex(c(r,k+1)[1:])) for k,p in enumerate(old)}
  im.putdata([(*lut.get(p[:3],p[:3]),p[3]) for p in a]);line(im,'wood-oak:4',f'{12+idx%8},40 {18+idx%8},40',1)
 elif name in ('rubble','boulder','stalagmite'):
  # Preserve source positions with individual plane cuts and silhouettes.
  d=ImageDraw.Draw(im);w=13+idx%5*3;x=24;y=26
  if name=='rubble':
   im=new(48,48)
   for xx,yy,ww,hh in [(4,22,15+idx%4,9),(22,13,19,14+idx%3),(26,34,16+idx%3,8)]:
    poly(im,'grey-brown-rock:1',f'{xx},{yy+3} {xx+3},{yy} {xx+ww-4},{yy} {xx+ww},{yy+4} {xx+ww-2},{yy+hh} {xx+2},{yy+hh}')
    poly(im,'grey-brown-rock:3',f'{xx+1},{yy+3} {xx+4},{yy+1} {xx+ww-5},{yy+1} {xx+ww-1},{yy+4} {xx+ww-4},{yy+hh-3} {xx+3},{yy+hh-3}')
    line(im,'grey-brown-rock:4',f'{xx+4},{yy+1} {xx+ww-5},{yy+1}',1)
  elif name=='boulder':
   im=new(48,48);poly(im,'grey-brown-rock:1',f'5,21 12,10 {24+idx%5},7 40,19 43,32 34,42 14,42 5,33');poly(im,'grey-brown-rock:3',f'7,21 14,12 {24+idx%5},9 38,20 32,27 16,29');poly(im,'grey-brown-rock:2','16,30 32,28 40,22 40,32 33,39 16,39');line(im,'grey-brown-rock:4',f'14,12 {24+idx%5},9 34,16',1)
  else:line(im,'grey-brown-rock:3',f'{20+idx%5},18 {16+idx%4},32 {27+idx%5},36',2)
 return im

def place(im,name,xy,records,group='reference'):
 key=(F.CURRENT,name);idx=COUNTS.get(key,0);COUNTS[key]=idx+1
 if F.CURRENT!='station_lab' and name in ('bones','crypt-study','chair','rubble','boulder','stalagmite'):
  pic=variant(name,idx);x,y=map(F.at,xy);im.alpha_composite(pic,(x-24,y-24));records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-24,y-24,x+24,y+24],group=group,variant=idx));return
 if F.CURRENT=='manor-ground' and name.startswith('door-'):
  # Door fronts face the viewer along horizontal walls; narrow transverse
  # openings are reserved for the source's vertical partitions.
  vertical={(384,640),(384,904),(1280,944),(1664,1072),(1472,624),(1408,448),(1984,560),(1792,816),(1280,1328)}
  R.opening(im,name[5:],xy,records,tuple(xy) in vertical);return
 R.place(im,name,xy,records,group)
 if F.CURRENT=='manor-ground':
  x,y=map(F.at,xy)
  if name=='hearth':
   # Different mantle vessels, firebox soot and storage read as individual hearths.
   px=x-23+idx%4*9
   framed(im,(px,y-52,px+8,y-41),'plaster',3)
   line(im,'wood-oak:2',f'{x-14},{y-1} {x+idx%8},{y-1}',2)
  elif name=='table-short' and tuple(xy) in {(1088,328),(1216,328)}:
   # Study desks keep their anchors; books and writing tools cover dinnerware.
   box(im,'wood-oak:5',(x-33,y-11,x+34,y+1))
   framed(im,(x-22,y-12,x-4,y+1),'textiles-teal',3)
   box(im,'bone:4',(x+7,y-12,x+25,y));line(im,'iron:3',f'{x+10},{y-8} {x+21},{y-8}',1)
   line(im,'iron:3',f'{x+10},{y-4} {x+17},{y-4}',1)
  elif name=='bed':
   r=['textiles-sage','textiles-teal','textiles-russet'][idx%3]
   box(im,r+':3',(x-13,y-13,x+13,y+15));line(im,r+':4',f'{x-12},{y-12} {x+12},{y-12}',2)
   line(im,r+':2',f'{x-5},{y-7} {x-5},{y+11} {x+8},{y+11}',2)


def approach(im,kind):
 if kind=='hoard':
  # Treasure trail increases toward the chamber. Crate sits on floor beside hearth.
  im.alpha_composite(F.sprite('crate'),(580,471))
  for x,y,w,h in [(557,632,12,6),(565,657,15,7),(551,732,11,7),(574,749,14,6),(525,784,15,6),(493,801,12,7)]:coin(im,x,y,w,h,'hoard-bronze')
  goblet(im,563,754,15)
 elif kind=='breach':
  for x,y,w,h in [(1051,407,18,10),(1042,468,23,14),(1024,525,31,17),(972,553,37,20),(872,554,43,24)]:
   S.shard(im,x,y,w,h,'sandstone');line(im,'breach-stone:2',f'{x-8},{y+8} {x-17},{y+8} {x-17},{y+20} {x-26},{y+20}',3)
 else:S.approach(im,'sanctum-crypt')

def inset(im,kind):
 approach(im,kind);b=F_ORIG_INSET(im,kind)
 if kind=='hoard':
  x,y,u,v=b;floor=Image.open(BASE/'canon/surfaces/keep-floor.png');im.paste(floor.crop((0,0,168,104)),(x+12,y+28))
  for xx,yy,w,h in [(31,96,11,6),(49,103,15,5),(69,94,13,6),(95,110,12,7),(112,101,14,5),(135,115,13,6)]:coin(im,x+xx,y+yy,w,h,'hoard-bronze')
  brazier(im,x+129,y+57,True);line(im,'hoard-bronze:3',f'{x+28},{y+83} {x+65},{y+83} {x+65},{y+89}',3)
 return b
F_ORIG_INSET=F.broken_inset


def run():
 S.install();F.path=T.path;F.draw_walls=walls;F.place=place;F.feature_hoard=hoard;F.feature_breach=breach;F.feature_sanctum=T.sanctum;F.broken_inset=inset
 # Restore straight octagonal corner cuts from the operator's chamber ruling.
 cfg=MAPS['breach-temple'];cfg['outline']=cfg['outline'].replace('1184,1088 1168,1152 1136,1216 1088,1280 1024,1328 960,1360 896,1384 416,1384 352,1368 288,1336 224,1296 176,1248 128,1184 96,1120','1184,1120 920,1384 360,1384 96,1120').replace('96,800 112,736 144,672 192,608 240,560 288,528 352,496 416,488','96,752 360,488 416,488')
 # Close the top-left notch while retaining the stairwell block footprint.
 m=MAPS['manor-ground'];m['holes'][0]='704,216 960,216 960,352 704,352'
 m['holes']=[p.replace('1904,192 2000,192','1904,216 2000,216') for p in m['holes']]
 # Tie the source partition stubs into the same wall plan, with source doors
 # reopening them afterward. No source object anchor changes.
 m['holes']+=['448,544 1280,544 1280,608 448,608','448,880 1296,880 1296,928 448,928','1792,944 1824,944 1824,1136 1792,1136','1728,1184 1792,1184 1792,1280 1728,1280','1984,1136 2048,1136 2048,1184 1984,1184','1536,1104 1664,1104 1664,1160 1536,1160']
 F.run()
 # Remove the legacy floating coin overlay, using the freshly drawn wall/mass
 # layer at exactly the old overlay's coordinates, without altering the wall.
 p=BASE/'frames/hoard-keep.png';im=Image.open(p).convert('RGBA');surf=Image.open(REVIEW/'D-hoard-keep-surface.png')
 for sx,sy,ww in [(640,112,12),(688,140,9),(720,160,7),(736,172,8),(672,188,14),(648,208,10),(704,232,9)]:
  x,y=round(sx*.75),round(sy*.75);b=(x-ww//2,y-2,x+ww//2+1,y+4);im.paste(surf.crop(b),b[:2])
 save_frame(im,'hoard-keep')
 # Preserve the accepted lab byte-for-byte, including its review companions.
 for p in (REVIEW/'D4-start/frames').glob('station_lab*.png'):shutil.copyfile(p,BASE/'frames'/p.name)
 manifest=json.loads((BASE/'frames/layout.json').read_text());old=json.loads((REVIEW/'D4-start/frames/layout.json').read_text());manifest['station_lab']=old['station_lab'];(BASE/'frames/layout.json').write_text(json.dumps(manifest,indent=2)+'\n')

def save_frame(im,name):
 p=BASE/'frames';im.save(p/f'{name}.png');im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST).save(p/f'{name}-2x.png');g=im.convert('L').convert('RGBA');g.save(p/f'{name}-grey.png');g.resize((im.width//4,im.height//4),Image.Resampling.NEAREST).save(p/f'{name}-squint.png')
if __name__=='__main__':run()
