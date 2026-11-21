"""Round seven: scoped native drawings over the retained scene composer."""
import json
from PIL import Image,ImageDraw,ImageChops
import d6_scene as D6
import d6_caves as C
import d_frames as F
from d_layouts import MAPS
from draw_proofs import BASE,REVIEW,c
from redraw_critic21 import canvas,poly,line,box
from d4_caves import rgba
from d_sprites import new
from d4_scene import save_frame

OLDGROUND=D6.ground
OLDPLACE=D6.place
OLDYARD=D6.yard
OLDOUTCROP=D6.outcrop
COUNTS={}

# Each entry is a separate anatomical drawing, not a modulo-five stamp.
REMAINS=[('ribs',7,12,23,22,False),('skull',9,7,23,22,False),('leg',5,8,31,30,False),('skull',13,10,19,18,True),('ribs',11,6,21,29,True),('jaw',8,16,30,17,False),('pelvis',9,12,26,22,False),('leg',12,5,24,35,True),('ribs',6,16,29,19,False),('skull',7,14,26,19,True),('jaw',14,8,22,26,True),('pelvis',5,17,32,18,True),('leg',6,16,34,21,False),('skull',15,5,18,27,False),('ribs',13,12,20,24,False),('jaw',5,10,34,23,False)]

def remains(idx):
 kind,x,y,w,h,flip=REMAINS[idx];im=new(48,48)
 if kind=='skull':
  # Asymmetric cranium, cheek, zygomatic arch and broken mandibular angle.
  poly(im,'bone:1',f'{x+4},{y} {x+w-7},{y} {x+w-2},{y+4} {x+w},{y+9} {x+w-1},{y+h-7} {x+w-5},{y+h-4} {x+w-5},{y+h} {x+5},{y+h} {x+2},{y+h-5} {x},{y+h-6} {x},{y+7}')
  poly(im,'bone:3',f'{x+5},{y+2} {x+w-8},{y+2} {x+w-4},{y+5} {x+w-2},{y+10} {x+w-4},{y+h-9} {x+w-8},{y+h-7} {x+5},{y+h-5} {x+2},{y+10}')
  line(im,'bone:4',f'{x+5},{y+3} {x+w-9},{y+3} {x+w-5},{y+6}',2)
  poly(im,'bone:1',f'{x+w-11},{y+9} {x+w-6},{y+8} {x+w-4},{y+11} {x+w-5},{y+15} {x+w-10},{y+16} {x+w-12},{y+13}')
  line(im,'bone:2',f'{x+3},{y+12} {x+6},{y+15} {x+6},{y+18}',2)
  line(im,'bone:3',f'{x+7},{y+h-2} {x+w-7},{y+h-2} {x+w-5},{y+h-5}',2)
  # Each skull has a different missing vault or jaw section.
  if idx==3:box(im,'bone:1',(x+5,y+3,x+8,y+7));line(im,'bone:2',f'{x+8},{y+6} {x+12},{y+10}',2)
  if idx==9:box(im,'bone:2',(x+w-10,y+3,x+w-7,y+8));line(im,'bone:1',f'{x+5},{y+h-2} {x+9},{y+h-2}',3)
  if idx==13:line(im,'bone:1',f'{x+4},{y+8} {x+9},{y+12} {x+9},{y+17}',2)
 elif kind=='ribs':
  # Rib lengths diminish towards the pelvis; broken free ends vary by drawing.
  for j in range(4 if idx in (0,14) else 3):
   yy=y+j*6;ww=w-j*3
   line(im,'bone:2',f'{x+2},{yy+7} {x},{yy+3} {x+4},{yy} {x+ww-5},{yy} {x+ww},{yy+4} {x+ww-1},{yy+8}',4)
   line(im,'bone:4',f'{x+3},{yy+2} {x+6},{yy+1} {x+ww-6},{yy+1}',2)
  line(im,'bone:1',f'{x+9},{y} {x+11},{y+10} {x+9},{y+h}',4)
  line(im,'bone:3',f'{x+8},{y+1} {x+10},{y+10} {x+8},{y+h}',2)
 elif kind=='pelvis':
  poly(im,'bone:2',f'{x},{y+3} {x+6},{y} {x+w//2},{y+7} {x+w-6},{y} {x+w},{y+3} {x+w-1},{y+h-5} {x+w-8},{y+h} {x+w//2},{y+h-6} {x+7},{y+h} {x+1},{y+h-5}')
  for a,b in [(x+4,y+5),(x+w-11,y+7)]:
   poly(im,'bone:4',f'{a},{b} {a+4},{b-2} {a+7},{b+1} {a+6},{b+5} {a+2},{b+7} {a},{b+4}')
   line(im,'bone:1',f'{a+2},{b+1} {a+4},{b+3}',3)
  line(im,'bone:3',f'{x+w//2},{y+8} {x+w//2},{y+h-7}',3)
 elif kind=='jaw':
  line(im,'bone:1',f'{x},{y} {x+2},{y+h-7} {x+8},{y+h} {x+w-7},{y+h-1} {x+w},{y+h-8} {x+w},{y+3}',5)
  line(im,'bone:3',f'{x},{y} {x+3},{y+h-8} {x+9},{y+h-3} {x+w-8},{y+h-4} {x+w-3},{y+h-9} {x+w-2},{y+3}',3)
  for a,bb in [(x+7,y+h-7),(x+12,y+h-6),(x+18,y+h-7)]:box(im,'bone:4',(a,bb,a+2,bb+3))
 else:
  poly(im,'bone:2',f'{x},{y+3} {x+4},{y} {x+8},{y+2} {x+9},{y+7} {x+w-8},{y+h-9} {x+w-3},{y+h-10} {x+w},{y+h-6} {x+w-2},{y+h} {x+w-8},{y+h} {x+w-10},{y+h-5} {x+5},{y+10} {x+1},{y+9}')
  line(im,'bone:4',f'{x+3},{y+3} {x+6},{y+5} {x+6},{y+8} {x+w-8},{y+h-5}',2)
  line(im,'bone:3',f'{x+3},{y+h-3} {x+9},{y+h-8} {x+15},{y+h-9}',4)
 # A distinct retained ulna/fibula fragment reinforces each anchor silhouette.
 fragments=[(6,39,19,36),(29,37,39,30),(8,37,17,42),(5,29,9,40),(27,39,41,36),(29,8,38,13),(6,38,20,42),(4,29,9,38),(33,7,39,17),(34,36,42,30),(5,31,10,40),(11,8,24,6),(7,7,23,9),(4,33,9,42),(5,7,10,15),(15,39,31,41)]
 a,b,u,v=fragments[idx];line(im,'bone:2',f'{a},{b+2} {u},{v+2}',4);line(im,'bone:4',f'{a},{b} {u},{v}',2)
 if flip:im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 return im

def place(im,name,xy,records,group='reference'):
 if name in ('bones','crypt-study'):
  idx=COUNTS.get(F.CURRENT,0);COUNTS[F.CURRENT]=idx+1
  x,y=map(F.at,xy);pic=remains(idx);im.alpha_composite(pic,(x-24,y-24))
  records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-24,y-24,x+24,y+24],group=group,variant=idx));return
 return OLDPLACE(im,name,xy,records,group)

def ground(im,mask,look):
 im=OLDGROUND(im,mask,look)
 if look!='keep':return im
 # Restore the exact paving beneath the rejected three ochre polygons.
 art=im.copy();D6.M.pattern_into(art,(401,767,615,1005),D6.M.stone('keep'))
 route=Image.new('L',im.size)
 d=ImageDraw.Draw(route)
 # One tapered route; its joints and mineral edges survive the wear mapping.
 d.polygon([(415,774),(438,780),(453,801),(472,818),(484,844),(507,868),(523,881),(540,902),(551,925),(571,944),(587,969),(598,989),(584,997),(566,975),(549,955),(528,939),(520,919),(500,901),(489,883),(470,863),(458,841),(437,821),(425,803),(410,792)],fill=255)
 a=art.load();m=route.load()
 for y in range(767,1006):
  for x in range(401,616):
   if m[x,y] and a[x,y]==rgba('limestone:3'):a[x,y]=rgba('grey-brown-rock:3')
 # Abrasion follows the individual stones: broad surviving mineral islands
 # cut into both sides of the route, leaving an unequal width and broken edge.
 erasures=Image.new('L',im.size);ed=ImageDraw.Draw(erasures)
 for q in [[(410,779),(424,782),(431,794),(428,803),(422,798)],[(440,793),(455,804),(469,819),(459,824),(451,816),(449,807)],[(432,815),(445,821),(450,832),(449,841),(440,834)],[(469,830),(484,843),(493,858),(485,864),(478,853)],[(456,851),(470,857),(479,871),(477,880),(468,873)],[(499,867),(516,880),(523,894),(516,897),(508,886),(503,885)],[(490,888),(503,900),(507,913),(501,916),(494,904)],[(532,904),(543,919),(550,932),(544,937),(535,926),(535,919)],[(522,929),(535,936),(539,946),(536,954),(529,947)],[(561,942),(574,952),(584,969),(575,972),(568,961)],[(549,956),(563,970),(569,984),(563,983),(554,973)],[(585,975),(600,987),(603,996),(593,994),(588,987)]]:
  ed.polygon(q,fill=255)
 e=erasures.load()
 for y in range(767,1006):
  for x in range(401,616):
   if e[x,y] and a[x,y]==rgba('grey-brown-rock:3'):a[x,y]=rgba('limestone:3')
 # Individual scuffed arrises stay attached to actual flag joints, not stamps.
 for p in ['431,791 437,791 437,801 443,801 443,807','478,839 483,839 483,849 489,849','502,883 509,883 509,891 517,891','545,938 552,938 552,947','576,979 582,979 582,987']:
  line(art,'limestone:3',p,3)
 clip=Image.new('L',im.size);ImageDraw.Draw(clip).rectangle((401,767,615,1005),fill=255)
 im.paste(art,(0,0),ImageChops.multiply(mask,clip));return im

def outcrop(im,p):
 OLDOUTCROP(im,p)
 q=F.path(p);x=min(a for a,b in q);u=max(a for a,b in q);y=min(b for a,b in q);v=max(b for a,b in q)
 if u-x>120:return
 # NW bed rises 34 pixels: a single crown over a much darker front, with
 # vertical fracture joints and a continuous one-pixel contact at the foot.
 crown=[(x+8,y-23),(x+24,y-34),(u-23,y-34),(u-8,y-24),(u,y-11),(u-5,y+1),(u-22,y+10),(x+20,y+9),(x+3,y-1)]
 front=[(x+3,y-1),(x+20,y+9),(u-22,y+10),(u-5,y+1),(u,y-11),(u,y+20),(u-14,v),(x+17,v),(x,y+20)]
 ImageDraw.Draw(im).polygon(front,fill=c('grey-brown-rock',2))
 ImageDraw.Draw(im).polygon(crown,fill=c('grey-brown-rock',4))
 line(im,'grey-brown-rock:5',f'{x+9},{y-23} {x+25},{y-32} {u-24},{y-32}',1)
 poly(im,'grey-brown-rock:3',f'{x+20},{y+9} {x+35},{y+1} {u-23},{y+2} {u-22},{y+10}')
 for a,b,xx in [(x+20,y+10,x+17),(x+45,y+10,x+49),(u-16,y+7,u-19)]:
  line(im,'grey-brown-rock:1',f'{a},{b} {a},{v-12} {xx},{v-7} {xx},{v}',2)
  line(im,'grey-brown-rock:3',f'{a+3},{b+2} {a+3},{v-13}',2)
 line(im,'grey-brown-rock:2',f'{x+31},{y-28} {x+31},{y-17} {x+39},{y-9} {x+37},{y+3}',2)
 line(im,'grey-brown-rock:1',f'{x},{y+20} {x+17},{v} {u-14},{v} {u},{y+20}',1)


def path_wear(im):
 # Compacted longitudinal soil beds follow foot/cart traffic. Their widths,
 # interruptions and edge contacts are individually drawn for each stretch.
 for p in [
 '1848,145 1853,145 1853,179 1858,190 1858,223 1854,234 1854,275 1858,287 1858,316 1853,325 1848,325 1848,296 1851,282 1851,242 1846,231 1846,190 1848,178',
 '1860,352 1868,352 1868,388 1871,402 1871,433 1867,446 1867,482 1862,495 1857,495 1857,466 1862,451 1862,410 1858,399 1858,369',
 '1848,522 1854,522 1854,553 1859,569 1859,603 1854,620 1854,650 1848,665 1845,659 1845,626 1849,610 1849,574 1846,558',
 '1861,696 1867,690 1871,701 1871,741 1867,755 1867,782 1862,800 1858,800 1858,773 1862,759 1862,728 1858,716',
 '1849,835 1856,835 1856,867 1860,878 1860,914 1854,930 1854,963 1848,976 1844,969 1847,951 1847,925 1851,908 1851,886 1846,872',
 '1860,1008 1866,1008 1866,1045 1870,1056 1870,1087 1865,1104 1861,1118 1854,1118 1857,1094 1861,1082 1861,1060 1857,1048 1857,1023',
 '105,174 111,174 111,210 107,224 107,258 111,274 111,310 106,322 100,322 100,294 104,278 104,245 99,229 99,204',
 '97,386 103,386 108,402 108,437 104,451 104,488 109,507 109,533 103,533 99,516 99,481 102,461 102,437 97,422',
 '109,575 115,575 115,612 111,626 111,663 115,677 115,712 110,725 104,725 104,700 109,683 109,645 105,632 105,599',
 '98,765 104,765 104,800 109,812 109,848 103,862 103,895 98,910 94,901 94,875 99,858 99,824 95,811',
 '108,958 114,958 114,991 109,1007 109,1043 113,1055 113,1096 108,1106 103,1106 103,1077 107,1061 107,1026 102,1010 102,985',
 '143,1144 186,1144 199,1148 241,1148 256,1144 301,1144 316,1147 356,1147 356,1153 316,1153 301,1150 257,1150 241,1155 201,1155 185,1150 143,1150',
 '397,1154 431,1154 446,1149 493,1149 507,1152 546,1152 558,1148 599,1148 599,1154 560,1154 546,1158 509,1158 494,1155 448,1155 433,1160 397,1160',
 '650,1144 690,1144 702,1148 746,1148 759,1144 804,1144 821,1148 860,1148 860,1154 823,1154 804,1150 761,1150 748,1155 704,1155 690,1150 650,1150',
 '1126,1148 1162,1148 1179,1144 1221,1144 1234,1148 1271,1148 1285,1145 1329,1145 1329,1151 1287,1151 1273,1155 1235,1155 1221,1151 1182,1151 1164,1155 1126,1155',
 '1375,1153 1418,1153 1431,1148 1476,1148 1490,1153 1532,1153 1548,1149 1591,1149 1591,1156 1550,1156 1533,1159 1489,1159 1476,1155 1433,1155 1419,1160 1375,1160',
 '1630,1144 1674,1144 1687,1149 1725,1149 1739,1145 1784,1145 1799,1148 1823,1148 1823,1154 1798,1154 1784,1151 1742,1151 1727,1155 1688,1155 1672,1151 1630,1151']:
  poly(im,'yard-path:3',p)
 return im


def yard(im,mask):
 im=OLDYARD(im,mask)
 # Registered overworld soil grain is cropped from the opaque centre of a
 # straight source segment. Only soil pixels enter the path material.
 source=Image.open('art-drop/dungeon/reference/overworld-path_joined-0.png').convert('RGBA')
 # Distinct native columns supply long worn bands; transparent source pixels
 # are ignored rather than converted into dark X-shaped atlas silhouettes.
 pathcolors={rgba('yard-path:'+str(i)) for i in (2,3,4)}
 pix=im.load();soil=source.load()
 for y in range(im.height):
  for x in range(im.width):
   if pix[x,y] in pathcolors:
    pix[x,y]=rgba('yard-path:4')
 # Four stretches of turf use different strips from the native overworld crop.
 grass=Image.open('art-drop/dungeon/reference/overworld-grass-0.png').convert('RGB');gp=grass.load()
 for y in range(im.height):
  for x in range(im.width):
   if pix[x,y] in {rgba('yard-grass:3'),rgba('yard-grass:4')}:
    sx=(x+(y//288)*67)%288;sy=(y+(x//288)*43)%288
    pix[x,y]=rgba('yard-grass:4' if gp[sx,sy][0]>=111 else 'yard-grass:3')
 # Long connected edge erosion, with unequal bends and shoulders.
 patches=[('1841,143 1849,143 1849,211 1854,211 1854,249 1851,249 1851,293 1845,293 1845,314 1840,314', 'yard-path:3'),('1867,337 1878,337 1878,482 1871,482 1871,459 1867,459 1867,421 1870,421 1870,379 1867,379','yard-path:3'),('1840,584 1848,584 1848,622 1853,622 1853,673 1849,673 1849,719 1841,719','yard-path:3'),('1867,802 1878,802 1878,993 1872,993 1872,954 1867,954 1867,908 1870,908 1870,855 1867,855','yard-path:3'),('1841,1027 1850,1027 1850,1064 1856,1064 1856,1118 1840,1129','yard-path:3'),('120,1134 321,1134 321,1140 286,1140 286,1145 218,1145 218,1142 163,1142 163,1139 120,1139','yard-path:3'),('398,1159 431,1159 431,1154 504,1154 504,1158 568,1158 568,1166 398,1166','yard-path:3'),('711,1134 911,1134 911,1140 863,1140 863,1145 802,1145 802,1141 749,1141 749,1139 711,1139','yard-path:3'),('1062,1161 1111,1161 1111,1156 1187,1156 1187,1159 1231,1159 1231,1166 1062,1166','yard-path:3'),('1390,1134 1609,1134 1609,1141 1562,1141 1562,1145 1509,1145 1509,1141 1441,1141 1441,1138 1390,1138','yard-path:3')]
 for p,col in patches:poly(im,col,p)
 # Unequal compacted soil pockets: each little facet is placed once along
 # the walked margin, with connected clusters and no isolated grit pixels.
 for x,y,w,h in [(96,191,8,3),(109,332,5,6),(93,468,9,4),(108,607,6,3),(101,737,11,4),(93,864,7,5),(111,1003,5,4),(1852,163,9,3),(1860,283,5,6),(1851,398,11,4),(1862,522,6,5),(1853,761,7,3),(1860,843,10,4),(1851,990,5,7),(1863,1091,6,3),(161,1149,12,3),(373,1144,7,5),(628,1153,9,4),(943,1147,6,3),(1290,1152,13,4),(1517,1147,8,5),(1743,1154,5,4)]:
  poly(im,'yard-path:3',f'{x},{y+1} {x+2},{y} {x+w-2},{y} {x+w},{y+2} {x+w-1},{y+h} {x+1},{y+h}')
 # Grass grows into selected shallow soil bays as connected turf, not glyphs.
 for p in ['1874,356 1881,356 1881,385 1873,385 1873,374 1869,374 1869,365 1874,365','1835,649 1844,649 1844,665 1848,665 1848,679 1840,679','1869,889 1882,889 1882,920 1875,920 1875,907 1868,907','196,1129 243,1129 243,1138 223,1138 223,1141 211,1141 211,1136 196,1136','819,1129 857,1129 857,1137 844,1137 844,1142 832,1142 832,1136 819,1136','1120,1163 1135,1163 1135,1159 1152,1159 1152,1171 1120,1171']:
  poly(im,'yard-grass:3',p)
 # Replace the whole second bed interior, retaining its rim. Four rooted herb
 # masses overlap broad lower leaves; every crown has its own silhouette.
 box(im,'mud:2',(1891,441,1946,599))
 plants=[(1896,449,27,27),(1915,483,28,35),(1894,526,34,28),(1910,560,31,33)]
 for idx,(x,y,w,h) in enumerate(plants):
  poly(im,'overgrowth:1',f'{x+4},{y+h-5} {x+w-5},{y+h-5} {x+w},{y+h} {x+w-2},{y+h+4} {x+2},{y+h+4} {x},{y+h}')
  poly(im,'overgrowth:2',f'{x},{y+8} {x+5},{y+3} {x+11},{y+5} {x+14},{y} {x+w-5},{y+2} {x+w},{y+9} {x+w-3},{y+17} {x+w},{y+h-5} {x+w-8},{y+h} {x+7},{y+h-1} {x+2},{y+h-7} {x+4},{y+18}')
  poly(im,'overgrowth:3',f'{x+2},{y+9} {x+7},{y+6} {x+14},{y+10} {x+11},{y+18} {x+6},{y+20} {x+3},{y+16}')
  poly(im,'overgrowth:3',f'{x+16},{y+4} {x+w-5},{y+5} {x+w-2},{y+10} {x+w-6},{y+18} {x+13},{y+15} {x+12},{y+10}')
  poly(im,'overgrowth:3',f'{x+8},{y+21} {x+15},{y+18} {x+w-5},{y+21} {x+w-4},{y+h-5} {x+13},{y+h-2} {x+6},{y+h-7}')
  line(im,'overgrowth:4',f'{x+5},{y+9} {x+8},{y+8} {x+12},{y+12}',2)
  line(im,'overgrowth:4',f'{x+17},{y+7} {x+w-7},{y+7} {x+w-4},{y+11}',2)
  line(im,'overgrowth:2',f'{x+13},{y+20} {x+16},{y+h-5}',2)
 path_wear(im)
 from check_proofs import components
 from collections import Counter
 for _ in range(3):
  changes=0
  for fragment in components(im)[0]:
   if fragment['colour'] not in {rgba('yard-grass:3'),rgba('yard-grass:4'),rgba('yard-path:3'),rgba('yard-path:4')}:continue
   px=im.load();near=[]
   for x,y in fragment['points']:
    for u,v in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
     if 0<=u<im.width and 0<=v<im.height and px[u,v]!=fragment['colour']:near.append(px[u,v])
   if near:
    col=Counter(near).most_common(1)[0][0]
    for x,y in fragment['points']:px[x,y]=col;changes+=1
  if not changes:break

 return im


def run():
 import d7_caves
 C.cave_scene=d7_caves.cave_scene
 D6.ground=ground;D6.place=place;D6.outcrop=outcrop;D6.yard=yard
 D6.run()
 # Retain unrelated pixels in the failed frames. Only reviewed bone footprints
 # change in temple/crypt; keep adds the reviewed route and manor the yard.
 layout=json.loads((BASE/'frames/layout.json').read_text())
 for n in ['hoard-keep','breach-temple','sanctum-crypt','manor-ground']:
  rendered=Image.open(BASE/f'frames/{n}.png').convert('RGBA')
  old=Image.open(REVIEW/f'D7-start/frames/{n}.png').convert('RGBA')
  if n=='manor-ground':
   # Yard changes are outside the whole outer wall; preserve the first garden.
   for b in [(0,0,1968,120),(0,120,127,1134),(1838,120,1968,1134),(0,1134,1968,1248)]:old.paste(rendered.crop(b),b[:2])
   b=(1888,243,1949,407);old.paste(Image.open(REVIEW/f'D7-start/frames/{n}.png').crop(b),b[:2])
  else:
   for o in layout[n]['objects']:
    if o['item'] in ('bones','crypt-study'):
     b=tuple(o['bounds']);old.paste(rendered.crop(b),b[:2])
   if n=='hoard-keep':b=(401,767,616,1006);old.paste(rendered.crop(b),b[:2])
  save_frame(old,n)
 # The source manifest itself is accepted evidence, not a newly needed asset.
 (BASE/'frames/layout.json').write_bytes((REVIEW/'D7-start/frames/layout.json').read_bytes())
 for p in (REVIEW/'D7-start/frames').glob('station_lab*.png'):(BASE/'frames'/p.name).write_bytes(p.read_bytes())

if __name__=='__main__':run()
