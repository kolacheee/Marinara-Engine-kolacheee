## wren
# Wren — final notes

## Delivered

- `big/wren-<view>.png`: seven unmodified image-tool originals, 1096 × 1435.
- `sprites/wren-<view>.png`: seven transparent 96 × 128 sprites; front, side, back, walk0, walk1, walk2, walk3.
- `wren-sheet.png`: 2016 × 384, nearest-neighbour 3× display, ordered front | side | back | walk0 | walk1 | walk2 | walk3, on #4a4642.
- `wren-walk.gif`: 288 × 384, four frames, 160 ms each, infinite loop, on #4a4642.

## Method and checks

The side design was made first from text. Each subsequent view used that same selected side image as its reference. The first side attempt was rejected for elongated proportions; the first front attempt was replaced because its bow was too short. Nine images were generated in total; seven are delivered. Rejected attempts and the processing script remain in `../scratch/`.

Every figure was drawn by the image tool. Python only keyed the background, box-downscaled, set binary transparency, positioned the images, calculated outlines, snapped colours, assembled the sheet/GIF, and checked the results. No anatomy, equipment, costume or individual sprite pixels were hand-painted.

All accepted originals use a common canvas and were box-downscaled to 81 × 106 before placement in 96 × 128 frames. The same scale preserves character size across views. Final visible bounds, including bow and outline, are 92 pixels tall except walk0 and walk2, which are 91. The bottom boot outline lies on zero-indexed row 124; rows 125–127 are transparent. There are exactly 48 visible RGB colours across the whole seven-image set, with alpha restricted to 0 or 255.

The outer outline is one pixel wide, using all eight touching neighbours and `mean neighbour RGB × 0.32 + (8, 4, 10)`, rounded to integers. A final shared palette snap includes the outline so the complete character stays within 48 colours. Consequently final outline colours approximate the formula rather than preserving every calculated RGB value exactly. No dithering was used.

Every generated original was visually inspected. The final seven sprites were inspected individually, the complete 2016 × 384 sheet was opened at its full size, and all four frames decoded from the final GIF were inspected. GIF timing, dimensions, frame count, palette size, transparency and bottom alignment were checked programmatically. Detailed measurements are in `../scratch/checks.json`.

## Honest weaknesses

- The originals' backgrounds are near-magenta with small colour variations, not perfectly flat literal #FF00FF despite the prompts. A magenta-range key removes them. The originals are preserved unchanged, so this source requirement is not exact.
- Proportions are approximately 3.3–3.5 heads tall. The large eyes and head still give a youthful, slightly doll-like appearance rather than fully adult field-sprite anatomy.
- The ponytail is short and rounded and can read as a bun at small size. The cloak is olive green rather than a strong forest green.
- The walk has clear alternating contact and passing poses, but the lifted knees are exaggerated. Cloak shape and small outfit details vary between frames, and the one-pixel contact/passing height change can produce a slight bob. This is a readable four-frame walk, not a thoroughly polished animation.
- Bow curvature, string visibility, quiver angle and costume folds are not perfectly consistent across views. The front bow was corrected for length, but portions of its string merge into the silhouette after reduction.
- Box reduction and palette snapping soften some internal pixel clusters. At 3×, hair and leather have more texture than a deliberately hand-clustered low-resolution sprite. The added outline also makes fine gaps and the bowstring relatively heavy.
- The face and equipment remain readable at the delivered size, but fine eye, finger and arrow detail will be much less distinct when displayed at half size. No in-game integration or movement test was performed.

All task file access and processing stayed inside this folder; no external sprites, other run folders or repositories were opened. The image service automatically reported its own external cache location, which was not opened or read. Local originals were saved from the returned image data. No clone, commit or publication was performed because this task explicitly restricted work to this folder.

## innkeeper
# Innkeeper — delivery notes

## Files

- `big/innkeeper-{front,side,back,walk0,walk1,walk2,walk3}.png`: seven selected, unmodified image-tool originals, each 1082 × 1454 on magenta.
- `sprites/innkeeper-<view>.png`: seven transparent 96 × 128 sprites.
- `innkeeper-sheet.png`: 2016 × 384, nearest-neighbour 3× display, ordered front | side | back | walk0 | walk1 | walk2 | walk3 on `#4a4642`.
- `innkeeper-walk.gif`: 288 × 384, four frames in order, 160 ms each, looping, on the same grey background.

## Method and checks

The side view was drawn first from text. Every subsequent view and the replacement back view used only that side image as its visual reference. Every figure was drawn by the image tool. No existing sprites, screenshots, other characters, or outside reference files were used.

Processing keyed out magenta, cropped the figure, and used BOX resampling to reduce the body to 90 pixels tall. A binary alpha threshold of 128 was applied. The body was placed on rows 34–123; the added one-pixel outline brings the complete silhouette to 92 pixels tall, rows 33–124 inclusive. Horizontal placement follows the head centre to reduce stride-dependent sideways drift. No body parts were drawn, retouched, warped, or spliced with code.

Every transparent pixel touching the reduced body in its eight-neighbourhood received an outline calculated as the mean opaque neighbour colour × 0.32 + (8, 4, 10), rounded to integer RGB. The complete figures, including that outline, were then snapped without dithering to one shared palette of 48 opaque colours. Thus the final outline colours are palette approximations of the formula. Six palette entries were reserved for source-derived neutral shades to preserve the pewter mugs. Transparency is separate from the 48 opaque colours; every PNG alpha value is exactly 0 or 255.

Checks confirmed all seven frame dimensions, 92-pixel silhouette heights, bottom occupied row 124, shared colour limit, binary alpha, sheet dimensions, and four GIF durations of 160 ms. The GIF background adds one presentation colour. All originals were visually inspected, as were all final sprites, the complete sheet at its saved 2016 × 384 size, all four decoded GIF frames, and a half-size preview. GIF inspection was frame-by-frame, not real-time playback.

The first back view had boots that read as forward-facing toes. It was redrawn with visible rear heel counters and seams. The rejected original is retained in `../scratch/innkeeper-back-rejected.png`. The initial palette also made the mug too brown; neutral shades were restored and the outputs checked again. Processing code, check results, and inspection intermediates are in `../scratch/`.

## Honest weaknesses

- This is a readable, warm tavern character, but the large eyes and rounded head lean more cartoonish than the restrained adult field-sprite reference. The silhouette is closer to 3½ heads tall than exactly three.
- The walk has clear contact and passing silhouettes, but opposite-leg identity is subtle under the long apron. The two contact frames are similar in silhouette, and the lifted boot rises more in walk3 than walk1. This is a serviceable four-frame walk, not a fully polished gait.
- Separate drawings introduce small changes in apron folds, ties, shading, and head/torso registration. Head-based alignment limits lateral movement but does not remove all one-pixel shimmer. The torso stays rather rigid while carrying the mug.
- BOX reduction merges some of the original pixel clusters. The final alpha edges are crisp, but interior shading is denser and softer-looking than a sprite authored directly on the final grid. The required extra outline also makes some edges heavy.
- Facial detail, the mug handle, waistcoat trim, and apron knot become crowded at half size. The bald head, moustache, green waistcoat, apron, and mug silhouette remain identifiable; fine detail does not all survive.
- He has a bald crown with substantial brown hair at the sides and back, rather than a completely hairless scalp. Apron tie placement and coat-tail details are not perfectly consistent between views.

## Workspace boundary

Only the supplied CHARACTER.md and BRIEF.md and files created inside this folder were read as task inputs. No repositories were opened and no clone or commit was performed. The image service automatically reported cache copies outside this folder; those paths were not opened or copied. Originals here were saved directly from the returned image bytes. All deliberate file writes and all processing intermediates stayed in this folder.

## guard
# Guard — Round 17

## Delivered

- `big/guard-{front,side,back,walk0,walk1,walk2,walk3}.png`: seven untouched final image-tool originals, 1254×1254 each.
- `sprites/guard-{front,side,back,walk0,walk1,walk2,walk3}.png`: seven 96×128 RGBA sprites.
- `guard-sheet.png`: 2016×384, nearest-neighbor 3×, ordered front | side | back | walk0 | walk1 | walk2 | walk3, background #4a4642.
- `guard-walk.gif`: 288×384, four frames in order, 160 ms each, looping, on #4a4642.

## Method and checks

The built-in image tool drew every figure. The side was generated first from text; every subsequent image, including the replacement passing pose, used only that side image as its visual reference. Eight images were generated in total: seven final images and one rejected high-knee walk3, retained in `../scratch/guard-walk3-rejected-high-knee.png`.

Python/Pillow performed only magenta keying, cropping, BOX downscaling, positioning, palette snapping, outline processing, sheet/GIF assembly, and checks. No figure or anatomical feature was drawn or hand-edited in code.

The source background is near-magenta with small RGB variations, rather than perfectly uniform #FF00FF. A chroma threshold removed those variations before BOX downscaling. The resulting alpha was thresholded to 0 or 255. Each transparent pixel adjacent to the figure in the eight-neighbor neighborhood received mean neighboring opaque RGB × 0.32 + (8, 4, 10), rounded to integer channels. A final shared palette snap limits the complete character, including this outline and every view, to 48 visible RGB colors. Consequently, the delivered outline colors approximate the formula after palette snapping.

Every complete silhouette, including the spear and added outline, is exactly 92 pixels high, occupying rows 33–124 inclusive. The boot outline ends on row 124; the helmet-to-boot body is approximately 85–86 pixels because the spear extends above it. Body anchoring avoids centering each changing stride bounding box independently.

Verified all seven sprite dimensions, binary alpha, shared 48-color union, baseline, absence of remaining keyed magenta, and frame containment. The sheet pixels exactly match nearest-neighbor enlargements of the sprites. All four decoded GIF frames exactly match their sheet cells and have 160 ms durations. Every generated original was visually reviewed, as were all seven sprites, the final sheet at its full 2016×384 size, and all four decoded GIF frames. Static frame inspection does not establish that the animation is perfectly fluid.

Reproducible processing: `../scratch/process.py`. Numeric results and palette: `../scratch/checks.json`. Exact final prompts and the rejected prompt: `../scratch/prompts.json`.

## Honest weaknesses

- The proportions are leaner and taller than the requested approximately three-head figure: closer to four to four-and-a-half helmeted head heights. This is a style mismatch, despite consistent identity across views.
- Chainmail was generated as a dense checker pattern. Reduction softens it into a busy texture; it lacks the deliberate sparse clusters of finely authored small pixel art.
- BOX filtering and palette reduction keep the final pixels crisp but do not make the original grid perfectly regular. Some material shading has more tonal variation than a strict three- or four-tone material ramp.
- The two contact poses have slightly different stride lengths. Near/far leg identity is suggested by arm swing, overlap, and shading, but the long tabard obscures the thighs, so the opposite-leg contact is not unambiguous.
- The replacement walk3 fixes the excessive high knee, but its lifted foot reaches farther forward than an ideal passing position. Walk1 still bends the knee more. Together with changing cloth folds, this makes the cycle somewhat stiff and uneven.
- The spear remains very rigid and its butt stays near the ground in all frames. It can read as dragging or intersecting the forward boot. There is little torso bob or spear follow-through.
- The added one-pixel outline sits outside an already dark generated edge, so parts of the contour feel heavier than a single authored pixel outline.
- Hair and face detail are readable at 3× but simplify substantially at native size, and more still at half-size town rendering.

## Scope accounting

No other character, external artwork, earlier-round sprite, game screenshot, repository, or Downloads sibling was inspected. All deliverables and manually created intermediate files are in this folder; no commit or clone was attempted, following CHARACTER.md's local output requirement and the explicit folder restriction.

There was one read outside the requested folder: the installed image-generation `SKILL.md`, required by the assistant's workflow instructions. The image service also reported automatic original copies in its own default storage outside this folder. Those locations were not opened or listed; the returned image bytes were saved directly into this folder. These are exceptions to the requested absolute folder boundary, and this run should not be described as having observed that boundary without exception.

