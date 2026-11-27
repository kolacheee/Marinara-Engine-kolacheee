# Round 25 notes

## Selection

Kept **attempt 3 of 3** as `raw.png`. Each attempt used one image-tool call to draw all five characters together, with no attached reference images. The third attempt best balances the coarse block shapes, comparable character scale, turned poses, and shared foot baseline. It shows all five requested roles, full bodies, distinct hanging fabrics, the merchant's large pack, and the cleric's tall staff.

Attempt 1 had recognizable designs and good spacing, but too much fine detail and textured shading. Attempt 2 simplified the shapes substantially, but the scholar was nearly straight-on and the dancer's feet were less evenly grounded. Attempt 3 improves those issues while keeping the lineup readable. Earlier outputs are preserved as `attempt-1.png` and `attempt-2.png`; their exact prompts are in the corresponding prompt files.

## Preservation and verification

`raw.png` is an untouched copy of the selected original, **1983 × 793 pixels**. No keying, resizing, palette processing, compositing, or retouching was performed. A byte comparison against the original passed.

SHA-256: `d097d056bd23c7253affba42b4ae56c487401d4d097946c41c98d2621de4fe6b`

## Honest weaknesses

- The background looks magenta, but is **not a uniform exact #FF00FF**. Read-only inspection found its most frequent RGB color to be (250, 4, 248), with visible numeric variation across the background.
- This is chunky pixel-style artwork, not a mathematically strict pixel-grid asset. Block sizes and edge treatment vary; softened boundaries and subtle texture remain. The image contains 166,301 distinct RGB colors, so it does not literally meet a limited 3–4-tone-per-material palette.
- The figures suggest roughly 48-art-pixel construction, but no exact underlying 48-pixel grid can be certified. The output dimensions differ from the requested canvas sizes.
- Three-quarter turns are shallow in some bodies, especially the cleric. Eye shapes and facial shading are more elaborate than a few dark pixels, and some nose-like contour detail remains.
- Hair volume changes apparent heights, particularly for the dancer. The merchant has broader trousers and heavier boots than the ideal slim tapering legs and small feet.
- Some design details drifted: the cleric's hair reads as a wavy bob rather than clustered curls, the staff cap is an open diamond rather than a split diamond, and the scholar's gold collar is larger than intended.
- Outer margins are tight around the pack and staff. There is no literal ground line; the feet share an implied baseline, preserving the requirement for nothing else in the frame.

These limitations are retained because the brief explicitly forbids post-processing and caps generation at three attempts.

## Exact selected prompt

The prompt below was submitted through the built-in image tool with `transparent_background: false` and no image references.

```text
Use case: stylized-concept.
Create ONE wide image containing exactly FIVE original fantasy townsfolk field sprites side by side, full body, in the exact left-to-right order below. Invented designs, no existing game characters, no reference images. Target canvas about 2560 x 1024 so the chunky pixel blocks can be large.

Background: perfectly flat solid #FF00FF magenta everywhere outside the five figures and their held/worn equipment. No scenery, floor, cast shadows, labels, text, borders, panels or extra objects. All feet align to ONE shared invisible horizontal ground baseline, with generous empty gaps between silhouettes. Same body scale and approximately same head-top-to-sole height for all five; the cleric's staff extends above the heads and the merchant's pack may extend sideways. Nothing cropped.

Art direction: HD-2D field-sprite conventions expressed entirely as LOW-RESOLUTION CHUNKY PIXEL ART, without cinematic lighting or 3D environments. Each body is approximately 48 ART PIXELS tall, 2.5–3 heads tall, with a big head and large stylized hair composed of clearly separated bold clumps. Each art pixel is a large square block approximately 12–16 image pixels wide. Strict square pixel grid, clean staircase edges, NO fine subpixel detailing, NO antialiasing, NO smooth curves, NO painterly brushwork, NO gradients. A strong ONE-ART-PIXEL dark outline. Saturated accents, only 3–4 discrete cel-shading tones per material, light from upper left. Tiny simple faces: eyes only a few dark art pixels, no nose detail, minimal or no mouth. Slim tapering legs, small feet. Bold simple readable silhouettes, hanging fabric shapes. Stylized and slightly heroic townsfolk, not bulky fighters. EVERY person in a FRONT THREE-QUARTER view turned slightly left or right, with asymmetrical visible shoulders and face; no flat straight-on mugshot poses, no side profiles.

Five subjects, left to right:
1. Tavren Kettlewick, adult traveling merchant: warm brown skin, large swept copper forelock, short petrol-blue jacket, ochre trousers, long hanging vermilion scarf. Oversized moss-green backpack with cream blanket roll visibly rising behind one shoulder. One hand grips a shoulder strap, slight forward lean, facing three-quarter right.
2. Ilyra Vellune, adult scholar: deep brown skin, large sculpted silver bob swept to one side. Indigo long coat with two calf-length tails, turquoise cuffs, gold collar, pale slim trousers. Holds one closed rust-red book against ribs. Facing three-quarter left.
3. Saffi Rillstep, adult dancer: tan skin, dark plum hair in a high fan-shaped ponytail. Coral tunic, fitted teal trousers, two long golden waist sashes hanging in distinct curves. One arm lifted outward, one knee lightly bent, both small feet reach the shared ground baseline. Facing three-quarter right.
4. Orven Thist, adult hunter: light olive skin, thick ash-blond hair in three large angular locks. Forest-green cloak hanging from one shoulder to calves, mustard tunic, charcoal leggings, narrow hanging burgundy scarf. A simple wooden bow held at outer side. Facing three-quarter left.
5. Mirel Dawnreed, young adult cleric: deep umber skin, sky-blue curls in a few large clumps, ivory knee-length tabard over cobalt tunic and slim trousers, long orange stole. Holds a tall dark wooden staff capped by a simple split gold diamond, staff extends well above head. Facing three-quarter left, chin slightly lifted.

Priority: exactly five complete distinct figures, equal body scale and shared baseline; genuine visibly chunky ~48-pixel-tall construction; 2.5–3-head proportions; clear three-quarter poses; flat magenta background. No additional characters or decorative elements.

REDRAW EMPHASIS: Think of the entire picture as a tiny 200-by-80-pixel game asset enlarged exactly 16 times with nearest-neighbor. Each character is only 48 logical square pixels from skull top to soles; head around 17 pixels tall and body plus legs around 31. Output large 3200-by-1280 if possible, preserving the very coarse 16-by-16 square pixel blocks. Every edge and internal color boundary must use the SAME coarse grid. Flat perfectly uniform fills within each block; no mottled texture, translucent pixels, tiny highlight fragments, smooth illustration, or fine diagonal strokes. Faces contain just two simple dark pixel marks, no protruding nose. A hand is a plain 3-by-3-pixel shape, never drawn fingers. Hair is 3 or 4 solid angular clumps with only 3 tones. Clothing has broad flat patches, not lots of folds or seams. Simplify equipment to large recognizable shapes. The most important correction is much LOWER art-pixel count, visibly bigger square blocks, and a strict shared pixel grid. All five have THREE-QUARTER faces with both eyes visible, one narrower, no profile faces. Keep the exact five designs and composition above.

FINAL POSE CORRECTION: In particular, the silver-haired scholar must visibly turn three-quarter LEFT: head, coat shoulders, book, and feet all angled together. The merchant turns three-quarter RIGHT; dancer three-quarter RIGHT; hunter three-quarter LEFT; cleric three-quarter LEFT. Keep both eyes visible but offset asymmetrically. Place both dancer's feet on the baseline with one knee softly flexed, not lifted into the air. Keep clear empty magenta padding on all outer edges. Maintain the coarse square blocks and simplify flat shading further; no texture within the solid color regions. Scholar and cleric retain their deep brown skin.
```

