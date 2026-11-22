
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
