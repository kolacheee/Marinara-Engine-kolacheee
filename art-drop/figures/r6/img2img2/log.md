# Round 6 img2img pass 2: 4x-lineup sources at higher denoise

Inputs: front and left views from the round-4 paintdown / sheetgen 4x lineups (pdlu / sglu), each scaled to 460 px tall and placed in a row on a 1344x768 grey (128) canvas (raw turnarounds Lanczos, lineups nearest-neighbour).
Model: Pony Diffusion V6 XL + Pony6.sakuemonq.10 at 1.0, img2img, euler_ancestral, 20 sampling steps over the denoised part of the schedule, CFG 7, clip skip 2. Denoise 0.65 / 0.75, seeds 11 / 23. Sources: pdlu and sglu only.
Downsample and measurement as in candidates/log.md: exact 8x, grid phase 0-7 by lowest block spread, mode colour per block; flat = share of the figure's 8x8 blocks with max channel spread <= 8; score = 0.5 x height fit (50-64 px) + 0.5 x flat.

- wren positive: `score_9, score_8_up, score_7_up, character turnaround, multiple views, full body, standing, same character, simple background, flat grey background, mature female, 30s, adult woman, ranger, auburn hair, tied ponytail, green travelling cloak, hood down, face visible, leather jerkin, leather bracers, short bow on back, quiver, belt, boots`
  negative: `score_4, score_5, score_6, child, loli, shota, chibi, big eyes, petite, nsfw, monochrome, blurry, text, watermark, signature, cropped, out of frame`
- hadrik positive: `score_9, score_8_up, score_7_up, character turnaround, multiple views, full body, standing, same character, simple background, flat grey background, adult man, 40s, muscular, blacksmith, very dark skin, dark-skinned male, black short hair, full black beard, leather apron, cream shirt, rolled-up sleeves, heavy boots, hammer at belt`
  negative: `score_4, score_5, score_6, child, loli, shota, chibi, big eyes, petite, nsfw, monochrome, blurry, text, watermark, signature, cropped, out of frame`

## wren

| variation | figures | median height | 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|
| denoise=0.65 | 8 | 56 | 8 | 0.23 | 0.62 |
| denoise=0.75 | 8 | 59 | 6 | 0.21 | 0.60 |
| src=pdlu | 8 | 57 | 8 | 0.22 | 0.61 |
| src=sglu | 8 | 57 | 6 | 0.22 | 0.60 |

Best 4 (raw in raw/): wren-pdlu-d75-23 (0.66), wren-sglu-d65-11 (0.66), wren-pdlu-d65-11 (0.64), wren-pdlu-d65-23 (0.63)

Sheet index:

- #1: wren-pdlu-d65-11, h=56, flat=0.18, score=0.59
- #2: wren-pdlu-d65-11, h=56, flat=0.28, score=0.64
- #3: wren-pdlu-d65-23, h=58, flat=0.26, score=0.63
- #4: wren-pdlu-d65-23, h=57, flat=0.20, score=0.60
- #5: wren-pdlu-d75-11, h=60, flat=0.14, score=0.57
- #6: wren-pdlu-d75-11, h=61, flat=0.16, score=0.58
- #7: wren-pdlu-d75-23, h=59, flat=0.32, score=0.66
- #8: wren-pdlu-d75-23, h=57, flat=0.26, score=0.63
- #9: wren-sglu-d65-11, h=56, flat=0.20, score=0.60
- #10: wren-sglu-d65-11, h=54, flat=0.31, score=0.66
- #11: wren-sglu-d65-23, h=58, flat=0.23, score=0.61
- #12: wren-sglu-d65-23, h=57, flat=0.22, score=0.61
- #13: wren-sglu-d75-11, h=65, flat=0.16, score=0.56
- #14: wren-sglu-d75-11, h=68, flat=0.22, score=0.54
- #15: wren-sglu-d75-23, h=59, flat=0.19, score=0.59
- #16: wren-sglu-d75-23, h=57, flat=0.24, score=0.62

## hadrik

| variation | figures | median height | 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|
| denoise=0.65 | 8 | 57 | 8 | 0.30 | 0.65 |
| denoise=0.75 | 8 | 57 | 8 | 0.33 | 0.66 |
| src=pdlu | 8 | 57 | 8 | 0.31 | 0.66 |
| src=sglu | 8 | 57 | 8 | 0.32 | 0.66 |

Best 4 (raw in raw/): hadrik-pdlu-d75-23 (0.68), hadrik-sglu-d75-23 (0.68), hadrik-pdlu-d65-11 (0.67), hadrik-sglu-d65-23 (0.67)

Sheet index:

- #1: hadrik-pdlu-d65-11, h=57, flat=0.25, score=0.63
- #2: hadrik-pdlu-d65-11, h=57, flat=0.34, score=0.67
- #3: hadrik-pdlu-d65-23, h=57, flat=0.30, score=0.65
- #4: hadrik-pdlu-d65-23, h=57, flat=0.28, score=0.64
- #5: hadrik-pdlu-d75-11, h=56, flat=0.31, score=0.66
- #6: hadrik-pdlu-d75-11, h=57, flat=0.32, score=0.66
- #7: hadrik-pdlu-d75-23, h=57, flat=0.34, score=0.67
- #8: hadrik-pdlu-d75-23, h=56, flat=0.36, score=0.68
- #9: hadrik-sglu-d65-11, h=57, flat=0.33, score=0.67
- #10: hadrik-sglu-d65-11, h=59, flat=0.26, score=0.63
- #11: hadrik-sglu-d65-23, h=57, flat=0.33, score=0.66
- #12: hadrik-sglu-d65-23, h=57, flat=0.34, score=0.67
- #13: hadrik-sglu-d75-11, h=57, flat=0.30, score=0.65
- #14: hadrik-sglu-d75-11, h=56, flat=0.26, score=0.63
- #15: hadrik-sglu-d75-23, h=58, flat=0.36, score=0.68
- #16: hadrik-sglu-d75-23, h=58, flat=0.35, score=0.68

