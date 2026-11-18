# Round 17, cycle 5 — prioritised fixes

All five reviews are present: historian 4/10 (3 blockers), level 6/10 (3), owner 4/10 (5), pixel 4/10 (5), tech 4/10 (4). The 20 reported blockers are merged below. Implement blocker repairs 1–16 first, supporting improvements 17–19 next, then the acceptance gate in 20. Coordinates refer to the 1920×1440 final at 1×.

BRIEF-17 governs: 48 px grid, bottom-left anchors, reference-house high 3/4 view, top-left light, one-pixel dark exterior outlines, hard pixel edges, transparent PNGs, no blur, airbrush, rounded grid edges or frontage lawns. Preserve course rows 0/47 and compatible stacking, 1–2-cell lots plus rear yard strips, at most two wall colours and one roof colour per block, and lot-contained overlays.

1. [piece] **Replace roof strips with complete pitched volumes.** Prove a 96×96/144 roof on the northeast house at `(1392,288)`, then the northwest group and slate roof at `x480`; continue one ridge, receding slopes and left/right shading through every cap and fill.
   Draw slope-specific 48×48 fills and ridge/valley/hip transitions with matching tile direction and eaves; replace the abrupt cuts at northwest `y384` and slate `y336` with actual roof junctions.
   Keep w1–w3 widths and 96/144 px cap depths; compare the complete house beside `fantasy-house-2` at 1×/4× before propagating the kit.

2. [layout] **Assign one owner to each shared outline.** Remove doubled borders at `x239–240`, `335–336` and `1487–1488`, especially `y289–383`, by suppressing the redundant touching edge in the compositor.
   Retain the full 48 px placement pitch and one dark pixel at true building boundaries; remove module-only seams inside continuous roof planes without overlapping whole sprites or shrinking lots.
   Render every w1/w2/w3 neighbour combination, including unlike heights, to check for gaps and doubled contours.

3. [piece] **Make neighbour returns continuous through the stack.** At `x1488` and `x816`, draw an approximately 8 px masonry return inside the taller lot, with one outer contour and a 2–4 px coping/flashing edge following the lower roof.
   Continue its body without restarting caps each storey; remove conflicting baked bevels while preserving course rows 0/47, and mask the lower roof against the receiving wall.
   Anchor attachments to the building baseline; retain north-first base-row order and ground/storeys/roof/overlays within each row.

4. [piece] **Unify roof and facade materials.** Replace fine horizontal roof stripes, coarse diagonal patches and mottled tower-house texture with consistent 6–10 px tile clusters and restrained reference-house ramps across caps, fills, adapters and rear roofs.
   Redraw the market hall's rounded scalloped tiles as angular planes at the same material scale; keep broad plaster/timber masses and two window families per colourway.
   Give the connected block east of the guildhall one muted slate roof family and no more than two wall colours; vary roof colours between blocks instead of inside them.

5. [layout] **Make each property readable from street to rear boundary.** Rebuild northwest `x144–432`, then northeast and southern groups, as 48/96 px frontages with a principal house, legal rear wing, 48 px yard strip and fence returns aligned to party walls.
   Put one shed, woodpile or washing area against each visible rear boundary; connect yards through bounded 24 px service passages or street arches, and separate the northwest stair court from its access passage.
   Close accidental paved holes with roofs or rear/side walls, while retaining deliberate enclosed courts and the brief's lot dimensions.

6. [layout] **Give side streets inhabited edges and explicit junctions.** Add side-ground/storey/roof returns with at least two door or workshop bays along the slots at `x432–480` and `x1344–1392`; reclaim one surplus 48 px strip at the eastern apron with frontage or an enclosed service court.
   Preserve a 96 px east–west route near `y672–768`, a 48 px north branch near `x1584–1632`, 48 px secondary streets and 24 px service lanes; mark private mouths and closed ends distinctly.
   Use 48 px block-edge jogs before unchanged widths exceed eight cells; retain a T-junction, bend and stepped wedge per district, plus the continuous clear 48 px inner wall lane.

7. [layout] **Frame an irregular civic square with buildings.** Keep church west and guildhall north; move the 192×144 market hall to the south rim near `(768,1008)`, reworking displaced lots, and complete the east rim with inhabited frontage around the inn.
   Lay out an L-shaped floor at least 6×5 cells; start with an 8×6-cell envelope and a 2×2-cell notch, expanding it if required to preserve the 96 px gate-side opening and through-route.
   Place the fountain/cross in the open middle and six 48×48 stalls in two rows with a 48 px browsing aisle; keep 48 px clearance around the fountain, church stair and public thresholds.

8. [piece] **Connect the church to the square and restore civic authority.** Add an east-facing 48×48 porch/landing near `(672,912)` with a visible public door and unobstructed 48 px approach; keep the attachment inside the church allocation.
   Turn the northern pocket into a connected 144×96 churchyard with boundary returns, a 48 px gate, packed earth or paving, a path and restrained markers; place the bench/tree inside its enclosure.
   Lower neighbouring domestic masses by one 48 px course where possible so the guildhall roof and bell tower read clearly; leave its arcade approach open and preserve the civic skyline above ordinary stacks.

9. [layout] **Draw ground according to use.** Give the square quiet large slabs, continue the pale 96 px gate road through the inn bend into it, use smaller cobbles on 48 px side streets, and distinguish private courts with darker dirt or stone.
   Replace freestanding parcel rectangles with straight kerbs and 2–3 px gutters following actual building bases and routes; add a clear threshold at the northwest court mouth near `(288,672)`.
   Keep lanes lighter than cast shade and use two cobble scales; reduce perimeter highlights so the square, civic entrances, gate and main road dominate the full-city greyscale view.

10. [piece] **Replace strip shadows with joined caster footprints.** Draw continuous south/east contact shade and a 12–18 px southeast wall shadow near `y240`, with tower projections; reshape the northeast house shadow to its stepped facade and overhangs.
    Replace the fountain's detached wedges with a 96×48 continuous base-shadow overlay, and the gate's rectangular east band with a tower-shaped mask; retain eave and jetty contact shade.
    Clip masks to receiving surfaces and owning lots, union overlaps before compositing, retain hard edges and visible paving, and cap opacity at 50% without doubled dark joins.

11. [piece] **Join curtain, towers and wall-walk as one structure.** Prove a 96×144 curtain section at `x864–1056` with matching 48×48 tower shoulders, outer-turn and gate/wall connectors; repair the northwest return and southern gate contacts.
    Match parapet depth and course heights through the stair landing/end wall at `x960–1056`; use the same restrained stone ramp and roughly 12–20 px stone lengths from parapet to foot.
    Break uninterrupted mortar bands without changing join profiles; quiet north-wall and interval-tower contrast so the gate and civic centre retain priority.

12. [piece] **Integrate trade signs into the architecture.** Start with baker and apothecary, then smith/cobbler and tailor/scribe: replace blank cream billboard walls with recessed windows, timber bays or appropriate awnings.
    Retain 48×48 sign allocations and the brief's twice-round-15 sign scale; mount boards on short brackets beside doors, with a 1 px outline, lit top edge, shaded right thickness and small southeast shadow.
    Keep doors/windows unobscured and verify all eight trades at literal 1×; resolve visual competition through placement, wall modelling and restrained values rather than undersized signs.

13. [piece] **Make shop goods agree with their signs.** Draw 48×48 ground-shop variants with the existing door/counter split: grouped bottles and mortar for apothecary, two boots and a leather roll for cobbler, folded cloth and a hanging garment for tailor.
    Replace their repeated loaf displays near `(1104,624)`, `(336,864)` and `(1584,864)`; retain loaves at the baker and use only two or three clear goods masses per counter.

14. [piece] **Make usable doors and through-passages unmistakable.** Redraw the inn's 96×48 frontage near `(1296,1008)` with a dominant western entrance, 32×8 lit stone step and lantern; reserve a clear 48×48 cell immediately south.
    Retain the eastern 48 px courtyard passage with receding paving and a darker upper arch; keep the gate-to-inn route clear and make the room door the stronger interaction cue.
    Apply lit steps/lanterns consistently to usable shop and side doors; dim and shutter blind openings instead of giving every generic door the same invitation.

15. [piece] **Vary whole building forms after repairing the kit.** Draw three compatible 48/96 px facade arrangements using changed window placement, an oriel and a recessed workshop opening; retain two window families per colourway and three variants per ground kind.
    Alternate actual ridge/hip arrangements, set selected north roof ends back 48 px, and add a 96×48 transverse connection in each northern block; vary tower caps/openings without altering connection profiles.
    Enforce at most two identical pieces in every sliding run of five, then inspect silhouette and bay rhythm at 1×; colour flecks, aliases and extra chimneys do not establish structural variety.

16. [piece] **Replace market clones with purposeful activity.** Draw at least three distinct vendor silhouettes/outfits at roughly 16×32 px, use each no more than twice, and vary their positions behind the six counters.
    Turn two customers toward goods; move the cart into a 48×48 loading pocket beside the market hall with a porter, seat a figure at the churchyard bench and put a guard beside the gate opening.
    Keep all people and props outside the 96 px through-route, 48 px circulation lanes and entrance approaches.

17. [layout] **Express wealth and craft through building form.** Replace two tall domestic stacks in the southern ochre groups with one- or two-storey houses, 48×48 lean-tos and enclosed working yards; retain 3–5-storey stone-bottomed merchant houses on the square/main road.
    Add a 48×48 forge/workbench behind the anvil frontage near `(240,912)`, with a tool rack, small warm furnace opening and hard-edged smoke contained in its lot.
    Use patched shutters and low sheds in poor blocks while preserving each block's two-wall/one-roof-colour limit.

18. [layout] **Give secondary routes memorable destinations.** Place a 48×48 shrine or noticeboard in the northeast recess near `(1440,624)`, outside the through-route, and distinguish its court floor from the public street.
    Recess the building edge by 96×48 near north-wall junctions `x672` and `x1344` for a well/bench and guard noticeboard respectively; preserve the clear 48 px wall lane and connect each recess to a visible threshold.

19. [piece] **Show how the defences are operated.** Make one northern 48 px stair/access bay or walk-level tower door legible, using the matching landing and wall-walk joints from item 11.
    Add recessed gate leaves or a portcullis groove and a 48×48 guard/toll bay beside the passage, outside its clear width; retain the 3×4-cell gatehouse and 2×3-cell towers.
    Keep towers roughly eight cells apart; use restrained shutter/repair/cap variants without adding towers as filler or overpowering the gate.

20. [layout] **Render acceptance proofs that expose the repaired joins and spaces.** Retain the 16×12 L/T/dead-end block, irregular landmark square, five-storey/one-storey pair and every-piece self/variant seam sheets; add both tall/low orientations and complete curtain/stair/turn/gate connections.
    Render 1× and nearest-neighbour 3× comparisons with round 15 and today's town, plus full-city greyscale; label the cycle correctly and provide a discoverable current squint image rather than relying on missing `critic-r17R*squint*` files.
    Check roof volume, single contours, palette limits, shadow contact, clear approaches, trade recognition and repetition; draw route/actor clearance proofs without claiming runtime collision or pathfinding was tested.

Rejected or constrained proposals: fixed 24×32 px (owner) or 28–36 px (pixel) board caps, and the associated fixed symbol caps, are dropped as acceptance limits because BRIEF-17 requires signs twice the round-15 size. Keep their architectural mounting and shading ideas; an unchanged transparent canvas alone does not satisfy the sign-scale requirement.

Treat the owner's approximate church portal position `(696,912)` and 48×72 proposal as a sketch, not a new grid module: use the registered 48×48 porch/landing above, with any taller portal art fitted to a whole-cell canvas inside the landmark allocation. Rear-wing suggestions must fit the brief's 1–2-cell lots plus yard strips; they do not authorise deeper lots. The owner's square dimensions are a minimum, not permission to squeeze the clear routes or approaches.

Caster-shaped shadows remain clipped to owning lots even where an unclipped footprint would look more natural: the brief prohibits cross-lot overlays. Keep the inner wall lane clear; place the level review's orientation pockets on the building side rather than narrowing it. Earlier panel waivers of street variation, stack compatibility, sign scale or lot boundaries are not carried forward. Retain the brief's eight-cell limit, required T/bend/wedge, course rows 0/47 and specified landmark footprints.
