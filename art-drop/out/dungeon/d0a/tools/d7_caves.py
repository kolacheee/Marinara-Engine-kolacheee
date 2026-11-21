"""Native image-tool rock planes: palette readback and wrapped piece placement."""
import json
from functools import lru_cache
from collections import Counter
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW
from d4_caves import rgba
from d4_backport import tidy
from redraw_critic21 import canvas,poly,line,box
from d6_caves import RAMPS
from check_proofs import components

SOURCE_COLOURS=[(107,85,60),(88,82,74),(130,114,93),(151,118,71)]
RAMP={
 'cave_rock':['mud:4','grey-brown-rock:3','limestone:3','grey-brown-rock:4'],
 'cave_ice':['frost:2','blue-ice:2','blue-ice:3','snowdrift:3'],
 'cave_crystal':['dark-rock:4','violet-crystal:3','dark-rock:5','violet-crystal:3'],
 'cave_lava':['basalt:5','ash:3','basalt:6','embers:3']}

@lru_cache(None)
def source():
 src=Image.open(REVIEW/'D7-cave-small-source.png').convert('RGB')
 lut={p:min(range(4),key=lambda i:sum((p[k]-SOURCE_COLOURS[i][k])**2 for k in range(3))) for p in set(src.get_flattened_data())}
 colours=[rgba(k) for k in RAMP['cave_rock']]
 im=Image.new('RGBA',src.size);im.putdata([colours[lut[p]] for p in src.get_flattened_data()])
 for _ in range(8):
  if not tidy(im):break
 im.save(REVIEW/'D7-locked-source.png')
 ids=bytes(colours.index(p) for p in im.get_flattened_data())
 return ids,im.width,im.height

@lru_cache(None)
def pieces():
 ids,ww,hh=source();seen=bytearray(ww*hh);out=[]
 for pos,colour in enumerate(ids):
  if not colour or seen[pos]:continue
  todo=[pos];seen[pos]=1;group=[]
  while todo:
   q=todo.pop();a=q%ww;b=q//ww;group.append((a,b))
   for u,v in [(a-1,b),(a+1,b),(a,b-1),(a,b+1)]:
    n=v*ww+u
    if 0<=u<ww and 0<=v<hh and not seen[n] and ids[n]!=0:seen[n]=1;todo.append(n)
  if len(group)<45:continue
  x=min(a for a,b in group);y=min(b for a,b in group);u=max(a for a,b in group)+1;v=max(b for a,b in group)+1
  if x==0 or y==0 or u==ww or v==hh:continue
  pixels=[(a-x,b-y,ids[b*ww+a]) for a,b in group]
  out.append(dict(index=len(out),x=x,y=y,w=u-x,h=v-y,pixels=pixels))
 return out

def piece(p,name):
 im=Image.new('RGBA',(p['w'],p['h']));px=im.load();colours=[rgba(k) for k in RAMP[name]]
 for x,y,i in p['pixels']:px[x,y]=colours[i]
 # Hand cleanup of selected native slabs: short fracture faces are drawn
 # into the source planes and clipped to their original opaque silhouettes.
 faults={4:'56,9 56,17 63,24 63,34',6:'84,5 84,16 76,24 76,35 69,42',7:'73,8 73,18 81,26 81,38',12:'61,5 61,15 55,21 55,33',24:'69,5 69,12 61,20 61,30',27:'92,8 92,18 83,27 83,40',30:'80,4 80,12 74,18 74,25 64,32 64,42 56,50',33:'62,6 62,18 69,25 69,34',34:'71,8 71,18 63,26 63,39',48:'58,5 58,18 65,25 65,33',49:'64,7 64,19 58,25 58,38',52:'55,4 55,14 63,22 63,34',54:'89,7 89,20 82,27 82,41',55:'98,9 98,20 90,28 90,41',62:'53,5 53,14 60,21 60,29',67:'60,9 60,18 53,25 53,36',70:'62,7 62,15 69,23 69,32',71:'80,3 80,13 70,23 70,36 76,42',74:'76,7 76,18 68,26 68,34'}
 if p['index'] in faults:
  original=im.copy();line(im,RAMP[name][1],faults[p['index']],3)
  coords=[tuple(map(int,q.split(','))) for q in faults[p['index']].split()]
  line(im,RAMP[name][3],' '.join(f'{x-2},{y}' for x,y in coords[:-1]),1)
  # No new marks in packed earth or outside the original rock silhouette.
  im.putalpha(original.getchannel('A'));pixels=[]
  for q in im.get_flattened_data():pixels.append(q if q[3] else (0,0,0,0))
  im.putdata(pixels)
 return im

def atlas():
 out=canvas((1448,1086),'mud:4');d=ImageDraw.Draw(out)
 for p in pieces():
  out.alpha_composite(piece(p,'cave_rock'),(p['x'],p['y']));d.text((p['x'],p['y']),str(p['index']),fill='white')
 out.save(REVIEW/'D7-source-pieces.png')
 (REVIEW/'D7-piece-index.json').write_text(json.dumps([{k:v for k,v in p.items() if k != 'pixels'} for p in pieces()],indent=2))
 print('pieces',len(pieces()))

# Selected after native source inspection. A piece crosses each periodic edge;
# only the overhanging portion wraps, never a border strip or mirrored pixel.
PLACEMENTS={
 'cave_rock':[(24,-32,37),(30,112,-19),(52,206,106),(71,68,124),(48,-49,222),(74,146,244),(66,107,67),(16,25,181),(9,209,191)],
 'cave_ice':[(27,-51,60),(49,153,-21),(67,81,119),(70,221,177),(62,14,242),(38,171,250),(17,103,65),(11,36,181)],
 'cave_crystal':[(33,239,39),(54,68,-24),(72,-31,138),(55,107,113),(48,28,252),(34,192,225),(20,108,62),(25,23,84)],
 'cave_lava':[(19,-25,21),(30,135,-20),(52,217,114),(71,54,133),(48,-35,232),(49,159,237),(17,114,63),(11,52,95)]}


def periodic_paste(im,pic,x,y):
 for dx in (-288,0,288):
  for dy in (-288,0,288):im.alpha_composite(pic,(x+dx,y+dy))

def run():
 for name,placed in PLACEMENTS.items():
  im=canvas((288,288),RAMP[name][0])
  for idx,x,y in placed:periodic_paste(im,piece(pieces()[idx],name),x,y)
  if name=='cave_lava':
   # Continuous fault under the source crust. Left/right and top/bottom each
   # share the actual channel cross-section, not just a flat border colour.
   channel='-12,174 21,174 40,166 61,159 82,162 104,174 128,182 149,188 170,188 193,179 215,173 240,169 263,171 288,174 300,174 300,186 288,186 263,183 240,184 216,190 195,197 172,205 148,204 125,198 101,189 81,177 64,175 45,180 24,186 -12,186'
   poly(im,'embers:3',channel)
   line(im,'embers:4','-12,179 21,179 43,172 62,166 81,168 103,181 127,190 149,197 171,196 194,188 216,182 240,176 263,178 288,179 300,179',3)
   line(im,'embers:3','144,201 153,219 164,225 172,242 188,253',5)
   line(im,'embers:4','147,204 156,219 165,226 173,241',2)
   # Native source plates interrupt the channel into banks with lit undersides.
   for idx,x,y in [(30,135,-20),(71,54,133),(49,159,237)]:periodic_paste(im,piece(pieces()[idx],name),x,y)
  for _ in range(8):
   if not tidy(im):break
  im.save(BASE/f'canon/surfaces/{name}-floor.png')
  out=Image.new('RGBA',(864,864))
  for y in range(3):
   for x in range(3):out.paste(im,(x*288,y*288))
  out.save(REVIEW/f'D7-repeat-{name}.png')
 (REVIEW/'D7-source-registration.json').write_text(json.dumps({'source':'D7-cave-small-source.png','origin':[0,0],'pitch':[1,1],'source_size':list(Image.open(REVIEW/'D7-cave-small-source.png').size),'resampling':False,'palette_classes':RAMP,'pattern_placements':PLACEMENTS,'notes':'Each selected source component is copied at native pixel size. Only its position changes; edge-overhangs wrap periodically.'},indent=2)+'\n')

@lru_cache(None)
def cave_scene(size):
 im=canvas(size,'mud:4')
 # Two complete compacted-earth shapes from the first native image source.
 # They retain their source pixels and sit beneath the smaller bedrock plates.
 src=Image.open(REVIEW/'D7-cave-source.png').convert('RGB');earth=Image.new('RGBA',src.size)
 earth.putdata([rgba('grey-brown-rock:3') if r<=105 and g<=83 and b<=62 else (0,0,0,0) for r,g,b in src.get_flattened_data()])
 for _ in range(4):tidy(earth)
 for b,at in [((835,45,1180,285),(965,380)),((100,75,300,145),(420,365))]:
  im.alpha_composite(earth.crop(b),at)

 # Open the source composition into the larger cave by spacing complete
 # native slabs. No source is cropped at an image join, and none repeats.
 for p in pieces():
  x=round(p['x']*1.31)
  y=round(p['y']*1.21)
  im.alpha_composite(piece(p,'cave_rock'),(x,y))
 # Wide worn route follows the source party approach; retain all slab joints.
 # Damp earth is placed only in two pool margins, with connected terraced edges.
 for p in ['831,273 849,249 873,236 921,240 947,266 952,363 939,398 917,421 858,417 830,385','493,686 511,663 543,653 583,658 610,678 613,721 588,750 534,753 505,734']:
  poly(im,'grey-brown-rock:3',p)
 # Avoid the straight source-strip gaps by carrying native complete shelves
 # across them; these source pieces are moved, not duplicated.
 # Source-wide spacing remains deliberately calm for party/foe readability.
 im.save(REVIEW/'D7-cave-composed-ground.png');return im

if __name__=='__main__':atlas();run()
