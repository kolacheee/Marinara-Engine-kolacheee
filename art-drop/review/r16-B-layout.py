"""Select irregular placement of already-drawn banks. Does not draw pixels."""
import importlib.util,random,json
from pathlib import Path
import numpy as np
from PIL import Image
p=Path(__file__).with_name('r16-B-build.py')
spec=importlib.util.spec_from_file_location('build',p);b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
parts=[b.rgba_weather(b.soften_drawn_contour(np.array(Image.open(b.REVIEW/f'r16-B-clean-fog-b-{i}.png')))[0],'fog') for i in range(6)]
rng=random.Random(1616);best=[]
for trial in range(3500):
 instances=[]
 for i,part in enumerate([0,1,2,3,4,5,0,2,4,5]):
  h,w=parts[part].shape[:2];moving=i<4
  x=rng.randint(9,182-w) if moving else rng.randrange(192)
  y=rng.randint(9,182-h) if moving else rng.randrange(192)
  instances.append({'part':part,'x':x,'y':y,'moving':moving,'phase':i%4})
 a=b.render(parts,instances,0);mask=a[:,:,3]>0;cover=mask.mean()
 if not .43<cover<.49:continue
 row=mask.mean(1);col=mask.mean(0)
 rs=sum(np.roll(row,k) for k in range(24))/24;cs=sum(np.roll(col,k) for k in range(24))/24
 score=rs.std()*5+cs.std()*2+max(0,.07-row.min())*2+max(0,row.max()-.90)*2+abs(cover-.46)
 if not best or score<best[0]:best=[float(score),trial,instances,a]
score,trial,instances,a=best
(b.REVIEW/'r16-B-layout.json').write_text(json.dumps({'seed':1616,'trials':3500,'selected_trial':trial,'score':score,'instances':instances},indent=2)+'\n')
ref=Image.open(b.REF/'ref-fantasy-grass.png');im=b.composite(b.tiled_ref(ref,(576,576)),np.tile(a,(3,3,1)))
b.save(im,'r16-B-placement-review.png')
print(json.dumps({'trial':trial,'score':score,'stats':b.stats(a),'instances':instances},indent=2))
