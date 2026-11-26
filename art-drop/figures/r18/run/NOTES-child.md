# Child — round 18

Delivered fifteen original single-figure images in `big/`, fifteen transparent sprites in `sprites/`, `child-sheet.png`, and the side/front/back walking GIFs. Sheet order is standing front/side/back with an empty fourth cell, then walkside0–3, walkfront0–3, and walkback0–3.

## Method and checks

- Read CHARACTER.md, then BRIEF.md and R17-METHOD.md. Used only this character and references created in this run. No outside folders, repositories, earlier sprites or external reference images were opened or searched.
- The image tool drew every figure. Designed the right-facing side first; every other pose referenced that side. Rear walking redraws also referenced this run's standing back image to stabilize the hair pattern.
- Saved originals directly from returned image bytes. Python only performed magenta keying, cropping, BOX downscaling, palette snapping, outlines, sheet/GIF assembly and checks. No anatomy, clothing, faces or poses were drawn or hand-repaired in code.
- Range-keyed magenta before downscaling. Scaled the interior to 68 px and added the one-pixel surrounding outline, yielding exactly 70 px overall. Each transparent pixel touching the figure uses the mean of its occupied eight-neighbours × 0.32 + (8,4,10), rounded to bytes. The final shared palette snap also quantizes these computed outline colours.
- All fifteen sprites are 96×128 RGBA; occupied rows are 55–124 inclusive. Alpha is exclusively 0 or 255. There are 48 opaque RGB colours across the entire character, including outlines. Head-based horizontal placement avoids centring shifts caused by changing foot/arm silhouettes.
- Sheet is 1152×1536: four columns and four rows of 96×128 cells at 3× nearest-neighbour scale, on exact #4a4642.
- GIFs are 288×384, four distinct frames each, looping indefinitely at 160 ms per frame, on the same background. Decoded GIF frames were checked pixel-for-pixel against their source composites.
- Inspected every generated original, every finished sprite at native size, the complete sheet at full resolution and its full-resolution row crops, and every decoded GIF frame as a sequential strip. Playback was checked framewise; no in-engine movement test was performed.
- Intermediates, rejected candidates, processing script, pose prompt record and detailed checks are in `scratch/`.

## Redraws

The first side design was too tall and its skirt too long; it was redrawn before generating the remaining views. Front passing frame 1 initially resembled a contact pose with too much foot lift and was redrawn. All four rear walking poses were redrawn after sheet review because their hair parts and highlight patterns changed too much. The replacements keep the centre-parted rear hairstyle substantially steadier.

## Honest weaknesses

- The proportions remain closer to roughly 3 heads than a precise 2.8. The face also retains a stylized, fairly large-eyed appearance; it is not a realistic ten-year-old's anatomy.
- Freckles are obvious in the originals but faint at 70 px. Individual freckles and toes partly merge during BOX reduction. Auburn hair reads quite copper-orange in its highlights.
- Front-view facial expression, pigtail tips, skirt folds and patch shape vary slightly between frames. The rear redraws reduce hair flicker considerably, but the independent drawings are not perfectly identical above the moving limbs.
- The side contact poses have similar leg silhouettes; arm swing distinguishes the alternating steps more clearly than near/far leg shading. The first side passing foot still trails the support ankle slightly. These are usable short steps but not a fully polished anatomical walk cycle.
- Front/back movement is deliberately restrained. The four-frame, 640 ms loops can look somewhat stiff, with little body rise and fall. At fixed 70 px height, slight source proportion differences can create small hem/shoulder shifts.
- The ochre patch is broader from the rear than a strict side-seam projection would suggest. It remains on the same anatomical side, but its visibility is not perfectly consistent across directions.
- The original dark edging plus the requested added outline makes narrow legs, hands and hair edges comparatively heavy at native size. Final palette snapping slightly changes the exact calculated outline RGB values.
