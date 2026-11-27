# Rovan Tal — Round 23 delivery notes

## Delivered and checked

- 15 image-tool originals in `big/`, one full-body figure per image on magenta; 15 corresponding transparent sprites in `sprites/`.
- Every sprite is 96 × 128, with crown at row 33 and lowest occupied sole at row 124. The complete equipped bounding box is horizontally centred to the nearest pixel. Alpha is exclusively 0 or 255.
- The sprites share **23 colours**, all from the six permitted gold, steel, charcoal, leather, linen and fair-skin ramps. No additional ramp was introduced. No pure black or white is used in the sprites.
- `knight-sheet.png`: 1152 × 1536, nearest-neighbour 3×, background #4A4642. Rows are standing front/side/back, side walk 0–3, front walk 0–3, back walk 0–3.
- Three GIFs: 288 × 384, four distinct frames each, 160 ms per frame, looping. Every decoded frame was checked pixel-for-pixel against its enlarged sprite on the background. All decoded frames were inspected at their full export size in `../scratch/gif-proof.png`.
- `knight-face.png`: front crop, logical columns 25–71 and rows 33–62, enlarged 6× to 282 × 180.
- `knight-vs-sheet.png`: 3× front comparison, left to right Rovan, Wren, Hadrik, Noble. The comparison and final sheet were inspected at their full exported dimensions. The standing heads were also inspected at 6× beside the three reference faces; all 15 heads were inspected together.

## Drawing and processing

The built-in image tool drew every figure. There were 27 successful figure drawings, including replacements. The final original files were saved without retouching. Every request attached STYLE-SHEET.png with the required style-only instruction; every view after the initial side also used this run's own side reference. No other character art was used. The sword remains on the anatomical left: viewer right from the front, viewer left from behind, and behind the visible hip in profile. Hands are empty.

Layering was added through the coat facing, thick gold hems, waist belt and short sword suspension straps. No cloak, helmet or heraldic pattern was added. Gold remains the dominant material.

Python was used for magenta keying, bounding-box cropping, BOX reduction to 92 occupied rows, palette snapping, binary alpha, permitted skin/hair despeckling, contour repair, sheets, crops, GIFs and checks. It did not draw figures, transplant limbs or paint facial features. Skin regions were selected before final reduction using connected warm-colour regions and face/ear/neck locations; this prevented warm hair highlights from entering the skin ramp. Dark facial marks were excluded from hair cleanup. Isolated skin/hair pixels were changed only by the specified same-mask neighbourhood rule, with protected dark features and boundaries. The contour pass selects an existing local material's edge or shadow tone on the silhouette.

The processing script, final prompt set, validation reports, masks, comparison crops and rejected originals are retained in `../scratch/`. The final prompts are in `../scratch/prompts.json`.

## Redraws

- The first side was too three-quarter and too tall. Two redraws improved the profile, head proportion and backward sword placement before it was used as the master for other views.
- The standing front underwent **two face-pass redraws** after reduction showed muddy eyes and mouth. Larger eye blocks and simpler facial planes improved survival at sprite size.
- The standing side and side-walk contact frame 0 also received face-pass redraws.
- Side-walk frames 1, 2 and 3 were redrawn for closer passing feet and opposite arm/leg action. Frames 1 and 3 then needed another redraw because the pose correction moved the sword to the front of the body.
- Back-walk frame 3 was redrawn to lift the left foot instead of repeating frame 1's right-foot action.

## Honest weaknesses and unmet details

This is not an exact rendering match to the reference sheet. Rovan's reduced contours and quilt seams remain softer and busier than the sheet's strongest, deliberately placed clusters. The costume reads as a distinct gold-coated knight, but the reference has cleaner material separation and more controlled detail.

The final faces retain dark eyes, brows, a nose plane and mouth shading, but the full Round 23 eye specification is **not consistently achieved**: catches can disappear, brows sometimes merge with the eyes, and the side eyes are smaller than the requested 2×2–3-pixel construction. The standing front mouth is especially subdued. The face redraws improved this without making every face as crisp as the reference faces. The age reads as a mature adult, but 52 is not strongly conveyed in every frame.

The side passing poses remain stiff, particularly frame 3, which is close to a standing pose. Contact frame 2 swings its near arm more than the restrained brief calls for. The long tails obscure leg identity, so opposite-leg contact is less unambiguous than it should be. Head shapes, shoulder plates, hem contours and sword angles shift slightly between independently drawn frames. These are four-frame walking studies with visible drift, not a perfectly registered production animation.

Some side torsos still turn slightly toward the viewer. Head-to-body proportion is approximate rather than an exact four-head construction. The rear hair uses a pronounced chevron pattern and can suggest more than three locks. Upper-left lighting is the intended direction, but some shoulder and hair highlights are too bilateral.

The coat opening often reads as starting above the specified knee split, and several hems stop higher than ankle length. The small breastplate sometimes reads as a collar plate. Belt buckles were drawn in a gold-looking colour rather than steel, so the rule that all metal is steel is not fully met. The blade and fittings remain the only large prop, but their prominence varies by view.

The image service automatically saved its own originals outside this folder. The copies used for this work were written here from the tool's returned image data; those external files were not opened. The required installed image-tool skill instructions were also read outside this folder. Those are exceptions to the requested strict folder boundary. No outside sprite collection, other Downloads folder or git repository was read or used.
