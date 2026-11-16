# Dungeon tiles

The Engine's own art for each cave, dungeon and station set (`DUNGEON_SETS`): one 48 px image tile pack
per set, by the set's id. Drawn in Pixelforge and approved before landing, then packed by
`scripts/art/pack-builtin-art.mjs`: repack from the approved Pixelforge packs, never edit these files by
hand. Served at `/api/game-tile-packs/builtin/dungeon/<set>`, drawn when a map names no pack of its own.
