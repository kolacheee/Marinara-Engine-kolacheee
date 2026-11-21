"""Owner-authorized palette repairs; all replacements are explicit sRGB choices."""
import json
from pathlib import Path
from PIL import Image
import build_palette as b

CHANGES = {'wood-oak': {4:'#966a40'}, 'limestone':{5:'#b4b29e'},
 'frost':{4:'#8ca7b5',5:'#abc1c8'}, 'snowdrift':{4:'#94a8b8',5:'#b2c3c9'},
 'clean-tile':{4:'#a7b9bb'}, 'tank-glass':{5:'#a2c4c5'},
 'textiles-sage':{5:'#b9c19f'}, 'void-mass':{2:'#1c222e',3:'#26303a'}}
REFERENCE_ONLY={'marble':[6], 'clean-tile':[6], 'bone':[6], 'blue-ice':[6]}

def run():
 old=json.loads((b.OUT/'palette.json').read_text())
 edits={}
 for n,steps in CHANGES.items():
  for i,c in steps.items():
   if old[n][i-1]!=c:edits[old[n][i-1]]=c
 # Only colour substitutions in existing canon art. Geometry stays untouched.
 # Reference source crops must never be recoloured.
 replacements={tuple(bytes.fromhex(a[1:])):tuple(bytes.fromhex(z[1:])) for a,z in edits.items()}
 touched=[]
 for folder in ('props','swatches'):
  for p in (b.OUT/folder).glob('*.png'):
   im=Image.open(p).convert('RGBA');pixels=list(im.get_flattened_data())
   if any(v[:3] in replacements for v in pixels):
    im.putdata([(*replacements.get(v[:3],v[:3]),v[3]) for v in pixels]);im.save(p);touched.append(str(p.relative_to(b.OUT)))
 # Demoted pale pigments are replaced only in authored art, never source crops.
 demoted={old[n][i-1]:b.RAMPS[n][i-2] for n,steps in REFERENCE_ONLY.items() for i in steps}
 for folder in ('props','swatches'):
  for p in (b.OUT/folder).glob('*.png'):
   im=Image.open(p).convert('RGBA');rr={tuple(bytes.fromhex(a[1:])):tuple(bytes.fromhex(z[1:])) for a,z in demoted.items()}
   pix=list(im.get_flattened_data())
   if any(v[:3] in rr for v in pix):
    im.putdata([(*rr.get(v[:3],v[:3]),v[3]) for v in pix]);im.save(p);touched.append(str(p.relative_to(b.OUT)))
 b.build()
 (b.REVIEW/'C-palette-remap.json').write_text(json.dumps({'replacements':edits,'reference_only':REFERENCE_ONLY,'colour_only_remapped':touched},indent=2)+'\n')
if __name__=='__main__':run()
