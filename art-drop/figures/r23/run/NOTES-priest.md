# Oru Sen — priest, Round 23

## Deliverables and checks

- `big/`: 15 selected, unmodified image-tool originals, one figure per image.
- `sprites/`: 15 transparent 96 × 128 PNGs, named as requested.
- `priest-sheet.png`: 1152 × 1536, exact 3× pixels on #4A4642. Rows are standing front/side/back, walk-side 0–3, walk-front 0–3, walk-back 0–3. The fourth standing cell is empty.
- `priest-walkside.gif`, `priest-walkfront.gif`, `priest-walkback.gif`: 288 × 384, four frames each, 160 ms per frame, looping, shared palette, #4A4642 background.
- `priest-face.png`: front crop from rows 33–60 inclusive, enlarged 6×.
- `priest-vs-sheet.png`: priest, Wren, Hadrik, noble, left to right, all at 3× with matching baselines.

All 15 sprites passed checks for binary transparency, 96 × 128 dimensions, crown row 33, lowest sole row 124, horizontally centered occupied bounds, and allowed colours. The union across the set is exactly 24 colours. GIF dimensions, frame counts and frame durations were checked. Details are in `../scratch/checks.json`.

The six ramps are plum, linen, steel, charcoal, leather and deep skin. Plum is exactly #352A32 / #51404C / #766071 / #A08C9A. Deep skin is exactly #2E211C / #4A3226 / #6B4936 / #94694F. No gold ramp or additional colour family was added.

## Drawing and reduction

The right-facing side was drawn first. Every subsequent request attached an image of that side and the style sheet, with the required style-only instruction. Only the supplied style references and this run's Oru images were used as image references. Costume enrichment uses the layered linen collar and cuffs, doubled plum wrap edge, gathered waist, flat woven sash and heavy hem. The small clay tablet stays in the anatomical left hand and is hidden by the body in back views.

Every figure was drawn by the built-in image tool. Python handled magenta keying, BOX area reduction, material/skin masking, palette snapping, external contour cleanup, sheets, crops, GIFs and checks. It did not draw figures or paint replacement facial features. Skin and plum source tones were calibrated to their specified four-tone ramps to prevent orange-looking skin and grey-looking cloth. The external contour pass preserves the generated silhouette.

The complete prompt record is `../scratch/prompts.json`; processing and assembly scripts and inspection images are also in `../scratch/`.

## Redraws and visual review

There were 22 image-tool drawings: 15 selected views and seven superseded attempts. Standing side and standing front each received two face-pass redraws because the first eyes merged into brow shadows or weakened during reduction. A third front redraw followed the full-size comparison, improving cheek/jaw planes, waist gathers and the free hand. Walk-side 1 was redrawn to distinguish its passing foot from walk-side 3. Walk-side 2 was redrawn to bring the leading heel and trailing toe onto the same ground level.

All generated drawings were inspected. The final sheet, front face crop and comparison were inspected at their full saved sizes. Every encoded GIF frame was decoded into an inspection strip and examined; all ten visible faces were also examined together at 6×. Skin masks were reviewed together. These were visual frame reviews, not a claim of live playback inspection.

## Honest weaknesses and unmet details

- This is not an exact rendering match to the reference sheet. Some joins and contour steps are less deliberate, and the reduced face planes remain simpler than the strongest reference faces.
- Eyes survive without glints, but the strict one-pixel charcoal-eye rule is not met consistently. Some profile eyes occupy more than one pixel in both directions; several front eyes reduce to dark skin-ramp marks with limited contrast. Brows are flatter and less downturned than requested. The face redraws improved separation but did not eliminate these shortcomings.
- Some hands exceed the requested 3–5-pixel mitten size, retain extra finger divisions, or have a bulky grip. The tablet is readable but its boundary against the holding hand is not equally clean in every frame.
- The deep sleeve openings hang farther down the forearms than an ideal elbow-length interpretation. The robe hem reads somewhat low on the calf, and the exposed stocking length is short.
- The final standing front has stronger facial planes and different fold clusters than the earlier walking fronts. It remains recognizably the same character, but the standing-to-walking transition is not perfectly matched.
- Independently drawn frames produce small changes in hair edges, sleeve volume, hand shape and robe folds. The side contacts are asymmetrical, and the front/back cycles are restrained enough to feel slightly shuffling. Mechanical baseline alignment does not guarantee perfectly smooth weight transfer.
- Skin masks use anatomical regions plus source colour tests. Boundaries between skin, dark features, cuffs and the brown tablet are imperfect in places; palette compliance does not prove flawless semantic masking of every boundary pixel.
- The originals contain near-magenta variation and source smoothing rather than mathematically flat #FF00FF and a perfect logical pixel grid. Delivered sprites have binary alpha and the exact allowed palette.
- Scope exception: the installed image-tool workflow instructions were read outside this folder. No outside character/art references, other Downloads folders, repositories or existing sprite collections were searched. The image service also retains automatic originals outside the project; project copies were saved from returned image data without opening those external files.

These limitations are recorded rather than claiming that every stylistic rule passed.
