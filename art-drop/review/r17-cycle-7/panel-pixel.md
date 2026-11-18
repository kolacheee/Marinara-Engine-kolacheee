# Cycle 7 — pixel-art lead

Reviewed the final 1920×1440 image at 1x, the complete 2x export, the comparison sheet, BRIEF-17, and all supplied fantasy-house/fantasy-hall references. Made and inspected Pillow nearest-neighbour 3x crops of the square, east side street, south gate, north wall, western court, market hall and eastern signs; also checked native-size crops. Crop scratch files are outside the checkout. The 2x export exactly matches nearest-neighbour enlargement of the 1x image.

No `critic-r17R*squint*` image exists in this checkout. Used `r17-city-final-squint.png` and the newer `r17-C6-{square,street,gate}-squint-1x.png` images. Coordinates below are approximate source pixels, measured from the upper-left of the final 1x image.

**1) What works**

The square is framed by identifiable landmarks. The pale gate road and twin towers survive greyscale. Recessed windows, visible steps and several side returns give more volume than R15. Top-left illumination is broadly consistent, and south/east ground shadows exist. Street frontages have no lawn strips. I see no systemic rounded grid corners or export blur.

**2) Blocking problems**

1. **The town-view match is incomplete: too many elevations with roof caps.** Most evident at the guildhall north of the square, **x864–1056, y432–720**, and the narrow residential stacks along the east side street, **x1392–1584, y336–672**. The guildhall has a shallow striped roof above a dominant frontal wall; its side is barely a return. Side-street stacks alternate convincing projecting bays with almost flat window ladders and thin stone separator strips. The reference houses establish their footprint through substantial roof planes, eave overlap and coherent side depth. These pieces do not consistently share that construction. More window detail cannot fix it.

2. **The south market hall reads as a roofless cutaway.** **x768–960, y1056–1200.** Four exposed rear arches and counters sit above a narrow orange roof strip across the front. At 1x this looks like a stage or an opened dollhouse, rather than the requested roofed, open-sided hall seen from above. It is a prominent square-framing asset, so the ambiguous structure is not peripheral.

3. **The gate's central construction is an unresolved collage.** **x1176–1344, y1248–1440**, especially the dark structure immediately above the arch. Clean cream tower faces terminate behind a grey-green, heavily scratched connector and a different-looking stair. The connector's dark parallel bands obscure its top, front and supporting edges. At 1x it becomes a black equipment-shaped lump. The gate silhouette identifies an exit, but the gate itself does not read as one coherent building.

4. **Trade signs break the pixel language and outline weight.** Bread/bottle signs flanking the guildhall, **around (752,584) and (1136,584)**; scissors/quill signs on the eastern frontage, **x1584–1776, y912–1008**. Large, nearly flat pictograms with heavy dark surrounds sit on comparatively intricate, shaded architecture. The bottle and bread especially read as interface badges pasted onto walls. The signs are legible, but their contour weight and lack of object depth fail the 1 px outline/material treatment expected of the environment. The solution is not to make the symbols harder to read.

5. **Surface texture has no consistent scale or restraint.** North wall, **x432–768, y96–240**; guildhall roof, **x864–1056, y464–528**; adjoining slate roofs, **x1392–1584, y336–576**. The wall repeats the same diagonal scratch rhythm across nearly every stone course. The guildhall roof is thin horizontal striping, while neighbouring roofs use much larger tile clusters. At 1x these switch between fuzz, stripes and chunky shingles. The wall remains an unnecessarily active band in greyscale. This is noisy source drawing, not filtering blur. Sampled wall cells do not establish a literal two-in-five violation, but their shared scratch motif still advertises repetition.

**3) Ranked suggestions**

1. **Rebuild the roof and side-plane standard first.** Make native 96 px and 144 px deep roof modules for the existing 48/96/144 px frontage widths; keep depth tied to footprint as storeys are added. For the north guildhall, use a **192×96 px roof**, retaining the front eave near **y528** and extending the ridge/back edge toward **y432**. Give the exposed right wall a deliberate **12–16 px return**, a continuous 1 px outer contour and a **2–3 px eave shadow**. On the east side street, replace the thin separator-strip treatment with proper **48×96 px side-wall/side-roof assemblies** and 48×48 corner/valley joins where buildings meet. Preserve intentional fenced yards; resolve the building volumes around them.

2. **Redraw the market hall as one 192×144 px sprite at its current south-square position.** Put a continuous roof mass in the upper **192×96 px** and the open arcade/counters in the lower **192×48 px**. Show the roof's ridge, top plane and shaded right edge; put the posts beneath the front eave. Eliminate the current exposed arcade-above-roof reading. Keep openings large enough to see the stalls at 1x.

3. **Replace the gate connector with one readable 144×96 px module above the portal.** Establish a **12–16 px visible wall-walk top**, one front masonry plane, and one shaded right return that joins the stair. Use the north wall's stone ramp, with the same top-left highlights. Remove the two dark shelf-like bands and most isolated scratch pixels; retain one clear contact shadow under the projecting walk. Judge the connector at 1x before restoring small wear marks.

4. **Redraw signboards as physical props within a 48×48 px envelope.** Use roughly **32×40 px boards**, **20×24 px glyphs**, a single dark contour and a **2 px shaded right/bottom thickness**. Keep the existing hooks and trade-specific shapes/colours. Add a short cast shadow onto the wall, and use the building palette's cream for symbols instead of a detached bright badge treatment. Keep the scissors, quill, bread and bottle immediately nameable at 1x.

5. **Standardize material clusters without softening them.** Start with the north wall's **48×48 px surface tiles**: remove about two-thirds of the bright diagonal scratches, group wear into a few **2–4 px chips**, and preserve broad stone faces. Make three variants whose wear is placed differently; check every sliding run of five for the two-identical maximum. On comparable red/slate roof planes, use a common approximate **6–8 px tile width and 3–4 px row spacing**, adjusted for plane direction, rather than stretching a finished cap. Keep clean roof boundaries and let interior texture carry less contrast than silhouette and openings.

6. **Make the existing shadows describe height.** The guildhall and several residential bases currently end in broad, simple shadow mats. Retain the southeast direction, but derive hard-edged masks from the actual silhouettes: approximately **12 px southward reach for stalls, 24 px for low houses, 48–72 px for tall stacks**, with eastward displacement around half the southward reach. Keep opacity at or below 50%, union overlapping masks, and retain a compact contact shadow at the foot. The reference-style top-left light is already present; the cast shapes need to support the geometry.

SCORE: 5/10
BLOCKING: 5
