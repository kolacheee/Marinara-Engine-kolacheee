"""STYLE.md reduction only; no drawing or local repair of figure pixels."""
from pathlib import Path
import json
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
RAMPS = {
    'contour': '292730 3D3540',
    'moss': '303D38 485947 71805A 9DA67A BDCA99',
    'wood': '443237 66503F 90714E B99A6A D0B88A',
    'skin': '785146 AD7960 D4A47B E8C69B',
    'linen': '605A54 8D8571 B8AF91 D0C5A5 E1D6B5',
    'iron': '333843 505D68 849296 B9C1B6',
}
# Fixed material subsets, ordered as in STYLE.md, shared by both views.
SUBSETS = {name: [h for ramp in ramps for h in RAMPS[ramp].split()]
           for name, ramps in {
               'innkeeper': ['contour', 'moss', 'wood', 'skin', 'linen'],
               'elder': ['contour', 'moss', 'wood', 'skin', 'linen', 'iron'],
           }.items()}
(OUT / 'test-palettes.json').write_text(json.dumps(SUBSETS, indent=2) + '\n')
BG = Image.open(ROOT / 'STYLE-SHEET.png').convert('RGB').getpixel((0, 0))

def reduce(name, source):
    character = name.split('-')[0]
    palette = [tuple(bytes.fromhex(h)) for h in SUBSETS[character]]
    original = Image.open(ROOT / source).convert('RGBA')
    keyed = Image.new('RGBA', original.size)
    keyed.putdata([(0,0,0,0) if r > 120 and b > 100 and g < .60*r and g < .65*b else (r,g,b,255) for r,g,b,_ in original.getdata()])
    bounds = keyed.getbbox()
    crop = keyed.crop(bounds)
    width = round(crop.width * 92 / crop.height)
    if width > 90:
        raise ValueError(f'{name}: width {width} exceeds 90; regenerate')
    reduced = crop.resize((width, 92), Image.Resampling.LANCZOS)
    snapped = []
    moss = [tuple(bytes.fromhex(h)) for h in RAMPS['moss'].split()]
    gated = 0
    for index, (r,g,b,a) in enumerate(reduced.getdata()):
        if a < 144:
            snapped.append((0,0,0,0))
        else:
            # Same fixed olive-cloth hue gate and head exclusion as STYLE.md's
            # Wren pipeline, reused for these two new moss-clothed characters.
            row = index // width
            gate = 30 <= row <= 91 and g >= .78*r and g <= 1.25*r and b < .64*g and g > 48
            candidates = moss if gate else palette
            gated += int(gate)
            colour = min(candidates, key=lambda c: 2*(r-c[0])**2 + 3*(g-c[1])**2 + (b-c[2])**2)
            snapped.append((*colour,255))
    reduced.putdata(snapped)
    reduced = reduced.crop(reduced.getbbox())
    frame = Image.new('RGBA', (96, 128))
    frame.paste(reduced, ((96-reduced.width)//2, 125-reduced.height))
    dest = OUT / f'test-{name}.png'
    frame.save(dest)
    review = Image.new('RGB', frame.size, BG)
    review.paste(frame, mask=frame.getchannel('A'))
    review.resize((384, 512), Image.Resampling.NEAREST).save(OUT / 'review' / f'{name}-4x.png')
    info = check(dest, palette)
    info.update(source=source, source_size=list(Image.open(ROOT / source).size), source_bounds=list(bounds), resized_width=width, moss_gate_pixels=gated)
    (OUT / 'review' / f'{name}-checks.json').write_text(json.dumps(info, indent=2)+'\n')
    print(json.dumps(info))

def check(path, palette):
    im = Image.open(path).convert('RGBA')
    pixels = list(im.getdata())
    colours = {p[:3] for p in pixels if p[3] == 255}
    assert im.size == (96,128)
    assert {p[3] for p in pixels} == {0,255}
    assert all(p == (0,0,0,0) for p in pixels if p[3] == 0)
    assert colours <= set(palette)
    box = im.getbbox()
    assert box[1] == 33 and box[3] == 125, box
    assert box[3] - box[1] == 92
    return dict(file=path.name, dimensions=list(im.size), alpha=[0,255], bounds=list(box), visible_height=92, baseline=124, colours=len(colours), palette_ok=True, transparent_black=True)

def assemble():
    items = [(f'{n} {v}', ROOT/'ref-sprites'/f'{n}-{v}.png') for n in ['wren','hadrik','noble'] for v in ['front','side']]
    items += [(f'{n} {v}', OUT/f'test-{n}-{v}.png') for n in ['innkeeper','elder'] for v in ['front','side']]
    if not all(p.exists() for _,p in items):
        return
    strip = Image.new('RGB', (len(items)*288, 420), BG)
    draw = ImageDraw.Draw(strip)
    font = ImageFont.load_default(size=19)
    for i,(label,path) in enumerate(items):
        im = Image.open(path).convert('RGBA').resize((288,384), Image.Resampling.NEAREST)
        strip.paste(im, (i*288,36), im)
        draw.text((i*288+144,9), label.title(), fill='#333139', font=font, anchor='mt')
    strip.save(OUT/'test-strip.png')
    # Unscaled figures for native-size inspection, no pixel changes.
    native = Image.new('RGB', (4*96,128), BG)
    for i,(_,path) in enumerate(items[6:]):
        im = Image.open(path).convert('RGBA')
        native.paste(im,(i*96,0),im)
    native.save(OUT/'review'/'native.png')
    unions = {}
    for name in SUBSETS:
        colours = set()
        for view in ['front','side']:
            pixels = Image.open(OUT/f'test-{name}-{view}.png').convert('RGBA').getdata()
            colours.update(p[:3] for p in pixels if p[3] == 255)
        assert len(colours) <= 32
        unions[name] = len(colours)
    report = {'background_rgb': list(BG), 'strip_dimensions': list(strip.size), 'colour_union_by_character': unions, 'allowed_palette_sizes': {k:len(v) for k,v in SUBSETS.items()}}
    (OUT/'test-checks.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report))

if len(sys.argv) == 3:
    reduce(sys.argv[1],sys.argv[2])
assemble()
