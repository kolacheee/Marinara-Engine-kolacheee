# Common Stuff — round 3

This refines the material-lane figures. Standing body heights remain 58 pixels for the man and 55 for the woman, with the same seven-by-eight head footprint, material palette, outfits and layer stack. All 24 sheets retain 288×256 dimensions, 48×64 cells, and down / left / right / up rows. The source and target ramps are byte-for-byte unchanged from round 2.

## Changes

- Upper-left light now turns across narrower lit, middle and shadow planes. Shoulder tops, sleeve folds, leather and cloth edges catch the sun; lower planes and right sides fall into shadow. The staff's bright edge was moved to its left side.
- Right-facing geometry is reflected, then its material indices are re-shaded in screen space. It is no longer a colour mirror. Eye marks and deep facial creases are protected from that operation. No new colours, opacity gradients or perimeter outlines were added to the layers.
- Standing shoulders and hips counter-tilt by one pixel. One knee is unlocked, elbows have clearance, and the hands sit at different forward depths. The ranger's shoulder cape follows the tilt.
- Front walk contacts separate the feet by six vertical pixels; passing feet lift, knees articulate, shoulders bob, and arms oppose the legs. The side stride reaches sixteen pixels of heel separation and twelve pixels of hand travel. The underlying two-bone chains have constant lengths; projection and integer rounding change their apparent screen lengths.
- The pale robe has a broad darker right plane, a heavier hem, a dark sash and hanging sash edge. Fold highlights remain inside the existing cloth ramp. These changes apply to the shared robe, so other colourways stay compatible.
- Horns now root outside the temples, clear of the hair and forehead. Faces have a reserved brow row, two eye marks, a highlighted nose and a short mouth. The beard leaves its mouth/lip opening exposed. Both eye-ramp entries remain in use.

## Rebuild and verification

Run `python3 tools/build.py` from this folder. Python and Pillow are required. It builds the layer sheets, all review composites, the animation, the unchanged ramps, validation and a copy of these notes. `before-after.png` uses the preserved round-2 lineup above the new lineup, both at 4×. Its original is stored in `src/baseline/round2-lineup.png`.

Editable body and attachment grids remain in `src/`; the pose data is in `src/rig.json`. To regenerate those grids from their construction tools, run `python3 tools/author.py`, then `python3 tools/finish_source.py`, then the normal build. Normal rebuilds do not overwrite source grids. `tools/lighting.py` contains the reflected-view shading operation; `tools/review_round3.py` makes supplementary inspection boards in `scratch/round3/`.

World composites use the supplied `ref/market-*.png`, with the original placements, nearest-neighbour scales and contact shadows. The first ranger retains the original building-shadow attenuation. Only the two permitted `ref/lit-*` images were consulted from the other lane, for lighting. No concept-image pixels or external assets were used in this pass.

The final `in-world.png` and `in-world-close.png` were visually inspected at their full 1280×760 size. The lineup, comparison, turns, walk frames, decoded GIF, skin/hair swatches and layer boards were also inspected. A dedicated horned-face board covers all six skin tones. The first side-pose revision bent both knees too much; it was redone with a straighter supporting leg and less flexed arms before this delivery.

`out/validation.json` records:

- 24 correctly sized sheets; zero off-palette, partial-alpha, wrong-region or isolated pixels.
- 432 outfit/hair/body/direction/frame combinations, with no disconnected hair or uncovered sleeve/foot masks.
- Ground contact in every cell and unchanged standing heights.
- 208 bone segments checked before projection, with only floating-point roundoff in their lengths.
- Every right-facing layer frame differs in shading from its plain mirror while retaining the reflected silhouette.
- Both side-view robe light planes use brighter indices on the left than on the right.
- Eye and brow pixels remain uncovered in all 36 sample-character × skin-tone combinations. This checks visibility, not artistic quality.
- A clean rebuild reproduces all 36 output files byte for byte; hashes are in `scratch/round3/rebuild-hashes.json`.

## What still looks weak

- The seven-pixel face width limits individuality. Eyes and brows are present at play zoom, but expressions and eye colour remain subtle, especially on the very dark bearded face and the ranger standing in building shadow.
- Long hair still has fairly straight hanging sides. The braid and cape motion are economical rather than physically simulated.
- Six frames make the gait stepped. Using a relaxed F0 as both the idle pose and a walk phase gives the cycle a slight settling beat. The passing knee is angular in profile. The back row remains a repeated standing pose, as in round 2.
- The robe reads as heavy cloth, but its broad right shadow and sparse folds are still simplified. Its hem hides much of the leg animation.
- Contact ellipses do not reproduce the town's directional, body-shaped cast shadows. The sprites remain sharper than the scene's depth blur, and 2.3× scaling produces uneven screen-pixel widths.
- The staff follows its grip and can lift during walking; it has no independently planted staff cycle. These are layer and composition samples, not an in-engine locomotion test.
