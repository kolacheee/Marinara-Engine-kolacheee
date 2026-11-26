# Final review — Ember & Ink

The deliverable is complete: one 2040×2600 reference sheet; twelve 96×128 transparent sprites; a 24-colour named palette; five accepted large image-tool originals; and written construction, material, motion and processing rules with the exact prompts. Intermediates, rejected drawings, processing scripts and review images are in `../scratch/`.

## What was revised

The initial side models were too tall and slender. Three image-tool proportion revisions brought them into the compact, approximately three-head direction before the other views were drawn. Those accepted side drawings were the references for the front, back and passing frames.

The first palette reduction made pale skin too yellow by mapping it to gold. I replaced the final ember-ramp slot, `#D59561`, with `#E2AC83` and reprocessed every sprite. I also corrected overlapping type in the sheet's head-unit guide and enlarged the palette hex labels.

## Honest remaining weaknesses

- **Proportions are approximate, not mechanically identical.** Wren's side head reads larger than her front head. Hadrik's beard obscures the chin landmark, and the Noble's updo enlarges the head silhouette. The three-head diagram is a construction target; these are not twelve perfectly registered model turnarounds.
- **The treatment is deliberately illustrative.** Large heads, dark block eyes and heavy boots give it a storybook character. It is less naturalistic and less sombre than a restrained HD-2D cast, even though the clothing, palette and expressions remain grounded. That tradeoff is intrinsic to this panel direction.
- **Rim-light strength varies.** The Noble's skirt and Hadrik's hair/boots carry the clearest cool rim. Wren's cape and the front-facing figures have weaker, more interrupted rim accents. The rule is more consistent than the exact amount of reflected light in every drawing.
- **Some tiny reduction fragments remain.** Hair highlights, rolled sleeves, buckles and leather folds retain a few one-pixel colour changes. They are not intentional dithering, but they are less economical than a completely hand-tuned cluster design. The broad skirt and back-cloak planes are cleaner than the small accessories.
- **Hadrik's face has limited contrast at 1×.** His very dark skin is preserved, but the eyes and beard merge more than the pale-skinned faces. The beard and hammer make him recognisable. His hair also reads as a generous swept crop rather than a very close haircut.
- **The passing poses are emphatic.** Wren's lifted leg and the Noble's raised hem suggest a brisk or marching step. They establish the requested passing action, but relaxed walking would need a lower lift and a full timing pass. These single frames do not establish a seamless animation loop.
- **Small costume details drift.** Buckle widths, apron folds, the apparent size of the hammer head and the shape of the Noble's updo coils are not perfectly conserved between views. Major equipment, colours and silhouettes remain consistent.
- **The bowstring is fragile at native size.** It survives the reduction, but its thin pale pixels are less conspicuous on a light background. No background-specific outline was added.

## Checks actually completed

I inspected the finished full sheet, six native-resolution sheet detail crops, all twelve sprites in enlarged character rows, and all twelve together at their native size. No game images, existing sprites, other repositories or outside asset folders were opened.

Automated checks passed for all twelve sprites: 96×128 dimensions; 92-pixel occupied height; crown row 33; lowest opaque row 124; alpha values only 0 and 255; opaque colours drawn exclusively from the master palette. Each sprite uses 19–23 opaque colours; the combined set uses exactly 24. Every opaque sprite pixel was checked against its exact 3×3 block in the final sheet. The retained originals are unmodified image-tool outputs; no figure was drawn or repainted in Python.

The numerical checks establish file compliance. They do not erase the visual limitations listed above.
