# Priest — round 18

Delivered 15 image-tool originals in `big/`, 15 transparent 96×128 sprites in `sprites/`, `priest-sheet.png`, and the three `priest-walk*.gif` files.

The sheet is 1152×1536, nearest-neighbour 3×, on #4a4642. Its rows are standing front/side/back (fourth cell empty), walk-side 0–3, walk-front 0–3, and walk-back 0–3. Each GIF is 288×384, loops indefinitely, and has four frames at 160 ms each, in contact/passing/opposite-contact/opposite-passing order.

## Source and redraws

The instructions were read in the requested order: CHARACTER.md, BRIEF.md, R17-METHOD.md. Only this priest was made. No outside artwork, previous-round assets, repository, or other character was consulted. The first side design came from text. All other final views used the final side image from this run as their reference.

The first complete set was too elongated in head units. The side master was redrawn and refined toward the requested compact 3–3.5-head proportions, then every other view was regenerated from that corrected side. Earlier redraws corrected a shortened staff, a malformed shoe, and an excessive side stride. A replacement side passing frame also required a redraw because it switched the staff-holding arm. Rejected originals are retained under `../scratch/`; `big/` contains only the 15 retained originals.

Every generated original was visually inspected. All final sprites were inspected individually at native size, the sheet was inspected at its full 1152×1536 size, and every encoded GIF frame was decoded and inspected in the strips under `../scratch/`. Animation review was frame-by-frame, not an in-engine movement test.

## Processing and verification

All figures were drawn by the image tool. Python/Pillow performed only background keying, removal of disconnected stray marks, cropping, BOX reduction, frame placement, palette snapping, outline generation, sheet/GIF assembly, and checks. No limbs, faces, clothing, or poses were painted or warped in code.

- Magenta was removed with a range key, including contaminated edge pixels.
- Artwork was BOX-reduced to 92 pixels tall, preserving aspect ratio, and aligned by the upper head to reduce horizontal jitter.
- The reduced artwork occupies rows 32–123. Adding the one-pixel outside outline produces a 94-pixel total silhouette at rows 31–124; row 124 is the lowest visible ground-contact contour. This distinguishes the requested approximately 92-pixel figure from the additional outline.
- There are exactly 48 shared opaque RGB colours across all 15 sprites: 36 figure colours and 12 outline colours. Alpha is exclusively 0 or 255.
- The outline uses the mean colour of occupied neighbours in the surrounding 3×3 neighbourhood, multiplied by 0.32 and offset by (8,4,10), rounded to integer RGB. Those results are then snapped to the shared 12-colour outline palette to keep the entire character within 48 colours. Thus final outline RGB values approximate the formula; maximum per-channel snapping difference is 19/255.
- Dimensions, palette union, binary alpha, bottom alignment, file counts, GIF frame counts, looping, and all 160 ms durations passed checks. Decoded GIF pixels match the corresponding sprites composited on #4a4642 and enlarged 3× exactly.

The repeatable processing script is `../scratch/process.py`; numerical results and original-file hashes are in `../scratch/checks.json` and `../scratch/original-hashes.json`.

## Honest remaining weaknesses

- The robe folds, white hair clusters, eyebrows, and neckline are not perfectly identical between independently drawn views. Some texture flicker remains, especially on the back and front walk cycles.
- The long robe conceals the knees and much of the leg overlap. Opposite side contacts are distinguishable mainly through shoe angles and arm swing; left/right leg identity is less explicit than it would be in trousers.
- The walk is a restrained shuffle. The staff stays nearly vertical and changes position little, so its planting is not a fully articulated cane-assisted gait and may look as though it slides during world movement.
- Front walking frames vary slightly in head width, expression, stole width, and sleeve silhouette. The side set is more consistent.
- Compact proportions now read much closer to the requested scale, but they remain stylized estimates rather than a measured anatomical rig. The large white beard makes the apparent head mass especially large from the front and side.
- The grey robe is warm and can read as taupe/brown under the strong warm lighting. The staff is fairly thick for readability at reduced size.
- BOX reduction blends some source pixel clusters. The resulting grid and alpha are crisp, but fine facial details and the existing dark source contour can look softer or heavier than a sprite drawn natively at 96×128.

These limitations are retained visibly; they were not concealed with manual figure edits.
