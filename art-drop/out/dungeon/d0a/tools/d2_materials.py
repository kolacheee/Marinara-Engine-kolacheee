"""Round-two pencil studies. Coordinates are native pixels, never sampled art."""
from PIL import Image
from draw_proofs import BASE, REVIEW
from redraw_critic21 import canvas,box,line,poly


from d2_ground import ground


def manor():
    im=Image.open(BASE/'canon/surfaces/manor-wall.png').convert('RGBA')
    box(im,'plaster:2',(0,48,143,75))
    # Darkened plaster at timber contact, broad trowelled areas, exposed lath.
    for pp in ['0,48 143,48 143,53 116,53 116,52 85,52 85,54 51,54 51,52 17,52 17,55 0,55',
               '0,72 25,72 25,69 41,69 41,71 70,71 70,73 103,73 103,70 122,70 122,72 143,72 143,77 0,77']:
        poly(im,'plaster:1',pp)
    for x in (0,48,96):
        box(im,'timber:1',(x,48,x+6,94));box(im,'timber:2',(x+1,49,x+5,92));line(im,'timber:3',f'{x+1},50 {x+1},91',1)
        box(im,'timber:1',(x+7,76,x+47,94));box(im,'timber:3',(x+8,78,x+46,92));box(im,'timber:2',(x+11,81,x+43,90))
        line(im,'timber:4',f'{x+8},78 {x+46},78',1);line(im,'timber:1',f'{x+11},90 {x+43},90 {x+43},81',1)
        line(im,'timber:3',f'{x+13},83 {x+40},83',1)
    line(im,'timber:3','0,75 143,75',1)
    poly(im,'timber:2','75,58 88,58 88,61 93,61 93,67 84,67 84,69 74,69 74,63 70,63 70,60 75,60')
    line(im,'timber:3','76,60 86,60',1);line(im,'timber:3','75,64 90,64',1)
    line(im,'plaster:1','31,54 31,59 35,59 35,64 40,64',1)
    line(im,'plaster:1','129,53 129,58 125,58 125,63',1)
    box(im,'timber:1',(0,95,143,95));return im


def run():
    for n in ['cave_rock','cave_crystal','cave_ice','cave_lava']:ground(n).save(BASE/f'canon/surfaces/{n}-floor.png')
    manor().save(BASE/'canon/surfaces/manor-wall.png')
    # Only the rock proof failed. Other proofs and all accepted swatches stay intact.
    n='cave_rock';p=Image.open(BASE/f'proof/{n}.png').convert('RGBA');f=ground(n).crop((0,0,144,48))
    # The proof includes one local exposed bed and wall-foot clay. These scene
    # features are not put into the reusable repeating base.
    poly(f,'mud:4','0,0 143,0 143,5 116,5 116,7 87,7 87,4 63,4 63,7 39,7 39,5 18,5 18,8 0,8')
    poly(f,'mud:4','7,18 14,12 42,12 56,16 63,23 58,29 43,31 17,28 7,24')
    poly(f,'grey-brown-rock:4','9,18 15,14 40,14 51,17 57,22 45,24 18,23 9,21')
    line(f,'grey-brown-rock:3','21,18 33,18 33,20 45,20',2)
    line(f,'mud:4','57,11 57,18 63,18 63,27 72,27 72,36 79,36 79,43',2)
    line(f,'mud:4','17,39 30,39 30,35 42,35 42,38 54,38',2)
    line(f,'grey-brown-rock:4','22,43 34,43 34,41 44,41',2)
    box(f,'mud:4',(61,20,63,21))
    p.paste(f,(0,96));p.alpha_composite(Image.open(BASE/f'canon/props/{n}-study.png').convert('RGBA'),(86,96))
    p.save(BASE/f'proof/{n}.png');p.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
    layer=Image.new('RGBA',(144,144));layer.paste(f,(0,96));layer.save(REVIEW/f'C-layer-{n}-floor.png')
if __name__=='__main__':run()
