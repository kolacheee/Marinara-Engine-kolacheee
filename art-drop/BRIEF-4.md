# Round 4: grass and plains with small details

The owner (11-06 22:35): "redo plains tiles and mix them up a bit with some small details."

## How the game draws open ground today
- `grass` and `plains` are each ONE seamless 6x6-cell texture (288x288 px, cells 48 px). The game repeats it every 6 cells across the whole map.
- That makes big open areas read as wallpaper, with a visible 6-cell repeat and nothing to catch the eye.
- All six setting packs (fantasy, wuxia, jazz_age, modern, scifi, wasteland) share the same grass and plains art. Draw one set, not one per setting.
- Current art is in `art-drop/reference/current-{grass,plains}{,@spring,@autumn,@winter}.png`.
- In the summer files, `grass` is the darker, lusher green and `plains` the lighter, yellower, drier one. Keep them clearly two different grounds.

## What to draw (art-drop/out/)

### A. New base textures: 8 files
Files: `grass-base.png`, `grass@spring-base.png`, `grass@autumn-base.png`, `grass@winter-base.png`, and the same four for `plains`.

- **Size and wrap:** 288x288, opaque. They must wrap seamlessly: left edge to right edge, top to bottom, and corners. Check by tiling 3x3.
- **Break up the repeat:** use large, soft tonal patches. Lighter and darker drifts of grass, a few worn or sparser spots, and a slightly different tuft density from place to place, so no 1-cell or 2-cell grid shows and the 6-cell repeat is hard to spot when tiled 3x3.
- **Keep it calm:** grass tufts stay sparse. Nothing with a strong silhouette goes in the base; details belong in B.
- **Seasons:**
  - spring: fresher, brighter green;
  - summer (no suffix): as now, but less flat;
  - autumn: plains straw-gold, grass olive-brown;
  - winter: snow over everything, with a few grass tips showing, textured, not flat white paper.

### B. Detail sprites: 64 files
Files: `grass{season}-detail-0..7.png` and `plains{season}-detail-0..7.png`, where `{season}` is empty, `@spring`, `@autumn` or `@winter`.

- **Format:** 48x48, transparent background. One small thing per sprite, drawn inside the cell with at least 6 px clear on every side, so nothing is ever cut off.
- **Grass ideas:** a wildflower clump (2-3 colours), a mossy rock, a small round bush, tall grass tufts, an old stump, a mushroom ring, a pair of small boulders, a patch of clover or small flowers.
- **Plains ideas:** dry grass tufts, a lone small shrub, a flat rock, a few wildflowers, a sandy bare patch with pebbles, a thistle clump, a small cairn, an animal trail scuff.
- **Seasons:**
  - spring: more flowers;
  - autumn: browns and golds;
  - winter: snow-capped rocks, dead shrubs and stumps poking through snow, no flowers.
- **Setting-neutral:** nothing modern or fantasy-specific, because all six settings share these. No buildings, people, roads or water.
- **Size and calm:** the thing covers about 20-45% of the cell, with a soft 1 px dark outline or shadow on its lower side, like the approved markers and farmland. It must read clearly at map zoom without becoming noise.
- **Match the base:** the sprite's own grass colour should match its base, so it sits on it without a visible box. Where possible, leave just the object on transparency.

## How it will look in game
The game draws one detail on roughly 1 cell in 5 of open ground, picked at random, never on roads, places or cell edges. Detail density is the game's job, so don't pack the base.

## QC (critic loop, as before, plus your own look)
- Tile each base 3x3 and check for seams and a visible grid.
- Paste 8 random details over a 6x6 base, about 1 in 5 cells, and check that the details sit naturally: no box, matching palette, and nothing cut off.
- Winter must not be blank white, and autumn plains must read as dry grass, not wood or sand.
- Check at 1x (map zoom) as well as 8x.

Push to `art/overworld-codex-2026-11-06` (fork only) and report.
