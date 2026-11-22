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
sh=Image.open(f'{K}/slate/props.png').convert('RGB'); SW,SH=sh.size
def sprite(slot):
  i=slot-1; c,r=i%6,i//6; box=(c*SW//6,r*SH//4,(c+1)*SW//6,(r+1)*SH//4); im=sh.crop(box).convert('RGBA'); px=im.load()
  for y in range(im.height):
    for x in range(im.width):
      R,G,B,_=px[x,y]
      if R>150 and B>150 and G<110 and abs(R-B)<90: px[x,y]=(0,0,0,0)
  return im.crop(im.getbbox())
# ---- plan: (slot, cell x, cell y, anchor, wcells, maxh)
N,T=34,64
plan=[
 (1,5,4,'N',1,T),(2,5,5,'W',1,N),(3,6,6,'S',1,N),                       # stairwell
 (4,10,3,'N',1,T),(5,12,3,'N',1,N),(6,13,3,'NE',1,N),(7,13,4,'E',1,N),  # store
 (4,10,6,'N',1,T),(8,11,6,'N',2,T),(9,9,9,'W',1,44),(9,9,10,'W',1,44),(3,9,12,'W',1,N),(10,9,14,'WS',1,N),
 (3,13,8,'E',1,N),(5,13,9,'E',1,N),(7,13,11,'E',1,N),(2,13,13,'E',1,N),(21,13,14,"ES",1,30),(22,10,14,'S',1,N),   # camp
 (11,19,3,'N',1,T),(12,21,3,'N',1,N),(14,22,3,'N',1,30),(1,23,3,'N',1,T),(22,25,3,'N',1,N),(3,27,3,'N',1,N),(11,28,3,'NE',1,T),
 (15,17,2,'N',1,44),(20,28,4,'E',1,N),(3,15,3,'NW',1,N),(5,15,4,'W',1,N),(14,15,8,'W',1,30),(12,15,9,'W',1,N),(13,15,10,'W',1,N),(1,15,11,'W',1,T),
 (22,19,11,'S',1,N),(7,20,11,'S',1,N),(13,21,11,'S',1,N),(3,23,11,'S',1,N),(23,24,11,'SE',1,32),(7,24,10,'E',1,N),(3,17,12,'E',1,N),(5,17,14,'E',1,N),  # hall
 (1,26,7,'E',1,T),(3,26,8,'S',1,N),                                      # back stair
 (3,2,15,'NW',1,N),(7,3,15,'N',1,N),(4,5,15,'N',1,T),(6,7,15,'N',1,N),(5,8,15,'N',1,N),(22,14,15,'N',1,N),
 (1,17,16,'E',1,T),(3,17,17,'E',1,N),(5,16,19,"E",1,N),(5,2,16,'W',1,N),(7,2,19,'W',1,N),
 (6,4,20,'S',1,N),(5,6,20,'S',1,N),(3,9,20,'S',1,N),(24,11,20,'S',1,24),(2,13,20,'S',1,N),(10,15,20,'SE',1,N),  # hoard room
]
setpieces=[(16,21,6,2,2)]   # nest: slot, x, y, w, h cells (open middle)
hung=[(17,6,3),(18,7,3),(17,9,2),(18,11,2),(18,13,2),(17,9,5),(17,13,5),(17,20,2),(18,22,2),(19,24,2),(17,26,2),(18,27,2),
      (17,16,1),(17,18,1),(18,15,2),(17,25,5),(17,3,14),(18,7,14),(17,9,15),(18,11,15),(17,13,15)]
HMAX={17:(14,26),18:(18,20),19:(10,26)}
cache={}
def fit(slot,tw,th):
  k=(slot,tw,th)
  if k not in cache:
    s=sprite(slot); sc=min(tw/s.width,th/s.height); w,h=max(1,round(s.width*sc)),max(1,round(s.height*sc))
    r=s.resize((w,h),Image.LANCZOS); a=r.split()[3].point(lambda v:255 if v>=128 else 0); r.putalpha(a); cache[k]=r
  return cache[k]
canvas=room.copy(); sh_d=ImageDraw.Draw(canvas,'RGBA'); report=[]; bad=[]
L=room.convert('L')
DEPTH={1:10,4:10,15:16,11:18,14:14,2:18,3:18,5:18,6:16,7:16,8:18,10:14,21:12,22:18,23:16,20:14}
FLAT={9,12,13,24}
def lum_row(cx,cy,i): return sum(L.getpixel((cx*C+x,cy*C+i)) for x in range(12,36))/24
def lum_col(cx,cy,i): return sum(L.getpixel((cx*C+i,cy*C+y)) for y in range(12,36))/24
def floorlvl(cx,cy): return sorted(L.getpixel((cx*C+x,cy*C+y)) for x in range(14,34,4) for y in range(14,34,4))[12]
def edge(cx,cy,side):   # rooms are rendered on the grid: wall edges are the cell boundaries
  return {'N':cy*C,'S':cy*C+C,'W':cx*C,'E':cx*C+C}[side]
def shadow(x,y,w): sh_d.ellipse([x+2,y-3,x+w-2,y+3],fill=(0,0,0,70))
GLOW={17,15,8}
def glow(cx_,cy_,r):
  for k,a in ((r,18),(r*2//3,26),(r//3,34)): sh_d.ellipse([cx_-k,cy_-k,cx_+k,cy_+k],fill=(255,180,80,a))
def put(spr,x,y,shade=True,slot=None):
  if slot in GLOW: glow(x+spr.width//2,y+spr.height//4,18)
  if shade: shadow(x,y+spr.height,spr.width)
  canvas.paste(spr,(x,y),spr)
dbg=[]
for slot,cx,cy,anc,wc,mh in plan:
  if cls(cx,cy)!='.' : bad.append(('not floor',slot,cx,cy))
  for a,(dx,dy) in {'N':(0,-1),'S':(0,1),'W':(-1,0),'E':(1,0)}.items():
    if a in anc and not WALL(cx+dx,cy+dy): bad.append(('no wall',a,slot,cx,cy))
  if 'S' in anc and mh>N: bad.append(('tall on south wall',slot,cx,cy))
  x0,y0=cx*C,cy*C
  lo=edge(cx,cy,'W') if WALL(cx-1,cy) else x0
  hi=edge(cx+wc-1,cy,'E') if WALL(cx+wc,cy) else x0+wc*C
  basey=edge(cx,cy,'N') if 'N' in anc else None
  if basey is not None and mh>N:   # tall pieces may overlap the face but never rise above its top
    mh=min(mh,basey+min(DEPTH.get(slot,20),mh)-((cy-1)*C+10))
  s=fit(slot,min(wc*C-(8 if mh>=64 else 14),hi-lo),mh); h=s.height
  depth=h if (slot in FLAT or mh<=N) else min(DEPTH.get(slot,20),h)   # short pieces: the sprite top is the back edge, so they never cover the face
  x=max(lo,min(x0+(wc*C-s.width)//2,hi-s.width))
  foot=y0+(C+depth)//2          # default: footprint centred in the cell
  rec={'slot':slot,'cell':[cx,cy],'anchor':anc,'size':[s.width,h],'depth':depth}
  if 'N' in anc:
    base=edge(cx,cy,'N'); foot=base+depth; rec['N_base']=base; rec['N_err']=foot-base-depth
  if 'S' in anc:
    se=edge(cx,cy,'S'); foot=se; rec['S_edge']=se; rec['S_gap']=se-foot; rec['S_below_px']=max(0,foot-se)
  if 'W' in anc:
    we=edge(cx,cy,'W'); x=we; rec['W_gap']=x-we
  if 'E' in anc:
    ee=edge(cx+wc-1,cy,'E'); x=ee-s.width; rec['E_gap']=ee-(x+s.width)
  y=foot-h
  # tightest side-wall edge over every cell row the sprite spans
  rows=range(max(0,y//C),min(22,(foot-1)//C)+1)
  if 'E' in anc or WALL(cx+wc,cy):
    ees=[edge(cx+wc-1,r,'E') for r in rows if cls(cx+wc-1,r)=='.' and WALL(cx+wc,r) and (cx+wc-1,r) not in {(7,4),(26,6)}]
    if ees: x=min(x,min(ees)-s.width)
  if 'W' in anc or WALL(cx-1,cy):
    wes=[edge(cx,r,'W') for r in rows if cls(cx,r)=='.' and WALL(cx-1,r) and (cx,r) not in {(7,4),(26,6)}]
    if wes: x=max(x,max(wes))
  if 'E' in anc: rec['E_gap']=min(ees)-(x+s.width) if ees else 0
  if 'W' in anc: rec['W_gap']=x-max(wes) if wes else 0
  rec['foot']=foot
  rec['sprite']=(s,x,y)
  put(s,x,y,slot=slot); report.append(rec); dbg.append((rec,x,y,s.width))
for slot,cx,cy,wc,hc in setpieces:
  s=fit(slot,wc*C-6,hc*C-6); put(s,cx*C+(wc*C-s.width)//2,cy*C+(hc*C-s.height)//2)
for slot,cx,cy in hung:
  if cls(cx,cy)!='F': bad.append(('hung not on face',slot,cx,cy))
  tw,th=HMAX[slot]; s=fit(slot,tw,th); x=cx*C+(C-s.width)//2; y=cy*C+8+(40-s.height)//2
  put(s,x,y,shade=False,slot=slot)
  if y<cy*C+8 or y+s.height>cy*C+C: bad.append(('hung off face',slot,cx,cy))

STAIRS={(7,4),(26,6)}
# ---- occlusion: side walls, south edges and wall tops draw over props; count overlap before restoring
regions=[]
for cy in range(23):
  for cx in range(31):
    c=cls(cx,cy)
    if c in 'VT': regions.append((cx*C,cy*C,cx*C+C,cy*C+C)); continue
    if c!='.': continue
    if WALL(cx,cy+1) and cls(cx,cy+1)!='F': se=edge(cx,cy,'S'); regions.append((cx*C,se,cx*C+C,cy*C+C))
    if (cx,cy) in STAIRS: continue
    if WALL(cx-1,cy): we=edge(cx,cy,'W'); regions.append((cx*C,cy*C,we,cy*C+C))
    if WALL(cx+1,cy): ee=edge(cx,cy,'E'); regions.append((ee,cy*C,cx*C+C,cy*C+C))
cp=canvas.load(); rp=room.load(); over=0; who={}
for (a,b2,c2,d2_) in regions:
  for yy in range(b2,d2_):
    for xx in range(a,c2):
      if cp[xx,yy]!=rp[xx,yy]:
        over+=1; cp[xx,yy]=rp[xx,yy]
        for rec,x,y,w in dbg:
          if x<=xx<x+w and y<=yy<=rec['foot']+3: who[(rec['slot'],tuple(rec['cell']),rec['anchor'])]=who.get((rec['slot'],tuple(rec['cell']),rec['anchor']),0)+1
rs=set()
for (a,b2,c2,d2_) in regions:
  for yy in range(b2,d2_):
    for xx in range(a,c2): rs.add((xx,yy))
spr_over={}
for rec,x,y,w in dbg:
  spr,sx,sy=rec['sprite']; al=spr.split()[3].load(); n=0
  for j in range(spr.height):
    for i in range(spr.width):
      if al[i,j] and (sx+i,sy+j) in rs: n+=1
  if n: spr_over[(rec['slot'],tuple(rec['cell']),rec['anchor'])]=n
  rec['wall_overlap_px']=n; del rec['sprite']
print('sprite pixels over side walls, south edges or wall tops:',sum(spr_over.values()),spr_over)
print('shadow pixels trimmed by the wall pass:',over-sum(spr_over.values()))
d2=canvas.resize((canvas.width*2,canvas.height*2),Image.NEAREST); dd=ImageDraw.Draw(d2)
for rec,x,y,w in dbg:
  if 'N_base' in rec: dd.line([(x*2-4,rec['N_base']*2),(x*2+w*2+4,rec['N_base']*2)],fill=(0,200,255),width=2)
  if 'S_edge' in rec: dd.line([(x*2-4,rec['S_edge']*2),(x*2+w*2+4,rec['S_edge']*2)],fill=(255,40,40),width=2)
  dd.line([(x*2,rec['foot']*2),(x*2+w*2,rec['foot']*2)],fill=(255,230,0),width=2)
d2.save(out.replace('.png','-debug.png'))
canvas.save(out); canvas.resize((canvas.width*2,canvas.height*2),Image.NEAREST).save(out.replace('.png','-2x.png'))
json.dump({'props':report,'problems':bad},open(out.replace('.png','-placement.json'),'w'),indent=1)
mx=max([abs(r.get('N_err',0)) for r in report]+[r.get('S_below_px',0) for r in report]+[abs(r.get('W_gap',0)) for r in report]+[abs(r.get('E_gap',0)) for r in report])
print('props',len(report),'set pieces',len(setpieces),'hung',len(hung),'max gap px',mx,'problems',bad)
