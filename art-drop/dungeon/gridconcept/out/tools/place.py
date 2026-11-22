# Cut the prop sheet, place every prop flush against its wall on exact cells, measure the gaps.
import sys, json
from PIL import Image, ImageDraw
from collections import Counter
K='/home/kolache/Downloads/marinara-art-dungeon-run/keeplair'; C=48
room=Image.open(sys.argv[1]).convert('RGB'); out=sys.argv[2]
# ---- block-out classes
b=Image.open(f'{K}/keep-lair-base-clean.png').convert('RGB')
COL={(30,28,27):'V',(46,42,40):'T',(200,190,170):'F',(150,134,112):'.'}
def cls(x,y):
  if not(0<=x<31 and 0<=y<23): return 'V'
  return Counter(COL.get(b.getpixel((x*C+i,y*C+j)),'?') for i in range(4,44,8) for j in range(4,44,8)).most_common(1)[0][0]
WALL=lambda x,y: cls(x,y) in 'VTF'
# ---- sprites from the sheet (6x4 slots, magenta key)
sh=Image.open(f'{K}/props.png').convert('RGB'); SW,SH=sh.size
def sprite(slot):
  i=slot-1; c,r=i%6,i//6; box=(c*SW//6,r*SH//4,(c+1)*SW//6,(r+1)*SH//4); im=sh.crop(box).convert('RGBA'); px=im.load()
  for y in range(im.height):
    for x in range(im.width):
      R,G,B,_=px[x,y]
      if R>150 and B>150 and G<110 and abs(R-B)<90: px[x,y]=(0,0,0,0)
  return im.crop(im.getbbox())
# ---- plan: (slot, cell x, cell y, anchor, wcells, maxh)
N,T=42,84
plan=[
 (1,5,4,'N',1,T),(2,5,5,'W',1,N),(3,6,6,'S',1,N),                       # stairwell
 (4,10,3,'N',1,T),(5,12,3,'N',1,N),(6,13,3,'NE',1,N),(7,13,4,'E',1,N),  # store
 (4,10,6,'N',1,T),(8,11,6,'N',2,T),(9,9,9,'W',1,44),(9,9,10,'W',1,44),(3,9,12,'W',1,N),(10,9,14,'WS',1,N),
 (3,13,8,'E',1,N),(5,13,9,'E',1,N),(7,13,11,'E',1,N),(2,13,13,'E',1,N),(21,13,14,"ES",1,30),(22,10,14,'S',1,N),   # camp
 (11,19,3,'N',1,T),(12,21,3,'N',1,N),(14,22,3,'N',1,30),(1,23,3,'N',1,T),(22,25,3,'N',1,N),(3,27,3,'N',1,N),(11,28,3,'NE',1,T),
 (15,17,2,'N',1,T),(13,28,4,'E',1,N),(3,15,3,'NW',1,N),(5,15,4,'W',1,N),(14,15,8,'W',1,30),(12,15,9,'W',1,N),(13,15,10,'W',1,N),(1,15,11,'W',1,T),
 (22,19,11,'S',1,N),(7,20,11,'S',1,N),(13,21,11,'S',1,N),(3,23,11,'S',1,N),(23,24,11,'SE',1,32),(7,24,10,'E',1,N),(3,17,12,'E',1,N),(5,17,14,'E',1,N),  # hall
 (1,26,8,'ES',1,T),(3,25,8,'S',1,N),                                      # back stair
 (3,2,15,'NW',1,N),(7,3,15,'N',1,N),(4,5,15,'N',1,T),(6,7,15,'N',1,N),(5,8,15,'N',1,N),(22,14,15,'N',1,N),
 (1,17,16,'E',1,T),(3,17,17,'E',1,N),(5,16,19,"E",1,N),(5,2,16,'W',1,N),(7,2,19,'W',1,N),
 (6,4,20,'S',1,N),(5,6,20,'S',1,N),(3,9,20,'S',1,N),(14,11,20,'S',1,30),(2,13,20,'S',1,N),(10,15,20,'SE',1,N),  # hoard room
]
setpieces=[(16,21,6,2,2)]   # nest: slot, x, y, w, h cells (open middle)
hung=[(17,6,3),(18,7,3),(17,9,2),(20,11,2),(18,13,2),(17,9,5),(24,13,5),(17,20,2),(18,22,2),(19,24,2),(17,26,2),(18,27,2),
      (17,16,1),(17,18,1),(18,15,2),(17,25,5),(17,3,14),(18,7,14),(17,9,15),(18,11,15),(17,13,15)]
HMAX={17:(18,30),18:(22,34),19:(12,30),20:(34,18),24:(16,28)}
cache={}
def fit(slot,tw,th):
  k=(slot,tw,th)
  if k not in cache:
    s=sprite(slot); sc=min(tw/s.width,th/s.height); w,h=max(1,round(s.width*sc)),max(1,round(s.height*sc))
    r=s.resize((w,h),Image.LANCZOS); a=r.split()[3].point(lambda v:255 if v>=128 else 0); r.putalpha(a); cache[k]=r
  return cache[k]
canvas=room.copy(); sh_d=ImageDraw.Draw(canvas,'RGBA'); report=[]; bad=[]
def shadow(x,y,w):
  sh_d.ellipse([x+2,y-3,x+w-2,y+3],fill=(0,0,0,70))
def put(spr,x,y,shade=True):
  if shade: shadow(x,y+spr.height,spr.width)
  canvas.paste(spr,(x,y),spr)
for slot,cx,cy,anc,wc,mh in plan:
  if cls(cx,cy)!='.' : bad.append(('not floor',slot,cx,cy))
  for a,(dx,dy) in {'N':(0,-1),'S':(0,1),'W':(-1,0),'E':(1,0)}.items():
    if a in anc and not WALL(cx+dx,cy+dy): bad.append(('no wall',a,slot,cx,cy))
  s=fit(slot,wc*C-(2 if mh>=84 else 6),mh); x0,y0=cx*C,cy*C
  x=x0+(wc*C-s.width)//2; y=y0+(C-s.height)//2
  if 'W' in anc: x=x0
  if 'E' in anc: x=x0+wc*C-s.width
  if 'S' in anc: y=y0+C-s.height
  if 'N' in anc: y=y0 if s.height<=C-2 else y0+C-2-s.height
  put(s,x,y)
  gaps={}
  if 'N' in anc: gaps['N']=y-y0
  if 'S' in anc: gaps['S']=(y0+C)-(y+s.height)
  if 'W' in anc: gaps['W']=x-x0
  if 'E' in anc: gaps['E']=(x0+wc*C)-(x+s.width)
  report.append({'slot':slot,'cell':[cx,cy],'anchor':anc,'size':[s.width,s.height],'gap_px':gaps})
for slot,cx,cy,wc,hc in setpieces:
  s=fit(slot,wc*C-6,hc*C-6); put(s,cx*C+(wc*C-s.width)//2,cy*C+(hc*C-s.height)//2)
for slot,cx,cy in hung:
  if cls(cx,cy)!='F': bad.append(('hung not on face',slot,cx,cy))
  tw,th=HMAX[slot]; s=fit(slot,tw,th); x=cx*C+(C-s.width)//2; y=cy*C+8+(40-s.height)//2
  put(s,x,y,shade=False)
  if y<cy*C+8 or y+s.height>cy*C+C: bad.append(('hung off face',slot,cx,cy))
canvas.save(out); canvas.resize((canvas.width*2,canvas.height*2),Image.NEAREST).save(out.replace('.png','-2x.png'))
json.dump({'props':report,'problems':bad},open(out.replace('.png','-placement.json'),'w'),indent=1)
mx=max(max(r['gap_px'].values(),default=0) for r in report)
print('props',len(report),'set pieces',len(setpieces),'hung',len(hung),'max gap px',mx,'problems',bad)
