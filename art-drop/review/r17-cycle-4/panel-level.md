# RPG level design / player review

Coordinates below are pixels in the 1920×1440 final image, measured from the top-left; one cell is 48 px. This judges visible navigation and interaction cues, not runtime collision.

Inspected the full final at 1x and 2x, the comparison sheet, all four house and six hall references, and fresh Pillow nearest-neighbour 3x crops made in memory: square `(720,720)–(1152,1056)`, east side street `(1392,720)–(1776,1056)`, wall/gate `(1152,1008)–(1392,1440)`, plus inn, temple/craft court, and northern entrances. No `critic-r17R*squint*` file exists in this checkout. Inspected the R-series `r17-R-city-squint-1x.png` and the newer `r17-city-final-squint.png`; findings concern the final image.

## 1. What works

- At 1x I can locate the temple, southern gate, tankard-marked inn, and the signed baker, apothecary, smith, cobbler, tailor, scribe and butcher. Ordinary awnings say “shop,” but usually do not identify the trade.
- The church west of the square and clock hall to its north give useful bearings. The fountain, market hall and six stalls make the middle a destination. This is a substantial navigation improvement over R15's anonymous frontage.
- The square has circulation space around the stall rows. The church stair is a convincing entrance. Carts, washing, goods and people establish occupation.

## 2. Blocking problems

1. **The gate is identifiable; its traversable route is not equally convincing.** South centre, approximately `x1176–1320, y1056–1440`. The broad lower arch becomes a roughly 32 px visible slit between the tall towers, with a person standing in it. The image does not explain which stonework the player can pass behind. Above it, the approach meets the inn frontage and must turn toward the square. The lighter paving survives greyscale, but the tower occlusion and turn remain harder to read than the monumental gate itself. A main arrival route should not require guessing the walkable footprint. This is a visual access blocker, not a claim that the collision map is broken.

2. **The inn advertises beer more clearly than it offers an entrance.** Southeast edge of the square, `x1296–1392, y960–1056`. The tankard is unmistakable; the small dark doorway beneath it is not. The neighbouring green-filled arch can read as a decorative panel or a courtyard entrance, while adjacent ordinary doors compete with the actual inn door. A player arriving through the gate should know exactly where to walk to rest. The church already provides that clarity; this key service does not.

## 3. Ranked suggestions

1. **Resolve the gate footprint and arrival turn.** Rework the gate within a four-cell-wide, 192 px envelope centred near `x1248`, retaining a 96 px clear ground-level opening. Make the covered passage visibly dark, with a continuous pale threshold on both sides. Carry a 96 px road north from the gate, turn west in the open strip at `y1056–1152`, then north along the square's east edge at `x1104–1200`. Give the bend a square kerb corner and a 2–3 px gutter. In code, separate the tower bases from the overhead arch; reveal the player when behind the overhead section. Check the whole route with a character and cart footprint before placing NPCs.

2. **Give the inn one dominant entrance.** Replace the ground-floor frontage beneath the tankard at `x1296–1392, y1008–1056` with a 96×48 px inn-front: a 24–32 px door, a conspicuous lit step, and a shallow porch. Keep the tankard above that door rather than above an ambiguous dark recess. Render the adjacent courtyard arch as a recessed opening with paving continuing through it. Leave a full 48×48 px landing clear of people and props. A small bed motif on a secondary board can confirm lodging without enlarging the existing sign.

3. **Make locations outside the square memorable.** The north row (`y288–672`) and southwest blocks (`y1056–1344`) are too interchangeable: red roofs, cream window stacks, repeated shop bays. Keep the square's hierarchy, but give the southwest craft block at `x144–432, y768–1008` one 48×48 px forge-work apron and a distinct chimney/smoke silhouette. Give one northeast merchant block a coherent slate roof colour and two 48 px banner overlays. Keep the southeast poor quarter lower and patched. Limit each block to two wall colours and one roof colour; explicitly audit every five adjoining pieces for the two-identical maximum. These should become directions a player can remember, not extra decoration everywhere.

4. **Fix the craft court's street edge.** At `x240–336, y912–1008`, grass reaches the open frontage between the smith and cobbler. Replace the southern 96×48 px strip with worn paving or packed earth. Retain greenery deeper inside the yard. Attach the loose fence segment around `(264,1024)` to a plot boundary instead of leaving it in the public approach. Keep a marked 48 px route to the rear stair, with the well and laundry outside it. The enclosed churchyard does not need the same treatment.

5. **Use the existing east dead end as a small destination.** In the 96 px lane at `x1488–1584, y864–1056`, keep the western 48 px strip continuously clear. Put the cart, crate and fence together in one 48×48 px loading bay on the eastern edge; keep the tub tree against that same edge farther north. Add a 24×24 px trade marker beside the little rear workshop door near `(1536,840)`. Then the alley promises a specific visit instead of merely ending behind the tailor.

6. **Stage activities, not repeated front-facing figures.** In the market at `x912–1104, y768–1008`, replace several identical standing poses with a seller behind each counter, two customers facing goods, and one porter handling the cart near `(888,888)`. Add side/back-facing variants at the existing character scale, roughly 12–16×28–32 px. Put a seated figure at the churchyard bench and a guard beside, rather than inside, the gate opening. Keep the 96 px market crossing and arrival road clear. There are enough people; their placement needs purpose.

Keep all new pieces on the 48 px grid, with the references' 3/4 depth, top-left lighting, 1 px outlines and hard pixel edges. Do not solve navigation by adding more oversized signs.

SCORE: 6/10
BLOCKING: 2
