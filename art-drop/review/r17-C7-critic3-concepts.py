"""Repair the painted target, registering the drawn southern lane to 48px."""
from pathlib import Path
import importlib.util,json
from PIL import Image
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
def module(n,path):
 s=importlib.util.spec_from_file_location(n,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
p=module('paint',R/'r17-C7-critic3-process.py');j=module('join',R/'r17-C7-critic1-concepts.py')
# Measured painted threshold / first south-curtain merlon in each reduced
# inspection. Registration stretches no roof band to manufacture roof depth.
landmarks={('a','sw'):(474,501),('a','se'):(470,500),('b','sw'):(461,488),('b','se'):(472,500),('c','sw'):(450,485),('c','se'):(461,482)}
records=[]
for v in 'abc':
 parts={}
 for side,w in [('sw',1200),('se',816)]:
  source=f'r17-C7-critic3-source-concept-{v}-{side}.png';src=Image.open(R/source);h=src.height;t,wall=landmarks[v,side]
  a=p.register(source,(w,576),f'concept-{v}-{side}-registered',box=(0,0,*src.size),outline=False,
      ycuts=([0,round(h*144/576),round(h*t/576),round(h*wall/576),h],[0,144,432,480,576]))
  bg=Image.new('RGB',a.size,(255,0,255));bg.paste(a,mask=a.getchannel('A'));parts[side]=bg
  records.append(dict(concept=v,section=side,source=source,source_size=list(src.size),native_size=list(a.size),painted_threshold=t,painted_wall=wall,registered_lane=[432,480],source_is_larger=src.width>w and src.height>576))
 lower,seam=j.seam_join(parts['sw'],parts['se'],1104);lower=p.key(lower)
 original=Image.open(R/'r17-C7-critic3-before'/f'r17-concept-{v}.png').convert('RGBA')
 # The preceding concepts already came from larger full paintings. Preserve
 # their accepted northern drawing, replacing the newly repainted lower part.
 original.paste(lower.crop((0,144,1920,576)),(0,1008))
 # The selected whole civic/market paintings set the repaired architectural
 # target before the city is reassembled. Their paint is reused, not redrawn.
 original.alpha_composite(Image.open(O/'guildhall-c7r1.png').convert('RGBA'),(816,240))
 market=Image.open(O/'market-north-c7.png').convert('RGBA')
 original.alpha_composite(market,(816,1056))
 original.putdata([q if q[3] else (0,0,0,0) for q in original.get_flattened_data()])
 original.save(R/f'r17-concept-{v}.png')
(R/'r17-C7-critic3-concept-registration.json').write_text(json.dumps(records,indent=2))
print('Three corrected native targets; B retained for connected roof network.')
