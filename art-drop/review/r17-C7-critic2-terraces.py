from pathlib import Path
import importlib.util,json
from PIL import Image
R=Path('art-drop/review');O=Path('art-drop/out/city17')
s=importlib.util.spec_from_file_location('p',R/'r17-C7-critic2-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
for v in 'ab':p.register(f'r17-C7-critic2-source-terrace-{v}.png',(192,96),'terrace-'+v)
a=Image.open(R/'r17-C7-critic2-clean-terrace-b.png').convert('RGBA')
for depth in [2,3]:
 b=a.copy()
 if depth==3:
  b=Image.new('RGBA',(192,144));b.paste(a.crop((0,0,192,48)));b.paste(a.crop((0,24,192,72)),(0,48));b.paste(a.crop((0,48,192,96)),(0,96))
 for w in [48,96,144]:
  cap=Image.new('RGBA',(w,depth*48));cap.paste(b.crop((0,0,16,depth*48)));cap.paste(b.crop((48,0,48+w-32,depth*48)),(16,0));cap.paste(b.crop((176,0,192,depth*48)),(w-16,0));cap.save(O/f'roof-a-w{w//48}-d{depth}-c7.png')
 for hand,x in [('left',0),('right',144)]:b.crop((x,0,x+48,depth*48)).save(O/f'roof-hip-{hand}-d{depth}-c7.png')
fill=a.crop((72,24,120,72));fill.paste(fill.crop((0,0,48,1)),(0,47));fill.paste(fill.crop((0,0,1,48)),(47,0));fill.save(O/'roof-fill-c7.png')
Image.open(O/'roof-a-w1-d2-c7.png').save(O/'roof-lean-c7r1.png')
(R/'r17-C7-critic2-terrace-selection.json').write_text(json.dumps(dict(selected='B',rejected=['family A: too few rows','family B: oversized tiles','master C: broad hips made separate caps'],reason='B has narrow16px hips, legible ridge/eave and continuous terrace slope; widths crop native interior columns, depth3 wraps one drawn48px slope band without changing tile scale',widths=[48,96,144],depths=[96,144]),indent=2))
p=O/'compose.py';s=p.read_text().replace("dict(id='south-artisans',rect=[624,1056,432,288]", "dict(id='south-artisans',rect=[624,1056,480,288],notches=[[9,y] for y in range(2,6)]")
s=s.replace("road('gate-square',[1104,672,96,288],'main')", "road('gate-square',[1104,672,96,384],'main')")
s=s.replace("road('gate-bend',[1056,960,144,96],'main')", "road('gate-bend',[1056,1152,144,96],'main')")
s=s.replace("road('gate-middle',[1056,1056,96,144],'main')", "road('gate-middle',[1104,1056,96,96],'main')")
s=s.replace("road('gate-widening-T',[1056,1200,144,96],'main')", "road('gate-widening-T',[1056,1248,96,96],'main')")
s=s.replace("road('gate-south',[1056,1296,96,144],'main')", "road('gate-south',[1056,1344,96,96],'main')")
s=s.replace("im.alpha_composite(turn,(1056,960))", "im.alpha_composite(turn,(1104,1152))")
p.write_text(s)
