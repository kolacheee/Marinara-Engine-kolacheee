"""Back-port the four operator-authorized cave floors; other C pieces stay fixed."""
from PIL import Image
from draw_proofs import BASE,REVIEW
from draw_style_samples import SWATCHES
from check_proofs import components
from collections import Counter

def tidy(im):
 p=im.load();edits=[]
 for fragment in components(im)[0]:
  near=[]
  for x,y in fragment['points']:
   for u,v in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
    if 0<=u<im.width and 0<=v<im.height and p[u,v]!=fragment['colour']:near.append(p[u,v])
  if near:
   colour=Counter(near).most_common(1)[0][0]
   for x,y in fragment['points']:p[x,y]=colour;edits.append([x,y,list(colour)])
 return edits

def run():
 guide=Image.open(BASE/'canon/style-guide.png').convert('RGB');changes={}
 for n in ['cave_rock','cave_crystal','cave_ice','cave_lava']:
  f=Image.open(BASE/f'canon/surfaces/{n}-floor.png').convert('RGBA');changes[n]=tidy(f);f.save(BASE/f'canon/surfaces/{n}-floor.png')
  wall=Image.open(BASE/f'canon/surfaces/{n}-wall.png').convert('RGBA')
  floor=Image.new('RGBA',(144,144));floor.paste(f.crop((0,0,144,144)))
  floor.save(REVIEW/f'C-layer-{n}-floor.png');wall.save(REVIEW/f'C-layer-{n}-wall.png')
  prop=Image.open(BASE/f'canon/props/{n}-study.png').convert('RGBA');prop.save(REVIEW/f'C-layer-{n}-prop.png')
  im=floor.copy();im.paste(wall,(0,0),wall);im.alpha_composite(prop,(86,96));im.save(BASE/f'proof/{n}.png');im.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
  sw=Image.open(BASE/f'canon/swatches/{n}.png').convert('RGBA')
  # Native source crop across a slab edge or lava fault: never a shrunken study.
  b={'cave_rock':(120,110,168,134),'cave_crystal':(76,88,124,112),'cave_ice':(32,58,80,82),'cave_lava':(15,108,63,132)}[n]
  sw.paste(f.crop(b),(0,24));sw.save(BASE/f'canon/swatches/{n}.png')
  i=list(SWATCHES).index(n);guide.paste(sw,(48+i%7*240,800+i//7*94))
 guide.save(BASE/'canon/style-guide.png')
 import json
 (REVIEW/'D-cave-crop-cleanup.json').write_text(json.dumps(changes,indent=2)+'\n')
 print({n:len(v) for n,v in changes.items()})
if __name__=='__main__':run()
