# D0a style canon

Version D0a-C.2, 2026-11-20. **The canon cell is 48 × 48 pixels.** All later parts use this size. Draw directly at that resolution; the larger-cell option is not needed for these drawings. Owner acceptance and the eventual canon freeze remain pending.

[style-guide.png](style-guide.png) contains all 61 labelled ramps, outline examples, lighting, the scale chart, 14 material studies, the greyscale value ladder, reserved hues and five do/don't comparisons. [palette.hex](palette.hex) defines the exact colours and their permitted roles. Each ramp has six steps with cool darks and warmer lights. Active adjacent steps are at least 6 L* apart. Marble 6, clean-tile 6, bone 6 and blue-ice 6 are reference-only and stay out of scene art.

Use an orthographic high three-quarter view: a top plane and front face, parallel verticals, no side faces and no converging edges. Match the master PNG's art-pixel scale, joinery and material detail. The master is stored at 2×: one art pixel is one registered 2×2 source block. Author every art pixel at 1:1. Use explicit strokes and clusters, without spatial reduction, filters, gradients, glow, random speckle or soft alpha. Art alpha is 0/255; transparent RGB is zero. Surface sheets allow 32 colours and prop sheets 48. The complete reference atlas combines all materials and is not a production sheet.

Outlines are one pixel in the darkest colour of each object's own ramp, never black. The upper-left outline can rise one step. Keep corners single-width and curved edges in even, monotonic runs. Light comes from the upper left; edge highlights rise at most one step. Cast shadows belong on a separate single-colour layer composited once at 35%, with no stacking. Floor texture has no outline. Place clusters of at least three pixels; do not repeat a distinctive crack, stain or grain feature within a pattern. Built floor joints follow the 48 px grid.

Walls have a 48 px face and a one-pixel ramp-dark baseline against the floor. Doors cut the wall band and retain a frame, lintel and lit threshold. The reusable drawings in `props/` are a braced crate and domed, banded chest at 48 × 48; a column and framed door at 48 × 96; and a table at 96 × 96. Their outlines and interior detail remain one native pixel where drawn that way. The crate is oak; the chest has a teal body, gold bands and a central lock. Its silhouette and colour distinguish it from storage crates.

The scale chart uses the game's real `party[0]` sprite from `packages/server/src/assets/overworld-tiles/fantasy.json`, reached by `DungeonMapView` through `drawTile("party")`. Its original 16 × 16 pixels are decoded without resizing onto a 48 × 48 backing. The source shadow is composited on that opaque backing. Party and foe art are known style/scale exceptions, outside this overhaul; do not use the tiny legacy party as the prop-size ruler.

| Role | L* range | Local requirement |
| --- | --- | --- |
| Void / mass | 5–15 | At most 75% of wall-top L* |
| Wall top | 18–30 | Separate from the mass |
| Wall face | 25–40 | Dark baseline against floor |
| Floor | 35–55 | Total contrast at most 15 L* |
| Main prop body | 30–70 | Body and outline each at least 10 L* from its floor |
| Loot / feature / found trap | Up to 85 | At least 15 L* above its floor |

The neutral greyscale strip is a value diagram, outside the material palette. Compare finished scenes at 1x, 2x and 3x nearest-neighbour, in greyscale and as a quarter-size nearest-neighbour greyscale squint. Only review images may be enlarged or reduced. The squint must separate floor, wall, door, loot and feature.

Each look has a native 48 × 48 material study in `swatches/`. These cutaways show wall finish, floor material and characteristic trim. Their full value range is not a floor pairing. Part C supplies the larger wall/floor/prop proofs; production patterns follow later. The ramp families are:

| Look | Ramps |
| --- | --- |
| Keep | limestone, wood-oak, iron |
| Temple | sandstone, marble, brass |
| Manor | plaster, timber, parquet, textiles-russet, textiles-teal, textiles-sage |
| Crypt | dark-masonry, bone, lichen |
| Rock cave | grey-brown-rock, mud, fungus |
| Ice cave | blue-ice, frost, snowdrift |
| Crystal cave | dark-rock, violet-crystal |
| Lava cave | basalt, embers, ash |
| Sewer | brick, slime, sewer-water |
| Station corridor | station-panels, hazard-paint |
| Station lab | clean-tile, tank-glass, spills |
| Station engine | soot, oil, pipes |
| Station hydroponics | planters, overgrowth, leaks |
| Building yard | yard-grass, yard-path, yard-cobble, roof-slate |
| Lair dressing | hoard-bronze, haven-wine, drowned-kelp, sanctum-cloth, breach-stone, hive-resin |
| Shared darkness | void-mass |

Reserve `foe-red` for foes, `loot-gold` for loot/keys and `found-trap` for discovered hazards, which also require a striped rim. Feature ramps are `lair-hoard` (amber-bronze), `lair-haven` (wine-violet), `lair-drowned` (sea-green), `lair-sanctum` (violet), `lair-breach` (ember orange on the rift), `lair-den` (bone) and `lair-hive` (resin amber-green). Materials and dressing use the muted companion ramps. Hoard heap bodies use steps 3–4; loose loot uses gold 5–6.

The do/don't row contrasts the current soft hoard circles, vector rift, brown-bar furniture, checker floor and bright grey masonry outside walls with constructed objects, hard edges, visible joinery, restrained floor contrast and dark mass. Current crops remain 64 px per cell. Master and summer crops retain their source pixels, colours and texture. They are reference evidence, not palette-locked art. Crop coordinates and provenance are in [crops/SOURCES.json](crops/SOURCES.json); the summer originals remain in `art-drop/dungeon/reference/overworld-*.png`.
