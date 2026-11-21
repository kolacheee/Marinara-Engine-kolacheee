"""Saved-pixel canon checks and review-only integer-scale diagnostic sheets."""
import json,hashlib,io
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
from build_palette import RAMPS,roles,lightness
from check_redraw_c1 import components
B=Path(__file__).resolve().parents[1];R=B.parents[2]/'review-d0a'
FONT=ImageFont.load_default_imagefont()
def text(d,xy,t):d.fontmode='1';d.text(xy,t,font=FONT,fill='white')
def run():
 pal={tuple(bytes.fromhex(h[1:])) for v in RAMPS.values() for h in v}
 excluded={tuple(bytes.fromhex(v[i-1][1:])) for n,v in RAMPS.items() for i in roles(n).get('reference-only',[])}
 report={};fail=[]
 files=list((B/'canon/props').glob('*.png'))+list((B/'canon/swatches').glob('*.png'))
 for p in files:
  im=Image.open(p).convert('RGBA');pix=list(im.get_flattened_data());cols={a[:3] for a in pix if a[3]}
  cap=48 if p.parent.name=='props' else 32
  checks={'binary_alpha':all(a[3] in (0,255) for a in pix),
   'zero_transparent_rgb':all(a[:3]==(0,0,0) for a in pix if not a[3]),
   'palette':cols<=pal,'active_only':not(cols&excluded),'no_black':(0,0,0) not in cols,
   'colour_cap':len(cols)<=cap,'native_cell_size':im.width%48==im.height%48==0}
  if p.parent.name=='swatches':
   checks['material_study_5plus_colours']=len(cols)>=5
   # Cutaways contain wall values, trim and a separate floor. Check every
   # pixel for accidental orphan texture, but do not call their whole range a floor.
   small,_=components(im);checks['clusters_3']=not small
  report[str(p.relative_to(B))]={'checks':checks,'colours':len(cols),
   'small_components':small if p.parent.name=='swatches' else []}
  fail.extend(f'{p.name}: {k}' for k,v in checks.items() if not v)
 # Guide atlas uses declared exemptions for unchanged source crops and
 # neutral value diagrams; every other pixel must belong to the palette.
 guide=Image.open(B/'canon/style-guide.png').convert('RGBA')
 mask=Image.new('1',guide.size,0);md=ImageDraw.Draw(mask)
 for x,y,u,v in json.loads((R/'B-guide-exemptions.json').read_text()):md.rectangle((x,y,u-1,v-1),fill=1)
 gp=list(guide.get_flattened_data());allowed=[v for v,m in zip(gp,mask.get_flattened_data()) if not m]
 checks={'binary_alpha':all(v[3] in (0,255) for v in gp),
  'palette_outside_declared_sources_and_value_diagram':all(v[:3] in pal for v in allowed if v[3]),
  'native_cell_size':guide.width%48==guide.height%48==0}
 report['canon/style-guide.png']={'checks':checks,'colours':len(set(gp)),'small_components':[]}
 fail.extend(f'style-guide.png: {k}' for k,v in checks.items() if not v)
 # Every actual art sample, with direct native placement and diagnostic copies.
 for category in ('props','swatches'):
  paths=sorted((B/'canon'/category).glob('*.png'))
  for page,start in enumerate(range(0,len(paths),7),1):
   subset=paths[start:start+7];sheet=Image.new('RGB',(1056,48+320*len(subset)),'#222630');d=ImageDraw.Draw(sheet)
   text(d,(12,8),f'C.2 / {category} / 1x, 2x, 3x nearest; grey; quarter-size squint')
   for i,p in enumerate(subset):
    y=48+i*320;im=Image.open(p).convert('RGBA');g=im.convert('L')
    text(d,(12,y-16),p.stem)
    for pic,x in [(im,12),(im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST),132),
     (im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST),348),(g,660),
     (g.resize((g.width*2,g.height*2),Image.Resampling.NEAREST),780),
     (g.resize((g.width//4,g.height//4),Image.Resampling.NEAREST),996)]:
     sheet.paste(pic,(x,y),pic if pic.mode=='RGBA' else None)
   sheet.save(R/f'C-canon-{category}-{page}.png')
 # Complete ramp diagnostics: full native 48px chips, plus exact nearest copies.
 for page,start in enumerate(range(0,len(RAMPS),10),1):
  rows=list(RAMPS.items())[start:start+10];panel=Image.new('RGB',(672,72*len(rows)+24),'#222630');d=ImageDraw.Draw(panel)
  for i,(n,cols) in enumerate(rows):
   y=24+i*72;text(d,(4,y+4),n)
   for j,col in enumerate(cols):
    x=180+j*80;d.rectangle((x,y,x+47,y+47),fill=col)
    text(d,(x,y+50),f'{lightness(col):.1f}'+(' REF' if j+1 in roles(n).get('reference-only',[]) else ''))
  for scale in (1,2,3):panel.resize((panel.width*scale,panel.height*scale),Image.Resampling.NEAREST).save(R/f'C-palette-{page}-{scale}x.png')
  panel.convert('L').save(R/f'C-palette-{page}-grey.png')
  panel.convert('L').resize((panel.width//4,panel.height//4),Image.Resampling.NEAREST).save(R/f'C-palette-{page}-squint.png')
 # Guide review sections retain every source/annotation pixel, with grey/zoom views.
 guide=Image.open(B/'canon/style-guide.png')
 for name,box in json.loads((R/'B-guide-sections.json').read_text()):
  pic=guide.crop(box)
  for scale in (1,2,3):pic.resize((pic.width*scale,pic.height*scale),Image.Resampling.NEAREST).save(R/f'C-guide-{name}-{scale}x.png')
  pic.convert('L').save(R/f'C-guide-{name}-grey.png')
  pic.convert('L').resize((max(1,pic.width//4),max(1,pic.height//4)),Image.Resampling.NEAREST).save(R/f'C-guide-{name}-squint.png')
 # Preserve unrelated deliverables, including every source crop.
 before=json.loads((R/'C-critic2-before.json').read_text());changed=[]
 for path,h in before.items():
  if hashlib.sha256((B/path).read_bytes()).hexdigest()!=h:changed.append(path)
 old=json.loads((R/'C-before-palette.json').read_text())
 remap={old[n][i]:new for n,v in RAMPS.items() for i,new in enumerate(v) if new!=old[n][i]}
 preservation={'changed_existing':changed,'colour_replacements':remap,
  'passing_crypt_study_unchanged':'canon/swatches/crypt.png' not in changed,
  'source_crops_unchanged':not any(p.startswith('canon/crops/') for p in changed),
  'passing_props_colour_only':{}}
 for name in ('column','door'):
  # The initial palette-only substitutions are the sole authorised change to
  # these passing files. Each changed pigment is reported, not called unchanged.
  used={('#%02x%02x%02x'%v[:3]) for v in Image.open(B/f'canon/props/{name}.png').convert('RGBA').get_flattened_data() if v[3]}
  original=Image.open(B/f'canon/props/{name}.png').convert('RGBA')
  inverse={tuple(bytes.fromhex(b[1:])):tuple(bytes.fromhex(a[1:])) for a,b in remap.items()}
  original.putdata([(*inverse.get(v[:3],v[:3]),v[3]) for v in original.get_flattened_data()])
  buffer=io.BytesIO();original.save(buffer,format='PNG')
  restored=hashlib.sha256(buffer.getvalue()).hexdigest()==before[f'canon/props/{name}.png']
  assert restored, (name,'colour-only preservation proof failed')
  preservation['passing_props_colour_only'][name]={'changed_colours':{a:b for a,b in remap.items() if b in used},'inverse_colour_remap_restores_original_sha256':restored}
 (R/'C-critic2-preservation.json').write_text(json.dumps(preservation,indent=2)+'\n')
 result={'pass':not fail,'failures':fail,'results':report}
 (R/'C-canon-validation.json').write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps({'pass':not fail,'failures':fail,'small':{n:v['small_components'] for n,v in report.items() if v['small_components']}},indent=2))
if __name__=='__main__':run()
