# Round 17: modular city in the town houses' 3/4 view (fantasy pilot, part 2)

Revised 11-16 23:00 UTC after a four-critic panel (pixel-art lead, town historian, RPG designer, modular tech artist) reviewed the walled-city mockup (`art-drop/review/r15-city-mockup.png`). Their asks are folded into the parts below and the new part E.

Round 15 (`art-drop/out/city15/`) proved the stacking idea: pieces join with no seam and buildings reach 1 to 5 storeys. The owner saw a full city made from them next to today's town and wants the next round. What failed:

1. **Flat fronts.** The round 15 facades are flat front elevations. The town houses (`reference/r17/fantasy-house-0..3.png`, `fantasy-hall-0..2.png`) are drawn in a high 3/4 view: the front wall faces us, and the roof is a big plane seen from above that takes up about half the sprite. Windows have sills, shutters and a dark recess; the plinth shows its top face; eaves throw a shadow line onto the wall. Next to those houses, round 15 looks like cardboard.
2. **Stripes.** Every block was one straight row facing a horizontal street, with bare paving behind. A real city block shows roofs everywhere you look from above, plus corners and side streets.
3. **No landmarks.** The square needs a hall or church, and the stalls were too small.

Same rules as every round: 48 px grid, top-left light, one-pixel dark outline, and the palette and detail level of the town houses. No rounded edges on grid art, no blur or airbrush. Transparent PNGs go in `art-drop/out/city17/`. Push after each part passes your critic, as "art-drop: round 17 part X". Make `reference/r17/` first: crop the fantasy house, hall, stall and well tiles from `packages/server/src/assets/overworld-art/fantasy.json`, and render a round 15 street with `city15/compose.py`.

## A. Facades redrawn in the town view (replaces city15 ground floors and storeys)
- The same set and names as city15 (`ground-<shop|door|arch|work>-w1..3`, `storey-<timber|plaster|stone|jetty>-w1..3` with colour variants c0..c2, wall ends, corner pieces), the same widths and stack rules, and the same fixed course on rows 0 and 47 so every piece stacks on every other with no seam.
- The look changes to the house sprites': deep window recesses with sills and shutters, beams with a lit top edge, a plinth with a visible top face, door steps, jetty overhangs with a shadow under them, lanterns and signs that stick out.
- **Calm, not busy (panel):** the round 15 pieces turn to noise at 1x. Use the houses' big masses: one main idea per storey, windows about 25% bigger with only 2 kinds per colourway, and no extra hairline timbers. Mute the yellows and blues. A block uses at most 2 wall colours and 1 roof colour.
- **Silhouette (panel):** a 1 px dark outline on the top and sides of every building, so neighbours never fuse into one slab. Light comes from the top-left, with the same light and dark ramp as the houses.
- Ground floors read as shops at 1x: big awnings in strong colours, and goods in 2-3 clear colour blocks. Give each ground kind 3 variants so the same awning never lines up twice in a row. A real door (one you can enter) has a lit step and a lantern; a blind door is dim and shuttered.
- Merchant houses get stone ground floors. Add a `storey-oriel` (a bay window that overhangs).
- Put one sample building next to `fantasy-house-2` at 1x and 4x. If it does not look like a neighbour on the same street, redraw it.

## B. Roofs seen from above (replaces city15 roofs)
- Roofs are the biggest change. The roof plane must recede *back* from the front eave, as on the town houses: tiles or thatch seen from above, a ridge line, a lit left plane and a shaded right plane.
  - Depth: a roof cap is a whole number of cells (**2 or 3**, never 1.5), plus a `roof-fill-w1` that tiles in both directions for deeper blocks, and `roof-valley`/`roof-hip-end` for L-shaped blocks. It covers the ground behind the facade, so a row of buildings hides the yard behind it.
  - Widths w1..w3, colours c0..c2 (red tile, slate blue, thatch or brown tile).
  - Chimneys, dormers and skylights are overlays as before.
- **Neighbours share eaves:** two roofs side by side meet without a gap. A taller neighbour's side wall shows above a lower roof. Add a `firewall-w0` strip: the bare side wall of a taller building, with a coping stone, tiling in both directions.
- **Shadows (panel, missing before):** `shadow-eave`, `shadow-jetty` and `shadow-street` overlay strips (dark, at most 50% alpha) that fall onto the street on the south and east side of buildings and under jetties, the wall and landmarks. A street with no shadows looks like a sticker sheet.

## C. Back of the row and side streets
- `back-<plain|stair>-w1..3`: the rear wall of a building that faces the street *behind* it, seen from our side. Plain plaster or stone, small windows, a back door, a drainpipe, an outdoor stair on `stair`. Stacks like the storeys, with the same course rows.
- `roof-back-w1..3`: the roof of that rear building seen from our side (ridge near the top, one slope).
- `side-<storey|ground>` plus `side-roof-d2`/`d3`: gable ends for buildings whose side faces a north-south street, as deep as the roof (2 or 3 cells), with the roof edge seen end-on and a few windows.
- Corners: `corner-outer-L/R`, `corner-inner`, `tee-end` and `deadend-cap`, in storey and roof versions.
- Yards with `fence-0..1` between plots, so the inside of a block reads as narrow back gardens, not paving.
- Back yards: `yard-0..3` (48x48 ground details): wells, woodpiles, washing lines, small sheds, a tree in a tub.

## D. Landmarks and market (whole sprites, same view)
- `cathedral` (5x6 cells, twin towers or one spire), `guildhall` (4x4, arcade at ground level, clock or bell turret), `townhall-market` (4x3, open-sided market hall on pillars), `gatehouse` (3x4, gate between two towers, matching the city wall if there is one), `fountain` (2x2, replaces the tiny well on a square).
- Taller than any 5-storey stack, so they read as landmarks from across the city.
- City wall: `wall-tower` (a corner or interval tower, 2x3) and a wall-walk with a shadow under it, matching the gatehouse.
- `market-cross` (1x2) and `shrine` (1x1) for squares and street corners.
- `stall-0..5` at real size, each 1x1 cell with a canopy, goods and a counter: bread, cloth, fish, fruit, pottery and spice, each with its own canopy colour.

## E. Streets, trades and districts (new, from the panel)
- **Streets:** `street-main` (2 cells wide), `street-side` (1 cell) and `lane` (half a cell, using the `lane_joined` style), each with a kerb strip and a darker gutter along the walls. Lanes are lighter than the shade cast on them. Use two cobble sizes so the ground stops shouting over the buildings. Add `mud-edge` for poor quarters and near the wall.
- **Trade signs:** `sign-<smith|baker|apothecary|cobbler|inn|scribe|tailor|butcher>`, hanging signs twice the round 15 size, each with its own shape and colour so a player can find the trade at 1x. Add an `inn-front` ground floor (wide porch, tankard sign, arch to a courtyard).
- **Districts:** variant palettes and props for market, temple, craft (forge smoke, drying racks for a dyer or tannery), rich (slate roofs, banners, stone) and poor (thatch, patched shutters, low sheds, 1-2 storeys).
- **Life:** washing lines across lanes, barrels, crates, carts, chimney-smoke overlays, cats and pigeons.

## Layout rules (for the code that builds cities; the critic blocks must follow them too)
- Lots are 1-2 cells wide and deep, with a yard strip behind. Rich houses on the square and main street are taller (3-5 storeys); the edges and the poor quarter are lower (1-2 storeys).
- No street width runs more than 8 cells unchanged. Block edges jog by a cell, and T-junctions, one bent street and one wedge-shaped block appear in each district.
- Squares are irregular (L or trapezoid, at least 6x5 cells). The church sits offset on one edge with a small churchyard, the guildhall faces it, and the market cross or fountain is in the open middle, with 6-8 stalls in rows.
- A 1-cell free lane runs inside the city wall; towers every ~8 cells; the gate road is wider and paved differently, so the way out is obvious.
- Every piece is anchored at its bottom-left cell. Draw order is by base row (north first), and within a row: ground, storeys, roof, then overlays. Overlays never cross a lot edge.
- At most 2 identical pieces in a row of 5.

## Critic (at most 4 rounds per part)
- Build these with `compose.py`, extended for back rows, side streets and landmarks:
  - a 16x12-cell block with an L-shape, a T-junction and a dead end between two east-west streets and a north-south lane;
  - an irregular market square with a cathedral, a guildhall, a market cross and six stalls;
  - a 5-storey building next to a 1-storey one (roof over facade order, firewall);
  - a seam sheet for every piece: next to itself and its variants.
- Render each block at 1x and 3x. Put it next to the round 15 render and the current town at 1x.
- It fails if:
  - any piece reads as flat or cardboard next to the town houses;
  - any bare ground shows inside a block that should be roofs;
  - there is a seam or gap between pieces;
  - neighbours repeat in a way that looks copy-pasted;
  - a landmark is not clearly the biggest thing on its square;
  - in a greyscale "squint" render at 1x, landmarks, the gate and the main street do not stand out;
  - a trade sign cannot be named at 1x;
  - a street has no shadow falling on it.
- Order: A, B, C, D, E. Push each part when its critic passes.
