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
RED=[(54,40,34),(87,55,45),(111,65,49),(137,79,58),(156,95,68)]
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
    for name,a in [('registered',reg),('mode',mode),('clean',im)]:a.save(R/f'r17-C4-{name}-{ident}.png')
    return im,dict(id=ident,source=rec['source'],bounds=list(bounds),size=[w,h],row_registration=rows,palette=palette,mode_blocks=w*h,samples_per_pixel=64,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,im.get_flattened_data())) if a!=b])

def run():
    recs=json.loads((R/'r17-C4-generation.json').read_text());drawings={};logs=[];exports={};native=[]
    for rec in recs:
        ident=rec['id']
        if ident.startswith('house-'):
            boxes={'house-a':{'storey-recessed':(20,944,775,1302),'ground-baker':(20,1302,775,1782)},'house-b':{'storey-shuttered':(30,1064,767,1370),'ground-apothecary':(30,1370,767,1745)}}[ident]
            for name,box in boxes.items():
                a,log=register(rec,name,box,[96,48],True);drawings[name]=a;logs.append(log);exports[name+'-c4-w2']=a
            continue
        a,log=register(rec,rows=ident.startswith(('roof','shop','inn-front','wall-top','gate-connector')))
        drawings[ident]=a;logs.append(log)
        if ident in ('roof-hip-a','inn-front'):continue
        out={'shop-c':'ground-smith-c4-w2','roof-hip-b':'roof-hip-c4-w2','roof-w1':'roof-gable-c4-w1','roof-w3':'roof-ridge-c4-w3','roof-gable-w2':'roof-gable-c4-w2','inn-front-b':'inn-front-c4-w2'}.get(ident,ident+'-c4')
        exports[out]=a
    for w,x in [(1,48),(2,24)]:
        donor=exports['roof-ridge-c4-w3'];n='roof-ridge-c4-w'+str(w);a=donor.crop((x,0,x+w*48,96))
        a.paste(donor.crop((0,0,1,96)),(0,0));a.paste(donor.crop((143,0,144,96)),(w*48-1,0));exports[n]=a;native.append(dict(output=n,donor='roof-ridge-c4-w3',crop=[x,0,x+w*48,96],edge_transfer=True))
    for name,a in list(exports.items()):
        if name.startswith(('ground-','storey-')):
            # Whole architectural bay crops retain the native window/door size.
            for side,x in [('left',0),('right',48)]:
                n=name.replace('-w2','-'+side+'-w1');b=a.crop((x,0,x+48,48));exports[n]=b;native.append(dict(output=n,donor=name,crop=[x,0,x+48,48]))
    for name,a in list(exports.items()):
        if name.startswith('wall-top-'):
            # Same two native edge columns across A/B/C, one contour at joins.
            donor=exports['wall-top-a-c4']
            for x in (0,94):a.paste(donor.crop((x,0,x+2,48)),(x,0))
        if name.startswith('roof-'):
            # Red/slate/brown material partners preserve the painted silhouette.
            ramps={'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77)]}
            for tone,ramp in ramps.items():
                b=a.copy();mapping=dict(zip(RED,ramp));b.putdata([(*mapping.get(p[:3],p[:3]),p[3]) for p in b.get_flattened_data()]);exports[name+'-'+tone]=b;native.append(dict(output=name+'-'+tone,donor=name,operation='palette only, alpha unchanged'))
    native_exports(exports,native)
    files={}
    for name,a in exports.items():
        a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);path=O/(name+'.png');a.save(path);v=list(a.get_flattened_data())
        files[name]=dict(size=list(a.size),sha256=hashlib.sha256(path.read_bytes()).hexdigest(),colours=len(set(p[:3] for p in v if p[3])),alpha=sorted(set(p[3] for p in v)),hidden_rgb=sum(p[:3]!=(0,0,0) for p in v if not p[3]))
    (R/'r17-C4-files.json').write_text(json.dumps(files,indent=2));(R/'r17-C4-processing.json').write_text(json.dumps(dict(drawings=logs,native=native),indent=2))
    print('Drawings',len(recs),'registered components',len(logs),'exports',len(files),'mode samples',sum(p['mode_blocks']*64 for p in logs))

def native_exports(exports,native):
    def read(n):return exports[n].copy() if n in exports else Image.open(O/(n+'.png')).convert('RGBA')
    def put(n,a,**log):exports[n]=a;native.append(dict(output=n,**log))
    for v in 'abc':
        a=read('wall-walk-r');top=read('wall-top-'+v+'-c4');a.paste(top,(0,0))
        # Same approved quiet stone ramp on the retained masonry drawing.
        pal=Image.new('P',(1,1));pal.putpalette([c for rgb in STONE+[STONE[-1]]*(256-len(STONE)) for c in rgb]);alpha=a.getchannel('A');a=a.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGBA');a.putalpha(alpha)
        put('wall-walk-'+v+'-c4',a,donor='wall-walk-r',overlay='wall-top-'+v+'-c4')
    # Towers vary actual openings and coping, using only native masonry paint.
    for v in 'abc':
        a=read('wall-tower-r')
        if v=='b':
            patch=read('wall-top-a-c4').crop((32,24,64,48));a.paste(patch,(22,110))
            a.alpha_composite(read('district-rich-banner').crop((0,0,16,48)),(60,130))
        if v=='c':
            patch=read('wall-top-c-c4').crop((12,24,44,48));a.paste(patch,(22,150))
            a.paste(read('wall-top-b-c4').crop((30,30,60,44)),(24,104))
        put('wall-tower-'+v+'-c4',a,donor='wall-tower-r',native_openings=v)
    for v in 'abc':
        a=read('wall-side')
        if v=='b':a.paste(read('wall-top-b-c4').crop((48,16,72,40)),(12,54))
        if v=='c':a.paste(read('wall-top-c-c4').crop((14,24,38,48)),(12,94))
        put('wall-side-'+v+'-c4',a,donor='wall-side',native_access=v)
    # Roof siblings use a genuinely drawn dormer/chimney, kept on one plane.
    for w in (1,2):
        for kind,acc in [('back','chimney-1-c0'),('dormer','dormer-0-c0')]:
            base='roof-ridge-c4-w'+str(w);a=read(base);p=read(acc);x=6;y=24
            a.alpha_composite(p,(x,y));put('roof-'+kind+'-c4-w'+str(w),a,donor=base,overlay=acc,position=[x,y])
    # Two actual native return strips. No frontal window bay is replaced.
    for side,x in [('left',0),('right',40)]:
        a=read('return-'+side+'-c4').crop((x,0,x+8,48))
        donor=read('ground-shop-w2-c0');xx=0 if side=='left' else 88
        for yy in (0,47):a.paste(donor.crop((xx,yy,xx+8,yy+1)),(0,yy))
        put('party-'+side+'-c4',a,donor='return-'+side+'-c4',crop=[x,0,x+8,48],course_donor='ground-shop-w2-c0',course_x=xx)
    a=read('roof-junction-c4')
    for name,x in [('valley',48),('hip-end',0)]:put('roof-'+name+'-c4',a.crop((x,0,x+48,48)),donor='roof-junction-c4',crop=[x,0,x+48,48])
    # Gate supports and overhead are independently consumable artwork.
    portal=read('gate-portal-a-c4');gate=read('gatehouse-r');gate.paste((0,0,0,0),(0,304,144,400));gate.alpha_composite(portal,(0,304))
    put('gatehouse-c4',gate,donor='gatehouse-r',portal='gate-portal-a-c4',replaced=[0,304,144,400])
    support=gate.copy();support.paste((0,0,0,0),(0,0,144,344));over=gate.copy();over.paste((0,0,0,0),(0,344,144,400))
    put('gate-supports-c4',support,donor='gatehouse-c4',retained=[0,344,144,400]);put('gate-overhead-c4',over,donor='gatehouse-c4',retained=[0,0,144,344])
    # One roof family for the shallow range and the poor-quarter lean-to.
    a=read('stable-range-c4');put('lean-to-c4',a.crop((0,0,48,48)),donor='stable-range-c4',crop=[0,0,48,48])
    # The signs keep64x72 canvases; marker reuses the original24px smith icon.
    marker=read('sign-smith').crop((20,35,44,59));put('workshop-marker-c4',marker,donor='sign-smith',crop=[20,35,44,59])
    # Worn workyard and main road remain painted cobbles, palette-only.
    cob=read('cobble-c3');values=sorted(set(p[:3] for p in cob.get_flattened_data() if p[3]),key=lambda p:sum(p))
    for name,ramp in [('workyard-c4',[(109,106,91),(117,114,98),(126,122,106),(134,130,113),(142,138,120),(150,146,127)]),('main-paving-c4',[(157,159,144),(165,167,152),(174,176,161),(182,184,169),(190,192,177),(198,200,185)])]:
        mapping={c:ramp[min(5,i*6//len(values))] for i,c in enumerate(values)};a=cob.copy();a.putdata([(*mapping[p[:3]],p[3]) if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);put(name,a,donor='cobble-c3',operation='palette lock only')

if __name__=='__main__':run()
