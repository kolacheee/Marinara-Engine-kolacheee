"""D native material repair. Loops draw construction joints, never noise.
All texture accents are explicit final-resolution paths. No image resampling.
"""
from pathlib import Path
from PIL import Image, ImageDraw
from draw_proofs import BASE, REVIEW, S, P, c
from redraw_critic21 import canvas, poly, line, box, polygons, col
from draw_style_samples import SWATCHES
START=REVIEW/'D-start'
FIXED=['keep','temple','crypt','cave_rock','cave_ice','cave_crystal','cave_lava','dungeon_sewer']

def floor(n):
    pairs={'keep':('limestone:3','iron:3','limestone:2'), 'temple':('sandstone:3','sandstone:2','sandstone:2'),
      'crypt':('dark-masonry:5','dark-masonry:4','dark-masonry:4'),
      'cave_rock':('grey-brown-rock:3','mud:4','mud:5'), 'cave_ice':('blue-ice:3','frost:2','snowdrift:3'),
      'cave_crystal':('dark-rock:4','violet-crystal:3','dark-rock:5'),
      'cave_lava':('basalt:5','ash:3','embers:3'), 'dungeon_sewer':('sewer-water:4','sewer-water:3','sewer-water:3')}
    base,wear,joint=pairs[n];im=canvas((288,288),base)
    if n in ('keep','temple','crypt','dungeon_sewer'):
        # 48 px flag construction; seam geometry has no stochastic variation.
        for x in range(0,288,48):box(im,joint,(x,0,x,287))
        for y in range(0,288,48):box(im,joint,(0,y,287,y))
        # Worn lips remain connected to joints. These shelves each occur once.
        for path in ['1,1 38,1 38,2 25,2 25,3 12,3 12,5 5,5 5,18 3,18 3,32 1,32',
          '49,1 68,1 68,3 59,3 59,5 52,5 52,12 49,12',
          '97,1 139,1 139,3 120,3 120,4 101,4 101,21 99,21 99,36 97,36',
          '145,49 185,49 185,51 175,51 175,53 157,53 157,55 149,55 149,73 145,73',
          '1,97 19,97 19,100 9,100 9,105 5,105 5,128 1,128',
          '193,1 225,1 225,3 209,3 209,5 197,5 197,19 193,19',
          '97,193 128,193 128,195 112,195 112,199 101,199 101,218 97,218',
          '241,145 278,145 278,148 257,148 257,150 246,150 246,161 241,161',
          '49,241 91,241 91,244 79,244 79,246 55,246 55,267 52,267 52,280 49,280',
          '193,241 209,241 209,244 200,244 200,252 196,252 196,268 193,268']:
            poly(im,wear,path)
        # Fractures branch from a seam or terminate in a chipped flag corner.
        for path in ['48,21 56,21 56,25 64,25 64,29 70,29 70,35 78,35',
          '144,81 134,81 134,77 127,77 127,72 122,72 122,67',
          '213,96 213,105 208,105 208,112 204,112 204,119 198,119',
          '18,192 18,184 24,184 24,178 31,178 31,172 39,172',
          '240,228 231,228 231,222 224,222 224,217 218,217',
          '144,260 153,260 153,264 162,264 162,269 171,269']:
            line(im,wear,path,2)
        # Long wear across a walked route: broad, quiet scuffs, not confetti.
        polygons(im,wear,['64,115 77,115 77,117 89,117 89,120 82,120 82,122 68,122 68,120 59,120 59,117 64,117',
          '150,172 171,172 171,174 181,174 181,177 167,177 167,179 148,179 148,176 141,176 141,174 150,174',
          '252,63 266,63 266,66 277,66 277,69 259,69 259,67 248,67 248,65 252,65'])
        if n=='dungeon_sewer':
            # An actual water channel between masonry banks; low-value reflections.
            box(im,'sewer-water:3',(52,0,84,287))
            box(im,'sewer-water:3',(49,0,51,287));box(im,'sewer-water:3',(85,0,87,287))
            for path in ['55,12 68,12 68,14 77,14','62,38 79,38 79,40 72,40',
              '56,74 65,74 65,77 76,77','63,109 81,109 81,112 71,112',
              '54,151 68,151 68,154 79,154','60,190 76,190 76,192 81,192',
              '55,230 70,230 70,232 78,232','61,271 80,271 80,274 73,274']:
                line(im,'sewer-water:4',path,2)
    elif n=='cave_ice':
        # Large ice plates with deep-running fractures; snow is confined to shelves.
        polygons(im,wear,['0,31 38,31 38,35 65,35 65,41 94,41 94,49 126,49 126,54 155,54 155,59 192,59 192,65 226,65 226,72 287,72 287,76 225,76 225,69 190,69 190,63 154,63 154,58 125,58 125,53 92,53 92,45 64,45 64,39 36,39 36,35 0,35',
          '89,0 89,18 83,18 83,35 76,35 76,54 69,54 69,80 64,80 64,110 58,110 58,140 53,140 53,164 47,164 47,187 42,187 42,215 36,215 36,243 30,243 30,287 34,287 34,245 40,245 40,217 46,217 46,189 51,189 51,166 57,166 57,142 62,142 62,113 68,113 68,83 73,83 73,57 80,57 80,38 87,38 87,21 93,21 93,0'])
        for path in ['115,154 147,154 147,149 174,149 174,145 204,145 204,140 235,140 235,134 267,134 267,130 287,130',
          '161,287 161,265 168,265 168,243 175,243 175,223 181,223 181,202 188,202 188,180 197,180 197,161 204,161 204,145']:
            line(im,wear,path,3)
        polygons(im,joint,['0,8 32,8 32,12 53,12 53,16 66,16 66,20 51,20 51,18 29,18 29,14 0,14',
          '147,91 174,91 174,94 195,94 195,98 219,98 219,102 201,102 201,100 172,100 172,96 147,96',
          '78,235 107,235 107,232 130,232 130,228 143,228 143,233 128,233 128,237 108,237 108,240 78,240'])
    else:
        # Packed ground / exposed bed: broad compacted banks beside a worn path.
        bank = {'cave_rock':'mud:4','cave_crystal':'violet-crystal:3','cave_lava':'ash:3'}[n]
        polygons(im,bank,[
          '0,9 23,9 23,12 48,12 48,17 72,17 72,22 101,22 101,28 122,28 122,43 111,43 111,51 91,51 91,57 60,57 60,53 33,53 33,45 12,45 12,37 0,37',
          '171,0 187,0 187,12 196,12 196,27 209,27 209,40 222,40 222,55 234,55 234,68 244,68 244,83 250,83 250,98 226,98 226,90 216,90 216,74 202,74 202,58 190,58 190,42 181,42 181,23 171,23',
          '0,117 31,117 31,113 60,113 60,107 82,107 82,100 100,100 100,96 119,96 119,113 104,113 104,123 84,123 84,132 57,132 57,139 25,139 25,143 0,143',
          '115,149 134,149 134,154 153,154 153,161 173,161 173,165 197,165 197,170 223,170 223,175 252,175 252,179 287,179 287,198 255,198 255,201 227,201 227,196 197,196 197,192 169,192 169,185 148,185 148,178 129,178 129,165 115,165',
          '0,254 21,254 21,249 42,249 42,241 62,241 62,235 84,235 84,230 108,230 108,245 93,245 93,255 72,255 72,263 50,263 50,271 24,271 24,277 0,277'])
        polygons(im,wear,['0,9 23,9 23,12 48,12 48,17 72,17 72,22 101,22 101,28 122,28 122,34 114,34 114,31 96,31 96,27 68,27 68,23 45,23 45,18 21,18 21,14 0,14',
          '171,0 187,0 187,12 196,12 196,27 209,27 209,40 222,40 222,55 234,55 234,68 244,68 244,83 250,83 250,98 245,98 245,85 238,85 238,73 228,73 228,60 215,60 215,47 202,47 202,33 190,33 190,17 178,17 178,8 171,8',
          '0,117 31,117 31,113 60,113 60,107 82,107 82,100 100,100 100,96 119,96 119,100 103,100 103,105 85,105 85,112 63,112 63,118 33,118 33,122 0,122',
          '115,149 134,149 134,154 153,154 153,161 173,161 173,165 197,165 197,170 223,170 223,175 252,175 252,179 287,179 287,185 250,185 250,180 220,180 220,175 195,175 195,171 170,171 170,167 150,167 150,160 130,160 130,155 115,155',
          '0,254 21,254 21,249 42,249 42,241 62,241 62,235 84,235 84,230 108,230 108,233 87,233 87,240 65,240 65,246 45,246 45,254 24,254 24,259 0,259'])
        polygons(im,joint,['17,52 36,52 36,55 53,55 53,59 72,59 72,62 93,62 93,66 78,66 78,64 51,64 51,61 32,61 32,58 17,58',
          '154,79 172,79 172,82 189,82 189,86 205,86 205,90 192,90 192,88 170,88 170,85 154,85',
          '39,169 52,169 52,172 70,172 70,177 86,177 86,181 103,181 103,185 87,185 87,182 67,182 67,178 50,178 50,174 39,174',
          '159,237 178,237 178,233 197,233 197,229 213,229 213,225 237,225 237,229 216,229 216,234 199,234 199,239 180,239 180,243 159,243'])
        if n=='cave_lava':
            # Ember-filled cracks stay within the floor contrast budget.
            paths=['0,30 22,30 22,25 40,25 40,19 57,19 57,13 76,13 76,6 94,6 94,0',
             '57,69 57,87 63,87 63,103 69,103 69,118 77,118 77,135',
             '177,288 177,267 183,267 183,246 192,246 192,229 203,229 203,211 218,211 218,197 231,197 231,184 249,184 249,173 266,173 266,164 288,164']
            for path in paths:line(im,'embers:3',path,7);line(im,'embers:4',path,3)
    if n in ('cave_rock','cave_crystal'):
        stone='grey-brown-rock:4' if n=='cave_rock' else 'dark-rock:5'
        shade='mud:4' if n=='cave_rock' else 'dark-rock:4'
        # Two exposed shelves emerge from the compacted bank in the proof row.
        polygons(im,stone,[
          '8,30 16,30 16,27 34,27 34,29 43,29 43,33 48,33 48,38 41,38 41,41 24,41 24,39 13,39 13,36 8,36',
          '72,9 82,9 82,6 96,6 96,9 105,9 105,14 110,14 110,19 102,19 102,22 85,22 85,20 76,20 76,16 72,16'])
        line(im,shade,'12,35 22,35 22,36 32,36 32,34 40,34',2)
        line(im,shade,'79,13 89,13 89,15 101,15',2)
        line(im,wear,'47,4 47,11 51,11 51,17 58,17 58,23 64,23',2)
        line(im,wear,'122,18 122,25 117,25 117,31 111,31 111,37 104,37',2)
    if n in ('keep','temple','crypt'):
        # Connected wear along slab lips and two unequal mineral shelves.
        for a in ['5,44 15,44 15,42 23,42 23,43 35,43',
          '52,43 65,43 65,41 74,41 74,42 88,42',
          '101,8 112,8 112,10 125,10 125,9 137,9',
          '7,16 18,16 18,18 27,18 27,20 36,20',
          '110,28 117,28 117,30 130,30 130,32 137,32']:
            line(im,wear,a,2)
        if n=='keep':
            line(im,'iron:3','3,7 3,28 6,28 6,36',2)
            line(im,'iron:3','98,13 98,40 104,40',2)
    if n in ('keep','temple','crypt'):
        # Small chisel/wear shelves with 3+ connected pixels, unique per pattern.
        for a in ['8,28 13,28 13,30 20,30','69,8 82,8 82,10 87,10',
          '110,35 119,35 119,37 127,37','160,19 172,19 172,20 182,20',
          '211,35 221,35 221,32 229,32','257,24 267,24 267,26 278,26',
          '11,76 20,76 20,74 29,74','65,62 74,62 74,65 79,65',
          '160,124 166,124 166,127 177,127','256,120 264,120 264,117 273,117',
          '61,153 72,153 72,156 86,156','209,157 216,157 216,160 226,160',
          '12,216 22,216 22,219 29,219','161,212 174,212 174,210 182,210',
          '208,269 218,269 218,272 226,272','251,251 260,251 260,253 275,253']:
            line(im,wear,a,1)
    return im

def capstones(n,wall):
    ramps={'keep':('iron:2','limestone:1','limestone:2'), 'temple':('marble:1','sandstone:1','sandstone:2'),
      'crypt':('dark-masonry:3','dark-masonry:2','dark-masonry:4'), 'dungeon_sewer':('brick:2','brick:1','brick:3')}
    base,joint,lip=ramps[n];box(wall,base,(0,8,143,47))
    for x in [0,48,96]:
        box(wall,joint,(x,8,x+1,47));box(wall,lip,(x+3,43,x+45,44))
        line(wall,lip,f'{x+4},10 {x+32},10 {x+32},11 {x+40},11',1)
    line(wall,joint,'0,27 143,27',1)
    # Unequal corner damage, all attached to the laid joints.
    poly(wall,joint,'47,8 52,8 52,11 55,11 55,14 51,14 51,18 48,18')
    line(wall,lip,'53,16 57,16 57,19 62,19',1)
    line(wall,joint,'96,33 103,33 103,36 109,36 109,39',2)
    return wall

def crucible():
    im=Image.new('RGBA',(48,48));d=ImageDraw.Draw(im)
    poly(im,'ash:1','4,19 9,13 16,10 33,10 40,14 44,20 44,31 40,38 34,42 14,42 7,38 3,31 3,22')
    poly(im,'ash:4','5,23 42,23 42,31 38,36 33,39 15,39 9,35 5,30')
    box(im,'ash:2',(9,29,38,31));box(im,'ash:2',(14,34,33,36))
    poly(im,'ash:5','5,20 10,15 17,12 32,12 39,16 42,20 39,25 33,28 15,28 8,25')
    poly(im,'basalt:1','10,20 15,16 32,16 38,20 34,24 16,24')
    poly(im,'embers:3','13,20 18,17 30,17 35,20 31,23 18,23')
    line(im,'embers:5','18,19 26,19 26,20 31,20',2)
    line(im,'ash:2','13,29 13,34 17,34 17,39',1);line(im,'ash:2','33,28 33,33 36,33 36,37',1)
    line(im,'ash:5','7,28 7,31 11,35',1)
    return im

def run():
    guide=Image.open(START/'style-guide.png' if (START/'style-guide.png').exists() else BASE/'canon/style-guide.png').convert('RGB')
    for n in S:
        wall_source=START/f'C-layer-{n}-wall.png'
        wall=Image.open(wall_source if wall_source.exists() else BASE/f'canon/surfaces/{n}-wall.png').convert('RGBA')
        prop_source=START/f'C-layer-{n}-prop.png'
        prop=Image.open(prop_source if prop_source.exists() else BASE/f'canon/props/{n}-study.png').convert('RGBA')
        floor_source=START/f'C-layer-{n}-floor.png'
        if floor_source.exists():oldfloor=Image.open(floor_source).convert('RGBA')
        else:
            oldfloor=Image.new('RGBA',(144,144));oldfloor.paste(Image.open(BASE/f'canon/surfaces/{n}-floor.png').crop((0,0,144,48)),(0,96))
        if n in FIXED:f=floor(n)
        else:
            f=Image.new('RGBA',(288,288));part=oldfloor.crop((0,96,144,144))
            for y in range(0,288,48):
                for x in (0,144):f.paste(part,(x,y))
        if n=='station_lab':
            f=canvas((288,288),'clean-tile:3')
            for x in range(0,288,48):
                box(f,'tank-glass:3',(x,0,x,287))
                for y in range(0,288,48):
                    box(f,'tank-glass:3',(x,y,x+47,y))
                    line(f,'clean-tile:2',f'{x+4},{y+18} {x+4},{y+4} {x+19},{y+4}',1)
        if n in ['keep','temple','crypt','dungeon_sewer']:wall=capstones(n,wall)
        if n=='cave_lava':prop=crucible()
        # Each is a reusable native surface or prop, not a proof/scratch render.
        f.save(BASE/f'canon/surfaces/{n}-floor.png');wall.save(BASE/f'canon/surfaces/{n}-wall.png')
        prop.save(BASE/f'canon/props/{n}-study.png')
        if n in FIXED:
            # Proofs and studies show the identical first three floor cells.
            backing=Image.new('RGBA',(144,144),f.getpixel((20,20)));backing.paste(f.crop((0,0,144,48)),(0,96))
            proof=backing.copy();proof.paste(wall);proof.alpha_composite(prop,(86,96))
            proof.save(BASE/f'proof/{n}.png');proof.convert('L').convert('RGBA').save(BASE/f'proof/{n}-grey.png')
            for tag,pic in [('floor',backing),('wall',wall),('prop',prop)]:pic.save(REVIEW/f'C-layer-{n}-{tag}.png')
            sw=Image.new('RGBA',(48,48));sw.paste(wall.crop((0,8,48,20)),(0,0));sw.paste(wall.crop((0,56,48,68)),(0,12))
            fx=40 if n=='dungeon_sewer' else 0
            sw.paste(f.crop((fx,0,fx+48,24)),(0,24));sw.save(BASE/f'canon/swatches/{n}.png')
            i=list(SWATCHES).index(n);guide.paste(sw,(48+i%7*240,800+i//7*94))
    guide.save(BASE/'canon/style-guide.png')
if __name__=='__main__':run()
