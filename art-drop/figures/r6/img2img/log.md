# Round 6 img2img from the round-4 designs

Inputs: views cut from the round-4 paintdown raw turnaround (pd), the sheetgen raw sheet's top row (sg), and the paintdown / sheetgen 4x lineups (pdlu / sglu), each scaled to 460 px tall and placed in a row on a 1344x768 grey (128) canvas (raw turnarounds Lanczos, lineups nearest-neighbour).
Model: Pony Diffusion V6 XL + Pony6.sakuemonq.10 at 1.0, img2img, euler_ancestral, 30 sampling steps over the denoised part of the schedule, CFG 7, clip skip 2. Denoise 0.35 / 0.45 / 0.55 / 0.65, seeds 11 / 23 / 37 / 41.
Downsample and measurement as in candidates/log.md: exact 8x, grid phase 0-7 by lowest block spread, mode colour per block; flat = share of the figure's 8x8 blocks with max channel spread <= 8; score = 0.5 x height fit (50-64 px) + 0.5 x flat.

- wren positive: `score_9, score_8_up, score_7_up, character turnaround, multiple views, full body, standing, same character, simple background, flat grey background, mature female, 30s, adult woman, ranger, auburn hair, tied ponytail, green travelling cloak, hood down, face visible, leather jerkin, leather bracers, short bow on back, quiver, belt, boots`
  negative: `score_4, score_5, score_6, child, loli, shota, chibi, big eyes, petite, nsfw, monochrome, blurry, text, watermark, signature, cropped, out of frame`
- hadrik positive: `score_9, score_8_up, score_7_up, character turnaround, multiple views, full body, standing, same character, simple background, flat grey background, adult man, 40s, muscular, blacksmith, very dark skin, dark-skinned male, black short hair, full black beard, leather apron, cream shirt, rolled-up sleeves, heavy boots, hammer at belt`
  negative: `score_4, score_5, score_6, child, loli, shota, chibi, big eyes, petite, nsfw, monochrome, blurry, text, watermark, signature, cropped, out of frame`

## wren

| variation | figures | median height | 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|
| denoise=0.45 | 22 | 57 | 22 | 0.13 | 0.56 |
| denoise=0.55 | 22 | 57 | 22 | 0.16 | 0.58 |
| src=pd | 12 | 57 | 12 | 0.09 | 0.55 |
| src=pdlu | 8 | 57 | 8 | 0.20 | 0.60 |
| src=sg | 16 | 57 | 16 | 0.14 | 0.57 |
| src=sglu | 8 | 57 | 8 | 0.18 | 0.59 |

Best 8 (raw in raw/): wren-pdlu-d55-11 (0.63), wren-sglu-d55-11 (0.61), wren-pdlu-d55-23 (0.61), wren-pdlu-d45-23 (0.60), wren-pdlu-d45-11 (0.60), wren-sg-d55-11 (0.60), wren-pd-d55-11 (0.60), wren-sglu-d55-23 (0.59)

Sheet index:

- #1: wren-pd-d45-11, h=57, flat=0.09, score=0.54
- #2: wren-pd-d45-11, h=57, flat=0.06, score=0.53
- #3: wren-pd-d45-11, h=57, flat=0.14, score=0.57
- #4: wren-pd-d45-23, h=57, flat=0.03, score=0.52
- #5: wren-pd-d45-23, h=57, flat=0.06, score=0.53
- #6: wren-pd-d45-23, h=57, flat=0.08, score=0.54
- #7: wren-pd-d55-11, h=57, flat=0.08, score=0.54
- #8: wren-pd-d55-11, h=57, flat=0.07, score=0.54
- #9: wren-pd-d55-11, h=58, flat=0.19, score=0.60
- #10: wren-pd-d55-23, h=59, flat=0.07, score=0.54
- #11: wren-pd-d55-23, h=58, flat=0.10, score=0.55
- #12: wren-pd-d55-23, h=59, flat=0.12, score=0.56
- #13: wren-pdlu-d45-11, h=57, flat=0.14, score=0.57
- #14: wren-pdlu-d45-11, h=57, flat=0.20, score=0.60
- #15: wren-pdlu-d45-23, h=57, flat=0.20, score=0.60
- #16: wren-pdlu-d45-23, h=57, flat=0.19, score=0.59
- #17: wren-pdlu-d55-11, h=56, flat=0.18, score=0.59
- #18: wren-pdlu-d55-11, h=55, flat=0.26, score=0.63
- #19: wren-pdlu-d55-23, h=57, flat=0.22, score=0.61
- #20: wren-pdlu-d55-23, h=57, flat=0.18, score=0.59
- #21: wren-sg-d45-11, h=57, flat=0.11, score=0.56
- #22: wren-sg-d45-11, h=58, flat=0.12, score=0.56
- #23: wren-sg-d45-11, h=57, flat=0.14, score=0.57
- #24: wren-sg-d45-11, h=57, flat=0.14, score=0.57
- #25: wren-sg-d45-23, h=57, flat=0.10, score=0.55
- #26: wren-sg-d45-23, h=57, flat=0.14, score=0.57
- #27: wren-sg-d45-23, h=57, flat=0.12, score=0.56
- #28: wren-sg-d45-23, h=57, flat=0.12, score=0.56
- #29: wren-sg-d55-11, h=57, flat=0.14, score=0.57
- #30: wren-sg-d55-11, h=57, flat=0.14, score=0.57
- #31: wren-sg-d55-11, h=57, flat=0.19, score=0.59
- #32: wren-sg-d55-11, h=57, flat=0.20, score=0.60
- #33: wren-sg-d55-23, h=57, flat=0.13, score=0.57
- #34: wren-sg-d55-23, h=57, flat=0.13, score=0.56
- #35: wren-sg-d55-23, h=57, flat=0.14, score=0.57
- #36: wren-sg-d55-23, h=57, flat=0.14, score=0.57
- #37: wren-sglu-d45-11, h=57, flat=0.17, score=0.59
- #38: wren-sglu-d45-11, h=56, flat=0.14, score=0.57
- #39: wren-sglu-d45-23, h=58, flat=0.17, score=0.59
- #40: wren-sglu-d45-23, h=57, flat=0.14, score=0.57
- #41: wren-sglu-d55-11, h=57, flat=0.23, score=0.61
- #42: wren-sglu-d55-11, h=54, flat=0.21, score=0.61
- #43: wren-sglu-d55-23, h=58, flat=0.18, score=0.59
- #44: wren-sglu-d55-23, h=57, flat=0.15, score=0.57

## hadrik

| variation | figures | median height | 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|
| denoise=0.45 | 22 | 57 | 22 | 0.19 | 0.59 |
| denoise=0.55 | 22 | 57 | 22 | 0.23 | 0.61 |
| src=pd | 12 | 57 | 12 | 0.15 | 0.57 |
| src=pdlu | 8 | 57 | 8 | 0.27 | 0.64 |
| src=sg | 16 | 57 | 16 | 0.21 | 0.60 |
| src=sglu | 8 | 57 | 8 | 0.22 | 0.61 |

Best 8 (raw in raw/): hadrik-pdlu-d55-11 (0.68), hadrik-sglu-d55-11 (0.66), hadrik-pdlu-d45-11 (0.65), hadrik-pdlu-d55-23 (0.65), hadrik-sglu-d55-23 (0.62), hadrik-sg-d55-11 (0.62), hadrik-pdlu-d45-23 (0.62), hadrik-sg-d45-11 (0.61)

Sheet index:

- #1: hadrik-pd-d45-11, h=57, flat=0.12, score=0.56
- #2: hadrik-pd-d45-11, h=57, flat=0.11, score=0.55
- #3: hadrik-pd-d45-11, h=57, flat=0.16, score=0.58
- #4: hadrik-pd-d45-23, h=57, flat=0.07, score=0.54
- #5: hadrik-pd-d45-23, h=57, flat=0.12, score=0.56
- #6: hadrik-pd-d45-23, h=58, flat=0.13, score=0.57
- #7: hadrik-pd-d55-11, h=57, flat=0.17, score=0.58
- #8: hadrik-pd-d55-11, h=57, flat=0.17, score=0.59
- #9: hadrik-pd-d55-11, h=57, flat=0.18, score=0.59
- #10: hadrik-pd-d55-23, h=58, flat=0.14, score=0.57
- #11: hadrik-pd-d55-23, h=57, flat=0.18, score=0.59
- #12: hadrik-pd-d55-23, h=58, flat=0.20, score=0.60
- #13: hadrik-pdlu-d45-11, h=57, flat=0.24, score=0.62
- #14: hadrik-pdlu-d45-11, h=57, flat=0.30, score=0.65
- #15: hadrik-pdlu-d45-23, h=57, flat=0.24, score=0.62
- #16: hadrik-pdlu-d45-23, h=57, flat=0.24, score=0.62
- #17: hadrik-pdlu-d55-11, h=57, flat=0.26, score=0.63
- #18: hadrik-pdlu-d55-11, h=57, flat=0.36, score=0.68
- #19: hadrik-pdlu-d55-23, h=57, flat=0.29, score=0.65
- #20: hadrik-pdlu-d55-23, h=57, flat=0.26, score=0.63
- #21: hadrik-sg-d45-11, h=57, flat=0.21, score=0.60
- #22: hadrik-sg-d45-11, h=57, flat=0.20, score=0.60
- #23: hadrik-sg-d45-11, h=57, flat=0.20, score=0.60
- #24: hadrik-sg-d45-11, h=57, flat=0.22, score=0.61
- #25: hadrik-sg-d45-23, h=57, flat=0.16, score=0.58
- #26: hadrik-sg-d45-23, h=57, flat=0.18, score=0.59
- #27: hadrik-sg-d45-23, h=57, flat=0.22, score=0.61
- #28: hadrik-sg-d45-23, h=57, flat=0.19, score=0.60
- #29: hadrik-sg-d55-11, h=57, flat=0.24, score=0.62
- #30: hadrik-sg-d55-11, h=57, flat=0.23, score=0.61
- #31: hadrik-sg-d55-11, h=57, flat=0.24, score=0.62
- #32: hadrik-sg-d55-11, h=57, flat=0.22, score=0.61
- #33: hadrik-sg-d55-23, h=57, flat=0.21, score=0.60
- #34: hadrik-sg-d55-23, h=57, flat=0.20, score=0.60
- #35: hadrik-sg-d55-23, h=57, flat=0.21, score=0.60
- #36: hadrik-sg-d55-23, h=57, flat=0.22, score=0.61
- #37: hadrik-sglu-d45-11, h=57, flat=0.18, score=0.59
- #38: hadrik-sglu-d45-11, h=58, flat=0.18, score=0.59
- #39: hadrik-sglu-d45-23, h=57, flat=0.21, score=0.60
- #40: hadrik-sglu-d45-23, h=57, flat=0.20, score=0.60
- #41: hadrik-sglu-d55-11, h=57, flat=0.31, score=0.66
- #42: hadrik-sglu-d55-11, h=58, flat=0.20, score=0.60
- #43: hadrik-sglu-d55-23, h=57, flat=0.24, score=0.62
- #44: hadrik-sglu-d55-23, h=57, flat=0.25, score=0.62

