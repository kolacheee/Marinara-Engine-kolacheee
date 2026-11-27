# Tamra Esh — Review redraw 2

## Design and delivered set

Read STYLE-RULES.md, including the final Face and finish rules, and CHARACTER.md through its final Review redraw 2. The last review takes precedence over the older no-apron/no-mug/folio design.

All fifteen views were redrawn with the built-in image tool. Tamra now wears a fitted moss vest with linen edging, the charcoal belt, a linen waist apron with a moss border, and a folded serving cloth over her anatomical left shoulder. Her anatomical right hand holds a small wooden tankard with steel bands, replacing the folio. The linen headwrap, charcoal temple locks, thick-set adult build, broad cuffs, straight mid-calf culottes and leather boots remain. No moustache or upper-lip shadow was added.

The standing side was revised first and supplied as the costume reference for the remaining initial views. Every image request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. Only `style-ref/` and this character's existing or newly generated images were used. The original poses were the targets; the clothing changes are the exceptions explicitly required by review 2.

Replaced the fifteen 96 × 128 transparent sprites in `sprites/`, fifteen full-body magenta originals in `big/`, the 3× sheet, three 160 ms walking GIFs, front face crop at 6×, and full-body vs-sheet comparison at 3×. `innkeeper-heads-vs-sheet.png` compares every head at 6× beside Wren, Hadrik and the noble, using rows 33–63 inclusive. The `big/` files are unmodified final image-tool outputs.

## Redraws after inspection

There were 24 successful image-tool outputs: fifteen initial view revisions and nine targeted corrections. Two initial front-walk requests failed before generation because a supporting reference was not yet available; both were retried successfully.

- `back`: moved the cloth to the correct shoulder, picture-left in the rear view.
- `front`: simplified patchy cheek/chin highlights and reduced the mouth to a closed line.
- `walkback1`, `walkback3`: restored the raised, tilted passing boot after the initial edit flattened it into a standing pose.
- `walkside1`, `walkside3`, `walkfront1`: simplified skin planes, reduced oversized eye catches and removed highlight islands.
- `walkside2`, `walkfront3`: final mouth/face clarity corrections after the all-head comparison.

Exact successful prompts are in `../scratch/review2/prompts.json`. Earlier originals, sprites and notes are retained under `../scratch/review2/original-big/`, `original-sprites/` and `previous-NOTES.md`. Rejected intermediate drawings are retained in the same working directory with descriptive suffixes.

## Reduction and cleanup

Magenta range key, full-figure crop, BOX area reduction to 92 occupied rows, centered placement in 96 × 128 RGBA, and binary alpha. The allowed families remain charcoal, linen, moss, leather, steel and tan; no ramp was added. Skin is restricted to the tan shadow/body/light colours. The exported set uses 23 colours total.

Skin, hair, headwrap, dark facial features and catches use source colour/region masks carried through area reduction. These masks preserve marks drawn by the image tool; no eyes, brows, nose or mouth were painted or placed with code. The colour segmentation was refined to keep charcoal locks out of linen, keep linen shadows out of moss, and separate warm facial pigment from skin planes.

After snapping, one simultaneous skin/hair-only despeckle pass replaces a pixel differing from all four direct neighbours with the unique most common same-mask colour in its 3 × 3 neighbourhood. Ties retain the source pixel. Eyes, catches, brows, mouth marks, material edge colours and silhouette contours are protected. The final pass changed 136 skin pixels and 42 hair pixels across all fifteen views. Masks and per-view replacement counts are in `../scratch/review2/cleanup-report.json` and the `*-masks.png` previews.

## Verification and visual review

All fifteen final heads were examined at exactly 6× beside all three reference heads. The five back views show wrap, locks and nape without facial features. The full-body 3× comparison and all walking frames were also inspected. The green torso, separate apron, shoulder cloth and tankard now give Tamra a readable occupational silhouette and layered finish alongside the sheet's figures. Facial planes are substantially cleaner than the first reductions.

Automated checks cover fifteen replaced originals and changed heads, exact identity between final tool sources and `big/`, sprite dimensions, binary alpha, centered silhouettes, crown row 33, lowest sole row 124, permitted palette, exact comparison scales, and three four-frame GIFs at 288 × 384 with 160 ms timing. See `../scratch/review2/audit.json` and `../scratch/checks.json`.

Rebuild from this folder:

```sh
python scratch/review2/process.py
python scratch/assemble.py
python scratch/review2/compare.py
python scratch/check.py
python scratch/review2/audit.py
```

Use this revision's processor, not the historical processors in `scratch/process.py` or `scratch/face-redo/`.

## Remaining limitations

- These are independent edited drawings, so head width, brow curvature, catch size, apron folds and tankard shape vary mildly between frames. Brow/contour thickness can reach two pixels at corners; it is not perfectly uniform.
- The smooth skin treatment conveys age mostly through the long jaw, nose, brows and body build. It deliberately omits fine wrinkle texture.
- The final poses retain the original walk pattern, with repaired rear passing boots, but exact body pixels were not preserved: full-view edits can subtly alter cuffs, hems and silhouette widths. Some animation registration and cloth/prop jitter remains.
- Material masks use colour and source regions rather than hand-traced boundaries. The source images are not palette-limited; the small exports are. The reference match is a visual craft judgment, not pixel-for-pixel equivalence.
- GIF frames and metadata were checked; live animated playback was not separately reviewed.

All artwork references and manually written working/delivery files stayed in this folder. Generated image bytes were saved directly here; the image service also maintains its own automatic cache.
