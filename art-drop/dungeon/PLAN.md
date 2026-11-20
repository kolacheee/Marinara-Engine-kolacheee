# Dungeon and building map art overhaul: plan (final, 2026-11-20)

Draft 1 scored 6, 4, 4, 4 and 4 out of 10 with the panel (pixel-art lead, environment artist, technical
artist, art director, player); draft 2 scored 8, 7, 8, 7 and 7 with four blockers (the zoomed-out view, the
canvas cap, the pack schema, ramps for every look). Draft 3 scored 9, 8, 8, 8 and 9 with no blockers; its
round 3 changes are in section 10. section 9 lists what was
taken in and turned down.

The owner: "Currently everything looks like a placeholder and not a final, polished piece." This covers every
map `DungeonMapView` draws: caves, dungeons and stations (the 11 dungeon sets), planned buildings (keep,
temple, manor, crypt), their lair floors, and their ground floors on open land. Foe and party sprites are out
of scope (their own round later).

Pictures of today's maps: `current/*.jpg` (fork tip ae99a54c6). References: `reference/`.

## 1. What is wrong today

1. **Most of it is coded rectangles, not art.** The planned buildings (walls, 5 floor kinds, 45 props, doors,
   stairs, dais, rugs, gallery, yards) and all lair dressing (hoard, pool, comb, rift, ritual circle, mist,
   trail marks) are flat fills at 16 px a cell or vector shapes with soft glows.
2. **Two scales and two styles in one room.** 48 px pack props beside 16 px code props; glyph icons (stairs,
   cracks, skeletons) beside painted tiles.
3. **The value structure is upside down.** The brightest things are coded glows, the checker vestibule and
   terracotta floors; the wall mass beyond the floor is often lighter than the floor (drowned-crypt,
   sanctum-crypt); loot and the lair feature do not stand out.
4. **The renderer blurs pixel art.** Resolution is not an integer multiple of the art and smoothing is on, so
   48 px art is resampled; rims, outlines and shadows are anti-aliased vector strokes.
5. **Rooms are empty grids.** Props are spread evenly or in rows, nothing hangs on the walls, corridors and
   rooms look alike, lairs are one gimmick in a plain room, and traps and state changes have no art.

## 2. Canon (the rules every brief cites)

- **Master reference:** `reference/town-interiors-mock.jpg` (the source PNG is
  `/mnt/project-files/interiors-mock-rooms-10.png`). Take from it: the 48 px grid, the high 3/4 view, the wall
  faces 1 cell tall with things hung on them, prop size and detail, outline and light. From `city-r17`: the
  stone and roof ramps for outer walls and yards only. The October packs are **not** canon: all 11 sets are
  repainted to the master style.
- **Walls may curve.** The owner asked for curved and diagonal walls today; her "no rounded edges" rule is
  about grid tiles (a square tile with soft corners). Curves are drawn as stepped pixel edges at art
  resolution, never anti-aliased.
- **Pixel rules (lint-checked):**
  - drawn natively at 48 px a cell; no scaling of any kind, no "paint big and shrink";
  - alpha 0 or 255 only; shadows live on a separate shadow layer, one colour, one fixed alpha (35%);
  - no gradients, blur, glow or airbrush in the art;
  - outline 1 px, the darkest step of the object's own ramp, never #000; lighter on top-left edges; floor
    textures have no outline;
  - ramps of 4 to 6 steps with hue shift (warm lights, cool darks); a **curated** master palette
    (`canon/palette.hex`: the master reference quantised and hand-merged into named ramps, plus ramps defined
    at stage 0a for every material of all 14 looks: limestone, sandstone, marble, brass, basalt and embers,
    ice, violet crystal, slime, the cool station ramps and the rest); lint checks each set against its own
    named ramps; at most 32 colours per tileset and 48 per prop sheet;
  - uniform pixel density (no 2x2 fat pixels beside 1x detail); floor texture in clusters of 3 px or more, no
    1 px salt-and-pepper, dither only ordered 50% on large areas;
  - stepped edges and curves use even, monotonic run lengths (4-3-2-1-1-2-3-4, never 1-3-1-2 jaggies); no
    doubled corner pixels on 1 px outlines; wall faces end in a 1 px ramp-dark base line where they meet the
    floor;
  - floors with a built grid (flags, parquet, tiles, grating) keep their joints on the 48 px cell; no feature
    (a crack, a stain, a big stone) appears twice in one pattern.
- **Canon changes** after `canon/` is frozen (a new ramp for lava, a rule for stations) go in as a new canon
  version with the owner's approval and a note of what changed, and every finished set is linted again.
- **Canon files:** the master reference crops (wall, floor, wood prop, stone prop, outline detail, rug), the
  overworld's grass, path and cobble crops (for the yards), the curated palette and the style guide.
- **Value ladder** (checked on a greyscale render of every gallery shot, rough L*): void and mass 5-15 <
  wall top 18-30 < wall face 25-40 < floor 35-55 < props 30-70 < loot, feature and found traps up to 85.
  `mass` is at least 25% darker than `wall_top`. Floors keep their own contrast within 15 L*. A prop's
  outline and main mass sit at least 10 L* from the floor under it; loot, the feature and found traps at least
  15 L* above it. A 4x-downscaled greyscale "squint" render must still separate floor, wall, door, loot and
  feature.
- **Gameplay palette.** Reserved hues: red for foes, gold for loot and keys, a hazard orange-yellow plus a
  hazard-striped rim for found traps, and each lair's accent for its feature (hoard = deep amber-bronze, not
  loot gold; haven = wine-violet, not foe red; drowned = sea-green; sanctum = violet; breach = ember orange
  only on the rift itself; den = bone; hive = resin amber-green). No prop, surface or decal uses a reserved hue
  at full saturation (lava embers, temple brass and terracotta are kept one step desaturated). Decorative gold
  in a hoard is one step desaturated and never matches the coin-pile sprite; loose coins and chests are lighter
  than the heap's body. A coded glow is never brighter than the art it lights (glows capped at 35% alpha and
  1.5 cells radius). The breakable feature's corner brackets stay as UI, drawn as art-pixel strips under the
  same cap.
- **Wear level** per floor, set by the generator, drives decal density, edge grime and the share of ruined
  props: pristine (ground floors), lived-in (normal floors), decayed (ruins, crypt depths), ruined (lair
  floors, heaviest in the approach rooms).
- **Every room has something worth walking to** (a focal piece, loot, a wall-hung curiosity or a door on);
  no room is only floor, caves included. No building is cut off: a ground floor shows its whole outer wall
  with at least 1 cell of yard round it.
- **Silhouettes.** A door breaks the wall band with a frame, a lintel and a lit threshold; a locked door
  differs by shape (bands and plate), not just colour; stairs up and down differ by shape; a chest never shares
  a silhouette or colour with a crate or barrel.
- **Materials** (one story each): keep = grey limestone, oak, iron; temple = warm sandstone, marble, brass;
  manor = plaster, timber, parquet, textiles; crypt = old dark masonry, bone, lichen; rock cave = grey-brown
  rock, mud, fungus; ice cave = blue ice, frost, snowdrift; crystal cave = dark rock, violet crystal; lava cave
  = basalt, ember cracks, ash; sewer = brick, slime, sluices; station corridor = bulkheads, hazard paint;
  lab = clean tile, spills, tanks; engine = soot, oil, pipes; hydroponics = planters, overgrowth, leaks.
  Stations get their own cool ramps under the same pixel rules.
- **Rooms vs corridors.** Corridors are sparse: wall-foot grime and drag marks. Rooms have one focal piece,
  supporting pieces, and clutter clustered along walls and in corners, never spread evenly.
- **Wear** is overlays from the base material's own ramps (hard edges): cracks, rubble, scorch, slime, roots,
  bones, and ruined states of the core props.

## 3. Engine first (stage E, before any art is judged)

1. **Crisp pixels:** the map is built at art resolution (1 art pixel = 1 canvas pixel, 48 per cell) in
   chunks of 16x16 cells, so no map hits the 16M-pixel canvas cap, and drawn to the screen at a whole-number
   scale (1x, 2x, 3x) with `imageSmoothingEnabled = false` everywhere. 1x is the smallest map scale; the
   zoomed-out overview becomes a flat-colour minimap built from the value ladder (no downscaled art). Rims,
   hairlines and foot shadows are art-pixel strips (a sampled rim strip like the face), not vector strokes;
   the band's edge is rasterised at art resolution.
2. **Props on their own Y-sorted layer** with the party and foes, so a figure walks behind a tall shelf and in
   front of a table. Each prop has an anchor and a sort row. Shadows are drawn opaque into one shadow layer
   and composited once at 35%, so overlapping shadows never stack.
2b. **Pack schema `tilePackVersion` 3**, written before the slice brief, optional fields only (the Overworld
   line's loader ignores what it does not know): per tile `footprint`, `anchor`, `sortRow`, `joins`,
   `wallHung`, `ruinedOf`, `pattern: true` with its period (replacing the hard-coded pattern list), `ramp`;
   shadows as a sibling key `<id>#shadow`; lint checks that the manifest and the JSON agree.
2c. **Wall-hung layer:** hung pieces sit only on straight horizontal face runs at least the piece's width
   plus 1 cell, anchored to the face's top edge and clipped to it; never on a slope or curve.
3. **Pattern surfaces:** `wall_top`, `mass` and each floor are one seamless 6x6-cell (288 px) pattern
   anchored to the map; worn cells become decals. Each `wall_face` variant is a full 6-cell strip chosen per
   straight run (keyed on map x only, never per cell), sampled along the outline as now, with end-caps (a
   return) where a face stops at a curve or a doorway.
4. **Doors cut the band:** a door or arch removes the band and face under it and draws its own frame; doors
   sit only on straight runs (the generator already keeps a straight way in).
5. **All-or-nothing fallback** per category (surfaces, architecture, props, lair): a set either has all of a
   category's art or uses today's code for all of it, so the two scales never meet. The gallery lists missing
   keys and fails.
6. **Gallery e2e:** every set and building, the lair floors, and a **slope torture map** (0°, 1:2, 45°, 2:1,
   curve radii 0.4/1.25/4, convex and concave corners, built and carved modes, a door each way, a hung piece
   on a run between two curves), rendered as lossless PNG at 1x and 3x nearest-neighbour from a fixed camera,
   plus a greyscale copy and the 4x squint.
7. **`art-lint`** script, run on every drop before any reviewer sees it: palette membership and colour count;
   alpha values; no #FF00FF; orphan pixels; sizes multiples of 48 and matching the JSON; 1 px extrusion gutter
   on every sheet cell; wrap seams (3x3 tile, edge vs interior difference); repeats (12x12 random preview and
   autocorrelation); `wall_face` sampled along 22.5° and 45° lines and curves; a scale sheet of every prop
   beside a party sprite; jaggies and doubled pixels on outlines and on the rasterised band edge; a draw-time
   budget (base build of the largest gallery map under 300 ms, frame under 4 ms with 40 sorted props). Lint
   writes a machine-readable report into the drop; the gallery refuses a drop without a passing report.
8. **Placement:** the manifest and the room-kit definitions (focal, supporting, clutter, wall-hung, counts;
   every generator room type mapped to a kit) are written as data during stage E, before the slice. Kits drive
   the generator's furniture choice; a dressing pass clusters clutter on walls and corners, and no single
   prop appears more than 3 times in a room unless it joins; the wear level sets decal density.

## 4. Stage 0: canon and the vertical slice (two owner gates)

**0a. Style guide and frames (owner gate 1, before anyone builds the slice).**
- **Style guide sheet** (`canon/style-guide.png`): every material ramp for all 14 looks, the outline rule, a
  light-direction sample, one material swatch per building and set, a prop scale chart (party, door, table,
  chest, column; party and foe sprites marked as a known exception, out of scope), and do/don't crops of
  today's failures.
- **Six mood frames** (painted at 48 px, shown at 1x and 2x, in greyscale and as the squint), each with a
  3-line story (who lived here, what happened, where the eye goes): hoard-keep, breach-temple, sanctum-crypt,
  cave_rock-plain-21, manor-ground (with its yard) and station_lab. The station frame must pass the ladder
  and the owner is asked directly whether it looks like the same game.

**0b. Vertical slice (owner gate 2).** A keep lair floor (with the hoard and one lived-in room, a barracks or
kitchen, to prove the kits and the dressing pass) and a rock cave, built entirely from tiles and sprites to
the canon, placed in the engine and rendered by the gallery; plus the torture map's built-mode case. Pass
tests: lint clean; the panel at 8/10 or more with no blockers; at 1x a reviewer finds the door, locked door,
found secret door, stairs, found trap, loot, opened chest, foe, lair feature and broken feature within
5 seconds; and the owner approves in writing. Where a frame and the slice disagree, the slice wins and the
frame is redone. Then `canon/` is frozen.

## 5. Production (after the slice is approved)

Each line below is one brief. Every brief comes with its manifest rows, the canon crops to match, a
forbidden-techniques list, and an in-engine before and after of the same seeds, judged on "can you name the
room without labels?", "can you name the building?" and, from an approach room, "which way is the lair?".
Its side-by-side composite shows the canon frames and the previous approved set. Codex's own critic looks at
the gallery PNGs at 1x and 3x nearest-neighbour, never at its own preview or a scaled sheet.

1. **Manifest** (`manifest.csv`, written in stage E from `paintBuildingProp`, the dungeon sets and the lair
   rooms): id, name, footprint, building/set, room types, kit, joins, wall-hung, ruined variant, lair kind.
2. **Surfaces** for the other 2 buildings and 10 sets: `wall_top` (isotropic, no courses), `wall_face`
   (horizontal coursing, course lines 2 px or more, joints at least 12 px apart, end-caps), `mass`, floors
   per kind, liquids (16-piece edge autotile), edge decals (wall-foot dirt, moss, corner grime, damp and
   soot on the face).
3. **Architecture:** doors (open, closed, locked, barred, secret hidden and found, arch, portcullis up and
   down, broken), stairs up and down, ladder, hatch, hole, collapsed stair, dais, gallery, columns, niches,
   window slits.
4. **Wall-hung pieces** (they sell a room): hearths, shelves, banners, tapestries, sconces, racks,
   paintings, icons, ossuary niches and loculi, pipes, valves, terminals, cable trays.
5. **Traps** in three states (hidden tell, found, sprung or disarmed): pressure plate, spikes, dart wall, pit,
   rune. The hidden tell stays within the floor's own contrast, visible only to someone looking for it.
5b. **Clutter decals**, 4 variants each: corner cobwebs, straw, candles and drippings, puddles, scattered
   paper, broken crockery, drag marks, rubble, bones.
6. **Loot and state:** chest closed, open and empty; locked chest; coin pile; key; and the state art for a
   broken lair feature and a cleared lair.
7. **Lairs** (before bulk props): per kind, the feature, in its accent from section 2, as pieces that compose the generator's shapes (heap
   edge, middle, peak and coin spill; pool, comb and corruption as autotiles; rift straight, bend and end; a
   painted ritual circle replacing the vector ring), its broken state, approach dressing that grows over the
   last 2 to 3 rooms, and its own props: den (nests, carcasses, hides); hive (resin, egg sacs, cocoons);
   drowned (silt, kelp, barnacles, tide line, waterlogged furniture); sanctum (altar, braziers, candle
   clusters, tomes); haven (coffins, blood basins, shrouds, chains); breach (corrupted stone, floating
   debris, cracked tiers); hoard (chests, goblets, weapons pile, a heap that leaves the boss readable).
8. **Room kits and props.** Each kit: one focal piece, supporting pieces, clutter, wall-hung items, ruined
   states; joining pieces as left, middle and right; 2 rug patterns per building.
   - keep: great hall, barracks, armoury, kitchen, larder, chapel, cells, treasury, bedchamber, cellar;
   - temple: nave, sanctuary, vestry, scriptorium, cloister court, bell or relic room;
   - manor: dining hall, drawing room, servants' hall, kitchen, bedchamber, gallery, wine cellar, study,
     library;
   - crypt: burial hall, ossuary, embalming room, mortuary chapel, sealed tomb;
   - rock cave: fungus grove, stalagmite field, mine dig (supports, cart, rails); ice: frozen camp, ice-bound
     bodies; crystal: geode chamber, mining dig; lava: forge ruin, ash field; sewer: outfall and sluice,
     cistern, smugglers' nook;
   - station corridor: airlock, checkpoint; lab: specimen bay, clean room, office; engine: reactor,
     workshop, fuel store; hydroponics: grow rows, seed vault, flooded bay.
9. **Yards** (ground floors): grass matched to the overworld, cobbles, paths, a border where grass meets
   paving, well, cart, hay, woodpile, training posts, garden beds, graves at the temple, a gate.

## 6. Process

- **Who draws:** Codex on the owner's laptop (Remote Control), on a new fork art branch
  `art/dungeon-maps-2026-11-20`, output in `art-drop/out/dungeon/<brief>/`, pushed as "art-drop: dungeon
  <brief>". Art stays on the fork.
- **Each brief:** Codex draws → `art-lint` must pass → I place it on the fork and render the gallery → the
  panel of 5 reviews the PNGs → fixes in cycles until all give 8/10 or more with no blockers (at most 4
  cycles; past that the owner decides).
- **Owner gates:** stage 0 (style guide, frames and the vertical slice), then the end of each building or set.
  The samples page shows everything as it lands.
- **Order:** E (engine and lint) → 0 (canon and slice: keep + rock cave) → crypt and temple → manor → sewer
  and the other caves → stations → yards.

## 7. Size

Stage 0: style sheet, 6 frames, a slice of about 80 pieces. Production: about 12 surface sets of 10 to 15
pieces; about 50 architecture pieces; about 60 wall-hung pieces; 15 trap pieces; about 12 loot and state
pieces; 7 lairs of about 20 pieces; about 150 props with ruined states; about 30 yard pieces.

## 8. Risks

- Codex drift between briefs: the canon folder, lint and the side-by-side composite against the frozen
  frames on every drop.
- Scope: the slice proves the pipeline on two looks before the other twelve start.
- Two lines: the town interiors art lives on the Overworld line; everything here uses the same tile-pack
  format so both lines can load it.

## 9. Panel rounds: taken in and turned down

Round 2, taken in: integer-scale build at art resolution in chunks (canvas cap), 1x as the smallest scale with
a minimap overview (no downscaled art), pack schema v3, ramps for all 14 looks at 0a, gate split into 0a and
0b, canon versioning, a lived-in room and built mode in the slice, state art and secret door in the 5-second
test, shadow layer composited once, curve run-length rules, face base line, grid-aligned floor joints,
per-run face strips, wall-hung layer rules, time budgets, lint report gating the gallery, wear levels, kits
for every building and set, clutter decals, kits as data in stage E, "name the building" and "which way is the
lair" tests, lair accents apart from the reserved hues, reserved hues on surfaces and decals too, decorative
gold rule, hidden trap tell rule, brackets kept as UI, something worth walking to in every room, no cut-off
buildings, the overworld crop in canon, previous set in each composite, Codex's critic on gallery PNGs.

Round 1:

Taken in: crisp pixels and stroke quantising, Y-sorted props, pattern surfaces, face end-caps, doors cutting
the band, all-or-nothing fallback, lint and torture map, lossless PNG reviews, master reference and palette
file, value ladder and gameplay palette, silhouette rules, traps and state art, loot listed separately,
manifest, room kits, wall-hung pieces, lair approach dressing, ruined props, vertical slice before breadth,
owner gates, material stories per set, rooms vs corridors, no baked shadows in sprites.

Turned down: "90° and 45° walls only" (the owner asked for curves today; they are kept, drawn as stepped
pixel edges); "yards first" (they come last; the owner's complaint is the interiors).

## 10. Round 3 additions (all taken in)

- **Chunks:** every whole-map layer (band mask, tops, edge, faces, foot strips) is rasterised per chunk with a
  margin of 1 cell plus the band width; patterns are anchored to global map coordinates; the torture map gets
  a chunk-boundary case (curve, face, door, hung piece across a chunk line), diffed against an unchunked render.
- **Exact x3:** the engine's T=16 units map to 48 art pixels exactly, so overlays, fog, found traps, foes and
  glows snap to whole art pixels; lint flags draws on fractional art pixels. The code fallback goes through
  the same crisp path (no smoothing, no vector strokes, glows included).
- **Schema:** the gallery checks `schemaVersion`; an Overworld-line loader smoke test proves a v3 pack loads
  there before production. Time budgets are measured in Chromium on the cloud gallery runner.
- **Minimap** marks doors, locked doors, stairs, found traps, unopened loot, foes and the feature with 1-cell
  glyphs in the reserved hues, greys out opened chests and cleared rooms; it is in the gallery and the
  5-second test. Slice test adds "tell from the art alone which rooms were looted".
- **Hive** props and decals stay one step desaturated from its accent.
- **Curved rooms:** free-standing stand-ins (torch stand, banner pole, brazier, lectern, tool rack, crate stack)
  when no straight run fits; thin side-on sconce, torch and banner for east and west walls.
- **Lairs:** approach dressing grows with the wear level and runs through corridors too; each kind has a named
  cleared state (collapsed heap, drained pool, sealed rift, burnt comb, broken circle, toppled coffins, an
  empty nest), not a dimmed copy. The slice's lived-in room and approach rooms share one prop intact and ruined.
- **Size:** props are recounted from the stage E kit data (expect 250 to 300); the cut line, if cycles keep
  hitting the limit, is to share kits (stations reuse corridor kits, caves share clutter) rather than lower
  quality.
- **Canon sources:** the palette and crops come from the source PNG, never a JPG. Each of the 14 looks gets a
  3x3-cell proof tile at 0a (`wall_top`, `wall_face`, floor, one prop, at 1x and in greyscale).
- **Colour caps per sheet:** 32 for a surface sheet, 48 for a prop sheet; wear decals on their own sheet.
- **Liquids** animate as 3 to 4 frame loops at 48 px under the same palette and alpha rules, linted per frame.
- **Face strips** share their left and right edge columns so any two variants meet without a seam.
- **Top-left light** is at most one ramp step lighter. The gallery adds a 2x crop.
- **Fix cycles** may not touch art outside their brief without a canon-version note.
- **Risk:** the in-game town interiors on the Overworld line are checked against this canon at each owner
  gate, so the two lines stay one game.
