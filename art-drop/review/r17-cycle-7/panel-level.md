Review role: RPG level designer and player. Coordinates below are approximate pixels in the 1920×1440 final image, measured from its top-left.

Inspected the full final at 1x and 2x, the comparison sheet, all fantasy-house and fantasy-hall references, and BRIEF-17.md. Made and inspected Pillow nearest-neighbour 3x crops of the square (528,672–1200,1104), east side street (1440,672–1776,1104), wall/gate (1104,1008–1392,1440), northwest passages, inn, and north square frontage. No `critic-r17R*squint*` file exists in this checkout; inspected `r17-city-final-squint.png` and the newer C6 square, street, and gate squints. Walkability judgments concern the drawing, not tested collision.

1) What works

- All four destination types can be found: temple west of the square; tankard-marked inn east of it; twin-tower gate on the south wall; shops identified by loaf, bottle, anvil, boot, scissors, and quill. The inn reads first as a drinking place, but its location is discoverable.
- Temple, fountain, north hall, and south market hall give the square a usable mental map. The pale gate road remains legible in greyscale. Main routes have visible clearance, and the market leaves room to pass.
- Compared with R15, navigation depends much less on counting similar facades. Vendors, customers, carts, and the working forge give some places a reason to exist.

2) Blocking problems

1. **The entrance language is not reliable enough to ship.** At the bakery north-west of the hall (roughly 780,650) and apothecary north-east of it (1175,650), black rectangular openings lack a conspicuous threshold-and-lantern pairing. At the inn (1325,1030), a dark entrance sits beside a brighter courtyard passage; neighboring shop passages repeat the latter treatment. I can find the business, but the drawing does not consistently tell me which opening enters it, which passes through, and which is decoration. This directly misses the brief's real-door versus blind-door rule. Fix the visual distinction before asking players to learn it by bumping into openings. This is an affordance failure, not a claim that the collision is broken.

3) Ranked suggestions

1. **Standardize usable entrances first.** For each enterable ground-floor door, draw a roughly 24×6 px light stone step and a 6×12 px lantern beside the jamb. Start with the bakery, apothecary, inn, tailor, and scribe. Keep a clear 48×48 approach cell in front. Give blind openings actual closed shutters or a visible panel, not the same empty black rectangle. Preserve visible paving through courtyard arches; reserve the step-and-lantern pair for interior transitions. Check the result at 1x without interaction markers.

2. **Make the inn's function and welcome stronger.** On the existing tankard sign around (1320,955), make the small lower motif an unmistakable 20×8 px bed silhouette. Give its entrance a shallow 48 px-wide porch within the frontage, with an 8 px-deep canopy. Put a 24×16 bench against the facade beside the courtyard mouth, outside both approaches. Keep the existing sign size: it already attracts attention. The missing information is lodging and entry, not a larger advertisement.

3. **Give the northwest a place worth remembering.** The long fenced strips around x480–624, y480–576 are visually repetitive and offer little destination information. Put a 48×48 laundry/drying-rack piece in one private court, a 24×24 stacked-firewood piece in the adjacent court, and one roughly 12×24 resident working there. Use the existing fences to keep these off the public lane. Leave neighboring courts calmer. This creates a specific “laundry court” reference without another oversized trade sign or street-front lawn.

4. **Connect the population to its surroundings.** The market has life; the inn approach, gate approach, and outer streets have isolated figures or long empty stretches. Add two differently posed 12×24 patrons beside the inn bench, one guard beside the gate's east stair near (1344,1368), and a 48×24 delivery cart plus handler in the craft frontage apron near (336,1008). Preserve the full 96 px gate road and the 48 px wall lane. Keep actors and carts out of door approach cells. Do not reproduce the identical blue-clad customer pair beneath the stalls elsewhere.

5. **Strengthen the north hall as an orientation landmark.** Its clock turret at roughly (960,420) gets lost among the roof peaks behind it, especially in greyscale. Add two matching 16×48 vertical civic banners on the hall's outer front piers, with a pale emblem on a dark field. Keep the three arcade openings exposed. The temple and gate already have distinctive silhouettes; the hall needs a readable civic identity at street level.

6. **Reduce repeated street experiences before adding more buildings.** The northwest and northeast both rely on tall narrow houses enclosing bare fenced strips; the south repeats small thatched groups. Change one 48 px court module in each outer quarter into a different activity pocket: laundry northwest, a 48×48 book/goods sorting table northeast, a 48×48 woodpile-and-handcart yard southwest. Keep every public route open and retain the two-identical-pieces-in-five limit. Roof colour alone is insufficient for remembering which turn leads home.

SCORE: 7/10
BLOCKING: 1
