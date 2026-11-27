# Dema Ors — Round 23 production notes

Delivered 15 original full-body drawings in `big/`, 15 transparent 96×128 sprites in `sprites/`, the 3× four-row sheet, three 3× four-frame GIFs at 160 ms/frame, the 6× front-face crop, and the 3× comparison against the three supplied reference fronts.

## Method and checks

Every figure and every pose was drawn with the built-in image tool. There were 24 image-tool requests including rejected versions and redraws. Every request attached STYLE-SHEET.png with the required style-only instruction; every subsequent view also attached this run's approved right-facing side. Some requests additionally used this run's matching front, back, or earlier walking drawing. No other character artwork was used as an identity reference.

Python performed magenta range keying, premultiplied BOX reduction, spatial and colour-based skin masking, palette snapping, sheet/crop/GIF assembly and checks. No figure, eye, mouth, limb, or pose was painted or synthesized with code. No mirrored frames or cut-and-paste body parts were used. Existing generated contours were retained, without a new outline pass.

All final sprites are 96×128 RGBA, have binary alpha, start at row 33 and end at row 124. The shared palette contains exactly 24 colours from the six permitted ramps: navy, charcoal, steel, leather, linen and olive. No additional ramp, pure black or pure white was introduced. The GIFs have four distinct frames each, 160 ms each, and loop; they use the sheet's #4a4642 background. The sheet is 1152×1536. The face crop covers rows 33–60 inclusive at 6×. The comparison is 1152×420.

All generated originals were viewed. The reduced poses, complete sheet, enlarged face checks and reference comparison were inspected at their exported resolution. All GIF frames were decoded back into full-size strips and inspected; this is a frame-by-frame check, not a claim of real-time playback inspection. Scripts, masks, prompt records, rejected drawings and check images are in `scratch/`.

## Redraws

- The first side drawing was three-quarter through the torso. It was replaced with a true profile before generating the other views.
- Both side contact poses were redrawn twice. The first correction looked too stationary and introduced a conspicuous profile pouch; the final correction restored heel/toe contact with a moderate stride.
- Walk-front 0 was redrawn to correct excess source height and resulting torso shrinkage.
- The standing front received two explicit face-pass redraws. The first weakened the mouth after reduction; the final source restored a readable mouth and visible dark eyes. Walk-front 0 received one explicit face-pass redraw. No face corrections were made in code.

## Honest weaknesses and rules not fully met

- Eye cores survive, but not every view has an isolated, perfectly 1×1 charcoal mark with clean skin immediately on both sides. Some eyes occupy two adjacent dark pixels, with brown transitional neighbours. The profile exposes one eye, naturally; the literal demand for both eyes in every face-bearing view cannot apply to a true profile. Brows and facial planes also vary slightly between standing and walking fronts.
- The crown cloth reads warm brown-charcoal rather than a convincingly cool charcoal. The image tool's source colours were approximate; the final sprites are restricted to the specified palette. Some material boundaries consequently pick neighbouring ramp tones.
- Skin masks were manually bounded to the visible face, neck and forearms/hands, then filtered by source colour. They are conservative approximations, not independently verified semantic segmentations; a few dark boundary pixels can read as leather/charcoal rather than olive.
- Hands are somewhat larger than the requested 3–5-pixel mitten masses, especially in front views, and the thumb/finger divisions are occasionally too pronounced.
- The smock hem reads closer to the lower hip than the specified upper hip. Its reinforced yoke, rolled sleeve bands, piped hem, belt and pouch provide the Round 23 richness without an apron or hood. The yoke can read slightly like a short shoulder mantle.
- The side contact strides remain unequal, with frame 2 broader than frame 0. Independent drawings cause small shifts in head registration, silhouette width, folds, pouch, hammer and feet. Centring the complete equipped silhouette introduces lateral body motion when the hammer swings. The cycles are usable four-pose previews, not perfectly registered production animation.
- Some outlines and folds are thicker or more fragmented than the strict 1-pixel contour / 2–6-pixel cluster rules. Lighting generally reads from upper left, but the grey hair has highlights on both sides. The rendering is a close style attempt, not an exact match to the sheet's cluster discipline.
- The big originals retain the tool's unmodified output, including approximate magenta backgrounds and slight source smoothing. They are 1086×1448 rather than the prompted enlargement. The exported sprites correct the required size, transparency and palette; the originals themselves do not meet an exact #FF00FF-everywhere background requirement.
- The folder-only rule had two runtime exceptions: an environment-required imagegen instruction file was read outside this folder, and the image service automatically cached its outputs outside the workspace. No external artwork was read, listed or used. All task-authored files and working intermediates are inside this folder; output bytes were saved directly here without opening those external cached images.
