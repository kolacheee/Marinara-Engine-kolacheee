# Round 15: modular fantasy city buildings

Why: a city drawn with today's town art is just rows of the same one- and two-storey cottages. A city needs tall, joined buildings of different heights, built from stacked pieces so one set of art makes anything from a 2-storey shop to a 5-storey tenement.

Reference style: the fantasy town houses and halls (`art-drop/reference/r15/`, cropped from the `house` and `hall` tiles of the fantasy pack: 3x3 and 4x4 cells of 48 px). Same 3/4 front view, top-left light, 1 px dark outline, palette and pixel scale. Outputs go in `art-drop/out/city15/`.

Grid: 48 px per cell. Every piece is exactly its width in cells times 48 px across. Storey pieces are exactly 48 px tall. Transparent PNG.

## Part A, facade pieces (widths 1, 2 and 3 cells for each)
- `ground-<kind>-w<N>.png`, kinds: shop (awning and display), door (door plus windows), arch (a passage through to the yard), work (open workshop front). There's a stone plinth at the foot, and the foot sits on the bottom row.
- `storey-<kind>-w<N>.png`, kinds: timber (half-timber), plaster (plaster with shutters), stone (stone with a small balcony), jetty (overhangs 3 px on each side). Each one stacks on any ground floor or storey with no seam. Every storey and ground floor shares one fixed course line on its top row and bottom row (the same timber beam colour and height), so any stack joins cleanly.

## Part B, roofs and joins
- `roof-<kind>-w<N>.png`, 48-72 px tall, kinds: gable (gable end facing the street), ridge (ridge along the street), hip, flat (parapet and leads). The bottom edge sits on the course line.
- Small overlays: `chimney-0..3.png`, `dormer-0..3.png`, `sign-0..3.png` (hanging shop signs), and `flowerbox-0..1.png`.
- `wall-end-left.png` and `wall-end-right.png` (8x48 px party-wall strips, so neighbours join with no gap), plus `corner-ground.png` and `corner-storey.png` (1 cell each, for a building on a street corner showing a side wall).
- Colour variants: give each storey kind 3 plaster/timber colourways (cream, ochre and pale blue-grey plaster; dark and light timber) and the roofs 3 tile colours (red, brown slate, grey slate), as separate files with the suffix `-c0..c2`.

## Part C, the critic test
Compose 12 buildings at random (widths 1-3, 1-5 storeys, random kinds, colours and roofs) standing wall to wall along a street, at 1x and 3x, plus one stacked 5-storey building at 8x. Fail if there's any seam between pieces, a gap between neighbours, a misaligned course line, a repeat that reads as copy-paste, or a style that doesn't match the town houses.
