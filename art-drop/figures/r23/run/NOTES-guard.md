# Iset Marr — Round 23 face and finish revision

## Replaced deliverables

All 15 views have revised heads: standing front/side/back and four frames each for side, front and back walking.

- `sprites/guard-<view>.png`: 96 × 128 transparent sprites.
- `big/guard-<view>.png`: 1024 × 1536 full-body source composites on magenta. These combine each new image-tool head with its original body. They are **not untouched full-frame tool returns**; the untouched selected returns are in `../scratch/face-redo/generated/`. Compositing was necessary because some head-edit requests also changed the legs or costume.
- `guard-sheet.png`: four rows, 3× nearest-neighbour, #4A4642 background; standing front/side/back, side walk, front walk, back walk.
- Three `guard-walk*.gif` files: 3×, four frames, 160 ms per frame, looping.
- `guard-face.png`: standing front, logical x24–71 and rows 33–63 inclusive, enlarged 6×.
- `guard-vs-sheet.png`: guard, Wren, Hadrik and noble full fronts at 3×.
- `guard-faces-vs-sheet.png`: **all 15 heads at 6×**, each directly beside the three reference fronts cropped to rows 33–63. Individual comparisons and three orientation audit strips are also in `../scratch/face-redo/`.

## Drawing and cleanup

Read both updated instruction files in full. The final Round 23 design additions retain the existing sturdy woman, navy uniform/tabard and right-hand polearm, with left-hand buckler. This revision preserves the existing bodies, costumes, equipment and poses.

Used the built-in image tool for 18 requests: 15 selected head edits and three further corrections. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. References were limited to that sheet and this character's own images. The standing side was edited first. The first side edit and first side-walk-0 edit retained the joined eyebrow/eye shape and were redrawn. Front-walk-2 received a final local scar correction to restore its diagonal direction on the anatomical right cheek.

Visible faces now have larger dark eye clusters with small light catches, explicit brows, nose planes and short mouth lines. Hair was simplified into larger locks; back views contain no faces. Skin is normalized to the written **deep** ramp, with three main plane tones and its darkest contour role. Eye catches use the existing linen ramp. No ramp was added.

Processing used magenta keying, the original view's crop and registration, BOX reduction, separate source-derived material/feature masks, palette snapping and binary alpha. Facial marks were drawn by the image tool, not painted in code. Small light catches and dark facial features were classified separately from skin so their colours would survive reduction.

The required simultaneous 3×3 mode despeckle runs only within skin and hair masks, and only when a pixel differs from all four direct neighbours. Same-mask neighbours alone determine the replacement. Source-derived facial-feature protection, dark contours and silhouette outlines are excluded. Masks, cleanup counts and reproducible scripts are saved in `../scratch/face-redo/`.

## Verification

Visually inspected all generated heads and all 15 final 6× comparisons beside Wren, Hadrik and the noble, including the five rear heads. Inspected the full sheet, 3× full-character comparison and representative large composites. Rechecked front-walk-2 after its final scar correction.

Automated checks passed for all 15 sprites:

- 96 × 128 RGBA; alpha only 0 or 255.
- Equipped silhouettes occupy rows 33–124; transparent rows above and below.
- Exactly 24 colours across the entire set, all from charcoal, leather, linen, navy, steel and deep skin; no opaque magenta.
- Outside the recorded head rectangles, sprite pixels match the previous views except the requested hand-skin despeckle. Large images match their previous originals exactly outside the head rectangles.
- All three GIFs contain four frames at 160 ms each.

Reports: `../scratch/face-redo/final-checks.json` and `cleanup-checks.json`. Exact prompts: `../scratch/face-redo/prompts.json`. Rebuild: run `finish.py`, then `exports.py`, from that directory or by their full relative paths. GIF frame content/timing was checked; real-time animation playback was not verified.

## Remaining visual limitations

The faces are cleaner and more readable, but they are not pixel-identical across the walk cycle. Brow height, catch shape, nose width and scar thickness still vary slightly. Some low brows sit close to helmet shadow. The reduced nape locks are broader and quieter, but their exact separation varies by view. These are image-tool/reduction variations, not hand-painted corrections.

The original animation registration, armour detail, hand proportions and helmet shape were intentionally retained. Existing small costume/helmet shifts between the original frames remain. In some frontal views the polearm tip is above the helmet, so row 33 describes the equipped silhouette rather than the helmet crown itself. The result is a style comparison and revision, not a claim of a pixel-for-pixel match to the sheet's craft.

All working scripts, masks, backups and deliverables are inside this folder. The image tool maintains its own automatic cache outside it; selected returns were copied into this folder. No outside character artwork was used.
