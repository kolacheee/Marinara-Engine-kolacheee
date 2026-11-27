# Farmhand — delivery notes

Young adult man with freckles, messy blond hair, a small straw hat, a loose linen shirt, rolled brown trousers and sandals. This delivery contains only this character.

## Files

- `big/farmhand-<view>.png`: 15 unreduced, magenta-background source cells. These are crops of the image-tool originals, without repainted anatomy.
- `sprites/farmhand-<view>.png`: 15 transparent 96 × 128 sprites: front, side, back, walkside0–3, walkfront0–3 and walkback0–3.
- `farmhand-sheet.png`: standing views, side walk, front walk and back walk, in that row order, at exactly 3× nearest-neighbour size.
- `farmhand-vs-style.png`: farmhand, Wren, Hadrik and Noble fronts and sides, all at exactly 3×.
- `farmhand-walkside.gif`, `farmhand-walkfront.gif`, `farmhand-walkback.gif`: four frames each, 160 ms per frame, looping, at 3× on the reference sheet's background.

## Method and checks

Read CHARACTER.md, BRIEF.md and STYLE.md and inspected STYLE-SHEET.png before drawing. The only image references were that sheet and this run's own farmhand images. The supplied ref-sprites were used for the comparison. No outside artwork or repositories were opened.

The image tool drew every figure, starting with the right-facing side master. Every later generation included that corrected side master as a reference. Returned image data was saved directly into scratch; no external generated-image files were opened. Original multi-view generations and rejected versions remain in scratch.

Python only keyed magenta, cropped source cells, reduced each figure proportionally once with NEAREST, snapped colours, assembled sheets/GIFs and performed checks. No figure, face, limb or pose was drawn, patched, mirrored or synthesized in Python. A restricted colour-only correction maps accidental skin-ramp selections in the central trouser region to the leather ramp; it changes neither shapes nor alpha. Its bounds and changed-pixel counts are recorded in the build script and reduction manifest.

Allowed ramps: charcoal, leather, fair_skin, gold and linen, giving a 20-colour candidate palette. The delivered union actually uses **18 colours**, below the 32-colour cap. Palette snapping uses the STYLE.md weighted RGB distance. All sprite alpha values are 0 or 255; transparent RGB is zero. Every sprite occupies exactly rows **33–124**, is horizontally centred, and remains inside its 96 × 128 frame. The page/GIF background is sampled from STYLE-SHEET.png: **#E8E5DE**.

The final sheet (1216 × 1760) and comparison (1216 × 910) were opened at full image size. Every final pose was inspected at 3×, including all frames decoded from the saved GIFs. GIF frame count, dimensions, duration and looping were checked programmatically. Inspection of GIF motion was frame-by-frame, not a claim of real-time playback review.

Rebuild from this folder:

```sh
python scratch/assemble_sheet.py
python scratch/check.py
```

Processing: `scratch/build.py`. Source selection: `scratch/jobs.json`. Crop/scale details: `scratch/reduction-manifest.json`. Validation results: `scratch/check-results.json`. Decoded GIF inspection strips: `scratch/gif-*-decoded.png`.

## Redraws made after inspection

- Replaced the first side master because its torso and legs made it closer to five heads tall.
- Redrew the standing front/back pair for smaller eyes and clearer rear sandal heels.
- Redrew the front walk cycle to reduce the marching impression and bring passing feet closer together.
- Redrew walkfront3 separately because the revised sheet repeated the other passing frame's support leg.

## Honest weaknesses and departures from STYLE.md

- The four-head construction is approximate and includes the straw hat. The anatomical head beneath it is smaller than a full 23-pixel unit. The hat also makes the silhouette's crown less directly comparable to the bare-headed reference characters.
- The face reads softer and younger than the strongest adult faces in the reference. Freckles are subtle after reduction and do not retain identical pixel placements across views. Some profile eye/eyebrow marks merge into more than a single dark pixel.
- Hat brim width, hair clusters, cuff shapes and shirt folds drift slightly between independently drawn views. The front walking head is not pixel-identical to the standing front. The separately redrawn walkfront3 has small face and sleeve differences.
- Outlines are coloured and broadly follow upper-left illumination, but some overlaps remain heavier than the ideal 1-pixel contour. Light-side contour softening is not uniform. Some tiny irregular clusters survive nearest-neighbour reduction, especially around hair, hands and sandals.
- Four-tone ramps guided the drawing, but general nearest-palette snapping sometimes borrows neighbouring material tones. It is not a perfectly segmented four-colour-per-material rendering. Some linen planes are warmer/flatter than the reference's more deliberate volume shading.
- All cycles alternate contact and passing poses, but they are not perfectly registered animation production masters. Head/torso shapes can shimmer slightly, and the side arm swing changes more abruptly than ideal. The front/back depth motion is restrained and can read as stepping in place. Some passing feet lift roughly 3–4 pixels rather than the requested ideal of about 2.
- The back sandals have heel planes and straps, but at 96 × 128 their construction remains less immediately readable than the reference's closed boots.

The technical frame, alpha, palette-union and export checks pass. The stylistic and animation limitations above remain visible; this is not an exact hand-cleaned match to the reference sprites.
