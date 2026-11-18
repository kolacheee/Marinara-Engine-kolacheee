# Historian review — cycle 6

## 1. What works

- Narrow, tall commercial frontages, lower thatched peripheral houses, trade clustering and side-facing entrances establish an urban social geography. There are no suburban lawns along the shop fronts.
- The offset church, northern guildhall and southern market hall give the market a civic setting. Six substantial stalls, the fountain and cross have intelligible functions. The curtain wall, interval towers and visible northern access stair read as a defensive circuit.

The comparison shows better building depth and civic identity than R15. It does **not** yet show a convincing dense old town: too much of the settlement remains small building groups standing in a continuous paved field.

## 2. Blocking problems

Coordinates below are approximate pixels in the 1920×1440 final image, measured from its top-left corner.

1. **Narrow houses are not enough: the burgage plots remain largely unreadable.** Where: northwest groups, **x144–672, y288–720**; northeast groups, **x1392–1776, y288–720**; southern thatched groups, **x144–384 and x1392–1776, y1104–1344**. There are individual fences, sheds and courtyard props, but too few continuous boundaries tying a street frontage to its own rear land. Paving runs between buildings and behind roofs without consistently distinguishing a private working yard from a public passage. The 3× northwest crop makes this especially plain. The town needs recognizable property strips and occupied block interiors; another scattering of barrels will not fix it.

2. **The circulation hierarchy is weaker than the available space suggests.** Where: the gate-to-market connection, **x1104–1344, y1008–1440**, and the junctions around the northwest side street, **x432–480, y288–768**. A narrow side street and a lighter gate approach exist. However, similar paving continues through rear spaces, peripheral routes and broad junction aprons, so the main trading route does not consistently outrank all the alternative gaps. In greyscale the gate is easy to find; its route into the market is less decisive. Straight streets are not the historical problem. The problem is that public routes, plot access and leftover space have too similar a status. This weakens both the impression of accumulated development and the player's reading of the town.

3. **The guildhall does not command its frontage.** Where: **x864–1056, y276–672**, between the tall commercial houses on the north edge of the square. Its clock turret identifies it, but the main hall is buried below neighbouring roof masses. In greyscale it reads as an ornate insertion in the shop row rather than the civic building governing this market. The church retains a stronger independent silhouette. The square already has a small northwest notch and landmark edges; merely making its paving more irregular would miss this failure.

## 3. Ranked suggestions

1. **Draw property strips before adding more buildings.** Start with the northwest group at **x144–432** and the north market frontage at **x720–1344**. Use **48 or 96 px frontage widths**, a **48–96 px building depth**, and a further **48–96 px rear strip**. These are ground-plan dimensions, not the height of a projected sprite. Continue party boundaries back from the house divisions with fence or low-wall pieces. Give selected strips a **48×48 px lean-to**, wood store or wash yard at different depths. Retain one **24 px shared access passage** per two or three properties rather than treating every gap as public circulation. Close each strip at its rear. No grass apron at the street.

2. **Make one continuous gate road the organizing line.** Keep a **96 px clear route** from the southern portal, emerging along the gatehouse's west side at roughly **x1104–1200**, into the square near **(1152,1032)**. Carry the same quieter, larger paving units and paired gutter edges through its bends. Keep ordinary side streets **48 px** and plot passages **24 px**; terminate their kerbs where they enter private courts. At the northwest street's southern junction near **(456,744)**, bring one building frontage forward by **48 px** to reduce the apron and make a definite T-junction. Create changes of width with actual building lines, not decorative strips painted across otherwise open paving. Preserve a continuous **48 px passage inside the tower projections** around the wall.

3. **Give the guildhall a civic mass, not just a taller finial.** Retain its **192 px frontage**, add **one 48 px occupied storey** beneath the main roof, and remove **one or two 48 px storeys** from the immediately flanking narrow houses around **x816–864** and **x1056–1104**. Keep the arcade opening directly onto the square and a **48 px clear forecourt** along it. Recheck the whole city in greyscale: the broad hall and its tower should read together before the neighbouring shop signs do. Keep the church offset and retain its little enclosed court.

4. **Make the gatehouse's working structure easier to believe.** At **x1176–1344, y1056–1440**, the very slender towers and small central roof give the entrance a ceremonial silhouette. Add a **96×48 px chamber** bridging the towers above the present central gate room, with visible bearing into both shafts. Show a **48 px landing or stair connection** to a tower door, outside the road clearance. Shortening both tower shafts by **48 px** would make the ensemble less like two detached needles. Keep the passage broad and open; do not fill it with a portcullis merely to add medieval decoration. This is secondary to repairing the town plan.

5. **Make service spaces belong to their trades.** In the western craft court at **x240–336, y816–1008**, use a **48×48 px covered fuel/tool store** adjoining the workshop and a short drain leading toward the street gutter. In the southern poor plots, replace selected exposed cobbles with **48×48 px hard-packed yard/mud-edge tiles** behind fences, with a wash line or woodpile attached to a particular house. Keep the existing east-wall storage outside the clear wall passage. The east-wall crop shows a usable strip beside those enclosures; do not invent a blockage there or solve density by obstructing it.

6. **Use the market's existing edges more deliberately.** Keep the six **48×48 px stalls** in two rows with a **48 px aisle**. Shift the group slightly toward the guildhall if needed to maintain a **96 px through route along the square's east side**. Keep the fountain and cross out of that route. Retain the southern open market hall as a built edge; put its stored goods within its bay or enclosed service area, rather than letting a loose prop cluster substitute for a property boundary.

All changes should preserve the 48 px assembly grid, the town houses' three-quarter view, top-left light, sharp one-pixel outlines and angular grid geometry. Use distinct adjoining property assemblies; keep identical pieces to at most two in any run of five.

Inspection: viewed the complete final at 1× and 2×, the comparison sheet, and all supplied fantasy-house and fantasy-hall references. Created and viewed Pillow nearest-neighbour 3× crops in memory: square **(480,624)–(1248,1104)**; northwest side street **(240,288)–(720,768)**; gate **(1104,1008)–(1392,1440)**; north wall/stair **(864,48)–(1152,336)**; east-wall passage **(1680,480)–(1920,864)**. No `critic-r17R*` squint file exists in this checkout; inspected the newer `r17-city-final-squint.png` and the C5 street and gate squints instead. No crop files were written.

SCORE: 5/10
BLOCKING: 3
