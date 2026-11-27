# Innkeeper — style D

Completed the requested single character and all 15 views: front, side, back, walkside0–3, walkfront0–3 and walkback0–3.

## Delivered files

- `big/innkeeper-<view>.png`: full-resolution, opaque-magenta source crops for the selected views, without resampling.
- `sprites/innkeeper-<view>.png`: transparent 96 × 128 production sprites.
- `innkeeper-sheet.png`: standing front/side/back, side walk, front walk, back walk, in that row order, at exact 3× nearest-neighbour enlargement.
- `innkeeper-vs-style.png`: innkeeper front and side alongside Wren, Hadrik and Noble fronts and sides, all at exact 3×.
- `innkeeper-walkside.gif`, `innkeeper-walkfront.gif`, `innkeeper-walkback.gif`: four frames each, 160 ms per frame, infinite loop, 3×, transparent background.

The sheets use the supplied style sheet's actual background colour, RGB (232, 229, 222).

## Design and process

Stout middle-aged man with a bald crown, brown moustache, warm skin, moss waistcoat, rolled cream shirt, cream waist apron, brown trousers and boots. The small steel-coloured mug remains in his anatomical right hand: viewer left from the front, viewer right from the back, near hand in the right-facing side view.

Read CHARACTER.md first, then BRIEF.md and STYLE.md, and viewed STYLE-SHEET.png. The only image references used were that sheet, its supplied ref-sprites for comparison, and this run's own innkeeper drawings. No external reference folders or repositories were consulted. Working sources, revisions, processing scripts and check records are in `scratch/`.

The image tool drew the side master first and every subsequent figure from that reference. Python only keyed magenta, cropped source cells, downscaled once with NEAREST, snapped colours, assembled sheets/GIFs and performed checks. No anatomical painting, synthesized limbs, mirrored replacement poses or pixel-brush repairs were used.

The first side-walk pair of opposite poses was too similar to the first pair. The last two side frames were redrawn; the revised passing frame then had an overly high knee, so it was redrawn again as a low passing step. Selected walkside2 comes from the left cell of `scratch/sidefix.png`; selected walkside3 comes from `scratch/passingfix.png`. Earlier attempts remain in scratch for inspection.

The palette uses seven four-tone ramps from STYLE.md: charcoal, leather, moss, fair_skin, auburn, linen and steel. The supplied Wren-specific green selector missed the warmer olive source colours and made the waistcoat brown-grey. The final colour-only selector uses G > 0.84R, G > 1.55B and R < 180, followed by the supplied four green source anchors and moss ramp. This changes colour only, never geometry or alpha. The general snap uses the specified weighted squared RGB distance, without dithering.

## Verification

`python scratch/assemble_sheet.py` rebuilds the sprites and presentation files. `python scratch/check.py` validates them and writes `scratch/check-report.json`. Exact source crops and reduction widths are in `scratch/reduction-manifest.json`.

All checks passed:

- 15 distinct RGBA sprites, each 96 × 128.
- Every silhouette starts at row 33 and ends at row 124: 92 occupied rows.
- Entire silhouette horizontally centred to within one pixel.
- Alpha is exclusively 0 or 255; fully transparent pixels have zero RGB.
- Union across all 15 views is 28 colours, all from the selected master-palette ramps; no pure black or white opaque pixels.
- Each GIF has four distinct frames at 160 ms and exactly reproduces the corresponding sprite enlarged 3×.

Every generated source was visually examined. All selected reduced views were inspected at integer magnification. The final sheet and vs-style comparison were opened at full image size. All GIF frames were decoded and inspected together in `scratch/gif-decoded-check.png`; this was a frame inspection, not a claim of real-time playback review.

## Honest weaknesses and departures

- The set fits the reference height, palette and compact adult construction, but is not a perfect stylistic match. Its apron is cleaner and broader than the reference figures' clothing, while some boot, sleeve and face clusters retain irregular single-pixel changes from source reduction.
- Four-head construction is approximate. The bald head reads smaller and less massive than Hadrik's hair-and-beard silhouette. Head, belly and apron contours vary slightly between independent drawings, particularly the final side passing frame versus the other side-walk frames.
- The side contact frames still have fairly similar outer leg silhouettes. Their overlap and shading distinguish the legs, but that alternation is less clear than in the front and back cycles.
- The front passing feet lift roughly three to four logical pixels in places, a little higher than the intended two-pixel low step. The apron also shifts by a few pixels rather than staying perfectly rigid. The result has a somewhat deliberate, stiff stroll.
- Mug and hand contours change slightly between frames. The handle is compressed at final resolution, and hand masses can exceed the ideal 3–5 pixels. The mug remains upright and in the correct hand.
- Some lower boot edges, moustache overlaps and apron corners are two pixels thick. Coloured outlines are predominant, but the ideal single-pixel outline and consistent light-edge softening are not exact everywhere.
- Upper-left light is maintained overall, but not every material shows all four roles equally clearly. The back waistcoat is mostly body and shadow. Nearest-colour reduction also lets a few cloth shadows share warm skin/leather palette entries rather than enforcing four exclusive colours per material.
- Skin reads warm tan with ruddy shadows more than strongly flushed pink; the supplied fair-skin ramp limits the redness available. Eyes remain small and without bright glints, but eyelids and adjacent shadows sometimes make a mark read wider than one pixel.

These limitations are visible in the delivered comparison and frame proof; the dimensional and palette checks do not establish perfect animation continuity or exact artistic equivalence.
