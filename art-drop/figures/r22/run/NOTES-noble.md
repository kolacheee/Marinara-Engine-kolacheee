# Belis Dorn — noble

## Delivered

- `big/noble-<view>.png`: 15 selected, unmodified image-tool originals, one full figure each on magenta.
- `sprites/noble-<view>.png`: 15 transparent 96 × 128 RGBA sprites.
- `noble-sheet.png`: 1152 × 1536, nearest-neighbour 3× presentation on `#4A4642`. Rows are standing front/side/back, walk-side 0–3, walk-front 0–3, walk-back 0–3. The fourth standing cell is empty.
- `noble-walkside.gif`, `noble-walkfront.gif`, `noble-walkback.gif`: 288 × 384, four frames each, 160 ms per frame, looping, on the sheet background.
- `noble-face.png`: front crop from rows 33–60 inclusive, enlarged 6× without smoothing.

## Production and inspection

CHARACTER.md was read before STYLE-RULES.md. The initial right-facing side was drawn first and retained in `../scratch/noble-side-reference.png`. Every later generated view used that same-run side as a reference; targeted redraws also used this run's relevant pose and, for rear hair, its corrected standing back view. No external artwork was used.

All figures, poses and face changes were drawn with the built-in image tool. There were 37 full-figure generations: the original 15 views plus 22 corrective generations. Python performed magenta keying, area/BOX reduction, material-mask construction, palette snapping, composition and checks. It did not draw a body, pose, eye or mouth. Material masks were area-reduced with the source; colors were averaged within the selected material before snapping to that material's ramp. This avoided blending skin into cloth or light skin into dark eye marks. An initially overbroad hand mask was corrected after inspection showed it capturing skirt highlights.

Every generated original was visually inspected. Final sprites were inspected individually at native size and in the 3× sheet. The sheet and 6× face crop were opened at their delivered dimensions. All GIF frames were decoded, visually reviewed together, and compared pixel-for-pixel against their corresponding enlarged sprites. GIF inspection was frame-by-frame, not real-time playback.

The prompt set is in `../scratch/prompts.json`; processing is in `../scratch/process.py`; checks and their results are in `../scratch/verify.py` and `../scratch/final-checks.json`. Rejected originals and inspection intermediates remain in `../scratch/`.

## Redraw history and face pass

- Standing front and back were redrawn to remove an extra row of curls.
- All ten face-bearing views were redrawn after initial reduction weakened or lost eyes. The redraws separated eyes from brows and made source marks clearer.
- Standing side, walkside0, walkside1 and walkfront0 received a second face pass because the first correction produced oversized eye blocks.
- Walkside0 and walkfront0 received a third face pass after shrinking the marks caused them to disappear again. Small source-position changes restored legibility after area reduction.
- All four walking back views were redrawn to match the four-curl rear hair arrangement and improve the rear view of the boots.

Final checks find two visible eye components in each front view and one in each profile. Every component contains one or two dark charcoal pixels, with olive-ramp pixels on its left and right. There are no eye glints. Back views show no face. Mouth shadows remain visible, though their sizes and contrast are not completely consistent.

## Verified export properties

- All 15 sprites are 96 × 128 RGBA with only alpha 0 or 255.
- Every occupied bounding box starts at row 33 and ends at row 124 inclusive: 92 occupied rows. Rows 0–32 and 125–127 are clear.
- The combined opaque palette is exactly 24 colors, all from charcoal, linen, auburn, leather, steel and olive. No additional ramp was introduced; there is no pure black or white.
- Each GIF contains four distinct frames at 160 ms. Encoding preserves the sprite colors and pixels exactly.
- The petition remains in the anatomical left hand. In front views it is on the viewer's right; in rear views it is hidden in front of the torso. The right hand is empty.

## Honest weaknesses and rules not fully met

- **Frame-to-frame consistency is imperfect.** The head width, facial planes, collar, clasp, petition shape and fold positions vary slightly. The four-curl arrangement is consistent, but the curl contours are not locked pixel-for-pixel. The loops consequently have visible shape/shading flicker.
- **The walk is only approximately resolved.** The two side passing poses are too similar, and the near/far leg exchange is not as clear as it should be. Several rear boots still turn outward despite the rear-view redraw. Contact and passing phases are readable overall, but this is not a fully polished heel-to-toe animation.
- **The literal one-pixel face rule is not universal.** Several eyes have an adjacent second pixel, read as a lid or profile extension. Some mouth shadows are closer to three pixels than the requested one or two. The long nose and double chin are stronger in profile than in every front walking frame.
- **Hands are somewhat large.** Some reduced mitten masses are approximately 5–7 pixels rather than consistently 3–5, and the originals retain more finger divisions than requested. The closed petition grip is readable, but changes shape between frames.
- **Cluster discipline is uneven.** Some folds, hair, boots and facial transitions retain isolated pixels or short speckled edges after reduction. Broad planes dominate, but the strict prohibition on incidental single-pixel texture is not fully satisfied. A few dark seams are thicker than a one-pixel local outline.
- **Lighting and materials are approximate in the sources.** Upper-left light was requested consistently, but curl highlights and face planes fluctuate. The image-tool originals contain color drift and antialiasing, and their magenta is not guaranteed to be exactly `#FF00FF` at every background pixel. Range keying and exact palette snapping were applied to the exported sprites.
- **The folder-only workflow had two exceptions.** Session-required imagegen skill instructions were read from outside this folder. No outside character art, existing sprites, image references or repositories were read. The image tool also automatically saves its own managed copies outside the folder; delivered originals were saved here from returned image bytes without opening those managed files. All task scripts, review intermediates and deliverables were written inside this folder.

These files satisfy the verified export requirements, but the visual exceptions above mean they should not be described as exact compliance with every style rule.
