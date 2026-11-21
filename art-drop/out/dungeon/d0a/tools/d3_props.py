"""Native loot states derived from the accepted B chest's panels and metalwork."""
from PIL import Image
from draw_proofs import BASE,c
from d_sprites import new,framed
from redraw_critic21 import box,line,poly


def chest(opened=False):
    source=Image.open(BASE/'canon/props/chest.png').convert('RGBA')
    # Preserve all accepted construction pixels, raising the painted timber two
    # steps for loot separation. Gold is limited to straps, rim and hardware.
    mapping={tuple(bytes.fromhex(c('textiles-teal',i)[1:])):tuple(bytes.fromhex(c('textiles-teal',i+2)[1:])) for i in (3,4)}
    mapping.update({tuple(bytes.fromhex(c('loot-gold',i)[1:])):tuple(bytes.fromhex(c('loot-gold',i+1)[1:])) for i in (3,4)})
    im=source.copy();im.putdata([(*mapping.get(p[:3],p[:3]),p[3]) for p in source.get_flattened_data()])
    if not opened:return im
    out=new()
    # Identical lower front, strap ends, grain and feet, copied without scaling.
    out.paste(im.crop((0,28,48,48)),(0,28))
    # Upright lid with a thick rolled edge, inset planks and folded-back hasp.
    poly(out,'textiles-teal:1','8,3 39,3 39,4 42,4 42,21 5,21 5,4 8,4')
    box(out,'textiles-teal:5',(6,5,41,20));line(out,'textiles-teal:6','8,4 38,4',1)
    box(out,'textiles-teal:2',(9,7,38,17));box(out,'textiles-teal:3',(10,8,37,16))
    for y in (11,15):line(out,'textiles-teal:1',f'10,{y} 37,{y}',1)
    for pp in ['15,9 23,9 23,10 30,10','18,13 29,13 29,14 35,14']:
        line(out,'textiles-teal:4',pp,1)
    for x in (11,32):
        framed(out,(x,5,x+3,20),'loot-gold',4);line(out,'loot-gold:5',f'{x+1},6 {x+1},18',1)
        box(out,'loot-gold:6',(x+1,8,x+2,9))
        # Hinges physically span every row between the lid and the case.
        box(out,'loot-gold:1',(x,20,x+4,26));box(out,'loot-gold:4',(x+1,21,x+3,25));line(out,'loot-gold:6',f'{x+1},21 {x+3},21',1)
    framed(out,(21,3,27,8),'loot-gold',4);box(out,'loot-gold:1',(23,5,25,6))
    # Open cavity: rear wall, dark bottom, narrow side liners and front lip.
    box(out,'textiles-teal:1',(5,24,42,30));box(out,'wood-oak:2',(7,25,40,28));box(out,'wood-oak:1',(10,25,37,27))
    box(out,'textiles-teal:5',(6,25,8,29));box(out,'textiles-teal:3',(39,25,41,29))
    line(out,'loot-gold:4','6,29 41,29',1);line(out,'textiles-teal:1','6,30 41,30',1)
    for x in (11,32):
        box(out,'loot-gold:1',(x,28,x+3,39));box(out,'loot-gold:4',(x+1,29,x+2,38));line(out,'loot-gold:5',f'{x+1},30 {x+1},37',1)
        box(out,'loot-gold:6',(x+1,36,x+2,37))
    framed(out,(21,29,27,35),'loot-gold',4);box(out,'loot-gold:1',(23,31,25,33));line(out,'loot-gold:6','22,30 26,30',1)
    return out


def brazier(im,x,y,broken=False):
    """A bowl, fuel bed, clamps and feet; broken bowl rests on its side."""
    if broken:
        poly(im,'iron:1',f'{x-18},{y+4} {x-11},{y-6} {x+6},{y-6} {x+15},{y+1} {x+10},{y+11} {x-6},{y+14}')
        poly(im,'lair-hoard:3',f'{x-16},{y+4} {x-10},{y-4} {x+4},{y-4} {x+11},{y+1} {x+7},{y+8} {x-5},{y+11}')
        line(im,'lair-hoard:5',f'{x-12},{y+1} {x-8},{y-3} {x+3},{y-3}',1)
        poly(im,'iron:1',f'{x-10},{y+3} {x-4},{y} {x+4},{y+1} {x+7},{y+4} {x+2},{y+8} {x-6},{y+8}')
        line(im,'iron:3',f'{x-9},{y+4} {x-4},{y+1} {x+3},{y+2}',1)
        line(im,'iron:2',f'{x+9},{y+7} {x+19},{y+12} {x+21},{y+18}',3)
        line(im,'iron:4',f'{x+10},{y+7} {x+18},{y+11}',1)
        poly(im,'lair-hoard:3',f'{x-21},{y+15} {x-13},{y+13} {x-7},{y+17} {x-10},{y+20} {x-19},{y+20}')
        return
    for dx in (-13,10):
        box(im,'iron:1',(x+dx,y+4,x+dx+4,y+17));box(im,'iron:3',(x+dx+1,y+5,x+dx+3,y+15));line(im,'iron:4',f'{x+dx+1},{y+6} {x+dx+1},{y+13}',1)
        box(im,'iron:1',(x+dx-2,y+17,x+dx+6,y+19))
    poly(im,'iron:1',f'{x-22},{y-5} {x-17},{y-9} {x+17},{y-9} {x+22},{y-5} {x+20},{y+3} {x+15},{y+9} {x+8},{y+12} {x-8},{y+12} {x-15},{y+9} {x-20},{y+3}')
    poly(im,'lair-hoard:3',f'{x-20},{y-4} {x+20},{y-4} {x+18},{y+3} {x+13},{y+8} {x+7},{y+10} {x-7},{y+10} {x-13},{y+8} {x-18},{y+3}')
    line(im,'lair-hoard:5',f'{x-17},{y+1} {x-14},{y+5} {x-8},{y+8} {x+7},{y+8}',1)
    poly(im,'lair-hoard:4',f'{x-20},{y-5} {x-16},{y-8} {x+16},{y-8} {x+20},{y-5} {x+16},{y-1} {x-16},{y-1}')
    poly(im,'iron:1',f'{x-16},{y-5} {x-12},{y-7} {x+12},{y-7} {x+16},{y-5} {x+12},{y-3} {x-12},{y-3}')
    line(im,'lair-hoard:6',f'{x-16},{y-8} {x+13},{y-8}',1)
    for dx,dy,w in [(-12,-6,8),(-3,-5,11),(5,-7,7)]:
        box(im,'wood-oak:2',(x+dx,y+dy,x+dx+w,y+dy+2));line(im,'lair-hoard:4',f'{x+dx},{y+dy} {x+dx+w-1},{y+dy}',1)
    # Three joined tongues rise from the coals, leaving the bowl visible.
    poly(im,'lair-hoard:4',f'{x-10},{y-6} {x-13},{y-11} {x-13},{y-17} {x-9},{y-14} {x-6},{y-18} {x-6},{y-24} {x-2},{y-29} {x-2},{y-21} {x+2},{y-17} {x+5},{y-20} {x+5},{y-24} {x+9},{y-18} {x+12},{y-14} {x+12},{y-10} {x+8},{y-6}')
    poly(im,'lair-hoard:6',f'{x-6},{y-6} {x-8},{y-11} {x-5},{y-15} {x-2},{y-20} {x-2},{y-14} {x+2},{y-11} {x+5},{y-15} {x+7},{y-10} {x+5},{y-6}')
    for dx in (-17,14):
        box(im,'iron:1',(x+dx,y-8,x+dx+3,y+5));line(im,'iron:4',f'{x+dx+1},{y-7} {x+dx+1},{y+3}',1)


def altar(im,x,y):
    # Original marker remains the centre of a stepped tomb altar with a green
    # stone reliquary. Parallel top/front planes, fluted supports and carved rails.
    framed(im,(x-26,y+14,x+26,y+21),'dark-masonry',3);line(im,'dark-masonry:5',f'{x-24},{y+15} {x+24},{y+15}',1)
    for dx in (-20,11):
        framed(im,(x+dx,y-1,x+dx+9,y+14),'dark-masonry',3)
        line(im,'dark-masonry:5',f'{x+dx+1},{y} {x+dx+1},{y+12}',1)
        box(im,'dark-masonry:2',(x+dx+4,y+2,x+dx+7,y+11))
    framed(im,(x-26,y-13,x+26,y+1),'dark-masonry',3);box(im,'dark-masonry:5',(x-25,y-12,x+25,y-5));line(im,'dark-masonry:6',f'{x-24},{y-12} {x+24},{y-12}',1)
    line(im,'dark-masonry:2',f'{x-24},{y-3} {x+24},{y-3}',1)
    for dx in (-19,-7,5,17):
        box(im,'dark-masonry:2',(x+dx,y-1,x+dx+4,y));line(im,'dark-masonry:4',f'{x+dx},{y-1} {x+dx+3},{y-1}',1)
    framed(im,(x-14,y-21,x+14,y-14),'overgrowth',3);box(im,'overgrowth:4',(x-13,y-20,x+13,y-18))
    poly(im,'overgrowth:1',f'{x-11},{y-22} {x-11},{y-46} {x-8},{y-50} {x+8},{y-50} {x+11},{y-46} {x+11},{y-22}')
    box(im,'overgrowth:3',(x-10,y-45,x+10,y-23));box(im,'overgrowth:4',(x-7,y-49,x+7,y-44));line(im,'overgrowth:5',f'{x-7},{y-49} {x+6},{y-49}',1)
    framed(im,(x-6,y-42,x+6,y-26),'overgrowth',2)
    line(im,'overgrowth:4',f'{x-3},{y-39} {x},{y-35} {x+3},{y-39} {x+3},{y-31} {x-3},{y-31} {x-3},{y-39}',1)
    line(im,'overgrowth:5',f'{x-9},{y-44} {x-9},{y-26}',1)
    line(im,'dark-masonry:4',f'{x-20},{y-10} {x-12},{y-10} {x-12},{y-8} {x-5},{y-8}',1)

if __name__=='__main__':
    chest().save(BASE/'canon/props/d-chest.png');chest(True).save(BASE/'canon/props/d-chest-open.png')
