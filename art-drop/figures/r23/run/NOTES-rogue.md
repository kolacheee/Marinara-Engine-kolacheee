# Veska Rill — Review redraw 3

## Result and scope

Replaced the face-bearing heads across standing front/side and all eight front/side walk frames. The expression now reads neutral, with level brows separated from the eyes, visible light catches, a small nose plane and a separate short mouth. The existing head dimensions and placement are retained: front 18 × 23, profile 23 × 23 logical pixels. The five rear heads remain face-free and retain their original drawings, with the requested hair cleanup applied.

The last section of CHARACTER.md governs this pass: keep the new body and costume, redo the face. Every sprite pixel below row 56 is identical to the incoming set. Full-resolution bodies below the head insertion are also identical. The dark jerkin, short scarf, leather straps, belt dagger, asymmetric sleeves, left-hand prybar and each individual pose are preserved.

All 15 files in `sprites/` and `big/` were written, and the 3× sheet, three GIFs, 6× face crop, full-figure versus-sheet and 15-head versus-sheet comparisons were rebuilt. Some rear images are visually unchanged because they had no qualifying isolated pixels.

## Drawing sources and reduction

This pass used three built-in image-tool requests: a front head, a profile head, and a second front redraw after its first reduction still merged the brows and eyes. Every request attached `style-ref/STYLE-SHEET.png` as STYLE-ONLY with the required exact instruction. The other references were only this character's own heads. No outside artwork was used.

Selected originals are `../scratch/review3/front-head.png` and `../scratch/review3/side-head.png`. The rejected first front is `front-head-attempt1.png` in the same folder. Exact prompts are `prompt-front-head.txt`, `prompt-side-head.txt` and `prompt-front-refine.txt` there. The complete incoming output set is preserved under `../scratch/review3/before/out/`.

The two selected heads are reused in their five matching views to avoid facial flicker. The ten face-bearing files in `big/` are full-resolution composites, not untouched single-call originals. The five rear `big/` files retain the incoming source artwork. The uncomposited new head originals remain available separately.

`../scratch/review3/rebuild.py` range-keys magenta, BOX-reduces the heads, and separates source skin, hair, dark features and pale catches before palette snapping. Facial skin maps to three olive plane tones; dark features map to charcoal, catches to the pale steel tone. Source coverage preserves the drawn catches and lines during reduction. No facial feature was painted or positioned with code.

The required same-mask 3×3 mode cleanup runs only for isolated skin/hair pixels that differ from all four direct neighbours. Mask boundaries and facial feature classes are protected. The selected front head required seven hair replacements and the profile five; neither required a skin replacement. Three rear-walk views each had one isolated hair pixel removed. The body pass found no qualifying replacements. Counts and pixel-change totals are in `../scratch/review3/cleanup.json`.

The sprites still share exactly 24 colours: charcoal, leather, auburn, navy, steel and olive. No new ramp was introduced. Large source drawings retain their source colours.

## Checks and visual review

- All 15 sprites are 96 × 128 RGBA with binary alpha, crown row 33 and lowest sole row 124. No opaque pure black, pure white or magenta remains.
- All three GIFs contain four 288 × 384 frames at 160 ms each, looping.
- Every head was inspected at 6× beside Wren, Hadrik and the noble, cropped from reference rows 33–62. The complete comparison is `rogue-heads-vs-sheet.png`; individual rows and three review panels are saved in `../scratch/review3/`.
- Front and front-walk 0–3 retain both 2 × 2 eye clusters with light catches and a clear skin row below the brows. Side and side-walk 0–3 retain the visible eye/catch, brow, projecting nose and mouth. Back and back-walk 0–3 have no facial features.
- The full 3× comparison and sheet were inspected. Veska remains lean and distinct beside the three references, and the face no longer reads as a scowl. All twelve decoded GIF frames were also inspected.
- Export checks are in `../scratch/review3/validation.json`; exact body-preservation checks are in `../scratch/review3/body-preservation.json`.

## Remaining limitations

The reduced expression reads neutral more strongly than sly; the slight raised mouth corner in the large drawing becomes a short line. The jaw notch remains a pale cluster, larger than a literal cut. Profile cheek shading is stylized, and its eye occupies a slightly wider cluster than the front eyes. The three-tone skin has less tonal depth than the sheet's light-skinned faces, while remaining smooth and readable.

Existing animation and costume limitations are unchanged: body registration shifts laterally, rear hair differs between frames, side passing frame 3 extends its foot farther than ideal, and prybar length and small costume details vary. These were retained to honor the face-only review and preserve each pose. The set is not a perfectly registered production animation loop.

All project work and returned image data were saved inside this folder. The image tool also maintains its automatic cache; it was not used as an artwork reference.
