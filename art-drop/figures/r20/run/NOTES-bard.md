# Bard — delivery notes

Delivered all 15 requested views: front, right-facing side, back, walkside0–3, walkfront0–3 and walkback0–3.

## Files

- `big/bard-<view>.png`: 15 full-size magenta-background drawing originals selected for delivery.
- `sprites/bard-<view>.png`: 15 transparent production sprites.
- `bard-sheet.png`: standing front/side/back, then the side, front and back walk cycles, each at exactly 3× nearest-neighbour scale.
- `bard-vs-style.png`: bard front and side next to the supplied Wren, Hadrik and Noble sprites at the same 3× scale.
- `bard-walkside.gif`, `bard-walkfront.gif`, `bard-walkback.gif`: four-frame loops, 160 ms per frame, 288 × 384, on the style-sheet background.

## Method and checks

Every figure and revision was drawn by the built-in image tool. The right-facing side master was drawn first and supplied for every subsequent drawing. The only visual references used were this folder's STYLE-SHEET.png, its ref-sprites, and drawings of this bard made during this run. No other character artwork was consulted.

Python performed magenta keying, bounding-box cropping, one NEAREST reduction, palette snapping, sheet/GIF assembly and checks. It did not draw anatomy, replace faces, synthesize limbs, mirror poses or paint repairs. The lute received a colour-only snap to four gold-family tones in its material region; this did not change its shape or alpha.

Validation passed for every sprite: RGBA, 96 × 128, binary alpha, transparent RGB zeroed, first occupied row 33, last occupied row 124, and no opaque pixels outside that vertical extent. The union is **23 colours**, all from STYLE.md's master palette, below the 32-colour character limit. Allowed ramps were charcoal, leather, fair_skin, auburn, gold and linen. The page background is RGB (232, 229, 222) and is not part of the sprite palette. Every GIF has four frames at 160 ms each.

All drawing outputs were visually inspected. The complete final sheet and comparison were opened at their native resolution. All 12 encoded GIF frames were also extracted into `scratch/gif-frame-proof.png` and inspected together; timing and frame counts were checked programmatically.

Rebuild from this folder with `python scratch/assemble_sheet.py`, then `python scratch/check.py`. Exact prompts, including superseded attempts and revisions, are in `scratch/prompts.json`. Crop boxes and reduction sizes are in `scratch/reduction-manifest.json`; check results are in `scratch/check-results.json`.

## Redraws

- Replaced a side passing drawing with an extra hand-like shape below the lute.
- Replaced the first back contact drawing because its trailing boot extended below the support foot.
- Redrew all five front views to hide a lute-bowl bulge that appeared on the wrong side. The neck remains over the anatomical left shoulder, and the bowl is hidden behind the torso from the front.
- Superseded originals remain in `scratch/rejected-*.png`, not among the delivered originals.

## Honest weaknesses against STYLE.md

- **Colour:** the master palette has no true maroon ramp. The cap and doublet consequently read as dark russet/red-brown, especially after snapping. The olive complexion reads warm ochre/tan rather than an unmistakable greenish olive. These are visible compromises, not exact colour matches to the character description.
- **Build and proportions:** the bard is narrower and lighter than the reference adults. The cap-to-chin construction is approximately four-and-a-half units within the full height, rather than an exact four-head anatomical construction. The costume adds less silhouette mass than Wren's cloak or Hadrik's apron.
- **Cluster cleanliness:** the lute ribs reduce into small broken marks, and some shoulder and trouser folds remain busier than the cleanest reference planes. The colour-only lute pass reduced cross-ramp variation but did not eliminate those drawn details. Some dark overlaps are heavier than the ideal one-pixel contour.
- **Face:** the brows and eyes can merge into short dark marks. The front expression is somewhat flat, and the eye treatment is not consistently an isolated 1 × 1 mark. No replacement face was painted in code.
- **Animation:** pose phases are present, but these are independently drawn frames rather than a mechanically registered animation. Head, cuff, trim, lute and silhouette widths have small frame-to-frame differences. Centring each complete silhouette causes some lateral movement in the side cycle. Contact and passing read more distinctly from the side than from the front; front arm opposition is not perfectly consistent. The loops should not be described as perfectly smooth or free of foot sliding.
- **Instrument rotation:** the rear bowl and over-shoulder neck are readable, but the side lute is more face-on than a strict orthographic profile would show. Its perspective does not make a mathematically exact turnaround.

The technical export requirements pass. The style, colour and motion qualifications above remain visible in the delivered artwork.
