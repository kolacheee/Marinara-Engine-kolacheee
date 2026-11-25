# Round 5 — incomplete: no generation passed

**No production sprite was accepted. The requested deliverables are not
complete.** Thirteen generations were produced and measured: seven Wren
attempts and six Hadrik attempts. Every one failed the required clean-grid
extraction method. `best-raw/` is intentionally empty.

## What was attempted

The built-in image-generation tool generated each character separately with
front, profile, rear and walk poses. Prompts specified the original costumes,
adult proportions, dark coloured outlines, hue-shifted flat clusters, limited
palettes, hard pixels, and solid backgrounds. Variations tested explicit
4px/8px/12px grids, pixel-editor nearest-neighbour export language, 16- and
24-colour limits, reduced detail, grey versus magenta backgrounds, and tiny
native-size layouts. Tiny-layout attempts also tried a smaller requested size
to compensate for the tool repeatedly returning oversized figures; those
outputs still failed. Exact prompts are in `../scratch/prompts/`.

Python/Pillow reads source RGB values and locates foreground. A Node.js
measurement script searches plausible integer cell sizes and all their x/y
offsets. It measures channel variance and mixed-cell counts on foreground
cells, including silhouette edges. It never normalizes source colours or
counts blank background towards the cleanliness percentage.

The operational near-flat tolerance was a maximum within-cell channel range
of 3/255. The gate required at least 99% near-flat foreground cells, mean
within-cell channel variance at most 1, and native height 50–64 cells.
These numerical tolerances are our interpretation of “nearly every cell a
single colour”; the brief does not supply numerical tolerances. Exact-flat
percentages are reported separately: near-flat is not claimed to be exactly
lossless.

The best diagnostic result had only **13.527% near-flat foreground cells**,
with 5,600 of 6,476 cells mixed and mean variance 1,501.92. That candidate also
implied height 65.89, outside the allowed height. The highest near-flat score
whose implied height was within 50–64 was only 5.353%. Every attempt's best
candidate had **0% exactly flat foreground cells**. These are substantial
failures, not borderline threshold decisions.

Full scores, offsets, variance values, visual observations and reproduction
commands: [attempts.md](../scratch/attempts.md). Unmodified source images and
top-ten candidate measurements are preserved in `../scratch/raw/`.

## Verification

The checker passed a known exact-grid calibration: 4px cells at offset (2,3),
height 56, 100% exact-flat cells, zero variance. Centre sampling and integer
replication reproduced the source RGB bytes exactly. A second fixture with a
24-level deviation inside every cell was correctly rejected. These fixtures
are rectangular checkerboards, not hand-drawn character art. Results are in
`../scratch/checker-validation/report.json`.

No generated character was downscaled, resampled into a sprite, quantized,
repainted, or redrawn. No earlier-round artwork, other lane, or downloaded
game asset was used. The sole diagnostic enlargement is an unchanged crop of
attempt 11 enlarged by exactly 4x nearest-neighbour, saved outside `out/`.

## Honest visual judgement

**No: these do not pass as polished commercial HD-2D sprites at 4x.** Some
large raw designs have appealing costume details, but their apparent pixels
have uneven dimensions and internal colour variation. They are pixel-styled
illustrations rather than clean sprite grids. The small Hadrik diagnostic at
4x is plainly ugly for this target: blurry, noisy, and lacking deliberate
clusters. Wren often reads too young; some Hadrik attempts have skin lighter
than specified. Several views alter equipment or pose orientation.

Thirteen iterations did not resolve this generator-output limitation. There
is no evidence here that centre sampling would be lossless. Converting these
rejected sources would require the very resampling or shape reconstruction
that BRIEF.md prohibits. No such conversion was performed, and no output is
being presented as compliant.

## Missing deliverables

| Requested output | Status |
|---|---|
| `sheet-wren.png`, `sheet-hadrik.png` | Not produced; all 24 slots per character are missing. |
| `idle-wren.png`, `idle-hadrik.png` | Not produced; all four idle frames per character are missing. |
| `lineup.png`, 1x and 4x versions | Not produced; no accepted standing views. |
| `in-world.png` at exact 2x | Not produced; no accepted sprites to composite. |
| `in-world-close.png` at exact 4x | Not produced; no accepted sprites to composite. |
| `walk.gif`, `idle.gif` | Not produced; no accepted animation frames. |
| `best-raw/` | Empty; no accepted generation. |

No blank images or unmodified world screenshots were exported under final
deliverable names. The requested full-size in-world-close review therefore
could not be performed. World inputs remain unchanged. No frame widening,
mirroring, or animation-frame repetition was applied.

Completion still requires a raw generation that actually passes the grid and
visual checks, followed by permitted extraction, consistent frame selection,
sheet assembly, exact integer-scale previews, and animation review. This run
has not demonstrated that the available generator can produce that source.
