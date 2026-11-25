# Iron Gall — townspeople style sample

The direction is a small, sober figure study: long limbs, a small head, dropped shoulders, warm dark clothing, restrained facial marks, and light from screen-left. The people sit below the flagstones in value. Leather, linen, wool, hair and skin use separate planes rather than texture noise. The strongest silhouette edge is on the shadow side.

## Delivered

There are 16 transparent layer sheets, six judging PNGs, one walk GIF, this note, and `ramps.json`: 25 files in `out/`. Each layer is RGBA, 288 × 256, containing 48 × 64 cells, six columns and four rows in down / left / right / up order. Down and left contain six walk phases. Right and up repeat their standing frame, as permitted for this sample. The GIF uses six frames at 110 ms each.

`lineup.png` contains the six specified characters at native size and 4×. `swatch.png` contains character 2 in all six skin tones and character 1 in all eight hair colours. The two scene composites retain the original screenshots' 1280 × 760 dimensions. Normal zoom uses exactly 2× nearest-neighbour pixels; close zoom uses exactly 4×. The normal scene therefore deliberately uses the brief's square-pixel 2× option rather than approximating 2.3× with unequal pixel widths. The face test in `scratch/preview/dark-face-test.png` also includes a 2.3× comparison.

The scene grouping has two people facing each other, a passing scholar, and people near the monument and buildings. Contact shadows are separate, blurred elliptical composites at 40% initial alpha, with their centres shifted two sprite pixels right. No shadow alpha enters a layer.

## Ramps and layering

`ramps.json` is semantically identical to the JSON in BRIEF.md, and byte-identical to `../tools/ramps.json`. It contains five source regions, all specified target choices, and the seven fixed material ramps. Recolouring replaces exact source hex values with the corresponding target shade index, separately for each layer. Black hair remains warm-neutral; copper hair uses the supplied red ramp. The six clothing colourways are exactly those specified in the brief.

Composition order is body, optional race feature, outfit, optional beard, hair, optional hood, optional staff. Clothing and fixed leather/linen colours are not confused with skin or hair source colours.

## Body variants and registration

The standing body heights are 59 pixels for the man and 56 for the woman, with their soles on row 63. Their skull patches have the same native dimensions. The woman's narrower jaw and waist and shorter torso/legs are authored in her own grids.

All three outfits have `@man` and `@woman` sheets because their shoulders, waist, pelvis, sleeves, and hems need different placement. Hair, beard, ears, horns, hood, and staff share patch artwork.

**Important runtime detail:** the exported shared head-layer sheets use the man's registration. When stacking those PNG sheets directly on the woman, translate their content **three pixels down within each cell**. Do not move the whole sheet and cross row boundaries. `../tools/compose.py` already handles this by assembling shared patches through the selected body's anchors. The staff uses the right-hand anchors and does not take the head offset. Outfits are already exported in their matching body's registration. This is shared artwork with rig placement, not identical absolute head coordinates for both bodies.

`../src/rig.json` is the alignment authority. It records integer head, torso, limb and hand anchors, arm and leg phases, bob and overlap order. Each layer's `layout.json`, where present, records local offsets. Hems have separately authored phases with a one-frame lag. Staff corrections preserve the grip opening and the row-63 ferrule; the profile standing staff leans forward to clear the face.

## Method and rebuilding

Six front/profile concept plates in `../scratch/concepts/` guided garment construction and character direction. They were design references only: no plate was reduced, sampled, traced or used as sprite pixels. The final art is authored as native indexed text grids in `../src/`, with one character per pixel and a material/shade legend. No ellipse, rectangle or polygon fill produced layer pixels. Ellipses and blur are used only for composite contact shadows.

`grid.py` converts PNGs to grids and back without quantization. `assemble.py` places patches on the shared rig, then applies sparse frame fixes. In ordinary grids `.` is transparent. In sparse fixes `.` means untouched and `-` explicitly erases a pixel; the legend declares that extension. The final grids are authoritative. The paint/refine/repair scripts preserve the construction and revision record and should not be rerun as the normal build, since they recreate earlier stages.

From this folder, rebuild the delivered images with:

```sh
python3 -B tools/assemble.py
python3 -B tools/compose.py
python3 -B tools/check.py
```

Only Python and Pillow are needed. `-B` avoids bytecode intermediates beside the tools. Inspection images, concept plates, reports, round-trip grids and cache files are in `scratch/`.

## Checks and visual revisions

The final checker reports zero off-palette pixels, zero semi-transparent layer pixels, zero source colours outside each layer's allowed material regions, and zero isolated opaque pixels. All body frames retain a planted pixel on row 63. All 16 PNG/grid/PNG round trips are byte-exact in RGBA pixel data. Both GIFs have six frames of 110 ms.

The alignment audit covers 24 valid layer/body combinations across all directions and frames. It checks the declared silhouette allowances, the unobstructed down-view hair/eye/cheek window, torso clothing coverage and staff grip collisions. These tests are useful structural checks, not proof of every aesthetic rule. Per-frame bounding boxes and detailed results are in `../scratch/check-report.json`.

For character 2, both exact iris pixels remain visible. The measured mean linear relative luminance is 0.07874 for sampled lit face pixels and 0.01023 for beard pixels, a gap of 0.06851. That confirms separation; it does not guarantee comfortable facial recognition at native size.

Visual review included the six concept plates, world reference crops, every layer at native size and 4×, all 24 alignment sheets, both full-size world composites and their enlarged views, the turn and swatch images, the walk GIFs and all six extracted outfit/body walk frames. Motion review was frame-based in the image viewer, not an in-engine playback test.

Revisions corrected robe coverage gaps, skin colours left in shaded boot patches, long hair intruding into the facial window, a disconnected braid, overly broad standing soles, staff grip/ground registration, and missing scholar collar/pouch construction. Cloth planes and the dark face were also repainted after viewing the first composites.

## Honest weaknesses

- The figures remain quite narrow and upright, especially in profile. They read as adults, but the shared stance is more rigid and less individually observed than the concept studies.
- The walk has real contact, bent-knee and passing phases, opposite arm motion, and the specified 0/1/2-pixel bob. It is still angular. The two-pixel recovery into the passing pose is conspicuous, and the frontal stride is less convincing than the profile stride.
- Character 2's face is warmer and lighter than his black hair/beard, and the eye, nose and mouth pixels are present. At 1× the eyes and especially the mouth remain subtle. I would not describe the brief's strongest unaided facial-recognition requirement as an unqualified visual pass.
- Robes show small toe contacts, but their long silhouette conceals much of the leg action. The staff's changing profile angle also needs a live-motion judgement.
- Long hair and the cloak backs still have rather vertical clumps and planes. Some cloth folds feel diagrammatic; the wear is restrained enough that linen and wool can look too clean.
- Hair, horns, ears, hood, staff and hem length distinguish the lineup, but the two labourers and two rangers retain closely related body silhouettes.
- The sprites are crisper and flatter than the scene's lit 3D surfaces. Their palette and left-side lighting fit the street reasonably, but the soft contact ellipses cannot reproduce full cast shadows, environmental occlusion, bloom or camera-dependent foreshortening. The close scene exposes this flatness most clearly.
- The checker verifies heights and ground contact, but it does not independently certify every anatomical landmark, fold count, material highlight budget or ink-edge placement. A zero-error report should not be read as complete artistic compliance.

## Scope disclosure

No outside artwork, existing sprite, other Downloads folder, or repository was opened or searched. One mandatory system image-tool skill document was read outside this folder; that was a higher-priority tool-use requirement and was disclosed during the work. The image service also automatically maintained its own external cache. Those cache files were not opened, listed or read; the six local concept copies were written from the tool's returned image bytes. All authored project files and deliverables are in this folder.
