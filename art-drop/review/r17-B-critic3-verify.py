"""Saved-art and compositor regression checks for the critic-round-3 repair."""
from collections import Counter
import hashlib
import importlib.util
import json
from pathlib import Path
from PIL import Image

R = Path(__file__).resolve().parent
A, O = R.parent, R.parent / 'out/city17'
NN = Image.Resampling.NEAREST


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


c = module('city', O / 'compose.py')
old = module('before', R / 'r17-B-critic3-before-compose.py')
old.ASSETS, old.ART, old.REVIEW = O, A, R
p = module('paint', R / 'r17-B-process.py')
checks = []


def check(ok, label):
    checks.append(dict(check=label, passed=bool(ok)))


def image(path):
    return Image.open(path).convert('RGBA')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def mean(im, box):
    a = im.crop(box).convert('L')
    return sum(a.get_flattened_data()) / (a.width * a.height)


protected = json.loads((R / 'r17-B-critic3-protected.json').read_text())
changed = [name for name, digest in protected.items()
           if not Path(name).exists() or sha(Path(name)) != digest]
check(not changed, 'every protected file is byte-identical')
index = json.loads((R / 'r17-B-files.json').read_text())
check(len(index) == 137, 'all 137 passing Part B exports retained')
allowed = set(p.PAL + sum(p.RAMPS, []) + [(30,30,30), (27,32,39), (38,31,23)])
for name, info in index.items():
    a = image(O / name)
    px = list(a.get_flattened_data())
    check(sha(O / name) == protected['art-drop/out/city17/' + name], name + ' unchanged bytes')
    check(a.size == tuple(info['size']), name + ' native dimensions')
    check(all(v[3] in ((0,112) if name.startswith('shadow-') else (0,255)) for v in px), name + ' alpha')
    check(all(v[3] or v[:3] == (0,0,0) for v in px), name + ' zero hidden RGB')
    check(all(v[:3] in allowed for v in px if v[3]), name + ' palette')
    check(hashlib.sha256(a.tobytes()).hexdigest() == info['pixels_sha256'], name + ' reviewed pixels')
    proof = Image.open(R / info['proof'])
    w,h = json.loads(proof.info['PairSize'])
    q1,q4 = json.loads(proof.info['PairOrigins'])
    check(proof.crop((*q1,q1[0]+w,q1[1]+h)).resize((w*4,h*4),NN).tobytes() ==
          proof.crop((*q4,q4[0]+w*4,q4[1]+h*4)).tobytes(), name + ' exact 1x/4x reference proof')
    stem = Path(name).stem
    seam = image(R / f'r17-B-seam-{stem}-1x.png')
    check(seam.resize((seam.width*4,seam.height*4),NN).tobytes() ==
          image(R / f'r17-B-seam-{stem}-4x.png').tobytes(), name + ' exact seam enlargement')

# Independently replay every registered 8x8 vote, including clear courtyard.
blocks = 0
for rec in json.loads((R / 'r17-B-critic3-processing.json').read_text()):
    reg = image(R / f"r17-B-registered-{rec['id']}.png")
    w,h = rec['size']
    data = list(reg.get_flattened_data())
    votes = []
    for y in range(h):
        for x in range(w):
            count = Counter(v for dy in range(8) for v in
                            data[(y*8+dy)*reg.width+x*8:(y*8+dy)*reg.width+x*8+8])
            votes.append(min(count, key=lambda v: (-count[v],v)))
    check(votes == list(image(R / f"r17-B-mode-{rec['id']}.png").get_flattened_data()), rec['id'] + ' exact mode')
    for x,y,before,after in rec['cleanup']:
        check(votes[y*w+x] == tuple(before), rec['id'] + f' cleanup source {x},{y}')
        votes[y*w+x] = tuple(after)
    check(votes == list(image(R / f"r17-B-clean-{rec['id']}.png").get_flattened_data()), rec['id'] + ' cleanup replay')
    blocks += w*h

join_metrics = []
for colour in range(3):
    roof = c.joined_l_roof(colour)
    check(roof.size == (336,240), f'L c{colour} native dimensions')
    check(roof.getchannel('A').tobytes() == old.joined_l_roof(colour).getchannel('A').tobytes(), f'L c{colour} same exact L footprint; no ground holes')
    check(roof.tobytes() == p.colour(image(R / 'r17-B-clean-critic3-L-a.png'),colour).tobytes(), f'L c{colour} selected drawing remap')
    check(all(v[3] in (0,255) and (v[3] or v[:3] == (0,0,0)) for v in roof.get_flattened_data()), f'L c{colour} hard alpha and zero hidden RGB')
    contour = []
    for y in range(roof.height):
        for x in range(roof.width):
            if not roof.getpixel((x,y))[3]:
                continue
            near = [(xx,yy) for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1))
                    if 0 <= xx < roof.width and 0 <= yy < roof.height]
            if len(near)<4 or any(not roof.getpixel(q)[3] for q in near):
                contour.append(roof.getpixel((x,y)))
    check(all(v == p.DARK for v in contour), f'L c{colour} one-pixel exposed contour')
    check(all(roof.getpixel((x,y)) != p.DARK for x in range(1,335) for y in (236,237,238)), f'L c{colour} eave has no internal verge cuts')
    check(all(roof.getpixel((x,y)) == p.DARK for x in (0,335) for y in range(236,240)), f'L c{colour} both end verges survive')
    check(mean(roof,(4,4,43,140))-mean(roof,(52,4,91,140)) > 10, f'L c{colour} west lit / east shaded')
    check(mean(roof,(100,198,280,232))-mean(roof,(100,148,280,186)) > 6, f'L c{colour} south lit / north shaded')
    for x in (96,288):
        for y0,y1 in ((160,184),(208,232)):
            delta = abs(mean(roof,(x-8,y0,x,y1))-mean(roof,(x,y0,x+8,y1)))
            join_metrics.append(dict(colour=colour,x=x,y=[y0,y1],luma_delta=delta))
            check(delta < 8, f'L c{colour} no rectangular value jump x{x} y{y0}')
    for width in (1,2,3):
        for depth in (3,4,5):
            spec = c.make_spec(width,1,'door',0,0,'ridge')
            spec.update(roof_depth=depth,roof_colour=colour)
            a,parts = c.build(spec)
            check(a.tobytes() == old.build(spec)[0].tobytes(), f'deep roof w{width} c{colour} d{depth} unchanged')

for name,layout in c.critic_layouts().items():
    scene,records = c.scene(layout)
    check(scene.tobytes() == image(R / f'r17-B-critic-{name}-1x.png').tobytes(), name + ' native scene replay')
    check(scene.resize((scene.width*3,scene.height*3),NN).tobytes() == image(R / f'r17-B-critic-{name}-3x.png').tobytes(), name + ' exact 3x')
    check(scene.convert('L').convert('RGBA').tobytes() == image(R / f'r17-B-critic-{name}-squint-1x.png').tobytes(), name + ' greyscale replay')
    before = old.scene(layout)[0]
    if name != 'L-block':
        check(scene.tobytes() == before.tobytes(), name + ' preserved assembly and shadows')
    else:
        # Every changed scene pixel belongs to the explicitly repaired roof.
        bad = [(i%scene.width,i//scene.width) for i,(a,b) in enumerate(zip(scene.get_flattened_data(),before.get_flattened_data()))
               if a != b and not (0 <= i%scene.width < 336 and 240 <= i//scene.width < 480)]
        check(not bad, 'L-block changes stay within the repaired roof')
        for ident in ('L-south-1-dormer-1','L-south-2-chimney-2'):
            rec = next(r for r in records if r.get('id') == ident)
            a = c.asset(rec['file'])
            check(all(scene.getpixel((rec['x']+x,rec['y']+y)) == a.getpixel((x,y))
                      for y in range(a.height) for x in range(a.width) if a.getpixel((x,y))[3] == 255), ident + ' survives opaque joins')
    for z in (1,3):
        comp = Image.open(R / f'r17-B-critic-{name}-comparison-{z}x.png')
        check(json.loads(comp.info['SceneScale']) == z and json.loads(comp.info['ReferenceScale']) == 1, name + f' comparison scales {z}x/1x')

for name,layout in json.loads((R / 'r17-B-critic2-narrow-layouts.json').read_text()).items():
    check(c.scene(layout)[0].tobytes() == old.scene(layout)[0].tobytes(), name + ' narrow tall/low regression')
check((A / 'NOTES.md').read_bytes().endswith((R / 'r17-B-critic3-notes-before.txt').read_bytes()), 'earlier NOTES preserved verbatim')
failures = [r['check'] for r in checks if not r['passed']]
report = dict(total=len(checks), passed=len(checks)-len(failures), failures=failures,
              repaired_files=['out/city17/compose.py'], passing_pngs_unchanged=137,
              protected_files=len(protected), changed_protected_files=changed,
              mode_blocks=blocks, mode_samples=blocks*64, join_metrics=join_metrics,
              checks=checks)
for name in ('r17-B-critic3-validation.json','r17-B-validation.json'):
    (R / name).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('checks','join_metrics')},indent=2))
raise SystemExit(bool(failures))
