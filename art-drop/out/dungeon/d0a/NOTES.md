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
