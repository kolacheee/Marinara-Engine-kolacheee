# BRIEF: "Iron Gall" townspeople style sample (48 x 64, layered)

You are making a style sample of layered pixel-art townspeople for a serious RPG made for ADULTS. Read SPEC.md
(the contract) and CODEX-WORKFLOW.md (tools), then study both world/ screenshots in your image viewer, in
crops, before placing a pixel. Work only in this folder: scratch/, src/, tools/, out/. Look at nothing else on
disk; never copy, trace or imitate an existing game sprite. If tools/px.py is absent, write your own checker.

## 1. The direction: Iron Gall

Named after iron-gall ink: warm, dark, economical lines laid down with confidence, and strong, controlled
light. These are the people of a hard-working market town painted by an illustrator for grown-ups: tired
labourers, wary rangers, an old scholar under his hood. They read through SILHOUETTE, POSTURE and LIGHT, not
through detail or charm. Every figure is a small, serious figure study: a clear lit side and a clear shadow
side, few lines, each line doing a job.

NOT: round heads, big eyes, rosy cheeks, smiles, candy colour, black outline all round, pillow shading, hero
poses, stubby limbs, toy feet.

### What the world tells us (keep these numbers)
- Ground: warm sunlit flagstone, values around #bca587 to #d3bd9d (lightness about 70 to 78). Figures must be
  clearly DARKER than this as a mass: clothes sit at lightness 15 to 55, like the world's timber, doors and
  slate. This gives readability without any glow or heavy outline.
- The world has NO outlines. Edges are made by value: dark seams, mortar lines, a dark plank gap, the shadow
  side of a beam. Darkest world tones are warm near-blacks (#1e0501, #2e140a timber). Our outline colour is the
  warm ink #1b1210 and it is used only where the rules below say.
- Light: warm sun from the LEFT and slightly above and in front (cast shadows in the screenshots fall to the
  right and away). On a sprite the lit planes face screen-left and up; shadow planes face screen-right and
  down. This holds in every direction row, so the RIGHT row is never a plain mirror of the LEFT row (see 3.6).
- Texel detail: broad flat planes with 1-px seams and value dabs. Match it: no noise, no gradients.

### Proportions and anatomy (rows counted from 0 at top; row 63 is the ground; centre line between cols 23|24)
| landmark | man (59 px, 1.84 m) | woman (56 px, 1.75 m) |
|---|---|---|
| crown (top of skull) | row 5 | row 8 |
| eye row | 8 | 11 |
| chin (under-jaw shadow on next row) | 11 | 14 |
| shoulder top | 15 | 18 |
| armpit / chest | 20 | 23 |
| waist / elbow | 27 | 28 (narrowest) |
| crotch / wrist | 34 | 36 (hips widest at 33) |
| knee | 48 | 49 |
| ankle | 60 | 60 |
| sole | 63 | 63 |
| widths (down view) | shoulders 16, waist 10, hips 12 | shoulders 14, waist 8, hips 14 |
Both heads are the same 8-row patch (skull 6 px wide, cols 21-26), so the man is 7.4 heads and the woman 7.0;
the woman's face differs inside the patch (narrower jaw, softer cheek), not in its size. Neck 4 px wide on the
man, 3 on the woman, and visible: 3 rows between chin and shoulder line. Arms are long: the wrist reaches the
crotch line, with a 1-px gap of background between arm and waist in the down view. Upper arm 3 px, forearm
2-3 px, hand 3x3. Legs are long and straight-shinned; feet small and grounded.
Posture: shoulders dropped, chin level, weight low, nothing perky. Man broad in shoulder and neck; woman
narrow-waisted but not idealised.

Both heads share one patch and the shoulder line is crown+10 on both, so ears, horns, hair, beard, hood
and staff need NO @man/@woman variant. All three outfits DO (labourer, ranger, mage @man and @woman).

### Faces (8-row head patch, skull cols 21-26; r0 = crown row)
Down view:
- r0-1 skull (paint the scalp even though hair or hood covers it). r2 brow: a 2-px brow-ridge shadow in skin
  shade 1 over each eye; no drawn eyebrow line.
- r3 eyes: one iris pixel per eye (eyes shade 1) at cols 22 and 25; nose bridge cols 23-24 in skin shade 3.
  Eyes at mid-head, never low. No eye whites, no 2x2 eyes, no catch-lights.
- r4: cheekbone catch, one skin shade-4 pixel on the lit cheek (col 21 or 22) under the eye; this is what
  makes the eye socket read on every skin tone. Nose shadow 1 px of shade 1 at col 24.
- r5 mouth: 2 px at cols 23-24 in skin shade 1, never red, never a smile. Woman: one shade-3 lower-lip pixel
  below. Man: upper lip in shade 2.
- r6 jaw and chin: jaw corner a 1-px step to shade 1 at col 26; chin 2 px in shade 2-3. Man square (corner at
  r6); woman tapered (corner at r5).
- r7 under-jaw: 2-4 px of skin shade 0 onto the neck. This dark line separating head from body is the most
  important adult cue. Ears: 1 px each side (cols 20, 27) at r3-r4.
Left view: brow 1 px ahead of the eye, iris pixel two columns behind the nose tip, nose a 1-px protrusion at
r4, mouth a 1-px notch, chin 1 px ahead of the mouth, a jaw angle running back to the ear, and the back of the
skull behind it. Up view: hair and neck only. Skin budget (down view): shade 4 on 3-5 px, 3 on the lit half,
2 on the shadow half, 1 for structure, 0 only in occlusion.

### Dark skin, black hair, full beard (character 2 must pass this)
- Faces use skin shades 2-4 except structure and occlusion; hair and beard use hair shades 0-2, with 3-4 only
  as a thin highlight band. very_dark skin shade 2 is lightness 22, black hair shade 1 is 7, so the face stays
  a distinct, warmer, lighter plane.
- The beard covers the jaw from r5 down and the cheeks only below the cheekbone: never r3-r4 between cols
  21-26, so eyes and cheekbone catches stay. The mouth stays open: 2 px of skin shade 1 framed by moustache,
  one skin shade-3 pixel above it on the lit side. No line between beard and face; the value step does it.
- Black hair is warm-neutral (no blue, no purple, saturation under 12%); its highlight #48423d is a dull
  grey-brown on at most 3-4 px along the lit crown. No light rim around dark hair.
- Test: character 2 at 4x on flagstone and on #7a7a7a. If you cannot point to both eyes, the nose and the
  mouth at 1x and 2.3x, repaint the face (not the ramp).

### Edge treatment (the "ink")
- Silhouette: ink #1b1210 on the SHADOW side (screen-right) and bottom edges. On the LIT side (screen-left and
  top) the edge pixel is the darkest shade of the material it bounds. The figure is cut crisply on the right
  and dissolves slightly into light on the left, as the world's beams and doors do.
- Interior lines only where one form overlaps another (arm over torso, cloak over tunic, belt, beard over
  chin, hood rim over face): 1 px of the darker material's shade 0, never ink. Never outline a fold, face or
  hand. No doubled or 2-px lines, no pillow shading.

### Shading model
Per material: light plane (shade 3), half (2), core shadow (1), occlusion (0: armpits, between legs, under
belt, inside hood, under chin), highlight (4, rare: forehead, cheekbone, nose ridge, hair crown, shoulder tops,
leather edges, metal points). The terminator sits a little right of centre in the down view (lit 45%), one
clean line following the form. Cast shadows are hard and fall down-right (chin on neck, hood rim on brow,
beard on chest, belt, near arm on torso). The bottom 1 px of shadow-side shins and hems may rise one shade
(warm flagstone bounce). No gradients, no dithering, no checkerboards.

### Materials at 48x64
- Cloth (wool, linen): broad planes, 1-3 folds per garment section, each fold a 1-px diagonal of shade 1 with
  1 px of shade 3 on its lit side, radiating from a tension point (shoulder, elbow, belt, knee, held hand).
  Hems: 1 px of shade 0 under-shadow and a silhouette that breaks by 1 px once or twice, never a ruler line.
  Heavy wool hangs straight; linen creases more. Up to ~5% of pixels may be single-pixel value dabs (texture
  weave), never in a pattern.
- Leather: smoother, fewer and rounder folds, stronger contrast, a 1-px shade-4 edge highlight on lit edges.
  Straps 1-2 px with shade 0 under them on the shadow side. Boots darkest leather, 1-px ink sole line, toe
  highlight 1 px on the lit foot.
- Metal: iron and brass only as 1-3 px accents, exactly one bright pixel per object.
- Hair: 2-4 large clumps with 1-px darker separations that follow the skull and fall with gravity; a highlight
  band on the upper-left curve of the skull; ends break the silhouette by 1-2 px. No strands, no spikes, no
  anime fringe. Long hair falls behind the shoulders on the shadow side and in front on the lit side.
- Hands 3x3: lit top-left shade 3, shadow column shade 1, one shade-2 knuckle pixel; 1-px thumb in profile;
  never a glove blob or drawn fingers. Feet: 3-4 px wide with a 2-px gap (down), 7 px with a heel step (left).

### Costume (construction and weight, no ornament for its own sake)
- labourer: linen shirt (fixed), sleeves rolled to the elbow; clothA tunic or waistcoat; clothB breeches;
  leather belt, iron buckle, boots. Worn, practical.
- ranger: clothB cloak, hood DOWN and bunched at the neck, brass pin on the lit shoulder, covering the shadow
  shoulder to the knee; clothA tunic; leather jerkin, bracers, belt, boots.
- mage: clothA robe to the ankle, high collar, clothB stole; leather belt and pouch. A scholar, not a wizard:
  no stars, glowing trim or pointed hat. The hem shows the toes.
- hood: clothB, deep, rim casting 1-2 px shadow on the brow, face visible from the eyes down, drape 16 px wide.
- elf ears: skin, long and narrow, swept back and up 3-4 px past the skull. horns: fixed horn ramp, curving
  back from the temples, 5-7 px, ridged in 1-px shade steps.
- staff: wood, shaft 1-2 px, iron ferrule, plain cap, 60 px long, in the right hand (screen-left in the down
  view); the fist's pixels stay transparent in the staff layer so the hand shows over it.

## 2. Ramps (write exactly this as out/ramps.json; dark to light)
Each recolourable region is painted ONLY in its source ramp; source colours appear nowhere else. Fixed ramps
are not recoloured. The compose script maps source shade i to target shade i, per layer, by exact hex.
```json
{"source": {
  "skin":["#5e3c2e","#8f5d47","#bd8a6c","#d9ab8a","#ecc8a8"], "hair":["#2a1810","#45291a","#643d24","#845331","#a26c42"],
  "eyes":["#1e120c","#4a2c1a","#6e4528"], "clothA":["#2a1210","#4a1f19","#6b2f23","#8a4430","#a65e43"],
  "clothB":["#24160e","#3c2617","#583822","#774e30","#94683f"]},
 "targets": {
  "skin": {
    "very_light":["#6e4a3c","#a06e5a","#c99a80","#e3bca0","#f2d8c0"], "light":["#5e3c2e","#8f5d47","#bd8a6c","#d9ab8a","#ecc8a8"],
    "medium":["#4e3022","#7a4a32","#a36f4f","#c4916c","#dab08a"], "brown":["#3a2219","#5e3826","#845436","#a6704b","#c08c63"],
    "very_dark":["#1c100b","#331d13","#4d2c1b","#6a4029","#8a5a3b"], "ash_grey":["#2e2b2b","#4a4545","#6a6463","#8d8684","#aea6a2"]},
  "hair": {
    "black":["#0e0d0c","#181615","#24211f","#322e2b","#48423d"], "dark_brown":["#1c120d","#2e1d14","#43291b","#5b3925","#744b31"],
    "brown":["#2a1810","#45291a","#643d24","#845331","#a26c42"], "auburn":["#2a100b","#4a1d12","#6e2c19","#8f3e22","#ad5530"],
    "blond":["#4a3518","#75562a","#a07c41","#c4a05e","#dcc184"], "red":["#3a120b","#64200f","#8f3214","#b4491c","#cf6a2e"],
    "grey":["#2e2c2a","#4c4946","#6f6b67","#938e88","#b6b0a8"], "white":["#4f4c48","#7a766f","#a39e95","#c9c4ba","#e6e1d6"]},
  "eyes": {
    "brown":["#1e120c","#4a2c1a","#6e4528"], "green":["#14200f","#35512a","#557a3c"],
    "blue":["#121a26","#2f4a6a","#4f7396"], "amber":["#2a1a06","#7a5216","#a87a26"],
    "hazel":["#1f1a0c","#5a4a24","#7d6a36"], "grey":["#1c1e20","#4e5458","#747b80"]},
  "clothA": {
    "madder":["#2a1210","#4a1f19","#6b2f23","#8a4430","#a65e43"], "woad":["#161c24","#253040","#384a5c","#526779","#6f8596"],
    "weld":["#1f1f12","#34341c","#4c4b29","#686539","#85804e"], "undyed":["#2b2520","#463d34","#63574a","#827462","#a0927d"]},
  "clothB": {
    "russet":["#24160e","#3c2617","#583822","#774e30","#94683f"], "forest":["#121a12","#1f2c1d","#2f402a","#445a3b","#5d7550"],
    "charcoal":["#161616","#252423","#393735","#504d4a","#6a6662"], "ochre":["#2e2010","#4f3819","#735224","#956d32","#b38a46"]}},
 "fixed": {
  "outline":["#1b1210"], "leather":["#1d130e","#33221a","#4d3426","#6a4a35","#886449"],
  "iron":["#23211f","#3d3a37","#625e59","#8f8a83"], "brass":["#3a2810","#66491d","#94702f","#c29a4c"],
  "wood":["#2a1a10","#47301e","#66482c","#86653f"], "linen":["#4a4136","#6e6455","#968a76","#b8ab93"],
  "horn":["#2c2420","#4c3f35","#75644f","#a08b6d"]}}
```
Eyes: shade 1 is the iris pixel, 0 the lid/pupil in profile. Body underclothes are fixed linen. Colourways: char 1 ranger
clothA weld + clothB forest; char 2 labourer undyed + russet; char 3 mage woad + charcoal; char 4 labourer
madder + ochre; char 5 mage undyed + charcoal; char 6 ranger madder + forest. All muted on purpose; the
world's only saturated notes are the red awning and the lantern, and the people must not out-shout them.

## 3. Method: reference-guided native painting on a shared rig

Why: a big AI image box-downscaled to 48x64 smears faces and cannot yield separate layers that line up;
code-drawn primitives look like round 1. So the image tool serves DESIGN only, and every sprite pixel is
placed by hand in an indexed grid, on one rig that all layers share.

### 3.1 Tools first (tools/)
- `tools/ramps.json` (copy of section 2) and `tools/check.py`: per PNG, report off-palette pixels (must be 0),
  semi-alpha (must be 0), source colours used outside their region, frame bbox, feet on row 63, lone pixels
  (under 3%), and, for character 2, the luminance gap between face and beard pixels.
- `tools/grid.py`: converts between PNG and indexed text grids (one character per pixel, `.` transparent,
  a legend at the top of each file mapping characters to `ramp:shade`, e.g. `a=skin:0 ... e=skin:4`,
  `o=outline:0`). You edit grids, render, and LOOK. Previews at 8x go to scratch/preview/.
- `tools/assemble.py` and `tools/compose.py` (below). No `draw.ellipse`, `draw.rectangle` or polygon fills
  for anything that ends up in a layer: shapes are painted in grids.

### 3.2 Concept plates (image tool, design only)
Per lineup character, one plate of about 800x1000 on flat #7a7a7a: front and left profile, section-1
proportions, sun from the left, prompt like "grounded figure study, mature illustration, ink and wash,
weathered working clothes, muted earth palette". Use them for costume construction, folds and facial
character. Never downscale one into a layer or sample its colours. Regenerate any that drift cute or heroic.

### 3.3 The rig (the single source of alignment)
`src/rig.json` holds, for each body (man, woman), each direction and each frame, integer anchors:
`head` (top-left of the 16x16 head patch, which is skull origin minus (5,4) so horns and hair volume fit),
`torso` (top-left of the torso patch), `hand_L`, `hand_R`, `bob` (dy), the pose name for each arm
(`fwd`, `mid`, `back`) and each leg (`contact_front`, `contact_back`, `down_front`, `down_back`,
`pass_support`, `pass_swing`), and a z-order list (far arm, far leg, torso, near leg, near arm, head).
Every layer is built from PATCHES in src/<layer>/: `head_<dir>.txt`, `torso_<dir>.txt`,
`arm<pose>_<side>_<dir>.txt`, `leg<pose>_<side>_<dir>.txt`, plus optional `hem_<pose>_<dir>.txt` for robes and
cloaks. A layer only provides the patches it covers (hair: head only; staff: `held_<armpose>_<dir>.txt`
placed at `hand_R`). `tools/assemble.py` builds every frame of every layer from its patches using the SAME
rig, then applies `src/<layer>/fix_<dir>_<f>.txt` (hand-painted per-frame touch-ups, stored as a sparse grid
so reassembly is reproducible). All layers are placed by the same integers, so they line up pixel for pixel
by construction; @man/@woman outfits use their own body's rig, all other layers fit either.
Alignment checks: assemble every layer on both bodies for every frame and write scratch/align/ sheets at 6x
with the rig anchors marked; check.py fails if skin shows between outfit and body where the outfit should
cover (waist, shoulders, wrists, ankles), if hair covers crown+3..crown+4 between cols 21-26 in the down view, or if any
layer has pixels outside its body's silhouette by more than its allowance (cloak/robe/hair/hood/staff).

### 3.4 Order of painting
1. Bodies, down frame 0, with an 8x preview beside a same-scale world crop; face last, repainted until it
   reads as a specific adult. Then left view, then walk poses. 2. Head layers on the man, checked on the
   woman. 3. Outfits @man, then @woman from the woman's rig. 4. Staff. 5. Right and up rows: frame 0 repeated.

### 3.5 The walk (6 frames, DOWN and LEFT required)
Cycle (frame: legs / arms / bob): f0 pass (left leg supporting, right leg swinging, feet nearly together; this
is also the standing pose, so both soles touch row 63) / arms mid / bob 0; f1 contact, right foot forward /
left arm fwd, right arm back / bob +1; f2 down, right knee bent, weight on it / arms still apart / bob +2;
f3 pass, mirrored / arms mid / bob 0; f4 contact, left foot forward / right arm fwd, left arm back / +1;
f5 down / +2. bob moves head, torso and arms down; the planted foot never leaves row 63, the bent knee
absorbs the drop. Play at 110 ms per frame. If the +2 to 0 step pops, keep it and make the pass pose's
support leg visibly straight, rather than flattening the bob.
- LEFT view: contact feet are 12-14 px apart heel to toe; the swing foot at pass is lifted 2 px with the toe
  down; the far leg and far arm are one shade darker (occluded) and partly hidden; the near hand travels
  about 4 px forward and back of the hip, rising 1 px at the extremes. The torso leans 1 px forward on
  contact and down frames. Cloth trails: cloak hem and robe hem lag one frame behind the legs.
- DOWN view: the forward foot sits 2 px lower and 1 px larger than the back foot; the back foot's heel
  rises (1-2 px shorter); knees alternate (a bent knee shows as a 1-px shade-0 crease and a shorter shin); the
  forward hand drops 1 px and moves 1 px inward, the back hand rises 2 px and slides partly behind the hip;
  the hem of a tunic or robe swings 1 px toward the back leg. The legs must visibly PASS each other in the
  sequence: check by flicking f1, f3, f4.
- Robes and cloaks: `hem_<pose>` patches swing the hem and show the feet alternately; no visible feet fails.
- Watch scratch/walk-check.gif at 4x for every outfit on both bodies; glide, shuffle or march means fix poses.

### 3.6 Light on the other rows
LEFT row: the figure faces the light, so its front is lit. RIGHT row: start from the mirrored left frame,
then re-shade so the light still comes from screen-left (the figure's back is now lit, its face in half
shadow) and move the ink outline to the new shadow side. UP row: lit on screen-left like the down view.

### 3.7 Composites (tools/compose.py)
Recolour each layer by exact-hex mapping from source to target ramp, stack in SPEC order, then build every
image SPEC lists. in-world: nearest-neighbour 2x on market-normal-zoom.png (square pixels; note it), 4x on
market-close-zoom.png; the six on SUNLIT flagstones in natural groupings (two talking, one passing, one by
the monument), never in a row. Under each, a soft dark ellipse (about 0.7 x 0.22 of sprite
width, black at 35-45% alpha, blurred, centre shifted 2 sprite px to the right to agree with the scene's
shadows). Shadow alpha lives only in the composite, never in a layer.

## 4. Self-check (do all of it; redo anything that fails, then check again)
- [ ] check.py: 0 off-palette, 0 semi-alpha, source colours only in their regions, feet on row 63 in every
      frame, adult heights 59/56 px.
- [ ] Alignment sheets: every layer on both bodies, every frame, no gaps or drift.
- [ ] At 1x, on #7a7a7a: can you tell the six apart by silhouette alone? Does each have a face (eyes, nose,
      mouth, jaw) and not a blob? Would anyone call them cute? If yes, longer limbs, smaller features,
      squarer jaws, darker values, fewer highlights.
- [ ] Character 2 (very dark skin, black hair, full beard): face readable at 1x and 2.3x; hair black,
      not blue or purple. Character 1's red hair is copper, not orange candy.
- [ ] Ink only on shadow side and bottom; lit edges dissolve; no interior line that is not an overlap.
- [ ] Light from the left in all four rows (right row re-shaded, not mirrored).
- [ ] Walk GIFs: legs pass, arms swing opposite, the body bobs, feet stay planted, robes show feet.
- [ ] Open out/in-world.png at FULL SIZE; look at each person for ten seconds beside timber, plaster and
      stone. Does this person belong in this street? Same light, texel density and warmth, darker than the
      flagstones as a mass, no glow, halo or sticker look? Then in-world-close.png for faces and edges. If a
      figure looks pasted on, find why (too light, outline too heavy, too saturated, detail too fine or
      coarse, wrong light side) and repaint the layer, not the composite.
- [ ] Every out/ image viewed at 1x and 4x; honest weaknesses in NOTES.md.

## 5. Output layout (everything deliverable under out/)
```
out/ramps.json
out/body/man.png  out/body/woman.png                         (288x256 each: 6 frames x 4 rows of 48x64)
out/feature/elf-ears.png  out/feature/horns.png
out/outfit/labourer@man.png  out/outfit/labourer@woman.png
out/outfit/ranger@man.png    out/outfit/ranger@woman.png
out/outfit/mage@man.png      out/outfit/mage@woman.png
out/hair/short.png  out/hair/long.png  out/hair/braid.png  out/beard/full.png  out/head/hood.png  out/held/staff.png
out/lineup.png          (six characters, down, standing, 1x and 4x on #7a7a7a)
out/in-world.png  out/in-world-close.png
out/turn.png            (character 1, four directions, 4x)
out/walk.png  out/walk.gif   (characters 1 and 2 walking down and left)
out/swatch.png          (character 2 in all six skin tones; character 1 in all eight hair colours)
out/NOTES.md            (direction, ramps, @man/@woman variants and why, method, honest weaknesses)
```
Rows down, left, right, up; frames 0-5 left to right. Keep src/ and tools/ beside out/ for later rounds.
