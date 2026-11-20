"""D0a Part A: draw the curated chips at native resolution, without resampling."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[5]
OUT = ROOT / "art-drop/out/dungeon/d0a/canon"
REVIEW = ROOT / "art-drop/review-d0a"

# Each row is an explicit, reviewed six-colour choice, darkest first.
RAMPS = {
    "limestone": "#252a36 #4e535a #74766f #989f9d #b8b5a3 #d2c1a5".split(),
    "wood-oak": "#282337 #553d2b #825b39 #91643b #b69057 #d8b77c".split(),
    "iron": "#192330 #313d4c #535e68 #7b858a #a3acaa #c2c7ba".split(),
    "sandstone": "#352937 #63504b #8e7057 #aa895f #c5a777 #e1c593".split(),
    "marble": "#303246 #555e70 #717f8c #b0bab9 #d1d3c9 #ddd7ca".split(),
    "brass": "#30263d #655038 #96803f #b79d4f #cab269 #e2cc94".split(),
    "plaster": "#333044 #605d65 #83817a #b3ab97 #d2c1a5 #ddd7ca".split(),
    "timber": "#252032 #493233 #6b3e2b #93613d #b38453 #d1ab70".split(),
    "parquet": "#2e2438 #553d2b #825b39 #a07748 #b69057 #d1af7b".split(),
    "textiles-russet": "#302336 #5a3546 #844c50 #a86a59 #c89473 #dbb89b".split(),
    "textiles-teal": "#182e3e #294f59 #427579 #63958d #94b9a4 #c0ceae".split(),
    "dark-masonry": "#171924 #292b3b #3f4252 #575a64 #737770 #939485".split(),
    "bone": "#303142 #5e6166 #8b8e86 #b7b49b #d0c6a8 #ded2b6".split(),
    "lichen": "#23323a #354937 #576e49 #7e925d #99ae80 #c3c99d".split(),
    "grey-brown-rock": "#292737 #48414a #6b605a #898070 #a99c80 #c3b294".split(),
    "mud": "#252132 #403038 #584338 #70593e #8b714c #aa8f65".split(),
    "fungus": "#32263f #573d61 #805775 #aa7e87 #cca69b #dfc7b1".split(),
    "blue-ice": "#202d50 #465e83 #5e829e #85b4c4 #abd0d4 #c5d7d5".split(),
    "frost": "#2d3c53 #49617c #6c8297 #aec5ce #bcccd1 #d0d5ce".split(),
    "snowdrift": "#343a54 #56647e #768297 #b7c4cc #c4d0d1 #d6d3cb".split(),
    "dark-rock": "#201c32 #352c46 #4c405c #635671 #81738b #a294a2".split(),
    "violet-crystal": "#2a204a #4c3c77 #7658a4 #9b80c4 #b7a3da #d5c6e3".split(),
    "basalt": "#181723 #292632 #3c3641 #514950 #68615f #82796c".split(),
    "embers": "#2d192b #63303b #98433c #bc6048 #cf824f #e7b17b".split(),
    "ash": "#282733 #494650 #6c686e #928e8a #b0aaa0 #c8c0af".split(),
    "brick": "#302131 #59323b #804a43 #a16950 #bd8d67 #d8b28a".split(),
    "slime": "#23332f #3b5141 #657b3f #94a448 #b9bf65 #d4cf98".split(),
    "sewer-water": "#192f39 #2e4851 #426560 #668570 #94a78a #bac2a2".split(),
    "station-panels": "#202c40 #3a4b61 #5c7081 #81959f #a7b6b8 #c8cebf".split(),
    "hazard-paint": "#342e40 #66573e #958047 #b49c5e #c9b87f #dbcdac".split(),
    "clean-tile": "#2c3b4c #4e6576 #70858f #b2c5c5 #c2d0ca #ddd7ca".split(),
    "tank-glass": "#1c304c #30556e #4c8295 #7cabb6 #a5c8c9 #c5d5cf".split(),
    "spills": "#283341 #38564f #527d61 #83a171 #adc19a #cad0ac".split(),
    "soot": "#151a24 #232a33 #343d43 #4c5556 #656c65 #83887a".split(),
    "oil": "#191827 #27263e #393a56 #515a71 #6e818a #9aa4a1".split(),
    "pipes": "#202d3a #3c525e #667e86 #8ba3a7 #b3c1bd #d3d1bd".split(),
    "planters": "#342539 #62414c #8c5c54 #ae815f #c5a279 #dbc29e".split(),
    "overgrowth": "#1f3139 #354937 #546e48 #7b925e #99ae80 #b8bd89".split(),
    "leaks": "#203247 #395467 #597d87 #80a3a2 #a6bfb2 #cad0b6".split(),
    "yard-grass": "#273440 #3e523d #60762f #798934 #99ae80 #c0bf90".split(),
    "yard-path": "#302d40 #5a4e3c #73644d #8d7958 #b49b71 #d2b68b".split(),
    "yard-cobble": "#292e3c #454f56 #60655c #898065 #aaa48e #cbc0a6".split(),
    "roof-slate": "#202b41 #3b4a64 #596e84 #80969f #a8b9bb #c9ccbf".split(),
    "hoard-bronze": "#30253b #594134 #84603d #a6804c #bf9f69 #d3b994".split(),
    "haven-wine": "#2f203f #54314d #79526b #9e7894 #b69bb2 #d1bdc8".split(),
    "drowned-kelp": "#203339 #335448 #4f7b5c #7b9c74 #a4ba91 #c8cca9".split(),
    "sanctum-cloth": "#2c2644 #4e4568 #706488 #958bac #b6aac5 #d2c9da".split(),
    "breach-stone": "#312836 #5a454b #836054 #a77e68 #c39f85 #d8bea6".split(),
    "hive-resin": "#29333c #49523c #707c46 #98a05e #b4b780 #cecca2".split(),
    "foe-red": "#301728 #652a40 #a43036 #db414f #ed7b80 #f4b5b6".split(),
    "loot-gold": "#30273d #65501e #9b790b #c09b19 #ddb641 #f0d075".split(),
    "found-trap": "#322338 #70451e #ac6a0e #db921a #eeb341 #f4cc7e".split(),
    "lair-hoard": "#30203a #643e2d #92582b #b67b3f #cd995c #e1bb8a".split(),
    "lair-haven": "#311a40 #62284f #963966 #c15b9b #dc89c0 #edbadc".split(),
    "lair-drowned": "#172f38 #1d554d #237d63 #449f78 #7cbd95 #b7d6b8".split(),
    "lair-sanctum": "#251b48 #4d2b7c #783eb2 #9e6bd1 #b99ae6 #d4c8eb".split(),
    "lair-breach": "#321b30 #713332 #af481b #e36d2a #f29958 #f7c19a".split(),
    "lair-den": "#2e293f #5e5747 #8b815d #b0a374 #c7bb8c #ddd0b0".split(),
    "lair-hive": "#25312b #485c2c #75851e #a4ac3e #bdbe68 #d8cd96".split(),
    "void-mass": "#101522 #18202b #212c37 #303e48 #42535a #586b6d".split(),
    "textiles-sage": "#223542 #354937 #64745c #99ae80 #bdc5a3 #d4d2b5".split(),
}

GROUPS = {'keep': ['limestone', 'wood-oak', 'iron'], 'temple': ['sandstone', 'marble', 'brass'], 'manor': ['plaster', 'timber', 'parquet', 'textiles-russet', 'textiles-teal'], 'crypt': ['dark-masonry', 'bone', 'lichen'], 'cave_rock': ['grey-brown-rock', 'mud', 'fungus'], 'cave_ice': ['blue-ice', 'frost', 'snowdrift'], 'cave_crystal': ['dark-rock', 'violet-crystal'], 'cave_lava': ['basalt', 'embers', 'ash'], 'dungeon_sewer': ['brick', 'slime', 'sewer-water'], 'station_corridor': ['station-panels', 'hazard-paint'], 'station_lab': ['clean-tile', 'tank-glass', 'spills'], 'station_engine': ['soot', 'oil', 'pipes'], 'station_hydro': ['planters', 'overgrowth', 'leaks'], 'building-yard': ['yard-grass', 'yard-path', 'yard-cobble', 'roof-slate'], 'lair-dressing': ['hoard-bronze', 'haven-wine', 'drowned-kelp', 'sanctum-cloth', 'breach-stone', 'hive-resin'], 'gameplay-only': ['foe-red', 'loot-gold', 'found-trap'], 'feature-only': ['lair-hoard', 'lair-haven', 'lair-drowned', 'lair-sanctum', 'lair-breach', 'lair-den', 'lair-hive']}

GROUPS['shared-space'] = ['void-mass']
GROUPS['manor'].append('textiles-sage')

# Exact 24-colour median-cut anchors, curated into the named material families.
ANCHORS = {
 'wood-oak': ['#553d2b', '#825b39', '#91643b', '#b69057'],
 'timber': ['#6b3e2b'],
 'plaster': ['#d2c1a5', '#ddd7ca'],
 'limestone': ['#989f9d'],
 'overgrowth': ['#354937', '#99ae80'],
 'textiles-sage': ['#354937', '#99ae80'],
}
# Only these materials are intended as broad floors. Choose a subset for each sheet.
FLOOR_RAMPS = 'limestone wood-oak sandstone marble plaster parquet dark-masonry grey-brown-rock mud blue-ice frost snowdrift dark-rock basalt ash brick sewer-water station-panels clean-tile soot oil planters yard-grass yard-path yard-cobble'.split()



def lightness(value):
    rgb = tuple(int(value[i:i+2], 16) / 255 for i in (1, 3, 5))
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
    y = sum(v * w for v, w in zip(linear, (.2126729, .7151522, .0721750)))
    return 116 * (y ** (1/3) if y > (6/29)**3 else y / (3 * (6/29)**2) + 4/29) - 16


FONT = ImageFont.load_default_imagefont()  # Embedded bitmap glyphs, no font rasterisation.
BG = RAMPS['void-mass'][0]
INK = RAMPS['bone'][5]
MUTED = RAMPS['limestone'][4]
ACCENT = RAMPS['wood-oak'][5]


def text(draw, xy, label, color=INK):
    draw.fontmode = '1'
    draw.text(xy, label, fill=color, font=FONT)


def draw_row(im, x, y, name):
    draw = ImageDraw.Draw(im)
    text(draw, (x, y), name)
    for index, color in enumerate(RAMPS[name]):
        sx = x + index * 72
        draw.rectangle((sx-1, y+15, sx+48, y+64), outline=RAMPS['limestone'][2])
        draw.rectangle((sx, y + 16, sx + 47, y + 63), fill=color)
        text(draw, (sx, y + 65), f'{index+1}:L*{lightness(color):.0f}')
        text(draw, (sx, y + 79), color, MUTED)


def roles(name):
    values = [lightness(c) for c in RAMPS[name]]
    reserved = name in GROUPS['gameplay-only'] + GROUPS['feature-only']
    if reserved:
        return {'focal': [i+1 for i,l in enumerate(values) if 70 <= l <= 85]}
    if name == 'void-mass':
        return {'mass': [i+1 for i,l in enumerate(values) if 5 <= l <= 15]}
    result = {role: [i+1 for i,l in enumerate(values) if lo <= l <= hi]
              for role,lo,hi in [('top',18,30),('face',25,40),('body',30,70)]}
    floor = [i+1 for i,l in enumerate(values) if 35 <= l <= 55] if name in FLOOR_RAMPS else []
    # A ramp's floor window is at most 15 L*, never +/-15 (a 30 L* span).
    while floor and values[floor[-1]-1] - values[floor[0]-1] > 15:
        floor.pop(0)
    result['floor'] = floor
    result['glint'] = [i+1 for i,l in enumerate(values) if 70 < l <= 85]
    result['reference-only'] = [i+1 for i,l in enumerate(values) if l > 85]
    return result


def role_label(name):
    return '  '.join(k + ':' + ','.join(map(str,v)) for k,v in roles(name).items() if v)


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    master = Image.open(ROOT / 'art-drop/dungeon/reference/master-interiors-mock.png').convert('RGB')
    q = master.quantize(colors=24, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    q.save(REVIEW / 'A-master-quantised.png')
    p = q.getpalette()
    counts = [{'hex': '#%02x%02x%02x' % tuple(p[i*3:i*3+3]), 'pixels': n}
              for n,i in sorted(q.getcolors(), reverse=True)]
    (REVIEW / 'A-master-quantised.json').write_text(json.dumps(counts, indent=2) + '\n')
    assert set(sum(ANCHORS.values(), [])) <= {c['hex'] for c in counts}
    (OUT / 'palette.json').write_text(json.dumps(RAMPS, indent=2) + '\n')
    lines = [
        '; D0a Part A / explicit material values / sRGB, CIELAB L* D65',
        '; Roles belong to colours, never to a fixed step number across materials.',
        '; Mass L*5-15 uses void-mass and must be <=75% of the actual wall-top L*.',
        '; Tops L*18-30; faces L*25-40; floors L*35-55 with total span <=15.',
        '; Listed floor steps only. If a role is absent, borrow a compatible ramp.',
        '; Outlines use step 1 of the object ramp, with >=10 L* gap from the floor.',
        '; Body L*30-70 AND >=10 L* from its actual floor. Not every pairing works.',
        '; Glints are small highlights, never broad bodies, floors or faces.',
        '; Reference-only steps above 85 retain exact master anchors; do not use in scene art.',
        '; Top-left edges at most one step lighter than adjacent object shade.',
        '; Focal colours require >=15 L* above their actual floor and L*<=85.',
        '; Gameplay and feature ramps are entity-only; found traps need a striped rim.',
        '; Hoard heap body steps 3-4; loose loot steps 5-6. Dress with hoard-bronze.',
        '; Hive dressing uses hive-resin. Ember material is muted relative to the rift.',
        '; Material caps: surfaces 32 / props 48. The complete atlas is exempt.',
    ]
    for group, names in GROUPS.items():
        lines.extend(['', '; ' + group])
        for name in names:
            lines.append('; ' + name + ' / ' + role_label(name))
            lines.extend(f'{c} {name}-{i+1} L*={lightness(c):.0f}' for i,c in enumerate(RAMPS[name]))
            lines.append('')
    (OUT / 'palette.hex').write_text('\n'.join(lines).rstrip() + '\n')
    im = Image.new('RGB', (1728, 3120), BG)
    draw = ImageDraw.Draw(im)
    text(draw, (48,24), f'D0a / PALETTE CANON / {len(RAMPS)} MATERIAL AND ENTITY RAMPS', ACCENT)
    text(draw, (48,48), 'Native 48 px chips / bitmap labels / six authored colours per ramp / values vary by material.')
    text(draw, (48,68), 'OUTLINE = own ramp step 1. BODY = L*30-70 with >=10 gap to floor. FLOOR = listed steps, total span <=15 L*.')
    text(draw, (48,88), 'GLINT = small highlight only. MASTER ANCHORS ABOVE L*85 = reference-only, excluded from scene roles.')
    text(draw, (48,108), 'Gameplay / feature ramps: reserved entities only. Focal colour >=15 L* above floor. Found traps also need a striped rim.')
    bands = [('MASS / VOID','5-15','void-mass',1), ('WALL TOP','18-30','void-mass',3),
             ('WALL FACE','25-40','dark-masonry',2), ('FLOOR','35-55','grey-brown-rock',2),
             ('PROP BODY','30-70','wood-oak',4), ('LOOT / FEATURE','up to 85','loot-gold',5)]
    for i,(name,bounds,ramp,step) in enumerate(bands):
        x=48+i*272
        text(draw,(x,144),name)
        draw.rectangle((x,164,x+239,199),fill=RAMPS[ramp][step])
        text(draw,(x,207),'L* '+bounds)
    text(draw,(48,240),'Read per-ramp roles in palette.hex. Blank role = use another compatible material; do not stretch a ramp across the ladder.',MUTED)
    text(draw,(48,272),'MASTER PNG / 24-COLOUR QUANTISATION / exact anchors beside the curated families',ACCENT)
    for col,name in enumerate(('wood-oak','plaster','overgrowth')):
        x=48+col*576
        draw_row(im,x,304,name)
        text(draw,(x,408),'MASTER ANCHORS / verbatim')
        for i,c in enumerate(ANCHORS[name]):
            sx=x+i*96
            draw.rectangle((sx,428,sx+47,475),fill=c)
            text(draw,(sx,480),c)
            text(draw,(sx,496),f'L*{lightness(c):.0f}')
    text(draw,(48,528),'Master green also anchors textiles-sage. Cool outlines and warm lights extend these colours; intermediate shades are discarded.',MUTED)
    columns = [list(GROUPS)[:6], list(GROUPS)[6:13], list(GROUPS)[13:]]
    layout=[]
    for col,groups in enumerate(columns):
        x,y=48+col*576,576
        for group in groups:
            text(draw,(x,y),group.upper().replace('-',' '),ACCENT)
            draw.line((x,y+19,x+455,y+19),fill=MUTED)
            y+=32
            for name in GROUPS[group]:
                draw_row(im,x,y,name)
                layout.append({'name':name,'box':[x,y,x+456,y+96],'group':group})
                y+=96
        assert y < 3048, (col,y)
    text(draw,(48,3056),'Void/mass is a separate shared ramp. Material outlines keep their own hue. Floor roles are per material, not per column.',MUTED)
    text(draw,(48,3076),'Yard source crops stay unchanged. Part B chooses the canon cell size. Palette chips do not choose that size.',MUTED)
    text(draw,(48,3096),'Full role lists and restrictions: palette.hex. Ramp membership: palette.json. Geometry and texture proofs follow in Part C.',MUTED)
    im.save(OUT / 'palette.png')
    (REVIEW / 'A-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
    print(f'Wrote {len(RAMPS)} ramps / {len(set(sum(RAMPS.values(), [])))} unique colours; atlas {im.size}')


if __name__ == '__main__':
    build()
