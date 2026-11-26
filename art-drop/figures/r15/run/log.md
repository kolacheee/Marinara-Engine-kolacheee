# Round 15: full roster, draw big and show at half: log

Only image inputs: art-drop/figures/r14/poses/big-*-896x1152.png (drawn from numbers; figure box 736 px, about 92 px after the 8x shrink). No IP-Adapter, no reference image, no earlier output, no game image.
Changes from round 14: front and back views use openpose 0.65 ending at 0.8 (side and walk stay 0.8 to 1.0); every negative adds 'mask, skull, helmet covering face, stick legs, thin legs, wireframe, skeleton, oversized hat, oversized weapon'; guard, priest, farmhand and innkeeper text tightened; seeds 41, 7, 23, 88, the same seed across all 7 views of a set.
Recipe: Pony V6 XL + sakuemonq LoRA 1.0, openpose 0.8 (start 0, end 1.0), CFG 5, euler_ancestral 24 steps, clip skip 2, 896x1152; every view (front, side, back, walk 0-3) is its own image with the same seed and text. Style tags on every positive: 'detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details'; negative adds 'neon, oversaturated, flat colors, lineless'.
Example positive (merchant front): `score_9, score_8_up, score_7_up, simple background, flat grey background, plain flat grey background, no gradient, full body, feet visible, fully clothed, standing, solo, front view, facing the viewer, face visible, looking at viewer, detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details, middle-aged woman, olive skin, dark hair under a patterned headscarf, mustard dress with a brown apron, satchel`
Example negative (merchant front): `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, multiple views, character sheet, multiple people, from behind, back view, neon, oversaturated, flat colors, lineless, mask, skull, helmet covering face, stick legs, thin legs, wireframe, skeleton, oversized hat, oversized weapon`

Cut: flood-fill from the border (tolerance 10); blobs of 6+ sprite px form the figure. Sprites in sprites/ are the plain 8x mode downsample, no post-processing.

## wren

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 94 | 90 | 94 | 90 | 93 | 89 | 93 | 0.22, 0.2, 0.22 | 136,139,136,139 |
| 7 | 117 | 126 | 126 | 95 | 92 | 95 | 92 | 0.15, 0.54, 0.14 | 140,137,140,137 |
| 23 | 109 | 95 | 96 | 94 | 115 | 93 | 115 | 0.15, 0.27, 0.21 | 137,139,138,139 |
| 88 | 98 | 92 | 94 | 92 | 93 | 92 | 93 | 0.2, 0.17, 0.16 | 138,138,138,138 |

## hadrik

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 115 | 119 | 119 | 127 | 140 | 135 | 140 | 0.38, 0.38, 0.24 | 136,141,136,141 |
| 7 | 110 | 131 | 120 | 124 | 132 | 124 | 132 | 0.51, 0.54, 0.24 | 140,139,140,139 |
| 23 | 129 | 129 | 113 | 132 | 132 | 138 | 132 | 0.48, 0.48, 0.3 | 138,140,138,140 |
| 88 | 96 | 91 | 95 | 91 | 92 | 91 | 92 | 0.15, 0.19, 0.16 | 138,138,138,138 |

## merchant

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 123 | 120 | 125 | 95 | 120 | 95 | 120 | 0.22, 0.31, 0.24 | 136,136,136,136 |
| 7 | 117 | 119 | 113 | 109 | 104 | 108 | 104 | 0.17, 0.23, 0.54 | 130,124,128,124 |
| 23 | 101 | 131 | 92 | 95 | 115 | 96 | 115 | 0.23, 0.46, 0.4 | 138,139,139,139 |
| 88 | 93 | 92 | 94 | 93 | 93 | 93 | 93 | 0.14, 0.24, 0.15 | 138,138,138,138 |

## priest

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 122 | 119 | 124 | 121 | 120 | 87 | 120 | 0.54, 0.14, 0.52 | 136,138,135,138 |
| 7 | 106 | 117 | 118 | 108 | 115 | 82 | 115 | 0.54, 0.52, 0.15 | 128,137,131,137 |
| 23 | 118 | 132 | 121 | 88 | 120 | 87 | 120 | 0.14, 0.35, 0.23 | 136,137,135,137 |
| 88 | 88 | 88 | 128 | 90 | 88 | 90 | 88 | 0.15, 0.19, 0.15 | 138,134,138,134 |

## guard

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 122 | 119 | 122 | 133 | 120 | 132 | 120 | 0.25, 0.19, 0.24 | 136,136,136,136 |
| 7 | 132 | 131 | 129 | 114 | 116 | 124 | 116 | 0.16, 0.53, 0.16 | 119,125,129,125 |
| 23 | 104 | 129 | 113 | 130 | 128 | 116 | 128 | 0.15, 0.52, 0.16 | 139,132,124,132 |
| 88 | 120 | 91 | 136 | 93 | 92 | 93 | 92 | 0.23, 0.19, 0.17 | 138,134,138,134 |

## farmhand

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 123 | 125 | 124 | 128 | 132 | 126 | 132 | 0.41, 0.39, 0.38 | 138,142,136,142 |
| 7 | 137 | 137 | 135 | 126 | 126 | 127 | 126 | 0.5, 0.53, 0.47 | 140,140,140,140 |
| 23 | 120 | 139 | 120 | 118 | 135 | 117 | 135 | 0.35, 0.47, 0.32 | 139,139,138,139 |
| 88 | 128 | 97 | 101 | 98 | 99 | 98 | 99 | 0.38, 0.23, 0.21 | 140,139,140,139 |

## noble

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 126 | 121 | 125 | 122 | 121 | 121 | 121 | 0.31, 0.24, 0.24 | 135,136,135,136 |
| 7 | 123 | 130 | 129 | 119 | 119 | 122 | 119 | 0.32, 0.53, 0.18 | 129,137,130,137 |
| 23 | 116 | 126 | 106 | 114 | 114 | 95 | 114 | 0.22, 0.49, 0.27 | 137,138,137,138 |
| 88 | 125 | 91 | 84 | 93 | 93 | 93 | 93 | 0.26, 0.19, 0.25 | 138,137,138,137 |

## innkeeper

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | head/height front, side, back | walk feet rows |
|---|---|---|---|---|---|---|---|---|---|
| 41 | 90 | 91 | 90 | 90 | 92 | 89 | 92 | 0.16, 0.22, 0.16 | 136,137,135,137 |
| 7 | 93 | 119 | 111 | 135 | 134 | 93 | 134 | 0.52, 0.22, 0.14 | 140,139,140,139 |
| 23 | 101 | 124 | 80 | 94 | 127 | 93 | 127 | 0.23, 0.44, 0.19 | 138,140,137,140 |
| 88 | 94 | 91 | 94 | 91 | 91 | 91 | 91 | 0.15, 0.16, 0.15 | 138,138,138,138 |


## Per-set notes (by eye, on the cut 8x sprites; one line per character and seed)

- wren 41: same person in all 7; front and back usable. Best set of the round.
- wren 7: walks fine, but a glowing golden halo swallows front, side and back; front/back not usable.
- wren 23: same person in all 7; front usable (two spiky hair tufts), back usable.
- wren 88: same person in all 7; front and back usable.
- hadrik 41: same man throughout, but a big flat object floats over his head in every view; front/back usable apart from that; no hammer.
- hadrik 7: a huge blond puff covers the head in every view; not usable.
- hadrik 23: front has a floating object; side and walks become a lighter-skinned man; not the same person.
- hadrik 88: same young dark-skinned man in cream shirt and dark trousers in all 7 (front has a large brown shape behind); front/back usable; no hammer.
- merchant 41: headscarf carries over but colours shift; front has stick legs; partly.
- merchant 7: flowers and red hair everywhere; not usable.
- merchant 23: red headscarf and dark dress throughout; side view has a flame-like burst; front/back mostly usable.
- merchant 88: same woman in all 7 (pink-purple headscarf, red dress instead of mustard, satchel); front/back usable.
- priest 41: robe carries over; front framed by an ornate halo, back on stick legs; partly.
- priest 7: a giant glowing orb behind the head in most views; not usable.
- priest 23: dark robe and staff throughout; front has a curved ornament; partly.
- priest 88: pale robed figure throughout; front is ghostly and blurry; partly.
- guard 41: red dress-like figure with stick legs on front/back; walks show a spear; not the same person.
- guard 7: a golden disc and red banner instead of a body on front/back; not usable.
- guard 23: front is a hanging banner; side and walks a red-clad figure; not usable.
- guard 88: side and walks consistent (red tabard, cap); front is a different grey-hooded old man; partly.
- farmhand 41: same figure in all 7 under a big straw hat; front/back usable.
- farmhand 7: hat becomes a huge orange straw mass; consistent but not usable as-is.
- farmhand 23: same figure in all 7 with a wide straw hat; front/back usable.
- farmhand 88: same figure in all 7 (white shirt, brown trousers); front hair is a white fluff; mostly usable.
- noble 41: golden updo and blue gown in all 7; front and back stand on stick legs; mostly.
- noble 7: hair explodes into a golden mass; not usable.
- noble 23: dark blue gown and updo in all 7; front on stick legs; mostly.
- noble 88: gold-and-blue dress in all 7; front more ornate than the rest; mostly.
- innkeeper 41: green coat and mug in all 7; front/back usable.
- innkeeper 7: front is a huge bald caricature head, back an orb; not usable.
- innkeeper 23: side view has a big head blob; front/back usable; partly.
- innkeeper 88: green apron over white shirt in all 7; front/back usable.

Summary: seed 7 fails for every character (halos, orbs, explosions of hair or hats). Usable full sets (same person, usable front and back): wren 41, wren 23, wren 88, hadrik 88, merchant 88, farmhand 41, farmhand 23, innkeeper 41, innkeeper 88; nearly there: noble 41/23/88 (stick legs on front/back) and merchant 23. Guard and priest have no usable set yet. Stick legs still appear on some front/back views despite the lower ControlNet end.
raw/: 8 best single images (wren 41 front and side, wren 88 front, innkeeper 88 front, farmhand 23 front, noble 41 side, merchant 88 walk 0, hadrik 88 side).
