# Wren and Hadrik — round 4 combine

## What changed

Each character now has one cleaned, locked standing master for down, left and up. All down/left walk frames and down-facing idle frames are assembled from those masters. Independently drawn walk bodies no longer supply animation pixels. The previous sheetgen strides were inspected as motion guides; the permitted `ref-paintdown/` lineup was inspected for its design stability. No other lane, earlier-round figure art, downloaded reference or game asset was used.

Wren's standing height increased from 56 to 57 pixels. Her face is longer, with a firmer jaw, level skin-tone brows, narrow 1 × 2 eye marks, a defined mouth and a more visible neck. The auburn tied hair, green hood-down cloak, leather jerkin, bracers, bow and quiver remain her design. Her crown-to-chin height is approximately 18 pixels: roughly 3.2 heads in a 57-pixel figure. Hadrik retains the broad build, dark umber skin, cool near-black short hair and beard, rolled cream sleeves, leather apron and belt hammer.

## Files and playback

- `sheet-wren.png`, `sheet-hadrik.png`: 288 × 256 RGBA; 48 × 64 cells; rows **down, left, right, up**. Down and left each have six distinct walk frames. Right and up repeat standing frames, as allowed by SPEC.
- `idle-wren.png`, `idle-hadrik.png`: 192 × 64 RGBA; four distinct down-facing breathing frames.
- `lineup.png`: both locked standing designs, down and left, at 1× and exact 4× on #7a7a7a.
- `walk.gif`: both characters down for six frames, then left for six, **110 ms per frame**, looping at 4×. Phase labels are contact, down, passing, up, opposite contact, opposite passing.
- `idle.gif`: four frames at 220 ms each, looping at 4×.
- `in-world.png`, `in-world-close.png`: the supplied screenshots at their original 1280 × 760 size. Nearest-neighbour sprite scales are 2.3× and 3.8×, rounded to 110 × 147 and 182 × 243 screen pixels. Feet are on open paving, with separate soft dark ground and contact shadows.
- `consistency.png`: all four walk rows at exact 4×, alongside their standing masters. Below each frame is a difference overlay after undoing its whole-body bob. Unchanged pixels are dimmed, cyan marks added/changed pixels, rose marks removed pixels, and red would mark changes inside the protected face/torso regions. Expected limb and cloth movement remains visible; it is not hidden by the audit.
- `validation.json`: technical checks, per-frame bounds and connectivity, master hashes, PNG/GIF drift counts and timings.

Normal-view foot anchors are Wren (772, 527), Hadrik (920, 561). Close-view anchors are (792, 560), (1020, 615). Wren faces down and Hadrik left in both composites. Shadow blur is applied only to separate shadow layers, never to sprite art. Wren uses 29 opaque colors; Hadrik uses 32.

## Method and rebuild

Tools: Python 3 and Pillow. This pass uses explicit native-pixel edits and deterministic integer cluster transforms, without resampling new character drawings.

1. Preserved the selected input standing frames in `../scratch/master-source/`. Final cleaned masters are in `../scratch/locked-masters/`. Original walk sheets and GIF are retained as `../scratch/motion-guide*`.
2. Separated each master into a fixed identity/torso cluster, legs, arms, loose cloak/apron and, where visible, the tied hair end. Completed garment areas previously hidden by the near arm once, so a swinging arm does not reveal a transparent hole.
3. Posed limbs with piecewise integer row mappings through hip, knee, ankle or shoulder, elbow and wrist positions. Boot soles and hand clusters retain their pixels. Far limbs use a fixed darker material mapping. No antialiasing, arbitrary per-frame palette changes or interpolated rotations are used.
4. Used body bobs of **0, +1, 0, −1, 0, −1** pixels. Side feet travel through separated contact poses and overlapping passing poses; arm reach opposes the near leg. Cloth and tied-hair motion lag the stride. The long apron hides some of Hadrik's thigh motion.
5. Built idle frames from the same down-facing master, lifting the head/shoulder slab one pixel during inhalation while keeping feet grounded. Cloak/apron and Wren's hair tips provide secondary movement.
6. Corrected the broken side-leg case by mapping contiguous knee/ankle rows and removing all remnants of the standing boot. Also repaired the neck seam, bow connection, arm-reveal gaps and an oversized boot caused by extracting both overlapping standing feet together.

From this folder:

```sh
python scratch/build_combine.py
python scratch/validate_sprites.py
```

`python scratch/build_sprites.py` also invokes the combine rebuild. Its older extraction and pose-assembly helpers remain for provenance, but final animation uses `build_combine.py`. The old `--extract` option is unnecessary for this pass.

## Verification and visual review

All **56 delivered sprite cells** pass: required dimensions, binary alpha, palette membership, no pure black, transparent pixels with zero RGB, 52–58 pixel silhouette heights, feet on row 63, centered bounds, and exactly one connected silhouette per cell. Both down/left rows contain six unique frames; both idle sheets contain four. GIF counts, loop settings and timing pass.

The protected face/head and torso regions have **zero changed pixels in every walk frame** after bob alignment. This was checked independently against the exported PNG sheets and across decoded GIF frames, so GIF encoding also preserves identity without temporal color shimmer. Idle identity checks also report zero drift after compensating for the breathing lift. Loose hair-tip regions are intentionally excluded from identity masks; their changes remain shown in the full difference overlays.

The final close world composite was inspected at its full 1280 × 760 size, together with the normal world view, enlarged frame sheets and all 12 decoded frames of the final `walk.gif`. The GIF was reviewed frame by frame; the retained decoded contact sheet is `../scratch/decoded-walk-review.png`. The figures have crisp material clusters and coherent costume silhouettes, and Wren's face is visibly more angular and mature than the starting design.

## Remaining limits against the commercial target

- The fixed torso intentionally has little shoulder rotation or hip twist. The side stride is clear, but elbow foreshortening and the long apron are simpler than a bespoke studio animation. The six-pose loop has more abrupt acceleration around contact than a longer cycle.
- Wren's face is more adult, but conveying a specific decade of age in an eight-pixel-wide face remains approximate. Her tied hair still reads somewhat tall in front view. This is an art-direction judgment, not something the pixel-invariance checks can certify.
- The down view communicates stepping mainly through foot lift and opposition; the side view has the stronger stride. Hadrik's short hair stays fixed with the head instead of swaying independently.
- Right is a mirrored left standing master: bow/quiver, hammer and small directional highlights switch sides. Up and right do not have authored walk cycles.
- The scene camera is more elevated than these fairly upright character profiles. Fractional scaling makes native pixels alternate between adjacent screen-pixel widths. The exact 4× lineup is the reference for native drawing quality.
- These composites establish scale and grounding. Scene-driven lighting, depth blur, occlusion and bloom remain renderer work. Technical checks establish consistency and deliverable correctness; they do not establish equivalence to the named commercial game's art direction.

No runtime layering system or separate equipment deliverables were added.
