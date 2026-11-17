"""Focused native evidence for the C3 critic repair. Marks are review-only."""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
BG=(47,51,43,255)
def save(a,n,z=(1,3)):
    for f in z:a.resize((a.width*f,a.height*f),c.NEAREST).save(R/f'r17-C3-critic1-{n}-{f}x.png')
l=c.c3_city_layout();city,_,_=c.r_render(l)
for n,box in {'west-width':(144,528,528,816),'staggered-northeast':(1368,288,1608,672),'staggered-west':(144,288,432,672),'square-side':(1032,432,1344,816),'inn-roofs':(1296,696,1488,1056),'gate-paving':(1056,768,1488,1200),'court':(216,768,384,1056)}.items():
    a=city.crop(box);save(a,n,(1,2,3) if n=='square-side' else (1,3));save(a.convert('L'),n+'-squint',(1,))
cap=c.asset('roof-hip-deep-c3-w2');spec=c.c3_front(2,2,91,'roof-hip-deep-c3-w2');spec.update(roof_depth=4,roof_fill_file='roof-fill-hip-c3-w2',roof_fill_split=96)
deep,parts=c.build(spec);out=c.repeat(c.asset('cobble-c3'),(640,336));d=ImageDraw.Draw(out)
for a,x,label in [(cap,8,'3-cell cap'),(c.asset('roof-fill-hip-c3-w2'),112,'native fill'),(deep,224,'cap + fill + facade'),(c.asset('roof-hip-dormer-c3-w2'),336,'dormer on left slope'),(c.asset('roof-hip-chimney-c3-w2'),448,'chimney on left slope')]:
    out.alpha_composite(a,(x,32));d.text((x,12),label,fill='black')
save(out,'cap-fill-and-accents',(1,4))
# Exact three-cell/four-cell cap contacts and two extension cells, all native.
out=c.repeat(c.asset('cobble-c3'),(320,352));d=ImageDraw.Draw(out)
for j,depth in enumerate((3,4,5)):
    s=dict(spec,roof_depth=depth);a,_=c.build(s);out.alpha_composite(a,(j*104,352-a.height));d.text((j*104+2,4),f'{depth} cells / separate fill',fill='black')
save(out,'directional-fill-seams',(1,4))
out=Image.new('RGBA',(432,336),BG);d=ImageDraw.Draw(out)
for j,key in enumerate(('road-a','road-b')):
    a=Image.open(R/f'r17-C3-critic1-clean-{key}.png');out.alpha_composite(a,(8+j*216,32));d.text((8+j*216,8),key+(' / selected' if j else ' / rejected'),fill='white')
save(out,'road-selection',(1,3))
ground=c.c3_ground(l);save(ground.crop((1008,720,1536,1440)),'connected-road-material',(1,3))
# Clearance is tested against actual opaque paint. Reveal only documented
# overhead pixels, retaining footings and independently drawn supports.
for name,box,actor in [('west', (432,576,624,816),(520,716)),('east',(1488,624,1680,864),(1528,760))]:
    test=json.loads(json.dumps(l));test['props'].append(dict(file='person',path='review/r15-M-clean-folk-b-2.png',x=actor[0],base=actor[1],id='proof-walker',role='passing beneath documented roof projection'))
    normal,_,_=c.r_render(test);reveal,_,_=c.r_render(test,reveal=True)
    a=normal.crop(box);b=reveal.crop(box);out=Image.new('RGBA',(a.width*2+16,a.height+32),BG);d=ImageDraw.Draw(out)
    out.alpha_composite(a,(0,32));out.alpha_composite(b,(a.width+16,32));d.text((4,8),'NORMAL / overhead roof',fill='white');d.text((a.width+20,8),'REVEAL / supports retained',fill='white')
    ax,ay=actor[0]-box[0],actor[1]-box[1]+32
    for dx in (0,a.width+16):d.rectangle((ax-2+dx,ay-33,ax+18+dx,ay+2),outline=(255,230,55,255))
    save(out,name+'-route-player-reveal',(1,3))
print('Focused C3 redraw review sheets complete')
