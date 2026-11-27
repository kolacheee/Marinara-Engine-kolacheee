# Mirel Sorn — Round 23 notes

## Delivered

- 15 image-tool originals in `big/`, each one full-body figure on magenta.
- 15 transparent 96 × 128 sprites in `sprites/`: standing front, right-facing side and back; four frames for each walking direction.
- `bard-sheet.png`: four rows, 3× nearest-neighbour display, #4a4642 background. The unused fourth standing cell is blank.
- `bard-walkside.gif`, `bard-walkfront.gif`, `bard-walkback.gif`: four frames each, 3×, 160 ms per frame, looping.
- `bard-face.png`: front crop, logical x 24–71 and rows 33–63, at 6×.
- `bard-vs-sheet.png`: Mirel, Wren, Hadrik, noble, in that order, at 3×.

## Production and checks

The image tool drew every figure, including every walking pose and every face revision. No body parts, expressions or poses were drawn or moved with Python. The style sheet was attached to every generation request with the required style-only instruction. Other image inputs were exclusively Mirel images from this run.

The first image was the right-facing side. Its revised version anchored the later views. The standing side received a final proportion revision using its own earlier side and walking drawings. Costume enrichment consists of ochre waistcoat edging, buttons, a narrow belt, thick cuffs and a trimmed wrap hem; the cittern remains the sole large prop.

Processing used magenta range keying, cropped BOX reduction to 92 occupied rows, centring, semantic skin/hair region masks, palette snapping and isolated-pixel cleanup within skin/hair masks. Feature regions protect eyes, brows, mouth and catches during cleanup. The masks combine spatial regions with source pigment; they are approximations, not perfect anatomical segmentations. No face pixels were painted into the sprites. There was no extra outline-painting pass.

Final automated checks passed: all 15 sprites are RGBA 96 × 128; alpha is only 0 or 255; occupied extents are rows 33 through 124 inclusive; the union is 21 opaque colours from the six prescribed ramps; no added ramp, pure black, pure white or retained magenta. All GIFs contain four frames with 160 ms duration. Validation details and the processing script are in `../scratch/`.

Every generated original was visually inspected. The final full-size sheet, face crop, comparison, all visible heads at 6×, and all decoded GIF frames were inspected. GIF frame inspection establishes frame appearance, not a guarantee of perfectly smooth motion.

## Redraws

- Rejected the initial tall-body side/front/back drawings because their heads were too small relative to the bodies. Redrew the side anchor and standing views.
- Redrew the back to correct a reversed skirt diagonal and a hanging right hand.
- Redrew `walkside0` to correct its reversed skirt diagonal.
- Redrew the standing front for stronger eye/brow definition after the reduced-face comparison.
- Redrew the standing side again to reduce its oversized head relative to the walk views.
- Redrew `walkside3` to distinguish the opposite passing pose with the rear foot lifted.
- `walkfront2` required two mouth-focused redraws after its first reduced mouth disappeared. The final mouth survives but is heavier than in the other frames.

Rejected drawings, prompts, processing records and review images are retained in `../scratch/`.

## Honest weaknesses and incomplete rules

This is a complete file set, but it is not an exact match to every artistic constraint.

- The faces and clothing contours remain softer and more densely shaded than the style sheet after BOX reduction. Eyes and brows are readable, but tiny eye catches are inconsistent. The front nose is broader than the requested small plane, and `walkfront2` has an overly heavy mouth. The reference sheet still has cleaner facial clusters.
- Head size is approximately four-head construction, with some profiles larger than the standing front. Crown and sole alignment is exact; intermediate body landmarks are not identical across frames.
- The gold bob, mature angular face, narrow waist, diagonal overskirt and cittern distinguish Mirel from the reference characters. However, the right-ear tuck is not consistently visible, and some bob sections have more highlight fragments than the intended four heavy locks.
- The waistcoat shoulders are slightly more flared, the sleeves fuller, and the back waistcoat hem longer than the fitted, waist-length specification. Some back frames suggest a short lower waist panel. Some source hands show too many finger divisions instead of simple mittens.
- The image tool added several tuning glints, a bridge fitting and a belt buckle, exceeding the requested single steel tuning accent. These are small, but the extra metal details remain.
- The walk is restrained and supported, but upper-body shapes, hair highlights and instrument details drift between separately drawn frames. Opposite side-contact legs are not as clearly distinguished as they should be, and the heavy skirt hides much of the front/back gait. These are usable short loops with visible variation, not perfectly registered production animation.
- Skin/hair masks are approximate at mixed boundary pixels; exact material membership of every antialiased source edge cannot be guaranteed. Only approved palette colours appear in the exports.
- The image service automatically created its own cache outside this folder. Those cached files were not opened or copied; returned image data was saved directly into this project. A mandatory image-workflow instruction file was read from the system skill location outside the folder. Thus the literal no-outside-read requirement was not fully met. No outside character art, other Downloads folders, repositories or existing sprites were read or used.
