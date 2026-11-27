# Halet Sar — review redraw 2

Replaced all 15 drawings in `big/`, all 15 sprites, the sheet, three GIFs, front face crop, full-body comparison and all face comparison panels. This revision addresses the last review in CHARACTER.md: a slightly broader merchant with a more readable round pack, plus the updated face and finish rules.

## Review changes

- Broadened shoulders, chest and coat while retaining the tall adult build, linen shirt, moss coat blades, charcoal trousers, leather shoes, straps and left-hand swatch roll. The complete standing silhouette is now 34 pixels wide in front (previously 30), 33 in profile (28), and 37 from the rear (28). These widths include equipment and arms.
- Enlarged and clarified the high round leather sample pack with a broad face, dark lower rim, upper-left highlight and small steel buckle. It is especially readable in profile and rear views, and remains above the belt and lower coat division.
- Redrew the right-facing standing profile first, then used it with each existing pose as the character reference for the other full views. One passing frame drifted to a raised rear heel; a further image-tool redraw restored the original near-standing foot placement in `walkside1`.
- Replaced the large square-eyed front/profile construction with separately drawn, smaller-featured heads. Eyes retain light catches, brows are distinct, the nose uses a short plane, and the mouth and pointed beard remain readable. Skin uses three smooth tan tones. Rear views have no faces.

## Drawing sources and assembly

Used the built-in image tool for **18 requests**: 15 full views, two separate head drawings, and one pose correction. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. All other image references were this merchant's own images. No outside references were used.

`big/` contains the new full-view tool drawings. The front request unexpectedly returned front and profile together; `big/merchant-front.png` is a crop containing only the complete front figure. The uncropped tool output is preserved as `../scratch/review2/front-tool-pair.png`. The other final full views are uncropped tool outputs. The tool's automatic runtime originals were copied into this folder; all project scripts, backups, intermediates and deliverables were written here.

For the ten face-bearing sprites, complete front/profile heads drawn by the image tool were reduced separately and composited at each view's head position. This retains the drawn facial features consistently through the walk cycle. No eyes, brows, nose, mouth or beard were painted with code. The full-view originals retain their independently drawn heads; the final sprites additionally use these separately drawn head masters. Rear heads come from the individual full-view redraws.

## Reduction and cleanup

- Magenta range key, followed by BOX-area coverage reduction and palette selection within material masks. No single nearest-neighbour source sampling, dithering or semitransparency.
- Skin is restricted to the tan ramp. Source colour and exposed-region masks distinguish skin from the leather belt and pack. Non-skin pixels use the other five named ramps. No additional colour family was introduced.
- Compared subpixel crop alignments for the head reductions and selected ones that retain the image-drawn catches. This changes sampling alignment, not facial artwork.
- Applied the required same-mask 3×3 mode replacement to skin/hair pixels that differ from all four direct neighbours. Facial feature bands, darkest contours and exposed silhouette pixels are protected. The pass changed **132 pixels** over all 15 sprites; verification confirmed every changed pixel belongs to a skin/hair mask and no protected pixel changed.
- Before-cleanup images, masks and a per-pixel change log are in `../scratch/review2/`.

## Visual review and validation

Inspected every final head at **6×**, using rows **33–63 inclusive**, beside identical crops of Wren, Hadrik and Noble:

- `merchant-faces-front-vs-sheet.png`: front plus all four front walk heads.
- `merchant-faces-side-vs-sheet.png`: profile plus all four side walk heads.
- `merchant-faces-back-vs-sheet.png`: rear plus all four rear walk heads.
- `merchant-all-faces-vs-sheet.png`: all three panels together.

Also inspected `merchant-vs-sheet.png`, the full front beside the three references at 3×, and the final sheet. The revised face is smooth and legible beside the sheet's faces; the broader, layered figure and round pack provide a clearer silhouette while keeping his identity distinct.

All **15 sprites** pass: 96×128 RGBA, binary alpha, crown row 33, lowest sole row 124, and **23 colours across the complete set**, all from the permitted ramps. All 15 large drawings differ from their pre-revision inputs. The sheet and GIFs use 3× nearest-neighbour enlargement on `#4a4642`. Each GIF has four frames at 160 ms. Decoded GIF frames were inspected as strips; real-time playback was not independently reviewed. The front face crop uses rows 33–60 at 6×.

## Remaining limitations

- The strong brows flatten at sprite resolution, and the catches sit toward the upper corner of each eye. The profile nose and beard are more angular than the sheet's softer faces.
- Front/profile heads are shared within each direction. Rear curls, collar joins and garment shading vary slightly between independently drawn frames. Hair highlights remain somewhat broader than the reference sheet's.
- The original pose designs were retained, including the stiff near-standing first side passing frame and ambiguous side contact-leg alternation. Full-view redraws preserve the costume and pose intent, but are not pixel-identical body edits. Minor hem, cuff and hand-shape differences remain.
- Material masks use colour and spatial regions rather than fully hand-labelled segmentation; small boundary ambiguities may remain. Costume shading still has some finer clusters around the lapels and cuffs than the quietest reference areas.

## Reproduction and evidence

Exact prompts: `../scratch/review2/prompts.json`.

Final head sources: `../scratch/review2/front-head.png` and `side-head.png`. Selected reduced heads: `front-master-0-4.png` and `side-master-4-1.png`.

Previous outputs and notes: `../scratch/review2/original-big/`, `original-sprites/`, and `previous-notes.md`.

Rebuild from this folder:

```sh
python scratch/review2/reduce_heads.py
python scratch/review2/process.py
python scratch/assemble.py
```

`../scratch/review2/cleanup-report.json` records the exact cleanup changes. `final-checks.json` records final bounds, width comparisons, replacement checks, protected-pixel checks, palette count and GIF settings. The earlier `scratch/face-redo/` pipeline is superseded and must not be used to rebuild this revision.
