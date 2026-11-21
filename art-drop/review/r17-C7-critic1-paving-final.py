from pathlib import Path
from PIL import Image
import json
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';source=Image.open(R/'r17-C7-critic1-clean-paving.png').convert('RGBA');ops=[]
for i,(x,y) in enumerate([(0,0),(48,0),(96,0),(0,48),(48,48),(96,48),(0,96)]):
 n=f'square-paving-{i}-c7' if i<4 else 'main-paving-c7' if i==4 else f'main-paving-v{i-4}-c7r1'
 a=source.crop((x,y,x+48,y+48));vals=[]
 for r,g,b,al in a.get_flattened_data():
  if r<=110:q=(130,123,105)
  elif i>=4:q=(178,169,145) if r>=150 else (155,146,125)
  else:q=(155,146,125)
  vals.append((*q,al) if al else (0,0,0,0))
 a.putdata(vals);a.paste(a.crop((0,0,48,1)),(0,47));a.paste(a.crop((0,0,1,48)),(47,0));a.save(O/(n+'.png'))
 ops.append(dict(file=n+'.png',operation='painted mortar preserved, close-value stone faces mapped to reference stone ramp',colours=len(set(vals))))
(R/'r17-C7-critic1-paving-final-operations.json').write_text(json.dumps(ops,indent=2))

# Native painted48px corner transition; keep its real kerb, quiet only ground.
a=Image.open(R/'r17-C7-critic1-clean-turn.png').convert('RGBA');data=[]
for y in range(96):
 for x in range(96):
  q=a.getpixel((x,y))
  if x>=3 and y>=3:
   rgb=(130,123,105) if q[0]<=110 else (178,169,145) if q[0]>=150 else (155,146,125);q=(*rgb,q[3])
  data.append(q)
a.putdata(data);a.save(O/'street-turn-c7.png')
