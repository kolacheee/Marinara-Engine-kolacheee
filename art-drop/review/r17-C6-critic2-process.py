"""Image-tool paint registration, exact native mode sampling and native assembly."""
from pathlib import Path
from PIL import Image
from collections import Counter
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
s=importlib.util.spec_from_file_location('p',R/'r17-C6-process.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
logs=[];ops=[]
def put(name,im,donors,operation):
    im.putdata([q if q[3] else (0,0,0,0) for q in im.get_flattened_data()]);im.save(O/(name+'.png'))
    ops.append(dict(output=name,donors=donors,operation=operation))
def register(rec):
    n=rec['id'];w,h=rec['size'];src=p.key(Image.open(R/rec['source']));box=src.getbbox();src=src.crop(box)
    # Straight join strips register the painted row bounds; roof silhouette stays intact.
    rows=n.startswith(('wall','fence'))
    if rows:
        reg=Image.new('RGBA',(w*8,src.height))
        for y in range(src.height):
            row=src.crop((0,y,src.width,y+1));bb=row.getbbox()
            if bb:reg.paste(row.crop(bb).resize((w*8,1),Image.Resampling.BOX),(0,y))
        reg=reg.resize((w*8,h*8),Image.Resampling.BOX)
    else:reg=src.resize((w*8,h*8),Image.Resampling.BOX)
    pal=p.RED+p.STONE if n.startswith('roof') else p.STONE if n.startswith(('wall','gate')) else [(43,33,22),(67,46,27),(93,61,32),(123,82,41),(151,107,58),(174,131,78)]
    palette=Image.new('P',(1,1));palette.putpalette([v for col in pal+[pal[-1]]*(256-len(pal)) for v in col])
    rgb=reg.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*q,255) if a>=128 else (0,0,0,0) for q,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())];reg.putdata(vals)
    raw=[];sw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(q for yy in range(8) for q in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);raw.append(min(votes,key=lambda q:(-votes[q],q)))
    mode=Image.new('RGBA',(w,h));mode.putdata(raw);out=mode.copy();out.putdata(p.prior.clean_pixels(raw,w,h))
    # Source strips are full rectangles. Keep their drawn full-coverage ends,
    # which the generic silhouette cleaner otherwise trims as terminal edges.
    if rows:
        for y in (0,h-1):out.paste(mode.crop((0,y,w,y+1)),(0,y))
        for x in (0,w-1):out.paste(mode.crop((x,0,x+1,h)),(x,0))
    if n.startswith('wall'):
        # Exactly one exposed native outline column, using the source ramp.
        for x in (0,w-1):
            for y in range(1,h):out.putpixel((x,y),(*p.STONE[0],255))
    for suffix,im in [('registered',reg),('mode',mode),('clean',out)]:im.save(R/f'r17-C6-critic2-{suffix}-{n}.png')
    logs.append(dict(id=n,source=rec['source'],source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),size=[w,h],bounds=box,row_registration=rows,palette=pal,mode_blocks=w*h,samples_per_pixel=64,cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,out.get_flattened_data())) if a!=b]))
    return out
def colours(n,im):
    for tone,ramp in {'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]}.items():
        out=[]
        for q in im.get_flattened_data():
            r,g,b,a=q
            if a and r>g*1.26 and r>b*1.65:
                k=min(range(6),key=lambda k:sum((q[j]-p.RED[k][j])**2 for j in range(3)));out.append((*ramp[k],a))
            else:out.append(q)
        a=im.copy();a.putdata(out);put(n+'-'+tone,a,[n],'roof material mapping only; alpha unchanged')
def run():
    drawings={r['id']:register(r) for r in json.loads((R/'r17-C6-critic2-generation.json').read_text())}
    a=drawings['roof_b'];put('abutment-b-c6',a,['roof_b'],'complete registered connected tile courses')
    b=Image.new('RGBA',(48,96));b.paste(a.crop((0,0,48,48)));b.paste(a.crop((0,96,48,144)),(0,48));put('abutment-b-d2-c6',b,['abutment-b-c6'],'native middle48px course removal')
    colours('abutment-b-c6',a);colours('abutment-b-d2-c6',b)
    for hand in ('left','right'):
        donor=drawings['wall_'+hand];a=Image.new('RGBA',(16,240));a.paste(donor)
        for y in (96,144,192):a.paste(donor.crop((0,24,16,72)),(0,y))
        put('receiving-wall-'+hand+'-c6r1',a,['wall_'+hand],'one coping; opaque native48px middle masonry repeated three times below the96px source')
    put('yard-boundary-wood-c6r1',drawings['fence_a'],['fence_a'],'complete continuous drawn side fence, row registered')
    put('yard-boundary-wood-b-c6r2',drawings['fence_b'],['fence_b'],'alternative continuous drawn close-board fence, row registered')
    stone=Image.open(O/'receiving-wall-right-c6r1.png').convert('RGBA').crop((8,24,16,72))
    for y in range(48):stone.putpixel((0,y),(*p.STONE[0],255))
    put('yard-boundary-stone-c6r2',stone,['receiving-wall-right-c6r1'],'native8x48 shaded masonry body crop; one-pixel exposed-edge outline cleanup')
    put('gate-bearing-c6r2',drawings['gate_b'],['gate_b'],'whole drawn bearing chamber; no tower material removed')
    (R/'r17-C6-critic2-processing.json').write_text(json.dumps(logs,indent=2));(R/'r17-C6-critic2-native-operations.json').write_text(json.dumps(ops,indent=2))
    print(len(drawings),'drawings;',sum(x['mode_blocks']*64 for x in logs),'mode samples;',len(ops),'exports')
if __name__=='__main__':run()
