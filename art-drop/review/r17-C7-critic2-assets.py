from pathlib import Path
import importlib.util,json
from PIL import Image,ImageChops
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic2-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
j=json.loads((R/'critic-r17C7-2.json').read_text());ops=[]
def read(n):return Image.open(O/(n+'.png')).convert('RGBA')
def clean(n):return Image.open(R/f'r17-C7-critic2-clean-{n}.png').convert('RGBA')
def save(n,a,method):
 assert n in j['failed'],n
 a.putdata([q if q[3] else (0,0,0,0) for q in a.get_flattened_data()]);a.save(O/(n+'.png'));ops.append(dict(file=n,size=a.size,operation=method))
def course(a):
 d=read('ground-shop-w2-c0')
 for y in (0,47):
  for x in range(a.width):a.putpixel((x,y),d.getpixel((0 if x==0 else 95 if x==a.width-1 else 1,y)))
 return a
def width(a,w):
 # Preserve native16px handed hips and shingle scale. Crop complete interior
 # tile columns; do not squeeze tiles or window bays to manufacture a return.
 if w==144:return a.copy()
 cuts=[(0,32),(80,144)] if w==96 else [(0,16),(64,80),(128,144)]
 out=Image.new('RGBA',(w,a.height));x=0
 for l,r in cuts:out.paste(a.crop((l,0,r,a.height)),(x,0));x+=r-l
 return out
for d in (2,3):
 a=p.register('r17-C7-critic2-source-roof-master-c.png',(144,d*48),'roof-depth-'+str(d))
 for w in (1,2,3):save(f'roof-a-w{w}-d{d}-c7',width(a,w*48),'Image-tool roof master C; exact palette/mode reduction, native interior-column registration preserving handed hips')
 for hand,x in [('left',0),('right',96)]:save(f'roof-hip-{hand}-d{d}-c7',a.crop((x,0,x+48,d*48)),'Drawn handed hip and complete eave, native crop of new roof depth')
a=read('roof-a-w3-d2-c7');fill=a.crop((48,32,96,80))
# Tile wrapping is permitted; only existing painted edge pixels are copied.
fill.paste(fill.crop((0,0,48,1)),(0,47));fill.paste(fill.crop((0,0,1,48)),(47,0))
save('roof-fill-c7',fill,'Quiet drawn surface only, edge wrapped for literal repeat; never used as a block roof volume')
save('roof-lean-c7r1',read('roof-a-w1-d2-c7'),'Complete new pitched48x96 wing with ridge, contact and eave')
corner=clean('corner-b');save('corner-house-c7',corner,'Selected alternate slate corner B, three48px occupied courses, different bays and dormer')
for kind,y in [('ground',192),('storey',96)]:save(kind+'-corner-w3-c7',course(corner.crop((0,y,144,y+48))),'Native new corner course with independently transferred exposed endpoints')
save('roof-corner-c7r1',width(clean('corner-a').crop((0,0,144,96)),96),'New complete hip/dormer assembly, native interior-column registration without tile rescale')
west=clean('west-a');save('house-west-w1-c7r1',west,'Selected complete one-cell west assembly A with readable porch/door, single wide upper bay and native return')
for kind,y in [('ground',144),('storey',96),('roof',0)]:
 a=west.crop((0,y,48,y+(96 if kind=='roof' else 48)))
 if kind!='roof':a=course(a)
 save(kind+'-west-w1-c7r1',a,'Complete new west-facing drawing; native structural extraction and correct endpoint course')
wing=Image.new('RGBA',(48,144));wing.alpha_composite(read('roof-lean-c7r1'));wing.alpha_composite(read('ground-west-w1-c7r1'),(0,96))
# Use the family's source palette remapping, not a different drawing scale.
spec=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
save('block-se-wing-c7',c.c7_tone(wing,'brown'),'Attached one-cell wing, new drawn pitched roof and west entrance; brown palette partner')
inn=clean('inn');old=read('inn-west-c7r1');inn.paste(old.crop((0,0,96,96)),(0,0))
blank=p.register('r17-C7-critic2-source-inn.png',(48,48),'inn-blank-bay',box=(45,962,178,1198),outline=False)
# Keep the actual painted side silhouette, register the source's blank plaster
# bay as a whole bay, then mount the unchanged approved physical sign.
blank.putalpha(inn.getchannel('A').crop((0,144,48,192)));inn.paste(blank,(0,144));inn.alpha_composite(read('sign-inn-c7'),(0,144))
save('inn-west-c7r1',inn,'New west porch/body; retained compatible roof; source-painted blank mounting bay and approved sign clear of windows and doorway')
# New transition paint supplies the centre, approved road edge joints supply
# its boundary so the paving phase remains continuous through the square jog.
a=clean('paving-turn');road=read('main-paving-c7')
# Palette match only to the existing road palette keeps ground subordinate.
palette=sorted(set(q[:3] for q in road.get_flattened_data() if q[3]));pal=Image.new('P',(1,1));pal.putpalette([v for rgb in palette+[palette[-1]]*(256-len(palette)) for v in rgb]);a=a.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGBA')
for box,xy in [((0,0,48,4),(0,0)),((0,44,48,48),(0,44)),((0,0,4,48),(0,0)),((44,0,48,48),(44,0))]:a.paste(road.crop(box),xy)
save('street-turn-c7',a,'Image-tool transition repainted, palette matched, drawn road edge joints registered; kerbs remain outside96px route')
(R/'r17-C7-critic2-native-operations.json').write_text(json.dumps(ops,indent=2));print('Saved',len(ops),'failed assets only')
