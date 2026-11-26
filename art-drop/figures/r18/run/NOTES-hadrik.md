# Hadrik — round 18

## Delivery

- `big/`: 15 selected image-tool originals, one full-body figure per magenta image.
- `sprites/`: 15 transparent PNGs, each 96×128.
- `hadrik-sheet.png`: 1152×1536, nearest-neighbour 3× presentation on #4a4642. Rows are standing front/side/back (fourth cell empty), walk-side 0–3, walk-front 0–3, walk-back 0–3.
- Three walk GIFs: 288×384, four frames each, 160 ms per frame, looping on #4a4642.

## Method and checks

The right-facing side design was drawn first from text and revised twice for darker skin and shorter, stockier proportions. That selected side image was the reference for every other final view. Every figure and replacement was drawn by the built-in image tool. No existing artwork, other characters, earlier-round images, or repositories were used.

Python/Pillow only decoded image bytes, keyed magenta, box-downscaled, snapped colours, added outlines, assembled the sheet/GIFs, and checked outputs. No body parts were painted, warped, composited from other poses, or manually repaired.

Processing uses a magenta range key, BOX reduction to 92 pixels of artwork height, binary alpha, and head-based horizontal alignment. An external one-pixel, eight-neighbour outline uses mean neighbouring RGB × 0.32 + (8,4,10). The outline is then included in a final shared palette snap to remain within the colour limit. Thus its final shades approximate the formula after palette snapping. The artwork plus outline occupies 94 rows, 31–124 inclusive; row 124 is the lowest opaque outline/foot row.

All 15 sprites passed size, alpha and baseline checks. The selected final sprites use 45 distinct opaque colours across the entire character, under the 48-colour maximum. The sheet size, all three GIF frame counts and every 160 ms duration were checked after encoding. Detailed results are in `../scratch/checks.json`; the processing script and exact prompt sets are also in `../scratch/`.

Every generated draft was visually inspected. The final sprites were opened individually, the sheet was inspected at its full 1152×1536 size, and all four decoded frames of each GIF were inspected in full-size strips. This is a frame-by-frame review, not an in-engine movement test.

Replaced weak views: side design (twice), both side passing poses, side contact 0, rear passing 1, and rear contact 0. These addressed overly tall proportions, too-light skin, widely separated passing feet, ambiguous leg overlap, an erroneous rear apron panel and inconsistent rear straps. Rejected originals remain in `../scratch/`.

## Honest weaknesses

- Face and beard shapes still vary slightly between standing front and the front walk frames. Eye highlights and brows can appear to flicker; front passing 1 is the least consistent facial match.
- Shirt folds, apron shading and hair highlights change between independent drawings. A common palette removes colour proliferation but cannot remove that shape-level shimmer.
- The walk is restrained and low-stepping, but the four-frame side cycle is still somewhat stiff. The apron hides the upper legs, so the opposite contact poses rely partly on shading and arm position to distinguish them. Heel-to-toe roll is simplified.
- Rear boot foreshortening and exposed soles are stylized and not perfectly consistent. Front/back passing and contact differences are subtle at native size.
- Hammer head angle, visible handle length and apparent size vary slightly, although the hammer stays in the character's right hand.
- The skin reads as deep warm brown, with reddish highlights that are somewhat lighter than a strict interpretation of “very dark.” Dark skin, beard and outline also merge in shadow at native size.
- The stocky adult proportions are visually around the requested 3–3.5 heads in front/profile, but not an exact measured anatomical rig shared across every view. The back silhouette appears a little taller because the beard is hidden.
- BOX reduction retains some small shading clusters. The required added outline makes some contours heavier than a clean hand-tuned one-pixel outline, because the originals already contain dark borders.

## Workspace scope disclosure

All task inputs, references, processing, intermediates and delivered assets were handled in this folder. There were two operational exceptions to the requested folder-only boundary: the required installed image-generation skill instructions were read from outside this folder, and the image tool automatically saved its own copies outside the workspace. Those outside image files were not opened or copied from disk; returned image bytes were saved directly into this folder. No other art folders or repositories were inspected.
