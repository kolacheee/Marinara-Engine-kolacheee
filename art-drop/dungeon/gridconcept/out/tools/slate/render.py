# Render the keep lair from the block-out by rule, using pieces cut from the slate paint (one hand, exact grid).
import random
from PIL import Image, ImageStat, ImageDraw
from collections import Counter
N='/home/kolache/Downloads/marinara-art-dungeon-run/keeplair/slate'; K=N+'/..'; C=48
src=Image.open(f'{N}/empty-r.png').convert('RGB')
b=Image.open(f'{K}/keep-lair-base-clean.png').convert('RGB')
COL={(30,28,27):'V',(46,42,40):'T',(200,190,170):'F',(150,134,112):'.'}
def cls(x,y):
  if not(0<=x<31 and 0<=y<23): return 'V'
  return Counter(COL.get(b.getpixel((x*C+i,y*C+j)),'?') for i in range(4,44,8) for j in range(4,44,8)).most_common(1)[0][0]
VOID=(25,22,33)
def plainest(cells):
  return min(cells,key=lambda c: sum(ImageStat.Stat(src.crop((c[0]*C,c[1]*C,c[0]*C+C,c[1]*C+C))).stddev))
slate_c=plainest([(x,y) for x in range(9,14) for y in range(8,14)]); earth_c=plainest([(x,y) for x in range(16,23) for y in range(6,11)])
SLATE=src.crop((slate_c[0]*C,slate_c[1]*C,slate_c[0]*C+C,slate_c[1]*C+C)); EARTH=src.crop((earth_c[0]*C,earth_c[1]*C,earth_c[0]*C+C,earth_c[1]*C+C))
FACE=[src.crop((912,100,960,148)),src.crop((960,100,1008,148))]
ARCH=src.crop((1040,100,1088,148)); NICHE=src.crop((1140,100,1188,148))
RIB_V=src.crop((428,400,446,448))          # vertical stone ribbon, floor side on the right
RIB_H=src.crop((840,562,888,580))          # horizontal stone ribbon (south wall), floor side on top
DECALS=[src.crop((572,356,604,380)),src.crop((484,434,522,462)),src.crop((1060,250,1100,278))]
DOOR_SIDE=src.crop((442,336,458,386)); DOOR_LOCK=src.crop((414,230,440,280)); DOOR_FRONT=src.crop((520,716,584,770))
STAIRS=src.crop((376,238,416,286))
HEAP=src.crop((128,772,364,892))
out=Image.new('RGB',b.size,VOID); random.seed(7)
DOORS={(8,4):'lock',(8,6):'side',(14,6):'side',(24,7):'side',(12,15):'front'}; STAIR_CELLS={(7,4),(26,6)}
camp=lambda x,y: 9<=x<=13 and 6<=y<=14
for y in range(23):
  for x in range(31):
    c=cls(x,y); X,Y=x*C,y*C
    if c=='.':
      out.paste(EARTH if camp(x,y) else SLATE,(X,Y))
      if random.random()<0.10 and (x,y) not in DOORS and (x,y) not in STAIR_CELLS:
        dcl=random.choice(DECALS); L=dcl.convert('L'); med=sorted(L.getdata())[len(L.getdata())//2]
        msk=L.point(lambda v:255 if v<med-22 else 0)
        base=EARTH if camp(x,y) else SLATE; tint=Image.new('RGB',dcl.size,tuple(max(0,int(c*0.72)) for c in base.getpixel((C//2,C//2))))
        out.paste(tint,(X+random.randint(2,C-2-dcl.width),Y+random.randint(2,C-2-dcl.height)),msk)
    elif c=='F':
      r=random.random(); out.paste(ARCH if r<0.12 else NICHE if r<0.2 else FACE[(x+y)%2],(X,Y))
# ribbons inside wall-top cells along floor edges
for y in range(23):
  for x in range(31):
    if cls(x,y) not in 'VT': continue
    X,Y=x*C,y*C
    if cls(x+1,y)=='.': out.paste(RIB_V,(X+C-RIB_V.width,Y))
    if cls(x-1,y)=='.': out.paste(RIB_V.transpose(Image.Transpose.FLIP_LEFT_RIGHT),(X,Y))
    if cls(x,y-1) in '.': out.paste(RIB_H,(X,Y))
# doors and stairs
for (x,y),kind in DOORS.items():
  X,Y=x*C,y*C
  if kind=='front': out.paste(FACE[0],(X,Y)); out.paste(DOOR_FRONT.resize((44,C),Image.LANCZOS),(X+2,Y))
  else:
    out.paste(SLATE if not camp(x,y) else EARTH,(X,Y)); d=DOOR_LOCK if kind=='lock' else DOOR_SIDE
    out.paste(d,(X+(C-d.width)//2,Y+(C-d.height)//2))
for (x,y) in STAIR_CELLS: out.paste(STAIRS.resize((C,C),Image.LANCZOS),(x*C,y*C))
# hoard heap on its cells
hx0,hy0,hx1,hy1=3*C,16*C,8*C,20*C
sc=(hx1-hx0)/HEAP.width; h=HEAP.resize((hx1-hx0,round(HEAP.height*sc)),Image.LANCZOS); hy0=hy1-h.height; hm=Image.new('L',h.size,0)
hp=h.load(); mp=hm.load()
for j in range(h.height):
  for i in range(h.width):
    r_,g_,b_=hp[i,j]
    if r_>150 and r_-b_>60: mp[i,j]=255
out.paste(h,(hx0,hy0),hm)
out.save(f'{N}/room.png'); print('slate cell',slate_c,'earth cell',earth_c)
