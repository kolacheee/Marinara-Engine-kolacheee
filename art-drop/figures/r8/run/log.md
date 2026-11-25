# Round 8: text look + stick-figure pose: log

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. Only image input: poses/turnaround-1536x640.png (OpenPose skeleton drawn from numbers by poses/make_poses.py), fed to xinsir controlnet-union-sdxl-1.0 promax as openpose, start 0.0, end 0.7. In the tables, 'strength' is the ControlNet strength (0.6 / 0.8); LoRA 1.0 throughout. 1536x640, seeds 11/23/37/41. No earlier outputs used as input of any kind. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts


Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=pose | 8 | 27 | 57 | 21 | 0.47 | 0.70 |
| source_anime=False | 8 | 27 | 57 | 21 | 0.47 | 0.70 |
| strength=0.6 | 4 | 15 | 57 | 11 | 0.46 | 0.70 |
| strength=0.8 | 4 | 12 | 57 | 10 | 0.47 | 0.70 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): wren-cn60-37 (0.89), wren-cn80-37 (0.85), wren-cn80-41 (0.80), wren-cn60-11 (0.77)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=pose | 8 | 31 | 57 | 24 | 0.48 | 0.70 |
| source_anime=False | 8 | 31 | 57 | 24 | 0.48 | 0.70 |
| strength=0.6 | 4 | 15 | 57 | 11 | 0.50 | 0.71 |
| strength=0.8 | 4 | 16 | 57 | 13 | 0.46 | 0.70 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): hadrik-cn80-41 (0.84), hadrik-cn60-11 (0.82), hadrik-cn60-41 (0.79), hadrik-cn80-37 (0.76)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-cn60-11 figure 1, h=57, flat=0.43, score=0.71
- #2: wren-cn60-11 figure 2, h=39, flat=0.53, score=0.58
- #3: wren-cn60-11 figure 3, h=56, flat=0.38, score=0.69
- #4: wren-cn60-11 figure 4, h=57, flat=0.31, score=0.66
- #5: wren-cn60-11 figure 5, h=57, flat=0.55, score=0.77
- #6: wren-cn60-23 figure 1, h=57, flat=0.50, score=0.75
- #7: wren-cn60-23 figure 2, h=57, flat=0.29, score=0.64
- #8: wren-cn60-23 figure 3, h=57, flat=0.47, score=0.73
- #9: wren-cn60-37 figure 1, h=69, flat=0.72, score=0.78
- #10: wren-cn60-37 figure 2, h=69, flat=0.27, score=0.55
- #11: wren-cn60-37 figure 3, h=71, flat=0.30, score=0.53
- #12: wren-cn60-37 figure 4, h=58, flat=0.77, score=0.89
- #13: wren-cn60-41 figure 1, h=60, flat=0.51, score=0.75
- #14: wren-cn60-41 figure 2, h=61, flat=0.35, score=0.68
- #15: wren-cn60-41 figure 3, h=60, flat=0.50, score=0.75
- #16: wren-cn80-11 figure 1, h=51, flat=0.36, score=0.68
- #17: wren-cn80-11 figure 2, h=51, flat=0.38, score=0.69
- #18: wren-cn80-23 figure 1, h=57, flat=0.49, score=0.75
- #19: wren-cn80-23 figure 2, h=57, flat=0.28, score=0.64
- #20: wren-cn80-23 figure 3, h=57, flat=0.43, score=0.72
- #21: wren-cn80-37 figure 1, h=58, flat=0.70, score=0.85
- #22: wren-cn80-37 figure 2, h=58, flat=0.23, score=0.62
- #23: wren-cn80-37 figure 3, h=58, flat=0.69, score=0.85
- #24: wren-cn80-41 figure 1, h=62, flat=0.41, score=0.70
- #25: wren-cn80-41 figure 2, h=24, flat=0.66, score=0.40
- #26: wren-cn80-41 figure 3, h=49, flat=0.63, score=0.80
- #27: wren-cn80-41 figure 4, h=61, flat=0.41, score=0.71

### hadrik

- #1: hadrik-cn60-11 figure 1, h=57, flat=0.44, score=0.72
- #2: hadrik-cn60-11 figure 2, h=69, flat=0.53, score=0.68
- #3: hadrik-cn60-11 figure 3, h=57, flat=0.63, score=0.82
- #4: hadrik-cn60-23 figure 1, h=56, flat=0.49, score=0.74
- #5: hadrik-cn60-23 figure 2, h=31, flat=0.44, score=0.41
- #6: hadrik-cn60-23 figure 3, h=70, flat=0.53, score=0.66
- #7: hadrik-cn60-23 figure 4, h=56, flat=0.50, score=0.75
- #8: hadrik-cn60-37 figure 1, h=57, flat=0.44, score=0.72
- #9: hadrik-cn60-37 figure 2, h=73, flat=0.42, score=0.56
- #10: hadrik-cn60-37 figure 3, h=60, flat=0.45, score=0.73
- #11: hadrik-cn60-37 figure 4, h=57, flat=0.48, score=0.74
- #12: hadrik-cn60-41 figure 1, h=56, flat=0.52, score=0.76
- #13: hadrik-cn60-41 figure 2, h=55, flat=0.52, score=0.76
- #14: hadrik-cn60-41 figure 3, h=52, flat=0.58, score=0.79
- #15: hadrik-cn60-41 figure 4, h=55, flat=0.58, score=0.79
- #16: hadrik-cn80-11 figure 1, h=57, flat=0.42, score=0.71
- #17: hadrik-cn80-11 figure 2, h=43, flat=0.53, score=0.65
- #18: hadrik-cn80-11 figure 3, h=59, flat=0.40, score=0.70
- #19: hadrik-cn80-11 figure 4, h=57, flat=0.46, score=0.73
- #20: hadrik-cn80-23 figure 1, h=56, flat=0.36, score=0.68
- #21: hadrik-cn80-23 figure 2, h=31, flat=0.52, score=0.44
- #22: hadrik-cn80-23 figure 3, h=68, flat=0.54, score=0.70
- #23: hadrik-cn80-23 figure 4, h=56, flat=0.34, score=0.67
- #24: hadrik-cn80-37 figure 1, h=57, flat=0.30, score=0.65
- #25: hadrik-cn80-37 figure 2, h=59, flat=0.52, score=0.76
- #26: hadrik-cn80-37 figure 3, h=60, flat=0.33, score=0.66
- #27: hadrik-cn80-37 figure 4, h=57, flat=0.31, score=0.65
- #28: hadrik-cn80-41 figure 1, h=57, flat=0.48, score=0.74
- #29: hadrik-cn80-41 figure 2, h=55, flat=0.56, score=0.78
- #30: hadrik-cn80-41 figure 3, h=59, flat=0.68, score=0.84
- #31: hadrik-cn80-41 figure 4, h=56, flat=0.58, score=0.79


## Colour check (heuristic)

Share of each figure's sprite pixels falling in a rough HSV range for each described colour; 'yes' at 2% or more. This is a crude automatic check for presence, not a judgement of the design: bow, hood-down and hammer can't be checked this way.

### wren

| image | figure | height | skeleton slot | auburn hair | green | leather brown |
|---|---|---|---|---|---|---|
| wren-cn60-11 | 1 | 57 | front | yes (45%) | yes (44%) | yes (13%) |
| wren-cn60-11 | 2 | 39 | side | yes (27%) | yes (67%) | no (0%) |
| wren-cn60-11 | 3 | 56 | side | yes (40%) | yes (37%) | yes (9%) |
| wren-cn60-11 | 4 | 57 | back | yes (46%) | yes (25%) | yes (13%) |
| wren-cn60-11 | 5 | 57 | back | yes (43%) | yes (42%) | yes (21%) |
| wren-cn60-23 | 1 | 57 | front | yes (39%) | yes (43%) | yes (18%) |
| wren-cn60-23 | 2 | 57 | side | yes (67%) | yes (5%) | yes (21%) |
| wren-cn60-23 | 3 | 57 | back | yes (46%) | yes (38%) | yes (21%) |
| wren-cn60-37 | 1 | 69 | front | yes (15%) | yes (59%) | no (1%) |
| wren-cn60-37 | 2 | 69 | side | yes (38%) | yes (14%) | yes (6%) |
| wren-cn60-37 | 3 | 71 | side | yes (46%) | yes (7%) | yes (6%) |
| wren-cn60-37 | 4 | 58 | back | yes (11%) | yes (61%) | no (1%) |
| wren-cn60-41 | 1 | 60 | front | yes (36%) | yes (42%) | no (1%) |
| wren-cn60-41 | 2 | 61 | side | yes (57%) | yes (20%) | no (1%) |
| wren-cn60-41 | 3 | 60 | back | yes (38%) | yes (42%) | yes (2%) |
| wren-cn80-11 | 1 | 51 | front | yes (51%) | yes (33%) | yes (18%) |
| wren-cn80-11 | 2 | 51 | back | yes (51%) | yes (35%) | yes (19%) |
| wren-cn80-23 | 1 | 57 | front | yes (40%) | yes (43%) | yes (5%) |
| wren-cn80-23 | 2 | 57 | side | yes (68%) | yes (5%) | yes (36%) |
| wren-cn80-23 | 3 | 57 | back | yes (43%) | yes (38%) | yes (5%) |
| wren-cn80-37 | 1 | 58 | front | yes (12%) | yes (50%) | yes (12%) |
| wren-cn80-37 | 2 | 58 | side | yes (80%) | no (1%) | yes (49%) |
| wren-cn80-37 | 3 | 58 | back | yes (11%) | yes (54%) | yes (11%) |
| wren-cn80-41 | 1 | 62 | front | yes (38%) | yes (41%) | yes (6%) |
| wren-cn80-41 | 3 | 49 | side | yes (48%) | no (0%) | yes (59%) |
| wren-cn80-41 | 4 | 61 | back | yes (39%) | yes (41%) | yes (7%) |

### hadrik

| image | figure | height | skeleton slot | very dark skin | black (hair/beard) | cream | leather brown |
|---|---|---|---|---|---|---|---|
| hadrik-cn60-11 | 1 | 57 | front | yes (64%) | yes (34%) | no (1%) | yes (40%) |
| hadrik-cn60-11 | 2 | 69 | side | yes (54%) | yes (26%) | yes (5%) | yes (47%) |
| hadrik-cn60-11 | 3 | 57 | back | yes (72%) | yes (28%) | no (0%) | yes (49%) |
| hadrik-cn60-23 | 1 | 56 | front | yes (51%) | yes (16%) | yes (14%) | yes (45%) |
| hadrik-cn60-23 | 2 | 31 | side | yes (23%) | yes (10%) | no (2%) | yes (77%) |
| hadrik-cn60-23 | 3 | 70 | side | yes (47%) | yes (6%) | yes (7%) | yes (68%) |
| hadrik-cn60-23 | 4 | 56 | back | yes (51%) | yes (15%) | yes (14%) | yes (44%) |
| hadrik-cn60-37 | 1 | 57 | front | yes (43%) | yes (12%) | no (0%) | yes (29%) |
| hadrik-cn60-37 | 2 | 73 | side | yes (45%) | yes (11%) | no (0%) | yes (35%) |
| hadrik-cn60-37 | 3 | 60 | side | yes (40%) | yes (16%) | no (0%) | yes (26%) |
| hadrik-cn60-37 | 4 | 57 | back | yes (45%) | yes (14%) | no (0%) | yes (27%) |
| hadrik-cn60-41 | 1 | 56 | front | yes (49%) | yes (14%) | yes (12%) | yes (32%) |
| hadrik-cn60-41 | 2 | 55 | side | yes (37%) | yes (11%) | yes (8%) | yes (22%) |
| hadrik-cn60-41 | 3 | 52 | side | yes (46%) | yes (5%) | yes (2%) | yes (20%) |
| hadrik-cn60-41 | 4 | 55 | back | yes (48%) | yes (13%) | yes (13%) | yes (32%) |
| hadrik-cn80-11 | 1 | 57 | front | yes (60%) | yes (26%) | no (0%) | yes (51%) |
| hadrik-cn80-11 | 2 | 43 | side | yes (36%) | yes (26%) | no (0%) | yes (24%) |
| hadrik-cn80-11 | 3 | 59 | side | yes (39%) | yes (31%) | no (0%) | yes (23%) |
| hadrik-cn80-11 | 4 | 57 | back | yes (57%) | yes (25%) | no (0%) | yes (44%) |
| hadrik-cn80-23 | 1 | 56 | front | yes (20%) | yes (43%) | yes (14%) | yes (15%) |
| hadrik-cn80-23 | 2 | 31 | side | yes (28%) | no (0%) | no (0%) | yes (99%) |
| hadrik-cn80-23 | 3 | 68 | side | yes (50%) | yes (21%) | yes (2%) | yes (71%) |
| hadrik-cn80-23 | 4 | 56 | back | yes (20%) | yes (42%) | yes (14%) | yes (15%) |
| hadrik-cn80-37 | 1 | 57 | front | yes (46%) | yes (11%) | no (0%) | yes (34%) |
| hadrik-cn80-37 | 2 | 59 | side | yes (46%) | yes (10%) | no (0%) | yes (65%) |
| hadrik-cn80-37 | 3 | 60 | side | yes (50%) | yes (13%) | no (0%) | yes (40%) |
| hadrik-cn80-37 | 4 | 57 | back | yes (46%) | yes (12%) | no (0%) | yes (35%) |
| hadrik-cn80-41 | 1 | 57 | front | yes (37%) | yes (11%) | yes (11%) | yes (45%) |
| hadrik-cn80-41 | 2 | 55 | side | yes (43%) | yes (11%) | yes (8%) | yes (43%) |
| hadrik-cn80-41 | 3 | 59 | side | yes (76%) | yes (3%) | no (1%) | yes (54%) |
| hadrik-cn80-41 | 4 | 56 | back | yes (44%) | yes (12%) | yes (9%) | yes (46%) |


## View check against the skeleton (by eye, on the 8x-downsampled images)

Slots are left to right: front | side (facing right) | back. "extra" = figures outside the three skeletons (extra views, loose objects, blobs).

| image | front slot | side slot | back slot | extra |
|---|---|---|---|---|
| hadrik-cn60-11 | unclear (dark, face hard to read) | side, yes (hammer raised) | back, yes | none |
| hadrik-cn60-23 | back view, NO | side, yes | back, yes | two large brown blobs |
| hadrik-cn60-37 | back view, NO | side, yes, plus a second front-facing figure | back, yes | extra figure |
| hadrik-cn60-41 | front, yes | mixed | back, yes | about 7 figures in a row plus a blob |
| hadrik-cn80-11 | back view, NO | side, yes, plus a cut-off torso | back, yes | partial torso |
| hadrik-cn80-23 | back view, NO | side, yes | back, yes | two large brown blobs |
| hadrik-cn80-37 | back view, NO | side, yes, plus a front figure in an apron | back, yes | extra figure |
| hadrik-cn80-41 | front, yes | mixed | back, yes | about 7 figures in a row plus a blob |
| wren-cn60-11 | back view, NO | side, yes | back, yes | two extra figures (side, front) |
| wren-cn60-23 | back view, NO | side, yes | back, yes | none |
| wren-cn60-37 | back view (hooded), NO | side, yes, plus a front figure | back (hooded), yes | extra figure; hood up on the back views |
| wren-cn60-41 | back view, NO | side, yes (aiming bow) | back, yes | none |
| wren-cn80-11 | back view, NO | missing (only a stray arrow) | back, yes | none |
| wren-cn80-23 | back view, NO | side, yes | back, yes | none |
| wren-cn80-37 | back view (hooded), NO | side, yes | back (hooded), yes | hood up on the back views |
| wren-cn80-41 | back view, NO | missing (loose objects) | back, yes | loose objects |

Summary: the side and back skeletons are followed in nearly every image. The front skeleton is drawn as a back view in 12 of 16 images (front only in hadrik cn60-41 and cn80-41, which also add many extra figures). The front skeleton does have nose and eye points, so the model, not the skeleton, is choosing the back view.
