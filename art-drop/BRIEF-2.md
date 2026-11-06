# Round 2 (cloud review of the pushed WIP, 2026-11-06 ~17:00)

## Markers: PASS, keep as they are
All 24 markers passed review and are already in the game. Don't redraw them.

## Slums, industry, city tiles: FAIL, redraw all 48
The street margin is right in principle, but all three sets fail when tiled (see `review/tiled-*.png`):

1. **Every tile shows a frame.** The margin is drawn in a different shade from the alleys inside the
   tile (darker dirt on slums, a lighter rim on industry, a pale snow band round the dark city tiles in
   winter). Side by side the tiles read as a grid of framed squares. The edge margin must be exactly
   the same ground as the streets and alleys inside, in the same shade and texture, so that you can't
   tell where one tile ends and the next begins. Only the buildings stop short of the edge.
2. **The winter ground is flat.** It's one pale blue-grey with no texture. Use snow with texture,
   tracks and shading like the reference winter grass, and show slush or dirt in the alleys and streets.
3. **The slums are too sparse and too tidy.** They read as a few neat boxes on empty dirt. Pack the
   shacks densely (most of the tile covered), with lean-tos, tarps, patched roofs, clutter and narrow
   crooked alleys between them, like `current-slums-pattern.png` at half its scale.
4. **Industry has near-duplicates.** Several tiles are the same sheds moved a little. Make the 8 clearly
   different: rail sidings, tank farms, a big hall, yards with crates and stacks, cooling towers.
5. **The city's winter tiles are pale tiles with dark towers.** Keep the dark streets in winter: snow on
   roofs, slush on streets.

Check the result the way the review did: lay each set out tiled 8 across and 2 down, in random order,
and make sure there are no seams and no repeating look.

## New: suburbs (32 PNGs, 48x48, opaque)
Today's suburbs are the old pattern scaled down by script (`suburbs-now-in-game.png`), which leaves them
soft. Draw them natively: `suburb-0..7.png` plus `suburb@spring-`, `suburb@autumn-`, `suburb@winter-`
`0..7.png` (the same 8 layouts in each season). Each tile is two rows of small detached houses
(each roof about 8 to 10 px) with gardens, trees and driveways, on a street grid. The streets run along
all four edges at half their width, so tiles join into streets. Use the same seamless rule as above:
no frame. Match the modern palette (`modern-grass*.png`) and the scale of the new town markers.

## New: farmland (as tiles, 4 settings)
Today's farmland is drawn by script (`farmland-now-in-game.png`). The fields read as a harsh
checkerboard, and the farmhouses are the town house shrunk until it looks like a signpost. The owner
wants it to look like farmland seen from a plane: fields of different crops and sizes, hedgerows and
tree lines, small lanes, and the odd farmstead. Not an endless field. Draw:

- `farmland-0..6.png`, plus `@spring`, `@autumn` and `@winter` (28 files, the same 7 layouts in each
  season): 48x48 opaque tiles, each 2 or 3 fields with hedges, some with a lane. Muted, natural colours
  close to the grass references, not saturated blocks. Hedges run along the tile's edges at half
  width, so tiles join seamlessly.
- `<setting>-farmstead.png`, plus `@spring`, `@autumn` and `@winter`, for fantasy, wuxia, jazz_age and
  modern (16 files): a 48x48 field tile like the others, with a farmstead in it. The farmhouse (about
  12 to 16 px, drawn for this scale, not shrunk) is in that setting's style (see `*-house.png`), with a
  barn or shed, a yard and a lane to the tile's edge.

Same pixel rules as before: clean grid, no blur, reference palettes. Put everything in `art-drop/out/`,
run your critic loop until nothing fails, then push. Keep the markers untouched.
