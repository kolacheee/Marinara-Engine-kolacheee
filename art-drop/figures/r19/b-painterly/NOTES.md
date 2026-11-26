# Final review — Moss & Ember

Delivered the 1920 × 2530 reference sheet, written rules with verbatim prompt templates and correction prompts, named palette ramps, twelve transparent sprites, and twelve selected large source originals. Intermediates, rejected drawings, review enlargements, build script and check reports are in `../scratch/`.

## What was checked

I inspected the finished STYLE-SHEET.png at its full 1920 × 2530 resolution and inspected all twelve sprites separately at an exact 4× enlargement. The sheet itself displays every sprite at exactly 3×. I also inspected the source drawings and smaller four-view comparisons during development.

All twelve sprites are 96 × 128 RGBA, with 92-pixel visible height, top row 33, lowest planted sole on row 124, and alpha exclusively 0 or 255. Transparent pixels contain zero RGB. The visible colour unions across each character's four views are **Wren 23**, **Hadrik 19**, **Noble 20**. These are below the 32-colour limit. The larger subset counts printed on the sheet are the available palette budgets, not actual usage. No bright magenta pixels remain. Results are recorded in `../scratch/final-checks.json`.

## Weak parts that were redone

- The first side drawings were much too tall and slender. All three were redrawn with compact proportions before generating their other views.
- Hadrik initially had overly warm skin and brownish hair. His side reference was corrected before the other views were made.
- Hadrik's first back drawing duplicated the apron front. It was replaced with a cream shirt back, crossed straps and a waist tie.
- His first walk pose looked like a forward march. It was replaced with a bent passing leg and raised foot.
- Wren's yellow-olive source cloak initially snapped to the leather browns. Palette classification was refined to retain moss greens, with a head-exclusion guard to avoid green facial highlights. This is documented exactly in STYLE.md.
- Unsupported sheet font symbols and a proportion label touching a rule were corrected.

## Honest remaining weaknesses

1. **The 3.5-head proportion is a construction target, not a precisely measured anatomical result in every view.** Including all hair volume makes the women read closer to roughly 3.1–3.4 heads. Hadrik's beard makes his head mass look larger. The compact heads also push the women toward a youthful stylization despite adult clothing and expressions.
2. **Hadrik's face is low-contrast at native size.** His very dark complexion is preserved, but eyebrow, eye and beard separation are subtle. The curl silhouette also looks fuller than a very close-cropped haircut.
3. **Wren's bowstring is fragile.** It survives as a very fine, occasionally interrupted line after reduction. Her ponytail reads as a compact tied cluster rather than a clearly hanging long tail. Cloak, quiver and bow create a wider silhouette than the other characters.
4. **Walk poses are reference samples, not animation-ready cycles.** The raised-foot clearance is smaller than the five-pixel prompt target in Wren and Noble. There is modest torso, hand and cloth drift between standing and passing. Hadrik's hammer overlaps the bent-leg area, reducing leg clarity. Further frames and pivot registration would be needed for smooth playback.
5. **Some source texture collapses during reduction.** The final painterly quality comes mainly from hue shifts and clustered planes; the gentle checker dithering is much less explicit at 92 px. Some interior creases remain darker than the ideal colour-only interior rule, especially around straps and apron folds.
6. **Small facial marks are not uniformly one pixel.** Several eyes and brows form connected two- or three-pixel shapes. Gold trim occasionally thickens at corners. The rules describe the desired discipline more tightly than every source detail achieves.
7. **The palette classifier is specific to these source colours.** Wren's olive gate includes a fixed exclusion for the top 30 rows of the reduced figure. New sources with different lighting or head placement may require a new palette-mapping review. The script should not be treated as a universal automatic cleanup tool.

## Scope and provenance

Every figure and every anatomical correction was drawn by the image tool from text and the newly generated side references. Python did keying, downscaling, palette snapping, sheet/diagram assembly and checks; it did not draw replacement figures or body parts. No game screenshots, existing sprites, neighbouring Downloads folders or git repositories were consulted.

One boundary exception should be explicit: the required imagegen workflow instruction file was read from outside this folder. No outside artwork was read. The image service also automatically stored its own copies at its default location; the returned image bytes were saved directly into this folder without opening or listing those outside locations. All task-authored files and intermediates are inside this folder.
