# Oru Sen — delivery notes

Delivered 15 selected full-body originals in `big/`, 15 transparent sprites in `sprites/`, `priest-sheet.png`, three walking GIFs, and `priest-face.png`. The sheet rows are standing front/side/back, side walk 0–3, front walk 0–3, and back walk 0–3. Its unused fourth standing cell is blank.

Every figure was drawn with the built-in image tool. The right-facing side view came first. Every subsequent drawing used that side image as a reference; some corrections also used this run's own front or back images. No external image, existing sprite, or other character was used. The full prompt record is `../scratch/prompts.json`.

## Export checks

- All 15 sprites are 96 × 128 RGBA with binary alpha. Each occupies rows 33–124 inclusive; rows 0–32 and 125–127 are transparent. Complete silhouettes are horizontally centered to the nearest pixel.
- The combined sprite palette contains 23 colors, all from the six authorized ramps: plum, linen, steel, charcoal, leather and deep skin. No additional ramp, pure black, pure white or opaque magenta remains. The supplied plum ramp is #352A32 / #51404C / #766071 / #A08C9A. Sash tones are restricted to the darker two linen colors.
- The sheet is 1152 × 1536, a nearest-neighbor 3× enlargement on #4a4642. The front face crop covers source rows 33–60 inclusive and is enlarged 6× to 246 × 168.
- Each GIF is 288 × 384, with four frames at 160 ms each, looping on #4a4642. Encoded GIF frames were read back and visually inspected as strips; playback smoothness was assessed from those frames rather than a real-time player.
- All ten face-bearing views were inspected after reduction. The five front views retain two eye groups each; the five profile views retain one visible eye each. Every group has skin immediately on both sides, with no glints. Profiles deliberately do not show a second, anatomically hidden eye.

Checks and processing scripts are in `../scratch/`. Reduction used magenta keying, alpha-aware BOX downscaling, source-derived skin and eye masks, material-specific palette snapping, and binary alpha. Skin values were mapped within the deep ramp. Isolated robe quantization specks were suppressed during palette snapping. No face, limb, pose or garment was drawn with code.

## Redraws and visual review

There were 23 drawings, with 15 selected and eight superseded originals retained in scratch. The side view required two face redraws: the first eye merged into the brow, and the next still lacked sufficient separation. `walkfront0` required one redraw because an eye disappeared on reduction. All four rear walk frames were redrawn to correct sideways shoes and inconsistent hair. `walkback3` received another targeted crown correction after inspection of the assembled sheet.

The originals, reduced views, enlarged faces, final sheet, full-size sheet strips, and decoded GIF strips were inspected. The final sheet and deliverable face crop were reopened after the last correction.

## Remaining weaknesses and rules not met exactly

- Hair shading, folds, tablet position and body width still vary between independent drawings. The crown correction reduced the largest rear-view jump, but the loops retain some visual wobble.
- The side contact poses have very similar leg silhouettes beneath the robe. Opposite-leg identity is less clear than intended. Front and back passing/contact differences are restrained and sometimes difficult to distinguish.
- Some gripping hands exceed the requested 3–5-pixel mitten size, and the tablet reads a little large for a palm-sized object. The left-hand assignment is retained; the tablet is occluded in back views.
- Some front eyes include one adjacent dark pixel, rather than being strictly single squares. Several mouth shadows are about 3–4 pixels wide instead of 1–2. Frontal nose modeling and age cues become flatter after palette snapping; the hooked profile is clearer.
- Not every contour is exactly one pixel thick, and a few isolated quantization marks remain. Several cloth folds are more diagonal and decorative than the requested sparse gravity-led folds. Skin/material boundary masks are approximations of the source edges, not a guarantee of perfect semantic classification at every mixed boundary pixel.
- The large untouched originals contain softer shading and colors outside the exact ramps. The strict palette and binary transparency checks apply to the final sprites, not those originals.
- Folder-boundary exception: two installed workflow SKILL.md documents were read outside this folder as required by the environment instructions. No outside art, sprites or repositories were inspected. The image service also automatically cached its outputs outside the folder; project copies were saved from the returned image bytes, without reading those cache files. All task scripts, review images and superseded project copies are in this folder's `scratch/`.
