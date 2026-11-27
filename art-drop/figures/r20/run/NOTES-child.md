# Child — style D delivery notes

Delivered all 15 views: front, side, back; walkside0–3; walkfront0–3; walkback0–3. Each has a large drawing in `big/` and a transparent sprite in `sprites/`. The sheet uses standing front/side/back, then side, front and back walk rows. The comparison places the child beside the supplied Wren, Hadrik and Noble front/side sprites at the same 3× scale. Three looping GIFs use four frames each at 160 ms per frame.

## Verified specifications

- All 15 sprites are 96×128 RGBA, with binary alpha and zero RGB in transparent pixels.
- Every figure occupies exactly 70 rows: crown at 55, lowest support sole at 124. Silhouettes are centred horizontally to within one pixel.
- The shared palette contains 15 used colours from a 16-colour selection: auburn, fair_skin, navy and linen. This is below the 32-colour character-wide cap. No page-background colour is included in the sprites.
- The head is approximately 25 pixels crown-to-chin, close to the requested 2.8-head construction. The child is shorter than the supplied 92-pixel adults.
- Sheet, comparison and GIF sprites use exactly 3× NEAREST enlargement. Background is sampled from STYLE-SHEET.png: RGB (232, 229, 222).
- Decoded GIF frames match the corresponding enlarged PNG sprites pixel for pixel. All three contain four distinct frames, loop continuously and use 160 ms timing.

## Drawing and reduction

The right-facing side master was drawn first. Its first version was too tall in proportion; it was redrawn before producing the other views. Every other figure was freshly drawn with that corrected side master as a reference. Front/back standing drawings were additional identity references for their walking poses. No final pose was produced by mirroring, rearranging body parts or painting anatomy in Python.

After the first full-size sheet and style comparison, the front face was judged too blank and doll-like. The standing front and all four front walk drawings were redrawn with smaller eyes and a quiet mouth. Superseded originals and prompt records remain in `scratch/`.

Reduction uses the specified magenta threshold, tight alpha crop, aspect-preserving single NEAREST reduction to 70 pixels high, navy-only source-to-ramp snapping, then the specified weighted RGB nearest-palette mapping without dithering. These blue masters already use target navy anchors rather than the older Noble source anchors. No Hadrik-specific skin masks or unrelated character corrections were applied. No procedural face, limb, outline or costume repairs were added.

All generated originals were inspected when returned. All final sprites were inspected together at integer magnification. Both versions of the full sheet and style comparison were opened at their native output sizes; the final sheets are 1200×1740 and 1200×930. The GIFs were opened, and every decoded GIF frame was inspected in `scratch/gif-frames-proof.png`. This is frame inspection, not a claim of a fully polished in-game motion test.

## Honest remaining weaknesses

- The child remains rounder and softer-faced than the reference adults. The requested 2.8-head construction is met approximately, but the front still has a mild doll-like quality. It is not a perfect match to the references' facial modelling.
- Face shading is flatter and lighter than ideal. Freckles and the mouth are faint after reduction and are not equally legible in every frame. The profile eye can occupy two vertical pixels; the corrected front eyes are smaller.
- Source drawings contain mild colour variation inside nominally flat clusters. Palette snapping removes intermediate colours but leaves some irregular pixel clusters, especially in hair and along hems. Lit contours do not consistently step up exactly one material tone. Some overlaps and bare soles are heavier than a one-pixel outline.
- Independently drawn frames vary slightly in hair clusters, head width, pigtail placement, patch size/position and hem shape. Fixed height and centring do not eliminate this small amount of visual jitter. The figures are consistent in design, but they are not pixel-locked duplicates above the moving limbs.
- Side contacts read more clearly than the front/back contacts. The latter are shallow steps, with contact and passing differences carried mainly by foot height, knee bend and arm position. The side stride is somewhat broader than the quietest possible town walk. Anatomical near/far leg continuity is not perfectly unambiguous beneath the skirt.
- The four-frame loops have abrupt transitions and some foot sliding. No extra in-between poses or artificial interpolation were added. They should be treated as usable short walk studies rather than a fully polished animation set.
- The repaired dress has one clean rectangular patch. It lacks clearly resolved stitching at 70 pixels. The hem is brighter and more uniform than the reference guide's most restrained cloth treatment.

## Reproduction and scope

From this folder, run:

```sh
python scratch/build.py
python scratch/assemble_sheet.py
python scratch/check.py
```

Exact crop boxes and output widths are recorded in `scratch/reduction-manifest.json`. Validation results are in `scratch/check-report.json`; generation prompts are the `scratch/*-prompt.txt` files.

Only STYLE-SHEET.png, ref-sprites/ and this run's own child drawings were used as image references. No other artwork or repositories were inspected. One boundary exception should be explicit: the runtime-required image-generation skill instruction file was read outside this folder. The image service also automatically stores its originals in its own managed location; the task copies were saved from returned image bytes, without opening those outside image paths. All task scripts, prompts, intermediate copies and deliverables were written inside this folder.
