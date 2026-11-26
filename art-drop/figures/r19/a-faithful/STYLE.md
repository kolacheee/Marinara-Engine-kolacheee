# Ember & Earth — A-faithful

A restrained, warm-outline HD-2D field-sprite direction for an adult fantasy JRPG. Read the PNG sheet beside these rules. This is an original interpretation from text, not a traced game asset.

## Deliverables and authority

- `STYLE-SHEET.png`: 2000 × 2320 px, neutral warm-grey page. Each library sprite is displayed at **exactly 3× nearest-neighbour**: a 288 × 384 display of a 96 × 128 file.
- `sprites/<name>-<view>.png`: Wren, Hadrik and Noble; `front`, `side`, `back`, `walk-side`. Side and passing face right.
- `palette.json`: named hexadecimal ramps, character subsets, and explicit allowed palettes.
- `big/`: unmodified image-tool originals, including rejected passes. Use the source map below to identify approved figures.
- `NOTES.md`: remaining artistic weaknesses and limits.
- `../scratch/build.py` and `../scratch/assemble_sheet.py`: deterministic reduction and page assembly. Intermediate keys, inspection strips, exact prompt records, and machine checks also live in scratch.

The finished PNG sprites define the current appearance. The rules define the intended standard; differences that remain are disclosed in NOTES.

## Proportions and frame

Use a **28 px head unit** at final size. A 92 px figure is 3.286 head units, rounded to **3.3 heads**. Measure crown including hair to anatomical chin; a beard is an additional silhouette mass, not the chin landmark. Allow approximately 1–2 px anatomical variation for hair and faces. Do not stretch one body axis independently.

The exported frame is 96 × 128 RGBA. The visible figure occupies rows **33 through 124 inclusive**, with 33 clear rows above and 3 below. Row 124 is the lowest planted sole, using zero-based coordinates. Keep all weapons and hair inside the frame with a clear margin. Center the complete bounding box horizontally; the side masters are the design anchors. This centering is not an engine-specific pivot registration.

Guide lines are at crown + 0, 28, 56, 84 and 92 px. The final guide is the bottom edge just below the last occupied pixel. Keep necks short, shoulders adult, hands compact and shoes weight-bearing. Hadrik is broader and more compact than the women; do not give him childlike limb shapes. No enlarged irises or toddler cheeks.

## Outline, light and clusters

The contour target is **1 px**, with 2 px allowed at corners, boots, under-hair overlaps and deep joins. Use warm brown `#302321` for the darkest contour and `#49332A` for softer internal seams. Material-specific dark browns may share the edge. Never introduce pure black, an all-white rim, semitransparent fringe or glow.

Light comes from the **upper left in screen space**, approximately 45 degrees. Use 3–4 discrete values per material: deep, shade, light and a small highlight. Coal hair and iron use three dedicated ramp colours; an outline may supply the deepest boundary. Keep the lit plane broad and the deepest recess small. Do not light both sides equally or draw concentric pillow shading.

Use connected clusters approximately 2–5 px across for hair, facial planes and garment details; larger 5–12 px planes for cloak and skirt. A single pixel is reserved for an eye, glint, tiny buckle corner or taper. Keep diagonal steps deliberate. **No dithering, random grain, airbrush or procedural texture.** Adjacent materials can reuse colours rather than each receiving a new outline. Some reduction fragments remain in the delivered art; do not treat them as a texture recipe.

## Faces, hands and materials

**Faces:** begin with one lit skin plane, a shadow under fringe/jaw and a small nose step in profile. The eye target is a 1 px dark core; allow a 1 × 2 or 2 × 2 cluster when adjoining a brow. Avoid a bright white sclera rectangle. A mouth is at most a short muted mark, not a black smile. Hadrik's beard interrupts the lower face but must not turn his very dark skin into a featureless hole.

**Hands:** use a 3–5 px mitten mass with one thumb notch and two or three values. Separate a gripping hand from the wooden shaft with a dark join. Do not draw five fingers or pale outlines around dark skin.

**Hair:** organize into three major locks or masses before adding any smaller step. Wren has auburn hair and a low ponytail visible below the rear head mass. Hadrik has short black hair and a full black beard, modelled with the coal ramp. Noble has gold hair in a compact updo/bun. Keep the major silhouette consistent between views.

**Cloth:** use two or three broad folds, not stripes on every row. Wren's green cloak hangs from a hood-down collar and opens enough to expose the leather jerkin. Hadrik's cream sleeves are rolled; his brown apron is a front panel, with cross straps and a waist tie on the back. Noble's short cape ends around the waist; her deep-blue gown remains long in the passing frame.

**Leather and wood:** broad midtone surfaces, darker seams, restrained warm wear on boot toes and apron edges. Wren's wooden longbow stays in her left hand; quiver stays over her right shoulder. A thin bowstring must remain distinct from the stave where space permits.

**Metal:** use the iron ramp for Hadrik's hammer. A broad dark face plus a short light top edge reads better than scattered white points. Keep it in his right hand, visible on screen-left from the front and screen-right from behind. Gold uses the same muted ramp for hair, trim and small fittings; no pure yellow sparkle.

## Colour system

The master palette contains 40 colours; it is a shared library, **not** a 40-colour allowance for a character. Maximum is 32 distinct opaque RGB values across all four views of one character, excluding transparency.

| Ramp | Deep to light |
| --- | --- |
| Outline | #302321, #49332A |
| Leather / wood | #443027, #68432D, #93603A, #B7804B |
| Auburn | #573025, #813E28, #AE5B31, #CC824A |
| Moss | #383D28, #515735, #737847, #969B61 |
| Fair skin | #9A6343, #C18B5C, #E5B47C, #F2CF9B |
| Deep skin | #382522, #59362A, #7D5038, #A16F4D |
| Linen | #786349, #A38B68, #C7B28B, #E8D5AF |
| Coal | #332B28, #494039, #65594C |
| Iron | #5B5149, #877B6C, #B4A594 |
| Gold | #74512D, #A0773D, #C9A456, #E3C27C |
| Blue | #252E4D, #303E66, #445782, #657699 |

Wren allows outline, leather, auburn, moss, fair skin, linen and gold: 26 available, **25 used**. Hadrik allows outline, leather, deep skin, linen, coal and iron: **20 available and used**. Noble allows outline, leather, fair skin, linen, gold and blue: **22 available and used**.

One colour family should lead: Wren's green cloak, Hadrik's warm apron, Noble's blue gown. Keep the world earthy; skin and cream provide value contrast. Wren's auburn hair is a secondary warm identifier. Do not raise both the costume and hair to equally brilliant saturation.

## Passing walk rules

The delivered passing poses are pose references, not complete walk cycles. The support foot sits under the body and reaches row 124. The other knee bends and the lifted foot passes near the support ankle. Avoid a kick or a wide contact stride. Keep the head level; a later full cycle may use at most 1 px of vertical body bob.

Counter-swing the arms only slightly. The ranger controls the bow rather than swinging it freely; the smith's hammer follows his hand. Cloak and ponytail may lag 1–2 px. Noble's knee remains hidden under her floor-length skirt; only a tiny lifted shoe and a slight hem offset show the passing action. Never shorten the gown into a tunic to expose the motion.

For a full cycle, generate the remaining contact/opposite passing frames against the approved side master, then register the body pivot and check playback. Do not mirror a frame containing handed equipment without correcting handedness and lighting through the image tool.

## Exact reduction and cleanup

All character drawing and redraws came from the image tool. Processing never drew a replacement face, limb, weapon or garment. Python was used for cropping/keying, reduction, palette mapping, frame/page assembly and checks. The cylinder, lines, boxes and swatches on the sheet are explanatory layout geometry.

1. Keep each returned image as an untouched PNG in `big/`. Split its columns using boundaries `round(source_width * column / column_count)`, with zero-based column numbers.
2. Work in RGB. Identify magenta background pixels with **R > 120, B > 100, G < 115, and min(R,B) − G > 60**. This catches the image tool's near-magenta noise as well as pure #FF00FF. Set those pixels' alpha to 0; all others to 255.
3. Crop the keyed column to the exact nonzero-alpha bounding box. Save this keyed intermediate in scratch.
4. Reduce the complete crop to **height 92**, width `round(crop_width * 92 / crop_height)`, using Pillow **BOX** resampling on RGBA. Pillow uses premultiplied-alpha handling for this operation. Do not stretch to the full 96 px frame width.
5. Threshold the reduced alpha at **128**: values below 128 become fully transparent; other values become 255. Transparent pixels are stored as RGBA (0,0,0,0).
6. For each retained pixel, snap RGB to its character's fixed allowed palette by minimum **(R−r)² + (G−g)² + (B−b)²**. Use no dithering. Resolve equal distances by palette order in `palette.json`.
7. **Wren's olive exception:** before nearest-colour snapping, if **60 < R < 175, G > 55, 1.05 ≤ R/G ≤ 1.32, and 1.55 ≤ G/max(B,1) ≤ 3.0**, restrict the candidates to the four moss colours. This prevents source olive from snapping into brown leather. It is a global colour-family mapping, not a painted spatial mask.
8. Paste the reduced crop into a transparent 96 × 128 frame at **x = floor((96−width)/2), y = 33**. This produces 92 visible rows with soles at row 124.
9. Do not add morphological outlines, blur, sharpen, paint over features or synthesize sprite pixels. If a pose or costume is wrong, redraw it with the image tool and rerun the same reduction.
10. Check dimensions, occupied height, feet, clear side margins, exact binary alpha, allowed palette membership and colour-count union across the four views. Inspect at 1× and 3×. Assemble the sheet with **NEAREST** enlargement, never bilinear enlargement.

Rebuild from this folder:

```sh
python -W ignore scratch/build.py
python scratch/assemble_sheet.py
```

## Approved source map

Columns below are zero-based. All source files are in `big/`.

| Output | Source | Column / count |
| --- | --- | --- |
| wren-side | side-masters-revised.png | 0 / 3 |
| wren-front | wren-turnaround.png | 0 / 3 |
| wren-back | wren-turnaround.png | 1 / 3 |
| wren-walk-side | wren-turnaround.png | 2 / 3 |
| hadrik-side | hadrik-turnaround.png | 0 / 4 |
| hadrik-front | hadrik-turnaround.png | 1 / 4 |
| hadrik-back | hadrik-back-final.png | 0 / 1 |
| hadrik-walk-side | passing-revision.png | 0 / 2 |
| noble-side | side-masters-revised.png | 2 / 3 |
| noble-front | noble-turnaround.png | 0 / 3 |
| noble-back | noble-turnaround.png | 1 / 3 |
| noble-walk-side | noble-passing-final.png | 0 / 1 |

The original `side-masters.png` established all three side views first, then `side-masters-revised.png` corrected proportions. Character-specific crops of that revised side image were supplied as references for each turnaround. Hadrik's turnaround also corrected the side master's skin and supplied his approved side. Later corrections used those side references plus the flawed view when useful. The source files contain unused rejected figures; do not accidentally use those instead of this map.

## Exact image-tool prompts

The following text is the prompt template and actual substitutions used. Every call set `transparent_background=false`; the magenta key produced the final transparency. The initial call used no image reference. Later calls used only newly generated images from this project. Text-only prompts and reference lists do not guarantee identical future image-tool output; the delivered originals and processing scripts make this version reproducible.

### Initial side-master prompt

```text
Create an original pixel-art character reference image from text alone. Landscape canvas, exactly THREE full-body adult fantasy JRPG field sprites in one evenly spaced horizontal row, ALL STRICT RIGHT-FACING SIDE PROFILE, standing idle. LEFT Wren: adult woman ranger, auburn low ponytail, hood-down muted moss green cloak, brown leather jerkin, brown trousers, leather boots, wooden longbow held vertically on her near side, quiver on back. MIDDLE Hadrik: sturdy blacksmith in his forties, very dark umber skin clearly distinct from his cream rolled-sleeve shirt, short black hair, full black beard, brown leather apron, dark brown trousers, heavy boots, a short-handled iron hammer held at his near hip. RIGHT Noble: young adult woman, fair skin, golden hair in a compact updo, long deep cobalt-blue gown with aged gold trim, short blue cape, small visible shoes.
STYLE: restrained HD-2D pixel art in the spirit of Octopath Traveler 2 field sprites, original designs. EXACTLY 3.3 heads tall (head including hair approximately 30% of full figure height), mature faces, SMALL eye just ONE dark pixel at intended 92-pixel final height; serious adult proportions within this stylization, no cute enormous eyes. Uniform warm dark-brown 1-final-pixel outlines (#302321), never black. Solid carefully designed pixel clusters, no dithering. 3 to 4 flat value steps per material, upper-left lighting. Muted earthy palette, one principal stronger colour per figure (moss cloak, warm ochre apron, deep blue gown). No smooth rendering, no antialiasing, no painterly brush marks, no gradients, no glow. Deliberately draw enlarged pixel art with an apparent 92-pixel-tall logical grid, uniform square chunky pixels. Faces and hands economical, hair in 3 locks/clusters. Readable silhouettes and separated boots. Absolutely no cast shadows, ground, scenery, text, labels or extra figures.
BACKGROUND flat pure magenta #FF00FF everywhere outside figures, including gaps. Generous clear magenta margin all around and between characters. Equal figure heights and common foot baseline. Make each figure roughly 660 image pixels tall so all equipment is fully visible, separated with no overlap. Image is the master SIDE reference for later views.
```

### Side-master proportion correction

Reference: `big/side-masters.png`.

```text
Revise the three SIDE MASTER sprites in the supplied image. Keep the same character designs, equipment, right-facing strict profiles, pixel-art construction, warm brown outline, upper-left light and pure magenta background. Critical corrections: all three must be EXACTLY 3.3 HEADS TALL, measured crown to chin relative to crown to soles. Current bodies are too tall. Substantially SHORTEN torso and legs, keep mature facial features and tiny eyes. At target size: 92 pixels crown to sole, head crown to chin 28 pixels, chin at y=28, waist at y=49, knee at y=70, soles at y=92. This is a squat field sprite with adult face, NOT a long fashion illustration. Head including hair = 30 percent of height. Hadrik has VERY DARK SKIN: deepest skin #382522, midtone #59362A, lit skin #7D5038, maximum small highlight #A16F4D. His face and arms must remain dark brown, clearly darker than apron. Noble has tiny dark eye without big white eye; Wren tiny dark eye. Preserve Wren auburn LOW ponytail, green hood-down cloak, brown trousers and longbow plus quiver; Hadrik full black beard, black hair, cream rolled sleeves, brown apron and hammer; Noble golden updo, deep blue gown, short cape and muted gold trim. Simplify all gold ornament and skin to clean blocks. 3–4 flat tones per material, no gradients or texture. Outline warm brown #302321. No black outlines. Uniform logical pixel size; crisp chunky pixels. Exactly three figures in a horizontal row, each fully visible and equally tall, aligned soles. Blank magenta margin above and below. No labels, shadows or props on ground. One right-facing SIDE IDLE sprite per character, no other views.
```

### Turnaround template

The actual template is **COMMON + newline + CHARACTER BLOCK**. Each character block below was appended verbatim. Reference: that character's side-only crop from `side-masters-revised.png`; crop columns were 512 px wide, y=160 through y=959.

COMMON:

```text
Use the attached RIGHT SIDE MASTER as the exact character design reference. Create a landscape turnaround strip on uniform pure magenta #FF00FF, no scenery, ground shadows, text or labels. All figures same height, common foot baseline, ample margin, full body and equipment visible, clearly separate columns. Faithful serious adult fantasy JRPG field-sprite pixel art: 3.3 heads tall, small dark eyes, warm dark-brown outlines #302321 (one logical pixel), 3–4 flat shading steps, top-left light, muted earth colours. Head occupies about 30 percent of crown-to-sole height, short adult-stylized torso and legs. Intended final sprite height 92 pixels. Draw enlarged crisp square pixel clusters, no antialiasing, gradients, brush texture or dithering. Precisely preserve costume, hair, equipment sizes and outline treatment across views. Passing walk is a distinct RIGHT-FACING profile pose: planted far leg straight under hip, near leg bent at knee with lifted near heel and forward knee, feet passing close together (NOT wide stride), modest opposite arm swing, level head, 1 logical pixel garment lag.
```

WREN CHARACTER BLOCK:

```text
Exactly THREE figures: left FRONT, center BACK, right RIGHT-FACING WALK PASSING. Wren: adult woman ranger; auburn low ponytail, moss green cloak with hood DOWN, brown leather jerkin, brown trousers, boots, wooden longbow held in character's LEFT hand (front screen right / back screen left), quiver at right shoulder. Front exposes jerkin center and face; back exposes cloak, hood gathered behind neck, low ponytail and quiver; passing walk visibly lifts a boot and bends that knee. Keep bow vertical and intact in every view, draw fine taut bowstring separated from curved bow with magenta gap. Both hands small mitten shapes; front mature eyes each 1 final pixel, no giant whites. Do not add a raised hood, hat, sword, bag or extra bow. Maintain side master's crown-to-chin head size.
```

HADRIK CHARACTER BLOCK:

```text
Exactly FOUR figures: left RIGHT-FACING SIDE IDLE (corrected master), second FRONT, third BACK, fourth RIGHT-FACING WALK PASSING. Hadrik: sturdy adult blacksmith in his forties. IMPORTANT CORRECTION TO REFERENCE: his skin is VERY DARK DEEP CHOCOLATE, not tan, copper or orange: dark #382522, mid #59362A, light #7D5038, tiny maximum highlight #A16F4D. Skin much darker than apron in all views. Short black hair, full black beard, cream shirt with rolled sleeves, brown leather apron, dark brown trousers, heavy boots, short-handled iron hammer in character's RIGHT hand (front screen left / back screen right). Back has cream shirt, leather apron cross straps and waist tie, NOT full apron panel on back. Keep compact 3.3 head proportions, beard makes head outline tall. Passing pose bent near knee and lifted boot, planted far leg, controlled hammer swing downward away from knee. Same hair and mature brows, eye a single dark pixel without a large white sclera. Very dark skin is mandatory.
```

NOBLE CHARACTER BLOCK:

```text
Exactly THREE figures: left FRONT, center BACK, right RIGHT-FACING WALK PASSING. Noble: young adult woman with fair skin, golden hair in a compact low updo/bun, long deep cobalt blue gown, muted aged-gold trim, short blue cape, small brown shoes. Preserve reference waist and cape trim. Front: restrained square neck, small gold clasp, gold hem and vertical skirt trim, small mitten hands. Back: bun visible, short cape ends at waist, gown uninterrupted long folds below, no face. Passing walk: a little forward knee under cloth, near shoe lifted and visible under slightly raised front hem, far shoe planted under hip, hem offsets only 1–2 logical pixels, do not turn skirt into trousers. Eyes 1 final pixel dark brown each, no large eye whites, mature quiet expression. No crown, no jewels, no weapon. Gold hair is muted warm ochre, blue is the sole strongly saturated accent.
```

### Passing correction

Reference: Hadrik's approved side crop from his turnaround, plus Noble's rejected first passing crop.

```text
Draw exactly TWO full-body right-facing WALK PASSING sprites on pure flat #FF00FF magenta, in two separate equal-width columns. LEFT is Hadrik from first reference; RIGHT is Noble from second reference. Keep design, proportions and palette precisely, 3.3-head stylized adult pixel art, dark warm brown outline, upper-left 3–4-tone shading, tiny dark eye. Both have the WALK CYCLE PASSING POSE, not a stride, not a kick, not a march: the far leg is straight with planted sole DIRECTLY UNDER THE HIP; the near thigh angles slightly forward, knee bends, near calf folds BACKWARD and near toe points down, suspended JUST BESIDE THE PLANTED ANKLE. Knees and ankles almost overlap in profile. Near foot is 6 logical pixels higher than planted foot and its toe is behind the planted toe. No extended leg in front. Body stays upright, head level, small arm swing. This is the midpoint when one foot passes the other, NO feet spread horizontally apart.
Hadrik keeps VERY DARK CHOCOLATE skin, black hair and full black beard, rolled cream sleeves, brown leather apron, dark trousers, heavy boots and the same iron hammer in near hand; visible bent knee and raised boot immediately behind standing calf. Dark skin remains darker than apron. Noble keeps golden updo, blue gown and short blue cape, gold trim. Gown has a tiny knee bulge, hem rises only slightly to show a lifted shoe beside the planted ankle; no long forward boot, no trouser leg, no exaggerated lifted skirt. One small shoe supports the center of her body. Their silhouettes remain roughly the same overall widths as idle masters.
Crisp enlarged square pixel art with logical final height 92px; no gradients, antialiasing, dithering or brush texture. Generous magenta around and between both full figures, same sole baseline for planted feet. No text, labels, cast shadows, floor or extra figures.
```

### Noble final passing correction

Reference: Noble's side crop from side-masters-revised.png.

```text
Use attached noble SIDE IDLE sprite as exact costume, silhouette, scale and proportion reference. Draw ONE new RIGHT-FACING WALK PASSING frame on flat pure magenta #FF00FF. Her gown remains FLOOR LENGTH, same width and same long silhouette as reference, its gold hem reaches the ankles and covers the knees and calves entirely. Both shoes remain TINY flat brown shoes, each only 2–3 final pixels tall; NO boots, NO visible shins, NO trousers. Supporting shoe planted immediately under her center. Other shoe just peeks out behind that shoe, lifted 2 logical pixels with toe pointed down. Legs pass closely under the long gown. Movement is subtle: slightly bent hidden knee makes a 1-pixel front skirt bulge, hem trails behind by 2 pixels, forward arm swings just 2 pixels and rear arm 2 pixels. DO NOT shorten the dress, DO NOT expose lower legs, DO NOT kick a foot forward. Upper body and head match original: young adult fair woman, golden updo, tiny dark eye, blue short cape, gold trim, deep blue gown. Total height 92 logical pixels, about 3.3 heads. Warm brown 1-pixel outline, 3–4 flat tones per material, upper-left light, chunky crisp pixel clusters, no dithering or gradients. Full body with margin, no shadows or floor or text.
```

### Hadrik rear hammer correction

Reference: Hadrik's original rear crop and his approved side crop from hadrik-turnaround.png.

```text
Correct the attached Hadrik BACK VIEW, preserving exactly his compact pixel-art proportions, full-body size, short black hair, very dark chocolate brown skin, cream rolled sleeve shirt, crossed brown leather apron straps and waist knot, dark trousers, heavy boots, warm dark brown outline and flat magenta #FF00FF backdrop. ONE rear-facing idle figure only. The important change: make his iron HAMMER clearly visible outside his anatomical RIGHT thigh, SCREEN RIGHT. His right hand holds the short wooden shaft; the dark grey rectangular iron hammer head hangs just BELOW AND OUTSIDE that hand with a small light grey top edge. Keep it similar in size to the hammer in the attached SIDE reference, about 10 logical pixels tall by 6 wide at 92-pixel total figure height. It must not be hidden behind the trousers or mistaken for a pouch. His right arm is only slightly away from body. Keep all other details including cross straps, no added backpack, no apron panel on back, no turned face. Small adult JRPG field sprite, nominal3.3 heads crown-to-chin excluding beard, crisp square pixel art, 3–4 tones, upper-left light, no texture, dithering, antialiasing, ground shadow, floor, text or labels. Full figure fits with magenta margin.
```

