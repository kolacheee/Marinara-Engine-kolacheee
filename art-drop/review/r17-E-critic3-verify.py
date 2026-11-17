"""Focused regression for the gate's local paving and threshold registration.

Run with python -B. Only the Part E review report is written; drawings are read.
The expected pixels come directly from the retained Part D crops.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import types

from PIL import Image, ImageChops

R = Path(__file__).resolve().parent
A = R.parent
O = A / 'out/city17'
B = R / 'r17-E-critic3-before'
checks = []


def check(name, ok, detail=None):
    checks.append(dict(check=name, passed=bool(ok), detail=detail))


def rgba(path):
    return Image.open(path).convert('RGBA')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def same(a, b):
    return a.size == b.size and a.tobytes() == b.tobytes()


def tiled_source(source, width, height):
    # Independent, destination-local assembly: no world-coordinate offset.
    out = Image.new('RGBA', (width, height))
    for y in range(0, height, source.height):
        for x in range(0, width, source.width):
            out.paste(source, (x, y))
    return out


spec = importlib.util.spec_from_file_location('compose', O / 'compose.py')
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)
old = types.ModuleType('before_compose')
old.__file__ = str(O / 'compose.py')
exec(compile((B / 'compose.py').read_text(), old.__file__, 'exec'), old.__dict__)
layouts = c.e_layouts()
market = layouts['market']
gate = next(r for r in market['roads'] if r['file'] == 'gate-approach')
threshold = next(r for r in market['roads'] if r['file'] == 'gate-threshold')
source = rgba(A / gate['path'])
step = rgba(A / threshold['path'])
x, y, w, h = gate['rect']
tx, ty, tw, th = threshold['rect']
expected = tiled_source(source, w, h)
expected.alpha_composite(step, (tx - x, ty - y))
box = (x, y, x + w, y + h)

# Both the small regression fixture and the actual market drive e_ground().
fixture = dict(size=market['size'], roads=[gate, threshold])
check('destination-local gate and one-off threshold',
      same(c.e_ground(fixture).crop(box), expected))
check('test detects original world-phase regression',
      not same(old.e_ground(fixture).crop(box), expected))
ground = c.e_ground(market)
check('market threshold keeps all original pixels and its vertical position',
      same(ground.crop((tx, ty, tx + tw, ty + th)), step))

# The entire open approach, including the old interior stripe and lower join.
for label, left, right in [('left outer kerb', 984, 988),
                           ('right outer kerb', 1076, 1080),
                           ('open paving', 988, 1076),
                           ('former eight-column interior stripe', 1052, 1060)]:
    target = (left, 432, right, 576)
    wanted = expected.crop((left - x, 432 - y, right - x, 576 - y))
    check(label + ' exact source pixels on every row 432–575',
          same(ground.crop(target), wanted), dict(scene_box=list(target)))
for row in (432, 480, 500, 528, 550, 575):
    check(f'full 96px approach row {row} keeps local vertical phase',
          same(ground.crop((984, row, 1080, row + 1)),
               expected.crop((0, row - y, 96, row - y + 1))))

# No paving outside the two registered crops may change.
before = old.e_ground(market)
outside = ground.copy()
outside.paste(before.crop(box), box[:2])
check('all market ground outside gate crops unchanged', same(outside, before))
for name, layout in {**layouts, **{'district-' + k: c.e_district_layout(k)
                                  for k in c.E_DISTRICTS}}.items():
    if name != 'market':
        check(name + ' ground unchanged', same(c.e_ground(layout), old.e_ground(layout)))

# The scene must retain the registered drawing under the existing cast shade.
scene, _ = c.c_render(market)
shade, _ = c.c_shadow_layer(market)
approach_box = (984, 432, 1080, 576)
shaded = expected.crop((0, 432 - y, 96, 576 - y))
shaded.alpha_composite(shade.crop(approach_box))
check('final scene approach equals local drawing plus retained cast shade',
      same(scene.crop(approach_box), shaded))
check('portal and approach stay within clear 96px route',
      [984, 432, 96, 1536] in market['clear_routes'])

protected = json.loads((B / 'hashes.json').read_text())
changed = [p for p, digest in protected.items()
           if not (A.parent / p).exists() or sha(A.parent / p) != digest]
check('all other production files and both Part D gate crops byte-identical',
      not changed, dict(count=len(protected), changed=changed))
files = json.loads((R / 'r17-E-files.json').read_text())
check('all 78 passing Part E PNGs byte-identical', len(files) == 78 and all(
    sha(O / (name + '.png')) == rec['sha256'] for name, rec in files.items()))

report = dict(checks=len(checks), passed=sum(c['passed'] for c in checks),
              failures=[c for c in checks if not c['passed']],
              protected_files=len(protected), passing_E_PNGs=len(files),
              results=checks)
(R / 'r17-E-critic3-verification.json').write_text(json.dumps(report, indent=2))
print(json.dumps({k: v for k, v in report.items() if k != 'results'}, indent=2))
raise SystemExit(bool(report['failures']))
