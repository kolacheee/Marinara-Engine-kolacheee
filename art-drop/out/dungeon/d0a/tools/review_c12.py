"""Review the operator-correction attempt without replacing rejected artwork."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

from draw_proofs import BASE, REVIEW, S
from review_c9 import lone_pixels
from review_c7 import run as contacts
from check_proofs import native_master
import check_operator_c as checks


def run():
    checks.BODY.update({
        'temple': [('brass', 4)], 'cave_crystal': [('dark-rock', 6)],
        'crypt': [('dark-masonry', 6)], 'cave_lava': [('ash', 5), ('ash', 2)],
        'station_hydro': [('planters', 4), ('planters', 5),
                          ('overgrowth', 4), ('overgrowth', 5)],
    })
    report = checks.run()
    for name, stats in report['results'].items():
        stats['checks'].pop('coverage_8px')
        floor = Image.open(REVIEW / f'C-layer-{name}-floor.png').convert('RGBA')
        wall = Image.open(REVIEW / f'C-layer-{name}-wall.png').convert('RGBA')
        surface = floor.copy()
        surface.paste(wall, (0, 0))
        proof = Image.open(BASE / f'proof/{name}.png')
        stats['lone_pixels'] = {region: lone_pixels(im) for region, im in (
            ('surface', surface), ('proof', proof), ('floor', floor),
            ('top', wall.crop((0, 8, 144, 48))),
            ('face', wall.crop((0, 48, 144, 95))),
        )}
        stats['checks']['lone_pixel_ceiling_3pct'] = all(
            x['percent'] <= 3 for x in stats['lone_pixels'].values())
        repeat = Image.new('RGBA', (432, 432))
        for y in range(3):
            for x in range(3):
                repeat.paste(floor, (x * 144, y * 144))
        repeat.save(REVIEW / f'proof-3x3repeat-{name}.png')
        master, _ = native_master(name.startswith('station_'))
        sheet = Image.new('RGB', (608, 326), '#222630')
        ImageDraw.Draw(sheet).text((8, 8), name + ' / existing proof 2x; master same art scale / redraw unresolved', fill='white')
        sheet.paste(proof.resize((288, 288), Image.Resampling.NEAREST), (8, 30))
        sheet.paste(master.resize((288, 288), Image.Resampling.NEAREST), (312, 30))
        sheet.save(REVIEW / f'C-op2-{name}.png')
    report['failures'] = [f'{n}: {k}' for n, s in report['results'].items()
                          for k, passed in s['checks'].items() if not passed]
    report['numeric_pass'] = not report['failures']
    report['art_accepted'] = False
    report['pass'] = False
    report['notes'] += ['Existing proofs remain rejected by operator-C.md. No generated candidate was imported.']
    before = json.loads((REVIEW / 'C12-start-hashes.json').read_text())
    report['changed_existing_art'] = [name for name, digest in before.items()
        if name.endswith('.png') and hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest]
    (REVIEW / 'C12-current-validation.json').write_text(json.dumps(report, indent=2) + '\n')
    contacts()
    for name in S:
        paths = sorted((REVIEW / 'C12-sources').glob(name + '-*.png'))
        if not paths:
            continue
        sheet = Image.new('RGB', (1320, 1356), '#222630')
        d = ImageDraw.Draw(sheet)
        for i, path in enumerate(paths):
            im = Image.open(path).convert('RGB')
            y = 24 + i * 448
            d.text((8, y - 18), path.stem + ' / source overview (diagnostic reduction); native crop 1x, 2x, 3x; grey; squint', fill='white')
            # Overviews are review-only, never read back into art.
            sheet.paste(im.resize((420, 420), Image.Resampling.NEAREST), (8, y))
            crop = im.crop((400, 600, 496, 696))
            for scale, x in ((1, 440), (2, 544), (3, 744)):
                sheet.paste(crop.resize((96 * scale, 96 * scale), Image.Resampling.NEAREST), (x, y))
            sheet.paste(crop.convert('L'), (1040, y))
            sheet.paste(crop.convert('L').resize((24, 24), Image.Resampling.NEAREST), (1144, y))
        sheet.save(REVIEW / f'C12-source-review-{name}.png')
    print(json.dumps({'numeric_pass': report['numeric_pass'], 'art_accepted': False,
                      'changed_existing_art': report['changed_existing_art'],
                      'lone_pixels_percent': {n: s['lone_pixels']['surface']['percent']
                                              for n, s in report['results'].items()}}, indent=2))


if __name__ == '__main__':
    run()
