#!/usr/bin/env python3
"""Compose native city17 drawings, extended from the city15 compositor.

    python -B art-drop/out/city17/compose.py
    python -B art-drop/out/city17/compose.py --no-sheets

Creates the 16x12 L-block, irregular market, both tall/low joins, 1x/3x
comparisons and greyscale squint renders. Per-export proofs are delegated to
review/r17-C-review.py. Native drawing registration uses exact mode sampling.
Every building is bottom-left anchored. Facade origin spacing remains 48px.
Spec storeys are bottom-to-top. Parts are drawn ground, storeys, roof, overlays;
standing objects are sorted by base row. End strips reveal only 3 outer pixels.
Corners use the explicit complete-panel assemblies below, never a cut through
a wide drawing. Drawn course strips preserve rows 0/47 across the whole lot.
Part B roofs, joins, firewall and masked shadows are native city17 assets.
Part C adds rear rows, separately lit side returns, corner nodes, fenced
yards and quiet street surfaces. Part D adds native whole civic and market sprites.
Default output is scoped to r17-E review files; --part C/D replays historical parts.
C6 reserves facade receiving margins by documented8x mode registration.
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
    if spec.get('geometric_joins'):
        return 48 if spec['width']>len(spec.get('firewalls',[])) else 4
    return 4 if spec.get('district') else (48 if spec['width']>len(spec.get('firewalls',[])) else 4)


def build(spec, include_roof_overlays=True):
    """Ground, upper floors bottom-to-top, roof, overlays; no asset resampling."""
    width, upper = spec['width']*48, spec['storeys']
    if spec['width'] not in (1,2,3) or not 0 <= len(upper) <= 4: raise ValueError(spec)
    roof_name = spec.get('roof_file') or f"roof-{spec['roof']}-w{spec['width']}-c{spec.get('roof_colour',0)}"
    roof = asset(roof_name); top = spec.get('roof_depth',roof.height//48)*48
    # These explicitly named historical whole-wing studies are only replayed
    # for comparisons. They cannot enter a final C3 front as a roof cap.
    legacy={n+s for n in ('roof-connected-r-w2','roof-rear-wing-r-w2','roof-gable-long-r-w2') for s in ('','-cy1','-cy2')}
    if roof.height not in (96,144) and (roof_name not in legacy or spec.get('geometric_joins')):raise ValueError(('roof cap must be two or three cells; use a separate fill',roof_name,roof.size))
    if top<roof.height or top%48:raise ValueError('roof depth must be whole cells and fit cap')
    im = Image.new('RGBA',(width,top+48*(1+len(upper)))); parts=[]
    def put(name,x,y,crop=None,layer='facade',relight=None):
        piece=asset(name)
        if crop: piece=piece.crop(crop)
        if relight=='east':
            # Relight the drawn stone ramp, preserving every masonry pixel,
            # coping edge and flashing line. East returns face away from sun.
            ramp={(221,202,169):(194,180,152),(194,180,152):(187,167,133),(187,167,133):(160,142,112),(160,142,112):(130,116,95),(130,116,95):(89,78,64)}
            piece=piece.copy();piece.putdata([(*ramp.get(p[:3],p[:3]),p[3]) for p in piece.get_flattened_data()])
        if not (0<=x and 0<=y and x+piece.width<=im.width and y+piece.height<=im.height):
            raise ValueError(('outside lot', name,x,y))
        im.alpha_composite(piece,(x,y))
        parts.append(dict(file=str(asset_path(name).relative_to(ART)),x=x,y=y,crop=crop,layer=layer,relight=relight))
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
            if (ASSETS/(narrow+'.png')).exists():put(narrow,left,y)
            else:
                # Keep a complete 48px window bay from sign-bay panels that
                # have no narrower export. Never slice through a window.
                put(name,left,y,(left,0,right,48),'intact facade bay')
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
        relight='east' if spec.get('geometric_joins') and side=='right' else None
        for dx in range(0,reveal,16):
            sw=min(16,reveal-dx)
            for band,y in enumerate(range(top+4,top+height-4,40)):
                n=min(40,top+height-4-y)
                sx=(band%3)*4 if spec.get('vary_firewall_body') and sw<=4 else 0
                put('firewall-w0',x+dx,y,(sx,4,sx+sw,4+n),'firewall body',relight)
            put('firewall-w0',x+dx,top,(0,0,sw,4),'firewall coping',relight)
            put('firewall-w0',x+dx,top+height-4,(0,44,sw,48),'firewall flashing',relight)
    extra=top-roof.height
    if extra and spec.get('roof_fill_file'):
        fill=asset(spec['roof_fill_file']);split=spec['roof_fill_split']
        if fill.size!=(width,48) or extra%48 or not 0<split<roof.height:raise ValueError('invalid directional roof fill')
        put(roof_name,0,0,(0,0,width,split),'roof north hip/ridge')
        for y in range(0,extra,48):put(spec['roof_fill_file'],0,split+y,layer='directional roof fill')
        put(roof_name,0,split+extra,(0,split,width,roof.height),'roof south hip/eave')
    elif extra:
        if spec['roof']!='ridge':raise ValueError('depth extension requires the south-facing ridge slope')
        # Each approved cap has its own painted tile scale/value field.
        # Complete native two-course adapters carry that field through both
        # interfaces. Repeat six courses per extra cell, without stretching
        # tiles, rotating light, or inserting a generic texture band.
        split,donors=CAP_COURSES[spec['width']]
        donors=spec.get('roof_fill_donors',donors)
        put(roof_name,0,0,(0,0,width,split),'roof ridge')
        for i,y in enumerate(range(0,extra,16)):
            sy=donors[i%len(donors)]
            put(roof_name,0,split+y,(0,sy,width,sy+16),'roof fill adapter')
        put(roof_name,0,extra+split,(0,split,width,roof.height),'roof slope/eave')
    else:put(roof_name,0,0,layer='roof')
    for ret in spec.get('step_returns',[]):
        # Drawn, independently lit corner posts mark the exposed lower step.
        # Their eight-pixel strip occupies only the outer structural post.
        side=ret['side'];name='side-storey-W' if side=='left' else 'side-storey-E'
        sx=0 if side=='left' else 88;dx=0 if side=='left' else width-8
        for y in range(im.height-ret['height'],im.height,48):
            put(name,dx,y,(sx,0,sx+8,min(48,im.height-y)),'exposed step return')
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
    # Precomposited accent exports obey the same receiving-plane contract.
    for o in BAKED_ROOF_ACCENTS.get(roof_name,[]):
        p=asset(o['file'])
        if not any(o['x']>=x0 and o['y']>=y0 and o['x']+p.width<=x1 and o['y']+p.height<=y1 for x0,y0,x1,y1 in receiving_planes(spec)):
            raise ValueError(('baked roof accent crosses receiving plane',roof_name,o))
    return im,parts


BAKED_ROOF_ACCENTS={
    'roof-hip-chimney-c3-w2':[dict(file='chimney-1-c0',x=10,y=38)],
    'roof-hip-dormer-c3-w2':[dict(file='dormer-0-c0',x=12,y=66)],
}

def receiving_planes(spec):
    """Inspected native rectangles wholly within each pitched receiving plane."""
    w=48*spec['width'];h=spec.get('roof_depth',3 if spec['roof']=='hip' else 2)*48
    if spec.get('roof_file') in ('roof-hip-deep-c3-w2',*BAKED_ROOF_ACCENTS):
        return [(3,32,44,104),(53,32,93,104)]
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
        s['shared_flat_left']=False;s['step_returns']=[]
        for other in buildings:
            # Ordinary historical studies retain their same-base contract.
            # C3 uses overlapping property geometry and world-space eaves.
            geometric=s.get('geometric_joins')
            if geometric:
                def north_edge(lot):
                    q=lot['spec'];name=q.get('roof_file') or f"roof-{q['roof']}-w{q['width']}-c{q.get('roof_colour',0)}"
                    return lot['base']-48*(1+len(q['storeys']))-q.get('roof_depth',asset(name).height//48)*48
                # A deep northern roof may meet a neighbour's side even when
                # their front ground footprints do not overlap in screen y.
                if max(north_edge(b),north_edge(other))>=min(b['base'],other['base']):continue
            elif other['base']!=b['base']:continue
            if (s['roof']==other['spec']['roof']=='flat' and len(s['storeys'])==len(other['spec']['storeys'])
                    and other['x']+other['spec']['width']*48==b['x']):s['shared_flat_left']=True
            if other['x']==b['x']+s['width']*48:side='right'
            elif other['x']+other['spec']['width']*48==b['x']:side='left'
            else:continue
            eave=b['base']-48*(len(s['storeys'])+1)
            other_eave=other['base']-48*(len(other['spec']['storeys'])+1)
            height=other_eave-eave if geometric else (len(s['storeys'])-len(other['spec']['storeys']))*48
            if height>0:s['firewalls'].append(dict(side=side,height=height,neighbour=other['id'],eaves=[eave,other_eave]))
            if geometric and b['base']>other['base']:
                s['step_returns'].append(dict(side=side,height=b['base']-other['base'],neighbour=other['id']))
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
    if spec.get('c6'):return c6_build(spec)
    if spec.get('c5'):return c5_build(spec)
    if spec.get('c4'):return c4_build(spec)
    if spec.get('view')=='complete':
        a=asset(spec['file'])
        return a,[dict(file=spec['file'],x=0,y=0,layer='complete connected house')]
    if spec.get('view','front')=='front': return build(spec)
    view=spec['view'];width=spec.get('width',2);floors=spec.get('floors',1)
    if view=='wing':
        node=spec.get('node','corner-outer-L' if spec.get('direction')=='W' else 'corner-outer-R')
        im=c_connected_roof(node).crop((0,0,96,96))
        return im,[dict(file=f'review/r17-C-critic2-connected-{node}.png',x=0,y=0,crop=[0,0,96,96],layer='continuous painted north wing; no repeated gable crop')]
    if view=='back':
        roof_name=spec.get('roof_file') or f'roof-back-w{width}'
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
    wall_names=spec.get('wall_files',wall_names)
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
        if layout.get('r_drawn_casts'):
            paint=repeat(asset('shadow-arcade-r').crop((0,24,60,48)),(a.width+12,24)).crop((0,0,a.width+12,min(24,reach)))
            paint.putalpha(paint.getchannel('A').point(lambda v:v*96//255))
            receivers=[('south drawn eave/support',[x,b['base']-5,*paint.size],paint)]
        else:receivers=[('south',[x,b['base'],a.width,reach],asset(f'shadow-street-w{a.width//48}').crop((0,0,a.width,reach)))]
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
            civic=o['file'].removesuffix('-r') in ('cathedral','guildhall','gatehouse','wall-tower','wall-walk','wall-walk-stair','wall-side','townhall-market')
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
        uv=v;us=f'-v{uv}' if uv else '';u['file']=f'district-{district}-storey{us}-w2'
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
    if layout.get('c3_ground'):return c3_ground(layout)
    size=tuple(layout['size']);im=repeat(asset(layout['ground_base']) if layout.get('ground_base') else context('town_ground'),size)
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
            fronts=['ground-work-w2-c0','ground-shop-w2-c0','ground-shop-v1-w2-c0','ground-shop-v2-w2-c0']
            s['ground_file']=fronts[(i+row)%4]
            left_door=(i+row)%4 in (0,3)
            s['overlays']=[dict(file='sign-'+trades[row*4+i],x=32 if left_door else 0,y=(floors-2)*48-8)]
            s['storeys'][0]['file']='storey-sign-bay-'+('right' if left_door else 'left')+'-w2'
            m['lots'].append(dict(id='trade-'+trades[row*4+i],x=x,base=base,spec=s,footprint=[x,base-96,96,96],entrance=[x+(24 if left_door else 72),base],trade=trades[row*4+i]))
    for i,(x,floors) in enumerate(zip((528,624,720,864),(1,1,1,5))):
        s=e_spec('rich' if i==3 else 'market',floors,i%3)
        if i<3:s['roof_file']='roof-'+['ridge','flat','gable'][i]+'-w2-c0';s['roof']=['ridge','flat','gable'][i]
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
    # R: actual resolved rear cap differs; changing a lower wall is not enough.
    for b in lots:
        if b['id']=='north-rear-3':b['spec']['roof_file']='roof-back-repair-w1'
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
    result={'L-block':e_prepare(l),'market':e_market_repairs(market),'height-test':e_prepare(heights)}
    for layout in result.values():
        for b in layout['lots']:
            s=b['spec']
            if s.get('width')==2 and s.get('storeys'):
                for o in s.get('overlays',[]):
                    if o['file'].startswith('sign-'):
                        o['y']=(len(s['storeys'])-1)*48-8
                        s['storeys'][0]['file']='storey-sign-bay-'+('left' if o['x']==0 else 'right')+'-w2'
    # C4 regression repairs: count repeated upper floors, not just lots.
    for layout in result.values():
        for b in layout['lots']:
            q=b['spec'];w=q.get('width',2)
            q['vary_firewall_body']=True
            if b['id']=='L-corner':q['roof_fill_donors']=[59,75,11,27,43]
            if q.get('view')=='side' and q.get('floors',1)>=4:
                direct=q.get('direction','E');q['wall_files']=['side-ground-'+direct,'side-storey-'+direct,'storey-shuttered-c4-w2','storey-oriel-w2-c0','storey-recessed-c4-w2'][:q['floors']]
            elif q.get('storeys') and len(q['storeys'])>=3:
                for j,u in enumerate(q['storeys']):
                    if j==0 and any(o['file'].startswith('sign-') for o in q.get('overlays',[])):continue
                    u['file']=['storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-oriel-w2-c0'][j%3] if w==2 else ['storey-timber-w'+str(w)+'-c0','storey-plaster-w'+str(w)+'-c0','storey-oriel-w'+str(w)+'-c0'][j%3]
    # Drawn A/B/C fence structures, including closed wickets, retain the
    # original enclosure while the universal placed-instance audit includes it.
    for layout in result.values():
        fence_count={}
        for p in sorted(layout['props'],key=lambda p:(p['file'],p['base'] if p['file']=='fence-0' else p['x'],p['x'] if p['file']=='fence-0' else p['base'])):
            if p['file'] not in ('fence-0','fence-1'):continue
            horizontal=p['file']=='fence-0';key=(horizontal,p['base'] if horizontal else p['x']);i=fence_count.get(key,0);fence_count[key]=i+1
            if i%3:p['file']='fence-'+('h' if horizontal else 'v')+'-'+('b' if i%3==1 else 'c')+'-c4'
    return result


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



# Part R: dense district. All geometry below positions existing native paint.
# Annotation rectangles live only in review sheets, never production images.
def r_front(width, floors, index, district='market', trade=None):
    kinds=['timber','plaster','stone','jetty','timber','stone']
    roof=['gable','ridge','hip','ridge','gable','hip'][index%6]
    s=make_spec(width,floors,['shop','work','door','shop','arch','work'][index%6],index%3,index%2,roof,[kinds[index%6]])
    s['district']=district
    if district=='poor':
        s['roof_file']=f'district-poor-roof'+('' if index%3==0 else f'-v{index%3}')+'-w2' if width==2 else f'roof-ridge-w1-c2'
    if trade:
        ground,dx,signx={
          'baker':('ground-shop-w2-c0',72,0),
          'smith':('ground-work-w2-c0',24,32),
          'apothecary':('ground-shop-v1-w2-c0',72,0),
          'cobbler':('ground-shop-v2-w2-c0',24,32),
          'inn':('inn-front-w2-c0',72,0),
          'scribe':('ground-work-v1-w2-c0',24,32),
          'tailor':('ground-shop-v2-w2-c1',24,32),
          'butcher':('ground-work-v2-w2-c0',24,32)}[trade]
        s['ground_file']=ground
        s['overlays']=[dict(file='sign-'+trade,x=signx,y=(floors-2)*48-8)]
        s['storeys'][0]['file']='storey-sign-bay-'+('left' if signx==0 else 'right')+'-w2'+('-c1' if s['colour']==1 else '')
        s['entrance_dx']=dx
    else:
        # Explicit entrance positions of each complete native frontage.
        s['entrance_dx']=(width*48-24) if s['ground']=='shop' and s['variant'] in (0,1) else 24
    if not trade and width==2 and index%4==1:
        try:s['roof_overlays']=[roof_mount(s,'chimney-1-c0')]
        except ValueError:pass
    return s


def r_city_layout():
    l=dict(size=[1920,1440],ground_base='cobble-small',e_ground=True,junction_file='cobble-large',roads=[],lots=[],props=[],gardens=[],clear_routes=[],features={},square=[720,672,480,384],square_notch=[1104,672,96,96])
    def road(x,y,w,h,kind='street-side',horizontal=False,tone=None,clear=True):
        r=dict(file=kind,rect=[x,y,w,h],horizontal=horizontal)
        if tone:r['tone']=tone
        l['roads'].append(r)
        if clear:l['clear_routes'].append([x,y,w,h])
    # A continuous one-cell inner service route, widened at tower landings.
    road(96,240,1728,48,horizontal=True)
    road(48,288,48,1056);road(1824,240,48,1104)
    road(96,1344,1728,48,horizontal=True)
    for x in (384,768,1152,1536):road(x,240,48,72,clear=False)
    # Destination-led jogs and T junctions; maximum straight width run 8 cells.
    for x,w,y,h in [(96,336,624,96),(432,48,624,144),(480,240,624,48),(1200,192,624,96),(1392,336,624,96),(1728,96,624,144)]:
        road(x,y,w,h,'street-main',True,clear=False)
    road(96,1008,336,48,horizontal=True)
    road(432,1008,288,96,'street-main',True)
    road(1296,1008,192,48,horizontal=True)
    road(1488,1008,336,96,'street-main',True)
    road(432,288,48,336);road(432,720,48,288)
    road(1344,288,48,336);road(1344,720,48,288)
    road(1776,720,48,288);road(1776,1104,48,240)
    # Paved 10x8 square with a two-cell notch; gate route turns into its east edge.
    road(720,672,384,96,'cobble-large',tone='square',clear=False)
    road(720,768,480,288,'cobble-large',tone='square',clear=False)
    road(1104,768,96,288,'street-main',tone='gate-route')
    road(1104,1056,192,96,'street-main',True,'gate-route')
    road(1200,1152,96,288,'street-main',tone='gate-route')
    road(720,672,48,48);road(720,1008,48,48)
    # Half-cell lane joins a one-cell court access and terminates at a door.
    road(288,864,48,144);road(288,840,24,48,'lane',clear=False)
    road(240,816,96,24,'lane',True,clear=False)
    def prop(file,x,base,**kw):l['props'].append(dict(file=file,x=x,base=base,**kw))
    def lot(ident,x,base,s,group,entrance=True):
        a,_=build_c(s);floors=s.get('floors',1+len(s.get('storeys',[])))
        n=dict(id=ident,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-96,a.width,96],painted=[x,base-a.height,a.width,a.height],overhang=[x,base-a.height,a.width,max(0,a.height-96)])
        if entrance and s.get('view','front')=='front':n['entrance']=[x+s.get('entrance_dx',24),base]
        l['lots'].append(n)
        return n
    # Joined north frontages; rear roofs show through changes in height.
    i=0
    for x in range(144,432,96):
        lot('north-west-'+str(i),x,624,r_front(2,[3,4,3][i],i),'north-main');i+=1
    for j,x in enumerate([480,576]):lot('north-mid-'+str(j),x,576,r_front(2,3+j,7+j),'north-secondary')
    for j,x in enumerate([1200,1296,1392,1488,1584,1680]):
        if x==1296:
            lot('north-east-jog',x,624,r_front(1,3,10),'north-main');continue
        lot('north-east-'+str(j),x,624,r_front(2,[4,3,5,3,4,3][j],11+j),'north-main')
    # Forecourt is enclosed by tall merchant houses and the north guild arcade.
    lot('square-baker',720,672,r_front(2,4,19,trade='baker'),'square-north')
    lot('square-narrow',816,672,r_front(1,3,20),'square-north')
    lot('square-smith',1056,672,r_front(1,3,21),'square-north')
    lot('square-apothecary',1104,768,r_front(2,3,22,trade='apothecary'),'square-notch')
    # Side-facing return closes the eastern square without lawns.
    lot('square-east-return',1200,1056,dict(view='side',direction='W',depth=2,width=2,floors=5),'square-east',False)
    lot('east-main-scribe',1296,1008,r_front(1,3,24),'east-main')
    # West craft block; a deliberate two-by-three court is the sole opening.
    lot('west-smith',144,1008,r_front(2,3,25,trade='smith'),'west-craft')
    lot('court-low-wing',240,1008,r_front(1,1,26,'poor'),'west-craft')
    lot('west-cobbler',336,1008,r_front(2,3,27,trade='cobbler'),'west-craft')
    # Three-floor continuous frontage east of a one-cell street.
    for j,x in enumerate([1392,1488,1584,1680]):
        lot('east-craft-'+str(j),x,1008,r_front(2,[3,2,3,2][j],28+j,trade=['scribe',None,'tailor',None][j]),'east-craft')
    # Lower poor edge is confined to the city wall, with continuous frontage.
    for j,x in enumerate([96,144,240,336]):
        if x==96:
            lot('poor-edge-narrow',x,576,r_front(1,2,35,'poor'),'poor-edge');continue
    # Southern rows close every edge of the square and its approach.
    for j,x in enumerate([144,240,336,480,576,672,768,864,960,1056,1296,1392,1488,1584,1680]):
        w=1 if x in (1056,1296) else 2
        floors=[3,2,3,3,4,3,4,3,4,3,3,3,2,3,2][j]
        # Main-square roof starts at or south of1056, preserving the square.
        s=r_front(w,floors,40+j,trade=('inn' if x==768 else 'butcher' if x==960 else None))
        if x in (672,768,864,960,1056):
            s['roof']='ridge' if floors==4 else 'hip';s.pop('roof_file',None)
        lot('south-'+str(j),x,1344,s,'south-main' if 480<=x<=1104 else 'south-side')
    # Actual rear buildings, sorted before the front rows. Two-storey rear
    # closures share no frontal entrance; only roof/upper silhouettes remain.
    rear_index=0
    for base,positions in [(480,[144,240,336,480,576,672,768,864,960,1056,1104,1200,1296,1392,1488,1584,1680]),(912,[144,1392,1488,1584,1680]),(1248,[144,240,336,480,576,672,768,864,960,1056,1296,1392,1488,1584,1680])]:
        for x in positions:
            w=1 if x in (1296,1056) else 2
            if base==480 and x==1296:w=1
            roof=(f'roof-back-w{w}' if rear_index%3==0 else ('roof-back-dormer-w2' if w==2 and rear_index%3==1 else (f'roof-ridge-w{w}-c0' if w==2 else 'roof-back-repair-w1')))
            s=dict(view='back',width=w,floors=2,back='plain' if rear_index%3 else 'stair',roof_file=roof)
            lot('rear-'+str(rear_index),x,base,s,'rear-'+str(base),False);rear_index+=1
    # Native height-test party-wall rule, kept at the four-pixel reveal width.
    front=[b for b in l['lots'] if b['spec'].get('view','front')=='front']
    fixed={b['id']:b for b in neighbours(front)}
    l['lots']=[fixed.get(b['id'],b) for b in l['lots']]
    # Church west, guild north. Grey-brown stone, intact drawn volumes.
    prop('cathedral-r',480,1056,id='cathedral',entrance=[562,1056],footprint=[480,768,240,288],overhang=[480,624,240,144])
    prop('guildhall-r',864,672,id='guildhall',entrance=[960,672],footprint=[864,480,192,192],overhang=[864,272,192,208])
    prop('townhall-market',720,864,id='market-hall',footprint=[720,720,192,144])
    prop('fountain-r',768,1008,id='fountain',footprint=[768,912,96,96])
    prop('market-cross-r',1056,1032,id='market-cross',footprint=[1056,936,48,96])
    # Six sellers stand behind counters. Mask/cutaway examples are reviewed
    # separately; the scene puts heads above the rear edge of each canopy.
    stall_positions=[(936,828),(984,828),(1032,828),(948,948),(996,948),(1044,948)]
    for j,(x,base) in enumerate(stall_positions):
        prop('stall-'+str(j),x,base,id='stall-'+str(j),footprint=[x,base-48,48,48],overhead=[x+2,base-46,44,25],supports=[[x+3,base-21,3,21],[x+42,base-21,3,21]],foreground_mask=[2,2,46,26])
    # Intentionally enclosed churchyard; no grass on any other frontage.
    l['gardens']=[[480,576,240,48],[432,768,48,240],[240,720,96,144]]
    # Narrow churchyard grass lies behind a rail; side route shifts west.
    l['gardens']=[[576,672,144,96],[240,720,96,144]]
    for x in range(576,720,48):prop('fence-0',x,696,owner='churchyard')
    prop('fence-1',704,744,owner='churchyard');prop('fence-0',672,792,owner='churchyard')
    prop('bench-pocket',624,760,id='bench-pocket',owner='churchyard')
    prop('yard-3',576,744,id='churchyard-tub-tree',owner='churchyard')
    prop('person',600,758,path='review/r15-M-clean-folk-b-1.png',id='bench-visitor',role='bench pocket')
    # Inhabited rear court: 96x144, full48px passage to the street.
    prop('court-stair',240,816,id='court-stair',entrance=[258,816],footprint=[240,768,48,48],overhead=[240,720,48,48],supports=[[240,768,6,48],[282,768,6,48]])
    prop('yard-2',288,768,id='court-lean-to',owner='court')
    prop('yard-0',288,816,id='court-well',owner='court')
    prop('yard-1',288,772,id='court-wood-and-wash',owner='court',crop=[0,28,48,48])
    prop('washing-line',240,740,id='court-laundry',overhead=True,owner='court')
    for x in (240,288):prop('fence-0',x,720,owner='court')
    prop('fence-1',320,768,owner='court');prop('fence-1',320,816,owner='court')
    prop('fence-0',240,888,id='court-gate',entrance=[312,864],owner='court-open-gate')
    # Props support destinations, and leave the through route untouched.
    for f,x,b in [('cart',864,912),('crate',916,910),('barrel',890,887),('district-market-scales',1016,868),('cat',268,900),('pigeon',874,1002),('district-craft-drying-rack',1740,1048),('crate',1734,1080),('barrel',1704,1080)]:prop(f,x,b)
    # Existing townsfolk, already drawn and reduced in the native fantasy scale.
    people=[(744,700,0,'passing'),(917,700,1,'entering guild'),(574,1088,2,'entering church'),(864,1010,1,'jug-filler'),(907,888,0,'unloading'),(942,870,2,'browsing'),(1006,874,3,'browsing'),(1068,872,1,'browsing'),(938,984,2,'buying'),(1002,985,0,'buying'),(1082,989,3,'buying'),(1136,900,1,'passing'),(1150,1016,2,'passing'),(1240,1200,0,'passing gate'),(1242,1360,3,'passing gate'),(352,1046,0,'entering shop'),(250,840,2,'at court well'),(292,955,1,'court passage'),(446,924,3,'side street'),(1356,916,2,'side street'),(1504,1047,0,'trader'),(1610,1076,1,'cart handler'),(1788,850,2,'side street'),(200,663,3,'main street'),(340,672,2,'main street'),(1400,666,1,'main street'),(1560,678,0,'main street'),(1748,684,3,'main street'),(200,1378,1,'south street'),(620,1378,0,'south street'),(960,1378,2,'south street'),(1500,1378,3,'south street')]
    for j,(x,b) in enumerate(stall_positions):people.append((x+14,b-39,j%4,'vendor'))
    for j,(x,b,kind,role) in enumerate(people):prop('person',x,b,path=f'review/r15-M-clean-folk-b-{kind}.png',id='person-'+str(j),role=role)
    # Enclosing wall. South uses its already-painted walk top, viewed inward;
    # the tall outward face would incorrectly cover the foreground street.
    for x in range(0,1920,96):
        prop('wall-walk-r' if x//96%2==0 else 'wall-walk-alternate-r',x,240,wall=True)
        if not (1152<=x<1344):prop('wall-walk-r',x,1440,crop=[0,0,96,48],wall=True)
    prop('wall-walk-stair-r',960,240,wall=True,id='north-wall-stair')
    for x in (0,1872):
        for y in range(240,1392,144):prop('wall-side',x,min(y+144,1440),wall=True)
    for x in (0,384,768,1152,1536,1824):prop('wall-tower-r',x,240,wall=True)
    for x in (0,1824):
        for b in (624,1008,1440):prop('wall-tower-r',x,b,wall=True)
    prop('gatehouse-r',1176,1440,id='gatehouse',entrance=[1248,1440],footprint=[1176,1248,144,192],overhang=[1176,1040,144,208],foreground_mask=[24,230,120,338],supports=[[1176,1344,24,96],[1296,1344,24,96]],wall=True)
    prop('wall-walk-stair-r',1000,1440,wall=True,crop=[0,0,184,48])
    # Drawn gate interior has a destination-local phase, retaining both kerbs.
    l['roads'].append(dict(file='gate-approach',path='review/r17-D-critic2-gate-interior.png',rect=[1200,1200,96,240]))
    l['roads'].append(dict(file='gate-threshold',path='review/r17-D-critic2-gate-threshold.png',rect=[1200,1431,96,9]))
    l['features']=dict(grid=48,cells=[40,30],square='10x8 with2x2 northeast notch; church west, guild north, merchant walls east/south',life='six vendors, customers, unloading cart, fountain visitor, inhabited shared rear court',wall='one-cell service route; towers every8cells; south gate reaches square through96px elbow',material='terracotta dominant, two facade colours, neutral civic stone, rare poor repairs',routes='96/48/24 with T, jog, elbow and court termination',conflicts=['BRIEF17 sign dimensions and fixed0/47 course win over panel2 reductions','BRIEF17 street-jog and one/two-cell lot rules retained'])
    r_refine_lots(l)
    r_critic1_refine(l)
    base=json.dumps(l)
    for seed in range(1701,1901):
        c=json.loads(base);r_cycle1(c,seed)
        if not r_legacy_repeat_audit(c)['failures']:return c
    raise ValueError('no colourway seed passes the repeat audit')


RECOLOURED=('roof-connected-r-w2','roof-gable-long-r-w2','roof-gable-deep-r-w2','roof-back-w1','roof-back-w2','roof-back-dormer-w2','roof-back-accent-r-w1','roof-rear-wing-r-w2','roof-corner-r-w2')


def r_cycle1(l,seed=1701):
    """Cycle 1: roof colourways (terracotta ~half, slate, brown shingle) and facade colourways."""
    rng=random.Random(seed);rows={}
    for b in l['lots']:rows.setdefault(b['base'],[]).append(b)
    for base,row in rows.items():
        row.sort(key=lambda b:b['x']);prev=[]
        for b in row:
            s=b['spec']
            for _ in range(20):
                c=rng.choice([0,0,0,0,1,1,2,2])
                if prev[-2:]!=[c,c]:break
            prev.append(c)
            name=s.get('roof_file')
            if s.get('district')=='poor' or (name and name.startswith('district-')):continue
            if name:
                if name.endswith('-c0') and c:s['roof_file']=name[:-1]+str(c)
                elif name in RECOLOURED and c:s['roof_file']=f'{name}-cy{c}'
            else:s['roof_colour']=c
            if s.get('view','front')=='front':
                fc=rng.choice([0,1,2])
                for u in s.get('storeys',[]):
                    if not u.get('file'):u['colour']=fc
    l['gardens']=l.get('gardens',[])+[[0,0,1920,96]]


def r_refine_lots(l):
    # Split complete rear lots into intact one-cell drawings. The alternating
    # 2 | 1+1 | 2 rhythm changes actual facade and roof paint, not aliases.
    out=[];counts={}
    for b in l['lots']:
        spec=b['spec']
        if spec.get('view')!='back':out.append(b);continue
        j=counts.get(b['base'],0);counts[b['base']]=j+1
        if spec['width']==2 and j%3==1 and not (b['base']==480 and b['x']==1392):
            for dx,kind,roof in [(0,'plain','roof-back-repair-w1'),(48,'stair','roof-back-w1')]:
                n=json.loads(json.dumps(b));n['id']+='-split'+str(dx//48);n['x']+=dx
                n['spec'].update(width=1,back=kind,roof_file=roof)
                n['footprint']=[n['x'],n['base']-96,48,96];out.append(n)
        else:
            spec['back']='plain' if j%3==0 else 'stair'
            spec['roof_file']=('roof-back-w2' if j%3==0 else 'roof-back-dormer-w2') if spec['width']==2 else ('roof-back-repair-w1' if j%2 else 'roof-back-w1')
            out.append(b)
    l['lots']=out
    for b in out:
        if b['id'] in ('north-east-3','south-8'):
            b['spec']['roof']='gable';b['spec'].pop('roof_file',None);b['spec'].pop('roof_overlays',None)
        # Church entry is at562,1056. The neighbour's cap must begin south
        # of its48px approach; this house uses three storeys and a96px cap.
        if b['id']=='south-4':
            b['spec']['storeys']=b['spec']['storeys'][:2]
            b['spec']['roof']='ridge'
        if b['id']=='north-mid-1':b['spec']['storeys']=b['spec']['storeys'][:2]
        if b['spec'].get('view')=='back' and b['base']==480 and b['x'] in (144,576,768,960,1488,1680):
            b['spec']['roof_file']=f"roof-gable-w{b['spec']['width']}-c0"
    # Roofs behind the apothecary close its enclosed block down to its cap.
    for b in out:
        if b['id'].startswith('rear-') and b['base']==480 and b['x']==1104:
            b['base']=528;b['spec']['floors']=3
    for b in out:
        if b['spec'].get('view')=='back' and b['base']==1248 and 480<=b['x']<624:b['base']=1296
    out=[b for b in out if not (b['id']=='south-10' or (b['spec'].get('view')=='back' and b['x']==1296 and b['base']>=1248))]
    for b in out:
        if b['id']=='south-4':b['spec']['roof_file']='roof-back-dormer-w2'
        if b['id']=='rear-13':b['spec']['back']='plain'
        if b['id']=='square-east-return':b['entrance']=[1256,1056]
        a,_=build_c(b['spec']);b['painted']=[b['x'],b['base']-a.height,a.width,a.height];b['footprint']=[b['x'],b['base']-96,a.width,96];b['overhang']=[b['x'],b['base']-a.height,a.width,max(0,a.height-96)]
    # Re-evaluate firewalls after height edits.
    fronts=neighbours([b for b in out if b['spec'].get('view','front')=='front'])
    mapping={b['id']:b for b in fronts}
    l['lots']=[mapping.get(b['id'],b) for b in out]


def r_prop_image(p):
    a=Image.open(ART/p['path']).convert('RGBA') if p.get('path') else asset(p['file'])
    return a.crop(tuple(p['crop'])) if p.get('crop') else a


def r_critic1_refine(l):
    """Critic R1: connected volumes, physical service lanes and civic details."""
    # The west interval towers occupy x0..95. The lane is beside that real
    # silhouette, not declared to pass through it. Relocate the narrow house.
    for b in l['lots']:
        if b['id']=='poor-edge-narrow':b.update(x=1104,base=1344,frontage_group='south-side')
        if b['id']=='rear-10-split0':
            b['spec'].update(back='stair',roof_file='roof-back-w1')
    for r in l['roads']:
        if r['rect']==[48,288,48,1056]:r['rect']=[96,240,48,1152]
        if r['rect']==[1824,240,48,1104]:r['rect']=[1776,240,48,1152]
    l['clear_routes']=[[96,240,48,1152] if r==[48,288,48,1056] else [1776,240,48,1152] if r==[1824,240,48,1104] else r for r in l['clear_routes']]
    # Replace back-cap/front-cap collisions with a single deep roof. Its
    # constituent planes come from one drawing, or from native B pitch courses.
    replacements={
        'north-west-0':('roof-connected-r-w2',None),
        'north-west-1':('roof-hip-w2-c0',None),
        'north-west-2':('roof-gable-long-r-w2',None),
        'north-mid-0':('roof-ridge-w2-c0',3),
        'north-mid-1':('roof-hip-w2-c0',None),
        'north-east-0':('roof-hip-w2-c0',None),
        'north-east-3':('roof-connected-r-w2',None),
        'north-east-4':('roof-hip-w2-c0',None),
        'north-east-5':('roof-ridge-w2-c0',4),
        'east-craft-0':('roof-hip-w2-c0',None),
        'east-craft-1':('roof-connected-r-w2',None),
        'east-craft-2':('roof-ridge-w2-c0',3),
        'east-craft-3':('roof-connected-r-w2',None),
        'square-baker':('roof-connected-r-w2',None),
        'square-narrow':('roof-ridge-w1-c0',5),
        'square-smith':('roof-ridge-w1-c0',5),
        'square-apothecary':('roof-connected-r-w2',None),
    }
    for b in l['lots']:
        if b['id'].startswith('south-'):
            s=b['spec'];n=len(s.get('storeys',[]))+1
            if s.get('width')==2 and n<4:
                j=int(b['id'].split('-')[1])
                replacements[b['id']]=('roof-connected-r-w2' if j%2 else 'roof-gable-long-r-w2',None) if n==2 else [('roof-hip-w2-c0',None),('roof-gable-deep-r-w2',None),('roof-ridge-w2-c0',3)][j%3]
    deep=[]
    for b in l['lots']:
        if b['id'] in replacements:
            name,depth=replacements[b['id']];s=b['spec'];s['roof_file']=name;s.pop('roof_overlays',None);s.pop('roof_depth',None)
            if depth:s['roof']='ridge';s['roof_depth']=depth
            a,_=build_c(s);deep.append((b['x'],b['x']+a.width,b['base']-a.height,b['base']-48*(1+len(s['storeys']))))
    # Remove completely covered rear buildings rather than count invisible
    # caps as independent houses. Partial rear returns retain explicit walls.
    kept=[]
    for b in l['lots']:
        a,_=build_c(b['spec']);x=b['x'];y=b['base']-a.height
        covered=b['spec'].get('view')=='back' and any(lx<=x and x+a.width<=rx and top<=y and eave>=b['base'] for lx,rx,top,eave in deep)
        if not covered:kept.append(b)
    l['lots']=kept
    # No thin-scale repair cap abuts an older coarse tile plane in this city.
    # Use the original native pitch and optional original dormer instead.
    for b in l['lots']:
        if b['spec'].get('roof_file')=='roof-back-repair-w1':b['spec']['roof_file']='roof-back-accent-r-w1'
        if b['spec'].get('view')=='back' and b['spec'].get('roof_file','').startswith('roof-gable'):
            b['spec']['roof_file']=f"roof-back-w{b['spec']['width']}"
    # Complete court closure replaces the former detached stair panel/shed.
    remove={'court-stair','court-lean-to','court-wood-and-wash'}
    l['props']=[p for p in l['props'] if p.get('id') not in remove and not(p.get('owner')=='court' and p['file']=='fence-0')]
    l['props'].append(dict(file='court-closure-r',x=240,base=816,id='court-closure',entrance=[272,816],footprint=[240,720,96,96],overhang=[240,672,96,48]))
    for p in l['props']:
        if p.get('id')=='court-well':p['base']=856
        if p.get('id')=='court-laundry':p['base']=748
        if p.get('id')=='market-hall':p['file']='townhall-market-r'
        if p.get('id')=='guildhall':p['entrance']=[951,672]
    l['props'].append(dict(file='guildhall-entry-r',x=935,base=672,id='guildhall-public-entry',layer=2,footprint=[935,656,32,16]))
    # Same stone texture continues through the portal. Only a locally drawn
    # recess shadow changes its value, never a blue rectangular infill.
    l['roads']=[r for r in l['roads'] if r['file'] not in ('gate-approach','gate-threshold')]
    l['roads'].append(dict(file='gate-road-r',path='out/city17/gate-road-r.png',rect=[1200,1200,96,240]))
    # Split the south service route around the gate's structural footings.
    l['clear_routes']=[r for r in l['clear_routes'] if r!=[96,1344,1728,48]]
    for rect in [[96,1344,1056,48],[1152,1248,48,144],[1152,1248,240,48],[1344,1248,48,144],[1344,1344,480,48]]:
        l['roads'].append(dict(file='street-side',rect=rect,horizontal=rect[2]>rect[3]));l['clear_routes'].append(rect)
    for b in l['lots']:
        a,_=build_c(b['spec']);b['painted']=[b['x'],b['base']-a.height,a.width,a.height];b['footprint']=[b['x'],b['base']-96,a.width,96];b['overhang']=[b['x'],b['base']-a.height,a.width,max(0,a.height-96)]
        if b.get('entrance'):b['entrance']=[b['x']+b['spec'].get('entrance_dx',24),b['base']]
    # Recompute party-wall reveals after changing cap depths.
    front=neighbours([b for b in l['lots'] if b['spec'].get('view','front')=='front']);mapping={b['id']:b for b in front}
    l['lots']=[mapping.get(b['id'],b) for b in l['lots']]


def r_shadow_layer(l):
    """Painted arcade/support casts, masked only by actual opaque receivers."""
    base=json.loads(json.dumps(l));base['props']=[];base['r_drawn_casts']=True
    shade,records=c_shadow_layer(base)
    occupied=Image.new('L',tuple(l['size']))
    for b in l['lots']:
        a,_=build_c(b['spec']);q=Image.new('L',occupied.size);q.paste(a.getchannel('A'),(b['x'],b['base']-a.height));occupied=ImageChops.lighter(occupied,q)
    for p in l['props']:
        if p['file']=='person':continue
        a=r_prop_image(p);q=Image.new('L',occupied.size);q.paste(a.getchannel('A'),(p['x'],p['base']-a.height));occupied=ImageChops.lighter(occupied,q)
    casts=Image.new('RGBA',tuple(l['size']));drawn=asset('shadow-arcade-r')
    def put(paint,x,y,ident,opacity=96):
        paint=paint.copy();paint.putalpha(paint.getchannel('A').point(lambda a:a*opacity//255));layer=Image.new('RGBA',casts.size);layer.alpha_composite(paint,(x,y));casts.alpha_composite(layer);records.append(dict(id=ident,receiver=[x,y,*paint.size],drawing='shadow-arcade-r',opacity=opacity))
    for p in l['props']:
        if p['file']=='person' or p['file'].startswith('fence') or p.get('crop'):continue
        a=r_prop_image(p);x,y=p['x'],p['base']-a.height;name=p.get('id',p['file'])
        if name=='guildhall':put(drawn,x+4,p['base']-28,name)
        elif name=='market-hall':
            # Six supports use the same drawn contact/cast, at their actual feet.
            bay=drawn.crop((0,0,60,48))
            for sx in (5,35,66,97,128,159):put(bay.crop((0,0,32,48)),x+sx,p['base']-28,name)
        elif p['file'] in ('bench-pocket','cart','crate','barrel'):
            # Tight feet/wheel contact, attached diagonal cast, no bbox stripe.
            foot=drawn.crop((174,26,192,48))
            for sx in ([8,30] if p['file']=='bench-pocket' else [8,max(8,a.width-18)]):put(foot,x+sx,p['base']-6,name,80)
        elif p.get('wall') or name in ('cathedral','fountain','market-cross'):
            # Retain the approved east silhouette cast. No south rectangle.
            east=asset('shadow-street-w3').crop((12,0,132,32)).transpose(Image.Transpose.ROTATE_90)
            reach=min(30,max(6,a.height//12));layer=Image.new('RGBA',casts.size)
            for yy in range(a.height):
                bb=a.crop((0,yy,a.width,yy+1)).getbbox()
                if bb:layer.paste(east.crop((0,yy%east.height,reach,yy%east.height+1)),(x+bb[2],y+yy))
            casts.alpha_composite(layer)
            # Native diagonal support paint touches the lowest silhouette.
            for sx in range(0,a.width,48):put(drawn.crop((0,24,48,48)),x+sx,p['base']-6,name,80)
    casts.putalpha(ImageChops.multiply(casts.getchannel('A'),ImageChops.invert(occupied)));shade.alpha_composite(casts)
    return shade,records


def r_render(l,reveal=False):
    im=c4_ground(l) if l.get('c4_ground') else e_ground(l);ordered=[];records=[]
    # Native shadow paint follows the building base and exposed east face.
    shade,shadow_records=r_shadow_layer(l);im.alpha_composite(shade)
    if l.get('c4_ground'):
        for p in l['props']:
            if p.get('id')=='market-hall':
                a=asset('hall-shade-c4').copy();a.putalpha(a.getchannel('A').point(lambda v:v*77//255));im.alpha_composite(a,(p['x']+24,p['base']-36))
            if p.get('id')=='gatehouse':
                a=asset('hall-shade-c4').crop((24,0,120,18));a.putalpha(a.getchannel('A').point(lambda v:v*77//255));im.alpha_composite(a,(1200,1404))
    for b in l['lots']:
        a,parts=build_c(b['spec']);x=b['x'];y=b['base']-a.height
        if reveal and b.get('foreground_mask'):
            a=a.copy();a.paste((0,0,0,0),tuple(b['foreground_mask']))
        if min(x,y)<0 or x+a.width>im.width or b['base']>im.height:raise ValueError(('off canvas',b['id']))
        ordered.append((b['base'],0,x,y,a,b['id']))
        records.append(dict(id=b['id'],painted=[x,y,a.width,a.height],footprint=b['footprint'],entrance=b.get('entrance'),overhang=b.get('overhang'),parts=parts))
    for p in l['props']:
        a=c4_owned_prop(l,p)
        if reveal and p.get('foreground_mask'):
            a=a.copy();a.paste((0,0,0,0),tuple(p['foreground_mask']))
        # Curtain owns the background; projecting towers own the contact.
        # X sorting must never paint a curtain across a same-row tower.
        priority=p.get('layer',1)
        if p.get('wall'):
            priority=3 if 'tower' in p['file'] or p.get('id')=='gatehouse' else 2 if p.get('attachment') else -1
        ordered.append((p.get('sort_base',p['base']),priority,p['x'],p['base']-a.height,a,p.get('id',p['file'])))
    for base,z,x,y,a,ident in sorted(ordered,key=lambda t:(t[0],t[1],t[2])):
        im.alpha_composite(a,(x,y))
    return im,records,shadow_records


def c4_owned_prop(l,p):
    """Cut curtains back to projecting towers even across unequal base rows."""
    a=r_prop_image(p)
    if p.get('assembly_cutouts'):
        a=a.copy()
        for box in p['assembly_cutouts']:a.paste((0,0,0,0),tuple(box))
    if not p.get('wall') or p.get('attachment') or 'tower' in p['file'] or p.get('id')=='gatehouse':return a
    a=a.copy();x,y=p['x'],p['base']-a.height;alpha=a.getchannel('A')
    for t in l['props']:
        if not t.get('wall') or not ('tower' in t['file'] or t.get('id')=='gatehouse'):continue
        b=r_prop_image(t);tx,ty=t['x'],t['base']-b.height
        if x>=tx+b.width or x+a.width<=tx or y>=ty+b.height or y+a.height<=ty:continue
        owned=Image.new('L',a.size);owned.paste(b.getchannel('A'),(tx-x,ty-y));alpha=ImageChops.subtract(alpha,owned)
    a.putalpha(alpha);return a


def r_resolved_assets(b):
    s=b['spec'];w=s.get('width',2);view=s.get('view','front');out={}
    if view=='front':
        out['ground']=s.get('ground_file') or ground_name(s)
        out['roof']=s.get('roof_file') or f"roof-{s['roof']}-w{w}-c{s.get('roof_colour',0)}"
        if s.get('roof_fill_file'):out['roof-fill']=s['roof_fill_file']
        for i,f in enumerate(s['storeys']):out['storey-'+str(i)]=f.get('file') or f"storey-{f['kind']}-w{w}-c{f['colour']}"
    elif view=='back':
        out['roof']=s.get('roof_file') or f'roof-back-w{w}'
        out['ground']=f"back-{'plain-ground' if s.get('back','plain')=='plain' else 'stair'}-w{w}"
        for i in range(s.get('floors',1)-1):out['storey-'+str(i)]=f"back-{s.get('back','plain')}-w{w}"
    elif view=='complete':out['complete']=s['file']
    else:
        _,parts=build_c(s)
        for p in parts:
            if p['layer'] in ('roof','wall'):out[p['layer']+str(p['y'])]=p['file']
    return out


def r_legacy_repeat_audit(layout):
    from collections import Counter,defaultdict
    rows=defaultdict(list);fail=[];windows=0
    for b in layout['lots']:rows[b['base']].append(b)
    for base,row in rows.items():
        row.sort(key=lambda b:b['x'])
        for start in range(max(1,len(row)-4)):
            run=row[start:start+5]
            if len(run)<3:continue
            allpieces=[]
            for b in run:
                owned={}
                for name in r_resolved_assets(b).values():
                    a=asset(name);h=hashlib.sha256(a.tobytes()+str(a.size).encode()).hexdigest();owned[h]=name
                allpieces.extend((h,n,b['id']) for h,n in owned.items())
            for h,cnt in Counter(p[0] for p in allpieces).items():
                if cnt>2:fail.append(dict(base=base,layer='any resolved floor or cap',run=[b['id'] for b in run],pieces=[p[1:] for p in allpieces if p[0]==h],count=cnt))
            windows+=1
            layers=set().union(*(r_resolved_assets(b) for b in run))
            for layer in sorted(layers):
                pieces=[]
                for b in run:
                    name=r_resolved_assets(b).get(layer)
                    if name:
                        a=asset(name);pieces.append((hashlib.sha256(a.tobytes()+str(a.size).encode()).hexdigest(),name,b['id']))
                counts=Counter(p[0] for p in pieces);windows+=1
                for h,c in counts.items():
                    if c>2:fail.append(dict(base=base,layer=layer,run=[b['id'] for b in run],pieces=[p[1:] for p in pieces if p[0]==h],count=c))
    return dict(windows=windows,failures=fail)


def r_main():
    l=r_city_layout()
    audit=r_repeat_audit(l)
    if audit['failures']:raise ValueError(('repeated resolved piece',audit['failures']))
    im,records,shadows=r_render(l)
    im.save(REVIEW/'r17-city-final.png')
    im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png')
    im.convert('L').save(REVIEW/'r17-R-city-squint-1x.png')
    refs=[('TODAY / literal1x /24px screenshot cells',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / literal1x /48px cells',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('ROUND17 / literal1x /48px cells',im)]
    sheet=Image.new('RGBA',(sum(a.width for _,a in refs)+64,max(a.height for _,a in refs)+48),(35,39,34,255));d=ImageDraw.Draw(sheet);x=16
    for title,a in refs:d.text((x,10),title,fill='white');sheet.alpha_composite(a,(x,32));x+=a.width+16
    sheet.save(REVIEW/'r17-city-final-vs-r15-vs-today.png')
    (REVIEW/'r17-R-city-layout.json').write_text(json.dumps(l,indent=2))
    (REVIEW/'r17-R-city-placements.json').write_text(json.dumps(dict(paint=records,shadows=shadows),indent=2))
    from collections import Counter
    hist=Counter(b['spec'].get('floors',len(b['spec'].get('storeys',[]))+1) for b in l['lots'])
    audit=r_repeat_audit(l)
    print(json.dumps(dict(buildings=len(l['lots']),storeys=dict(hist),repeat=audit),indent=2))
    (REVIEW/'r17-R-layout-audit.json').write_text(json.dumps(dict(buildings=len(l['lots']),storeys=dict(hist),repeat=audit),indent=2))


# Cycle 3 is a fresh street/plot plan. R/E studies above stay replayable.
def c3_front(width,floors,index,roof=None,trade=None,poor=False):
    s=r_front(width,floors,index,'poor' if poor else 'market',trade)
    s.pop('roof_depth',None);s.pop('roof_overlays',None)
    s['roof_colour']=2 if poor else 0
    s['geometric_joins']=True
    s['colour']=index%2
    kind=['timber','plaster','stone','jetty','plaster','stone','timber'][index%7]
    for u in s['storeys']:
        u['kind']=kind;u['colour']=s['colour']
    if width==2 and not trade and not poor:
        s['ground_file']='ground-'+['baker','smith','apothecary','cloth','potter'][index%5]+'-c3-w2'
        s['entrance_dx']=[76,18,48,20,76][index%5]
    if trade in ('baker','smith'):
        s['ground_file']='ground-'+trade+'-c3-w2';s['entrance_dx']=76 if trade=='baker' else 18
    if roof:
        s['roof_file']=roof
        if roof.startswith('roof-hip-'):s['roof']='hip'
        elif roof.startswith('roof-gable-'):s['roof']='gable'
        elif roof.startswith('roof-ridge-'):s['roof']='ridge'
    elif not poor:
        s['roof_file']=f"roof-{['gable','hip','ridge'][index%3]}-w{width}-c0"
    return s


def c3_city_layout():
    old=r_city_layout()
    l=dict(size=[1920,1440],ground_base='cobble-c3',c3_ground=True,e_ground=True,roads=[],lots=[],props=[],gardens=[[576,672,144,96],[240,912,96,96]],clear_routes=[],square=[720,672,480,384],square_notch=[1104,672,96,96],features={})
    def road(rect,kind='side',clear=True,ident=None):
        l['roads'].append(dict(rect=rect,file={'main':'street-main-c3','side':'street-side-c3','lane':'lane-c3','square':'cobble-c3'}[kind],horizontal=rect[2]>rect[3],id=ident,kind=kind,clear=clear))
        if clear:l['clear_routes'].append(rect)
    def add(ident,x,base,s,group,entrance=True):
        a,_=build_c(s)
        b=dict(id=ident,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-96,a.width,96],painted=[x,base-a.height,a.width,a.height],overhang=[x,base-a.height,a.width,max(0,a.height-96)])
        if entrance:b['entrance']=[x+s.get('entrance_dx',24),base]
        l['lots'].append(b);return b
    def prop(file,x,base,**kw):l['props'].append(dict(file=file,x=x,base=base,**kw))
    # Continuous service lane is inside the actual tower silhouettes.
    for rect in [[96,240,1728,48],[96,288,48,1056],[1776,288,48,1056],[96,1344,1056,48],[1344,1344,480,48]]:road(rect,ident='wall-service')
    for x in (432,672,864,1104,1344,1584):road([x,240,48,96],ident='wall-service-bay')
    road([96,672,96,48],ident='wall-service-bay')
    # West main street bends around a stepped, wedge-shaped block. Each
    # ninety-six-pixel reach changes width/alignment at a destination.
    for rect in [[144,576,96,192],[144,624,192,96],[240,672,288,96],[432,576,96,192],[480,576,240,96]]:road(rect,'main',True,'bent-west-market-road')
    road([672,576,48,96],ident='civic-T');road([720,624,384,48],clear=False,ident='civic-front')
    for rect in [[432,288,48,336],[432,768,48,288],[672,288,48,288]]:road(rect,ident='west-T')
    # East main street climbs in three steps. A one-cell passage cuts the
    # north block; its inner24px is the lane, its shoulders are paved.
    for rect in [[1200,624,384,96],[1344,576,144,144],[1488,672,288,96],[1488,624,144,144]]:road(rect,'main',True,'bent-east-market-road')
    road([1344,288,48,288]);road([1584,288,48,384],ident='north-through-alley');road([1596,288,24,384],'lane',False,'north-alley-centre')
    # Square has one stone phase shared with the gate lane: no rectangular
    # tone panels at junctions. The notch remains a built apothecary lot.
    road([720,672,384,96],'square',False);road([720,768,480,288],'square',False)
    for rect in [[1104,768,96,288],[1104,1056,384,96],[1200,1152,96,288]]:road(rect,'main',ident='gate-to-square')
    road([1488,1056,288,48],ident='inn-to-east');road([1776,768,48,288])
    # Court passage, western square exit and southern alleys.
    for rect in [[288,864,48,144],[96,1008,336,48],[432,1008,288,96],[432,1104,48,240],[1632,1104,48,240]]:road(rect)
    road([288,840,24,48],'lane',False);road([240,816,96,24],'lane',False)
    for rect in [[1152,1248,48,144],[1152,1248,240,48],[1344,1248,48,144]]:road(rect,ident='gate-wall-bypass')
    # One main idea per house; a single roof hue continues over every wing.
    west=[(144,576,3,'roof-hip-short-chimney-c3-w2'),(240,624,4,'roof-gable-w2-c0'),(336,672,3,'roof-hip-dormer-c3-w2')]
    for j,(x,b,n,r) in enumerate(west):add('C3-west-wedge-'+str(j),x,b,c3_front(2,n,j,r),'west-wedge')
    add('C3-west-rear',336,432,dict(view='back',width=2,floors=1,back='stair',roof_file='roof-back-chimney-c3-w2'),'west-wedge-rear',False)
    for j,(x,n,r) in enumerate([(480,3,'roof-hip-w2-c0'),(576,4,'roof-ridge-w2-c0')]):add('C3-north-middle-'+str(j),x,576,c3_front(2,n,7+j,r),'north-middle')
    # Civic frame keeps its established public approaches and human scale.
    for b in old['lots']:
        if b['id'] not in ('square-baker','square-narrow','square-smith','square-apothecary','square-east-return','west-smith','west-cobbler'):continue
        s=b['spec'];s.pop('roof_depth',None);s.pop('roof_overlays',None)
        if b['id']=='square-baker':s=c3_front(2,4,19,'roof-hip-chimney-c3-w2',trade='baker')
        if b['id']=='square-narrow':s=c3_front(1,3,20,'roof-gable-w1-c0')
        if b['id']=='square-smith':s=c3_front(1,2,21,'roof-ridge-w1-c0')
        if b['id']=='square-apothecary':s=c3_front(2,3,22,'roof-hip-deep-c3-w2',trade='apothecary')
        if b['id']=='west-smith':s=c3_front(2,2,25,'roof-hip-w2-c0',trade='smith')
        if b['id']=='court-low-wing':s=c3_front(1,1,26,'roof-ridge-w1-c2',poor=True)
        if b['id']=='west-cobbler':s=c3_front(2,3,27,'roof-ridge-w2-c0',trade='cobbler')
        made=add(b['id'],b['x'],b['base'],s,b['frontage_group'],bool(b.get('entrance')))
        if s.get('view')=='side' and b.get('entrance'):made['entrance']=b['entrance']
    # Rear closures use a single native cap each; none stretches beside the hall.
    for j,x in enumerate([816]):add('C3-civic-rear-'+str(j),x,480,dict(view='back',width=1,floors=2,back='plain' if j else 'stair',roof_file='roof-back-dormer-c3-w1' if j else 'roof-back-w1'),'civic-rear',False)
    for j,(x,w,b,n,r) in enumerate([(1200,2,624,4,'roof-hip-w2-c0'),(1296,1,624,2,'roof-hip-w1-c0'),(1392,2,576,3,'roof-gable-w2-c0'),(1488,2,624,5,'roof-ridge-w2-c0'),(1632,1,672,3,'roof-hip-w1-c0'),(1680,2,672,4,'roof-hip-deep-c3-w2')]):
        add('C3-north-east-'+str(j),x,b,c3_front(w,n,31+j,r),'east-trapezoid')
    for j,(x,w,b) in enumerate([(1296,1,432),(1632,1,480)]):add('C3-east-rear-'+str(j),x,b,dict(view='back',width=w,floors=1,back='plain',roof_file='roof-back-dormer-c3-w1' if j else 'roof-back-w1'),'east-rear',False)
    # Gate-road inn: joined four-cell frontage and a courtyard with its own
    # stable. All entrances face the public route or its open yard passage.
    add('C3-gate-inn',1296,1056,c3_front(2,4,44,'roof-hip-w2-c0',trade='inn'),'inn-gate-road')
    wing=c3_front(2,3,45,'roof-hip-dormer-c3-w2');wing.update(ground_file='ground-door-v1-w2-c0',entrance_dx=72)
    add('C3-inn-east-wing',1392,1056,wing,'inn-gate-road')
    add('C3-inn-stable',1488,864,dict(view='complete',file='stable-c3',width=2,floors=2),'inn-stable')
    for j,(x,b,n,r) in enumerate([(1584,1008,3,'roof-hip-w2-c0'),(1680,1056,4,'roof-gable-w2-c0')]):add('C3-east-return-'+str(j),x,b,c3_front(2,n,48+j,r,trade='tailor' if j==0 else 'scribe'),'inn-east-return')
    l['courts']=[dict(id='inn-court',rect=[1488,864,96,144],access=[1488,1008,96,48],stable='C3-inn-stable',inn='C3-gate-inn')]
    road([1488,864,96,192],'side',False,'inn-court-access')
    # The southern fronts form a stepped L rather than a full horizontal slab.
    southern=[(144,1296,2,'roof-hip-w2-c0'),(240,1344,3,'roof-gable-deep-r-w2'),(336,1344,2,'roof-hip-chimney-c3-w2'),(480,1344,3,'roof-ridge-w2-c0'),(576,1344,3,'roof-ridge-dormer-c3-w2'),(672,1344,4,'roof-ridge-w2-c0'),(768,1344,3,'roof-hip-w2-c0'),(864,1344,4,'roof-gable-w1-c0'),(960,1344,3,'roof-hip-w2-c0')]
    for j,(x,b,n,r) in enumerate(southern):add('C3-south-'+str(j),x,b,c3_front(1 if x in (672,864) else 2,n,54+j,'roof-ridge-w1-c0' if x==672 else r,trade='butcher' if x==960 else None),'south-L' if x<480 else 'square-south')
    road([720,1056,48,336],ident='square-west-exit')
    road([912,1056,48,336],ident='square-through-alley');road([924,1056,24,336],'lane',False,'square-alley-centre')
    for j,x in enumerate([1056,1104]):add('C3-south-narrow-'+str(j),x,1344,c3_front(1,2,64+j,'roof-ridge-w1-c0' if j else 'roof-hip-w1-c0'),'south-gate')
    for j,(x,w,n) in enumerate([(1392,2,2),(1488,2,2),(1584,1,2),(1680,2,2)]):
        add('C3-wall-poor-'+str(j),x,1344,c3_front(w,n,69+j,f'roof-'+('hip' if j==1 else 'ridge')+f'-w{w}-c2',poor=True),'poor-wall')
    road([1644,1104,24,240],'lane',False,'south-through-alley')
    # Retain civic/market/court paint and purposeful people; reposition people
    # affected by the replaced street geometry, rather than leave hidden actors.
    for p in old['props']:
        if p.get('wall') or p.get('id')=='churchyard-tub-tree' or (p.get('file')=='person' and p.get('role') in ('main street','south street','side street','trader','cart handler')):continue
        if p.get('file')=='district-craft-drying-rack' or (p['file'] in ('crate','barrel') and p['x']>1600):continue
        l['props'].append(p)
    # The recess behind the civic tower is an enclosed paved service yard,
    # rather than an unexplained hole in the block's roof mass.
    for x in (864,912,960,1008):prop('fence-0',x,360 if x==864 else 312,owner='guild-rear-yard')
    for b in (336,384,432,480):prop('fence-1',1040,b,owner='guild-rear-yard')
    prop('yard-1',872,416,owner='guild-rear-yard')
    l['courts'].append(dict(id='guild-service-yard',rect=[864,288,192,192],access=[1056,288,48,192],closure=[1056,480,48,24]))
    prop('fence-0',1056,504,owner='guild-rear-yard')
    # Shorter caps expose deliberate service-side recesses. Fence and dress
    # those rear pockets so a changed skyline does not create roof holes.
    for x in (240,720,1392):
        for dx in (0,48):prop('fence-0',x+dx,312,owner='rear-setback',id=f'C3-rear-setback-fence-{x+dx}')
        prop('yard-1',x+24,336,owner='rear-setback',id=f'C3-rear-setback-wood-{x}')
    # Furniture belongs to real doors, setbacks and the delivery yard.
    for f,x,b,owner in [('lamp-c3',144,574,'west-bend'),('lamp-c3',408,670,'T-junction'),('lamp-c3',1104,744,'square-notch'),('lamp-c3',1458,1054,'inn'),('lamp-c3',1824,1090,'wall-lane'),('planter-tree-c3',1536,960,'inn-court'),('barrel',1548,916,'inn-court'),('cart',1536,1012,'inn-court'),('crate',1548,1040,'inn-court'),('planter-tree-c3',576,750,'churchyard'),('district-craft-drying-rack',1636,1038,'east-setback')]:prop(f,x,b,owner=owner,id='C3-'+owner+'-'+f)
    for x in (1488,1536):prop('fence-0',x,1026,owner='inn-court',id='C3-inn-fence-'+str(x))
    # Open24px gate in the courtyard rail; no support blocks the access.
    l['props']=[p for p in l['props'] if p.get('id')!='C3-inn-fence-1488']
    for p in l['props']:
        if p.get('id')=='C3-inn-lamp-c3':p['x']=1392
        if p.get('id')=='guildhall':p['foreground_mask']=[0,0,192,208]
        if p.get('id')=='person-14':p['base']=1422
        if p.get('id')=='court-closure':
            p.update(base=912,entrance=[272,912],footprint=[240,816,96,96],overhang=[240,768,96,48])
        if p.get('id')=='court-well':p.update(x=240,base=988)
        if p.get('id')=='court-laundry':p.update(x=256,base=984,foreground_mask=[6,0,90,32],supports=[[258,954,4,28],[346,954,4,28]])
        if p.get('owner')=='court' and p['file']=='fence-1':p['base']+=192;p['x']=336
        if p.get('id')=='court-gate':p.update(base=1032,entrance=[312,1008])
        if p.get('id')=='person-16':p.update(x=278,base=1000)
        if p.get('id')=='cathedral':
            p.update(foreground_mask=[0,0,240,144],footprint=[480,768,240,288],overhang=[480,624,240,144])
    # The side of the court is open to its south access, with the well and
    # laundry beside the rear door rather than inside the widened street.
    for b in l['lots']:
        if b['id']=='C3-inn-stable':b['foreground_mask']=[0,0,96,48]
        if b['id']=='C3-east-return-0':b['foreground_mask']=[0,0,96,48]
        if b['id']=='C3-north-east-5':
            b['spec'].update(roof_depth=4,roof_fill_file='roof-fill-hip-c3-w2',roof_fill_split=96)
            b['painted'][1]-=48;b['painted'][3]+=48;b['overhang'][1]-=48;b['overhang'][3]+=48
    l['courts'].append(dict(id='inhabited-west-court',rect=[240,912,96,144],access=[288,912,48,144],closure='court-closure',well='court-well',laundry='court-laundry'))
    for j,(x,b,role) in enumerate([(206,660,'west bend'),(350,722,'west bend'),(690,618,'T junction'),(1360,714,'east bend'),(1460,660,'shop approach'),(1600,590,'through alley'),(1750,724,'east bend'),(1322,1100,'inn arrival'),(1502,1048,'inn courtyard'),(1558,892,'stable hand'),(1650,1260,'south alley'),(280,1382,'south street'),(820,1380,'south street'),(1520,1380,'poor quarter')]):prop('person',x,b,path=f'review/r15-M-clean-folk-b-{j%4}.png',id='C3-person-'+str(j),role=role)
    prop('person',924,286,path='review/r15-M-clean-folk-b-2.png',id='C3-north-service-walker',role='wall service route beside overhead spire')
    # Uneven intervals (7,9,6,9,7 cells) and a broader NW corner bastion.
    for x in range(0,1920,96):
        prop('wall-walk-r' if x//96%2==0 else 'wall-walk-alternate-r',x,240,wall=True)
        if not 1152<=x<1344:prop('wall-walk-r',x,1440,crop=[0,0,96,48],wall=True)
    for x in (0,1872):
        for y in range(240,1392,144):prop('wall-side',x,min(y+144,1440),wall=True)
    for x in [0,336,768,1056,1488,1824]:prop('wall-tower-r',x,240,wall=True,id='C3-north-tower-'+str(x))
    prop('wall-tower-r',48,240,wall=True,id='C3-corner-bastion-wing')
    for x,bases in [(0,[672,1056,1440]),(1824,[576,1008,1440])]:
        for b in bases:prop('wall-tower-r',x,b,wall=True)
    for p in old['props']:
        if p.get('id') in ('gatehouse','north-wall-stair'):l['props'].append(p)
    prop('wall-walk-stair-r',1000,1440,wall=True,crop=[0,0,184,48])
    # Physical perimeter and plot forms are reviewable in the anchor sheet.
    l['block_shapes']=[dict(id='west-wedge',shape='stepped trapezoid',polygon=[[144,288],[432,288],[432,672],[336,672],[336,624],[240,624],[240,576],[144,576]]),dict(id='east-wedge',shape='stepped trapezoid with through alley',polygon=[[1392,288],[1776,288],[1776,672],[1632,672],[1632,624],[1488,624],[1488,576],[1392,576]]),dict(id='south-L',shape='L',polygon=[[144,1056],[432,1056],[432,1344],[240,1344],[240,1296],[144,1296]])]
    l['features']=dict(grid=48,cells=[40,30],street_plan='two bent main streets, three stepped L/trapezoid blocks, through alleys at x1584 and1632, varied widths and civic setbacks',inn='192px joined gate-road frontage, open96x144 court, stable and deliveries',wall='uneven tower intervals, paired NW bastion, north defensive ditch',roof='one hue per building, varied ridge direction/height, deep hip at NE end, no thin guildhall strip',square='10x8 with2x2 notch; cathedral west, guild north, six stalls and market hall',conflicts=['BRIEF17 requires jogs/wedges and full size signs despite panel suggestions to defer/reduce','40x30 cells override approximate1200x900 request'])
    # Keep actual resolved paint varied without hiding repetitions under aliases.
    front=neighbours([b for b in l['lots'] if b['spec'].get('view','front')=='front']);mapping={b['id']:b for b in front}
    l['lots']=[mapping.get(b['id'],b) for b in l['lots']]
    return l


def c3_ground(l):
    """One world-phase stone field, native kerbs, drawn wear at real edges."""
    im=repeat(asset('cobble-c3'),tuple(l['size']))
    for x,y,w,h in l['gardens']:im.paste(repeat(asset_path_grass(),(w,h)),(x,y))
    # Ditch is outside the north curtain, never an internal lawn.
    im.paste(repeat(asset('ditch-c3'),(1920,96)),(0,0))
    # The complete dogleg is image-tool paint. Its straight extensions are
    # native crops of the very same drawing, preserving stones and lighting.
    # The independently drawn mouth registers to the same 96px road socket.
    im.alpha_composite(repeat(asset('gate-straight-c3'),(96,192)),(1104,864))
    im.alpha_composite(repeat(asset('gate-straight-south-c3'),(96,288)),(1200,1152))
    im.alpha_composite(repeat(asset('gate-cross-straight-c3'),(192,96)),(1296,1056))
    im.alpha_composite(asset('gate-elbow-c3'),(1104,960))
    im.alpha_composite(asset('gate-square-mouth-c3'),(1032,744))
    roads=l['roads']
    def at(x,y):return any(rx<=x<rx+rw and ry<=y<ry+rh for rx,ry,rw,rh in (r['rect'] for r in roads))
    for r in roads:
        if r['file']=='cobble-c3' or r.get('id')=='gate-to-square':continue
        x,y,w,h=r['rect'];tile=asset(r['file']);k=3 if r['file']=='lane-c3' else 4
        if r.get('horizontal'):
            tile=tile.transpose(Image.Transpose.ROTATE_90)
            for xx in range(x,x+w):
                for sy,dy,other in ((0,y,y-1),(tile.height-k,y+h-k,y+h)):
                    if not at(xx,other):im.paste(tile.crop((xx%tile.width,sy,xx%tile.width+1,sy+k)),(xx,dy))
        else:
            for yy in range(y,y+h):
                for sx,dx,other in ((0,x,x-1),(tile.width-k,x+w-k,x+w)):
                    if not at(other,yy):im.paste(tile.crop((sx,yy%48,sx+k,yy%48+1)),(dx,yy))
    # Edge paint is only used at enclosed grass/stone boundaries and the wall.
    for x,y in [(576,672),(624,744),(240,984)]:im.alpha_composite(asset('street-edge-c3'),(x,y))
    for x,y in [(156,680),(340,692),(1376,656),(1704,700),(1512,982),(1218,1172),(1644,1308),(600,1090)]:im.alpha_composite(asset('puddle-c3'),(x,y))
    return im


def c3_main():
    from collections import Counter
    l=c3_city_layout();im,records,shadows=r_render(l)
    im.save(REVIEW/'r17-city-final.png');im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png')
    im.convert('L').save(REVIEW/'r17-city-final-squint.png')
    for name,box in {'square':(696,624,1320,1080),'street':(96,240,720,816),'gate':(1104,720,1776,1440)}.items():
        a=im.crop(box);a.resize((a.width*3,a.height*3),NEAREST).save(REVIEW/f'r17-city-final-crop-{name}-3x.png')
    refs=[('TODAY / literal1x /24px screenshot cells',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / literal1x /48px cells',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('ROUND17 C3 / literal1x /48px cells',im)]
    sheet=Image.new('RGBA',(sum(a.width for _,a in refs)+64,max(a.height for _,a in refs)+48),(35,39,34,255));d=ImageDraw.Draw(sheet);x=16
    for title,a in refs:d.text((x,10),title,fill='white');sheet.alpha_composite(a,(x,32));x+=a.width+16
    sheet.save(REVIEW/'r17-city-final-vs-r15-vs-today.png')
    hist=Counter(b['spec'].get('floors',len(b['spec'].get('storeys',[]))+1) for b in l['lots']);audit=c3_repeat_audit(l)
    for name,data in [('layout',l),('placements',dict(paint=records,shadows=shadows)),('layout-audit',dict(buildings=len(l['lots']),storeys=dict(hist),repeat=audit))]:(REVIEW/f'r17-C3-{name}.json').write_text(json.dumps(data,indent=2))
    print(json.dumps(dict(buildings=len(l['lots']),storeys=dict(hist),repeat=audit),indent=2))


def c3_repeat_audit(l):
    """Check both horizontal rows and real frontage groups along bent roads."""
    a=r_repeat_audit(l);b=json.loads(json.dumps(l))
    for p in b['lots']:p['base']='frontage:'+p.get('frontage_group',str(p['base']))
    other=r_repeat_audit(b)
    return dict(windows=a['windows']+other['windows'],failures=a['failures']+other['failures'])


# ---- Cycle 4: owned junctions, occupied block edges and instance audits ----
def c4_build(s):
    if s.get('complete_file'):
        a=asset(s['complete_file']).copy();rh=a.height-s['floors']*48
        parts=[dict(file=s['complete_file'],x=0,y=0,crop=[0,0,a.width,rh],layer='roof')]
        for j in range(s['floors']):
            y=a.height-(j+1)*48
            parts.append(dict(file=s['complete_file'],x=0,y=y,crop=[0,y,a.width,y+48],layer='ground' if j==0 else 'storey'))
        return a,parts
    roof=asset(s['roof_file']);panels=s['panels'];w=s['width']*48
    im=Image.new('RGBA',(w,roof.height+48*len(panels)));parts=[]
    def put(n,x,y,crop=None,layer='facade'):
        a=asset(n);a=a.crop(crop) if crop else a
        if x<0 or y<0 or x+a.width>w or y+a.height>im.height:raise ValueError(('C4 outside lot',n,x,y))
        im.alpha_composite(a,(x,y));parts.append(dict(file=n,x=x,y=y,crop=crop,layer=layer))
    for floor,n in enumerate(panels):
        y=im.height-(floor+1)*48;put(n,0,y,layer='ground' if floor==0 else 'storey')
        for side in s.get('returns',[]):
            v=(s.get('variation_index',0)+floor+(side=='right'))%3
            if v==0:put('party-'+side+'-c4',0 if side=='left' else w-8,y,layer='receiving return')
            else:put('firewall-w0',0 if side=='left' else w-8,y,crop=[0 if v==1 else 8,0,8 if v==1 else 16,48],layer='receiving return')
    put(s['roof_file'],0,0,layer='roof')
    for j in s.get('joins',[]):put(j['file'],j['x'],j['y'],layer='owned roof junction')
    for j in s.get('flashings',[]):put('roof-junction-c4',j['x'],j['y'],crop=j['crop'],layer='lower roof flashing')
    for p in s.get('overlays',[]):put(p['file'],p['x'],im.height+p.get('y_offset',-144),layer='trade sign')
    # Contact shade is native paint, kept off the invariant attachment rows.
    n='shadow-eave-w'+str(s['width'])+'-c0';put(n,0,roof.height+1,layer='eave shade')
    if s.get('remove_rear_eave'):
        # The adjoining roof owns this contact; retain its field, not a second eave.
        donor=asset(s['roof_file']);im.paste(donor.crop((0,90,w,94)),(0,92))
    return im,parts


def c4_spec(w,n,i,roof=None,tone='',trade=None,view='front',returns=()):
    family=['gable','ridge','hip'][i%3]
    if w==1 and family=='hip':family='gable'
    roof=roof or f'roof-{family}-c4-w{w}'
    if tone:roof+='-'+tone
    floors=['storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-oriel-w2-c0']
    grounds=['ground-baker-c4-w2','ground-apothecary-c4-w2','ground-smith-c4-w2']
    ground=grounds[i%3];door=[74,18,48][i%3]
    uppers=[floors[(i+j)%3] for j in range(n-1)]
    if w==1:
        ground=['ground-door-w1-c0','ground-door-v1-w1-c0','ground-door-v2-w1-c0'][i%3];door=24
        uppers=[['storey-recessed-c4-left-w1','storey-shuttered-c4-right-w1','storey-oriel-w1-c0'][(i+j)%3] for j in range(n-1)]
    if view=='back':
        ground=f'back-plain-ground-w{w}'
        uppers=[f'back-plain-w{w}' if j%2==0 else f'back-stair-w{w}' for j in range(n-1)]
    if trade=='inn':ground='inn-front-c4-w2';door=28
    overlays=[]
    if trade and w==2:
        right=trade not in ('inn','baker','apothecary','butcher')
        overlays=[dict(file='sign-'+trade+'-c4',x=32 if right else 0)]
        if uppers:uppers[0]='storey-sign-bay-'+('right' if right else 'left')+'-w2'
    return dict(c4=True,width=w,floors=n,variation_index=i,storeys=[dict(kind='timber',colour=0) for _ in range(n-1)],panels=[ground]+uppers,roof_file=roof,roof=family,entrance_dx=door,view=view,returns=list(returns),overlays=overlays)


def c4_city_layout():
    # Retain only reviewed civic objects from the immutable previous scene;
    # every road, residential lot and perimeter placement is authored below.
    prior=json.loads((REVIEW/'r17-C3-layout.json').read_text())
    l=dict(size=[1920,1440],c4_ground=True,e_ground=True,ground_base='cobble-c3',lots=[],props=[],roads=[],gardens=[],clear_routes=[],courts=[],plots=[],square=[816,768,384,288],square_notch=[816,768,96,96],block_shapes=[],features={})
    def road(rect,kind='side',ident='',clear=True):
        l['roads'].append(dict(rect=rect,file={'main':'street-main-c3','side':'street-side-c3','lane':'lane-c3','square':'cobble-c3'}[kind],kind=kind,id=ident,horizontal=rect[2]>rect[3],clear=clear))
        if clear:l['clear_routes'].append(rect)
    def prop(file,x,base,**kw):l['props'].append(dict(file=file,x=x,base=base,**kw))
    def lot(ident,x,base,w,n,i,group,**kw):
        s=c4_spec(w,n,i,**kw);a,_=c4_build(s)
        b=dict(id=ident,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-96,w*48,96],painted=[x,base-a.height,w*48,a.height],overhang=[x,base-a.height,w*48,a.height-96])
        if kw.get('view','front')!='back':b['entrance']=[x+s['entrance_dx'],base]
        l['lots'].append(b);return b
    # Inner service circuit, with visible bays at its junctions. The southern
    # circuit detours NORTH of tower ground supports instead of through them.
    for x,w in [(96,336),(432,384),(816,384),(1200,384),(1584,240)]:road([x,240,w,48],ident='north-wall-lane')
    for x in (96,1776):
        for y,h in [(288,336),(624,384),(1008,336)]:road([x,y,48,h],ident='wall-service')
    for x,w in [(96,288),(576,192),(960,192),(1344,192),(1728,96)]:road([x,1344,w,48],ident='south-wall-lane')
    for x in (432,816,1584):
        for rect in [[x-48,1248,192,48],[x-48,1296,48,96],[x+96,1296,48,96]]:road(rect,ident='tower-service-turn')
    for rect in [[1152,1248,48,144],[1152,1248,240,48],[1344,1248,48,144]]:road(rect,ident='gate-inner-service')
    # Full96px arrival band and elbow. No NPC or container is placed in it.
    for rect in [[1200,1152,96,288],[1104,1056,192,96],[1104,768,96,288]]:road(rect,'main','gate-to-market')
    # Stepped public streets follow the building ends, not residual paving.
    for rect in [[144,624,96,96],[144,672,192,96],[240,672,192,96],[336,720,192,96],[432,624,288,96],[432,576,96,96]]:road(rect,'main','west-bend')
    for rect in [[1200,624,144,48],[1344,576,48,144],[1344,672,240,48],[1584,624,48,144],[1584,720,192,48]]:road(rect,'side','merchant-bend')
    for rect in [[432,288,48,288],[672,288,48,336],[1344,288,48,288],[1584,288,48,336],[1776,288,48,336]]:road(rect,ident='north-T')
    for rect in [[96,1008,336,48],[432,816,48,240],[432,1008,288,96],[1488,1008,48,96],[1488,1056,288,48],[1776,768,48,288]]:road(rect,ident='court-T')
    for rect in [[720,1056,48,192],[912,1056,48,288],[1632,1104,48,144],[288,912,48,96]]:road(rect,ident='back-passage')
    for rect in [[444,336,24,240],[1596,336,24,240],[924,1104,24,192],[1644,1128,24,120],[288,888,24,24]]:road(rect,'lane','rear-lane',False)
    road([816,768,384,288],'square','square',False)
    # Northwest stepped block and its actual rear range/yard sequence.
    for j,(x,b,n) in enumerate([(144,624,3),(240,672,2),(336,672,3)]):
        bld=lot('C4-west-'+str(j),x,b,2,n,j,'west-wedge',roof='roof-ridge-c4-w2' if j==1 else None,returns=('right',))
        if j==2:bld['spec']['joins']=[dict(file='roof-junction-c4',x=0,y=0)]
    for j,x in enumerate((144,240,336)):
        lot('C4-west-rear-'+str(j),x,432,2,1,j,'west-rear',roof=['roof-ridge-c4-w2','roof-back-c4-w2','roof-dormer-c4-w2'][j],view='back')
        l['plots'].append(dict(id='west-plot-'+str(j),front=[x,528,96,96],yard=[x,432,96,96],rear=[x,336,96,96],passage=[432,336,48,240]))
    for y in (456,504):prop('fence-1',328,y,owner='west-plot-1')
    prop('lean-to-c4',288,480,owner='west-plot-1');prop('yard-1',240,480,owner='west-plot-1')
    for j,(x,b,n) in enumerate([(480,624,4),(576,576,3)]):lot('C4-north-middle-'+str(j),x,b,2,n,j+3,'north-middle',returns=('right',))
    # Joined civic frontage; spire silhouettes remain clear above these roofs.
    lot('square-baker',720,672,2,4,6,'square-north',trade='baker')
    lot('square-narrow',816,672,1,3,7,'square-north')
    lot('square-smith',1056,672,1,2,8,'square-north')
    lot('square-apothecary',1104,768,2,3,9,'square-notch',trade='apothecary',returns=('right',))
    # Merchant trapezoid: a coherent slate block, stone grounds, two banners.
    east=[(1200,624,2,4),(1296,624,1,2),(1392,576,2,3),(1488,624,2,5),(1632,672,1,3),(1680,720,2,4)]
    for j,(x,b,w,n) in enumerate(east):
        bl=lot('C4-north-east-'+str(j),x,b,w,n,j+10,'merchant-trapezoid',tone='slate',returns=('right',))
        if w==2:bl['spec']['panels'][0]=['ground-door-w2-c1','ground-work-v1-w2-c1','ground-door-v2-w2-c1'][j%3]
        if j in (0,5):prop('district-rich-banner',x+w*48-24,b-84,owner=bl['id'])
    for j,(x,w) in enumerate([(1296,1),(1632,1)]):lot('C4-merchant-rear-'+str(j),x,432,1,1,15+j,'merchant-rear',tone='slate',view='back',roof='roof-ridge-c4-w1')
    for j,x in enumerate((480,720,816,1056,1104,1200,1392)):
        w=1 if x in (816,1056) else 2;tone='slate' if x>=1200 else ''
        bb=lot('C4-added-rear-'+str(j),x,480,w,2,42+j,'north-rear-ranges',view='back',tone=tone,roof=f'roof-ridge-c4-w{w}')
        bb['spec']['panels'][0]=f'back-'+('stair' if j%3==1 else 'plain-ground')+f'-w{w}'
        if j%3==1:bb['spec']['panels'][1]=f'back-stair-w{w}'
        elif j%3==2:bb['spec']['panels'][1]=f'storey-shuttered-c4-'+('right-w1' if w==1 else 'w2')
        if j in (0,4):bb['spec']['roof_file']='roof-'+('back' if j==0 else 'dormer')+f'-c4-w{w}'
        if x==1104:
            for fx in (1104,1152):prop('fence-0',fx,504,owner=bb['id'])
    # Three private rear courts reclaim the former broad strips of paving.
    for j,(x,b,n) in enumerate([(480,912,2),(576,912,2)]):
        if False:pass  # church owns this footprint
    # Tall eastern square wall is the inn's square-facing arcade/side wing.
    sq=lot('square-east-return',1200,1056,2,5,18,'inn-square',returns=('left',))
    sq['spec']['panels']=['side-ground-W','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-oriel-w2-c0','storey-recessed-c4-w2']
    sq['entrance']=[1200,1032];sq['entrance_direction']='W'
    lot('C4-gate-inn',1296,1056,2,4,19,'inn-gate-road',trade='inn',returns=('right',))
    wing=lot('C4-inn-east-wing',1392,1056,2,3,20,'inn-gate-road',returns=('right',));wing['spec']['panels'][0]='ground-arch-v1-w2-c0'
    lot('C4-east-tailor',1584,1008,2,3,21,'inn-east',trade='tailor',returns=('left',))
    lot('C4-east-scribe',1680,1056,2,4,22,'inn-east',trade='scribe',returns=('right',))
    prop('stable-range-c4',1488,864,id='inn-storage',footprint=[1488,816,96,48],entrance=[1512,864])
    l['courts'].append(dict(id='inn-court',rect=[1488,864,96,192],access=[1488,864,48,192],loading=[1536,1008,48,48]))
    prop('planter-tree-c3',1536,960,owner='inn-court');prop('cart',1536,1048,owner='inn-court',crop=[0,0,48,48]);prop('crate',1554,1048,owner='inn-court');prop('fence-0',1536,1056,owner='inn-court')
    prop('workshop-marker-c4',1558,840,owner='inn-storage')
    # Western workshops with48px served court mouth, fuel and forge apron.
    lot('west-smith',144,1008,2,2,23,'west-craft',trade='smith',returns=('left',))
    lot('west-cobbler',336,1008,2,3,24,'west-craft',trade='cobbler',roof='roof-ridge-c4-w2',returns=('right',))
    for p in prior['props']:
        if p.get('id') in ('court-closure','court-well','court-laundry'):
            p=json.loads(json.dumps(p));l['props'].append(p)
    prop('fence-0',240,1008,id='court-gate',owner='west-court');prop('fence-1',336,960,owner='west-court');prop('fence-1',336,1008,owner='west-court')
    prop('yard-1',144,952,owner='smith-fuel');prop('forge-smoke',170,866,owner='west-smith',overhead=True)
    prop('chimney-1-c0',170,826,owner='west-smith');prop('workshop-marker-c4',214,956,owner='west-smith')
    l['courts'].append(dict(id='west-court',rect=[240,912,96,96],access=[288,912,48,96],forge_apron=[144,960,48,48]))
    # Southern L and shop-backed square edge, broken by connected back lanes.
    south=[(144,1296,2,3),(240,1344,2,3),(336,1248,1,2),(576,1344,2,3),(672,1344,1,3),(768,1248,1,2),(960,1344,2,3),(1056,1344,1,3),(1104,1344,1,2)]
    for j,(x,b,w,n) in enumerate(south):lot('C4-south-'+str(j),x,b,w,n,25+j,'south-L' if x<432 else 'square-south',trade='butcher' if x==960 else None,returns=('right',))
    # Visible northern shop arcades join these taller southern properties.
    for j,(x,b) in enumerate([(768,1104),(864,1104),(960,1104)]):
        prop(['ground-baker-c4-w2','ground-smith-c4-w2','ground-apothecary-c4-w2'][j],x,b,id='square-facing-shop-'+str(j),footprint=[x,b-48,96,48],entrance=[x+48,b-48],entrance_direction='N',owner='square-south')
    for j,x in enumerate((576,672)):
        l['plots'].append(dict(id='south-plot-'+str(j),front=[x,1152,96 if j==0 else 48,96],yard=[x,1056,96 if j==0 else 48,96],rear=[x,1008,96 if j==0 else 48,48],passage=[528,1056,48,192]))
        prop('lean-to-c4',x,1128,owner='south-plot-'+str(j));prop('fence-1',x,1176,owner='south-plot-'+str(j))
    # Low, patched brown quarter. Gaps belong to48px service routes/plots.
    for j,(x,b,w,n) in enumerate([(1392,1344,2,2),(1488,1248,1,2),(1536,1248,1,1),(1728,1344,1,2)]):
        bl=lot('C4-poor-'+str(j),x,b,w,n,35+j,'poor-wall',tone='brown',returns=('right',));bl['spec']['panels'][0]=f'ground-work-v{1+j%2}-w{w}-c1'
        if n>1:bl['spec']['panels'][1]=f'back-plain-w{w}'
    for x,b in [(1440,1200),(1728,1200)]:prop('lean-to-c4',x,b,owner='poor-rear');prop('district-poor-shutter',x,b+28,owner='poor-rear')
    # Landmarks retain whole native silhouettes and public approaches.
    wanted={'cathedral','guildhall','guildhall-public-entry','bench-pocket'}
    for p in prior['props']:
        if p.get('id') in wanted:l['props'].append(json.loads(json.dumps(p)))
    prop('townhall-market-r',720,864,id='market-hall',footprint=[720,720,192,144],foreground_mask=[0,0,192,105])
    prop('church-porch-c4',696,960,id='church-side-entry',entrance=[744,936],entrance_direction='E',footprint=[696,912,48,48])
    prop('fountain-r',816,1008,id='fountain',footprint=[816,912,96,96])
    prop('market-cross-r',1056,1032,id='market-cross',footprint=[1056,936,48,96])
    # Paved enclosed churchyard with masonry boundary and48px south gate.
    for x in (576,624,672):prop('wall-top-a-c4',x,696,crop=[0,24,48,48],owner='churchyard')
    for y in (720,744,768):prop('gate-connector-c4',704,y,crop=[40,24,48,48],owner='churchyard')
    for x in (576,672):prop('wall-top-c-c4',x,768,crop=[0,24,48,48],owner='churchyard')
    prop('planter-tree-c3',576,750,owner='churchyard');prop('person-seated-c4',636,752,id='church-seated',role='seated visitor',sort_base=761)
    # Six stalls with two triplets, browsing strip and central96px crossing.
    stalls=[(936,828),(984,828),(1032,828),(936,948),(984,948),(1032,948)]
    for j,(x,b) in enumerate(stalls):
        prop('stall-'+str(j),x,b,id='stall-'+str(j),footprint=[x,b-48,48,48],foreground_mask=[2,2,46,26],supports=[[x+3,b-21,3,21],[x+42,b-21,3,21]])
        prop('person-vendor-c4',x+16,b-40,id='vendor-'+str(j),role='vendor')
    prop('person-customer-c4',955,869,role='customer facing bread');prop('person-customer-c4',1004,989,role='customer facing cloth')
    prop('cart',864,904,owner='market-delivery');prop('crate',916,904,owner='market-delivery');prop('barrel',890,884,owner='market-delivery');prop('person-porter-c4',888,889,role='unloading porter')
    prop('person-vendor-c4',910,1010,role='jug filler');prop('person',552,1090,path='review/r15-M-clean-folk-b-2.png',role='church arrival')
    for j,(x,b,role) in enumerate([(914,701,'guild entry'),(200,714,'west bend'),(351,757,'west bend'),(692,617,'side entry'),(1460,665,'merchant street'),(1600,686,'merchant lane'),(1740,757,'east bend'),(282,998,'court well'),(1500,1000,'stable hand'),(1360,1100,'inn arrival'),(1326,1375,'gate guard'),(1030,880,'market shopper'),(770,970,'church porch visitor'),(300,1380,'south service'),(1750,1380,'poor service')]):
        prop('person',x,b,path=f'review/r15-M-clean-folk-b-{j%4}.png',id='C4-person-'+str(j),role=role)
    # Perimeter chains alternate visible walk structures A/B/C, including
    # the required A-B-C-A-B southern run beginning at x192.
    for k,x in enumerate(range(0,1920,96)):
        v='abc'[k%3];prop('wall-walk-'+v+'-c4',x,240,wall=True,chain='north-curtain',index=k,id='north-curtain-'+str(k))
        if not 1152<=x<1344:
            v='abc'[(k-2)%3];prop('wall-top-'+v+'-c4',x,1440,wall=True,chain='south-curtain',index=k,id='south-curtain-'+str(k))
    for x in (0,1872):
        for j,y in enumerate(range(240,1392,144)):prop('wall-side-'+'abc'[j%3]+'-c4',x,min(y+144,1440),wall=True,chain='side-'+str(x),index=j)
    for j,x in enumerate((0,336,768,1056,1488,1824)):prop('wall-tower-'+'abc'[j%3]+'-c4',x,240,wall=True,id='north-tower-'+str(x),footprint=[x,96,96,144])
    for j,(x,b) in enumerate([(0,672),(0,1056),(0,1440),(1824,576),(1824,1008),(1824,1440),(432,1440),(816,1440),(1584,1440)]):prop('wall-tower-'+'abc'[j%3]+'-c4',x,b,wall=True,id='tower-'+str(j),footprint=[x,b-144,96,144])
    prop('gatehouse-c4',1176,1440,id='gatehouse',wall=True,footprint=[1176,1248,144,192],overhang=[1176,1040,144,208],foreground_mask=[0,0,144,344],supports=[[1176,1384,24,56],[1296,1384,24,56]],entrance=[1248,1440])
    prop('gate-connector-c4',1296,1440,id='gate-east-connector',wall=True,attachment=True,footprint=[1296,1392,48,48])
    prop('wall-walk-stair-r',960,240,wall=True,id='north-wall-stair')
    # Final plot/entrance registration after the compact square reflow.
    for p in l['props']:
        if p.get('owner')=='west-court' and p['file']=='fence-1':p.update(x=336,crop=[7,0,15,48])
        if p.get('owner','').startswith('south-plot-') and p['file']=='lean-to-c4':p['base']=1152
        if 'tower-' in p['file']:p['foreground_mask']=[0,0,96,96]
    # Reserve a full service cell beside the gate's western pier; the
    # northern cross passage joins it before the supports begin.
    l['lots']=[b for b in l['lots'] if b['id']!='C4-south-8']
    for r in l['roads']:
        if r['rect']==[1152,1248,48,144]:r['rect']=[1104,1248,48,144]
        if r['rect']==[1152,1248,240,48]:r['rect']=[1104,1248,288,48]
    for b in l['lots']:
        if b['id']=='west-smith':b['spec']['overlays'][0]['x']=0;b['spec']['panels'][1]='storey-sign-bay-left-w2'
        if b['id']=='C4-west-rear-1':b['spec']['panels'][0]='back-stair-w2'
        if b['id']=='C4-south-4':
            b['spec']['roof_file']='roof-back-c4-w1';b['spec']['floors']=1;b['spec']['panels']=b['spec']['panels'][:1];b['spec']['storeys']=[];b['use']='low workshop range beside rear yard'
        if b['id']=='C4-south-5':b['spec']['roof_file']='roof-ridge-c4-w1'
        if b['id']=='C4-south-8':b['spec']['roof_file']='roof-dormer-c4-w1'
        if b['id']=='C4-south-3':b['spec']['roof_file']='roof-ridge-c4-w2'
        if b['id']=='C4-south-2':b['spec']['roof_file']='roof-back-c4-w1'
        if b['id']=='C4-poor-1':
            b['spec']['roof_file']='roof-ridge-c4-w1-brown';b['base']=1296;b['entrance'][1]=1296;b['footprint'][1]=1200
        a,_=c4_build(b['spec']);b['painted']=[b['x'],b['base']-a.height,a.width,a.height];b['overhang']=[b['x'],b['base']-a.height,a.width,a.height-96]
    for p in l['props']:
        if p.get('id')=='square-facing-shop-1':p.update(file='ground-baker-c4-right-w1',footprint=[864,1056,48,48],entrance=[890,1056])
        if p.get('id')=='square-facing-shop-0':p['entrance']=[842,1056]
        if p.get('id')=='square-facing-shop-2':p['entrance']=[978,1056]
    towers=[p for p in l['props'] if p.get('wall') and 'tower-' in p['file']]
    def perimeter_order(p):
        if p['base']==240:return p['x']
        if p['x']==1824:return 1920+p['base']
        if p['base']==1440:return 1920+1440+1920-p['x']
        return 1920+1440+1920+1440-p['base']
    for j,p in enumerate(sorted(towers,key=perimeter_order)):p.update(file='wall-tower-'+'abc'[j%3]+'-c4',chain='tower-circuit',index=j)
    south=[p for p in l['props'] if p.get('chain')=='south-curtain']
    for j,p in enumerate(south):p['file']='wall-top-'+'abc'[(j-2)%3]+'-c4'
    l['roads']=[r for r in l['roads'] if r['rect'] not in ([336,720,192,96],[432,1008,288,96],[432,576,96,96],[432,624,288,96])]
    for rect in [[432,576,48,192],[432,624,288,48],[432,1056,288,48],[744,864,48,192]]:road(rect,ident='temple-access')
    road([1008,240,48,192],ident='guild-rear-service')
    prop('fence-0',1008,456,id='guild-rear-service-closure',owner='guildhall')
    road([1776,624,96,48],ident='east-wall-service-bay')
    l['props']=[p for p in l['props'] if not(p.get('owner')=='south-plot-0' and p['file']=='lean-to-c4')]
    for plot in l['plots']:
        if plot['id']=='south-plot-1':plot.update(front=[672,1248,48,96],yard=[672,1152,48,48],rear=[672,1104,48,48],passage=[720,1056,48,192])
    l['clear_routes']=[r['rect'] for r in l['roads'] if r.get('clear')]
    # Attach gutters/returns to actual height differences; own every join once.
    for group in sorted(set(b['frontage_group'] for b in l['lots'])):
        row=sorted([b for b in l['lots'] if b['frontage_group']==group],key=lambda b:b['x'])
        for a,b in zip(row,row[1:]):
            if a['x']+a['spec']['width']*48!=b['x']:continue
            for tall,low,side in [(a,b,'right'),(b,a,'left')]:
                ty=tall['painted'][1]+asset(tall['spec']['roof_file']).height;ly=low['painted'][1]+asset(low['spec']['roof_file']).height
                if ty<ly and side not in tall['spec']['returns']:tall['spec']['returns'].append(side)
                if ty<ly:
                    # A native gutter/contact strip sits on the receiving
                    # edge at this neighbour's actual eave height.
                    local=ly-tall['painted'][1]-8
                    if 0<=local<=tall['painted'][3]-10:
                        tall['spec'].setdefault('flashings',[]).append(dict(x=0 if side=='left' else tall['spec']['width']*48-8,y=local,crop=[0,18,8,28],neighbour=low['id'],world_eave=ly))
    l['block_shapes']=[dict(id='west',shape='stepped trapezoid',polygon=[[144,288],[432,288],[432,720],[336,720],[336,672],[240,672],[240,624],[144,624]]),dict(id='merchant',shape='trapezoid with24px through lane',polygon=[[1392,288],[1776,288],[1776,720],[1680,720],[1680,672],[1632,672],[1632,624],[1488,624],[1488,576],[1392,576]]),dict(id='south',shape='L with tower forecourt',polygon=[[144,1056],[384,1056],[384,1248],[336,1248],[336,1344],[240,1344],[240,1296],[144,1296]])]
    l['features']=dict(cycle='C4',grid=48,cells=[40,30],main_width=96,side_width=48,rear_lane_width=24,square='8x6 core with2x2 northwest notch; hall attached at northwest; church west; guild north; inn arcade east; shop arcades south',plan='stepped western wedge, merchant trapezoid, southern L; public T-junctions and bends; separate private rear mouths',no_frontage_lawns=True,wall='single northwest tower; uneven north gaps; three south intervals with inner detours',conflicts=['BRIEF17 twice-round15 sign canvases64x72 supersede48px panel cap; painted boards approximately48px','BRIEF17 keeps compulsory8-cell bends,1/2-cell lots,3x4gate and2x3towers','Coordinator40x30 native48px cells requires1920x1440, rather than approximate1200x900'])
    return c4_critic2_layout(c4_critic1_layout(l))


def c4_critic1_layout(l):
    """Directional access, serviced properties and owned roof contacts."""
    def prop(file,x,base,**kw):l['props'].append(dict(file=file,x=x,base=base,**kw))
    def road(rect,ident):l['roads'].append(dict(rect=rect,id=ident,kind='side',file='street-side-c3',horizontal=rect[2]>rect[3],clear=True))
    def find(ident):return next(b for b in l['lots'] if b['id']==ident)
    def complete(b,file,n,direction,entry):
        b['spec'].update(complete_file=file,floors=n,overlays=[],returns=[],flashings=[],joins=[])
        b.update(entrance=entry,entrance_direction=direction,threshold_paint=dict(file=file,direction=direction,point=[entry[0]-b['x'],entry[1]-b['base']+asset(file).height]))
    prop('gate-connector-c4',1152,1440,id='gate-west-connector',wall=True,attachment=True,footprint=[1152,1392,48,48])
    # The retained north towers have a transparent bottom outline row. Their
    # side-wall receiving course overlaps it using unchanged native paint.
    for x in (0,1872):
        prop('wall-side-a-c4',x,240,crop=[0,0,48,2],id='north-side-contact-'+str(x),wall=True)
    b=find('square-east-return');complete(b,'side-house-west-c4',4,'W',[1200,1032])
    for ident in ('C4-north-east-5','C4-north-middle-1'):
        b=find(ident);complete(b,'side-house-east-c4',3,'E',[b['x']+96,b['base']-8])
    # A sign's bracket lands on a beam; two clear bays receive its full height.
    b=find('west-smith');b['spec']=c4_spec(2,3,23,trade='smith',returns=('left',));b['spec']['overlays'][0]['x']=0
    for b in l['lots']:
        s=b['spec']
        for p in s.get('overlays',[]):
            bay='storey-sign-bay-'+('right' if p['x']>0 else 'left')+'-w2'
            if len(s['panels'])>=3:s['panels'][1:3]=[bay,bay]
            p['y_offset']=-144;p['beam_anchor']=[p['x']+8,-142]
    # Whole court-and-roof ranges replace detached/clipped doorway fragments.
    l['props']=[p for p in l['props'] if not p.get('id','').startswith('square-facing-shop-')]
    l['lots']=[b for b in l['lots'] if b['id'] not in ('C4-south-5','C4-south-6','C4-south-7')]
    for j,(x,base,w,rf) in enumerate([(720,1296,2,'north-shop-court-short-c4'),(960,1344,2,'north-shop-court-c4'),(1056,1344,1,'north-shop-court-c4-w1')]):
        s=c4_spec(w,3,60+j,roof=rf,returns=('right',));s['overlays']=[]
        a,_=c4_build(s);dx=15 if w==1 else 31;entry=[x+dx,base-a.height+6]
        l['lots'].append(dict(id='square-south-property-'+str(j),x=x,base=base,spec=s,frontage_group='square-south',footprint=[x,base-96,w*48,96],entrance=entry,entrance_direction='N',threshold_paint=dict(file=rf,point=[dx,6],direction='N'),court=[x+8,base-a.height+6,24 if w==1 else 40,42],overhead_court=True))
    l['roads']=[r for r in l['roads'] if r['rect'] not in ([720,1056,48,192],[912,1056,48,288],[768,1248,192,48],[768,1296,48,96],[912,1296,48,96],[960,1344,192,48])]
    for rect in ([816,1056,96,192],[816,1248,96,48],[912,1344,192,48],[768,1296,48,96],[672,1296,96,48],[672,1200,48,144],[912,1296,48,48]):road(list(rect),'south-square-exit')
    # Northwest yard: visible boundary-to-boundary strip and covered access.
    b=find('C4-west-1');b['x']=240;b['base']=720;b['spec']=c4_spec(1,2,1,roof='roof-ridge-c4-w1');b['entrance']=[264,720]
    l['props']=[p for p in l['props'] if p.get('owner')!='west-plot-1']
    l['plots']=[p for p in l['plots'] if p['id']!='west-plot-1']
    l['plots'].append(dict(id='west-plot-1',front=[240,624,48,96],yard=[240,432,96,96],rear=[240,336,96,96],passage=[288,480,48,240]))
    for x in (240,336):
        for base in (480,528):prop('fence-1',x,base,crop=[7,0,15,48],owner='west-plot-1',architectural=True)
    prop('lean-to-c4',240,480,owner='west-plot-1',architectural=True);prop('yard-1',240,524,owner='west-plot-1')
    prop('court-passage-c4',264,720,id='west-covered-access',owner='west-plot-1',foreground_mask=[0,0,96,20],supports=[[264,692,12,28],[348,692,12,28]],architectural=True)
    for rect in ([288,480,48,240],[240,720,192,48],[432,672,48,96]):road(list(rect),'west-yard-access')
    l['roads']=[r for r in l['roads'] if r['rect'] not in ([240,672,192,96],[144,672,192,96])]
    road([144,672,96,48],'west-bend-return')
    find('C4-west-rear-2')['spec']['remove_rear_eave']=True
    # South-central: a second arrangement with a rear range and stair landing.
    l['props']=[p for p in l['props'] if not p.get('owner','').startswith('south-plot-')]
    l['plots']=[p for p in l['plots'] if not p['id'].startswith('south-plot-')]
    b=find('C4-south-3');b['spec']=c4_spec(1,1,28,roof='roof-ridge-c4-w1');b['entrance']=[600,1344]
    b=find('C4-south-4');b['x']=624;b['base']=1344;b['spec']=c4_spec(1,2,29,roof='roof-back-c4-w1');b['entrance']=[648,1344]
    l['plots'].append(dict(id='south-served-plot',front=[576,1248,96,96],yard=[576,1104,48,96],rear=[576,1056,96,48],passage=[528,1104,48,240]))
    prop('lean-to-c4',624,1152,id='south-rear-shed',owner='south-served-plot',architectural=True)
    prop('fence-1',664,1152,crop=[7,0,15,48],owner='south-served-plot',architectural=True)
    prop('fence-1',624,1200,crop=[7,0,15,48],owner='south-served-plot',architectural=True)
    prop('fence-0',576,1200,owner='south-served-plot',architectural=True)
    prop('court-stair',576,1200,owner='south-served-plot',architectural=True)
    road([528,1104,48,240],'south-yard-service')
    prop('court-passage-c4',504,1248,id='south-covered-access',owner='south-served-plot',foreground_mask=[0,0,96,20],supports=[[504,1220,12,28],[588,1220,12,28]],architectural=True)
    b=find('C4-added-rear-4');b['spec']['panels']=['ground-work-v2-w2-c0','storey-shuttered-c4-w2'];b['spec']['roof_file']='roof-back-c4-w2'
    l['props']=[p for p in l['props'] if p.get('owner')!='C4-added-rear-4']
    # Each small churchyard wall is counted; the east return is one continuous
    # side projection, not three identical frontal connector stamps.
    l['props']=[p for p in l['props'] if not(p.get('owner')=='churchyard' and p['file']=='gate-connector-c4')]
    prop('wall-side-a-c4',704,768,crop=[0,0,8,72],owner='churchyard',architectural=True)
    for p in l['props']:
        if p.get('owner')=='churchyard' and p['base']==696:p['file']='wall-top-'+'abc'[(p['x']-576)//48]+'-c4'
        if p.get('id')=='market-cross':p.update(base=1008,footprint=[1056,912,48,96])
    for ident in ('C4-south-0','C4-south-1','C4-south-2'):
        b=find(ident);b['spec']['roof_file']+='-brown'
    find('C4-north-middle-0')['spec']['roof_file']+='-slate'
    find('C4-added-rear-0')['spec']['roof_file']='roof-back-c4-w2-slate'
    for b in l['lots']:
        a,_=c4_build(b['spec']);b['footprint']=[b['x'],b['base']-96,a.width,96];b['painted']=[b['x'],b['base']-a.height,a.width,a.height];b['overhang']=[b['x'],b['base']-a.height,a.width,a.height-96]
    l['clear_routes']=[r['rect'] for r in l['roads'] if r.get('clear')]
    l['features']['critic1']='Directional side doors, complete north-access shop courts, two fenced property sequences, whole-face masonry and cross-row tower ownership.'
    return l


def c4_critic2_layout(l):
    """Complete served yards and vary the exposed architectural windows."""
    def find(ident):return next(b for b in l['lots'] if b['id']==ident)
    def prop(file,x,base,**kw):l['props'].append(dict(file=file,x=x,base=base,**kw))
    # Two different exposed bays on each tall signed elevation. The sign
    # still occupies the same blank 64px beam bay, above the entrance.
    find('C4-east-tailor')['spec']['panels'][2]='storey-sign-bay-shutter-right-c4-w2'
    find('C4-east-scribe')['spec']['panels'][1]='storey-sign-bay-shutter-right-c4-w2'
    find('C4-north-east-3')['spec']['panels'][4]='storey-arrangement-b-c4-w2'
    # The former stair consumed the entire yard. A complete rear ground wall
    # now faces a genuinely exposed 48x48 yard beside the low front house.
    l['props']=[p for p in l['props'] if not(p.get('owner')=='south-served-plot' and p['file'] in ('court-stair','fence-0','fence-1')) and p.get('id')!='guild-rear-service-closure']
    plot=next(p for p in l['plots'] if p['id']=='south-served-plot')
    plot.update(yard=[576,1152,48,48],rear=[576,1104,96,48],access=[528,1152,48,48],rear_door=[588,1152])
    prop('back-plain-ground-w1',576,1152,id='south-rear-door',owner='south-served-plot',architectural=True,footprint=[576,1104,48,48])
    # A short boundary returns from the rear wall; the west service mouth
    # stays open. The adjacent roof owns the eastern and southern contacts.
    prop('fence-1',616,1200,crop=[7,0,15,48],id='south-yard-east-boundary',owner='south-served-plot',architectural=True)
    prop('barrel',592,1182,id='south-rear-door-barrel',owner='south-served-plot')
    # North pottery pocket becomes a bounded delivery court: its door opens
    # onto a free landing, goods sit at the far side, and rail ends attach
    # directly to the neighbouring receiving faces.
    l['plots'].append(dict(id='pottery-service-court',front=[1104,384,96,96],yard=[1104,480,96,48],rear=[1104,528,96,96],access=[1104,480,24,32],rear_door=[1118,480]))
    for x,v in [(1104,'b'),(1152,'c')]:prop('fence-h-'+v+'-c4',x,528,id='pottery-court-rail-'+str(x),owner='pottery-service-court',architectural=True)
    prop('crate',1168,502,crop=[0,0,24,24],id='pottery-delivery-crate',owner='pottery-service-court')
    l['courts'].append(dict(id='pottery-service-court',rect=[1104,480,96,48],access=[1104,480,24,24],entrance=[1118,480],private=True))
    # Extend the private guild service paving to the receiving rear facade;
    # the old detached fence across this approach is removed.
    for r in l['roads']:
        if r['id']=='guild-rear-service':r['rect']=[1008,240,48,240]
    b=find('square-south-property-2');b['entrance']=[1072,1056];b['threshold_paint']['point']=[16,4];b['court']=[1060,1056,24,48]
    l['clear_routes']=[r['rect'] for r in l['roads'] if r.get('clear')]
    l['features']['critic2']='Complete narrow court; all-floor frontage audit; varied visible sign bays; exposed south rear yard; enclosed pottery court; matched roof adapters in proofs.'
    return l


def c4_ground(l):
    im=repeat(asset('cobble-c3'),tuple(l['size']));im.paste(repeat(asset('ditch-c3'),(1920,96)),(0,0))
    def field(n,rect):
        x,y,w,h=rect;a=asset(n);tile=repeat(a,(w+a.width,h+a.height)).crop((x%a.width,y%a.height,x%a.width+w,y%a.height+h));im.paste(tile,(x,y))
    for box in [[576,672,144,96],[240,912,96,96],[144,960,48,48],[1488,864,96,192],[1392,1104,240,144],[1680,1104,96,144]]:field('workyard-c4',box)
    for p in l['plots']:field('workyard-c4',p['yard'])
    for r in l['roads']:
        if r['id']=='gate-to-market':field('main-paving-c4',r['rect'])
    roads=l['roads']
    def at(x,y):return any(rx<=x<rx+rw and ry<=y<ry+rh for rx,ry,rw,rh in (r['rect'] for r in roads))
    for r in roads:
        if r['kind']=='square':continue
        x,y,w,h=r['rect'];tile=asset(r['file']);k=3
        if r.get('horizontal'):
            tile=tile.transpose(Image.Transpose.ROTATE_90)
            for xx in range(x,x+w):
                for sy,dy,other in ((0,y,y-1),(tile.height-k,y+h-k,y+h)):
                    if not at(xx,other):im.paste(tile.crop((xx%tile.width,sy,xx%tile.width+1,sy+k)),(xx,dy))
        else:
            for yy in range(y,y+h):
                for sx,dx,other in ((0,x,x-1),(tile.width-k,x+w-k,x+w)):
                    if not at(other,yy):im.paste(tile.crop((sx,yy%48,sx+k,yy%48+1)),(dx,yy))
    return im


def ground_footprints(b):
    """Physical ground rectangles, independent of projected sprite paint."""
    principal=b.get('footprint')
    if principal is None:
        width=b['spec'].get('width')
        principal=[b['x'],b['base']-96,width*48 if width else build_c(b['spec'])[0].width,96]
    return [principal]+([b['rear_wing_footprint']] if b.get('rear_wing_footprint') else [])


def shared_ground_edges(a,b):
    """Positive-length wall contacts; a corner or overlapping paint is not one."""
    edges=[]
    for x,y,w,h in ground_footprints(a):
        for u,v,r,t in ground_footprints(b):
            lo,hi=max(y,v),min(y+h,v+t)
            if hi>lo and (x+w==u or u+r==x):
                xx=x+w if x+w==u else x
                edges.append(dict(axis='vertical',segment=[xx,lo,xx,hi],length=hi-lo))
            lo,hi=max(x,u),min(x+w,u+r)
            if hi>lo and (y+h==v or v+t==y):
                yy=y+h if y+h==v else y
                edges.append(dict(axis='horizontal',segment=[lo,yy,hi,yy],length=hi-lo))
    return edges


def c4_instance_audit(l):
    """Inventory every architectural draw; derive connected chains from geometry."""
    from collections import defaultdict,Counter
    chains=defaultdict(list);instances=[];window_samples=[];fail=[];windows=0
    visibility=c4_visibility(l)
    def artwork(name,crop=None):
        if name.startswith(('out/','review/')):a=Image.open(ART/name).convert('RGBA')
        else:a=asset(name)
        return a.crop(crop) if crop else a
    def token(name,crop,owner,layer,rect,mask=None,**kw):
        a=artwork(name,crop);v=list(a.get_flattened_data());freq=Counter(p[:3] for p in v if p[3]);rank={c:i+1 for i,(c,n) in enumerate(sorted(freq.items(),key=lambda q:(-q[1],q[0])))}
        motif=bytes(rank.get(p[:3],0) if p[3] else 0 for p in v)
        t=dict(file=name,crop=crop,owner=owner,layer=layer,rect=rect,hash=hashlib.sha256(a.tobytes()+str(a.size).encode()).hexdigest(),motif=hashlib.sha256(motif+str(a.size).encode()).hexdigest(),_pixels=motif,_rgba=v,_mask=mask,_size=a.size,**kw)
        instances.append(t);return t
    # Architectural chains use physical wall edges, including attached wings.
    lots=l['lots'];parent=list(range(len(lots)))
    def root(i):
        while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
        return i
    edges=[]
    for i,a in enumerate(lots):
        for j,b in enumerate(lots[i+1:],i+1):
            if shared_ground_edges(a,b):
                parent[root(j)]=root(i);edges.append([a['id'],b['id']])
    for i,b in enumerate(lots):
        im,parts=build_c(b['spec']);stack=[];columns=defaultdict(list)
        for pi,p in enumerate(parts):
            layer=p['layer'];name=p['file']
            if any(q in layer for q in ('shade','shadow','overlay','trade sign')):continue
            a=artwork(name,p.get('crop'));x=b['x']+p['x'];y=b['base']-im.height+p['y']
            level='roof' if 'roof' in layer else (im.height-p['y'])//48-1
            if layer in ('roof fill adapter','directional roof fill'):level='roof-course-'+str(p['y']//16)
            role='roof' if layer=='roof' else 'floor' if layer in ('ground','storey','facade','wall','corner') else 'return' if 'return' in layer else layer
            t=token(name,p.get('crop'),b['id'],layer,[x,y,a.width,a.height],visibility.get((b['id'],'part',pi)),x=x,base=b['base'],level=level)
            # Full elevations follow the frontage; narrow receiving strips follow
            # their own vertical edge, never unrelated parallel house edges.
            if role!='return':chains[('connected-frontage',root(i),role)].append(t)
            else:chains[('connected-returns',root(i),p['x']>0,level)].append(t)
            # Compare the actual exposed window bay separately from the
            # blank sign mount. Signs and hidden panel edits cannot diversify it.
            short=Path(name).stem
            if layer=='storey' and short.startswith('storey-sign-bay-'):
                wx=0 if 'right' in short else 64;box=[wx,4,wx+32,44]
                mask=t['_mask'];wm=None
                if mask is not None:
                    m=Image.frombytes('L',a.size,mask);wm=m.crop(box).tobytes()
                window=token(name,box,b['id'],'exposed window bay',[x+wx,y+4,32,40],wm,x=x,base=b['base'],level=level)
                instances.pop();window_samples.append(window)
                chains[('connected-window-bays',root(i))].append(window)
            if role=='floor':stack.append(t)
            if role=='return':columns[p['x']].append(t)
        chains[('vertical-floors',b['id'])]=sorted(stack,key=lambda t:t['level'])
        for x,col in columns.items():chains[('vertical-returns',b['id'],x)]=sorted(col,key=lambda t:t['level'])
    prefixes=('wall-','gate','ground-','storey-','roof-','side-','back-','corner-','fence-','court-','lean-to','stable-range','church-porch','townhall','cathedral','guildhall')
    for pi,p in enumerate(l['props']):
        if not (p.get('architectural') or p.get('wall') or p['file'].startswith(prefixes)):continue
        name=p['file'];a=r_prop_image(p);owner=p.get('id',name+':'+str(p['x'])+':'+str(p['base']));x,y=p['x'],p['base']-a.height
        t=token(p.get('path',name),p.get('crop'),owner,'prop architecture',[x,y,a.width,a.height],visibility.get((owner,'prop')),x=x,base=p['base'],level='prop')
        if 'tower-' in name:
            pos=x if p['base']==240 else 1920+p['base'] if x>=1824 else 5280-x if p['base']==1440 else 6720-p['base']
            t['order']=pos;chains[('perimeter','tower-circuit')].append(t)
        elif p.get('wall'):
            if name.startswith('wall-side'):chains[('perimeter','vertical',x)].append(t);t['order']=p['base']
            else:chains[('perimeter','horizontal',p['base'])].append(t)
        else:
            # Real adjacency, not hand-entered owner labels, joins prop walls.
            orientation='vertical' if a.height>a.width else 'horizontal'
            chains[('prop-boundary',orientation,x if orientation=='vertical' else p['base'])].append(t)
    def scan(key,seq):
        nonlocal windows
        seq=[t for t in seq if t['_mask'] is None or any(t['_mask'])]
        if not key[0].startswith('vertical'):seq.sort(key=lambda t:(t.get('order',t['x']),t['base'],str(t['level'])))
        # Disconnected prop rows must not claim to be one boundary.
        runs=[seq]
        if key[0]=='prop-boundary':
            runs=[];run=[]
            for t in seq:
                if run:
                    a=run[-1]['rect'];b=t['rect'];gap=(b[1]-a[1]-a[3]) if key[1]=='vertical' else b[0]-a[0]-a[2]
                    if gap>0:runs.append(run);run=[]
                run.append(t)
            if run:runs.append(run)
        for seq in runs:
            owner_order=list(dict.fromkeys(t['owner'] for t in seq))
            windows_to_scan=[seq[i:i+5] for i in range(max(1,len(seq)-4))]
            if key[0] in ('connected-frontage','connected-window-bays'):
                windows_to_scan += [[t for t in seq if t['owner'] in owner_order[i:i+5]] for i in range(max(1,len(owner_order)-4))]
            for run in windows_to_scan:
                if len(run)<3:continue
                windows+=1
                for field in ('hash','motif'):
                    for h,n in Counter(t[field] for t in run).items():
                        if n>2:fail.append(dict(chain=list(key),comparison=field,count=n,owners=[t['owner'] for t in run],pieces=[t['file'] for t in run if t[field]==h]))
                from itertools import combinations
                def same_visible(a,b):
                    if a['_size']!=b['_size'] or a['_mask'] is None or b['_mask'] is None:return False
                    common=[i for i,(x,y) in enumerate(zip(a['_mask'],b['_mask'])) if x and y]
                    if len(common)<64 or len(common)<.8*max(sum(bool(x) for x in a['_mask']),sum(bool(x) for x in b['_mask'])):return False
                    def topology(t):
                        colours={};out=[]
                        for i in common:
                            rgb=t['_rgba'][i][:3]
                            if rgb not in colours:colours[rgb]=len(colours)
                            out.append(colours[rgb])
                        return out
                    return topology(a)==topology(b)
                for trio in combinations(run,3):
                    if len({t['motif'] for t in trio})>1 and all(same_visible(a,b) for a,b in combinations(trio,2)):
                        fail.append(dict(chain=list(key),comparison='common visible motif',count=3,owners=[t['owner'] for t in trio],pieces=[t['file'] for t in trio]))
    for key,seq in chains.items():scan(key,seq)
    inventory=[{k:v for k,v in t.items() if not k.startswith('_')} for t in instances]
    return dict(instances=len(instances),visible_instances=sum(bool(t['_mask'] and any(t['_mask'])) for t in instances),windows=windows,chains=len(chains),adjacency_edges=edges,inventory=inventory,window_motifs=[{k:v for k,v in t.items() if not k.startswith('_')} for t in window_samples],failures=fail)


def c4_visibility(l):
    """Actual opaque occlusion in renderer order, for visible-paint audits."""
    ordered=[];result={}
    for b in l['lots']:
        a,parts=build_c(b['spec']);ordered.append((b['base'],0,b['x'],b['base']-a.height,a,b['id'],parts,b['spec']))
    for p in l['props']:
        a=c4_owned_prop(l,p);z=p.get('layer',1)
        if p.get('wall'):z=3 if 'tower' in p['file'] or p.get('id')=='gatehouse' else 2 if p.get('attachment') else -1
        ident=p.get('id',p['file']+':'+str(p['x'])+':'+str(p['base']))
        ordered.append((p.get('sort_base',p['base']),z,p['x'],p['base']-a.height,a,ident,None,None))
    covered=Image.new('L',tuple(l['size']))
    for base,z,x,y,a,ident,parts,s in reversed(sorted(ordered,key=lambda t:(t[0],t[1],t[2]))):
        prior=covered.crop((x,y,x+a.width,y+a.height));alpha=a.getchannel('A').point(lambda v:255 if v==255 else 0)
        vis=ImageChops.multiply(alpha,ImageChops.invert(prior))
        if parts:
            local=Image.new('L',a.size)
            for pi,p in reversed(list(enumerate(parts))):
                piece=Image.open(ART/p['file']).convert('RGBA') if p['file'].startswith(('out/','review/')) else asset(p['file']);piece=piece.crop(p['crop']) if p.get('crop') else piece;px,py=p['x'],p['y'];box=(px,py,px+piece.width,py+piece.height)
                pa=piece.getchannel('A').point(lambda v:255 if v==255 else 0);local_part=local.crop(box)
                m=ImageChops.multiply(ImageChops.multiply(pa,ImageChops.invert(local_part)),vis.crop(box))
                result[(ident,'part',pi)]=m.tobytes()
                if p['layer'] in ('ground','storey','roof'):
                    level='roof' if p['layer']=='roof' else (a.height-py)//48-1
                    result[(ident,level)]=m.tobytes()
                local.paste(ImageChops.lighter(local_part,pa),(px,py))
        else:result[(ident,'prop')]=vis.tobytes()
        covered.paste(ImageChops.lighter(prior,alpha),(x,y))
    return result


def r_repeat_audit(layout):
    return c4_instance_audit(layout)


def c4_route_reaches(l):
    """Merge artificial segment boundaries; split at real openings/width changes."""
    from collections import defaultdict
    groups=defaultdict(list);rects=[r['rect'] for r in l['roads']]
    for r in l['roads']:
        if r['kind']=='square':continue
        x,y,w,h=r['rect'];horizontal=w>h
        groups[(horizontal,y if horizontal else x,h if horizontal else w)].append((x,x+w) if horizontal else (y,y+h))
    reaches=[]
    for (horizontal,cross,width),intervals in groups.items():
        merged=[]
        for a,b in sorted(intervals):
            if merged and a<=merged[-1][1]:merged[-1][1]=max(b,merged[-1][1])
            else:merged.append([a,b])
        for a,b in merged:
            cuts={a,b}
            for x,y,w,h in rects:
                lo,hi=(x,x+w) if horizontal else (y,y+h)
                cl,ch=(y,y+h) if horizontal else (x,x+w)
                if ch<cross or cl>cross+width or (cl>=cross and ch<=cross+width):continue
                if lo<=b and hi>=a:cuts.update((max(a,lo),min(b,hi)))
            pts=sorted(cuts)
            for u,v in zip(pts,pts[1:]):
                reaches.append(dict(axis='horizontal' if horizontal else 'vertical',cross=cross,width=width,start=u,end=v,length=v-u))
    return reaches


def c4_proof_layouts():
    """Acceptance assemblies use the same native builder as the city."""
    result={}
    def scene():return dict(size=[768,576],e_ground=True,ground_base='cobble-c3',lots=[],props=[],roads=[],gardens=[])
    def add(l,name,x,base,s,group='proof-front'):
        a,_=build_c(s);b=dict(id=name,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-96,a.width,96],painted=[x,base-a.height,a.width,a.height],entrance=[x+s.get('entrance_dx',24),base])
        l['lots'].append(b);return b
    l=scene()
    for j,(base,n) in enumerate([(384,3),(432,2),(384,4),(480,3),(432,5)]):
        s=c4_spec(2,n,j,returns=('left','right'));s['variation_index']=[0,1,2,0,1][j]
        # Twelve upper floors across five connected lots: six complete drawn
        # arrangements, each used twice. Count all levels in the same run.
        arrangements=[['storey-recessed-c4-w2','storey-arrangement-a-c4-w2'],['storey-shuttered-c4-w2'],['storey-oriel-w2-c0','storey-arrangement-b-c4-w2','storey-arrangement-c-c4-w2'],['storey-arrangement-a-c4-w2','storey-recessed-c4-w2'],['storey-arrangement-c-c4-w2','storey-shuttered-c4-w2','storey-arrangement-b-c4-w2','storey-oriel-w2-c0']]
        s['panels'][1:]=arrangements[j]
        add(l,'stagger-'+str(j),48+j*96,base,s)
    result['five-staggered-lots']=l
    for orientation in ('tall-left','tall-right'):
        l=scene();counts=[5,1] if orientation=='tall-left' else [1,5]
        for j,n in enumerate(counts):
            s=c4_spec(2,n,j,roof='roof-gable-c4-w2',returns=('right',) if j==0 else ('left',))
            if n==5:s['panels']=['ground-baker-c4-w2','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-oriel-w2-c0','storey-recessed-c4-w2'];s['flashings']=[dict(x=88 if j==0 else 0,y=asset(s['roof_file']).height+184,crop=[0,18,8,28])]
            add(l,orientation+'-'+str(j),48+j*96,480,s)
        result[orientation]=l
    l=scene()
    for j in range(5):l['props'].append(dict(file='wall-walk-'+'abcab'[j]+'-c4',x=96+j*96,base=336,wall=True,chain='proof-curtain',index=j,id='proof-wall-'+str(j)))
    l['props'].append(dict(file='wall-tower-b-c4',x=240,base=288,wall=True,id='shifted-tower',footprint=[240,144,96,144],foreground_mask=[0,0,96,96]))
    result['five-walls-offset-tower']=l
    l=scene()
    add(l,'seven-left-gable',48,480,c4_spec(2,3,0,returns=('right',)))
    hip=dict(c4=True,width=3,floors=1,panels=['ground-work-w3-c0'],roof_file='roof-hip-c4-w3',roof='hip',storeys=[],returns=[],overlays=[],entrance_dx=72)
    add(l,'seven-low-hip',144,480,hip)
    add(l,'seven-rear-wing',288,480,c4_spec(2,2,2,roof='roof-back-c4-w2',returns=('left',)))
    result['seven-cell-roof-volumes']=l
    for orientation in ('left','right'):
        l=scene()
        a=c4_spec(2,2,0,roof='roof-receiver-'+orientation+'-c4-w2');a['joins']=[dict(file='roof-adapter-'+orientation+'-c4',x=48 if orientation=='left' else 0,y=96)]
        b=c4_spec(1,2,1,roof='roof-companion-'+orientation+'-c4-w1')
        if orientation=='left':add(l,'joined-hip',48,432,a);add(l,'gable-companion',144,432,b)
        else:add(l,'gable-companion',48,432,b);add(l,'joined-hip',96,432,a)
        result['roof-adapter-'+orientation]=l
    return result


def c4_main():
    from collections import Counter
    l=c4_city_layout();im,records,shadows=r_render(l)
    im.save(REVIEW/'r17-city-final.png');im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png');im.convert('L').save(REVIEW/'r17-city-final-squint.png')
    for n,box in {'square':(672,624,1392,1152),'street':(96,240,720,816),'gate':(1104,768,1776,1440)}.items():
        a=im.crop(box);a.resize((a.width*3,a.height*3),NEAREST).save(REVIEW/f'r17-city-final-crop-{n}-3x.png')
    refs=[('TODAY / literal1x /24px displayed cells',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / literal1x /48px cells',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('ROUND17 C4 / literal1x /48px cells',im)]
    sheet=Image.new('RGBA',(sum(a.width for _,a in refs)+64,max(a.height for _,a in refs)+48),(35,39,34,255));d=ImageDraw.Draw(sheet);x=16
    for title,a in refs:d.text((x,10),title,fill='white');sheet.alpha_composite(a,(x,32));x+=a.width+16
    sheet.save(REVIEW/'r17-city-final-vs-r15-vs-today.png')
    hist=Counter(b['spec']['floors'] for b in l['lots']);audit=c4_instance_audit(l)
    for n,data in [('layout',l),('placements',dict(paint=records,shadows=shadows)),('layout-audit',dict(buildings=len(l['lots']),storeys=dict(hist),single_storey_fraction=hist[1]/len(l['lots']),repeat=audit))]:(REVIEW/f'r17-C4-{n}.json').write_text(json.dumps(data,indent=2))
    print(json.dumps(dict(buildings=len(l['lots']),storeys=dict(hist),repeat={k:v for k,v in audit.items() if k not in ('inventory','adjacency_edges','window_motifs')}),indent=2))


def c5_spec(w,n,i,tone='',trade=None,side=None):
    """Complete roof volumes and coherent ground/upper bay arrangements."""
    roofs=['roof-gable-c5-w2','roof-cross-c5-w2','roof-hip-c5-w2','roof-hip-cross-c5-w2']
    roof=roofs[i%4] if w==2 else ('roof-cross-c5-w3' if i%2==0 else 'roof-hip-cross-c5-w3') if w==3 else 'roof-gable-c5-w1'
    if tone:roof+='-'+tone
    upper=['floor-a-c5-w2','floor-b-c5-w2','floor-c-c5-w2','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-arrangement-a-c4-w2','storey-arrangement-b-c4-w2','storey-arrangement-c-c4-w2','storey-oriel-w2-c0']
    ground=['ground-baker-c4-w2','ground-smith-c4-w2','ground-door-v2-w2-c0','ground-work-v2-w2-c0'][i%4]
    panels=[ground]+[upper[(i*2+j)%len(upper)] for j in range(n-1)]
    if w==1:
        panels=[['ground-door-w1-c0','ground-door-v1-w1-c0','ground-door-v2-w1-c0','ground-work-v2-w1-c0'][i%4]]+[['floor-a-left-c5-w1','floor-b-right-c5-w1','floor-c-right-c5-w1','storey-oriel-w1-c0'][(i+j)%4] for j in range(n-1)]
    elif w==3:panels=['ground-work-w3-c0']+[f'storey-'+['timber','plaster','oriel'][(i+j)%3]+'-w3-c0' for j in range(n-1)]
    if trade in ('apothecary','cobbler','tailor'):panels[0]='ground-'+trade+'-c5-w2'
    if trade=='inn':panels[0]='inn-front-c5-w2'
    if trade=='baker':panels[0]='ground-baker-c4-w2'
    if trade=='smith':panels[0]='ground-smith-c4-w2'
    overlays=[]
    if trade:
        panels[1]='storey-sign-bay-v'+str(i%6)+'-c5-w2'
        if n>2:panels[2]='storey-sign-bay-v'+str((i+2)%6)+'-c5-w2'
        overlays=[dict(file='sign-'+trade+'-c4',x=0,y_offset=-144)]
    if side:
        panels[0]='side-ground-'+side
        if n>1:panels[1]='side-storey-'+side
    return dict(c5=True,width=w,floors=n,roof_file=roof,panels=panels,overlays=overlays,returns=[],storeys=[dict(kind='timber',colour=0) for _ in range(n-1)],roof='gable',entrance_dx=24 if trade=='inn' else 72 if w==2 else 24,tone=tone)


def c5_build(s):
    if s.get('complete_file'):return c4_build(s)
    roof=asset(s['roof_file']);w=s['width']*48;h=roof.height+48*s['floors'];a=Image.new('RGBA',(w,h));parts=[]
    def put(n,x,y,crop=None,layer='storey'):
        b=asset(n);b=b.crop(crop) if crop else b;a.alpha_composite(b,(x,y));parts.append(dict(file=n,x=x,y=y,crop=crop,layer=layer))
    for j,n in enumerate(s['panels']):put(n,0,h-48*(j+1),layer='ground' if j==0 else 'storey')
    for side in s.get('returns',[]):
        n='roof-abut-'+('right' if side=='left' else 'left')+'-c5r1'
        source=asset(n);donor=source.crop((0,0,8,96) if side=='left' else (16,0,24,96));x=0 if side=='left' else w-8
        # One coping, followed by continuous native masonry; body wraps without caps.
        for y in range(roof.height,h):
            sy=y-roof.height;sy=sy if sy<96 else 8+(sy-8)%80
            a.paste(donor.crop((0,sy,8,sy+1)),(x,y))
        parts.append(dict(file=n,x=x,y=roof.height,crop=[0,0,8,min(96,h-roof.height)],layer='single continuous receiving wall inside taller lot'))
        for contact in s.get('roof_contacts',[]):
            if contact['side']!=side:continue
            lower=asset(contact['roof']);mask=lower.getchannel('A')
            for k in range(8):
                xx=k if side=='right' else lower.width-1-k
                ys=[yy for yy in range(lower.height) if mask.getpixel((xx,yy))]
                if not ys:continue
                yy=contact['top']+min(ys);dx=w-1-k if side=='right' else k
                # Native metal paint registered to THIS cap's first painted
                # pixel in each column. No roof-textured inverse-alpha tab.
                metal=source.crop((21,12,22,15) if side=='right' else (1,12,2,15))
                if roof.height<=yy<h-3:a.paste(metal,(dx,yy))
            parts.append(dict(file=n,x=x,y=max(roof.height,contact['top']),crop=[21,12,22,15] if side=='right' else [1,12,2,15],layer='cap-specific flashing registered to painted lower silhouette'))
    put(s['roof_file'],0,0,layer='roof')
    for p in s.get('overlays',[]):put(p['file'],p['x'],h+p.get('y_offset',-144),layer='trade sign')
    put('shadow-eave-w'+str(s['width'])+'-c0',0,roof.height+1,layer='eave shade')
    return a,parts


def c5_modular_roof(depth=4):
    """Registered drawn ends + directional fills + ridge, with native cut seams.

    Overlaps select pixels from paintings, never blend or construct texture.
    The returned ownership map makes every participating export inspectable.
    """
    if depth not in (3,4,5):raise ValueError('Roof depth must be 3, 4 or 5 cells')
    w,h=144,depth*48
    cap=asset('roof-extension-cap-c5r3-w3')
    names=['roof-fill-left-c5r3','roof-ridge-c5r3','roof-fill-right-c5r3','roof-extension-cap-c5r3-w3']
    body=Image.new('RGBA',(w,h));owners=Image.new('L',(w,h));records=[]
    # A one-pixel-connected minimum-error cut through an overlap selects one
    # donor at each native pixel; no interpolation, noise or replacement line.
    def cut(a,b):
        ww,hh=a.size;prev=[0]*hh;backs=[]
        for x in range(ww):
            col=[];back=[]
            for y in range(hh):
                p=a.getpixel((x,y));q=b.getpixel((x,y))
                cost=sum((p[k]-q[k])**2 for k in range(3))
                yy=min(range(max(0,y-1),min(hh,y+2)),key=lambda z:prev[z])
                col.append(cost+prev[yy]);back.append(yy)
            prev=col;backs.append(back)
        yy=min(range(hh),key=lambda z:prev[z]);path=[]
        for x in range(ww-1,-1,-1):path.append(yy);yy=backs[x][yy]
        return list(reversed(path)),min(prev)
    # These exports are adjacent native crops of one registered painting.
    # Keep their exact course phase and meet at x48/x96 with no overlap,
    # repeated verge, interpolation or invented seam between the two slopes.
    for i,name in enumerate(names[:3]):
        body.paste(repeat(asset(name),(48,h)),(i*48,0))
        owners.paste(i+1,(i*48,0,(i+1)*48,h))
        records.append(dict(file=name,position=[i*48,0],phase_y=0,operation='native 48px longitudinal repeat; exact shared painted course'))
    # Drawn end masks and native outer verges stay attached to the same roof.
    body.paste(cap.crop((0,0,144,48)),(0,0));owners.paste(4,(0,0,144,48))
    top=cap.crop((0,48,144,64));old=body.crop((0,48,144,64));path,_=cut(top,old)
    for x,k in enumerate(path):body.paste(top.crop((x,0,x+1,k)),(x,48));owners.paste(4,(x,48,x+1,48+k))
    records.append(dict(file=names[3],crop=[0,0,144,64],position=[0,0],overlap=16,cut=path))
    y=h-64;end=cap.crop((0,80,144,144));path,_=cut(body.crop((0,y,144,y+16)),end.crop((0,0,144,16)))
    for x,k in enumerate(path):body.paste(end.crop((x,k,x+1,64)),(x,y+k));owners.paste(4,(x,y+k,x+1,h))
    records.append(dict(file=names[3],crop=[0,80,144,144],position=[0,y],overlap=16,cut=path))
    # One native drawn verge column, repeated only within the constant-width
    # slope. This is exterior-outline cleanup, not a new structural contour.
    for y in range(48,h-48):
        for x in (0,143):body.putpixel((x,y),cap.getpixel((x,64+(y-48)%16)));owners.putpixel((x,y),4)
    records.append(dict(file=names[1],position=[48,0],operation='native 48px ridge period, occluded by end caps and registered side overlaps'))
    return body,owners,dict(depth=depth,grid=48,sources=names,operations=records)


def c5_city_layout():
    """Cycle5 rebuild: roofs belong to properties; routes follow inhabited edges."""
    old=c4_city_layout();l=dict(size=[1920,1440],c5=True,lots=[],props=[],roads=[],plots=[],courts=[],gardens=[],square=[720,720,480,336],square_notch=[720,720,96,96],features={})
    def prop(file,x,base,**kw):l['props'].append(dict(file=file,x=x,base=base,**kw))
    def lot(name,x,base,w,n,i,group,tone='',trade=None,side=None):
        s=c5_spec(w,n,i,tone,trade,side);b=dict(id=name,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-96,w*48,96],entrance=[x+s['entrance_dx'],base])
        if side:b.update(entrance=[x+(w*48 if side=='E' else 0),base-12],entrance_direction=side)
        l['lots'].append(b);return b
    def road(rect,kind='side',name='route',clear=True):l['roads'].append(dict(rect=rect,kind=kind,id=name,horizontal=rect[2]>rect[3],file={'main':'street-main-c3','side':'street-side-c3','lane':'lane-c3','square':'square-slabs-c5'}[kind],clear=clear))
    # Irregular wall circuit retains its genuine corner/gate contacts and unequal towers.
    for p in old['props']:
        if p.get('wall'):
            p=json.loads(json.dumps(p));n=p['file']
            if n.startswith('wall-walk-') and n.endswith('-c4'):p['file']={'a':'wall-curtain-c5','b':'wall-curtain-b-c5','c':'wall-curtain-c-c5'}[n.split('-')[2]]
            elif n.startswith(('wall-tower-','wall-top-')) and n.endswith('-c4'):p['file']=n[:-1]+'5'
            if p.get('id')=='north-wall-stair':p.update(file='wall-access-c5',x=960)
            if p.get('id') in ('gate-west-connector','gate-east-connector'):p['file']='gate-connector-c5'
            l['props'].append(p)
    # Northeast and northwest shoulders have the same drawn deck profile.
    for x in (864,1008):prop('wall-shoulder-c5',x,144,id='walk-shoulder-'+str(x),wall=True,attachment=True)
    # North houses form actual continuous frontages, with recessed rear plots.
    for j,(x,b,n) in enumerate([(144,672,5),(240,720,3),(336,672,4)]):lot('west-'+str(j),x,b,2,n,j,'west-wedge',side='E' if j==2 else None)
    for j,(x,b,n) in enumerate([(480,672,4),(576,672,4)]):lot('north-middle-'+str(j),x,b,2,n,j+3,'north-middle','slate',side='W' if j==0 else 'E')
    lot('square-baker',720,672,2,4,6,'civic-north',trade='baker')
    lot('square-narrow',816,672,1,3,7,'civic-north')
    lot('square-smith-bay',1056,672,1,3,8,'merchant-north','slate')
    lot('square-apothecary',1104,672,2,4,9,'merchant-north','slate',trade='apothecary')
    for j,(x,b,w,n) in enumerate([(1200,672,2,4),(1296,672,1,3),(1392,720,2,3),(1488,672,2,5),(1632,720,1,5),(1680,720,2,3)]):
        lot('merchant-'+str(j),x,b,w,n,j+10,'merchant-trapezoid','slate',side='W' if j==2 else 'E' if j==5 else None)
    # Two door/workshop faces on each side-street slot; turns stay inhabited.
    lot('west-lane-workshop',240,432,2,1,19,'west-rear',side='E')
    l['lots'][-1]['spec']['roof_file']='roof-valley-b-c5'
    lot('east-lane-workshop',1392,432,2,1,21,'merchant-rear','slate',side='W')
    lot('east-rear-house',1680,432,2,1,21,'merchant-rear','slate',side='W')
    for b in l['lots']:
        if b['id']=='west-1':b['spec']['panels'][0]='ground-arch-v2-w2-c0';b['entrance']=[b['x']+24,b['base']]
        if b['id'] in ('west-lane-workshop','east-rear-house'):
            b['spec']['panels'][0]='back-plain-ground-w2';b.pop('entrance_direction',None);b['entrance']=[b['x']+24,b['base']]
    # Bounded48px rear strips and96x48 transverse connections, set back from wall lane.
    for k,x,tone,base in [('west',240,'',480),('middle',576,'slate',384),('east',1680,'slate',480)]:
        l['plots'].append(dict(id=k+'-rear',front=[x,base+144,96,96],yard=[x,base-48,96,48],rear=[x,base-96,96,48],passage=[x+72,base-48,24,192]))
        if k=='middle':prop('stable-range-c4',x,base-48,id=k+'-transverse',owner=k+'-rear',architectural=True)
        for xx in (x,x+88):prop('fence-1',xx,base,crop=[7,0,15,24 if k=='east' and xx==x+88 else 48],owner=k+'-rear',architectural=True)
        if k=='west':prop('yard-1',x+48,base-2,crop=[0,20,24,48],owner=k+'-rear')
        elif k=='east':prop('yard-1',x+48,base,crop=[0,24,24,48],owner=k+'-rear')
        else:prop('washing-line',x,base-8,owner=k+'-rear',foreground_mask=[6,0,90,24])
    # West craft court is separate from its48px street access.
    lot('west-smith',144,1008,2,3,23,'craft',trade='smith')
    lot('west-cobbler',336,1008,2,3,25,'craft',trade='cobbler',side=None)
    for p in old['props']:
        if p.get('id') in ('court-closure','court-well','court-laundry','court-gate'):
            p=json.loads(json.dumps(p))
            if p.get('id')=='court-closure':p.update(file='court-closure-c5',base=912,footprint=[240,816,96,96],entrance=[264,912],storeys=2)
            if p.get('id')=='court-well':p['base']=1008
            if p.get('id')=='court-laundry':p.update(file='washing-short-c5',x=240,base=984,foreground_mask=[6,0,42,24])
            l['props'].append(p)
    prop('forge-c5',288,912,id='craft-forge',owner='craft-court');prop('fence-1',336,1008,crop=[7,0,15,48],owner='craft-court')
    l['courts'].append(dict(id='craft-court',rect=[240,912,96,96],access=[288,912,48,96]))
    # The inn straddles the main-road bend and supplies the square's east frontage.
    b=lot('inn-square-wing',1200,1056,2,4,18,'inn',side='W');b['spec'].update(complete_file='side-house-west-c4');b['entrance']=[1200,1032]
    lot('gate-road-inn',1296,1056,2,3,19,'inn',trade='inn')
    lot('inn-east-wing',1392,1056,2,3,21,'inn');l['lots'][-1]['spec']['panels'][0]='ground-arch-v1-w2-c0'
    lot('east-tailor',1584,1056,2,3,21,'east-craft',trade='tailor')
    lot('east-scribe',1680,1056,2,3,23,'east-craft',trade='scribe')
    prop('stable-range-c4',1488,864,id='inn-storage',owner='inn-court');prop('fence-0',1536,1056,owner='inn-court');prop('planter-tree-c3',1536,948,owner='inn-court');prop('cart',1536,1048,owner='inn-court',crop=[0,0,48,48])
    l['courts'].append(dict(id='inn-court',rect=[1488,864,96,192],access=[1488,864,48,192]))
    # L-shaped southern craft block: two lower houses expose working yards.
    for j,(x,b,w,n) in enumerate([(144,1296,2,2),(240,1344,2,2),(336,1248,1,2),(576,1344,1,2),(624,1344,1,3)]):lot('south-L-'+str(j),x,b,w,n,25+j,'south-L','brown')
    lot('south-corner-workshop',432,1248,1,2,41,'south-L','brown')
    for x in (144,240):
        prop('lean-to-c4',x,1104,id='south-shed-'+str(x),owner='south-yard');prop('fence-0',x,1152,owner='south-yard');prop('yard-1',x+48,1148,owner='south-yard')
        l['plots'].append(dict(id='south-yard-'+str(x),yard=[x,1104,96,48],passage=[384,1104,24,144]))
    # The market hall is the south rim, with joined merchant ranges either side.
    lot('south-square-west',672,1344,1,3,31,'square-south')
    l['lots'][-1]['spec']['roof_file']='roof-narrow-hip-c5'
    for b in l['lots']:
        if b['id'] in ('south-L-3','south-L-4'):
            b['spec']['tone']='';b['spec']['roof_file']=b['spec']['roof_file'].removesuffix('-brown');b['frontage_group']='square-south'
    for j,(x,w,n) in enumerate([(960,2,3),(1056,1,4)]):lot('south-square-'+str(j),x,1344,w,n,32+j,'square-south',trade='butcher' if w==2 else None)
    for j,(x,b,w,n) in enumerate([(1392,1344,2,2),(1488,1296,1,2),(1536,1248,1,1),(1728,1344,1,2)]):
        bld=lot('poor-'+str(j),x,b,w,n,35+j,'poor-wall','brown');bld['spec']['panels'][0]=f'ground-work-v{1+j%2}-w{w}-c1'
    for x in (1440,1728):prop('lean-to-c4',x,1152,owner='poor-yard');prop('district-poor-shutter',x,1180,owner='poor-yard')
    for x in (1392,1488,1680):
        for dx in (0,88):prop('fence-1',x+dx,1200,crop=[7,0,15,48],owner='poor-yard')
        prop('fence-0',x,1152,owner='poor-yard')
        l['plots'].append(dict(id='poor-yard-'+str(x),yard=[x,1152,96,48],passage=[x+48,1152,24,48]))
    # Hall service court and the temple rear passage are bounded working space.
    l['courts'].append(dict(id='hall-service',rect=[768,1200,48,48],access=[768,1200,24,48]))
    prop('fence-0',768,1248,owner='hall-service')
    prop('fence-1',768,1248,crop=[7,0,15,48],owner='hall-service');prop('barrel',792,1232,owner='hall-service')
    # Civic silhouettes retain their established footprints.
    for p in old['props']:
        if p.get('id') in ('cathedral','guildhall','guildhall-public-entry'):l['props'].append(json.loads(json.dumps(p)))
    prop('townhall-market-c5',768,1200,id='market-hall',footprint=[768,1056,192,144],entrance=[864,1200],foreground_mask=[0,0,192,105])
    prop('church-porch-c5',672,960,id='church-east-door',footprint=[672,912,48,48],entrance=[720,936],entrance_direction='E',sort_base=1057)
    prop('fountain-r',768,1008,id='fountain',footprint=[768,912,96,96])
    prop('market-cross-r',1056,1008,id='market-cross',footprint=[1056,912,48,96])
    # Connected churchyard, three cells by two; east gate remains48px.
    for x,v in [(576,'a'),(624,'b'),(672,'c')]:prop('wall-top-'+v+'-c5',x,696,crop=[0,24,48,48],owner='churchyard')
    prop('wall-side-a-c4',704,768,crop=[0,0,8,24],owner='churchyard')
    for x,v in [(576,'a'),(672,'b')]:prop('wall-top-'+v+'-c5',x,768,crop=[0,24,48,48],owner='churchyard')
    prop('planter-tree-c3',576,750,owner='churchyard');prop('bench-pocket',624,752,owner='churchyard');prop('person-seated-c4',636,752,id='church-seated',sort_base=761,role='seated visitor')
    l['courts'].append(dict(id='churchyard',rect=[576,672,144,96],access=[720,696,48,48]))
    # Two clear rows and three genuinely different vendor silhouettes, twice each.
    for j,(x,b) in enumerate([(912,816),(960,816),(1008,816),(912,912),(960,912),(1008,912)]):
        prop('stall-'+str(j),x,b,id='stall-'+str(j),footprint=[x,b-48,48,48],foreground_mask=[2,2,46,26],supports=[[x+3,b-21,3,21],[x+42,b-21,3,21]])
        prop('vendor-'+'abc'[j%3]+'-c5',x+[10,22,16][j%3],b-40,id='vendor-'+str(j),role='vendor')
    prop('person-customer-c4',930,850,role='customer facing bread');prop('person-customer-c4',1010,948,role='customer facing goods')
    prop('cart',966,1052,crop=[0,0,48,48],id='market-loading-cart',owner='market-loading');prop('person-porter-c4',1018,1048,role='unloading porter');prop('crate',1038,1052,owner='market-loading')
    prop('person-vendor-c4',868,990,role='jug filler')
    # The L-floor notch is a bounded public bench pocket, not spare paving.
    l['courts'].append(dict(id='square-notch-pocket',rect=[720,720,96,96],access=[768,768,48,48]))
    for x,n in [(720,'fence-h-b-c4'),(768,'fence-h-c-c4')]:prop(n,x,768,owner='square-notch-pocket')
    prop('fence-1',808,768,crop=[7,0,15,48],owner='square-notch-pocket');prop('bench-pocket',728,792,owner='square-notch-pocket');prop('cat',733,783,owner='square-notch-pocket')
    # Memorable side destinations occupy recesses on the building side of wall lane.
    prop('shrine-r',1488,720,id='merchant-shrine',owner='merchant-recess');prop('bench-pocket',720,336,id='north-well-bench',owner='north-recess')
    l['courts'].append(dict(id='merchant-recess',rect=[1488,672,96,48],access=[1536,672,48,48]))
    prop('shrine-r',1296,336,id='guard-notice',owner='guard-recess');prop('gate-guard-bay-c5',1296,1344,id='gate-toll-bay',footprint=[1296,1296,48,48],entrance=[1332,1344],sort_base=1441)
    l['courts'].extend([dict(id='north-recess',rect=[672,288,96,48],access=[672,288,48,48]),dict(id='guard-recess',rect=[1296,288,96,48],access=[1344,288,48,48])])
    for j,(x,b,role) in enumerate([(914,703,'guild entry'),(204,708,'west bend'),(352,710,'west bend'),(692,617,'side entry'),(1460,756,'merchant street'),(1600,700,'merchant lane'),(1740,756,'east bend'),(302,986,'court well'),(1500,1000,'stable hand'),(1340,1088,'inn arrival'),(1338,1382,'gate guard'),(1050,850,'market shopper'),(734,950,'church porch visitor'),(300,1380,'south service'),(1750,1380,'poor service')]):prop('person',x,b,path=f'review/r15-M-clean-folk-b-{j%4}.png',id='life-'+str(j),role=role)
    # Full-width gate route; a96px east-west street meets it at the civic T.
    for rect in [[1200,1152,96,288],[1104,1056,288,96],[1104,768,96,288],[1104,672,288,96],[1296,672,96,144],[1392,720,384,96],[480,672,96,48],[720,672,384,48]]:road(rect,'main' if min(rect[2:])==96 else 'side','gate-road' if rect[0]>=1104 else 'civic-access')
    for rect in [[144,672,96,96],[240,720,96,96],[336,672,96,96],[432,288,48,384],[432,672,48,96],[672,384,48,288],[1344,336,48,336],[1584,288,48,384],[432,768,48,288],[96,1008,336,48],[480,1056,240,48],[720,1056,48,288],[1488,1008,48,96],[1488,1056,288,48],[1776,816,48,240],[528,1104,48,240],[912,1200,48,144]]:road(rect,'main' if min(rect[2:])==96 else 'side','stepped-side')
    # Actual private access, with visibly closed far ends and yard thresholds.
    for rect in [[384,1104,24,144],[1656,1104,24,144],[1704,432,72,24]]:road(rect,'lane','private-service')
    road([384,1056,48,48],name='craft-alley-mouth')
    for x in (408,1648,1680):
        for j,base in enumerate((1152,1200,1248)):
            if x==1680 and base==1200:continue # existing yard return owns this edge
            prop(['fence-1','fence-v-b-c4','fence-v-c-c4'][j],x,base,crop=[7,0,15,48],owner='service-alley',architectural=True)
    for rect in [[288,912,48,96],[1488,864,48,192],[720,912,48,96],[720,696,48,48],[1536,672,48,48],[1344,288,48,48],[672,288,48,48],[672,336,48,48],[1008,240,48,96],[1776,624,96,48]]:road(rect,name='destination')
    prop('fence-0',1008,360,id='guild-service-closure',owner='guild-service')
    for x,w in [(96,336),(432,384),(816,384),(1200,384),(1584,240)]:road([x,240,w,48],name='north-wall-lane')
    for x in (96,1776):
        for y,h in [(288,336),(624,384),(1008,336)]:road([x,y,48,h],name='wall-service')
    for x,w in [(96,288),(576,192),(960,144),(1392,144),(1728,96)]:road([x,1344,w,48],name='south-wall-lane')
    for x in (432,816,1584):
        for rect in [[x-48,1248,192,48],[x-48,1296,48,96],[x+96,1296,48,96]]:road(rect,name='tower-service-turn')
    for rect in [[1104,1248,48,144],[1104,1248,288,48],[1344,1248,48,96]]:road(rect,name='gate-inner-service')
    road(l['square'],'square','square',False)
    # Cap most northern properties at y336: one deliberate fenced48px rear strip.
    rear_strips=[]
    for b in l['lots']:
        s=b['spec'];ident=b['id']
        if ident in ('north-middle-0','north-middle-1'):
            s['roof_file']='roof-'+('hip' if ident.endswith('0') else 'gable')+'-c5-w2-slate'
        if ident in ('square-narrow','square-smith-bay','merchant-1','merchant-4'):
            while len(s['panels'])<4:s['panels'].append('floor-a-right-c5-w1')
            s['floors']=len(s['panels']);s['roof_file']='roof-gable-d3-c5-w1'+('-slate' if s['tone']=='slate' else '')
        if ident=='merchant-2':s['roof_file']='roof-cross-c5-w2-slate'
        if ident=='merchant-3':s['roof_file']='roof-hip-c5-w2-slate'
        if ident=='square-apothecary':
            s['floors']=5;s['panels'].append('storey-arrangement-c-c4-w2')
        a,_=c5_build(s)
        if b['base']-a.height==336 and b['base']<=720 and ident not in ('merchant-1','square-baker'):rear_strips.append((b['x'],a.width,ident))
    fence_index=0
    for x,w,owner in rear_strips:
        l['plots'].append(dict(id=owner+'-rear-strip',yard=[x,288,w,48],passage=[x+w-24,288,24,48]))
        for xx in range(x,x+w,48):
            prop(['fence-0','fence-h-b-c4','fence-h-c-c4'][fence_index%3],xx,312,owner=owner+'-rear-strip',architectural=True);fence_index+=1
        for xx in (x,x+w-8):prop('fence-1',xx,336,crop=[7,0,15,48],owner=owner+'-rear-strip')
        decoration=['yard-1','yard-2','yard-3','barrel','crate'][len(l['plots'])%5]
        if decoration.startswith('yard'):prop(decoration,x+4,334,crop=[0,20,min(40,w-8),48],owner=owner+'-rear-strip')
        else:prop(decoration,x+12,330,owner=owner+'-rear-strip')
    l=c5_contacts(c5_repair_layout(l))
    l=c5_place_activities(l)
    l['clear_routes']=[r['rect'] for r in l['roads'] if r['clear']]
    l['features']=dict(cycle='C5',grid=48,cells=[40,30],square='10x7 L with2x2 northwest notch; hall south, church west, guildhall north, inn east',layout='new bent street edges, northern service alleys, western stepped wedge, northeast trapezoid, southern L, inn on gate bend, unequal wall intervals',roof_colours='red west/civic/inn; slate north-middle/merchant; brown southern/poor',no_frontage_lawns=True,conflicts=old['features']['conflicts'])
    return l


def c5_repair_layout(l):
    """Ground-registered C5 repair; all architecture remains image-painted."""
    def find(n):return next(b for b in l['lots'] if b['id']==n)
    def prop(n,x,base,**kw):l['props'].append(dict(file=n,x=x,base=base,**kw))
    def add(n,x,base,w,h,i,tone='',group='repair'):
        s=c5_spec(w,h,i,tone);b=dict(id=n,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-96,w*48,96],entrance=[x+s['entrance_dx'],base]);l['lots'].append(b);return b
    def side(b,hand,tone=''):
        b['spec']=c5_spec(2,2,1,tone);b['spec']['complete_file']='side-house-'+hand+'-c5r1'+('-slate' if tone=='slate' else '')
        # Measured landing edges in the separately painted east/west sources.
        local=[96,176] if hand=='east' else [0,174]
        b['entrance']=[b['x']+local[0],b['base']-192+local[1]];b['entrance_direction']='E' if hand=='east' else 'W'
        b['painted_threshold']=[52,176,77,157] if hand=='east' else [22,164,43,174]
        b['landing_anchor_local']=local
    # Old yard strips followed sprite tops. Remove those props and derive legal
    # rear ground strips from each principal footprint, independent of height.
    oldowners={'west-rear','middle-rear','east-rear'}|{p['id'] for p in l['plots'] if p['id'].endswith('-rear-strip')}
    l['props']=[p for p in l['props'] if p.get('owner') not in oldowners]
    l['plots']=[p for p in l['plots'] if p['id'] not in oldowners]
    b=find('west-lane-workshop');b.update(x=336,base=480);side(b,'east')
    side(find('west-2'),'east')
    b=add('west-rear-range',240,432,2,1,62,group='west-rear');b['spec']['roof_file']='roof-cross-c5-w2';b['spec']['panels'][0]='back-plain-ground-w2'
    side(find('north-middle-0'),'west','slate')
    side(add('middle-side-workshop',480,480,2,2,63,'slate','north-middle-return'),'west','slate')
    b=find('east-lane-workshop');b['base']=528;side(b,'west','slate')
    side(find('merchant-2'),'west','slate')
    b=find('east-rear-house');b['base']=480;side(b,'east','slate')
    find('north-middle-1')['spec']['roof_file']='roof-filled-gable-c5r1-w2-slate'
    # Replace the mottled old complete tower-house, retaining a tall inn frontage.
    b=find('inn-square-wing');b['spec']=c5_spec(2,4,18,side='W');b['spec']['roof_file']='roof-gable-d2-c5-w2';b['entrance']=[1200,1040];b['entrance_direction']='W'
    # A short westward elbow gives the southern L a built return, rather than
    # the old two-cell paving apron. Its public lane is exactly one cell.
    b=add('south-L-return',528,1248,1,1,64,group='square-south');b['spec']['roof_file']='roof-narrow-hip-c5';b['entrance']=[552,1248]
    for r in l['roads']:
        if r['rect']==[528,1104,48,240]:r['rect']=[480,1104,48,144];r['id']='south-L-bent-alley'
    # Critic3: ground edges, not overlapping roof paint, join the southern Ls.
    # Merge the detached two-storey workshop into the western attached return.
    # This keeps the 24px service passage and the 48px bent public alley open.
    workshop=find('south-corner-workshop');b=find('south-L-2')
    b['base']=1296;b['entrance']=[b['x']+24,b['base']]
    b['spec']['panels'][1:]=workshop['spec']['panels'][1:]
    b['incorporated_lots']=['south-corner-workshop']
    b['use']='attached two-storey workshop return'
    l['lots'].remove(workshop)
    b=find('south-L-3');b['base']=1296;b['entrance']=[b['x']+24,b['base']]
    # Enclose the surplus eastern strip beyond the clear inner wall lane.
    l['courts'].append(dict(id='east-wall-service-court',rect=[1824,576,48,192],access=[1776,624,48,48]))
    prop('lean-to-c4',1824,624,id='east-wall-lean-to',owner='east-wall-service-court')
    for j,base in enumerate((624,720,768)):
        prop(['fence-1','fence-v-b-c4','fence-v-c-c4'][j],1824,base,crop=[7,0,15,48],owner='east-wall-service-court')
    prop('fence-0',1824,768,owner='east-wall-service-court');prop('yard-1',1840,720,crop=[0,20,24,48],owner='east-wall-service-court')
    # The old eastern rear passage lay beneath the new inhabited range.
    # Its mouth now joins the clear side street at the actual door baseline.
    l['roads']=[r for r in l['roads'] if r['rect']!=[1704,432,72,24]]
    # Every exposed rear has an aligned48px legal yard and a rear boundary.
    for b in l['lots']:
        x=b['x'];w=b['spec']['width']*48;base=b['base'];b['footprint']=[x,base-96,w,96]
        if b['id'] in ('west-0','west-1','north-middle-1','merchant-0','merchant-3','merchant-5','south-L-0','south-L-1'):
            own=b['id']+'-legal-yard';yard=[x,base-144,w,48]
            l['plots'].append(dict(id=own,principal=b['id'],front=b['footprint'],yard=yard,rear=[x,base-192,w,48],passage=[x+w-24,base-144,24,48]))
            for dx in (0,w-8):prop('fence-1',x+dx,base-96,crop=[7,0,15,48],owner=own)
            for j,xx in enumerate(range(x,x+w,48)):prop(['fence-h-b-c4','fence-h-c-c4'][j%2],xx,base-120,owner=own)
            prop('yard-'+str(1+(x//48)%3),x+8,base-100,crop=[0,20,min(32,w-16),48],owner=own)
    # A visible96px transverse rear range closes the northwest L beside its
    # intentionally exposed service court; no rectangular wall under an L cap.
    l['courts'].append(dict(id='west-rear-court',rect=[240,432,96,48],access=[312,432,24,48]))
    prop('fence-1',240,480,crop=[7,0,15,48],owner='west-rear-court')
    prop('yard-1',264,476,crop=[0,20,24,48],owner='west-rear-court')
    # Clear the full church side door to the actual cathedral foot at1056.
    for p in l['props']:
        if p.get('id')=='church-east-door':
            p.update(base=1008,footprint=[672,960,48,48],entrance=[720,1000],painted_threshold=[9,39,34,29],landing_anchor_local=[48,40],foreground_mask=[0,0,37,35],sort_base=1057)
        if p.get('id')=='guard-notice':p['file']='guard-notice-c5r1'
    for r in l['roads']:
        if r['rect']==[720,912,48,96]:r['rect']=[720,960,48,96]
    # North-wall recesses have visible backs and returns, with48px mouths.
    for x,own in [(672,'north-recess'),(1296,'guard-recess')]:
        prop('fence-h-b-c4',x,312,owner=own)
        prop('fence-1',x,336,crop=[7,0,15,48],owner=own)
    l['props']=[p for p in l['props'] if not(p.get('owner')=='north-recess' and p['file'] in ('fence-1','fence-h-b-c4'))]
    prop('fence-h-b-c4',720,312,owner='north-recess');prop('fence-1',760,336,crop=[7,0,15,48],owner='north-recess')
    # Main road's width change is a destination-led bend with a built edge.
    l['features']['critic1']='Ground-aligned yards; continuous two-bay lane returns; southern L elbow; enclosed east service court; human-scale civic entries.'
    return l


def c5_contacts(l):
    """Register drawn coping columns to the actual lower roof silhouette."""
    for b in l['lots']:
        s=b['spec'];s['returns']=[];s['roof_contacts']=[];s['abutments']=[];s.pop('flashing_y',None)
        a,_=c5_build(s);b['painted']=[b['x'],b['base']-a.height,a.width,a.height];b['overhang']=[b['x'],b['base']-a.height,a.width,max(0,a.height-96)]
    for b in l['lots']:
        if b['spec'].get('complete_file'):continue
        for q in l['lots']:
            if b is q or not any(e['axis']=='vertical' for e in shared_ground_edges(b,q)):continue
            side='right' if b['x']+b['spec']['width']*48==q['x'] else 'left' if q['x']+q['spec']['width']*48==b['x'] else None
            if not side or b['base']-b['spec']['floors']*48>=q['base']-q['spec']['floors']*48:continue
            b['spec']['returns'].append(side)
            b['spec']['roof_contacts'].append(dict(side=side,roof=q['spec']['roof_file'],top=q['painted'][1]-b['painted'][1],neighbour=q['id']))
    return l


def c5_place_activities(l):
    """Saved-art occupancy includes every stationary person, not just props."""
    reserved=Image.new('L',tuple(l['size']));paint=Image.new('L',tuple(l['size']))
    for r in l['roads']:
        if r.get('clear'):
            x,y,w,h=r['rect'];reserved.paste(255,(x,y,x+w,y+h))
    for b in l['lots']+l['props']:
        if b.get('role') or b.get('file','').startswith('person'):continue
        a=c5_build(b['spec'])[0] if 'spec' in b else c4_owned_prop(l,b);q=Image.new('L',paint.size);q.paste(a.getchannel('A'),(b['x'],b['base']-a.height));paint=ImageChops.lighter(paint,q)
        if b.get('entrance'):
            x,y=b['entrance'];di=b.get('entrance_direction','S');w=48 if b.get('id') in ('cathedral','guildhall','gate-road-inn','church-east-door') else 24;h=48 if w==48 else 32
            box=(x-w//2,y,x+w//2,y+h)
            if di=='E':box=(x,y-w//2,x+h,y+w//2)
            if di=='W':box=(x-h,y-w//2,x,y+w//2)
            if di=='N':box=(x-w//2,y-h,x+w//2,y)
            reserved.paste(255,box)
    unavailable=ImageChops.lighter(reserved,paint);moves=[]
    # Vendors already stand behind their own counters; seated visitor uses bench.
    for p in l['props']:
        if not (p.get('role') or p.get('file','').startswith('person')):continue
        a=r_prop_image(p);mask=a.getchannel('A');x0,y0=p['x'],p['base'];box=(x0,y0-a.height,x0+a.width,y0)
        if not ImageChops.multiply(mask,reserved.crop(box)).getbbox():continue
        offsets=sorted(((dx,dy) for dx in range(-384,385,4) for dy in range(-384,385,4)),key=lambda v:abs(v[0])+abs(v[1]))
        for dx,dy in offsets:
            x,y=x0+dx,y0+dy;box=(x,y-a.height,x+a.width,y)
            if x<144 or x+a.width>1776 or y-a.height<288 or y>1392:continue
            if not ImageChops.multiply(mask,unavailable.crop(box)).getbbox():
                p.update(x=x,base=y);moves.append(dict(id=p.get('id',p.get('role')),before=[x0,y0],after=[x,y]));q=Image.new('L',unavailable.size);q.paste(mask,(x,y-a.height));unavailable=ImageChops.lighter(unavailable,q);break
        else:raise ValueError(('No clear activity pocket',p))
    l['activity_moves']=moves;return l



def c5_ground(l):
    im=repeat(asset('cobble-c3'),tuple(l['size']));im.paste(repeat(asset('ditch-c3'),(1920,96)),(0,0))
    def field(n,rect):
        x,y,w,h=rect;a=asset(n);im.paste(repeat(a,(w+a.width,h+a.height)).crop((x%a.width,y%a.height,x%a.width+w,y%a.height+h)),(x,y))
    for p in l['plots']:field('workyard-c4',p['yard'])
    for p in l['courts']:field('workyard-c4',p['rect'])
    field('workyard-c4',[1392,624,144,48])
    for r in l['roads']:
        if r['kind']=='main':field('main-paving-c4',r['rect'])
        elif r['kind']=='lane':field('workyard-c4',r['rect'])
    field('square-slabs-c5',l['square']);field('workyard-c4',l['square_notch'])
    # Kerbs use only painted edge strips; joins omit the redundant interior edge.
    routes=[r for r in l['roads'] if r['kind']!='square']
    def at(x,y):return any(rx<=x<rx+rw and ry<=y<ry+rh for rx,ry,rw,rh in (r['rect'] for r in routes))
    for r in routes:
        x,y,w,h=r['rect'];t=asset(r['file']);k=2
        if r['horizontal']:
            t=t.transpose(Image.Transpose.ROTATE_90)
            for xx in range(x,x+w):
                for sy,dy,oy in ((0,y,y-1),(t.height-k,y+h-k,y+h)):
                    if not at(xx,oy):im.paste(t.crop((xx%t.width,sy,xx%t.width+1,sy+k)),(xx,dy))
        else:
            for yy in range(y,y+h):
                for sx,dx,ox in ((0,x,x-1),(t.width-k,x+w-k,x+w)):
                    if not at(ox,yy):im.paste(t.crop((sx,yy%t.height,sx+k,yy%t.height+1)),(dx,yy))
    return im


def c5_render(l,reveal=False):
    """Base-row composition; projected native caster paint is unioned once."""
    im=c5_ground(l);ordered=[];records=[];casts=Image.new('L',im.size);occupied=Image.new('L',im.size)
    for b in l['lots']:
        a,parts=c5_build(b['spec'])
        if reveal and b.get('foreground_mask'):
            a=a.copy();a.paste((0,0,0,0),tuple(b['foreground_mask']))
        ordered.append([b['base'],0,b['x'],b['base']-a.height,a,b['id'],b]);records.append(dict(id=b['id'],parts=parts,painted=[b['x'],b['base']-a.height,a.width,a.height],footprint=b['footprint'],entrance=b.get('entrance')))
    # Suppress just one redundant contour pixel; never change48px lot pitch.
    for e in ordered:
        base,z,x,y,a,ident,b=e
        for f in ordered:
            if f is e or f[2]+f[4].width!=x:continue
            fy,fa=f[3],f[4];a=a.copy()
            for yy in range(max(y,fy),min(base,f[0])):
                left=fa.getpixel((fa.width-1,yy-fy));right=a.getpixel((0,yy-y))
                if left[3] and right[3] and sum(left[:3])<310 and sum(right[:3])<310:
                    donor=a.getpixel((1,yy-y))
                    if donor[3]:a.putpixel((0,yy-y),donor)
            e[4]=a
    for p in l['props']:
        a=c4_owned_prop(l,p);priority=p.get('layer',1)
        if p.get('wall'):priority=3 if 'tower' in p['file'] or p.get('id')=='gatehouse' else 2 if p.get('attachment') else -1
        if reveal and p.get('foreground_mask'):
            a=a.copy();a.paste((0,0,0,0),tuple(p['foreground_mask']))
        ordered.append([p.get('sort_base',p['base']),priority,p['x'],p['base']-a.height,a,p.get('id',p['file']),p])
    # Continuous wall masonry owns internal contacts; tower jambs retain their
    # one true exposed silhouette. Never shrink pitch or overlap full sprites.
    for e in ordered:
        if not e[6].get('wall'):continue
        for f in ordered:
            if e is f or not f[6].get('wall') or f[2]+f[4].width!=e[2]:continue
            a=e[4].copy();fy,fa=f[3],f[4]
            for yy in range(max(e[3],fy),min(e[3]+a.height,fy+fa.height)):
                p=fa.getpixel((fa.width-1,yy-fy));q=a.getpixel((0,yy-e[3]))
                if p[3] and q[3]:
                    donor=a.getpixel((1,yy-e[3]))
                    if donor[3]:a.putpixel((0,yy-e[3]),donor)
            e[4]=a
    shadow_records=[]
    for base,z,x,y,a,ident,b in ordered:
        q=Image.new('L',im.size);q.paste(a.getchannel('A'),(x,y));occupied=ImageChops.lighter(occupied,q)
        if b.get('role') or b.get('file')=='person':continue
        # Project the WHOLE drawn caster, including roofs, crenels and tower
        # profiles. Its row height controls the southeast displacement; no
        # generic bottom slice and no generated shape/noise replaces the drawing.
        alpha=a.getchannel('A');depth=max(6,round(a.height*.125));dx=max(3,round(a.height*.09))
        if ident=='fountain':
            foot=asset('fountain-shadow-c5').getchannel('A');depth=foot.height;dx=0
        else:
            foot=Image.new('L',(a.width,depth+1))
            for sy in range(a.height-1,-1,-1):
                altitude=a.height-1-sy;oy=round(altitude*.125);ox=round(altitude*.09)
                if ox>=a.width:continue
                row=alpha.crop((0,sy,a.width-ox,sy+1));existing=foot.crop((ox,oy,a.width,oy+1));row=ImageChops.lighter(row,existing);foot.paste(row,(ox,oy))
        # Each caster receives an explicit owned ground apron, contained in
        # its width and clipped to receiving paving after all architecture.
        ground_base=y+a.height
        if ident=='fountain':
            # Broad shadow contact overlaps the actual painted foot by one
            # row; transparency below the sprite is not a receiving edge.
            ground_base=y+alpha.getbbox()[3]-1
        receiver=[x,ground_base,a.width,depth+1]
        q=Image.new('L',im.size);q.paste(foot,(x,ground_base));casts=ImageChops.lighter(casts,q)
        shadow_records.append(dict(owner=ident,source='fountain-shadow-c5' if ident=='fountain' else b.get('file',b.get('spec',{}).get('roof_file')),receiver=receiver,owned_ground_apron=receiver,opacity=96,projection=[.09,.125],whole_caster=True,method='native full painted silhouette projected southeast; own ground apron; receiver clipping; one union'))
    casts=ImageChops.multiply(casts,ImageChops.invert(occupied));shade=Image.new('RGBA',im.size,(20,22,21,0));shade.putalpha(casts.point(lambda v:v*96//255));im.alpha_composite(shade)
    for base,z,x,y,a,ident,b in sorted(ordered,key=lambda t:(t[0],t[1],t[2])):im.alpha_composite(a,(x,y))
    return im,records,shadow_records


def c5_main():
    from collections import Counter
    l=c5_city_layout();im,records,shadows=c5_render(l)
    im.save(REVIEW/'r17-city-final.png');im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png');im.convert('L').save(REVIEW/'r17-city-final-squint.png')
    for n,box in {'square':(672,624,1392,1152),'street':(96,240,720,816),'gate':(1104,768,1776,1440)}.items():
        a=im.crop(box);a.resize((a.width*3,a.height*3),NEAREST).save(REVIEW/f'r17-city-final-crop-{n}-3x.png')
    refs=[('TODAY / literal1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / literal1x',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('ROUND17 C5 / literal1x /48px grid',im)]
    sheet=Image.new('RGBA',(sum(a.width for _,a in refs)+64,max(a.height for _,a in refs)+48),(35,39,34,255));d=ImageDraw.Draw(sheet);x=16
    for title,a in refs:d.text((x,10),title,fill='white');sheet.alpha_composite(a,(x,32));x+=a.width+16
    sheet.save(REVIEW/'r17-city-final-vs-r15-vs-today.png')
    hist=Counter(b['spec']['floors'] for b in l['lots'])
    for name,data in [('layout',l),('placements',dict(paint=records,shadows=shadows)),('layout-audit',dict(buildings=len(l['lots']),storeys=dict(hist),single_storey_fraction=hist[1]/len(l['lots'])))]: (REVIEW/f'r17-C5-{name}.json').write_text(json.dumps(data,indent=2))
    print('C5',len(l['lots']),'buildings',dict(hist))


# Cycle6: occupied property strips and destination-led circulation.
@lru_cache(maxsize=128)
def c6_end_panel(n,side,both=False):
    """Reserve a masonry margin without cutting a window, sill or doorway.

    Complete-house modules have an authored80px frontage and16px right return;
    translate that entire frontage to the opposite hand. Older96px-wide bays
    are registered to80px using the same8x BOX /64-sample mode reduction.
    """
    from collections import Counter
    donor=asset(n);a=Image.new('RGBA',donor.size);width=64 if both else 80
    if '-house-' in n and not both:
        front=donor.crop((0,0,80,48))
    else:
        if '-house-' in n:donor=donor.crop((0,0,80,48))
        reg=donor.resize((width*8,48*8),Image.Resampling.BOX);v=list(reg.get_flattened_data());raw=[];sw=width*8
        for y in range(48):
            for x in range(width):
                votes=Counter(q for yy in range(8) for q in v[(y*8+yy)*sw+x*8:(y*8+yy)*sw+x*8+8]);raw.append(min(votes,key=lambda q:(-votes[q],q)))
        front=Image.new('RGBA',(width,48));front.putdata(raw)
    a.paste(front,(16 if side=='left' else 0,0))
    return a


def c6_unlike_roofs(depth=144,tone=''):
    """Actual unlike caps joined over continuous drawn masonry/flashing.

    Each48px end and the96px middle retain their native anchor. The joint
    receivers are under the roofs, with their flashing over the contact last.
    """
    suffix='-'+tone if tone else '';d2='-d2' if depth==96 else ''
    a=Image.new('RGBA',(192,depth));parts=[]
    def put(n,x,crop=None):
        im=asset(n);im=im.crop(crop) if crop else im;a.alpha_composite(im,(x,0));parts.append(dict(file=n,x=x,crop=crop))
    # One continuous receiving face, one coping, no transparent taper or foot.
    put('receiving-wall-right-c6r1',40,[0,0,16,depth]);put('receiving-wall-left-c6r1',136,[0,0,16,depth])
    put('abutment-a'+d2+'-c6'+suffix,0)
    put('roof-merchant-'+('d2' if depth==96 else 'c')+'-c6'+suffix,48)
    put('abutment-b'+d2+'-c6'+suffix,144)
    # The thin drawn metal/stone contact belongs to each receiver, not a
    # procedural line. Use the painted two-column flashing, at native scale.
    put('abutment-b'+d2+'-c6'+suffix,46,[39,0,41,depth])
    put('abutment-b'+d2+'-c6'+suffix,142,[39,0,41,depth])
    return a,parts


def c6_build(s):
    if s.get('complete_file'):return c4_build(s)
    roof=asset(s['roof_file']);w=s['width']*48;h=roof.height+s['floors']*48
    a=Image.new('RGBA',(w,h));parts=[]
    def put(n,x,y,crop=None,layer='storey'):
        b=asset(n);b=b.crop(crop) if crop else b
        a.alpha_composite(b,(x,y));parts.append(dict(file=n,x=x,y=y,crop=crop,layer=layer))
    receiving=s.get('returns',[]) if s.get('house_family') and w==96 else []
    # One facade corner owns the16px receiver. Two-sided houses retain a
    # native16px margin each, registering the complete bay into their middle.
    for j,n in enumerate(s['panels']):
        yy=h-48*(j+1)
        if receiving and (j>0 or '-house-' in n):
            side='left' if 'left' in receiving else 'right';panel=c6_end_panel(n,side,len(set(receiving))==2)
            a.alpha_composite(panel,(0,yy));parts.append(dict(file=n,x=0,y=yy,layer='whole facade registered beside window-free masonry margin',receiving=receiving))
        else:put(n,0,yy,layer='ground' if j==0 else 'storey')
    if s.get('house_family'):
        # The receding end is the painted side of a complete house, never a
        # front-facing masonry column. Native floor-joint paint connects bays.
        family=s['house_family'];side=asset('return-house-'+family+'-c6r1')
        for j in range(s['floors'] if not receiving else 0):
            yy=h-48*(j+1);sy=48 if j==0 else 0
            hand='abc'[('abc'.index(family)+j)%3]
            # Earlier approved24px door bays end at x84. Their stone plinth
            # receives an8px return, preserving the whole opening and landing.
            rw=8 if j==0 and not s['panels'][0].startswith('ground-house-') else 16
            put('return-house-'+hand+'-c6r1',w-rw,yy,crop=[16-rw,sy,16,sy+48],layer='receding architectural return')
        for j in range(1,s['floors'] if not receiving else 1):
            # One native paint row removes a doubled connection outline; the
            # full fixed-course exports are unchanged, with no8px floor belt.
            put(s['panels'][j],0,h-48*j-1,crop=[0,1,w,2],layer='one-pixel course cleanup overlay')
    # Continuous receiving faces are native painted masonry, with one coping.
    for side in ([] if s.get('house_family') else s.get('returns',[])):
        n='party-'+side+'-c6';donor=asset(n);x=0 if side=='left' else w-12
        for y in range(roof.height,h-1):
            sy=y-roof.height;sy=sy if sy<144 else 16+(sy-16)%112
            a.paste(donor.crop((0,sy,12,sy+1)),(x,y))
        parts.append(dict(file=n,x=x,y=roof.height,layer='continuous12px masonry receiving return'))
    if s.get('house_family'):
        for side in s.get('returns',[]):
            n='receiving-wall-'+side+'-c6r1';height=h-roof.height
            # Usable ground bays retain their authored entrance coordinates.
            # Upper masonry terminates on their existing stone ground floor.
            if '-house-' not in s['panels'][0]:height-=48
            put(n,0 if side=='left' else w-16,roof.height,crop=[0,0,16,height],layer='continuous masonry receiving return')
    # Painted abutments own the empty margins of selected caps. Genuine courts
    # are separate ground properties and never part of these roof receivers.
    if s.get('close_roof') and w>=96 and not s.get('house_family'):
        tone=s.get('tone','');suffix='-'+tone if tone else ''
        for side,x in [('a',0),('b',w-48)]:
            n='abutment-'+side+('-d2' if roof.height==96 else '')+'-c6'+suffix
            put(n,x,0,layer='roof valley and receiving wall before cap')
    put(s['roof_file'],0,0,layer='roof')
    # Height contacts need both assembled silhouettes. c6_join_houses places
    # their masonry before the lower house and flashing on its painted edge;
    # a crop at the transparent roof-canvas top is not a contact.
    for p in s.get('overlays',[]):put(p['file'],p['x'],h+p.get('y_offset',-144),layer='trade sign within lot')
    put('shadow-eave-w'+str(s['width'])+'-c0',0,roof.height+1,layer='contact eave shade')
    return a,parts


def c6_city_layout():
    l=c5_city_layout();l.update(c6=True)
    def get(n):return next(b for b in l['lots'] if b['id']==n)
    def prop(n,x,base,**kw):
        p=dict(file=n,x=x,base=base,**kw);l['props'].append(p);return p
    def road(rect,kind='side',name='C6-route',clear=True):
        l['roads'].append(dict(rect=rect,kind=kind,id=name,horizontal=rect[2]>rect[3],file={'main':'street-main-c3','side':'street-side-c3','lane':'lane-c3','square':'square-slabs-c5'}[kind],clear=clear))
    def add(name,x,base,w,n,i,group,tone='',depth=96,complete=None):
        s=c5_spec(w,n,i,tone)
        if complete:s['complete_file']=complete
        b=dict(id=name,x=x,base=base,spec=s,frontage_group=group,footprint=[x,base-depth,w*48,depth],entrance=[x+(72 if w==2 else 24),base],ground_depth=depth)
        l['lots'].append(b);return b
    def change(b,x=None,base=None,w=None,n=None):
        if x is not None:b['x']=x
        if base is not None:b['base']=base
        if w is not None or n is not None:
            s=b['spec'];b['spec']=c5_spec(w or s['width'],n or s['floors'],len(l['lots'])+b['x']//48,s.get('tone',''))
        b['footprint']=[b['x'],b['base']-b.get('ground_depth',96),b['spec']['width']*48,b.get('ground_depth',96)]
        b['entrance']=[b['x']+(72 if b['spec']['width']==2 else 24),b['base']]
    # Remove obsolete property scaffolding; rebuild enclosures from actual ground.
    l['plots']=[]
    l['props']=[p for p in l['props'] if not p.get('owner','').endswith('-legal-yard') and p.get('owner') not in ('west-rear-court','south-yard','poor-yard','hall-service','north-recess','guard-recess') and p.get('id') not in ('south-shed-144','south-shed-240','north-well-bench','guard-notice','guild-service-closure')]
    l['courts']=[p for p in l['courts'] if p['id'] not in ('west-rear-court','hall-service','north-recess','guard-recess')]
    # NW side street bends around an actual built projection at its T-junction.
    get('west-lane-workshop')['spec']['complete_file']='side-house-a-c6'
    add('west-attached-middle',336,576,2,2,4,'west-side',complete='side-house-east-c5r1')
    get('west-2')['spec']['complete_file']='side-house-a-c6'
    change(get('west-2'),base=720)
    add('west-side-link',336,624,2,1,9,'west-side',depth=48)
    add('west-T-projection',432,720,1,2,10,'west-wedge')
    change(get('north-middle-0'),x=528,base=720)
    get('north-middle-0')['spec']['complete_file']='side-house-west-c6-slate'
    change(get('north-middle-1'),x=624,w=1,n=4)
    add('middle-attached-link',480,576,2,2,12,'north-middle','slate',complete='side-house-west-c6-slate')
    get('middle-side-workshop')['spec']['complete_file']='side-house-west-c5r1-slate'
    # North court remains an intentional48px working strip with a southern
    # passage. The passage is overhead-covered; support footprints exclude it.
    b=get('west-1');b['passage']=[300,432,24,288];b['footprints']=[[240,624,60,96],[324,624,12,96]];b['foreground_mask']=[60,0,84,240]
    b['entrance']=[312,720];b['spec']['panels'][0]='ground-passage-w2-c6'
    l['courts'].append(dict(id='northwest-pump-court',rect=[240,432,96,48],access=[300,432,24,288]))
    road([300,432,24,288],'lane','northwest-covered-passage')
    prop('yard-0',240,480,id='northwest-pump',owner='northwest-pump-court')
    prop('fence-1',240,480,crop=[7,0,15,48],owner='northwest-pump-court')
    prop('passage-entry-c6',288,480,id='northwest-rear-opening',owner='northwest-pump-court',foreground_mask=[12,10,36,44],overhead=True)
    # Northeast trapezoid: linked rear ranges, selected wider houses, one
    # shared alley per property group. The shrine terminates its own apron.
    get('east-lane-workshop')['spec']['complete_file']='side-house-west-c6-slate'
    add('merchant-west-link',1392,624,2,2,13,'merchant-side','slate',complete='side-house-west-c5r1-slate')
    get('merchant-2')['spec']['complete_file']='side-house-west-c6-slate'
    get('east-rear-house')['spec']['complete_file']='side-house-a-c6-slate'
    add('merchant-east-link',1680,576,2,2,14,'merchant-side','slate',complete='side-house-east-c5r1-slate')
    add('merchant-east-store',1680,624,2,1,15,'merchant-side','slate',depth=48)
    # Merge the narrow eastern sliver into a96px coherent house; keep24px
    # alley on its west and the original48px outer wall route on its east.
    l['lots']=[b for b in l['lots'] if b['id']!='merchant-4']
    change(get('merchant-5'),x=1632,w=2,n=3)
    add('merchant-end',1728,720,1,2,19,'merchant-trapezoid','slate')
    add('merchant-rear-range',1488,480,2,2,22,'merchant-rear','slate')
    add('merchant-rear-link',1488,576,2,2,23,'merchant-rear','slate')
    # Southern comb becomes two full houses with a complete48px stagger.
    l['lots']=[b for b in l['lots'] if b['id'] not in ('south-L-3','south-L-4','south-square-west','south-L-return','poor-3')]
    add('south-stagger-west',528,1248,2,2,24,'square-south')
    add('south-stagger-east',624,1296,2,3,25,'square-south')
    add('poor-east-wide',1680,1248,2,2,26,'poor-wall','brown')
    add('cobbler-attached-rear',336,912,2,2,31,'craft-rear',depth=48)
    add('poor-east-rear',1680,1152,2,2,32,'poor-wall','brown',depth=48)
    # The guildhall advances to the square. Its two closest flanks lose one
    # floor; prescribed192px frontage/allocation is unchanged.
    for name in ('square-narrow','square-smith-bay'):
        b=get(name);s=b['spec'];s['floors']-=1;s['panels']=s['panels'][:s['floors']]
    get('square-apothecary')['spec']['panels'][-2]='storey-plaster-c6'
    for p in l['props']:
        ident=p.get('id','')
        if ident in ('guildhall','guildhall-public-entry'):
            p['base']+=48
            if 'footprint' in p:p['footprint'][1]+=48
            if 'entrance' in p:p['entrance'][1]+=48
        if ident=='cathedral':
            p.update(x=528,footprint=[528,768,240,288],entrance=[624,1056],overhang=[528,624,240,144])
        if ident=='fountain':p.update(x=816,footprint=[816,912,96,96])
        if ident=='gatehouse':p['ground_footprints']=[[1176,1248,24,192],[1296,1248,24,192]]
        if ident.startswith('stall-') or ident.startswith('vendor-'):
            p['x']+=48
            if 'footprint' in p:p['footprint'][0]+=48
        if ident=='church-east-door':
            p.update(file='church-entry-a-c6',x=672,base=960,footprint=[672,912,96,48],entrance=[768,948],foreground_mask=[0,0,48,44],sort_base=1057)
        if ident=='market-hall':
            p.update(file='market-hall-b-c6',entrance=[864,1056],entrance_direction='N',foreground_mask=[0,0,192,72])
        if ident=='life-2':p.update(x=304,base=700,role='entering northwest covered passage')
        if ident=='life-0':p.update(x=900,base=716,role='guildhall visitor')
        if ident=='life-12':p.update(x=784,base=986,role='church east entry visitor')
        if ident=='merchant-shrine':p.update(x=1512,base=720)
        if ident=='market-loading-cart':p.update(x=784,base=1188,crop=[0,0,48,48],owner='market-hall-bay')
        if p.get('role')=='unloading porter':p.update(x=836,base=1190)
        if p.get('owner')=='market-loading':p.update(x=872,base=1192,owner='market-hall-bay')
        if ident.startswith('vendor-') and ident[-1:] in '345':
            j=int(ident[-1])-3;p.update(file=['vendor-weigh-c6','vendor-fold-c6','vendor-hand-c6'][j],x=960+j*48,base=872,role=['weighing goods','folding cloth','handing purchase'][j])
        if ident.startswith('north-curtain-'):p['file']='wall-curtain-'+'abc'[int(ident.rsplit('-',1)[1])%3]+'-c6'
        if ident.startswith('south-curtain-'):p['file']='wall-top-'+'bca'[int(ident.rsplit('-',1)[1])%3]+'-c6'
        if p['file'].startswith('wall-tower-') and p['file'].endswith('-c5'):p['file']=p['file'][:-1]+'6'
    for p in l['props']:
        if p.get('role')=='customer facing bread':p.update(x=978,base=850)
        if p.get('role')=='customer facing goods':p.update(x=974,base=946)
        if p.get('role')=='jug filler':p.update(x=922,base=990)
    # Continue the resolved sequence across the portal's missing wall panels.
    for i,p in enumerate(sorted((p for p in l['props'] if p.get('id','').startswith('south-curtain-')),key=lambda p:p['x'])):
        p['file']='wall-top-'+'bca'[i%3]+'-c6'
    prop('person-customer-c4',996,946,role='paired shopper at fruit counter')
    l['courts'].append(dict(id='western-churchyard',rect=[480,768,48,288],access=[480,720,48,48]))
    for base in range(816,1057,48):prop('fence-1',480,base,crop=[7,0,15,48],owner='western-churchyard')
    prop('cart-unload-c6',1536,1048,id='inn-unloading',owner='inn-court')
    prop('gate-bridge-c6',1200,1336,id='gate-bridge',sort_base=1441,wall=True,attachment=True,overhead=True,footprint=[1200,1288,96,48],foreground_mask=[0,0,96,48])
    prop('gate-landing-c6',1296,1336,id='gate-wall-landing',wall=True,attachment=True,sort_base=1441,overhead=True)
    prop('lean-to-c4',240,960,id='craft-covered-fuel',owner='craft-court',footprint=[240,912,48,48],attached_to='west-smith')
    prop('forge-smoke-c6',280,872,id='forge-cue',owner='craft-court',overhead=True)
    # Public roads are specified anew, not left as bright patches from C5.
    l['roads']=[]
    for rect in ([1200,1056,96,384],[1104,1056,192,96],[1104,768,96,288]):road(rect,'main','gate-to-square')
    road([1200,1056,96,96],'main','inn-turning-pocket')
    road([864,720,192,48],name='guildhall-forecourt')
    for rect in ([432,288,48,288],[432,576,96,48],[480,624,48,144],[432,768,48,288],[672,384,48,288],[672,672,192,48],[720,1056,48,288],[480,1056,240,48],[480,1104,48,192],[96,1008,336,48],[1344,336,48,384],[1392,720,192,48],[1584,288,48,384],[1584,672,48,96],[1632,720,144,48],[1776,768,48,288],[1488,1008,48,96],[1296,1056,192,48],[1488,1056,288,48],[912,1200,48,144]):road(rect,name='bent-side-street')
    for rect in ([144,672,96,48],[240,720,240,48],[336,720,96,48],[528,720,144,48]):road(rect,name='northwest-T-arms')
    for rect in ([300,432,24,288],[384,1104,24,144],[1656,1104,24,144],[1608,384,24,240]):road(rect,'lane','shared-private-passage')
    for rect in ([288,912,48,96],[1488,864,48,192],[720,960,48,96],[768,912,48,96],[720,696,48,48],[1512,720,48,96],[1776,624,96,48]):road(rect,name='destination-apron')
    for x in (96,1776):
        for y,h in ((288,336),(624,384),(1008,336)):road([x,y,48,h],name='wall-service')
    for x,w in ((96,336),(432,384),(816,384),(1200,384),(1584,240)):road([x,240,w,48],name='north-wall-lane')
    for x,w in ((96,288),(576,192),(960,144),(1392,144),(1728,96)):road([x,1344,w,48],name='south-wall-lane')
    for x in (432,816,1584):
        for rect in ([x-48,1248,192,48],[x-48,1296,48,96],[x+96,1296,48,96]):road(rect,name='tower-service-turn')
    for rect in ([1104,1200,48,192],[1104,1200,288,48],[1344,1200,48,144]):road(rect,name='gate-inner-service')
    road([672,288,48,96],name='north-court-T')
    road([1008,288,48,240],name='guild-rear-service')
    road(l['square'],'square','square',False)
    # Actual short rear plots with closed boundaries and one shared passage.
    for idx,name in enumerate(('west-0','west-1','north-middle-1','square-baker','square-apothecary','merchant-0','merchant-3','merchant-5','south-L-0','south-L-1','south-stagger-west','poor-0','poor-east-wide')):
        b=get(name);x,y,w,d=b['footprint'];own=name+'-property';yard=[x,y-48,w,48]
        l['plots'].append(dict(id=own,principal=name,front=b['footprint'],yard=yard,rear=[x,y-96,w,48],passage=[x+w-24,y-48,24,48]))
        for xx in range(x,x+w,48):
            fence='fence-h-'+('b' if idx%2 else 'c')+'-c4'
            if name=='west-1' and xx==288:
                prop(fence,xx,y-24,crop=[0,0,12,48],owner=own,architectural=True)
                prop(fence,xx+36,y-24,crop=[36,0,48,48],owner=own,architectural=True)
            else:prop(fence,xx,y-24,owner=own,architectural=True)
        for xx in (x,x+w-8):prop('fence-1',xx,y,crop=[7,0,15,48],owner=own,architectural=True)
        if idx%3==0:prop('lean-to-c4',x,y-48,owner=own,attached_to=name)
        else:prop('yard-'+str(1+idx%3),x+8,y-4,crop=[0,20,min(32,w-16),48],owner=own,attached_to=name)
    # Architectural strips close gaps between side houses and rear wings.
    for x,base,own in [(240,576,'northwest-pump-court'),(1632,480,'merchant-rear'),(1392,1152,'poor-yard'),(1680,1152,'poor-yard')]:
        prop('fence-0',x,base,owner=own);prop('fence-1',x,base,crop=[7,0,15,48],owner=own)
    # Exact96px roofs and quiet coherent upper floors replace selected slivers.
    upper=['storey-merchant-a-c6','storey-plaster-c6','storey-merchant-b-c6','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-arrangement-a-c4-w2','storey-arrangement-b-c4-w2','storey-arrangement-c-c4-w2','storey-timber-w2-c0','storey-plaster-w2-c0','storey-stone-w2-c0','storey-oriel-w2-c0']
    for idx,b in enumerate(l['lots']):
        s=b['spec'];w=s['width'];tone=s.get('tone','');suffix='-'+tone if tone else ''
        if not s.get('complete_file') and w==2:
            # Native course count makes the upper structure coherent; choose
            # different whole arrangements rather than red panel bevels.
            s['panels'][1:]=[upper[(idx*3+j)%len(upper)] for j in range(s['floors']-1)]
            s['roof_file']=['roof-merchant-c-c6','roof-merchant-d2-c6','roof-hip-c5-w2'][idx%3]+suffix
            s['close_roof']=True
        if b['id']=='square-apothecary':s['panels'][s['floors']-4]='storey-plaster-c6'
        trade={'square-baker':'baker','square-apothecary':'apothecary','west-smith':'smith','west-cobbler':'cobbler'}.get(b['id'])
        if trade:s['panels'][0]='ground-'+trade+'-entry-c6';b['entrance']=[b['x']+72,b['base']]
        if b['id']=='gate-road-inn':s['panels'][0]='inn-porch-b-c6';b['entrance']=[b['x']+24,b['base']]
        for ov in s.get('overlays',[]):
            if ov['file'] in ('sign-tailor-c4','sign-scribe-c4'):ov['file']=ov['file'].replace('-c4','-c6')
        b['footprint']=[b['x'],b['base']-b.get('ground_depth',96),w*48,b.get('ground_depth',96)]
        b['painted']=[b['x'],b['base']-c6_build(s)[0].height,w*48,c6_build(s)[0].height]
    # Restore sign niches so full-sized signs never cover an entrance/window.
    for b in l['lots']:
        s=b['spec']
        if s.get('overlays') and s['width']==2:
            for j in range(1,min(3,len(s['panels']))):s['panels'][j]='storey-sign-bay-v'+str((b['x']//48+j)%6)+'-c5-w2'
    get('square-apothecary')['spec']['panels'][3]='storey-plaster-c6'
    get('square-smith-bay')['spec']['panels'][1]='storey-plaster-w1-c0'
    get('merchant-5')['spec']['panels'][1]='storey-arrangement-b-c4-w2'
    for name in ('south-stagger-west','south-stagger-east'):get(name)['spec']['roof_file']='roof-merchant-d2-c6'
    l=c5_contacts(l)
    # Wider exposed return on every stagger, within its own property.
    for b in l['lots']:
        if b['id'] in ('south-stagger-west','south-stagger-east','merchant-5'):
            b['spec']['returns']=list(set(b['spec'].get('returns',[])+['right']))
    l['clear_routes']=[r['rect'] for r in l['roads'] if r.get('clear')]
    l['features'].update(cycle='C6',layout='built NW48px elbow/T; connected side/rear ranges; northeast stepped trapezoid; southern96px houses with48px whole-building stagger; inn on continuous96px gate elbow; uneven wall towers',shadow='hard southeast projection of drawn structural caster, owned receivers, one opacity union',guildhall_base=720,gate_turn=[1200,1056,96,96])
    return c6_critic2_layout(c6_critic1_layout(l))


def c6_critic1_layout(l):
    """Close real properties; remove stacked independent roofs and false routes."""
    def get(n):return next(b for b in l['lots'] if b['id']==n)
    def prop(file,x,base,**kw):
        p=dict(file=file,x=x,base=base,**kw);l['props'].append(p);return p
    def road(rect,name,kind='side'):
        l['roads'].append(dict(id=name,rect=rect,kind=kind,horizontal=rect[2]>rect[3],file={'side':'street-side-c3','lane':'lane-c3','main':'street-main-c3'}[kind],clear=True))
    def add(name,x,base,w,n,i,tone='',group='closed-rear'):
        b=dict(id=name,x=x,base=base,spec=c5_spec(w,n,i,tone),frontage_group=group,ground_depth=96,footprint=[x,base-96,w*48,96],entrance=[x+24,base]);l['lots'].append(b);return b
    # A single front and a single rear range enclose a strip. The former
    # intermediate whole houses repeatedly restarted roofs over living floors.
    removed={'west-attached-middle','west-side-link','middle-attached-link','merchant-west-link','merchant-east-link','merchant-east-store','merchant-rear-link','poor-east-rear','cobbler-attached-rear'}
    l['lots']=[b for b in l['lots'] if b['id'] not in removed]
    get('merchant-rear-range')['base']=480
    get('merchant-rear-range')['spec']['floors']=2
    get('merchant-3')['spec']['floors']=3
    get('poor-east-wide')['base']=1248
    # Side houses remain separate, readable volumes with one roof apiece.
    get('east-rear-house')['x']=1680
    get('merchant-5')['spec']['floors']=2
    # Restore civic hierarchy: neighbouring roof shoulders stop below the hall.
    for name in ('square-baker','square-apothecary','merchant-0'):
        b=get(name);b['spec']['floors']=3
    for name in ('square-narrow','square-smith-bay'):
        b=get(name);b['spec']['floors']=3
    add('hall-rear-west',864,432,2,2,41,'','hall-rear')
    add('hall-rear-east',960,432,2,2,42,'','hall-rear')
    # A physical southern L links the formerly isolated comb across its gap.
    add('south-elbow-neck',384,1248,1,2,43,'brown','south-L')
    add('south-elbow-house',432,1200,2,2,44,'brown','south-L')
    # A northern roofed range closes the northeast property strip; two joined
    # rear homes are offset from the front ridges, rather than piled over them.
    add('northeast-rear-west',1200,432,2,2,45,'slate','merchant-rear')
    add('northeast-rear-end',1296,432,1,2,46,'slate','merchant-rear')
    for name,x,base,w,n,i,tone,group in [
        ('west-rear-shoulder',144,432,2,2,47,'','west-rear'),
        ('middle-rear-east',576,432,1,2,48,'slate','north-middle'),
        ('baker-rear-house',720,432,2,2,49,'','civic-rear'),
        ('baker-rear-end',816,432,1,2,50,'','civic-rear'),
        ('apothecary-rear-house',1104,432,2,2,51,'slate','merchant-rear'),
        ('inn-rear-west',1200,864,2,2,52,'','inn-rear'),
        ('inn-rear-middle',1296,864,2,2,53,'','inn-rear'),
        ('inn-rear-east',1392,864,2,2,54,'','inn-rear'),
        ('tailor-rear',1584,864,2,2,55,'','east-craft-rear'),
        ('scribe-rear',1680,864,2,2,56,'','east-craft-rear'),
        ('poor-rear-west',1392,1200,2,1,57,'brown','poor-wall')]:
        add(name,x,base,w,n,i,tone,group)
    get('west-rear-range')['spec']['floors']=2
    for name in ('inn-rear-west','inn-rear-middle','inn-rear-east','tailor-rear','scribe-rear'):
        b=get(name);b['base']=816;b['ground_depth']=48;b['spec']['floors']=1
    # Replace only selected scene panels; the approved source exports stay put.
    upper=['storey-house-a-c6r1','storey-house-b-c6r1','storey-house-c-c6r1','storey-merchant-a-c6','storey-plaster-c6','storey-merchant-b-c6','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-arrangement-a-c4-w2','storey-arrangement-b-c4-w2','storey-arrangement-c-c4-w2','storey-timber-w2-c0','storey-plaster-w2-c0','storey-stone-w2-c0','storey-oriel-w2-c0']
    for idx,b in enumerate(l['lots']):
        s=b['spec'];s['c6']=True;s['join_phase']=idx;n=s['floors'];w=s['width'];s['panels']=s['panels'][:n]
        if not s.get('complete_file') and w==2:
            family='abc'[idx%3];tone=s.get('tone','');suffix='-'+tone if tone else ''
            s.update(house_family=family,close_roof=False,roof_file='roof-house-'+family+'-c6r1'+suffix)
            s['panels'][1:]=[upper[(idx*3+j)%len(upper)] for j in range(n-1)]
            # Full paired floor arrangements are retained where the reference
            # comparisons exposed front-pilaster stacks.
            if b['id'] in ('west-0','merchant-3','south-stagger-west','south-stagger-east'):
                s['panels'][0]='ground-house-'+family+'-c6r1'
            if s.get('overlays'):
                for j in range(1,min(n,3)):s['panels'][j]='storey-sign-bay-v'+str((idx+j)%6)+'-c5-w2'
            if b['id']=='square-apothecary':s['panels'][-1]='storey-plaster-c6'
        elif not s.get('complete_file') and w==1:
            tone=s.get('tone','');s['roof_file']='roof-narrow-'+'ab'[idx%2]+'-c6r1'+('-'+tone if tone else '')
        while len(s['panels'])<n:s['panels'].append(upper[(idx+len(s['panels']))%len(upper)])
        b['footprint']=[b['x'],b['base']-b.get('ground_depth',96),48*w,b.get('ground_depth',96)]
        b['entrance']=[b['x']+(72 if w==2 else 24),b['base']]
        b['painted']=[b['x'],b['base']-c6_build(s)[0].height,48*w,c6_build(s)[0].height]
    get('west-1')['entrance']=[312,720]
    get('gate-road-inn')['entrance']=[1320,1056]
    get('west-1')['spec']['panels'][0]='ground-passage-w2-c6'
    # Delete inherited overlapping carts, obsolete strip fencing and the floating
    # upper doorway. Purposeful court props are retained within their enclosure.
    l['props']=[p for p in l['props'] if not p.get('owner','').endswith('-property') and not (p.get('owner')=='inn-court' and p['file']=='cart') and p.get('id') not in ('guildhall-public-entry','inn-storage','gate-toll-bay')]
    for p in l['props']:
        ident=p.get('id','')
        if ident=='guildhall':p.update(file='guildhall-c6r1',base=720,entrance=[960,720])
        if ident=='church-east-door':p.update(file='church-porch-c6r1',x=672,base=1056,footprint=[672,960,96,96],entrance=[752,1056],sort_base=1057,foreground_mask=[0,0,44,42])
        if ident=='forge-cue':p.update(x=290,base=844,sort_base=913)
        if ident=='gate-wall-landing':p.update(base=1368,sort_base=1442)
        if ident=='gatehouse':p.update(assembly_cutouts=[[24,208,120,248]],foreground_mask=[24,0,120,344])
        if ident=='life-12':p.update(x=770,base=1048)
        if ident=='inn-unloading':p.update(x=1536,base=1048,sort_base=1057)
        # Actual tower feet project48px into the old straight service strip.
        if ident.startswith('north-tower-') and p['x'] not in (0,1824):
            p['base']=288;p['footprint'][1]+=48
    prop('gate-stair-lower-c6r1',1296,1416,id='gate-walk-stair',wall=True,attachment=True,sort_base=1442,overhead=True)
    # Repeated boundaries have three actual construction motifs, not aliases.
    church=sorted([p for p in l['props'] if p.get('owner')=='western-churchyard'],key=lambda p:p['base'])
    for i,p in enumerate(church):
        p['file']=['fence-1','fence-0','yard-boundary-stone-c6r1'][i%3]
        p['crop']=[7,0,15,48] if i%3==0 else [0,0,8,24] if i%3==1 else [0,0,8,48]
        if i%3==1:
            # A horizontal fence post contains24px of drawn upright; two
            # native copies complete a48px boundary without synthesizing art.
            p['crop']=[0,0,8,24];prop('fence-0',p['x'],p['base']-24,crop=[0,0,8,24],owner='western-churchyard-post')
    # Real bent wall lane, with elbows around the four protruding tower bases.
    l['roads']=[r for r in l['roads'] if r['id'] not in ('north-wall-lane','guild-rear-service','wall-service') and r['rect'] not in ([384,1104,24,144],[672,288,48,96],[480,1104,48,192],[1776,768,48,288],[1776,624,96,48])]
    cursor=96
    for x in (336,768,1056,1488):
        if x-48>cursor:road([cursor,240,x-48-cursor,48],'north-wall-lane')
        road([x-48,240,48,96],'north-wall-elbow')
        road([x-48,288,192,48],'north-wall-offset')
        road([x+96,240,48,96],'north-wall-elbow')
        cursor=x+144
    road([cursor,240,1824-cursor,48],'north-wall-lane')
    # The side service lanes follow the actual curtain recesses and tower
    # projections too; no chopped-up records disguise a straight long corridor.
    for rect in ([48,240,96,48],[48,288,48,192],[48,480,96,48],[96,480,48,240],[48,672,96,48],[48,720,48,144],[48,864,96,48],[96,864,48,240],[48,1056,96,48],[48,1104,48,144],[48,1248,96,48],[96,1248,48,144]):road(rect,'west-wall-service-bend')
    for rect in ([1776,240,96,48],[1824,288,48,96],[1776,384,96,48],[1776,384,48,240],[1776,576,96,48],[1824,624,48,192],[1776,816,96,48],[1776,816,48,240],[1776,1008,96,48],[1824,1056,48,192],[1776,1248,96,48],[1776,1248,48,144]):road(rect,'east-wall-service-bend')
    # Storage swaps to the property side of that lane, still outside its clear48px.
    for p in l['props']:
        if p.get('owner')=='east-wall-service-court':
            p['x']-=48
            if 'footprint' in p:p['footprint'][0]-=48
            if p['base']==624:p['base']=672
            if p['file'].startswith('lean-to'):p['footprint']=[p['x'],p['base']-48,48,48]
    for court in l['courts']:
        if court['id']=='east-wall-service-court':court['rect']=[1776,624,48,144]
    road([384,1056,48,96],'southern-L-bend')
    road([384,1056,144,48],'southern-L-bend')
    road([336,1104,96,48],'southern-L-dead-end')
    road([336,1104,48,96],'southern-L-dead-end')
    road([528,288,144,48],'northwest-rear-access')
    road([864,432,192,48],'hall-rear-access')
    # Close every working strip with two side boundaries and a continuous rear
    # boundary. The front is an occupied building; a24px opening has a destination.
    l['plots']=[]
    strips=[('northwest-strip',[240,432,96,96],'west-1'),('middle-strip',[480,480,192,96],'north-middle-0'),('hall-strip',[720,432,336,96],'hall-rear-west'),('apothecary-strip',[1104,432,240,96],'square-apothecary'),('northeast-strip',[1392,528,192,96],'merchant-2'),('east-strip',[1632,480,144,96],'merchant-5'),('southwest-strip',[144,1056,240,96],'south-L-0'),('inn-back-strip',[1200,864,288,96],'gate-road-inn'),('east-trade-strip',[1584,864,192,96],'east-scribe'),('south-east-strip',[1680,1104,96,48],'poor-east-wide')]
    for i,(name,rect,principal) in enumerate(strips):
        x,y,w,h=rect;l['plots'].append(dict(id=name,principal=principal,yard=rect,front=get(principal)['footprint'],rear=[x,y-48,w,48],passage=[x+w-24,y,24,h],closed=True))
        for j,xx in enumerate(range(x,x+w,48)):
            prop(['fence-0','fence-h-b-c4','fence-h-c-c4'][(i+j)%3],xx,y+24,owner=name,architectural=True,id=name+'-north-'+str(j))
        for side,xx in enumerate((x,x+w-8)):
            for j,base in enumerate(range(y+48,y+h+1,48)):
                nn=['fence-1','yard-boundary-stone-c6r1','fence-1'][(i+j+side)%3]
                crop=[7,0,15,48] if nn=='fence-1' else None
                prop(nn,xx,base,owner=name,architectural=True,**({'crop':crop} if crop else {}))
        if name=='south-east-strip':
            prop('lean-to-c4',x,y+48,owner=name,attached_to=principal,footprint=[x,y,48,48])
        prop('yard-'+str(1+i%3),x+48,y+h-8,owner=name,crop=[0,16,32,48],attached_to=principal)
    # The northwest pump passage remains visibly open at its northern gate.
    l['props']=[p for p in l['props'] if p.get('id')!='northwest-strip-north-1']
    prop('lean-to-c4',384,912,owner='craft-court',attached_to='west-cobbler',footprint=[384,864,48,48])
    prop('lean-to-c4',1728,528,owner='east-strip',attached_to='east-rear-house',footprint=[1728,480,48,48])
    prop('lean-to-c4',1392,1248,owner='poor-yard',attached_to='poor-rear-west',footprint=[1392,1200,48,48])
    prop('lean-to-c4',1392,576,owner='northeast-strip',attached_to='east-lane-workshop',footprint=[1392,528,48,48])
    prop('fence-0',336,1200,owner='southwest-strip',id='southern-dead-end-court-gate')
    # Resolve vertical boundary sequences globally, including inherited ends.
    from collections import defaultdict
    fences=defaultdict(list)
    for p in l['props']:
        a=r_prop_image(p)
        if p['file'].startswith(('fence-','yard-boundary-')) and a.width<=8 and a.height==48:fences[p['x']].append(p)
    for xx,row in fences.items():
        row.sort(key=lambda p:p['base'])
        for i,p in enumerate(row):
            p['file']=['fence-1','yard-boundary-stone-c6r1','yard-boundary-wood-c6r1'][i%3]
            if i%3==0:p['crop']=[7,0,15,48]
            else:p.pop('crop',None)
    # A broad transverse roof closes the civic rear apron without another tall
    # facade; yard ground stays separately owned and visibly enclosed.
    l['clear_routes']=[r['rect'] for r in l['roads'] if r.get('clear')]
    l['features'].update(critic1='closed rear boundaries; actual tower-foot lane bends; southern L neck; no overlapping whole-house roof columns',guildhall_body='broad192px stone arcade within192px frontage',church_steps='solid masonry porch reaches cathedral ground baseline1056')
    get('south-stagger-west')['spec']['house_family']='c'
    return c5_contacts(l)


def c6_critic2_layout(l):
    """Attach each rear strip to real masonry and close its physical perimeter."""
    def get(n):return next(b for b in l['lots']+l['props'] if b.get('id')==n)
    def prop(file,x,base,**kw):
        p=dict(file=file,x=x,base=base,**kw);l['props'].append(p);return p
    # These are commercial frontages on the square/side street, not low sheds.
    upper=['storey-house-a-c6r1','storey-house-b-c6r1','storey-house-c-c6r1','storey-recessed-c4-w2','storey-shuttered-c4-w2','storey-arrangement-a-c4-w2','storey-arrangement-b-c4-w2','storey-arrangement-c-c4-w2','storey-merchant-a-c6','storey-merchant-b-c6']
    for i,name in enumerate(('inn-rear-west','inn-rear-middle','inn-rear-east','tailor-rear','scribe-rear')):
        b=get(name);s=b['spec'];n=3 if i<3 else 2
        s['floors']=n;s['panels']=s['panels'][:1]+[upper[(i*2+j)%len(upper)] for j in range(n-1)]
    # Replace the destructive rectangle with drawn bearing paint. The original
    # shafts remain whole; the old cap is covered, never cut out of the towers.
    for p in l['props']:
        if p.get('id')=='gatehouse':
            p.pop('assembly_cutouts',None)
        if p.get('owner')=='northwest-strip' and p['file'].startswith('yard-'):
            p['x']=248
    prop('gate-bearing-c6r2',1200,1320,id='gate-bearing',sort_base=1440.5,wall=True,attachment=True,overhead=True,foreground_mask=[0,0,96,64])
    oldowners={p['id'] for p in l['plots']}|{'western-churchyard','western-churchyard-post'}
    l['props']=[p for p in l['props'] if not (p.get('owner') in oldowners and p['file'].startswith(('fence-','yard-boundary-')))]
    # A front and a rear range may each own a48/96px yard. Opposing rear
    # strips share a fence; none stops short with an unassigned paving gap.
    l['plots']=[]
    strips=[
      ('nw-rear',[240,432,96,96],'west-rear-range','north'),
      ('nw-front',[240,528,96,96],'west-1','south'),
      ('middle-west',[480,480,48,96],'middle-side-workshop','north'),
      ('middle-rear',[528,480,48,96],'middle-side-workshop','north'),
      ('middle-front',[528,576,96,48],'north-middle-0','south'),
      ('middle-east-rear',[576,432,48,96],'middle-rear-east','north'),
      ('middle-east-front',[576,528,48,48],'north-middle-0','linked'),
      ('middle-tall',[624,480,48,96],'north-middle-1','south'),
      ('baker-back',[720,432,96,48],'baker-rear-house','north'),
      ('baker-front',[720,480,96,96],'square-baker','south'),
      ('baker-narrow-back',[816,432,48,48],'baker-rear-end','north'),
      ('baker-narrow-front',[816,480,48,96],'square-narrow','south'),
      ('hall-west',[864,480,96,48],'guildhall','south'),
      ('hall-east',[960,480,96,48],'guildhall','south'),
      ('apothecary-back',[1104,432,96,48],'apothecary-rear-house','north'),
      ('apothecary-front',[1104,480,96,96],'square-apothecary','south'),
      ('merchant-back',[1200,432,96,48],'northeast-rear-west','north'),
      ('merchant-front',[1200,480,96,96],'merchant-0','south'),
      ('merchant-narrow-back',[1296,432,48,48],'northeast-rear-end','north'),
      ('merchant-narrow-front',[1296,480,48,96],'merchant-1','south'),
      ('ne-side',[1392,528,96,96],'merchant-2','south'),
      ('ne-front',[1488,480,96,96],'merchant-3','south'),
      ('east-west',[1632,528,96,96],'merchant-5','south'),
      ('east-back',[1680,480,96,48],'east-rear-house','north'),
      ('east-end',[1728,528,48,96],'merchant-end','south'),
      ('sw-west-back',[144,1056,96,48],'south-L-0','linked'),
      ('sw-west-front',[144,1104,96,96],'south-L-0','south'),
      ('sw-middle-back',[240,1056,96,96],'south-L-1','linked'),
      ('sw-middle-front',[240,1152,96,96],'south-L-1','south'),
      ('sw-end',[336,1152,48,48],'south-L-2','south'),
      ('inn-west-back',[1200,816,96,48],'inn-rear-west','north'),
      ('inn-west-front',[1200,864,96,96],'inn-square-wing','south'),
      ('inn-middle-back',[1296,816,96,48],'inn-rear-middle','north'),
      ('inn-middle-front',[1296,864,96,96],'gate-road-inn','south'),
      ('inn-east-back',[1392,816,96,48],'inn-rear-east','north'),
      ('inn-east-front',[1392,864,96,96],'inn-east-wing','south'),
      ('tailor-back',[1584,816,96,48],'tailor-rear','north'),
      ('tailor-front',[1584,864,96,96],'east-tailor','south'),
      ('scribe-back',[1680,816,96,48],'scribe-rear','north'),
      ('scribe-front',[1680,864,96,96],'east-scribe','south'),
      ('poor-east',[1680,1104,96,48],'poor-east-wide','south'),
    ]
    vertical={};horizontal={}
    # A source-painted rail is kept at every boundary pixel. Shared edges have
    # one owner and meet side rails without duplicate outlines or floating posts.
    for name,rect,principal,hand in strips:
        x,y,w,h=rect;front=get(principal)['footprint'];passage=None
        if name.startswith('nw-'):passage=[300,y,24,h]
        elif name.startswith(('inn-east','scribe-')):passage=[x+w-24,y,24,h]
        l['plots'].append(dict(id=name,principal=principal,yard=rect,front=front,attachment=hand,passage=passage,boundary_edges=['north','east','south','west']))
        for xx in (x,x+w-8):
            for yy in range(y,y+h,48):vertical.setdefault((xx,yy),name)
        for yy in (y,y+h):
            # A house foundation is already a closed boundary; do not put a
            # fence through its door or across its48px approach inside the yard.
            if (hand=='north' and yy==y) or (hand=='south' and yy==y+h):continue
            for xx in range(x,x+w,48):horizontal.setdefault((xx,yy),(name,passage))
    for i,((x,y),owner) in enumerate(sorted(vertical.items())):
        file=['yard-boundary-wood-c6r1','yard-boundary-stone-c6r2','yard-boundary-wood-b-c6r2'][i%3]
        prop(file,x,y+48,id=f'closed-side-{i}',owner=owner,architectural=True,boundary_rect=[x,y,8,48])
    rowindex={}
    for i,((x,y),(owner,passage)) in enumerate(sorted(horizontal.items(),key=lambda q:(q[0][1],q[0][0]))):
        j=rowindex.get(y,0);rowindex[y]=j+1
        file=['fence-0','fence-h-b-c4','fence-h-c-c4'][j%3]
        cuts=[(x,x+48)]
        if passage and x<passage[0]+24 and x+48>passage[0]:cuts=[(x,min(x+48,passage[0])),(max(x,passage[0]+24),x+48)]
        for a,b in cuts:
            if b>a:prop(file,a,y+16,crop=[a-x,0,b-x,24],id=f'closed-rear-{i}-{a}',owner=owner,architectural=True,boundary_rect=[a,y,b-a,1])
    # Churchyard has a continuous west rail; the north entrance stays open.
    for i,y in enumerate(range(768,1056,48)):
        prop(['yard-boundary-stone-c6r2','yard-boundary-wood-c6r1','yard-boundary-wood-b-c6r2'][i%3],480,y+48,owner='western-churchyard',boundary_rect=[480,y,8,48])
    prop('fence-h-c-c4',480,1071,owner='western-churchyard',boundary_rect=[480,1055,48,1])
    # Remove the older post fragments inside the intentionally open pump court.
    l['props']=[p for p in l['props'] if not (p.get('owner')=='northwest-pump-court' and p['file'].startswith('fence-'))]
    l=c5_contacts(l)
    for b in l['lots']:
        a=c6_build(b['spec'])[0];b['painted']=[b['x'],b['base']-a.height,a.width,a.height]
    l['features']['critic2']='attached, subdivided opposing rear strips; continuous rails and window-free masonry margins; commercial heights restored; drawn gate bearing over intact tower shafts'
    return l


def c6_ground(l):
    im=repeat(asset('cobble-c3'),tuple(l['size']));im.paste(repeat(asset('ditch-c3'),(1920,96)),(0,0))
    def field(n,rect):
        x,y,w,h=rect;a=asset(n);im.alpha_composite(repeat(a,(w+a.width,h+a.height)).crop((x%a.width,y%a.height,x%a.width+w,y%a.height+h)),(x,y))
    for p in l['plots']:field('packed-yard-c6r1',p['yard'])
    for p in l['courts']:field('packed-yard-c6r1' if p['id'] in ('craft-court','northwest-pump-court','inn-court','east-wall-service-court') else 'workyard-c4',p['rect'])
    for p in l['plots']:
        if p['yard'][1]>1008:field('mud-edge',p['yard'])
    field('square-slabs-c5',l['square']);field('workyard-c4',l['square_notch'])
    for r in l['roads']:
        if r['kind']=='main':field('main-paving-c4',r['rect'])
        elif r['kind']=='lane':field('workyard-c4',r['rect'])
        elif r['id']=='destination-apron' and r['rect'][0]==1512:field('main-paving-c4',r['rect'])
    # Drawn gutter/kerb strips have a single boundary owner through junctions.
    routes=[r for r in l['roads'] if r['kind'] in ('main','side')]
    def at(x,y,kind):return any(r['kind']==kind and r['rect'][0]<=x<r['rect'][0]+r['rect'][2] and r['rect'][1]<=y<r['rect'][1]+r['rect'][3] for r in routes)
    for r in routes:
        x,y,w,h=r['rect'];t=asset(r['file']);k=6 if r['kind']=='main' else 2
        if r['horizontal']:
            t=t.transpose(Image.Transpose.ROTATE_90)
            for xx in range(x,x+w):
                for sy,dy,oy in ((0,y,y-1),(t.height-k,y+h-k,y+h)):
                    if not at(xx,oy,r['kind']):im.paste(t.crop((xx%t.width,sy,xx%t.width+1,sy+k)),(xx,dy))
        else:
            for yy in range(y,y+h):
                for sx,dx,ox in ((0,x,x-1),(t.width-k,x+w-k,x+w)):
                    if not at(ox,yy,r['kind']):im.paste(t.crop((sx,yy%t.height,sx+k,yy%t.height+1)),(dx,yy))
    # Short drain is a native gutter crop at the workshop's fuel-store foot.
    im.paste(repeat(asset('street-side-c3').crop((0,0,4,48)),(4,96)),(284,912))
    return im


def c6_join_houses(ordered):
    """Join only ground-adjacent houses, using their actual painted contours.

    All repair pixels come from approved drawn masonry and neutral flashing.
    Row crops wrap native masonry into the lower lot's exterior alpha margin;
    no roof tiles, replacement polygons or new texture are drawn here. The
    lower sprite then covers that receiver, and the drawn two-column flashing
    follows its roof edge last. Intentional courts have no shared ground edge.
    """
    houses={e[5]:e for e in ordered if 'spec' in e[6]}
    originals={name:e[4].copy() for name,e in houses.items()};records=[]
    for name,tall in houses.items():
        for contact in tall[6]['spec'].get('roof_contacts',[]):
            low=houses[contact['neighbour']];source=originals[low[5]]
            hand='left' if contact['side']=='right' else 'right'
            receiver='receiving-wall-'+contact['side']+'-c6r1'
            masonry=asset(receiver)
            tone=low[6]['spec'].get('tone','');suffix='-'+tone if tone else ''
            # B's39/40 columns are continuous neutral flashing. A's apparent
            # contact meanders into tile paint, so it cannot supply a strip.
            # Reverse only this two-pixel edge for the other hand; the masonry
            # itself uses its separately lit left/right drawing unchanged.
            flashing='abutment-b-c6'+suffix
            metal=asset(flashing);sx=39
            roof_height=source.height-low[6]['spec']['floors']*48
            under=Image.new('RGBA',source.size);over=Image.new('RGBA',source.size)
            rows=[];first_row=None;alpha=source.getchannel('A')
            for y in range(source.height):
                gy=low[3]+y
                # The taller receiving facade, not its free roof/sky, must
                # actually occupy the other side of this property boundary.
                ty=gy-tall[3];ta=originals[name]
                if not 0<=ty<ta.height:continue
                tx=ta.width-1 if hand=='left' else 0
                if not ta.getpixel((tx,ty))[3]:continue
                edge=alpha.crop((0,y,source.width,y+1)).getbbox()
                if not edge:continue
                x0,x1=(0,edge[0]) if hand=='left' else (edge[2],source.width)
                if x0==x1:continue
                # Match the receiver's existing course phase on the taller
                # facade; wrap only its uninterrupted body, below the coping.
                if first_row is None:first_row=y
                ry=ty-(ta.height-tall[6]['spec']['floors']*48)
                ry=0 if y==first_row else 1+(ry-1)%(masonry.height-1)
                row=repeat(masonry.crop((0,ry,masonry.width,ry+1)),(source.width,1))
                under.paste(row.crop((x0,0,x1,1)),(x0,y))
                if y<roof_height:
                    fx=x1-1 if hand=='left' else x0-1
                    sy=16+(y%112)
                    strip=metal.crop((sx,sy,sx+2,sy+1))
                    if hand=='left':strip=strip.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
                    over.paste(strip,(fx,y))
                rows.append([y,x0,x1])
            assembled=under;assembled.alpha_composite(low[4]);assembled.alpha_composite(over)
            low[4]=assembled
            records.append(dict(tall=name,lower=low[5],side=hand,
                receiver=receiver,flashing=flashing,flashing_columns=[sx,sx+2],
                flashing_reversed=hand=='left',
                roof_eave=low[3]+roof_height,owned_rows=rows,
                order=['drawn masonry','complete lower house','contour flashing']))
    return records


def c6_render(l,reveal=False,actors=None):
    im=c6_ground(l);ordered=[];records=[];casts=Image.new('L',im.size);occupied=Image.new('L',im.size);shadows=[]
    for b in l['lots']:
        a,parts=c6_build(b['spec'])
        ordered.append([b['base'],0,b['x'],b['base']-a.height,a,b['id'],b]);records.append(dict(id=b['id'],parts=parts,painted=[b['x'],b['base']-a.height,a.width,a.height],footprint=b['footprint'],entrance=b.get('entrance')))
    joins=c6_join_houses(ordered)
    for record in records:
        record['assembled_contacts']=[j for j in joins if j['lower']==record['id']]
    if reveal:
        for entry in ordered:
            if entry[6].get('foreground_mask'):
                entry[4]=entry[4].copy();entry[4].paste((0,0,0,0),tuple(entry[6]['foreground_mask']))
    for p in l['props']:
        a=c4_owned_prop(l,p);priority=p.get('layer',1)
        if p.get('wall'):priority=3 if 'tower' in p['file'] or p.get('id')=='gatehouse' else 2 if p.get('attachment') else -1
        if reveal and p.get('foreground_mask'):a=a.copy();a.paste((0,0,0,0),tuple(p['foreground_mask']))
        ordered.append([p.get('sort_base',p['base']),priority,p['x'],p['base']-a.height,a,p.get('id',p['file']),p])
    # Receivers own their masks. A continuous group cast is calculated before
    # splitting it into lot-owned strips, so a panel edge cannot reset sunlight.
    source_casts=[];receivers=[]
    for base,z,x,y,a,ident,b in ordered:
        q=Image.new('L',im.size);q.paste(a.getchannel('A'),(x,y));occupied=ImageChops.lighter(occupied,q)
        if b.get('role') or b.get('file')=='person' or b.get('overhead'):continue
        height=b.get('spec',{}).get('floors',max(1,a.height//72))*48
        depth=min(48,max(8,height//5));alpha=a.getchannel('A')
        # Project the drawn foundation silhouette, including its real returns.
        row=Image.new('L',(a.width,1))
        for sy in range(max(0,a.height-8),a.height):row=ImageChops.lighter(row,alpha.crop((0,sy,a.width,sy+1)))
        q=Image.new('L',im.size)
        for dy in range(depth+1):q.paste(row,(x+dy//2,b['base']-1+dy))
        source_casts.append((b['base'],q,ident))
        receivers.append((ident,[x,b['base']-1,a.width,depth+1],b['base']))
    for ident,rect,base in receivers:
        x,y,w,h=rect;owned=Image.new('L',(w,h))
        for other_base,q,caster in source_casts:
            if abs(base-other_base)<=48:owned=ImageChops.lighter(owned,q.crop((x,y,x+w,y+h)))
        prior=casts.crop((x,y,x+w,y+h));casts.paste(ImageChops.lighter(prior,owned),(x,y))
        shadows.append(dict(owner=ident,receiver=rect,owned_ground_apron=rect,opacity=88,projection=[.5,1],method='continuous foundation cast partitioned into owned receiver strips',surface='ground'))
    casts=ImageChops.multiply(casts,ImageChops.invert(occupied))
    shade=Image.new('RGBA',im.size,(20,22,21,0));shade.putalpha(casts.point(lambda v:v*88//255));im.alpha_composite(shade)
    # Receiving walls and roofs are separate from ground. A taller neighbour's
    # drawn silhouette casts onto the lower property's own exposed roof plane;
    # eaves project onto that property's own facade. Union opacity, never add.
    for oi,(base,z,x,y,a,ident,b) in enumerate(ordered):
        if 'spec' not in b:continue
        alpha=a.getchannel('A');rh=a.height-48*b['spec']['floors']
        roofmask=Image.new('L',a.size);roofmask.paste(alpha.crop((0,0,a.width,rh)),(0,0))
        wallmask=ImageChops.subtract(alpha,roofmask);rm=Image.new('L',a.size);wm=Image.new('L',a.size)
        cap=alpha.crop((0,0,a.width,rh))
        for dy in (2,3,4):
            cast=Image.new('L',a.size);cast.paste(cap,(dy//2,dy));wm=ImageChops.lighter(wm,ImageChops.multiply(cast,wallmask))
        for obase,oz,ox,oy,other,oid,ob in ordered:
            if 'spec' not in ob or oid==ident or ob['spec']['floors']<=b['spec']['floors']:continue
            if not shared_ground_edges(b,ob):continue
            for dx,dy in ((2,4),(4,8),(6,12)):
                cast=Image.new('L',a.size);cast.paste(other.getchannel('A'),(ox-x+dx,oy-y+dy));rm=ImageChops.lighter(rm,ImageChops.multiply(cast,roofmask))
        mask=ImageChops.lighter(rm,wm);sh=Image.new('RGBA',a.size,(20,22,21,0));sh.putalpha(mask.point(lambda v:v*72//255));a=a.copy();a.alpha_composite(sh);ordered[oi][4]=a
        for surface,mask in [('roof',rm),('wall',wm)]:
            if mask.getbbox():shadows.append(dict(owner=ident,receiver=[x,y,a.width,a.height],owned_ground_apron=[x,y,a.width,a.height],opacity=72,surface=surface,method='drawn silhouette projected onto separately masked owned surface'))
    for actor in actors or []:
        a=asset(actor.get('file','person-customer-c4'));x,base=actor['feet'];x-=a.width//2
        ordered.append([actor.get('surface_sort',base),2,x,base-a.height,a,'proof-actor',actor])
    for base,z,x,y,a,ident,b in sorted(ordered,key=lambda t:(t[0],t[1],t[2])):im.alpha_composite(a,(x,y))
    return im,records,shadows


def c6_main():
    from collections import Counter
    l=c6_city_layout();im,records,shadows=c6_render(l)
    im.save(REVIEW/'r17-city-final.png');im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png');im.convert('L').save(REVIEW/'r17-city-final-squint.png')
    for n,box in {'square':(480,336,1200,1200),'street':(96,240,720,816),'gate':(1104,768,1776,1440)}.items():
        a=im.crop(box);a.resize((a.width*3,a.height*3),NEAREST).save(REVIEW/f'r17-city-final-crop-{n}-3x.png')
    refs=[('TODAY / literal1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / literal1x',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('ROUND17 C6 / literal1x /48px grid',im)]
    sheet=Image.new('RGBA',(sum(a.width for _,a in refs)+64,max(a.height for _,a in refs)+48),(35,39,34,255));d=ImageDraw.Draw(sheet);x=16
    for title,a in refs:d.text((x,10),title,fill='white');sheet.alpha_composite(a,(x,32));x+=a.width+16
    sheet.save(REVIEW/'r17-city-final-vs-r15-vs-today.png')
    hist=Counter(b['spec']['floors'] for b in l['lots'])
    for name,data in [('layout',l),('placements',dict(paint=records,shadows=shadows)),('layout-audit',dict(buildings=len(l['lots']),storeys=dict(hist),single_storey_fraction=hist[1]/len(l['lots'])))]: (REVIEW/f'r17-C6-{name}.json').write_text(json.dumps(data,indent=2))
    print('C6',len(l['lots']),'buildings',dict(hist))


def c7_ring(block):
    """Explicit outward-facing perimeter lots with owned, roofed rear wings.

    Cells are plan coordinates, separate from projected painting bounds. Each
    lot is one/two cells wide and at most two deep. Corners belong to one lot;
    the remaining interior cells belong to attached rear wings, except the
    single declared working court. No detached building recipe is used.
    """
    x,y,w,h=block['rect'];cols,rows=w//48,h//48
    cells={(xx,yy) for yy in range(rows) for xx in range(cols)}
    cells-=set(tuple(q) for q in block.get('notches',[]))
    court=set()
    if block.get('court'):
        cx,cy,cw,ch=block['court']
        court={(xx,yy) for yy in range(cy,cy+ch) for xx in range(cx,cx+cw)}
    ring={q for q in cells if any((q[0]+dx,q[1]+dy) not in cells for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))}
    lots=[];owned=set()
    # North/south bands include corners; east/west bands fill their returns.
    for facing,band in [('N',sorted(q for q in ring if (q[0],q[1]-1) not in cells)),
                        ('S',sorted(q for q in ring if (q[0],q[1]+1) not in cells)),
                        ('W',sorted((q for q in ring if (q[0]-1,q[1]) not in cells),key=lambda q:(q[1],q[0]))),
                        ('E',sorted((q for q in ring if (q[0]+1,q[1]) not in cells),key=lambda q:(q[1],q[0])))]:
        for q in band:
            if q in owned:continue
            xx,yy=q;axis=(1,0) if facing in ('N','S') else (0,1)
            run=[q];other=(xx+axis[0],yy+axis[1])
            if other in band and other not in owned:run.append(other)
            inward={'N':(0,1),'S':(0,-1),'W':(1,0),'E':(-1,0)}[facing]
            for edge in run[:]:
                rear=(edge[0]+inward[0],edge[1]+inward[1])
                if rear in cells and rear not in owned and rear not in court:run.append(rear)
            run=[p for p in run if p not in owned and p not in court];owned.update(run)
            level=block.get('floors',2)
            if block['id']=='civic' and facing=='S':level=[3,4,5,4,3,4][len(lots)%6]
            ident=block['id']+'-'+facing+'-'+str(len(lots))
            lots.append(dict(id=ident,block=block['id'],facing=facing,cells=[list(p) for p in run],
                             footprint_cells=[list(p) for p in run],floors=level,
                             bottom_left=[x+min(p[0] for p in run)*48,y+(max(p[1] for p in run)+1)*48],
                             corner=any(sum((p[0]+dx,p[1]+dy) not in cells for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))>1 for p in run)))
    for lot in lots:
        fronts={lot['facing']}
        for xx,yy in lot['cells']:
            for direction,(dx,dy) in {'N':(0,-1),'S':(0,1),'E':(1,0),'W':(-1,0)}.items():
                if (xx+dx,yy+dy) not in cells:fronts.add(direction)
        lot['street_faces']=sorted(fronts)
    interior=cells-owned-court
    for q in sorted(interior):
        owner=min(lots,key=lambda a:min(abs(q[0]-p[0])+abs(q[1]-p[1]) for p in a['cells']))
        owner.setdefault('rear_wing_cells',[]).append(list(q))
    return lots,sorted(cells),sorted(court)


def c7_city_layout():
    """Concept B: closed roof-filled blocks around a four-sided civic room."""
    blocks=[
        dict(id='northwest',file='block-nw-a-c7',rect=[144,240,432,384],floors=2,roof='terracotta',court=[3,3,2,3]),
        dict(id='civic',file='block-civic-c7',rect=[624,240,576,384],floors=3,roof='terracotta'),
        dict(id='northeast',file='block-ne-c7',rect=[1248,240,528,384],floors=3,roof='slate',court=[6,4,1,1]),
        dict(id='craft',file='block-west-c7',rect=[144,672,288,336],floors=2,roof='terracotta'),
        dict(id='inn',file='block-inn-b-c7',rect=[1248,672,240,336],floors=3,roof='slate'),
        dict(id='east-trades',file='block-east-c7',rect=[1536,672,240,336],floors=3,roof='slate'),
        dict(id='southwest',file='block-sw-c7',rect=[144,1056,288,240],floors=2,roof='terracotta',court=[3,2,1,1]),
        dict(id='south-artisans',file='block-sm-c7',rect=[480,1056,240,240],floors=2,roof='brown'),
        dict(id='market',file='block-market-c7',rect=[768,1008,384,288],floors=2,roof='brown'),
        dict(id='southeast',file='block-se-c7',rect=[1296,1056,480,240],floors=2,roof='brown',notches=[[0,3],[0,4]]),
    ]
    l=dict(size=[1920,1440],concept='r17-concept-b.png',blocks=blocks,lots=[],props=[],roads=[],square=[768,624,384,384],square_notch=[768,624,48,48])
    for b in blocks:
        lots,cells,court=c7_ring(b);l['lots']+=lots;b.update(cells=[list(q) for q in cells],court_cells=[list(q) for q in court],base=b['rect'][1]+b['rect'][3],x=b['rect'][0])
    def road(ident,rect,kind='side'):
        l['roads'].append(dict(id=ident,rect=rect,kind=kind,clear_width=96 if kind=='main' else 24 if kind=='lane' else 48))
    # Cell-aligned ordinary streets are physical gaps between occupied rings.
    for ident,rect in [('north-wall-lane',[96,192,1728,48]),('west-wall-lane',[96,192,48,1152]),('east-wall-lane',[1776,192,48,1152]),('south-wall-lane',[96,1296,1728,48]),('northwest-return',[576,240,48,384]),('northeast-return',[1200,240,48,384]),('north-crossing',[144,624,1632,48]),('craft-return',[432,672,48,624]),('east-through-street',[1488,672,48,384]),('south-crossing-west',[144,1008,624,48]),('south-crossing-east',[1248,1008,528,48]),('south-market-return',[720,1056,48,240])]:road(ident,rect)
    road('gate-main-north',[1152,624,96,480],'main')
    road('gate-main-turn',[1152,1104,144,96],'main')
    road('gate-main-south',[1200,1200,96,240],'main')
    road('southeast-wedge-elbow',[1296,1200,48,96])
    road('northwest-court-through',[336,480,24,144],'lane')
    def prop(file,x,base,**kw):
        p=dict(file=file,x=x,base=base,**kw);l['props'].append(p);return p
    prop('church-b-c7',480,1008,id='church',footprint=[480,720,240,288],entrance=[720,960],facing='E',floors=5)
    prop('churchyard-c7',624,720,id='church-precinct',footprint=[624,624,144,96],floors=0)
    # Four-sided enclosure: guildhall north; east porch of church west; west
    # inn return east; roofed north-opening market south. Stalls remain free.
    for i,(x,base) in enumerate([(816,768),(864,768),(912,768),(840,864),(888,864),(936,864)]):
        prop('stall-'+str(i),x,base,id='stall-'+str(i),footprint=[x,base-48,48,48],floors=0)
    prop('fountain',1008,960,id='fountain',footprint=[1008,864,96,96],floors=0)
    prop('market-cross',768,984,id='market-cross',floors=0)
    # Towers have perimeter footprints only. Full curtain masonry joins their
    # shafts, avoiding the former towers standing above a thin bottom strip.
    for i,x in enumerate([0,432,1008,1488,1824]):
        prop('corner-bastion-c7' if i==0 else 'wall-tower-mid'+(['','-v1','-v2'][i%3])+'-c7',x,192,id='north-tower-'+str(i),wall=True,footprint=[x,96,144 if i==0 else 96,96],floors=4)
    for side,x,bases in [('west',0,[624,1008,1440]),('east',1824,[576,1008,1440])]:
        for i,base in enumerate(bases):prop('wall-tower-'+('short' if base==1440 else 'mid')+(['-v2','','-v1'][i%3])+'-c7',x,base,id=side+'-tower-'+str(i),wall=True,footprint=[x,base-96,96,96],floors=3)
    for i,x in enumerate([528,1536]):prop('wall-tower-short'+(['','-v2'][i])+'-c7',x,1440,id='south-tower-'+str(i),wall=True,footprint=[x,1392,96,48],floors=3)
    prop('gate-c-c7',1176,1440,id='gate',wall=True,footprint=[1152,1248,144,192],anchor=[1152,1440],paint_offset=[24,0],portal=[1200,1344,96,96],floors=4)
    prop('gate-stair-c7',1320,1440,id='gate-stair',wall=True,footprint=[1296,1344,48,96],anchor=[1296,1440],paint_offset=[24,0],floors=3)
    prop('wall-access-c5',912,192,id='north-wall-stair',wall=True,floors=2)
    # Actors are placed with work, doors and circulation in mind. They are
    # separate foreground objects, allowing a true normal/reveal proof.
    placements=[('laundry-worker-c7',330,492,'laundry worker',625),('inn-patron-a-c7',1260,996,'inn patron seated',1009),('inn-patron-b-c7',1278,988,'inn patron greeting',1009),('guard-c7',1320,1404,'gate guard',1441),('delivery-c7',288,1008,'craft delivery',1009)]
    for file,x,base,role,sort_base in placements:prop(file,x,base,id=role.replace(' ','-'),role=role,floors=0,sort_base=sort_base)
    prop('bench-c7',1254,1008,id='inn-bench',role='bench beside west porch',floors=0,sort_base=1009)
    prop('woodpile-c7',360,480,id='court-woodpile',role='NW woodpile',floors=0,sort_base=625)
    for name,x,base,order in [('baker',640,576,625),('apothecary',1104,576,625),('smith',144,960,1009),('cobbler',336,960,1009),('inn',1248,912,1009),('tailor',1536,960,1009),('scribe',1648,960,1009),('butcher',256,1248,1297)]:
        prop('sign-'+name+'-c7',x,base,id='trade-'+name,role='hanging trade sign',floors=0,sort_base=order)
    prop('sorting-table-c7',1536,480,id='sorting-court-table',role='goods sorting at rear door',floors=0,sort_base=625)
    for i,(x,base) in enumerate([(820,782),(875,782),(925,782),(846,878),(897,878),(949,878),(994,980),(1080,972),(968,692),(1090,1024)]):
        prop(['person-customer-c4','inn-patron-a-c7','inn-patron-b-c7','laundry-worker-c7'][i%4],x,base,id='market-life-'+str(i),role='market visitor or vendor',floors=0)
    return l


def c7_ground(l):
    im=repeat(asset('cobble-c3'),tuple(l['size']))
    im.paste(repeat(asset('ditch-c3'),(1920,48)),(0,0))
    x,y,w,h=l['square']
    for yy in range(y,y+h,48):
        for xx in range(x,x+w,48):
            nx,ny,nw,nh=l['square_notch']
            if not (nx<=xx<nx+nw and ny<=yy<ny+nh):im.paste(asset('square-paving-'+str((xx//48+3*(yy//48))%4)+'-c7'),(xx,yy))
    for r in l['roads']:
        if r['kind']!='main':continue
        x,y,w,h=r['rect'];im.paste(repeat(asset('main-paving-c7'),(w,h)),(x,y))
    # Paint-derived kerbs continue through the bent route. Border segments at
    # joined road rectangles are omitted; their shared interior stays open.
    mains=[r['rect'] for r in l['roads'] if r['kind']=='main']
    def inside(x,y):return any(a<=x<a+w and b<=y<b+h for a,b,w,h in mains)
    kerb=asset('kerb-v-c7');kh=asset('kerb-h-c7')
    for x,y,w,h in mains:
        for yy in range(y,y+h):
            for xx,ox in [(x,x-1),(x+w-3,x+w)]:
                if not inside(ox,yy):im.alpha_composite(kerb.crop((0,yy%48,3,yy%48+1)),(xx,yy))
        for xx in range(x,x+w):
            for yy,oy in [(y,y-1),(y+h-3,y+h)]:
                if not inside(xx,oy):im.alpha_composite(kh.crop((xx%48,0,xx%48+1,3)),(xx,yy))
    return im


def c7_assemble_block(block,lots):
    """Reassemble registered painting through disjoint, owned native pieces.

    The image tool drew the complete roof/return contacts. Native 48px cells
    are then assigned to actual front, side, corner and attached rear-wing
    lots. No per-lot outline is added at an internal join. This is a static
    composition atlas, not a claim that these slices can rotate in runtime.
    """
    master=asset(block['file']);assembled=Image.new('RGBA',master.size)
    owners=[p for p in lots if p['block']==block['id']]
    for lot in sorted(owners,key=lambda p:(p['bottom_left'][1],p['bottom_left'][0])):
        for x,y in lot['cells']+lot.get('rear_wing_cells',[]):
            assembled.paste(master.crop((x*48,y*48,(x+1)*48,(y+1)*48)),(x*48,y*48))
    for x,y in block['court_cells']:
        assembled.paste(master.crop((x*48,y*48,(x+1)*48,(y+1)*48)),(x*48,y*48))
    # A step in the property line owns no lot. Only transparent source cells
    # can be discarded; projected roof/wall overhang stays in its parent art.
    for x,y in block.get('notches',[]):
        assembled.paste(master.crop((x*48,y*48,(x+1)*48,(y+1)*48)),(x*48,y*48))
    return assembled


def c7_render(l,reveal=False,actors=None):
    im=c7_ground(l);ordered=[];records=[];occupied=Image.new('L',im.size);casts=Image.new('L',im.size)
    for b in l['blocks']:
        x,y,w,h=b['rect'];a=c7_assemble_block(b,l['lots'])
        if a.size!=(w,h):raise ValueError((b['id'],a.size,(w,h)))
        ordered.append([b['base'],0,x,y,a,b])
    # Native curtain segments retain one continuous drawn course phase.
    for y,short in [(48,False),(1344,True)]:
        for i,x in enumerate(range(48,1872,96)):
            if short and 1152<=x<1296:continue
            a=asset('wall-'+str(i%5)+('-short' if short else '')+'-c7')
            ordered.append([y+a.height,-2,x,y,a,dict(id='curtain-'+str(x)+'-'+str(y),wall=True,floors=2)])
    for x in range(96,1824,48):
        a=asset('wall-walk-c7');ordered.append([190,0,x,72,a,dict(id='north-walk-'+str(x),wall=True,floors=0)])
    for x in [0,48,1824,1872]:
        for i,y in enumerate(range(192,1344,144)):
            a=asset('wall-side-'+'abc'[i%3]+'-c4');ordered.append([y+a.height,-2,x,y,a,dict(id='side-wall',wall=True,floors=2)])
    for p in l['props']:
        a=asset(p['file']).copy();x,y=p['x'],p['base']-a.height
        ordered.append([p.get('sort_base',p['base']),2 if p.get('role') else 1,x,y,a,p])
    for _,_,x,y,a,b in ordered:
        mask=Image.new('L',im.size);mask.paste(a.getchannel('A'),(x,y));occupied=ImageChops.lighter(occupied,mask)
    shadow_records=[]
    for base,z,x,y,a,b in ordered:
        if b.get('role') or (not b.get('floors',2) and not b['id'].startswith('stall-')):continue
        reach=24 if b.get('floors',2)<=2 else 48 if b.get('floors',2)<=3 else 60
        if b.get('wall'):reach=16
        if b['id'].startswith('stall-'):reach=12
        alpha=a.getchannel('A');mask=Image.new('L',im.size)
        # Every row comes from the caster's actual painted silhouette. The
        # tall peaks cast farther; this is not a rectangular foundation mat.
        for dy in range(reach):
            sy=a.height-1-round(dy*(a.height-1)/max(1,reach-1));row=alpha.crop((0,sy,a.width,sy+1))
            mask.paste(row,(x+dy//2,base+dy))
        casts=ImageChops.lighter(casts,mask)
        shadow_records.append(dict(owner=b['id'],receiver=[x,base,a.width+reach//2,reach],opacity=88,source='painted silhouette rows',height=b.get('floors',2),surface='ground'))
    casts=ImageChops.multiply(casts,ImageChops.invert(occupied));shade=Image.new('RGBA',im.size,(35,37,32,0));shade.putalpha(casts.point(lambda q:q*88//255));im.alpha_composite(shade)
    for actor in actors or []:
        a=asset(actor.get('file','guard-c7'));x,base=actor['feet'];ordered.append([actor.get('sort_base',base),3,x-a.width//2,base-a.height,a,dict(id='proof-actor',role='actor')])
    for base,z,x,y,a,b in sorted(ordered,key=lambda p:(p[0],p[1],p[2])):
        if reveal and b['id'] in ['gate','gate-stair','market','northwest']:
            a=a.copy()
            # Reveal only painted overhead/foreground pixels. Ground supports
            # remain in the authored state; this is an art proof, not runtime.
            masks={'gate-stair':(0,80,48,192),'gate':(24,72,120,176),'market':(96,0,288,120),'northwest':(180,240,252,384)}
            a.paste((0,0,0,0),masks[b['id']])
        im.alpha_composite(a,(x,y));records.append(dict(id=b['id'],file=b.get('file'),bounds=[x,y,a.width,a.height],base=base,layer=z))
    return im,records,shadow_records


def c7_main():
    l=c7_city_layout();im,records,shadows=c7_render(l)
    im.save(REVIEW/'r17-city-final.png');im.resize((3840,2880),NEAREST).save(REVIEW/'r17-city-final-2x.png');im.convert('L').save(REVIEW/'r17-city-final-squint.png')
    for n,box in {'square':(480,480,1536,1152),'street':(96,192,672,1056),'gate':(1008,1008,1536,1440)}.items():
        crop=im.crop(box);crop.resize((crop.width*3,crop.height*3),NEAREST).save(REVIEW/f'r17-city-final-crop-{n}-3x.png')
    def sheet(name,items):
        s=Image.new('RGBA',(sum(a.width for _,a in items)+16*(len(items)+1),max(a.height for _,a in items)+48),(32,36,32,255));d=ImageDraw.Draw(s);x=16
        for title,a in items:d.text((x,10),title,fill='white');s.alpha_composite(a,(x,32));x+=a.width+16
        s.save(REVIEW/name)
    sheet('r17-city-final-vs-r15-vs-today.png',[('TODAY / 1x',Image.open(ART/'reference/r17/current-town.png').convert('RGBA')),('ROUND15 / 1x',Image.open(REVIEW/'r15-city-mockup.png').convert('RGBA')),('C7 / 48px cells / 1x',im)])
    sheet('r17-city-final-vs-concept.png',[('CONCEPT B / native',Image.open(REVIEW/'r17-concept-b.png').convert('RGBA')),('C7 COMPOSED / native',im)])
    for name,data in [('layout',l),('placements',records),('shadows',shadows)]: (REVIEW/f'r17-C7-{name}.json').write_text(json.dumps(data,indent=2))
    print('C7:',len(l['blocks']),'perimeter blocks,',len(l['lots']),'outward-facing lots')


if __name__=='__main__':
    import sys
    if '--part' in sys.argv and sys.argv[sys.argv.index('--part')+1]=='C7':c7_main()
    elif '--part' in sys.argv and sys.argv[sys.argv.index('--part')+1]=='C6':c6_main()
    elif '--part' in sys.argv and sys.argv[sys.argv.index('--part')+1]=='C5':c5_main()
    elif '--part' in sys.argv and sys.argv[sys.argv.index('--part')+1]=='C4':c4_main()
    elif '--part' in sys.argv and sys.argv[sys.argv.index('--part')+1]=='C3':c3_main()
    elif '--part' in sys.argv and sys.argv[sys.argv.index('--part')+1]=='R':r_main()
    else:e_main()
