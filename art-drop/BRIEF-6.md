# Round 6: craters as props, bridges, mountain ranges, forest floor, cyberpunk city

This round covers the owner's notes from 2026-11-07 08:46. Use the same pixel scale, top-left light and outline
weight as the art already in game (see `reference/`). Unless a part says otherwise, every file is a PNG with a
transparent background. Put files in `art-drop/out/` and push after each part passes your own check.
Order: A, B, C, D, E.

## A. Crater props (shared by every setting and season)

- Files: `crater-prop-0..7.png`. Numbers 0-3 are 48x48 (one cell). Numbers 4-7 are 96x96 (two by two cells).
- Draw them as **pure shading with no colour of their own**. Use only black, white and neutral grey pixels with
  partial alpha:
  - a dark bowl, up to about 65% alpha black;
  - a lit rim on the top-left, up to about 45% alpha white;
  - ash streaks and scattered rubble.
  The game draws them over whatever ground is there (dirt, sand, grass, snow), so they pick up its colour.
  Don't tint them in the art.
- Make them ragged blast scars, not clean round moon craters:
  - uneven rims and ejecta thrown out to one side;
  - two of the eight are clusters of small pits.
- Fade the outer edges out to zero alpha, so no outline or square edge shows.
- Placement: the game scatters them over crater cells, one sprite per one or two cells, centred on its cell with
  a little jitter. A 96 px sprite spills half a cell onto its neighbours.

## B. Bridges (one set per setting, plus winter)

- Files: `<family>-bridge-<o>.png` and `<family>-bridge-<o>@winter.png`, for each family fantasy, wuxia, jazz_age,
  modern, scifi and wasteland. `<o>` is one of four orientations:
  - `h`: the road runs west to east;
  - `v`: north to south;
  - `d1`: north-west to south-east;
  - `d2`: north-east to south-west.
- Each bridge is **48x48, one cell**. The game swaps the road for a bridge on the one cell where a road crosses a
  river.
  - `h` and `v` decks run edge to edge across the cell, centred.
  - `d1` and `d2` decks run corner to corner.
- Make the deck as wide as that setting's road (`reference/road-<family>.png`, about 12-14 px), with railings or
  parapets each side and short abutments at the ends. The deck ends must meet the road there, with no gap and no
  colour jump.
- Keep the sides transparent, so the river shows on both sides.
- Styles:
  - fantasy: timber trestle;
  - wuxia: arched stone with red-lacquered rails;
  - jazz_age: stone arch or riveted steel truss;
  - modern: concrete with guard rails;
  - scifi: dark metal with thin cyan light strips;
  - wasteland: patched scrap and planks.
- In winter, put snow on the deck edges and the railings. Leave the deck itself readable as road.

## C. Mountains as ranges

Seasons for each file: summer (no suffix) and `@winter`.

1. **Base, `mountains<season>-base.png`, 288x288, seamless.** Redraw it as a grey-green rocky slope: scree, rock
   ledges and sparse grass tufts. It must sit naturally next to the grass and plains art. No brown floor. In
   winter, snow with grey rock showing.
2. **Ridges, `mountains<season>-ridge-0..7.png`, 144x96 (three cells wide, two tall).** Each one is a chain of two
   to four joined peaks with shared shoulders and saddles, standing on the bottom edge.
   - Taper the ends down to the ground, so neighbouring ridges can overlap by about a cell and read as one range.
   - Vary the heights: two tall ones, four medium, two low foothill ridges.
3. **Peaks.** Keep the existing 96 px `mountains<season>-peak-0..7.png` as they are. They fill narrow spots.
4. **Pines, `mountains<season>-pine-0..7.png`, 48x48.** Small dark conifers, two-thirds the height of the forest
   trees, each standing on the bottom-centre. Snow-laden in winter.

How the game places them:
- Ridges go in staggered rows along the range, about 40 px apart vertically and 96 px apart horizontally, so they
  overlap. A ridge is kept only where its whole foot is on mountain ground.
- Peaks fill the cells no ridge fits.
- Pines stand on the mountain cells that border other ground and in about one gap in four, so the foothills mix
  into the forest.

## D. Forest floor (the owner: the old forest texture looks wrong under the individual trees)

- Files: `forest<season>-floor-base.png` and `conifer_forest<season>-floor-base.png`, each 288x288 and seamless,
  for four seasons: no suffix, `@spring`, `@autumn` and `@winter`.
- Draw dark, calm ground: shade, a bit of leaf litter or needles, and moss. No tree crowns or bright clumps, since
  the trees stand on top of it.
  - Autumn: fallen leaves.
  - Winter: thin snow with dark patches.
- It must be darker than the grass, so the gaps between trees read as shade.

## E. Cyberpunk city as a continuous city, not a grid of boxes

The one-cell tiles each have their own street frame, so the map reads as a grid. Replace them with a seamless
ground texture plus standing landmarks.

- **Base textures, `scifi-city<season>-base.png`, `scifi-slums<season>-base.png` and
  `scifi-industry<season>-base.png`.** Each is 288x288 and seamless, for summer (no suffix) and `@winter`.
  - Draw a dense top-down city at small scale: irregular blocks, alleys and plazas, with neon dots at night-ish
    contrast.
  - No straight street running along the texture's edges and no regular grid.
  - Character of each:
    - city: big rooftops, plazas and greenery strips;
    - slums: packed shacks and tarps;
    - industry: tanks, sheds and pipes.
- **Landmarks, `scifi-city-tower-0..7.png` and `scifi-industry-stack-0..7.png`.** Each is 48x96 (one cell wide,
  two tall), standing on the bottom-centre, for summer and `@winter`.
  - Towers: tall arcologies and lit corporate towers.
  - Stacks: smokestacks, cooling towers and gas holders.
  - The game scatters them sparsely over city and industry cells.

## A2. Crater props, redo after the in-game check (added 09:13)
On the map the props read as tiny black specks. Redraw `crater-prop-0..7.png` at the same sizes:
- **Fill:** the 96 px ones (4-7) fill about 85% of their square, and the 48 px ones (0-3) about 80%.
- **Rim and apron:** a clearly visible white rim at about 55-60% alpha on the top-left half, with a soft light ejecta apron fading out around the bowl.
- **Bowl:** dark at 55-65% alpha, but with a gradient, not a flat blot, so it reads as a hollow and not a hole.
- **Streaks:** a few short radial ejecta streaks, both light and dark.
- **Unchanged:** pure shading with no hue, edges fading to zero alpha, ragged blast scars, two pit clusters.
- **QC:** check them over wasteland dirt and over snow at 1x.
