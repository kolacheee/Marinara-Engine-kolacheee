# Style transfer test — verdict

**Good visual transfer, with visible limitations; not an exact style clone or a fully literal replay of every processing step.** The two characters belong plausibly beside the reference set at 3×. Scale, supported adult stance, muted colors, garment weight and equipment continuity transferred well. The elder is the less exact match: her face is simpler and softer than the reference adults, her hair reads silver-gray rather than bright white, and her dress is medium moss more than very dark green.

## Delivered

- `test-innkeeper-front.png`, `test-innkeeper-side.png`
- `test-elder-front.png`, `test-elder-side.png`
- `test-big/`: four accepted image-tool originals plus the rejected `elder-side-v1.png`.
- `test-strip.png`: 2880 × 426, one row of Wren front/side, Hadrik front/side, Noble front/side, innkeeper front/side, elder front/side. All sprites are enlarged exactly 3× with NEAREST and labelled. Background is the sheet's outer page color, **#E8E5DE**. The six reference sprites are composited directly from `ref-sprites/` without alteration.
- `proof-*-6x.png` and `proof-strip-*.png`: inspection enlargements and full-resolution sections of the wide strip.

## What transferred

Both characters have approximately four-head adult proportions rather than doll construction. The innkeeper has a supported belly, broad shoulders, bald crown with a brown side fringe, thick moustache, green waistcoat, cream shirt/apron and a readable metal mug. The elder has a restrained stoop, a compact bun, tan facial planes, a heavy shawl and a long green dress. Both side views face right; both fronts face the viewer. Mug and stick stay in the right anatomical hand, appearing on the viewer's left in front view.

The large apron, shawl and skirt planes stay readable at native size. Upper-left lighting and mostly thin colored contours broadly match the sheet. The new figures have cleaner, flatter large planes than the slightly busier reference sprites, so they are compatible rather than indistinguishable.

## Weaknesses and revision

The first elder side produced distracting color breakup in the shawl. I regenerated it with simpler cloth and hair planes before drawing her front from the accepted side. The rejected original remains available for comparison. Five image-generation calls produced the four accepted views and that rejected side.

The innkeeper's mug handle is partly lost inside the closed grip at 96 × 128; the vessel itself remains readable. Some hand and eye marks exceed the strictest 3–5 px hand / 1 px eye targets. The elder's front wrinkles and bun are less explicit than in profile. Some contours and overlap masses are heavier than one pixel. The innkeeper's complexion reads warm tan more than distinctly ruddy. These are drawing limitations, not problems concealed with replacement pixels.

## Processing and deviations

Every figure was drawn with the built-in image tool. Each side was generated first; each front referenced its own accepted side original and STYLE-SHEET.png. The exact prompts are saved in `../scratch/test-prompts.json`.

`../scratch/build_test.py` performs magenta keying with STYLE.md's thresholds, tight alpha cropping, proportional 92-pixel height reduction with one NEAREST pass, source-to-moss anchoring, weighted nearest allowed-palette snapping, binary alpha and centered placement at y=33. Hadrik's deep-skin masks were not applied to these characters.

**Additional palette adaptation:** direct global snapping sent beige cloth into the skin ramp and created noisy boundary decisions. I added pose-specific linen material masks with color-only source anchors, and a silver-hair anchor pass for the elder. This extends the documented material-snap approach; these extra linen/hair passes are not literally specified in STYLE.md. The precise masks, anchor values and pixel counts are in the script and reduction manifest. They only select colors, never change alpha, add texture, draw an edge or synthesize anatomy. A few warm collar/strap colors remain. No pixel-brush repairs, replacement faces or procedural limbs were used.

## Inspection and checks

I inspected all four native 96 × 128 PNGs, every sprite enlarged to 6×, the complete comparison strip, and all five sections of that strip at their full pixel dimensions. The final collar palette adjustment was inspected again in the strip sections and native sprites.

| Sprite | Frame | Occupied rows | Colors |
| --- | --- | --- | --- |
| Innkeeper front | 96 × 128 RGBA | 33–124 | 27 |
| Innkeeper side | 96 × 128 RGBA | 33–124 | 24 |
| Elder front | 96 × 128 RGBA | 33–124 | 23 |
| Elder side | 96 × 128 RGBA | 33–124 | 24 |

The union is **27 colors for the innkeeper** and **24 for the elder**, both below 32. Alpha contains only 0/255, transparent RGB is zero, and no sprite contains pure black, pure white or the page background. Lowest shoe soles are on row 124, including both elder views independently of the stick. All silhouettes are centered including equipment.

`../scratch/check_test.py` passed. It independently re-keys and reduces each accepted original and verifies that its resulting alpha exactly equals the final sprite alpha. It also verifies dimensions, palette membership, empty margin rows, centering, character color unions, and every 3× strip composite including the six untouched references. Results: `../scratch/test-checks.json`. Reduction boxes and counts: `../scratch/test-reduction-manifest.json`.

Reproduce from this folder with `python scratch/build_test.py` followed by `python scratch/check_test.py`.

## Folder-boundary disclosure

The artwork/style references were only this folder's STYLE-SHEET.png and STYLE.md, plus the new side masters required for front-view continuity. However, the instruction to read nothing outside the folder was not met literally: a higher-priority runtime instruction required reading the installed imagegen SKILL.md outside it. No outside artwork or project files were used. The image tool also automatically cached generated images outside the folder; I saved the returned image bytes into `out/test-big/` without reading those cached files. All task scripts, processing outputs and deliverables were written inside this folder.
