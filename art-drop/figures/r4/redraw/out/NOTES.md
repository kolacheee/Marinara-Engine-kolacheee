# Wren and Hadrik — native redraw

## Method and tools

Drawn directly on 48 × 64 RGBA canvases using Python 3 and Pillow. The reproducible source is `../draw_sprites.py`. Run `python draw_sprites.py` from this folder's parent to rebuild the art.

The supplied Wren and Hadrik turnarounds were viewed for costume, colour relationships, hair and silhouette. No guide was downscaled, traced, resampled, quantized, sampled for colours, or used as input to the drawing program. No game assets were downloaded or used. The two market backgrounds are the supplied screenshots, unchanged apart from the characters and contact shadows.

Heads are explicit text grids. Clothing, limbs, equipment and shading are authored integer-coordinate pixel clusters. There is no antialiasing, random texture, dithering, or painted-image conversion. Each character has six hand-selected five-colour material ramps; the exported walk sheets actually use 25 colours for Wren and 27 for Hadrik. Outline colours are dark brown, plum, navy or green, never pure black. `palettes.json` preserves the complete selected ramps.

Down, left and up each have a fixed head and torso master. Walks reuse those exact layers with a one-pixel body bob; the arms, knee/ankle poses, cloak, ponytail and apron hem move separately. The lower apron is cloth, not part of the fixed chest. The six poses are contact, compression, passing, lift, opposite contact and opposite passing. Both characters have full walks in all four rows. Idle uses four distinct frames, raised shoulders/body and secondary cloth movement; Wren's tied hair also follows the motion.

Right is mirrored left. Wren's bow/quiver and Hadrik's hammer therefore switch screen sides. The side view is intended for that conventional field-sprite mirroring; it does not preserve equipment handedness in a physically consistent turntable.

## Files and playback

- `sheet-wren.png`, `sheet-hadrik.png`: 288 × 256, six 48 × 64 frames per row; rows down, left, right, up.
- `idle-wren.png`, `idle-hadrik.png`: 192 × 64, four down-facing idle frames.
- `standing-wren.png`, `standing-hadrik.png`: additional neutral down-facing masters, 48 × 64.
- `lineup.png`: both down and left masters, at actual 1× and nearest-neighbour 4×, on #7a7a7a. Separate `lineup-1x.png` and `lineup-4x.png` are also included.
- `consistency.png`: all eight walk rows, all six frames, at 4×.
- `walk.gif`: both characters together, six down frames followed by six left frames, 110 ms per frame, looping.
- `idle.gif`: both characters together, four frames, 240 ms per frame, looping.
- `in-world.png`: original 1280 × 760 normal view, exact **2×** sprites.
- `in-world-close.png`: original 1280 × 760 close view, exact **4×** sprites.
- `process/`: master head/torso layers and silhouette, material-flat, shaded-body and finished review panels at 1×, 4× and 8×. These panels are reconstructed views of the authored layers, not a chronological recording of editing.
- `validation.json`: results of the final export checks.

The integer world scales follow BRIEF.md, overriding SPEC.md's 2.3× / 3.8× values. Only the separate contact-shadow layer is blurred; sprite pixels remain exact, uniformly sized blocks. Both figures stand on the open pavement to the right of the monument, clear of the buildings, steps, vegetation and scene labels.

## Review and verification

Reviewed native and enlarged silhouettes, flats, shading and final masters, the walk contact sheet, and both world composites. The close composite was inspected at its full 1280 × 760 resolution. Revisions exposed Wren's knees and stride, restored Hadrik's far arm, connected the rear neck to the collar, extended Wren's rear cloak over the jerkin, corrected the back belt, strengthened Wren's facial marks, and added independent apron motion.

Export checks passed: required dimensions, RGBA sheets, alpha values only 0/255, no pure-black sprite colours, 24–32 used colours per character, 56-pixel neutral standing height, 55–57-pixel walk heights, bottom-row foot contact in every walk frame, six distinct poses in every direction, four distinct idle frames, expected GIF frame counts and timings. Every walk silhouette is one connected component under eight-neighbour connectivity; there are no detached opaque specks.

## What still falls short

- I would not claim these are indistinguishable from the named commercial target. The silhouettes and clusters are clean, but the costume volumes and transitions are simpler than the best commercial HD-2D character work.
- Wren's small face has a firm brow and defined jaw, but her exact age is not unambiguous at 1×. The profile reads more mature than the frontal view.
- Hadrik's beard reads black and his eyes/nose remain visible, but his beard and sleeve folds could use more individual character. His heavy boot silhouette is still fairly square.
- The gait has separated contacts, passing legs and weight changes, but the fixed chest and head constrain rotation. Shoulder counter-rotation, a more developed foot roll, and more nuanced cloth overlap would add life. Those would need another animation-art pass rather than more global bobbing.
- Idle is deliberately small. Hadrik has breathing and apron movement, but no blink or facial acting; short hair does not visibly sway.
- These are unlit sprite composites with soft contact shadows. Actual engine lighting, bloom and depth treatment remain an integration task; none is baked into the delivered sprite sheets.

The technical delivery is complete. The commercial-quality comparison remains an art-direction judgment, and the limitations above should remain visible when evaluating this round.
