# Creature art

The Engine's own creature art, drawn for fights before any creature pack is chosen or for creatures the
chosen pack lacks. `srd-monsters/pack.json` is a creature pack (v2, with flying blocks) whose sheets are the
PNG files beside it, one per creature's walking or flying block (three frames across, the four facings
down), served at `/api/game-tile-packs/creatures/builtin/sheet/<id>.png`.

The art is AI-generated (Codex image generation through Pixelforge's pipeline), then pixelized and corrected
by hand review; it was approved for shipping on 2026-10-11. Rebuild with
`node scripts/art/pack-builtin-creatures.mjs <monsters dir> <stills pack>`; never edit pack.json by hand.
