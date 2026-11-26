# Rogue — round 18

Delivered 15 original images in `big/`, 15 transparent 96×128 sprites in `sprites/`, the 1152×1536 sheet, and three 288×384 walk GIFs. Each GIF contains four frames at 160 ms per frame and loops indefinitely.

Sheet rows: standing front / right side / back / empty; walk-side 0–3; walk-front 0–3; walk-back 0–3. The sheet and GIF backgrounds are #4a4642.

## Method and checks

The right-facing side was designed from text first. Every subsequent view used that side as a reference. Front and rear walking redraws additionally used this run's corresponding standing view to reduce design drift. No earlier sprites, other characters, or outside reference images were used. All figure drawing and pose changes came from the image tool. Python performed keying, box downscaling, palette snapping, outlining, assembly, and checks only; no body parts were painted, composited, or warped with code.

Original returned PNG data is preserved in `big/`. Rejected drafts, processing code, decoded GIF review strips, and check results are in `../scratch/`.

Magenta was range-keyed before box reduction. The body is 92 pixels tall; the added one-pixel outline makes the complete occupied height 94 pixels. The lowest outline/foot edge is on zero-based row 124 in every 96×128 frame. Horizontal placement follows the head silhouette to avoid shifting the figure when an arm or foot extends.

The outline uses all eight touching neighbours and computes mean neighbour RGB × 0.32 + (8, 4, 10), rounded to integers. A final shared palette snap includes the outline, keeping the complete character at 48 opaque RGB colours across all 15 sprites. Consequently, delivered outline colours are palette approximations of that formula rather than every independently calculated RGB value. Alpha is strictly 0 or 255; no dithering is used. Enlargement is nearest-neighbour.

Verified: exact view inventory, PNG dimensions, 48-colour union, binary alpha, bottom row 124, no retained saturated-magenta pixels, sheet dimensions/background, and GIF dimensions, frame counts, and durations. Every generated original, all processed sprites on the full-size sheet, and every frame decoded from each GIF were visually inspected. GIF inspection was frame-by-frame; no in-engine motion test was performed.

## Redraws

- Replaced the initial side design because it was too tall and slender for the requested 3–3.5-head proportions.
- Replaced all four initial front walking frames: oversized eyes, missing mouth, scarf/head drift, and an unwanted white mark under one boot were corrected.
- Replaced all four initial rear walking frames to stabilize hair highlights and hood shape.
- Replaced side passing frame 1 because its feet were too far apart and read as another stride.

Ten rejected drafts remain in scratch; the output directories contain only the 15 selected views.

## Honest weaknesses

- The compact proportions are approximately 3.3–3.5 heads tall, but the large hair silhouette and simplified face still lean toward a stylized young RPG character rather than strict adult anatomy. The eyes are near the larger end of the requested range.
- The jerkin's bright shoulder and sleeve highlights can read as armour plates rather than soft leather. Hair highlights are warm grey/brown, so the black hair sometimes reads as very dark brown.
- Side contact frame 2 has a stronger arm swing and a slightly longer-looking stride than frame 0. The two passing poses remain subtly asymmetric in boot overlap and knee bend.
- The front/rear cycles use fairly strong boot foreshortening to distinguish the leading leg. They can read as stepping in place rather than a completely fluid relaxed stroll, especially without matching world movement.
- Small changes in hands, belt fittings, sheath angles, and trouser highlights remain between frames. The major head/hood drift was reduced by redraws, but these are independently drawn poses, not a perfectly locked animation rig.
- The far dagger is not consistently anatomically occluded in profile. Both sheaths remain readable, but their depth relationship is stylized.
- Box reduction and the shared palette soften some original pixel clusters. The sprites have binary edges and a crisp display grid, but the internal shading is denser than a sprite authored directly at 96×128. The added outline can also make narrow leg and arm gaps look heavy.
