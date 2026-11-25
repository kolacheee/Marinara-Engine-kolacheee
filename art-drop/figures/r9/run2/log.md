# Round 9b: base body from one side/walk/back sheet + front referencing it: log

Only image inputs: art-drop/figures/r8/poses/sheet-side-walk-back-1792x640.png and single-front-1024x640.png (drawn from numbers), and for the front, IP-Adapter setting C (0.40, style transfer, start 0.0, end 1.0) with reference = this run's own sheet raw at the same seed. No earlier round's output used.
Sheet: 1792x640, text + ControlNet openpose 0.8 (end 1.0), CFG 5, no IP-Adapter. Front: 1024x640 as round 9 plus IP-Adapter C. Pony V6 XL + sakuemonq LoRA 1.0, euler_ancestral 24 steps, clip skip 2.
Sheet positive (man): `score_9, score_8_up, score_7_up, plain flat grey background, full body, feet visible, standing, adult man, average build, bald head, plain grey long-sleeved undershirt, plain grey leggings, simple grey shoes, no accessories, no hair, medium brown skin, neutral expression, flat colors, simple shading, character sheet, same character, multiple views, side view, walking, back view`
Sheet negative: `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, group, crowd, grass, scenery, landscape, detailed background, gradient background, vignette, scenery, hair, hat, hood, cloak, weapon, armor, jewelry, nude, nipples, muscular, chibi, child, different people, crowd`
Front positive (man): `score_9, score_8_up, score_7_up, plain flat grey background, solo, full body, feet visible, standing, adult man, average build, bald head, plain grey long-sleeved undershirt, plain grey leggings, simple grey shoes, no accessories, no hair, medium brown skin, neutral expression, flat colors, simple shading, solo, front view, facing the viewer, face visible, looking at viewer`

Cut: each 8x-downsampled image is flood-filled from its border (neighbouring pixels within 14 levels join the background), the largest remaining blob is the figure. Sheets are split into six 300 px (37.5 sprite px) columns at the skeleton positions, left to right side | walk 0-3 | back. Heights in sprite px; feet = bottom row of the figure.

## man

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) |
|---|---|---|---|---|---|---|---|---|
| 11 | 61 | 59 | 58 | 59 | 58 | 59 | 59 | 76,76,76,76 (0) |
| 23 | 47 | 56 | 57 | 56 | 45 | 56 | 56 | 76,76,76,76 (0) |
| 37 | 60 | 59 | 58 | 58 | 59 | 58 | 60 | 77,77,77,78 (1) |
| 41 | 64 | 58 | 59 | 59 | 60 | 59 | 58 | 77,77,77,76 (1) |
| 53 | 59 | 58 | 27 | 58 | 35 | 57 | 58 | 76,76,76,76 (0) |
| 67 | 62 | 59 | 60 | 59 | 59 | 59 | 59 | 77,77,77,77 (0) |
| 79 | 61 | 56 | 57 | 56 | 56 | 49 | 56 | 76,76,69,76 (7) |
| 97 | 61 | 34 | 34 | 55 | 57 | 56 | 35 | 76,76,76,76 (0) |

## woman

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) |
|---|---|---|---|---|---|---|---|---|
| 11 | 61 | 59 | 58 | 59 | 59 | 59 | 60 | 76,76,76,76 (0) |
| 23 | 71 | 58 | 59 | 58 | 58 | 58 | 52 | 76,76,76,76 (0) |
| 37 | 62 | 61 | 61 | 61 | 60 | 61 | 61 | 77,77,77,77 (0) |
| 41 | 66 | 63 | 48 | 63 | 36 | 62 | 47 | 77,77,77,77 (0) |
| 53 | 59 | 58 | 33 | 50 | 58 | 34 | 58 | 68,76,76,76 (8) |
| 67 | 63 | 62 | 63 | 61 | 61 | 60 | 61 | 77,77,77,77 (0) |
| 79 | 60 | 56 | 35 | 45 | 56 | 45 | 56 | 65,76,65,76 (11) |
| 97 | 61 | 57 | 34 | 56 | 36 | 35 | 57 | 76,76,76,76 (0) |


## Same-body check (by eye, on the cut 8x sprites)

The sheet keeps one body across side, back and walk 0-3 in every seed (same skin, clothes and proportions within the image), and its backgrounds are flat grey. Heights are 56-63 px for nearly all sheet figures. Where a sheet cell reads 27-49 px, the flood-fill cut lost part of a light shirt into the grey background or the figure is broken; see the notes.

| body / seed | same body in all 7? | notes |
|---|---|---|
| man 11 | yes | orange-brown skin, white tee, grey trousers; front a little redder |
| man 23 | no | front has no head (headless shirt) |
| man 37 | mostly | sheet matches; front skin redder/pinker |
| man 41 | partly | sheet matches; front pink-skinned, sheet orange-brown |
| man 53 | no | back cell lost (only the shirt survives the cut); walk 1 broken |
| man 67 | mostly | white tee and navy trousers match across all 7; front skin pinker |
| man 79 | no | cuts break up (pale shirt on dark skin), back is a dark different figure |
| man 97 | no | side and back cells come out as fragments |
| woman 11 | yes | as man 11 |
| woman 23 | no | front has an oversized pink head |
| woman 37 | mostly | sheet matches; front pinker with red legs |
| woman 41 | no | broken cuts and oversized heads in side and walk 0/2 |
| woman 53 | no | back cell is legs only |
| woman 67 | mostly | white tee, navy leggings across all 7; front pinker |
| woman 79 | no | back and several walk cells broken |
| woman 97 | no | back and walk 1/2 cells broken |

Seeds giving the same body in all 7: 11 for both bodies (yes), with 37 and 67 close (only the front's skin is pinker). Raws for seeds 11, 37 and 67 (sheet + front, both bodies) are in raw/.
Still off-brief in every seed: white short-sleeved tees instead of grey long sleeves, and skin orange-brown to pink rather than medium brown. Walk feet stay on one row (spread 0-1 px) in every seed whose cells cut cleanly.
