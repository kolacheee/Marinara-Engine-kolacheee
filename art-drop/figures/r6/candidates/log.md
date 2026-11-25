# Round 6 candidates: log

Generated 108 images in about 103 min of GPU time. The GPU ran power-capped (about 180 MHz SM clock, ~58 s per 1024x1024 image at 24 steps). The first two sheet images come from the first plan; after seeing figures ~110 px tall the run switched to three modes: sheet (1024x1024), wide (1024x1024, small centred figure) and lineup (1344x768, five views in a row).

Model: Pony Diffusion V6 XL (v6, pruned fp16) + Pony6.sakuemonq.10 LoRA, ComfyUI API. Sampler euler_ancestral, 24 steps, CFG 7, clip skip 2, scheduler normal.
Downsample: exact 8x, grid phase chosen from offsets 0-7 by lowest mean 8x8 block spread; each block takes its mode colour (quantised to 6 bits per channel, mean of the mode members). Figures cut from the flat background (colour distance > 18 from the median border colour), connected components with height >= 20 px.
flat = share of the figure's 8x8 source blocks whose max channel spread is <= 8. score = 0.5 x height fit (1.0 inside 50-64 px) + 0.5 x flat.

## Prompts

- wren / sheet positive (with source_anime): `score_9, score_8_up, score_7_up, source_anime, character sheet, multiple views, front view, side view, back view, full body, standing, same character, simple background, flat grey background, mature female, 30s, adult woman, ranger, auburn hair, tied ponytail, green travelling cloak, hood down, face visible, leather jerkin, leather bracers, short bow on back, quiver, belt, boots`
  negative: `score_4, score_5, score_6, child, loli, shota, chibi, big eyes, petite, nsfw, monochrome, blurry, text, watermark, signature, cropped, out of frame`
- hadrik / sheet positive (with source_anime): `score_9, score_8_up, score_7_up, source_anime, character sheet, multiple views, front view, side view, back view, full body, standing, same character, simple background, flat grey background, adult man, 40s, muscular, blacksmith, very dark skin, dark-skinned male, black short hair, full black beard, leather apron, cream shirt, rolled-up sleeves, heavy boots, hammer at belt`
  negative: `score_4, score_5, score_6, child, loli, shota, chibi, big eyes, petite, nsfw, monochrome, blurry, text, watermark, signature, cropped, out of frame`

Seeds 11, 23, 37, 41; LoRA strength 0.7 / 0.85 / 1.0 (model and clip); source_anime on / off; mode sheet (1024x1024) / single (640x1024).

## What worked (averages over every figure found)

### wren

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=lineup | 18 | 62 | 80 | 0 | 0.39 | 0.46 |
| mode=sheet | 18 | 59 | 97 | 3 | 0.26 | 0.28 |
| mode=wide | 18 | 18 | 113 | 0 | 0.54 | 0.27 |
| source_anime=False | 27 | 73 | 82 | 2 | 0.34 | 0.35 |
| source_anime=True | 27 | 66 | 82 | 1 | 0.37 | 0.36 |
| strength=0.7 | 18 | 45 | 83 | 0 | 0.36 | 0.35 |
| strength=0.85 | 18 | 43 | 85 | 0 | 0.38 | 0.34 |
| strength=1.0 | 18 | 51 | 75 | 3 | 0.33 | 0.39 |

Images with no figure detected: 0

Top 12 by best figure score (raw 1024 images in raw/): wren-lineup-s100-nosrc-37 (0.77), wren-lineup-s100-nosrc-11 (0.71), wren-lineup-s100-src-37 (0.70), wren-lineup-s85-nosrc-37 (0.69), wren-lineup-s100-src-11 (0.68), wren-sheet-s100-nosrc-11 (0.66), wren-lineup-s85-src-37 (0.65), wren-sheet-s70-nosrc-11 (0.63), wren-lineup-s70-nosrc-37 (0.62), wren-lineup-s85-nosrc-23 (0.62), wren-lineup-s70-src-23 (0.62), wren-lineup-s70-src-11 (0.60)

### hadrik

| variation | images | figures | median height | figures 50-64 px | mean flat | mean score |
|---|---|---|---|---|---|---|
| mode=lineup | 18 | 55 | 79 | 1 | 0.38 | 0.45 |
| mode=sheet | 18 | 64 | 99 | 1 | 0.44 | 0.36 |
| mode=wide | 18 | 18 | 110 | 0 | 0.54 | 0.27 |
| source_anime=False | 27 | 66 | 84 | 1 | 0.43 | 0.38 |
| source_anime=True | 27 | 71 | 83 | 1 | 0.43 | 0.39 |
| strength=0.7 | 18 | 46 | 85 | 0 | 0.41 | 0.34 |
| strength=0.85 | 18 | 44 | 83 | 1 | 0.42 | 0.38 |
| strength=1.0 | 18 | 47 | 80 | 1 | 0.45 | 0.43 |

Images with no figure detected: 0

Top 12 by best figure score (raw 1024 images in raw/): hadrik-sheet-s100-nosrc-37 (0.77), hadrik-sheet-s85-src-37 (0.75), hadrik-sheet-s100-src-37 (0.75), hadrik-sheet-s85-nosrc-37 (0.67), hadrik-lineup-s100-nosrc-23 (0.64), hadrik-lineup-s100-src-37 (0.64), hadrik-sheet-s85-src-11 (0.62), hadrik-sheet-s70-nosrc-37 (0.62), hadrik-sheet-s70-src-37 (0.60), hadrik-lineup-s100-nosrc-37 (0.59), hadrik-sheet-s85-nosrc-11 (0.56), hadrik-lineup-s85-src-37 (0.56)

## Sheet index

Numbers on the contact sheets map to images as follows.

### wren

- #1: wren-lineup-s100-nosrc-11 figure 1, h=70, flat=0.29, score=0.55
- #2: wren-lineup-s100-nosrc-11 figure 2, h=69, flat=0.46, score=0.65
- #3: wren-lineup-s100-nosrc-11 figure 3, h=68, flat=0.55, score=0.71
- #4: wren-lineup-s100-nosrc-23 figure 1, h=80, flat=0.31, score=0.39
- #5: wren-lineup-s100-nosrc-23 figure 2, h=81, flat=0.56, score=0.49
- #6: wren-lineup-s100-nosrc-23 figure 3, h=80, flat=0.40, score=0.43
- #7: wren-lineup-s100-nosrc-37 figure 1, h=78, flat=0.33, score=0.43
- #8: wren-lineup-s100-nosrc-37 figure 2, h=78, flat=0.20, score=0.37
- #9: wren-lineup-s100-nosrc-37 figure 3, h=78, flat=0.24, score=0.39
- #10: wren-lineup-s100-nosrc-37 figure 4, h=70, flat=0.74, score=0.77
- #11: wren-lineup-s100-src-11 figure 1, h=71, flat=0.30, score=0.53
- #12: wren-lineup-s100-src-11 figure 2, h=71, flat=0.44, score=0.60
- #13: wren-lineup-s100-src-11 figure 3, h=69, flat=0.52, score=0.68
- #14: wren-lineup-s100-src-23 figure 1, h=74, flat=0.31, score=0.49
- #15: wren-lineup-s100-src-23 figure 2, h=73, flat=0.47, score=0.59
- #16: wren-lineup-s100-src-23 figure 3, h=80, flat=0.39, score=0.43
- #17: wren-lineup-s100-src-37 figure 1, h=75, flat=0.35, score=0.49
- #18: wren-lineup-s100-src-37 figure 2, h=75, flat=0.30, score=0.47
- #19: wren-lineup-s100-src-37 figure 3, h=77, flat=0.30, score=0.43
- #20: wren-lineup-s100-src-37 figure 4, h=75, flat=0.77, score=0.70
- #21: wren-lineup-s70-nosrc-11 figure 1, h=81, flat=0.34, score=0.39
- #22: wren-lineup-s70-nosrc-11 figure 2, h=80, flat=0.42, score=0.45
- #23: wren-lineup-s70-nosrc-23 figure 1, h=83, flat=0.29, score=0.33
- #24: wren-lineup-s70-nosrc-23 figure 2, h=84, flat=0.33, score=0.33
- #25: wren-lineup-s70-nosrc-23 figure 3, h=86, flat=0.22, score=0.24
- #26: wren-lineup-s70-nosrc-23 figure 4, h=74, flat=0.38, score=0.52
- #27: wren-lineup-s70-nosrc-37 figure 1, h=85, flat=0.36, score=0.33
- #28: wren-lineup-s70-nosrc-37 figure 2, h=84, flat=0.32, score=0.33
- #29: wren-lineup-s70-nosrc-37 figure 3, h=85, flat=0.27, score=0.28
- #30: wren-lineup-s70-nosrc-37 figure 4, h=79, flat=0.74, score=0.62
- #31: wren-lineup-s70-src-11 figure 1, h=81, flat=0.23, score=0.33
- #32: wren-lineup-s70-src-11 figure 2, h=81, flat=0.29, score=0.36
- #33: wren-lineup-s70-src-11 figure 3, h=81, flat=0.41, score=0.42
- #34: wren-lineup-s70-src-11 figure 4, h=66, flat=0.27, score=0.60
- #35: wren-lineup-s70-src-23 figure 1, h=81, flat=0.29, score=0.36
- #36: wren-lineup-s70-src-23 figure 2, h=74, flat=0.35, score=0.51
- #37: wren-lineup-s70-src-23 figure 3, h=72, flat=0.29, score=0.51
- #38: wren-lineup-s70-src-23 figure 4, h=67, flat=0.33, score=0.62
- #39: wren-lineup-s70-src-37 figure 1, h=83, flat=0.29, score=0.33
- #40: wren-lineup-s70-src-37 figure 2, h=83, flat=0.32, score=0.34
- #41: wren-lineup-s70-src-37 figure 3, h=83, flat=0.28, score=0.32
- #42: wren-lineup-s70-src-37 figure 4, h=82, flat=0.77, score=0.59
- #43: wren-lineup-s85-nosrc-11 figure 1, h=72, flat=0.26, score=0.50
- #44: wren-lineup-s85-nosrc-11 figure 2, h=71, flat=0.44, score=0.60
- #45: wren-lineup-s85-nosrc-11 figure 3, h=79, flat=0.56, score=0.53
- #46: wren-lineup-s85-nosrc-23 figure 1, h=82, flat=0.32, score=0.36
- #47: wren-lineup-s85-nosrc-23 figure 2, h=85, flat=0.47, score=0.38
- #48: wren-lineup-s85-nosrc-23 figure 3, h=85, flat=0.37, score=0.34
- #49: wren-lineup-s85-nosrc-23 figure 4, h=68, flat=0.37, score=0.62
- #50: wren-lineup-s85-nosrc-37 figure 1, h=84, flat=0.34, score=0.34
- #51: wren-lineup-s85-nosrc-37 figure 2, h=82, flat=0.19, score=0.30
- #52: wren-lineup-s85-nosrc-37 figure 3, h=84, flat=0.24, score=0.29
- #53: wren-lineup-s85-nosrc-37 figure 4, h=76, flat=0.79, score=0.69
- #54: wren-lineup-s85-src-11 figure 1, h=79, flat=0.36, score=0.43
- #55: wren-lineup-s85-src-11 figure 2, h=80, flat=0.45, score=0.46
- #56: wren-lineup-s85-src-23 figure 1, h=80, flat=0.35, score=0.41
- #57: wren-lineup-s85-src-23 figure 2, h=74, flat=0.46, score=0.56
- #58: wren-lineup-s85-src-23 figure 3, h=85, flat=0.35, score=0.33
- #59: wren-lineup-s85-src-37 figure 1, h=82, flat=0.36, score=0.38
- #60: wren-lineup-s85-src-37 figure 2, h=82, flat=0.30, score=0.35
- #61: wren-lineup-s85-src-37 figure 3, h=83, flat=0.30, score=0.34
- #62: wren-lineup-s85-src-37 figure 4, h=77, flat=0.73, score=0.65
- #63: wren-sheet-s100-nosrc-11 figure 1, h=25, flat=0.07, score=0.12
- #64: wren-sheet-s100-nosrc-11 figure 2, h=67, flat=0.16, score=0.53
- #65: wren-sheet-s100-nosrc-11 figure 3, h=28, flat=0.08, score=0.17
- #66: wren-sheet-s100-nosrc-11 figure 4, h=60, flat=0.24, score=0.62
- #67: wren-sheet-s100-nosrc-11 figure 5, h=65, flat=0.36, score=0.66
- #68: wren-sheet-s100-nosrc-11 figure 6, h=26, flat=0.05, score=0.13
- #69: wren-sheet-s100-nosrc-11 figure 7, h=63, flat=0.18, score=0.59
- #70: wren-sheet-s100-nosrc-11 figure 8, h=27, flat=0.07, score=0.15
- #71: wren-sheet-s100-nosrc-23 figure 1, h=104, flat=0.25, score=0.12
- #72: wren-sheet-s100-nosrc-23 figure 2, h=103, flat=0.24, score=0.12
- #73: wren-sheet-s100-nosrc-23 figure 3, h=94, flat=0.36, score=0.18
- #74: wren-sheet-s100-nosrc-37 figure 1, h=100, flat=0.22, score=0.11
- #75: wren-sheet-s100-nosrc-37 figure 2, h=95, flat=0.30, score=0.15
- #76: wren-sheet-s100-nosrc-37 figure 3, h=45, flat=0.21, score=0.52
- #77: wren-sheet-s100-nosrc-37 figure 4, h=40, flat=0.24, score=0.46
- #78: wren-sheet-s100-src-11 figure 1, h=113, flat=0.18, score=0.09
- #79: wren-sheet-s100-src-11 figure 2, h=50, flat=0.09, score=0.55
- #80: wren-sheet-s100-src-11 figure 3, h=44, flat=0.17, score=0.49
- #81: wren-sheet-s100-src-11 figure 4, h=106, flat=0.33, score=0.17
- #82: wren-sheet-s100-src-11 figure 5, h=108, flat=0.25, score=0.12
- #83: wren-sheet-s100-src-23 figure 1, h=103, flat=0.41, score=0.20
- #84: wren-sheet-s100-src-37 figure 1, h=98, flat=0.24, score=0.12
- #85: wren-sheet-s100-src-37 figure 2, h=93, flat=0.32, score=0.18
- #86: wren-sheet-s100-src-37 figure 3, h=45, flat=0.23, score=0.53
- #87: wren-sheet-s100-src-37 figure 4, h=40, flat=0.30, score=0.48
- #88: wren-sheet-s70-nosrc-11 figure 1, h=65, flat=0.30, score=0.63
- #89: wren-sheet-s70-nosrc-11 figure 2, h=46, flat=0.32, score=0.59
- #90: wren-sheet-s70-nosrc-11 figure 3, h=102, flat=0.42, score=0.21
- #91: wren-sheet-s70-nosrc-11 figure 4, h=106, flat=0.21, score=0.11
- #92: wren-sheet-s70-nosrc-23 figure 1, h=118, flat=0.48, score=0.24
- #93: wren-sheet-s70-nosrc-37 figure 1, h=109, flat=0.24, score=0.12
- #94: wren-sheet-s70-nosrc-37 figure 2, h=102, flat=0.31, score=0.15
- #95: wren-sheet-s70-nosrc-37 figure 3, h=40, flat=0.19, score=0.43
- #96: wren-sheet-s70-nosrc-37 figure 4, h=44, flat=0.24, score=0.52
- #97: wren-sheet-s70-src-11 figure 1, h=113, flat=0.23, score=0.11
- #98: wren-sheet-s70-src-11 figure 2, h=104, flat=0.34, score=0.17
- #99: wren-sheet-s70-src-11 figure 3, h=105, flat=0.23, score=0.11
- #100: wren-sheet-s70-src-23 figure 1, h=106, flat=0.37, score=0.18
- #101: wren-sheet-s70-src-37 figure 1, h=108, flat=0.20, score=0.10
- #102: wren-sheet-s70-src-37 figure 2, h=102, flat=0.39, score=0.20
- #103: wren-sheet-s70-src-37 figure 3, h=42, flat=0.24, score=0.49
- #104: wren-sheet-s70-src-37 figure 4, h=40, flat=0.33, score=0.50
- #105: wren-sheet-s85-nosrc-11 figure 1, h=113, flat=0.22, score=0.11
- #106: wren-sheet-s85-nosrc-11 figure 2, h=108, flat=0.38, score=0.19
- #107: wren-sheet-s85-nosrc-11 figure 3, h=108, flat=0.21, score=0.10
- #108: wren-sheet-s85-nosrc-23 figure 1, h=105, flat=0.31, score=0.15
- #109: wren-sheet-s85-nosrc-23 figure 2, h=93, flat=0.33, score=0.18
- #110: wren-sheet-s85-nosrc-37 figure 1, h=103, flat=0.27, score=0.14
- #111: wren-sheet-s85-nosrc-37 figure 2, h=95, flat=0.34, score=0.17
- #112: wren-sheet-s85-nosrc-37 figure 3, h=40, flat=0.24, score=0.45
- #113: wren-sheet-s85-nosrc-37 figure 4, h=40, flat=0.29, score=0.48
- #114: wren-sheet-s85-src-11 figure 1, h=112, flat=0.25, score=0.13
- #115: wren-sheet-s85-src-11 figure 2, h=105, flat=0.43, score=0.21
- #116: wren-sheet-s85-src-11 figure 3, h=107, flat=0.23, score=0.11
- #117: wren-sheet-s85-src-23 figure 1, h=104, flat=0.37, score=0.18
- #118: wren-sheet-s85-src-37 figure 1, h=104, flat=0.24, score=0.12
- #119: wren-sheet-s85-src-37 figure 2, h=97, flat=0.35, score=0.17
- #120: wren-sheet-s85-src-37 figure 3, h=45, flat=0.19, score=0.51
- #121: wren-sheet-s85-src-37 figure 4, h=40, flat=0.32, score=0.49
- #122: wren-wide-s100-nosrc-11 figure 1, h=111, flat=0.33, score=0.17
- #123: wren-wide-s100-nosrc-23 figure 1, h=103, flat=0.40, score=0.20
- #124: wren-wide-s100-nosrc-37 figure 1, h=109, flat=0.72, score=0.36
- #125: wren-wide-s100-src-11 figure 1, h=111, flat=0.41, score=0.20
- #126: wren-wide-s100-src-23 figure 1, h=119, flat=0.66, score=0.33
- #127: wren-wide-s100-src-37 figure 1, h=107, flat=0.73, score=0.36
- #128: wren-wide-s70-nosrc-11 figure 1, h=114, flat=0.31, score=0.15
- #129: wren-wide-s70-nosrc-23 figure 1, h=115, flat=0.55, score=0.28
- #130: wren-wide-s70-nosrc-37 figure 1, h=115, flat=0.68, score=0.34
- #131: wren-wide-s70-src-11 figure 1, h=114, flat=0.41, score=0.20
- #132: wren-wide-s70-src-23 figure 1, h=113, flat=0.50, score=0.25
- #133: wren-wide-s70-src-37 figure 1, h=116, flat=0.69, score=0.35
- #134: wren-wide-s85-nosrc-11 figure 1, h=113, flat=0.38, score=0.19
- #135: wren-wide-s85-nosrc-23 figure 1, h=117, flat=0.62, score=0.31
- #136: wren-wide-s85-nosrc-37 figure 1, h=109, flat=0.67, score=0.34
- #137: wren-wide-s85-src-11 figure 1, h=113, flat=0.39, score=0.20
- #138: wren-wide-s85-src-23 figure 1, h=117, flat=0.62, score=0.31
- #139: wren-wide-s85-src-37 figure 1, h=115, flat=0.70, score=0.35

### hadrik

- #1: hadrik-lineup-s100-nosrc-11 figure 1, h=77, flat=0.46, score=0.51
- #2: hadrik-lineup-s100-nosrc-11 figure 2, h=79, flat=0.33, score=0.42
- #3: hadrik-lineup-s100-nosrc-23 figure 1, h=79, flat=0.34, score=0.42
- #4: hadrik-lineup-s100-nosrc-23 figure 2, h=51, flat=0.28, score=0.64
- #5: hadrik-lineup-s100-nosrc-23 figure 3, h=81, flat=0.46, score=0.45
- #6: hadrik-lineup-s100-nosrc-37 figure 1, h=76, flat=0.34, score=0.47
- #7: hadrik-lineup-s100-nosrc-37 figure 2, h=70, flat=0.38, score=0.59
- #8: hadrik-lineup-s100-nosrc-37 figure 3, h=74, flat=0.40, score=0.53
- #9: hadrik-lineup-s100-nosrc-37 figure 4, h=69, flat=0.35, score=0.59
- #10: hadrik-lineup-s100-src-11 figure 1, h=80, flat=0.43, score=0.45
- #11: hadrik-lineup-s100-src-11 figure 2, h=81, flat=0.40, score=0.42
- #12: hadrik-lineup-s100-src-11 figure 3, h=69, flat=0.26, score=0.54
- #13: hadrik-lineup-s100-src-23 figure 1, h=79, flat=0.37, score=0.44
- #14: hadrik-lineup-s100-src-23 figure 2, h=81, flat=0.44, score=0.44
- #15: hadrik-lineup-s100-src-37 figure 1, h=76, flat=0.42, score=0.51
- #16: hadrik-lineup-s100-src-37 figure 2, h=70, flat=0.48, score=0.64
- #17: hadrik-lineup-s100-src-37 figure 3, h=74, flat=0.46, score=0.56
- #18: hadrik-lineup-s100-src-37 figure 4, h=70, flat=0.47, score=0.64
- #19: hadrik-lineup-s70-nosrc-11 figure 1, h=85, flat=0.40, score=0.35
- #20: hadrik-lineup-s70-nosrc-11 figure 2, h=84, flat=0.40, score=0.37
- #21: hadrik-lineup-s70-nosrc-11 figure 3, h=85, flat=0.42, score=0.36
- #22: hadrik-lineup-s70-nosrc-23 figure 1, h=81, flat=0.30, score=0.37
- #23: hadrik-lineup-s70-nosrc-23 figure 2, h=84, flat=0.39, score=0.36
- #24: hadrik-lineup-s70-nosrc-37 figure 1, h=78, flat=0.43, score=0.48
- #25: hadrik-lineup-s70-nosrc-37 figure 2, h=73, flat=0.32, score=0.51
- #26: hadrik-lineup-s70-nosrc-37 figure 3, h=76, flat=0.30, score=0.45
- #27: hadrik-lineup-s70-nosrc-37 figure 4, h=73, flat=0.28, score=0.49
- #28: hadrik-lineup-s70-src-11 figure 1, h=85, flat=0.38, score=0.34
- #29: hadrik-lineup-s70-src-11 figure 2, h=83, flat=0.34, score=0.36
- #30: hadrik-lineup-s70-src-11 figure 3, h=85, flat=0.37, score=0.34
- #31: hadrik-lineup-s70-src-23 figure 1, h=80, flat=0.29, score=0.38
- #32: hadrik-lineup-s70-src-23 figure 2, h=84, flat=0.35, score=0.34
- #33: hadrik-lineup-s70-src-23 figure 3, h=84, flat=0.39, score=0.36
- #34: hadrik-lineup-s70-src-37 figure 1, h=78, flat=0.35, score=0.44
- #35: hadrik-lineup-s70-src-37 figure 2, h=74, flat=0.34, score=0.50
- #36: hadrik-lineup-s70-src-37 figure 3, h=76, flat=0.33, score=0.47
- #37: hadrik-lineup-s70-src-37 figure 4, h=74, flat=0.35, score=0.51
- #38: hadrik-lineup-s85-nosrc-11 figure 1, h=85, flat=0.44, score=0.37
- #39: hadrik-lineup-s85-nosrc-11 figure 2, h=83, flat=0.43, score=0.40
- #40: hadrik-lineup-s85-nosrc-11 figure 3, h=83, flat=0.42, score=0.39
- #41: hadrik-lineup-s85-nosrc-11 figure 4, h=85, flat=0.44, score=0.37
- #42: hadrik-lineup-s85-nosrc-23 figure 1, h=80, flat=0.36, score=0.41
- #43: hadrik-lineup-s85-nosrc-23 figure 2, h=83, flat=0.41, score=0.39
- #44: hadrik-lineup-s85-nosrc-37 figure 1, h=79, flat=0.43, score=0.46
- #45: hadrik-lineup-s85-nosrc-37 figure 2, h=72, flat=0.34, score=0.54
- #46: hadrik-lineup-s85-nosrc-37 figure 3, h=76, flat=0.35, score=0.47
- #47: hadrik-lineup-s85-src-11 figure 1, h=85, flat=0.46, score=0.38
- #48: hadrik-lineup-s85-src-11 figure 2, h=83, flat=0.47, score=0.42
- #49: hadrik-lineup-s85-src-11 figure 3, h=85, flat=0.40, score=0.35
- #50: hadrik-lineup-s85-src-23 figure 1, h=83, flat=0.36, score=0.36
- #51: hadrik-lineup-s85-src-23 figure 2, h=83, flat=0.46, score=0.41
- #52: hadrik-lineup-s85-src-37 figure 1, h=78, flat=0.40, score=0.47
- #53: hadrik-lineup-s85-src-37 figure 2, h=73, flat=0.40, score=0.55
- #54: hadrik-lineup-s85-src-37 figure 3, h=76, flat=0.40, score=0.50
- #55: hadrik-lineup-s85-src-37 figure 4, h=72, flat=0.38, score=0.56
- #56: hadrik-sheet-s100-nosrc-11 figure 1, h=112, flat=0.50, score=0.25
- #57: hadrik-sheet-s100-nosrc-11 figure 2, h=74, flat=0.35, score=0.51
- #58: hadrik-sheet-s100-nosrc-23 figure 1, h=104, flat=0.46, score=0.23
- #59: hadrik-sheet-s100-nosrc-23 figure 2, h=102, flat=0.47, score=0.24
- #60: hadrik-sheet-s100-nosrc-23 figure 3, h=103, flat=0.55, score=0.27
- #61: hadrik-sheet-s100-nosrc-37 figure 1, h=84, flat=0.42, score=0.38
- #62: hadrik-sheet-s100-nosrc-37 figure 2, h=83, flat=0.35, score=0.36
- #63: hadrik-sheet-s100-nosrc-37 figure 3, h=90, flat=0.57, score=0.35
- #64: hadrik-sheet-s100-nosrc-37 figure 4, h=49, flat=0.57, score=0.77
- #65: hadrik-sheet-s100-nosrc-37 figure 5, h=35, flat=0.68, score=0.59
- #66: hadrik-sheet-s100-src-11 figure 1, h=31, flat=0.25, score=0.31
- #67: hadrik-sheet-s100-src-11 figure 2, h=109, flat=0.40, score=0.20
- #68: hadrik-sheet-s100-src-11 figure 3, h=72, flat=0.38, score=0.56
- #69: hadrik-sheet-s100-src-11 figure 4, h=33, flat=0.53, score=0.48
- #70: hadrik-sheet-s100-src-11 figure 5, h=72, flat=0.26, score=0.50
- #71: hadrik-sheet-s100-src-23 figure 1, h=105, flat=0.40, score=0.20
- #72: hadrik-sheet-s100-src-23 figure 2, h=102, flat=0.46, score=0.23
- #73: hadrik-sheet-s100-src-23 figure 3, h=103, flat=0.51, score=0.26
- #74: hadrik-sheet-s100-src-37 figure 1, h=84, flat=0.43, score=0.38
- #75: hadrik-sheet-s100-src-37 figure 2, h=84, flat=0.39, score=0.36
- #76: hadrik-sheet-s100-src-37 figure 3, h=90, flat=0.69, score=0.41
- #77: hadrik-sheet-s100-src-37 figure 4, h=49, flat=0.53, score=0.75
- #78: hadrik-sheet-s100-src-37 figure 5, h=35, flat=0.70, score=0.60
- #79: hadrik-sheet-s70-nosrc-11 figure 1, h=109, flat=0.39, score=0.20
- #80: hadrik-sheet-s70-nosrc-11 figure 2, h=28, flat=0.65, score=0.46
- #81: hadrik-sheet-s70-nosrc-11 figure 3, h=108, flat=0.30, score=0.15
- #82: hadrik-sheet-s70-nosrc-23 figure 1, h=107, flat=0.41, score=0.20
- #83: hadrik-sheet-s70-nosrc-23 figure 2, h=104, flat=0.51, score=0.26
- #84: hadrik-sheet-s70-nosrc-23 figure 3, h=106, flat=0.48, score=0.24
- #85: hadrik-sheet-s70-nosrc-37 figure 1, h=103, flat=0.36, score=0.18
- #86: hadrik-sheet-s70-nosrc-37 figure 2, h=106, flat=0.42, score=0.21
- #87: hadrik-sheet-s70-nosrc-37 figure 3, h=103, flat=0.42, score=0.21
- #88: hadrik-sheet-s70-nosrc-37 figure 4, h=42, flat=0.42, score=0.58
- #89: hadrik-sheet-s70-nosrc-37 figure 5, h=43, flat=0.47, score=0.62
- #90: hadrik-sheet-s70-src-11 figure 1, h=31, flat=0.45, score=0.41
- #91: hadrik-sheet-s70-src-11 figure 2, h=108, flat=0.38, score=0.19
- #92: hadrik-sheet-s70-src-11 figure 3, h=111, flat=0.42, score=0.21
- #93: hadrik-sheet-s70-src-23 figure 1, h=107, flat=0.41, score=0.20
- #94: hadrik-sheet-s70-src-23 figure 2, h=104, flat=0.36, score=0.18
- #95: hadrik-sheet-s70-src-23 figure 3, h=106, flat=0.49, score=0.25
- #96: hadrik-sheet-s70-src-37 figure 1, h=104, flat=0.36, score=0.18
- #97: hadrik-sheet-s70-src-37 figure 2, h=103, flat=0.39, score=0.20
- #98: hadrik-sheet-s70-src-37 figure 3, h=42, flat=0.42, score=0.58
- #99: hadrik-sheet-s70-src-37 figure 4, h=43, flat=0.43, score=0.60
- #100: hadrik-sheet-s85-nosrc-11 figure 1, h=29, flat=0.31, score=0.30
- #101: hadrik-sheet-s85-nosrc-11 figure 2, h=107, flat=0.42, score=0.21
- #102: hadrik-sheet-s85-nosrc-11 figure 3, h=111, flat=0.38, score=0.19
- #103: hadrik-sheet-s85-nosrc-11 figure 4, h=69, flat=0.30, score=0.56
- #104: hadrik-sheet-s85-nosrc-23 figure 1, h=106, flat=0.40, score=0.20
- #105: hadrik-sheet-s85-nosrc-37 figure 1, h=102, flat=0.41, score=0.20
- #106: hadrik-sheet-s85-nosrc-37 figure 2, h=99, flat=0.47, score=0.23
- #107: hadrik-sheet-s85-nosrc-37 figure 3, h=47, flat=0.44, score=0.67
- #108: hadrik-sheet-s85-nosrc-37 figure 4, h=44, flat=0.48, score=0.64
- #109: hadrik-sheet-s85-src-11 figure 1, h=27, flat=0.31, score=0.27
- #110: hadrik-sheet-s85-src-11 figure 2, h=109, flat=0.44, score=0.22
- #111: hadrik-sheet-s85-src-11 figure 3, h=37, flat=0.44, score=0.50
- #112: hadrik-sheet-s85-src-11 figure 4, h=70, flat=0.44, score=0.62
- #113: hadrik-sheet-s85-src-11 figure 5, h=71, flat=0.22, score=0.49
- #114: hadrik-sheet-s85-src-23 figure 1, h=106, flat=0.38, score=0.19
- #115: hadrik-sheet-s85-src-23 figure 2, h=104, flat=0.41, score=0.20
- #116: hadrik-sheet-s85-src-37 figure 1, h=101, flat=0.36, score=0.18
- #117: hadrik-sheet-s85-src-37 figure 2, h=100, flat=0.49, score=0.24
- #118: hadrik-sheet-s85-src-37 figure 3, h=50, flat=0.51, score=0.75
- #119: hadrik-sheet-s85-src-37 figure 4, h=40, flat=0.50, score=0.58
- #120: hadrik-wide-s100-nosrc-11 figure 1, h=108, flat=0.41, score=0.20
- #121: hadrik-wide-s100-nosrc-23 figure 1, h=104, flat=0.45, score=0.23
- #122: hadrik-wide-s100-nosrc-37 figure 1, h=114, flat=0.76, score=0.38
- #123: hadrik-wide-s100-src-11 figure 1, h=109, flat=0.43, score=0.22
- #124: hadrik-wide-s100-src-23 figure 1, h=105, flat=0.51, score=0.25
- #125: hadrik-wide-s100-src-37 figure 1, h=112, flat=0.74, score=0.37
- #126: hadrik-wide-s70-nosrc-11 figure 1, h=110, flat=0.47, score=0.24
- #127: hadrik-wide-s70-nosrc-23 figure 1, h=108, flat=0.40, score=0.20
- #128: hadrik-wide-s70-nosrc-37 figure 1, h=114, flat=0.71, score=0.36
- #129: hadrik-wide-s70-src-11 figure 1, h=111, flat=0.44, score=0.22
- #130: hadrik-wide-s70-src-23 figure 1, h=108, flat=0.40, score=0.20
- #131: hadrik-wide-s70-src-37 figure 1, h=115, flat=0.71, score=0.35
- #132: hadrik-wide-s85-nosrc-11 figure 1, h=110, flat=0.37, score=0.18
- #133: hadrik-wide-s85-nosrc-23 figure 1, h=106, flat=0.44, score=0.22
- #134: hadrik-wide-s85-nosrc-37 figure 1, h=112, flat=0.79, score=0.40
- #135: hadrik-wide-s85-src-11 figure 1, h=110, flat=0.41, score=0.20
- #136: hadrik-wide-s85-src-23 figure 1, h=105, flat=0.50, score=0.25
- #137: hadrik-wide-s85-src-37 figure 1, h=113, flat=0.72, score=0.36

