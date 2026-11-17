"""Critic 2: register image-tool paint, mode reduce, clean and composite it.

No production geometry or texture is drawn here. Each connected roof is
sampled once as a whole; compositor splits use adjacent original native rows.
"""
from pathlib import Path
from collections import Counter
import json, hashlib
from PIL import Image, ImageDraw, PngImagePlugin

R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
BASE=[tuple(c) for c in json.loads(Image.open(R/'r15-A-palette.png').info['Palette'])]
RED=[(77,42,28),(110,48,29),(143,58,30),(171,74,33),(194,94,42),(215,122,68),(231,148,79)]
PAL=BASE[:19]+RED+BASE[22:]
GROUND=[(115,118,105),(130,133,119),(140,142,127),(148,150,135),(157,159,143)]
DARK=(*BASE[0],255); NN=Image.Resampling.NEAREST

def save(im,path,**meta):
    info=PngImagePlugin.PngInfo()
    for k,v in meta.items(): info.add_text(k,json.dumps(v))
    im.save(path,pnginfo=info)

def register_rows(src,box,size):
    """Register whole painted scanlines between observed square boundaries."""
    crop=src.crop(box); w,h=size
    rows=Image.new('RGBA',(w*8,crop.height)); bounds=[]
    for y in range(crop.height):
        row=crop.crop((0,y,crop.width,y+1)); a=list(row.getchannel('A').get_flattened_data())
        runs=[];left=None
        for x,v in enumerate(a+[0]):
            if v==255 and left is None:left=x
            elif v!=255 and left is not None:runs.append((left,x));left=None
        if not runs: raise ValueError(('empty paint row',box,y))
        left,right=max(runs,key=lambda q:q[1]-q[0]);bounds.append([int(left),int(right)])
        rows.paste(row.crop((left,0,right,1)).resize((w*8,1),Image.Resampling.BOX),(0,y))
    return rows.resize((w*8,h*8),Image.Resampling.BOX),bounds

def process(rec):
    src=Image.open(R/rec['source']).convert('RGBA')
    src.putdata([(0,0,0,0) if r>140 and b>110 and r>g*1.35 and b>g*1.2 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
    w,h=rec['size']; bounds=rec.get('crop',src.getbbox())
    reg=Image.new('RGBA',(w*8,h*8));logs=[]
    if rec['id'].startswith('tee'):
        # The painted L silhouette has two width bands; register each whole
        # painted band to its declared grid span without inventing a mask.
        sy=rec.get('step_y',726)
        for box,size,xy in [((0,8,src.width,sy),(96,96),(0,0)),((0,sy,src.width,src.height-4),(144,96),(0,768))]:
            band,ext=register_rows(src,box,size);reg.paste(band,xy);logs.append(dict(source_box=box,size=size,offset8=xy,row_extents=ext))
    else:
        # Exclude only tiny ridge protrusions above the full painted rectangle.
        if not rec['id'].startswith('paving'):
            full=[y for y in range(bounds[1],bounds[3]) if (q:=src.crop((bounds[0],y,bounds[2],y+1)).getbbox()) and q[2]-q[0]>(bounds[2]-bounds[0])*.96]
            bounds=[bounds[0],full[0],bounds[2],full[-1]+1]
        reg,ext=register_rows(src,bounds,(w,h));logs.append(dict(source_box=bounds,size=[w,h],offset8=[0,0],row_extents=ext))
    palette=GROUND if rec['id'].startswith('paving') else PAL
    p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
    rgb=reg.convert('RGB')
    if rec['id'].startswith('paving'):
        # Global material tone registration, never a spatial texture change.
        rgb.putdata([tuple(max(0,min(255,round(v*rec.get('tone_scale',1)+rec.get('tone_offset',0)))) for v in c) for c in rgb.get_flattened_data()])
    rgb=rgb.quantize(palette=p,dither=Image.Dither.NONE).convert('RGB')
    if rec.get('material_map'):
        mapping={tuple(palette[i]):tuple(palette[j]) for i,j in enumerate(rec['material_map'])}
        rgb.putdata([mapping[v] for v in rgb.get_flattened_data()])
    vals=[(*c,255) if a>=128 else (0,0,0,0) for c,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())];reg.putdata(vals)
    native=[];sw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(v for yy in range(8) for v in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8])
            native.append(min(votes,key=lambda v:(-votes[v],v)))
    clean=native[:]
    for _ in range(2):
        prev=clean[:]
        for y in range(1,h-1):
            for x in range(1,w-1):
                q=prev[y*w+x];near=[prev[yy*w+xx] for yy in range(y-1,y+2) for xx in range(x-1,x+2) if (xx,yy)!=(x,y)]
                if q[3] and all(v[3] for v in near) and q not in near:clean[y*w+x]=Counter(near).most_common(1)[0][0]
    if not rec['id'].startswith('paving'):
        prev=clean[:]
        for y in range(h):
            for x in range(w):
                if prev[y*w+x][3] and (x==0 or y==0 or x==w-1 or y==h-1 or any(not prev[yy*w+xx][3] for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)))):clean[y*w+x]=DARK
    out=Image.new('RGBA',(w,h));out.putdata(clean)
    edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(native,clean)) if a!=b]
    mode=Image.new('RGBA',(w,h));mode.putdata(native)
    save(reg,R/f"r17-C-critic2-registered-{rec['id']}.png")
    save(mode,R/f"r17-C-critic2-mode-{rec['id']}.png")
    save(out,R/f"r17-C-critic2-clean-{rec['id']}.png")
    return dict(id=rec['id'],source=rec['source'],source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),size=[w,h],registration=logs,palette=palette,mode_blocks=w*h,samples_per_block=64,cleanup=edits),out

def run():
    records=json.loads((R/'r17-C-critic2-generation.json').read_text()); logs=[];images={}
    for rec in records:
        log,im=process(rec);logs.append(log);images[rec['id']]=im
        if rec.get('selected'):
            target=O/'street-junction-turn.png' if rec['id'].startswith('paving') else R/f"r17-C-critic2-connected-{rec['id'][:-2]}.png"
            save(im,target,Source=rec['source'],Method='registered8x / palette / exact64-sample mode / native cleanup')
    (R/'r17-C-critic2-processing.json').write_text(json.dumps(logs,indent=2)+'\n')
    house=Image.open(R.parent/'reference/r17/fantasy-house-2.png').convert('RGBA')
    for i in range(0,len(records),2):
        pair=records[i:i+2];sheet=Image.new('RGBA',(1800,1020),(50,55,46,255));d=ImageDraw.Draw(sheet)
        for j,rec in enumerate(pair):
            im=images[rec['id']];x=12+j*650;d.text((x,12),rec['id']+' / native1x + NN4x',fill='white');sheet.alpha_composite(im,(x,40));sheet.alpha_composite(im.resize((im.width*4,im.height*4),NN),(x,240))
        sheet.alpha_composite(house,(1300,40));sheet.alpha_composite(house.resize((576,576),NN),(1220,240))
        sheet.save(R/f'r17-C-critic2-choice-{i//2}.png')
    print('Processed',len(records),'drawings;',sum(l['mode_blocks']*64 for l in logs),'mode samples')

if __name__=='__main__':run()
