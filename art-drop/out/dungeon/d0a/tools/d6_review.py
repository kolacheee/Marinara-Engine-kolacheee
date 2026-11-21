"""Final saved-pixel audit and review pages for the critic-six redraw."""
import json,hashlib
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,c
from d_layouts import MAPS
from d4_review import run as review,detail,board
from d_review import sheet
from review_c9 import lone_pixels


def run():
 report=review()
 before=json.loads((REVIEW/'D6-start/hashes.json').read_text())
 critic=json.loads((REVIEW/'critic-D-6.json').read_text())
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 protected={n:sha(BASE/n)==before[n] for n,v in critic['files'].items() if v['status']=='pass'}
 allowed=set(critic['failed'])|{'NOTES.md','frames/layout.json'}
 changes=[n for n,h in before.items() if sha(BASE/n)!=h]
 unexpected=[n for n in changes if n not in allowed]
 report['critic6_passing_files_unchanged']=protected
 report['critic6_unexpected_existing_changes']=unexpected
 report['critic6_changed_existing_files']=changes
 if unexpected or not all(protected.values()):report['failures'].append('critic6 preservation')
 report['critic6_backport_regions']={}
 for n in ['cave_rock','cave_ice','cave_crystal','cave_lava']:
  a=Image.open(BASE/f'proof/{n}.png').convert('RGBA');b=Image.open(REVIEW/f'D6-start/proof/{n}.png').convert('RGBA')
  sw=Image.open(BASE/f'canon/swatches/{n}.png').convert('RGBA');old=Image.open(REVIEW/f'D6-start/canon/swatches/{n}.png').convert('RGBA')
  report['critic6_backport_regions'][n]={'proof_wall_unchanged':a.crop((0,0,144,96)).tobytes()==b.crop((0,0,144,96)).tobytes(),'swatch_wall_unchanged':sw.crop((0,0,48,24)).tobytes()==old.crop((0,0,48,24)).tobytes()}
  f=Image.open(BASE/f'canon/surfaces/{n}-floor.png');repeat=Image.new('RGBA',(576,576))
  for x in (0,288):
   for y in (0,288):repeat.paste(f,(x,y))
  repeat.save(REVIEW/f'D6-repeat-{n}.png')
  detail(repeat,(240,240,336,336),'critic6-seam-'+n)
  detail(a,(0,96,144,144),'critic6-proof-floor-'+n)
  detail(sw,(0,0,48,48),'critic6-swatch-'+n)
  if not all(report['critic6_backport_regions'][n].values()):report['failures'].append('backport wall '+n)
 # Original ten-cell source repetition is checked at the two explicitly cited
 # nonuniform tiles; calm single-colour cells are not texture-feature repeats.
 cave=Image.open(BASE/'frames/cave_rock-plain-21.png')
 report['critic6_cave_repeat_examples']=[{'a':[x,y,x+48,y+48],'b':[x+1152,y,x+1200,y+48],'identical':cave.crop((x,y,x+48,y+48)).tobytes()==cave.crop((x+1152,y,x+1200,y+48)).tobytes()} for x,y in [(528,240),(576,288)]]
 # Save and inspect the exact exterior curve runs named by the critic.
 im=Image.open(BASE/'frames/hoard-keep.png').convert('RGB');void=tuple(bytes.fromhex(c('void-mass',2)[1:]));runs=[]
 for y in range(983,1001):
  x=max(x for x in range(720,900) if im.getpixel((x,y))!=void)
  if runs and runs[-1]['x']==x:runs[-1]['length']+=1
  else:runs.append({'x':x,'y':y,'length':1})
 report['critic6_hoard_curve_runs']=runs
 report['critic6_frame_cells']={}
 for n in MAPS:
  im=Image.open(BASE/f'frames/{n}.png')
  tiles=[dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))) for y in range(0,im.height,48) for x in range(0,im.width,48)]
  report['critic6_frame_cells'][n]={'maximum_percent':max(t['percent'] for t in tiles),'tiles':tiles}
  sheet(im,'frame-'+n,n=='station_lab')
  # Regenerate current paginated review sheets from the final saved image.
  for y in range(0,im.height,384):
   for x in range(0,im.width,480):sheet(im.crop((x,y,min(x+480,im.width),min(y+384,im.height))),f'crop-{n}-{x}-{y}',n=='station_lab')
  print('Final review pages',n,flush=True)
 report['pass']=not report['failures']
 (REVIEW/'D-critic6-redraw-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':report['pass'],'failures':report['failures'],'protected_count':len(protected),'all_protected_unchanged':all(protected.values()),'unexpected_changes':unexpected,'cave_repeats':report['critic6_cave_repeat_examples'],'curve':runs},indent=2))
 return report

def current_sheets():
 from draw_proofs import S
 from d4_review import CAVES
 # Refresh current D-* sheets. Numbered prior critic evidence stays historical.
 for n in CAVES:
  for folder,stem in [('canon/surfaces',n+'-floor'),('proof',n),('canon/swatches',n)]:
   pic=Image.open(BASE/f'{folder}/{stem}.png')
   sheet(pic,folder.split('/')[-1]+'-'+stem)
 for n in S:
  sheet(Image.open(BASE/f'proof/{n}.png'),'proof-'+n,'station' in n)
 import shutil
 shutil.copyfile(REVIEW/'D-final-squints.png',REVIEW/'D-squints.png')
 guide=Image.open(BASE/'canon/style-guide.png')
 sheet(guide,'style-guide')
 # Each repaired floor/proof/swatch at 1x, 2x, 3x, grey and squint, plus master.
 for i,n in enumerate(CAVES):
  out=Image.new('RGB',(1152,1008),'#252a36');d=ImageDraw.Draw(out)
  proof=Image.open(BASE/f'proof/{n}.png').convert('RGB');sw=Image.open(BASE/f'canon/swatches/{n}.png').convert('RGB');f=Image.open(BASE/f'canon/surfaces/{n}-floor.png').convert('RGB')
  d.text((8,8),n+' / native, exact 2x and 3x / grey / floor / swatch',fill='white')
  x=8
  for z in (1,2,3):out.paste(proof.resize((144*z,144*z),Image.Resampling.NEAREST),(x,28));x+=144*z+12
  out.paste(proof.convert('L'),(8,480));out.paste(f,(170,480));out.paste(f.convert('L'),(476,480));out.paste(sw,(8,650));out.paste(sw.resize((144,144),Image.Resampling.NEAREST),(8,710))
  out.paste(f.convert('L').resize((72,72),Image.Resampling.NEAREST),(790,480));out.save(REVIEW/f'D-critic6-material-inspection-{n}.png')
 # Compact native 3x detail pages allow inspection without shrinking a scene.
 crops={'hoard-keep':(156,810,300,954),'breach-temple':(384,600,528,744),'sanctum-crypt':(192,480,336,624),'cave_rock-plain-21':(748,360,892,504),'manor-ground':(1080,540,1224,684),'station_lab':(576,144,720,288)}
 for n,b in crops.items():
  pic=Image.open(BASE/f'frames/{n}.png').crop(b);out=Image.new('RGB',(960,648),'#252a36');d=ImageDraw.Draw(out);d.text((8,8),n+' / 1x 2x 3x / grey',fill='white');x=8
  for z in (1,2,3):out.paste(pic.resize((144*z,144*z),Image.Resampling.NEAREST),(x,28));x+=144*z+12
  out.paste(pic.convert('L'),(8,480));out.save(REVIEW/f'D-critic6-frame-inspection-{n}.png')
 print('Current surface/proof/guide/squint sheets refreshed',flush=True)

if __name__=='__main__':
 run()
 current_sheets()

