# Round 5 (overnight 11-06/07): harsh QC fixes

An independent review of every setting in all four seasons put these at the bottom. Work through the parts IN ORDER and push after each part passes, so the cloud side can fit each one while you start the next. Keep the same QC as before (critic loop plus your own look at 1x and 8x), and keep the house style: the approved markers and the round-2/3/4 tiles.

The owner is asleep. Don't wait for her, and don't redraw anything she already approved (markers, farmland, paddies, plains).

## Part A: mountains as ranges of standing peaks (all settings)
**Problem.** `mountains` is one 6x6 texture of identical peaks in diagonal rows. It reads as egg-crate wallpaper, and winter just recolours it white. See reference/current-fantasy-mountains*.png.

**New approach.** The game will plant mountain peaks the way it plants forest trees: a staggered lattice of small standing sprites over a rocky ground, following the range's curved edge. The trees are the model; see reference/current-fantasy-treeline_forest.png, which shows 8 single trees, each in a 48 px cell with its trunk at the bottom.

**Files** (all settings share these):
- `mountains-base.png` and `mountains@winter-base.png`: 288x288, opaque, seamless. Rocky high ground with scree, small boulders, cracks and a few sparse dark-green tufts, with NO peaks. Winter is snow over rock with dark rock showing through, textured, not blank.
- `mountains-peak-0..7.png` and `mountains@winter-peak-0..7.png`: 48x48, transparent. One crag or peak per file, its foot on rows 44-47 and centred left to right.
  - Vary them: 3 big peaks (36-44 px wide, 34-44 tall), 3 medium (26-34 wide), and 2 small rocky knolls (18-24 wide).
  - Light comes from the top-left: a lit left face and a shadowed right face, with a 1 px dark outline.
  - Summer peaks have bare rock with maybe a grass skirt at the foot. Winter peaks have snow on the upper half, with rock showing on the shadow side.
  - Peaks will overlap each other heavily, 6 per cell (about 24 px apart in a row, rows 16 px apart, alternate rows shifted 12 px). Make sure a crowd of them reads as a jagged range, not a pile of cones.
- **QC composite:** fill a 6x6 base with the lattice (later rows drawn over earlier ones), check it at 1x, then check a ragged range edge.

## Part B: post-apocalyptic ground (the wasteland setting)
**Problem.** Craters are flat grey with evenly spaced round holes, reading as the Moon or Swiss cheese at the wrong scale. Ruins are clean flagstones with Greek columns, which reads as antiquity, not collapse. In winter, snow covers ruins and scrub but not the wasteland or craters. See reference/current-wasteland-*.png.

**Files:** 288x288, opaque, seamless.
- `wasteland-craters-base.png` and `wasteland-craters@winter-base.png`: scorched, cracked earth with 2-4 irregular blast craters of different sizes per texture. They have rubble rims and ash halos, the biggest at most about 2 cells across, and none on the wrap edges unless it wraps cleanly.
- `wasteland-ruins-base.png` and `wasteland-ruins@winter-base.png`: collapsed concrete slabs, rebar, broken walls, rusted car husks and a toppled pylon, over dirt and rubble. Modern collapse, not classical. Nothing important cut by the wrap.
- `wasteland-wasteland-base.png` and `wasteland-wasteland@winter-base.png`: cracked dry earth with drifts of dust, a few dead weeds and debris specks, broken up so the repeat doesn't show.
- **Winter = snow over all of them,** with ground and rubble poking through, so all wasteland looks agree in winter.

The `wasteland-` prefix means only the wasteland setting gets these. Fantasy ruins stay as they are.

## Part C: cyberpunk city, slums and industry (the scifi setting only)
**Problem.** Cyberpunk shares the generic city, slum and industry tiles, so the map is an exact square grid of the same dark stamps, with no neon and no seasons. See reference/current-scifi-*.png.

**Files:**
- `scifi-city-0..7`, `scifi-slums-0..7` and `scifi-industry-0..7`, plus the same with `@winter`.
- 48x48, opaque, one cell each, with the same rules as round 2: every building inside its cell and a street along the edges.
- **City:** dark towers with magenta and cyan neon signs, holo billboards, rooftop vents and pads, lit windows.
- **Slums:** stacked container and shanty housing with tarps, cables and a few neon signs.
- **Industry:** refinery stacks with glow, cooling towers, pipes and loading cranes.
- **Break the grid inside the rules:** vary footprints. Include a merged megablock filling most of a cell, a pocket plaza, a landing pad, a small park, and a cell split into 2-4 small buildings, so neighbouring cells don't read as the same stamp.
- **Winter:** snow on roofs and wet, reflective streets.

## Part D: forest autumn and crown variety
**Problem.** Autumn forests are one flat orange slab, and every crown is the same ball (reference/current-fantasy-treeline_forest*.png).

**Files:** `treeline_forest-0..7.png` and `treeline_forest@autumn-0..7.png`, 48x48, transparent, one tree each, trunk at the bottom centre like the current ones.
- **Summer:** 3 crown shapes (round, tall oval, lumpy two-lobed) in 2-3 greens.
- **Autumn:** a mix of 3 orange, 2 red, 2 gold and 1 still-green tree, with muted, not neon saturation.

Push each part to art/overworld-codex-2026-11-06 (fork only) and report after each.

## Part A2: peaks at 96 px (added 01:03 after the in-game fit)
At 48 px with 6 per cell, the range read as a thorny brown carpet of tiny cones. The game now plants about 1.6 peaks per cell, and each peak covers TWO cells by two.

- **Files:** redraw `mountains-peak-0..7.png` and `mountains@winter-peak-0..7.png` NATIVELY at 96x96, transparent, at the same pixel density as everything else. Don't upscale the 48 px ones.
- **Placement:** each peak's foot is on rows 90-95, centred left to right.
- **Sizes:** 3 big massifs (70-88 px wide, 60-80 tall), 3 medium (50-64 wide), and 2 small rocky knolls (34-44 wide).
- **Shapes:** double summits, a flat-topped crag, a sharp spike and a ridge shoulder.
- **Contrast:** use a lit left face and a dark right face, strata lines, and a grass skirt at the foot in summer. Push contrast against the brown rock ground: lighter, cooler grey rock on the peaks, darker shadows and a clear 1 px outline.
- **Winter:** bold snow caps on the upper third to half, with rock showing on the shadow side.
- **The two bases are good and stay.**
- **QC composite:** a lattice 48 px apart in a row, rows 30 px apart, alternate rows shifted 24 px, later rows drawn over earlier ones, over the 288 px base at 1x. It must read as a mountain range at map zoom.
