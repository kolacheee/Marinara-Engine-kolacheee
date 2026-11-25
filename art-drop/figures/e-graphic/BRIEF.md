# BRIEF: "Enamel & Ink" town figures (style sample)

You are making a style sample of layered pixel-art town figures. Read `SPEC.md` first: it says WHAT to
deliver and it wins on any conflict about content. This brief says HOW it must look and how to make it.
`CODEX-WORKFLOW.md` describes earlier jobs; take its lessons, but follow THIS brief where they differ
(no image tool, no Aseprite, no `#24161f` outline, no old palette).

Hard rules:
- Do not look at, open or search for any existing sprite or art file anywhere on disk (no `art-drop/`, no
  `packages/client/public/hd2d/`, nothing else). Work only from SPEC.md and this brief.
- Do not use the image-generation tool. Every pixel is placed by your own Python code.
- `px.py` loads an old `ramps.json` beside itself and checks against an old palette: do NOT run it as-is.
  You may copy its generic helpers (lone-pixel count, zoom, alpha check, bbox) into your own checker.
- Work in this folder: code in `tools/`, intermediates in `scratch/`, deliverables in `out/`.

## 1. The direction

**Enamel & Ink.** Each townsperson looks like a small enamel pin or a two-colour screenprint: a closed,
heavy ink outline around a few flat, confident shapes, each shape filled with ONE base colour, a single
hard-edged shadow cut on the side away from the light, and one small bright accent where the light hits.
No gradients, no dithering, no anti-aliasing, no texture noise, no strand-by-strand hair. Detail is rationed:
every figure gets at most about five deliberate "story" details (belt buckle, sash knot, hood point, staff
knot, braid tie), and each one is at least 2 px so it survives at 1x. Think heraldry, woodcut, paper
cut-outs and bold poster design: shapes first, the silhouette alone should tell you who this is.

Why it works in this engine: the town is busy, high-frequency 3D texture under bloom and tilt-shift. These
figures are the opposite: low-frequency, flat, high-contrast and ringed in near-black, so the eye finds
them instantly, in daylight and under lamp light alike.

Palette mood: "dusk enamel". Saturated, warm mid-tones; shadows pushed cool (toward violet/blue-green);
highlights pushed warm (toward cream). Each ramp step is a big value jump (about 20 L* or more) so the
three shades read as three separate flat pieces, never as a blend.

### Pixel rules at 32x48

**Shades.** Every ramp has exactly 3 colours: `[0] shadow, [1] base, [2] light`. Per region, by area:
base about 60-70 %, shadow about 20-30 %, light at most 10 %. Light comes from the TOP-LEFT of the screen
in every direction (it matches the world's light). Shadow = the right side and the underside of each form
(right third of the torso, right edge of each arm and leg, under the chin, under the hair fringe, under the
belt/sash). Shadow is a hard-edged shape with straight or single-step diagonal edges, never a speckle.
Light = short runs (2-4 px) along the top-left edge of a form, directly inside the outline: crown of the
hair, top of the left shoulder, top-left of the head, the left horn ridge. Never use light in the
lower half of a form.

**Outline.** One colour, `#1a1220` (ink), 1 px. Every layer carries its own outline: the exterior ring of
the layer's filled shape, computed by 4-neighbour adjacency (an empty pixel that touches a filled pixel
left/right/up/down becomes ink; diagonal-only corners stay empty, which rounds every corner by one
pixel). Hard rule, checked automatically: in every layer sheet and every composite, any opaque pixel that
touches a transparent pixel (4-neighbour) must be ink. Interior ink lines are allowed ONLY at these
joints: arm against torso, the belt or sash top and bottom edges, a hem, the hood opening, the cloak's
front edges, and between the two legs. Everywhere else, shapes separate by value, not by lines.

**Proportions.** Chunky and upright, about 3.4 heads tall, so faces stay legible. Both bodies are 44 px
tall (rows 4-47) and share the SAME head, in the SAME place, so every hair/beard/headwear layer fits both.
Template for the down view, standing (x = column 0-31, y = row 0-47; the figure is centred on the line
between columns 15 and 16). Coordinates include the ink outline. You may shift any value by 1 px if it
reads better, but then write the final numbers in `tools/rig.py` and use them everywhere.
- Head: x 10-21, y 4-16 (12 wide, 13 tall). Top two corners cut by 2 px so the skull is round. Chin rows
  y 15-16 narrow to x 12-19 (man) or x 13-18 (woman: a softer, narrower jaw).
- Neck: x 14-17, y 17 (one row, skin, mostly skin[0] because it sits under the chin).
- Torso: shoulders at y 18. Man x 9-22, woman x 10-21. Waist y 26-27: man x 11-20, woman x 12-19.
  Hips y 28-30: x 11-20 for both.
- Arms hang beside the torso with one ink column between arm and torso: man arms x 7-9 / 22-24,
  woman x 8-10 / 21-23, y 18-29. Hands y 29-31.
- Legs y 31-46, left leg x 11-14, right leg x 17-20, two empty columns (15-16) between them. Feet y 44-47,
  each foot 4 px wide, toes pointing slightly outward (outer foot pixel extends 1 px past the leg).
- Side view: head 10 px wide, torso 8 px deep, one arm in front of the torso, legs one behind the other.
- Up view: same widths as down; head shows back of skull (hair layers cover it).

**Faces and eyes.** Eyes are the most important pixels on the sheet.
- Down view: two eyes, each 1 px wide by 2 px tall, at x 13 and x 18, y 10-11. Top pixel eyes[0]
  (reads as pupil/upper lid), bottom pixel eyes[1] (the eye colour). Three skin columns between the eyes.
- No mouth, no nose on the down view. The face reads from: the eyes, a 1 px skin[0] band directly under
  the hair fringe, skin[0] on the right cheek column (x 20) and along the right half of the chin rows.
- Woman: one ink "lash" pixel at the outer-top corner of each eye (x 12 and x 19, y 10). Man: none; his
  jaw is wider and squarer. That is the whole difference in the face. Do not add eyebrows, blush or lips.
- Side view (left): one eye, 1x2, 2 px behind the front edge of the face, top eyes[0], bottom eyes[2] (the
  lit eye). The nose is a single 1 px forward step in the profile outline at eye-bottom level. Ear: a 2x2
  skin[0] patch at the head's centre-back.
- Up view: no face. The body sheet shows two 1 px skin[0] ear nubs at the sides of the head.
- Every face must look forward in the down view, sideways in the side view. A face that looks cross-eyed,
  asleep, or off-centre by 1 px is a failure. Check eye symmetry by code.

**Hands and feet.** Hands are 3x3 mittens: skin[1] with skin[0] on the right column and bottom-right pixel,
no fingers, no thumb. Bare feet in the body layer are 4x3 skin blobs (skin[0] along the bottom row). Shoes
and boots belong to outfits: 4 px wide, 3-4 px tall, leather, with a 1 px leather[2] toe glint on the left
foot only (light side), sole row = ink, sitting exactly on row 47.

**Hair clusters.** Hair is 2-4 big clumps, never strands. Each clump: hair[1] fill, hair[0] on its lower
and right edge (1-2 px), and at most ONE hair[2] sheen stroke per hairstyle: a 3-4 px dash on the top-left
of the crown. The fringe edge over the forehead is a zigzag of 2-3 points (V notches in hair[0]); it covers
the forehead down to y 8 at most, so it never touches the eyes. Long hair falls in one or two flat panels
behind the shoulders (visible beside the neck in the down view, full panel in the up view). The braid is
a chain of 3x3 "beads" alternating hair[1]/hair[0] down the back, over one shoulder in the down view, with
a 2 px cloth-B tie at the end. Short hair stays inside the head silhouette plus 1 px.

**Cloth folds.** At most 2 folds per garment per view. A fold is one 1 px line of cloth[0], 2-4 px long,
starting from an anchor (belt, sash, armpit, knee) and running straight or with one diagonal step. Hems
are a 1 px cloth[0] row directly above the ink edge. Garments are flat planes: shadow side = right third,
light = 2-3 px on the left shoulder only.

**Number of shades, per figure.** Ink + at most 3 shades in any ramp. Typical composite: ink, 3 skin,
2 eye (3 in side view), 3 hair, 3 cloth A, 3 cloth B, 3 leather = 18 colours. Never add a 4th shade.

**Race features.** Elf ears: skin ramp, leave the head at eye level (y 9-11) and point outward and up,
5 px past the head outline on each side, tapering from 3 px tall to a 1 px tip that is 2 px higher than the
base; skin[2] along the upper edge of the left ear only. They must clear the outer edge of ALL hair
layers (long hair panels must stop below/inside them). Horns: fixed bone ramp, from the temples
(x 11 and 20, y 5-6), curving up and outward like a ram's or goat's sweep, about 6 px long, 2 px thick at
the base and 1 px at the tip, one bone[0] ring notch across each horn, bone[2] on the left horn's upper
ridge. Horns must stick out beyond every hairstyle (they are the race read). They sit under hair, so hair
overlapping the base is correct.

**Layers and walk.** Walk is 4 frames: 0 stand, 1 left foot forward, 2 passing (like stand), 3 right foot
forward. In frames 1 and 3: head, torso and arms move DOWN 1 px; the stepping foot lifts 2 px and
moves 1 px outward; the planted foot stays on row 47; arms swing opposite to legs by 1 px (hand moves
1 px down and 1 px forward). These offsets live in `rig.py` as per-frame part offsets and EVERY layer uses
them, so all layers move together.

## 2. Ramps (exact hex, darkest first, ready for out/ramps.json)

Source ramps (recolourable; use each ONLY for its own region, never anywhere else):
```
"skin":   ["#8c4a3c", "#d48a62", "#f4c69c"]
"hair":   ["#4a2a52", "#8a4e86", "#c68ab8"]
"eyes":   ["#1e2c50", "#3c6cc8", "#94c4f4"]
"clothA": ["#1e4a3c", "#3a8052", "#84bc74"]
"clothB": ["#5c1c2c", "#ac3a3c", "#e8805c"]
```
(Hair source is a placeholder lavender on purpose so it can never be confused with leather or skin;
composites always show real colours.)

Fixed ramps (never recoloured; also list them in ramps.json under "fixed"):
```
"ink":     ["#1a1220"]
"linen":   ["#5e5058", "#a89888", "#e6dac2"]   body underclothes
"leather": ["#3c2218", "#7c4a2a", "#b67e4a"]   belts, boots, ranger jerkin
"wood":    ["#4c2c1a", "#8c5e34", "#c49656"]   staff shaft
"bone":    ["#5a4a44", "#ac9c84", "#eee2c6"]   horns
"brass":   ["#6a4612", "#c49030", "#f6da74"]   buckle, staff cap
```

Target ramps:
```
skin:   very_light ["#b07066","#efbea0","#fff0dc"]  light ["#9c5648","#e2a07a","#f8d4b0"]
        medium ["#7a4030","#be7850","#e6ae7e"]  dark ["#52291e","#8e5234","#bc7e52"]
        very_dark ["#381c1e","#683a2a","#a8663e"]  greygreen ["#3c524a","#6e8e74","#aac6a2"]
hair:   black ["#2c2640","#4c4466","#8478a4"]  brown ["#3a2420","#6a4230","#9e6c48"]
        chestnut ["#4a1e18","#8c3a24","#c86c3a"]  blond ["#8a5e2c","#d4a84e","#f8e290"]
        red ["#6a1a18","#c43e26","#f4843e"]  grey ["#4a4a5a","#8a8a98","#c6c6ce"]
        white ["#8a90aa","#d2d6e2","#fbf8f0"]  teal ["#1c4858","#2c8a8a","#78d2c2"]
eyes:   brown ["#2c1a10","#6c3a1c","#aa6a3a"]  hazel ["#38280e","#7a6a2a","#b4a452"]
        green ["#123a22","#2c8c40","#7cd472"]  blue ["#1a2a52","#3a6ad2","#8cbaf2"]
        grey ["#2a3038","#6a7a8a","#b2becc"]  amber ["#4a2a08","#c88018","#f8c240"]
clothA: forest ["#1e3a2a","#3a6a3e","#7aaa5a"]  madder ["#4a1424","#9c2a32","#da624a"]
        indigo ["#1a2048","#2e4a98","#6a8cd2"]  oat ["#5a4a3a","#a28a68","#e2cc9c"]
clothB: ochre ["#5a3a10","#b27a20","#f2c252"]  plum ["#3a1a42","#7a3a7c","#c272b2"]
        charcoal ["#26262e","#4c4c5a","#8c8c9a"]  teal ["#123c42","#24787a","#5cbaaa"]
```
Write ramps.json as `{"source": {...}, "fixed": {...}, "targets": {"skin": {"very_light": [...], ...},
"hair": {...}, "eyes": {...}, "clothA": {...}, "clothB": {...}}}`. SPEC.md shows skin targets as a list;
a named dict is clearer, so use names for all and say so in NOTES.md.
Suggested colourways for the lineup: ranger = clothA forest + clothB charcoal; labourer = clothA oat +
clothB ochre (char 2) or indigo + charcoal (char 4); mage = clothA indigo + clothB ochre (char 3), madder +
plum (char 5); the hood uses clothA, so it matches the robe.

## 3. Drawing method: native Python/Pillow from one rig

Draw everything natively at 32x48 in Python, pixel by pixel. Reason: exact palette by construction,
perfect alignment, and the hard outline rule is enforced by code rather than by hand-fixing.
1. `tools/rig.py`: the template above as data: part rectangles/anchors per direction (down, left, up)
   for each body (man, woman), and the per-frame walk offsets per part (head, torso, armL, armR, legL,
   legR). Nothing else in the code may hard-code a body coordinate.
2. Author each part as a small ASCII grid in code, one character per pixel (for example `.` empty,
   `o` ink, `0/1/2` skin shades, `a/b/c` cloth A, `d/e/f` cloth B, `h/i/j` hair, `l/m/n` leather ...).
   Grids make every pixel a deliberate decision and are easy to fix after looking.
3. Draw the BODY first. Build each frame by placing the parts at rig anchors plus frame offsets,
   back to front (far arm, legs, torso, near arm, head). Give each part its own 4-neighbour ink ring so
   the allowed interior joints appear automatically.
4. Draw every other layer AGAINST the body: build a mask of the body silhouette per frame and anchor the
   layer's parts to the same rig parts (a sleeve to the arm, a hem to the hips, hair to the head). Then
   fill, then add the layer's own ink ring. Covering pieces must cover the body's ink ring underneath them
   (a sleeve is at least as wide as the arm + its ink), or a stray body-ink pixel shows through.
5. The staff is held in the figure's right hand (screen-left in the down view). The staff layer is
   transparent exactly where that hand's pixels are, so the fist shows over the shaft. Staff: 2 px wood
   shaft from about y 6 to row 47, brass cap and one brass ring under the hand, moving with the hand's
   walk offsets.
6. Right = mirror of left (allowed by SPEC). Unused cells transparent; non-down directions repeat the
   standing frame in all 4 cells where SPEC allows.
7. `tools/compose.py` recolours by exact colour mapping (source[i] -> target[i] per ramp, fixed ramps
   untouched), stacks layers in SPEC order, and builds every composite. Do not resample anything except
   nearest-neighbour integer zooms.

## 4. Self-check (do all of it before you finish; redo any weak file, then check again)

Automatic, `tools/check.py` on every layer sheet and composite, printing a table:
- size 128x192 for layers; alpha only 0 or 255.
- every colour belongs to the ramps allowed for that layer (body: ink, skin, eyes, linen; outfits:
  ink, clothA, clothB, leather, brass; hair/beard: ink, hair, clothB for the braid tie; hood: ink, clothA;
  ears: ink, skin; horns: ink, bone; staff: ink, wood, brass). Any other colour = failure.
- outline rule: no opaque non-ink pixel touches a transparent pixel (4-neighbour). Must be 0.
- body: per cell bbox height 44, bottom row 47, horizontal centre within 15.0-16.5; eyes symmetric
  about the centre line in the down view.
- alignment: for each non-body layer, count its pixels lying more than 6 px from the body silhouette
  (excluding horns, ears, staff, long hair and cloak); report the number and look at any non-zero.
- lone pixels (no 4-neighbour of the same colour), eyes excluded: under 3 %.
- ramp share per region: light shade at most ~12 % of that ramp's pixels in a layer.

Look at it yourself (open the images; at 4x nearest-neighbour, plus the 1x versions):
- `scratch/overlay-<layer>.png`: each layer over both bodies, all 16 cells, 4x. Failure: any gap,
  double outline, body ink peeking through clothes, hair not seated on the skull, horns or ears hidden.
- At 1x and 2x on both lineup backgrounds, plus `scratch/ground-test.png` (draw a busy procedural
  cobblestone/plank texture in mid browns and greys, place the six characters on it at 2x and 3x).
  Failure: you cannot tell at a glance which way a figure faces, which is the ranger/labourer/mage,
  which ones are elves or horned, or a figure melts into the ground.
- Squint test (blur `ground-test.png` or view it at 1x): every figure must still show a clear head,
  hair mass and outfit shape. If two characters' silhouettes look the same, push the silhouettes apart
  (hood point, robe flare, cloak edges, braid).
- Faces: eyes the same height, 3 skin columns apart, not touched by the fringe. Smeared, uneven or
  cross-eyed faces are failures. Hands are clean mittens, feet sit on row 47 in every walk frame.
- Style policing: any gradient, dither, 4th shade, single-pixel noise, strand lines, or light shade in
  the lower half of a form = redo. More than 2 folds per garment per view = remove folds.
- walk.gif: plays at about 150 ms per frame, loops, no layer lags or jitters relative to the body.
Fix, regenerate, re-run `check.py`, look again. Only stop when nothing on this list fails.

## 5. Output layout (all under out/)

```
out/body/man.png  out/body/woman.png
out/feature/elf-ears.png  out/feature/horns.png
out/outfit/labourer.png  out/outfit/ranger.png  out/outfit/mage.png
    (+ out/outfit/<name>@woman.png for each outfit: the woman's shoulders and waist are narrower,
     so generate both from the same code; the plain name fits the man)
out/hair/short.png  out/hair/long.png  out/hair/braid.png
out/beard/full.png
out/head/hood.png          (hood up, clothA, with a pointed tip: a strong silhouette)
out/held/staff.png
out/lineup.png    six characters from SPEC.md, facing down, standing; 1x and 4x, on #7a7a7a and #3a3129
out/turn.png      character 1 in four directions, standing, 4x
out/walk.png      characters 1 and 2 walking down, 4 frames, 4x
out/walk.gif      the same, animated, looping
out/swatch.png    character 2 in all 6 skin tones; character 1 in all 8 hair colours; 2x
out/ramps.json
out/NOTES.md
```
Keep `tools/` (rig.py, layers code, compose.py, check.py) beside `out/` so the sample can be regenerated.

NOTES.md: the direction in one paragraph ("Enamel & Ink": flat 3-shade shapes, closed ink outline, light
from top-left, chunky 3.4-head proportions), the ramps, the colourways used per character, honest
weaknesses (for example what the tiny face cannot express, where very dark skin lowers eye contrast,
what the hood does to horns or ears), and anything the layer system makes hard. Finish with the
check.py table.
