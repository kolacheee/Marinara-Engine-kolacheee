# Mirel Sorn — bard

## Delivered and checked

- Fifteen separate image-tool originals in `big/`, each containing one full-body figure on magenta; fifteen corresponding transparent sprites in `sprites/`.
- Every sprite is 96 × 128 RGBA, uses binary alpha, starts at occupied row 33, and has its lowest supported sole at row 124. Rows 0–32 and 125–127 are transparent. The complete equipped silhouette is horizontally centred to the nearest pixel.
- The combined sprite palette contains 23 colours, all from the six permitted charcoal, leather, gold, linen, steel and fair ramps. No added ramp, pure black or pure white.
- `bard-sheet.png` is 1152 × 1536, exactly 3×. Its rows are standing front/side/back, walkside 0–3, walkfront 0–3, and walkback 0–3. Background is #4a4642.
- All three GIFs are 288 × 384, four frames, 160 ms per frame, looping, on the same background. Their decoded frames were inspected in sequence strips.
- `bard-face.png` is the front crop covering logical rows 33–60, enlarged 6× without smoothing. The sheet and face crop were inspected at their full saved dimensions.
- All five frontal faces have two isolated charcoal eye pixels with fair-skin pixels immediately on both horizontal sides. Each of the five profiles has one such visible eye. No glints were added. The back views show no face.

## Drawing and reduction

The built-in image tool drew every figure, including every redraw. There were 25 drawings in total, of which 15 are selected for delivery. No existing sprite or external reference image was used. The side was established first; every other view included that side drawing as its reference. Corrected front walks additionally used this run's corrected front drawing.

Python/Pillow was used only for magenta keying, skin/material masks, BOX area reduction, palette snapping, binary transparency, placement, sheets, crops, GIFs and checks. No eyes, facial features, limbs, costumes or poses were painted or assembled in code. Face-region skin coverage was adjusted during palette snapping to prevent partially covered eye-edge pixels from incorrectly becoming gold or linen. The actual dark eye marks come from the source drawings.

Intermediate drawings, reduction/check scripts, reports and the complete prompt specification are in `../scratch/`, especially `prompt-set.json`, `process.py` and `check-report.json`.

## Redraws

- The initial side was too elongated. Three side redraws explored head/body proportions; one overcorrected the head size and was rejected.
- The standing front was redrawn for clearer eyes, a visible charcoal strap and the correct skirt direction: high at the viewer's left knee, low at the viewer's right ankle.
- All four front walks were redrawn using that corrected front, repairing inconsistent/reversed hems and improving face consistency.
- The standing side and side-walk passing frame 1 received additional image-tool face passes because their reduced eyes were weak.
- All selected originals and all reduced views were visually reviewed. Weak versions were retained only as scratch intermediates.

## Honest weaknesses and rules not fully met

This is a complete deliverable set, but it is not a claim of exact artistic compliance with every written rule.

- Head proportions still vary slightly: some profiles and rear views are closer to roughly 4.5–4.8 heads than a strict four-head construction. The front heads are larger than the original locked side. Crown-to-chin is not uniformly 23 pixels.
- The long skirt corner sometimes stops above the ankle, and the short edge is not identically knee-high in every view. The corrected front/rear diagonal direction is consistent, but hem length and folds still drift.
- The front strap reads clearly. Side straps merge into dark/brown clothing boundaries, and the rear drawings do not clearly show the required diagonal strap across the back. The generated dark neck band can read as a choker.
- The bob is recognisable, but its four sections are not equally clear in all views. Rear highlight/lock shapes vary, and the front redraws expose both ears rather than showing only the specified right-side tuck.
- Front noses are more strongly vertical than the requested small warm plane. Mouth shadows remain readable but are wider and softer than the strict 1–2-pixel target. Eyebrows can merge with nearby shadow clusters. Fine hand anatomy and thumb notches are not uniformly legible after reduction.
- The walks are restrained but somewhat stiff. Side contact frames 0 and 2 are too similar to prove an unambiguous exchange of the anatomical legs under the skirt. Head, skirt and equipment registration drifts slightly between individually drawn frames; some foot sliding and a small head-size pulse remain. Rear hair shading also flickers.
- BOX reduction followed by snapping introduces some isolated pixels and uneven local outline thickness. The result is less clean than a fully hand-authored native-resolution sprite. Skin-mask boundaries at tiny ears, hands and garment overlaps are approximations, despite the explicit fair-ramp face treatment and eye-neighbour checks.
- A literal demand for two eyes in profile was interpreted anatomically: one visible eye in a strict side view, two in front.

## Folder-boundary qualification

No other character art, Downloads folder, repository contents or existing sprites were read. One installed image-generation instruction file outside this folder was read because the runtime required that skill workflow. The image service also automatically saved its generated images outside this folder; delivery copies were written here from the returned image data, without opening those external files. Thus the absolute requirement that nothing whatsoever be read or saved outside this folder was not fully achievable in this tool workflow.
