"""Read saved pixels; regenerate C review sheets and the critic-1 repair report."""
import json,hashlib
from collections import defaultdict
from PIL import Image,ImageDraw
from redraw_proofs_c2 import BASE,REVIEW,S,BODY,c
from draw_proofs import P
from check_proofs import light,rgb,mean,native_master,reviews,grouped_reviews

def components(im):
 seen=set();groups=[];shapes=defaultdict(list)
 for y in range(im.height):
  for x in range(im.width):
   if (x,y) in seen:continue
   col=im.getpixel((x,y));todo=[(x,y)];seen.add((x,y));g=[]
   while todo:
    a,b=todo.pop();g.append((a,b))
    for u,v in ((a-1,b),(a+1,b),(a,b-1),(a,b+1)):
     if 0<=u<im.width and 0<=v<im.height and (u,v) not in seen and im.getpixel((u,v))==col:seen.add((u,v));todo.append((u,v))
   groups.append((col,g))
   if 3<=len(g)<=300 and all(0<a<im.width-1 and 0<b<im.height-1 for a,b in g):
    ax=min(a for a,b in g);ay=min(b for a,b in g)
    shapes[tuple(sorted((a-ax,b-ay) for a,b in g))].append((ax,ay))
 return [{'colour':col,'points':g} for col,g in groups if len(g)<3], [{'size':len(shape),'origins':origins} for shape,origins in shapes.items() if len(origins)>1]

def structure(n,item):
 # Known native panel screws, seam lips and mounting tabs only. No grain,
 # deposits, spill shapes or hand-drawn fractures are exempted.
 if not n.startswith('station_'):return False
 size=item['size'];locs=item['origins']
 if n=='station_lab':
  return (size==7 and all(x%48==3 and y%48==3 for x,y in locs)
   or size==3 and all(x%48==4 and y%48==3 for x,y in locs)
   or size==34 and all(x%48==3 and y%48==7 for x,y in locs))
 return (size==32 and all(x%48==10 and y%48==3 for x,y in locs)
  or size==9 and all(x%48==4 and y%48==4 for x,y in locs)
  or size==3 and all(x%48==5 and y%48==4 for x,y in locs)
  or size==12 and all(x%48==39 and y%48==39 for x,y in locs))

def check():
 pal={rgb(line.split()[0]) for line in (BASE/'canon/palette.hex').read_text().splitlines() if line.startswith('#')};results={};fail=[]
 master,box=native_master();station,sbox=native_master(True)
 for n,cfg in S.items():
  im=Image.open(BASE/'proof'/f'{n}.png').convert('RGBA');g=Image.open(BASE/'proof'/f'{n}-grey.png').convert('RGBA')
  f,w,p=[Image.open(REVIEW/f'C-layer-{n}-{k}.png').convert('RGBA') for k in ('floor','wall','prop')]
  allowed={rgb(h) for r in cfg[4]+['void-mass'] for h in P[r]}
  pixels=[v for layer in (im,f,w,p,g) for v in layer.get_flattened_data()]
  art=[v for layer in (im,f,w,p) for v in layer.get_flattened_data()]
  surface={v[:3] for layer in (f,w) for v in layer.get_flattened_data() if v[3]};pc={v[:3] for v in p.get_flattened_data() if v[3]}
  fv=[light(v) for v in set(f.get_flattened_data())];small,repeated=components(f);dups=[a for a in repeated if not structure(n,a)]
  body={rgb(c(*a)) for a in BODY[n]};outlines={rgb(c(r,1)) for r in cfg[4]}
  pairs=[];opairs=[];body_bad=[];opaque=0;body_count=0;darkblocks=[]
  for y in range(48):
   for x in range(48):
    a=p.getpixel((x,y));b=f.getpixel((x+86,y+96));gap=abs(light(a)-light(b))
    if a[3]:opaque+=1
    if a[3] and a[:3] in body:
     pairs.append(gap);body_count+=1
     if gap<10:body_bad.append([x,y,a[:3],b[:3],round(gap,3)])
    if a[3] and a[:3] in outlines:opairs.append(gap)
    if x<47 and y<47 and all(p.getpixel((x+u,y+v))[3] and p.getpixel((x+u,y+v))[:3] in outlines for u,v in ((0,0),(1,0),(0,1),(1,1))):darkblocks.append([x,y])
  reconstructed=f.copy();reconstructed.paste(w,(0,0));reconstructed.alpha_composite(p,(86,96))
  levels={'mass':mean(w.crop((0,0,144,8))),'top':mean(w.crop((0,8,144,48))),'face':mean(w.crop((0,48,144,95))),'floor':mean(f)}
  checks={
   'dimensions':im.size==g.size==(144,144) and f.size==(144,144) and w.size==(144,96) and p.size==(48,48),
   'alpha_binary':all(v[3] in (0,255) for v in pixels),
   'transparent_rgb_zero':all(v[:3]==(0,0,0) for v in pixels if not v[3]),
   'palette_hex':surface|pc<=pal,'own_material_ramps':surface|pc<=allowed,
   'no_opaque_black':(0,0,0) not in surface|pc,
   'surface_cap_32':len(surface)<=32,'prop_cap_48':len(pc)<=48,
   'floor_clusters_3':not small,'no_duplicate_floor_features_3plus':not dups,
   'floor_35_55':min(fv)>=35 and max(fv)<=55,'floor_span_15':max(fv)-min(fv)<=15,
   'body_local_gap_10':bool(pairs) and min(pairs)>=10,'outline_local_gap_10':bool(opairs) and min(opairs)>=10,
   'body_30_70':all(30<=light(a)<=70 for a in body),
   'mass_top_face_floor':levels['mass']<levels['top']<levels['face']<levels['floor'],
   'mass_25pct_darker':levels['mass']<=levels['top']*.75,
   'wall_top_18_30':18<=levels['top']<=30,'wall_face_25_40':25<=levels['face']<=40,
   'baseline_1px':all(w.getpixel((x,95))[:3]==rgb(c(cfg[1][0],1)) for x in range(144)),
   'grey_exact':g.tobytes()==im.convert('L').convert('RGBA').tobytes(),
   'native_layer_reconstruction':im.tobytes()==reconstructed.tobytes()}
  stats={'checks':checks,'surface_colours':len(surface),'prop_colours':len(pc),'floor_L_min':min(fv),'floor_L_max':max(fv),'floor_span':max(fv)-min(fv),
         'body_gap_min':min(pairs),'outline_gap_min':min(opairs),'body_pixel_count':body_count,'prop_opaque_pixels':opaque,
         'body_colours':{h:light(rgb(h)) for r,s in BODY[n] for h in [c(r,s)]},'body_fail_pixels':body_bad,
         'small_floor_components':small,'duplicate_floor_features':dups,'structural_repeats':[a for a in repeated if structure(n,a)],
         'mean_L':levels,'dark_2x2_candidates':darkblocks,'prop_bbox':p.getbbox()}
  results[n]=stats;fail.extend(f'{n}: {k}' for k,v in checks.items() if not v)
  reviews(n,im,g,station if n.startswith('station_') else master,stats)
 grouped_reviews()
 for scale in (1,2):
  sheet=Image.new('RGB',(4*(144*scale+16),4*(144*scale+28)),'#222630');d=ImageDraw.Draw(sheet)
  for i,n in enumerate(S):
   x=i%4*(144*scale+16)+8;y=i//4*(144*scale+28)+20;d.text((x,y-15),n,fill='white')
   tile=Image.open(BASE/'proof'/f'{n}.png')
   if scale>1:tile=tile.resize((144*scale,144*scale),Image.Resampling.NEAREST)
   sheet.paste(tile.convert('RGB'),(x,y))
  sheet.save(REVIEW/f'C-contact-{scale}x.png')
  grey_sheet=Image.new('RGB',sheet.size,'#222630');gd=ImageDraw.Draw(grey_sheet)
  for i,n in enumerate(S):
   x=i%4*(144*scale+16)+8;y=i//4*(144*scale+28)+20;gd.text((x,y-15),n,fill='white')
   tile=Image.open(BASE/'proof'/f'{n}-grey.png')
   if scale>1:tile=tile.resize((144*scale,144*scale),Image.Resampling.NEAREST)
   grey_sheet.paste(tile.convert('RGB'),(x,y))
  grey_sheet.save(REVIEW/f'C-contact-grey-{scale}x.png')
 squint=Image.new('RGB',(4*192,4*212),'#222630');d=ImageDraw.Draw(squint)
 for i,n in enumerate(S):
  x=i%4*192+8;y=i//4*212+22;d.text((x,y-15),n,fill='white')
  tile=Image.open(BASE/'proof'/f'{n}-grey.png').resize((36,36),Image.Resampling.NEAREST)
  squint.paste(tile.convert('RGB'),(x,y));squint.paste(tile.resize((144,144),Image.Resampling.NEAREST).convert('RGB'),(x,y+44))
 squint.save(REVIEW/'C-squint-review.png')
 # Source-comparison sheet retains summer crop pixels and our 2x proof.
 sources=Image.new('RGB',(1088,480),'#222630');d=ImageDraw.Draw(sources)
 for i,kind in enumerate(('grass','path','cobble')):
  src=Image.open(BASE/f'canon/crops/overworld-{kind}.png')
  sources.paste(src.convert('RGB'),(i*208+8,30));d.text((i*208+8,10),f'SUMMER {kind} / native',fill='white')
 sources.paste(Image.open(BASE/'proof/yard.png').resize((288,288),Image.Resampling.NEAREST).convert('RGB'),(664,30));d.text((664,10),'REDRAW / 2x nearest',fill='white')
 sources.save(REVIEW/'C-yard-sources.png')
 report={'pass':not fail,'failures':fail,'cell':48,'grey_palette_exception':'Luminance diagnostics only. All coloured scene art is palette-locked.',
         'value_method':'Every declared main-body and outline pixel is compared to the floor at that exact location. All broad planes are declared; internal recesses and narrow highlights are separate.',
         'repeated_features':'4-neighbour components of 3..300 pixels. Known manufactured floor borders/fastener tabs are exempt only at their expected grid coordinates.',
         'visual_limits':'Dark 2x2 candidates can be internal recesses. Contour runs, material finish and seam salience require viewing the saved art.',
         'master_registered_crops':[box,sbox],'results':results}
 (REVIEW/'C-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 (REVIEW/'C-critic2-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':not fail,'failures':fail,'stats':{n:{k:v[k] for k in ('surface_colours','prop_colours','floor_span','body_gap_min','mean_L')} for n,v in results.items()}},indent=2))
 return report
if __name__=='__main__':
 raise SystemExit(0 if check()['pass'] else 1)
