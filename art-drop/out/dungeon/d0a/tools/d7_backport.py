"""Refresh only the failed rock proof and three failed cave study floors."""
from PIL import Image
from draw_proofs import BASE,REVIEW
from draw_style_samples import SWATCHES

def run():
 f=Image.open(BASE/'canon/surfaces/cave_rock-floor.png').convert('RGBA')
 old=Image.open(REVIEW/'D7-start/proof/cave_rock.png').convert('RGBA')
 # Native 144x48 patch spans the lit lip and undercut of the central bed.
 old.paste(f.crop((54,139,198,187)),(0,96))
 prop=Image.open(BASE/'canon/props/cave_rock-study.png').convert('RGBA');old.alpha_composite(prop,(86,96))
 old.save(BASE/'proof/cave_rock.png');old.convert('L').convert('RGBA').save(BASE/'proof/cave_rock-grey.png')
 layer=Image.open(REVIEW/'C-layer-cave_rock-floor.png').convert('RGBA');layer.paste(f.crop((54,139,198,187)),(0,96));layer.save(REVIEW/'C-layer-cave_rock-floor.png')
 guide=Image.open(REVIEW/'D7-start/canon/style-guide.png').convert('RGB')
 for n,b in {'cave_rock':(109,149,157,173),'cave_ice':(112,136,160,160),'cave_crystal':(164,141,212,165)}.items():
  sw=Image.open(REVIEW/f'D7-start/canon/swatches/{n}.png').convert('RGBA');f=Image.open(BASE/f'canon/surfaces/{n}-floor.png')
  sw.paste(f.crop(b),(0,24));sw.save(BASE/f'canon/swatches/{n}.png')
  i=list(SWATCHES).index(n);guide.paste(sw,(48+i%7*240,800+i//7*94))
 guide.save(BASE/'canon/style-guide.png')
if __name__=='__main__':run()
