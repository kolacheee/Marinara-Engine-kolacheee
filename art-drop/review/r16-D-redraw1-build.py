"""Critic D1 repair: image-drawn afterglows and wind endpoints only."""
from pathlib import Path
from PIL import Image, ImageDraw
from collections import Counter, deque
import json, hashlib, importlib.util

ROOT=Path(__file__).resolve().parents[1]
REV=ROOT/'review'; OUT=ROOT/'out/weather16'; REF=ROOT/'reference/r16'
spec=importlib.util.spec_from_file_location('r16d',REV/'r16-D-build.py')
old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)
PREFIX='r16-D-redraw1-'
NN=Image.Resampling.NEAREST
PALE=(175,184,203,255)
WISP=(171,192,198,255)
SELECT_BOLTS=['bolt-0c','bolt-1c','bolt-2c']
SELECT_WIND=['wind-0a','wind-1a','wind-2b','wind-3b']

def keyed(path,colour):
    src=Image.open(path).convert('RGB'); im=Image.new('RGBA',src.size)
    # Nearest colour key classifies antialiased source edges at their midpoint;
    # export palette locking removes every trace of the magenta backing.
    fg=(186,192,210) if colour==PALE else (182,201,205)
    pixels=list(src.get_flattened_data())
    mapping={p:((0,0,0,0) if sum((a-b)**2 for a,b in zip(p,(255,0,255))) <= sum((a-b)**2 for a,b in zip(p,fg)) else colour) for p in set(pixels)}
    im.putdata([mapping[p] for p in pixels])
    return im

def lock(im,colour):
    im.putdata([colour if p[3]>=128 else (0,0,0,0) for p in im.get_flattened_data()]);return im

def neighbours(q,w,h):
    y,x=divmod(q,w)
    return [yy*w+xx for yy in range(max(0,y-1),min(h,y+2)) for xx in range(max(0,x-1),min(w,x+2)) if yy*w+xx!=q]

def clean_gaps(mode,reg,colour):
    """Join at most two missing native cells, each backed by painted source samples."""
    w,h=mode.size; data=list(mode.get_flattened_data()); source=list(reg.get_flattened_data())
    support=[sum(bool(source[(y*8+dy)*w*8+x*8+dx][3]) for dy in range(8) for dx in range(8)) for y in range(h) for x in range(w)]
    joins=[];im=mode.copy()
    for _ in range(w*h):
        im.putdata(data); labels={q:i for i,part in enumerate(old.groups(im)) for q in part}
        gaps={q for q,p in enumerate(data) if not p[3] and support[q]>=8}
        near={q:{labels[n] for n in neighbours(q,w,h) if n in labels} for q in gaps}
        candidates=[]
        for q in gaps:
            if len(near[q])>=2:candidates.append(([q],support[q]))
            elif near[q]:
                for r in neighbours(q,w,h):
                    if r in gaps and near[r] and len(near[q]|near[r])>=2:
                        candidates.append(([q,r],support[q]+support[r]))
        if not candidates:break
        path,_=min(candidates,key=lambda t:(len(t[0]),-t[1],t[0]))
        for q in path:
            data[q]=colour;joins.append({'index':q,'source_opaque_samples':support[q]})
    im.putdata(data)
    removed=[]
    for part in old.groups(im):
        if len(part)<5:
            for q in part:data[q]=(0,0,0,0);removed.append(q)
    im.putdata(data)
    return im,{'joins':joins,'removed_specks':removed,'components':[len(g) for g in old.groups(im)]}

def process_bolt(ident):
    colour=PALE; raw=keyed(REV/f'{PREFIX}source-{ident}.png',colour)
    reg=lock(raw.resize((384,1152),Image.Resampling.BOX),colour)
    mode=old.mode_reduce(reg,(48,144));clean,log=clean_gaps(mode,reg,colour)
    for stage,im in [('registered',reg),('mode',mode),('clean',clean)]:old.save(im,REV/f'{PREFIX}{stage}-{ident}.png')
    log.update(id=ident,size=[48,144],registration='full canvas to 384x1152 BOX',mode_blocks=48*144)
    return clean,log

def process_wind(ident):
    raw=keyed(REV/f'{PREFIX}source-{ident}.png',WISP);outputs={};logs=[]
    for f,desired_width in [(0,12),(3,9)]:
        # Register each separately drawn endpoint. No middle-row pixels are exported.
        row=raw.crop((0,round(raw.height*f/4),raw.width,round(raw.height*(f+1)/4)))
        bbox=row.getbbox();crop=row.crop(bbox);height=max(2,round(crop.height*desired_width/crop.width))
        x=8 if f==0 else 131-desired_width//2
        y=round((bbox[1]+bbox[3])/2*48/row.height-height/2)
        reg=Image.new('RGBA',(1152,384));reg.paste(crop.resize((desired_width*8,height*8),Image.Resampling.BOX),(x*8,y*8));lock(reg,WISP)
        mode=old.mode_reduce(reg,(144,48));clean,log=clean_gaps(mode,reg,WISP)
        for stage,im in [('registered',reg),('mode',mode),('clean',clean)]:old.save(im,REV/f'{PREFIX}{stage}-{ident}-f{f}.png')
        outputs[f]=clean;log.update(id=ident+f'-f{f}',source=ident,size=[144,48],source_row=f,source_crop=list(bbox),placement=[x,y,desired_width,height],mode_blocks=144*48);logs.append(log)
    return outputs,logs

def candidate_sheet(parts):
    sheet=Image.new('RGB',(1240,1240),(27,32,38));d=ImageDraw.Draw(sheet)
    for i in range(3):
        for j,v in enumerate('abc'):
            ident=f'bolt-{i}{v}';im=parts[ident];x=(i*3+j)*116
            d.text((x+3,6),ident+(' PICK' if ident in SELECT_BOLTS else ''),fill='white')
            bg=old.compose(Image.new('RGBA',im.size,(38,47,64,255)),im)
            sheet.paste(bg,(x+4,25));sheet.paste(bg.resize((96,288),NN),(x+4,178))
    grass=Image.open(REF/'ref-fantasy-grass.png').convert('RGBA').crop((72,72,216,120))
    for i in range(4):
        for j,v in enumerate('ab'):
            ident=f'wind-{i}{v}';x=j*620;y=485+i*184
            d.text((x+8,y),ident+(' PICK' if ident in SELECT_WIND else ''),fill='white')
            for k,f in enumerate([0,3]):
                bg=old.compose(grass,parts[ident][f]);sheet.paste(bg,(x+8+k*305,y+20));sheet.paste(bg.resize((288,96),NN),(x+8+k*305,y+70))
    old.save(sheet,REV/f'{PREFIX}selection.png')

def build(export=False):
    records=json.loads((REV/f'{PREFIX}generation.json').read_text());parts={};stages=[]
    for rec in records:
        ident=rec['id']
        if ident.startswith('bolt'):
            parts[ident],log=process_bolt(ident);stages.append(log)
        else:
            parts[ident],logs=process_wind(ident);stages.extend(logs)
    candidate_sheet(parts)
    (REV/f'{PREFIX}stages.json').write_text(json.dumps(stages,indent=2)+'\n')
    if export:
        for i,ident in enumerate(SELECT_BOLTS):old.save(parts[ident],OUT/f'lightning-{i}-f2.png')
        for i,ident in enumerate(SELECT_WIND):
            for f in [0,3]:old.save(parts[ident][f],OUT/f'wind-{i}-f{f}.png')
    print(json.dumps({x['id']:{'groups':x['components'],'joins':len(x['joins']),'specks':len(x['removed_specks'])} for x in stages},indent=2))
    return parts,stages

if __name__=='__main__':
    import sys
    build('--export' in sys.argv)
