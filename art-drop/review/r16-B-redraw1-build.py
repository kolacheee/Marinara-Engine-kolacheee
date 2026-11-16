"""Critic-r16B-1: only register, mode-reduce, clean, place and wrap drawn fog."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, PngImagePlugin
from collections import Counter,deque
import json,hashlib,random,math,sys
R=Path(__file__).resolve().parent;ROOT=R.parent;OUT=ROOT/'out/weather16';REF=ROOT/'reference/r16'
NN=Image.Resampling.NEAREST
PAL=[(0,0,0),(173,191,197),(200,214,216),(225,232,230),(241,243,235)]
ALPHA=[0,24,48,80,112]
SIZES=[(60,32),(48,32),(72,28),(40,32),(64,30),(56,27),(68,34),(44,30),(58,35),(52,25),(70,32),(46,34)]
MOTION=[(0,0),(1,0),(1,1),(0,1)]

def rgba(ids,weather=True):
    a=[(*c,ALPHA[i] if weather else (255 if i else 0)) for i,c in enumerate(PAL)]
    out=Image.new('RGBA',ids.size);out.putdata([a[i] for i in ids.getdata()]);return out

def ids_from(im):
    lookup={(*c,255 if i else 0):i for i,c in enumerate(PAL)}
    ids=Image.new('L',im.size);ids.putdata([lookup[p] for p in im.getdata()]);return ids

def components(ids,minimum=3,wrap=False):
    w,h=ids.size;data=list(ids.getdata());left={i for i,p in enumerate(data) if p};removed=[];sizes=[]
    while left:
        first=left.pop();todo=[first];group=[first]
        while todo:
            i=todo.pop();x=i%w;y=i//w
            for dy in (-1,0,1):
                for dx in (-1,0,1):
                    xx=x+dx;yy=y+dy
                    if wrap:xx%=w;yy%=h
                    if 0<=xx<w and 0<=yy<h:
                        j=yy*w+xx
                        if j in left:left.remove(j);todo.append(j);group.append(j)
        sizes.append(len(group))
        if len(group)<minimum:removed+=group
    for i in removed:data[i]=0
    result=Image.new('L',ids.size);result.putdata(data)
    return result,removed,sizes

def reduce(var,index):
    path=R/f'r16-B-source-redraw1-fog-{var}.png';raw=Image.open(path).convert('RGB')
    ww,hh=raw.size;cx=index%3;cy=index//3
    cell=(round(cx*ww/3),round(cy*hh/4),round((cx+1)*ww/3),round((cy+1)*hh/4))
    im=raw.crop(cell);a=[]
    for r,g,bl in im.getdata():a.append((0,0,0,0) if r>g+55 and bl>g+55 and r>135 and bl>135 else (r,g,bl,255))
    keyed=Image.new('RGBA',im.size);keyed.putdata(a);box=keyed.getbbox();keyed=keyed.crop(box)
    w,h=SIZES[index];reg=keyed.resize((w*8,h*8),Image.Resampling.BOX)
    lookup={};ids=[]
    for p in reg.getdata():
        if p not in lookup:
            lookup[p]=0 if p[3]<128 else min(range(1,5),key=lambda j:sum((p[c]-PAL[j][c])**2 for c in range(3)))
        ids.append(lookup[p])
    locked=Image.new('L',reg.size);locked.putdata(ids)
    native=[];rw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(ids[(y*8+sy)*rw+x*8+sx] for sy in range(8) for sx in range(8))
            native.append(min(votes,key=lambda i:(-votes[i],i)))
    mode=Image.new('L',(w,h));mode.putdata(native);clean,removed,_=components(mode)
    pixels=list(clean.getdata());contour=pixels.copy();changed=[]
    for i,p in enumerate(pixels):
        x=i%w;y=i//w
        if p and (x==0 or y==0 or x==w-1 or y==h-1 or not all(pixels[j] for j in (i-1,i+1,i-w,i+w))):
            if p!=1:changed.append(i)
            contour[i]=1
    final=Image.new('L',(w,h));final.putdata(contour)
    for stage,a in [('registered',locked),('mode',mode),('clean',clean),('contour',final)]:
        rgba(a,False).save(R/f'r16-B-{stage}-redraw1-fog-{var}-{index}.png')
    return final,dict(source=path.name,cell=cell,crop=box,native=[w,h],removed=removed,contour_recolours=changed)

def stamp(canvas,part,x,y,wrap=True):
    w,h=canvas.size;pw,ph=part.size
    if wrap:
        x%=w;y%=h
        for xx in (x,x-w):
            for yy in (y,y-h):stamp(canvas,part,xx,yy,False)
    else:
        left=max(x,0);top=max(y,0);right=min(x+pw,w);bottom=min(y+ph,h)
        if left>=right or top>=bottom:return
        box=(left,top,right,bottom)
        patch=part.crop((left-x,top-y,right-x,bottom-y))
        canvas.paste(ImageChops.lighter(canvas.crop(box),patch),box)

def render(parts,instances,f,extent=192,unwrapped=False):
    out=Image.new('L',(extent,extent))
    for it in instances:
        dx,dy=MOTION[(f+it['phase'])%4] if it['moving'] else (0,0)
        x=it['x']+dx;y=it['y']+dy
        if unwrapped:
            for ox in range(-192,extent+192,192):
                for oy in range(-192,extent+192,192):stamp(out,parts[it['part']],x+ox,y+oy,False)
        else:stamp(out,parts[it['part']],x,y)
    return out

def stats(im):
    hist=im.getchannel('A').histogram();n=im.width*im.height
    return dict(size=list(im.size),covered_pixels=n-hist[0],cover_percent=round((n-hist[0])/n*100,4),weighted_cover_percent=round(sum(i*v for i,v in enumerate(hist))/(255*n)*100,4),alpha_levels=[i for i,v in enumerate(hist) if v])

def repeat(im,size):
    out=Image.new(im.mode,size)
    for y in range(0,size[1],im.height):
        for x in range(0,size[0],im.width):out.paste(im,(x,y))
    return out

def composite(bg,over):return Image.alpha_composite(bg.convert('RGBA'),over).convert('RGB')

def assess(ids):
    # Position selection only; all pixel samples are retained from drawings.
    h=ids.histogram();cover=1-h[0]/36864
    if not .40<=cover<=.50:return 100+abs(cover-.45)*100
    rows=[0.]*192;cols=[0.]*192;diag=[0.]*192;anti=[0.]*192
    for i,p in enumerate(ids.getdata()):
        x=i%192;y=i//192;a=ALPHA[p]/192
        rows[y]+=a;cols[x]+=a;diag[(x+y)%192]+=a;anti[(x-y)%192]+=a
    score=0
    for values in (rows,cols,diag,anti):
        wide=[sum(values[(j+k)%192] for k in range(24))/24 for j in range(192)]
        avg=sum(wide)/192;score+=(sum((v-avg)**2 for v in wide)/192)**.5
    return score+abs(cover-.45)*30

def candidate(parts,seed,count=25):
    rng=random.Random(seed);order=list(range(len(parts)));rng.shuffle(order)
    while len(order)<count:
        more=list(range(len(parts)));rng.shuffle(more);order+=more
    inst=[]
    for j,p in enumerate(order[:count]):
        w,h=parts[p].size;x=rng.randrange(192);y=rng.randrange(192)
        moving=x>=4 and y>=4 and x+w<=188 and y+h<=188
        inst.append(dict(part=p,x=x,y=y,moving=moving,phase=j%4))
    return inst

def previews(parts,records):
    refs={n:Image.open(REF/f'ref-{n}.png').convert('RGB') for n in ['fantasy-grass','desert-sand','fantasy-town']}
    families={v:parts[v] for v in 'abc'};families['mix']=[p for v in 'abc' for p in parts[v]];results={}
    for vi,(var,pp) in enumerate(families.items()):
        best=(float('inf'),None,None)
        for j in range(180):
            inst=candidate(pp,160010+vi*10000+j,25);a=render(pp,inst,0);score=assess(a)
            if score<best[0]:best=(score,inst,a)
        score,inst,a=best
        if var=='mix':
            # Choose a nearby torus origin whose edge slices do not cut a bank
            # into one/two-pixel fragments at the inner cap joins.
            inst=[dict(it,x=(it['x']-4)%192,y=(it['y']-4)%192) for it in inst]
            for it in inst:
                w,h=pp[it['part']].size
                it['moving']=it['x']>=4 and it['y']>=4 and it['x']+w<=188 and it['y']+h<=188
            a=render(pp,inst,0)
        results[var]=dict(score=score,instances=inst,stats=stats(rgba(a)),tile_origin_shift=[-4,-4] if var=='mix' else [0,0])
        canvas=Image.new('RGB',(576*3,600),(28,32,38));d=ImageDraw.Draw(canvas)
        for j,(name,ref) in enumerate(refs.items()):
            im=composite(repeat(ref,(576,576)),repeat(rgba(a),(576,576)))
            canvas.paste(im,(576*j,24));d.text((576*j+8,7),f'{var} / {name} / 3x3 native / cover {stats(rgba(a))["cover_percent"]}%',fill='white')
        canvas.save(R/f'r16-B-redraw1-candidate-{var}.png')
        print(var,results[var]['stats'],flush=True)
    (R/'r16-B-redraw1-candidates.json').write_text(json.dumps(results,indent=2)+'\n')
    donor=Image.new('RGB',(1020,520),(28,32,38));d=ImageDraw.Draw(donor)
    for vi,var in enumerate('abc'):
        d.text((vi*340+8,8),f'{var.upper()} / new native hard-alpha donors',fill='white')
        for i in range(12):
            im=rgba(parts[var][i],False);x=vi*340+10+(i%3)*110;y=38+(i//3)*118
            donor.paste(im,(x,y),im);d.text((x,y-12),str(i),fill='white')
    donor.save(R/'r16-B-redraw1-donors.png')
    (R/'r16-B-redraw1-drawings.json').write_text(json.dumps(records,indent=2)+'\n')

def main():
    parts={};records={}
    for var in 'abc':
        result=[reduce(var,i) for i in range(12)];parts[var]=[a for a,r in result];records[var]=[r for a,r in result]
    previews(parts,records)

if __name__=='__main__' and '--final' not in sys.argv:main()

def clean_rgba(im,wrap=False):
    mask=im.getchannel('A');_,removed,_=components(mask,3,wrap)
    data=list(im.getdata())
    for i in removed:data[i]=(0,0,0,0)
    out=Image.new('RGBA',im.size);out.putdata(data);return out,removed

def edges_from(field):
    crops={'n':(0,144,192,192),'s':(0,0,192,48),'e':(0,0,48,192),'w':(144,0,192,192)}
    edges={};removed={}
    for k,box in crops.items():
        cap=Image.open(R/f'r16-B-cap-{k}.png').convert('L');im=field.crop(box)
        pixels=[(*p[:3],min(p[3],v)) if p[3] and v else (0,0,0,0) for p,v in zip(im.getdata(),cap.getdata())]
        im.putdata(pixels);edges[k],removed[k]=clean_rgba(im,True)
    return edges,removed

def area_overlay(frame,edges):
    out=Image.new('RGBA',(576,576));out.paste(repeat(frame,(384,384)),(96,96))
    for z in (96,288):
        out.paste(edges['n'],(z,48));out.paste(edges['s'],(z,480))
        out.paste(edges['w'],(48,z));out.paste(edges['e'],(480,z))
    for sy,ys in [('n',48),('s',480)]:
        for sx,xs in [('w',48),('e',480)]:
            corner=Image.new('RGBA',(48,48));data=[]
            for yy in range(48):
                for xx in range(48):
                    fx=(xs+xx-96)%192;fy=(ys+yy-96)%192
                    p=edges[sy].getpixel((fx,yy));q=edges[sx].getpixel((xx,fy));aa=min(p[3],q[3])
                    data.append((*p[:3],aa) if aa else (0,0,0,0))
            corner.putdata(data);out.paste(corner,(xs,ys))
    return clean_rgba(out)[0]

def sheet(im,label):
    w,h=im.size;out=Image.new('RGB',(w*5+48,h*4+48),(28,32,38));d=ImageDraw.Draw(out)
    d.text((12,8),label+' | native 1x + exact nearest-neighbour 4x',fill='white')
    out.paste(im,(12,32));out.paste(im.resize((w*4,h*4),NN),(w+28,32));return out

def gif(images,path):
    pal=images[0].quantize(256,method=Image.Quantize.MEDIANCUT)
    frames=[im.quantize(palette=pal,dither=Image.Dither.NONE) for im in images]
    frames[0].save(path,save_all=True,append_images=frames[1:],duration=360,loop=0,disposal=2,optimize=False)

def gif_panels(ff,family,refs):
    images=[]
    for f,a in enumerate(ff):
        im=Image.new('RGB',(1152,624),(28,32,38));d=ImageDraw.Draw(im)
        for j,(name,ref) in enumerate(refs.items()):
            x=j%4*288;y=j//4*312
            im.paste(composite(ref,repeat(a,(288,288))),(x,y+24));d.text((x+5,y+6),name,fill='white')
        d.text((876,362),f'{family} / f{f}\n4 frames, 360 ms each\nActual PNG states\n192 px spatial period',fill='white');images.append(im)
    return images

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
        strip.save(R/f'r16-B-filmstrip-{family}.png');gif(gif_panels(ff,family,refs),R/f'r16-B-{family}.gif')
    for k,edge in edges.items():
        im=composite(refs['fantasy-grass'].crop((0,0,edge.width,edge.height)),edge)
        sheet(im,f'fog-edge-{k}.png').save(R/f'r16-B-file-fog-edge-{k}.png')
    for name,ref in refs.items():
        im=composite(repeat(ref,(576,576)),area_overlay(frames['fog'][0],edges))
        for scale in (1,4):im.resize((576*scale,576*scale),NN).save(R/f'r16-B-fog-area-{name}-{scale}x.png')
    gif([composite(repeat(refs['fantasy-town'],(576,576)),area_overlay(f,edges)) for f in frames['fog']],R/'r16-B-fog-area.gif')
    # Updated selection and placement review replace obsolete chosen-atlas claims.
    Image.open(R/'r16-B-redraw1-donors.png').save(R/'r16-B-selection.png')
    Image.open(R/'r16-B-redraw1-candidate-mix.png').save(R/'r16-B-placement-review.png')
    html='''<!doctype html><meta charset="utf-8"><title>Round 16 B — fog redraw</title>
<style>body{background:#1c2026;color:#eee;font:16px system-ui;margin:24px}img{image-rendering:pixelated;max-width:100%}a{color:#ace}section{margin:24px 0}</style>
<h1>Round 16 — Part B: critic-r16B-1 redraw</h1><p>25 distinct image-drawn banks replace the hooked crests and lower comb. Four matching edges rebuilt from the unchanged drawn feather masks. Heat-wave PNGs preserved.</p>
<p>Native PNGs are authoritative. GIFs have a shared 256-colour review palette. Four phases at 360 ms each.</p>
<section><h2>Fog loop</h2><img src="r16-B-fog.gif"></section>
<section><h2>Fog area and feathered edges</h2><img src="r16-B-fog-area.gif"></section>
<section><h2>Unchanged heat-wave loop</h2><img src="r16-B-heat_wave.gif"></section>
<section><h2>Before and after, native 3×3 fields</h2><img src="r16-B-redraw1-comparison.png"></section>
<section><h2>Three drawing alternatives</h2><img src="r16-B-selection.png"></section>
<p><a href="r16-B-redraw1-validation.json">Validation</a> · <a href="r16-B-redraw1-generation.json">Drawing prompts</a> · <a href="r16-B-measurements.json">Cover and motion</a></p>'''
    for family in ['fog','heat_wave']:
        html+=f'<h2>{family}: all phases, all references, native / 3× / 4×</h2>'
        for name in refs:
            html+=f'<p>{name}: '
            for f in range(4):
                html+=' '.join(f'<a href="r16-B-repeat-{family}-f{f}-{name}-{scale}x.png">f{f} {scale}×</a>' for scale in (1,3,4))+' · '
            html+='</p>'
    (R/'r16-B-review.html').write_text(html)

def finalize():
    old=Image.open(OUT/'fog-f0.png').convert('RGBA')
    # Preserve old f0 once for the before/after evidence and reruns.
    before=R/'r16-B-redraw1-original-fog-f0.png'
    if not before.exists():old.save(before)
    old=Image.open(before)
    pp=[ids_from(Image.open(R/f'r16-B-contour-redraw1-fog-{v}-{i}.png').convert('RGBA')) for v in 'abc' for i in range(12)]
    chosen=json.loads((R/'r16-B-redraw1-candidates.json').read_text())['mix']
    ff=[rgba(render(pp,chosen['instances'],f)) for f in range(4)]
    edges,removed=edges_from(ff[0])
    frames={'fog':ff,'heat_wave':[Image.open(OUT/f'heat_wave-f{f}.png').convert('RGBA') for f in range(4)]}
    candidate_sheet=Image.new('RGB',(1728,600),(28,32,38));cd=ImageDraw.Draw(candidate_sheet)
    for j,name in enumerate(['fantasy-grass','desert-sand','fantasy-town']):
        ref=Image.open(REF/f'ref-{name}.png')
        candidate_sheet.paste(composite(repeat(ref,(576,576)),repeat(ff[0],(576,576))),(j*576,24))
        cd.text((j*576+8,7),f'mix / {name} / 3x3 native / cover {stats(ff[0])["cover_percent"]}%',fill='white')
    candidate_sheet.save(R/'r16-B-redraw1-candidate-mix.png')
    # Compare on both land and water at literal native scale.
    comp=Image.new('RGB',(1152,1200),(28,32,38));d=ImageDraw.Draw(comp)
    for row,name in enumerate(['fantasy-grass','fantasy-town']):
        bg=repeat(Image.open(REF/f'ref-{name}.png'),(576,576))
        for col,(label,field) in enumerate([('Before',old),('Redraw',ff[0])]):
            comp.paste(composite(bg,repeat(field,(576,576))),(col*576,row*600+24))
            d.text((col*576+8,row*600+7),f'{label} / {name} / literal 3x3 at 1x',fill='white')
    comp.save(R/'r16-B-redraw1-comparison.png')
    for f,im in enumerate(ff):im.save(OUT/f'fog-f{f}.png')
    for k,im in edges.items():im.save(OUT/f'fog-edge-{k}.png')
    measurements=dict(repair='critic-r16B-1 redraw',source_method='3 large built-in image-tool atlases on magenta; BOX register 8x, four-colour lock, exact all-64-sample mode, native cleanup; place and wrap drawn pixels',selection='25 distinct donors from all three alternatives',instances=chosen['instances'],palettes={'fog':PAL[1:]},alphas={'fog':ALPHA},motion_cycle=MOTION,edge_cleanup_removed=removed,files={},motion={},drawings=json.loads((R/'r16-B-redraw1-drawings.json').read_text()))
    measurements['tile_origin_shift']=chosen.get('tile_origin_shift',[-4,-4])
    for family,images in frames.items():
        for f,im in enumerate(images):measurements['files'][f'{family}-f{f}.png']=stats(im)
        steps=[]
        for f in range(4):
            delta=ImageChops.difference(images[f].getchannel('A'),images[(f+1)%4].getchannel('A'));hist=delta.histogram()
            steps.append(dict(from_frame=f,to_frame=(f+1)%4,changed_pixels=36864-hist[0],alpha_mean_absolute_delta=sum(i*n for i,n in enumerate(hist))/36864))
        measurements['motion'][family]=steps
    for k,im in edges.items():measurements['files'][f'fog-edge-{k}.png']=stats(im)
    (R/'r16-B-measurements.json').write_text(json.dumps(measurements,indent=2)+'\n')
    reviews(frames,edges)
    print(json.dumps({'files':measurements['files'],'motion':measurements['motion']},indent=2))

if __name__=='__main__' and '--final' in sys.argv:finalize()
