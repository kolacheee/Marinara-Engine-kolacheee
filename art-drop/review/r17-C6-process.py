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
    elif ident=='inn-porch-b':
        reg=Image.new('RGBA',(w*8,h*8));xs=[0,340,620,900,1450,src.width];xd=[0,12,36,50,82,96];ys=[0,300,650,src.height];yd=[0,10,40,48]
        for xa,xb,da,db in zip(xs,xs[1:],xd,xd[1:]):
            for ya,yb,ea,eb in zip(ys,ys[1:],yd,yd[1:]):reg.paste(src.crop((xa,ya,xb,yb)).resize(((db-da)*8,(eb-ea)*8),Image.Resampling.BOX),(da*8,ea*8))
    elif ident=='passage-entry':
        reg=Image.new('RGBA',(w*8,h*8));xs=[0,296,684,src.width];xd=[0,12,36,48];ys=[0,264,808,src.height];yd=[0,10,44,48]
        for xa,xb,da,db in zip(xs,xs[1:],xd,xd[1:]):
            for ya,yb,ea,eb in zip(ys,ys[1:],yd,yd[1:]):reg.paste(src.crop((xa,ya,xb,yb)).resize(((db-da)*8,(eb-ea)*8),Image.Resampling.BOX),(da*8,ea*8))
    elif ident=='door-entry-b':
        reg=Image.new('RGBA',(w*8,h*8));xs=[0,int(src.width*.25),int(src.width*.66),src.width];xd=[0,12,36,48];ys=[0,290,min(990,src.height-1),src.height];yd=[0,8,38,48]
        for xa,xb,da,db in zip(xs,xs[1:],xd,xd[1:]):
            for ya,yb,ea,eb in zip(ys,ys[1:],yd,yd[1:]):reg.paste(src.crop((xa,ya,xb,yb)).resize(((db-da)*8,(eb-ea)*8),Image.Resampling.BOX),(da*8,ea*8))
    elif ident.startswith('vendor-'):
        reg=Image.new('RGBA',(w*8,h*8));reg.paste(src.resize((24*8,34*8),Image.Resampling.BOX),(12*8,14*8))
    elif ident.startswith('wall-curtain-'):
        reg=Image.new('RGBA',(w*8,h*8))
        cut={'wall-curtain-a':330,'wall-curtain-b':410,'wall-curtain-c':326}[ident]
        reg.paste(src.crop((0,0,src.width,cut)).resize((w*8,32*8),Image.Resampling.BOX),(0,0))
        reg.paste(src.crop((0,cut,src.width,src.height)).resize((w*8,112*8),Image.Resampling.BOX),(0,32*8))
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
    for name,a in [('registered',reg),('mode',mode),('clean',im)]:a.save(R/f'r17-C6-{name}-{ident}.png')
    return im,dict(id=ident,source=rec['source'],bounds=list(bounds),size=[w,h],row_registration=rows,palette=palette,mode_blocks=w*h,samples_per_pixel=64,source_sha256=hashlib.sha256((R/rec['source']).read_bytes()).hexdigest(),cleanup=[[i%w,i//w,list(a),list(b)] for i,(a,b) in enumerate(zip(raw,im.get_flattened_data())) if a!=b])



def assemble(drawings):
    exports={};operations=[]
    def read(n):return exports[n].copy() if n in exports else Image.open(O/(n+'.png')).convert('RGBA')
    def put(n,a,donors,operation):
        a.putdata([p if p[3] else (0,0,0,0) for p in a.get_flattened_data()]);exports[n]=a
        operations.append(dict(output=n,donors=donors,operation=operation))
    # The selected roof is solid through the body. Short caps remove48 native
    # rows, maintaining original tile size. All recolours retain the same alpha.
    a=read('roof-merchant-c-c6');b=Image.new('RGBA',(96,96));b.paste(a.crop((0,0,96,48)),(0,0));b.paste(a.crop((0,96,96,144)),(0,48))
    put('roof-merchant-d2-c6',b,['roof-merchant-c-c6'],'remove middle48px native courses')
    for name in ('abutment-a','abutment-b'):
        a=read(name+'-c6');b=Image.new('RGBA',(48,96));b.paste(a.crop((0,0,48,48)),(0,0));b.paste(a.crop((0,96,48,144)),(0,48));put(name+'-d2-c6',b,[name+'-c6'],'native middle48px course removal')
    # A true16px receiving face and full144px return, cropped from its painting.
    a=read('abutment-a-c6');put('party-left-c6',a.crop((0,0,12,144)),['abutment-a-c6'],'drawn coping and masonry crop')
    a=read('abutment-b-c6');put('party-right-c6',a.crop((36,0,48,144)),['abutment-b-c6'],'drawn coping and masonry crop')
    # Shared painted entrance bay; whole goods bays retain distinct trade layouts.
    entry=read('door-entry-b-c6')
    a=read('ground-arch-v2-w2-c0');a.paste(read('passage-entry-c6'),(48,0));put('ground-passage-w2-c6',a,['ground-arch-v2-w2-c0','passage-entry-c6'],'whole48px open passage bay; keyed tunnel retains background paving')
    for trade,donor in [('baker','ground-baker-c6'),('smith','ground-smith-c4-w2'),('apothecary','ground-apothecary-c5-w2'),('cobbler','ground-cobbler-c5-w2')]:
        a=read(donor);a.paste(entry,(48,0));put('ground-'+trade+'-entry-c6',a,[donor,'door-entry-b-c6'],'whole48px entrance bay beside drawn goods bay')
    a=read('inn-porch-b-c6');a.paste(read('bed-pictogram-c6'),(16,10));put('inn-porch-b-c6',a,['inn-porch-b-c6','bed-pictogram-c6'],'separately registered16x8 painted bed pictogram above lodging threshold')
    # Three coherent upper arrangements, each using whole window/blank bays.
    a=read('storey-merchant-a-c6');b=read('storey-plaster-c6')
    c=b.copy();c.paste(a.crop((0,0,40,48)),(0,0));put('storey-merchant-b-c6',c,['storey-merchant-a-c6','storey-plaster-c6'],'left whole window bay transfer; one shared frame')
    # Native material ramps keep one roof colour per building.
    ramps={'slate':[(40,43,43),(62,68,71),(79,89,95),(96,109,115),(118,131,134),(140,149,148)],'brown':[(47,39,30),(73,57,38),(100,79,48),(125,100,61),(145,120,77),(162,139,97)]}
    for n in ['roof-merchant-c-c6','roof-merchant-d2-c6','abutment-a-c6','abutment-b-c6','abutment-a-d2-c6','abutment-b-d2-c6']:
        a=read(n)
        for tone,ramp in ramps.items():
            mapping=dict(zip(RED,ramp));b=a.copy();b.putdata([(*mapping.get(p[:3],p[:3]),p[3]) for p in a.get_flattened_data()]);put(n+'-'+tone,b,[n],'roof-palette-only substitution; identical alpha')
    for n in ['side-house-a-c6','side-house-west-c6']:
        a=read(n)
        for tone,ramp in ramps.items():
            b=a.copy();pix=[]
            for pixel_index,p in enumerate(a.get_flattened_data()):
                r,g,bl,al=p
                if pixel_index//a.width<80 and al and r>g*1.32 and r>bl*1.8:
                    k=min(range(6),key=lambda k:sum((p[j]-RED[k][j])**2 for j in range(3)));pix.append((*ramp[k],al))
                else:pix.append(p)
            b.putdata(pix);put(n+'-'+tone,b,[n],'material-only roof hue remap; preserve alpha and wall paint')
    # Register masonry courses using complete drawn native strips. Variant A
    # owns parapet and first/last two columns; no synthetic boundary is painted.
    master=read('wall-curtain-a-c6')
    for letter in 'abc':
        n='wall-curtain-'+letter+'-c6';variant=read(n);a=master.copy()
        if letter=='b':
            a.paste(variant.crop((40,54,56,100)),(40,54))
            a.paste(read('wall-curtain-c-c6').crop((28,32,36,144)),(76,32))
        elif letter=='c':a.paste(variant.crop((28,32,36,144)),(28,32))
        a.paste(master.crop((0,0,96,32)),(0,0))

        for x in (0,1,94,95):
            # Select internal masonry columns instead of the exterior outline.
            sx=12+x%2
            a.paste(master.crop((sx,0,sx+1,144)),(x,0))
        put(n,a,[n,'wall-curtain-a-c6'],'common drawn parapet/course phase and compatible two-column edge contract')
        put('wall-top-'+letter+'-c6',a.crop((0,0,96,48)),[n],'native48px parapet crop')
    # Tower top alternatives on existing compatible shafts; the total tower
    # canvas and ground allocation stay unchanged.
    for letter,top in [('a','tower-open-c6'),('b','tower-bell-c6'),('c',None)]:
        a=read('wall-tower-'+letter+'-c5')
        if top:
            t=read(top).crop((0,0,96,96));mapping={STONE[2]:STONE[3],STONE[3]:STONE[4],STONE[4]:STONE[5],STONE[5]:STONE[6]};t.putdata([(*mapping.get(q[:3],q[:3]),q[3]) for q in t.get_flattened_data()]);a.paste((0,0,0,0),(0,0,96,96));a.alpha_composite(t,(0,0))
            # The original last joining course belongs to the shaft.
            a.paste(read('wall-tower-'+letter+'-c5').crop((0,94,96,100)),(0,94))
        put('wall-tower-'+letter+'-c6',a,['wall-tower-'+letter+'-c5']+([top] if top else []),'replace upper96px within144px top module, retain compatible native shaft and landing')
    # Supported gate landing is a crop from the drawn chamber, not a new shape.
    a=read('gate-bridge-c6');put('gate-landing-c6',a.crop((48,0,96,48)),['gate-bridge-c6'],'right bearing/door/landing native crop')
    a=read('vendor-hand-c6');put('actor-proof-c6',a.crop((12,0,36,48)),['vendor-hand-c6'],'native24x48 actor canvas with foot anchor at bottom')
    # Reuse the existing angular forge plume at its native24x48 size.
    a=read('forge-smoke');b=Image.new('RGBA',(24,48));b.alpha_composite(a,(-max(0,(a.width-24)//2),-max(0,a.height-48)));put('forge-smoke-c6',b,['forge-smoke'],'native plume crop, no blur or resampling')
    # Ground displays are full existing painted shop goods cells, contained in plots.
    for trade,donor in [('baker','ground-baker-c6'),('apothecary','ground-apothecary-c5-w2'),('smith','forge-c5'),('cobbler','ground-cobbler-c5-w2')]:
        a=read(donor).crop((0,0,48,48));put('display-'+trade+'-c6',a,[donor],'whole painted goods/forge48px bay, attached inside service property')
    for n,a in exports.items():
        if n.startswith(('ground-','storey-')):
            d=read('ground-shop-w2-c0')
            for y in (0,47):a.paste(d.crop((0,y,a.width,y+1)),(0,y))
        a.save(O/(n+'.png'))
    (R/'r17-C6-native-operations.json').write_text(json.dumps(operations,indent=2))

def run():
    recs=json.loads((R/'r17-C6-generation.json').read_text()); logs=[];exports={}
    for rec in recs:
        n=rec['id'];opts={}
        if n=='door-entry':opts['box']=[120,700,1136,1210]
        if n=='abutment-b':opts['box']=[31,115,694,1118]
        if n=='sign-tailor':opts['box']=[28,632,272,918]
        if n=='gate-bridge':opts['box']=[10,15,1764,606]
        if n=='passage-entry':opts['box']=[138,174,1118,1082]
        flat=n.startswith(('storey','ground','inn','door'))
        pal=RED if n.startswith('roof') else RED+STONE if n.startswith('abutment') else [STONE[i] for i in (0,2,3,4,5)] if n.startswith(('wall-curtain','church-entry','tower','gate')) else RED+FLOOR if n.startswith('side-house') else FLOOR if flat else prior.PAL
        if n=='tower-bell':pal += [(114,48,44),(139,107,58),(178,143,78),(79,89,95),(118,131,134)]
        if n=='passage-entry':pal=FLOOR
        a,log=register(rec,n,rows=flat,palette=pal,**opts);logs.append(log)
        if n.startswith(('ground','storey','inn','door','passage')):
            donor=Image.open(O/'ground-shop-w2-c0.png').convert('RGBA')
            for y in (0,47):a.paste(donor.crop((0,y,a.width,y+1)),(0,y))
        mode=list(Image.open(R/f'r17-C6-mode-{n}.png').get_flattened_data());log['cleanup']=[[i%a.width,i//a.width,list(x),list(y)] for i,(x,y) in enumerate(zip(mode,a.get_flattened_data())) if x!=y]
        a.save(R/f'r17-C6-clean-{n}.png')
        exports[n]=a
    for n,a in exports.items():
        if n in ('roof-merchant-a','roof-merchant-b','inn-porch-a','door-entry','church-entry-b','market-hall-a','side-house-b'):continue
        a.save(O/(n+'-c6.png'))
    bedrec=next(r for r in recs if r['id']=='inn-porch-b');bed,bedlog=register(bedrec,'bed-pictogram',box=[474,301,590,370],size=[16,8],palette=FLOOR);bed.save(O/'bed-pictogram-c6.png');logs.append(bedlog)
    assemble(exports)
    (R/'r17-C6-processing.json').write_text(json.dumps(logs,indent=2))
    print(len(logs),'drawings',sum(x['mode_blocks']*64 for x in logs),'samples')

if __name__=='__main__':run()
