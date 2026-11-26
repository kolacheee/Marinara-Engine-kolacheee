# Earth & Weight

A grounded adult field-sprite style for a muted fantasy JRPG. The emphasis is a supported stance, compact adult anatomy, quiet expressions, heavy clothing and readable silhouettes. The delivered PNG sprites are the colour and pixel-grid reference; the large originals are generation sources, not final-resolution references.

## Frame, anatomy and faces

- Work at **96 × 128 logical pixels**, RGBA. Coordinates are zero-based. Crown at row **33**, lowest planted sole at row **124**, for **92 occupied rows**. Rows 0–32 and 125–127 are transparent. Centre the entire silhouette, including equipment, horizontally.
- Use a **four-head construction target**: one head unit is 23 px from crown to chin, excluding a loose ponytail. The guide divides the figure into four equal units. Chin falls near the first division, waist around the second, lower legs occupy the last unit. Hair volume and beard make visible measurements approximate; these samples range roughly from four to four-and-a-half heads. Do not use a two-head doll construction.
- Adults have a defined jaw, modest neck, substantial shoulders and a pelvis that supports the torso. Hadrik is broader through shoulders and forearms; the women remain adults with narrower shoulders, not children with enlarged heads.
- Aim for a **1 × 1 dark eye mark**, with a second adjacent pixel only for an eyelid/profile. Avoid separate bright eye glints. A nose is a 1 px projection in profile or a small warm face-plane mark in front. A quiet mouth is a 1–2 px shadow. Never outline the whole mouth.
- Hands use a 3–5 px mitten mass, broader for Hadrik. Show one thumb notch and at most one finger division. Grip the bow or hammer with a closed readable shape; do not draw five separate fingers.

## Pixel clusters and contours

Keep the logical pixel grid visible. Main plane clusters are usually 2–6 px across and may be much longer vertically on a skirt or apron. Single pixels are reserved for eyes, a contour step, a bowstring, a clasp or a metal glint. No regular checkerboard dithering, spray texture, smooth gradients or blur. The delivered generation-derived samples still contain a few irregular edge pixels; those are limitations, not a request to add noise.

Use a mostly **1 px coloured outline**. Select the darkest tone of the local material, with charcoal permitted for boots, black hair and deep overlaps. Reserve a 2 px dark mass for a true overlap or a deep crease, not a continuous shell. On a lit upper/left contour, step from the edge tone up to the shadow tone. Keep the lower/right contour darker. Do not use pure black or pure white. Hair, cloth and skin do not all share one universal border colour.

## Light and material treatment

The light is fixed in screen space at the **upper left**, approximately 10 o'clock. Do not mirror the lighting when turning a character. Each named ramp has **four roles**: edge/occlusion, shadow, body and light. Broad body and shadow planes occupy most of a material; the light tone is a small accent. The cylinder on the sheet demonstrates the four-plane scheme.

- **Hair:** arrange 3–5 substantial locks; one light cluster over the upper-left mass. Wren has auburn hair tied low; the ponytail is most explicit in back view. Hadrik has short black hair and a full beard, using the charcoal ramp. Noble's golden hair is swept up into a compact bun. Avoid a bright dot on every strand.
- **Skin:** use broad face planes and a restrained highlight on the nose, cheek or knuckles. Hadrik's skin uses the deep-skin ramp, separately from the leather apron; keep the dark complexion. Faces need contrast against hair without becoming pale.
- **Cloth:** folds follow gravity. A cloak drops from the shoulders, the apron hangs with a flat lower edge, and the gown uses long continuous planes. Add a fold where fabric is compressed or supported. Wren's cloak has its hood down; Noble's cape stops around the waist. Do not scatter little folds across an otherwise flat panel.
- **Leather:** thicker hems and a few broad bend shadows. Apron, jerkin and boots are matte. Belts and straps need only enough separation to establish the construction.
- **Wood:** use the leather/gold families for a warm bow and hammer handle. The bowstring is a quiet single-pixel line where sampling permits. Keep the bow recognisable by its tall curved silhouette.
- **Metal:** use the steel ramp for Hadrik's hammer head. A small upper-left highlight and a dark lower-right plane establish the block. Gold trim uses ochre, not yellow-white sparkle; at final size most trim is 1 px wide.

## Palette and limits

The master palette contains 40 colours, arranged as ten four-colour ramps. The **32-colour cap applies to a character**, including the union of all its views, not to the whole page. Transparency is separate and binary. Do not add the neutral page background to a sprite palette.

| Ramp | Edge | Shadow | Body | Light |
| --- | --- | --- | --- | --- |
| charcoal | #252321 | #3C3530 | #534A40 | #706557 |
| leather | #36291F | #513A2B | #735039 | #96734D |
| moss | #303A2B | #4A5537 | #697448 | #929B64 |
| fair_skin | #785343 | #AC7F62 | #D2A781 | #EBC8A1 |
| deep_skin | #211C1C | #382923 | #50372D | #79553F |
| auburn | #3F2925 | #643A2C | #8B5237 | #B17A50 |
| gold | #57432C | #8A693B | #B79351 | #D5B677 |
| linen | #655D49 | #93856B | #C1B18F | #E4D3AD |
| navy | #202736 | #303E55 | #485A73 | #6B7D90 |
| steel | #343B40 | #5D676B | #929B9B | #C7CBC2 |

- **wren**: charcoal, leather, moss, fair_skin, auburn, gold, linen.
- **hadrik**: charcoal, leather, deep_skin, gold, linen, steel.
- **noble**: charcoal, fair_skin, gold, navy.

## Views and walk rules

Generate the side view first. Lock the hair silhouette, garment lengths, equipment and proportions from that reference before drawing front, back and passing poses. Use the supplied side-reference crops in `scratch/` when reproducing this set. Side and passing views face **right**. Front and back are straight views, with no visible face on the back. Keep equipment in the same anatomical hand as the character turns.

The passing frame uses a planted leg beneath the pelvis and a bent moving leg passing close to it, with the moving foot lifted. Keep the torso almost upright. Wren and Hadrik show the crossing knee; Noble's skirt conceals the knee and reveals the change through the close feet and hem. A wide contact stride is a different pose. Keep the lowest support sole on row 124. These are single passing illustrations, not a complete animation cycle. Do not infer timing or a seamless idle-to-walk transition from this sheet.

## Exact reduction and cleanup recipe

All figure shapes and the cloth cylinder were drawn by the image tool. There is no procedural anatomy, painted replacement face, pixel-brush repair or synthesized limb in the processing scripts. Python performs keying, cropping/downscaling, palette snapping, assembly and validation only.

The final reproducible processing is in `scratch/build.py`; assembly is in `scratch/assemble_sheet.py`. Run from the task folder:

```sh
python scratch/assemble_sheet.py
python scratch/check.py
```

1. Split `out/big/side-master.png` into three 512 × 1024 cells, ordered Wren, Hadrik, Noble. For each character's other-view source, divide the source width into three equal cells with Python `round(width * index / 3)` boundaries; order is front, back, walk-side. Wren uses `wren-views.png`, Hadrik uses `hadrik-views.png`, Noble uses **`noble-views-v2.png`**. `noble-views.png` is the superseded first attempt.
2. Convert to RGBA. Key a source pixel as background when `R > 180`, `B > 180`, `G < 100`, `R-G > 110` and `B-G > 110`. Set those pixels to `(0,0,0,0)` and all other alpha values to 255. This removes the generated magenta field while tolerating its small colour variations.
3. Crop each cell to its nonzero-alpha bounding box. Preserve aspect ratio. Set the height to **92**, and width to `round(cropped_width * 92 / cropped_height)`.
4. Downscale with **Pillow NEAREST**, once. An area/BOX trial was examined but rejected: it averaged edge colours and made too many tiny intermediate shade changes. Do not use that trial as the production recipe. The rejected script/proof remain in `scratch/`.
5. Apply colour-only source-to-ramp snapping for navy and moss before the general palette pass. These source anchors prevent minor source gradients falling on final-palette decision boundaries:
   - Noble blue selection: `B > 1.16 R` and `B > 1.06 G`. Nearest Euclidean RGB source anchors `(24,28,49), (35,46,78), (53,69,110), (83,102,141)` map in order to the four navy entries.
   - Wren green selection: `G > .97 R`, `G > 1.24 B`, `R < 180`. Source anchors `(44,48,26), (67,74,33), (99,108,45), (148,152,68)` map in order to moss.
6. Hadrik receives a material-specific deep-skin palette snap **before** the general snap. This corrects the source's overly warm complexion without changing anatomy or alpha. Within the material masks below, select brown pixels when `R > 1.20 G`, `G > 1.14 B` and `R < 200`. Compute `L = .30 R + .59 G + .11 B`; cut at **46, 78, 114** and map the resulting four bins to the deep-skin ramp. Coordinates here are fractions of the tight cropped/reduced figure, with origin at upper left:
   - Front: `(0.22 < x < 0.78 and y < 0.30)` OR `((x < 0.24 or x > 0.77) and 0.45 < y < 0.71)`.
   - Back: `(0.23 < x < 0.77 and y < 0.27)` OR `((x < 0.25 or x > 0.76) and 0.45 < y < 0.71)`.
   - Side and passing: `(x > 0.44 and y < 0.26)` OR `(x < 0.50 and 0.40 < y < 0.64)`.
   These masks are specific to these masters. Re-establish them for a different pose; do not blindly apply them to other characters.
7. Snap every opaque pixel to the nearest allowed colour from that character's listed ramps, minimizing `.30*(R-r)^2 + .59*(G-g)^2 + .11*(B-b)^2`. No dithering. Alpha is thresholded at 90, though nearest-neighbour input already has only 0/255. Zero RGB wherever alpha is zero.
8. Paste the result at `x = (96 - reduced_width) // 2`, `y = 33` on a fresh transparent 96 × 128 frame. Do not stretch a character to fill the frame. Exact source boxes and output widths are logged in `scratch/reduction-manifest.json`.
9. Inspect every sprite at integer magnification and the assembled page at full resolution. If silhouette, costume or pose is weak, regenerate with the image tool. Do not hide a drawing failure with procedural pixel painting. The first side masters were regenerated for proportions; Noble's first other-view sheet was regenerated for simpler cloth and a true passing pose.
10. The page enlarges sprites by **exactly 3× NEAREST**. The proportion guide reuses Hadrik's actual side sprite. The image-tool cylinder is keyed, cropped, reduced to 30 × 44, snapped to the moss ramp and enlarged 5× for the shading guide. Page labels, lines and rectangular swatches are assembly elements.

## Prompt template and exact generation record

The full side-first prompt and the actual follow-up prompts are reproduced verbatim below. They are the exact templates used for this set, including correction prompts; do not replace their concrete costume details with a vague style adjective. For a new character, substitute the character description, keep the frame/proportion/light/cluster instructions, generate its side master first, then attach that master to its other-view prompt. All requests used an opaque magenta background (`transparent_background=false`) so the keyed PNGs, rather than automatic tool transparency, define the final silhouettes.

Reference inputs were only this task's generated originals. The initial side request had no image reference. The corrected side request referenced the first draft. Each three-view request referenced its character's crop from the corrected side master; Noble's revision used that same original side crop. The cylinder request had no reference.

### side_initial

```text
Create an ORIGINAL pixel-art character design master, text-only references. Three adult fantasy JRPG field characters on ONE pure flat #FF00FF magenta background, no text, no border, no ground shadows. All three stand in strict full-body SIDE PROFILE FACING RIGHT. Wide landscape canvas, three equal columns. Each character is isolated, head to toe, ample magenta separation, equal crown-to-sole height, aligned feet. Authentic designed pixel art: clearly visible square grid, approx 92 logical pixels tall per figure rendered large with hard nearest-neighbor square blocks, no smooth painting, no antialiasing. GROUNDED ADULT style: exactly FOUR HEADS tall, small restrained head and eyes (one dark pixel eye), broad believable adult shoulders, realistic weight and quiet stance, not chibi. Four flat tones per material, desaturated naturalistic palette, dark COLOURED outlines lighter on upper-left lit edges. Light from upper left. Large readable pixel clusters, no dithering, no noisy texture. Avoid tiny accessories. 
LEFT: Wren, adult female ranger, auburn low ponytail, hood DOWN moss-green cloak ending near knees, brown leather jerkin, brown trousers, tall dark boots. A tall wooden longbow in her near hand at front (right) with thin taut string, quiver and arrow fletchings behind shoulder, visible face, standing balanced.
CENTER: Hadrik, blacksmith in his forties, VERY DARK brown skin, short black hair and full black beard, sturdy heavy adult torso and thick forearms. Cream shirt with rolled sleeves under weighty brown leather apron ending near knees, dark brown trousers, heavy boots, simple steel hammer held low by near hand. No hat.
RIGHT: Noble, adult young woman with fair skin and golden hair in neat updo/bun, dignified posture, long DEEP muted navy blue gown reaching ankles with sparse ochre gold trim, short matching deep blue cape to waist, small shoes. No crown, no wand.
Create strong usable references with hands, bow, hammer and shoes cleanly separated. Feet not cut off. All figures occupy about 75 percent canvas height. Save original in the task folder scratch/ if you can.
```

### side_revision

```text
Revise this original three-character side-profile sprite master. Keep the same designs, right-facing true side views, same three equal columns, pure flat #FF00FF background. Critical proportion correction: ALL THREE must be exactly FOUR HEADS tall. The current image is around six heads tall. Make heads occupy 25% of crown-to-sole height (head unit is crown to chin); torso from chin to hip only 1.25 head units; legs/long skirt from hip to soles only 1.75 head units. Broaden compact adult shoulders and torso, keep small eyes and adult faces, no cute chibi eyes. Use a deliberately compact 92-pixel field-sprite design, large simple pixel clusters, no intricate texture. Each figure has exactly 92 logical pixels height, with a 23-pixel head, rendered large with square blocks, feet aligned. Keep Wren auburn low ponytail, green hood-down cloak, leather jerkin, brown trousers boots longbow quiver; Hadrik forty-ish, VERY DARK skin (use deep umber base #50372d with restrained #79553f highlights, not medium tan), black hair beard, cream rolled sleeves, leather apron, trousers boots steel hammer; Noble fair skin gold updo, ankle-length deep navy gown gold trim short cape shoes. Four tones per material, muted colours, coloured outlines, upper-left light. Clear single-pixel eyes at logical scale. No text or diagrams. All full figures head-to-toe, magenta separation.
```

### wren

```text
Use the attached Wren SIDE MASTER as the strict character and pixel-style reference. Draw exactly THREE isolated full-body sprites of the SAME adult woman ranger in a single landscape image, three equally spaced columns on flat #FF00FF magenta. No text. LEFT: straight FRONT view, facing viewer, both eyes tiny, bow held on viewer's right. CENTER: straight BACK view, back of head, auburn low ponytail over hood-down moss cloak, quiver and arrows visible, bow on viewer's left, no face visible. RIGHT: true RIGHT-FACING SIDE WALK PASSING frame: one planted vertical support leg, other knee slightly raised and bent crossing support leg, lifted foot clearly off ground behind, near arm gently forward, cloak moving only slightly. This is a passing pose, NOT a wide stride. Use the original side master for silhouette/costume: auburn tied low ponytail, green cloak hood down ending near knees, brown leather jerkin trousers boots, wooden longbow with taut string and quiver. Critical same approximate FOUR-HEAD tall compact adult proportions and SAME head size as reference, restrained eyes, no cute face. Uniform crown-to-sole height and ground baseline across all three. Pixel art approximately 92 logical pixels high per figure rendered large in hard square clusters, four muted tones per material, top-left illumination, dark coloured outlines lightening at lit edges. Clean longbow and hands. No floor shadow, no other objects, no text, ample magenta margin and separation.
```

### hadrik

```text
Use attached Hadrik SIDE MASTER as strict design/style reference. Draw exactly THREE isolated full-body pixel sprites of SAME blacksmith in his forties, three equal columns, flat pure #FF00FF background. LEFT straight FRONT; CENTER straight BACK; RIGHT strict right-facing SIDE WALK PASSING, one vertical planted support leg, other bent knee crossing with foot slightly lifted behind, not wide stride, heavy apron barely swings, hammer held low. Same crown-to-sole height and baseline, about FOUR head units tall with same compact grounded adult anatomy as attached. Very dark skin: deep brown #382923 shadow, #50372d base, #79553f highlight; no orange/tan skin. Short black hair, full black beard, broad sturdy shoulders, cream shirt rolled sleeves, brown leather apron ending above shins, dark brown trousers, heavy boots, steel block hammer wooden handle. BACK view apron straps crossing cream shirt, no face, hammer switches viewer side to remain same anatomical hand. Tiny 1 logical pixel eyes, broad adult nose and beard, no cute face. Approximately 92 logical pixel figure height rendered large as hard square blocks, four flat tones per material, muted earthy palette, coloured outlines lighter along top-left light, no dithering, no texture noise. All full figures, ample magenta margins, no text, no ground shadow, no other objects.
```

### noble

```text
Use attached Noble SIDE MASTER as strict costume, character and pixel-art reference. Exactly THREE full-body sprites of SAME adult young noble woman, three equal columns on pure flat #FF00FF magenta. LEFT straight FRONT view; CENTER straight BACK view, gold updo bun clearly visible, short deep navy cape ending at waist; RIGHT true right-facing SIDE WALK PASSING frame, planted support foot beneath body, other foot lifted and passing underneath long gown, subtle hem bend and small gap between feet, no wide stride. Equal crown-to-sole height, feet aligned baseline, complete heads and shoes. Grounded adult FOUR-HEAD proportions, same head size as reference, restrained adult face with tiny single-pixel eyes (not cute doll eyes), fair skin, golden updo hair with bun, deep muted navy gown ankle length, sparse ochre gold trim outlining bodice and hem, short matching blue cape, small dark blue flat shoes. No crown, no wand. The back of cape is plain blue with gold edge, BACK shows no face, long skirt weight hangs vertically. Hard square pixel clusters, approximately 92 logical pixels figure height rendered large, four tones per material, upper-left lighting, dark material-coloured outlines lighter on lit contour, no black universal outline, no dithering, no noisy texture. Ample magenta gutters and margins. No text, no ground shadow, no other objects.
```

### noble_revision

```text
Using this original SIDE reference, draw a very clean production pixel-art sheet of this same adult Noble woman, exactly three isolated full-body views in three equal columns on flat #FF00FF: LEFT front, CENTER back, RIGHT right-facing WALK PASSING pose. The walk MUST have the support leg vertical under pelvis and planted foot flat, the other knee bent with lifted foot directly BESIDE the support ankle, only a 2-logical-pixel vertical foot gap. No wide step: the two feet are close together horizontally, lifted foot behind support foot; silhouette hem very similar to idle. Correct the gown: very clean LARGE UNBROKEN flat navy pixel shapes, FOUR tones only, no noisy textural pixels or embroidery; one highlight band on upper-left, two long simple folded planes. Cape short to waist. Same golden hair in updo with compact bun, simplified broad hair locks without tiny braided checks, fair skin, narrow adult eyes (1x1 pixels), 4 to 4.25 heads tall, mature dignified adult not chibi, deep blue ankle-length gown sparse ochre gold trim and small navy shoes. Keep gold central front seam, plain back cape gold edge, BACK no face. Pixel art at approximately 92 logical pixels crown-to-sole enlarged by hard nearest-neighbor squares; no smooth gradients, no dithering, no sparkle or tiny noisy pixels. Four tones per material, desaturated earthy palette, upper-left lighting, coloured contour softer at lit edge. Clean hands with grouped mitten fingers. Same height and baseline, no text no floor shadow.
```

### cylinder

```text
One simple instructional pixel-art object, isolated centered on flat pure #FF00FF magenta: an upright short cylindrical roll of matte moss-green cloth, seen slightly from above so its top ellipse is visible. It is an icon for a pixel-art style guide, NOT a realistic painting. Precisely four muted green tones only: dark coloured edge #303A2B, shadow #4A5537, body #697448, lit plane #929B64. Upper-left light: narrow upper-left lit strip, broad middle plane, right shadow and darkest lower-right contour. Hard flat stepped square pixel clusters, visible square grid about 32 logical pixels wide and 40 high rendered very large with nearest-neighbor blocks. No outline in black, no gradients, no dithering, no texture, no cast shadow, no letters, no diagram labels. Ample magenta margin.
```
