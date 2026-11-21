# Keep lair grid concept (2026-11-21)

`keep-lair-concept.png` is 1488x1104 = 31x23 cells of 48 art px, the block-out's exact size, as true pixel art (every pixel a solid colour; shown at 2x in `keep-lair-concept-2x.png`, which is the master mock's scale). `keep-lair-concept-overlay.png` draws the block-out grid (white), wall edges (cyan) and mismatched cells (red) over it: 711 of 713 cells agree.

How it was made (AI-generated art, Codex image tool):
1. Five paint-overs of `keep-lair-base-clean.png` with `master-interiors-mock.png` as the only style reference. All held the grid; none was pixel art (soft, ~120k colours, 7% solid 2x2 blocks vs 100% in the mock). The best layout (version c2) was kept.
2. c2 was cut into four overlapping quarters at 2x and each re-rendered by the image tool as chunky pixel art (the lower-right quarter twice, with its neighbours attached, to match the cobbles).
3. The quarters were snapped to the art grid with one shared 256-colour palette (mode per 2x2 block) and stitched with the joins mid-cell.
4. Hand fixes: cell (9,6) set back to floor; back-room stairs moved onto cell (26,6).

Checked: walls, faces and floors on the block-out cells; doors at (8,4) locked, (8,6), (14,6), (24,7), (12,15); stairs at (7,4) and (26,6); hoard inside its 18 cells; no figures, text or floor light pools.

Known blemishes: a faint cobble discontinuity along the quarter joins (x 744, y 552); the patched floor cell (9,6) shows its square edge; two spear tips clipped where the back-room cells were swapped.

## Calm version (2026-11-22): `keep-lair-calm*.png`

Owner feedback on the first concept: too busy, props too big, hung props over the floor, every door front-facing, no clear path. This version follows the standing rules: plain dark side walls; props sized to the grid (clutter 1 cell, tables/beds 2x1 at most); nothing hung over the floor; the four doors in side walls drawn edge-on, only (12,15) front-facing; furniture against walls with a clear lane between every door and stair; one set piece per room (hoard, egg nest).

Method: three whole-map paint-overs of the clean base, best one (calm-1, 713/713 cells) kept; rough stairs and a lock sketched onto its exact cells; re-rendered as pixel art in four 17x13-cell quarters at 2x, each with its finished neighbours attached for matching stones; snapped with one shared palette (mode per 2x2) and stitched along minimum-difference seams in 3-cell overlaps. Hand pixel fixes: both stair cells (7,4) and (26,6) redrawn as steps going down; the lock moved onto the edge of door (8,4). Grid check: 713/713 cells.

Known: the two hand-drawn stair cells are flatter than the painted props, and the stairwell table runs under the stair rim; one patched floor patch beside door (8,4) is plain flag without mortar lines; the big hall is sparse by design.
