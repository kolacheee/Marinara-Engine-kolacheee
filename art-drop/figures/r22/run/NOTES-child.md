# Davi Ren — production notes

## Files and checks

- `big/`: 15 selected full-body originals on magenta, one figure per image.
- `sprites/`: 15 transparent 96 × 128 RGBA sprites. All have binary alpha, crown on row 55, and lowest sole on row 124: 70 occupied rows.
- `child-sheet.png`: 1152 × 1536, nearest-neighbour 3× presentation on #4a4642. Rows are standing front/side/back, walk-side 0–3, walk-front 0–3, walk-back 0–3. The unused fourth standing cell is blank.
- Three walking GIFs: 288 × 384, four frames each, 160 ms per frame, looping, on #4a4642. All decoded frames were inspected in contact strips. I did not assess real-time playback in a game engine.
- `child-face.png`: 6× standing-front crop. The crop is source columns 32–63 and rows 33–81. It extends below the suggested row 60 because the child's crown is at row 55 and his eyes are near row 67; ending at row 60 would exclude the face.
- The union of opaque sprite colors is exactly 24 colors, all from charcoal, leather, moss, gold, linen, and deep skin. No extra ramp was added. No pure black or white is used in the sprites.

## Drawing and reduction

The built-in image tool drew every full figure. The right-facing side was drawn first and corrected before becoming the identity reference for every other view. Only this run's own Davi images were used as image references. No existing sprite, reference image, repository, or unrelated Downloads folder was consulted.

Python/Pillow was used for magenta keying, foreground bounds, BOX area reduction, material-mask palette snapping, binary alpha, placement, crop/sheet/GIF assembly, and checks. It did not draw limbs, poses, hair, clothing, boats, or facial features. Skin masks use source color plus face/neck and hand regions. Existing dark source marks have their own coverage mask to keep palette snapping from relabelling their brown mixtures as skin. This is color classification of drawn marks, not insertion of replacement eyes. The masks and reduction scripts are in `../scratch/`.

The full sheet and face crop were opened at their actual exported sizes. Every original drawing was inspected, as were the reduced views, enlarged face checks, material-mask checks, and decoded GIF frames. Technical check details are in `../scratch/validation.json`. Prompt records are in `../scratch/prompts.json` and `../scratch/front-redraw-prompt.txt`.

## Redraws

1. Side master: the first boat was substantially oversized. A second drawing reduced it before generating other views.
2. Walk-side 3: redrawn to reduce the boat and bring the passing foot closer to the support leg. The revised passing silhouette is better, though the toy still reads wider than the master toy.
3. Walk-front 0 and 3: face-pass redraws requested clearer charcoal eyes after the initial reductions lost contrast. The redraws changed the source eyes only slightly. Carrying the source material masks through the same area reduction improved their survival.
4. Standing front: redrawn again for distinct charcoal eyes and a warm nose plane. This is the selected front original and the face-crop source.

Superseded originals and intermediate files remain in `../scratch/`. There were 20 image-tool drawings in total: 15 first versions plus five redraws.

## Honest weaknesses and unmet details

- The eyes survive, but the exact one-pixel rule is not uniform across all walking frames. Some have a second adjacent dark pixel; walk-front 0 and 3 retain heavier, less even eye clusters. No claim of a perfect strict face-pass result across all ten face-bearing views is intended. Profiles show only the anatomically visible eye, rather than the literally requested “both eyes.”
- Faces and hair shading vary between independently drawn front frames. Walk-front 1 reads darker and slightly narrower. Back hair highlight shapes change noticeably. The cycles therefore have shading and silhouette flicker, despite consistent crown/sole placement.
- The head is roughly 19–21 logical pixels tall depending on view, rather than an exact 23-pixel head unit. The result is a slight child, but the construction is approximate.
- Contact and passing poses are distinct, but foot articulation and opposite-arm timing are not mechanically exact. The side contacts are somewhat long; front/back contact depth is simplified. These are usable four-pose previews, not a rigorously registered final animation set.
- The boat remains in the intended right hand, but its apparent length and shape vary. At sprite size the moss top and leather hull can read as a small green-topped bundle instead of unmistakably a boat. Some grips and finger divisions are less clean than the requested mitten shape.
- The short plaits read as blunt lateral tabs rather than visibly braided hair. Profile usually exposes only one tab. This preserves the silhouette hook but does not prove two separate plaits from every angle.
- Box reduction and palette snapping leave occasional isolated transition pixels, uneven outlines, and broad highlight areas. The requested predominantly 2–6-pixel clusters, strict one-pixel local-material contours, and sparse highlights are not uniformly achieved. Skin/hand material boundaries are mask-based approximations, especially where the brown boat meets the hand; perfect semantic separation is not guaranteed.
- The image-tool originals contain more than the final palette and slight color variation; the 24-color guarantee applies to the reduced sprites. The sheet/GIFs add their required preview background color.
- The literal “read nothing outside this folder” restriction was not completely met: a higher-priority tool instruction required reading the installed image-generation skill outside the folder. No outside artwork or project content was read. The image service also automatically stores its own originals outside the workspace; the delivered originals were saved from returned image bytes into this folder, without opening those external copies. All task scripts, intermediates, and delivered files written by the local workflow are inside this folder.

These limitations remain after the redraws and review; the set should not be described as satisfying every written style rule exactly.
