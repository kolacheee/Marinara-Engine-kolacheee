# Round 13: OT2-like field sprites, one view per image, small skeletons: log

Only image inputs: art-drop/figures/r13/poses/small-*.png (drawn from numbers; figure box 368 px, about 46 px after the 8x shrink). No IP-Adapter, no reference image, no earlier output, no game image.
Recipe: Pony V6 XL + sakuemonq LoRA 1.0, openpose 0.8 (start 0, end 1.0), CFG 5, euler_ancestral 24 steps, clip skip 2, 1024x640; every view (front, side, back, walk 0-3) is its own image with the same seed and text. Style tags on every positive: 'detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details'; negative adds 'neon, oversaturated, flat colors, lineless'.
Example positive (merchant front): `score_9, score_8_up, score_7_up, simple background, flat grey background, plain flat grey background, no gradient, full body, feet visible, fully clothed, standing, solo, front view, facing the viewer, face visible, looking at viewer, detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details, middle-aged woman, olive skin, dark hair under a patterned headscarf, mustard dress with a brown apron, satchel`
Example negative (merchant front): `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, multiple views, character sheet, multiple people, from behind, back view, neon, oversaturated, flat colors, lineless`

Cut: flood-fill from the border (tolerance 10); blobs of 6+ sprite px form the figure. Sprites in sprites/ are the plain 8x mode downsample, no post-processing.

## wren

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 64 | 51 | 68 | 50 | 51 | 47 | 51 | 0.14, 0.18, 0.15 | 75,76,74,76 |
| 23 | 50 | 46 | 49 | 47 | 49 | 45 | 49 | 0.14, 0.3, 0.14 | 75,76,74,76 |

## hadrik

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 64 | 52 | 47 | 50 | 51 | 57 | 51 | 0.14, 0.21, 0.19 | 76,76,74,76 |
| 23 | 65 | 74 | 64 | 64 | 74 | 62 | 74 | 0.31, 0.42, 0.36 | 76,76,75,76 |

## merchant

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 54 | 62 | 64 | 50 | 66 | 57 | 66 | 0.26, 0.37, 0.39 | 60,74,67,74 |

## priest

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 70 | 70 | 70 | 72 | 67 | 69 | 67 | 0.4, 0.46, 0.41 | 74,74,74,74 |

## guard

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 72 | 73 | 72 | 67 | 72 | 67 | 72 | 0.44, 0.45, 0.43 | 71,74,71,74 |

## farmhand

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 66 | 68 | 66 | 68 | 68 | 66 | 68 | 0.36, 0.44, 0.38 | 76,76,75,76 |

## noble

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 69 | 65 | 67 | 66 | 66 | 64 | 66 | 0.36, 0.31, 0.3 | 74,76,74,76 |

## innkeeper

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 64 | 67 | 74 | 67 | 67 | 67 | 67 | 0.23, 0.24, 0.23 | 75,75,75,75 |


## Same-person and look check (by eye, on the cut 8x sprites)

Heights run 45-74 px rather than the skeleton's ~46: big hair, hats, cloaks, staffs and spears extend past the skeleton box, and a few cells pick up loose objects. The bodies themselves sit close to the skeleton height.

| character / seed | same person across the 7 views? | notes |
|---|---|---|
| wren 41 | mostly | side, back and walk keep the auburn ponytail and green cloak; the front has a grey, mask-like face and a spike above the head |
| wren 23 | yes | auburn ponytail, green cloak, brown leather in all 7 |
| hadrik 41 | mostly | dark skin, apron, hammer raised on the front; walk 1 turns white-haired |
| hadrik 23 | no | side is a blurry blob, walks switch to a long-haired figure |
| merchant 41 | partly | headscarf carries over but its colour shifts (grey-green front, pink-purple walks); dress colours vary |
| priest 41 | no | branching antler-like ornaments and skull-like faces in every view; reads as a creature, not a priest |
| guard 41 | no | front and back are a tall red bell shape; walks are a thin figure with a spear |
| farmhand 41 | mostly | same figure throughout, but the straw hat/hair is a huge bushy mass |
| noble 41 | yes | golden updo, deep blue gown with gold trim, short cape in all 7: the most consistent set |
| innkeeper 41 | mostly | bald, green apron and mug throughout; front and back faces are pale and skull-like |

Style: dark outlines and stronger shading show up on most sets compared with round 12. Best sets: noble 41, wren 23, then innkeeper 41, farmhand 41, hadrik 41.
raw/: the 8 best single images (noble front and side, wren 23 front and side, innkeeper side, hadrik 41 front, farmhand front, merchant walk 0).
