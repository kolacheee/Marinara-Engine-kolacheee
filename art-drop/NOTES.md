# Round 17 — Part C3: critic-r17C3-1 redraw

Replaced the three failed hip exports with **96×144 caps**, plus a separate
**96×48 directional fill** used on the deeper northeast property. The dormer
now sits wholly on the lit slope; baked accents receive the same plane checks
as composer overlays. **Five large built-in image-tool drawings on magenta**:
two hip alternatives, two gate-road alternatives and a square entrance.
Selected hip A and road B. Same method: painted registration → 8× BOX → fixed
palette → exact 64-sample RGBA mode → one-pixel cleanup, hard alpha and zero
hidden RGB. The road's native painted stone period is composited through the
drawn elbow and entrance outlines at one shared phase; no shapes or noise
were constructed. [Prompts and selections](review/r17-C3-critic1-generation.json).

Moved the western court back, lowered its street wing and joined full-width
road reaches to remove the **48px pinch**. Every main-street segment is now
audited at **96px or wider**. All **seven staggered property/roof joins** receive
world-positioned coping/flashing, bare masonry or exposed step returns.
Ridge heights vary visibly; fenced service recesses explain the setbacks.
Retained the gate-road inn/stable, bent streets, alleys, irregular blocks,
uneven towers, ditch, populated square and Part E repetition repairs.
Documented overhead church/stable projections have footprint and player
reveal proofs. [Focused review](review/r17-C3-critic1-west-width-3x.png),
[critic response](review/r17-C3-critic1-response.json).

Regenerated every requested final render and C3 review sheet.
**338 checks pass** (262 scene/regression + 76 redraw checks), including
**12,533,760 new mode samples**, all public approaches, exact output scales,
and resolved-piece repetition. **42 buildings:** 1 storey **3**, 2 **13**,
3 **15**, 4 **9**, 5 **2**; single-storey share **7.14%**. The **29 passing PNGs**
and **2,404 protected production files** remain byte-identical. Only the three
failed production PNGs and composer changed; six necessary connector/fill
PNGs were added. No seasonal partners apply. [Final 1×](review/r17-city-final.png),
[review index](review/r17-C3-review.html),
[redraw verification](review/r17-C3-critic1-verification.json).

BRIEF-17 retains precedence over the panels' smaller signs and optional
jogs; the coordinator's 40×30 native cells retain precedence over the earlier
approximate canvas size. Saved-art verification only; the original independent
critic JSON is preserved and no new independent approval is claimed.
Replay: `python -B art-drop/review/r17-C3-critic1-process.py`,
`python -B art-drop/out/city17/compose.py --part C3`, then the
`r17-C3-review.py`, `r17-C3-critic1-review.py`, `r17-C3-verify.py` and
`r17-C3-critic1-verify.py` scripts in `art-drop/review/`.
All authored changes are inside `art-drop/`; no branch change, commit or push.

# Round 17 — Part C3

Rebuilt the **40×30-cell walled district** around actual changes to the street
plan: a stepped western trapezoid, an eastern trapezoid split by a through
alley, a southern L, bent market streets, narrow passages, an additional
square exit, courtyard setbacks and mixed building heights. The inn now
faces the **gate road**, with a **192px joined frontage**, a guest entrance,
**96×144 paved court**, a new stable and a clear **48px court path**. North
wall tower gaps are **7 / 9 / 6 / 9 / 7 cells**; the northwest corner has a
paired bastion and a drawn defensive ditch runs outside the northern wall.
The long narrow roof beside the guildhall is gone; a low clerk annex and
an enclosed paved service yard replace it. The northeast slab ends in a hip.

[Final city at 1×](review/r17-city-final.png),
[exact 2×](review/r17-city-final-2x.png),
[three-way comparison](review/r17-city-final-vs-r15-vs-today.png),
[native greyscale](review/r17-city-final-squint.png),
[review index](review/r17-C3-review.html).
The final canvas is **1920×1440**, with **3840×2880** at 2×. The coordinator's
40×30 cells at the established 48px scale override the earlier approximate
1200×900 request. Today and Round15 remain literal 1× in the comparison.
Required **3× square, street and gate crops** use nearest-neighbour only.

**Drawing method:** **17 large built-in image-tool drawings on solid
magenta**, selecting **14 paintings**. Cobble field, deep hip and feathered
gate paving each received two candidates; B was retained in all three.
Painted bounds/row registration → **8× BOX working canvas** → fixed approved
material palettes without dithering → exact RGBA mode of **all 64 samples
per native pixel**, including transparency and lexicographic ties → isolated
colour/alpha and one-pixel silhouette cleanup. Ground receives colour-fleck
cleanup without an artificial outline. The selected deep hip carries its
painted ridge cap, connected moss cluster and repair patch. Native existing
chimneys and dormers are composited onto compatible receiving planes.
**8,208 native edits** across the candidate drawings are recorded, including
course transfers and edge wrapping. All exports have **hard 0/255 alpha**,
**zero RGB under transparency**, **6–36 opaque colours** and no detached
one/two-pixel alpha islands. No seasonal partners were requested.
[Prompts, sources and selection](review/r17-C3-generation.json),
[processing record](review/r17-C3-processing.json).

**23 new native PNGs**, all in `out/city17/`:

- Five **96×48** shopfronts: `ground-{baker,smith,apothecary,cloth,potter}-c3-w2`.
  Distinct left/right/central door arrangements, awnings, broad goods and
  lit steps; the established drawing supplies stack rows **0/47**.
- `roof-hip-deep-c3-w2` **96×192**, with chimney and dormer partners;
  `roof-hip-short-chimney-c3-w2` **96×144**;
  `roof-ridge-dormer-c3-w2` and `roof-back-chimney-c3-w2` **96×96**;
  `roof-back-dormer-c3-w1` **48×96**. One roof hue per property and rear wing;
  ridge direction and height change between neighbours.
- `cobble-c3` and `gate-paving-c3`, both **96×96**;
  `street-main-c3` **96×48**, `street-side-c3` **48×48**, `lane-c3` **24×48**;
  `street-edge-c3` **96×24**, `puddle-c3` **48×24**, `ditch-c3` **192×96**.
  Square and streets share a world-registered stone phase. Drawn gate-edge
  alpha interlocks with that field; only its edge mask turns at the elbow,
  preserving stone lighting. Existing native kerb/gutter strips remain.
- `lamp-c3` **24×64**, `planter-tree-c3` **48×72**, `stable-c3` **96×144**.
  Existing drawn barrels, crates, carts and supported laundry serve the
  market and rear courts. The inn's second frontage is a guest entrance.

Code registers, reduces, palette-locks, cleans, wraps, crops and composites
paintings. It constructs no replacement architecture, objects, stones,
noise or shadow silhouettes. Marks on anchor/access sheets are review
annotations only. [Export inventory](review/r17-C3-files.json).

**Layout and QC:** the final scene contains **43 residential/trade/rear
buildings**, plus the retained civic and defensive landmarks, **40 townsfolk**,
six stalls in staggered triplets, the market hall, fountain and cross. The
square retains its **10×8-cell extent and 2×2 notch**, church west and guildhall
north. Grass remains confined to the fenced churchyard and rear court;
other courts are paved. Heights in the eastern block are **4 / 2 / 3 / 5 / 3 / 4**,
with adjacent steps of one or two storeys and the existing firewall rule.

| Storeys | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|
| Buildings | 4 | 12 | 16 | 9 | 2 |

Single-storey buildings are **9.30%**. **223 checks pass**, replaying
**8,798,208 mode samples**, checking **43 standing/public approaches**, the
**96px gate route**, **48px service/court/through routes**, closed building
masses, every sign's lot bounds, every building's drawn cast shade and exact
output scales. No final-scene actor is completely hidden. The guild spire
projects **16px** over the north service lane in screen space; its ground
supports stay clear. The normal/reveal pair explicitly separates that
painted overhang from the walkable ground. Gate walkers are visible in the
open portal. [Verification](review/r17-C3-verification.json),
[anchors](review/r17-C3-city-anchors-1x.png),
[north-lane reveal](review/r17-C3-north-service-reveal-3x.png).

The repetition checker compares **resolved RGBA hashes and dimensions** on
both actual base rows and frontage groups along bent streets: **149 city
window/layer checks**, **300 including retained studies**, all pass. Both
original Part E failures still fail when deliberately restored: the third
identical northern rear cap and the eight forced trade fronts. Their current
selections, mounted signs and approaches pass. **2,384 earlier production
files are byte-identical**; only the named compositor changed among them.

Saved every new export at **1×/nearest-neighbour 4×**, self/unlike seams,
**literal 3×3 repeats at 1×/4× for all nine reviewed ground/overlay families**,
complete house/reference and separately lit return studies, the retained
seven-cell roof-volume proof, populated scenes at **1×/3×**, greyscale views,
footprints/entrances/overhangs/supports and normal/reveal states. Required
L-block, irregular market and tall/low regression scenes were replayed into
C3 review files; earlier review files remain unchanged.

[Every FIXES.md and panel-2 item](review/r17-C3-panel-response.json),
[saved-art critic](review/critic-r17C3-1.json). **Brief precedence:** retain
BRIEF-17's large signs, fixed attachment courses, required jogs/wedges,
48px grid and shadows despite conflicting panel reductions/deferrals.
Existing blank sign bays preserve doors/windows. No runtime routing/fading,
new character sizes or broad district catalogue were added. This is saved-art
self-review; no new independent panel score or engine playtest is claimed.

Replay with `python -B`: `review/r17-C3-process.py`,
`out/city17/compose.py --part C3`, `review/r17-C3-review.py`, then
`review/r17-C3-verify.py` (paths relative to `art-drop/`). Authored edits remain
inside `art-drop/`. Branch `art/overworld-codex-2026-11-06` is unchanged;
no commit or push.

# Round 17 — Part R

Finished the **40×30-cell dense walled district**, using the coordinator's
48px grid: **1920×1440 at 1×**, **3840×2880 at 2×**. It has **86 buildings**,
joined frontages and rear rows, a **10×8-cell square with a 2×2 notch**,
cathedral west, guildhall north, six stalls in staggered triplets, the low
market hall, fountain, cross, unloading cart and **39 existing townsfolk**.
The gate's **96px route** turns into the square; side streets are **48px**,
the court lane **24px**. Only the fenced churchyard and inhabited rear court
receive grass. The churchyard retains a bench pocket, resident and tub tree.

[Final city](review/r17-city-final.png), [exact 2×](review/r17-city-final-2x.png),
[three-way comparison](review/r17-city-final-vs-r15-vs-today.png),
[review index](review/r17-R-review.html). The comparison places today's
**600×500** town, the **1200×912 Round15 mockup**, and the final district
beside each other without resampling. Today's screenshot has 24px displayed
cells; both city mockups use native 48px cells, explicitly labelled.

**Drawing method:** **nine large built-in image-tool drawings on solid
magenta**, selecting five paintings. Rear roof received three alternatives;
stair/landing and north–south wall received two each. Retained the quieter
repair-only roof C, supported stair B and wall B. Two separately drawn upper
floors reserve blank left/right sign bays and retain recessed windows.
Painted bounds/row registration → **8× BOX working canvas** → fixed approved
palette without dithering → exact RGBA mode of **all 64 samples per native
pixel**, including transparency, with lexicographic ties → one-pixel dark
outline and isolated-pixel cleanup. **3,403 recorded native edits** across
the five selected drawings include the retained contact-strip transfers.
All exports use **6–32 opaque colours**, **hard 0/255 alpha**, **zero RGB under
transparency**, and no detached one/two-pixel alpha islands.
[Prompts and selections](review/r17-R-generation.json),
[processing](review/r17-R-processing.json), [file inventory](review/r17-R-files.json).

**Nineteen native PNG exports** in `out/city17/`:

- `roof-back-repair-w1` **48×96**; `roof-back-dormer-w2` **96×96**, assembled
  from the approved rear cap and native drawn dormer. The repair cap retains
  the original 12 ridge rows and four eave rows to meet its neighbours.
- `court-stair` **48×96**, a complete stair, supported landing and warm
  upper shutter; `wall-side` **48×144**, repeating the drawing's central
  48px merlon period along the north–south perimeter.
- `storey-sign-bay-left/right-w2`, each **96×48**, plus both warm-grey `-c1`
  partners. They retain the fixed rows 0/47. Signs mount higher over the
  blank bay, leaving the recessed window, door and shop goods visible.
- Grey-brown `-r` partners for cathedral **240×432**, guildhall **192×400**,
  gatehouse **144×400**, tower **96×240**, wall-walk **96×144**, wall stair
  **192×144**, fountain **96×96**, cross **48×96**, shrine **48×48**, plus
  the **96×144** alternate wall crop. Palette changes preserve alpha and
  native geometry; roof, window and timber drawings remain intact.
- `bench-pocket` **48×48**, extracted from the existing fantasy pack and
  palette-locked at native size, with unchanged alpha. Existing Round15
  **20×34** townsfolk, and A–E architectural/market/life drawings, are reused
  without resizing. No new character sizes or district catalogue.

Code only registers, reduces, palette-locks, cleans, crops, repeats and
composites drawings. No architecture, props, textures, noise or replacement
shapes were constructed in code. Review labels, footprint outlines and
explicit foreground cutaway masks are presentation/proof only.

**Composer repairs:** removed Part E's unconditional shopfront override;
both trade rows select four distinct complete fronts, with mounts on the
side opposite their doors. The L-block's third repeated narrow rear cap is
replaced by the new repair cap. The inherited rich-district study now keeps
a coherent upper family per house instead of cycling the same three pieces
through every house. The checker compares **resolved RGBA pixel hashes and
dimensions**, including aliases and pieces used at different floor levels.
It checks actual five-lot runs, not variant labels. Restoring either original
E4 failure makes the checker fail. No earlier production PNG was overwritten.

**Measurements and QC:** all **223 checks pass**, including replay of
**2,949,120 mode samples**, **401 resolved-piece window/layer checks** across
the final city, three required blocks and five inherited district studies,
**43 clear standing/public approaches**, six closed-block coverage regions,
the square's unobstructed 96px route, exact nearest-neighbour scaling and
**2,333 unchanged earlier production files**. The city has this storey count:

| Storeys | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|
| All buildings, including rear rows | 1 | 52 | 25 | 6 | 2 |
| Front-facing buildings | 1 | 6 | 24 | 6 | 1 |

The remaining five-storey building is the side-facing square return.
Single-storey buildings are **1.16%** of all buildings. Taller frontages
frame the square/main streets; low work buildings remain at the wall/court.
Party walls use the height-test coping/flashing rule. Existing drawn shadow
paint falls down/right with height-responsive reach, tight contact strips
and civic silhouette masks, keeping receiving paving visible.

Saved **every new export at 1×/nearest-neighbour 4×**, self/unlike seams,
**literal 3×3 repeats at 1×/4× for all six used ground/overlay families**,
required scenes and comparisons at **1×/3×**, complete corner-house and
seven-cell roof studies, and native greyscale navigation checks. Props use
summer paving/grass; there are no seasonal partners in R. The anchor sheet
separates footprints, bases, entrances, overhead spans and supports. Normal
and reveal states show an actor behind a roof, under an arch, behind a
canopy and under the gate chamber, with supports retained.
[Verification](review/r17-R-verification.json),
[panel response](review/r17-R-panel-response.json),
[critic](review/critic-r17R-1.json), [anchors](review/r17-R-city-anchors-1x.png).

**Brief precedence:** kept twice-Round15 **64×72 signs** over panel2's smaller
assembly request; new blank mounting bays address architectural obstruction.
Kept fixed stack courses, 1/2-cell live lots, street jogs and required shadows.
The three-cell hip appears only in the requested seam study. The coordinator's
40×30 cells override the earlier approximate 1200×900 size. Panel2's deferral
of runtime routing/fading and magical court expansion is respected.

This is saved-art self-review, not independent acceptance or an in-engine
playtest. All authored edits stay inside `art-drop/`. Branch
`art/overworld-codex-2026-11-06` is unchanged; no commit or push.

Replay with `python -B`: `review/r17-R-process.py`,
`out/city17/compose.py --part R`, `review/r17-R-review.py`, then
`review/r17-R-verify.py` (paths relative to `art-drop/`).

# Round 17 — Part E: critic-r17E-3 redraw

Repaired the sole failed file, `out/city17/compose.py`. The retained gate
interior now repeats from its own **(984,192)** origin; the threshold is
placed once at **(984,423)**. Both render after generic street kerbs, retaining
the drawn outer kerbs at **x984–987 / x1076–1079** and removing the stray
**x1052–1059** stripe. Vertical paving registration matches Part D.
All **78 passing E PNGs** and both Part D gate crops remain byte-identical;
no redraw, resampling or new paint was needed. Their established large
magenta drawing → registration → palette/mode sampling → hard-alpha cleanup
method remains unchanged.

Regenerated the required scenes at **1×/3× beside both references**, native
greyscale squints, every piece's **1×/4×** house comparison, self/unlike seams
and focused proofs. Inspected all 17 piece pages and the portal-to-approach
join at 1×/4×. **780 general + 149 retained-regression + 25 gate checks pass**:
76 entrance approaches clear, all eight signs mounted, all 66 street segments
shaded. The gate test detects the original failure and verifies exact source
pixels across both outer kerbs and the former stripe; all other scene ground
and **2,335 protected production files/gate crops** remain unchanged.
[Gate comparison](review/r17-E-critic3-gate-comparison-1x.png),
[focused audit](review/r17-E-critic3-verification.json),
[response](review/r17-E-critic3-response.json), [review index](review/r17-E-review.html).

No Round15 production proxies; existing Round17 A/B/C/D/E and retained D
crops supply the scenes. BRIEF-17 wins over panel 1's conflicting deferrals,
layout and shadow proposals; panel 2 is absent. Saved-art self-review only.
All edits stay inside `art-drop/`; no commit, push or branch change.

Replay with `python -B`: `out/city17/compose.py`, then
`review/r17-E-critic3-review.py`, `review/r17-E-verify.py`,
`review/r17-E-critic2-verify.py` and `review/r17-E-critic3-verify.py`
(paths relative to `art-drop/`).

# Round 17 — Part E: critic-r17E-2 redraw

Repaired `cobble-small`, `street-side`, `lane` and `city17/compose.py`;
the **75 passing E PNGs remain byte-identical**. Drew two large built-in
image-tool cobble variants on solid magenta and selected A. Same method:
**8× BOX registration → fixed six-colour palette → exact 64-sample mode →
edge-paint wrap and one-pixel cleanup inspection**, hard 0/255 alpha and
zero hidden RGB. No cleanup edits were needed; no shapes or noise were
constructed in code. Retained both street kerb/gutter strips exactly.
The small field's top/bottom eight-row luminance difference is now **0.67**
(previously **8.31**); all six eight-row bands span only **1.64** levels.
[Prompts/sources](review/r17-E-critic2-generation.json),
[processing](review/r17-E-critic2-processing.json).

Gardens now render beneath roads. The poor lane retains all **2,592 paved
interior pixels**. Each district's northern court frontage is one storey
lower and ends 48px earlier, leaving a visible **96×48 paved court** for
its door/porch and arch, connected to the eastern side lane. All **76 declared
48×48 entrance approaches** are checked against final opaque building and
prop masks; restoring the old placement correctly fails all five cases.
All **66 street segments** retain cast shade and all eight sign mounts stay clear.

Regenerated the required scenes/comparisons at 1×/3×, native squints, all
78 piece comparisons at 1×/4×, self/unlike seams, literal repeats and focused
lane/court/junction proofs. Inspected all 17 packed piece sheets beside
`fantasy-house-2`. **780 general + 149 focused checks pass**, including
**294,912 new mode samples** and preservation of **2,330 other production files**.
[Review index](review/r17-E-review.html),
[critic response](review/r17-E-critic2-response.json),
[focused audit](review/r17-E-critic2-verification.json).

No Round15 production proxies: existing Round17 A/B/C/D/E drawings and D's
retained gate-approach crops provide the context. BRIEF-17 wins over panel 1's
deferrals and conflicting layout/shadow proposals; panel 2 is absent.
Saved-art self-review, not independent acceptance or an in-engine playtest.
All edits are inside `art-drop/`; no commit, push or branch change.

Replay: `python -B art-drop/review/r17-E-critic2-process.py --install`,
`python -B art-drop/out/city17/compose.py`, then `python -B` on
`art-drop/review/r17-E-verify.py` and `art-drop/review/r17-E-critic2-verify.py`.

# Round 17 — Part E: critic-r17E-1 redraw

Repaired all **18 failed PNGs and `city17/compose.py`**. The **60 passing E
PNGs remain byte-identical**. Drew **12 large built-in image-tool variants on
solid magenta**, selecting six: whole-field large/small cobbles, low mud,
separate candles, a boarded repair shutter and a readable tankard plaque.
Used **8× BOX registration → fixed palette → exact 64-sample mode → one-pixel
cleanup**, hard 0/255 alpha and zero hidden RGB. Retained drawn street kerbs;
registered the shutter separately into five recesses and the tankard into all
five inn aliases. No replacement shapes or noise were constructed in code.
[Prompts/sources](review/r17-E-critic1-generation.json),
[processing](review/r17-E-critic1-processing.json).

Composer repairs open full kerbs, align junction paint without rotating
cobbles, preserve all eight mounted trade entrances, clear the washing,
complete fenced market rear strips and district returns, and distinguish
the gate route in greyscale. **All 66 street segments receive cast shade**;
all required routes are clear and washing occlusion is zero. Regenerated
`r17-E-*.png` review sheets: required scenes at 1×/3× beside both references,
native squints, every export at 1×/4× beside `fantasy-house-2`, and self/unlike
seams and literal repeats. **780 general + 133 redraw checks pass**, including
**1,189,696 new mode samples** and unchanged earlier protected files.
[Review index](review/r17-E-review.html),
[per-failure response](review/r17-E-critic1-response.json),
[redraw audit](review/r17-E-critic1-verification.json).

BRIEF-17 overrides panel 1's deferrals, relaxed shadow rule and conflicting
size/layout proposals; panel 2 is absent. No Round15 production proxies.
This is saved-art self-review, not independent or in-engine approval.
All edits stay in `art-drop/`; no commit, push or branch change. The checkout
was already detached at `35c06009d5` and was left there.

Replay: `python -B art-drop/review/r17-E-critic1-process.py --install`,
`python -B art-drop/out/city17/compose.py`, then both
`art-drop/review/r17-E-verify.py` and `r17-E-critic1-verify.py` with `python -B`.

# Round 17 — Part E

Made **78 native PNG exports (72 distinct pixel files)** in **`out/city17/`**:
streets and paving, eight trades, a new two-cell inn, five district palettes
with three architectural arrangements each, and life props/overlays.
Extended **`out/city17/compose.py`** to use them in the required critics and
five separate district studies. **14,823 protected earlier files are unchanged**;
this includes the earlier junction and all A/B/C/D production pieces outside
the explicitly replaced E streets, signs and two-cell inn.

**Method:** **35 large built-in image-tool drawings on solid magenta**,
selecting **30 source paintings**. Main street received three attempts;
side street, inn and washing line received two; the poor roofs use three
separate thatch drawings. Two wrong-subject street generations were rejected.
Exact prompts, original sources and selections are in
[generation](review/r17-E-generation.json).

Painted bounds/course registration → **8× BOX registration** → fixed palette
without dithering → exact RGBA mode of **all 64 samples per 8×8 footprint**,
with lexicographic ties → isolated-colour/alpha-island and one-pixel outline
cleanup. Final files have **3–35 opaque colours**, **hard 0/255 alpha** and
**zero RGB under transparency**. Code registers, reduces, cleans, recolours,
wraps and composites existing paint; it does not draw replacement geometry
or procedural texture. Road mortar comes from registered source bands;
kerbs/gutters are strips of the street paintings. District wall palettes
recolour approved A drawings, retaining their silhouette and fixed courses;
roof variants reuse B drawings except for the new poor thatch. Review labels
and neutral mounts are presentation only.
[Processing](review/r17-E-processing.json), [files](review/r17-E-files.json),
[districts](review/r17-E-districts.json), [replay](review/r17-E-process.py).

**Files and measurements:**

- `street-main` **96×48**, `street-side` **48×48**, `lane` **24×48** with
  kerbs/gutters of 4/4/3px; `cobble-large` and `cobble-small` **48×48** use
  **12×6  / 6×4px cobbles** and **24×12  / 12×8px repeat periods**.
  `mud-edge` is a **48×48** transparent overlay with a 24px horizontal period.
- Eight `sign-*` files are **64×72**: twice the maximum Round15 sign canvas
  (**32×36**). The last size check caught undersized initial registrations;
  final signs were reduced again from the original large paintings, not
  enlarged native sprites. Symbols are anvil, loaf, bottle, boot, tankard,
  quill, scissors and cleaver, with distinct shapes/colours.
- `inn-front`, `inn-front-w2` and `inn-front-w2-c0..2` are **96×48**.
  The wide porch, tankard and courtyard arch retain the A rows 0/47 contract.
- **45 district architecture exports**: market, temple, craft, rich and poor,
  each with three ground/storey/roof arrangements. Facades **96×48**;
  roofs **96×96 or 96×144**. Each district uses one roof colour family and at
  most two wall colours. Rich studies use 3–5 floors; poor studies use 1–2.
- District props: scales/candles **32×32**, drying rack/shed **48×48**,
  banner **24×48**, patched shutter **24×24**. Life: washing **96×32**,
  barrel **24×28**, crate **24×24**, cart **48×48**, chimney/forge smoke
  **24×48 /32×48**, cat **20×20**, pigeon **16×16**.

**Composition and QC:** rebuilt the **768×576 (16×12-cell) L-block** with T,
bend and dead end; the **1248×1968 irregular market** with cathedral,
facing guildhall, cross, six stalls and clear gate/service routes; the
**768×864 5|1 and 1|5 test**; and five **768×864 district studies**. Native
one/two-cell fronts, bottom-left/base-row ordering, owned overlays, stepped
wedge/setbacks and height-responsive B shadows remain explicit. The final
height test also replaces inherited three-cell fronts with two-cell fronts.
The market retains approved D civic/wall placement and its 48/96px routes.
No Round15 production proxies are used; Round15 is comparison-only.

Saved **1×/3× scenes beside both Round15/current-town references**, **1×
greyscale squints**, all **78 individual 1×/4× house comparisons**, **17 packed
inspection pages**, **294 self/unlike seam sheets**, and **12 literal 3×3
repeat proofs** (six ground/overlay files at 1×/4×). Props are mounted on
summer paving/grass; no seasonal partners are assigned to E.
**722/722 checks pass**, including replay of **7,095,296 mode samples**,
zero obstructed route pixels, zero required-roof holes, sign dimensions,
three distinct ground/roof variants per district, hard alpha, hidden RGB,
no detached one/two-pixel islands, exact nearest-neighbour scaling and
protected-file hashes. Every street family receives cast shadow; even the
24px poor lane has 112 measured shadow pixels.
[Review index](review/r17-E-review.html), [audit](review/r17-E-verification.json),
[critic findings](review/r17-E-critic.json).
This is saved-art self-review, not independent or in-engine approval.

BRIEF-17 and the explicit Part E request win over panel 1's reassignment of
signs/streets/life and deferral of the district/animal catalogue. Required
bends, stepped wedges, 24px lanes and shadows remain; one/two-cell fronts
win over the panel's merged three-cell option. Existing D keeps BRIEF-17's
three-cell gate. Panel 2 is absent. No commit, push or branch change; the
checkout was already detached. All project edits stay inside `art-drop/`.

Replay: `python -B art-drop/review/r17-E-process.py`,
`python -B art-drop/review/r17-E-install.py`,
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-E-verify.py`.

# Round 17 — Part D: critic-r17D-2 redraw

Repaired **wall-walk, wall-walk-stair and compose.py**. Both wall surfaces
now share one drawn walkway, parapet, coping, shadow and masonry; their
**4px overlap is identical paint**. The accepted stair treads, cheek and gate
landing remain byte-identical. The gate approach repeats compatible slate
interior with side kerbs, and places its transverse threshold **once**.
All **14 passing D PNGs** and earlier-part art remain unchanged.

Made **two built-in image-tool variants on magenta**, selected A, then used
**8× BOX registration → fixed palette → exact 64-sample mode → one-pixel
cleanup**, hard 0/255 alpha and zero hidden RGB. Code only registers, reduces,
cleans, extracts, wraps and composites drawn paint.
[Prompts/sources](review/r17-D-critic2-generation.json),
[processing](review/r17-D-critic2-processing.json),
[critic response](review/r17-D-critic2-response.json).

Rebuilt the four critic scenes, **1×/3× reference comparisons**, greyscale
squints, all 16 **1×/4× house comparisons**, self seams, unlike contacts at
**1×/4×/8×**, and literal 3×3 gate-paving repeats. **148 checks pass**, replaying
**3,538,944 mode samples** and confirming **14,382 protected files unchanged**.
[Review index](review/r17-D-review.html); [audit](review/r17-D-verification.json).
This is saved-art self-review, not independent or in-engine approval.

BRIEF-17 retains the 3-cell gate over panel 1's conflicting 4-cell request;
panel 2 is absent. Round 15 is comparison-only, Part E life remains deferred,
and D has no seasonal partners. No commit, push or branch change; the
checkout was already detached. All project edits stay in `art-drop/`.

Replay: `python -B art-drop/review/r17-D-process.py`,
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-D-verify.py`.

# Round 17 — Part D: critic-r17D-1 redraw

Redrew **gatehouse, wall-walk, wall-walk-stair and stall-2** and repaired the
D market in **`out/city17/compose.py`**. All **12 passing D sprites** and
all earlier-part art remain byte-identical. The gate has broad twin tower
volumes, a recessed **96×64px clear portal** and a drawn access landing;
wall/stair contacts use explicit overlapping paint anchors. Smaller masonry,
two different wall crops and clearly tapered fish replace the failed details.
The guildhall now faces the church across the northern arm of an L-shaped
square; its arcade opens onto paving. Service-road pockets break the long
run, and a newly drawn slate threshold identifies the gate approach.

Used **13 built-in image-tool drawings/edits on solid magenta**: three gate
variants, three wall variants plus a cleanup edit, three stair variants,
two fish variants and one review/compositor-only paving drawing. Selected
five sources. Same method: **8× BOX registration → fixed palette → exact
64-sample mode → one-pixel cleanup**, hard **0/255 alpha**, zero hidden RGB.
Code only registers, reduces, cleans, crops and composites drawings.
[Exact prompts/sources](review/r17-D-critic1-generation.json),
[processing](review/r17-D-critic1-processing.json), and
[response to every critic problem](review/r17-D-critic1-response.json).

Regenerated all D scenes, **1×/3× reference comparisons**, greyscale squints,
all **16 piece sheets at 1×/4× beside fantasy-house-2**, self seams and unlike
wall contacts, including focused 8× proofs. **172 checks pass**, replaying
**24,330,240 mode samples** and confirming **14,274 protected files unchanged**.
[Review index](review/r17-D-review.html); [audit](review/r17-D-verification.json).
This is saved-art self-review, not an independent critic or engine approval.
BRIEF-17's **3-cell gate footprint** wins over panel 1's conflicting 4-cell
request; existing height overhangs are retained. Panel 2 is absent. No
Round15 production art is used; it is comparison-only. Part E life remains
deferred. No seasonal partners belong to D. No commit, push or branch change;
the checkout was already detached at HEAD. All project edits stay in `art-drop/`.

Replay: `python -B art-drop/review/r17-D-process.py`,
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-D-verify.py`.

# Round 17 — Part D

Made **16 native RGBA PNG exports** in **`out/city17/`**: cathedral,
guildhall, open market hall, gatehouse, fountain, interval tower, repeatable
wall-walk and its stair attachment, market cross, shrine, and six distinct
market stalls. Extended **`out/city17/compose.py`** to place these whole
sprites by bottom-left/base-row anchors in an irregular market. All **422
existing A/B/C PNGs remain byte-identical**.

**Method:** **21 large built-in image-tool drawings on solid magenta**,
selecting **15 paintings**. Cathedral and guildhall received two alternatives;
gatehouse and wall-walk received three. The first gate designs had excessive
open height; the selected third drawing has a substantial gate chamber.
The first wall mistakenly included a house and was rejected. Exact prompts,
source paths and selections are in [generation](review/r17-D-generation.json).
No API fallback, code-drawn architecture, shapes, texture or noise.

Painted-bound registration → **BOX registration at 8× native size** → fixed
palette without dithering → exact RGBA mode of **all 64 samples per 8×8
footprint**, with lexicographic ties → isolated-colour/alpha-island cleanup
and one-pixel dark silhouette cleanup. The gate registers its painted tower
and portal columns separately to retain a **96px opening**. Its neutral
stone palette matches the wall; quiet cloth ramps distinguish the canopies.
A stricter magenta key preserves the violet canopy. The wall-walk repeats
one complete native 48px merlon/corbel period from the selected stair-wall
painting. [Processing and edits](review/r17-D-processing.json),
[native transfer](review/r17-D-native-joins.json),
[replay script](review/r17-D-process.py).

| Export | Footprint in 48px cells | Native PNG canvas |
|---|---:|---:|
| `cathedral` | 5×6 | 240×432 |
| `guildhall` | 4×4 | 192×400 |
| `townhall-market` | 4×3 | 192×144 |
| `gatehouse` | 3×4 | 144×400 |
| `fountain` | 2×2 | 96×96 |
| `wall-tower` | 2×3 | 96×240 |
| `wall-walk`, `wall-walk-stair` | wall / access attachment | 96×144; 192×144 |
| `market-cross` | 1×2 | 48×96 |
| `shrine`, `stall-0..5` | 1×1 each | 48×48 each |

The church has **430 painted rows**; guildhall and gate have **398**. All
three exceed the **384px maximum five-storey plus three-cell roof test**;
the church leads the skyline. Following the panel's hierarchy clarification,
the open market hall, fountain and small monuments remain low. The interval
tower is subordinate to the gate. Stalls have **44px-wide painted canopies**:
bread/red, cloth/indigo, fish/teal, fruit/green, pottery/ochre, spice/violet.
Exports use **11–36 painted colours**, alpha strictly **0/255**, and zero RGB
under transparency. No seasonal partners or ground bases belong to D.

**Composition and critic:** rebuilt the **768×576 / 16×12-cell L-block**,
both five-storey/one-storey joins, and a **1248×1584 irregular market** with
the church on the north edge in a fenced yard, guildhall opposite, offset
fountain, cross and two staggered groups of three stalls. Low flanking houses
preserve the skyline. The gate connects to drawn wall-walk/stairs and an
interval tower, with road visible beyond it. The main route changes width at
setbacks; a **96px core**, **48px inner service route**, and stall end access
remain free of fixed art. Existing B shadow paint falls south/east of civic
buildings and is masked to visible receiving ground. A separate common-base
skyline sheet compares the landmarks directly against the maximum stack.

All four scenes have **1×/nearest-neighbour 3× reference comparisons** and
**native greyscale squints**. Every export has a **1×/4× sheet beside
`fantasy-house-2`**, plus self-neighbour seams; additional sheets show unlike
wall contacts, all six stalls and actor clearance. Props sit on summer
paving/grass. Literal **3×3 repeats at 1×/4×** are supplied for the unchanged
context paving and grass; they are not new D ground exports. Start at
[the review index](review/r17-D-review.html).

**QC:** inspected all 16 exports at 1×/4× and applied the brief's fail list
in [the scoped critic](review/r17-D-critic.json). The saved-art audit replays
**42,860,544 mode samples**, validates cleanup, dimensions, hard alpha,
hidden RGB, exact scale renders and fixed-obstacle route clearances.
The L-block's movable review actor is excluded from fixed obstacles.
**14,222 protected pre-existing files remain unchanged**; only the authorized
compositor and this Notes file are excluded. See
[verification](review/r17-D-verification.json) and
[per-file measurements](review/r17-D-files.json).

**Precedence and limits:** BRIEF-17's **three-cell gate footprint wins** over
panel 1's requested four cells; the 96px portal is retained within it.
Panel 2 was absent. No Round15 art is placed in the scenes; its street render
is comparison-only, and the earlier course/palette donors remain the approved
modular contract. Part E life/district content remains deferred. This is
saved-art self-review, not independent or in-engine approval. No commit,
push, branch change, or edit outside `art-drop/`.

Replay: `python -B art-drop/review/r17-D-process.py`,
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-D-verify.py`. The processor also accepts source
IDs for a focused replay; all source/registered/mode/cleanup records are kept.

# Round 17 — Part C: critic-r17C-2 redraw

Repaired **`compose.py` and `street-junction-turn.png`**. All **44 passing C
PNGs** and approved A/B exports remain byte-identical. Five new continuous
roof-junction drawings replace the faulty repeated wing crop and abrupt
north/node boundaries; standalone caps remain unchanged. Automatic masked
east/south shadows now include the market and both C tall/low orientations.

Used **13 large built-in image-tool drawings on solid magenta**, two per
piece plus a focused third T-valley correction, selecting six. Same painted-bound registration at **8×**, palette
lock, exact **64-sample mode**, hard alpha, zero hidden RGB and one-pixel
cleanup. No shapes or noise were constructed in code. [Prompts/sources](review/r17-C-critic2-generation.json);
[processing](review/r17-C-critic2-processing.json).

Regenerated the pilot, L-block, irregular market, both height orientations,
connected nodes, 1×/3× comparisons, native greyscale, every 1×/4× piece sheet,
seams and full paving repeats. Inspected all 45 C exports beside
`fantasy-house-2`. The [audit](review/r17-C-critic2-verification.json) passes,
replaying **15,040,512 mode samples**, confirming zero required roof holes,
clear routes, **1,152 repaired market east-shadow pixels**, and **13,324
protected files unchanged**. [Review index](review/r17-C-review.html);
[response to each failure](review/r17-C-critic2-response.json).

Current halls, well and two stall drawings remain labelled **Part D proxies**;
final skyline/gate and distinct stalls are deferred. Round15 is comparison
only. BRIEF-17 wins panel conflicts on courses, lot-contained overlays,
24px lanes and compulsory bends/jogs/wedges; panel2 was absent. This is
saved-art self-review, not independent or in-engine approval. No commit,
push or branch change. Replay commands are in the response linked above.

# Round 17 — Part C: critic-r17C-1 redraw

Repaired all **25 failed PNGs and `compose.py`**. All **15 passing C PNGs**
and existing A/B exports remain byte-identical. The set now has **45 exports**,
including three retained ground-only rear walls, a separately painted west
roof adapter and a painted kerb-turn adapter. Rear doors/plinths stay at ground
level; supported stair galleries, registered side/hip corners and a recessed
inner turn replace the failed assemblies. Paving, fence and tub-tree drawings
were replaced.

Used **44 new large built-in image-tool drawings on solid magenta**, with two
alternatives for difficult pieces, plus registration of two original side
walls. Same method: BOX registration at 8×, palette lock, exact 64-sample mode,
hard alpha, zero hidden RGB, one-pixel cleanup and native drawn contact
transfers. Code constructs no production shapes or noise. [Sources/prompts](review/r17-C-critic1-generation.json);
[processing](review/r17-C-critic1-processing.json).

Rebuilt the pilot, connected C corner/T/dead-end proofs, L-block, market and
both tall/low C orientations; streets change width within eight cells.
Regenerated 1×/3× reference comparisons, native greyscale, every 1×/4× piece
sheet, seams and repeats. Inspected all 45 exports beside `fantasy-house-2`.
The audit replays **18,137,088 mode samples** and confirms clear routes,
complete required roof coverage and **12,590 protected files unchanged**.
[Review index](review/r17-C-review.html); [critic response](review/r17-C-critic1-response.json);
[verification](review/r17-C-critic1-verification.json). This is saved-art
self-review, not independent or in-engine approval.

Current halls, well and two stall drawings remain **Part D proxies**; final
skyline/gate and distinct stalls are deferred. Round 15 is comparison only.
BRIEF-17 wins panel conflicts on fixed courses, lot-contained overlays,
the 24px lane and compulsory bends/jogs/wedges. Panel 2 was absent.
No commit, push or branch change.

Current replay: `python -B art-drop/review/r17-C-critic1-process.py`,
`python -B art-drop/out/city17/compose.py`,
`python -B art-drop/review/r17-C-critic1-proofs.py`, then
`python -B art-drop/review/r17-C-critic1-verify.py`.
Earlier Part C commands and measurements below describe the superseded first submission.

# Round 17 — Part C

Made **40 native RGBA PNG exports** in **`out/city17/`**: rear walls and
stairs, rear roofs, separately lit side returns, corner/terminal assemblies,
fences, yard details and the streets assigned to C by panel 1. There are
**38 pixel-unique exports**; `side-ground` and `side-storey` are exact E
aliases. Extended **`out/city17/compose.py`** for front/back rows, side
streets, deliberate fenced yards and the combined pilot. The existing
**377 Part A/B PNGs remain byte-identical**.

**Drawing method:** **53 large built-in image-tool drawings on solid
magenta**, selecting **38 production drawings and one review-only person**.
Difficult stairs, side roofs, corner roofs and the main road received 2–3
alternatives. Rejected drawings remain available, including the mistaken
whole-building outputs. Exact prompts, selections and source paths are in
[the generation record](review/r17-C-generation.json); original images are
`review/r17-C-source-*.png`. No architecture, object, texture, noise or shadow
silhouette was constructed in code.

Magenta key → painted-bound/row registration, or column-then-row registration
for returns → **BOX registration at 8× native size** → existing approved
palette and Part B terracotta ramp, without dithering → exact RGBA mode of
**all 64 samples per 8×8 footprint**, with lexicographic ties → one-pixel
outline and isolated-colour cleanup. Props preserve source proportions.
Opaque row runs exclude detached source fringes, fixing one-pixel wall-edge
gaps. The vertical fence registers its drawn axis without diagonal drift.
Green canopy samples lock to the approved foliage ramp rather than timber
browns. All registration settings and native edits are retained in
[the processing record](review/r17-C-processing.json).

Rear walls keep the established drawn course on **rows 0 and 47**; roof
contacts use the same course. The rear roofs share the w2 drawing's **top
12 ridge rows and bottom 4 eave rows**. The main road wraps two complete
painted cobble courses (**96×12**) and receives the drawn side-road kerb/
gutter strips; junction paving wraps a **24×16** painted patch. These are
native transfers and repeats, recorded in
[the join log](review/r17-C-native-joins.json). No painting is resampled
inside the compositor.

**Final files and measurements:** widths w1/w2/w3 are **48/96/144 px**.

| Family in `out/city17/` | Native canvas | Exports |
|---|---|---:|
| `back-plain-w1..3`, `back-stair-w1..3` | 48/96/144 × 48 | 6 |
| `roof-back-w1..3` | 48/96/144 × 96 | 3 |
| `side-ground`, `side-storey`, their `-E` and `-W` partners | 96 × 48 | 6 |
| `side-ground-d3`, `side-storey-d3` | 144 × 48, separately drawn | 2 |
| `side-roof-d2`, `side-roof-d3` | 96 × 96; 144 × 144 | 2 |
| `corner-outer-L/R`, `corner-inner`, `deadend-cap`, each `-storey` / `-roof` | 96 × 48 / 96 × 96 | 8 |
| `tee-end-storey`, `tee-end-roof` | 144 × 48 / 144 × 96 | 2 |
| `fence-0`, `fence-1` | 48 × 24; 24 × 48 | 2 |
| `yard-0..3` | 48 × 48 | 4 |
| `street-main`, `street-side`, `street-junction` | 96 × 48; 48 × 48; 48 × 48 | 3 |
| `lane`, `mud-edge` | 24 × 48; 48 × 48 | 2 |

Yards contain a well, washing over a wood shelter, a low shed, and a tree in
a timber tub. Each file uses **3–26 painted colours**, alpha strictly
**0/255**, and zero RGB under transparency. All architectural rectangles and
paving bases are fully opaque, with square footprints and no pinholes.
Fences/yard details/mud retain transparent surroundings. There are no
one- or two-pixel alpha islands. No seasonal partners belong to this part.
Existing B shadow overlays retain their brief-required 112/255 alpha;
none were altered or re-exported.

**Composition and critic:** the **384×384 / 8×8-cell pilot** combines an A
front, C rear and side entrance, a 48px court passage, junction and drawn
person. Its annotated proof separates footprints, painted bounds, entrance
anchors, permitted projections and civic/gate reservations. A **96×336 /
2×7-cell plot** demonstrates the deeper property arrangement. The cutaway
proof shows an actor occluded by the front roof and revealed when that roof
is omitted; the court actor remains visible.

Built the **768×576 / 16×12-cell L-block**, with two east-west streets, a
north-south route, T-junction, dead end, the intact continuous B L roof and
fenced rear gardens; the **864×864 irregular market**, with a 96px through
route, two rows of three stalls and civic positions; the **768×480 5|1 and
1|5 height test**, retaining B's firewall/coping/flashing; and a **768×432
corner assembly test**. Base-row ordering, bottom-left anchors and native
48px floor spacing remain intact. South shadows use the existing drawn
strips; explicitly reserved east receivers remain in the height test.

Every scene has **1× and nearest-neighbour 3×** renders beside literal 1×
`round15-street.png` and `current-town.png`, plus a **greyscale squint at 1×**.
The current-town reference is labelled as a screenshot displaying 24px
cells. Every C file has its own **1×/4× sheet beside `fantasy-house-2`**, and
self/compatible-family seam sheets. Additional sheets show unlike A/B/C
contacts and rear stacks. All five street/lane/mud surfaces have literal
**3×3 repeats at 1×/4×**; props and mud are mounted over approved summer
grass. Start at [the review index](review/r17-C-review.html).

**QC:** inspected all C pieces at 1×/4× and applied the brief's fail list in
[the scoped critic record](review/r17-C-critic.json). The replay audit checks
**21,483,520 mode samples**, all logged cleanup/transfer edits, palette,
dimensions, alpha, course contacts, exact scale proofs and literal repeats.
Measured clear routes have **zero building/prop pixels** in their 48/96px
reservations; designated L roof areas have **zero uncovered pixels**. Every
critic scene has visible drawn street shadow receivers. **13,125 protected
files are unchanged**. Full results and per-file measurements are in
[verification](review/r17-C-verification.json) and
[the file manifest](review/r17-C-files.json). This is saved-art self-review,
not independent or in-engine approval.

**Deferred work and precedence:** current native `fantasy-hall-1`,
`fantasy-hall-0`, `fantasy-well-0` and two stall drawings are explicitly
labelled **Part D proxies**. The proxy church is not the skyline leader;
final cathedral/guildhall/gate hierarchy and six distinct stalls therefore
remain deferred, not passed. No city15 facade, roof or street sprite is
placed in these scenes; its established course/palette donors remain the
modular contract, and the old street render is comparison only. BRIEF-17
wins over panel suggestions to drop compulsory jogs/wedges, defer the 24px
lane export, remove shared course belts or project beyond lot edges. The
24px lane is delivered but required clear routes use 48/96px. Panel 2 was
not present. No commit, push or branch change was made.

Replay in order: `python -B art-drop/review/r17-C-process.py`,
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-C-verify.py`.

# Round 17 — Part B: critic-r17B-3 redraw

Repaired `out/city17/compose.py`, the only failed file. All **137 passing Part B PNGs remain byte-identical**. The fixed pilot L now uses continuous drawn roof paint: courses cross both former rectangular cuts, the southwest hip ends at the outside corner, and one uninterrupted eave retains both exposed verges. Earlier deep-cap, firewall, shadow-mask and final-accent fixes are preserved.

Made **three large built-in image-tool variants on solid magenta** and selected A. Same method: source-landmark BOX registration at 8×, approved palette lock, exact mode of all 64 samples, hard 0/255 alpha, zero hidden RGB and 29 one-pixel cleanup edits. No shapes or texture were constructed in code. [Prompts and sources](review/r17-B-critic3-generation.json); [processing record](review/r17-B-critic3-processing.json).

Rebuilt the requested scenes, comparisons, squints, every export/seam sheet and focused 8× join/eave proofs. Inspected all unique exports at 1×/4× beside `fantasy-house-2`, plus the L in all three colours. **1,253 checks pass**, replaying 15,482,880 mode samples and confirming 11,939 protected files unchanged. [Review index](review/r17-B-review.html); [response to all critic problems](review/r17-B-critic3-response.json). This is saved-art self-review, not independent or in-engine approval.

Current terrain and civic/stall drawings remain labelled C/D proxies; round 15 is comparison only. Final city hierarchy remains deferred. BRIEF-17 wins the panel conflicts on inventory, shared eaves and lot-contained overlays. No commit, push or branch change.

Replay: `python -B art-drop/review/r17-B-critic3-process.py`, `python -B art-drop/out/city17/compose.py`, `python -B art-drop/review/r17-B-critic3-details.py`, then `python -B art-drop/review/r17-B-critic3-verify.py`.

# Round 17 — Part B: critic-r17B-2 redraw

Repaired the four failed `roof-fill-w1` exports and `out/city17/compose.py`. All **133 passing Part B PNGs remain byte-for-byte unchanged**; the independent critic report is preserved.

Made **three large built-in image-tool variants on solid magenta**. Selected C for the lit fill and B as the shaded L-plane adapter. Painted courses are BOX-registered at 8×, palette-locked, reduced by exact 64-sample mode, cleaned and tile-wrapped to 48×48; alpha is 0/255 with zero hidden RGB. Exact prompts, sources and replay records are in `review/r17-B-critic2-{generation,processing}.json`. No architecture or texture was drawn in code.

Deep ridge roofs now use complete native course adapters from each unchanged cap, retaining its own tile scale, left/right values and one-pixel verges across both interfaces. The L uses unrotated lit/shaded paint, its existing valley channel and hip ends. Jetty shadows exclude bare firewall bays. Narrow tall/low lots use 4px masonry returns beside intact windows; wider lots retain full wall bays. Final roof accents follow opaque joins and stay clear of the joined ridge.

Regenerated every export/seam proof, the three critic scenes at 1×/3× beside both references, greyscale squints, both height orientations, narrow adjacency cases, literal fill repeats and all **27 width/colour/depth-3/4/5 cases**. Inspected every unique Part B export at 1×/4× beside `fantasy-house-2`. **13,352 checks pass**, including 344,064 mode samples and 11,757 protected files. Start at [the review index](review/r17-B-review.html); the [critic response](review/r17-B-critic2-response.json) covers each failure. This is saved-art self-review, not independent or in-engine approval.

Current terrain and civic/stall art remain explicit C/D proxies; no city15 piece is used except the comparison. Final landmark/gate/street hierarchy remains deferred. BRIEF-17 wins over panel conflicts on shared eaves, lot-contained overlays and inventory size. No commit, push or branch change.

Replay: `python -B art-drop/review/r17-B-process.py`, `python -B art-drop/out/city17/compose.py`, `python -B art-drop/review/r17-B-critic2-details.py`, then `python -B art-drop/review/r17-B-verify.py`.

# Round 17 — Part B: critic-r17B-1 redraw

Repaired all 41 failed PNGs and `out/city17/compose.py`; the 96 passing Part B PNGs remain byte-for-byte unchanged. The independent `review/critic-r17B-1.json` is preserved. This is the repair's saved-art self-review, not independent or in-engine approval.

Used 24 new large built-in image-tool drawings on solid magenta, with 2–3 alternatives for difficult pieces and 11 selected drawings. Registered at 8×, locked the existing palette without dithering, reduced by exact 8×8 mode, then cleaned outlines/flecks, wrapped native paint and composited drawn joins. Alpha is 0/255 with zero hidden RGB; shadow masks retain the brief's 0/112 exception. Sources, prompts and every post-mode edit are retained in `review/r17-B-critic1-generation.json` and `review/r17-B-critic1-processing.json`.

- Redrew substantial flat parapets, the w2 gable, the recessed dormer, a complete 48×48 fill, the valley, terminal hip and plain firewall. Wide shadows now have continuous silhouettes.
- `roof-hip-end` is now **48×96**, terminating the two-cell-deep L wing; all other export dimensions are retained. The compositor joins its incoming ridge, mounts skylights on one receiving plane, extends below the ridge, shares flat parapets, and reserves a 48px wall bay beside intact windows in both tall/low orientations.
- Rebuilt the L-block, irregular market, 5|1 and 1|5 tests at 1×/3× beside both references, greyscale squints, every per-file 1×/4× proof and seam sheet, literal fill repeats and focused 8× joins. Start at [the review index](review/r17-B-review.html); [the response](review/r17-B-critic1-response.json) addresses every failed file.

Part B self-review passes the scoped fail list. Current grass/paving and halls/well/two stall drawings remain explicit C/D proxies; civic/gate/street hierarchy cannot pass yet. No city15 piece is used except the comparison render. BRIEF-17 wins over panel conflicts on shared eaves, lot-contained overlays and inventory size. No commit, push or branch change was made.

# Round 17 — Part B

Made **137 native RGBA PNG exports** in **`out/city17/`**: four roof
families, three widths, red/slate/brown colourways, deeper-roof fill,
valley/hip joins, a firewall, ten roof accents and three shadow families.
There are **98 pixel-unique exports**; unsuffixed names are the c0 aliases.
Extended **`out/city17/compose.py`** for native roof depths, fills, joins,
unequal-height neighbours and receiving-surface shadows. Part A's **240 PNGs
and COURSE.md remain byte-identical**.

**Drawing method:** **41 large built-in image-tool drawings on solid
magenta**, selecting **29 source drawings**. Difficult pieces received
2–3 alternatives: gable w2, hip w2, all flat roofs, fill, valley, firewall
and the small gabled dormer. The final flat roofs have stronger terrace
seams; the second firewall has larger masonry courses; the second dormer
keeps its two-pane recess at native size. Exact prompts, source paths,
selection flags and registration settings are in
**`review/r17-B-generation.json`**; all original drawings remain as
**`r17-B-source-*.png`**. No API fallback was used.

Solid-magenta key → painted-row registration for rectangular modules
(painted-bounds registration for silhouettes, aspect-preserving registration
for accents) → **BOX registration at 8× native size** → fixed approved
palette plus a seven-step terracotta ramp, without dithering → exact RGBA
mode of **all 64 samples per 8×8 footprint**, with lexicographic ties →
one-pixel exposed-outline and isolated-pixel cleanup. Source ridge-tip
protrusions are excluded before registering straight, completely painted
north edges. The last eave row transfers the existing drawn contact course.
Material-only corrections keep enclosed gable/hatch timber warm and put
all terrace tile shades into the appropriate roof ramp. No shape, texture,
noise, masonry or shadow silhouette was constructed in code.

The fill wraps a **16×16 painted interior patch** containing two tile
courses, repeated natively into a **48×48 tile**. This removes phase drift
at both wrap edges without blending or inventing pixels. The firewall's
bare body **(1,4)–(15,44)** repeats in both axes; its top four coping rows
and bottom two flashing rows are applied once by `firewall_surface()`.
The narrow neighbour reveal uses four existing edge pixels inside the
taller lot, preserving the adjacent facade's windows.

**Final files and measurements:** dimensions are native pixels; w1/w2/w3
mean **48/96/144 px**. Except the single firewall, every named base has
**c0/c1/c2 plus an unsuffixed c0 alias**. c0 is red tile, c1 muted slate,
c2 brown tile.

| Family in `out/city17/` | Native canvas | Exports |
|---|---|---:|
| `roof-gable-w1..3`, `roof-ridge-w1..3`, `roof-flat-w1..3` | 48/96/144 × 96, exactly 2 cells deep | 36 |
| `roof-hip-w1..3` | 48/96/144 × 144, exactly 3 cells deep | 12 |
| `roof-fill-w1`, `roof-valley`, `roof-hip-end` | 48 × 48 | 12 |
| `firewall-w0` | 16 × 48 | 1 |
| `chimney-0..3` | 16×32, 20×28, 16×36, 24×24 | 16 |
| `dormer-0..3` | 24×28, 28×24, 24×28, 24×28 | 16 |
| `skylight-0..1` | 20×24, 28×20 | 8 |
| `shadow-eave-w1..3` | 48/96/144 × 4 | 12 |
| `shadow-jetty-w1..3` | 48/96/144 × 6 | 12 |
| `shadow-street-w1..3` | 48/96/144 × 32 | 12 |

Non-shadow exports use **5–24 painted colours**, alpha strictly **0/255**,
and dark outline **(43,40,29)**. All transparent pixels have RGB **(0,0,0)**.
All roof and firewall footprints are fully opaque: no unpainted corner,
rounded canvas edge or pinhole exposes the terrain underneath. Accents
retain transparent margins and no isolated one- or two-pixel alpha islands.
No seasonal partners or ground bases belong to this part.

**Shadow exception required by the brief:** painted shadow pixels use
**112/255 alpha (43.9%)**, below the 50% limit; all clear pixels are zero
RGBA. Widths w2/w3 repeat the drawn w1 mask. The compositor puts **4 px**
eave shade on the wall and **6 px** shade below jetties, preserving facade
contact rows. South and explicitly reserved east ground receivers use
**6 px per storey**, reaching **30 px** in the five-storey test; available
receivers constrain the width. A maximum-alpha union avoids doubled dark
intersections. Terrain remains visible through the shade, and buildings
and props mask it in base-row order. Roof accents and joins are rejected
if they cross their lot or leave their roof receiver.

**Critic scenes:** `compose.py` builds the **768×576 / 16×12-cell L-block**
with a T-junction, dead end, two east-west streets and a north-south lane;
an **864×864 irregular market square** with six stall positions; and a
**768×480 five-storey/one-storey test in both orientations**. The L-wing
uses three fill rows above its two-cell cap, with a drawn valley join.
Mixed two-/three-cell roofs meet at the same facade eave without gaps.
The tall/low test shows coping, repeated bare wall, flashing and different
shadow reaches. Buildings remain bottom-left anchored and compose at
native scale, with ground/storeys/roof/overlays in order and objects sorted
by base row. Every scene uses at most two facade colours and one roof colour.

All roofs, roof accents, firewall and shadows in these scenes are Part B;
all facades are current Part A. **No round 15 roof or facade remains.**
Current fantasy grass/paving and deliberate yard reservations stand in
for **Part C**. Current `fantasy-hall-1`, `fantasy-hall-0`, `fantasy-well-0`
and two stall drawings stand in for **Part D's cathedral, guildhall,
market cross and six distinct stalls**. They are kept at native size and
labelled on the comparison sheets. The gate and final civic skyline do
not exist yet. The large current paving also awaits Part C.

**QC:** inspected every pixel-unique export at **1× and exact nearest-
neighbour 4× beside `fantasy-house-2`**, the native composed neighbour,
same/variant seams, unlike roof eaves, literal 3×3 fill repeats, firewall
body repeats and all ten mounted roof accents. Inspected critic scenes
at **1×/3× beside literal 1× `round15-street` and `current-town`**, plus
**1× greyscale squint views**. The current-town screenshot is labelled
as its actual 24 px display-cell scale; it is not enlarged to fake a match.
Final Part B saved-art self-review: **PASS; failed Part B files: `[]`**.
No independent panel approval or in-engine test is claimed.

The brief's fail list is recorded criterion by criterion in
**`review/r17-B-critic.json`**. Part B has no roof holes, interlot eave gaps,
missing street shade or unbounded accents. Roof kinds, widths, heights and
accents vary across the scenes. **Full-city acceptance is not claimed**:
landmark dominance, the gate, quieter streets, rear/side architecture and
six distinct market stalls remain failures or incomplete checks for C/D.
Existing Part A trade signs were preserved, not redrawn or reapproved here.

**Panel priorities and conflicts:** B items **3 and 11** are applied through
roof depth/volume, native joins, bare party walls with coping/flashing and
directional receiving-surface shadows. BRIEF-17's complete requested inventory
wins over the panel's 40–60-piece cap; its shared eaves win over the panel's
wording against universal aligned eaves; its lot-boundary rule wins over
unrestricted projections. East shade requires a reserved receiver. The
shadow-specific alpha requirement wins over the general hard-alpha rule
only for shadows. The user's no-commit/no-push instruction wins over the
brief's push instruction.

**Verification: 36,910 / 36,910 checks pass.** The audit replays
**212,928 exact mode blocks / 13,627,392 source samples** and **23,436
recorded native edits** across all alternatives (**20,557** in selected
sources, including tile wrapping, palette corrections and shadow tinting).
It checks dimensions, palette membership, alpha, hidden RGB, exposed
contours, opaque roof coverage, colourway/silhouette equality, contact rows,
exact 4× proofs, exact 3× scenes, both tall/low walls, height-responsive east
shade, bounded placement and literal fill repetition. **11,431 protected
pre-existing files remain byte-identical**, and all earlier NOTES bytes,
including the pre-existing merge conflict, follow this section unchanged.
Results: **`review/r17-B-validation.json`**. Per-file dimensions, bounds,
colour counts, alpha values and pixel hashes: **`r17-B-files.json`**.

**Review sheets:** start at **`review/r17-B-review.html`**.
`r17-B-file-*.png` contains every final file at 1×/4×;
`r17-B-seam-*-{1,4}x.png` contains every same/variant seam;
`r17-B-repeat-roof-fill-w1*-{1,4}x.png` is literal 3×3;
`r17-B-unlike-eaves-*`, `r17-B-join-kit-*`,
`r17-B-firewall-body-repeat-*` and `r17-B-overlay-mounts-*` cover assembly.
`r17-B-critic-*-{1,3}x.png`, `*-comparison-{1,3}x.png` and
`*-squint-1x.png` contain the three critic layouts. Source alternatives,
registered samples, mode reductions and cleanup stages are retained.

Reproduce with `python -B art-drop/review/r17-B-process.py`, then
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-B-verify.py` (Python and Pillow).
Only Part B output files, `compose.py`, new `r17-B-*` review material and
this top NOTES section changed. **No commit, push or branch change.**

---

# Round 16 — Part Epolish: critic-r16Epolish-1 redraw

Repaired **cloudy** by moving its original sun three native pixels down behind
the unchanged shared cloud. Redrew **blizzard** with a separate six-arm flake
and two gusts, and **sandstorm** with three unconnected horizontal dust bands.
The **eleven passing output PNGs remain byte-identical**.

Made **two built-in image-tool variants per redraw on solid magenta**;
selected **blizzard D** and **sand D**. Used the same **8× BOX registration →
fixed palette → exact mode of all 64 RGBA samples → one-pixel contour cleanup**.
No shapes or noise were constructed in code. All icons retain **24×24 RGBA**,
alpha **0/255**, zero transparent RGB and the existing navy outline/palettes.
Prompts, four sources, five reduction stages and cleanup records are in
`review/r16-Epolish-critic1-*`.

Regenerated the full **1×/2×/4× dark/light rows**, **2× named badges**,
individual proofs and seven context sets. Before/after now starts at the
critic-round-1 icons. Saved-art self-review finds the listed problems resolved;
**no new independent critic verdict is claimed**. The supplied critic evidence
and earlier notes remain unchanged. **9,789/9,789 checks pass**, including
184,320 mode samples, 147 colour-only cleanup edits and 9,096 protected files.

Review: `review/r16-Epolish-review.html`. The existing `r16-Epolish-build.py
--install` and `r16-Epolish-verify.py` entry points now route to this repair;
run `r16-Epolish-review.py` between them. Validation is saved in
`review/r16-Epolish-critic1-validation.json`. **No commit, push or branch change.**

---

# Round 16 — Part Epolish

Redrew all **14 transparent 24×24 weather icons** in **`out/weather16/`**
as one family. The seven cloud-based weather types use **one exact 20×12
cloud drawing**, with three stepped puffs, a full body, top-left highlights
and a dark navy **(32,41,54)** one-pixel outline. Cloudy/rain/snow use the
white ramp; overcast/heavy rain/hail use slate; storm uses dark slate.
Only colour and placement change between these cloud copies; none is resized.

**Drawing method:** **19 large built-in image-tool drawings on solid magenta**:
three cloud alternatives; two sun, blizzard, wind, sandstorm and heat-wave
alternatives; one crescent, rain strip, heavy-rain strip, snow strip, hail
strip and fog drawing. Selected **cloud C**, **sun A's separately registered
components**, **blizzard B / wind B / sandstorm B**, and **heat B's ripples**.
The first cloud variants have taller, less distinct lobes; the second
blizzard has simpler branches; wind B keeps clean open hooks; sandstorm B
has better asymmetric bands. Sources and exact prompts remain in
**`review/r16-Epolish-generation.json`** and **`r16-Epolish-source-*.png`**.
The built-in tool was used throughout; no API fallback.

Solid-magenta key → painted-bounds **BOX registration at 8×** onto 192×192
canvases → explicit fixed palette, without dithering → exact RGBA mode of
**all 64 samples per 8×8 footprint**, including transparency, with
lexicographic RGBA ties → native one-pixel contour cleanup. Original drawn
components are isolated and registered separately when reduction would lose
their centres: eight sun rays and its round disc, the four-point star,
precipitation marks, wind streams and heat ripples. Three source-supported
wind midtone transitions are restored from colours present in their own
registered sample blocks. No symbol, texture, noise or replacement shape is
constructed in code; code keys, registers, reduces, palette-locks, cleans,
recolours and composites the drawings.

There are **35 retained processing stages**, **813 recorded native
cleanup edits** across all alternatives/ingredients, **243** in
selected ingredients, plus **15** recorded contour edits to the retained
storm bolt. The bolt's gold drawing comes from the starting storm icon, as
requested; its outline uses only already-opaque neighbouring source pixels.
The full pass has **0 alpha changes** in reduction cleanup across all
stages. Final alpha is strictly **0/255**, hidden RGB is **(0,0,0)**, and all
files retain at least one clear pixel at every canvas edge. No isolated
one- or two-pixel opaque components remain.

**Family assembly:** the master cloud occupies **(2,1)–(22,13)**. Cloudy places
it eight pixels lower over a clear gold sun disc. Overcast overlaps two
unchanged-size copies at offsets **(-1,1)** and **(1,8)**. Rain has **three
5×7 short slanted drops**; heavy rain has **five 5×9 longer streaks** under
a slate cloud. Snow uses **two 7×7 cross flakes**, hail **three separated
5×5 rounded pellets**. Blizzard fills the canvas with a six-arm flake and
two sideways gusts. Fog has three broad offset bands; wind has three separate
streams with open curls at different positions. Sandstorm has three dense
ochre bands; heat wave reuses the sun above two gentle horizontal ripples.
The crescent has one proper four-point star, with no lone-dot star.

**Final files and measurements:** all names below have prefix
`out/weather16/icon-` and suffix `.png`; every canvas is **24×24 RGBA**.
Bounds are zero-based, with exclusive right/bottom coordinates.

| Icon | Painted bounds | Opaque pixels | Colours |
|---|---|---:|---:|
| clear-day | (1,1)–(23,23) | 227 | 4 |
| clear-night | (1,1)–(23,23) | 231 | 4 |
| cloudy | (1,1)–(22,21) | 290 | 7 |
| overcast | (1,2)–(23,21) | 321 | 4 |
| rain | (2,1)–(22,22) | 246 | 7 |
| heavy_rain | (1,1)–(22,23) | 306 | 7 |
| storm | (2,1)–(22,23) | 250 | 6 |
| snow | (2,1)–(22,22) | 252 | 4 |
| blizzard | (1,1)–(23,23) | 301 | 4 |
| fog | (1,1)–(23,23) | 348 | 4 |
| wind | (1,1)–(23,23) | 228 | 4 |
| hail | (2,1)–(22,22) | 249 | 5 |
| sandstorm | (1,1)–(23,23) | 272 | 4 |
| heat_wave | (1,1)–(23,23) | 274 | 4 |

**QC:** three rounds of saved-art review, with native-size corrections to
thin precipitation, missing ray centres and gust spacing before acceptance.
Inspected the full row at **1×, 2× and nearest-neighbour 4×** on dark and
light panels, plus **48 px icon + weather-name badges**, all individual
1×/4× proofs, before/after against all fourteen starting icons, and seven
supplied map contexts. Panels use alpha **191/255 (about 75%)** over the
actual reference art. The confusing pairs were checked together:
cloudy/overcast, rain/heavy rain, snow/hail, wind/blizzard/sandstorm and
fog/overcast. Final saved-art self-review: **PASS; failed files: `[]`**.
This is a saved-art review, not an independent critic verdict or an in-engine
test. Detailed decisions are in **`r16-Epolish-critic.json`**.

**Review sheets:** start at **`review/r16-Epolish-review.html`**.
`r16-Epolish-row-{dark,light}-{1,2,4}x.png` contains literal rows;
`r16-Epolish-badges-{dark,light}.png` contains every named badge;
`r16-Epolish-file-icon-*.png` shows every output at 1× and exact 4×;
`r16-Epolish-before-after-{dark,light}-{1,2,4}x.png` compares every old/new
icon. The overview and 21 context sheets cover grass, forest, town, modern
city, wasteland, desert and snow. The selection sheet retains the alternative
reductions. This part contains no ground base, prop, tree or seasonal partner,
so ground 3×3 repeats and seasonal silhouette comparisons do not apply.

**Verification: 10,237 / 10,237 checks pass.**
`r16-Epolish-verify.py` replays **20,160 exact mode blocks /
1,290,240 samples**, every recorded cleanup edit, all fourteen assemblies and
all shared-cloud colour/placement recipes. It checks sizes, palettes, hard
alpha, hidden RGB, complete exposed outlines, 20–22 px painted widths,
component sizes, proof placements and exact enlargement. It also compares
**8,916 protected pre-existing files** against the starting hashes and checks
that the entire earlier NOTES text follows unchanged. Results are in
**`r16-Epolish-validation.json`**; measurements and assembly recipes are in
**`r16-Epolish-measurements.json`**.

Reproduce with `python -B art-drop/review/r16-Epolish-build.py --install`,
then `python -B art-drop/review/r16-Epolish-review.py` and
`python -B art-drop/review/r16-Epolish-verify.py` (Python and Pillow).
Only the fourteen named output icons, new `r16-Epolish-*` review material and
this top NOTES section changed. **No commit, push or branch change.**

---

# Round 17 — Part A: critic-r17A-3 redraw

Repaired **`out/city17/compose.py`**, the critic's only failed file. Corners
now use an explicit set of complete narrower facades beside the corner panel;
unsupported combinations raise an error. The north smith and L-wing apothecary
retain their whole displays, canopies, counters and supports. The three-cell
corner uses the same safe assembly rule. Lot widths, bottom-left anchors and
48 px floor spacing are unchanged. Full-width **drawn** contact strips preserve
course rows **0/47** without cutting architectural features.

All **240 passing PNGs and `COURSE.md` remain byte-identical**. No new drawing
was needed: the critic explicitly requested a compositor repair. Existing
image-tool / magenta / registered 8× mode-sampled / palette-locked drawings
are composited at native size, with no resampling or code-constructed shapes.
There are no seasonal partners in Part A.

Regenerated the current `r17-A-*.png` review sheets, scenes, seams, per-file
1×/4× house comparisons and greyscale views. Added before/after corner proofs
and complete-source join sheets for all three colours. Start at
**`review/r17-A-review.html`**. All **31,520** existing mechanical checks pass;
the new audit covers **90 corner colour/height combinations**, reproduces the
old failure, rejects unsupported combinations and rechecks all 15 references.
See `review/r17-A-redraw3-audit.json`. Saved-art self-review resolves the listed
Part A corner defects; independent reapproval is pending.

R15 roofs and current fantasy context remain labelled B/C/D placeholders.
Roof coverage/foreground overlap, firewalls, shadows, quieter streets and civic
hierarchy remain open; full-city acceptance is not claimed. BRIEF-17's fixed
courses and full inventory take precedence over the panel's belt-removal
suggestion and pilot cap. No other part was changed.

Replay: `python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-A-verify.py` and
`python -B art-drop/review/r17-A-redraw3-verify.py`.
No commit, push or branch change.

---

<!-- r17-A critic round 3 retained notes -->
# Round 17 — Part A: critic-r17A-2 redraw

Repaired the unreadable lantern in **`ground-shop-v1-w1` and c0/c1/c2**.
Two large built-in image-tool edits on solid magenta; selected A for its
clear projecting bracket and **3×3 amber/cream light** at native resolution.
The **236 passing exports remain byte-identical**. Only 53 pixels within
the lantern patch changed per colourway; the **22×33 clear entrance**, lit
threshold, bottles, canopy and exact course rows 0/47 are unchanged.

Same method: painted-row registration → 8× BOX → composite the drawn lantern
region into the retained registered drawing → fixed palette → exact mode of
all 64 RGBA samples → one-pixel cleanup and drawn course transfer. No shapes
or noise constructed in code. Sources/prompts: `review/r17-A-redraw2-generation.json`;
selection and replay/scope audit: `r17-A-redraw2-selection.json` and
`r17-A-redraw2-audit.json`. No seasonal partners belong to A.

Regenerated the per-file 1×/4× house comparisons, seams/repeats, sample building,
critic scenes at 1×/3×, baseline comparisons and 1× greyscale views. Start at
**`review/r17-A-review.html`**. **31,520 mechanical checks pass.** This is
saved-art self-review; independent reapproval is pending. R15 roofs and current
fantasy context remain labelled B/C/D placeholders; full-city failures persist.
BRIEF-17's course contract and complete inventory take precedence over the
panel's belt-removal suggestion and pilot cap. No other part was changed.

Replay: `python -B art-drop/review/r17-A-redraw2.py --install`, then
`python -B art-drop/out/city17/compose.py`, then `r17-A-verify.py` and
`r17-A-redraw2-verify.py` in `art-drop/review/`. No commit, push or branch change.

---

<!-- r17-A critic round 2 retained notes -->
# Round 17 — Part A: critic-r17A-1 redraw

Redrew all **10 failed designs / 40 PNG exports** in `out/city17/`, including
c0/c1/c2 and the unsuffixed aliases. The **200 passing exports remain
byte-for-byte unchanged**. The eight affected entrances now have approximately
**20–22 × 31–34 px** clear openings or door leaves, lit thresholds and lanterns.
The small inn now has a paved courtyard passage and a readable tankard sign.
The wide arch has quiet grey stone paving instead of the gold wedge; timber w2
has straight posts, rectangular plaster fields, recessed glazing and thin top-lit sills.

**Method:** twenty-one new large built-in image-tool drawings on solid magenta,
**two alternatives per failed design plus a third timber refinement**, selecting ten. Source PNGs and exact
prompts are retained in `review/r17-A-redraw-generation.json`; selection reasons
are in `r17-A-redraw-selection.json`. Same magenta key → painted-row registration
→ 8× BOX → fixed **23-colour subset of the existing palette** → exact all-64-sample
RGBA mode → one-pixel contour/material-fleck cleanup. Four painted frontage
intervals are registered wider before reduction. Code constructs no replacement
shapes or noise. Existing colour ramps and drawn course donor are retained;
rows 0/47, hard alpha and zero hidden RGB are verified.

Regenerated all `r17-A-*.png` output comparisons, seams/repeats, sample-neighbour
1×/4×, L-block, market and both tall/low joins at 1×/3×, with baseline comparisons
and 1× greyscale squint views. Start at **`review/r17-A-review.html`**.
All 13 fantasy crops, the current-town crop and Round 15 street replay match.
Mechanical audit: **31,514/31,514** checks pass; redraw-specific scope/source
checks are in `r17-A-redraw-audit.json`. This is saved-art self-review, not an
independent reapproval. Full-city acceptance still fails on the recorded B/C/D
roof coverage, rear/side walls, firewall, shadows, paving and civic/gate work.
R15 roofs and current fantasy context remain labelled placeholders.

BRIEF-17's fixed course rows and complete Part A inventory take precedence over
the panel's belt-removal suggestion and pilot cap. No other part was changed.
No commit, push or branch change.

Reproduce: `python -B art-drop/review/r17-A-redraw.py --install`, then
`python -B art-drop/out/city17/compose.py`, then the `r17-A-verify.py` and
`r17-A-redraw-verify.py` scripts in `art-drop/review/`.

---

<!-- r17-A critic redraw retained notes -->
# Round 17 — Part A

Drew the complete facade set into **`out/city17/`**: **240 RGBA PNGs**
from **66 selected drawings**, comprising **182 distinct pixel images**
and 58 unsuffixed c0 aliases. Shop, door, arch and workshop each have three
layouts at all three widths. Added oriels, corner ground/upper walls, wall
ends, eight trade signs and three inn widths. Every facade has c0/c1/c2.

**Method:** **81 large built-in image-tool drawings on solid magenta**.
Every successful source and exact prompt is retained in
`review/r17-A-generation.json`; all 81 saved sources are byte-identical to
the tool outputs, recorded in `r17-A-source-hashes.json`. One interrupted
inn request was retried. Difficult pieces have two alternatives; the upper
corner and two-cell bakery have three. Selected B jetties/oriels, corner
ground B, corner upper C, bakery w1 B and bakery w2 C. Rejected upper-floor
plinths/steps and shorter or narrower bakery entrances remain in the
selection sheets.

Border-connected magenta key (all magenta for signs) → painted bounds and
row-extent registration to square edges → **8× BOX working canvas** → fixed
34-colour family palette without dithering → exact RGBA mode of **all 64
samples** per native pixel, including alpha, with lexicographic RGBA ties →
one-pixel contour/fleck cleanup. Signs preserve aspect within their canvas.
The upper corner uses a restricted brown subset of the same palette.
Colourways replace the eight-step plaster/stone ramp with muted warm-grey
or cool-grey ramps. Code only keys, registers, reduces, locks palettes,
cleans, recolours, tiles and composites drawings; it constructs no shapes
or noise in place of drawing.

**Files and measurements:** variant 0 retains the original filename;
additional layouts use `-v1` and `-v2`. Every facade design has an unsuffixed
c0 alias and explicit `-c0..2` files.

| Family | Drawings | Native size | Exports |
|---|---:|---|---:|
| ground-shop / door / arch / work, three layouts each | 36 | 48/96/144 × 48 | 144 |
| storey-timber / plaster / stone / jetty / oriel | 15 | 48/96/144 × 48 | 60 |
| corner-ground / corner-storey | 2 | 48 × 48 | 8 |
| wall-end-left / wall-end-right | 2 | 8 × 48 | 8 |
| inn-front | 3 | 48/96/144 × 48 | 12 |
| sign-smith / baker / apothecary / cobbler / inn / scribe / tailor / butcher | 8 | 32 × 40 | 8 |

There are **80 canvases at 48×48, 72 at 96×48, 72 at 144×48, 8 at 8×48
and 8 at 32×40**, using **8–31 opaque colours per file**. Alpha is strictly
**0/255**, hidden RGB is **0,0,0**, and every drawing is one connected
painted component. Facade footprints are filled with square corners.
There are no seasonal partners or new terrain bases in this part.

**Course:** `out/city17/COURSE.md` fixes rows **0 and 47** to the retained
drawn Round 15 donor: endpoints **(43,40,29,255)** and interior
**(98,66,38,255)**. Painted donor pixels are transferred, not code-drawn.
Every same-width piece/colourway has identical course bytes. Wall ends
reveal only their outer three pixels inside existing framing; windows and
courses stay intact. Corners replace 48 pixels of a lot. The final bakery
w2 entrance is roughly **22×30 px** with a lit threshold and lantern.
Jetties retain roughly **6–8-row ledge/shade bands**; separate cast-shadow
overlays belong to B. Oriel side planes, dark corner returns and top-lit
sills provide depth. Bread, jars, cloth, forge and pottery identify trades;
unlit shuttered service fronts differ from usable entrances.

**References:** extracted fantasy house 0–3, hall 0–5, stall 0–1 and well 0
into `reference/r17/` from the specified Git object, with source metadata.
`round15-street.png` comes from the unchanged city15 compositor's seed-731
mounted street. `current-town.png` is the literal **(0,0)–(600,500)** crop
of the current fantasy panel. That screenshot uses 24 px cells; comparison
labels preserve its literal 1× size. Per-piece style comparisons use native
`fantasy-house-2` at matching 1× and 4× scales.

**Reviews:** start at **`review/r17-A-review.html`**. Every export has an
individual 1×/nearest-neighbour 4× house comparison and self/colour/layout
seam sheets. All **160 ground-facade exports** also have literal **3×3
repeats at 1×/4×**, as do the four unchanged terrain backdrops. Signs are
shown over summer grass and on inspected blank bays. All 182 distinct
images were inspected through 31 native/4× gallery pages; alias pixels are
checked separately. Sample-building, corner-stack, wall-end, trade-symbol,
mounting and clear **48×48 entrance-approach** proofs are included. The
existing Round 15 review person supplies a native scale reference.

Extended the copied **`out/city17/compose.py`** for the **16×12-cell
L-block** with T-junction/dead end between two east-west streets and a
north-south lane, an irregular market with two staggered groups of three
stalls, and **both 5|1 and 1|5 joins**. Each scene has 1× and exact 3×
renders beside the Round 15/current-town references at 1×, plus greyscale
squint at 1×. Composition follows base row, then ground/storeys/roof/overlays.
Scenes use at most two wall colours and one roof colour; no A module repeats
more than twice in any five-lot row. Native recipes are saved in metadata.

**Critic:** three saved-art self-review passes, not an independent panel
verdict or an in-engine test. Part A depth, readability, course joins,
trade recognition and mounts pass this self-review. **The full-city critic
does not pass yet.** R15 roofs are explicit B placeholders; firewall and
cast street shadows are absent. Deep roof coverage, rear/side walls, yards
and quieter streets await B/C. Current fantasy halls mark cathedral and
guildhall positions, the well marks the cross/fountain, and two existing
stall drawings fill six positions. They do not satisfy D's skyline,
distinct-stall or gate requirements. Roof holes, absent street shadows and
weak civic/route hierarchy in squint views are recorded as later-part
failures, not waived. See **`r17-A-critic.json`** for every fail-list item.

The explicit complete Part A request overrides the panel's 40–60-piece cap.
BRIEF-17's fixed course contract overrides removing all repeated floor
belts. Adjacent one-pixel lot contours remain; no extra border is added.

**Verification: 31,451 / 31,451 checks pass.** The audit replays **322,048
exact mode blocks / 20,611,072 samples**, recorded cleanup, all selected
exports, **16,832 ordered same-width stack pairs**, **540 wall-end mount
cases**, per-file native/enlarged/seam/repeat sheets and all three scenes.
There are **19,134 recorded cleanup edits**, **15,817** in selected sources.
All **8,935 protected pre-existing files** and the complete earlier NOTES
content are retained. Results and per-file measurements are in
`r17-A-validation.json` and `r17-A-measurements.json`.

Reproduce with `python -B art-drop/review/r17-A-process.py`, then
`python -B art-drop/out/city17/compose.py`, then
`python -B art-drop/review/r17-A-verify.py` (Python and Pillow).
Only Part A outputs, its review/reference material and this top NOTES
section were written. **No commit, push or branch change.**

---

<!-- r17-A retained earlier notes -->
# Round 16 — Part E: critic-r16E-1 redraw

Redrew **cloudy** and **overcast**, and repaired the single stray pixel at
**(11,14)** in **sandstorm**. The eleven passing icons remain byte-identical.
Cloudy retains the original gold sun and rays behind a newly drawn three-lobe
cloud; overcast has overlapping low grey cloud banks with continuous contours.
Sandstorm's silhouette and all other pixels are unchanged.

Made **three cloudy and two overcast alternatives** with the built-in image
tool on solid magenta; selected **cloudy G / overcast F**. Sources and exact
prompts are in `review/r16-E-critic1-generation.json`. Cloudy G's painted
foreground and adjacent existing navy stroke are extracted, registered and
composited over the retained native sun. No source pixels or shapes are invented.
The same **8× BOX registration → fixed palette → exact RGBA mode of all 64
samples → native outline cleanup** produces the 24×24 icons. New redraws keep
their drawn overlap separators instead of thinning them into disconnected dots.
Final alpha is **0/255**, with **zero RGB under transparency**.

**QC:** saved-art self-review passes; **1,217/1,217** audit checks pass,
including exact mode replay, all eleven retained icons and **8,709 protected
files**. This is not a new independent critic verdict.

Rebuilt the `r16-E-*.png` review sheets, including complete rows at **1×, 2× and
4× on dark and light panels**, seven map-reference contexts with actual 75%
panels, and before/after comparisons of all three failed icons. The full earlier
NOTES content and independent critic evidence remain unchanged. No commit,
push or branch change. Validation and saved-art review results follow in
`review/r16-E-validation.json` and `review/r16-E-critic1-review.json`.

---

# Round 16 — Part E

Resumed the interrupted icon work, reviewed all **14 transparent 24×24 RGBA
PNGs** in **`out/weather16/`**, and redrew **cloudy, overcast and snow**.
The other **eleven installed icons are byte-identical** to the start of this
pass. Cloudy now has visible sun rays; overcast has two offset cloud masses
with broad stepped tops; snow has two larger white cross-shaped flakes.
The old drawings and earlier Round 16 notes remain below, unchanged.

**Drawing method:** seven new large built-in image-tool drawings on solid
magenta: **two cloudy, two overcast and three snow alternatives**. Selected
**cloudy C / overcast D / snow D**. Cloudy D loses too much ray colour after
reduction; overcast C retains a mountain-like diagonal division; snow B/C
lose cross-arm clarity. The selected drawings are retained as
`review/r16-E-source-cloudy-c.png`, `r16-E-source-overcast-d.png` and
`r16-E-source-snow-d.png`. All seven new prompts and original paths are in
**`r16-E-resume-generation.json`**, also appended to the complete
**`r16-E-generation.json`**. There are now **27 retained source drawings**.
No API fallback was used.

Magenta key → painted-bounds **BOX registration at 8×** → existing fixed
family palette, without dithering → exact RGBA mode of **all 64 samples**
in every 8×8 block, including transparency, with lexicographic RGBA ties →
native one-pixel exposed-contour cleanup. Working canvases are **192×192**.
Cloudy registers to **(1,3)–(23,21)**; overcast to **(1,5)–(23,19)**.
Snow's already-painted components register separately: cloud
**(1,1)–(23,11)**, left flake **(2,12)–(11,21)**, right flake
**(13,13)–(22,22)**. This preserves the cross arms at badge size.
Coordinates are zero-based, with exclusive right/bottom bounds.

Code only keys, registers, palette-locks, reduces, cleans and composites
drawings. It constructs no weather symbols, surface shapes or noise.
The **seven new alternatives have 291 recorded cleanup colour edits**;
all 27 drawings have **746**. The selected fourteen have **352 colour edits
and zero alpha-mask edits** from their mode reductions. Final alpha is
strictly **0/255**, RGB under transparency is **0,0,0**, each canvas has a
clear outer pixel margin, and each uses **3–6 opaque colours**. The dark
outline remains **(32,41,54)** with upper-left lighting.

**Final files and measurements:** every filename below is prefixed
`out/weather16/icon-` and suffixed `.png`; every canvas is **24×24**.

| Icon | Painted bounds | Opaque pixels | Colours |
|---|---|---:|---:|
| clear-day | (1,1)–(23,23) | 285 | 4 |
| clear-night | (2,1)–(22,23) | 234 | 3 |
| cloudy | (1,3)–(23,21) | 230 | 4 |
| overcast | (1,5)–(23,19) | 191 | 4 |
| rain | (1,1)–(23,23) | 286 | 6 |
| heavy_rain | (1,1)–(23,23) | 296 | 6 |
| storm | (1,1)–(23,23) | 258 | 5 |
| snow | (1,1)–(23,22) | 260 | 4 |
| blizzard | (1,4)–(23,19) | 176 | 3 |
| fog | (1,4)–(23,19) | 229 | 4 |
| wind | (1,2)–(23,21) | 215 | 3 |
| hail | (3,1)–(20,23) | 192 | 5 |
| sandstorm | (1,3)–(23,20) | 283 | 4 |
| heat_wave | (1,1)–(23,23) | 281 | 4 |

**QC:** inspected the complete saved row on dark and light panels at
**1×, 2× and nearest-neighbour 4×**, all individual 1×/4× proofs, and the
1× contexts over grass, forest, town, city, wasteland, desert and snow.
The context panels use actual 75% composition with dark RGB **(10,12,20)**
and light **(246,243,232)**. Rain has two short ticks under a pale cloud;
heavy rain has four long streaks under a dark cloud. Snow's two white
crosses differ from blizzard's sideways crystal/gust and hail's squared
pellets. Cloudy has gold rays; overcast has two grey clouds and no sun.
Fog has stationary horizontal bars; wind has open hooks. Clear day is a
radiant sun; heat wave is three upright warm ripples over a base bar.
No pair was confused in the native row. **Saved-art self-review: PASS;
failed review files: []**. This is not an independent critic verdict or
an observed in-engine test.

**Review sheets:** start at **`review/r16-E-review.html`**.
All fourteen **`r16-E-file-icon-*.png`** sheets contain 1× and exact 4×
placements on both panels; **`r16-E-row-{dark,light}-{1,2,4}x.png`**
provides six literal rows. The **21 `r16-E-context-*-{1,2,4}x.png`**
proofs cover all seven references. **`r16-E-redraw-comparison.png`**
compares the three prior icons with their replacements at 1×/4×;
**`r16-E-selection.png`** shows all 27 alternatives with selected marks.
Part E has no ground bases, props, trees or seasonal partners; ground
3×3 repeat sheets and seasonal silhouette comparisons do not apply.

**Verification: 1,141 / 1,141 checks pass.** The audit
`r16-E-verify.py` replays all **15,552 exact mode blocks /
995,328 samples**, recorded cleanup, selected exports, palette membership,
hard alpha, zero hidden RGB, exposed contours, component fill and margins.
It verifies every individual 1×/4× placement, exact 2×/4× row/context
enlargement, and byte-identical retention of the eleven unchanged icons.
The current protected-file baseline covers **8,688 pre-existing files
outside Part E**, and the complete starting NOTES content is preserved.
An external `BRIEF-17.md` appeared during the task; it was neither created
nor edited here and is separately recorded in `r16-E-external-files.json`.

Reproduce with **`python -B art-drop/review/r16-E-build.py`**, then audit
with **`python -B art-drop/review/r16-E-verify.py`** (Python and Pillow).
Full results are in **`r16-E-validation.json`**; registrations, palettes,
cleanup records and per-file hashes are in **`r16-E-measurements.json`**.
Only the three named Part E output icons, Part E review material and this
top NOTES section changed. **No commit, push or branch change.**

---


# Round 15 — Part M: critic-r15M-1 redraw

Repaired both failed images, `review/r15-city-mockup.png` and
`review/r15-city-mockup-vs-today.png`, by moving **folk[23]** 46 native pixels
up the east cross-street: origin **(1082,397) → (1082,351)**, foot
**430 → 384**. Its full silhouette now has **16 clear pixels** before the
nearest building pixel; the old placement overlapped the chimney by 15 pixels.
Native sprite size and the shared back-to-front foot sort are retained.
This was the critic's requested placement repair; no drawing needed redrawing.
All image-tool sources and their magenta-key / registration / exact-mode /
palette / hard-alpha / outline-cleanup results remain unchanged.

Regenerated the `r15-M-*.png` review sheets and added east-cross-street crops
at **1× and exact nearest-neighbour 4×**. Inspected those crops, the full scene
and the comparison. Saved-art self-review: **PASS; failed review files: `[]`**.
The passing **2× detail remains byte-identical**, using `(336,144)–(912,672)`;
the comparison retains the unchanged fantasy panel and proposed-city origin
**(1224,36)**. The pixel audit also checks silhouette clearance and visibility.

**No file in `out/` changed, including `city15/compose.py`.** Earlier notes,
passing artwork and the independent `critic-r15M-1` evidence are preserved.
No commit, push or branch change.

---

# Round 15 — Part M

Made a **review-only fantasy city district**, built from the approved round 15
modules at their exact native size. **No file in `out/` changed, including
`city15/compose.py`.** The scene has **48 buildings**, widths **1–3 cells**,
with **24 two-storey / 16 three-storey / 6 four-storey / 2 five-storey** stacks.
There are **29 front-row and 19 rear-row buildings**. Continuous frontages,
rear roof masses, a north curtain wall and a fully paved market replace the
detached cottages and lawns in today's render.

**Files:**

| Review | Size | Scale |
|---|---|---|
| `review/r15-city-mockup.png` | **1200×912** | Native **48 px cells**, 25×19 cells |
| `review/r15-city-mockup-detail-2x.png` | **1152×1056** | Exact 2× of `(336,144)–(912,672)` |
| `review/r15-city-mockup-vs-today.png` | **2424×1048** | Both scenes at 48 px cells |

The comparison retains the complete **600×500** fantasy panel from
`review/city-view-towns-2026-11-16.png`, cropped at `(0,0)–(600,500)` and
enlarged exactly **2× nearest-neighbour**: its screenshot cells are 24 px.
The proposed district is placed beside it unchanged at **1×**. Coordinates
are zero-based; right and bottom bounds are exclusive.

**Assembly method:** imported the unchanged `city15/compose.py` and used
`build(spec)` for every building. All **82 used city PNGs** are composited
without resampling, recolouring or pixel edits. Floors advance exactly
48 px; each frontage foot lies on a 48 px street line; neighbours advance
by their exact lot width. The compositor's tested **3 px wall-end reveal**
retains windows and complete course rows. Seven street-corner stacks replace
their one-cell panels with the existing corner ground/storeys, retaining
the native roof and right-hand side return. The recipe includes **36 chimney,
17 dormer, 6 sign and 25 flowerbox placements**; some are naturally occluded
in rear rows or by the bottom camera crop.

Every standing object, including people and market props, shares one
back-to-front sort by its foot. All **19 rear-row feet are fully occluded**
by front architecture. Rear roofs and upper walls remain visible where the
front skyline drops, making solid blocks. The north frontage meets y=336;
the west market frontage meets y=672; the east block steps back at y=624.
The east lane shifts one cell right toward the foreground. The **480×336**
flagstone square occupies `(384,336)–(864,672)`. Seven stalls form unequal
groups around a well, **two trees**, and **25 townsfolk placements**. Eighteen
stock prop placements include the stalls, well, trees, bench, barrel, crates,
handcart and lamps. There is **no lawn or grass in the district**.

**Fantasy pack:** decoded the data-URL sheets read by
`git show origin/claude/project-thread-g8wuu1:packages/server/src/assets/overworld-art/fantasy.json`.
Source rectangles use the pack's **48 px cell coordinates**. The **288×288**
`street` and `square` drawings tile at 1× with a continuous global phase;
their pieces are neither shrunk nor randomized. `town_ground` was inspected
and has repeat proofs, but its grass is deliberately not placed in the city.
The well, stalls, trees and additional market props come from that same pack.
The exact pack hash, source ref and placements are in `r15-M-layout.json`.

**Missing folk and review-only drawings:** this pack has **no `folk` entry**;
the current town renderer falls back to the blue markers visible in today's
panel. Four small townsfolk and the curtain wall were therefore drawn only
for this picture, with **four large built-in image-tool drawings on solid
magenta**: two wall alternatives and two four-person sheets. Selected
**wall A / folk B**. A's irregular ashlar better matches the existing material
detail than B's very regular courses; B's people have clearer clothing and
silhouettes at native size. No new game asset was installed.

Magenta key → painted-bounds BOX registration at **8×** → the existing
**58-colour city palette**, without dithering → exact RGBA mode of **all 64
samples per 8×8 block**, including transparency, with lexicographic ties →
one-pixel exposed-contour cleanup using adjacent drawn colours. Wall canvases
are **288×96**; each person has a **20×34** canvas with a 32 px painted height.
The selected wall uses **21 opaque colours**; selected people use **21 / 23 /
24 / 30**, with **352 / 349 / 352 / 356 opaque pixels**. Hard alpha is **0/255**,
RGB under transparency is zero, and each is one connected silhouette.
There are **1,298 recorded cleanup edits** across the selected five drawings,
**2,533** across both alternatives. No silhouette pixels were added. The
wall repeats a native **252×96 crop**, x=18..269, to join inside merlons instead
of doubling the source's outside borders. Code registers, reduces, cleans,
crops, repeats and composites drawings; it constructs no architecture,
people, paving or surface noise from code shapes.

Original drawings, exact prompts, registered/mode/clean stages, palette and
cleanup records remain under **`review/r15-M-*`**. The new wall and folk are
review ingredients only; the deliverables are the three scene pictures.

**QC and critic self-review:** inspected the native district, exact 2× market
crop, same-scale comparison and enlarged course, corner, rear/front-depth,
wall and bent-lane crops. Replaced two pairs of adjacent identical shop
fronts with a workshop and doorway, and removed one almost-hidden pedestrian.
Final verdict: **PASS; failed review files: none (`[]`)**. Joined multistorey
frontages and roof masses read as a city; no floating foot, open neighbour
gap, displaced course or incorrect depth overlap was found. Building pixels
cover **53.097%** of the canvas before the wall is counted. The unequal blocks,
square and bent lane avoid a repeated street-plan stamp. Paving remains the
unchanged pack artwork. This is **saved-art self-review**, not an independent
critic verdict or an in-engine movement/collision test. No seasonal outputs
or seasonal silhouette changes belong to M.

**Review sheets:** **270 `r15-M-*.png` files**, including all three deliverables
at **1× and exact nearest-neighbour 4×**, every used building piece, each stock
prop over summer paving, both wall/folk alternatives, and detail inspections.
The three decoded ground bases have literal unlabelled **3×3 repeats** at
**864×864 / 3456×3456**. Start at **`review/r15-M-review.html`**. The native
source pieces are not scaled in the scene; enlargement is for proofs only.

**Verification:** **11,837 checks pass**, including **60,736 mode blocks /
3,887,104 samples**, recorded-cleanup replay, hard alpha, palette membership,
connected silhouettes, full saved-scene replay from original native pixels,
48 px lot/foot/course registration, all 19 rear-foot occlusions, **117 exact
1×/4× pairs**, 27 literal ground-repeat copies, the exact 2× crop and both
comparison placements. All **8,438 protected pre-existing files**, including
all of `out/`, are byte-identical. All earlier NOTES content follows unchanged.
The compositor's own read-only check also passes **129 assets / 108 wall-end
assemblies / 120 sign mounts**.

Reproduce with `python -B art-drop/review/r15-M-build.py --full`; audit with
`python -B art-drop/review/r15-M-verify.py` (Python and Pillow). Results and
measurements: **`r15-M-validation.json`**; critic criteria and source caveats:
**`r15-M-critic.json`**. Only Part M review material and this top NOTES section
were added. **No commit, push or branch change.**

---

# Round 16 — Part E

Made **14 transparent 24×24 RGBA PNGs in `out/weather16/`**:
`icon-clear-day.png`, `icon-clear-night.png`, `icon-cloudy.png`,
`icon-overcast.png`, `icon-rain.png`, `icon-heavy_rain.png`,
`icon-storm.png`, `icon-snow.png`, `icon-blizzard.png`, `icon-fog.png`,
`icon-wind.png`, `icon-hail.png`, `icon-sandstorm.png` and `icon-heat_wave.png`.
These are small corner-badge symbols on the native square pixel grid, with
upper-left light and a one-pixel dark navy **(32,41,54)** outline.

**Drawing method:** **20 separate large built-in image-tool drawings on solid
magenta**. Cloudy, overcast and blizzard each have two alternatives; sandstorm
has three. Heat wave has two completed alternatives; two earlier thermometer
requests returned no image. Selected **cloudy B / overcast B / blizzard B /
sandstorm C / heat wave D**, and **A** for the other nine icons. All twenty
original drawings are retained as **`review/r16-E-source-*.png`**, with the
exact prompt set and request outcomes in **`r16-E-generation.json`**.
No API fallback was used.

Magenta is keyed, painted bounds are BOX-registered onto **192×192** working
canvases, and explicit neutral, blue, gold and ochre palettes are locked without
dithering. Each final pixel is the exact RGBA mode of **all 64 samples in its
8×8 block**, including transparent samples; ties use lexicographic RGBA order.
Most sources are aspect-fitted within **22×22 native pixels**, leaving at least
one clear pixel at every canvas edge. The selected heat drawing registers its
already-painted wave group and base bar separately: waves occupy **(2,1)–(22,19)**
and the bar **(1,20)–(23,23)**. This retains a coloured centre in the narrow bar
after outlining. Coordinates are zero-based, right/bottom exclusive.

Native cleanup recolours exposed contours to the one-pixel dark edge and thins
heavy source strokes using adjacent drawn shades. There are **267 recorded
mode-to-final colour edits** across the selected fourteen, **455 across all
alternatives**; selected alpha masks require **zero edits**. No icon shapes,
weather marks, decorative geometry or noise were constructed in code. Code only
registers, reduces, palette-locks, cleans and composites the drawings. Every
output has hard **0/255 alpha**, **zero RGB under transparency**, and **3–6
opaque colours**. Registered, mode and clean stages remain in the review folder.

**Native-size selection and QC:** rain has two short blue ticks below a pale
cloud; heavy rain has four long streaks below a dark cloud. Snow has two white
cross flakes, blizzard a branching crystal with horizontal speed streaks, and
hail three squared ice pellets. Cloudy retains a visible gold sun; overcast has
two layered grey clouds. Fog has still, square-ended horizontal banks; wind has
open right-hand hooks. Clear day is an eight-ray sun; heat wave is three upright
gold ripples above a warm base bar. Sandstorm has a substantial ochre dust bank
with three leftward trails.

The first native review rejected cloudy A’s disappearing ray, overcast A’s
peak-like profile, sandstorm A’s wave-like curl and B’s dark-only thin trails,
and heat wave C’s hanging silhouette. Selected redraws resolve those problems.
Blizzard B keeps a clearer crystal than A’s curls at 1×. The final native rows
were visually reviewed on dark and light panels at **1×, 2× and exact
nearest-neighbour 4×**, including actual **75% panels over all seven existing
reference crops**: grass, forest, town, city, wasteland, sand and snow. Panel
composition uses `(3 × panel RGB + map RGB) / 4`, rounded to nearest byte;
dark panel RGB is **(10,12,20)**, light **(246,243,232)**. This is saved-art
self-review, not an independent critic verdict or observed in-engine playback.

**Measurements:** all canvases are 24×24; bounds are right/bottom exclusive.

| Icon | Painted bounds | Opaque pixels | Colours |
|---|---|---:|---:|
| clear-day | (1,1)–(23,23) | 285 | 4 |
| clear-night | (2,1)–(22,23) | 234 | 3 |
| cloudy | (1,2)–(23,21) | 241 | 4 |
| overcast | (1,5)–(23,18) | 215 | 4 |
| rain | (1,1)–(23,23) | 286 | 6 |
| heavy_rain | (1,1)–(23,23) | 296 | 6 |
| storm | (1,1)–(23,23) | 258 | 5 |
| snow | (3,1)–(20,23) | 199 | 4 |
| blizzard | (1,4)–(23,19) | 176 | 3 |
| fog | (1,4)–(23,19) | 229 | 4 |
| wind | (1,2)–(23,21) | 215 | 3 |
| hail | (3,1)–(20,23) | 192 | 5 |
| sandstorm | (1,3)–(23,20) | 283 | 4 |
| heat_wave | (1,1)–(23,23) | 281 | 4 |

**Review material:** start at **`review/r16-E-review.html`**. The fourteen
**`r16-E-file-icon-*.png`** sheets show every icon at 1× and 4× on both panel
colours. **`r16-E-row-{dark,light}-{1,2,4}x.png`** supplies six literal row
proofs; **`r16-E-context-*-{1,2,4}x.png`** supplies all seven map contexts.
**`r16-E-overview.png`** and **`r16-E-selection.png`** show the set and drawing
alternatives. Part E contains no ground bases, props, trees or seasonal partners,
so 3×3 ground repeats and seasonal silhouette comparisons do not apply.

**Verification:** the saved-pixel audit replays all twenty source registrations,
**11,520 exact mode blocks / 737,280 samples**, recorded cleanup, output sizes,
palettes, alpha, clear margins, connected groups, outline colour, file hashes,
all 1×/4× individual placements and exact 2×/4× row/context enlargements.
It also checks all **8,291 protected pre-existing files** and preserves the
complete earlier NOTES content. Results: **`r16-E-validation.json`**;
measurements: **`r16-E-measurements.json`**. Reproduce with
**`r16-E-build.py`**, then **`r16-E-verify.py`** (Python and Pillow).

Only the fourteen named Part E output PNGs, **`review/r16-E-*`** material and
established **`NOTES.md`** were changed or added. No commit, push or branch change.

---

# Round 16 — Part D: critic-r16D-1 redraw

Replaced all **11 failed files**: the three `lightning-*-f2.png` afterglows
and eight `wind-*-f0/f3.png` endpoints. **All 15 passing PNGs, including the
flash and middle wind frames, are byte-identical.** No seasonal partners apply.

Drew **17 large built-in image-tool edits on solid magenta**: three alternatives
per bolt and two per gust. Selected bolt **0C / 1C / 2C**, wind **0A / 1A / 2B /
3B**. Exact prompts and originals: `review/r16-D-redraw1-generation.json` and
`r16-D-redraw1-source-*.png`. The thin A/B bolt trials fragmented on reduction;
C retains connected strokes. No API fallback or code-drawn shapes/noise.

Same method: magenta key → BOX registration at 8× → fixed palette → exact
64-sample RGBA mode → source-supported gap/outline cleanup. Each restored
cell has at least eight painted source samples; joins span at most two cells.
Final sprites have hard **0/255 alpha** and **zero RGB under transparency**.
Afterglows now use a thinner pale low-saturation stroke (262 / 277 / 200
pixels), preserving the bends/forks. Wind endpoints contain only **9–16
connected pixels**. Fade comes from reduced painted mass, not navy darkening.

Regenerated the Part D sheets and **13 GIFs**. Wind loops contain exactly
**four 140 ms frames**, at a fixed origin, without a blank pause. Their closing
image change falls **87.5–92.7%**. Afterglow contrast falls from f1 over grass,
sand, snow, town and city. Reviewed native/enlarged sprites, all seven map
contexts and decoded cloud/city/town/grass GIF phases. This is saved-art
self-review, not a new independent critic verdict or in-engine playback.

**522/522 checks pass**; **7,988 protected files** are byte-identical.
The audit replays **172,800 exact mode blocks / 11,059,200 samples**.

Start at `review/r16-D-review.html`. Reproduce with
`r16-D-redraw1-build.py --export`, then `r16-D-redraw1-review.py`; verify with
`r16-D-redraw1-verify.py`. Audit: `r16-D-redraw1-validation.json`. Earlier
sources and notes remain historical records. No commit, push or branch change.

---

# Round 16 — Part D

Made **26 transparent RGBA PNGs in `out/weather16/`**:
**`lightning-0..2-f0..f2.png`** (nine **48×144** frames),
**`lightning-flash.png`** (**192×192**), and
**`wind-0..3-f0..f3.png`** (sixteen **144×48** frames).
These are sparse, setting-neutral effect sprites at the existing native pixel
scale. There are no ground bases or seasonal partners in Part D.

**Drawing method:** **ten separate large built-in image-tool drawings on
solid magenta**: four bolt sources, five four-phase gust sheets, and one
six-tone radial flash mask. The difficult forked bolt and coiling gust each
have two variants. Selected **bolt 0A / 1A / 2B**, **wind 0A / 1A / 2A / 3B**,
and **flash A**. Bolt 2A spreads too far horizontally for the narrow canvas;
2B preserves a tall strike with two descending forks. Wind 3A is too close
to the simple hook; 3B retains a small inward coil. The other gusts are an
upward hook, an unequal double curl, and a rising shallow sweep. Sources are
**`review/r16-D-source-*.png`**; exact prompts are in
**`review/r16-D-generation.json`**. No API fallback was used.

Magenta is keyed, then each source is BOX-registered to **8W×8H**, locked to
a fixed palette, and reduced by the exact RGBA mode of **all 64 samples in
every 8×8 block**, including transparent samples. Ties use lexicographic
RGBA order. Bolts use their painted bounds, registered to a 136-pixel-high
working placement with width capped at 40 pixels. The gust sheets retain
their complete four-row coordinate system at **144×192**, then split into
four **144×48** cells. The drawn flash is registered to **176×176**, leaving
eight clear pixels on each side. All mode and registered stages remain in
the review directory.

Native cleanup restricts the darkest drawn contour to the one-pixel
perimeter, removes detached remnants and restores source-supported
one-pixel joins. Each restored pixel connects two existing drawn components
and has at least **8 of 64 opaque source samples**; its colour comes from
those samples. The eight selected sources have **87 mode-to-clean edits**,
including **32 documented joins**. Across all ten alternatives there are
**116 edits / 44 joins**. No bolt paths, gust curls, flash rings, surface
shapes or noise were constructed in code.

**Animation and alpha:** all nine bolt frames and sixteen gust frames have
strict **0/255 alpha**, with **RGB (0,0,0)** under transparency. Each bolt's
three full alpha channels are **byte-identical**. Its four-colour white,
ice-blue and violet palette becomes dimmer in f1 and darker blue-violet in
f2; every visible RGB channel decreases at each step. Shapes never change.
The four gust phases are separately drawn stages of the same gust, moving
east. After the f1 peak, their drawn coverage and luminance both decrease;
the late phase fades through shorter/thinner drawing and a dimmer palette,
while retaining hard alpha. The top-left whites and lower/right grey edges
come from the source drawings. No interpolated animation frames are added.

The flash is the brief's discrete-alpha-ring exception: six drawn tonal
zones map to pale **(228,234,255)** with alpha **8 / 16 / 28 / 44 / 64 / 88**,
plus transparent zero. There is no smooth alpha ramp, airbrush, procedural
radial gradient or generated dither. The working mask has hard 0/255 alpha.
The final glow covers **23,725 pixels / 64.3582%** of its canvas, but only
**5.8893% alpha-weighted cover**. Mean alpha decreases outward through six
measured radial bands, and its painted bounds are **(8,8)–(184,184)**.

**Measurements:** bounds are zero-based, right/bottom exclusive. Bolt
measurements apply to all three frames; each bolt has one connected channel.
Luminance is the mean visible RGB luminance, on a 0–255 scale.

| Bolt | Painted bounds | Covered pixels | Cover | Luminance f0 / f1 / f2 |
|---|---|---:|---:|---|
| 0 | (7,8)–(40,136) | 523 | 7.5666% | 233.017 / 166.609 / 95.710 |
| 1 | (6,6)–(43,136) | 434 | 6.2789% | 238.153 / 172.076 / 99.330 |
| 2 | (13,4)–(34,140) | 474 | 6.8576% | 217.278 / 156.635 / 91.373 |

| Gust | Covered pixels f0 / f1 / f2 / f3 | Cover % f0 / f1 / f2 / f3 | Horizontal centroid f0 → f3 |
|---|---|---|---|
| 0 | 172 / 316 / 204 / 80 | 2.4884 / 4.5718 / 2.9514 / 1.1574 | 37.041 → 116.237 |
| 1 | 99 / 252 / 165 / 57 | 1.4323 / 3.6458 / 2.3872 / 0.8247 | 28.051 → 120.789 |
| 2 | 74 / 161 / 132 / 50 | 1.0706 / 2.3293 / 1.9097 / 0.7234 | 25.730 → 122.880 |
| 3 | 140 / 212 / 206 / 77 | 2.0255 / 3.0671 / 2.9803 / 1.1140 | 33.686 → 110.740 |

**Review and QC:** every file has a **1× + exact nearest-neighbour 4×** sheet,
**`review/r16-D-file-<filename>.png`**. Start at **`r16-D-review.html`** or
**`r16-D-overview-1x.png`**; the overview has an exact 4× partner. All 26
files have native placements over all seven existing reference crops
(**182 placements**), in **`r16-D-context-*-all-1x.png`**, plus seven compact
peak-frame context sheets. Roads, towns and ground remain readable. White
strokes are intentionally subtler on snowy ground than over grass or slate.
The native and enlarged reviews caught broken tips in the first reduction;
the recorded source-supported joins fix those without drawing new paths.
No isolated one-to-four-pixel alpha fragments remain in the final sprites.

**Thirteen GIFs** show each bolt over an approved dark cloud on a slate
backdrop, over the city, and over the fantasy town (**nine GIFs**), and each
gust alone over a clear grass crop (**four GIFs**). Clouds are composited
over the bolt origin so each strike meets its cloud base. Bolt phases last
**80 / 120 / 180 ms**, with a clear lead-in and pause; only f0 includes the
flash. Gust phases last **140 ms each**, followed by a **420 ms** clear pause.
These preview single spawned events, not seamless falling-weather loops.
Each GIF has native and 4× phase strips; decoded-GIF contact sheets verify
the actual encoded frames. GIF timing and frame correspondence are checked
automatically. This is saved-art self-review of frames and decoded GIF
sequences, not an independent critic verdict or observed in-engine playback.

**Verification:** **592 / 592 checks pass**, replaying registration from all
ten originals, **202,752 exact mode blocks / 12,976,128 source samples**,
cleanup and source support, all 26 sizes/palettes/alpha sets/hashes, identical
bolt masks, monotonic gust movement and fade, flash falloff, proof scaling,
GIF frames/timing and every reference placement. **7,958 pre-existing art
files are byte-identical**, and all earlier NOTES content is preserved.
Measurements and audit: **`r16-D-measurements.json`** and
**`r16-D-validation.json`**. Reproduction: **`r16-D-build.py`** and
**`r16-D-verify.py`**, using Python and Pillow.

Only the 26 named Part D outputs, **`review/r16-D-*`** material and this top
NOTES section were added. Literal 3×3 ground repeats do not apply because
Part D contains no ground bases. No commit, push or branch change.

---

# Round 16 — Part C

Made **18 transparent RGBA PNGs in `out/weather16/`**:
**`cloud-light-0..5.png`**, **`cloud-dark-0..5.png`**, and
**`cloud-shadow-0..5.png`**. Numbers **0–1 are 96×96**, **2–3 are 144×96**,
and **4–5 are 192×144**. These are loose sprites at the existing native pixel
scale, with top-left light. No ground base or seasonal partner belongs to C.

**Drawing method:** **eight separate large built-in image-tool drawings on
solid magenta**, selecting **0A / 1A / 2A / 3B / 4A / 5B**. The harder broken
formations, 3 and 5, each have two drawings. 3B retains a wide diagonal clear
channel between two substantial puff groups; 5B has a branching diagonal mass
and two separate cloud islands. 5A's conspicuous open arch was rejected.
The other shapes are compact/round, hooked, long, and broad/lobed. Each source
was drawn independently; no cloud is a transformed copy of another. Exact
prompts are in **`review/r16-C-generation.json`** and source PNG metadata;
all eight originals remain as **`r16-C-source-*.png`**. A failed connection
on the first 5A request was retried with the same prompt.

Magenta is keyed, the painted bounds are cropped and aspect-registered with
BOX sampling onto an **8W×8H** canvas, then locked to a fixed six-colour
white/blue-grey palette without dithering. Every native pixel is the exact
RGBA mode of **all 64 samples in its 8×8 block**, including transparent
samples; ties use lexicographic RGBA order. The source's darkest contour
colour is restricted to the one-pixel perimeter, and isolated one/two-pixel
colour grains merge into neighbouring drawn shades. The selected six record
**443 mode-to-final colour changes** (**709 across all eight alternatives**).
No alpha/silhouette pixels changed during cleanup. No cloud shapes, puff
texture, shadows or noise were constructed from geometric primitives.

Working registered, mode and clean stages have hard **0/255 alpha**. The
weather brief's translucency is applied only at export: every visible pixel
in **all 18 final files** has alpha **192/255 = 75.2941%**. Every light/dark/
shadow trio therefore has **byte-for-byte identical full alpha channels**,
not just equivalent nonzero masks. The storm version is a six-entry palette
mapping of the same drawn puff shading, from a lighter blue-grey top-left
rim/cap to a near-black lower-right contour. Shadows have exactly one RGB
colour, **(27,36,46)**. All transparent pixels have **RGB (0,0,0)**; there is
no feathering, fractional edge alpha, blur or magenta fringe.

**Measurements:** zero-based bounds, right/bottom exclusive. Values apply to
all three partners. Cover counts every nontransparent pixel against the
whole canvas; visible opacity is uniformly 75.2941%. All sides retain at
least four clear pixels. Separate components in 3 and 5 are intentional
substantial puff groups, never specks.

| Number | Canvas | Painted bounds | Covered pixels | Cover | Connected groups |
|---|---|---|---:|---:|---:|
| 0 | 96×96 | (4,8)–(92,87) | 5,004 | 54.2969% | 1 |
| 1 | 96×96 | (10,5)–(86,91) | 3,330 | 36.1328% | 1 |
| 2 | 144×96 | (5,18)–(139,77) | 4,248 | 30.7292% | 1 |
| 3 | 144×96 | (6,7)–(137,89) | 5,495 | 39.7497% | 2 |
| 4 | 192×144 | (8,7)–(184,137) | 16,323 | 59.0386% | 1 |
| 5 | 192×144 | (6,7)–(186,137) | 12,479 | 45.1353% | 3 |

**Context review:** six **864×672** skies show **12 cloud sprites each**:
light, dark and mixed skies over both the town and city. Each uses all six
shapes twice at native scale, with no rotation or reflection. The backdrops
are unscaled crops of the existing renders: fantasy **(288,96)–(1152,768)**,
modern **(288,48)–(1152,720)**. Shadow copies are composited first, offset
**(+22,+18)**, with their visible alpha replaced by **56** (equivalent to
multiplying the exported shadow opacity by **56/192**). This fading and
offset happen only in review composition; the delivered shadow pixels retain
the exact cloud alpha. Clouds cover **16.1482%** of each sky, or **12.1587%**
alpha-weighted cover. Separate single-cloud context sheets also inspect both
colourways over all seven existing reference crops.

**QC:** visual self-review inspected all six silhouettes and both colourways
at native and enlarged sizes, town/city skies at **1× and 3×**, and every
reference context. The cloud tops read as clustered puffs with stepped
shading; town walls, buildings, roads and farmland show through faintly.
The broken groups keep open channels at 1×. A final colour-grain check caught
one isolated pixel in 5B; a second local cleanup pass merged it into adjacent
shading and all affected proofs were rebuilt. No detached alpha specks or
isolated one/two-pixel colour components remain in the selected sprites.
This is saved-art self-review, not an independent critic or in-engine test.

**Verification:** **490 / 490 checks pass**, replaying source registration and
palette locking, **142,848 exact mode blocks / 9,142,272 source samples**,
all recorded cleanup, storm palette transfer, flat shadows, 18 sizes,
coverage and hashes, full trio alpha equality, zero hidden RGB, clear margins,
all 84 single-cloud context placements, six 12-cloud scene composites and
exact nearest-neighbour proof scales. **7,820 pre-existing art/reference/
review files are byte-identical**; all earlier NOTES content is preserved.
Details and output hashes: **`r16-C-validation.json`** and
**`r16-C-measurements.json`**. Build and verification scripts use Python and
Pillow only: **`r16-C-build.py`** / **`r16-C-verify.py`**.

**Review material:** start at **`review/r16-C-review.html`** or
**`r16-C-overview-1x.png`**. Every final file has a **1× + exact 4×** sheet,
**`r16-C-file-cloud-<light|dark|shadow>-N.png`**. The overview has an exact
4× partner; **`r16-C-sky-<town|city>-<light|dark|mixed>-{1,3,4}x.png`**
supplies all six skies at three scales. **`r16-C-context-*-1x.png`** covers
all seven references; **`r16-C-selection.png`** compares all eight drawings.
Sources, registered/mode/clean stages, prompts, measurements and audit remain
under this part's review prefix. There are **no ground bases in Part C**, so
literal 3×3 ground repeats do not apply; the cloud sprites are not tiled.

Only the eighteen named Part C outputs, `review/r16-C-*` material and this
NOTES section were added. No commit, push or branch change.

---

# Round 16 — Part B: critic-r16B-3 redraw

Drew **three focused built-in image-tool alternatives on solid magenta**.
Selected B in unannotated native 3×3 grass/water repeats: shallow, quieter
layers and revised clear gaps replace the upper-left crest and lower-right
capped bank. A kept brighter accents; C introduced a more recognizable wavy
shelf. Sources/prompts: `review/r16-B-source-redraw3-fog-{a,b,c}.png` and
`review/r16-B-redraw3-generation.json`.

Same method: magenta key → 8× BOX registration → fixed palette → exact mode
of all 64 samples → one-pixel contour cleanup → low-error hard-cut composition.
Working alpha is 0/255; final fog is 0/24/48/80, with zero transparent RGB.
Code constructs no shapes or noise. Broad planes, boundary pixels and the
original small four-phase motion remain intact. Removed the north 3-pixel dash
and east 22-pixel column. **All four passing heat PNGs and the passing south/
west edges are byte-identical**; every edge still matches all four phases.

Occupied cover (alpha-weighted cover in parentheses):

| Assets | f0 / f1 / f2 / f3, or N / S / E / W |
|---|---|
| Fog | 45.3505 / 45.2582 / 45.2501 / 45.3342% (5.6003 / 5.5833 / 5.5784 / 5.5984%) |
| Heat | 1.6059% each (0.2682% each) |
| Edges | 24.2296 / 39.8112 / 37.2396 / 34.2882% (3.4783 / 4.1565 / 4.8550 / 4.0091%) |

Regenerated final-art sheets, **168 repeat proofs**, three GIF loops and seven
feathered area composites: `review/r16-B-review.html`. **383/383 checks pass**,
including 110,592 exact mode blocks, edge joins, PNG/GIF correspondence and
7,064 protected files unchanged. Reviewed all seven native reference fields
and enlarged repair/junction excerpts; roads and towns remain readable.
Fog transitions remain 0.2752–0.2821/255 mean alpha change, including closure.
GIFs are four frames at 360 ms each. Live/in-engine playback was not observed;
this is self-review, not an independent critic verdict. Reproduction/checks:
`review/r16-B-redraw3-{build.py,verify.py,validation.json}`. No commit, push or
branch change.

---

# Round 16 — Part B: critic-r16B-2 redraw

Redrew all four failed fog phases from **three new large built-in image-tool
alternatives on solid magenta**. Selected ten distinct broad bank drawings
from B/C, each used once per tile. Quiet overlapping planes and varied bank
lengths replace the small curls, bright tips and regularly spaced clear
pockets. A was too dense; B alone emphasized corner highlights; the mixed
field was selected in unannotated native 3×3 views over grass and water.
Sources and exact prompts: `review/r16-B-source-redraw2-fog-{a,b,c}.png` and
`review/r16-B-redraw2-generation.json`.

Same method: key → 8× BOX registration → source-calibrated palette lock →
exact mode of all 64 samples → one-pixel contour cleanup. Working alpha is
0/255; final fog uses **0/24/48/80**, with zero transparent RGB. No shapes or
noise were constructed in code. Three interior banks move one native pixel
per phase; all closing transitions are equally small. Changed boundary
drawings required rebuilding the four matching edges through the **unchanged
drawn feather masks**. Their inner three pixels match every phase and their
outermost pixels are clear. The passing heat PNGs are **byte-identical**.

Occupied cover (`alpha > 0`; alpha-weighted cover in parentheses):

| Files | f0 / f1 / f2 / f3, or N / S / E / W |
|---|---|
| Fog | 45.6353 / 45.5431 / 45.5349 / 45.6190% (5.8810 / 5.8640 / 5.8590 / 5.8791%) |
| Heat | 1.6059% each (0.2682% each) |
| Fog edges | 24.2622 / 39.8112 / 37.4783 / 34.2882% (3.4814 / 4.1565 / 4.8775 / 4.0091%) |

Regenerated final-art PNG sheets, 168 repeat proofs, all three GIF loops and
the seven feathered fog-area composites. Start at `review/r16-B-review.html`.
**431/431 checks pass**, including 93,652 exact native mode blocks, edge
joins, fixed alpha, no isolated 1/2-pixel components, GIF/PNG correspondence
and **6,981 protected files unchanged**. Validation and reproducible scripts:
`review/r16-B-redraw2-{validation.json,build.py,verify.py}`. Native fields and
area boundaries were visually reviewed across all seven references; roads
and towns remain readable. The browser access host was unavailable, so live
GIF playback and in-engine playback were not tested. This is self-review,
not a new independent critic verdict. No commit, push or branch change.

---

# Round 16 — Part B: critic-r16B-1 redraw

Redrew all four failed **fog frames** with **three new large built-in image-tool
atlases on solid magenta**. Compared A, B, C and a mixed field in literal 3×3
repeats; selected **25 distinct drawings**, each used once per tile. Shorter,
less directional banks and quieter patch highlights replace the conspicuous
hooked crests, lower comb and diagonal clear lanes. Prompts and alternatives:
`review/r16-B-redraw1-generation.json`, `r16-B-source-redraw1-fog-{a,b,c}.png`
and `r16-B-redraw1-candidate-*.png`.

Same method: magenta key → **8× BOX registration** → four-colour palette lock →
exact RGBA mode of **all 64 samples** → native component/one-pixel contour
cleanup. All 36 donors have hard 0/255 working alpha; final fog retains
**0/24/48/80/112**, square pixels and zero transparent RGB. No shapes or noise
were constructed in code. The redraw changes the boundary pattern, so the
**four fog edges were rebuilt as matching continuations**, as the critic
requested, through the **unchanged image-drawn feather masks**. A four-pixel
tile-origin adjustment avoids tiny cut fragments at the inner joins. The
passing **four heat-wave PNGs are byte-identical**.

Occupied cover (`alpha > 0`; alpha-weighted cover in parentheses):

| Files | f0 / f1 / f2 / f3, or N / S / E / W |
|---|---|
| Fog frames | 44.9382 / 44.6723 / 44.5584 / 44.8622% (5.8484 / 5.8208 / 5.8037 / 5.8374%) |
| Heat frames | 1.6059% each (0.2682% each) |
| Fog edges N/S/E/W | 32.6714 / 30.3928 / 32.1832 / 36.5017% (3.7606 / 3.8909 / 3.9638 / 4.4118%) |

**590/590 checks pass**: 62,850 exact native mode blocks, fixed alpha/palette,
no hidden RGB or isolated 1/2-pixel components, independent wrapped rendering,
all edge joins across all four phases, clear outer edges, 168 exact repeat
proofs, and GIF-to-PNG correspondence. Animated banks move one native pixel
per phase in a closed cycle; mean alpha changes are **1.8581–2.2611/255**,
including f3→f0. GIFs retain four frames at **360 ms/frame**. Reviewed native
fields across all seven references and enlarged joins; towns and roads remain
readable. The rebuilt area feathers into clear map without a square perimeter.
**6,902 protected files are byte-identical**. Validation:
`review/r16-B-redraw1-validation.json`; build/replay scripts:
`r16-B-redraw1-build.py --final` and `r16-B-redraw1-verify.py`.

Regenerated `review/r16-B-*.png` final-art sheets, all three GIFs, the seven
fog-area composites and `r16-B-review.html`. Before/after:
`r16-B-redraw1-comparison.png`. Historical source/processing sheets are retained.
Live perceived GIF playback and in-engine playback were not tested; this is
self-review, not a new independent critic verdict. No commit, push, branch
change, or changes outside `art-drop/`.

---

# Round 16 — Part B

Made only **12 transparent PNGs in `out/weather16/`**: **`fog-f0..f3.png`**
and **`heat_wave-f0..f3.png`**, each **192×192**; **`fog-edge-n.png`** and
**`fog-edge-s.png`**, each **192×48**; **`fog-edge-e.png`** and
**`fog-edge-w.png`**, each **48×192**. The seven existing **288×288 / 48 px
per cell** references and all Part A frames are unchanged. No ground base,
prop, seasonal partner, engine code or other art part was changed.

**Drawing method:** **six separate large built-in image-tool drawings on
solid magenta**: two fog-bank atlases, two heat-shimmer atlases and two
four-strip fog-edge mask atlases. Selected **fog B / heat A / edge B**.
Fog B has lower, more open interleaved strata; heat A has less regular
kinks than B; edge B has long shallow fingers instead of A's deeper lobes.
The edge feathering itself is drawn, not a procedural gradient.
Exact prompts: **`review/r16-B-generation.json`** and the source PNG metadata.
All six source paintings and both alternatives at native scale are retained
as **`r16-B-source-*.png`** / **`r16-B-selection.png`**.

Magenta is keyed, each drawing is cropped to its painted bounds, then
BOX-registered to **8W×8H**. Edge crops also retain the source's clear outer
margin. Fixed palettes are locked without dithering before taking the exact
RGBA mode of **all 64 samples per 8×8 block**, including transparent samples;
ties use lexicographic RGBA order. The 36 processed alternative pieces remove
**37 detached native pixels**. Six selected fog donors receive **2,358 colour
changes on their one-pixel outer contours**, to the quiet blue-grey edge
colour; no silhouette pixels are added. Their interior top-left highlights
remain drawn. Selected fog banks are **104–144 px wide / 28–35 px tall**.
Eight selected heat drawings are **48–83 px wide / 3–4 px bounding height**,
with predominantly one-pixel strokes. No outlines, bands, bank shapes, terrain
or noise are constructed in code.

Working drawings have hard **0/255 alpha**. As required for weather, final
fog uses only **0 / 24 / 48 / 80 / 112** alpha, and heat only
**0 / 24 / 40 / 56**. Fog has four pale blue-grey/grey-white RGB colours;
heat has three pale straw/ivory colours. Overlap selects an existing drawn
sample by opacity priority, never an interpolated colour or alpha. All PNGs
have **zero RGB under transparency**. Code only registers, reduces,
palette-locks, cleans, places, moves, wraps and composites the drawings.

**Spatial joins and motion:** ten placed fog banks use six different drawings;
four interior banks move through the closed offsets **(0,0), (1,0), (1,1),
(0,1)**, with staggered phases. The other six hold the boundary pattern steady
so the single-state edge PNGs match **all four** fog frames. Fourteen heat
bands use the eight selected drawings and the same one-pixel cycle, with
staggered phases and reversed directions. Every transition, including
**f3→f0**, moves each animated donor exactly **one native pixel**. There is
no reseed, teleport or crossfade. The computed fifth state equals f0 exactly.
The GIFs use **360 ms/frame**, a **1.44 s** cycle. Mean absolute per-pixel
alpha changes are **1.7250–1.8819 / 255** for fog and **0.7852–0.8368 / 255**
for heat; the loop-boundary step is comparable to the other steps.

The first placement review caught broad, regular clear lanes. A deterministic
placement-only search redistributed the same painted banks, keeping large
map-readable gaps and removing the lanes. It generates positions only, not
pixel texture. Final placements are recorded in **`r16-B-layout.json`** and
**`r16-B-measurements.json`**. Every bank that crosses a tile boundary wraps
on the **192×192 torus**; an independent unwrapped rendering matches every
literal 3×3 repeat. Neither family has an exact shorter horizontal or vertical
subperiod.

**Fog-bank edges:** four individually drawn mask strips are mode-reduced to
**224×48**, then tile-wrapped to **192×48** by a minimum-error hard cut in a
32 px overlap. Every retained mask sample comes from the drawing. Their grey
steps become discrete opacity caps **0 / 24 / 48 / 80 / 112 / 255**, applied
to continuations of the fog pattern; mask grey is never rendered as dark fog.
North/south masks are oriented vertically and east/west transposed. The
inner **three pixels** preserve the pattern exactly for every phase. The
outermost row/column is completely clear. Final cap intersections remove
**five isolated native pixels** (one north, four west), away from the joins.
No airbrush, blur, fractional alpha ramp or straight opaque perimeter remains.

For a fog core starting at **(0,0)**, place N at **(0,−48)**, S at **(0,H)**,
W at **(−48,0)** and E at **(W,0)**; repeat each strip every 192 px along its
side. Keep tile phases aligned. The area proofs use a literal **2×2 fog core**,
the four delivered edge PNGs and a clear map margin. Each 48×48 corner is the
**lower-alpha intersection of matching end crops of the two adjacent edge
PNGs**, using their same RGB pattern. This needs no extra corner asset and
avoids both a square cutoff and doubled corner opacity.

**Measured cover:** every alpha>0 pixel counts, against **36,864** for frames
or **9,216** for edges. Weighted cover is sum(alpha)/(255×pixel count).

| File | Covered pixels | Cover | Alpha-weighted cover |
|---|---:|---:|---:|
| `fog-f0.png` | 16,908 | 45.8659% | 9.7173% |
| `fog-f1.png` | 16,853 | 45.7167% | 9.7025% |
| `fog-f2.png` | 16,816 | 45.6163% | 9.6981% |
| `fog-f3.png` | 16,879 | 45.7872% | 9.7234% |
| `heat_wave-f0.png` | 592 | 1.6059% | 0.2682% |
| `heat_wave-f1.png` | 592 | 1.6059% | 0.2682% |
| `heat_wave-f2.png` | 592 | 1.6059% | 0.2682% |
| `heat_wave-f3.png` | 592 | 1.6059% | 0.2682% |
| `fog-edge-n.png` | 3,034 | 32.9210% | 5.6110% |
| `fog-edge-s.png` | 2,842 | 30.8377% | 5.3196% |
| `fog-edge-e.png` | 2,269 | 24.6202% | 4.0540% |
| `fog-edge-w.png` | 1,965 | 21.3216% | 3.7881% |

**QC:** two visual self-review passes inspected native and enlarged drawings,
all seven reference contexts, repeated fields, individual edge strips and the
bank-area compositions. Town silhouettes, roads, forest detail and desert
landmarks remain readable. Fog is layered pixel clusters with clear gaps;
heat is barely visible warm linework, not a full-map tint. The revised fog
placement avoids the first layout's clear lanes. Pixel boundaries stay square,
with no magenta fringe, isolated 1/2-pixel components or antialias blur.

**Verification:** **482 / 482 checks pass**, including **137,256 exact native
mode blocks / 8,784,384 source samples**, cleanup replay, all twelve sizes,
fixed palettes/alpha, zero hidden RGB, four distinct phases per family,
closed one-pixel motion, independent spatial repeat rendering, all edge joins,
clear outer edges, exact 1×/3×/4× proofs and GIF-to-PNG phase correspondence.
**6,858 pre-existing art/reference/review files are byte-identical**. Complete
checks, per-file measurements and final SHA-256 hashes are retained in
**`review/r16-B-validation.json`** / **`r16-B-measurements.json`**.

**Review material:** start at **`review/r16-B-review.html`**. The three loops
are **`r16-B-fog.gif`**, **`r16-B-heat_wave.gif`** and **`r16-B-fog-area.gif`**.
Every final PNG has a **1× + exact nearest-neighbour 4×** sheet,
**`r16-B-file-*.png`**. **168 literal 3×3 repeat proofs** cover both families,
all four phases and all seven references at **1× / 3× / 4×**:
**`r16-B-repeat-<family>-fN-<reference>-{1,3,4}x.png`**. Seven fog-area
compositions each have **1× / 4×** versions. No new ground base is part of B.
The reference crops repeat at 288 px, independently of the weather's 192 px
period; reference road/crop boundaries are not weather seams. GIFs use a
shared 256-colour review palette; the PNGs are authoritative for colour/alpha.
Source drawings, prompts, selected alternatives, registered/mode/clean stages,
filmstrips, measurements and **`r16-B-build.py` / `r16-B-verify.py`** remain
under this part's review prefix. The scripts use Python with Pillow and NumPy.

**Playback limitation:** the browser access host is unavailable. Actual GIF
frames, timing and mathematical continuity were verified, but live perceived
motion could not be observed. This is self-review, not an independent critic
verdict or an in-engine test.

No commit, push or branch change. All changes are inside `art-drop/`, limited
to the twelve named Part B outputs, `review/r16-B-*` and this NOTES section.

---

# Round 16 — Part A: critic-r16A-2 redraw

Repaired the **eight failed snow/sandstorm frames**. The **16 passing weather
PNGs and seven references are byte-identical**; 1,906 other art/reference files
are preserved. Replayed all reference crops/compositions: measured **48 px/cell**,
288×288, with the same native desert and winter donors.

**Snow:** retained all six original flake drawings and their palette. Replaced
long bending tracks with **82 independently placed shorter paths**, only 8–10
flakes per path. Broad density is balanced across all phases: every wrapped
32 px column has **7.68–8.84%** cover, versus the critic's **4.72–13.01%**.
Native repeat review no longer shows the curved strings or alternating curtains.

**Sandstorm:** drew **three new built-in image-tool variants on solid magenta**.
Selected **C cells 0–7 plus B cells 3/6**: ten distinct thin filaments, hollow
swirls and broken patches, **16–76 px wide / 4–16 px tall**. These replace the
similar peaked crests. Key → 8× BOX registration → existing golden palette →
exact 64-sample RGBA mode → detached-pixel cleanup. Working alpha is 0/255;
final alpha uses fixed levels, with zero transparent RGB. All shapes come from
the drawings; code only processes and places them. Prompts and comparisons:
`review/r16-A-redraw2-generation.json`, `r16-A-source-redraw2-sand-{a,b,c}.png`,
`r16-A-selection.png`.

**Motion:** right/down positive; snow moves **dx −2…2, dy 1…8 px/frame**;
sandstorm moves **dx 16…32, dy −3…3**, with only two bands per closed path.
Other motion remains unchanged. Exact per-step offsets are recorded in
`r16-A-measurements.json` → `weather` → `groups[*].steps`. All particles wrap;
four advances permute the same particles and the fifth state equals f0 exactly.
GIF timing remains 160 ms for snow and 110 ms for the other sets.

**Measured occupied cover per file** (`alpha > 0`, out of 36,864 pixels):

| Family (`-fN.png`) | f0 | f1 | f2 | f3 |
|---|---:|---:|---:|---:|
| rain | 8.6561% | 8.6751% | 8.6453% | 8.7104% |
| heavy_rain | 18.9128% | 19.0945% | 18.7229% | 19.0864% |
| snow | 8.2492% | 8.2248% | 8.2330% | 8.2031% |
| blizzard | 34.0603% | 34.1336% | 33.6751% | 34.0739% |
| hail | 7.0774% | 7.0095% | 7.0611% | 7.1398% |
| sandstorm | 33.9030% | 33.7104% | 33.5178% | 33.8515% |

Regenerated review sheets, **504 repeat proofs and six GIFs**. **4,512 checks
pass**, including 4,493 native mode blocks, independent unwrapped 3×3 rendering,
four-frame closure, GIF/PNG correspondence, coverage caps and preservation.
Snow remains visible on snow; dust stays golden over sand/grass; roads and towns
remain readable. Review index: `review/r16-A-review.html`.

**Playback limitation:** the browser host is unavailable, so live perceived
motion remains unverified. GIF frames and mathematical continuity pass; this
is a repair and self-review, not a new independent critic verdict.
No commit, push, branch change or changes to other art parts.

---

# Round 16 — Part A: critic-r16A-1 redraw

Reworked **all 24 failed frames**; preserved the **seven passing 288×288 references
byte-for-byte**, at their measured **48 px/cell**. These results supersede the
first Part A results below.

**Drawing repairs:** five new large built-in image-tool masters on magenta:
two sand variants, two wind variants, one splash sheet. Selected **sand2 / wind2**.
Short broken dust swirls replace outlined cords; connected one-pixel wind
strands replace fragmented dashes; drawn two-pixel rain splashes now survive.
Kept the existing falling strokes, blue-grey-edged snow and hard hail drawings.
Key → 8× BOX registration → palette lock → exact 64-sample mode → component
cleanup; hard working alpha, discrete final alpha, zero transparent RGB.
Code only processes, places and moves drawings. Prompts and variants:
`review/r16-A-redraw-generation.json`, `r16-A-source-redraw-*.png`, `r16-A-selection.png`.

**Motion:** irregular closed paths replace constant-spacing orbit copies.
Four advances permute each phase cohort exactly, including f3→f0. Per-particle
native offset ranges (right/down positive) follow; exact step sequences are in
`r16-A-measurements.json` → `weather` → `groups[*].steps`.

| Set | dx/frame | dy/frame |
|---|---:|---:|
| rain | 0…3 | 4…11 |
| heavy_rain | 0…4 | 9…19 |
| snow | -2…2 | 1…5 |
| blizzard | 5…17 | -3…3 |
| hail | 0 | 10…33 |
| sandstorm | 6…16 | -4…4 |

Rain splashes use approach/contact/tick/clear phases. Hail bounce marks stay at
the impact, then rebound 1 px right / 2 px up. GIFs: 110 ms/frame; snow 160 ms.
Sand/blizzard placement avoids full-width empty lanes.

**Per-file cover:** every alpha>0 pixel counts against 36,864 pixels.

| Family (`-fN.png`) | f0 | f1 | f2 | f3 |
|---|---:|---:|---:|---:|
| rain | 8.6561% | 8.6751% | 8.6453% | 8.7104% |
| heavy_rain | 18.9128% | 19.0945% | 18.7229% | 19.0864% |
| snow | 9.2773% | 9.2502% | 9.1987% | 9.2448% |
| blizzard | 34.0603% | 34.1336% | 33.6751% | 34.0739% |
| hail | 7.0774% | 7.0095% | 7.0611% | 7.1398% |
| sandstorm | 33.5314% | 33.5395% | 33.5585% | 33.3306% |

**QC:** 2,484 technical checks pass. No exact horizontal/vertical subperiod;
hail’s 96 px vertical overlap falls from 67.44% to 11.65%; sand’s maximum f0
row cover falls from 86.98% to 59.38%. Regenerated all review sheets, 504 repeat
proofs and six GIFs; decoded GIF phases match their PNG composites. Native
and enlarged review retains readable roads/towns and snow on snow.
Coverage counts, weighted cover, offsets, palettes and checks are in the
`r16-A-measurements.json` / `r16-A-validation.json` files.

**Limitation:** browser access host unavailable; real-time perceived motion
was not verified. Mathematical continuity passes; no second independent critic
verdict is claimed. No commit, push, branch change or edits to other art parts.

---

# Round 16 — Part A

Made only **24 falling-weather frames in `out/weather16/`**, all **192×192
RGBA**, plus the seven **288×288** reference crops/compositions in
`reference/r16/` and this part's `review/r16-A-*` material. The six sets are
**rain, heavy_rain, snow, blizzard, hail and sandstorm**, each **f0–f3**.

**References:** the camera renders draw cells at **48 px**, so the six-cell
crops remain **288×288** with nearest-neighbour **1:1** registration. Modern
farmland boundaries are x **576 / 624 / 672 / 720** and y **144 / 192 / 240 /
288 / 336**. Matching `farmland-3.png` at **(672,240)** gives mean RGB error
**0.9057** at 48 px, versus **8.7032** at 47 px and **9.4955** at 49 px.
The fantasy and wasteland render features use the same 48 px pitch.
Crop coordinates are zero-based, right/bottom exclusive:

| Reference | Render | Crop |
|---|---|---|
| `ref-fantasy-grass.png` | `ow-fantasy-0.png` | (864,96)–(1152,384) |
| `ref-fantasy-forest.png` | `ow-fantasy-0.png` | (816,432)–(1104,720) |
| `ref-fantasy-town.png` | `ow-fantasy-0.png` | (432,240)–(720,528) |
| `ref-modern-city.png` | `ow-modern-0.png` | (480,96)–(768,384) |
| `ref-wasteland.png` | `ow-wasteland-0.png` | (480,240)–(768,528) |

The renders have no desert or snowy stretch. **`ref-desert-sand.png`** uses
the existing **`beach-base.png`** sand with native **dunes props 0/3/4/2**;
**`ref-snow.png`** uses **`grass@winter-base.png`**, winter broadleaf trees
**0/2**, winter conifer **0**, and winter grass details **1/3/6**. All donor
pixels and alpha are composited at their original scale, on 48 px cell
coordinates. No reference terrain or prop was newly drawn or recoloured.
Exact donor placements are recorded in PNG metadata and the measurements.

**Drawing method:** **nine separate large built-in image-tool drawings on
solid magenta**: one master atlas for each family, with a second variant for
**heavy rain, blizzard and sandstorm**. Selected **heavy rain B / blizzard B /
sandstorm B**; rain, snow and hail use their sole masters. The first heavy
rain leaned west; the second supplies the required eastward fall. Blizzard
B has thinner open wind ribbons. Sandstorm B replaces A's strong flame-like
curls with low broken dust strands. `r16-A-selection.png` shows both variants;
all exact prompts are embedded in `r16-A-source-*.png` and retained in
`r16-A-generation.json`.

Each drawing is magenta-keyed, cropped to its painted component bounds and
BOX-registered to **8W×8H**. A fixed family palette is locked before the exact
RGBA mode of **all 64 samples per native pixel**, including transparency,
with lexicographic RGBA tie-breaking. This produces **33 particle drawings**:
short stepped streaks and tiny splash ticks; longer heavy-rain strokes;
**2–3 px** snow flakes; compact **2×2 / 2×3** grey-faceted hail and bounce
marks; sideways snow clumps and fine wind strands; and three **80×9 / 88×10 /
96×9** dust ribbons. Cleanup removes **12 detached native pixels**. The
one-pixel lower-right edges and upper-left highlights come from the drawings;
no additional contour painting was needed after reduction.

Working particle silhouettes have hard **0/255** alpha. Final weather uses
only fixed alpha levels: rain **0/96/160**, heavy rain **0/128/192**, snow
**0/224/255**, hail **0/224/240/255**, blizzard **0/96/128/144/176/224**,
and sandstorm **0/128/144/176**. Final frames contain **2–5 nontransparent
RGBA entries**. Transparent RGB is always **0,0,0**. Overlap selects a drawn
RGBA entry by opacity/colour priority; it creates no blended colour or alpha
ramp. Code registers, reduces, palette-locks, cleans, places, moves, wraps and
composites drawings. It constructs **no particle shapes, terrain or noise**;
the deterministic random numbers choose particle positions and motion groups
only.

**Animation:** coordinates increase right/down. Offsets below are **native
pixels per frame**, including the f3→f0 step. Rain and hail ticks are small
secondary drawn marks. Snow mixes gentle east/west drift; blizzard motion is
predominantly eastward. Sandstorm is one fast eastward stream.

| Set | Motion groups: (dx,dy) per frame | GIF frame duration |
|---|---|---|
| rain | (1,6), (2,8), (1,8), (2,12) | 110 ms |
| heavy_rain | (2,12), (3,16), (2,16), (3,12) | 110 ms |
| snow | (1,2), (−1,3), (1,4), (0,3) | 160 ms |
| hail | (0,12), (0,16), (0,24) | 110 ms |
| blizzard | (8,1), (12,1), (16,2), (8,−1) | 110 ms |
| sandstorm | (48,0) | 110 ms |

Particles wrap on the **192×192 torus**. Each motion group is populated at
successive **4×offset** positions until it closes, so four advances permute
the same drawn particles. Groups with different offsets and staggered origins
break up the visible regularity. Sandstorm advances a complete tile width in
four steps and therefore needs no short repeated sub-band. The computed fifth
state is **byte-identical to f0** for all six sets: no fade, teleport/reset or
reseed at the loop boundary. The GIFs contain the actual four exported states,
with no interpolated or invented animation frames.

**Measurements:** cover counts every pixel with alpha > 0, against **36,864**
pixels per file. Weighted cover is sum(alpha)/(255×36,864). Ordinary weather
stays below 25%, blizzard below 40%, sandstorm below 45%.

| File | Covered pixels | Cover | Alpha-weighted cover |
|---|---:|---:|---:|
| `rain-f0.png` | 3,286 | 8.9138% | 4.8700% |
| `rain-f1.png` | 3,304 | 8.9627% | 4.8870% |
| `rain-f2.png` | 3,300 | 8.9518% | 4.8897% |
| `rain-f3.png` | 3,284 | 8.9084% | 4.8679% |
| `heavy_rain-f0.png` | 7,144 | 19.3793% | 13.6588% |
| `heavy_rain-f1.png` | 7,112 | 19.2925% | 13.5989% |
| `heavy_rain-f2.png` | 7,084 | 19.2166% | 13.5376% |
| `heavy_rain-f3.png` | 7,046 | 19.1135% | 13.4518% |
| `snow-f0.png` | 3,348 | 9.0820% | 8.2599% |
| `snow-f1.png` | 3,355 | 9.1010% | 8.2782% |
| `snow-f2.png` | 3,373 | 9.1498% | 8.3195% |
| `snow-f3.png` | 3,360 | 9.1146% | 8.2892% |
| `hail-f0.png` | 2,583 | 7.0068% | 6.7213% |
| `hail-f1.png` | 2,545 | 6.9038% | 6.6242% |
| `hail-f2.png` | 2,555 | 6.9309% | 6.6517% |
| `hail-f3.png` | 2,544 | 6.9010% | 6.6218% |
| `blizzard-f0.png` | 13,024 | 35.3299% | 22.9705% |
| `blizzard-f1.png` | 13,004 | 35.2756% | 22.9439% |
| `blizzard-f2.png` | 13,148 | 35.6662% | 23.0236% |
| `blizzard-f3.png` | 12,948 | 35.1237% | 22.8915% |
| `sandstorm-f0.png` | 14,420 | 39.1168% | 22.9548% |
| `sandstorm-f1.png` | 14,420 | 39.1168% | 22.9548% |
| `sandstorm-f2.png` | 14,420 | 39.1168% | 22.9548% |
| `sandstorm-f3.png` | 14,420 | 39.1168% | 22.9548% |

**QC:** two visual passes. The first caught short repeated wave chains in the
sandstorm placement. Its final single-stream placement removes those chains
and uses irregularly overlapping painted bands. Heavy rain is visibly longer
and denser than rain. Snow retains its blue-grey edge on the snowy reference;
hail has compact hard pellets and a much faster vertical path. Blizzard's
sideways clumps and strands read substantially denser than snowfall. Sand
bands remain golden over grass and visible over sand. Town silhouettes,
roads and fields remain readable in all seven contexts. Native and enlarged
views retain square pixels, hard edges and clean transparency without magenta
fringe, antialias haze or blur. This is visual self-review of the exported
art; no engine code or live renderer was changed.

**Verification:** **539 checks pass**. These replay **3,068 native mode blocks /
196,352 source samples**, all recorded cleanup, final placement and movement,
24 dimensions and palettes, all per-file coverage counts, zero transparent
RGB, four distinct frames per set, and exact fourth-advance closure. An
independent unwrapped particle rendering equals every literal **3×3** tile
repeat, including particles straddling both boundaries. Every 3×/4× repeat
proof is byte-identical to the nearest-neighbour enlargement of its 1× source.
All six GIFs contain four frames and infinite-loop metadata. Full checks and
final SHA-256 hashes are in **`review/r16-A-validation.json`**.

**Review material:** **`r16-A-overview.png`** compares all six at native scale;
**`r16-A-review.html`** is a local index of the six **`r16-A-<name>.gif`** loops,
each showing all seven references. GIF colour is a shared 256-colour review
palette; the PNGs are authoritative for colour/alpha. Each delivered weather
PNG has a **1× + exact 4× sheet** (`r16-A-file-*`) and every reference has its
own 1×/4× sheet. **`r16-A-repeat-<name>-fN-<reference>-{1,3,4}x.png`** supplies
**504 literal 3×3 weather-repeat proofs**, covering all 24 frames on all seven
references at the brief's 1×/3× and the requested 4×. There are no newly drawn
ground bases in this part. The reference crops themselves repeat at 288 px in
these proofs; their road/crop boundaries are independent of the 192 px weather
joins. Six native filmstrips, seven reference PNGs, source selections,
registered/mode/cleaned stages, exact prompts, per-file measurements and
replayable **`r16-A-build.py` / `r16-A-verify.py`** complete the audit trail.

No files from Parts B–E were changed. No branch change, commit or push.

---

# Round 15 — Part C: critic-r15C-1 redraw

Repaired `out/city15/compose.py` and regenerated all four failed mounted
proofs. The critic passed every individual drawing and requested assembly
repairs, so **all 129 city PNGs remain byte-identical**; no redraw was needed.
Code only crops and composites the existing approved drawings.

Wall ends now expose their outer **3 native pixels** within the inspected
edge framing; the remaining five pixels stay behind the intact facade.
Shutters, windows, sills, original course rows and **48×width** lot spacing
are preserved. All four unchanged signs mount on the diagonal timber brace
between the two-cell upper windows, clear of the whole ground entrance and
display. `sign_mount()` uses this inspected socket and returns no automatic
mount for incompatible facades. The mounted sheets and streets share it.

Regenerated the original two streets, five-storey **8×** proof and asset
sheets; passing proofs remain byte-identical. Added width **1/2/3** wall-end
proofs covering all four storey kinds and all colourways, plus twelve-building
mounted streets with saved seeds **731 / 15062046**, each showing all four
signs. Native and enlarged inspection found no clipped shutter, covered
opening, gap or displaced course in the revised assemblies.

**Checks:** 129 asset invariants, **108** wall-end assemblies, **120** sign
mounts, **100 fresh seeds / 1,200 buildings / 185 signs**, saved-spec replay
and **12 exact enlargement pairs** pass. Run
`python -B art-drop/out/city15/compose.py --check-only`; use
`--seed 731 --seed2 15062046 --mounts --no-sheets` to recompose the mounting
stress streets. Audit metadata is in `review/r15-C-critic1-validation.png`.
Only Part C files and this section changed; no commit, push or branch change.
This records self-review, not a new independent critic verdict.

---

# Round 15 — Part C

Added the reproducible street compositor, `out/city15/compose.py`, and
completed the native street / enlarged building self-review. Two fixed seeds
each compose **12 wall-to-wall buildings**, with widths **1–3 cells** and
**1–5 floors including ground**. A separate five-floor building shows all four
upper-storey kinds at **8×**. Repaired **four PNGs**: `storey-plaster-w3.png`
and its `-c0..c2` partners. The other **125 city PNGs**, `COURSE.md`, references
and neighbouring approved art remain byte-identical.

**Findings and fixes:** the old wide plaster panel put a detached-looking
closed shutter beside its left window, followed by a conspicuous empty bay.
Repeated beside another wide building, that layout dominated the street.
Two new drawings replace it with three distinct framed windows: four-pane
glass, closed centre shutters and six-pane glass. Selected **B**, whose
framed centre window and irregular material shading read more naturally with
the town houses. A is retained for comparison. The random assembler also
avoids repeating a storey kind within a building or an identical same-width
window pattern at the same floor on adjacent buildings. Adjacent same-width
ground and roof kinds differ as well; colour remains consistent within each
building's upper facade.

The first assembly exposed floating chimneys beside gables. Chimney bases
now register to the drawn roof silhouette across their complete foot width.
Gable chimneys composite **behind** the roof, preserving its attic windows;
the other flues mount on the visible slope or deck. Overlay canvases stay
inside their building width. Optional **8×48 wall ends** composite inside
the facade edge, with their top/bottom rows omitted so the original complete
course remains untouched. Separate mounted proofs exercise both wall ends,
all four signs, all chimneys/dormers and both flowerboxes.

**Drawing method:** two large built-in image-tool edits on solid magenta,
using the existing wide plaster panel and `reference/r15/fantasy-house-2.png`.
The magenta surround is keyed, painted row extents are BOX-registered to
**1152×384**, and the established **34-colour** facade palette is locked
without dithering. Glass stays in the original blue-grey ramp. Every native
pixel is the exact RGBA mode of **all 64 samples per 8×8 block**, including
alpha, with lexicographic tie-breaking. One-pixel contour cleanup and transfer
of the existing drawn course record **295 edits** for selected B (**312** for
rejected A). Code registers, reduces, palette-locks, cleans, recolours and
composites drawings; it constructs no architecture, noise or decorative shapes.
Exact prompts, both source drawings, registered samples, mode results and
recorded cleanup are retained in `review/r15-C-*.png`; the processing recipe
is embedded in `r15-C-processing.png`.

The revised facade and its colourways remain **144×48**, fully opaque within
bounds `(0,0,144,48)`, with **27 / 28 / 28 opaque colours** for c0 / c1 / c2.
The unsuffixed PNG is byte-identical to c0. All four preserve the original
alpha and exact course rows **0 / 47**. Alpha is **0/255**, hidden RGB is zero,
and colourways use the existing cream/ochre/blue-grey and timber mappings.

**Compositor:** requires Pillow. `build(spec)` accepts a ground floor,
**0–4 upper storeys**, roof, optional wall ends and positioned overlays.
Facade pieces are placed without scaling or overlap at **48 px** intervals.
Roofs end immediately above the top facade course; adjoining lots advance by
exactly **48×width**. There is no street spacing or generated ground artwork:
review backgrounds repeat the unchanged summer `grass-base.png`.

```sh
python art-drop/out/city15/compose.py
python art-drop/out/city15/compose.py --seed 42 --seed2 43 --no-sheets
python art-drop/out/city15/compose.py --replay art-drop/review/r15-C-street-15062026-1x.png
```

Default seeds are **15062026 / 15112026**. Each saved street contains its seed,
complete building specs, exact piece placements and source-file hashes in PNG
text metadata. `--no-overlays` exposes bare stacks; `--count` changes street
length. Replay uses saved specs rather than drawing another random sequence.

| Proof | Native canvas | Enlarged canvas |
|---|---|---|
| `r15-C-street-15062026` | 1088×384 | 3264×1152 at 3× |
| `r15-C-street-15112026` | 1376×392 | 4128×1176 at 3× |
| `r15-C-five-storey` | 176×392 | 1408×3136 at 8×; also 4× |

The five-floor facade is **144×240**, capped by a **144×72** gable. Its review
canvas adds the documented headroom and summer-ground margins. Every one of
the **129 city PNGs** has an individual **1× / exact nearest-neighbour 4×**
proof, plus grouped sheets. Props appear over summer grass. No terrain base
was added; the unchanged grass has a literal, unlabelled **3×3 repeat** at
**864×864 / 3456×3456**. `r15-C-plaster-selection-{1x,4x}.png` compares before,
both alternatives and all colourways. Style and mounted-detail sheets accompany
the streets; additional fresh-seed **42 / 43** streets are saved at 1× / 4×.

**QC:** inspected both final streets at **1× / 3×**, the five-floor **8×**
building, fresh-seed streets and mounted details. No transparent facade break,
gap between neighbours, displaced course, detached overlay or adjacent copied
window pattern remains in those assemblies. Source-mode replay verifies
**13,824 mode blocks / 884,736 samples**, all cleanup and three colourway
replays. Pixel checks cover all **129 assets**, **960 roof/facade pairings**,
**960 storey/facade pairings**, four saved-street reconstructions and
**100 fresh seeds / 1,200 buildings**, including connected alpha, bounds,
48 px floor origins and repeat exclusions. All **142 exact 4× pairs**, the
3×/8× enlargements, individual native asset insets and nine literal grass
copies pass. Results, measurements and the validation script are embedded in
`r15-C-validation.png`.

There are **312 `r15-C-*.png` review files**. All **5,210 protected starting
files** remain byte-identical; earlier notes follow unchanged below. This is
visual asset-composite self-review, with no independent critic or live-game
verdict claimed. Only Part C files inside `art-drop/` were written.
**No commit, push or branch change.**

---

# Round 15 — Part B: critic-r15B-1 redraw

Repaired all **eight failed PNGs** in `out/city15/`: `roof-flat-w1` and
its three colourways, plus `roof-gable-w{2,3}-c{1,2}`. Passing outputs,
Part A originals and `COURSE.md` remain byte-identical.

**Method:** three new large built-in image-tool drawings on solid magenta;
selected **C's parapet** for its two clear rectangular stone courses.
BOX registration, the existing palette, exact RGBA mode of all **64 samples
per 8×8 block**, hard alpha, zero hidden RGB and one-pixel contour cleanup.
Two thin painted mortar joints were separately registered from that drawing;
one lip pixel was cleaned using its adjacent drawn stone. The new front
parapet is composited into the existing cap, retaining its deck, silhouette,
side return and bottom course. Code constructs no replacement stonework.
Exact prompts and all three variants are retained in `review/r15-B-source-roof-flat-w1-critic1-*.png`.

The gable colour masks now protect the complete facade, including solid
crossbeam rows and all timber shades. The w3 tiled lower-right slope is
recoloured through row 70. Source alpha and bottom courses are unchanged.
The unsuffixed flat w1 remains **byte-identical to c2** (grey lead);
passing unsuffixed gables and their c0 partners are untouched.

Regenerated Part B native/4× review sheets, whole buildings and the joined
street; added `r15-B-critic1-*` before/after, material-mask and flat-building
proofs. Source-mode replay, colourway replay, palette/alpha/course checks,
join checks and protected-file hashes are recorded in
`review/r15-B-critic1-validation.png`. This is visual self-review, with no
new independent critic verdict. Earlier notes are preserved below.
No commit, push or branch change.

---

# Round 15 — Part B

Drew **30 new modules** and added **75 colourway files** in `out/city15/`:
**105 new RGBA PNGs**. Four roof kinds each have separately drawn 48 / 96 /
144 px widths; four chimneys, four dormers, four hanging pictogram signs and
two flowerboxes supply overlays. Two party-wall strips and two corner panels
complete the joins. The **24 Part A originals and `COURSE.md` remain
byte-identical**.

**Files:** `roof-{gable,ridge,hip,flat}-w{1,2,3}.png` and their `-c0..c2`
partners; `chimney-0..3.png`, `dormer-0..3.png`, `sign-0..3.png`,
`flowerbox-0..1.png`, `wall-end-left.png`, `wall-end-right.png`,
`corner-ground.png`, `corner-storey.png`; and `-c0..c2` partners for all
12 existing `storey-{timber,plaster,stone,jetty}-w{1,2,3}` panels and the
new `corner-storey` panel.

**Method:** **40 separate large built-in image-tool drawings on solid
magenta**, selecting 30. Eight difficult pieces have two alternatives each;
the narrow flat roof has three. Selected **ridge w1 / ridge w3 / hip w2 /
chimney 2 / both corners = b**, **flat w1 = c**; all other pieces use **a**.
The rejected narrow ridge includes an unwanted facade; the rejected wide
hip has oversized tiles; the rejected second flat w2 introduces windows.
The final narrow flat repaint makes its four lead sheets readable after
reduction. Selection reasons are in `review/r15-B-selection.png`; all exact
prompts are embedded in `review/r15-B-source-*.png`.

Magenta is keyed from the surround **and enclosed sign/bracket holes**.
Drawings are cropped and BOX-registered onto **8W × 8H** working canvases.
The lower painted roof columns are registered to the common baseline;
the final two painted fascia rows are registered to their opaque row extents.
Rectangular join panels use painted row extents; corner front/side planes
are registered to a **32 / 16 px** division. Every sample comes from the
drawing. A **42-colour base palette**, using Part A's 34 colours plus six
terracotta and two olive tones sampled from the house references, locks
materials without dithering. Every native pixel is the exact RGBA mode
of **all 64 samples in its 8×8 block**, including transparency, with
lexicographic RGBA tie-breaking. Nearest neighbour is used for enlargement.

Native cleanup removes detached alpha remnants, resolves the exposed contour
to the one-pixel dark outline, maps corner timber into the established facade
browns, and transfers Part A's drawn course donor. The selected pieces record
**6,358 mode-to-final pixel changes**. Code registers, reduces, palette-locks,
recolours, cleans and composites drawings; it constructs no architecture,
foliage, surface noise or decorative shapes. Alpha is **0/255**, hidden RGB
is **0,0,0**, and each new base piece is one connected silhouette.

**Course:** roofs end on row **H−1**, with the exact Part A course pattern:
end pixels **#2b281d**, interior pixels **#624226**, fully opaque. Their bottom
two rows are filled across the width. Corners and party-wall strips carry
the same course on rows **0 / 47**. Two abutting modules retain the agreed
two-pixel course. All storey colourways preserve both original course rows
byte-for-byte. The corner's depth stays inside its filled square footprint.

**Colourways:** storeys use **c0 cream with warm dark timber**, **c1 ochre
with lighter timber**, and **c2 pale blue-grey with darker timber**. Stone
panels receive corresponding warm/ochre/cool masonry ramps. Highlights,
shadows, window glass, texture and alpha remain registered. The corner side
plaster uses a source-colour material mask so its shadowed wall changes with
the plaster rather than with the timber. Roofs use **c0 red**, **c1 brown
slate**, **c2 grey slate**; the flat cap applies those hues to its drawn lead
sheets while retaining the limestone parapet and lead seams. Gable plaster
and front framing are protected during roof recolouring.

Every unsuffixed storey, including the new corner, is **byte-identical to
c0**. The nine pitched roofs are also **byte-identical to c0**. The three
unsuffixed flat roofs retain their natural grey lead and are **byte-identical
to c2**. No unsuffixed Part A file was changed. Colourways have exactly the
same alpha mask as their unsuffixed partner and use complete tonal ramps.
Final files contain **10–38 opaque colours** each.

**Measurements:** coordinates are zero-based, right/bottom exclusive.
All roof widths are exactly `48*N`. Heights below are PNG canvas heights;
flat parapets are bottom-aligned within their 48 px canvases.

| Roof kind | w1 size | w2 size | w3 size | Visible height w1 / w2 / w3 |
|---|---|---|---|---|
| gable | 48×48 | 96×64 | 144×72 | 48 / 64 / 72 |
| ridge | 48×48 | 96×56 | 144×64 | 48 / 56 / 64 |
| hip | 48×48 | 96×56 | 144×64 | 48 / 56 / 64 |
| flat | 48×48 | 96×48 | 144×48 | 28 / 32 / 36 |

Both wall ends are **8×48**, bounds `(0,0,8,48)`. Both corners are **48×48**,
bounds `(0,0,48,48)`. The 36 Part A storey colourways retain **48/96/144×48**.
Flat roof bounds are `(0,20,48,48)`, `(0,16,96,48)`, `(0,12,144,48)`.
Every other roof occupies its complete width/height bounds.

| Overlay | PNG size | Visible bounds |
|---|---|---|
| chimney-0 | 24×32 | (6,8,18,32) |
| chimney-1 | 24×32 | (5,4,19,32) |
| chimney-2 | 24×40 | (3,8,21,40) |
| chimney-3 | 24×32 | (4,8,20,32) |
| dormer-0 | 32×32 | (6,8,26,32) |
| dormer-1 | 32×32 | (4,8,28,32) |
| dormer-2 | 40×32 | (5,10,35,32) |
| dormer-3 | 32×32 | (6,6,26,32) |
| sign-0 / sign-1 / sign-3 | 32×32 | (4,4,28,32) |
| sign-2 | 32×36 | (3,6,29,36) |
| flowerbox-0 | 32×16 | (4,4,28,16) |
| flowerbox-1 | 40×20 | (4,6,36,20) |

**QC and review:** all 105 files have individual native and exact nearest-
neighbour **4×** proofs, plus grouped roofs, storeys, overlays and joins.
Overlays are shown over unchanged summer grass and mounted on buildings.
Twelve complete examples span widths **1–3** and heights **1–5 floors**;
there are three colourway corner assemblies, party-wall join examples,
a wall-to-wall street and native style comparisons with the approved houses.
Visual self-review checked roof silhouettes, readable flues/panes/signs,
lead seams, square join footprints and common courses at **1× / 4×**.

Primary sheets are `review/r15-B-buildings-w{1,2,3}-{1x,4x}.png`,
`r15-B-joined-street-{1x,4x}.png`, `r15-B-corner-buildings-{1x,4x}.png`,
`r15-B-party-wall-joins-{1x,4x}.png`, `r15-B-overlays-mounted-{1x,4x}.png`,
and `r15-B-{roofs,storeys}-w{1,2,3}-{1x,4x}.png`. Each output also has
`r15-B-piece-<filename>-{1x,4x}.png`. No terrain base was introduced by this
part. The unchanged summer `grass-base.png` has a literal **3×3 repeat**
at **864×864 / 3456×3456**, and `corner-ground` has a literal **3×3 facade
repeat** at **144×144 / 576×576**. Both repeats are unlabelled.

Validation replays registration, palette locking, **122,784 mode blocks /
7,858,176 source samples**, every recorded cleanup and every colourway map.
It verifies dimensions, filled joins, one connected silhouette, hard alpha,
zero hidden RGB, all native proof pixels, **124 exact 4× proof pairs**,
**18 literal repeat copies**, **576 roof-to-facade pairings**, **576 storey
colourway pairings**, and the twelve-building street reconstruction.
**All checks pass. All 4,404 protected starting files remain byte-identical**,
and all earlier notes follow unchanged below. This is asset-composite
self-review; no independent Part C critic or live-game verdict is claimed.

There are **456 `r15-B-*.png` review files**, including drawings, alternatives,
palette-registered stages, mode results, selections and proofs. Processing,
colourway and review scripts are embedded in `r15-B-processing.png`,
`r15-B-colourways.png` and `r15-B-review-recipe.png`; complete measurements,
validation script and results are in `r15-B-validation.png`. Starting hashes
remain in `r15-B-reference.png`. Only the named Part B outputs, these review
PNGs and this top note were written in the checkout. **No commit, push or
branch change.**

---

# Round 15 — Part A: critic-r15A-1 redraw

Repaired only **ground-work-w1**, **storey-stone-w2**, and **storey-jetty-w1/w2/w3**
in `out/city15/`. The **19 passing PNGs remain byte-identical**.

**Method:** eight large built-in image-tool paintings on solid magenta: two
workshop alternatives, two balcony repaints, and four jetty backing edits
(two attempts for w2). Selected workshop **b**, balcony **c** (second repaint),
and jetty **a/b/a**. BOX registration, the existing 34-colour palette, exact
RGBA mode of all 64 samples per 8×8 block, source-supported thin-detail
registration, and one-pixel contour cleanup. Code only processes/composites
drawn material. Prompts remain in `review/r15-A-source-*-critic1-*.png`.

The workshop now has a separated saw, hammer and hand plane; its frame and
stone foot are retained. The balcony has a continuous rail and **six distinct
posts** against light stone; its slab and brackets are unchanged. Each jetty
receives **54 opaque painted backing pixels** in the former side slots, with
all previously opaque pixels unchanged. The **3 px inset** remains visible
through depth shading within the exact 48/96/144×48 footprint. This supersedes
the transparent-recess description in the earlier entry below. `COURSE.md`
now documents the backing; course rows **0/47** and their RGBA bytes are unchanged.

**Verification:** all 24 dimensions, palette membership, hard alpha and hidden
RGB checks pass; all same-width course rows are identical. Recomputed **14,042
mode blocks / 898,688 samples**, reconstructed the five recorded composites,
and checked **48 lateral pairings**, **96 vertical joins**, **12 random stacks**
with 1–4 upper storeys, and **71 exact 4× proof pairs**. **3,939 protected files**
remain byte-identical. Native/4× self-review passes; no new independent critic
or live-game verdict is claimed.

Regenerated `r15-A-{all,grounds,storeys,stacks-w1,stacks-w2,stacks-w3,joins-w1,joins-w2,joins-w3}-{1x,4x}.png`
and individual/repeat/style proofs. Added `r15-A-critic1-before-after`,
`r15-A-critic1-variants`, `r15-A-critic1-balconies`, and
`r15-A-jetty-neighbours-w{1,2,3}` at 1×/4×. Processing, review recipes and
validation are embedded in `r15-A-critic1-{processing,review-recipe,validation}.png`.
Only the five failed outputs, course note, Part A review PNGs and this note changed.
No commit, push or branch change.

---

# Round 15 — Part A

Drew **24 modular fantasy-town facade pieces** in `out/city15/`: twelve
ground floors and twelve upper storeys. Every piece is exactly **48 px high**,
with separately composed **48 / 96 / 144 px** widths. Shop displays, residential
entrances, yard passages and open workshops sit below half-timber, shuttered
plaster, stone balcony and jettied upper walls. The wider designs have their
own window groups, doorway positions and structural rhythms.

**Files:** `ground-{shop,door,arch,work}-w{1,2,3}.png` and
`storey-{timber,plaster,stone,jetty}-w{1,2,3}.png`, plus
[`out/city15/COURSE.md`](out/city15/COURSE.md). All images are RGBA PNGs.
The 21 ordinary facades fill their square-edged rectangular footprints;
the three jetty pieces expose transparent lower-side recesses.

**Course first:** `COURSE.md` was written before drawing. The course occupies
**top row 0 and bottom row 47**, one native pixel on each edge. At x=0 and
x=W−1 it is **RGBA (43,40,29,255), #2b281d**; every interior course pixel is
**(98,66,38,255), #624226**. Two abutting pieces therefore make a continuous
two-pixel timber course. All eight pieces of each width have byte-identical
complete top and bottom rows, including the jetty pieces. Decorative framing
sits inside those fixed boundaries.

The common course comes from the drawn upper beam in shop **w2-a**, with its
brown material palette-locked and the original dark ends retained. The short
width crops the painted interior; the wide width repeats/crops that same
interior and transfers the original end pixels. This donor is retained as
`review/r15-A-course-donor.png`. Ground-floor stone plinths and steps sit
immediately above the common contact foot on row **47**.

**Method:** **29 separate large built-in image-tool drawings on solid
magenta**: one for each requested piece, second shop drawings for **w2 / w3**,
and two variants of every jetty width. Selected shops **a / b / b**, jetties
**a / a / b**, and **a** for all other pieces. The shop revisions replace
incorrect glazing with open wares and flatten the wide awning hem. The jetty
choices retain clear small windows, readable brackets and quiet wide plaster
panels. Exact prompts are embedded in `review/r15-A-source-*.png`; selected
variants and reasons are recorded in `r15-A-selection.png`.

Each source is keyed only through the magenta surround connected to the image
border, preserving coloured cloth inside the shop. Painted row extents are
BOX-registered to **384×384 / 768×384 / 1152×384** working canvases. The jetty's
already-drawn upper and recessed lower wall bands are separately registered
to the agreed rows and widths. An explicit **34-colour palette sampled from
the supplied house/hall references** locks material colours without dithering.
Glazing uses the blue-grey ramp instead of colliding with olive display colours.
Every native pixel is the exact RGBA mode of **all 64 samples in its 8×8 block**,
including transparency, with lexicographic RGBA tie-breaking. Nearest neighbour
is used for proof enlargement only.

Native contour cleanup resolves exposed edges to the one-pixel dark outline;
the shared painted course is composited onto both boundaries. The selected
outputs record **5,468 mode-to-final pixel changes**, including course transfer
and contour recolouring. Code registers, reduces, palette-locks, cleans and
composites drawings; it constructs no architecture or texture from shapes or
noise. Final pieces use **21–32 opaque colours**. Alpha is **0/255**, transparent
RGB is **0,0,0**, and every piece is one connected silhouette.

**Measurements:** coordinates are zero-based; right and bottom are exclusive.
All kinds share the full bounding box and foot row shown below. Jetty walls
remain full width on rows **0–37**, then step inward exactly **3 px on each
side** for rows **38–46**. Their full-width common course returns at row **47**.
Each jetty consequently has exactly **54 transparent pixels**, two **3×9**
recesses; no piece exceeds its requested width or changes the stack origin.

| Width suffix | PNG size | Full bounds | Jetty lower-wall x interval | Foot row |
|---|---|---|---|---:|
| `w1` | 48×48 | (0, 0, 48, 48) | [3, 45) | 47 |
| `w2` | 96×48 | (0, 0, 96, 48) | [3, 93) | 47 |
| `w3` | 144×48 | (0, 0, 144, 48) | [3, 141) | 47 |

**QC and review:** inspected all 24 native pieces and exact nearest-neighbour
**4×** sheets, style comparisons with the original town houses/halls, twelve
mixed stacks and the full join matrix. Random stacks use seed **15062026**:
each width has ground plus **1, 2, 3 and 4** upper storeys. **96 ordered valid
upper-storey/lower-facade pairings** have dedicated join crops. The joins have
no transparent break or course displacement; balcony rails, workshop openings,
square outside edges and the three-pixel jetty steps remain readable. No
detached alpha specks, magenta fringe, haze or fog remains. This is visual
self-review of asset composites, without a live-game or independent critic
verdict.

Primary sheets: `review/r15-A-{all,grounds,storeys}-{1x,4x}.png`,
`r15-A-stacks-w{1,2,3}-{1x,4x}.png`,
`r15-A-joins-w{1,2,3}-{1x,4x}.png`, and
`r15-A-style-comparison-{1x,4x}.png`. Each final file also has an individual
`r15-A-piece-<filename>-{1x,4x}.png` proof. All twelve ground-floor facades
have literal, unlabelled **3×3 repeats** at **1× and 4×**. The unchanged summer
`grass-base.png` used beneath the stacks also has its literal **3×3 repeat**,
**864×864 / 3456×3456**. No terrain base belongs to this part or was changed.

Validation recomputed **135,936 mode blocks / 8,699,904 source samples** across
all 29 drawings, reconstructed every recorded cleanup, checked the 24 exact
output sizes and selections, shared course rows, jetty recesses, palette,
alpha, connectivity, width-specific designs, **64 exact 4× pairs**, **117 literal
repeat copies**, all twelve stacks and all 96 join pairings. **11,188 checks
pass. All 3,820 protected starting files remain byte-identical**, including the
brief, references, neighbouring approved art and earlier reviews. The previous
notes follow unchanged below.

There are **280 new review PNGs**, including original drawings, alternatives,
registered palette stages, mode votes, recorded cleanup and proofs, plus the
**24 final PNGs**. The processing script is embedded in `r15-A-processing.png`;
review recipes in `r15-A-review-recipe.png`; complete per-file measurements,
validation script and results in `r15-A-validation.png`; starting hashes in
`r15-A-reference.png`. Only the named Part A outputs, `COURSE.md`, the
`r15-A-*.png` review files and this top note were written in the checkout.
**No commit, push or branch change.**

---

# Round 14 — Part B2

Redrew **all 24 hills** smaller and enlarged only **mountain peaks 6 and 7**
in summer and winter: **28 transparent PNGs** in `out/`. The four single hills
retain their individual crests, terrace marks and attached tufts; the four
rolling groups retain their two or three overlapping crests and embedded
stones. Autumn keeps tawny olive/ochre slopes; winter keeps solid white snow,
blue-grey lower-right shade and a thin dark contact foot. The two enlarged
mountains remain the rounded rocky knoll and stepped outcrop, using the
approved grey/slate/olive and snow palettes of peaks 3–5.

**Files:** `out/hills-prop-0..7.png`, `hills@autumn-prop-0..7.png`,
`hills@winter-prop-0..7.png`, `mountains-peak-{6,7}.png` and
`mountains@winter-peak-{6,7}.png`. Peaks **0–5**, their winter partners,
all ground bases and all other starting art remain byte-identical.

**Method:** **34 separate large built-in image-tool drawings on solid
magenta**: twelve summer hill paintings, sixteen seasonal hill paintings,
four summer knoll paintings and two winter knoll paintings. Two variants
were drawn for each difficult small summer hill and each enlarged summer
knoll. Selected hills **0b / 1a / 2b / 3b / 4a / 5a / 6a / 7a**, mountains
**6a / 7a**, and seasonal paintings **a**. The second small-hill variants
were compared at native size for rounded shoulders and surviving terrace
marks; the first mountain variants better retained the old knoll designs.
Exact prompts are embedded in `review/r14-B2-source-*.png`.

Each fresh painting is magenta-keyed, cropped and BOX-registered to its new
visible bounds on **384×384** or **768×768**, then locked without dithering
to explicit palettes sampled from the starting art: **10 colours per hill
season, 13 summer mountain colours and 16 winter mountain colours**. Every
native pixel is the exact RGBA mode of **all 64 samples in its 8×8 block**,
including transparency, with lexicographic RGBA tie-breaking. Nearest
neighbour is used for proof enlargement only; the old sprites were not
shrunk or enlarged to make the new output artwork.

Seasonal drawings are composited through the exact new summer alpha masks.
No missing painted samples needed nearest-sample filling. Native contour
cleanup resolves the outline at one pixel and removes isolated colour
remnants while retaining embedded stone material. The final recorded
registration/contour/colour cleanup changes **1,115 pixels** across the
28 outputs. Autumn material cleanup changes **two further pixels**, removing
an invented stone and keeping the summer stone locations. Code only
registers, reduces, palette-locks, cleans and composites the drawings; it
constructs no landforms or noise. Final hills use **5–8 opaque colours**;
changed mountains use **11–15**. Alpha is **0/255**, with **zero RGB under
transparency**, and each changed sprite is one connected component.

**Measurements:** all 24 hill and 16 mountain bounding boxes are listed
below. Coordinates are zero-based; right and bottom are exclusive. Bounds
include the contact edge. Small hill feet remain on **row 43**, large hill
feet on **row 88**; the enlarged peaks are centred with feet on **row 93**.
All sixteen hill seasonal masks and both enlarged winter peak masks have
**zero differing alpha pixels** from their new summer partner.

Every hill is **18–36 px tall**; every mountain is **45–74 px tall**. The
shortest mountain remains **9 px taller** than the tallest hill. The new
peaks are both **58×52**, versus the former **40×29 / 36×31**.

| Hill file in `out/` | Bounds (left, top, right, bottom) | Visible size |
|---|---|---|
| `hills-prop-0.png` | (9, 24, 39, 44) | 30×20 |
| `hills-prop-1.png` | (9, 25, 39, 44) | 30×19 |
| `hills-prop-2.png` | (9, 25, 39, 44) | 30×19 |
| `hills-prop-3.png` | (9, 26, 39, 44) | 30×18 |
| `hills-prop-4.png` | (18, 53, 78, 89) | 60×36 |
| `hills-prop-5.png` | (18, 55, 78, 89) | 60×34 |
| `hills-prop-6.png` | (18, 54, 78, 89) | 60×35 |
| `hills-prop-7.png` | (18, 55, 78, 89) | 60×34 |
| `hills@autumn-prop-0.png` | (9, 24, 39, 44) | 30×20 |
| `hills@autumn-prop-1.png` | (9, 25, 39, 44) | 30×19 |
| `hills@autumn-prop-2.png` | (9, 25, 39, 44) | 30×19 |
| `hills@autumn-prop-3.png` | (9, 26, 39, 44) | 30×18 |
| `hills@autumn-prop-4.png` | (18, 53, 78, 89) | 60×36 |
| `hills@autumn-prop-5.png` | (18, 55, 78, 89) | 60×34 |
| `hills@autumn-prop-6.png` | (18, 54, 78, 89) | 60×35 |
| `hills@autumn-prop-7.png` | (18, 55, 78, 89) | 60×34 |
| `hills@winter-prop-0.png` | (9, 24, 39, 44) | 30×20 |
| `hills@winter-prop-1.png` | (9, 25, 39, 44) | 30×19 |
| `hills@winter-prop-2.png` | (9, 25, 39, 44) | 30×19 |
| `hills@winter-prop-3.png` | (9, 26, 39, 44) | 30×18 |
| `hills@winter-prop-4.png` | (18, 53, 78, 89) | 60×36 |
| `hills@winter-prop-5.png` | (18, 55, 78, 89) | 60×34 |
| `hills@winter-prop-6.png` | (18, 54, 78, 89) | 60×35 |
| `hills@winter-prop-7.png` | (18, 55, 78, 89) | 60×34 |

| Mountain file in `out/` | Bounds (left, top, right, bottom) | Visible size | Change |
|---|---|---|---|
| `mountains-peak-0.png` | (7, 20, 89, 94) | 82×74 | unchanged |
| `mountains-peak-1.png` | (8, 28, 88, 94) | 80×66 | unchanged |
| `mountains-peak-2.png` | (10, 27, 86, 94) | 76×67 | unchanged |
| `mountains-peak-3.png` | (18, 41, 78, 94) | 60×53 | unchanged |
| `mountains-peak-4.png` | (22, 35, 74, 94) | 52×59 | unchanged |
| `mountains-peak-5.png` | (22, 49, 74, 94) | 52×45 | unchanged |
| `mountains-peak-6.png` | (19, 42, 77, 94) | 58×52 | redrawn |
| `mountains-peak-7.png` | (19, 42, 77, 94) | 58×52 | redrawn |
| `mountains@winter-peak-0.png` | (7, 20, 89, 94) | 82×74 | unchanged |
| `mountains@winter-peak-1.png` | (8, 28, 88, 94) | 80×66 | unchanged |
| `mountains@winter-peak-2.png` | (10, 26, 86, 94) | 76×68 | unchanged |
| `mountains@winter-peak-3.png` | (18, 41, 78, 94) | 60×53 | unchanged |
| `mountains@winter-peak-4.png` | (22, 35, 74, 94) | 52×59 | unchanged |
| `mountains@winter-peak-5.png` | (22, 49, 74, 94) | 52×45 | unchanged |
| `mountains@winter-peak-6.png` | (19, 42, 77, 94) | 58×52 | redrawn |
| `mountains@winter-peak-7.png` | (19, 42, 77, 94) | 58×52 | redrawn |

**QC and review:** inspected every changed file over matching ground at
native **1× and exact nearest-neighbour 4×**, full seasonal hill sheets,
all sixteen mountains, same-foot size comparisons and before/after hills.
The **768×432** summer and winter map crops each scatter **24 hills** beside
an overlapping mountain range, using the Round 5 lattice: **48 px across,
30 px between rows, alternate rows shifted 24 px**, composited back to front
with mountain overscan. The same placement list is used in both seasons.
At 1×, hills read clearly lower than the range; terrace strokes and crest
separation survive the shrink. The close views retain one-pixel outlines,
top-left light and attached contact feet. No detached alpha specks, backing
squares, magenta fringe, smears, haze or fog remain. This is **visual
self-review of asset composites**, without a new independent critic verdict
or live-game check.

Primary proofs are `review/r14-B2-{summer,winter}-map-{1x,4x}.png`,
`r14-B2-{summer,winter}-size-comparison-{1x,4x}.png`,
`r14-B2-{summer,autumn,winter}-hills-{1x,4x}.png`,
`r14-B2-{summer,winter}-mountains-all-{1x,4x}.png`, and
`r14-B2-seasons-{1x,4x}.png`. Each of the 28 changed files also has an
individual ground-backed **1×/4×** pair. All five unchanged grounds used
in these proofs have literal, unlabelled **3×3 repeats**, **864×864 at 1× /
3456×3456 at 4×**; no ground base was changed.

Validation recomputed **202,752 mode blocks / 12,976,128 samples** across
all 34 paintings, reconstructed every final sprite from its mode stage and
recorded cleanup, checked **46 exact 4× pairs**, **45 literal repeat crops**,
all dimensions, palette membership, alpha, connected silhouettes, centring,
foot rows, the 18 exact seasonal masks and both lattice composites.
**All 3,445 protected starting files remain byte-identical**, including the
brief, references, all earlier reviews, peaks 0–5 and their winter partners.
Two unrelated `city-view-*-2026-11-16.png` reviews appeared during the run
and were left untouched.

There are **311 new B2 PNGs**, including drawings, inputs, alternatives,
processing stages and proofs. The processing recipe and per-file cleanup
records are in `r14-B2-processing.png`; placement and review recipes are in
`r14-B2-review-recipe.png`; the complete measurements, validation recipe and
results are in `r14-B2-validation.png`. Starting hashes are in
`r14-B2-reference.png`. Only the 28 named outputs, these B2 review PNGs and
this top note were written for B2. **No commit, push or branch change.**

---

# Round 14 — Part C2

Redrew only **`out/treeline_forest@winter-0..7.png`**, eight transparent
**48×48** broadleaf trees, after the dense-map rejection of Part C. Crowns
now read as rounded dormant twig masses in **two or three large, flat
purple-brown tones**, with short bold lower forks and clean white upper-left
snow caps. **0/2/6** are oaks, **1/4** beeches, **3/7** pale-trunk birches,
and **5** the low spreading sapling. **2 and 4** retain two compact brown
leaf clusters. The summer silhouettes and asymmetric crown lobes are exact.

**Method:** **24 separate large built-in image-tool paintings on solid
magenta**, three variants per tree. The first two variants established the
simplified crowns; the third enlarged the painted snow caps after native
measurement found insufficient coverage. Selected **0c / 1c / 2c / 3c /
4c / 5c / 6c / 7c**. Exact prompts are embedded in
`review/r14-C2-source-*.png`; the summer edit targets are `r14-C2-input-*.png`.

Each keyed painting is cropped and BOX-registered to its summer bounds on
**384×384**. Local vertical registration of upper-crown paint on **0/2/3/5**
brings cap coverage into range while keeping the lower trunk anchored.
An explicit **14-colour** material palette separates crown, bark, snow,
birch and dead leaves; contour and brown bark use the summer colours.
Every native pixel is the exact RGBA mode of **all 64 samples in its 8×8
block**, including transparency, with lexicographic tie-breaking.

The drawn colours are composited through the **exact summer alpha mask**;
**82** uncovered registration samples use the nearest painted opaque sample.
The original foot masks on rows **41–44** are retained, with their bark tones
mapped to brown or pale birch. Native one-pixel contour cleanup and removal
of isolated one/two-pixel colour remnants finish the drawings. Across the
selected eight, **522 pixels** differ between raw mode and final, including
mask registration, trunk-foot colour transfer and cleanup. No tree shapes,
texture or noise were constructed by code. Final images have **7–10 opaque
colours**, hard alpha **0/255**, and **zero RGB under transparency**.

**Measurements:** zero-based bounds; right/bottom exclusive. Foot x ranges
are inclusive. Every full alpha mask, every row/column extremity, every
bounding box and every four-row trunk-foot mask matches summer with
**zero differing pixels**. All feet end on **row 44**, leaving three clear
rows below. Snow coverage includes white and its blue-grey underside over
the opaque crown area on rows **0–38**, including contour and lower forks.

| Tree | Summer = winter bounds | Visible size | Opaque pixels | Foot x on row 44 | Snow coverage |
|---|---|---|---:|---|---:|
| 0 — rounded oak | (6, 8, 41, 45) | 35×37 | 816 | 21–25 | 33.67% |
| 1 — upright beech | (10, 6, 37, 45) | 27×39 | 678 | 21–25 | 30.02% |
| 2 — spreading oak, leaves | (4, 12, 43, 45) | 39×33 | 771 | 21–25 | 28.88% |
| 3 — rounded birch | (6, 9, 41, 45) | 35×36 | 778 | 22–25 | 32.71% |
| 4 — beech, leaves | (10, 6, 37, 45) | 27×39 | 736 | 21–24 | 34.29% |
| 5 — low sapling | (5, 12, 43, 45) | 38×33 | 743 | 20–27 | 33.38% |
| 6 — crooked oak | (7, 10, 41, 45) | 34×35 | 742 | 21–25 | 34.65% |
| 7 — slender birch | (10, 6, 38, 45) | 28×39 | 636 | 22–25 | 28.36% |

**QC and review:** every tree is shown over `grass@winter-base` at **1×,
exact nearest-neighbour 4× and 8×**, with a literal **4×2** reference-layout
atlas and summer/conifer comparisons. The dense map panels each contain
**128 overlapping trees** on a **24 px horizontal / 16 px vertical** staggered
lattice, alternate rows shifted **12 px**, small position variation, and
back-to-front row compositing. Each **456×192** native panel is then reduced
by nearest neighbour to **152×64** and **190×80**: the original 48 px sprite
cells become **16 px and 20 px** respectively. Identical placement lists
compare winter broadleaf, winter conifers and summer broadleaf. Extra views
compare the rejected Part C forest and put summer trees on the same snow.

Visual self-review of those actual downscaled crops passes the C2 criterion:
separate snow-capped rounded crowns remain readable, with clearer separation
than the summer comparison and no bramble/static texture. Large crown tones
remain continuous, snow is attached upper-surface coverage, and the 8× check
finds no detached specks or thin-line crown networks. This is a **composited
map-scale self-review**, not a new live-game or independent critic verdict.

Primary proofs: `review/r14-C2-map-comparison-{16px,20px,1x,4x}.png`,
`r14-C2-map-before-after-{16px,20px,1x}.png`,
`r14-C2-tree-{0..7}-{1x,4x,8x}.png`, `r14-C2-overview.png`, and
`r14-C2-closeup-{0,1}-8x.png`. Both unchanged grass backgrounds have literal
**3×3 repeats at 1× and 4×**; no ground asset was changed.

Validation recomputed **55,296 mode blocks / 3,538,944 samples** across all
24 paintings, reconstructed every recorded native cleanup, verified **18
exact 4× pairs**, **9 exact 8× pairs**, **18 literal repeat crops**, and the
three 128-tree composites plus both downscaled comparisons. Every output
is connected; each snow region is connected, without isolated snow pixels.
**All 3,272 protected starting files remain byte-identical**, including
summer trees, conifers, other parts, references and all previous reviews.

There are **186 new C2 PNGs**, including sources, alternatives, registration
stages and proofs. Processing recipe and per-variant measurements are in
`r14-C2-alternatives-4x.png`; review recipe, placement list, validation recipe,
full foot-row measurements and results are in `r14-C2-trees-1x.png` metadata.
Starting hashes are in `r14-C2-reference.png`. Only the eight named outputs,
these C2 review PNGs and this top note changed. **No commit, push or branch
change.**

---

# Round 14 — Part A2: critic-r14A2-1 redraw

Repaired only **`out/grass@autumn-detail-7.png`**. Its summer mask is now
exact: **626 opaque pixels**, bounds **(7, 11, 41, 37)**, and **zero differing
alpha pixels**. Restored all **111** missing summer pixels and removed all
**54** autumn-only pixels, including the lowered foot. This supersedes the
previous A2 note's intentional silhouette change.

The critic accepted the drawing and requested registration, so the existing
large magenta-backed bush painting **`r14-A2-source-detail-7a.png`** was reused.
Compared two registrations; selected bounding-box registration for clearer
woody forks. BOX-registered to **384×384**, locked to the existing **14-colour**
autumn palette, then reduced by exact RGBA mode over all **64 samples per
8×8 block**. Composited through the summer mask; **33** uncovered samples use
the nearest painted sample. One-pixel contour cleanup stays inside that mask,
with contact shade inside the original foot. Hard alpha **0/255**, zero hidden
RGB; no constructed shapes, noise, or new drawing substituted for the source.

Regenerated all **26 final A2 proofs** and added native/4× seasonal-mask
comparisons under **`review/r14-A2-critic1-*.png`**. Visual self-review retains
rust/amber foliage, upper-left light, branches and a readable outline at 1×.
Validation passes both mode reductions (**4,608 blocks / 294,912 samples**),
**16 exact 4× pairs**, **27 literal repeat placements**, and mask/palette/alpha
checks. Recipes and results are embedded in `review/r14-A2-base-1x.png`.
The three passing outputs remain byte-identical; base mean remains
**RGB (153.53, 140.18, 63.74)**. Summer partners, autumn plains, details
**0, 2, 4, 5, 6**, references and the supplied critic report are unchanged.
No new independent critic or live-game verdict; no commit, push or branch change.

---

# Round 14 — Part A2

Polished only **`out/grass@autumn-base.png` (288×288)** and
**`grass@autumn-detail-{1,3,7}.png` (48×48)** after the in-game Part A review.
The ground now has broad tawny/khaki light and shade, dry ochre patches and
small rust/brown fallen leaves. Detail 7 is a new outlined autumn bush with
amber upper-left foliage, rust lower boughs, visible woody forks and a dark
contact foot. The mossy rock and grass tuft have stronger shaded edges and
highlights while retaining their exact original and summer alpha masks.

**Method:** seven large built-in image-tool paintings on solid magenta:
two ground variants, two bush variants, one rock repaint, one tuft repaint
and one half-offset wrap repaint. Selected **ground B / bush A**; B has fewer
repeated leaf landmarks, while A keeps readable branches at native scale.
Exact prompts are embedded in `review/r14-A2-source-*.png`.

The ground square is cropped inside its magenta fringe, BOX-registered to
**1152×1152**, locked to a **20-colour** palette with four source-sampled rust
slots, and reduced by the exact RGBA mode of all **16 samples per 4×4 block**.
A constant palette translation sets the target mean without changing drawn
patch geometry. A **144 px** offset brings the joins to the centre; the
separate wrap painting is registered, palette-locked and mode-reduced in the
same way. Minimum-error hard cuts transfer **25,927 drawn pixels** through a
narrow cross, preserving the offset outer three-pixel ring. No blended seam
or synthetic terrain texture is added.

Details are magenta-keyed, BOX-registered to **384×384**, palette-locked and
reduced by the exact RGBA mode of all **64 samples per 8×8 block**, including
transparency. Rock and tuft paints are composited through their existing
masks. Native one-pixel contour cleanup changes **25 / 64 / 90 colour pixels**
for details **1 / 3 / 7**; it adds no silhouette pixels. The bush palette is
slightly desaturated to keep rust and amber restrained. Final palettes contain
**12 / 13 / 14 opaque colours**. Hard alpha **0/255**, zero RGB under
transparency. Code only registers, reduces, palette-locks, cleans, wraps and
composites the drawings; it constructs no shapes or noise.

**Measurements:** final ground mean RGB is **153.53, 140.18, 63.74**,
within **0.54** of the requested target in every channel. Hue **51.08°** and
luma **137.50** remain between summer grass (**77.03° / 111.65**) and unchanged
autumn plains (**34.11° / 153.41**). The ground contains **111 rust/brown leaf
pixels**, scattered in small drawn marks.

Broad tonal drift is measured as the standard deviation of mean luma in
non-overlapping **48×48** blocks: **0.30 before → 2.16 now**, compared with
**2.06 summer / 4.27 autumn plains**. At 24×24 blocks the new value is **3.18**,
versus **0.52 before**. Mean absolute RGB steps across left/right and top/bottom
wraps are **1.34 / 1.18**, versus **1.19 / 1.28** across internal neighbours.

| Detail | Final bounds, right/bottom exclusive | Opaque pixels | Alpha differences from before |
|---|---|---:|---:|
| 1 — mossy rock | (8, 15, 40, 33) | 425 | **0** |
| 3 — grass tuft | (9, 8, 39, 39) | 379 | **0** |
| 7 — autumn bush | (8, 14, 40, 38) | 569 | 165, intentional redraw |

The rock and bush are each connected. The tuft retains its exact inherited
seed-head gaps and four components (358 / 9 / 7 / 5 pixels); no new detached
fragments were introduced.

**QC and review:** inspected native 1× and exact nearest-neighbour 4× views,
all eight details on the new ground, before/after rows, individual detail
proofs, a map-like meadow, the half-offset junction and literal 3×3 repeats.
The new base is shown beside summer grass and autumn plains both singly and
in repeated comparisons. The outline, upper-left lighting and native scale
read consistently with neighbouring details. No hard tile seam, rounded grid
edge, distinct large patch landmark, magenta fringe, backing square, haze or
blur was found. Small repeated leaf positions remain locatable on deliberate
inspection. This is visual self-review, without a new live-game verdict.

There are **26 final proof PNGs (13 pairs)** under `review/r14-A2-*.png`, plus
source paintings, alternatives, inputs and processing stages: **70 new PNGs**
in total. Each ground repeat is **864×864 at 1× / 3456×3456 at 4×**. The
side-by-side repeat comparison also preserves literal 1× and 4× pixels.

Validation recomputed **258,048 mode blocks / 4,571,136 samples**, verified
**15 exact 4× pairs** including alternatives, **27 literal repeat crops**,
recorded wrap and contour reconstruction, sizes, palettes, alpha, hidden RGB
and both preserved masks. **All 3,142 protected starting files remain
byte-identical**, including `plains@autumn-base.png`, details **0, 2, 4, 5, 6**,
summer partners, every reference and all earlier review sheets. Processing,
review and validation recipes plus measurements are embedded in
`review/r14-A2-base-1x.png`; starting hashes are in `review/r14-A2-reference.png`.
Only the four named outputs, these A2 PNGs and this top note changed.
**No commit, push or branch change.**

---

# Round 14 — Part D: critic-r14D-1 redraw

Redrew only **`out/scifi-tree@winter-1.png` and `out/scifi-tree@winter-3.png`**
(96×96). The glowing tree now keeps the full summer fan silhouette, with
visible branching, upper snow and **40 drawn snow pixels inside the planter
lip**. The dome has broad white deposits with blue-grey lower edges; its
green interior and frame remain exact summer pixels. All **eleven passing
assets**, including the winter ground, remain byte-identical.

**Method:** four large built-in image-tool paintings on solid magenta, two
variants per failed piece; selected **1b / 3a**. Magenta key, BOX registration
to 768×768, explicit palette lock, exact RGBA mode of all **64 samples per
8×8 block**, then source-material compositing through the exact summer mask.
Five missing registration samples in the selected crown use the nearest
drawn opaque pixel. The native one-pixel contour pass required no additional
hand-painted pixels. Hard alpha **0/255**, zero RGB under transparency;
code constructs no shapes or noise. Exact prompts are embedded in
`review/r14-D-critic1-source-winter-{1a,1b,3a,3b}.png`.

**Preservation:** every seasonal tree now has **zero full-alpha-mask
differences** from summer. Changed RGBA counts below apply to each of
autumn / winter / spring:

| Tree | Protected planter/frame region | Region changed | Light region | Lights changed |
|---|---:|---|---:|---|
| 0 | 1,305 pixels | 0 / 0 / 0 | 54 pixels | 0 / 0 / 0 |
| 1 | 1,360 pixels | 0 / 0 / 0 | 245 pixels | 0 / 0 / 0 |
| 2 | 1,691 pixels | 0 / 0 / 0 | 86 pixels | 0 / 0 / 0 |
| 3 | 2,364 pixels | 0 / 0 / 0 | 45 pixels | 0 / 0 / 0 |

Tree 1's original 1,436-pixel protection mask included **76 green planting-bed
pixels**. These are now selected separately, excluding lamps and trunk
channels. The original mask consequently records **40 changed pixels**, all
drawn snow on that vegetation; the remaining 1,360 pixels are unchanged.
The source/selection/final proof is `review/r14-D-critic1-bed-proof-4x.png`.

**Review:** regenerated all 56 existing final Part D proof PNGs, plus new
before/after, alternatives and bed-selection proofs. Inspected native and
4× views, winter trees on both pavings, the winter town, all seasons, and
ground repeats/junctions. Snow reads at 1×; the paving remains thinly covered
and seamless. Validation checks **36,864 exact mode blocks / 2,359,296 samples**,
31 exact 4× pairs, 18 literal repeat crops, connected sprites and the full
starting-file hash scope. Recipes and results are embedded in
`review/r14-D-seasons-1x.png`; sources/stages use `r14-D-critic1-*`.
This is visual self-review, without a new independent critic or live-game
verdict. **No commit, push or branch change.**

---

# Round 14 — Part D

Added **12 transparent 96×96 town-tree partners**:
`out/scifi-tree@autumn-0..3.png`, `scifi-tree@winter-0..3.png` and
`scifi-tree@spring-0..3.png`, plus the opaque RGBA
**288×288** `out/scifi-town_ground@winter-base.png`.

Autumn has rust/amber bonsai and hedge foliage, teal-violet luminous leaves,
and a green heated dome. Spring has pale pink bonsai blossoms, fresh light
green hedge growth and brighter mint-cyan fans. Winter has solid bonsai snow
caps, a clipped twig hedge with upper and inner-lip snow, a bare-ish glowing
tree with snow on its curved branches, and a distinct shaded snow cap on the
dome glass. The winter dome's original green interior is retained exactly.
Snow sits above the planter lips; the original cream hardware remains visible.

**Method:** **17 separate large built-in image-tool paintings** on solid
magenta: fourteen tree drawings, two ground variants and one wrap repaint.
The difficult winter glowing tree and dome each received two variants;
**1b / 3b** were selected. The remaining tree selections are **a**. Ground
**a** was selected over b's broader corner deposits. Exact prompts are saved
in each source PNG's `Prompt` metadata.

Tree paintings are magenta-keyed and BOX-registered to the summer bounds on
**768×768** canvases, locked to explicit material palettes, then reduced by
the exact RGBA mode of **all 64 samples in each 8×8 footprint**, including
transparency. Ties use lexicographic RGBA order. Painted plant colours and
snow are composited through source-derived material masks. Original
planters, structural frames and lamp pixels are copied without quantization;
the glowing tree's exposed trunk light channels are protected too. The
native outline pass retains the inherited one-pixel contours and checks new
shadow edges; it required **zero additional colour repairs** after the final
palette reduction. An unused black palette slot found by validation was
removed before final reduction. Every sprite is a single connected component,
with alpha **0/255** and **zero RGB under transparency**. Final sprites retain
**115–181 opaque colours**, including the unmodified source hardware palette.

Ground paintings are BOX-registered to **1152×1152**, palette-locked and
reduced by the exact RGBA mode of **all 16 samples per 4×4 footprint**. Only
drawn snow is transferred onto the original paving. A half-offset inspection
rejected the separate wrap repaint because it introduced a snow ledge across
an exposed slab. The final wrap instead registers continuous snow strips from
the selected painting's matching **144 px panel phase**, with minimum-error
hard cuts through a narrow cross. No painted grey slabs replace the original
paving. The offset outer three-pixel ring is retained; **87 isolated snow
reduction pixels** are removed by restoring their exact summer pixels.
Code only registers, reduces, palette-locks, cleans, wraps and composites
drawings; selection masks do not draw artwork or noise.

**Protected-pixel measurements:** coordinates are zero-based, with
right/bottom exclusive. Each season has the same listed bounds as summer.
The protected masks include hardware and adjacent unchanged source material;
the light masks are their cyan lamp/channel subset. Counts below are literal
RGBA pixel comparisons against `reference/r14/scifi-tree-N.png`.
Changed counts are ordered **autumn / winter / spring**.

| Index | Summer = seasonal bounds | Visible size | Protected pixels | Protected changed | Light pixels | Lights changed |
|---|---|---|---:|---|---:|---|
| 0 — ring bonsai | (11, 13, 85, 91) | 74×78 | 1,305 | 0 / 0 / 0 | 54 | 0 / 0 / 0 |
| 1 — glowing tree | (8, 9, 88, 91) | 80×82 | 1,436 | 0 / 0 / 0 | 245 | 0 / 0 / 0 |
| 2 — hedge box | (7, 24, 89, 79) | 82×55 | 1,691 | 0 / 0 / 0 | 86 | 0 / 0 / 0 |
| 3 — heated dome | (6, 15, 90, 83) | 84×68 | 2,364 | 0 / 0 / 0 | 45 | 0 / 0 / 0 |

All planter silhouettes and all protected RGBA values match summer exactly.
Eleven partners also retain the **entire summer alpha mask**. Winter tree 1
opens its branching crown: **833 alpha differences**, confined to the plant,
with the same overall bounds and unchanged planter. Seasonal luminous foliage
is editable plant material; the fixed lamps and exposed trunk channels remain
exact. The source masks and coloured mask previews are retained for inspection.

**Ground measurements:** **8,249 snow pixels / 82,944 = 9.95%** coverage;
the remaining **74,695 pixels (90.05%)** are exact summer paving.
The final ground has **19 colours**, full opacity, square edges and readable
panel joints, fasteners and inset handles. Mean absolute RGB steps across
left/right and top/bottom wraps are **9.07 / 6.78**, versus **7.31** across
internal horizontal neighbours. The tiled paving's intentional panel joins
remain; no added image-boundary line was found in the final repeat.

**QC and review:** visually inspected every final file at **1× and exact
nearest-neighbour 4×**, all seasons on town paving, winter on both summer and
winter ground, a twelve-planter winter town crop, alternatives, the half-offset
ground, horizontal/vertical joins and the four-way wrap junction. Compared the
outlines, lighting and snow with the supplied summer sources and neighbouring
approved sci-fi art. No detached sprite specks, magenta fringe, backing
rectangles, fog, blur or rounded paving perimeter remains. This is visual
self-review, without an independent critic or live-game verdict.

There are **56 final proof PNGs (28 pairs)** in `review/r14-D-*.png`:
individual seasonal trees, seasonal rows, season comparison, winter-on-summer
row, winter town, alternatives, ground, literal unlabelled **3×3 repeats**
of winter and reference summer ground, half-offset and wrap close-ups.
Every delivered file has a native proof and a nearest-neighbour 4× proof.
The winter repeat is **864×864 at 1× / 3456×3456 at 4×**.

Validation recomputed **377,856 exact mode blocks / 12,238,848 samples**,
checked all 28 exact enlargements and 18 literal repeat crops, reconstructed
the final wrapped ground plus recorded cleanup, and checked native dimensions,
palette membership, connected sprites, alpha, hidden RGB, bounds, individual
proof placement and every protected-pixel comparison. **All 2,825 protected
starting files remain byte-identical**, including Parts A–C, every reference,
approved neighbouring art and the brief.

Sources, alternatives, edit targets, masks and processing stages are retained
among **168 Part D review/source/stage PNGs**. `review/r14-D-seasons-1x.png`
embeds the processing, mask, wrap, cleanup, review and validation recipes plus
machine-readable results. `review/r14-D-reference.png` embeds baseline
hashes. Only the thirteen named outputs, Part D review PNGs and this top note
changed. **No commit, push or branch change.**

---

# Round 14 — Part C: critic-r14C-3 redraw

Repaired only **`treeline_forest@winter-2.png` and `-5.png`** (48×48).
Connected secondary branches now recover the oak's low-right lobe and left
shoulder, and both low sapling lobes. The oak keeps its existing main forks,
upper snow ledges and attached rust leaves. All six passing trees, summer
partners and conifers are byte-identical.

**Method:** six large built-in image-tool paintings on solid magenta, three
variants per tree; selected **2c / 5c**. BOX registration on 384×384, painted
row/column-band registration, fixed palette lock, exact RGBA mode of every
8×8 block, summer-mask compositing and original feet. The oak composites its
previous main forks over the new secondary branches. Two source-supported
one-pixel contour repairs and 65 shadow-side colour corrections finish the
composite; selected reduction stages have 20 recorded cleanup pixels.
Code only registers, reduces, cleans and composites the drawings.

**Measured summer = winter:** zero-based bounds with right/bottom exclusive;
foot x endpoints inclusive. Foot spans below are ordered **y=41 / 42 / 43 / 44**.
All eight have **zero row/column extremity mismatches, zero missing summer
outer-contour pixels, zero pixels outside summer and zero foot-mask XOR**.

| Index | Bounds | Visible size | Foot x spans, rows 41–44 |
|---|---|---|---|
| 0 | (6, 8, 41, 45) | 35×37 | 21–24 / 21–24 / 21–25 / 21–25 |
| 1 | (10, 6, 37, 45) | 27×39 | 21–25 / 22–24 / 22–25 / 21–25 |
| 2 | (4, 12, 43, 45) | 39×33 | 20–24 / 20–24 / 19–24 / 21–25 |
| 3 | (6, 9, 41, 45) | 35×36 | 21–25 / 21–26 / 21–26 / 22–25 |
| 4 | (10, 6, 37, 45) | 27×39 | 21–25 / 21–25 / 21–25 / 21–24 |
| 5 | (5, 12, 43, 45) | 38×33 | 22–26 / 21–26 / 20–27 / 20–27 |
| 6 | (7, 10, 41, 45) | 34×35 | 21–25 / 21–25 / 21–25 / 21–25 |
| 7 | (10, 6, 38, 45) | 28×39 | 22–25 / 22–25 / 22–25 / 22–25 |

**Checks:** rebuilt 18 review-sheet pairs, including the reference-layout
4×2 winter-grass atlas, 45-tree woodland and 60-tree mixed-conifer strips
on winter and summer grass. Inspected native, 4× and close-up views.
Hard alpha 0/255, zero hidden RGB, connected sprites, palettes, **13,824 mode
blocks**, 18 exact 4× pairs, two 8× pairs and 210 strip placements pass.
**2,517 protected starting files** remain byte-identical. Visual self-review;
no new independent critic or live-game verdict.

Sources/prompts and processing records: `review/r14-C-critic3-*.png` metadata.
Measurements, review recipe and validation are embedded in
`review/r14-C-trees-1x.png`. No commit, push or branch change.

---

# Round 14 — Part C: critic-r14C-2 redraw

Redrew only **`treeline_forest@winter-2.png` and `-5.png`**, both 48×48.
The oak now has open branching fans, short upper snow ledges and three
attached rust-leaf accents. The sapling has connected juvenile forks and
the original high-right/low-left asymmetry. The six passing trees, summer
partners and every conifer remain byte-identical.

**Method:** five large built-in image-tool paintings on solid magenta:
three oak variants and two saplings; selected **2c / 5a**. BOX registration
on 384×384, fixed bark/snow/leaf palettes, exact RGBA mode over every 8×8
block, summer-mask compositing, original feet on rows 41–44, and **47**
recorded cleanup pixels. Three one-pixel joins recover painted leaf stems
and a fork; three terminal pixels move one pixel to align the oak's apex
and shoulders. Registration preserves the envelope while fork ends remain
open. Code only registers, reduces, cleans and composites the drawings.

**Measured summer = winter:** zero-based bounds, right/bottom exclusive;
foot x endpoints inclusive. All feet end on **row 44**; all four-row foot
masks match exactly.

| Index | Bounds | Visible size | Foot x | Centre x |
|---|---|---|---|---:|
| 0 | (6, 8, 41, 45) | 35×37 | 21–25 | 23 |
| 1 | (10, 6, 37, 45) | 27×39 | 21–25 | 23 |
| 2 | (4, 12, 43, 45) | 39×33 | 21–25 | 23 |
| 3 | (6, 9, 41, 45) | 35×36 | 22–25 | 23.5 |
| 4 | (10, 6, 37, 45) | 27×39 | 21–24 | 22.5 |
| 5 | (5, 12, 43, 45) | 38×33 | 20–27 | 23.5 |
| 6 | (7, 10, 41, 45) | 34×35 | 21–25 | 23 |
| 7 | (10, 6, 38, 45) | 28×39 | 22–25 | 23.5 |

**Checks:** regenerated the Part C sheets and added before/after and close-up
proofs. Inspected 1×/4× trees, the reference-layout 4×2 winter-grass atlas,
45-tree woodland and 60-tree mixed-conifer strips, plus 8× close-ups.
Hard alpha, zero hidden RGB, single connected sprites, zero pixels outside
summer masks, 11,520 exact mode blocks, 16 exact 4× pairs and all 105 strip
placements pass. **2,623 protected starting files** are byte-identical.
Visual self-review only; no new independent critic or live-game check.

Sources and prompts: `review/r14-C-critic2-source-*.png` metadata; processing
and cleanup: `review/r14-C-critic2-stage-*-native.png` metadata. The rebuilt
`review/r14-C-trees-1x.png` embeds the review recipe and validation results.
No commit, push or branch change.

---

# Round 14 — Part C: critic-r14C-1 redraw

Redrew all eight failed `out/treeline_forest@winter-0..7.png` files at
**48×48**, restoring summer apexes, shoulders and asymmetric lobes.
0/2/6 are oaks, 1/4 beeches, 3/7 pale birches, and 5 a smaller sapling;
2 and 4 retain attached dead brown leaves. Bare branches carry upper snow.

**Method:** twelve large image-tool paintings on solid magenta, including
second variants for 2/4/5/7. Selected **0a/1a/2b/3a/4b/5b/6a/7b**.
BOX registration to 384×384, local painted-band registration to summer
row/column extents, 15-colour palette lock, exact RGBA mode of every 8×8
block, summer-mask compositing, exact feet on rows 41–44, and one-pixel
cleanup. **64 cleanup pixels**, including 16 terminal-contour restorations.
Code constructs no shapes or noise. Alpha is **0/255**; hidden RGB is zero.

**Measurements:** zero-based bounds `(left,top,right-exclusive,bottom-exclusive)`;
foot ranges inclusive. Summer and winter are identical:

| Index | Bounds | Visible size | Foot row | Foot x | Centre x |
|---|---|---|---:|---|---:|
| 0 | (6, 8, 41, 45) | 35×37 | 44 | 21–25 | 23 |
| 1 | (10, 6, 37, 45) | 27×39 | 44 | 21–25 | 23 |
| 2 | (4, 12, 43, 45) | 39×33 | 44 | 21–25 | 23 |
| 3 | (6, 9, 41, 45) | 35×36 | 44 | 22–25 | 23.5 |
| 4 | (10, 6, 37, 45) | 27×39 | 44 | 21–24 | 22.5 |
| 5 | (5, 12, 43, 45) | 38×33 | 44 | 20–27 | 23.5 |
| 6 | (7, 10, 41, 45) | 34×35 | 44 | 21–25 | 23 |
| 7 | (10, 6, 38, 45) | 28×39 | 44 | 22–25 | 23.5 |

All row/column extents match: **zero pixels outside summer, zero missing
summer contour pixels, zero foot-mask differences**. Alpha differences
are confined to internal branch openings.

**Checks:** regenerated 26 final review PNGs, including 1×/4× trees, 4×2
atlas, 45-tree woodland, 60-tree mixed/conifer strip, season comparisons,
alternatives, contour overlays and ground repeats. Inspected native/4×
views: dense bare woodland beside conifers, attached snow, no detached
specks or haze. Self-review only; no new independent critic or live-game check.

All **27,648 mode blocks / 1,769,472 samples**, recorded cleanup, 13 exact
4× pairs, 18 ground-repeat crops, dimensions, 7–13-colour palettes,
connectivity and composite placements pass. **2,504 protected starting
files** remain byte-identical, including conifers and original critic evidence.

Sources/recipes use `review/r14-C-critic1-*.png` metadata; measurements and
validation are embedded in `review/r14-C-trees-1x.png`. Only the eight
outputs, Part C review PNGs and this note changed. **No commit, push or
branch change.**

---

# Round 14 — Part C

Added **`out/treeline_forest@winter-0..7.png`**, eight transparent **48×48**
winter broadleaf trees. The crowns are bare branching networks with narrow
snow ledges on their upper boughs, following the supplied town winter-tree
references. Indices **0/2/6** are varied oaks, **1/4** beeches, **3/7** pale-trunk
birches, and **5** a smaller, low spreading sapling. **2 and 4** retain a few
attached dead brown leaves. Top-left light, warm dark outlines and cool snow
sit beside the unchanged winter conifers at the same native pixel scale.

**Method:** eleven separate built-in image-tool drawings/repaints on solid
magenta: one for each tree and second variants for **0, 2 and 4**. Selected
**0b / 1a / 2a / 3a / 4b / 5a / 6a / 7a**. The second oak 0 preserves stronger
snow strokes after reduction; oak 2's first painting retains the clearer leaf
clusters; beech 4's repaint makes its few hanging leaves more readable.
Magenta is keyed out, each drawing is cropped and BOX-registered to its
summer partner's measured bounds on a **384×384** canvas. An explicit
**15-colour** bark, birch, snow and dead-leaf palette is locked before reduction.
Every native pixel is the exact RGBA mode of **all 64 samples in its 8×8
footprint**, including transparency; ties use stable lexicographic order.
Nearest neighbour is used only for review enlargement.

Native cleanup removes detached reduction fragments. The original summer
trunk-foot alpha on rows **41–44** is composited exactly, with bark colours
mapped to the winter palette (pale bark for the birches). A one-pixel contour
pass resolves the exposed trunk sides and bottom without changing alpha.
Across the selected eight, the recorded mode-to-final cleanup changes
**134 pixels**, including **20 contour-colour corrections**. Code registers,
reduces, palette-locks, cleans and composites the drawings; it constructs no
tree shapes or noise. Alpha is strictly **0/255**, with **zero RGB** under
transparency. Each final sprite is one connected silhouette, using **9–12**
opaque colours.

**Measurements:** coordinates are zero-based. Bounds are
`(left, top, right-exclusive, bottom-exclusive)`; foot-column ranges below
are inclusive. The summer and winter measurements in every row are identical.
All eight feet end on **row 44**, with three transparent rows below. The full
four-row trunk-foot masks on **41–44** differ by **zero pixels** for all eight
partners. Bare crowns retain the measured envelope while opening gaps between
branches.

| Index | Tree | Summer = winter bounds | Visible size | Foot row | Foot columns | Foot centre x |
|---|---|---|---|---:|---|---:|
| 0 | Rounded oak | (6, 8, 41, 45) | 35×37 | 44 | 21–25 | 23 |
| 1 | Upright beech | (10, 6, 37, 45) | 27×39 | 44 | 21–25 | 23 |
| 2 | Spreading oak, dead leaves | (4, 12, 43, 45) | 39×33 | 44 | 21–25 | 23 |
| 3 | Silver birch | (6, 9, 41, 45) | 35×36 | 44 | 22–25 | 23.5 |
| 4 | Beech, dead leaves | (10, 6, 37, 45) | 27×39 | 44 | 21–24 | 22.5 |
| 5 | Small spreading sapling | (5, 12, 43, 45) | 38×33 | 44 | 20–27 | 23.5 |
| 6 | Crooked oak | (7, 10, 41, 45) | 34×35 | 44 | 21–25 | 23 |
| 7 | Slender birch | (10, 6, 38, 45) | 28×39 | 44 | 22–25 | 23.5 |

**QC and review:** inspected all eight at native **1×**, exact nearest-neighbour
**4×**, and enlarged native working views. The **192×96** atlas follows the
reference's literal **4×2** arrangement over `grass@winter-base`. A **432×144**
forest strip contains **45** fully visible broadleaf trees on a **24 px × 20 px**
staggered lattice; alternate rows shift **12 px**. A second strip contains
**60** trees across a broadleaf/conifer boundary. Crowns overlap into woodland,
with visible branch gaps and trunks; the sapling stays lower and lighter.
Separate proofs compare every tree with its summer partner and the eight
unchanged conifers. No detached specks, magenta fringe, green winter canopy,
backing square, blur or haze remains. This is visual self-review against the
brief, without an independent critic verdict or a live-game check.

The **20 final proof PNGs** are `review/r14-C-{trees,trees-atlas,forest-strip,
mixed-forest-strip,conifer-comparison,season-comparison,alternatives,
winter-grass-3x3,summer-grass-3x3,winter-grass-junction}-{1x,4x}.png`.
Both grass repeats are literal, unlabelled **3×3** copies of the unchanged
backgrounds used in the proofs; no ground asset was redrawn for Part C.
Validation checks **18** repeat crops and **10** exact 4× enlargements.

All **25,344 mode blocks / 1,622,016 source samples** across the eleven
paintings were recomputed. Saved mode reductions plus recorded cleanup
reproduce every native candidate exactly; the selected candidates match the
eight output files. Dimensions, palette membership, hard alpha, zero hidden
RGB, connectivity, exact summer bounds/foot masks, atlas compositing and all
strip placements pass. **All 2,411 protected starting files remain
byte-identical**, including every conifer, summer tree, ground, other part's
art, brief and supplied reference.

Sources and exact prompts are retained in `review/r14-C-source-*.png`
(prompt metadata); registered, palette-locked, mode and cleaned stages use
`review/r14-C-stage-*.png`. Cleaned-stage metadata contains the processing
recipe and pixel cleanup records. `review/r14-C-trees-1x.png` embeds the review
recipe, validation script and machine-readable measurements/results;
`review/r14-C-reference.png` embeds the baseline hashes and original summer
measurements. There are **87 Part C review/source/stage PNGs** in total.
Only the eight named outputs, these Part C PNGs and this top note were written
in the checkout. **No commit, push or branch change.**

---

# Round 14 — Part B: critic-r14B-1 redraw

Repaired the **seven failed outputs**: summer hills **1/3**, their autumn/winter
partners, and autumn hill **4**. All **17 passing Part B sprites** remain
byte-identical. The small hills now have rounded descending shoulders, two
wrapping terraces and connected grass tufts; 3's tiny stone stays subordinate.
They are 38 px wide, 25/26 px high, with contact feet on row 43. Autumn 4 keeps
summer 4's crests, stone and contour, with clean tawny planes and a solid
darker overlap band.

**Method:** thirteen built-in image-tool drawings/repaints on solid magenta:
three variants/refinements per summer hill, two for autumn 4 and winter 3,
and one each for the other partners. Selected summer **c/c**, autumn
**a/a/a**, winter **a/b**. BOX registration to 384×384/768×768, palette lock,
exact RGBA mode of every 8×8 block, and one-pixel outline cleanup follow the
earlier method. Autumn paint votes transfer through summer material regions;
opaque winter snow paintings use the exact summer mask. Code constructs
no terrain shapes or noise.

**Validation:** all sixteen seasonal masks differ by **0 pixels**, including
contact feet. Dimensions, palette, hard alpha 0/255, zero hidden RGB,
connectivity and dark boundaries pass. All **23,040 mode blocks** and recorded
cleanup reproduce the seven outputs. Other art and the original critic
report are unchanged.

Regenerated all **22 final review PNGs**, including three **24-hill** forest-edge
crops; added autumn/winter sheets on summer grass. Inspected native/4× views,
autumn 4 at 8× and mountain/tree scale comparisons. Thirteen exact 4× pairs
and 27 ground-repeat copies pass. Winter uses the existing reference forest
atlas. This is self-review, without a new independent critic verdict.

Sources and exact prompts are in `review/r14-B-critic1-source-*.png` metadata;
stages/cleanup share that prefix. Prop proofs embed repair recipes; the summer
map proof embeds validation. Only the seven outputs, Part B review PNGs and
this note changed. **No commit, push or branch change.**

---

# Round 14 — Part B

Redrew **all eight summer hills** under the owner override dated 2026-11-14
08:38 UTC, then made their autumn and winter partners: **24 transparent PNGs**.
The former rock piles are grassy hills too. Indices 0–3 are individual raised
knolls with rounded crests, varied shoulders and short slope contours; 4–7
are rolling groups with two or three overlapping crests. Sparse grass tufts,
a few embedded stones and small foot shrubs give the slopes landscape scale.
Top-left light, darker lower-right slopes and one-pixel dark outlines separate
them from the grass. The groups are lower and rounder than the approved peaks.
All feet have an attached dark contact edge, without a ground square.

**Files:** replaced `out/hills-prop-0..7.png` and
`out/hills@winter-prop-0..7.png`; added `out/hills@autumn-prop-0..7.png`.
Autumn uses tawny olive, khaki and muted ochre alongside Part A's current
`grass@autumn-base.png`. Winter has opaque white/blue snow faces, blue-grey
right slopes and a thin dark earth line at the foot. Autumn preserves the
summer stones; winter gives the existing stone regions snow/grey colours.
All sixteen seasonal alpha comparisons are **exactly zero differing pixels**,
including the contact edges: no shadow exception was needed.

**Method:** 26 separate built-in image-tool drawings/repaints on solid magenta:
ten summer drawings (two alternatives each for 0 and 2), eight autumn and
eight winter repaints of the new summer sprites. The second summer drawings
were selected for 0's stronger height and 2's clearer terrace marks. Magenta
is keyed out, each drawing is cropped and BOX-registered to its native bounds
on a **384×384** canvas for 48 px sprites or **768×768** for 96 px sprites.
An explicit 11-colour grass/stone, autumn/stone or snow/earth palette is locked
before reduction. Every native pixel is the exact RGBA mode of **all 64
samples in its 8×8 footprint**, including transparency; ties use a stable
lexicographic order. Nearest neighbour is used only for enlargement.

Seasonal paintings are registered to each final summer bounding box and
composited through that exact summer mask. Material cleanup retains permanent
stone regions, removes newly invented stones from grass tufts, and keeps the
source terrace/overlap marks registered. Boundary cleanup resolves the contour
at one native pixel; isolated bright reduction remnants are removed. The final
recorded cleanup/transfer counts are **704 summer, 92 autumn and 274 winter
pixels**. Validation caught and corrected a neighbour-vote case that could
copy the outline colour inward. Code registers, reduces, palette-locks, cleans
and composites drawings; it constructs no hill shapes, textures or noise.
Alpha is strictly **0/255**, and RGB under transparency is **0,0,0**.

**Measurements:** visible bounds include the contact edge; fill is visible
width divided by cell width. All three seasons share these bounds and opaque
pixel counts. Snow coverage counts the six opaque snow/shadow palette colours
as a percentage of the entire winter silhouette, including its outline,
exposed earth and stone in the denominator.

| Index | Canvas | Visible bounds | Width fill | Opaque pixels | Winter snow |
|---|---|---|---:|---:|---:|
| 0 | 48×48 | 38×28 | 79.17% | 790 | 87.97% |
| 1 | 48×48 | 38×26 | 79.17% | 678 | 86.43% |
| 2 | 48×48 | 38×26 | 79.17% | 676 | 86.09% |
| 3 | 48×48 | 38×27 | 79.17% | 729 | 86.56% |
| 4 | 96×96 | 82×53 | 85.42% | 2,964 | 92.95% |
| 5 | 96×96 | 82×49 | 85.42% | 2,636 | 92.68% |
| 6 | 96×96 | 82×51 | 85.42% | 2,974 | 92.70% |
| 7 | 96×96 | 82×50 | 85.42% | 2,707 | 92.65% |

Small feet finish on row **43**, large feet on row **88**. Every small sprite
has five clear columns on either side; every group has seven. Final sprites
use **6–10 opaque colours** each. The eight summer shapes are unique, and all
24 final pixel arrays are unique.

**QC and review:** inspected the complete seasonal sets at native **1×** and
exact nearest-neighbour **4×**, the three **640×432** map-like crops with
**24 fully visible hills per season** beside a forest edge, the seasonal
comparison and a direct scale comparison with approved mountain/tree art.
The hills retain rounded elevated profiles, readable overlaps and attached
feet; no detached specks, magenta fringe, rectangular backing, haze or soft
alpha remain. The winter treatment reads as snow on raised ground. This is
visual self-review against the supplied critic criteria, without a new
independent critic verdict or a live-game check.

Summer/autumn forest edges use the unchanged `treeline_forest-*` and
`treeline_forest@autumn-*` files. No winter partners are present in `out/`, so
the winter scene uses the eight 48 px cells of the supplied
`reference/r14/fantasy-treeline_forest@winter-0.png` atlas. That reference still
shows the existing snow-dusted canopies; Part C was not changed.

The **22 final proof PNGs** are `review/r14-B-{summer,autumn,winter}-
{props,map,ground-3x3}-{1x,4x}.png`, plus
`review/r14-B-{seasons,scale-comparison}-{1x,4x}.png`. The three ground repeat
pairs are literal, unlabelled **3×3** copies of the unchanged matching grass
bases; no ground asset was redrawn for B. All **27** repeat crops and all
**11** exact 4× enlargements pass byte comparisons.

All **138,240 mode blocks / 8,847,360 source samples** were recomputed.
Saved reductions plus recorded cleanup reproduce every final sprite exactly.
Dimensions, palette membership, hard alpha, zero hidden RGB, single connected
silhouettes, one-pixel boundary contours, all sixteen seasonal masks and full
map placement bounds pass. **All 2,114 protected files remain byte-identical**,
including Part A, the brief, references, trees, mountains and other art.

Sources and alternatives are retained as `review/r14-B-source-*.png`, with
exact prompts in PNG metadata. Registration, palette-lock and mode stages
are `review/r14-B-stage-*.png`; enlarged seasonal edit targets are
`review/r14-B-edit-summer-*.png`. Processing scripts and pixel cleanup records
are embedded in the three `r14-B-*-props-1x.png` proofs. The review recipe,
placements, validation script and machine-readable results are embedded in
`review/r14-B-summer-map-1x.png`; baseline hashes are embedded in
`review/r14-B-reference.png`. There are **129 new Part B review/source/stage
PNGs** in total. Only the 24 named outputs, those Part B PNGs and this top note
changed. No commit, push or branch change.

---

# Round 14 — Part A: critic-r14A-1 redraw

Repaired all nine failed Part A files. Five image-painted turf patches replace
the base's isolated rust landmarks; the existing wrap edges are unchanged.
All eight details now use their summer geometry: **zero differing alpha
pixels**, identical bounds, leaf/blade positions and native contours. The
stone, stump, mushroom ring and rock pair retain their original permanent
materials; vegetation and flower/seed colours now read tawny olive, khaki
and dry ochre. The mushroom ring's centre remains open.

**Method:** twelve built-in image-tool repaints on solid magenta: two base
variants and ten detail paintings, including alternatives for 0 and 3.
Selected base variant 2 is BOX-registered to 1152×1152, reduced by the exact
RGB mode of all 16 samples per 4×4 block, palette-locked and composited through
minimum-error cuts around the five repairs. Detail paintings are
BOX-registered to 384×384, magenta-keyed, palette-locked and reduced by the
exact RGBA mode of all 64 samples per 8×8 block. Painted colour votes transfer
through the original material regions; source dark contours are retained
during palette cleanup. Code constructs no shapes or noise. Alpha is 0/255,
with zero RGB under transparency.

**Checks:** inspected native 1× and nearest-neighbour 4× assets, literal 3×3
repeats, wrap junction, all details on summer/autumn grounds and season pairs.
New base mean RGB is **153.41, 139.76, 63.57**; hue **50.89°**, HSV value
**60.16%**, luma **137.16**. All lie between summer grass and autumn plains.
The eight summer alpha masks, including source seed-head gaps, are exact.
This is visual self-review following the supplied critic, without a new
independent verdict or live-game check.

Regenerated the twelve existing final `review/r14-A-*.png` proofs and added
season-pair and repaired-area proofs. Repaint sources, alternatives and
registration/mode stages use `review/r14-A-source-critic1-*.png`; exact
prompts are in source PNG metadata. Processing/review scripts and validation
are embedded in `review/r14-A-base-1x.png`. Protected-output hashes pass,
including unchanged `plains@autumn-base.png`, summer partners, references and
the supplied critic report. This task changed only the nine Part A outputs, Part A review PNGs
and this note. A concurrent owner update added Part B instructions to
`BRIEF-14.md`; Part A was unchanged and that edit was left intact.
No commit, push or branch change.

---

# Round 14 — Part A

Replaced only **`out/grass@autumn-base.png` (288×288)** and
**`out/grass@autumn-detail-0..7.png` (48×48 each)**. The base is a quiet
late-season meadow: tawny olive and khaki turf, small dry ochre strokes,
five readable fallen-leaf clusters and **1.56%** subdued green remnants.
The eight details are an upright dry tuft, three fallen leaves, windswept
grass, short seed stalks, curled oak litter, an olive-rooted tuft, flattened
straw with leaves, and a paired tuft. Their visible widths are 20–27 px,
with at least **10 clear pixels** between artwork and every cell edge.
The base is opaque RGBA; the details have transparent backgrounds.

**Method:** thirteen built-in image-tool drawings: two base variants, one
half-offset seam repaint, and ten individual detail drawings. The first
base variant was selected over the second's checkerboard texture. Detail 0
was redrawn for better definition; detail 3 was redrawn with shorter,
sturdier stems after its first reduction left floating seed heads.
Large initial drawings use solid magenta. The base's straight square is
cropped from that surround and BOX-registered to **1152×1152**; the exact
RGB mode of all **16 samples per 4×4 footprint** produces 288×288 pixels.
Luminance registration and an explicit **eight-colour** palette establish
the tawny/khaki range. A 144-pixel offset brings joins to the centre.
The separately mode-reduced seam painting is transferred through a narrow
cross using minimum-error hard cuts; its outer three-pixel ring is excluded
from seam transfer. Final colour registration and removal of small stray
rust marks retain the painted turf and five larger leaf clusters.

Details are magenta-keyed, aspect-registered on **384×384** canvases, locked
to a **15-colour** earth/olive/straw palette, and reduced by the exact RGBA
mode of all **64 samples per 8×8 footprint**, including transparency.
Native contour cleanup removes **nine pixels** of detached tip remnants.
All eight final silhouettes are connected; alpha is strictly 0/255, and
transparent RGB is zero. Top-left highlights, darker lower-right edges and
native-pixel contours come from the drawings. Code registers, reduces,
palette-locks, cleans, wraps and composites; it constructs no terrain
shapes or noise.

**Measurements:** whole-tile mean RGB; hue and HSV value calculated from
that mean. “Luma” is the weighted RGB-code value
`0.2126 R + 0.7152 G + 0.0722 B`, on a 0–255 scale.

| Ground | Mean RGB | Hue | HSV value | Luma |
|---|---|---:|---:|---:|
| Summer grass | 100.32, 121.57, 46.69 | 77.03° | 47.68% | 111.65 |
| Previous autumn grass | 119.00, 125.77, 66.55 | 66.86° | 49.32% | 120.06 |
| **New autumn grass** | **153.37, 139.72, 63.56** | **50.88°** | **60.14%** | **137.12** |
| Autumn plains, unchanged | 205.22, 146.52, 69.17 | 34.11° | 80.48% | 153.42 |

Every new mean RGB channel falls strictly between the summer and plains
references. Hue is separated from summer by **26.15°** and plains by
**16.77°**; value and luma also fall between them.

**QC:** inspected every final asset at **1× and exact nearest-neighbour 4×**,
details over both matching autumn and summer grass, a sparse eight-detail
meadow, the seasonal comparison, literal **3×3 repeats**, and the four-way
wrap junction. No hard tile join, rounded tile perimeter, large repeating
blob, haze, magenta fringe, ground backing or detached sprite speck was
found. Mean absolute RGB step across left/right and top/bottom wraps is
**3.59 / 3.92**, compared with **2.82** inside the texture. Small individual
leaf placements remain locatable when deliberately studying repeated tiles.
This is visual self-review, without an independent critic or live game check.

Validation passes all nine dimensions, palette membership, hard alpha,
zero hidden RGB, connected detail silhouettes, margins, exact reconstruction
of all eight palette-locked mode reductions plus documented cleanup, all
nine repeat placements, sixteen detail-proof placements, and all six exact
4× proof enlargements. **All 2,001 protected files remain byte-identical**,
including `plains@autumn-base.png`. No commit, push or branch change.

Twelve final proofs are in `review/r14-A-{base,base-3x3,wrap-junction,
details,meadow,season-comparison}-{1x,4x}.png`. Thirteen large source
paintings and alternates are retained as `review/r14-A-source-*.png`;
each contains its exact prompt in the PNG `Prompt` text field. The
machine-readable validation results are embedded in
`review/r14-A-base-1x.png` as `Validation`. Only the nine Part A outputs,
these new `r14-A-*.png` files and this top note changed.

---

# Round 5 — Part A2: native 96 px mountains

Replaced only the sixteen Part A2 peak sprites with fresh **96×96 RGBA**
drawings. Indices 0–2 are large massifs (double summit, long ridge shoulder,
three crests); 3–5 are medium forms (flat crag, sharp spike, crooked ridge);
6–7 are small rounded/stepped rocky knolls. Final widths are **82, 80, 76,
60, 52, 52, 40 and 36 px** in both seasons. Large heights are 66–74 px.
All feet end on **row 93**, centred exactly in the cell. Summer uses lighter
cool-grey left faces, dark slate right faces, strata and attached olive grass.
Winter has bold upper snow caps, blue-white shade and exposed shadow-side rock.
The two approved mountain bases and every other output remain byte-identical.
No commit or push.

**Method:** sixteen separate built-in image-tool drawings, with each winter
painting based on its corresponding new summer landform. No old 48 px sprite
was enlarged. Solid magenta is removed with hard alpha before registration
on **768×768** canvases. Each native pixel is the exact raw RGBA mode of all
**64 samples** in its 8×8 footprint, followed by an explicit cool-rock,
olive/snow palette lock. Disconnected key specks are removed and the contour
is resolved at one native pixel. A coordinate brush pass trims side/foot
whiskers and repairs the resulting outline: **38 native pixel edits**.
Alpha is 0/255; transparent RGB is zero. Code registers, reduces, cleans and
composites the drawings; it does not construct mountain shapes or noise.

**QC:** read the full fifth brief, earlier briefs and named reference images;
compared approved markers, round-2 tiles, paddies and all seasonal grass/plains.
Inspected contact sheets, dense ranges and ragged edges at **1× and exact
nearest-neighbour 4×**, and individual sprites at **8×**. Lattice spacing is
**48 px horizontally, 30 px between rows, alternate rows shifted 24 px**;
later rows cover earlier rows. The 288×288 map crop has overscan, avoiding
artificial empty borders. Broad and low forms break up the pointed skyline;
light rock separates from the brown base, and winter reads as snow on rock.
The first edge proof's square ground boundary was replaced with a curved
review mask; no terrain asset was changed. Rechecked both unchanged bases
in literal **3×3** repeats and enlarged wrap intersections. No hard wrap seam,
key fringe, rectangular sprite backing or clipped sprite was found.

Validation passes native dimensions, all size bands, bottom/centre placement,
connected silhouettes, palette membership, hard alpha/zero hidden RGB,
one-pixel contours, all sixteen exact mode reductions, upper snow coverage,
18 repeat crops, exact 4× proof scaling and the complete workspace hash scope.
Only these sixteen outputs, fourteen new review PNGs and this note changed.
This is a **self-review critic loop**; no new independent critic verdict or
live in-game check is available in this art-only checkout.

Sources, exact prompt set (`generation-all.json`), registered/mode stages,
`hand-edits.json`, processing/review/validation scripts and `validation.json`
are retained outside the checkout in **`/tmp/r5A2-work/`**.

Every file written (relative to the checkout):

- `art-drop/out/mountains-peak-0.png`
- `art-drop/out/mountains-peak-1.png`
- `art-drop/out/mountains-peak-2.png`
- `art-drop/out/mountains-peak-3.png`
- `art-drop/out/mountains-peak-4.png`
- `art-drop/out/mountains-peak-5.png`
- `art-drop/out/mountains-peak-6.png`
- `art-drop/out/mountains-peak-7.png`
- `art-drop/out/mountains@winter-peak-0.png`
- `art-drop/out/mountains@winter-peak-1.png`
- `art-drop/out/mountains@winter-peak-2.png`
- `art-drop/out/mountains@winter-peak-3.png`
- `art-drop/out/mountains@winter-peak-4.png`
- `art-drop/out/mountains@winter-peak-5.png`
- `art-drop/out/mountains@winter-peak-6.png`
- `art-drop/out/mountains@winter-peak-7.png`
- `art-drop/review/r5A2-peaks-1x.png`
- `art-drop/review/r5A2-peaks-4x.png`
- `art-drop/review/r5A2-summer-base-3x3-1x.png`
- `art-drop/review/r5A2-summer-base-3x3-4x.png`
- `art-drop/review/r5A2-summer-lattice-1x.png`
- `art-drop/review/r5A2-summer-lattice-4x.png`
- `art-drop/review/r5A2-summer-ragged-edge-1x.png`
- `art-drop/review/r5A2-summer-ragged-edge-4x.png`
- `art-drop/review/r5A2-winter-base-3x3-1x.png`
- `art-drop/review/r5A2-winter-base-3x3-4x.png`
- `art-drop/review/r5A2-winter-lattice-1x.png`
- `art-drop/review/r5A2-winter-lattice-4x.png`
- `art-drop/review/r5A2-winter-ragged-edge-1x.png`
- `art-drop/review/r5A2-winter-ragged-edge-4x.png`
- `art-drop/NOTES.md`

---

# Round 5 — Part B: critic-r5B-6 redraw

Redrew only `out/wasteland-craters-base.png` and
`out/wasteland-craters@winter-base.png`, the two failed assets. The four
passing Part B bases and all 274 other outputs retain their starting bytes.
Supplied critic verdicts/composites, briefs and unrelated files are unchanged.
**No commit or push.**

Four unequal blast depressions replace the isolated three-pit triangle.
Their positions extend through the upper, right, lower and left portions of
the tile, interrupting the former broad crater-free horizontal wrap band.
The broad upper pit has a mostly collapsed front and two separated rear-wall
sections; the horizontal right pit opens into a collapsed end; the narrow
lower excavation has a nearly vertical axis and a wide ramp interrupting its
left wall; the small left hollow is shallow and mostly filled. Connected
recessed floors, inward shadows, broken rubble and quiet ash remain. A first
draft's oversized rims and repeated bright rubble fronts were revised.

Winter follows the summer footprints with different amounts of burial.
Selected inward walls remain exposed above connected blue-shadowed snow
floors, while other lip sections disappear under accumulation. Broader,
quieter snow fields and lower drift relief replace the previous dense short
shaded ridges. The shared blue-white palette and exposed earth/rubble keep
the seasonal identity beside the passing winter bases.

**Same method:** built-in image-tool paintings and targeted revisions,
BOX registration to 1152×1152, exact RGB mode voting over all sixteen source
samples per 4×4 footprint, and the existing explicit earth/snow palette.
Half-offset image-painted wrap repairs use the existing narrow central cross
and low-error hard cuts. Code registers, reduces, palette-locks and composites
the paintings; it does not draw terrain shapes or noise.

**QC:** rebuilt all fifteen existing `review/r5B-*.png` composites in their
original layouts. Seven dependent proofs changed; the eight ruin/plain
wasteland repeat proofs reproduce their previous bytes. Viewed both final
unmarked native 3×3 repeats, the seasonal board, all eight source quadrants
at exact 8× and both four-way wrap crossings at 8×. No hard wrap seam or
important clipped form was found. Individual features remain locatable when
searching a large repeated field. This is visual self-review, without a new
independent critic verdict or live in-game check.

Validation checks the exact two-output/seven-proof/note change scope,
unchanged file inventory and protected hashes, 288×288 RGB opacity, palette
membership, all four registered mode reductions, 54 repeat placements and
exact QC enlargements. Paintings, exact prompts, scripts and inspection
images are outside the checkout in **`/tmp/r5B-critic6-fix/`**, including
`generation.json`, `process.py`, `seam_lib.py`, `deliver.py`, `validate.py`
and `validation.json`.

---

# Round 5 — Part B: critic-r5B-5 redraw

Redrew only `out/wasteland-craters-base.png` and
`out/wasteland-craters@winter-base.png`, the two failed assets. All four
passing Part B bases and every other output retain their starting bytes
(274 protected outputs in total).
Supplied critic verdicts/composites, briefs and unrelated files are unchanged.
**No commit or push.**

Summer restores three connected, unequal blast depressions: a broad angular
upper pit, a taller lower-left excavation with a collapsed ramp interrupting
its wall, and a smaller shallow oblique hollow. Each has a continuous recessed
floor, a dark inward wall, unequal broken rubble lips and grouped ejecta.
Quiet ash stays subordinate to pit relief. The largest rim is about two cells
across. An oversized first draft was redrawn smaller, then clean slab-like
caps were repainted as fractured earth and rubble. Different floor outlines,
axes and degrees of rim collapse avoid three copies of one C-shaped bowl.

Winter follows those same footprints. Connected blue-shadowed snow floors
sit below exposed inward walls; snow bridges selected lip sections and buries
unequal amounts of rim. The small hollow is most buried, while the taller
left pit retains more exposed wall. Existing blue-white snow hues, drift
texture and top-left illumination are retained. Relief remains visible in
native 3×3 tilings instead of dissolving into unrelated snowy ridges.

**Same method:** built-in image-tool paintings and targeted revisions,
BOX registration to 1152×1152, exact RGB mode voting over all sixteen source
samples per 4×4 footprint, and the existing explicit earth/snow palette.
Half-offset image-painted wrap repairs use the existing narrow central cross
and low-error hard cuts. Code registers, reduces, palette-locks and composites
the paintings; it does not draw terrain shapes or noise.

**QC:** rebuilt all fifteen existing `review/r5B-*.png` composites in their
original layouts. Seven dependent proofs changed; the eight ruin/plain
wasteland repeat proofs reproduce their previous bytes. Inspected both final
native 3×3 repeats, the seasonal board, all eight source quadrants at exact
8× and both four-way wrap crossings at 8×. No hard wrap seam or important
clipped form was found. Repeated crater locations remain discoverable in
large tiled fields. This is visual self-review, not a new independent critic
verdict or a live in-game check.

Validation checks the exact two-output/seven-proof/note change scope,
unchanged file inventory and protected hashes, 288×288 RGB opacity, palette
membership, all four registered mode reductions, 54 repeat placements and
exact QC enlargements. Paintings, exact prompts, scripts and inspection
images are outside the checkout in **`/tmp/r5B-critic5-fix/`**, including
`generation.json`, `process.py`, `seam_lib.py`, `deliver.py`, `validate.py`
and `validation.json`.

---

# Round 5 — Part B: critic-r5B-4 redraw

Redrew only the two failed assets in `out/`:
`wasteland-craters-base.png` and `wasteland-craters@winter-base.png`.
The four passing Part B bases and all 274 other outputs retain their starting
bytes. Supplied critic verdicts/composites, briefs and other existing files
are unchanged. **No commit or push.**

The former wide C-shaped bowl and right-lip rubble knot are replaced by a
narrower, irregular excavation with short, separated inward-shadow shelves
and broad collapsed earth slopes. Rim stones are redistributed into low
fragments. The lower-left diagonal scar is shortened, widened and partly
filled; disconnected ash tongues and earth passages replace its attached
blotch. The third depression has a broader angular floor and different rim
exposure. Three unequal, eroded depressions remain, without the former
bowl/scar/blotch badge. An initial revision still repeated too strongly at
native scale and was repainted before delivery.

Winter follows the revised landforms. Asymmetric drifts partly bury their
floors and unequal rim sections, connecting the recesses to surrounding snow
and interrupting the former isolated blue bowl. Short inward shadows,
scattered exposed rubble and textured blue-white accumulation retain the
crater terrain's identity and the established winter palette.

**Same method:** built-in image-tool paintings and targeted revisions,
BOX registration to 1152×1152, exact RGB mode voting over all sixteen source
samples per 4×4 footprint, and the existing explicit earth/snow palette.
Half-offset image-painted wrap repairs use narrow central crosses and
low-error hard cuts. Code registers, reduces, palette-locks and composites
the paintings; it does not draw terrain shapes or noise.

**QC:** rebuilt all fifteen existing `review/r5B-*.png` composites in their
original layouts. Seven dependent proofs changed; the eight ruin/plain
wasteland repeat proofs reproduce their previous bytes. Viewed both final
native 3×3 repeats, the seasonal board, all eight source quadrants at exact
8× and both four-way wrap crossings at 8×. No hard wrap seam or important
clipped form was found. This is visual self-review, not a new independent
critic verdict or an in-game check; deliberate comparison can still locate
individual forms in a repeated texture.

Validation checks the exact two-output/seven-proof/note change scope,
unchanged file inventory and protected hashes, 288×288 RGB opacity, palette
membership, all four registered mode reductions, 54 repeat placements and
exact QC enlargements. Paintings, exact prompts, scripts, inspection images
and validation are retained outside the checkout in **`/tmp/r5B-critic4-fix/`**
(`generation.json`, `process.py`, `seam_lib.py`, `deliver.py`, `validate.py`,
`validation.json`).

---

# Round 5 — Part B: critic-r5B-3 redraw

Redrew only the four failed bases: summer and winter `wasteland-craters`
and `wasteland-ruins`. The passing plain wasteland pair, all 272 other
outputs, supplied critic verdicts/composites, briefs and other workspace
files retain their starting bytes. **No commit or push.**

Craters replace the descending three-lobed footprint with separate unequal
depressions: a broad shallow bowl, a narrower rubble-filled gouge and a
small nearly filled hollow. Their axes, depth and exposed lip lengths differ.
Broad asymmetrical ash patches and grouped rim stones replace dust-coloured
smears. The long dark secondary lip was shortened and partly collapsed after
native repeat inspection. Winter preserves the landforms with broad blue
recessed floors, differently buried rim sections, a collapsed snow slope and
unequal bowl accumulation. An oversized winter bowl draft was corrected.

Ruins dismantle the upright-wall/car/long-slab badge. Low fractured concrete
and unequal rubble masses now occupy the upper-right as well as the other
quadrants, with varied slab axes and connected dirt passages. The two small
rusty husks are separated; exposed rebar and broken fallen-pylon fragments
retain modern identity. Winter completely buries selected wall shards and
much of a long slab, blends many faces into deeper drifts, and retains unequal
secondary exposures throughout the field instead of isolating one landmark.

**Same method:** built-in image-tool paintings and targeted paint revisions,
BOX registration to 1152×1152, exact RGB mode voting over all sixteen samples
per 4×4 footprint, and the existing explicit earth/concrete/rust/snow palette.
Half-offset image-painted wrap repairs use narrow central crosses and
low-error hard cuts. Code registers, reduces, palette-locks and composites
the paintings; it does not draw terrain shapes or noise.

**QC:** rebuilt all fifteen existing `review/r5B-*.png` composites in their
original layouts. Eleven dependent proofs changed; the four plain wasteland
repeat proofs reproduce their previous bytes. Viewed the four final native
3×3 repeats, seasonal comparison, all sixteen quadrants at exact 8× and all
four wrap intersections at 8×. No hard wrap seam or important clipped object
was found. This is visual self-review, not a new independent critic pass or
an in-game check; individual features remain locatable in a repeated texture.

Validation checks exact four-output/eleven-proof/note change scope, unchanged
workspace inventory and protected hashes, 288×288 RGB opacity, palette
membership, all eight registered mode reductions, 54 repeat placements and
exact proof enlargements. Working paintings, prompts, processing scripts,
inspection images and validation are outside the checkout in
**`/tmp/r5B-critic3-fix/`** (`generation-all.json`, `process.py`, `seam_lib.py`,
`deliver.py`, `validate.py`, `validation.json`).

---

# Round 5 — Part B: critic-r5B-2 redraw

Replaced only the **four failed bases** in `out/`: both seasons of
`wasteland-craters` and `wasteland-ruins`. The two passing plain wasteland
bases, every other output, and the supplied critic verdicts/evidence are
byte-identical to the start of this request. **No commit or push.**

Craters have connected recessed floors, short inward-facing back walls and
broken rubble lips, with dusty collapsed sides instead of complete rings.
The larger irregular bowl, elongated shallow excavation and small adjoining
scars have unequal profiles and contrast; the largest rim stays below two
48 px cells across. A draft with three complete oval rings was revised after
native tiled inspection. Winter retains broad blue-shadowed snow floors
below separately snow-capped rims and exposed inner walls; ash is grouped
into quiet patches rather than disconnected floor flecks.

Ruins replace the repeated upright-wall/slab islands with an overlapping
low collapse, differently angled concrete plates, buried footings and one
remaining jagged wall. A broad connected dirt gap interrupts the rubble.
Rebar, small broken fallen-pylon sections and two differently exposed rusty
wrecks remain. Winter fully buries many smaller pieces, merges slab snow into
surrounding drifts and leaves unequal broad quiet snow gaps; it no longer
gives every pebble a dark perimeter and separate white cap.

**Same method:** built-in image-tool paintings and targeted revisions,
BOX registration to 1152×1152, exact RGB mode voting over all sixteen samples
of each 4×4 footprint, and the existing explicit earth/concrete/rust/snow
palette. Half-offset image-painted wrap repairs use the established narrow
cross and low-error hard cuts. Code only registers, reduces, palette-locks
and composites the paintings; it does not construct the terrain.

**QC:** regenerated all fifteen existing `review/r5B-*.png` composites in
their original layouts. Eleven dependent proofs change; the four plain
wasteland repeat proofs reproduce their existing bytes. Inspected all four
new native 3×3 repeats, the seasonal board, all sixteen source quadrants at
exact nearest-neighbour 8× and all four wrap intersections at 8×. No hard
wrap seam or clipped important structure was found. Recognizable features
can still be traced across a large repeated field; this is visual self-review,
not a new independent critic pass or an in-game check.

Validation checks the exact four-output scope, all protected workspace
hashes, unchanged file inventory, 288×288 RGB opacity and palette membership,
all eight registered mode reductions, all 54 repeat placements and exact QC
enlargements. Only the four failed bases, eleven dependent QC PNGs and this
note changed. Sources, exact prompts, processing and validation are retained
outside the checkout in **`/tmp/r5B-critic2-fix/`** (`generation.json`,
`process.py`, `seam_lib.py`, `deliver.py`, `validate.py`, `validation.json`).

---

# Round 5 — Part B: critic-r5B-1 redraw

Redrew only the **four failed bases**: `wasteland-craters-base.png`,
`wasteland-craters@winter-base.png`, `wasteland-ruins-base.png` and
`wasteland-ruins@winter-base.png` in `out/`. The two passing plain wasteland
bases and every other output remain byte-identical to this request's start.
The supplied critic verdict and its evidence images are unchanged.

Craters now have three different profiles: a recessed broken bowl, a broad
shallow collapsed scar and a small almost-filled hollow. The largest whole rim
is below two 48 px cells across. Discontinuous rims, filled sides, subdued
shadows and irregular ash patches replace the former dark triangle. Winter
keeps those landforms, with snow-filled interiors, shaped caps on remaining
rim rocks, grouped ash/rubble exposures and quieter snow between them. A second
winter paint revision removed the draft's overly dark, continuous crater lips.

Ruins retain modern concrete, thin rebar and two partially buried rusty cars.
The former large intact fallen pylon is broken into small, separated lattice
fragments embedded in broader rubble footprints. Walls, fallen panels and low
foundation remnants have different collapse profiles; overlapping slabs, cars
and walls have unequal gaps. Winter follows the same structures, with snow
interrupting the lattice fragments and varying the exposure of wreckage.

**Same method:** built-in image-tool paintings and targeted revisions,
BOX-registered to 1152×1152, then exact RGB mode voting over all 16 samples
of every 4×4 footprint to produce 288×288 pixels. Explicit earth, concrete,
charcoal, muted rust and blue-white snow ramps lock the palette. Two additional
blue-grey snow shades retain the winter paintings' soft recessed shadows.
Half-offset image-painted wrap repairs use the established narrow cross and
low-error hard cuts. Code registers, reduces, palette-locks and composites the
paintings; it does not construct the terrain from shapes or noise.

**QC:** rebuilt all fifteen existing `review/r5B-*.png` composites with the
original layouts. Eleven dependent PNGs changed; the four plain wasteland
repeat proofs reproduce their existing bytes. Visually checked all four new
3×3 repeats at native 1×, the seasonal board, full assets at exact nearest-
neighbour 8×, and four-tile wrap intersections at 8×. The repeating dark crater
triangle and intact pylon emblem are removed; no hard wrap seam or clipped
important structure was found. Remaining individual rubble/ash arrangements
can still be located by deliberate comparison across a repeated texture.
This is visual self-review, **not a new independent critic pass**; it supersedes
the earlier delivery note's claim that all six passed the final review.

Validation verifies the exact four-output change scope, all protected files,
unchanged file inventory, 288×288 RGB opacity and palette membership, all eight
registered mode reductions, all 54 repeat placements and exact proof scaling.
Only the four failed bases, eleven dependent QC PNGs and this note changed.
Sources, exact prompts, processing scripts, full-size inspection proofs and
validation are retained in **`/tmp/r5B-critic1-fix/`** (`generation.json`,
`process.py`, `seam_lib.py`, `deliver.py`, `validate.py`, `validation.json`).
Live in-game rendering was unavailable. **No commit or push.**

---

# Round 5 — Part B: wasteland ground

Delivered only the six requested **288×288 opaque RGB** wasteland bases.
Craters have three unequal irregular blast excavations, rubble rims and ash;
the largest rim is approximately 80–85 native pixels across, below two cells.
Ruins contain collapsed modern concrete, exposed rebar, two rusted car husks,
cracked asphalt and one fallen steel pylon. Important forms remain inside the
wrap. Dry wasteland has quiet cracked earth, uneven dust pools, sparse dead
weeds and debris. All three winter grounds carry textured blue-white snow
with exposed earth and rubble; snow-palette coverage is approximately 67%,
78% and 97%, respectively.

**Method:** separate built-in image-tool paintings, plus painted scale,
seasonal and seam revisions. Each source is BOX-registered to **1152×1152**;
the exact RGB mode of all **16 samples** in every 4×4 footprint produces its
288×288 pixel. Explicit warm-earth, charcoal, concrete, muted rust and approved
blue-white snow ramps lock the palette afterward. Half-offset image-painted
seam repairs use narrow central crosses and low-error hard cuts; code only
registers, reduces, palette-locks and composites the paintings. Native hand
cleanup follows the two existing car roof/bonnet planes with **87 muted rust
pixels**, preserving their dark windows, wheels and silhouettes. No terrain
was constructed from code shapes or noise. No transparent sprites belong to
Part B, so key-colour extraction and sprite-placement rules are inapplicable.

**QC:** the independent critic first requested more visible car rust and a
break in the dry ground's long diagonal dust ribbons. Both were corrected;
a square interior splice was rejected and replaced with a new painted ground
and separate wrap repair. The final independent review **passes all six**.
Inspected every saved 3×3 repeat at **1× and exact nearest-neighbour 4×**, the
seasonal comparison at **1×, 4× and 8×**, and native detail crops at **8×**.
No hard join, rectangular splice, cut important object or cell grid was found.
Distinct craters and the pylon remain recognizable repeated motifs in large
fields; a single texture cannot eliminate that repetition entirely.

Validation checks dimensions, opacity, palette membership, every registered
mode reduction, all nine placements in each repeat, exact proof scaling and
full workspace file hashes. Only the six bases, fifteen requested QC PNGs and
this note were written in the checkout. An external edit appended Part A2 to
BRIEF-5.md during the run; it was read and left untouched. Every other starting
file is byte-identical. Sources, all exact prompts, processing scripts, hand
edit coordinates and validation are retained in **`/tmp/r5B-work/`**
(`generation.json`, `hand-edits.json`, `validation.json`).

**Limit:** live in-game rendering is unavailable in this art-only checkout.
No commit or push.

Files written for Part B:

- `art-drop/out/wasteland-craters-base.png`
- `art-drop/out/wasteland-craters@winter-base.png`
- `art-drop/out/wasteland-ruins-base.png`
- `art-drop/out/wasteland-ruins@winter-base.png`
- `art-drop/out/wasteland-wasteland-base.png`
- `art-drop/out/wasteland-wasteland@winter-base.png`
- `art-drop/review/r5B-craters-summer-tiled-1x.png`
- `art-drop/review/r5B-craters-summer-tiled-4x.png`
- `art-drop/review/r5B-craters-winter-tiled-1x.png`
- `art-drop/review/r5B-craters-winter-tiled-4x.png`
- `art-drop/review/r5B-ruins-summer-tiled-1x.png`
- `art-drop/review/r5B-ruins-summer-tiled-4x.png`
- `art-drop/review/r5B-ruins-winter-tiled-1x.png`
- `art-drop/review/r5B-ruins-winter-tiled-4x.png`
- `art-drop/review/r5B-seasons-1x.png`
- `art-drop/review/r5B-seasons-4x.png`
- `art-drop/review/r5B-seasons-8x.png`
- `art-drop/review/r5B-wasteland-summer-tiled-1x.png`
- `art-drop/review/r5B-wasteland-summer-tiled-4x.png`
- `art-drop/review/r5B-wasteland-winter-tiled-1x.png`
- `art-drop/review/r5B-wasteland-winter-tiled-4x.png`
- `art-drop/NOTES.md`

---

# Round 5 — Part A critic-r5A-3 foot repairs

Repaired only the three failed outputs: **`out/mountains-peak-2.png`**,
**`out/mountains-peak-6.png`** and **`out/mountains-peak-7.png`**. They now
have attached muted olive grass at the foot: **21, 14 and 5 native pixels**,
respectively, using the same three-colour olive ramp as the passing peaks.
The broad massif, rounded knoll and stepped knoll retain their exact original
silhouettes, widths, placement, binary alpha and dark outer contours. Every
pixel outside the small foot patches is unchanged.

The operator's darker warm summer rock, cool right shadows, varied crests and
bold upper-half winter caps were already present in this request's starting
files and passed critic-r5A-3. Those features are preserved. Both mountain
bases and all **13 passing peak sprites** remain byte-identical, along with
every other output and all historical critic verdicts/composites.

**Same method:** three individual built-in image-tool edits of the failed
sprites. Each painting is BOX-registered to its existing bounds on a
**384×384** canvas; all **64 RGBA samples** in every 8×8 footprint vote for
the native pixel. Only the resulting olive foot marks are transferred, locked
to `#3f5134`, `#546b30` and `#677c30`, inside the existing contour. The
unchanged rock drawing is retained exactly. Sources, exact prompts
(`generation.json`), processing, edit coordinates and validation are retained
in **`/tmp/r5A-critic3-fix/`**; no source-stage files were added to the checkout.

Regenerated all **17 existing `review/r5A-*.png` Part A QC composites** with
the original placements and nearest-neighbour enlargements. Seven proof
files change: the three peak contact sheets and summer lattice/ragged-edge
at 1×/4×. The other ten proofs reproduce their original bytes. Checked the
three repairs individually on neutral and matching rocky ground at **1× and
8×**, plus both seasonal dense lattices and ragged edges at **1× and 4×**.
Grass remains visible at native scale; range shapes and seasonal contrast
are preserved. This is self-review, with no new independent critic verdict.

Validation checks the complete workspace hash scope, exact three-output
change set, unchanged bases/passing assets, 48×48 dimensions, original alpha
and contours, foot-only olive edits and exact proof enlargement. Only the
three failed sprites, seven dependent QC PNGs and this note changed.
**No commit or push.**

---

# Round 5 — Part A operator peak redraw

Redrew all **16 peak sprites** in `out/mountains-peak-0..7.png` and
`out/mountains@winter-peak-0..7.png`. Summer has darker warm grey-brown
lit left faces, cool slate shadow faces on the right and small olive grass
skirts. Winter has broad white caps across the upper half, with exposed
rock on the lower slopes and shadow side. Bright snow occupies **71–85%**
of each winter sprite's visible upper-half pixels, including its dark contour.

Indices **0–2** are broad massifs: unequal twin summits, a long stepped ridge
shoulder and a broken secondary crest. **3** is a flat-topped crag, **4** a
leaning angular summit with a low shoulder, **5** a low double ridge,
**6** a rounded knoll and **7** a squat stepped outcrop. The three size tiers
are preserved. All sprites remain transparent **48×48** cells, centred within
one pixel, with feet on rows **44–45** and thin dark contours.

**Same method:** sixteen individual image-tool drawings, with each winter
drawing painted from its corresponding new summer landform. Solid magenta
is keyed out, drawings are BOX-registered on **384×384** canvases, and all
**64 RGBA samples** in each 8×8 footprint vote for the native pixel. Explicit
warm-rock, cool-shadow, olive and snow palettes, a single connected silhouette
and a one-pixel contour finish the reductions. Code processes and composites
the drawings; it does not construct the mountain forms.

Rebuilt exactly the **eight** existing
`review/r5A-{summer,winter}-{lattice,ragged-edge}-{1,4}x.png` proofs. The
lattice retains the original placements: 24 px between anchors, rows 16 px
apart, alternate rows shifted 12 px, later rows drawn over earlier rows.
Inspected both lattice and ragged-edge proofs at **1× and exact nearest-neighbour
4×**, plus every individual sprite at **1× and 8×**. Summer now separates from
the rocky ground; broad crests and low forms interrupt the pointed silhouettes.
Winter reads as a snow-capped range with exposed lower rock. This is visual
self-review; the existing independent critic verdict describes the old peaks.

Only these **16 sprites**, **eight requested proofs** and **NOTES.md** changed.
Both `mountains-base.png` and `mountains@winter-base.png`, all other artwork,
historical contact sheets and critic files remain byte-identical. Validation
checks complete workspace hashes, dimensions, size tiers, placement, hard alpha,
zero transparent RGB, palette membership, connectivity, snow coverage and exact
4× proof scaling. Source paintings, exact prompts (`generation.json`), scripts,
extra contact sheets and validation are retained in **`/tmp/r5A-operator-peaks/`**.
No source-stage files were added to the checkout. **No commit or push.**

---

# Round 5 — Part A critic-r5A-1 repair

Redrew only **`out/mountains@winter-base.png`**, the sole failure in
`review/critic-r5A-1.json`. The summer base, all sixteen passed peaks and
every other output remain byte-identical to this request's starting state.
The critic's verdict and original composites are preserved. No commit or push.

The broad upper-left and lower-right bare-rock islands are snowed over and
broken into small, irregularly spaced shale fragments and low stones. Pale
partly buried rock and restrained dark fissures reduce the ground's visual
contrast, while blue-white drifts and scree retain texture throughout. The
largest connected rock-palette region falls from 14,173 to 134 native pixels
(eight-way connectivity, including wrap boundaries); the broad camouflage
landmarks and their repeated chains are gone in native-scale self-review.

**Same method:** one built-in image-tool redraw, followed by an image-painted
144-pixel-offset seam repair. Each drawing is BOX-registered to 1152×1152;
all sixteen samples in each 4×4 footprint vote for its native pixel, then the
result is locked to the existing explicit rock/snow palette. Seam repairs are
confined to the central cross with the outer ring preserved. Code registers,
reduces, palette-locks and composites the paintings; it does not generate
ground forms from shapes or noise.

Regenerated all **17 existing `review/r5A-*.png` Part A proofs** with their
original placements: 3×3 base repeats, dense 24×16 staggered lattices, ragged
edges, wrap views and the peak contact sheet. Summer-only proofs reproduce
their original bytes. Checked winter at native scale, 4× repeat/join views,
all four base quadrants at exact 8×, and an additional sparse curved range
edge at 1×/4×. Self-review finds continuous wraps, crisp pixels and a quiet
rocky snowfield between the unchanged peaks, without the rejected large
dark stencil shapes. No new independent critic verdict is claimed.

Source paintings, exact prompts (`generation.json`), processing scripts,
extra sparse-edge/8× proofs and validation are in
**`/tmp/r5A-critic-fix/`**. No source-stage files were added to this checkout.
Validation checks 288×288 opacity, palette membership, literal 3×3 crops,
nearest-neighbour proof scales and the complete workspace hash scope.
Only this note, the failed output and its dependent Part A proofs changed.

---

# Round 5 — Part A only: standing mountain ranges

Added the **18 Part A PNGs**: two opaque 288×288 rocky bases and sixteen
transparent 48×48 peaks, summer and winter. All 252 previously approved
output files remain byte-identical. Only this note and the 17 `r5A-*.png`
proofs accompany the new assets. Parts B–D are untouched. No commit or push.

The peak indices are **0–2 large**, **3–5 medium**, **6–7 small knolls**.
Summer opaque bounds are 41×41, 40×37, 36×39, 31×30, 30×32, 27×27,
23×18 and 20×21 pixels; winter stays within the same requested size bands.
Every foot ends on row **45**, centred within one pixel of the cell centre.
Top-left illumination, warm grey lit faces, charcoal right faces and a
one-pixel dark contour match the approved marker/ground family. The eight
silhouettes vary between split summits, fractured ridges, spires and low
slabs. Winter is separately drawn snow on upper ledges with exposed rock,
including the dark shadow face; it is not a whole-sprite white recolour.

**Method.** Eighteen individual built-in image-generation drawings, followed
by two offset seam-repair drawings. Bases are registered to **1152×1152**;
each native pixel is the mode of all **16 samples** in its 4×4 footprint.
Key-colour sprites are isolated from solid magenta, registered on **384×384**
canvases and reduced by the mode of all **64 samples** in each 8×8 footprint,
including transparency. The results are locked to explicit rock/olive/snow
palettes sampled from the supplied reference family. Alpha is strictly 0/255,
RGB under transparency is zero, and no key colour or soft fringe remains.
Native brush corrections trim the overhanging summit, clarify lit ledges and
right-side fissures, and restore a single-pixel contour. The bases use
144-pixel offsets and image-painted seam repairs confined to the central
cross, tapering into the original texture with its outer ring preserved.
The art is drawn; code performs registration, pixel processing and review
compositing rather than constructing its forms or texture from shapes/noise.
Working source paintings, exact prompts, intermediate reductions, native-edit
coordinates, scripts and validation are retained in **`/tmp/r5A/`**;
`generation.json` records every selected source and its prompt. No processing
scripts or source-stage files were added elsewhere in the checkout.

**QC and critic loop.** Read BRIEF-5 in full, its named image references and
the earlier briefs; inspected the approved markers, round-2 tiles, paddies,
grass and plains. Initial reduction review prompted contour/ledge cleanup
and summit trimming. Initial base wraps prompted the offset seam repaint.
The first range-edge proof had an overly straight ground boundary; the final
proof follows the actual planted feet so the sprite contours can be judged.
Final self-review finds no visible wrap seam, rectangular sprite backing,
magenta fringe, clipped sprite or cone-wallpaper appearance. All bases were
inspected tiled **3×3 at 1× and 4×**, including corner/horizontal/vertical join
close views. Dense **24 px × 16 px staggered lattices**, alternate rows shifted
12 px, draw later rows over earlier rows; this is six anchors per 48×48-cell
area. Dense 6×6-cell composites and ragged range edges on the unchanged
approved seasonal grass were inspected at **1× and 4×**. The sixteen-sprite
contact sheet was additionally inspected at **8×**.

Validation passes dimensions, opacity, hard alpha, zero transparent RGB,
palette membership, a single connected silhouette per sprite, size bands,
bottom/centre placement, every literal 3×3 base crop, exact nearest-neighbour
4× proofs and hashes of all pre-existing files other than this note.

**Limits.** This is a self-review critic loop, with no new independent critic
verdict. A live in-game check is unavailable in this art-only checkout.
A repeated 288-pixel texture remains identifiable when studying a large area;
the planted variants break the old identical-peak wallpaper. Placement and
transition behaviour in the game remain the renderer's responsibility.

**Every delivered file (relative to `art-drop/`):**

- `out/mountains-base.png`
- `out/mountains-peak-0.png`
- `out/mountains-peak-1.png`
- `out/mountains-peak-2.png`
- `out/mountains-peak-3.png`
- `out/mountains-peak-4.png`
- `out/mountains-peak-5.png`
- `out/mountains-peak-6.png`
- `out/mountains-peak-7.png`
- `out/mountains@winter-base.png`
- `out/mountains@winter-peak-0.png`
- `out/mountains@winter-peak-1.png`
- `out/mountains@winter-peak-2.png`
- `out/mountains@winter-peak-3.png`
- `out/mountains@winter-peak-4.png`
- `out/mountains@winter-peak-5.png`
- `out/mountains@winter-peak-6.png`
- `out/mountains@winter-peak-7.png`
- `review/r5A-peaks-1x.png`
- `review/r5A-peaks-4x.png`
- `review/r5A-peaks-8x.png`
- `review/r5A-summer-base-3x3-1x.png`
- `review/r5A-summer-base-3x3-4x.png`
- `review/r5A-summer-lattice-1x.png`
- `review/r5A-summer-lattice-4x.png`
- `review/r5A-summer-ragged-edge-1x.png`
- `review/r5A-summer-ragged-edge-4x.png`
- `review/r5A-summer-wrap-4x.png`
- `review/r5A-winter-base-3x3-1x.png`
- `review/r5A-winter-base-3x3-4x.png`
- `review/r5A-winter-lattice-1x.png`
- `review/r5A-winter-lattice-4x.png`
- `review/r5A-winter-ragged-edge-1x.png`
- `review/r5A-winter-ragged-edge-4x.png`
- `review/r5A-winter-wrap-4x.png`
- `NOTES.md`

---

# Round 4 — operator spring/autumn grass colour correction

Changed only `out/grass@spring-base.png`, `out/grass@autumn-base.png`
and this note. All **250 other output files**, including both plains bases
and all seasonal details, remain byte-identical to the operator-review
starting snapshot. The output inventory remains 252. No commit or push.

Spring grass is now a deeper, cooler fresh green, between the previous lime
and summer grass. Mean RGB is **(131,167,74)**; mean luminance is **152**,
between summer grass's **112** and unchanged spring plains' **181**.
Autumn grass is muted olive with earthy brown patches, clearly greener and
darker than unchanged straw-orange autumn plains. Mean RGB is **(119,126,67)**;
mean luminance is **120**, versus autumn plains' **153**. Brown patches use
**(134,109,64)**.

Two built-in image-tool colour studies guided the correction. Their edit
instructions were to deepen/cool spring between its old lime and summer,
and turn autumn ochre into muted olive with brown patches, preserving all
texture, drifts and wrapping geometry. The selected colours were calibrated
and transferred as **one-to-one palette replacements on the original pixels**.
Every original colour-region mask is exactly preserved, including tufts,
drifts, worn patches, edges and corners; no geometry was repainted.

Checked both opaque 288×288 bases tiled **3×3**, plus horizontal, vertical and
corner joins at **4×**. Checked all eight unchanged details per season on
their revised bases at **1× and 4×**, in repeated composites, and at **8×**
over three different ground crops per detail. No visible seam, rectangular
backing, fringe or clipping was found. Spring foliage and autumn bronze/brown
details sit naturally on their new grounds. Checks also verify all 18 tiled
crops, exact palette-region preservation, opacity, detail transparency and
clearance, and unchanged workspace hashes outside these three files.
Temporary proofs, palette mappings and validation are in
`/tmp/r4-base-colour-review/`; existing review images describe earlier colours.
Earlier round-four processors would overwrite this colour correction.

---

# Round 4 — critic-r4-1 repairs

Replaced exactly the **five failed files** in `review/critic-r4-1.json`:
`grass-detail-7.png`, `grass@spring-detail-7.png`,
`grass@autumn-detail-7.png`, `grass@spring-base.png` and
`plains@autumn-detail-4.png`. **All 247 other files in `out/` are
byte-identical** to this request's starting snapshot. The inventory remains
252 files. Existing workspace work was preserved. No commit or push.

The three clover patches now have a single connected, low silhouette and
broad readable leaf groups. Brown twig grids, disconnected bright accents,
stones and the spring stump are removed. Native brushes lighten the upper
and internal shadow masses, retain lower-side shading and restore a few leaf
facets. Autumn includes restrained olive leaves among bronze/rust faces.
Summer retains its exact previous **(7,11)–(41,37)** bounding box and clearance.
The autumn plains scuff has connected muted earth, two grouped pebble shapes
and a softened upper edge, without scattered highlight pixels.

Spring grass replaces the large flat lime island with smaller, irregular
textured drifts across the tile. Its palette excludes the two palest reference
swatches. It remains brighter than summer grass, with sparse blade clusters
and shallow tonal contrast. No large blank pale island remains in self-review.

**Method:** five fresh built-in image-tool drawings plus one offset seam
repaint. Exact prompts: [r4-critic-fix-prompts.json](r4-critic-fix-prompts.json)
and [r4-critic-fix-seam-prompt.json](r4-critic-fix-seam-prompt.json).
Source paintings and aligned, mode-reduced and cleaned stages are retained
under `source-drawings/r4-critic-fix/`. The base is BOX-aligned to 1152×1152,
locked to existing reference colours and reduced by the mode of **all 16
samples per 4×4 footprint**. A 144-pixel offset places original boundary joins
at the centre; the seam repaint is independently reduced and blended only
into that cross, then palette-locked again. The outer three-pixel source ring
is preserved exactly, including corners. Details preserve the generated alpha
silhouettes, reject translucent haze, register on 384×384 canvases and reduce
by the mode of **all 64 samples per 8×8 footprint**, including transparency.
Explicit source-guided native brush edits are in
[r4-critic-fix-native-edits.json](r4-critic-fix-native-edits.json).
No procedural shapes or noise replace the drawings.

**Re-check:** all eight bases saved tiled **3×3 at 1× and 4×**; all eight
season/ground combinations saved with eight details on their matching base
at **1× and 4×**. Inspected the native tiled proofs and composites, the 4×
composites, and 4× horizontal, vertical and corner-wrap crops. No visible wrap
seam, clipping, rectangular backing or fringe was found. The new clover reads
as foliage and the scuff as exposed earth at native size. Proofs:
`review/r4-critic-fix-{tiled,comp,wrap}-*.png`; the four changed detail close
views are in `review/r4-critic-fix-replacements.png`. Cell orders are saved in
[review/r4-critic-fix-orders.json](review/r4-critic-fix-orders.json).

[Validation](review/r4-critic-fix-validation.json) passes the exact five-file
change scope, 247 protected hashes, unchanged inventory, sizes, opacity/hard
alpha, zero RGB under transparency, palette membership, minimum six-pixel
clearance, 20–45% detail coverage, unchanged summer clover bounds, all 72
literal tiled crops, 64 detail placements, exact 4× enlargements and preserved
wrapping ring. Rebuild only this repair with
`PYTHONPATH=/tmp/r4-python python art-drop/process_r4_critic_fix.py` in this
environment (Pillow/NumPy required). Earlier round-four broad processing
stages would overwrite the repair. This is visual self-review; there is no
new independent critic verdict or live in-game check. Repeated tonal patterns
remain discernible when studying a large map.

---

# Round 4 — grass and plains bases and details

Added all **72 requested PNGs** in `out/`: eight opaque **288×288** bases
and 64 transparent **48×48** details, covering grass/plains in summer,
spring, autumn and winter. The **180 pre-existing output files remain
byte-identical** to the starting snapshot; the resulting inventory is 252.
No commit or push was made. The operator's no-push instruction supersedes
the final line of BRIEF-4.md.

The grounds keep dark summer grass distinct from lighter yellow-olive plains.
Spring is fresh green; autumn grass is darker brown-ochre and plains straw-gold.
Winter uses pale snow and blue-grey drift shading with exposed dead tips.
Grass details cover flowers, mossy rock, bush, tall grass, stump, mushroom
ring, paired boulders and clover. Plains cover dry grass, scrub, flat rock,
flowers/seed stalks, pebbled scuff, thistle, cairn and trail scuff. Winter
replaces flowers with dead seed stalks, clover with frosted litter, and the
mushroom ring with snow-capped stones. All subjects are setting-neutral.

**Method:** each base and each detail has its own built-in image-tool drawing.
The exact prompts are in [r4-generation-prompts.json](r4-generation-prompts.json).
Bases are luminance-registered to the reference shade range, palette-locked,
BOX-aligned to **1152×1152**, then reduced by the **mode of all 16 samples in
each 4×4 block**. Each base is offset by 144 pixels on both axes and the
central cross repainted using the image tool. Repaints are independently
mode-reduced, feathered into that cross and locked again to the reference
palette. The outer three-pixel ring is preserved exactly from the offset
painting, retaining continuous source geometry through all wrapping edges
and corners. Seam prompts: [r4-seam-prompts.json](r4-seam-prompts.json).

Details are drawn larger on flat magenta, keyed including the coloured edge
fringe, aspect-registered on **384×384** canvases, locked to ground/material
colours sampled from current references, then reduced by the **mode of all
64 samples in each 8×8 block**, with transparency participating in the vote.
Native cleanup removes isolated fringe pixels. A coordinate brush pass
restores source-drawn thin stems and mushroom stalks lost to voting:
**389 pixel edits across 24 sprites**. The explicit brush paths are in
[r4-native-paintover.json](r4-native-paintover.json). Every sprite has hard
0/255 alpha, zero RGB in transparent pixels and at least the requested
six clear pixels on every side. No base or sprite was built from procedural
shapes or noise. Source paintings, registered/aligned canvases, mode votes,
seam edits and native cleanup stages are retained in `source-drawings/r4/`.

**Review:** saved every base tiled **3×3** and every **6×6-cell** base with
eight randomly positioned details, one of each variant, at **1×, 4× and 8×**:
`review/r4-tiled-{ground}-{season}-{scale}x.png` and
`review/r4-details-{ground}-{season}-{scale}x.png`. Visually inspected each
native tiled proof, native and 4× detail composite, every sprite in 4× strips,
and 4× crops across wrapping edges and the repainted joins. The thin-stem
failure was found in this pass and the composites rebuilt after repair.
The eight chosen cells in each layout give a density of 8/36, close to 1/5.
Orders: [review/r4-layout-orders.json](review/r4-layout-orders.json).

[Validation](review/r4-validation.json) checks all 72 sizes, alpha, margins,
palette membership and uniqueness; the 180 protected hashes; the exact
252-file inventory; all 72 literal tiled crops; all 64 detail placements;
exact nearest-neighbour review enlargements; and the preserved wrapping ring.
Source and output hashes are included. Rebuild stages in
[process_r4.py](process_r4.py): `prepare`, `bases`, `details`, `cleanup`,
`review`, `validate`, in that order; requires Pillow and NumPy.

**Limits:** tonal motifs remain recognisable when studying large repeated
areas, especially spring. Thin plants intentionally have sparse silhouettes.
This is visual self-review, without an independent critic verdict or a live
in-game rendering check. No game integration was attempted in this art-only
checkout.

---

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


---

# Round 5 — Part C: scifi city, slums and industry

Completed only the 48 Part C tiles: eight city, eight slum and eight industrial
layouts, each with a matching winter version. All are **48×48 opaque RGB PNGs**.
City layouts include a merged megablock, paved pocket plaza, landing pad, small
park, four separate buildings, slab tower/terminal, stepped wings and wedge block.
Slums use staggered container stacks, patched roofs, tarps, cables, kiosks and
small courts. Industry includes refinery stacks, cooling towers, a sawtooth hall,
loading crane, tank farm, power plant, processing basin and pipe-bridge depot.
Cyan/magenta lights sit within muted steel, concrete, rust and olive materials.
Winter keeps the same building geometry, with roof/ledge snow and small wet-street
reflections. All buildings and fittings stop inside a common three-pixel asphalt
margin; internal streets use the same asphalt, without an enclosing border band.

**Method:** built-in image-tool drawings and targeted repaints, registered to
**768×768 (16× the native size)**. Normalize source colours to the explicit
18-colour material palette, vote the exact mode of **all 256 samples** for each
native pixel, and lock the result to that palette. No nearest-pixel sampling is
used for reduction. Winter's painted snow is transferred onto the fixed summer
material layout. A coordinate brush pass makes **120 native pixel edits** to
repair small windows, signs, tank gauges, pipe lights, detached specks and lost
reflection streaks. The buildings and equipment come from the drawings; code
registers, reduces, cleans and composites them. Part C requires no transparent
sprites, so key removal and sprite-foot placement are not applicable.

**QC:** read all of BRIEF-5, the earlier round briefs and the named current-image
references; inspected approved markers, round-2 districts, paddies and seasonal
grass/plains. Reviewed all 30 final composites at **1× and exact nearest-neighbour
4×**, plus all 48 tiles on **8×** inspection panels. Each of the six district/season
sets has a shuffled, unguttered **8×2** proof and all eight individual tiles in
literal **3×3** repeats. Additional proofs compare seasons, mix districts and
place the new art beside approved style references. The critic loop simplified
the over-detailed plaza/pad drawings, gave the empty plaza clearer paving and
seating, improved mode reduction, restored weak neon and repaired vanished glints.
No hard join seam, separate frame band or building crossing a cell edge was found.

Validation passes all 48 native dimensions, opacity, palette membership,
uniqueness, common street margins, **110,592 exact mode blocks**, **4,608 ordered
edge joins**, **432 literal repeat crops**, shuffled proof crops and exact 4×
scaling. A full before/after workspace hash audit confirms that only the 48 new
Part C outputs, 30 new `review/r5C-*.png` proofs and this appended note changed.
All earlier art and other repository files retain their starting bytes.
**No commit or push.**

**Limits:** this is a self-review critic loop, with no new independent critic
verdict or live in-game check. The required edge streets still form a lattice,
and eight layouts necessarily repeat; varied footprints and open courts reduce
the uniform-stamp effect. Tiny fittings remain simplified at 48 px.

Sources, all 52 drawing/revision prompts (`generation-all.json`), rejected drafts,
registration/mode stages, `hand-edits.json`, shuffle orders, processing/review/
validation scripts and `validation.json` are retained outside the checkout at
**`/tmp/r5C-work/`**.

Every file written in the checkout (79 files):

- `art-drop/out/scifi-city-0.png`
- `art-drop/out/scifi-city-1.png`
- `art-drop/out/scifi-city-2.png`
- `art-drop/out/scifi-city-3.png`
- `art-drop/out/scifi-city-4.png`
- `art-drop/out/scifi-city-5.png`
- `art-drop/out/scifi-city-6.png`
- `art-drop/out/scifi-city-7.png`
- `art-drop/out/scifi-city@winter-0.png`
- `art-drop/out/scifi-city@winter-1.png`
- `art-drop/out/scifi-city@winter-2.png`
- `art-drop/out/scifi-city@winter-3.png`
- `art-drop/out/scifi-city@winter-4.png`
- `art-drop/out/scifi-city@winter-5.png`
- `art-drop/out/scifi-city@winter-6.png`
- `art-drop/out/scifi-city@winter-7.png`
- `art-drop/out/scifi-slums-0.png`
- `art-drop/out/scifi-slums-1.png`
- `art-drop/out/scifi-slums-2.png`
- `art-drop/out/scifi-slums-3.png`
- `art-drop/out/scifi-slums-4.png`
- `art-drop/out/scifi-slums-5.png`
- `art-drop/out/scifi-slums-6.png`
- `art-drop/out/scifi-slums-7.png`
- `art-drop/out/scifi-slums@winter-0.png`
- `art-drop/out/scifi-slums@winter-1.png`
- `art-drop/out/scifi-slums@winter-2.png`
- `art-drop/out/scifi-slums@winter-3.png`
- `art-drop/out/scifi-slums@winter-4.png`
- `art-drop/out/scifi-slums@winter-5.png`
- `art-drop/out/scifi-slums@winter-6.png`
- `art-drop/out/scifi-slums@winter-7.png`
- `art-drop/out/scifi-industry-0.png`
- `art-drop/out/scifi-industry-1.png`
- `art-drop/out/scifi-industry-2.png`
- `art-drop/out/scifi-industry-3.png`
- `art-drop/out/scifi-industry-4.png`
- `art-drop/out/scifi-industry-5.png`
- `art-drop/out/scifi-industry-6.png`
- `art-drop/out/scifi-industry-7.png`
- `art-drop/out/scifi-industry@winter-0.png`
- `art-drop/out/scifi-industry@winter-1.png`
- `art-drop/out/scifi-industry@winter-2.png`
- `art-drop/out/scifi-industry@winter-3.png`
- `art-drop/out/scifi-industry@winter-4.png`
- `art-drop/out/scifi-industry@winter-5.png`
- `art-drop/out/scifi-industry@winter-6.png`
- `art-drop/out/scifi-industry@winter-7.png`
- `art-drop/review/r5C-all-seasons-1x.png`
- `art-drop/review/r5C-all-seasons-4x.png`
- `art-drop/review/r5C-city-summer-3x3-1x.png`
- `art-drop/review/r5C-city-summer-3x3-4x.png`
- `art-drop/review/r5C-city-summer-tiled-1x.png`
- `art-drop/review/r5C-city-summer-tiled-4x.png`
- `art-drop/review/r5C-city-winter-3x3-1x.png`
- `art-drop/review/r5C-city-winter-3x3-4x.png`
- `art-drop/review/r5C-city-winter-tiled-1x.png`
- `art-drop/review/r5C-city-winter-tiled-4x.png`
- `art-drop/review/r5C-industry-summer-3x3-1x.png`
- `art-drop/review/r5C-industry-summer-3x3-4x.png`
- `art-drop/review/r5C-industry-summer-tiled-1x.png`
- `art-drop/review/r5C-industry-summer-tiled-4x.png`
- `art-drop/review/r5C-industry-winter-3x3-1x.png`
- `art-drop/review/r5C-industry-winter-3x3-4x.png`
- `art-drop/review/r5C-industry-winter-tiled-1x.png`
- `art-drop/review/r5C-industry-winter-tiled-4x.png`
- `art-drop/review/r5C-mixed-districts-1x.png`
- `art-drop/review/r5C-mixed-districts-4x.png`
- `art-drop/review/r5C-slums-summer-3x3-1x.png`
- `art-drop/review/r5C-slums-summer-3x3-4x.png`
- `art-drop/review/r5C-slums-summer-tiled-1x.png`
- `art-drop/review/r5C-slums-summer-tiled-4x.png`
- `art-drop/review/r5C-slums-winter-3x3-1x.png`
- `art-drop/review/r5C-slums-winter-3x3-4x.png`
- `art-drop/review/r5C-slums-winter-tiled-1x.png`
- `art-drop/review/r5C-slums-winter-tiled-4x.png`
- `art-drop/review/r5C-style-comparison-1x.png`
- `art-drop/review/r5C-style-comparison-4x.png`
- `art-drop/NOTES.md`


---

# Round 5 — Part C: critic-r5C-1 corrections

Redrew only the **27 failed outputs**: `scifi-city@winter-0..7.png`,
`scifi-slums-{4,6,7}.png`, `scifi-slums@winter-0..7.png`, and
`scifi-industry@winter-0..7.png`. The **21 passed summer tiles retain their
starting bytes**. The critic's verdict, audit and historical composites stay
unchanged, along with all art outside this failed list.

Slums 4, 6 and 7 now have connected, overlapping container/shack masses, broad
patched roof planes, visible dark wall fronts, windows, attached tarps and narrow
crooked passages. Their winter partners use the same new housing geometry and
painted roof snow. The other 21 winter tiles retain every non-asphalt pixel,
including their existing buildings, outlines, lighting and roof snow.

All 24 winter streets now have coherent dark blue-grey puddles, broken horizontal
highlights, subdued cyan/plum/magenta reflections beneath lights, and small slush
and track variations. Final winter tiles contain **124–294 changed street pixels**
each compared with summer, rather than the previous isolated dots. The outermost
row/column remains the common charcoal asphalt, and buildings retain their safe
street clearance. Puddle shapes vary without a continuous perimeter ring.

**Same method:** built-in image drawings and targeted repaints, registered to
768×768, normalized to the original 18-colour palette, then reduced by voting
**all 256 samples in each 16×16 block**. No nearest-pixel reduction. Winter snow
masks transfer onto the fixed summer structures, with bright snow caps and cool
shading. Separate image-painted street layers use a connected-asphalt mask, so
roofs, enclosed roof recesses, wall faces and lights cannot become puddles.
**16 native brush coordinates** restore source-painted horizontal glints lost in
the mode vote. Every delivered tile remains 48×48, opaque RGB, palette-locked.

**QC:** rebuilt all **30 existing `review/r5C-*.png` composites**; 22 have changed
pixels and eight summer pass proofs reproduce their original bytes. Inspected
native 1× layouts, exact 4× shuffles, 8× tile sheets, literal 3×3 repeats, season
pairs, mixed districts and the approved-style comparison. Three independent
8×2 shuffle orders per district/season are also retained outside the checkout.
Validation passes dimensions, opacity, palette membership, unique outputs,
**69,120 exact source mode blocks**, **4,608 ordered edge joins**, **432 repeat
crops**, saved shuffle crops, exact 4× scaling, preserved winter structures and
the full workspace change scope. The final byte changes are exactly **27 failed
outputs, 22 Part C proof images and this appended note**; no other file changed.

Prompts, all 30 accepted drawing stages, the rejected initial street repaint,
registration/palette/mode stages, snow and street masks, brush coordinates,
rebuild/review/check scripts and `validation.json` are retained at
**`/tmp/r5C-fix/`**. This is visual self-QC following the supplied independent
critic, without a new independent verdict or a live in-game check.
**No commit or push.**


---

# Round 5 — Part D: forest autumn and crown variety

Delivered only the 16 Part D trees, each 48×48 RGBA with hard 0/255 alpha.
Summer uses round crowns (0, 3, 6), tall oval crowns (1, 4, 7), and asymmetric
two-lobed crowns (2, 5), in muted olive, forest-green and sage ramps. Autumn
is exactly three orange (0–2), two brick/wine red (3–4), two ochre gold (5–6),
and one still-green (7). Short forked trunks finish on row 44 at the bottom
centre, like the existing reference sheet; all silhouettes remain inside
their cells with 4–10 pixels of horizontal clearance. Light is top-left.

Read BRIEF-5 in full, along with BRIEF and rounds 2–4; inspected its named
current-art references, both existing deciduous forest sheets, the conifer
reference, approved markers, round-2 districts/farmland/suburbs, paddies,
and grass/plains. Those approved assets are unchanged.

**Method:** 16 individual built-in image-tool drawings on solid magenta,
registered to exact 768×768 canvases, palette-locked with separate bark and
foliage treatment, then reduced by the mode of all 256 samples in each
16×16 block. Magenta is removed with hard alpha, and every transparent
pixel has zero RGB. No code-shape or noise construction. Native cleanup
uses 170 explicitly selected pixel edits to restore neutral bark, close
lower contours and trim two left-heavy roots. The source drawings, exact
prompts, registration and palette stages, mode reductions, brush coordinates,
processing/review scripts and validation are retained in `/tmp/r5D/`; prompt
set: `/tmp/r5D/prompts.json`.

**QC / correction loop:** first reduced-sheet review caught tan leaf mapping
in the still-green autumn tree and weak bark/contours. Corrected the palette
mask, made the native edits, rebuilt all proofs, and inspected the final
sprite sheets, hard-alpha checker, dense staggered forests, ragged forest
edges and approved-style comparison at 1× and 4×. Also inspected all trees
at 8×. Dense composites use 24 px horizontal and 16 px vertical spacing,
alternate rows shifted 12 px, with later rows over earlier rows. Autumn
now has readable mixed crowns instead of one orange slab. No base texture
is part of D, so no new base or 3×3 base-seam edit was needed; composites
use the approved grass bases unchanged.

Validation passes all 36,864 exact mode blocks, palette membership, binary
alpha, clean transparent RGB, 16 unique sprites, a single connected tree
per file, centred roots on row 44 and exact nearest-neighbour proof scales.
The full art-drop byte audit permits only the files listed below: 16 sprites,
18 review PNGs and this appended note. All pre-existing unrelated files
retain their starting bytes.

**Limits:** visual self-QC only; no independent critic verdict or live
in-game renderer check. No commit or push.

**Files written:**
- `art-drop/out/treeline_forest-0.png`
- `art-drop/out/treeline_forest-1.png`
- `art-drop/out/treeline_forest-2.png`
- `art-drop/out/treeline_forest-3.png`
- `art-drop/out/treeline_forest-4.png`
- `art-drop/out/treeline_forest-5.png`
- `art-drop/out/treeline_forest-6.png`
- `art-drop/out/treeline_forest-7.png`
- `art-drop/out/treeline_forest@autumn-0.png`
- `art-drop/out/treeline_forest@autumn-1.png`
- `art-drop/out/treeline_forest@autumn-2.png`
- `art-drop/out/treeline_forest@autumn-3.png`
- `art-drop/out/treeline_forest@autumn-4.png`
- `art-drop/out/treeline_forest@autumn-5.png`
- `art-drop/out/treeline_forest@autumn-6.png`
- `art-drop/out/treeline_forest@autumn-7.png`
- `art-drop/review/r5D-alpha-1x.png`
- `art-drop/review/r5D-alpha-4x.png`
- `art-drop/review/r5D-autumn-edge-1x.png`
- `art-drop/review/r5D-autumn-edge-4x.png`
- `art-drop/review/r5D-autumn-forest-1x.png`
- `art-drop/review/r5D-autumn-forest-4x.png`
- `art-drop/review/r5D-autumn-sprites-1x.png`
- `art-drop/review/r5D-autumn-sprites-4x.png`
- `art-drop/review/r5D-autumn-sprites-8x.png`
- `art-drop/review/r5D-style-1x.png`
- `art-drop/review/r5D-style-4x.png`
- `art-drop/review/r5D-summer-edge-1x.png`
- `art-drop/review/r5D-summer-edge-4x.png`
- `art-drop/review/r5D-summer-forest-1x.png`
- `art-drop/review/r5D-summer-forest-4x.png`
- `art-drop/review/r5D-summer-sprites-1x.png`
- `art-drop/review/r5D-summer-sprites-4x.png`
- `art-drop/review/r5D-summer-sprites-8x.png`
- `art-drop/NOTES.md`


---

# Operator correction — wasteland bowl craters

Replaced only `out/wasteland-craters-base.png` and
`out/wasteland-craters@winter-base.png`. Both remain 288×288 opaque RGB.
Four unequal round-to-irregular excavated bowls replace the narrow cuts:
the largest raised-rim footprint is approximately 70–80 px across, and the
smallest about 25–30 px. Broad dark interiors, lit far rims under top-left
light, broken raised stone rims and fading grey-black ash distinguish the
bowls from surface cracks. Uneven scorch patches, short branching cracks
and rubble break up the summer gaps.

Winter has settled snow over earth and rubble, dark stone showing through
snow-capped rims, grey slush and partial snow tongues inside the bowls.
The busy diagonal snow-ridge draft was rejected in favour of broad quiet
snow patches with subtle buried ash, occasional cracks and sparse debris.

The arrangement has four different footprints without the previous three-pit
triangle. A toroidal shift puts the medium and lower bowls across the right
and bottom boundaries; both halves come from the same continuous painting.
Half-offset ground repairs remove the original joins. A first repair's long
zigzag ridge was rejected. Size corrections were checked after native
registration, including the winter snow-covered outer rims.

Paintings were registered, reduced by the exact mode of all sixteen samples
per 4×4 footprint, and locked to the existing earth/stone/snow palette.
The selected large summer bowl uses a 120 px source crop registered to a
96 px patch, including its surrounding ash; its rim itself is smaller.
Low-error cuts preserve the repaired ground around the corrected paintings.
No procedural crater shapes or noise were constructed. Sources, exact prompt
set, registration stages and processing scripts are in `/tmp/crater-redraw/`.

Inspected both final literal 3×3 repeats at native 1× and exact nearest-neighbour
4×, plus individual 4× tiles and wrap crossings. Bowls stay readable and
edge-crossing rims remain continuous. These are visual self-checks; no new
independent critic or live in-game check was run. The fixed 288 px repeat
remains locatable in a large field.

Saved review sheets:
- `review/operator-craters-summer-3x3-1x.png`
- `review/operator-craters-summer-3x3-4x.png`
- `review/operator-craters-winter-3x3-1x.png`
- `review/operator-craters-winter-3x3-4x.png`

The complete starting-file hash audit allows only these two outputs, these
four new review sheets and this note. All approved ruins and plain wasteland
textures, other outputs and earlier proofs retain their starting bytes.
**No commit or push.**

---

# In-game correction — summer forest crown greens

Recoloured crown RGB only in `out/treeline_forest-0.png` through
`out/treeline_forest-7.png` (the eight filenames without a season suffix).
Each crown now uses exactly three mid/dark greens, with warmer forest greens
on 0/2/4/6 and cooler greens on 1/3/5/7. Yellow, olive-yellow and lime foliage
colours are removed. The lightest green is restricted to existing light
foliage pixels in the upper-left 46% of crown width and upper 30% of crown
height; it covers at most 5% of each crown. All other crown pixels use the
two darker shades. This is an exact pixel palette edit, with no resampling.

| Tree | Dark | Mid | Small top-left highlight | Highlight pixels / crown pixels |
| --- | --- | --- | --- | --- |
| 0 | `#20402a` | `#305934` | `#4c6f42` | 29 / 585 |
| 1 | `#1d3b34` | `#2c5445` | `#436a55` | 30 / 602 |
| 2 | `#234329` | `#345c35` | `#4e7241` | 32 / 644 |
| 3 | `#1d3d2c` | `#2d5738` | `#456d48` | 24 / 493 |
| 4 | `#1f402b` | `#305937` | `#496e44` | 28 / 563 |
| 5 | `#1b3c30` | `#29553f` | `#426c4f` | 2 / 475 |
| 6 | `#224128` | `#335932` | `#4c6e3e` | 25 / 515 |
| 7 | `#1c3c34` | `#2b5345` | `#426954` | 23 / 472 |

**Verification:** compared reloaded final PNGs with pre-edit file copies.
All eight remain 48×48 RGBA. Every alpha channel is byte-identical; every
non-crown RGBA pixel, including outlines, trunks and hidden transparent RGB,
is byte-identical. The changed-pixel set equals the original foliage-palette
mask exactly, so shapes, sizes, pixel positions and transparent backgrounds
are unchanged. Each crown contains exactly its three listed greens.

**Visual check:** inspected all eight final trees at native 1× and exact
nearest-neighbour 8× on `out/grass-base.png` and the companion reference
grounds `reference/current-grass.png` and `reference/fantasy-ground.png`.
The requested `reference/current-fantasy-treeline_forest.png` is a transparent
192×96 tree sheet, with no ground texture; used the companion grounds for
that check and also viewed all eight original reference trees above the new
set on reference grass. Inspected dense native-scale forest composites on
reference grass and grass-base: crowns read green, with cooler/warmer variety
and restrained top-left highlights. This was asset-composite review.

Before copies, masks, palette-edit script, 1×/8× proofs, per-file alpha and
non-crown SHA-256 evidence, and full starting-file hash audit are retained in
`/tmp/summer-crown-recolour/`, outside the checkout. Only these eight summer
PNGs and this appended note changed; all autumn files, bases, references,
earlier reviews and other pre-existing files retain their starting bytes.
No files were added to the checkout. **No commit or push.**
