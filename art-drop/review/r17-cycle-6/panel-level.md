# RPG level designer / player review

## 1. What works

- **Temple: immediate.** The west-side church, its spire, steps and square-facing side door establish a destination. The clock hall to the north and fountain give the square a memorable orientation triangle.
- **Inn and shops: identifiable.** The southeast tankard sign finds the inn; its small bed symbol confirms lodging on closer inspection. Bread, bottle, anvil, boot, scissors and quill are recognizable trade icons at 1x. Finding the business is easier than identifying every usable entrance.
- **Gate: recognizable silhouette.** The southern twin towers stand apart from the wall towers. Six substantial stalls, vendors, shoppers, carts, washing and workshop props make this an inhabited place. Compared with R15, the square has actual destinations and the paving competes less with them.

## 2. Blocking problems

Coordinates below are approximate pixels in the 1920 × 1440 final image, measured from its top-left. These are visual navigation findings, not claims about a tested collision map.

1. **The main route loses priority where it matters.** Where: gate approach and inn junction, **x1104–1392, y1008–1440**, continuing into the square's southeast corner. The gate has a light approach, but the towers obscure much of its continuation and its northern end meets the inn frontage. The necessary turn toward the square is not expressed strongly enough. Similar light paving bands run through other streets, so brightness does not consistently mean “main route.” In greyscale I can locate the gate and church; I cannot trace a comparably decisive connecting street at a glance. A player should not need to decode this junction on arrival or when returning to the exit.

2. **Entrance and passage cues are inconsistent at playing scale.** Where: inn frontage **x1296–1488, y984–1056**; shops beside the clock hall **x720–864 and x1056–1344, y624–672**; northwest court **x240–384, y432–720**. The inn presents a closed door, a dark arch and a neighbouring bright passage in one small frontage. Elsewhere, dark door-sized rectangles can be shop openings, shutters or passages. Small lanterns and thin steps do not consistently resolve which threshold the player should approach. The northwest court even contains a person in the wedge between roofs without an obvious exterior approach. Its access may be through the front building, but that connection is not communicated. Business identification passes; reliable entrance identification does not.

## 3. Ranked suggestions

1. **Draw a continuous gate-to-square street before adding more decoration.** Reserve a **96 px clear ground corridor**, centred on the southern gate opening, emerging below the inn frontage and bending west into the square near **(1152,1056)**. Use a dedicated large-cobble main-road tile, a **2 px kerb** and a **4 px gutter**; carry those edges through the bend. Keep a **96 × 96 px turning pocket** clear of props. Make ordinary side streets **48 px** and lanes **24 px**. The route must remain distinguishable in greyscale. Judge clearance at ground level; the tall gate sprite should not imply that its entire painted rectangle is solid.

2. **Standardize one entrance kit and apply it to the named services.** Within each **48 × 48 px ground bay**, give an enterable door a **24 × 8 px lit landing**, a readable dark opening and a **6 × 10 px lantern**. Start with the inn door near **(1325,1030)**, baker near **(796,650)** and apothecary near **(1138,650)**. Give courtyard passages continuous paving through the opening and a visibly different lintel; shutter decorative openings. Strengthen the inn's bed pictogram to roughly **16 × 8 px** inside the existing sign, and put its promised **96 px porch** over the lodging entrance. Preserve a clear approach below it.

3. **Resolve the northwest court as an intentional destination or an explicit closed yard.** At **x240–336, y432–480**, establish one legible access connection. If the existing southern passage near **(312,696)** serves it, repeat that passage's paving at the rear opening and provide roof/facade occlusion when the player passes underneath. If it is scenery, close the apparent access and move the person near **(338,516)** onto the open street east of the houses. Do not leave an apparently stranded NPC as the only clue.

4. **Give minor routes identities beyond roof colour.** The square is memorable; the surrounding housing pockets are much less so. Make the existing northeast shrine near **(1512,700)** terminate a **48 × 96 px stone apron**. Give the northwest court a distinct **48 × 48 px well or pump**, only after access is resolved. Add a **24 × 48 px hard-edged smoke overlay** to the existing western forge near **(280,870)**. These provide useful directions: shrine lane, pump court, forge turn. Do not add another tower competing with the church.

5. **Replace posed population with small activities.** The market's second row repeats the first row's three vendor silhouettes. Redraw those three **48 px actor cells** as weighing goods, folding cloth and handing over a purchase. Pair two shoppers at one counter. Put one **48 × 48 px unloading cart** beside the inn's eastern end, outside the main corridor, with one worker facing it. Keep the fountain and church-door approaches free. More scattered people would add less than these interactions.

6. **Strengthen the square's enclosure without sacrificing its routes.** The clock hall's main roof is submerged between taller domestic masses. Lower its immediately adjoining houses by **one 48 px storey** or step those frontage bays back **48 px**, retaining the hall's central approach. Keep the church, clock hall and market hall as the framing landmarks. For subsequent block edits, use one **48 px setback** and a visible corner return to distinguish a turn; avoid another straight band of interchangeable fronts. Preserve the reference houses' visible steps, roof depth and side walls, the top-left light and 1 px outlines. Keep frontages paved and respect the two-identical-pieces-in-five limit.

Inspection: viewed the final render at 1x and 2x, the comparison sheet, and all supplied fantasy-house/fantasy-hall references. Made and viewed Pillow nearest-neighbour 3x crops in memory of the square, northwest side street, gate, inn, wider gate junction and northeast court; no crop files were written. No `critic-r17R*` file containing `squint` exists in this checkout. Used `r17-city-final-squint.png` for the full-city greyscale check and also inspected the newest available squint, `r17-C5-wall-stair-squint-1x.png`.

SCORE: 6/10
BLOCKING: 2
