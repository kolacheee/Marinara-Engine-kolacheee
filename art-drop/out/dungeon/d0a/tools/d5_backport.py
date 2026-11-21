"""Repair authorized cave floor regions; preserve all wall and prop pixels."""
import json
from PIL import Image,ImageDraw,ImageChops
from draw_proofs import BASE,REVIEW
from draw_style_samples import SWATCHES
from d4_backport import tidy
from check_proofs import components
CAVES=['cave_rock','cave_ice','cave_crystal','cave_lava']

def run():
 guide=Image.open(REVIEW/'D5-start/canon/style-guide.png').convert('RGB');ledger={}
 for n in CAVES:
  f=Image.open(BASE/f'canon/surfaces/{n}-floor.png').convert('RGBA')
  # Coordinate repairs are confined to disconnected 1/2 px corner remnants.
  # No blur, interpolation, or spatial resizing is involved. The whole ledger
  # is retained for edge inspection at 3x, alongside before/after floor sheets.
  ledger[n]=tidy(f)
  if components(f)[0]:ledger[n]+=tidy(f)
  f.save(BASE/f'canon/surfaces/{n}-floor.png')
  wall=Image.open(BASE/f'canon/surfaces/{n}-wall.png').convert('RGBA');prop=Image.open(BASE/f'canon/props/{n}-study.png').convert('RGBA')
  floor=f.crop((0,0,144,144));floor.save(REVIEW/f'C-layer-{n}-floor.png')
  proof=floor.copy();proof.paste(wall,(0,0),wall);proof.alpha_composite(prop,(86,96));proof.save(BASE/f'proof/{n}.png');proof.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
  sw=Image.open(REVIEW/f'D5-start/canon/swatches/{n}.png').convert('RGBA')
  b={'cave_rock':(34,78,82,102),'cave_ice':(126,62,174,86),'cave_crystal':(134,118,182,142),'cave_lava':(18,110,66,134)}[n]
  sw.paste(f.crop(b),(0,24));sw.save(BASE/f'canon/swatches/{n}.png')
  i=list(SWATCHES).index(n);guide.paste(sw,(48+i%7*240,800+i//7*94))
 guide.save(BASE/'canon/style-guide.png');(REVIEW/'D5-corner-repairs.json').write_text(json.dumps(ledger,indent=2)+'\n')
 print({k:len(v) for k,v in ledger.items()})
if __name__=='__main__':run()
