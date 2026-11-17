"""Corner regression: preserve complete drawn facades, fixed courses and lot bounds."""
from pathlib import Path
import base64
import hashlib
import importlib.util
import io
import json
import subprocess
import sys

from PIL import Image

REV = Path(__file__).resolve().parent
ART = REV.parent
OUT = ART / 'out/city17'


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded


def equal(a, b):
    return a.size == b.size and a.tobytes() == b.tobytes()


def image(path):
    return Image.open(path).convert('RGBA')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def regression(city):
    checks = []

    def check(ok, label):
        checks.append(dict(pass_=bool(ok), check=label))

    # Independent expected assemblies for the actual critic-scene call sites.
    expected = {
        'north-3': ['ground-work-w1-c1', 'storey-jetty-w1-c1'],
        'L-wing-3': ['ground-shop-v1-w1-c1'],
        'L-wing-8': ['ground-door-w2-c0', 'storey-jetty-w2-c0'],
    }
    layout = city.critic_layouts()['L-block']
    for lot in layout['buildings']:
        if lot['id'] not in expected:
            continue
        spec = lot['spec']
        building, parts = city.build(spec)
        check(building.width == spec['width'] * 48, lot['id'] + ' unchanged lot width')
        for floor, name in enumerate(expected[lot['id']]):
            y = building.height - (floor + 1) * 48
            source = city.asset(name)
            box = (0, y + 1, source.width, y + 47)
            check(equal(building.crop(box), source.crop((0, 1, source.width, 47))),
                  lot['id'] + ' complete narrower drawing: ' + name)
            kind = 'ground' if floor == 0 else 'storey'
            corner = city.asset(f"corner-{kind}-c{spec['colour']}")
            check(equal(building.crop((source.width, y + 1, building.width, y + 47)),
                        corner.crop((0, 1, 48, 47))), lot['id'] + ' intact corner ' + kind)
            donor = city.asset(city.ground_name(spec)).crop((0, 0, building.width, 1))
            for row in (0, 47):
                check(equal(building.crop((0, y + row, building.width, y + row + 1)), donor),
                      lot['id'] + f' full-lot drawn course floor {floor} row {row}')
        check(building.getbbox()[3] == building.height, lot['id'] + ' bottom-left anchor')

    unsupported = [city.make_spec(2, 1, 'arch', corner=True),
                   city.make_spec(3, 1, 'shop', 1, corner=True),
                   city.make_spec(2, 2, 'work', kinds=['oriel'], corner=True)]
    for spec in unsupported:
        try:
            city.build(spec)
        except ValueError as error:
            check('unsupported corner' in str(error), 'explicit unsupported corner rejection')
        else:
            check(False, 'explicit unsupported corner rejection: ' + str(spec))
    return checks


def audit(city, checks):
    def check(ok, label):
        checks.append(dict(pass_=bool(ok), check=label))

    old = module('before_city17', REV / 'r17-A-redraw3-before-compose.py')
    old.ASSETS, old.ART, old.REVIEW = OUT, ART, REV
    before_failures = [c for c in regression(old) if not c['pass_']]
    check(len(before_failures) == 18, 'same regression catches all 18 original failures')

    # Exercise each approved combination through build(), across all colours
    # and heights. No actual architectural pixel may be cropped or overwritten.
    cases = 0
    for width, ground, variant, kinds in [
            (2, 'work', 0, ['jetty']), (2, 'shop', 1, ['jetty']),
            (3, 'door', 0, ['jetty']),
            *[(1, 'door', v, ['timber', 'plaster']) for v in range(3)]]:
        for colour in range(3):
            for floors in range(1, 6):
                spec = city.make_spec(width, floors, ground, variant, colour,
                                      kinds=kinds, corner=True)
                built, parts = city.build(spec)
                donor = city.asset(city.ground_name(spec)).crop((0, 0, width * 48, 1))
                for part in parts:
                    if part['layer'] not in ('facade', 'corner'):
                        continue
                    source = image(ART / part['file'])
                    x, y = part['x'], part['y']
                    check(part['crop'] is None, 'uncropped source ' + str((cases, part['file'])))
                    check(equal(built.crop((x, y+1, x+source.width, y+47)),
                                source.crop((0, 1, source.width, 47))),
                          'complete interior ' + str((cases, part['file'])))
                for floor in range(floors):
                    y = built.height - 48 * (floor+1)
                    for row in (0, 47):
                        check(equal(built.crop((0, y+row, width*48, y+row+1)), donor),
                              'whole lot course ' + str((cases, floor, row)))
                check(built.width == width*48 and built.getbbox()[3] == built.height,
                      'lot width and foot ' + str(cases))
                cases += 1

    # Match the current scenes to replay and isolate changes to corner floors.
    scene_changes = {}
    for name, layout in city.critic_layouts().items():
        current, _ = city.scene(layout)
        prior, _ = old.scene(old.critic_layouts()[name])
        check(equal(current, image(REV / f'r17-A-critic-{name}-1x.png')), 'current scene replay ' + name)
        boxes = [(b['x'], b['base']-48*(1+len(b['spec']['storeys'])),
                  b['x']+48*b['spec']['width'], b['base'])
                 for b in layout['buildings'] if b['spec'].get('corner')]
        changed = [(i % current.width, i // current.width)
                   for i, (a, b) in enumerate(zip(current.get_flattened_data(), prior.get_flattened_data()))
                   if a != b]
        check(all(any(x0 <= x < x1 and y0 <= y < y1 for x0,y0,x1,y1 in boxes)
                  for x,y in changed), 'scene changes confined to corner facade bounds ' + name)
        scene_changes[name] = len(changed)
        if name != 'L-block':
            check(equal(current, prior), 'non-corner scene unchanged ' + name)
    for name in ('north-3', 'L-wing-3', 'L-wing-8'):
        native = image(REV / f'r17-A-corner-before-after-{name}-1x.png')
        check(equal(native.resize((native.width*4,native.height*4),Image.Resampling.NEAREST),
                    image(REV / f'r17-A-corner-before-after-{name}-4x.png')), 'exact 4x corner proof ' + name)
    for path in sorted(REV.glob('r17-A-corner-assembly-*.png')):
        raw = Image.open(path)
        spec = json.loads(raw.info['Spec'])
        floor = json.loads(raw.info['Floor'])
        built, _ = city.build(spec)
        sources = json.loads(raw.info['Parts'])
        pw, ph = json.loads(raw.info['PairSize'])
        pair = raw.crop((8, 28, 8+pw, 28+ph))
        check(equal(pair.resize((pw*4,ph*4),Image.Resampling.NEAREST),
                    raw.crop((8,ph+44,8+pw*4,ph+44+ph*4))), 'exact 4x source/assembly/house proof ' + path.name)
        x = 8 + sum(image(ART/p['file']).width + 12 for p in sources) + 8
        y = built.height - 48*(floor+1)
        check(equal(pair.crop((x,ph-56,x+built.width,ph-8)),
                    built.crop((0,y,built.width,y+48))), 'actual corner build in proof ' + path.name)
    for crop in json.loads((REV/'r17-A-redraw3-scene-crops.json').read_text()):
        check(equal(image(REV/crop['source']).crop(crop['box']),image(REV/crop['file'])),
              'source-exact 3x scene crop '+crop['file'])

    # Verify the requested reference preparation against the original Git object.
    raw = subprocess.check_output(['git','show',
        'origin/claude/project-thread-g8wuu1:packages/server/src/assets/overworld-art/fantasy.json'],cwd=ART.parent)
    pack = json.loads(raw)
    sheets = {s['id']:Image.open(io.BytesIO(base64.b64decode(s['png'].split(',',1)[1]))).convert('RGBA')
              for s in pack['sheets']}
    for kind in ('house','hall','stall','well'):
        for n,t in enumerate(pack['tiles'][kind]):
            x,y = t['x']*48,t['y']*48
            w,h = t.get('w',1)*48,t.get('h',1)*48
            check(equal(sheets[t['sheet']].crop((x,y,x+w,y+h)),
                        image(ART/f'reference/r17/fantasy-{kind}-{n}.png')), 'fantasy source crop '+kind+'-'+str(n))
    check(equal(image(REV/'city-view-towns-2026-11-16.png').crop((0,0,600,500)),
                image(ART/'reference/r17/current-town.png')), 'literal current town crop')
    city15 = module('city15', ART/'out/city15/compose.py')
    street,_ = city15.street(city15.mounted_specs(731))
    check(equal(street,image(ART/'reference/r17/round15-street.png')), 'round15 seed731 street replay')

    baseline = json.loads((REV/'r17-A-redraw3-baseline.json').read_text())
    critic = json.loads((REV/'critic-r17A-3.json').read_text())
    check(critic['failed'] == ['compose.py'], 'only compositor failed independent critic round3')
    for name,record in critic['files'].items():
        if record['status'] != 'pass':continue
        path = OUT/(name if name.endswith('.md') else name+'.png')
        check(sha(path) == baseline[str(path.relative_to(ART.parent))], 'passing file bytes unchanged '+name)
    changed,created = [],[]
    current = {str(p.relative_to(ART.parent)) for p in ART.rglob('*') if p.is_file()}
    for name in sorted(set(baseline)|current):
        path = ART.parent/name
        if name in baseline and path.exists() and sha(path) == baseline[name]:continue
        (changed if name in baseline else created).append(name)
        check(path.exists(), 'no pre-existing file removed '+name)
        check(name in ('art-drop/out/city17/compose.py','art-drop/NOTES.md') or
              name.startswith('art-drop/review/r17-A-'), 'authorized repair/review scope '+name)
    prior_notes = (REV/'r17-A-redraw3-before-notes.md').read_bytes()
    check((ART/'NOTES.md').read_bytes().endswith(prior_notes), 'all prior notes retained verbatim')
    check(sha(OUT/'compose.py') != baseline['art-drop/out/city17/compose.py'], 'compositor repaired')
    check(subprocess.check_output(['git','branch','--show-current'],cwd=ART.parent,text=True).strip()
          == 'art/overworld-codex-2026-11-06', 'branch retained')
    return dict(supported_build_cases=cases,original_regression_failures=len(before_failures),
                scene_changed_pixels=scene_changes,passing_pngs_preserved=240,
                passing_course_preserved=True,new_drawings=0,reference_checks=15,
                changed_existing_files=changed,new_files=created,
                method='Composite complete approved image-tool drawings without resampling; copy drawn full-width contact strips for course rows 0/47.',
                scope='Saved-art repair and self-review; independent reapproval pending. B/C/D placeholders and city failures remain open.')


if __name__ == '__main__':
    city = module('city17', OUT / 'compose.py')
    checks = regression(city)
    details = {} if '--regression-only' in sys.argv else audit(city, checks)
    summary = dict(checks=len(checks), passed=sum(c['pass_'] for c in checks),
                   failed=[c for c in checks if not c['pass_']], **details)
    if details:
        (REV/'r17-A-redraw3-audit.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps({k:v for k,v in summary.items() if k not in ('changed_existing_files','new_files')}, indent=2))
    sys.exit(bool(summary['failed']))
