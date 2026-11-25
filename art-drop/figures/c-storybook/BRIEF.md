# BRIEF: "Book of Hours" figures (storybook lane)

Read SPEC.md first; it says WHAT to deliver. This brief says HOW it must look and how to make it. Where they
differ on deliverables, SPEC.md wins; on style, this brief wins. CODEX-WORKFLOW.md is background only: its
sprite route (image tool, downscale, `#24161f` outline) is NOT the route here.

Hard rules: work only in this folder. Do not search the disk for sprites or open any existing sprite or
art folder (in particular nothing under art-drop/ or packages/client/public/hd2d/): the owner rejected them.
Do not imitate any commercial game. Scripts and scratch go in out/src/ and scratch/; deliverables in out/.

## 1. The direction

People as if painted into the margin of a fifteenth-century Book of Hours and then set walking through a
lamp-lit town. Take these qualities (never copy a picture): the calendar pages of late-Gothic illuminated
manuscripts (slender courtly figures, long sweeping hems, tiny pointed shoes), the flat mineral pigments of
those pages (lapis ultramarine, vermilion, verdigris, lead white, shell gold), the coloured leading of
stained glass, and the repeating trim of Arts-and-Crafts book borders. Each figure is a small jewel: a few
large flat colour areas, each enclosed by its own dark coloured ink, with gold and pattern on the edges.

The six rules that make it this direction and not a generic RPG sprite:
1. **Coloured ink, never black.** Every colour area is drawn with its own ramp's darkest shade (the "ink")
   as its 1 px contour: a red tunic has a wine contour, skin a deep sienna one, blond hair a dark umber one.
   Because the ink is inside each ramp, it recolours with the region. No pure or neutral black anywhere.
2. **Flat fills, few shades.** Each region is mostly ONE flat base colour. Shade is a hard flat band, light
   is a sparing 1 px accent. No dithering, no gradients, no pillow shading, no anti-aliasing.
3. **Elongated, upright, courtly.** About 4 heads tall, long neck, narrow sloping shoulders, long legs or
   long hem, small pointed feet. Poses are still and vertical, arms close to the body.
4. **Decorated edges.** Every outfit carries at least one patterned band (hem, cuff, collar or cloak lining)
   and the mage robe carries a powdered motif (semé). Gold is reserved for small precious accents.
5. **Gothic drapery.** Folds are long straight vertical lines that end at the hem in a small hook or V,
   never wrinkly blobs.
6. **Read by colour block.** At 1x a figure reads as 3-4 bold areas (hair, face, garment, trim) with a
   dark coloured rim; that, plus flat saturated colour against the noisy textured ground, is how it stands
   out (see "Standing out" below).

### Proportions (32x48 frame, x 0..31, feet on row 47, figure centred on the line between x 15 and 16)
Both bodies share the SAME head, neck and height, so every hair, beard, feature and headwear layer fits
both bodies. Adult body height 44 px (rows 4..47); hair adds 1 row above (row 3); horns, hood point and
staff may rise higher but never above row 0. Start from these down-view anchors (adjust by at most 1 px):
- head with contour: x 11..20, y 4..14 (10x11); neck: x 14..17, y 15..16.
- shoulders row 17: man x 9..22, woman x 10..21 (sloping: outer pixel one row lower than the inner).
- waist row 26: man x 11..20, woman x 12..19 (the woman is visibly narrower here); hips row 29: both x 11..20.
- arms hang close; hands y 30..32; legs y 31..44; pointed shoes y 45..47.
- left (side) view: head x 11..20 in profile facing left, body 8-9 px deep, near arm over the torso.
- up view: the down-view silhouette, no face.
Outfits are drawn for the man; write each outfit as a function of the body template so an `@woman`
variant (narrower shoulders and waist) comes out of the same code. Produce @woman variants for any
outfit where the man's cut shows wrong on the woman (expect all three).

### Pixel rules (all at 32x48)
- **Outline:** 1 px, the ink of the region it encloses, on every edge that meets transparency AND on every
  boundary between two different ramps (e.g. sleeve against hand: the sleeve draws its ink). Lines are
  clean: runs follow steady slopes (1:1, 2:1, 3:1), no doubled lines, no 2x2 blocks of ink, rounded
  corners cut by one pixel (no square shoulders, no square skull). Outline never uses another ramp's ink.
- **Shading:** light from the top-left. Four shades per ramp: ink, shade, base, light. Per region about
  60% base, 20-30% shade, at most 10% light. Shade = one flat band on the side away from the light (viewer's
  right in down view, the back in side view), under the chin, under hair, under a belt, in fold hollows.
  Light = a short run just inside the contour on the top-left crests (hair crown, shoulder line, fold crest,
  a cheek pixel). Never put light next to ink without base between them except on the rim.
- **Faces and eyes:** almond-calm, small, high-set features, no black pupils, no white sclera. Down view,
  each eye is a 1x2 column: upper pixel eye[0] (the lid line, which reads as a lash), lower pixel eye[1]
  (the iris colour); eyes at x 14 and x 17, rows 8-9, two skin pixels between them. Nose: one skin-shade
  pixel at (16,10). Mouth: two skin-shade pixels at x 15-16, row 12. No brows, no blush. eye[2] is a
  reserved light: use it nowhere at this size. Side view: one eye column 2 px behind the face edge, nose as a
  1 px bump beyond the profile at row 10, mouth one shade pixel. Up view: no face. The face must read as
  "looking at you" at 1x: check it does. Starting down-view head (K=skin ink, s/b/l=shade/base/light,
  E=eye[0], I=eye[1]; rows 4..14, columns x 11..20); hair covers rows 4-6 later:
  ```
  ..KKKKKK..
  .KlbbbbsK.
  KlbbbbbbsK
  KbbbbbbbsK
  KbbEbbEbsK
  KbbIbbIbsK
  KbbbbsbbsK
  KbbbbbbbsK
  .KbbssbsK.
  ..KbbbsK..
  ...KKKK...
  ```
- **Hands and feet:** hands are mittens, 2 px wide x 2-3 px tall of skin plus ink contour, no fingers; a
  hand holding the staff wraps it (the staff pixels stop at the hand). Feet are pointed shoes: down view 3 px
  wide narrowing to a 1 px toe tip on row 47; side view the toe sticks 2 px forward to a point. Shoes are in
  the fixed leather ramp on the body layer; outfits may draw boots over them.
- **Hair clusters:** hair is a few calligraphic locks, each 2-4 px wide, separated by 1 px ink strokes that
  follow the flow (from the crown or parting outward and down). Each lock: base fill, a shade band on its
  right/under side, and 1-3 light pixels on the top-left of the crown only. Lock ends finish in a 1 px
  curl or hook, like a pen flourish. Hair sits 1 px outside the skull contour (volume), and its ink replaces
  the skull contour where it covers it. Short: a rounded cap with a fringe and a rolled curl at the nape
  and over each ear. Long: centre parting, falls in 3 locks per side to mid-back, over the shoulders in down
  view. Braid: a crown of smooth hair and one braid over the figure's left shoulder down to the waist,
  drawn as alternating 2x2 diagonal segments (base/shade with ink seams), tied with a gold ribbon pixel pair.
  Full beard: same hair ramp, covers jaw and chin from row 10 down to row 16, 2 locks with an ink parting,
  mouth line left visible as one ink pixel.
- **Cloth folds:** 2 folds on a tunic, 3-4 on the robe, 2 on a cloak half. A fold = a straight vertical
  shade line (ink for the single deepest fold) with base on both sides, ending at the hem in a hook or V
  that notches the hem contour by 1 px. Hems are not flat lines: sweep them 1 px lower at the back edge.
- **Patterns and trim (rules to keep them crisp):** bands are 2 px tall; motifs repeat on a strict 2, 3 or
  4 px period aligned to the frame (so walk frames keep the same phase where the cloth does not move).
  Allowed motifs: pearl band (base band with light dots every 2 px), gold dentil (gold dots every 2 px on
  a B band), zigzag (shade/light chevron, period 4), dagged edge (scalloped hem, 3 px scallops), semé (a
  1 px light dot or a 5-pixel plus in cloth A light, on a diagonal grid every 4 px). Patterns stop 1 px short
  of any contour.
- **Number of shades:** skin, hair, cloth A, cloth B: 4 each (ink, shade, base, light). Eyes: 3. Fixed
  (non-recolouring) ramps: linen 4, leather 4, gold 4, horn 4, wood 3, garnet 3. Nothing else exists.

### What each layer looks like
- body: skin, the face above, a plain linen shift (fixed linen ramp) from neck to knee, bare forearms,
  leather shoes. Man and woman differ only below the neck.
- feature/elf-ears: skin ramp; long leaf-shaped ears sweeping up and out at about 45 degrees, 5 px beyond
  the head contour, tip at about row 5, so they clear every hair layer (hair is drawn above them). Side view:
  one ear swept back. Up view: both ears from behind.
- feature/horns: fixed horn ramp; curved ram-like horns from the temples sweeping up, back and round, with
  ink ring bands every 2 px (decorative ridges). Tips must clear the short hair by at least 3 px.
- outfit/labourer: knee tunic (cloth A) with a 2 px cloth B hem band (zigzag), rolled sleeves showing
  forearms, a leather belt with a gold buckle pixel, hose in cloth B. @woman: ankle-length kirtle instead of
  hose, same belt, a cloth B apron panel.
- outfit/ranger: long hooded cloak (cloth A) open at the front so the lining (cloth B) shows as a 1-2 px
  stripe down both front edges; hood DOWN lying on the shoulders with a dagged edge; leather jerkin with a
  tooled line pattern, belt, gold-and-garnet brooch at the throat, leather boots over the shoes.
- outfit/mage: floor-length robe (cloth A) with gold-free semé in cloth A light, wide bell sleeves hanging
  to the hip, cloth B sash knotted at the waist with two tails down the front ending in fringe, a cloth B
  hem band with gold dentil, gold collar. The robe hides the feet except the toe tips.
- head/hood (choose the hood): a chaperon hood up, cloth A, a shoulder cape with a dagged cloth B edge, and a
  long liripipe tail hanging behind (visible in side and up views). Face opening shows the face and beard.
  It recolours with the character's cloth A.
- held/staff: fixed wood ramp, held in the figure's right hand (viewer's left in down view), top reaches row
  2; finial is a gold crook enclosing a garnet gem (3 px). The staff swings with the hand in walk frames.

### Standing out from busy textured ground
- Every inner ink has WCAG relative luminance at most 0.07 and a hue (max-min channel at least 12), so the
  contour reads dark on lit cobbles and stays coloured.
- Fills are flat and saturated while the ground is noisy: contrast of texture, not only of value.
- The light-shade rim on the top-left (hair crown, shoulders) catches the lamp light and separates the
  figure on dark stone.
- Test it: build scratch/busy.png, a procedural noisy cobble ground in warm mid and dark browns (random 3-5 px
  stones, 4 values), and view the lineup on it at 1x and 3x. If any figure dissolves, raise its contrast.

## 2. Ramps (exact hex, darkest first; ramps.json)
Source ramps (draw recolourable regions ONLY in these; every source hex is unique across all ramps):
```
skin   #5c2a2e #b8705a #e0a582 #f6d2b0
hair   #351a26 #6b3433 #a2573d #d48b52
eyes   #241634 #5a4ea0 #9c94d8
clothA #1a1640 #2c3290 #3f55c4 #7f9ce8      (lapis)
clothB #3e2210 #8a5418 #c88e2a #f0cc6a      (saffron)
```
Fixed ramps (never recoloured, never used for a recolourable region):
```
linen   #43352e #9c8c78 #d2c3a6 #efe4cc
leather #2e1a14 #5e3422 #8a5532 #b8834e
gold    #4a2a0e #a8741a #e3b43a #fbe79a
horn    #3e2e28 #9c8670 #d8c8a8 #f4ecd8
wood    #2c1a12 #5c3a22 #8c5e36
garnet  #3a0a1e #a01a3c #f0607a
```
Target ramps:
```
skin (list, in this order): very light #6a3036 #c98f7c #f0c6a8 #fde7d4 | light #5e2c2e #bf7f66 #e8b48f #f8d8bb
  | medium #4f2426 #9c5c43 #c98b62 #e6b58c | dark #3c1c1e #6e3a2a #9a5d3c #c48558
  | very dark #2a1418 #4d2820 #6e3e2a #94603e | fantasy grey-green #233632 #4e7466 #7fa392 #b6d2bf
hair: black #16122a #2a2638 #423c52 #646078 | brown #2a1810 #50301e #7a4c2e #a77448
  | chestnut #3a1416 #6e2c22 #a04a2e #cf7a44 | blond #5a3a14 #a8762c #dcae4a #f6dc8a
  | red #4a1014 #8e2420 #c8462a #f07c3c | grey #3a3446 #6e6a72 #a09ca2 #d2ced0
  | white #44404f #a8a6b4 #dcdae2 #fbf8f0 | lapis (fantasy) #1c1846 #353a96 #5a6ad0 #96aef0
eyes: brown #24120c #6a3a1e #a8703c | hazel #2a2010 #7a6a2a #b0a050 | green #0e2a1c #2f7a44 #74b868
  | blue #101c46 #2e5ab8 #78a8f0 | grey #222a36 #6a7480 #aab4be | amber #3a1a06 #b0661a #f0a83a
clothA: lapis #1a1640 #2c3290 #3f55c4 #7f9ce8 | vermilion #46101c #962222 #d23e2a #f58a4e
  | verdigris #0e2c2a #1e6458 #2f9a7c #7cd0a4 | murrey #2e0e2a #5e1e4c #8e346e #c66a9c
clothB: saffron #3e2210 #8a5418 #c88e2a #f0cc6a | rose #42121e #8e2e44 #cc5a6e #f2a0a4
  | azure #102a46 #2a6098 #4a96cc #9cd2ee | ivory #3c2e3a #8e8478 #cfc4ae #f6f0e0
```
ramps.json shape: `{"source": {"skin": [...], "hair": [...], "eyes": [...], "clothA": [...], "clothB":
[...]}, "targets": {"skin": [[...] x6 in the order above], "hair": {"black": [...], ...}, "eyes": {...},
"clothA": {...}, "clothB": {...}}, "fixed": {"linen": [...], ...}}`.
If a value fails a check below (e.g. two hexes collide), fix it and say so in NOTES.md.

Lineup colourways (compose script): 1 ranger A verdigris / B rose; 2 labourer A vermilion / B azure;
3 mage A lapis / B ivory; 4 labourer A murrey / B saffron, skin fantasy, hair chestnut; 5 mage A verdigris /
B rose, hood in A; 6 ranger A lapis / B saffron. Skin: 1 light, 2 very dark, 3 very light, 4 fantasy,
5 light, 6 medium. Character 5's beard and hair are grey; character 2's beard black.

## 3. Drawing method: native Python/Pillow, pixel by pixel, from one shared template
Do NOT use the image tool for any deliverable. This style lives on exact 1 px coloured contours, 2 px pattern
periods and 1-pixel eyes; downscaling and quantising a painting smears all of that, and AI images never
line up across layers. Draw natively instead:
1. `out/src/template.py`: the colour roles (`A0..A3`, `B0..B3`, `S0..S3`, `H0..H3`, `E0..E2`, fixed ramps)
   mapped to source hexes; the body anchors per direction (down, left, up) and the per-frame pose table for
   the down walk; helpers `put`, `hline`, `vline`, `fill_mask`, `contour(mask, ink)`, `pattern_band`.
2. Draw unique views as ASCII pixel maps (one char per role, as in the head above) or as masks plus rules;
   use maps for faces, hands, feet, ears and horns, masks plus a contour pass for garments and hair.
3. Draw the body first. Every other layer is drawn against the body's mask for the same direction and frame
   (e.g. the outfit mask = body torso mask grown by 1 px, then contoured in its own ink), so alignment is
   guaranteed by construction. Per-layer contour is computed on that layer alone, then hand-fixed.
4. Walk (down only), shared by every layer through the pose table: f0 stand; f1 upper body (everything above
   the hips, plus head layers) down 1 px, viewer-left foot forward to row 47 and drawn 1 px longer, the other
   foot lifted to end on row 46, arms swing 1 px; f2 feet together, upper body back up; f3 mirror of f1.
   Hems sway 1 px toward the lifted foot. Other directions repeat the standing frame in all 4 cells. Right =
   horizontal mirror of left (layers and composite both).
5. `out/src/compose.py`: load layers, recolour by exact hex swap (source ramp to target ramp), stack in SPEC
   order, write every composite. `out/src/check.py`: the checks below. Keep all three runnable with
   `python3 out/src/<x>.py` so the owner can regenerate.
px.py's palette checks use an old palette and its ramps.json does not exist here; do not run them. You may
borrow its generic ideas (alpha, lone pixels, bbox) but write check.py for these ramps.

## 4. Self-check (run it, then look; redo any weak file before finishing)
check.py must report, per layer sheet and per composite, and you must fix every failure:
- size 128x192 per layer; alpha only 0 or 255; unused cells fully transparent.
- palette: each layer uses only its allowed roles (body: skin, eyes, linen, leather; features: skin or horn;
  outfits: A, B, leather, gold, garnet, linen; hair and beard: hair, gold; hood: A, B; staff: wood, gold,
  garnet). Zero off-palette pixels. All source and fixed hexes are distinct.
- bbox per body cell: bottom on row 47, height 44 +-1 (40-46 hard limit), horizontal centre at 15.5 +-1.
- ink contour: in every composite cell, every opaque pixel that touches transparency (4-neighbour) is an ink
  (index 0 of some ramp): must be 100%. No 2x2 block of one ink colour anywhere.
- inks: luminance <= 0.07 and max-min channel >= 12 for every ink in source, target and fixed ramps; no
  #000000 and no neutral grey near-black anywhere.
- lone pixels (no same-colour 4-neighbour): under 3% per layer, not counting eye pixels, nose, mouth, gold
  and garnet accents and semé dots.
- fit: compose every outfit x both bodies x every direction and frame, every hair x hood, ears and horns x
  every hair; no body pixel pokes through where a garment should cover, no gap between hair and head.
Then look (actually open the files) at 4x: `scratch/fit-matrix.png` (all fits above), every layer sheet,
lineup on grey, stone and scratch/busy.png. Each of these is a failure; redo the file:
- a face that does not read as two eyes looking at you at 1x, eyes not level, or a smeared mouth;
- a black or near-neutral outline, a missing contour, a doubled contour or a staircase with uneven steps;
- shading that is dithered, gradient or pillow-shaped, or more than one shade band per surface;
- hair that is a flat blob without ink-separated locks, or a beard that hides the mouth line completely;
- a labourer, ranger and mage that are not told apart at 1x by silhouette alone (cover the colour and check);
- ears or horns hidden by hair, a hood that does not cover the hair line, a staff that floats off the hand;
- a pattern that shimmers between walk frames, a walk where the feet slide or the head pops 2 px;
- any layer that is off by a pixel against the body in any frame;
- a figure that dissolves into busy.png or #3a3129 at 1x.
Redo weak files rather than describing them. Do at least one full revision pass after your first lineup.

## 5. Output (all under out/)
```
out/body/man.png  out/body/woman.png
out/feature/elf-ears.png  out/feature/horns.png
out/outfit/labourer.png  outfit/ranger.png  outfit/mage.png  (+ outfit/<name>@woman.png variants)
out/hair/short.png  hair/long.png  hair/braid.png   out/beard/full.png
out/head/hood.png   out/held/staff.png
out/lineup.png  out/turn.png  out/walk.png  out/walk.gif  out/swatch.png
out/ramps.json  out/NOTES.md  out/src/{template,compose,check}.py
```
Each layer: 128x192, 4 columns (walk frames) x 4 rows (down, left, right, up). Composites as SPEC.md says:
lineup = 4 strips (1x on #7a7a7a, 1x on #3a3129, 4x on #7a7a7a, 4x on #3a3129), 8 px gap between
characters; turn = character 1, 4 directions, 4x; walk = characters 1 and 2, 4 down frames, 4x, and
walk.gif with the same frames at 4x on #7a7a7a, 160 ms per frame, looping; swatch = character 2 in all 6
skin tones and character 1 in all 8 hair colours, 2x. Use nearest-neighbour scaling only.
NOTES.md: the direction in one paragraph, the ramps (or a pointer to ramps.json and any changes you made),
the check.py output, honest weaknesses, and what the layer system made hard (e.g. hair over elf ears).
