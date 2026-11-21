from pathlib import Path
import importlib.util,json
from PIL import Image
R=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('joiner',R/'r17-C7-critic1-concepts.py');j=importlib.util.module_from_spec(s);s.loader.exec_module(j)
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic2-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
records=[]
for v in 'abc':
 imgs={q:Image.open(R/f'r17-C7-critic2-source-concept-{v}-{q}.png').resize((1448,1086),Image.Resampling.BOX) for q in ['nw','ne','sw','se']}
 top,_=j.seam_join(imgs['nw'],imgs['ne'],1234);bottom,_=j.seam_join(imgs['sw'],imgs['se'],1234)
 whole,_=j.seam_join(top.transpose(Image.Transpose.TRANSPOSE),bottom.transpose(Image.Transpose.TRANSPOSE),925);whole=whole.transpose(Image.Transpose.TRANSPOSE)
 fn=f'r17-C7-critic2-source-concept-{v}-composite.png';whole.save(R/fn)
 p.register(fn,(1920,1440),'concept-'+v,box=(0,0,2682,2011),output=R/f'r17-concept-{v}.png')
 records.append(dict(concept=v,source=fn,source_size=whole.size,native_size=[1920,1440],section_size=[1448,1086],overlap=[214,161],operation='minimum-difference source-pixel seam; palette lock; exact64-vote mode; no blending or procedural geometry'))
(R/'r17-C7-critic2-concept-registration.json').write_text(json.dumps(records,indent=2))
