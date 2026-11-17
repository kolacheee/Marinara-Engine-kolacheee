# Owner review — cycle 4

**No. I would not ship this as the game's walkable city.** It is a better collection of city assets, but the assembled district still looks like a demonstration of the kit. Adding more props will not fix that.

Reviewed the final at 1× and 2×, the comparison sheet, today's fantasy panel, round 15, and all supplied house/hall references. Made and inspected Pillow nearest-neighbour 3× crops of the square `(672,672–1200,1056)`, western side street `(384,288–720,672)`, gate/wall `(1104,1008–1392,1440)`, western court `(144,720–480,1056)`, and northeast roof/facade `(1392,288–1584,624)`. Crops were kept in memory. No `critic-r17R*squint*` image exists in this checkout; used the newer full-city `r17-city-final-squint.png`. Coordinates below refer to the 1920×1440 final, origin at top left.

## 1) What works

The church, guildhall and gate are recognisable destinations. Roof depth, cast shadows and full-size stalls improve on round 15. Most of today's lawn has gone. That is the short list.

## 2) Blocking problems

1. **The square is only partly framed, and the district remains a set of islands.** Where: square and approaches, approximately `(480,624–1488,1104)`; northern blocks `(144,288–1776,672)`. The guildhall anchors the north and the church occupies the west, but the market hall floats inside the open ground, southern roofs present their backs, and the east edge is mostly a generic tall block. Paving pours around everything. Side streets feel like spaces left between placed sprites, not streets the buildings were designed around. Today's fantasy town had isolated buildings in lawns; this retains too much of that arrangement after replacing the lawns with stone. Round 15's square had a clearer ground boundary and more continuous enclosing frontage, despite its other failures.

2. **Ordinary houses still fail the reference-art test.** Where: northwest shop pair `(480,288–672,576)` and northeast pair `(1392,288–1584,624)`, representative of most housing. The references have connected roof, gable, beam, wall and plinth volumes. Here, richly textured roof caps sit on flat cream rectangles with identical inset window stamps. The simple shutters and broad, empty plaster do not belong to the same finish as the shop floors and landmarks. At 3×, adjoining roof modules also jump abruptly between small tile courses and much larger scalloped tiles. The long north–south streets expose ruler-straight building edges without convincing side-wall depth. This is still cardboard with better roofs.

3. **Copying is visible before the city has any identity.** Where: northeast tall house `(1488,432–1584,576)`, northwest/southwest housing groups, and the continuous northern wall. The northeast house contains three consecutive, pixel-identical 96×48 two-window storeys; I checked the crop pixels. That fails the stated repetition limit in the vertical stack. Repeated green/purple shop pairs, window grids, roof ridges and laundry-yard arrangements make distant blocks interchangeable. Most of the city is the same orange-and-cream family; the little brown-roof patch at bottom right is insufficient district differentiation.

4. **The forbidden frontage lawns remain.** Where: fenced patch beside the church `(576,672–720,768)` and open western craft court `(240,912–336,1008)`. The first is a little lawn directly on the square approach. The second is grass exposed between two shopfronts, with a detached fence segment sitting out on the paving below it. Neither reads as a concealed rear garden. These are visible violations, not optional polish.

5. **Walking and entering still depend too much on inference.** Where: gate approach `(1152,1008–1344,1440)`, square floor, and all narrow north–south lanes. In greyscale the church and gate survive; the guildhall is carried mainly by its spire, while repeated bright window panels compete with it. The lighter gate paving exists, but its continuation into the market is weak, and much of the remaining road/square/court surface has the same value and texture. Oversized bread, bottle, anvil, boot and beer signs identify trades, but dominate their doors and sometimes an entire storey. Entrance steps and lantern cues are inconsistent. A static render cannot prove collision, but it can make the intended route and usable thresholds unambiguous; this one does not.

## 3) Ranked suggestions

1. **Rebuild the square's edges first.** Establish an irregular 8×6-cell paved core around `(720,768–1104,1056)`, with a 2×2-cell notch rather than a rectangular outline. Put the 4×3-cell market hall on its northwest edge, opening into that core. Keep the guildhall on the north edge and give the church an east-facing entrance/porch onto the west edge. Replace the west face of the eastern inn block with a proper square-facing arcade. Preserve a clear 96 px approach from the gate and a 48 px circulation lane around the six stalls.

2. **Redraw one ordinary 2-cell-wide house before reassembling the district.** Use 96×48 ground/storey modules and a 96×96 or 96×144 roof. Match `fantasy-house-2`: a visible gable, a 3–4 px eave recess, shaded beam undersides, small plaster breaks at joints, and a 4–6 px plinth top. Draw a 48 px side-return module for the western/northern side streets. Keep top-left light and a consistent 1 px outer outline. Compare this house beside the reference at 1× before multiplying it.

3. **Remove both exposed lawns.** Replace the church-side 3×2-cell patch with stone churchyard paving and one 48×48 tree-in-a-tub tile. Replace the western court's 2×2-cell grass with worn workyard paving, a drain and its existing well. Attach its fence to the plot boundary, leaving a 48 px opening; remove the loose street fence. Put any actual garden behind a rear wall or building row.

4. **Fix the roof family and repetition together.** Redraw w1/w2/w3 roof caps using one tile-size range and ridge thickness; do not enlarge tile texture with module width. At the northeast house, replace the middle of the three identical floors with a 96×48 oriel/storey variant. Add three structurally different shop fronts and two rear-yard arrangements. Validate every five-piece horizontal and vertical run, including adjoining lots, against the two-identical maximum. Use muted slate for the eastern merchant block and lower 1–2-storey brown roofs near the southeast wall, keeping each block to the brief's palette limits.

5. **Give the main route a continuous, quiet ground treatment.** Carry a distinct 96 px-wide paving strip from the southern gate to the market, bending around the inn frontage; leave it free of crates and stall counters. Draw 48 px side streets and 24 px lanes with 2–3 px gutters and restrained kerbs. Extend selected blocks into surplus paving by one 48 px cell, retain the 48 px wall lane, and introduce a bend or T-junction within each eight-cell street run. Lower cobble contrast so the route, square and building shadows remain distinguishable in greyscale.

6. **Bring trade signs back into the architecture.** Redraw bread, bottle, boot, anvil and beer signs within 32×40 px silhouettes on 8–12 px brackets beside entrances. Keep their recognisable symbols. Give every usable door a consistent 24–32 px opening, a lit 4–6 px step and a small lantern; shutter or darken blind doors. Place signs beside the threshold rather than across the principal window/door mass. Check all eight trades and entrances at literal 1×.

SCORE: 4/10
BLOCKING: 5
