# Mage — round 18

Delivered 15 original drawings in `big/`, 15 transparent 96×128 sprites in `sprites/`, `mage-sheet.png`, and the three directional walk GIFs. Only this character was made. No earlier-round artwork, existing sprites, repositories, or other project folders were read.

## Drawing and review

The right-facing side design was drawn first from text. The first attempt was too tall and was rejected; its original remains in `../scratch/side-initial.png`. The accepted side original was supplied as a reference for every other view. Later front and back frames also used this run's corresponding standing view to stabilize the face, braid and costume.

Every figure was drawn by the image tool. Python performed only keying, removal of disconnected stray pixels, proportional BOX downscaling, palette snapping, outline generation, placement, sheet/GIF assembly and checks. No figure parts were drawn, repainted, spliced or pose-warped in code. Originals in `big/` retain the returned image bytes.

All generated originals were inspected. The first full-size sheet showed inconsistent faces and braid placement in walkfront0 and walkfront1, and overly similar side passing poses. Those two front frames and walkside3 were redrawn; rejected originals remain in `../scratch/`. The rebuilt 1152×1536 sheet was inspected at full resolution, as were all 15 individual sprites at native size. Every encoded GIF frame was inspected in decoded contact strips; this was a frame-by-frame review, not a real-time playback review.

## Processing details and checks

- Backgrounds were requested as #FF00FF. The returned originals contain some magenta variation, so range keying was necessary.
- Each keyed figure was proportionally BOX-downscaled to 92 pixels high. The body occupies rows 32–123; the added outline extends the full opaque height to 94 pixels, rows 31–124. The bottom visible foot outline is therefore on row 124 in every 96×128 frame.
- Frames are aligned by the upper-head centre to reduce horizontal jitter from moving arms and props.
- All 15 sprites together use exactly 48 opaque RGB colours: 36 shared body colours and 12 shared outline colours. Alpha is strictly 0 or 255.
- The one-pixel outer outline uses the eight touching neighbours: mean RGB × 0.32 + (8, 4, 10), rounded. Those calculated outline colours are then snapped to the shared 12-colour outline palette to preserve the overall 48-colour limit; final outline RGB values thus approximate the formula rather than retaining every distinct calculated value.
- The sheet is nearest-neighbour 3× on #4a4642. Rows are stand front/side/back, walkside0–3, walkfront0–3, walkback0–3. The fourth standing cell is blank.
- Each GIF is 288×384, four frames, 160 ms per frame, infinite loop, on #4a4642.
- Checks passed for filenames/counts, frame dimensions, palette union, binary alpha, bottom row, sheet size/background, absence of opaque keyed-magenta colours, GIF frame counts and durations.
- A small detached dash below walkfront3's raised foot and one stray source pixel in walkfront2 were removed during keying. No connected character details were hand-edited.

The reproducible processing script, validation data, rejected drawings and GIF inspection strips are in `../scratch/`.

## Honest weaknesses

- The long robe conceals the knees and much of the leg overlap. Side contact frames 0 and 2 remain less distinct than they would be on a trousered character. The passing-frame redraw improves the foot swap, but the side cycle still reads somewhat like a shuffle.
- Cloth folds, sleeve shapes, satchel width and scroll positions vary slightly between separately drawn poses. The front contact poses show some bag and arm motion that is larger than ideal for a very relaxed walk.
- The side view exposes more of the chest clasps and satchel than a perfectly strict profile would. It has a mild three-quarter costume treatment even though the face and boots point right.
- The proportions are near the tall end of the requested compact range, and the face remains somewhat youthful/stylized. The eyes are more prominent in the large originals than a restrained adult field sprite ideally needs.
- BOX reduction and the shared palette soften the smallest facial features and brass details. The result has crisp binary edges but is not a manually perfected low-resolution pixel grid.
- Braid movement is restrained, especially in the back cycle, so the upper body looks fairly static. Slight shading and silhouette changes may still produce visible flicker in motion.
- The deep purple robe reads as warm plum/burgundy in its brightest areas. Hair highlights read as warm silver rather than a cold white silver.
