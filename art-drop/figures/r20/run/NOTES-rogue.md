# Rogue — delivery notes

Delivered all 15 requested views: front, side, back, walkside0–3, walkfront0–3 and walkback0–3. The design is a young adult woman with tan skin, short black hair, a charcoal leather jerkin with its hood down, a muted rust-red scarf, dark trousers and two sheathed belt daggers.

## Files and verification

- `big/rogue-<view>.png`: original-resolution magenta source cells. These retain the source drawing and source colours; they are not the final palette reference.
- `sprites/rogue-<view>.png`: 15 transparent RGBA sprites, each 96 × 128. Every silhouette begins at row 33 and ends at row 124, occupies 92 rows, and is horizontally centred within one pixel.
- `rogue-sheet.png`: standing front/side/back, side walk, front walk, back walk, in that row order. Sprites are enlarged exactly 3× with nearest-neighbour sampling on the supplied style sheet's background.
- `rogue-vs-style.png`: rogue front and side alongside the supplied Wren, Hadrik and Noble fronts and sides, all at 3×.
- `rogue-walkside.gif`, `rogue-walkfront.gif`, `rogue-walkback.gif`: four frames each, 288 × 384, 160 ms per frame, looping on the neutral sheet background.

The final union contains **19 opaque colours**, all from STYLE.md's charcoal, leather, fair_skin, auburn and steel ramps. The allowed subset contains 20 colours, below the 32-colour character cap. Sprite alpha is strictly 0/255, transparent RGB is zero, and the unused top and bottom rows are clear. All 12 decoded GIF frames were checked pixel-for-pixel against the corresponding enlarged sprites.

All source drawings and the 15 delivered large source cells were visually inspected. All final sprites were inspected at 3× in the sheet; the sheet and comparison were opened at their full saved resolutions. A full-resolution contact sheet of the decoded GIF frames was also inspected in `scratch/gif-proof.png`. This was frame-by-frame inspection, not a real-time playback assessment.

## Method and redraws

The image tool drew every figure. The side master was drawn first and then redrawn because the first attempt had overly long proportions. Every subsequent drawing request included the corrected side master. Only STYLE-SHEET.png, the supplied ref-sprites and this run's rogue drawings were used as visual references.

The two front passing poses and side passing frame 3 were redrawn to bring the lifted feet closer to the support feet. Both back contacts received new drawings; the final pair alternates arm swing. Earlier source attempts remain in `scratch/`.

Python only split source cells, keyed magenta, cropped, reduced once with NEAREST, assigned palette colours, placed frames, assembled sheets/GIFs and checked outputs. No replacement faces, limbs, poses or hand-painted contour repairs were constructed in code. No frames were made by mirroring or moving pieces of another figure.

Palette assignment uses colour and coarse material regions to keep the clothes and hair charcoal, the scarf auburn, the skin tan and the belt equipment brown/steel. Charcoal luminance bins stabilise the source shading before assignment to its four-tone ramp. This is a rogue-specific colour treatment, not the Wren/Noble/Hadrik material masks copied blindly.

Rebuild from this folder with:

```sh
python scratch/build.py
python scratch/assemble_sheet.py
python scratch/check.py
```

Source-cell boxes, reduction widths and placement coordinates are recorded in `scratch/reduction-manifest.json`; machine checks are in `scratch/checks.json`.

The image service automatically reported its own external cache location. That location was not opened or read. Returned image bytes were saved directly into this folder's `scratch/`; all task file operations stayed here.

## Honest weaknesses against STYLE.md

- **Frame consistency is imperfect.** The independently drawn views have small changes in face shape, hood width, scarf length, hand size, dagger fittings and shading. Front passing frames are somewhat broader/lighter than the contacts. Side passing frame 3 has a slimmer torso and a more prominent hand. These differences will cause some visible wobble or flicker in the loops.
- **The walk is readable but not fully polished.** Side contacts are somewhat longer-strided than the quietest town-walk interpretation. The passing knees and foot clearances are not perfectly matched across phases. Front/back depth cues remain simplified; the back contact lift is larger than the intended two-to-three-pixel target in places.
- **Proportions are approximate.** They sit near the supplied compact adult figures, roughly four to four-and-a-half heads tall, but the 23-pixel head divisions are not exact in every view. The face reads younger and softer than the strictest grounded-adult target.
- **Eyes and contours are not uniformly exact.** Some eyebrow/eye clusters occupy more than the requested 1×1 mark. Some boot, hair and overlap edges form two-pixel dark masses. The lit outline is not consistently softened everywhere.
- **Shading is not as controlled as the ideal guide.** There are remaining isolated shade pixels in sleeves, knees and hems. Hair has several diagonal highlight bands rather than one restrained upper-left cluster. Lighting generally favours upper left, but the rear hair planes are less decisive.
- **Colour interpretation is restrained.** The scarf uses the existing auburn ramp and therefore reads rusty red/brown rather than crimson. Tan skin sometimes appears relatively light beside the dark costume. Charcoal hair has warm grey highlights because those are the supplied ramp colours.
- **Equipment loses detail at 96×128.** Both daggers are clearest from front/back; the far dagger is mostly occluded in profile. Guards and pommels vary slightly in size and can read as bright belt fittings.

The dimensional, transparency and palette requirements pass. The remaining limitations are drawing and animation consistency; this is not a claim of an exact, hand-cleaned match to every STYLE.md rule.
