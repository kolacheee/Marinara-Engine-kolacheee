# Cleric — delivery notes

Delivered all 15 requested views, their large source crops, the four-row sheet, the front/side comparison against Wren, Hadrik and Noble, and three four-frame walk GIFs.

## Verified export properties

- Every sprite is 96 × 128 RGBA, with binary alpha and zero RGB in transparent pixels.
- Every figure occupies rows 33–124 inclusive: 92 occupied rows, with its lowest sole on row 124. Silhouettes, including equipment, are horizontally centred.
- The union across all 15 sprites contains **24 colours**, all from STYLE.md's master palette. Transparency is separate. No pure black or white was introduced.
- Sheets and GIFs use exactly 3× nearest-neighbour enlargement. The presentation background is sampled from STYLE-SHEET.png.
- Each GIF has four distinct frames, 160 ms per frame, transparent background, and an infinite loop. Every decoded GIF frame matches its enlarged source sprite exactly.
- The mace stays at the anatomical right hip: viewer-left in front, viewer-right in back, and the visible near hip in the right-facing side views.

## Drawing and review

The accepted side master is `scratch/side-v3.png`. All other views were drawn with that side master supplied as a reference. Additional references were limited to STYLE-SHEET.png and this run's own cleric drawings. The comparison uses only the supplied ref-sprites.

Every generated source was inspected. The initial overly tall side drawing, bright eye, misleading rear scalp shading and front-facing rear boots were redrawn. The side walk was redrawn to reduce its stride. The rear walk was redrawn to alternate passing feet. Front contact poses were redrawn for opposite arm/leg motion, then refined for smaller hands and quieter cloth; the front passing poses were redrawn to match them.

All final views were reviewed at 3× on the assembled sheet. The final sheet and vs-style comparison were opened at their full file dimensions. All decoded GIF frames were inspected in `scratch/gif-frame-review.png`; this was frame-by-frame visual review, not a claim of real-time playback.

## Honest weaknesses and departures from STYLE.md

- This is an approximation of style D, not an exact match. The cleric's pale tabard, cool grey sleeves and simplified planes read brighter and flatter than the reference characters' richer overlap shading.
- Proportions vary slightly by direction. The side head reads larger; the rear head is shorter without the visible beard, and the rear construction is closer to roughly 4.5–5 heads than the strict four-head target.
- Some hands remain about 6–8 pixels wide, above the requested 3–5-pixel mitten target. Boots are also fairly chunky.
- The close beard and facial features have modest contrast. A few eye/face marks occupy adjacent pixels rather than an exact single-pixel eye.
- Contours are mostly thin and coloured, but some cuff, belt and hem overlaps remain two pixels thick. Gold trim is occasionally two pixels wide. Upper-left contour lightening is not equally strong everywhere.
- Colour-only snapping makes the grey cloth planes much cleaner, but neighbouring palette families still appear in some small details. This is not a perfectly isolated four-colour ramp for every material. Warm brown skin uses the master palette's umber/leather tones; the rear scalp has less highlight modelling than the front and side.
- Small frame-to-frame changes remain in the pendant, buckle, mace, sleeve width and face. The front redraws improve consistency but do not remove all one-pixel shifts.
- The heavy robe hides most knee action. The side cycle's two passing silhouettes are similar and near/far leg identity is subtle. The walk may read somewhat stiff; the side contacts are still broader than an ideal very short town step.
- Some isolated edge and accessory pixels remain after nearest-neighbour reduction. No painted face replacements, reconstructed limbs, mirrored poses or procedural anatomy were used to conceal these limitations.

## Reproduction and records

Run from this folder:

```sh
python scratch/build.py
python scratch/assemble_sheet.py
python scratch/check.py
```

`build.py` performs magenta keying, tight cropping, one aspect-preserving nearest-neighbour reduction, colour-only source/ramp stabilization, master-palette snapping and frame placement. It does not draw anatomy or change poses. `source-overrides.json` identifies accepted redraws. `reduction-manifest.json` records source cells, crop boxes, placement and skin lightness thresholds. `check-report.json` contains the final dimensions, colours, bounds, hashes and GIF checks. Superseded sources and all processing intermediates remain in scratch/.
