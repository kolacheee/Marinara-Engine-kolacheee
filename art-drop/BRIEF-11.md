# Round 11: city lanes (owner, 2026-11-07 22:15: "tiny roads centralizing around the city ... like a highway system")

The game now runs thin lanes out from each city through its built-up ground, joining the main roads. They
currently borrow the town path art (`reference/joined/<family>-path_joined.png`), which reads too pale beside the
dark main road (`reference/joined/<family>-road_joined.png`).

## Files: `<family>-lane.png` for jazz_age, modern, scifi and wasteland (summer only; the game uses it all year)
- **Exactly the layout of `<family>-path_joined.png`**: 192x1104, 4 columns x 23 rows of 48 px pieces, every piece in
  the same place, the same join geometry and the same lane width as the path. Only the look changes.
- The lane's surface and edges match that family's main road (`<family>-road_joined.png`): same asphalt or
  cobble colour, darker kerb line each side, faint centre marks only where the road has them. Thin: keep the path's
  width, never the road's.
  - jazz_age: dark macadam with a pale kerb;
  - modern: dark asphalt, thin light kerb lines;
  - scifi: dark asphalt with a faint cyan edge glint every few pieces (not on every piece);
  - wasteland: cracked grey asphalt with sand drifting over the edges.
- Transparent outside the lane, no halo, no outline box. Pieces must join seamlessly with each other and with the
  main road where they meet it.

## QC
Tile a cross, a T, a bend and a diagonal run onto `out/wasteland-wasteland-base.png` and `out/grass-base.png` at 1x
next to a strip of the road: the lane must read as a smaller road of the same network.
