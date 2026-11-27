# Veska Rill — Round 23 review redraw

## Replaced deliverables

All 15 views have been redrawn and replaced in `big/` and `sprites/`. The 3× sheet, three 3× walk GIFs, 6× front face crop and 3× versus-sheet comparison have been rebuilt. `rogue-heads-vs-sheet.png` additionally puts **every one of the 15 heads at 6× beside Wren, Hadrik and the noble**, using reference rows 33–62. Rear views intentionally show no face.

The review changes are a narrower, more nimble silhouette, less bulky heads, clearer olive faces, smoother bare-arm planes, darker navy/charcoal jerkin, short navy scarf, a leather cross strap and a sheathed belt dagger. The original views and individual limb/foot poses remain the guides. The asymmetric sleeves, guarded left arm, left-hand prybar, knee breeches, exposed calves, low shoes and belt pouch remain.

## Drawing and final head pass

This redraw used 20 built-in image-tool requests: 18 full-figure requests, including three additional attempts, and two focused head-only drawings. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. The only artwork references were that sheet and this character's own images.

The first full-figure front received another face pass. A rear standing result with misplaced front-facing buckles and a rear passing result with swapped arms were rejected and redrawn. These rejected versions are retained in `../scratch/review/`.

The first complete 6× audit still exposed weak mouths in some front-walk reductions and noisy ear/cheek shading in profiles. Two new, enlarged head-only sources were therefore drawn with the image tool. The front source is shared by standing front and all four front-walk frames; the profile source is shared by standing side and all four side-walk frames. These heads were independently area-reduced, palette-snapped and despeckled, then composited onto the corresponding bodies. No eye, brow, nose, mouth, hair lock or limb was painted by code. Reusing the generated heads removes facial flicker while retaining each body's pose.

**Source distinction:** the five rear files in `big/` are selected full-figure image-tool originals. The ten face-bearing files in `big/` are full-resolution composites of the selected full-figure drawings and the two image-tool head drawings; they are not untouched single-call originals. Their unchanged full-figure sources are retained in `../scratch/review/full-redraw-big/`, and the head originals are `front-head-only.png` and `side-head-only.png` in that directory's parent. Final prompt files are `../scratch/review/prompt-*.txt`.

## Reduction and cleanup

`../scratch/review/reduce.py` range-keys magenta, uses BOX area reduction, centers the silhouette and maps source material masks to the six allowed ramps. Source subpixel coverage separates skin, hair, dark facial features, light catches and other materials before the final palette snap. A 25% coverage threshold preserves source-drawn dark features and catches; this is reduction of existing drawing, not coordinate-based feature painting. The skin/material masks are heuristic colour-and-region masks.

After palette snapping, the skin and hair pass replaces an isolated interior pixel only when it differs from all four direct neighbours, using the most frequent colour in its same-mask 3×3 neighbourhood. Material boundaries, outlines and facial features are protected. The head-only sources receive the same cleanup. `compose.py` inserts these reduced heads into the sprites and their large source versions into `big/`; `audit.py` rebuilds the review panels and validates the exports. `rebuild.py` reproduces the final deliverables from the saved sources.

Exactly 24 colours are shared by the final sprites: charcoal, leather, auburn, navy, steel and olive. No additional ramp was introduced. The large originals/composites retain source colours; the palette constraint applies to the logical sprites.

## Verification and visual review

- All 15 sprites: 96 × 128 RGBA, alpha only 0/255, crown row 33 and lowest occupied sole row 124; no opaque pure black, pure white or magenta.
- Each GIF: four 288 × 384 frames, 160 ms each, looping.
- Reviewed every final head at 6× directly beside all three supplied reference faces, and the full front comparison at 3×. Reviewed the final sheet and all 12 decoded GIF frames.
- Front heads now retain both eyes and catches, brows, nose and mouth consistently. Profile heads retain the visible eye/catch, projecting nose and mouth; cheek planes and ear shading are simpler than the first reductions. Rear hair remains face-free.
- The final comparison reads as a lean rogue distinct from Wren, Hadrik and the noble. The narrower torso, exposed calves, asymmetry, scarf and dagger carry that distinction.

Machine results: `../scratch/review/validation.json`. Per-view cleanup counts: `../scratch/review/reduction.json`. Individual 6× comparison rows, mask previews and decoded GIF contact sheets are also in `../scratch/review/`.

## Remaining limitations

- Costume folds, hands, pouch and rear hair clusters still vary between independently drawn bodies. The rear knot/twist arrangement is less consistent than the shared front/profile heads. These are not perfectly registered production animation loops.
- The preserved side passing frame 3 extends its moving foot farther forward than an ideal short passing pose. Silhouette centering also produces some lateral body motion when arms and props extend.
- The prybar remains longer than a literal palm in several views. Its hand assignment is consistent. The dagger is clearer in front/profile than behind.
- The scarf's nape fold varies in prominence. The pale right-jaw notch is a small highlight at sprite scale rather than a consistently distinct cut. The blunt front nose reads strongly, and the quiet mouth is close beneath it.
- Skin/edge separation uses heuristic masks; a few material-boundary pixels can remain ambiguous. Skin highlights and eye catches are palette-limited, and the final craft is an interpretation of the sheet rather than a pixel-for-pixel copy.

All project sources, prompts, processing files and deliverables were written inside this folder. The installed imagegen skill instructions were read as required by the runtime; no outside artwork was used. The image tool also maintains its automatic cache, but returned image data was saved into this folder without reading that cache.
