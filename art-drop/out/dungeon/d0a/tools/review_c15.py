"""Round 15 evidence and current-art reviews; never imports rejected sources."""
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
        # Critic 15 explicitly accepts calm fill. The former coverage ceiling
        # caused texture to be added to otherwise legible material planes.
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
            v['percent'] <= 3 for v in stats['lone_pixels'].values())
        repeat = Image.new('RGBA', (432, 432))
        for y in range(3):
            for x in range(3):
                repeat.paste(floor, (x * 144, y * 144))
        repeat.save(REVIEW / f'proof-3x3repeat-{name}.png')
        master, _ = native_master(name.startswith('station_'))
        sheet = Image.new('RGB', (608, 326), '#222630')
        ImageDraw.Draw(sheet).text((8, 8), name + ' / saved proof 2x; master at equal art-pixel scale', fill='white')
        sheet.paste(proof.resize((288, 288), Image.Resampling.NEAREST), (8, 30))
        sheet.paste(master.resize((288, 288), Image.Resampling.NEAREST), (312, 30))
        sheet.save(REVIEW / f'C-op2-{name}.png')
    report['failures'] = [f'{n}: {k}' for n, s in report['results'].items()
                          for k, passed in s['checks'].items() if not passed]
    report['numeric_pass'] = not report['failures']
    report['art_accepted'] = False
    report['pass'] = False
    critic = json.loads((REVIEW / 'critic-C-15.json').read_text())
    report['unresolved_art_files'] = [n for n, v in critic['files'].items()
                                      if v['status'] == 'fail']
    report['notes'] += ['Critic 15 drawing failures remain. No candidate was imported.']
    before = json.loads((REVIEW / 'C15-start-hashes.json').read_text())
    report['changed_existing_art'] = [name for name, digest in before.items()
        if name.endswith('.png') and hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest]
    (REVIEW / 'C15-current-validation.json').write_text(json.dumps(report, indent=2) + '\n')
    contacts()
    for path in sorted((REVIEW / 'C15-sources').glob('*.png')):
        im = Image.open(path).convert('RGB')
        sheet = Image.new('RGB', (1200, 1450), '#222630')
        d = ImageDraw.Draw(sheet)
        d.text((8, 8), path.stem + ' / REJECTED SOURCE / overviews are diagnostics only', fill='white')
        sheet.paste(im.resize((432, 432), Image.Resampling.NEAREST), (8, 32))
        for i, (x, y) in enumerate(((380, 200), (400, 600), (840, 1000))):
            crop = im.crop((x, y, x + 96, y + 96))
            top = 500 + i * 320
            d.text((8, top - 18), f'Source crop ({x},{y}) / 1x, 2x, 3x, grey, quarter squint', fill='white')
            for scale, left in ((1, 8), (2, 112), (3, 312)):
                sheet.paste(crop.resize((96 * scale, 96 * scale), Image.Resampling.NEAREST), (left, top))
            sheet.paste(crop.convert('L'), (608, top))
            sheet.paste(crop.convert('L').resize((24, 24), Image.Resampling.NEAREST), (712, top))
        # Native full-source grey and squint distinguish shading from flat blocks.
        sheet.paste(im.convert('L').resize((432, 432), Image.Resampling.NEAREST), (456, 32))
        sheet.save(REVIEW / f'C15-source-review-{path.stem}.png')
    print(json.dumps({'numeric_pass': report['numeric_pass'], 'art_accepted': False,
                      'changed_existing_art': report['changed_existing_art'],
                      'unresolved_files': len(report['unresolved_art_files']),
                      'lone_pixels_percent': {n: s['lone_pixels']['surface']['percent']
                                              for n, s in report['results'].items()}}, indent=2))


if __name__ == '__main__':
    run()
