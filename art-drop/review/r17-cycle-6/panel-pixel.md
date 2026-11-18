# Pixel-art lead — cycle 6

Reviewed the full `r17-city-final.png` at 1x, `r17-city-final-2x.png`, and `r17-city-final-vs-r15-vs-today.png`; all four fantasy-house and six fantasy-hall references; and `BRIEF-17.md`. Made and inspected Pillow nearest-neighbour 3x crops of the square, east side street, gate, north wall, northern frontage, church, and southern roof run. Crop files are outside the checkout. Coordinates below are source-image pixels, measured from the upper-left of the 1920×1440 final.

No `*squint*` file associated with `critic-r17R*` exists in this checkout. Used `r17-city-final-squint.png` and the newer `r17-C5-square-squint-1x.png` and `r17-C5-gate-squint-1x.png` instead.

## 1. What works

- Roof depth, recessed windows and the church's visible side wall improve on round 15. The church, fountain and gate have readable silhouettes.
- Warm plaster, muted red tile and slate form a usable palette. Street-front lawns are gone. Six market canopies and most large trade symbols survive 1x.
- The image is crisp: the supplied 2x is an exact nearest-neighbour enlargement. Most outer silhouettes hold a one-source-pixel contour. Top-left lighting is broadly established on roofs and stone returns.

## 2. Blocking problems

1. **The modular houses still read as roof strips above cardboard facades.** Northern frontage, especially **(1056–1344, 336–672)**; northeast houses **(1488–1776, 432–720)**; stepped southern row **(528–720, 1104–1344)**. Long, narrow roof planes do not by themselves reproduce the references' high 3/4 construction. The angled end houses show substantial side depth; adjacent tall modular fronts collapse into flat stacks with almost no exposed return. In the southern row, successive facade bases step downward while the exposed vertical edges remain hairlines. Large triangular highlights around otherwise flat plaster panels read as bevelled interface panels, not wall surfaces. These pieces still do not look like neighbours of `fantasy-house-2`.

2. **Roof texture changes scale and drawing language within a single building.** Red roof immediately left of the guildhall, **(720–816, 336–480)**; tall slate roof **(1488–1584, 288–432)**; southern four-roof run **(528–720, 1104–1200)**. Slopes use broken dark dashes and isolated flecks, then their end triangles abruptly become large, ruler-straight brick grids. Other roofs use dense scallops or much larger hand-shaped tiles. At 1x this is scratchy striping; at 3x the incompatible construction is obvious. The north curtain wall, **(432–768, 96–240)**, adds another band of dense, high-contrast horizontal marks. The references organise detail into readable material clusters; this render alternates between flat fill and visual static.

3. **Cast shadows are generic mats with rounded ends.** Below the northern frontage, **(720–1344, 672–720)**; below the eastern shops, **(1584–1776, 1056–1104)**; north-wall feet around **(768–1152, 240–272)**. Down-right is the correct general direction, but the repeated curved cutoffs do not describe square building footprints, roof projections or different heights. The low guildhall body and tall neighbouring stacks get similarly shallow patches. At 1x these shapes make the architecture look pasted onto paving. Rounded building-shadow masks also undermine the hard-edged grid-art rule. This is a shape problem, not a request for softer shadows.

4. **The guildhall loses its landmark status in greyscale.** North edge of the square, **(864–1056, 288–672)**, including its flanks **(720–864, 336–672)** and **(1056–1344, 336–672)**. The clock spire identifies a civic building, but the main hall is swallowed by the taller, equally contrasty window stacks beside it. Removing the orange hue exposes the problem: its body joins the same busy frontage band. The church works as a landmark; the north side of the square does not achieve an equivalent focal mass. The brief requires landmark dominance, not merely an identifiable turret.

5. **The gate approach fails the main-street squint test.** From the square's southeast edge **(1152–1344, 1008–1104)** down to the gate opening **(1190–1310, 1350–1440)**. The twin towers are recognisable, but the route uses substantially the same light cobble treatment as unrelated streets and open paving. Bright patches spread sideways, and the road has no continuous value boundary leading into the opening. In greyscale I find the gate by its towers, not by following a clearly dominant street.

## 3. Ranked suggestions

1. **Rebuild one 48 px facade column and its exposed end before propagating it.** Start with the southern stepped row and the northeast slate block. Within each exposed end cell, reserve **12–16 px** for a shaded return running continuously from eave to plinth. Give sills **2 px top faces**, **1–2 px undershadows**, and a consistent projecting eave. Replace broad diagonal plaster bevels with calm wall fill. Keep the exterior outline **1 px**; do not stack two outlines where modules meet. Compare this sample directly beside `fantasy-house-2` at 1x before repeating it.

2. **Redraw the roof family around one material scale.** On each **48 px-wide module**, start with tile clusters roughly **6–8 px wide and 3–4 px deep**, foreshortened consistently with the roof plane. Carry that scale through hips and endcaps; align courses across joins. Use three main tile values and remove isolated dark flecks. Preserve a broad lit left plane and darker right plane. On the north wall's **48×48** sections, reduce mortar contrast and remove about half the incidental chips so masonry does not compete with windows.

3. **Replace the shadow masks with hard polygons.** Use one down-right projection vector across buildings, wall and props; derive each cast shape from the footprint and height. A useful starting offset is **(+12,+24) px per 48 px storey**, adjusted consistently after viewing the full scene. Clip shadows to visible receiving surfaces and keep opacity at or below 50%. Replace the frontage's curved tails with straight edges and deliberate pixel stair steps. Preserve tight contact shadows at every base.

4. **Give the guildhall breathing room and value priority.** Lower the nearest flanking house stacks by **one 48 px storey** while retaining their ground baselines. Reserve a **48 px paved forecourt strip** across the hall's **192 px frontage**, and suppress small contrast marks in the neighbouring roof and plaster modules. Keep the hall's light stone framing, dark arcade recesses and clock as the strongest grouped accents on this edge. Verify the result in greyscale before adding detail.

5. **Draw a continuous 96 px gate road.** Carry it from approximately **x=1200–1296, y=1056** into the gate mouth, with a deliberate transition from the square. Use larger, quieter paving than the side streets and two **2 px kerb/gutter boundaries**. Keep its lightness continuous through shadowed stretches; do not brighten adjacent paving to the same degree. The route should remain traceable when colour is removed.

6. **Give the signs physical thickness without sacrificing their symbols.** The scissors and quill at **(1584–1776, 912–1008)** read as flat badges. Keep their existing footprints and recognisable motifs, but add a **1 px lit top rim**, **2 px shaded right/bottom thickness**, and a visible bracket connection. Do not add lettering or decorative noise.

7. **Vary silhouettes, not just surface marks.** The four narrow red caps at **(528–720, 1104–1200)** still make a comb. Replace one middle cap with a **96 px-wide shared roof** over two lots, or stagger one complete building by **48 px** with a properly drawn side wall. Retain the two-identical-pieces-per-five limit in placement validation. I am flagging visible repetition here, not claiming an unverified asset-identity violation.

SCORE: 5/10
BLOCKING: 5
