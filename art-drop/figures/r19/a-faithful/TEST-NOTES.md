# Style-transfer test verdict

**Partial success: convincing family resemblance, but not an exact style match.** The four new sprites belong plausibly beside the reference cast in scale, earthy colour, warm contour and compact adult silhouette. I would accept them as a style-transfer study; I would not call them a fully matched production set without another art-direction pass on facial contrast and cluster consistency.

The strongest match is the innkeeper's side silhouette: bald crown, moustache, broad torso, short sturdy legs and visible tankard all survive at native size. The elder's bun, shawl, long green dress and stick also remain legible. The new sprites preserve broad cloth planes and avoid introducing ornamental clutter. Their colours come entirely from the ramps in STYLE.md.

The main differences are visible in `test-strip.png`. The newcomers have more pale surface area and generally softer internal contrast than Wren and Hadrik. Some reduced edges and folds contain small intermediate-colour fragments rather than consistently deliberate clusters. The front innkeeper is cleaner and flatter than his side view, whose sleeve and apron have more shading fragments. The elder's face is readable after revision, but still more schematic than her profile. Her warm ivory hair can read as cream or pale blond rather than neutral white; the prescribed palette has no neutral white. The innkeeper's skin reads warm tan more strongly than ruddy red. These are limitations, not claims of a perfect transfer.

## Inspection and redraws

I inspected the image-tool outputs, the reduced figures at native 96×128 size, both character pairs at exact 3×, and the comparison strip, including reference pairs at full display size. No new character pixels were drawn by Python or manually painted.

- The first side strip established both designs. Its innkeeper had a bulky rear hair mass and a mug whose handle disappeared into the hand/body. I rejected that innkeeper and generated a revised side with a clear bald scalp and exposed mug loop. The first elder side was retained.
- Fronts were generated only after those side masters, using the approved sides as design references.
- The first fronts obscured the mug handle again and gave the elder a heavy mouth and doll-like eyes. A second image-tool pass exposed the tankard and softened her face.
- That second elder front lost eye contrast during reduction. A third image-tool front pass enlarged the dark cores enough to survive reduction. This is the delivered elder front; the prior versions remain in the originals directory.

The head units are visually close to the specified 28 pixels, with roughly 1–2 pixels of uncertainty from chin shading and the elder's bun. This is an artistic estimate, not an automated anatomical measurement. Similarly, the one-pixel contour target and material-cluster rules are approximated visually rather than certified pixel by pixel; thicker dark joins and some soft-looking internal fragments remain.

## Delivered files and checks

| Sprite | Frame | Occupied rows | Opaque colours |
| --- | --- | --- | --- |
| `test-innkeeper-front.png` | 96×128 | 33–124 | 16 |
| `test-innkeeper-side.png` | 96×128 | 33–124 | 16 |
| `test-elder-front.png` | 96×128 | 33–124 | 17 |
| `test-elder-side.png` | 96×128 | 33–124 | 16 |

Both character palettes allow 18 colours: outline, leather/wood, moss, fair-skin and linen ramps in STYLE.md order. The actual union is **16 colours for the innkeeper** and **17 for the elder**, below the 32-colour limit. All opaque colours belong to those subsets. Alpha is strictly 0 or 255, transparent RGB is zero, every figure has clear side margins, and soles reach row 124 with three clear rows below. The complete bounding box is centered; the extended front mug consequently shifts the innkeeper's body to the right within its frame.

`test-strip.png` is **2880×420**, with ten 288×384 sprite displays below labels. It contains Wren front/side, Hadrik front/side, Noble front/side, then innkeeper front/side and elder front/side. All six reference sprites are the original files from `ref-sprites/`. The background is the sheet's page colour, **#F0ECE2**. Pixel comparisons verified that every display is the exact 3× nearest-neighbour composite of its source PNG.

## Sources and reproducibility

| Delivered view | Untouched image-tool original in `test-big/` | Column / count |
| --- | --- | --- |
| Innkeeper side | `innkeeper-side-v2.png` | 0 / 1 |
| Innkeeper front | `fronts-v2.png` | 0 / 2 |
| Elder side | `side-masters-v1.png` | 1 / 2 |
| Elder front | `elder-front-v3.png` | 0 / 1 |

`test-big/` retains all five returned originals, including `fronts-v1.png` and rejected columns in other originals. They were saved unmodified from the returned image bytes. The only external-to-this-test artistic references were the supplied STYLE-SHEET.png and STYLE.md; subsequent references were this test's own generated sides and corrections. The provided `ref-sprites/` files were used for the required comparison assembly.

`work/` holds exact generation prompts, the fixed palette, source mapping, keyed intermediates, native/3× inspection images and machine-check reports. `work/build.py` implements the specified magenta predicate, exact bounding-box crop, proportional BOX reduction to height 92, alpha threshold at 128, squared-RGB nearest-palette mapping without dithering, and centered placement at y=33. The Wren-only olive exception is not applied to these new characters. No morphological outlines, sharpening, feature replacement or procedural figure drawing were used.

To regenerate the four final sprites and comparison strip from the preserved originals, run from this folder:

```sh
python -W ignore out/work/build.py
```
