# Priest — delivery notes

Old pale-skinned man, bald crown with a small white hair rim, white beard, long grey robe, plain blue stole, wooden staff. The staff is in his anatomical left hand: viewer right in front and viewer left in back. The free right arm swings during walking.

## Files and checks

- `big/`: 15 selected large originals on magenta, one per view.
- `sprites/`: 15 RGBA PNGs, each 96 × 128. All have binary alpha, transparent RGB zeroed, crown at row 33 and lowest occupied row 124. Each complete silhouette, including staff, is horizontally centred to within one pixel.
- `priest-sheet.png`: standing front/side/back, then four side, four front and four back walking frames. Sprites are exactly 3× nearest-neighbour on the supplied style sheet's background, RGB (232, 229, 222).
- `priest-vs-style.png`: priest front and side beside the unmodified supplied Wren, Hadrik and Noble front/side PNGs, all at 3×.
- Three walking GIFs: four frames each, 288 × 384, 160 ms per frame, looping on the neutral background. The source sprite PNGs retain transparency.
- The union across all 15 sprites is **20 colours**, from charcoal, leather, fair_skin, navy and steel, below the 32-colour cap.

`python scratch/check.py` passed. It checks dimensions, alpha, bounds, centring, palette membership and union, unique sprite pixels, original count, GIF frame count and timing, and exact agreement between decoded GIF pixels and the enlarged source sprites. These checks do not certify anatomical or animation quality.

## Drawing and processing

Every selected figure was drawn by the built-in image tool. The side master was made first and supplied to every subsequent selected pose. The only visual references were STYLE-SHEET.png, the allowed reference PNGs for comparison, and this run's priest drawings. No other character artwork was consulted.

Python only keyed magenta, cropped, reduced once with NEAREST, snapped colours, assembled previews/GIFs and checked outputs. It did not synthesize limbs, replace faces, paint folds, or mirror poses. The final scripts are `scratch/build.py`, `scratch/assemble_sheet.py`, and `scratch/check.py`; the exact prompt set is `scratch/prompts.json`. Source bounds and reduction widths are in `scratch/reduction-manifest.json`.

Colour-only source mapping was needed before the final weighted palette snap. Neutral source greys map to the steel ramp through four source anchors; navy uses the supplied STYLE.md anchor recipe. Warm colours in the tight crop's head region use luminance thresholds 110, 172 and 202 to map to fair_skin. This avoids speckling from small source gradients near palette boundaries. The exact selection conditions are in build.py. These mappings change colour, never silhouette or anatomy.

The first opposite-contact side drawing hid the lower staff behind the robe. It was redrawn with the image tool and replaced by `scratch/priest-walkside2-v2.png`. The rejected drawing remains in scratch. The final sheet and style comparison were opened at their full saved dimensions, and every final sprite was inspected there at 3×. All four decoded frames of each final GIF were inspected in the full-size proof strips in scratch; the GIF files themselves were not observed in real-time playback.

## Honest weaknesses

- The construction is approximate rather than an exact four-head diagram. The anatomical chin is hidden by the beard; excluding the beard, the visible skull/face reads somewhat smaller than the prescribed 23-pixel head unit. The priest is slender beside Hadrik and closer in overall mass to the noble.
- Contours mostly read as one pixel, but some sleeve, hem, beard and shoe overlaps form thicker dark patches. Upper-left outline lightening is inconsistent, especially along the robe. This does not perfectly match STYLE.md's contour rule.
- The grey robe uses broad quiet planes, but the highlight role is sparse. Its four-tone lighting is less explicit than the style sheet's instructional cylinder. Some isolated colour pixels remain around hands, beard, wood and shoes.
- The fair_skin palette makes the pale skin warm and peach-coloured. The white beard is a cool off-white/grey, consistent with the prohibition on pure white. A warm neckline patch beneath the side beard is more conspicuous than ideal.
- The long robe hides most leg anatomy. The two side contact silhouettes are similar; the arm swing and overlap differences carry part of the opposite-leg reading. The passing phases are clearer, although the lifted near shoe in walkside3 is a little higher and farther forward than the strictest two-pixel-gap target.
- These are independently drawn frames. The face, scalp, folds, sleeves and staff grip have small frame-to-frame variations. Centring the complete moving silhouette also shifts the torso slightly as arm and stride width change. The cycles may show mild wobble rather than perfectly locked animation registration.
- Front/back contact-versus-passing differences are deliberately small and can read as a shuffle. Staff lifting and planting are simplified, and some poses retain a planted-looking staff during a passing step.

## Workflow exceptions

A required image-tool workflow instruction file outside this folder was read. No outside artwork, other Downloads folders or repositories were read. The image service automatically saved its own default copies outside this folder; project images were transferred directly from returned image data into scratch without opening those outside copies. Thus the strict all-filesystem-activity-inside-this-folder requirement was not fully met.

An early front/back generation pair was lost to a save-helper error before it could be displayed or saved locally. Both poses were generated again and the replacements were inspected. Consequently, the requirement to inspect literally every generated attempt was not met for those two abandoned returns. All delivered originals, the retained rejected side view, final sprites, sheet, comparison and decoded GIF proof images were inspected.
