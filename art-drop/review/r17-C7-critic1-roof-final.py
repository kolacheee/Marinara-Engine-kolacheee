from pathlib import Path
import importlib.util,json
from PIL import Image
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('paint',R/'r17-C7-critic1-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
ops=[]
for d in [2,3]:
 a=p.register('r17-C7-critic1-source-roof-field-d'+str(d)+'.png',(192,48*d),'roof-final-d'+str(d))
 for w in [1,2,3]:
  x=(192-48*w)//2;b=a.crop((x,0,x+48*w,48*d));b.save(O/f'roof-a-w{w}-d{d}-c7.png');ops.append(dict(file=f'roof-a-w{w}-d{d}-c7.png',source=f'roof-field-d{d}',operation='native frontage crop from independently drawn whole roof depth; full ridge-to-eave retained'))
 for hand,x in [('left',0),('right',144)]:a.crop((x,0,x+48,48*d)).save(O/f'roof-hip-{hand}-d{d}-c7.png')
 if d==3:
  b=a.crop((48,48,96,96));b.paste(b.crop((0,0,48,1)),(0,47));b.paste(b.crop((0,0,1,48)),(47,0));b.save(O/'roof-fill-c7.png')
lean=p.register('r17-C7-critic1-source-lean-roof.png',(48,96),'lean-roof-final')
lean.save(O/'roof-lean-c7r1.png')
b=Image.new('RGBA',(48,144));b.alpha_composite(lean);b.alpha_composite(Image.open(O/'ground-west-w1-c7r1.png'),(0,96));b.save(O/'block-se-wing-c7.png')
# Re-register the independent roof variation; preserve the actual house facade.
fine=p.register('r17-C7-critic1-source-corner-roof-fine.png',(96,96),'corner-roof-fine')
fine.save(O/'roof-corner-c7r1.png')
(R/'r17-C7-critic1-roof-final-operations.json').write_text(json.dumps(ops,indent=2))
