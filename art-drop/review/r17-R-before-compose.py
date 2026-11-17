#!/usr/bin/env python3
"""Compose native city17 drawings, extended from the city15 compositor.

    python -B art-drop/out/city17/compose.py
    python -B art-drop/out/city17/compose.py --no-sheets

Creates the 16x12 L-block, irregular market, both tall/low joins, 1x/3x
comparisons and greyscale squint renders. Per-export proofs are delegated to
review/r17-C-review.py. No native asset is resampled during composition.
Every building is bottom-left anchored. Facade origin spacing remains 48px.
Spec storeys are bottom-to-top. Parts are drawn ground, storeys, roof, overlays;
standing objects are sorted by base row. End strips reveal only 3 outer pixels.
Corners use the explicit complete-panel assemblies below, never a cut through
a wide drawing. Drawn course strips preserve rows 0/47 across the whole lot.
Part B roofs, joins, firewall and masked shadows are native city17 assets.
Part C adds rear rows, separately lit side returns, corner nodes, fenced
yards and quiet street surfaces. Part D adds native whole civic and market sprites.
Default output is scoped to r17-E review files; --part C/D replays historical parts.
"""

import argparse
import hashlib
import json
import random
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageChops, PngImagePlugin

ASSETS = Path(__file__).resolve().parent
ART = ASSETS.parent.parent
REVIEW = ART / "review"
GROUNDS = ("shop", "door", "arch", "work")
STOREYS = ("timber", "plaster", "stone", "jetty", "oriel")
ROOFS = ("gable", "ridge", "hip", "flat")
NEAREST = Image.Resampling.NEAREST
END_REVEAL = 3

# Visually reviewed complete drawings beside the 48px right corner. Keys name
# the requested lot facade; values name the intact narrower frontage. None is
# a one-cell corner-only floor. Colours use the same c0..c2 ramps on both pieces.
# Add a combination only after inspecting its complete front and corner at 1x/4x.
CORNER_ASSEMBLIES = {
    'ground-work-w2': 'ground-work-w1',
    'ground-shop-v1-w2': 'ground-shop-v1-w1',
    'ground-door-w3': 'ground-door-w2',
    'storey-jetty-w2': 'storey-jetty-w1',
    'storey-jetty-w3': 'storey-jetty-w2',
    'ground-door-w1': None,
    'ground-door-v1-w1': None,
    'ground-door-v2-w1': None,
    'storey-timber-w1': None,
    'storey-plaster-w1': None,
}


def corner_assembly(name, width):
    base, colour = name.rsplit('-c', 1)
    if base not in CORNER_ASSEMBLIES:
        raise ValueError(f'unsupported corner combination: {name}')
    front = CORNER_ASSEMBLIES[base]
    kind = 'storey' if base.startswith('storey-') else 'ground'
    pieces = [] if front is None else [(f'{front}-c{colour}', 0, 'facade')]
    pieces.append((f'corner-{kind}-c{colour}', width - 48, 'corner'))
    # Coverage must be exact, with no overlap, truncation or uncovered columns.
    edge = 0
    for piece, x, layer in pieces:
        if x != edge or asset(piece).height != 48:
            raise ValueError(f'unsupported corner dimensions: {name}')
        edge += asset(piece).width
    if edge != width:
        raise ValueError(f'unsupported corner dimensions: {name}')
    return pieces


@lru_cache(maxsize=None)
def asset(name):
    return Image.open(asset_path(name)).convert("RGBA")


def asset_path(name):
    path = ASSETS / (name + '.png')
    if path.exists(): return path
    if name.startswith('flowerbox-'):
        return ASSETS.parent / 'city15' / (name + '.png')
    raise FileNotFoundError(name)


def save(im, name, **metadata):
    info = PngImagePlugin.PngInfo()
    for key, value in metadata.items():
        info.add_text(key, json.dumps(value, sort_keys=True))
    im.save(REVIEW / ("r17-B-" + name + ".png"), pnginfo=info)


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


# Native source course ranges. Each starts just after an overlap seam and
# ends on the next same-phase seam; all include the cap's drawn outer verge.
CAP_COURSES={1:(41,[41,33,41]),2:(59,[59,27,59]),3:(42,[42,58,34])}


def wall_reveal(spec):
    """Reserve full bays where possible, otherwise use intact narrow returns."""
    return 4 if spec.get('district') else (48 if spec['width']>len(spec.get('firewalls',[])) else 4)


def build(spec, include_roof_overlays=True):
    """Ground, upper floors bottom-to-top, roof, overlays; no asset resampling."""
    width, upper = spec['width']*48, spec['storeys']
    if spec['width'] not in (1,2,3) or not 0 <= len(upper) <= 4: raise ValueError(spec)
    roof_name = spec.get('roof_file') or f"roof-{spec['roof']}-w{spec['width']}-c{spec.get('roof_colour',0)}"
    roof = asset(roof_name); top = spec.get('roof_depth',roof.height//48)*48
    if top<roof.height or top%48:raise ValueError('roof depth must be whole cells and fit cap')
    im = Image.new('RGBA',(width,top+48*(1+len(upper)))); parts=[]
    def put(name,x,y,crop=None,layer='facade'):
        piece=asset(name)
        if crop: piece=piece.crop(crop)
        if not (0<=x and 0<=y and x+piece.width<=im.width and y+piece.height<=im.height):
            raise ValueError(('outside lot', name,x,y))
        im.alpha_composite(piece,(x,y))
        parts.append(dict(file=str(asset_path(name).relative_to(ART)),x=x,y=y,crop=crop,layer=layer))
    frontage={}
    panels=[spec.get('ground_file') or ground_name(spec)]+[s.get('file') or f"storey-{s['kind']}-w{spec['width']}-c{s['colour']}" for s in upper]
    for floor,name in enumerate(panels):
        y=im.height-48*(floor+1)
        walls=[wall for wall in spec.get('firewalls',[]) if y<top+wall['height']]
        reveal=wall_reveal(spec)
        left=reveal if any(w['side']=='left' for w in walls) else 0
        right=width-(reveal if any(w['side']=='right' for w in walls) else 0)
        frontage[floor]=(left,right)
        if walls and reveal==48:
            # Wide lots reserve complete masonry bays beside intact facades.
            narrow=name.replace(f"-w{spec['width']}-",f"-w{spec['width']-len(walls)}-")
            put(narrow,left,y)
        elif walls:
            # Narrow lots retain the entire frontage. A four-pixel masonry
            # return occupies the blank outer posts, clear of windows/doors.
            put(name,0,y)
        elif spec.get('corner'):
            for piece,x,layer in corner_assembly(name,width):
                put(piece,x,y,layer=layer)
            # Composite only the original drawn contact strips, so internal
            # panel endpoints do not interrupt the full-lot stack contract.
            for row in (0,47):
                put(name,0,y+row,(0,row,width,row+1),'course')
        else:
            put(name,0,y)
        for side in spec.get('ends',[]):
            if side not in ('left','right'):raise ValueError(side)
            # Use just the edge reveal. Interior silhouette pixels are intact.
            x=0 if side=='left' else width-END_REVEAL
            sx=0 if side=='left' else 8-END_REVEAL
            put(f"wall-end-{side}-c{spec.get('colour',0)}",x,y+1,(sx,1,sx+END_REVEAL,47),'wall-end')
    for wall in spec.get('firewalls',[]):
        strip=asset('firewall-w0');side=wall['side'];height=wall['height']
        reveal=wall_reveal(spec)
        x=0 if side=='left' else width-reveal
        for dx in range(0,reveal,16):
            sw=min(16,reveal-dx)
            for y in range(top+4,top+height-4,40):
                n=min(40,top+height-4-y)
                put('firewall-w0',x+dx,y,(0,4,sw,4+n),'firewall body')
            put('firewall-w0',x+dx,top,(0,0,sw,4),'firewall coping')
            put('firewall-w0',x+dx,top+height-4,(0,44,sw,48),'firewall flashing')
    extra=top-roof.height
    if extra:
        if spec['roof']!='ridge':raise ValueError('depth extension requires the south-facing ridge slope')
        # Each approved cap has its own painted tile scale/value field.
        # Complete native two-course adapters carry that field through both
        # interfaces. Repeat six courses per extra cell, without stretching
        # tiles, rotating light, or inserting a generic texture band.
        split,donors=CAP_COURSES[spec['width']]
        put(roof_name,0,0,(0,0,width,split),'roof ridge')
        for i,y in enumerate(range(0,extra,16)):
            sy=donors[i%len(donors)]
            put(roof_name,0,split+y,(0,sy,width,sy+16),'roof fill adapter')
        put(roof_name,0,extra+split,(0,split,width,roof.height),'roof slope/eave')
    else:put(roof_name,0,0,layer='roof')
    if spec.get('shared_flat_left'):
        # Two flat roofs share ONE coping, owned by the western lot. Continue
        # the eastern terrace to it using native painted interior columns.
        put(roof_name,0,14,(7,14,14,roof.height-16),'shared terrace edge')
    for p in spec.get('roof_joins',[]):
        if p['y']+asset(p['file']).height>top:raise ValueError('roof join leaves roof receiver')
        put(p['file'],p['x'],p['y'],layer='roof join')
    # Shading is clipped to the receiving facade and never changes course rows.
    put(f"shadow-eave-w{spec['width']}-c0",0,top+1,layer='eave shade')
    for floor,s in enumerate(upper,1):
        if s['kind']=='jetty':
            y=im.height-floor*48+1
            # Intersect the casting jetty and actual receiving frontage.
            # Bare party-wall bays have neither a projecting jetty nor shade.
            x0=max(frontage[floor][0],frontage[floor-1][0])
            x1=min(frontage[floor][1],frontage[floor-1][1])
            put(f"shadow-jetty-w{spec['width']}-c0",x0,y,(x0,0,x1,6),'jetty shade')
    for o in spec.get('overlays',[]):put(o['file'],o['x'],top+o['y'],layer='overlay')
    for o in spec.get('roof_overlays',[]):
        p=asset(o['file'])
        if o['y']+p.height>top:raise ValueError('roof overlay leaves roof receiver')
        if o['file'] not in ('chimney-smoke','forge-smoke') and not any(o['x']>=x0 and o['y']>=y0 and o['x']+p.width<=x1 and o['y']+p.height<=y1
                   for x0,y0,x1,y1 in receiving_planes(spec)):
            raise ValueError(('roof accent crosses ridge, verge or parapet',o,spec['roof']))
        if include_roof_overlays:put(o['file'],o['x'],o['y'],layer='roof overlay')
    return im,parts


def receiving_planes(spec):
    """Inspected native rectangles wholly within each pitched receiving plane."""
    w=48*spec['width'];h=spec.get('roof_depth',3 if spec['roof']=='hip' else 2)*48
    if spec['roof']=='gable':return [(3,8,w//2-4,h-28),(w//2+4,8,w-3,h-28)]
    if spec['roof']=='hip':return [(3,26,w//2-4,h-40),(w//2+4,26,w-3,h-40),(w//4,h-44,3*w//4,h-4)]
    if spec['roof']=='flat':return [(7,14,w-7,h-16)]
    return [(3,28,w-3,h-7)]


def roof_mount(spec,name):
    a=asset(name)
    for x0,y0,x1,y1 in receiving_planes(spec):
        if x1-x0>=a.width and y1-y0>=a.height:
            return dict(file=name,x=x0+min(5,x1-x0-a.width),y=y0+min(12,y1-y0-a.height))
    raise ValueError(('no compatible receiving plane',name,spec['roof'],spec['width']))


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


def firewall_surface(size):
    """Repeat the drawn bare wall in both axes, with coping/flashing only once."""
    if min(size)<4:raise ValueError('firewall surface needs room for edge courses')
    strip=asset('firewall-w0');body=strip.crop((0,4,16,44))
    wall=repeat(body,size)
    wall.paste(repeat(strip.crop((0,0,16,4)),(size[0],4)),(0,0))
    wall.paste(repeat(strip.crop((0,44,16,48)),(size[0],4)),(0,size[1]-4))
    return wall


@lru_cache(maxsize=3)
def joined_l_paint(colour):
    """Continuous image-tool transition paint; native mode-reduced, never scaled.

    The complete drawing registers the west ridge at x48, wing ridge at y192,
    concave valley to (96,144), and terminal ridge at (288,192). Its hips end
    only at the outside corners. Keeping the receiving planes together avoids
    material cuts at x96/x288 and the false hip that previously ended mid-eave.
    The source includes one continuous eave with its two exposed verges once;
    no cap endpoint columns are repeated inside the roof.
    See review/r17-B-critic3-{generation,processing}.json for replay provenance.
    """
    if colour not in (0,1,2):
        raise ValueError('roof colour must be c0, c1 or c2')
    return Image.open(REVIEW/f'r17-B-critic3-L-paint-c{colour}.png').convert('RGBA')


def joined_l_roof(colour=0):
    """Fixed pilot L: 96x240 west arm and a 336x96 south wing, native pixels."""
    return joined_l_paint(colour).copy()


def neighbours(buildings):
    """Bare party walls belong to the taller lot, in either adjacency direction."""
    result=[]
    for b in buildings:
        b=json.loads(json.dumps(b));s=b['spec'];s['firewalls']=[]
        s['shared_flat_left']=False
        for other in buildings:
            if other['base']!=b['base']:continue
            if (s['roof']==other['spec']['roof']=='flat' and len(s['storeys'])==len(other['spec']['storeys'])
                    and other['x']+other['spec']['width']*48==b['x']):s['shared_flat_left']=True
            delta=len(s['storeys'])-len(other['spec']['storeys'])
            if delta<=0:continue
            if other['x']==b['x']+s['width']*48:side='right'
            elif other['x']+other['spec']['width']*48==b['x']:side='left'
            else:continue
            s['firewalls'].append(dict(side=side,height=delta*48))
        result.append(b)
    return result


def ground_shadows(im,layout,buildings):
    """Painted masks only, union by max alpha; clip to explicit ground receivers."""
    union=Image.new('RGBA',im.size);records=[]
    for b in buildings:
        s=b['spec'];w=s['width']*48;floors=1+len(s['storeys']);reach=min(32,6*floors)
        # The south approach is part of the lot; shadows leave its clear width intact.
        shade=asset(f"shadow-street-w{s['width']}-c0").crop((0,0,w,reach))
        layer=Image.new('RGBA',im.size);layer.paste(shade,(b['x'],b['base']))
        receiver=[b['x'],b['base'],w,48]
        records.append(dict(id=b['id'],side='south',reach=reach,receiver=receiver))
        # An end lot may explicitly include a narrow east receiving strip, never
        # another building's plot. No such strip is allocated between neighbours.
        if b.get('east_receiver'):
            x,y,rw,rh=b['east_receiver']
            rw=min(rw,reach)
            # The terminal step occurs ONCE. Only the full-depth painted body
            # repeats down a straight east receiver, so no periodic comb appears.
            east=asset('shadow-street-w3-c0').crop((12,0,132,32)).transpose(Image.Transpose.ROTATE_90)
            patch=repeat(east,(rw,rh));layer.paste(patch,(x,y))
            records.append(dict(id=b['id'],side='east',reach=rw,receiver=b['east_receiver']))
        union=ImageChops.lighter(union,layer)
    for obj in layout.get('objects',[]):
        # Current-art civic/market proxies receive the same drawn shadow strip.
        a=Image.open(ART/obj['file']).convert('RGBA');bounds=a.getbbox()
        if not bounds:continue
        x=obj['x']+bounds[0];y=obj['base']-a.height+bounds[3]
        w=bounds[2]-bounds[0];reach=6 if obj['id'].startswith('stall') else 12
        layer=Image.new('RGBA',im.size)
        layer.paste(repeat(asset('shadow-street-w3-c0').crop((12,0,132,32)),(w,reach)),(x,y))
        union=ImageChops.lighter(union,layer)
        records.append(dict(id=obj['id'],side='south',receiver=[x,y,w,reach],deferred=obj.get('deferred')))
    # Preserve all ground texture through <=50% opacity; buildings/props then
    # cover the mask in base-row order. This also masks shadows off roof planes.
    im.alpha_composite(union)
    return records


def scene(layout):
    """Only crop/tile/composite already drawn pieces. Base coordinates in pixels."""
    size=tuple(layout['size']);im=repeat(context('town_ground'),size)
    # Grid masks select crops of a painted terrain texture; no cobbles are drawn.
    for key,rects in layout['terrain'].items():
        tiled=repeat(context(key),size)
        for x,y,w,h in rects:
            box=(x*48,y*48,(x+w)*48,(y+h)*48)
            im.alpha_composite(tiled.crop(box),box[:2])
    objects=[];records=[];buildings=neighbours(layout.get('buildings',[]))
    records.extend(ground_shadows(im,layout,buildings))
    for b in buildings:
        a,parts=build(b['spec'],include_roof_overlays=False);x,y=b['x'],b['base']-a.height
        records.append(dict(**b,y=y,parts=parts));objects.append((b['base'],0,x,a,y))
        for accent in b['spec'].get('roof_overlays',[]):
            # Final accents share the owner's base row and follow EVERY opaque
            # roof/join at that row. Later southern buildings still occlude them.
            objects.append((b['base'],3,x+accent['x'],asset(accent['file']),y+accent['y']))
            records.append(dict(id=b['id']+'-'+accent['file'],file=accent['file'],
                                x=x+accent['x'],y=y+accent['y'],layer='final roof overlay'))
    for o in layout.get('objects',[]):
        a=Image.open(ART/o['file']).convert('RGBA');y=o['base']-a.height
        objects.append((o['base'],1,o['x'],a,y));records.append(dict(**o,y=y))
    if layout.get('joined_l'):
        o=layout['joined_l'];a=joined_l_roof(o.get('colour',0))
        objects.append((o['base'],2,o['x'],a,o['y']))
        records.append(dict(id='joined-L-roof',**o,files=[f"review/r17-B-critic3-L-paint-c{o.get('colour',0)}.png"],
                            valley=[48,144],hip_end=[288,144],ridge_elbow=[48,192]))
    for base,priority,x,a,y in sorted(objects,key=lambda a:(a[0],a[1],a[2])):im.alpha_composite(a,(x,y))
    return im,records


def critic_layouts():
    """Grid-aligned Part B roof pilot; all absent later parts are explicit."""
    def add(layout,ident,x,base,width=2,floors=1,ground='shop',variant=0,colour=0,roof='ridge',depth=None,accent=None):
        spec=make_spec(width,floors,ground,variant,colour,roof,['stone','plaster','jetty','timber'])
        if depth:spec['roof_depth']=depth
        if accent:spec['roof_overlays']=[roof_mount(spec,accent)]
        lot=dict(id=ident,x=x,base=base,spec=spec);layout['buildings'].append(lot);return lot
    l=dict(size=[768,576],terrain={'street':[[0,3,8,2],[8,3,8,1],[0,11,8,1],[8,10,8,2],
        [7,0,1,11],[2,7,5,1],[12,4,1,4]],'square':[[8,4,2,1]]},buildings=[],objects=[])
    # Northern row ends at y144; its complete two-cell roofs remain in frame.
    for i,(x,w) in enumerate([(0,2),(96,1),(144,2),(240,2),(384,2),(480,2),(576,1),(624,3)]):
        add(l,'north-'+str(i),x,144,w,1,GROUNDS[i%4],i%3,i%2,['gable','ridge','flat'][i%3],accent=['chimney-0','dormer-0',None,'skylight-0'][i%4])
    # West L: upper wing only at the left; its spur meets the north-south lane.
    for i,(x,w,f,r) in enumerate([(0,2,1,'gable'),(96,2,1,'ridge'),(192,3,1,'gable')]):
        add(l,'L-south-'+str(i),x,528,w,f,GROUNDS[(i+1)%4],i%3,i%2,r,accent=['skylight-1','dormer-1','chimney-2'][i])
    # L's concave roof intersection uses painted fill + gutter, within one lot.
    a=add(l,'L-corner',0,528,2,1,'arch',2,0,'ridge',depth=5,accent='chimney-1')
    a['spec']['roof_joins']=[]
    l['joined_l']=dict(x=0,y=240,base=528,colour=0)
    # Mount accents against the FINAL L planes, clear of its y430 ridge.
    for lot in l['buildings']:
        if lot['id']=='L-south-1':lot['spec']['roof_overlays'][0]['y']=52
        if lot['id']=='L-south-2':lot['spec']['roof_overlays'][0]['y']=8
    l['buildings']=[b for b in l['buildings'] if b['id']!='L-south-0']
    # East wing: dead-end lane at column12 ends at row8, with a low cap beyond.
    add(l,'east-left',384,480,2,2,'work',0,0,'hip',accent='chimney-3')
    add(l,'east-middle',480,480,2,1,'shop',2,1,'ridge',accent='dormer-2')
    add(l,'deadend-roof',576,528,1,1,'door',2,0,'gable')
    add(l,'east-right',624,480,3,2,'shop',1,1,'ridge',accent='dormer-3')
    l['buildings'][-1]['spec']['overlays']=[sign_mount(l['buildings'][-1]['spec'],'sign-apothecary')]
    l['buildings'][0]['spec']['ground']='inn'
    l['features']=dict(L_block='west roof arm x0..2 rows5..10, south roof x0..7 rows8..10; gutter (2,8) to ridge elbow (1,9); terminal hip x6..7 rows8..10',T_junction=[7,7],dead_end=[12,8],north_south_lane=[7,3,1,8],bent_street='north road narrows east of column8',wedge='setback at dead-end cap',yard='deliberate west court x2..7 rows5..7, Part C yard art absent')
    # End-lot east shade has an explicit narrow receiver inside its plot approach.
    for b in l['buildings']:
        if b['id'] in ('north-3','L-south-2'):
            b['east_receiver']=[336,b['base']-48,6,48]
    m=dict(size=[864,864],terrain={'street':[[8,0,2,18],[0,13,9,2],[9,14,9,1],[3,4,1,10]],
        'square':[[4,6,10,7],[6,13,8,1],[4,5,5,1]]},buildings=[],objects=[])
    # Low buildings flank the existing civic proxies; final skyline belongs to D.
    for i,(x,base,w,f,r) in enumerate([(0,240,2,2,'ridge'),(96,240,1,1,'gable'),
        (672,240,2,1,'hip'),(768,240,2,2,'flat'),(0,480,2,1,'gable'),(96,480,1,1,'ridge'),
        (672,480,2,1,'hip'),(768,480,2,1,'gable'),(0,768,2,2,'flat'),(96,768,1,1,'ridge'),
        (672,816,2,3,'ridge'),(768,816,2,1,'gable')]):
        add(m,'market-lot-'+str(i),x,base,w,f,GROUNDS[i%4],i%3,i%2,r,accent=['chimney-0',None,'dormer-0','skylight-0'][i%4])
    for name,file,x,base in [('cathedral-placeholder','fantasy-hall-1.png',240,288),
        ('guildhall-placeholder','fantasy-hall-0.png',384,864),('market-cross-placeholder','fantasy-well-0.png',432,528)]:
        m['objects'].append(dict(id=name,file='reference/r17/'+file,x=x,base=base,deferred='Part D'))
    for i,(x,base) in enumerate([(240,432),(300,432),(360,432),(540,576),(600,576),(660,576)]):
        m['objects'].append(dict(id='stall-'+str(i),file=f'reference/r17/fantasy-stall-{i%2}.png',x=x,base=base,deferred='Part D: six positions, two current drawings'))
    m['features']=dict(square='irregular L:10x7 +8x1 +5x1',central_aisle=[8,6,2,8],churchyard=[4,5,5,1],landmarks='current native hall/well proxies; cathedral, cross and gate absent until D')
    t=dict(size=[768,480],terrain={'street':[[0,9,16,1]]},buildings=[],objects=[])
    for i,(x,f,w) in enumerate([(48,5,3),(192,1,1),(384,1,1),(432,5,3)]):
        b=add(t,'height-'+str(i),x,432,w,f,'door' if f==1 else 'shop',i%3,i%2,'hip',accent='chimney-'+str(i))
        if i in (1,3):b['east_receiver']=[x+w*48,432-f*48,32,f*48]
    t['features']=dict(joins='5|1 and 1|5; zero interlot gap',firewall='48px bay beside intact narrower facade where it fits; narrow lots use 4px blank-edge masonry returns; coping/flashing once',shadow='height responsive6..30px south/east; end lots reserve32px east receiver; union opacity112/255')
    return {'L-block':l,'market':m,'height-test':t}


PLACEHOLDERS=['All roofs, roof overlays, firewall and shadows are Round 17 Part B',
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
        d.text((12,10),f'ROUND 17 PART B / {name} / {scale}x nearest neighbour',fill='white');out.alpha_composite(a,(12,36))
        for i,line in enumerate(PLACEHOLDERS):d.text((12,a.height+45+i*15),line,fill=(228,214,183))
        y=12
        for title,r in refs:d.text((a.width+36,y),title,fill='white');out.alpha_composite(r,(a.width+36,y+24));y+=r.height+40
        save(out,f'critic-{name}-comparison-{scale}x',SceneScale=scale,ReferenceScale=1,Placeholders=PLACEHOLDERS)


def main():
    parser=argparse.ArgumentParser(description='Native Part B compositor; no drawing operations.')
    parser.add_argument('--no-sheets',action='store_true');parser.add_argument('--seed',type=int,default=731)
    args=parser.parse_args()
    layouts=critic_layouts()
    for name,layout in layouts.items():
        im,records=scene(layout);scales(im,'critic-'+name,(1,3),Layout=layout,Placements=records,Placeholders=PLACEHOLDERS)
        grey=im.convert('L').convert('RGBA');save(grey,'critic-'+name+'-squint-1x',Layout=layout,Placeholders=PLACEHOLDERS)
        compare(im,name)
    (REVIEW/'r17-B-scenes.json').write_text(json.dumps(layouts,indent=2)+'\n')
    specs=random_specs(args.seed);im,records=street(specs);scales(im,'street',(1,3),Specs=specs,Placements=records,Placeholders=PLACEHOLDERS)
    if not args.no_sheets:
        import importlib.util
        sp=importlib.util.spec_from_file_location('reviews',REVIEW/'r17-B-build.py');mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod);mod.reviews()
    print('Saved native critic scenes, comparisons and squint renders.')


# Part C entry point is below; legacy Part B functions remain available.




# ---- Part C: rear rows, side entrances, deliberate gardens and routes ----
@lru_cache(maxsize=5)
def c_connected_roof(node):
    """One registered painting includes the north wing and its actual join.

    Its native rows 95/96 are consecutive source rows, never independently
    scaled or patched. Approved standalone caps remain available unchanged.
    Only the shared last eave contact is transferred from that approved cap.
    """
    roof=Image.open(REVIEW/f'r17-C-critic2-connected-{node}.png').convert('RGBA')
    cap=asset(node+'-roof')
    roof.paste(cap.crop((0,95,cap.width,96)),(0,191))
    return roof


def build_c(spec):
    """Native front/back/side assembly. Every module anchors at bottom left."""
    if spec.get('view','front')=='front': return build(spec)
    view=spec['view'];width=spec.get('width',2);floors=spec.get('floors',1)
    if view=='wing':
        node=spec.get('node','corner-outer-L' if spec.get('direction')=='W' else 'corner-outer-R')
        im=c_connected_roof(node).crop((0,0,96,96))
        return im,[dict(file=f'review/r17-C-critic2-connected-{node}.png',x=0,y=0,crop=[0,0,96,96],layer='continuous painted north wing; no repeated gable crop')]
    if view=='back':
        roof_name=f'roof-back-w{width}'
        wall_name=f"back-{spec.get('back','plain')}-w{width}"
        # Plain rear doors and foundations belong to the ground floor only.
        # Stair drawings have full-width landings and continuous support posts.
        wall_names=([f'back-plain-ground-w{width}']+[wall_name]*(floors-1)) if spec.get('back','plain')=='plain' else [wall_name]*floors
    elif view=='side':
        depth=spec.get('depth',2);roof_name=f'side-roof-d{depth}'
        direction=spec.get('direction','E')
        if depth==2 and direction=='W':roof_name='side-roof-d2-W'
        wall_names=([f'side-ground-{direction}']+[f'side-storey-{direction}']*(floors-1)) if depth==2 else ['side-ground-d3']+['side-storey-d3']*(floors-1)
    elif view=='node':
        node=spec['node'];roof_name=node+'-roof'
        wall_names=[node+'-storey']*floors
    else: raise ValueError(view)
    roof=asset(roof_name)
    if view=='node' and spec.get('connected'):
        roof=c_connected_roof(node).crop((0,96,roof.width,192))
        roof_name=f'review/r17-C-critic2-connected-{node}.png'
    im=Image.new('RGBA',(roof.width,roof.height+48*floors));parts=[]
    for floor,name in enumerate(wall_names):
        wall=asset(name)
        if wall.width!=roof.width:raise ValueError('side depth requires native d3 wall')
        y=im.height-48*(floor+1);im.alpha_composite(wall,(0,y));parts.append(dict(file=name,x=0,y=y,layer='wall'))
    for wall in spec.get('firewalls',[]):
        x=0 if wall['side']=='left' else im.width-16
        receiving=firewall_surface((16,wall['height']))
        im.alpha_composite(receiving,(x,roof.height))
        parts.append(dict(file='firewall-w0',x=x,y=roof.height,layer='C party wall',height=wall['height']))
    im.alpha_composite(roof,(0,0));parts.append(dict(file=roof_name,x=0,y=0,layer='roof'))
    im.alpha_composite(asset(f'shadow-eave-w{roof.width//48}'),(0,roof.height+1))
    return im,parts


def c_ground(size,roads,junction_file="street-junction"):
    im=repeat(context('town_ground'),size)
    for road in roads:
        x,y,w,h=road['rect'];tile=Image.open(ART/road['path']).convert('RGBA') if road.get('path') else asset(road['file'])
        if road.get('horizontal'):tile=tile.transpose(Image.Transpose.ROTATE_90)
        im.alpha_composite(repeat(tile,(w,h)),(x,y))
    # An adjoining road opens the painted kerb: transfer open paving at those
    # contacts, instead of leaving the earlier rectangle's kerb across a T.
    def road_at(x,y):
        return any(rx<=x<rx+rw and ry<=y<ry+rh for rx,ry,rw,rh in (r['rect'] for r in roads))
    field=asset(junction_file)
    for road in roads:
        if road['file'] not in ('street-main','street-side','lane'):continue
        x,y,w,h=road['rect']
        if road.get('horizontal'):
            for xx in range(x,x+w):
                for yy,other in ((y,y-1),(y+h-3,y+h)):
                    if road_at(xx,other):im.paste(field.crop((xx%48,yy%48,xx%48+1,yy%48+3)),(xx,yy)) if yy%48<=45 else im.paste(repeat(field,(1,3)),(xx,yy))
        else:
            for yy in range(y,y+h):
                for xx,other in ((x,x-1),(x+w-3,x+w)):
                    if road_at(other,yy):im.paste(field.crop((xx%48,yy%48,xx%48+3,yy%48+1)),(xx,yy)) if xx%48<=45 else im.paste(repeat(field,(3,1)),(xx,yy))
    return im


def c_shadow_layer(layout):
    """Union approved painted shadows, then restrict to visible ground.

    All exposed east walls receive height-responsive shade automatically.
    Opaque drawings mask both directions, so no shadow crosses a roof or prop.
    Translucent shade changes ground value without consuming route clearance.
    """
    size=tuple(layout['size']);union=Image.new('RGBA',size);occupied=Image.new('L',size);records=[]
    east=asset('shadow-street-w3').crop((12,0,132,32)).transpose(Image.Transpose.ROTATE_90)
    for b in layout.get('lots',[]):
        a,_=build_c(b['spec']);x,y=b['x'],b['base']-a.height
        mask=Image.new('L',size);mask.paste(a.getchannel('A'),(x,y));occupied=ImageChops.lighter(occupied,mask)
        floors=b['spec'].get('floors',1+len(b['spec'].get('storeys',[])));reach=min(30,6*floors)
        if not reach:continue
        receivers=[('south',[x,b['base'],a.width,reach],asset(f'shadow-street-w{a.width//48}').crop((0,0,a.width,reach)))]
        ex,ey,ew,eh=b.get('east_receiver',[x+a.width,b['base']-floors*48,reach,floors*48])
        ew=min(ew,reach)
        receivers.append(('east',[ex,ey,ew,eh],repeat(east,(ew,eh))))
        for side,rect,paint in receivers:
            layer=Image.new('RGBA',size);layer.paste(paint,rect[:2]);union=ImageChops.lighter(union,layer)
            records.append(dict(id=b['id'],side=side,reach=reach,receiver=rect))
    if layout.get('joined_l'):
        o=layout['joined_l'];a=joined_l_roof(o.get('colour',0));mask=Image.new('L',size);mask.paste(a.getchannel('A'),(o['x'],o['y']));occupied=ImageChops.lighter(occupied,mask)
    for o in layout.get('props',[]):
        a=asset(o['file']) if not o.get('path') else Image.open(ART/o['path']).convert('RGBA')
        x,y=o['x'],o['base']-a.height;mask=Image.new('L',size);mask.paste(a.getchannel('A'),(x,y));occupied=ImageChops.lighter(occupied,mask)
        bounds=a.getbbox()
        if bounds and not o['file'].startswith('fence'):
            sx,sy=x+bounds[0],y+bounds[3];w=bounds[2]-bounds[0]
            civic=o['file'] in ('cathedral','guildhall','gatehouse','wall-tower','wall-walk','wall-walk-stair','townhall-market')
            reach=(min(32,max(6,a.height//12)) if layout.get('e_ground') else min(30,max(6,a.height//16))) if civic else 6
            layer=Image.new('RGBA',size);layer.paste(repeat(asset('shadow-street-w3').crop((12,0,132,reach)),(w,reach)),(sx,sy));union=ImageChops.lighter(union,layer)
            if civic or o.get('cast_east'):
                # Reuse approved painted shade; restrict it to receiving ground
                # with the same occupancy mask as houses and market props.
                layer=Image.new('RGBA',size)
                if layout.get('e_ground') and civic:
                    # Each painted row, including the narrow tower, casts
                    # from its own silhouette rather than a floating bbox.
                    for yy in range(a.height):
                        bb=a.crop((0,yy,a.width,yy+1)).getbbox()
                        if bb:layer.paste(east.crop((0,yy%east.height,reach,yy%east.height+1)),(x+bb[2],y+yy))
                else:
                    ex=x+bounds[2];eh=min(a.height,144);layer.paste(repeat(east,(reach,eh)),(ex,sy-eh))
                union=ImageChops.lighter(union,layer)
    union.putalpha(ImageChops.multiply(union.getchannel('A'),ImageChops.invert(occupied)))
    return union,records


def c_render(layout,cutaway=False):
    im=e_ground(layout) if layout.get('e_ground') else c_ground(tuple(layout['size']),layout.get('roads',[]),layout.get('junction_file','street-junction'))
    ordered=[];records=[]
    for turn in layout.get('kerb_turns',[]):
        # The square turn itself was drawn; only a native patch is transferred.
        patch=asset('street-junction-turn').crop((4,17,13,26))
        if turn.get('rotate'):patch=patch.rotate(turn['rotate'])
        im.alpha_composite(patch,(turn['x'],turn['y']))
    shade,shadow_records=c_shadow_layer(layout);im.alpha_composite(shade)
    for b in layout.get('lots',[]):
        a,parts=build_c(b['spec']);x,y=b['x'],b['base']-a.height
        if min(x,y)<0 or x+a.width>im.width or b['base']>im.height:raise ValueError(('off canvas',b['id'],x,y))
        floors=b['spec'].get('floors',1+len(b['spec'].get('storeys',[])))
        if cutaway and b.get('cutaway'):
            # Omit the opaque roof; show the already drawn receiving ground.
            a=a.copy();roof_h=a.height-floors*48;a.paste((0,0,0,0),(0,0,a.width,roof_h))
        ordered.append((b['base'],0,x,y,a))
        records.append(dict(id=b['id'],painted=[x,y,a.width,a.height],footprint=b.get('footprint'),entrance=b.get('entrance'),overhang=b.get('overhang'),parts=parts,shadows=[s for s in shadow_records if s['id']==b['id']]))
    if layout.get('joined_l'):
        o=layout['joined_l'];a=joined_l_roof(o.get('colour',0))
        ordered.append((o['base'],2,o['x'],o['y'],a));records.append(dict(id='continuous-L',painted=[o['x'],o['y'],a.width,a.height],footprint=None,entrance=None,overhang=0,parts=[dict(file='Part B continuous L paint')]))
    for o in layout.get('props',[]):
        a=asset(o['file']) if not o.get('path') else Image.open(ART/o['path']).convert('RGBA')
        ordered.append((o['base'],o.get('layer',1),o['x'],o['base']-a.height,a));records.append(o)
    for base,z,x,y,a in sorted(ordered,key=lambda t:(t[0],t[1],t[2])):im.alpha_composite(a,(x,y))
    return im,records


def pilot_c():
    front=make_spec(2,1,'door',1,0,'ridge')
    return dict(size=[384,384],roads=[
        dict(file='street-main',rect=[288,0,96,384]),
        dict(file='street-side',rect=[0,336,288,48],horizontal=True),
        dict(file='street-junction',rect=[96,144,48,192]),
        dict(file='street-junction',rect=[240,240,48,96]),
        dict(file='street-junction',rect=[144,240,144,48])],
        lots=[dict(id='rear',x=0,base=144,spec=dict(view='back',width=2,floors=1),footprint=[0,0,96,144],entrance=[74,144],overhang=0),
              dict(id='front',x=0,base=336,spec=front,footprint=[0,240,96,96],entrance=[77,336],overhang=[0,192,96,48],cutaway=True),
              dict(id='side-entry',x=144,base=240,spec=dict(view='side',direction='E',depth=2,floors=2),footprint=[144,144,96,96],entrance=[170,240],overhang=[144,48,96,96])],
    props=[dict(file='yard-0',x=0,base=192),dict(file='fence-0',x=48,base=192),dict(file='pilot-person',path='review/r17-C-pilot-person.png',x=112,base=238)],
        reservations=dict(civic=[240,0,48,96],gate=[288,0,96,48]),
        clearance=dict(main=96,side=48,court=48),plot=[0,0,96,336])


def c_save(im,name,**metadata):
    info=PngImagePlugin.PngInfo()
    for key,value in metadata.items():info.add_text(key,json.dumps(value,sort_keys=True))
    im.save(REVIEW/f'r17-C-{name}.png',pnginfo=info)


def c_pilot_proof():
    layout=pilot_c();im,records=c_render(layout)
    for scale in (1,3):c_save(im.resize((im.width*scale,im.height*scale),NEAREST),f'pilot-{scale}x',Layout=layout,Placements=records)
    # This is a review diagram only; boxes/labels are never exported as art.
    proof=Image.new('RGBA',(808,450),(35,39,34,255));proof.alpha_composite(im,(12,35));proof.alpha_composite(im,(412,35));d=ImageDraw.Draw(proof)
    d.text((12,10),'8 x 8 combined pilot / native pixels',fill='white');d.text((412,10),'Paint / footprint / entrance / permitted projection',fill='white')
    for rec in records:
        if 'painted' not in rec:continue
        x,y,w,h=rec['painted'];d.rectangle((412+x,35+y,411+x+w,34+y+h),outline='#fdc75d')
        if rec['footprint']:
            x,y,w,h=rec['footprint'];d.rectangle((412+x,35+y,411+x+w,34+y+h),outline='#77ccef',width=2)
        if rec.get('overhang'):
            x,y,w,h=rec['overhang'];d.rectangle((413+x,36+y,410+x+w,33+y+h),outline='#ff8bd1')
        if rec['entrance']:
            x,y=rec['entrance'];d.ellipse((409+x,32+y,415+x,38+y),fill='#ff6666')
    for name,(x,y,w,h) in layout['reservations'].items():
        d.rectangle((412+x,35+y,411+x+w,34+y+h),outline='#bb99ee');d.text((414+x,38+y),name,fill='white')
    d.text((12,428),'Yellow: paint. Blue: footprint. Pink: permitted projection. Red: entrance. Violet: civic/gate.',fill='white')
    c_save(proof,'pilot-plan',Layout=layout)
    return im


# Full Part C entry point follows.


C_PLACEHOLDERS=[
 'Facades/roofs/shadows: current Round17 A/B. Rear/side/corners/yards/streets: C.',
 'Part D proxies: current fantasy halls, well and two stall drawings at native size.',
 'Cathedral, guildhall, market cross, six distinct stalls and gate await D.',
 'No Round15 asset is used in scenes; Round15 appears only as the comparison.'
]


def c_layouts():
    old=critic_layouts();l=old['L-block']
    lots=[]
    for b in l['buildings']:
        if b['id'].startswith('east-') or b['id']=='deadend-roof':continue
        if b['id'].startswith('north-') and b['x']<336:
            b=dict(b);b['spec']=dict(view='back',width=b['spec']['width'],floors=1,back='stair' if b['x']==144 else 'plain')
        lots.append(b)
    lots=[b for b in lots if not (b['id'].startswith('north-') and b['x']<336)]
    for i,(x,w,kind) in enumerate([(0,3,'plain'),(144,1,'stair'),(192,2,'plain'),(288,1,'plain')]):
        lots.append(dict(id='north-rear-'+str(i),x=x,base=144,spec=dict(view='back',width=w,floors=1,back=kind)))
    lots.extend([
      dict(id='side-along-lane',x=384,base=480,spec=dict(view='side',direction='W',depth=2,floors=2)),
      dict(id='east-shop',x=480,base=480,spec=make_spec(2,1,'work',1,0,'ridge')),
      dict(id='deadend-cap',x=576,base=336,spec=dict(view='node',node='deadend-cap',floors=1)),
      dict(id='east-corner',x=672,base=480,spec=dict(view='node',node='corner-outer-R',floors=2))])
    roads=[dict(file='street-main',rect=[0,144,384,96],horizontal=True),
           dict(file='street-side',rect=[384,144,384,48],horizontal=True),
           dict(file='street-side',rect=[0,528,384,48],horizontal=True),
           dict(file='street-main',rect=[384,480,384,96],horizontal=True),
           dict(file='street-side',rect=[336,0,48,240]),
           dict(file='street-main',rect=[288,240,96,144]),
           dict(file='street-side',rect=[336,384,48,144]),
           dict(file='street-side',rect=[576,336,48,144]),
           dict(file='street-junction',rect=[288,240,48,144]),
           dict(file='street-junction',rect=[96,240,192,48]),
           dict(file='street-junction',rect=[288,336,96,48])]
    props=[]
    for x,kind in [(96,0),(144,1),(192,3),(240,2)]:props.append(dict(file=f'yard-{kind}',x=x,base=336))
    for x in (96,144,192,240):props.append(dict(file='fence-0',x=x,base=365))
    for x in (94,190,286):props.append(dict(file='fence-1',x=x,base=336))
    for x,kind in [(384,1),(432,2),(480,0),(528,3),(624,2)]:props.append(dict(file=f'yard-{kind}',x=x,base=288 if x<576 else 432))
    # Native fence strips mark two narrow, deliberate rear gardens.
    for x in (384,432,480,528):props.append(dict(file='fence-0',x=x,base=216))
    for x in (466,562):
        for base in (240,288):props.append(dict(file='fence-1',x=x,base=base))
    for x in (672,720):props.append(dict(file='fence-0',x=x,base=216))
    props.extend([dict(file='yard-2',x=672,base=288),dict(file='yard-1',x=720,base=288)])
    props += [dict(file='fence-1',x=648,base=384),dict(file='fence-1',x=648,base=432),
              dict(file='fence-0',x=624,base=458),dict(file='pilot-person',path='review/r17-C-pilot-person.png',x=348,base=345)]
    block=dict(size=[768,576],roads=roads,lots=lots,props=props,joined_l=l['joined_l'],kerb_turns=[dict(x=288,y=240),dict(x=375,y=375,rotate=180),dict(x=576,y=471,rotate=90)],
      gardens=[[96,288,192,96],[384,192,96,96],[480,192,96,96],[672,192,96,96],[624,336,48,144]],
      required_roofs=[[0,240,96,240],[96,384,240,96],[576,192,96,96]],
      features=dict(T=[7,7],dead_end=[12,7],north_south_lane='48px / 96px court setback / 48px, runs5/3/3cells',two_EW_streets=[3,11],bent='east-west width changes at column8',wedge='stepped east courtyard between terminal cap and corner'),
      clear_routes=[[336,0,48,528],[576,336,48,144],[0,144,384,96]],plot_depth_cells=[5,6,7])
    m=old['market'];mlots=[]
    for b in m['buildings']:
        b=json.loads(json.dumps(b))
        if b['id']=='market-lot-4':b['spec']=dict(view='side',direction='E',depth=2,floors=1)
        if b['id']=='market-lot-6':b['spec']=dict(view='side',direction='W',depth=2,floors=1)
        if b['id']=='market-lot-8':b['spec']=dict(view='node',node='corner-outer-L',floors=2)
        if b['id']=='market-lot-10':b['spec']=dict(view='node',node='corner-outer-R',floors=2)
        mlots.append(b)
    # Keep a native three-cell-deep side property on the upper eastern edge.
    mlots=[b for b in mlots if b['id'] not in ('market-lot-2','market-lot-3')]
    mlots.append(dict(id='deep-side-property',x=672,base=240,spec=dict(view='side',depth=3,floors=2,direction='E')))
    mroads=[dict(file='street-junction',rect=[192,288,480,336]),
      dict(file='street-junction',rect=[288,624,384,48]),dict(file='street-junction',rect=[192,240,240,48]),
      dict(file='street-main',rect=[384,0,96,288]),
      dict(file='street-junction',rect=[336,288,192,144]),
      dict(file='street-main',rect=[384,432,96,240]),
      dict(file='street-junction',rect=[336,672,144,96]),
      dict(file='street-main',rect=[384,768,96,96]),
      dict(file='street-main',rect=[0,624,384,96],horizontal=True),
      dict(file='street-side',rect=[432,672,336,48],horizontal=True),
      dict(file='street-side',rect=[144,192,48,240]),
      dict(file='street-main',rect=[144,432,96,48]),
      dict(file='street-side',rect=[144,480,48,192]),
      dict(file='street-junction',rect=[336,336,48,96]),
      dict(file='street-junction',rect=[480,672,48,96])]
    mprops=[]
    for name,file,x,base in [('cathedral-PART-D-PROXY','fantasy-hall-1.png',192,240),
       ('guildhall-PART-D-PROXY','fantasy-hall-0.png',480,864),
       ('market-cross-PART-D-PROXY','fantasy-well-0.png',528,480)]:
        mprops.append(dict(file=name,path='reference/r17/'+file,x=x,base=base,deferred='Part D'))
    for i,(x,base) in enumerate([(192,432),(240,432),(288,432),(528,576),(588,576),(648,576)]):
        mprops.append(dict(file='stall-'+str(i),path=f'reference/r17/fantasy-stall-{i%2}.png',x=x,base=base,deferred='Part D: two source drawings, six positions'))
    for x,y,k in [(0,336,1),(48,336,3),(720,336,2),(768,336,0),(48,576,2),(720,624,3)]:
        mprops.append(dict(file=f'yard-{k}',x=x,base=y));mprops.append(dict(file='fence-0',x=x,base=y+26))
    market=dict(size=m['size'],roads=mroads,lots=mlots,props=mprops,kerb_turns=[dict(x=336,y=288),dict(x=519,y=423,rotate=180),dict(x=336,y=672)],
       gardens=[[0,240,144,96],[672,240,192,96],[0,480,144,144],[672,480,192,192]],
       clear_routes=[[384,0,96,864],[144,192,48,480],[336,288,192,144],[336,672,144,96]],
       features=dict(square='irregular L:10x7,8x1,5x1; 96px middle aisle',stalls='two rows of three',civic='current native drawings; final skyline deferred',gate='96px route to north boundary reservation',wedge='stepped south/east plot setbacks'))
    # Existing B tall/low geometry and wall/flashing logic are retained intact.
    heights=old['height-test'];height_lots=neighbours(heights['buildings'])
    height=dict(size=[768,864],lots=height_lots,props=[],roads=[dict(file='street-side',rect=[0,432,384,48],horizontal=True),dict(file='street-main',rect=[384,432,384,96],horizontal=True),dict(file='street-main',rect=[0,816,384,48],horizontal=True),dict(file='street-side',rect=[384,816,384,48],horizontal=True)],features=heights['features'])
    for ident,x,spec in [('C-east-five',48,dict(view='side',direction='E',depth=2,floors=5,firewalls=[dict(side='right',height=192)])),('C-rear-one',144,dict(view='back',width=1,floors=1)),('C-rear-one-west',384,dict(view='back',width=1,floors=1)),('C-west-five',432,dict(view='side',direction='W',depth=2,floors=5,firewalls=[dict(side='left',height=192)]))]:
        height['lots'].append(dict(id=ident,x=x,base=816,spec=spec))
    height['features']['C_join']='Both separately lit C returns beside1-storey rear walls, with original B coping/flashing.'
    junctions=c_connected_layout()
    return {'L-block':block,'market':market,'height-test':height,'junctions':junctions}


def c_connected_layout():
    """Each node contacts both a horizontal row and a perpendicular roof wing."""
    layout=dict(size=[1152,864],lots=[],roads=[],props=[],features=dict(proof='Connected C corners with A fronts, C rears and perpendicular side roofs; grass is explicit court.'))
    for i,node in enumerate(['corner-outer-L','corner-inner','tee-end','corner-outer-R','deadend-cap']):
        ox=(i%3)*384;oy=(i//3)*432;nx=ox+96;nw=144 if node=='tee-end' else 96
        layout['lots'].append(dict(id=node+'-north-wing',x=nx,base=oy+144,spec=dict(view='wing',node=node,direction='W' if node.endswith('L') else 'E',floors=0)))
        layout['lots'].append(dict(id=node,x=nx,base=oy+336,spec=dict(view='node',node=node,floors=2,connected=True)))
        layout['lots'].append(dict(id=node+'-front-west',x=ox,base=oy+336,spec=make_spec(2,2,'door',i%3,0,'ridge')))
        if nw==96:
            layout['lots'].append(dict(id=node+'-rear-east',x=nx+nw,base=oy+336,spec=dict(view='back',width=2,floors=2,back='plain')))
        else:
            layout['lots'].append(dict(id=node+'-rear-east',x=nx+nw,base=oy+336,spec=dict(view='back',width=1,floors=2,back='stair')))
        layout['roads'] += [dict(file='street-side',rect=[ox,336+oy,336,48],horizontal=True),dict(file='street-side',rect=[ox+288,oy+192,48,144])]
        layout['props'].append(dict(file='yard-2',x=ox+240,base=oy+144))
        if node=='deadend-cap':
            # A real closed road end meets the cap, instead of a floating cap.
            layout['roads'].append(dict(file='street-side',rect=[nx+24,oy+336,48,96]))
    return layout


def c_compare(im,name):
    refs=[('ROUND15 street / literal1x',Image.open(ART/'reference/r17/round15-street.png').convert('RGBA')),
          ('CURRENT town / literal1x screenshot,24px displayed cells',Image.open(ART/'reference/r17/current-town.png').convert('RGBA'))]
    for scale in (1,3):
        a=im.resize((im.width*scale,im.height*scale),NEAREST)
        out=Image.new('RGBA',(a.width+max(r.width for _,r in refs)+48,max(a.height+125,sum(r.height+40 for _,r in refs)+30)),(35,39,34,255));d=ImageDraw.Draw(out)
        d.text((12,10),f'ROUND17 C / {name} / {scale}x nearest neighbour',fill='white');out.alpha_composite(a,(12,34))
        for i,line in enumerate(C_PLACEHOLDERS):d.text((12,a.height+44+i*16),line,fill='#ded4bb')
        y=12
        for title,r in refs:
            d.text((a.width+36,y),title,fill='white');out.alpha_composite(r,(a.width+36,y+22));y+=r.height+40
        c_save(out,f'critic-{name}-comparison-{scale}x',ReferencesScale=1,SceneScale=scale)


def c_main():
    parser=argparse.ArgumentParser(description='Round17 C native compositor and critic scenes')
    parser.add_argument('--no-sheets',action='store_true');args=parser.parse_args()
    pilot=c_pilot_proof();c_compare(pilot,'pilot');c_save(pilot.convert('L').convert('RGBA'),'pilot-squint-1x')
    layouts=c_layouts();scene_records={}
    for name,layout in layouts.items():
        im,records=c_render(layout);scene_records[name]=records
        for scale in (1,3):c_save(im.resize((im.width*scale,im.height*scale),NEAREST),f'critic-{name}-{scale}x',Layout=layout,Placements=records,Proxies=C_PLACEHOLDERS)
        c_save(im.convert('L').convert('RGBA'),f'critic-{name}-squint-1x',Proxies=C_PLACEHOLDERS)
        c_compare(im,name)
    (REVIEW/'r17-C-scenes.json').write_text(json.dumps(layouts,indent=2)+'\n')
    (REVIEW/'r17-C-placements.json').write_text(json.dumps(scene_records,indent=2)+'\n')
    if not args.no_sheets:
        import importlib.util
        sp=importlib.util.spec_from_file_location('c_reviews',REVIEW/'r17-C-review.py');mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod);mod.run()
    print('Saved PartC scenes,1x/3x comparisons, squints and reviews.')

# Painted contact anchors; the footprint origin remains bottom-left.
# Towers/gate overdraw the reserved overlap, never a synthetic seam stripe.
D_WALL_ANCHORS = {
    'wall-walk': {'left': [0,36], 'right': [96,36]},
    'wall-walk-stair': {'left': [4,36], 'right': [184,36]},
    'wall-tower': {'left': [10,132], 'right': [80,132]},
    'gatehouse': {'left': [8,292], 'right': [136,292]},
}


def d_wall_props(gate_x=960, base=432, right_edge=1248):
    """Continuous native wall paint with explicit overlap attachment points."""
    props=[]
    def add(file,x,layer=1,alternate=False):
        rec=dict(file=file,x=x,base=base,layer=layer,attachments=D_WALL_ANCHORS[file])
        if alternate:rec.update(file='wall-walk-alternate',path='review/r17-D-critic2-wall-walk-alternate.png')
        props.append(rec)
    stair_x=gate_x+8-184
    add('wall-walk-stair',stair_x)
    cursor=stair_x+4
    while cursor>0:
        add('wall-walk',cursor-96,alternate=True)
        add('wall-walk',cursor-192)
        tower_x=cursor-192-80
        add('wall-tower',tower_x,2)
        cursor=tower_x+10
    add('gatehouse',gate_x,3)
    cursor=gate_x+136
    alternate=False
    while cursor<right_edge:
        add('wall-walk',cursor,alternate=alternate)
        cursor+=96;alternate=not alternate
    return props


def d_market():
    """L square wraps the church: guild arcade addresses its north forecourt.

    The church remains on the north edge of the main stall square. Its guild
    neighbour faces south across the northern arm towards the church, so no
    sprite mirroring or repaint of an approved civic drawing is necessary.
    """
    layout=dict(size=[1248,1968],roads=[],lots=[],props=[],clear_routes=[],features={})
    roads=layout['roads'];props=layout['props'];lots=layout['lots']
    for y,h,w in [(0,384,96),(384,144,144),(528,336,96),(864,192,144),
                  (1056,336,96),(1392,192,144),(1584,336,96),(1920,48,144)]:
        roads.append(dict(file='street-junction' if w==144 else 'street-main',rect=[984,y,w,h]))
    # Repeat only the compatible slate interior. The transverse threshold
    # is a separate drawn crop placed once at the foot of the gateway.
    roads.append(dict(file='gate-approach',path='review/r17-D-critic2-gate-interior.png',rect=[984,192,96,384]))
    roads.append(dict(file='gate-threshold',path='review/r17-D-critic2-gate-threshold.png',rect=[984,423,96,9]))
    # The 48px service route widens into planned pockets and intersections;
    # its longest unchanged segment is six cells, never the old20.5cells.
    for x,w in [(0,48),(144,384),(624,192),(912,72),(1104,144)]:
        roads.append(dict(file='street-side',rect=[x,432,w,48],horizontal=True))
    for x in (48,528,816):roads.append(dict(file='street-junction',rect=[x,432,96,96]))
    roads += [dict(file='street-junction',rect=[144,912,840,96]),
              dict(file='street-junction',rect=[192,864,192,48]),
              dict(file='street-junction',rect=[456,1008,528,432]),
              dict(file='street-junction',rect=[144,1440,840,336]),
              dict(file='street-junction',rect=[0,1488,192,144]),
              dict(file='street-junction',rect=[288,1776,696,96]),
              dict(file='street-junction',rect=[432,1872,552,48]),
              dict(file='street-side',rect=[144,768,48,240]),
              dict(file='street-side',rect=[456,576,48,336]),
              dict(file='street-side',rect=[456,912,48,240]),
              dict(file='street-junction',rect=[456,1152,96,96]),
              dict(file='street-side',rect=[456,1248,48,192])]
    def prop(file,x,base,**kw):props.append(dict(file=file,x=x,base=base,**kw))
    prop('cathedral',192,1440,footprint=[192,1152,240,288],entrance=[272,1440],overhang=[192,1008,240,144])
    prop('guildhall',192,912,footprint=[192,720,192,192],entrance=[288,912],overhang=[192,512,192,208],faces='south across the northern square arm towards the church')
    prop('townhall-market',0,1632,footprint=[0,1488,192,144])
    prop('fountain',480,1632,footprint=[480,1536,96,96])
    prop('market-cross',864,1680,footprint=[864,1584,48,96])
    prop('shrine',384,1488,footprint=[384,1440,48,48])
    for i,(x,base) in enumerate([(600,1536),(648,1536),(696,1536),(648,1728),(696,1728),(744,1728)]):
        prop(f'stall-{i}',x,base,footprint=[x,base-48,48,48])
    props.extend(d_wall_props())
    for rec in props:
        if rec['file']=='gatehouse':rec.update(footprint=[960,240,144,192],entrance=[1032,432],overhang=[960,32,144,208])
    # Churchyard has a48px south opening, retaining the north forecourt.
    for x in range(144,432,48):prop('fence-0',x,1056)
    for x in (144,432):
        for base in range(1104,1441,48):prop('fence-1',x,base)
    for x in (144,192,336,384):prop('fence-0',x,1468)
    flanks=[(0,864,2,1,'front'),(528,864,2,2,'front'),(720,816,2,1,'back'),
            (1104,768,2,2,'front'),(1104,1248,2,1,'front'),(0,1344,2,1,'back'),
            (528,1296,2,1,'front'),(720,1344,2,1,'back'),
            (0,1872,2,1,'back'),(528,1920,2,2,'front'),(768,1920,2,1,'front')]
    for i,(x,base,width,floors,view) in enumerate(flanks):
        spec=dict(view='back',width=width,floors=floors) if view=='back' else make_spec(width,floors,'door' if i%2 else 'shop',i%3,i%2,'ridge')
        lots.append(dict(id=f'D-flank-{i}',x=x,base=base,spec=spec))
    layout['clear_routes']=[[984,432,96,1536],[0,432,984,48],[1104,432,144,48],
        [48,432,96,96],[528,432,96,96],[816,432,96,96],
        [192,912,192,96],[456,912,48,528],
        [576,1536,240,144],[552,1488,48,48],[792,1680,48,48]]
    layout['gardens']=[[144,1032,312,408]]
    layout['features']=dict(square='L square: northern96px forecourt, east arm and main17.5x7-cell stall square; church north of main square, guild arcade faces church across north arm',
        market='Two staggered groups of three;144px between canopies,96px usable aisle and48px end access',
        gate='3x4 footprint wins over conflicting panel4-cell suggestion;96px portal, new drawn slate approach, explicit overlapping wall/stair contacts',
        wall='Two adjacent96px crops of one drawn walkway alternate; stair uses the same paint with an identical4px overlap, preserving the drawn stair and gate landing',
        service_route='48px continuous core,96px pockets/junctions at48,528,816; no width run beyond8cells',
        hierarchy='Church432canvas, guild/gate400; low flanks, market hall/fountain and interval towers',
        proxies='None. Round15 comparison only. Part E life remains deferred.')
    return layout


def d_save(im,name,**metadata):
    info=PngImagePlugin.PngInfo()
    for k,v in metadata.items():info.add_text(k,json.dumps(v,sort_keys=True))
    im.save(REVIEW/f'r17-D-{name}.png',pnginfo=info)


def d_compare(im,name):
    refs=[('Round15 street / literal1x','round15-street.png'),('Current town / literal1x screenshot,24px displayed cells','current-town.png')]
    refs=[(title,Image.open(ART/'reference/r17'/file).convert('RGBA')) for title,file in refs]
    for scale in (1,3):
        a=im.resize((im.width*scale,im.height*scale),NEAREST)
        sheet=Image.new('RGBA',(a.width+max(r.width for _,r in refs)+48,max(a.height+72,sum(r.height+40 for _,r in refs)+30)),(35,39,34,255));d=ImageDraw.Draw(sheet)
        d.text((12,10),f'Round17 D | {name} | {scale}x nearest neighbour',fill='white');sheet.alpha_composite(a,(12,34));y=12
        for title,r in refs:d.text((a.width+36,y),title,fill='white');sheet.alpha_composite(r,(a.width+36,y+22));y+=r.height+40
        d.text((12,a.height+45),'A/B/C/D native art. No civic proxies. Round15 only at right. Part E life deferred.',fill='white')
        d_save(sheet,f'critic-{name}-comparison-{scale}x',SceneScale=scale,ReferencesScale=1)


def d_main():
    parser=argparse.ArgumentParser(description='Round17 D native city and review sheets')
    parser.add_argument('--no-sheets',action='store_true');parser.add_argument('--part',choices=['C','D'],default='D');args=parser.parse_args()
    if args.part=='C':
        # Explicit historical replay only; default D never rewrites C reviews.
        import sys
        sys.argv=[sys.argv[0]]+(['--no-sheets'] if args.no_sheets else []);return c_main()
    old=c_layouts();layouts={'L-block':old['L-block'],'market':d_market(),'height-test':old['height-test']}
    tall=make_spec(2,5,'door',0,0,'hip');tall['roof_depth']=3
    layouts['skyline']=dict(size=[1008,576],roads=[dict(file='street-main',rect=[0,480,1008,96],horizontal=True)],lots=[dict(id='maximum-five-storeys',x=0,base=480,spec=tall)],props=[dict(file='cathedral',x=144,base=480),dict(file='guildhall',x=432,base=480),dict(file='gatehouse',x=672,base=480),dict(file='wall-tower',x=864,base=480)],features=dict(proof='All at common480px baseline. Five storeys plus3-cell roof=384px; church432, guildhall/gate400px canvases. Wall tower is subordinate.'))
    placements={}
    for name,layout in layouts.items():
        im,records=c_render(layout);placements[name]=records
        for scale in (1,3):d_save(im.resize((im.width*scale,im.height*scale),NEAREST),f'critic-{name}-{scale}x',Layout=layout,Placements=records)
        d_save(im.convert('L').convert('RGBA'),f'critic-{name}-squint-1x');d_compare(im,name)
    (REVIEW/'r17-D-scenes.json').write_text(json.dumps(layouts,indent=2));(REVIEW/'r17-D-placements.json').write_text(json.dumps(placements,indent=2))
    if not args.no_sheets:
        import importlib.util
        sp=importlib.util.spec_from_file_location('d_reviews',REVIEW/'r17-D-review.py');mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod);mod.run()
    print('Saved D scenes, comparisons, squints and per-file reviews.')


# Part E entry point follows.

# ---- Part E: quiet routes, trade symbols, district materials and life ----
E_DISTRICTS=('market','temple','craft','rich','poor')

def e_spec(district, floors=2, variant=0):
    if district=='poor' and floors>2:raise ValueError('poor quarter maximum two floors')
    s=make_spec(2,floors,'shop' if district=='market' else 'work' if district=='craft' else 'door',variant,0,'ridge')
    v=variant%3;suffix=f'-v{v}' if v else ''
    s['district']=district;s['ground_file']=f'district-{district}-ground{suffix}-w2'
    s['roof_file']=f'district-{district}-roof{suffix}-w2'
    s['roof']='ridge' if district=='poor' or v==0 else 'gable' if v==1 else 'hip'
    for i,u in enumerate(s['storeys']):
        uv=(v+i)%3;us=f'-v{uv}' if uv else '';u['file']=f'district-{district}-storey{us}-w2'
    s['roof_colour']=1 if district in ('rich','temple') else 2 if district=='craft' else 0
    if district=='market' and variant==1:s['ground_file']='inn-front'
    return s


def e_overlay(layout,file,x,base,lot,**kw):
    a=asset(file);lx,ly,lw,lh=lot
    if not (lx<=x and x+a.width<=lx+lw and ly<=base-a.height and base<=ly+lh):
        raise ValueError(('overlay outside owner',file,lot))
    layout['props'].append(dict(file=file,x=x,base=base,owner=lot,**kw))


def e_ground(layout):
    """World-registered drawn paving; rotate only kerbs, never stone faces.

    Repeatable fields share a paint phase. Full4px kerbs (3px lanes) survive
    only on exterior road edges, so unlike T contacts open. Authored path
    crops keep their destination-local origin and their own drawn kerbs.
    """
    size=tuple(layout['size']);im=repeat(context('town_ground'),size)
    roads=layout['roads'];street_files=('street-main','street-side','lane')
    pavement=[r for r in roads if r['file']!='mud-edge']
    def at(x,y):return any(rx<=x<rx+rw and ry<=y<ry+rh for rx,ry,rw,rh in (r['rect'] for r in pavement))
    def phase(tile,x,y,w,h):
        return repeat(tile,(w+tile.width,h+tile.height)).crop((x%tile.width,y%tile.height,x%tile.width+w,y%tile.height+h))
    def tint(a,kind):
        if not kind:return a
        a=a.copy()
        if kind=='square':a.putdata([(min(255,r+17),min(255,g+16),min(255,b+13),z) for r,g,b,z in a.get_flattened_data()])
        elif kind=='gate-route':a.putdata([(r-20,g-13,b+1,z) for r,g,b,z in a.get_flattened_data()])
        return a
    # Garden paint is beneath the complete road surface, including interiors.
    for x,y,w,h in layout.get('gardens',[]):im.paste(phase(asset_path_grass(),x,y,w,h),(x,y))
    for r in roads:
        if r.get('path'):continue
        x,y,w,h=r['rect'];name=r['file']
        if name in street_files:
            tile=asset('cobble-large' if name=='street-main' else 'cobble-small')
        else:tile=asset(name)
        tile=tint(tile,r.get('tone'));im.alpha_composite(phase(tile,x,y,w,h),(x,y))
    # Repaint each intersection from one complete field in global phase.
    for i,r in enumerate(pavement):
        x,y,w,h=r['rect']
        for s in pavement[i+1:]:
            xx,yy,ww,hh=s['rect'];l,t=max(x,xx),max(y,yy);rr,bb=min(x+w,xx+ww),min(y+h,yy+hh)
            if l<rr and t<bb and not (r.get('path') or s.get('path')):
                tone='gate-route' if 'gate-route' in (r.get('tone'),s.get('tone')) else None
                im.paste(phase(tint(asset('cobble-large'),tone),l,t,rr-l,bb-t),(l,t))
    for r in roads:
        if r['file'] not in street_files:continue
        x,y,w,h=r['rect'];k=3 if r['file']=='lane' else 4;tile=asset(r['file'])
        if r.get('horizontal'):
            tile=tile.transpose(Image.Transpose.ROTATE_90)
            for xx in range(x,x+w):
                for sy,dy,other in ((0,y,y-1),(tile.height-k,y+h-k,y+h)):
                    if not at(xx,other):im.paste(tile.crop((xx%tile.width,sy,xx%tile.width+1,sy+k)),(xx,dy))
        else:
            for yy in range(y,y+h):
                for sx,dx,other in ((0,x,x-1),(tile.width-k,x+w-k,x+w)):
                    if not at(other,yy):im.paste(tile.crop((sx,yy%48,sx+k,yy%48+1)),(dx,yy))
    # The gate interior is a complete kerbed drawing, not a world-wrapped
    # cobble field. Match Part D's local origin in both axes, after generic
    # kerbs so they cannot overwrite its edges. Preserve road order: the
    # interior repeats vertically, then the one-off threshold covers its foot.
    for r in roads:
        if not r.get('path'):continue
        x,y,w,h=r['rect'];tile=Image.open(ART/r['path']).convert('RGBA')
        im.alpha_composite(repeat(tint(tile,r.get('tone')),(w,h)),(x,y))
    return im


@lru_cache(maxsize=1)
def asset_path_grass():return Image.open(ASSETS.parent/'grass-base.png').convert('RGBA')


def e_prepare(layout):
    layout['e_ground']=True;layout['junction_file']='cobble-large';layout['kerb_turns']=[]
    for r in layout['roads']:
        if r['file']=='street-junction':r['file']='cobble-large'
    return layout


def e_yard(layout,b):
    """A48px fenced rear strip belongs to each1/2-cell frontage."""
    a,_=build_c(b['spec']);x,y,w=b['x'],b['base']-a.height-48,a.width
    if y<480:return
    # Keep wall-service pockets and market access clear. A half-width rear
    # strip is sufficient beside a pocket; no garden paint covers a route.
    for rx,ry,rw,rh in layout.get('clear_routes',[]):
        if y<ry+rh and y+48>ry and x<rx+rw and x+w>rx:
            if x<rx+rw<=x+48:x+=48;w-=48
            elif x+48<=rx<x+w:w=48
    box=[x,y,w,48];layout.setdefault('gardens',[]).append(box);b['yard']=box
    for xx in range(x,x+w,48):layout['props'].append(dict(file='fence-0',x=xx,base=y+24,owner=box))
    layout['props'].append(dict(file='yard-'+str((x//48)%4),x=x,base=y+48,owner=box))


def e_market_repairs(m):
    # Eight mounted signs, on full two-cell shops with the right door clear.
    m['lots']=[b for b in m['lots'] if int(b['id'].rsplit('-',1)[1]) not in (1,2,6,7,9,10)]
    trades=('smith','baker','apothecary','cobbler','inn','scribe','tailor','butcher')
    for row,base in enumerate((864,1392)):
        for i,(x,floors) in enumerate(zip((528,624,720,864),(3,2,3,5) if row==0 else (2,3,2,5))):
            key='rich' if i==3 else 'market';s=e_spec(key,floors,(i+row)%3)
            s['ground_file']='ground-shop-v1-w2-c0'
            s['overlays']=[dict(file='sign-'+trades[row*4+i],x=0,y=(floors-2)*48+16)]
            m['lots'].append(dict(id='trade-'+trades[row*4+i],x=x,base=base,spec=s,footprint=[x,base-96,96,96],entrance=[x+78,base],trade=trades[row*4+i]))
    for i,(x,floors) in enumerate(zip((528,624,720,864),(1,1,1,5))):
        s=e_spec('rich' if i==3 else 'market',floors,i%3)
        if i<3:s['roof_file']='roof-'+('flat' if i==1 else 'ridge')+'-w2-c0';s['roof']='flat' if i==1 else 'ridge'
        m['lots'].append(dict(id='south-house-'+str(i),x=x,base=1920,spec=s,footprint=[x,1824,96,96]))
    # A west return closes the poor block and casts onto the north-south road.
    m['lots'].append(dict(id='west-return',x=96,base=912,spec=dict(view='side',depth=1,width=1,floors=1)))
    m['lots'][-1]['spec']=make_spec(1,2,'door',1,0,'ridge')
    for p in m['props']:
        if p['file']=='guildhall':p['x']=240;p['footprint'][0]=240;p['entrance'][0]=336;p['overhang'][0]=240
        if p['file']=='market-cross':p['x']=816;p['footprint'][0]=816
        if p['file']=='shrine':p.update(x=408,base=1008,footprint=[408,960,48,48],cast_east=True)
        if p['file']=='cart':p.update(x=1120,base=1488,owner=[1104,1440,96,48])
    # Strong, continuous cooler gate route against a warmer lighter square.
    for r in m['roads']:
        if r['file']=='street-junction':r['tone']='square'
        if r['rect'][0]==984 and not r.get('path'):r['tone']='gate-route'
    for base in (864,1392):m['roads'].append(dict(file='cobble-large',rect=[528,base,456,48],tone='square'))
    for b in m['lots']:e_yard(m,b)
    m['features']['yards']='Every new trade/residential frontage has a fenced48px rear strip; adjoining rows plus west return enclose blocks, with48px passages at x816.'
    m['features']['trades']='All8 unscaled64x72 signs mounted over left goods bays of96px shop fronts; right doors and approaches stay clear.'
    m['features']['hierarchy']='Slate-value main route continues from the gate; full-height civic east shade and5-storey main-street houses cast onto individual segments.'
    return e_prepare(m)


def e_layouts():
    old=c_layouts();l=old['L-block'];lots=[]
    # Divide inherited three-cell facades into complete 2+1 cell drawings.
    for b in l['lots']:
        b=json.loads(json.dumps(b));s=b['spec']
        if s.get('width')==3:
            for dx,w in [(0,2),(96,1)]:
                n=json.loads(json.dumps(b));n['id']+=f'-split{w}';n['x']+=dx;n['spec']['width']=w
                n['spec'].pop('roof_overlays',None);lots.append(n)
        else:lots.append(b)
    l['lots']=lots
    for b in lots:
        if b['id']=='north-4':b['spec']=e_spec('market',1,1)
        if b['id']=='east-shop':
            b['spec']=e_spec('craft',1);b['spec']['roof_file']='roof-ridge-w2-c0';b['spec']['roof_colour']=0
        b['footprint']=[b['x'],b['base']-96,48*b['spec'].get('width',2),96]
    l['plot_depth_cells']=[1,2];l['features']['districts']='market inn and craft lane; unchanged A/B/C volume contract'
    # Overhead line owns the reserved passage, not either neighbouring lot.
    e_overlay(l,'washing-line',288,272,[288,240,96,48],overhead=True)
    for file,x,base,lot in [('barrel',522,320,[480,288,96,48]),('crate',488,320,[480,288,96,48]),('cat',266,328,[240,288,48,48]),('district-craft-drying-rack',480,264,[480,216,96,72])]:e_overlay(l,file,x,base,lot)
    # Main market keeps the approved civic/wall anchors and clear gate route.
    market=d_market();market['features']['proxies']='None; A/B/C/D/E production drawings. Round15 comparison only.'
    market['features']['districts']='temple north churchyard; rich square/main-street houses; market south; craft east; poor west edge'
    market['features']['wedge']='one-cell stepped west and south setbacks form wedge blocks at the district edges'
    for b in market['lots']:
        idx=int(b['id'].rsplit('-',1)[1]);key={0:'poor',1:'rich',3:'rich',4:'craft',6:'market',9:'market',10:'poor'}.get(idx)
        if key:
            floors=4 if idx==1 else 3 if idx==3 else 2 if idx in (4,9) else 1
            b['spec']=e_spec(key,floors,1 if idx==9 else 0)
            if idx==1:b['spec']['overlays']=[dict(file='district-rich-banner',x=72,y=8)]
        b['footprint']=[b['x'],b['base']-96,96,96]
    additions=[
      ('district-temple-candles',392,1432,[384,1368,48,72]),

      ('district-craft-drying-rack',1112,1312,[1104,1248,96,96]),
      ('cart',840,1760,[840,1680,96,96]),
      ('barrel',916,1730,[912,1680,48,96]),('crate',920,1760,[912,1680,48,96]),
      ('district-market-scales',808,1532,[792,1488,48,48]),
      ('pigeon',828,1620,[816,1584,48,48]),('cat',96,1376,[96,1344,48,48]),
      ('district-poor-shed',48,1440,[0,1344,144,96]),
      ('washing-line',0,1400,[0,1344,96,96]),
      ('chimney-smoke',556,1064,[528,1056,96,240]),
      ('forge-smoke',1140,1056,[1104,1008,96,240])]
    # Smoke is placed within its owner's painted volume above a B chimney.
    additions=[a for a in additions if a[0] not in ('chimney-smoke','forge-smoke')]
    for f,x,b,lot in additions:e_overlay(market,f,x,b,lot,overhead=f=='washing-line')
    market['roads'].append(dict(file='mud-edge',rect=[0,1392,144,48]))
    heights=old['height-test']
    for i,b in enumerate(heights['lots'][:4]):
        if b['spec'].get('width')==3:
            s=b['spec'];s['width']=2;s['district']='trade-test';s['variant']=1
            # The larger sign hangs from the second-floor beam over the
            # goods bay. The right-hand entrance remains unobstructed.
            s['overlays']=[dict(file='sign-baker' if i==0 else 'sign-smith',x=0,y=168)]
            if 'east_receiver' in b:b['east_receiver'][0]=b['x']+96
        elif i==1:
            b['x']=144;b['east_receiver'][0]=192
    heights['features']['firewall']='4px masonry returns with original B coping/flashing; all fronts now1–2cells'
    # A sign at the L's eastern workshop gives this compact test an
    # actual mounted trade too, with its doorway on the unobstructed right.
    for b in l['lots']:
        if b['id']=='east-shop':
            b['spec']=make_spec(2,2,'shop',1,0,'ridge');b['spec']['overlays']=[dict(file='sign-smith',x=0,y=16)]
    return {'L-block':e_prepare(l),'market':e_market_repairs(market),'height-test':e_prepare(heights)}


def e_district_layout(key):
    """Each district repeats the circulation test with native 1/2-cell lots.

    Roads bend, widen at setbacks, form T/dead-end contacts and a stair-step
    wedge. Painted roof overhangs are separate from two-cell lot footprints.
    """
    layout=dict(size=[768,864],roads=[
      dict(file='street-main',rect=[0,384,384,96],horizontal=True),
      dict(file='street-side',rect=[384,384,384,48],horizontal=True),
      dict(file='street-side',rect=[336,0,48,384]),
      dict(file='street-main',rect=[288,480,96,144]),
      dict(file='street-side',rect=[336,624,48,192]),
      dict(file='street-side',rect=[0,816,384,48],horizontal=True),
      dict(file='street-main',rect=[384,768,384,96],horizontal=True),
      dict(file='street-side',rect=[576,624,48,144]),
      dict(file='street-junction',rect=[288,480,48,144]),
      dict(file='street-junction',rect=[288,576,96,48])],lots=[],props=[],clear_routes=[[336,0,48,816],[0,384,384,96],[576,624,48,144]],gardens=[],features=dict(district=key,T=[7,8],bent=[7,10],dead_end=[12,13],wedge='stepped rear edge at x480/528/576',width_runs_max_cells=8,wall_colours_max=2,roof_colours=1))
    for i,(x,base) in enumerate([(0,384),(96,384),(192,384),(384,384),(480,384),(672,384),(0,816),(96,816),(192,816),(384,768),(480,624),(672,768)]):
        floors=([3,4,5,3,4,3,4,3,4,3,3,4][i] if key=='rich' else [1,2,1,2,1,2,2,1,2,1,2,1][i])
        s=e_spec(key,floors,i%3)
        if i==3 and key=='craft':
            s['roof_overlays']=[dict(file='chimney-0',x=8,y=50),dict(file='forge-smoke',x=6,y=8)]
        if i==3 and key=='market':s['roof_overlays']=[dict(file='chimney-0',x=8,y=50),dict(file='chimney-smoke',x=8,y=8)]
        layout['lots'].append(dict(id=f'{key}-{i}',x=x,base=base,spec=s,footprint=[x,base-96,96,96],entrance=[x+72,base]))
    # Native back gardens are deliberate; street gaps are not roof holes.
    for x in (0,96,192,384,672):
        layout['gardens'].append([x,480,96,96]);layout['props'].append(dict(file='fence-0',x=x,base=504))
        layout['props'].append(dict(file='yard-'+str((x//96)%4),x=x+48,base=552))
    layout['props'].append(dict(file='yard-2',x=240,base=576,cast_east=True,owner=[240,528,48,48]))
    owner=[384,480,96,96]
    prop={'market':'district-market-scales','temple':'district-temple-candles','craft':'district-craft-drying-rack','rich':'district-rich-banner','poor':'district-poor-shed'}[key]
    if key=='rich':layout['lots'][3]['spec']['overlays']=[dict(file='district-rich-banner',x=72,y=8)]
    else:e_overlay(layout,prop,384,568,owner)
    e_overlay(layout,'washing-line',120,616,[120,576,96,48],overhead=True)
    e_overlay(layout,'cat',260,604,[240,576,48,48])
    if key=='poor':
        layout['roads'].append(dict(file='mud-edge',rect=[0,576,288,48]))
        layout['roads'].append(dict(file='lane',rect=[96,480,24,144]))
        layout['props']=[p for p in layout['props'] if not (p['file']=='fence-0' and p['x']==96)]
        e_overlay(layout,'barrel',72,604,[48,576,48,48],cast_east=True)
    # Close the wedge's eastern return and put actual walls beside each road.
    for b in layout['lots']:
        if b['x']==192:
            b['x']=240;b['footprint'][0]=240;b['entrance'][0]=312
        if b['id']==key+'-10':
            # Keep the roof's north edge fixed, shorten the court frontage
            # by one storey, and expose a full48px court before the return.
            b['base']=576;b['footprint'][1]=480;b['entrance'][1]=576
            b['spec']=e_spec(key,1,1)
            b['spec']['roof_file']=f'district-{key}-roof-w2';b['spec']['roof']='ridge'
    s=e_spec(key,1,2)
    s['roof_file']=f'district-{key}-roof-w2';s['roof']='ridge'
    layout['lots'].append(dict(id=key+'-wedge-return',x=480,base=768,spec=s,footprint=[480,672,96,96],entrance=[552,768]))
    # The porch and courtyard arch both face a paved court, connected to
    # the side lane without requiring a roof cutaway to see the approach.
    layout['roads'].append(dict(file='cobble-large',rect=[480,576,96,48]))
    for r in layout['roads']:
        if r['rect']==[576,624,48,144]:r['rect']=[576,576,48,192]
    layout['clear_routes'].extend([[480,576,144,48]])
    layout['clear_routes'].append([384,384,384,48])
    layout['gardens'].append([384,576,96,48])
    for x in (384,432):layout['props'].append(dict(file='fence-0',x=x,base=600))
    layout['features']['wedge']='Southern return closes the stepped block; a deliberate96x48 paved entrance court separates the northern frontage and joins the eastern48px side lane.'
    layout['features']['washing']='Owned passage at x120..216,y576..624; no shed crosses the shirt/trousers/supports.'
    if key=='rich':
        # Tall southern properties need more projected roof space than poor
        # cottages: move their baseline, keeping the owned washing yard clear.
        layout['size'][1]=1008
        for b in layout['lots']:
            if b['base']==816:
                b['base']+=144;b['footprint'][1]+=144;b['entrance'][1]+=144
        for r in layout['roads']:
            if r['rect']==[0,816,384,48]:r['rect'][1]=960
            if r['rect']==[336,624,48,192]:r['rect'][3]=336
        layout['clear_routes'][0]=[336,0,48,960]
    layout['lots']=neighbours(layout['lots'])
    return e_prepare(layout)


def e_entrance_approaches(layout):
    """Audit every declared entrance against final opaque building/prop paint.

    A roof over a physically open route still counts as hidden here. These
    scenes require fully visible48x48 approaches, not unproved cutaways.
    """
    size=tuple(layout['size']);mask=Image.new('L',size)
    for b in layout.get('lots',[]):
        a,_=build_c(b['spec']);layer=Image.new('L',size)
        layer.paste(a.getchannel('A'),(b['x'],b['base']-a.height));mask=ImageChops.lighter(mask,layer)
    for p in layout.get('props',[]):
        a=Image.open(ART/p['path']).convert('RGBA') if p.get('path') else asset(p['file'])
        layer=Image.new('L',size);layer.paste(a.getchannel('A'),(p['x'],p['base']-a.height));mask=ImageChops.lighter(mask,layer)
    if layout.get('joined_l'):
        p=layout['joined_l'];a=joined_l_roof(p.get('colour',0));layer=Image.new('L',size)
        layer.paste(a.getchannel('A'),(p['x'],p['y']));mask=ImageChops.lighter(mask,layer)
    records=[]
    for b in layout.get('lots',[])+layout.get('props',[]):
        if not b.get('entrance'):continue
        x,y=b['entrance'];box=[x-24,y,48,48]
        blocked=sum(v>0 for v in mask.crop((x-24,y,x+24,y+48)).get_flattened_data())
        inside=0<=x-24 and x+24<=size[0] and 0<=y and y+48<=size[1]
        records.append(dict(id=b.get('id',b.get('file')),rect=box,blocked_pixels=blocked,inside_canvas=inside))
    return records


def e_save(im,name,**metadata):
    info=PngImagePlugin.PngInfo()
    for k,v in metadata.items():info.add_text(k,json.dumps(v,sort_keys=True))
    im.save(REVIEW/f'r17-E-{name}.png',pnginfo=info)


def e_compare(im,name):
    refs=[('Round15 / literal1x','round15-street.png'),('Current town / literal1x,24px displayed cells','current-town.png')]
    refs=[(t,Image.open(ART/'reference/r17'/f).convert('RGBA')) for t,f in refs]
    for scale in (1,3):
        a=im.resize((im.width*scale,im.height*scale),NEAREST)
        sheet=Image.new('RGBA',(a.width+max(r.width for _,r in refs)+48,max(a.height+70,sum(r.height+40 for _,r in refs)+30)),(35,39,34,255));d=ImageDraw.Draw(sheet)
        d.text((12,10),f'Round17 E | {name} | {scale}x nearest neighbour',fill='white');sheet.alpha_composite(a,(12,34));y=12
        for title,r in refs:d.text((a.width+36,y),title,fill='white');sheet.alpha_composite(r,(a.width+36,y+22));y+=r.height+40
        d.text((12,a.height+44),'Native A/B/C/D/E. Round15 comparison only. Saved-art review.',fill='white');e_save(sheet,f'critic-{name}-comparison-{scale}x',SceneScale=scale,ReferencesScale=1)


def e_main():
    parser=argparse.ArgumentParser(description='Round17 E native critic and per-file reviews')
    parser.add_argument('--no-sheets',action='store_true');parser.add_argument('--part',choices=['C','D','E'],default='E');args=parser.parse_args()
    if args.part!='E':
        import sys
        sys.argv=[sys.argv[0]]+(['--no-sheets'] if args.no_sheets else [])+(['--part','C'] if args.part=='C' else [])
        return d_main()
    layouts=e_layouts()
    for key in E_DISTRICTS:layouts['district-'+key]=e_district_layout(key)
    placements={}
    for name,layout in layouts.items():
        layout['junction_file']='cobble-large'
        for road in layout['roads']:
            if road['file']=='street-junction':road['file']='cobble-large'
        layout['entrance_approaches']=e_entrance_approaches(layout)
        for approach in layout['entrance_approaches']:
            if approach['blocked_pixels'] or not approach['inside_canvas']:
                raise ValueError(('hidden entrance approach',name,approach))
        im,records=c_render(layout);placements[name]=records
        for scale in (1,3):e_save(im.resize((im.width*scale,im.height*scale),NEAREST),f'critic-{name}-{scale}x',Layout=layout,Placements=records)
        e_save(im.convert('L').convert('RGBA'),f'critic-{name}-squint-1x');e_compare(im,name)
    (REVIEW/'r17-E-scenes.json').write_text(json.dumps(layouts,indent=2));(REVIEW/'r17-E-placements.json').write_text(json.dumps(placements,indent=2))
    if not args.no_sheets:
        import importlib.util
        sp=importlib.util.spec_from_file_location('e_reviews',REVIEW/'r17-E-review.py');mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod);mod.run()
    print('Saved Part E scenes, comparisons and squints.')

if __name__=='__main__':e_main()
