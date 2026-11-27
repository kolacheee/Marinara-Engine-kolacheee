# Iset Marr — guard

Delivered 15 selected original drawings in `big/`, their 15 transparent 96 × 128 sprites in `sprites/`, `guard-sheet.png`, three walk GIFs, and `guard-face.png`.

## Method and references

Every figure was drawn with the built-in image tool. The right-facing side was drawn first from CHARACTER.md and STYLE-RULES.md. Every subsequent view used a side drawing from this run as its reference; front and back walk frames also used their corresponding standing drawing from this run. No external character images, existing sprites, repositories, or other Downloads folders were consulted.

Python performed magenta keying, bounding-box cropping, premultiplied BOX/area reduction, material-aware palette snapping, frame placement, sheet/GIF assembly, and checks. It did not draw figures or paint new facial features. Anatomical masks separate skin from clothing; existing dark eye/mouth marks are excluded from the skin mask and snapped to charcoal. Source skin and steel tones are mapped to the prescribed ramps to retain their relative planes. No additional palette ramp was introduced. Existing source contours were retained rather than drawing a new silhouette.

Processing scripts, anatomical masks, prompts, rejected drawings and inspection images are in `../scratch/`. The full prompt record is `../scratch/prompts.json`; numerical export checks are in `../scratch/checks.json`.

There was one instruction-scope exception: the session required reading the installed imagegen skill instructions outside this folder. The image tool also automatically saved its own default copies outside the folder. I saved the project originals directly from returned image bytes into this folder, without opening those external copies or searching outside for assets.

## Redraws and inspection

21 individual image-tool drawings were made; 15 were selected and six rejected drawings remain in scratch.

- The first side was too elongated. It was redrawn with a larger head and shorter torso before establishing the other views.
- The side failed the first face check: the eye was weak and the source included a light eye spot. It was redrawn with a separate dark eye and no glint.
- The first front's eyes merged too much with its brows after reduction. Three further front drawings were made. Two attempts placed the scar on the wrong cheek and were rejected. The selected front has its scar on image left, opposite the buckler.
- `walkside2` initially had an overly wide stride. It was redrawn with a shorter step.

All source drawings were visually inspected, including rejected versions. Reduced views were inspected individually and together. The final full sheet, its full-resolution row crops, the 6× front face crop, a face audit of all ten face-bearing views, and decoded frames of all three GIFs were inspected. The GIF files were also opened.

The selected front and all front walk frames have two dark eye groups with surrounding skin and readable mouths. Side views have one visible profile eye; the far eye is anatomically occluded. The instruction that “both eyes” exist was interpreted as applying to frontal views, not requiring a second eye in profile. No face was added to the back views.

## Verified exports

- All 15 sprites are RGBA, 96 × 128, with binary alpha.
- Every occupied silhouette begins at row 33 and reaches its lowest supporting sole at row 124. Rows 0–32 and 125–127 are transparent.
- Equipped silhouettes are horizontally centred within one pixel.
- The sprite set uses 22 opaque colours in total, all from the six specified ramps: steel, charcoal, leather, navy, linen and deep skin. No pure black or white.
- The sheet is 1152 × 1536: 4 columns × 4 rows of 3× frames on #4a4642. The unused fourth standing cell is blank.
- Each GIF is 288 × 384, four frames, 160 ms per frame, looping, on #4a4642.
- The front face crop covers sprite columns 30–65 and rows 33–60, enlarged 6× to 216 × 168.
- The files in `big/` are unmodified image-tool originals. Palette and transparency limits apply to the processed sprite exports, not those original source drawings.

## Honest remaining weaknesses

This is a complete export set, but it does not meet every visual rule exactly.

- The side head is in profile, but the torso and paired hip plates read slightly three-quarter. The equipment's far-hand placement is less immediately clear in profile than in front/back views.
- Some eye marks retain a second adjacent lid pixel. Mouth shadows can be three or four pixels wide rather than the requested one or two. The scar survives, but its contrast is modest at native size, and brow shadows remain heavy.
- The side contact strides are not equal: frame 0 is wider than the corrected frame 2. Some front/back passing boots are about four to six pixels above the lowest sole rather than only two. The loops are restrained but stiff, with imperfect heel-to-toe transitions.
- Independently drawn armour highlights, rivets, boot shapes and grips change slightly between frames. These cause visible flicker; equal frame height and a shared palette do not eliminate it. The corrected side contact also has a small proportional shift.
- The contour is continuous, but its thickness and upper-left lightening are not uniformly one pixel. Some metal planes exceed the preferred 2–6-pixel cluster width.
- Small pale strap clasps were introduced by the source drawings, so linen-like accents are not confined entirely to the shield grip. The shield is quite narrow, and its grip is clearer enlarged than at native size.
- Anatomical masks were manually bounded and colour-classified. Skin interiors are restricted to the deep-skin ramp, with dark feature/overlap exclusions, but material ownership at mixed boundary pixels is approximate rather than a perfect semantic segmentation.

These issues are recorded rather than describing the set as exact or production-perfect.
