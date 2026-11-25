# Round 7 text-only field sprites, pass 2: log

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. No init image, no ControlNet, no earlier art as input. Framings: a768 (768x768 wide shot), b1024 (1024x1024 wide shot), c1344 (1344x768 three-view turnaround). LoRA 1.0, seeds 11/23/37/41. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts


Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=a768 | 4 | 4 | 75 | 0 | 0.33 | 0.48 |
| mode=b1024 | 4 | 6 | 100 | 0 | 0.63 | 0.33 |
| mode=c1344 | 4 | 14 | 67 | 1 | 0.36 | 0.61 |
| source_anime=False | 12 | 24 | 68 | 1 | 0.42 | 0.51 |
| strength=1.0 | 12 | 24 | 68 | 1 | 0.42 | 0.51 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): wren-c1344-s100-nosrc-41 (0.69), wren-c1344-s100-nosrc-23 (0.68), wren-c1344-s100-nosrc-37 (0.67), wren-c1344-s100-nosrc-11 (0.66)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=a768 | 4 | 4 | 77 | 0 | 0.38 | 0.48 |
| mode=b1024 | 4 | 4 | 107 | 0 | 0.47 | 0.24 |
| mode=c1344 | 4 | 16 | 74 | 1 | 0.49 | 0.60 |
| source_anime=False | 12 | 24 | 75 | 1 | 0.47 | 0.52 |
| strength=1.0 | 12 | 24 | 75 | 1 | 0.47 | 0.52 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): hadrik-c1344-s100-nosrc-41 (0.73), hadrik-c1344-s100-nosrc-37 (0.64), hadrik-c1344-s100-nosrc-11 (0.61), hadrik-c1344-s100-nosrc-23 (0.60)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-a768-s100-nosrc-11 figure 1, h=80, flat=0.20, score=0.33
- #2: wren-a768-s100-nosrc-23 figure 1, h=68, flat=0.45, score=0.66
- #3: wren-a768-s100-nosrc-37 figure 1, h=82, flat=0.43, score=0.41
- #4: wren-a768-s100-nosrc-41 figure 1, h=71, flat=0.26, score=0.51
- #5: wren-b1024-s100-nosrc-11 figure 1, h=111, flat=0.36, score=0.18
- #6: wren-b1024-s100-nosrc-23 figure 1, h=96, flat=0.39, score=0.20
- #7: wren-b1024-s100-nosrc-37 figure 1, h=21, flat=1.00, score=0.52
- #8: wren-b1024-s100-nosrc-37 figure 2, h=112, flat=0.75, score=0.38
- #9: wren-b1024-s100-nosrc-37 figure 3, h=24, flat=1.00, score=0.57
- #10: wren-b1024-s100-nosrc-41 figure 1, h=104, flat=0.26, score=0.13
- #11: wren-c1344-s100-nosrc-11 figure 1, h=68, flat=0.46, score=0.66
- #12: wren-c1344-s100-nosrc-11 figure 2, h=73, flat=0.47, score=0.58
- #13: wren-c1344-s100-nosrc-23 figure 1, h=66, flat=0.37, score=0.65
- #14: wren-c1344-s100-nosrc-23 figure 2, h=68, flat=0.30, score=0.58
- #15: wren-c1344-s100-nosrc-23 figure 3, h=67, flat=0.23, score=0.56
- #16: wren-c1344-s100-nosrc-23 figure 4, h=68, flat=0.50, score=0.68
- #17: wren-c1344-s100-nosrc-37 figure 1, h=66, flat=0.40, score=0.67
- #18: wren-c1344-s100-nosrc-37 figure 2, h=69, flat=0.30, score=0.57
- #19: wren-c1344-s100-nosrc-37 figure 3, h=69, flat=0.35, score=0.59
- #20: wren-c1344-s100-nosrc-37 figure 4, h=32, flat=0.22, score=0.31
- #21: wren-c1344-s100-nosrc-41 figure 1, h=64, flat=0.37, score=0.69
- #22: wren-c1344-s100-nosrc-41 figure 2, h=65, flat=0.33, score=0.65
- #23: wren-c1344-s100-nosrc-41 figure 3, h=65, flat=0.32, score=0.64
- #24: wren-c1344-s100-nosrc-41 figure 4, h=68, flat=0.41, score=0.64

### hadrik

- #1: hadrik-a768-s100-nosrc-11 figure 1, h=84, flat=0.37, score=0.35
- #2: hadrik-a768-s100-nosrc-23 figure 1, h=67, flat=0.25, score=0.57
- #3: hadrik-a768-s100-nosrc-37 figure 1, h=81, flat=0.50, score=0.47
- #4: hadrik-a768-s100-nosrc-41 figure 1, h=74, flat=0.39, score=0.53
- #5: hadrik-b1024-s100-nosrc-11 figure 1, h=110, flat=0.40, score=0.20
- #6: hadrik-b1024-s100-nosrc-23 figure 1, h=103, flat=0.41, score=0.20
- #7: hadrik-b1024-s100-nosrc-37 figure 1, h=112, flat=0.62, score=0.31
- #8: hadrik-b1024-s100-nosrc-41 figure 1, h=104, flat=0.46, score=0.23
- #9: hadrik-c1344-s100-nosrc-11 figure 1, h=73, flat=0.52, score=0.61
- #10: hadrik-c1344-s100-nosrc-11 figure 2, h=75, flat=0.46, score=0.55
- #11: hadrik-c1344-s100-nosrc-11 figure 3, h=77, flat=0.52, score=0.54
- #12: hadrik-c1344-s100-nosrc-11 figure 4, h=75, flat=0.52, score=0.58
- #13: hadrik-c1344-s100-nosrc-23 figure 1, h=77, flat=0.38, score=0.47
- #14: hadrik-c1344-s100-nosrc-23 figure 2, h=77, flat=0.54, score=0.56
- #15: hadrik-c1344-s100-nosrc-23 figure 3, h=77, flat=0.56, score=0.57
- #16: hadrik-c1344-s100-nosrc-23 figure 4, h=77, flat=0.62, score=0.60
- #17: hadrik-c1344-s100-nosrc-37 figure 1, h=73, flat=0.42, score=0.56
- #18: hadrik-c1344-s100-nosrc-37 figure 2, h=74, flat=0.62, score=0.64
- #19: hadrik-c1344-s100-nosrc-37 figure 3, h=74, flat=0.60, score=0.63
- #20: hadrik-c1344-s100-nosrc-37 figure 4, h=73, flat=0.49, score=0.60
- #21: hadrik-c1344-s100-nosrc-41 figure 1, h=65, flat=0.35, score=0.66
- #22: hadrik-c1344-s100-nosrc-41 figure 2, h=65, flat=0.47, score=0.72
- #23: hadrik-c1344-s100-nosrc-41 figure 3, h=65, flat=0.35, score=0.66
- #24: hadrik-c1344-s100-nosrc-41 figure 4, h=60, flat=0.46, score=0.73


## Colour check (heuristic)

Share of each figure's sprite pixels falling in a rough HSV range for each described colour; 'yes' at 2% or more. This is a crude automatic check for presence, not a judgement of the design: bow, hood-down and hammer can't be checked this way.

### wren

| image | figure | height | auburn hair | green | leather brown |
|---|---|---|---|---|---|
| wren-a768-s100-nosrc-11 | 1 | 80 | yes (5%) | yes (7%) | no (1%) |
| wren-a768-s100-nosrc-23 | 1 | 68 | yes (4%) | yes (21%) | no (0%) |
| wren-a768-s100-nosrc-37 | 1 | 82 | yes (32%) | yes (55%) | no (0%) |
| wren-a768-s100-nosrc-41 | 1 | 71 | yes (14%) | yes (16%) | no (0%) |
| wren-b1024-s100-nosrc-11 | 1 | 111 | yes (15%) | yes (6%) | yes (7%) |
| wren-b1024-s100-nosrc-23 | 1 | 96 | yes (12%) | yes (40%) | no (0%) |
| wren-b1024-s100-nosrc-37 | 2 | 112 | yes (3%) | yes (28%) | no (0%) |
| wren-b1024-s100-nosrc-41 | 1 | 104 | yes (15%) | yes (4%) | no (0%) |
| wren-c1344-s100-nosrc-11 | 1 | 68 | yes (24%) | no (0%) | yes (7%) |
| wren-c1344-s100-nosrc-11 | 2 | 73 | yes (25%) | no (0%) | yes (5%) |
| wren-c1344-s100-nosrc-23 | 1 | 66 | yes (14%) | yes (50%) | no (0%) |
| wren-c1344-s100-nosrc-23 | 2 | 68 | yes (25%) | yes (36%) | no (0%) |
| wren-c1344-s100-nosrc-23 | 3 | 67 | yes (33%) | yes (32%) | no (0%) |
| wren-c1344-s100-nosrc-23 | 4 | 68 | yes (15%) | yes (44%) | no (0%) |
| wren-c1344-s100-nosrc-37 | 1 | 66 | yes (21%) | yes (6%) | no (0%) |
| wren-c1344-s100-nosrc-37 | 2 | 69 | yes (7%) | yes (21%) | no (0%) |
| wren-c1344-s100-nosrc-37 | 3 | 69 | yes (10%) | yes (13%) | no (0%) |
| wren-c1344-s100-nosrc-37 | 4 | 32 | yes (15%) | yes (16%) | no (0%) |
| wren-c1344-s100-nosrc-41 | 1 | 64 | yes (5%) | yes (3%) | no (0%) |
| wren-c1344-s100-nosrc-41 | 2 | 65 | yes (8%) | no (1%) | no (1%) |
| wren-c1344-s100-nosrc-41 | 3 | 65 | yes (8%) | no (0%) | yes (3%) |
| wren-c1344-s100-nosrc-41 | 4 | 68 | yes (4%) | no (0%) | no (0%) |

### hadrik

| image | figure | height | very dark skin | black (hair/beard) | cream | leather brown |
|---|---|---|---|---|---|---|
| hadrik-a768-s100-nosrc-11 | 1 | 84 | no (0%) | yes (24%) | yes (19%) | no (0%) |
| hadrik-a768-s100-nosrc-23 | 1 | 67 | yes (9%) | yes (29%) | yes (10%) | yes (9%) |
| hadrik-a768-s100-nosrc-37 | 1 | 81 | yes (4%) | yes (52%) | yes (6%) | no (0%) |
| hadrik-a768-s100-nosrc-41 | 1 | 74 | no (0%) | yes (28%) | no (0%) | no (0%) |
| hadrik-b1024-s100-nosrc-11 | 1 | 110 | no (1%) | yes (31%) | yes (8%) | yes (7%) |
| hadrik-b1024-s100-nosrc-23 | 1 | 103 | yes (3%) | yes (39%) | no (1%) | no (0%) |
| hadrik-b1024-s100-nosrc-37 | 1 | 112 | yes (3%) | yes (20%) | yes (4%) | yes (9%) |
| hadrik-b1024-s100-nosrc-41 | 1 | 104 | no (0%) | yes (30%) | yes (7%) | yes (2%) |
| hadrik-c1344-s100-nosrc-11 | 1 | 73 | yes (22%) | yes (19%) | no (0%) | yes (7%) |
| hadrik-c1344-s100-nosrc-11 | 2 | 75 | yes (24%) | yes (14%) | no (0%) | yes (8%) |
| hadrik-c1344-s100-nosrc-11 | 3 | 77 | yes (15%) | yes (20%) | no (0%) | yes (3%) |
| hadrik-c1344-s100-nosrc-11 | 4 | 75 | yes (29%) | yes (17%) | no (0%) | yes (4%) |
| hadrik-c1344-s100-nosrc-23 | 1 | 77 | no (0%) | yes (32%) | no (0%) | no (0%) |
| hadrik-c1344-s100-nosrc-23 | 2 | 77 | no (0%) | yes (41%) | no (0%) | no (0%) |
| hadrik-c1344-s100-nosrc-23 | 3 | 77 | no (0%) | yes (40%) | no (0%) | no (0%) |
| hadrik-c1344-s100-nosrc-23 | 4 | 77 | no (0%) | yes (40%) | no (0%) | no (0%) |
| hadrik-c1344-s100-nosrc-37 | 1 | 73 | yes (8%) | yes (21%) | yes (8%) | yes (7%) |
| hadrik-c1344-s100-nosrc-37 | 2 | 74 | yes (8%) | yes (24%) | no (0%) | yes (21%) |
| hadrik-c1344-s100-nosrc-37 | 3 | 74 | yes (8%) | yes (25%) | no (0%) | yes (18%) |
| hadrik-c1344-s100-nosrc-37 | 4 | 73 | yes (6%) | yes (28%) | yes (11%) | yes (10%) |
| hadrik-c1344-s100-nosrc-41 | 1 | 65 | yes (3%) | yes (20%) | yes (6%) | no (2%) |
| hadrik-c1344-s100-nosrc-41 | 2 | 65 | yes (3%) | yes (29%) | yes (10%) | yes (4%) |
| hadrik-c1344-s100-nosrc-41 | 3 | 65 | no (1%) | yes (19%) | yes (9%) | yes (4%) |
| hadrik-c1344-s100-nosrc-41 | 4 | 60 | yes (4%) | yes (26%) | yes (8%) | yes (5%) |

