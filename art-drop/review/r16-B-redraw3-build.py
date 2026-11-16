"""Focused image-painted repairs; code only registers, reduces and composites."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
from collections import Counter
import sys, importlib.util, json
sys.dont_write_bytecode = True
R = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('previous', R/'r16-B-redraw2-build.py')
b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
OUT, REF, NN = b.OUT, b.REF, b.NN
PAL = b.PAL[:4]
ALPHA = [0,24,48,80]
ROIS = [dict(name='upper-left', box=[4,6,88,47], overlap=[4,5,12,6]),
        dict(name='lower-right', box=[125,100,188,159], overlap=[12,10,4,9])]

def image_ids(a, weather=False):
    table=[(*rgb,ALPHA[i] if weather else (255 if i else 0)) for i,rgb in enumerate(PAL)]
    im=Image.new('RGBA',a.size);im.putdata([table[p] for p in a.getdata()]);return im

def old_ids(f=0):
    a=Image.open(R/f'r16-B-redraw3-original-fog-f{f}.png')
    im=Image.new('L',a.size);im.putdata([ALPHA.index(p[3]) for p in a.getdata()]);return im

def components(a, wrap=False):
    w,h=a.size;left={i for i,p in enumerate(a.getdata()) if p};groups=[]
    while left:
        first=left.pop(); group=[first]; todo=[first]
        while todo:
            y,x=divmod(todo.pop(),w)
            for dy in (-1,0,1):
                for dx in (-1,0,1):
                    yy,xx=y+dy,x+dx
                    if wrap: yy%=h; xx%=w
                    if 0<=yy<h and 0<=xx<w:
                        p=yy*w+xx
                        if p in left: left.remove(p);group.append(p);todo.append(p)
        groups.append(group)
    return groups

def cleanup(a, wrap=False):
    data=list(a.getdata());removed=[];w=a.width
    for group in components(a,wrap):
        xs={p%w for p in group}
        # Area alone misses the critic's three-pixel dash and 1x22 scratch.
        if len(group)<=3 or (len(xs)==1 and len(group)>=6): removed+=group
    for i in removed:data[i]=0
    result=Image.new('L',a.size);result.putdata(data)
    return result,removed

def reduce(var):
    src=R/f'r16-B-source-redraw3-fog-{var}.png'
    raw=Image.open(src).convert('RGB');keyed=Image.new('RGBA',raw.size)
    keyed.putdata([(0,0,0,0) if r>g+55 and bl>g+55 and r>135 and bl>135 else (r,g,bl,255) for r,g,bl in raw.getdata()])
    reg=keyed.resize((1536,1536),Image.Resampling.BOX)
    lookup={};ids=[]
    for p in reg.getdata():
        if p not in lookup:lookup[p]=0 if p[3]<128 else min(range(1,4),key=lambda i:sum((p[c]-PAL[i][c])**2 for c in range(3)))
        ids.append(lookup[p])
    locked=Image.new('L',reg.size);locked.putdata(ids);pixels=[]
    for y in range(192):
        for x in range(192):
            votes=Counter(ids[(y*8+sy)*1536+x*8+sx] for sy in range(8) for sx in range(8))
            pixels.append(min(votes,key=lambda i:(-votes[i],i)))
    native=Image.new('L',(192,192));native.putdata(pixels)
    clean,removed=cleanup(native,True)
    pixels=list(clean.getdata());cp=pixels.copy();recolours=[]
    for i,p in enumerate(pixels):
        y,x=divmod(i,192)
        neighbours=[pixels[yy*192+xx] for xx,yy in [((x-1)%192,y),((x+1)%192,y),(x,(y-1)%192),(x,(y+1)%192)]]
        if p>1 and not all(neighbours):cp[i]=1;recolours.append(i)
    contour=Image.new('L',clean.size);contour.putdata(cp)
    for stage,value in [('registered',locked),('mode',native),('clean',clean),('contour',contour)]:
        image_ids(value).save(R/f'r16-B-{stage}-redraw3-fog-{var}.png')
    return contour,dict(source=src.name,source_size=list(raw.size),native=[192,192],registration=[1536,1536],removed=removed,contour_recolours=recolours)

def path_cut(cost):
    cost=[row.copy() for row in cost];h,w=len(cost),len(cost[0]);back=[[0]*w for _ in range(h)]
    for y in range(1,h):
        for x in range(w):
            j=min(range(max(0,x-1),min(w,x+2)),key=lambda j:cost[y-1][j])
            cost[y][x]+=cost[y-1][j];back[y][x]=j
    path=[min(range(w),key=lambda x:cost[-1][x])]
    for y in range(h-1,0,-1): path.append(back[y][path[-1]])
    return path[::-1]

def repair_mask(old,new):
    mask=[0]*36864;records=[];op=list(old.getdata());npix=list(new.getdata())
    for spec in ROIS:
        x0,y0,x1,y1=spec['box'];left,top,right,bottom=spec['overlap']
        cost=[[(ALPHA[op[y*192+x]]-ALPHA[npix[y*192+x]])**2 for x in range(x0,x1)] for y in range(y0,y1)]
        h,w=y1-y0,x1-x0
        lp=path_cut([row[:left] for row in cost]);rp=[w-right+p for p in path_cut([row[-right:] for row in cost])]
        tp=path_cut([list(row) for row in zip(*cost[:top])]);bp=[h-bottom+p for p in path_cut([list(row) for row in zip(*cost[-bottom:])])]
        for y in range(h):
            for x in range(w):
                if lp[y]<=x<=rp[y] and tp[x]<=y<=bp[x]:mask[(y+y0)*192+x+x0]=255
        records.append(dict(**spec,left_cut=lp,right_cut=rp,top_cut=tp,bottom_cut=bp))
    im=Image.new('L',(192,192));im.putdata(mask);return im,records

def compose(var,write=True):
    new,record=reduce(var);old=old_ids();mask,cuts=repair_mask(old,new)
    frames=[];removals=[]
    for f in range(4):
        a=old_ids(f);a.paste(new,(0,0),mask);a,removed=cleanup(a,True)
        frames.append(image_ids(a,True));removals.append(removed)
    if write:
        mask.save(R/f'r16-B-redraw3-mask-{var}.png')
        frames[0].save(R/f'r16-B-redraw3-candidate-{var}-tile.png')
        for name in ['fantasy-grass','wasteland','modern-city']:
            bg=b.repeat(Image.open(REF/f'ref-{name}.png'),(576,576))
            b.composite(bg,b.repeat(frames[0],(576,576))).save(R/f'r16-B-redraw3-candidate-{var}-{name}-1x.png')
    return frames,dict(drawing=record,cuts=cuts,cleanup_removed=removals,stats=b.stats(frames[0]))

def prepare():
    records={}
    for var in 'abc':
        if (R/f'r16-B-source-redraw3-fog-{var}.png').exists():
            ff,records[var]=compose(var)
            print(var,records[var]['stats'],flush=True)
    (R/'r16-B-redraw3-candidates.json').write_text(json.dumps(records,indent=2)+'\n')

def edge_repairs():
    edges={k:Image.open(R/f'r16-B-redraw3-original-fog-edge-{k}.png').convert('RGBA') for k in 'nsew'}
    removed={'n':[(x,2) for x in range(147,150)],'e':[(39,y) for y in range(127,149)]}
    for k,coords in removed.items():
        for x,y in coords:edges[k].putpixel((x,y),(0,0,0,0))
    return edges,removed

def reviews(frames,edges):
    # Regenerate the established authoritative review layouts from current PNGs.
    b.reviews(frames,edges)
    refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(REF.glob('ref-*.png'))}
    compare=Image.new('RGB',(1152,1200),(28,32,38));draw=ImageDraw.Draw(compare)
    for row,name in enumerate(['fantasy-grass','wasteland']):
        bg=b.repeat(refs[name],(576,576))
        for col,(label,field) in enumerate([('Before',image_ids(old_ids(),True)),('Focused redraw B',frames['fog'][0])]):
            compare.paste(b.composite(bg,b.repeat(field,(576,576))),(col*576,row*600+24))
            draw.text((col*576+8,row*600+7),f'{label} / {name} / native 3x3',fill='white')
    compare.save(R/'r16-B-redraw3-comparison.png')
    selection=Image.new('RGB',(1728,1200),(28,32,38));draw=ImageDraw.Draw(selection)
    for col,var in enumerate('abc'):
        for row,name in enumerate(['fantasy-grass','wasteland']):
            selection.paste(Image.open(R/f'r16-B-redraw3-candidate-{var}-{name}-1x.png'),(col*576,row*600+24))
            draw.text((col*576+8,row*600+7),f'{var.upper()}'+(' / selected' if var=='b' else '')+' / '+name,fill='white')
    selection.save(R/'r16-B-selection.png');selection.save(R/'r16-B-redraw3-selection.png')
    compare.save(R/'r16-B-placement-review.png')
    detail=Image.new('RGB',(1152,640),(28,32,38));draw=ImageDraw.Draw(detail)
    for row,(name,box) in enumerate([('upper-left',(0,6,92,47)),('lower-right',(123,100,192,161))]):
        for col,(label,im) in enumerate([('before',image_ids(old_ids(),True)),('redraw',frames['fog'][0])]):
            comp=b.composite(refs['wasteland'].crop((0,0,192,192)),im).crop(box)
            detail.paste(comp.resize((comp.width*4,comp.height*4),NN),(col*576+8,row*320+28))
            draw.text((col*576+8,row*320+8),f'{name} / {label} / actual alpha 4x',fill='white')
    detail.save(R/'r16-B-redraw3-detail.png')
    for name,ref in refs.items():
        panel=Image.new('RGB',(1152,1200),(28,32,38));draw=ImageDraw.Draw(panel)
        for f in range(4):
            im=Image.open(R/f'r16-B-repeat-fog-f{f}-{name}-1x.png');x=f%2*576;y=f//2*600
            panel.paste(im,(x,y+24));draw.text((x+6,y+6),f'{name} / f{f} / native 3x3',fill='white')
        panel.save(R/f'r16-B-redraw3-inspect-{name}.png')
    html='''<!doctype html><meta charset="utf-8"><title>Round 16 B — focused fog redraw</title>
<style>body{background:#1c2026;color:#eee;font:16px system-ui;margin:24px}img{image-rendering:pixelated;max-width:100%}a{color:#ace}section{margin:24px 0}</style>
<h1>Round 16 — Part B: critic-r16B-3 redraw</h1><p>Three focused image-tool alternatives; B selected at native map opacity. Shallow quiet planes replace the two bright crests. North dash and east scratch removed. Passing heat, south and west assets preserved byte-for-byte.</p>
<p>Native PNGs are authoritative. GIFs use a shared review palette, four phases at 360 ms each.</p>
<section><h2>Fog loop</h2><img src="r16-B-fog.gif"></section>
<section><h2>Fog area and feathered edges</h2><img src="r16-B-fog-area.gif"></section>
<section><h2>Heat-wave loop</h2><img src="r16-B-heat_wave.gif"></section>
<section><h2>Before and after</h2><img src="r16-B-redraw3-comparison.png"></section>
<section><h2>Three drawing alternatives</h2><img src="r16-B-selection.png"></section>
<p><a href="r16-B-redraw3-validation.json">Validation</a> · <a href="r16-B-redraw3-generation.json">Drawing prompts</a> · <a href="r16-B-measurements.json">Cover and motion</a></p>'''
    for family in frames:
        html+=f'<h2>{family}: all phases, all references, native / 3× / 4×</h2>'
        for name in refs:
            html+=f'<p>{name}: '
            for f in range(4):html+=' '.join(f'<a href="r16-B-repeat-{family}-f{f}-{name}-{s}x.png">f{f} {s}×</a>' for s in (1,3,4))+' · '
            html+='</p>'
    (R/'r16-B-review.html').write_text(html)

def finalize():
    fog,record=compose('b');edges,removed=edge_repairs()
    frames={'fog':fog,'heat_wave':[Image.open(OUT/f'heat_wave-f{f}.png').convert('RGBA') for f in range(4)]}
    for f,im in enumerate(fog):im.save(OUT/f'fog-f{f}.png')
    for k in 'ne':edges[k].save(OUT/f'fog-edge-{k}.png')
    m=dict(repair='critic-r16B-3 redraw',selection='B: quieter broad shallow planes, without A bright accents or C wavy shelf; selected in native unannotated 3x3 grass/water composites.',method='Built-in image tool: three large focused redraws on magenta. Key, 8x BOX registration, fixed palette, exact 64-sample mode, one-pixel contour cleanup, minimum-error hard-cut composition with approved broad planes. No shape/noise synthesis.',selected=record,edge_cleanup_coordinates=removed,files={},motion={})
    for family,ff in frames.items():
        for f,im in enumerate(ff):m['files'][f'{family}-f{f}.png']=b.stats(im)
        m['motion'][family]=[]
        for f in range(4):
            hist=ImageChops.difference(ff[f].getchannel('A'),ff[(f+1)%4].getchannel('A')).histogram()
            m['motion'][family].append(dict(from_frame=f,to_frame=(f+1)%4,changed_pixels=36864-hist[0],alpha_mean_absolute_delta=sum(i*n for i,n in enumerate(hist))/36864))
    for k,im in edges.items():m['files'][f'fog-edge-{k}.png']=b.stats(im)
    (R/'r16-B-measurements.json').write_text(json.dumps(m,indent=2)+'\n')
    (R/'r16-B-redraw3-measurements.json').write_text(json.dumps(m,indent=2)+'\n')
    reviews(frames,edges)
    print(json.dumps({k:m[k] for k in ['files','motion']},indent=2))

if __name__=='__main__':
    if '--final' in sys.argv:finalize()
    else:prepare()
