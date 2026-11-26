# Hadrik — delivery notes

Delivered fifteen freshly drawn views: front, right-facing side, back, and four frames each for side/front/back walking. `big/` contains unscaled magenta-background source cells; `sprites/` contains the transparent production PNGs. The sheet, comparison and three walk GIFs are in this directory.

## Verified

- Every sprite is RGBA, 96 × 128, with binary alpha and zero RGB under transparency.
- Every silhouette occupies rows 33–124 inclusive (92 rows), with horizontal centering including equipment. Rows 0–32 and 125–127 are empty.
- The union of all fifteen sprites uses 24 colours, all from Hadrik's six permitted ramps; the cap is 32.
- The sheet and comparison use exact 3× nearest-neighbour enlargement and the style sheet's sampled background.
- Each GIF has four distinct frames, 288 × 384, 160 ms per frame, looping. Decoded GIF pixels match the corresponding enlarged sprites composited on that background.
- All generated masters were visually inspected. All fifteen reduced figures were inspected in the full-resolution sheet, the full-resolution comparison was inspected, and all walk frames were inspected in 3× frame strips. GIF files were also opened; motion quality is assessed primarily from their frame sequences rather than a claim of a live playback review.

## Revisions and processing

The side master was drawn first and supplied to every later drawing request. The second side passing pose was redrawn because it initially repeated the first passing pose too closely. Both front passing poses were redrawn to lower their lifted feet. Superseded source figures remain in the original masters in `../scratch/`; final `big/` cells select the accepted drawings.

Python only keyed magenta, split/cropped source cells, reduced once with NEAREST, snapped colours, assembled presentations/GIFs and checked files. No face, limb, costume shape or replacement pixel anatomy was painted procedurally. Skin masks were re-established for these poses. A colour-only leather snap with luminance cuts 42/84/128 was added before the general weighted palette pass to prevent minor source gradients switching repeatedly between competing ramps. The general pass retains the specified .30/.59/.11 weighted distance.

Rebuild from this task folder:

```sh
python scratch/assemble_sheet.py
python scratch/check.py
```

Exact reduction boxes and widths are in `../scratch/reduction-manifest.json`; machine checks are in `../scratch/check-report.json`.

## Honest weaknesses

- This is a close design match, not an exact match to the supplied Hadrik. The beard is heavier and longer, and the front face is darker and less readable at native size. Some mouth/beard marks exceed the ideal quiet 1–2-pixel mouth treatment.
- The four-head construction is approximate. Head and beard extent vary slightly across orientations; the new front reads somewhat more head-heavy than the supplied front.
- Frame-to-frame redraw drift remains in sleeve folds, apron shading, hammer angle and torso width. The revised side passing frame has a more vertical apron and slightly different shoulder contour. Centering the whole silhouette also allows small apparent body shifts as limbs move.
- Side contacts are more emphatic than the very quiet passing pose in the style reference. Front/back depth movement is subtle; the cycles may read as a shuffle and are not perfectly seamless, hand-tuned production animation.
- Some contours and overlaps become thicker than one pixel after reduction. Small isolated shade pixels remain around hair, cuffs, boots and rear straps; the logical grid is clean but not every cluster satisfies the ideal 2–6-pixel grouping.
- Upper-left lighting is broadly consistent, but the four roles are not perfectly isolated by material at every edge. General palette snapping can place a neighbouring permitted ramp on a transition pixel.

Only this folder's style sheet, supplied reference sprites and newly drawn Hadrik images were used as visual references. No external reference files or repositories were opened. The image service automatically reported cache copies outside this folder despite the requested local save location; those cache paths were not read or opened. Returned image bytes were saved directly into this folder's `scratch/` for all subsequent work.
