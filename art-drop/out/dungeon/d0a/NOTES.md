# D0a Part A

Rebuilt Part A on 2026-11-20 to address all six points in `art-drop/review-d0a/operator-A.md`. This replaces the earlier palette submission and its fixed step-to-role assignments. Changed only `canon/palette.hex`, `canon/palette.json`, `canon/palette.png`, the palette builder and validator, and this log. The summer reference crops remain unchanged. Part B still chooses the canon cell size; the 48-pixel palette chips do not decide it.

The palette contains 61 ramps of six steps: 366 entries, 355 distinct colours, and 61 different darkest colours. The atlas is 1728 × 3120 pixels. I drew its flat swatches, borders and bitmap labels directly at their final coordinates. There is no generated imagery, spatial reduction, smoothing, soft alpha or procedural texture in the deliverable. Quantisation analyses colour only: Pillow median cut, 24 colours, no dithering, on the full master PNG.

The operator's ten sample colours all occur in that quantisation. Oak retains `#553d2b`, `#825b39`, `#91643b` and `#b69057`; timber retains `#6b3e2b`; plaster retains `#d2c1a5` and `#ddd7ca`; limestone retains `#989f9d`; overgrowth and the added sage textile retain `#354937` and `#99ae80`. The top of `palette.png` shows the quantised oak, plaster and green anchors beside their curated ramps. I discarded intermediate colours and chose the remaining steps individually.

Material values now vary. The mean L* of steps 4–6 is 81.67 for marble, 78.35 for plaster, 41.67 for basalt, 45.39 for soot, 61.47 for oak and 62.40 for brick. `A-material-values.png` shows every ramp beside its greyscale strip. Each material has its own cool outline, rising toward warmer lights; ice and station ramps move from blue shadows toward cyan or pale neutral lights. The separate `void-mass` ramp supplies shared darkness beyond walls.

Brass has yellow metal midtones and a cream highlight. Embers progress from deep red through muted burnt orange to a warm core. Blue ice ends in pale cyan, crystal ends in pale violet, and slime's yellow-green differs from the softer lichen and overgrowth. Gameplay colours and all seven lair accents remain separate from material ramps. The validator checks material saturation in reserved hue windows; the low-chroma den accent is compared with bone, since hue angle alone also includes unrelated wood and brass. Its general saturation ceiling covers every material.

Roles are listed per ramp in `palette.hex`. A floor can use only its listed L*35–55 window, with a maximum total span of 15 L*. The largest current span is 14.491. Prop bodies must also clear their actual floor by 10 L*, and the report lists compatible body steps for each floor colour. Pale highlights cannot become broad floors or bodies. Exact master cream `#ddd7ca` measures L*86.10; it stays as a reference-only step in marble, plaster and clean tile, outside scene roles. All other colours stay at or below L*85. Every reserved final step clears the brightest listed floor by at least 23.859 L*. Breach steps 4–6 stay at least 19.626 Delta E76 from the matching found-trap steps and 10.132 from embers.

Re-ran `extract_overworld.py` using the requested `git show` source. Grass is 288 × 288, the path strip is 192 × 1104, and cobble (`street`) is 288 × 288. Saved pixels match the source regions exactly. Their original isolated texture pixels remain in these reference inputs; they are not newly authored floor art.

`check_palette.py --reviews` passes all 366 swatches, HEX/JSON agreement, L* labels, ramp ordering, exact anchors, hue shifts, floor windows, reserved-hue checks, palette membership, binary alpha and dimensions. The atlas has zero off-palette, soft-alpha or pure-black pixels. Example allocations across all 14 looks use at most 15 surface colours and 45 prop colours, below the 32/48 limits. The full reference atlas is not a surface or prop sheet. Floor clusters, stepped curves and object outlines are not present in Part A and remain checks for the later art.

Self-review covered every ramp and all three crops at 1×, 2× and 3× nearest-neighbour, in greyscale and as a 4× nearest-neighbour greyscale squint, alongside native master crops. The enlarged chips and bitmap labels have hard edges. Pale and dark material groups separate in greyscale; the reserved orange, red and gold families remain distinguishable. Review images and measurements are under `art-drop/review-d0a/A-*`. The eleven ramp detail sheets cover all 61 ramps; `A-material-values.png` compares their greyscale values. This is my self-review; operator acceptance remains outstanding.

No files outside `art-drop/` were changed. No commit, push or branch change was made. Reproduce with the three Python commands recorded below, preferably with `PYTHONDONTWRITEBYTECODE=1` to avoid local bytecode files.

# D0a Part A: critic 1 redraw

Repaired `canon/palette.hex`, `canon/palette.json` and `canon/palette.png` for both findings in `critic-A-1.json`. No `operator-A.md` was present. Breach steps 4–6 are now `#e65a16`, `#ff8446` and `#ffbc96`, with L*56.29, 68.18 and 81.53. They retain an orange body and warm cream highlight. Their matching-step Delta E76 distances from foe red are 30.03, 32.47 and 21.70; from found-trap orange-yellow, 23.54, 11.27 and 11.04. Step 6 is 27.29 L* above the brightest material floor and below the L*85 ceiling.

Prop bodies must be within L*30–70 and at least 10 L* from their actual floor. Steps 3–6 qualify only when both checks pass. Step 1 remains the outline; step 2 is for wall tops or small shadows. Updated the builder, HEX comments, bitmap instructions and validator. The validator checks eligible bodies against every material floor colour and rejects both an out-of-band dark body and a body matching the floor.

Regenerated the palette, ramp-detail and overworld `A-*.png` review sheets, plus adjacent foe/breach/trap/loot comparisons. Inspected the atlas and source crops at 1x, 2x and 3x nearest-neighbour, in greyscale and as a 4x nearest-neighbour greyscale squint. The flat chips and bitmap labels remain crisp. `A-validation.json` passes all 354 swatches, palette membership, binary alpha, nonblack colours, value bands, dimensions and example sheet budgets. Floor-cluster and object-outline geometry checks do not apply to this palette atlas.

Verified the three passing summer crops against the source returned by `git show`; they match pixel for pixel and remain unchanged. All other ramps remain unchanged. Review files stay in `art-drop/review-d0a/`. This is a self-review; independent critic approval remains outstanding. No files outside `art-drop/` were changed; no commit, push or branch change was made. The earlier log below records the first submission and its measurements.

# D0a Part A

Completed 2026-11-20 on `art/dungeon-maps-2026-11-20`. This part supplies the summer reference crops and palette. No earlier-part deliverables were changed. No commit, push or branch change was made.

The palette files are `canon/palette.hex`, `canon/palette.json` and `canon/palette.png`. They contain 59 named ramps of six steps each: 354 entries using 295 distinct colours. The 1728 × 2496 atlas groups materials by all 14 looks, followed by lair dressing, gameplay colours and the seven lair accents. Each swatch occupies exactly 48 × 48 pixels and carries its step, hex and CIELAB L* value. The six value bands and usage restrictions appear on the sheet and in the HEX comments. `planters` supplies muted terracotta; `hazard-paint` supplies decorative station markings; `found-trap` is reserved for discovered hazards.

The master PNG was analysed with 48-colour median-cut quantisation without dithering, plus six-colour samples of wood, stone, plaster, textile and station regions. I merged neighbouring browns into oak, timber and parquet choices, retained `#825b39` and `#a07748` from the whole-image analysis and `#886239` from the wood sample, and discarded adjacent intermediate shades. Cream stone, plaster and cool station families were extended toward blue-grey outlines and warmer lights, with values lowered to the dungeon ladder. The additional materials and accents use explicitly chosen six-colour lists in `tools/build_palette.py`. The yard retains source grass `#60762f`, path `#5a4e3c`, `#73644d`, `#8d7958`, and cobble `#60655c`, `#898065`. The slate and yard stone hues were also compared with `city-r17.png`; those exterior references do not control the interior ramps.

The atlas was drawn directly at its final resolution using flat rectangles, one-pixel keylines and an embedded bitmap font. It contains no imported generated imagery, resized art, antialiasing, texture noise, gradients or soft alpha. Quantised images are analysis files under `art-drop/review-d0a/`, never art inputs.

Summer crops came from `git show fork/claude/project-thread-vsyxr6:packages/server/src/assets/overworld-art/fantasy.json`. The unseasoned entries were used. Coordinates below are source pixels, with the right and bottom bounds excluded:

| Reference file | Sheet | Crop bounds | Size |
| --- | --- | --- | --- |
| `overworld-grass-0.png` | `built` | 576, 0, 864, 288 | 288 × 288 |
| `overworld-path_joined-0.png` | `art2` | 0, 0, 192, 1104 | 192 × 1104 |
| `overworld-street-0.png` | `art2` | 1440, 1680, 1728, 1968 | 288 × 288 |

These files are in `art-drop/dungeon/reference/`. `street` is the rounded cobble pattern; `square` is block paving. Each saved crop was decoded again and compared pixel-for-pixel with its source region. Grass has four colours, the path has eight opaque colours plus transparency, and cobble has twelve colours. Alpha is 0/255; transparent RGB is zero. The unchanged sources contain respectively 1191, 1130 and 2316 interior pixels with no same-colour cardinal neighbour. These are reference observations, not a claim that the source textures meet the new cluster rule. Repainting them would violate the requested 1:1 extraction.

`tools/check_palette.py` passed. It verifies all 354 swatch interiors against both text files, ordered ramp values, band assignments, floor spans, material saturation, reserved-colour separation, dimensions, alpha and palette membership. Results:

- Zero off-palette, soft-alpha or pure-black pixels in the atlas; its alpha is entirely 255.
- Material mass L* 10.07–10.16, wall top 22.82–23.17, wall face 32.81–33.88, floor 42.04–54.24 and prop lights 67.49–68.92. Every mass is at least 25% darker than its wall top by L*.
- Floor steps 4–5 span at most 11.601 L*. Material HSV saturation peaks at 0.6204; the conservative guard is 0.63. No material colour matches reserved steps 3–6.
- Reserved step 6 remains below L* 85 and at least 28.629 L* above the highest floor. Use step 5 as a focal light only when its actual local gap is at least 15 L*. Hoard bodies use steps 3–4, below loose loot at steps 5–6.
- Material-only examples for each look use at most 27 colours; adding oak and iron for prop examples uses at most 37. These pass the 32/48 sheet budgets. The complete palette atlas is a reference across many looks, so the per-asset caps do not apply to its 295 colours.

Self-review covered every ramp at 1×, 2× and 3× nearest-neighbour, in greyscale and in the 4× nearest-neighbour greyscale squint, beside native master crops. The same views were checked for the three overworld crops. Initial fixes added keylines to distinguish dark swatches from the background and replaced olive gameplay shadows with cooler colours. The final yard changes were reviewed again. Labels remain legible, chips have hard edges, and the value steps remain distinct in greyscale and squint. Part A contains no authored floor texture or object silhouettes; cluster size, curve runs and object-outline geometry remain checks for the later art parts.

All review images, source analysis and reports are under `art-drop/review-d0a/A-*` and must stay out of commits. `A-palette-{1x,2x,3x,grey,squint}.png` shows the complete atlas; `A-ramps-01.png` through `A-ramps-10.png` show every ramp in detail. `A-overworld-*` covers the crops. Measurements and source hashes are in `A-validation.json`, `A-overworld-provenance.json` and `A-source-checks.json`. This is a self-review, not an independent panel review or owner approval.

To reproduce, run the following from the checkout root with Python and Pillow:

```sh
python3 art-drop/out/dungeon/d0a/tools/extract_overworld.py
python3 art-drop/out/dungeon/d0a/tools/build_palette.py
python3 art-drop/out/dungeon/d0a/tools/check_palette.py --reviews
```
