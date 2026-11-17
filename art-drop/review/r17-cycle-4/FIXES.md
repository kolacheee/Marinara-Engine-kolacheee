## Top priority (coordinator review of cycle 3, 2026-11-17 20:41 UTC): fix these first
1. Roof colours went back to almost all orange: re-apply r_cycle1 (or an equivalent per-building colour pass) after the new layout, using the cycle 1 colourways (slate -cy1, brown -cy2, standard c1/c2); roughly half terracotta.
2. Flat grey rectangles inside facades and roofs (around x 290-335 y 430-530, x 576-620 y 385-430, x 1490-1535 y 385-430, x 1680-1725 y 480-525) read as missing art: every exposed side wall must be a drawn firewall or side piece; no flat fill anywhere.
3. Gaps between houses: close every bare paving gap that is not a deliberate alley; alleys are 1-cell lanes that run through, with lane paving and kerbs.
4. Remove the stray fences and benches drawn over the north blocks' roofs (around y 290-330), or move them into real yards.
5. Still a grid: the bent street and trapezoid blocks must read at 1x.
Keep: the ditch outside the north wall, the uneven towers, the new cobble texture, the inn near the gate.

# Round 17, cycle 4 — prioritised fixes

All five reviews are present: historian 5/10 (3 blockers), level 6/10 (2), owner 4/10 (5), pixel 5/10 (6), tech 4/10 (5). The 21 reported blockers overlap; they are merged below. Items 1–18 address blockers and acceptance; 19–20 are supporting improvements. Coordinates refer to the 1920×1440 final at 1×.

Apply `BRIEF-17.md`: 48 px registration, bottom-left anchors, reference-house high 3/4 view, top-left light, sharp 1 px exterior outlines, transparent PNGs, square grid edges, no blur or airbrush. Preserve course rows 0/47, compatible stacking, at most two wall colours and one roof colour per block, and lot-contained overlays. No exposed frontage lawns.

1. [piece] **Close the gate bypass and explain the passage.** Fit a 48×48 masonry connector at `(1296,1392)` against the right pier and southern curtain; preserve the controlled arch opening.
   Keep the brief's 3×4-cell gatehouse, with a readable 96 px ground opening, recessed jambs, hinges/grooves and raised grille or open leaves; connect its wall-walk.
   Separate support and overhead artwork/masks so a character under the arch can be shown clearly in the composition proof.

2. [layout] **Repair perimeter ownership and tower spacing.** In `r_render`, retain base-row order; within a row draw curtain/walk before projecting towers, then their owned attachments, instead of sorting these overlaps by x.
   Remove the duplicated northwest tower stamp and hard cut near `x=48`; join standard 2×3-cell towers to curtain connectors with one exterior contour, especially at base `y=240`.
   Restore roughly eight-cell tower spacing on the southern curtain, starting near `x=432,816,1584`; reflow plots to retain the continuous 48 px inner wall lane.

3. [layout] **Enclose the square with inhabited frontages.** Establish an irregular 8×6-cell core near `(720,768)–(1104,1056)`, cut by a 2×2-cell notch; move the 4×3 market hall to its northwest edge.
   Keep the guildhall north and church west, attach an east-facing 48×48 church porch, and face the eastern inn arcade and southern shops into the square.
   Retain six stalls in rows, an open central fountain/cross, a 96 px arrival route and 48 px circulation; keep church and guildhall approaches clear.

4. [layout] **Make the gate-to-market road continuous.** Carry a clear 96 px band north from the gate near `x=1248`, west through `y=1056–1152`, then north at `x=1104–1200` into the square.
   Join kerbs and 2–3 px gutters through square corners; use lighter, quieter paving than side streets, with two cobble sizes and restrained joints.
   Move the gate guard and all counters/crates outside this band; prove character/cart clearance and a legible turn beneath the overhead gate artwork.

5. [layout] **Build streets around actual block edges.** Reclaim surplus paving in the west and northeast with legal rear wings and connected frontages; give north–south streets gable returns and usable side entrances.
   Connect 48 px secondary streets and 24 px rear lanes with continuous kerbs/gutters; distinguish private service mouths from public through routes.
   Keep no unchanged street-width run longer than eight cells; include a T-junction, bend and coherent stepped wedge in each district, with the 48 px wall lane connected.

6. [piece] **Approve one ordinary house before multiplying it.** Redraw a 96 px-wide house from 96×48 ground/storey modules beside `fantasy-house-2`: visible gable, 3–4 px eave recess, shaded beams and 4–6 px plinth top.
   Use roughly 20–24 px recessed windows with a 1 px lit sill and 2 px lower shadow; distinguish timber faces from highlights and soften internal panel borders while retaining the exterior contour.
   Match shop and upper-floor finish with two window families per colourway; compare the complete house at 1×/4× before propagation.

7. [piece] **Replace flat firewall patches with receiving faces.** Draw left/right 48×48 corner and party-wall modules with an 8–16 px return, lit coping, shaded east face and a single dark contact edge.
   Fit them to the northwest steps, north-middle height change and east court ends; preserve full window bays and doors, and match the return to 96/144 px roof depth.
   Draw flashing against each actual lower-roof intersection; continue side-ground/storey/roof modules into the north–south street entrances.

8. [piece] **Author coherent roof junctions.** Pilot a 96×144 cap beside a 48×144 companion: one readable ridge, consistent slopes and one near eave in the reference projection.
   At `(336,384)`, use a 96×48 rear-eave/front-hip junction with one owner; remove the doubled eave and draw its gutter, valley or receiving wall.
   Add 48×48 hip/gable valley/end adapters with registered ridge/eave/course endpoints; cover intended building interiors without erasing deliberate yards.

9. [piece] **Unify roof scale and quiet the material field.** Redraw w1–w3 caps, rear roofs and ridge caps with one approximately 6–8 px tile width and 3–4 px course height, adjusted consistently for projection.
   Use three main values and restrained highlights; remove orange flecks, most black internal joints and rounded bead ends in favour of angular tile clusters.
   Mute the red ramp and bright window/wall-walk accents so church, guildhall, gate and main street lead the native-size greyscale view.

10. [layout] **Show complete property sequences.** Recompose northwest `x=144–432` and south-central `x=480–720` into 48/96 px frontages on the brief's 1–2-cell-deep lots plus rear yard strips.
    Run fences back from party walls, expose a strip beside a lower neighbour, and place 48×48 sheds against rear boundaries rather than in isolated roof notches.
    Connect rear doors/ranges to a 48 px back passage and one covered street access; vary at least two yard arrangements while keeping gardens behind buildings.

11. [layout] **Remove both frontage lawns and finish their boundaries.** Pave the church-side 3×2-cell patch `(576,672)–(720,768)` as an enclosed churchyard with low masonry, gate, worn path and a tub tree or grave slabs.
    Replace the western court's 2×2-cell grass area with worn workyard paving, drain and existing well; move its loose fence to base `y=1008` and attach it to the enclosing boundary.
    Leave a 48 px opening at `x=288–336` with continuous paving to the rear stair; use matching kerb ends/corners and keep laundry and vegetation off that route.

12. [piece] **Draw structural shade beneath the hall and gate.** Add a hard-edged, footprint-shaped shaded region of about 144×36 px beneath the market hall at 25–35% darkness, merged cleanly with pillar shadows.
    Give the gate a 1 px inner contour, 4–6 px shaded soffit and 12–18 px threshold shade while preserving a readable pale approach on both sides.
    Keep south/east cast shadows and eave/jetty contact shade sharp, at most 50% alpha and inside their owning lots; avoid doubled dark seams.

13. [piece] **Give the inn and usable doors unmistakable thresholds.** At `(1296,1008)`, draw a 96×48 inn-front with one dominant 24–32 px door, shallow porch, lit 4–6 px step and lantern beneath the tankard.
    Continue paving through the adjacent recessed courtyard arch, reserve a clear 48×48 landing, and shutter/darken competing blind doors.
    Apply the same entrance cues to shops and side doors; an optional small bed motif may confirm lodging without enlarging the trade sign.

14. [piece] **Integrate all eight trade signs into the buildings.** Replace cream badge rims with 1 px dark contours, narrow upper-left highlights, short lower-right thickness edges and bracket contact shadows.
    Keep 48×48 allocations and the brief's twice-round-15 sign scale; mount brackets on beams beside entrances without covering doors or principal windows.
    Check smith, baker, apothecary, cobbler, inn, scribe, tailor and butcher symbols at literal 1×; reposition or simplify signs before reducing their required readable size.

15. [layout] **Audit every placed instance for repetition.** Replace `r_repeat_audit`'s equal-base-row grouping and per-lot deduplication with connected-frontage, vertical-stack and perimeter-chain scans.
    Count every floor/wall instance; compare visible artwork and window motifs so aliases or hidden edits do not count as variation, and reject more than two identical pieces in any five.
    Cover stepped rows, north/south curtains, the northeast house `(1488,432)–(1584,576)` and square side elevation `(1200,816)–(1296,1008)` explicitly.

16. [piece] **Supply variation where the audit fails.** Draw at least three distinct 96×48 parapet/walk tops with matching endpoints; compose the southern run from `x=192` as A–B–C–A–B.
    Replace the northeast house's middle repeated floor with an oriel; vary the square-side floors as recessed pair / shuttered pair / oriel / recessed pair within the two-window-family limit.
    Draw three structurally different shop fronts per ground kind; vary doors, bay widths, supports and awnings while preserving stack courses, rather than adding superficial pixel noise.

17. [layout] **Make districts explain wealth and work.** Give one northeast merchant block coherent muted slate roofs, stone grounds and two banners; retain 3–5-storey square/main-road houses and low 1–2-storey southeast brown roofs.
    Add patched rear walls, worn yards and 48×48 lean-tos in the poor quarter; put a 96×48 stable/storage range behind the inn's courtyard entry.
    Give the western workshop a 48×48 forge apron, fuel store, service entrance and distinct smoke/chimney silhouette; preserve each block's two-wall/one-roof-colour limit and route clearance.

18. [layout] **Make acceptance proofs expose these failures.** Extend `compose.py` proofs with five wall sections, five staggered connected lots, a five-floor stack, both tall/low roof orientations and a tower shifted 48 px relative to its curtain.
    Retain the brief's 16×12 L/T/dead-end block, irregular landmark square, five/one-storey pair and self/variant seam sheets; render at 1×/nearest-neighbour 3× with reference/r15 comparisons and greyscale.
    Include gate/inn/court actor and overhead-mask views; require the instance audit, joins, clear entrances and landmark/gate/main-route squint test to pass before acceptance.

19. [layout] **Give the east dead end a destination.** In `x=1488–1584, y=864–1056`, retain the western 48 px clear strip and a distinct 48 px court entrance.
    Group cart, crate and fence in one eastern 48×48 loading recess; keep the tub tree against that edge farther north and add a 24×24 workshop marker beside the rear door near `(1536,840)`.

20. [layout] **Stage purposeful activity after access is fixed.** Use side/back-facing variants at the existing 12–16×28–32 px character scale: sellers behind counters, two customers facing goods and a porter by the cart near `(888,888)`.
    Place a seated figure inside the paved church enclosure and a guard beside the gate; keep the 96 px market crossing, arrival road and all door landings clear.

Rejected or constrained proposals: the level review's four-cell-wide gate and tech review's single 144×240 bastion replace the brief's specified 3×4 gatehouse and 2×3 towers; retain their access/join fixes using the required footprints and modular connectors. The historian's fixed 96 px house plus 96–144 px rear extension is not adopted as a new lot standard: retain the brief's 1–2-cell lots plus yard strips and expose boundaries through composition.

The pixel review's 24 px craft-court opening is dropped in favour of the other reviewers' 48 px serviced entrance; 24 px remains valid for the brief's rear lanes. The level/pixel suggestion to leave the church lawn alone is dropped because the owner identifies it as forbidden frontage lawn; retain the churchyard function with paving. Fixed 28–36 px or 32×40 px sign-shrink caps are not acceptance rules: they must yield to the brief's twice-round-15 scale and 1× trade recognition.

Earlier panel directions cannot waive this brief's eight-cell street variation, required wedge/T/bend, stack courses or ban on cross-lot overlays. The level review's live player-reveal code is deferred to a separate engine task; this art checkout must supply separated overhead/support artwork and visible clearance/reveal proofs, without claiming runtime collision is verified.
