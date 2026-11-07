# Round 9: suburbs as props (owner, 2026-11-07 16:53: "Surely suburbs, at least")

Same approach as BRIEF-8: individual sprites planted like trees over a plain ground, replacing the one-cell suburb tiles. Transparent PNGs in `art-drop/out/`, in the house style of the approved markers and the town markers: three-quarter overhead, top-left light, 1 px dark outline. Four seasons: no suffix, `@spring`, `@autumn` and `@winter`.

**Style:** these houses are used only in the modern and jazz_age (1920s) settings. Draw a timeless style that fits both: brick and clapboard homes, bungalows and small cottages. No cyberpunk, wasteland or fantasy details, no cars that are clearly modern (keep any car generic and boxy), and no satellite dishes.

## A. Houses, `suburb<season>-house-0..11.png`, 48x48, standing on the bottom-centre
- **SIZE (revised 20:40 after in-game QC):** each house is 30-36 px wide and 28-36 px tall, filling about 65-75% of the cell, so it isn't a speck on the map (a cell is about 27 px on screen).
- Detached homes with real detail: windows, doors, a porch or garage, a chimney, and a side tree. Gable, hip and flat roofs in several roof colours (red tile, grey slate, brown shingle, dark blue). Some have a garage, a porch, a chimney, a tree beside them, a small fenced yard, or a driveway stub leading down to the bottom edge.
- 2 of the 12 are small community pieces: a corner shop and a little church or school.
- Every house is clearly different in footprint and roof.
- Snow on the roofs in winter. In autumn, the side trees turn colour.

## B. Garden and yard props, `suburb<season>-yard-0..7.png`, 48x48
- A hedge row, a garden shed, a pool, a playground, a vegetable patch, a cluster of small trees, a parked car, a picket fence corner.
- **SIZE (revised):** in proportion to the new houses, filling about 50-60% of the cell.

## Ground
Use the existing grass bases. The game draws streets as roads. No suburb ground texture is needed.

## Placement (game side)
Houses on a loose grid along the streets near towns and cities, with yard props in the gaps, thinning towards the edge.

## QC
- Lay out a suburb at 1x on out/grass-base.png, with a road through it.
- It must read as a calm neighbourhood with varied houses, not a stamp pattern.
- Check each sprite at 8x.
