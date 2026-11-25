# BRIEF: "Working Light" (round 2 figures, grounded direction)

You are making a style sample of layered pixel-art townspeople for a serious RPG for adults. Read SPEC.md,
CODEX-WORKFLOW.md and look hard at world/market-normal-zoom.png and world/market-close-zoom.png (open them,
crop and zoom into the flagstones, the fountain, the timber frames) before you draw anything. Use only the
files in this folder; never look elsewhere on the machine for art, sprites or old rounds. tools/px.py and
tools/ramps.json from CODEX-WORKFLOW are NOT here (and its 32x48 sprite size and ~3-head proportions are
obsolete): write your own tools as described below.

## 1. Direction

**Working Light.** Ordinary adults on an ordinary working day, measured from life at the world's own scale
(32 px = 1 m) and lit by the same late-morning sun as the street. Think of documentary figure drawing and
naturalistic oil painting of labourers and market folk: weight on the feet, sloped shoulders, clothes that
are cut, sewn, worn and dirty at the hem. No charm, no heroics, no big heads, no big eyes, no smiles,
no candy colour. A stranger should glance at the street and see people, not game pieces.

What the world tells us (measured from the screenshots, design from these facts):
- Sun from the upper LEFT and slightly in front of the camera: the fountain's left faces are lit, its
  right faces dark, and its pillar casts a shadow up and to the RIGHT. Figures are lit on screen-left,
  shadowed on screen-right, in every direction.
- Flagstones sit around #c2ad8f to #d3bc9d with mortar lines #8a7358; plaster #d4be9a; timber near
  #2b0a02; terracotta #a34127; slate #5e5957 to #837e7b; grass #385d26; cast shadows are cool and
  greyish (#3f3839 to #4e4f51). Everything is warm, earthy and only mildly saturated.
- Textures carry 4 to 5 values per material plus sparse 1-texel flecks; there are no black outlines on
  surfaces, but object silhouettes (the fountain blocks) get a dark warm edge near #2b1e22.
### Proportions (from real measurements at 32 px/m)
Frame 48 x 64, centre column x=24, feet on row 63. Head 7 px wide (odd, so the nose has a centre column)
and 8 px tall for both sexes.

| landmark (row y) | man, 58 px tall (1.81 m, 7.25 heads) | woman, 56 px tall (1.75 m, 7 heads) |
|---|---|---|
| top of head | 6 | 8 |
| chin | 13 | 15 |
| shoulder line, width | 16, 15 px (x 17-31) | 18, 13 px (x 18-30) |
| chest / bust | 20 | 22 |
| waist, width | 28, 11 px | 29, 9 px |
| hip widest, width | 33, 13 px | 35, 13 px |
| crotch | 35 | 37 |
| knee | 47-48 | 49-50 |
| ankle | 61 | 61 |

Neck 2 rows, 5 px wide (man), 3-4 px and a little longer-looking (woman). Arm: shoulder to wrist 18-19 px,
elbow level with the waist, wrist level with the crotch, fingertips at mid-thigh. Upper arm and forearm
3 px wide. Hand 3 px wide and 4 tall (a real hand is 19 x 9 cm). Foot in side view 8 px long, 3 tall;
in front view 3 px wide, 2-3 rows. Legs 5 px at the thigh, 3-4 at the calf, a 1 px gap between the legs
from the crotch down. The man is blocky (shoulders wider than hips, straight waist); the woman has narrower
shoulders, a defined waist and hips as wide as the man's. Nobody stands straight like a soldier: the
shoulders sit 1 px lower at the ends than at the neck, arms hang slightly away from the torso with the
hands turned in.
### Faces (8 rows, 7 columns; row 0 = crown). "Shade n" counts from 0 = darkest.
For skin: shade 3 = mid, 4 = light, 5 = highlight.
Rows: 0 crown, 1 forehead, 2 brow ridge, 3 eyes, 4 nose and cheekbone, 5 mouth, 6 jaw, 7 chin and under-chin.
- Brow ridge (row 2): skin shade 2 over each eye (cols 1-2 and 4-5). This shadowed, deep-set eye is what makes
  the face adult. Never draw a light pixel directly above an eye.
- Eyes (row 3): each eye is 1 iris pixel plus 1 sclera pixel on the outer side (col 1 sclera, col 2 iris,
  col 3 nose bridge in skin light, col 4 iris, col 5 sclera). Iris: eye shade 1 on the lit eye, eye shade 0
  on the shadow eye. Sclera is the fixed muted #a99c8c, never white. No eye is ever 2 px tall.
- Nose (row 4): col 3 skin mid, col 4 skin shade 2 (nose shadow falls right). Cheekbone col 1 skin light,
  plus one highlight pixel on the lit cheek. The right cheek (col 5) is shadow.
- Mouth (row 5): cols 2-4 skin shade 1, a flat line, never a curve or a smile. Lower-lip pixel below it
  (row 6 col 3) one shade lighter than the jaw around it. Never a red lip colour.
- Jaw (rows 6-7): man square, row 6 full cols 1-5 with a hard corner, row 7 cols 2-4; woman row 6 cols 1-5
  with the corners one shade darker and a narrower row 7 (cols 2-4, side pixels in shadow). Under-chin
  and the top neck row are skin shade 1 (cast shadow of the head).
- Ears 1 px beyond the head at rows 3-4, skin mid on the lit side, shadow on the other.
- Left view (profile): 6 px deep; the nose is a single pixel stepping 1 px past the face line at row 4,
  a shade-2 notch at the eye socket on row 3, iris pixel 1 px behind the face line, mouth 1 px of shade 1,
  jaw a diagonal from chin to below the ear. Up view: no features; the hair layer covers the back.
- Age reads from grey hair and beard, not wrinkles. Expressions are neutral and still.
### Hands and feet
Hands: 3 wide x 4 tall, two rows of back of hand, two of fingers narrowing to 2 px, a thumb pixel on the
inner forward side; lit hand skin light/mid, shadow hand mid/shade 2. No separate fingers, no round mittens.
Feet: leather shoes/boots; front view 3 px wide each, toes out 1 px, sole a 1 px row of leather shade 0;
side view 8 px with a 1 px heel step.
### Hair
Hair is mass first, then 2-4 clumps that follow the growth direction (down from the crown, back from the
temples). Clumps are separated by 1-px runs of hair shade 1; the lit top-left of the crown gets a broken
highlight of 3-5 px in shade 3-4, never a continuous shine band or ring. Silhouette edges step irregularly
(1 px notches), never a smooth helmet. Hairline sits on row 1; fringe covers at most row 2 at the temples.
Every style leaves the ear area (head rows 3-4, 1-2 px beyond the head) clear or tucked, so elf ear tips
and horn tips (which sit below hair in the stack) still show. Long hair falls to the shoulder blades and
lies on the shoulders, broken by the shoulders, not a cape. Braid: a single 3-px braid over one shoulder,
segments as alternating shade 3 / shade 1 diagonals every 2 px. Full beard: head rows 5-7 plus 2 rows
below the chin, moustache on row 5 beside the mouth; it LEAVES THE MOUTH OPEN (row 5 col 3 lip line and
row 6 col 3 lower lip, skin shade 3, stay skin) and starts at row 5, so the row-4 cheekbone stays skin.
### Cloth, leather, metal (detail must match the 32 texel/m world textures)
- Cloth: big flat planes in 3 values (light, mid, shadow), plus sparse 1-px flecks of +/-1 shade on about
  5-8% of interior pixels, like the flagstone speckle. Never on faces. No checkerboard dither.
- Folds: 1-px runs of shade 1, 2-4 px long, starting at stress points (elbow, armpit, crotch, belt gather,
  knee) and running diagonally; each fold gets a 1-px shade-3 edge on its upper-left side. At most 2 to 3
  folds per limb segment. Hems: a 1 px darker row and 1-px wear notches, slightly uneven. Max
  3 shades in any 4x4 block of cloth.
- Leather: darker and smoother than cloth, no flecks, a 1-px shade-3 edge along the top of straps and belts
  and 1 px shade-4 on worn corners (toe caps, knee of boots). Straps cast a 1 px shadow under them.
- Metal (iron fixed ramp): only small pieces, at most 3 px each (buckle, ring, staff ferrule), dark iron with
  one shade-3 specular pixel on the top-left. Nothing shines like gold.
- Wood (staff): lit left edge, shadow right edge, a 1-px knot or grain step every 6-10 px.
### Outline and edge
Selective outline, 1 px, only on the outer silhouette of each layer: each edge pixel uses the darkest shade
of the material it encloses (sel-out). On the shadow side and the bottom (screen-right and under the feet)
use the fixed edge colour #2a1d1c, which matches the fountain's dark edges. No interior black lines:
interior separations are value steps (as the world's textures do), except where one layer lies over another
(hair over forehead, cloak over jerkin), where the upper layer's own edge pixels stay in its darkest shade.
Never pure black. The 1-px outline keeps figures readable on the bright flags without looking stencilled.
### Shading model
Key light from the upper left and slightly in front; form shading on every form: highlight (thin, top-left
planes only: crown, top of the lit shoulder, lit forearm), light (planes facing left/up), mid (planes facing
the camera), shadow (screen-right side, undersides), darkest (occlusion and outline). Roughly 25 / 45 / 30
light / mid / shadow per form. Cast shadows that matter: hair onto forehead (1 row), head onto neck, the
right arm onto the torso, belt and apron onto what is below, the cloak onto the body. Contact shadow
(shade 1) between legs, in the armpits, under the belt. No pillow shading, no rim light, no glow.
Left view: front (screen-left) lit, back in shadow; far limbs are one shade darker than near limbs.
Up view: same left/right logic. Right view: mirror the left view, then re-shade so the light still comes
from screen-left (do not just flip).
### Readable without looking pasted on
- Value: the figure's mid-values are darker than the flagstones (the lightest cloth highlight stays below
  #b8a383), so the silhouette reads by value, not by bright colour.
- Saturation: no cloth is more saturated than the red awning in the world; most are well below it.
- Head and hands are the lightest warm spots on a body; the eye goes there, as with real people.

## 2. Ramps (exact hex, darkest first; write them to out/ramps.json)

Format: `{"source": {region: [hex...]}, "targets": {region: {name: [hex...]}}, "fixed": {name: [hex...]}}`.
Source ramps are the named targets marked (S); every layer is drawn ONLY in source + fixed colours.

skin (6):
- very-light: #5a3a30 #8a5a48 #b77f68 #d4a088 #e6bca2 #f0d0b9
- light:      #4e3226 #7c5440 #a8775c #c8967a #dcb196 #e8c6ad
- medium (S): #432a1c #6a4430 #8f6146 #b07e5e #c79a78 #d6b08e
- brown:      #321e14 #523020 #744830 #926244 #ab7b58 #bf926e
- very-dark:  #170d0a #2a1810 #3e2418 #573422 #6f4731 #8a5d41
- ash-grey:   #24252a #3a3a40 #55545a #716e72 #8d8a8b #a8a4a2
hair (5):
- black:      #0e0e0f #19191a #262626 #353331 #4b4743
- dark-brown: #1a120e #2a1d16 #3d2b20 #54392a #6b4a36
- brown (S):  #2a1a10 #43291a #5e3c26 #7a5233 #966a45
- auburn:     #2c120c #4a1e12 #6a2c19 #8a3e22 #a5552f
- blond:      #4a3720 #6e5530 #947440 #b49456 #cbb074
- red:        #3a120a #5e1e10 #842e16 #a8441f #c05c2c
- grey:       #2e2d2c #4a4846 #6a6764 #8a8682 #a8a39d
- white:      #5c5854 #85807a #aaa49d #c8c2ba #ded8ce
eyes (3):
- brown (S) #1e120c #4a2e1a #6e4a2c; green #16200f #3e5a2a #607a3e; blue #141c24 #3e5a72 #6a8298;
  hazel #1e1a0c #5e5228 #7e6e3a; amber #2a1806 #8a5a16 #b07a26; grey #1c1e20 #5a6064 #808486
clothA (5), main garment:
- linen (S): #3a3226 #574b3a #786750 #988466 #b29d7a
- madder:    #2e1210 #4a1d17 #6a2b20 #87402b #9e5638
- woad:      #1c2128 #2c3440 #404b58 #586470 #6f7b85
- moss:      #1e2216 #2f3522 #444b30 #5b6140 #727652
clothB (5), secondary garment:
- umber (S): #1f1812 #31261c #46372a #5d4a38 #735d48
- charcoal:  #18181a #252527 #353436 #47464a #5a5859
- russet:    #2a170e #432618 #5e3822 #7a4c2e #915f3a
- fleece:    #2c2a24 #444037 #5e584c #787162 #8f8878
fixed: leather #1f140d #36241a #523726 #6e4c33 #8a6444; iron #1c1d20 #383a3e #5c5f63 #8a8c8c;
wood #24160d #3e2717 #5b3b22 #7a5431; horn #2a221c #4a3e33 #6e6050 #958670 #b5a68c;
edge #2a1d1c; sclera #a99c8c.

Elf ears are drawn in skin source colours (they recolour with the skin). Horns use the fixed horn ramp.
tools/check_ramps.py fails if any colour appears twice across all source and fixed ramps.

**Black hair reads as black:** the black ramp is neutral with a faintly WARM highlight; nothing in it
leans blue or purple (check: for every black-ramp colour, B <= R + 2). The highlight pixels carry the shape;
the mass is shades 0-2.
**Very dark skin + black hair + beard stays readable:** (1) dark skin is warm red-brown and black hair is
neutral, so they separate by hue even at similar value; (2) the very-dark skin ramp keeps a real lit end
(#8a5d41) for the forehead, nose bridge and lit cheekbone, which are always shade 4-5 on the lit side;
(3) the beard starts below the cheekbone and leaves a lit lower-lip pixel open; (4) the fixed sclera gives
two light points; (5) the brow ridge (shade 2, #3e2418) sits against a shade-4 forehead (#6f4731), so the
eyes still sit in a socket. Verify in swatch.png at 4x: on the very-dark skin with black beard you must be able to point
to both eyes, the nose and the mouth. If not, raise the lit skin pixels, never lighten the beard to grey.

## 3. Method: reference-guided native authoring on a shared rig

Round 1 drew everything procedurally from code templates and came out simplistic. Straight image-tool
downscales cannot work either: separate generated images never line up layer to layer, and a box
downscale turns faces into mud. So: the image tool for DESIGN, hand-placed indexed pixels for the ART, and
one rig that places every layer, so alignment is guaranteed by construction.

Step 1, references (image tool, design only). On flat magenta #FF00FF, generate large painted references:
a naturalistic, realistically proportioned adult man and woman (7.5 heads, plain underclothes, front view and
left profile, arms relaxed), and one front + profile for each outfit (labourer, ranger with hooded cloak and
leather, mage in a long practical robe) and the hood. Prompt for: documentary realism, worn handmade
clothing, natural daylight from the upper left, neutral expression, no stylisation, no fantasy ornament.
Never shipped, never traced pixel for pixel; save in scratch/ref/.

Step 2, guides. Key out magenta, scale to the heights in section 1, box downscale to 48x64 into
scratch/guide/ as an underlay showing masses, folds, straps and value groups. The proportion table wins.

Step 3, legend and rig. tools/legend.json maps one character to each (ramp, shade): '.' transparent, and
e.g. skin 1-6, hair a-e, eyes x y z, clothA A-E, clothB F-J, leather L-P, iron Q-T, wood U-X, horn h-l,
edge '#', sclera '*'. tools/rig.json gives, per body (man, woman), per direction, per frame: dy (bob),
the head anchor, the shoulder anchors and the hip anchor. Every layer is rendered by one script,
tools/build.py, from text grids in src/ through this rig. No layer is ever positioned by hand in a PNG.

Step 4, parts (hand-authored text grids in src/, pixel by pixel, over the guide):
- Head-attached layers (head, hair, beard, ears, horns, hood) are drawn ONCE per direction in head-local
  coordinates and placed at the head anchor + dy. The head is rigid, so they align on every frame and on
  both bodies; build.py writes their @man and @woman sheets automatically.
- Torso and torso garments: one grid per direction per body, placed at dy.
- Arms (they swing) and legs (hips down): one grid per frame per direction per body. Sleeves, legwear,
  boots, skirts, robe and cloak hems are drawn per frame over that exact body frame, shown dimmed by
  build.py --underlay. Joint cleanup is an edit to that layer's own grid, never to a composite.

Step 5, the 6-frame walk (rows: down, left; columns: frames 0-5). The feet stay planted; bob is done by
bending the legs, so dy moves everything above the knees and the supporting foot always touches row 63.
| frame | pose | dy | left view feet (x from centre, + = forward) | arms |
|---|---|---|---|---|
| 0 | stand / passing | 0 | near +1, far -2, both flat | hands at sides |
| 1 | contact, near leg forward | +1 | near heel +7 toe up 1, far toe -7 | near arm back -4, far arm fwd +5 |
| 2 | down | +2 | near flat +5 knee bent, far -8 heel up 2 | same, 1 px less |
| 3 | passing | 0 | near under hip, far foot lifted 2-3 px at 0 | at sides |
| 4 | contact, far leg forward | +1 | far heel +7, near toe -7 | near arm fwd +5, far back -4 |
| 5 | down | +2 | far flat +5, near -8 heel up 2 | same, 1 px less |
Far leg and far arm are one shade darker in the left view, so the legs visibly pass each other.
Down view: the forward foot reaches row 63 and is 1 px wider; the back foot rises to row 60-61 with a
1-px sole showing; the knee of the back leg is hidden by the front leg's thigh shading; the arm on the side
of the back leg swings forward: its hand drops 1-2 px, moves 1 px toward the centre and the forearm
shortens; the other hand rises 2 px and half-hides behind the hip. The torso sways 1 px toward the stance
leg on frames 1-2 and 4-5. Cloaks, robes and long hair lag one frame (their swing follows the previous
frame's legs) and swing 1-2 px at the hem. The staff follows the hand anchor and stays vertical.
Right and up rows: draw a proper standing frame (right = mirrored left, re-shaded; up = real back view)
and repeat it in all 6 columns.

Step 6, checks (tools/check.py, run after every build; fix and rebuild until clean):
- every sheet 288x256 RGBA, alpha only 0 or 255, every colour in source + fixed ramps, each layer uses only
  its allowed ramps; lone pixels under 3%;
- feet on row 63 in every frame of every body; body height 58 (man) / 56 (woman) +/-1; body height / head height between 7.0 and
  7.5;
- alignment: each layer's pixels lie within the body silhouette dilated by its allowance (hair 3 px,
  outfit 2, cloak/robe 6, hood 3, ears 5, horns 6, staff unlimited); composing every outfit on its body
  shows no underclothes or skin where the outfit's cover mask (src/<outfit>.cover) says it covers;
- walk: in down and left, leg pixels differ between consecutive frames, the far foot is clear of row 63
  in frame 3 and a heel is raised in frames 1, 2, 4 and 5, and the head row moves by dy.

Step 7, compose (tools/compose.py). Recolour by exact source->target mapping, stack in SPEC order, write the
composites. In-world: nearest-neighbour x2.3 (normal zoom) and x4 (close zoom); place the six people on open
flagstones (not on the fountain, not under the two UI labels), at different depths like people in a square,
drawn back to front. Under each, a soft ellipse about 0.6 x sprite width by 0.2, colour #2b2530 at 45%
opacity, blurred, its centre 1-2 sprite px to the right of the feet and slightly up-screen (the sun is
upper left). Lineup on #7a7a7a at 1x and 4x. walk.gif at 150 ms per frame.

## 4. Self-check (look, do not just run scripts; redo anything that fails)
1. Open in-world.png at full size next to market-normal-zoom.png. Does each of the six look like a person
   who lives and works in this street? Does the light hit them from the same side as the fountain? Are
   they lit and shadowed with the same contrast as the stone around them, no brighter, no more saturated?
   Is their pixel grain the same as the flagstones'? If any one looks pasted on, find why and fix it.
2. Same for in-world-close.png: at 4x the faces must read as adult faces, not as dots or masks.
3. Lineup at 4x: cover the hair and clothes with your hand; are these adults of 7+ heads with real
   shoulders, necks, hips and hands? Anything cute, chunky or toy-like is a failure.
4. Faces: two eyes in sockets, a nose, a closed mouth, a jaw. Woman and man distinguishable by face and
   build, not only by hair. Older man reads older.
5. Character 2 (very dark skin, black hair, full beard) at 1x and 4x: eyes, nose and mouth visible; hair
   reads as black, not blue, purple or grey.
6. swatch.png: every skin tone and hair colour looks natural; black is black, white is warm white, red is
   copper, blond is not yellow.
7. walk.gif: legs clearly pass, arms swing opposite, the body bobs, the feet do not slide or float.
8. Materials: cloth, leather, wood, iron and hair are each recognisable at 1x by value and texture alone.
9. Layers: swap outfits and hair between characters in a test composite; nothing misaligns.
10. Edges: no pure black, no interior black lines, outline darkest on the shadow side.

## 5. Output (under out/; source sheets in source colours, 288x256, 6 frames x 4 rows)
```
out/body/man.png, woman.png
out/feature/elf-ears@{man,woman}.png, horns@{man,woman}.png
out/outfit/{labourer,ranger,mage}@{man,woman}.png
out/hair/{short,long,braid}@{man,woman}.png   out/beard/full@{man,woman}.png
out/head/hood@{man,woman}.png   out/held/staff@{man,woman}.png
out/ramps.json
out/lineup.png  out/in-world.png  out/in-world-close.png  out/turn.png  out/walk.png  out/walk.gif  out/swatch.png
out/NOTES.md
out/tools/ (legend.json, rig.json, build.py, compose.py, check.py, check_ramps.py)  out/src/ (all grids)
```
Every layer needs @man/@woman variants because the bodies differ in height (58 vs 56 px) and build;
head-attached variants are generated from one drawing by the rig, outfits are drawn per body. Woman
labourer: shirt with rolled sleeves, apron over an ankle skirt. Man labourer: linen shirt, sleeves rolled
to the elbow, umber trousers, leather belt and work boots. Ranger: clothB tunic, leather jerkin and bracers,
belt with pouch, tall boots, clothA hooded cloak to mid-calf with the hood down on the shoulders. Mage: an
ankle-length clothA robe, a clothB over-gown or sash, a leather belt with a pouch, practical sleeves; no
stars, no runes, no pointed hat. Hood (hood up): clothA, deep enough to shadow the brow ridge.
NOTES.md: the direction in a paragraph, the ramps, how the rig works, and honest weaknesses.
Intermediates go in scratch/. Touch nothing outside this folder.
