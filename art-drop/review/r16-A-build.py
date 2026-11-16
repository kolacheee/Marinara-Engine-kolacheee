"""Round 16 A: process drawn masters; place/move particles, never draw shapes."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, PngImagePlugin
from collections import Counter
from math import gcd, lcm
import random, json, hashlib

ROOT = Path(__file__).resolve().parents[1]
REVIEW, OUT, REF = ROOT/'review', ROOT/'out', ROOT/'reference/r16'
DEST = OUT/'weather16'
DEST.mkdir(exist_ok=True)
NN = Image.Resampling.NEAREST
S = 192

def save(im, path, **meta):
    info = PngImagePlugin.PngInfo()
    for k,v in meta.items(): info.add_text(k,str(v))
    im.save(path, pnginfo=info)

def references():
    crops = {
      'fantasy-grass': ('fantasy',(864,96,1152,384)),
      'fantasy-forest': ('fantasy',(816,432,1104,720)),
      'fantasy-town': ('fantasy',(432,240,720,528)),
      'modern-city': ('modern',(480,96,768,384)),
      'wasteland': ('wasteland',(480,240,768,528)),
    }
    records = {}
    for name,(family,box) in crops.items():
        p=REF/'renders'/f'ow-{family}-0.png'
        im=Image.open(p).convert('RGB').crop(box).resize((288,288),NN)
        save(im,REF/f'ref-{name}.png',source=p.name,crop=box,drawn_cell_px=48,resample='NEAREST, scale 1:1')
        records[name]={'render':p.name,'crop':box,'drawn_cell_px':48,'scale':1}
    # The renders contain no desert or snowy stretch. Use existing native art.
    comps={
      'desert-sand':('beach-base.png', [('dunes-prop-0.png',48,48),('dunes-prop-3.png',192,48),('dunes-prop-4.png',96,144),('dunes-prop-2.png',240,192)]),
      'snow':('grass@winter-base.png',[('treeline_forest@winter-0.png',48,0),('treeline_forest@winter-2.png',96,48),('conifer_forest@winter-0.png',192,96),('grass@winter-detail-1.png',48,144),('grass@winter-detail-3.png',192,192),('grass@winter-detail-6.png',96,240)])
    }
    for name,(base,props) in comps.items():
        im=Image.open(OUT/base).convert('RGBA')
        for p,x,y in props: im.alpha_composite(Image.open(OUT/p).convert('RGBA'),(x,y))
        save(im.convert('RGB'),REF/f'ref-{name}.png',base=base,props=json.dumps(props),native_cell_px=48)
        records[name]={'base':base,'props':props,'drawn_cell_px':48,'scale':1}
    return records

PALETTES={
 'rain':[(106,143,164),(163,197,216),(222,239,247)],
 'heavy_rain':[(91,127,149),(141,180,203),(197,222,236)],
 'snow':[(125,153,177),(203,223,239),(250,253,255)],
 'hail':[(102,119,132),(181,196,204),(249,252,253)],
 'blizzard':[(137,160,184),(199,219,236),(236,246,252),(255,255,255)],
 'sandstorm':[(164,132,77),(196,151,78),(224,185,115),(248,222,168)],
}
SPECS={
 'rain':('rain',[(3,8),(3,9),(3,8),(2,7),(2,1),(2,2)]),
 'heavy_rain':('heavy_rain-b',[(4,15),(4,14),(4,14),(4,13),(3,2),(3,2)]),
 'snow':('snow',[(2,2),(3,3),(2,2),(2,3),(3,3),(3,3)]),
 'hail':('hail',[(2,3),(2,3),(2,3),(2,2),(3,2),(3,2)]),
 'blizzard':('blizzard-b',[(3,2),(3,2),(3,2),(12,3),(16,4),(20,4)]),
 'sandstorm':('sandstorm-b',[(80,9),(88,10),(96,9)]),
}

def components(im, minimum):
    pix=list(im.getdata());w,h=im.size;remaining={i for i,p in enumerate(pix) if p[3]}
    removed=[]
    while remaining:
        seed=remaining.pop(); group={seed}; todo=[seed]
        while todo:
            i=todo.pop();x,y=i%w,i//w
            for dy in [-1,0,1]:
                for dx in [-1,0,1]:
                    xx,yy=x+dx,y+dy
                    if 0<=xx<w and 0<=yy<h:
                        j=yy*w+xx
                        if j in remaining:remaining.remove(j);group.add(j);todo.append(j)
        if len(group)<minimum:
            for i in group:pix[i]=(0,0,0,0);removed.append(i)
    result=Image.new('RGBA',im.size);result.putdata(pix)
    return result,removed

def reduce_piece(name, source, cell_index, grid, native, index):
    raw=Image.open(REVIEW/f'r16-A-source-{source}.png').convert('RGB')
    data=[(0,0,0,0) if r>g+55 and b>g+55 and r>135 and b>135 else (r,g,b,255) for r,g,b in raw.getdata()]
    keyed=Image.new('RGBA',raw.size);keyed.putdata(data)
    cols,rows=grid;x,y=cell_index%cols,cell_index//cols;w,h=native
    cell=(round(x*raw.width/cols),round(y*raw.height/rows),round((x+1)*raw.width/cols),round((y+1)*raw.height/rows))
    part=keyed.crop(cell);bbox=part.getbbox();paint=part.crop(bbox)
    registered=paint.resize((w*8,h*8),Image.Resampling.BOX)
    palette=PALETTES[name];cache={};locked=[]
    for p in registered.getdata():
        if p[3]<128:locked.append((0,0,0,0));continue
        rgb=p[:3]
        if rgb not in cache:cache[rgb]=min(palette,key=lambda q:sum((a-b)**2 for a,b in zip(rgb,q)))
        locked.append((*cache[rgb],255))
    reg=Image.new('RGBA',registered.size);reg.putdata(locked)
    native_pixels=[]
    for yy in range(h):
        for xx in range(w):
            votes=Counter(locked[(yy*8+sy)*w*8+xx*8+sx] for sy in range(8) for sx in range(8))
            native_pixels.append(min(votes,key=lambda p:(-votes[p],p)))
    mode=Image.new('RGBA',(w,h));mode.putdata(native_pixels)
    clean,removed=components(mode,3 if name=='sandstorm' else 2)
    for stage,im in [('registered',reg),('mode',mode),('particle',clean)]:save(im,REVIEW/f'r16-A-{stage}-{name}-{index}.png')
    return clean,{'source':source,'cell':cell,'crop_in_cell':bbox,'native':[w,h],'mode_blocks':w*h,'samples_per_block':64,'cleanup_removed_indices':removed}

def reduce_master(name):
    source,sizes=SPECS[name];spec=[(source,i,(3,2),size) for i,size in enumerate(sizes)]
    if name=='rain':
        spec=spec[:4]+[('redraw-splash',i,(2,1),sz) for i,sz in enumerate([(2,1),(2,2)])]
    if name=='blizzard':
        spec=spec[:3]+[('redraw-wind2',i,(2,3),(w,2)) for i,w in enumerate([12,16,20,24,18,14])]
    if name=='sandstorm':
        spec=[('redraw-sand2',i,(2,3),sz) for i,sz in enumerate([(30,8),(36,9),(32,9),(38,10),(28,8),(34,10)])]
    results=[];records=[]
    for i,(src,c,grid,sz) in enumerate(spec):
        im,r=reduce_piece(name,src,c,grid,sz,i);results.append(im);records.append(r)
    return results,records

ALPHAS={
 'rain':[96,128,160], 'heavy_rain':[128,160,192],
 'snow':[224,224,255], 'hail':[224,240,255],
 'blizzard':[144,176,208,224], 'sandstorm':[112,128,144,176],
}
# Closed paths consist of independently varied native integer steps. Each
# path length is divisible by four; f -> f+4 permutes the same phase cohort.
PATHS={
 'rain':[(96,192,768,(1,3),(5,11)),(128,192,960,(0,3),(4,11))],
 'heavy_rain':[(96,192,1344,(1,4),(9,19)),(128,192,1728,(0,3),(9,18))],
 'snow':[(64,0,192,(-2,2),(1,5)),(80,0,192,(-2,2),(1,4))],
 'hail':[(8,0,192,(0,0),(15,33)),(12,0,192,(0,0),(10,24))],
 'blizzard':[(16,192,0,(7,17),(-2,2)),(20,192,0,(5,15),(-3,3))],
 'sandstorm':[(16,192,0,(8,16),(-4,4)),(20,192,0,(6,14),(-3,3))],
}
TARGETS={'rain':8.5,'heavy_rain':18.5,'snow':9,'hail':7,'blizzard':34,'sandstorm':32}

def particle_pixels(name,im,index):
    pal=PALETTES[name]; aa=ALPHAS[name]
    result=[]
    for y in range(im.height):
        for x in range(im.width):
            p=im.getpixel((x,y))
            if not p[3]:continue
            alpha=aa[pal.index(p[:3])]
            if name=='blizzard' and index>=3:alpha=[80,96,112,128][pal.index(p[:3])]
            result.append((x,y,(*p[:3],alpha)))
    return result

def stamp(data, pixels, x,y):
    for px,py,p in pixels:
        i=((y+py)%S)*S+(x+px)%S
        old=data[i]
        # An order-independent hard composite retains the fixed RGBA palette.
        if (p[3],p[:3])>(old[3],old[:3]):data[i]=p

def instances(groups,frame):
    for g in groups:
        if g['kind']=='track':
            points=g['points'];n=len(points)
            for k in range(g['phase'],n,4):
                x,y=points[(k+frame)%n]
                yield g['particle'],x,y
        else:
            q=(frame+g['phase'])%4
            entry=g['states'][q]
            if entry is not None:
                idx,dx,dy=entry;x,y=g['origin'];yield idx,x+dx,y+dy

def render(name,parts,groups,frame):
    data=[(0,0,0,0)]*(S*S)
    pixels=[particle_pixels(name,p,i) for i,p in enumerate(parts)]
    for idx,x,y in instances(groups,frame):stamp(data,pixels[idx],x,y)
    im=Image.new('RGBA',(S,S));im.putdata(data);return im

def bounded_steps(rng,n,total,bounds):
    lo,hi=bounds;v=[rng.randint(lo,hi) for _ in range(n)]
    while sum(v)!=total:
        d=1 if sum(v)<total else -1
        eligible=[i for i in range(n) if lo<=v[i]+d<=hi]
        assert eligible
        v[rng.choice(eligible)]+=d
    return v

def track(rng,name,idx):
    n,tx,ty,bx,by=rng.choice(PATHS[name]);dx=bounded_steps(rng,n,tx,bx);dy=bounded_steps(rng,n,ty,by)
    if name=='snow':
        # Slow coherent east/west gusts wander across a wider area than a
        # Brownian path; randomized run lengths avoid dotted vertical curtains.
        half=n//2
        dx=([2]*(half//2)+[1]*(half-half//2)+[-2]*(half//2)+[-1]*(half-half//2))
        # Pair opposite signed runs but vary run length and starting phase.
        runs=[]
        for sign in [1,-1,1,-1]:
            count=n//4
            runs.extend([sign*rng.choice([1,2]) for _ in range(count)])
        dx=runs
        while sum(dx):
            i=rng.randrange(n);v=dx[i]-(1 if sum(dx)>0 else -1)
            if -2<=v<=2:dx[i]=v
        phase=rng.randrange(n);dx=dx[phase:]+dx[:phase]
    x,y=rng.randrange(S),rng.randrange(S);points=[]
    for a,b in zip(dx,dy):
        points.append([x%S,y%S]);x+=a;y+=b
    assert [x%S,y%S]==points[0]
    return {'kind':'track','particle':idx,'phase':rng.randrange(4),'points':points,'steps':list(map(list,zip(dx,dy)))}

def animate(name,parts):
    rng=random.Random(16190+list(SPECS).index(name));groups=[];row_load=[0]*192
    # Local surface impacts are separate short life cycles. They do not move
    # down the screen as if they were falling pellets. Phase staggered anchors.
    if name in ('rain','heavy_rain','hail'):
        for j in range(20 if name=='rain' else 14):
            idx=rng.randrange(4);h=parts[idx].height
            if name=='hail':states=[[idx,0,-h-17],[idx,0,-h-2],[4,0,0],[5,1,-2]]
            else:states=[[idx,-2,-h-8],[idx,-1,-h],[4,0,0],None]
            groups.append({'kind':'impact','origin':[rng.randrange(S),rng.randrange(S)],'phase':j%4,'states':states})
    for j in range(1200):
        if name in ('rain','heavy_rain','hail'):idx=rng.randrange(4)
        elif name=='blizzard':idx=rng.randrange(3) if rng.random()<.84 else rng.randrange(3,len(parts))
        else:idx=rng.randrange(len(parts))
        g=track(rng,name,idx)
        if name in ('sandstorm','blizzard'):
            # Choose translation of the drawn pieces by their four-phase row
            # load. This prevents whole empty lanes and full-width cords.
            pixels=particle_pixels(name,parts[idx],idx);hist=[0]*192
            for x,y in g['points']:
                for px,py,p in pixels:hist[(y+py)%192]+=1
            offsets=[rng.randrange(192) for _ in range(12)]
            shift=min(offsets,key=lambda off:sum((row_load[y]+hist[(y-off)%192])**2 for y in range(192)))
            for pt in g['points']:pt[1]=(pt[1]+shift)%192
            row_load=[row_load[y]+hist[(y-shift)%192] for y in range(192)]
        groups.append(g)
        if j%2==0:
            cover=sum(p[3]>0 for p in render(name,parts,groups,0).getdata())*100/(S*S)
            if cover>=TARGETS[name]:break
    frames=[render(name,parts,groups,f) for f in range(5)]
    assert frames[4].tobytes()==frames[0].tobytes(),name+' temporal seam'
    stats=[]
    for f,im in enumerate(frames[:4]):
        p=list(im.getdata());alphas=sorted({v[3] for v in p});colors=sorted({v for v in p if v[3]})
        assert all(v[:3]==(0,0,0) for v in p if not v[3])
        stat={'file':f'{name}-f{f}.png','size':[S,S],'covered_pixels':sum(v[3]>0 for v in p),'cover_percent':round(sum(v[3]>0 for v in p)*100/(S*S),4),'alpha_weighted_percent':round(sum(v[3] for v in p)*100/(255*S*S),4),'alpha_levels':alphas,'rgba_palette':colors}
        stats.append(stat)
        save(im,DEST/stat['file'],motion='irregular closed integer paths; see r16-A-measurements.json',frame=f,cover_percent=stat['cover_percent'],alpha_weighted_percent=stat['alpha_weighted_percent'])
    return frames[:4],{'groups':groups,'motion_per_frame':{'closed_path_recipes':PATHS[name],'exact_offsets':'groups[*].steps; coordinates right/down positive','phase_cohort':'one particle at every fourth irregular path station'},'frame4_equals_frame0':True,'files':stats}

def tiled(im,size):
    out=Image.new(im.mode,size)
    for y in range(0,size[1],im.height):
        for x in range(0,size[0],im.width):out.paste(im,(x,y))
    return out

def over(ref,overlay,size):
    ground=tiled(ref.convert('RGBA'),size)
    ground.alpha_composite(tiled(overlay,size))
    return ground.convert('RGB')

def proofs(allframes):
    refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(REF.glob('ref-*.png'))}
    # Every final file at literal 1x and nearest-neighbour 4x, on its reference.
    preferred={'rain':'fantasy-town','heavy_rain':'modern-city','snow':'snow','hail':'fantasy-grass','blizzard':'snow','sandstorm':'desert-sand'}
    for name,frames in allframes.items():
        for f,im in enumerate(frames):
            bg=over(refs[preferred[name]],im,(192,192))
            sheet=Image.new('RGB',(992,816),'#202832');d=ImageDraw.Draw(sheet)
            d.text((12,8),f'{name}-f{f} | native 1x / nearest-neighbour 4x',fill='white')
            sheet.paste(bg,(12,36));sheet.paste(bg.resize((768,768),NN),(216,36))
            save(sheet,REVIEW/f'r16-A-file-{name}-f{f}.png')
        # Seven references, actual four-frame animation; no interpolated frames.
        panels=[]
        for im in frames:
            board=Image.new('RGB',(4*300,2*320),'#202832');d=ImageDraw.Draw(board)
            for i,(refname,ref) in enumerate(refs.items()):
                x=(i%4)*300;y=(i//4)*320
                d.text((x+6,y+4),refname,fill='white');board.paste(over(ref,im,(288,288)),(x+6,y+24))
            d.text((906,346),name,fill='white');d.text((906,368),'f0 > f1 > f2 > f3 > f0',fill='white')
            panels.append(board)
        # Shared GIF palette prevents palette flicker between frames.
        palette=panels[0].quantize(colors=256,method=Image.Quantize.MEDIANCUT)
        gif=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in panels]
        gif[0].save(REVIEW/f'r16-A-{name}.gif',save_all=True,append_images=gif[1:],duration=110 if name!='snow' else 160,loop=0,disposal=2,optimize=False)
        save(panels[0],REVIEW/f'r16-A-context-{name}.png')
        # Literal 3x3 weather repeats for EVERY FRAME over EVERY reference,
        # at 1x, brief-requested 3x, and user-requested 4x.
        for refname,ref in refs.items():
            for f,im in enumerate(frames):
                repeated=over(ref,im,(576,576))
                save(repeated,REVIEW/f'r16-A-repeat-{name}-f{f}-{refname}-1x.png')
                save(repeated.resize((1728,1728),NN),REVIEW/f'r16-A-repeat-{name}-f{f}-{refname}-3x.png')
                save(repeated.resize((2304,2304),NN),REVIEW/f'r16-A-repeat-{name}-f{f}-{refname}-4x.png')
    board=Image.new('RGB',(4*300,2*320),'#202832');d=ImageDraw.Draw(board)
    for i,(name,ref) in enumerate(refs.items()):
        x=i%4*300;y=i//4*320;d.text((x+6,y+5),name+' | 48 px/cell',fill='white');board.paste(ref,(x+6,y+24))
    save(board,REVIEW/'r16-A-references.png')

def legacy_main():
    refs=json.loads((REVIEW/'r16-A-measurements.json').read_text())['references'];allframes={};reductions={};weather={}
    for name in SPECS:
        parts,reductions[name]=reduce_master(name)
        allframes[name],weather[name]=animate(name,parts)
        print(name,[(s['cover_percent'],s['alpha_weighted_percent']) for s in weather[name]['files']],flush=True)
    if '--quick' not in __import__('sys').argv: proofs(allframes)
    report={'references':refs,'registration':reductions,'weather':weather,'method':'image-tool masters > magenta key > BOX register at 8x > palette lock > exact RGBA mode of 64 samples > component cleanup > discrete alpha > toroidal placement and translation', 'selected':{n:[r['source'] for r in reductions[n]] for n in SPECS}}
    (REVIEW/'r16-A-measurements.json').write_text(json.dumps(report,indent=2)+'\n')

def main():
    # Current revision must preserve the critic's passing PNGs byte-for-byte.
    # The repair runner reuses their recorded drawings, motion and outputs.
    import importlib.util, sys
    sys.dont_write_bytecode=True
    spec=importlib.util.spec_from_file_location('redraw2',REVIEW/'r16-A-redraw2.py')
    repair=importlib.util.module_from_spec(spec);spec.loader.exec_module(repair)
    repair.main()

if __name__=='__main__':main()
