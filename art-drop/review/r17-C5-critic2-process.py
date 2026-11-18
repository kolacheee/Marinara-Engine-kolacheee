"""Critic 2: registration, exact 64-vote modes and native painted-material masks."""
from pathlib import Path
from collections import Counter
import importlib.util,json,hashlib
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('p',R/'r17-C5-process.py');p=importlib.util.module_from_spec(sp);sp.loader.exec_module(p)
NN=Image.Resampling.NEAREST
recs=json.loads((R/'r17-C5-critic2-generation.json').read_text())
drawings={};logs=[]
for rec in recs:
    n=rec['id'];w,h=rec['size'];src=p.key(Image.open(R/rec['source']));box=src.getbbox();src=src.crop(box)
    # Register the side/front corner explicitly, allocating a human-width side bay.
    split=.64 if n.startswith('east') else .39 if n.startswith('west') else None
    if split:
        sx=round(src.width*split);dx=48
        reg=Image.new('RGBA',(w*8,h*8))
        for xa,xb,da,db in [(0,sx,0,dx),(sx,src.width,dx,w)]:
            reg.paste(src.crop((xa,0,xb,src.height)).resize(((db-da)*8,h*8),Image.Resampling.BOX),(da*8,0))
    else:reg=src.resize((w*8,h*8),Image.Resampling.BOX)
    if n.startswith('abut'):
        # Coping overhang in the source is not a transparent slot in a shared
        # party wall: register each painted course to the rectangular receiver.
        for y in range(h*8):
            row=reg.crop((0,y,w*8,y+1));bb=row.getbbox()
            if bb:reg.paste(row.crop(bb).resize((w*8,1),Image.Resampling.BOX),(0,y))
    if n.startswith('wing'):
        # Register the painted principal facade shoulders to its two-cell lot;
        # retain the roof notch and small projecting doorway step unchanged.
        for y in range(149*8,233*8):
            row=reg.crop((0,y,w*8,y+1));bb=row.getbbox()
            if bb and bb[2]-bb[0]>w*8*.75:
                reg.paste(row.crop(bb).resize((w*8,1),Image.Resampling.BOX),(0,y))
    pal=list(dict.fromkeys(p.RED+p.FLOOR+p.STONE+[(96,109,115),(118,131,134)]))
    if n.startswith('abut'):pal=p.STONE+[(96,109,115),(118,131,134)]
    if n.startswith('shadow'):pal=[(20,22,21)]
    palette=Image.new('P',(1,1));palette.putpalette([v for rgb in pal+[pal[-1]]*(256-len(pal)) for v in rgb])
    rgb=reg.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*c,255) if a>=128 else (0,0,0,0) for c,a in zip(rgb.getdata(),reg.getchannel('A').getdata())];reg.putdata(vals)
    out=[]
    for y in range(h):
        for x in range(w):
            votes=Counter(q for yy in range(8) for q in vals[(y*8+yy)*w*8+x*8:(y*8+yy)*w*8+x*8+8]);out.append(min(votes,key=lambda q:(-votes[q],q)))
    mode=Image.new('RGBA',(w,h));mode.putdata(out);clean=mode.copy();clean.putdata(p.prior.clean_pixels(out,w,h))
    for suffix,a in [('registered',reg),('mode',mode),('clean',clean)]:a.save(R/f'r17-C5-critic2-{suffix}-{n}.png')
    drawings[n]=clean
    logs.append(dict(id=n,source=rec['source'],source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),bounds=box,size=[w,h],side_corner_registration=split,palette=pal,mode_blocks=w*h,samples_per_pixel=64))
(R/'r17-C5-critic2-processing.json').write_text(json.dumps(dict(drawings=logs),indent=2))
for family in ('cap','east','west','porch','wing','abut'):
    ids=[n for n in drawings if n.startswith(family)];a=Image.new('RGBA',(sum(drawings[n].width+16 for n in ids),max(drawings[n].height for n in ids)+24),(75,80,70,255));d=ImageDraw.Draw(a);x=8
    for n in ids:d.text((x,2),n,fill='white');a.alpha_composite(drawings[n],(x,24));x+=drawings[n].width+16
    for z in (1,4):a.resize((a.width*z,a.height*z),NN).save(R/f'r17-C5-critic2-selection-{family}-{z}x.png')
print(len(drawings),'drawings reduced')

# Traced material boundaries select already-painted roof surfaces only. They
# create no architecture: alpha and every non-roof pixel remain untouched.
roof_polygons={
 'cap-b':[[(0,0),(95,0),(95,143),(48,105),(0,143)]],
 'east-b':[[(0,0),(95,0),(95,49),(48,85),(25,39),(0,84)]],
 'west-b':[[(0,0),(95,0),(95,83),(66,19),(44,70),(0,89)]],
 'wing-b':[[(0,140),(4,105),(20,84),(48,87),(48,24),(72,0),(95,24),(95,148),(3,149)]],
}
ramps={'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]}
selected={'roof-filled-gable-c5r1-w2':'cap-b','side-house-east-c5r1':'east-b','side-house-west-c5r1':'west-b','church-porch-c5':'porch-b','fountain-shadow-c5':'shadow-a','roof-abut-left-c5r1':'abut-left-a','roof-abut-right-c5r1':'abut-right-a','house-rear-wing-c5r2':'wing-b'}
exports={};native=[]
for name,key in selected.items():
 a=drawings[key].copy();mask=Image.new('L',a.size)
 if key in roof_polygons:
  d=ImageDraw.Draw(mask)
  for polygon in roof_polygons[key]:d.polygon(polygon,fill=255)
  # Only select rust roof material; cream gables, dark beams and windows are excluded.
  mask.putdata([255 if m and q[3] and q[0]>q[1]*1.25 and q[0]>q[2]*1.45 else 0 for m,q in zip(mask.getdata(),a.getdata())])
  mask.save(R/f'r17-C5-critic2-roof-mask-{key}.png')
  for y in range(a.height):
   for x in range(a.width):
    if mask.getpixel((x,y)):
     q=a.getpixel((x,y));j=min(range(6),key=lambda i:sum((p.RED[i][k]-q[k])**2 for k in range(3)));a.putpixel((x,y),p.RED[j]+(255,))
 exports[name]=a
 tones=('slate',) if name.startswith('side-') else ('slate','brown') if name.startswith('roof-') else ()
 for tone in tones:
  b=a.copy();mp=dict(zip(p.RED,ramps[tone]))
  if name.startswith('roof-abut'):pass # grey receiving masonry is independent of the adjoining roof colour
  else:
   b.putdata([(*mp.get(q[:3],q[:3]),q[3]) if m else q for q,m in zip(a.getdata(),mask.getdata())])
  exports[name+'-'+tone]=b
 native.append(dict(output=name,drawing=key,roof_mask=f'r17-C5-critic2-roof-mask-{key}.png' if key in roof_polygons else None))
files=json.loads((R/'r17-C5-files.json').read_text())
for n,a in exports.items():
 a.putdata([q if q[3] else (0,0,0,0) for q in a.getdata()]);a.save(O/(n+'.png'));v=list(a.getdata())
 files[n]=dict(size=list(a.size),sha256=hashlib.sha256((O/(n+'.png')).read_bytes()).hexdigest(),colours=len(set(q[:3] for q in v if q[3])),alpha=sorted(set(q[3] for q in v)),hidden_rgb=0)
(R/'r17-C5-files.json').write_text(json.dumps(files,indent=2))
(R/'r17-C5-critic2-processing.json').write_text(json.dumps(dict(drawings=logs,native=native,selected=selected,roof_boundary_polygons=roof_polygons),indent=2))
print(len(exports),'exports written')
