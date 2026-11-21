# D0a Part D: critic 7 redraw

2026-11-21. Repaired the five failed frames and their companions. The keep route retains its paving joints and has broken wear edges. Bone groups have 16 distinct silhouettes. The cave uses native bedrock pieces with lit lips, undercut fronts and selected fractures; complete pieces cross the floor-pattern boundaries. The northwest outcrop has a separate crown and dark front. Manor repairs cover the soil path, turf contacts and second herb bed.

Authorized earlier-part edits are the four cave floors, the rock proof and grey copy, the rock/ice/crystal swatch floor halves, and those three style-guide inserts. All 24 protected files retain their starting SHA-256 hashes. The station quartet and STORIES.md are unchanged. The palette, 48 px cell and 325 source-object anchors are unchanged. The prior log is retained below.

The built-in image tool supplied `D7-cave-small-source.png` for bedrock and `D7-cave-source.png` for two earth patches. Both are read at origin (0,0), pitch (1,1), then assigned palette colours and cleaned. Complete pieces move without changing their native pixels. Prompts, registration, source images and review renders are in `art-drop/review-d0a/`.

`D-critic7-redraw-validation.json` records binary alpha, transparent RGB, palette membership, dimensions, colour caps, exact companions and every tile's lone-pixel percentage. The four cave floors have zero lone pixels and zero one/two-pixel components. Their L* spans are rock 14.474, ice 14.592, crystal 11.718 and lava 11.689. Surface and prop sheets peak at 12 and 20 colours. The highest frame-cell lone-pixel rate is 2.257%, below 3%.

I checked native, nearest-neighbour 2x/3x, grey and quarter-grey views. The six five-second checklists below retain their item coordinates; I rechecked the doors, stairs, traps, chest states, party, foes, lair features and broken insets there. The found secret remains at (648,720) in hoard-keep. The three lair approaches remain in place. This was my own recognition check, not an independent timed player test or owner acceptance.

Rebuilt `d0a-review.png` and the current `D-*.png` review sheets. Reproduce with `d7_caves.py`, `d7_backport.py`, `d7_scene.py`, then `d7_review.py` (its `contact`, `materials` and map-name arguments render the sheets). No commit, push or branch change was made.

# D0a Part D: critic 6 redraw

2026-11-21. Redrew the five failed frames and their companions, the four cave floors, their proof/grey pairs and swatches, and the four matching style-guide inserts. Rebuilt `d0a-review.png` and the current `D-*.png` review sheets. All 17 files marked pass by critic 6 retain their starting SHA-256 hashes. The palette and 48 px canon cell are unchanged.

The floors have joint-rooted wear and native stone grain. The hoard has overlapping coins, shaded vessels and a silver salver over one bronze bank. The temple has a continuous fractured chasm face, separate molten pockets and broken approach masonry. The crypt circle consists of fitted inlay segments; bone groups have distinct anatomy. Manor work includes bedding and footboards, native wood grain, continuous plaster, varied hearth fittings, fuller garden plants, a masonry well and a braced bench.

The built-in image tool supplied `D6-cave-source.png`. Its four material crops are read at origin (0,0), pitch (1,1), with no reduction. The cave frame also reads the earlier native image source. Palette assignment and component cleanup precede the native contour and material edits. `D6-source-registration.json` records the four crops and pixel repairs; `D6-cave-prompt.txt` records the prompt. Master wood, stone and textile details use one art pixel per registered 2×2 storage block. All source images and scratch work stay in `art-drop/review-d0a/`.

Earlier-part changes are confined to the authorized cave floors, proof floor regions, lower swatch halves and matching guide inserts. Proof walls, swatch walls and prop files are unchanged. The lava crucible still has no handle. All 325 recorded source-object anchors remain in place.

`D-critic6-redraw-validation.json` passes the saved-pixel checks: binary alpha, zero RGB under transparency, palette membership, no opaque black, native dimensions divisible by 48, and exact frame companions. Surface/prop sheets use at most 12/20 colours against caps of 32/48. Every 48 px cell's lone-pixel percentage is recorded. The highest rate in a rendered surface cell is 0.521%, below 3%.

| Cave floor | L* span | Highest lone-pixel rate per cell |
| --- | ---: | ---: |
| Rock | 14.474 | 0.174% |
| Ice | 14.592 | 0.087% |
| Crystal | 11.718 | 0.087% |
| Lava | 11.689 | 0.130% |

I inspected native views, nearest-neighbour 2x/3x details, greyscale, quarter-grey squints and floor repeats. These are my five-second recognition targets at 1x; an independent timed player test remains pending. The wall top/face/baseline/mass coordinates remain in the wall checklist below.

| Frame | Open / locked door | Stairs / striped trap | Closed / opened chest | Party / red foe | Feature / broken inset |
| --- | --- | --- | --- | --- | --- |
| hoard-keep | (384,324) / (384,240) | (336,240) / (576,432) | (1104,198) / (576,552) | (336,225) / (576,232) | Heap (240,875), brazier (336,960) / (1224,936) |
| breach-temple | (528,186) / (1200,342) | (480,198) / (1296,390) | (816,246) / (576,294) | (1248,184) / (1200,480) | Chasm (456,653), focus (816,625) / (1272,984) |
| sanctum-crypt | (960,192) / (1296,432) | (1008,198) / (1056,534) | (864,390) / (816,390) | (1008,518) / (1200,228) | Inlay (198,612), focus (432,336) / (1416,888) |
| cave_rock-plain-21 | (987,174) / (1704,1062) | (1371,552) / (1275,558) | (1464,558) / (1467,606) | (1371,540) / (600,432) | Rock masses (821,430), (1275,670); no lair |
| manor-ground | (552,276) / (528,678) | (624,288) / (1152,246) | (1440,918) / (912,1014) | (1008,1086) / (1008,231) | Well (50,584), garden (1918,325); no lair |
| station_lab | (456,312) / (648,408) | (816,528) / (552,330) | (600,528) / (384,528) | (192,618) / (744,270) | Specimen bay (660,174); no lair |

The found secret is at hoard (648,720). Approach targets are hoard (563,635), (574,749), (499,804); temple (1051,407), (1024,525), (872,554); and sanctum (766,242), (632,270), (513,344).

Rebuild with `d6_caves.py`, `d6_backport.py`, `d6_scene.py`, then `d6_review.py`; `d6_materials.py` supplies shared native materials. I reviewed the art and this log locally; independent critic acceptance and owner approval remain pending. No commit, push or branch change was made.

# D0a Part D: critic 5 redraw

2026-11-21. Redrew the five failed frames and refreshed their companions, the four cave floors, cave proof/grey pairs, cave swatches, four style-guide inserts, and `d0a-review.png`. The 17 files marked pass by `critic-D-5.json` retain their starting SHA-256 hashes, including the lab quartet and STORIES.md. The cell remains 48 px; the palette is unchanged.

The hoard has overlapping coin surfaces over bronze fronts, with goblets and a crown. The temple chasm has fractured stone fronts, fallen crust and ember pools; its inset shows a stone seal. Keep, temple and crypt paving has joint-connected wear. The violet inlay has paving joints, chips and connections to its sockets. Bone groups and candles vary at their source anchors. Manor repairs include separate short kitchen stoves, deeper sinks, shorter alcove beds with an aisle, the removed square interior void, service-floor wear, different garden plantings and joinery on the bench and well.

The cave beds were drawn again at native resolution using the existing `D-cave-source-native.png` as a layout reference. No source image was reduced or sampled into these drawings. The scene uses individual bed contours rather than repeating the 1152 px atlas. Its raised masses have connected crown/front planes; the southeast mass retains the source hollow. The four reusable floors continue their forms across pattern boundaries. Small corner repairs are recorded in `D5-corner-repairs.json`; repeat and seam sheets are in `art-drop/review-d0a/`.

Authorized earlier-part edits are limited to those four cave floors, their proof floors and grey copies, the lower halves of their swatches, and the matching guide inserts. Proof walls, swatch walls and prop files remain unchanged. The lava crucible remains handle-free. All 325 recorded source-object anchors are preserved.

`D-critic5-redraw-validation.json` records the final checks, including every 48 px surface cell. Alpha is binary, transparent RGB is zero, authored colours belong to the palette, and opaque black is absent. Surface sheets use at most 12 colours and prop sheets at most 20. Native dimensions remain multiples of 48. All 18 frame conversions match their specified conversions; the quarter-grey review copies are the downscale exception.

| Repaired cave floor | L* span | Highest lone-pixel rate per cell |
| --- | ---: | ---: |
| Rock | 14.474 | 0.0868% |
| Ice | 14.592 | 0.0868% |
| Crystal | 11.718 | 0.0434% |
| Lava | 11.689 | 0.0868% |

I checked native views, nearest-neighbour 2x/3x details, grey views, quarter-grey squints and the native repeat joins. The table below records my recognition targets, not an independently timed player test. Wall top/face/base/mass coordinates remain in the next section's wall checklist. The found secret remains at hoard (648,720).

| Frame | Open / locked door | Stairs / striped trap | Closed / opened chest | Party / red foe | Feature / broken inset |
| --- | --- | --- | --- | --- | --- |
| hoard-keep | (384,324) / (384,240) | (336,240) / (576,432) | (1104,198) / (576,552) | (336,225) / (576,232) | Treasure (240,875), brazier (336,960) / (1224,936) |
| breach-temple | (528,186) / (1200,342) | (480,198) / (1296,390) | (816,246) / (576,294) | (1248,184) / (1200,480) | Chasm (456,653), focus (816,625) / (1272,984) |
| sanctum-crypt | (960,192) / (1296,432) | (1008,198) / (1056,534) | (864,390) / (816,390) | (1008,518) / (1200,228) | Circle (432,612), focus (432,336) / (1416,888) |
| cave_rock-plain-21 | (987,174) / (1704,1062) | (1371,552) / (1275,558) | (1464,558) / (1467,606) | (1371,540) / (600,432) | Rock masses (821,430), (1275,670); not a lair |
| manor-ground | (552,276) / (528,678) | (624,288) / (1152,246) | (1440,918) / (912,1014) | (1008,1086) / (1008,231) | Well (50,584), garden (1918,325); not a lair |
| station_lab | (456,312) / (648,408) | (816,528) / (552,330) | (600,528) / (384,528) | (192,618) / (744,270) | Specimen bay (660,174); not a lair |

Lair approach targets: hoard (563,635), (574,749), (499,804); temple (1051,407), (1024,525), (872,554); sanctum (766,242), (632,270), (513,344).

New tools are `d5_ground.py`, `d5_backport.py`, `d5_scene.py` and `d5_review.py`, run in that order. Review sheets and scratch files stay under `art-drop/review-d0a/`. This was a drawing-agent self-review; independent critic acceptance and owner approval remain pending. The prose pass was local. No commit, push or branch change was made.

# D0a Part D

2026-11-21, operator-D redraw. Revised the five rejected frames and their companions. The accepted `station_lab` frame, all three lab companions and `frames/STORIES.md` retain their starting SHA-256 hashes. The cell remains 48 px; the palette and Part B prop files are unchanged.

The hoard contains coin stacks, goblets, a crown and plate stacks over a bronze body. The north-wall coin overlay is removed; the added crate sits beside the hearth at (604,495). The temple has straight octagonal corner cuts, a broad undercut chasm with separate ember pools, warm sandstone paving and increasing rubble along the approach. The crypt has distinct paving and cloth zones. The manor has continuous plaster faces, connected partition stubs, closed north-wall notches, study desks, different floor materials for service rooms and the entrance, dining rugs and coloured bedding. Its yard has a path, herb beds, a well and a bench. Bone piles, rubble, boulders and dining seats have local variants at their source anchors.

The cave floor uses a built-in image-tool source at native resolution. I rejected the first enlarged-grid image. For the accepted source, registration is `(0,0)` with pitch `(1,1)`: one source pixel becomes one art pixel. The source is 1254 × 1254; the 1152 × 1152 atlas and four 288 × 288 patterns are crops. Palette assignment uses four material bands. Indexed cleanup removes disconnected one- and two-pixel fragments; the complete coordinate ledger is in `art-drop/review-d0a/D-cave-source-registration.json`. Native pencil work supplies the walked route, damp pool margins, raised rock masses and the lava fault banks. No art is reduced. The full prompt is in `art-drop/review-d0a/D-native-cave-prompt.txt`.

Authorized earlier-part edits are the four cave floor patterns, their proof/grey pairs and swatches, and those four swatches' inserts in `canon/style-guide.png`. All other Part C proofs and swatches remain unchanged. The lava proof retains the handle-free crucible. `d0a-review.png` contains the six native frames and fourteen proof tiles. New tools are `d4_caves.py`, `d4_backport.py`, `d4_scene.py` and `d4_review.py`; run them in that order to reproduce this round. Review sources and comparisons stay under `art-drop/review-d0a/`.

`D-final-validation.json` passes the saved-pixel checks. All 325 source object anchors remain in place. All 18 companion conversions match: exact nearest-neighbour 2x, greyscale, and quarter-size greyscale squint. Alpha is binary, transparent RGB is zero, scene colours belong to the canon palette, and opaque black is absent. Production surfaces use at most 12 colours; prop sheets use at most 20. Native dimensions are multiples of 48. Quarter-size squints are review exceptions.

| Cave floor | L* span | One/two-pixel components | Highest lone-pixel rate in a 48 px cell |
| --- | ---: | ---: | ---: |
| Rock | 14.474 | 0 | 0.174% |
| Crystal | 11.718 | 0 | 0.087% |
| Ice | 14.592 | 0 | 0.130% |
| Lava | 11.689 | 0 | 0.130% |

The highest lone-pixel rate in the rendered surface cells is 0.738%, below the 3% limit. Every cell's measurement is retained in the report. I inspected the native frames, nearest-neighbour enlargements, greyscale and squints, with master crops at matching art-pixel scale. `D-final-*.png` and `D-final-detail-*.png` contain those comparisons. This was my own visual review; independent critic review, a timed player test and owner acceptance are still pending.

## Five-second self-check targets

Coordinates are native `(x,y)` pixels. These are the items I checked for recognition in each 1x frame; they are not timings from an independent player.

| Frame | Open / locked door | Stairs / striped trap | Closed / opened chest | Party / red foe | Feature / broken inset |
| --- | --- | --- | --- | --- | --- |
| hoard-keep | (384,324) / (384,240) | (336,240) / (576,432) | (1104,198) / (576,552) | (336,225) / (576,232) | Brazier (336,960), treasure (240,875) / inset (1224,936) |
| breach-temple | (528,186) / (1200,342) | (480,198) / (1296,390) | (816,246) / (576,294) | (1248,184) / (1200,480) | Chasm (456,653), focus (816,625) / inset (1272,984) |
| sanctum-crypt | (960,192) / (1296,432) | (1008,198) / (1056,534) | (864,390) / (816,390) | (1008,518) / (1200,228) | Circle (432,612), focus (432,336) / inset (1416,888) |
| cave_rock-plain-21 | (987,174) / (1704,1062) | (1371,552) / (1275,558) | (1464,558) / (1467,606) | (1371,540) / (600,432) | Raised rock (821,430); not a lair |
| manor-ground | (552,276) / (528,678) | (624,288) / (1152,246) | (1440,918) / (912,1014) | (1008,1086) / (1008,231) | Yard well (50,584), garden (1918,325); not a lair |
| station_lab | (456,312) / (648,408) | (816,528) / (552,330) | (600,528) / (384,528) | (192,618) / (744,270) | Specimen bay (660,174); not a lair |

| Frame | Wall top / face / baseline / mass |
| --- | --- |
| hoard-keep | (480,108) / (480,144) / (480,167) / (480,80) |
| breach-temple | (600,65) / (600,100) / (600,125) / (600,40) |
| sanctum-crypt | (610,105) / (610,145) / (610,167) / (610,80) |
| cave_rock-plain-21 | (650,45) / (650,80) / (650,107) / (650,20) |
| manor-ground | (600,205) / (600,240) / (600,263) / (600,170) |
| station_lab | (500,35) / (500,70) / (500,95) / (500,12) |

The found secret is at hoard (648,720). Hoard approach treasure is at (563,635), (574,749) and (499,804). Temple approach rubble is at (1051,407), (1042,468), (1024,525), (972,553) and (872,554). Sanctum approach cloth and offerings are at (766,242), (703,251), (632,270), (561,290) and (513,344).

I performed the prose pass locally without an independent reader. Project edits stayed under `art-drop/`; no commit, push or branch change was made.

# D0a Part D: critic 3 redraw

Repaired the 31 files failed by `critic-D-3.json`. All 29 passing files retain their starting SHA-256 hashes, including the Part C proofs, swatches, style guide and STORIES.md. No `operator-D.md` was present. This D0a-D.3 repair keeps the 48 px cell and existing palette.

Both chest states retain the accepted B chest's board divisions, grain, straps and hasp. Brighter boards preserve loot separation; hinges connect the opened lid to the case. The hoard has fewer ingots, exposed cargo boards, goblets and overlapping plate stacks. Its brazier has a bowl, fuel bed, clamps and feet; the broken inset has a fallen, extinguished bowl. The southeast wall follows an ordered native curve. The eastern crypt altar has a stone slab, carved supports and a green reliquary. Manor plaster has timber contact areas without repeating lath damage. Rock ground has exposed beds, clay between them and local wear along the original route. Four cave patterns have connected material seams, with whole shapes continued across their boundaries. The original mining apparatus, mushroom and stairs remain visible.

`D-validation.json` and `D-critic3-redraw-audit.json` pass saved-pixel checks for binary alpha, transparent RGB, palette membership, nonblack outlines, dimensions, colour caps, all 18 frame companions and all 325 source object placements. The four complete cave patterns have zero one- or two-pixel colour components. Maximum floor span is 14.592 L*. Per-cell lone-pixel percentages are recorded in the audit: the highest floor-cell rate is 0.1303%, surface-cell rate 1.3455%, and rendered surface-cell rate 0.4775%, all below 3%. The repaired wall curve's vertical runs decrease from 20 to 1 without alternating back upward. The manor face averages 29.032 L*.

Regenerated the current `D-*.png` sheets and `d0a-review.png`. The `D-critic3-*` sheets contain native, 2x and 3x comparisons, grey and quarter-grey views, repeat/seam inspections and master comparisons at equal art-pixel scale. My visual check covered the repaired drawings and the six frames' recognition targets below. This is a drawing-agent self-review; independent critic acceptance, a timed player test and the owner's station same-game judgement remain pending.

## Five-second checklist

Coordinates are native `(x,y)` pixels; inset coordinates mark their upper-left corners. These are the targets used for the self-check.

| Frame | Open / locked door | Stairs / striped trap | Closed / open chest | Party / red foe | Feature / broken inset |
| --- | --- | --- | --- | --- | --- |
| hoard-keep | (384,324) / (384,240) | (336,240) / (576,432) | (1104,198) / (576,552) | (336,225) / (576,232) | (336,960) / (1224,936) |
| breach-temple | (528,186) / (1200,342) | (480,198) / (1296,390) | (816,246) / (576,294) | (1248,184) / (1200,480) | (816,625) / (1272,984) |
| sanctum-crypt | (960,192) / (1296,432) | (1008,198) / (1056,534) | (864,390) / (816,390) | (1008,518) / (1200,228) | (432,336) / (1416,888) |
| cave_rock-plain-21 | (987,174) / (1704,1062) | (1371,552) / (1275,558) | (1464,558) / (1467,606) | (1371,540) / (600,432) | Not a lair |
| manor-ground | (552,276) / (528,678) | (624,288) / (1152,246) | (1440,918) / (912,1014) | (1008,1086) / (1008,231) | Yard: (72,600) |
| station_lab | (456,312) / (648,408) | (816,528) / (552,330) | (600,528) / (384,528) | (192,618) / (744,270) | Specimen bay: (660,174) |

| Frame | Wall top / face / baseline / mass |
| --- | --- |
| hoard-keep | (480,108) / (480,144) / (480,167) / (480,80) |
| breach-temple | (600,65) / (600,100) / (600,125) / (600,40) |
| sanctum-crypt | (610,105) / (610,145) / (610,167) / (610,80) |
| cave_rock-plain-21 | (650,45) / (650,80) / (650,107) / (650,20) |
| manor-ground | (600,205) / (600,240) / (600,263) / (600,170) |
| station_lab | (500,35) / (500,70) / (500,95) / (500,12) |

Found secret: hoard (648,720). Approach dressing: hoard (498,470), (564,646), (564,763); breach (1053,410), (1046,530), (860,561); sanctum (766,242), (632,270), (513,344). Repaired crypt altar: (1320,558).

The native drawings are in `tools/d3_materials.py`, `d3_ground_finish.py`, `d3_props.py` and `d3_scene.py`; checks are in `d_review.py` and `d3_audit.py`. Review and scratch files stay under `art-drop/review-d0a/`. The prose pass was local. No commit, push, branch change or write outside `art-drop/`.

# D0a Part D: critic 2 redraw

Redrew the 31 failed files from `critic-D-2.json`. All 27 passing files retain their starting hashes; these include STORIES, swatches and the style guide. The canon remains 48 px per cell. The new drawings use native coordinates and the existing palette; only the requested review conversions resize pixels.

The hoard has overlapping cargo, bullion and plate stacks, with fallen cargo and an empty focus in its inset. Doors have connected returns, visible leaves and lock bands; the found secret exposes a passage behind displaced stone. The temple has carved altars, folded bedding, fractured sandstone banks and damage connected to flag joints. The crypt has a clean ring, stone plinths and folded ritual cloth. Tables have plank edges, mortices and trestles; the manor face has darker plaster and timber panels. Lab fittings have service joints and controls, and the spill connects to its tank. The cave's floor is drawn once across the chamber; its mining apparatus and mushroom remain visible at their source positions. Only the added locked door moved, to (1704,1062).

Earlier-part repairs in this round are the four failed cave floor patterns, the manor wall surface, and the rock proof pair. The rock proof includes a local exposed bed and wall-foot wear. The passing ice, crystal and lava proofs and swatches remain unchanged, as requested; their reusable patterns use the same ramps with new geometry. Tools are `d2_materials.py`, `d2_ground.py`, `d2_props.py`, `d2_cave.py`, `d2_scene.py` and `d2_audit.py`.

`D-validation.json` and `D-critic2-redraw-audit.json` record the saved-pixel checks and every surface cell's lone-pixel percentage. Alpha is binary, transparent RGB is zero, palette membership and native dimensions pass, and no opaque black occurs. Surface/prop sheets peak at 12/20 colours. All complete floor patterns have zero one- or two-pixel components; floor spans stay at or below 14.491 L*. Maximum lone-pixel rates are 0.0434% for floor cells, 1.3455% across surface cells, and 0.1736% across rendered surface cells. The four repaired patterns match on opposite edges. All 18 frame companion conversions match exactly, and all 325 source object records retain their coordinates. The ring's tangent runs are monotone and its apex border is one pixel. The manor face averages 27.639 L*.

## Five-second self-check coordinates

Each pair is a native pixel coordinate. Wall top, face, baseline and mass targets remain at the coordinates in the earlier per-frame tables. These coordinates support the drawing-agent recognition check. An independent timed player test remains pending.

| Frame | Open / locked door | Stairs / striped trap | Closed / open chest | Party / red foe | Feature / broken inset |
| --- | --- | --- | --- | --- | --- |
| hoard-keep | (384,324) / (384,240) | (336,240) / (576,432) | (720,198) / (576,552) | (336,225) / (576,232) | (336,960) / (1224,936) |
| breach-temple | (528,186) / (1200,342) | (480,198) / (1296,390) | (816,246) / (576,294) | (1248,184) / (1200,480) | (816,625) / (1272,984) |
| sanctum-crypt | (960,192) / (1296,432) | (1008,198) / (1056,534) | (864,390) / (816,390) | (1008,518) / (1200,228) | (432,336) / (1416,888) |
| cave_rock-plain-21 | (987,174) / (1704,1062) | (1371,552) / (1275,558) | (1464,558) / (1467,606) | (1371,540) / (600,432) | Not a lair |
| manor-ground | (552,276) / (528,678) | (624,288) / (1152,246) | (1440,918) / (912,1014) | (1008,1086) / (1008,231) | Whole yard: (72,600) |
| station_lab | (456,312) / (648,408) | (816,528) / (552,330) | (600,528) / (384,528) | (192,618) / (744,270) | Specimen bay: (660,174) |

Found secret: hoard (648,720). Approach dressing: hoard (498,470), (564,646), (564,763); breach (1053,410), (1050,470), (1046,530), (1004,555), (860,561); sanctum (766,242), (703,251), (632,270), (561,290), (513,344).

I refreshed `d0a-review.png` and the current `D-*.png` sheets; `D-critic2-*.png` contains this round's final details, repeats, master comparisons and squints. I inspected native frames, enlarged details at 2x and 3x, greyscale and quarter-grey views. Independent critic and owner acceptance remain pending. The station still needs the owner's same-game judgement. The prose pass was local. No commit, push, branch change or write outside `art-drop/`.

# D0a Part D: critic 1 redraw

2026-11-21. Redrew or repaired all 48 files failed in `critic-D-1.json`. All nine passing files, including `frames/STORIES.md` and the ice, crystal and lava proof pairs, retain their starting SHA-256 hashes. No `operator-D.md` was present. The canon remains 48 px per cell; the palette is unchanged.

The hoard contains overlapping bullion, cargo chests, plate stacks, a shield and an urn. The rift has split sandstone banks, overhanging fragments and an ember interior of varying width. The sanctum has a stepped circular inlay and inscribed stone sockets. Each lair has distinct approach dressing through its route. Doors have returns and thresholds for their direction of travel; the found secret uses displaced masonry. Mining supports replace the mistaken weapon racks at all five source positions, and wider stair treads remain visible beside the cave party. Lab benches, storage and a connected specimen work area replace the domestic furniture. Furniture repairs include a larger masonry hearth, book arrangements, cloth folds, stone effigies and brighter chest bodies.

Authorized changes to earlier parts: repaired the keep, temple, crypt, rock-cave and sewer proofs and their grey copies; seven failed swatches and their exact style-guide inserts; the mushroom study; cave floor patterns and sewer banks. The manor frame's wall surface has plaster over timber wainscot. The ice, crystal and lava proofs remain unchanged as requested, while their failed reusable floor patterns have matching boundaries. These are D0a-D.1 drawing repairs; they do not change the cell size or palette. Existing Part B crate, chest, column, door and table files remain unchanged; D uses its own brighter chest sprite.

`tools/d_redraw_materials.py`, `d_redraw_props.py` and `d_redraw_scene.py` reproduce the native drawings in that order. Pixels are drawn directly or copied 1:1. Only review companions are enlarged or reduced. `frames/layout.json` retains original source IDs and coordinates alongside replacement sprite names. Regenerated the companions, `d0a-review.png`, and the `D-*.png` review sheets under `art-drop/review-d0a/`.

Pixel checks pass in `D-validation.json` and `D-redraw-audit.json`: binary alpha, zero transparent RGB, palette membership, no opaque black, dimensions, colour caps, exact companions and source-object coordinates. Surface sheets use at most 12 colours and prop sheets at most 20. The largest floor span is 14.491 L*. Every complete floor has zero one- or two-pixel components; all 504 floor cells have 0% lone pixels. The highest surface-tile rate is 1.3455%, in the unchanged hydroponics wall. The highest rendered surface-cell rate is 0.1736%, in the cave. Both remain below 3%. Every tile's percentage is retained in the reports. The four repaired cave patterns match on both pairs of opposite edges. The guide is unchanged outside the authorized inserts.

## Five-second self-check targets

Native pixel coordinates follow. These are visual self-review targets, not an independent timed player test. The earlier per-frame tables below still locate each wall top, face, baseline and mass; the approach coordinates in this section supersede the earlier lists. I checked the changed drawings at native and nearest-neighbour scales, in grey and in quarter-grey views against the master at its registered art-pixel scale. Independent critic and owner acceptance remain pending.

| Frame | Open / locked door | Stairs / trap | Closed / open chest | Party / red foe | Feature / broken inset |
| --- | --- | --- | --- | --- | --- |
| hoard-keep | (384,324) / (384,240) | (336,240) / (576,432) | (720,198) / (576,552) | (336,225) / (576,232) | (336,960) / (1224,936) |
| breach-temple | (528,186) / (1200,342) | (480,198) / (1296,390) | (816,246) / (576,294) | (1248,184) / (1200,480) | (816,625) / (1272,984) |
| sanctum-crypt | (960,192) / (1296,432) | (1008,198) / (1056,534) | (864,390) / (816,390) | (1008,518) / (1200,228) | (432,336) / (1416,888) |
| cave_rock-plain-21 | (987,174) / (1707,942) | (1371,552) / (1275,558) | (1464,558) / (1467,606) | (1371,540) / (600,432) | Not a lair |
| manor-ground | (552,276) / (528,678) | (624,288) / (1152,246) | (1440,918) / (912,1014) | (1008,1086) / (1008,231) | Yard: (72,600) |
| station_lab | (456,312) / (648,408) | (816,528) / (552,330) | (600,528) / (384,528) | (192,618) / (744,270) | Specimen bay: (660,174) |

Found secret: hoard (648,720). Hoard approach: (498,470), (564,646), (564,763), with intact/ruined storage at (504,454) and (563,745). Breach approach: (1053,410), (1050,470), (1046,530), (1004,555), (860,561). Sanctum approach: (766,242), (703,251), (632,270), (561,290), (513,344).

All writes stayed under `art-drop/`. No commit, push or branch change. The prose pass and visual review were performed locally without delegation.

# D0a Part D

2026-11-21. Six mood frames are in `frames/`, each with an exact nearest-neighbour `-2x` copy, a `-grey` copy and a quarter-size greyscale `-squint` review copy. `frames/STORIES.md` gives three story lines per frame. `d0a-review.png` places all six native frames side by side above the 14 proofs.

The cell remains **48 × 48 art pixels**. I drew the new pixels with explicit rectangles, stepped paths and selected clusters in `tools/d_surfaces.py`, `d_sprites.py` and `d_frames.py`. Existing Part B/C pixels are copied at 1:1. No image-tool output, spatial reduction, random texture, filters, glow or soft alpha enters the art. Enlargements repeat pixels; only the greyscale squints reduce an image.

`tools/d_layouts.py` transcribes the five reference grids as room outlines, internal wall holes and object coordinates. The conversion is from 64 px grid landmarks to 48 px geometry; it never samples reference image pixels. `frames/layout.json` records every placed object's source coordinate and native bounds. The cave gets a 48 px margin on all sides to retain the full upper wall. Its recorded coordinates include that margin. The lab uses the brief's 20 × 16 fallback, with an office, corridor and specimen bay. The manor retains its outer wall and at least a cell of visible yard. Existing overworld reference crops are reused.

The required Part C repairs are back-ported to the colour/grey proofs and material studies for **keep, temple, crypt, cave_rock, cave_ice, cave_crystal, cave_lava and dungeon_sewer**, and their eight style-guide inserts. Built floors have flag joints and connected edge wear. Cave floors have broad ground planes, exposed shelves and fractures. The temple floor is warm sandstone. The sewer has wet flags and a water channel. Keep, temple, crypt and sewer caps have joints and lit front lips. The lava crucible is squat and has no handle; an ember channel crosses its proof floor. The palette, cell size, accepted B props and other earlier deliverables are preserved.

Reusable native pieces are in `canon/surfaces/` and `canon/props/d-*.png`; the `*-study.png` props copy the accepted C pieces except for the requested crucible redraw. The lab frame uses clean tiles with one placed spill, so the study's spill does not repeat across the room. Party and foe markers retain the reference's simple silhouette as the existing character-art exception. Doors have a dark opening, lintel and lit threshold; lock plates and the found secret's displaced masonry distinguish their states.

`tools/d_review.py` passes alpha, palette, dimensions, sheet colour caps, floor components, value spans, lone-pixel limits, companion-export equivalence and placement-manifest checks. All checked art has alpha 0/255, zero RGB under transparency and no opaque black. Combined wall/floor colours peak at 12; prop sheets stay below 48. Frames and the contact sheet combine separately limited sheets and are scene images. Greyscale copies and unchanged reference inserts are exempt from palette membership. Squints are exempt from native-size rules.

All 14 complete floor sheets have zero one- or two-pixel colour components and zero lone pixels. The largest floor span is 14.491 L*. The largest lone-pixel rate among the 504 individual 48 px floor crops is 0.0434%, where an ice fracture crosses a crop boundary. Full per-cell measurements are in `art-drop/review-d0a/D-validation.json`.

| Look | Floor span, L* | Floor lone pixels | Wall lone pixels |
| --- | ---: | ---: | ---: |
| keep | 14.182 | 0.0000% | 0.0000% |
| temple | 13.742 | 0.0000% | 0.0000% |
| manor | 11.061 | 0.0000% | 0.0000% |
| crypt | 11.203 | 0.0000% | 0.0000% |
| cave_rock | 14.474 | 0.0000% | 0.0000% |
| cave_ice | 13.800 | 0.0000% | 0.0000% |
| cave_crystal | 11.718 | 0.0000% | 0.0000% |
| cave_lava | 11.689 | 0.0000% | 0.0000% |
| dungeon_sewer | 12.599 | 0.0000% | 0.0000% |
| station_corridor | 8.420 | 0.0000% | 0.0000% |
| station_lab | 12.654 | 0.0000% | 0.0000% |
| station_engine | 14.491 | 0.0000% | 0.0506% |
| station_hydro | 6.631 | 0.0000% | 0.2242% |
| yard | 12.140 | 0.0000% | 0.0000% |

Review sheets, native crops, master comparisons and scratch layers are under `art-drop/review-d0a/D-*.png`. The master comparison reads one exact 2 × 2 source block per master art pixel; native and enlarged views use equal art-pixel scales. I reviewed native scenes, enlarged prop and surface crops, greyscale views and squints. The wall mass, door openings, loot bands, traps and feature highlights remain distinct in greyscale. The inspections caught party markers hidden by stairs, repeated lab spills, grass inside manor wall mass and lone pixels along curved wall faces. These are repaired. Wall courses use world-aligned rows; native stepped base lines connect the curves. The worst rendered 48 px surface cell contains 0.2170% lone pixels, below the 3% limit. The checklists below are drawing-agent findability checks, not an independent timed player test. Independent critic and owner acceptance remain pending.

## Five-second checklist coordinates

Coordinates are `(x, y)` in each native frame, measured from its top-left. Object coordinates indicate the original cell centre or the visible feature focus. Insets use their top-left corner. These lists also identify the additions needed where a source map lacked a required state example.

### hoard-keep

Native size: 1440 × 1104 px.

| Find | Native coordinates |
| --- | --- |
| Wall top | (480, 108) |
| Wall face | (480, 144) |
| One-pixel base line | (480, 167) |
| Mass beyond the wall | (480, 80) |
| Open door | (384, 324) |
| Locked door | (384, 240) |
| Stairs | (336, 240) |
| Found striped trap | (576, 432) |
| Closed chest | (720, 198) |
| Opened chest | (576, 552) |
| Party | (336, 225) |
| Foe in red | (576, 232) |
| Found secret door | (648, 720) |
| Lair feature | (336, 960) |
| Broken-state inset | (1224, 936) |
| Approach dressing | (504, 468), (576, 648), (576, 768), (384, 816) |

### breach-temple

Native size: 1488 × 1152 px.

| Find | Native coordinates |
| --- | --- |
| Wall top | (600, 65) |
| Wall face | (600, 100) |
| One-pixel base line | (600, 125) |
| Mass beyond the wall | (600, 40) |
| Open door | (528, 186) |
| Locked door | (1200, 342) |
| Stairs | (480, 198) |
| Found striped trap | (1296, 390) |
| Closed chest | (816, 246) |
| Opened chest | (576, 294) |
| Party | (1248, 184) |
| Foe in red | (1200, 480) |
| Lair feature | (816, 625) |
| Broken-state inset | (1272, 984) |
| Approach dressing | (1056, 414), (1056, 486), (1056, 546), (1008, 558), (864, 564) |

### sanctum-crypt

Native size: 1632 × 1056 px.

| Find | Native coordinates |
| --- | --- |
| Wall top | (610, 105) |
| Wall face | (610, 145) |
| One-pixel base line | (610, 167) |
| Mass beyond the wall | (610, 80) |
| Open door | (960, 192) |
| Locked door | (1296, 432) |
| Stairs | (1008, 198) |
| Found striped trap | (1056, 534) |
| Closed chest | (864, 390) |
| Opened chest | (816, 390) |
| Party | (1008, 518) |
| Foe in red | (1200, 228) |
| Lair feature | (432, 336) |
| Broken-state inset | (1416, 888) |
| Approach dressing | (624, 240), (672, 240), (720, 240), (768, 240) |

### cave_rock-plain-21

Native size: 1968 × 1392 px.

| Find | Native coordinates |
| --- | --- |
| Wall top | (650, 45) |
| Wall face | (650, 80) |
| One-pixel base line | (650, 107) |
| Mass beyond the wall | (650, 20) |
| Open door | (987, 174) |
| Locked door | (1707, 942) |
| Stairs | (1371, 552) |
| Found striped trap | (1275, 558) |
| Closed chest | (1464, 558) |
| Opened chest | (1467, 606) |
| Party | (1371, 540) |
| Foe in red | (600, 432) |

### manor-ground

Native size: 1968 × 1248 px.

| Find | Native coordinates |
| --- | --- |
| Wall top | (600, 205) |
| Wall face | (600, 240) |
| One-pixel base line | (600, 263) |
| Mass beyond the wall | (600, 170) |
| Open door | (552, 276) |
| Locked door | (528, 678) |
| Stairs | (624, 288) |
| Found striped trap | (1152, 246) |
| Closed chest | (1440, 918) |
| Opened chest | (912, 1014) |
| Party | (1008, 1086) |
| Foe in red | (1008, 231) |
| Yard and front approach | (72, 600), (1008, 1180) |

### station_lab

Native size: 960 × 768 px.

| Find | Native coordinates |
| --- | --- |
| Wall top | (500, 35) |
| Wall face | (500, 70) |
| One-pixel base line | (500, 95) |
| Mass beyond the wall | (500, 12) |
| Open door | (456, 312) |
| Locked door | (648, 408) |
| Stairs | (816, 528) |
| Found striped trap | (552, 330) |
| Closed chest | (600, 528) |
| Opened chest | (384, 528) |
| Party | (192, 618) |
| Foe in red | (744, 270) |
| Specimen bay / office / spill | (660, 174), (240, 210), (638, 251) |

No commit, push or branch change. Work stayed under `art-drop/`. The repository install/build workflow was not run for this art-only task, which forbids writes elsewhere. The prose pass used the vendored declauding lint and a local newcomer read; it was not independent.

# D0a Part C: critic 23 redraw

2026-11-21: repaired all nine files listed by critic 23. The rock and crystal walls have connected planes, branching fractures and chipped ledges. Removed the enclosed lozenges and repeated interior marks. Yard cobbles continue across the vertical wrap, with a shaped turf return across the horizontal wrap. Cave floors, props and the angular crystal inclusion are unchanged.

Canon delta authorized by critic 23: refreshed the rock and crystal studies and only their two style-guide inserts. All 73 protected files match their starting hashes. The yard wall, palette and 48 px cell size are unchanged. Repairs use explicit native pixel coordinates; the existing image-tool studies supplied visual references. No fractional-grid readings, spatial reduction or filters enter the deliverables.

`tools/check_critic23_redraw.py` and the palette check pass. All 14 proofs pass alpha, palette, colour caps, value ladder, baseline and exact-grey checks. Surface/prop counts peak at 12/12; floor contrast peaks at 14.592 L*. Every floor has zero one- or two-pixel colour components. Surface lone pixels are 0% for every look except the unchanged station_engine (0.03376%) and station_hydro (0.14950%). Per-tile measurements and preservation checks are in `art-drop/review-d0a/C23-redraw-validation.json`.

Regenerated current `C-*.png` sheets and all 14 floor repeats. Viewed proofs and repaired studies at 1x, 2x and 3x nearest-neighbour, in greyscale and quarter-size grey squints; checked master comparisons and both yard wrap directions. Self-review found no remaining blocker; independent critic and owner acceptance are pending. No commit, push or branch change.

# D0a Part C: critic 22 redraw

2026-11-21: repaired the five failed proof pairs: cave_rock, cave_ice, cave_crystal, cave_lava and yard. Rock walls have smaller strata and connected clefts; ice has unequal facets, branching fractures and frost deposits; crystal has embedded prisms and an exposed mineral bed; basalt has fractured planes, ember seams and a finite channel with broken banks. Open mud contours replace the rimmed token. The yard uses the supplied native turf and cobble geometry, with worn path edges.

All proofs remain 144 × 144 at the unchanged 48 px canon. Cave surfaces and the path use explicit native coordinates in `tools/redraw_critic22.py`; turf and cobbles use one source pixel per art pixel from the existing overworld crops. Palette mapping and the explicit strokes in `tools/c22_pixel_cleanup.py` finish the edges. No generated-source read-back, spatial reduction, random texture or filters enter the art. This follows the current prompt's pixel-pencil option; the archived operator's fractional-grid method conflicts with that prompt.

Canon delta, authorized by critic 22: rebuilt `canon/swatches/{cave_rock,cave_ice,cave_crystal,cave_lava,building-yard}.png` and only their five `style-guide.png` inserts. All 139 protected files match their starting hashes. The nine passing proof pairs, every prop, ice floor, yard wall, palette and cell-size definition remain unchanged.

`tools/check_critic22_redraw.py` and the palette check pass. Maximum surface/prop counts are 12/12; floor contrast peaks at 14.592 L*. Minimum main-body/outline gaps are 10.816/17.886 L*. Every floor has zero one- or two-pixel colour components. Alpha, own-look palette membership, dimensions, baselines and exact greyscale copies pass. Surface lone-pixel percentages (no same-colour four-neighbour, props excluded):

| Look | Lone pixels |
| --- | ---: |
| keep | 0% |
| temple | 0% |
| manor | 0% |
| crypt | 0% |
| cave_rock | 0% |
| cave_ice | 0% |
| cave_crystal | 0% |
| cave_lava | 0% |
| dungeon_sewer | 0% |
| station_corridor | 0% |
| station_lab | 0% |
| station_engine | 0.03376% |
| station_hydro | 0.14950% |
| yard | 0% |

Refreshed current `C-*.png` reviews and all fourteen `proof-3x3repeat-<look>.png` files under `art-drop/review-d0a/`. Viewed saved proofs and studies at 1x, 2x and 3x nearest-neighbour, greyscale and quarter-size grey squints; compared with the master stone crop at equal art-pixel scale and checked floor repeats. `C22-redraw-validation.json` includes complete-proof percentages and preservation results; `C22-final-<look>.png` holds the final views. Historical critic/source snapshots remain evidence. This is self-review; independent critic and owner acceptance remain pending. All writes stayed under `art-drop/`; no commit, push or branch change.

# D0a Part C: critic 21 redraw

2026-11-21: redrew the nine failed proof pairs at native 144 × 144, using explicit pixel coordinates in `tools/redraw_critic21.py`. Replaced the fractional-grid imports with authored slab wear, marble veins, cave ledges, mineral facets, ember clefts and floor cracks. Ice and lava floor features terminate inside the pattern. Sewer damp is localized; yard turf and cobbles have shaped material edges. The repaired art contains no generated-source pixels, scale changes, filters or random texture.

Canon change: rebuilt `canon/swatches/{cave_rock,cave_ice,cave_crystal,cave_lava,building-yard}.png` and only their five `style-guide.png` inserts. The 48 px cell and palette remain unchanged. All 129 protected files match their starting hashes. Manor, stations, props and passing studies remain unchanged. Keep, temple, crypt and sewer retain their accepted wall pixels. This repair uses the current request's native pixel-pencil option; the older operator allowance for fractional read-back does not meet that rule.

`tools/check_critic21_redraw.py` passes all fourteen proof pairs, the five replacement studies and the guide's authored pixels. Surface/prop colour counts peak at 12/12; floor contrast peaks at 14.592 L*. Minimum body/outline gaps are 10.816/17.886 L*. Alpha, palette, cell sizes, baselines and exact grey copies pass. Every floor has zero one- or two-pixel components. Surface lone-pixel percentages, excluding props:

| Look | Lone pixels |
| --- | ---: |
| keep | 0% |
| temple | 0% |
| manor | 0% |
| crypt | 0% |
| cave_rock | 0% |
| cave_ice | 0% |
| cave_crystal | 0% |
| cave_lava | 0% |
| dungeon_sewer | 0% |
| station_corridor | 0% |
| station_lab | 0% |
| station_engine | 0.03376% |
| station_hydro | 0.14950% |
| yard | 0% |

Regenerated current `C-*.png` proof, floor-repeat, canon and guide views, plus all fourteen `proof-3x3repeat-<look>.png` images. Viewed the proofs and changed studies at 1x, 2x and 3x nearest-neighbour, in grey and quarter-size grey squints, with master comparisons at equal art-pixel scale. Results are in `art-drop/review-d0a/C21-redraw-validation.json`. Historical critic/source snapshots remain review evidence. This is self-review; independent critic and owner acceptance remain pending.

Palette validation passes. The old Part B checker stops on obsolete crate geometry; the C3 canon checker flags small components in the frozen station_engine and station_hydro studies. Those accepted files remain unchanged. The repair checker separately verifies the changed studies, exact guide inserts and guide preservation outside them. The note received prose lint and my own newcomer read. All writes stayed under `art-drop/`; no commit, push or branch change.

# D0a Part C

2026-11-21, operator round 4 / C21. Replaced the four cave and yard proof pairs, and the keep, temple, crypt and sewer floors. All fourteen colour proofs and greyscale copies remain 144 × 144 at the existing 48 px canon. The five accepted building/sewer walls, four station pairs and every prop are preserved. Refreshed the five failed cave/yard studies and their style-guide inserts as authorized by critic 20 and the operator. Canon delta: those study images only; palette and cell size remain D0a-C.2.

Used the built-in image tool for nineteen fresh sources: three variants each for cave_rock, cave_ice, cave_crystal, cave_lava and yard, plus four floor sources. Exact prompts and source PNGs are in `art-drop/review-d0a/C21-prompts.json` and `C21-sources/`. Selected variants have distinct rock masses and ledges, ice rims, embedded crystal facets, ember-lit basalt clefts, and stone courses. The floor sources supply worn flagstones, branched marble veins, damp brick, rocks and fissures. The yard uses native 48 × 48 crops from the supplied overworld grass at (48,96) and street at (64,72), palette-mapped one pixel to one pixel. Its path and walls come from yard-2.

Followed the operator's Round 3 tolerant block read-back, retained by Round 4. Detected a common square-grid pitch from edge histograms in both axes; each block supplies its dominant colour cluster within ±8 RGB. These are estimated grids, not exact integer 2×2 source grids. Palette locking removes source shading. Whole-pixel crops and shifts fit the bands; missing margins continue adjacent planes. Cleanup merges one- and two-pixel fragments, removes unwanted rock-floor blotches, restores the baseline and cell joints, and closes the lava channel inside the proof period. Code adds no texture, random marks, spatial resampling, gradients or filters. Nearest-neighbour scale changes occur only in review images.

| Selected source | Detected pitch, image px | Blocks with at least 75% dominant-cluster coverage |
| --- | ---: | ---: |
| cave_rock-3 | 8.74 | 91.05% |
| cave_ice-1 | 8.70 | 93.24% |
| cave_crystal-2 | 8.70 | 92.39% |
| cave_lava-2 | 8.04 | 90.76% |
| yard-2 | 9.80 | 92.88% |
| keep-floor | 11.52 | 94.26% |
| temple-floor | 11.76 | 90.51% |
| crypt-floor | 10.48 | 92.66% |
| dungeon_sewer-floor | 9.12 | 90.40% |

Changed nine `proof/<look>.png` / `-grey.png` pairs, `canon/swatches/{cave_rock,cave_ice,cave_crystal,cave_lava,building-yard}.png`, and `canon/style-guide.png`. Added `tools/read_c21.py`, `assemble_c21.py`, `finish_c21.py` and `review_c21.py`. Sources, intermediate layers, cleanup coordinates, registrations and validation reports stay in `art-drop/review-d0a/`. The earlier `proof/UNRESOLVED.md` remains a historical pre-redraw record; this entry describes the current files.

Saved-pixel validation passes for all fourteen proofs and five refreshed studies: binary alpha, zero RGB under transparency, active own-look palette membership, non-black outlines, dimensions, colour caps, exact greyscale copies, one-pixel face baselines, value ordering, floor clusters and local prop separation. Maximum surface/prop counts are 12/12, below the 32/48 caps. Floor contrast peaks at 14.59 L*. Minimum main-body and outline gaps are 10.82 and 14.55 L*. Every visible floor has zero one- or two-pixel colour components. Palette validation also passes.

Lone pixels have no same-colour four-neighbour. Surface measurements exclude the separate prop; complete-proof measurements include it. Every floor has 0.00000% lone pixels.

| Look | Surface lone pixels | Complete proof lone pixels | Floor contrast L* |
| --- | ---: | ---: | ---: |
| keep | 0.00000% | 0.06752% | 14.18 |
| temple | 0.00000% | 0.00000% | 12.73 |
| manor | 0.00000% | 0.02894% | 11.06 |
| crypt | 0.00000% | 0.00482% | 11.20 |
| cave_rock | 0.00000% | 0.37616% | 9.80 |
| cave_ice | 0.00000% | 0.06752% | 14.59 |
| cave_crystal | 0.00000% | 0.25077% | 11.72 |
| cave_lava | 0.00000% | 0.11574% | 9.58 |
| dungeon_sewer | 0.00000% | 0.00482% | 12.16 |
| station_corridor | 0.00000% | 0.00000% | 8.42 |
| station_lab | 0.00000% | 0.21219% | 12.65 |
| station_engine | 0.03376% | 0.18326% | 14.49 |
| station_hydro | 0.14950% | 0.37616% | 6.63 |
| yard | 0.00000% | 0.00482% | 12.14 |

Viewed every saved proof at 1x, 2x and 3x nearest-neighbour, in greyscale and as a quarter-size greyscale squint. Viewed the five replacement studies and guide inserts at the same review scales. Compared against the master with our 2x art beside its stored 1x pixels. Reviewed all fourteen `proof-3x3repeat-<look>.png` floor diagnostics. These repeat the proof strips; they are not the later 6×6 production patterns. No duplicate source feature was stamped inside a proof strip.

Current review sheets are `C-<look>-review.png`, `C-<look>-grey.png`, `C-op2-<look>.png` and `C-contact-*.png`; larger review groups are `C21-all-3x-*`, `C21-repeat-*` and `C21-studies.png`. `C21-validation.json` records the checks. All 60 frozen files retain their starting hashes; the four edited building/sewer proof pairs retain their original wall rows. The entire manor pair is frozen. A guide comparison found 7,894 changed pixels, all inside the five authorized inserts.

This was the drawing agent's self-review; owner acceptance remains pending. The log received the prose lint and a self-read. No commit, push or branch change. Project writes stayed under `art-drop/`.

# D0a Part C: critic 19 redraw

2026-11-21: redrew all ten failed natural-look proof pairs at native 144 × 144. Refreshed the nine failed studies, their style-guide inserts and the keep DO sample. The four station pairs, props, shadows, palette, STYLE.md and passing studies remain unchanged; 126 files match their starting hashes.

The redraws add chipped masonry lips and recessed returns, joined timber and parquet boards, broad cave facets, embedded mineral seams, shaped snow and lava banks, and turf/cobble edges. The C12 variants and a new built-in image-tool candidate served as shape references. Final pixels use the current request's native pixel-pencil option in `tools/repair_c19.py`; no generated pixels, resampling, random texture or filters enter the deliverables. Candidate images, prompt and trial read-backs remain in the review directory.

`tools/finish_c19.py` passes all fourteen proofs and nine replacement studies: binary alpha, transparent RGB, active own-look palettes, colour caps, dimensions, baseline, greyscale copies, floor clusters, value ladder and prop separation. Palette validation passes. Surface/prop counts peak at 12/12; floor contrast peaks at 14.59 L*. Every visible floor has zero one- or two-pixel components. All ten redrawn surfaces have 0.0000% lone pixels. Unchanged station surfaces: corridor 0.0000%, lab 0.0000%, engine 0.0338%, hydro 0.1495%. Per-tile surface and complete-proof percentages are in `art-drop/review-d0a/C19-validation.json`.

Viewed the saved art at 1x, 2x and 3x nearest-neighbour, greyscale and quarter-size squint, plus master comparisons and all fourteen floor repeats. Refreshed current `C-*.png` sheets under `art-drop/review-d0a/`. The broader canon checker still flags small decorative components in the unchanged engine/hydro studies accepted by critic 19. This is self-review; independent critic and owner acceptance remain pending. No commit, push or branch change.

# D0a Part C: critic 18 redraw

2026-11-21: redrew the ten failed natural-look proof pairs at native 48 px per cell (144 × 144). Refreshed the nine failed material studies, their style-guide inserts and the keep DO sample. The four station pairs, all props and shadows, palette, STYLE.md and passing studies remain unchanged; 114 files match their starting hashes.

`tools/redraw_c18.py` draws the surfaces with explicit integer-coordinate rectangles and stepped paths. The earlier image-tool compositions served as visual references. No imported surface pixels enter these redraws. This follows the current request's native-authoring condition instead of the archived operator ruling that allowed fractional-grid read-back. Temple has continuous mortar recesses; crypt has straight cell joints and one finite chip; the cave fractures have connected edges. Lava retains its channel and ember marks. The yard has shaped cobble planes and a compact turf clump. Manor retains plaster, timber and parquet.

All fourteen proofs and nine replacement studies pass `tools/finish_c18.py`; palette validation also passes. Checks cover binary alpha, transparent RGB, active own-look ramps, colour caps, dimensions, base lines, exact greyscale copies, floor clusters and values. Surface/prop counts peak at 12/12; floor contrast peaks at 14.59 L*. Minimum body/outline gaps are 10.82/18.36 L*. Every visible floor has zero one- or two-pixel colour components. Studies contain 5–8 colours. Lone pixels have no same-colour four-neighbour; percentages use the whole named region:

| Look | Surface lone pixels | Whole proof lone pixels |
| --- | ---: | ---: |
| keep | 0.0000% | 0.0675% |
| temple | 0.0000% | 0.0000% |
| manor | 0.0000% | 0.0289% |
| crypt | 0.0000% | 0.0048% |
| cave_rock | 0.0000% | 0.3665% |
| cave_ice | 0.0000% | 0.0627% |
| cave_crystal | 0.0000% | 0.2459% |
| cave_lava | 0.0000% | 0.1157% |
| dungeon_sewer | 0.0000% | 0.0048% |
| station_corridor | 0.0000% | 0.0000% |
| station_lab | 0.0000% | 0.2122% |
| station_engine | 0.0338% | 0.1833% |
| station_hydro | 0.1495% | 0.3762% |
| yard | 0.0000% | 0.0000% |

Reviewed the saved proofs and affected studies at 1x, 2x and 3x nearest-neighbour, greyscale and quarter-size greyscale squints. Reviewed all floor repeats, the updated guide inserts and master comparisons at equal art-pixel scale. Current `C-*.png` review sheets and all `proof-3x3repeat-<look>.png` diagnostics are refreshed under `art-drop/review-d0a/`. Measurements and preservation results are in `C18-validation.json`. This is the drawing agent's self-review; independent critic and owner acceptance remain pending. The new log section received the prose lint and self-read. No commit, push or branch change.

# D0a Part C: critic 17 redraw

2026-11-21: repaired the ten failed natural-look proof pairs and nine failed material studies. Refreshed their style-guide inserts and the keep DO example. All fourteen pairs remain 144 × 144 at the existing 48 px canon. The four station pairs, canon props, shadows, palette and passing studies retain their starting contents; 122 frozen files match their initial hashes.

Generated ten new image-tool sources, then used the operator's Round 3 tolerant registered-grid read-back. These sources have estimated fractional grids, not exact integer 2×2 grids; the operator's result-based instruction takes precedence over critic 17's method objection. The earlier manor parquet source supplies its floor. Whole-pixel assembly, palette locking and contour cleanup repair the capstones, courses, timber joints, cave fractures, marble veins, lava banks and turf/paving transition. Native strokes reconnect broken highlights and crystal facets. Snow and lava now close inside the floor period. The nine replacement studies contain 5–9 colours and use the repaired materials. No palette or cell-size change was needed.

C17 validation passes for all fourteen proofs and the nine replacement studies: binary alpha, transparent RGB, active own-look ramps, colour caps, dimensions, baseline, greyscale copies, floor clusters and the value ladder. Surface/prop counts peak at 12/12; floor contrast peaks at 14.59 L*. Minimum body/outline gaps are 10.82/18.36 L*. Every visible floor has zero lone pixels and zero one- or two-pixel colour components. Same-colour four-neighbour counts follow:

| Look | Surface lone pixels | Whole proof lone pixels |
| --- | ---: | ---: |
| keep | 0.0000% | 0.0675% |
| temple | 0.0000% | 0.0000% |
| manor | 0.0000% | 0.0289% |
| crypt | 0.0000% | 0.0096% |
| cave_rock | 0.0000% | 0.3665% |
| cave_ice | 0.0000% | 0.0627% |
| cave_crystal | 0.0000% | 0.2459% |
| cave_lava | 0.0000% | 0.1157% |
| dungeon_sewer | 0.0000% | 0.0048% |
| station_corridor | 0.0000% | 0.0000% |
| station_lab | 0.0000% | 0.2122% |
| station_engine | 0.0338% | 0.1833% |
| station_hydro | 0.1495% | 0.3762% |
| yard | 0.0000% | 0.0096% |

Viewed saved proofs and studies at 1x, 2x and 3x nearest-neighbour, in greyscale and quarter-size squints, with equal-art-scale master comparisons and 3x3 floor repeats. Current `C-*.png` sheets are refreshed. Sources, prompts, registration data, assemblies and checks are in `art-drop/review-d0a/C17-*`; `C17-validation.json` records the measurements. The broader legacy canon checker flags small decorative components in the unchanged station_engine and station_hydro studies, which critic 17 passed. Those raw warnings remain recorded in `C-canon-validation.json`.

Added `tools/repair_c17.py` and `tools/finish_c17.py`. This was the drawing agent's review; owner acceptance remains pending. No commit, push or branch change. The log received the repository prose pass and a self-read.

# D0a Part C

2026-11-21, operator round 3 / C16: replaced the ten rejected natural-look proof pairs. All fourteen colour proofs and greyscale copies are present at 144 × 144, with the canon cell still 48 px. The four station pairs, every prop, shadow masks, palette, material studies and style guide retain their starting contents. Hash checks cover 63 frozen files. The earlier A/B corrections were already present; this round makes no canon changes.

Used the operator's tolerant grid read-back method. Reviewed the three C12 variants for each look and the later keep candidates. Selected C12 keep-1, manor-3, crypt-2, cave_rock-1, cave_ice-1, cave_crystal-1, cave_lava-1 and dungeon_sewer-1. Yard walls use yard-3. Two new built-in image-tool sources replace the temple candidate and yard floor: temple loses the repeated diagonal marble bands; yard gets calm turf/path fill, one retained grass tuft, pebbles and cobbles. Exact new prompts are in `art-drop/review-d0a/C16-prompts.json`; earlier prompts remain in `C12-prompts.json`.

Each detected source block supplies one art pixel from its dominant colour cluster (±8 RGB tolerance). Selected sources have 84.90–97.48% of blocks with at least 75% cluster coverage. `C16-registration.json` records the source, pitch, phase and coverage. Palette locking removes source shading. Whole-pixel crops and shifts fit the bands; calm infill closes missing margins. Structural repairs align the cell divisions and baseline. Cleanup merges fragments into adjacent clusters, straightens the broken rock fissure, removes cave-floor dividers and deletes excess mud/crystal highlights. The existing props are composited at their original positions. No spatial resizing or filtering enters a deliverable; nearest-neighbour scale changes occur only in review images.

Changed `proof/{keep,temple,manor,crypt,cave_rock,cave_ice,cave_crystal,cave_lava,dungeon_sewer,yard}.png` and their `-grey.png` copies. Added `tools/import_c16.py` and `tools/finish_c16.py`. The scripts use the local review sources and layers. All source images, intermediate assemblies, measurement reports and review sheets stay under `art-drop/review-d0a/`.

Validation passes for dimensions, binary alpha, zero RGB under transparency, active own-look ramps, non-black outlines, colour caps, floor clusters, the one-pixel baseline, greyscale copies, composition and the value ladder. Maximum surface/prop colour counts are 12/12, against caps of 32/48. Maximum floor contrast is 14.59 L*. Minimum local prop-body contrast is 10.82 L*; minimum outline contrast is 14.55 L*. Every floor has zero one- or two-pixel colour components. Palette validation also passes. `C16-validation.json` contains the per-look results. The obsolete eight-pixel flat-fill ceiling is excluded, as previous critic rulings require; calm fill must not trigger added texture.

Lone pixels are counted by same-colour four-neighbour connectivity. The surface column excludes the prop; the complete proof column includes it. Every floor has 0.0000% lone pixels.

| Look | Surface lone pixels | Complete proof lone pixels |
| --- | ---: | ---: |
| keep | 0.0000% | 0.0675% |
| temple | 0.0000% | 0.0000% |
| manor | 0.0000% | 0.0289% |
| crypt | 0.0000% | 0.0048% |
| cave_rock | 0.0000% | 0.3665% |
| cave_ice | 0.0000% | 0.0627% |
| cave_crystal | 0.0000% | 0.2459% |
| cave_lava | 0.0000% | 0.1157% |
| dungeon_sewer | 0.0000% | 0.0096% |
| station_corridor | 0.0000% | 0.0000% |
| station_lab | 0.0000% | 0.2122% |
| station_engine | 0.0338% | 0.1833% |
| station_hydro | 0.1495% | 0.3762% |
| yard | 0.0000% | 0.0048% |

Self-review covered every proof at 1x, 2x and 3x nearest-neighbour, greyscale and quarter-size greyscale squint. Reviewed the floor repeats and comparisons against the master's art-pixel scale. `C-<look>-review.png` contains those scales and the master crops; `C-op2-<look>.png` places the proof at 2x beside a master PNG crop at its stored 1x. `proof-3x3repeat-<look>.png` repeats the actual 144 × 48 floor strip three times in each direction; these proofs are not the later production patterns. The final pass removed excess rock/crystal floor highlights and restored quiet yard path margins. Mass, wall, floor and props remain distinguishable in greyscale and squint.

The drawing agent performed the visual review; owner acceptance remains pending. The notes received the repository prose pass and a self-read. No commit, push or branch change. Project writes stayed under `art-drop/`.

# D0a Part C: critic 15 redraw

2026-11-21: **unfinished; all 30 failed files remain unresolved.** Generated three new keep variants with the built-in image tool, including one request for a 96 px native cell. All returned 1254 × 1254 sources with smooth shading and uneven block boundaries. Rejected them before import. No artwork changed; passing files and the 48 px canon remain intact. The other nine looks received no new variants in this run; C12 contains three candidates per look.

Prompts, sources and measurements are in `art-drop/review-d0a/C15-prompts.json`, `C15-sources/` and `C15-grid-validation.json`. At the estimated grids, 0–0.14349% of blocks have an exact colour mode covering 75%. Allowing three RGB levels of variation raises coverage to 80.16–92.09%, but source inspection still shows gradients and softened boundaries. The larger-cell request did not produce a usable native grid. No candidate was palette-locked or resampled into art.

Added `tools/review_c15.py` and regenerated the `C-*.png` sheets and all fourteen floor repeats. `C15-current-validation.json` records passing numerical checks and each look's lone-pixel percentage: surfaces range from 0% to 0.14950%, and every floor has 0%. The palette audit passes. Viewed the current 2x contact sheet and new sources, including the larger-cell candidate's native, 2x, 3x, grey and squint crops. The drawing failures remain; a full final-art visual acceptance pass was not completed.

Asked whether native pixel drawing may replace image-tool surfaces after failed variants. This decision remains pending: `operator-C.md` requires the image tool to draw the surfaces and forbids code from adding texture. Starting hashes confirm that all existing artwork is unchanged. No commit, push or branch change. This section received a prose pass and self-read; review was not independent.

# D0a Part C: critic 14 redraw

2026-11-21: **unfinished; all 30 failed files remain unresolved.** Three new keep variants from the built-in image tool still contain smooth shading and uneven block boundaries. Rejected them before import. No artwork changed, including passing stations, props, studies and palette files. The other nine looks received no new variants in this run; the three-per-look C12 sources remain available.

Exact prompts, sources and measurements are in `art-drop/review-d0a/C14-prompts.json`, `C14-sources/` and `C14-grid-validation.json`. At the estimated grids, 0–0.71150% of blocks have an exact colour mode covering 75%. With three RGB levels of tolerance, 91.80–93.81% meet that coverage. Visual inspection still shows gradients and inconsistent block widths; these measurements do not establish a usable art-pixel grid. No larger-cell readback was accepted. A request to allow direct native drawing when image-tool output fails is pending because `operator-C.md` requires image-tool surfaces.

Added `tools/review_c14.py` and refreshed the `C-*.png` sheets and all fourteen floor repeats. Inspected every proof at 1x, 2x, 3x, greyscale and quarter-size squint, the floor repeats, and all three new source review sheets. Material failures remain visible. `C14-current-validation.json` records each look's lone-pixel percentages and passing numerical checks: surfaces range from 0% to 0.14950%; every floor is 0%. The palette audit passes. Numerical passes do not resolve critic 14's drawing failures.

Starting hashes confirm that all existing artwork is unchanged. No commit, push or branch change. This section received the repository prose pass and a self-read; review was not independent.

# D0a Part C: critic 13 redraw

2026-11-21: **unfinished; all 30 failed files remain unresolved.** Read the full plan, brief, critic 13 and operator correction. Generated three new keep variants with the built-in image tool. All returned 1254 × 1254 images with smooth shading and uneven block boundaries. Rejected them before import. Exact prompts, sources and grid measurements are in `art-drop/review-d0a/C13-prompts.json`, `C13-sources/` and `C13-grid-validation.json`. No new variants were generated for the other nine looks; the previous round's three candidates per look remain available.

At the estimated grids, 0–0.04385% of blocks have an exact colour mode covering 75%. Allowing three RGB levels of variation raises this to 79.05–93.82%, but the native and enlarged source crops still show shading and softened edges. No larger native cell or readback has been accepted. Asked whether direct native drawing may replace failed image-tool output because `operator-C.md` mandates the image tool; the answer is pending.

Added `tools/review_c13.py`, refreshed the `C-*.png` sheets and all fourteen floor repeats, and inspected the proofs and canon props/studies at 1x, 2x, 3x, greyscale and quarter-size squint. Material defects remain visible. `C13-current-validation.json` records the checks and lone-pixel percentages per look: all are below 3%, ranging from 0% to 0.14950% on surfaces, with 0% on every floor. The current numeric checks and palette audit pass; these do not resolve the drawing failures. The obsolete flat-square coverage ceiling is diagnostic only.

Starting hashes confirm that all existing artwork is unchanged, including passing files. Project writes stayed under `art-drop/`; no commit, push or branch change. The log received a prose pass and self-read, without an independent reviewer.

# D0a Part C

2026-11-21, registered-grid attempt C12: **incomplete; no replacement artwork accepted.** Generated three built-in image-tool variants for each of the ten rejected looks, thirty sources in total. Read the complete plan, brief and operator correction, including the 01:35 UTC change. Station proofs, all props, the palette, studies, style guide and canon cell size remain unchanged.

The prompts request 144 × 144 logical art pixels in large uniform blocks, this look's ramps, structured materials, calm floors and the master reference. Yard also uses the existing summer grass, path and cobble crops. Sources, exact prompts and reference paths are in `art-drop/review-d0a/C12-sources/` and `C12-prompts.json`. All sources are 1254 × 1254. There was no CLI/API fallback.

Added `tools/check_registered_c12.py` to estimate grid pitch and phase from edge histograms, then measure each block's colour mode before palette conversion. At the estimated grids, 0.0000–0.3966% of blocks have an exact RGB mode covering at least 75%. A separate diagnostic allows each RGB channel to differ from that mode by up to three levels: 75.96–94.28% of blocks meet 75% coverage with that tolerance. This distinction matters under the operator's near-uniform rule; exact equality alone is not an acceptance decision. The known master grid passes all 39,601 sampled blocks. Full measurements are in `C12-grid-validation.json` and `C12-master-control.json`.

Visual review still rejects these candidates. Native and enlarged crops show smooth shading inside shapes and softened edge bands, with inconsistent apparent block widths. The top planes are often too bright. Temple repeats diagonal marble bands; cave floors acquire unwanted tile dividers; yard turf and path remain broad blotches. The image-tool structures are more legible than the existing camo, but these sources do not establish the uniform pixel density and finish required for import. No source was palette-locked into a deliverable, and no new native surface was accepted. Larger-cell readback and hand cleanup were not completed; those remain unresolved work, not a passing alternative established by this run.

Added `tools/review_c12.py` and refreshed all fourteen proof reviews and floor-repeat composites under `art-drop/review-d0a/`. `C-<look>-review.png` includes native, 2x and 3x nearest-neighbour views, greyscale, quarter-size squints and master comparisons. `C-op2-<look>.png` labels the existing proof beside the master at equal art-pixel scale. `C12-source-review-<look>.png` shows each new variant and native source crops. Reduced source overviews are diagnostics only and were never art inputs.

The existing proofs pass the numerical checks in `C12-current-validation.json`: dimensions, binary alpha, zero RGB under transparency, own-look active palette membership, colour caps, floor clusters, baselines, value ladder and local prop contrast. Palette validation passes. Surface sheets use at most 12 colours; prop layers at most 12. Maximum floor contrast is 14.59 L*. The obsolete flat-square coverage rule is diagnostic only. These passes do not resolve the operator's artistic rejection. Current lone-pixel measurements are:

| Existing proof | Surface lone pixels | Floor lone pixels |
| --- | ---: | ---: |
| keep | 0.0386% | 0.0000% |
| temple | 0.0145% | 0.0000% |
| manor | 0.0145% | 0.0000% |
| crypt | 0.0386% | 0.0000% |
| cave_rock | 0.0145% | 0.0000% |
| cave_ice | 0.0000% | 0.0000% |
| cave_crystal | 0.0145% | 0.0000% |
| cave_lava | 0.0386% | 0.0000% |
| dungeon_sewer | 0.0289% | 0.0000% |
| station_corridor | 0.0000% | 0.0000% |
| station_lab | 0.0000% | 0.0000% |
| station_engine | 0.0338% | 0.0000% |
| station_hydro | 0.1495% | 0.0000% |
| yard | 0.0482% | 0.0000% |

Reviewed the existing proofs at 1x, 2x and 3x, greyscale and squint, and inspected every floor-repeat sheet. The ten rejected looks still need replacement surfaces, their final checks and accepted proof pairs. Starting hashes confirm no existing artwork changed. All project writes stayed under `art-drop/`; no commit, push or branch change was made. The notes received a prose pass and self-read; the review was not independent.

# D0a Part C: critic 11 redraw

2026-11-21: redraw pending a method decision. Read the full plan, brief, critic 11 and operator-C.md. The operator requires image-tool surfaces, while the current request permits native drawing with code as a pencil. Asked whether native drawing may replace the operator's required method after the recorded grid failures. No new generation was attempted and no artwork was changed in this run; all 30 failed files remain unresolved.

Refreshed the C-*.png review sheets and all fourteen floor-repeat composites. Added tools/review_c11.py and C11-current-validation.json in the review folder. Per critic 11, the obsolete 8 px flat-square coverage rule is diagnostic only; it must not force texture into calm material fill. All remaining numerical checks and the palette audit pass. Surface lone-pixel percentages range from 0% to 0.1495%; every floor has 0%. The report records each look and region. These checks do not resolve the material drawing failures.

Starting hashes confirm that all existing artwork is unchanged, including the passing station proofs, props, studies and palette. No commit, push or branch change was made. The log received a prose pass and a self-read; that review was not independent.

# D0a Part C: critic 10 redraw

2026-11-21: blocked at image-tool grid registration. All 30 files failed by critic 10 remain unresolved. Two new keep variants used a native master stone crop and the keep palette. Both prompts requested 288 × 288 output with uniform 2 × 2 blocks; both returned 1254 × 1254 images with soft shading. Variant A has 5,413 colours and at best 13.3638% uniform blocks; B has 7,788 colours and 11.1910%. The master control measures 100%. Both were rejected before import. The other nine looks were not generated. Permission to use native hand drawing if image-tool candidates fail is pending because operator-C.md requires image-tool surfaces.

Refreshed the current `C-*.png` sheets and all fourteen floor-repeat composites in `art-drop/review-d0a/`. Inspected the proofs at 1x, 2x and 3x, in greyscale and quarter-size squints, and inspected the floor repeats. The camo, stripes and repeated marks identified by critic 10 remain visible. New candidates, exact prompts and source diagnostics are saved as `C10-*` in the review folder. Added `tools/review_c10.py`; run with `PYTHONDONTWRITEBYTECODE=1`.

`C10-current-validation.json` records lone-pixel percentages per look and region; all are below 3%, with 0% on every floor. Palette, alpha, colour caps, floor clusters, baselines, value order and composition checks pass. The inherited 8 px coverage check fails for ten looks. These measurements do not resolve the drawing failures. `tools/check_palette.py` passes. Starting hashes confirm that all existing art, including passing files, remains unchanged. No commit, push or branch change was made. The log received a prose pass and self-read; review was not independent.

# D0a Part C: critic 9 redraw

2026-11-21: blocked at image-tool grid registration; all 30 failed files remain unresolved. Two new keep variants used the master stone crop and keep ramps. Both requested 288 × 288 output on an exact 2 × 2 grid; both returned 1254 × 1254 with soft shading. They contain 6,118 and 3,184 colours. Their best registrations across the 4 grid origins have 15.2891% and 14.6125% uniform blocks, against 100% for the master. Rejected both before import. The other nine looks were not generated. Asked the owner whether native hand drawing may replace the method required by operator-C.md; the decision is pending.

Refreshed the `C-*.png` review sheets and all fourteen `proof-3x3repeat-<look>.png` floor repeats in `art-drop/review-d0a/`. Added `tools/review_c9.py`. `C9-current-validation.json` records lone-pixel percentages per look and region; all are below 3%. Palette, alpha, colour caps, floor clusters, baselines, values and layer composition pass. The inherited 8 px coverage check fails for ten looks; critic 9's drawing failures remain.

All existing artwork and earlier tools retain their starting hashes. The failed studies and guide inserts await accepted replacement surfaces. Raw variants, prompts and diagnostic views are saved as `C9-*` in the review folder. Inspected both source crops at 1x, 2x, 3x, greyscale and quarter-size squint; both fail the required finish. No commit, push or branch change was made.

# D0a Part C

2026-11-21, operator round 2: **blocked; no replacement art accepted.** Read the complete plan, brief, style canon and operator-C.md. The operator requires image-tool surfaces for ten looks and preserves the four station proofs and all canon props. Tested that method on keep before attempting the other nine looks.

Made three keep variants with the built-in image tool: a reference-guided drawing, a stricter flat-palette drawing, and an edit using the existing surface at exact 2x as its layout input. Each prompt requested a 288 × 288 image on a registered 2 × 2 grid. All three outputs are 1254 × 1254 and have soft shading and nonuniform pixel edges. Their best grid registrations contain only 10.0626%, 11.8336% and 10.8692% identical-colour blocks. The master control contains 100% identical blocks at origin (0, 0). The sources contain 15,420, 3,803 and 7,705 colours respectively; alpha is opaque throughout.

Rejected all three before readback or palette conversion. Converting these sources into the requested 144 × 144 art would require the prohibited spatial reduction or a new drawing. No generated pixels entered proof/, canon/ or frames/. The remaining nine redraws were not attempted after the three source-grid failures. Part C still needs ten compliant surfaces, composition with the preserved props, and the complete final proof checks and review sheets. Earlier numerical passes do not override the operator's rejection.

Added tools/check_op2_source_grid.py, which checks all four 2 × 2 grid origins, dimensions, colour counts and alpha, compares the master control, and exits with failure when no source qualifies. Raw variants, exact prompts, measurements, and rejected-source comparisons are saved as C-op2-* under art-drop/review-d0a/. Crop comparisons use native source pixels at 1x, 2x and 3x nearest-neighbour, greyscale and quarter-size greyscale squints. These are failure evidence, not finished proof reviews.

Starting hashes confirm that every existing art deliverable and earlier tool was preserved. This log section is the only change to an existing deliverable. No commit, push or branch change was made. The blocker is obtaining image-tool output on the required native grid; this run does not establish that another generation setup cannot do so. The log received the repository's plain-prose pass and a self-read, without an independent reviewer.

# D0a Part C: critic 7 redraw

2026-11-21: saved an unfinished redraw of the ten failed proof pairs, ten studies and their style-guide placements. **Part C still fails self-review.** The stone grain remains coarse, the ice planes and marble bands are too regular, and the yard cobbles still read as rings. These drawings need another material pass before acceptance.

The canon cell remains 48 px. Passing station proofs, canon props, shadows, palette files and STYLE.md retain their starting hashes. The guide is unchanged outside the ten study placements and the keep example. The crypt study's foreign ash and limestone colours were replaced with active crypt colours while retaining its drawing; the validator now checks every study against its own look's ramps.

`tools/check_c7.py` fails the 8 px coverage check for all ten redrawn looks. Its remaining checks pass, including binary alpha, transparent RGB, palette membership, colour caps, floor clusters, baselines, exact greyscale copies, value order and local prop contrast. `tools/check_palette.py` passes. The failed result remains in `art-drop/review-d0a/C7-validation.json`; it is not an art approval.

Inspected the saved proofs and studies at 1x, 2x and 3x nearest-neighbour, in greyscale and quarter-size squints, with registered master comparisons and all fourteen floor repeats. Current `C-*.png` reviews, working layers and the starting copies in `C7-before/` are under `art-drop/review-d0a/`. Rebuild with `tools/redraw_c7.py`; review with `tools/review_c7.py`. Run Python with `PYTHONDONTWRITEBYTECODE=1`.

All writes stayed under `art-drop/`. No commit, push or branch change was made. The log received a self-review using the repository prose guidance; that review was not independent.

# D0a Part C: critic 6 redraw

2026-11-21: redrew the failed surfaces at native 48 px per cell. Replaced the cap islands, broad floor bands and repeated mud inclusions; added finer grain, branching veins, local deposits and unequal packed cobbles. Rebuilt the ice snow-base and geode socket contours. Hydro's broad pot and leaf planes now clear the local floor by at least 18.32 L* across 685 measured pixels. The validator includes both step-4 pigments missed in round 5.

Updated 11 colour/grey proof pairs, nine material studies and ten guide placements. This is the authorized canon material revision for round 6. Passing proofs, studies, canon props, palette files, STYLE.md and shadow masks retain their starting hashes. The guide is unchanged outside the replaced samples.

`tools/check_c6.py` and `tools/check_palette.py` pass. Surfaces use 5–12 colours; props use 6–12. Maximum floor contrast is 14.60 L*, with minimum measured body/outline gaps of 10.82/14.55 L*. Checks cover dimensions, own-look proof ramps, palette, alpha, transparent RGB, colour caps, baselines, greyscale conversion, value order and floor clusters. Nonstation surfaces have no untouched single-colour square larger than 8 × 8 pixels.

Reviewed native, 2x, 3x, greyscale, squint and floor-repeat views beside registered master crops. Current `C-*.png` sheets, all 14 repeat composites, working layers and `C6-validation.json` are in `art-drop/review-d0a/`; historical round-labelled evidence is retained. Self-review is complete; independent critic and owner acceptance remain pending.

Local scripts: `tools/redraw_c6.py`, `tools/check_c6.py`, `tools/review_c6.py`, with `PYTHONDONTWRITEBYTECODE=1`. No edits outside `art-drop/`; no commit, push or branch change.

# D0a Part C: critic 5 redraw

2026-11-21: redrew the fourteen proofs and greyscale copies at native 48 px per cell. Replaced the shared flake field with connected material shapes, rebuilt the altar and ossuary, and gave ice and crystal different formations. Station caps have mechanical sections; warning paint and floor fissures have closed ends. Lab and hydro leaks have filled centres. Each proof remains 144 × 144 px, with integer-coordinate pencil work and no resampling.

Updated the eleven failed material studies, their guide placements and the keep example in the do/don’t section. The passing crypt, corridor and lab studies, canon props, palette, STYLE.md and fourteen shadow masks retain their starting hashes. Earlier A/B projection, hasp and palette corrections remain intact.

`tools/check_c5.py` and `tools/check_palette.py` pass. Surfaces use 5–12 colours and props 6–12. Maximum floor contrast is 14.59 L*; minimum measured body and outline gaps are 10.82 and 14.55 L*. Study cluster checks cover the floor half; one-pixel wall diagonals are reviewed as contours. The older whole-study component check also flags those diagonals and cropped wall edges.

Reviewed native, 2x and 3x views, greyscale, quarter-size squints and floor repeats against the registered master and overworld sources. Refreshed review sheets and `C5-validation.json` are in `art-drop/review-d0a/`. This was self-review; independent critic and owner acceptance remain pending. Rebuild with `tools/redraw_c5.py`, then run `tools/check_c5.py` and `tools/review_operator_c.py`, with `PYTHONDONTWRITEBYTECODE=1`. No commit, push or branch change was made.

# D0a Part C

2026-11-21: redrew the fourteen proofs in response to `operator-C.md` and the file-specific findings in `critic-C-4.json`. The canon cell remains 48 px. Each colour proof and greyscale copy is 144 × 144 px. Added fourteen `proof/<look>-shadow.png` files as single-colour, binary masks; review composites apply them once at 35% beneath the props.

The drawing tools use native integer-coordinate polygons, rectangles and strokes, with a recorded list of per-pixel repairs. No generated image, spatial reduction, smoothing, blur or soft alpha enters the artwork. Material coverage extends across the wall caps, faces and floors. Cave walls have connected planes; furniture has additional grain and fittings. The chest retains its plain hasp and has repaired lid-edge colours. Ice and crystal contours were rebuilt. Parquet and hydro layouts wrap over three cells; yard paving continues across the vertical period boundary. The lab spill reaches the wall fitting, and the hydro planting has overlapping leaf groups.

Authorised changes to earlier parts are the crate, chest and table in `canon/props/`, thirteen material studies, and their placements in `canon/style-guide.png`. The palette, STYLE.md, column, door, crypt study and reference crops were preserved during this job. Existing overworld crops remain in `art-drop/dungeon/reference/`.

Validation of the saved art passes for all fourteen looks, with 6–12 colours per surface sheet and 6–12 per prop sheet. Maximum floor contrast is 14.18 L*. Minimum measured main-body separation is 10.82 L*; minimum outline separation is 17.89 L*. Lava mean values are mass 13.16, top 20.20, face 31.50 and floor 42.26 L*. Checks found no floor components smaller than three pixels, off-palette colours, reference-only pigments, opaque black or non-binary alpha. Non-station surfaces have no single-colour square larger than 8 × 8 px; smooth manufactured panels are the declared exception.

Reviewed the saved art at 1x, 2x and 3x nearest-neighbour, in greyscale and quarter-size greyscale squints. Master comparisons use one art pixel per registered 2 × 2 source block. The fourteen floor repeats, `C-*.png` sheets, contact-shadow comparisons and validation reports are in `art-drop/review-d0a/`. This was self-review; the numerical pass does not constitute operator acceptance of the finish.

Rebuild with `tools/draw_operator_c.py`. Check with `tools/check_operator_c.py`, `tools/review_canon_c3.py` and `tools/check_palette.py`; refresh compact review sheets with `tools/review_operator_c.py`. Run Python with `PYTHONDONTWRITEBYTECODE=1`. The current proof report is `art-drop/review-d0a/C-operator-validation.json`. All writes stayed under `art-drop/`. No commit, push or branch change was made.

# D0a Part C: critic 3 redraw

Redrew all fourteen proofs and their greyscale copies at the existing 48 px cell size. Stone wear now follows selected edges; marble has branching veins; parquet has boards and end rails. Cave faces have separate fracture shapes. The lab spill is visible below the wall, station deposits connect to fittings, and the yard court wraps through turf. Refined prop joinery, recesses and contours.

The authorised A/B edits are `canon/props/{crate,chest,table}.png`, thirteen failed swatches and their `style-guide.png` placements. The palette, STYLE.md, palette validator, column, door, crypt swatch and source crops retain their starting hashes. No `operator-C.md` was present.

Regenerated the C review sheets and fourteen floor repeats in `art-drop/review-d0a/`. Reviewed the art at 1x, 2x and 3x nearest-neighbour, in greyscale and quarter-size squints. Palette, proof and canon checks pass: binary alpha, zero transparent RGB, material membership, colour caps, floor clusters, baseline and value ladder. Surfaces use 6–12 colours; props use 6–11. Maximum floor span is 14.49 L*; minimum main-body contrast is 10.59 L*. Repeated construction and distinctive wear were reviewed separately.

Rebuild with `tools/redraw_proofs_c3.py`; check with `tools/check_redraw_c3.py`, `tools/review_canon_c3.py` and the unchanged `tools/check_palette.py`. The JSON reports and preservation hashes are in the review folder. This self-review does not replace the next independent critic or owner acceptance. No commit, push or branch change was made.

# D0a Part C: critic 2 redraw

Redrew the fourteen 144 × 144 proofs and their greyscale copies at the established native 48 px cell size. Replaced turned furniture with top-and-front construction, rebuilt wall and floor surfaces, and added material details to the tank and motor. The yard uses packed cobbles, a worn path and smaller turf clusters. No `operator-C.md` was present.

Applied the authorised A/B corrections as canon D0a-C.2: redrew crate, chest and table; replaced the chest glyph with a rectangular hasp; rebuilt thirteen material studies; and refreshed their guide placements. Studies now use 5–9 colours. Lava has ember cracks; corridor panels have hazard paint; the lab has clean tile and a spill. `STYLE.md` specifies parallel edges and no side faces.

Active adjacent palette steps are at least 6 L* apart. Marble 6, clean-tile 6, bone 6 and blue-ice 6 are reference-only. The palette files, builder and validator agree. The passing crypt study and all source crops retain their original hashes. The passing column and door received only the colour substitutions required by the palette repair: limestone 5 in both, plus oak 4 in the door. Reversing those substitutions restores their original file hashes; their geometry is unchanged.

`check_palette.py`, `check_redraw_c2.py` and `review_canon_c2.py` pass. Proof surfaces and props each use 6–11 colours. The largest floor span is 14.49 L*; the smallest measured main-body gap is 10.59 L*. Checks also cover native sizes, binary alpha, transparent RGB, palette and look membership, reference-only exclusions, baselines, value order, floor clusters and repeated features. Only recorded panel fittings and seam lips are exempt from the repetition check.

Reviewed saved art at 1x, 2x and 3x nearest-neighbour, in greyscale and quarter-size squints, with registered master comparisons. The fourteen floor repeats, refreshed `C-*.png` sheets and reports are in `art-drop/review-d0a/`. This was my own visual review and prose pass; independent critic and owner acceptance remain pending. All writes stayed under `art-drop/`. No commit, push or branch change was made.

Rebuild with `repair_palette_c2.py`, `redraw_proofs_c2.py` and `refresh_canon_c2.py` in `tools/`, in that order; run Python with `PYTHONDONTWRITEBYTECODE=1`. Review scripts write diagnostics only to `art-drop/review-d0a/`.

# D0a Part C: critic 1 redraw

Redrew all 28 failed proof files at native 48 px per cell; each colour patch and greyscale copy is 144 × 144 px. No `operator-C.md` was present. The drawings have separate stone bonds, ice planes, basalt columns and station construction. Props have new silhouettes, thinner contours and distinct planes. The yard has a bending path, smaller turf detail and stones continued across both repeat boundaries.

`tools/check_redraw_c1.py` passes all fourteen looks. Surface layers use 6–11 colours and props use 5–11. The checks cover the palette, each look's ramps, binary alpha, zero RGB under transparency, sizes, the wall baseline, value order and exact greyscale conversion. Floor components contain at least three pixels, and no texture component of 3–300 pixels repeats within a period. Manufactured panel borders and fastening tabs are recorded separately. The maximum floor span is 13.80 L*; the smallest measured gap between a main prop plane and its local floor is 10.59 L*.

I inspected the saved proofs at 1x, 2x and 3x nearest-neighbour, in greyscale and as quarter-size squints. Master comparisons use one pixel per registered 2×2 source block. Regenerated the `C-*.png` sheets and all fourteen floor repeats in `art-drop/review-d0a/`; checks and preservation results are in `C-critic1-validation.json` and `C-critic1-preservation.json`. This was my own visual review and prose pass; independent critic and owner acceptance remain pending.

The canon, source crops and earlier tools retain their original hashes. Only the failed proofs and this log changed among existing deliverables. New drawing and checking scripts are in `tools/`. All writes stayed under `art-drop/`; no commit, push or branch change was made.

Reproduce with:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 art-drop/out/dungeon/d0a/tools/redraw_proofs_c1.py
PYTHONDONTWRITEBYTECODE=1 python3 art-drop/out/dungeon/d0a/tools/check_redraw_c1.py
```

# D0a Part C

Completed the fourteen proof patches at the canon's native 48 px cell size. `proof/<look>.png` and `proof/<look>-grey.png` contain 28 files, each 144 × 144 px. The looks are keep, temple, manor, crypt, cave_rock, cave_ice, cave_crystal, cave_lava, dungeon_sewer, station_corridor, station_lab, station_engine, station_hydro and yard.

I drew with integer-coordinate rectangles, stepped polygons and individual pencil strokes in `tools/draw_proofs.py` and `tools/proof_finish.py`. The keep crate uses Part B's native silhouette with brighter oak body planes and new grain strokes for this floor pairing. All other props are new drawings. The drawings use no smoothing, generated imagery, spatial reduction, random texture or soft alpha. The existing canon, source crops and earlier tools remain unchanged. This new log section is the only edit to an earlier deliverable.

Each patch contains mass at rows 0–7, wall top at 8–47, a 48 px wall face at 48–95 including its one-pixel dark baseline, and floor at 96–143. The prop occupies a native 48 px canvas at (86, 96). Visible prop widths are 35–42 art pixels; the crate is 38 px wide. The master crate is about 42 art pixels wide. Upper-left bevels rise by one ramp step; recessed areas and small grain strokes are distinct from the main body planes measured below.

Each colour proof uses only its look's named material ramps and shared void/mass darks. The yard uses the existing grass/path/cobble palette and the canon's exterior stone/slate colours. Its source comparison is `art-drop/review-d0a/C-yard-sources.png`. The summer source images already supplied by Part A were preserved. Built floor joints remain on the 48 px grid. Marble veins, rock fractures, ice planes, crystal seams, ash deposits, station panels, spills and plant growth have separate drawings across the 144 px floor period.

`tools/check_proofs.py` passes all fourteen looks. Surface layers use 6–10 colours and prop layers 4–10, below the 32/48 caps. Checks found zero off-palette pixels, foreign material colours, soft-alpha pixels, opaque black pixels or floor components smaller than three pixels. Transparent prop backing has zero RGB. The greyscale files match direct luminance conversion of their colour proofs; their neutral greys are diagnostic colours, excluded from the scene-palette membership test.

Floor colours span L*35.79–54.24 across the set. No individual floor spans more than 12.14 L*. The smallest measured main-body gap from the actual floor beneath a prop is 10.59 L*, and the smallest outline gap is 14.39 L*. Mean values increase from mass through top and face to floor in all fourteen patches; mass is at least 25% darker than the top. The body check includes the declared broad front, side and top planes, while small highlights, grain and recessed openings have separate roles.

I inspected the saved files at 1x, 2x and 3x nearest-neighbour, in greyscale and as a quarter-size nearest-neighbour greyscale squint. Cleanup removed enclosed one- and two-pixel floor fragments, corrected prop/floor pairings, replaced shared floor marks with material-specific drawings and repaired boundary cuts found in repeat previews. The repeat check finds no duplicated texture component of 8–300 pixels within a floor pattern. Corridor panel corners repeat as structural seams and are reported separately. Smaller marks and outline runs were reviewed visually. These 3-cell studies are not the later 6-cell production patterns.

Review evidence stays in `art-drop/review-d0a/`: `C-<look>-review.png`, `C-<look>-grey.png`, the grouped `C-*-review-*.png` sheets, `C-contact-{1x,2x}.png`, `C-squint-review.png`, fourteen `proof-3x3repeat-<look>.png` images and `C-validation.json`. Comparisons show our 2x art beside the master PNG at stored 1x. Registered master crops also appear at one art pixel per exact 2×2 source block and at 3x nearest-neighbour; both inspected source regions contain zero mixed 2×2 blocks. Station comparisons use the master's station room.

This is my visual review and prose pass; independent critic and owner acceptance remain pending. All writes stayed under `art-drop/`. I did not commit, push or change branches.

Reproduce the proofs and checks from the checkout root:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 art-drop/out/dungeon/d0a/tools/draw_proofs.py
PYTHONDONTWRITEBYTECODE=1 python3 art-drop/out/dungeon/d0a/tools/check_proofs.py
```

# D0a Part B: critic 3 redraw

Redrew `keep`, `temple`, `cave_rock` and `building-yard` at native 48 × 48 pixels. Stone wear now connects across mineral areas and fractures; turf has unequal growth patches with smaller blade clusters along their edges. Replaced every occurrence in `canon/style-guide.png`. The door, table and crate scale panels and the crate lighting example use a labelled L*30.34 display backing. These panels make no dungeon-floor pairing claim; the printed floor rule and the passing chest/column pairings remain intact.

`check_style_guide.py --reviews` passes for 20 authored PNGs and 16 source samples. Checks cover binary alpha, transparent RGB, palette membership, colour caps, 48 px dimensions, floor values and texture clusters. The four redraws use 3–4 colours, contain no component smaller than three pixels and have no repeated connected component of three or more pixels. The maximum floor-value span across all fourteen studies is 12.969 L*. All 33 files marked passing by critic 3 retain their original hashes. This includes `STYLE.md`, the props and source crops. Part A is unchanged. No `operator-B.md` was present.

Regenerated the B review sheets in `art-drop/review-d0a/` and inspected native, 2x/3x nearest-neighbour, greyscale and quarter-size greyscale views. `B-validation.json` records the pixel checks; `B-critic3-preservation.json` records file hashes and repeated-component checks. The drawing recipe is `tools/redraw_critic3.py`. Visual review and the prose pass were my own; independent critic and owner acceptance remain pending. All edits stayed under `art-drop/`. No commit, push or branch change was made.

# D0a Part B: critic 2 redraw

Redrew the ten failed material studies at native 48 × 48 pixels and replaced every placement in `canon/style-guide.png`. Stone has finer wear and branching fractures; the plank has a smaller knot; oil forms one dragged deposit; plant growth follows the ceramic seam. Grass uses small, low-contrast blade clusters. No `operator-B.md` was present. All 27 files marked passing by critic 2 retain their original hashes, including the props, STYLE.md and source crops. Part A is unchanged.

Regenerated the B review sheets and inspected the changed art at 1x, 2x and 3x nearest-neighbour, in greyscale and as quarter-size greyscale squints beside native sources. The surface studies pass alpha, palette, size, colour-cap and cluster checks. They use 2–5 colours each; the maximum floor-value span across all fourteen studies is 12.969 L*. No texture component is smaller than three pixels. Review files and reports remain in `art-drop/review-d0a/`.

The guide remains unfinished because its wood pairing has conflicting requirements. The unchanged oak body planes include L*42.04 and L*46.25; no floor in L*35–55 can sit at least 10 L* from both. The validator now counts every present body pigment instead of selecting oak step 5, and correctly reports failure for the crate, table and door. Chest and column floor pairings are repaired. I asked the operator to choose between a labelled L*30.34 display backing and recolouring the passing wood planes. `B-proposed-display-backing.png` shows the first option; it has not been applied to the deliverable.

The prose pass and visual review were my own. Independent critic acceptance is pending. No files outside `art-drop/` were changed. No commit, push or branch change was made.

# D0a Part B: critic 1 redraw

Redrew all 18 files listed as failed in `art-drop/review-d0a/critic-B-1.json`: the five props, twelve material studies and their placements in `canon/style-guide.png`. No `operator-B.md` was present. The canon remains 48 px per cell. Passing files, including `STYLE.md`, both station-panel studies, all source crops and Part A's palette, remain unchanged.

The crate has recessed planks and thick bracing with one shared face edge. The chest has a raised curved lid, a visible side, shaped gold bands and an inset lock. The column has bevelled mouldings, recessed flutes and connected chips. The door has individual stone bevels, a deeper recess and smaller iron hardware. The table has regular two-row edge steps, board thickness and trestle joints. Material studies use connected strata, fractures, grain and wear; grass and hydroponic growth follow larger connected masses. These drawings use native integer coordinates in `tools/draw_style_samples.py` and `tools/draw_material_studies.py`.

`tools/check_style_guide.py --reviews` passes. Authored art has binary alpha, zero RGB under transparency, no off-palette or black pixels, and dimensions divisible by 48. Props use 6–16 colours each and 26 combined; material studies use 2–4 each. Floor clusters contain at least three pixels, floor values stay within L*35–55, and the largest span is 12.969 L*. Added checks find no 2×2 blocks in the props' darkest body-ramp colours and confirm the crate diagonal and table's two-row silhouette runs. All 16 source entries still match their documented extracts or native party composite.

Regenerated the `art-drop/review-d0a/B-*.png` sheets and `B-validation.json`. I inspected the redrawn art at 1x, 2x and 3x nearest-neighbour, in greyscale and as a quarter-size greyscale squint. The prop comparisons include the native master crate, table, doorway and stonework; the yard comparison uses the summer grass. Cleanup joined diagonal texture fragments and removed dark corner blocks. This was my own visual review; another critic round and owner acceptance remain pending.

This section is the only change to earlier parts' deliverables. All scratch images, comparisons and reports remain under `art-drop/review-d0a/`. No files outside `art-drop/` were changed, and no commit, push or branch change was made. The prose pass and newcomer read were my own.

# D0a Part B

Completed 2026-11-20 on `art/dungeon-maps-2026-11-20`. Canon version D0a-B.1 uses **48 × 48 px cells** for this and all later parts. I drew at that resolution, so the owner's larger-cell option was not needed. Part A's palette, tools and summer reference images remain unchanged. The only earlier deliverable edited is this running log, as requested.

`canon/style-guide.png` is 1728 × 3072. It contains all 61 labelled six-step ramps, the crate/chest/column outline examples, upper-left lighting, a scale chart, 14 material studies, the greyscale value ladder, gameplay colours and five do/don't pairs. `canon/STYLE.md` records the cell decision and drawing rules. `canon/props/` contains reusable crate and chest sprites at 48 × 48, door and column sprites at 48 × 96, and a table at 96 × 96. `canon/swatches/` contains fourteen 48 × 48 material studies; these do not replace Part C's proofs or production patterns.

The drawings use explicit integer-coordinate rectangles, polygons and pencil strokes in `tools/draw_style_samples.py`. Each wood grain, stone chip, crystal facet and wear cluster has chosen coordinates. No image generation, reduction, spatial filtering, noise or texture scattering was used. All art placements on the guide are 1:1. Enlargements and the quarter-size squint exist only under `art-drop/review-d0a/`, with nearest-neighbour sampling. Labels use a bitmap font. The neutral greyscale diagram is an annotation outside the material palette.

`canon/crops/` contains the six required master crops (wall, floor, wood prop, stone prop, outline detail, rug), one extra master mass-edge crop, the three summer crops and five current-map don't examples. Master crops come directly from `master-interiors-mock.png`. Current-map crops retain their original 64 px cell scale. The summer crops copy the existing `reference/overworld-*.png` pixels exactly. Coordinates, paths and pixel hashes are in `canon/crops/SOURCES.json`.

The party sample comes from the local game's `overworld-tiles/fantasy.json`, `tiles.party[0]`. `DungeonMapView.tsx` calls `drawTile("party")` when its animated character draw is unavailable. I decoded the original 16 × 16 sprite with the shared tile-pack alphabet and placed it 1:1 on an opaque 48 × 48 backing. Its source shadow is composited on that backing; its foreground pixels are unchanged. The guide marks party and foe sprites as legacy style/scale exceptions. Reference crops and this character sample retain source colours and are excluded from authored-art palette checks.

`tools/check_style_guide.py --reviews` passes the final files. The five props use 6–14 colours each and 24 combined, below the 48-colour cap. Material studies use 2–4 colours each, below the 32-colour cap. All 36 new PNG deliverables have dimensions divisible by 48, binary alpha and zero RGB under transparency. Authored art has zero off-palette or opaque-black pixels. All 15 extracted source regions match their source pixels; the sixteenth source entry, the party, matches its native opaque composite. The atlas check masks only documented source inserts and the neutral value strip.

Every material study passes a four-neighbour component check: no same-colour texture component contains fewer than three pixels. Floors remain within L*35–55; the widest span is 10.503 L*. Against the scale-chart floor at L*41.579, main prop bodies differ by 16.524–23.308 L*, and outlines by 23.680–26.469 L*. These measurements describe the demonstrated floor pairing; later scenes must check their own pairings.

Self-review covered the guide, all props, all material studies and all source samples at 1x, 2x and 3x nearest-neighbour, in greyscale and in the quarter-size greyscale squint, beside 1x master crops. I redrew sparse material samples, replaced disconnected diagonal texture fragments with connected strokes, and joined four ice-shoulder fragments to their neighbouring ridges. The crate's brace, chest lid and lock, door arch, table legs and column flutes remain distinct at native scale. The squint preserves the prop silhouettes and value steps. Curve runs, outline corners and material finish were reviewed visually; the script does not claim to automate that judgment. Owner acceptance and independent panel review remain pending.

Review sheets and the machine-readable result are `art-drop/review-d0a/B-*.png` and `B-validation.json`. Complete guide views and section panels cover the whole sheet. The prose pass covered STYLE.md and this new log section; the newcomer read was my own. No files outside `art-drop/` were changed. No commit, push or branch change was made.

Reproduce the art, crops and checks from the checkout root:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 art-drop/out/dungeon/d0a/tools/build_style_guide.py
PYTHONDONTWRITEBYTECODE=1 python3 art-drop/out/dungeon/d0a/tools/check_style_guide.py --reviews
```

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
