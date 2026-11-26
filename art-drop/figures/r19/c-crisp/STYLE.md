# Crisp Classic

A compact, three-head field-sprite style: dark coloured contours, flat material planes, restrained earth colours, and a square pixel grid. The reference page is `STYLE-SHEET.png` (1920 × 2720). The twelve transparent masters are in `sprites/`; the original large drawings used for them are in `big/`. The rules below define the intended style. `NOTES.md` records where these samples fall short of the rules.

## Frame and proportions

- Every sprite is RGBA, 96 × 128 pixels. Coordinates are zero-based.
- Opaque figure height is exactly 92 pixels, from row 33 through row 124 inclusive. Row 124 is the lowest occupied sole/hem row. Rows 125–127 remain transparent.
- Target three head units: approximately 30–31 pixels crown to chin, another unit from chin to hip, another from hip to sole. Crown at y=33, target chin around y=63, hip around y=94, sole at y=124. The beard may extend below the anatomical chin.
- Preserve adult brows, noses, clothing and posture within the compact proportions. Avoid infant cheeks, huge eye whites, blush and toy-like hands.
- Heads are approximately 30–36 pixels wide including hair. Hadrik has a wider body, Wren a narrower silhouette with projecting equipment, and the Noble a single long skirt mass. Do not stretch a character horizontally to fill the frame.
- Front and rear are centered by the full silhouette. Side and passing use the center of the upper 31 opaque rows as the head axis, placed at x=48. This prevents the moving cloak or hammer from shifting the whole figure.
- Front means directly toward the viewer; back means directly away; both side views face right. No three-quarter substitutions.

## Contours and clusters

Use a one-pixel contour in the darkest colour of the local material, on both the exterior and interior separations. A border belongs to one material: do not draw two adjacent parallel outlines at a seam. Where two materials meet, favour the darker of their contour colours. Do not add a separate universal pure-black ink or a fourth shadow colour.

Contour thickness means one pixel normal to an edge; a diagonal staircase can touch two pixels at a corner. The intended rule is not a two-pixel dark band. Use deliberate square steps and connected planes. Aim for clusters at least 2 × 2 pixels, except eyes, outlines, strings, thin trim and fingertips. No dithering, checkerboard blends, speckled texture, antialiasing, transparency feathering, or floating highlight pixels. Details that cannot survive at native size should be omitted in the drawing.

Use the sheet's small rectangular outline swatches as the exact edge-width rule. The sprites retain some thick or broken source contours; do not treat those defects as permission to abandon the rule.

## Light and three-tone shading

Light comes from upper **viewer-left**, fixed in screen space across every view. Do not rotate the light with the character. Each material has exactly three permitted values: dark for outline and deep shadow, middle for the main plane, light for an exposed plane. A tiny visible area may not have room for all three values; never invent an intermediate value to make it smoother.

Prefer one large middle plane, one connected shadow and one compact light plane per form. Cloth has broad folds, hair has grouped locks, and metal has a small rectangular highlight. Do not trace every outline with a highlight. The sphere on the sheet demonstrates the same blue ramp as the gown; it has three colours including its outline.

## Master palette

The source of truth is `palette.json`. All values are sRGB; all sprite pixels belong to this table. Transparency is alpha 0, visible pixels alpha 255. The magenta drawing backdrop is a temporary key colour and never belongs to the palette.

| Ramp | Dark / outline | Middle | Light |
| --- | --- | --- | --- |
| Fair skin | `#593B36` | `#B78168` | `#E2B68E` |
| Dark skin | `#211E26` | `#503733` | `#865848` |
| Green | `#202F2B` | `#435B3E` | `#75835A` |
| Auburn | `#38262A` | `#764333` | `#AC7049` |
| Leather / wood | `#30282A` | `#644737` | `#97704C` |
| Cream | `#514A41` | `#AAA08A` | `#DED2AE` |
| Blue | `#1D263B` | `#304D70` | `#66829A` |
| Gold / blonde | `#55412C` | `#A08346` | `#D4B96D` |
| Iron | `#293039` | `#626F76` | `#A4B2B4` |
| Black hair | `#1C1D25` | `#34343C` | `#55515A` |

Wren uses fair skin, green, auburn, leather/wood, cream fletchings, and gold fittings: 18 colours across her four frames. Hadrik uses dark skin, leather/wood, cream, iron and black hair: 15. The Noble uses fair skin, blue, gold/hair and leather shoes: 12. The shared master palette has 30 colours, below the 32-colour character limit even if every ramp were used.

## Drawing materials and anatomy

**Faces and eyes.** Build the face as a clear light plane with a small side shadow, stepped nose and short mouth. The eye target is one dark pixel, optionally two pixels high on the enlarged head. A brow is a separate short horizontal cluster; leave a pixel of skin between brow and eye where possible. No white glints or eyelash fans. A profile has one visible eye and one nose step. Keep ears small and separated from the hair mass.

**Hands.** Use a roughly 3 × 5-pixel mitten, with a one-pixel thumb offset when needed. The grip wraps visibly around the prop; do not draw individually outlined fingers. The dark edge and one small highlight are sufficient. A hand must remain distinguishable from adjacent leather even at 1x.

**Hair.** Fill a solid silhouette, then divide it into two or three broad locks. Auburn and blonde each use their own ramp; black hair highlights remain neutral violet-grey, never skin brown. Wren's low ponytail is attached at the nape. The Noble's hair is pinned into a compact low bun, with no crown. Hadrik has cropped hair and a full connected beard; the beard extends the silhouette without enlarging the skull.

**Cloth.** Broad flat masses, with a small number of stepped folds. Wren's hood is down and readable at the nape; her cloak leaves the near arm and boots readable. The Noble's cape ends above the waist and remains distinct from the floor-length gown. Keep gold edging approximately one pixel wide, backed by a dark separator when it overlaps blue.

**Leather and wood.** Use the same brown ramp, distinguished by shape. Wren's jerkin has a belt and a few structural seams; avoid adding fine stitching. Hadrik's apron has one pocket. The rear view shows its neck loop and waist ties over the cream shirt, not a second apron panel on his back. Boots have a large toe plane and a darker sole. Wood gets a long clean highlight, no grain texture.

**Metal.** Iron uses three cool values with a flat rectangular light patch. The hammer head must read as a solid rectangular mass attached to a wooden handle. Gold fittings share the blonde ramp; make the shape, not extra specular colours, distinguish them from hair. No glowing edges.

## Identity and walk rules

Draw each character's right-facing standing side first. Use that actual image as the identity reference for front, rear and passing; never generate those views independently from text alone. Wren's side established the common scale and was also supplied as a style-only reference when drawing the other two side views. Hadrik's skin correction was completed before generating his other views.

The bow and hammer are in the character's left hand: viewer-right in front view, viewer-left in rear view, the near hand in the right-facing profile. Quiver, belt, apron pocket and cape lengths should stay consistent when turned. Keep the head mass stable between standing and passing.

The passing pose is a single mid-stance example, not a complete walk cycle. One support leg is beneath the hip and touches row 124; the other knee advances about four pixels and its foot clears the ground by roughly five pixels. Avoid a wide contact stride. Arms counter-swing modestly; a carried prop remains controlled. Cloth may trail two to three pixels and the ponytail about one pixel. The Noble's hidden knee is communicated by the raised front hem and an exposed shoe; do not expose a bare leg.

For future animation, align the head and planted foot first and then assess the motion over a complete cycle. These samples have modest view-to-view shape drift and are not a validated looping animation.

## Exact reduction and palette cleanup

The large original drawings are 1254 × 1254 RGB PNGs on magenta. Every character shape and the sphere were drawn by the built-in image tool. Python was used for keying, reduction, palette snapping, frame/sheet assembly and checks. It did not paint replacement anatomy or props.

The repeatable implementation is `../scratch/process.py`; sheet assembly is `../scratch/assemble.py`. Retain the source images if reproducing the delivered pixels. The steps are:

1. Read the original as RGB. A pixel is keyed out when **all** of these are true: `R > 80`, `B > 60`, `R > 1.6*G`, `B > 1.6*G`, `B > 0.55*R`, `R > 0.65*B`. This removes magenta and magenta edge contamination without erasing earthy materials.
2. Find the bounding box of non-key pixels and crop to it. Record this box in `../scratch/checks.json`.
3. Resize once with Pillow `Image.Resampling.NEAREST` to height 92 and width `round(crop_width * 92 / crop_height)`. Do not smooth, sharpen, use error diffusion, or stretch to 96 pixels wide.
4. Reapply the same key predicate to the reduced RGB pixels. This is binary classification: alpha 0 or 255 only.
5. For non-key pixels whose maximum RGB channel is at least 56, choose the closest source-colour prototype by squared RGB distance and map it to the corresponding target material/tone. The complete prototype triples are in `PROTOS` in the processing script. They compensate for the original drawings' warmer, brighter values; blindly choosing the nearest master colour mixes skin with leather and gold.
6. Apply the script's explicit material restrictions: Wren's upper head allows fair skin/auburn and auburn is disallowed below reduced row 39. Hadrik's upper 39 rows allow dark skin/black hair; nearly neutral colours there map only to black hair. Neutral shirt pixels in rows 39–56 use cream, neutral lower prop pixels use iron, and rows 76 onward use leather. Noble's upper head allows fair skin/gold; blue-dominant pixels below it use blue, warm hand-region pixels use fair skin/gold, and warm hem/shoe pixels use gold/leather. These are palette assignments, not silhouette edits.
7. Pixels darker than the threshold inherit the closest already-classified material through the opaque shape and receive that material's darkest tone. The implementation is a deterministic multi-source, four-neighbour breadth-first traversal, seeded in row-major order, visiting up, left, right, down. It recolours the existing ink without dilating, eroding or repainting it.
8. Paste into an empty 96 × 128 RGBA frame at y=33. Center front/back by the crop width. For side/passing, center the upper 31 rows' horizontal extent at x=48. Preserve transparent RGB as `(0,0,0)`.
9. Check dimensions, alpha, palette membership, occupied rows and character-wide colour count. Inspect at native size and at integer enlargement. When shape quality is weak, request a new image-tool drawing; do not paint a new figure in Python.
10. Assemble each full frame at exactly 3x nearest-neighbour on the neutral sheet. The proportion figure is also 3x; the geometric outline examples are 6x and the image-tool sphere is 5x, explicitly labelled.

Rebuild from this folder with `python scratch/process.py` followed by `python scratch/assemble.py`. The source prompts and inspection images stay in `scratch/`. `PROMPTS.txt` is the complete retained prompt record with reference relationships.

## Exact image-tool prompt template

Each character request used this construction, with literal strings joined by a newline:

```text
{BASE}
{PALETTE}
{CHARACTER_AND_VIEW_REQUEST}
```

The exact `BASE` used for the accepted character requests was:

```text
Use case: stylized-concept. Production pixel art for serious adult fantasy JRPG. CRISP CLASSIC, tight SNES-plus style. Draw with a coarse deliberate visible square pixel grid: the figure has exactly approximately 92 art pixels in height, then enlarged 8x nearest neighbor. 3 heads tall, head ~29 pixels, adult face and anatomy stylized, strong readable silhouette. All silhouette AND interior material separations have a uniform ONE art-pixel darkest-local-material outline. Exactly 3 flat tones per material (dark contour/shadow, midtone, light). No dithering, no texture, no gradients, no antialiasing, no extra fine detail, no painterly or rounded vector shapes. Each cluster at least 2x2 art pixels except 1 pixel outlines and eyes. Light from upper viewer left. Eyes 1 dark pixel, no white glints. Hands simple 3x5 pixel mitten, thumb at most 1 pixel. Flat solid magenta #FF00FF background without shadow or scenery. Full figure head to sole, no cropping, substantial empty margin. CRITICAL PROPORTIONS: exactly THREE HEADS TALL, not four or five. Crown-to-chin is a full ONE THIRD of crown-to-sole height. At 92px: head occupies 30px; chin-to-waist 30px; waist-to-sole 32px. OVERSIZED HEAD, compact short torso, short sturdy legs. Chin at 33% of total height; belt at 65%. This outweighs any realistic anatomy request. Adult facial features within these compact proportions.
```

The exact `PALETTE` string was:

```text
Exclusive master palette: fair skin #593B36 #B78168 #E2B68E; dark skin #211E26 #503733 #865848; green #202F2B #435B3E #75835A; auburn #38262A #764333 #AC7049; leather/wood #30282A #644737 #97704C; cream #514A41 #AAA08A #DED2AE; blue #1D263B #304D70 #66829A; gold/hair #55412C #A08346 #D4B96D; iron #293039 #626F76 #A4B2B4; black hair #1C1D25 #34343C #55515A.
```

`CHARACTER_AND_VIEW_REQUEST` was the exact per-view paragraph transcribed in `PROMPTS.txt`, not an inferred description. For example, Wren's accepted side paragraph was:

```text
ONE CHARACTER ONLY: WREN adult woman ranger, right-facing strict SIDE VIEW neutral standing feet together. Auburn hair in a low ponytail; large head 30px tall out of 92px total height. Green cloak hood down at nape, knee-length, brown leather jerkin, brown trousers and boots, wooden longbow held vertically ahead of body, quiver with three arrow fletchings on back. Keep hands simple, clothes broad flat planes. Output one square image full body on magenta, no labels. Emphasize compact THREE HEAD height: massive head relative to short trunk and short legs.
```

The tool was called with `transparent_background=false` to preserve the requested magenta-key workflow. New Wren side generation had no image reference; other calls supplied `referenced_image_paths` pointing to the relevant local side original. Hadrik's skin correction and the shading sphere used the separate literal prompts also retained in `PROMPTS.txt`. The image tool does not guarantee the requested pixel grid or colours; the source image and subsequent reduction remain essential to an exact reproduction.
