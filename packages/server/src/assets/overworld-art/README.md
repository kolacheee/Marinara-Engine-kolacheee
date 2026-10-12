# Overworld art

The Engine's own art for the Game Mode overworld, towns and rooms: one 48 px image tile pack (tile pack
version 2) per setting family, with its seasons (`<id>@spring`, `@autumn`, `@winter`). Drawn in Pixelforge
and approved before landing, then packed by `scripts/art/pack-builtin-art.mjs` (`pnpm art:builtin <dirs>`):
repack from the approved Pixelforge packs, never edit these files by hand. Characters are not shipped
here. The Engine serves them at `/api/game-tile-packs/builtin/<family>`; a pack chosen in the tile-pack
library wins.
