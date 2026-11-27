# Belis Dorn — Review redraw 2

Replaced all 15 full-size originals and sprites, the sheet, three GIFs, face crop, full-body style comparison and all-head comparison. This revision follows the final **Review redraw 2** in CHARACTER.md and the replacement face/finish rules in STYLE-RULES.md.

## Design changes

Belis remains the stout, olive-skinned, clean-shaven 43-year-old man with auburn curls, broad forehead, long nose and rounded double chin. Kept the existing body construction, knee-length bell surcoat, full linen sleeves, narrow trousers, ankle boots, folded petition in the anatomical left hand, and each view's pose.

The review required full-view costume edits: deep wine fabric, gold shoulder/front/double-hem edging, cream fur standing collar, gold chain of office with steel brooch, and a gold signet ring on the empty right hand. The petition remains at the lower chest; it is hidden from the rear. No crown, cape or face jewellery was added. Back views have no facial features or front-facing chain/brooch.

## Drawing and face review

Used the built-in image tool, with STYLE-SHEET.png attached as **STYLE ONLY to every request**, including corrections. Other references were exclusively this character's own images. Side was revised first to establish the costume. All 15 views received individual image-tool edits.

There were 22 requests: 15 initial edits, a standing-front face correction, two corrections to restore walkside2's original short step, two rear-view corrections rejecting misplaced petitions, and two walkfront3 face corrections for brow and mouth visibility. Rejected/intermediate versions are retained under `../scratch/review2/`.

Inspected every selected head at exact 6× beside Wren, Hadrik and the reference noble, using rows 33–63 inclusive. Checked the full-body front at 3× beside all three reference fronts. The final heads have distinct eyes with light catches, visible brows, nose planes and short mouths, with smooth skin and substantial hair clusters. The wealth cues survive at sprite scale and the person remains distinct from the three reference characters.

## Reduction and cleanup

`../scratch/review2/reduce.py` keys magenta, crops the full figure, BOX/area-reduces to 92 occupied rows, uses the previous view's width, centres the result and places it at row 33. Alpha is binary. Skin is spatially masked and restricted to the olive ramp; source eye/brow ink and small eye catches are separately classified. Broad highlights are excluded from the catchlight mask. No facial features were drawn with code.

After palette snapping, the requested same-mask 3×3 modal cleanup replaced **306 isolated skin/hair pixels**. A pixel is eligible only when it differs from every direct neighbour. Facial feature areas, catches, material-edge colours and silhouette outlines are protected. The cleanup does not smooth clothing.

Eight ramps provide a 32-colour ceiling; **31 opaque colours are actually used across the entire set**: charcoal, leather, auburn, linen, steel, olive, gold, and one new wine ramp:

| Role | Wine |
| --- | --- |
| Edge | #33232D |
| Shadow | #562D40 |
| Body | #7B4055 |
| Light | #A26776 |

## Deliverables and verification

- `big/noble-<view>.png`: 15 selected full-body image-tool originals on magenta, byte-identical to the selected returned images.
- `sprites/noble-<view>.png`: 15 RGBA images, 96×128, crown row 33, lowest sole row 124, centred silhouettes and binary alpha.
- `noble-sheet.png`: 1152×1536, 3× on #4A4642; standing front/side/back, then side/front/back walk rows.
- `noble-walkside.gif`, `noble-walkfront.gif`, `noble-walkback.gif`: 288×384, four frames, 160 ms/frame, looping. Every decoded frame was checked against its corresponding sprite and matches exactly.
- `noble-face.png`: standing-front crop, rows 33–60 inclusive, at 6×.
- `noble-vs-sheet.png`: front beside all three reference fronts at 3×.
- `noble-heads-6x.png`: all 15 heads, each beside all three reference face crops, at 6×.

Reproduction and evidence are in `../scratch/review2/`: `reduce.py`, `assemble.py`, `verify.py`, `verification.json`, `report.json`, `palette.json`, `prompts.json`, and `final-mouth-prompt.txt`. The previous complete out/ is preserved in `before/`. Authored working files stay in this character folder; the image tool's automatic cache originals were copied into it.

## Honest limitations

The reference's hand-placed craft is not reproduced exactly. Independently edited heads retain small differences in width, curl shape, cheek lighting, brow weight and mouth contrast; this produces some animation flicker. One profile catch occupies two vertically adjacent pixels. Curls form substantial masses but are not exactly four separately countable locks in every view.

The chain, rings and fur compress into small clusters at 92-pixel figure height; the fur can read as cream/gold collar trim. Some cloth-plane boundaries retain isolated reduction pixels. Hands remain larger than the initial 3–5-pixel target in some views. The original side build and walk mechanics remain, including the slightly extended raised foot in walkside3. Full-view edits preserve pose and costume construction, but are not pixel-identical outside the requested changes.
