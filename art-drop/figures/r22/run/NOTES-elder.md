# Enna Kes — production notes

## Delivered

- Fifteen full-body image-tool originals in `big/`, one figure per file on magenta.
- Fifteen transparent 96 × 128 RGBA sprites in `sprites/`.
- `elder-sheet.png`: 1152 × 1536, nearest-neighbor 3× display on #4A4642. Rows are standing front/side/back (last cell empty), walk-side 0–3, walk-front 0–3, walk-back 0–3.
- Three 288 × 384 walking GIFs, four frames each, 160 ms per frame, looping on #4A4642.
- `elder-face.png`: front crop from logical coordinates x=28–67, y=33–60, shown at 6×.

All sprites have their crown on row 33 and lowest sole on row 124. Rows 0–32 and 125–127 are transparent. Alpha is exclusively 0 or 255. The union of opaque sprite colors is exactly the 24 specified colors from auburn, charcoal, leather, linen, steel and olive. No extra ramp was added. The display background and originals' magenta are not sprite palette colors.

## Process and redraws

The right-facing standing side was drawn first from the written design. Every other view used that side as a reference; front and rear walking views also used this run's corresponding standing view. No external character image, existing sprite, repository or other Downloads folder was used as a reference.

Every figure and every change to facial features, hands, equipment or pose was drawn with the built-in image tool. Python performed background keying, source-space skin/material masking, BOX area reduction, palette snapping, external contour repair, sheet/GIF assembly and checks. It did not draw eyes, mouths, limbs or poses. Final selected originals are unmodified image-tool files.

The first front drawing had three hands and was rejected. All ten face-visible views received an image-tool face redraw after reduction exposed weak eyes and busy face planes. Standing front and walk-front 0 each received a second face redraw. Walk-side 0 needed a further fan-only redraw because the earlier correction still splayed the slats. Rejected and superseded drawings are retained in `../scratch/`.

An initial color-only skin mask incorrectly assigned some skin to leather/auburn. Explicit anatomical masks and separate skin/non-skin palette snapping replaced it. Non-skin facial marks use charcoal/steel snapping. A one-pixel external local-color contour was restored after reduction; no internal facial features were painted.

The final standing front has two distinct dark charcoal eye pixels at (44,45) and (51,45), with olive pixels on both horizontal sides. Other front views have two visible marks; profiles have the one anatomically visible eye. The instruction saying “both eyes” was interpreted accordingly for strict profiles. All originals, reduced-frame previews, the full-size final sheet, the 6× face crop, the face comparison and the decoded GIF frames were visually inspected. GIF frame counts and timing were checked from the encoded files; motion was assessed from the decoded frame sequences rather than a live animation player.

## Honest weaknesses and rules not met exactly

- Some walking eyes occupy two adjacent dark pixels rather than exactly one; their surrounding lids and brow shadows vary. The face redraws improved readability but also simplified some age cues. The standing face is quieter and less deeply lined than the initial design suggests.
- Several mouth shadows and profile nose contours exceed the exact 1–2-pixel mouth / one-pixel nose ideal. These were not patched by code.
- Small isolated pixels remain in the hair, coat and skirt after area reduction and palette snapping. The strict ban on incidental singleton pixels is not fully met. Some internal creases are heavier than the ideal one-pixel outline.
- Skin masks are geometric and color-assisted, not a hand-audited segmentation of every source edge pixel. Hair/skin, cuff/hand and cheek boundaries can retain mixed material assignments. I cannot certify the absolute “every skin pixel and nothing else” requirement at those boundaries.
- Independent drawings cause slight changes in folds, face planes, hood width and coat shading between frames. These can produce visible flicker. The side cycle's near/far leg exchange is less explicit than the front and rear cycles; frame 3 reads close to a standing pose. Profile arm depth is also ambiguous even though the front view clearly assigns the fan to the anatomical left hand.
- The rear hood reads as two substantial stacked shelves; it is somewhat oversized. The fan is closed in the selected drawings but its apparent thickness varies.
- Original generated backgrounds and colors are approximate, not exact flat hex values everywhere. Keying and palette snapping enforce the export constraints.

## Workspace exception

The literal request to read and work only inside this folder was not fully met: a higher-priority tool instruction required reading the installed image-generation skill outside the folder. The built-in image tool also saves originals to its external generated-image cache; only this run's generated originals were copied from there into this folder. No other outside artwork or project files were inspected. All task scripts, previews, rejected variants and reports are in `../scratch/`; final deliverables are here.

The saved prompt set is `../scratch/prompts.json`. Reproduction scripts are `../scratch/process.py` and `../scratch/assemble.py`; measured checks are in `../scratch/final-checks.json`.
