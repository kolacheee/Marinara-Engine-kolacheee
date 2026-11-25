# Round-5 generation attempts

Every raw image is preserved in `raw/`; exact prompts are in `prompts/`.
No rejected image has been centre-sampled into sprites, downscaled,
palette-quantized, or redrawn. The attempt-11 diagnostic is only an unmodified
source crop enlarged by exactly 4x nearest-neighbour for inspection.

## Measurement

Search integer cell sizes whose foreground extent yields 48–66 cells (an
exploratory margin around the allowed 50–64), and every x/y grid phase.
If no integer cell size fits that range, report the nearest >=2px cell size
as a diagnostic only; the native-height gate still applies.
Score cells touching the foreground, including outline boundary cells. Ignore
magenta background variation only for locating the foreground; for neutral
backgrounds, use a 40-level maximum RGB distance from the dominant edge colour
to find foreground. Measure the unmodified RGB values inside every scored
cell. The dominant edge colour is
recorded but not used to normalize any colour values.

Exact-flat means all pixels within a cell have identical RGB values. Near-flat
allows a maximum channel range of 3/255. Mixed cells exceed that tolerance.
Variance is the mean of the three population channel variances, in squared
8-bit RGB units, averaged across foreground cells. Acceptance requires >=99%
near-flat foreground cells, mean variance <=1, and height 50–64 cells. This
threshold operationalizes “nearly every cell a single colour”; it is not a
threshold supplied numerically by the brief. Exact-flat is recorded separately
so near-flat does not get misrepresented as mathematically lossless.

The best grid maximizes near-flat cells, with variance as tiebreaker. Blank
background is excluded from the denominator so it cannot inflate cleanliness.
A 1px lattice is not used to falsely accept an oversized painted sprite.

| Attempt | Character | Raw size | Best cell / offset | Height in cells | Exact-flat | Near-flat | Mixed / foreground cells | Mean variance | Decision |
|---|---|---|---|---|---|---|---|---|---|
| 01 | wren | 1536×1024 | 6 / (4, 0) | 61.17 | 0.000% | 1.275% | 9676/9801 | 1381.07 | REJECT |
| 02 | wren | 1254×1254 | 3 / (1, 1) | 52.33 | 0.000% | 0.164% | 4266/4273 | 933.98 | REJECT |
| 03 | hadrik | 1536×1024 | 12 / (5, 3) | 62.92 | 0.000% | 2.221% | 4931/5043 | 1616.33 | REJECT |
| 04 | wren | 2172×724 | 11 / (8, 8) | 65.36 | 0.000% | 3.271% | 6150/6358 | 1512.50 | REJECT |
| 05 | hadrik | 1536×1024 | 9 / (6, 8) | 65.89 | 0.000% | 13.527% | 5600/6476 | 1501.92 | REJECT |
| 06 | wren | 1536×1024 | 9 / (3, 4) | 63.11 | 0.000% | 5.353% | 5852/6183 | 1626.46 | REJECT |
| 07 | hadrik | 1536×1024 | 2 / (0, 1) | 45.00 | 0.000% | 0.250% | 3594/3603 | 745.17 | REJECT |
| 08 | wren | 1536×1024 | 13 / (0, 8) | 63.23 | 0.000% | 2.804% | 4159/4279 | 1987.56 | REJECT |
| 09 | hadrik | 1536×1024 | 12 / (6, 1) | 63.25 | 0.000% | 5.177% | 4945/5215 | 1775.07 | REJECT |
| 10 | wren | 1536×1024 | 2 / (0, 0) | 50.50 | 0.000% | 0.500% | 4378/4400 | 725.80 | REJECT |
| 11 | hadrik | 1536×1024 | 2 / (1, 1) | 33.50 | 0.000% | 0.627% | 1901/1913 | 828.62 | REJECT |
| 12 | wren | 1536×1024 | 10 / (2, 8) | 65.90 | 0.000% | 2.178% | 5254/5371 | 1499.15 | REJECT |
| 13 | hadrik | 1536×1024 | 11 / (1, 6) | 62.09 | 0.000% | 0.898% | 4745/4788 | 1696.50 | REJECT |

## Visual observations

- **01:** Eight poses, explicit 4x grid. Visually appealing costume but soft block interiors and irregular outlines; Wren reads too young.
- **02:** Four tiny native-size poses requested. Returned sprites are about 157px tall, with painted subpixel detail, not 56px native sprites.
- **03:** Hadrik, explicit 8x grid and 24 colours. Broad block shapes, but textured interiors, uneven grid, skin lighter than requested.
- **04:** Wren, 3:1 strip and 8x indexed-style request. Returned size differs; hair clipped at upper edge, textured blocks, youthful face.
- **05:** Hadrik, simplified 16-colour request. Better dark skin and black hair but stiff/blocky design, residual interior gradients, and wrong profile facing direction.
- **06:** Wren, reduced detail and explicit mature face. Face reads older, but stiff angular styling and textured/uneven blocks still fail.
- **07:** Hadrik, tiny native-size layout with explicit coordinates. Tiny but still enlarged beyond the 50–64px allowance, antialiased, painted detail; not clean native sprites.
- **08:** Wren, grey background and explicit 12px lattice/coordinates. Adult read improved; nonuniform pixels and excessive fine detail persist.
- **09:** Hadrik, grey background and explicit 12px lattice/coordinates. Black hair reads well, but cells remain mixed and skin is not as dark as specified.
- **10:** Wren, requested 32px native layout to compensate for repeated oversizing. Returned height 101px, blurred miniature illustration; fails grid.
- **11:** Hadrik, requested 32px native layout. Returned height 67px; exact 4x diagnostic shows ugly blurry noisy miniature, not premium pixel art.
- **12:** Wren, final stricter flat-tile and 24-colour request. Appealing costume but young face, variable blocks and internal texture persist.
- **13:** Hadrik, final stricter flat-tile and 24-colour request. Costume readable but variable blocks, textured cell interiors, and skin still too light.

## Checker validation

`python scratch/validate_checker.py` passes. A synthetic rectangular
checkerboard (not character art) is detected at its known 4px cell size and
(2,3) offset, with 100% exact-flat foreground, zero variance, and height 56.
Centre sampling and integer replication reconstruct its RGB bytes exactly.
Adding a 24-level deviation to one pixel in each cell causes rejection.
The fixtures and machine-readable results are in `checker-validation/`.

## Reproduction

From the workspace root:

```sh
python scratch/analyze_grid.py scratch/raw/attempt-*.png
python scratch/validate_checker.py
python scratch/update_log.py
```

Requires Python with Pillow and Node.js. JSON reports alongside each raw
image retain the top ten cell-size/offset candidates. Later attempts also
report relaxed 8/16/32-level cell-range percentages as diagnostics; those
looser tolerances do not alter acceptance. Raw sources are unchanged copies
of the built-in image-generation tool output; no CLI/API fallback was used.
