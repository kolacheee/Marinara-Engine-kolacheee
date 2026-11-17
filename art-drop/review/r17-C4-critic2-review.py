"""Focused native before/after and paint selection sheets for critic 2."""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
c=module('c',O/'compose.py');r=module('r',R/'r17-C4-review.py')
old=module('before',R/'r17-C4-critic2-before-compose.py');old.ASSETS=c.ASSETS;old.ART=c.ART;old.REVIEW=c.REVIEW
original_narrow=Image.new('RGBA',(48,144));original_narrow.paste(c.asset('north-shop-court-c4').crop((16,0,64,48)),(0,0));original_narrow.paste(c.asset('roof-ridge-c4-w1'),(0,48))
old.asset=lambda name:original_narrow if name=='north-shop-court-c4-w1' else c.asset(name)
before,_,_=old.r_render(old.c4_city_layout());after=Image.open(R/'r17-city-final.png').convert('RGBA')
boxes={'south-yard':(504,1056,720,1344),'north-court':(984,384,1248,576),'sign-windows':(1584,864,1776,1056),'narrow-court':(1040,1032,1120,1112),'ne-windows':(1392,288,1584,624)}
for n,box in boxes.items():
 a=after.crop(box);r.save(a,'critic2-'+n,(1,4));r.pair([('BEFORE',before.crop(box)),('AFTER',a)],'critic2-before-after-'+n,(1,3))
for side in ('left','right'):
 a=c.c_render(old.c4_proof_layouts()['roof-adapter-'+side])[0];b=c.c_render(c.c4_proof_layouts()['roof-adapter-'+side])[0]
 r.pair([('Before: broken join',a.crop((40,184,200,440))),('After: joined slopes',b.crop((40,184,200,440)))],'critic2-before-after-roof-'+side,(1,3))
for family,ids in [('narrow',['narrow-a','narrow-b']),('roof-left',['roof-left-a','roof-left-b']),('roof-right',['roof-right-a','roof-right-b'])]:
 r.pair([(n+(' SELECTED' if n.endswith('-b') else ' REJECTED'),Image.open(R/f'r17-C4-clean-critic2-{n}.png').convert('RGBA')) for n in ids],'critic2-selection-'+family)
ref=Image.open(R.parent/'reference/r17/fantasy-house-2.png').convert('RGBA')
for v in 'abc':
 s=c.c4_spec(2,2,0,roof='roof-gable-c4-w2');s['panels'][1]='storey-arrangement-'+v+'-c4-w2';house=c.c4_build(s)[0]
 r.pair([('New '+v+' / 2 storeys',house),('House-2 reference',ref)],'critic2-complete-house-'+v)
# Show the 48x48 adapters in their exact original drawing coordinates.
for side in ('left','right'):
 a=Image.open(R/f'r17-C4-clean-critic2-roof-{side}-b.png').convert('RGBA');marked=a.copy();d=ImageDraw.Draw(marked);x=48 if side=='left' else 48
 d.rectangle((x,96,x+47,143),outline='#5ef5de');r.pair([('Native drawing',a),('48x48 extraction',marked),('Adapter',c.asset('roof-adapter-'+side+'-c4'))],'critic2-adapter-registration-'+side)
r.index()
p=R/'r17-C4-review.html';s=p.read_text();s=s.replace('<img src="r17-city-final.png">','<p><a href="r17-C4-critic2-verification.json">Critic-2 repair verification</a> · <a href="r17-C4-critic2-generation.json">Critic-2 prompts and sources</a> · <a href="r17-C4-critic2-response.json">Critic-2 response</a></p><img src="r17-city-final.png">');p.write_text(s)
print('Critic2 focused review sheets complete')
