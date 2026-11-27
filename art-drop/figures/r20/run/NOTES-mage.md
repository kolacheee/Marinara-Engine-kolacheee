# Mage — delivery notes

Delivered all 15 views: front, side, back, walkside0–3, walkfront0–3, and walkback0–3. Each view has a large magenta original in `big/` and a transparent production PNG in `sprites/`.

`mage-sheet.png` presents standing front/side/back, then the four side, front, and back walk frames. `mage-vs-style.png` compares the mage with the supplied Wren, Hadrik, and Noble front/side sprites at equal 3× nearest-neighbour scale. The three walk GIFs are 3×, four frames each, 160 ms per frame, looping on the style-sheet background (#E8E5DE).

## Method and review

Every figure was drawn with the built-in image tool, side first. Each subsequent drawing referenced that side master; front/back walk drawings also referenced this run's corresponding standing drawing. The only artwork references were STYLE-SHEET.png, the supplied ref-sprites, and this run's mage drawings. No figure was mirrored, assembled from another character, or drawn with Python.

Python performed magenta keying, tight cropping, a single aspect-preserving NEAREST reduction to 92 px tall, colour-only palette snapping, placement, sheet/GIF assembly, and checks. No procedural anatomy, replacement facial features, limb painting, or spatial smoothing was used. Purple source-colour anchors stabilize flat robe planes before the general weighted palette snap; two side-walk sources use their own anchors, recorded in `scratch/build.py`.

The first side drawing was rejected for overly tall proportions and redrawn. The first walkside2 drawing was rejected for an extra hand and redrawn. Those rejected originals remain in `scratch/`. All originals were visually inspected. All final reduced sprites were inspected at 3×; the final sheet and comparison were opened at their full saved resolution. Every decoded GIF frame was also inspected in `scratch/gif-decoded-proof.png`. This was a frame-by-frame visual review, not a real-time playback review.

## Verified properties

- 15 distinct 96×128 RGBA sprites and 15 corresponding large originals.
- Every final figure occupies rows 33–124 inclusive, with its lowest sole on row 124.
- Binary alpha only; transparent pixels have zero RGB; no clipped silhouette.
- 28 opaque colours in the union of all 15 sprites, below the 32-colour cap.
- All GIFs have four 160 ms frames; their decoded pixels exactly match the 3× PNGs composited on the page background.
- All side views face right. Front/back equipment remains anatomically consistent: wand right hand, scroll bag left hip. Back views show no face.

Machine-readable results: `scratch/check-report.json`. Crop/placement details: `scratch/reduction-manifest.json`. Exact generation prompts, including rejected attempts and corrections: `scratch/prompts.json`.

To rebuild from the task folder:

```sh
python scratch/build.py
python scratch/assemble_sheet.py
python scratch/check.py
```

## Honest weaknesses and departures from STYLE.md

1. **Purple is a palette extension.** The supplied 40-colour master has no purple ramp, while the character explicitly requires a deep purple robe. The robe uses #292333, #44334F, #62496E, and #887294. The other six ramps are the supplied charcoal, leather, fair_skin, gold, linen, and steel. This follows the four-role palette approach and colour cap, but is not strict membership in the original master palette.
2. **Proportions and weight are close, not identical.** The revised mage is approximately 4–4.5 heads tall and comparatively narrow through her shoulders and skirt. She looks lighter than Wren/Hadrik and less broad through the hem than Noble. Her boots are more substantial than Noble's shoes.
3. **The walk is not perfectly registered animation.** Separate drawings retain small changes in hair pixels, face marks, shoulder width, bag outline, wand length/angle, and cloth shading beyond the intended motion. Centring the complete silhouette, as required, also permits small lateral torso shifts when arm extent changes. The GIFs should not be mistaken for a fully polished, pixel-locked game cycle.
4. **Side passing phases are the least explicit.** The long robe conceals the knees and much of the leg overlap. Frames 1 and 3 have close, lifted feet, but the exchange of near/far support legs is subtle and less convincing than an exposed-leg walk. Front/back contact versus passing is also conveyed mainly by shoe projection and hem shape. Some apparent foot lift is closer to 3–4 logical pixels than the requested 2-pixel prompting target.
5. **Contours are not uniformly one pixel.** Some hair, boot, cuff, and overlap edges become two pixels thick. A few lit edges are weaker or more interrupted than the reference. There are occasional isolated shade pixels near folds and accessories, despite the colour-anchor cleanup; the result is not completely free of source-derived pixel irregularities.
6. **Material simplification has tradeoffs.** The silver braid is more repetitive and prominent than the reference characters' hair locks. Fair-skin colours keep her complexion warm cream rather than cool porcelain. Some tiny clasps and scroll openings lose definition at 1×. General palette snapping can borrow adjacent material colours at transitions rather than keeping every material rigorously confined to exactly four colours.
7. **Lighting is approximate.** Upper-left illumination is preserved overall, but a few robe planes favour the same costume fold across views instead of behaving as perfectly consistent screen-space lighting.

## Workspace scope exception

The runtime required reading the installed image-generation skill instructions outside this folder. No outside artwork, existing sprites, other Downloads folders, or repositories were read or searched. The image tool automatically created its own external cache copies; the working originals here were saved directly from returned image data, without opening those external cache files. All task scripts, proofs, rejected drawings, and deliverables were written inside this folder.
