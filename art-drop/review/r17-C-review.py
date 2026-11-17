"""Part C review sheets; labels/diagrams are review-only, art is composited."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops
import json,hashlib,html,importlib.util
R=Path(__file__).resolve().parent;ART=R.parent;O=ART/'out/city17';NN=Image.Resampling.NEAREST
HOUSE=Image.open(ART/'reference/r17/fantasy-house-2.png').convert('RGBA')
GROUND=Image.open(R/'r17-A-context-town_ground.png').convert('RGBA')
BG=(40,45,36,255)
def repeat(a,size):
 im=Image.new('RGBA',size)
 for y in range(0,size[1],a.height):
  for x in range(0,size[0],a.width):im.alpha_composite(a,(x,y))
 return im

def exports():
 records=json.loads((R/'r17-C-generation.json').read_text())
 names=sorted({r['output'] for r in records if r.get('selected') and not r.get('review_only')}|{'side-ground','side-storey'})
 redraw=json.loads((R/'r17-C-critic1-generation.json').read_text())
 names=sorted(set(names)|{r['output'] for r in redraw if r.get('selected')}|{f'back-plain-ground-w{w}' for w in (1,2,3)})
 return names

def mount(name,a):
 if name.startswith(('yard-','fence-','mud-edge')):
  im=repeat(GROUND,a.size);im.alpha_composite(a);return im
 return a

def run():
 names=exports();stats=[];links=[]
 for name in names:
  a=Image.open(O/(name+'.png')).convert('RGBA');b=mount(name,a);w,h=a.size
  W=48+w+HOUSE.width+4*w+4*HOUSE.width;H=86+max(h,HOUSE.height)*4
  sheet=Image.new('RGBA',(W,H),BG);d=ImageDraw.Draw(sheet);d.text((12,10),f'{name} / native1x + exact nearest-neighbour4x / fantasy-house-2',fill='white')
  x=12;baseline=55+HOUSE.height
  sheet.alpha_composite(b,(x,baseline-h));sheet.alpha_composite(HOUSE,(x+w+8,baseline-HOUSE.height))
  x+=w+HOUSE.width+20;sheet.alpha_composite(b.resize((w*4,h*4),NN),(x,55+max(h,HOUSE.height)*4-h*4));sheet.alpha_composite(HOUSE.resize((576,576),NN),(x+w*4+8,55+max(h,HOUSE.height)*4-576))
  sheet.save(R/f'r17-C-file-{name}.png');links.append(f'r17-C-file-{name}.png')
  vals=list(a.get_flattened_data());stats.append(dict(file=name+'.png',size=[w,h],bounds=a.getbbox(),colours=len({p[:3] for p in vals if p[3]}),alpha=sorted({p[3] for p in vals}),opaque=sum(p[3]==255 for p in vals),hash=hashlib.sha256(a.tobytes()).hexdigest()))
  # Literal side-by-side and vertically stacked repetitions; variant neighbour
  # follows a compatible family at the same native dimensions.
  family=(name.split('-w')[0] if '-w' in name else name.replace('-W','').replace('-E',''))
  candidates=[n for n in names if n!=name and Image.open(O/(n+'.png')).size==a.size and (n.startswith(family) or (name.startswith('back-') and n.startswith('back-')))]
  other=candidates[0] if candidates else name;variant=Image.open(O/(other+'.png')).convert('RGBA')
  seam=Image.new('RGBA',(w*3,h*2))
  for y in (0,h):
   seam.alpha_composite(a,(0,y));seam.alpha_composite(a,(w,y));seam.alpha_composite(variant,(w*2,y))
  if name.startswith(('yard-','fence-','mud-edge')):
   bg=repeat(GROUND,seam.size);bg.alpha_composite(seam);seam=bg
  for scale in (1,4):
   out=Image.new('RGBA',(max(480,seam.width*scale+24),seam.height*scale+48),BG);di=ImageDraw.Draw(out);di.text((12,10),f'{name} | itself | {other} / {scale}x',fill='white');out.alpha_composite(seam.resize((seam.width*scale,seam.height*scale),NN),(12,32));out.save(R/f'r17-C-seam-{name}-{scale}x.png')
  if name.startswith('street-') or name in ('lane','mud-edge'):
   tiled=repeat(a,(w*3,h*3))
   if name=='mud-edge':bg=repeat(GROUND,tiled.size);bg.alpha_composite(tiled);tiled=bg
   for scale in (1,4):tiled.resize((tiled.width*scale,tiled.height*scale),NN).save(R/f'r17-C-repeat-{name}-{scale}x.png')
 # All exports, including aliases, are represented in literal native/4x atlases.
 for page in range((len(names)+3)//4):
  subset=names[page*4:page*4+4]
  row_heights=[max(240,max((Image.open(O/(n+'.png')).height*5+64 for n in subset[i:i+2]),default=240)) for i in (0,2)]
  W=1900;H=max(770,sum(row_heights)+40);sheet=Image.new('RGBA',(W,H),BG);d=ImageDraw.Draw(sheet)
  d.text((1320,10),'fantasy-house-2 / 1x and 4x',fill='white');sheet.alpha_composite(HOUSE,(1320,34));sheet.alpha_composite(HOUSE.resize((576,576),NN),(1320,190))
  for i,n in enumerate(subset):
   a=mount(n,Image.open(O/(n+'.png')).convert('RGBA'));x=12+(i%2)*650;y=15+(row_heights[0] if i//2 else 0)
   d.text((x,y),n,fill='white');sheet.alpha_composite(a,(x,y+24));sheet.alpha_composite(a.resize((a.width*4,a.height*4),NN),(x,y+a.height+38))
  sheet.save(R/f'r17-C-atlas-{page:02}.png');links.append(f'r17-C-atlas-{page:02}.png')
 (R/'r17-C-files.json').write_text(json.dumps(stats,indent=2)+'\n')
 # Assembled stack/contact proofs include unlike A/C walls and shared B/C eaves.
 sp=importlib.util.spec_from_file_location('compose',O/'compose.py');c=importlib.util.module_from_spec(sp);sp.loader.exec_module(c)
 for width in (1,2,3):
  images=[]
  for kind in ('plain','stair'):
   im,_=c.build_c(dict(view='back',width=width,floors=3,back=kind));images.append(im)
  native=Image.new('RGBA',(width*96+144,240),BG)
  for i,a in enumerate(images):native.alpha_composite(a,(i*width*48,0))
  native.alpha_composite(HOUSE,(width*96,96))
  for scale in (1,4):native.resize((native.width*scale,native.height*scale),NN).save(R/f'r17-C-back-stack-w{width}-{scale}x.png')
 # Court clearance/cutaway demonstration uses the same art and a drawn actor.
 pilot=c.pilot_c();pilot['props'].append(dict(file='pilot-person',path='review/r17-C-pilot-person.png',x=40,base=230))
 normal,_=c.c_render(pilot);cut,_=c.c_render(pilot,cutaway=True)
 cutproof=Image.new('RGBA',(800,450),BG);d=ImageDraw.Draw(cutproof);d.text((12,8),'NORMAL / second player occluded at (40,230)',fill='white');d.text((412,8),'DRAWN ROOF OMITTED / second player revealed',fill='white');cutproof.alpha_composite(normal,(12,30));cutproof.alpha_composite(cut,(412,30));d.text((12,426),'The court actor remains visible in both. Review-only cutaway; engine fading is deferred.',fill='white');cutproof.save(R/'r17-C-pilot-cutaway.png')
 # Compatible unlike contacts, all native source pixels at a common eave.
 contacts=[]
 backs=Image.new('RGBA',(288,192),BG);x=0
 for width in (1,2,3):
  a,_=c.build_c(dict(view='back',width=width,floors=2,back='stair' if width==2 else 'plain'));backs.alpha_composite(a,(x,0));x+=width*48
 contacts.append(('mixed rear widths / common ridge and eave',backs))
 sides=Image.new('RGBA',(336,240),BG);x=0
 for direction,depth in [('W',2),('E',2),('E',3)]:
  a,_=c.build_c(dict(view='side',direction=direction,depth=depth,floors=2));sides.alpha_composite(a,(x,240-a.height));x+=depth*48
 contacts.append(('independently lit W/E returns and native d3',sides))
 mixed=Image.new('RGBA',(288,192),BG)
 for x,spec in [(0,c.make_spec(2,1,'door',0,0,'ridge')),(96,dict(view='back',width=2,floors=2)),(192,dict(view='node',node='corner-outer-R',floors=2))]:
  a,_=c.build_c(spec);mixed.alpha_composite(a,(x,192-a.height))
 contacts.append(('current A/B front / C rear / C corner',mixed))
 for i,(title,native) in enumerate(contacts):
  for scale in (1,4):
   sheet=Image.new('RGBA',(max(480,native.width*scale+24),native.height*scale+48),BG);ImageDraw.Draw(sheet).text((12,10),title,fill='white');sheet.alpha_composite(native.resize((native.width*scale,native.height*scale),NN),(12,32));sheet.save(R/f'r17-C-compatible-{i}-{scale}x.png')
 scenes=['L-block','market','height-test','junctions']
 linklist=['r17-C-critic2-response.json','r17-C-critic2-verification.json','r17-C-critic2-generation.json','r17-C-critic2-processing.json','r17-C-critic1-response.json','r17-C-critic1-verification.json','r17-C-critic1-generation.json','r17-C-critic.json','r17-C-verification.json','r17-C-files.json','r17-C-pilot-plan.png','r17-C-pilot-cutaway.png']+[f'r17-C-critic-{n}-comparison-1x.png' for n in scenes]+[f'r17-C-critic-{n}-comparison-3x.png' for n in scenes]+[f'r17-C-critic-{n}-squint-1x.png' for n in scenes]+links
 linklist+=sorted(p.name for pattern in ('r17-C-critic2-proof-*.png','r17-C-critic2-join-*.png','r17-C-critic2-east-shadow-4x.png') for p in R.glob(pattern))
 linklist += sorted(p.name for pattern in ('r17-C-compatible-*.png','r17-C-seam-*.png','r17-C-repeat-*.png','r17-C-back-stack-*.png') for p in R.glob(pattern))
 page='<!doctype html><meta charset="utf-8"><title>Round17 PartC review</title><style>body{background:#252b23;color:#ddd;font:16px system-ui;max-width:1200px;margin:30px auto}a{color:#c9dca2}img{image-rendering:pixelated;max-width:100%}li{margin:8px}</style><h1>Round17 PartC</h1><p>Native exported art, literal scale proofs, critic scenes and comparisons. Civic assets are labelled PartD proxies. Saved-art self-review; no independent or engine approval claimed.</p><ul>'+''.join(f'<li><a href="{html.escape(n)}">{html.escape(n)}</a></li>' for n in linklist)+'</ul>'
 (R/'r17-C-review.html').write_text(page)
 print('Review sheets:',len(names),'files and',len(stats),'measurements')
if __name__=='__main__':run()
