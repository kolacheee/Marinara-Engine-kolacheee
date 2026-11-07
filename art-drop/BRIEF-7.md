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
