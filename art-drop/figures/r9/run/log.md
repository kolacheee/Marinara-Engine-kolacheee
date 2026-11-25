# Round 9: neutral base body: log

Only image inputs: skeletons in art-drop/figures/r8/poses/ (drawn from numbers) and, for side/back/walk, IP-Adapter setting C (ip-adapter-plus_sdxl_vit-h, 0.40, style transfer, start 0.0, end 1.0) with reference = this run's fresh front at the same seed. No earlier round's output used.
Pony V6 XL + sakuemonq LoRA 1.0, xinsir union promax openpose 0.8 (start 0, end 1.0), euler_ancestral 24 steps, CFG 5, clip skip 2, 1024x640. Seeds 11/23/37/41.
Positive (man shown): `score_9, score_8_up, score_7_up, plain flat grey background, solo, full body, feet visible, standing, adult man, average build, bald head, plain grey long-sleeved undershirt, plain grey leggings, simple grey shoes, no accessories, no hair, medium brown skin, neutral expression, solo, front view, facing the viewer, face visible, looking at viewer`
Negative (front): `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, multiple views, character sheet, multiple people, from behind, back view, gradient background, vignette, scenery, hair, hat, hood, cloak, weapon, armor, jewelry, nude, nipples, muscular, chibi, child, multiple people`

Heights after the exact 8x downsample with grid-phase search. 'bg spread' = 95th percentile of the border pixels' max channel distance from the border median in the raw (low = flat; above ~12 means a visible gradient). Feet line = bottom row of the figure in each walk frame (8x px).

## man

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | bg spread (f/s/b/w0-3) | walk feet line |
|---|---|---|---|---|---|---|---|---|---|
| 11 | 60 | 52 | 78 | 59 | 76 | 51,37 | 76 | 3/40/30/24/23/29/23 | 79,77,71,77 (spread 8 px) |
| 23 | 45 | 54 | 46 | 59 | 75 | 59 | 75 | 4/19/18/17/19/18/19 | 78,78,78,78 (spread 0 px) |
| 37 | 61 | 78 | 78 | 64 | 61 | 65 | 61 | 37/56/64/61/52/60/52 | 79,78,79,78 (spread 1 px) |
| 41 | - | 49,57 | 36 | 78 | 78 | 78 | 78 | 20/45/31/46/47/41/47 | 79,79,79,79 (spread 0 px) |

Best 2 seeds for man by mean figure score (all 7 raws in raw/): seed 37 (0.85), seed 41 (0.76)

## woman

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | bg spread (f/s/b/w0-3) | walk feet line |
|---|---|---|---|---|---|---|---|---|---|
| 11 | 51 | 46 | 50 | 56 | 60 | 59 | 60 | 2/13/12/8/13/12/13 | 76,78,79,78 (spread 3 px) |
| 23 | 40 | 41 | 49 | 74 | 74 | 74 | 74 | 4/17/21/21/22/23/22 | 78,78,78,78 (spread 0 px) |
| 37 | 61 | 78 | 78 | 66 | 78 | 66 | 78 | 36/88/69/70/48/71/48 | 79,79,79,79 (spread 0 px) |
| 41 | 31 | 61,58 | 78 | 78 | 78 | 78 | 78 | 12/50/36/51/55/56/55 | 79,79,79,79 (spread 0 px) |

Best 2 seeds for woman by mean figure score (all 7 raws in raw/): seed 41 (0.75), seed 37 (0.71)


## Facing, same-body and walk check (by eye, on the 8x-downsampled sheets)

Measurement caveat: most side/back/walk images have soft grey-blue or purple gradient backgrounds (bg spread 12-88 in the table), so the cutter often grabs background and many heights read 74-78 px and the walk "feet line" reads 78-79 (the canvas bottom). Those numbers are not real figure heights or foot positions. The fronts mostly have flat backgrounds (bg spread 2-37).

| body / seed | front | side / back facing | walk frames | same body across the 7? (head shape, skin tone, clothes colour, proportions) |
|---|---|---|---|---|
| man 11 | clean, brown skin, white short-sleeved tee, dark trousers | yes / yes | 4 clear side-walk poses, feet on one line by eye | partly: shape and clothes hold; skin turns orange-red on all 6 IP-Adapter images |
| man 23 | broken: thin stick-figure limbs, huge head (the skeleton drawn literally) | balloon head on side; back ok-ish | mixed: frames 0 and 2 normal, frames 1 and 3 huge balloon head | no |
| man 37 | clean, brown skin, light shirt, dark trousers | yes / yes | 4 clear walk poses, feet on one line by eye | partly: proportions and clothes hold (trousers turn blue); skin turns pink-purple |
| man 41 | broken: stick limbs, pink skin | balloon head on side; back stick-like | walk frames normal-proportioned, pink skin | no |
| woman 11 | clean, brown skin, white tee, dark leggings | yes / yes | 4 clear walk poses, feet on one line by eye | partly: shape and clothes hold; skin turns orange-pink |
| woman 23 | broken: stick limbs, big head | huge balloon head on side and back | all 4 frames huge balloon head | no |
| woman 37 | clean-ish, brown skin, light shirt, dark leggings | yes / yes | 4 clear walk poses | partly: proportions hold; skin turns pink; leggings blue |
| woman 41 | broken: stick limbs, pale head | huge balloon head on side and back | balloon head, frame 2 normal | no |

Other notes:
- Clothes: every body comes out in a white or light short-sleeved tee, not the requested plain grey long-sleeved undershirt; leggings are dark or blue rather than grey.
- Seeds 23 and 41 (both bodies) render the openpose skeleton literally on the front (thin black stick limbs), and IP-Adapter then copies the oversized head into the other views.
- Seeds 11 and 37 are usable as base-body candidates for shape and walk; skin tone needs fixing on all IP-Adapter views (it drifts from the fronts' medium brown to orange/pink).
- Feet stay on one ground line across the walk frames for seeds 11 and 37 (by eye; the measured feet line is unreliable because of the gradient backgrounds).
