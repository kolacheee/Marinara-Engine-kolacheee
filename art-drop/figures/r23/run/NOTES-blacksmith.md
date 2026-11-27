# Dema Ors — Review redraw 2

Replaced all 15 image-tool originals in `big/`, all 15 sprites in `sprites/`, the four-row sheet, three walk GIFs, front face crop, front-versus-sheet comparison, and all-head 6× comparison.

The final review takes precedence: Dema now has a heavy leather bib apron over navy rolled sleeves, a full dark beard, short dark hair with grey temples, warm olive skin, soot-dark forearms and the small steel hammer in the anatomical right hand. The short broad build, navy trousers, gaiters, boots, pouch and standing/walking pose intent were retained. Back views show the exposed navy shirt, apron neck strap/waist fastening and apron side edges.

## Image-tool redraws

This revision used **32 built-in image-tool edit requests**. The right-facing standing side was established first. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. Every other image reference was an existing or newly redrawn image of this character. No outside artwork was used.

There were 15 initial full-view edits, three additional standing-front face corrections, a final head rebuild across all ten face-bearing views, three rear-view corrections, and two final skin-shadow corrections. The rear corrections restored a passing foot that had become planted, removed an erroneous rear apron, and shortened an erroneous long shirt hem. The final head rebuild increased eye/catch size, separated brows, simplified warm cheeks and strengthened the full beard.

No facial features were drawn or patched with code. Exact prompts are in `../scratch/review2/prompts.json`. Original pre-review images and rejected intermediates are retained under `../scratch/review2/`.

## Reduction and cleanup

The final reducer is `../scratch/review2/process.py`. It range-keys magenta, crops to the figure and uses premultiplied BOX reduction to 92 occupied rows. Skin and non-skin colours are BOX-averaged separately to avoid mixing warm cheek colour into dark eyes and beard edges. Spatial/source-colour masks select skin; it is snapped only to olive. Exposed facial skin uses olive shadow/body/light. Hair and beard use charcoal with steel temple accents. The final shared palette contains **23 colours** from the six specified ramps; no extra ramp was added.

Skin/hair despeckle runs after palette snapping. It replaces a pixel only when it differs from all four direct neighbours, using the most frequent colour in the same-mask 3×3 neighbourhood. Eye/brow/nose/mouth regions, silhouette contours, darkest outline colours and material boundaries are protected. The hair mask excludes warm leather straps, linen collars and blue clothing. A separate validator checked every changed pixel: **101 pixels changed across the 15 sprites**, all satisfying the mask/isolation/mode conditions; protected pixels were unchanged. Masks, before-cleanup sprites, change coordinates and validation reports are saved in `../scratch/review2/`.

A temporary area-majority reducer was evaluated and rejected. The delivered sprites use the BOX method described above.

## Visual review

Every final head was inspected at 6× beside rows 33–63 inclusive of Wren, Hadrik and the noble. The full comparison is `blacksmith-heads-vs-sheet-6x.png`; separate front/side/back panels are in `../scratch/review2/compare-*.png`.

- Front: full beard, separate horizontal brows, two clear eyes and warm nose/cheek planes.
- Walk-front 0: two eyes remain distinct; the nose highlight is taller than standing front.
- Walk-front 1: readable eyes and broad nose; the catches are less even and brow spacing differs slightly.
- Walk-front 2: clear eye blocks, short nose and readable mouth within the beard.
- Walk-front 3: clear eyes/brows and full beard; slightly stronger cheek edge.
- Side: one clear profile eye, projected nose and substantial beard.
- Walk-side 0: clear eye/brow; the light catch is the quietest of the profiles.
- Walk-side 1: clear eye with light corner; mouth shadow is small.
- Walk-side 2: readable eye/brow and broad nose; slight temple/ear shape variation.
- Walk-side 3: clear profile eye, warm face and full beard.
- Back and walk-back 0–3: no facial features; dark hair remains grouped into broad locks, with small grey temple edges and warm ears/nape.

The final front was also inspected at 3× beside all three reference fronts in `blacksmith-vs-sheet.png`. The apron and hammer now establish the trade. Dema remains distinct from Hadrik through a wider, shorter build, lighter olive face, short grey-templed hair, navy sleeves/trousers and apron pocket. All three GIFs were decoded into frame strips and visually checked; this was frame-by-frame inspection, not real-time playback.

## Export checks

- 15 sprites: 96×128 RGBA, binary alpha, crown at row 33, lowest sole at row 124; rows outside 33–124 transparent.
- All ten face-bearing heads contain the three prescribed olive face tones. No pure black or white in the sprite palette.
- All 15 large PNGs are new image-tool originals, 1086×1448; their original magenta backgrounds and source rendering are retained.
- Sheet: 1152×1536, nearest-neighbour 3× on #4a4642, standing front/side/back then side/front/back walk rows.
- GIFs: 288×384, four distinct frames each, 160 ms per frame, looping.
- Front face: 336×186 at 6×. Front comparison: 1152×420 at 3×. All-head comparison: 960×3240 at 6×.

## Remaining limitations

This is a visual style match, not a pixel-exact reconstruction of the reference craft. Brow/eye spacing and catch brightness vary by about a pixel between frames; walk-front 1 is the least even. Some side mouth marks remain small. The source cheek/nose shading becomes simpler after the three-tone snap. Hair locks, temple patches, apron folds/pocket shape and soot coverage vary slightly between images.

Body and pose preservation is visual, not byte-identical. Image-tool edits introduced small contour and shading changes. The inherited side strides, large mitten hands and some lateral registration variation remain. Some clothing/leather boundaries have isolated reduction pixels; the requested despeckle intentionally changes only skin and hair. The apron covers much of the bowed upper trousers, while the short broad stance and pinched gaiters remain visible.

All authored project work is inside this folder. The image service automatically cached its originals before they were copied into `out/big/`.

## Rebuild

```sh
python scratch/review2/process.py
python scratch/assemble.py
python scratch/compare.py
python scratch/review2/compare.py
python scratch/review2/validate.py
```

Additional export and face-skin reports are in `../scratch/review2/export-validation.json` and `../scratch/review2/face-skin-validation.json`.
