"""D4 source read-back: grid origin 0,0, pitch ONE source pixel. No resize.
Palette assignment is per pixel; all source positions are retained. The source
is a reference render in review-d0a, not a production texture.
"""
import json
from PIL import Image,ImageDraw
from check_proofs import components
from draw_proofs import BASE,REVIEW,c
from redraw_critic21 import poly,line,box

RAMPS={
 'cave_rock':['mud:4','grey-brown-rock:3','mud:5','grey-brown-rock:4'],
 'cave_crystal':['dark-rock:4','violet-crystal:3','dark-rock:5','dark-rock:5'],
 'cave_ice':['blue-ice:2','frost:2','blue-ice:3','snowdrift:3'],
 'cave_lava':['embers:3','basalt:5','ash:3','basalt:6']}
def rgba(r):
 a,b=r.split(':');return (*bytes.fromhex(c(a,int(b))[1:]),255)
def labels():
 src=Image.open(REVIEW/'D-cave-source-native.png').convert('RGB')
 centers=[(87,76,65),(108,96,83),(125,110,95),(138,120,101)]
 lut={p:min(range(4),key=lambda i:sum((p[j]-centers[i][j])**2 for j in range(3))) for p in set(src.get_flattened_data())}
 ix=Image.new('L',src.size);ix.putdata([lut[p] for p in src.get_flattened_data()]);return ix

def clean_indices(ix):
 # Record each tiny source island for inspection. Replace only disconnected
 # 1/2-pixel source fragments with the material sharing their longest boundary.
 # This is indexed-colour cleanup, not a spatial resampling operation.
 changes=[]
 small,_=components(ix)
 for fragment in small:
  value=fragment['colour'];pts=fragment['points'];near=[]
  for x,y in pts:
   for dy,dx in [(0,1),(0,-1),(1,0),(-1,0)]:
    yy,xx=y+dy,x+dx
    if 0<=yy<ix.height and 0<=xx<ix.width and ix.getpixel((xx,yy))!=value:near.append(int(ix.getpixel((xx,yy))))
  if near:
   target=max(set(near),key=near.count)
   for x,y in pts:ix.putpixel((x,y),target);changes.append([int(x),int(y),int(value),target])
 return ix,changes

def image(ix,name):
 out=Image.new('RGBA',ix.size);r=[rgba(v) for v in RAMPS[name]];out.putdata([r[v] for v in ix.get_flattened_data()]);return out

def run():
 ix=labels();ix,fix=clean_indices(ix)
 # No source reduction: every output coordinate receives precisely its native
 # source coordinate. 1152 is a crop, not a resize.
 image(ix.crop((0,0,1152,1152)),'cave_rock').save(REVIEW/'D-cave-native-locked.png')
 crops={'cave_rock':(80,100),'cave_crystal':(421,90),'cave_ice':(760,422),'cave_lava':(300,760)}
 for name,(x,y) in crops.items():
  tile=image(ix.crop((x,y,x+288,y+288)),name)
  if name=='cave_lava':
   # Constructed fault banks over the source bedrock, with visible crust fronts.
   poly(tile,'ash:3','0,104 37,104 37,94 74,94 74,119 112,119 112,146 151,146 151,133 191,133 191,162 232,162 232,183 287,183 287,218 233,218 233,202 190,202 190,173 151,173 151,185 111,185 111,157 73,157 73,132 37,132 37,143 0,143')
   poly(tile,'embers:3','0,112 41,112 41,102 68,102 68,126 107,126 107,154 156,154 156,143 185,143 185,170 227,170 227,191 287,191 287,210 238,210 238,194 197,194 197,165 145,165 145,176 118,176 118,149 80,149 80,124 43,124 43,135 0,135')
   line(tile,'embers:4','0,122 48,122 48,115 62,115 62,138 95,138 95,145 124,145 124,163 164,163 164,154 179,154 179,180 215,180 215,197 287,197',4)
   # Fronts are flat vertical fractures, not a stroke-width halo.
   for x,y,w,h in [(9,104,25,8),(77,119,31,14),(114,146,31,8),(194,162,31,11),(241,183,35,8)]:
    box(tile,'basalt:5',(x,y,x+w,y+h));line(tile,'basalt:6',f'{x},{y} {x+w},{y}',2)
  tile.save(BASE/f'canon/surfaces/{name}-floor.png')
 # Audit the exact mapping and keep native source plus complete cleanup ledger.
 (REVIEW/'D-cave-source-registration.json').write_text(json.dumps({'source':'D-cave-source-native.png','source_size':[1254,1254],'grid_origin':[0,0],'grid_pitch':[1,1],'source_pixels_per_art_pixel':1,'resampling':False,'crops':crops,'isolated_fragment_repairs':fix},indent=2))
 print('Native 1:1 cave source; isolated source pixel repairs',len(fix))
if __name__=='__main__':run()
