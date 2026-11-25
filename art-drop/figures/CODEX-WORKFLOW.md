# HD-2D art workflow (Codex + checks), as used for the dungeon art drops

Written 2026-11-22 after jobs 1-3 (commits 6b5b5d4, 2522c3e, 8d6ed55, fb363cf on
kolacheee/Marinara-Engine-kolacheee branch claude/project-thread-37mbao, folder art-drop/hd2d/).

## 0. Where it runs

- On the owner's Fedora laptop, in a scratch folder outside every repo
  (~/Downloads/hd2d-dungeons). The deliverables go into a fresh clone of the fork (`repo/` inside that folder),
  never into an existing checkout.
- Codex CLI: the copy bundled with the ChatGPT app, `/usr/lib/chatgpt/resources/codex` (`codex` is not on
  PATH). Signed in with ChatGPT; each run spends the owner's ChatGPT Codex usage.
- Aseprite (source build, full program): `~/Downloads/marinara-agent-handoff/tools/aseprite/build/bin/aseprite`,
  Lua clean-up scripts in `tools/aseprite-scripts/` (frame size is a param: `fw`/`fh`).

## 1. Write the spec first (SPEC.md + tools/ramps.json)

One file Codex reads before anything else:
- Scale: 32 texels = 1 grid cell (1 m). Light from top-left.
- Palette: named ramps, dark to light (stone, flag, slate, wood, iron, gold, red, teal, cloth, leaf, grass,
  cob, earth, skin) plus sprite outline #24161f. Nothing outside them.
- Sizes: walls 64x64; floors and ground 128x128 (at 64 the repeat shows every 2 cells; slab size stays half
  a cell, so the bigger tile just carries more variety); small pieces 32x32; sprites 32x48 RGBA, feet on the
  bottom row, ~3 heads tall (Octopath-like).
- Per file: name, size, ramp, and one line on what it must read as.
- Quality bar: Octopath Traveler 2 environment textures, in our palette.

## 2. Run Codex in parallel batches (runs/run.sh)

```bash
/usr/lib/chatgpt/resources/codex exec --skip-git-repo-check -s workspace-write -C "$W" \
  -c model_reasoning_effort="high" -o "$W/runs/$TAG-last.txt" "$PROMPT" < /dev/null > "$W/runs/$TAG.log" 2>&1
```
- `< /dev/null` is essential: without it a background `codex exec` waits for stdin forever (one run sat
  9 hours producing nothing).
- 3 runs at once (e.g. walls+floors / ground+foliage / sprites), each ~4-10 minutes. Each prompt says:
  read SPEC.md and tools/px.py, do only your files, intermediates in scratch/<tag>/, run the checks, look at
  previews, redo weak files, write out/NOTES-<tag>.md with honest weaknesses, don't touch repo/.
- Revision passes are the same script with a short targeted prompt (what is wrong, what to keep).

## 3. How Codex makes each kind of file (what worked)

- Textures: Codex chose to DRAW them procedurally in Python/Pillow at native size every time, not with
  the image tool. That gives exact palette, crisp shapes and perfect seams (geometry wraps at the edges).
  Encourage this route for tileables.
- Variants meant to alternate (brick_c/brick_d vs brick_a): require the same layout and edges that match the
  base tile pixel for pixel; change only interior patches.
- Sprites: Codex's image tool draws a large design on flat magenta (#FF00FF) -> key the magenta out ->
  `px.py quant` (box downscale to 32x48, palette snap, despeckle, add #24161f outline) -> Codex hand-fixes
  faces, hands and feet pixel by pixel -> Aseprite cleanup.lua:
  ```bash
  aseprite -b --script-param in=X.png --script-param out=X.png --script-param fw=32 --script-param fh=48 \
    --script-param colour=#24161f --script .../aseprite-scripts/cleanup.lua
  ```
  head and ears" fixed it).

## 4. Check every file (tools/px.py), then look at it yourself

- `python3 tools/px.py check files...` reports: colours, off_palette (must be 0), semi_alpha (must be 0:
  alpha is on/off only), lone pixels (keep under 3%), seam score for tileables (~1.0 is seamless; plank
  textures read high because a board gap sits on the edge, which is fine), sprite bbox and feet-on-bottom.
- `px.py tile4 f.png` (2x2 tiling at 4x) and `px.py zoom f.png 8`. Actually view them: flat, noisy,
  smeared, visible repeat, or "doesn't read as its material" -> targeted revision run.
- For sprites, view the whole set side by side at 6x on a mid-grey background to judge scale and consistency.

## 5. Deliver

- Copy into `repo/art-drop/<set>/textures|sprites/`, concatenate the NOTES into NOTES.md, add a README with
  provenance (textures code-drawn; sprites started as AI images then palette-reduced and hand-cleaned).
- `px.py sheet sheet.png textures sprites` builds the contact sheet: each file at 1x and 4x, tileables also
  tiled 2x2.
- One commit per job, author `kolacheee <113030175+kolacheee@users.noreply.github.com>`, no trailers, push to
  the agreed branch, confirm with `git ls-remote`, report the hash plus any files you are not happy with.

## 6. Lessons

- Make the owner's Codex approval explicit and early (the permission check would not accept a relayed
  approval; the owner's own "keep developing" did).
- Never overwrite an existing file the brief reuses a name for (brick_b was the mossy wall; the new variants
  became brick_c/brick_d).
- A rule in the spec can force a weak result (wallcap "seams every 16" at 32x32 = four plain blocks); flag it
  and ask to drop the rule rather than polishing around it.
- Total cost so far: 7 Codex runs, roughly 4-12 minutes each.
