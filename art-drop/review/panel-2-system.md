**Panel 2 — modular city kit / technical art**

**Verdict: this can produce many combinations of the same street, but it has not demonstrated many different dense cities.** The limiting factor is building shapes, block plans and compatibility rules, not the number of colour exports.

Reviewed the native `r17-E-critic-*` block, market, height and district renders; `critic-r17E-4-*` and `critic-r17D-3-*` block/market renders and their enlarged details; A/B street and gallery sheets; C atlases, compatibility sheets, junctions and pilot diagrams. Compared with `r15-city-mockup-vs-today.png`, its native city panel and 2x detail, and all four house/six hall references in `reference/r15/`. The corresponding r17 house/hall images have identical pixels. Used native views for repetition and hierarchy, and 3x/4x views for construction. Read BRIEF-17 and the existing facade course contract. Coordinates below are approximate native-image pixels, measured from the top left. This is an art/system review, not a runtime collision test.

**1. What works**

- Roof depth, rear walls, corner assets and visible cast shadows give the kit more spatial information than round 15. The lower-left L roof in the latest block can cover a connected building mass.
- The cathedral, guildhall and gate have identifiable silhouettes. “No landmarks” is no longer literally true.
- C's footprint/entrance diagram and cutaway demonstration are useful foundations. Keep them and extend them to complete blocks.

**2. Problems, most important first**

1. **The city demonstration is still a collection of frontages with land between them.** In `r17-E-critic-market-1x.png` and `critic-r17E-4-market-1x.png`, the grass behind the guildhall, the isolated houses east of the gate road, and the gaps around the central shop groups prevent a continuous urban enclosure. The guildhall at roughly x240–430/y515–915 sits on its own apron. The cathedral has its own fenced island. The D3 market is even sparser. Round 15's right-hand comparison panel was flat, but its attached rows enclosed the square more convincingly. E improves individual buildings without restoring that density. A square needs walls of buildings around it, not merely more objects on its paving.

2. **The roof library has incompatible visual scales and too few convincing whole-building silhouettes.** In the latest L block, compare the upper-left rear roofs, x0–335/y0–95, with the large scalloped tiles immediately right of the central street. They look like different tile sizes and drawing systems. In `r17-B-street-1x.png`, the tall hip caps are long rectangular roof panels with almost identical central ridges; height changes do much of the variation. In `r17-C-compatible-1-1x.png` and atlas 07, the side roof textures become much finer and noisier. The long lower-left L roof is joined, but it also turns seven cells of shops into one enormous continuous roof band. Seamlessness alone does not make these buildings believable neighbours.

3. **Facade variety collapses into the same panel rhythm.** Look at the blue-roof five-storey houses down the market's right side, and the four repeated single-window floors in the lower half of `r17-E-critic-height-test-1x.png`. The repeated cream rectangle, horizontal brown course and centred window dominate the architecture. A gallery 28 shows that several exports are the same composition with a colour change or another repeated window bay. The original `fantasy-house-2` has a readable frame, gable, chimney, dormer and entrance arranged as one building. The modular versions still read as floors chosen independently. Repeating oriels on arbitrary floors is not a substitute for coherent structural variation.

4. **The join pieces exist, but the demonstrations do not establish a sufficient building grammar.** C has inner/outer corners, tees, ends and separately lit side pieces; asking for those names again would miss the problem. In `r17-C-critic-junctions-1x.png`, the middle top junction has a dramatic folded roof and wall, but the neighbouring frontage remains a straight strip. The upper-right tee mixes roof textures at its intersection. In the latest L block, the narrow passage at x576–624/y336–480 ends against a blank wall. We need proof of usable entrances, real returns around a block and transitions between heights/depths. The upper height-test pairs show mainly a thin vertical separation where a substantial taller side wall should explain the roof overlap.

5. **Districts repeat the plan, not just the pieces.** The rich, temple, craft, market and poor E renders reuse the same central crossing, broken rows and courtyard arrangement. Rich versus temple is especially close. The same well, woodpile/washing rack, shed and tub tree recur at predictable intervals. In the L block, compare x96–288/y288–350 with x384–768/y200–290. These are prop sample strips. They do not look like plots with different owners, service access or trades. Roof recolouring will make five recognisable versions of one district, not five kinds of city fabric.

6. **The signs break the scale and consume the variation underneath them.** In `critic-r17E-4-market-detail-1-3x.png`, the anvil, loaf, bottle and boot fill much of each ground floor and overlap the storey above. The current sign canvases are 64×72 px; each stall is 48×48 px. These shop emblems are larger than a market stall. At 1x they read immediately, but as interface badges pasted over buildings. Every shop also repeats the same dominant bracket placement. Several different shop drawings become the same “huge sign beside a door” composition.

7. **Walkability and occlusion are not yet proved at city scale.** The gate opening in `critic-r17E-4-market-detail-0-3x.png` is filled with a blue brick pattern that reads like a blocked arch; the pattern continues onto the approach and then stops abruptly. The C cutaway explicitly shows a person disappearing behind a roof. That is useful evidence of the problem, not proof the city handles it. Full-canvas sorting cannot by itself resolve someone under an arcade, behind a stall canopy or between a front wall and an overhanging roof. The rectangular street-shadow pads beneath market buildings also expose placement rectangles instead of consistently describing their height and shape.

8. **The market and landmark set will become a city fingerprint.** The six stalls sit in two tiny separated triplets around a large empty field in both D3 and E4. Changing their goods leaves the same kiosk profile. The guildhall's tall narrow clock tower and the cathedral's single spire are strong enough to become obvious repeats across cities. There is no demonstrated alternate civic composition or smaller settlement version. Large sprites have solved presence; they have not solved regional variety or integration into attached blocks.

**3. Top six concrete requests**

1. **Build complete lot and block shapes before expanding the decorative library. — C + new**

   Draw four reusable lot assemblies: a 1×3-cell narrow house, 2×3-cell merchant house, 2×4-cell workshop with rear wing, and 3×4-cell courtyard inn. These are ground footprints, not PNG dimensions. Give each an attached front, rear closure and exposed east/west end; include a north-street entrance treatment rather than substituting a blind rear panel. Draw a 96×96 px corner assembly with a 24 px recessed/chamfered entrance for a bent street. Relight its opposite-handed version; do not mirror the lighting.

   Assemble a 4×4-cell L block with a 2×2 court, a 6×5-cell U block with a 2×3 court, and a stepped wedge block. Put the return walls on the north–south streets. Connect each court to a street through one 48 px passage. Aim initially for roughly two-thirds of buildable block land occupied by buildings, excluding public streets; keep the remaining open land as deliberate courts and service space. This is a composition target, not an obligation to fill every hole.

   Every assembly needs separate ground footprint, painted bounds, entrance position, overhang allowance and occlusion mask. Keep the bottom-left **ground** anchor stable as floors are added. Increasing height must not silently increase the collision footprint or move the door. Sort buildings and actors by ground contact; draw ground and ground-received shadows first. Split gate/arcade supports from overhead spans, and split foreground roof/canopy masks where actors can pass beneath. Keep wall-received shadows with their wall layer. Do not put all overlays in a universal final pass.

2. **Replace “any roof next to any roof” with a drawn roof connection system. — B**

   Start with four distinct profiles: front gable, eaves-facing pitched roof, hip and low lean-to. Support 48/96/144 px widths and 96/144 px roof depths where structurally appropriate. Redraw the tile pattern at one native tile scale across widths; do not stretch a narrow texture. Keep the light direction and ridge geometry consistent. Include a quieter tile field with fewer dark outlines so a roof mass survives at 1x.

   Draw explicit 48×48 or 96×96 junction patches for inside valley, outside hip, ridge tee and ridge end, plus left/right transitions from depth 2 to depth 3. Add exposed party-wall sections in 48 px height increments, with 8–16 px visible returns, a coping and a matching roof-to-wall shadow. Give long eaves two termination treatments and a party-wall/chimney break every few lots; preserve an uninterrupted roof only when it belongs to one long building.

   Join only matching ridge direction, pitch, eave height, depth and material-edge family. Use a transition piece or reject the combination otherwise. Same-building internal edges suppress their outline; separate properties retain one intentional boundary treatment. Test every allowed pair, including tall-left/short-right and its reverse, instead of claiming every module can meet every other.

3. **Draw coherent facade families with structural alternatives. — A**

   Budget 36 upper-floor drawings: four families—timber, plain plaster, masonry and jetty—at three widths and three compositions each. For a 96 px frontage, draw one paired-window arrangement, one large off-centre window with a blank bay, and one shuttered/service arrangement. At 48 px, use a single narrow window, a high small window, or a closed shutter; do not squeeze a scaled-down two-window facade into it. Keep sill/recess depth consistent with `fantasy-house-2`.

   Retain three actual ground-floor compositions per shop/door/arch/work type and width: 36 drawings, not recolours. Move the entrance between left, right and central positions where the width allows. Give each family an approved one-, two-, three- and five-storey recipe. Align load-bearing posts and window bays vertically. Use one oriel or jetty transition to distinguish a building, with a 4–8 px projection and its own underside shadow; avoid a different architectural treatment on every floor. Keep the 48 px attachment pitch but stop treating a thick visible brown belt as mandatory on every material.

4. **Make rear plots useful and irregular. — C + new**

   Draw blank party walls, rear doors, small-window rear walls and hoist/loading doors in 48/96/144 px widths. Add a 48×96 px external stair with a real landing, a 48×48 px lean-to shed, and a 96×48 px low workshop wing. Supply gates as well as fences: straight 48 px runs, 24 px fillers, inside/outside corners, end posts and a 48 px opening. A fence must connect to a wall or another fence; no isolated decorative two-panel fragment behind every house.

   Separate the existing yard prop clusters into movable objects. Draw an empty swept court, worn-earth service patch, stacked firewood, drainage trough, shared well and two shed profiles. Use one shared well per court, not one per plot. Put the workshop wing and cart access in craft blocks, continuous enclosed courts in rich blocks, cramped shed additions in poor blocks and a cloister-like return in the temple block. Reserve 48 px clear routes before placing props. Washing lines may span a declared lane socket above those routes; their posts must not occupy the walking strip. Show the same court with a person at its entrance, rear door and occluded northern edge.

5. **Give landmarks attached wings and alternate silhouettes; compose an actual civic square. — D**

   Keep the existing cathedral and guildhall, but draw a lower broad church with a side tower and a wide guildhall with an off-centre roof turret. Add a 96×144 px chapel and a 96×192 px belfry as smaller civic choices. Draw 96×96 px churchyard/vestry and hall-side-wing modules that can connect to neighbouring roofs, plus a 48 px arcade bay with separate rear supports and front columns. Use entrance and roof connection sockets so a hall can belong to a street wall.

   Rebuild one square around a roughly 6×7-cell clear public space, with attached frontages on three sides. Put the church on the offset west edge, the hall across a short northern frontage and the market hall on a corner. Give the church a small enclosed side yard, not a moat of unused grass. Preserve a 96 px approach from the gate and 48 px access to each public entrance. Draw the gate throat with visible floor recession, dark inner returns and a readable far exit; provide the road beneath it as ground, not a brick-filled doorway picture. Vary tower spacing with wall end/corner pieces rather than stamping one interval forever.

6. **Make commerce a small interchangeable kit, then stop counting recolours as new art. — D + new (brief E)**

   Redraw the trade emblems to roughly 20–28 px wide and 24–32 px high, on a 32×40 px maximum sign assembly. Use a side-mounted bracket, a flush wall board and an over-door beam as three mount types. Place them in designated blank bays with a small clear margin around entrances and windows. A 48 px frontage may need a flush sign; it should not receive the same oversized bracket as a 144 px shop.

   Draw three 48×48 px stall structures—cloth canopy, sloped timber awning and open trestle—and one 96×48 px long counter. Make the six goods displays separate inserts. Supply opposing counter orientations so customers can use both sides of an aisle. Pack six to eight stalls into two facing rows with a 48 px aisle and a 96 px through-route, with stock behind the counters. Add 24 px kerb/gutter segments, 48 px corner/junction patches and a 96 px paving transition at the gate approach so ground changes terminate intentionally.

   **Size target: about 240 genuinely different master drawings, plus palette exports and assembly recipes.** This is a production budget, not a request to add 240 files to the existing folder. Keep or redraw existing assets toward these totals; aliases, colour swaps and enlarged review images do not count.

   | Area | Target masters | Spend the budget on |
   | --- | ---: | --- |
   | A facades | 72 | 36 upper-floor compositions and 36 ground-floor compositions |
   | B roofs | 48 | Profiles, depth/height transitions, junctions, party walls, roof details and shadow shapes |
   | C rear/side construction | 48 | Directional walls, corners, stairs, passages, gates, fences and service wings |
   | D civic/market | 32 | Alternate civic masses, connected wings, fortification pieces, monuments and stall structures |
   | E/new dressing and ground | 40 | Small signs/mounts, goods inserts, yard objects, kerbs, gutters and paving transitions |
   | **Total** | **240** | **Before recolours; shared pieces must not be counted twice** |

   Author at least twelve complete house recipes and eight different block plans using that stock. Prove them in four city layouts with different street and square structures. In each 1x viewport, prevent the same complete house recipe appearing twice on the same street, and avoid repeating the same height/width rhythm in adjacent blocks. Common blank wall and paving pieces can repeat freely where the repetition is not salient. If these tests still look copied, add the missing silhouette or junction—not another tint.

**4. Where I disagree with BRIEF-17**

- **“Every piece stacks on every other” is the wrong objective.** Universal pixel compatibility permits structurally incoherent floors and roof intersections. Keep shared attachment coordinates, but declare compatible families and explicit transitions. The existing COURSE.md even prioritises the retained course bands over removing them; that contract needs reconsideration if the owner still sees stripes.
- **“Overlays never cross a lot edge” conflicts with the requested city.** Street shadows must leave building footprints; signs, jetties and washing lines may project into controlled space. Define separate ground occupancy and permitted visual projection. Clip against neighbouring geometry and protected walking routes, not indiscriminately against a lot rectangle.
- **The lot dimensions contradict the roof and building ambitions.** Lots only 1–2 cells deep cannot also explain 2–3-cell roof depth, rear wings and yards without distinguishing world footprint from projected sprite height. Publish those dimensions separately. Allow deeper urban plots.
- **“Taller than any 5-storey stack” should not apply to every landmark.** Five facade courses already consume 240 px before the roof; the nominal 4×4 guildhall and 4×3 market hall canvases cannot meet that rule. The current cathedral/guildhall exports have already grown to 432/400 px tall. Reserve exceptional height for towers and spires; let a market hall win through breadth, roof shape, an arcade and placement.
- **Two wall colours and one roof colour per block is too rigid.** Use a dominant material family with an occasional repaired roof or different adjoining property. Uniform colour plus fixed course alignment can fuse a block into exactly the slab the brief rejects. Conversely, random colour on every floor is not variety.
- **A jog every eight cells, a wedge in every district and the same two rows of stalls in every square will become another template.** Use several block and market plans. Require a reason for a bend or widening—junction, gate, slope, civic frontage—not a periodic decoration rule.
- **“No bare ground inside a block that should be roofs” needs a footprint plan to decide what should be roof.** Courts, wells, loading yards and light wells are legitimate negative space. The failure is unplanned gaps, not visible ground itself.
- **The repetition rule is too weak, and the stage order is too linear.** “At most two identical pieces in five” still allows obvious ABABA rhythms and repeated whole houses. Judge buildings and blocks at 1x. Prove a small A/B/C assembly and its walking/occlusion rules before multiplying the facades, then expand D/E. Four critique rounds are a schedule limit, not evidence that an unresolved join has passed.

Summary: build a smaller, explicit grammar of believable lots, roofs and connected blocks; 240 purposeful drawings can support many cities, while thousands of interchangeable-looking exports will keep reproducing this one.
