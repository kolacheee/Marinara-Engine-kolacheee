# Belis Dorn — Round 23 production notes

## Delivered

- 15 separate image-tool originals in `big/`, one figure per magenta image.
- 15 transparent 96 × 128 sprites in `sprites/`: front, side, back, and four walking frames in each direction.
- `noble-sheet.png`: 1152 × 1536, exact 3× nearest-neighbour enlargement on #4A4642. Rows are stand front/side/back, walk-side, walk-front, walk-back. The fourth standing cell is empty.
- Three 288 × 384 walking GIFs, each with four frames, 160 ms per frame, looping.
- `noble-face.png`: front crop covering rows 33–60 inclusive, enlarged 6×.
- `noble-vs-sheet.png`: our front beside the three supplied style-only fronts, all at 3×.

Every final sprite has its crown at row 33 and lowest supporting sole at row 124. Alpha is binary. There are 23 opaque colours across the complete set, all from the six specified ramps: charcoal, linen, auburn, leather, steel and olive. No added ramp, pure black or pure white appears in the sprites. Image-tool originals naturally contain more colours than the reduced exports.

## Interpretation and construction

The explicit design and Round 23 instruction to keep the person were treated as authoritative: Belis remains a 43-year-old man. The isolated phrase “make her clearly wealthy” was interpreted as a wealth/presentation correction, not a replacement of that identity. Wealth is expressed through tailored layered construction, linen piping, a double hem, finished cuffs, the steel chest clasp and a small steel bracelet at his anatomical right wrist. There is no crown, facial jewellery, cape or train. The folded petition stays in his anatomical left hand; it is occluded in the rear views.

The style sheet was attached to every image request with the required style-only instruction. All other generation references were this run's own Belis images. The right-facing side was drawn first and supplied to every subsequent view and redraw. The reference characters appear only in the requested comparison, not as identity references.

The built-in image tool drew all figures. Processing used magenta range keying, bounding-box cropping, BOX/area reduction, material-restricted palette snapping, binary alpha, outer contour restoration, sheet assembly and GIF export. Skin regions are recorded in `../scratch/skin-polygons.json`. Original dark neutral facial marks were classified separately from skin before area reduction so they would not be swallowed by the skin ramp. No new facial features, poses, limbs or clothing shapes were drawn in code. Warm charcoal values use stable value thresholds during palette snapping to avoid mottled shade boundaries.

Final prompts are archived in `../scratch/prompts.json`; processing scripts and checks are also in `../scratch/`.

## Redraws and review

Twenty individual figure images were generated to produce the fifteen selected originals:

1. The first side had an overlong, gown-like hem. It was redrawn with a knee-level bell and more visible lower legs before becoming the identity reference.
2. The standing front received a face-pass redraw because its reduced eyes lacked contrast.
3. After the first full-size comparison, the front was redrawn again for a clearer horizontal mouth, stronger contours and a slightly broader body.
4. Side walk contacts 0 and 2 were redrawn with shorter strides and feet contained under the bell's horizontal footprint.

Rejected versions remain in `../scratch/`. All generated originals were visually inspected. The complete final sheet, 6× face crop and 3× comparison were inspected at their actual saved dimensions. All face-bearing views were checked in enlarged crop panels. Every encoded GIF frame was decoded and inspected in a 3× filmstrip. The unsnapped reduction intermediates were also inspected together at native size.

## Honest weaknesses and imperfect compliance

- This is not an exact craft match to the reference sheet. Belis is distinct from all three reference people, but the reference has more deliberate small cluster placement and stronger material separation. The charcoal outfit also has less accessory variety than the ranger and blacksmith. The wealth reads as restrained court dress rather than lavish regalia.
- The man is broad in front, but the side profile could still be stouter through the chest and hips. The front sleeves are fuller than the specified narrow sleeves.
- Hair remains several substantial curls, but the source drawings do not consistently resolve to exactly four. Rear views show more lobes, and some curls descend farther toward the nape than requested. Hair and facial proportions drift slightly between independently drawn frames.
- The eyes survive as dark marks without glints. Some marks span two adjacent pixels after reduction. The front mouth/chin shadow is wider than the strict 1–2 px target, and some profile nose steps exceed one pixel. The double chin is clearer in profile than frontally. A profile naturally shows one eye; the two-eye check was applied to frontal views.
- Some hands are around 6 px wide rather than 3–5 px. The originals contain more finger divisions than the requested mitten treatment, although most merge after reduction.
- The walk is restrained, but the independent drawings produce some sleeve, hair, hem and body-width flicker. Contact and passing poses in the front/rear cycles are not as mechanically distinct as a tightly registered animation. Rear lifted feet occasionally rise more than two pixels. Side contact leg overlap does not make the alternating anatomical legs completely unambiguous.
- Material masks were visually estimated rather than hand-segmented at every source pixel. Tiny mixed boundaries and occasional isolated shading pixels remain, especially around hair, cuffs and the petition. The outer contour repair is consistent but cannot reproduce every artist-placed lit contour step in the reference.
- The absolute folder-only condition had two workflow exceptions: the required installed imagegen instruction file was read outside this folder, and the built-in image tool automatically stored its own originals in its default external cache. No outside artwork, other Downloads folders, repositories or existing sprite collections were inspected. Workspace originals were saved from returned image bytes, without opening the external generated-image paths. All authored task files, exports and retained intermediates are inside this folder.

## Verification

The final checks confirmed fifteen originals and fifteen sprite exports; 96 × 128 RGBA frames; occupied rows 33–124; binary transparency; no colours outside the allowed six ramps; 23 colours in the union; correct sheet/crop/comparison dimensions; and four decoded 160 ms frames in each GIF. These technical checks do not imply that the artistic limitations above are fully resolved.
