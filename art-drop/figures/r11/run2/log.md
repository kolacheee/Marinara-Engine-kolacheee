# Round 11b: smaller-head chibi sheets: log

Only image inputs: art-drop/figures/r11/poses/chibiB-sheet-side-walk-back-1792x640.png (drawn from numbers). Sheets only, no IP-Adapter, no front image (the front column is left empty). No earlier round's output used.
Sheet: 1792x640, text + ControlNet openpose 0.8 (end 1.0), CFG 5, no IP-Adapter. Front: 1024x640 as round 9 plus IP-Adapter C. Pony V6 XL + sakuemonq LoRA 1.0, euler_ancestral 24 steps, clip skip 2.
Sheet positive (man): `score_9, score_8_up, score_7_up, plain flat grey background, chibi, 3 heads tall, young adult man, slim, full body, feet visible, character sheet, same character, side view, walking, back view, short cropped dark hair, plain grey tunic shirt, plain grey trousers, simple brown shoes, no accessories, medium brown skin, flat colors, simple shading`
Sheet negative: `score_4, score_5, score_6, child, loli, shota, nsfw, muscular bodybuilder, overalls, blurry, text, watermark, close-up, portrait, multiple people, group, crowd, grass, scenery, landscape, detailed background, gradient background, vignette, scenery, hat, hood, cloak, weapon, armor, jewelry, nude, nipples, muscular, child, multiple people, different people, crowd, gradient background, tall, long legs, realistic proportions, baby, toddler, kid, oversized head, balloon head, bald, shorts, pink skin`

Cut: each 8x-downsampled image is flood-filled from its border (neighbouring pixels within 14 levels join the background), every remaining blob of 6+ sprite px inside the cell is kept as the figure (head and body merged). Sheets are split into six 300 px (37.5 sprite px) columns at the skeleton positions, left to right side | walk 0-3 | back. Heights in sprite px; feet = bottom row of the figure. Head/height = rows from the top of the figure to its narrowest row (the neck) in the top 15-55%, over the figure height (0.33 = 3 heads tall, 0.40 = 2.5).

## man

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) | head/height side, back, walk0-3 | head width / shoulder width side, back, walk0-3 |
|---|---|---|---|---|---|---|---|---|---|---|
| 11 | - | 59 | 61 | 59 | 57 | 61 | 60 | 76,76,76,76 (0) | 0.27, 0.3, 0.29, 0.25, 0.3, 0.28 | 2.14, 1.19, 2.43, 2.67, 2.71, 2.29 |
| 23 | - | 60 | 59 | 57 | 60 | 59 | 59 | 76,76,76,76 (0) | 0.28, 0.25, 0.25, 0.28, 0.27, 0.27 | 2.12, 1.0, 1.75, 2.29, 1.88, 1.88 |
| 37 | - | 60 | 61 | 60 | 60 | 60 | 60 | 76,76,76,76 (0) | 0.27, 0.31, 0.32, 0.32, 0.3, 0.32 | 1.5, 3.2, 8.0, 7.5, 16.0, 4.25 |
| 41 | - | 57 | 58 | 57 | 57 | 57 | 57 | 76,76,76,76 (0) | 0.25, 0.22, 0.25, 0.25, 0.25, 0.25 | 2.29, 0.94, 2.14, 2.14, 2.0, 2.0 |
| 53 | - | 57 | 59 | 58 | 58 | 57 | 58 | 76,76,76,76 (0) | 0.23, 0.25, 0.26, 0.24, 0.25, 0.24 | 1.86, 1.0, 1.88, 1.75, 2.29, 2.0 |
| 67 | - | 59 | 58 | 59 | 58 | 58 | 58 | 76,76,76,76 (0) | 0.25, 0.22, 0.25, 0.26, 0.26, 0.26 | 1.67, 0.94, 1.78, 1.4, 1.78, 2.0 |
| 79 | - | 58 | 59 | 58 | 59 | 60 | 60 | 74,74,74,74 (0) | 0.29, 0.34, 0.29, 0.29, 0.32, 0.3 | 3.17, 3.8, 2.25, 2.71, 2.38, 2.86 |
| 97 | - | 57 | 57 | 55 | 57 | 57 | 56 | 76,76,76,76 (0) | 0.26, 0.23, 0.24, 0.26, 0.25, 0.23 | 1.86, 0.82, 1.86, 2.0, 2.14, 1.71 |

## woman

| seed | front h | side h | back h | walk0 h | walk1 h | walk2 h | walk3 h | walk feet rows (spread) | head/height side, back, walk0-3 | head width / shoulder width side, back, walk0-3 |
|---|---|---|---|---|---|---|---|---|---|---|
| 11 | - | 61 | 63 | 61 | 60 | 61 | 61 | 76,76,76,76 (0) | 0.3, 0.32, 0.3, 0.28, 0.3, 0.31 | 3.14, 1.57, 3.33, 3.33, 3.83, 3.33 |
| 23 | - | 60 | 59 | 57 | 60 | 60 | 60 | 76,76,76,76 (0) | 0.28, 0.27, 0.25, 0.27, 0.28, 0.28 | 2.43, 1.0, 2.29, 2.71, 2.38, 2.57 |
| 37 | - | 64 | 63 | 63 | 63 | 63 | 64 | 77,77,77,77 (0) | 0.3, 0.32, 0.29, 0.29, 0.29, 0.3 | 1.75, 1.25, 2.0, 2.5, 2.22, 2.62 |
| 41 | - | 62 | 61 | 63 | 64 | 62 | 63 | 74,74,74,74 (0) | 0.34, 0.33, 0.35, 0.36, 0.34, 0.35 | 3.29, 1.56, 2.67, 4.0, 3.0, 4.0 |
| 53 | - | 59 | 60 | 59 | 59 | 59 | 59 | 77,77,77,77 (0) | 0.24, 0.25, 0.25, 0.25, 0.24, 0.25 | 2.29, 1.06, 2.5, 2.33, 2.14, 2.14 |
| 67 | - | 61 | 62 | 59 | 61 | 60 | 61 | 76,76,76,76 (0) | 0.3, 0.29, 0.25, 0.28, 0.28, 0.31 | 2.22, 1.22, 2.25, 1.9, 2.5, 2.25 |
| 79 | - | 59 | 59 | 58 | 59 | 60 | 60 | 74,74,74,74 (0) | 0.31, 0.29, 0.29, 0.31, 0.33, 0.33 | 2.62, 1.47, 3.17, 3.14, 3.0, 2.75 |
| 97 | - | 56 | 57 | 55 | 56 | 56 | 57 | 76,76,76,77 (1) | 0.23, 0.23, 0.22, 0.23, 0.23, 0.23 | 1.78, 1.0, 1.88, 1.88, 2.14, 1.88 |


Note: "hair" was removed from the inherited round-9/11 negatives because it contradicts the brief's "short cropped dark hair".
Head width / shoulder width is only meaningful on the back view (0.82-1.57); in profile the shoulders are narrow, so side and walk cells read 1.4-16 and should be ignored.

## Same-body check (by eye, on the cut 8x sprites)

The new cut keeps head and body together in every cell. Every seed keeps one body across side, back and walk 0-3 (same skin, hair, clothes, proportions), on flat grey, 55-64 px tall, head about a quarter to a third of the height (0.22-0.36: roughly 3 to 4 heads tall). Skin is medium brown in all 16 sheets. Walk feet stay on one row.

| body / seed | look | issues |
|---|---|---|
| man 11 | grey shirt and trousers, short messy hair | hair a bit tall |
| man 23 | grey long-sleeved shirt, dark trousers, short curly hair | none obvious; one of the cleanest |
| man 37 | grey trousers, short hair | side cell has an orange shirt, the other five a pale shirt |
| man 41 | pale blue-grey shirt, grey trousers, short hair | none obvious |
| man 53 | grey shirt, dark trousers | legs thin and split oddly on side and back |
| man 67 | white shirt, grey trousers, short curly hair | shirt white rather than grey |
| man 79 | grey shirt | hair large and bushy, not cropped |
| man 97 | grey shirt | trousers read as shorts in walk frames |
| woman 11 | grey shirt, bare legs | hair voluminous; no trousers (bare legs) |
| woman 23 | grey shirt and trousers, short curly hair | none obvious; one of the cleanest |
| woman 37 | pale shirt, grey trousers | side cell has an orange shirt |
| woman 41 | pale blue shirt, shorts | big wavy grey-brown hair, bare legs |
| woman 53 | grey shirt, dark trousers, short hair | none obvious |
| woman 67 | white shirt, grey trousers, hair in a bun | shirt white |
| woman 79 | grey shirt, dark skirt | black helmet-like hair with stray pixels |
| woman 97 | grey shirt, shorts | bare legs |

Best sets (raws in raw/): man 23, 67, 41; woman 67, 23, 53.
