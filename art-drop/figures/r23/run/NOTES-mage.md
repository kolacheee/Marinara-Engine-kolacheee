# Nemi Vos — review redraw

Replaced all 15 originals in `big/`, all 15 sprites in `sprites/`, the sheet, three GIFs, front face crop and front-versus-sheet comparison. This review pass used the built-in image tool for 19 requests: 15 full-view edits, three corrections to side walking poses, and a further head-only redraw of `walkfront2` after the 6x face comparison.

## Review changes

Added a compact plum shoulder mantle with a narrow linen border. Enlarged the charcoal book into a conspicuous tome with bright page edges and a steel clasp. It stays in Nemi's anatomical right hand, with the left empty. The luminous effect is restrained to the page edges; it does not have a surrounding glow. The book is held just beside the hip, rather than presented at arm's length, to retain the requested arm poses.

Preserved the slight adult build, deep skin, compact swept charcoal hair with one grey front lock, short diagonal jacket, linen waist band, belt/pouch, low inflated trousers, ankle bindings and leather shoes. The original standing and walking poses were the edit targets. The first edits of `walkside1` and `walkside3` shifted the lifted foot backward; `walkside2` moved the book arm backward. Additional image-tool corrections restored the original foot positions and forward book-arm swing.

Every image request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. Other image references were exclusively the existing Nemi originals and this pass's revised Nemi images. Exact prompts are in `../scratch/review/prompts.json`. The incoming originals, sprites and previous notes are preserved in `../scratch/review-originals/`; rejected review variants are in `../scratch/review/`.

## Reduction and cleanup

The image tool drew the heads, costumes, props and poses. Python keyed magenta, cropped, BOX/area-reduced to 92 occupied rows, mapped material colours, applied binary transparency and assembled exports. No facial features or anatomy were painted with code.

Skin maps only to the deep ramp; hair maps to charcoal/steel. Source skin shading is calibrated per image before palette mapping, so small source-colour changes do not introduce scattered cheek highlights. Dark eye/brow marks, light eye pixels and source mouth marks are detected and protected from cleanup. The masks use source colour and head/body position; they are estimates, not manually labelled segmentation.

After palette snapping, skin and hair receive one simultaneous isolated-pixel cleanup pass: a pixel must differ from all four direct neighbours, then takes the most frequent colour in its same-mask 3x3 neighbourhood. Feature pixels, darkest edge colours, silhouette boundaries and mask boundaries are protected. Clothing and equipment do not receive this filter. Per-view replacement counts are in `../scratch/checks.json`.

The final set uses 24 opaque colours, all from the prescribed plum, charcoal, linen, leather, steel and deep-skin ramps. The only additional ramp remains plum: `#352A32`, `#51404C`, `#766071`, `#A08C9A`.

## Inspection and verification

Inspected every final head at 6x beside all three supplied reference faces, cropped from rows 33–63. The comparison boards are delivered as `mage-heads-front-6x.png`, `mage-heads-side-6x.png` and `mage-heads-back-6x.png`; each includes the standing view and four walk views. Rear heads have no facial features. Also inspected the 3x front comparison, full sprite sheet and decoded GIF frame strips.

Automated checks pass (`../scratch/validation.json`): 15 originals and 15 96x128 RGBA sprites; binary alpha; crowns at row 33 and lowest soles at row 124; silhouettes centred within half a pixel; prescribed palette only; 1152x1536 sheet; 1152x384 comparison; 288x186 face crop; three 288x384 GIFs with four frames at 160 ms each.

## Remaining limitations

The mantle and enlarged tome improve the costume's layering and prop readability beside the reference fronts. Nemi remains visibly slimmer and uses broader cloth planes than the reference characters. The tome reads more strongly as a bright-edged book than as an overt magical effect.

Facial features are clearer and cheeks are smoother, but exact eye-catch brightness and a fully separate one-pixel brow are not uniform across every frame. `walkfront2` retains a stronger nose plane and slightly different expression after its head redraw. Some hair and overlap contours remain two pixels thick. Small changes in mantle folds, book size/angle, grey-lock shape and horizontal centring remain between independently edited walk frames. These are not pixel-identical animation cels, and the GIFs have not been tested in a game engine.

All authored task files and intermediates are inside this folder. The required installed image-tool skill was read outside it; the image service also maintains its automatic cache. Returned image bytes were written directly into this folder, without using outside artwork.
