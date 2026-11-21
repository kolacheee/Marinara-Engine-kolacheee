"""Critic 1 scene pencil: native features, orientation-aware openings, unique dressing."""
from PIL import Image,ImageDraw,ImageChops
import d_frames as F
from draw_proofs import BASE,c
from redraw_critic21 import poly,line,box
from d_sprites import new,framed
from d_layouts import MAPS

original_sprite=F.sprite
original_place=F.place
original_walls=F.draw_walls
original_rug=F.rug
FLOOR_MASK=None

def ellipse(im,b,r,s):ImageDraw.Draw(im).ellipse(b,fill=c(r,s))

def ring(im,centre,rx,ry,ramp,step=5):
    # Native integer ellipse boundaries, not polygon chords or resized artwork.
    x,y=centre;d=ImageDraw.Draw(im)
    d.ellipse((x-rx,y-ry,x+rx,y+ry),outline=c(ramp,2),width=10)
    d.ellipse((x-rx+2,y-ry+2,x+rx-2,y+ry-2),outline=c(ramp,step),width=6)
    d.ellipse((x-rx+3,y-ry+3,x+rx-3,y+ry-3),outline=c(ramp,min(step+1,6)),width=1)
    return [(x-rx,y),(x,y-ry),(x+rx,y),(x,y+ry)]

def ritual_mark(im,x,y,r):
    # Interlaced cross and diamond on the original ritual centre.
    line(im,r+':2',f'{x-28},{y} {x},{y-28} {x+28},{y} {x},{y+28} {x-28},{y}',5)
    line(im,r+':5',f'{x-28},{y} {x},{y-28} {x+28},{y} {x},{y+28} {x-28},{y}',3)
    line(im,r+':4',f'{x-19},{y-19} {x+19},{y+19}',3);line(im,r+':4',f'{x+19},{y-19} {x-19},{y+19}',3)
    box(im,r+':2',(x-6,y-6,x+6,y+6));box(im,r+':5',(x-4,y-4,x+4,y+4))

def hoard(im,bounds):
    x,y,u,v=map(F.at,bounds);w=u-x;h=v-y;f=new(w+1,h+1)
    # An overlapping stepped silhouette of boxes, plate stacks and bullion.
    poly(f,'hoard-bronze:1',f'7,{h-12} 7,142 18,142 18,92 37,92 37,56 62,56 62,29 98,29 98,14 153,14 153,24 184,24 184,45 216,45 216,85 239,85 239,140 {w-5},140 {w-5},{h-10} {w-26},{h} 30,{h}')
    # Hand-positioned cargo chests establish weight underneath the loose hoard.
    for a,b,ww,hh in [(36,109,69,42),(136,92,66,42),(78,173,83,44),(179,169,58,39)]:
        framed(f,(a,b,a+ww,b+hh),'wood-oak',2);box(f,'hoard-bronze:4',(a+1,b+1,a+ww-1,b+13));box(f,'hoard-bronze:5',(a+3,b+2,a+ww-3,b+6))
        for xx in (a+9,a+ww-12):box(f,'hoard-bronze:5',(xx,b+7,xx+5,b+hh-2));box(f,'hoard-bronze:6',(xx,b+7,xx+1,b+hh-4))
        line(f,'wood-oak:3',f'{a+16},{b+24} {a+ww-16},{b+24}',1)
    # The main body is actual bullion; varying rows overlap, no circular base blobs.
    bars=[(95,18,40),(135,26,37),(64,35,39),(104,43,51),(158,45,42),(41,61,46),(88,65,43),(133,66,38),(179,70,40),
          (24,93,38),(62,89,48),(109,91,44),(156,91,45),(198,101,36),
          (17,141,42),(55,150,37),(94,139,43),(136,142,50),(181,145,47),(220,157,28),
          (17,187,49),(32,211,43),(69,219,45),(112,218,41),(157,214,44),(202,210,39)]
    for i,(a,b,ww) in enumerate(bars):
        if b+16>h:continue
        poly(f,'hoard-bronze:1',f'{a},{b+5} {a+5},{b} {a+ww-5},{b} {a+ww},{b+5} {a+ww},{b+15} {a},{b+15}')
        poly(f,'hoard-bronze:5',f'{a+1},{b+5} {a+5},{b+1} {a+ww-5},{b+1} {a+ww-1},{b+5} {a+ww-1},{b+8} {a+1},{b+8}')
        box(f,'hoard-bronze:4',(a+1,b+9,a+ww-1,b+14));line(f,'hoard-bronze:6',f'{a+6},{b+2} {a+ww-6},{b+2}',1)
        if ww>40:box(f,'hoard-bronze:3',(a+ww//2-3,b+10,a+ww//2+3,b+12))
    # A tilted shield, lidded urn and two silver plate stacks interrupt the ingots.
    poly(f,'iron:1','103,106 134,106 138,111 138,135 134,143 119,154 104,143 100,135 100,111')
    poly(f,'iron:4','105,108 132,108 136,112 136,134 132,141 119,151 106,141 102,134 102,112')
    line(f,'hoard-bronze:5','119,111 119,145',4);line(f,'hoard-bronze:5','107,123 131,123',4)
    for a,b,ww in [(39,115,27),(179,116,30)]:
        for yy in (b+12,b+8,b+4,b):
            poly(f,'hoard-bronze:2',f'{a},{yy+3} {a+4},{yy} {a+ww-4},{yy} {a+ww},{yy+3} {a+ww},{yy+5} {a+ww-4},{yy+8} {a+4},{yy+8} {a},{yy+5}')
            box(f,'hoard-bronze:5',(a+3,yy+2,a+ww-3,yy+4));line(f,'hoard-bronze:6',f'{a+6},{yy+1} {a+ww-6},{yy+1}',1)
    poly(f,'hoard-bronze:1','157,153 171,153 171,160 180,166 180,184 174,193 153,193 147,184 147,166 157,160')
    poly(f,'hoard-bronze:5','158,154 170,154 170,161 177,168 177,183 172,189 155,189 150,183 150,168 158,161')
    box(f,'hoard-bronze:3',(162,166,174,184));line(f,'hoard-bronze:6','154,170 154,180',2)
    fx=F.at(448)-x;fy=F.at(1280)-y
    framed(f,(fx-20,fy-12,fx+20,fy+12),'lair-hoard',5);box(f,'lair-hoard:2',(fx-15,fy-7,fx+15,fy+5));poly(f,'lair-hoard:6',f'{fx-8},{fy+1} {fx-8},{fy-5} {fx-3},{fy-5} {fx},{fy-12} {fx+3},{fy-6} {fx+8},{fy-2} {fx+6},{fy+3}')
    im.alpha_composite(f,(x,y));return [fx+x,fy+y]

def breach(im,points):
    # Independent banks follow the exact original spine, with deliberately varied widths.
    xy=[(F.at(x),F.at(y)) for x,y in points]
    widths=[10,15,22,14,20,12,25,18,12,23,16,26,15,20,12]
    upper=[];lower=[];core_top=[];core_bottom=[]
    profiles=[(0,4,-3,6),(3,-2,6,0),(-2,6,1,-4),(4,0,-4,5),(0,-3,5,2),(5,-4,2,0),(1,6,-2,4),(-3,2,7,0),(3,-5,1,6),(2,4,-3,0),(0,6,-4,3),(-4,1,5,2),(4,-2,0,5),(1,5,-4,2)]
    for i,((x,y),(xx,yy)) in enumerate(zip(xy,xy[1:])):
        for j,off in enumerate(profiles[i]):
            px=x+(xx-x)*j//4;py=y+(yy-y)*j//4
            ww=widths[i]+off
            upper.extend([(px,py-ww),(px+5,py-ww)])
            lower.extend([(px,py+ww//2+6),(px+4,py+ww//2+6)])
            core_top.extend([(px,py-max(3,ww//2)),(px+3,py-max(3,ww//2))])
            core_bottom.extend([(px,py+max(3,ww//4)),(px+3,py+max(3,ww//4))])
    x,y=xy[-1];upper.append((x,y-10));lower.append((x,y+8));core_top.append((x,y-4));core_bottom.append((x,y+3))
    d=ImageDraw.Draw(im);d.polygon(upper+lower[::-1],fill=c('breach-stone',1))
    d.line(upper,fill=c('sandstone',2),width=4);d.line(lower,fill=c('breach-stone',3),width=3)
    d.polygon(core_top+core_bottom[::-1],fill=c('lair-breach',4))
    for i in [0,2,4,6,8,10,12]:
        x,y=xy[i];xx,yy=xy[i+1]
        d.polygon([(x+3,y-2),(x+13,y-5),(xx-4,yy-3),(xx-1,yy+3),(x+8,y+4)],fill=c('lair-breach',6))
    # Fractured bank plates overhang the interior and interrupt its parallel edges.
    for i in [1,3,5,7,9,11,13]:
        x,y=xy[i];ww=widths[i]
        poly(im,'sandstone:2',f'{x-17},{y-ww-9} {x+7},{y-ww-9} {x+16},{y-ww-1} {x+12},{y-4} {x+1},{y-8} {x-8},{y-3} {x-17},{y-10}')
        line(im,'sandstone:4',f'{x-14},{y-ww-7} {x+5},{y-ww-7} {x+12},{y-ww-1}',2)
        line(im,'breach-stone:1',f'{x-3},{y-ww-7} {x-3},{y-ww+1} {x+2},{y-ww+1} {x+2},{y-6}',2)
    for a,b,ww in [(190,711,18),(292,680,21),(383,720,24),(448,616,20),(575,727,26),(693,617,22),(748,666,18)]:
        poly(im,'breach-stone:1',f'{a},{b+4} {a+5},{b} {a+ww},{b} {a+ww+3},{b+6} {a+ww-2},{b+13} {a},{b+11}')
        poly(im,'sandstone:3',f'{a+2},{b+4} {a+6},{b+1} {a+ww-1},{b+1} {a+ww+1},{b+5} {a+ww-3},{b+8} {a+2},{b+7}')
    x,y=xy[-1];framed(im,(x-14,y-59,x+14,y-13),'breach-stone',3);box(im,'lair-breach:1',(x-8,y-54,x+8,y-17));line(im,'lair-breach:6',f'{x},{y-50} {x},{y-39} {x-3},{y-39} {x-3},{y-29} {x+2},{y-29} {x+2},{y-20}',3)
    return [x,y-35]

RUNES=['-5,0 0,-6 5,0 0,6 -5,0 5,0','-5,-6 0,-2 5,-6 5,3 0,7 -5,3 -5,-6','-5,-6 5,6 0,6 0,-6 -5,-6 5,6','-5,-5 0,0 -5,5 5,5 0,0 5,-5','0,-7 0,7 -5,2 0,-3 5,2 0,7']
def rune(im,x,y,i,r='lair-sanctum'):
    ps=[(x+int(a),y+int(b)) for a,b in [p.split(',') for p in RUNES[i%len(RUNES)].split()]];ImageDraw.Draw(im).line(ps,fill=c(r,6),width=2)

def sanctum(im,bounds):
    x,y,u,v=map(F.at,bounds);cx=(x+u)//2;cy=(y+v)//2
    ring(im,(cx,cy),(u-x)//2,(v-y)//2,'lair-sanctum',5)
    # Engraved violet stone circuit: dark inscription breaks the pale inlay.
    for a,b,i in [(cx-178,cy-133,0),(cx-105,cy-196,1),(cx+67,cy-213,2),(cx+166,cy-155,3),(cx+225,cy-61,4),(cx+217,cy+92,0),(cx+143,cy+181,1),(cx+26,cy+222,2),(cx-105,cy+201,3),(cx-210,cy+108,4)]:
        rune(im,a,b,i)
        line(im,'lair-sanctum:2',f'{a-4},{b-3} {a+3},{b-3} {a+3},{b+4}',2)
    marks=[(256,768),(320,576),(384,512),(512,512),(832,704),(896,768),(832,832),(832,960),(768,1024),(576,1088),(448,1088),(384,1024),(320,960)]
    for i,(sx,sy) in enumerate(marks):
        a,b=F.at(sx),F.at(sy)
        width=[14,16,13,15,17,14,16,13,15,14,17,15,13][i]
        poly(im,'dark-masonry:1',f'{a-width},{b-13} {a-width+4},{b-20} {a+width-3},{b-20} {a+width},{b-14} {a+width},{b+11} {a+width-4},{b+16} {a-width+3},{b+16} {a-width},{b+11}')
        poly(im,'dark-masonry:4',f'{a-width+1},{b-12} {a-width+5},{b-18} {a+width-4},{b-18} {a+width-1},{b-13} {a+width-1},{b+4} {a+width-5},{b+8} {a-width+4},{b+8} {a-width+1},{b+3}')
        box(im,'dark-masonry:3',(a-width+3,b+9,a+width-3,b+14))
        line(im,'dark-masonry:5',f'{a-width+5},{b-17} {a+width-5},{b-17}',2)
        line(im,'dark-masonry:2',f'{a+width-6},{b-15} {a+width-6},{b-10} {a+width-3},{b-10}',1)
        rune(im,a,b-4,i)
        line(im,'lair-sanctum:3',f'{a-7},{b+6} {a+7},{b+6}',1)
    # Inscribed cardinal spokes and separated rune groups connect the stone sockets.
    for a,b,i in [(cx,cy-200,2),(cx+171,cy-120,4),(cx+193,cy+76,0),(cx-182,cy+107,1),(cx-128,cy-167,3),(cx+93,cy+186,2)]:rune(im,a,b,i)
    a,b=F.at(576),F.at(448)
    framed(im,(a-20,b-43,a+20,b+20),'dark-masonry',3);box(im,'dark-masonry:5',(a-18,b-42,a+18,b-36));box(im,'lair-sanctum:2',(a-14,b-31,a+14,b+12));rune(im,a,b-19,1);rune(im,a,b+3,4)
    return [a,b]

def rug(im,polygon):
    original_rug(im,polygon)
    mask=Image.new('1',im.size);ImageDraw.Draw(mask).polygon(F.path(polygon),fill=1)
    art=new(*im.size)
    # Woven border stitches follow the actual horizontal and vertical runner edges.
    ps=F.path(polygon)
    for (x,y),(u,v) in zip(ps,ps[1:]+ps[:1]):
        if y==v:
            for xx in range(min(x,u)+12,max(x,u)-8,18):line(art,'textiles-russet:4',f'{xx},{y+6} {xx+6},{y+6}',1);line(art,'textiles-russet:4',f'{xx},{y-6} {xx+6},{y-6}',1)
        elif x==u:
            for yy in range(min(y,v)+12,max(y,v)-8,18):line(art,'textiles-russet:4',f'{x+6},{yy} {x+6},{yy+6}',1);line(art,'textiles-russet:4',f'{x-6},{yy} {x-6},{yy+6}',1)
    for x,y in [(432,410),(675,410),(1038,600),(1160,582)]:
        if mask.getpixel((x,y)):
            poly(art,'textiles-russet:1',f'{x-20},{y} {x},{y-18} {x+20},{y} {x},{y+18}')
            poly(art,'textiles-russet:4',f'{x-16},{y} {x},{y-14} {x+16},{y} {x},{y+14}')
            poly(art,'textiles-russet:2',f'{x-10},{y} {x},{y-8} {x+10},{y} {x},{y+8}')
    art.putalpha(ImageChops.multiply(art.getchannel('A'),mask.convert('L')));im.alpha_composite(art)

def opening(im,state,xy,records,ew=False):
    x,y=map(F.at,xy);look=MAPS[F.CURRENT]['look'];r='station-panels' if look=='station_lab' else ('grey-brown-rock' if look=='cave_rock' else 'dark-masonry' if look=='crypt' else 'sandstone' if look=='temple' else 'limestone')
    # Restore actual floor through the band before drawing the wall returns.
    floor=Image.open(BASE/f'canon/surfaces/{look}-floor.png');p=im.load()
    if ew:
        for yy in range(y-20,y+21):
            for xx in range(x-35,x+36):p[xx,yy]=floor.getpixel((xx%288,yy%288))
        for yy in [y-30,y+17]:
            box(im,r+':1',(x-15,yy,x+15,yy+10));box(im,r+':2',(x-14,yy+1,x+14,yy+8));box(im,r+':3',(x-14,yy+1,x+14,yy+2))
        line(im,r+':4',f'{x-19},{y-18} {x-19},{y+15}',2);line(im,r+':3',f'{x+19},{y-18} {x+19},{y+15}',1)
        if state=='secret':
            box(im,r+':2',(x-12,y-17,x+6,y+9));line(im,r+':1',f'{x-11},{y-7} {x+5},{y-7} {x+5},{y+3} {x-11},{y+3}',1);line(im,r+':3',f'{x-11},{y-16} {x+5},{y-16}',1);box(im,r+':1',(x+7,y-15,x+12,y+12));line(im,r+':4',f'{x-27},{y+16} {x+26},{y+16}',2)
        elif state=='open':
            framed(im,(x-10,y-18,x+14,y-12),'station-panels' if look=='station_lab' else 'wood-oak',3)
        else:
            framed(im,(x-4,y-18,x+4,y+15),'wood-oak',3);box(im,'iron:3',(x-6,y-8,x+6,y-4));box(im,'loot-gold:5',(x-5,y+2,x+5,y+11))
        bounds=[x-36,y-30,x+36,y+28]
    else:
        if look=='cave_rock' and state=='locked':
            mp=FLOOR_MASK.load();left=x;right=x
            while left>0 and mp[left,y]:left-=1
            while right<im.width-1 and mp[right,y]:right+=1
            for a,b in [(left,x-21),(x+21,right)]:
                if b>=a:
                    box(im,r+':1',(a,y-52,b,y+23));box(im,r+':2',(a,y-51,b,y+21));line(im,r+':3',f'{a},{y-50} {b},{y-50}',2);line(im,'mud:3',f'{a},{y-34} {b},{y-34}',1)
        # Door occupies a full-height band opening; returned stone connects both jambs.
        box(im,r+':1',(x-28,y-51,x+28,y+23));box(im,r+':2',(x-27,y-50,x+27,y-43))
        for xx in [x-28,x+21]:
            box(im,r+':2',(xx,y-42,xx+7,y+22));line(im,r+':3',f'{xx+1},{y-41} {xx+1},{y+20}',1)
            for yy in [y-28,y-12,y+4]:line(im,r+':1',f'{xx},{yy} {xx+7},{yy}',1)
        box(im,'void-mass:1',(x-20,y-42,x+20,y+19));box(im,r+':4',(x-20,y+20,x+20,y+22))
        if state=='secret':
            # A pulled masonry slab with the same laid joints; the reveal is a gap.
            box(im,r+':2',(x-19,y-41,x+3,y+14));box(im,r+':3',(x-18,y-40,x+1,y-38));box(im,r+':1',(x+4,y-37,x+8,y+16))
            for yy in [y-26,y-10,y+6]:line(im,r+':1',f'{x-18},{yy} {x+2},{yy}',1)
            line(im,r+':1',f'{x-7},{y-40} {x-7},{y-26} {x-14},{y-26} {x-14},{y-10}',1)
            poly(im,r+':3',f'{x-18},{y+16} {x+4},{y+16} {x+10},{y+21} {x-14},{y+21}')
        else:
            pic=original_sprite(('airlock-' if look=='station_lab' else 'door-')+state)
            # Copy only the authored door interior, preserving the returned material.
            im.alpha_composite(pic.crop((9,26,39,88)),(x-15,y-42))
        bounds=[x-28,y-51,x+29,y+24]
    records.append(dict(item=('airlock-' if look=='station_lab' else 'door-')+state,source=list(xy),centre=[x,y],bounds=bounds,group='reference',orientation='east-west' if ew else 'north-south'))

EW={'hoard-keep':{(512,320),(512,432),(896,432),(864,960)},'breach-temple':{(704,248),(1536,312),(1472,568)},'sanctum-crypt':{(1280,256),(1472,256),(1280,512),(1408,576),(1728,576)},'station_lab':{(608,416)},'manor-ground':{(736,368),(928,368),(640,576),(768,576),(960,576),(1472,624),(1504,304),(1984,560),(1856,704),(2048,704),(1792,816),(384,640),(1280,944),(1664,1072),(1536,1160),(1984,1160),(1792,1224),(1728,1264),(1280,1328)}}

def place(im,name,xy,records,group='reference'):
    source_item=name
    if name.startswith(('door-','airlock-')):
        opening(im,name.rsplit('-',1)[1],xy,records,tuple(xy) in EW.get(F.CURRENT,set()));records[-1]['group']=group;return
    if F.CURRENT=='cave_rock-plain-21' and name=='weapon-rack':name='mine-support'
    if name=='temple-study':name='altar'
    if F.CURRENT=='station_lab':name={'table-short':'lab-table','bookshelf':'lab-shelf','chair':'lab-chair','cabinet':'lab-shelf'}.get(name,name)
    if F.CURRENT=='cave_rock-plain-21' and name=='stairs-down':
        # Wider native staircase at the same centre; side treads remain visible under party.
        x,y=map(F.at,xy);framed(im,(x-39,y-27,x+39,y+24),'grey-brown-rock',2);box(im,'void-mass:1',(x-35,y-23,x+35,y+19))
        for i in range(6):
            yy=y-21+i*7;box(im,'grey-brown-rock:3',(x-33+i,yy,x+33-i,yy+5));box(im,'grey-brown-rock:5',(x-33+i,yy,x+33-i,yy+1))
        records.append(dict(item=name,source=list(xy),centre=[x,y],bounds=[x-40,y-28,x+40,y+25],group=group));return
    original_place(im,name,xy,records,group)
    records[-1]['source_item']=source_item

def lab_bay(im):
    # Connected specimen rail and three different bench fittings behind original tanks.
    framed(im,(522,126,795,150),'station-panels',2);box(im,'clean-tile:4',(523,127,794,137));box(im,'clean-tile:5',(525,127,792,128))
    for x in (534,642,750):
        line(im,'pipes:2',f'{x},139 {x},155 {x+6},155',4);line(im,'pipes:4',f'{x},139 {x},153',1)
    for x in (527,657,787):box(im,'station-panels:1',(x,151,x+5,189));box(im,'station-panels:4',(x+1,151,x+2,187))
    framed(im,(582,144,622,174),'clean-tile',3);box(im,'tank-glass:2',(587,148,617,161));line(im,'tank-glass:5','590,155 596,155 596,151 603,151 603,157 613,157',1)
    framed(im,(690,150,725,174),'clean-tile',4);box(im,'station-panels:2',(695,154,719,160));box(im,'tank-glass:4',(699,164,714,168))
    # Joint-directed spill, one connected pool with a dark contact edge.
    poly(im,'spills:2','609,235 633,235 633,240 647,240 647,250 669,250 669,258 658,258 658,267 630,267 630,262 612,262 612,252 604,252 604,242 609,242')
    poly(im,'spills:3','610,237 630,237 630,242 645,242 645,252 666,252 666,256 655,256 655,264 632,264 632,260 614,260 614,250 607,250 607,243 610,243')
    line(im,'spills:4','612,239 625,239 625,243 638,243',2)


def walls(im,mask,look):
    global FLOOR_MASK
    FLOOR_MASK=mask
    im=original_walls(im,mask,look)
    if F.CURRENT=='cave_rock-plain-21':
        # Scene-scale compacted route and exposed shelves, clipped to the unchanged floor.
        art=new(*im.size);d=ImageDraw.Draw(art)
        route=[(330,410),(520,430),(710,520),(930,520),(1150,490),(1371,552),(1540,630),(1600,840),(1390,1000),(1100,1000),(960,1140)]
        d.line(route,fill=c('mud',4),width=38)
        for x,y,ww in [(350,277,62),(729,651,86),(1160,313,73),(1570,1005,90),(504,1090,68)]:
            poly(art,'mud:5',f'{x},{y+8} {x+12},{y} {x+ww-16},{y} {x+ww},{y+8} {x+ww},{y+18} {x+ww-12},{y+23} {x+14},{y+23} {x},{y+15}')
            line(art,'grey-brown-rock:3',f'{x+6},{y+16} {x+24},{y+16} {x+24},{y+18} {x+ww-12},{y+18}',2)
        art.putalpha(ImageChops.multiply(art.getchannel('A'),mask.convert('L')));im.alpha_composite(art)
        # Stone returns attach the added open state to the cave's northern mass.
        x,y=F.at(1252),F.at(168)
        for xx in (x-29,x+21):
            box(im,'grey-brown-rock:1',(xx,y-73,xx+8,y+22));box(im,'grey-brown-rock:2',(xx+1,y-72,xx+7,y+20));line(im,'mud:3',f'{xx+1},{y-70} {xx+1},{y+19}',1)
    if F.CURRENT=='station_lab':lab_bay(im)
    return im

def approach(im,name):
    # Each location is a separate authored vignette along the approach, including corridor.
    if name=='hoard-keep':
        for x,y,ww in [(498,470,17),(564,646,26),(564,763,34)]:
            line(im,'hoard-bronze:2',f'{x-12},{y-9} {x},{y-9} {x},{y-3} {x+ww},{y-3}',2)
            framed(im,(x,y,x+ww,y+9),'hoard-bronze',5);box(im,'hoard-bronze:4',(x+1,y+6,x+ww-1,y+8))
        im.alpha_composite(original_sprite('crate'),(480,430))
        poly(im,'wood-oak:1','544,730 570,730 584,744 580,760 549,760 541,749');line(im,'wood-oak:4','546,733 565,733 574,742',4);line(im,'wood-oak:3','548,748 577,754',4);line(im,'iron:3','553,735 553,754',3)
    elif name=='breach-temple':
        for x,y,ww,hh in [(1053,410,16,22),(1050,470,23,29),(1046,530,31,23),(1004,555,39,18),(860,561,46,25)]:
            poly(im,'breach-stone:2',f'{x-ww},{y} {x-ww//2},{y-4} {x},{y} {x+ww//2},{y+hh//2} {x+ww},{y+hh} {x+ww-7},{y+hh+5} {x},{y+hh//2+4} {x-ww//2},{y+4} {x-ww},{y+4}')
            line(im,'sandstone:2',f'{x-ww},{y-3} {x-ww//2},{y-7} {x},{y-3}',2)
            poly(im,'sandstone:4',f'{x+4},{y-9} {x+15},{y-9} {x+18},{y-4} {x+10},{y-2} {x+4},{y-5}')
    elif name=='sanctum-crypt':
        for x,y,ww in [(766,242,16),(703,251,22),(632,270,30),(561,290,35),(513,344,38)]:
            poly(im,'sanctum-cloth:1',f'{x},{y} {x+ww},{y} {x+ww},{y+12} {x+ww-8},{y+12} {x+ww-8},{y+18} {x+4},{y+18} {x+4},{y+9} {x},{y+9}')
            line(im,'sanctum-cloth:4',f'{x+3},{y+3} {x+ww-4},{y+3} {x+ww-4},{y+9}',2)
            if ww>=30:
                line(im,'bone:3',f'{x-8},{y+10} {x-8},{y+20} {x-15},{y+20}',3);box(im,'bone:4',(x-16,y+18,x-12,y+21))

# Small wrappers run the late features after object sorting, without replacing the layout.
original_inset=F.broken_inset
def inset(im,kind):
    approach(im,F.CURRENT)
    return original_inset(im,kind)

# Disable only the superseded repeated approach and old spill in the original renderer.
def install():
    F.feature_hoard=hoard;F.feature_breach=breach;F.feature_sanctum=sanctum;F.stepped_ring=ring
    F.place=place;F.rug=rug;F.draw_walls=walls;F.broken_inset=inset
    # Ritual centre marks are inserted just before their candle objects.
    global original_place
    basic=original_place
    seen=set()
    def with_marks(im,name,xy,records,group='reference'):
        key=(F.CURRENT,id(im))
        if key not in seen:
            seen.add(key)
            for kind,pos in MAPS[F.CURRENT].get('marks',[]):
                if kind=='ritual':ritual_mark(im,*map(F.at,pos),'sanctum-cloth' if F.CURRENT=='sanctum-crypt' else 'brass')
        basic(im,name,xy,records,group)
    original_place=with_marks

if __name__=='__main__':install();F.run()
