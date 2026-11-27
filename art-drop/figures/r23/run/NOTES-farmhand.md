# Pell Arven — face and finish revision

## Replaced deliverables

All 15 sprites and all 15 full-size images have been replaced, along with the 3× sheet, three walk GIFs, front face crop and full-body reference comparison.

- `sprites/`: 96 × 128 RGBA; binary transparency; crown row 33 and lowest sole row 124.
- `big/`: full-size magenta composites of the original image-tool bodies and newly image-tool-drawn heads. These are assembled production sources, **not 15 new untouched full-body tool responses**. The untouched new head responses are retained in `../scratch/redo/`.
- `farmhand-sheet.png`: 1152 × 1536, 3× nearest-neighbour on #4A4642; standing front/side/back, then side/front/back walk rows.
- Walk GIFs: 288 × 384, four frames, 160 ms each, looping.
- `farmhand-face.png`: 6× front crop, rows 33–63 inclusive.
- `farmhand-vs-sheet.png`: Pell beside Wren, Hadrik and Noble at 3×.
- `farmhand-faces-vs-sheet-6x.png`: all 15 heads, each beside the three reference front-head crops at 6×, with view labels.

## Redraw method and preservation

Read the complete current STYLE-RULES.md and CHARACTER.md, including their final overrides. The character file contains no additional head redesign. The new face rules supersede the old dot-eye instructions.

Five built-in image-tool requests were used: profile, front and rear head masters, followed by one eye/brow correction each for front and profile. Every request attached `style-ref/STYLE-SHEET.png` with the prescribed STYLE-ONLY instruction. The only artwork inputs were that sheet and this character's own images. Exact prompts are recorded in `../scratch/redo/prompts.json`.

The three head masters were applied to the corresponding five views each. Heads are positioned to their original head centres. This keeps the expression and hair stable through the walk cycles. No eyes, brows, noses, mouths, anatomy or costume were drawn with code.

The original body, costume, equipment and pose are retained. All sprite pixels from row 56 downward are byte-for-byte unchanged except for the recorded skin/hair despeckle changes. The head/neck join occupies rows 33–55. The full-size files retain the original bodies below the corresponding join.

## Reduction and finish

The new heads were BOX/area reduced, magenta keyed and snapped through separate skin/hair classification to the existing fair and charcoal ramps. A small global sampling-phase offset preserves the tool-drawn eye catches; no individual facial pixel is painted or substituted. The full set still uses exactly 24 colours: charcoal, leather, moss, auburn, linen and fair. No new ramp was added.

The requested despeckle runs once from an immutable copy after palette snapping. Within the skin or hair mask, a pixel differing from all four direct neighbours is replaced by the unique most frequent colour in its same-mask 3×3 neighbourhood. Ties are left unchanged. Eye, brow and mouth regions, mask boundaries and darkest outline pixels are protected. Hair masks are restricted to the connected crown and braid regions. Skin masks include face, neck, arms/hands and exposed shins. The pass changed 159 pixels across the set. Per-view masks and exact changed coordinates are retained.

## Inspection and checks

Every assembled head was inspected at 6× beside crops of rows 33–63 from Wren, Hadrik and Noble. The revised front has separate brows, both dark eye clusters with light catches, a nose plane and short mouth line. The profile retains its single eye catch, brow, nose projection and mouth. Rear heads use broad hair masses with no face. Skin reads as broad light/body/shadow planes rather than scattered texture.

The initial front/profile masters lost eye clarity during reduction, prompting the two image-tool corrections. Global BOX sampling alignment was then adjusted; the final export verifies a light catch and dark eye cluster in every visible eye. Protected feature regions are checked unchanged by despeckling.

The final sheet, full-body style comparison, all 15 full-size composites and decoded GIF frames were also inspected. Automated checks passed for dimensions, binary alpha, palette membership, 24-colour union, crown/sole rows, protected features, preservation below the head, four GIF frames and 160 ms timing.

Rebuild with `python scratch/redo/build_redo.py`. The corresponding results are in `../scratch/redo/checks.json`. Original pre-revision sprites, full-size sources and notes are preserved under `../scratch/redo/originals/`. The older `scratch/build.py` is the previous production pipeline and does not rebuild this revision.

## Remaining limitations

- Heads are shared by direction, rather than independently redrawn in every animation frame. This deliberately holds facial detail steady; the existing body motion still has some width, pocket and arm shimmer.
- The retained bodies preserve the previous broad contact strides, short profile shin exposure, somewhat long braid and occasionally pointed-looking dibber. This head/finish revision does not redesign those poses or garments.
- The profile brow is softer than the front brows, and the nose/mouth use a few transitional pixels. Face readability is improved and comparable at 6×, but individual contour and feature shapes are not identical to the reference construction.
- `big/` contains head composites as disclosed above. Use the supplied rebuild script and preserved originals to reproduce the exact sprite exports; a naive reduction of those composites will not duplicate the chosen head sampling phase and original body sampling.

All project edits and saved working files are inside this folder. The required imagegen skill instruction was read from its installed location. The image tool maintains its own automatic cache outside the project; no cached file was opened or copied. Generated images were saved here from returned image data.
