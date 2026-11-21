"""Furniture pencil: parallel top/front construction at its final footprint."""
from PIL import Image
from draw_proofs import BASE
from d_sprites import new,framed
from redraw_critic21 import box,line,poly
import d_redraw_props as old


def table(w=96,h=48):
    im=new(w,h);top=5;front=h-17
    # Trestles, stretcher, pegs and separate plank edges; source footprint retained.
    legs=[12,w-19] if w<150 else [30,w//2-3,w-37]
    box(im,'wood-oak:1',(10,h-9,w-11,h-5));box(im,'wood-oak:3',(11,h-8,w-12,h-6))
    for x in legs:
        framed(im,(x,h-23,x+7,h-3),'wood-oak',3)
        line(im,'wood-oak:5',f'{x+1},{h-21} {x+1},{h-5}',1)
        box(im,'wood-oak:2',(x-4,h-3,x+11,h-1));line(im,'wood-oak:4',f'{x-3},{h-3} {x+10},{h-3}',1)
    box(im,'wood-oak:1',(3,top,w-4,front+4))
    # Narrow timber boards, five to eight art pixels, as in the master tabletop.
    for j,y in enumerate(range(top+1,front,7)):
        end=min(y+6,front-1)
        box(im,'wood-oak:4' if j%3 else 'wood-oak:3',(4,y,w-5,end))
        line(im,'wood-oak:5',f'5,{y} {w-6},{y}',1)
        line(im,'wood-oak:2',f'4,{end} {w-5},{end}',1)
    box(im,'wood-oak:3',(4,front,w-5,front+3));line(im,'wood-oak:5',f'5,{front} {w-6},{front}',1)
    # End cleats hold the board ends; apron is morticed over the supports.
    for x in [5,w-10]:
        box(im,'wood-oak:2',(x,top+1,x+4,front+2));line(im,'wood-oak:5',f'{x},{top+2} {x},{front+1}',1)
        for y in [top+3,front-3]:box(im,'wood-oak:1',(x+2,y,x+3,y+1))
    for pp in [f'13,10 28,10 28,11 39,11',f'{w-42},18 {w-30},18 {w-30},19 {w-17},19',f'20,{front-4} 34,{front-4} 34,{front-3} 43,{front-3}']:
        line(im,'wood-oak:5',pp,1)
    if w>100:
        for pp in ['73,17 85,17 85,18 94,18 94,20 87,20 87,21 75,21', '130,10 150,10 150,11 163,11', '188,24 204,24 204,23 218,23', '241,10 258,10 258,11 265,11']:
            line(im,'wood-oak:3',pp,1)
        for x in [83,181]:line(im,'wood-oak:2',f'{x},6 {x},11',1)
    # Place settings sit on the construction, with different adjacent utensils.
    places=[(25,17),(w-25,18)] if w<150 else [(31,17),(84,18),(132,17),(180,18),(229,17),(257,18)]
    if w==48:places=[(24,35),(24,85),(24,137)]
    for j,(x,y) in enumerate(places):
        poly(im,'bone:1',f'{x-7},{y-2} {x-4},{y-5} {x+4},{y-5} {x+7},{y-2} {x+7},{y+2} {x+4},{y+5} {x-4},{y+5} {x-7},{y+2}')
        poly(im,'bone:3',f'{x-6},{y-1} {x-3},{y-4} {x+3},{y-4} {x+6},{y-1} {x+6},{y+2} {x+3},{y+4} {x-3},{y+4} {x-6},{y+2}')
        box(im,'bone:4',(x-3,y-2,x+3,y+2));line(im,'bone:2',f'{x-3},{y+2} {x+3},{y+2}',1)
        line(im,'iron:4',f'{x+10},{y-4} {x+10},{y+5}',1);box(im,'iron:5',(x+9,y-5,x+11,y-3))
    if w>48:
        box(im,'textiles-teal:2',(46,12,58,24));box(im,'textiles-teal:4',(47,12,57,20));line(im,'textiles-teal:3','48,14 55,14 55,23',1)
    return im


def altar():
    im=new()
    # Two carved supports with a visible void between, beneath a thick marble slab.
    box(im,'sandstone:1',(5,40,42,44));box(im,'sandstone:3',(6,40,41,43));line(im,'sandstone:4','7,40 40,40',1)
    for x in (8,31):
        framed(im,(x,24,x+9,39),'sandstone',3);box(im,'sandstone:2',(x+3,28,x+7,38));line(im,'sandstone:4',f'{x+1},26 {x+1},37',1)
        box(im,'sandstone:4',(x-1,25,x+10,27));box(im,'sandstone:1',(x,38,x+9,39))
    framed(im,(2,10,45,25),'marble',3);box(im,'marble:4',(3,11,44,19));line(im,'marble:5','4,11 43,11',1)
    line(im,'marble:2','3,21 44,21',1);line(im,'marble:4','4,23 43,23',1)
    for pp in ['8,13 17,13 17,15 24,15 24,17 32,17','29,12 29,14 34,14 34,16 40,16']:
        line(im,'marble:3',pp,1)
    for x in (8,20,32):
        box(im,'sandstone:2',(x,22,x+3,24));box(im,'sandstone:4',(x,22,x+2,22))
    framed(im,(18,4,30,11),'brass',3);box(im,'bone:4',(20,5,28,8));line(im,'bone:2','23,5 23,8',1)
    return im


def bed():
    im=new(48,96)
    # Turned posts, a panelled headboard, pegged rails, a quilt folding over the foot.
    for x in (3,39):
        framed(im,(x,19,x+5,92),'wood-oak',3);box(im,'wood-oak:5',(x+1,20,x+2,89))
        for y in (20,27,78,85):box(im,'wood-oak:2',(x,y,x+5,y+2))
        box(im,'wood-oak:5',(x,18,x+5,20))
    framed(im,(8,23,39,37),'wood-oak',3);line(im,'wood-oak:5','10,24 37,24',1)
    for x in (12,25):
        framed(im,(x,27,x+10,34),'wood-oak',2);line(im,'wood-oak:4',f'{x+1},28 {x+8},28',1)
    box(im,'wood-oak:1',(8,37,39,84));box(im,'bone:3',(9,38,38,74))
    poly(im,'bone:4','12,36 30,36 35,39 36,43 33,47 16,48 11,44 10,40')
    line(im,'bone:5','13,37 28,37 31,39',1);line(im,'bone:2','13,44 17,46 30,46 33,43',1)
    poly(im,'textiles-russet:2','9,49 37,49 39,53 39,80 35,85 13,85 9,82')
    poly(im,'textiles-russet:3','10,50 36,50 37,55 34,62 34,78 31,82 15,82 11,79')
    poly(im,'textiles-russet:4','11,50 34,50 34,53 29,55 19,54 15,56 11,54')
    for pp in ['13,57 16,60 16,70 18,75 18,81','25,56 23,61 23,70 21,74','31,59 29,64 29,76 27,80']:
        line(im,'textiles-russet:2',pp,2)
    for pp in ['17,57 19,61 19,69','26,62 26,71 24,76','12,77 16,80 22,80 25,81 30,81']:
        line(im,'textiles-russet:4',pp,1)
    line(im,'textiles-russet:5','12,51 19,51',1)
    framed(im,(4,82,43,88),'wood-oak',3);line(im,'wood-oak:5','5,83 42,83',1);line(im,'wood-oak:2','10,86 36,86',1)
    return im


def tomb():
    im=new(48,96)
    # Rectangular sarcophagus lid on a substantial stepped plinth, never a badge.
    framed(im,(3,72,44,91),'dark-masonry',2);box(im,'dark-masonry:4',(4,73,43,77))
    for x in (6,36):
        box(im,'dark-masonry:3',(x,78,x+5,88));line(im,'dark-masonry:5',f'{x},78 {x},86',1)
    line(im,'dark-masonry:1','13,80 34,80 34,87 13,87 13,80',1)
    box(im,'dark-masonry:4',(2,87,45,91));line(im,'dark-masonry:5','3,88 44,88',1)
    framed(im,(3,20,44,77),'dark-masonry',4);box(im,'dark-masonry:5',(4,21,43,68));line(im,'dark-masonry:6','5,21 42,21',1)
    box(im,'dark-masonry:3',(4,70,43,75));line(im,'dark-masonry:2','5,74 42,74',1)
    framed(im,(8,25,39,64),'dark-masonry',3)
    # Recumbent relief: head on cushion, folded hands, robe and feet.
    framed(im,(17,28,31,39),'dark-masonry',4)
    poly(im,'bone:2','21,30 27,30 29,33 28,39 31,44 32,54 28,60 19,60 16,54 17,44 20,39 19,34')
    box(im,'bone:3',(21,31,27,38));line(im,'bone:4','21,32 25,32',1)
    line(im,'bone:4','19,44 23,48 28,43',2);line(im,'bone:3','23,50 22,57',2);line(im,'bone:1','26,51 27,57',1)
    line(im,'dark-masonry:4','10,27 10,58 12,61 35,61',1)
    line(im,'dark-masonry:3','34,22 34,26 37,26 37,30',1)
    return im


def support():
    im=new(48,96)
    for x in (4,37):
        framed(im,(x,52,x+6,92),'wood-oak',3)
        line(im,'wood-oak:5',f'{x+1},54 {x+1},87',1)
        framed(im,(x-2,87,x+8,94),'iron',2)
    framed(im,(2,48,45,57),'wood-oak',3);line(im,'wood-oak:5','3,49 44,49',1)
    for x in (6,38):box(im,'iron:2',(x,50,x+3,54));line(im,'iron:4',f'{x},50 {x+2},50',1)
    box(im,'wood-oak:1',(9,65,39,77));box(im,'wood-oak:4',(10,66,38,70));box(im,'wood-oak:2',(10,71,38,76))
    for x in (13,29):
        framed(im,(x,62,x+5,80),'iron',2);line(im,'iron:4',f'{x+1},64 {x+1},78',1)
    box(im,'wood-oak:1',(18,63,28,78));box(im,'wood-oak:3',(19,64,27,77))
    for y in (65,68,71,74):line(im,'wood-oak:5',f'19,{y} 27,{y}',1)
    line(im,'iron:4','34,70 41,70 41,80 44,80',2);box(im,'wood-oak:4',(42,78,45,83))
    line(im,'iron:2','23,78 23,87',3);box(im,'iron:4',(22,80,24,81));box(im,'iron:4',(22,84,24,85))
    framed(im,(17,87,30,93),'iron',2);line(im,'iron:4','19,88 28,88',1)
    line(im,'wood-oak:4','11,69 11,83',2);poly(im,'iron:1','7,82 15,82 16,88 12,93 7,89');poly(im,'iron:3','8,83 14,83 14,88 12,91 8,88')
    return im


def labtable():
    im=old.table(lab=True)
    # Flush worktop divisions, vented apron, knee brace, controls with physical rims.
    line(im,'station-panels:2','42,9 42,25 80,25',1)
    line(im,'clean-tile:3','44,11 57,11 57,12 67,12',1)
    for x in (41,45,49,53):line(im,'station-panels:1',f'{x},29 {x},32',1)
    box(im,'station-panels:2',(13,38,82,41));line(im,'station-panels:4','14,38 81,38',1)
    for x,y in [(10,10),(85,10),(10,29),(85,29)]:box(im,'iron:2',(x,y,x+2,y+1))
    box(im,'clean-tile:4',(17,21,21,22));box(im,'spills:3',(25,21,28,22));box(im,'tank-glass:5',(31,21,33,22))
    line(im,'pipes:2','58,17 53,17 53,24 47,24',2)
    return im


def run():
    for n,im in {'table-short':table(),'table-long':table(288),'table-vertical':table(48,192),'altar':altar(),'bed':bed(),'coffin':tomb(),'mine-support':support(),'lab-table':labtable()}.items():
        im.save(BASE/f'canon/props/d-{n}.png')
if __name__=='__main__':run()
