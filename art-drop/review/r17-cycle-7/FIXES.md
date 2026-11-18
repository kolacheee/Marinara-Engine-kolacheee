# Cycle 7 — prioritized fixes

Merged from all five cycle-7 reviews against `BRIEF-17.md`. P0 covers every reported blocker; P1 follows after structural repairs. Coordinates refer to the 1920×1440 final, measured from top-left.

Keep the 48 px grid, bottom-left anchors, fixed stacking courses on rows 0/47, town-house 3/4 view, top-left light and one-pixel exposed outlines. Preserve native pixel scale, hard angular edges, transparent PNGs, and at most two wall colours and one roof colour per block. No blur, smoothing, rounded grid corners or street-front lawns. Preserve the brief's landmark allocations and dominance; code assembles and masks the drawn pieces.

1. **[layout] P0 — Enclose complete property groups.** Rebuild the northwest x144–672/y264–720 and northeast x1392–1824/y336–768, then the eastern and southern gaps, as joined L-shaped blocks with side/rear elevations.
   Use 48/96 px-wide and 48/96 px-deep building footprints, separate 48×96 private yard strips and selected attached 48×48 rear sheds; cover accidental paved voids with owned roofed wings.
   Align fences to party boundaries, give retained courts a rear door or 24 px passage, and preserve the northwest well court. (Historian 1; owner 1.)

2. **[layout] P0 — Make street rank structural.** Reserve a connected 96 px gate-to-square route, 48 px side streets and 24 px service lanes; extend plots into the western crossing and eastern aprons.
   Along x1488–1584/y672–1008, replace two end assemblies with 48×96 side-facing houses whose doors address the street; maintain two continuous street edges.
   At the southeast approach near (1392,1152), step a boundary 48 px for 96 px and back; fit roofs/yards to the wedge and join a rear lane at a T. Repeat bends/wedges per district and vary street width within each eight-cell run without pinching the main route. (Historian 2; owner 1.)

3. **[layout] P0 — Frame the civic square with inhabited fronts.** Use the 336×336 core at (768,720), with a 48×48 notch; keep the church west and guildhall north, giving them visible square-facing entrances.
   Integrate an east church porch within its existing allocation and a west-facing inn return near (1200,816), using a 1–2-cell ground footprint; preserve 48 px entrance approaches and the 96 px eastern route.
   Keep six 48×48 stalls in two rows with a 48 px aisle, an accessible fountain/cross in the open middle, and clear counters and church steps. (Owner 2.)

4. **[piece] P0 — Establish one roof-and-return standard.** Redraw 96/144 px-deep roofs for 48/96/144 px frontage modules, coherent side-ground/storey/roof assemblies and native 16 px receiving margins; do not squeeze window bays.
   Replace the guildhall's striped cap with a 192×96 roof, eave near y528 and ridge toward y432, a 12–16 px shaded return and 2–3 px eave shadow; repair northwest/eastern joins to the same standard.
   Compare against `fantasy-house-2` and `fantasy-hall-2`; add two 16×48 civic banners to the hall's outer piers while leaving its three arcade openings exposed. (Pixel 1; owner 4; tech suggestion 6; level suggestion 5.)

5. **[piece] P0 — Close attached-roof contacts.** Draw handed 48×96 and 48×144 valley/hip adapters for the red row x720–1056/y256–340; replace accidental ground wedges with roof or owned masonry.
   Replace the eastern masonry zipper at x1472–1504 with 16×48 firewall bodies, one exposed coping and 1–2 px flashing following the lower roof.
   Compose receiver, lower roof and flashing in that order within the registered assembly and owning masks; retain deliberate courts and continuous shared eaves. (Tech 1.)

6. **[piece] P0 — Roof the southern market hall completely.** Redraw its 192×144 sprite at (768,1056): a continuous upper 192×96 roof with ridge, shaded return and eave thickness above a lower 192×48 four-bay arcade.
   Put posts beneath the eave, occlude the appropriate counters/floor, and retain a readable north-facing trading entrance; remove the exposed rear arcade above the orange roof strip.
   Supply an entrance footprint and foreground reveal mask for access proofs; the normal city render must show a complete roofed hall. (Owner 2; pixel 2; tech 4.)

7. **[piece] P0 — Unify the gate chamber, bearings and stair.** Redraw the central connector above the portal as one 144×96 module within the prescribed 144×192 gatehouse allocation, preserving the twin-tower silhouette and clear passage.
   Give the 96 px bridge span matching tower/wall stone courses, a 12–16 px visible walk top, clear bearings and one front/right return; join the 48 px east stair to a continuous landing and tower doors.
   Remove competing shelf edges and scratch bands; derive rear-structure and foreground-parapet masks from the same drawing, with one contact shadow beneath the walk. (Owner 3; pixel 3; tech 3.)

8. **[piece] P0 — Distinguish entries, passages and scenery.** Give enterable bakery, apothecary, inn, tailor and scribe doors a roughly 24×6 lit step and 6×12 jamb lantern; shutter or panel blind openings.
   Keep 48×48 approach cells clear and show paving through courtyard arches; reserve the step-and-lantern pair for interior entry.
   Give the inn a 48 px-wide porch with an 8 px canopy, a legible 20×8 bed motif on its existing tankard sign, and a 24×16 bench outside both approaches. (Level 1 and suggestion 2.)

9. **[piece] P0 — Make trade signs physical objects.** Retain twice-R15 scale and immediately nameable bread, bottle, scissors and quill symbols; replace heavy badge borders with a single dark contour.
   Add a lit top rim, 2 px shaded right/bottom thickness, visible hooks and a short lot-contained wall shadow; use the building palette's cream and preserve trade-specific shapes/colours.
   Keep signs clear of doors/windows and compare at 1×; solve badge dominance through depth and contrast, not smaller unreadable symbols. (Pixel 4.)

10. **[piece] P0 — Repair curtain-wall joins.** Redraw scarred columns in the 96×144 curtain variants, starting at x192–288; align mortar courses and the outermost two pixel columns across every A/B/C pairing, including C→A.
    Remove internal tile-border outlines while retaining the exterior contour, top-left highlights and compatible tower/stair contacts; inspect a five-module 480×144 strip at 1×/3×. (Tech 2.)

11. **[piece] P0 — Standardize and quiet material clusters.** Remove about two-thirds of the north wall's bright diagonal scratches; group wear into sparse 2–4 px chips over broad stone faces with lower-contrast mortar.
    Use consistent roof tiles about 6–8 px wide with 3–4 px row spacing, foreshortened for each plane; redraw at native resolution instead of stretching caps.
    Match timber, plaster, brick and receiving margins across corners; keep texture quieter than openings and silhouettes, especially around the guildhall and slate houses. (Pixel 5; owner 4/5.)

12. **[piece] P0 — Integrate quiet paving and drainage.** Replace the square's repeated diagonal slab wedges with four 48×48 variants whose faces stay close in value; use two restrained cobble sizes.
    Continue 2–3 px kerbs and darker gutters along the 96 px route through dedicated 48 px corner/transition tiles; make the gate turn join the surrounding streets instead of reading as a pasted strip.
    Preserve clear walking widths and light-enough lanes under shade; keep thresholds, landmark edges and the main route stronger than ground texture. (Owner 5.)

13. **[layout] P0 — Replace shadow mats with structural shade.** Generate hard-edged southeast masks from actual stepped silhouettes, plus separate compact contact, eave and jetty strips; cap alpha at 50%.
    Start with roughly 12 px southward reach for stalls, 24 px for low houses and 48–72 px for tall stacks, eastward offset about half that, shortened wherever the owning lot requires it.
    Mask ground/wall/roof receivers separately, union overlaps without doubled darkness, and match owned strips at boundaries; retain street shadows without any overlay crossing its lot. (Owner 5; pixel suggestion 6.)

14. **[layout] P1 — Show continuous defensive circulation.** Connect the north stair near (1008,192) to visible tower doors using 48×24 wall-walk top-face modules and compatible shadows.
    Expose the bend of the 48 px inner wall lane around the towers near x816/1104; connect the gate platform and stair from item 7 without props or ground obstructions in that lane. (Historian suggestion 5.)

15. **[layout] P1 — Separate central wealth from peripheral housing.** Remove a storey from the tallest southwest/southeast thatched stacks so edge groups remain predominantly 1–2 occupied storeys; concentrate 3–5-storey merchants on the square/main route.
    Replace needle caps with modest pitched/lean-to roofs or 96 px hips on suitable lots, attach selected 48×48 rear sheds, and vary frontage/depth without breaking owned roof contacts. (Historian suggestion 6; owner suggestion 4.)

16. **[piece] P1 — Break repeated whole-building and wall rhythms.** Draw a second 96 px-wide slate corner-house arrangement with different dormer, bays and brick infill, plus one additional 96×144 curtain variant with different stone grouping and compatible edges.
    Vary ridge direction, frontage and extensions in assembly; enforce at most two identical pieces in every sliding five-piece run and prohibit immediately repeated three-piece wall sequences. Recolouring alone is insufficient. (Tech suggestion 5; owner/pixel variation suggestions.)

17. **[layout] P1 — Define the church precinct.** Reserve a 3×2-cell enclosure north of the church near x624–816/y672–768, with low stone boundary, packed earth, two grave slabs and a 24 px gate toward the market.
    Move carts to the market hall's service side; retain the square-facing porch from item 3 and the open fountain approach. (Historian suggestion 4.)

18. **[layout] P1 — Give retained courts distinct work.** Place a 48×48 laundry/rack in one northwest private court, a 24×24 woodpile next door, a 48×48 sorting table northeast and a 48×48 woodpile/handcart pocket southwest.
    Keep neighboring courts calm, place activities beside actual rear doors, and leave public lanes and court entrances clear; add these only after the block enclosure repairs. (Level suggestions 3/6.)

19. **[piece] P1 — Tie inhabitants to useful places.** Draw one 12×24 laundry worker, two differently posed 12×24 inn patrons, a guard beside the gate's east stair and a 48×24 delivery cart with handler near the craft frontage at (336,1008).
    Place patrons by the bench and workers by their equipment; preserve door cells, the 96 px gate road and 48 px wall lane, and do not reuse the identical blue customer pair. (Level suggestions 3/4.)

20. **[layout] P1 — Render acceptance proofs after repairs.** Produce the 16×12 L/T/dead-end block, irregular civic square, five-/one-storey join and self/variant seam sheets at 1×/3× beside R15 and current town; compare the house at 1×/4×.
    Add current whole-city 1× greyscale, footprint/clearance and lot-mask views, plus gate stair/portal and market entrance actor/reveal states using bottom-left anchors and north-first base-row ordering.
    Reject roof holes, seams, repeated silhouettes, unreadable doors/signs, lost actors or weak landmark/gate/main-street hierarchy; static art proofs do not establish runtime collision correctness. (All five.)

**Dropped or constrained recommendations:** `BRIEF-17.md` takes precedence over older panel waivers. The historian's 144 px-deep building footprints exceed its 1–2-cell lot depth: keep those roofs as projected art over compliant footprints and separate yard strips. Apply the same distinction to the owner's 96×144 inn return; neither rear wings nor shared ridges may erase property ownership.

The tech artist's 192×192 gate authoring canvas is acceptable as a context crop, not as a wider finished gatehouse. Keep the 3×4 gate allocation; integrate the useful chamber, bearings and landing repairs. Preserve the market hall's 4×3 allocation and the other landmark sizes and hierarchy.

Drop fixed signboard/glyph dimensions wherever they shrink the brief's twice-R15 signs or impair 1× identification; retain the pixel lead's contour, thickness and mounting changes. Reject shadow lengths or cross-lot unions that cross an owning lot edge; item 13 constrains them and preserves the 50% alpha ceiling.

Do not implement an indefinitely unchanged 96 px corridor: preserve its clearance while satisfying the brief's eight-cell street-variation rule through meaningful offsets/widened junctions. Drop the level review's suggestion to decorate courts before rebuilding the blocks: the activities survive in items 18–19, after the density blockers. Use tech's actor/surface sorting and reveal suggestions for composer proofs without replacing the required building layer order (ground, storeys, roof, overlays) or expanding this art task into runtime renderer/collision work.
