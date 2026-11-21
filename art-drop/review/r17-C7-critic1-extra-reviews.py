from pathlib import Path
import importlib.util,json
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';NN=Image.Resampling.NEAREST
spec=importlib.util.spec_from_file_location('review',R/'r17-C7-review.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
pairs=[]
for kind in ['ground','storey']:
 for w in [1,2]:
  names=[f'{kind}-{f}-w{w}-c7r1' for f in ['a','b','west','east','north']];unit=w*48;a=v.ground((unit*2*5,48*5))
  for row,n in enumerate(names):
   for col,m in enumerate(names):a.alpha_composite(v.asset(n),(col*unit*2,row*48));a.alpha_composite(v.asset(m),(col*unit*2+unit,row*48))
  v.save('critic1-'+kind+'-w'+str(w)+'-all-25-pairs',a,(1,3),'variant contacts')
roofs=[]
for d in [2,3]:
 for w in [1,2,3]:roofs.append((f'w{w}/d{d}',v.asset(f'roof-a-w{w}-d{d}-c7')))
v.save('critic1-roof-family',v.panel(roofs),(1,3),'roof depths')
rows=[]
for n,title in [('r17-C7-critic1-clean-roof-w2-d2-b.png','Rejected ruled tile rows'),('r17-C7-critic1-clean-roof-final-d2.png','Selected quiet2-cell roof'),('r17-C7-critic1-clean-roof-final-d3.png','Independent3-cell source')]:rows.append((title,v.read(R/n)))
v.save('critic1-roof-selection',v.panel(rows),(1,3),'selection')
spec=importlib.util.spec_from_file_location('paint',R/'r17-C7-critic1-process.py');p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
for family,size,chosen in [('gate',(192,192),'gate-assembly-c7'),('market',(192,144),'market-north-c7')]:
 variants=[]
 for letter in 'ab':
  name=family+'-'+letter;a=p.register(f'r17-C7-critic1-source-{name}.png',size,'review-variant-'+name);variants.append((name+' / rejected',a))
 variants.append((family+'-c / selected',v.asset(chosen)));v.save('critic1-'+family+'-selection',v.panel(variants),(1,3),'selection')
cat=json.loads((R/'r17-C7-sheets.json').read_text());cat=[i for i in cat if i['file'] not in {x['file'] for x in v.catalog}]+v.catalog;(R/'r17-C7-sheets.json').write_text(json.dumps(cat,indent=2))
p=R/'r17-C7-review.html';html=p.read_text().split('<section><h2>Critic1 drawing selections')[0];html+='<section><h2>Critic1 drawing selections and complete course pairings</h2>'
for i in v.catalog:
 if i['scale']==1:html+='<details><summary>'+i['file']+'</summary><img loading="lazy" src="'+i['file']+'"></details>'
p.write_text(html+'</section>')
print('Added',len(v.catalog),'variant/depth/selection sheets')
