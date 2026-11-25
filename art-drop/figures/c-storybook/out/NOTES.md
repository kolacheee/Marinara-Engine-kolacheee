# Book of Hours figures

The direction is a town population drawn like figures in a manuscript margin: narrow upright bodies, long hems, pointed shoes, mineral-colour garments, and small precious accents. Each material has its own coloured ink. The flat lapis, vermilion, verdigris and murrey areas carry restrained vertical folds, patterned borders and, on the mage, a dotted semé. The figures were drawn at their final 32 × 48 pixel size with Python/Pillow; the views and modular layers share body anchors and a four-frame pose table.

## Deliverables and regeneration

There are sixteen RGBA layer sheets, each 128 × 192 pixels, with columns f0–f3 and rows down, left, right, up. All three outfits have a `@woman` cut. Right views mirror left views. Only down has a walk; the other directions repeat their standing cells. The unused back-view beard cells are transparent.

The five presentation images are `lineup.png`, `turn.png`, `walk.png`, `walk.gif`, and `swatch.png`. The lineup has the requested grey and stone strips at 1× and 4×, with an eight-native-pixel gap between characters. The GIF has four frames at 160 ms each and loops indefinitely. Its decoded pixels are checked against the corresponding composed frames. The swatch's upper row follows the six skin ramps in their specified order; the lower row follows black, brown, chestnut, blond, red, grey, white, lapis.

Run from this folder, in this order:

```sh
python3 out/src/template.py
python3 out/src/compose.py
python3 out/src/check.py
```

`template.py` draws the layers and writes the palette definition. `compose.py` reads the saved PNGs, performs exact RGBA swaps and stacks body, feature, outfit, beard, hair, hood, staff. `check.py` reads the saved results and exits nonzero on a failed assertion. Python 3 and Pillow are required. There are no network or reference-art dependencies. Regeneration writes only inside this folder. Diagnostic images and the check log go in `scratch/`; there are no diagnostics mixed into the delivered image folders.

## Ramps

The complete source, fixed and target ramps are in [ramps.json](ramps.json). All supplied hex values are retained unchanged. There are 41 distinct source/fixed colours. Every ink meets the luminance and chroma limits; the highest measured ink luminance is 0.05460. Reserved eye light E2 is unused. Gold, garnet, leather, linen, wood and horn remain fixed during recolouring.

The six lineup colourways and skin tones follow the brief. Character 2 uses grey eyes, which were unspecified for that character; this makes the two iris pixels more visible against the very dark skin and black beard. Characters 2 and 5 recolour their beard with their hair.

## Revision and visual review

The first lineup was revised in full before delivery. Revisions moved the staff crook away from the elf's face, exposed the actual mitten at the staff grip, extended the labourer's tunic over the linen shift, extended the ranger's boots over the side-view calves, made the hose follow the feet-together frame, shortened profile shoe tips, covered the side-view fringe with the hood, and added a restrained short-hair crown highlight. Contours were also repaired where separately valid hood, beard, hair and garment layers formed solid ink squares when stacked.

Every layer sheet was opened at 4×. The fit matrix was opened at 4× and also reviewed in fifteen smaller pages, each retaining 4× sprite pixels. The final presentation images and all four decoded GIF frames were opened enlarged. The lineup was inspected on grey, dark stone, and the procedural brown cobbles, including the cobbles at 1× and 3×. A single-colour silhouette comparison was inspected as well. The saved review images are in `scratch/review/`; `scratch/fit-matrix.png` and `scratch/busy.png` are reproducible from the compose script.

## Honest weaknesses and layer-system limits

- The tiny faces are calm but strongly schematic. The darkest skin with black hair remains the least expressive face at 1×, even after the eye-colour adjustment. The beard mouth is one ink pixel, so expression is mostly carried by the eyes and head shape.
- The short hair and horn ridges are the coarsest details. At 1× the horns read principally as curved silhouettes, while their small ridges are much clearer enlarged. The long hair's narrow profile compresses the individual locks into a single flowing sweep.
- Some decorative dots become short bars at this resolution. Pattern interiors are two rows high; their ink borders can make the total band four rows high. This gives strong borders but less delicate ornament than a manuscript painting. Per-surface shade percentages are an artistic target here, not a measured guarantee from the validator.
- The walk is restrained and visibly four-frame. It establishes alignment, alternating feet and one-pixel head motion, but has no secondary hair lag or independent cloth simulation. The side and rear rows are standing repeats as permitted for this sample.
- The ranger's exposed leather and the pointed shoes lose some separation from the brown cobbles at 1×; the face, hair and coloured cloak still hold the overall figure. No lighting, bloom or tilt-shift test inside the actual 3D engine was performed.

Keeping the same head anchor for both bodies worked well. Overlap was harder: the hood's cape can meet the ranger's lowered hood in the same ink, and a beard can meet a sideburn in the same hair ink. Those intersections needed explicit pixel corrections in the source, beyond drawing each layer separately. Long hair necessarily hides the roots of the elf ears; the outward tips remain visible. Hair ends and the braid can extend below the hood cape. The staff is broken at the shared hand coordinates so the body provides the grip without adding skin colours to the held-item layer.

The validator proves the listed pixel, palette, fit and frame properties. It does not claim to automate judgments about courtliness, the beauty of a fold, every internal decorative boundary, or suitability under an untested engine's lighting.

## Final check output

```text
RAMPS: 41 unique source/fixed colours; 39 ramps; max ink luminance 0.05460; coloured inks PASS.
LAYER body/man: PASS; 128x192; off=0; semi=0; lone=0.27% (17/6236, exempt=36); ink2x2=0; overlay-edge nonink=0.
LAYER body/woman: PASS; 128x192; off=0; semi=0; lone=0.41% (25/6098, exempt=36); ink2x2=0; overlay-edge nonink=0.
LAYER feature/elf-ears: PASS; 128x192; off=0; semi=0; lone=0.68% (6/888, exempt=0); ink2x2=0; overlay-edge nonink=0.
LAYER feature/horns: PASS; 128x192; off=0; semi=0; lone=0.00% (0/984, exempt=0); ink2x2=0; overlay-edge nonink=0.
LAYER outfit/labourer: PASS; 128x192; off=0; semi=0; lone=0.20% (9/4505, exempt=16); ink2x2=0; overlay-edge nonink=0.
LAYER outfit/labourer@woman: PASS; 128x192; off=0; semi=0; lone=1.09% (49/4508, exempt=16); ink2x2=0; overlay-edge nonink=0.
LAYER outfit/ranger: PASS; 128x192; off=0; semi=0; lone=0.98% (64/6556, exempt=76); ink2x2=0; overlay-edge nonink=0.
LAYER outfit/ranger@woman: PASS; 128x192; off=0; semi=0; lone=0.80% (50/6278, exempt=76); ink2x2=0; overlay-edge nonink=0.
LAYER outfit/mage: PASS; 128x192; off=0; semi=0; lone=1.14% (74/6506, exempt=249); ink2x2=0; overlay-edge nonink=0.
LAYER outfit/mage@woman: PASS; 128x192; off=0; semi=0; lone=1.22% (77/6320, exempt=236); ink2x2=0; overlay-edge nonink=0.
LAYER hair/short: PASS; 128x192; off=0; semi=0; lone=2.72% (42/1544, exempt=0); ink2x2=0; overlay-edge nonink=0.
LAYER hair/long: PASS; 128x192; off=0; semi=0; lone=0.11% (4/3520, exempt=0); ink2x2=0; overlay-edge nonink=0.
LAYER hair/braid: PASS; 128x192; off=0; semi=0; lone=0.64% (16/2508, exempt=32); ink2x2=0; overlay-edge nonink=0.
LAYER beard/full: PASS; 128x192; off=0; semi=0; lone=0.00% (0/536, exempt=0); ink2x2=0; overlay-edge nonink=0.
LAYER head/hood: PASS; 128x192; off=0; semi=0; lone=1.99% (96/4828, exempt=0); ink2x2=0; overlay-edge nonink=0.
LAYER held/staff: PASS; 128x192; off=0; semi=0; lone=0.00% (0/2320, exempt=80); ink2x2=0; overlay-edge nonink=0.
CHARACTER 1: PASS; 16 cells; ink rim=1834/1834; ink2x2=0; lone=0.78%; exact target palettes.
CHARACTER 2: PASS; 16 cells; ink rim=1926/1926; ink2x2=0; lone=1.21%; exact target palettes.
CHARACTER 3: PASS; 16 cells; ink rim=2080/2080; ink2x2=0; lone=1.54%; exact target palettes.
CHARACTER 4: PASS; 16 cells; ink rim=2422/2422; ink2x2=0; lone=1.59%; exact target palettes.
CHARACTER 5: PASS; 16 cells; ink rim=1772/1772; ink2x2=0; lone=2.14%; exact target palettes.
CHARACTER 6: PASS; 16 cells; ink rim=2069/2069; ink2x2=0; lone=1.94%; exact target palettes.
FIT: 384 combinations; 96 outfit coverage tests; 72 two-eye tests; 192 feature visibility tests; crown overlaps and right mirrors checked.
COMPOSITE lineup.png: PASS; 928x504; off=0; opaque backgrounds; source cells validated above.
COMPOSITE turn.png: PASS; 608x192; off=0; opaque backgrounds; source cells validated above.
COMPOSITE walk.png: PASS; 608x384; off=0; opaque backgrounds; source cells validated above.
COMPOSITE swatch.png: PASS; 624x200; off=0; opaque backgrounds; source cells validated above.
COMPOSITE walk.gif: 4 frames; 288x192; [160, 160, 160, 160] ms; loop=0; fixed exact palette.
Unused cells: only beard up row; transparent. All other cells intentionally populated.
RESULT: PASS (0 failures)
```
