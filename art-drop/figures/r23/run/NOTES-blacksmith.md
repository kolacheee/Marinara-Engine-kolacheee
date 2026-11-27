# Dema Ors — Round 23 face and finish revision

Replaced all 15 large originals and all 15 sprites, the four-row sheet, three walking GIFs, front face crop and front-versus-sheet comparison. Added `blacksmith-heads-vs-sheet-6x.png`, showing every final head beside the three reference faces.

## Head redesign and redraws

Every view now has cropped dark hair with small grey temple areas. The old cap and grey side-bob are gone. Front and profile views have close jaw stubble, low brows, a broad nose and a quiet short mouth; rear views show hair, ears and nape without facial features. The broad body, navy costume layers, belt/pouch, gaiters, boots, right-hand hammer and individual standing/walking poses were retained visually.

There were **25 image-tool edit requests** in this revision: one head redesign for each of the 15 views, followed by a second face-clarity pass for all ten face-bearing views. The right-facing standing head was established first. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. Other references were this character's own images. No outside character artwork was used.

The first reduced faces had weak eye catches and overly brown eye edges. The skin mask was tightened, then all front/profile sources received another image-tool pass requesting stronger eye blocks, larger source catches, clearer brow separation and simpler skin planes. No eyes, brows, mouths or other facial features were drawn with code.

Exact prompts are recorded in `../scratch/face-redo/prompts.json`. The previous set and first-pass redraws remain in `../scratch/face-redo/` for comparison.

## Reduction and cleanup

The final pipeline is `../scratch/face-redo/process.py`: magenta range key, figure bounding box, premultiplied BOX reduction to 92 occupied rows, material-aware palette snap, binary alpha, then one simultaneous skin/hair despeckle pass.

Skin is selected by spatial masks plus source colour; facial skin is snapped to olive shadow/body/light. Hair uses charcoal and steel. Other materials use the original six-ramp palette. No new ramp was added.

Despeckle replaces a pixel only when it differs from all four direct neighbours, using the most frequent colour in its 3×3 neighbourhood within the same material mask. Facial-feature regions, silhouette contours, material boundaries and darkest outline colours are protected. This changed **172 pixels across the 15 sprites**. An independent check confirmed that every change satisfied those conditions and that every protected pixel was unchanged. Masks, pre-cleanup images, change coordinates and the check report are saved in `../scratch/face-redo/`.

## Export checks and visual review

- All 15 sprites: 96×128 RGBA, binary alpha, crown row 33, lowest sole row 124, transparent rows outside that range.
- Shared palette: exactly 24 colours, restricted to navy, charcoal, steel, leather, linen and olive; no pure black or white.
- Sheet: 1152×1536, nearest-neighbour 3× on #4a4642; standing front/side/back followed by side/front/back walk rows.
- Three GIFs: four distinct frames each, 288×384, 160 ms per frame, looping. Decoded frame strips were visually checked; this was not a real-time playback review.
- Front face crop: 336×186, rows 33–63 inclusive at 6×.
- Front-versus-sheet: 1152×420 at 3×.
- All-head comparison: 960×3240; each of the fifteen heads at 6× beside rows 33–63 of Wren, Hadrik and the noble. All three final direction panels were inspected after cleanup.

Rebuild with `python scratch/face-redo/process.py`, `python scratch/assemble.py`, `python scratch/compare.py`, and `python scratch/face-redo/compare.py`. Run `python scratch/face-redo/validate.py` for cleanup verification.

## Honest limitations

The new heads are substantially clearer and have the requested hair/stubble design, but the match to the reference sheet is not pixel-exact. BOX reduction still makes some eye catches subdued and varies brow-to-eye spacing by about a pixel. Side mouths are quieter than front mouths; front-walk 3 has a stronger cheek highlight than the other fronts. Skin planes use three tones, but their shape and the grey temple patches vary slightly between poses.

Body, costume and pose preservation is visual, not a byte-identical preservation of the old artwork: image-tool edits introduce small shading and contour differences. Existing large mitten hands, low smock hem, uneven side strides and lateral registration shifts remain. Some clothing clusters and outlines are rougher than the reference sheet; the requested despeckle deliberately changes skin and hair only.

The large PNGs are unmodified image-tool originals at 1086×1448, with approximate magenta and some source smoothing. Palette and alpha requirements are enforced on the sprites. All authored work and deliverables are inside this folder. The runtime-required skill was read outside it, and the image service automatically cached originals outside it before they were copied here; no external artwork was used.
