# Round 8: cyberpunk built-up areas as buildings over street ground (like the forests)

The owner (2026-11-07 16:46) still finds the cyberpunk city texture poor: "maybe it needs to be handled
similarly to the forests, make buildings as props and use that instead." The game will draw city, slums and
industry the way it draws a forest: a dark ground texture with individual building sprites planted densely on a
staggered lattice, overlapping like tree crowns, and fading out at the area's edge.

Seasons for every file: summer (no suffix) and `@winter`. Transparent PNGs, using the same top-left light, 3/4
top-down view and outline weight as the forest trees. The forest trees in `reference/` show how sprites
overlap.

## Ground (seamless, 288x288)

- `scifi-city<season>-floor-base.png`: dark streets and plazas with lit lane lines, crosswalk glows and puddle
  reflections. No buildings.
- `scifi-slums<season>-floor-base.png`: muddy alleys, tarps on the ground, cables, trash.
- `scifi-industry<season>-floor-base.png`: concrete yards, rail tracks, pipes laid on the ground, oil stains.

## Buildings (48x48 each, standing on the bottom-centre like a tree; eight per set)

- `scifi-city<season>-building-0..7.png`: mid-rise blocks of different heights and widths. Rooftops with neon
  edges, signs, antennas, rooftop gardens and pads, lit windows on the front face.
- `scifi-slums<season>-shack-0..7.png`: stacked container shanties, corrugated roofs, tarps, small neon signs.
- `scifi-industry<season>-plant-0..7.png`: sheds, tanks, conveyors, small chimneys, gantries.

Planted 16-24 px apart, so the sprites cover most of the ground but gaps show the street. The existing towers and
stacks still stand above them here and there.

In winter, put snow on the roofs and keep the neon.
