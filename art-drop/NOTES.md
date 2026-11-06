# Paddy farmhouse repair — critic-r3-3 / operator round 2

Replaced only `out/paddies-7.png`, `out/paddies@spring-7.png`,
`out/paddies@autumn-7.png` and `out/paddies@winter-7.png`.
**All 176 other output files are byte-identical** to this request's starting
snapshot, and the 180-file inventory is unchanged. Only these four PNGs and
this note were changed in the workspace. No commit or push.

The **16×13 px** house now has a broad sloping grey tiled roof, a narrow back
ridge, three tile courses, a darker right hip plane and lifted front eave tips
at both ends. A short pale plaster facade has timber posts and one off-centre
dark door, without windows. The architecture follows `out/wuxia-farmstead.png`
and `reference/wuxia-house.png`. Summer, spring and autumn use identical house
pixels; winter keeps the same silhouette and adds roof snow while exposing
lower tile courses and the curled eaves. The existing packed-earth courtyard,
water jar, six-pixel buffalo body and curved horns remain unchanged.

**Method:** four built-in image-tool district edits, using the current seamless
4×2 district on the 48 px grid at 8× working scale. The prompt set replaces only
the farmhouse and explicitly asks for a sloping roof, raised ridge, three tile
courses, lifted eaves, short plaster wall and one door; the seasonal prompts
preserve this geometry and add winter roof snow. Architecture crops were
AREA/BOX-aligned to 128×104, locked to an explicit material palette, then
reduced by the **mode of all 64 samples per 8×8 footprint**. Native hand cleanup
clarifies the ridge, roof courses, eave tips, posts and doorway. The summer
geometry is shared across partners; winter accumulation is traced from its
registered mode vote. Only local `(9,8)..(24,21)` was repainted, including removal
of the previous building's base. Every pixel outside that rectangle, including
the surrounding paddies, seasonal crops, bunds and yard objects, is unchanged.
The four cleaned 192×96 district assemblies retain the seven untouched cells.

**Review:** viewed each final saved PNG at exactly **8× nearest-neighbour** and
compared the quartet with the wuxia farmstead at the same scale. The sloping
roof, separate short wall/door and buffalo read clearly in the self-review.
Also viewed **three independent randomized, unguttered 8×2 layouts per season**
at 3× (twelve layouts). Seasonal house positions match and the unchanged bunds
join as before. Validation checks 48×48 size, full opacity, exact four-output
change scope, unchanged inventory, identical non-winter architecture, and
pixel-for-pixel preservation outside the house rectangle.

Sources, exact prompts, aligned crops, mode votes, native cleanup, 8× saved-file
views, comparison, twelve tiled layouts, random orders and validation are in
`/tmp/paddies-house-r3/`, outside the repository. This supersedes the previous
mask-like farmhouse repair; existing repository source paintings and review
boards are historical and were not rewritten. Rerunning earlier processing
scripts would overwrite this four-file repair. This is a visual self-review,
not a new independent critic verdict or an in-game check.

---

# Round 3 — operator paddy repair

Revised all **32 opaque 48×48 paddy tiles** in `out/`, preserving the eight
plot layouts across spring, summer, autumn and winter. **All 148 non-paddy
files are byte-identical** to the operator-review starting snapshot; the
180-file output inventory is unchanged. No commit or push.

Autumn now has warm yellow-gold rice-head clusters, darker brown bunds and
narrow wet channels. Variant 3's bottom-right quarter and variant 4's bottom
strip are pale harvested stubble, with respectively three and two larger
flared sheaf bundles and dark ties. Winter retains white snow with broken
pale blue-grey/neutral drift shading, readable brown stubble rows and dark
bund shadows. Its main snow colours `#ecf5fa`, `#f8fbf9` and `#d5e5f1` match
`out/farmland@winter-*.png` and the cool whites of
`reference/modern-grass@winter.png`. These pale shades are snow shadows;
there is no blue water/ice material. The previous all-neutral, nearly blank
winter treatment is superseded.

Every season shares a **16 px grey tiled farmhouse roof**, lifted ridge/eave
tips, short pale plaster wall, dark doorway, packed-earth courtyard and a
separate horned buffalo. The yard stays at local `(7,7)..(26,29)`, fully inside
the cell, and a two-pixel bund path reaches it from the west boundary.
All interior divisions have a lit top and dark shadow side, normally two
pixels wide; the two original raised footpaths remain three pixels. Each
cell edge has only a one-pixel half-bund, so joined tiles make a two-pixel
bund without an extra border or verge. Plot rectangles and path positions
are identical across seasons.

**Method:** two new full-bleed 4×2 district edits, retaining the 48 px grid
and existing layouts, followed by BOX/area alignment to 1536×768, fixed
material palettes and the **mode of all 64 samples in each 8×8 footprint**.
Spring/summer retain the existing district votes and crop artwork. Native
paintover repairs bunds, harvested plots, sheaf silhouettes, roof tiles,
plaster/door contrast, yard corners and buffalo anatomy. House/yard crops
are separately mode-voted before cleanup; no marker is resized into a paddy.
The cleaned 192×96 districts are literally cut into their eight cells.
Sources, aligned canvases, mode votes, cleaned districts and house stages:
`source-drawings/operator-paddies/`. Exact built-in tool prompts:
[operator-paddies-generation-prompts.json](operator-paddies-generation-prompts.json).
The earlier `r3` sources are preserved.

**Review:** visually checked three independent randomized, unguttered **8×2
orders per season at exactly 3×**: twelve images, saved in
`review/operator-paddies/tiled-*-shuffle*.png` and collected in the four
`board-*.png` files. Native review prompted removal of overlapping old sheaf
fragments, cleaner bundle ties, symmetric lifted eaves, softer yard corners
and clearer buffalo horns. The final boards were checked after these fixes.
Orders: [layout-orders.json](review/operator-paddies/layout-orders.json).

[Validation](review/operator-paddies/validation.json) checks the exact 32-file
change scope, all 148 protected hashes, unchanged inventory, unique opaque
48×48 outputs, 32 literal district crops, every internal bund trace, all 256
ordered variant seam pairs on both axes, and all 192 saved review cells.
Winter field interiors retain over 80% snow, over 8% drift shading and visible
stubble, with no water material. The report includes material fractions and
source/output hashes. Starting hashes:
[before-hashes.json](review/operator-paddies/before-hashes.json).

Rebuild the operator repair with:
`python art-drop/process_operator_paddies.py`.
This writes only the 32 paddies inside `out/`, plus source/review stages
outside it. Running the older `process_r3.py` would restore the superseded art.

**Limits:** eight layouts still repeat over a large map; buffalo horns and
sheaf ties are tiny at native size. This was a visual self-review of the
requested map-scale boards, not an independent critic pass or live-game check.

---

# Round 2 — critic-r2-7 plus owner rural override (r2-9 delivery)

Redrew **all 44 farmland/farmstead PNGs** in `out/`: seven field layouts and
four setting-specific farmsteads, each in summer, spring, autumn and winter.
The owner's rural override includes the critic's passed rural files. **All
104 other PNGs are byte-identical to this pass's starting workspace**:
24 markers, 16 city, 16 industry, 16 slums and 32 suburbs. Earlier uncommitted
work was preserved. No commit or push was made.

Two new continuous district paintings are retained in the gitignored
`source-drawings/r2-9/`: a summer district and its winter edit. The built-in
image tool was used; exact prompts are in
[r2-9-generation-prompts.json](r2-9-generation-prompts.json).
The 1448×1086 paintings are area/BOX-aligned to **1536×1152**, four by three
**384 px cells**. Palette locking precedes **8×8 mode voting**: every one of
64 source samples votes for each output pixel. Nearest-neighbour is used only
for review enlargement. Saved aligned, voted and cleaned districts make each
stage inspectable. Spring/autumn map materials on the cleaned summer geometry.

Native paintover removes noisy source detail, reinforces straight crop rows,
flattens roof planes, and gives the 15 px farmhouse roofs one-pixel outlines
and upper-left highlights. Short south facades have doors and windows; each
farm has a separate low shed, compact yard and connected lane. Orchards retain
angular trees in rows; the ploughed tile retains its short tree line.

Fields extend to the **one-pixel edge hedge with no grass strip**. Every
field boundary and lane is orthogonal to the tile edges. Internal hedges use
the same material, phase and two-pixel weight as two joined boundary halves.
Shared three-pixel access gates give every rural tile the same edge profile;
all farm lanes leave through the south gate. A neighbouring crop field may
start directly beyond a gate; these are farm-access openings, not a road
routing tileset.

The seven field plans now differ in their divisions, proportions and crop
directions. Critic-failed variant **6 has three unequal rectangular fields**,
a north–south lane offset to the right and an east-only branch. It no longer
repeats variant 0's broad horizontal division. Geometry is retained across all
four seasons. Winter fields are **white**, with dark exposed furrows, stubble,
hedges and trunks. White snow covers **75–84%** of field interiors, including
the orchard/tree-line tiles. Roof snow follows the summer roof geometry.

**Review:** inspected three independent random, unguttered **8×2** layouts
for every set/season, mixed farmsteads and each setting mixed with fields:
**102 layouts**, `review/r2-9-tiled-*.png`; three-shuffle boards and six overview
pages are alongside them. The first audit caught similar winter soil/crop
patterns; soil furrows and stubble were revised before the final review.
Orders: [review/r2-9-layout-orders.json](review/r2-9-layout-orders.json).
[Validation](review/r2-9-validation.json) passes the exact 44-file scope,
104 protected hashes, 148-file inventory, 48×48 opacity/uniqueness, 44 exact
district crops, **484 ordered rural edge pairings**, 22 spring/autumn material
mappings, all 16 connected farmstead lane exits and every review-layout crop.
Variant 0/6 pixel agreement is 38.7% in summer/spring/autumn and 72.1% in winter;
the visible geometry, rather than that number alone, was checked.
Sources/output hashes: [review/r2-9-source-audit.json](review/r2-9-source-audit.json).
Rebuild: `python art-drop/process_r2_9.py`, then `python art-drop/review_r2_9.py`.

**Remaining limits:** the thin boundary hedges still make a regular lattice
visible in some snowy shuffles, and seven field layouts repeat on a large map.
This is visual self-review, without a new independent critic verdict or a live
in-game check. Earlier delivery notes and review images describe earlier art.

---

# Round 2 — critic-r2-6 plus owner rural override (r2-8 delivery)

Replaced **60 PNGs in `out/` from this pass's starting workspace**: all 16
failed slum tiles and all 44 farmland/farmstead tiles, including rural files
the critic passed. All 32 critic failures are covered. **All other 88 PNGs are
byte-identical**: 24 markers, 16 city, 16 industry and 32 suburbs. Existing
uncommitted work was retained; no commit or push was made.

Three new paintings are retained in `source-drawings/r2-8/`: a continuous
summer slum district, a continuous summer rural district, and its winter edit.
The built-in image tool was used. Exact prompts are in
[r2-8-generation-prompts.json](r2-8-generation-prompts.json).
The returned 1774×887 slum and 1448×1086 rural canvases are BOX/area-aligned
to 1536×768 and 1536×1152 respectively: **384 px cells at 8× scale**.
Palette locking comes before reduction; **all 64 source samples vote** for
each final pixel. Nearest-neighbour sampling is only used for enlargement.

Slum paintover follows the new source's overlapping rectangular roof slabs,
with attached lean-tos, canvas, patches, straight corrugation and short south
walls. The first tiled check still showed broad gaps; native coordinate edits
narrowed the outer clearances and added connecting lean-tos and salvage stacks.
Buildings/clutter now occupy **68–75%** of each tile. The same dirt material
and wrapping texture are used inside and at the perimeter. Winter keeps the
exact summer footprint, with shaded snow and exposed roof material. Snow is
painted in roof order so that lower roofs cover earlier snow and walls.

Rural fields reach the one-pixel boundary hedge with **no grass margin**.
The seven plans have one or two large rectangular fields, two orchards, a
ploughed field with a tree line, and a straight east–west lane. Crop directions,
hedges and lane crossings are orthogonal to the edges. Source colour clusters
are simplified and reinforced with deliberate rows, furrows and stubble.
Winter is white with cool snow texture, exposed dark furrows and dark hedges.
Interior hedges use the same material and joined two-pixel weight as edges.

All four farmsteads have distinct source-traced 14–16 px roofs, visible south
faces, windows, a separate shed and compact yard. Door steps and barn approaches
join the yard. **Every farm lane continues through an actual hedge opening at
the bottom edge**, in every season; no closed hedge overwrites its endpoint.
Fields fill the rest of the tile. Spring/autumn preserve the cleaned summer
geometry; winter uses the same traced fields, buildings, yard and lane geometry.

**Review:** inspected three independently shuffled, unguttered **8×2** layouts
for every district/season, mixed farmsteads and each setting mixed with fields:
**102 layouts**, `review/r2-8-tiled-*.png`. Three-shuffle boards and six overview
pages are alongside them. Orders: [review/r2-8-layout-orders.json](review/r2-8-layout-orders.json).
[Validation](review/r2-8-validation.json) checks the exact 60-file scope,
88 protected hashes, 148-file inventory, 48×48 opacity/uniqueness, 60 exact
district crops, 128 ordered slum edge pairings, eight matching slum seasonal
footprints, all 16 farmstead lane exits, and every saved review crop.
Sources/output hashes: [review/r2-8-source-audit.json](review/r2-8-source-audit.json).
Rebuild: `python art-drop/process_r2_8.py`, then `python art-drop/review_r2_8.py`.

**Remaining limits:** the thin hedge lattice remains visible against winter
snow in some shuffles, and seven field plans/eight slum plans still repeat.
An arbitrary neighbour can close the far side of a farm gate with its own
hedge; lanes now reach their own tile edges but are not a road-routing tileset.
This is visual self-review, without a new verdict from the original critic or
a live in-game check. Earlier review images and delivery notes describe older art.

---

# Round 2 — critic-r2-5 plus owner rural override (r2-7 delivery)

The final `out/` contains **76 replacements since critic-r2-5**: 16 slums,
12 suburb seasonal files (layouts 2, 4 and 7), four failed industry winter
roofs, and **all 44 farmland/farmstead files**. The existing, uncommitted r2-6
redraws supplied the first 32 files; this continuation preserved those drawings,
corrected an edge collision in both slums-3 seasons, and newly redrew the 44
rural files. No commit or push was made.

**Protected:** all 24 markers, all 16 city files, all 12 passed industry files,
and all 20 passed suburb files are byte-identical to the saved critic baseline.
The owner's explicit rural override takes precedence over the critic's rural
passes. No other passed output was changed.

**Rural method:** two new continuous district paintings (summer and a dedicated
winter edit) are saved in `source-drawings/r2-7/`. Exact built-in image-tool
prompts: [r2-7-generation-prompts.json](r2-7-generation-prompts.json). The tool
returned 1536×1024 canvases; BOX/area alignment to **1536×1152** establishes a
4×3 atlas with exact **384 px cells**. Palette locking precedes reduction by
the mode of **all 64 samples in every 8×8 footprint**. Nearest-neighbour is used
only to enlarge review pictures, never to reduce a generation.

Native cleanup follows the painting's rectangular field plans and row
directions. Each farmland cell has one to three large fields. Crops and soil
extend to the one-pixel edge hedge: **there is no reserved grass margin**.
Internal hedges use the same foliage shades and the same two-pixel width as
joined edge halves. Field boundaries and lanes meet the edges at right angles;
no diagonal field runs off a cell. Both orchards and the ploughed-field tree
line remain. Native row clusters recover furrows/stubble lost during voting.
Winter has white/icy-blue field snow, visible dark furrows, dark hedges and
snow-capped orchards, rather than grey-green fields.

The four farmsteads sit within full-bleed fields, with a compact yard, separate
barn and lane. The source's oversized buildings were replaced by native
16-pixel farmhouse roof traces with flat planes, one-pixel contours, upper-left
light, windows and south faces. Thatch/timber, lifted blue-tile eaves, brick and
chimney, and pale siding distinguish the settings. All four seasons share each
cleaned field/building layout.

The retained r2-6 slums split the oversized roof slabs into small angular shacks,
with corrugation, staggered eaves and lean-tos. Roof snow has shaded accumulation
and exposed metal. Failed suburb layouts have upper and lower detached houses,
smaller garden features, connected drives and textured lawns, while preserving
the passed plans. The four industry repairs retain all building positions and
dark yards, adding shaded snow and exposed panel/rib breaks. Their sources and
prompts remain in `source-drawings/r2-6/` and
[r2-6-generation-prompts.json](r2-6-generation-prompts.json).

**Review:** visually inspected three independently shuffled, unguttered **8×2**
layouts for every set/season, mixed farmsteads and each setting mixed with
fields: **102 layouts**. See `review/r2-7-tiled-*.png`, their
`r2-7-board-*` collections, and six `r2-7-full-review-*` overview pages.
Orders: [review/r2-7-layout-orders.json](review/r2-7-layout-orders.json).
This check found a low shack wall reaching slums-3's bottom boundary; moving it
inward one pixel restored the shared alley in summer and winter.

[Validation](review/r2-7-validation.json) passes: exact 76-file scope since the
critic baseline, 72 protected PNGs unchanged, unchanged 148-file inventory,
48×48 opaque unique outputs, **1,124 ordered edge pairings**, **76 exact district
crops**, and every saved layout crop. Hashes are in
[review/r2-7-source-audit.json](review/r2-7-source-audit.json).
Rebuild the retained repairs with `python art-drop/process_r2_6.py`, rural art
with `python art-drop/process_r2_7.py`, and review with
`python art-drop/review_r2_7.py`.

**Remaining limits:** the thin continuous edge hedges still reveal a regular
lattice in some shuffles, especially against winter snow. Matching their width
and material to the internal hedges removes the grass frames but cannot hide
every repeated cell boundary. Seven field plans still repeat across a large
map, and tiny farmhouse details remain simplified. This was a visual self-review;
there is no new verdict from the original critic or live in-game confirmation.

---

# Round 2 — critic-r2-4 redraw (r2-5 delivery)

Redrew **117 PNGs** in `out/`: 16 city, 16 slums, 32 suburbs, 28 farmland,
16 farmsteads, the summer conveyor yard `industry-3`, and all eight winter
industry partners. All **24 markers** and summer **industry 0, 1, 2, 4, 5, 6, 7**
remain byte-identical to the start of this request. No commit or push was made.

**Scope conflict resolved:** `critic-r2-4.json` contains 124 failures and an empty
pass list. The operator explicitly required the seven summer industry tiles to
stay unchanged, so that instruction takes precedence over those JSON entries.
Their summer roof, tank, rail and machinery issues were therefore not redrawn.
Winter keeps their building geometry so the seasonal partners still match.

**Method:** seven new built-in image-tool paintings are retained under the
existing gitignored `source-drawings/r2-5/`: continuous city, slum, suburb and
rural districts, an industry conveyor-yard edit, and dedicated suburb/rural
winter edits. Exact prompts: [r2-5-generation-prompts.json](r2-5-generation-prompts.json).
The districts are BOX/area aligned to 384 px cells, palette locked, then reduced
by the mode of **all 64 pixels in each 8×8 footprint**. Source house crops use the
same voting method during inspection. Nearest neighbour is used only to enlarge
review pictures. Extensive coordinate-based native paintovers then trace the
painted layouts, flatten roof planes and add one-pixel dark contours, top-left
light, corrugation, trim and readable doors/windows. Final farmhouses are native
14–16 px architectural paintovers, rather than resized settlement markers.

City has smaller separated grey roofs, roof equipment, mixed heights and visible
south faces with windows. Winter keeps exactly the same dark asphalt and puts
snow on the saved roof surfaces. Slums use straight-edged corrugated slabs,
rectangular patches and attached lean-tos; their irregular packing was expanded
to narrow excessive gaps. Dirt uses the same wrapped material inside and at joins.

Suburbs now have eight different plans: five-house cul-de-sac, four-house crescent,
pond park with three houses, corner shop with three houses, school/playground with
two houses, allotments with four houses, T junction with six houses, and a large
park with two houses. Roofs are mostly 8–12 px, with the shop and school larger.
The source's continuous pale kerb and wide half-road were removed; joins are
four-pixel streets using the internal asphalt material. Plant/lawn texture extends
into the former kerb strip. All four seasons retain the same plans and buildings;
spring is brighter yellow-green, autumn golden, and winter ground accumulation
comes from the dedicated winter painting, clipped to the fixed material masks.

Rural fields retain the new painting's rectangular/trapezoid geometry, orchard
crowns, furrows and crop clusters. Tan midpoint lane stubs were removed. Joined
hedges have compatible one-pixel halves and no separate top-band material.
Winter uses voted snow clusters from its own district painting, with dark hedges,
tree lines, exposed soil, furrows and stubble retained. Yard slush is irregular;
paired ruts are confined to narrow lanes. Thatch/timber, lifted blue-tile eaves,
brick/chimney/trim and grey siding distinguish the four native farmhouses.
The conveyor repair separates rails, belt, hopper, trestles and two faceted piles.
Industry winter retains summer wall and cylinder shading, adds roof accumulation,
and has dirty snow/slush at building feet without repeated border snow badges.

**Tiled review:** three independently shuffled, unguttered **8×2** layouts for
all 34 groups (each district/season, mixed farmsteads, and each setting mixed with
fields): **102 layouts**. Orders are saved in
[review/r2-5-layout-orders.json](review/r2-5-layout-orders.json); images are
`review/r2-5-tiled-*.png`, with three-shuffle `r2-5-board-*` pictures and six
`r2-5-full-review-*` overview pages. These were visually checked. The review
prompted additional fixes to shack spacing, uniform wheat bars, leftover source
house fragments, winter yard stripes, and suburban kerb/street width.

Rebuild: `python art-drop/process_r2_5.py`, then `python art-drop/review_r2_5.py`.
[review/r2-5-validation.json](review/r2-5-validation.json) passes: exact 117-file
change scope, 24 unchanged markers, seven unchanged protected industry files,
unchanged output inventory, 48×48 opaque unique outputs, **1,124 ordered edge
pairings**, **124 literal district crops**, and every saved layout crop.
[review/r2-5-source-audit.json](review/r2-5-source-audit.json) records source/output
hashes; `review/r2-5-before-hashes.json` records the initial state for this request.

**Remaining limits:** the regular street/hedge lattice and repeated use of eight
plans are still visible at map scale, especially where identical variants touch.
Some small facade, farmstead and industrial fittings remain abstract at 48 px.
Continuous rural boundary hedges also make farm-lane exits less explicit than
interior yard connections. Pixel-edge compatibility passes; that does not prove
that every visual criticism is resolved. This is a visual self-review, with no
new verdict from the original harsh critic and no live in-game check.

---

# Round 2 — critic-r2-3 redraw

Replaced exactly the **117 failed PNGs** in `review/critic-r2-3.json`:
16 slums, 16 city, 32 suburbs, 28 farmland, 16 farmsteads and 9 industry
(summer conveyor yard 3 and all eight winter partners). The **seven passed
summer industry tiles and all 24 markers are byte-identical** to the initial
snapshot. No commit or push was made.

Six new source canvases are retained in the gitignored
`source-drawings/r2-4/`: four continuous districts (slums, city, suburb, rural),
an industry conveyor repair and its winter edit. Exact built-in image-tool
prompts are in [r2-4-generation-prompts.json](r2-4-generation-prompts.json).

The continuous paintings are AREA/BOX-aligned to **384 px cells**, then locked
to explicit material palettes. Each final pixel is the **mode of all 64 source
pixels in its 8×8 footprint**. Nearest-neighbour sampling is used only to
enlarge review images. Automatic palettes were rejected because they spent
colours on ground variation and lost important roof/outline shades.

Native paintover removes stray pixels, traces small shack roofs, splits oversized
roof masses, flattens roof planes and adds one-pixel contours and top-left light.
City blocks now have broad roofs, short facades and eight different footprints.
Suburbs have four to six houses in varied lots, 8–10 px roofs, different internal
street routes and the same four-pixel asphalt surface at internal roads and joins.
Roads have no extra enclosing verge band. Slum edge and internal alleys use the
same dirt and wear material, rather than separate perimeter colours.

Rural crop rows, furrows, stubble and orchards come from the district painting.
Joined half-hedges are two pixels wide, with the same foliage weight as internal
hedges. All field/farmstead edges share open midpoint gates. Farm lanes meet
those gates; farmhouse roofs are 14–16 px with shaded roof/side planes, thatch,
timber, brick or pale walls, and separate low sheds. Source-scale buildings were
fitted separately and then painted over at native scale, without shrinking the
fields or gardens around them.

Seasons use the same cleaned layouts and saved upward-surface masks. Winter has
shaded, irregular roof accumulation, exposed material, slush and paired wheel
ruts. Interior snow placement varies by block; edge slush wraps. City streets
remain charcoal. Industry winter retains summer wall/cylinder shading and puts
snow on caps, roofs and lips. The failed conveyor yard has separated belt rails,
supports, hopper and faceted coal/gravel piles. The seven passed summer cells
are copied into the source district unchanged and are never overwritten in `out/`.

**Review:** three independent random **8×2** orders for every district/season,
mixed farmsteads and each setting with fields: **102 unguttered layouts**, saved
as `review/r2-4-tiled-*.png`; `r2-4-board-*` collects each three-shuffle review.
Orders are in [review/r2-4-layout-orders.json](review/r2-4-layout-orders.json).
The review prompted further corrections to ragged roof contours, leftover house
fragments, border snow stamps, internal suburb streets and overly tall sheds.

Rebuild with `python art-drop/process_r2_4.py`, then
`python art-drop/review_r2_4.py`. The latter checks the exact 117-file change scope,
unchanged passes/markers/inventory, 48×48 opacity, unique outputs, 124 literal
district crops, 1,124 ordered edge pairings and every saved review-layout crop.
Results: [review/r2-4-validation.json](review/r2-4-validation.json).
Source/output hashes: [review/r2-4-source-audit.json](review/r2-4-source-audit.json).

**Remaining limits:** border-aligned streets/hedges still make the required
regular lattice visible, and eight layouts still repeat over a large map.
Some tiny industrial fittings remain abstract at 48 px. This is a visual
self-review, not a new pass from the original critic. Live in-game rendering
was not available in this art-only checkout. Earlier review images describe
the previous assets.
