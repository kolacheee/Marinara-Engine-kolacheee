"""Focused native C assemblies; all visible art is a crop/composite of drawings."""
from pathlib import Path
from PIL import Image, ImageDraw
import importlib.util
R=Path(__file__).resolve().parent;A=R.parent;O=A/'out/city17';NN=Image.Resampling.NEAREST
sp=importlib.util.spec_from_file_location('c',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
house=Image.open(A/'reference/r17/fantasy-house-2.png').convert('RGBA');bg=(40,45,36,255)
def proof(name,title,a):
 for scale in (1,4):
  h=max(a.height,house.height);im=Image.new('RGBA',((a.width+house.width+24)*scale+24,h*scale+48),bg);ImageDraw.Draw(im).text((12,10),title+f' / exact{scale}x',fill='white');im.alpha_composite(a.resize((a.width*scale,a.height*scale),NN),(12,32+(h-a.height)*scale));im.alpha_composite(house.resize((house.width*scale,house.height*scale),NN),(12+(a.width+12)*scale,32+(h-house.height)*scale));im.save(R/f'r17-C-critic2-proof-{name}-{scale}x.png')
for direction in ('E','W'):
 a,_=c.build_c(dict(view='side',direction=direction,depth=2,floors=3));proof('side-'+direction,'Three floors / ground, upper and roof corners aligned '+direction,a)
a,_=c.build_c(dict(view='side',direction='E',depth=3,floors=3));proof('side-d3','Three-cell depth / same native material scale',a)
for w in (1,2,3):
 a,_=c.build_c(dict(view='back',width=w,floors=3,back='stair'));proof('stair-'+str(w),'Three supported stair galleries with connecting boundary landings',a)
layout=c.c_connected_layout();whole,_=c.c_render(layout)
for i,n in enumerate(['outer-L','inner','tee','outer-R','deadend']):
 x=(i%3)*384;y=(i//3)*432;a=whole.crop((x,y,x+336,y+432));proof('connected-'+n,'Connected '+n+' / perpendicular roof wing, front and rear contact',a)
 jx=x+96;jy=y+48;join=whole.crop((jx-8,jy,jx+(144 if n=='tee' else 96)+8,jy+192))
 join.resize((join.width*4,join.height*4),NN).save(R/f'r17-C-critic2-join-{n}-4x.png')
f=c.repeat(c.context('town_ground'),(192,192))
for y in (0,48,96):f.alpha_composite(c.asset('fence-1'),(36,y))
for x in (48,96,144):f.alpha_composite(c.asset('fence-0'),(x,120))
f.alpha_composite(c.asset('yard-3'),(80,64));proof('fence-corner','Continuous N-S rails and horizontal fence corner / clustered tub tree',f)
mud=c.repeat(c.context('town_ground'),(144,288))
for y in range(0,288,48):mud.alpha_composite(c.asset('mud-edge'),(48,y))
proof('mud-long-edge','Six-cell verge / no S-ribbon stamp',mud)
roads=[dict(file='street-main',rect=[0,96,288,96],horizontal=True),dict(file='street-side',rect=[120,0,48,288])]
layout=dict(size=[288,288],roads=roads,lots=[],props=[],kerb_turns=[dict(x=112,y=88),dict(x=168,y=88,rotate=90),dict(x=112,y=192,rotate=270),dict(x=168,y=192,rotate=180)])
a,_=c.c_render(layout);proof('street-junction','Open main/side crossing with drawn kerb/gutter turns',a)
# Whole exported surfaces, not merely the small adapter used by the scene.
native=Image.new('RGBA',(384,240),bg);d=ImageDraw.Draw(native)
x=0
for n in ('street-main','street-side','street-junction','street-junction-turn'):
 a=c.asset(n);native.alpha_composite(a,(x,16));x+=a.width
d.text((0,0),'main | side | junction | full turn',fill='white')
native.alpha_composite(c.repeat(c.asset('street-junction'),(144,144)),(0,80))
native.alpha_composite(c.repeat(c.asset('street-junction-turn'),(144,144)),(156,80))
d.text((306,82),'used',fill='white');d.text((306,94),'crop',fill='white')
native.alpha_composite(c.asset('street-junction-turn').crop((4,17,13,26)),(306,112))
proof('paving-fields','Full paving tiles and literal3x3 fields; cropped kerb shown separately',native)
market=c.c_layouts()['market'];ground=c.c_ground(tuple(market['size']),market['roads']);after,_=c.c_render(market)
sheet=Image.new('RGBA',(800,540),bg);d=ImageDraw.Draw(sheet)
for j,(title,scene) in enumerate([('unshadowed receiving ground',ground),('east receiver at816..827',after)]):
 d.text((12+j*380,12),title,fill='white');patch=scene.crop((800,136,840,248));sheet.alpha_composite(patch.resize((160,448),NN),(12+j*380,36))
sheet.save(R/'r17-C-critic2-east-shadow-4x.png')
print('Focused C assembly and contact proofs saved.')
