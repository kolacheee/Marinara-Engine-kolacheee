# Round 8b: two lanes, openpose to end 1.0: log

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. Only image inputs: the skeleton PNGs in poses/ (drawn from numbers by poses/make_poses.py), fed to xinsir controlnet-union-sdxl-1.0 promax as openpose, strength 0.8, start 0.0, end 1.0. Lane T: turnaround-1536x640.png. Lane S: single-front/side/back-1024x640.png, one view per image, same seed across a character's three views. LoRA 1.0, seeds 11/23/37/41. No earlier outputs used as input of any kind. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts


Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=S-back | 4 | 4 | 62 | 4 | 0.35 | 0.68 |
| mode=S-front | 4 | 4 | 65 | 2 | 0.30 | 0.62 |
| mode=S-side | 4 | 4 | 61 | 3 | 0.34 | 0.66 |
| mode=T | 4 | 15 | 56 | 12 | 0.39 | 0.64 |
| source_anime=False | 16 | 27 | 58 | 21 | 0.36 | 0.65 |
| strength=0.8 | 16 | 27 | 58 | 21 | 0.36 | 0.65 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): wren-T-37 (0.83), wren-T-23 (0.79), wren-T-41 (0.77), wren-S-side-41 (0.75)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=S-back | 4 | 6 | 59 | 4 | 0.43 | 0.67 |
| mode=S-front | 4 | 5 | 66 | 1 | 0.71 | 0.72 |
| mode=S-side | 4 | 4 | 63 | 2 | 0.43 | 0.66 |
| mode=T | 4 | 19 | 60 | 14 | 0.54 | 0.73 |
| source_anime=False | 16 | 34 | 60 | 21 | 0.54 | 0.71 |
| strength=0.8 | 16 | 34 | 60 | 21 | 0.54 | 0.71 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): hadrik-S-front-11 (0.90), hadrik-T-41 (0.89), hadrik-S-front-41 (0.83), hadrik-T-11 (0.79)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-S-back-11 figure 1, h=58, flat=0.31, score=0.66
- #2: wren-S-back-23 figure 1, h=63, flat=0.25, score=0.62
- #3: wren-S-back-37 figure 1, h=61, flat=0.41, score=0.70
- #4: wren-S-back-41 figure 1, h=63, flat=0.43, score=0.72
- #5: wren-S-front-11 figure 1, h=63, flat=0.26, score=0.63
- #6: wren-S-front-23 figure 1, h=69, flat=0.24, score=0.54
- #7: wren-S-front-37 figure 1, h=66, flat=0.30, score=0.62
- #8: wren-S-front-41 figure 1, h=64, flat=0.39, score=0.69
- #9: wren-S-side-11 figure 1, h=48, flat=0.20, score=0.57
- #10: wren-S-side-23 figure 1, h=61, flat=0.34, score=0.67
- #11: wren-S-side-37 figure 1, h=61, flat=0.35, score=0.67
- #12: wren-S-side-41 figure 1, h=64, flat=0.49, score=0.75
- #13: wren-T-11 figure 1, h=52, flat=0.25, score=0.63
- #14: wren-T-11 figure 2, h=59, flat=0.14, score=0.57
- #15: wren-T-11 figure 3, h=52, flat=0.34, score=0.67
- #16: wren-T-23 figure 1, h=57, flat=0.57, score=0.79
- #17: wren-T-23 figure 2, h=56, flat=0.28, score=0.64
- #18: wren-T-23 figure 3, h=57, flat=0.52, score=0.76
- #19: wren-T-37 figure 1, h=58, flat=0.64, score=0.82
- #20: wren-T-37 figure 2, h=58, flat=0.13, score=0.57
- #21: wren-T-37 figure 3, h=58, flat=0.65, score=0.83
- #22: wren-T-41 figure 1, h=30, flat=0.34, score=0.34
- #23: wren-T-41 figure 2, h=56, flat=0.51, score=0.76
- #24: wren-T-41 figure 3, h=33, flat=0.33, score=0.38
- #25: wren-T-41 figure 4, h=55, flat=0.29, score=0.64
- #26: wren-T-41 figure 5, h=39, flat=0.25, score=0.44
- #27: wren-T-41 figure 6, h=57, flat=0.55, score=0.77

### hadrik

- #1: hadrik-S-back-11 figure 1, h=76, flat=0.68, score=0.64
- #2: hadrik-S-back-23 figure 1, h=60, flat=0.41, score=0.71
- #3: hadrik-S-back-37 figure 1, h=69, flat=0.34, score=0.58
- #4: hadrik-S-back-37 figure 2, h=59, flat=0.32, score=0.66
- #5: hadrik-S-back-37 figure 3, h=59, flat=0.41, score=0.70
- #6: hadrik-S-back-41 figure 1, h=57, flat=0.45, score=0.73
- #7: hadrik-S-front-11 figure 1, h=60, flat=0.80, score=0.90
- #8: hadrik-S-front-23 figure 1, h=70, flat=0.40, score=0.60
- #9: hadrik-S-front-37 figure 1, h=66, flat=0.62, score=0.78
- #10: hadrik-S-front-41 figure 1, h=21, flat=1.00, score=0.52
- #11: hadrik-S-front-41 figure 2, h=67, flat=0.75, score=0.83
- #12: hadrik-S-side-11 figure 1, h=52, flat=0.48, score=0.74
- #13: hadrik-S-side-23 figure 1, h=75, flat=0.32, score=0.47
- #14: hadrik-S-side-37 figure 1, h=62, flat=0.55, score=0.78
- #15: hadrik-S-side-41 figure 1, h=65, flat=0.37, score=0.67
- #16: hadrik-T-11 figure 1, h=60, flat=0.48, score=0.74
- #17: hadrik-T-11 figure 2, h=43, flat=0.54, score=0.65
- #18: hadrik-T-11 figure 3, h=62, flat=0.53, score=0.77
- #19: hadrik-T-11 figure 4, h=72, flat=0.50, score=0.62
- #20: hadrik-T-11 figure 5, h=59, flat=0.57, score=0.79
- #21: hadrik-T-23 figure 1, h=57, flat=0.41, score=0.70
- #22: hadrik-T-23 figure 2, h=31, flat=0.55, score=0.46
- #23: hadrik-T-23 figure 3, h=69, flat=0.58, score=0.70
- #24: hadrik-T-23 figure 4, h=57, flat=0.45, score=0.72
- #25: hadrik-T-37 figure 1, h=58, flat=0.44, score=0.72
- #26: hadrik-T-37 figure 2, h=40, flat=0.52, score=0.59
- #27: hadrik-T-37 figure 3, h=60, flat=0.44, score=0.72
- #28: hadrik-T-37 figure 4, h=58, flat=0.46, score=0.73
- #29: hadrik-T-41 figure 1, h=62, flat=0.68, score=0.84
- #30: hadrik-T-41 figure 2, h=62, flat=0.48, score=0.74
- #31: hadrik-T-41 figure 3, h=61, flat=0.78, score=0.89
- #32: hadrik-T-41 figure 4, h=63, flat=0.59, score=0.80
- #33: hadrik-T-41 figure 5, h=61, flat=0.71, score=0.85
- #34: hadrik-T-41 figure 6, h=62, flat=0.64, score=0.82


## Colour check (heuristic)

Share of each figure's sprite pixels falling in a rough HSV range for each described colour; 'yes' at 2% or more. This is a crude automatic check for presence, not a judgement of the design: bow, hood-down and hammer can't be checked this way.

### wren

| image | figure | height | skeleton slot | auburn hair | green | leather brown |
|---|---|---|---|---|---|---|
| wren-S-back-11 | 1 | 58 | side | yes (41%) | yes (32%) | yes (13%) |
| wren-S-back-23 | 1 | 63 | side | yes (49%) | yes (35%) | yes (12%) |
| wren-S-back-37 | 1 | 61 | side | yes (46%) | yes (31%) | yes (24%) |
| wren-S-back-41 | 1 | 63 | side | yes (44%) | yes (44%) | yes (27%) |
| wren-S-front-11 | 1 | 63 | side | yes (47%) | yes (34%) | yes (5%) |
| wren-S-front-23 | 1 | 69 | side | yes (44%) | yes (36%) | no (2%) |
| wren-S-front-37 | 1 | 66 | side | yes (52%) | yes (32%) | yes (12%) |
| wren-S-front-41 | 1 | 64 | side | yes (40%) | yes (47%) | yes (5%) |
| wren-S-side-11 | 1 | 48 | side | yes (38%) | yes (25%) | yes (10%) |
| wren-S-side-23 | 1 | 61 | side | yes (40%) | yes (34%) | yes (4%) |
| wren-S-side-37 | 1 | 61 | side | yes (48%) | yes (27%) | yes (22%) |
| wren-S-side-41 | 1 | 64 | side | yes (23%) | yes (43%) | no (0%) |
| wren-T-11 | 1 | 52 | front | yes (66%) | yes (15%) | yes (15%) |
| wren-T-11 | 2 | 59 | side | yes (83%) | no (1%) | yes (28%) |
| wren-T-11 | 3 | 52 | back | yes (48%) | yes (30%) | yes (19%) |
| wren-T-23 | 1 | 57 | front | yes (27%) | no (0%) | yes (14%) |
| wren-T-23 | 2 | 56 | side | yes (33%) | no (0%) | yes (30%) |
| wren-T-23 | 3 | 57 | back | yes (30%) | no (0%) | yes (13%) |
| wren-T-37 | 1 | 58 | front | yes (12%) | yes (13%) | yes (3%) |
| wren-T-37 | 2 | 58 | side | yes (68%) | no (0%) | yes (21%) |
| wren-T-37 | 3 | 58 | back | yes (11%) | yes (15%) | no (2%) |
| wren-T-41 | 1 | 30 | front | yes (45%) | no (0%) | yes (32%) |
| wren-T-41 | 2 | 56 | front | yes (26%) | no (0%) | yes (8%) |
| wren-T-41 | 3 | 33 | front | yes (74%) | no (0%) | yes (21%) |
| wren-T-41 | 4 | 55 | side | yes (44%) | no (0%) | yes (14%) |
| wren-T-41 | 5 | 39 | side | yes (69%) | no (0%) | yes (14%) |
| wren-T-41 | 6 | 57 | back | yes (23%) | no (0%) | yes (7%) |

### hadrik

| image | figure | height | skeleton slot | very dark skin | black (hair/beard) | cream | leather brown |
|---|---|---|---|---|---|---|---|
| hadrik-S-back-11 | 1 | 76 | side | yes (9%) | yes (13%) | yes (10%) | no (2%) |
| hadrik-S-back-23 | 1 | 60 | side | yes (51%) | yes (42%) | no (1%) | yes (43%) |
| hadrik-S-back-37 | 1 | 69 | front | yes (37%) | yes (31%) | no (0%) | yes (39%) |
| hadrik-S-back-37 | 2 | 59 | side | yes (24%) | yes (33%) | yes (19%) | yes (15%) |
| hadrik-S-back-37 | 3 | 59 | back | yes (41%) | yes (35%) | no (0%) | yes (43%) |
| hadrik-S-back-41 | 1 | 57 | side | yes (40%) | yes (47%) | no (0%) | yes (13%) |
| hadrik-S-front-11 | 1 | 60 | side | no (0%) | yes (5%) | no (0%) | no (2%) |
| hadrik-S-front-23 | 1 | 70 | side | yes (25%) | yes (28%) | yes (3%) | yes (10%) |
| hadrik-S-front-37 | 1 | 66 | side | no (1%) | yes (21%) | yes (5%) | yes (9%) |
| hadrik-S-front-41 | 2 | 67 | side | yes (9%) | yes (14%) | no (0%) | no (1%) |
| hadrik-S-side-11 | 1 | 52 | side | yes (49%) | yes (38%) | yes (6%) | yes (19%) |
| hadrik-S-side-23 | 1 | 75 | side | yes (19%) | yes (25%) | yes (6%) | yes (3%) |
| hadrik-S-side-37 | 1 | 62 | side | yes (28%) | yes (67%) | yes (7%) | yes (6%) |
| hadrik-S-side-41 | 1 | 65 | side | yes (9%) | yes (34%) | yes (3%) | yes (5%) |
| hadrik-T-11 | 1 | 60 | front | yes (54%) | yes (38%) | no (2%) | yes (45%) |
| hadrik-T-11 | 2 | 43 | side | yes (56%) | yes (29%) | no (0%) | yes (61%) |
| hadrik-T-11 | 3 | 62 | side | yes (51%) | yes (30%) | no (0%) | yes (51%) |
| hadrik-T-11 | 4 | 72 | back | yes (53%) | yes (32%) | no (0%) | yes (54%) |
| hadrik-T-11 | 5 | 59 | back | yes (55%) | yes (47%) | no (0%) | yes (40%) |
| hadrik-T-23 | 1 | 57 | front | yes (38%) | yes (36%) | yes (14%) | no (2%) |
| hadrik-T-23 | 2 | 31 | side | yes (58%) | no (0%) | no (0%) | yes (100%) |
| hadrik-T-23 | 3 | 69 | side | yes (68%) | yes (19%) | yes (2%) | yes (56%) |
| hadrik-T-23 | 4 | 57 | back | yes (35%) | yes (34%) | yes (14%) | yes (2%) |
| hadrik-T-37 | 1 | 58 | front | yes (54%) | yes (34%) | no (0%) | yes (20%) |
| hadrik-T-37 | 2 | 40 | side | yes (65%) | yes (30%) | no (0%) | yes (22%) |
| hadrik-T-37 | 3 | 60 | side | yes (40%) | yes (43%) | no (0%) | yes (28%) |
| hadrik-T-37 | 4 | 58 | back | yes (52%) | yes (37%) | no (0%) | yes (22%) |
| hadrik-T-41 | 1 | 62 | front | yes (47%) | yes (18%) | no (0%) | yes (5%) |
| hadrik-T-41 | 2 | 62 | front | yes (13%) | yes (20%) | yes (28%) | yes (3%) |
| hadrik-T-41 | 3 | 61 | front | yes (56%) | yes (22%) | no (0%) | no (2%) |
| hadrik-T-41 | 4 | 63 | side | yes (34%) | yes (17%) | yes (12%) | yes (9%) |
| hadrik-T-41 | 5 | 61 | side | yes (54%) | yes (14%) | yes (2%) | yes (8%) |
| hadrik-T-41 | 6 | 62 | back | yes (33%) | yes (23%) | yes (14%) | no (0%) |


## View check (by eye, on the 8x-downsampled images)

### Lane T (turnaround; slots front | side | back)

| image | front slot | side slot | back slot | extras |
|---|---|---|---|---|
| wren-T-11 | back view, NO | no figure, only a bow | back, yes | none |
| wren-T-23 | back view, NO | side, yes | back, yes | none |
| wren-T-37 | back view (hood up), NO | side / three-quarter, yes | back (hood up), yes | none |
| wren-T-41 | back view, NO | side, yes | back, yes | many floating heads and small figures |
| hadrik-T-11 | front, YES (face and beard visible) | side, yes | back, yes | two extra figures between slots |
| hadrik-T-23 | back view, NO | side, yes | back, yes | two large brown blobs |
| hadrik-T-37 | back view, NO | side, yes | back, yes | a floating bust |
| hadrik-T-41 | front-facing, but as a row of 6+ figures | mixed | mixed | row of figures plus blobs |

Lane T: the front slot faces the viewer in 1 of 8 (2 counting hadrik-T-41's crowd). Holding ControlNet to the end did not fix the turnaround.

### Lane S (one view per image; same seed across a character's three views)

| character / seed | front faces viewer | side in profile | back from behind | same person across the three? |
|---|---|---|---|---|
| wren 11 | yes | yes | yes | yes |
| wren 23 | yes | yes | yes | yes |
| wren 37 | yes | yes | yes | yes |
| wren 41 | yes | yes | yes | yes (hair bigger and brighter on all three) |
| hadrik 11 | yes | yes | yes | mostly (front has a brown apron, back shows black trousers and no apron strings) |
| hadrik 23 | yes, but holding a large blob | different-looking figure plus a blob | yes | no |
| hadrik 37 | yes | different-looking figure in a long dark robe | three figures instead of one | no |
| hadrik 41 | yes | yes, plus a pink blob object | yes | mostly |

Lane S: front 8/8, side 8/8, back 8/8 face the right way. Wren's three views read as the same person for all 4 seeds; Hadrik's for 2 of 4.
