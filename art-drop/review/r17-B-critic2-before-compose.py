#!/usr/bin/env python3
"""Compose native city17 drawings, extended from the city15 compositor.

    python -B art-drop/out/city17/compose.py
    python -B art-drop/out/city17/compose.py --no-sheets

Creates the 16x12 L-block, irregular market, both tall/low joins, 1x/3x
comparisons and greyscale squint renders. Per-export proofs are delegated to
review/r17-B-build.py. No native asset is resampled during composition.
Every building is bottom-left anchored. Facade origin spacing remains 48px.
Spec storeys are bottom-to-top. Parts are drawn ground, storeys, roof, overlays;
standing objects are sorted by base row. End strips reveal only 3 outer pixels.
Corners use the explicit complete-panel assemblies below, never a cut through
a wide drawing. Drawn course strips preserve rows 0/47 across the whole lot.
Part B roofs, joins, firewall and masked shadows are native city17 assets.
Current fantasy terrain/landmarks are explicit later-part placeholders.
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


def build(spec):
    """Ground, upper floors bottom-to-top, roof, overlays; no asset resampling."""
    width, upper = spec['width']*48, spec['storeys']
    if spec['width'] not in (1,2,3) or not 0 <= len(upper) <= 4: raise ValueError(spec)
    roof_name = f"roof-{spec['roof']}-w{spec['width']}-c{spec.get('roof_colour',0)}"
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
    panels=[ground_name(spec)]+[f"storey-{s['kind']}-w{spec['width']}-c{s['colour']}" for s in upper]
    for floor,name in enumerate(panels):
        y=im.height-48*(floor+1)
        walls=[wall for wall in spec.get('firewalls',[]) if y<top+wall['height']]
        if walls:
            # Reserve a full native side bay within this lot. Use an intact
            # narrower facade, never paint over its windows with a wall stripe.
            if spec['width']<=len(walls):raise ValueError('party wall needs a reserved side bay')
            narrow=name.replace(f"-w{spec['width']}-",f"-w{spec['width']-len(walls)}-")
            put(narrow,48 if any(w['side']=='left' for w in walls) else 0,y)
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
        reveal=48
        x=0 if side=='left' else width-reveal
        for dx in range(0,reveal,16):
            for y in range(top+4,top+height-4,40):
                n=min(40,top+height-4-y)
                put('firewall-w0',x+dx,y,(0,4,16,4+n),'firewall body')
            put('firewall-w0',x+dx,top,(0,0,16,4),'firewall coping')
            put('firewall-w0',x+dx,top+height-4,(0,44,16,48),'firewall flashing')
    extra=top-roof.height
    if extra:
        if spec['roof']!='ridge':raise ValueError('depth extension requires the south-facing ridge slope')
        # Keep the ridge at the far end. Insert fill BELOW it, then the intact
        # south slope/eave, rather than putting another ridge inside the roof.
        split=28
        put(roof_name,0,0,(0,0,width,split),'roof ridge')
        for y in range(0,extra,48):
            for x in range(0,width,48):put(f"roof-fill-w1-c{spec.get('roof_colour',0)}",x,split+y,layer='roof fill')
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
            put(f"shadow-jetty-w{spec['width']}-c0",0,y,layer='jetty shade')
    for o in spec.get('overlays',[]):put(o['file'],o['x'],top+o['y'],layer='overlay')
    for o in spec.get('roof_overlays',[]):
        p=asset(o['file'])
        if o['y']+p.height>top:raise ValueError('roof overlay leaves roof receiver')
        if not any(o['x']>=x0 and o['y']>=y0 and o['x']+p.width<=x1 and o['y']+p.height<=y1
                   for x0,y0,x1,y1 in receiving_planes(spec)):
            raise ValueError(('roof accent crosses ridge, verge or parapet',o,spec['roof']))
        put(o['file'],o['x'],o['y'],layer='roof overlay')
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


def joined_l_roof(colour=0):
    """A real L of native painted planes, with one concave valley and a hip end.

    West arm is 96x240, south wing 336x96. The valley runs from the
    concave eave (96,144) to the ridge elbow (48,192). The 48x96 hip
    terminates the east end. No complete roof cap is buried in the fill.
    """
    im=Image.new('RGBA',(336,240))
    fill=asset(f'roof-fill-w1-c{colour}')
    east=fill.transpose(Image.Transpose.ROTATE_270)
    west=fill.transpose(Image.Transpose.ROTATE_90)
    for y in range(0,240,48):
        im.paste(west,(0,y));im.paste(east,(48,y))
    for y in (144,192):
        for x in range(96 if y==144 else 0,288,48):im.paste(fill,(x,y))
    # A continuous east-facing receiver meets the painted upper-left valley
    # region. The other receiving plane is the north side of the south wing.
    im.paste(asset(f'roof-valley-c{colour}'),(48,144))
    im.paste(asset(f'roof-hip-end-c{colour}'),(288,144))
    im.paste(asset(f'roof-hip-end-c{colour}').crop((0,48,48,96)).transpose(Image.Transpose.FLIP_LEFT_RIGHT),(0,192))
    gable=asset(f'roof-gable-w2-c{colour}')
    vertical=gable.crop((46,8,50,56))
    for y in range(0,192,48):im.paste(vertical,(46,y))
    terminal=asset(f'roof-hip-end-c{colour}')
    ridge=terminal.crop((0,46,6,50))
    im.paste(repeat(ridge,(240,4)),(48,190))
    # Existing drawn eaves/verges outline only exposed perimeter runs.
    cap=asset(f'roof-ridge-w2-c{colour}')
    eave=cap.crop((0,92,96,96))
    im.paste(repeat(eave,(336,4)),(0,236))
    im.paste(cap.crop((0,0,96,1)),(0,0))
    im.paste(repeat(cap.crop((0,0,1,48)),(1,240)),(0,0))
    im.paste(repeat(cap.crop((95,0,96,48)),(1,144)),(95,0))
    im.paste(repeat(cap.crop((1,95,95,96)),(240,1)),(96,144))
    im.alpha_composite(asset('chimney-1'),(12,44))
    return im


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
        a,parts=build(b['spec']);x,y=b['x'],b['base']-a.height
        records.append(dict(**b,y=y,parts=parts));objects.append((b['base'],0,x,a,y))
    for o in layout.get('objects',[]):
        a=Image.open(ART/o['file']).convert('RGBA');y=o['base']-a.height
        objects.append((o['base'],1,o['x'],a,y));records.append(dict(**o,y=y))
    if layout.get('joined_l'):
        o=layout['joined_l'];a=joined_l_roof(o.get('colour',0))
        objects.append((o['base'],2,o['x'],a,o['y']))
        records.append(dict(id='joined-L-roof',**o,files=['roof-fill-w1','roof-valley','roof-hip-end'],
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
    t['features']=dict(joins='5|1 and 1|5; zero interlot gap',firewall='48px side plane reserved inside taller lot, beside intact two-cell facade; coping once above lower roof, flashing once at foot',shadow='height responsive6..30px south/east; end lots reserve32px east receiver; union opacity112/255')
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


if __name__=='__main__':main()


