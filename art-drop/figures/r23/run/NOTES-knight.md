# Rovan Tal — review redraw

## Review changes

Replaced all 15 image-tool originals and sprites. Rovan now has a full steel breastplate/backplate, low plate pauldrons and articulated waist plates over the long divided ochre coat. Steel is the main upper-body read; ochre is the single accent. A steel heater shield with one ochre diamond stays on the anatomical left forearm; the sword remains sheathed at the left hip. Rear views show the shield's leather backing and straps. This follows the Review redraw override to the earlier small-breastplate, empty-hands and no-heraldry notes.

The broad build, charcoal hair, long coat, boots, facing directions and intended pose sequence were retained. Whole-view redraws were necessary for armor and shield. Equipment changes the silhouette and left-arm position. Image-tool edits introduce small pose and shape differences: preservation is not pixel-exact.

## Image-tool work and face review

This revision used the built-in image tool for **26 requests**: 15 whole-view armor redraws, one initial front face pass, and 10 further head-focused redraws covering every front/profile standing and walking view. The revised right-facing side was drawn first and supplied as the armor reference for the other whole views. Every request attached style-ref/STYLE-SHEET.png with the required STYLE-ONLY instruction. Only that sheet and this character's own images were image references.

The initial reduced armor set still had compressed eyes and a heavy front mouth. Final head passes used enlarged logical sprites as edit targets, requesting clearer eye blocks and catches, separate brows, broad three-tone skin planes, closed mouths and simpler charcoal locks. Back views retain the whole-view hair redraws and have no faces. No facial features were painted or constructed in code.

Every final head was visually inspected at 6× beside Wren, Hadrik and Noble, using rows 33–62 of their fronts. Each reference is repeated beside each view in:
- knight-heads-front-6x.png: front and four front-walk heads.
- knight-heads-side-6x.png: profile and four side-walk heads.
- knight-heads-back-6x.png: back and four back-walk heads.

knight-vs-sheet.png is the full-figure 3× comparison. Rovan now reads as an armored knight beside the references, and the faces are substantially cleaner than the previous set. This is not a claim of an exact rendering match.

## Processing and validation

../scratch/process.py keys magenta, crops the equipped figure, uses BOX area reduction to 92 occupied rows, snaps to the allowed palette and exports binary alpha. Figure-relative source masks distinguish skin, hair and existing facial ink/catches. Feature masks prevent the drawn eyes and mouths being classified as skin during reduction; they do not invent or position features. Skin uses the fair ramp, with three main face tones; hair uses charcoal. A neutral-metal mask keeps armor in steel instead of beige linen.

The required skin/hair despeckle runs after snapping: eligible isolated pixels differing from all four direct neighbours use the most common same-mask colour in their 3×3 neighbourhood. Eyes, brows, mouths and outlines are protected. **202 pixels** changed across the final set. The contour pass selects an edge/shadow from the existing material. big/ contains final image-tool outputs before processing.

Validated deliverables:
- 15 replaced originals in big/ and 15 RGBA sprites in sprites/.
- Sprites are 96×128, crown row 33, sole row 124, equipped silhouette centered to the nearest pixel.
- Binary alpha; **24 shared allowed colours** across charcoal, leather, gold, linen, steel and fair. No new ramp, pure black or pure white.
- knight-sheet.png: 1152×1536, 3× nearest-neighbour on #4A4642, standing / side walk / front walk / back walk.
- Three knight-walk*.gif files: 288×384, four distinct frames each, 160 ms, looping. Every decoded frame matches its enlarged sprite pixel-for-pixel.
- knight-face.png: front columns 25–71, rows 33–62, at 6×, 282×180.
- knight-vs-sheet.png: 1152×384, Rovan / Wren / Hadrik / Noble.
- Three additional 6× comparison images listed above.

Rebuild from this folder with python scratch/process.py and then python scratch/review/verify.py. Exact prompts: ../scratch/review/prompts.json. Validation: ../scratch/review/validation.json. Decoded GIF proof: ../scratch/review/gif-proof.png. Previous deliverables and intermediate armor versions are backed up under ../scratch/review/.

## Honest remaining weaknesses

Heads vary slightly in nose, eye spacing, jaw and hair silhouette. Some brows sit closer to the eyes than the requested separation; profile catches vary in brightness. The cleaner faces read as adults, but do not convey age 52 equally strongly in every frame. Back hair retains chevrons rather than perfectly identical three-lock geometry.

Armor/fauld edges and coat seams remain busier than the sheet's cleanest clusters. Some paired pauldron highlights are too similar despite intended upper-left lighting. Small belt and plate details drift; rear walk frame 1 retains an extra waist buckle. Ochre still occupies substantial lower-body area, although steel now dominates the upper-body read.

These are independently drawn walk studies with visible frame drift. Side passing-foot positions shifted during redraw; head, shield and hem outlines vary, and long tails obscure opposite-leg identity. The GIFs are not a perfectly registered production animation.

All project reads, processing, backups and writes stayed in this character folder. The required installed imagegen skill was read outside it. The image service automatically saves its own originals outside the folder; project copies were written directly from returned data without reading those external files. No external character collection or other project was used.
