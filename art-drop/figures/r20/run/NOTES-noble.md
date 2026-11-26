# Noble — delivery notes

All 15 requested views are delivered: front, right-facing side, back, and four frames each for walkside, walkfront and walkback. Each figure was drawn fresh with the built-in image tool, beginning with the side master. Python performed keying, proportional nearest-neighbour reduction, colour palette snapping, sheet/GIF assembly and checks; it did not paint faces, synthesize limbs or draw replacement figures.

## Files

- `big/noble-<view>.png`: the 15 selected full-size source drawings on magenta.
- `sprites/noble-<view>.png`: transparent 96 × 128 production frames.
- `noble-sheet.png`: standing front/side/back, then side/front/back walk rows, at exactly 3× nearest-neighbour scale.
- `noble-vs-style.png`: new front and side beside the supplied Noble, Wren and Hadrik front/side references, all at 3×.
- `noble-walkside.gif`, `noble-walkfront.gif`, `noble-walkback.gif`: four-frame transparent loops, 3×, 160 ms per frame.

The sheet background is sampled from STYLE-SHEET.png: RGB (232, 229, 222).

## Verified

`scratch/check.py` passes for all 15 distinct sprites. All have RGBA mode, 96 × 128 dimensions, binary alpha, zero RGB beneath transparent pixels, crown row 33 and lowest sole row 124. Silhouettes are centred to within one pixel. Rows 0–32 and 125–127 are transparent. The complete character uses 16 colours, all from the allowed charcoal, fair_skin, gold and navy ramps, below the 32-colour cap.

All three GIFs contain four frames at 160 ms. Each decoded GIF frame was checked against its corresponding 3× sprite and inspected in the full-size frame strips in scratch/. The final 1212 × 1712 sheet and 1212 × 880 comparison were opened at their native image dimensions. This was frame-by-frame animation inspection, not a claim of real-time playback review.

## Redraws

The initial side drawing was rejected for overly tall proportions. The front was redrawn to replace a blank, doll-like face with restrained adult features. Both side contacts were redrawn for shorter strides and clearer opposite arm movement. Both side passing views were redrawn to remove torso turning and retain the side master's profile and front seam placement. Front contact 2 and back contact 2 were also redrawn. Rejected source drawings remain in scratch/.

## Honest weaknesses and deviations from STYLE.md

- Proportions are close to the supplied Noble, but approximately four-and-a-half heads rather than a mathematically exact four-head construction. Crown-to-chin is nearer 20–21 logical pixels than 23 in several views.
- Hair remains busier than the requested three to five broad locks. The bun and fringe change slightly between independently drawn views. The rear bun is more explicit and rounder than in the supplied reference.
- The front expression is somewhat stern. Eye/lid marks occasionally occupy more than one pixel; mouth and nose marks can become faint after reduction. The profile face is simpler than the reference.
- Gold trim and some dark borders become two pixels wide in places, particularly the central seam, clasp and hem. This does not meet a strict everywhere-one-pixel interpretation. Some upper contours also remain darker than ideal.
- There are small changes in cape width, belt position, hands and skirt planes across frames. Side passing silhouettes are wider than the contact silhouettes, which may read as mild skirt pulsing. Silhouette centring also allows slight head-position drift. The figures are not pixel-identical outside moving parts.
- Walk motion is deliberately small. The gown obscures anatomical leg identity, and contact versus passing is less explicit than on a trousered character. Heel/toe articulation and the two-pixel passing clearance are approximate rather than exact. The back contact-2 shoe and hand are more prominent than in the other rear frames.
- A few irregular edge/shade pixels remain, especially around hair and cape overlaps. No procedural pixel-brush repairs were used to conceal them.
- **Palette-recipe deviation:** the source drawings' blues did not sit on the historical source anchors in STYLE.md. Applying those anchors directly produced considerable speckling. A shared, colour-only four-role source-blue stabilization pass was added before the specified navy-anchor and weighted final-palette snaps. It changes colours only, not alpha, geometry or spatial sampling. Source colour roles were separated by luminance at 48, 78 and 112, their RGB centres recorded, and the same centres used for all views. This is an additional palette step, so the processing is not a literal unmodified execution of the historical recipe. The fixed result uses only the required final navy colours and visibly cleaner cloth planes. `scratch/build-exact-recipe.py` and `scratch/sheet-before-blue-stabilization.png` preserve the earlier approach for inspection.

## Reproduction and provenance

Run from this folder:

```sh
python scratch/assemble_sheet.py
python scratch/check.py
```

`scratch/build.py` performs the production reduction. `scratch/source-blue-centers.json` contains the frozen source-blue calibration; `scratch/calibrate_palette.py` documents how it was derived. `scratch/reduction-manifest.json` records source boxes and reduced widths. `scratch/check-report.json` records technical checks. The final prompt set is in `scratch/final-prompts.json`.

Image references were limited to STYLE-SHEET.png, ref-sprites/ and this run's own Noble images. No other character artwork or repository was inspected. There was one workspace-scope exception: the required installed image-generation SKILL.md was read outside this folder. The image service also automatically stored internal originals at its own default location; returned image data was saved into this folder without opening those external image paths. All authored project files, proofs, scripts and deliverables are inside this folder.
