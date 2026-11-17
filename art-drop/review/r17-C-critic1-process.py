"""R17 C: register drawings, palette lock, mode sample, clean and composite only."""
from pathlib import Path
from collections import Counter
import json, hashlib
from PIL import Image, ImageDraw, PngImagePlugin
ART=Path(__file__).resolve().parents[1]; REV=ART/'review'; OUT=ART/'out/city17'
NN=Image.Resampling.NEAREST; DARK=(43,40,29,255)
BASE=[tuple(c) for c in json.loads(Image.open(REV/'r15-A-palette.png').info['Palette'])]
RED=[(77,42,28),(110,48,29),(143,58,30),(171,74,33),(194,94,42),(215,122,68),(231,148,79)]
PAL=BASE[:19]+RED+BASE[22:]
GROUND_PAL=[(115,118,105),(130,133,119),(140,142,127),(148,150,135),(157,159,143)]
GREEN_PAL=[(43,40,29),(57,65,31),(79,88,38),(105,116,47),(139,148,66)]
def save(im,path,**meta):
 info=PngImagePlugin.PngInfo()
 for k,v in meta.items():info.add_text(k,json.dumps(v))
 im.save(path,pnginfo=info)
def course(w):
 donor=Image.open(REV/'r15-A-course-donor.png').convert('RGBA');im=Image.new('RGBA',(w,1))
 for x in range(w):
  sx=0 if x==0 else 95 if x==w-1 else 1
  im.paste(donor.crop((sx,0,sx+1,1)),(x,0))
 return im

def register_bands(length,bands,target):
 """Register each painted mortar band to one native pixel, preserve order."""
 segments=[];last=0
 for lo,hi in bands:
  if lo>last:segments.append((last,lo,False))
  segments.append((lo,hi,True));last=hi
 if last<length:segments.append((last,length,False))
 free=target-len(bands);total=sum(b-a for a,b,j in segments if not j)
 result=[];end=0;used=0
 for a,b,j in segments:
  if j:n=1
  else:
   used+=b-a;new=round(used*free/total);n=new-(end-sum(t[4] for t in result))
  result.append((a,b,end,end+n,int(j)));end+=n
 assert end==target
 return result

def joint_register(crop,rec):
 w,h=rec['size'];ys=register_bands(crop.height,rec['joint_rows'],h)
 reg=Image.new('RGBA',(w*8,h*8));logs=[]
 for y0,y1,dy0,dy1,isjoint in ys:
  band=crop.crop((0,y0,crop.width,y1));bw,bh=band.size
  # Read actual continuous painted dark joints through a course's middle.
  sample=band.crop((0,max(0,bh//3),bw,max(bh//3+1,2*bh//3)))
  vals=list(sample.get_flattened_data());sh=sample.height
  profile=[sum(sum(vals[y*bw+x][:3])/3 for y in range(sh))/sh for x in range(bw)]
  groups=[]
  for x,v in enumerate(profile):
   if v<rec.get('joint_threshold',100):
    if not groups or x>groups[-1][-1]+1:groups.append([x])
    else:groups[-1].append(x)
  bands=[(g[0],g[-1]+1) for g in groups if 3<=len(g)<bw*.09]
  # Horizontal mortar rows retain their entire drawing; only the course
  # bodies register their actual vertical joints.
  xs=register_bands(bw,bands,w) if bands and not isjoint else [(0,bw,0,w,0)]
  for x0,x1,dx0,dx1,_ in xs:
   if dx1>dx0 and dy1>dy0:reg.paste(band.crop((x0,0,x1,bh)).resize(((dx1-dx0)*8,(dy1-dy0)*8),Image.Resampling.BOX),(dx0*8,dy0*8))
  logs.append(dict(source_y=[y0,y1],native_y=[dy0,dy1],source_x_bands=bands,native_x=xs))
 return reg,logs

def process(rec):
 w,h=rec['size'];src=Image.open(REV/rec['source']).convert('RGBA')
 src.putdata([(0,0,0,0) if r>140 and b>110 and r>g*1.35 and b>g*1.2 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
 bounds=rec.get('crop',src.getbbox());crop=src.crop(bounds);geometry={'source_bounds':bounds}
 if rec.get('joint_rows'):
  reg,bands=joint_register(crop,rec);geometry.update(registration='painted course and mortar landmark registration at8x',bands=bands)
 elif rec.get('box'):
  bw,bh=rec['box'];reg=Image.new('RGBA',(w*8,h*8))
  reg.paste(crop.resize((bw*8,bh*8),Image.Resampling.BOX),((w-bw)*4,(h-bh)*8))
  geometry.update(registration='drawn-bounds BOX registration into specified native box',box=rec['box'])
 elif rec['id']=='fence-1':
  # Straighten the source's small perspective drift by registering whole
  # painted rows. The rail/posts remain drawn pixels, with no new geometry.
  bw=round(crop.width*h*8/crop.height)
  strip=crop.resize((bw,h*8),Image.Resampling.BOX)
  ext=[strip.crop((0,y,bw,y+1)).getbbox() for y in range(h*8)]
  centres=[(b[0]+b[2])/2 if b else bw/2 for b in ext]
  top=sum(centres[:8])/8;bottom=sum(centres[-8:])/8
  reg=Image.new('RGBA',(w*8,h*8))
  for y in range(h*8):
   offset=round(w*4-(top+(bottom-top)*y/(h*8-1)))
   reg.paste(strip.crop((0,y,bw,y+1)),(offset,y))
  geometry.update(registration='full-height row translation; linear fence-axis correction',source_axis8=[top,bottom])
 elif rec.get('overlay') or rec.get('silhouette'):
  if rec.get('overlay'):
   scale=min((w if rec['id']=='fence-0' else w-2)*8/crop.width,(h-2)*8/crop.height);bw,bh=round(crop.width*scale),round(crop.height*scale)
   reg=Image.new('RGBA',(w*8,h*8));xy=((w*8-bw)//2,h*8-bh-8)
   reg.paste(crop.resize((bw,bh),Image.Resampling.BOX),xy);geometry['placement8']=[*xy,bw,bh]
  else:reg=crop.resize((w*8,h*8),Image.Resampling.BOX)
 elif rec.get('columns') or rec['id'].startswith(('side-ground','side-storey')):
  # Each original painted column is registered between its own course bounds.
  bands=Image.new('RGBA',(crop.width,h*8));extents=[]
  for x in range(crop.width):
   b=crop.crop((x,0,x+1,crop.height)).getbbox();extents.append(b)
   if b:bands.paste(crop.crop((x,b[1],x+1,b[3])).resize((1,h*8),Image.Resampling.BOX),(x,0))
  reg=bands.resize((w*8,h*8),Image.Resampling.BOX)
  aligned=Image.new('RGBA',reg.size)
  for y in range(h*8):
   row=reg.crop((0,y,w*8,y+1));alpha=list(row.getchannel('A').get_flattened_data());runs=[];start=None
   for x,a in enumerate(alpha+[0]):
    if a>=254 and start is None:start=x
    elif a<254 and start is not None:runs.append((start,x));start=None
   if runs:
    left,right=max(runs,key=lambda b:b[1]-b[0]);aligned.paste(row.crop((left,0,right,1)).resize((w*8,1),Image.Resampling.BOX),(0,y))
  reg=aligned;geometry['registration']='painted column extents, then longest opaque row run; BOX 8x'
 else:
  extents=[crop.crop((0,y,crop.width,y+1)).getbbox() for y in range(crop.height)]
  good=[y for y,b in enumerate(extents) if b and b[2]-b[0]>=crop.width*rec.get('min_row_width',.88) and crop.crop((b[0],y,b[2],y+1)).getchannel('A').getextrema()==(255,255)]
  lo,hi=(good[0],good[-1]+1) if good else (0,crop.height)
  rows=Image.new('RGBA',(w*8,hi-lo))
  for y in range(lo,hi):
   b=extents[y]
   if b:rows.paste(crop.crop((b[0],y,b[2],y+1)).resize((w*8,1),Image.Resampling.BOX),(0,y-lo))
  reg=rows.resize((w*8,h*8),Image.Resampling.BOX);geometry.update(registration='painted row extents; BOX 8x',row_interval=[lo,hi])
 if rec.get('x_landmarks'):
  registered=Image.new('RGBA',reg.size)
  for (sx,dx),(ex,fx) in zip(rec['x_landmarks'],rec['x_landmarks'][1:]):
   registered.paste(reg.crop((sx*8,0,ex*8,h*8)).resize(((fx-dx)*8,h*8),Image.Resampling.BOX),(dx*8,0))
  reg=registered;geometry['x_landmarks']=rec['x_landmarks']
 palette=([BASE[0],*RED] if rec.get('roof_only') else (BASE[:19]+BASE[24:] if rec.get('course') or rec.get('overlay') else PAL))
 if rec.get('keep_lead'):palette += [BASE[7],BASE[15],BASE[16]]
 if rec.get('ground'):palette=GROUND_PAL
 pal=Image.new('P',(1,1));pal.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
 rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
 if rec.get('ground'):
  # Tone-lock the painted mortar and stone faces; no spatial pattern is added.
  donor=[(85,86,75),(105,106,91),(120,121,104),(135,136,118),(155,155,137)]
  rgb.putdata([GROUND_PAL[min(range(5),key=lambda i:sum((c[j]-donor[i][j])**2 for j in range(3)))] for c in reg.convert('RGB').get_flattened_data()])
  if rec.get('joint_rows'):
   # The identified painted mortar bands have their own two-colour ramp.
   # This preserves their material identity when pale source mortar would
   # otherwise quantize to the same colour as a stone face.
   for band in geometry['bands']:
    y0,y1=band['native_y'];isjoint=any(band['source_y']==list(b) for b in rec['joint_rows'])
    regions=[(0,y0*8,w*8,y1*8)] if isjoint else [(d0*8,y0*8,d1*8,y1*8) for a,b,d0,d1,j in band['native_x'] if j]
    for box in regions:
     patch=rgb.crop(box);patch.putdata([min(GROUND_PAL[:2],key=lambda q:sum((q[k]-v[k])**2 for k in range(3))) for v in patch.get_flattened_data()]);rgb.paste(patch,box[:2])
 if rec['id'].startswith('yard-3'):
  # Material-aware palette lock: retain the source's green canopy hue rather
  # than letting warm olive shadow samples quantize into timber browns.
  greens=GREEN_PAL
  original=list(reg.get_flattened_data());locked=list(rgb.get_flattened_data())
  for i,(r,g,b,a) in enumerate(original):
   if a>=128 and g>r*.80 and g>b*1.35 and i//reg.width<reg.height*.76:
    locked[i]=min(greens,key=lambda c:sum((c[j]-(r,g,b)[j])**2 for j in range(3)))
  rgb.putdata(locked)
 vals=[(*p,255) if a>=128 else (0,0,0,0) for p,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())];reg.putdata(vals)
 mode=[];sw=w*8
 for y in range(h):
  for x in range(w):
   ct=Counter(p for yy in range(8) for p in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);mode.append(min(ct,key=lambda p:(-ct[p],p)))
 out=mode[:]
 for y in range(h):
  for x in range(w):
   i=y*w+x
   if not mode[i][3]:continue
   ns=[mode[yy*w+xx] for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)) if 0<=xx<w and 0<=yy<h]
   if not rec.get('ground') and not rec.get('edge') and (len(ns)<4 or any(not p[3] for p in ns)):out[i]=DARK
   elif len(ns)==4 and len(set(ns))==1 and mode[i]!=ns[0]:
    ds=[mode[yy*w+xx] for xx,yy in ((x-1,y-1),(x+1,y-1),(x-1,y+1),(x+1,y+1)) if 0<=xx<w and 0<=yy<h]
    if mode[i] not in ds:out[i]=ns[0]
 # Remove isolated colour flecks using adjacent drawn colours. Preserve
 # connected linework, diagonal stair/roof edges, and silhouette contours.
 for _ in range(2):
  previous=out[:]
  for y in range(1,h-1):
   for x in range(1,w-1):
    i=y*w+x;p=previous[i]
    near=[previous[yy*w+xx] for yy in range(y-1,y+2) for xx in range(x-1,x+2) if (xx,yy)!=(x,y)]
    if p[3] and all(q[3] for q in near) and p not in near:
     out[i]=Counter(near).most_common(1)[0][0]
 im=Image.new('RGBA',(w,h));im.putdata(out)
 # Restore only subpixel painted rail ink lost by majority sampling, when
 # two neighbouring native ink pixels already support a one-pixel join.
 if rec['output'].startswith('back-stair'):
  prior=out[:]
  for y in range(1,h-1):
   for x in range(1,w-1):
    i=y*w+x
    if sum(prior[i][:3])<330:continue
    near=[prior[yy*w+xx] for yy in range(y-1,y+2) for xx in range(x-1,x+2) if (xx,yy)!=(x,y)]
    inks=[v for v in near if v[3] and sum(v[:3])<250]
    samples=[v for yy in range(8) for v in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8] if v[3] and sum(v[:3])<250]
    if len(inks)>=2 and len(samples)>=12:im.putpixel((x,y),Counter(samples).most_common(1)[0][0])
 if rec.get('course'):
  im.paste(course(w),(0,0));im.paste(course(w),(0,h-1))
 if rec['output'].startswith('roof-back') or rec['output'].endswith('-roof') or rec['output'].startswith('side-roof'):im.paste(course(w),(0,h-1))
 if rec.get('wrap_patch'):
  patch=im.crop(tuple(rec['wrap_patch']));wrapped=Image.new('RGBA',im.size)
  for y in range(0,h,patch.height):
   for x in range(0,w,patch.width):wrapped.paste(patch,(x,y))
  im=wrapped;geometry['wrap_patch']=rec['wrap_patch']
 final=list(im.get_flattened_data());edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(mode,final)) if a!=b]
 mi=Image.new('RGBA',(w,h));mi.putdata(mode)
 save(reg,REV/f"r17-C-critic1-registered-{rec['id']}.png",Registration=geometry)
 save(mi,REV/f"r17-C-critic1-mode-{rec['id']}.png")
 save(im,REV/f"r17-C-critic1-clean-{rec['id']}.png",Cleanup=edits)
 if rec.get('selected'):save(im,(REV/f"r17-C-{rec['output']}.png") if rec.get('review_only') else OUT/(rec['output']+'.png'))
 return dict(id=rec['id'],output=rec['output'],selected=rec.get('selected',False),size=[w,h],geometry=geometry,palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=edits)

def run():
 records=json.loads((REV/'r17-C-critic1-generation.json').read_text());processing=[]
 for rec in records:processing.append(process(rec))
 joins=[]
 for rec in records:
  if not rec.get('selected'):continue
  path=OUT/(rec['output']+'.png');im=Image.open(path).convert('RGBA');before=list(im.get_flattened_data())
  if rec.get('joint_rows'):
   # A single drawn mortar row belongs to the north tile boundary; retain
   # the southern stone-face row so wrapping does not double the joint.
   im.paste(im.crop((0,im.height-2,im.width,im.height-1)),(0,im.height-1))
   if rec.get('north_joint_donor') is not None:
    sy=rec['north_joint_donor'];im.paste(im.crop((0,sy,im.width,sy+1)),(0,0))
  if rec['output']=='fence-1':
   # End contact uses the same drawn rail cross-section in both directions.
   im.paste(im.crop((0,16,24,17)),(0,0));im.paste(im.crop((0,16,24,17)),(0,47))
  if rec['output']=='mud-edge':im.paste(im.crop((0,0,48,1)),(0,47))
  after=list(im.get_flattened_data());changes=[[i%im.width,i//im.width,list(a),list(b)] for i,(a,b) in enumerate(zip(before,after)) if a!=b]
  if changes:save(im,path);joins.append(dict(output=rec['output'],operation='native painted end-contact transfer',changes=changes))
 save(Image.open(OUT/'side-storey-E.png').convert('RGBA'),OUT/'side-storey.png')
 (REV/'r17-C-critic1-native-joins.json').write_text(json.dumps(joins,indent=2)+'\n')
 (REV/'r17-C-critic1-processing.json').write_text(json.dumps(processing,indent=2)+'\n')
 print('Processed',len(processing),'redraws')
if __name__=='__main__':run()
