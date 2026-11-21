from pathlib import Path
import importlib.util
from PIL import Image
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic1-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
for src,families,ys in [('narrow-front',['a','b'],[0,858,1244]),('narrow-side',['west'],[0,726,1144])]:
 source='r17-C7-critic1-source-'+src+'.png';keyed=p.key(Image.open(R/source));box=keyed.getbbox();ys=ys+[box[3]-box[1]]
 a=p.register(source,(48,192),src+'-final',ycuts=(ys,[0,96,144,192]))
 for f in families:
  a.save(O/f'house-{f}-w1-c7r1.png')
  for kind,ya in [('roof',0),('storey',96),('ground',144)]:
   b=a.crop((0,ya,48,ya+(96 if kind=='roof' else 48)))
   if kind!='roof':
    donor=Image.open(O/'ground-shop-w2-c0.png')
    for yy in [0,47]:b.paste(donor.crop((0,yy,48,yy+1)),(0,yy))
   b.save(O/f'{kind}-{f}-w1-c7r1.png')
roof=p.register('r17-C7-critic1-source-corner-roof-fine.png',(144,96),'corner144-fine-final')
a=Image.open(O/'corner-house-c7.png').convert('RGBA');a.paste((0,0,0,0),(0,0,144,96));a.alpha_composite(roof);a.save(O/'corner-house-c7.png')
# Complete one-cell return with a ground door and a whole modest roof plane.
b=Image.new('RGBA',(48,144));b.alpha_composite(Image.open(O/'roof-lean-c7r1.png'));b.alpha_composite(Image.open(O/'ground-west-w1-c7r1.png'),(0,96));b.save(O/'block-se-wing-c7.png')
