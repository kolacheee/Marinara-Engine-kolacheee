# HD-2D dungeon art, job 1

Work only in this folder (/home/kolache/Downloads/hd2d-dungeons). Do not touch `repo/` (the
delivery clone) except the final copy step the supervisor does.

## Style rules (every file)

- True pixel art at native size: no anti-aliasing, no blur, no gradients beyond palette steps.
  32 texels = 1 grid cell (1 m).
- Light from top-left.
- Only colours from the ramps below (dark to light), plus outline #24161f for sprites.
- Generating with the image tool is fine, then downscale nearest-neighbour to the exact size,
  quantise to the ramp, and hand-clean (at most 3% lone pixels). `tools/px.py` does the
  quantise, despeckle, seam and lone-pixel checks; use it.
- Tileable textures must tile seamlessly: check a 2x2 tiling (`python3 tools/px.py tile4 f.png`).
- Look at each file at 1x and 4x/8x and redo any that is flat, noisy, smeared or does not read as
  its material. Quality bar: Octopath Traveler 2 environment textures, but our own palette.
  Drawing a texture procedurally (Python + PIL, already installed) is allowed and often gives
  cleaner, truly seamless results than downscaling an AI image: pick whichever looks better.

## Ramps (dark to light)

See `tools/ramps.json` (same data).

- stone: 2a1d25 43303a 5f4646 7d5f55 9c7a63 bc9a78
- flag: 3a3238 544a4c 6c6260 857a72 9c9185 b4a998
- slate: 1e2128 2c313a 3c4350 505868 667080
- wood: 2e1a17 4a2a20 6b3e28 8c5632 ad7040 cf9254
- iron: 1c1a24 302e3b 4a4858 686778 8d8c9c b9b8c4
- gold: 4a2414 7c4318 b16f1f dba133 f2cd5a fff0a8
- red: 3a1220 5e1a28 8a2632 b23a3a d4604a
- teal: 162a2c 21413e 2f5d55 43796a 5f9681
- cloth: 5e5047 7e6e60 a08f7c c2b199 dccdb2
- leaf: 1b2a1c 27402a 355a32 4b773c 6a9447 8fb25a
- grass: 223321 304a2b 406236 557c40 71964d 94b05f
- cob: 2f2a2e 4a4446 655d5a 80766e 9a8f83 b7ab9a
- earth: 2e221e 46352b 5e4a39 776049 8e7658 a58c6a
- skin: 6e3e30 a8664a d89a70 f0c69a

## Textures (PNG, opaque unless noted)

Floor and ground textures are 128x128 so the repeat is not visible every 2 cells; slab and
feature sizes stay the same (half a cell = 16 texels), so each tile carries more variety. Walls stay 64x64.
Output: out/textures/<name>.png

1. brick_a 64x64: sandstone brick wall (stone). Bricks about 16x8 in running bond, dark mortar.
   Tone varies per brick, a few chipped corners.
2. brick_b 64x64: same wall, damp and old, moss creeping from the bottom (leaf), a couple of cracks.
3. ashlar 64x64: large cut stone blocks 32x16 (flag).
4. wallcap 32x32: top of a wall seen from above. Rough stone (stone, darker steps), seams every 16,
   lighter top-left lip.
5. floor_hall 128x128: polished flagstones, half-cell slabs (about 16x16 and 24x16) in running bond,
   1-2 px dark grout, 4-5 tone variants, 1 px bevel highlight top-left (flag).
6. floor_worn 128x128: rough, worn, cracked flagstones (flag, darker).
7. floor_slate 128x128: dark slate tiles (slate).
8. floor_wood 128x128: floorboards 8 px wide running north-south, nail heads and knots (wood).
9. cobble 128x128: rounded cobbles (cob).
10. grass 128x128: two-tone grass with a few tiny flowers (grass; flower dots may use gold/red/cloth).
11. dirt 128x128: packed earth with pebbles (earth).
12. leafcard 64x64 RGBA, transparent background: a clump of leaves for tree canopies, ragged
    silhouette, inner shading (leaf). Not tileable.
13. bark 32x64: tree bark (wood, dark steps). Tileable.

## Sprites -> out/sprites/<name>.png

RGBA, transparent background, 1 px #24161f outline, facing the viewer at 3/4, about 22-26 px wide
and 40-46 px tall, feet on the bottom row of a 32x48 canvas. Readable silhouettes, Octopath-like
proportions (about 3 heads tall). Any ramp colours allowed.

knight, mage, rogue, cleric (the party), skeleton, goblin.

## Report

Write `out/NOTES.md`: per file, how it was made (procedural or image tool + cleanup), and anything
you are not happy with.
