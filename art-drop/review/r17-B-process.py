"""Magenta-key, register and mode-reduce drawings. Never draw asset geometry."""
from pathlib import Path
from collections import Counter
import json, sys
from PIL import Image, PngImagePlugin

ART=Path(__file__).resolve().parents[1]; REV=ART/'review'; OUT=ART/'out/city17'
NN=Image.Resampling.NEAREST
DARK=(43,40,29,255)
BASE=[tuple(x) for x in json.loads(Image.open(REV/'r15-A-palette.png').info['Palette'])]
RED=[(77,42,28),(110,48,29),(143,58,30),(171,74,33),(194,94,42),(215,122,68),(231,148,79)]
RAMPS=[RED,[(43,49,58),(55,65,77),(69,81,94),(85,99,111),(103,117,126),(127,141,146),(155,165,162)],
       [(64,47,30),(87,61,32),(111,78,39),(137,98,47),(162,122,62),(188,147,83),(210,171,110)]]
PAL=BASE[:19]+RED+BASE[22:]

def save(im,path,**meta):
    info=PngImagePlugin.PngInfo()
    for k,v in meta.items():info.add_text(k,json.dumps(v))
    im.save(path,pnginfo=info)

def course(w):
    donor=Image.open(REV/'r15-A-course-donor.png').convert('RGBA')
    out=Image.new('RGBA',(w,1))
    for x in range(w):out.paste(donor.crop((0 if x==0 else 95 if x==w-1 else 1,0,1 if x==0 else 96 if x==w-1 else 2,1)),(x,0))
    return out

def reduce(rec):
    name=rec['id'];w,h=rec['size'];src=Image.open(REV/rec['source']).convert('RGBA')
    src.putdata([(0,0,0,0) if r>140 and b>110 and r>g*1.35 and b>g*1.2 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
    box=src.getbbox();crop=src.crop(box);geometry={'source_bounds':box}
    if rec.get('source_rows'):
        # Register the six complete painted courses independently, retaining
        # every course rather than repeating an interior miniature stamp.
        reg=Image.new('RGBA',(w*8,h*8))
        for sy0,sy1,ty0,ty1 in zip(rec['source_rows'],rec['source_rows'][1:],rec['target_rows'],rec['target_rows'][1:]):
            x0,x1=rec['source_columns']
            band=src.crop((x0,sy0,x1,sy1)).resize((w*8,(ty1-ty0)*8),Image.Resampling.BOX)
            reg.paste(band,(0,ty0*8))
        geometry.update(source_rows=rec['source_rows'],target_rows=rec['target_rows'],source_columns=rec['source_columns'])
    elif rec.get('silhouette'):
        reg=crop.resize((w*8,h*8),Image.Resampling.BOX)
        geometry['registration']='painted bounds, unchanged silhouette, BOX at 8x'
    elif rec.get('overlay'):
        scale=min((w-2)*8/crop.width,(h-2)*8/crop.height)
        bw,bh=round(crop.width*scale),round(crop.height*scale)
        reg=Image.new('RGBA',(w*8,h*8));xy=((w*8-bw)//2,h*8-bh-8)
        reg.paste(crop.resize((bw,bh),Image.Resampling.BOX),xy)
        geometry.update(placement8=[*xy,bw,bh])
    else:
        # Ignore a tiny ridge-tip protrusion before registering straight north edges.
        extents=[crop.crop((0,y,crop.width,y+1)).getbbox() for y in range(crop.height)]
        good=[y for y,b in enumerate(extents) if b and b[2]-b[0]>=crop.width*.82
              and crop.crop((b[0],y,b[2],y+1)).getchannel('A').getextrema()==(255,255)]
        lo,hi=(good[0],good[-1]+1) if good else (0,crop.height)
        rows=Image.new('RGBA',(w*8,hi-lo))
        for y in range(lo,hi):
            b=extents[y]
            if b:rows.paste(crop.crop((b[0],y,b[2],y+1)).resize((w*8,1),Image.Resampling.BOX),(0,y-lo))
        reg=rows.resize((w*8,h*8),Image.Resampling.BOX)
        geometry.update(row_interval=[lo,hi],registration='painted row extents; BOX at 8x')
    palette=([BASE[0],*RED,*([BASE[7],BASE[15],BASE[16]] if rec.get('keep_lead') else [])]
             if rec.get('roof_only') else PAL)
    pal=Image.new('P',(1,1));pal.putpalette([v for c in (palette+[palette[-1]]*(256-len(palette))) for v in c])
    rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*p,255) if a>=128 else (0,0,0,0) for p,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())];reg.putdata(vals)
    mode=[];sw=w*8
    for y in range(h):
        for x in range(w):
            counts=Counter(c for yy in range(8) for c in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8])
            mode.append(min(counts,key=lambda c:(-counts[c],c)))
    clean=mode[:]
    todo={i for i,c in enumerate(mode) if c[3]}
    while todo:
        seed=todo.pop();stack=[seed];group=[seed]
        while stack:
            i=stack.pop();y,x=divmod(i,w)
            for yy,xx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
                j=yy*w+xx
                if 0<=xx<w and 0<=yy<h and j in todo:todo.remove(j);stack.append(j);group.append(j)
        if len(group)<3:
            for i in group:clean[i]=(0,0,0,0)
    for y in range(h):
        for x in range(w):
            i=y*w+x
            if not clean[i][3]:continue
            ns=[mode[yy*w+xx] for yy,xx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)) if 0<=xx<w and 0<=yy<h]
            if not rec.get('fill') and not rec.get('shadow') and (len(ns)<4 or any(not p[3] for p in ns)):clean[i]=DARK
            elif len(ns)==4 and len(set(ns))==1 and ns[0]!=mode[i]:
                diagonal=[mode[yy*w+xx] for yy,xx in ((y-1,x-1),(y-1,x+1),(y+1,x-1),(y+1,x+1)) if 0<=xx<w and 0<=yy<h]
                if not (rec.get('preserve_diagonal') and mode[i] in diagonal):clean[i]=ns[0]
    im=Image.new('RGBA',(w,h));im.putdata(clean)
    if rec.get('flat_material_bounds'):
        # The drawn terrace is one roof material. Its ochre source shades must
        # join the tile ramp, rather than remain brown in the slate colourway.
        # Coping and fascia outside this registered paint region are retained.
        x0,y0,x1,y1=rec['flat_material_bounds']
        warm={(*p,255) for p in BASE if p[0]>p[1]*1.15 and p[1]>p[2]*1.15}
        lum=lambda p:.2126*p[0]+.7152*p[1]+.0722*p[2]
        mapped={p:(*min(RED,key=lambda r:abs(lum(r)-lum(p))),255) for p in warm}
        im.putdata([mapped.get(p,p) if x0<=i%w<x1 and y0<=i//w<y1 else p
                    for i,p in enumerate(im.get_flattened_data())])
        # Remove detached colour flecks left by subpixel terrace seams. Retain
        # connected courses; never join the fragments by drawing a new line.
        data=list(im.get_flattened_data());pending={y*w+x for y in range(y0,y1) for x in range(x0,x1)}
        while pending:
            seed=pending.pop();group={seed};queue=[seed];p=data[seed];border=[]
            while queue:
                i=queue.pop();y,x=divmod(i,w)
                for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                    j=yy*w+xx
                    if not (x0<=xx<x1 and y0<=yy<y1):continue
                    if data[j]==p and j in pending:pending.remove(j);group.add(j);queue.append(j)
                    elif data[j]!=p:border.append(data[j])
            if len(group)<=4 and border:
                replacement=Counter(border).most_common(1)[0][0]
                for i in group:data[i]=replacement
        im.putdata(data)
        geometry['flat_material_bounds']=rec['flat_material_bounds']
    if rec.get('timber_gable'):
        # Follow the source's closed dark verge/beam boundaries; recolour only
        # the enclosed timber paint. No polygon or replacement gable is drawn.
        data=list(im.get_flattened_data());region=set();queue=[]
        for x in range(w//2-w//12,w//2+w//12+1):queue.append((x,rec.get('timber_seed_row',h-8)))
        while queue:
            x,y=queue.pop();i=y*w+x
            if not (0<=x<w and int(h*.65)<=y<h) or i in region:continue
            p=data[i]
            if not p[3] or .2126*p[0]+.7152*p[1]+.0722*p[2]<rec.get('timber_threshold',78):continue
            region.add(i);queue.extend(((x-1,y),(x+1,y),(x,y-1),(x,y+1)))
        if len(region)>w*h*.15:raise ValueError((name,'timber mask escaped drawn verge',len(region)))
        m={(*r,255):(*b,255) for r,b in zip(RED,BASE[1:7]+[BASE[6]])}
        im.putdata([m.get(p,p) if i in region else p for i,p in enumerate(data)])
        geometry['timber_gable_pixels']=sorted(region)
    if rec.get('timber_from_row'):
        # Keep the drawn loading hatch in the established timber ramp, so roof
        # palette variants do not turn its warm source colours into blue wood.
        row=rec['timber_from_row'];m={(*r,255):(*b,255) for r,b in zip(RED,BASE[1:7]+[BASE[6]])}
        im.putdata([m.get(p,p) if i//w>=row else p for i,p in enumerate(im.get_flattened_data())])
        geometry['timber_from_row']=row
    if rec.get('wrap_patch'):
        # Tile-wrap an actual two-course/two-tile painted interior; no blend,
        # noise, stroke or invented pixel. This removes source border phase drift.
        patch=im.crop(tuple(rec['wrap_patch']));wrapped=Image.new('RGBA',im.size)
        for y in range(0,h,patch.height):
            for x in range(0,w,patch.width):wrapped.paste(patch,(x,y))
        im=wrapped;geometry['wrap_patch']=rec['wrap_patch']
    if rec['output'].startswith(('roof-gable','roof-ridge','roof-hip-w','roof-flat')):im.paste(course(w),(0,h-1))
    # Strip tint/alpha comes from the drawn shadow's keyed mask, not a new shape.
    if rec.get('shadow'):
        im.putdata([(30,30,30,112) if p[3] else (0,0,0,0) for p in im.get_flattened_data()])
    final=list(im.get_flattened_data())
    edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(mode,final)) if a!=b]
    modeim=Image.new('RGBA',(w,h));modeim.putdata(mode)
    save(reg,REV/f'r17-B-registered-{name}.png',Registration=geometry)
    save(modeim,REV/f'r17-B-mode-{name}.png')
    save(im,REV/f'r17-B-clean-{name}.png',Cleanup=edits)
    return im,dict(id=name,size=[w,h],geometry=geometry,cleanup=edits,mode_blocks=w*h)

def colour(im,c):
    if max(im.getchannel('A').get_flattened_data())==112:
        tint=[(30,30,30),(27,32,39),(38,31,23)][c]
        out=im.copy();out.putdata([(*tint,p[3]) if p[3] else (0,0,0,0) for p in im.get_flattened_data()]);return out
    m={(*a,255):(*b,255) for a,b in zip(RED,RAMPS[c])}
    out=im.copy();out.putdata([m.get(p,p) for p in im.get_flattened_data()]);return out

def run(ids=None):
    manifest=json.loads((REV/'r17-B-generation.json').read_text())
    path=REV/'r17-B-processing.json';previous=json.loads(path.read_text()) if path.exists() else []
    records={r['id']:r for r in previous}
    for r in manifest:
        if ids and r['id'] not in ids:continue
        im,processing=reduce(r);records[r['id']]=processing
        if r.get('selected'):
            base=r['output'];save(im,OUT/(base+'.png'))
            if not r.get('no_colours'):
                for c in range(3):save(colour(im,c),OUT/(base+f'-c{c}.png'))
            if r.get('shadow'):
                for width in (2,3):
                    wide=Image.new('RGBA',(48*width,im.height))
                    for x in range(width):wide.paste(im,(48*x,0))
                    name=base.replace('-w1',f'-w{width}')
                    save(wide,OUT/(name+'.png'),Assembly='native copies of '+base)
                    for c in range(3):save(colour(wide,c),OUT/(name+f'-c{c}.png'))
        print(r['id'],im.size,len(set(im.get_flattened_data())),len(processing['cleanup']))
    path.write_text(json.dumps(list(records.values()),indent=2)+'\n')

if __name__=='__main__':
    if not sys.argv[1:] and (REV/'r17-B-critic2-process.py').exists():
        import runpy
        runpy.run_path(str(REV/'r17-B-critic2-process.py'),run_name='__main__')
    elif not sys.argv[1:] and (REV/'r17-B-critic1-process.py').exists():
        import runpy
        runpy.run_path(str(REV/'r17-B-critic1-process.py'),run_name='__main__')
    else:run(sys.argv[1:] or None)
