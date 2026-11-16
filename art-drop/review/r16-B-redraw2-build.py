"""Critic-r16B-2: reduce drawings, then place/wrap their pixels. No shape synthesis."""
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
from collections import Counter
import sys,importlib.util,json,random
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('previous',R/'r16-B-redraw1-build.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
ROOT=b.ROOT;OUT=b.OUT;REF=b.REF;NN=b.NN;PAL=b.PAL;ALPHA=b.ALPHA;MOTION=b.MOTION
rgba=b.rgba;ids_from=b.ids_from;components=b.components;render=b.render;stats=b.stats
repeat=b.repeat;composite=b.composite;edges_from=b.edges_from;area_overlay=b.area_overlay
gif_panels=b.gif_panels;sheet=b.sheet
SIZES={'b':[(104,42),(96,40),(116,36),(100,46),(90,32),(108,36)],
       'c':[(112,26),(80,42),(104,34),(130,30),(92,38),(140,18)]}

def reduce(var,index):
    path=R/f'r16-B-source-redraw2-fog-{var}.png';raw=Image.open(path).convert('RGB')
    ww,hh=raw.size
    if var=='a':cell=(0,0,ww,hh);w,h=224,224
    else:
        cx=index%2;cy=index//2;cell=(round(cx*ww/2),round(cy*hh/3),round((cx+1)*ww/2),round((cy+1)*hh/3));w,h=SIZES[var][index]
        if var=='c' and index==0:cell=(0,0,670,round(hh/3))
        if var=='c' and index==1:cell=(680,0,ww,round(hh/3))
    keyed=Image.new('RGBA',(cell[2]-cell[0],cell[3]-cell[1]))
    keyed.putdata([(0,0,0,0) if r>g+55 and bl>g+55 and r>135 and bl>135 else (r,g,bl,255) for r,g,bl in raw.crop(cell).getdata()])
    box=keyed.getbbox();reg=keyed.crop(box).resize((w*8,h*8),Image.Resampling.BOX)
    source_palette=([(169,188,194),(187,204,206),(213,226,226),(241,243,235)] if var=='c' else PAL[1:])
    lookup={};ids=[]
    for p in reg.getdata():
        if p not in lookup:lookup[p]=0 if p[3]<128 else min(range(1,5),key=lambda j:sum((p[c]-source_palette[j-1][c])**2 for c in range(3)))
        ids.append(([0,1,2,2,3][lookup[p]]) if var=='b' else lookup[p])
    locked=Image.new('L',reg.size);locked.putdata(ids);native=[];rw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(ids[(y*8+sy)*rw+x*8+sx] for sy in range(8) for sx in range(8))
            native.append(min(votes,key=lambda i:(-votes[i],i)))
    mode=Image.new('L',(w,h));mode.putdata(native);clean,removed,_=components(mode)
    pixels=list(clean.getdata());contour=pixels.copy();changed=[]
    for i,p in enumerate(pixels):
        x=i%w;y=i//w
        neighbours=[pixels[yy*w+xx] for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)] if 0<=xx<w and 0<=yy<h]
        edge=not all(neighbours) or (var!='a' and len(neighbours)<4)
        if p and edge:
            if p!=1:changed.append(i)
            contour[i]=1
    final=Image.new('L',(w,h));final.putdata(contour)
    for stage,a in [('registered',locked),('mode',mode),('clean',clean),('contour',final)]:rgba(a,False).save(R/f'r16-B-{stage}-redraw2-fog-{var}-{index}.png')
    return final,dict(source=path.name,cell=cell,crop=box,native=[w,h],source_palette=source_palette,colour_transfer=([0,1,2,2,3] if var=='b' else [0,1,2,3,4]),removed=removed,contour_recolours=changed)

def hard_wrap(a):
    """Select existing source samples along low-error cuts in the 32px overlap."""
    paths=[]
    for axis in range(2):
        if axis:a=a.transpose(Image.Transpose.TRANSPOSE)
        w,h=a.size;rows=[list(a.crop((0,y,w,y+1)).getdata()) for y in range(h)]
        cost=[[(ALPHA[row[x]]-ALPHA[row[x+192]])**2+(1e10 if x in [0,31] else 0) for x in range(32)] for row in rows]
        acc=[row.copy() for row in cost];back=[[0]*32 for _ in range(h)]
        for y in range(1,h):
            for x in range(32):
                j=min(range(max(0,x-1),min(32,x+2)),key=lambda j:acc[y-1][j]);acc[y][x]+=acc[y-1][j];back[y][x]=j
        path=[min(range(32),key=lambda x:acc[-1][x])]
        for y in range(h-1,0,-1):path.append(back[y][path[-1]])
        path=path[::-1];pixels=[]
        for row,x in zip(rows,path):pixels+=row[192:192+x]+row[x:192]
        a=Image.new('L',(192,h));a.putdata(pixels);paths.append(path)
        if axis:a=a.transpose(Image.Transpose.TRANSPOSE)
    return a,paths

def score(ids):
    # Layout ranking only; creates positions, never texture pixels.
    return b.assess(ids)

def arrange(parts,seed,count):
    rng=random.Random(seed);order=list(range(len(parts)));rng.shuffle(order)
    while len(order)<count:order+=rng.sample(range(len(parts)),len(parts))
    result=[]
    for i,p in enumerate(order[:count]):
        w,h=parts[p].size;x=rng.randrange(192);y=rng.randrange(192)
        moving=x>=4 and y>=4 and x+w<=188 and y+h<=188
        result.append(dict(part=p,x=x,y=y,moving=moving,phase=i%4))
    return result

def preview(name,field):
    canvas=Image.new('RGB',(1728,600),(28,32,38));d=ImageDraw.Draw(canvas)
    for j,n in enumerate(['fantasy-grass','wasteland','fantasy-town']):
        ref=Image.open(REF/f'ref-{n}.png');im=composite(repeat(ref,(576,576)),repeat(field,(576,576)))
        canvas.paste(im,(576*j,24));d.text((576*j+8,7),f'{name} / {n} / native 3x3 / {stats(field)["cover_percent"]}%',fill='white')
    canvas.save(R/f'r16-B-redraw2-candidate-{name}.png')

def prepare():
    parts={};records={}
    for var in 'abc':
        rr=[reduce(var,i) for i in range(1 if var=='a' else 6)];parts[var]=[p for p,r in rr];records[var]=[r for p,r in rr]
    a,paths=hard_wrap(parts['a'][0]);preview('a',rgba(a));rgba(a).save(R/'r16-B-redraw2-candidate-a-tile.png')
    results={'a':{'stats':stats(rgba(a)),'hard_cut_paths':paths}}
    for vi,var in enumerate(['b','c','mix']):
        pp=parts[var] if var!='mix' else parts['b']+parts['c'];best=[]
        for j in range(450):
            inst=arrange(pp,160200+vi*10000+j,10)
            if sum(it['moving'] for it in inst)<3:continue
            a=render(pp,inst,0);s=score(a)
            best.append((s,inst,a))
        best.sort(key=lambda v:v[0]);score0,inst,a=best[0]
        results[var]={'score':score0,'instances':inst,'stats':stats(rgba(a))};preview(var,rgba(a))
        rgba(a).save(R/f'r16-B-redraw2-candidate-{var}-tile.png')
        if var=='mix':
            for i,(s,ins,im) in enumerate(best[:5]):
                preview(f'mix-{i}',rgba(im));results[f'mix-{i}']={'score':s,'instances':ins,'stats':stats(rgba(im))}
        print(var,score0,results[var]['stats'],flush=True)
    (R/'r16-B-redraw2-candidates.json').write_text(json.dumps(results,indent=2)+'\n')
    (R/'r16-B-redraw2-drawings.json').write_text(json.dumps(records,indent=2)+'\n')
    donors=Image.new('RGB',(1040,640),(28,32,38));d=ImageDraw.Draw(donors)
    for vi,var in enumerate('bc'):
        d.text((vi*520+8,8),f'{var.upper()}: native hard-alpha / actual weather alpha',fill='white')
        for i,p in enumerate(parts[var]):
            x=vi*520+12;y=35+i*98
            donors.paste(rgba(p,False),(x,y),rgba(p,False));donors.paste(composite(Image.new('RGB',p.size,(28,32,38)),rgba(p)),(x+190,y))
            d.text((x+360,y),str(i),fill='white')
    donors.save(R/'r16-B-redraw2-donors.png')



def reviews(frames,edges):
    refs={p.stem[4:]:Image.open(p).convert('RGB') for p in sorted(REF.glob('ref-*.png'))}
    overview=Image.new('RGB',(2016,936),(28,32,38));d=ImageDraw.Draw(overview)
    for col,(name,ref) in enumerate(refs.items()):
        for row,kind in enumerate(['clear','fog','heat_wave']):
            im=ref if kind=='clear' else composite(ref,repeat(frames[kind][0],(288,288)))
            overview.paste(im,(col*288,row*312+24));d.text((col*288+6,row*312+6),name+' / '+kind,fill='white')
    overview.save(R/'r16-B-overview.png')
    for family,ff in frames.items():
        base=refs['fantasy-town' if family=='fog' else 'desert-sand'].crop((0,0,192,192))
        strip=Image.new('RGB',(832,224),(28,32,38));d=ImageDraw.Draw(strip)
        for f,field in enumerate(ff):
            im=composite(base,field);sheet(im,f'{family}-f{f}.png').save(R/f'r16-B-file-{family}-f{f}.png')
            strip.paste(im,(f*208+8,24));d.text((f*208+8,8),f'f{f}',fill='white')
            for name,ref in refs.items():
                comp=composite(repeat(ref,(576,576)),repeat(field,(576,576)))
                for scale in (1,3,4):comp.resize((576*scale,576*scale),NN).save(R/f'r16-B-repeat-{family}-f{f}-{name}-{scale}x.png')
        strip.save(R/f'r16-B-filmstrip-{family}.png');b.gif(gif_panels(ff,family,refs),R/f'r16-B-{family}.gif')
    for k,edge in edges.items():
        im=composite(refs['fantasy-grass'].crop((0,0,edge.width,edge.height)),edge)
        sheet(im,f'fog-edge-{k}.png').save(R/f'r16-B-file-fog-edge-{k}.png')
    for name,ref in refs.items():
        im=composite(repeat(ref,(576,576)),area_overlay(frames['fog'][0],edges))
        for scale in (1,4):im.resize((576*scale,576*scale),NN).save(R/f'r16-B-fog-area-{name}-{scale}x.png')
    b.gif([composite(repeat(refs['fantasy-town'],(576,576)),area_overlay(f,edges)) for f in frames['fog']],R/'r16-B-fog-area.gif')
    # Updated selection and placement review replace obsolete chosen-atlas claims.
    Image.open(R/'r16-B-redraw2-donors.png').save(R/'r16-B-selection.png')
    Image.open(R/'r16-B-redraw2-candidate-mix.png').save(R/'r16-B-placement-review.png')
    html='''<!doctype html><meta charset="utf-8"><title>Round 16 B — fog redraw</title>
<style>body{background:#1c2026;color:#eee;font:16px system-ui;margin:24px}img{image-rendering:pixelated;max-width:100%}a{color:#ace}section{margin:24px 0}</style>
<h1>Round 16 — Part B: critic-r16B-2 redraw</h1><p>Ten larger, quiet flat bank drawings replace small curls, bright tips and repeated clear lanes. Four matching edges rebuilt from the unchanged drawn feather masks. Heat-wave PNGs preserved.</p>
<p>Native PNGs are authoritative. GIFs have a shared 256-colour review palette. Four phases at 360 ms each.</p>
<section><h2>Fog loop</h2><img src="r16-B-fog.gif"></section>
<section><h2>Fog area and feathered edges</h2><img src="r16-B-fog-area.gif"></section>
<section><h2>Unchanged heat-wave loop</h2><img src="r16-B-heat_wave.gif"></section>
<section><h2>Before and after, native 3×3 fields</h2><img src="r16-B-redraw2-comparison.png"></section>
<section><h2>Three drawing alternatives</h2><img src="r16-B-selection.png"></section>
<p><a href="r16-B-redraw2-validation.json">Validation</a> · <a href="r16-B-redraw2-generation.json">Drawing prompts</a> · <a href="r16-B-measurements.json">Cover and motion</a></p>'''
    for family in ['fog','heat_wave']:
        html+=f'<h2>{family}: all phases, all references, native / 3× / 4×</h2>'
        for name in refs:
            html+=f'<p>{name}: '
            for f in range(4):
                html+=' '.join(f'<a href="r16-B-repeat-{family}-f{f}-{name}-{scale}x.png">f{f} {scale}×</a>' for scale in (1,3,4))+' · '
            html+='</p>'
    (R/'r16-B-review.html').write_text(html)

def matching_edges(fields,edges):
    inner={'n':(0,45,192,48),'s':(0,0,192,3),'e':(0,0,3,192),'w':(45,0,48,192)}
    continuation={'n':(0,189,192,192),'s':(0,0,192,3),'e':(0,0,3,192),'w':(189,0,192,192)}
    return all(edge.crop(inner[k]).tobytes()==f.crop(continuation[k]).tobytes() for k,edge in edges.items() for f in fields)

def finalize():
    drawings=json.loads((R/'r16-B-redraw2-drawings.json').read_text())
    pp=[ids_from(Image.open(R/f'r16-B-contour-redraw2-fog-{v}-{i}.png').convert('RGBA')) for v in 'bc' for i in range(6)]
    chosen=json.loads((R/'r16-B-redraw2-candidates.json').read_text())['mix']
    shifts=sorted([(x,y) for y in range(-8,9) for x in range(-8,9)],key=lambda v:abs(v[0])+abs(v[1]))
    for sx,sy in shifts:
        inst=[dict(it,x=(it['x']+sx)%192,y=(it['y']+sy)%192) for it in chosen['instances']]
        for it in inst:
            w,h=pp[it['part']].size
            it['moving']=it['x']>=4 and it['y']>=4 and it['x']+w<=188 and it['y']+h<=188
        if sum(it['moving'] for it in inst)<3:continue
        ff=[rgba(render(pp,inst,f)) for f in range(4)];edges,removed=edges_from(ff[0])
        if matching_edges(ff,edges):break
    else:raise RuntimeError('No matching continuous origin within eight pixels')
    frames={'fog':ff,'heat_wave':[Image.open(OUT/f'heat_wave-f{f}.png').convert('RGBA') for f in range(4)]}
    preview('mix',ff[0]);old=Image.open(R/'r16-B-redraw2-original-fog-f0.png').convert('RGBA')
    comp=Image.new('RGB',(1152,1200),(28,32,38));d=ImageDraw.Draw(comp)
    for row,name in enumerate(['fantasy-grass','wasteland']):
        bg=repeat(Image.open(REF/f'ref-{name}.png'),(576,576))
        for col,(label,field) in enumerate([('Before',old),('Redraw',ff[0])]):
            comp.paste(composite(bg,repeat(field,(576,576))),(col*576,row*600+24))
            d.text((col*576+8,row*600+7),f'{label} / {name} / literal 3x3 at 1x',fill='white')
    comp.save(R/'r16-B-redraw2-comparison.png')
    for f,im in enumerate(ff):im.save(OUT/f'fog-f{f}.png')
    for k,im in edges.items():im.save(OUT/f'fog-edge-{k}.png')
    measurements=dict(repair='critic-r16B-2 redraw',source_method='Three large built-in image-tool drawings on magenta; BOX registration at 8x; source-calibrated palette lock; exact all-64-sample mode; native component and one-pixel contour cleanup; place and wrap drawings.',selection='Ten distinct broad donors from alternatives B and C; no donor repeated within tile. A rejected for 59.7% cover and a dominant continuous band. B alone has stronger corner highlights; C alone repeats donors. Mixed composition selected over grass and water.',instances=inst,palettes={'fog':PAL[1:]},alphas={'fog':ALPHA},motion_cycle=MOTION,edge_cleanup_removed=removed,files={},motion={},drawings=drawings,tile_origin_shift=[sx,sy],part_order=[f'{v}-{i}' for v in 'bc' for i in range(6)])
    for family,images in frames.items():
        for f,im in enumerate(images):measurements['files'][f'{family}-f{f}.png']=stats(im)
        steps=[]
        for f in range(4):
            hist=ImageChops.difference(images[f].getchannel('A'),images[(f+1)%4].getchannel('A')).histogram()
            steps.append(dict(from_frame=f,to_frame=(f+1)%4,changed_pixels=36864-hist[0],alpha_mean_absolute_delta=sum(i*n for i,n in enumerate(hist))/36864))
        measurements['motion'][family]=steps
    for k,im in edges.items():measurements['files'][f'fog-edge-{k}.png']=stats(im)
    (R/'r16-B-measurements.json').write_text(json.dumps(measurements,indent=2)+'\n')
    reviews(frames,edges)
    detail=composite(Image.new('RGB',(192,192),(28,32,38)),ff[0]);sheet(detail,'fog-f0 actual alpha on neutral').save(R/'r16-B-redraw2-native-detail.png')
    print(json.dumps({'origin_shift':[sx,sy],'moving_banks':sum(it['moving'] for it in inst),'files':measurements['files'],'motion':measurements['motion']},indent=2))

if __name__=='__main__':
    if '--final' in sys.argv:finalize()
    else:prepare()
