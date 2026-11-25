# BRIEF: "Late Sun Gouache" layered town figures

Read SPEC.md first (what the sample must contain), then CODEX-WORKFLOW.md (background only). This brief is your
art direction and method; where it is more specific than SPEC.md, follow it. Never open, copy or build on any
existing sprite: nothing under art-drop/, packages/client/public/hd2d/, or any other PNG/GIF you did not make in
this run. Do not imitate any commercial game's characters. Work only in this folder: scripts in src/,
intermediates in scratch/, deliverables in out/.

## 1. The direction

Painterly modern pixel art, lit by the same late-afternoon sun as the 3D town. No black outline anywhere.
Every shape is carved by value and hue: warm peach-gold light from the upper left and front, cool violet-slate
shadow on the right, and a thin warm rim of light from behind that catches the right-hand contour of the head,
hair and shoulders. Shadows are never grey or black; they lean violet. Half-tones (the terminator between light
and shadow) are the most saturated band, as in gouache. Lights lean yellow. The figures feel like small painted
people standing in sunlight: calm, grounded and adult, with a little weight in the hands and boots. They should
not look chibi or cartoon.

Light is fixed in SCREEN space for all four directions: key light from the upper left, rim from behind on the
right. The right-facing row is NOT a colour mirror of the left row. Mirror the left row's shape/label map, then
shade it again with the same light (see section 3).

### Proportions (32x48 frame, feet on row 47)
- Both bodies are 44 px tall (rows 4..47), about 4 heads tall. **The head box and neck are identical on man and
  woman** (same pixels, same place) so that every hair, beard, ear, horn and hood layer fits both bodies. Builds
  differ only from the shoulders down.
- Frame centre line runs between x=15 and x=16. Down view starting skeleton (adjust by 1 px only if a part reads
  better):
  - Head x 11..20 (10 wide), y 4..14 (11 tall). Neck x 14..17, y 15.
  - Man: shoulders x 9..22 at y 16; torso x 10..21, y 16..27; arms 2 px wide outside the torso, y 17..27;
    hands 2x2 at y 28..29; hips x 11..20; legs 4 px wide (x 11..14 and 17..20), y 30..45; feet y 46..47, 5 px
    wide, toes turned slightly out.
  - Woman: shoulders x 10..21; waist x 12..19 at y 23..24; hips x 11..20 at y 27..29; arms 2 px wide;
    legs 3-4 px wide; same feet rows.
- Left view: head 9 wide, face pointing left with a 1 px nose bump past the face line; torso 7-8 wide; only the
  near arm drawn fully, far arm a 1 px sliver of shade 0 behind. Up view: same silhouette as down, no face.
- Walk (down only, 4 frames): f0 = stand; f1 = left stride; f2 = passing (stand, body 1 px up); f3 = right stride.
  In a stride the forward foot sits 1 px lower and wider, the trailing foot lifts 1 px (a planted foot always
  stays on row 47), and the arm opposite the forward leg swings forward (hand 1 px lower and 1 px inward). Every
  layer reads the same per-frame offsets from one skeleton table so hair, hood and staff bob with the head.

### Pixel rules
- **Outline:** none in a dark colour. The silhouette edge is a ramp shade of the region itself: left and top edges
  use shade 3 (lit), right and bottom edges use shade 0. On the upper body (head, hair, shoulders, upper arm) the
  right contour is `... 1, 0, 4`: core shadow one pixel in, then a 1 px rim of shade 4 on the very edge. Below the
  waist there is no rim; the right edge is shade 0, and from the knees down the left edge drops to shade 2. This
  gives each figure a bright head and shoulders, a dark grounded base and a light edge, so it stands off both
  bright and dark ground without an outline.
- **Shades:** 5 per recolourable ramp (0 = core shadow/occlusion, 1 = shadow, 2 = half-tone/terminator,
  3 = lit, 4 = rim and sun-kiss). Iris ramp has 3. Shade 4 is sparse, at most about 10% of a region's pixels, and
  only on the rim, the crown of the hair, and the top edge of shoulders, ears and horn curves. Shade 0 marks
  occlusion: under the jaw (the whole neck row is skin 0), under the hair line, the armpit, under the belt and
  sash, between the legs, and under the hood brim.
- **Form shading:** each part is a cylinder lit from the left. Across a part's width (u from 0 at its left edge to
  1 at its right edge): u < 0.5 -> 3, 0.5..0.7 -> 2, 0.7..0.9 -> 1, last column -> 0 (plus the rim rule above).
  Then darken the whole lower body one band: hips and thighs cap at 2, shins and feet cap at 1 on the lit side.
  NO pillow shading (concentric bands following the outline). NO dithering. NO single-pixel noise. Shade
  changes come in clusters of 2+ pixels, except on purpose (eyes, nose, mouth, a 1 px glint).
- **Faces (down view):** eyes are 1x2 px each at x=14 and x=17, rows y 9..10. The top pixel is iris 0 (shadowed by
  the lid) and the bottom pixel is iris 1, except the lit-side eye (x=14), whose bottom pixel is iris 2. No eye
  whites and no black pupils. Brows: 2 px of skin 1 on row 8 above each eye (x 13..14 and 17..18). Nose: one
  pixel of skin 3 at (15,11) with skin 1 at (16,11), the nose's shadow falling right. Mouth: 2 px of skin 1 at
  (15..16, 13). Jaw: skin 1 down the right of the jaw, skin 0 on row 15 under the chin. The face must look calm
  and adult, with eyes level and the same size.
- **Faces (left view):** one eye, 1x2, 2 px behind the face front, iris 0 over iris 2 (it faces the light). Nose
  bump 1 px of skin 3, mouth 1 px of skin 1, ear hinted by a 2 px skin 1 notch at the back of the head. Up view:
  no face; the back of the head is skin (bald) on the body layer, and hair covers it.
- **Hands and feet:** hands are 2x2 skin clusters, lit pixel top-left (skin 3), the rest skin 2/1. No fingers. A
  hand holding the staff is 2 px wide, and the staff passes behind its top row. Feet and boots are 5x2: top row
  lit 3-4 px plus a shade 1 heel, bottom row shade 0 plus a 1 px toe highlight. Row 47 under each foot uses the
  fixed `deep` colour (soles), which is the only place `deep` touches the silhouette edge.
- **Hair clusters:** hair is built from 3-6 px tapered locks, not strands. Each lock has a lit run (3) on its
  upper-left side, its body in 2, and its right side in 1. Shade 0 sits in the partings between locks and under
  the fringe. Across the crown at upper left runs a broken highlight arc: a 3-5 px run of 3 with 1-2 px of 4, as
  sun on the curve. Tips taper to a single pixel of shade 1. The fringe stops above the eyes (it may touch row 8).
  Short hair hugs the skull (at most 1 px beyond the head box at ear height). Long hair widens only below the jaw
  and falls behind the shoulders, with one front lock per side. The braid is 3 px wide, with alternating 2-px
  diagonal segments (3/2 then 2/1) and a cloth B tie of 2 px.
- **Ears and horns vs hair:** hair is stacked above ears and horns. At rows y 8..11, hair must stay within 1 px of
  the skull so the elf ears (skin ramp, 4-5 px long, rising outward at about 30 degrees, lit top edge 3/4, under
  side 1) clearly pierce the hair. Horns (fixed horn ramp) rise from the temples, curve back and out, and
  clear the hair silhouette by at least 4 px. Ivory tips sit on top, with deep ridges every 2 px.
- **Cloth folds:** at most 3 folds per garment per view, each one a diagonal 2-3 px run of shade 1 that starts at
  a tension point (belt, armpit, knee, sash knot), with a 1 px shade 3 lip on its upper-left side. Hems and trims
  are cloth B. The robe flares into a 1 px lighter hem band and a shade 0 underside. The open cloak shows a 2 px
  dark inside edge (cloth A 0) where the front opens, with the leather jerkin visible in the gap.
- **Job silhouettes at 1x:** labourer = short tunic, a clear leather belt, rolled sleeves (forearm skin shows),
  sturdy boots, and for the woman a calf-length skirt. Ranger = cloak wider than the shoulders with a pointed
  hood lying on the back, leather jerkin and bracers, tall boots. Mage = long robe to the ankles, a wide cloth B
  sash with a hanging end, deep sleeves that hide the hands to the knuckle. Hood (head/hood.png, hood up): a deep
  pointed cowl in cloth A, shading the forehead to row 8 with a shade 0 brim band that leaves the eyes visible.
  Staff: 2 px wood shaft, as tall as the head top plus 3 px, with a forked crown holding a 2 px gem.

## 2. Ramps (darkest first; put exactly these in out/ramps.json)

Source ramps. Draw recolourable regions ONLY in these, and never use them anywhere else:
```
skin    #5a3a4a #8f5a55 #c4846a #e6b08a #fbdcb4
hair    #3a2a3e #5e3e45 #8a5a48 #b78258 #e0b27a
eyes    #3a2a5a #6a4a9a #9a7ac8
cloth_a #22243e #34406a #4c6496 #7a94b8 #d0d6c4
cloth_b #2e2228 #54383a #84583e #b48a52 #e8c88a
```
Fixed colours, never recoloured (store under "fixed" in ramps.json):
```
linen   #4a3e4a #8a7a78 #c8b8a0          (body underclothes)
leather #2e1e26 #523428 #7c5236 #a87c50  (belts, boots, jerkin, bracers, body shoes)
wood    #262026 #4a3a30 #74603e #a48e5e  (staff)
metal   #3a3e50 #7a8494 #d8dce0          (buckles, clasps)
horn    #2a2230 #5a4a4e #9a8a7a #e0d4b8
gem     #3a6aa0 #bff0ff
deep    #241c2c                          (soles, horn ridges, the gap between legs only)
```
Targets:
```
skin (list order: very light, light, medium, brown, very dark, fantasy grey-green)
  #6b4a5c #a9767a #dca596 #f4cdb6 #fff0dc
  #5e3d4e #9a6260 #cf9273 #edbd96 #fde3bf
  #4e3140 #7d4c45 #b47a56 #d9a271 #f2c994
  #3a2433 #643a3a #925c45 #bd8459 #e0b07c
  #241826 #402430 #643c38 #8c5a44 #b98763
  #2c3340 #48585a #6f8676 #9bb193 #cfe0b8
hair
  black    #151424 #232538 #353a52 #50586e #8a93a8
  brown    #2a1f2e #45303a #6a4838 #8f6845 #c09a6c
  chestnut #2e1a2a #552a32 #84402f #ad6538 #d99a5c
  blond    #5a4a4a #8a7458 #c0a265 #e3ca80 #fff0b8
  red      #3a1a2e #6c2638 #a83c32 #d8653a #f5a05a
  grey     #3a3a4c #5c5e70 #858a96 #b0b3b8 #e0ded8
  white    #6a6c86 #9a9db2 #c8cad6 #e8e8ee #fffbf0
  violet   #2a1f44 #4a3070 #7448a0 #a274c8 #d4b0ec
eyes
  brown #2e1a1a #5a3424 #86563a   hazel #3a2e1e #6e5a2c #9a8a48   green #1e3428 #2e6a40 #5aa060
  blue  #1e2a4a #2e5a9a #5a9ad0   grey  #2e3440 #5a6474 #8a96a4   amber #4a2a12 #9a6418 #d8a030
cloth_a
  madder #3a1a30 #6a2638 #9c3a3a #c8644a #f0a878
  moss   #1e2a2e #2e4a3a #4a6e44 #7a9a5a #c4d08c
  oat    #3e3440 #66585a #948068 #c0a884 #ece0bc
  indigo #1e1a38 #362a5c #54408a #8064aa #c4a8d0
cloth_b
  ochre  #3a2a22 #6a4a2a #a0782e #d0a840 #f4dc8c
  teal   #142a34 #1e4a52 #2e7070 #58a090 #a8d8b8
  rust   #3a1a22 #6a2e26 #a04a2a #d07a3a #f6b870
  slate  #1e1e2a #34364a #525870 #7c8494 #c0c4c4
```
ramps.json shape: `{"source": {"skin": [...], "hair": [...], "eyes": [...], "cloth_a": [...], "cloth_b": [...]},
"fixed": {...}, "targets": {"skin": [[...] x6], "hair": {"black": [...], ...}, "eyes": {...}, "cloth_a": {...},
"cloth_b": {...}}}`. Your checker must assert that every source colour is unique across source and fixed. You may
nudge a hex by a few points only if a check fails, and you must list each change in NOTES.md.

Lineup colourways: char 1 ranger cloth_a moss + cloth_b ochre; char 2 labourer oat + rust; char 3 mage indigo +
ochre; char 4 labourer madder + slate; char 5 mage madder + ochre with an oat hood; char 6 ranger moss + teal.
Char 4 uses the fantasy skin tone. Beards use the hair ramp and take the character's hair colour.

## 3. Drawing method: native Python/Pillow, procedural from one skeleton, then hand-placed accents

Do NOT use the image tool and do not quantise a downscaled painting. Downscaling smears faces, cannot keep
5-shade cylinder lighting, and cannot keep layers pixel-aligned. Draw every pixel in code, at 32x48, in three
passes per layer:

1. **Label map.** One skeleton table (src/skeleton.py) holds every part's rectangle or polygon per body, per
   direction and per walk frame (head, neck, torso, upper and lower arms, hands, hips, legs, feet). Each layer
   builds a 32x48 label grid of named regions from that table: the outfit is "torso grown by 1 px + sleeves
   along the arm parts + skirt/robe polygon from the hips"; the hood is "head box grown by 1-2 px + point"; and so
   on. Small authored shapes (face, hair locks, ears, horns, folds, buckle, staff crown) are ASCII stamps in
   src/stamps.py, placed at skeleton anchors. Because every layer reads the same anchors, layers line up by
   construction.
2. **Shade.** Turn labels into ramp indices with the cylinder rule and the edge/rim rules in section 1, computed
   per part. Write the RGBA with exact ramp hex values only, with alpha 0 or 255.
3. **Accents.** Apply the hand-authored override stamps last (eyes, brows, nose, mouth, fold lips, hair partings,
   crown highlight, toe glints). Then run a cleanup that turns any isolated same-ramp pixel into its neighbours'
   majority shade, but never touches a face stamp.

Right-facing row: mirror the LEFT row's label map and stamps, then run passes 2-3 with the same light from the
left. Covered parts: each layer removes nothing from below it, but the outfit must fully cover the body's
underclothes wherever the garment is (draw the garment region as a superset of the linen region). Hair over the
collar is allowed. Unused cells (walk frames of left/right/up) repeat the standing frame, as SPEC.md allows.

Compose (src/compose.py): for each layer, map source hex -> target hex for that layer's ramps (exact dict
lookup; skin ramp on body and ears, eyes on body, hair on hair and beard, cloth on outfit and hood), then
alpha-composite in SPEC order. Scale only with NEAREST.

## 4. Self-check (run all of it, look at every image, redo weak files, repeat)

Write src/check_figs.py. Do not use px.py's palette checks: px.py loads a ramps.json in the old format from its
own folder at import, so it will not run as is here. You may copy its lone-pixel logic. The checker fails if:
- a sheet is not 128x192 RGBA, or any alpha is not 0 or 255;
- a layer uses a colour outside its allowed set (body: skin, eyes, linen, leather, deep; ears: skin; horns: horn,
  deep; outfits: cloth_a, cloth_b, leather, metal, deep; hair and beard: hair, plus cloth_b for the braid tie;
  hood: cloth_a, cloth_b; staff: wood, metal, gem), or any colour darker than `deep` or equal to #000000;
- a body cell's bbox is not exactly 44 tall with its bottom on row 47, or its centre is off 15.5 by more than 1;
- the man and woman head and neck pixels differ in any direction or frame;
- lone pixels (no 4-neighbour of the same colour) are over 3% of a layer, not counting the face stamps;
- in any lit region, shade 4 is over 12% of its pixels or shade 0 is under 6%.

Then render scratch/ views and LOOK at them at 4x (and the lineup at 1x):
- every layer alone on #7a7a7a, a frame grid at 4x;
- the lineup and turn composited on a busy test ground you generate (procedural warm cobbles in browns and greys
  with moss flecks, noisy at 1-2 px), and the same image converted to greyscale.

Failures to fix (redo the file, do not explain them away):
- the face reads wrong: eyes at different heights or sizes, a missing mouth, a nose off-centre, a vacant or
  cartoon stare, or the down face looking sideways;
- smeared or noisy clusters, pillow shading, banding (parallel stripes of equal width), or jaggy curves with
  uneven steps (1-2-1-3);
- light from the wrong side anywhere, especially the right-facing row;
- misaligned layers: a gap between hair and scalp, a floating hood, a collar offset, a hand off the staff,
  ears or horns hidden by hair, or underclothes showing through an outfit;
- at 1x on the cobbles, the job (labourer, ranger or mage), the hair shape, the ears or horns, or the face
  direction cannot be told at a glance, or in greyscale the figure does not separate from the ground (if the
  legs vanish on #3a3129, lift the lower-body left edge one shade and check again);
- walk: a foot slides, a limb changes thickness between frames, a layer does not bob with the body, or the gif
  stutters (use 160 ms per frame, looping);
- a recolour shows a stray source colour, or a target ramp looks muddy or loses its hue shift in the swatch.

## 5. Output (exactly this, under out/)

```
out/body/man.png  out/body/woman.png
out/feature/elf-ears.png  out/feature/horns.png
out/outfit/labourer@man.png  out/outfit/labourer@woman.png   (woman gets a skirt)
out/outfit/ranger@man.png    out/outfit/ranger@woman.png
out/outfit/mage@man.png      out/outfit/mage@woman.png
out/hair/short.png  out/hair/long.png  out/hair/braid.png
out/beard/full.png
out/head/hood.png
out/held/staff.png
out/lineup.png   six characters (SPEC order), facing down, standing: 1x on #7a7a7a, 4x on #7a7a7a,
                 1x on #3a3129, 4x on #3a3129, one band each, 8 px gaps
out/turn.png     character 1, down/left/right/up, 4x
out/walk.png     characters 1 and 2 walking down, 4 frames each, 4x; out/walk.gif the same, animated
out/swatch.png   character 2 in all 6 skin targets; character 1 in all 8 hair colours; 2x
out/ramps.json
out/NOTES.md     direction paragraph, ramp table, colourways used, honest weaknesses, what the system
                 made hard (for example the shared head box, or relighting the mirrored row)
```
Each outfit is drawn per body because the builds differ; if one sheet truly fits both, you may also save it
without the suffix. Scripts stay in src/ and scratch images in scratch/, not in out/. Finish only once the
checker passes with zero failures and every visual check above holds.
