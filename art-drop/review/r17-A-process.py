"""Register image-tool paintings; never construct facade geometry or texture."""
from pathlib import Path
from collections import Counter
from PIL import Image, ImageDraw, PngImagePlugin
import json, hashlib, sys

ART=Path(__file__).resolve().parents[1]
REV=ART/'review'; OUT=ART/'out/city17'; REF=ART/'reference/r17'
NN=Image.Resampling.NEAREST
DARK=(43,40,29,255)
PAL=[tuple(c) for c in json.loads(Image.open(REV/'r15-A-palette.png').info['Palette'])]
# Muted complete material ramps; originals retained for c0.
PLASTER=[(89,78,64),(130,116,95),(160,142,112),(187,167,133),
         (199,176,139),(221,202,169),(242,223,185),(249,238,210)]
RAMPS=[PLASTER,
 [(83,77,65),(116,108,89),(146,135,111),(170,158,131),(185,171,142),(206,192,161),(225,212,181),(238,228,200)],
 [(70,76,73),(101,111,105),(132,142,132),(156,165,151),(173,181,165),(195,202,185),(217,222,202),(233,237,217)]]

def save(im,path,**meta):
    info=PngImagePlugin.PngInfo()
    for k,v in meta.items():info.add_text(k,json.dumps(v))
    im.save(path,pnginfo=info)

def course(w):
    donor=Image.open(REV/'r15-A-course-donor.png').convert('RGBA')
    out=Image.new('RGBA',(w,1));out.paste(donor.crop((0,0,1,1)),(0,0))
    out.paste(donor.crop((95,0,96,1)),(w-1,0))
    for x in range(1,w-1,94):
        n=min(94,w-1-x);out.paste(donor.crop((1,0,n+1,1)),(x,0))
    return out

def reduce(rec):
    name=rec['id']; w,h=rec['size'];source=Image.open(REV/rec['source']).convert('RGBA')
    # Key the border-connected surround; retain burgundy cloth inside facades.
    pixels=list(source.get_flattened_data())
    mask=Image.new('L',source.size)
    mask.putdata([255 if r>140 and b>110 and r>g*1.35 and b>g*1.2 else 0 for r,g,b,a in pixels])
    if not rec.get('overlay'):
        ImageDraw.floodfill(mask,(0,0),128,thresh=0)
        keyed=[v==128 for v in mask.get_flattened_data()]
    else:keyed=[v==255 for v in mask.get_flattened_data()]
    source.putdata([(0,0,0,0) if key else (r,g,b,255) for (r,g,b,a),key in zip(pixels,keyed)])
    box=source.getbbox();crop=source.crop(box)
    if rec.get('overlay'):
        f=min((w-2)/crop.width,(h-2)/crop.height)
        bw,bh=round(crop.width*f*8),round(crop.height*f*8)
        reg=Image.new('RGBA',(w*8,h*8));reg.paste(crop.resize((bw,bh),Image.Resampling.BOX),((w*8-bw)//2,h*8-bh-8))
        geometry={'painted_box':box,'placement8':[(w*8-bw)//2,h*8-bh-8,bw,bh]}
    else:
        # Register drawn row extents, including tiny drawn corner bevels, to square edges.
        rows=Image.new('RGBA',(w*8,crop.height))
        for y in range(crop.height):
            row=crop.crop((0,y,crop.width,y+1));b=row.getbbox()
            if b:rows.paste(row.crop(b).resize((w*8,1),Image.Resampling.BOX),(0,y))
        reg=rows.resize((w*8,h*8),Image.Resampling.BOX)
        geometry={'painted_box':box,'registration':'painted row extents to full width; BOX at 8x'}
    if rec.get('register_x'):
        # Rebalance already-painted frontage before reduction. Each interval is
        # a source crop, BOX-registered to its destination; no shape is drawn.
        knots=rec['register_x']; adjusted=Image.new('RGBA',reg.size)
        assert knots[0]==[0,0] and knots[-1]==[w,w]
        for (sx,dx),(ex,tx) in zip(knots,knots[1:]):
            assert ex>sx and tx>dx
            band=reg.crop((sx*8,0,ex*8,h*8))
            adjusted.paste(band.resize(((tx-dx)*8,h*8),Image.Resampling.BOX),(dx*8,0))
        reg=adjusted;geometry['painted_frontage_registration']=knots
    if rec.get('registered_patch'):
        # A local image-tool repair: composite only the painted detail into
        # the retained 8x drawing. Accepted architecture remains source-exact.
        patch=rec['registered_patch'];box=tuple(v*8 for v in patch['box'])
        retained=Image.open(REV/patch['base']).convert('RGBA')
        assert retained.size==reg.size
        retained.paste(reg.crop(box),box[:2]);reg=retained
        geometry['registered_drawing_patch']=patch
    palette=[tuple(c) for c in rec.get('palette',PAL)]
    pal=Image.new('P',(1,1));pal.putpalette([v for c in (palette+[palette[-1]]*(256-len(palette))) for v in c])
    locked=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*rgb,255) if a>=128 else (0,0,0,0) for rgb,a in zip(locked.get_flattened_data(),reg.getchannel('A').get_flattened_data())]
    reg.putdata(vals); mode=[];sw=w*8
    for y in range(h):
        for x in range(w):
            counts=Counter(c for yy in range(8) for c in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8])
            mode.append(min(counts,key=lambda c:(-counts[c],c)))
    before=mode[:];clean=mode[:]
    # Remove detached alpha remnants; preserve every substantial painted component.
    todo={i for i,c in enumerate(clean) if c[3]};groups=[]
    while todo:
        seed=todo.pop();stack=[seed];g=[seed]
        while stack:
            i=stack.pop();y,x=divmod(i,w)
            for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]:
                j=yy*w+xx
                if 0<=xx<w and 0<=yy<h and j in todo:todo.remove(j);stack.append(j);g.append(j)
        groups.append(g)
    for g in groups:
        if len(g)<3:
            for i in g:clean[i]=(0,0,0,0)
    for y in range(h):
        for x in range(w):
            i=y*w+x
            if not before[i][3]:continue
            ns=[before[yy*w+xx] for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)] if 0<=xx<w and 0<=yy<h]
            if len(ns)<4 or any(not c[3] for c in ns):clean[i]=DARK
            # One-pixel colour flecks wholly surrounded by a single painted field.
            elif len(set(ns))==1 and ns[0]!=before[i]:clean[i]=ns[0]
    if rec.get('clean_material_flecks'):
        # Remove tiny quantisation islands only within their material ramp.
        # Preserve contrasting lanterns, handles, symbols, joints and contours.
        families=[PAL[1:7],PAL[7:15]+[PAL[18]],PAL[19:22]]
        membership={(*c,255):i for i,cs in enumerate(families) for c in cs}
        visited=set(); snapshot=clean[:]
        for seed,col in enumerate(snapshot):
            if seed in visited or col not in membership:continue
            todo=[seed];visited.add(seed);group=[]
            while todo:
                i=todo.pop();group.append(i);y,x=divmod(i,w)
                for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                    j=yy*w+xx
                    if 0<xx<w-1 and 0<yy<h-1 and j not in visited and snapshot[j]==col:
                        visited.add(j);todo.append(j)
            if len(group)>2:continue
            neighbours=[]
            for i in group:
                y,x=divmod(i,w)
                for yy in range(max(1,y-1),min(h-1,y+2)):
                    for xx in range(max(1,x-1),min(w-1,x+2)):
                        j=yy*w+xx
                        if j not in group:neighbours.append(snapshot[j])
            same=[c for c in neighbours if membership.get(c)==membership[col]]
            if neighbours and len(same)>=len(neighbours)*.75:
                counts=Counter(same);replacement=min(counts,key=lambda c:(-counts[c],c))
                for i in group:clean[i]=replacement
    im=Image.new('RGBA',(w,h));im.putdata(clean)
    if not rec.get('overlay'):
        donor=course(w);im.paste(donor,(0,0));im.paste(donor,(0,h-1))
    final=list(im.get_flattened_data())
    edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(mode,final)) if a!=b]
    modeim=Image.new('RGBA',(w,h));modeim.putdata(mode)
    save(reg,REV/f'r17-A-registered-{name}.png',Registration=geometry)
    save(modeim,REV/f'r17-A-mode-{name}.png')
    save(im,REV/f'r17-A-clean-{name}.png',Cleanup=edits)
    return im,dict(id=name,source=rec['source'],size=[w,h],geometry=geometry,cleanup=edits,mode_blocks=w*h)

def colour(im,c):
    if not c:return im.copy()
    m={(*a,255):(*b,255) for a,b in zip(PLASTER,RAMPS[c])}
    out=im.copy();out.putdata([m.get(p,p) for p in im.get_flattened_data()]);return out

def run(ids=None):
    manifest=json.loads((REV/'r17-A-generation.json').read_text())
    previous=json.loads((REV/'r17-A-processing.json').read_text()) if (REV/'r17-A-processing.json').exists() else []
    recs={r['id']:r for r in previous}
    for r in manifest:
        if ids and r['id'] not in ids:continue
        im,processing=reduce(r);recs[r['id']]=processing
        if r.get('selected',True):
            base=r['output']
            if r.get('overlay'):save(im,OUT/(base+'.png'))
            else:
                for c in range(3):save(colour(im,c),OUT/(base+f'-c{c}.png'))
                save(im,OUT/(base+'.png'))
                for alias in r.get('aliases',[]):
                    save(im,OUT/(alias+'.png'))
                    for c in range(3):save(colour(im,c),OUT/(alias+f'-c{c}.png'))
        print(r['id'],im.size,len(set(im.get_flattened_data())),len(processing['cleanup']))
    (REV/'r17-A-processing.json').write_text(json.dumps(list(recs.values()),indent=2)+'\n')

if __name__=='__main__':run(sys.argv[1:] or None)
