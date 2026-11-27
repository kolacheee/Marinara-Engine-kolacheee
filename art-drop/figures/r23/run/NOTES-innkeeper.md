# Tamra Esh — face and finish revision

## Replaced deliverables

All fifteen views have newly drawn heads. The standing front, side and back, plus four frames for each walking direction, are in `sprites/` as 96 × 128 RGBA PNGs. `big/` contains the fifteen final, unmodified full-body image-tool outputs on magenta.

Rebuilt `innkeeper-sheet.png`, all three walking GIFs, `innkeeper-face.png`, and `innkeeper-vs-sheet.png`. Added `innkeeper-heads-vs-sheet.png`: every head at exactly 6× beside Wren, Hadrik and the noble, using source rows 33–63 inclusive. The full-body comparison remains 3×, ordered Tamra / Wren / Hadrik / noble.

## References and design

Read STYLE-RULES.md through its final Face and finish rules and CHARACTER.md through its Round 23 additions. The newer facial rules override the earlier dot-eye/no-glint instructions. There is no upper-lip shadow or moustache.

Every image request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. The only other image inputs were the existing Tamra views and newly edited Tamra views in this folder. The sheet's characters were not used as identity references.

Tamra retains her tan skin, rectangular jaw, charcoal temple locks, squared linen headwrap, thick-set body, layered linen bodice and culottes, moss edging, charcoal belt, broad cuffs, leather boots and anatomical-right-hand folio. No new costume or prop was introduced.

The standing side was edited first. There were 18 built-in image-tool requests for this revision: fifteen initial head edits and three further face corrections. Exact prompts are saved in `../scratch/face-redo/prompts.json`.

## Preservation and reduction

The large outputs preserve the original body, costume and pose visually, but image editing can slightly resample or alter details outside the head. To prevent those incidental changes from reaching the animation sprites, each final sprite uses its existing body from row 56 downward. Its newly generated head occupies rows 33–55. Head reduction uses the original silhouette width and placement, with magenta keying, BOX area reduction and binary alpha.

Below row 56, all clothing, equipment, pose and alpha pixels are unchanged. The only changes there are 69 isolated skin pixels corrected by the requested despeckle. This is checked in `../scratch/face-redo/audit.json`.

Skin is snapped only to the tan ramp. Facial planes use shadow/body/light; the existing body retains the four-tone skin ramp, including contour. Hair is charcoal and the wrap is linen. Source dark facial pigment and pale eye catches have separate area-coverage masks, preserving the features actually drawn by the image tool through reduction. No eyes, brows, noses or mouths were drawn or positioned with code.

After snapping, skin and hair receive one simultaneous despeckle pass: a pixel differing from all four direct neighbours is replaced with the unique most frequent colour in its same-material 3 × 3 neighbourhood. Ties retain the original pixel. Eye pigment, catches, brows, mouth marks, silhouette contours and edge colours are protected. The final pass replaced 126 skin pixels and 40 hair pixels across the set. Masks and per-view counts are saved in `../scratch/face-redo/`.

## Comparison and redraws

All fifteen final heads were inspected at 6× with the three reference faces beside each head, including the five rear heads. The rear views have wrap, hair and nape only. All ten face-bearing views retain light eye catches. The front face crop, the full sheet and the 3× full-body reference comparison were also inspected.

The first comparison exposed a material-snapping problem that put some wrap shadows into moss. The final reduction confines those shadows to linen. A catch mask was also refined so that tan nose highlights are not treated as eye catches.

Three heads received another image-tool edit after the first 6× review:

- `walkside2`: thinner brow with more skin between brow and eye; smaller catch and simpler cheek.
- `walkside3`: thinner brow, clearer eye separation and simpler facial planes.
- `walkfront1`: removed heavy frowning brows and patchy cheek/chin highlights; retained a quiet mouth and smooth tan planes.

The final heads are clearer and less noisy than the previous set. Their simple facial planes are comparable in readability to the supplied examples. This is a visual judgment, not a claim of an exact rendering match.

## Validation

Passed checks for fifteen new originals and fifteen new heads; 96 × 128 RGBA sprites; binary alpha; occupied rows 33–124; centered silhouettes; permitted palette membership; 24 colours across the complete set; unchanged body clothing/pose pixels; expected comparison dimensions; and three four-frame GIFs at 288 × 384, 160 ms per frame. GIF constituent frames were inspected through the sheet; live playback was not separately evaluated.

Reproduce the current sprite/export pipeline from this folder:

```sh
python scratch/face-redo/rebuild.py
python scratch/assemble.py
python scratch/face-redo/compare.py
python scratch/check.py
python scratch/face-redo/audit.py
```

`rebuild.py` uses the saved final redraws and archived body sprites. The older `scratch/process.py` is historical and should not be used to replace this revision's face processing.

## Remaining limitations

- Eye clusters, catch sizes, brow thickness and jaw width vary slightly between independent drawings. Some brows occupy more than one pixel at a step or corner; exact one-pixel thickness is not uniform. Catches occasionally span adjacent pixels rather than exactly one.
- The intended age of 56 is conveyed primarily by the jaw, brows and build; the smooth face treatment removes fine age cues. The expression varies mildly through the front cycle.
- The original body's broader linen planes, fold organisation and walk registration remain. This head-focused revision does not eliminate pre-existing clothing/folio jitter or perfect the gait.
- The raw large images are drawing sources, not palette-limited sprites. Only the final sprites enforce the 24-colour palette and binary transparency. The large images may contain incidental changes below the neck that the final sprites deliberately do not use.
- Material masks are practical colour-and-region segmentations rather than manually traced shapes. Their previews and the final comparisons are retained for review.

All artwork inputs, working files and delivered files were read or written inside this folder. The image tool also reports its automatic cache locations; generated image data was saved directly into this folder without opening those cache files. Prior originals, sprites and notes are preserved under `../scratch/face-redo/`.
