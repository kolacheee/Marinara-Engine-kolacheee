# Nemi Vos — production notes

## Delivered

- 15 full-size drawing originals in `big/`, each containing one figure on magenta.
- 15 RGBA sprites in `sprites/`, each 96 × 128. Every occupied bounding box starts at row 33 and ends at row 124 inclusive. The complete equipped silhouette is horizontally centred to within half a pixel.
- `mage-sheet.png`: 1152 × 1536, nearest-neighbour 3× enlargement, background #4A4642. Rows are standing front/side/back (fourth cell empty), walk-side 0–3, walk-front 0–3, walk-back 0–3.
- Three looping 288 × 384 walk GIFs, four frames each, 160 ms per frame.
- `mage-face.png`: front crop of logical columns 32–63 and rows 33–60, enlarged 6× to 192 × 168.

## Drawing and reduction

The right-facing standing side was drawn first. Every subsequent drawing used that original as a reference; front and back walking views also used this run's corresponding standing drawing. No external character image or sprite was used. The built-in image tool drew every figure and every redraw. There were 20 drawing calls, with 15 selected originals delivered and five rejected versions retained in `../scratch/`.

Python performed magenta keying, premultiplied BOX/area reduction, palette snapping through face/neck/hand masks, nearest-neighbour enlargement, sheet/GIF assembly and checks. It did not draw or transplant facial features, limbs, poses or clothing. Source-derived charcoal pigment coverage was reduced separately inside the skin regions to keep dark eye marks from being averaged into skin. A violet cloth mask restricts plum pigment to the plum ramp; unrestricted nearest-colour snapping initially turned some warm cloth highlights brown.

The shared final sprite palette contains 24 colours: the four tones of plum, charcoal, linen, leather, steel and deep skin. Plum is the sole additional ramp: #352A32, #51404C, #766071, #A08C9A. Alpha is exclusively 0 or 255. The unreduced drawing originals retain the image tool's original colours and background; the palette and transparency constraints apply to the reduced sprites.

The complete 20-call prompt log is `../scratch/prompts.json`; entries are identified by view and redraw number. Processing, assembly, material-mask coordinates and machine-check results are also retained in `../scratch/`.

## Redraws and visual review

- Standing front: one face redraw. The first source produced oversized eye blocks. The retained source has smaller marks with clear skin below the brows.
- Side-walk 2 and 3: one redraw each. The initial drawings repeated the first half-cycle's leg overlap. The retained drawings put the trailing or passing near leg in front of the far leg.
- Front-walk 2: two face redraws. One eye disappeared in the first reduction; the first correction made both eyes too large. The second correction restored two small visible marks.

All drawing outputs were inspected. Reduced views were inspected in enlarged proofs, and all face-bearing views were compared in enlarged face crops. The final sheet and front face crop were viewed at their full exported sizes. All twelve decoded GIF frames were inspected in strips at 3×, and their pixels were checked against the corresponding enlarged sprites. Every GIF frame matches its sprite exactly and retains 160 ms timing. This was frame-by-frame inspection, not a claim of live animation playback.

## Honest weaknesses and rules not fully met

- The hair-to-chin span is about 25–26 logical pixels in several views, larger than the ideal 23-pixel head unit. The figure therefore reads closer to 3.6–3.8 heads including the hair, and the front face is somewhat younger-looking than the intended mature 25-year-old. The exact four-to-four-and-a-half-head target was not fully achieved.
- The broad brows are visually heavy. Some retained eye/lid marks occupy two adjacent pixels, and profile eyes sit close to their brows. The front-walk 2 correction has two distinct small dots. Profile views show the single anatomically visible eye; the instruction requiring “both eyes” was interpreted as applying to front views. Mouth and cheek-plane definition remains subdued at native size.
- The upper back shoulder highlight is too broad and nearly symmetrical for the requested small upper-left accent. Clothing light does not obey the screen-space lighting rule perfectly in every frame.
- Some source folds reduce into large uninterrupted plum areas, while a few edge clusters and deep overlaps are thicker than the ideal one-pixel contour. The three hair locks are clearest in profile; front and back views can read as two prominent ridges plus a smaller third lock.
- The right-hand book grip is small and generally readable, but the thumb notch and steel clasp are less consistent between views. The book's pale page edge can compete with its clasp. Some hand masses exceed the preferred 3–5-pixel footprint.
- The walk cycles have modest changes in head width, cloth folds and arm position between independently drawn frames. Centring the complete silhouette also causes a few pixels of horizontal torso movement, especially in the side cycle. Contact heel/toe articulation is approximate, and some passing shoes lift roughly 3–4 logical pixels rather than two. The back contact soles are more emphatic than the quietest possible town walk.
- Material masks were visually checked but are not a semantic ground-truth segmentation. A few mixed contour pixels can take an adjacent material's permitted colour. The 24-colour limit and binary transparency were checked exactly; perfect material assignment at every boundary is not claimed.

## Workspace boundary exception

A required installed image-tool skill instruction was read outside this folder. The image service also automatically stored its own source copies in its standard external output location. Those external source files were not opened or copied through filesystem access: the returned image data was saved directly into this folder. No other Downloads folder, repository, existing sprite collection or external character reference was inspected. All task scripts, masks, review images, rejected versions and prompt logs are in `scratch/`; all deliverables are in `out/`.
