# Cycle 5 — RPG level design / player review

Reviewed the final at 1× and 2×, the comparison sheet, all supplied fantasy-house and fantasy-hall references, and four newly made Pillow nearest-neighbour 3× crops: square (480,624–1200,1104), west side street (96,432–528,1008), gate/inn (1056,864–1488,1440), and northeast street (1296,384–1824,816). Crops were inspected in memory; no crop files were written. No `critic-r17R*squint*` file exists in this checkout. Used `r17-city-final-squint.png` and also inspected `r17-R-city-squint-1x.png`; judgments below concern the final. Coordinates are approximate pixels in the 1920×1440 final, measured from its top-left. This is a visual navigation review, not a collision test.

## 1. What works

- I can locate the temple west of the square, inn southeast of it, southern gate, and seven signed trades at 1×. The tankard even includes a bed. The signs do their job.
- Temple, clock hall, fountain and inn corner give the centre recognizable destinations. The temple, twin gate towers and pale gate road survive greyscale. Main approaches have visible room for movement.
- Stalls, people, laundry, carts and small courts establish use. Compared with R15, this has actual destinations and a better central landmark hierarchy.

## 2. Blocking problems

1. **Several shop fronts contradict their signs.** At the apothecary, approximately (1104–1200,624–768), the bottle sign sits above the same brown loaf-like display used by the baker at (720–816,576–672). The cobbler at (336–432,864–1008) and tailor at (1584–1680,864–1008) repeat that display too. I can find a trade from above, then lose confidence when I reach its counter. These need trade-specific ground floors before shipping; an enormous sign cannot carry the entire identity of a shop.

2. **Finding the inn does not clearly identify its interaction point.** At (1296–1392,1008–1056), a dark entrance and brighter through-arch sit side by side beneath the sign. The through-arch attracts the eye more strongly than the room entrance. Across the northern shop fronts, lanterns and pale thresholds also appear on otherwise generic doors without a strong distinction between usable and decorative entrances. The temple's substantial stair is much clearer. A player should not have to try every opening to learn the town's door language. The image does not establish that language reliably.

3. **The secondary street network lacks readable boundaries and memorable junctions.** The northeast opening around (1344–1776,624–768) is a broad cobbled apron with faint seams, not a clearly bounded street and court. The northwest court around (240–336,432–720) uses essentially the same paving as the public routes. The north wall lane at y=240–288 runs across almost the entire map with no useful local destination or meaningful change in its visible cross-section. These spaces are probably traversable, but their purpose is not apparent. Away from the central landmarks, I remember repeated roof strips and grey gaps, not a sequence of places. The comparison sheet exposes the tradeoff: R15's geometry was monotonous, but its square had a much clearer ground boundary. The final needs both recognizable places and a legible network.

## 3. Ranked suggestions

1. **Replace the misleading counters first.** Make 48×48 ground-shop variants using the existing door/counter split. At the apothecary, draw three grouped bottles and a mortar; at the cobbler, two boot silhouettes and a leather roll; at the tailor, folded cloth and one hanging garment. Use two or three solid goods masses per counter. Keep the loaf display at the baker. Replace the counter cells beneath the signs at the coordinates above; do not enlarge the signs again.

2. **Give the inn a single unmistakable front door.** Redraw its 96×48 ground frontage at approximately (1296,1008). Give the western entrance a 32×8 light stone step and a visible lantern; retain the eastern 48 px bay as the courtyard passage, with receding paving and a darker upper arch. Reserve a clear 48×48 approach cell directly south of the entrance. Apply the same light-step/lantern convention to every usable shop door, and shutter or dim noninteractive openings. Keep the gate-to-inn approach free of added props.

3. **Resolve the northeast apron into a route and a place.** Preserve a 96 px east–west public route around y=672–768. Mark its edges with straight kerbs and darker gutters; let a 48 px branch turn north at x=1584–1632. Give the recess north of that route a visibly different court surface and a 48×48 shrine or public noticeboard near (1440,624), outside the through route. At the northwest court mouth near (288,672), add a straight threshold and distinguish the inner ground. Each opening must read as a public turn, a private court, or a closed end.

4. **Finish framing the square on the ground.** Keep the temple, clock hall and inn where they are. Use a quieter 48×48 large-slab paving set over the central area approximately x=720–1104, y=672–1056, with a stepped boundary around the existing buildings. Leave a continuous 96 px route beside the stalls and at least 48 px around the fountain and temple stair. Continue the pale gate-road material through its bend at the inn. In greyscale, the square should read as one destination rather than the same cobbles between larger objects.

5. **Give long routes intermediate orientation points.** Along the north wall, retain the required clear 48 px inner lane. At the junction near x=672, make a 96×48 recess on the building side with a well and bench; at x=1344 use a different 96×48 recess with a guard noticeboard. Rework adjacent block edges in 48 px steps so no unchanged street-width run exceeds eight cells. Keep courts enclosed by side/rear walls and compact roof volumes in the references' 3/4 view; do not solve this with more uninterrupted roof strips.

6. **Replace the market's clone formation with activity.** All six stallkeepers use the same pale outfit and pose, regularly spaced above their canopies at roughly x=960/1008/1056, y=768/888. Draw three distinct vendor silhouettes, about 16×32 px, and use each no more than twice. Turn two customers toward counters. Move the existing cart into a 48×48 loading pocket beside the market hall and add a porter facing it. Add one seated figure at the churchyard bench and one guard beside, not inside, the gate opening. This gives people reasons to stand where they do.

7. **Give the craft corner a secondary identity.** Add a 48×48 forge/workbench cell behind the anvil-sign frontage near (240,912), with a dark tool rack and a small warm furnace opening. Add a hard-edged smoke sprite above its roof, within that lot. This makes “turn at the forge” useful even when the sign is offscreen. Keep all new placement on the 48 px grid, retain top-left light and 1 px outlines, and use straight paving/kerb edges, no blur and no street-front lawns.

SCORE: 6/10
BLOCKING: 3
