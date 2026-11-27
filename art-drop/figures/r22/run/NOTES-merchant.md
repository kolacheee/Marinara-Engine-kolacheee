# Halet Sar — merchant production notes

## Delivered and checked

- 15 image-tool originals in `big/`, each containing one full-body figure on magenta, and 15 corresponding transparent sprites in `sprites/`.
- Every sprite is 96 × 128 RGBA. Occupied vertical extent is exactly rows 33–124 inclusive; alpha is exclusively 0 or 255. The equipped silhouette is horizontally centered to integer-pixel precision.
- The final set uses 24 colours total, all from charcoal, leather, moss, linen, steel and tan. No additional ramp, pure black, pure white or opaque magenta is used in the sprites. The large originals retain their source colours and are not palette-limited.
- `merchant-sheet.png` is 1152 × 1536, a nearest-neighbour 3× sheet on #4A4642. Rows are standing front/side/back, walk-side 0–3, walk-front 0–3, and walk-back 0–3. The unused fourth standing cell is blank.
- Each GIF is 288 × 384, loops four frames at 160 ms per frame, and uses the same neutral background. Decoded GIF frames were inspected in strips as well as through the GIF previews.
- `merchant-face.png` is the front crop from logical x=30–65 and y=33–60, enlarged 6× to 216 × 168. It and the full sheet were opened at their full stored dimensions.
- All five frontal sprites have exactly one charcoal pixel per eye with tan pixels immediately to both sides. Profiles retain the visible near eye; the first side contact uses a two-pixel profile mark. Mouth/beard silhouettes remain visible. Rear views have no face.
- Every source drawing was visually reviewed, including discarded attempts. All reduced figures were inspected on the sheet, and all visible faces were inspected together at 6×. Skin masks were reviewed in a separate audit sheet.

## Drawing and reduction

The side was drawn first from the written design. Every subsequent view referenced that same character's side drawing from this run. Face redraws additionally referenced the relevant front frame from this run. No outside artwork or character reference was used.

The built-in image tool drew every figure. Python performed magenta range keying, source-anatomy skin masking, BOX area reduction, material-aware palette snapping, binary alpha conversion, local-colour outer contour cleanup, sheets, crops, GIF assembly and checks. It did not draw or paste facial features, hands, clothing or poses.

Skin masks separate the face, ears, neck and hands from eyes, brows, beard and clothing. Masked skin can select only tan colours; non-skin can select only the five other ramps. Hair and facial marks snap to charcoal; coat colours are classified as moss so the source's yellow-olive shadows do not become leather.

After the smaller-eye redraws, ordinary area sampling split several eyes over adjoining pixels. A whole-figure sampling-phase adjustment of at most six source pixels per axis was used before BOX reduction. This preserves the drawn marks through area averaging without inserting eye pixels. Final crown and support-sole rows were checked again. Sampling offsets and bounds are recorded in `../scratch/checks.json`.

The prompt set and templates are in `../scratch/prompts.json`; the reduction script is `../scratch/process.py`; final checks are in `../scratch/final-validation.json`. Intermediates and superseded drawings are in `../scratch/`.

## Redraw history

1. The first standing side was too tall in head units, had excessive hair masses and an unwanted steel waist buckle. It was redrawn with a larger head and steel confined to the pack.
2. The second side had an overly tall eye rectangle. A further image-tool redraw made the profile eye square and simplified the hair. This third side became the canonical reference.
3. The initial standing front and all four front walk frames had eye marks too large for the one-pixel rule. Each received a full image-tool face-pass redraw with smaller charcoal squares. Their previous versions are preserved in scratch.
4. Palette classification was revised after inspection because the first reduction assigned some hair and olive coat shadows to leather. The final output corrects those material families.

## Honest weaknesses and incomplete style matches

- The four curls remain puffier than the requested close, low dome, especially in front and back. Some rear hair extends lower around the ears than ideal. Four large masses read clearly, but the exact low-dome silhouette is not fully met.
- The four-head construction is achieved approximately, but the face still reads younger and softer than an unmistakably 34-year-old man. Brows are often nearer straight blocks than strong arches. Nose width, jaw shape and beard size drift between front frames despite the shared reference and redraws.
- The final standing-front eyes are dark charcoal shadow pixels. Some walk-front eyes use the lighter charcoal body tone after averaging, so eye contrast is less uniform than ideal. The broad frontal nose becomes a fairly large warm plane; the quiet mouth sometimes merges with the chin shading.
- The pack straps are heavier than the requested thin straps. The pack's seam/strap decoration varies between standing back and walking back. The pack remains high and above the lower coat division; its buckle remains the only steel feature.
- The two coat blades are readable and moss dominates, but some walk panels angle outward more than an entirely straight, weighted hang. The source drawings introduce slight changes in coat width, hair contour, pack position and shading across frames.
- The long coat obscures leg ownership. Side contact silhouettes are similar, and the difference between the two passing poses is subtle. The four-frame walks are usable restrained pose sequences, but they have residual frame-to-frame wobble and limited heel-to-toe articulation. They are not perfectly registered hand-drawn animation cycles.
- Some mitten hands occupy roughly 5–6 pixels rather than consistently staying within 3–5. The roll reads as a small rolled bundle; individual linen swatches are not distinguishable at this scale. Anatomical left-hand ownership is preserved.
- Source lighting broadly favours screen upper left, but highlights on the four curls and isolated garment folds are not perfectly consistent across all views. Reduction leaves occasional single-pixel material transitions beyond the ideal cluster rule. Local outlines are repaired on the external contour, but internal overlap widths are not uniformly one pixel.
- The face instruction saying “both eyes” on every face-visible view was interpreted as two eyes for a front view and one visible eye for a true side profile; drawing the hidden eye would contradict the required profile.

## Workspace limitation

All project artwork, processing and deliverable writes were performed inside this folder, with intermediates in scratch. One mandatory image-generation skill instruction file was read outside the folder; no outside project directory, repository, sprite or reference artwork was inspected. The image service also automatically saved its own originals in its service-managed location outside this folder. Their returned image bytes were saved here without opening or listing that external location. Thus the literal “no outside reads” and service-side storage restrictions were not fully met.
