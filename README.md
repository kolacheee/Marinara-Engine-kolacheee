# Marinara theming test images, round 3

AI-generated with the OpenAI Codex CLI's built-in image tool (codex-cli 0.166.0-alpha.6, ChatGPT plan), then resized, cropped and made seamless locally by `process.py` (Pillow). Not CC0 or hand-made art: note the provenance wherever these land.

- `gen.sh` runs one Codex generation; `jobs1.txt` holds the first-pass prompts, `jobs2.txt` the night versions, `jobs3.txt` regen batch 1 (creator frame/stickers/strip, Seraphine) (each an edit of its day image, so the pair lines up).
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
