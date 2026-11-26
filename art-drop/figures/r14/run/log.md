# Round 14: draw big (2x skeletons, ~92 px), show smaller: log

Only image inputs: art-drop/figures/r14/poses/big-*-896x1152.png (drawn from numbers; figure box 736 px, about 92 px after the 8x shrink). No IP-Adapter, no reference image, no earlier output, no game image.
Recipe: Pony V6 XL + sakuemonq LoRA 1.0, openpose 0.8 (start 0, end 1.0), CFG 5, euler_ancestral 24 steps, clip skip 2, 896x1152; every view (front, side, back, walk 0-3) is its own image with the same seed and text. Style tags on every positive: 'detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details'; negative adds 'neon, oversaturated, flat colors, lineless'.
Example positive (merchant front): `score_9, score_8_up, score_7_up, simple background, flat grey background, plain flat grey background, no gradient, full body, feet visible, fully clothed, standing, solo, front view, facing the viewer, face visible, looking at viewer, detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details, middle-aged woman, olive skin, dark hair under a patterned headscarf, mustard dress with a brown apron, satchel`
Example negative (merchant front): `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, multiple views, character sheet, multiple people, from behind, back view, neon, oversaturated, flat colors, lineless`

Cut: flood-fill from the border (tolerance 10); blobs of 6+ sprite px form the figure. Sprites in sprites/ are the plain 8x mode downsample, no post-processing.

## wren

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 91 | 90 | 95 | 90 | 92 | 89 | 92 | 0.2, 0.26, 0.18 | 136,138,136,138 |

## hadrik

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 120 | 124 | 122 | 135 | 136 | 135 | 136 | 0.38, 0.4, 0.25 | 136,140,136,140 |

## merchant

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 123 | 120 | 120 | 117 | 123 | 98 | 123 | 0.32, 0.31, 0.22 | 136,136,135,136 |

## priest

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 131 | 127 | 124 | 119 | 124 | 112 | 124 | 0.47, 0.4, 0.32 | 131,136,131,136 |

## guard

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 135 | 118 | 124 | 127 | 120 | 108 | 120 | 0.38, 0.2, 0.3 | 131,136,121,136 |

## farmhand

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 124 | 124 | 122 | 122 | 135 | 127 | 135 | 0.32, 0.38, 0.25 | 135,141,135,141 |

## noble

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 130 | 125 | 125 | 123 | 121 | 107 | 121 | 0.28, 0.28, 0.34 | 135,136,124,136 |

## innkeeper

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 119 | 92 | 120 | 91 | 91 | 90 | 91 | 0.54, 0.23, 0.23 | 136,137,135,137 |


## Same-person and look check (by eye, on the cut 8x sprites)

Bodies come out about 90 px tall, as the 2x skeleton intends; most measured heights read 107-136 px because oversized hats, hair, props or floating objects sit above the head (Wren and the innkeeper, at 89-95 px, have none).
A new failure at this size: on several front and back views the model draws the skeleton's legs literally as thin sticks (merchant, priest, guard, farmhand, noble, innkeeper fronts).

| character | same person across the 7 views? | notes |
|---|---|---|
| wren | yes | auburn ponytail, green cloak, leather jerkin and boots in all 7; clean, about 90 px; the best result of rounds 13-14 |
| hadrik | partly | the same dark-skinned bearded man throughout, but a huge hammer-like object floats above his head in every view |
| merchant | no | headscarf becomes a large patterned object on the head; stick legs on front and back |
| priest | no | a giant white orb or skull replaces the head; stick legs |
| guard | partly | red tabard carries over; the steel cap becomes a huge flat hat; stick legs on front and back |
| farmhand | mostly | same figure throughout, but the straw hat is a giant bushy disc; stick legs on the front |
| noble | mostly | golden updo and blue gold-trimmed gown in all 7; front and back stand on stick legs |
| innkeeper | mostly | green coat, apron and mug throughout; the front face is a pale skull-like mask, the back face a blob |

Compared with round 13 (~46 px): more costume detail and cleaner faces where it works (Wren, noble side and walk, innkeeper side), but hats and props get blown up and stick legs appear on front/back views.
raw/: the 8 best single images (wren front, side, walk 0; noble side, walk 1; innkeeper side; farmhand walk 0; hadrik front).
