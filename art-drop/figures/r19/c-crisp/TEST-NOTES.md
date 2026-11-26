# Crisp Classic — transfer test verdict

**Verdict: a good visual approximation, but only a partial pass against the strict drawing rules.** The four sprites sit reasonably comfortably beside the reference six at 3x. Palette, overall scale, costume readability and broad material planes transferred well. Contour discipline and some facial/proportion details did not transfer exactly. I would not describe these as indistinguishable from the reference or as fully production-clean examples of every rule in STYLE.md.

## Delivered and checked

- `test-innkeeper-front.png`, `test-innkeeper-side.png`, `test-elder-front.png`, `test-elder-side.png`: RGBA, 96 × 128, exactly 92 occupied rows, y=33–124. Rows 125–127 are empty.
- Alpha is exclusively 0/255; transparent RGB is zero. Every visible colour belongs to the 30-colour table in STYLE.md. Innkeeper uses 21 colours across both views; elder uses 12.
- Each sprite is one four-connected opaque component, with no detached background debris. Front views are silhouette-centred. Side head axes, measured over the upper 31 rows, are x=47.5 for the innkeeper and x=48 for the elder; the half-pixel difference follows integer placement of an even-width head.
- `test-strip.png` is one labelled row, 3120 × 456, with all ten full frames at exactly 3x nearest-neighbour. Order: Wren front/side, Hadrik front/side, Noble front/side, innkeeper front/side, elder front/side. Its background is the sheet's dominant background, RGB (229, 226, 218), `#E5E2DA`. All ten image cells were compared byte-for-byte with independent 3x composites of their input frames.
- `test-big/` retains all eight unmodified image-tool originals, including rejected versions. Prompts, reference relationships, selected versions, processing code and check results are in `work/`.

## Visual assessment

The innkeeper reads immediately as bald, moustached and stout; the green waistcoat, cream shirt/apron and mug survive at 1x. His front and side preserve the same clothing and identity. The elder's bun, shawl, green dress and cane also survive, and her dress's large connected planes fit the Noble's simpler treatment particularly well. The revised lighting is broadly upper viewer-left.

The innkeeper's crown-to-chin is approximately 33 pixels, slightly larger than the 30–31 target. His side scalp has a large dark rear plane, so facial lighting is less consistent than the clothing. Some outlines and seams widen to roughly two pixels, especially around facial features, grips and tight clothing overlaps. A few small shading fragments remain around the waistcoat and elder's hem. The elder's front eyes are still larger/simpler than the ideal single-pixel eyes, and her front face reads more schematic than her profile. Her hair reads ivory rather than neutral white because it uses the prescribed cream ramp. Hand/prop silhouettes are readable, but not uniformly the ideal 3 × 5 mitten. Exact palette membership alone does not prove perfect material assignment or perfect three-plane shading.

## Redraws and inspection

Both first side drawings were rejected for a dangling near arm while the other hand carried the prop, plus illumination biased toward viewer-right. Both were redrawn. The elder side was redrawn a second time to reduce an oversized head and improve the overlapping-foot profile. Only after selecting those side drawings were the corresponding fronts generated from them. The first elder front was rejected for an invented belt and missing mouth; its replacement removes the belt and restores a visible mouth and more explicit age creases.

I inspected the returned large drawings, the final 96 × 128 images at native size, each final sprite at 6x nearest-neighbour, and the comparison strip at 3x in full-resolution sections as well as the complete row. Shape corrections came from new image-tool drawings, not painted Python replacements.

## Processing fidelity and limits

Only the local style sheet and STYLE.md supplied the style references. The six provided reference sprites were used unchanged for comparison. No outside reference files were opened. Returned image bytes were saved directly into this folder.

The `palette.json`, historical `PROTOS` table and processing scripts mentioned in STYLE.md are absent from this folder. I therefore transcribed its palette table and reconstructed the documented processing pipeline, with explicit source-colour prototypes and material restrictions for these new characters. This is not a claim of reproducing the missing historical script exactly. Palette restrictions were refined to keep skin, cream fabric, green cloth and iron from contaminating each other.

Processing uses the exact documented magenta predicate, bounding-box crop, one nearest-neighbour reduction to height 92 with preserved aspect ratio, repeated key classification, palette assignment, and row-major seeded four-neighbour dark-ink material propagation (up, left, right, down). It does not dilate, erode, paint anatomy, move props or replace silhouettes. The originals returned at 1145 × 1373 for the innkeeper and 1054 × 1492 for the elder, rather than the historical 1254-square format; the crop/reduction procedure accommodates that difference.

Rebuild the accepted outputs and comparison images from this folder with `python out/work/process.py`. Mechanical checks pass. Strict one-pixel contours, ideal cluster sizes and perfectly stable facial proportions remain the main reasons for the partial-pass verdict.
