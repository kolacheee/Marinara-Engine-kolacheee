"""Saved-pixel evidence and review renders for critic-seven repairs."""
import json,hashlib
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,S
from d4_review import run as base_review,detail
from d_review import sheet
from d_layouts import MAPS
from review_c9 import lone_pixels
from d7_scene import remains
from check_proofs import light

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def run():
 report=base_review(False)
 before=json.loads((REVIEW/'D7-start/hashes.json').read_text())
 critic=json.loads((REVIEW/'critic-D-7.json').read_text())
 protected={n:sha(BASE/n)==before[n] for n,v in critic['files'].items() if v['status']=='pass' and n!='NOTES.md'}
 changes=[n for n,h in before.items() if sha(BASE/n)!=h]
 allowed={n for n,v in critic['files'].items() if v['status']=='fail'}|{'NOTES.md'}
 unexpected=[n for n in changes if n not in allowed]
 report['critic7_passing_files_unchanged']=protected;report['critic7_changed_files']=changes;report['critic7_unexpected_changes']=unexpected
 if unexpected or not all(protected.values()):report['failures'].append('critic7 preservation')
 # Cell orphans are computed with full-image neighbours, then counted per tile.
 # Crop edges never manufacture an isolated pixel for this measurement.
 report['native_cell_orphans']={}
 paths=list((BASE/'canon/surfaces').glob('*.png'))+[BASE/f'frames/{n}.png' for n in MAPS]
 for p in paths:
  im=Image.open(p).convert('RGBA');w,h=im.size;same=Image.new('L',im.size)
  for dx,dy in [(-1,0),(1,0),(0,-1),(0,1)]:
   dif=ImageChops.difference(im,ImageChops.offset(im,dx,dy));ch=dif.split();nonzero=ch[0]
   for v in ch[1:]:nonzero=ImageChops.lighter(nonzero,v)
   eq=nonzero.point(lambda v:0 if v else 255);d=ImageDraw.Draw(eq)
   if dx==-1:d.line((w-1,0,w-1,h-1),fill=0)
   if dx==1:d.line((0,0,0,h-1),fill=0)
   if dy==-1:d.line((0,h-1,w-1,h-1),fill=0)
   if dy==1:d.line((0,0,w-1,0),fill=0)
   same=ImageChops.lighter(same,eq)
  orphan=ImageChops.multiply(ImageChops.invert(same),im.getchannel('A'))
  cells=[{'x':x,'y':y,'percent':100*orphan.crop((x,y,x+48,y+48)).histogram()[255]/2304} for y in range(0,h,48) for x in range(0,w,48)]
  mx=max(t['percent'] for t in cells);report['native_cell_orphans'][str(p.relative_to(BASE))]={'maximum_percent':mx,'tiles':cells}
  if mx>3:report['failures'].append('orphans '+str(p.relative_to(BASE)))
 # Bone masks must differ at every source anchor, including across item types.
 masks=[remains(i).getchannel('A').tobytes() for i in range(16)]
 report['distinct_remains']=len(set(masks));assert len(set(masks))==16
 # A seam is genuinely crossed by material, not just the same flat border.
 report['cave_pattern_edges']={}
 for n in ['cave_rock','cave_ice','cave_crystal','cave_lava']:
  im=Image.open(BASE/f'canon/surfaces/{n}-floor.png').convert('RGBA');px=im.load()
  report['cave_pattern_edges'][n]={'left_colours':len({px[0,y] for y in range(288)}),'right_colours':len({px[287,y] for y in range(288)}),'top_colours':len({px[x,0] for x in range(288)}),'bottom_colours':len({px[x,287] for x in range(288)})}
  if min(report['cave_pattern_edges'][n].values())<2:report['failures'].append('flat border '+n)
 report['proof_greys_exact']={}
 for n in S:
  im=Image.open(BASE/f'proof/{n}.png').convert('RGBA');g=Image.open(BASE/f'proof/{n}-grey.png').convert('RGBA')
  report['proof_greys_exact'][n]=im.convert('L').convert('RGBA').tobytes()==g.tobytes()
 if not all(report['proof_greys_exact'].values()):report['failures'].append('proof greys')
 report['previous_notes_retained']=(BASE/'NOTES.md').read_bytes().endswith((REVIEW/'D7-start/NOTES.md').read_bytes())
 if not report['previous_notes_retained']:report['failures'].append('previous log text')
 report['pass']=not report['failures']
 (REVIEW/'D-critic7-redraw-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':report['pass'],'failures':report['failures'],'protected_count':len(protected),'all_protected_unchanged':all(protected.values()),'unexpected_changes':unexpected,'distinct_remains':report['distinct_remains']},indent=2))
 return report
def contact():
 from d4_review import CAVES
 ims=[Image.open(BASE/f'frames/{n}.png') for n in MAPS];w=sum(i.width for i in ims)+168;h=max(i.height for i in ims)+288
 contact=Image.new('RGB',(((w+47)//48)*48,((h+47)//48)*48),'#1c222e');d=ImageDraw.Draw(contact);d.fontmode='1';x=24
 for n,im in zip(MAPS,ims):d.text((x,12),n,fill='#c8c0af');contact.paste(im,(x,36));x+=im.width+24
 y=max(i.height for i in ims)+84
 for i,n in enumerate(S):d.text((24+i*192,y-20),n,fill='#c8c0af');contact.paste(Image.open(BASE/f'proof/{n}.png'),(24+i*192,y))
 contact.save(BASE/'d0a-review.png')
 sq=Image.new('RGB',(1152,1152),'#252a36');d=ImageDraw.Draw(sq);x=y=12;rh=0
 for n in MAPS:
  im=Image.open(BASE/f'frames/{n}-squint.png')
  if x+im.width>1152:x=12;y+=rh+36;rh=0
  d.text((x,y),n,fill='white');sq.paste(im,(x,y+20));x+=im.width+16;rh=max(rh,im.height)
 for n in ['D-squints.png','D-final-squints.png']:sq.save(REVIEW/n)

def current_sheets():
 from d4_review import CAVES,board
 for n in CAVES:
  f=Image.open(BASE/f'canon/surfaces/{n}-floor.png');sheet(f,'surfaces-'+n+'-floor');board(f,'canon-surfaces-'+n)
  repeat=Image.open(REVIEW/f'D7-repeat-{n}.png');sheet(repeat,'repeat-'+n);detail(repeat,(240,240,336,336),'critic7-seam-'+n)
  for folder in ['proof','canon/swatches']:
   im=Image.open(BASE/f'{folder}/{n}.png');sheet(im,folder.split('/')[-1]+'-'+n);board(im,folder.replace('/','-')+'-'+n);detail(im,(0,0,*im.size),'critic7-'+folder.split('/')[-1]+'-'+n)
 for n in S:sheet(Image.open(BASE/f'proof/{n}.png'),'proof-'+n,'station' in n)
 guide=Image.open(BASE/'canon/style-guide.png');sheet(guide,'style-guide')
 for y in range(0,guide.height,288):board(guide.crop((0,y,guide.width,min(guide.height,y+288))),f'style-guide-{y}')
 print('Refreshed proof, swatch, surface and guide sheets',flush=True)

def render_frame(n):
 from d4_review import board
 im=Image.open(BASE/f'frames/{n}.png');sheet(im,'frame-'+n,n=='station_lab');board(im,n,n=='station_lab')
 for y in range(0,im.height,384):
  for x in range(0,im.width,480):sheet(im.crop((x,y,min(x+480,im.width),min(y+384,im.height))),f'crop-{n}-{x}-{y}',n=='station_lab')
 crops={'hoard-keep':[(400,768,616,1008),(960,288,1056,552)],'breach-temple':[(600,540,720,660)],'sanctum-crypt':[(1296,264,1392,336)],'cave_rock-plain-21':[(748,380,892,500),(900,360,1140,552),(960,600,1200,792)],'manor-ground':[(1824,432,1968,624),(1728,1104,1920,1200)],'station_lab':[(576,144,720,288)]}
 for i,b in enumerate(crops[n]):detail(im,b,'critic7-'+n+'-'+str(i))
 print('Refreshed',n,flush=True)

if __name__=='__main__':
 import sys
 if len(sys.argv)==1:run()
 elif sys.argv[1]=='contact':contact()
 elif sys.argv[1]=='materials':current_sheets()
 else:render_frame(sys.argv[1])
