# Bard — round 18

Delivered 15 original drawings in `big/`, 15 transparent 96×128 sprites in `sprites/`, `bard-sheet.png`, and three walking GIFs.

The sheet is 1152×1536, enlarged exactly 3× with nearest-neighbour sampling on #4a4642. Rows are standing front / side / back / empty; walk-side 0–3; walk-front 0–3; walk-back 0–3. Each GIF is 288×384, loops four frames in order, and uses 160 ms per frame.

## Drawing and review

Every figure was drawn by the image tool. The right-facing side master was designed from text first. Every other accepted view used that side master as a reference. The later front and back walks additionally used the standing front or back drawn in this run to stabilize the costume and lute placement. No earlier sprites, game images, repositories, or external reference files were inspected.

There were 22 drawings total, with 15 accepted and seven superseded originals retained in `scratch/`. The first side design was redrawn because its legs were too long. Two front walks were redrawn because the lute changed shoulders and the strap changed shape. Three side walks were redrawn to distinguish passing and opposite-contact poses; the opposite-contact frame was redrawn once more to reduce its exaggerated arm swing.

All generated drawings, including rejected drawings, were visually inspected. The completed sheet was opened at its full 1152×1536 size. All frames decoded from the three actual GIF files were also inspected in full-size strips; these strips are in `scratch/`. GIF decoding was compared pixel-for-pixel with the intended frame compositions.

## Processing and checks

- Magenta was removed with a range key. Disconnected stray marks were removed by retaining the main connected figure.
- Each original was cropped and box-downscaled proportionally to a 90-pixel core. The additional one-pixel outline makes the final visible silhouette exactly 92 pixels high, from row 33 through row 124 inclusive. Figures are centered in 96×128 frames.
- All 15 sprites share 47 opaque RGB colours, or 48 RGBA values including transparent. Alpha is exclusively 0 or 255. There is no dithering.
- Outline colours were calculated from the mean of opaque neighbours using `mean × 0.32 + (8,4,10)`, then snapped to eight shared outline colours to respect the total palette limit. The body uses 39 shared colours. Consequently the final outline is a palette approximation of the formula, rather than an unlimited set of exact calculated colours.
- No limbs, faces, clothing, or accessories were drawn or repainted with Python. Processing only performed keying, stray removal, proportional reduction, palette snapping, outlining, framing, sheet/GIF assembly, and checks.
- Automated checks passed for all expected filenames, original PNG readability, sprite dimensions, final height and foot row, binary transparency, palette limit, absence of retained bright magenta, sheet dimensions/background, and GIF frame counts/timings/pixel agreement. Details are in `scratch/checks.json`; the processing script and prompt log are also there.

## Honest weaknesses

- The compact proportions are much closer to the requested range than the rejected first design, but the large cap, feather, hair and eyes still make him look quite youthful. He is less anatomically adult-looking than a stricter interpretation of the brief.
- The skin reads warm golden tan rather than distinctly olive. The earth palette keeps the set coherent, but does not fully resolve that colour mismatch.
- Side views retain some three-quarter presentation in the chest and shoulders while the face points right. They are not perfectly orthographic profiles.
- The front walk has a restrained, somewhat shuffling step. Its contact/passing differences are small, and the two halves of the cycle are not perfectly symmetric. The back contact poses also differ in apparent stride depth.
- The side cycle is clearer after redrawing, but opposite-leg identity remains partly ambiguous in the similarly coloured trousers. Small changes in hand shape, sleeve folds, boot shape, and torso width may shimmer in motion. Bounding-box centering also leaves slight horizontal movement of the upper body.
- The lute stays on the same shoulder in the accepted front and back sets, but its thickness, neck angle and attachment are not mechanically exact across directions. In the front view the neck and diagonal strap visually merge at the shoulder.
- Box reduction loses some facial, hair and lute detail. At 3× the pixels remain crisp, but the underlying colour clusters can look softer and busier than carefully hand-authored low-resolution pixel art. No claim of perfect animation continuity or game-runtime testing is made.

## Workspace scope

All task file reads, inspection, scripts, intermediates and delivered files were confined to this folder. The image service reported its own automatic cache paths outside the folder; those paths were not opened, read, listed or copied. Originals here were saved directly from the image bytes returned by the tool.
