"""Second-round native scene repairs; all unchanged layout data stays authoritative."""
import math
from PIL import Image,ImageDraw,ImageChops
import d_frames as F
import d_redraw_scene as R
from d_layouts import MAPS
from d_sprites import new,framed
from draw_proofs import BASE,c
from redraw_critic21 import poly,line,box


def ingot(im,x,y,w=34,h=17):
    # Orthographic bullion, with a top bevel and stamped, shaded front.
    poly(im,'hoard-bronze:1',f'{x},{y+5} {x+5},{y} {x+w-5},{y} {x+w},{y+5} {x+w},{y+h} {x},{y+h}')
    poly(im,'hoard-bronze:5',f'{x+1},{y+5} {x+5},{y+1} {x+w-5},{y+1} {x+w-1},{y+5} {x+w-1},{y+8} {x+1},{y+8}')
    box(im,'hoard-bronze:4',(x+1,y+9,x+w-1,y+h-1));line(im,'hoard-bronze:3',f'{x+2},{y+h-2} {x+w-2},{y+h-2}',1)
    line(im,'hoard-bronze:6',f'{x+6},{y+2} {x+w-6},{y+2}',1)
    if w>29:
        line(im,'hoard-bronze:3',f'{x+w//2-3},{y+11} {x+w//2+3},{y+11} {x+w//2+3},{y+13} {x+w//2-3},{y+13}',1)


def cargo(im,x,y,w,h,broken=False):
    framed(im,(x,y,x+w,y+h),'wood-oak',2)
    box(im,'wood-oak:4',(x+1,y+1,x+w-1,y+11));line(im,'wood-oak:5',f'{x+2},{y+1} {x+w-2},{y+1}',1)
    for yy in range(y+13,y+h,7):
        line(im,'wood-oak:3',f'{x+2},{yy} {x+w-2},{yy}',1)
        line(im,'wood-oak:1',f'{x+2},{yy+1} {x+w-2},{yy+1}',1)
    for xx in [x+7,x+w-11]:
        box(im,'hoard-bronze:3',(xx,y+3,xx+4,y+h-2));line(im,'hoard-bronze:5',f'{xx},{y+3} {xx},{y+h-3}',1)
        box(im,'iron:1',(xx+2,y+15,xx+3,y+16));box(im,'iron:1',(xx+2,y+h-6,xx+3,y+h-5))
    if broken:
        poly(im,'wood-oak:1',f'{x+18},{y+10} {x+28},{y+10} {x+24},{y+19} {x+31},{y+19} {x+25},{y+29} {x+15},{y+29}')
    else:
        framed(im,(x+w//2-4,y+13,x+w//2+4,y+22),'hoard-bronze',4)
        box(im,'iron:1',(x+w//2-1,y+16,x+w//2+1,y+19))


def platter(im,x,y,w):
    for yy in [y+9,y+6,y+3,y]:
        poly(im,'hoard-bronze:2',f'{x},{yy+3} {x+5},{yy} {x+w-5},{yy} {x+w},{yy+3} {x+w},{yy+6} {x+w-5},{yy+9} {x+5},{yy+9} {x},{yy+6}')
        line(im,'hoard-bronze:5',f'{x+5},{yy+1} {x+w-5},{yy+1}',1)
        line(im,'hoard-bronze:4',f'{x+2},{yy+6} {x+w-2},{yy+6}',1)
    box(im,'hoard-bronze:3',(x+5,y+3,x+w-5,y+5));line(im,'hoard-bronze:6',f'{x+7},{y+2} {x+w-7},{y+2}',1)


def hoard(im,bounds):
    x,y,u,v=map(F.at,bounds);f=new(u-x+1,v-y+1)
    # Packed, mutually occluding objects, without any silhouette backing polygon.
    cargo(f,78,28,88,60);cargo(f,33,76,81,59);cargo(f,134,67,78,61)
    cargo(f,15,129,78,62);cargo(f,93,119,81,66);cargo(f,173,143,64,63)
    cargo(f,46,176,88,49,True);cargo(f,125,183,76,42)
    # Separate piles are deliberately connected through overlaps and cargo contact.
    bars=[(102,13,42),(139,27,33),(71,37,45),(105,47,47),(151,49,41),
          (53,63,43),(91,72,42),(129,66,46),(169,83,39),
          (29,95,40),(64,89,41),(102,96,43),(142,100,44),(186,108,35),
          (15,120,40),(49,127,41),(87,117,39),(118,129,43),(161,126,38),
          (26,159,43),(66,151,42),(110,161,41),(147,153,48),(194,164,44),
          (15,187,41),(50,200,44),(92,192,44),(132,205,43),(173,198,40),(208,213,35),
          (33,218,43),(72,222,47),(114,219,40),(155,224,42)]
    for a,b,w in bars:ingot(f,a,b,w,17)
    platter(f,32,139,35);platter(f,180,133,34);platter(f,126,177,29)
    # Oval shield is made from authored stepped runs and edge studs, in front of cargo.
    poly(f,'iron:1','96,99 125,99 133,107 133,139 128,148 113,160 98,148 92,139 92,107')
    poly(f,'iron:3','97,101 124,101 131,108 131,138 126,146 113,157 100,146 94,138 94,108')
    poly(f,'iron:4','99,103 122,103 129,109 129,121 96,121 96,109')
    line(f,'hoard-bronze:4','113,106 113,149',3);line(f,'hoard-bronze:4','100,119 126,119',3)
    for a,b in [(99,110),(125,110),(98,134),(127,134),(112,149)]:box(f,'hoard-bronze:5',(a,b,a+1,b+1))
    # Curved urn with rolled lip, belly planes, a pedestal foot and chased bands.
    poly(f,'hoard-bronze:1','151,150 173,150 173,158 180,165 184,177 184,188 179,197 173,201 173,205 150,205 150,201 143,194 140,185 140,177 144,165 151,158')
    poly(f,'hoard-bronze:4','152,153 171,153 171,159 177,166 181,178 181,187 177,195 170,199 152,199 146,192 143,185 143,178 147,167 154,160')
    poly(f,'hoard-bronze:5','152,164 158,161 159,190 155,196 149,191 146,184 146,177')
    line(f,'hoard-bronze:3','170,166 176,173 177,186 173,194',3)
    line(f,'hoard-bronze:6','152,151 171,151',1);line(f,'hoard-bronze:2','145,179 180,179',2)
    line(f,'hoard-bronze:5','146,178 180,178',1);box(f,'hoard-bronze:5',(150,202,172,204))
    fx=F.at(448)-x;fy=F.at(1280)-y
    framed(f,(fx-20,fy-12,fx+20,fy+12),'lair-hoard',5);box(f,'lair-hoard:2',(fx-15,fy-7,fx+15,fy+5))
    poly(f,'lair-hoard:6',f'{fx-8},{fy+1} {fx-8},{fy-5} {fx-3},{fy-5} {fx},{fy-12} {fx+3},{fy-6} {fx+8},{fy-2} {fx+6},{fy+3}')
    im.alpha_composite(f,(x,y));return [fx+x,fy+y]


def outline_points(cx,cy,rx,ry):
    # Author a monotone digital quadrant. Run ordering is explicit, so no ellipse
    # rasteriser can insert a 1,2,1,2 oscillation near the tangent.
    nx=max(1,round(rx*(1-1/math.sqrt(2))))
    ny=max(1,round(ry*(1-1/math.sqrt(2))))
    def runs(radius,other,count,total):
        vals=[];last=0
        for i in range(1,count+1):
            q=round(radius*math.sqrt(1-((other-i)/other)**2))
            vals.append(max(1,q-last));last=q
        vals.sort(reverse=True)
        while sum(vals)<total:
            for j in range(len(vals)):
                if j==0 or vals[j]<vals[j-1]:vals[j]+=1;break
        while sum(vals)>total:
            for j in range(len(vals)-1,-1,-1):
                if vals[j]>1 and (j==len(vals)-1 or vals[j]>vals[j+1]):vals[j]-=1;break
        return vals
    horizontal=runs(rx,ry,ny,rx-nx)
    vertical=runs(ry,rx,nx,ry-ny)
    q=[(0,-ry)];x=0;y=-ry
    for run in horizontal:
        for _ in range(run):x+=1;q.append((x,y))
        y+=1;q.append((x,y))
    for run in reversed(vertical):
        x+=1;q.append((x,y))
        for _ in range(run):y+=1;q.append((x,y))
    assert (x,y)==(rx,0),(rx,ry,x,y)
    pts=q+[(x,-y) for x,y in q[-2::-1]]+[(-x,-y) for x,y in q[1:]]+[(-x,y) for x,y in q[-2:0:-1]]
    return [(cx+x,cy+y) for x,y in pts]


def ring(im,centre,rx,ry,ramp,step=5):
    cx,cy=centre;d=ImageDraw.Draw(im)
    outer=outline_points(cx,cy,rx,ry);inner=outline_points(cx,cy,max(2,rx-8),max(2,ry-8))
    # Paint the ring as a polygon with a preserved interior; borders exactly 1 px.
    mask=Image.new('1',im.size);md=ImageDraw.Draw(mask);md.polygon(outer,fill=1);md.polygon(inner,fill=0)
    fill=new(*im.size);ImageDraw.Draw(fill).rectangle((0,0,im.width,im.height),fill=c(ramp,step));im.paste(fill,(0,0),mask)
    d=ImageDraw.Draw(im);d.line(outer+[outer[0]],fill=c(ramp,2),width=1);d.line(inner+[inner[0]],fill=c(ramp,2),width=1)
    mid=outline_points(cx,cy,max(2,rx-2),max(2,ry-2));d.line(mid+[mid[0]],fill=c(ramp,min(step+1,6)),width=1)
    return outer


def shard(im,x,y,w,h,material='sandstone'):
    # A broken slab has a broad top, an asymmetric fracture and a vertical front.
    poly(im,material+':1',f'{x},{y+4} {x+4},{y} {x+w-8},{y} {x+w-8},{y+3} {x+w},{y+3} {x+w},{y+h-3} {x+w-5},{y+h-3} {x+w-5},{y+h+4} {x+6},{y+h+4} {x+6},{y+h+1} {x},{y+h+1}')
    poly(im,material+':3',f'{x+1},{y+4} {x+4},{y+1} {x+w-9},{y+1} {x+w-9},{y+4} {x+w-1},{y+4} {x+w-1},{y+h-5} {x+w-6},{y+h-5} {x+w-6},{y+h-1} {x+7},{y+h-1} {x+7},{y+h-4} {x+1},{y+h-4}')
    line(im,material+':4',f'{x+4},{y+1} {x+w-10},{y+1}',1)
    line(im,material+':2',f'{x+7},{y+h} {x+w-6},{y+h} {x+w-6},{y+h+2}',1)
    if w>20:
        line(im,material+':2',f'{x+w//2},{y+3} {x+w//2},{y+6} {x+w//2+4},{y+6}',1)


def breach(im,points):
    xy=[(F.at(x),F.at(y)) for x,y in points];d=ImageDraw.Draw(im)
    # Broken stone bank made segment by segment with a deep front, not a flat ribbon.
    widths=[12,17,21,15,22,17,24,16,20,25,18,26,17,19,12]
    upper=[];lower=[];coreup=[];coredown=[]
    profiles=[(0,5,-2,4),(3,-3,6,1),(-2,4,0,-4),(4,1,-3,5),(0,-4,6,2),(5,-3,2,0),(1,6,-2,4),(-3,2,7,0),(3,-4,1,6),(2,4,-3,0),(0,6,-4,3),(-4,1,5,2),(4,-2,0,5),(1,5,-4,2)]
    samples=[]
    for i,((x,y),(u,v)) in enumerate(zip(xy,xy[1:])):
        for j,off in enumerate(profiles[i]):
            px=x+(u-x)*j//4;py=y+(v-y)*j//4;ww=widths[i]+off
            samples.append((px,py,ww))
            upper.extend([(px,py-ww-5),(px+4,py-ww-5)])
            lower.extend([(px,py+ww//2+10),(px+5,py+ww//2+10)])
            coreup.extend([(px,py-ww//2),(px+3,py-ww//2)])
            coredown.extend([(px,py+ww//3),(px+3,py+ww//3)])
    x,y=xy[-1];upper.append((x,y-12));lower.append((x,y+12));coreup.append((x,y-5));coredown.append((x,y+4))
    d.polygon(upper+lower[::-1],fill=c('sandstone',1))
    d.polygon(upper+coreup[::-1],fill=c('sandstone',3))
    d.polygon(coredown+lower[::-1],fill=c('sandstone',2))
    d.line(upper,fill=c('sandstone',4),width=1)
    d.polygon(coreup+coredown[::-1],fill=c('lair-breach',3))
    d.line(coredown,fill=c('sandstone',3),width=2)
    # A broken, continuous core with local hot runs, without triangular wedges.
    d.line(xy,fill=c('lair-breach',4),width=6)
    for a,b in [(0,3),(4,7),(8,10),(11,14)]:d.line(xy[a:b+1],fill=c('lair-breach',6),width=2)
    for i,(x,y,ww) in enumerate(samples):
        if i%2:
            # Bank fractures follow the varying edge and expose vertical thickness.
            line(im,'sandstone:1',f'{x},{y-ww-4} {x},{y-ww+1} {x+4},{y-ww+1} {x+4},{y-ww//2}',1)
            line(im,'sandstone:1',f'{x},{y+ww//3+2} {x},{y+ww//2+8}',1)
    for i,w,h in [(1,25,17),(3,30,19),(5,27,16),(7,33,21),(9,29,18),(11,35,20),(13,25,17)]:
        x,y=xy[i];shard(im,x-w//2,y-widths[i]-10,w,h)
    for x,y,w,h in [(190,711,18,10),(292,680,21,13),(383,720,24,14),(448,616,20,12),(575,727,26,14),(693,617,22,12),(748,666,18,10)]:shard(im,x,y,w,h)
    x,y=xy[-1];framed(im,(x-14,y-59,x+14,y-13),'breach-stone',3);box(im,'lair-breach:1',(x-8,y-54,x+8,y-17));line(im,'lair-breach:6',f'{x},{y-50} {x},{y-39} {x-3},{y-39} {x-3},{y-29} {x+2},{y-29} {x+2},{y-20}',3)
    return [x,y-35]


def sanctum(im,bounds):
    focus=R.sanctum(im,bounds)
    marks=[(256,768),(320,576),(384,512),(512,512),(832,704),(896,768),(832,832),(832,960),(768,1024),(576,1088),(448,1088),(384,1024),(320,960)]
    for i,(sx,sy) in enumerate(marks):
        x,y=F.at(sx),F.at(sy);w=[14,16,13,15,17,14,16,13,15,14,17,15,13][i]
        # The original sockets gain a projecting lid and a carved vertical plinth.
        box(im,'dark-masonry:2',(x-w+3,y+7,x+w-3,y+14))
        line(im,'dark-masonry:4',f'{x-w+4},{y+8} {x+w-4},{y+8}',1)
        for xx in (x-w+5,x+w-7):
            line(im,'dark-masonry:1',f'{xx},{y+10} {xx},{y+13}',1)
        line(im,'dark-masonry:5',f'{x-w+4},{y-12} {x-w+4},{y+1}',1)
        line(im,'dark-masonry:3',f'{x+w-5},{y-9} {x+w-5},{y+3} {x+w-9},{y+3}',1)
        line(im,'dark-masonry:2',f'{x-w+7},{y-15} {x-w+11},{y-15} {x-w+11},{y-12}',1)
        R.rune(im,x,y-4,i)
    return focus


def opening(im,state,xy,records,ew=False):
    if not ew:
        # The cave lock is built across a clear neck, away from original mining kit.
        return R.opening(im,state,xy,records,ew)
    x,y=map(F.at,xy);look=MAPS[F.CURRENT]['look'];lab=look=='station_lab'
    r={'crypt':'dark-masonry','temple':'sandstone','manor':'timber'}.get(look,'station-panels' if lab else 'limestone')
    floor=Image.open(BASE/f'canon/surfaces/{look}-floor.png')
    # One horizontal walk-through, bounded by continuous returned masonry. Narrow
    # threshold follows the band footprint; no rectangular replacement floor slab.
    for yy in range(y-16,y+18):
        for xx in range(x-23,x+24):im.putpixel((xx,yy),floor.getpixel((xx%288,yy%288)))
    # North return includes the lintel; south return ends on a one-pixel baseline.
    for yy in (y-35,y+17):
        box(im,r+':1',(x-22,yy,x+22,yy+17));box(im,r+':2',(x-21,yy+1,x+21,yy+16))
        box(im,r+':3',(x-21,yy+1,x+21,yy+6));line(im,r+':4',f'{x-20},{yy+1} {x+20},{yy+1}',1)
        line(im,r+':1',f'{x-5},{yy+1} {x-5},{yy+6}',1);line(im,r+':1',f'{x+7},{yy+7} {x+7},{yy+16}',1)
    # Full jamb posts connect the returns, with a rolled architrave and sill.
    for xx in (x-23,x+18):
        box(im,r+':1',(xx,y-19,xx+5,y+17));box(im,r+':3',(xx+1,y-18,xx+4,y+16));line(im,r+':4',f'{xx+1},{y-17} {xx+1},{y+15}',1)
    line(im,r+':4',f'{x-17},{y+17} {x+17},{y+17}',2)
    if state=='locked':
        # A 25 px oblique-facing leaf has enough top/front area to read its bands.
        leaf='station-panels' if lab else 'wood-oak'
        framed(im,(x-13,y-18,x+13,y+15),leaf,3);box(im,leaf+':4',(x-12,y-17,x+12,y-13))
        for xx in (x-6,x+2,x+9):line(im,leaf+':1',f'{xx},{y-12} {xx},{y+14}',1)
        for yy in (y-9,y+7):
            box(im,'iron:1',(x-14,yy,x+14,yy+4));box(im,'iron:3',(x-13,yy+1,x+13,yy+3));line(im,'iron:4',f'{x-12},{yy+1} {x+12},{yy+1}',1)
        framed(im,(x-5,y-4,x+6,y+6),'loot-gold',5);box(im,'iron:1',(x-1,y-2,x+2,y+1));line(im,'iron:1',f'{x},{y+1} {x},{y+4}',1)
    elif state=='secret':
        box(im,'void-mass:1',(x-15,y-17,x+15,y+15))
        # Wall slab visibly pulled east, exposing the passage behind it.
        box(im,r+':1',(x+3,y-12,x+28,y+18));box(im,r+':2',(x+4,y-11,x+27,y+17));box(im,r+':3',(x+4,y-11,x+27,y-7))
        for yy in (y-2,y+8):line(im,r+':1',f'{x+4},{yy} {x+27},{yy}',1)
        line(im,r+':1',f'{x+16},{y-6} {x+16},{y-2} {x+11},{y-2} {x+11},{y+8}',1)
        line(im,r+':4',f'{x+4},{y-11} {x+25},{y-11}',1)
        shard(im,x-16,y+18,15,7,r)
    else:
        # Visible parked leaf and hinges sit against the north return.
        leaf='station-panels' if lab else 'wood-oak'
        framed(im,(x-17,y-17,x+15,y-6),leaf,3);box(im,leaf+':4',(x-16,y-16,x+14,y-11))
        line(im,leaf+':1',f'{x-8},{y-15} {x-8},{y-7}',1);line(im,leaf+':1',f'{x+3},{y-15} {x+3},{y-7}',1)
        for xx in (x-13,x+10):box(im,'iron:2',(xx,y-16,xx+3,y-7));line(im,'iron:4',f'{xx},{y-15} {xx},{y-8}',1)
        if lab:
            box(im,'tank-glass:3',(x-5,y-15,x+5,y-11));line(im,'clean-tile:4',f'{x-4},{y-15} {x+4},{y-15}',1)
    records.append(dict(item=('airlock-' if lab else 'door-')+state,source=list(xy),centre=[x,y],bounds=[x-28,y-35,x+29,y+35],group='reference',orientation='east-west'))


def approach(im,name):
    if name=='hoard-keep':return R.approach(im,name)
    if name=='breach-temple':
        for j,(x,y) in enumerate([(1053,410),(1050,470),(1046,530),(1004,555),(860,561)]):
            # Follow an adjacent flag joint, branch once and lift a detached flake.
            line(im,'sandstone:2',f'{x-14-j*3},{y} {x-4},{y} {x-4},{y+7} {x+5},{y+7} {x+5},{y+15+j}',2)
            line(im,'sandstone:3',f'{x-12-j*3},{y-2} {x-2},{y-2} {x-2},{y+5}',1)
            if j>0:line(im,'sandstone:2',f'{x+5},{y+7} {x+15},{y+7} {x+15},{y+3}',2)
            shard(im,x+8,y+15,10+j*3,7+j)
            if j>2:shard(im,x-27,y+9,15,8)
    elif name=='sanctum-crypt':
        for j,(x,y,w) in enumerate([(766,242,16),(703,251,22),(632,270,30),(561,290,35),(513,344,38)]):
            # Cloth dropped from broken ritual furniture: rolled hem, pleats and tears.
            poly(im,'sanctum-cloth:1',f'{x},{y+5} {x+5},{y} {x+w-4},{y} {x+w},{y+7} {x+w-3},{y+15} {x+w-8},{y+15} {x+w-8},{y+20} {x+8},{y+20} {x+8},{y+17} {x+3},{y+17}')
            poly(im,'sanctum-cloth:3',f'{x+2},{y+5} {x+6},{y+1} {x+w-5},{y+1} {x+w-2},{y+7} {x+w-5},{y+13} {x+w-9},{y+13} {x+w-9},{y+18} {x+10},{y+18} {x+10},{y+15} {x+5},{y+15}')
            line(im,'sanctum-cloth:4',f'{x+6},{y+2} {x+w-6},{y+2}',1)
            for xx in (x+7,x+w-8):
                line(im,'sanctum-cloth:2',f'{xx},{y+5} {xx+2},{y+9} {xx+2},{y+15}',2)
                line(im,'sanctum-cloth:4',f'{xx-2},{y+5} {xx},{y+9} {xx},{y+14}',1)
            if j>=2:
                shard(im,x-15,y+14,14,8,'dark-masonry')
                line(im,'wood-oak:1',f'{x-9},{y+8} {x-9},{y+21} {x+4},{y+21}',4)
                line(im,'wood-oak:3',f'{x-9},{y+9} {x-9},{y+19} {x+3},{y+19}',2)


def lab_bay(im):
    # Recessed rail with bolted end plates, vented service boxes and pipe collars.
    framed(im,(522,126,795,150),'station-panels',2);box(im,'clean-tile:3',(523,127,794,137));line(im,'clean-tile:4','524,127 793,127',1)
    for x in (525,571,631,682,742,787):
        box(im,'station-panels:1',(x,128,x+4,147));line(im,'station-panels:4',f'{x+1},130 {x+1},145',1)
        for y in (130,144):box(im,'iron:4',(x+2,y,x+3,y+1))
    line(im,'pipes:2','529,141 788,141',3);line(im,'pipes:4','530,140 787,140',1)
    for x in (534,642,750):
        line(im,'pipes:2',f'{x},142 {x},157 {x+8},157',4);line(im,'pipes:4',f'{x-1},143 {x-1},156',1)
        box(im,'iron:1',(x-3,147,x+3,150));box(im,'iron:3',(x-2,148,x+2,149))
    for x,w,y in [(582,40,144),(690,35,150)]:
        framed(im,(x,y,x+w,y+30),'clean-tile',3);line(im,'clean-tile:4',f'{x+2},{y+1} {x+w-2},{y+1}',1)
        framed(im,(x+4,y+4,x+w-4,y+17),'station-panels',2);box(im,'tank-glass:3',(x+6,y+6,x+w-6,y+14))
        line(im,'tank-glass:5',f'{x+8},{y+11} {x+13},{y+11} {x+13},{y+8} {x+18},{y+8} {x+18},{y+12} {x+w-8},{y+12}',1)
        for xx in (x+5,x+10,x+15):box(im,'station-panels:1',(xx,y+22,xx+2,y+25))
        box(im,'spills:3',(x+w-10,y+21,x+w-6,y+24));line(im,'station-panels:2',f'{x+4},{y+28} {x+w-4},{y+28}',1)
    for x in (527,657,787):
        framed(im,(x,151,x+6,189),'station-panels',2);line(im,'station-panels:4',f'{x+1},153 {x+1},186',1)
    line(im,'spills:2','655,195 655,210 648,210 648,224 633,224 633,233 620,233',3)
    line(im,'spills:3','655,197 655,207 648,207',1)
    # A tank leak follows the tile joint then pools, its curved edge drawn in steps.
    poly(im,'spills:2','611,233 621,233 621,235 630,235 630,238 639,238 639,242 651,242 651,245 661,245 661,249 668,249 668,254 665,254 665,258 658,258 658,261 647,261 647,264 631,264 631,262 618,262 618,259 609,259 609,255 605,255 605,247 607,247 607,240 611,240')
    poly(im,'spills:3','613,235 620,235 620,238 629,238 629,241 638,241 638,245 650,245 650,248 660,248 660,251 665,251 665,254 658,254 658,258 646,258 646,260 632,260 632,259 619,259 619,256 611,256 611,253 608,253 608,247 610,247 610,241 613,241')
    line(im,'spills:4','613,240 620,240 620,243 628,243',1);line(im,'spills:4','640,254 650,254 650,252 656,252',2)
    line(im,'spills:2','616,229 616,239',3);line(im,'spills:3','617,229 617,236',1)


def walls(im,mask,look):
    R.FLOOR_MASK=mask
    if F.CURRENT=='cave_rock-plain-21':
        from d2_cave import floor
        im=floor(im,mask)
        for p in MAPS[F.CURRENT].get('pools',[]):F.pool(im,p)
    im=R.original_walls(im,mask,look)
    if F.CURRENT=='station_lab':lab_bay(im)
    if F.CURRENT=='cave_rock-plain-21':
        art=new(*im.size)
        # Local changing-width footpath: edges shaped around the chamber mouths.
        poly(art,'mud:4','303,408 323,391 353,389 377,403 411,408 456,405 493,410 532,422 570,441 615,461 660,480 701,496 737,501 782,506 838,504 893,499 944,495 996,490 1050,477 1105,469 1153,466 1199,478 1240,496 1281,513 1324,523 1370,532 1416,549 1451,567 1485,591 1516,608 1548,621 1568,651 1580,689 1581,734 1594,775 1616,810 1623,844 1615,873 1592,904 1564,922 1534,947 1500,971 1462,991 1424,1007 1388,1020 1353,1023 1316,1016 1278,1015 1243,1024 1204,1027 1167,1023 1131,1027 1094,1021 1063,1039 1037,1071 1008,1109 978,1143 951,1160 936,1142 957,1122 981,1096 1000,1068 1024,1032 1058,1001 1094,984 1135,988 1176,993 1213,994 1252,989 1290,990 1331,999 1369,998 1404,987 1437,969 1470,948 1501,924 1529,903 1553,878 1572,851 1575,826 1564,799 1548,762 1544,723 1536,684 1527,657 1506,642 1476,625 1444,604 1411,585 1374,570 1334,564 1296,553 1251,540 1213,524 1179,510 1146,506 1109,512 1068,522 1024,530 980,537 933,542 882,548 835,551 788,550 743,547 699,541 661,525 622,505 582,484 544,466 507,452 473,447 439,445 406,440 376,437 348,428 322,430')
        for pp in ['406,414 433,414 433,418 457,418','692,514 720,514 720,518 749,518','1109,488 1136,488 1136,484 1156,484','1400,559 1416,565 1432,575','1560,709 1560,732 1565,745','1220,1010 1243,1010 1243,1006 1263,1006']:
            line(art,'mud:5',pp,2)
        # Only five distinct exposed shelves in the complete scene, no tiling.
        for x,y,w,h in [(350,277,62,23),(729,651,86,31),(1160,313,73,19),(1570,1005,90,26),(504,1090,68,24)]:
            poly(art,'grey-brown-rock:4',f'{x},{y+8} {x+12},{y} {x+w-16},{y} {x+w},{y+8} {x+w-5},{y+h-8} {x+w-20},{y+h} {x+14},{y+h} {x},{y+h-8}')
            line(art,'mud:4',f'{x+5},{y+h-7} {x+23},{y+h-7} {x+23},{y+h-3} {x+w-21},{y+h-3}',2)
            line(art,'grey-brown-rock:3',f'{x+30},{y+5} {x+30},{y+11} {x+38},{y+11} {x+38},{y+16}',2)
        art.putalpha(ImageChops.multiply(art.getchannel('A'),mask.convert('L')));im.alpha_composite(art)
        x,y=F.at(1252),F.at(168)
        for xx in (x-29,x+21):
            box(im,'grey-brown-rock:1',(xx,y-73,xx+8,y+22));box(im,'grey-brown-rock:2',(xx+1,y-72,xx+7,y+20));line(im,'mud:3',f'{xx+1},{y-70} {xx+1},{y+19}',1)
    return im


def inset(im,kind):
    approach(im,F.CURRENT)
    # Floor dressing stays behind the original character silhouettes.
    for name in ('party','foe'):
        for xy in MAPS[F.CURRENT]['items'].get(name,[]):
            x,y=map(F.at,xy);im.alpha_composite(F.sprite(name),(x-24,y-24))
    b=R.original_inset(im,kind)
    if kind=='hoard':
        x,y,u,v=b;floor=Image.open(BASE/'canon/surfaces/keep-floor.png').crop((0,0,168,104));im.paste(floor,(x+12,y+28))
        cargo(im,x+24,y+51,58,35,True);cargo(im,x+90,y+66,60,34,True)
        for dx,dy,w in [(21,85,35),(48,95,38),(81,104,37),(115,100,35),(136,112,30)]:ingot(im,x+dx,y+dy,w,14)
        platter(im,x+63,y+77,27)
        # Empty, fractured focus rests beside its toppled plinth; no ember remains.
        framed(im,(x+122,y+35,x+157,y+56),'lair-hoard',2);box(im,'void-mass:1',(x+126,y+39,x+152,y+51))
        line(im,'lair-hoard:3',f'{x+126},{y+39} {x+143},{y+39}',1)
        line(im,'iron:1',f'{x+146},{y+36} {x+146},{y+43} {x+151},{y+43} {x+151},{y+55}',2)
    return b


def install():
    R.install()
    F.feature_hoard=hoard;F.feature_breach=breach;F.feature_sanctum=sanctum;F.stepped_ring=ring;R.ring=ring
    # R.place resolves its opening symbol at runtime; replace that call target.
    previous=R.opening
    def dispatch(im,state,xy,records,ew=False):
        if ew:return opening(im,state,xy,records,True)
        return previous(im,state,xy,records,False)
    R.opening=dispatch
    F.draw_walls=walls;F.broken_inset=inset
    # Move only the added demonstration door. Original source objects are unchanged.
    MAPS['cave_rock-plain-21']['added']['door-locked']=[(2208,1352)]

if __name__=='__main__':install();F.run()
