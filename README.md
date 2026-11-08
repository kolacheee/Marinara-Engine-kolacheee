# Marinara theming test images, rounds 3 and 4

## Round 4 (branch theming-r4-images)

Same method as round 3 (Codex CLI image tool, then Pillow). Requests: `requests-batch1.md`, `requests-batch2.md` (one line per image: `<persona>/<file>.png | WxH | transparent? | prompt`); retries with tightened prompts in `requests-batch1-retry.md`. Times per generation in `times.txt` (round 3's are in `times-r3.txt`).

- `run_batch.py requests-batchN.md [persona/name ...]` runs `gen.sh` 3 at a time. A night/day twin is generated as an edit of its source's raw (`TWINS` in run_batch.py); a REGEN line gets the round-3 image as a "what went wrong" reference, not a layout to copy.
- `process4.py [persona/name ...]` turns `work/<persona>/<name>/raw.png` into `images/<persona>/<name>.png` at the exact size, using the per-image recipes in `recipes.py`.
- Drawn or derived in code, not generated, because the brief asked for exact geometry or a pixel-identical twin: `minimal/game-stage` (draw_minimal.py), `maximal/topbar-strip` (exact 512x48 pixel spec), `maximal/backdrop-night` (the day art grid relit class by class, so silhouettes match pixel for pixel; stars and moon placed in code), `access/horizon-strip-night` and `access/sprig-night` (the day image recoloured, same shapes), `creator/topbar-band-night` (day band relit, the generated night had clipped the leaves). The Codex raws for these stay in work/ for reference.
- Partly redrawn: `neon/topbar-strip` keeps the generated circuit plate but the tube is drawn to spec (2 px core, glow, cyan to magenta and back so it tiles); `access/horizon-strip-day` gets a rolling seamless hill top edge.
- Pixel-art sheets (`maximal/stickers2`, `ui-icons`, `emblem`) are snapped to an exact block grid (best phase, block-centre sample, flat colours); the emblem is locked to its spec palette.
- Particle tiles (`immersion/ambient-motes`, `creator/ambient-leaves`, `neon/rain-tile`) drop any particle the raw's edge cut, so the wrap never slices one; the leaves are re-spread on a jittered grid.

## Round 3

AI-generated with the OpenAI Codex CLI's built-in image tool (codex-cli 0.166.0-alpha.6, ChatGPT plan), then resized, cropped and made seamless locally by `process.py` (Pillow). Not CC0 or hand-made art: note the provenance wherever these land.

- `gen.sh` runs one Codex generation; `jobs1.txt` holds the first-pass prompts, `jobs2.txt` the night versions, `jobs3.txt` regen batch 1 (creator frame/stickers/strip, Seraphine) (each an edit of its day image, so the pair lines up).
- `minimal/backdrop-day.png` and `backdrop-night.png` are drawn exactly by `draw_minimal.py` (Pillow, no AI): circle #E10600, diameter 40% of height, centre 74% across / 35% down; 3 px line at 82% down; day field #F2F0EC with faint noise grain, night #0A0A0A with a #E8E8E8 line.
- 9-slice frames: decoration only in the outer 32 px (24 px for access, 40 px top / 16 px bottom for the pixel window); the middle is transparent.
- Strips repeat left to right: a measured pattern period, or a mirrored tile for the lace.

## Generation time per image (seconds)

Later lines for the same image are regenerations.

```
cozy/backdrop-day rc=0 secs=37 exists=yes
neon/topbar-strip rc=0 secs=39 exists=yes
cozy/stickers rc=0 secs=40 exists=yes
cozy/topbar-strip rc=0 secs=45 exists=yes
neon/backdrop-day rc=0 secs=46 exists=yes
cozy/frame-9slice rc=0 secs=48 exists=yes
neon/hud-9slice rc=0 secs=54 exists=yes
neon/grid-tile rc=0 secs=38 exists=yes
minimal/backdrop-day rc=0 secs=40 exists=yes
minimal/paper-tile rc=0 secs=46 exists=yes
creator/topbar-strip rc=0 secs=35 exists=yes
creator/thumbnail rc=0 secs=47 exists=yes
creator/backdrop-day rc=0 secs=47 exists=yes
immersion/parchment-tile rc=0 secs=49 exists=yes
immersion/backdrop-day rc=0 secs=57 exists=yes
access/backdrop-day rc=0 secs=39 exists=yes
immersion/topbar-strip rc=0 secs=46 exists=yes
immersion/gold-frame-9slice rc=0 secs=53 exists=yes
immersion/dialogue-box rc=0 secs=58 exists=yes
maximal/topbar-strip rc=0 secs=36 exists=yes
maximal/window-9slice rc=0 secs=45 exists=yes
access/thick-frame-9slice rc=0 secs=47 exists=yes
maximal/backdrop-day rc=0 secs=48 exists=yes
maximal/stickers rc=0 secs=46 exists=yes
maximal/dot-tile rc=0 secs=34 exists=yes
minimal/backdrop-night rc=0 secs=37 exists=yes
access/backdrop-night rc=0 secs=57 exists=yes
neon/backdrop-night rc=0 secs=67 exists=yes
cozy/backdrop-night rc=0 secs=68 exists=yes
creator/backdrop-night rc=0 secs=74 exists=yes
maximal/backdrop-night rc=0 secs=74 exists=yes
immersion/backdrop-night rc=0 secs=85 exists=yes
creator/topbar-strip rc=0 secs=35 exists=yes
creator/stickers rc=0 secs=37 exists=yes
creator/frame-9slice rc=0 secs=51 exists=yes
immersion/char-seraphine rc=0 secs=55 exists=yes
```
