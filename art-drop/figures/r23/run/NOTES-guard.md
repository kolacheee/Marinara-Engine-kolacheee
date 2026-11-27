# Iset Marr — Round 23 guard

## Delivered

- `big/guard-<view>.png`: 15 selected image-tool originals, one figure per image on magenta, 1024 × 1536.
- `sprites/guard-<view>.png`: 15 transparent 96 × 128 sprites.
- `guard-sheet.png`: 1152 × 1536, nearest-neighbour 3×, background #4A4642. Rows: standing front/side/back; side walk 0–3; front walk 0–3; back walk 0–3.
- `guard-walkside.gif`, `guard-walkfront.gif`, `guard-walkback.gif`: 288 × 384, four frames each, 160 ms per frame, looping, opaque #4A4642 background.
- `guard-face.png`: standing-front crop of logical x25–72 and y33–60, enlarged 6×.
- `guard-vs-sheet.png`: guard, Wren, Hadrik, noble, left to right, all at 3× on the same background.

## Interpretation and method

Round 23 overrides the earlier lean build and empty right hand: Iset has a sturdy build, a navy uniform with linen trim, and a right-hand spear/polearm. The left-hand rectangular buckler remains. Steel brigandine, suspended hip plates, charcoal underlayers, boots and a belt pouch provide the costume layers. There is no sword or scabbard.

The side was drawn first and redrawn for four-head proportions before other views were requested. Every later generation included that corrected side. Every request included STYLE-SHEET.png and its required style-only instruction. No reference character was used as Iset's identity. The comparison uses the three supplied front sprites only for the required style comparison.

Every figure and every correction was drawn by the built-in image tool. There were 23 requests: 15 selected views and eight replacement/correction requests. Python performed magenta keying, bounding-box cropping, BOX reduction, spatial/colour skin masking, palette snapping, binary alpha, framing, crops, sheet/GIF assembly and checks. No figure, facial feature, limb or pose was drawn or retouched by Python. No extra outline pass was applied.

The final palette is the union of exactly 24 RGB colours: the four tones of charcoal, leather, linen, navy, steel and the written deep-skin ramp. No additional ramp was introduced. Skin tones were mapped separately from other materials; source skin colours required normalization because the originals skewed warmer/lighter than the written deep ramp.

Scripts, original rejected versions, prompt archive and check reports are in `scratch/`.

## Inspection and redraws

All generated originals were inspected. All fifteen reduced views were inspected individually at 3× and on the full-size sheet. The face audit, final face crop and full-size comparison were inspected. GIF constituent frames and encoded durations were checked; the image viewer presents a still frame rather than reliable real-time animation playback.

- Standing side: redrawn because the first version was elongated, approximately six heads rather than four.
- Standing front: face-pass/build redraw for clearer eyes and a sturdier torso.
- Side walk 1: redrawn to remove an erroneous second shaft between the legs and shorten the passing step.
- Side walk 2: face-pass redraw to remove a bright eye fleck and improve opposite-contact leg overlap.
- Side walk 3: redrawn to replace a forward kick with a close passing step.
- Front walks 0 and 2: face-pass redraws for clearer separate eyes and quieter mouths.
- Front walk 2 needed an additional image-tool correction because its face redraw moved the scar to the wrong cheek. The final scar is again on the anatomical right cheek, although its diagonal slope differs from other views.

## Verified export properties

All sprites are 96 × 128 RGBA, with only alpha 0 or 255. Complete equipped silhouettes occupy rows 33–124 inclusive; rows 0–32 and 125–127 are transparent. Silhouettes are centred by their complete equipped bounding boxes. No magenta remains in opaque sprite pixels. The combined sprite palette is 24 colours. All three GIFs contain four frames with 160 ms durations. Machine-readable results are in `scratch/final-checks.json`.

## Honest weaknesses and unmet details

This is a complete deliverable set, but it is not an exact match to every visual rule.

1. **Faces:** the eyes and quiet mouth cues survive, but uniformly isolated 1 × 1 dark eyes are not achieved across every reduced view. Some eyes still connect visually to the low brows; the smaller eyes in redrawn front contacts lose contrast after BOX reduction. Nose, mouth, cheek-scar shape and expression fluctuate. The standing face crop is stronger than some walking faces. No facial pixels were painted in to conceal this.
2. **Side animation:** contact/passing changes are visible, but the anatomical opposite-leg distinction between frames 0/2 and 1/3 remains weak despite redraws. It is not a rigorously registered, production-polished walking cycle. Frame-to-frame helmet, hand, pouch and plate shifts can cause shimmer. Bounding-box centring also produces small body-position shifts when the stride width changes.
3. **Hair:** the intended three nape locks subdivide into more rounded lobes in several rear views. This does not meet an exact three-lock silhouette.
4. **Armour and silhouette:** the helmet dome is deeper than the requested very shallow helmet. Some side sleeves acquired steel-looking wrist/bracer panels, although the design specified fitted charcoal sleeves. The hip plates are separate, but the tabard and hardware make the dark waist interval less clear in some views. The buckler can read as forearm-mounted rather than a clearly hand-suspended shield.
5. **Proportions and hands:** proportions are approximately four heads after the side redraw, but the frontal build remains moderately sturdy rather than broad. Some grips and hands are larger than the strict 3–5 logical-pixel mitten target.
6. **Crown alignment:** the equipped silhouette starts at row 33 in every export, but in frontal views the spear tip sits slightly above the helmet. The helmet crown itself can therefore land about one row below the requested row 33.
7. **Rendering match:** the uniform has comparable layering and a distinct identity beside the reference fronts, but reduced armour rivets/trim are busier and some material edges are less clean than the reference's best clusters. Broad palette compliance does not imply perfect material-mask boundaries or a strict 1 px local-colour outline everywhere. The result is not a pixel-for-pixel reproduction of the reference's craft.
8. **Folder-only limitation:** the required image-tool workflow instructions were read from their installed location outside this folder. No outside character artwork, other Downloads folders, repositories or existing sprite collections were read. The image tool also automatically wrote its own default-cache copies outside this folder; those cached files were not opened or used as references. The requested originals were saved here directly from returned image bytes, and all task scripts, processing intermediates and deliverables are inside this folder.
