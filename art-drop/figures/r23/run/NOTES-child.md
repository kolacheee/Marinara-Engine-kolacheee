# Davi Ren — Round 23

## Delivered

- Fifteen independently image-tool-drawn originals in `big/`, each containing one full-body figure on magenta.
- Fifteen transparent 96 × 128 exports in `sprites/`.
- `child-sheet.png`: 3×, background #4A4642; standing front/side/back, then four side, four front and four back walking frames.
- Three 3× walking GIFs, four frames each, 160 ms per frame, looping.
- `child-face.png`: front head at 6×.
- `child-vs-sheet.png`: Davi, Wren, Hadrik and Noble fronts at 3×, with aligned sole baselines.

## Interpretation and process

Round 23 took priority over the older no-reference and tiny-dot-eye instructions. The child-specific 70-row height took priority over the generic 92-row adult instruction. Davi's costume gained a gold shoulder facing/back yoke, ochre seam and hem trim, a small gold pocket and linen undercuffs. The square smock, thin trousers, low hair tabs and small right-hand toy remain the identifying features. No belt, cloak or armour was added.

The style sheet was attached to every image request with the required style-only warning. The initial drawing was the right-facing side. All subsequent drawing requests included a side drawing from this run; some also included this run's front or back. No other character imagery was used as an identity reference.

Python performed magenta keying, alpha-aware BOX reduction, palette snapping through material masks, isolated-pixel skin/hair cleanup, placement, crops, sheets, GIF export and checks. It did not draw figures or paint replacement facial features. Facial feature regions and silhouettes were protected from despeckling. Palette and source reduction scripts, masks, checks and retained superseded images are in `../scratch/`.

Every returned drawing was inspected. The final sheet, face crop, comparison, six-head reference comparison and all decoded GIF frames were inspected at their exported sizes. GIF inspection used their decoded frames; smoothness was not verified through a live animation player.

## Redraws

- The first side had a long hem and a raised toy. It was redrawn with a shorter smock and lowered hand.
- Early side/front/back exports were too elongated, with small heads and weak facial marks. They were redrawn; the side needed another proportion correction to match the compact front.
- The first side-contact drawing was replaced after the proportion correction.
- The front received an additional face-pass request for stronger eyes, brows and a separated mouth. The resulting source changed only slightly; this did not fully solve the reduced face's softness.
- Side passing frame 3 was redrawn because its raised foot was too far behind the pelvis. The replacement brings the feet together, but the lift is very subtle.

## Verified export properties

- All 15 sprites are RGBA, exactly 96 × 128.
- All have binary alpha, crown row 55 and lowest occupied sole row 124: exactly 70 occupied rows.
- The complete equipped silhouette is centred within one pixel.
- The combined sprite palette contains 23 colours, all from the specified charcoal, leather, moss, gold, linen and deep-skin ramps. No new ramp, pure black or pure white was introduced.
- All three GIFs are 288 × 384, contain four frames and retain 160 ms timing for every frame.
- Detailed machine checks are in `../scratch/final-checks.json`.

## Honest weaknesses and unmet details

- This is an approximation of the sheet's rendering, not an exact craft match. The faces are smoother and more schematic, and the garments have fewer intricate clusters than the references. The gold shoulder facing is somewhat more pronounced than the original plain-smock concept.
- Both front eyes and their light marks remain visible, but the dark eye clusters do not consistently meet the requested 2×2–3-pixel construction after BOX reduction. Brows survive; the nose and mouth remain low-contrast and can read together as one small expression. The extra face redraw did not bring them fully to the reference's clarity.
- Head scale is not perfectly constant: the side head reads larger than the back head. The approximate shared head unit is closer after redraws, but is not exactly 23 rows in every view.
- The two low plaits are blunt and visible, but some rear views read as short hanging tabs rather than strongly lateral stops. Broad scalp highlights are more band-like than three separately defined masses.
- The tiny boat stays on the anatomical right, but at 70 rows it reads more readily as a green-topped brown object than unmistakably as a boat. Hull and fingers merge in some frames; not every grip has a distinct thumb notch. Some hand masses exceed the desired 3–5 pixels.
- Skin and hair masks combine geometric regions with source-colour classification. They keep the two palette sets separate by mask, but semantic accuracy at blended hair/skin edges and around the brown boat/hand overlap is not guaranteed pixel-for-pixel.
- The independent drawings introduce small changes in head contours, cuff widths, pocket position and body width. These create visible animation wobble. Front and back contact/passing poses are close and can read as a shuffle. In side view the opposite-leg contact phases have very similar leg silhouettes, and passing frame 3 is nearly planted rather than a clearly lifted foot. The animation is not a rigorously constructed heel-to-toe cycle.
- Upper-left lighting is broadly consistent, but reduction produces occasional material-colour ambiguity and some contours thicker than one pixel at overlaps. The source originals contain shading variations beyond four exact tones; the exported sprites are palette-limited.
- The requested face crop coordinates, rows 33–about 60, are adult coordinates and would mostly show empty space for this child. `child-face.png` instead crops rows 55–82 and columns 30–66, enlarged 6×, so the actual face is visible. The reference head comparison uses the reference adults' rows 33–64.
- The image service automatically stored its own originals in its managed output location. No outside file was opened or copied: the returned image bytes were written directly into this folder. All deliberate filesystem work and all supplied image-reference paths remained inside this folder.

These limitations are recorded rather than claiming complete visual compliance.
