"""Register image-tool drawings; palette lock, 64-vote mode, native cleanup.

All contours and material shapes originate in the paintings. Native cropping,
course transfer, masking, palette substitution and composition only.
"""
from pathlib import Path
from collections import Counter
import importlib.util, json, hashlib
from PIL import Image, ImageDraw
R=Path(__file__).resolve().parent; O=R.parent/'out/city17'
sp=importlib.util.spec_from_file_location('prior',R/'r17-D-process.py')
prior=importlib.util.module_from_spec(sp);sp.loader.exec_module(prior)
RED=[(54,40,34),(87,55,45),(111,65,49),(137,79,58),(156,95,68),(179,115,78)]
STONE=[(43,40,29),(77,72,60),(105,100,85),(130,123,105),(155,146,125),(178,169,145),(197,188,165)]
FLOOR=[prior.BASE[i] for i in [0,1,2,3,7,8,9,10,11,12,13,15,16,17,18,22,23,24,25,26]]+prior.CLOTH+[(114,48,44)]
NN=Image.Resampling.NEAREST

def key(im):
    im=im.convert('RGBA')
    im.putdata([(0,0,0,0) if r>65 and b>65 and g<min(r,b)*.52 and .55<r/b<1.8 else (r,g,b,255) for r,g,b,a in im.get_flattened_data()])
    return im

def register(rec,ident=None,box=None,size=None,rows=False,palette=None):
    ident=ident or rec['id'];w,h=size or rec['size']
    src=key(Image.open(R/rec['source']));bounds=box or src.getbbox();src=src.crop(bounds)
    if ident.startswith('gate-portal'):
        reg=Image.new('RGBA',(w*8,h*8))
        cuts=[0,338,1166,src.width];dest=[0,24,120,144]
        for xa,xb,da,db in zip(cuts,cuts[1:],dest,dest[1:]):reg.paste(src.crop((xa,0,xb,src.height)).resize(((db-da)*8,h*8),Image.Resampling.BOX),(da*8,0))
    elif ident.startswith('sign-'):
        reg=Image.new('RGBA',(w*8,h*8));reg.paste(src.resize((52*8,70*8),Image.Resampling.BOX),(6*8,8))
    elif rows:
        strips=[]
        for y in range(src.height):
            row=src.crop((0,y,src.width,y+1));bb=row.getbbox()
            if bb and bb[2]-bb[0]>=src.width*.88:strips.append(row.crop(bb).resize((w*8,1),Image.Resampling.BOX))
        reg=Image.new('RGBA',(w*8,len(strips)))
        for y,row in enumerate(strips):reg.paste(row,(0,y))
        reg=reg.resize((w*8,h*8),Image.Resampling.BOX)
    else:reg=src.resize((w*8,h*8),Image.Resampling.BOX)
    palette=palette or (RED+STONE[1:5] if ident=='roof-junction' else RED if ident.startswith('roof') else STONE if ident.startswith(('wall','gate-connector')) else FLOOR if ident.startswith(('ground','storey','shop','inn')) else prior.PAL)
    pal=Image.new('P',(1,1));pal.putpalette([c for rgb in palette+[palette[-1]]*(256-len(palette)) for c in rgb])
    rgb=reg.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
    vals=[(*c,255) if a>=128 else (0,0,0,0) for c,a in zip(rgb.get_flattened_data(),reg.getchannel('A').get_flattened_data())]
    reg.putdata(vals);raw=[];sw=w*8
    for y in range(h):
        for x in range(w):
            votes=Counter(v for yy in range(8) for v in vals[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8])
            raw.append(min(votes,key=lambda c:(-votes[c],c)))
    clean=prior.clean_pixels(raw,w,h)
    im=Image.new('RGBA',(w,h));im.putdata(clean)
    if ident.startswith(('ground','storey','inn-front','return-','shop-')):
        donor=Image.open(O/'ground-shop-w2-c0.png').convert('RGBA')
        for yy in (0,47):im.paste(donor.crop((0,yy,w,yy+1)),(0,yy))
    im.putdata([p if p[3] else (0,0,0,0) for p in im.get_flattened_data()])
    mode=Image.new('RGBA',(w,h));mode.putdata(raw)
    for name,a in [('registered',reg),('mode',mode),('clean',im)]:a.save(R/f'r17-C5-{name}-{ident}.png')
    return im,dict(id=ident,source=rec['source'],bounds=list(bounds),size=[w,h],row_registration=rows,palette=palette,mode_blocks=w*h,samples_per_pixel=64,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,im.get_flattened_data())) if a!=b])

def run():
    recs=json.loads((R/'r17-C5-generation.json').read_text()); drawings={}; logs=[]; exports={}; native=[]
    def read(n):return exports[n].copy() if n in exports else Image.open(O/(n+'.png')).convert('RGBA')
    def put(n,a,**kw):exports[n]=a;native.append(dict(output=n,**kw))
    for rec in recs:
        n=rec['id']; flat=n.startswith(('floor','shop','inn','sign-bay','wall-curtain','party-return','square-slabs'))
        pal=RED if n.startswith('roof') else STONE if n.startswith(('wall','party')) else FLOOR if n.startswith(('floor','shop','inn','sign-bay')) else prior.PAL
        if n=='square-slabs':pal=[(156,155,141),(160,159,145),(165,164,150),(170,169,155),(174,173,159)]
        a,log=register(rec,'c5-'+n,rows=flat,palette=pal);drawings[n]=a;logs.append(log)
        if n.startswith(('floor','shop','inn','sign-bay')):
            donor=read('ground-shop-w2-c0')
            for y in (0,47):a.paste(donor.crop((0,y,a.width,y+1)),(0,y))
        # Rejected candidates remain review-only, never resolve as production aliases.
        if n in ('roof-gable-a','inn-a','roof-valley-a','court-closure-b'):continue
        names={'roof-gable-b':'roof-gable-c5-w2','roof-hip':'roof-hip-c5-w2','roof-cross-a':'roof-cross-c5-w3','roof-cross-b':'roof-hip-cross-c5-w3','roof-narrow':'roof-gable-c5-w1','inn-b':'inn-front-c5-w2','square-slabs':'square-slabs-c5','sign-bay':'storey-sign-bay-c5-w2'}
        names['court-closure-a']='court-closure-c5'
        out=names.get(n,n+'-c5'+('-w2' if n.startswith('floor') else '-w1' if n.startswith('shop') else ''))
        put(out,a,drawing=n)
    for family in ('cross','hip-cross'):
        a=read('roof-'+family+'-c5-w3'); b=Image.new('RGBA',(96,96));b.paste(a.crop((0,0,48,96)),(0,0));b.paste(a.crop((96,0,144,96)),(48,0))
        put('roof-'+family+'-c5-w2',b,donor='roof-'+family+'-c5-w3',operation='remove central native48px bay; preserve hip ends and tile scale')
    # Deep caps retain all native tile courses; shallow caps omit a middle48px course range.
    for family in ('gable','hip'):
        a=read('roof-'+family+'-c5-w2');b=Image.new('RGBA',(96,96));b.paste(a.crop((0,0,96,48)),(0,0));b.paste(a.crop((0,96,96,144)),(0,48));put('roof-'+family+'-d2-c5-w2',b,donor='roof-'+family+'-c5-w2',operation='native middle-course removal, no texture rescale')
    a=read('roof-gable-c5-w1');b=Image.new('RGBA',(48,144));b.paste(a.crop((0,0,48,48)),(0,0));b.paste(a.crop((0,24,48,72)),(0,48));b.paste(a.crop((0,48,48,96)),(0,96));put('roof-gable-d3-c5-w1',b,donor='roof-gable-c5-w1',operation='native48px slope/ridge period insertion; no resampling')
    # Directional fills, ridge and valley/hip attachments are native paint from complete volumes.
    for name,donor,box in [('roof-fill-left','roof-gable-c5-w2',(0,48,48,96)),('roof-fill-right','roof-gable-c5-w2',(48,48,96,96)),('roof-ridge','roof-gable-c5-w2',(24,48,72,96)),('roof-hip-end','roof-hip-c5-w2',(0,96,48,144)),('roof-valley','roof-hip-c5-w2',(48,96,96,144))]:put(name+'-c5',read(donor).crop(box),donor=donor,crop=box)
    for n in ('floor-a','floor-b','floor-c'):
        a=read(n+'-c5-w2')
        for side,x in [('left',0),('right',48)]:put(n+'-'+side+'-c5-w1',a.crop((x,0,x+48,48)),donor=n+'-c5-w2',crop=[x,0,x+48,48])
    # Sign niche partners use the same lit drawing, swapping whole bays without mirroring light.
    a=read('storey-sign-bay-c5-w2');b=Image.new('RGBA',a.size);b.paste(a.crop((48,0,96,48)),(0,0));b.paste(a.crop((0,0,48,48)),(48,0));put('storey-sign-bay-right-c5-w2',b,donor='storey-sign-bay-c5-w2',operation='swap complete48px bays; no mirrored light')
    for j,donor in enumerate(['floor-a-c5-w2','floor-b-c5-w2','floor-c-c5-w2','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-arrangement-c-c4-w2']):
        b=a.copy();b.paste(read(donor).crop((48,0,96,48)),(48,0));put('storey-sign-bay-v'+str(j)+'-c5-w2',b,donors=['storey-sign-bay-c5-w2',donor],operation='native exposed window bay substitution; sign niche unchanged')
    put('roof-valley-c5',read('roof-valley-b-c5').crop((0,0,48,48)),donor='roof-valley-b-c5',crop=[0,0,48,48])
    for name in ('apothecary','cobbler','tailor'):
        a=read('shop-'+name+'-c5-w1');b=Image.new('RGBA',(96,48));b.paste(a,(0,0));b.paste(read('ground-door-v1-w1-c0'),(48,0));put('ground-'+name+'-c5-w2',b,donors=['shop-'+name+'-c5-w1','ground-door-v1-w1-c0'])
    # A full144px party face is cropped once, not restarted at every storey.
    a=read('party-return-c5')
    for side,x in [('left',0),('right',40)]:put('party-'+side+'-c5',a.crop((x,0,x+8,144)),donor='party-return-c5',crop=[x,0,x+8,144])
    # Shared parapet endpoints and masonry native crops form shoulders and connectors.
    a=read('wall-curtain-c5');b=read('wall-curtain-b-c5')
    for x in (0,94):b.paste(a.crop((x,0,x+2,144)),(x,0))
    put('wall-curtain-b-c5',b,donor='wall-curtain-b',edge_donor='wall-curtain-c5')
    c=a.copy();c.paste(b.crop((16,0,80,144)),(16,0));put('wall-curtain-c-c5',c,donors=['wall-curtain-c5','wall-curtain-b-c5'],operation='common endpoints; distinct drawn corbels, crenels and slit face')
    for name,box in [('wall-shoulder',(0,0,48,48)),('gate-connector',(48,0,96,48))]:put(name+'-c5',a.crop(box),donor='wall-curtain-c5',crop=box)
    for letter,donor in zip('abc',['wall-curtain-c5','wall-curtain-b-c5','wall-curtain-c-c5']):put('wall-top-'+letter+'-c5',read(donor).crop((0,0,96,48)),donor=donor,crop=[0,0,96,48])
    # Hall roof is widened by one complete48px tile bay; its original supports remain.
    a=read('roof-cross-c5-w3');roof=Image.new('RGBA',(192,96));roof.paste(a.crop((0,0,72,96)),(0,0));roof.paste(a.crop((24,0,72,96)),(72,0));roof.paste(a.crop((72,0,144,96)),(120,0));hall=read('townhall-market-r');hall.paste((0,0,0,0),(0,0,192,96));hall.alpha_composite(roof);put('townhall-market-c5',hall,donors=['roof-cross-c5-w3','townhall-market-r'],operation='native roof bay insertion; original support row')
    a=read('washing-line');b=Image.new('RGBA',(48,32));b.paste(a.crop((0,0,24,32)),(0,0));b.paste(a.crop((72,0,96,32)),(24,0));put('washing-short-c5',b,donor='washing-line',operation='native end sections joined; shorten suspended span without resampling')
    # All colourways share alpha exactly and keep native material scale.
    ramps={'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]}
    for n,a in list(exports.items()):
        if n.startswith('roof-'):
            for tone,ramp in ramps.items():
                mapping=dict(zip(RED,ramp));b=a.copy();b.putdata([(*mapping.get(p[:3],p[:3]),p[3]) for p in b.get_flattened_data()]);put(n+'-'+tone,b,donor=n,operation='palette only')
    # Reduce perimeter highlights, preserving all tower apertures and connection profiles.
    for v in 'abc':
        n='wall-tower-'+v+'-c4';a=read(n);a.putdata([tuple(round(c*.78+23) for c in p[:3])+(p[3],) if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);put('wall-tower-'+v+'-c5',a,donor=n,operation='restrained stone value remap; silhouette invariant')
    # Square wrapping uses painted half-periods, never synthetic stone shapes.
    a=read('square-slabs-c5');a=a.crop((0,0,96,96));put('square-slabs-c5',a,donor='square-slabs',operation='registered painted period')
    files={}
    for n,a in exports.items():
        if n.startswith(('ground-','storey-','floor-','inn-front-c5','shop-')):
            donor=read('ground-shop-w2-c0');x=48 if '-right-c5-w1' in n else 0
            for y in (0,47):a.paste(donor.crop((x,y,x+a.width,y+1)),(0,y))
        a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);p=O/(n+'.png');a.save(p);v=list(a.get_flattened_data());files[n]=dict(size=list(a.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),colours=len(set(p[:3] for p in v if p[3])),alpha=sorted(set(p[3] for p in v)),hidden_rgb=sum(any(p[:3]) for p in v if not p[3]))
    (R/'r17-C5-files.json').write_text(json.dumps(files,indent=2));(R/'r17-C5-processing.json').write_text(json.dumps(dict(drawings=logs,native=native,final_courses='All exported ground/storey/floor/inn-front/shop modules receive the original native rows0 and47 after composition; right48px halves use donor x48.',selected={'long_roof':'B; A tiles oversized','cross_roof':'A and B are distinct complete volumes','inn':'B; dominant western room door','court':'A; compact frontal stair and woodpile; B has unnecessary blank side plane'}),indent=2))
    print(len(recs),'drawings;',len(exports),'exports;',sum(x['mode_blocks']*64 for x in logs),'mode samples')

if __name__=='__main__':run()
