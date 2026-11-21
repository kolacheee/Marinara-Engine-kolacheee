"""Critic 1 repairs, drawn in final pixels; passed proofs are never rewritten."""
from PIL import Image,ImageDraw
from draw_proofs import BASE,REVIEW,c
from redraw_critic21 import canvas,box,line,poly
from draw_style_samples import SWATCHES
from check_proofs import light

def replace(im,mapping,area):
    p=im.load()
    rgb=lambda s:tuple(bytes.fromhex(c(*s)[1:]))+(255,)
    m={rgb(k):rgb(v) for k,v in mapping.items()}
    for y in range(area[1],area[3]):
        for x in range(area[0],area[2]):
            if p[x,y] in m:p[x,y]=m[p[x,y]]

def ground(n):
    cfg={'cave_rock':('grey-brown-rock:3','mud:5','grey-brown-rock:4'), 'cave_crystal':('dark-rock:4','violet-crystal:3','dark-rock:5'), 'cave_ice':('blue-ice:3','frost:2','snowdrift:3'), 'cave_lava':('basalt:5','ash:3','embers:4')}
    base,shade,lit=cfg[n];im=canvas((288,288),base)
    if n in ('cave_rock','cave_crystal'):
        poly(im,shade,'0,0 287,0 287,24 252,24 252,27 217,27 217,31 174,31 174,35 129,35 129,32 84,32 84,28 41,28 41,24 0,24')
        box(im,shade,(0,282,287,287))
        line(im,lit,'7,25 39,25 39,29 81,29 81,33 115,33',2)
    # Quiet connected bedding planes. All boundary crossings match opposite edges.
    # No scene landmark belongs to this repeat.
    for path in ['0,67 37,67 37,65 81,65 81,61 126,61 126,58 167,58 167,61 209,61 209,65 251,65 251,67 287,67',
                 '0,219 31,219 31,222 79,222 79,226 131,226 131,229 179,229 179,226 226,226 226,222 263,222 263,219 287,219']:
        line(im,shade,path,3 if n=='cave_ice' else 2)
    # Broad, enclosed mineral plane; the ends taper in deliberate integer steps.
    poly(im,shade,'44,114 72,114 72,110 113,110 113,107 155,107 155,110 199,110 199,115 234,115 234,123 206,123 206,128 161,128 161,131 119,131 119,128 80,128 80,122 44,122')
    if n=='cave_ice':
        line(im,shade,'126,61 126,85 131,85 131,107',3)
        line(im,shade,'179,229 179,255 174,255 174,287',3)
        line(im,shade,'174,0 174,28 167,28 167,58',3)
        poly(im,lit,'47,117 76,117 76,113 112,113 112,110 152,110 152,113 114,113 114,116 78,116 78,121 47,121')
    elif n=='cave_lava':
        # An ash seam widens into an ember-filled fault, wrapped in both axes.
        a='0,67 37,67 37,65 81,65 81,61 126,61 126,58 167,58 167,61 209,61 209,65 251,65 251,67 287,67'
        line(im,'embers:3',a,8);line(im,lit,a,3)
        line(im,'embers:3','126,61 126,83 131,83 131,103 140,103 140,120 148,120 148,143',5)
        line(im,lit,'126,62 126,82 131,82 131,101 140,101 140,119',2)
    else:
        line(im,shade,'81,65 81,80 86,80 86,93',2)
        line(im,lit,'119,128 151,128 151,127 172,127',2)
        line(im,shade,'226,226 226,242 218,242 218,257',2)
    return im

def sewer():
    im=canvas((288,288),'iron:3')
    for y in range(0,288,48):
        box(im,'sewer-water:3',(0,y,287,y+1))
        for x in range(0,288,48):
            box(im,'sewer-water:3',(x,y,x+1,y+47))
            line(im,'limestone:3',f'{x+4},{y+6} {x+4},{y+3} {x+40},{y+3}',1)
    box(im,'sewer-water:3',(52,0,84,287))
    box(im,'limestone:3',(48,0,50,287));box(im,'iron:3',(51,0,53,287))
    box(im,'iron:3',(83,0,85,287));box(im,'limestone:3',(86,0,89,287))
    for y in (17,55,104,158,201,259):
        line(im,'sewer-water:4',f'58,{y} 74,{y} 74,{y+2} 80,{y+2}',2)
    for path in ['0,41 19,41 19,37 29,37 29,33 38,33','96,83 112,83 112,78 124,78','193,188 212,188 212,181 225,181','240,258 263,258 263,253 277,253']:
        line(im,'sewer-water:3',path,4)
    return im

def mushroom():
    im=Image.new('RGBA',(48,48))
    poly(im,'fungus:1','18,18 30,18 30,27 33,32 32,40 27,44 19,44 15,40 16,31')
    poly(im,'fungus:3','20,21 28,21 27,30 29,37 26,41 20,41 18,38 20,30')
    line(im,'fungus:4','21,24 21,31 20,35 20,39',2)
    poly(im,'fungus:1','3,19 5,14 10,9 16,6 30,6 36,9 41,14 44,20 42,25 35,29 13,29 6,26')
    poly(im,'fungus:2','5,21 42,21 40,24 34,27 14,27 8,24')
    poly(im,'fungus:4','5,19 7,15 12,11 17,8 29,8 35,11 39,15 42,20 36,23 12,23')
    poly(im,'fungus:3','7,19 13,19 13,21 24,21 24,19 33,19 33,15 39,15 42,20 36,23 12,23')
    poly(im,'fungus:5','12,13 17,10 24,10 24,12 20,12 20,15 12,15')
    box(im,'fungus:5',(28,11,31,13))
    line(im,'fungus:3','13,25 17,26 22,26',1)
    line(im,'fungus:3','29,25 34,25 37,23',1)
    return im

def run():
    for n in ['keep','temple','crypt','cave_rock']:
        w=Image.open(BASE/f'canon/surfaces/{n}-wall.png').convert('RGBA')
        if n=='keep':m={('limestone',3):('iron',3)}
        elif n=='temple':m={('sandstone',3):('sandstone',2)}
        elif n=='crypt':m={('dark-masonry',5):('dark-masonry',4)}
        else:m={('grey-brown-rock',4):('mud',3),('grey-brown-rock',3):('grey-brown-rock',2)}
        replace(w,m,(0,48,144,95));w.save(BASE/f'canon/surfaces/{n}-wall.png')
    for n in ['cave_rock','cave_crystal','cave_ice','cave_lava']:ground(n).save(BASE/f'canon/surfaces/{n}-floor.png')
    sewer().save(BASE/'canon/surfaces/dungeon_sewer-floor.png')
    mushroom().save(BASE/'canon/props/cave_rock-study.png')
    for n in ['keep','temple','crypt','cave_rock','dungeon_sewer']:
        old=Image.open(BASE/f'proof/{n}.png').convert('RGBA')
        w=Image.open(BASE/f'canon/surfaces/{n}-wall.png').convert('RGBA');f=Image.open(BASE/f'canon/surfaces/{n}-floor.png')
        old.paste(w,(0,0),w);old.paste(f.crop((0,0,144,48)),(0,96))
        old.alpha_composite(Image.open(BASE/f'canon/props/{n}-study.png').convert('RGBA'),(86,96))
        old.save(BASE/f'proof/{n}.png');old.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
        old.save(REVIEW/f'D-redraw-proof-{n}.png')
        w.save(REVIEW/f'C-layer-{n}-wall.png')
        backing=Image.new('RGBA',(144,144));backing.paste(f.crop((0,0,144,48)),(0,96));backing.save(REVIEW/f'C-layer-{n}-floor.png')
        Image.open(BASE/f'canon/props/{n}-study.png').save(REVIEW/f'C-layer-{n}-prop.png')
    # Manor wainscot is a frame repair; its accepted proof stays byte-for-byte intact.
    p=BASE/'canon/surfaces/manor-wall.png';im=Image.open(p).convert('RGBA')
    box(im,'plaster:2',(0,48,143,78));box(im,'timber:2',(0,79,143,94));box(im,'timber:4',(0,79,143,80))
    for x in (0,48,96):
        box(im,'timber:1',(x,81,x+2,94));line(im,'timber:3',f'{x+4},83 {x+43},83 {x+43},92',1);line(im,'timber:1',f'{x+7},92 {x+39},92',1)
    for pp in ['7,53 22,53 22,55 31,55 31,58 18,58 18,56 7,56','64,68 79,68 79,66 89,66 89,69 81,69 81,71 64,71','109,51 132,51 132,54 123,54 123,56 110,56']:
        poly(im,'plaster:1',pp)
    im.save(p)
    guide=Image.open(BASE/'canon/style-guide.png').convert('RGB')
    for n in ['keep','temple','crypt','cave_rock','cave_ice','cave_crystal','dungeon_sewer']:
        w=Image.open(BASE/f'canon/surfaces/{n}-wall.png');f=Image.open(BASE/f'canon/surfaces/{n}-floor.png')
        sw=Image.new('RGBA',(48,48));sw.paste(w.crop((0,48,48,60)),(0,12))
        if n in ['keep','temple','crypt','dungeon_sewer']:
            r={'keep':('iron:2','limestone:1','limestone:2'),'temple':('marble:1','sandstone:1','sandstone:2'),'crypt':('dark-masonry:3','dark-masonry:2','dark-masonry:4'),'dungeon_sewer':('brick:2','brick:1','brick:3')}[n]
            box(sw,r[0],(0,0,47,11));line(sw,r[1],'0,4 47,4',1);line(sw,r[1],'15,0 15,4 32,4 32,10',1);line(sw,r[2],'1,10 30,10',1);line(sw,r[2],'34,10 47,10',1)
        else:sw.paste(w.crop((20,20,68,32)),(0,0))
        if n in ['keep','temple','crypt']:sw.paste(f.crop((0,0,48,24)),(0,24))
        elif n=='dungeon_sewer':
            box(sw,'iron:3',(0,24,47,47));box(sw,'sewer-water:3',(20,24,34,47));box(sw,'limestone:3',(17,24,19,47));box(sw,'limestone:3',(35,24,37,47));line(sw,'sewer-water:4','23,30 31,30 31,32 34,32',2);line(sw,'sewer-water:3','0,38 16,38',1)
        else:
            r={'cave_rock':('grey-brown-rock:3','mud:4','mud:5'),'cave_crystal':('dark-rock:4','violet-crystal:3','dark-rock:5'),'cave_ice':('blue-ice:3','frost:2','snowdrift:3')}[n]
            box(sw,r[0],(0,24,47,47));poly(sw,r[1],'0,26 14,26 14,29 24,29 24,33 33,33 33,38 47,38 47,41 30,41 30,37 20,37 20,33 11,33 11,30 0,30')
            line(sw,r[2],'3,40 13,40 13,38 21,38',2);line(sw,r[1],'34,24 34,28 30,28 30,33',2)
        sw.save(BASE/f'canon/swatches/{n}.png');i=list(SWATCHES).index(n);guide.paste(sw,(48+i%7*240,800+i//7*94))
    guide.save(BASE/'canon/style-guide.png')
if __name__=='__main__':run()
