# Innkeeper — round 18 notes

## Delivered

- 15 distinct image-tool originals in `big/innkeeper-<view>.png`.
- 15 transparent 96×128 sprites in `sprites/innkeeper-<view>.png`.
- `innkeeper-sheet.png`: 1152×1536, nearest-neighbour 3× enlargement, background #4a4642. Rows are standing front/side/back (fourth cell empty), walk-side 0–3, walk-front 0–3, walk-back 0–3.
- Three 288×384 looping GIFs, four frames each, 160 ms per frame, on the same background.

## Drawing and review

Read CHARACTER.md, BRIEF.md, and R17-METHOD.md in that order. Drew only the innkeeper. The initial design came from text, side view first. The final side original was the reference supplied to every other view, including redraws. All figures were drawn with the built-in image tool; no figure anatomy, clothing, or poses were drawn or repaired in Python.

Reviewed each generated drawing. Revised the side design to correct its proportions before drawing the other views. Replaced both side passing frames because their feet reached too far forward, replaced rear contact frame 0 because the mug was raised too high, and redrew side contact frame 2 to clarify the opposite leg.

Reviewed all final sprites together in the full 1152×1536 sheet. Inspected every decoded frame of all three delivered GIFs in full-resolution frame strips. This was frame-by-frame inspection, not a claim of real-time playback or an in-engine test.

## Processing and measured checks

Magenta was range-keyed because the original backgrounds were close to, but not uniformly, #FF00FF. Cropped to the figure, used alpha-aware BOX downscaling, then thresholded alpha to 0 or 255. Artwork is 92 pixels tall before the added outline; the complete silhouette is 94 pixels tall including the outer outline, with its lowest opaque pixel on zero-based row 124. Thus “about 92 pixels” refers to the artwork before the outline, not an exactly 92-pixel final bounding box.

The common palette has 32 interior colours and 16 outline colours: exactly 48 opaque RGB colours across the complete character set. The one-pixel exterior outline uses eight-connected neighbours. Its initial colour is the rounded mean adjacent interior RGB × 0.32 + (8,4,10). Those calculated colours are then snapped to the shared 16-colour outline palette to meet the total 48-colour cap. Consequently the final outline approximates the formula after palette snapping; it is not an exact unrestricted RGB result at every boundary pixel.

All 15 sprites are 96×128, have alpha only 0/255, fit inside their frames, end on row 124, and contain no pixels matching the magenta key. All originals are distinct. All three GIFs have four frames at exactly 160 ms each. Head silhouettes are registered to a common horizontal axis so changes in arm reach do not recenter the entire body.

Reproducible processing is in `../scratch/process.py`; measured results are in `../scratch/checks.json`. Final view prompts are in `../scratch/approved-prompts.json`. Rejected saved drawings, returned-image byte intermediates, and review strips remain in `../scratch/`.

## Honest weaknesses

- Side passing frames 1 and 3 are deliberately very low and nearly overlapping. Their leg distinction remains subtle, so the four-frame cycle can read as a compact shuffle.
- Opposite side contact is clearer after redraw, but the apron hides the hips and makes the leg assignment less obvious than on an unclothed silhouette.
- Mug size/angle, waistcoat folds, apron pleats, and hand contours drift slightly between independently drawn views. The standing front has more visible apron tie detail than some front walk frames. These were not patched by code.
- The rear views have slightly different hair-fringe and bow shapes, and the back can read narrower than the round belly shown from the side.
- The enlarged face remains friendly and somewhat cartoon-like. The figure is approximately 3.3 heads tall in the side design, but head-to-body consistency is not exact across every projection.
- BOX downscaling and the shared palette soften some source pixel clusters. The final grid and transparency are crisp, but this is not a manually authored animation with identical pixel clusters carried between frames.
- No engine integration or gameplay-scale motion test was performed.

## Scope exception

A runtime-required imagegen skill instruction file was read outside this folder. No outside artwork, existing sprites, other Downloads folders, or repositories were read or listed. The image tool also automatically caches its outputs outside the folder; those cache files were not opened or copied. Workspace originals were saved directly from the image bytes returned by the tool. All manually created task files and processing intermediates are inside this folder.

