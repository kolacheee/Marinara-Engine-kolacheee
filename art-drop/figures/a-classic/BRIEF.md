# BRIEF: "Cloisonne", a bold classic style sample of layered town figures

Read SPEC.md first: it says what to deliver, and it wins on any "what" question. This brief says HOW it
must look and how to make it. CODEX-WORKFLOW.md is background on how earlier jobs ran; its palette, its
#24161f outline and its image-tool sprite route do NOT apply here.

Ground rules:
- Work only inside this folder. Do not search the disk or look at any existing sprite or art file
  (art-drop/, packages/client/public/hd2d/ or anywhere else). The owner rejected them.
- Do not use the image tool. Every pixel is placed by your own Python/Pillow code (see section 5).
- px.py reads a ramps.json from its own folder that does not exist here and holds an old palette. Do not
  use its palette checks or its `quant`. Write your own `tools/check.py` (you may copy px.py's
  `lone_pixels` logic). Scratch files go in `scratch/`, deliverables in `out/`.

## 1. The direction

**Cloisonne.** Each figure reads like a small enamel pin or a leaded window: a confident, unbroken
near-black ink line closes every colour field, and inside each field sits flat, saturated colour with
very few, deliberate shades. Big heads (about 2.8 heads tall), sturdy bodies, dark eyes, jewel-tone
clothes. We take the cell-and-line clarity of enamel and stained glass, the flat planes of woodblock
prints and the toy charm of classic 16-bit era town sprites. No gradients, dithering, anti-aliasing or
noise. A viewer must name each person's job, race and hair colour from across a busy plaza.

The five rules that make it ours:
1. **Ink closes the shape.** One unbroken 1 px ink outline (#1c1222, a warm violet-black) around the
   whole silhouette of every layer, and between DIFFERENT materials (skin / cloth / leather / hair /
   metal). Inside ONE material there is never ink: folds and form use that ramp's own shades.
2. **Light from above-front, symmetric.** The town has moving sun and lamp light, and the right row
   is a mirror of the left, so a side light would flip. Tops of forms (crown, shoulders, forearms, hat
   brim, knees) take the light shade; vertical faces take the base; undersides and anything under an
   overhang (chin, fringe, belt, sleeve, hem, between the legs) take the shadow. Never darken a whole
   outline edge all round (no pillow shading).
3. **Few shades, big planes.** Base colour covers at least half of every field. The deepest shade is
   only for 1 px creases and contact lines. The light shade is a band or a few pixels, never a rim.
4. **Saturation in the clothes, value in the head.** Garments are jewel colours the warm stone, cob
   and wood of the town never use. Face and hair hold the strongest value contrast (light skin against
   ink eyes and dark hair edges), so the eye goes to the face first.
5. **The silhouette tells the job.** Labourer: square and plain, rolled sleeves, belt. Ranger: hood
   bump behind the head, cloak edges that flare wider than the shoulders at the hem. Mage: a long robe
   that widens into a bell to the ground, sash ends hanging. Each must read from silhouette alone
   (fill it black and check).

## 2. Geometry (frame 32 x 48, columns 0-31, rows 0-47, standing frame, facing down)

Both bodies share the SAME head and the SAME legs and feet, so every head layer and every leg part
fits both unchanged. The woman differs in shoulders and waist, the face details in 3.3, and her outfit
cut. The centre line runs between columns 15 and 16; front and back views are exactly symmetric.

| Part | Rows | Columns (outline included) |
|---|---|---|
| Headroom (hat crown, horn tips, hair volume) | 0-4 | any |
| Skull/face outline (body layer) | 5-19 | 8-23 at its widest (16 px wide, 14 interior) |
| Brows (drawn by the HAIR layer, hair shade 0, 2 px each) | 10 | 12-13 and 18-19 |
| Eyes | 12-14 | 12-13 and 18-19 |
| Mouth | 17 | 15-16 |
| Neck | 20 | 14-17 skin shade 0, ink at 12-13 and 18-19 |
| Shoulders/torso with arms, man | 21-32 | 9-22 (14 px) |
| Shoulders/torso with arms, woman | 21-32 | 10-21 (12 px), waist pulled in 1 px each side at rows 27-29 |
| Hands (hanging) | 31-34 | man 7-10 and 21-24, woman 8-11 and 20-23 |
| Hips | 31-33 | 10-21 |
| Legs (5 px each; cols 15-16 stay CLEAR from row 37 so ground shows between them) | 33-44 | 10-14 and 17-21 |
| Feet | 45-47 | 9-14 and 17-22, sole row 47 |

Height: body 43 px (rows 5-47), 44-45 with hair. Head 15 rows = about 2.8 heads. Ear corridor: elf ears
fill rows 10-15 outside the head (tips at cols 3-4 and 27-28, angled up). Hair must never cover cols 0-7 or
24-31 in rows 10-15, so ears always show. Horns rise from the temples (rows 5-7, cols 9-10 and 21-22),
sweep out to cols 5-6 / 25-26 and curl up to tips at row 0-1; hair may cover only their roots.

Side view (left; right = mirror): head profile with the face looking left, one eye at cols 9-10, a 1 px
nose bump that breaks the outline at row 15, ear at cols 17-18 rows 12-14, the far arm hidden behind the
torso, legs overlapping. Back view: no face; back of head in skin, hair covers most of it.

Walk (down only): frames 0 and 2 = stand. Frame 1 lifts the viewer-left foot 2 rows (shorter foot,
knee 1 px in), frame 3 the right; the planted foot stays on row 47; the arms swing 1-2 px; everything
above the hips moves DOWN 1 row. One table `BOB = [0, 1, 0, 1]` and one table of hand and foot positions
per direction and frame feed every layer, so nothing drifts. Left, right, up: standing frame in all 4.

## 3. Pixel rules at 32 x 48

### 3.1 Outline
- Exactly 1 px of ink #1c1222 around each layer's silhouette, 8-connected, no gaps, no 2x2 ink blocks.
  On curves step as 2-1-1-2 runs, never jaggy 1-3-1. Diagonal joins touch at corners only (no L
  doubles), except the sole row of the feet, which is solid ink.
- Interior ink only where two different materials meet. Two exceptions keep the face open: the fringe
  edge over the forehead and the beard edge against the cheek use hair shade 0, not ink.
- When an upper layer covers part of the body, it must extend over the body's outline pixels at that
  edge and draw its own ink there. Never leave a 1 px sliver of a lower colour between two ink lines.

### 3.2 Shading and shade counts
- Skin 4 shades, hair 4, cloth A 4, cloth B 3, iris 3. Fixed (never recoloured): leather 4, metal 4,
  wood 3, horn 4, gem 3, underclothes 3, eye white 1, ink 1.
- Per field: shade 2 (base) at least 50%; shade 3 (light) on top planes, 10-20%; shade 1 (shadow) on
  undersides and the lower part of sides; shade 0 only in creases, under the chin, inside the knees.
- No dithering, no checkerboards, no single stray pixels of a third shade inside a flat area.

### 3.3 Face and eyes (the face is the style; get it exactly right)
Body head, facing down, columns 8-23, rows 5-20. Legend: `.` clear, `k` ink, `0-3` skin shades,
`i j l` iris dark/base/light.
```
r5  ....kkkkkkkk....
r6  ..kk33333333kk..
r7  .k233333333332k.
r8  k22233333333222k
r9  k22222222222222k
r10 k22222222222222k
r11 k22222222222222k
r12 k222kk2222kk222k
r13 k122ii2222ii221k
r14 k122lj2222jl221k
r15 k12322222222321k
r16 .k122221222221k.
r17 .k122220022221k.
r18 ..k1122222211k..
r19 ...kk111111kk...
r20 ....kk0000kk....
```
- Eyes are 2 x 3: an ink lid, then dark iris under it, then base iris inside and light iris outside.
  The eye colour reads as 2 pixels per eye. No eye white in front view (it would look startled).
- Woman: the lid extends 1 px outward (row 12, cols 11 and 20) with a lash pixel up at row 11 on the
  same columns; mouth in skin 1 instead of skin 0. Man: as drawn.
- Side view: eye = ink lid over a 1 x 2 iris (dark over light) at the front with eye white 1 px behind it.
- Brows (hair layer) give the expression: level 2 px dashes for the sample, 1 row above the lid gap.

### 3.4 Hands and feet
- Hand: a 4 x 4 cell with ink outline and a 2 x 2 skin interior (top row skin 3, bottom row skin 2). No
  fingers. A held staff passes the hand by leaving the hand pixels clear, so the body's fist shows.
- Feet, front view: 6 x 3, rounded top corners, toe cap light shade at the top, solid ink sole row 47.
  Side view: 7 px long, toe pointing left. Body layer feet are bare skin; every outfit draws footwear
  (labourer boots in leather, ranger tall boots in leather, mage soft slippers in cloth B).

### 3.5 Hair clusters
- 3 to 5 big clumps per style, each ending in a 2 px taper. Clumps are separated by hair shade 0 or 1
  lines, never ink; ink only on the outer silhouette.
- One shine: a broken arc of shade 3, 3-5 px, across the crown in two or three pieces. Never a ring.
- Short: cropped clumps, fringe to row 9, sides end at row 13 inside the head outline. Long: falls
  behind the shoulders to row 32, front locks over the shoulders inside cols 8-23. Braid: one braid
  over the viewer's-left shoulder as 4-5 stacked 3 x 2 links ending in a cloth B tie. Every style
  draws the brows and fills the back view.
- Full beard: hair ramp, rows 15-22, over jaw and chin; mouth = 2 px shade 0 gap at row 17.

### 3.6 Cloth folds
- 2 or 3 folds per garment, no more: 1 px diagonal lines of shade 1 (shade 0 at the deepest point)
  from tension points (belt, armpits, knees, a held arm).
- Hems: 1 px shade 1 band just above the ink. Trim and seams in cloth B.
- Long garments (robe, skirt, cloak) fall in 2 px wide vertical bands of base and shade 1, and the
  hem steps in a gentle 1 px zig-zag.
- Ranger: cloak (cloth A) open at the front showing a leather jerkin and cloth B shirt, hood down as a
  bump behind the neck, belt with metal buckle, bracers. Mage: robe (cloth A) to the ankles, sash
  (cloth B) with a knot and two hanging ends, wide sleeves. Labourer: tunic (cloth A) to mid-thigh with
  rolled sleeves (forearms bare skin), leather belt, trousers (man) or calf skirt (woman) in cloth B.
- Hat (choose head/hat.png): a floppy pointed mage hat in cloth A with a cloth B band; brim rows 7-9
  spanning cols 5-26, crown rising to row 0 with the tip folded over to one side. It sits over hair.

## 4. Ramps (darkest first; copy into ramps.json exactly)

Source ramps are used ONLY in recolourable regions and nowhere else. Recolour = exact index swap.
```json
{
 "source": {
  "skin":   ["#7a3b34", "#b8654e", "#e09a72", "#f7caa0"],
  "hair":   ["#3a1d2e", "#6e3a3c", "#a8634a", "#d99a62"],
  "eyes":   ["#262050", "#4a4aa0", "#8a8ae0"],
  "clothA": ["#3c0f2a", "#7a1838", "#b8303e", "#e86a4e"],
  "clothB": ["#1a3a3a", "#2e7a6e", "#5ec0a0"]
 },
 "targets": {
  "skin": [
   ["#8a4a4a", "#c98478", "#f0b9a0", "#fde3d2"], ["#7f3f38", "#c0705a", "#eaa482", "#fcd5b4"],
   ["#6b3426", "#a35b3c", "#d08a5c", "#eeb985"], ["#4a2222", "#7a3e2c", "#a8613f", "#cf8c5e"],
   ["#2a141c", "#4a2820", "#6e402c", "#98603c"], ["#233a34", "#3e6352", "#68916c", "#a2c088"]
  ],
  "hair": {
   "black":    ["#120d1c", "#241c33", "#3b3352", "#5f5a80"], "brown":    ["#2a1512", "#4e2c1e", "#7a4a2c", "#a8743f"],
   "chestnut": ["#3a1410", "#6e2a17", "#a24a22", "#d07a36"], "blond":    ["#6b4a1a", "#b08a2e", "#e0c050", "#fbeb94"],
   "red":      ["#4a0f14", "#8e2219", "#d0461f", "#f6823a"], "grey":     ["#3a3844", "#67646f", "#9a96a0", "#cbc8cc"],
   "white":    ["#6a6680", "#a7a4b8", "#dcdae6", "#fbfbff"], "violet":   ["#2a1248", "#5a2a8a", "#9a52c8", "#d79af0"]
  },
  "eyes": {
   "brown": ["#2a140e", "#5e3218", "#96592a"], "hazel": ["#3a2a10", "#6e5a20", "#a8923c"],
   "green": ["#0f3020", "#1f7040", "#4fb060"], "blue":  ["#10264e", "#2458b0", "#5aa0ec"],
   "grey":  ["#2a3038", "#5a6674", "#98a4b0"], "amber": ["#4a2006", "#b0620c", "#f0a830"]
  },
  "clothA": {
   "madder":  ["#3a0f24", "#761a34", "#b4323c", "#e66a4a"], "cobalt":  ["#141a4a", "#233a8e", "#3a66c8", "#74a6ee"],
   "emerald": ["#0e2e26", "#1d5e3a", "#3a9046", "#86c460"], "saffron": ["#4a2410", "#8e4e14", "#cc8a20", "#f4c84a"]
  },
  "clothB": {
   "linen": ["#6e5a48", "#b8a284", "#ece0c4"], "teal":  ["#123c44", "#1f7a78", "#4ec0aa"],
   "gold":  ["#5a3410", "#b0761c", "#f0c040"], "plum":  ["#2e1438", "#62285e", "#a0508a"]
  }
 },
 "fixed": {
  "ink": ["#1c1222"], "eyewhite": ["#f6efe2"],
  "leather": ["#3a1e18", "#6a3a24", "#9e6438", "#c89058"], "metal":   ["#3c3e52", "#7c8094", "#c4c8d4", "#fffbe8"],
  "wood":    ["#3a2214", "#6e4424", "#a06a3a"], "horn":    ["#2e2420", "#6a5644", "#b0987a", "#e8dcc0"],
  "gem":     ["#3a1060", "#8a3ad0", "#e0a0ff"], "under":   ["#7c6c66", "#b4a49a", "#ddd0c2"]
 }
}
```
Skin targets run very light to very dark, then the grey-green fantasy tone last. Elf ears are drawn in
the skin ramp (they recolour with the skin). Horns use the fixed horn ramp. Lineup colourways: 1 ranger
emerald/linen, 2 labourer saffron/linen, 3 mage cobalt/gold, 4 labourer madder/teal, 5 mage madder/gold
with a cobalt/gold hat, 6 ranger emerald/teal. Adjust only if a pair clashes.

## 5. Drawing method: native Python/Pillow, from character grids

Draw natively at 32 x 48 in code: layers must line up to the pixel, the face template must land exactly,
and every colour must be an exact ramp entry. An image-tool picture shrunk to 32 x 48 smears 2 px eyes.

1. Write `tools/figs.py`. Represent every layer cell as a 48-row list of 32-char strings (or as pieces
   of them stamped at fixed offsets). Each layer has a legend mapping characters to (ramp, index), for
   example `k` ink, `0-3` that layer's main ramp, `a-d` its second ramp, `L/M/W/H/G` fixed ramps.
   Store layers as RGBA PNGs in SOURCE colours, alpha 0 or 255 only.
2. Draw the body first (man, then woman) for all four directions and the down walk frames. Save
   `body_mask[dir][frame]` (the opaque set) and the hand/foot/bob tables.
3. Draw every other layer against the body: head layers are drawn once per direction and stamped with
   `BOB[frame]`; outfits are drawn as an upper part (stamped with BOB) plus legs per frame. Outfits are
   functions of the body, so `outfit/X@woman.png` is the same function run with the woman's torso and
   costs nothing; make @woman variants for all three outfits.
4. Right = mirror of left for every layer. Up/down views are symmetric except braid, staff, hat tip.
5. Write `tools/compose.py`: load ramps.json, recolour each layer by exact source-to-target swap (the
   character's skin, hair and eyes apply to every layer; cloth A/B colourways are chosen per layer),
   stack bottom first in SPEC order, and build every composite. Never resample except with NEAREST at
   whole-number scales.

## 6. Self-check (run all of it; redo any file that fails, then run it again)

`tools/check.py` must print, for every PNG in out/: size, colours, off-palette count (layers: only
source + fixed + ink; composites: targets + fixed + ink), semi-alpha count, lone-pixel %, bbox per cell.
It must also assert:
- Every layer is 128 x 192, each 32 x 48 cell either empty or a drawing; semi-alpha = 0; off-palette = 0.
- Body cells: feet on row 47, height 43, centred (bbox centre 15.5 +/- 0.5).
- No source colour appears outside its region in layers; no source colour appears at all in composites.
- Every opaque layer pixel that touches transparency is ink (closed outline), except fringe and beard
  edges that land on skin after compose (check those on the composite instead).
- After compose: no `under` colour shows on a clothed character; no 1 px sliver of one colour between
  two ink pixels; no ink 2 x 2 blocks except the sole row; ears and both horn tips visible on chars 3,
  4 and 6; right row == mirrored left row.
- Lone pixels under 6% per layer (eyes, nose and buckles are allowed to be single).

Then LOOK. Make `scratch/view/`: each layer at 6x on #7a7a7a, the lineup at 4x, and a stress plate
where the six characters stand at 1x and 3x on a procedurally drawn busy cobble ground in warm greys and
browns with dark mortar lines (scratch only, not delivered). Open each image and fail a file if:
- a face is wrong: eyes uneven, off the template, not looking straight, or a smeared mouth;
- the job, race, hair colour or facing does not read at 1x on the cobble plate, or the figure melts into it;
- the silhouette filled black does not say labourer / ranger / mage;
- a layer is offset by even 1 px, a hat floats, hair covers the ears, a hand hides inside a sleeve;
- there is banding, pillow shading, noise, a broken outline, or ink inside one material;
- walk frames jitter (head moves sideways, a foot leaves row 47 when it should be planted).

## 7. Output layout (all under out/)
```
out/body/man.png  out/body/woman.png
out/feature/elf-ears.png  out/feature/horns.png
out/outfit/labourer.png  out/outfit/labourer@woman.png  out/outfit/ranger.png
out/outfit/ranger@woman.png  out/outfit/mage.png  out/outfit/mage@woman.png
out/hair/short.png  out/hair/long.png  out/hair/braid.png  out/beard/full.png
out/head/hat.png  out/held/staff.png
out/lineup.png  out/turn.png  out/walk.png  out/walk.gif  out/swatch.png
out/ramps.json  out/NOTES.md
```
Composites exactly as SPEC.md lists them: lineup at 1x and 4x on #7a7a7a and again on #3a3129; turn at
4x; walk at 4x plus walk.gif (about 150 ms per frame, looping, no transparency smear: flatten on #7a7a7a);
swatch at 2x. Keep tools/ and scratch/ beside out/.

## 8. NOTES.md
One paragraph naming the direction (Cloisonne) and its rules, the ramps (point to ramps.json and list
shade counts), how the files were made (all native code, no image tool), honest weaknesses (for example:
both bodies share one height; symmetric light gives less modelling than a side light), and anything the
layer system made hard (hair vs ear corridor, staff vs hand, hat vs hair).
