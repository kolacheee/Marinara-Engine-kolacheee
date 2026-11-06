# Overworld art for Codex (2026-11-06)

The owner wants these drawn by Codex. Be a harsh critic of your own work: no obvious flaws, no blur,
no soft upscales, no half-cut buildings. The `reference/` folder holds the current art. Each setting's
`*-marker0..3.png` (48x48 now, hamlet to city) and `*-ground.png` set the style, palette and lighting to
match. `settlements-by-setting.png` and `settlements-in-game.png` show how it looks in the game today.

Style for everything: pixel art on a clean pixel grid (one art pixel = one image pixel, no
anti-aliasing, no smoothing, no gradients that break the grid). Same three-quarter overhead world-map
view, dark outline and top-left light as the reference markers. Transparent background for markers.

## 1. Settlement markers drawn at their real size (24 PNGs)

On the map the markers are drawn bigger than their 48 px art (hamlet 1.25x, village 1.75x, town 2.25x,
city 3x), so today they are blurry upscales. Redraw every tier at native size, keeping each one's
design and colours so it reads as the same building, just with more detail:

| tier | file name | size |
|---|---|---|
| hamlet | `<setting>-marker0.png` | 60x60 |
| village | `<setting>-marker1.png` | 84x84 |
| town | `<setting>-marker2.png` | 108x108 |
| city | `<setting>-marker3.png` | 144x144 |

Settings: `fantasy`, `wuxia`, `jazz_age` (1920s), `modern`, `scifi` (cyberpunk and sci-fi), `wasteland`.
The sprite should fill most of its square, centred, with its base near the bottom like the references.

Fix one design: the **wasteland city** is a clean grey castle that doesn't match the rusty, scrap-built
hamlet, village and town. Redraw it as a big walled settlement built from scrap, rust and salvaged
concrete, in the same palette as the smaller wasteland markers.

## 2. Built-up ground as one-cell tiles that never cut a building (48 PNGs)

Today slums, factories and city blocks are one big repeating pattern, cut wherever the district ends,
so buildings are sliced in half at the edge. Instead, draw each as **48x48 tiles, opaque**, where every
building sits wholly inside the tile, with a street or alley margin of 2 to 3 px along all four edges.
Tiles placed side by side then join into a street grid, and a district's edge is always a street.

For each look, draw 8 different summer tiles and the same 8 in winter (snow on roofs and ground,
same layout):

- `slums-0.png` ... `slums-7.png`, `slums@winter-0.png` ... `slums@winter-7.png`: shanty shacks
  (corrugated metal, tarps, rusty roofs) on packed dirt alleys. Match `current-slums-pattern.png`'s
  colours, but about **half the scale**: each shack roughly 8 to 14 px across, several per tile.
- `industry-0.png` ...: factory compounds (sheds with sawtooth roofs, tanks, chimneys, yards) on
  grey streets. Match `current-industry-pattern.png`, about **two thirds of its scale**.
- `city-0.png` ...: dense city blocks of towers and rooftops on dark streets. Match
  `current-city-pattern.png`, about **two thirds of its scale**.

Use a different arrangement in each tile so a district doesn't look stamped.

## Delivery

Put the PNGs in `art-drop/out/` on this branch with exactly the names above, then commit and push
the branch. Before pushing, put each set side by side with its references and check that they read as
one art set, with nothing blurry and nothing cut at a tile's edge. Write a short `art-drop/NOTES.md`
saying anything you could not do.
