"""Critic 2: preserve passed art; reduce drawn dust and redistribute snow."""
from pathlib import Path
from PIL import Image, ImageDraw
import importlib.util, json, random, hashlib, sys
sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('weather', HERE/'r16-A-build.py')
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)

# Sizes register the new drawing, never synthesize its silhouette.
SIZES = {
 'a': [(68,7),(42,14),(56,12),(18,5),(52,12),(48,7),(64,13),(34,12)],
 'b': [(64,9),(38,12),(60,12),(22,4),(48,13),(72,6),(25,11),(50,8)],
 'c': [(76,4),(34,10),(52,10),(16,4),(54,16),(56,11),(66,9),(28,7)],
}

def variants():
    records = {}
    board = Image.new('RGB', (1180, 840), '#202832')
    d = ImageDraw.Draw(board)
    for col, variant in enumerate('abc'):
        records[variant] = []
        d.text((col*392+10,8), f'New image-tool variant {variant.upper()} / native and 4x', fill='white')
        for i,size in enumerate(SIZES[variant]):
            part, rec = b.reduce_piece('sandstorm', f'redraw2-sand-{variant}', i, (2,4), size, f'variant-{variant}-{i}')
            records[variant].append(rec)
            x,y=col*392+10, 34+i*100
            d.text((x,y), f'{i}: {size[0]} x {size[1]}', fill='white')
            board.paste(part,(x+110,y),part)
            board.paste(part.resize((part.width*4,part.height*4),b.NN),(x,y+22),part.resize((part.width*4,part.height*4),b.NN))
    b.save(board,HERE/'r16-A-redraw2-variants.png')
    (HERE/'r16-A-redraw2-registrations.json').write_text(json.dumps(records,indent=2)+'\n')

def candidate(rng, name, idx):
    if name == 'snow':
        n = rng.choice([32,40])
        # Short independently wandering paths: 8 or 10 visible copies, versus
        # 16 or 20 copies on the previous long, coherent bending paths.
        dx=b.bounded_steps(rng,n,0,(-2,2))
        dy=b.bounded_steps(rng,n,192,(1,8))
    else:
        n=8
        dx=b.bounded_steps(rng,n,192,(16,32))
        dy=b.bounded_steps(rng,n,0,(-3,3))
    x,y=rng.randrange(192),rng.randrange(192)
    pts=[]
    for a,c in zip(dx,dy):
        pts.append([x%192,y%192]);x+=a;y+=c
    assert [x%192,y%192] == pts[0]
    return {'kind':'track','particle':idx,'phase':rng.randrange(4),'points':pts,'steps':list(map(list,zip(dx,dy)))}

def draw_indices(name, parts, group):
    pixels=b.particle_pixels(name,parts[group['particle']],group['particle'])
    phases=[]
    for f in range(4):
        ids=set()
        for _,x,y in b.instances([group],f):
            ids.update(((y+py)%192)*192+(x+px)%192 for px,py,_ in pixels)
        phases.append(ids)
    return phases

def heat(mask, name):
    # Measurements of drawn occupied pixels only; no procedural artwork.
    rows=[0]*192;cols=[0]*192;bins=[0]*144
    for i in mask:
        x,y=i%192,i//192;rows[y]+=1;cols[x]+=1;bins[(y//16)*12+x//16]+=1
    # Triangular density kernel (box convolved with itself) avoids favoring
    # regularly spaced curtains at a rectangular kernel's negative sidelobes.
    broad_x=[sum(cols[(x+k)%192]*(17-abs(k)) for k in range(-16,17))/289 for x in range(192)]
    broad_y=[sum(rows[(y+k)%192]*(17-abs(k)) for k in range(-16,17))/289 for y in range(192)]
    return rows,cols,bins,broad_x,broad_y

def place(name,parts):
    rng=random.Random(162024 if name=='snow' else 162194)
    groups=[];masks=[set() for _ in range(4)]
    target=8.2 if name=='snow' else 33
    for j in range(1000):
        idx=rng.randrange(len(parts))
        h=[heat(m,name) for m in masks]
        options=[]
        for k in range(30 if name=='snow' else 20):
            g=candidate(rng,name,idx);ids=draw_indices(name,parts,g)
            score=0
            for f,ii in enumerate(ids):
                rows,cols,bins,bx,by=h[f]
                # Broad balance removes curtains. Local balance is weaker to
                # retain natural irregular spacing and overlapping dust bands.
                if name=='snow':
                    score+=sum(2*cols[i%192]+4*bx[i%192]+.6*by[i//192]+.3*bins[(i//192//16)*12+(i%192//16)] for i in ii)/len(ii)
                    score+=100*len(ii&masks[f])/len(ii)
                else:
                    score+=sum(.5*bx[i%192]+1.2*by[i//192]+.20*bins[(i//192//16)*12+(i%192//16)] for i in ii)/len(ii)
                    score+=20*len(ii&masks[f])/len(ii)
            options.append((score,g,ids))
        _,g,ids=min(options,key=lambda a:a[0])
        groups.append(g)
        for f,ii in enumerate(ids):masks[f]|=ii
        cover=[len(m)*100/36864 for m in masks]
        if min(cover)>=target:break
    return groups

def export(name,parts,groups):
    frames=[b.render(name,parts,groups,f) for f in range(5)]
    assert frames[0].tobytes()==frames[4].tobytes()
    stats=[]
    for f,im in enumerate(frames[:4]):
        v=list(im.getdata());count=sum(p[3]>0 for p in v)
        stat={'file':f'{name}-f{f}.png','size':[192,192], 'covered_pixels':count,
          'cover_percent':round(count*100/36864,4),
          'alpha_weighted_percent':round(sum(p[3] for p in v)*100/(255*36864),4),
          'alpha_levels':sorted({p[3] for p in v}),
          'rgba_palette':sorted({p for p in v if p[3]})}
        b.save(im,b.DEST/stat['file'], motion='independent closed native paths; r16-A-measurements.json groups[*].steps', frame=f, cover_percent=stat['cover_percent'],alpha_weighted_percent=stat['alpha_weighted_percent'])
        stats.append(stat)
    motion={'exact_offsets':'groups[*].steps; right/down positive',
      'phase_cohort':'8 or 10 snow particles / 2 dust bands per independently positioned path',
      'dx_range':[-2,2] if name=='snow' else [16,32],
      'dy_range':[1,8] if name=='snow' else [-3,3]}
    return {'groups':groups,'motion_per_frame':motion,'frame4_equals_frame0':True,'files':stats}

def main():
    report=json.loads((HERE/'r16-A-measurements.json').read_text())
    if '--variants' in sys.argv:
        variants();return
    if '--proofs-only' in sys.argv:
        b.proofs({name:[Image.open(b.DEST/f'{name}-f{f}.png').convert('RGBA') for f in range(4)] for name in b.SPECS})
        return
    # C has hollow flat streams and the strongest silhouette variation. Two B
    # fragments add short thick and short thin shapes without peaked crests.
    selection=[('c',0),('c',1),('c',2),('c',3),('c',4),('c',5),('c',6),('c',7),('b',3),('b',6)]
    regs=json.loads((HERE/'r16-A-redraw2-registrations.json').read_text())
    report['registration']['sandstorm']=[]
    for i,(variant,idx) in enumerate(selection):
        report['registration']['sandstorm'].append(regs[variant][idx])
        for stage in ('registered','mode','particle'):
            b.save(Image.open(HERE/f'r16-A-{stage}-sandstorm-variant-{variant}-{idx}.png'),HERE/f'r16-A-{stage}-sandstorm-{i}.png')
    for name in ('snow','sandstorm'):
        parts=[Image.open(HERE/f'r16-A-particle-{name}-{i}.png').convert('RGBA') for i in range(len(report['registration'][name]))]
        report['weather'][name]=export(name,parts,place(name,parts))
        print(name,'groups',len(report['weather'][name]['groups']),[r['cover_percent'] for r in report['weather'][name]['files']],flush=True)
    report['selected']['sandstorm']=[{'variant':v,'cell':i} for v,i in selection]
    report['revision']='critic-r16A-2 redraw: preserved passed files; new sand drawing and independent shorter paths'
    (HERE/'r16-A-measurements.json').write_text(json.dumps(report,indent=2)+'\n')
    if '--quick' not in sys.argv:
        b.proofs({name:[Image.open(b.DEST/f'{name}-f{f}.png').convert('RGBA') for f in range(4)] for name in b.SPECS})

if __name__=='__main__':main()
