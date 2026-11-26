# Style-transfer test notes

## Verdict

**Moderately successful transfer: recognisably compatible, but not a seamless match.** The four sprites share the sheet's earthy material colours, compact adult silhouettes, upper-left lighting and crisp binary-alpha presentation. Both requested characters and their equipment read at native size. The new sprites nevertheless look softer, cleaner and somewhat more cartoon-like than Wren, Hadrik and Noble. Passing the technical checks does not mean every artistic rule was matched exactly.

The innkeeper transfers most convincingly through his stout silhouette, bald crown, brown moustache, green waistcoat, cream shirt/apron and wooden mug. The elder's age, low bun, shawl, dress and walking stick are recognisable. The corrected side views have roughly 26–27-pixel crown-to-chin spans by visual inspection, close to the nominal 3.5-head target; structural anatomy underneath hair remains an estimate, not an automated measurement.

## Remaining differences

- The references have stronger, more consistently deliberate dark contours and more intricate clustered modelling. Our contours sometimes blend into material shadows enough to make the silhouettes look softer, despite having no partial alpha.
- The new cloth has broader, flatter patches, especially the elder's skirt. Sparse source dithering largely coalesced during reduction. It is less texturally rich than the reference figures; no procedural texture was added.
- The innkeeper's face and hands lean toward rounded cartoon forms. His mug-gripping hand is chunkier than the specified 3–5-pixel mitten ideal. Tiny eye/brow marks are not uniformly limited to the ideal one-eye-pixel plus one-brow-pixel arrangement.
- The elder's hair reads as aged silver/ivory rather than neutral white. It retains a slight greenish cast under the permitted palette. Her front wrinkles lose some definition at native size, though the side nose and jaw communicate age well.
- Front/side identities and the anatomical right-hand props are consistent. Minor garment details drift: the innkeeper's front apron ties are more elaborate, and the elder's front shawl folds are an interpretation of the side. These are not perfectly construction-matched turnarounds.

I would accept these as a useful style-transfer trial and compatible draft NPCs, but would not call them indistinguishable additions to the reference sheet.

## Generation and revisions

The only external visual/style inputs used were this folder's `STYLE-SHEET.png` and `STYLE.md`. The provided `ref-sprites/` images were used for the required comparison assembly. No outside reference image, palette file or external build script was opened. Each figure and every anatomical correction was drawn by the image tool; no figure was drawn or repaired in Python.

Ten original image-tool PNGs are retained in `test-big/`, including rejected and superseded attempts. The final sources are:

| Output | Selected original | Front identity reference |
|---|---|---|
| `test-innkeeper-side.png` | `innkeeper-side-v2.png` | — |
| `test-innkeeper-front.png` | `innkeeper-front-v2.png` | `innkeeper-side-v2.png` |
| `test-elder-side.png` | `elder-side-v4.png` | — |
| `test-elder-front.png` | `elder-front-v2.png` | `elder-side-v4.png` |

Each side was inspected after reduction before its corresponding front was generated. The first elder side had overly yellow-green hair. A combined colour/proportion redraw over-enlarged the head and was rejected; a narrower hair correction restored the original scale. The first comparison strip then revealed undersized heads in both characters. Controlled side redraws brought the head spans closer to the target, and both fronts were regenerated from those exact corrected sides.

Large originals, all final 4× nearest-neighbour reviews, the 3× comparison strip and the native-size contact sheet were visually inspected. Reviews are retained in `review/`.

## Reduction and palette choices

`build.py` implements the documented magenta thresholds, alpha-bounds crop, proportional width calculation, single LANCZOS reduction to 92 pixels high, alpha threshold 144, weighted nearest-palette snapping, recrop, integer horizontal centring and placement at baseline 124. It does not reshape anatomy, move body parts, paint corrections or add dithering.

The folder did not contain `palette.json`; fixed new-character subsets were transcribed from the hex ramps in `STYLE.md`, preserving their order. The innkeeper uses Contour, Moss, Leather/wood, Warm skin and Linen (21 permitted colours). The elder adds Iron for silver hair (25 permitted colours). See `test-palettes.json`.

**Explicit adaptation:** the exact Wren olive-cloth classification rule was reused for both new green-clothed characters, with the same rows 30–91 head exclusion and all the same RGB thresholds. Without it, olive waistcoat and dress pixels snapped to leather brown. This is a material-palette classification adaptation for the new characters, not a literal claim that the document names them. There are no hand-painted masks or spatial repairs.

## Verified results

| Sprite | Frame | Visible height | Top / baseline | Used colours |
|---|---|---|---|---|
| Innkeeper front | 96×128 | 92 | 33 / 124 | 17 |
| Innkeeper side | 96×128 | 92 | 33 / 124 | 18 |
| Elder front | 96×128 | 92 | 33 / 124 | 25 |
| Elder side | 96×128 | 92 | 33 / 124 | 24 |

All four have alpha exactly `{0,255}`, transparent pixels exactly `(0,0,0,0)`, three empty rows below the baseline and colours exclusively within their fixed subsets. Visible widths are 56, 43, 42 and 38 pixels respectively, safely below the 90-pixel rejection limit. Colour unions across each character's two requested views are **19 for the innkeeper** and **25 for the elder**, both below 32. There are no back or walk frames in this test.

`test-strip.png` is 2880×420, with ten labelled panels in one row: Wren front/side, Hadrik front/side, Noble front/side, innkeeper front/side, elder front/side. Every frame is enlarged exactly 3× with nearest-neighbour sampling on the sheet's sampled page background, RGB `(226,222,211)` / `#E2DED3`. Pixel comparisons verified that all ten panels are exact composites of their source frames. The six supplied reference sprites were not edited.

Checks and source selections are recorded in `test-checks.json`, `review/*-checks.json` and `test-manifest.json`. To reproduce the final outputs from this folder:

```sh
python out/build.py innkeeper-side out/test-big/innkeeper-side-v2.png
python out/build.py innkeeper-front out/test-big/innkeeper-front-v2.png
python out/build.py elder-side out/test-big/elder-side-v4.png
python out/build.py elder-front out/test-big/elder-front-v2.png
```
