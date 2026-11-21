"""C23 native pencil repairs. Only the nine critic-listed PNGs are replaced.

Rock geometry refers to the existing C21 image-tool studies. All repaired
edges below are authored integer coordinates; no image read-back or resize.
"""
from PIL import Image, ImageDraw
from redraw_critic21 import canvas, poly, line, box, polygons, col
from draw_proofs import BASE, REVIEW, S, P
from draw_style_samples import SWATCHES

CHANGED = ['cave_rock', 'cave_crystal', 'yard']
STUDIES = ['cave_rock', 'cave_crystal']
START = REVIEW / 'C23-redraw-start'


def strokes(im, colour, paths):
    for path in paths:
        line(im, colour, path)


def rock():
    # A continuous bed cut by three faults. Planes share edges; recesses do
    # not encircle individual stones. Long bedding steps meet the faults.
    t = canvas((144, 40), 'mud:2')
    polygons(t, 'grey-brown-rock:2', [
        '0,0 49,0 49,7 44,7 44,11 37,11 37,14 24,14 24,18 12,18 12,20 0,20',
        '54,0 99,0 99,5 96,5 96,12 101,12 101,18 90,18 90,21 72,21 72,18 63,18 63,12 54,12',
        '105,0 143,0 143,25 131,25 131,22 119,22 119,16 111,16 111,11 105,11',
        '0,25 16,25 16,22 29,22 29,18 43,18 43,14 51,14 51,20 57,20 57,30 49,30 49,34 35,34 35,39 0,39',
        '65,24 79,24 79,27 96,27 96,24 108,24 108,29 116,29 116,34 125,34 125,39 58,39 58,32 65,32',
        '126,29 137,29 137,31 143,31 143,39 130,39 130,35 126,35'])
    # Lit lips belong to a ledge, never a decorative stroke inside a stone.
    polygons(t, 'mud:3', [
        '0,1 20,1 20,3 12,3 12,4 0,4',
        '24,12 37,12 37,9 44,9 44,7 48,7 48,11 40,11 40,14 26,14 26,17 15,17 15,16 24,16',
        '57,1 73,1 73,3 65,3 65,5 59,5 59,9 57,9',
        '73,19 89,19 89,16 99,16 99,18 92,18 92,21 73,21',
        '110,2 121,2 121,4 114,4 114,7 110,7',
        '121,20 133,20 133,22 143,22 143,24 130,24 130,22 121,22',
        '2,27 16,27 16,24 27,24 27,26 20,26 20,29 2,29',
        '36,32 49,32 49,29 55,29 55,31 51,31 51,34 36,34',
        '67,26 77,26 77,29 90,29 90,31 74,31 74,28 67,28',
        '109,30 114,30 114,33 123,33 123,35 112,35 112,32 109,32'])
    strokes(t, 'mud:1', [
        '51,0 51,8 49,8 49,12 53,12 53,18 59,18 59,30 55,30 55,39',
        '102,0 102,9 107,9 107,18 111,18 111,24 119,24 119,31 128,31 128,39',
        '0,22 13,22 13,20 27,20 27,16 39,16 39,13 49,13',
        '59,22 71,22 71,24 94,24 94,22 110,22',
        '6,39 6,35 10,35 10,32',
        '81,0 81,5 78,5 78,9 75,9 75,12',
        '143,8 135,8 135,10 130,10 130,13'])
    # Three small fracture faces continue their parent ledges.
    polygons(t, 'mud:3', [
        '37,2 41,2 41,4 39,4 39,6 37,6',
        '3,17 8,17 8,19 5,19 5,20 3,20',
        '84,18 87,18 87,16 90,16 90,18 88,18 88,20 84,20'])
    # A broken off lip widens one recess locally, without a full dark gutter.
    poly(t, 'mud:1', '50,13 54,13 54,18 58,18 58,21 54,21 54,18 50,18')

    f = canvas((144, 47), 'grey-brown-rock:3')
    # Shadow planes connected to fissures and the lower edge of each overhang.
    polygons(f, 'grey-brown-rock:2', [
        '19,0 24,0 24,7 29,7 29,14 38,14 38,19 48,19 48,23 38,23 38,21 31,21 31,17 26,17 26,10 22,10 22,5 19,5',
        '0,17 8,17 8,15 17,15 17,18 12,18 12,21 0,21',
        '0,30 14,30 14,27 26,27 26,24 40,24 40,22 52,22 52,26 43,26 43,29 30,29 30,32 17,32 17,36 0,36',
        '48,0 54,0 54,6 58,6 58,16 64,16 64,22 71,22 71,29 67,29 67,35 62,35 62,46 56,46 56,36 60,36 60,28 56,28 56,20 52,20 52,11 48,11',
        '84,0 91,0 91,7 87,7 87,13 82,13 82,20 77,20 77,25 71,25 71,21 75,21 75,13 80,13 80,7 84,7',
        '65,37 79,37 79,33 91,33 91,29 104,29 104,26 117,26 117,22 130,22 130,19 143,19 143,25 132,25 132,28 120,28 120,32 107,32 107,35 94,35 94,39 81,39 81,43 65,43',
        '113,0 119,0 119,7 116,7 116,14 120,14 120,22 114,22 114,16 111,16 111,8 113,8',
        '98,38 104,38 104,46 96,46 96,43 98,43',
        '128,32 135,32 135,37 139,37 139,46 132,46 132,39 128,39'])
    # Sediment belongs to exposed horizontal shelves, with unequal depths.
    polygons(f, 'mud:3', [
        '0,21 12,21 12,19 18,19 18,21 15,21 15,23 0,23',
        '16,32 29,32 29,29 43,29 43,27 51,27 51,30 44,30 44,32 31,32 31,35 18,35 18,38 0,38 0,36 16,36',
        '65,43 81,43 81,39 94,39 94,36 106,36 106,38 97,38 97,42 84,42 84,45 65,45',
        '121,28 132,28 132,25 143,25 143,27 135,27 135,31 123,31 123,34 119,34 119,31 121,31',
        '28,10 31,10 31,14 37,14 37,16 30,16 30,13 28,13'])
    strokes(f, 'grey-brown-rock:1', [
        '50,0 50,8 54,8 54,18 60,18 60,24 64,24 64,31 61,31 61,39 58,39 58,46',
        '116,0 116,6 113,6 113,14 117,14 117,24 110,24 110,29 103,29 103,33 91,33 91,37 78,37 78,41 65,41',
        '0,33 13,33 13,30 26,30 26,27 40,27 40,24 52,24 52,22 57,22',
        '24,0 24,6 28,6 28,11',
        '86,0 86,7 82,7 82,13 78,13 78,18',
        '143,22 132,22 132,25 119,25',
        '135,46 135,38 131,38 131,33'])
    # Top-left light: short, stepped lip chips, at the master's detail scale.
    polygons(f, 'grey-brown-rock:4', [
        '1,0 13,0 13,1 8,1 8,2 1,2',
        '29,0 44,0 44,2 38,2 38,3 32,3 32,2 29,2',
        '57,0 71,0 71,1 65,1 65,3 59,3 59,5 57,5',
        '91,1 104,1 104,3 96,3 96,4 91,4',
        '122,0 140,0 140,1 131,1 131,3 124,3 124,5 122,5',
        '1,28 12,28 12,26 24,26 24,24 29,24 29,25 26,25 26,28 15,28 15,30 1,30',
        '33,22 41,22 41,20 48,20 48,21 43,21 43,23 33,23',
        '70,34 78,34 78,31 87,31 87,29 92,29 92,30 89,30 89,33 81,33 81,36 70,36',
        '120,19 127,19 127,17 136,17 136,15 143,15 143,17 139,17 139,19 130,19 130,21 120,21'])
    # Exposed chips and split ends attach to existing beds and faults.
    polygons(f, 'grey-brown-rock:2', [
        '10,6 14,6 14,8 19,8 19,10 22,10 22,12 17,12 17,10 12,10 12,8 10,8',
        '39,26 39,33 36,33 36,37 34,37 34,33 36,33 36,29',
        '89,15 95,15 95,17 101,17 101,19 110,19 110,21 100,21 100,19 93,19 93,17 89,17',
        '106,33 109,33 109,38 112,38 112,41 110,41 110,39 107,39 107,36 106,36'])
    polygons(f, 'grey-brown-rock:4', [
        '12,6 16,6 16,8 14,8 14,7 12,7',
        '31,26 35,26 35,27 33,27 33,28 31,28',
        '92,14 96,14 96,16 94,16 94,15 92,15',
        '100,17 106,17 106,18 102,18 102,19 100,19',
        '128,33 131,33 131,35 129,35 129,34 128,34'])
    return t, f


def crystal():
    t = canvas((144,40), 'dark-rock:3')
    polygons(t, 'dark-rock:2', [
        '38,0 46,0 46,8 41,8 41,16 36,16 36,24 31,24 31,32 26,32 26,39 20,39 20,31 25,31 25,23 30,23 30,14 35,14 35,6 38,6',
        '0,20 11,20 11,23 23,23 23,28 12,28 12,25 0,25',
        '69,0 76,0 76,5 81,5 81,10 86,10 86,18 94,18 94,24 102,24 102,30 109,30 109,39 102,39 102,32 94,32 94,26 85,26 85,20 78,20 78,13 73,13 73,7 69,7',
        '43,24 56,24 56,20 68,20 68,16 76,16 76,21 70,21 70,25 58,25 58,29 45,29 45,33 29,33 29,28 43,28',
        '111,0 117,0 117,9 123,9 123,16 143,16 143,21 121,21 121,17 115,17 115,11 111,11',
        '116,33 127,33 127,29 138,29 138,26 143,26 143,31 140,31 140,34 129,34 129,38 116,38'])
    strokes(t, 'dark-rock:4', [
        '0,1 17,1 17,3 25,3',
        '42,1 63,1 63,2 68,2',
        '88,2 103,2 103,4 109,4',
        '122,1 134,1 134,3 143,3',
        '0,18 11,18 11,21 19,21',
        '36,25 43,25 43,22 54,22 54,18 63,18',
        '101,23 112,23 112,25 121,25',
        '111,26 119,26 119,28 126,28'])
    strokes(t, 'dark-rock:1', [
        '41,0 41,7 38,7 38,15 33,15 33,23 28,23 28,31 23,31 23,39',
        '73,0 73,5 78,5 78,11 82,11 82,19 90,19 90,25 98,25 98,31 105,31 105,39',
        '114,0 114,9 119,9 119,18 127,18 127,20 143,20'])
    f = canvas((144,47), 'dark-rock:4')
    # Asymmetric host bed: a left undercut, a vertical central cleavage and
    # a shelf climbing right. Shared planes continue behind the mineral vein.
    polygons(f, 'dark-rock:3', [
        '0,13 10,13 10,16 19,16 19,20 27,20 27,25 34,25 34,30 42,30 42,35 50,35 50,46 40,46 40,37 32,37 32,32 24,32 24,26 17,26 17,21 9,21 9,18 0,18',
        '33,0 39,0 39,8 36,8 36,15 31,15 31,24 27,24 27,20 29,20 29,12 33,12',
        '70,0 78,0 78,9 74,9 74,19 79,19 79,28 73,28 73,36 67,36 67,46 59,46 59,34 65,34 65,25 69,25 69,16 67,16 67,8 70,8',
        '80,30 91,30 91,26 100,26 100,22 110,22 110,18 122,18 122,14 134,14 134,11 143,11 143,19 136,19 136,23 124,23 124,27 113,27 113,31 103,31 103,35 92,35 92,39 78,39 78,43 70,43 70,36 80,36',
        '102,0 108,0 108,8 113,8 113,16 109,16 109,11 104,11 104,6 102,6',
        '122,31 128,31 128,37 133,37 133,46 127,46 127,40 122,40',
        '0,33 7,33 7,37 17,37 17,42 24,42 24,46 16,46 16,44 8,44 8,40 0,40'])
    # Recesses have unequal depths; they branch or terminate at real faces.
    strokes(f, 'dark-rock:2', [
        '36,0 36,8 33,8 33,15 28,15 28,23',
        '0,16 9,16 9,19 18,19 18,23 25,23 25,29 33,29 33,34 41,34 41,39 46,39 46,46',
        '74,0 74,8 70,8 70,17 74,17 74,25 70,25 70,33 64,33 64,46',
        '143,15 135,15 135,19 123,19 123,23 112,23 112,27 101,27 101,31 90,31 90,35 78,35 78,39 68,39',
        '105,0 105,7 110,7 110,14',
        '130,46 130,38 125,38 125,32'])
    # Narrow turning lips sit directly above the undercuts, not nested inside.
    polygons(f, 'dark-rock:5', [
        '1,0 16,0 16,1 11,1 11,2 1,2',
        '40,1 55,1 55,2 50,2 50,4 43,4 43,6 40,6',
        '81,0 96,0 96,2 89,2 89,3 83,3 83,5 81,5',
        '113,1 130,1 130,2 124,2 124,4 118,4 118,5 113,5',
        '1,11 10,11 10,14 18,14 18,16 12,16 12,14 7,14 7,13 1,13',
        '20,18 25,18 25,21 30,21 30,23 26,23 26,21 20,21',
        '34,28 41,28 41,31 47,31 47,33 43,33 43,31 38,31 38,30 34,30',
        '82,28 90,28 90,24 99,24 99,21 105,21 105,23 101,23 101,26 93,26 93,30 82,30',
        '114,16 122,16 122,12 133,12 133,9 143,9 143,11 135,11 135,14 125,14 125,18 114,18',
        '2,31 6,31 6,33 12,33 12,35 8,35 8,33 2,33'])
    # Chips along the descending fault and the right ledge, each attached.
    polygons(f, 'dark-rock:3', [
        '14,3 17,3 17,7 20,7 20,12 22,12 22,18 20,18 20,14 18,14 18,9 15,9 15,6 14,6',
        '90,34 93,34 93,39 96,39 96,43 94,43 94,40 91,40 91,37 90,37',
        '129,25 136,25 136,28 141,28 141,30 135,30 135,28 129,28'])
    polygons(f, 'dark-rock:5', [
        '17,8 19,8 19,11 18,11 18,10 17,10',
        '26,25 29,25 29,27 27,27 27,26 26,26',
        '130,25 134,25 134,26 132,26 132,27 130,27'])
    # Preserve the accepted angular mineral inclusion pixel for pixel.
    old=Image.open(START/'cave_crystal-wall.png').convert('RGBA')
    mineral={Image.new('RGBA',(1,1),h).getpixel((0,0)) for h in P['violet-crystal']}
    for y in range(47):
        for x in range(144):
            p=old.getpixel((x,y+48))
            if p in mineral:f.putpixel((x,y),p)
    return t,f


def yard_floor():
    floor=Image.open(START/'yard-floor.png').convert('RGBA').crop((0,96,144,144))
    # Work across the vertical period: y=-7..7 crosses the actual seam.
    # Only boundary stones change; middle source cobbles remain untouched.
    wrap=Image.new('RGBA',(144,144))
    for y in (0,48,96):wrap.paste(floor,(0,y))
    polygons(wrap,'yard-cobble:3',[
        '99,41 143,41 143,55 99,55'])
    # Three crossing stones join their surviving interior ends. No hard row.
    polygons(wrap,'yard-path:3',[
        '99,39 106,39 106,42 113,42 117,47 117,51 113,55 108,55 108,57 104,57 104,53 100,53 100,47 99,47',
        '124,40 133,40 137,43 139,48 138,52 134,56 128,56 125,53 123,49 123,44'])
    polygons(wrap,'yard-cobble:4',[
        '105,42 111,42 115,46 115,49 112,52 106,52 103,49 103,45',
        '127,41 132,41 136,44 136,48 133,51 127,51 125,48 125,44'])
    polygons(wrap,'yard-path:4',[
        '103,45 106,42 109,42 109,44 106,44 106,47 103,47',
        '126,44 129,41 132,41 132,43 129,43 129,46 126,46'])
    polygons(wrap,'roof-slate:3',[
        '115,41 119,41 122,44 122,50 120,53 117,54 113,57 110,57 110,55 114,52 118,51 120,48 119,44 115,43',
        '136,40 139,40 141,43 143,43 143,46 140,46 139,43 136,42',
        '102,40 102,43 100,46 99,46 99,42'])
    # A longer edge stone crosses the seam between the two rounded stones.
    poly(wrap,'yard-cobble:4','116,53 122,51 126,54 125,58 121,59 116,57')
    for y in range(41,59):
        for x in range(99,144):floor.putpixel((x,y%48),wrap.getpixel((x,y)))
    # Turf returns over the paving in unequal steps and follows two stone edges.
    # Source blade clusters are copied at native size into the widened turf.
    turf=Image.open(START/'yard-floor.png').convert('RGBA').crop((0,96,48,144))
    mask=Image.new('1',(144,48));d=ImageDraw.Draw(mask)
    from draw_proofs import pts
    d.polygon(pts('139,0 143,0 143,47 139,47 139,43 136,43 136,39 134,39 134,35 137,35 137,31 141,31 141,25 143,25 143,18 140,18 140,15 137,15 137,11 135,11 135,7 137,7 137,3 139,3'),fill=1)
    for y in range(48):
        for x in range(134,144):
            if mask.getpixel((x,y)):floor.putpixel((x,y),turf.getpixel((x-130,y)))
    return floor


def run():
    for n,fn in [('cave_rock',rock),('cave_crystal',crystal),('yard',None)]:
        wall=Image.open(START/f'{n}-wall.png').convert('RGBA')
        backing=Image.open(START/f'{n}-floor.png').convert('RGBA')
        if fn:
            top,face=fn();wall.paste(top,(0,8));wall.paste(face,(0,48))
        else:backing.paste(yard_floor(),(0,96))
        from c23_pixel_cleanup import clean
        wall,backing=clean(n,wall,backing)
        wall.save(REVIEW/f'C-layer-{n}-wall.png');backing.save(REVIEW/f'C-layer-{n}-floor.png')
        proof=backing.copy();proof.paste(wall);proof.alpha_composite(Image.open(START/f'{n}-prop.png').convert('RGBA'),(86,96))
        proof.save(BASE/f'proof/{n}.png');proof.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
    guide=Image.open(START/'style-guide.png').convert('RGB')
    for n in STUDIES:
        # Preserve the accepted floor half of each existing study.
        sw=Image.open(BASE/f'canon/swatches/{n}.png').convert('RGBA')
        wall=Image.open(REVIEW/f'C-layer-{n}-wall.png')
        sw.paste(wall.crop((0,8,48,20)),(0,0))
        x=30 if n=='cave_crystal' else 0
        sw.paste(wall.crop((x,56,x+48,68)),(0,12))
        from c23_pixel_cleanup import clean_swatch
        sw=clean_swatch(n,sw);sw.save(BASE/f'canon/swatches/{n}.png')
        i=list(SWATCHES).index(n);guide.paste(sw,(48+i%7*240,800+i//7*94))
    guide.save(BASE/'canon/style-guide.png')

if __name__=='__main__':run()
