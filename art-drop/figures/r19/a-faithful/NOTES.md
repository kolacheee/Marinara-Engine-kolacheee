# Ember & Earth — review notes

## What was delivered and checked

The 2000 × 2320 STYLE-SHEET.png contains the labelled master ramps, a 3.3-head guide using an actual sprite, outline swatches, an upper-left four-tone cylinder, a do/don't strip, and all twelve sprites at exact 3× nearest-neighbour enlargement. STYLE.md contains the material rules, hexadecimal palette, source map, reduction recipe, exact prompt template and actual correction prompts. Eight untouched image-tool originals are retained in big/; some contain rejected figures, identified in STYLE.md.

All twelve sprite PNGs were checked for 96 × 128 dimensions, 92 occupied rows, soles on row 124 (zero-based), clear side margins, alpha restricted to 0/255, zeroed transparent RGB, membership in the assigned palette, and no residual magenta. Across all four views, Wren uses 25 opaque colours, Hadrik 20 and Noble 22. The limit is satisfied per character, not merely per frame. The shared master library has 40 colours.

I inspected the finished sheet in full and as four full-resolution sections, every sprite in character review strips at 3×, and all twelve together at native size. Machine results are in ../scratch/checks.json and ../scratch/final-checks.json. These checks verify file properties, not artistic perfection.

## Redraws and corrections completed

- The first side masters were too tall relative to their heads. A second image-tool pass shortened the bodies before the turnarounds were drawn.
- Hadrik's initial skin was too light. The character turnaround corrected it toward deep umber, and the final palette keeps it dark against the cream shirt.
- Hadrik's and Noble's first walking poses were forward steps. They were redrawn as passing poses. One further Noble redraw restored the long gown after a correction exposed too much boot and shortened the skirt.
- Wren's source olive initially snapped into brown leather. A documented colour-family restriction now sends those olive pixels to the moss ramp, preserving her green cloak without painting new garment pixels.
- Hadrik's rear hammer was hidden. A final image-tool redraw makes the head visible beside his right thigh.

## Honest remaining weaknesses

1. **The proportions remain an interpretation, not a rigid model sheet.** The 28 px / 3.3-head guide is a construction target. Hadrik's beard makes his visible head mass look larger and his body stockier than the women. Head widths, shoulder widths and hair silhouettes drift slightly between independently drawn views. The result is somewhat rounder and more doll-like than the most restrained adult HD-2D field art.

2. **Eyes and faces are not perfectly standardized.** Some dark eye/brow clusters occupy more than the intended single eye pixel. Wren and Noble retain a little of the source's large-eye expression. Hadrik's very dark face and beard merge at native size, especially around the mouth; that contrast would need another review in a dark game environment.

3. **The grid is real, but the clusters are not exhaustively hand-cleaned.** All exported pixels have hard alpha and a fixed palette. However, area reduction of large generated pixel shapes sometimes makes 2 px contours, small intermediate-colour chips and uneven diagonal steps. The silhouettes hold up at 1×, but the art is not as mechanically regular as a sprite built one final-resolution pixel at a time. No character pixels were redrawn by Python to hide this.

4. **The walk poses are references, not tested animation.** Wren and Hadrik clearly lift a passing foot; Noble's passing action is intentionally subtle beneath her long gown and can read close to idle. There is no complete cycle to assess timing, foot slide or bounce. Whole-figure bounding-box centering does not guarantee a fixed body pivot. Head, torso and accessory registration would need review when adding the other frames.

5. **Costume details vary slightly with view.** Noble's gold ornament and hair bands are not a mechanically exact rotation. Wren's folds and quiver spacing also shift. Hadrik's corrected rear hammer hangs lower and shows a narrower end than in the side pose. These are usable design cues, but they should not be copied as exact 3D construction measurements.

6. **The accent hierarchy is imperfect.** Wren's auburn hair competes a little with the green cloak. Noble's gold hair is a second strong value focus beside the blue gown. The palette is muted overall, but the one-accent rule is a hierarchy rather than absolute colour isolation.

7. **Lighting is broadly consistent, not physically exact.** The upper-left rule reads clearly on the cloth and cream sleeves, but some hair highlights inherited from the originals spread across the crown. The sheet's cylinder is a simplified four-plane teaching diagram, not a promise that every sprite material follows that geometry exactly.

## Scope and provenance

Every character figure and corrective redraw came from the image tool using text and this project's newly generated side references. No game images, existing sprite libraries, external folders or repository contents were inspected. Python handled keying/cropping, reduction, fixed-palette snapping, sheet assembly and checks; sheet annotations and the cylinder are geometric teaching graphics.

All authored deliverables and intermediates are inside this folder. The image service also reported its automatic cache outside the folder; that cache was not read, listed or opened. The originals in out/big were saved directly from the image data returned by the tool.

This is a completed style-selection reference set. It still needs animation registration and a scene-background readability pass before serving as a final production sprite library.
