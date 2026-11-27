# Selection and review

Kept **attempt 3 of 3** as `raw.png`. Each attempt drew all five townsfolk together in a single image-tool call. The only attached image in every call was `../style-ref/STYLE-SHEET.png`, explicitly designated as a style-only reference. No earlier character designs were used.

Attempt 3 offers the best overall balance of readable faces and role props, simpler shading clusters, consistent body scale, and clear separation. It contains exactly five full-body, front-facing figures in the intended left-to-right order, with aligned soles, complete props, and ample magenta separation. Their identities and costumes differ from the sheet's characters. Attempt 1 was too finely illustrated and textured; attempt 2 made the blocks coarser but looked softer internally and made the crossbow less legible. The first two untouched outputs are retained in `../scratch/`.

## Honest weaknesses

- This remains an approximate pixel-art rendering, not a verified uniform logical pixel grid. Some edges and interior details use different apparent block sizes, with residual smoothing and texture. Approximately 90 art-pixels per adult cannot be certified from this output.
- Body proportions remain closer to five heads tall than the requested four. The figures share a convincing scale, but the exact proportion target was not achieved.
- The background looks magenta, but it is **not uniformly #FF00FF**. Read-only sampling found corner RGB values of (243, 12, 240), (246, 19, 241), (238, 35, 235), and (242, 31, 238). No keying or colour correction has been applied.
- Shading suggests upper-left light but is not limited to exactly four flat tones per material. The RGB raster contains 139,413 distinct colours, including smoothing and background variations. Contours can read nearly black instead of consistently coloured.
- Some design details drifted: the smith's apron is longer than specified and her build less broad; the cleric's sacred disc is larger and more elaborate than the small intended reliquary; the ranger's calf wraps and several garment folds have more detail than the quiet reference clusters. The cleric's age reads less strongly than intended.

All three authorized attempts were used. The selected image is the strongest available result, with the above constraints still imperfect.

## File integrity and prompts

`raw.png` is the original 1774 × 887 RGB PNG, copied byte-for-byte from attempt 3. Byte equality was checked against the tool's original file. No keying, resizing, cropping, palette work, re-encoding, or other image processing was performed.

SHA-256: `aa7041b3663e563665e2eb4ff14371d285c13ffc057bff561f78cb2485c64265`

The built-in image tool was used. `PROMPT.md` records the complete first prompt. Attempt 2 used that prompt followed by `REVISION-2.md`; attempt 3 used it followed by `REVISION-3.md`. `DESIGNS.md` contains the five fresh character designs written before generation.
