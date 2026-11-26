# Round 12b: base-body sheets + fronts with the round-12 recipe: log

Only image inputs: art-drop/figures/r8/poses/sheet-side-walk-back-1792x640.png and single-front-1024x640.png (drawn from numbers). No IP-Adapter, no earlier round's output.
Round-12 recipe: Pony V6 XL + sakuemonq LoRA 1.0, openpose 0.8 (start 0, end 1.0), CFG 5, euler_ancestral 24 steps, clip skip 2. Sheet 1792x640 with 'character sheet, same character, side view, walking, back view'; front 1024x640 exactly as round 12 step 1 (same seed and text). Control rows: the 8d Wren text as a sheet, seeds 41 and 11 (no front).
Sheet positive (man): `score_9, score_8_up, score_7_up, simple background, flat grey background, plain flat grey background, no gradient, full body, feet visible, fully clothed, standing, character sheet, same character, side view, walking, back view, young man, short neat black hair, plain grey tunic, plain brown trousers, simple brown boots, medium brown skin, empty hands`
Sheet negative: `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, multiple people, different people, crowd`
Cut: flood-fill from the border (neighbours within 10 levels), plus any enclosed pixel within 10 levels of the border median counts as background; all remaining blobs of 6+ sprite px form the figure. Sheets split into six 37.5 px columns: side | walk 0-3 | back.

## man

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) |
|---|---|---|---|---|---|---|---|---|
| 11 | 70 | 59 | 58 | 59 | 59 | 60 | 59 | 76,76,76,76 (0) |
| 23 | 68 | 60 | 60 | 59 | 60 | 60 | 59 | 76,76,76,76 (0) |
| 37 | 66 | 60 | 59 | 59 | 60 | 60 | 60 | 76,76,76,76 (0) |
| 41 | 64 | 59 | 59 | 59 | 59 | 59 | 59 | 77,77,77,77 (0) |
| 53 | 70 | 59 | 60 | 59 | 59 | 58 | 59 | 76,76,76,76 (0) |
| 67 | 60 | 60 | 58 | 60 | 59 | 60 | 59 | 76,76,76,76 (0) |
| 79 | 72 | 60 | 63 | 60 | 62 | 62 | 63 | 76,76,76,76 (0) |
| 97 | 61 | 57 | 57 | 57 | 57 | 57 | 57 | 76,76,76,76 (0) |

## woman

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) |
|---|---|---|---|---|---|---|---|---|
| 11 | 74 | 60 | 60 | 60 | 59 | 60 | 60 | 76,76,76,76 (0) |
| 23 | 72 | 60 | 59 | 59 | 60 | 60 | 60 | 76,76,76,76 (0) |
| 37 | 65 | 60 | 61 | 61 | 61 | 60 | 61 | 76,76,76,76 (0) |
| 41 | 64 | 63 | 63 | 63 | 64 | 65 | 66 | 77,77,77,77 (0) |
| 53 | 68 | 60 | 61 | 60 | 61 | 60 | 60 | 76,76,76,76 (0) |
| 67 | 71 | 64 | 44 | 61 | 61 | 61 | 62 | 76,76,76,76 (0) |
| 79 | 71 | 65 | 63 | 64 | 64 | 66 | 65 | 76,76,77,76 (1) |
| 97 | 75 | 55 | 55 | 55 | 55 | 55 | 55 | 74,74,74,74 (0) |

## control-wren

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) |
|---|---|---|---|---|---|---|---|---|
| 41 | - | 63 | 61 | 63 | 63 | 63 | 63 | 77,77,77,77 (0) |
| 11 | - | 59 | 61 | 59 | 59 | 60 | 59 | 76,76,76,76 (0) |


## Chunky-vs-slim and same-body check (by eye, on the cut 8x sprites)

**The sheets come out slim, like 9b, not chunky like the round-12 fronts.** Every sheet figure is about 57-60 px with adult proportions (head about a sixth to a seventh of the height, long legs); the separately generated fronts are 60-75 px with the short, big-headed look she picked. The two Wren control sheets confirm it: her hair, green cloak and leather carry over, but her body is taller and leaner than the 8d seed-41 front.

Within each sheet the body stays the same across side, back and walk 0-3 for every seed (same skin, hair, clothes; walk feet on one row, spread 0-1 px), with two exceptions: seed 37 (both bodies) gives the side cell an orange shirt while the other five are grey, and man 11's back cell is a blurry hooded shape.

The fronts (same seed and text, generated separately) do not match their sheets in most seeds: fronts at 23, 53, 79 and 97 come out with a poncho, dark cloak, flame hair or a blank white face while the sheet shows a plain tunic. Closest front-to-sheet pairs: man 11 (dark spiky hair, but white shirt vs grey), woman 67 (tunic and trousers, but brown hair vs auburn), woman 11 (same palette, front has a bun).

| body / seed | sheet look | same body in the sheet? | front matches sheet? |
|---|---|---|---|
| man 11 | slim, grey tunic, brown trousers | yes, except a blurry hooded back | partly |
| man 23 | slim, grey tunic, tan trousers, black boots | yes | no (front: poncho) |
| man 37 | slim, grey tunic, rust trousers | side cell orange shirt | no |
| man 41 | slim, grey-green tunic, brown trousers | yes | no (front: spindly, pale) |
| man 53 | slim, grey tunic, dark trousers | yes | no (front: dark cloak) |
| man 67 | slim, white smock, brown trousers | yes | partly |
| man 79 | slim, grey tunic, bushy hair | yes | no (front: flame hair) |
| man 97 | slim, grey-green tunic | yes | no (front: blank white face) |
| woman 11 | slim, auburn hair, grey tunic, brown boots | yes | partly |
| woman 23 | slim, long dark hair, grey tunic, tan trousers | yes | no (front: poncho) |
| woman 37 | slim, auburn hair, grey tunic | side cell orange top | no |
| woman 41 | slim, wavy auburn hair | yes | no (front: red spiky hair) |
| woman 53 | slim, brown bob, tan tunic | yes | no (front: dark dress) |
| woman 67 | slim, auburn hair, white shirt | yes | partly |
| woman 79 | slim, bushy brown hair | yes | no (front: long dress) |
| woman 97 | slim, dark bob, grey tunic | yes | no |

Raws in raw/: both Wren control sheets, and sheet + front for man 23, man 53, woman 23, woman 67 (the cleanest sheets).
