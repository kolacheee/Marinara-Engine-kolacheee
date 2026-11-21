"""Native prop replacements for the failed D compositions."""
from PIL import Image
from d_sprites import new,framed
from redraw_critic21 import box,line,poly
from draw_proofs import BASE

def table(w=96,h=48,lab=False):
    im=new(w,h);r='station-panels' if lab else 'wood-oak'
    for x in [8,w-14]:
        box(im,r+':1',(x,h-22,x+6,h-3));box(im,r+':2',(x+1,h-20,x+5,h-4));box(im,r+':4',(x+1,h-19,x+2,h-5))
    box(im,r+':1',(4,5,w-5,h-15));box(im,r+':5',(5,6,w-6,h-21));box(im,r+':2',(5,h-20,w-6,h-16));line(im,r+':4',f'6,{h-20} {w-7},{h-20}',1)
    # Broad tabletop, front apron, pegged mortices, with no side face.
    box(im,r+':6',(6,6,w-7,7));box(im,r+':3',(4,h-15,w-5,h-14))
    if not lab:
        for y in range(16,h-22,16):line(im,r+':3',f'6,{y} {w-7},{y}',1)
        for x,y,length in [(12,11,22),(w-40,21,23),(19,h-28,13)]:
            line(im,r+':4',f'{x},{y} {x+length},{y} {x+length},{y+1} {x+length+5},{y+1}',1)
        for x in [10,w-13]:box(im,r+':4',(x,h-19,x+2,h-17))
        # Ceramic dishes, spoon and folded napkin as three distinct material forms.
        places=[(x,17) for x in range(25,w-12,48)] if w>48 else [(24,y) for y in range(27,h-24,48)]
        for j,(x,y) in enumerate(places):
            poly(im,'bone:1',f'{x-8},{y-2} {x-5},{y-5} {x+5},{y-5} {x+8},{y-2} {x+8},{y+2} {x+5},{y+5} {x-5},{y+5} {x-8},{y+2}')
            box(im,'bone:4',(x-5,y-3,x+5,y+3));box(im,'bone:2',(x-3,y-1,x+3,y+1));line(im,'bone:5',f'{x-4},{y-3} {x+4},{y-3}',1)
        if w>48:
            box(im,'textiles-teal:1',(46,11,58,23));box(im,'textiles-teal:4',(47,12,57,21));line(im,'textiles-teal:2','49,14 55,14 55,20',1)
            line(im,'iron:5','67,13 67,23',2)
    else:
        # Porcelain inset worktop, drawers, a monitor and a supported instrument.
        box(im,'clean-tile:4',(7,8,w-8,h-23));box(im,'clean-tile:5',(8,8,w-9,9))
        for x in (14,w-33):
            box(im,'station-panels:1',(x,h-20,x+19,h-16));box(im,'station-panels:3',(x+1,h-19,x+18,h-17));box(im,'iron:5',(x+7,h-19,x+12,h-19))
        framed(im,(13,9,36,23),'station-panels',2);box(im,'tank-glass:3',(16,11,33,18));line(im,'tank-glass:5','18,14 23,14 23,16 30,16',1);box(im,'iron:3',(22,24,29,26))
        framed(im,(w-35,11,w-17,25),'clean-tile',3);box(im,'tank-glass:4',(w-31,14,w-21,19));box(im,'iron:2',(w-29,22,w-23,23))
    return im

def chair(lab=False):
    im=new();r='station-panels' if lab else 'wood-oak';cloth='textiles-teal' if lab else 'textiles-sage'
    for x in (9,34):box(im,r+':1',(x,29,x+4,44));box(im,r+':3',(x+1,31,x+2,42))
    poly(im,r+':1','7,8 10,5 37,5 40,8 40,29 43,29 43,36 39,40 8,40 4,36 4,29 7,29')
    box(im,r+':5',(9,8,38,12));box(im,r+':2',(8,13,39,28));box(im,cloth+':3',(12,14,35,26));box(im,cloth+':4',(13,14,34,16));line(im,cloth+':2','14,23 32,23 32,20',1)
    box(im,r+':4',(6,29,41,35));box(im,cloth+':4',(10,29,37,33));box(im,cloth+':2',(11,34,36,36));box(im,r+':2',(7,37,40,38));box(im,r+':5',(6,29,8,33));box(im,r+':3',(39,29,41,34))
    return im

def shelf(lab=False):
    im=new(48,96);r='station-panels' if lab else 'wood-oak'
    box(im,r+':1',(3,17,44,91));box(im,r+':2',(6,24,41,85));box(im,r+':5',(4,18,43,23));box(im,r+':6',(5,18,42,19))
    for x in (4,40):box(im,r+':3',(x,24,x+3,88));line(im,r+':4',f'{x},26 {x},86',1)
    for y in (43,64,85):box(im,r+':1',(8,y,39,y+4));box(im,r+':5',(8,y,39,y+1));box(im,r+':3',(9,y+2,38,y+3))
    if lab:
        for y,xx in [(27,10),(49,14),(70,9)]:
            framed(im,(xx,y,xx+11,y+13),'clean-tile',4);box(im,'tank-glass:3',(xx+2,y+5,xx+9,y+10));box(im,'clean-tile:5',(xx+3,y+2,xx+8,y+3))
            framed(im,(27,y+4,36,y+14),'station-panels',3);box(im,'clean-tile:4',(29,y+6,34,y+8))
    else:
        # Each shelf is a separate arrangement: folios, slanted spine, stacked pages.
        for x,y,w,h,r in [(9,27,6,15,'textiles-teal'),(16,30,5,12,'textiles-russet'),(23,25,8,17,'parquet'),(32,32,5,10,'textiles-sage'),(10,50,7,13,'textiles-russet'),(18,47,5,16,'textiles-teal'),(29,70,7,14,'parquet'),(9,72,5,12,'textiles-sage')]:
            box(im,r+':1',(x,y,x+w,y+h));box(im,r+':3',(x+1,y+1,x+w-1,y+h-1));line(im,r+':4',f'{x+1},{y+2} {x+w-1},{y+2}',1);box(im,'brass:4',(x+2,y+h-4,x+w-2,y+h-3))
        for x,y,w in [(25,57,12),(25,51,13),(16,79,11),(15,74,12)]:
            box(im,'wood-oak:1',(x,y,x+w,y+4));box(im,'bone:3',(x+1,y+1,x+w-1,y+2));line(im,'bone:2',f'{x+3},{y+2} {x+w-2},{y+2}',1)
    box(im,r+':4',(3,88,44,90));box(im,r+':1',(7,91,11,94));box(im,r+':1',(36,91,40,94));return im

def hearth():
    im=new(96,96)
    # The master hearth spans about one and a half cells. A 96 px canvas keeps
    # its masonry, firebox and mantel at that native density without reduction.
    poly(im,'limestone:1','26,3 69,3 69,22 74,29 74,43 86,43 86,52 81,52 81,85 88,85 88,93 7,93 7,85 14,85 14,52 9,52 9,43 21,43 21,29 26,22')
    poly(im,'limestone:2','27,4 68,4 68,23 72,30 72,43 23,43 23,30 27,23')
    # Individual cut blocks, staggered joints and chipped corners.
    stones=[(28,7,17,8),(47,7,19,8),(28,17,10,7),(40,17,17,7),(59,17,8,7),(25,26,16,7),(43,26,14,7),(59,26,12,7),(24,35,10,7),(36,35,20,7),(58,35,13,7)]
    for j,(x,y,w,h) in enumerate(stones):
        poly(im,'limestone:3',f'{x+2},{y} {x+w},{y} {x+w},{y+h-2} {x+w-2},{y+h} {x},{y+h} {x},{y+2}')
        line(im,'limestone:4',f'{x+2},{y} {x+w-2},{y}',1)
    line(im,'limestone:2','49,8 49,11 53,11 53,14',1);line(im,'limestone:2','29,28 34,28 34,30 39,30',1);line(im,'limestone:2','61,37 64,37 64,40',1)
    box(im,'limestone:3',(25,4,70,6));box(im,'limestone:4',(26,4,69,4))
    # Thick timber mantel with visible top, apron and end corbels.
    framed(im,(9,43,86,52),'wood-oak',3);box(im,'wood-oak:5',(10,44,85,46));box(im,'wood-oak:2',(11,49,84,51))
    line(im,'wood-oak:4','15,47 33,47 33,48 46,48 46,47 65,47 65,48 78,48',1)
    for x in (14,75):
        poly(im,'wood-oak:1',f'{x},{53} {x+7},53 {x+7},58 {x+4},62 {x},62')
        box(im,'wood-oak:3',(x+1,53,x+5,58));box(im,'wood-oak:4',(x+1,54,x+2,58))
    # Stone voussoirs surround a dark arch and terminate on a level hearth.
    box(im,'limestone:2',(17,54,78,84))
    poly(im,'limestone:1','35,56 60,56 67,60 72,67 72,84 23,84 23,67 28,60')
    arch=[(21,68,7,12),(24,61,8,7),(30,57,10,6),(41,54,12,7),(54,57,10,6),(65,61,7,7),(70,69,7,12)]
    for x,y,w,h in arch:
        box(im,'limestone:3',(x,y,x+w,y+h));line(im,'limestone:4',f'{x+1},{y} {x+w-1},{y}',1)
    poly(im,'limestone:1','37,61 57,61 63,65 67,71 67,84 28,84 28,71 32,65')
    for x in (18,73):
        box(im,'limestone:3',(x,72,x+5,84));line(im,'limestone:2',f'{x},78 {x+5},78',1);line(im,'limestone:4',f'{x+1},73 {x+1},77',1)
    # Crossed logs and separate overlapping tongues, all opaque ramp pixels.
    line(im,'wood-oak:2','33,81 59,76',5);line(im,'wood-oak:4','34,79 59,75',2)
    line(im,'wood-oak:2','36,75 62,82',5);line(im,'wood-oak:3','37,75 61,81',2)
    poly(im,'embers:3','33,77 33,72 37,72 37,66 40,69 44,63 44,59 48,65 51,67 54,63 54,70 58,69 61,75 59,81 36,81')
    poly(im,'embers:4','36,77 38,71 41,73 44,66 47,69 49,66 52,71 55,71 57,77 54,80 39,80')
    poly(im,'embers:5','41,78 42,73 45,69 47,73 50,70 51,75 54,77 51,80 43,80')
    line(im,'embers:6','45,76 47,73 49,77',2)
    box(im,'iron:2',(30,82,65,84));box(im,'iron:3',(33,81,35,84));box(im,'iron:3',(59,81,61,84))
    box(im,'limestone:3',(8,86,87,92));box(im,'limestone:4',(9,86,86,87));line(im,'limestone:2','29,88 29,92',1);line(im,'limestone:2','65,88 65,92',1)
    line(im,'limestone:2','12,90 22,90 22,89 26,89',1);line(im,'limestone:2','70,91 82,91',1)
    return im

def bed():
    im=new(48,96)
    for x in (4,39):box(im,'wood-oak:1',(x,17,x+4,91));box(im,'wood-oak:4',(x+1,18,x+3,89));box(im,'wood-oak:5',(x+1,18,x+2,23))
    framed(im,(8,21,39,35),'wood-oak',2);line(im,'wood-oak:4','10,25 37,25',2)
    box(im,'wood-oak:1',(7,34,40,83));box(im,'bone:3',(9,35,38,75));poly(im,'bone:4','11,36 32,36 36,39 36,46 13,46 10,43')
    line(im,'bone:2','14,43 30,43 34,41',1);line(im,'bone:5','13,37 29,37',1)
    box(im,'textiles-russet:3',(9,48,38,77));box(im,'textiles-russet:4',(10,48,37,52));line(im,'textiles-russet:2','9,55 14,55 14,68 17,68 17,76',2);line(im,'textiles-russet:4','24,54 24,64 22,64 22,72',2);box(im,'textiles-russet:2',(34,53,38,77))
    line(im,'textiles-russet:5','11,50 35,50',1);line(im,'textiles-russet:2','18,58 18,63',1)
    framed(im,(4,78,43,86),'wood-oak',2);box(im,'wood-oak:5',(5,78,42,80));line(im,'wood-oak:3','11,83 34,83',1);return im

def coffin():
    im=new(48,96)
    poly(im,'dark-masonry:1','12,19 35,19 42,29 42,75 35,91 12,91 5,75 5,29')
    poly(im,'dark-masonry:3','7,62 40,62 40,75 34,89 13,89 7,75')
    poly(im,'dark-masonry:5','13,21 34,21 40,30 40,65 33,79 14,79 7,65 7,30')
    poly(im,'dark-masonry:6','14,22 33,22 38,30 38,33 10,33 10,30')
    poly(im,'dark-masonry:4','14,27 33,27 36,33 36,62 31,72 16,72 11,62 11,33')
    # Carved recumbent figure on a slab; depth belongs to the front plinth.
    poly(im,'bone:1','21,32 27,32 30,36 29,43 32,48 32,62 28,68 20,68 16,62 16,48 20,43 18,37')
    box(im,'bone:3',(21,34,27,41));box(im,'bone:4',(21,34,25,37));poly(im,'bone:2','21,44 27,44 30,49 29,61 26,66 21,66 19,61 18,49')
    line(im,'bone:4','22,46 24,52 27,47',2);line(im,'bone:3','23,54 23,63',2)
    line(im,'dark-masonry:2','11,78 15,84 32,84 37,78',1);line(im,'dark-masonry:4','14,86 32,86',1)
    line(im,'dark-masonry:3','34,27 31,30 31,34',1);return im

def chest(opened=False):
    im=new();r='loot-gold'
    for x in (7,36):box(im,'textiles-teal:1',(x,39,x+4,44))
    if opened:
        framed(im,(5,3,42,22),'loot-gold',4);box(im,'wood-oak:1',(10,7,37,20));box(im,'wood-oak:2',(12,9,35,18));box(im,'loot-gold:5',(7,5,40,6))
        box(im,'textiles-teal:1',(4,25,43,42));box(im,'loot-gold:5',(5,26,42,41));box(im,'textiles-teal:1',(8,26,39,33));box(im,'wood-oak:2',(11,28,36,31));box(im,'textiles-teal:2',(10,35,37,40))
    else:
        poly(im,'textiles-teal:1','4,20 7,13 13,9 34,9 40,13 43,20 43,42 4,42')
        poly(im,'loot-gold:5','5,20 8,14 14,10 33,10 39,14 42,20 42,29 5,29')
        box(im,'textiles-teal:2',(5,30,42,41));box(im,'loot-gold:6',(13,11,34,13));box(im,'loot-gold:4',(6,24,41,28))
        for x in (12,32):line(im,'loot-gold:3',f'{x},15 {x},27',1)
        box(im,'textiles-teal:3',(7,32,40,35))
    for x in (8,36):box(im,'loot-gold:5',(x,32,x+3,41));box(im,'loot-gold:6',(x,32,x+1,39))
    box(im,'loot-gold:5',(5,40,42,41));box(im,'loot-gold:1',(20,29,28,37));box(im,'loot-gold:6',(21,30,27,36));box(im,'iron:1',(23,32,25,34))
    return im

def support():
    im=new(48,96)
    for x in (5,36):
        framed(im,(x,22,x+6,91),'wood-oak',2);box(im,'wood-oak:4',(x+1,24,x+2,89));line(im,'wood-oak:3',f'{x+4},28 {x+4},47 {x+3},47 {x+3},70',1)
        framed(im,(x-2,85,x+8,93),'iron',2)
    framed(im,(2,16,45,27),'wood-oak',3);box(im,'wood-oak:5',(3,17,44,18))
    poly(im,'wood-oak:1','11,28 15,28 23,43 20,46 11,33');poly(im,'wood-oak:3','12,28 14,29 21,42 20,43 12,32')
    for x in (6,37):box(im,'iron:2',(x,18,x+4,24));box(im,'iron:4',(x+1,19,x+3,20))
    return im

def altar():
    im=new(48,48)
    framed(im,(8,24,39,43),'sandstone',2);box(im,'sandstone:3',(10,25,37,39))
    for x in (11,32):box(im,'brass:2',(x,27,x+4,40));box(im,'brass:4',(x,27,x+1,37))
    framed(im,(3,12,44,27),'marble',3);box(im,'marble:4',(4,13,43,21));box(im,'marble:5',(5,13,42,14));line(im,'marble:2','5,23 42,23',1)
    line(im,'marble:3','9,17 21,17 21,19 29,19',1);framed(im,(18,5,30,13),'brass',3);box(im,'bone:4',(21,7,27,9));return im

def run():
    imgs={'table-short':table(),'table-long':table(288),'table-vertical':table(48,192),'chair':chair(),'bookshelf':shelf(),'hearth':hearth(),'bed':bed(),'coffin':coffin(),'chest':chest(),'chest-open':chest(True),'mine-support':support(),'altar':altar(), 'lab-table':table(lab=True),'lab-chair':chair(True),'lab-shelf':shelf(True)}
    for name in ('table-short','table-long','table-vertical'):
        im=imgs[name];w,h=im.size
        # Chosen grain figures, not scatter or a repeated noise texture.
        for x,y,length in [(9,9,12),(w-33,11,15),(12,h-25,11)]:
            line(im,'wood-oak:4',f'{x},{y} {x+length},{y} {x+length},{y+2} {x+length+5},{y+2}',1)
        if w>96:
            line(im,'wood-oak:4','114,9 133,9 133,10 145,10 145,12 139,12 139,13 122,13',1)
            line(im,'wood-oak:3','164,26 183,26 183,24 191,24',1)
        for x in (11,w-16):box(im,'wood-oak:1',(x,h-18,x+2,h-16))
    im=imgs['bookshelf']
    for pp in ['5,30 5,46 6,46 6,63 5,63 5,80','42,26 42,39 41,39 41,58 42,58 42,77','12,21 26,21 26,22 36,22']:
        line(im,'wood-oak:4',pp,1)
    im=imgs['bed']
    poly(im,'textiles-russet:4','18,55 23,55 23,60 21,60 21,66 19,70 18,70')
    poly(im,'textiles-russet:2','28,55 31,55 31,65 33,65 33,74 30,74 30,66 28,66')
    line(im,'textiles-russet:4','13,73 17,73 17,75 27,75',1)
    for n,im in imgs.items():im.save(BASE/f'canon/props/d-{n}.png')
if __name__=='__main__':run()
