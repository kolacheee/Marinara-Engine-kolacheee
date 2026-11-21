"""Join fresh enlarged drawings of the fixed-layout concept views."""
from pathlib import Path
import importlib.util, json, shutil
from PIL import Image
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
def module(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
j=module('joiner',R/'r17-C7-critic1-concepts.py')
p=module('paint',R/'r17-C7-critic2-process.py')
old=R/'r17-C7-critic2-concept-registration.json'
archive=R/'r17-C7-critic2-concept-pre-grid-registration.json'
if not archive.exists():shutil.copyfile(old,archive)
records=[]
for v in 'abc':
    prior=R/f'r17-C7-critic2-concept-{v}-pre-grid.png'
    if not prior.exists():shutil.copyfile(R/f'r17-concept-{v}.png',prior)
    imgs={q:Image.open(R/f'r17-C7-critic2-source-concept-{v}-grid-{q}.png').resize((1448,1086),Image.Resampling.BOX) for q in ['nw','ne','sw','se']}
    top,_=j.seam_join(imgs['nw'],imgs['ne'],1240)
    bottom,_=j.seam_join(imgs['sw'],imgs['se'],1240)
    whole,_=j.seam_join(top.transpose(Image.Transpose.TRANSPOSE),bottom.transpose(Image.Transpose.TRANSPOSE),930)
    whole=whole.transpose(Image.Transpose.TRANSPOSE)
    source=f'r17-C7-critic2-source-concept-{v}-grid-composite.png';whole.save(R/source)
    a=p.register(source,(1920,1440),'concept-'+v+'-grid',box=(0,0,2688,2016))
    # Restore the required external north ditch from existing painted art.
    # This is a literal tile wrap behind the opaque wall silhouette.
    out=Image.new('RGBA',a.size);ditch=Image.open(O/'ditch-c3.png').convert('RGBA')
    for x in range(0,1920,ditch.width):out.alpha_composite(ditch,(x,0))
    out.alpha_composite(a);out.save(R/f'r17-concept-{v}.png')
    records.append(dict(concept=v,source=source,source_size=list(whole.size),native_size=[1920,1440],section_size=[1448,1086],overlap=[208,156],guide=f'r17-C7-critic2-source-concept-{v}-grid-guide.png',layout_guide='r17-C7-critic2-concept-layout-guide.png',operation='Fresh large section drawings; minimum-difference source-pixel seams; reference palette; exact64-vote mode; hard alpha and one-pixel cleanup; existing painted ditch wrapped behind north wall',plan='The measured nine-block plan is the paintover guide. Concept strokes are projected art; exact composer clearances are separately audited.'))
(R/'r17-C7-critic2-concept-registration.json').write_text(json.dumps(records,indent=2))
