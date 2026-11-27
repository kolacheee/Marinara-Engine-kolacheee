# Nemi Vos — review redraw 3

Replaced all 15 originals in `big/`, all 15 sprites in `sprites/`, the sprite sheet, three walking GIFs, front face crop, front-versus-sheet comparison, and three 6x head comparison boards.

## Latest review

The tome is gone from every view. Nemi grips a slender charcoal staff in his anatomical right hand, with a bright, faceted steel-grey crystal in a small fork mount. The crystal stays below the hair crown, preserving 92 occupied rows. Its pale core conveys light without a blurred halo or extra palette colours. The left hand remains empty. The staff is on the viewer's left in front views and right in rear views; in profile it follows the original book-hand swing.

Retained the short, slight adult build, deep skin, swept charcoal hair with a grey front lock, linen-trimmed plum mantle, cropped diagonal jacket, waist band, belt/pouch, low full trousers, ankle bindings and leather shoes. Original standing and walking images supplied each view's pose and costume. The grip necessarily changes to hold the shaft, and minor contour/fold differences remain from the redraws.

## Image redraws and references

Used the built-in image tool for 17 requests: 15 full-view edits, starting with the right-facing side, plus two pose corrections. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. All other image references were existing or newly revised images of Nemi. Exact prompts are saved in `../scratch/review3/prompts.json`.

The full-view edits redrew the heads with substantial hair clusters, smooth skin planes, dark eyes with small light catches, broad brows, short nose marks and quiet mouths. `walkfront2` was directed toward the approved front face to reduce its earlier expression difference. Rear views show only hair, ears and nape.

The first `walkside3` edit straightened the arm and lowered the lifted foot; an additional image edit restored the bent elbow and forward lifted foot. The first `walkfront3` edit swapped the planted foot; a second image edit restored the screen-right planted leg and screen-left lifted leg. Rejected versions are in `../scratch/review3/`. Incoming originals, sprites and notes are preserved in `../scratch/review3/originals/`.

## Reduction and skin/hair finish

`../scratch/process.py` keys magenta, crops and BOX/area-reduces each original, maps colours by material, makes alpha binary and centres the equipped silhouette in a 96x128 frame. Crown row is 33 and lowest sole row is 124. Facial features and anatomy were drawn by the image tool, not painted with code.

Skin maps to the deep-skin ramp, hair to charcoal/steel, and remaining materials to the prescribed other ramps. Source colour and position identify the masks; inspected staff-head exclusion regions keep the crystal and mount out of skin/hair cleanup. Eye/brow detection is restricted to the face, and profile mouth protection extends to the front edge of the jaw. These are estimated masks rather than hand-labelled segmentation.

After palette snapping, one simultaneous despeckle pass runs only inside skin and hair masks. A pixel must differ from all four direct neighbours before it can take the most common same-mask colour in its 3x3 neighbourhood. Feature pixels, darkest edge pixels, silhouette boundaries and mask boundaries are protected. Clothing and equipment do not receive this filter. The pass replaced 44 skin pixels and 203 hair pixels across the set, with zero protected-feature changes. Per-view counts are in `../scratch/checks.json`; masks and before/after reductions are in `../scratch/review3/masks/`.

The final set uses 24 opaque colours total: plum, charcoal, linen, leather, steel and deep skin. The only added ramp remains plum: `#352A32`, `#51404C`, `#766071`, `#A08C9A`. No new ramp was introduced for the crystal.

## Visual review and validation

Inspected every final head at 6x beside Wren, Hadrik and noble crops from rows 33–63. The delivered boards are `mage-heads-front-6x.png`, `mage-heads-side-6x.png` and `mage-heads-back-6x.png`; each contains the standing view and four walking views, with all three reference faces repeated beside each. Also inspected the final front at 3x beside the three reference fronts in `mage-vs-sheet.png`, the complete sheet, and decoded frame strips from all three exported GIFs.

The faces have smooth cheek planes, readable eyes/catches and short mouth marks at export size. Rear heads remain faceless. The crystal staff and trimmed mantle give the mage a distinct role and layered silhouette beside the references. Nemi retains broader, quieter trouser planes and his deliberately slender build.

Automated checks pass in `../scratch/validation.json`: 15 originals and 15 RGBA sprites at 96x128; binary alpha; occupied rows 33–124; centred silhouettes; 24 shared allowed colours; 1152x1536 sheet; 1152x384 front comparison; 288x186 front face crop; three 288x384 GIFs with four frames each at 160 ms. Additional checks confirmed all 15 original files changed and all three 1152x1050 head comparison boards exist.

## Remaining limitations

Independent redraws still vary slightly in eye-catch shape, brow-to-eye spacing, grey-lock shape, mantle folds and staff length/angle. Some hair and overlap contours are thicker than one logical pixel. The staff partly overlaps the rear hair outline in profile, and its diagonal shaft blends with the trousers in parts of `walkside2`, although the crystal remains visible. The corrected `walkfront3` lifted foot sits a little higher than in the incoming frame. The crystal reads as a bright magical gem with a hard pixel edge, not a soft luminous aura. These are not pixel-identical animation cels and have not been tested in a game engine.

All task artifacts, prompts, backups and processing changes are inside this character folder. The image service also retains its automatic generation cache.
