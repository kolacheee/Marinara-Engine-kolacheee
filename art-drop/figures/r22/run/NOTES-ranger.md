# Sere Venn — ranger

The requested files are present: 15 image-tool originals in `big/`, 15 transparent 96 × 128 sprites in `sprites/`, the 3× sheet, three 3× four-frame walking GIFs, and the 6× front face crop.

## Production and verification

- Read `CHARACTER.md`, then `STYLE-RULES.md`. Drew the right-facing side first, corrected its proportions and downward saw, and used this run's side image as a reference for every subsequent view. Some redraws also referenced this run's front, back, or rejected target image. No external character images or existing sprites were used.
- Every figure was drawn by the built-in image tool, one figure per image. The files in `big/` preserve the final tool output bytes, including their magenta backgrounds. Python handled keying, anatomical/material masks, BOX reduction, palette snapping, contour repair, crops, sheets, GIFs, and checks. No limbs, poses, eyes, or mouths were painted into the sprites with code.
- Source skin was too bright for the named deep ramp. Its colour values were calibrated during palette snapping so body and shadow planes remained distinct from the pale brow notch. Skin regions use only the four deep colours. Existing dark facial marks were segmented in the source and their area coverage used to preserve charcoal during palette snapping; thresholds vary slightly between front views. Non-skin regions exclude the deep ramp.
- All 15 sprites have RGBA mode, 96 × 128 dimensions, alpha values only 0/255, crown row 33, and lowest occupied sole row 124. Their equipped bounding boxes are horizontally centred within one pixel. Rows 0–32 and 125–127 are transparent.
- The sprite set uses exactly 24 opaque colours, all from charcoal, leather, moss, linen, steel, and deep skin. No additional ramp was introduced. Opaque pure black and white are absent.
- `ranger-sheet.png` is 1152 × 1536, nearest-neighbour 3×, on #4a4642. Rows are standing front/side/back, walkside0–3, walkfront0–3, and walkback0–3. The unused fourth standing cell is blank.
- Each GIF is 288 × 384, four frames, 160 ms per frame, looping, on #4a4642. All encoded GIF frames were extracted into a check sheet and inspected. Individual GIF previews were also opened; those previews show a static frame, so I do not claim a real-time playback inspection.
- `ranger-face.png` is a 6× nearest-neighbour enlargement of front-frame columns 24–71 and rows 33–60. The final sheet and face crop were opened at their full saved sizes. All source drawings were viewed, as were all reduced figures and enlarged face crops.
- Processing scripts, mask definitions, prompt specifications, rejected drawings, and check reports are in `../scratch/`. `checks.json` records the technical checks; `prompts.txt` records the shared/view specifications and final corrective prompts.

## Redraws

- Rejected the initial side drawing: too tall, coat too long, saw horizontal. Redrew it with compact proportions and a closed saw pointing down.
- Redrew the side face to remove the eye glint and separate the eye from the brow.
- Redrew the standing front face several times: removed glints, reduced and lowered the eyes, moved the pale notch through the brow, then strengthened the mouth after it disappeared in reduction.
- Redrew walkside0 to shorten an overextended stride.
- Redrew walkside3 because it repeated the other passing pose too closely; its foreground leg and saw-arm position now differ.
- Redrew walkside2 for eye survival after the first reduction.
- Redrew all four front walking faces against the corrected front face. The walkfront1 and walkfront3 redraws also lowered the passing feet.

## Honest weaknesses and rules not fully met

- **The strict one-pixel-eye rule is not met in every frame.** Standing front and walkfront0–2 have two isolated one-pixel charcoal eyes. In walkfront3, the eye on the viewer's right still occupies two vertically adjacent pixels after its redraw and reduction. Side views show one visible eye; a profile mark can occupy two adjacent pixels. I interpreted “both eyes” as applying to frontal views, not as requiring a hidden eye in profile.
- Some mouth shadows occupy about three pixels rather than the requested one or two. The pale brow notch reads clearly in the source front drawings but is much less conspicuous in the reduced profiles. Age 47 and the blunt nose are suggested rather than unmistakable at native size.
- **The walk is not a perfectly registered animation cycle.** Head/coat widths and sleeve folds vary slightly between independent drawings. Centring the entire equipped silhouette causes small torso shifts when the arms move. Contact and passing phases remain uneven, especially in the rear cycle; exact leg identity and opposite arm timing are not equally clear in every side frame. A few lifted feet sit roughly three or four pixels above support rather than two. These are visible limitations, not technical-check passes.
- The coat tends toward the lower thigh/near-knee instead of consistently ending halfway down the thighs. The yoke is recognisable and projects behind the arm in profile, but the front version sometimes reads as a pointed shoulder collar. The linen neckline also reads more like a small folded collar than a strictly collarless opening.
- Hair locks are substantial, but the rear locks resemble stacked bands and the front locks rise more prominently than the written design suggests. The hands reduce to compact masses, although some sources contain too many finger divisions. Sleeves conceal most of the wiry forearm anatomy.
- BOX reduction creates some small mixed-colour clusters. The final palette and restored outer contours are clean, but the interior cluster structure is not uniformly the prescribed 2–6 pixels. Some internal overlap outlines remain heavier than one pixel. Lighting is broadly upper-left, with inconsistent small highlights between views.
- The closed saw can read as a small hanging leather case at this scale. It stays on the anatomical right; the flat belt sheath stays on the anatomical left. Both are deliberately small, but their similar shapes weaken the distinction.
- **Filesystem isolation exception:** a higher-priority tool workflow required reading its single image-generation instruction file outside this folder. No other external project folders, repositories, or artwork were inspected. The image tool also automatically saves its own outputs in a runtime-managed location outside the folder; the local originals here were written from the returned image data without opening those external copies. All task scripts, masks, intermediates, and requested deliverables were written inside this folder.

This is a complete deliverable set with the limitations above; it is not a claim of exact compliance with every visual rule.
