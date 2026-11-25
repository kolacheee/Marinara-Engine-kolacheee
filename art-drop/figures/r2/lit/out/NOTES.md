# Same Sun — lit figure sample

The direction is restrained adult figures under the market's fixed upper-left sun: small heads, long limbs, warm lit planes, neutral dark sides, and material-specific edges. The normal and close world composites use the supplied screenshots at their original 1280 × 760 resolution. Figures use nearest-neighbour scaling at 2.3× and 4× respectively, with the specified soft contact ellipse offset right and upward.

All 24 layer sheets are 288 × 256 RGBA: six 48 × 64 frames in each of the down, left, right and up rows. Down and left have six poses. Right and up contain separately rendered standing poses repeated six times; they are not additional walk cycles. Every layer above the two shared bodies has a height-specific `@man` and `@woman` version, including the optional woman beard. Stack body, feature, outfit, beard, hair, hood, held item.

## Ramps

`ramps.json` contains the brief's complete, unchanged target and fixed ramps. Source regions are skin.medium, hair.brown, eyes.brown, clothA.madder and clothB.oak. Recolouring is exact source-index substitution. No source colour collides with a fixed colour.

Black hair retains the supplied neutral warm-grey ramp. The very-dark skin ramp was not brightened: the forehead, nose and cheek remain separate from the beard after correcting the hair aperture. Pale recolours prompted stricter exposed-edge index selection, tested against every target in each region. This changes which ramp indices appear at edges, not the ramps themselves. Eye pixels and intentional metal glints are exempt; the staff uses its separately specified lit and shaded edges.

## Construction and reproduction

`tools/rig.py` owns the skeleton, fixed bone lengths, joint positions, head anchors, planted-foot targets, bob and delayed secondary motion. Three-dimensional two-bone solves maintain constant limb lengths. Clothing and hair primitives attach to those joints.

`tools/render.py` rasterizes material, depth and normals at 192 × 256 per frame, applies the supplied sun and shading equation, same-layer shadow rays, overlap occlusion, lower-leg darkening and ground bounce. Cloth uses fold fields. Aligned 4 × 4 blocks choose the majority material and average lighting before ramp quantization. Faces, hands, footwear and tiny fittings are authored at native resolution in `tools/maps.py`. `tools/patches.json` is present and empty; no unrecorded post-render painting is required.

`tools/compose.py` performs recolouring and builds the presentation images. The renderer uses Python's standard library and Pillow; it does not need NumPy. No existing sprite, external art asset or generated concept image was used.

Rebuild from this folder with:

```sh
python3 tools/build.py > scratch/build.log
```

The rebuild preserves this notes file. Intermediate proofs and audit reports live in `scratch/`.

## Checks and visual review

- 24 sheets: zero off-palette pixels, zero partial-alpha pixels, correct dimensions.
- All 48 body frames have supporting-foot pixels on row 63.
- Constant bone lengths and rigid head-attachment translations pass.
- No detected body-skin leaks in the checked sleeve/torso and trouser/boot join regions.
- Zero exposed lit-edge contrast failures across target ramps, with the exceptions described above.
- Both one-pixel eyes remain present in all six standing composites. Pixel presence alone is not a claim of equal perceptual readability.
- GIF: six frames, 110 ms each, looping. Opened the GIF and inspected all six decoded frames; the image-viewing tool presents a static frame rather than a real-time playback viewport.

Every layer was inspected in a combined 1×/4× proof. The lineup, turn, walk and swatches were reviewed, as were all alignment panels at 8×, texture comparisons, and both world composites at full resolution. Revisions restored covered forehead planes, corrected front-only details in back views, removed sideways knee bending, connected wrists and hair roots, repaired the pelvis coverage, and made profile ears sweep backward. `align.png` shows every layer edge in its own flat colour over both bodies; the first four rows are man, the next four woman. Detailed attachment tables and check results are in `scratch/anchor-table.txt`, `scratch/checks.json` and `scratch/final-audit.json`.

## Honest remaining weaknesses

The figures are still quite narrow in profile. Long hair has a somewhat rectangular hanging shape, and the robe/tabard folds are regular enough to reveal their procedural construction. Robe hems remain stiffer than convincing heavy cloth, despite their delayed motion. The down-facing walk reads less strongly than the side walk because most of its stride is in depth and the apron or cloak hides the upper legs.

Character 2's forehead and nose separate from his black hair and beard, but his eyes and mouth remain difficult to distinguish quickly at native 1×. The hooded older man's face is similarly compressed. These are visible, deliberately tiny anatomical marks, not portrait-quality faces.

The broad light direction and colours fit the street better than the first render did, but the figures still have harder, more graphic small-scale shading than the world's softly lit 3D surfaces, especially at close zoom. The shadow/AO model is a compact depth-buffer approximation with discrete ray samples and intersection masks; it is not a full geometric or cloth simulation. This remains a style-test set requiring art-direction approval, not a claim of final commercial character quality.
