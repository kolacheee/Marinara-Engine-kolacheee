"""Final saved-pixel audit and review pages for the critic-five redraw."""
import json,hashlib
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW,c
from d_layouts import MAPS
from d4_review import run as review,detail,board
from d_review import sheet
from review_c9 import lone_pixels


def run():
 report=review()
 before=json.loads((REVIEW/'D5-start/hashes.json').read_text())
 critic=json.loads((REVIEW/'critic-D-5.json').read_text())
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 protected={n:sha(BASE/n)==before[n] for n,v in critic['files'].items() if v['status']=='pass'}
 allowed=set(critic['failed'])|{'NOTES.md','frames/layout.json'}
 changes=[n for n,h in before.items() if sha(BASE/n)!=h]
 unexpected=[n for n in changes if n not in allowed]
 report['critic5_passing_files_unchanged']=protected
 report['critic5_unexpected_existing_changes']=unexpected
 report['critic5_changed_existing_files']=changes
 if unexpected or not all(protected.values()):report['failures'].append('critic5 preservation')
 report['critic5_backport_regions']={}
 for n in ['cave_rock','cave_ice','cave_crystal','cave_lava']:
  a=Image.open(BASE/f'proof/{n}.png').convert('RGBA');b=Image.open(REVIEW/f'D5-start/proof/{n}.png').convert('RGBA')
  sw=Image.open(BASE/f'canon/swatches/{n}.png').convert('RGBA');old=Image.open(REVIEW/f'D5-start/canon/swatches/{n}.png').convert('RGBA')
  report['critic5_backport_regions'][n]={'proof_wall_unchanged':a.crop((0,0,144,96)).tobytes()==b.crop((0,0,144,96)).tobytes(),'swatch_wall_unchanged':sw.crop((0,0,48,24)).tobytes()==old.crop((0,0,48,24)).tobytes()}
  f=Image.open(BASE/f'canon/surfaces/{n}-floor.png');repeat=Image.new('RGBA',(576,576))
  for x in (0,288):
   for y in (0,288):repeat.paste(f,(x,y))
  repeat.save(REVIEW/f'D5-repeat-{n}.png')
  detail(repeat,(240,240,336,336),'critic5-seam-'+n)
  detail(a,(0,96,144,144),'critic5-proof-floor-'+n)
  detail(sw,(0,0,48,48),'critic5-swatch-'+n)
  if not all(report['critic5_backport_regions'][n].values()):report['failures'].append('backport wall '+n)
 # Original ten-cell source repetition is checked at the two explicitly cited
 # nonuniform tiles; calm single-colour cells are not texture-feature repeats.
 cave=Image.open(BASE/'frames/cave_rock-plain-21.png')
 report['critic5_cave_repeat_examples']=[{'a':[x,y,x+48,y+48],'b':[x+1152,y,x+1200,y+48],'identical':cave.crop((x,y,x+48,y+48)).tobytes()==cave.crop((x+1152,y,x+1200,y+48)).tobytes()} for x,y in [(528,240),(576,288)]]
 # Save and inspect the exact exterior curve runs named by the critic.
 im=Image.open(BASE/'frames/hoard-keep.png').convert('RGB');void=tuple(bytes.fromhex(c('void-mass',2)[1:]));runs=[]
 for y in range(983,1001):
  x=max(x for x in range(720,900) if im.getpixel((x,y))!=void)
  if runs and runs[-1]['x']==x:runs[-1]['length']+=1
  else:runs.append({'x':x,'y':y,'length':1})
 report['critic5_hoard_curve_runs']=runs
 report['critic5_frame_cells']={}
 for n in MAPS:
  im=Image.open(BASE/f'frames/{n}.png')
  tiles=[dict(x=x,y=y,**lone_pixels(im.crop((x,y,x+48,y+48)))) for y in range(0,im.height,48) for x in range(0,im.width,48)]
  report['critic5_frame_cells'][n]={'maximum_percent':max(t['percent'] for t in tiles),'tiles':tiles}
  sheet(im,'frame-'+n,n=='station_lab')
  # Regenerate current paginated review sheets from the final saved image.
  for y in range(0,im.height,384):
   for x in range(0,im.width,480):sheet(im.crop((x,y,min(x+480,im.width),min(y+384,im.height))),f'crop-{n}-{x}-{y}',n=='station_lab')
  print('Final review pages',n,flush=True)
 report['pass']=not report['failures']
 (REVIEW/'D-critic5-redraw-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':report['pass'],'failures':report['failures'],'protected_count':len(protected),'all_protected_unchanged':all(protected.values()),'unexpected_changes':unexpected,'cave_repeats':report['critic5_cave_repeat_examples'],'curve':runs},indent=2))
 return report
if __name__=='__main__':run()
