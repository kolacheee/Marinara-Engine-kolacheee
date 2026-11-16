"""Part M review-only composition. Existing artwork is never resampled or edited.

New review-only wall/folk drawings: magenta key, BOX register at 8x, palette,
exact 64-sample RGBA mode, source-supported one-pixel contour cleanup.
No image geometry or texture is drawn in code. ImageDraw is for proof labels.
"""
from pathlib import Path
from collections import Counter
import base64, hashlib, importlib.util, io, json, subprocess, sys
import struct
from PIL import Image, ImageDraw, PngImagePlugin

sys.dont_write_bytecode = True
ART = Path(__file__).resolve().parents[1]
REV = ART / 'review'
NN = Image.Resampling.NEAREST
SIZE = (1200, 912)
OUTLINE = (43, 40, 29, 255)
BRANCH = 'origin/claude/project-thread-g8wuu1'
PACKPATH = 'packages/server/src/assets/overworld-art/fantasy.json'
sp = importlib.util.spec_from_file_location('city15', ART/'out/city15/compose.py')
city = importlib.util.module_from_spec(sp)
sp.loader.exec_module(city)

def save(im, name, **meta):
    info = PngImagePlugin.PngInfo()
    for k,v in meta.items(): info.add_text(k, json.dumps(v, sort_keys=True))
    im.save(REV/name, pnginfo=info)

def proof(im, name, **meta):
    for s in (1,4):
        save(im.resize((im.width*s, im.height*s),NN),f'r15-M-{name}-{s}x.png',Scale=s,**meta)

def pack():
    raw = subprocess.check_output(['git','show',f'{BRANCH}:{PACKPATH}'])
    p = json.loads(raw)
    sheets = {s['id']:Image.open(io.BytesIO(base64.b64decode(s['png'].split(',')[1]))).convert('RGBA') for s in p['sheets']}
    result = {}
    for k in ['street','square','town_ground','well','tree','stall','town_prop0','town_prop1','town_prop3','town_prop4','town_prop7']:
        result[k] = []
        for t in p['tiles'][k]:
            x,y,w,h = [t.get(z,1)*48 for z in ('x','y','w','h')]
            result[k].append(sheets[t['sheet']].crop((x,y,x+w,y+h)))
    return result, dict(ref=BRANCH,path=PACKPATH,sha256=hashlib.sha256(raw).hexdigest(),tileSize=p['tileSize'],folk_missing='folk' not in p['tiles'])

def palette():
    # Established city palette; no colour invention in the new review sprites.
    pal=set()
    for n in ['ground-door-w2','ground-shop-w2','storey-stone-w2-c0','storey-plaster-w2-c2','roof-ridge-w2-c0','flowerbox-0']:
        pal.update(p for p in city.asset(n).get_flattened_data() if p[3])
    return sorted(pal)

def groups(pixels,w,h):
    todo={i for i,p in enumerate(pixels) if p[3]}; out=[]
    while todo:
        q=todo.pop(); group=[q]; stack=[q]
        while stack:
            y,x=divmod(stack.pop(),w)
            for yy in range(max(0,y-1),min(h,y+2)):
                for xx in range(max(0,x-1),min(w,x+2)):
                    i=yy*w+xx
                    if i in todo:
                        todo.remove(i);group.append(i);stack.append(i)
        out.append(group)
    return sorted(out,key=len,reverse=True)

def reduce_piece(source, name, size, source_box=None):
    raw=Image.open(REV/source).convert('RGBA')
    if source_box: raw=raw.crop(source_box)
    keyed=Image.new('RGBA',raw.size)
    keyed.putdata([(0,0,0,0) if r>135 and b>135 and r>g+45 and b>g+45 else (r,g,b,255) for r,g,b,a in raw.get_flattened_data()])
    box=keyed.getbbox(); cropped=keyed.crop(box)
    w,h=size
    if name.startswith('folk'):
        f=min((w-2)/cropped.width,(h-2)/cropped.height)
        bw,bh=round(cropped.width*f),round(cropped.height*f)
        placement=((w-bw)//2,h-bh-1,bw,bh)
    else: placement=(0,0,w,h)
    x,y,bw,bh=placement
    reg=Image.new('RGBA',(w*8,h*8))
    reg.paste(cropped.resize((bw*8,bh*8),Image.Resampling.BOX),(x*8,y*8))
    pal=palette(); pim=Image.new('P',(1,1))
    padded=pal+[pal[-1]]*(256-len(pal));pim.putpalette([c for p in padded for c in p[:3]])
    locked=reg.convert('RGB').quantize(palette=pim,dither=Image.Dither.NONE).convert('RGB')
    reg.putdata([(*rgb,255) if a>=128 else (0,0,0,0) for rgb,a in zip(locked.get_flattened_data(),reg.getchannel('A').get_flattened_data())])
    packed=struct.unpack('>'+str(w*h*64)+'I',reg.tobytes());mode=[]
    for yy in range(h):
        for xx in range(w):
            votes=Counter(q for sy in range(8) for q in packed[(yy*8+sy)*w*8+xx*8:(yy*8+sy)*w*8+xx*8+8])
            winner=min(votes,key=lambda q:(-votes[q],q))
            mode.append(tuple(winner.to_bytes(4,'big')))
    clean=mode.copy()
    for group in groups(clean,w,h):
        if len(group)<3:
            for i in group:clean[i]=(0,0,0,0)
    before=clean.copy()
    for yy in range(h):
        for xx in range(w):
            i=yy*w+xx
            if not before[i][3]:continue
            near=[before[ny*w+nx] for ny,nx in [(yy-1,xx),(yy+1,xx),(yy,xx-1),(yy,xx+1)] if 0<=ny<h and 0<=nx<w]
            edge=len(near)<4 or any(not q[3] for q in near)
            if edge:clean[i]=OUTLINE
            elif before[i]==OUTLINE and sum(q==OUTLINE for q in near)>=2:
                lighter=[tuple(q) for q in near if q[3] and tuple(q)!=OUTLINE]
                if lighter:clean[i]=Counter(lighter).most_common(1)[0][0]
    edits=[dict(x=i%w,y=i//w,before=p,after=q) for i,(p,q) in enumerate(zip(mode,clean)) if p!=q]
    modeim=Image.new('RGBA',size);modeim.putdata(mode)
    cleanim=Image.new('RGBA',size);cleanim.putdata(clean)
    for stage,im in [('registered',reg),('mode',modeim),('clean',cleanim)]:
        save(im,f'r15-M-{stage}-{name}.png')
    return cleanim,dict(name=name,source=source,source_box=source_box,painted_crop=box,size=size,placement=placement,palette=pal,mode_blocks=w*h,samples=64*w*h,cleanup=edits)

def new_drawings():
    results={};records=[]
    for v in 'ab':
        name='wall-'+v
        results[name],rec=reduce_piece(f'r15-M-source-{name}.png',name,(288,96));records.append(rec)
        src=f'r15-M-source-folk-{v}.png';w,h=Image.open(REV/src).size
        for i in range(4):
            name=f'folk-{v}-{i}'
            results[name],rec=reduce_piece(src,name,(20,34),(i*w//4,0,(i+1)*w//4,h));records.append(rec)
    (REV/'r15-M-processing.json').write_text(json.dumps(records,indent=2)+'\n')
    return results

def repeat(tile,size,offset=(0,0)):
    im=Image.new('RGBA',size)
    for y in range(-offset[1]%tile.height-tile.height,size[1],tile.height):
        for x in range(-offset[0]%tile.width-tile.width,size[0],tile.width):
            im.alpha_composite(tile,(x,y))
    return im

def make_spec(width,floors,ground,colour,roof,roof_colour,kinds,serial,corner=False):
    spec=dict(width=width,ground=ground,storeys=[dict(kind=k,colour=colour) for k in kinds[:floors-1]],roof=roof,roof_colour=roof_colour,ends=['left','right'],overlays=[])
    if corner:spec['corner']=True
    if not corner:
        mount=city.sign_mount(spec,'sign-'+str(serial%4)) if ground=='shop' else None
        if mount:spec['overlays'].append(mount)
        if floors>1 and serial%3!=1:
            fl=f'flowerbox-{serial%2}'
            spec['overlays'].append(dict(file=fl,x=4,y=(floors-1)*48-city.asset(fl).height-2))
    roofim=city.asset(f'roof-{roof}-w{width}-c{roof_colour}')
    if serial%4!=1:
        ch=f'chimney-{serial%4}';chIm=city.asset(ch);x=width*48-28
        foot=chIm.getchannel('A').crop((0,chIm.height-1,chIm.width,chIm.height)).getbbox()
        surface=max(next(y for y in range(roofim.height) if roofim.getpixel((xx,y))[3]) for xx in range(x+foot[0],x+foot[2]))
        base=min(roofim.height-5,surface+10)
        spec['overlays'].append(dict(file=ch,x=x,y=base-roofim.height-chIm.height,layer='behind_roof' if roof=='gable' else 'front'))
    if width>1 and roof in ('ridge','hip') and serial%3!=0:
        spec['overlays'].append(dict(file=f'dormer-{serial%4}',x=width*24-20,y=-36))
    return spec

def compose_scene(tiles,drawings, provenance):
    im=repeat(tiles['street'][0],SIZE)
    # One globally registered texture per material, cropped on the 48px grid.
    plaza=(384,336,864,672)
    square=repeat(tiles['square'][0],SIZE)
    im.alpha_composite(square.crop(plaza),plaza[:2])
    # North curtain wall: only repeat/crop the drawn material, no code stonework.
    wall=drawings['wall-a'].crop((18,0,270,96))
    for x in range(-96,SIZE[0],wall.width):im.alpha_composite(wall,(x,0))
    objects=[];buildings=[];serial=0
    def row(name,x,baseline,configs,rear=False):
        nonlocal serial
        for width,floors,ground,colour,roof,rc,kinds,corner in configs:
            spec=make_spec(width,floors,ground,colour,roof,rc,kinds,serial,corner)
            b,parts=city.build(spec)
            if corner:
                for level in range(floors):
                    fn='corner-ground' if not level else f'corner-storey-c{colour}'
                    yy=b.height-(level+1)*48
                    b.alpha_composite(city.asset(fn),(0,yy))
                    parts.append(dict(file=fn+'.png',x=0,y=yy,corner_replacement=True))
            rec=dict(id=f'{name}-{serial}',row=name,rear=rear,x=x,baseline=baseline,y=baseline-b.height,width=b.width,height=b.height,floors=floors,spec=spec,parts=parts)
            buildings.append(rec);objects.append((baseline,1,b,x,baseline-b.height,rec['id']))
            x+=b.width;serial+=1
    def c(w,f,g,co,r,rc,k='timber plaster stone jetty',corner=False):return (w,f,g,co,r,rc,k.split(),corner)
    # Rear rows precede their front rows; feet disappear behind their foreground facades.
    row('north-west-rear',0,240,[c(2,2,'door',2,'ridge',2),c(3,2,'work',0,'gable',1),c(2,2,'door',1,'hip',0)],True)
    row('north-centre-rear',384,240,[c(3,2,'door',0,'gable',1),c(2,3,'door',2,'ridge',2),c(3,2,'work',1,'hip',0),c(2,2,'door',0,'ridge',1)],True)
    row('north-east-rear',960,240,[c(3,2,'work',0,'gable',2),c(2,2,'door',2,'ridge',1)],True)
    row('north-west-front',0,336,[c(3,3,'work',0,'hip',2,'plaster timber'),c(2,4,'shop',1,'ridge',0,'timber plaster jetty'),c(1,3,'door',2,'gable',1,'stone plaster'),c(1,3,'door',0,'hip',0,corner=True)])
    row('square-north-front',384,336,[c(2,5,'shop',0,'gable',0,'timber plaster jetty stone'),c(3,4,'arch',2,'ridge',1,'plaster timber stone'),c(2,5,'shop',1,'hip',2,'timber stone plaster jetty'),c(2,4,'work',2,'gable',0,'timber plaster stone'),c(1,4,'door',0,'hip',1,corner=True)])
    row('north-east-front',960,336,[c(2,3,'shop',0,'ridge',0,'timber plaster'),c(2,2,'door',2,'hip',1,'jetty'),c(1,3,'door',1,'gable',2,corner=True)])
    row('west-rear',0,528,[c(2,2,'door',2,'flat',2),c(3,2,'door',0,'flat',1),c(3,2,'work',1,'flat',2)],True)
    row('square-west-front',0,672,[c(3,3,'arch',0,'gable',0,'plaster timber'),c(2,4,'shop',2,'ridge',2,'timber stone plaster'),c(2,3,'door',1,'hip',1,'timber jetty'),c(1,3,'door',0,'hip',0,corner=True)])
    row('east-front',960,624,[c(3,3,'work',2,'hip',2,'stone plaster'),c(1,4,'door',1,'gable',0,'jetty plaster timber'),c(1,3,'door',0,'hip',1,corner=True)])
    # Front edge cropped by camera; different lot widths break an identical-row rhythm.
    row('south-west-rear',0,912,[c(3,2,'door',0,'flat',1),c(2,2,'work',2,'ridge',2),c(3,2,'door',1,'flat',2),c(3,2,'door',0,'hip',1),c(3,2,'work',2,'flat',2),c(3,2,'door',0,'ridge',0),c(2,2,'door',1,'flat',1)],True)
    row('south-west-front',0,1008,[c(3,3,'shop',2,'hip',1,'timber plaster'),c(2,2,'door',0,'gable',0,'stone'),c(2,3,'work',1,'ridge',2,'plaster jetty'),c(3,2,'arch',0,'hip',0,'timber'),c(2,3,'shop',2,'gable',1,'timber stone'),c(3,3,'door',0,'ridge',2,'jetty plaster'),c(3,2,'work',1,'gable',0,'stone'),c(1,3,'door',0,'hip',2,corner=True)])
    row('south-east-front',1008,912,[c(3,2,'shop',0,'ridge',1,'timber'),c(1,2,'door',2,'hip',0,corner=True)])
    props=[]
    def prop(key,index,x,foot):
        a=tiles[key][index];bb=a.getbbox();y=foot-bb[3]
        rec=dict(tile=key,index=index,x=x,y=y,foot=foot,bounds=bb)
        props.append(rec);objects.append((foot,2,a,x,y,f'{key}-{len(props)}'))
    # Stalls make two unequal groups, leaving diagonal and cross-square routes open.
    for i,(x,y) in enumerate([(432,410),(498,410),(756,418),(432,582),(494,582),(720,606),(778,606)]):prop('stall',i%2,x,y)
    prop('well',0,616,516)
    prop('tree',0,762,554)
    prop('tree',1,382,658)
    prop('town_prop3',0,782,573)
    prop('town_prop0',0,475,580)
    prop('town_prop1',0,804,417)
    prop('town_prop7',0,1030,679)
    for x,y in [(340,378),(866,371),(344,705),(934,706)]:prop('town_prop4',0,x,y)
    folk=[]
    # folk[23] stays on clear cross-street cobbles, above the workshop chimney.
    for i,(cx,foot) in enumerate([(357,287),(304,375),(176,371),(520,365),(891,400),(1016,379),(467,433),(540,443),(726,444),(617,552),(673,535),(576,493),(488,610),(741,641),(838,612),(421,701),(287,722),(636,711),(905,597),(970,727),(1103,682),(954,845),(67,706),(1092,384),(855,481)]):
        idx=i%4;a=drawings[f'folk-b-{idx}'];bb=a.getbbox();x=cx-a.width//2;y=foot-bb[3]
        folk.append(dict(variant=idx,x=x,y=y,foot=foot))
        objects.append((foot,3,a,x,y,f'folk-{i}'))
    # All standing objects participate in the same feet sort, people included.
    for foot,priority,a,x,y,ident in sorted(objects,key=lambda q:(q[0],q[1],q[3])):im.alpha_composite(a,(x,y))
    recipe=dict(size=SIZE,cell=48,plaza=plaza,ground='street everywhere; square in plaza; no lawn',wall=dict(source='r15-M-clean-wall-a.png',crop=(18,0,270,96),x_start=-96,y=0,period=252),buildings=buildings,props=props,folk=folk,draw_order=[o[5] for o in sorted(objects,key=lambda q:(q[0],q[1],q[3]))],pack=provenance)
    save(im,'r15-city-mockup.png',Recipe=recipe)
    detailbox=(336,144,912,672)
    detail=im.crop(detailbox).resize((1152,1056),NN)
    save(detail,'r15-city-mockup-detail-2x.png',Source='r15-city-mockup.png',Crop=detailbox,Scale=2)
    # Today's six-panel image uses 24px cells: a 2x NN enlargement restores 48px.
    today=Image.open(REV/'city-view-towns-2026-11-16.png').convert('RGBA').crop((0,0,600,500)).resize((1200,1000),NN)
    compare=Image.new('RGBA',(2424,1048),(32,35,37,255));d=ImageDraw.Draw(compare)
    d.text((12,12),'TODAY / fantasy panel / restored to 48 px cells',fill=(240,232,214))
    d.text((1224,12),'ROUND 15 / joined city district / native 48 px cells',fill=(240,232,214))
    compare.alpha_composite(today,(0,36));compare.alpha_composite(im,(1224,36))
    d.text((1236,966),'25 x 19 cells / 2-5 storeys / review mockup only',fill=(240,232,214))
    d.text((1236,988),'Existing city15 + fantasy paving and props; review-only wall and townsfolk.',fill=(200,199,187))
    save(compare,'r15-city-mockup-vs-today.png',TodayCrop=(0,0,600,500),TodayScale=2,MockupScale=1)
    (REV/'r15-M-layout.json').write_text(json.dumps(recipe,indent=2)+'\n')
    return im,detail,compare,recipe

def reviews(tiles,drawings,images,recipe):
    for name,im in zip(['city-mockup','city-mockup-detail-2x','city-mockup-vs-today'],images):proof(im,name)
    for k in ['street','square','town_ground']:
        tile=tiles[k][0];proof(tile,f'ground-{k}',Source=recipe['pack'])
        proof(repeat(tile,(tile.width*3,tile.height*3)),f'repeat-{k}',Repeat=[3,3],Source=recipe['pack'])
    for k in ['well','tree','stall','town_prop0','town_prop1','town_prop3','town_prop4','town_prop7']:
        for i,a in enumerate(tiles[k]):
            if k=='tree' and i>1:continue
            base=repeat(tiles['square'][0],(max(96,a.width+24),max(96,a.height+24)))
            base.alpha_composite(a,(12,12));proof(base,f'prop-{k}-{i}',Source=recipe['pack'],Origin=[12,12])
    for n,a in drawings.items():
        base=repeat(tiles['street' if n.startswith('wall') else 'square'][0],(a.width+24,a.height+24))
        base.alpha_composite(a,(12,12));proof(base,'drawing-'+n,Origin=[12,12])
    # Native source building pieces actually used in the scene, including mounted joins.
    used=sorted({p['file'] for b in recipe['buildings'] for p in b['parts']})
    for n in used:
        a=city.asset(n[:-4]);base=repeat(tiles['square'][0],(a.width+24,a.height+24));base.alpha_composite(a,(12,12))
        proof(base,'piece-'+n[:-4],Source='out/city15/'+n,Origin=[12,12])
    selection=Image.new('RGBA',(1248,620),(44,46,42,255));d=ImageDraw.Draw(selection)
    for j,v in enumerate('ab'):
        y=12+j*300;d.text((12,y),f'Wall {v.upper()}'+(' — selected' if v=='a' else ''),fill='white')
        a=drawings['wall-'+v];selection.alpha_composite(a,(12,y+24));selection.alpha_composite(a.resize((864,288),NN),(348,y+8))
        for i in range(4):
            f=drawings[f'folk-{v}-{i}'];selection.alpha_composite(f,(16+i*72,y+132));selection.alpha_composite(f.resize((60,102),NN),(12+i*72,y+176))
        d.text((12,y+280),'Folk '+v.upper()+(' — selected' if v=='b' else ''),fill='white')
    save(selection,'r15-M-selection.png')
    # Detail crops expose course lines, ground contact, corners and depth.
    for label,box in [('north-joins',(432,224,864,384)),('west-depth',(0,384,384,720)),('market',(408,384,864,672)),('bent-lane',(840,528,1200,912)),('north-wall',(0,0,384,144)),('east-cross-street',(1024,320,1184,488))]:
        proof(images[0].crop(box),label,Crop=box)

def main():
    tiles,provenance=pack()
    drawings=new_drawings()
    im,detail,compare,recipe=compose_scene(tiles,drawings,provenance)
    if '--full' in sys.argv:reviews(tiles,drawings,(im,detail,compare),recipe)
    print(json.dumps(dict(canvas=im.size,buildings=len(recipe['buildings']),storeys=dict(Counter(b['floors'] for b in recipe['buildings'])),props=len(recipe['props']),people=len(recipe['folk']),pack_folk_missing=provenance['folk_missing'])))

if __name__=='__main__':main()
