# Style transfer test — verdict

**Good overall transfer, with visible imperfections.** The new figures look compatible with the Ember & Ink cast at native size and at the required 3× scale. They share the compact adult proportions, earthy colours, dark contours, broad cloth planes and restrained cool edge light. I would accept this as a successful style-transfer study, but would not call it an exact production match or claim that every drawing rule was satisfied perfectly.

## Delivered

- `test-innkeeper-front.png` and `test-innkeeper-side.png`
- `test-elder-front.png` and `test-elder-side.png`
- `test-strip.png`: one labelled row, Wren front/side, Hadrik front/side, Noble front/side, then the four test sprites in the order above. Every complete frame is displayed at exactly 3× nearest neighbour. Canvas is 2880×448; background is the sheet's sampled outer paper colour, RGB (232, 229, 220), `#E8E5DC`.
- `test-big/`: all seven unchanged image-tool originals, including rejected versions, plus the complete prompts in `prompts.json`.
- `checks.json`: machine-readable validation.
- `review/`: native-size comparison, 6× test views and full-resolution pieces of the comparison strip.

## What transferred well

The innkeeper is recognisably stout, bald on top and moustached, with a green waistcoat, pale shirt, waist apron and metal mug. His broad front silhouette sits reasonably beside Hadrik. The final side has a clear right-pointing boot rather than the first attempts' front-facing stance. The mug's handle and hand remain legible, especially in profile.

The elder's silhouette is distinct through her pale bun, blue shawl, dark green dress and walking stick. Her skirt and shawl use broad planes close to the Noble's treatment. The hand interrupts the stick, and the side view has a clear separation between the lower stick and skirt. Both characters retain their main costume and prop identities between views.

## Where the match remains weaker

The innkeeper's forehead and facial features are rounder and softer than the reference cast's most deliberate clusters. His skin reads warm peach more than strongly ruddy. Small reduced skin, linen and hair transitions sometimes snap into gold or olive entries of the allowed palette. Palette compliance alone does not prove correct material colour assignment.

The elder reads as older mainly through the white hair, stick and posture. Her wrinkles are economical but still faint at 1×. The revised front has a more angular chin, but its central hair part differs from the side's swept hair. The pale hair reads cream rather than neutral white, reflecting the available palette. The front stick remains close to the dress rather than having the requested clear gap all the way down.

Contours are broadly comparable to the references, but some face and cloth edges become softer local-colour transitions after BOX reduction, rather than a uniformly continuous one-pixel ink boundary. A few tiny transition pixels remain. Eye blocks are readable without whites or glints, but their exact dimensions and eyebrow shape are not mechanically guaranteed in every view. The cool rim is visible but uneven, and the elder's right dress edge is stronger than some reference rims. The tiny mouth marks are not equally clear in all views.

Registration follows the prescribed bottom-three-row bounds method. For the elder, this includes the walking-stick tip, so the shoes themselves sit slightly left of the frame centre. This is a limitation of that registration heuristic when a ground-reaching prop shares the baseline.

## Review and redraws

I inspected every accepted drawing at full source size, every final sprite at native 96×128 and with nearest-neighbour enlargement, and the assembled strip with full-resolution crops.

The innkeeper side was drawn three times. Version 1 mapped much of the skin toward leather colours and had weak mug-handle separation. Version 2 improved those points but retained two front-like boots. Version 3 corrected the profile stance and increased the head proportion; it was accepted before requesting the front.

The elder side was accepted first and attached as the character reference for both front attempts. Front version 1 looked too young. Version 2 improved the angular jaw and age lines and is the delivered front, with the remaining hair-continuity limitation noted above. The innkeeper front was accepted on its first attempt.

## Processing and checks

All figures were drawn by the built-in image tool. Only `STYLE-SHEET.png` and `STYLE.md` supplied the style; generated side models supplied character continuity. The supplied `ref-sprites/` files were used unchanged for comparison assembly.

Python performed only keying, cropping, reduction, palette snapping, registration, assembly and checks. There was no pixel repainting, anatomy repair, hand-drawn figure layer or horizontal flipping. Each original contains one figure, so the recipe's triptych column split was unnecessary. Processing used the specified magenta thresholds, RGBA BOX reduction to 92 pixels, alpha threshold 128, weighted palette distance `2R² + 3G² + 2B²`, and final baseline row 124.

| Sprite | Opaque colours | Dimensions | Occupied rows | Alpha | Palette |
|---|---:|---|---|---|---|
| Innkeeper front | 22 | 96×128 | 33–124, all 92 | 0 / 255 | Pass |
| Innkeeper side | 22 | 96×128 | 33–124, all 92 | 0 / 255 | Pass |
| Elder front | 23 | 96×128 | 33–124, all 92 | 0 / 255 | Pass |
| Elder side | 22 | 96×128 | 33–124, all 92 | 0 / 255 | Pass |

All transparent pixels have zero RGB. Rows 125–127 are empty. The four tests together use exactly 24 opaque colours; their union with the six displayed reference sprites also uses exactly the same 24-colour master palette.

Rebuild the accepted sprites, strip and checks from this folder with `python out/assemble.py`. The scripts do not read external project files or modify the references.

## Scope disclosure

The mandatory image-generation operating skill was read outside this folder. That was an exception to the requested folder-only reading boundary; it was not an additional visual/style reference. The image service also reported its automatic cache outside the folder. Those cache files were not opened or copied through filesystem reads: originals were saved into `out/test-big/` directly from the image tool's returned data. All task-created scripts, reviews and deliverables are inside this folder.
