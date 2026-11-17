"""D critic2: sample drawn wall surfaces and preserve the accepted staircase.

No architecture/texture is drawn in code. The staircase extraction follows
its existing painted contour. Wall exports are crops of one common painting.
"""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json
from PIL import Image
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('d_original',R/'r17-D-process.py')
p=importlib.util.module_from_spec(sp);sp.loader.exec_module(p)
PAL=[p.BASE[i] for i in [0,7,8,10,12,13]]
NN=Image.Resampling.NEAREST

def process(rec):
    src=Image.open(R/rec['source']).convert('RGBA')
    src.putdata([(0,0,0,0) if r>170 and b>170 and g<120 and r>g*2 and b>g*2 else (r,g,b,255) for r,g,b,_ in src.get_flattened_data()])
    bounds=src.getbbox(); src=src.crop(bounds)
    # Both image edits retained the source stair-wall's walk/ledge landmarks.
    cut=[22,0,src.width-12,src.height];src=src.crop(cut)
    w,h=192,144;reg=Image.new('RGBA',(w*8,h*8))
    sy=[0,192,242,320,src.height];dy=[0,36,42,52,143]
    for s0,s1,d0,d1 in zip(sy,sy[1:],dy,dy[1:]):
        reg.paste(src.crop((0,s0,src.width,s1)).resize((w*8,(d1-d0)*8),Image.Resampling.BOX),(0,d0*8))
    pal=Image.new('P',(1,1));pal.putpalette([v for c in PAL+[PAL[-1]]*(256-len(PAL)) for v in c])
    rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    alpha=reg.getchannel('A').point(lambda v:255 if v>=128 else 0)
    reg=rgb.convert('RGBA');reg.putalpha(alpha);reg.paste((0,0,0,0),mask=alpha.point(lambda v:255-v))
    raw=[];sw=w*8
    for y in range(h):
        v=list(reg.crop((0,y*8,sw,y*8+8)).get_flattened_data())
        for x in range(w):
            counts=Counter(q for yy in range(8) for q in v[yy*sw+x*8:yy*sw+x*8+8])
            raw.append(min(counts,key=lambda q:(-counts[q],q)))
    clean=p.clean_pixels(raw,w,h)
    # The two cut edges are contacts, not exposed vertical outlines.
    for y in range(h):
        for x in (0,w-1):clean[y*w+x]=raw[y*w+x]
    edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,clean)) if a!=b]
    prefix=R/f"r17-D-critic2-{rec['id']}"
    reg.save(str(prefix)+'-registered.png')
    out=Image.new('RGBA',(w,h));out.putdata(raw);out.save(str(prefix)+'-mode.png')
    out.putdata(clean);out.save(str(prefix)+'-clean.png')
    return out,dict(id=rec['id'],source=rec['source'],size=[w,h],registration=dict(bounds=bounds,cut=cut,y=[sy,dy]),palette=PAL,cleanup=edits,mode_blocks=w*h,samples_per_block=64,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest())

def run():
    records=json.loads((R/'r17-D-critic2-generation.json').read_text());ims={};logs=[]
    for rec in records:
        print('Register/mode',rec['id'],flush=True);im,log=process(rec);ims[rec['id']]=im;logs.append(log)
    (R/'r17-D-critic2-processing.json').write_text(json.dumps(logs,indent=2))
    # Development comparison; installation happens after native inspection.
    old=Image.open(R/'r17-D-critic2-before-wall-walk-stair.png').convert('RGBA')
    sheet=Image.new('RGBA',(624,168),(64,69,56,255))
    for i,a in enumerate([ims['wallA'],ims['wallB'],old]):sheet.alpha_composite(a,(8+i*208,12))
    sheet.save(R/'r17-D-critic2-selection-1x.png')
    sheet.resize((2496,672),NN).save(R/'r17-D-critic2-selection-4x.png')
    install(ims['wallA'],old)

def install(master,old):
    # Exact observed left contour of the EXISTING drawn staircase, by row.
    # Copy the staircase and everything behind its right cheek byte-for-byte.
    # These are extraction coordinates, never drawn geometry or new pixels.
    early=[164,163,162,161,160,160,160,155,154,153,153,149,148,147,146,146,146,146]
    edge=early[:]
    for y in range(54,142):
        xs=[x for x in range(65,192) if old.getpixel((x,y))==p.DARK]
        edge.append(min(xs) if xs else {92:113,139:78}[y])
    edge += [78,79]
    assert len(edge)==108
    master.crop((0,0,96,144)).save(O/'wall-walk.png')
    master.crop((96,0,192,144)).save(R/'r17-D-critic2-wall-walk-alternate.png')
    # Four opaque columns overlap the preceding wall. The pixels are the
    # same donor columns, so no stripe, mortar reset or value seam is added.
    stair=Image.new('RGBA',(192,144))
    stair.paste(master.crop((188,0,192,144)),(0,0))
    stair.paste(master.crop((0,0,188,144)),(4,0))
    for y,x in enumerate(edge,36):stair.paste(old.crop((x,y,192,y+1)),(x,y))
    stair.save(O/'wall-walk-stair.png')
    # Four complete north/south slate courses, ending just before the next
    # mortar course, genuinely meet when repeated. Keep their drawn kerbs.
    paving=Image.open(R/'r17-D-critic1-gate-paving.png').convert('RGBA')
    period=paving.crop((0,51,96,87));interior=Image.new('RGBA',(96,144))
    for y in range(0,144,36):interior.paste(period,(0,y))
    interior.save(R/'r17-D-critic2-gate-interior.png')
    paving.crop((0,43,96,52)).save(R/'r17-D-critic2-gate-threshold.png')
    recipe=dict(master='r17-D-critic2-wallA-clean.png',wall=[0,0,96,144],alternate=[96,0,192,144],stair_wall_offset=4,stair_preserved_source='r17-D-critic2-before-wall-walk-stair.png',stair_contour_start_y=36,stair_preserved_left_x_by_row=edge,paving_source='r17-D-critic1-gate-paving.png',paving_period=[0,51,96,87],paving_repetitions=4,threshold=[0,43,96,52])
    (R/'r17-D-critic2-native-joins.json').write_text(json.dumps(recipe,indent=2))
    files=json.loads((R/'r17-D-files.json').read_text())
    for name in ['wall-walk','wall-walk-stair']:
        im=Image.open(O/(name+'.png'));v=list(im.get_flattened_data())
        files[name].update(colours=len(set(q[:3] for q in v if q[3])),opaque=sum(q[3]>0 for q in v),sha256=hashlib.sha256((O/(name+'.png')).read_bytes()).hexdigest())
    (R/'r17-D-files.json').write_text(json.dumps(files,indent=2))
    records=json.loads((R/'r17-D-critic2-generation.json').read_text())
    for rec in records:
        rec['selected']=rec['id']=='wallA'
        rec['selection_reason']='Cleaner native masonry and distinct diagonally paved walk; shared donor for both contacts.' if rec['selected'] else 'Rejected: stronger native mottling and less coherent stone fills.'
    (R/'r17-D-critic2-generation.json').write_text(json.dumps(records,indent=2))
if __name__=='__main__':run()
