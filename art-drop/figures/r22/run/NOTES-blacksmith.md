# Dema Ors — blacksmith

The complete requested export set is present. It is usable as a character study and four-frame walk set, but it does **not** satisfy every fine-grained style rule exactly. The remaining deviations are listed below rather than treated as passes.

## Deliverables and measured checks

- `big/`: 15 selected, unmodified image-tool PNG originals, one figure per image on magenta.
- `sprites/`: 15 transparent 96 × 128 RGBA sprites. Each has binary alpha, first occupied row 33 and last occupied row 124. The complete equipped silhouette is horizontally centered within half a pixel.
- All sprites together use exactly 24 opaque colours, exclusively the specified navy, charcoal, steel, leather, linen and olive ramps. No added ramp, pure black or pure white appears in opaque sprite pixels.
- `blacksmith-sheet.png`: 1152 × 1536, nearest-neighbour 3× enlargement on `#4A4642`. Rows are standing front/side/back; walk-side 0–3; walk-front 0–3; walk-back 0–3. The unused fourth standing cell is blank.
- Three GIFs: 288 × 384, four frames each, 160 ms per frame, looping, on `#4A4642`.
- `blacksmith-face.png`: 216 × 168, a 6× front crop from logical columns 30–65 and rows 33–60. Both eyes survive as dark marks without glints.
- Machine-readable measurements are in `../scratch/checks.json`.

## Drawing and reduction

The right-facing side view was drawn first. Every subsequent figure used that same-run side drawing as a reference; front/back references added later were also made in this run. No pre-existing character artwork or external image reference was used.

The built-in image tool drew every figure, including corrections: 15 initial images and six redraw attempts, 21 drawings in total. Selected originals were saved from the tool's returned image bytes. Python performed magenta range keying, bounding-box cropping, BOX area reduction, skin/material-aware palette snapping, binary-alpha placement, sheet/GIF assembly, crops and checks. No face, limb, pose or prop was drawn or patched with Python. There was no procedural figure construction, mirroring, limb reuse or compositing of one view's face into another.

The source skin mask combines palette classification with restricted warm-colour segmentation; reduced skin pixels are snapped only to olive, and non-skin pixels only to the other five ramps. Existing warm dark facial marks use charcoal during material-aware snapping. This is a heuristic mask, not a claim of perfect manual segmentation at every mixed boundary.

The full prompt record is `../scratch/prompts.json`; processing and assembly scripts are in `../scratch/`. Intermediates, rejected drawings and inspection images remain there.

## Face-pass redraws

1. **Side standing:** redrawn once because the first eye weakened during reduction. The replacement has a stronger separated eye. The earlier original is retained in scratch.
2. **Front standing:** redrawn once to soften and shorten the heavy mouth. It became a quieter shadow, but remained wider than the requested 1–2 pixels.
3. **Walk-side 0:** first redraw requested an eye correction and shorter stride, but lost the contact pose and became nearly standing; rejected. A second, eye-only redraw retained the contact pose and strengthened the mark. Both the initial drawing and rejected attempt remain in scratch.
4. **Walk-front 3:** first redraw restored weak eyes but made them too large. A second redraw reduced their size using the standing front face as an additional reference. The final eye marks remain slightly uneven.

Every generated drawing was inspected when returned. Every selected reduced view was inspected enlarged. The full sheet, individual sheet rows, full-size 6× face crop, and enlarged audit of all face-bearing views were inspected. All four frames decoded from each finished GIF were inspected as strips; GIF timing and frame counts were checked programmatically. This was frame inspection, not a claim of watching real-time playback.

## Honest weaknesses and unmet fine rules

- Eye marks survive, but several occupy two adjacent dark pixels rather than a strict single-pixel dot. Lid/brow separation and surrounding skin are not equally clean in every view. Side views show the anatomically visible single eye; the instruction requiring “both eyes” was interpreted as applying to frontal views.
- Several mouths are about 3–5 pixels wide, and some profile nose contours project more than one pixel. The frontal nose and jaw shading are heavier than the minimal face specification. The front reads as mature, but age 61 is less specific than the written design.
- Hands are often broader than 3–5 pixels and retain more finger notches than a simple mitten should. The hammer grip is readable, but hammer angle and apparent head size vary slightly between frames.
- Outlines are closed and coloured, but thickness varies. Some overlaps and lower contours are 2 pixels thick without a compelling deep crease. Local-material edge colours are not perfect at every reduced boundary.
- Small isolated colour fragments remain in some navy folds and hair edges, particularly the standing back and final front passing frame. These are reduction/generation artifacts rather than intentional dithering, but they still miss the clean 2–6-pixel cluster ideal.
- Cloth folds, hair highlights and facial planes change between independently drawn frames. That creates visible texture flicker. Upper-left lighting is the general direction, but accents on the opposite shoulder and arm are sometimes too strong.
- Side contact strides and arm swings are larger than the restrained town-walk target. The rejected stride correction did not solve this. The two side passing poses have similar foot silhouettes, so opposite-leg identity is less clear than it should be. Back contact frames expose large soles and can read as a more pronounced heel lift than intended.
- Head/body proportions are approximate rather than a measured four-head anatomical construction. Front and back widths differ slightly, and centering the equipped silhouette produces some torso movement as the hammer swings.

## Folder-only limitation

The strict no-outside-read instruction was not fully met: a higher-priority requirement required reading the installed image-generation skill instructions outside this folder. No other project, repository, sprite collection, Downloads sibling folder or external artwork was inspected. The image tool also automatically created service-managed originals outside this folder; those files were not opened or copied from the filesystem. Working copies were written directly into this folder from the returned image data. All task-created scripts, intermediates, checks and deliverables are inside this folder.
