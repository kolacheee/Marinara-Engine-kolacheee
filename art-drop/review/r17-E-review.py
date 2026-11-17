"""Native review mounts, labels and nearest-neighbour proofs; no production drawing."""
from pathlib import Path
from PIL import Image, ImageDraw
import json,importlib.util
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';NN=Image.Resampling.NEAREST

def tile(a,size):
 im=Image.new('RGBA',size)
 for y in range(0,size[1],a.height):
  for x in range(0,size[0],a.width):im.paste(a,(x,y))
 return im

def run():
 files=json.loads((R/'r17-E-files.json').read_text());house=Image.open(R.parent/'reference/r17/fantasy-house-2.png').convert('RGBA');paving=Image.open(O/'cobble-large.png').convert('RGBA');grass=Image.open(O.parent/'grass-base.png').convert('RGBA');links=[];cards=[]
 for name,rec in files.items():
  a=Image.open(O/(name+'.png')).convert('RGBA');w,h=a.size;bg=grass if name in ('district-poor-shed','mud-edge') else paving
  mount=tile(bg,a.size);mount.alpha_composite(a)
  sheet=Image.new('RGBA',(max(w*4+house.width*4+52,800),max(h*4,576)+max(h,144)+100),(39,43,35,255));d=ImageDraw.Draw(sheet)
  d.text((12,10),f'{name} | {w}x{h} | native1x and NN4x | summer | fantasy-house-2',fill='white');sheet.alpha_composite(mount,(12,32));sheet.alpha_composite(house,(w+36,32));y=max(h,144)+68
  sheet.alpha_composite(mount.resize((w*4,h*4),NN),(12,y));sheet.alpha_composite(house.resize((576,576),NN),(w*4+36,y));path=f'r17-E-piece-{name}-1x4x.png';sheet.save(R/path);links.append(path)
  # Self seam strips: three literal adjacent copies, no resampling.
  seam=tile(bg,(w*3,h))
  for i in range(3):seam.alpha_composite(a,(w*i,0))
  for scale in (1,3,4):seam.resize((seam.width*scale,seam.height*scale),NN).save(R/f'r17-E-seam-{name}-{scale}x.png')
  # All ground bases also receive literal transparent/opaque3x3 repeats.
  if rec['kind'].startswith('ground'):
   rep=Image.new('RGBA',(w*3,h*3))
   for yy in range(3):
    for xx in range(3):rep.paste(a,(xx*w,yy*h))
   for scale in (1,4):rep.resize((rep.width*scale,rep.height*scale),NN).save(R/f'r17-E-repeat-{name}-{scale}x.png')
   links.append(f'r17-E-repeat-{name}-4x.png')
  cards.append((name,mount))
 # Packed inspection sheets retain literal1x/4x samples plus both house scales.
 page=0;x=12;y=12;rowh=0
 def page_new():
  out=Image.new('RGBA',(1680,1100),(39,43,35,255));d=ImageDraw.Draw(out);d.text((1080,12),'fantasy-house-2 / 1x +4x',fill='white');out.alpha_composite(house,(1080,36));out.alpha_composite(house.resize((576,576),NN),(1080,210));return out
 out=page_new()
 for name,a in cards:
  cw=max(256,a.width*4+16);ch=a.height*5+50
  if x+cw>1060:x=12;y+=rowh+12;rowh=0
  if y+ch>1100:
   path=f'r17-E-inspection-{page}.png';out.save(R/path);links.append(path);page+=1;out=page_new();x=y=12;rowh=0
  d=ImageDraw.Draw(out);d.text((x,y),name,fill='white');out.alpha_composite(a,(x,y+18));out.alpha_composite(a.resize((a.width*4,a.height*4),NN),(x,y+28+a.height));x+=cw;rowh=max(rowh,ch)
 path=f'r17-E-inspection-{page}.png';out.save(R/path);links.append(path)
 # Unlike seams: both cobble scales, all district layers, sign silhouettes.
 for layer in ('ground','storey','roof'):
  h=96 if layer=='roof' else 48;im=tile(paving,(480,h))
  for i,key in enumerate(('market','temple','craft','rich','poor')):im.alpha_composite(Image.open(O/f'district-{key}-{layer}-w2.png').convert('RGBA'),(i*96,0))
  for scale in (1,3,4):im.resize((im.width*scale,im.height*scale),NN).save(R/f'r17-E-seam-districts-{layer}-{scale}x.png')
  links.append(f'r17-E-seam-districts-{layer}-4x.png')
 # Contacts between every native layout and its variants, bottom-aligned.
 for key in ('market','temple','craft','rich','poor'):
  for layer in ('ground','storey','roof'):
   aa=[Image.open(O/f'district-{key}-{layer}{suffix}-w2.png').convert('RGBA') for suffix in ('','-v1','-v2')];h=max(a.height for a in aa);im=tile(paving,(288,h))
   for i,a in enumerate(aa):im.alpha_composite(a,(96*i,h-a.height))
   for scale in (1,3,4):im.resize((im.width*scale,im.height*scale),NN).save(R/f'r17-E-seam-{key}-{layer}-variants-{scale}x.png')
   links.append(f'r17-E-seam-{key}-{layer}-variants-4x.png')
 for family,names in [('inn',['inn-front-w2-c'+str(c) for c in range(3)]),('streets',['street-main','street-side','lane','cobble-large','cobble-small'])]:
  aa=[Image.open(O/(n+'.png')).convert('RGBA') for n in names];im=tile(paving,(sum(a.width for a in aa),max(a.height for a in aa)));x=0
  for a in aa:im.alpha_composite(a,(x,im.height-a.height));x+=a.width
  for scale in (1,3,4):im.resize((im.width*scale,im.height*scale),NN).save(R/f'r17-E-seam-{family}-variants-{scale}x.png')
  links.append(f'r17-E-seam-{family}-variants-4x.png')
 signs=tile(paving,(8*80,96));sd=ImageDraw.Draw(signs)
 for i,key in enumerate(('smith','baker','apothecary','cobbler','inn','scribe','tailor','butcher')):
  signs.alpha_composite(Image.open(O/f'sign-{key}.png').convert('RGBA'),(i*80+8,4));sd.text((i*80+2,82),key,fill='#ffffff')
 for scale in (1,4):signs.resize((signs.width*scale,signs.height*scale),NN).save(R/f'r17-E-trades-{scale}x.png')
 links+=['r17-E-trades-1x.png','r17-E-trades-4x.png']
 for name in json.loads((R/'r17-E-scenes.json').read_text()):links += [f'r17-E-critic-{name}-comparison-1x.png',f'r17-E-critic-{name}-comparison-3x.png',f'r17-E-critic-{name}-squint-1x.png']
 html='<!doctype html><meta charset="utf-8"><title>Round17 PartE</title><style>body{background:#272b23;color:#eee;font:16px sans-serif}a{color:#cbd9ab}img{image-rendering:pixelated;max-width:95vw}</style><h1>Round17 Part E</h1><p>Streets, eight trades, inn, five districts and life. Native image-tool paint, registered64-sample mode, fixed palettes and hard alpha. A/B/C/D context retained. Round15 comparison only. Saved-art self-review.</p>'
 html+='<h2>critic-r17E-2 redraw</h2><p>Three failed paving PNGs and composer repaired;75 passing E PNGs unchanged. Two new magenta paintings, selected A. Even small-cobble lighting, retained kerbs/gutters, continuous poor lane and visible96x48 entrance courts in all five districts. All76 declared48x48 approaches clear;66 street segments retain cast shade. Saved-art self-review; independent acceptance pending.</p>'
 latest=['r17-E-critic2-response.json','r17-E-critic2-generation.json','r17-E-critic2-processing.json','r17-E-critic2-verification.json','r17-E-critic2-candidates.png']
 focused=R/'r17-E-critic2-review.py'
 if focused.exists():
  sp=importlib.util.spec_from_file_location('e_focused',focused);mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod);mod.run()
 focus=R/'r17-E-critic2-focus.json'
 if focus.exists():latest+=json.loads(focus.read_text())['links']
 html+=''.join(f'<p><a href="{f}">{f}</a></p>' for f in latest)
 html+='<h2>Earlier redraw record</h2><p>critic-r17E-1 records are historical. Current focused scene crops below are regenerated with the latest paving.</p>'
 html+=''.join(f'<p><a href="{f}">{f}</a></p>' for f in ['r17-E-critic1-response.json','r17-E-critic1-generation.json','r17-E-critic1-processing.json','r17-E-critic1-verification.json','r17-E-critic1-focus-junction-3x.png','r17-E-critic1-focus-mounted-trades-north-3x.png','r17-E-critic1-focus-mounted-trades-south-3x.png','r17-E-critic1-focus-market-stalls-3x.png','r17-E-critic1-focus-washing-3x.png','r17-E-generation.json','r17-E-processing.json','r17-E-files.json','r17-E-verification.json','r17-E-critic.json']+links)
 (R/'r17-E-review.html').write_text(html);print('Saved',len(files),'individual sheets; inspection pages',page+1)
if __name__=='__main__':run()
