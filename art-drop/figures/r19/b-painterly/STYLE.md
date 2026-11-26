# Moss & Ember — painterly pixel

A soft, earthy field-sprite style for a serious adult fantasy JRPG. Volume comes from discrete colour clusters and warm-to-cool ramps. The final sprite is crisp pixel art; painterly describes the shapes and colour relationships, not blurred edges.

## Frame and proportions

- Canvas: **96 × 128 RGBA pixels**. Transparent pixels have RGBA `(0,0,0,0)`; visible pixels have alpha 255.
- Figure: **92 pixels tall**, crown at row 33 and lowest planted sole at row **124**, using zero-based coordinates. Horizontal centring includes equipment. Keep three empty rows below the feet.
- Nominal structural anatomy: **3.5 heads**, one head about **26 pixels**. Measure the head from structural crown to chin; exclude beard, loose hair and bun. Hair volume makes the apparent ratio somewhat smaller. Do not copy the tall proportions of the rejected first sources.
- Face: restrained adult brow and nose, no oversized sparkling eyes. One dark pixel is the eye core; at most one neighbouring dark brow pixel. No white sclera highlight is necessary at native size.
- Head/torso/leg landmarks are guides, not extra outline bands. Keep shoulder width, head scale and boot length consistent between views. Hadrik has a broader torso; the women have compact, adult silhouettes.

## Edges and pixel clusters

Use the Contour ramp for a nominal one-pixel dark outer contour, especially along the underside and shadow-facing silhouette. Prefer plum charcoal to pure black. A lit edge may merge with a material shadow colour. Do not stroke every interior feature. Separate sleeve from apron, cape from gown, and hair from face using adjacent material values. Deep occlusion can still be dark, but should form a small connected shadow mass.

Main shapes use coherent **2–6 px clusters**; larger cloth regions can exceed that. Single pixels are reserved for eyes, fasteners, bowstring and a few texture accents. Avoid evenly distributed salt-and-pepper texture. A diagonal should form deliberate stair steps, not an antialiased fringe.

The intended dithering is sparse checker pairs between **adjacent tones** over broad cloth only, normally no more than roughly 5% of the cloth area. Keep it away from faces, hands and silhouette edges. The source drawings include this texture; the reduction pipeline does not add procedural noise or a global dithering filter. Some source checker texture coalesces during reduction.

## Light and materials

Use a screen-space **upper-left light**, consistent across every view. Shadows lean toward plum, blue or desaturated green; upper planes become warmer and lighter. Use **four or five tones per material**, with two dark contour options shared across characters. Do not assume all tones must appear in every small region.

- **Hands:** a 3–5 px mitten mass, one thumb notch if readable, one highlight plane and one shadow plane. Grip a tool with a single clear hand mass. Do not draw five separate fingers at native scale.
- **Faces:** a broad cheek plane, a small nose step in profile, a compact jaw, one brow/eye accent. Preserve Hadrik's very dark skin through all views; it should read darker than his leather apron.
- **Hair:** 3–4 interlocking locks rather than strands. Wren has an auburn low ponytail; Noble has a swept golden updo; Hadrik has short black hair and a full black beard. Hair and beard highlights stay charcoal on Hadrik.
- **Cloth:** 4–5 tones. Let the largest fold describe the volume. Secondary folds are broad colour changes; do not enclose them with ink. Cloak and skirt may carry the sparse dithering described above.
- **Leather/wood:** broad warm midtone, cool brown shadow, narrow muted highlight. Wren's longbow remains a thin readable curve with a fine string; keep quiver and arrow tips as a connected equipment silhouette.
- **Iron:** 3–4 compact planes, one restrained bright edge on the hammer. No bloom or sparkling white streaks.
- **Gold:** the same muted gold ramp serves hair and trim, but hair uses broader patches while trim is usually 1 px wide.

## View and walk rules

Generate and approve **right-facing side first** for each character. That exact large side image is the identity reference for its front, back and passing images. Never use a different character as an identity reference.

Front means square shoulders and a forward face. Back means no visible eye or cheek. Side means a right-facing profile, with consistent equipment and hair placement. Occlusion can hide parts of the outfit; do not duplicate tools to make them visible.

The passing frame is one sample, **not a complete walk cycle**. The support foot is planted under the hips at row 124; the swinging foot passes it with a raised heel and a slightly advanced bent knee. Keep the feet close compared with a contact pose. Use restrained arm counter-swing. Bow and hammer remain held; cloth lags a little behind. Noble's shoes and hem movement must communicate the passing action despite her long gown. Keep head and torso stable; no deliberate bob is added to these reference frames.

## Exact reduction and cleanup

The reproducible implementation is `../scratch/build.py`. Python only keys, reduces, snaps palettes, assembles the reference page and performs checks. It does not draw, repaint, reshape or repair the figures.

1. Read each selected image-tool PNG from `big/<name>-<view>.png` as RGBA. The source is a large drawing on magenta, not a transparent original.
2. Key a pixel to `(0,0,0,0)` when `R > 120`, `B > 100`, `G < 0.60*R`, and `G < 0.65*B`; all other source pixels become fully opaque. This removes the magenta field and its similar compressed/antialiased shades while retaining muted clothing.
3. Crop to the keyed alpha bounding box. Compute width as `round(crop_width * 92 / crop_height)`. Reject a source if this exceeds 90 pixels; regenerate instead of squeezing its aspect ratio.
4. Resize once to `(width, 92)` using Pillow **LANCZOS**. Pillow's RGBA resizing handles alpha during filtering. This averages large source clusters into target pixels; it is not the final display filter.
5. Threshold resized alpha: values below **144** become transparent black; the rest become alpha 255. No soft alpha remains.
6. For each visible pixel, choose the closest colour in that character's fixed subset using squared distance `2*(R-r)^2 + 3*(G-g)^2 + (B-b)^2`. Wren has a clothing hue gate, applied only on rows 30-91 of the resized 92-pixel figure to keep it out of the head: when `G >= 0.78*R`, `G <= 1.25*R`, `B < 0.64*G`, and `G > 48`, restrict candidates to the Moss cloth ramp. This keeps the source's yellow-olive cloth from snapping to leather brown. The blue/green cutoff excludes warm skin highlights. This is palette classification with a fixed head-exclusion guard; it does not repaint pixels or alter shapes. Do not add dithering during palette snapping. Ties use the palette order in `palette.json`.
7. Crop the result to its visible bounds, centre it horizontally with integer floor division, and place its lowest visible row at **124** in the 96 × 128 transparent frame. No body parts are individually scaled or moved.
8. Check dimensions, alpha set `{0,255}`, visible height, baseline and palette membership. Check the **union of colours across all four views** is at most 32 per character, not merely each file.
9. Display the sprites at exact integer scale with **NEAREST**. The sheet uses **3×**; individual review images use **4×**. Never display a smoothed enlargement as the reference.
10. Inspect each native sprite and enlarged silhouette. Fix weak anatomy, missing equipment or a poor pose by regenerating with the image tool and rerunning the same pipeline. No Python-painted replacement anatomy is allowed.

## Palette

The master contains shared material ramps, not a single 32-colour global palette. Wren's allowed subset has 28 colours, Hadrik's 25, Noble's 20. Actual usage can be smaller. The machine-readable source of truth is `palette.json`; the same labelled ramps are shown on the sheet.

**Contour:** #292730 · #3D3540

**Moss cloth:** #303D38 · #485947 · #71805A · #9DA67A · #BDCA99

**Leather / wood:** #443237 · #66503F · #90714E · #B99A6A · #D0B88A

**Auburn hair:** #493035 · #734332 · #A36340 · #C78D60

**Warm skin:** #785146 · #AD7960 · #D4A47B · #E8C69B

**Deep skin:** #29232A · #403038 · #5B3F40 · #795649 · #9B765A

**Charcoal:** #252630 · #34343B · #4B494B · #64605B

**Linen:** #605A54 · #8D8571 · #B8AF91 · #D0C5A5 · #E1D6B5

**Iron:** #333843 · #505D68 · #849296 · #B9C1B6

**Blue cloth:** #292D46 · #354661 · #4F6480 · #768B9D · #A3B4B6

**Gold:** #655139 · #927344 · #BC985A · #D9BD7C · #E8D49C

**Fair skin:** #80605A · #AD8370 · #D4AC8C · #EBD0AA

## Exact image-tool prompts

All figures used the built-in image tool with opaque magenta backgrounds. Side originals were generated first, then proportion-corrected using that character’s initial side as the reference. Hadrik received the additional skin correction. Each other view used only its character’s approved side original. Prompts below are verbatim; the new-view template expands the indicated substitutions.

### Initial side: wren

~~~text
Use case: stylized-concept. Asset: one source figure for a serious adult fantasy JRPG field sprite.
Draw Wren, adult woman ranger: auburn hair in a low ponytail, hood-DOWN muted moss green cloak, brown leather jerkin, brown trousers and boots, wooden longbow in near hand and quiver on back.
VIEW: true SIDE PROFILE facing RIGHT, standing neutral, both feet readable. Single figure only.
STYLE: painterly pixel HD-2D, adult 3.5 heads tall (large head but mature face, no baby face), compact field-sprite anatomy, strong readable silhouette. Dark COLOURED selective outline only around outer silhouette, interiors defined with colour masses, no interior ink. Four or five discrete hue-shifted tones per material: cool plum shadows, warm restrained upper-left highlights. Broad coherent pixel clusters, sparse intentional checker dithering only on broad cloth midtones. Muted earthy palette, no glossy saturation, no blur, no smooth gradients, no tiny texture noise.
COMPOSITION: entire figure centred, crown to sole about 75 percent of canvas height, generous pure flat #FF00FF magenta everywhere outside figure, no ground, shadow, text, frame or props detached from figure. Bow entirely visible. Draw as a large clean pixel illustration to be reduced to a 92px tall sprite inside a 96x128 frame. Eyes one dark pixel at target scale. Head approximately 26px at target, shoulders relaxed.
Palette direction: outline #292730; moss #303D38 #485947 #71805A #9DA67A; leather #443237 #66503F #90714E #B99A6A; auburn #493035 #734332 #A36340 #C78D60; skin #785146 #AD7960 #D4A47B #E8C69B.
~~~

### Initial side: hadrik

~~~text
Use case: stylized-concept. Asset: one source figure for a serious adult fantasy JRPG field sprite.
Draw Hadrik, blacksmith in his forties: very dark brown skin, short black hair, full dense black beard, brown leather apron over cream shirt with sleeves rolled to elbows, dark brown trousers, heavy boots, solid iron hammer held low in near hand. Broad sturdy mature body, 3.5 heads tall, strong adult profile.
VIEW: true SIDE PROFILE facing RIGHT, standing neutral, both feet readable. Single figure only.
STYLE: painterly pixel HD-2D, adult 3.5 heads tall (large head but mature face, no baby face), compact field-sprite anatomy, strong readable silhouette. Dark COLOURED selective outline only around outer silhouette, interiors defined with colour masses, no interior ink. Four or five discrete hue-shifted tones per material: cool plum shadows, warm restrained upper-left highlights. Broad coherent pixel clusters, sparse intentional checker dithering only on broad cloth midtones. Muted earthy palette, no glossy saturation, no blur, no smooth gradients, no tiny texture noise.
COMPOSITION: entire figure centred, crown to sole about 75 percent of canvas height, generous pure flat #FF00FF magenta everywhere outside figure, no ground, shadow, text, frame or props detached from figure. Hammer entirely visible. Draw as a large clean pixel illustration to be reduced to a 92px tall sprite inside a 96x128 frame. Eyes one dark pixel at target scale. Head approximately 26px at target, shoulders relaxed.
Palette direction: outline #292730; very dark skin #29232A #403038 #5B3F40 #795649 #9B765A (keep skin very dark); black hair #252630 #34343B #4B494B #64605B; leather #443237 #66503F #90714E #B99A6A; linen #605A54 #8D8571 #B8AF91 #E1D6B5; iron #333843 #505D68 #849296 #B9C1B6.
~~~

### Initial side: noble

~~~text
Use case: stylized-concept. Asset: one source figure for a serious adult fantasy JRPG field sprite.
Draw Noble, young ADULT woman: fair skin, golden hair in a neat elegant updo bun, long deep blue gown with narrow antique gold trim, fitted bodice, short blue shoulder cape. Simple readable dignified silhouette, gown reaches ankle, two small dark shoes visible, no crown or staff. 3.5 heads tall, mature face.
VIEW: true SIDE PROFILE facing RIGHT, standing neutral, both feet readable. Single figure only.
STYLE: painterly pixel HD-2D, adult 3.5 heads tall (large head but mature face, no baby face), compact field-sprite anatomy, strong readable silhouette. Dark COLOURED selective outline only around outer silhouette, interiors defined with colour masses, no interior ink. Four or five discrete hue-shifted tones per material: cool plum shadows, warm restrained upper-left highlights. Broad coherent pixel clusters, sparse intentional checker dithering only on broad cloth midtones. Muted earthy palette, no glossy saturation, no blur, no smooth gradients, no tiny texture noise.
COMPOSITION: entire figure centred, crown to sole about 75 percent of canvas height, generous pure flat #FF00FF magenta everywhere outside figure, no ground, shadow, text, frame or props detached from figure. Gown and shoes entirely visible. Draw as a large clean pixel illustration to be reduced to a 92px tall sprite inside a 96x128 frame. Eyes one dark pixel at target scale. Head approximately 26px at target, shoulders relaxed.
Palette direction: outline #292730; deep blue #292D46 #354661 #4F6480 #768B9D #A3B4B6; gold hair and trim #655139 #927344 #BC985A #D9BD7C #E8D49C; fair skin #80605A #AD8370 #D4AC8C #EBD0AA; dark shoes #34343B #4B494B. Keep blue gown deep blue with cool shadows, not teal.
~~~

### Proportion correction, all three sides

~~~text
Use case: identity-preserve. Redraw this same right-facing side-view character as a compact 3.5-heads-tall JRPG FIELD SPRITE. The input has overly long body proportions (about 5 heads): CHANGE PROPORTIONS decisively. Head from crown through chin must occupy exactly 29% of the full figure height; body from chin to soles only 71%. Shorten torso and legs, enlarge the head. Keep adult face and all clothing, gear, identity, colour scheme, painterly pixel clusters and restrained cloth dithering. Only ONE full figure, true right-facing side profile, neutral standing. SQUARE canvas, full character roughly y=128 to896; head crown y128, chin y348; soles y896. Head unit 220 pixels, full figure 770 pixels, 3.5 heads. Short stocky field sprite silhouette, not tall fashion illustration. One-pixel-scale eye. Keep selective outer dark coloured contour, interior colour separation without black lines, upper-left warm light with plum cool shadows. Flat pure #FF00FF magenta background, no labels, no ground shadow, no environment. All gear and feet fully inside canvas.
~~~

### Hadrik skin correction

~~~text
Use case: identity-preserve. Keep this exact compact right-facing blacksmith figure, pose, proportions, apron, cream rolled sleeves, boots and hammer. Correct ONLY skin and hair: Hadrik is a man in his forties with VERY DARK skin, near-black deep umber with cool plum shadows. All exposed forehead, face, nose, ear, arms and hands use #29232A shadows, #403038 dark umber base, #5B3F40 midtone, #795649 restrained tiny highlights. Skin must be distinctly DARKER than the brown leather apron, not tan, orange or copper. Short close-cropped BLACK hair, black full beard; hair must not look brown or gold, keep highlights charcoal grey. One eye dark with no bright white pixel. Same painterly pixel cluster style, magenta background #FF00FF. Do not change composition or add text.
~~~

### Other-view template

~~~text
Use case: identity-preserve. Asset: ONE field-sprite source figure.
REFERENCE: attached image is the approved RIGHT SIDE view of {NAME}. Preserve this exact character's face, hair silhouette, all clothing, equipment, compact adult anatomy and painterly pixel treatment.
NEW VIEW: {VIEW}
Maintain nominal 3.5-head proportions: crown to chin around 28 percent of figure height (excluding beard and hair bun), body short and compact. Same character height and head scale as reference. Outer silhouette uses dark coloured contour, interior folds are colour masses without black ink. Four or five hue-shifted tones per material, warm upper-left light, cool plum shadows, subtle sparse cloth-only dithering, broad pixel clusters. Adult serious expression; tiny dark eyes, not sparkly anime eyes.
Canvas SQUARE. Exactly one entire figure with generous flat pure #FF00FF background. No labels, shadows on ground, frame, extra people or objects. No smooth gradient or blur. Keep full outfit and props visible, sole at same level. Figure will reduce to 92 pixels high in a 96x128 frame.
~~~

Replace {NAME} with wren, hadrik or noble. Replace {VIEW} with exactly one of:

**front**

~~~text
FRONT view, full face and chest facing directly toward camera, both shoulders symmetrical, neutral relaxed standing. Show front closures and belt. Keep character's own left/right equipment placement anatomically consistent.
~~~

**back**

~~~text
BACK view, completely turned away from camera. No face, no eye, no cheek or nose visible. Show back of same hairstyle and back of outfit, hood stays down. Maintain same equipment with correct occlusion.
~~~

**walk-side**

~~~text
TRUE SIDE PROFILE facing RIGHT, one WALK PASSING frame. Near support leg is straight directly below hips with sole planted; far leg swings past it, bent knee slightly forward, heel raised 5 target pixels, feet close together rather than spread into a contact stride. Gentle counter-swing of arms; torso upright; head level. Cloak or skirt sways subtly backward. All outfit and equipment unchanged. For long gown, visibly raise the rear heel and shift lower hem folds while keeping support shoe planted. This must look different from standing but must NOT be a wide-stride/contact pose.
~~~

Append this line to each Hadrik new-view prompt:

~~~text
CRITICAL IDENTITY: very dark near-black umber skin with cool plum shadow, clearly darker than brown apron. Short BLACK hair and full BLACK beard. Keep cream shirt sleeves rolled. Hammer held in same near hand.
~~~


## Targeted view corrections

The first Hadrik back view incorrectly duplicated the front apron bib. The first walking view extended a leg like a march. Both were regenerated with these exact prompts.

### Hadrik back correction

~~~text
Use case: precise-object-edit. Correct ONLY the apron construction in this BACK view of Hadrik. A smith's apron covers his FRONT, not his back. Remove the duplicate brown bib and large brown apron skirt on the back. Show the back of his CREAM SHIRT down to waist, with two narrow brown shoulder straps crossing into an X and a narrow brown waist tie knotted at centre back. Below waist show DARK BROWN TROUSERS and heavy boots, with just small leather apron edges wrapping around the outside hips. Keep pose, body proportions, head, short black hair, very dark skin and hammer in his right hand (viewer right) identical. Clearly back view, no face. Same painterly pixel clusters and upper-left light. Magenta #FF00FF background. No labels, shadows, extra figures.
~~~

### Hadrik passing correction

~~~text
Use case: identity-preserve. Use this approved RIGHT SIDE Hadrik as exact identity and outfit reference. Draw ONE genuine mid-PASSING walk frame facing RIGHT. Critical pose: near support leg straight under hip, foot flat planted. Far thigh comes slightly forward, knee bends sharply so the far shin angles BACK; far ankle passes BEHIND the support ankle and the far foot hangs toes DOWN, its lowest toe FIVE TARGET PIXELS ABOVE ground. Both feet are CLOSE TOGETHER horizontally. Do NOT extend a straight leg forward like marching or kicking. This is mid-passing, not contact stride. Keep torso upright and head exactly the same scale and height. Gentle arm swing, hammer remains in near hand. Keep very dark skin, short black hair and full beard, cream rolled sleeves, brown apron and dark trousers. Same compact nominal3.5-head mature proportions. Same broad painterly pixel clusters, selective contour, upper-left light. Pure magenta #FF00FF background, full figure, no shadow, no text.
~~~
