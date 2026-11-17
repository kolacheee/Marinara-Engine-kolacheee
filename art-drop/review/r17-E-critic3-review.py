"""Native/nearest-neighbour gate proofs from saved renders; no asset drawing."""
from pathlib import Path
import json

from PIL import Image, ImageDraw

R = Path(__file__).resolve().parent
B = R / 'r17-E-critic3-before'
NN = Image.Resampling.NEAREST
box = (960, 384, 1128, 624)
fixed = Image.open(R / 'r17-E-critic-market-1x.png').convert('RGBA').crop(box)
before = Image.open(B / 'gate-scene.png').convert('RGBA')
part_d = Image.open(R / 'r17-D-critic-market-1x.png').convert('RGBA').crop(box)
links = []
for scale in (1, 4):
    width, height = fixed.width * scale, fixed.height * scale
    sheet = Image.new('RGBA', (3 * width + 48, height + 56), (35, 39, 34, 255))
    labels = ImageDraw.Draw(sheet)
    for i, (title, image) in enumerate((('Part D / local kerbs', part_d),
                                       ('Part E / before', before),
                                       ('Part E / repaired', fixed))):
        x = 12 + i * (width + 12)
        labels.text((x, 10), title, fill='white')
        sheet.alpha_composite(image.resize((width, height), NN), (x, 32))
    path = f'r17-E-critic3-gate-comparison-{scale}x.png'
    sheet.save(R / path)
    links.append(path)
    path = f'r17-E-critic3-gate-context-{scale}x.png'
    fixed.resize((width, height), NN).save(R / path)
    links.append(path)

(R / 'r17-E-critic3-focus.json').write_text(json.dumps(dict(
    scene='market', crop=list(box), links=links,
    registration='96x144 interior repeats from (984,192); threshold once at (984,423).',
    kerbs=[[984, 987], [1076, 1079]], former_stripe=[1052, 1059]), indent=2))

# Keep this replay separate from the historical review generators. Running
# it after compose.py adds the current focused evidence to the review index.
index = R / 'r17-E-review.html'
html = index.read_text()
start = '<!-- critic-r17E-3-start -->'
end = '<!-- critic-r17E-3-end -->'
if start in html:
    a = html.index(start)
    b = html.index(end, a) + len(end)
    html = html[:a] + html[b:]
section = start + '<h2>critic-r17E-3 composer repair</h2>'
section += ('<p>Gate approach and threshold use their own destination origins; '
            'the drawn kerbs stay on the route edges. All 78 approved Part E '
            'PNGs and both Part D gate crops are unchanged. No new drawings. '
            'Saved-art self-review; independent acceptance pending.</p>')
section += ''.join(f'<p><a href="{f}">{f}</a></p>' for f in links + [
    'r17-E-critic3-verification.json', 'r17-E-critic3-verify.py',
    'r17-E-critic3-response.json']) + end
position = html.index('<h2>')
index.write_text(html[:position] + section + html[position:])
print('Saved gate comparison and context at literal 1x / nearest-neighbour 4x.')
