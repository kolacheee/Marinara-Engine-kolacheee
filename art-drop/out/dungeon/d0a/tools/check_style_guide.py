"""Validate Part B pixels and make review-only native/NN/grey/squint panels."""
import argparse, hashlib, json
from collections import Counter
from pathlib import Path
from PIL import Image, ImageDraw
from draw_style_samples import ROOT,CANON,c
from build_palette import lightness
from build_style_guide import text
REVIEW=ROOT/'art-drop/review-d0a'
PALETTE={tuple(bytes.fromhex(line.split()[0][1:])) for line in (CANON/'palette.hex').read_text().splitlines() if line.startswith('#')}

def clusters(im):
 a=im.convert('RGB').load();w,h=im.size;seen=set();small=[]
 for y in range(h):
  for x in range(w):
   if (x,y) in seen:continue
   seen.add((x,y));q=[(x,y)];group=[]
   while q:
    xx,yy=q.pop();group.append((xx,yy))
    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
     z=xx+dx,yy+dy
     if 0<=z[0]<w and 0<=z[1]<h and z not in seen and a[z]==a[x,y]:seen.add(z);q.append(z)
   if len(group)<3:small.append(group)
 return small

def measurements(im):
 rgba=im.convert('RGBA');counts=Counter(rgba.getdata());opaque={v[:3] for v in counts if v[3]}
 return {'size':list(im.size),'colours':len(opaque),'alpha_values':sorted({v[3] for v in counts}),
 'soft_alpha_pixels':sum(n for v,n in counts.items() if v[3] not in (0,255)),
 'nonzero_transparent_rgb':sum(n for v,n in counts.items() if v[3]==0 and v[:3]!=(0,0,0)),
 'off_palette_pixels':sum(n for v,n in counts.items() if v[3] and v[:3] not in PALETTE),
 'opaque_black_pixels':sum(n for v,n in counts.items() if v[3] and v[:3]==(0,0,0))}

def backing(im):
 a=Image.new('RGBA',im.size,c('grey-brown-rock',3));a.alpha_composite(im.convert('RGBA'));return a.convert('RGB')

def panel(im,name,master):
 a=backing(im);w,h=a.size;grey=a.convert('L').convert('RGB');squint=grey.resize((max(1,w//4),max(1,h//4)),Image.Resampling.NEAREST)
 width=max(w*5+72,w*2+master.width+squint.width+100,528)
 height=max(h,master.height)+h*3+132
 sheet=Image.new('RGB',(width,height),c('void-mass',1));d=ImageDraw.Draw(sheet)
 text(d,(16,8),name+' / source pixels preserved')
 y=44
 for label,src,x in [('1x',a,16),('MASTER 1x',master,w+32),('GREY 1x',grey,w+master.width+48),('SQUINT /4',squint,w*2+master.width+64)]:
  text(d,(x,27),label);sheet.paste(src,(x,y))
 y+=max(h,master.height)+36
 text(d,(16,y-18),'2x NEAREST');text(d,(w*2+40,y-18),'3x NEAREST')
 sheet.paste(a.resize((w*2,h*2),Image.Resampling.NEAREST),(16,y))
 sheet.paste(a.resize((w*3,h*3),Image.Resampling.NEAREST),(w*2+40,y))
 sheet.save(REVIEW/f'B-{name}.png')

def main(reviews):
 report={'scope':'D0a Part B only','cell_px':48,'files':{},'sources':{},'errors':[]}
 combined=set()
 for folder,cap in [('props',48),('swatches',32)]:
  for p in sorted((CANON/folder).glob('*.png')):
   im=Image.open(p);m=measurements(im);m['cap']=cap
   for metric in ('soft_alpha_pixels','nonzero_transparent_rgb','off_palette_pixels','opaque_black_pixels'):
    if m[metric]:report['errors'].append(f'{p.name}: {metric}={m[metric]}')
   if m['colours']>cap or any(v%48 for v in im.size):report['errors'].append(f'{p.name}: size or colour cap')
   if folder=='swatches':
    small=clusters(im);m['texture_clusters_under_3_px']=small
    values=[lightness('#%02x%02x%02x'%v[:3]) for v in set(im.convert('RGBA').getdata())]
    m['Lstar_range']=[round(min(values),3),round(max(values),3)];m['Lstar_span']=round(max(values)-min(values),3)
    if small or min(values)<35 or max(values)>55 or max(values)-min(values)>15:report['errors'].append(f'{p.name}: floor clusters or values')
   else:combined|={v[:3] for v in im.convert('RGBA').getdata() if v[3]}
   report['files'][str(p.relative_to(CANON))]=m
 # Targeted proof for critic 1: shared edges, corner blocks and straight runs.
 report['outline_geometry']={}
 for name,ramp in [('crate','wood-oak'),('chest','textiles-teal'),('column','limestone'),('door','limestone'),('table','wood-oak')]:
  im=Image.open(CANON/'props'/f'{name}.png').convert('RGBA');pixels=im.load()
  dark=tuple(bytes.fromhex(c(ramp,1)[1:]))+(255,)
  blocks=[(x,y) for y in range(im.height-1) for x in range(im.width-1)
   if all(pixels[x+dx,y+dy]==dark for dx,dy in ((0,0),(1,0),(0,1),(1,1)))]
  report['outline_geometry'][name]={'darkest_ramp_2x2_blocks':blocks}
  if blocks:report['errors'].append(name+': doubled dark corner')
 table=Image.open(CANON/'props/table.png').convert('RGBA')
 left=[next(x for x in range(96) if table.getpixel((x,y))[3]) for y in range(24,49)]
 regular=left==[20-(y-24)//2 for y in range(24,49)]
 report['outline_geometry']['table'].update({'left_edge_x_rows_24_to_48':left,'regular_two_row_runs':regular})
 if not regular:report['errors'].append('table: irregular left silhouette')
 crate=Image.open(CANON/'props/crate.png').convert('RGBA')
 left=[next(x for x in range(48) if crate.getpixel((x,y))[3]) for y in range(3,16)]
 report['outline_geometry']['crate']['upper_left_diagonal_regular']=left==list(range(17,4,-1))
 if left!=list(range(17,4,-1)):report['errors'].append('crate: irregular upper-left silhouette')
 report['combined_prop_colours']=len(combined)
 if len(combined)>48:report['errors'].append('Combined props exceed 48 colours')
 for item in json.loads((CANON/'crops/SOURCES.json').read_text()):
  p=CANON/item['file'];im=Image.open(p);m=measurements(im);m['reference_exception']=item['kind'] if 'kind' in item else item['exception']
  if 'box' in item:
   expected=Image.open(ROOT/item['source']).crop(item['box']).convert('RGBA')
   m['matches_source_pixels']=im.convert('RGBA').tobytes()==expected.tobytes()
   if not m['matches_source_pixels']:report['errors'].append(f'{p.name}: changed source')
  else:
   pack=json.loads((ROOT/item['source']).read_text());native=Image.new('RGBA',(16,16));alpha='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   for y,row in enumerate(pack['tiles']['party'][0]):
    for x,ch in enumerate(row):
     if ch!='.':
      v=tuple(bytes.fromhex(pack['palette'][alpha.index(ch)][1:]));native.putpixel((x,y),v if len(v)==4 else (*v,255))
   expected=Image.new('RGBA',(48,48),item['backing']);expected.alpha_composite(native,tuple(item['placement']))
   m['matches_native_source_composite']=expected.convert('RGB').tobytes()==im.convert('RGB').tobytes()
   if not m['matches_native_source_composite']:report['errors'].append('party: changed source composite')
  if m['soft_alpha_pixels'] or m['nonzero_transparent_rgb'] or any(v%48 for v in im.size):report['errors'].append(f'{p.name}: alpha/dimensions')
  report['sources'][item['file']]=m
 guide=Image.open(CANON/'style-guide.png');m=measurements(guide);masked=guide.copy();dd=ImageDraw.Draw(masked)
 for x,y,xx,yy in json.loads((REVIEW/'B-guide-exemptions.json').read_text()):dd.rectangle((x,y,xx-1,yy-1),fill=c('void-mass',1))
 m['authored_pixels_after_reference_and_grey_diagram_mask']=measurements(masked)
 if m['soft_alpha_pixels'] or m['authored_pixels_after_reference_and_grey_diagram_mask']['off_palette_pixels']:report['errors'].append('Guide alpha or drawn palette')
 report['files']['style-guide.png']=m
 # Check every body pigment present in each demonstrated material, including the
 # darker oak top plane that the old single-step lookup omitted. Recesses (step 2),
 # outlines (step 1), and >70 highlights are reported separately from body planes.
 materials={'crate':['wood-oak'],'chest':['textiles-teal'],
  'column':['limestone'],'door':['wood-oak','limestone'],'table':['wood-oak']}
 report['prop_value_checks']={}
 panel_order=['party-source','door','table','chest','column','crate']
 for n,ramps in materials.items():
  im=Image.open(CANON/'props'/f'{n}.png').convert('RGBA');counts=Counter(im.getdata())
  x=48+panel_order.index(n)*272
  floor='#%02x%02x%02x'%guide.convert('RGB').getpixel((x+2,378));L=lightness(floor)
  display=n in ('door','table','crate')
  entry={'backing_role':'non-floor display; no scene pairing claim' if display else 'dungeon floor',
   'backing_hex':floor,'backing_Lstar':round(L,3),'planes':[], 'outlines':[]}
  if display:
   if floor!=c('ash',2):report['errors'].append(n+': unexpected display backing')
  elif not 35<=L<=55:report['errors'].append(n+': floor outside L*35-55')
  for ramp in ramps:
   for step in range(1,7):
    colour=c(ramp,step);pixels=counts[tuple(bytes.fromhex(colour[1:]))+(255,)]
    if not pixels:continue
    value=lightness(colour);gap=abs(value-L)
    item={'ramp':ramp,'step':step,'hex':colour,'pixels':pixels,
     'Lstar':round(value,3),'gap':round(gap,3)}
    if step==1:
     entry['outlines'].append(item)
     if not display and gap<10:report['errors'].append(n+': outline value gap')
    elif step>=3 and value<=70:
     entry['planes'].append(item)
     if not display and (value<30 or gap<10):report['errors'].append(n+': body '+colour+' value gap')
  report['prop_value_checks'][n]=entry
 report['status']='pass' if not report['errors'] else 'fail'
 (REVIEW/'B-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'status':report['status'],'errors':report['errors'],'art_files':len(report['files']),'sources':len(report['sources']),'combined_prop_colours':len(combined)},indent=2))
 if reviews:
  master=Image.open(CANON/'crops/wood-prop.png').convert('RGB')
  for folder in ('props','swatches','crops'):
   for p in sorted((CANON/folder).glob('*.png')):
    # Compare each material/object with the relevant source, at native size.
    master_png=Image.open(ROOT/'art-drop/dungeon/reference/master-interiors-mock.png').convert('RGB')
    if folder=='props' and p.stem=='door':ref=master_png.crop((496,776,580,872))
    elif folder=='props' and p.stem=='table':ref=master_png.crop((590,570,870,684))
    elif folder=='props' and p.stem=='column':ref=Image.open(CANON/'crops/stone-prop.png').convert('RGB')
    elif folder=='swatches' and p.stem=='building-yard':ref=Image.open(CANON/'crops/overworld-grass.png').convert('RGB').crop((0,0,96,96))
    elif folder=='swatches' and p.stem!='manor':ref=master_png.crop((1944,2112,2040,2208))
    else:ref=Image.open(CANON/'crops'/('floor.png' if folder=='swatches' else 'wood-prop.png')).convert('RGB').crop((0,0,96,96))
    panel(Image.open(p),folder+'-'+p.stem,ref)
  # Complete guide views plus smaller proof panels covering every source pixel.
  for label,src in [('1x',guide),('2x',guide.resize((guide.width*2,guide.height*2),Image.Resampling.NEAREST)),('3x',guide.resize((guide.width*3,guide.height*3),Image.Resampling.NEAREST)),('grey',guide.convert('L')),('squint',guide.convert('L').resize((guide.width//4,guide.height//4),Image.Resampling.NEAREST))]:src.save(REVIEW/f'B-guide-{label}.png')
  for name,box in json.loads((REVIEW/'B-guide-sections.json').read_text()):
   for col in range(3):
    b=(col*576,box[1],(col+1)*576,box[3]);panel(guide.crop(b),f'guide-{name}-{col+1}',master)
 if report['errors']:raise SystemExit(1)
if __name__=='__main__':main(argparse.ArgumentParser().parse_known_args()[1]==['--reviews'])
