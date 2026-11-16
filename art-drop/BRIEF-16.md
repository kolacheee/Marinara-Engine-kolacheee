# Round 16: weather drawn on the overworld map (after BRIEF-15)

Why: weather now comes from the climate under each map cell, and weather systems about 400 km across drift east over the map. So one region can be in a storm while the next is clear, and a desert can have a sandstorm. Today the overworld map draws none of this. The only weather shown is a full-screen rain or snow layer for the party's own spot, drawn by code over the whole screen. The map needs weather art it can draw where each weather is.

These overlays are drawn by code on top of the finished map (ground, trees, roads, settlements, the party). They must be setting-neutral, so one set serves all six settings. They must stay transparent enough that the map underneath can still be read.

Grid: 48 px per cell, the same pixel scale as the ground art. The map is top-down (straight down, unlike the 3/4 town buildings). Light comes from the top left. No rounded tile edges: a tile must repeat in a 3x3 grid with no seam. Transparent PNG. Outputs go in `art-drop/out/weather16/`. Push as "art-drop: round 16 part X" when each part passes its critic (at most 4 critic rounds).

References: crop a 6x6-cell stretch of each of these into `art-drop/reference/r16/`: fantasy grass, forest and a town; modern city; wasteland; and desert sand. Judge every overlay over all of them.

## A. Falling weather (seamless animated tiles)
Each is a 192x192 tile (4x4 cells), seamless in a 3x3 repeat, with 4 frames that loop smoothly (`<name>-f0..f3.png`). Each frame is the next step of the same fall. A drop or flake that leaves the bottom edge comes back in at the top, so the loop has no jump. The map must stay readable underneath, so cover no more than about 15-25% of the pixels except where noted.
- `rain`: thin, short slanted streaks (falling a little to the right, as the wind blows east), pale blue-white, partly transparent. Also a few 1-2 px splash ticks.
- `heavy_rain`: denser and longer streaks than `rain`, and slightly darker. Must read clearly as heavier than `rain` side by side.
- `snow`: soft 2-3 px flakes, white with a faint blue-grey edge so they show on snowy ground. Flakes drift gently, not straight down.
- `blizzard`: dense flakes driven sideways (mostly left to right) with faint wind streaks, up to about 40% cover. Must read as a whiteout, not a snowfall.
- `hail`: small hard white-grey pellets falling straight and fast, with tiny bounce marks. Clearly not snow.
- `sandstorm`: tan and ochre dust in swirling bands moving left to right, up to about 45% cover. Its colour must sit over sand without vanishing and over grass without looking like mud.

## B. Haze (seamless animated tiles)
Same 192x192 size, seamless, `-f0..f3`, but slow: the change from frame to frame is small.
- `fog`: soft, layered banks of pale grey-white made of pixel clusters (no airbrush blur), about 35-55% cover with gaps that show the map. Plus `fog-edge-n/e/s/w.png` (192x48 for north and south, 48x192 for east and west) that feather a fog bank's edge into the clear map, so a fog area doesn't end in a hard square.
- `heat_wave`: a very faint warm shimmer of thin wavy horizontal bands, pale gold-white, no more than about 10% cover. It must be barely there: the eye should notice the shimmer, not a texture.

## C. Clouds (sprites, not tiles)
Clouds are drawn as loose sprites that drift east, with a shadow cast on the ground below. They are not tiles.
- `cloud-light-0..5.png`: fair-weather clouds, top-down. Sizes: 0-1 are 96x96, 2-3 are 144x96, and 4-5 are 192x144. Clustered pixel puffs, a lit white top-left, soft grey underside on the lower right, a 1 px outline only where it helps. Partly transparent (about 75% opaque) so towns show through faintly.
- `cloud-dark-0..5.png`: the same six silhouettes as storm clouds, slate grey to near-black with a lighter rim.
- `cloud-shadow-0..5.png`: the six silhouettes as flat dark shadow masks (one colour, which code tints and fades), drawn by code a little down and to the right of each cloud.
- Silhouettes must vary (round, long, broken) so a sky of them doesn't look copy-pasted.

## D. Storm and wind effects (sprites)
- `lightning-0..2.png`: three bolts, 48x144 (from a cloud base down to the ground), each with 3 frames (`-f0..f2`): a full bright bolt, then a dimmer one, then a faint afterglow. White core with a pale violet-blue edge. Plus `lightning-flash.png`: a 192x192 soft radial glow drawn under the bolt for one frame.
- `wind-0..3.png`: wind streak sprites, 144x48, 4 frames each (`-f0..f3`), white curling gusts that sweep left to right and fade. They are drawn sparsely, so each one must look good alone.

## E. Weather icons for the map's corner (small UI)
24x24 icons, one per weather, for a "weather here" badge in the overworld corner: `icon-clear-day`, `icon-clear-night`, `icon-cloudy`, `icon-overcast`, `icon-rain`, `icon-heavy_rain`, `icon-storm`, `icon-snow`, `icon-blizzard`, `icon-fog`, `icon-wind`, `icon-hail`, `icon-sandstorm`, `icon-heat_wave`. Same pixel style, a 1 px dark outline, readable on a dark translucent panel, and each one clearly different from the others at 1x.

## Critic
- Tiles (A, B): check every tile at 1x and 3x in a 3x3 repeat over every reference crop, and play each 4-frame loop (export a GIF for yourself). Fail it if the seam shows, the loop jumps, the repeat reads as a pattern, rain and heavy rain look alike, snow vanishes on snow, fog looks like airbrush or a flat grey sheet, or the overlay hides the map so that roads and towns can't be told apart.
- Clouds and lightning: check them over the town and city crops. Fail one that's a blob, a smear, a square, or a copy of another.
- Icons: check them in a row at 1x on a dark panel. Fail any two that can be confused with each other.
