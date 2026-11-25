# BRIEF: "Common Stuff" — townspeople made of the same material as the town

You are making a style sample of layered pixel-art townspeople for a serious RPG for ADULTS. Read SPEC.md
first (it wins on every requirement), then this brief, then CODEX-WORKFLOW.md for tooling only. Ignore
CODEX-WORKFLOW's 32x48 / 3-heads / #24161f outline / reference-game notes: they are from an older job.
Use only the files in this folder. Never look at, search for or imitate any existing sprite or game art.

## 1. Direction

**Intent.** The town is built of plaster, oak, slate, flagstone, iron, terracotta. Its people wear wool,
linen, leather and iron, and they must look like they were cut from the same stock: the same colours, the
same pixel clustering, the same light, the same detail density (32 px per metre). A person standing on the
flagstones should read like the door beside them reads: flat, sturdy value planes, a few hard dark seams,
grain-like streaks, no candy colour, no shine. Mood: sober, weathered, working adults. Faces are calm and
neutral (no smiles, no open mouths, no expressions); dignity comes from posture and construction.

**What the world actually does (study world/ at 4x before drawing; these are measured):**
- Plaster walls: near-flat cream (#d2bc98 / #d5c09b) with rare 1 px specks; framed by oak beams #36190c.
- Oak/doors/beams: dark red-browns in long 1-px-tall streaks 2-8 px long running along the grain, with 1 px
  near-black seams (#220501 .. #201618) between boards.
- Flagstone: warm grey-beige #97836a..#d2bd9e, slabs ~16x10 px, fine sparse speckle, 1 px dark joints.
- Stone blocks/fountain: 3-4 flat bands per block (#5f4a3c, #755c48, #8c7157, #b09676), short 2-4 px
  horizontal dashes, seams #302425.
- Slate roofs #45403f..#928b86 in tiles with 1 px dark gaps; terracotta #451712..#a74c30.
- Shadow on the ground is COOL neutral grey (#48494c, #4c4748), sunlight is warm. Iron is near-black navy.
- No object has a uniform black outline. Edges read by value change plus dark seams where parts meet.

**Rule of thumb for every surface on a figure:** name the world material it imitates, and use that
material's clustering: wool/linen = plaster; leather = stone block bands + oak streaks; hair = oak grain;
iron = window bars; staff = beam.

### Proportions and anatomy (frame 48x64, feet on row 63, figure centred on x 23.5)
- Man: 58 px tall (top of skull row 6), head 8 rows x 7 px wide, 7.25 heads. Woman: 55 px (row 9), same
  head mask 8x7, 6.9 heads. Both bodies use the IDENTICAL 7x8 head mask so head layers are shared.
- Man: shoulders 15 px outer width, chest 13, waist 11, hips 11, neck 3 px wide x 2 rows. Woman: shoulders
  13, waist 9, hips 12, neck 3x2. Legs = 47-50% of height (crotch row ~35 man / ~37 woman). Wrists at
  crotch level, elbows at waist, upper arm 2 px wide, forearm 2, hand 2x3. Feet 3 px wide front view,
  6 px long side view. Adults stand straight, shoulders level, weight on both feet; no head tilt, no
  oversized hands or feet. Arms hang slightly away from the torso with a 1 px gap of background at the
  waist (reads as a real body, avoids the "doll block" silhouette).

### Face and eyes (head 7 wide x 8 tall; light from upper left)
Down view, rows of the head mask (r0 top):
- r0-r1 skull (hair usually covers); r2 forehead S4, left half S5 lit; r3 brow: S2 under-brow shadow
  across both eye columns, so the brow ridge reads.
- r4 eyes: each eye 2 px wide at x1-2 and x4-5, x3 is the nose bridge (S4). Eye = [eye dark, iris],
  iris on the inner pixel. NO white sclera, no highlight dots, never 2 px tall. Almond slits, not dots.
- r5 nose: 1 px S5 on the bridge-left, 1 px S2 shadow right of nose (x4), cheekbone S5 at x1.
- r6 mouth: 2 px at x2-3 in S1 (a firm line, never curved, never red). Man: jaw corners square at x0/x6
  of r6. Woman: r6 corners S3 (soft) and r7 chin 3 px (x2-4); man r7 chin 5 px (x1-5) in S3 with S2 under.
- Under the jaw, the top neck row is S1 (cast shadow). Right column of the face (x6) is S2/S3 (shade side).
- Ears: 1x2 px at x-1 and x7 on rows 4-5, S3 left, S2 right.
Left view (profile): forehead column slants; 1 px nose bump on r5 protruding past the face line; one eye
2 px wide set 2 px back from the face edge; mouth 1 px S1; jaw corner and ear (2x2, S2/S3) at mid-head.
Up view: back of head only (hair). Faces must read at 4x as "an adult person looking at you", never a mask
with dots. Age (character 5) comes from grey hair, beard and hood shadow.

### Hands and feet
Hands: 2x3 mitt, S3 with S4 knuckle row top-left, S1 underside; thumb 1 px only when gripping. No fingers.
Feet/shoes (labourer boots, ranger boots, mage shoes): leather; front view 3x2 each, top row leather 3,
toe pixel leather 4, bottom row seam; side view 6x2 with 1 px heel step. Bare skin never at the feet.

### Hair (oak-grain rule)
Hair is masses of locks 2-3 px wide following the fall of the hair; 1 px hair-0 seams between locks (like
board gaps); highlight is a 2-4 px streak of hair-4 on the upper-left crown only, hair-3 on the left side,
hair-1 on the right side and under-layers. No per-pixel noise, no single sparkle pixels. Hairline sits on
r2 (short) so the forehead shows; long hair falls behind the shoulders in down view with 1 px hair-0 where it
meets the neck. Braid: 2 px wide chain of alternating hair-3/hair-1 2x2 cells with seams, over the shoulder.

### Cloth (plaster rule) and folds
Large flat planes in 2 adjacent shades (lit left plane, shade right plane), speckled with the neighbouring
shade at most ~4% of the area, isolated 1 px, never checkerboard dithering. Folds: 1 px dark strokes
(shade 1) 2-5 px long that follow gravity and stress (hang from belt, shoulder, knee, elbow), each with a
1 px shade-3 stroke on its left (lit) side. Hems and the bottom of a garment get a 1 px shade-0 edge.
Wool is matte: never use shade 4 on more than ~8% of a garment, only on the top-left shoulders/hood top.

### Leather (stone-band + oak-streak rule)
Straps, belts, boots, bracers, ranger jerkin: 3 bands (leather 1/2/3) with 1-px-tall streaks 2-4 px along
the strap direction; edges in leather 0; one leather-4 dash on the top-left edge of each piece (worn edge).
Belts are 2 px tall: leather 2 over leather 1, with a 2x2 iron buckle.

### Metal (iron rule)
Iron is iron 0/1 with ONE iron-3 glint pixel on its top-left corner; iron 2 only on larger pieces. Buckles
2x2, cloak clasp 2x2, staff ferrule 1x3. Nothing gold, nothing glowing.

### Outline and edges (seam treatment, matched to the world)
- No uniform outline. The silhouette of each region uses the DARKEST shade of that region's own ramp
  (skin S0, cloth A0, hair 0, leather 0): a tinted edge, like the dark sides of the world's blocks.
- The fixed seam #221a1c is used only where the world uses its dark joints: under the feet (bottom row
  contact), between overlapping separate pieces (cloak over jerkin, belt over tunic, sleeve over hand), and
  on the bottom/right silhouette where the figure turns away from the sun. Never on top-left silhouette.
- Top-left silhouette pixels may be shade 1-2 instead of 0 (the sun eats the edge). This is what stops the
  pasted-on sticker look.

### Shading model and light
Sun from the upper left, high (matches the screenshots' warm light and the SPEC). Per cylinder (arm, leg,
torso): lit band left (shade 3), body (shade 2), core shadow right (shade 1); no reflected light.
Undersides (chin, under hat brim, under arms, inner thighs, bottom of cloak) one shade darker: soft AO like
the world. Ramps are hue-shifted the way the world is: shadows cool and grey, lights warm. No bloom, no
rim light, no glow. Figure values run #0e0d0c (black hair only) / #221a1c to #f2d9c2 (very light skin
only), inside the world's own range (#0a0000 seams .. #efe7e1 sunlit edges): figures neither glow nor sink.

### Readable at normal zoom without looking pasted on
- Value structure first: each figure has a clear dark mass (trousers/boots/cloak underside) low and a lighter
  face/shoulders high, like the houses (dark timber below, pale plaster above). Check at 1x.
- Garment colours are the world's: madder = the awning red muted; woad = window navy; undyed = plaster;
  moss = the grass; ochre = the sign; oak, slate, terracotta = the buildings. Nothing more saturated.
- Detail density: one value change every 2-4 px across a surface, like the textures; no area larger than
  ~6x6 px that is a single flat colour except plaster-like linen, and nothing noisier than flagstone.

## 2. Ramps (copy into out/ramps.json exactly; darkest first)

Source colours are the authoring colours; each is used only in its own region (skin source never in hair,
etc.). Elf ears are drawn in skin source; the beard in hair source; eyes in eyes source. Underclothes on the
body are fixed linen. Horns are fixed horn.

    {
     "source": {
      "skin":   ["#43291f","#6b4330","#92623f","#b07c53","#c69468","#d8ab80"],
      "hair":   ["#2a1a10","#432a19","#5e3d24","#7a5332","#966b44"],
      "eyes":   ["#1e130e","#4a2e1c"],
      "clothA": ["#2e1012","#4f1a1a","#74291f","#93392a","#ad5038"],
      "clothB": ["#34230c","#573b14","#7c561d","#9e722a","#ba8c3e"]
     },
     "targets": {
      "skin": {
       "very-light": ["#5a3b36","#8a6156","#b58a78","#d2a993","#e6c3aa","#f2d9c2"],
       "light":      ["#4f3330","#7d5547","#a97b63","#c99a7d","#dcb393","#ebcaab"],
       "medium":     ["#43291f","#6b4330","#92623f","#b07c53","#c69468","#d8ab80"],
       "brown":      ["#352016","#553323","#774a31","#93603f","#ab7650","#c08c62"],
       "very-dark":  ["#1d1210","#2d1b15","#42281d","#5c3a29","#7a5038","#9a6c4c"],
       "ash":        ["#2b2a2e","#424147","#5d5b60","#78767a","#918e8f","#a9a5a2"]
      },
      "hair": {
       "black":      ["#0e0d0c","#181716","#252322","#353130","#4d4743"],
       "dark-brown": ["#1c130f","#2c1d15","#3e291c","#553825","#6d4a31"],
       "brown":      ["#2a1a10","#432a19","#5e3d24","#7a5332","#966b44"],
       "auburn":     ["#2c120c","#4a1f13","#6b2f1a","#8a4323","#a65a31"],
       "blond":      ["#4a3a22","#6f5932","#957a46","#b89c60","#d3b87c"],
       "red":        ["#3a140c","#61220f","#8a3414","#ad4a1d","#c8652c"],
       "grey":       ["#3a3836","#55524f","#75716c","#95908a","#b3aea6"],
       "white":      ["#6b6862","#8f8b84","#b2ada4","#d0cbc1","#e6e2d8"]
      },
      "eyes": {
       "brown": ["#1e130e","#4a2e1c"], "hazel": ["#22190e","#6a5a2c"],
       "green": ["#16200f","#4a6a32"], "blue":  ["#141a24","#4d6d8a"],
       "grey":  ["#1a1c1f","#6b7176"], "amber": ["#2a1708","#a8701e"]
      },
      "clothA": {
       "madder": ["#2e1012","#4f1a1a","#74291f","#93392a","#ad5038"],
       "woad":   ["#161a26","#232b3b","#34405a","#4a5772","#637189"],
       "undyed": ["#3e352b","#5f5444","#857762","#a99a80","#c9b99b"],
       "moss":   ["#161c10","#25301a","#374624","#4c5c30","#66733f"]
      },
      "clothB": {
       "ochre":      ["#34230c","#573b14","#7c561d","#9e722a","#ba8c3e"],
       "oak":        ["#20150f","#35241a","#4d3626","#684b35","#846246"],
       "slate":      ["#22232a","#36363d","#4c4b50","#646163","#7f7a77"],
       "terracotta": ["#2e130d","#4b1f14","#6c2e1c","#8b4027","#a65735"]
      }
     },
     "fixed": {
      "seam":    ["#221a1c"],
      "linen":   ["#4a4236","#6e6453","#948871","#b5a98e"],
      "leather": ["#2a1a15","#47301f","#6a4a30","#8c6a47","#ae8d66"],
      "oak":     ["#2e1810","#4a2716","#6e4128","#8f5a37","#b07a4c"],
      "iron":    ["#1e2029","#3b3c46","#6b6a70","#a9a49c"],
      "horn":    ["#2b2420","#4a3f36","#6e6152","#958670","#b8a98e"]
     }
    }

**Black hair** is neutral-warm grey (no blue, no purple: R >= B on every shade). Its highlight #4d4743 is
used for lock streaks so black hair still shows its shape against dark clothes.
**Very dark skin + black hair + full beard** (character 2) stays readable this way:
1. The skin ramp is warm red-brown, the hair ramp neutral: they separate by hue even at similar value.
2. Forehead, cheekbones, nose bridge and the lit left cheek use S4/S5 (#7a5038/#9a6c4c), which are
   >= 2.2:1 brighter than the beard mid-tone; the eyes (eye dark + iris) sit between S2 brow shadow and S5
   cheekbones, so they read as two slits inside a lighter frame.
3. The beard leaves rows r2-r5 of the face free except the outer jaw columns; the moustache is 1 row (r6)
   with the mouth line replaced by 2 px of S4 lower lip on r7 inside the beard, so the mouth position reads.
4. The beard's silhouette uses hair 0, its body hair 1-2, and hair-3/4 lock streaks on its left half;
   the top edge of the beard against the cheek is a hard edge, no blending pixels.
Verify by eye in swatch.png at 4x: on every skin tone you can point to both eyes, the nose and the mouth.

## 3. Method: "draw large as reference, author native, derive layers from one rig"

Why: drawing natively from simple templates gave toy-like results; downscaling AI images gives mush and
off-material colours. So the image tool is used for design reference only, and every shipped pixel is
placed natively, in palette, by rules plus hand edits that are kept as data.

**Step 0. Tools.** Write tools/ in Python/Pillow: `grid.py` (text grid <-> PNG: one character per pixel,
legend in src/legend.json mapping characters to exact ramp colours, '.' = transparent), `rig.py`,
`build.py` (all layers from src/), `compose.py` (recolour + stack + composites), `check.py` (off-palette,
semi-alpha, lone pixels, bbox, feet on row 63, alignment tests below). Use tools/px.py from the workflow
only if it exists here, and never its outline step. Intermediates in scratch/.

**Step 1. Reference (image tool).** Generate on flat #FF00FF at large size: (a) a naked-mannequin-style
turnaround of an adult man and woman in plain linen underclothes, front, left profile and back, realistic
7.25-head proportions, neutral standing pose, light from upper left; (b) one front + profile reference per
outfit (labourer: linen shirt, wool tunic or waistcoat, trousers, boots, belt; ranger: hooded wool cloak
over a leather jerkin, bracers, boots; mage: long wool robe to the shoes with a cloth sash, plain, no
stars or runes); (c) hair styles and the hood. Prompt for grounded, sober, adult, medieval town clothing,
weathered fabric, no fantasy armour. Key out magenta, box-reduce to the 48x64 figure scale and keep as a
grey value underlay in scratch/ref/. These are tracing guides for proportion and garment construction.
They are never pasted, quantised or shipped.

**Step 2. Rig (single source of alignment truth).** src/rig.json, per body type, per direction, per frame:
`bob` (dy of everything above the hips), `head` (x,y of the head mask's top-left), `hips`, `shoulder_L/R`,
`elbow_*`, `hand_*` (+ grip point), `knee_*`, `foot_*`. Every layer is placed from this one file.

**Step 3. Body frames (authored, hand-finished).** Draw body/man and body/woman as text grids, 48x64 per
frame, for down F0-F5 and left F0-F5; up F0 (back view) drawn once; right = mirror of left (side-view
shading is mostly top-down, so the mirror holds; note it in NOTES). Alongside each body frame, emit a
LABEL map (head, neck, torso, upperarm/forearm/hand near and far, thigh/shin/foot near and far, all as
mask PNGs in scratch/labels/). Labels are generated from the same grids (a second legend), not guessed.

**Step 4. Head-attached layers (drawn once per direction).** elf-ears, horns, hair short/long/braid,
beard, hood are each drawn ONCE per direction as a grid relative to the 7x8 head mask, then placed in
every frame at `rig.head` (+ bob). Because the body's own head is placed by the same numbers, these layers
cannot drift. @man/@woman sheets are produced by translation only; no redraw. Long hair and braid may add
1 px of sway in passing frames, from rig.json only.

**Step 5. Outfits (rule-painted on labels, then hand-finished).** For each outfit and body type, a Python
painter fills label regions with the garment (sleeves = upperarm+forearm, trousers = thigh+shin, boots =
foot + 3 rows of shin, robe = torso+thighs+shins hull, cloak = torso hull + 2 px drape) using the cloth,
leather and iron rules above, plus 1 px cloth allowance outside the body silhouette (cloth has thickness).
Then hand-finish: patch files src/patch/<layer>@<body>/<dir><frame>.txt list `x y char` edits (folds,
seams, worn edges). Patches are data, so a rebuild reproduces them exactly. Held staff: drawn once per
direction, placed at `rig.hand_near` grip point each frame, with the 2 gripping hand pixels drawn on the
staff layer in skin source colours (so they recolour and sit above the staff).

**Step 6. The walk (6 frames, real stride).** Phases: F0 contact (near leg forward), F1 down, F2 passing,
F3 contact (far leg forward), F4 down, F5 passing. bob = 0, +1, -1, 0, +1, -1 (px, + is down).
- Left view: at contact, heels 16-18 px apart, front leg straight with heel 1 px down, back leg on toe;
  F1 front knee bends 1 px; at passing the swing foot is 2 px off the ground beside the support foot,
  knee 2 px forward. Near foot x must cross far foot x between F0 and F3 and back between F3 and F0.
  Arms swing opposite to legs: hands travel +/-5 px from the hip line, elbows bend 1 px more on the forward
  swing; the far arm is one shade darker and partly behind the torso. Torso leans 1 px forward at contact.
- Down view: the forward foot is lower by 1 px and its shin 1 px longer; the back foot rises 1-2 px and
  narrows to 2 px (heel lifting); the passing leg's knee shows (shorter leg, 1 px inward). The forward
  hand drops 1 px and moves 1 px toward the centre, showing more forearm; the back hand tucks partly
  behind the hip. Shoulders dip 1 px on the side of the forward arm; hips counter-tilt 1 px.
- Cloth follows: robe hem swings 1-2 px toward the back leg; cloak trails 1 px behind on contact frames.
- Build F0-F2 first, play them as a gif, fix, then derive F3-F5 by swapping near/far roles (redraw the
  overlap, do not just mirror the down view: the light is still from the left).

**Step 7. Compose.** compose.py recolours by exact source-colour lookup from ramps.json, stacks layers in
SPEC order, and builds every composite in SPEC. Ground shadow (composites only): a soft ellipse about
18x5 sprite px under the feet, coloured #2a2b35 at ~45% opacity, blurred, matching the world's cool shadows.
In-world: true scale (nearest 2.3x on market-normal-zoom; also save in-world-2x.png at 2x if the uneven
pixels make judging hard), 4x on market-close-zoom. Feet on open flagstones, not on the fountain or
buildings; put five figures in sunlight and one in the cast shadow on the left, to test both.

## 4. Self-check (run all, then look; redo anything that fails)

Automated (check.py, report in NOTES):
- [ ] off-palette 0, semi-alpha 0 on every layer; each source colour only in its region's layers.
- [ ] Heights: man 58, woman 55 (52-60), head mask 8 rows; feet on row 63 in every frame.
- [ ] Alignment: compose every hair x outfit x body x frame; no transparent gap between head layers and
      head, no skin visible under a sleeve, cuff, boot or hood edge where the garment should cover.
- [ ] Walk: left view near/far foot x cross twice per cycle; bob pattern 0,+1,-1,0,+1,-1 present;
      hand x moves >= 8 px over the cycle; down view feet change y and shape across frames.
- [ ] Black hair: R >= B for every shade; swatch.png row of hair colours shows black as black.
Looking (every image at 1x and 4x, in-world.png at FULL size):
- [ ] in-world.png: does each person belong in this street? Compare the figure against the door and the
      flagstone next to it: same pixel size, same clustering, same light side, same saturation. If a figure
      reads as a sticker, a toy or a brighter "game character" in front of a set, it fails.
- [ ] Light: every figure lit from the upper left like the fountain and walls; shade side on the right.
- [ ] Adult: no big heads, big eyes, smiles or cute proportions; faces read as calm adults at 4x, as faces
      (not blobs) at 1x/2.3x. Women and men read as such from build, not from cartoon cues.
- [ ] Materials: can you tell wool from leather from iron from hair at 4x without colour? If not, redo the
      clustering. Is any surface noisier than flagstone or flatter than plaster? Fix.
- [ ] Character 2 on very dark skin: eyes, nose, mouth readable; beard reads as black, not purple.
- [ ] walk.gif: a person walking (stride, opposite arm swing, rise and fall), not sliding or shuffling.
- [ ] Silhouettes at 1x on grey: six different people, recognisable by outline alone.
Redo anything weak (targeted fixes, then re-run all checks). Write honest weaknesses in NOTES.md.

## 5. Output layout (everything under out/)

    out/body/man.png, out/body/woman.png                       288x256 each
    out/feature/elf-ears@man.png, elf-ears@woman.png, horns@man.png, horns@woman.png
    out/outfit/labourer@man.png, labourer@woman.png, ranger@man.png, ranger@woman.png,
               mage@man.png, mage@woman.png
    out/hair/short@man.png, short@woman.png, long@..., braid@...   (both body types each)
    out/beard/full@man.png  (and @woman, translated, for completeness)
    out/head/hood@man.png, hood@woman.png
    out/held/staff@man.png, staff@woman.png
    out/ramps.json
    out/lineup.png, out/in-world.png, out/in-world-close.png (+ in-world-2x.png if made)
    out/turn.png, out/walk.png, out/walk.gif, out/swatch.png
    out/NOTES.md   direction, ramps, which layers have @man/@woman and why (different heights/builds;
                   head layers differ by translation only), method, check results, honest weaknesses
    src/ and tools/ stay beside out/ so every PNG can be rebuilt with `python3 tools/build.py`.

Sheets: 6 columns (frames) x 4 rows (down, left, right, up), 48x64 cells. Down and left rows have all 6
walk frames; right = mirrored left; up repeats its standing frame. RGBA, alpha 0 or 255 only.
