# Round 7: ruins and marsh as overlays (like the crater props)

The owner (2026-11-07 16:30) liked the craters as overlays and asked which other ground types would work the
same way. This round covers ruins and marsh. Use the same pixel scale, top-left light and outline weight as
the art already in the game. Transparent PNGs, in `art-drop/out/`. Push after each part passes your check.

The layout is the same as crater-prop: numbers 0-3 are 48x48 (one cell), numbers 4-7 are 96x96 (two by two).
Big ones should fill about 85% of their square. The game scatters them over the cells of that ground, half of
them large, on the open ground around that area, so the art must sit naturally on dirt, grass, sand or snow.

## A. Ruins

- **Wasteland**, `wasteland-ruins-prop-0..7.png`, summer, plus `wasteland-ruins@winter-prop-0..7.png` with snow
  caps. Rubble heaps, broken concrete slabs with rebar, a burnt car husk, a toppled pylon, a roofless shell of
  a building, scattered debris.
- **Fantasy**, `fantasy-ruins-prop-0..7.png` and `@winter`. Broken stone walls, toppled columns, an arch
  standing alone, a collapsed tower stump, overgrown foundations.
- Each sprite has its own colours (stone, rust, concrete) and a soft contact shadow, with its edges fading
  into the ground. No ground square under it.

## B. Marsh (shared by every setting)

- Files: `marsh-prop-0..7.png` and `marsh@winter-prop-0..7.png`.
- Summer: dark still pools with a lit rim, reed clumps, cattails, lily pads, and muddy patches. Draw pools and
  mud as see-through shading over the ground (dark at about 60% alpha), and reeds as solid sprites.
- Winter: frozen pools (pale, cracked ice) with dry reeds.
- Pools must fade at their edges, with no hard outline.

## C. Hills and boulders (shared by every setting; owner OK 2026-11-07 16:44)
- **Files:** `hills-prop-0..7.png` and `hills@winter-prop-0..7.png`, in the same 48/96 layout.
- **Rolling hills:** grassy hummocks drawn as see-through SHADING over the ground, like the craters. A lit top-left slope (white at about 35-45% alpha), a shaded bottom-right flank (black at about 40-55% alpha), and a soft contact shadow. That way they take on whatever ground they sit on (grass, plains, sand, snow).
- **Mix:** 3 single round hills, 2 hill pairs or chains, 1 hill with a small rocky outcrop on top, and 2 boulder clusters (solid grey stones with their own colour, a 1 px outline and a contact shadow).
- **Edges:** fade to zero alpha with no outline, except on the solid rocks.
- **Winter:** the same shading, with a few small snow highlights on the lit slopes and the rocks snow-capped.
- Compare with `reference/current-fantasy-hills.png`. The new ones must read as soft rolling hills from the map, not as bumps or blobs.

## D. Dunes (shared by every setting)
- **Files:** `dunes-prop-0..7.png` and `dunes@winter-prop-0..7.png`, in the same 48/96 layout.
- **Shape:** wind-shaped sand dunes as see-through SHADING: a crisp curved crest line, a lit windward slope (white at about 30-40% alpha) and a dark lee face (black at about 45-55% alpha), plus fine ripple lines.
- **Mix:** crescent (barchan) dunes, long ridges and a dune cluster. Two of them are ripple fields only.
- **Rules:** no hue of their own, so they take on the colour of sand, desert or wasteland ground. Edges fade to zero.
- **Winter:** the same shapes with snow-dusted crests (a few brighter white pixels along the crest).

## SIZE NOTE (all parts, added 20:46)
The 48 px props (numbers 0-3) must fill about 75-80% of their cell, not 30-50%. Small props turned into specks in the game (a cell is about 27 px on screen).
