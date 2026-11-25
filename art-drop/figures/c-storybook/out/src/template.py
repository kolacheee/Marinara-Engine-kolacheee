"""Native 32x48 Book of Hours layers. Run from the project folder."""
from pathlib import Path
import json
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT, SCRATCH = ROOT/'out', ROOT/'scratch'
W,H=32,48
DIRECTIONS=('down','left','right','up')
SOURCE={
 'skin':'5c2a2e b8705a e0a582 f6d2b0','hair':'351a26 6b3433 a2573d d48b52',
 'eyes':'241634 5a4ea0 9c94d8','clothA':'1a1640 2c3290 3f55c4 7f9ce8','clothB':'3e2210 8a5418 c88e2a f0cc6a'}
FIXED={'linen':'43352e 9c8c78 d2c3a6 efe4cc','leather':'2e1a14 5e3422 8a5532 b8834e',
 'gold':'4a2a0e a8741a e3b43a fbe79a','horn':'3e2e28 9c8670 d8c8a8 f4ecd8',
 'wood':'2c1a12 5c3a22 8c5e36','garnet':'3a0a1e a01a3c f0607a'}
TARGETS={
 'skin':['6a3036 c98f7c f0c6a8 fde7d4','5e2c2e bf7f66 e8b48f f8d8bb','4f2426 9c5c43 c98b62 e6b58c','3c1c1e 6e3a2a 9a5d3c c48558','2a1418 4d2820 6e3e2a 94603e','233632 4e7466 7fa392 b6d2bf'],
 'hair':dict(zip(['black','brown','chestnut','blond','red','grey','white','lapis'],['16122a 2a2638 423c52 646078','2a1810 50301e 7a4c2e a77448','3a1416 6e2c22 a04a2e cf7a44','5a3a14 a8762c dcae4a f6dc8a','4a1014 8e2420 c8462a f07c3c','3a3446 6e6a72 a09ca2 d2ced0','44404f a8a6b4 dcdae2 fbf8f0','1c1846 353a96 5a6ad0 96aef0'])),
 'eyes':dict(zip(['brown','hazel','green','blue','grey','amber'],['24120c 6a3a1e a8703c','2a2010 7a6a2a b0a050','0e2a1c 2f7a44 74b868','101c46 2e5ab8 78a8f0','222a36 6a7480 aab4be','3a1a06 b0661a f0a83a'])),
 'clothA':dict(zip(['lapis','vermilion','verdigris','murrey'],['1a1640 2c3290 3f55c4 7f9ce8','46101c 962222 d23e2a f58a4e','0e2c2a 1e6458 2f9a7c 7cd0a4','2e0e2a 5e1e4c 8e346e c66a9c'])),
 'clothB':dict(zip(['saffron','rose','azure','ivory'],['3e2210 8a5418 c88e2a f0cc6a','42121e 8e2e44 cc5a6e f2a0a4','102a46 2a6098 4a96cc 9cd2ee','3c2e3a 8e8478 cfc4ae f6f0e0']))}
def ramp(s): return ['#'+c for c in s.split()]
RAMPS={'source':{k:ramp(v) for k,v in SOURCE.items()},'fixed':{k:ramp(v) for k,v in FIXED.items()},'targets':{k:[ramp(v) for v in d] if isinstance(d,list) else {n:ramp(v) for n,v in d.items()} for k,d in TARGETS.items()}}
# The exact supplied ramps are retained; check.py verifies every ink.
PREFIX={'skin':'S','hair':'H','eyes':'E','clothA':'A','clothB':'B','linen':'L','leather':'T','gold':'G','horn':'R','wood':'W','garnet':'J'}
ROLES={PREFIX[n]+str(i):tuple(bytes.fromhex(c[1:]))+(255,) for n,r in (RAMPS['source']|RAMPS['fixed']).items() for i,c in enumerate(r)}
INKS={v for k,v in ROLES.items() if k.endswith('0')}
# All head layers use the same anchors and upper-body translations.
ANCHORS={
 'down':{'head':(11,4,20,14),'neck':(14,15,17,16),'shoulders':{'man':(9,22),'woman':(10,21)},'waist':{'man':(11,20),'woman':(12,19)},'hips':(11,29,20,30),'hands':((8,30,11,33),(20,30,23,33))},
 'left':{'head':(11,4,20,14),'neck':(14,15,17,16),'shoulders':{'man':(12,20),'woman':(13,20)},'waist':{'man':(13,20),'woman':(14,20)},'hips':(13,29,20,30),'hands':((13,30,16,33),)},
 'up':{'head':(11,4,20,14),'neck':(14,15,17,16),'shoulders':{'man':(9,22),'woman':(10,21)},'waist':{'man':(11,20),'woman':(12,19)},'hips':(11,29,20,30),'hands':((8,30,11,33),(20,30,23,33))}}
POSES=({'dy':0,'arms':(0,0),'lift':None,'sway':0}, {'dy':1,'arms':(-1,1),'lift':'right','sway':1}, {'dy':0,'arms':(0,0),'lift':'both','sway':0}, {'dy':1,'arms':(1,-1),'lift':'left','sway':-1})
N4=((1,0),(-1,0),(0,1),(0,-1))
def poly(points):
 im=Image.new('1',(W,H));ImageDraw.Draw(im).polygon(points,fill=1)
 return {(x,y) for y in range(H) for x in range(W) if im.getpixel((x,y))}
def rect(x0,y0,x1,y1): return {(x,y) for y in range(max(0,y0),min(H,y1+1)) for x in range(max(0,x0),min(W,x1+1))}
def move(mask,dx=0,dy=0): return {(x+dx,y+dy) for x,y in mask if 0<=x+dx<W and 0<=y+dy<H}
def border(mask): return {p for p in mask if any((p[0]+dx,p[1]+dy) not in mask for dx,dy in N4)}
def put(c,x,y,r):
 if 0<=x<W and 0<=y<H:c[x,y]=r

def hline(c,x0,x1,y,r):
 for x in range(x0,x1+1):put(c,x,y,r)
def vline(c,x,y0,y1,r):
 for y in range(y0,y1+1):put(c,x,y,r)
def fill_mask(c,mask,r):
 for p in mask:c[p]=r
def contour(c,mask,ink):fill_mask(c,border(mask),ink)
def surface(c,mask,prefix,shade=True,light=True):
 fill_mask(c,mask,prefix+'2')
 # A single narrow flat band on the right of each row.
 for y in sorted({p[1] for p in mask}):
  xs=sorted(x for x,yy in mask if yy==y)
  if shade and len(xs)>3:
   for x in xs[-3:-1]:c[x,y]=prefix+'1'
 if light and mask:
  top=min(y for x,y in mask)
  for x,y in mask:
   if y==top+1 and (x-1,y) in mask and (x,y-1) in mask and x<16:c[x,y]=prefix+'3'
 contour(c,mask,prefix+'0')
def pattern_band(c,mask,y,prefix='B',kind='zigzag',period=4):
 band={p for p in mask if y<=p[1]<=y+1 and p not in border(mask)}
 for x,yy in band:
  c[x,yy]=prefix+('2' if kind=='pearl' else '1')
  if kind=='zigzag':c[x,yy]=prefix+('3' if (x%period in (0,3))==(yy==y) else '2')
  elif kind=='pearl' and x%2==0:c[x,yy]=prefix+'3'
  elif kind=='dentil' and x%2==0 and yy==y:c[x,yy]='G2'
 for x,yy in list(band):
  for edge_y in (y-1,y+2):
   if (x,edge_y) in mask-border(mask):c[x,edge_y]=prefix+'0'
 # Boundary of the band against a different ramp is its own ink.
 for x,yy in band:
  if any(c.get((x+dx,yy+dy),'')[0:1] not in (prefix,'G') for dx,dy in ((-1,0),(1,0))):c[x,yy]=prefix+'0'

def ascii_map(c,text,x,y,legend):
 for j,row in enumerate(text.strip('\n').splitlines()):
  for i,ch in enumerate(row):
   if ch in legend:put(c,x+i,y+j,legend[ch])
def pose(direction,frame):return POSES[frame] if direction=='down' else POSES[0]
def template(body,direction,frame):
 p=pose(direction,frame);dy=p['dy'];a=ANCHORS[direction];sl,sr=a['shoulders'][body];wl,wr=a['waist'][body]
 if direction=='left':torso=poly([(15,16+dy),(18,16+dy),(sr,19+dy),(wr,27),(21,36),(12,36),(wl,27),(sl,19+dy)])
 else:torso=poly([(13,16+dy),(18,16+dy),(sr,19+dy),(wr,26),(21,36),(10,36),(wl,26),(sl,19+dy)])
 hands=[]
 for i,(x0,y0,x1,y1) in enumerate(a['hands']):
  ay=p['arms'][i] if direction=='down' else 0
  hands.append(poly([(x0+1,y0+ay),(x1-1,y0+ay),(x1,y0+1+ay),(x1,y1-1+ay),(x1-1,y1+ay),(x0+1,y1+ay),(x0,y1-1+ay),(x0,y0+1+ay)]))
 return {'torso':torso,'hands':hands,'shoulders':(sl,sr),'waist':(wl,wr),'pose':p}

def body_layer(body,d,f):
 c={};t=template(body,d,f);dy=t['pose']['dy']
 # Long hose-free calves below a linen shift.
 if d=='left':legs=[rect(13,34,15,45),rect(18,34,20,44)]
 else:
  together=t['pose']['lift']=='both';legs=[rect(12+int(together),34,14+int(together),45),rect(17-int(together),34,19-int(together),45)]
 for i,m in enumerate(legs):
  lift=(t['pose']['lift']==('left' if i==0 else 'right'))
  surface(c,{(x,y) for x,y in m if y<=45-int(lift)},'S',light=False)
 draw_shoes(c,d,f)
 surface(c,t['torso'],'L')
 for x in ((13,18) if d!='left' else (15,)):
  vline(c,x,25,34,'L1');put(c,x+1,35,'L1')
 pattern_band(c,t['torso'],33,'L','pearl')
 if d=='left':arms=[poly([(13,21+dy),(16,21+dy),(16,31),(13,31)])]
 else:arms=[poly([(9,22+dy),(12,23+dy),(11,31+t['pose']['arms'][0]),(8,31+t['pose']['arms'][0])]),poly([(19,23+dy),(22,22+dy),(23,31+t['pose']['arms'][1]),(20,31+t['pose']['arms'][1])])]
 for arm,hand in zip(arms,t['hands']):surface(c,arm|hand,'S',light=False)
 # Neck joins the head so its contour does not make a solid dark 4x2 block.
 head=poly([(13,4+dy),(18,4+dy),(20,6+dy),(20,11+dy),(18,13+dy),(17,14+dy),(17,17+dy),(14,17+dy),(14,14+dy),(12,13+dy),(11,11+dy),(11,6+dy)])
 if d=='left':head=poly([(13,4+dy),(18,4+dy),(20,6+dy),(20,11+dy),(18,13+dy),(17,14+dy),(17,17+dy),(14,17+dy),(14,14+dy),(12,13+dy),(11,11+dy),(10,10+dy),(11,9+dy),(11,6+dy)])
 surface(c,head,'S')
 if d=='down':
  ascii_map(c,'..KKKKKK..\n.KlbbbbsK.\nKlbbbbbbsK\nKbbbbbbbsK\nKbbEbbEbsK\nKbbIbbIbsK\nKbbbbsbbsK\nKbbbbbbbsK\n.KbbssbsK.\n..KbbbsK..\n...KbbK...',11,4+dy,{'K':'S0','s':'S1','b':'S2','l':'S3','E':'E0','I':'E1'})
 elif d=='left':
  put(c,13,8+dy,'E0');put(c,13,9+dy,'E1');put(c,12,12+dy,'S1')
 return c

def draw_shoes(c,d,f,boots=False):
 t=pose(d,f);prefix='T'
 if d=='left':
  for x,y in ((18,46),(13,47)):
   m=poly([(x,35 if boots else 44),(x+2,35 if boots else 44),(x+2,y-1),(x+1,y),(x-1,y),(x-2,y-1),(x-1,y-2),(x,y-2)])
   surface(c,m,prefix,light=False)
 else:
  together=t['lift']=='both'
  for i,x in enumerate((12+int(together),17-int(together))):
   end=47-int(t['lift']==('left' if i==0 else 'right'))
   top=35 if boots else (43 if t['lift'] in ('left','right') and t['lift']!=('left' if i==0 else 'right') else 44)
   m=poly([(x,top),(x+2,top),(x+2,end-1),(x+1,end),(x,end-1)])
   surface(c,m,prefix,light=False)

def feature_layer(name,d,f):
 c={};dy=pose(d,f)['dy']
 if name=='elf-ears':
  shapes=[[(5,5),(6,5),(12,8),(12,12),(10,12),(6,8),(5,7)]]
  if d!='left':shapes.append([(31-x,y) for x,y in shapes[0]])
  else:shapes=[[(19,8),(25,5),(26,5),(26,7),(25,8),(21,12),(19,12)]]
  for pts in shapes:surface(c,move(poly(pts),dy=dy),'S')
 else:
  # Bent open crescents: outside the crown, with pale ridges.
  pts=[(9,1),(7,2),(5,5),(5,8),(6,10),(8,11),(10,11),(11,10),(11,8),(9,9),(8,8),(7,6),(8,4),(10,3)]
  masks=[move(poly(pts),dy=dy-1)]
  if d!='left':masks.append(move(poly([(31-x,y) for x,y in pts]),dy=dy-1))
  for m in masks:
   surface(c,m,'R')
   for x,y in m-border(m):
    if y%2==0 and (x-1,y) in m and (x+1,y) in m:c[x,y]='R1'
 return c

def outfit_layer(name,body,d,f):
 c={};t=template(body,d,f);dy=t['pose']['dy'];sway=t['pose']['sway'];sl,sr=t['shoulders'];wl,wr=t['waist'];side=d=='left'
 # All outfit masks share the body's shoulder and waist template.
 if name=='labourer':
  bottom=43 if body=='woman' else 38
  if side:pts=[(15,16+dy),(18,16+dy),(sr+1,19+dy),(wr,26),(22+sway,bottom),(12+sway,bottom-1),(wl,26),(sl-1,19+dy)]
  else:pts=[(13,16+dy),(18,16+dy),(sr+1,19+dy),(wr+1,26),(22+sway,bottom),(9+sway,bottom-1),(wl-1,26),(sl-1,19+dy)]
  if body=='man':
   for i,x in enumerate((13,18) if side else (12,17)):
    if t['pose']['lift']=='both':x+=1 if i==0 else -1
    surface(c,rect(x,32,x+2,44),'B',light=False)
  m=poly(pts)|t['torso'];surface(c,m,'A');pattern_band(c,m,bottom-3,'B')
  for x in ((14,19) if not side else (16,)):
   for y in range(29,bottom-3):
    if (x,y) in m-border(m):c[x,y]='A1'
   put(c,x+1,bottom-4,'A1')
  if body=='woman':
   apron=poly([(wl+1,28),(wr-1,28),(wr,40),(wl,40)])
   surface(c,apron,'B',light=False);pattern_band(c,apron,37,'B','pearl')
  # Rolled sleeves with 2 px repeating cuff bands.
  sleevepts=([(12,18+dy),(16,18+dy),(17,25+dy),(12,25+dy)] if side else [(sl,18+dy),(sl+3,19+dy),(12,25+dy),(7,25+dy)])
  sleeve_masks=[poly(sleevepts)]
  if not side:sleeve_masks.append(poly([(31-x,y) for x,y in sleevepts]))
  for sm in sleeve_masks:surface(c,sm,'A');pattern_band(c,sm,23+dy,'B','pearl')
  belt=rect(wl-1,26,wr+1,28);surface(c,belt,'T',light=False);put(c,15 if not side else 17,27,'G2')
 elif name=='ranger':
  # Cloak splits into two long triangular wings around a leather jerkin.
  draw_shoes(c,d,f,True)
  jerkin=poly([(13,17+dy),(18,17+dy),(21,21+dy),(20,37),(11,37),(10,21+dy)]) if not side else poly([(15,17+dy),(18,17+dy),(21,21+dy),(21,36),(12,36),(12,21+dy)])
  jerkin |= t['torso'];surface(c,jerkin,'T');
  for y in (22,25,31):
   for x in range(13,19):
    if (x,y) in jerkin-border(jerkin):c[x,y]='T1'
  if side:
   cloak=poly([(18,16+dy),(22,18+dy),(23,26),(25+sway,43),(18+sway,44),(16,41),(18,29)])
   wings=[cloak]
  else:
   wing=poly([(13,16+dy),(sl-1,18+dy),(sl-2,27),(6+sway,41),(8+sway,43),(10+sway,44),(13+sway,41),(13,27)])
   wings=[wing,poly([(31-x,y) for x,y in [(13,16+dy),(sl-1,18+dy),(sl-2,27),(6-sway,41),(8-sway,43),(10-sway,44),(13-sway,41),(13,27)]])]
  for index,m in enumerate(wings):
   surface(c,m,'A')
   for y in range(22+dy,41):
    xs=sorted(x for x,yy in m if yy==y)
    if len(xs)>=4:
     x=(xs[1] if side or index==1 else xs[-2]);put(c,x,y,'B2')
     fold=xs[len(xs)//2]
     if fold!=x:put(c,fold,y,'A1')
   pattern_band(c,m,40,'B','pearl')
  if d=='up':
   m=poly([(13,16),(18,16),(sr+1,18),(23,28),(25+sway,42),(21+sway,44),(17+sway,43),(14+sway,44),(6+sway,42),(8,28),(sl-1,18)])
   surface(c,m,'A')
   for x in (11,15,20):vline(c,x,25,40,'A1');put(c,x+1,41,'A1')
   pattern_band(c,m,41,'B','pearl')
  # The lowered hood scallops around the shoulders, not around the face.
  hood=poly([(13,16+dy),(18,16+dy),(sr+1,19+dy),(sr,22+dy),(20,21+dy),(18,23+dy),(16,21+dy),(13,23+dy),(11,21+dy),(sl-1,22+dy),(sl-1,19+dy)]) if not side else poly([(15,16),(20,16),(23,19),(22,23),(20,22),(18,23),(15,20)])
  surface(c,hood,'A');pattern_band(c,hood,19+dy,'B','pearl')
  if d!='up':
   surface(c,poly([(15,18+dy),(17,18+dy),(18,19+dy),(17,21+dy),(15,21+dy),(14,19+dy)]),'G',light=False);put(c,16,19+dy,'J1')
  if d=='down':
   surface(c,rect(13,27,18,29),'T',light=False);put(c,15,28,'G2')
 else:
  bottom=46
  pts=([(15,16+dy),(18,16+dy),(sr+1,19+dy),(wr+1,27),(24+sway,45),(22+sway,46),(11+sway,46),(9+sway,45),(wl-1,27),(sl-1,19+dy)] if side else [(13,16+dy),(18,16+dy),(sr,19+dy),(wr+1,27),(24+sway,45),(22+sway,46),(9+sway,46),(7+sway,45),(wl-1,27),(sl,19+dy)])
  m=poly(pts);surface(c,m,'A')
  for x in ((13,17,21) if side else (11,15,20)):
   for y in range(29,43):
    if (x,y) in m-border(m):put(c,x,y,'A0' if x==15 else 'A1')
   if (x+1,43) in m-border(m):put(c,x+1,43,'A1')
  for x,y in m-border(m):
   if y in range(21,42) and y%4==1 and x%4==(y//4%2)*2:c[x,y]='A3'
  pattern_band(c,m,43,'B','dentil')
  # Bell sleeves broaden progressively to the hip; wrists stay exposed below.
  sleeve=poly([(sl,18+dy),(sl+3,19+dy),(12,25),(12,30),(6,30),(7,25)]) if not side else poly([(13,19+dy),(16,19+dy),(17,24),(19,30),(11,30),(12,24)])
  sms=[sleeve] if side else [sleeve,poly([(31-x,y) for x,y in sleeve])]
  for sm in sms:surface(c,sm,'A');pattern_band(c,sm,27,'B','pearl')
  sash=rect(wl-1,26,wr+1,28);surface(c,sash,'B',light=False)
  for i,x in enumerate((15,18) if not side else (16,19)):
   tail=poly([(x,28),(x+2,28),(x+2,35+i*3),(x+1,37+i*3),(x,36+i*3)])
   surface(c,tail,'B',light=False)
  collar=poly([(13,16+dy),(18,16+dy),(19,18+dy),(17,20+dy),(14,20+dy),(12,18+dy)]) if not side else poly([(14,16+dy),(18,16+dy),(19,18+dy),(15,19+dy)])
  surface(c,collar,'G',light=False)
 for hand in t['hands']:
  for point in hand:
   if point[1]>=30+t['pose']['arms'][0]:c.pop(point,None)
 return c

def hair_layer(name,d,f):
 c={};dy=pose(d,f)['dy'];side=d=='left'
 cap=poly([(13,3),(18,3),(21,6),(21,8),(19,8),(18,6),(16,7),(14,6),(12,8),(10,8),(10,6)])
 if side:cap=poly([(13,3),(18,3),(21,6),(21,11),(19,14),(17,14),(18,10),(16,7),(13,7),(11,8),(10,7),(11,5)])
 if d=='up':cap=poly([(13,3),(18,3),(21,6),(21,12),(18,15),(13,15),(10,12),(10,6)])
 if name=='short':
  locks=[cap]
  if d!='up':
   locks += [poly([(10,7),(12,7),(12,11),(11,12),(10,11)])]
   if not side:locks += [poly([(19,7),(21,7),(21,11),(20,12),(19,11)])]
  m=set().union(*locks);surface(c,move(m,dy=dy),'H')
  for x in ((14,17) if not side else (16,19)):
   vline(c,x,4+dy,5+dy,'H0')
  if d=='up':
   for x in (13,16,19):vline(c,x,7,12,'H1');put(c,x-1,13,'H0')
 else:
  if name=='long':
   if side:locks=[poly([(18,6),(21,7),(22,12),(23,23),(21,27),(18,25),(17,17)])]
   else:locks=[poly([(10,6),(13,7),(13,17),(14,24),(12,27),(9,25),(8,20),(9,12)]),poly([(31-x,y) for x,y in [(10,6),(13,7),(13,17),(14,24),(12,27),(9,25),(8,20),(9,12)]])]
   if d=='up':locks=[poly([(11,7),(20,7),(22,15),(23,24),(20,27),(17,26),(15,28),(12,26),(9,27),(8,24),(9,15)])]
   m=cap|set().union(*locks);surface(c,move(m,dy=dy),'H')
   for x in ((20,) if side else (10,12,19,21)):
    for y in range(11,25):
     p=(x+(1 if y>20 and x<16 else 0),y+dy)
     if p in move(m,dy=dy)-border(move(m,dy=dy)):c[p]='H0' if x in (12,19,20) else 'H1'
   if d=='up':
    for x in (12,16,19):vline(c,x,9,24,'H0');put(c,x+1,25,'H0')
  else:
   # Crown and diagonal two-colour plaits over the left shoulder.
   m=cap|poly([(19,7),(22,9),(22,13),(20,15),(18,13)])
   if side:m=cap|poly([(18,8),(21,8),(22,13),(20,15),(18,13)])
   surface(c,move(m,dy=dy),'H')
   bx=20 if d!='up' else 17
   if side:bx=20
   braid=set()
   for y in range(12,28):
    off=(y//2)%2;braid |=rect(bx+off,y,bx+3+off,y)
   braid|=poly([(bx+1,27),(bx+3,27),(bx+2,30)])
   braid=move(braid,dy=dy);surface(c,braid,'H',light=False)
   for x,y in braid-border(braid):c[x,y]='H1' if ((y-dy)//2+x)%2 else 'H2'
   for x in (bx+1,bx+2):put(c,x,27+dy,'G2')
  # A central ink part with two restrained crown highlights.
  vline(c,16,3+dy,5+dy,'H0')
  hline(c,13,14,4+dy,'H3')
 return c

def beard_layer(d,f):
 c={};dy=pose(d,f)['dy']
 if d=='up':return c
 m=poly([(12,10),(14,11),(17,11),(19,10),(20,12),(19,15),(17,17),(14,17),(12,15),(11,12)]) if d=='down' else poly([(12,10),(14,11),(17,10),(18,12),(17,16),(15,17),(13,15),(11,12)])
 m=move(m,dy=dy);surface(c,m,'H',light=False)
 if d=='down':
  put(c,15,12+dy,'H0');vline(c,16,14+dy,16+dy,'H0');vline(c,13,13+dy,14+dy,'H1')
 else:put(c,12,12+dy,'H0');vline(c,15,14+dy,16+dy,'H1')
 return c

def hood_layer(d,f):
 c={};dy=pose(d,f)['dy']
 outer=poly([(14,0),(17,1),(21,4),(23,9),(22,15),(25,20),(24,24),(22,23),(20,25),(17,23),(15,25),(12,23),(10,25),(7,23),(8,20),(10,15),(9,9),(10,4)])
 hole=poly([(13,7),(18,7),(20,9),(20,14),(18,17),(13,17),(11,14),(11,9)])
 if d=='left':
  outer=poly([(15,0),(19,2),(22,6),(23,14),(25,20),(25,23),(23,25),(20,23),(17,25),(13,23),(11,20),(12,15),(10,12),(9,7),(11,3)])
  hole=poly([(11,8),(15,8),(17,10),(17,15),(15,17),(12,15),(10,12),(9,10)])
 if d=='up':hole=set()
 m=move(outer-hole,dy=dy);surface(c,m,'A')
 pattern_band(c,m,21+dy,'B','pearl')
 if d in ('left','up'):
  tail=move(poly([(21,12),(24,13),(25,20),(25,30),(23,35),(21,34),(22,30),(22,21),(20,16)]),dy=dy)
  surface(c,tail,'A');vline(c,23,20+dy,29+dy,'A1')
 return c

def staff_layer(d,f):
 c={};p=pose(d,f);x=9 if d!='left' else 14
 if d=='up':x=22
 ay=p['arms'][0] if d=='down' else 0
 # The shaft stops behind the shared mitten, above and below the grip.
 for y0,y1 in ((8+ay,29+ay),(34+ay,45+ay)):
  surface(c,rect(x-1,y0,x+1,y1),'W',light=False)
 # Crook has an open centre and a three-pixel garnet inlay.
 m=poly([(x,2),(x+3,2),(x+5,4),(x+5,7),(x+3,9),(x,9),(x-2,7),(x-2,4)])-rect(x+1,5,x+2,6)
 surface(c,move(m,dy=ay),'G',light=False)
 put(c,x+1,4+ay,'J0');put(c,x+2,4+ay,'J1');put(c,x+3,4+ay,'J2')
 if d!='up':c={(2*x-xx,yy):r for (xx,yy),r in c.items()}
 return c

LAYERS=['body/man','body/woman','feature/elf-ears','feature/horns','outfit/labourer','outfit/labourer@woman','outfit/ranger','outfit/ranger@woman','outfit/mage','outfit/mage@woman','hair/short','hair/long','hair/braid','beard/full','head/hood','held/staff']
def draw(layer,d,f):
 if d=='right':return {(31-x,y):r for (x,y),r in draw(layer,'left',0).items()}
 if d!='down':f=0
 group,name=layer.split('/')
 if group=='body':c=body_layer(name,d,f)
 elif group=='feature':c=feature_layer(name,d,f)
 elif group=='outfit':c=outfit_layer(name.split('@')[0],'woman' if '@woman' in name else 'man',d,f)
 elif group=='hair':c=hair_layer(name,d,f)
 elif group=='beard':c=beard_layer(d,f)
 elif group=='head':c=hood_layer(d,f)
 else:c=staff_layer(d,f)
 c=finish(c)
 def inset(x,y,r):
  for dx,dy in N4:
   q=(x+dx,y+dy)
   if q not in c:c[q]=r[0]+'0'
  c[x,y]=r
 if group=='hair' and name=='short':
  if d=='left':inset(17,11,'H1')
  for y in (4,5):c[13,y+pose(d,f)['dy']]='H3'
 if group=='hair' and name=='long' and d=='down':inset(13,16+pose(d,f)['dy'],'H1')
 if group=='head':
  if d=='down':inset(23,23+pose(d,f)['dy'],'A1')
  if d=='left':
   for x,y in ((12,22),(17,17),(14,18),(16,17),(17,24)):inset(x,y,'A1')
  if d in ('left','up'):
   for x,y in ((22,34),(23,34),(21,33)):inset(x,y,'A1')

 return c

def finish(c):
 """Keep all visible region edges in their own ink; trim solid ink corners."""
 c={p:r for p,r in c.items() if 0<=p[0]<W and 0<=p[1]<H}
 for p in border(set(c)):
  c[p]=c[p][0]+'0'
 # Interior 2x2 ink squares are softened to the ramp shade. At exposed
 # corners remove the least-supported corner, then recompute its local rim.
 for _ in range(150):
  bad=None
  for y in range(H-1):
   for x in range(W-1):
    ps=((x,y),(x+1,y),(x,y+1),(x+1,y+1));r=c.get(ps[0])
    if r and r.endswith('0') and all(c.get(p)==r for p in ps):bad=(ps,r);break
   if bad:break
  if not bad:break
  ps,r=bad
  interior=[p for p in ps if all((p[0]+dx,p[1]+dy) in c for dx,dy in N4)]
  if interior:
   p=max(interior,key=lambda p:(p[0],-p[1]));c[p]=r[0]+'1'
  else:
   p=min(ps,key=lambda p:sum((p[0]+dx,p[1]+dy) in c for dx,dy in N4));del c[p]
   for q in border(set(c)):c[q]=c[q][0]+'0'
 return connected(c)

def connected(c):
 def square(p,r):
  x,y=p
  return any(all(c.get((xx+dx,yy+dy))==r for dx,dy in ((0,0),(1,0),(0,1),(1,1))) for xx in (x-1,x) for yy in (y-1,y))
 for _ in range(5):
  change=False
  for p,r in list(c.items()):
   if r[0] in ('E','G','J') or r=='A3':continue
   x,y=p
   if r=='S1' and (8<=y<=13):continue
   if r=='H0' and 11<=y<=13 and 11<=x<=16:continue
   if any(c.get((x+dx,y+dy))==r for dx,dy in N4):continue
   if r.endswith('0'):
    options=[]
    for dx,dy in N4:
     q=(x+dx,y+dy);old=c.get(q)
     if old and old[0]==r[0] and old[-1]!='0':
      # A Manhattan bridge joins diagonal contour pixels without a 2x2 ink blot.
      joins=sum(c.get((q[0]+a,q[1]+b))==r for a,b in N4)
      options.append((joins,q,old))
    for _,q,old in sorted(options,reverse=True):
     c[q]=r
     if not square(q,r):change=True;break
     c[q]=old
   else:
    options=[c[q] for dx,dy in N4 if (q:=(x+dx,y+dy)) in c and c[q][0]==r[0] and c[q][-1]!='0']
    if options:c[p]=max(set(options),key=options.count);change=True
  if not change:break
 return c

def image(c):
 im=Image.new('RGBA',(W,H));im.putdata([ROLES[c[x,y]] if (x,y) in c else (0,0,0,0) for y in range(H) for x in range(W)]);return im

def main():
 OUT.mkdir(exist_ok=True);SCRATCH.mkdir(exist_ok=True)
 (OUT/'ramps.json').write_text(json.dumps(RAMPS,indent=2)+'\n')
 for layer in LAYERS:
  sheet=Image.new('RGBA',(128,192))
  for row,d in enumerate(DIRECTIONS):
   for f in range(4):sheet.paste(image(draw(layer,d,f)),(f*32,row*48))
  path=OUT/(layer+'.png');path.parent.mkdir(parents=True,exist_ok=True);sheet.save(path)
 print(f'Wrote {len(LAYERS)} native layer sheets and ramps.json.')
if __name__=='__main__':main()
