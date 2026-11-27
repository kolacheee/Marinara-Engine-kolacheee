# Veska Rill — Round 23 production notes

## Delivered

- `big/rogue-<view>.png`: 15 selected, unchanged image-tool originals, one figure per image.
- `sprites/rogue-<view>.png`: 15 transparent 96 × 128 sprites: front, side, back, and four frames each of walkside, walkfront and walkback.
- `rogue-sheet.png`: standing front/side/back, then the three four-frame walk rows, enlarged 3× on #4A4642.
- `rogue-walkside.gif`, `rogue-walkfront.gif`, `rogue-walkback.gif`: 3×, four frames each, 160 ms per frame, looping.
- `rogue-face.png`: front crop, rows 33–62, enlarged 6×.
- `rogue-vs-sheet.png`: Veska beside the supplied Wren, Hadrik and noble fronts at 3×.

## Drawing and processing

Every figure was drawn with the built-in image tool. No figure, limb, eye, brow, mouth or costume detail was painted with Python. The right-facing side was drawn first; every subsequent request included a side image from this run. Every request attached STYLE-SHEET.png and the required style-only instruction. No other character art was used as an identity reference.

The costume enrichment is a charcoal neckline underlayer, leather edging along the diagonal closure and hem, a broad leather belt with steel buckle, and one small rear belt pouch. The asymmetric sleeves, exposed calves and low shoes remain. There is no hood or cloak. The guarded anatomical left hand carries the prybar; the right hand is empty.

Processing is in `../scratch/process.py`: range-key magenta, crop, BOX area reduction to 92 occupied rows, horizontal centering, masked palette snapping, binary alpha, and isolated-pixel despeckling of skin/hair interiors. Facial features and mask/figure boundaries are excluded from smoothing. Skin masks combine anatomical regions with source-colour separation; these are heuristic masks, not a claim of perfect semantic segmentation at every boundary. No separate outline drawing was needed for silhouette continuity.

The final sprites share exactly 24 colours from charcoal, leather, auburn, navy, steel and olive. No extra ramp was added. The originals retain the image tool's colours; the palette restriction is enforced on the reduced sprites. The source backgrounds are not guaranteed to be exactly #FF00FF at every pixel, so the prescribed range key was used.

Final machine checks passed for all 15 sprites: 96 × 128 RGBA, alpha only 0/255, crown row 33, lowest occupied sole row 124, no opaque pure black, white or magenta. All three GIFs were decoded and checked for four 288 × 384 frames at 160 ms. Details are in `../scratch/final-validation.json`.

## Review and redraws

I inspected each generated original. I also inspected the final sheet, face crop and versus-sheet comparison at their full saved sizes, the standing heads at 6× beside the reference faces, all walking heads at 6×, and decoded GIF frames at 3×. Review images are retained in `../scratch/`.

There were 24 image requests: 15 selected images and nine superseded images.

- The initial back request incorrectly returned three figures. It was rejected and redrawn as one back figure.
- Both standing side and front received a face-pass redraw because their first heads were too small and the reduced facial features were less clear than the reference. The revised heads are larger and the front retains distinct eyes, brows, nose and mouth. No facial pixels were repaired by code.
- Side passing frame 3 was redrawn to remove an extra hand-like shape behind the hip and clarify its two arms.
- Standing back and all four back-walk frames were redrawn with larger heads after the full-sheet comparison exposed a front/back proportion mismatch. These redraws also shortened the rear prybar.

The final prompts are retained as `../scratch/prompt-*.txt`. For standing side and front, the selected versions are `prompt-side-facepass.txt` and `prompt-front-facepass.txt`; other selected views use `prompt-<view>.txt`. Rejected originals are in `../scratch/rejected-*.png`.

## Honest remaining weaknesses and rules not met exactly

- The rendering is close in broad construction, palette and costume layering, but it is not an exact match to the sheet's craft. Reduced facial planes are lower in contrast and occasionally muddier than the supplied Wren/noble faces. Eye catches are not equally distinct in every face-bearing frame.
- The right-jaw notch is clear in the large front drawing but becomes a weak pale cheek/jaw accent after reduction; it is not reliably readable as a notch in every view.
- The squared rear hair block reads well in profile and from behind, but the precise three-twist structure is less explicit in front. Small hair/head shape changes remain between independently drawn frames.
- The stiff projecting nape fold is weak or hidden in several views and often reads as a thick neck band instead. Its required silhouette is not consistently achieved.
- The prybar in the standing side and several side-walk frames remains longer than palm length. The front and revised rear versions are shorter, so its apparent length is not fully consistent across the set.
- The jacket, pouch, calf shading and face clusters shift slightly between frames. The silhouette-centering requirement also introduces a little apparent body movement when the hand/prop extends to a different side. These are not production-perfect animation loops.
- Side passing frame 3 has more forward foot extension than ideal for a restrained passing pose. Front/back contact and passing poses remain visually close. Some hand masses are larger or more fingered than the specified 3–5-pixel mitten ideal.
- Four-head proportions are approximate after reduction. Veska reads as a compact adult with strong calves and one muscular bare arm, but her exact age of 39 is not strongly communicated at this scale.
- Mostly coloured contours survive, but reduction creates occasional thicker overlaps and ambiguous material-edge pixels. Heuristic skin masks cannot certify the strict skin/material separation rule at every antialiased source boundary.
- The requested folder-only reading boundary was not fully met: I read the installed imagegen skill instructions outside this folder because the runtime required that skill. No outside artwork, other Downloads folders, repositories or existing sprites were read. The built-in image tool also reports its own automatic cache outside the folder; I did not open that cache. Deliverables were saved directly from the returned image bytes into this folder, and all project intermediates are in `scratch/`.

These limitations are recorded rather than claiming that every written visual rule was met exactly.
