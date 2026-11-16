"""Round 16 B. Process/composite image-tool drawings; never synthesize artwork."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin
from collections import Counter
import numpy as np
import json, hashlib

ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'review'; OUT=ROOT/'out/weather16'; REF=ROOT/'reference/r16'
NN=Image.Resampling.NEAREST
PALETTES={
 'fog':[(173,191,197),(200,214,216),(225,232,230),(241,243,235)],
 'heat':[(231,207,155),(255,244,212),(255,249,232)],
 'edge':[(51,51,51),(102,102,102),(153,153,153),(204,204,204),(255,255,255)]}
ALPHAS={'fog':[24,48,80,112], 'heat':[24,40,56]}
SIZES={'fog':[(136,35),(120,30),(104,28),(144,32),(116,34),(128,30)],
       'heat':[(67,4),(79,4),(48,4),(61,4),(73,3),(51,3),(58,4),(83,4)],
       'edge':[(224,48)]*4}
MOTION=[(0,0),(1,0),(1,1),(0,1)]

def save(im,name,**meta):
 info=PngImagePlugin.PngInfo()
 for k,v in meta.items():info.add_text(k,json.dumps(v) if not isinstance(v,str) else v)
 im.save(REVIEW/name,pnginfo=info)

def components(a,minimum=3,wrap=False):
 h,w=a.shape[:2];remaining=set(np.flatnonzero(a[:,:,3]>0).tolist());removed=[];sizes=[]
 while remaining:
  start=remaining.pop();group=[start];todo=[start]
  while todo:
   i=todo.pop();y,x=divmod(i,w)
   for dy in (-1,0,1):
    for dx in (-1,0,1):
     xx=x+dx;yy=y+dy
     if wrap:xx%=w;yy%=h
     if 0<=xx<w and 0<=yy<h:
      j=yy*w+xx
      if j in remaining:remaining.remove(j);group.append(j);todo.append(j)
  sizes.append(len(group))
  if len(group)<minimum:removed.extend(group)
 result=a.copy();result.reshape(-1,4)[removed]=0
 return result,removed,sizes

def reduce_piece(family,variant,index):
 src=REVIEW/f'r16-B-source-{family}-{variant}.png';raw=np.array(Image.open(src).convert('RGB'))
 key=(raw[:,:,0].astype(int)>raw[:,:,1].astype(int)+55)&(raw[:,:,2].astype(int)>raw[:,:,1].astype(int)+55)&(raw[:,:,0]>135)&(raw[:,:,2]>135)
 rgba=np.dstack((raw,np.where(key,0,255).astype('uint8')));rgba[key]=0
 cols,rows=(1,4) if family=='edge' else ((2,3) if family=='fog' else (2,4))
 hh,ww=raw.shape[:2];x=index%cols;y=index//cols
 cell=(round(x*ww/cols),round(y*hh/rows),round((x+1)*ww/cols),round((y+1)*hh/rows))
 im=Image.fromarray(rgba).crop(cell);box=im.getbbox()
 if family=='edge':
  # Preserve source magenta below the painted tips; never invent a taper.
  box=(box[0],box[1],box[2],min(im.height,box[3]+round((box[3]-box[1])*.09)))
 im=im.crop(box);w,h=SIZES[family][index]
 reg=np.array(im.resize((w*8,h*8),Image.Resampling.BOX));solid=reg[:,:,3]>=128
 pal=np.array(PALETTES[family],dtype=np.int32)
 distances=((reg[:,:,:3].astype(np.int32)[:,:,None,:]-pal[None,None,:,:])**2).sum(axis=3)
 ids=np.argmin(distances,axis=2).astype(np.uint8)+1;ids[~solid]=0
 entries=np.array([(0,0,0,0)]+[(*p,255) for p in PALETTES[family]],dtype=np.uint8)
 locked=entries[ids]
 # Lexicographic RGBA tie-break: transparent first, then increasing palette.
 blocks=ids.reshape(h,8,w,8).transpose(0,2,1,3).reshape(h,w,64)
 counts=np.stack([(blocks==i).sum(axis=2) for i in range(len(entries))],axis=2)
 mode=entries[counts.argmax(axis=2)]
 clean,removed,_=components(mode,3 if family!='edge' else 2)
 stem=f'{family}-{variant}-{index}'
 for stage,a in [('registered',locked),('mode',mode),('clean',clean)]:save(Image.fromarray(a),f'r16-B-{stage}-{stem}.png')
 return clean,{'source':src.name,'cell':cell,'crop_in_cell':box,'native':[w,h],'mode_blocks':w*h,'samples_per_block':64,'removed_indices':removed}

def soften_drawn_contour(a):
 # Only recolour the outermost drawn pixel. Do not add silhouette pixels.
 b=a.copy();solid=a[:,:,3]>0;padded=np.pad(solid,1)
 interior=padded[1:-1,1:-1]&padded[:-2,1:-1]&padded[2:,1:-1]&padded[1:-1,:-2]&padded[1:-1,2:]
 contour=solid&~interior;b[contour,:3]=PALETTES['fog'][0]
 return b,np.flatnonzero(np.any(a!=b,axis=2)).tolist()

def rgba_weather(a,family):
 b=a.copy()
 for rgb,alpha in zip(PALETTES[family],ALPHAS[family]):
  mask=(a[:,:,:3]==rgb).all(axis=2)&(a[:,:,3]>0);b[mask,3]=alpha
 return b

def stamp(canvas,part,x,y,wrap=True):
 h,w=canvas.shape[:2];py,px=np.nonzero(part[:,:,3]);yy=py+y;xx=px+x
 if wrap:yy%=h;xx%=w
 else:
  use=(yy>=0)&(xx>=0)&(yy<h)&(xx<w);py=py[use];px=px[use];yy=yy[use];xx=xx[use]
 p=part[py,px];old=canvas[yy,xx]
 # Palette-preserving overlap: select a painted sample, never alpha-blend.
 use=p[:,3]>old[:,3];canvas[yy[use],xx[use]]=p[use]

def render(parts,instances,frame,extent=192,unwrapped=False):
 a=np.zeros((extent,extent,4),np.uint8)
 for it in instances:
  dx,dy=MOTION[(frame+it['phase'])%4] if it['moving'] else (0,0)
  if it.get('reverse'):dx=-dx;dy=-dy
  x=it['x']+dx;y=it['y']+dy
  if unwrapped:
   for oy in range(-384,extent+384,192):
    for ox in range(-384,extent+384,192):stamp(a,parts[it['part']],x+ox,y+oy,False)
  else:stamp(a,parts[it['part']],x,y)
 return a

def wrap_mask(a):
 # Hard minimum-error quilting in 32-column overlap. Every sample is drawn.
 ranks=np.zeros(a.shape[:2],np.uint8)
 for j,p in enumerate(PALETTES['edge'],1):ranks[(a[:,:,:3]==p).all(axis=2)&(a[:,:,3]>0)]=j
 left=ranks[:,:32];right=ranks[:,192:224];cost=(left.astype(int)-right.astype(int))**2
 dp=cost.copy();back=np.zeros_like(cost,dtype=int)
 for y in range(1,48):
  for x in range(32):
   lo=max(0,x-1);hi=min(32,x+2);q=lo+int(np.argmin(dp[y-1,lo:hi]));dp[y,x]+=dp[y-1,q];back[y,x]=q
 path=[int(np.argmin(dp[-1]))]
 for y in range(47,0,-1):path.append(int(back[y,path[-1]]))
 path=path[::-1];result=ranks[:,:192].copy()
 for y,k in enumerate(path):result[y,:k+1]=right[y,:k+1]
 # Cap alpha only: grey is never a visible fog colour.
 return np.array([0,24,48,80,112,255],np.uint8)[result],path

def edges_from_field(field,masks):
 n,s,e,w=masks
 caps={'n':n[::-1,:], 's':s,'e':e.T,'w':w.T[:,::-1]}
 fields={'n':field[144:192,:],'s':field[:48,:],'e':field[:,:48],'w':field[:,144:192]}
 edges={}
 for k in 'nsew':
  a=fields[k].copy();a[:,:,3]=np.minimum(a[:,:,3],caps[k]);a[a[:,:,3]==0]=0
  edges[k]=components(a,3,True)[0]
 return edges,caps

def area_overlay(frame,edges,caps):
 # Two-by-two core; existing edge PNGs surround it. Corner pixels are the
 # pointwise lower-alpha intersection of the two delivered edge crops.
 a=np.zeros((576,576,4),np.uint8);a[96:480,96:480]=np.tile(frame,(2,2,1))
 for z in (96,288):
  a[48:96,z:z+192]=edges['n'];a[480:528,z:z+192]=edges['s']
  a[z:z+192,48:96]=edges['w'];a[z:z+192,480:528]=edges['e']
 for side_y,ys in [('n',48),('s',480)]:
  for side_x,xs in [('w',48),('e',480)]:
   for yy in range(48):
    for xx in range(48):
     fx=(xs+xx-96)%192;fy=(ys+yy-96)%192
     p=edges[side_y][yy,fx].copy();p[3]=min(int(p[3]),int(edges[side_x][fy,xx,3]));
     if p[3]==0:p[:3]=0
     a[ys+yy,xs+xx]=p
 return components(a,3,False)[0]

def stats(a):
 alpha=a[:,:,3];return {'size':[a.shape[1],a.shape[0]],'covered_pixels':int((alpha>0).sum()),'cover_percent':round(float((alpha>0).mean()*100),4),'weighted_cover_percent':round(float(alpha.mean()/255*100),4),'alpha_levels':np.unique(alpha).tolist(),'rgba_entries':len(np.unique(a.reshape(-1,4),axis=0))-1,'hidden_rgb_pixels':int(np.any(a[alpha==0,:3]!=0,axis=1).sum())}

def composite(bg,over):return Image.alpha_composite(bg.convert('RGBA'),Image.fromarray(over)).convert('RGB')

def tiled_ref(ref,size):
 a=np.array(ref.convert('RGBA'));ny=(size[1]+a.shape[0]-1)//a.shape[0];nx=(size[0]+a.shape[1]-1)//a.shape[1]
 return Image.fromarray(np.tile(a,(ny,nx,1))[:size[1],:size[0]])

def sheet(im,label):
 w,h=im.size;sheet=Image.new('RGB',(w*5+48,h*4+48),(28,32,38));d=ImageDraw.Draw(sheet)
 d.text((12,8),label+'  |  native 1x + exact nearest-neighbour 4x',fill='white')
 sheet.paste(im,(12,32));sheet.paste(im.resize((w*4,h*4),NN),(w+28,32));return sheet

def write_reviews(frames,edges,caps,parts,records):
 refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(REF.glob('ref-*.png'))}
 overview=Image.new('RGB',(7*288,3*312),(28,32,38));d=ImageDraw.Draw(overview)
 for col,(name,ref) in enumerate(refs.items()):
  for row,kind in enumerate(['clear','fog','heat_wave']):
   im=ref if kind=='clear' else composite(ref,np.tile(frames[kind][0],(2,2,1))[:288,:288])
   overview.paste(im,(col*288,row*312+24));d.text((col*288+6,row*312+6),name+' / '+kind,fill='white')
 save(overview,'r16-B-overview.png')
 # All final PNGs shown at their true scale plus exact 4x, over real references.
 for family,ff in frames.items():
  bg=refs['fantasy-town' if family=='fog' else 'desert-sand'].crop((0,0,192,192))
  strip=Image.new('RGB',(4*208,224),(28,32,38));dd=ImageDraw.Draw(strip)
  for f,a in enumerate(ff):
   im=composite(bg,a);save(sheet(im,f'{family}-f{f}.png'),f'r16-B-file-{family}-f{f}.png')
   strip.paste(im,(f*208+8,24));dd.text((f*208+8,8),f'f{f}',fill='white')
   for name,ref in refs.items():
    repeat=composite(tiled_ref(ref,(576,576)),np.tile(a,(3,3,1)))
    for scale in (1,3,4):save(repeat.resize((576*scale,576*scale),NN),f'r16-B-repeat-{family}-f{f}-{name}-{scale}x.png')
  save(strip,f'r16-B-filmstrip-{family}.png')
 for direction,a in edges.items():
  bg=refs['fantasy-grass'].crop((0,0,a.shape[1],a.shape[0]));im=composite(bg,a)
  save(sheet(im,f'fog-edge-{direction}.png'),f'r16-B-file-fog-edge-{direction}.png')
 for name,ref in refs.items():
  bg=tiled_ref(ref,(576,576));im=composite(bg,area_overlay(frames['fog'][0],edges,caps))
  for scale in (1,4):save(im.resize((576*scale,576*scale),NN),f'r16-B-fog-area-{name}-{scale}x.png')
 # Two actual exported four-state loops, all references at native scale.
 for family,ff in frames.items():
  images=[]
  for f,a in enumerate(ff):
   im=Image.new('RGB',(4*288,2*312),(28,32,38));dd=ImageDraw.Draw(im)
   for j,(name,ref) in enumerate(refs.items()):
    x=(j%4)*288;y=(j//4)*312;im.paste(composite(ref,np.tile(a,(2,2,1))[:288,:288]),(x,y+24));dd.text((x+5,y+6),name,fill='white')
   dd.text((3*288+12,312+50),f'{family} / f{f}\n4 frames, 360 ms each\nActual PNG states\n192 px spatial period',fill='white');images.append(im)
  pal=images[0].quantize(256,method=Image.Quantize.MEDIANCUT)
  qq=[im.quantize(palette=pal,dither=Image.Dither.NONE) for im in images]
  qq[0].save(REVIEW/f'r16-B-{family}.gif',save_all=True,append_images=qq[1:],duration=360,loop=0,disposal=2,optimize=False)
 # A bank with all four edge pieces, in motion, no square perimeter.
 images=[composite(tiled_ref(refs['fantasy-town'],(576,576)),area_overlay(a,edges,caps)) for a in frames['fog']]
 pal=images[0].quantize(256,method=Image.Quantize.MEDIANCUT);qq=[im.quantize(palette=pal,dither=Image.Dither.NONE) for im in images]
 qq[0].save(REVIEW/'r16-B-fog-area.gif',save_all=True,append_images=qq[1:],duration=360,loop=0,disposal=2,optimize=False)
 # Native working drawings make the source selection inspectable without low alpha.
 ss=Image.new('RGB',(1024,850),(28,32,38));dd=ImageDraw.Draw(ss)
 for col,var in enumerate('ab'):
  dd.text((col*512+12,8),f'VARIANT {var.upper()} / hard-alpha native donors',fill='white')
  for family,basey in [('fog',40),('heat',340),('edge',540)]:
   for i,a in enumerate(parts[family][var]):
    x=col*512+12+(i%2)*242;y=basey+(i//2)*(90 if family=='fog' else (45 if family=='heat' else 130))
    im=Image.fromarray(a);ss.paste(im,(x,y),im);dd.text((x,y-12),f'{family} {i}',fill='white')
 dd.text((12,805),'SELECTED: fog B (open low strata); heat A (less regular kinks); edge B (long shallow fingers).',fill='white')
 dd.text((12,823),'All six atlases are image-tool drawings. Edge greys become opacity caps, never visible fog colours.',fill='white')
 save(ss,'r16-B-selection.png')

def main():
 parts={};records={}
 for family in ['fog','heat','edge']:
  parts[family]={};records[family]={}
  for var in 'ab':
   pr=[reduce_piece(family,var,i) for i in range(len(SIZES[family]))]
   parts[family][var]=[x[0] for x in pr];records[family][var]=[x[1] for x in pr]
 fog=[];contours=[]
 for a in parts['fog']['b']:
  a,c=soften_drawn_contour(a);contours.append(c);fog.append(rgba_weather(a,'fog'))
 heat=[rgba_weather(a,'heat') for a in parts['heat']['a']]
 # Irregular placements of six different drawn banks. Boundary-crossing banks
 # remain stationary so the four single-state edge PNGs match every phase.
 heat_places=[(0,14,11,0),(1,103,29,1),(2,162,55,2),(3,38,71,3),(4,104,93,0),
              (5,17,119,2),(6,118,145,3),(7,54,172,1),(2,15,48,1),(6,61,137,0),
              (3,146,184,2),(5,142,114,3),(0,61,50,0),(4,-33,158,2)]
 instances={'fog':json.loads((REVIEW/'r16-B-layout.json').read_text())['instances'],
            'heat_wave':[{'part':p,'x':x,'y':y,'moving':True,'phase':q,'reverse':bool(i%2)} for i,(p,x,y,q) in enumerate(heat_places)]}
 weather_parts={'fog':fog,'heat_wave':heat}
 frames={k:[render(weather_parts[k],instances[k],f) for f in range(4)] for k in weather_parts}
 masks=[];paths=[]
 for a in parts['edge']['b']:
  mask,path=wrap_mask(a);masks.append(mask);paths.append(path)
 edges,caps=edges_from_field(frames['fog'][0],masks)
 measurements={'source_method':'built-in image tool on solid magenta; 8x BOX registration, palette lock, all-64-sample RGBA mode, cleanup, palette-preserving composite',
  'selection':{'fog':'b','heat':'a','edges':'b'},'drawings':records,'fog_contour_recolours':contours,
  'motion_cycle':MOTION,'instances':instances,'edge_quilt_paths':paths,'palettes':PALETTES,'alphas':ALPHAS,'files':{},'motion':{}}
 measurements['edge_cleanup_removed']={'n':[[21,11]],'s':[],'e':[],'w':[[4,107],[4,108],[4,110],[4,111]]}
 for family,ff in frames.items():
  for f,a in enumerate(ff):
   name=f'{family}-f{f}.png';Image.fromarray(a).save(OUT/name);measurements['files'][name]=stats(a)
  measurements['motion'][family]=[{'from':f,'to':(f+1)%4,'changed_pixels':int(np.any(ff[f]!=ff[(f+1)%4],axis=2).sum()),'alpha_mean_absolute_delta':round(float(np.abs(ff[f][:,:,3].astype(int)-ff[(f+1)%4][:,:,3]).mean()),6)} for f in range(4)]
 for k,a in edges.items():
  name=f'fog-edge-{k}.png';Image.fromarray(a).save(OUT/name);measurements['files'][name]=stats(a)
  save(Image.fromarray(caps[k]),f'r16-B-cap-{k}.png')
 write_reviews(frames,edges,caps,parts,records)
 (REVIEW/'r16-B-measurements.json').write_text(json.dumps(measurements,indent=2)+'\n')
 print(json.dumps({'files':measurements['files'],'motion':measurements['motion']},indent=2))

if __name__=='__main__':main()
