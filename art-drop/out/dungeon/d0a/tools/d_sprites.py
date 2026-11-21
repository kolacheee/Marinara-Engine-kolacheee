"""Native D prop pencil drawings, orthographic top plus front, no side faces."""
from PIL import Image,ImageDraw
from draw_proofs import BASE,P,c
from redraw_critic21 import poly,line,box

def new(w=48,h=48):return Image.new('RGBA',(w,h))
def framed(im,b,r='wood-oak',s=4):
    x,y,u,v=b;box(im,r+':1',b);box(im,r+':'+str(s),(x+1,y+1,u-1,v-1));line(im,r+':'+str(min(s+1,6)),f'{x+1},{v-2} {x+1},{y+1} {u-1},{y+1}')

def token(foe=False):
    im=new();r='foe-red' if foe else 'blue-ice'
    box(im,r+':1',(14,4,33,43));box(im,'bone:3',(19,5,28,15));box(im,'bone:4',(19,5,25,12))
    box(im,r+':2',(12,17,35,34));box(im,r+':4',(16,18,31,34));box(im,r+':3',(26,20,31,33))
    box(im,'iron:1',(16,36,22,44));box(im,'iron:1',(26,36,32,44))
    box(im,'iron:5',(35,20,37,38));box(im,'iron:2',(36,37,39,39))
    if not foe:box(im,'frost:5',(19,20,26,23))
    return im

def chest_open():
    im=new();framed(im,(6,4,41,24),'textiles-teal',3);framed(im,(9,7,38,21),'wood-oak',2)
    box(im,'wood-oak:1',(11,9,36,20));box(im,'loot-gold:4',(10,5,12,22));box(im,'loot-gold:5',(34,5,36,22))
    framed(im,(5,25,42,42),'textiles-teal',3);box(im,'textiles-teal:1',(8,26,39,32));box(im,'wood-oak:2',(10,28,37,31))
    box(im,'iron:5',(7,35,40,36));box(im,'loot-gold:3',(10,33,12,41));box(im,'loot-gold:3',(34,33,36,41))
    return im

def door(state,station=False):
    im=new(48,96);r='station-panels' if station else 'wood-oak';stone='clean-tile' if station else 'limestone'
    # Parallel pillars and horizontal lintel. Lit threshold keeps the opening clear.
    framed(im,(2,19,45,92),stone,2);box(im,'void-mass:1',(9,26,38,87))
    for x in (3,40):
        box(im,stone+':3',(x,27,x+4,85));box(im,stone+':4',(x,27,x+1,84))
        for y in (41,57,74):box(im,stone+':1',(x,y,x+4,y))
    box(im,stone+':4',(3,20,44,24));box(im,stone+':1',(8,25,39,25))
    box(im,stone+':4',(6,88,41,91));box(im,stone+':5',(7,88,39,88))
    if state=='open':
        framed(im,(10,29,16,85),r,3);box(im,r+':5',(11,31,12,83));box(im,'iron:3',(10,43,16,45))
    elif state=='secret':
        framed(im,(10,28,29,85),stone,3)
        for y in (40,55,70):box(im,stone+':1',(11,y,29,y+1))
        for y in (32,48,64,80):box(im,'tank-glass:4',(33,y,36,y+7))
        box(im,'tank-glass:5',(32,28,38,30))
    else:
        framed(im,(10,28,37,85),r,4)
        for x in (16,23,30):box(im,r+':2',(x,30,x,83))
        for y in (39,69):framed(im,(10,y,37,y+6),'iron',3)
        # A broad shield plate and keyhole, never a letter glyph.
        framed(im,(19,49,29,63),'loot-gold',5);box(im,'iron:1',(23,52,25,55));box(im,'iron:1',(24,55,24,59))
    return im

def stairs(up=False):
    im=new();framed(im,(3,2,44,44),'limestone',2);box(im,'void-mass:1',(7,6,40,39))
    for i in range(5):
        y=8+i*6;x=8+(4-i if up else i)*2
        box(im,'limestone:2',(x,y,47-x,y+4));box(im,'limestone:4',(x,y,47-x,y+1))
    box(im,'limestone:5',(5,41,42,43));return im

def trap():
    im=new();framed(im,(2,4,45,44),'found-trap',5);framed(im,(8,10,39,38),'iron',2)
    # Structural diagonal hazard bands, 6 px runs.
    for x in (4,16,28,40):
        poly(im,'found-trap:1',f'{x},5 {min(x+5,44)},5 {max(3,x-1)},9 {max(3,x-5)},9')
        poly(im,'found-trap:1',f'{x},39 {min(x+5,44)},39 {max(3,x-1)},43 {max(3,x-5)},43')
    for y in (14,26):
        box(im,'found-trap:1',(3,y,7,y+5));box(im,'found-trap:1',(40,y,44,y+5))
    for x in (15,24,33):
        poly(im,'iron:5',f'{x-3},31 {x-3},26 {x-1},26 {x-1},20 {x},18 {x+1},20 {x+1},26 {x+3},26 {x+3},31')
        box(im,'iron:3',(x,24,x+2,30))
    return im

def bone():
    im=new();r='bone';poly(im,r+':1','7,11 12,7 22,7 27,12 27,23 23,28 12,28 7,23')
    poly(im,r+':3','9,12 13,9 21,9 25,13 25,22 21,26 13,26 9,22')
    box(im,r+':1',(11,16,15,20));box(im,r+':1',(19,16,23,20));box(im,r+':4',(12,10,20,12))
    line(im,r+':2','21,27 34,38',3);line(im,r+':4','21,27 34,38',1)
    for path in ['8,34 18,34 18,37 24,37','29,13 35,13 35,17 40,17','29,25 39,25 39,28 43,28']:
        line(im,r+':1',path,5);line(im,r+':3',path,3)
    return im

def rack():
    im=new();framed(im,(4,5,43,11),'wood-oak',4)
    for x in (8,36):framed(im,(x,11,x+4,44),'wood-oak',3)
    for x,h in [(15,31),(24,36),(33,29)]:
        box(im,'iron:1',(x-2,13,x+2,h));box(im,'iron:4',(x-1,14,x,h-5));box(im,'iron:2',(x-4,h-7,x+4,h-5));box(im,'wood-oak:3',(x,h-4,x+1,h))
    box(im,'wood-oak:2',(6,41,42,44));return im

def stone(kind='boulder'):
    im=new();r='grey-brown-rock';shape='3,24 7,17 15,10 31,10 40,17 44,26 42,36 35,42 12,42 5,35'
    if kind=='stalagmite':shape='6,40 10,25 14,25 17,13 20,13 23,3 25,3 28,17 31,17 35,29 39,29 43,40 38,44 12,44'
    poly(im,r+':1',shape)
    if kind=='boulder':
        poly(im,r+':3','5,24 9,18 16,12 30,12 39,18 41,25 36,31 14,31');poly(im,r+':4','9,20 17,13 29,13 33,17 26,24 15,26')
        poly(im,r+':2','8,30 16,33 35,33 40,28 39,35 33,40 14,40 8,34')
        line(im,r+':5','12,20 18,15 27,15',1)
    else:
        poly(im,r+':3','9,39 13,26 16,26 19,14 22,14 24,6 26,20 30,20 34,31 38,31 40,39 36,42 13,42')
        line(im,r+':4','16,37 20,26 22,26 24,14',2);line(im,r+':2','29,22 29,35 33,39',2)
    return im

def rubble():
    im=new()
    for x,y,w,h in [(4,27,15,13),(18,14,18,16),(29,32,14,10),(7,17,9,8)]:
        poly(im,'limestone:1',f'{x},{y+3} {x+3},{y} {x+w-3},{y} {x+w},{y+3} {x+w},{y+h-3} {x+w-3},{y+h} {x+3},{y+h} {x},{y+h-3}')
        box(im,'limestone:3',(x+3,y+2,x+w-3,y+h-3));line(im,'limestone:4',f'{x+3},{y+2} {x+w-3},{y+2}',1)
    return im

def candle():
    im=new();box(im,'brass:1',(5,38,42,43));box(im,'brass:3',(7,39,40,41))
    for x,y in [(10,20),(23,9),(35,24)]:
        framed(im,(x-3,y,x+3,38),'bone',3);box(im,'bone:4',(x-2,y+1,x-1,36))
        box(im,'embers:3',(x-2,y-6,x+2,y-1));box(im,'embers:5',(x-1,y-5,x,y-2))
    return im

def chair():
    im=new()
    for x in (9,34):framed(im,(x,27,x+4,44),'wood-oak',3)
    framed(im,(7,6,40,28),'wood-oak',3);framed(im,(11,10,36,25),'textiles-sage',3)
    framed(im,(6,28,41,37),'wood-oak',4);box(im,'textiles-sage:4',(9,29,38,32));return im

def cabinet(kind):
    im=new(48,96);r='wood-oak'
    framed(im,(3,17,44,90),r,3);box(im,r+':2',(7,25,40,83))
    for y in [25,46,67]:
        box(im,r+':4',(6,y+17,41,y+20));box(im,r+':5',(6,y+17,41,y+17))
        if kind=='bookshelf':
            for j,(x,h,co) in enumerate([(9,13,'textiles-sage'),(15,16,'textiles-russet'),(22,14,'textiles-teal'),(30,17,'bone'),(36,11,'parquet')]):
                box(im,co+':1',(x,y+17-h,x+4,y+16));box(im,co+':3',(x+1,y+18-h,x+3,y+15));box(im,'brass:3',(x+1,y+20-h,x+3,y+21-h))
        else:
            framed(im,(9,y+2,38,y+16),r,4);line(im,'brass:4',f'21,{y+8} 27,{y+8}',2)
    box(im,r+':5',(4,18,43,20));return im

def fireplace():
    im=new(48,96);framed(im,(8,8,39,69),'limestone',2)
    for y in (18,31,44):line(im,'limestone:1',f'9,{y} 38,{y}',1)
    for x,y in [(20,9),(28,19),(18,32)]:line(im,'limestone:1',f'{x},{y} {x},{y+11}',1)
    framed(im,(2,51,45,57),'wood-oak',4);framed(im,(5,58,42,89),'limestone',3);box(im,'limestone:1',(11,62,36,85))
    line(im,'wood-oak:4','14,80 32,84',3);line(im,'wood-oak:3','16,84 33,79',3)
    poly(im,'embers:4','16,79 16,73 19,73 19,66 22,70 25,61 28,71 32,69 32,77 29,81 20,81')
    poly(im,'embers:6','21,78 21,74 24,68 26,73 28,75 27,79')
    box(im,'limestone:4',(4,89,43,92));return im

def bed():
    im=new(48,96)
    for x in (4,39):framed(im,(x,18,x+4,90),'wood-oak',3)
    framed(im,(7,24,40,83),'wood-oak',3);framed(im,(10,28,37,74),'textiles-russet',3)
    framed(im,(11,29,36,42),'bone',3);box(im,'bone:4',(13,31,34,37))
    box(im,'textiles-russet:4',(12,47,34,49));box(im,'textiles-russet:2',(30,50,36,73));framed(im,(4,76,43,84),'wood-oak',4)
    return im

def coffin():
    im=new(48,96);r='dark-masonry'
    poly(im,r+':1','13,20 34,20 41,29 41,75 34,89 13,89 6,75 6,29')
    poly(im,r+':4','14,22 33,22 39,30 39,73 33,86 14,86 8,73 8,30')
    poly(im,r+':6','15,23 32,23 37,31 37,66 32,77 15,77 10,66 10,31')
    poly(im,r+':2','17,28 30,28 33,33 33,64 29,72 18,72 14,64 14,33')
    line(im,'bone:3','24,35 24,63',3);line(im,'bone:3','18,44 30,44',3);box(im,'bone:4',(22,32,26,37))
    line(im,r+':3','10,78 15,83 32,83 37,78',1);return im

def books():
    im=new();framed(im,(3,12,44,37),'wood-oak',3);box(im,'bone:3',(6,14,23,33));box(im,'bone:4',(25,14,41,33));box(im,'wood-oak:1',(23,14,25,35))
    for y in (19,24,29):box(im,'ash:2',(9,y,19,y+1));box(im,'ash:3',(29,y,38,y+1))
    return im

def basin():
    im=new();framed(im,(3,14,44,39),'iron',3);box(im,'iron:1',(7,19,40,33));box(im,'sewer-water:3',(9,21,38,31));line(im,'sewer-water:5','12,24 25,24 25,26 34,26',2)
    box(im,'iron:5',(5,15,42,17));return im

def table(w=96,h=48):
    im=new(w,h)
    for x in [7,w-12]:framed(im,(x,h-17,x+5,h-3),'wood-oak',3)
    framed(im,(3,4,w-4,h-14),'wood-oak',4);box(im,'wood-oak:2',(5,h-19,w-6,h-16));box(im,'wood-oak:5',(5,6,w-6,7))
    for y in range(13,h-19,9):box(im,'wood-oak:3',(6,y,w-7,y))
    line(im,'wood-oak:3',f'14,10 33,10 33,11 42,11',1)
    line(im,'wood-oak:5',f'{w-40},18 {w-17},18',1)
    return im

def run():
    imgs={'party':token(),'foe':token(True),'chest-open':chest_open(),'door-open':door('open'),'door-locked':door('locked'),'door-secret':door('secret'),'airlock-open':door('open',True),'airlock-locked':door('locked',True),
      'stairs-up':stairs(True),'stairs-down':stairs(),'trap-found':trap(),'bones':bone(),'weapon-rack':rack(),'boulder':stone(),'stalagmite':stone('stalagmite'),'rubble':rubble(),'candles':candle(),'chair':chair(),'bookshelf':cabinet('bookshelf'),'cabinet':cabinet('cabinet'),'hearth':fireplace(),'bed':bed(),'coffin':coffin(),'book':books(),'basin':basin(),'table-short':table(),'table-long':table(288),'table-vertical':table(48,192)}
    # Final joinery and cloth seams, all deliberate native strokes.
    for n in ['bookshelf','cabinet']:
        im=imgs[n]
        line(im,'wood-oak:2','4,24 4,42 5,42 5,60 4,60 4,78',1)
        line(im,'wood-oak:5','42,28 42,47 41,47 41,72 42,72 42,84',1)
        line(im,'wood-oak:4','11,21 24,21 24,22 34,22',1)
        for yy in (45,66,87):line(im,'wood-oak:2',f'8,{yy} 19,{yy} 19,{yy-1} 29,{yy-1}',1)
    im=imgs['cabinet']
    for yy in [29,50,71]:
        line(im,'wood-oak:3',f'12,{yy} 20,{yy} 20,{yy+1} 30,{yy+1}',1)
        line(im,'brass:2',f'21,{yy+5} 21,{yy+8} 27,{yy+8} 27,{yy+5}',1)
    im=imgs['chair']
    box(im,'wood-oak:5',(8,8,10,25));box(im,'wood-oak:2',(38,9,39,26))
    line(im,'textiles-sage:4','14,13 33,13 33,15',1);line(im,'textiles-sage:2','15,22 33,22',1)
    framed(im,(4,26,9,32),'wood-oak',4);framed(im,(38,26,43,32),'wood-oak',4)
    line(im,'wood-oak:2','12,35 20,35 20,34 29,34',1)
    im=imgs['bed']
    line(im,'bone:2','15,40 33,40 33,38',1);line(im,'bone:3','14,32 22,32 22,33 28,33',1)
    line(im,'textiles-russet:2','14,52 14,65 17,65 17,72',1)
    line(im,'textiles-russet:4','28,53 28,62 26,62 26,68',1)
    for xx in [15,22,29]:line(im,'textiles-russet:3',f'{xx},47 {xx},50',1)
    line(im,'wood-oak:2','10,80 19,80 19,81 33,81',1)
    im=imgs['hearth']
    for pp in ['11,12 17,12 17,14 22,14','25,23 33,23 33,25 36,25','11,36 19,36 19,38 26,38','26,48 35,48','8,60 12,60 12,62','36,66 39,66 39,72','9,79 9,84 12,84']:
        line(im,'limestone:3',pp,1)
    line(im,'wood-oak:2','8,54 20,54 20,55 33,55',1)
    for n in ['table-short','table-long','table-vertical']:
        im=imgs[n];w,h=im.size
        if w>48:spots=[(xx,18) for xx in range(25,w-12,48)]
        else:spots=[(24,yy) for yy in range(27,h-24,48)]
        for j,(xx,yy) in enumerate(spots):
            poly(im,'bone:1',f'{xx-6},{yy-2} {xx-3},{yy-5} {xx+4},{yy-5} {xx+7},{yy-2} {xx+7},{yy+2} {xx+3},{yy+5} {xx-3},{yy+5} {xx-6},{yy+2}')
            box(im,'bone:3',(xx-4,yy-2,xx+5,yy+2));line(im,'bone:4',f'{xx-2},{yy-3} {xx+3},{yy-3}',1)
            line(im,'wood-oak:2',f'{xx-11},{yy+12} {xx-2},{yy+12} {xx-2},{yy+13} {xx+8},{yy+13}',1)
    for n,im in imgs.items():im.save(BASE/f'canon/props/d-{n}.png')
    return imgs
if __name__=='__main__':run()
