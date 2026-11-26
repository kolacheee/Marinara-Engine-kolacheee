# Guard — round 18

Delivered 15 fresh large originals in `big/`, their 15 transparent 96×128 sprites in `sprites/`, `guard-sheet.png`, and the side/front/back walk GIFs. The sheet is 1152×1536, nearest-neighbour 3×, on #4a4642. Rows are standing front/side/back (fourth cell empty), walkside0–3, walkfront0–3, and walkback0–3. Each GIF is 288×384, four frames, looping, 160 ms per frame.

## Drawing and review

The right-facing side was drawn first from text. Its first version was too elongated and was redrawn before producing the other views. Every other view used the accepted side drawing as a reference. Two late redraws also used this run's matching standing view to improve consistency. Every figure and replacement was drawn by the image tool; no figure was scripted, assembled from body parts, or hand-painted during processing.

Redrawn weaknesses: the initial side proportions; walkside3, whose first pose repeated the other passing pose; walkfront2, whose face had drifted; and walkback0, whose build looked too narrow. Superseded drawings and the earlier sheet remain in `scratch/`.

Inspected all generated drawings, every final sprite individually at native size, the complete final sheet at its full 1152×1536 resolution, and all twelve decoded GIF frames in 3× strips. GIF review was frame-by-frame, not a claim of real-time playback. The decoded GIF frames match the corresponding sprite composites exactly.

## Processing and checks

`scratch/process.py` range-keys magenta, BOX-downscales, aligns the head horizontally, snaps colours, adds the one-pixel exterior outline, and produces the sheet and GIFs. Height is based on helmet-to-lowest-sole rather than spear tip, so a slightly taller spear does not shrink the guard. The body is approximately 92 pixels including outline; spear tips can extend a few pixels above that. The lowest outlined foot lands on row 124 (zero-based).

All sprites are 96×128 with alpha values only 0 and 255. All fifteen sprites together use **44 opaque RGB colours**, below the 48-colour limit. The outline target is the mean of touching opaque neighbours ×0.32 + (8,4,10), rounded to integers. Those targets are subsequently palette-snapped to twelve shared outline shades to keep the complete character within the colour limit; final outline RGBs are therefore approximations of the formula. Interior colours were allocated up to 36 shades. No dithering or geometry retouching was used. Checks are recorded in `scratch/checks.json`.

## Honest weaknesses

- The build is stocky, but the final drawings read closer to roughly 3.5–3.7 helmet-inclusive heads than a precise 3.3. The front views remain somewhat toy-like despite small eyes and an adult face.
- The front cycle still has small changes in expression, cheek shape, belt position, and tabard width. Cloth folds and helmet highlights vary between independently drawn frames. The redraws reduced these differences, not eliminated them.
- Side contact frames have subtle near/far-leg separation. Passing poses are now distinct, but the stride can still read as a short shuffle. The largely fixed upper body limits weight transfer.
- Spear position, apparent length, and ground clearance vary slightly. Some rear boots are ambiguous between heel and toe; the rear contact poses show rather prominent soles.
- Mail avoids checker texture, but its broad shaded rows can read as segmented sleeves rather than unmistakable chain mail. BOX reduction softens some original pixel clusters, especially facial details.

Only the three supplied text files and images produced during this run were used as content inputs. No repositories, earlier sprites, other characters, or outside folders were inspected. All explicitly managed files and intermediates are inside this folder. The image service reported automatic archives outside the folder; those archives were not opened or read. Local originals were saved directly from the image bytes returned by the tool.
