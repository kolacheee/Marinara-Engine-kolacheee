# Panel 1 — game and level design

Reviewed the three requested renders at native display size, with native-size crops of the comparison and enlarged street, entrance, roof and market details. Also opened all four r15 house references and all six hall references, enlarging representative buildings to 3x. The local `reference/r17/` directory exists but is empty. This review uses the supplied BRIEF-17 revision that already includes part E and panel amendments. Coordinates below refer to the 1200×912 standalone mockup, measured from its top-left. These are visual findings; a screenshot cannot establish actual collision or click behavior.

## 1. What works

- The lighter square at approximately x384–864, y336–672 is immediately distinguishable from the surrounding streets. It provides the beginnings of a useful destination.
- Attached frontages and variable building heights establish greater density than today's isolated houses. Keep that density. The reference houses supply the better model for roof volume and recognizable doorsteps.

## 2. Problems, most important first

1. **The ground does not explain navigation clearly enough.** Look at the east street, x864–960, and the south cross-street, y672–768. Their giant, strongly outlined cobbles compete with people, thresholds and building detail. The same texture runs into the narrow northwestern gap at x336–384 and the spaces near the wall, so a major route, alley and leftover paving have nearly the same visual status. The square has a different surface but no clear through-route. I can see empty ground; I cannot quickly read the intended circulation hierarchy.

2. **Entrances are numerous but their meaning is unclear.** Along the north edge of the square, y288–336, small brown doors, shop counters and dark recesses share similar visual weight. The arch around x550, y315 and the matching arch around x70, y650 could be passages, enterable buildings or decoration. Their darkness does not answer that question. Hanging signs around x434 and x674 are detectable but not dependable trade identifiers at 1x. Clicking a tall facade also needs an obvious destination at its base. The references make that destination much clearer with a framed door and a broad lit step.

3. **These are strips of frontage, not convincing blocks with depth.** The north row at x384–864, the west block at x0–384, y400–672, and the cropped southern row all terminate in straight facade bands. The north–south gaps expose little convincing side elevation or corner turn. Visible roof pieces do not establish a continuous occupied block behind the front walls. Adding more floors increases the striped effect. Today's houses, especially `fantasy-house-2` and `fantasy-hall-3`, show roof mass, eaves and an entrance-bearing volume; these stacks mostly show floor divisions.

4. **There is no strong orientation anchor or visible exit cue in this crop.** The entire north edge is wall, with no visible gate. The square's well around x640, y500 is less prominent than either tree. The tallest house near x430 looks like an enlarged version of its neighbors, not a civic destination. Red roofs and green awnings repeat in all directions. “Meet at the hall” or “head toward the gate” is not yet a usable instruction.

5. **People are present, but the player is not identifiable.** The green/brown figures near x520, y350 and x575, y480 lose separation against paving; the red figures on the east and south streets compete with similarly colored architecture. Clothing categories survive better than faces or roles. I cannot identify a designated player in the mockup. Today's blue block figures are crude but much easier to locate instantly. The replacement needs to retain that visibility without retaining the placeholder look.

6. **The market has the scale and arrangement of scattered props.** The small stalls near x455, y395 and x520, y395, and the pairs near the square's lower corners, read as boxes with lids. They do not establish a recognizable selling side, vendor position or browsing aisle. Large paving slabs make them look smaller still. The center contains loosely spaced people and a tiny well rather than a strong meeting place. The bench under the eastern tree is a clearer activity cue than most of the market.

7. **The mockup avoids the hardest walkability cases.** People mostly stand on exposed paving. It does not demonstrate someone walking behind a tall southern frontage, approaching an east-facing door, passing another actor in the x336–384 alley, or crossing beneath the north-row arch. Those cases will decide whether denser roofs and back rows produce a playable town or hide the player. More architectural detail alone cannot settle them.

## 3. Top six concrete requests

All dimensions below are proposed native-pixel sizes; one cell is 48 px. “New” includes playability work associated with the brief's existing part E.

### 1. Draw a street hierarchy and prove a connected route — New / E

Make a quiet cobble set with stones roughly 6–12 px across, a 3–4 px kerb and a narrow dark gutter. The center of the walking surface should have substantially less contrast than a person's outline. Draw straight, bend, T-junction and square-entry pieces. Keep **96 px of unobstructed width on the main route**, 48 px on side streets, and use 24 px lanes only for deliberate single-file passages.

In the revised composition, lead the eastern north–south street to a visible gate, connect it to the south cross-street, and carry a clear branch across the square to the western street. Reserve a second connection so visiting the market does not require retracing one corridor. Put furniture and goods into edge pockets, not those paths. The generator must place the connected street network before filling frontage, and reserve actual clear width after steps, posts and stalls are added.

### 2. Make an entrance kit with three unmistakable meanings — A

For a 48 px ground-floor module, draw an enterable door approximately **20–24 px wide and 30–36 px high**, a recessed dark surround, a **28–32 px wide step projecting 8–12 px**, and one projecting lantern. Draw a separate shuttered service door with no inviting step. For a through-passage, use a **48 px clear opening** in a wider ground module: show paving continuing through it and a lighter far opening. Do not end it in the same black patch used for an interior entrance.

Give shops a door beside the counter, rather than making the counter look like the entrance. Add left-door, right-door and corner-facing versions. Put a 20–24 px shaped trade sign beside the relevant opening, with a simple readable symbol. Every enterable asset needs a door anchor and a reserved **48×48 px approach area** connected to a street. A click on the building should resolve to that door; a passage must connect two walkable spaces.

### 3. Build one convincing corner block before producing more frontage — B + C

Draw a sample block roughly **6×5 cells**, with frontages on two adjoining streets, **96–144 px deep roof planes**, an exposed gable end, an inner roof valley and a small rear court. Include a two-storey building adjoining a four-storey one so the taller building exposes a real side wall. Turn one shop around the corner and give the side street an entrance of its own. Set one frontage back 48 px to make a useful pocket beside the junction.

Supply front, rear and side ground walls, outer and inner corners, roof fills, hip/valley pieces and party-wall exposure. Keep the court intentional: fence it and show a connecting passage, rather than filling every unoccupied pixel with paving. The generator must understand parcel footprint, roof projection, adjacency and court access separately. A taller facade cannot simply occupy the neighboring route because its image is larger.

### 4. Establish three different orientation cues — D

Replace part of the **north edge of the square** with a recognizable civic building: a **192×192 px hall body** with a broad arched entrance, banners and a separate bell-tower extension. Reserve enough upper canvas for its silhouette to reach roughly **384–432 px above its base** if the neighboring five-storey roofline requires it. Keep the tower visibly different from residential gables. Put it on the north edge so its height projects over its own block rather than covering the square's walkers.

Place a gatehouse on the north end of the eastern route. Allow **192 px total width**, with a **96 px clear opening** between towers and differently paved ground continuing through. In the square, use a **96×96 px fountain base**, offset from the main crossing, with a continuous 48 px walking apron. These give the player a skyline destination, an exit and a nearby meeting point. The generator must reserve their footprints, approaches and sightlines before fitting ordinary lots around them.

### 5. Draw a market people can actually use — D

Make each stall a **48×48 px ground footprint**, with an approximately **44 px wide canopy**, distinct support posts, a visible front counter and a roof high enough to shelter the same 30–36 px people used in the town. Allow the drawn canopy to extend above that footprint. Use three large readable goods shapes per trade: bread loaves, folded cloth, fish, baskets of fruit. Color alone should not identify the trade.

Place six stalls as **two runs of three**, facing a **96 px browsing aisle**, with 48 px access around their ends. Reserve a vendor position behind each counter and a customer position in front; draw both orientations. Put this group on one side of the square and leave the fountain and gate-to-square route clear. The generator needs selling-side orientation, vendor/customer anchors and collision footprints, not six interchangeable decorative squares.

### 6. Add an actor-and-occlusion proof sheet to acceptance — New

Show a player and three townsfolk at approximately **16–20 px wide and 30–36 px tall**, using clear head/body/leg masses and one dominant clothing color each. Give the player a **22×10 px foot marker with a light center and dark border**; draw idle and selected versions. Include an approximately **10×6 px contact shadow** for ordinary figures. Test these on the cobbled street, pale square and under an awning at 1x.

Draw before/after examples of the player passing behind the tall corner block, through an arch and beside a stall. Mark which roof/wall portion must fade or cut away to preserve the actor and destination. Do not solve this by making every actor enormous. The placement data must distinguish occupied ground, drawn overhang, clickable building, entrance, passage, actor standing point and occluding image region. The generator must keep vendor spawns and furniture out of circulation and guarantee a route from the gate to every active entrance. Accept the city only after those routes work with the camera at the intended play scale.

## 4. Where I disagree with BRIEF-17

- **Do not finish A–D before testing streets and actors in E.** First produce one corner, a roof, an entrance, a street junction and an actor at the same scale. Otherwise four art batches can pass while their combined city fails to play.
- **“Lots are 1–2 cells wide and deep” is underspecified alongside 2–3-cell roof depth and yards.** Separate ground footprint from projected image bounds. Explicitly allow deeper parcels and civic footprints; do not let the packer infer that an entire three-cell roof fits inside a one-cell-deep collision lot.
- **“Taller than any 5-storey stack” cannot apply to the entire landmark list.** A fountain, market hall and gate need recognizable silhouettes and placement, not cathedral height. Even the cathedral's stated 288 px canvas height is less than five 48 px floor modules plus a 96 px roof. Specify body footprint, total image bounds and tower extension separately.
- **“Overlays never cross a lot edge” conflicts with the requested signs, street shadows and washing lines across lanes.** Allow explicit overhang zones and cross-street attachments. Prevent them from obscuring entrances or consuming required walking width; do not prohibit the geometry that makes a street believable.
- **A half-cell lane is not a general-purpose two-way street.** At 24 px, it has almost no allowance for two 16–20 px figures, a gutter or a projecting prop. Design it as single-file, with passing pockets or suitable movement behavior. State whether quoted widths are clear movement widths or include decoration.
- **Compulsory width changes every eight cells and a wedge in every district will produce a different repeated formula.** Let gates, junctions, parcel boundaries and civic approaches motivate changes. If wedges are mandatory, commission diagonal kerbs, matching corner buildings and their walkable masks; they are not currently a complete asset requirement.
- **The critic needs movement and interaction failures, not just image failures.** “Every street has a shadow” is a poor universal rule: a broad sunlit route is legitimate. Reject unreadable actors, hidden active doors, blocked approaches and invisible route continuations instead. Likewise, exposed ground inside an intentional accessible court is desirable, not a roof-fill error.

Round 15 reads as a dense facade catalogue; round 17 must read as connected streets with usable entrances, believable blocks and an unmistakable civic anchor.
