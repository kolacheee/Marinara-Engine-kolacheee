"""Focused proofs for all three reported L-roof assembly defects."""
from pathlib import Path
import importlib.util
from PIL import Image, ImageDraw

REV = Path(__file__).resolve().parent
sp = importlib.util.spec_from_file_location('city', REV.parent / 'out/city17/compose.py')
city = importlib.util.module_from_spec(sp)
sp.loader.exec_module(city)
NN = Image.Resampling.NEAREST


def run():
    for colour in range(3):
        join = city.joined_l_roof(colour)
        city.scales(join, f'critic3-L-join-c{colour}', (1, 4))
        grey = join.convert('L').convert('RGBA')
        grey.putalpha(join.getchannel('A'))
        city.save(grey, f'critic3-L-join-c{colour}-squint-1x')
        for name, box in [('left-transition', (72, 136, 120, 240)),
                          ('hip-transition', (264, 136, 312, 240)),
                          ('west-hip', (0, 184, 112, 240)),
                          ('eave', (0, 232, 336, 240)),
                          ('east-corner', (312, 216, 336, 240))]:
            a = join.crop(box)
            city.scales(a, f'critic3-{name}-c{colour}', (1, 8), SourceBox=box)
        # Actual scene with this roof colour; facades and accents stay delivered.
        layout = city.critic_layouts()['L-block']
        layout['joined_l']['colour'] = colour
        scene, _ = city.scene(layout)
        city.scales(scene, f'critic3-L-block-c{colour}', (1, 3))
        city.save(scene.convert('L').convert('RGBA'), f'critic3-L-block-c{colour}-squint-1x')
    # Exact scale crops keep a viewer from shrinking wide comparison sheets.
    for name, boxes in {
        'L-block': [(0, 0, 384, 192), (384, 0, 768, 192),
                    (0, 240, 336, 576), (336, 240, 768, 576)],
        'market': [(0, 0, 432, 288), (432, 0, 864, 288),
                   (0, 288, 432, 576), (432, 288, 864, 576),
                   (0, 576, 432, 864), (432, 576, 864, 864)],
        'height-test': [(0, 0, 336, 480), (336, 0, 672, 480)],
    }.items():
        a = Image.open(REV / f'r17-B-critic-{name}-3x.png')
        for i, box in enumerate(boxes):
            city.save(a.crop(tuple(v * 3 for v in box)), f'critic3-section-{name}-{i + 1}-3x')
    print('Saved all-colour L roofs, squints, both transitions, correct hips and entire eave.')


if __name__ == '__main__':
    run()
