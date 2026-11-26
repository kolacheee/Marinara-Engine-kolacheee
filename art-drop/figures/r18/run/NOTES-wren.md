# Wren — round 18

## Delivered

- `big/wren-<view>.png`: 15 selected, unmodified image-tool originals on magenta.
- `sprites/wren-<view>.png`: 15 RGBA sprites, each 96×128.
- `wren-sheet.png`: 1152×1536, nearest-neighbour 3× display on #4a4642. Rows are standing front/side/back (fourth cell empty), walk-side 0–3, walk-front 0–3, walk-back 0–3.
- `wren-walkside.gif`, `wren-walkfront.gif`, `wren-walkback.gif`: 288×384, four frames, 160 ms per frame, looping, on #4a4642.

## Drawing and review

Every figure was drawn with the built-in image tool. The side design was developed first from the supplied text, with several redraws to shorten the initially over-tall body. Every other view used that selected side original as a reference. Front and rear corrections also used the standing view from this same run to stabilize the face, hair, head size and equipment placement.

The initial front walk had a shoulder-switching quiver and inconsistent faces; all four front frames were redrawn. All four rear frames were redrawn to reduce head-size and costume drift. Side contact frame 2 was redrawn to make the near leg trail, then corrected again because the first correction moved the bow to the wrong side.

Every generated original, including rejected attempts, was visually inspected. The initial and final sheets were inspected at their full 1152×1536 output size. All final sprites were reviewed within the sheet. All twelve saved GIF frames were decoded into full-resolution strips and inspected; this was frame-by-frame review, not a claim of real-time playback review.

## Processing and checks

Python was used only for keying, removing disconnected stray marks, box downscaling, palette snapping, outlines, sheet/GIF assembly and checks. No anatomy, clothing, equipment or poses were drawn or repaired in Python.

Magenta was range-keyed before resizing. The figure was box-downscaled to 90 pixels tall, positioned in its frame, and given a one-pixel, eight-neighbour outline. Thus the final outlined silhouette is exactly 92 pixels tall, occupying rows 33–124 inclusive. The bottom opaque outline is on row 124; the underlying sole pixels normally end on row 123. Horizontal registration follows the head centre, which keeps the head steadier than centring the asymmetric bow-and-cloak bounding box.

Outline candidates were calculated as rounded mean opaque neighbour RGB × 0.32 + (8, 4, 10). A single shared 48-colour palette was then fitted across all outlined frames and applied without dithering. This final snap keeps the entire character, including outlines, within 48 opaque colours, but means final outline RGB values approximate rather than retain every exact computed value. The final palette snap occurs after outline calculation; this is a processing-order difference from the literal order in R17-METHOD.md.

Verified:

- Exactly 15 correctly named originals and 15 correctly named sprites.
- Every sprite is 96×128 with alpha values only 0 or 255.
- The union of opaque sprite colours is exactly 48.
- Every outlined silhouette is 92 pixels tall and ends on row 124.
- No opaque pixel matches the magenta key range.
- Sheet dimensions are 1152×1536.
- Each GIF has four frames at 160 ms each and dimensions 288×384.

The reproducible processing script and numeric report are `../scratch/process.py` and `../scratch/checks.json`. Drawing prompts are recorded in `../scratch/prompts.json`, `../scratch/redraw-prompts.json` and `../scratch/final-redraw-prompts.json`. Rejected originals and GIF inspection strips are also in `../scratch/`.

## Honest remaining weaknesses

- The compact silhouette is near the low end of the requested head-count range. The large head and smooth front face still read younger and more doll-like than the adult brief ideally calls for. The front eyes are also larger than ideal.
- The wooden bow is clearly readable, but the generated curved limbs and shoulder-to-ground length read more like a compact recurve than a traditional longbow. Its tip and string thickness vary slightly among views.
- The side walk now alternates foreground-leg overlap, but stride length and free-arm swing are not perfectly matched between the two contact frames. The bow hand is quite rigid.
- Front and rear steps are deliberately shallow. The long cloak obscures most rear leg motion, and the rear passing frames remain subtle; those cycles can read as a stiff shuffle.
- Small cloak folds, belt shapes and highlight pixels still vary. Shared colours and head registration reduce drift but cannot remove all independently drawn frame variation.
- Box downscaling and the colour cap soften some source pixel clusters. The existing dark source edge plus the added one-pixel outline can look heavy around boots, hair and the bow.
- No in-engine or half-size town-scene review was performed. No earlier-round art or game images were used.

## Workspace boundary disclosure

All task-created deliverables, processing files and retained intermediates were saved in this folder. No other Downloads folders, repositories or existing sprites were inspected. One external text file was read: the installed image-generation skill instructions required by the session. The built-in image tool also automatically cached its outputs outside this folder; those cache files were not opened or read. Its returned image bytes were written directly into this folder for processing. These are exceptions to a literal claim that no activity occurred outside this folder.
