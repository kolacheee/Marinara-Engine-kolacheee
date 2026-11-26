# Elder — round 18

Delivered the elder only: wrinkled tan skin, white hair in a bun, taupe-brown shawl, dark green ankle-length dress, brown shoes and a wooden walking stick.

## Files

- `big/elder-<view>.png`: 15 unmodified image-tool originals, one figure per magenta image.
- `sprites/elder-<view>.png`: 15 transparent 96×128 sprites.
- `elder-sheet.png`: 1152×1536, nearest-neighbour 3× presentation on #4a4642. Rows are standing front/side/back (fourth cell empty), walkside 0–3, walkfront 0–3, walkback 0–3.
- `elder-walkside.gif`, `elder-walkfront.gif`, `elder-walkback.gif`: 288×384, four frames each, 160 ms per frame, looping, on #4a4642.

## Drawing and review

The built-in image tool drew every figure. The first side image was designed from text; every other view and subsequent correction included this run's side master as a reference. Some corrections also used another image of this same elder made during this run. No previous-round images, existing sprites or game images were used. No figure, limb, costume detail or pose was drawn or transformed with Python.

The first set was too elongated, approaching four heads tall. The image tool redrew the side master with a shorter body, then redrew all other views against that corrected master. Final proportions are approximately three to three-and-a-half heads, with modest differences between independently drawn views. Additional redraws corrected wide strides, raised free arms, changing frontal hair/face and shawl overlap, and an oversized side contact frame.

Every generated original, including rejected versions, was visually inspected. The final sheet was opened at its full 1152×1536 size; all final sprites were also opened individually. The GIFs were opened, their timing checked, and all twelve decoded GIF frames inspected together. This was frame-by-frame export review, not an in-engine movement test.

## Processing and checks

`../scratch/process.py` performs magenta range keying, Pillow BOX downscaling, palette snapping, outlining and assembly. It does not draw figures. Source crops retain their aspect ratios; placement follows the head rather than the moving stick.

To make the final outlined figure exactly 92 pixels tall, the keyed artwork was BOX-downscaled to 90 pixels, then given a one-pixel outer border. Final occupied rows are 33–124 inclusive. Row 124 is the bottom silhouette/ground row, including the outline; lifted shoes and some cane tips sit above it.

The character shares 48 opaque colours across all fifteen sprites: 32 artwork shades and 16 border shades. Border colours are calculated from the mean of occupied eight-connected neighbours ×0.32 + (8,4,10), then snapped into those 16 border slots to preserve the overall 48-colour cap. This final palette snapping slightly approximates the computed border colour. Alpha is strictly 0 or 255. No dithering or hand-painted pixel fixes were used.

Automated checks passed for all 15 original and 15 sprite files, 96×128 sprite dimensions, binary alpha, the shared 48-colour limit, 92-pixel visible height, bottom occupied row 124, sheet dimensions, GIF dimensions, four GIF frames, and 160 ms timing. Detailed results and palette are in `../scratch/checks.json`; prompts and rejected versions are in `../scratch/`.

## Honest weaknesses

- The stick's bends and apparent thickness vary slightly between frames. Its side-view fore/aft movement is conspicuous; it does not behave as a perfectly rigid prop.
- Dress folds and the shawl edge change a little between independently drawn poses. Shared colours reduce colour flicker but do not eliminate shape changes.
- The long skirt hides most of the legs. Contact versus passing is visible in shoe spacing, but the anatomical near/far-leg swap in the side cycle is less clear than it would be with exposed legs. Side frame 2 has a somewhat wider step than frame 0.
- Head and torso shapes are close rather than pixel-identical across the cycle. Small changes remain after the proportion redraws and common-height normalization.
- The front and back passing steps are restrained and can read as a shuffle. The mandatory four-frame, 160 ms cadence gives a 640 ms cycle, fairly brisk for an elderly character.
- Fine wrinkles and fingers soften into small tone clusters after BOX reduction. The age reads chiefly through the white bun, face shading, stoop and cane. The source outline plus added border is visually heavier in some dark areas.

## Workspace boundary exception

A required installed image-generation workflow instruction file was read outside this folder. The image service also automatically saved its own copies in its default external location; those copies were not opened or listed. Returned image bytes were written directly into this folder. No other Downloads folders, repositories, pre-existing sprites or external artwork were read. All task scripts, review images, rejected versions and deliverables are inside this folder, with intermediates in `scratch/`.
