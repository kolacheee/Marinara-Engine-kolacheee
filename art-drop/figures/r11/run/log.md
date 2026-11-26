# Round 11: chibi base body: log

Only image inputs: art-drop/figures/r11/poses/chibi-sheet-side-walk-back-1792x640.png and chibi-single-front-1024x640.png (drawn from numbers), and for the front, IP-Adapter setting C (0.40, style transfer, start 0.0, end 1.0) with reference = this run's own sheet raw at the same seed. No earlier round's output used.
Sheet: 1792x640, text + ControlNet openpose 0.8 (end 1.0), CFG 5, no IP-Adapter. Front: 1024x640 as round 9 plus IP-Adapter C. Pony V6 XL + sakuemonq LoRA 1.0, euler_ancestral 24 steps, clip skip 2.
Sheet positive (man): `score_9, score_8_up, score_7_up, plain flat grey background, chibi, big head, short body, short legs, small hands, full body, feet visible, adult man, bald head, plain grey short-sleeved shirt, plain dark grey shorts, bare arms, simple brown shoes, no accessories, no hair, medium brown skin, flat colors, simple shading, character sheet, same character, side view, walking, back view`
Sheet negative: `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, gradient background, vignette, scenery, hair, hat, hood, cloak, weapon, armor, jewelry, nude, nipples, muscular, child, multiple people, different people, crowd, gradient background, tall, long legs, realistic proportions`
Front positive (man): `score_9, score_8_up, score_7_up, plain flat grey background, chibi, big head, short body, short legs, small hands, full body, feet visible, adult man, bald head, plain grey short-sleeved shirt, plain dark grey shorts, bare arms, simple brown shoes, no accessories, no hair, medium brown skin, flat colors, simple shading, solo, front view, facing the viewer, face visible`

Cut: each 8x-downsampled image is flood-filled from its border (neighbouring pixels within 14 levels join the background), the largest remaining blob is the figure. Sheets are split into six 300 px (37.5 sprite px) columns at the skeleton positions, left to right side | walk 0-3 | back. Heights in sprite px; feet = bottom row of the figure. Head/height = rows from the top of the figure to its narrowest row (the neck) in the top 15-55%, over the figure height (0.33 = 3 heads tall, 0.40 = 2.5).

## man

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) | head/height front, side, back |
|---|---|---|---|---|---|---|---|---|---|
| 11 | 66 | 59 | 61 | 60 | 60 | 62 | 61 | 76,76,76,76 (0) | 0.14, 0.37, 0.36 |
| 23 | 69 | 53 | 56 | 55 | 55 | 55 | 37 | 76,76,76,76 (0) | 0.45, 0.26, 0.29 |
| 37 | 63 | 60 | 19 | 22 | 60 | 22 | 22 | 37,76,37,37 (39) | 0.37, 0.37, 0.11 |
| 41 | 68 | 27 | 28 | 63 | 63 | 26 | 30 | 77,77,38,39 (39) | 0.44, 0.15, 0.14 |
| 53 | 66 | 59 | 59 | 60 | 60 | 57 | 60 | 76,76,76,76 (0) | 0.53, 0.32, 0.31 |
| 67 | 77 | 61 | 59 | 60 | 59 | 61 | 60 | 76,76,76,76 (0) | 0.53, 0.36, 0.32 |
| 79 | 73 | 42 | 54 | 46 | 51 | 52 | 52 | 69,74,74,74 (5) | 0.45, 0.33, 0.3 |
| 97 | 72 | 19 | 19 | 19 | 19 | 19 | 20 | 39,38,38,39 (1) | 0.47, 0.11, 0.11 |

## woman

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) | head/height front, side, back |
|---|---|---|---|---|---|---|---|---|---|
| 11 | 66 | 60 | 61 | 60 | 60 | 62 | 60 | 76,76,76,76 (0) | 0.17, 0.37, 0.36 |
| 23 | 70 | 38 | 23 | 18 | 55 | 55 | 55 | 39,76,76,76 (37) | 0.44, 0.16, 0.13 |
| 37 | 72 | 60 | 39 | 23 | 22 | 61 | 22 | 38,37,76,37 (39) | 0.46, 0.33, 0.18 |
| 41 | 70 | 64 | 28 | 64 | 63 | 25 | 46 | 77,77,37,55 (40) | 0.46, 0.39, 0.14 |
| 53 | 66 | 20 | 18 | 20 | 20 | 58 | 60 | 37,36,76,76 (40) | 0.5, 0.15, 0.11 |
| 67 | 77 | 61 | 59 | 61 | 60 | 61 | 60 | 76,76,76,76 (0) | 0.53, 0.36, 0.32 |
| 79 | 70 | 51 | 37 | 45 | 51 | 44 | 52 | 68,74,67,74 (7) | 0.46, 0.27, 0.51 |
| 97 | 71 | 37 | 19 | 19 | 30 | 57 | 57 | 39,49,76,76 (37) | 0.48, 0.38, 0.11 |


## Same-body check (by eye, on the cut 8x sprites)

Cut caveat: when a sheet cell shows only a head (heights 18-30 px, head/height 0.11-0.16), the flood-fill kept the largest blob, which was the head, and dropped a body joined by a thin neck. Those rows are partly my cut's fault, not missing bodies; the raws show the full figures.

| body / seed | same body in all 7? | notes |
|---|---|---|
| man 11 | sheet yes; front no | sheet: clean chibi, about 3 heads tall (0.36-0.37); front: head grows to fill the frame (0.14 is a mis-measure of a giant head) |
| man 23 | partly | sheet ok, walk 3 cut lost; front pink with a much bigger head |
| man 37 | no | several cells lost to the head-only cut; front has a bigger head |
| man 41 | no | huge heads in the sheet |
| man 53 | sheet yes; front no | sheet consistent; front head about twice as big (0.53) |
| man 67 | sheet yes; front no | sheet clean and consistent (0.32-0.36); front head huge (0.53) |
| man 79 | sheet mostly | darker, browner skin than the others; thin legs; front head big |
| man 97 | no | sheet cut to heads only |
| woman 11 | sheet yes; front no | as man 11 |
| woman 23 | no | sheet cells lost; front pink |
| woman 37 | no | heads only in several cells |
| woman 41 | no | huge heads |
| woman 53 | no | sheet cells lost |
| woman 67 | sheet yes; front no | as man 67 |
| woman 79 | sheet mostly | as man 79 |
| woman 97 | no | sheet cells lost |

Summary:
- The sheets reach the brief's chibi proportions where they come out clean: head about a third of the height (0.32-0.37, i.e. ~3 heads tall), figures 56-62 px. Best: seed 67 and seed 11 for both bodies, then man 53.
- Every front overshoots: the IP-Adapter front grows a much larger head (head/height 0.44-0.53, about 2 heads tall), so no seed gives the same body in all 7 images.
- Skin is pink-peach in nearly every image instead of medium brown (only seed 79 comes out browner); the man and woman bodies are almost indistinguishable.
- Walk feet stay on one row (spread 0) wherever the cells cut whole.
Raws for seeds 67, 11 and 53 (sheet + front, both bodies) are in raw/.
