"""Check saved Part C pixels, retain diagnostic evidence under review-d0a."""
import json,hashlib
from collections import Counter,deque
from PIL import Image,ImageDraw,ImageFont
from draw_proofs import BASE,REVIEW,S,P,c

def light(rgb):
 v=[n/255 for n in rgb[:3]];v=[n/12.92 if n<=.04045 else ((n+.055)/1.055)**2.4 for n in v]
 y=sum(n*w for n,w in zip(v,(.2126,.7152,.0722)))
 return 116*y**(1/3)-16 if y>216/24389 else y*24389/27

def components(im):
 w,h=im.size;px=im.load();seen=set();small=[];shapes=Counter()
 for y in range(h):
  for x in range(w):
   if (x,y) in seen:continue
   colour=px[x,y];stack=[(x,y)];seen.add((x,y));group=[]
   while stack:
    a,b=stack.pop();group.append((a,b))
    for u,v in ((a-1,b),(a+1,b),(a,b-1),(a,b+1)):
     if 0<=u<w and 0<=v<h and (u,v) not in seen and px[u,v]==colour:seen.add((u,v));stack.append((u,v))
   if len(group)<3:small.append({'colour':colour,'points':group})
   if 8<=len(group)<=300 and all(0<a<w-1 and 0<b<h-1 for a,b in group):
    ax=min(a for a,b in group);ay=min(b for a,b in group)
    shapes[tuple(sorted((a-ax,b-ay) for a,b in group))]+=1
 return small,[{'size':len(k),'count':v} for k,v in shapes.items() if v>1]

def native_master(station=False):
 # Exact 2x2 block registration, not filtered reduction. Used only for review.
 src=Image.open(BASE.parents[2]/'dungeon/reference/master-interiors-mock.png').convert('RGB')
 out=Image.new('RGB',(144,144));box=(1944,1080,2232,1368) if station else (776,208,1064,496)
 crop=src.crop(box)
 for y in range(144):
  for x in range(144):out.putpixel((x,y),crop.getpixel((x*2,y*2)))
 return out,box
BODY={
 'keep':[('wood-oak',5)],'temple':[('sandstone',4),('brass',4),('marble',3)],
 'manor':[('timber',5),('textiles-sage',4)],'crypt':[('dark-masonry',6),('lichen',4),('bone',3)],
 'cave_rock':[('fungus',4),('mud',6)],'cave_ice':[('blue-ice',2),('snowdrift',2)],
 'cave_crystal':[('violet-crystal',4)],'cave_lava':[('ash',4),('ash',2)],
 'dungeon_sewer':[('sewer-water',5),('slime',4)],
 'station_corridor':[('station-panels',4),('hazard-paint',4)],
 'station_lab':[('tank-glass',4),('tank-glass',2)],'station_engine':[('pipes',4)],
 'station_hydro':[('planters',4),('overgrowth',4)],'yard':[('yard-cobble',5)]}
def rgb(h):return tuple(bytes.fromhex(h[1:]))
def mean(im):return sum(light(p)*n for n,p in im.getcolors(im.width*im.height))/ (im.width*im.height)
def reviews(name,im,grey,master,stats):
 # 1x, 2x, 3x and greyscale all use exact pixel repetition. A quarter-size
 # diagnostic samples one existing greyscale pixel per 4x4 block (nearest).
 out=Image.new('RGB',(1248,1008),'#222630');d=ImageDraw.Draw(out)
 def put(image,xy,title):
  d.text((xy[0],xy[1]-15),title,fill='#e6e3d7');out.paste(image.convert('RGB'),xy)
 d.text((12,8),f'D0a C / {name} / native cell 48 / {S[name][5]}',fill='white')
 put(im,(12,48),'PROOF 1x / 144px')
 put(master,(180,48),'MASTER: 1px per 2x2 block')
 put(Image.open(BASE/'canon/crops/wall.png'),(1080,48),'MASTER WALL 1x PNG')
 put(im.resize((288,288),Image.Resampling.NEAREST),(12,232),'PROOF 2x / native pixels repeated')
 # Source master PNG at native stored scale next to our 2x proof.
 put(master.resize((288,288),Image.Resampling.NEAREST),(324,232),'MASTER 1x stored / same art scale')
 put(im.resize((432,432),Image.Resampling.NEAREST),(636,48),'PROOF 3x / nearest-neighbour')
 put(grey,(348,48),'GREYSCALE 1x')
 put(grey.resize((288,288),Image.Resampling.NEAREST),(12,552),'GREYSCALE 2x')
 put(master.resize((432,432),Image.Resampling.NEAREST),(636,552),'MASTER art pixels 3x / compare with proof above')
 # Fit grey 3x into an additional dedicated sheet below.
 small=grey.resize((36,36),Image.Resampling.NEAREST)
 put(small,(516,48),'SQUINT 1/4')
 put(small.resize((144,144),Image.Resampling.NEAREST),(348,552),'SQUINT enlarged 4x')
 d.text((348,720),f"Floor L*: {stats['floor_L_min']:.2f}..{stats['floor_L_max']:.2f}",fill='white')
 d.text((348,738),f"Prop gap min: {stats['body_gap_min']:.2f} L*",fill='white')
 d.text((348,756),f"Surface/prop colours: {stats['surface_colours']}/{stats['prop_colours']}",fill='white')
 out.save(REVIEW/f'C-{name}-review.png')
 gsheet=Image.new('RGB',(1056,480),'#222630');gd=ImageDraw.Draw(gsheet)
 gd.text((12,8),f'{name}: greyscale 1x / 3x; quarter-size squint; master native art scale',fill='white')
 gsheet.paste(grey.convert('RGB'),(12,40));gsheet.paste(grey.resize((432,432),Image.Resampling.NEAREST).convert('RGB'),(180,40))
 gsheet.paste(master.convert('L').convert('RGB'),(636,40));gsheet.paste(small.convert('RGB'),(804,40));gsheet.save(REVIEW/f'C-{name}-grey.png')

def grouped_reviews():
 names=list(S)
 for group in range(4):
  subset=names[group*4:group*4+4]
  for kind in ('repeat','grey','final'):
   sheet=Image.new('RGB',(896,944),'#222630');d=ImageDraw.Draw(sheet)
   for i,name in enumerate(subset):
    x=8+i%2*448;y=24+i//2*472;d.text((x,y-16),name+' / '+kind,fill='white')
    if kind=='repeat':tile=Image.open(REVIEW/f'proof-3x3repeat-{name}.png')
    else:
     suffix='-grey' if kind=='grey' else ''
     tile=Image.open(BASE/'proof'/f'{name}{suffix}.png').resize((432,432),Image.Resampling.NEAREST)
    sheet.paste(tile.convert('RGB'),(x,y))
   sheet.save(REVIEW/f'C-{kind}-review-{group+1}.png')

def check():
 master,box=native_master();station_master,station_box=native_master(True);results={};fail=[]
 palette={rgb(h) for v in P.values() for h in v}
 for name,cfg in S.items():
  im=Image.open(BASE/'proof'/f'{name}.png').convert('RGBA');grey=Image.open(BASE/'proof'/f'{name}-grey.png').convert('RGBA')
  layers={tag:Image.open(REVIEW/f'C-layer-{name}-{tag}.png').convert('RGBA') for tag in ('floor','wall','prop')}
  f,w,p=(layers[tag] for tag in ('floor','wall','prop'))
  allowed={rgb(h) for r in cfg[4]+['void-mass'] for h in P[r]}
  colours={v[:3] for v in im.getdata() if v[3]};surfaces={v[:3] for layer in (f,w) for v in layer.getdata() if v[3]};pc={v[:3] for v in p.getdata() if v[3]}
  floorvalues=[light(v) for v in set(f.getdata())];small,repeats=components(f)
  # The two repeated 24px L-shaped panel corners are structural seams.
  feature_repeats=[v for v in repeats if not (name=='station_corridor' and v=={'size':24,'count':9})]
  under={f.getpixel((x+86,y+96))[:3] for y in range(48) for x in range(48) if p.getpixel((x,y))[3]}
  body={rgb(c(*v)) for v in BODY[name]};outlines={rgb(c(r,1)) for r in cfg[4]} & pc
  gaps=[abs(light(a)-light(b)) for a in body for b in under]
  outlinegaps=[abs(light(a)-light(b)) for a in outlines for b in under]
  allpixels=list(im.getdata())+list(p.getdata())+list(f.getdata())+list(w.getdata())
  baseline=all(w.getpixel((x,95))[:3]==rgb(c(cfg[1][0],1)) for x in range(144))
  reconstruction=f.copy();reconstruction.paste(w,(0,0));reconstruction.alpha_composite(p,(86,96))
  mass=mean(w.crop((0,0,144,8)));top=mean(w.crop((0,8,144,48)));face=mean(w.crop((0,48,144,95)));fl=mean(f)
  checks={
   'size_144':im.size==grey.size==(144,144),
   'alpha_binary':all(v[3] in (0,255) for v in allpixels+list(grey.getdata())),
   'transparent_rgb_zero':all(v[:3]==(0,0,0) for v in allpixels if v[3]==0),
   'palette':colours<=palette and surfaces<=palette and pc<=palette,
   'own_ramps':colours<=allowed and surfaces<=allowed and pc<=allowed,
   'no_opaque_black':(0,0,0) not in colours|surfaces|pc,
   'surface_cap_32':len(surfaces)<=32,'prop_cap_48':len(pc)<=48,
   'floor_clusters_3':not small,'floor_feature_duplicates':not feature_repeats,
   'floor_L_window':min(floorvalues)>=35 and max(floorvalues)<=55,
   'floor_L_span_15':max(floorvalues)-min(floorvalues)<=15,
   'body_gap_10':min(gaps)>=10,'outline_gap_10':min(outlinegaps)>=10,
   'body_L_window':all(30<=light(v)<=70 for v in body),
   'wall_baseline_1px':baseline,
   'ladder_means':mass<top<face<fl,
   'mass_25pct_darker':mass<=top*.75,
   'grey_exact':grey.tobytes()==im.convert('L').convert('RGBA').tobytes(),
   'native_composition':im.tobytes()==reconstruction.tobytes(),
  }
  stats={'checks':checks,'colours':len(colours),'surface_colours':len(surfaces),'prop_colours':len(pc),
   'floor_L_min':min(floorvalues),'floor_L_max':max(floorvalues),'floor_span':max(floorvalues)-min(floorvalues),
   'body_gap_min':min(gaps),'outline_gap_min':min(outlinegaps),'body_L':[light(v) for v in body],
   'small_floor_components':small,'duplicate_floor_components':repeats,'duplicate_floor_features':feature_repeats,
   'mean_L':{'mass':mass,'top':top,'face':face,'floor':fl},
   'prop_bbox':p.getbbox(),'sha256':hashlib.sha256((BASE/'proof'/f'{name}.png').read_bytes()).hexdigest()}
  results[name]=stats
  fail.extend(f'{name}: {k}' for k,v in checks.items() if not v)
  reviews(name,im,grey,station_master if name.startswith('station_') else master,stats)
 # Every tile at native scale and 2x, on compact sheets suitable for manual review.
 for scale in (1,2):
  sheet=Image.new('RGB',(4*(144*scale+16),4*(144*scale+28)),'#222630');d=ImageDraw.Draw(sheet)
  for i,name in enumerate(S):
   x=i%4*(144*scale+16)+8;y=i//4*(144*scale+28)+20
   d.text((x,y-15),name,fill='white');tile=Image.open(BASE/'proof'/f'{name}.png')
   if scale>1:tile=tile.resize((144*scale,144*scale),Image.Resampling.NEAREST)
   sheet.paste(tile.convert('RGB'),(x,y))
  sheet.save(REVIEW/f'C-contact-{scale}x.png')
 report={'pass':not fail,'failures':fail,'cell':48,'master_review_crop':box,'station_master_crop':station_box,
  'grey_palette_exception':'Exact luminance diagnostic; not coloured scene art.',
  'visual_checks':'Outline run lengths, pixel density, material readability and seam salience require visual review.',
  'results':results}
 grouped_reviews()
 (REVIEW/'C-validation.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'pass':not fail,'failures':fail,'stats':{k:{x:v[x] for x in ('surface_colours','prop_colours','floor_span','body_gap_min','mean_L')} for k,v in results.items()}},indent=2))
 return report
if __name__=='__main__':
 import sys
 sys.exit(0 if check()['pass'] else 1)
