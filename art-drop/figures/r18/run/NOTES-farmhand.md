# Farmhand — review notes

Delivered fifteen original drawings in `big/`, fifteen transparent 96×128 sprites in `sprites/`, the 1152×1536 review sheet, and three 288×384 walk GIFs. Each GIF has four frames, 160 ms per frame, and loops continuously. The sheet uses #4a4642, with standing front/side/back on row 1, side walk on row 2, front walk on row 3, and back walk on row 4. The last standing cell is intentionally empty.

## Drawing and review

The right-facing side was designed first from text. The first attempt was too tall and was rejected. The compact replacement is the sole image reference supplied for every subsequent view and redraw. Every figure was drawn by the image tool; no figure parts were constructed, repainted, mirrored, or repositioned in Python.

All original drawings were visually inspected. All fifteen final sprites were inspected individually, and the complete sheet was opened at its full 1152×1536 resolution. All twelve decoded GIF frames were inspected; after the last redraw the complete rebuilt sheet, revised sprite, and revised GIF frame were inspected again. GIF frame counts and timing were checked programmatically. Animation review was frame-by-frame, rather than an in-engine playtest.

Redraws: the initial tall side design; side contact frame 2 to reverse the near arm swing; side passing frame 3 twice to improve limb order and then close the ankle spacing; back contact frame 2 to reverse its arm swing. Rejected originals and processing/check files are retained in `../scratch/`.

## Processing and checks

Magenta was range-keyed, the foreground bounding box was cropped, and Pillow BOX resampling reduced each figure to 92 pixels of content height. Transparency was thresholded to alpha 0 or 255. A shared base palette was applied. Each transparent pixel touching the figure in its eight-neighbour neighbourhood received a one-pixel outline calculated as mean opaque neighbour RGB × 0.32 + (8, 4, 10), rounded to integer channels. A final shared palette snap keeps the outline and artwork together below the 48-color limit; this final snap slightly approximates the arithmetic outline colors.

The final set uses 43 opaque colors across all fifteen sprites. All sprites are 96×128, have binary alpha, and have their lowest opaque sandal-outline pixel on zero-based row 124. The 92-pixel content plus the added top/bottom outline occupies 94 rows, from 31 through 124. No residual magenta-range opaque pixels were detected. The sheet and GIFs use exact 3× nearest-neighbour enlargement. Full check results are in `../scratch/checks.json`; the reproducible processor is `../scratch/process.py`.

## Honest weaknesses

- The face still reads more youthful and cute than an unequivocally adult farmhand, especially from the front. The eyes remain fairly prominent. The compact proportions are improved over the rejected tall design, but the adult/not-chibi target is only partially satisfied.
- The front walking face, bangs, freckles, and expression shift between frames. Freckles become faint at 96×128 and are not equally readable in every pose.
- Hat highlights, shirt folds, cuff shapes, and trouser shading vary slightly between independently drawn poses. The shared palette controls color drift but cannot eliminate shape flicker.
- The two side contact poses now alternate their near-arm swing, but the near/far leg overlap is not perfectly unambiguous at sprite size. Passing frame 3 is narrower than passing frame 1. The four-frame side cycle may still feel a little stiff.
- Front/back contact poses have more apparent depth separation between feet than the passing poses. They avoid high knee lifts, but the depth change may read as a slight bob or shuffle during playback.
- The hat is visually prominent for a “small straw hat.” Hair and hat shading remain busier than ideal for the intended half-size display.
- BOX reduction softens some original pixel clusters before palette snapping. The final files have hard alpha and a crisp pixel grid, but the interior shading is less deliberately clustered than a manually authored sprite.

Work files and deliverables were written only inside this folder. No outside image collection, other character, prior-round asset, or repository was opened. The image service creates its own cache automatically; its returned image data was saved directly into this folder without reading that external cache.
