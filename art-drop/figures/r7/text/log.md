# Round 7 text-only field sprites: log

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. No init image, no ControlNet, no earlier art as input. 1344x768. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts


Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=field | 12 | 12 | 94 | 0 | 0.27 | 0.25 |
| source_anime=False | 12 | 12 | 94 | 0 | 0.27 | 0.25 |
| strength=0.85 | 6 | 6 | 92 | 0 | 0.24 | 0.24 |
| strength=1.0 | 6 | 6 | 94 | 0 | 0.30 | 0.25 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): wren-field-s100-nosrc-41 (0.46), wren-field-s85-nosrc-41 (0.45), wren-field-s100-nosrc-11 (0.38), wren-field-s85-nosrc-11 (0.38)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=field | 12 | 17 | 74 | 2 | 0.39 | 0.50 |
| source_anime=False | 12 | 17 | 74 | 2 | 0.39 | 0.50 |
| strength=0.85 | 6 | 8 | 77 | 1 | 0.41 | 0.45 |
| strength=1.0 | 6 | 9 | 73 | 1 | 0.38 | 0.54 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): hadrik-field-s100-nosrc-41 (0.68), hadrik-field-s85-nosrc-11 (0.67), hadrik-field-s100-nosrc-37 (0.62), hadrik-field-s100-nosrc-53 (0.54)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-field-s100-nosrc-11 figure 1, h=79, flat=0.26, score=0.38
- #2: wren-field-s100-nosrc-23 figure 1, h=94, flat=0.28, score=0.14
- #3: wren-field-s100-nosrc-37 figure 1, h=94, flat=0.55, score=0.28
- #4: wren-field-s100-nosrc-41 figure 1, h=73, flat=0.22, score=0.46
- #5: wren-field-s100-nosrc-53 figure 1, h=94, flat=0.28, score=0.14
- #6: wren-field-s100-nosrc-61 figure 1, h=94, flat=0.22, score=0.11
- #7: wren-field-s85-nosrc-11 figure 1, h=77, flat=0.20, score=0.38
- #8: wren-field-s85-nosrc-23 figure 1, h=94, flat=0.23, score=0.12
- #9: wren-field-s85-nosrc-37 figure 1, h=94, flat=0.48, score=0.24
- #10: wren-field-s85-nosrc-41 figure 1, h=73, flat=0.20, score=0.45
- #11: wren-field-s85-nosrc-53 figure 1, h=94, flat=0.23, score=0.12
- #12: wren-field-s85-nosrc-61 figure 1, h=90, flat=0.12, score=0.13

### hadrik

- #1: hadrik-field-s100-nosrc-11 figure 1, h=73, flat=0.36, score=0.53
- #2: hadrik-field-s100-nosrc-23 figure 1, h=77, flat=0.39, score=0.48
- #3: hadrik-field-s100-nosrc-37 figure 1, h=72, flat=0.31, score=0.52
- #4: hadrik-field-s100-nosrc-37 figure 2, h=73, flat=0.37, score=0.54
- #5: hadrik-field-s100-nosrc-37 figure 3, h=74, flat=0.40, score=0.54
- #6: hadrik-field-s100-nosrc-37 figure 4, h=70, flat=0.44, score=0.62
- #7: hadrik-field-s100-nosrc-41 figure 1, h=64, flat=0.36, score=0.68
- #8: hadrik-field-s100-nosrc-53 figure 1, h=74, flat=0.41, score=0.54
- #9: hadrik-field-s100-nosrc-61 figure 1, h=78, flat=0.39, score=0.46
- #10: hadrik-field-s85-nosrc-11 figure 1, h=69, flat=0.38, score=0.60
- #11: hadrik-field-s85-nosrc-11 figure 2, h=64, flat=0.35, score=0.67
- #12: hadrik-field-s85-nosrc-11 figure 3, h=21, flat=0.46, score=0.24
- #13: hadrik-field-s85-nosrc-23 figure 1, h=78, flat=0.36, score=0.45
- #14: hadrik-field-s85-nosrc-37 figure 1, h=94, flat=0.61, score=0.31
- #15: hadrik-field-s85-nosrc-41 figure 1, h=77, flat=0.33, score=0.45
- #16: hadrik-field-s85-nosrc-53 figure 1, h=77, flat=0.41, score=0.49
- #17: hadrik-field-s85-nosrc-61 figure 1, h=80, flat=0.35, score=0.41

