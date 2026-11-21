"""Register image-tool drawings; assemble only painted source pixels."""
from pathlib import Path
import importlib.util, json
from PIL import Image, ImageChops
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('paint',R/'r17-C7-critic3-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
selections={}
for w,d,v in [(1,2,'c'),(1,3,'c'),(2,2,'a'),(2,3,'b'),(3,2,'a'),(3,3,'b')]:
    n=f'roof-w{w}-d{d}-{v}';a=Image.open(R/f'r17-C7-critic3-clean-{n}.png').convert('RGBA')
    a.save(O/f'roof-a-w{w}-d{d}-c7.png');selections[f'roof-a-w{w}-d{d}-c7']=n
# A short attached slope occupies the lower cell of its existing two-cell canvas.
lean=Image.new('RGBA',(48,96));lean.alpha_composite(Image.open(R/'r17-C7-critic3-clean-lean-a.png').convert('RGBA'),(0,48));lean.save(O/'roof-lean-c7r1.png')
selections['roof-lean-c7r1']='lean-a: complete shallow roof, no elongated slope'
fill=p.register('r17-C7-critic3-source-fill-b.png',(48,48),'fill-selected',palette=p.old.RED+[(43,40,29)],outline=False)
# Register the painted border courses to a single periodic phase.
fill.paste(fill.crop((0,0,48,1)),(0,47));fill.paste(fill.crop((0,0,1,48)),(47,0));fill.save(O/'roof-fill-c7.png')
selections['roof-fill-c7']='fill-b, six-colour terracotta ramp, native edge wrap'
turn=Image.open(R/'r17-C7-critic3-clean-turn-a.png').convert('RGBA')
main=Image.open(O/'main-paving-c7.png').convert('RGBA')
# The drawing supplies the L gutter. The two continuation edges use the
# neighbouring drawing's actual cobble course; no stone geometry is generated.
turn.paste(main.crop((47,0,48,48)),(47,0));turn.paste(main.crop((0,47,48,48)),(0,47));turn.save(O/'street-turn-c7.png')
selections['street-turn-c7']='turn-a, native main-road edge-course registration'
market=Image.open(R/'r17-C7-critic3-clean-market-c.png').convert('RGBA');market.save(O/'market-north-c7.png')
selections['market-north-c7']='market-c: north portico and stair, continuous main roof, closed south wall'
# Masks select painted surfaces. They are not replacement art or geometry.
alpha=market.getchannel('A');roof=Image.new('L',market.size);front=Image.new('L',market.size)
roof.paste(alpha.crop((0,73,192,125)),(0,73))
roof.paste(alpha.crop((0,9,192,35)),(0,9))
for box in [(14,36,20,72),(51,37,56,71),(135,37,140,71),(173,35,181,76),(17,62,74,76),(118,62,177,76)]:front.paste(alpha.crop(box),box[:2])
roof.save(R/'r17-C7-critic3-market-overhead-mask.png');front.save(R/'r17-C7-critic3-market-foreground-mask.png')
source='r17-C7-critic3-source-guildhall-b.png';key=p.key(Image.open(R/source));box=key.getbbox();h=box[3]-box[1]
hall=p.register(source,(192,432),'guildhall-selected',box=box,ycuts=([0,round(h*143/384),round(h*230/384),h],[0,192,288,432]),output=O/'guildhall-c7r1.png')
selections['guildhall-c7r1']='guildhall-b: 432px art; 192x192 ground allocation; turret/main-roof/body registration'
# The failed attached wing uses a modest roof and the retained complete west
# ground face; neither of those painted components is stretched.
s=importlib.util.spec_from_file_location('city',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
wing=Image.new('RGBA',(48,144));wing.alpha_composite(c.c7_tone(lean,'brown'));wing.alpha_composite(c.asset('ground-west-w1-c7r1'),(0,96));wing.save(O/'block-se-wing-c7.png')
selections['block-se-wing-c7']='lean-a over unchanged west ground; one occupied storey'
(R/'r17-C7-critic3-selection.json').write_text(json.dumps(selections,indent=2))
print('Installed',len(selections),'failed production pieces')
