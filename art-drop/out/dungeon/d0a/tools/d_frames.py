"""Assemble native D frames from grid landmarks and native palette pieces.
Only review exports call resize: exact integer repeats, or grey squints.
"""
import json,math

from PIL import Image,ImageDraw,ImageFont
from draw_proofs import BASE,REVIEW,P,c,pts
from redraw_critic21 import poly,line,box,canvas
from d_layouts import MAPS
from d_sprites import framed,new

OUT=BASE/'frames';MANIFEST={}
OFFSET=0
def at(v):return round(v/64*48)+OFFSET
def path(text):return [(at(x),at(y)) for x,y in pts(text)]
def fill_pattern(size,im):
    out=Image.new('RGBA',size)
    for y in range(0,size[1],im.height):
        for x in range(0,size[0],im.width):out.paste(im,(x,y))
    return out

def sprite(name):
    p=BASE/f'canon/props/d-{name}.png'
    if not p.exists():p=BASE/f'canon/props/{name}.png'
    return Image.open(p).convert('RGBA')

def place(im,name,xy,records,group='reference'):
    pic=sprite(name);x,y=map(at,xy)
    # Centre 48 px objects on their source cell. Taller objects use the same foot.
    left=x-pic.width//2;top=y+24-pic.height
    im.alpha_composite(pic,(left,top));records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[left,top,left+pic.width,top+pic.height],group=group))

def pool(im,polygon):
    p=path(polygon);d=ImageDraw.Draw(im);d.polygon(p,fill=c('sewer-water',2));d.line(p+[p[0]],fill=c('grey-brown-rock',2),width=2)
    xs=[a for a,b in p];ys=[b for a,b in p];x=min(xs);y=min(ys)
    for off,w in [(13,20),(37,28),(63,17),(90,26),(116,22)]:
        if y+off<max(ys)-5:line(im,'sewer-water:3',f'{x+9},{y+off} {x+9+w},{y+off} {x+9+w},{y+off+2} {x+15+w},{y+off+2}',2)

def rug(im,polygon):
    p=path(polygon);d=ImageDraw.Draw(im);d.polygon(p,fill=c('textiles-russet',2));d.line(p+[p[0]],fill=c('brass',3),width=3)
    d.line(p+[p[0]],fill=c('textiles-russet',1),width=1)
    # Medallions at selected clear turns, not a repeated texture field.

def feature_hoard(im,bounds):
    x,y,u,v=map(at,bounds);w=u-x;h=v-y;f=new(w+1,h+1)
    poly(f,'lair-hoard:1',f'0,{h-28} 7,{h-74} 16,{h-74} 16,{h-126} 35,{h-144} 35,52 51,25 76,14 116,14 135,3 168,3 192,20 209,44 {w-24},56 {w-24},98 {w-8},122 {w},{h-30} {w-14},{h-7} {w-50},{h} 24,{h} 0,{h-18}')
    poly(f,'lair-hoard:3',f'3,{h-28} 10,{h-72} 19,{h-72} 19,{h-124} 38,{h-142} 38,54 54,28 78,17 118,17 137,6 167,6 190,23 206,47 {w-27},59 {w-27},101 {w-11},125 {w-3},{h-30} {w-17},{h-10} {w-52},{h-3} 27,{h-3} 3,{h-20}')
    poly(f,'lair-hoard:4','39,66 52,39 72,27 108,27 124,36 130,59 116,78 94,85 61,84 39,76')
    poly(f,'lair-hoard:4','127,37 142,15 165,15 184,31 192,54 176,72 151,75 132,61')
    poly(f,'lair-hoard:4','20,121 42,100 72,96 94,107 99,131 83,151 54,158 24,144')
    poly(f,'lair-hoard:4','132,117 153,90 185,86 210,100 225,121 218,143 189,157 157,146')
    poly(f,'lair-hoard:4',f'24,{h-49} 48,{h-70} 82,{h-66} 107,{h-46} 102,{h-23} 76,{h-10} 43,{h-15} 24,{h-29}')
    poly(f,'lair-hoard:4',f'135,{h-48} 160,{h-70} 192,{h-67} {w-27},{h-43} {w-22},{h-24} {w-47},{h-13} 166,{h-18} 141,{h-30}')
    # Hand-positioned ingots, plates and goblets make a heap, not bubble circles.
    for bx,by,bw in [(56,40,23),(90,52,15),(145,29,20),(170,46,13),(36,115,18),(65,130,25),(160,110,17),(190,128,21),(39,h-42,27),(77,h-29,16),(157,h-41,24),(204,h-27,17)]:
        framed(f,(bx,by,bx+bw,by+7),'hoard-bronze',4);box(f,'hoard-bronze:5',(bx+2,by+1,bx+bw-2,by+2))
    for gx,gy in [(70,65),(157,61),(40,137),(208,150),(100,h-59),(181,h-24)]:
        poly(f,'hoard-bronze:1',f'{gx-5},{gy} {gx+5},{gy} {gx+4},{gy+6} {gx+1},{gy+9} {gx+1},{gy+13} {gx+5},{gy+13} {gx+5},{gy+15} {gx-5},{gy+15} {gx-5},{gy+13} {gx-1},{gy+13} {gx-1},{gy+9} {gx-4},{gy+6}')
        box(f,'hoard-bronze:5',(gx-3,gy+1,gx+3,gy+4));line(f,'hoard-bronze:4',f'{gx},{gy+5} {gx},{gy+13}',2)
    # Coin stacks follow the heap's shoulders. This list is drawn once; no scatter.
    stacks=[(48,51,6),(79,34,9),(106,40,6),(123,28,7),(147,44,10),(176,32,7),
      (59,77,8),(89,69,11),(110,84,7),(144,83,8),(180,79,9),(202,65,6),
      (28,126,7),(48,109,9),(78,117,6),(95,139,8),(125,130,10),(155,100,7),
      (179,121,9),(211,135,8),(220,111,6),(35,166,9),(60,151,6),(86,171,8),
      (113,156,7),(140,178,9),(166,161,7),(195,181,9),(222,164,6),
      (32,204,10),(58,190,7),(78,216,8),(105,197,9),(128,214,7),(152,199,6),(190,211,10),(226,203,7)]
    for a,b,ww in stacks:
        if b+6<h-7:
            box(f,'hoard-bronze:2',(a,b,a+ww,b+5));box(f,'hoard-bronze:5',(a,b,a+ww-1,b+1));box(f,'hoard-bronze:4',(a+1,b+3,a+ww,b+4))
    # A discarded shield and a linked chain interrupt the small treasure rhythm.
    poly(f,'iron:1','107,94 127,94 127,112 122,120 117,124 112,120 107,112')
    poly(f,'iron:3','109,96 125,96 125,111 121,117 117,121 113,117 109,111')
    line(f,'hoard-bronze:5','117,98 117,116',2);line(f,'hoard-bronze:5','111,104 123,104',2)
    for a,b in [(87,183),(92,187),(97,191),(103,194),(110,196)]:
        framed(f,(a,b,a+6,b+4),'hoard-bronze',5);box(f,'hoard-bronze:2',(a+2,b+2,a+4,b+2))
    # The bound focus is a bright amber brazier, at the original feature marker.
    fx=at(448)-x;fy=at(1280)-y
    framed(f,(fx-20,fy-12,fx+20,fy+12),'lair-hoard',4);box(f,'lair-hoard:1',(fx-16,fy-8,fx+16,fy+4));box(f,'lair-hoard:6',(fx-9,fy-5,fx+9,fy+1))
    im.alpha_composite(f,(x,y));return [fx+x,fy+y]

def stepped_ring(im,centre,rx,ry,ramp,step=4):
    cx,cy=centre
    # A symmetric 32-vertex native path; Pillow draws hard pixel stairs.
    xy=[(cx+round(rx*math.cos(i*math.pi/16)),cy+round(ry*math.sin(i*math.pi/16))) for i in range(32)]
    d=ImageDraw.Draw(im);d.line(xy+[xy[0]],fill=c(ramp,2),width=5);d.line(xy+[xy[0]],fill=c(ramp,step),width=3)
    return xy

def feature_breach(im,points):
    xy=[(at(x),at(y)) for x,y in points];d=ImageDraw.Draw(im)
    # Nested hard stepped fissure edges, no halos or partial alpha.
    d.line(xy,fill=c('breach-stone',1),width=25,joint='curve');d.line(xy,fill=c('breach-stone',3),width=19,joint='curve')
    d.line(xy,fill=c('lair-breach',1),width=13,joint='curve');d.line(xy,fill=c('lair-breach',4),width=7,joint='curve');d.line(xy,fill=c('lair-breach',6),width=3,joint='curve')
    x,y=xy[-1];framed(im,(x-14,y-59,x+14,y-13),'breach-stone',4);box(im,'lair-breach:1',(x-8,y-54,x+8,y-17));line(im,'lair-breach:5',f'{x},{y-50} {x},{y-39} {x-3},{y-39} {x-3},{y-29} {x+2},{y-29} {x+2},{y-20}',3)
    return [x,y-35]

def feature_sanctum(im,bounds):
    x,y,u,v=map(at,bounds);cx=(x+u)//2;cy=(y+v)//2
    stepped_ring(im,(cx,cy),(u-x)//2,(v-y)//2,'lair-sanctum',4)
    for sx,sy in [(256,768),(320,576),(384,512),(512,512),(832,704),(896,768),(832,832),(832,960),(768,1024),(576,1088),(448,1088),(384,1024),(320,960)]:
        a,b=at(sx),at(sy);framed(im,(a-10,b-17,a+10,b+13),'dark-masonry',2);box(im,'lair-sanctum:5',(a-3,b-7,a+3,b+4));box(im,'lair-sanctum:6',(a-2,b-7,a+2,b-5))
    a,b=at(576),at(448)
    framed(im,(a-16,b-43,a+16,b+20),'dark-masonry',5);box(im,'lair-sanctum:1',(a-10,b-37,a+10,b+12))
    line(im,'lair-sanctum:5',f'{a+2},{b-32} {a+2},{b-21} {a-3},{b-21} {a-3},{b-10} {a+3},{b-10} {a+3},{b+6}',4)
    return [a,b]

def bracket(im,x,y,r):
    for sx,sy in [(-1,-1),(1,-1),(-1,1),(1,1)]:
        px=x+sx*33;py=y+sy*33
        line(im,r+':4',f'{px-sx*12},{py} {px},{py} {px},{py-sy*12}',2)

def broken_inset(im,kind):
    w,h=192,144;x=im.width-w-24;y=im.height-h-24
    framed(im,(x,y,x+w-1,y+h-1),'iron',2);box(im,'void-mass:1',(x+3,y+3,x+w-4,y+h-4))
    d=ImageDraw.Draw(im);d.fontmode='1';d.text((x+10,y+8),{'hoard':'COLLAPSED HEAP','breach':'SEALED RIFT','sanctum':'BROKEN CIRCLE'}[kind],fill=c('bone',3))
    floor=Image.open(BASE/f'canon/surfaces/{dict(hoard="keep",breach="temple",sanctum="crypt")[kind]}-floor.png').crop((0,0,168,104));im.paste(floor,(x+12,y+28))
    if kind=='hoard':
        poly(im,'hoard-bronze:2',f'{x+24},{y+104} {x+44},{y+89} {x+76},{y+93} {x+96},{y+102} {x+147},{y+102} {x+161},{y+114} {x+135},{y+121} {x+60},{y+120}')
        for bx,by,bw in [(31,99,19),(70,105,22),(122,111,20)]:framed(im,(x+bx,y+by,x+bx+bw,y+by+5),'hoard-bronze',4)
        im.alpha_composite(sprite('chest-open'),(x+118,y+55))
    elif kind=='breach':
        line(im,'breach-stone:2',f'{x+22},{y+108} {x+48},{y+96} {x+70},{y+99} {x+99},{y+78} {x+130},{y+85} {x+169},{y+66}',7)
        for bx,by in [(35,95),(80,87),(122,77)]:framed(im,(x+bx,y+by,x+bx+19,y+by+7),'sandstone',3)
    else:
        xy=stepped_ring(im,(x+96,y+84),61,35,'sanctum-cloth',3)
        box(im,'dark-masonry:5',(x+62,y+43,x+102,y+62));box(im,'dark-masonry:5',(x+134,y+83,x+170,y+108))
        im.alpha_composite(sprite('rubble'),(x+66,y+72));im.alpha_composite(sprite('rubble'),(x+126,y+73))
    return [x,y,x+w,y+h]

def draw_walls(im,mask,look):
    w,h=mask.size;wall=Image.open(BASE/f'canon/surfaces/{look}-wall.png').convert('RGBA');wp=wall.load()
    edge=Image.new('1',mask.size);ed=ImageDraw.Draw(edge)
    cfg=MAPS[CURRENT]
    for p in [cfg['outline']]+cfg.get('holes',[]):
        xy=path(p);ed.line(xy+[xy[0]],fill=1,width=37,joint='curve')
    from PIL import ImageChops
    band=ImageChops.logical_and(edge,ImageChops.invert(mask))
    im.paste(fill_pattern(im.size,wall.crop((0,8,144,48))),(0,0),band)
    result=im.load();mp=mask.load()
    bases=[]
    for x in range(w):
        previous=False;last_end=0
        for y in range(h):
            current=bool(mp[x,y])
            if current and not previous:
                gap=y-last_end;depth=min(48,max(0,gap-12));top=max(0,y-depth)
                for yy in range(max(last_end,top-24),top):
                    if not mp[x,yy]:result[x,yy]=wp[x%144,8+yy%40]
                for yy in range(top,y):result[x,yy]=wp[x%144,48+yy%47]
                if depth:
                    result[x,y-1]=wp[x%144,95];bases.append((x,y-1))
            if previous and not current:last_end=y
            previous=current
    # Join each sloping baseline with a native orthogonal stair. The vertical
    # segment sits on the wall side, preserving the floor boundary exactly.
    last={}
    for x,y in bases:
        prev=last.get(x-1,[])
        if prev:
            yy=min(prev,key=lambda z:abs(z-y))
            if abs(yy-y)<=12:
                xx=x if y>=yy else x-1
                for by in range(min(y,yy),max(y,yy)+1):
                    if not mp[xx,by]:result[xx,by]=wp[xx%144,95]
        last.setdefault(x,[]).append(y)
    return im

CURRENT=''
def run():
    global CURRENT,OFFSET
    for name,cfg in MAPS.items():
        CURRENT=name;OFFSET=48 if name=='cave_rock-plain-21' else 0;look=cfg['look'];size=tuple(v*48+OFFSET*2 for v in cfg['size']);records=[]
        floor=Image.open(BASE/f'canon/surfaces/{look}-floor.png');fp=fill_pattern(size,floor)
        im=canvas(size,'void-mass:2');mask=Image.new('1',size);d=ImageDraw.Draw(mask);d.polygon(path(cfg['outline']),fill=1)
        for p in cfg.get('holes',[]):d.polygon(path(p),fill=0)
        if name=='manor-ground':
            grass=Image.open(BASE/'canon/surfaces/yard-floor.png').crop((0,0,48,48));im=fill_pattern(size,grass)
            # Yard path to the original entry, with turf visible on every side.
            box(im,'yard-path:3',(at(1280),at(1472),at(1408),size[1]-1))
            for yy in range(at(1504),size[1],48):
                line(im,'yard-path:4',f'{at(1296)},{yy} {at(1388)},{yy}',2)
        if name=='manor-ground':
            # Continuous dark structural mass behind every internal wall.
            ImageDraw.Draw(im).polygon(path(cfg['outline']),fill=c('void-mass',2))
        im.paste(fp,(0,0),mask)
        for p in cfg.get('rugs',[]):rug(im,p)
        for p in cfg.get('pools',[]):pool(im,p)
        im=draw_walls(im,mask,look)
        im.save(REVIEW/f'D-{name}-surface.png')
        # Painted architectural features in the same cells as the source.
        for kind,xy in cfg.get('marks',[]):
            x,y=map(at,xy)
            if kind=='ritual':
                ramp='sanctum-cloth' if look=='crypt' else 'brass';stepped_ring(im,(x,y),48,48,ramp,4)
                for dx,dy in [(-48,0),(48,0),(0,-48),(0,48)]:im.alpha_composite(sprite('candles'),(x+dx-24,y+dy-24))
            elif kind=='pit':
                stepped_ring(im,(x,y),48,33,'dark-masonry',2)
                ImageDraw.Draw(im).ellipse((x-40,y-25,x+40,y+25),fill=c('void-mass',1))
            elif kind=='green-altar':
                framed(im,(x-25,y-6,x+25,y+20),'dark-masonry',2);framed(im,(x-9,y-52,x+9,y-7),'overgrowth',4);box(im,'overgrowth:5',(x-7,y-49,x-5,y-16))
            elif kind=='stair-dais':
                for i in range(6):
                    framed(im,(x-54,y-72+i*23,x+54,y-52+i*23),'limestone' if look=='temple' else 'dark-masonry',3)
        focus=None
        if 'feature' in cfg:
            kind,data=cfg['feature']
            focus={'hoard':feature_hoard,'breach':feature_breach,'sanctum':feature_sanctum}[kind](im,data)
            bracket(im,*focus,'lair-'+kind)
        # Approach dressing stays within the material/dressing ramps, and increases
        # towards the chamber. Hand-selected positions follow the source route.
        dress=[]  # Unique route dressing is authored by d_redraw_scene.approach.
        # Doors cut the complete band by replacing it with their own dark opening.
        for state,x,y in cfg.get('doors',[]):
            kind=('airlock-' if name=='station_lab' else 'door-')+state
            place(im,kind,(x,y),records)
        objects=[]
        for kind,positions in cfg['items'].items():
            for xy in positions:objects.append((xy[1],kind,xy,'reference'))
        for kind,positions in cfg.get('added',{}).items():
            for xy in positions:objects.append((xy[1],kind,xy,'required state addition'))
        for kind,xy in dress:objects.append((xy[1],kind,xy,'approach dressing'))
        # Exact source locations, Y-sorted. Party is drawn last over its stair cell.
        for _,kind,xy,group in sorted(objects,key=lambda a:(a[0],a[1]=='party')):place(im,kind,xy,records,group)
        # Legacy party marker stays above the staircase under its feet.
        for xy in cfg['items'].get('party',[]):
            pic=sprite('party');a,b=map(at,xy);im.alpha_composite(pic,(a-24,b-24))
        if name=='hoard-keep':
            for sx,sy,ww in [(640,112,12),(688,140,9),(720,160,7),(736,172,8),(672,188,14),(648,208,10),(704,232,9)]:
                a,b=at(sx),at(sy);framed(im,(a-ww//2,b-2,a+ww//2,b+3),'loot-gold',5)
        for sx,sy in {'hoard-keep':[(332,1152)],'breach-temple':[(640,920)],'sanctum-crypt':[(1616,256),(576,784)]}.get(name,[]):
            a,b=at(sx),at(sy);framed(im,(a-4,b-4,a+4,b+3),'loot-gold',5);box(im,'loot-gold:1',(a-1,b-1,a+1,b+1));box(im,'loot-gold:5',(a-1,b+4,a+1,b+13));box(im,'loot-gold:5',(a+1,b+10,a+5,b+12))
        inset=broken_inset(im,cfg['feature'][0]) if 'feature' in cfg else None
        im.save(OUT/f'{name}.png');im.resize((size[0]*2,size[1]*2),Image.Resampling.NEAREST).save(OUT/f'{name}-2x.png')
        grey=im.convert('L').convert('RGBA');grey.save(OUT/f'{name}-grey.png');grey.resize((size[0]//4,size[1]//4),Image.Resampling.NEAREST).save(OUT/f'{name}-squint.png')
        mask.save(REVIEW/f'D-{name}-floor-mask.png');MANIFEST[name]=dict(size=list(size),cell_size=48,objects=records,feature=focus,broken_inset=inset)
    (OUT/'layout.json').write_text(json.dumps(MANIFEST,indent=2)+'\n')
if __name__=='__main__':run()
