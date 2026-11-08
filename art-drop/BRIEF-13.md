# Round 13: scrub, badlands and toxic water as props (after BRIEF-12)

The owner (2026-11-08 00:19) asked for all of these. Snow and coasts are covered by BRIEF-12, so they are left out here. They work like the hills, dunes and craters: props over plain
ground. Use the same pixel scale, top-left light and outline weight as the art already in the game. Transparent
PNGs go in `art-drop/out/`. Push after each part passes your critic.

**Layout:** the same as the hills. Numbers 0-3 are 48x48 (one cell) and must fill about 75-80% of it. Numbers
4-7 are 96x96 (two by two) and fill about 85%. Each needs a soft contact shadow, with no ground square under it.
Every part needs a `@winter` set too: the same props with snow caps or frost.

## A. Scrub (shared by every setting)
- **Files:** `scrub-prop-0..7.png`, `scrub@winter-prop-0..7.png`.
- **Content:** dry bushes and tumbleweed clumps, spiky low shrubs, a dry gully as see-through shading, and
  stony patches. The ground around them is plain dirt or plains, so the shrubs carry their own colour (olive,
  khaki, dry brown), with no green lushness.

## B. Badlands (the wasteland ground, shared by every setting)
- **Files:** `badlands-prop-0..7.png`, `badlands@winter-prop-0..7.png`.
- **Content:** small mesas and buttes with layered red-brown strata, rock spires, and a cracked-earth patch as
  see-through shading. Use sparse dead twigs at most. The large ones are mesas that read as landforms, lit
  top-left.

## E. Toxic water edges (wasteland only)
- **Files:** `wasteland-toxic-prop-0..7.png` and `@winter`. These sit on land cells beside toxic water.
- **Content:** leaking rusted barrels, sludge slicks as see-through green-yellow shading, a rusted outflow
  pipe, and a half-sunk car. The large ones are a drainage culvert and a slag heap with a puddle.

Critic as before: anything that reads as a blob, a speck or a square gets redrawn.

## F. Jungle floor (added 2026-11-08; Earth worlds now have jungle in most settings)
- `jungle-floor-base.png`, 288 px, seamless, like the forest floors: dark humid soil with leaf litter, ferns
  and roots, in a deep green-brown that sits under the jungle trees. No winter version.
