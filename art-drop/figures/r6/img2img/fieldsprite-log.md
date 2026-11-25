# Round 6 field-sprite text batch: log

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts


Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=field | 8 | 38 | 58 | 7 | 0.21 | 0.42 |
| source_anime=False | 8 | 38 | 58 | 7 | 0.21 | 0.42 |
| strength=0.85 | 4 | 16 | 64 | 4 | 0.23 | 0.45 |
| strength=1.0 | 4 | 22 | 40 | 3 | 0.20 | 0.39 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): wren-field-s85-nosrc-37 (0.65), wren-field-s100-nosrc-37 (0.64), wren-field-s85-nosrc-41 (0.64), wren-field-s100-nosrc-41 (0.61)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=field | 8 | 20 | 76 | 0 | 0.37 | 0.50 |
| source_anime=False | 8 | 20 | 76 | 0 | 0.37 | 0.50 |
| strength=0.85 | 4 | 8 | 77 | 0 | 0.34 | 0.46 |
| strength=1.0 | 4 | 12 | 74 | 0 | 0.38 | 0.53 |

Images with no figure detected: 0

Top 4 by best figure score (raw 1024 images in raw/): hadrik-field-s100-nosrc-11 (0.66), hadrik-field-s100-nosrc-37 (0.64), hadrik-field-s100-nosrc-23 (0.59), hadrik-field-s100-nosrc-41 (0.58)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-field-s100-nosrc-11 figure 1, h=38, flat=0.14, score=0.37
- #2: wren-field-s100-nosrc-11 figure 2, h=34, flat=0.09, score=0.28
- #3: wren-field-s100-nosrc-11 figure 3, h=40, flat=0.19, score=0.43
- #4: wren-field-s100-nosrc-11 figure 4, h=30, flat=0.07, score=0.20
- #5: wren-field-s100-nosrc-11 figure 5, h=40, flat=0.15, score=0.41
- #6: wren-field-s100-nosrc-11 figure 6, h=37, flat=0.23, score=0.40
- #7: wren-field-s100-nosrc-11 figure 7, h=37, flat=0.15, score=0.36
- #8: wren-field-s100-nosrc-11 figure 8, h=40, flat=0.24, score=0.46
- #9: wren-field-s100-nosrc-11 figure 9, h=32, flat=0.12, score=0.26
- #10: wren-field-s100-nosrc-11 figure 10, h=32, flat=0.14, score=0.27
- #11: wren-field-s100-nosrc-11 figure 11, h=31, flat=0.16, score=0.26
- #12: wren-field-s100-nosrc-11 figure 12, h=40, flat=0.11, score=0.39
- #13: wren-field-s100-nosrc-11 figure 13, h=33, flat=0.12, score=0.28
- #14: wren-field-s100-nosrc-23 figure 1, h=81, flat=0.30, score=0.37
- #15: wren-field-s100-nosrc-37 figure 1, h=86, flat=0.30, score=0.28
- #16: wren-field-s100-nosrc-37 figure 2, h=79, flat=0.28, score=0.39
- #17: wren-field-s100-nosrc-37 figure 3, h=86, flat=0.27, score=0.27
- #18: wren-field-s100-nosrc-37 figure 4, h=69, flat=0.45, score=0.64
- #19: wren-field-s100-nosrc-41 figure 1, h=62, flat=0.20, score=0.60
- #20: wren-field-s100-nosrc-41 figure 2, h=63, flat=0.22, score=0.61
- #21: wren-field-s100-nosrc-41 figure 3, h=63, flat=0.17, score=0.58
- #22: wren-field-s100-nosrc-41 figure 4, h=68, flat=0.21, score=0.54
- #23: wren-field-s85-nosrc-11 figure 1, h=36, flat=0.10, score=0.32
- #24: wren-field-s85-nosrc-11 figure 2, h=42, flat=0.15, score=0.44
- #25: wren-field-s85-nosrc-11 figure 3, h=54, flat=0.22, score=0.61
- #26: wren-field-s85-nosrc-11 figure 4, h=39, flat=0.24, score=0.44
- #27: wren-field-s85-nosrc-11 figure 5, h=31, flat=0.17, score=0.27
- #28: wren-field-s85-nosrc-11 figure 6, h=34, flat=0.13, score=0.30
- #29: wren-field-s85-nosrc-11 figure 7, h=81, flat=0.15, score=0.29
- #30: wren-field-s85-nosrc-23 figure 1, h=81, flat=0.30, score=0.36
- #31: wren-field-s85-nosrc-37 figure 1, h=86, flat=0.28, score=0.27
- #32: wren-field-s85-nosrc-37 figure 2, h=71, flat=0.25, score=0.51
- #33: wren-field-s85-nosrc-37 figure 3, h=85, flat=0.25, score=0.28
- #34: wren-field-s85-nosrc-37 figure 4, h=69, flat=0.46, score=0.65
- #35: wren-field-s85-nosrc-41 figure 1, h=64, flat=0.20, score=0.60
- #36: wren-field-s85-nosrc-41 figure 2, h=63, flat=0.27, score=0.64
- #37: wren-field-s85-nosrc-41 figure 3, h=64, flat=0.20, score=0.60
- #38: wren-field-s85-nosrc-41 figure 4, h=68, flat=0.30, score=0.58

### hadrik

- #1: hadrik-field-s100-nosrc-11 figure 1, h=66, flat=0.38, score=0.66
- #2: hadrik-field-s100-nosrc-11 figure 2, h=77, flat=0.38, score=0.47
- #3: hadrik-field-s100-nosrc-23 figure 1, h=71, flat=0.41, score=0.59
- #4: hadrik-field-s100-nosrc-23 figure 2, h=82, flat=0.35, score=0.38
- #5: hadrik-field-s100-nosrc-23 figure 3, h=81, flat=0.40, score=0.42
- #6: hadrik-field-s100-nosrc-37 figure 1, h=75, flat=0.41, score=0.52
- #7: hadrik-field-s100-nosrc-37 figure 2, h=74, flat=0.49, score=0.58
- #8: hadrik-field-s100-nosrc-37 figure 3, h=77, flat=0.38, score=0.47
- #9: hadrik-field-s100-nosrc-37 figure 4, h=68, flat=0.41, score=0.64
- #10: hadrik-field-s100-nosrc-41 figure 1, h=69, flat=0.34, score=0.58
- #11: hadrik-field-s100-nosrc-41 figure 2, h=74, flat=0.28, score=0.47
- #12: hadrik-field-s100-nosrc-41 figure 3, h=73, flat=0.37, score=0.53
- #13: hadrik-field-s85-nosrc-11 figure 1, h=78, flat=0.36, score=0.45
- #14: hadrik-field-s85-nosrc-23 figure 1, h=67, flat=0.26, score=0.58
- #15: hadrik-field-s85-nosrc-23 figure 2, h=84, flat=0.32, score=0.33
- #16: hadrik-field-s85-nosrc-37 figure 1, h=78, flat=0.38, score=0.46
- #17: hadrik-field-s85-nosrc-37 figure 2, h=74, flat=0.38, score=0.52
- #18: hadrik-field-s85-nosrc-37 figure 3, h=81, flat=0.35, score=0.39
- #19: hadrik-field-s85-nosrc-41 figure 1, h=77, flat=0.32, score=0.44
- #20: hadrik-field-s85-nosrc-41 figure 2, h=77, flat=0.39, score=0.48

