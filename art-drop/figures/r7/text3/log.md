# Round 7 text-only field sprites, pass 3: log

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. No init image, no ControlNet, no earlier art as input. Framings: t1536 (1536x640 three-view turnaround) and t1344 (1344x768 three-view turnaround with 'short stature, 4 heads tall'). LoRA 1.0, seeds 11/23/37/41. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts


Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=t1344 | 4 | 10 | 70 | 3 | 0.44 | 0.63 |
| mode=t1536 | 4 | 7 | 64 | 4 | 0.47 | 0.71 |
| source_anime=False | 8 | 17 | 68 | 7 | 0.46 | 0.66 |
| strength=1.0 | 8 | 17 | 68 | 7 | 0.46 | 0.66 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): wren-t1536-s100-nosrc-37 (0.77), wren-t1536-s100-nosrc-41 (0.74), wren-t1536-s100-nosrc-11 (0.73), wren-t1344-s100-nosrc-41 (0.73)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=t1344 | 4 | 9 | 69 | 3 | 0.48 | 0.64 |
| mode=t1536 | 4 | 11 | 66 | 4 | 0.54 | 0.73 |
| source_anime=False | 8 | 20 | 66 | 7 | 0.52 | 0.69 |
| strength=1.0 | 8 | 20 | 66 | 7 | 0.52 | 0.69 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): hadrik-t1536-s100-nosrc-23 (0.79), hadrik-t1536-s100-nosrc-41 (0.77), hadrik-t1344-s100-nosrc-41 (0.73), hadrik-t1344-s100-nosrc-11 (0.73)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-t1344-s100-nosrc-11 figure 1, h=74, flat=0.50, score=0.58
- #2: wren-t1344-s100-nosrc-11 figure 2, h=76, flat=0.52, score=0.56
- #3: wren-t1344-s100-nosrc-23 figure 1, h=70, flat=0.39, score=0.59
- #4: wren-t1344-s100-nosrc-23 figure 2, h=69, flat=0.55, score=0.69
- #5: wren-t1344-s100-nosrc-23 figure 3, h=70, flat=0.41, score=0.60
- #6: wren-t1344-s100-nosrc-23 figure 4, h=70, flat=0.50, score=0.65
- #7: wren-t1344-s100-nosrc-37 figure 1, h=72, flat=0.36, score=0.55
- #8: wren-t1344-s100-nosrc-41 figure 1, h=62, flat=0.39, score=0.69
- #9: wren-t1344-s100-nosrc-41 figure 2, h=61, flat=0.39, score=0.69
- #10: wren-t1344-s100-nosrc-41 figure 3, h=62, flat=0.45, score=0.73
- #11: wren-t1536-s100-nosrc-11 figure 1, h=62, flat=0.45, score=0.73
- #12: wren-t1536-s100-nosrc-11 figure 2, h=61, flat=0.47, score=0.73
- #13: wren-t1536-s100-nosrc-23 figure 1, h=68, flat=0.37, score=0.62
- #14: wren-t1536-s100-nosrc-37 figure 1, h=71, flat=0.59, score=0.68
- #15: wren-t1536-s100-nosrc-37 figure 2, h=56, flat=0.54, score=0.77
- #16: wren-t1536-s100-nosrc-41 figure 1, h=64, flat=0.47, score=0.74
- #17: wren-t1536-s100-nosrc-41 figure 2, h=65, flat=0.41, score=0.69

### hadrik

- #1: hadrik-t1344-s100-nosrc-11 figure 1, h=71, flat=0.47, score=0.62
- #2: hadrik-t1344-s100-nosrc-11 figure 2, h=65, flat=0.49, score=0.73
- #3: hadrik-t1344-s100-nosrc-23 figure 1, h=69, flat=0.50, score=0.67
- #4: hadrik-t1344-s100-nosrc-23 figure 2, h=80, flat=0.52, score=0.49
- #5: hadrik-t1344-s100-nosrc-23 figure 3, h=79, flat=0.61, score=0.56
- #6: hadrik-t1344-s100-nosrc-37 figure 1, h=76, flat=0.45, score=0.53
- #7: hadrik-t1344-s100-nosrc-41 figure 1, h=63, flat=0.46, score=0.73
- #8: hadrik-t1344-s100-nosrc-41 figure 2, h=63, flat=0.41, score=0.70
- #9: hadrik-t1344-s100-nosrc-41 figure 3, h=58, flat=0.41, score=0.71
- #10: hadrik-t1536-s100-nosrc-11 figure 1, h=67, flat=0.55, score=0.72
- #11: hadrik-t1536-s100-nosrc-11 figure 2, h=66, flat=0.51, score=0.72
- #12: hadrik-t1536-s100-nosrc-23 figure 1, h=64, flat=0.55, score=0.77
- #13: hadrik-t1536-s100-nosrc-23 figure 2, h=64, flat=0.56, score=0.78
- #14: hadrik-t1536-s100-nosrc-23 figure 3, h=64, flat=0.58, score=0.79
- #15: hadrik-t1536-s100-nosrc-23 figure 4, h=64, flat=0.55, score=0.77
- #16: hadrik-t1536-s100-nosrc-37 figure 1, h=72, flat=0.51, score=0.62
- #17: hadrik-t1536-s100-nosrc-37 figure 2, h=72, flat=0.51, score=0.62
- #18: hadrik-t1536-s100-nosrc-41 figure 1, h=66, flat=0.49, score=0.71
- #19: hadrik-t1536-s100-nosrc-41 figure 2, h=66, flat=0.57, score=0.75
- #20: hadrik-t1536-s100-nosrc-41 figure 3, h=66, flat=0.61, score=0.77


## Colour check (heuristic)

Share of each figure's sprite pixels falling in a rough HSV range for each described colour; 'yes' at 2% or more. This is a crude automatic check for presence, not a judgement of the design: bow, hood-down and hammer can't be checked this way.

### wren

| image | figure | height | auburn hair | green | leather brown |
|---|---|---|---|---|---|
| wren-t1344-s100-nosrc-11 | 1 | 74 | yes (54%) | yes (28%) | yes (12%) |
| wren-t1344-s100-nosrc-11 | 2 | 76 | yes (49%) | yes (34%) | yes (6%) |
| wren-t1344-s100-nosrc-23 | 1 | 70 | yes (28%) | yes (4%) | no (1%) |
| wren-t1344-s100-nosrc-23 | 2 | 69 | yes (18%) | yes (39%) | no (0%) |
| wren-t1344-s100-nosrc-23 | 3 | 70 | yes (29%) | yes (12%) | no (1%) |
| wren-t1344-s100-nosrc-23 | 4 | 70 | yes (26%) | yes (33%) | no (0%) |
| wren-t1344-s100-nosrc-37 | 1 | 72 | yes (56%) | yes (29%) | no (0%) |
| wren-t1344-s100-nosrc-41 | 1 | 62 | yes (40%) | yes (18%) | yes (19%) |
| wren-t1344-s100-nosrc-41 | 2 | 61 | yes (43%) | yes (16%) | yes (17%) |
| wren-t1344-s100-nosrc-41 | 3 | 62 | yes (34%) | yes (20%) | yes (18%) |
| wren-t1536-s100-nosrc-11 | 1 | 62 | yes (45%) | yes (34%) | yes (8%) |
| wren-t1536-s100-nosrc-11 | 2 | 61 | yes (43%) | yes (30%) | yes (9%) |
| wren-t1536-s100-nosrc-23 | 1 | 68 | yes (55%) | yes (17%) | yes (9%) |
| wren-t1536-s100-nosrc-37 | 1 | 71 | yes (37%) | yes (47%) | no (0%) |
| wren-t1536-s100-nosrc-37 | 2 | 56 | yes (41%) | yes (51%) | no (0%) |
| wren-t1536-s100-nosrc-41 | 1 | 64 | yes (26%) | yes (28%) | yes (13%) |
| wren-t1536-s100-nosrc-41 | 2 | 65 | yes (26%) | yes (41%) | yes (10%) |

### hadrik

| image | figure | height | very dark skin | black (hair/beard) | cream | leather brown |
|---|---|---|---|---|---|---|
| hadrik-t1344-s100-nosrc-11 | 1 | 71 | yes (42%) | yes (10%) | no (0%) | yes (28%) |
| hadrik-t1344-s100-nosrc-11 | 2 | 65 | yes (42%) | yes (12%) | no (0%) | yes (20%) |
| hadrik-t1344-s100-nosrc-23 | 1 | 69 | yes (28%) | yes (15%) | yes (7%) | yes (19%) |
| hadrik-t1344-s100-nosrc-23 | 2 | 80 | yes (22%) | yes (12%) | yes (7%) | yes (27%) |
| hadrik-t1344-s100-nosrc-23 | 3 | 79 | yes (22%) | yes (17%) | yes (5%) | yes (13%) |
| hadrik-t1344-s100-nosrc-37 | 1 | 76 | yes (46%) | yes (10%) | yes (3%) | yes (33%) |
| hadrik-t1344-s100-nosrc-41 | 1 | 63 | yes (22%) | yes (15%) | yes (9%) | yes (5%) |
| hadrik-t1344-s100-nosrc-41 | 2 | 63 | yes (21%) | yes (17%) | yes (9%) | yes (4%) |
| hadrik-t1344-s100-nosrc-41 | 3 | 58 | yes (25%) | yes (17%) | yes (3%) | yes (6%) |
| hadrik-t1536-s100-nosrc-11 | 1 | 67 | yes (49%) | yes (29%) | yes (5%) | yes (8%) |
| hadrik-t1536-s100-nosrc-11 | 2 | 66 | yes (49%) | yes (20%) | yes (9%) | yes (7%) |
| hadrik-t1536-s100-nosrc-23 | 1 | 64 | yes (60%) | yes (6%) | no (1%) | no (1%) |
| hadrik-t1536-s100-nosrc-23 | 2 | 64 | yes (49%) | yes (8%) | no (0%) | yes (3%) |
| hadrik-t1536-s100-nosrc-23 | 3 | 64 | yes (40%) | yes (8%) | no (0%) | yes (3%) |
| hadrik-t1536-s100-nosrc-23 | 4 | 64 | yes (44%) | yes (8%) | no (0%) | yes (4%) |
| hadrik-t1536-s100-nosrc-37 | 1 | 72 | yes (22%) | yes (28%) | no (0%) | yes (21%) |
| hadrik-t1536-s100-nosrc-37 | 2 | 72 | yes (21%) | yes (39%) | no (0%) | yes (17%) |
| hadrik-t1536-s100-nosrc-41 | 1 | 66 | yes (20%) | no (0%) | yes (7%) | yes (9%) |
| hadrik-t1536-s100-nosrc-41 | 2 | 66 | yes (17%) | no (0%) | yes (4%) | yes (6%) |
| hadrik-t1536-s100-nosrc-41 | 3 | 66 | yes (16%) | no (0%) | yes (6%) | yes (10%) |

