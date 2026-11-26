# Guard — delivery notes

Delivered 15 original pose images in `big/`, 15 transparent sprites in `sprites/`, `guard-sheet.png`, `guard-vs-style.png`, and three walk GIFs. The sheet rows are standing front/side/back, walk-side 0–3, walk-front 0–3, and walk-back 0–3. GIFs have four frames at 160 ms each, loop continuously, and use the style sheet's neutral background.

## Checked

- Every sprite is RGBA, 96 × 128, with binary alpha and zero RGB in transparent pixels.
- Every occupied bounding box starts at row 33 and ends at row 124 inclusive: 92 occupied rows. The entire silhouette, including spear, is horizontally centred to within one pixel.
- The union of all 15 sprites contains 27 opaque colours, under the 32-colour character limit. All 15 files have distinct pixel data.
- Sheet and comparison figures are exactly 3× nearest-neighbour enlargements. Reference sprites in the comparison are unchanged.
- All GIF frames were checked pixel-for-pixel against the reviewed sprites composited on the neutral background. Dimensions are 288 × 384; every frame is 160 ms.
- Every generated source was inspected. Every reduced pose was inspected in the assembled sheet and in full-resolution row crops. The complete sheet and style comparison were opened at their native dimensions, and both comparison rows were also inspected separately without rescaling. GIF previews were opened; the viewer exposes a still preview rather than a reliable real-time playback review.

## Process and redraws

The built-in image tool drew every figure. The right-facing side master came first; all later pose requests included that same side master. Front and back walking requests also included this guard's corresponding standing view. No reference figure was copied into the guard.

The first side draft was rejected for elongated proportions and plate-like sleeves. Its replacement has a shorter tabard and simple shaded mail rows. The first `walkside3` was rejected for extending its moving foot too far forward; the replacement brings the feet close together for passing. Rejected sources remain in `../scratch/guard-side-v1.png` and `../scratch/guard-walkside3-v1.png`.

Python only keyed magenta, cropped, reduced once with NEAREST, snapped colours, assembled sheets/GIFs, and checked outputs. No anatomy, facial feature, limb, or costume shape was painted or synthesized in processing. Colour-only source-to-ramp thresholds were adjusted after review because source variations initially produced speckling within broad planes.

Exact prompts, including the two redraws, are in `../scratch/prompts.json`. The crop/reduction record, palette and validation results are in `../scratch/reduction-manifest.json`, `palette.json`, and `validation.json`.

Rebuild from this folder:

```sh
python scratch/build.py
python scratch/assemble_sheet.py
python scratch/check.py
```

## Honest weaknesses and deviations

- **Proportions:** the final cap-crown-to-chin measurements read approximately 3.7–3.9 heads tall, depending on view. This is closer to STYLE.md's four-head construction than CHARACTER.md's requested approximately 3.3 heads. The body is stocky, but that numerical character target was not fully achieved.
- **Palette:** STYLE.md has no red ramp. The tabard adds four muted red colours: `#42292A`, `#713B38`, `#9B5147`, `#BF7965`. All other permitted colours come from the supplied charcoal, leather, fair-skin, auburn, gold, and steel ramps. This extends the master palette while preserving the character colour cap and four-role approach.
- **Mail:** the sleeves use broad shaded rows without checker texture, but the rows can still read as ribbed cloth or bands rather than unmistakable chain mail. The side elbow rows bend diagonally around the sleeve.
- **Animation:** independently drawn frames retain small changes in helmet highlights, cloth folds, hand contours, and silhouette width. Centring the entire equipment-bearing silhouette creates some lateral body drift. Side contacts 0 and 2 have similar leg silhouettes; near/far leg alternation is less clear than ideal. Passing poses are not perfectly symmetric counterparts. These are usable four-frame studies, not a fully polished production walk cycle.
- **Contours and detail:** some lower hems, overlaps, and boot edges remain heavier than the mostly one-pixel rule. A few isolated shade pixels remain. Hands occasionally have more finger articulation than the preferred simple mitten mass. The guard's large quiet planes are somewhat cleaner and more diagrammatic than the supplied reference characters.
- **Spear:** a short carried spear was chosen with its tip at approximately helmet height to keep the complete silhouette inside the 92-row height. It reads closer to a short spear/javelin than a tall military spear.

## Scope record

The only artwork references used were this folder's `STYLE-SHEET.png`, its `ref-sprites/` for comparison, and this run's guard images. No other character artwork, game images, or repositories were accessed. Working assets and inspection intermediates are inside this folder. There were two environment-level exceptions to the requested folder-only scope: a required image-generation workflow instruction file was read outside the folder, and the built-in image tool automatically saved cache copies outside it. Those cache files were not opened or read; the returned image bytes were written directly into `scratch/` and selected originals into `out/big/`.
