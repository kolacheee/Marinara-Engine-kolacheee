# Tamra Esh — innkeeper, Round 23

## Delivered

- Fifteen image-tool originals in `big/`, each containing one figure on magenta.
- Fifteen 96 × 128 RGBA sprites in `sprites/`.
- `innkeeper-sheet.png`: 3× nearest-neighbour display on #4a4642. Rows are standing front/side/back; walk-side 0–3; walk-front 0–3; walk-back 0–3. The fourth standing cell is intentionally empty.
- Three 3× walking GIFs, four frames each, looping at 160 ms per frame.
- `innkeeper-face.png`: standing front, source-frame rows 33–60, enlarged 6×.
- `innkeeper-vs-sheet.png`: at 3×, left to right: Tamra, Wren, Hadrik, noble.

## Design and references

Read CHARACTER.md, including Round 23, followed by STYLE-RULES.md. Round 23 overrides were applied: no upper-lip shadow; the sheet is a rendering reference; costume richness comes from layered linen shoulder and bodice panels, moss edging, split high-hip panels, charcoal belt, broad turned cuffs and the small leather folio. No apron, cloak, mug or tray was added. The folio remains assigned to the anatomical right hand: viewer-left in front, viewer-right in back.

The right-facing standing side was drawn first. Every later image-tool request included that character reference and the style sheet, with the required style-only instruction. Other image references were only this run's own Tamra drawings. The three supplied fronts were used for the requested comparison. No other character or asset sources were opened.

Every figure, including each walking pose and every redraw, was drawn by the image tool. No figure was drawn, articulated, mirrored or synthesized in Python.

## Reduction and checks

Magenta was range-keyed. Each complete silhouette was cropped and BOX-reduced to 92 occupied rows, then centered in its transparent frame with crown at row 33 and lowest sole at row 124. Enlargements use nearest-neighbour sampling. Transparency is binary.

Palette snapping uses only charcoal, leather, moss, linen, steel and tan: 24 RGB colors across the complete set. No additional ramp was introduced. Face, neck, hand and calf material masks separate skin from other materials. The existing neutral-dark face pigment was also area-reduced as a coverage mask to keep source eye marks from averaging into skin; this preserves source marks rather than drawing new facial features. Local-material outer contours were repaired inside the existing silhouette, using lighter upper/left and darker lower/right edge tones.

Automated checks passed for all 15 originals and sprites, 96 × 128 dimensions, binary alpha, exact occupied row bounds, centering within one pixel, allowed palette membership, 24-color union, sheet dimensions, and four 160 ms frames in each GIF. Reproduction scripts and check reports are in `scratch/`.

All generated originals were visually reviewed. Reduced figures were inspected individually and enlarged in the sheet. The face crop, all-face inspection strip, full-size sheet and full-size comparison were reviewed, including after revisions. GIF previews and all constituent frames were checked; the static viewer does not establish that live playback is perfectly smooth.

## Redraws

There were 23 figure generations in total: the 15 delivered views plus eight replacements.

- Standing side: one redraw after the first reduced eye was too weak.
- Standing front: three redraws, addressing weak eyes, insufficient contour/garment finish in the comparison, then clearer isolated eyes for the final face crop.
- Walk-front 0, 1 and 3: one redraw each after reduced eye marks were weak.
- Walk-side 2: one redraw for its weak reduced eye.

Superseded drawings and inspection images remain in `scratch/`. The final originals are in `big/`.

## Honest weaknesses and rules not met perfectly

- The reference's finish is not matched exactly. Tamra's linen planes are broader and less precisely organized than the strongest reference sprites. The comparison prompted a redraw, but the result remains an approximation of its craft.
- The final standing front has two distinct small dark eyes and a readable quiet mouth. Across the walk views, eye size, brow separation and mouth shape still vary. Some marks are larger than a strict isolated 1 × 1 pixel, and some profile eyes remain close to the brow. A literal two-eye requirement cannot apply to a strict side profile; only the visible eye is shown there.
- Several image-tool originals retained pale eye surrounds despite explicit no-white-eye prompts. The final face material masks map these to the tan ramp. The originals themselves do not satisfy the limited-palette/no-pale-eye treatment perfectly.
- The face reads as an adult woman, but age 56 and the precise long rectangular jaw are not equally strong in every view. The nose is somewhat simplified and more prominent in some frames. There is no moustache or deliberate upper-lip shadow.
- Independently drawn frames have small changes in wrap folds, face placement, sleeve folds, trouser widths and folio angle. Bounding-box centering and equal heights do not remove internal motion jitter. These are usable short walk studies, not a perfectly registered animation rig.
- Side contact frame 2 has the widest step. Near/far leg overlap in the side cycle is not perfectly consistent. The front passing/contact distinction is subtle, particularly between frames 2 and 3. Supported feet and low lifts are present, but the gait is not an exact biomechanical match between directions.
- The flat folio's grip sometimes reads as holding its upper edge instead of unambiguously its spine. The steel corner can reduce to a very small mark. Hands occasionally exceed the requested 3–5-pixel mitten size.
- Material masks are explicit, visually checked approximations, not a perfect semantic segmentation. Mixed boundary pixels and small dark overlaps can take a neighbouring material's dark tone. Not every contour and internal crease follows the one-pixel rule perfectly.
- All intentional filesystem reads and writes were inside this folder. The image tool automatically reported its own external cache locations; those locations were not read, listed or opened. Delivered originals were saved directly from the returned image data into this folder.
