# Nemi Vos — Round 23 production notes

Delivered 15 image-tool originals in `big/`, 15 transparent sprites in `sprites/`, the four-row 3x sheet, three four-frame walk GIFs, the 6x front face crop, and the 3x comparison against the three reference fronts.

## Design and references

Nemi retains deep skin, a slight build, charcoal hair with a steel-grey front lock, a short plum diagonal jacket, a narrow linen waist band, low full trousers, charcoal ankle bindings and leather shoes. The small closed charcoal book stays in his anatomical right hand: viewer left in front views, viewer right in rear views, and the near hand in right-facing profiles.

Round 23 costume enrichment uses a layered linen collar and cuffs, linen piping and hems, a narrow leather belt and one small right-hip pouch. No cloak, hood, trailing sash, robe, staff or runes were introduced. Linen trim takes precedence over the generic ochre-trim suggestion because gold is outside this character's exhaustive palette.

Every generation request attached `style-ref/STYLE-SHEET.png` with the required style-only instruction. The only additional image references supplied to the image tool were Nemi drawings from this run. The three supplied reference fronts were used for the required comparisons, not as character designs.

## Drawing and reduction

All figures, poses and facial features were drawn with the built-in image tool. Python performed magenta keying, bounding-box cropping, BOX/area reduction, palette mapping, mask-limited isolated-pixel cleanup, local-colour contour repair, sheet/crop/GIF assembly and checks. It did not draw replacement faces, anatomy, props or walk poses.

The originals are retained without recolouring in `big/`. Source colours vary slightly and are not themselves palette-constrained. The sprites map skin to the deep ramp, hair to charcoal/steel, and plum cloth to the four designated plum tones. Material-aware palette mapping was necessary: unrestricted nearest-colour snapping incorrectly mapped some source plum cloth to leather brown. Skin and cloth source shading roles were mapped into their respective target ramps. Skin/hair cleanup uses a single 3x3 same-mask neighbourhood pass for isolated colour outliers, protecting detected facial features and silhouette boundaries. These masks are colour-and-position estimates rather than hand-labelled ground truth.

Only the prescribed six ramps are available: plum, charcoal, linen, leather, steel and deep skin. The final set uses **22 distinct opaque RGB colours in total**, within the 24-colour permitted palette and the 32-colour limit. The additional plum ramp is `#352A32`, `#51404C`, `#766071`, `#A08C9A`; no other ramp was added.

## Redraws

There were 22 image-tool requests: 15 delivered views and seven additional attempts.

- The first standing side and front had undersized heads and weak eyes after reduction. Both were redrawn with approximately four-head proportions and clearer eye/brow clusters. The corrected side became the reference for subsequent views.
- `walkside3` initially extended the passing foot too far forward. It was redrawn with the lifted foot close to the supporting ankle.
- The first `walkback1` request returned two figures and was rejected. Its replacement moved the pouch to the wrong hip; a second correction restored the pouch above the right-hand book.
- `walkfront2` and `walkside1` received further image-tool face passes after the enlarged comparison revealed weaker eye/cheek construction.

Rejected versions, exact prompts and processing scripts remain in `../scratch/`. The prompt archive is `../scratch/prompts.json`.

## Verification

All 15 final sprites were inspected individually at 3x. All generated originals, including rejected attempts, were visually reviewed. The full sheet, front face crop, front-versus-reference sheet, six-head comparison, and face-bearing walk-head comparisons were inspected at their saved sizes. The final GIFs were decoded and every encoded frame inspected in full-size strips; they were not assessed in a game engine.

Automated checks pass:

- Exactly 15 originals and 15 sprite PNGs, with every required view name.
- Sprites are 96 × 128 RGBA with binary alpha.
- Crown at row 33 and lowest support sole at row 124 in every frame; 92 occupied rows.
- Complete silhouette bounding boxes are horizontally centred within half a pixel.
- All opaque sprite colours belong to the prescribed palette; no pure black, pure white or magenta remains.
- Sheet: 1152 × 1536 on `#4a4642`, ordered standing front/side/back, walk-side, walk-front, walk-back.
- Comparison: 1152 × 384, with Nemi and all three supplied reference fronts at 3x.
- Face: 288 × 186, cropped from logical columns 24–71 and rows 33–63, enlarged 6x without smoothing.
- GIFs: 288 × 384, four frames each, 160 ms per frame, looping, on `#4a4642`.

Detailed results: `../scratch/validation.json`.

## Honest weaknesses and limits

The result is not a perfect pixel-for-pixel match to the reference sheet's craft. Nemi's cloth planes are somewhat cleaner and broader, while the small belt/cuff transitions are denser. Some dark contours are thicker than the intended single-pixel edge, especially around hair and overlaps. Lighting generally favours screen upper left, but the source drawings retain some almost symmetrical shoulder accents.

The eyes and mouths survive, but eye catches vary in brightness between walk frames; brow and upper-eye clusters sometimes merge. The precise 2×2–3-pixel eye construction and consistently separate one-pixel brow were not achieved uniformly. Some nose planes become understated after reduction. Facial proportions, cheek shadows and the apparent grey-lock size still vary slightly between independently drawn views. The faces are not as consistently economical as the reference faces.

The side cycle has noticeable changes in trouser folds, book angle and silhouette width. Centring each complete equipped silhouette also introduces some horizontal head/pelvis movement across the cycle. The front and rear cycles have restrained arm movement and comparatively similar contact/passing silhouettes. The rear shoes can read more like simplified shoe blocks than clearly constructed heels. The book is small but partly obscured by its mitten grip at sprite scale.

A workflow exception to the folder-only request was unavoidable under the session's higher-priority instructions: the installed image-generation skill instructions were read outside this folder. No outside artwork, sprites, repositories or other Downloads folders were read or used. The image service automatically retained its own generated-image cache outside this folder; the returned image bytes were saved directly into this folder without opening those cached files. All task scripts, intermediates, references used by the artwork and delivered files are within this folder.
