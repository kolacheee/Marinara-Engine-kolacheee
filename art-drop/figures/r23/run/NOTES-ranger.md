# Sere Venn — Review redraw 2

Applied the final **Review redraw 2** in CHARACTER.md, together with the overriding face and finish rules in STYLE-RULES.md. The previous delivery had only a brown coat and small saw; it did not implement the final equipment/mantle review.

## Design and preservation

All 15 views now have a muted **plum hooded mantle with the hood down**, a shortbow in the anatomical **left** hand, a leather quiver above the **right** shoulder, and leather bracers. The small folding pruning saw remains in the right hand, closed. The underlying leather coat, shoulder wedge, split hem, linen shirt/cuffs, narrow moss belt, sheath, charcoal trousers and ankle boots remain recognizable. Sere remains the specified short, wiry, deep-skinned woman with cropped swept-back charcoal hair; the review's pronoun did not replace her identity.

The original view for each frame was the pose reference. Standing directions and all twelve walking leg poses were retained. The left forearm bends to grip the new bow, and the mantle necessarily covers portions of the existing costume. These are full-view redraws, not pixel-identical body transplants: small contour, fold and registration differences remain.

The added plum ramp is the already specified muted brown-violet ramp: `#352A32`, `#51404C`, `#766071`, `#A08C9A`. The allowed palette has seven four-tone ramps (28 available colours); the finished set actually uses **25 opaque colours**, below the 32-colour limit. The other ramps are charcoal, leather, linen, moss, steel and deep skin.

## Image-tool redraws and face review

Used the built-in image tool for **18 requests**: 15 full-view redraws, two targeted closed-saw corrections (`side` and `walkside2`), and one additional eye redraw (`walkside0`). The right-facing standing side was made first and used as the new costume master. Every request attached `style-ref/STYLE-SHEET.png` with the required exact STYLE-ONLY instruction. The only other image references were the existing Sere images and new Sere redraws in this folder.

The heads retain heavy separate brows, the pale anatomical-right brow notch, a blunt nose plane, quiet mouth, square jaw and three broad charcoal hair locks. Fronts show both eyes; profiles show one; rear views show only hair, ears and nape. Faces use broad skin planes rather than fine wrinkles or texture.

Every finished head was inspected at **exact 6× beside Wren, Hadrik and Noble**, using rows 33–63 inclusive. The first reduction of `walkside0` lost its dark pupil, so its eye was redrawn larger with the image tool. Its brighter source skin also needed adjusted palette-role centres to avoid noisy transitions; the exported colours still use only the specified deep-skin ramp. The final profile retains a dark eye cluster and light catch. The final eye-region check finds dark pixels and skin-light pixels in all 15 visible eye regions across the ten face-bearing views. Region counts support, rather than replace, the visual review.

Also inspected the complete 3× sheet and the 3× front comparison. The plum mantle, compact bow, quiver and bracers now read as ranger equipment, and the cropped charcoal hair, deep skin, narrow build and brown/plum costume distinguish Sere from the three reference characters.

## Reduction and cleanup

Current processing lives in `../scratch/review2/process.py`, with material-region data in `../scratch/review2/regions.json`.

- Range-keyed the magenta background, including dark magenta edge contamination.
- Used BOX/area reduction with an isotropic grid, then placed each figure in a 96 × 128 frame, crown at row 33 and lowest sole at row 124.
- Segmented skin and hair; skin snaps only to the deep ramp, and non-skin pixels never snap to skin. Existing dark facial ink and pale facial marks are separately area-reduced to preserve their generated shapes. No face features were painted with code.
- Kept the plum mantle distinct through material-aware palette mapping and the trousers/hair in the charcoal ramp.
- Ran one simultaneous skin/hair despeckle pass after palette snapping. Only pixels differing from all four direct neighbours are eligible; replacement is the most common colour in their same-mask 3×3 neighbourhood. Material borders, outer contours and eye/brow/mouth regions are protected. Ties preserve the current colour where possible. This changed **68 skin pixels and 171 hair pixels** across the set. Clothing is not smoothed by this pass.

## Replaced delivery

- `big/ranger-<view>.png`: 15 selected image-tool originals, 1024 × 1536, on magenta.
- `sprites/ranger-<view>.png`: 15 transparent 96 × 128 RGBA sprites.
- `ranger-sheet.png`: exact 3× on #4a4642; standing front/side/back, then side/front/back walk rows.
- `ranger-walkside.gif`, `ranger-walkfront.gif`, `ranger-walkback.gif`: exact 3×, four distinct frames each, 160 ms per frame, looping.
- `ranger-face.png`: front rows 33–60 inclusive, exact 6×.
- `ranger-vs-sheet.png`: full front beside the three reference fronts, exact 3×.
- `ranger-heads-vs-sheet.png`: all 15 heads at exact 6×, each beside the three reference heads.

Verified binary alpha, canvas size, crown/sole alignment, palette membership, all 15 source and sprite replacements, four distinct frames per GIF, and decoded GIF pixels matching the final 3× sprites exactly. Reports are `../scratch/review2/final-checks.json`, `reduction-report.json` and `eye-checks.json`. The full request text is retained in `../scratch/review2/prompts.json`. Previous originals, sprites and notes are preserved under `../scratch/review2/`; superseded saw/eye redraws are retained there too.

Rebuild from the selected originals:

```sh
PYTHONWARNINGS=ignore python scratch/review2/process.py > scratch/review2/reduction-report.json
PYTHONWARNINGS=ignore python scratch/review2/assemble.py
PYTHONWARNINGS=ignore python scratch/review2/verify.py
```

## Honest limitations

The deep-skin light tone is restrained, so catches and nose planes have less contrast than the fair-skinned reference faces. Brow-notch width and eye shape vary slightly between independently redrawn frames; the corrected side-contact eye is squarer than the other profiles. Exact age and femininity remain subtle at this size.

Coat trims, bracer bands and equipment overlaps remain denser than the broadest reference cloth planes. The bow is compact and close to the body, especially in front views. Small walk-cycle fold changes and foot slide remain; this is not a hand-tuned animation cleanup. Semantic masks approximate material boundaries, especially around tiny grips. The source originals contain more colours and fine source variation; strict palette and alpha guarantees apply to the exported sprites.

All local processing, backups and saved deliverables stayed inside this character folder. The image service additionally reported automatic cache copies outside it; those cache files were not opened or used. Returned image data was saved directly into this folder.
