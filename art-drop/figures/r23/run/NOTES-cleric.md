# Asen Tor — cleric, Round 23

## Delivered

- Fifteen individual image-tool originals on magenta in `big/` and fifteen transparent sprites in `sprites/`.
- `cleric-sheet.png`: 1152 × 1536, exact 3× nearest-neighbour display, background #4a4642. Rows are standing front/side/back, walk-side 0–3, walk-front 0–3, walk-back 0–3. The fourth standing cell is empty.
- Three 288 × 384 walk GIFs, four frames each, 160 ms per frame, looping, on #4a4642.
- `cleric-face.png`: 6× front crop, source columns 28–67 and rows 33–62.
- `cleric-vs-sheet.png`: Asen, Wren, Hadrik and Noble fronts at 3×.

## Process and checks

Every figure and pose was drawn individually with the built-in image tool. No figure, face, limb or animation pose was drawn or transplanted with code. The side was generated first; every later view used this run's side reference. Every image-tool request attached STYLE-SHEET.png with the required style-only instruction. Only that sheet and this run's Asen originals were supplied as image references. The reference front sprites were used for the requested comparisons.

Python/Pillow performed magenta keying, BOX area reduction, anatomy-restricted skin masks, palette snapping, binary alpha, conservative isolated-pixel skin/hair cleanup, placement, crops, sheets, GIFs and checks. Facial-feature bands and contour pixels were protected during despeckling; this deliberately leaves some imperfect pixels near features. No face was painted in code. Hand masks were corrected after an early broad mask accidentally included some linen/case pixels. Final mask inspection shows separated head/neck and hand regions, without those case/cloth patches.

All fifteen sprites are 96 × 128 RGBA, with crown at row 33 and lowest occupied sole at row 124. Rows 0–32 and 125–127 are transparent. Alpha is exclusively 0 or 255. The equipped silhouette is horizontally centered within pixel rounding. The set uses 21 distinct opaque RGB colours, all drawn from the six allowed charcoal, leather, linen, navy, steel and tan ramps; no added ramp. The stored originals retain the image tool's source colours rather than the export palette. All three GIFs decode to four frames at 160 ms each.

The originals were visually inspected when returned. The complete final sheet, front face crop, comparison, standing-head comparison, all face-bearing views, skin-mask sheet and all decoded GIF frames were inspected at their saved display sizes. Diagnostic comparisons, rejected originals, processing scripts, checks and prompts are in `../scratch/`. The exact retained prompt set is `../scratch/prompts.json`; final technical checks are `../scratch/final-checks.json`.

## Redraws

There were 23 image-tool drawings for 15 retained views:

1. The initial side's brown medicine case and bulky hair were redrawn into a pale linen case and closer hair band.
2. After reduction, the standing side was redrawn with a larger head and clearer profile eye. Front and back were regenerated to match. These three replaced the first standing set.
3. Walk-side 2 was redrawn because it repeated the first contact frame's near-arm position; the replacement swings the near arm forward.
4. Walk-back 2 was redrawn because the trailing shoe extended below the planted support sole.
5. Walk-side 0 and 2 received additional full-figure face-pass redraws after the enlarged-head check showed noisier reduction.

## Honest weaknesses and incomplete visual rules

- Exact parity with the reference sheet's craft was not achieved. Asen is visibly distinct, with a narrower silhouette, bald crown, small chin beard, pale open-sided tabard and rigid waist case, but the references have more deliberate pixel clusters and stronger eye contrast.
- Both front eyes and the profile eye survive, with readable brows and beard/mouth structure. However, small light catches are inconsistent after area reduction and palette snapping; several front views have subdued eye interiors. The strict Round 23 eye-catch/clarity target is therefore only partially met despite the face redraws. The side contact faces remain busier than the standing profile.
- Head height is approximately 20–22 occupied pixels rather than an exact 23, so the four-head construction is approximate. The shaved crown is clear, but the rear hair band still looks thicker than truly close-cropped hair.
- The front nose is a small warm mark rather than a fully articulated 2–3-pixel light/shadow plane in every frame. The side nose projects more than one pixel in some exports.
- Some hands are approximately 5–7 pixels across or tall, exceeding the earlier 3–5-pixel target. They remain empty, compact mitten shapes.
- The layered tabard, navy binding, heavy hems, belt and piped linen case supply the added costume detail. The result is still more austere and flatter through the front cloth than the richer reference figures. Charcoal tunic/trouser boundaries can merge in profile.
- The side cycle alternates contact/passing silhouettes and arm direction, but anatomical near/far leg overlap is not perfectly explicit in both contact frames. Some strides are a little longer than the intended quiet shuffle. Front/back passing movement is subtle.
- Independent drawings and reduction produce slight head-width, case, clasp, hem and outline shifts between frames. The four-frame loops are usable previews, not fully stabilized production animation. Centering the complete changing silhouette also permits small torso shifts.
- Contours are mostly continuous but are not uniformly one pixel; some dark overlaps are thicker and some lit edges are softened by area reduction. Source highlights are mainly upper-left, with a few centered crown/case highlights.
- The strict folder-only instruction was not fully achievable in this environment: one runtime image-generation skill instruction file was read outside the project, and the image tool automatically saves its own outputs in its managed external cache. No external character art, sprites, Downloads folders or repositories were read or listed. Returned image bytes were saved directly into this project's folders without reading those cache paths. All task-created processing files and retained deliverables are inside this folder, with intermediates in `scratch/`.
