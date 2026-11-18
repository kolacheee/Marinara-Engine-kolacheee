Modular tech review — cycle 6

Coordinates below are pixels in the 1920×1440 final render, origin at top left. Inspected the full 1× and 2× renders, comparison sheet, all supplied house/hall references, and freshly made Pillow nearest-neighbour 3× crops of the square, west side street, south gate, north wall, and southern roof row. Crops were kept in memory. No `critic-r17R*squint*` file exists in this checkout; inspected `r17-R-city-squint-1x.png`, the current `r17-city-final-squint.png`, and the newer C5 wall-stair squint. Findings below concern the current final image.

What works: Storey courses generally connect without transparent horizontal slits. Foreground towers and gate posts cover the curtain-wall ends correctly in this frame. The church, guildhall and market hall frame the square; the church and gate survive greyscale. The wall/tower A/B/C sequences respect the two-in-five limit. Street frontages have no lawns.

Blocking problems:

1. **The north wall advertises its tile boundaries.** At approximately x=192, 480 and 672, y=96–240, dark vertical borders divide smooth masonry from weathered masonry. Stone courses and parapet treatment change abruptly at the same boundaries. These are rectangular asset edges, not drawn construction joints. The 3× crop makes the boxed panels obvious; the divisions remain visible at 1×. A continuous defensive wall cannot ship with this seam pattern.

2. **Three identical facade pieces occur in a five-house sequence.** Take the northeast frontage houses beginning at x=1104, 1200, 1296, 1392 and 1488, including the house across the intervening side lane. The red panel with a large dark opening and oval surround repeats at **(1104,480), (1200,576), and (1488,432)**, each 96×48. These are all `floor-c-c5-w2`; their sampled 72×36 interior regions are pixel-identical. Moving the panel to a different floor does not create a variant. This exceeds the requested maximum of two identical pieces in five houses.

3. **Roof contacts do not close the building volumes.** In the slate group east of the guildhall, x=1056–1344, y=336–480, ordinary paving forms tapering wedges between roofs that touch at their front eaves. The clearest is beside the apothecary roof, around x=1190–1225, y=350–470. There is no continuous valley, receiving wall or flashing surface explaining the opening. The four narrow southern roofs at x=528–720, y=1104–1200 repeat the same open-backed comb. At the west height change, x=232–240, y=432–576, the masonry return reads as a thin facade border, not the exposed side of the taller house. Coping exists, but the kit still lacks convincing depth at the actual contacts.

4. **Shadow boundaries reveal the assembly grid.** The continuous north curtain casts separate scalloped patches at 96 px intervals along y=240–270. Along the guildhall/apothecary frontage, x=720–1344, y=672–720, shadows repeatedly terminate at the individual lot's right edge. The buildings sit on separate dark mats. This is especially conspicuous in greyscale. A continuous wall needs a continuous cast shadow; clipping each caster to its own sprite width creates false lighting breaks.

Ranked suggestions:

1. **Repair the wall edge contract first.** Redraw the three 96×144 curtain variants with matching masonry-course heights, parapet thickness and edge colours. Reserve the first/last 2 columns for compatible joins. Remove full-height outlines at internal contacts; retain the 1 px outline on exposed silhouettes. Put weathering inside the panel, or draw an explicit 8–16 px repair joint where materials change. Check A–B, B–C, C–A and each variant against the tower and stair returns at native scale.

2. **Build roof joins from footprint and height, not touching sprite rectangles.** Add 48×96 and 48×144 valley/abutment pieces for the two roof depths. At x=1200 beside the apothecary, close the paving wedge with a shaded receiving wall and a continuous flashing line following the lower roof. Give tall/short contacts an 8–16 px visible masonry face with one coping. Draw receiving walls before the lower roof and flashing after it. Preserve the intentional northwest court at x=240–336, y=432–480; do not fill genuine courts indiscriminately.

3. **Replace one of the three red panels.** Replace the apothecary panel at (1104,480) with a new 96×48 plaster bay: one 24×28 shuttered recess at local (36,8), a restrained sill, and the existing top/bottom connection courses. Keep its palette within the block's two wall colours. Audit consecutive frontage houses across floor levels and side-lane interruptions using resolved asset identities; different floor positions and cropped edge returns must not reset the count.

4. **Join cast shadows before compositing.** Treat the north curtain as one connected caster between genuine offsets, then project its silhouette southeast onto the street receiver. For attached houses, union the projected shadow masks before applying opacity; retain separate masks for ground, roof and wall receivers. Keep opacity at or below 50%, hard pixel edges, and the top-left light. Eliminate the artificial reset at x=192 and the abrupt right-edge cutoff at x=1200.

5. **Give side-street pairs a second silhouette.** The repeated complete houses at x=336, y=288/480 and x=480, y=288/480 meet the numerical limit but still look stamped. Make one alternate 96×192 side-house with a different door/window arrangement and a roof termination that preserves the same landing and eave anchors. Use it once in each pair; changing colour alone will not hide the duplicate shape.

6. **Prove the gate's moving draw order before integration.** The still image has no obvious wall-through-gate inversion. Use a 24×48 actor with foot anchors at (1248,1392) and (1248,1440) to verify passage under the lintel and emergence in front. Keep ground, gate body and foreground arch separate, with actor sorting based on feet. Repeat beside the church's east door at (720,1000); a single static showcase cannot establish those crossings.

SCORE: 5/10
BLOCKING: 4
