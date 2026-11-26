# Round 12: base bodies with the round-8d front method: log

Only image inputs: the skeletons in art-drop/figures/r8/poses/ (single-front/side/back-1024x640, walk-side-0..3-1024x640; drawn from numbers) and, for side/back/walk, IP-Adapter setting C (0.40, style transfer, start 0, end 1.0) referencing this run's own front at the same seed. No earlier round's output used.
Front pipeline = round 8d's front exactly (Pony V6 XL + sakuemonq LoRA 1.0, 1024x640, openpose 0.8 start 0 end 1.0, euler_ancestral 24, CFG 5, clip skip 2). Only the character text changes; the Wren/Hadrik-specific negatives are dropped for the base bodies.
Control image control-wren-front-41 (exact 8d Wren text, seed 41) bit-identical to 8d's wren-front-41: no.
Body positive (woman front): `score_9, score_8_up, score_7_up, simple background, flat grey background, plain flat grey background, no gradient, full body, feet visible, fully clothed, standing, solo, front view, facing the viewer, face visible, looking at viewer, young woman, short neat dark brown hair, plain grey tunic, plain brown trousers, simple brown boots, medium brown skin, empty hands`
Body negative (front): `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, multiple views, character sheet, multiple people, from behind, back view`

Cut: flood-fill from the border (neighbours within 10 levels join the background); all remaining blobs of 6+ sprite px form the figure. Head/height = rows from the top to the narrowest row (neck) in the top 15-55%, over the height.

## man

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 11 (picked) | 70 | 61 | 63 | 67 | 63 | 67 | 63 | 0.31, 0.28, 0.24 | 76,75,76,75 |
| 23 | 68 | - | - | - | - | - | - | 0.31, None, None | - |
| 37 (picked) | 66 | 67 | 66 | 66 | 68 | 64 | 68 | 0.29, 0.33, 0.26 | 75,76,75,76 |
| 41 | 64 | - | - | - | - | - | - | 0.31, None, None | - |
| 53 | 70 | - | - | - | - | - | - | 0.14, None, None | - |
| 67 (picked) | 60 | 59 | 60 | 62 | 62 | 59 | 62 | 0.2, 0.27, 0.17 | 77,77,74,77 |
| 79 | 72 | - | - | - | - | - | - | 0.36, None, None | - |
| 97 | 61 | - | - | - | - | - | - | 0.18, None, None | - |

## woman

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 11 (picked) | 74 | 57 | 59 | 60 | 59 | 59 | 59 | 0.15, 0.3, 0.25 | 76,75,75,75 |
| 23 | 72 | - | - | - | - | - | - | 0.36, None, None | - |
| 37 (picked) | 65 | 63 | 63 | 62 | 63 | 62 | 63 | 0.31, 0.32, 0.25 | 75,75,75,75 |
| 41 | 64 | - | - | - | - | - | - | 0.31, None, None | - |
| 53 | 68 | - | - | - | - | - | - | 0.15, None, None | - |
| 67 (picked) | 71 | 71 | 76 | 75 | 76 | 67 | 76 | 0.32, 0.37, 0.37 | 77,77,75,77 |
| 79 | 71 | - | - | - | - | - | - | 0.2, None, None | - |
| 97 | 75 | - | - | - | - | - | - | 0.35, None, None | - |


## Picks and same-body check (by eye, on the 8x sprites)

Step-1 picks (the plainest fronts matching the base-body text): man 11, 37, 67; woman 11, 67, 37. Rejected fronts came out with ponchos (23), a dark cloak (man 53), flame hair (man 79), a blank white face (man 97), spindly legs (41) or a long dress (woman 79).
Control: control-wren-front-41 shows the same look as 8d's Wren seed-41 front (red hair, green cloak, short chunky build) but is not bit-identical; likely GPU non-determinism or the ComfyUI restart between runs.

Side/back/walk follow their skeletons in all 36 images (side and walk in profile facing right, back from behind). Backgrounds have soft gradients again on most side/back/walk images; the tolerance-10 flood-fill still separates the figures.

| body / seed | same body in all 7? | notes |
|---|---|---|
| man 11 | partly | hair turns from black to blue; skin paler; trousers become short with bare shins over the boots |
| man 37 | mostly yes | black hair, dark skin, grey tunic, brown trousers and boots carry over; face pinker in profile |
| man 67 | mostly yes | dark teal-black hair, grey tunic, brown trousers and boots carry over; pink-blue gradient background |
| woman 11 | no | dark brown bun becomes a mauve bob; skin pinker; trousers read as a short skirt |
| woman 67 | no | hair balloons into a huge orange mass; shirt turns lavender |
| woman 37 | mostly yes | brown bob, grey tunic, short brown trousers, boots carry over; pink blush on the face |

Best: man 37 and man 67, woman 37. Walk feet stay on one row (spread 1-3 px). Raws for all 6 picked seeds are in raw/.
