"""Critic repair: register drawn caps/road connectors, never construct paint."""
from pathlib import Path
from collections import Counter
import importlib.util, json, hashlib
from PIL import Image
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('d',R/'r17-D-process.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
PREFIX='r17-C3-critic1-'
ROAD=[(143,147,132),(153,157,141),(164,168,151),(176,179,163),(188,191,176)]

def process(rec):
    src=Image.open(R/rec['source']).convert('RGBA'); w,h=rec['size']; name=rec['id']
    src.putdata([(0,0,0,0) if r>170 and b>170 and g<125 and r>g*1.8 and b>g*1.8 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
    bounds=src.getbbox();crop=src.crop(bounds);geom={'bounds':bounds}
    if name=='hip-a':
        rows=[]
        for y in range(crop.height):
            row=crop.crop((0,y,crop.width,y+1));bb=row.getbbox()
            if bb and bb[2]-bb[0]>=crop.width*.90:rows.append(row.crop(bb).resize((w*8,1),Image.Resampling.BOX))
        band=Image.new('RGBA',(w*8,len(rows)))
        for y,row in enumerate(rows):band.paste(row,(0,y))
        reg=band.resize((w*8,h*8),Image.Resampling.BOX);geom['row_registration']=True
    elif name=='mouth':
        # Register the observed 470px road opening to the native 96px socket.
        cuts=[0,392-bounds[0],862-bounds[0],crop.width];dest=[0,72,168,240]
        reg=Image.new('RGBA',(w*8,h*8))
        for a,b,x,z in zip(cuts,cuts[1:],dest,dest[1:]):reg.paste(crop.crop((a,0,b,crop.height)).resize(((z-x)*8,h*8),Image.Resampling.BOX),(x*8,0))
        geom['x_registration']=[cuts,dest]
    else:reg=crop.resize((w*8,h*8),Image.Resampling.BOX)
    palette=sorted(set([d.BASE[0]]+d.RED+[(71,79,34),(105,120,48),(130,116,95)])) if name.startswith('hip-') else ROAD
    p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
    rgb=reg.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGB')
    alpha=reg.getchannel('A').point(lambda v:255 if v>=128 else 0);reg=rgb.convert('RGBA');reg.putalpha(alpha);reg.paste((0,0,0,0),mask=alpha.point(lambda v:255-v))
    vals=list(reg.get_flattened_data());raw=[];sw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(c for yy in range(8) for c in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);raw.append(min(votes,key=lambda c:(-votes[c],c)))
    if name.startswith('hip-'):clean=d.clean_pixels(raw,w,h)
    else:
        # The same fleck/alpha-island cleanup, without outlining ground paint.
        cleaned=d.clean_pixels(raw,w,h);clean=[(0,0,0,0) if not q[3] else original for q,original in zip(cleaned,raw)]
        for _ in range(2):
            prev=clean[:]
            for y in range(1,h-1):
                for x in range(1,w-1):
                    q=prev[y*w+x];near=[prev[yy*w+xx] for yy in range(y-1,y+2) for xx in range(x-1,x+2) if (xx,yy)!=(x,y)]
                    if q[3] and all(v[3] for v in near) and q not in near:clean[y*w+x]=Counter(near).most_common(1)[0][0]
    mode=Image.new('RGBA',(w,h));mode.putdata(raw);im=Image.new('RGBA',(w,h));im.putdata(clean)
    if name=='hip-a':
        donor=Image.open(O/'roof-hip-w2-c0.png')
        # Native two-row north contact and one-row eave remove detached
        # registration fringe while preserving the newly drawn hip planes.
        im.paste(donor.crop((0,0,96,2)),(0,0));im.paste(donor.crop((0,143,96,144)),(0,143))
    for tag,a in [('registered',reg),('mode',mode),('clean',im)]:a.save(R/f'{PREFIX}{tag}-{name}.png')
    return im,dict(id=name,size=[w,h],registration=geom,palette=palette,mode_blocks=w*h,samples_per_pixel=64,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,im.get_flattened_data())) if a!=b])

def run():
    recs=json.loads((R/f'{PREFIX}generation.json').read_text());drawings={};logs=[];exports={};native=[]
    for rec in recs:
        im,log=process(rec);drawings[rec['id']]=im;logs.append(log)
        rec['selected']=rec['id'] in ('hip-a','road-b','mouth')
    cap=drawings['hip-a'];exports['roof-hip-deep-c3-w2']=cap
    # The middle course is a separately exported directional fill, not a cap.
    exports['roof-fill-hip-c3-w2']=cap.crop((0,48,96,96))
    native.append(dict(output='roof-fill-hip-c3-w2',donor='roof-hip-deep-c3-w2',crop=[0,48,96,96],axis='north-south',split=96))
    for name,overlay,x,y in [('roof-hip-chimney-c3-w2','chimney-1-c0',10,38),('roof-hip-dormer-c3-w2','dormer-0-c0',12,66)]:
        a=cap.copy();accent=Image.open(O/(overlay+'.png')).convert('RGBA');a.alpha_composite(accent,(x,y));exports[name]=a
        native.append(dict(output=name,donor='roof-hip-deep-c3-w2',overlay=dict(file=overlay,x=x,y=y),receiving_plane=[3,32,44,104]))
    exports['gate-elbow-c3']=drawings['road-b'];exports['gate-square-mouth-c3']=drawings['mouth']
    road=drawings['road-b']
    exports['gate-straight-c3']=road.crop((0,0,96,96))
    exports['gate-straight-south-c3']=road.crop((96,192,192,288))
    exports['gate-cross-straight-c3']=road.crop((96,96,192,192))
    native.extend([dict(output='gate-straight-c3',donor='gate-elbow-c3',crop=[0,0,96,96]),dict(output='gate-straight-south-c3',donor='gate-elbow-c3',crop=[96,192,192,288]),dict(output='gate-cross-straight-c3',donor='gate-elbow-c3',crop=[96,96,192,192])])
    # Use one native painted stone period throughout both drawn silhouettes.
    # The first mouth drawing's stone scale was too fine beside the dogleg.
    # This is a paint-to-paint composite: no stone, edge, or mask is generated.
    material=road.crop((48,120,144,168))
    assert material.getchannel('A').getextrema()==(255,255)
    for name in ('gate-elbow-c3','gate-square-mouth-c3','gate-straight-c3','gate-straight-south-c3','gate-cross-straight-c3'):
        silhouette=exports[name];w,h=silhouette.size;phase=(24,24) if name=='gate-square-mouth-c3' else (0,0)
        painted=Image.new('RGBA',(w+96,h+48))
        for y in range(0,painted.height,48):
            for x in range(0,painted.width,96):painted.paste(material,(x,y))
        painted=painted.crop((phase[0],phase[1],phase[0]+w,phase[1]+h));painted.putalpha(silhouette.getchannel('A'));exports[name]=painted
        native.append(dict(output=name,operation='native painted material through drawn silhouette',material_source='clean-road-b',material_crop=[48,120,144,168],period=[96,48],phase=list(phase),silhouette='clean-mouth' if name=='gate-square-mouth-c3' else name,world_phase_origin=[1104,960]))
    files=json.loads((R/'r17-C3-files.json').read_text())
    for name,a in exports.items():
        a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);a.save(O/(name+'.png'))
        v=list(a.get_flattened_data());files[name]=dict(size=list(a.size),sha256=hashlib.sha256((O/(name+'.png')).read_bytes()).hexdigest(),colours=len(set(p[:3] for p in v if p[3])),alpha=sorted(set(p[3] for p in v)),hidden_rgb=0)
    (R/'r17-C3-files.json').write_text(json.dumps(files,indent=2));(R/f'{PREFIX}generation.json').write_text(json.dumps(recs,indent=2));(R/f'{PREFIX}processing.json').write_text(json.dumps(dict(drawings=logs,native=native),indent=2))
    print('New drawings:',len(logs),'Changed/new exports:',list(exports))
if __name__=='__main__':run()
