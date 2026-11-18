# Cycle 6 — prioritized fixes

Merged from all five panel reviews against BRIEF-17. P0 resolves blocking findings; P1 follows after those repairs. Coordinates refer to the 1920×1440 final, from top-left.

Keep the 48 px grid, bottom-left anchors, fixed facade courses on rows 0/47, town-house 3/4 view, top-left light and single-pixel exposed outlines. Use crisp, angular pixel edges, no blur or smoothing; retain at most two wall colours and one roof colour per block. Draw architectural repairs; code assembles, masks and validates them.

1. **[layout] P0 — Enclose the property strips.** Replan the northwest, northeast and southern groups with 48/96 px-wide, 48/96 px-deep building footprints and separate 48–96 px rear strips.
   Connect side houses to roofed rear assemblies; continue party fences/walls to closed rear boundaries and attach selected 48×48 lean-tos. Keep rich frontages 3–5 storeys and poor edges 1–2.
   Retain one 24 px shared passage per two or three plots; distinguish enclosed working yards from public paving and preserve intentional courts, without frontage lawns. (Owner, historian.)

2. **[layout] P0 — Make the gate road continuous.** Reserve 96 px from the actual southern portal around x1200–1296, turning west through y1056–1152 into the square; keep a 96×96 turning pocket clear below the inn.
   Carry quiet large cobbles, 2 px kerbs and 4 px gutters through the turn and behind occluding gate art; remove competing pale patches. Use 48 px side streets and 24 px lanes, lighter than their cast shade.
   Keep 48 px clear inside tower projections; use actual frontage jogs within every 384 px run, including the northwest T-junction, and a bend and wedge-shaped block per district. (Owner, historian, level, pixel.)

3. **[piece] P0 — Approve a complete house with depth.** Build a 96 px merchant frontage from 96×48 modules, stone ground floor, continuous foundation and timber structure, and a 96/144 px-deep roof; compare beside `fantasy-house-2` at 1×/4×.
   Give exposed ends continuous 12–16 px shaded returns, sills with 2 px tops and 1–2 px undershadows, projecting eaves and a visible plinth top; remove triangular plaster bevels.
   Enlarge small windows about 25%, limit each colourway to two window types, and replace selected southern/northeastern slivers with coherent wider houses while retaining compatible course rows. (Owner, pixel, tech.)

4. **[piece] P0 — Close roof and height-change contacts.** Draw 48×96/48×144 valley and abutment pieces for the slate group x1056–1344 and southern comb x528–720; eliminate accidental paving wedges while preserving the northwest court.
   Give tall/short joins an 8–16 px masonry receiving face, one coping and continuous flashing; connect roof fills and shared eaves without transparent slits.
   Compose the receiving wall before the lower roof and flashing afterward, retaining bottom-left/base-row registration. (Tech, owner, pixel.)

5. **[layout] P0 — Restore the guildhall's civic dominance.** Bring its 192 px frontage to base y720, lower immediately flanking houses by one 48 px storey, and reserve a clear 48 px forecourt across the arcade.
   Make the occupied hall body read broadly within its prescribed 4×4 allocation; quiet neighbouring roof/window contrast so light stone, dark arcade and clock form one dominant mass in greyscale. (Historian, pixel, owner, level.)

6. **[piece] P0 — Turn civic entrances toward the square.** Integrate a visible 96×48 east-facing church entrance/steps assembly near (672,912)–(768,960) within the cathedral allocation; retain its offset position and enclosed churchyard.
   Redraw the 192×144 southern market hall so its square-facing arcade and supports are visible; use these frontages to enclose the irregular square, preserving at least 6×5 cells and its existing notch. (Owner.)

7. **[piece] P0 — Standardize usable thresholds.** In each 48×48 shop bay, draw a recessed opening, 24×8 lit landing and readable 6×10 lantern; start with inn, baker, apothecary, smith and cobbler. Shutter blind openings.
   Give passages distinct lintels and continuous paving to a visible rear exit; place the inn's 96 px porch over its lodging entrance and strengthen its bed pictogram to about 16×8.
   Keep entrance approaches clear; attach 48×48 trade displays beside key doors, outside walking lanes. (Level, owner.)

8. **[layout] P0 — Connect the northwest court visibly.** Link the court at x240–336, y432–480 to the southern passage near (312,696) with matching paving and an explicit rear opening.
   Show the person entering through that connection with roof/facade reveal states; relocate the apparently stranded figure near (338,516) onto the accessible route. Preserve this deliberate court when filling roof gaps. (Level, historian, tech.)

9. **[piece] P0 — Repair the curtain-wall joins.** Redraw the three 96×144 variants with identical course heights, parapet thickness and compatible first/last two columns; remove boxed internal borders at x192/480/672.
   Keep exposed outlines, reduce mortar contrast and incidental chips, and confine weathering within panels or explicit 8–16 px repair joints. Match tower/stair returns as well as A–B, B–C and C–A contacts. (Tech, owner, pixel.)

10. **[piece] P0 — Unify roof texture scale.** Use coherent tile clusters about 6–8 px wide and 3–4 px deep, foreshortened consistently through slopes, hips and endcaps; align courses across joins.
    Use three main material values, broad lit-left/shaded-right planes and no isolated dark flecks or abrupt brick-grid triangles; start beside the guildhall and on the southern roof run. (Pixel, owner.)

11. **[layout] P0 — Replace shadow mats with structural shadows.** Use one southeast projection direction, height-responsive hard silhouettes and tight contact shade under foundations, eaves, jetties, walls and landmarks; cap opacity at 50%.
    Match lot-contained strips at shared boundaries and continue wall-run shadows between genuine offsets; eliminate scallops, rounded tails and arbitrary right-edge resets without extending any overlay beyond its owning lot.
    Mask to ground/roof/wall receivers separately, avoid doubled darkness, and keep the main road legible through shade. (Pixel, tech, owner.)

12. **[piece] P0 — Remove the proven facade repeat.** Replace `floor-c-c5-w2` at (1104,480) with a 96×48 plaster bay: one 24×28 shuttered recess at local (36,8), restrained sill and unchanged connection courses.
    Keep the block's two wall colours; validate resolved asset identities across every five consecutive frontage houses, including different floors, cropped returns and side-lane interruptions, allowing at most two repeats. (Tech.)

13. **[piece] P0 — Vary architectural silhouettes.** Draw an alternate 96×192 side house with changed door/window arrangement and roof termination but the same landing/eave anchors; replace one house in each repeated northern pair.
    Give 96×144 tower tops roofed-watch, open-battlement and banner/bell treatments over compatible shafts; keep interval towers subordinate to the gate and civic skyline.
    Break the southern comb with one complete 48 px building stagger and a substantial side wall, retaining shared roof contacts; inspect whole-house rhythms at 1× as well as the two-in-five count. (Owner, tech, pixel.)

14. **[piece] P0 — Integrate signs with the improved shops.** Retain BRIEF-17's twice-R15 sign scale and named-at-1× trade symbols; reduce dominance through restrained contrast and mounting clear of thresholds/windows.
    Add a 1 px lit top rim, 2 px shaded right/bottom thickness and visible 8–12 px bracket to the scissors/quill and other flat badges; add no lettering or ornament noise. (Owner, pixel; size conflict resolved below.)

15. **[layout] P1 — Protect the market's working routes.** Keep six 48×48 stalls in two rows with a 48 px aisle, shifting them toward the guildhall if necessary to preserve a 96 px eastern through-route.
    Keep the 96×96 fountain and cross outside that route, clear the church/fountain approaches, and move market-hall stores into its bays or enclosed service yard. (Historian, owner, level.)

16. **[piece] P1 — Give the gate a believable working structure.** Rework a 96×48 bridging chamber with visible bearings into both towers within the prescribed 3×4 gatehouse allocation.
    Connect its tower door to the wall-walk with a supported 48 px landing clear of the road; retain the open portal and landmark silhouette. Do not shorten the towers or enlarge the footprint. (Historian, constrained to brief.)

17. **[layout] P1 — Make service yards belong to trades.** Attach a 48×48 covered fuel/tool store and drain-to-gutter to the western workshop at x240–336, y816–1008.
    Replace selected cobbles behind southern fences with packed-yard/mud-edge tiles and house-attached washing or woodpiles; retain the usable east-wall storage strip outside the clear wall passage. (Historian.)

18. **[layout] P1 — Give minor routes distinct destinations.** Add a 48×96 stone apron terminating at the northeast shrine near (1512,700), then a 48×48 well/pump in the northwest court after its access is resolved.
    Mount a hard-edged 24×48 smoke overlay at the existing western forge near (280,870), contained within its lot; keep these cues subordinate to the civic landmarks. (Level.)

19. **[piece] P1 — Replace repeated poses with activities.** Redraw the second row's three 48 px vendor cells as weighing goods, folding cloth and handing over a purchase; pair two shoppers at a counter.
    Add a 48×48 unloading cart and worker beside the inn's eastern end, outside the main corridor, entrance approaches and market aisle. (Level.)

20. **[layout] P1 — Produce acceptance proofs after the repairs.** Render the 16×12 L/T/dead-end block, irregular civic square, five-/one-storey contacts in both hands, and self/variant seam sheets at 1×/3× beside R15 and current town references.
    Add whole-city greyscale, footprint/clearance and lot-overlay checks; prove the gate with a 24×48 actor foot-anchored at (1248,1392)/(1248,1440), and the church east door near (720,1000), using separate overhead/foreground masks and feet-based sorting.
    Reject remaining holes, seams, repeated silhouettes, unreadable doors/signs, hidden actors or weak landmark/gate/main-road hierarchy; saved draw-order proofs do not establish runtime collision behaviour. (All five; tech's moving-actor check.)

**Dropped or constrained recommendations:** BRIEF-17 takes precedence over earlier panel waivers. The owner's 144 px-deep rear wings are rejected as ground footprints: buildings remain 1–2 cells deep, with separate rear strips; 144 px projected roof depth remains valid. The pixel lead's shared roof is replaced by the stagger option in item 13, keeping property ownership and roof contacts explicit.

The tech artist's unrestricted cross-lot shadow union and any height-based projection beyond lot edges are rejected because overlays must remain lot-contained. Item 11 retains continuous-looking joins through compatible owned strips, angular masks and receiver-aware compositing; it does not waive that boundary rule.

The owner's blanket 24×32 sign target is dropped where it reduces the required twice-R15 scale. Keep the useful bracket, thickness and entrance improvements instead. The historian's extra guildhall storey is not adopted as an enlargement of the specified 4×4 sprite, and shortening the gate towers by 48 px is dropped to preserve landmark dominance; items 5 and 16 strengthen occupied mass within the required allocations. No recommendation may remove fixed stacking courses, compulsory street variation, or the brief's landmark hierarchy.
