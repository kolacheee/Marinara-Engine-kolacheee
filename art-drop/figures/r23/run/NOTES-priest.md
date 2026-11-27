# Oru Sen — priest, Round 23 face and finish revision

## Replaced deliverables

All 15 views in `big/` and `sprites/` have been replaced. The sheet, three walk GIFs, front face crop and front-versus-sheet comparison have been rebuilt from the revised sprites.

- `sprites/`: transparent 96 × 128 PNGs; crown row 33, lowest planted sole row 124.
- `big/`: 15 selected, unmodified full-body image-tool edit originals on magenta.
- `priest-sheet.png`: 1152 × 1536, nearest-neighbour 3× on #4A4642; standing front/side/back, then four side, front and back walk frames.
- `priest-walkside.gif`, `priest-walkfront.gif`, `priest-walkback.gif`: 288 × 384, four frames, 160 ms per frame, looping, shared palette.
- `priest-face.png`: standing front, rows 33–60 inclusive, at 6×.
- `priest-vs-sheet.png`: standing priest beside Wren, Hadrik and noble, at 3×.
- `priest-faces-vs-sheet.png`: **every one of the 15 heads** beside the three reference fronts, cropped from rows 33–63 inclusive at exact 6×. Order: front and four front walks; side and four side walks; back and four back walks.

## Head edits and preservation

The revised side was drawn first. There were 17 built-in image-tool edit requests: one for every view, plus a second standing-front eye edit and a second standing-side eye edit. Every request attached `style-ref/STYLE-SHEET.png` with the required STYLE-ONLY instruction. Other image references were exclusively this character's existing or revised images. No new character design was appended to CHARACTER.md; Oru retains his elderly deep-skinned, clean-shaven face, receding grey hair, plum robe and small tablet.

The front retry repaired a missing catch in one eye. The side retry enlarged a catch that became too faint on reduction. Subsequent edits used the revised head of the corresponding orientation as an identity reference. Rear heads were redrawn into smooth steel-grey masses with an upper-left highlight and no face.

The selected full-body edits remain intact in `big/`. For the final sprites, only their reduced head regions were substituted into the original sprites: rows 33–53 for fronts, 33–55 for profiles, and 33–51 for backs. This preserves the existing costume, body and pose exactly below those boundaries, apart from requested skin cleanup. Checks confirm that every changed pixel below those boundaries belongs to the existing skin ramp; no costume, prop, shoe, silhouette or pose pixel changed there. There are 78 such body-skin cleanup pixels across all views.

Original files are retained in `../scratch/face-redo/original-big/` and `original-sprites/` for comparison. The full prompt record is [prompts.json](../scratch/face-redo/prompts.json).

## Reduction and despeckle

The process keys magenta, crops the figure, uses BOX area reduction to 92 occupied rows, and snaps colours by material. Skin is restricted to the specified deep ramp; steel hair stays steel. The skin-source anchors were recalibrated so reduced mouth/nose shadows remain distinguishable. Existing pale eye pixels map to light palette entries rather than being mistaken for brown skin. No eye, brow, nose or mouth was drawn or inserted with code.

After palette snapping, the required isolated-pixel cleanup runs separately inside skin and hair masks. A pixel is eligible only when it differs from all four direct neighbours; its replacement is the most common colour in its same-mask 3×3 neighbourhood. Protected facial-feature regions, eye catches, dark feature clusters and outlines are excluded. The pass changed 224 pixels across the set. Masks, per-view counts and code are saved in `../scratch/face-redo/`.

The palette remains exactly 24 colours across all views: plum, linen, steel, charcoal, leather and deep skin. No new ramp was added. Plum is #352A32 / #51404C / #766071 / #A08C9A; deep skin is #2E211C / #4A3226 / #6B4936 / #94694F. Alpha is binary.

Rebuild from this revision with:

```sh
python scratch/face-redo/process_redo.py
python scratch/assemble.py
```

The earlier `scratch/process.py` is retained as a record of the original workflow; running it directly would discard this revision's head-only composition and cleanup.

## Review and validation

Every final head was visually inspected at 6× beside the three sheet fronts. The ten visible faces retain eye clusters with light catches, brows, nose planes and mouth marks. Hair and skin planes are cleaner than before. All five rear heads have no facial features. The full standing comparison, final sheet, front crop and every decoded GIF frame were also inspected. GIF review was by decoded frame strips, not a claim of live playback inspection.

Mechanical checks passed for all 15 sprite sizes, occupied rows, centring, allowed palette and binary transparency, plus GIF dimensions, four-frame counts and 160 ms duration. Reports: `../scratch/checks.json`, `../scratch/face-redo/cleanup-report.json`, and `../scratch/face-redo/preservation-checks.json`. Individual comparison panels and three five-view inspection panels are in `../scratch/face-redo/`.

## Remaining limitations

- This is a closer face/finish match, not an exact copy of the reference rendering. Oru's deep skin has lower contrast than the two fair-skinned reference faces; some brow and mouth shadows remain subtler. Front brows are still flatter than the design's strongest downturned interpretation.
- Independently edited/reduced heads have small changes in hair edges, eye-catch strength and mouth shape between frames. The front eye highlights are somewhat conspicuous at 6×. Rear hair is deliberately simple and its individual locks are less distinct than in profile.
- Existing body limitations remain because body/costume/pose preservation was requested: some hands are bulky, sleeve openings are low, stocking lengths are short, and independently drawn walk frames retain minor cloth/hand fluctuations and a restrained shuffle.
- Source originals retain near-magenta variation and smoothing. The delivered sprites have the exact palette, hard pixel grid and binary alpha. Semantic material and feature protection masks are conservative and are not a claim of perfect hand-authored segmentation.
- Scope exception: installed workflow instructions were read outside this folder. All project work and saved review artifacts are inside it, and no outside art references were used. The image service automatically stores originals in its own location; project copies were saved directly from returned image data.
