from pathlib import Path
from PIL import Image,ImageChops
import importlib.util,json
R=Path('art-drop/review');O=Path('art-drop/out/city17')
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic2-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
source=Image.open(R/'r17-C7-critic2-clean-inn.png').convert('RGBA');inn=source.copy()
# Keep the compatible roof selected earlier; no production passing file changes.
inn.paste(Image.open(O/'inn-west-c7r1.png').crop((0,0,96,96)),(0,0))
blank=p.register('r17-C7-critic2-source-inn.png',(64,96),'inn-full-sign-bay',box=(45,962,178,1198),outline=False)
blank.putalpha(source.getchannel('A').crop((0,96,64,192)));inn.paste(blank,(0,96))
# The front plane's complete shutter/sill drawings are translated as whole bays.
# Source plaster replaces their old bounds first, so no cropped window remains.
front=p.register('r17-C7-critic2-source-inn.png',(42,96),'inn-front-plaster',box=(680,805,730,1025),outline=False)
inn.paste(front,(52,96))
for y in [104,152]:inn.alpha_composite(source.crop((58,y,84,y+29)),(68,y))
# Keep the original dark outer contour and timber course, not a new drawn line.
for box,xy in [((94,96,96,192),(94,96)),((48,96,52,192),(48,96)),((52,140,96,145),(52,140)),((0,190,96,192),(0,190))]:inn.paste(source.crop(box),xy)
inn.alpha_composite(Image.open(O/'sign-inn-c7.png').convert('RGBA'),(0,112))
inn.putdata([q if q[3] else (0,0,0,0) for q in inn.get_flattened_data()]);inn.save(O/'inn-west-c7r1.png')
(R/'r17-C7-critic2-inn-mount.json').write_text(json.dumps(dict(sign_size=[64,72],sign_origin=[0,112],blank_bay=[0,96,64,96],whole_windows=[[68,104,26,29],[68,152,26,29]],ground_porches_begin=192,source='r17-C7-critic2-source-inn.png',operation='Source-painted plaster registration; whole native window translation; original timber/contour retained; approved sign composited in clear bay'),indent=2))
