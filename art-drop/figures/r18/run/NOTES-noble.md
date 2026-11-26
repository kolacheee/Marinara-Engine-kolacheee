# Noble — final notes

Delivered 15 original drawings in `big/`, 15 transparent 96×128 sprites in `sprites/`, `noble-sheet.png`, and the three requested walk GIFs. Only the noble was made.

## Drawing and review

Read `CHARACTER.md`, then `BRIEF.md` and `R17-METHOD.md`. Designed the right-facing standing side from text first. Every other view used the accepted side drawing as an image reference. The final back-contact correction also used this run's standing back drawing to improve costume and bun consistency. No earlier-round images, external sprites, repositories, or other character folders were consulted.

All figures were drawn by the image tool. Python performed magenta keying, cropping, BOX downscaling, shared palette snapping, the prescribed outline calculation, sheet/GIF assembly, and checks. There was no scripted figure drawing, limb compositing, or manual pixel repainting. Originals retain the returned image data. The image tool automatically keeps its own external cache; that cache was not opened or copied from. Returned image bytes were saved directly into this folder.

Inspected every original, including rejected drawings. Inspected all final sprites together in the full 1152×1536 sheet, and every decoded frame of all three final GIFs at 3×. The GIF review used frame strips, not a continuous real-time playback or an in-game test.

Redraws retained in `scratch/`:

- Two initial side designs were too elongated and were replaced before drawing the other views.
- Side passing frame 3 had too much foot separation and the wrong visible arm position; it was redrawn.
- Back contact frame 0 initially repeated the opposite contact frame's arm swing; it was redrawn.
- Back contact frame 2 had a low bun and shortened cape; it was redrawn after the first full-sheet inspection.

## Processing and checks

- Each cropped figure was BOX-downscaled proportionally to 92 pixels tall.
- The 92-pixel body occupies rows 32–123. Its added one-pixel outline makes the final silhouette 94 pixels tall, spanning rows 31–124. Thus the outer sole edge is on row 124, with three empty rows below it.
- Magenta was removed using a range key because the originals contain small background and edge color variations.
- Alpha is exclusively 0 or 255; transparent pixels have zero RGB.
- A common initial palette was applied across all views. For every transparent pixel touching the figure in its eight-neighbourhood, the outline was computed as the mean opaque neighbour RGB × 0.32 + (8, 4, 10).
- A final shared palette snap includes those computed outline colors, keeping the complete character at **46 distinct opaque RGB colors** across all 15 sprites. The palette snap slightly approximates the computed outline RGB values.
- The sheet uses exact `#4a4642`, nearest-neighbour 3× enlargement, four 96×128 cells per row, and the requested row order: stand front/side/back; walk-side 0–3; walk-front 0–3; walk-back 0–3. The unused fourth standing cell is blank.
- Each GIF is 288×384, loops, and contains four distinct frames at 160 ms each. Each decoded GIF frame was checked byte-for-byte against its corresponding sprite composited on the sheet background and enlarged 3×.
- All 30 expected PNG filenames, sprite dimensions, bottom alignment, alpha values, shared color limit, and absence of bright magenta foreground pixels passed checks.

The reproducible processing script, numerical report, rejected originals, and GIF inspection strips are in `scratch/`.

## Honest weaknesses

- The compact final figure is close to three heads tall when the full updo is included, toward the large-headed end of the requested range. The frontal face remains cute and somewhat doll-like; it is less convincingly adult than the profile.
- Hair highlights, bun shape, eye/eyebrow shapes, cape contour, and gown folds vary slightly between independently drawn frames. The redraws reduced the most obvious mismatches but did not make the head and costume pixel-identical.
- The long gown conceals the knees and most leg motion. Walking is conveyed chiefly through the shoes, hands, and hem. Passing poses are deliberately low but can read as small shuffling steps; near/far leg identity is especially ambiguous in the side contacts.
- The back-contact frame 2 redraw preserves the standing cape more faithfully, but its lower cape hides more of the belt than some other back frames. A little costume flutter remains.
- BOX reduction and palette snapping soften some hair highlights and tiny facial features. The result has crisp binary pixel edges, but its interior clusters are less economical than a hand-authored sprite at native resolution.
- Height and sole alignment are normalized per frame. This limits vertical bounce; the cycles are restrained rather than fluid. Small horizontal and silhouette changes remain because the drawings were not rigidly registered or assembled from reused body parts.
