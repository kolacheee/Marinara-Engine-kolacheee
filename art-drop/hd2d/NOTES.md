
## A — wall and floor textures 1–7

All seven PNGs were drawn procedurally at native resolution with Python/PIL using only their specified ramps. No image generation, resampling, antialiasing, alpha, or continuous gradients were used. Geometry wraps across boundaries. Top-left highlights, lower/right shadows, connected pixel clusters, and sparse chips supply the material detail. The generator applies `px.despeckle` to remove true isolated islands. Source: `scratch/A/draw_textures.py`.

### Files and honest limitations

- **`textures/brick_a.png` (64×64, stone):** 16×8 running-bond sandstone, varied brick tones, short bedding marks, shallow pits and occasional chipped corners. Small bricks necessarily have abbreviated surface detail; the 64-pixel color arrangement can be recognized over a large wall.
- **`textures/brick_b.png` (64×64, stone + leaf):** matching course geometry with darker lower masonry, two stepped cracks, and irregular moss mats growing from lower joints. Moss wraps across the vertical boundary. Its concentration at the bottom creates a recurring moss band on tall repeats; it is most convincing at the base of a wall. This is a separate weathered texture, not a perfectly color-matched damage overlay for brick_a.
- **`textures/ashlar.png` (64×64, flag):** 32×16 running-bond cut blocks, broad quarry facets, sparse tool marks, chipped edges. The diagonal face shading is deliberately stylized and the large block arrangement makes the small repeat easier to recognize.
- **`textures/wallcap.png` (32×32, darker stone steps):** four rough 16×16 capstones, dark seams and lighter upper/left lips. The compact four-stone repeat is visible on broad tiled areas; its intended use is narrow wall tops. No brightest stone-ramp color is used.
- **`textures/floor_hall.png` (128×128, flag):** 16×16 and 24×16 slabs in offset courses, four main face-tone variants, dark grout, one-pixel top-left bevels, restrained mineral bands and stepped highlights. Polish is suggested by the clean faces and narrow highlights; the flat PNG cannot provide view-dependent reflections. Some long mineral bands remain visibly stylized at 8×.
- **`textures/floor_worn.png` (128×128, darker flag steps):** mixed-width slabs with broader wear facets, pitting, chipped bevels and sparse branching cracks. Cracks are intentionally prominent for native-size readability; some wear facets share a recognizable procedural shape vocabulary.
- **`textures/floor_slate.png` (128×128, slate):** dark mixed-width slate slabs with broken cool highlights and thin horizontal cleavage layers. Directional layers read best at native size; the regular paving and flat color steps are more stylized than a detailed painted rock surface.

### Verification and review

Final files were inspected at 1× and 8× and as 2×2 tiled previews made by `tools/px.py tile4`. First-pass centered patches looked stamped; they were revised to edge-connected facets, finer pitting and mineral bands. No mismatched tile boundary or smear was visible in the final tiled previews. The regular courses and finite repeats remain visible as described above. This is an unlit texture review, not validation of the final Octopath-like appearance in an engine.

`tools/px.py zoom ... 8` and `tile4` outputs are in `scratch/A/`; `native-review.png` collects all seven at 1× and `walls-review.png` collects the wall zooms. `scratch/A/review.py` rebuilds the previews. Dry/damp bricks share a cyclic origin; the hall and slate also use cyclic crop offsets. These change neither pixel values nor wrap continuity, but avoid a grout-biased origin in the checker's limited edge-versus-center sample. Numeric seam scores are supporting evidence, not proof of seamlessness.

| File | Lone pixels | Seam score | Off-palette | Semi-alpha |
| --- | ---: | ---: | ---: | ---: |
| brick_a | 0.0% | 1.01 | 0 | 0 |
| brick_b | 0.9% | 1.00 | 0 | 0 |
| ashlar | 0.1% | 1.08 | 0 | 0 |
| wallcap | 0.1% | 0.97 | 0 | 0 |
| floor_hall | 0.3% | 1.00 | 0 | 0 |
| floor_worn | 0.1% | 1.13 | 0 | 0 |
| floor_slate | 0.0% | 1.00 | 0 | 0 |

Additional assertions verified exact dimensions, opaque RGB mode, each file's specific permitted ramps, and equality between the final PNGs and the copies used for preview generation. Full check output: `scratch/A/check-final.txt`. No files in `repo/` were changed.

## Textures 8–13 — ground, canopy, and bark

All six were drawn at native resolution with Python/Pillow, using exact SPEC.md ramp colours. No image generation, resampling, antialiasing, or blended colours were used. Source: `scratch/B/draw_textures.py`. This route was chosen for predictable 8 px board widths, crisp leaf clusters, and periodic tile geometry. `tools/px.py` supplied despeckling, validation, 8x previews, and 2x2 tiled previews. Rebuild previews with `python3 scratch/B/make_previews.py`.

### Files and honest limitations

- **8. `out/textures/floor_wood.png` — 128×128 RGB.** Sixteen 8 px north–south boards, staggered plank ends, broken grain, elongated knots, recessed nail pairs, and restrained top-left edge light. Revised the initial overly dark full-length outlines and oversized nails. **Weakness:** equal board widths remain deliberately regular; the narrow boards leave limited room for complex knot rings.
- **9. `out/textures/cobble.png` — 128×128 RGB.** Periodic jittered paving cells with clipped, rounded corners, varied stone values, top-left rim light, lower-right shadow, and short worn surface facets. Replaced the first row-based design because it read as wall masonry. **Weakness:** a few cobbles remain relatively angular, and the small worn-facet motif repeats across stones.
- **10. `out/textures/grass.png` — 128×128 RGB.** Two dominant grass tones arranged into irregular folded-blade clusters, sparse lighter accents, and five tiny cream/gold flowers. Replaced broad colour patches with interlocking blade shapes. **Weakness:** this represents dense short grass; it will not supply the silhouette or parallax of separate tall grass cards. Flowers can reveal the repeat over a large open field.
- **11. `out/textures/dirt.png` — 128×128 RGB.** Packed earth with small, stepped tonal patches, shallow scuffs, and 32 pebbles with upper-left highlights and lower-right contact shadows. Revised the original broad patches to reduce conspicuous repeating shapes. **Weakness:** the soil relief remains intentionally shallow, and the pebble range is modest. Repeated patches can still be found when inspecting a large unbroken area.
- **12. `out/textures/leafcard.png` — 64×64 RGBA.** Overlapping canopy lobes, pointed leaf polygons, darker undersides, brighter upper-left leaves, and a ragged transparent perimeter. Revised leaf size and spacing and removed isolated colour accents. Uses only the leaf ramp, with alpha exactly 0 or 255. **Weakness:** the overall clump is compact and roughly rounded; repeated instances need varied placement to avoid a ball-like canopy. Not tileable by design.
- **13. `out/textures/bark.png` — 32×64 RGB.** Periodic wandering ridges, deep fissures, elongated knots, and broken left-edge light, using only the four darkest wood steps. **Weakness:** the small required repeat and long ridges will be apparent on very broad trunks; this best suits relatively narrow trunks.

### Validation and visual review

Viewed all six at native size and 8x. Viewed 2x2 tilings for all five tileable files and revised material readability before the final pass. Preview images are under `scratch/B/previews/`; `overview.png` includes every file at native size and enlarged. Full checker output is in `scratch/B/check.txt`.

| File | Off palette | Semi-alpha | Lone pixels | Seam |
| --- | ---: | ---: | ---: | ---: |
| floor_wood | 0 | 0 | 0.3% | 1.01 |
| cobble | 0 | 0 | 2.2% | 1.02 |
| grass | 0 | 0 | 0.1% | 0.98 |
| dirt | 0 | 0 | 0.1% | 1.01 |
| leafcard | 0 | 0 | 0.4% | N/A |
| bark | 0 | 0 | 0.4% | 0.97 |

Additional assertions checked exact dimensions, RGB versus RGBA modes, each file's assigned ramps, binary alpha, and lone-pixel limits. Tile geometry wraps across both axes. Small wrapped translations select tile origins with representative edge/centre cross-sections; no pixels were blended or copied over seams. The seam checker compares only two cross-sections, so its ratios are a heuristic; the tiled previews were also inspected for visible joins.

These are palette-limited native pixel textures intended for HD-2D use. They have not been reviewed inside the game's camera, lighting, or scene composition, and that final integration is needed to judge the Octopath Traveler 2 reference bar. `repo/` was not accessed or changed.
## C — six character sprites

Delivered `sprites/knight.png`, `sprites/mage.png`, `sprites/rogue.png`,
`sprites/cleric.png`, `sprites/skeleton.png`, and `sprites/goblin.png`.
All are 32×48 RGBA PNGs with binary transparency. Each opaque bounding box is
26×46, from `(3, 2)` through `(28, 47)`, with feet on row 47. The palette is
restricted to SPEC.md ramps and the exact `#24161f` outline. Light comes from
the upper left. The four party faces share a nine-by-seven-pixel construction;
headwear, skull, ears, clothing and equipment provide character differences.

### Method

Each character began as a separate built-in image-tool design on flat
`#ff00ff`. The magenta was keyed to fully transparent **before** any reduction.
The keyed silhouette was cropped and reduced with nearest-neighbour to a
24×44 working shape on a 32×48 canvas. Each then passed through:

```text
python3 tools/px.py quant IN OUT --size 32x48 --ramps RAMPS --alpha --outline
```

The quantized images were retained as the bases. Native-resolution,
hand-authored coordinate edits rebuilt faces, eyes, grips, fingers, boots,
soles, weapon edges and selected material highlights. A small palette-cluster
cleanup joined reduction noise and disconnected contour corners. A final
hand-placed detail pass restored purposeful glints and facial features. The
outermost occupied pixels were checked against the exact outline colour.
There is no antialiasing or partial alpha in the deliverables.

| File | Quantization ramps | Specific cleanup | Remaining weakness |
| --- | --- | --- | --- |
| `sprites/knight.png` | iron, red, gold, skin, wood | Steel helmet planes; common facial construction; segmented pauldrons and gauntlets; straight sword blade; simplified shield emblem; separated steel boots. | The small shield emblem is abstract, and the sword is a very narrow graphic blade. Plate and cape shadows merge in a few dark interior areas. |
| `sprites/mage.png` | teal, cloth, wood, gold, skin | Teal hat and robe folds; cream lining corrected out of skin tones; crystal, staff grip, book page edge, face and boots rebuilt. | The staff is visually straight and the spellbook has only a few pixels of detail. The pointed hat makes the overall head silhouette taller than the hooded characters. |
| `sprites/rogue.png` | slate, wood, red, iron, skin | Hood rim, scarf, shared facial proportions, leather strap, buckle, fingerless gloves, diagonal dagger and boot highlights. | The compact dagger has a coarse staircase edge. Dark trousers and cloak depend on their lighter edges for separation against dark scenes. |
| `sprites/cleric.png` | cloth, red, gold, skin, wood | Neutral linen restored; face and fingers redrawn; book cover/page edge; coherent gold hems; mace head and boots. | The book clasp and mace are simplified. Robe folds are broad, and the stole's tiny original ornamental marks were removed for clarity. |
| `sprites/skeleton.png` | cloth, red, iron, wood | Two unequal skull sockets, compact jaw, three readable rib pairs, paired hand bones, shin highlights and grounded bony feet. | Ribs are deliberately graphic, and individual finger/toe anatomy is compressed into connected bone clusters. The skull has less facial expression than the party. |
| `sprites/goblin.png` | leaf, wood, red, iron, cloth, gold | Green facial planes, eyes, nose and compact tusks; lit ear rims; hands; leather panels, buckle, crude knife and boot cuffs. | Wide ears make the head read broader than the humans. The tusks merge into a small ivory mouth cluster at native size; leather patches are intentionally simplified. |

### Verification and visual review

`tools/px.py check` was run on the six final files:

| Sprite | Colours | off_palette | semi_alpha | Lone pixels |
| --- | ---: | ---: | ---: | ---: |
| knight | 17 | 0 | 0 | 2.1% |
| mage | 18 | 0 | 0 | 0.7% |
| rogue | 17 | 0 | 0 | 1.6% |
| cleric | 17 | 0 | 0 | 1.9% |
| skeleton | 13 | 0 | 0 | 1.2% |
| goblin | 17 | 0 | 0 | 1.3% |

The final 1×/4× sheet, 8× zooms and 2×2 repeats were generated with
`tools/px.py` and visually inspected. Revisions addressed noisy highlights,
lost eyes, fabric/skin colour confusion and inconsistent feet. These are
**non-tileable sprites**; the 2×2 previews check silhouette spacing and repeat
consistency, not seamless texture joins. A seam score is not applicable.

All intermediate work is under `scratch/C/`:

- `prompts.json`: exact design prompts; `*-design.png`: original designs.
- `*-keyed.png`, `*-native.png`, `*-quant.png`: reduction stages.
- `prepare.py`, `cleanup.py`, `polish.py`, `details.py`, `review.py`: ordered,
  reproducible preparation, pixel edits, cleanup, detail and validation steps.
- `cluster-edits.json`: per-pixel cluster cleanup record.
- `validation.json` and `check.txt`: final assertions and helper output.
- `previews/native-and-4x.png`, `previews/all-8x.png`,
  `previews/all-2x2.png`: inspected review sheets.
- `previews/sprites/`: individual helper-generated previews.

The set targets the requested fantasy material language within the fixed
palette, but the small native canvas requires simpler faces and ornament
than the reference game's most elaborate character art. `repo/` was not
accessed or modified.
# Revision pass D — wallcap, goblin, floor_worn

Read SPEC.md and tools/px.py before work. Inspected the five other delivered sprites plus the original goblin at native size and enlarged. Used Python/PIL at native resolution for all three revisions; no image-generation, resizing of final artwork, anti-aliasing, or new palette colours. Only the three requested PNGs were replaced in out/. Intermediates, original backups, reproducible drawing code, checks, and previews are in scratch/D/. Did not touch repo/.

## out/textures/wallcap.png

- 32×32 opaque RGB. Redrawn with four individually authored, irregular stone contours on the required 16-pixel joint grid. Chips interrupt the contours; darker lower/right ledges, stepped fracture planes, and short pits break up the faces. Broken top-left lips carry the light. Uses stone steps 0–4, omitting the brightest step.
- Native Python/PIL polygons and orthogonal strokes, followed by tools/px.py's wrap-aware despeckle. Inspected the 8× enlargement and 2×2 tiling; added a second pass of cleavage ledges after the initial review looked too broad and flat.
- Check: 5 colours; off_palette=0; semi_alpha=0; lone=0.1%; seam=1.00.
- Honest weakness: a 32-pixel texture with four stones still has a recognisable four-stone repeat over a large field. The rough, recessed joints are quite dark; this should read best on the narrow wall-top surface for which it is intended. Small pits and fractures remain deliberately simplified at this resolution.

## out/sprites/goblin.png

- 32×48 RGBA canvas; final opaque bounds (3,13)–(29,48), **26 pixels wide × 35 pixels tall**, feet on the bottom row. The original was 26×46.
- Hand-authored native Python/PIL silhouette and body: raised back/shoulder, short torso, bent spread legs, lowered weapon, flared ears, compact leather jerkin with diagonal strap. Repositioned and selectively repainted the original cap/face to preserve its design and the existing set's leaf greens, brown leather, red cloth, dull iron, and exact #24161f outline. No whole-sprite scaling. Compared the final result against all five other sprites on a shared baseline.
- Ran the requested Aseprite cleanup on the final drawing (input and output both scratch/D/goblin.png), with fw=32, fh=48, colour=#24161f and /home/kolache/Downloads/marinara-agent-handoff/tools/aseprite-scripts/cleanup.lua. Copied the checked result into out/sprites/goblin.png. The executable was /home/kolache/Downloads/marinara-agent-handoff/tools/aseprite/build/bin/aseprite.
- Check: 15 colours; off_palette=0; semi_alpha=0; lone=2.3%; on_bottom=True. Additional explicit inspection of every four-neighbour silhouette edge found **zero non-outline boundary pixels**, including the feet.
- Honest weakness: the large retained head makes the shorter figure more caricatured than the humans. The hunched stance compresses the chest and scarf, so its torso has fewer readable detail clusters. Some isolated pixels remain at staircase outline turns, within the requested limit.

## out/textures/floor_worn.png

- 128×128 opaque RGB, darker flag ramp. Retained the original running-bond slab arrangement, slab sizes, tone assignment, outer bevels, corner chips, and crack paths. Replaced interior wear and split-plane shading using a separate deterministic seed for every slab.
- Each of 48 slabs has an independently constructed connected wear mask with varied location, width, height, and stepped edge profile; no shared patch stamp. Verified 48 distinct cropped-mask hashes, recorded with the row spans in scratch/D/wear-records.json. Optional small cuts and flecks also vary. Placement wraps across the image edges, preserving the partial slabs at the boundary. Finished with wrap-aware despeckle.
- Check: 5 colours; off_palette=0; semi_alpha=0; lone=0.1%; seam=1.15. Reviewed both full 8× enlargement and 2×2 tiling; no exceptional boundary seam was visible.
- Honest weakness: the original cracks and regular 16-pixel courses remain recognisable. Every wear mask within the texture is different, but the complete 128×128 texture necessarily repeats when tiled. This pass preserves the existing broad planar treatment rather than adding a finer-grained stone texture.

## Final verification and preview locations

Ran `python3 tools/px.py check out/textures/wallcap.png out/textures/floor_worn.png out/sprites/goblin.png`; exact output is in scratch/D/check.txt. Additional assertions checked dimensions, opacity, allowed texture-specific ramps, goblin bounds, boundary outline colour, and lone-pixel ratios below 3%.

Used `tools/px.py tile4` and `tools/px.py zoom ... 8` on final-file copies, and opened every final preview with the image viewer:

- scratch/D/previews/textures/wallcap-2x2x4.png and wallcap-x8.png
- scratch/D/previews/textures/floor_worn-2x2x4.png and floor_worn-x8.png
- scratch/D/previews/sprites/goblin-2x2x4.png and goblin-x8.png (sprite repetition is a consistency preview, not a tiling requirement)
- scratch/D/previews/native.png — native-size final images
- scratch/D/previews/sprite-lineup.png — native and 4× final comparison with the five existing sprites

Source: scratch/D/revise.py. The script produces pre-Aseprite artwork in scratch/D/; the goblin requires the Aseprite command above before delivery. Original files are backed up in scratch/D/originals/.

## E — additional seamless wall textures

Three new opaque RGB PNG textures, each **64×64**, drawn procedurally at native resolution with Python/Pillow. Read `SPEC.md` and `tools/px.py` first; inspected `brick_a.png`, `ashlar.png`, and `floor_hall.png` for palette restraint, clustered wear, bevels, and scale. No antialiasing, blur, intermediate RGB shades, or image generation was used. All drawing colours come directly from `tools/ramps.json`; direct palette drawing made quantization unnecessary. Lighting is top-left wherever there is relief.

### `out/textures/plaster_wall.png`

- Warm lime plaster using cloth steps 2–4, with short cob step 3 and earth step 3 incisions in two thin, branching shrinkage cracks.
- A periodic, thresholded field makes sparse, coherent mottling; hand-placed short trowel strokes add directional surface character. All crack strokes wrap across boundaries. The first version had broad, camouflage-like patches; visual review prompted smaller, much sparser marks and softer cracks.
- Weaknesses: the fixed cloth ramp makes mottling visibly stepped rather than extremely subtle. The two cracks become recognizable when many tiles are repeated. Intentionally restrained relief may need scene lighting to convey the full plaster surface.

### `out/textures/wainscot.png`

- Dark oak using only wood steps 0–3. Two tall recessed panels have raised frames, top-left outer bevels, reverse bevels around the recesses, and continuous top/bottom rails that meet across vertical repeats.
- Hand-placed elongated grain lines bend around small knots; knot position and stile markings vary between the panels. Rail grain wraps horizontally.
- Weaknesses: the joinery is deliberately regular, with a 32-pixel panel rhythm. Grain is stylized and sparse, and the two knots repeat every tile. Vertically tiled rails produce stacked panel courses; for conventional room-height wainscoting, use the material on a single appropriate-height band.

### `out/textures/crypt_stone.png`

- Approximately 32×16 cut ashlar blocks in alternating running bond. Slate steps 0–4 and iron steps 2–3 give cool grey-blue faces, chipped highlights, and dark damp lower corners; leaf steps 0–2 supply small moss colonies in selected joints.
- Each block is drawn independently, then wrapped onto the canvas. Broad shaded facets and sparse horizontal flaking match the existing ashlar's cluster scale. A few short fractures interrupt the upper lips. A cyclic horizontal crop changes the tile origin without changing any adjacency.
- Weaknesses: dampness is conveyed through dark lower facets and moss rather than glossy reflections. Eight block faces and sparse moss clusters are recognizable over large expanses; this is still a small 64-pixel repeat. The iron face variant has a slight violet cast in the supplied palette.

### Validation and visual inspection

Ran `python3 tools/px.py check` on all three delivered files:

| File | Size | Colours | off_palette | semi_alpha | Lone pixels | Seam |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| plaster_wall.png | 64×64 | 5 | 0 | 0 | 0.2% | 1.00 |
| wainscot.png | 64×64 | 4 | 0 | 0 | 0.2% | 1.08 |
| crypt_stone.png | 64×64 | 10 | 0 | 0 | 0.0% | 1.00 |

Viewed each delivered tile at native 1×, each `px.py zoom ... 8` preview, and each `px.py tile4` 2×2 tiled preview at 4×. Re-inspected plaster and crypt after their revisions. No visible tile-boundary discontinuities, semitransparent pixels, smearing, or excessive isolated-pixel noise were observed. A seam score compares only the outer and central cross-sections, so it is supporting evidence rather than a substitute for tiled visual inspection. Plaster and crypt use cyclic crops with representative seam-check cross-sections; no edge pixels were patched to force matching borders.

Reproducible source: `scratch/E/draw_walls.py`.
Previews: `scratch/E/<name>-x8.png` and `scratch/E/<name>-2x2x4.png` for each of the three names. Native scratch copies match the final files. No files in `repo/` were read or changed.

## plaster_wall.png — plaster variety revision

- Output: `out/textures/plaster_wall.png`, 64×64, opaque RGB, seamless repeat in both axes.
- Made procedurally in Python/PIL at native resolution with hand-authored irregular polygons and single-pixel lines. Reproducible source: `scratch/F/revise_plaster.py`; original saved as `scratch/F/plaster_wall-before.png`. No resampling, anti-aliasing, blur, or dithering.
- Kept the warm off-white lime-plaster base and original hairline crack paths. Added uneven two-tone trowel patches using adjacent cloth-ramp cream and beige; the next darker cloth tone defines the cracks. Three differently shaped small losses expose the stone ramp, with recessed upper edges and restrained light stone facets. Broken beige grime gathers toward the bottom and wraps into the top; shapes are drawn periodically across both axes.
- Validation: `python3 tools/px.py check out/textures/plaster_wall.png`: 64×64, 6 colours, off_palette=0, semi_alpha=0, lone=0.1%, seam=0.94.
- Generated using `tools/px.py tile4` and `tools/px.py zoom … 8`, then visually inspected native size, 8× zoom and 2×2 tiling. Previews: `scratch/F/plaster_wall-x8.png` and `scratch/F/plaster_wall-2x2x4.png`. Revised identical initial chips into distinct shapes and opened up one overly solid trowel patch. No visible straight wrap seam or isolated noisy grain in the final previews.
- Honest limitations: the fixed palette gives the trowel marks more contrast than real limewash. The deliberately small exposed areas suggest stone without room for detailed masonry; the cracks and grime rhythm can still be recognized on a large repeated surface. Grime is restrained and broken, rather than a continuous dark stripe, to keep the wall usable as background and preserve vertical tiling.

## G — wall cap, stair tread, and compatible brick variants (2026-11-22)

All four files were drawn directly at native resolution with Python/PIL, using only exact ramp colours; no interpolation, antialiasing, image-generation pass, or quantisation was needed. Reproduction script: `scratch/G/draw_textures.py`. The user-requested 64×64 wallcap replaces the previous 32×32 asset; the former 16-texel seam restriction was not applied. Nothing in `repo/` was touched.

- **`out/textures/wallcap.png` — 64×64, RGB.** Periodic, irregular cap-stone courses with shared jogged mortar paths, large flat grey-brown faces, cob/stone ramp facets, sparse connected chips, and a lighter two-pixel worn upper lip following the stones' contours. Lighting favours the upper and left edges. A cyclic vertical placement brings the upper cap lips to the tile's top side without breaking periodic geometry. Weakness: four principal stone shapes give the repeat a recognisable rhythm over very large areas; this is restrained, stylised stone rather than the full richness of hand-painted environment art.
- **`out/textures/stair_tread.png` — 32×32, RGB.** Flag-ramp stone with darker, chipped outer wear zones, a smoother middle with short horizontal polish highlights, and a two-pixel light front nosing near the bottom plus a narrow rounded shoulder. The first bright central patch was reduced after visual inspection because it read as a stain. Weakness: the central wear silhouette repeats on each step, and the projecting nose is a colour cue that will benefit from the actual stair geometry and lighting in-engine.
- **`out/textures/brick_c.png` — 64×64, RGB.** Edited directly from `brick_a.png`: irregular soot patches with narrow descending cores, a secondary stain, and three brick-tone substitutions. Original stone palette, running-bond geometry, dark mortar, and chipped silhouettes retained. A three-pixel frame remains pixel-identical to the source. Weakness: the six-colour source ramp makes the deepest soot transitions visibly stepped; shading details are necessarily sparse on 16×8 bricks.
- **`out/textures/brick_d.png` — 64×64, RGB.** A separate tonal damp/soot arrangement concentrated on opposite areas, with a different set of three replaced bricks. Same source-derived geometry, exact palette, and immutable three-pixel perimeter as `brick_c`. Weakness: moisture is conveyed through darker stone tones only, so the material reads as dry staining rather than shiny wet stone; no additional wet-shine or moss colours were introduced.

### Validation and visual review

`python3 tools/px.py check` results:

| File | Size | Colours | off_palette | semi_alpha | Lone pixels | Seam |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| wallcap.png | 64×64 | 5 | 0 | 0 | 0.0% | 0.92 |
| stair_tread.png | 32×32 | 5 | 0 | 0 | 0.0% | 1.02 |
| brick_c.png | 64×64 | 6 | 0 | 0 | 0.1% | 1.11 |
| brick_d.png | 64×64 | 6 | 0 | 0 | 0.1% | 0.98 |

All output pixels are opaque. The script asserts that both variants use exactly the same set of six colours as `brick_a`, retain its exact darkest-mortar mask, and match every pixel in its three-pixel perimeter. This includes exact left/right/top/bottom edge matches, preserving all source cross-tile transitions when the variants alternate. SHA-256 verification confirms `brick_a.png` and `brick_b.png` are byte-for-byte unchanged; baseline hashes are in `scratch/G/original-bricks.sha256`.

Generated every 2×2 tiling and 8× nearest-neighbour zoom using `tools/px.py tile4` and `tools/px.py zoom`. Opened and visually inspected all of them, as well as the native-size contact sheet and a 3×3 mixed `brick_a`/`brick_c`/`brick_d` tiling. Previews remain in `scratch/G/` (`*-2x2x4.png`, `*-x8.png`, `native-review.png`, and `brick-mixed-3x3x4.png`); final texture directory contains only the requested game assets from this task. No visible discontinuity appeared at the tile boundaries in these previews. In-engine lighting and mapping have not been evaluated.
