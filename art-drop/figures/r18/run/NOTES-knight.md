# Knight — round 18 review

## Delivered

- `big/knight-<view>.png`: 15 selected, unmodified image-tool originals on magenta.
- `sprites/knight-<view>.png`: 15 transparent 96×128 sprites.
- `knight-sheet.png`: 1152×1536, nearest-neighbour 3×, background #4a4642. Rows are standing front/side/back (fourth cell empty), walk-side 0–3, walk-front 0–3, walk-back 0–3.
- `knight-walkside.gif`, `knight-walkfront.gif`, `knight-walkback.gif`: 288×384, four frames each, 160 ms per frame, looping, on #4a4642.

## Drawing and redraws

The built-in image tool drew every figure. The first side design was drawn from text. Two side revisions shortened the initially overlong body to approximately 3.2–3.4 heads. Every other final view used that selected right-facing side image as its reference. No pre-existing sprites, game images, earlier-round images, or other characters were visual inputs.

Twenty individual image generations produced the 15 selected originals. Rejected originals remain in `../scratch/`: two side designs with overly tall proportions, a side contact that repeated the previous arm swing, a front contact with a narrower head and missing shield rim, and a rear passing frame with excessive small rivets.

The full prompt record is `../scratch/prompts.json`. Processing code and numerical checks are `../scratch/process.py` and `../scratch/checks.json`.

## Processing and validation

Magenta was range-keyed before BOX downscaling. Each figure was downscaled proportionally to 92 pixels tall, horizontally aligned by the upper head silhouette, and placed in a 96×128 frame. Alpha was thresholded to 0 or 255. No body parts were drawn, repainted, warped, or composited in Python.

One shared palette contains 40 body colors and eight outline colors: 48 opaque colors across the entire character. Each transparent pixel touching the body in its eight-neighbourhood received a color calculated as mean opaque neighbour color × 0.32 + (8,4,10), rounded and snapped to the shared outline palette. The added one-pixel border makes the final opaque silhouette 94 pixels tall, spanning rows 31–124. Row 124 is the lowest opaque foot/outline pixel in every frame. This distinction between the 92-pixel drawing and its added border is intentional.

Checks passed for all 15 frame dimensions, binary alpha, shared color count, baseline, absence of magenta foreground pixels, sheet size, and all GIF sizes/frame counts/durations. The GIFs use exact palette indices; all 12 decoded GIF frames match their composited source PNGs pixel for pixel.

Every generated original was visually inspected, including rejected drafts. Each final 96×128 sprite was opened individually. The completed sheet was opened at its full 1152×1536 size, and all decoded GIF frames were inspected in 3× strips (`../scratch/gif-review-*.png`). Animation review was frame-by-frame rather than a claim of real-time playback testing.

## Honest remaining weaknesses

- Costume and face details are not perfectly invariant. Hair spikes, eyes, breastplate highlights, sleeve folds, and belt shapes change slightly between independently drawn views. The revised second front contact still differs in facial shading and torso width.
- The rear shield remains the most conspicuous continuity issue: diameter, rim thickness, boss position, wood planks, and rivet size vary. The redrawn rear passing frame removes the dense rivet pattern, but its shield is slightly larger and cleaner than the other frames. These differences can produce flicker.
- The scabbard is short for a longsword, ending near the knee, and its apparent length and angle vary. The rear sword hilt is partly obscured in some poses and prominent in others.
- The side cycle has clear opposite arm contacts, but overlapping legs make the two passing poses similar. The stride is somewhat broad for a particularly leisurely town walk. Front/rear motion is restrained and may read as shuffling at reduced display size.
- Feet stay low and knees are only mildly bent. However, independently generated contours do not provide the exact foot trajectories or consistent prop movement of a manually authored animation cycle.
- Compact proportions meet the intended approximate head-count range, but the large head and simplified face can still read younger and more stylized than a fully naturalistic adult.
- BOX reduction preserves the intended small-scale readability but produces some soft-looking interior clusters. The added outline can make already dark source edges relatively heavy; fine shield and sword detail is less distinct at half-size display.

These are usable reviewed sprite studies, not a claim of perfectly locked production animation.
