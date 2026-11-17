"""Review-only layout, labels and native drawing composition."""
from pathlib import Path
import json, importlib.util
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent;O=R.parent/'out/city17';NN=Image.Resampling.NEAREST
def tile(a,size):
 im=Image.new('RGBA',size)
 for y in range(0,size[1],a.height):
  for x in range(0,size[0],a.width):im.paste(a,(x,y))
 return im
def run():
 spec=importlib.util.spec_from_file_location('compose_d_review',O/'compose.py');c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
 files=json.loads((R/'r17-D-files.json').read_text());house=Image.open(R.parent/'reference/r17/fantasy-house-2.png').convert('RGBA');ground=Image.open(O/'street-junction.png').convert('RGBA');grass=Image.open(O.parent/'grass-base.png').convert('RGBA');links=[]
 for name,rec in files.items():
  a=Image.open(O/(name+'.png')).convert('RGBA');w,h=a.size
  summer=grass if name=='shrine' else ground
  # Low props on their summer ground; tall architecture also retains a
  # separate transparent sprite export and an opaque ground-backed proof.
  native=tile(summer,(w,h));native.alpha_composite(a)
  sheet=Image.new('RGBA',(max(w*4+house.width*4+52,w+house.width+52),max(h*4,576)+max(h,144)+100),(39,43,35,255));d=ImageDraw.Draw(sheet)
  d.text((12,10),f'{name} | {w}x{h} | native1x / NN4x | summer ground | fantasy-house-2',fill='white')
  sheet.alpha_composite(native,(12,32));sheet.alpha_composite(house,(w+36,32))
  d.text((12,max(h,144)+45),'Nearest-neighbour4x; no resampling of native art in scenes',fill='white')
  sheet.alpha_composite(native.resize((w*4,h*4),NN),(12,max(h,144)+68));sheet.alpha_composite(house.resize((576,576),NN),(w*4+36,max(h,144)+68))
  path=f'r17-D-piece-{name}-1x4x.png';sheet.save(R/path);links.append(path)
  # Whole sprites have no modular join contract. Show identical neighbours
  # at literal adjacent canvas origins to expose accidental edge pixels.
  seam=tile(summer,(w*3,h))
  for i in range(3):seam.alpha_composite(a,(i*w,0))
  for scale in (1,3):seam.resize((seam.width*scale,seam.height*scale),NN).save(R/f'r17-D-seam-{name}-{scale}x.png')
  links.append(f'r17-D-seam-{name}-1x.png')
 # The six canopies/goods are distinct drawings, shown side by side.
 stalls=tile(ground,(384,96))
 for i in range(6):stalls.alpha_composite(Image.open(O/f'stall-{i}.png').convert('RGBA'),(i*64+8,24))
 for scale in (1,4):stalls.resize((384*scale,96*scale),NN).save(R/f'r17-D-stalls-{scale}x.png')
 links+=['r17-D-stalls-1x.png','r17-D-stalls-4x.png']
 # Joined unlike masonry, including the staircase and gateway.
 wall_props=c.d_wall_props(gate_x=480,base=400,right_edge=864)
 join,_=c.c_render(dict(size=[864,432],lots=[],props=wall_props,roads=[dict(file='street-junction',rect=[0,0,864,432])]))
 for scale in (1,3,4):join.resize((join.width*scale,join.height*scale),NN).save(R/f'r17-D-wall-joins-{scale}x.png')
 links.append('r17-D-wall-joins-1x.png')
 links.append('r17-D-wall-joins-4x.png')
 variants=tile(ground,(384,144))
 for i,name in enumerate(['wall-walk','wall-walk-alternate']*2):
  a=Image.open(R/'r17-D-critic2-wall-walk-alternate.png').convert('RGBA') if name.endswith('alternate') else Image.open(O/'wall-walk.png').convert('RGBA')
  variants.alpha_composite(a,(i*96,0))
 for scale in (1,3,4):variants.resize((384*scale,144*scale),NN).save(R/f'r17-D-wall-variants-{scale}x.png')
 links+=['r17-D-wall-variants-1x.png','r17-D-wall-variants-3x.png']
 # Native packed seam pages are small enough to inspect without fit-down.
 page=0;x=y=row_h=0;seams=Image.new('RGBA',(1400,700),(39,43,35,255));sd=ImageDraw.Draw(seams)
 for name in files:
  a=Image.open(R/f'r17-D-seam-{name}-1x.png').convert('RGBA')
  if x+a.width>1400:x=0;y+=row_h+24;row_h=0
  if y+a.height+24>700:
   path=f'r17-D-critic2-seams-{page}-1x.png';seams.save(R/path);links.append(path)
   page+=1;x=y=row_h=0;seams=Image.new('RGBA',(1400,700),(39,43,35,255));sd=ImageDraw.Draw(seams)
  sd.text((x+4,y+2),name,fill='white');seams.alpha_composite(a,(x,y+20));x+=a.width+12;row_h=max(row_h,a.height)
 path=f'r17-D-critic2-seams-{page}-1x.png';seams.save(R/path);links.append(path)
 # Literal ground-backed crops expose unlike attachment contacts at8x.
 for name,box in [('tower-wall',(106,250,142,400)),('wall-stair',(298,250,322,400)),('stair-gate',(474,270,502,400))]:
  a=join.crop(box)
  for scale in (1,4,8):a.resize((a.width*scale,a.height*scale),NN).save(R/f'r17-D-join-{name}-{scale}x.png')
  links.append(f'r17-D-join-{name}-8x.png')
 # Reuse the already drawn C actor for clearance proofs. Review diagrams
 # may annotate geometry; none of these marks becomes production art.
 actor=Image.open(R/'r17-C-pilot-person.png').convert('RGBA')
 clearance=tile(ground,(768,480));d=ImageDraw.Draw(clearance)
 gate=Image.open(O/'gatehouse.png').convert('RGBA');clearance.alpha_composite(gate,(12,400-gate.height))
 clearance.alpha_composite(actor,(76,388-actor.height));d.text((8,414),'96px open portal; actor visible',fill='white')
 for i in range(6):
  x=192+i*88;a=Image.open(O/f'stall-{i}.png').convert('RGBA');clearance.alpha_composite(a,(x,300));clearance.alpha_composite(actor,(x+15,374-actor.height))
  d.text((x,388),str(i)+' / approach',fill='white')
 d.text((192,252),'Canopies44px across; counters retain clear customer approach',fill='white')
 for scale in (1,3):clearance.resize((768*scale,480*scale),NN).save(R/f'r17-D-clearance-{scale}x.png')
 links.append('r17-D-clearance-1x.png')
 market=Image.open(R/'r17-D-critic-market-1x.png').convert('RGBA')
 for name,box in [('wall-stair-context',(720,280,864,432)),('gate-route',(976,192,1088,576))]:
  a=market.crop(box)
  for scale in (1,3,4):
   path=f'r17-D-critic2-{name}-{scale}x.png';a.resize((a.width*scale,a.height*scale),NN).save(R/path);links.append(path)
 # No D ground bases are exported. These are context repeats of unchanged
 # C paving and approved summer grass, explicitly labelled in the index.
 for name,a in [('context-paving',ground),('context-summer-grass',grass),('gate-interior',Image.open(R/'r17-D-critic2-gate-interior.png').convert('RGBA'))]:
  rep=tile(a,(a.width*3,a.height*3))
  for scale in (1,4):rep.resize((rep.width*scale,rep.height*scale),NN).save(R/f'r17-D-repeat-{name}-{scale}x.png')
  links.append(f'r17-D-repeat-{name}-1x.png')
 overview=Image.new('RGBA',(1152,720),(80,86,66,255));d=ImageDraw.Draw(overview);x=8
 for name in ['cathedral','guildhall','gatehouse','wall-tower']:
  a=Image.open(O/(name+'.png')).convert('RGBA');overview.alpha_composite(a,(x,450-a.height));d.text((x,460),name,fill='white');x+=a.width+16
 x=8
 for name in ['townhall-market','wall-walk','wall-walk-stair','fountain','market-cross','shrine']+[f'stall-{i}' for i in range(6)]:
  a=Image.open(O/(name+'.png')).convert('RGBA');overview.alpha_composite(a,(x,670-a.height));d.text((x,684),name,fill='white');x+=a.width+8
 overview.save(R/'r17-D-contact.png');links.insert(0,'r17-D-contact.png')
 for name in ['L-block','market','height-test','skyline']:
  links += [f'r17-D-critic-{name}-comparison-1x.png',f'r17-D-critic-{name}-comparison-3x.png',f'r17-D-critic-{name}-squint-1x.png']
 html='<!doctype html><meta charset="utf-8"><title>Round17 PartD critic2 redraw</title><style>body{background:#272b23;color:#eee;font:16px sans-serif}a{color:#cbd9ab}img{image-rendering:pixelated;max-width:95vw}</style><h1>Round17 Part D: critic-r17D-2 redraw</h1><p>Wall-walk and stair-wall now share one image-tool painting, with identical overlapping contact columns. The accepted staircase and landing are preserved. Gate approach repeats drawn slate interior; its threshold appears once. Fourteen passing sprites unchanged. Native mode sampling and hard alpha. Saved-art self-review, not independent or in-engine approval. No Round15 production dependencies; Part E life remains deferred.</p>'
 html+='<p><a href="r17-D-critic2-response.json">Response to every critic problem</a> · <a href="r17-D-critic2-generation.json">Exact prompts and sources</a> · <a href="r17-D-critic2-processing.json">Registration and cleanup</a> · <a href="r17-D-verification.json">Verification</a></p>'
 html+=''.join(f'<p><a href="{p}">{p}</a></p>' for p in links)
 (R/'r17-D-review.html').write_text(html)
 print('Saved16 per-file sheets, self seams, unlike wall joins, context repeats and review index.')
if __name__=='__main__':run()
