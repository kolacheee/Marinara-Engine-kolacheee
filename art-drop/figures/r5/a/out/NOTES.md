# Round 5 — unsuccessful generation run

The requested sprite delivery is **incomplete**. Eight raw candidates were generated (four per character), measured and rejected. No candidate passed the mandatory flat-grid gate, so no sprite has been accepted or sampled.

## Quality judgement

Would these pass as premium commercial HD-2D sprites at 4×? **No.** As pixel-art assets they are ugly: soft internal colour variation, irregular apparent pixel sizes, and noisy detail would survive a forced reduction. Some costume silhouettes are promising, but that does not make them clean sprites. Wren's earlier faces also skew younger than the requested woman in her thirties; the final Wren variant loses the intended compact adult proportions. Hadrik's skin, beard and apron read more clearly in several candidates, but his cluster quality and pose consistency still fail.

I continued through eight attempts with different grid, size, palette and flat-fill instructions. None demonstrated the required capability. This run therefore ends with a documented generation failure, not a finished art set. The brief has not been relaxed to manufacture a pass.

## Method and tools

- Used the built-in image generation tool. Exact prompts are saved as `scratch/wren01-prompt.txt` through `wren04-prompt.txt` and `scratch/hadrik01-prompt.txt` through `hadrik04-prompt.txt`.
- Every unmodified raw PNG is retained in `scratch/raw/`. No earlier-round art, other lane, downloaded asset or existing game sprite was used.
- Prompt variants requested an exact enlarged raster, smaller sprites with empty margins, actual native-size output, explicitly enumerated palettes, and uniform pixel-pencil/flood-fill regions. The requested output dimensions were not reliably respected.
- Python/Pillow reads the raw PNG RGB bytes. `scratch/grid_audit.mjs` searches every integer square cell size consistent with a 50–64-pixel figure envelope, and every integer x/y grid offset. A low score is not treated as evidence that a true grid exists; reported parameters are only the best fitting candidates.
- Foreground cells include any source pixel outside the magenta-background band (R >= 220, G <= 60, B >= 220). Background-only cells do not contribute to the score. Variance is the average of the three per-channel population variances inside each cell. A mixed cell has a maximum channel range greater than 3 RGB levels.
- The acceptance gate, fixed before measurement, requires at least 99% nearly flat foreground cells (range <= 3) and at least 95% exactly flat cells. This is only a preliminary gate; true lossless centre sampling would additionally require verifying reconstruction, rather than claiming that near-flat cells are lossless.
- `scratch/check_audit.py` verifies a known 4-pixel square-grid diagnostic pattern at 100% flat and rejects the same pattern with internal colour variation at 100% mixed. These are test swatches, not character art.
- No raw candidate was downscaled, resampled, palette-quantized, background-removed, centre-sampled, redrawn or shape-repaired. The sole diagnostic preview, `scratch/wren-01-detail-4x.png`, is a raw 100×100-pixel crop enlarged to 400×400 using exact nearest-neighbour replication. It is not a sprite.

## Measurements

See `scratch/attempts.md` for all eight scores and `scratch/reports/*.json` for the complete top candidate parameters. Exactly flat foreground cells scored 0% in every candidate's best fit. Mixed cells ranged from 85.840% to 99.137%; the allowed maximum was 1%. These are not borderline failures.

## Missing deliverables

| Requested item | Status |
|---|---|
| `sheet-wren.png`, `sheet-hadrik.png` | Not produced: all 24 slots per character lack an accepted source frame. |
| `idle-wren.png`, `idle-hadrik.png` | Not produced: all four idle slots per character are missing. |
| `lineup.png`, 1× and 4× views | Not produced: no accepted front or left standing sprites. |
| `walk.gif` | Not produced: no accepted consistent walk exists. |
| `idle.gif` | Not produced: no accepted idle exists. |
| `in-world.png` | Not produced: no accepted sprites to place at exact 2×. |
| `in-world-close.png` | Not produced: no accepted sprites to place at exact 4×. |
| `best-raw/` | Empty: no accepted generation. Rejected sources remain in scratch. |

No frame widening or mirroring was performed. No missing animation was faked by repeating a still. The supplied world images were left unchanged. The required final full-size in-world inspection could not be performed because the prerequisite accepted sprites do not exist.

## Reproduce the audit

Run from this folder's root:

```sh
python scratch/check_audit.py
python scratch/grid_audit.py scratch/raw/*.png
python scratch/summarize.py
```

The remaining blocker is obtaining genuinely flat, regularly gridded generated sources. Once sources pass, frame extraction, palette consolidation, binary alpha, exact integer-scale composites and animation inspection still remain to be completed.
