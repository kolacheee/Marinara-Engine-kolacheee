# Asen Tor — cleric review redraw

## Review changes

Replaced the fifteen-view set. The apron-like costume is now an ankle-length charcoal clerical robe with a long linen, gold-edged sun tabard, a sun-ring staff in the anatomical left hand, and a prayer book at the right hip. The narrow adult build, bald crown, charcoal temple/nape hair, square chin beard, navy binding, horizontal linen medicine case and pose sequence remain. The robe and staff necessarily change the old lower-body silhouette and left-arm position, as required by the review.

## Delivered and checked

- `big/`: fifteen full-body magenta image-tool originals, one retained figure per file.
- `sprites/`: fifteen 96 × 128 RGBA sprites; crown row 33, lowest support sole row 124, binary alpha, equipped silhouette centered within one pixel.
- `cleric-sheet.png`: four rows at exact 3× on #4a4642, standing front/side/back followed by the three four-frame cycles.
- Three walk GIFs: 288 × 384, four frames, 160 ms each, looping. The decoded frames were inspected.
- `cleric-face.png`: standing front head at 6×, source rows 33–63 inclusive.
- `cleric-vs-sheet.png`: Asen beside the three reference fronts at 3×.
- `cleric-heads-vs-sheet.png`: all fifteen heads, each beside Wren, Hadrik and Noble at 6×; reference source rows 33–63 inclusive. Standing, side-walk, front-walk and rear-walk comparisons were inspected separately as well.

The complete sprite set uses 27 shared opaque colours. The review's gold symbols and trim add the existing gold ramp (#57432C, #8A693B, #B79351, #D5B677) to charcoal, leather, linen, navy, steel and tan; no invented colour family. This supersedes the earlier six-ramp costume palette while remaining below 32 colours. Skin planes use the tan shadow/body/light tones; eye catches use warm linen and dark features use charcoal.

## Redraw and cleanup process

Used the built-in image tool for 21 requests, with `style-ref/STYLE-SHEET.png` attached to every request under the required STYLE-ONLY instruction. Only that sheet and this character's own images were image references. The redesigned standing side was made first and used to establish the costume for the other views. Each pose received an individual full-body redraw.

Additional corrections: rejected an accidental two-figure back output; corrected walk-back 0's lifted shoe so the planted foot is lowest; redrew the standing front head and walk-side 1/2 heads after reduction checks; enlarged walk-side 2's eye in one further image-tool edit. Rejected stages and the previous originals remain in `../scratch/review/`.

Pillow performed magenta keying, BOX area reduction, anatomy-restricted material masking, palette snapping, binary alpha, placement and export. The orange source skin was mapped by shadow/body/light roles into the specified tan ramp; the later head redraws use direct tan snapping. Dark facial features and pale eye catches have separate material masks so they do not become skin during quantization. No facial feature, pose or costume was drawn or transplanted with code.

After palette snapping, skin and hair received the specified isolated-pixel cleanup: if a pixel differs from all four direct neighbours, replace it with the most common colour among its same-mask 3×3 neighbours. Facial features, mouth region, dark edges and silhouette contours are protected. The masks and per-view cleanup counts are retained for inspection.

Reproduction script: `../scratch/review/process.py`. Exact prompts: `../scratch/review/prompts.json`. Technical checks: `../scratch/review/final-checks.json`. The script stages exports in `../scratch/review/processed/` before copying approved files into this directory.

## Visual assessment and remaining limitations

The sun-marked robe, staff and belt book make the role legible beside the references. All visible faces have readable eye/brow structure and mouth or beard boundaries; the bald skin and hair use substantially quieter planes than the previous set. The reference faces remain the comparison standard rather than a claim of pixel-for-pixel stylistic identity.

Independent drawings still introduce small head-width, cheek-highlight, staff-head, case and hem shifts between frames. Eye catches and brow spacing vary by viewing angle and reduction phase. Some profile noses extend more than one logical pixel; some hands exceed the earlier 3–5-pixel target. The side contact strides are somewhat longer than an ideal quiet town shuffle, and the robe obscures anatomical near/far leg overlap. These are usable four-frame previews, not fully stabilized production animation.

Project work and retained artifacts are inside this folder. The required imagegen skill was read from its installed location; the built-in tool also writes its automatic managed cache outside the folder. Its returned originals were copied into this folder. No unrelated character art or external image references were used.
