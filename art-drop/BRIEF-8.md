# Round 8: cyberpunk buildings as props, like the forest trees (owner, 2026-11-07 16:46)

The seamless city, slum and industry textures still look bad in game. The owner asked for them to be handled like the forests: individual building sprites standing on a plain ground, planted by the game the way it plants trees. That replaces the dense textures.

All files go in `art-drop/out/`: transparent PNGs, three-quarter overhead view, top-left light, 1 px dark outline, the same pixel density as the approved markers and the tower landmarks. Each has a summer file and an `@winter` one (snow on roofs and ledges, neon still glowing).

## A. Ground (what shows between the buildings)
- **Files:** `scifi-street-base.png` and `scifi-street@winter-base.png`, 288x288, opaque, seamless.
- **Look:** dark wet asphalt and paving, faint lane markings and grates, a few puddles reflecting magenta and cyan. Calm and low-contrast, since buildings stand on it. No buildings drawn in. In winter, slush and grey snow with dark wet tracks.

## B. City buildings, 16 + 16 winter
- **Files:** `scifi-city-bldg-0..15.png`, in three sizes:
  - 0-5: small, 48x48, one cell (shops, kiosks, small blocks with signs);
  - 6-11: medium, 48x96, one cell wide and two tall (mid-rise blocks with billboards, rooftop vents and pads);
  - 12-15: large, 96x96 (a megablock, a plaza with a holo sculpture, a landing pad, a small park).
- **Anchor:** each stands with its base on the bottom rows, centred left to right.
- **Neon:** magenta and cyan signs, lit windows (warm and cool), dark facades.
- **Variety:** every sprite clearly different in silhouette and roofline.
- The existing `scifi-city-tower-*` sprites stay as the tallest landmarks.

## C. Slum shacks, 12 + 12 winter
- **Files:** `scifi-slums-bldg-0..11.png`.
  - 0-7: 48x48 (stacked containers, shanties with tarps, a noodle stall with a neon sign, a cable-strung shack pair);
  - 8-11: 96x96 (a container stack block, a shanty cluster with a market awning).

## D. Industry, 10 + 10 winter
- **Files:** `scifi-industry-bldg-0..9.png`.
  - 0-5: 48x48 (tanks, pump sheds, a pipe junction, a loading crane);
  - 6-9: 96x96 (a refinery hall, a tank farm, a factory with a glowing vent).
- The existing `scifi-industry-stack-*` sprites stay.

## Placement (game side, for the cloud)
Plant them like trees: densest at the settlement's core and thinning outwards, with the street ground between them, kept clear on roads. Large sprites take 2x2 cells. Later rows are drawn over earlier ones.

## QC
- Lay out a city block at 1x: street base, then buildings planted densely, with the towers mixed in.
- It must read as a lively neon city, not a grid of boxes and not noise.
- Do the same for slums and industry.
- Check each sprite at 8x for clean edges and no fringe.
