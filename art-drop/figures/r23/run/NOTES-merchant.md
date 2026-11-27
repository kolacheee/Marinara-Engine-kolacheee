# Halet Sar — face and finish revision

Replaced all 15 full-view drawings in `big/`, all 15 sprites, the sheet, three walking GIFs, front face crop and 3× front comparison. The new face construction supersedes the earlier tiny-dot-eye instructions.

## Redraw and assembly

- Used the built-in image tool for every drawing. All 29 requests attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. Other image inputs were this character's existing drawings or the new head drawings. No outside character references were used.
- Redrew the standing right profile first, then the front, rear and all twelve walking views. Simplified hair into four principal rounded groups. Rear views remain rear views, without faces.
- The first reductions lost eye catches and produced patchy skin. Rejected those exports. Made two additional head-only passes for front/profile, enlarging eye blocks and catches and simplifying the nose, mouth and skin planes. Applied the refined heads to all ten face-bearing full-view originals with ten further image-tool requests.
- Final sprites use the separately drawn, palette-locked front/profile heads as complete artwork, aligned to each original head position. Sharing those heads within each direction prevents facial shimmer. Rear heads come from their individual redrawn full views. Code composites complete heads; it does not paint eyes, brows, nose, mouth or beard features.
- The original sprite body, costume, props and pose pixels from row 56 downward are retained, except the requested isolated skin-pixel cleanup. Automated comparison verifies every difference below that row is logged skin cleanup. The high-resolution image-tool originals preserve the same designs and poses visually, but are not pixel-identical below the neck.

## Reduction and finish

- Magenta range key; BOX-area coverage reduction of material/palette masks, rather than a single nearest-neighbour sample. Source skin ramp centres are calibrated before snapping, avoiding a generated tan colour that falls directly between two target tones. Final head skin uses exactly tan shadow, body and light; hair uses charcoal. No extra ramp.
- Subpixel crop registration selects a reduction in which the drawn catches survive. This changes sampling alignment, not the drawn facial features.
- Applied the prescribed same-mask 3×3 mode replacement to isolated skin/hair pixels that differ from all four direct neighbours. Protected eyes, catches, brows, mouth and contours are excluded. Saved before-cleanup images, material/protection masks and per-pixel changes in `../scratch/face-redo/`.
- All 15 sprites are 96×128 RGBA, binary alpha, crown row 33 and planted sole row 124. The complete set uses 24 colours from charcoal, leather, moss, linen, steel and tan.
- Sheet and GIFs use 3× nearest-neighbour enlargement on `#4a4642`. Each GIF has four frames, 160 ms per frame. Decoded frames were inspected as strips; real-time animation playback was not independently observed.

## Face comparisons

Every final head was inspected at **6×**, using rows **33–63 inclusive**, alongside the same crops of Wren, Hadrik and Noble. Deliverables:

- `merchant-faces-front-vs-sheet.png`: standing front and all four front walking heads.
- `merchant-faces-side-vs-sheet.png`: standing profile and all four profile walking heads.
- `merchant-faces-back-vs-sheet.png`: standing rear and all four rear walking heads.
- `merchant-all-faces-vs-sheet.png`: the three panels together.
- `merchant-vs-sheet.png`: final full front beside the three reference fronts at 3×.
- `merchant-face.png`: final front crop, rows 33–60, at 6×.

The revised heads have substantial eye clusters with light catches, separate brows, a short nose plane and readable mouth/beard. Skin planes are smoother and hair has fewer, larger groups than the previous delivery. The merchant remains distinct in face, curls, narrow build and costume from all three reference characters.

## Honest remaining limitations

- This is still an interpretation of the sheet, not an exact rendering match. The merchant's front eye blocks are heavier and squarer than the reference faces; the final eye blocks occupy about three pixels across. The catches sit at an upper corner rather than floating centrally inside each eye. The arched brows become flatter at this resolution.
- Front/profile heads are deliberately shared within each walking direction. Rear curls and neck joins still vary slightly between independently drawn frames. Four main curls read clearly, but small silhouette steps can suggest extra lobes.
- The inherited body artwork remains softer and busier at lapels/cuffs than the reference figures. Its existing pack height, somewhat thick straps, coat sweep, stiff passing poses and ambiguous side contact-leg alternation were preserved with the requested costume and poses. This revision does not claim to repair those earlier limitations.
- Material masks are based on source colour, head regions and the original sprite's palette labels. They are inspectable, but are not a fully hand-labelled segmentation; inherited mislabelled boundary pixels may remain.
- The image tool saves automatic originals in its own runtime directory. Those returned images were copied into this folder; project scripts, intermediates, backups and deliverables were written only here.

## Reproduction and evidence

`../scratch/face-redo/prompts.json` contains all 29 exact prompts. The two final head-only tool originals are `front-head-final.png` and `side-head-final.png` there. `original-big/` and `original-sprites/` preserve the pre-revision inputs; `previous-notes.md` preserves the earlier notes.

Rebuild from this folder:

```sh
python scratch/face-redo/reduce_masters.py
python scratch/face-redo/process_heads.py
python scratch/assemble.py
python scratch/face-redo/finalize.py
```

`../scratch/face-redo/final-checks.json` records dimensions, occupied bounds, palette count, GIF timing, protected-feature checks and body preservation. `cleanup-report.json` records each despeckled pixel. The older `scratch/process.py` is the superseded reduction path and should not be used to rebuild this revision.
