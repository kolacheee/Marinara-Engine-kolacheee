# Pixelforge — pixel closed-world RPG Experience (Phase 1 skeleton)

A downloadable Game Mode **Experience** (capability package, `game-surface` slot): a walkable
top-down pixel village in the spirit of pre-3D Harvest Moon / Stardew Valley, rendered by a
package-owned Canvas2D engine, with NPC dialogue flowing into the normal GM turn loop, World Maps
(hierarchical spatial context) read/write integration, and hand-off to the engine's **vanilla
combat** (never touched).

Design source: the Pixelforge feasibility exploration (2026-08-15). This package is the
**Phase 1 / zero-engine-PR skeleton** from that roadmap: client-only, no server entrypoint, no
restart after install, Tier-0 procedural art.

## Layout

```
experiences/pixelforge/
├── src/                    # concatenated in filename order into one client.js (no bundler)
│   ├── 00-prelude.js       # PF namespace, RNG, DOM/api helpers
│   ├── 10-art.js           # Tier-0 procedural tiles + actor sprites (no assets, no network)
│   ├── 20-world.js         # deterministic world gen: village + inn interior, collision, NPCs
│   ├── 30-sim.js           # fixed-timestep sim: movement, portals, NPC wander, clock
│   ├── 40-render.js        # chunk-composited Canvas2D renderer, y-sort, day/night tint
│   ├── 50-spatial.js       # World Maps client: read, travel transitions, narrated-drift sync
│   ├── 60-save.js          # debounced world save into chat metadata (never per-frame)
│   ├── 70-hud.js           # main-mount HUD: D-pad, Talk/Travel, clock, toasts
│   ├── 80-setup.js         # wizard body (view="setup"): emits the classic required config
│   └── 90-element.js       # custom element + double-mount adapter + core singleton
├── manifest.template.json  # everything but files[] / builtAgainst (build fills those)
├── build.mjs               # node build.mjs → dist/pixelforge/<version>/{client.js,manifest.json}
├── install-local.mjs       # node install-local.mjs [--data-dir <path>] → dev-install + registry
└── README.md
```

## Build & local install (development)

```
node build.mjs
node install-local.mjs --data-dir ../../packages/server/data
```

`install-local.mjs` copies the built package into
`<data-dir>/capability-packages/versions/pixelforge/<version>/` and registers it in
`<data-dir>/capability-packages/installed.json` (backing the file up first). This bypasses the
catalog install path **for development only** — a real release ships through the pinned
Marinara-Agents catalog with hash-pinned files. No engine restart is needed (client-only package),
but reload the browser tab. The Experience then appears in the new-game wizard's Experiences block.

## Host contracts used (all verified against staging @ 068d01fad)

- Element: `marinara-capability-pixelforge`; host assigns `node.capabilityProps` **after**
  `connectedCallback` and dispatches `marinara-capability-props`; errors are reported by
  dispatching `marinara-capability-runtime-error` with `detail.message`.
- Double mount: the same element is created twice with `view="surface"`. The underlay instance
  receives `{layer: "underlay", backgroundUrl}` and renders the world (behind narration/combat by
  host stacking); the main instance receives the full engine props and renders only the HUD.
  `props.layer === "undefined"` is the main-mount discriminant; layer is unknown at attach.
- Turns: `props.sendMessage(text, attachments?, pendingSpatialTransition?)`.
- Chrome: `props.setExperienceChrome({providesPlayerInput, ...})` — input is withheld while
  walking, handed back during dialogue.
- Spatial: `GET /api/chats/:id/spatial-context` → `{definition, currentLocationId, breadcrumb,
  destinations}`; travel attaches `{destinationId, expectedDefinitionRevision,
  expectedCurrentLocationId, commandId}` as `sendMessage`'s third argument. Spatial context is
  **authoritative**: a location change with no in-flight command teleports the avatar (narrated
  drift), the world never queues a compensating transition.
- Saves: `PATCH /api/chats/:id/metadata` (with the required `x-marinara-csrf` header) writing a
  single `pixelforge` key (< ~4 KB). Event-driven — zone change, dialogue, travel, turn end — plus
  a positional autosave at most every 30 s while moving; flushed with `keepalive` on teardown.
  Because ~40 engine call sites still whole-blob-write metadata outside the patch queue (the
  issue #5076 class), the key can be silently erased between turns: the package keeps in-memory
  authority and re-writes the key when an incoming `chatMeta` has lost it.

## Deliberate constraints (from the verified exploration)

- **No server entrypoint, ever** (no restart-after-install; no package routes — they would be
  admin-gated off loopback and unusable on Android over LAN).
- **Never call** `/game/time/advance` or `/game/weather/update` — their unqueued whole-blob
  metadata writes race concurrent writers (filed as engine issue #5076). The in-world clock is
  package-local until that lands.
- **Combat is vanilla and untouched**: the world pauses and the HUD hides on
  `chatMeta.gameActiveState === "combat"`; encounters happen only through narration. No combat
  state is read or written.
- Both degraded World-Maps states are handled: no spatial context at all, and a game that fell
  back to standard mode (hierarchical-maps uninstalled between create and start).
- The underlay never paints outside the integer-scaled viewport, so the host's scene/storyboard
  background stays visible in the letterbox bands; during replay the canvas clears entirely.
- Single-file ES module; no WASM, no eval, no external libraries (CSP + single-entrypoint serving).

## Review-verified behavior notes

- Combat mode is inferred from `chatMeta.gameActiveState`, which is the GM's *narrative* state and
  can flip to "combat" without any combat UI mounting — so the HUD always keeps a Resume exit
  visible in combat mode, and the player's Resume overrides the narrative state until it changes.
- Spatial transition commits/rejects are reported by the host only as capability events addressed
  to `hierarchical-maps`; this package cannot hear them, so a pending travel self-clears after two
  turn-boundary refreshes with no movement.
- The wizard's seed reaches metadata at `gameSetupConfig.experienceConfig.experienceConfig.seed`
  (the chooser nests the package config); `restore()` reads that path, the saved key, and finally a
  chat-id hash — and setup also seeds the `pixelforge` key directly (retried) so the first mount is
  deterministic.

## Phase-1 TODO (tracked for later commits)

- Message-anchored delta log + checkpoint-restore / branch self-heal (currently: last-write world
  state, checkpoint/branch/swipe divergence documented — durable fix is engine PR-E /
  `game_engine_state` exposure, see issue #5077).
- Zone↔spatial-location binding editor (currently only the starting location is bound).
- Touch camera zoom; gamepad input.
- Tier-1 authored atlas + PR-A asset serving; Tier-2 AI bake (Phase 4 of the roadmap).
- Package-side reconciliation for externally-queued spatial transitions (hidden host map chrome
  stays mounted under an Experience).
