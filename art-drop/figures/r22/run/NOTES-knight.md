# Rovan Tal — production notes

The requested 15 views, original image-tool PNGs, 96 × 128 transparent sprites, 3× sheet, three walk GIFs, and 6× front-face crop are present in `out/`. This is a complete deliverable set, but it is not a claim of perfect compliance with every drawing rule.

## Production and checks

- Read `CHARACTER.md`, then `STYLE-RULES.md`. No external character images, existing sprites, repositories, or other project folders were consulted.
- Every figure was drawn by the image tool, one figure per image, on magenta. The right-facing side was drawn first; every later view and redraw referenced a side drawing from this run. Front/back standing drawings from this run were also used to stabilize corresponding walk views.
- There were 24 image-tool drawings in total: 15 delivered drawings and nine superseded attempts. Superseded local originals and processing/inspection files are in `scratch/`.
- Python only performed keying, alpha-aware BOX reduction, material palette snapping, framing, sheets, crops, GIFs, and checks. No face, limb, pose, or costume was painted in code; no figure was mirrored or assembled from other figures.
- All 15 final sprites were inspected individually at their native size, in enlarged previews, and together on the sheet. The complete sheet and front-face crop were opened at their full exported sizes. All four frames decoded from each delivered GIF were inspected in strips.
- All sprites are RGBA, 96 × 128, with binary alpha. Every occupied bounding box begins at row 33 and ends at row 124 inclusive. The complete equipped bounding box is horizontally centered to the nearest pixel.
- Exactly 24 opaque RGB colours occur across the final sprite set, all from charcoal, leather, gold, linen, steel, and fair skin. No additional ramp, pure black, or pure white is used. The image-tool originals are not palette-limited.
- Skin uses a source-colour/spatial face mask; the collar was excluded after review. Hair/eye charcoal has a separate source mask to prevent skin averaging from erasing dark marks. These masks are approximate classifications, not hand-labelled semantic masks.
- Sheet: 1152 × 1536, nearest-neighbour 3×, background `#4a4642`, requested row order, unused fourth standing cell blank. GIFs: 288 × 384, four frames each, 160 ms per frame, looping, same background. Face: 240 × 168, logical columns 28–67 and rows 33–60 enlarged 6×.
- Numerical check details are in `scratch/checks.json`; reduction details are in `scratch/reduction.json`. Scripts are `scratch/process.py` and `scratch/assemble.py`.

## Redraws

1. The first side drawing had a head that was too small. Its first replacement overshot the head size. A second proportion redraw brought it back to approximately four to four-and-a-half heads.
2. The resulting side eye weakened after reduction. The side was redrawn specifically for a clearer eye and mouth before being used as the final master.
3. `walkside2` was redrawn because its arm swing repeated the first contact pose. `walkside3` was redrawn because the passing leg extended forward like a small kick.
4. The enlarged face audit triggered face-pass redraws of `walkfront1`, `walkfront2`, `walkfront3`, and `walkside3`. These retained the pose while requesting stronger, isolated dark eye marks. No code-drawn facial repairs were made.

## Honest weaknesses and rules not fully met

- The exact one-pixel-eye specification is not consistently achieved. Eyes remain visible, but several have adjacent lid pixels, L-shaped edges, or more than one occupied pixel. Some pale skin strips remain above the eyes. Mouth shadows are often wider than the specified one or two pixels. The facial expression and eye spacing also drift slightly through the front cycle. In profile, only the anatomically visible eye is shown; the instruction requiring “both eyes” was interpreted as applying to front views.
- Facial age is understated: the figure can read younger than 52. Front views shade both cheeks rather than emphasizing only one deep cheek plane. The long convex profile nose is present, but its contour is not uniformly a one-pixel projection.
- Quilting is too prominent and dense for the requested quiet cluster style. Thin source seams partly disappear under area reduction, creating intermittent single-pixel texture and substantial pattern flicker between walk frames. This is most visible on the back.
- Local-colour outlines and upper-left lighting are approximate. Some cloth boundaries retain charcoal-like darks; some overlaps are thicker than one pixel; both shoulder plates have similarly bright upper edges. Strict outline thickness and cluster-size rules are not met everywhere.
- The coat splits sometimes begin higher than the knees, and the front skirt can read as a central apron-like panel. Boot shafts are visually shorter than a clear mid-calf boot. The rear hair point is sharper in the back views than the specified blunt point.
- The sword stays on the anatomical left hip, but its angle and distance from the coat vary slightly. The forward glove in `walkside2` overlaps the scabbard visually and can suggest contact, although no drawn gripping hand holds the weapon.
- The walk is restrained and alternates support, but it is not mechanically exact. Contact strides vary in length, near/far leg identity is partly hidden by the coat, and the passing phases are not equally convincing. Bounding-box centering plus independently drawn silhouettes creates slight torso movement. Hair highlights, glove size, hem shape, and quilt seams change between frames.
- The image service automatically reported cache copies outside this folder despite the requested save location. Those cache paths were not opened, copied from, or browsed. Local originals were written directly from the returned image data. All explicit project reads, writes, processing, and inspections remained inside this folder.
