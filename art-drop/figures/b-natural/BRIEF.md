# BRIEF: "Woad & Walnut" — naturalistic town figures (style sample)

Read SPEC.md first; it says WHAT to deliver. This brief says HOW it must look and how to make it.
CODEX-WORKFLOW.md is background only. Rules that override everything:
- Do NOT open, search for, or copy any existing sprite or image (nothing under art-drop/,
  packages/client/public/hd2d/, or anywhere else). Don't search the web for sprites. Work from this brief.
- px.py loads an OLD palette (it reads a ramps.json beside it). Do not use its palette checks or `quant`.
  Copy its generic ideas (alpha, lone pixels, bbox) into your own `tools/check.py` (section 5).
- Work only in this folder: code in tools/, throwaway previews in scratch/, deliverables in out/.

## 1. The direction

Ordinary people of a market town, painted as if by a patient miniaturist: the weight and plain wool of
Bruegel's peasants, the clean dyed colour fields of a Book of Hours "labours of the months" page, and the
single warm window-light of Dutch genre painting. Figures are tall and grounded (about 4.9 heads), stand
with weight on their feet, and wear clothes that were cut, sewn and belted: you can see the seam, the hem,
the cinch of a belt and the cloth layered over cloth. Colour is muted and earthy, named after medieval dyes
(woad, madder, weld, walnut, oak-gall, undyed fleece). Light always comes from the top-left and slightly in
front, warm in the lights and cool-brown in the shadows. Nothing is cute, nothing is chibi, nothing is
glossy. The test: a figure should look like a real person seen from a balcony, not a toy.

What makes it ours (keep all of these):
1. Real proportions: head 9 px tall on a 44 px body; legs are ~40% of height; hands at mid-thigh.
2. A closed silhouette with a TWO-COLOUR outline: dark umber on the shadow side, the region's own
   darkest shade on the lit side. Inside the figure there are no black lines, only value changes.
3. Value structure top-to-bottom: lightest values on head, hair crown and shoulders; darkest at boots.
   The figure reads like a lamp-lit form standing on mid-value ground.
4. Construction details at 1 px: centre seam, hem line, belt with buckle, cuffs, cloak lining showing
   at the front opening, sash knot with hanging ends. Max 3 such details per garment per view.
5. Restraint: 4 shades per ramp, highlights are rare (≤15% of a region), no dithering, no noise texture.

## 2. Pixel rules at 32x48

Sheet: 128x192, columns = walk frames 0..3, rows = down, left, right, up. Cell (c,r) origin = (32c, 48r).
Centre axis lies between x=15 and x=16; the down and up views are symmetric about it (except shading).

Shared skeleton (DOWN view, standing). BOTH bodies use the same vertical landmarks so every hair, hat,
beard and feature fits both bodies without variants. The man is broader; the woman is narrower at shoulder
and waist with a softer jaw. (Height difference is given up for the system; say so in NOTES.)

| landmark | rows (y) | man x | woman x |
|---|---|---|---|
| hair crown top (hair layer) | 3 | 12-19 | 12-19 |
| skull top (body) | 4 | 13-18 | 13-18 |
| head | 4-12 | 12-19 | 12-19 (chin row 12: 14-17) |
| brow / eyes / nose / mouth | 7 / 8 / 9 / 11 | see Faces | see Faces |
| human ears | 8-9 | 11 and 20 | 11 and 20 |
| neck | 13-14 | 14-17 | 14-17 |
| shoulder line | 15 | 9-22 | 10-21 |
| waist (belt) | 25-26 | 11-20 | 12-19 |
| hips / crotch | 27-29 / 30 | 11-20 | 11-20 |
| arms (hanging, 3 px / 2-3 px) | 16-28 | 8-10, 21-23 | 9-10, 21-22 |
| hands | 29-31 | 8-10, 21-23 | 9-10, 21-22 |
| knees | 37-38 | | |
| legs | 30-45 | 12-15, 16-19 | 12-15, 16-19 |
| feet (row 47 = sole) | 46-47 | 11-15, 16-20 | 12-15, 16-19 |

Height with hair = 45 px (rows 3-47). LEFT view: same rows; profile head x 12-19 with a 1 px nose at
x 11 y 9, eye at x 13, ear at x 17, torso 8 px deep (x 12-19), near arm over the torso. UP view: mirror
of DOWN's silhouette, no face, neck and back of head. RIGHT view: mirror LEFT's pixels, then RE-SHADE so
the light still comes from the top-left (do not ship mirrored lighting; since you draw in index space,
re-run the shading pass with the same light).

**Outline.** Every opaque silhouette edge pixel of a layer is an outline pixel inside the layer's shape:
- On edges facing right or down (shadow side, and the bottom of every form): umber `#1e1614`.
- On edges facing left or up (lit side): shade 0 (darkest) of the ramp of the region it bounds.
- Where a layer's edge lies over the body silhouette (hair over forehead, tunic hem over trousers, beard
  over chin), it is not an outline: use that layer's shade 0 as a 1 px contact shadow, never umber.
- No internal black lines. Separate limbs from torso with a 1 px shade-0 gap, legs with a 1 px gap.
- Lines are clean: diagonal steps are even (1-1-1 or 2-2-2), never 1-3-1 kinks; no doubled corners.

**Shading** (4 shades, index 0 deep, 1 shadow, 2 base, 3 light; eyes/metal/linen/horn have 3).
- Light from top-left, slightly frontal. Base (2) fills ~55% of a region, shadow (1) ~25% as a 1-2 px band
  down the right side and under every overhang, deep (0) ≤10% for occlusion only (armpits, between legs,
  under belt, under chin, inside hood), light (3) ≤15% on top-left planes only (crown, left shoulder top,
  left forearm, left cheekbone, top of left thigh).
- No pillow shading (dark ringing a form on all sides). No banding (shade strips parallel to the outline).
- Light clusters are ≥2 px. No dithering, no single-pixel noise; lone pixels only for eyes and buckles.

**Faces and eyes** (down view, head x 12-19):
- Eyes: one pixel each at (14,8) and (17,8), on the same row, 2 px apart (nose bridge x 15-16 between).
  The lit-side eye (14,8) uses eyes[2], the shadow-side eye (17,8) uses eyes[1]. No whites, no outlines.
- Brow: skin[1] pixels above the eyes on row 7 (man: x 13-14 and 17-18; woman: only x 13 and 18).
- Nose: one skin[1] pixel at (16,9) (shadow side of the nose). Cheek light: skin[3] at (13,9)-(13,10).
- Mouth: skin[1] at x 15-16, y 11. Never a smile or frown curve: neutral and calm.
- Jaw: man has a skin[1] column at x 19 rows 9-12 and a squarer chin; woman's chin narrows (row 12 x 14-17).
- Under chin and neck top: skin[0] on row 13. Profile: eye eyes[1] at (13,8), brow skin[1] above it,
  nose 1 px at (11,9), mouth 1 px skin[1] at (12,11), chin at x 12-13 row 12.

**Hands and feet.**
- Hand (down): 2 wide x 3 tall (man 3x3): top-left skin[3], rest skin[2], right column bottom skin[1].
  A 1 px cuff line (garment shade 0) sits directly above every hand. Hands never merge into the hip.
- Body feet are bare: 4-5 px wide x 2 tall, skin, toes not drawn, outer toe 1 px wider (feet turned out).
- Shoes/boots (outfit layer, leather): toe cap leather[3] at its top-left pixel, sole row 47 umber,
  boot tops 1 px leather[0] line. Both feet touch row 47 when standing.

**Hair clusters.** Hair is 3-5 clumps, not a helmet. Each clump: base hair[2]; a broken crest of hair[3]
(1-3 px strokes) on its top-left; partings between clumps in hair[1]; deepest pockets in hair[0];
tips taper to a single pixel pointing down. A visible parting on the crown. The fringe never goes below
row 6 (forehead rows 6-7 stay visible). Hair never extends past x 10 / x 21 in rows 5-10, so elf ears show.
- short: cropped, clumps over the ears, nape at row 13.
- long: frames the face (x 11-12 and 19-20), falls behind the shoulders to row 26 (visible in up view),
  1 px sway opposite the step in walk frames 1 and 3.
- braid: single braid over the figure's right shoulder (viewer's left, lit side), rows 13-27, alternating
  2x2 lobes hair[2]/hair[3] with hair[1] notches, tie in hair[0], tapering tuft below.
- beard/full: jaw rows 10-14, x 12-19, moustache row 10 in hair[1], mouth gap hair[0] at x 15-16 row 11,
  lit on the viewer's left, chin down to row 14.

**Cloth folds and construction.**
- Folds are 1 px lines of shade 1 radiating from tension points (belt cinch, elbow, knee, sash knot), each
  with a shade 3 or 2 lit edge on its upper-left side. 2-3 folds per garment per view, never more.
- Seams: centre-front seam line (shade 1); shoulder seam; hem = a shade 0 row with a shade 3 pixel or two
  on the lit side just above it. Belt: 2 rows leather[1]/leather[2], buckle 2x2 metal at x 14-15.
- labourer (man): knee-length wool tunic (cloth A) belted at waist, sleeves pushed to the elbow (forearms
  skin), trousers (cloth B) with a hem, leather turnshoes. labourer@woman: ankle-length kirtle (cloth A),
  linen apron (cloth B) tied at the waist, sleeves pushed up, shoes peeking under the hem.
- ranger: leather jerkin (leather) over a shirt (cloth B), hooded cloak (cloth A) open at the front so the
  jerkin shows, its lining (cloth B) visible as a 1 px strip along each front edge, hood DOWN bunched at the
  nape, belt with pouch, bracers, boots to mid-shin. Cloak hem sways 1 px in walk frames 1 and 3.
- mage: floor-length robe (cloth A) with wide bell sleeves (hands showing), sash (cloth B) tied at the
  figure's left hip with two hanging ends, a deep shade 0 fold from knot to hem, hem touching row 46.
- ranger and mage are one sheet each that covers both bodies (draw over the union silhouette); test both.
- head/hood: a period hood with shoulder cape (gugel) in cloth A, face opening x 13-18 rows 6-12, inner
  rim shade 0, cape over shoulders to row 18, short tail (liripipe) hanging behind in left/right/up views.
- held/staff: walnut staff 2 px wide (wood ramp, left column lighter), rows 5-47, in the figure's right
  hand (viewer's left in down view), knotted top with an iron ring, iron ferrule at the foot. Leave the
  staff transparent where the fingers wrap (the hand's middle row) so the hand reads as gripping it.
- feature/elf-ears: from the head side at rows 8-9, swept up and back to a tip at about x 7 / x 24 row 5;
  2 px thick at the base, 1 px tip; skin ramp; in profile one ear points back-up. Must read at 1x.
- feature/horns: from the temples (x 13 / x 18, row 5), rising and curving outward and back like a ram's
  sweep, tips near row 1; 2 px thick tapering to 1; horn ramp with a horn[0] ridge notch every 2 px on the
  shadow side. In profile one horn shows its full curve over the skull.

**Walk (down).** Frame 0 = standing. Frames 1 and 3: one foot planted on row 47, the other lifted (bottom
at row 46, 1 px shorter), body from hips up drops 1 px, arms swing opposite to the legs (forward hand 1 px
lower and 1 px wider, back hand 1 px higher). Frame 2 = passing, like frame 0 but the hands at rest.
All layers read the same per-frame offsets from the skeleton, so nothing slips.

**Standing out from busy 3D ground.** The closed two-colour outline, the light head/shoulder zone
against darker legs, the 1 px gaps between limbs, and no ramp lighter than about #f0 (bloom will lift it).
Test this (section 5) on a busy textured background, not only on flat grey.

## 3. Ramps (exact hex, darkest first; copy into out/ramps.json)

Every source colour and fixed colour must be unique across all of them (assert it in code).
```json
{
 "source": {
  "skin":   ["#5a3a2e","#95634a","#c48d6c","#e0b392"],
  "hair":   ["#3a2619","#5e3f27","#85603a","#a8834f"],
  "eyes":   ["#1b1620","#3e2c22","#6a4c30"],
  "clothA": ["#3a1f1c","#66352b","#8e5240","#b07658"],
  "clothB": ["#2f3328","#4f5841","#737f5c","#9aa47c"]
 },
 "fixed": {
  "outline": ["#1e1614"], "leather": ["#2e1f17","#4f3424","#74502f","#9a7244"],
  "wood":    ["#33261d","#5a4431","#826649","#a88b64"], "metal":   ["#3b3a3d","#6e6b66","#a9a296"],
  "linen":   ["#6f665a","#a09684","#cbc1a9"], "horn":    ["#3d3530","#75685a","#b1a28a"]
 },
 "targets": {
  "skin": [
   ["#6b4a40","#b07f6c","#e2b9a0","#f2dac4"],
   ["#634234","#a46f55","#d9a585","#eec7a6"],
   ["#563526","#8e5b3e","#bd8458","#d9a678"],
   ["#3e251b","#6e4330","#9a6444","#bf8a62"],
   ["#1f1411","#3b241b","#5c3a2a","#7f5541"],
   ["#2c3530","#4f5f50","#77886f","#a3ae8f"]
  ],
  "hair": {
   "black":    ["#141215","#24202a","#3a3440","#57505c"], "brown":    ["#2a1b14","#4a3121","#6b4a31","#8c6845"],
   "chestnut": ["#2e1610","#5a2a18","#844222","#a8653a"], "blond":    ["#5e4a2a","#94773f","#c2a35e","#e0c98a"],
   "red":      ["#3d1610","#73291a","#a8442a","#d06c3e"], "grey":     ["#3c3a3a","#66625e","#928c84","#bdb6aa"],
   "white":    ["#6e6c6c","#a3a09a","#cfcbc2","#ece8de"], "dusk":     ["#2a2238","#463a5c","#6b5c84","#9486a8"]
  },
  "eyes": {
   "brown": ["#1a120e","#3e2617","#6b4528"], "hazel": ["#22200f","#5a5226","#8f7d3c"],
   "green": ["#12201a","#2f5a3a","#5c8a55"], "blue":  ["#121a2a","#2f5478","#6a92b4"],
   "grey":  ["#1e2226","#5a6670","#96a2a8"], "amber": ["#2a1606","#8a5a18","#c89030"]
  },
  "clothA": {
   "fleece": ["#3b342b","#645a4b","#8d826d","#b3a88f"], "woad":   ["#1e2433","#34425a","#52668a","#7b8fae"],
   "madder": ["#3a1a18","#682c25","#93443a","#b46a58"], "walnut": ["#2b1e16","#4a3526","#6c513a","#8f7356"]
  },
  "clothB": {
   "weld":    ["#2a3022","#48533a","#6c7a52","#929e72"], "oakgall": ["#26272a","#424448","#63666a","#8a8c8c"],
   "ochre":   ["#3e2c14","#6e5225","#9c7a3a","#c0a25c"], "linen":   ["#5a5648","#8a8470","#b5ad94","#d8d0b4"]
  }
 }
}
```
Skin targets are ordered very light, light, medium, dark, very dark, fantasy (grey-green). Allowed colours
per layer: body = skin, eyes, linen (plain shift/braies underclothes), outline. elf-ears = skin, outline.
horns = horn, outline. outfits = clothA, clothB, leather, metal, outline. hair/beard = hair, outline.
hood = clothA, clothB, outline. staff = wood, metal, outline. eyes[0] is not drawn in this sample.
If very dark skin hides the brow/mouth, or an eye colour vanishes on a skin, adjust THAT target ramp
(not the source), keep the hue family, and record the change in NOTES.

Lineup colourways (earthy, period-true): 1 walnut cloak / weld lining; 2 madder tunic / oakgall trousers;
3 woad robe / linen sash; 4 fleece tunic / ochre trousers; 5 walnut robe and hood / ochre sash;
6 fleece cloak / weld lining.

## 4. Drawing method: native Python/Pillow, in index space, from one skeleton

Draw every pixel in code at 32x48. Do NOT use the image tool for the sprites, and do NOT downscale or
quantise anything: a downscale smears faces, invents off-ramp colours, and cannot keep layers aligned
pixel for pixel. Code-drawn work is what gave exact palettes and crisp shapes before.
1. `tools/skeleton.py`: landmarks for (body, direction, frame) from the table above, including per-frame
   walk offsets. Every layer reads positions from here; no layer hard-codes its own copy.
2. Draw in INDEX space: each pixel is (ramp, shade) or empty, never RGB. Draw the body first; then draw
   every other layer against the body's silhouette mask (cover it where intended, contact-shadow where it
   overlaps, outline where it leaves it).
3. Each layer = base shapes (polygons/rows of spans) + an automatic light pass (top-left neighbours empty
   -> candidate light; right/bottom -> shadow) + an explicit list of hand-placed pixels per direction for
   faces, folds, seams, buckles, clumps. Hand fixes live in code, never as edits to PNGs, so a rerun keeps
   everything aligned.
4. Outline pass last per layer (rules in section 2), then render indices to source hex and save RGBA with
   alpha 0 or 255 only. Right = mirror of left + re-shade.
5. `tools/compose.py`: stacks layers bottom first, recolours by exact source->target hex map per ramp,
   builds lineup/turn/walk/walk.gif/swatch. `tools/build.sh` (or one script) regenerates everything.

## 5. Self-check (run all before finishing; redo any weak file and check again)

Automatic, `tools/check.py` (print a table; every line must pass):
- every layer PNG is 128x192 RGBA, alpha only 0/255, unused cells fully empty;
- every opaque colour is in that layer's allowed set (section 3); source + fixed colours all unique;
- body cells: bottom of bbox = row 47, height 44 (45 with any hair), bbox centre within 1 px of x 15.5;
- lone pixels per layer < 3% (excluding eye and buckle pixels);
- no floating pixels: every 4-connected component of a layer touches the body silhouette dilated by 1
  (staff: the hand) when composed;
- composites contain no source colour (everything recoloured); outfit and hair sit on BOTH bodies.

By eye (write zooms to scratch/ with nearest-neighbour; open and actually look at each):
- every layer sheet at 4x; lineup at 1x and 4x; turn and walk at 4x; the gif plays smoothly.
- Make scratch/busy.png: a 256x96 field of irregular warm-grey cobbles with mortar and moss specks in
  mid values, plus a darker lamp-lit night version; paste the lineup on it at 1x and 2x.
Fail (redo) if any of these is true:
- a face is wrong: eyes uneven, on different rows, touching hair, or the face reads as a blob or a mask;
- at 1x on busy.png you cannot tell at a glance the facing, the hair, labourer vs ranger vs mage, the ears
  or horns, or where the figure ends;
- light is not from the top-left anywhere (check the RIGHT row especially), or pillow shading/banding;
- hands are blobs, merge with hips or sleeves, or feet float off row 47; walk slips a layer by a pixel;
- more than 3 folds/details per garment view, folds without a lit edge, noise or dither;
- proportions drift: head bigger than 9 px tall, figure stocky or chibi, legs shorter than the torso;
- any swatch variant looks wrong (very dark skin features vanish, white hair looks grey-dull, fantasy tone
  looks like a mistake) or any pixel failed to recolour;
- clothing reads as costume, not as sewn garments (no belt cinch, no hem, cloak not visibly open).

## 6. Output (everything under out/)

```
out/body/man.png         out/body/woman.png
out/feature/elf-ears.png out/feature/horns.png
out/outfit/labourer.png  out/outfit/labourer@woman.png  out/outfit/ranger.png  out/outfit/mage.png
out/hair/short.png       out/hair/long.png              out/hair/braid.png
out/beard/full.png       out/head/hood.png              out/held/staff.png
out/lineup.png  out/turn.png  out/walk.png  out/walk.gif  out/swatch.png  out/ramps.json  out/NOTES.md
```
- lineup.png: the six SPEC characters, facing down, standing; 1x row and 4x row on #7a7a7a, then the same
  on #3a3129; 8 px gaps. turn.png: character 1, down/left/right/up, 4x. walk.png: characters 1 and 2,
  4 down frames, 4x; walk.gif: the same, 4x on #7a7a7a, 150 ms per frame, looping.
- swatch.png at 2x: character 2 in all six skin tones, then character 1 in all eight hair colours.
- NOTES.md: the direction in one paragraph, the ramps, how to regenerate (tools/), honest weaknesses
  (e.g. both bodies share one height; the hood hides ears and horns; eyes[0] unused), and anything the
  layer system makes hard. Keep tools/ beside out/ so the art can be rebuilt.
