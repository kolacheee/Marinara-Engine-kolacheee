# Panel 1 — modular city system

Reviewed the three requested mockup images, including native-size views and nearest-neighbour enlargements; all four r15 house references and all six hall references at native size and enlarged; and the revised BRIEF-17 dated 11-16 23:00 UTC. `reference/r17/` exists but is empty in this checkout. Coordinates below refer to the 1200 × 912 `r15-city-mockup.png`, measured from its top-left. Sizes proposed below use the 48 px grid; ground footprints and painted sprite bounds are distinguished where they matter.

**Verdict: this set can generate many different elevations, but it cannot yet demonstrate many different cities.** Changing the seed changes the windows and skyline while preserving the same street-wall diagram. The current city15 directory has 129 PNGs, including 48 storeys and 48 roofs; that count includes colour variants. The bottleneck is missing spatial connections, not the number of exported images.

## 1. What works

The 48 px stacking system gives usable frontage widths and a legible range of building heights. Attached buildings convey density better than today's isolated houses. Shops, arches and workshops provide useful ground-floor roles. Keep those capabilities.

## 2. Problems, most important first

1. **The blocks cannot convincingly turn a corner.** Look at the ends of the north-central row, approximately x384 and x864, y144–336, and the eastern end of the west block, x336–384, y480–672. A decorated, narrow front edge terminates the row; it does not become a substantial side elevation along the perpendicular street. Everything addresses the bottom of the screen. The broad north–south opening at x864–960 consequently reads as a gap between stage sets. A city generator needs buildings that address both street directions, plus rear walls, returns and enclosed plots.

2. **The repetition is structural and survives recolouring.** The green-and-cream shop at x144–240, y288–336 recurs at x384–480, x624–720 and x960–1056. The narrow octagonal-window stack at x816–864 repeats its motif floor after floor; another appears at x336–384 in the west block. Floor courses continue across neighbouring lots around y192, 240 and 288. Alternating timber, plaster and stone panels adds detail without changing the window rhythm or building plan. At 1x the result is a striped wall with repeated highlights; enlargement exposes the repeated components.

3. **The roofs vary in outline but do not establish complete building volumes.** In the west block, x0–384, y400–575, flat parapets, a blue roof and several gables overlap without enough visible returns or exposed party walls to explain their relationships. The bottom band, y752–912, is another pile of caps and fronts. Compare `fantasy-house-2` and `fantasy-hall-3`: their large roof planes, dormer, lower wing and eave shadows describe a connected object. The existing 3 px wall-end reveal is an edge treatment, not a building's depth. More roof texture will not fix this.

4. **The square has no architectural identity.** The space at x384–864, y336–672 is bordered by ordinary frontage and contains scattered small stalls, a well and two trees. Nothing explains why this is the city centre. The tallest ordinary houses on its north edge carry more visual weight than anything in the square. Both this image and today's comparison use the same tiny stall vocabulary, so adding further copies would preserve the problem.

5. **Objects meet the ground without a convincing shared depth system.** The north frontage meets the square at y336 with little continuous cast shadow; the western block similarly meets the street at y672. Steps, signs, awnings and cornices mostly stay inside their rectangular panels. That makes joining convenient but suppresses projection. The overlapping buildings in the west block also need a documented footprint and sorting proof: this still image does not establish whether a character can walk behind a roof, through an arch or along a hidden lane. I am flagging an unproven contract, not claiming to have observed a runtime collision bug.

6. **The ground and perimeter advertise the repeat grid.** The cobble band at y672–768 and the strip at x864–960 have large, conspicuous light stones repeated across open areas. The square's slab pattern competes with its small stalls. The wall across y0–96 is an uninterrupted repeating strip in this view, with no visible gate or substantial tower to orient the player. This is not evidence that the entire city has no exit; it is evidence that this composition supplies no exit landmark.

## 3. Top six concrete requests

### 1. Draw coherent building families with actual projections — A facades

Keep 48, 96 and 144 px frontage widths and the 48 px vertical step. For each width, draw three ground arrangements for each existing role: shop, door, arch and work. Change door position, display width and opening shape, not just awning colour. A 96 px shop should have left-entry, right-entry and recessed-entry arrangements. Give the 144 px arch frontage a full 48 px clear passage between its occupied side bays.

For upper floors, draw two bay arrangements per width for timber, plaster, stone, jetty and oriel families. Align structural posts and principal windows through a building. Use roughly 12–16 px window openings in a 48 px bay, with 2–3 px sills; test these next to `fantasy-house-2` before copying them across the set. Draw 6–8 px projecting jetties/oriels with visible undersides, and 8–12 px awning projections. Supply plain end and return pieces for these projections so they stop cleanly at an exposed corner.

**Join rule:** retain the stack datum, but distinguish timber-course, stone-course and jetty-support connections. An incompatible transition needs a drawn adapter. Shared boundaries must have one owned edge, rather than two full outlines or two cornices piled together. Select a family for the whole building; do not shuffle unrelated floor constructions to create nominal variety.

### 2. Make a roof construction kit, including unequal-height neighbours — B roofs

Draw the proposed 48/96/144 px wide caps with 96 and 144 px painted depth, but approve their projection against the footprint guide in request 5 first. Include front-gabled, ridge-parallel, hipped and low lean-to forms. A narrow gable and a wide hip must differ in construction, not be stretched copies.

Draw separate 48 px ridge, eave and gutter runs; 48 × 48 slope-interior tiles; matched hip and valley junctions; exposed verges; and lower-roof-to-taller-wall flashing. Roof fill needs directional sockets: a slope interior cannot join a ridge, valley or opposite slope arbitrarily. Draw light-facing and shade-facing versions; do not rotate the finished lighting with the tile.

For a five-storey house beside a one-storey house, provide a blank party-wall field repeating in 48 × 48 units, a top coping and a stepped contact with the lower roof. Windows must not continue behind the attached neighbour. Let neighbouring roofs meet through a gutter, party wall or specified shared plane. Do not force every pair to share one continuous eave. Put chimneys and dormers on defined slope sockets, with a clear margin from hips and valleys.

### 3. Close a block before adding more front variants — C back rows/side streets

Draw rear walls in the same three widths: plain, rear door and external stair, including left and right stair versions. Draw east-facing and west-facing side walls for 2- and 3-cell plot depths, with ground entrances as well as upper windows. Reversed lighting requires authored counterparts, not a horizontal flip. A north-facing entrance needs a marked threshold on the far street even when the building hides most of its door from this camera.

Add convex and concave wall returns, their roof partners, a blank party-wall end, T-abutment, and a stepped 1-cell setback. Include 1 × 2-cell lean-to sheds and a 1-cell-wide covered passage with separate arch/lintel art. Add a stepped corner or explicitly authored diagonal end for wedge-shaped blocks; a rectangular corner set alone cannot satisfy that layout requirement.

**Placement proof:** build one 12 × 10-cell ground block, excluding surrounding streets, with opposing 3-cell-deep rows, a 2-cell-deep courtyard strip, and lower rear additions occupying some of the remaining depth. Return a wing down one side and connect the court to a street through a 1-cell passage. Give another test block an open L-shaped court. Draw fences in 48 px runs with ends, corners and gates; place woodpiles and washing against those boundaries. The court should remain intentionally visible. Its entrances must connect to the street network.

### 4. Give the square a hierarchy and the kit alternative civic silhouettes — D landmarks/market

Use the brief's cathedral 5 × 6, guildhall 4 × 4 and market hall 4 × 3 as **reserved ground footprints**, not texture-size limits. Draw the cathedral with a long nave, lower aisle and one offset tall tower; the guildhall with three broad arcade openings and a bell turret; the market hall with a low roof and visibly open bays. Split the tower/turret and one porch or side chapel into compatible optional components so every city does not receive the same civic silhouette. Keep the fountain low. Only the dominant church tower needs to exceed the tallest ordinary roofline.

In the sample square, put the church on its northwest edge with a small side yard, the guildhall on another edge, and the low market hall near a street mouth without blocking it. Draw six 48 × 48 stall sprites with roughly 36–44 px wide canopy masses, distinct goods silhouettes and front/back presentations. Place them in two short groups with a 48 px clear aisle, not an evenly spaced ring. Use a 96 × 96 fountain as an offset secondary focus.

The gatehouse also needs a real traversable opening: reserve a 2-cell-wide route through a 4-cell-wide gatehouse footprint, rather than squeezing that route between two towers into the brief's 3-cell width. Supply matching wall ends and a gate apron. Ordinary towers can be smaller. A city should be recognisable by its gate, major civic form and block layout before signs or NPCs are added.

### 5. Draw a footprint, overlap and shadow proof sheet — new system requirement, supporting A–D

For each prototype, show the painted bounds over a coloured ground-footprint mask. Start with a 2 × 3-cell house: its blocked ground rectangle is 96 × 144 px regardless of whether it has one or five floors. A five-floor facade alone is 240 px tall; its roof extends the art further upward. Do not turn that entire painted rectangle into collision, and do not treat the PNG's bottom-left corner as sufficient placement information.

Mark a ground anchor, entrance cells, covered passage cells, overhang bounds, roof sockets and the object's sorting baseline. Give the artist explicit sockets for a 24–32 px hanging sign and for an awning; allow their art to cross the facade boundary while reserving pedestrian clearance. A 24 px lane requires navigation at that resolution and a clearance check against the actual character collider. A half-cell drawing is not automatically a walkable route on a whole-cell navigation grid.

**Draw order:** paint ground first and ground-receiving shadows above it but beneath feet and objects. Assemble normal buildings internally, then sort them with characters and props by ground contact, north to south; do not globally draw all roofs after all characters. Split arches, gatehouses, bridges and long returning wings where an actor must pass both behind and in front of different parts. Put roof-mounted overlays with their parent roof, not in a global final overlay pass. Use foreground fading/cutaway where a tall building would otherwise hide the traversable route.

Draw eave/jetty contact shadows about 3–6 px deep and modular south/east ground-shadow strips with straight, corner and end pieces. Match the reference's top-left light; make cast-shadow extent respond to building height. Ground shadows may cross plot edges, while receiving-surface masks prevent them from being pasted over a neighbouring facade. Avoid double-dark seams from overlapping translucent strips. The proof must show a character on both sides of a building and beneath an arch, plus both left-tall/right-low and left-low/right-tall roof joins.

### 6. Budget for structural variety, then prove several city layouts — new kit scope, with E streets/props

I would budget **about 210 distinct source designs**, approximately **400–450 exports** once necessary material and orientation variants are included. This is a production estimate, not a demand to multiply every option by every other option. Recolours do not count as new source designs.

| Area | Source-design budget | What the budget buys |
| --- | ---: | --- |
| A fronts | 66 | 36 grounds; 30 upper-floor layouts including oriels |
| B roofs and roof joins | 42 | Depth/shape alternatives, directional connections, party-wall and flashing pieces |
| C backs, sides and wall joins | 36 | Return walls, rear access, stairs, corners and additions |
| D civic/market | 18 | Eight principal objects, six stalls, four interchangeable civic attachments |
| E/new ground, wall joins and props | 48 | Roughly 16 paving/kerb/gutter pieces, eight signs, 16 yard/life details, eight perimeter connections |

Start with a **40–60-piece pilot in one material family**, including its difficult joins, before funding the full budget. Alongside it, draw twelve block plans across approximately 6 × 6, 8 × 8 and 12 × 10-cell envelopes: closed court, open L, stepped perimeter, narrow paired rows and market-edge blocks. These plans are composition recipes, not additional facade paintings. Produce at least three distinct district grammars from them, rather than making every district a recolour of the same blocks.

Break ground repetition with restrained 2 × 2-cell paving patches plus straight, corner, T and end kerb/gutter pieces; check that the larger patches do not introduce a larger repeating motif. Distribute wear along routes and drainage edges. Place props by use: fuel by workshops, crates beside loading doors, washing over courts. Random scatter is not variation in city structure.

Test twenty seeds, inspect six complete city views at 1x, and include two with the same palette. Reject repeated full-building silhouette/bay recipes within five neighbouring lots and repeated block outlines within a viewport. Allow sensible repeated windows within one building. Check every *compatible unlike* join, not merely each piece beside itself. Judge identity with props and colour differences removed as well as in the finished render.

## 4. Where I disagree with BRIEF-17

- **A: “every piece stacks on every other” is too broad.** Preserve grid registration, but use compatibility classes and transitions. Requiring identical exposed brown courses at rows 0 and 47 on stone, plaster and timber preserves one source of the stripes. Those two boundary rows are not the entire problem, but they should not dictate every material's visible construction.
- **B versus layout: the dimensions are inconsistent or insufficiently defined.** Roof caps are 2–3 cells deep, lots are only 1–2 cells deep, and yards must also fit behind them. State which measurements describe painted projection and which describe occupied ground. The text also requests w3 fronts while limiting lots to 1–2 cells wide; explicitly allow merged plots.
- **B/C: shared eaves and a roof fill that tiles “in both directions” need restrictions.** Different roof orientations, pitches and heights require gutters, flashing and party walls. An unrestricted fill can erase the roof's construction. A `firewall-w0` name also needs an actual painted width and connection definition.
- **D: the landmark height requirement conflicts with the listed sizes if those sizes are sprite bounds.** Five 48 px floors plus a 96–144 px cap already occupy 336–384 px vertically. A 5 × 6-cell sprite is only 288 px high; a 4 × 4 hall is 192 px. Separate footprint from art envelope. Do not make the market hall, fountain and every other civic object compete to be tallest.
- **Layout: “overlays never cross a lot edge” contradicts useful shadows and projections.** Constrain attachments with sockets, clearance and ownership instead. Shadows, signs, awnings and washing lines need controlled exceptions. Bottom-left anchors and base-row sorting alone do not solve covered passages or returning wings.
- **Layout: compulsory street changes every eight cells and one wedge per district will become another detectable recipe.** Use weighted block grammars and occasional long streets. Include wedge-supporting art before making wedges mandatory. “At most 2 identical pieces in a row of 5” still permits conspicuous repeated whole buildings and ABABA patterns.
- **Critic/order: do a small A+B+C integration slice before completing A.** Roof depth and side returns can force facade revisions. A seam sheet beside self and variants does not test all unlike connections, height differences, rear-facing entrances or actor occlusion. Preserve intentional courts; narrow “no bare ground inside a block” to accidental holes in roofed areas. Do not treat a four-round limit as evidence of acceptance if those structural failures remain.

**One-line summary: build connected volumes, usable plots and varied block plans first; another hundred interchangeable front panels will still produce the same striped city.**
