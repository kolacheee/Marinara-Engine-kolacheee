"""C6 critic1: register only image-tool paint; mode vote and native assembly."""
from pathlib import Path
from PIL import Image, ImageChops
from collections import Counter
import importlib.util,json,hashlib
R=Path(__file__).resolve().parent;O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('p',R/'r17-C6-process.py');p=importlib.util.module_from_spec(sp);sp.loader.exec_module(p)
NN=Image.Resampling.NEAREST
logs=[];ops=[]
def put(name,im,donors,operation):
    im.putdata([q if q[3] else (0,0,0,0) for q in im.get_flattened_data()]);im.save(O/(name+'.png'))
    ops.append(dict(output=name,donors=donors,operation=operation))
def register(rec):
    n=rec['id'];w,h=rec['size'];src=p.key(Image.open(R/rec['source']));box=src.getbbox();reg=Image.new('RGBA',(w*8,h*8))
    # Measured painted eave/floor courses, not independently stretched cells.
    absolute={'house-a':[box[1],802,1104,box[3]],'house-b':[box[1],754,1118,box[3]],'house-c':[box[1],916,1150,box[3]],'guildhall-a':[box[1],923,1250,1535,box[3]],'guildhall-b':[box[1],866,1115,1418,box[3]]}
    cuts=absolute.get(n,[box[1],box[3]])
    dest=([24,96,144,192] if n.startswith('house-') else [0,128,192,288,384] if n.startswith('guildhall-') else [16,h] if n.startswith('narrow-roof') else [0,h])
    for y0,y1,d0,d1 in zip(cuts,cuts[1:],dest,dest[1:]):reg.paste(src.crop((box[0],y0,box[2],y1)).resize((w*8,(d1-d0)*8),Image.Resampling.BOX),(0,d0*8))
    pal=list(dict.fromkeys(p.RED+p.STONE+p.FLOOR+p.prior.CLOTH+[(139,107,58),(178,143,78),(79,89,95),(118,131,134)]))
    if n.startswith('abutment'):pal=p.RED+p.STONE
    if n.startswith(('landing','church-porch')):pal=p.STONE+[(139,107,58),(197,188,165)]
    if n.startswith('packed-yard'):pal=[(105,94,76),(118,104,83),(129,114,91)]
    palette=Image.new('P',(1,1));palette.putpalette([v for col in pal+[pal[-1]]*(256-len(pal)) for v in col])
    rgb=reg.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*q,255) if a>=128 else (0,0,0,0) for q,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())];reg.putdata(vals)
    raw=[];sw=w*8
    for y in range(h):
        for x in range(w):
            cnt=Counter(q for yy in range(8) for q in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);raw.append(min(cnt,key=lambda q:(-cnt[q],q)))
    mode=Image.new('RGBA',(w,h));mode.putdata(raw);out=mode.copy();out.putdata(p.prior.clean_pixels(raw,w,h))
    if n.startswith('packed-yard'):
        # Ground fields have no silhouette frame. Restore source perimeter
        # paint after the general isolated-pixel cleaner's outline operation.
        for y in (0,h-1):out.paste(mode.crop((0,y,w,y+1)),(0,y))
        for x in (0,w-1):out.paste(mode.crop((x,0,x+1,h)),(x,0))
    for suffix,im in [('registered',reg),('mode',mode),('clean',out)]:im.save(R/f'r17-C6-critic1-{suffix}-{n}.png')
    logs.append(dict(id=n,source=rec['source'],source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),size=[w,h],bounds=box,source_y=cuts,target_y=dest,palette=pal,mode_blocks=w*h,samples_per_pixel=64,cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,out.get_flattened_data())) if a!=b]))
    return out
def colours(n,im,roof_only=False):
    for tone,ramp in {'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]}.items():
        a=im.copy();out=[]
        for i,q in enumerate(im.get_flattened_data()):
            r,g,b,al=q
            if al and (not roof_only or i//im.width<96) and r>g*1.26 and r>b*1.65:
                k=min(range(6),key=lambda k:sum((q[j]-p.RED[k][j])**2 for j in range(3)));out.append((*ramp[k],al))
            else:out.append(q)
        a.putdata(out);put(n+'-'+tone,a,[n],'roof-material-only palette mapping, alpha invariant')
def run():
    drawings={rec['id']:register(rec) for rec in json.loads((R/'r17-C6-critic1-generation.json').read_text())}
    for n,source in [('abutment-b-c6','abutment-b'),('gate-landing-c6','landing-b'),('wall-tower-a-c6','tower-open-a'),('wall-tower-b-c6','tower-bell-a'),('church-porch-c6r1','church-porch-b'),('guildhall-c6r1','guildhall-b')]:put(n,drawings[source].copy(),[source],'complete registered source, no shaft splice')
    stair=drawings['gate-stair-a'];put('gate-landing-c6',stair.crop((0,0,48,48)),['gate-stair-a'],'upper landing and masonry bearing from one continuous stair drawing')
    put('gate-stair-lower-c6r1',stair.crop((0,48,48,96)),['gate-stair-a'],'consecutive lower48px of same drawing; joins landing without resampling')
    for letter in 'ab':
        name='roof-narrow-'+letter+'-c6r1';im=drawings['narrow-roof-'+letter];put(name,im.copy(),['narrow-roof-'+letter],'complete native roof registration');colours(name,im)
    earth=drawings['packed-yard-b'].copy()
    earth.paste(earth.crop((0,0,2,48)),(46,0));earth.paste(earth.crop((0,0,48,2)),(0,46));put('packed-yard-c6r1',earth,['packed-yard-b'],'native two-column/two-row wrap registration; no synthetic texture or border')
    a=drawings['abutment-b'];b=Image.new('RGBA',(48,96));b.paste(a.crop((0,0,48,48)));b.paste(a.crop((0,96,48,144)),(0,48));put('abutment-b-d2-c6',b,['abutment-b-c6'],'native48px middle-course removal')
    colours('abutment-b-c6',a);colours('abutment-b-d2-c6',b)
    course=Image.open(O/'ground-shop-w2-c0.png').convert('RGBA')
    for letter in 'abc':
        a=drawings['house-'+letter];put('house-'+letter+'-c6r1',a.copy(),['house-'+letter],'complete segmented registration');colours('house-'+letter+'-c6r1',a,True)
        for kind,y in [('roof',0),('storey',96),('ground',144)]:
            b=a.crop((0,y,96,y+(96 if kind=='roof' else 48)))
            # Shared fixed course belongs to export; a native drawn seam cover
            # removes doubled belt paint at assembly, without changing contract.
            if kind!='roof':
                for yy in (0,47):b.paste(course.crop((0,yy,96,yy+1)),(0,yy))
            name=kind+'-house-'+letter+'-c6r1';put(name,b,['house-'+letter+'-c6r1'],'whole native painted roof/floor crop; fixed rows0/47')
            if kind=='roof':colours(name,b)
        # The two sidewall directions have separately lit donors, not a mirror.
        side=a.crop((80,96,96,192));put('return-house-'+letter+'-c6r1',side,['house-'+letter+'-c6r1'],'continuous actual receding16px side plane')
    # Third distinct enclosure is a native stone wall section; A/B wood fences
    # and this stone boundary remain structurally different when palette ignored.
    stone=drawings['tower-open-a'].crop((24,84,32,132));put('yard-boundary-stone-c6r1',stone,['wall-tower-a-c6'],'native8x48 unbroken masonry crop')
    wood=Image.new('RGBA',(8,48));donor=Image.open(O/'fence-0.png').convert('RGBA').crop((0,0,8,24));wood.alpha_composite(donor);wood.alpha_composite(donor,(0,24));put('yard-boundary-wood-c6r1',wood,['fence-0'],'two native24px painted upright sections')
    for side,xx in [('right',78),('left',50)]:
        donor=drawings['tower-open-a'].crop((xx,48,xx+16,240));a=Image.new('RGBA',(16,240));a.paste(donor);a.paste(donor.crop((0,96,16,144)),(0,192));put('receiving-wall-'+side+'-c6r1',a,['tower-open-a'],'one coping and continuous native masonry side;48px body course wrap at foot')
    (R/'r17-C6-critic1-processing.json').write_text(json.dumps(logs,indent=2));(R/'r17-C6-critic1-native-operations.json').write_text(json.dumps(ops,indent=2))
    print(len(drawings),'drawings;',sum(x['mode_blocks']*64 for x in logs),'mode samples;',len(ops),'exports')
if __name__=='__main__':run()
