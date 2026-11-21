"""Validate Part A data and render diagnostics outside the deliverable tree."""
import argparse
import colorsys
import hashlib
import json
import math
import re
from pathlib import Path
from PIL import Image, ImageDraw
from build_palette import ROOT, OUT, REVIEW, RAMPS, GROUPS, lightness, BG, INK, text, roles, ANCHORS, FLOOR_RAMPS


def rgb(c):
    return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))


def saturation(c):
    return colorsys.rgb_to_hsv(*(v/255 for v in rgb(c)))[1]


def prop_body_steps(ramp, floor):
    floor_l = lightness(floor)
    return [i+1 for i,c in enumerate(ramp)
            if 30 <= lightness(c) <= 70 and abs(lightness(c)-floor_l) >= 10]


def lab(c):
    linear = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4
              for v in (n/255 for n in rgb(c))]
    xyz = [sum(v*w for v,w in zip(linear, weights))/white
           for weights,white in [((.4124564,.3575761,.1804375),.95047),
                                 ((.2126729,.7151522,.0721750),1),
                                 ((.0193339,.1191920,.9503041),1.08883)]]
    x,y,z = [v**(1/3) if v > (6/29)**3 else v/(3*(6/29)**2)+4/29 for v in xyz]
    return (116*y-16,500*(x-y),200*(y-z))


def grey(im):
    # CIELAB value diagnostic only. Never imported into art or palette data.
    im = im.convert('RGB')
    table = {}
    for _, color in im.getcolors(im.width * im.height):
        l = lightness('#%02x%02x%02x' % color)
        y = ((l+16)/116)**3 if l > 8 else l/(24389/27)
        v = round(255 * (12.92*y if y <= .0031308 else 1.055*y**(1/2.4)-.055))
        table[color] = (v,v,v)
    result = Image.new('RGB', im.size)
    result.putdata([table[c] for c in im.get_flattened_data()])
    return result


def audit():
    data = json.loads((OUT / 'palette.json').read_text())
    assert data == RAMPS
    parsed = {}
    for line in (OUT / 'palette.hex').read_text().splitlines():
        if not line or line.startswith(';'):
            continue
        match = re.fullmatch(r'(#[0-9a-f]{6}) (.+)-(\d) L\*=(\d+)', line)
        assert match, line
        c, name, step, l = match.groups()
        assert int(step) == len(parsed.setdefault(name, [])) + 1
        parsed[name].append(c)
        assert abs(lightness(c) - int(l)) <= .5
    assert parsed == data
    reserved = GROUPS['gameplay-only'] + GROUPS['feature-only']
    materials = [n for n in data if n not in reserved and n != 'void-mass']
    report = {'status': 'pass', 'ramps': {}, 'look_budgets': {}}
    assert len({data[n][0] for n in data}) == len(data), 'Each ramp needs its own darkest colour'
    anchors = {c['hex'] for c in json.loads((REVIEW/'A-master-quantised.json').read_text())}
    for name, colors in ANCHORS.items():
        assert set(colors) <= set(data[name]) & anchors
    assert len({tuple(round(lightness(c)) for c in data[n]) for n in materials}) >= 45
    for name,ramp in data.items():
        ls = list(map(lightness,ramp))
        assert len(ramp) == len(set(ramp)) == 6
        active = [l for i,l in enumerate(ls,1) if i not in roles(name).get('reference-only',[])]
        assert all(b-a >= 6 for a,b in zip(active,active[1:])), (name,active)
        assert '#000000' not in ramp and '#ff00ff' not in ramp
        assigned = roles(name)
        assert all(i >= 5 for i in assigned.get('reference-only',[])), name
        floor = assigned.get('floor',[])
        if floor:
            assert all(35 <= ls[i-1] <= 55 for i in floor)
            assert ls[floor[-1]-1]-ls[floor[0]-1] <= 15
        if name in FLOOR_RAMPS:
            assert floor, name
        for role,lo,hi in [('top',18,30),('face',25,40),('body',30,70),('glint',70,85),('focal',70,85),('mass',5,15)]:
            assert all(lo <= ls[i-1] <= hi for i in assigned.get(role,[]))
        if name in materials:
            assert max(map(saturation,ramp)) <= .73, name
            # Explicit hue-shift check: purple/blue/teal shadow, warmer or cyan light.
            dark_h = colorsys.rgb_to_hsv(*(v/255 for v in rgb(ramp[0])))[0]*360
            light_h = colorsys.rgb_to_hsv(*(v/255 for v in rgb(ramp[-1])))[0]*360
            assert 160 <= dark_h <= 320, (name,dark_h)
            assert min(abs(dark_h-light_h),360-abs(dark_h-light_h)) >= 15, (name,dark_h,light_h)
        report['ramps'][name] = {'L_star':[round(l,3) for l in ls], 'roles':assigned,
            'floor_span_L_star':round(ls[floor[-1]-1]-ls[floor[0]-1],3) if floor else None,
            'max_hsv_saturation':round(max(map(saturation,ramp)),4)}
    floors = sorted({c for n in FLOOR_RAMPS for i,c in enumerate(data[n],1) if i in roles(n)['floor']})
    high_floor = max(map(lightness,floors))
    # Body/outline contrast is relational. Export allowed pairings, never claim
    # that every material body works on every floor (e.g. pale plaster on ice).
    report['prop_body_steps_by_floor'] = {}
    for name in materials:
        choices = {floor:prop_body_steps(data[name],floor) if abs(lightness(data[name][0])-lightness(floor)) >= 10 else [] for floor in floors}
        assert any(choices.values()), name
        report['prop_body_steps_by_floor'][name] = choices
    assert prop_body_steps(['#101522'],data['wood-oak'][3]) == []
    assert prop_body_steps([data['wood-oak'][3]],data['wood-oak'][3]) == []
    assert min(lightness(data[n][-1]) for n in reserved)-high_floor >= 15
    assert all(lightness(data[n][-1]) <= 85 for n in reserved)
    assert lightness(data['loot-gold'][4])-lightness(data['lair-hoard'][3]) >= 15
    assert set(sum((data[n] for n in materials),[])).isdisjoint(c for n in reserved for c in data[n][2:])
    # Saturation guard in each reserved hue window, with a visible 0.08 margin.
    report['reserved_hue_checks'] = {}
    for rn in reserved:
        core = data[rn][2:5]
        hsv = [colorsys.rgb_to_hsv(*(v/255 for v in rgb(c))) for c in core]
        peak = max(v[1] for v in hsv)
        hits=[]
        for name in materials:
            for c in data[name]:
                h,sat,_=colorsys.rgb_to_hsv(*(v/255 for v in rgb(c)))
                distance=min(min(abs(h-v[0]),1-abs(h-v[0]))*360 for v in hsv)
                # Den's low-chroma bone accent is checked against bone; a hue
                # angle alone would also classify unrelated rich woods as bone.
                # The 0.73 saturation ceiling still covers every material.
                if lightness(c)>=35 and distance<=15 and (rn != 'lair-den' or name == 'bone'):
                    assert sat <= peak-.08, (rn,name,c,sat,peak)
                    hits.append(sat)
        report['reserved_hue_checks'][rn]={'window_degrees':15,'reserved_peak_saturation':round(peak,4),'max_material_saturation':round(max(hits,default=0),4)}
    report['breach_separation']=[]
    for i in (3,4,5):
        gaps={n:math.dist(lab(data['lair-breach'][i]),lab(data[n][i])) for n in ('foe-red','found-trap','loot-gold','embers')}
        assert min(gaps.values()) >= 10, (i,gaps)
        report['breach_separation'].append({'step':i+1,'delta_E76':{n:round(v,3) for n,v in gaps.items()}})
    # Light and dark materials must remain visibly different in greyscale.
    mean=lambda n:sum(map(lightness,data[n][3:]))/3
    report['material_identity']={n:round(mean(n),3) for n in ('marble','bone','plaster','frost','clean-tile','basalt','dark-masonry','soot','oil','wood-oak','brick')}
    assert min(mean(n) for n in ('marble','bone','plaster','frost','clean-tile'))-max(mean(n) for n in ('basalt','dark-masonry','soot','oil')) >= 20
    assert mean('basalt') < mean('wood-oak') < mean('plaster')
    for look,names in list(GROUPS.items())[:14]:
        # Surface example uses only legal top/face/floor colours, plus shared mass.
        surfaces={data[n][i-1] for n in names for role in ('top','face','floor') for i in roles(n).get(role,[])} | set(data['void-mass'][:2])
        props=set(c for n in set(names+['wood-oak','iron']) for c in data[n])
        assert len(surfaces)<=32 and len(props)<=48,(look,len(surfaces),len(props))
        report['look_budgets'][look]={'surface_example_colors':len(surfaces),'prop_example_colors':len(props)}
    assert all(lightness(data['void-mass'][1]) <= .75*lightness(data[n][i-1]) for n in materials for i in roles(n)['top'])
    excluded = {rgb(data[n][i-1]) for n in data for i in roles(n).get('reference-only',[])}
    for folder in (OUT/'props', OUT/'swatches', OUT.parent/'proof'):
        for path in folder.glob('*.png'):
            if path.stem.endswith('-grey'): continue
            used = {v[:3] for v in Image.open(path).convert('RGBA').get_flattened_data() if v[3]}
            assert not used & excluded, (path, 'reference-only pigment in scene art', used & excluded)
    im = Image.open(OUT / 'palette.png').convert('RGBA')
    assert im.width % 48 == im.height % 48 == 0
    counts = im.getcolors(im.width*im.height)
    allowed = set(map(rgb, sum(data.values(), [])))
    assert all(a in (0,255) for _,(_,_,_,a) in counts)
    assert all((r,g,b) in allowed for _,(r,g,b,a) in counts if a)
    assert all((r,g,b) == (0,0,0) for _,(r,g,b,a) in counts if not a)
    assert all((r,g,b) != (0,0,0) for _,(r,g,b,a) in counts if a)
    layout = json.loads((REVIEW/'A-layout.json').read_text())
    assert {v['name'] for v in layout} == set(data)
    for row in layout:
        x,y,_,_ = row['box']
        for i,c in enumerate(data[row['name']]):
            assert im.crop((x+i*72,y+16,x+i*72+48,y+64)).getcolors() == [(48*48,(*rgb(c),255))]
    report.update({'atlas_size': list(im.size), 'unique_palette_colors': len(allowed),
                   'atlas_colors': len(counts), 'alpha_values': [255],
                   'off_palette_pixels': 0, 'soft_alpha_pixels': 0, 'black_pixels': 0,
                   'swatches_checked': len(layout)*6, 'master_anchor_occurrences': sum(map(len,ANCHORS.values())), 'max_floor_L_star': round(high_floor,3),
                   'minimum_focal_step6_gap_L_star': round(min(lightness(data[n][5]) for n in reserved)-high_floor,3),
                   'atlas_color_cap': 'not applicable: multi-look reference atlas, not a surface/prop sheet',
                   'floor_singletons': 'not applicable: no authored floor texture in Part A',
                   'outline_geometry': 'not applicable: palette swatches only; darkest entries are not black',
                   'reference_crops': 'unmodified inputs; exempt from the new palette and sheet caps',
                   'files_sha256': {p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.glob('palette.*'))}})
    (REVIEW/'A-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    return report


def reviews():
    palette = Image.open(OUT/'palette.png').convert('RGB')
    master = Image.open(ROOT/'art-drop/dungeon/reference/master-interiors-mock.png').convert('RGB')
    # Adjacent native chips make the repaired focal colours directly comparable.
    panel = Image.new('RGB',(576,432),BG)
    d = ImageDraw.Draw(panel)
    text(d,(24,8),'FOE / BREACH / FOUND TRAP / LOOT: native 48 px chips')
    from build_palette import draw_row
    for i,name in enumerate(('foe-red','lair-breach','found-trap','loot-gold')):
        draw_row(panel,24,32+i*96,name)
    for scale in (1,2,3):
        panel.resize((panel.width*scale,panel.height*scale),Image.Resampling.NEAREST).save(REVIEW/f'A-reserved-comparison-{scale}x.png')
    gray = grey(panel)
    gray.save(REVIEW/'A-reserved-comparison-grey.png')
    gray.resize((144,108),Image.Resampling.NEAREST).save(REVIEW/'A-reserved-comparison-squint.png')
    board = Image.new('RGB',(2304,3216),BG)
    board.paste(palette,(0,48))
    d = ImageDraw.Draw(board)
    text(d,(48,16),'A / COMPLETE PALETTE + NATIVE SOURCE CROPS / DISPLAY SCALE IN FILENAME')
    boxes = [(576,0,1056,480),(1728,888,2208,1368),(96,1824,576,2304)]
    for i, box in enumerate(boxes):
        y = 48 + i*624
        text(d,(1776,y),'MASTER PNG / native crop / '+str(box))
        board.paste(master.crop(box),(1776,y+24))
    text(d,(1776,1968),'Material roles: mass / top / face / floor / prop.')
    text(d,(1776,1992),'Exact master anchors; material-specific value profiles.')
    text(d,(1776,2016),'Quantisation analyses colours; no spatial resampling.')
    for scale in (1,2,3):
        view = board if scale == 1 else board.resize((board.width*scale,board.height*scale),Image.Resampling.NEAREST)
        view.save(REVIEW/f'A-palette-{scale}x.png')
        if scale != 1: del view
    g = grey(board)
    g.save(REVIEW/'A-palette-grey.png')
    # Centre-sample nearest-neighbour squint: no averaging, smoothing or filters.
    g.resize((g.width//4,g.height//4),Image.Resampling.NEAREST).save(REVIEW/'A-palette-squint.png')
    # Manageable detail pages contain every ramp at 1x, 2x and 3x, grey + squint.
    rows = json.loads((REVIEW/'A-layout.json').read_text())
    for page, start in enumerate(range(0,len(rows),6),1):
        selected=rows[start:start+6]
        panel=Image.new('RGB',(480,48+96*len(selected)),BG)
        for i,row in enumerate(selected):
            x,y,x2,y2=row['box']
            panel.paste(palette.crop((x-2,y-2,x2,y2)),(8,24+i*96))
        gray=grey(panel)
        detail=Image.new('RGB',(2016,3168),BG); d=ImageDraw.Draw(detail)
        text(d,(24,12),f'A / RAMPS {start+1}-{start+len(selected)} / NATIVE AND INTEGER ZOOMS')
        detail.paste(panel,(24,48)); text(d,(24,32),'1x')
        detail.paste(gray,(24,720)); text(d,(24,704),'GREYSCALE / 1x')
        detail.paste(gray.resize((panel.width//4,panel.height//4),Image.Resampling.NEAREST),(24,1392))
        text(d,(24,1376),'SQUINT / 4x reduction / nearest')
        detail.paste(panel.resize((panel.width*3,panel.height*3),Image.Resampling.NEAREST),(552,48));text(d,(552,32),'3x NEAREST')
        detail.paste(panel.resize((panel.width*2,panel.height*2),Image.Resampling.NEAREST),(24,1896));text(d,(24,1880),'2x NEAREST')
        source=master.crop((720,48,864,192))
        detail.paste(source,(1056,2112));text(d,(1056,2088),'MASTER / 1x / stone + oak')
        detail.paste(source.resize((432,432),Image.Resampling.NEAREST),(1512,2112));text(d,(1512,2088),'MASTER / 3x NEAREST')
        detail.paste(grey(source),(1056,2328));text(d,(1056,2304),'MASTER / GREYSCALE')
        detail.save(REVIEW/f'A-ramps-{page:02}.png')
    # All value profiles in one diagnostic: flat native chips, no art reduction.
    strip=Image.new('RGB',(1056,1680),BG); d=ImageDraw.Draw(strip)
    text(d,(24,12),'ALL MATERIAL VALUES / native chips / matching greyscale')
    for j,name in enumerate(RAMPS):
        y=48+j*24
        text(d,(24,y+6),name)
        for i,c in enumerate(RAMPS[name]):
            d.rectangle((216+i*36,y,247+i*36,y+19),fill=c)
            g=grey(Image.new('RGB',(1,1),c)).getpixel((0,0))
            d.rectangle((456+i*36,y,487+i*36,y+19),fill=g)
    text(d,(720,48),'MASTER / native 1x')
    strip.paste(master.crop((576,0,864,288)),(720,72))
    strip.paste(grey(master.crop((576,0,864,288))),(720,408))
    text(d,(720,384),'MASTER / greyscale 1x')
    text(d,(720,744),'Pale materials keep higher values.')
    text(d,(720,768),'Soot / basalt / oil stay dark.')
    text(d,(720,792),'Oak and brick sit between them.')
    text(d,(24,1560),'Columns are shades, not roles. Floor windows and body limits are listed per ramp in palette.hex.')
    strip.save(REVIEW/'A-material-values.png')
    # The supplied summer crops are shown intact, including the complete path strip.
    board=Image.new('RGB',(1152,1248),BG);d=ImageDraw.Draw(board)
    for x,name in [(24,'grass'),(360,'street'),(696,'path_joined')]:
        source=Image.open(ROOT/f'art-drop/dungeon/reference/overworld-{name}-0.png').convert('RGBA')
        text(d,(x,16),'SUMMER / '+name+' / NATIVE')
        board.paste(source,(x,48),source)
    text(d,(960,16),'MASTER / NATIVE')
    board.paste(master.crop((720,48,864,192)),(960,48))
    for scale in (1,2,3):
        board.resize((board.width*scale,board.height*scale),Image.Resampling.NEAREST).save(REVIEW/f'A-overworld-{scale}x.png')
    g=grey(board);g.save(REVIEW/'A-overworld-grey.png')
    g.resize((g.width//4,g.height//4),Image.Resampling.NEAREST).save(REVIEW/'A-overworld-squint.png')


if __name__ == '__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--reviews',action='store_true');args=parser.parse_args()
    report=audit()
    print(json.dumps({k:v for k,v in report.items() if k not in ('ramps','look_budgets','files_sha256','prop_body_steps_by_floor')},indent=2))
    if args.reviews: reviews()
