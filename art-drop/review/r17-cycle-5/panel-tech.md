# Modular tech review — cycle 5

Coordinates below are pixels in the 1920×1440 final image, measured from its top-left.

Inspected the full final at 1x and 2x, the comparison sheet, all supplied fantasy-house and fantasy-hall references, and fresh Pillow nearest-neighbour 3x crops of the square, west side street, gate, north wall, northeast frontage and square paving. Crops were made in memory. No `critic-r17R*squint*` file exists in this checkout; inspected `r17-city-final-squint.png` and the newest available squint, `r17-C4-regression-height-test-squint-1x.png`, instead.

## 1. What works

The square has identifiable landmark masses, the gate opening remains legible in greyscale, and the main route has a distinct value. Ground-floor thresholds generally survive overlaps. Pixels stay sharp and street frontages have no lawns. The recorded C4 repetition audit reports zero failures; sampled image runs did not establish a three-identical-in-five violation. That does not make the repeated construction visually convincing.

## 2. Blocking problems

1. **Roof fills do not describe the same volume as their end pieces.** Northwest block, **x144–432, y288–528**; slate roof at **x480–576, y288–432**; northeast pair at **x1392–1584, y288–432**. Horizontal, fine-textured rectangular fills end against much coarser diagonal gable or hip planes. At **y384** in the northwest block and **y336** on the slate roof, tile direction and scale jump across a straight cut without a credible ridge, valley or change of pitch. Vertical borders at **x240 and x336** expose the strip assembly. At 1x these are long roof-texture rectangles with shaped ends attached. The comparison's town houses have coherent roof planes; these do not.

2. **Neighbour boundaries change construction at each storey.** Northeast adjoining houses, **x1476–1500, y384–576**; bakery/low neighbour boundary, **x804–828, y480–672**. Bevels, dark returns and exposed masonry widen or disappear as the next facade module starts. The northeast joint produces little sideways steps at successive floor courses instead of one continuous party wall. Where its lower slate roof meets the higher neighbour, there is no clearly readable continuous coping/flashing treatment. Some return pixels exist; the problem is their inconsistent assembled silhouette. A thin dark separator alone does not explain the height difference.

3. **The curtain wall changes drawing systems at its joins.** North wall, particularly **x864–1056, y96–240**, including the stair/walk attachment at **x960–1056, y96–144**; northwest turn around **x0–144, y192–288**. Weathered, chunky tower masonry meets a long, mechanically regular brick fill beneath a separate fascia. The stair attachment changes the parapet profile and surface texture at an abrupt rectangular boundary. The west return then becomes a much plainer vertical strip. Towers conceal some endpoints, but the visible material and depth transitions still identify the pieces immediately. These need designed connections, not more overlays covering the edges.

4. **Solid objects cast detached strip shadows.** Fountain, **x816–912, y984–1032**: its broad, solid plinth casts separate narrow diagonal wedges with bright paving between them. The shadow reads like the output of a repeating support strip, not that object's footprint. The gate's east shadow, approximately **x1315–1348, y1120–1344**, is also a long rectangular band that scarcely describes its tower silhouette. Top-left lighting is broadly consistent, but caster shape and ground contact are not. This is particularly exposed in the open square.

## 3. Ranked suggestions

1. **Rebuild the roof connection vocabulary first.** Draw slope-specific **48×48** fills with matching tile spacing, **48×48** ridge/valley transition cells, and coherent **96×96 / 96×144** gable or hip assemblies. Replace the northwest red block and the **x480** slate example first. Continue the same ridge and lighting through each fill; reserve dark outlines for actual roof boundaries. Validate those assemblies beside `fantasy-house-2` at 1x before replacing the other long strips.

2. **Generate one continuous return per building boundary.** At **x1488**, reserve an **8 px** masonry strip on the taller lot, sized from the neighbouring roof intersection to the required wall endpoint. Use a single **1 px** outer contour, a **2–4 px** coping/flashing edge, and a repeatable body without restarting caps every 48 px. Mask the lower roof against that return. Remove the conflicting baked side bevels from intermediate facade panels. Apply the same treatment at **x816**. Sort the complete lot by its ground baseline, then resolve its roof/return attachments; do not let individual storey decoration establish the neighbour edge.

3. **Give the wall a complete structural module.** Draw a **96×144** curtain section carrying the same stone scale from parapet to foot, plus **48×48** tower shoulders and outer-turn connections. Rework **x864–1056** as the acceptance sample. The stair needs a matching landing and end wall at its join with the ordinary walk. Keep the shared course heights identical across all variants; vary wear and openings without altering the connection profile.

4. **Replace generic strip shadows on landmarks with caster masks.** Start with a **96×48** ground-shadow overlay for the fountain: a continuous contact edge under its south/east base and a southeast extension consistent with the other square props. Use a separate silhouette-derived gate mask, clipped to ground receivers. Union overlapping shadows before compositing so joins do not become darker patches. Retain hard pixel edges and no more than 50% opacity.

5. **Spend variation on geometry after the exact-repeat rule passes.** The long northern roof starts all align around **y288**, and adjacent facades reuse the same broad window rhythms despite different arrangements. Introduce a **48 px** ridge setback in the northwest and northeast blocks and one **96×48** transverse roof connection per block. Keep the existing five-piece audit, but compare silhouette and window arrangement as well as resolved piece identity. Adding another chimney to the same roof rectangle will not solve this.

SCORE: 4/10
BLOCKING: 4
