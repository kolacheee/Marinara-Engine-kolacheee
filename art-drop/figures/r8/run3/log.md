# Round 8c: same character across views (IP-Adapter): log

Only image inputs: the single-view skeletons in poses/ (drawn from numbers) and, for side/back, IP-Adapter with reference = this run's own front view raw at the same seed. No earlier round's output used.
Front: lane S settings (Pony V6 XL + sakuemonq LoRA 1.0, xinsir union promax openpose 0.8, start 0, end 1.0, euler_ancestral 24 steps, CFG 7, clip skip 2, 1024x640) plus 'plain flat grey background, no gradient'.
Side/back: same, plus IPAdapterAdvanced (ip-adapter-plus_sdxl_vit-h, CLIP ViT-H), weight 0.6 / 0.85, weight type linear (the plugin's standard), combine concat, start 0.0, end 0.8, embeds scaling 'V only'.
Heights are after the exact 8x downsample with grid-phase search; flat = share of the figure's 8x8 blocks with max channel spread <= 8.

## wren

| seed | IP weight | front h | side h | back h | figures (f/s/b) | mean flat |
|---|---|---|---|---|---|---|
| 11 | 0.60 | 68 | 78 | 78 | 1/1/1 | 0.66 |
| 11 | 0.85 | 68 | 77 | 78 | 1/1/1 | 0.63 |
| 23 | 0.60 | 68 | 78,33 | 78,31 | 1/2/2 | 0.77 |
| 23 | 0.85 | 68 | 78 | 78 | 1/1/1 | 0.61 |
| 37 | 0.60 | 65 | 78 | 78 | 1/1/1 | 0.68 |
| 37 | 0.85 | 65 | 78 | 78 | 1/1/1 | 0.61 |
| 41 | 0.60 | 65 | 78 | 78 | 1/1/1 | 0.62 |
| 41 | 0.85 | 65 | 78 | 78 | 1/1/1 | 0.50 |

Best 2 seed sets for wren by mean figure score (raw/ holds all their images): seed 37 (0.68), seed 23 (0.66)

## hadrik

| seed | IP weight | front h | side h | back h | figures (f/s/b) | mean flat |
|---|---|---|---|---|---|---|
| 11 | 0.60 | 76 | 78 | 78 | 1/1/1 | 0.74 |
| 11 | 0.85 | 76 | 78 | 78 | 1/1/1 | 0.66 |
| 23 | 0.60 | 50 | 78 | 78 | 1/1/1 | 0.71 |
| 23 | 0.85 | 50 | 78 | 78 | 1/1/1 | 0.69 |
| 37 | 0.60 | 65 | 78 | 78 | 1/1/1 | 0.77 |
| 37 | 0.85 | 65 | 78 | 78 | 1/1/1 | 0.52 |
| 41 | 0.60 | 63 | 78 | 78 | 1/1/1 | 0.65 |
| 41 | 0.85 | 63 | 78 | 78 | 1/1/1 | 0.49 |

Best 2 seed sets for hadrik by mean figure score (raw/ holds all their images): seed 37 (0.72), seed 23 (0.70)


## Facing and same-person check (by eye, on the 8x-downsampled images)

**The IP-Adapter images failed.** All 32 side/back images (both weights, both characters) are colour-burnt: saturated magenta, blue and green gradient backgrounds instead of flat grey, neon red/cyan clothing and skin. The side and back skeletons are not followed: nearly every side and back image is a front-facing figure. Some (wren 11 w0.85, wren 37 w0.85, wren 41 w0.85, hadrik 41 w0.85) have lost the figure into blobs. The 78 px heights on side/back are the cutter taking most of the canvas height because the background is not flat, not real figure heights.

The 8 front views (no IP-Adapter) are clean: flat grey background, facing the viewer, 50-76 px tall.

| character / seed | front (no IP-Adapter) | side w0.60 | back w0.60 | side w0.85 | back w0.85 | same person as front? |
|---|---|---|---|---|---|---|
| wren 11 | front, yes | front-facing, burnt | front-facing, burnt | figure lost in red/magenta blob | front-facing, burnt | no: hair/cloak colours shift to neon red/cyan |
| wren 23 | front, yes | front-facing, burnt | front-facing, burnt | front-facing, burnt | front-facing, burnt | partly: green cloak and red hair kept, colours burnt |
| wren 37 | front, yes | front-facing, burnt | front-facing, burnt | blob | blob | no |
| wren 41 | front, yes | front-facing, burnt | front-facing, burnt | blob | blob | no |
| hadrik 11 | front, yes | front-facing, burnt, blue hair | front-facing, burnt | front-facing, burnt | front-facing, burnt | no: skin and hair colours change |
| hadrik 23 | front, yes | front-facing, burnt | front-facing, burnt | front-facing, burnt | front-facing, burnt | no: becomes a different, feminine figure |
| hadrik 37 | front, yes | front-facing, burnt | front-facing, burnt | front-facing, burnt, long red robe | front-facing, burnt | partly: cream shirt and apron kept at 0.60 |
| hadrik 41 | front, yes | front-facing, burnt | front-facing, burnt | blob | blob | no |

Hair shape, hair colour, outfit colours, apron/cloak and bow/hammer: none hold up reliably across views because of the colour burn; the bow and hammer from the front views do not reappear on side/back.

Likely cause: the ip-adapter-plus SDXL model was trained on base SDXL, and Pony V6 XL's weights have drifted far from base SDXL; stacked with the pixel LoRA, CFG 7 and the ControlNet, even weight 0.6 over-drives the image. The "best 2 seed sets" picked by score above are not meaningful for side/back.
