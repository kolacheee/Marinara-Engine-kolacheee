# Enna Kes — elder, Round 23

Delivered all 15 source drawings and 15 reduced sprites, the four-row sheet, three walking GIFs, the front face crop, and the comparison against the three reference fronts. This is a complete file set, but it is **not an exact visual match to every rule**; the remaining limitations are listed below.

## Production and checks

- The right-facing standing side was drawn first. Every subsequent request attached this run's side image; every request attached `style-ref/STYLE-SHEET.png` with the required style-only instruction. No reference character was used as Enna's design.
- There were 26 image-tool requests: 15 final views and 11 replacement attempts. The final unmodified 1024 × 1536 tool outputs are in `big/`. Earlier versions, scripts, semantic-mask audits, prompt records and check results are in `../scratch/`.
- `../scratch/prompts.json` records the complete prompt set. The built-in image tool drew every figure. Python performed background keying, box reduction, palette mapping, limited skin/hair cleanup, assembly and checks. No facial feature, body part or animation pose was drawn or transplanted with code.
- All sprites are 96 × 128 RGBA with binary alpha, crown at row 33 and lowest occupied sole at row 124. Every figure occupies 92 rows and its complete silhouette is horizontally centered, within half a pixel.
- The complete sprite set uses exactly 24 opaque colours, all from auburn, charcoal, steel, leather, linen and olive. No additional ramp was introduced. Skin and hair use separate semantic masks; dark facial features remain outside the skin-tone mapping. Masks combine inspected source regions and colour tests, so their accuracy is visual rather than formally guaranteed at every boundary pixel.
- Auburn palette mapping uses the same four source-value bands across all views to avoid unstable shade changes. This is colour quantization, not cloth smoothing. Only isolated interior skin/hair pixels receive the specified neighbourhood cleanup; eye, brow, mouth and contour regions are protected.
- `elder-sheet.png` is 1152 × 1536, with 3× nearest-neighbour sprites on #4a4642. Rows are standing front/side/back, walk-side 0–3, walk-front 0–3, walk-back 0–3.
- All three GIFs contain four distinct 288 × 384 frames at 160 ms each, looping indefinitely. They use a solid #4a4642 preview background. Individual sprite PNGs retain transparency.
- `elder-face.png` is a 6× crop of front rows 33–63. `elder-vs-sheet.png` places the front beside wren, hadrik and noble at 3×. The standing front/side/back head comparison at 6× is in `../scratch/head-comparison.png`.
- Every tool drawing was visually inspected. The final sheet, face crop and reference comparison were opened at their full exported size. Every reduced pose and head was examined in enlarged inspection sheets; all decoded GIF frames were inspected and their timing checked programmatically. This was frame-by-frame review, not a claim of watching real-time playback.

## Redraws

1. The initial standing side and front fans were too spread. Both were redrawn as a closed parallel-rib bundle.
2. The standing side received one face-pass redraw for a larger head, simpler skin planes and clearer eye/mouth.
3. The standing front received two face-pass redraws. The first reduction had crowded cheek marks and weak eyes; the second increased head width and strengthened the mouth and eyes.
4. Walk-front 1, 2 and 3 each received a face-pass redraw for stronger mouths and cleaner broad planes. Walk-front 1 also had noisy coat shading.
5. Walk-back 2 received three redraw attempts. The initial shading broke into noisy clusters after quantization. Two replacements changed the coat values too much; the final attempt used the standing rear drawing as the edit target to restore its folds and palette relationships.

## Honest weaknesses and rules not fully met

- The faces remain softer and less crisply constructed than the reference faces. Both front eyes survive, but their tiny catches are faint or lost in several reduced views. I cannot claim that every eye is an exact clean 2×2–3 px cluster with a clearly retained catch. Mouths survive unevenly, with walk-front 1 and 3 still weaker than the standing front. Repeated image-tool face passes improved this without fully solving it.
- Simplifying the face for readability reduced some of the original age cues. Enna can read as younger than 76, particularly in the front walking views. The profile is more convincing than the front.
- The upper-back stoop is visible but milder than the requested **deep** stoop. The coat does retain the rounded cocoon and contracted hem; its padded bulk also hides much of the spare limb anatomy.
- The cropped grey hair has substantial blocks, but the exact three stepped ear locks are not equally clear in every view. Some crowns are rounder than the requested flat crop.
- The source hand drawings contain more finger separations than requested, and some reduced mitten masses are approximately 6–7 pixels across rather than strictly 3–5.
- The closed fan becomes a narrow brown mark at sprite size, especially in profile, and can read as a small stick bundle rather than unmistakably as a folding fan. It remains in the anatomical left hand; its occlusion in rear views is intentional.
- The outfit adds layered overlap, bound edges, three toggles, a waist tab and patch pocket. Its final contrast is more subdued and its trim less finely resolved than the style sheet. Local contours are not uniformly one pixel after area reduction, and some isolated contour/crease pixels remain.
- Independent source drawings produce small differences in head size, hair highlights, coat folds, pocket position and hand scale between frames. These can create visible shimmer. Side contact frames 0 and 2 have similar boot silhouettes, so their opposite-leg assignment is less obvious than ideal under the long skirt. Passing strides are restrained but not a rigorously constructed animation cycle.
- Exact style parity with the reference sheet was not achieved despite redraws. The design is distinct from all three reference characters, but the reference faces and material separation remain more polished.

## Scope disclosure

No other artwork, existing sprites outside `style-ref/`, other Downloads folders or repositories were inspected. All project artifacts and intermediates were written here. One required installed image-generation instruction file was read outside this folder because a higher-priority runtime instruction required it; this is an exception to the requested filesystem-reading restriction. The image tool also automatically retained originals in its own default storage. The files delivered here were saved from the returned image bytes, without opening that external storage.
