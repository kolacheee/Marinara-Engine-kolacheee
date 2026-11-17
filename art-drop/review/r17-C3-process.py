"""C3: register drawings, exact 8x8 RGBA mode, palette lock and cleanup.

All geometry is image-tool paint. Native transfers only join/crop that paint.
"""
from pathlib import Path
from collections import Counter
import hashlib, importlib.util, json
from PIL import Image

R=Path(__file__).resolve().parent
O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('old',R/'r17-D-process.py')
old=importlib.util.module_from_spec(sp);sp.loader.exec_module(old)
NN=Image.Resampling.NEAREST
PAVE=[(117,120,108),(123,126,113),(129,132,119),(136,139,125),(143,146,132),(150,153,139)]
SELECT={'cobble-b':'cobble-c3','hip-b':'roof-hip-deep-c3-w2','lamp':'lamp-c3','planter-tree':'planter-tree-c3','stable':'stable-c3','ditch':'ditch-c3','street-edge':'street-edge-c3','puddle':'puddle-c3'}
SELECT.update({'shop-'+n:'ground-'+n+'-c3-w2' for n in ['baker','smith','apothecary','cloth','potter']})
SELECT['gate-paving-b']='gate-paving-c3'

def register(rec):
    name=rec['id'];w,h=rec['size'];src=Image.open(R/rec['source']).convert('RGBA')
    src.putdata([(0,0,0,0) if r>170 and b>170 and g<125 and r>g*1.8 and b>g*1.8 else (r,g,b,255) for r,g,b,a in src.get_flattened_data()])
    bounds=src.getbbox();crop=src.crop(bounds);row_reg=name.startswith(('shop-','hip-','cobble-')) or name=='ditch'
    if row_reg:
        rows=[]
        for y in range(crop.height):
            row=crop.crop((0,y,crop.width,y+1));bb=row.getbbox()
            if bb and bb[2]-bb[0]>=crop.width*.90:rows.append(row.crop(bb).resize((w*8,1),Image.Resampling.BOX))
        strip=Image.new('RGBA',(w*8,len(rows)))
        for y,row in enumerate(rows):strip.paste(row,(0,y))
        reg=strip.resize((w*8,h*8),Image.Resampling.BOX)
    elif name in ('lamp','planter-tree','stable','puddle'):
        reg=Image.new('RGBA',(w*8,h*8));scale=min((w-2)*8/crop.width,(h-2)*8/crop.height)
        cw,ch=round(crop.width*scale),round(crop.height*scale)
        reg.paste(crop.resize((cw,ch),Image.Resampling.BOX),((w*8-cw)//2,h*8-ch-8))
    else:reg=crop.resize((w*8,h*8),Image.Resampling.BOX)
    palette=old.PAL
    if name.startswith('hip-'):palette=sorted(set([old.BASE[0]]+old.RED+[(71,79,34),(105,120,48),(130,116,95)]))
    if name.startswith(('cobble-','gate-paving-')):
        # Register the drawn value clusters into the established quiet paving ramp.
        lum=list(reg.convert('L').get_flattened_data());ordered=sorted(lum);cuts=[ordered[int(len(ordered)*q)] for q in [.12,.28,.46,.68,.87]]
        palette=[tuple(v+7 for v in p) for p in PAVE] if name.startswith('gate-paving-') else PAVE
        rgb=Image.new('RGB',reg.size);rgb.putdata([palette[sum(v>=c for c in cuts)] for v in lum])
    else:
        if name in ('ditch','street-edge','puddle'):palette=sorted(set(PAVE+old.PAL+[(41,72,73),(56,88,87),(74,103,99),(84,98,105),(107,121,125)]))
        p=Image.new('P',(1,1));p.putpalette([v for c in palette+[palette[-1]]*(256-len(palette)) for v in c])
        rgb=reg.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*c,255) if a>=128 else (0,0,0,0) for c,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())]
    reg.putdata(vals);raw=[];sw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(c for yy in range(8) for c in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8])
            raw.append(min(votes,key=lambda c:(-votes[c],c)))
    ground=name.startswith(('cobble-','gate-paving-')) or name in ('ditch','street-edge','puddle')
    clean=raw[:] if ground else old.clean_pixels(raw,w,h)
    if ground:
        # Calm isolated palette flecks without outlining or rounding terrain.
        for _ in range(2):
            prev=clean[:]
            for y in range(1,h-1):
                for x in range(1,w-1):
                    q=prev[y*w+x];near=[prev[yy*w+xx] for yy in range(y-1,y+2) for xx in range(x-1,x+2) if (xx,yy)!=(x,y)]
                    if q[3] and all(v[3] for v in near) and q not in near:clean[y*w+x]=Counter(near).most_common(1)[0][0]
    im=Image.new('RGBA',(w,h));im.putdata(clean);transfers=[]
    if name.startswith('shop-'):
        donor=Image.open(O/'ground-shop-w2-c0.png').convert('RGBA')
        for y in (0,47):im.paste(donor.crop((0,y,w,y+1)),(0,y))
        transfers.append(dict(donor='ground-shop-w2-c0',rows=[0,47]))
    if name.startswith('hip-'):
        donor=Image.open(O/'roof-hip-w2-c0.png').convert('RGBA')
        im.paste(donor.crop((0,143,96,144)),(0,h-1));transfers.append(dict(donor='roof-hip-w2-c0',row=[143,h-1]))
    if name.startswith('cobble-') or name=='ditch':
        # Whole edge paint wraps; the shared boundary has matching source pixels.
        im.paste(im.crop((0,0,1,h)),(w-1,0))
        if name.startswith('cobble-'):im.paste(im.crop((0,0,w,1)),(0,h-1))
        transfers.append(dict(operation='wrap own edge paint',axes='xy' if name.startswith('cobble-') else 'x'))
    if name.startswith('gate-paving-'):
        im.paste(im.crop((0,0,w,1)),(0,h-1));transfers.append(dict(operation='wrap own end paint',axes='y'))
    im.putdata([c if c[3] else (0,0,0,0) for c in im.get_flattened_data()])
    mode=Image.new('RGBA',(w,h));mode.putdata(raw)
    for tag,pic in [('registered',reg),('mode',mode),('clean',im)]:pic.save(R/f'r17-C3-{tag}-{name}.png')
    if name in SELECT:im.save(O/(SELECT[name]+'.png'))
    edits=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,im.get_flattened_data())) if a!=b]
    return dict(id=name,size=[w,h],bounds=bounds,row_registration=row_reg,palette=palette,mode_blocks=w*h,samples_per_pixel=64,cleanup=edits,transfers=transfers,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest())

def native_variants():
    logs=[]
    # Roof details remain native drawings, never synthesised patches/noise.
    for donor,out,overlays in [
      ('roof-hip-deep-c3-w2','roof-hip-chimney-c3-w2',[('chimney-1-c0',10,24)]),
      ('roof-hip-deep-c3-w2','roof-hip-dormer-c3-w2',[('dormer-0-c0',36,92)]),
      ('roof-back-w2','roof-back-chimney-c3-w2',[('chimney-1-c0',12,20)]),
      ('roof-back-w1','roof-back-dormer-c3-w1',[('dormer-0-c0',8,28)]),
      ('roof-hip-w2-c0','roof-hip-short-chimney-c3-w2',[('chimney-1-c0',12,28)]),
      ('roof-ridge-w2-c0','roof-ridge-dormer-c3-w2',[('dormer-0-c0',38,24)])]:
        im=Image.open(O/(donor+'.png')).convert('RGBA')
        for n,x,y in overlays:im.alpha_composite(Image.open(O/(n+'.png')).convert('RGBA'),(x,y))
        im.save(O/(out+'.png'));logs.append(dict(output=out,donor=donor,overlays=overlays))
    # A paved lane uses the new field and the already drawn kerb/gutter strips.
    cob=Image.open(O/'cobble-c3.png').convert('RGBA')
    for name,w in [('street-main-c3',96),('street-side-c3',48),('lane-c3',24)]:
        tile=cob.crop((0,0,w,48));oldname=name.removesuffix('-c3');edge=Image.open(O/(oldname+'.png')).convert('RGBA');k=3 if w==24 else 4
        for x in (0,w-k):tile.paste(edge.crop((x,0,x+k,48)),(x,0))
        tile.save(O/(name+'.png'));logs.append(dict(output=name,donor='cobble-c3',kerbs=oldname,width=k))
    return logs

def run():
    recs=json.loads((R/'r17-C3-generation.json').read_text())
    logs=[register(r) for r in recs];native=native_variants()
    for r in recs:r['selected']=r['id'] in SELECT;r['output']=SELECT.get(r['id'])
    (R/'r17-C3-generation.json').write_text(json.dumps(recs,indent=2))
    (R/'r17-C3-processing.json').write_text(json.dumps(dict(drawings=logs,native=native),indent=2))
    files={}
    for n in list(SELECT.values())+[n['output'] for n in native]:
        p=O/(n+'.png');im=Image.open(p).convert('RGBA');v=list(im.get_flattened_data())
        files[n]=dict(size=list(im.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len(set(c[:3] for c in v if c[3])),alpha=sorted(set(c[3] for c in v)),hidden_rgb=sum(c[:3]!=(0,0,0) for c in v if not c[3]))
    (R/'r17-C3-files.json').write_text(json.dumps(files,indent=2))
    print('Drawings',len(logs),'exports',len(files),'mode samples',sum(r['mode_blocks']*64 for r in logs))

if __name__=='__main__':
    run()
    # Replay the current critic repair last; never restore four-cell caps.
    import runpy
    repair=R/'r17-C3-critic1-process.py'
    if repair.exists():runpy.run_path(str(repair),run_name='__main__')
