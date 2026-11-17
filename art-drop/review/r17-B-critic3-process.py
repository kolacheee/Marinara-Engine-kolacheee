"""Register image-tool L paint, lock palette, and vote every 8x8 block.

Only existing drawings are transformed. The source's painted perimeter and
ridge/gutter landmarks drive registration; no roof shape or texture is drawn.
"""
from collections import Counter
import importlib.util
import json
from pathlib import Path
from PIL import Image, ImageDraw

REV = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('paint', REV / 'r17-B-process.py')
paint = importlib.util.module_from_spec(spec)
spec.loader.exec_module(paint)
NN = Image.Resampling.NEAREST
LANDMARKS = {
    'a': ([63, 254, 445, 1208, 1396], [64, 635, 823, 1014]),
    'b': ([63, 254, 445, 1208, 1396], [64, 634, 825, 1013]),
    'c': ([63, 254, 445, 1208, 1397], [64, 636, 823, 1014]),
}
TX, TY = [0, 48, 96, 288, 336], [0, 144, 192, 240]


def register(record):
    variant = record['id'][-1]
    sx, sy = LANDMARKS[variant]
    src = Image.open(REV / record['source']).convert('RGBA')
    src.putdata([(0, 0, 0, 0) if r > 140 and b > 110 and r > g * 1.35 and b > g * 1.2
                 else (r, g, b, 255) for r, g, b, _ in src.get_flattened_data()])
    reg = Image.new('RGBA', (336 * 8, 240 * 8))
    rectangles = []
    for iy in range(3):
        for ix in range(4):
            # All regions, including the keyed courtyard, come from the source.
            box = (sx[ix], sy[iy], sx[ix + 1], sy[iy + 1])
            target = (TX[ix] * 8, TY[iy] * 8,
                      TX[ix + 1] * 8, TY[iy + 1] * 8)
            band = src.crop(box).resize((target[2] - target[0], target[3] - target[1]),
                                        Image.Resampling.BOX)
            reg.paste(band, target[:2])
            rectangles.append(dict(source=box, target8=target))
    palette = [paint.BASE[0], *paint.RED]
    pal = Image.new('P', (1, 1))
    pal.putpalette([v for c in palette + [palette[-1]] * (256 - len(palette)) for v in c])
    rgb = reg.convert('RGB').quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    reg.putdata([(*p, 255) if a >= 128 else (0, 0, 0, 0)
                 for p, a in zip(rgb.get_flattened_data(), reg.getchannel('A').get_flattened_data())])
    return reg, rectangles


def mode_reduce(reg):
    data = list(reg.get_flattened_data())
    out = []
    for y in range(240):
        for x in range(336):
            counts = Counter(p for yy in range(8) for p in
                             data[(y * 8 + yy) * reg.width + x * 8:
                                  (y * 8 + yy) * reg.width + x * 8 + 8])
            out.append(min(counts, key=lambda p: (-counts[p], p)))
    im = Image.new('RGBA', (336, 240))
    im.putdata(out)
    return im


def cleanup(mode):
    w, h = mode.size
    data = list(mode.get_flattened_data())
    out = data[:]
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if not data[i][3]:
                continue
            near = [data[yy * w + xx] for xx, yy in
                    ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                    if 0 <= xx < w and 0 <= yy < h]
            if len(near) < 4 or any(not p[3] for p in near):
                out[i] = paint.DARK
            elif len(set(near)) == 1 and data[i] != near[0]:
                diagonal = [data[yy * w + xx] for xx, yy in
                            ((x - 1, y - 1), (x + 1, y - 1), (x - 1, y + 1), (x + 1, y + 1))
                            if 0 <= xx < w and 0 <= yy < h]
                if data[i] not in diagonal:
                    out[i] = near[0]
    im = Image.new('RGBA', mode.size)
    im.putdata(out)
    edits = [[i % w, i // w, list(a), list(b)] for i, (a, b) in enumerate(zip(data, out)) if a != b]
    return im, edits


def run():
    records = json.loads((REV / 'r17-B-critic3-generation.json').read_text())
    processing = []
    house = Image.open(REV.parent / 'reference/r17/fantasy-house-2.png').convert('RGBA')
    for rec in records:
        reg, rectangles = register(rec)
        mode = mode_reduce(reg)
        clean, edits = cleanup(mode)
        stem = rec['id']
        paint.save(reg, REV / f'r17-B-registered-{stem}.png')
        paint.save(mode, REV / f'r17-B-mode-{stem}.png')
        paint.save(clean, REV / f'r17-B-clean-{stem}.png', Cleanup=edits)
        processing.append(dict(id=stem, rectangles=rectangles, size=list(mode.size),
                               mode_blocks=336 * 240, samples_per_block=64, cleanup=edits))
        proof = Image.new('RGBA', (1960, 1240), (64, 70, 64, 255))
        draw = ImageDraw.Draw(proof)
        draw.text((8, 8), stem + ' / 1x and exact 4x / fantasy-house-2', fill='white')
        proof.alpha_composite(clean, (8, 28))
        proof.alpha_composite(house, (360, 28))
        proof.alpha_composite(clean.resize((1344, 960), NN), (8, 272))
        proof.alpha_composite(house.resize((576, 576), NN), (1370, 272))
        paint.save(proof, REV / f'r17-B-critic3-selection-{stem[-1]}.png')
        if rec.get('selected'):
            for c in range(3):
                paint.save(paint.colour(clean, c), REV / f'r17-B-critic3-L-paint-c{c}.png',
                           Source=rec['source'], Method='BOX registration, palette lock, exact 8x8 mode, contour cleanup')
        print(stem, 'colours', len(set(clean.get_flattened_data())), 'cleanup', len(edits))
    (REV / 'r17-B-critic3-processing.json').write_text(json.dumps(processing, indent=2) + '\n')


if __name__ == '__main__':
    run()
