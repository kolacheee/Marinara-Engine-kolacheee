# Round 14: seasons the overworld still draws wrong (after BRIEF-13)

The overworld now draws each place in its own local season (south flipped, no winter in the tropics, and story-held seasons such as a region locked in autumn). Most ground already has its seasons. A render of all six settings in winter, autumn and spring (2026-11-14) found these still wrong. Same rules as every round: square grid, no rounded edges on grid art, the same pixel scale, top-left light and outline weight as the art already in the game. Transparent PNGs go in `art-drop/out/`. Push after each part passes your critic.

References are in `art-drop/reference/r14/` (crops of what the game draws today).

## A. Autumn grass (shared by every setting): the current one reads as summer
- Files: `grass@autumn-base.png` (288x288, seamless, replaces the current one) and `grass@autumn-detail-0..7.png` (48x48 each, small tufts and leaf litter scattered over it).
- Problem now: `grass@autumn-base` is the summer green with a few red specks; at map zoom it cannot be told from summer.
- Want: late-season meadow. Tawny olive and khaki grass with dry ochre patches and only small remnants of green, a few fallen leaves. It must sit between `plains@autumn-base` (gold, keep that as is) and the summer grass, clearly autumn but not the same gold as plains, so grass and plains still read as two grounds.
- Seamless in a 3x3 repeat, no visible tile seam, no large blobs that show the repeat.

## B. Hills in autumn and winter (shared)
- Files: `hills@autumn-prop-0..7.png` (new) and `hills@winter-prop-0..7.png` (redraw).
- Same layout as `hills-prop-0..7`: 0-3 are 48x48 and fill about 75-80%, 4-7 are 96x96 and fill about 85%, soft contact shadow, no ground square under them. Keep each one's silhouette identical to the summer prop of the same number so seasons swap cleanly; the rock-pile numbers stay rock piles.
- Autumn: the grassy mounds in tawny olive and ochre to match A, a few rust shrubs at most.
- Winter, problem now: the mounds are the summer mounds faded with a white haze; they read as fog, not snow. Want: solid snow cover on the tops and lit faces, blue-grey shade on the lower right, a thin line of dark grass or earth showing at the foot. The rock piles keep their current snow caps.

**Owner change 08:38 UTC (overrides the rest of B):** she saw the current summer hills on the map and said "If these are supposed to be hills, redo them". So B now redraws the summer hills as well, and the autumn and winter sets follow the new summer silhouettes.
- Summer first: `hills-prop-0..7.png`, same layout (0-3 are 48x48 filling about 75-80%, 4-7 are 96x96 filling about 85%, contact shadow, no ground square).
- Problem now: blurry, outline-less smears with no height; at map zoom they read as boulders, puddles or fog, not hills.
- Want: crisp pixel art in the style of the approved mountains (`mountains-peak-*`) and trees. One-pixel dark outline; clearly a grassy hill with real height: rounded crest lit from the top left, darker shaded right and lower slope, a few slope or terrace lines, some grass-tuft texture, a small rock outcrop or bush on some. 4-7 are rolling hill groups with two or three overlapping crests at different heights. No soft airbrush gradients, no blur. The rock-pile numbers become grassy hills too, so all eight are hills. Clearly lower and rounder than the mountains. The green sits on the summer grass (`reference/r14/fantasy-grass-0.png`) without vanishing into it: slightly lighter lit face and darker shade.
- Then `hills@autumn-prop-0..7` and `hills@winter-prop-0..7` from the new summer silhouettes, as above.
- Critic for B: the eight on summer grass at 1x and 4x, plus a 1x map-like crop with 20-30 scattered over grass next to a forest edge. Fail if any reads as a blob, rock, puddle or fog at 1x.

## C. Broadleaf forest in winter (shared)
- Files: `treeline_forest@winter-0..7.png` (48x48 each, the trees standing over the forest floor; same footprint, trunk base and size as `treeline_forest-0..7`).
- Problem now: the winter forest is the summer green canopy with snow dusted on top. Broadleaf trees are bare in winter.
- Want: bare deciduous trees: brown trunk, branching crown with snow lying along the upper branches, the crown still dense enough that a forest of them reads as woodland at map zoom (not a field of twigs). Match the style of the town's bare winter tree (`reference/r14/fantasy-tree@winter-*.png`). Vary the eight: oak, beech, birch (pale trunk), a smaller sapling, two with a few dead brown leaves still hanging.
- Conifers are separate and already right; do not touch them.

## D. Sci-fi town trees and town ground in other seasons (sci-fi only)
- Files: `scifi-tree@autumn-0..3.png`, `scifi-tree@winter-0..3.png`, `scifi-tree@spring-0..3.png` (96x96 each), and `scifi-town_ground@winter-base.png` (288x288, seamless).
- Problem now: a sci-fi town in winter keeps green trees on bare grey paving with no snow.
- The four trees are the town planters in `reference/r14/scifi-tree-0..3.png`: bonsai in a ring planter, glowing cyan tree, hedge box, dome garden. Keep each planter, its silhouette and its lights the same, and change only the plants and add weather:
  - autumn: the bonsai and hedge turn rust and amber; the glowing tree keeps its glow, its leaves shift toward teal-violet; the dome stays green inside (it is heated).
  - winter: snow on the planter rims and on the bonsai and hedge; the glowing tree bare-ish with snow on its branches and the glow kept; the dome has snow on its top and green inside.
  - spring: pale pink blossom on the bonsai, fresh light green hedge, glowing tree with brighter new growth.
- `scifi-town_ground@winter-base`: the same paving as `reference/r14/scifi-town_ground-0.png` with a thin snow layer, snow gathered along joints and edges, the paving pattern still readable. Square, no rounded edges.

## Critic
Check every file at 1x and 4x, in a 3x3 repeat for the grounds, and on the summer ground for props. Anything that reads as a blob, a smear, fog, a speck or a square gets redrawn. Seasonal partners must keep the summer silhouette. At most 4 critic rounds.
