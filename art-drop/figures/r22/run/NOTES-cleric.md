# Asen Tor — production notes

Delivered 15 original drawings in `big/`, 15 transparent sprites in `sprites/`, the four-row sheet, three walking GIFs, and the front face crop. Every figure and redraw came from the built-in image tool. References were exclusively this character's drawings from this run; every subsequent view included the approved right-facing side master. No existing sprites or external artwork were used.

## Checks and processing

- All sprites are 96 × 128 RGBA, with binary alpha. Occupied bounds start at row 33 and end at row 124; the complete silhouette is horizontally centred within rounding of one pixel.
- The set uses 23 opaque colours, all from charcoal, linen, leather, navy, steel and tan. No added ramp, pure black or pure white occurs in the sprites.
- Processing used magenta range keying, figure cropping, BOX area reduction, separate anatomical/chromatic skin masks and palette snapping. Non-skin head material snaps to charcoal. Isolated warm cloth pixels were excluded from the hand masks. No face features, limbs or figure shapes were painted with code.
- Each frontal view has two dark one-pixel eye cores on row 45, with tan skin immediately on either side. Profiles have one visible eye with an adjacent second pixel, using the profile allowance in the rules. Beard edges remain readable. “Both eyes” was interpreted as both in frontal views, one in strict profile, none from behind.
- The sheet is 1152 × 1536, nearest-neighbour 3×, on #4A4642, in the requested row order. Its unused fourth standing cell is blank. GIFs are 288 × 384, four frames each, looping at 160 ms per frame on the same background. The 204 × 168 face crop enlarges source rows 33–60 by 6×.
- All original drawings were inspected. Reduced figures, skin masks, all ten visible faces, the final full-size sheet and face crop, and all frames decoded from the final GIFs were inspected. GIF timing and frame counts were checked programmatically; motion was assessed from decoded frame strips rather than real-time playback.

## Redraws

The first side master was too many heads tall and was redrawn before producing the other views. Both initial side passing poses had an extra hand and were rejected. Side contact frame 2 took two pose redraws to reverse the visible arm swing clearly.

The face pass required one redraw of `walkfront3` and three targeted eye redraws of `walkside2`. One side-eye attempt introduced a forbidden pale eye-white patch and was rejected. The final side eye is dark against tan without that patch. Rejected originals remain in `../scratch/`. There were 24 image-tool drawings in total, including nine rejected versions.

## Honest weaknesses and exceptions

- These are not perfectly registered hand-animated frames. Head placement and width vary by roughly a pixel, and cloth planes change between frames. Front linen highlights noticeably flicker between the contact and passing drawings.
- The outline is continuous, but its thickness and material-specific darkness are not perfectly uniform. Some reduced cloth planes contain small irregular clusters rather than exclusively broad deliberate planes. Original drawings retain slight tonal variation despite the flat-colour prompt.
- The hair band reads heavier than a very close crop. The concave nose bridge is subtle. The underlying tunic/trouser boundary is difficult to distinguish beneath the tabard, and frontal case projection beyond the hips is modest. Side views communicate the forward box and separate hems more strongly.
- The town walk is readable, but heel/toe articulation and anatomical lead-leg identity are less clear in front/back views than in profile. The side contact stride and arm swing are a little broader than ideal.
- Original backgrounds are near-magenta with small colour variation, not literal uniform #FF00FF. The originals were preserved unchanged; range keying removes that background in the sprites.
- The strict folder-only instruction had two environment exceptions: required image-tool workflow instructions were read from their installed location, and the image service automatically cached its outputs outside this folder. Those cached files were never opened or listed; local originals were saved directly from the returned image data. All explicit project writes and processing intermediates are inside this folder. No other project folders, repositories or artwork were read.

Final prompts, processing scripts and check results are in `../scratch/prompts.json`, `../scratch/process.py`, `../scratch/export.py` and `../scratch/final-checks.json`.
