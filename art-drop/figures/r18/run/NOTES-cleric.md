# Cleric — round 18

Delivered 15 original images in `big/`, 15 transparent sprites in `sprites/`, `cleric-sheet.png`, and the three walking GIFs. Only this character was made.

The standing right-facing side view was designed first from text. Its first version was too tall and was redrawn before making the other views. Every subsequent figure used the accepted side image as a reference. The final standing back and rear contact redraws also used this run's own rear artwork to stabilize the costume. No earlier-round artwork or existing sprites were used. All figures and pose corrections were drawn by the built-in image tool; Python only processed and checked the resulting images.

## Processing and checks

- Magenta range key, followed by BOX downscaling. No painting, limb compositing, mirroring, or scripted figure construction.
- Each transparent PNG is 96×128. The complete outlined silhouette is 92 pixels tall, spanning rows 33–124. This uses 90 pixels of downscaled original art plus the one-pixel exterior outline.
- Alpha is exclusively 0 or 255. No residual magenta was detected in the final opaque pixels.
- All 15 sprites together use exactly 48 opaque RGB colors: 36 shared interior tones and 12 shared outline tones.
- The outline is one pixel around all eight-neighbor boundaries. Colors were calculated as mean neighboring interior RGB × 0.32 + (8,4,10), then palette-snapped. This final snapping is an explicit approximation to the literal formula, needed to keep the outlines inside the shared 48-color limit.
- Sheet: 1152×1536, nearest-neighbor 3×, background #4a4642. Rows are standing front/side/back, side walk 0–3, front walk 0–3, rear walk 0–3. The fourth standing cell is empty.
- GIFs: 288×384, four frames each, 160 ms per frame, looping, on #4a4642. Every decoded GIF frame was checked against its corresponding nearest-neighbor 3× sprite and matches exactly.
- All generated originals, including rejected versions, were visually inspected. All final sprites were inspected individually and in the full-size sheet. All GIF frames were decoded and visually inspected in sequence order; timing was checked from the files. This is frame-by-frame review, not a claim of testing movement inside a game engine.

## Redraws

Seven rejected originals are retained in `../scratch/`: the initial tall side design; side walk frames 1, 2, and 3; the first standing back; and rear walk frames 0 and 2. Redraws corrected proportions, overly extended passing steps, repeated arm swings, rear shoe direction, and rear tabard consistency. The first assembled sheet is also retained there.

## Honest weaknesses

- The two side passing poses are very similar. The long robe hides the knees and much of the leg overlap, so the cycle's leg alternation is less clear than its arm alternation. It can read as a restrained shuffle.
- Contact arm swings are somewhat stronger than ideal for a very relaxed town walk, particularly front frame 2. Feet remain low, but contact-to-passing transitions are still abrupt in four frames.
- The head, eyes, beard, neckline, robe folds, tabard edges, mace shape, and highlights have small differences between separately drawn frames. A shared palette controls colors but does not remove this detail shimmer.
- The side face is in profile, while the torso shows some front surface to preserve the symbol and tabard. It is not a mechanically exact orthographic rotation.
- The originals have some fine texture and uneven pixel-block sizes. BOX reduction and palette snapping make usable crisp small sprites, but they do not turn the source into a perfectly hand-authored pixel grid. The chain and mace handle lose detail at final size.
- The outlined 92-pixel height and palette-snapped outline are the processing interpretations described above, rather than a claim that every wording of the source method can be satisfied literally at once.

## Work record and scope caveat

`../scratch/prompts.json` preserves the complete prompt set, `../scratch/process.py` reproduces processing, and `../scratch/checks.json` records dimensions, bounds, and palette checks. Intermediates and review images were kept in `scratch/`.

The requested outside-folder restriction had one instruction-file exception: higher-priority runtime instructions required reading the installed imagegen `SKILL.md` outside this folder. No other project folders, repositories, or external artwork were opened or searched. The image service automatically saved its own copies outside the folder; workspace originals were saved directly from returned image data without reading those external copies.
