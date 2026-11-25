# BRIEF: "Same Sun" (round 2 figure style sample, lit lane)

Read SPEC.md first, then this brief, then study world/market-normal-zoom.png and world/market-close-zoom.png at
full size and cropped at 4x before you draw anything. CODEX-WORKFLOW.md tells you how the laptop works; its
section 1 sprite numbers (32x48, ~3 heads, #24161f outline, "Octopath-like") are from an old job and do NOT
apply here. Your folder holds only SPEC.md, CODEX-WORKFLOW.md, world/ and this file: write every tool you need
yourself under tools/, intermediates under scratch/, deliverables under out/. Never look for or open other
sprites or art folders.

## 1. Direction

**Same Sun.** These are adults standing in a sunlit stone market at 11 in the morning, and the light on them
is the light on the walls behind them: warm key from the upper left, cool desaturated shade, soft occlusion in
every crease, a little warm bounce from the pale flagstones on the undersides near the ground. Think of
tonal figure painting and grounded realist illustration, reduced to 32 texels per metre: forms are carved by
light and shadow planes, not by outlines or colour fills. Restrained, weathered, practical clothes. Nothing
cute: small heads, small 1 px eyes, long necks, real shoulders, neutral expressions.

### What the world shows (measured from the screenshots; match it)
- Sun: high, from screen-left and slightly toward the camera. Cast shadows run up and to the right on screen
  (see the fountain spire). Camera-facing and left-facing planes are lit; right-facing planes are in shade;
  top planes (roof slopes, step tops) are brightest; undersides are darkest.
- Lit materials sit at warm hue (OKLCH h about 75): lit flagstone #c6b091, plaster #d3bd99, cobble #716454.
  Shade is neutral to cool violet-grey: flag in shade #4f4b4b, cobble in shade #1c1e2a, wall in shade
  #3e3c40. Shadow side of oak and stone falls to near-black (#18141b). Contrast between lit and shade is strong.
- No outlines anywhere in the world. Forms separate by value; joints between pieces are 1-texel dark seams
  (flagstone grout #413839, timber gaps). Detail is chunky: a cobble is 4 to 6 texels, a plank 3 to 5, grain is
  1 px streaks. There is fine texel speckle on stone, never on smooth wood or leather.

### Light rule (the core of this direction)
The sun is fixed in SCREEN space, not to the figure. Sun vector L = normalize(-0.60, +0.55, +0.58) with x to
the right, y up, z toward the camera. So:
- Facing down: figure's screen-left half lit, screen-right half in shade, tops of head/shoulders brightest.
- Facing left: the face and chest are lit (they face the light); the back is in shade.
- Facing right: the face and chest are in shade; the back and the back of the head catch the light.
- Facing up: the back is seen; screen-left lit as in the down view.
- Therefore the RIGHT row is never a pixel mirror of the LEFT row. Mirror the geometry, then relight.

### Proportions (32 px = 1 m; feet on row 63; figure centred on x 23.5)
Rows (y) for man (58 px tall, head 8 px, 7.25 heads) / woman (52 px, head 7 px, 7.4 heads): crown 6/12,
eye row 10/15, chin 13/18, shoulder top 16/21, armpit 21/25 (bust 26), waist and elbow 28/31, crotch 35/38,
wrist 36/39, fingertips 40/42, knee 49/51, ankle 61/61, sole 63/63. Shoulder width 14/11 px, hips 10/11 px.
Neck visible 2 px (man 3 wide, woman 2). Arms reach mid-thigh. Never enlarge heads for "readability".
Heights differ, so every layer above the body gets @man and @woman variants (e.g. outfit/labourer@man.png);
the rig generates both at no cost.

### Faces (hand-authored pixel maps, pasted at the rig's head anchor)
Digits are skin ramp indices (0 darkest .. 5 sunlit); b = brow (hair ramp 1), e = eye (eye ramp 0 on the
shade side, eye ramp 1 on the lit side), . = whatever is behind (hair layer usually covers rows 0-1).
Man, facing down (6 wide; light from the left):
```
r0  . 4 4 3 2 .
r1  4 5 5 4 3 1
r2  4 5 5 4 3 1
r3  4 b b 4 b 1     brows: lit side 2 px, shade side 1 px
r4  3 e 4 3 e 1     eyes 2 px apart, at mid-head height (adult)
r5  3 4 5 2 3 1     nose: lit plane 5, cast shadow 2 down-right
r6  3 3 1 1 2 1     mouth: 2 px of 1, straight, no smile
r7  . 3 4 3 1 .     chin, then neck in 1/2 (head shadows the neck)
```
Woman facing down: the same with r2 removed (7 rows), r7 = `. . 4 3 . .`, 1 px brows, mouth `2 1`.
Facing left (profile, face toward the light), columns front to back, nose 1 px proud of the brow line:
```
r0  .  .  4 4 3 .
r1  .  5  5 4 3 2
r2  .  5  5 4 3 1
r3  .  4  b 4 3 1
r4  .  4  e 3 2 1     ear at back cols 3-4 rows 4-5 (2 with a 1 inner)
r5  5  4  4 3 2 1     nose tip
r6  .  2  4 3 2 .     mouth corner 2
r7  .  4  3 2 1 .     firm chin, jaw line to the ear in 1-2
```
Facing right: mirror the shape, then the face plane drops to 2-3, the forehead and nose tip keep a 3, the back
of the skull and the top of the ear get a 1 px 4 rim. Back view: no face; neck 2 on the left, 1 on the right.
Never: eye whites, catchlights, pink cheeks, mouth curves, eyes larger than 1 px, eyes below mid-head.

### Hands, feet
- Hands: 2x2 (man 2x3 when swung forward toward camera): top-left pixel 4, others 3, bottom-right 1. Thumb is a
  single 3 pixel on the inner side in the down view. No fingers. Swung-back hand: 2x1, partly behind the hip.
- Feet/boots (leather ramp): down view each 3 px wide x 2 tall, toe-cap top row 3 on the left foot and 2 on
  the right, sole row 0; 1 px gap between feet. Profile: 6 px long, 2 tall, heel 1 px higher, sole row 0,
  instep top row 3.

### Cloth, leather, metal, hair (match texture detail level)
- Cloth folds are value clusters 2 to 4 px wide, never single pixels: gravity folds hang from belt and
  shoulder; at elbow, knee and hip they radiate. Each fold = lit ridge (idx 3-4 on the left side of the ridge),
  core shadow (idx 1) on its right. Wool may carry sparse 1 px speckle (max 2% of its pixels), linen none.
- Seams, hems, belt lines, cloak edges: 1 px of the upper material's idx 0, like flagstone grout.
- Leather: smooth planes, 2 or 3 values per piece, worn edge highlight 1 px idx 4 only on top-left edges.
  Straps 2 px wide with idx 0 lower edge. No stitching dots.
- Metal: buckles and clasps 2x2 brass, one idx 2 glint on the upper-left pixel. Iron glint only on the lit side.
- Hair: masses built from tapered clumps 2-3 px wide following the flow; a 1 px sheen arc of idx 3-4 across the
  upper-left of the crown (never a halo all round); idx 0 where hair meets the face/neck and at the bottom.
  Long hair falling in front of the shade-side shoulder sits at idx 1-2. Black hair uses its own neutral ramp
  only; never tint it blue or purple to show shading.
- Hair, hood and headwear layers may draw 1 px of skin ramp idx 1 directly under their lower edge onto the
  FACE only (forehead, temples, rows r0-r5): this is the cast shadow of the fringe/hood. Never onto the neck or
  clothes (an outfit might be there).

### Edges (no outline)
No black or universal outline. Silhouette pixels on the shade side (right and bottom) use their own ramp's idx 0;
on the lit side (left and top) they use one step below the interior value next to them, so the figure still
separates from the pale flagstone (#c6b091) without a drawn line. Where two materials meet, the upper/front one
gets a 1 px idx 0 seam. Check: each lit-side edge pixel differs from #c6b091 by at least 0.12 OKLab L; if
not, step it further down its ramp until it does (pale skin and linen will need this).
Readability without looking pasted on: value structure first: at 1x the figure must read as three tones (sunlit, half, shade) with the face as the
lightest small shape on dark-skinned figures too. Lower legs and hem run about one step darker than the torso
(ground occlusion, as the walls darken at their feet in the screenshots), except the warm bounce band below.

## 2. Ramps (write this as out/ramps.json; darkest first)
5-shade ramps: 0 seam/core shadow/occlusion, 1 shade, 2 half-tone, 3 lit, 4 sunlit. Skin (6): 0 occlusion,
1 shade, 2 bounce, 3 half-tone, 4 lit, 5 sunlit tops. Darks drift cool and grey, lights warm, as the world's
materials do; hair ramps barely drift, so black stays black.
```json
{
  "targets": {
   "skin": {
    "very_light": ["#5f4645", "#7f5f58", "#9f7a6a", "#be987f", "#dcb69e", "#fbd6bd"],
    "light": ["#573939", "#785149", "#996c59", "#b8896b", "#d6a78a", "#f4c6a9"],
    "medium": ["#4c2b2b", "#6c4038", "#8b5944", "#a97452", "#c5916f", "#e1ae8d"],
    "olive": ["#442723", "#613d2f", "#7e563b", "#99714a", "#b48d67", "#cfa984"],
    "brown": ["#311617", "#4b2923", "#673e2e", "#81553b", "#996e54", "#b2886d"],
    "very_dark": ["#1c080a", "#341917", "#4d2c23", "#664231", "#7d5948", "#95715f"],
    "ash": ["#2d2d30", "#48484c", "#656569", "#838387", "#a4a3a6", "#c5c3c6"]},
   "hair": {
    "black": ["#0d0b09", "#1d1917", "#2e2926", "#3f3a37", "#514c48"], "dark_brown": ["#1c0d08", "#2f1d15", "#432f23", "#564236", "#69574b"],
    "brown": ["#31170e", "#4a2b1d", "#64412c", "#7c5943", "#93735e"], "auburn": ["#3b0d09", "#582216", "#773822", "#91543b", "#a97057"],
    "blond": ["#604020", "#815e34", "#a28049", "#c3a26d", "#e4c695"], "red": ["#4d0e0c", "#712719", "#954025", "#b36041", "#cf8261"],
    "grey": ["#36322f", "#56514e", "#78736f", "#9c9793", "#c1bdb8"], "white": ["#67625d", "#87827c", "#a8a49d", "#cbc7bf", "#eeebe4"]},
   "eyes": {
    "brown": ["#250f07", "#442918", "#604737"], "hazel": ["#2f1a00", "#574315", "#816f49"],
    "green": ["#00270e", "#305023", "#627a50"], "blue": ["#12213b", "#344d6f", "#6a7a9c"],
    "grey": ["#1e2227", "#494f56", "#7c8088"], "amber": ["#481900", "#814d00", "#b7884f"]},
   "clothA": {
    "linen": ["#352420", "#5c493b", "#827259", "#ac9c83", "#d8c8b0"], "madder": ["#300b1a", "#551d26", "#7b332c", "#995241", "#b5735d"],
    "moss": ["#072017", "#253a24", "#4b5530", "#6e714a", "#908f6b"], "woad": ["#121b28", "#293546", "#425166", "#606e84", "#828ca2"]},
   "clothB": {
    "oak": ["#1c0c0c", "#38231c", "#543c2b", "#6f5845", "#8b7663"], "charcoal": ["#0e0d0d", "#232120", "#3a3736", "#514f4d", "#6a6867"],
    "ochre": ["#3a1911", "#5f3818", "#7e5c20", "#a08147", "#c5a672"], "verdigris": ["#07191c", "#183333", "#2e4f49", "#4d6b5f", "#708778"]}
  },
  "fixed": {
    "leather": ["#1e0b0c", "#3e231c", "#5f3f2b", "#7d5f47", "#9c8069"], "iron": ["#191a1e", "#44464a", "#75767a", "#abaaac"],
    "wood": ["#281416", "#4f3126", "#73543b", "#967a62"], "horn": ["#170f10", "#3d312d", "#65594f", "#8d847c"],
    "underlinen": ["#483937", "#756355", "#a0927c", "#d0c2ae"], "brass": ["#55332e", "#947037", "#cfb37e"]
  }
}
```
Add `"source"` with the hex lists of targets skin.medium, hair.brown, eyes.brown, clothA.madder, clothB.oak
(layers are drawn in these). Recolouring maps source index i to target index i. Verify no source colour is
in a fixed ramp.
Body underclothes use fixed underlinen; elf ears and horn-bearers' skin use the skin ramp; horns use horn.
**Black hair:** its ramp is neutral warm-grey with no hue drift; the sheen is #514c48, never bluish.
**Very dark skin + black hair + full beard (character 2) stays readable because:**
- the face's lit planes (forehead, nose ridge, lit cheek) use skin 4-5 (#7d5948, #95715f), which are lighter
  and redder than any black-hair shade; keep at least the r1-r2 forehead, the r5 nose pixel and one lit cheek
  pixel (r5 col 1) clear of beard and hair;
- the beard stops at the cheekbone line (r5), the moustache is 1 row (r6) with a 2 px mouth gap in hair 0;
- the beard's lit-side edge uses hair 3-4 (#3f3a37, #514c48), its skin-side boundary is never outlined,
  and the separation is carried by hue (red-brown skin vs neutral hair) plus that value step;
- eyes use eye 0 with skin 3-4 on their nose side and above; brows in hair 1 over skin 4.
Check in swatch.png that this face reads at 1x on #7a7a7a and in-world at 2.3x. If not, raise skin very_dark
indices 4-5 by up to 0.04 OKLab L (keep the hue) and record the change in NOTES.md.

## 3. Method: rig-driven native render at 4x, lit by one sun, plus hand-authored micro-maps
Native construction alone guarantees exact alignment and one consistent light on every layer; round 1 failed
with flat template fills, so here every volume is modelled and lit from normals. You may use the image tool
ONLY for one large concept sheet per outfit (front and side, lit from upper left) as a reference for cut and
fold placement; never downscale, trace or key it into a sprite.

1. **tools/rig.py.** One skeleton per body type (man, woman): pelvis, spine, neck, head, and for each side
   shoulder, elbow, wrist, hip, knee, ankle, toe. Coordinates in the 4x space (192x256 per frame). For every
   direction x frame it returns joint positions, a bob offset and a 1x head anchor (top-left of the face map),
   from joint angles and fixed bone lengths (proportion table). EVERY layer reads joints only from rig.py and
   stores no coordinates of its own: this is the alignment guarantee.
2. **tools/render.py.** Each layer is a list of primitives attached to bones: capsules (limbs, sleeves,
   trouser legs, braid), ellipsoids (head, chest, hips), tapered panels (cloak, robe skirt, apron) and clumps
   (hair). Each primitive writes, per 4x pixel: material ramp name, depth z and a normal. Cloth panels add a
   fold field (sine ridges along given fold lines) to the normal. Then light every pixel:
   `v = 0.22 + 0.70*max(0, N.L)*S + 0.10*(0.5+0.5*N.y) + B - AO`, where S = 0 if a nearer primitive of the
   SAME layer lies along L (self shadow, e.g. arm on torso), B = 0.10*max(0,-N.y) for pixels in the lowest
   14 px (1x) of the figure (warm ground bounce), and AO = 0.12 within 1 px (1x) of any primitive overlap,
   armpit, crotch, under chin, under belt, inside hem.
3. **Downsample** to 48x64 with fixed 4x4 blocks aligned to the frame origin: material = majority vote, value =
   mean. Map value to ramp index with thresholds (5-shade: 0.16/0.34/0.54/0.74; skin 6: 0.14/0.28/0.42/0.58/0.76).
   Index 0 is only placed by the edge and seam rules and by AO, not by plain shading. Then apply edge rules from
   section 1 and remove lone pixels (a pixel unlike all 4 neighbours takes the majority neighbour index), except
   eyes, glints and intended speckle.
4. **Micro-maps.** Paste the face maps (section 1), hands and feet at the rig anchors after downsampling, in
   tools/maps.py, per body type and direction. Write any hand fix as a patch (layer, body, direction, frame, x,
   y, ramp, index) in tools/patches.json, applied last, so a re-render never loses it. Patches may only touch
   pixels inside that layer's own mask.
5. **Layer files.** Render each layer alone (transparent elsewhere), alpha on/off only, colours from the
   source/fixed ramps only. Lay frames out 6 across (frames 0-5) x 4 down (down, left, right, up) = 288x256.
6. **Walk (6 frames, frame 0 = standing).** Frame order: 0 pass (standing: feet together, arms down, bob 0),
   1 contact (left foot forward, bob +1), 2 down (weight on left, knees bent, bob +2), 3 pass (right leg
   swinging through, bob 0), 4 contact (right foot forward, bob +1), 5 down (bob +2). Bob moves the pelvis and
   everything above it down by that many pixels; feet stay on row 63 for the supporting foot.
   - Left view: at contact the heel-to-toe span is 14-16 px, front leg straight with heel down, back leg with
     heel lifted 2 px; in pass frames the swinging foot is 1-2 px off the ground beside the support leg and its
     knee is bent forward 2 px. Arms swing opposite the legs: hand travels 5 px forward/back of the hip; the far
     arm is drawn one step darker and partly hidden.
   - Down view: the forward foot is 1 px lower and 1 px wider (nearer the camera), the back foot 2 px higher with
     a shortened shin; the arm on the side of the forward leg is back (hand 2x1, higher, partly behind the hip),
     the other arm forward (hand 2x3, lower). Shoulders counter-rotate: the forward-arm shoulder 1 px lower.
   - Cloaks, robe hems, long hair and braid lag one frame behind the legs (secondary motion, computed by the rig
     from the previous frame's leg angle) and swing 1-3 px.
   - Required: full walks for down and left. Right and up: standing frame properly relit (mirror geometry,
     recompute light) repeated across the row; full walks there too if time allows.
7. **Checks (tools/check.py)**: off-palette = 0; semi-alpha = 0; feet on row 63; for each layer and each
   frame, overlay on both bodies and confirm head-anchored layers start at the rig anchor (print a table);
   align.png = every layer's silhouette edge in a flat colour over each body, 8x, for all frames; no skin from
   the body shows through gaps between sleeve and torso or between trousers and boots in any walk frame.
8. **tools/compose.py** builds the composites from layers + ramps.json by exact-colour recolouring, and the
   ground shadow: a soft dark ellipse (#2a2226 at 45% opacity, 1.0 x 0.35 of the figure width, feathered),
   offset 2 px right and 1 px up from the feet centre, since the world's shadows fall up and to the right.

## 4. Outfits and layers (content)
- body: underlinen shirt and drawers, plain leather footwraps (so bare skin never shows at the feet); neck,
  face, hands and forearms in skin. Same silhouette under every outfit.
- labourer: rolled linen shirt (clothA) with forearms bare, sleeveless jerkin (clothB) laced at the front,
  leather belt with brass buckle, breeches (clothB) tucked into leather boots, a leather apron on the man,
  a kirtle-length skirt over the breeches on the woman. Wear shows as darker idx clusters at knees and hem.
- ranger: calf-length hooded cloak (clothB) with the hood lying down on the shoulders in 3-4 folds, leather
  jerkin with two straps, brass cloak clasp, trousers (clothA), tall boots, bracer on the near forearm.
- mage: ankle-length robe (clothA), open overrobe or tabard (clothB) from the shoulders, rope belt (leather
  ramp), sleeves widening to the wrist, hem 1 px above the ground with the toes of the boots showing.
- hair: short (cropped, 1-2 px over the skull, side part, ears visible), long (past the shoulders, parted,
  falling behind the shade-side shoulder in the down view), braid (pulled back, one 2 px braid hanging to
  mid-back, visible over the shoulder in the down view). beard/full: section 2 rules.
- feature: elf ears 4 px long, swept back and up from the eye row, tips extending 2 px beyond any hair
  silhouette so they survive the hair layer; horns: ridged, 5-6 px, rising from the temples and curving back,
  lit on the upper-left, idx 0 at the root, casting nothing onto the face.
- head/hood: hood up, deep, its opening 1 px back from the face edge; the hood throws skin idx 1 across row r1-r2
  of the face (per the cast-shadow rule) while eyes stay visible.
- held/staff: plain oak staff (wood ramp, iron ferrule at the foot), 54 px tall, held in the hand from the rig's
  wrist joint, top within the frame, lit on its left edge (idx 3), shade edge idx 0.

## 5. Self-check (do all of it; redo whatever fails, then check again)
- [ ] View every layer sheet at 1x and 4x, and lineup.png at 1x and 4x, with your image viewer.
- [ ] Faces: on all six at 1x, two eyes, a nose plane and a mouth line are visible and each reads as an adult;
      character 2 (very dark skin, black hair, beard) included.
- [ ] Black hair looks black, not blue, purple or brown, at 1x and in-world.
- [ ] Light: every figure is lit from the screen-left, top planes brightest, right sides in shade, and the
      right-facing frame is relit, not mirrored. Compare a figure's lit/shade values with a nearby wall in
      in-world-close.png: the ratio should feel the same.
- [ ] Nothing cute: heads not bigger than the table, no eye whites or catchlights, no saturated cloth, no
      round toy shapes, hands and feet small.
- [ ] Layers line up: align.png shows no offsets or gaps in any frame, for both body types.
- [ ] Walk: play walk.gif. Legs pass each other, arms swing opposite, the body visibly rises and falls,
      hems trail. If a frame looks like the standing pose with a twitch, it fails.
- [ ] Detail level: put a 4x crop of a figure beside a 4x crop of the flagstones, timber and door: same pixel
      chunkiness, same contrast range, no smoother and no noisier.
- [ ] **Open in-world.png at full size and look at it as the owner will: does each of these six people belong
      in this street, under this sun, or do they look pasted on?** Check: their light side matches the walls,
      their shadow falls the same way as the fountain's, their colours sit with plaster, oak, slate and stone,
      their edges are no harder than the timber edges. Then the same for in-world-close.png. Any "pasted on"
      figure is redone, not explained away.
- [ ] NOTES.md states honestly what still looks weak.

## 6. Output (under out/; sheets are 288x256, 6 frames x 4 rows: down, left, right, up)
```
out/body/man.png, out/body/woman.png
out/feature/elf-ears@man.png, elf-ears@woman.png, horns@man.png, horns@woman.png
out/outfit/labourer@man.png, labourer@woman.png, ranger@man.png, ranger@woman.png, mage@man.png, mage@woman.png
out/hair/short@man.png, short@woman.png, long@man.png, long@woman.png, braid@man.png, braid@woman.png
out/beard/full@man.png (and full@woman.png only if trivially produced)
out/head/hood@man.png, hood@woman.png
out/held/staff@man.png, staff@woman.png
out/ramps.json
out/lineup.png      six characters (SPEC order) facing down, standing, 1x row and 4x row, on #7a7a7a
out/in-world.png    the six pasted into market-normal-zoom.png at 2.3x nearest-neighbour, on open sunlit
                    flagstones clear of the fountain and labels, feet on the stones, ground shadow per step 8
out/in-world-close.png  the same on market-close-zoom.png at 4x
out/turn.png        character 1, four directions, 4x
out/walk.png, out/walk.gif   characters 1 and 2 walking down and left (4x, ~110 ms per frame)
out/swatch.png      character 2 in all 7 skin tones; character 1 in all 8 hair colours (1x and 4x)
out/align.png       layer-alignment check from step 7
out/NOTES.md        direction, ramps and any changes to them, method, honest weaknesses
```
Lineup characters: 1 woman, ranger, long hair red, eyes green, skin light; 2 man, labourer, short hair black,
full beard, skin very_dark; 3 woman + elf ears, mage, braid white, eyes blue, staff; 4 man + horns, skin ash,
labourer, short hair dark_brown, eyes amber; 5 older man, mage, long hair grey, beard grey, hood up (age is
carried by grey hair and beard; the body layer stays shared); 6 man + elf ears, ranger, short hair blond, eyes
hazel. Pick cloth colourways so the six differ and none is brighter than the plaster.
