#!/usr/bin/env python3
"""Compose native city17 drawings, extended from the city15 compositor.

    python -B art-drop/out/city17/compose.py
    python -B art-drop/out/city17/compose.py --no-sheets

Creates the 16x12 L-block, irregular market, both tall/low joins, 1x/3x
comparisons and greyscale squint renders. Per-export proofs are delegated to
review/r17-A-build.py. No native asset is resampled during composition.
Every building is bottom-left anchored. Facade origin spacing remains 48px.
Spec storeys are bottom-to-top. Parts are drawn ground, storeys, roof, overlays;
standing objects are sorted by base row. End strips reveal only 3 outer pixels.
R15 roofs and current fantasy context are explicit later-part placeholders.
"""

import argparse
import hashlib
import json
import random
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, PngImagePlugin

ASSETS = Path(__file__).resolve().parent
ART = ASSETS.parent.parent
REVIEW = ART / "review"
GROUNDS = ("shop", "door", "arch", "work")
STOREYS = ("timber", "plaster", "stone", "jetty", "oriel")
ROOFS = ("gable", "ridge", "hip", "flat")
NEAREST = Image.Resampling.NEAREST
END_REVEAL = 3


@lru_cache(maxsize=None)
def asset(name):
    return Image.open(asset_path(name)).convert("RGBA")


def asset_path(name):
    path = ASSETS / (name + '.png')
    if path.exists(): return path
    if name.startswith(('roof-', 'chimney-', 'dormer-', 'flowerbox-')):
        return ASSETS.parent / 'city15' / (name + '.png')
    raise FileNotFoundError(name)


def save(im, name, **metadata):
    info = PngImagePlugin.PngInfo()
    for key, value in metadata.items():
        info.add_text(key, json.dumps(value, sort_keys=True))
    im.save(REVIEW / ("r17-A-" + name + ".png"), pnginfo=info)


def scales(im, name, factors=(1, 4), **metadata):
    for scale in factors:
        proof = im if scale == 1 else im.resize((im.width * scale, im.height * scale), NEAREST)
        save(proof, f"{name}-{scale}x", Scale=scale, **metadata)


def grass(size):
    tile = Image.open(ASSETS.parent / "grass-base.png").convert("RGBA")
    im = Image.new("RGBA", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            im.paste(tile, (x, y))
    return im


def ground_name(spec):
    kind, width, variant = spec['ground'], spec['width'], spec.get('variant', 0)
    colour = spec.get('colour', 0)
    if kind == 'inn': return f'inn-front-w{width}-c{colour}'
    v = f'-v{variant}' if variant else ''
    return f'ground-{kind}{v}-w{width}-c{colour}'


def sign_mount(spec, name):
    # Inspected blank left bay of bakery w3. The entire sign stays at x4..35;
    # goods begin at x45 and entrance at x112. Never mount over a door/window.
    if spec['width'] == 3 and spec['ground'] == 'shop' and not spec.get('variant', 0):
        return dict(file=name, x=4, y=len(spec['storeys'])*48+3)
    if spec['width'] == 3 and spec['ground'] == 'shop' and spec.get('variant') == 1:
        return dict(file=name, x=112, y=len(spec['storeys'])*48+3)
    return None


def build(spec):
    """Ground, upper floors bottom-to-top, roof, overlays; no asset resampling."""
    width, upper = spec['width']*48, spec['storeys']
    if spec['width'] not in (1,2,3) or not 0 <= len(upper) <= 4: raise ValueError(spec)
    roof_name = f"roof-{spec['roof']}-w{spec['width']}-c{spec.get('roof_colour',0)}"
    roof = asset(roof_name); top = 40 + roof.height
    im = Image.new('RGBA',(width,top+48*(1+len(upper)))); parts=[]
    def put(name,x,y,crop=None,layer='facade'):
        piece=asset(name)
        if crop: piece=piece.crop(crop)
        if not (0<=x and 0<=y and x+piece.width<=im.width and y+piece.height<=im.height):
            raise ValueError(('outside lot', name,x,y))
        im.alpha_composite(piece,(x,y))
        parts.append(dict(file=str(asset_path(name).relative_to(ART)),x=x,y=y,crop=crop,layer=layer))
    panels=[ground_name(spec)]+[f"storey-{s['kind']}-w{spec['width']}-c{s['colour']}" for s in upper]
    for floor,name in enumerate(panels):
        y=im.height-48*(floor+1);put(name,0,y)
        if spec.get('corner'):
            piece='corner-ground' if floor==0 else 'corner-storey'
            put(piece+f"-c{spec.get('colour',0)}",width-48,y,layer='corner')
        for side in spec.get('ends',[]):
            if side not in ('left','right'):raise ValueError(side)
            # Use just the edge reveal. Interior silhouette pixels are intact.
            x=0 if side=='left' else width-END_REVEAL
            sx=0 if side=='left' else 8-END_REVEAL
            put(f"wall-end-{side}-c{spec.get('colour',0)}",x,y+1,(sx,1,sx+END_REVEAL,47),'wall-end')
    put(roof_name,0,40,layer='roof / Part B placeholder')
    for o in spec.get('overlays',[]):put(o['file'],o['x'],top+o['y'],layer='overlay')
    return im,parts


def make_spec(width=2,floors=2,ground='shop',variant=0,colour=0,roof='hip',kinds=None,corner=False):
    kinds=kinds or ['timber','plaster','jetty','oriel']
    return dict(width=width,ground=ground,variant=variant,colour=colour,
                storeys=[dict(kind=kinds[i%len(kinds)],colour=colour) for i in range(floors-1)],
                roof=roof,roof_colour=0,ends=[],overlays=[],corner=corner)


def random_specs(seed,count=12,overlays=True):
    rng=random.Random(seed); result=[]
    for i in range(count):
        kinds=rng.sample(STOREYS,5)
        s=make_spec(rng.randint(1,2),rng.randint(1,5),GROUNDS[i%4],i%3,i%2,rng.choice(ROOFS[:3]),kinds)
        result.append(s)
    return result


def street(specs):
    buildings=[build(s) for s in specs];w=sum(a.width for a,p in buildings);h=max(a.height for a,p in buildings)
    im=grass((w+32,h+40));x=16;recipe=[]
    for s,(a,parts) in zip(specs,buildings):
        y=h+16-a.height;im.alpha_composite(a,(x,y));recipe.append(dict(spec=s,x=x,y=y,parts=parts));x+=a.width
    return im,recipe


def repeat(tile,size):
    im=Image.new('RGBA',size)
    for y in range(0,size[1],tile.height):
        for x in range(0,size[0],tile.width):im.alpha_composite(tile,(x,y))
    return im


def context(key):return Image.open(REVIEW/f'r17-A-context-{key}.png').convert('RGBA')


def scene(layout):
    """Only crop/tile/composite already drawn pieces. Base coordinates in pixels."""
    size=tuple(layout['size']);im=repeat(context('town_ground'),size)
    # Grid masks select crops of a painted terrain texture; no cobbles are drawn.
    for key,rects in layout['terrain'].items():
        tiled=repeat(context(key),size)
        for x,y,w,h in rects:
            box=(x*48,y*48,(x+w)*48,(y+h)*48)
            im.alpha_composite(tiled.crop(box),box[:2])
    objects=[];records=[]
    for b in layout.get('buildings',[]):
        a,parts=build(b['spec']);x,y=b['x'],b['base']-a.height
        records.append(dict(**b,y=y,parts=parts));objects.append((b['base'],0,x,a,y))
    for o in layout.get('objects',[]):
        a=Image.open(ART/o['file']).convert('RGBA');y=o['base']-a.height
        objects.append((o['base'],1,o['x'],a,y));records.append(dict(**o,y=y))
    for base,priority,x,a,y in sorted(objects,key=lambda a:(a[0],a[1],a[2])):im.alpha_composite(a,(x,y))
    return im,records


def critic_layouts():
    # 16x12. Horizontal streets at rows4-5 and10-11, central NS lane,
    # west T spur at row7, short dead end at col12. Building feet jog by1cell.
    l=dict(size=[768,576],terrain={'street':[[0,4,8,2],[8,4,8,1],[0,10,8,1],[8,9,8,2],
        [7,4,1,7],[0,7,8,1],[12,5,1,3]],'square':[[8,5,2,2]]},buildings=[],objects=[])
    def add(layout,ident,x,base,**kw):layout['buildings'].append(dict(id=ident,x=x,base=base,spec=make_spec(**kw)))
    for i,(x,w,f) in enumerate([(0,2,2),(96,1,2),(144,2,2),(240,2,2),(384,2,2),(480,2,2),(576,1,2),(624,3,2)]):
        add(l,'north-'+str(i),x,192,width=w,floors=f,ground=GROUNDS[i%4],variant=i%3,colour=i%2,roof=['hip','ridge','gable'][i%3],corner=i==3,kinds=list(STOREYS[i%5:]+STOREYS[:i%5]))
    # L-shaped south-west block and narrow east block; rear faces await Part C.
    for i,(x,base,w,f) in enumerate([(0,336,2,1),(96,336,1,1),(144,336,2,1),(240,336,2,1),
                                   (0,480,2,2),(96,480,2,1),(192,480,3,2),
                                   (432,432,2,2),(624,432,3,2),(528,384,1,1)]):
        add(l,'L-wing-'+str(i),x,base,width=w,floors=f,ground=GROUNDS[(i+1)%4],variant=(i+1)%3,colour=i%2,corner=i in(3,8),roof=['ridge','hip','gable'][i%3],kinds=list(STOREYS[i%5:]+STOREYS[:i%5]))
    l['features']=dict(L_block='west lots rows6-9',T_junction=[7,7],dead_end=[12,8],north_south_lane=[7,4,1,7],bent_street='east lower street rises one row',wedge='staggered eastern block')
    for ident,variant,trade in [('north-7',0,'baker'),('L-wing-6',1,'apothecary')]:
        s=next(b['spec'] for b in l['buildings'] if b['id']==ident)
        s.update(ground='shop',variant=variant);s['overlays']=[sign_mount(s,'sign-'+trade)]
    l['buildings'][1]['spec']['ground']='inn'
    # 18x16, L-shaped 8x6 open square. Native current halls/well/stalls are
    # declared proxies; no missing cathedral, cross or stall art is fabricated.
    m=dict(size=[864,768],terrain={'street':[[8,0,2,16],[0,12,18,2],[0,7,5,1]],
             'square':[[4,6,10,5],[6,11,8,2],[4,5,5,1]]},buildings=[],objects=[])
    for i,(x,base,w,f) in enumerate([(0,288,2,2),(96,288,2,2),(672,288,2,2),(768,288,2,1),
        (0,480,2,2),(96,480,2,2),(672,480,2,2),(768,528,2,1),
        (0,720,2,2),(96,720,2,1),(624,720,3,3),(768,720,2,1)]):
        add(m,'square-lot-'+str(i),x,base,width=w,floors=f,ground=GROUNDS[i%4],variant=i%3,colour=i%2,roof=['hip','gable','ridge'][i%3],kinds=list(STOREYS[i%5:]+STOREYS[:i%5]))
    for name,file,x,base in [('cathedral-placeholder','fantasy-hall-1.png',240,288),
                           ('guildhall-placeholder','fantasy-hall-0.png',432,768),
                           ('market-cross-placeholder','fantasy-well-0.png',432,504)]:
        m['objects'].append(dict(id=name,file='reference/r17/'+file,x=x,base=base,deferred='Part D'))
    for i,(x,base) in enumerate([(240,384),(300,384),(360,384),(540,528),(600,528),(660,528)]):
        m['objects'].append(dict(id='stall-'+str(i),file=f'reference/r17/fantasy-stall-{i%2}.png',x=x,base=base,deferred='Part D: six positions, two current drawings'))
    m['features']=dict(square='L footprint: 10x5 + 8x2 + 5x1 cells',central_aisle=[8,6,2,7],churchyard=[4,5,5,1],landmarks='current hall proxies; final sizes/skyline deferred D')
    t=dict(size=[768,432],terrain={'street':[[0,8,16,1]]},buildings=[],objects=[])
    for i,(x,f,w) in enumerate([(48,5,2),(144,1,1),(384,1,1),(432,5,2)]):
        add(t,'height-'+str(i),x,384,width=w,floors=f,ground='door' if f==1 else 'shop',variant=i%3,colour=i%2,roof='hip',kinds=['stone','plaster','jetty','timber'])
    t['features']=dict(joins='5|1 and 1|5; no interlot gap',firewall='NOT DRAWN / Part B',shadow='NOT DRAWN / Part B')
    return {'L-block':l,'market':m,'height-test':t}


PLACEHOLDERS=['Round 15 roofs: Part B', 'Firewall and cast street shadows absent: Part B',
 'Rear/side walls, yards and circulation textures: Part C',
 'Current fantasy halls/well/stalls stand in for Part D landmarks/market',
 'Gate, market cross and final civic skyline cannot pass yet']


def compare(im,name):
    refs=[('ROUND 15 / native 1x',Image.open(ART/'reference/r17/round15-street.png').convert('RGBA')),
          ('CURRENT TOWN / literal 1x screenshot (24px cells)',Image.open(ART/'reference/r17/current-town.png').convert('RGBA'))]
    for scale in (1,3):
        a=im.resize((im.width*scale,im.height*scale),NEAREST)
        w=a.width+max(r.width for _,r in refs)+48;h=max(a.height+130,sum(r.height+40 for _,r in refs)+40)
        out=Image.new('RGBA',(w,h),(40,43,40,255));d=ImageDraw.Draw(out)
        d.text((12,10),f'ROUND 17 PART A / {name} / {scale}x nearest neighbour',fill='white');out.alpha_composite(a,(12,36))
        for i,line in enumerate(PLACEHOLDERS):d.text((12,a.height+45+i*15),line,fill=(228,214,183))
        y=12
        for title,r in refs:d.text((a.width+36,y),title,fill='white');out.alpha_composite(r,(a.width+36,y+24));y+=r.height+40
        save(out,f'critic-{name}-comparison-{scale}x',SceneScale=scale,ReferenceScale=1,Placeholders=PLACEHOLDERS)


def main():
    parser=argparse.ArgumentParser(description='Native Part A compositor; no drawing operations.')
    parser.add_argument('--no-sheets',action='store_true');parser.add_argument('--seed',type=int,default=731)
    args=parser.parse_args()
    layouts=critic_layouts()
    for name,layout in layouts.items():
        im,records=scene(layout);scales(im,'critic-'+name,(1,3),Layout=layout,Placements=records,Placeholders=PLACEHOLDERS)
        grey=im.convert('L').convert('RGBA');save(grey,'critic-'+name+'-squint-1x',Layout=layout,Placeholders=PLACEHOLDERS)
        compare(im,name)
    (REVIEW/'r17-A-scenes.json').write_text(json.dumps(layouts,indent=2)+'\n')
    specs=random_specs(args.seed);im,records=street(specs);scales(im,'street',(1,3),Specs=specs,Placements=records,Placeholders=PLACEHOLDERS)
    if not args.no_sheets:
        import importlib.util
        sp=importlib.util.spec_from_file_location('reviews',REVIEW/'r17-A-build.py');mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod);mod.reviews()
    print('Saved native critic scenes, comparisons and squint renders.')


if __name__=='__main__':main()


