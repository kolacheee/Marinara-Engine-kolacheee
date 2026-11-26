# Wren — style D

Delivered all 15 requested views: standing front/side/back, four right-facing side-walk frames, four front-walk frames, and four back-walk frames. The large per-view sources are in `big/`, transparent production frames in `sprites/`, with the 3x sheet, style comparison, and three walk GIFs alongside this file.

## Method and inspection

The side master was drawn first and used as a reference for every subsequent drawing request. Visual references were limited to this folder's style sheet, its supplied sprites, and Wren drawings made during this run. Every figure and pose correction came from the image tool. No limbs, faces, clothing, or animation poses were painted or synthesized in Python.

Python splits source columns, keys magenta using the specified thresholds, crops to alpha, resizes once with NEAREST to 92 occupied rows, applies the specified moss source-anchor mapping and weighted nearest allowed palette colour, then centres the whole silhouette in a 96x128 transparent frame. No smoothing, dithering, morphological cleanup, or manual pixel repair was applied. The large per-view files preserve their source cell pixels; complete generation sources and rejected versions remain in `scratch/`.

All generated masters, including rejected drafts, were visually inspected. All 15 reduced views were inspected on the full-resolution 3x sheet. The complete final sheet (1248x1848) and comparison (1248x960) were opened at native resolution. The GIFs were opened, their four component poses inspected on the sheet, and every decoded GIF frame checked against its corresponding enlarged PNG. This verifies frame contents and timing, but is not a claim of perfectly smooth motion.

Redraws corrected the first side master's overly tall proportions; repeated side-leg overlap; incorrect front support-foot assignment; excessively high front passing feet; speckled back-cloak reduction; and noisy leather planes in the front passing redraw. These corrections are retained in the source history rather than hidden by procedural painting.

## Verified output properties

- 15 RGBA sprites, each exactly 96x128.
- Crown at row 33 and lowest planted sole at row 124 in every sprite: 92 occupied rows.
- Binary alpha only, with zero RGB in transparent pixels.
- 28 colours across the union of all 15 views, all from Wren's seven permitted ramps; below the 32-colour cap.
- Complete silhouette centred horizontally, including the bow and quiver, without stretching.
- Bow retained in the same anatomical left hand: viewer-right from the front and viewer-left from the back.
- Three 288x384 GIFs, each four frames at 160 ms, infinite loop, transparent background, fixed palette, exact 3x NEAREST sprite pixels.

Rebuild from the task folder with `python scratch/assemble_sheet.py`, then run `python scratch/check.py`. Source boxes, reduced widths, and placements are in `scratch/reduction-manifest.json`; validation results are in `scratch/checks.json`.

## Honest weaknesses and departures from the visual target

- **The style match is close, not exact.** The standing side has a broader swept hair mass and slightly longer-looking face than the supplied Wren. The new front has a narrower body and a somewhat softer, younger expression. The four-head construction is approximate, not an independently measured 23-pixel head in every view.
- **Animation consistency is imperfect.** Independently drawn views change hair highlights, facial details, pouch shape, sleeve folds, and torso width slightly. Front passing frames have darker hair and flatter leather shading than the contact frames. These changes can shimmer in playback; the upper body is not pixel-identical across the cycle.
- **The side walk is somewhat more energetic than ideal.** Its contact stride is wider than the quietest town-walk interpretation, and the bent passing knee is more pronounced than the brief's slight bend. Opposite leg overlap is now readable, but free-arm swing is not a perfectly balanced opposite-arm cycle.
- **Not every cluster meets the strict contour and shading ideal.** A few irregular isolated pixels remain around hair, cloak edges, and leather. Some dark overlaps are thicker than one pixel, and a lit contour is not consistently stepped up to its material's shadow tone. Colour-only snapping can use neighbouring permitted ramps in the same apparent material, so exact four-tone material separation is not guaranteed despite the correct character-wide palette.
- **Faces and hands are only approximately simplified.** Some eyes include a second pixel or a connected brow rather than an isolated 1x1 mark. Some grip and free-hand contours retain more finger suggestion than the intended mitten shape. No replacement faces or hands were painted to conceal this.
- **Equipment detail is fragile at final size.** The longbow silhouette reads consistently, but nearest-neighbour sampling makes the thin string intermittent in some views. Arrow and quiver details also vary slightly between redraws.

The final comparison deliberately shows the unchanged supplied Wren, Hadrik, and Noble fronts and sides at the same scale and baseline so these limitations can be judged directly.
