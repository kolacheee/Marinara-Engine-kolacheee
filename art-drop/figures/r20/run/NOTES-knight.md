# Knight — delivery notes

Delivered all 15 requested views: standing front/side/back and four frames each for side, front and back walking. The side faces right. All figure drawings came from the image tool, starting with the side master; subsequent requests referenced that master. The only art references were STYLE-SHEET.png, ref-sprites/, and this run's knight images.

## Files and verified limits

- `big/knight-<view>.png`: full-resolution drawing sources, one view per file. The revised walkback1 is a cell crop from `scratch/knight-walkback1-v2-source.png`; that request unexpectedly also returned a side figure, which was excluded.
- `sprites/knight-<view>.png`: 15 transparent RGBA frames, each 96 × 128.
- Every delivered sprite has crown row 33 and lowest planted sole row 124: 92 occupied rows, with the whole silhouette horizontally centred to within one pixel.
- Alpha is strictly 0/255, and transparent RGB is zero. No pure black or pure white in sprites.
- The union of all sprite colours is **24**, within the 32-colour character cap, drawn from the supplied charcoal, leather, fair_skin, gold, navy and steel ramps. The skin uses the brown middle/shadow entries rather than a new skin palette.
- `knight-sheet.png`: standing row, then side/front/back walk rows; exact 3× nearest-neighbour pixels on the supplied style-sheet background.
- `knight-vs-style.png`: knight, Wren, Hadrik and Noble front/side views, all at the same 3× scale.
- Three walk GIFs: 288 × 384, four distinct frames each, 160 ms per frame, looping. Their decoded RGB frames match the composited sprites exactly. GIF backgrounds are opaque; individual PNG sprites are transparent.

## Visual review and revisions

Inspected every generated source, including rejected drafts, and all final sprites at integer magnification. Inspected the complete sheet and comparison, with native-resolution row crops, plus all decoded GIF frames in sequence strips.

Redrew the initial overly tall side master; the blank front face; the repeated side contact arm swing; the second side passing pose; and the back passing boot that had a detached dark mark. Rejected versions and review images remain in `scratch/`.

Python performed magenta keying, cell cropping where needed, one nearest-neighbour reduction to 92 px, colour snapping, sheet/GIF assembly and checks. No limbs, faces, costume shapes or replacement pixels were painted in code. Colour-only skin masks and neutral-metal mapping were added because unrestricted nearest-palette snapping made some skin ochre and some steel blue. These masks are specific to this knight and should not be reused blindly.

## Honest weaknesses against STYLE.md

- This is close in scale and palette, but not an exact style match. The knight's steel highlights and pale gambeson edging are more prominent than the quiet cloth planes in the references. Some outlines remain heavier at overlaps, with scattered one-pixel shade changes after reduction.
- Hair reads dark brown with warm highlights rather than nearly black. Its highlight clusters vary slightly across views. Skin shading also varies, especially between the side walk frames; the final side passing face is less clean than the best standing face.
- Adult proportions are approximately four to four-and-a-quarter heads, rather than an anatomically identical 23 px head in every view. The front eyebrows are stronger than the reference faces, while the side mouth is faint. Facial and hand marks are not uniformly exact 1×1 or 3–5 px constructions.
- The four-frame walks are usable pose sequences, but are not a perfectly locked animation rig. Head/shoulder contours, plate shading, shield width and sword/scabbard angle change a little. Whole-silhouette centring can cause lateral body movement. The two side contact strides are not perfectly symmetric, and the first is somewhat broader than the intended quiet town walk.
- Front and back foot spacing and lift are not identical between opposite phases. Some lifted feet are a few pixels higher than the requested very low passing target. The back soles and trouser folds can read slightly stiff.
- The sword remains at the anatomical left hip, but its connection behind the arm/leg is partly obscured in profile and its apparent length varies. The shield is round in design but slightly oval in some rear drawings.
- The skin/steel palette corrections keep the shared colour limit and improve material separation; they do not make the source lighting completely uniform. I did not conceal these remaining drawing differences with procedural repainting.

## Reproduction

From this folder:

```sh
python scratch/assemble_sheet.py
python scratch/check.py
```

The first command rebuilds reduced sprites, sheet, comparison, GIFs and sheet review rows from `out/big/`. The second verifies the deliverable constraints and writes `scratch/check-report.json` and GIF review strips. Source boxes and widths are in `scratch/reduction-manifest.json`; palette ramps are in `scratch/palette.json`; the full built-in image-tool prompts, including revisions, are in `scratch/prompts.json`.
