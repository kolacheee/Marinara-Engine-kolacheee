# Dungeon map art, brief D0a: canon, style guide, mood frames, proof tiles

Read `art-drop/dungeon/PLAN.md` (pictures it names under `current/` and `reference/` are in `art-drop/dungeon/reference/`) first, all of it: sections 2 (Canon) and 10 are the rules for every pixel
here. This brief is stage 0a of that plan. Nothing in it goes into the game yet; it sets the look that the
owner approves before anything is produced.

Work on the fork branch `art/dungeon-maps-2026-11-20` (it already holds this brief, the plan and the
references under `art-drop/dungeon/`). Output goes in `art-drop/out/dungeon/d0a/`. Push after each part passes
your critic, as "art-drop: dungeon D0a part X". Author kolacheee, no co-author trailers.

## Inputs (all in `art-drop/dungeon/reference/`)

- `master-interiors-mock.png`: THE master reference (48 px a cell, high 3/4 view). Match its pixel density,
  outline, light, prop scale and wall faces.
- `city-r17.png`: stone and roof ramps for outer walls and yards only.
- `overworld-*.png`: make these first: crop the grass, path and cobble tiles (summer) from
  `packages/server/src/assets/overworld-art/fantasy.json` on fork branch `claude/project-thread-vsyxr6`
  (`git show fork/claude/project-thread-vsyxr6:<path>` for the JSON and its sheet).
- `current/<map>.png`: today's renders of the six mood-frame maps, lossless, at 64 px a cell (scale them to
  48 px a cell in your head; do not resample them into the frames). Keep every wall, door, prop, foe and
  feature where the map has it.

## Rules (from the plan; your critic checks every one)

48 px a cell, drawn natively (no painting big and shrinking, no resampling of any kind). Alpha 0 or 255.
No gradients, blur, glow or airbrush. 1 px outline in the darkest step of the object's own ramp, never
#000, at most one step lighter on top-left edges; floors have no outline. Ramps of 4 to 6 steps with hue
shift. Uniform pixel density. Floor texture in clusters of 3 px or more, no salt-and-pepper. Stepped edges
and curves with even, monotonic run lengths, no doubled corner pixels. Wall faces end in a 1 px ramp-dark
base line on the floor. The value ladder and the gameplay palette in section 2: foes red, loot and keys
gold, found traps hazard orange-yellow with a striped rim, each lair's accent as listed, nothing else uses
those at full saturation. Walls may curve (the owner asked for curved walls), drawn as stepped pixel edges.
Your critic views everything at 1x, 2x and 3x nearest-neighbour, in greyscale, and as a 4x-downscaled
greyscale "squint".

## Part A. Palette

`canon/palette.hex` and `canon/palette.png`: quantise `master-interiors-mock.png` (the PNG, never a JPG),
then hand-merge into named ramps (`wood-oak-1..5`, `plaster-1..5`, ...), dropping stray in-between colours.
Then add named ramps for every material of all 14 looks in section 2 (limestone, iron, sandstone, marble,
brass, parquet, textiles, dark masonry, bone, lichen, grey-brown rock, mud, fungus, blue ice, frost, dark
rock, violet crystal, basalt, embers, ash, brick, slime, sewer water, station panels, hazard paint, clean
tile, soot, oil, planters, overgrowth, plus the reserved gameplay hues and each lair's accent). 5 to 6 steps
each, hue-shifted, each step's L* noted, set against the value ladder.

## Part B. Style guide sheet

`canon/style-guide.png` (and a short `canon/STYLE.md` that says the same in words): every ramp labelled; the
outline rule shown on a crate, a chest and a column; a light-direction sample; one material swatch per
building and set; the prop scale chart (party sprite from the game, door, table, chest, column; the party
and foe sprites marked as a known exception); the value ladder as a greyscale strip; the gameplay palette;
do and don't crops (take the "don't" crops from `current/`: the soft hoard circles, the vector rift, the
16 px brown bars, the checker floor, the grey brick beyond the walls).

## Part C. Proof tiles (14)

`proof/<look>.png` for keep, temple, manor, crypt, cave_rock, cave_ice, cave_crystal, cave_lava,
dungeon_sewer, station_corridor, station_lab, station_engine, station_hydro, and the building yard:
a 3x3-cell patch at 1x with `wall_top`, `wall_face` (with its base line), floor and one prop, plus its
greyscale copy. These test each look's ramps on a face and a floor before production.

## Part D. Six mood frames

`frames/<map>.png` at 48 px a cell (1x), plus `-2x`, `-grey` and `-squint` copies, for: hoard-keep,
breach-temple, sanctum-crypt, cave_rock-plain-21, manor-ground (with its yard, whole outer wall and at
least 1 cell of yard round it), station_lab (use station_lab's layout from the game; if `current/` has no
station_lab render, lay out a 20x16 lab floor with a corridor, a specimen bay and an office). Each frame has a
3-line story in `frames/STORIES.md` (who lived here, what happened, where the eye goes) and must show:
the wall band (top, face with base line, the mass beyond), doors (an open door, a locked door; on one frame a
found secret door), stairs, a found trap, loot (a closed chest and an opened one), the party and a foe, and on
the lair frames the feature (and its broken state as a small inset). Lair frames use their lair's accent and
approach dressing in the rooms and corridors before the chamber.

Pass test for every frame: at 1x a viewer finds the door, locked door, stairs, found trap, loot, foe and
feature within 5 seconds; the squint still separates floor, wall, door, loot and feature.

## Part E. Contact sheet

`d0a-review.png`: the six frames at 1x side by side with the 14 proof tiles below, for the owner.
