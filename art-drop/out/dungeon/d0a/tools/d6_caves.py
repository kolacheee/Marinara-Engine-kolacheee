"""Registered native image-source read-back; every sample has pitch (1,1)."""
import json
from functools import lru_cache
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,c
from redraw_critic21 import poly,line,box,canvas
from d4_caves import rgba
from d4_backport import tidy
from d6_materials import locked
from check_proofs import components

CROPS={'cave_rock':(80,210,368,498),'cave_ice':(780,180,1068,468),'cave_crystal':(334,690,622,978),'cave_lava':(823,840,1111,1128)}
RAMPS={'cave_rock':['mud:4','grey-brown-rock:3','mud:5','grey-brown-rock:4'], 'cave_ice':['blue-ice:2','frost:2','snowdrift:2','blue-ice:3','snowdrift:3'],'cave_crystal':['dark-rock:4','violet-crystal:3','dark-rock:5'],'cave_lava':['basalt:5','ash:3','basalt:6','embers:3','embers:4']}

def readback(src,name):
 # Assign flat material planes by source value/chroma, with no neighbourhood
 # averaging, coordinate fitting, interpolation, or source pixel reduction.
 im=Image.new('RGBA',src.size);lut={}
 for p in set(src.convert('RGB').get_flattened_data()):
  r,g,b=p;lum=(r+g+b)/3
  if name=='cave_rock':tag='mud:4' if r-g>17 else 'grey-brown-rock:3' if lum<83 else 'mud:5' if lum<108 else 'grey-brown-rock:4'
  elif name=='cave_ice':tag=['blue-ice:2','frost:2','snowdrift:2','blue-ice:3','snowdrift:3'][0 if lum<96 else 1 if lum<125 else 2 if lum<150 else 3 if lum<178 else 4]
  elif name=='cave_crystal':tag='violet-crystal:3' if r>g*1.23 and b>g*1.3 and lum>90 else 'dark-rock:4' if lum<62 else 'dark-rock:5'
  else:tag=('embers:4' if r>160 else 'embers:3') if r>g*1.45 and r>b*1.5 else 'basalt:5' if lum<65 else 'ash:3' if lum<118 else 'basalt:6'
  lut[p]=rgba(tag)
 im.putdata([lut[p] for p in src.convert('RGB').get_flattened_data()]);return im

def cleanup(im):
 # Palette read-back can break one source plane into detached flecks. Remove
 # those indexed fragments as whole components; never average neighbouring RGB.
 from collections import Counter
 px=im.load();seen=set();changes=[];w,h=im.size
 for yy in range(h):
  for xx in range(w):
   if (xx,yy) in seen:continue
   colour=px[xx,yy];todo=[(xx,yy)];seen.add((xx,yy));group=[]
   while todo:
    x,y=todo.pop();group.append((x,y))
    for a,b in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
     if 0<=a<w and 0<=b<h and (a,b) not in seen and px[a,b]==colour:seen.add((a,b));todo.append((a,b))
   if len(group)<12:
    neighbours=Counter(px[a,b] for x,y in group for a,b in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)) if 0<=a<w and 0<=b<h and px[a,b]!=colour)
    if neighbours:
     target=neighbours.most_common(1)[0][0]
     for x,y in group:px[x,y]=target;changes.append([x,y,list(target)])
 for _ in range(8):
  edits=tidy(im);changes+=edits
  if not edits:break
 return changes

@lru_cache(None)
def old_native():
 src=Image.open(REVIEW/'D-cave-source-native.png').convert('RGB')
 from d4_caves import labels,image
 im=image(labels(),'cave_rock');cleanup(im);return im

def run():
 src=Image.open(REVIEW/'D6-cave-source.png').convert('RGB');ledger={'source':'D6-cave-source.png','source_size':list(src.size),'grid_origin':[0,0],'grid_pitch':[1,1],'reduction':False,'crops':CROPS,'cleanup':{}}
 for name,b in CROPS.items():
  im=readback(src.crop(b),name)
  # Border beds are cut back into calm material. Native shelves terminate
  # before the repeat join, with unequal margins, rather than a filtered seam.
  base={'cave_rock':'mud:4','cave_ice':'frost:2','cave_crystal':'dark-rock:4','cave_lava':'ash:3'}[name]
  for p in ['0,0 287,0 287,5 245,5 245,3 198,3 198,7 139,7 139,4 84,4 84,6 33,6 33,3 0,3','0,287 287,287 287,282 256,282 256,285 207,285 207,281 152,281 152,284 91,284 91,280 44,280 44,284 0,284','0,0 3,0 3,45 7,45 7,84 4,84 4,134 6,134 6,191 3,191 3,242 5,242 5,287 0,287','287,0 284,0 284,57 280,57 280,107 283,107 283,166 281,166 281,215 285,215 285,287 287,287']:
   poly(im,base,p)
  # Selected fractures are sharpened in the actual source planes; each is a
  # unique connected native stroke, not a repeating surface symbol.
  if name=='cave_rock':
   for p in ['19,91 32,91 32,95 42,95 42,101','108,186 118,186 118,190 126,190','193,51 200,51 200,56 206,56']:
    line(im,'grey-brown-rock:4',p,2)
  elif name=='cave_ice':
   for p in ['44,242 53,236 60,236 67,229','151,85 158,85 158,77 165,70','217,171 225,165 232,165 240,157']:
    line(im,'snowdrift:3',p,2)
  elif name=='cave_crystal':
   for p in ['48,203 56,198 66,198 72,192','192,90 200,90 206,84 215,84','113,250 124,250 130,245']:
    line(im,'violet-crystal:3',p,3)
  else:
   # A crust fragment masks part of the source lava pool; its front faces
   # and ember-lit underside share the material floor's permitted L* span.
   poly(im,'basalt:5','113,166 126,157 146,157 156,166 151,177 132,182 115,177')
   poly(im,'ash:3','113,166 126,157 146,157 156,166 149,170 128,173 115,171')
   line(im,'basalt:6','116,164 128,159 143,159',2)
   line(im,'embers:3','131,181 145,178 151,174',3)
  ledger['cleanup'][name]=cleanup(im)
  im.save(BASE/f'canon/surfaces/{name}-floor.png');im.save(REVIEW/f'D6-native-{name}.png')
 (REVIEW/'D6-source-registration.json').write_text(json.dumps(ledger,indent=2)+'\n')
 print('Read four native crops; cleanup counts:',{n:len(v) for n,v in ledger['cleanup'].items()})

@lru_cache(None)
def cave_scene(size):
 # Distinct source portions at native density, with the walks composed below.
 # The west and east use disjoint original source regions, not a 1152px repeat.
 source=old_native();im=canvas(size,'mud:4')
 im.paste(source.crop((0,0,1000,1254)),(0,0))
 east=readback(Image.open(REVIEW/'D6-cave-source.png').crop((0,0,627,627)),'cave_rock');cleanup(east)
 im.paste(east,(1000,0));im.paste(source.crop((254,100,600,727)),(1627,0))
 im.paste(source.crop((220,627,1220,1254)),(968,627))
 # The narrow remaining southern edge is inaccessible mass except at passages.
 im.paste(source.crop((40,980,1040,1080)),(0,1254))
 # Packed walking routes remove obstructing shelves, with irregular connected
 # earth contacts and retained native grain, never a uniform overlay stripe.
 route=Image.new('L',size);d=ImageDraw.Draw(route)
 d.line([(295,411),(445,424),(605,470),(748,524),(936,522),(1120,492),(1255,527),(1371,552),(1490,615),(1564,714),(1584,838),(1475,941),(1350,1008),(1140,1007),(1040,1053),(964,1145)],fill=255,width=24)
 earth=source.crop((420,250,620,450))
 # Map the route's original underlying rock into two earth tones; no foreign
 # pattern is stamped across it, and source silhouette transitions remain.
 earthmap=im.copy();a=[]
 for p in im.get_flattened_data():a.append(rgba('mud:5') if p==rgba('grey-brown-rock:4') else rgba('grey-brown-rock:3') if p==rgba('mud:5') else p)
 earthmap.putdata(a);im.paste(earthmap,(0,0),route)
 # Damp pool margins are deliberately darker, two broad terraced contacts.
 for outer,inner in [('838,258 862,235 914,235 945,255 945,383 922,414 860,410 834,382','849,262 868,247 915,247 933,264 933,380 916,399 870,398 848,377'),('499,686 521,660 579,656 610,680 609,723 580,750 531,748 506,726','512,686 532,670 578,670 598,689 595,720 576,738 534,734 518,718')]:
  poly(im,'grey-brown-rock:3',outer);poly(im,'mud:4',inner)
 for p in ['842,279 848,269 855,269','863,403 883,407 901,407','509,694 513,685 520,681','576,741 590,734 597,724']:
  line(im,'mud:5',p,3)
 cleanup(im);im.save(REVIEW/'D6-cave-composed-ground.png');return im

if __name__=='__main__':run()
