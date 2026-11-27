# Sere Venn — Round 23 production notes

## Delivered

- `big/ranger-<view>.png`: 15 selected, unmodified image-tool originals, each 1024 × 1536, one figure on magenta.
- `sprites/ranger-<view>.png`: 15 transparent 96 × 128 sprites: front, side, back, walkside0–3, walkfront0–3, walkback0–3.
- `ranger-sheet.png`: 1152 × 1536, exact 3× sprites on #4a4642; standing front/side/back, then side/front/back walk rows.
- `ranger-walkside.gif`, `ranger-walkfront.gif`, `ranger-walkback.gif`: 288 × 384, four distinct frames each, 160 ms per frame, looping, on #4a4642.
- `ranger-face.png`: exact 6× front crop, source rows 33–60 inclusive and columns 28–67.
- `ranger-vs-sheet.png`: Sere beside Wren, Hadrik and Noble, all at exact 3× and on the same ground row.

## Process and review

Read CHARACTER.md, including the Round 23 overrides, then STYLE-RULES.md, and inspected STYLE-SHEET.png. The style sheet accompanied every image request with the required style-only instruction. The first figure was the right-facing side. Subsequent figures referenced a side master from this run. No other character imagery was used except the permitted style references for rendering and comparison.

The richer costume uses linen underlayers, a projecting shallow storm yoke, inset leather-coloured seam bands, thick doubled coat hems, a narrow moss belt and the flat left-hip sheath. The small closed saw remains in the anatomical right hand: viewer-left in front, viewer-right in back. No cloak, hood or large prop was added.

There were 29 whole-figure image requests: 15 final selections and 14 superseded attempts. Redraws included the first side's tall proportions and low hem; two passes on the standing front face; a face/detail pass on all nine other face-bearing views; a wrong-direction walkback1; and a further walkside3 redraw for its narrower head. Superseded originals remain in `../scratch/`.

Python performed magenta keying, BOX area reduction, material-masked palette snapping, framing, sheets, crops, GIF encoding and checks. It did not draw figures or invent facial marks. Existing dark eye/brow ink was segmented and area-reduced separately to prevent surrounding skin from washing it out. Hair, trousers, moss and metal received material restrictions; skin used the deep ramp. No extra ramp was added. No hand-painted face or outline repair was applied.

Reviewed every generated original, all reduced poses enlarged, material-mask diagnostics, the face audit, the full-size final sheet, the 6× face crop and the full-size 3× reference comparison. GIF frames were checked against the reviewed sprites and their timing metadata.

## Verified properties

- All 15 sprite crowns begin at row 33; the lowest support sole is at row 124. Rows 0–32 and 125–127 are transparent.
- All sprite alpha values are 0 or 255. Equipped silhouettes are centred within 1.5 pixels of the frame centre.
- The combined sprite palette contains exactly 24 opaque colours, entirely from charcoal, leather, linen, moss, steel and deep skin in STYLE-RULES.md. No pure black or white is used in opaque sprite pixels.
- Moss is restricted to the belt; steel is restricted to the saw hinge and belt clasp. Skin masks snap only to deep skin; existing eye/brow ink is treated as charcoal.
- Each front-facing frame has dark eye marks with skin immediately on both horizontal sides. Each profile has one visible eye. Several marks occupy two adjacent vertical pixels, interpreted as eye plus lid; they are not all strictly isolated 1 × 1 dots.
- Every GIF contains four distinct frames at 160 ms each. Decoded frames match the corresponding sprites at exact nearest-neighbour 3×, with the specified background.

Detailed checks are in `../scratch/final-checks.json`; processing and assembly scripts also remain in `../scratch/`.

## Honest weaknesses and incomplete rules

- **The pale right-brow notch is not fully compliant.** Repeated redraws produced a visible brow break, but it often reduces to ordinary skin body tone rather than the requested broad skin-light notch. Some side frames retain a small forehead highlight. It is not equally legible across the cycle.
- **Face craft is weaker than the reference sheet.** The simplified front face can read younger and more androgynous than a clearly 47-year-old woman. The nose/mouth planes are somewhat diagrammatic, and the square jaw reads better in profile. The eyes survive, but lid separation and brow weight vary.
- **Pixel-cluster discipline is imperfect.** Some coat trims and yoke highlights break into isolated pixels after reduction. A few contours and overlaps are heavier than one pixel. The result does not exactly reproduce every aspect of the reference's finish.
- **Motion is not perfectly registered.** Hair, yoke, coat seams and hand outlines change slightly between separately drawn frames. The opposite side contacts depend partly on arm position and leg shading to communicate which leg leads. There is some visual foot sliding, and the passing poses are not a fully polished animation cycle.
- **Small equipment loses specificity.** At 1× the closed pruning saw can read as a short handled tool; the grip/hinge overlap is crowded. Some hands are slightly larger than the requested 3–5-pixel mitten mass. The sheath looks a little pouch-like.
- **Material borders are approximate.** Spatial masks were visually checked, but BOX averaging makes a few hair/skin and hand/tool boundary assignments ambiguous. No claim is made of perfect semantic classification of every edge pixel.
- **The originals are not exact indexed pixel art.** Their magenta is visually flat but contains small colour variations, handled by range keying. Their colour count and large-image pixel grid do not meet the final sprite restrictions; the reduced exports do.
- **Tool cache limitation:** the image service reports automatic cache copies outside this folder. Those files were never read, listed or opened. Image response data was saved directly into this folder; all local processing and intermediates stayed here.

The comparison shows a distinct cropped-haired, narrow-built person with a shoulder wedge and split coat, rather than a copy of any reference character. It also makes the remaining face and trim-quality differences visible; this is a complete delivery with the limitations above, not a claim of exact artistic compliance.
