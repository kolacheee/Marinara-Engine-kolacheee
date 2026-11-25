# Wren and Hadrik — native pixel-art study

## Method and tools

All character pixels originate in the original text grids in `../source/draw.py`.
Python 3 and Pillow 12.3 assemble those grids at **48 × 64**, with no antialiasing.
No image-generation tool, downloaded art, game asset, earlier-round art, or other
lane was used. The only image inputs are the two supplied `world/` backgrounds.

The build has five inspectable stages: silhouette, material flats, coloured dark
outline, shading clusters, and facial/costume details. `../scratch/` contains each
stage as individual native PNGs and 4×/8× inspection boards. Those boards use
nearest-neighbour enlargement and a #7a7a7a background. The final boards reflect
the revisions made during inspection.

Each material has a five-colour, hue-shifted ramp. The brightest accents face the
upper left. Hadrik's hair uses near-black charcoal with a restrained cool sheen;
his skin uses deep reddish-brown shadows and warm, limited facial highlights.
Wren has auburn locks, a tied tail, a lowered hood, green cloak, jerkin, bracers,
back-mounted bow, and quiver. Hadrik has rolled sleeves, a full beard, an apron
with a pocket and crossed rear straps, and a belt hammer.

Contact and passing poses were inspected first (`key-poses-*`), then all six
poses (`walk-poses-*`). Animation uses discrete pixel offsets, leg bends, foot
lifts, body bob, opposing arm movement, and delayed cloth/tail positions. These
are assembled native-pixel poses; there is no rotation filtering or optical-flow
interpolation. The idle raises the upper body one pixel and shifts cloth a beat
later. The short black hair stays close to Hadrik's head.

## Files and conventions

- `sheet-wren.png`, `sheet-hadrik.png`: 288 × 256 RGBA; six columns, rows down,
  left, right, up. Down and left contain six distinct walking poses. Right and up
  contain six copies of a standing pose, as permitted by the specification.
- **Right is mirrored from left.** Wren's quiver, bow and tail and Hadrik's hammer
  switch sides. This is a deliberate viewing convention, not fixed equipment
  handedness. Up uses separately drawn rear artwork.
- `idle-wren.png`, `idle-hadrik.png`: 192 × 64; four distinct down-facing poses.
- `lineup.png`: down/left standing views at actual 1× and 4×, on #7a7a7a.
- `walk.gif`: both characters, six down frames followed by six left frames,
  110 ms each, looping. `idle.gif`: four frames at 240 ms each. Both previews are
  4×, with a shared, non-dithered palette.
- `in-world.png`, `in-world-close.png`: the original 1280 × 760 backgrounds with
  nearest-neighbour sprites at nominal 2.3× and 3.8×. Integer raster dimensions
  are rounded to 110 × 147 and 182 × 243 respectively. Both figures stand on
  unobstructed flagstones. Only the separate contact-shadow layer is blurred;
  the character pixels remain crisp.

Standing height is 56 pixels, with walking poses reaching 58 pixels. At least
one foot meets row 63 in every frame. Transparent pixels have alpha zero;
visible pixels have alpha 255. No pure-black visible pixels are used.

## Review and remaining limitations

The close-world composite was inspected at its full 1280 × 760 size, in addition
to the enlarged construction boards. Revisions included a wider blacksmith
torso, darker hair, clearer hood folds, a visible ponytail, softened facial
highlights, stronger side strides, apron follow-through, and neck continuity.
The figures remain readable on the warm flagstones and their pixel edges remain
distinct from the scene's soft lighting.

The remaining gap toward the named reference is artistic, not a file-format
issue:

- The cloak and apron use relatively broad, restrained folds; they have less
  intricate tailoring and accessory detail than the richest commercial HD-2D
  hero sprites.
- The six-frame walk has body weight and secondary movement, but its head and
  chest retain more of the standing drawing than a fully redrawn performance
  with pronounced torso rotation. The profile poses are especially restrained.
- The tiny faces communicate direction and seriousness more strongly than
  precise age. Hadrik's beard and Wren's cheek planes are necessarily simplified.
- Right/up walking animation, fixed-side equipment across directions, and
  scene-driven bloom/lighting are outside this delivered style study. The
  screenshots demonstrate scale and contact, not an integrated scene renderer.

These are original interpretations of the requested sprite language; matching
the commercial reference's artistic finish remains a visual judgement rather
than something the technical checks establish.

## Rebuild and validation

From the lane directory:

```sh
python source/draw.py --stage silhouette
python source/draw.py --stage flats
python source/draw.py --stage outline
python source/draw.py --stage shading
python source/draw.py --stage details
python source/draw.py --stage keys
python source/draw.py --stage animation
python source/draw.py --stage deliver
python source/verify.py
```

`../scratch/validation.json` records the passing checks: sheet dimensions, RGBA
mode, binary alpha, frame uniqueness, permitted repeated rows, height limits,
foot alignment, connected silhouettes, absence of pure-black visible pixels,
GIF frame counts and timing, and full-size world composites.
