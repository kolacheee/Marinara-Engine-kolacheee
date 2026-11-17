"""Saved-art inspection crops. No shape or texture generation."""
from pathlib import Path
import importlib.util
from PIL import Image, ImageDraw
REV=Path(__file__).resolve().parent
OUT=REV.parent/'out/city17'
sp=importlib.util.spec_from_file_location('city',OUT/'compose.py')
city=importlib.util.module_from_spec(sp);sp.loader.exec_module(city)
NN=Image.Resampling.NEAREST

def scaled(a,name,scale):
    city.save(a.resize((a.width*scale,a.height*scale),NN),name)

for name in ['roof-fill-w1','roof-valley','roof-hip-end','firewall-w0','dormer-3']:
    scaled(city.asset(name),'critic1-detail-'+name+'-8x',8)

# Exact 3x scene crops keep image viewers from shrinking the whole wide canvas.
for name,boxes in {
    'L-block':[(0,0,384,192),(384,0,768,192),(0,240,336,576),(336,240,768,576)],
    'market':[(0,0,432,288),(432,0,864,288),(0,288,432,576),(432,288,864,576),(0,576,432,864),(432,576,864,864)],
    'height-test':[(0,0,336,480),(336,0,672,480)],
}.items():
    a=Image.open(REV/f'r17-B-critic-{name}-3x.png')
    for i,b in enumerate(boxes):city.save(a.crop(tuple(v*3 for v in b)),f'critic1-section-{name}-{i+1}-3x')

join=city.joined_l_roof(0)
scaled(join.crop((24,120,120,216)),'critic1-gutter-elbow-8x',8)
scaled(join.crop((240,144,336,240)),'critic1-terminal-hip-8x',8)

# Inspect the actual redrawn masks at full depth and the five-storey reach.
proof=Image.new('RGBA',(400,312),(52,58,52,255));d=ImageDraw.Draw(proof)
for i,w in enumerate([2,3]):
    a=city.asset(f'shadow-street-w{w}-c0')
    for j,reach in enumerate([32,30]):
        x=8+j*192;y=24+i*76
        p=city.repeat(city.context('street'),(w*48,48))
        p.alpha_composite(a.crop((0,0,a.width,reach)))
        d.text((x,y-16),f'w{w}: {reach}px reach',fill='white');proof.alpha_composite(p,(x,y))
east=city.repeat(city.asset('shadow-street-w3-c0').crop((12,0,132,32)).transpose(Image.Transpose.ROTATE_270),(30,120))
p=city.repeat(city.context('street'),(80,120));p.alpha_composite(east)
proof.alpha_composite(p,(8,184));d.text((100,192),'continuous 30px east receiver',fill='white')
city.scales(proof,'critic1-shadow-full-depth',(1,4))

print('Refreshed exact scene sections, join details and full-depth shadow proofs.')
