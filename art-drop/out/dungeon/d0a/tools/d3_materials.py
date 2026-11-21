"""Critic-three pencil drawings. Wrapped paths continue through the entire seam.
No source image reduction, noise, filtering or sampled texture is used.
"""
from PIL import Image,ImageDraw
from draw_proofs import BASE,c,pts
from redraw_critic21 import canvas,box,line,poly


def draw(im,r,p,width=0,wrap=False):
    points=pts(p) if isinstance(p,str) else p
    ramp,step=r.split(':');colour=c(ramp,int(step))
    for dx in (-288,0,288) if wrap else (0,):
        for dy in (-288,0,288) if wrap else (0,):
            xy=[(x+dx,y+dy) for x,y in points];d=ImageDraw.Draw(im)
            if width:d.line(xy,fill=colour,width=width)
            else:d.polygon(xy,fill=colour)

def ribbon(im,path,top,bottom,r,wrap=True):
    q=pts(path)
    draw(im,r,[(x,y+top) for x,y in q]+[(x,y+bottom+1) for x,y in reversed(q)],wrap=wrap)


def manor():
    im=Image.open(BASE/'canon/surfaces/manor-wall.png').convert('RGBA')
    box(im,'plaster:2',(0,48,143,74))
    # Contact shadows meet beams, and restrained broad trowel facets meet those
    # shadows. Unique cracks and exposed lath do not belong in this base strip.
    for x in (0,48,96):
        box(im,'plaster:1',(x+7,48,x+46,50))
        poly(im,'plaster:1',f'{x+7},51 {x+9},51 {x+9},65 {x+11},65 {x+11},74 {x+7},74')
        poly(im,'plaster:1',f'{x+39},73 {x+46},73 {x+46},53 {x+44},53 {x+44},68 {x+39},68')
        box(im,'timber:1',(x,48,x+6,94));box(im,'timber:2',(x+1,49,x+5,92));line(im,'timber:3',f'{x+1},50 {x+1},91',1)
        box(im,'timber:1',(x+7,76,x+47,94));box(im,'timber:3',(x+8,78,x+46,92));box(im,'timber:2',(x+11,81,x+43,90))
        line(im,'timber:4',f'{x+8},78 {x+46},78',1);line(im,'timber:1',f'{x+11},90 {x+43},90 {x+43},81',1)
        line(im,'timber:3',f'{x+13},83 {x+40},83',1)
    line(im,'timber:3','0,75 143,75',1);box(im,'timber:1',(0,95,143,95))
    return im


def run():
    from d3_ground_finish import rock,crystal,ice,lava,cleanup
    for n,fn in [('cave_rock',rock),('cave_crystal',crystal),('cave_ice',ice),('cave_lava',lava)]:cleanup(fn(),n).save(BASE/f'canon/surfaces/{n}-floor.png')
    manor().save(BASE/'canon/surfaces/manor-wall.png')

if __name__=='__main__':run()
