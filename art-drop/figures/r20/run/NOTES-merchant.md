# Merchant — style D

Delivered all 15 views of the middle-aged merchant: front, right-facing side, back, and four walk frames for each direction. Costume: dark hair under a moss headscarf with ochre cross motifs, mustard dress, brown bib apron, practical brown shoes and a flap satchel on her anatomical left hip.

## Files

- `big/merchant-<view>.png`: 15 selected original drawings on magenta, without reduction or palette changes.
- `sprites/merchant-<view>.png`: 15 transparent 96 × 128 sprites.
- `merchant-sheet.png`: all views at exactly 3× nearest-neighbour, ordered standing, side walk, front walk, back walk.
- `merchant-vs-style.png`: merchant front and side beside the supplied Wren, Hadrik and Noble front/side sprites, all at exactly 3×.
- `merchant-walkside.gif`, `merchant-walkfront.gif`, `merchant-walkback.gif`: four distinct frames each, 288 × 384, 160 ms per frame, looping, on the reference page background.

## Drawing and processing

The built-in image tool drew every figure, including every walk pose. The side master was drawn first and then supplied as a reference for every other view. Front and back originals additionally anchored their respective walk directions. The only visual references were `STYLE-SHEET.png`, this run's merchant drawings, and the supplied `ref-sprites/` in the comparison.

Twenty source drawings were inspected. Five were superseded: the initial side was too tall, the initial front placed the satchel on the wrong side, the initial two side contact poses had over-wide strides and repeated arm direction, and the first front passing pose lifted the skirt too far. Those originals remain in `scratch/`; the selected corrections are the `-v2.png` files. No figure was mirrored, assembled from replacement limbs, or painted procedurally.

Processing follows the supplied magenta key, tight crop, aspect-preserving height reduction to 92 pixels with NEAREST, colour snapping, and placement at row 33. The moss anchor snap follows the supplied recipe. Merchant-specific colour-only anchors for mustard, leather and warm skin reduce unstable nearest-palette decisions; see `scratch/build.py` for exact rules. There is no smoothing, dithering, pixel-brush face repair, procedural anatomy, or added outline pass.

The allowed palette comprises the charcoal, leather, moss, fair-skin and gold ramps from STYLE.md. The skin treatment uses the restrained tan portion of the supplied skin ramp. The final union contains **20 opaque colours**, below the 32-colour character cap. The page background is the reference sheet's exact top-left RGB value, **(232, 229, 222)**, and is not included in the transparent sprite palette.

## Verification

All 15 final sprites were inspected together at 3× in the full-resolution 1248 × 1810 sheet. The full-resolution 1248 × 955 style comparison was also inspected. The three GIF files were opened, and their four constituent frames were inspected on the sheet; automated checks establish that every decoded GIF frame matches its corresponding enlarged sprite exactly. This is not a claim of a frame-by-frame timed playback review.

`python scratch/check.py` passes:

- Exactly 96 × 128 RGBA for every sprite; alpha only 0 or 255, with transparent RGB zeroed.
- Every figure spans exactly 92 rows, from crown row 33 through lowest sole row 124.
- Every complete silhouette is horizontally centred within one pixel, including equipment.
- All opaque colours belong to the selected master ramps; no pure black, pure white or magenta remains.
- Fifteen originals are present; each GIF has four distinct frames, 160 ms timing, infinite looping and no palette loss.

Rebuild with `python scratch/build.py`, then `python scratch/assemble_sheet.py`, then `python scratch/check.py`, from this folder. Source crop boxes, reduced widths and placement are recorded in `scratch/reduction-manifest.json`; validation results are in `scratch/validation.json`; generation prompts are in `scratch/prompts.json`.

## Honest weaknesses and departures from STYLE.md

- The complexion reads as muted warm tan/brown more than distinctly olive. The supplied master palette has no dedicated olive-skin ramp, and this result does not fully reproduce that nuance of the description.
- The face is restrained and adult, but the front view could read younger than middle-aged. The brow and cheeks provide only modest age cues at this resolution.
- The broad headscarf makes the head mass appear larger than the reference women's hair, even though the crown-to-chin construction is close to the 23-pixel target. Its cross motifs are deliberately conspicuous and a little busier than the reference costumes.
- Mouths and some eye/eyelid clusters exceed the ideal one-pixel eye and one-to-two-pixel mouth guidance. Hands remain compact but occasionally retain more notching than the ideal mitten construction.
- Some diagonal creases, sleeve edges and scarf contours retain isolated pixels. The colour-anchor pass greatly reduced the mustard speckling, but this is not a perfectly flat, four-tone-per-material segmentation: the total palette is controlled, while neighbouring materials can still share tones at their boundaries.
- Outlines are mostly thin coloured contours, but some hair, footwear and bag overlaps remain darker or thicker than the strict one-pixel ideal. Upper-left lighting is broadly consistent, with a few inconsistent small accents between independently drawn frames.
- Walk frames retain small shape and shade changes in the scarf, sleeve, apron and bag. The visible leg lengths and foot spacing vary slightly. Bounding-box centring also permits a little apparent torso drift as the silhouette moves. These loops are usable four-frame studies, not perfectly registered hand-cleaned production animation.
- The side contact strides are shorter after redraw, but the two contact poses are not perfectly symmetric. Front passing frame 1 is particularly restrained and reads almost as a close-foot neutral transition; the front/back sequences convey movement more through shoes and arms than through a visible crossing knee under the long skirt.
- The satchel stays on the correct anatomical hip, but its perspective and flap width vary somewhat across directions. Frame 2 of the side walk overlaps the near hand with the top of the bag more than the standing view does.

The comparison supports a close match in scale, muted palette and compact adult construction. It does not establish an exact match in facial design, contour economy or animation consistency.
