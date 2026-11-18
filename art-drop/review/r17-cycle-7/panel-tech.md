Modular tech review — cycle 7

Coordinates below are pixels in the 1920×1440 final image, measured from the top left. Inspected the full 1x and 2x renders, comparison sheet, all four house and six hall references, and BRIEF-17. Made and viewed in-memory Pillow nearest-neighbour 3x crops of the square (720,432–1104,768), side street (480,288–720,720), and gate (1128,1032–1392,1440), plus roof contacts, wall seams, the church attachment and market hall. The 2x file is an exact nearest-neighbour enlargement. No `critic-r17R*squint*` file exists in this checkout; inspected both `r17-R-city-squint-1x.png` and the current `r17-city-final-squint.png`, judging the current composition from the latter.

**1. What works**

Most horizontal storey joins are closed. Southward building overlap generally reads in the correct order. The church, guildhall and pale gate road survive greyscale. Street frontages are paved. The inspected five-piece roof runs and north-curtain sequence contain no more than two identical asset IDs; repetition alone is not a proven count-rule failure here.

**2. Blocking problems**

1. **Attached roofs still behave like isolated sprite caps.** North row behind the guildhall, x720–1056, y256–340: grey ground wedges descend between the red caps, especially around x808–820 and x950–966. The facades touch, but the roofs have neither a convincing shared valley nor a party-wall closure. At the eastern return, x1472–1504, y400–672, exposed masonry becomes a straight vertical zipper beside the slate roofs. It does not convincingly describe the receiving wall and flashing around the stepped roof contact. These are assembly failures, not useful silhouette variation.

2. **The north curtain has visible vertical construction scars.** Between the northwest tower and the next tower, x96–336, y128–240, particularly near x224 and x272, straight dark/light strips interrupt the stone courses. The seams run through too much of the wall height to read as ordinary mortar. Similar striped joins recur farther east. The crenellation edge is continuous; the wall face beneath it is visibly assembled from patched rectangles.

3. **The gate bridge, bearing and stair do not resolve into one structure.** South gate, x1176–1344, y1256–1416. A pale coping block, a nearly black bridge face, the arch lip and the right stair landing present competing front edges and material scales. The stair's upper contact is buried against the bridge corner instead of exposing a clear continuous landing. At 3x this reads as several overlays covering one another. A visible arch opening does not make the attachment ship-ready. This is a static join/draw-order readability failure; the render cannot establish runtime walk-behind correctness.

4. **The market hall's roof volume is unresolved.** South edge of the square, x768–960, y1056–1200. The tall rear arcade stands above an exposed floor and counters, while an isolated orange roof strip sits across the foreground. It reads as an open-topped cutaway with a canopy pasted onto its front, not a complete roofed hall in the houses' 3/4 view. The separate arcade/roof layers are plainly visible as kit parts. The square needs this landmark to read as a building.

**3. Ranked suggestions**

1. **Close the roof contacts before adding detail.** Author left/right 48×96 roof-valley and hip-end adapters for the north red row; add 48×144 versions for deeper roofs. Preserve the existing ridge/eave heights and replace the exposed paving wedges with roof or owned masonry. Use 16×48 firewall body sections, one coping at the exposed top, and a 1–2 px flashing contour following the lower roof. At the eastern return, replace the continuous upright strip with that stepped receiver. Draw receiver first, lower roof second, contact flashing last; keep all three within their property's mask.

2. **Rebuild the gate base as one coordinated assembly.** Use a 192×192 authoring canvas covering x1176–1368, y1248–1440: the 96 px bridge span, tower bearings, portal and 48 px right stair must share one stone scale and one walk-surface height. Draw the landing into the stair/bridge junction, not as another cap over it. Export separate rear structure and foreground parapet masks from that same drawing. Sort actors by their actual ground or stair surface; do not rely on successively later overlay priorities to hide the join.

3. **Repair the wall tiles as a connected set.** Redraw the scarred columns inside the 96×144 curtain variants, starting with the section at x192–288. Match the outermost two pixel columns and mortar-course heights across every A/B/C pairing, including C→A. Keep the top-left highlights and a single exterior outline; remove interior outlines masquerading as tile borders. Inspect a five-module 480×144 strip at 1x and 3x before replacing the city's north wall.

4. **Give the market hall a complete roof.** Within its existing 192×144 allocation, draw a coherent 192×96 roof plane with a ridge, side return and continuous eave shadow, supported by the arcade below. The roof must occlude the appropriate floor/counter pixels. Retain the north-facing entrance through an explicit entrance footprint and foreground reveal mask, rather than leaving the middle of the building permanently roofless. Match the roof pitch and tile scale to the nearby house references.

5. **Break the mechanical cadence without breaking the count rule.** The curtain's A/B/C cycle passes the literal rule but remains obvious across x96–1824. Choose variants with a rolling five-piece check and prohibit repeating the same three-piece sequence immediately. Make one additional 96×144 wall-face variant with genuinely different stone grouping. For the recurring slate corner house at x528 and x1392, draw a second 96 px-wide roof/body arrangement with a different dormer position and brick infill; recolouring the same silhouette will not disguise it.

6. **Normalize contact scale, not whole sprites.** The eastern brick corner houses, thin masonry returns and adjacent timber fronts use visibly different stone/edge scales. Redraw the 16 px receiving margins and their 48 px-high course transitions at native resolution. Keep a single 1 px silhouette, a consistent eave thickness and the same top-left light direction. Do not squeeze complete window bays to manufacture room for a return. Verify the finished corner at 1x against `fantasy-house-2.png`, then at 3x for doubled outlines.

SCORE: 5/10
BLOCKING: 4
