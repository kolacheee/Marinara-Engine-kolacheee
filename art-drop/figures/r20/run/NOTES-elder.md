# Elder — Style D

Completed one character: elderly woman with tan lined skin, white-grey bun, linen shawl, dark moss dress, brown shoes, and a wooden walking stick in her anatomical right hand.

## Deliverables

- `big/elder-<view>.png`: 15 original-resolution figure cells on magenta. These are unretouched crops of image-tool drawings; the full source canvases and rejected attempts remain in `../scratch/`.
- `sprites/elder-<view>.png`: 15 transparent 96 × 128 sprites: front, side, back, walkside0–3, walkfront0–3, walkback0–3.
- `elder-sheet.png`: all views at exactly 3× nearest-neighbour, ordered as requested.
- `elder-vs-style.png`: elder front and side beside Wren, Hadrik, and Noble at the same 3× scale.
- `elder-walkside.gif`, `elder-walkfront.gif`, `elder-walkback.gif`: four frames each, 160 ms per frame, looping, at 3× on the style-sheet background.

## Method and verification

Read CHARACTER.md, BRIEF.md, STYLE.md, and STYLE-SHEET.png in that order. The style sheet and this run's own elder drawings were the only generation references. The supplied ref-sprites were used for the comparison. No other character artwork was consulted.

The image tool drew every figure. The right-facing side master came first, and was attached to every subsequent generation request. Its first attempt was redrawn for shorter proportions and lighter outlines. The side walk was redrawn for clearer passing poses; the back walk was redrawn to reduce its width and clarify lifted heels.

Python only keyed magenta, cropped cells, reduced once with NEAREST, snapped colours, assembled sheets/GIFs, and checked outputs. It did not paint anatomy, repair faces, synthesize limbs, mirror poses, or replace clothing shapes. Returned image data was saved directly inside scratch without opening the image service's automatic cache paths.

The elder uses the master palette's charcoal, leather, moss, fair_skin, linen, and steel ramps. A colour-only moss luminance snap prevents olive shades from falling onto tan palette entries. A garment-region colour mask snaps warm shawl colours to linen. These elder-specific rules are recorded in `../scratch/build.py`; they differ from the Wren-specific source anchors in STYLE.md. The darkest three moss roles dominate the dress; the light role is not consistently represented.

Checks passed: 15 sprites; 96 × 128 RGBA; crown row 33; lowest occupied row 124; 92 occupied rows; silhouette horizontally centred within one pixel; alpha exclusively 0/255; zero RGB under transparency; 24 colours across the entire character, all from the supplied master palette. GIF frame sizes, counts, timing, and pixel equality to the 3× sprites were checked. See `../scratch/check-results.json` and `../scratch/reduction-manifest.json`.

All generated source canvases were viewed. All delivered sprites were inspected together at 3×, and the final sheet and comparison were opened at their full saved dimensions. All twelve decoded GIF frames were inspected in `../scratch/gif-proof.png`. This was frame-by-frame visual inspection, not a timed playback review.

Rebuild from this folder with:

```sh
python scratch/build.py
python scratch/assemble_sheet.py
python scratch/check.py
```

## Honest weaknesses

- The set is close to Style D in scale, muted palette, adult proportions, and long cloth planes, but is not an exact drawing-style match. The elder's front face is softer and more simplified than the supplied characters. Some mouths exceed the requested 1–2 px mark, and the wrinkles are less explicit after reduction.
- The standing silhouettes are 36 px wide including the stick; walking silhouettes span 39–44 px. Arm swing and stride explain some of this, but the walking torso/skirt also changes shape slightly. Head, bun, shawl folds, and facial marks have small redraw variations.
- Side contact frames 0 and 2 still do not distinguish the near and far legs as clearly as intended. The passing poses are different after the redraw, but the long skirt makes the leg alternation ambiguous. Front walking is particularly restrained and can read as shuffling.
- The walking stick has small spacing, thickness, and angle changes. Its tip stays close to the ground; this is not a carefully solved weight-bearing cane gait. The side contact-0 shoe and stick nearly touch.
- Some contours remain darker or thicker than a clean one-pixel local-material outline, and a few isolated shade pixels survive nearest-neighbour sampling. The hair includes warmer ivory pixels as well as steel grey. Upper-left lighting is broadly followed, but not every contour changes tone correctly.
- Four-tone ramps are available, but not every material uses all four roles clearly in every pose. The dark dress intentionally suppresses the brightest moss tone; this sacrifices some separation between its broad folds.
- These are independently drawn four-frame cycles with minor contour shimmer, not perfectly registered production animation. The sheet and GIFs expose these remaining inconsistencies rather than concealing them with procedural repainting.
