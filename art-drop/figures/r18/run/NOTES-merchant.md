# Merchant — round 18

Completed 15 original images and 15 transparent sprites for this merchant only: standing front/side/back, then four frames each for side/front/back walking. The side views face right. Each original contains one figure on magenta.

## Method and checks

- Read CHARACTER.md, BRIEF.md and R17-METHOD.md in that order. No outside reference images, repositories or character folders were opened. The side design began from text; every subsequent generation used this run's side image as its reference.
- Every figure was drawn by the image tool. Python performed only keying, cropping, BOX downscaling, palette snapping, outlines, alignment, sheet/GIF assembly and checks. No anatomy or costume was painted or patched in code.
- Original returned image data was saved directly into this folder. The image service also reported an automatic external cache; that cache was not opened or read. Rejected originals and processing/check files are in scratch/.
- Originals have near-magenta backgrounds rather than literal #FF00FF throughout. The permitted range key was used. Originals in big/ are unmodified.
- All sprites are 96×128 with alpha values only 0 and 255. Content was BOX-downscaled to 92 pixels tall; the added one-pixel perimeter makes the final opaque height 94 pixels. The lowest opaque pixel is on zero-based row 124 in every frame. Frames are aligned by the head axis to avoid centering on moving hands.
- Exactly 48 opaque RGB colours are shared across the character: 40 interior colours and 8 outline colours. The outline starts from the eight touching neighbours' mean RGB × 0.32 + (8,4,10), then snaps to eight shared derived outline colours to preserve the overall palette limit. Consequently the final outline colours approximate, rather than reproduce every unquantized formula result.
- merchant-sheet.png is 1152×1536, a nearest-neighbour 3× enlargement on #4a4642. Rows are standing front/side/back (fourth cell empty), walkside0–3, walkfront0–3, walkback0–3.
- All three GIFs are 288×384, loop continuously, and contain four frames at 160 ms each. Every decoded GIF frame was verified to match its corresponding 3× sprite composite exactly.
- Visually inspected all generated originals, all 15 individual sprites at native dimensions, the full 1152×1536 sheet, and all decoded GIF frames at 3×. The animation assessment is based on the ordered frames; no separate real-time playback review is claimed.

## Redraws

The first side design was too tall. It was redrawn with a shorter torso and skirt before becoming the reference. The first walkside3 had an extra arm shape at the satchel; it was rejected and redrawn with clean visible-arm anatomy. Both rejected images remain in scratch/.

## Honest weaknesses

- The independent generations do not lock every pixel between frames. Headscarf diamonds, scarf tails, facial details, sleeve shapes, bag shape and skirt folds drift slightly. This is most noticeable in the front and back cycles.
- The middle-aged face reads more clearly in profile. At 92-pixel content height, front-facing age lines are subtle and the face looks softer/younger. Skin reads as warm golden tan rather than strongly olive.
- Proportions are compact, roughly three heads tall including the scarf; the rounded frontal head is still more stylized than a strictly naturalistic adult.
- The long skirt obscures most leg anatomy. Side contact frames have similar lower silhouettes, so opposite arm swing carries some of the alternating-leg read. The rear cycle has slightly uneven arm-swing amplitude and minor head-width variation.
- Passing feet stay low and there is no high-knee march, but four frames give a modest, slightly stiff walk. The contact-to-passing changes in skirt folds and bag shape may produce visible flicker in motion.
- BOX filtering and palette reduction leave a few blended-looking interior clusters. The added perimeter also makes parts of the existing dark source outline look heavier than one pixel. The result is crisp and uses binary alpha, but is not a uniformly hand-clustered pixel-art redraw.

Validation details are in scratch/checks.json and scratch/gif-checks.json; reproducible post-processing is in scratch/process.py and scratch/check_gifs.py.
