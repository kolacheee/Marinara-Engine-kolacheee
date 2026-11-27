# Halet Sar — Round 23 delivery

All 15 requested views are present in `big/` and `sprites/`, with the sheet, three walking GIFs, front face crop and front-versus-style comparison. This is a completed export set, but it is **not a perfect compliance pass** on every drawing rule.

## Method and checks

- Every figure and redraw was drawn with the built-in image tool, one figure per request. The right-facing side was drawn first and was attached to every subsequent view request. STYLE-SHEET.png was attached to every request with the exact Round 23 style-only instruction. No reference character was used as Halet's design.
- Python performed magenta keying, premultiplied BOX reduction, palette snapping with skin eligibility masks, local-colour outer-contour repair, compositing, enlargement, GIF encoding and checks. It did not draw figures or paint in eyes or facial features.
- All 15 final sprites are 96 × 128 RGBA with binary alpha. Every occupied bounding box starts at row 33 and ends at row 124 inclusive. The complete equipped silhouettes are horizontally centred.
- The union across the sprites is exactly 24 colours, all from charcoal, leather, moss, linen, steel and tan. No extra ramp was added. The image-tool originals retain their original colours and magenta backgrounds; palette limits apply to the reduced sprites.
- The sheet uses 3× nearest-neighbour enlargement on #4a4642, in the requested row order. Each GIF contains four frames at 160 ms, at 3× scale, on that same background. GIF frames were decoded and inspected as strips; smooth real-time playback was not independently observed.
- The front face crop uses rows 33–60 inclusive at 6×. The comparison shows Halet beside the three supplied fronts at 3×. The final sheet, comparison, face crop, all reduced views, source drawings and face-review montage were visually inspected. Skin-mask intermediates were inspected together in a montage.
- Processing scripts, checks, final prompt set, review montages and rejected source versions are in `../scratch/`. The final prompts are in `../scratch/prompts.json`.

## Redraws

1. Rejected the first side: body too elongated, beard too weak, pack too low. Redrew before making the other views.
2. Redrew the standing front after reduction weakened the eyes and the comparison exposed soft contours. Requested square dark eyes, stronger material edges and clearer hair groups.
3. Redrew walkside1 to replace an extended forward leg with a closer passing pose.
4. Replaced the first walkback3 because the tool returned a side view instead of a rear view.
5. Performed additional face-pass redraws on walkside1 and walkside3 because their reduced profile eyes were too faint. One walkside3 face redraw changed the leg pose; it was redrawn again to restore a closer passing foot.

## Honest weaknesses and unmet details

- The style match is approximate. Halet is distinctly narrower than the supplied figures, as his design requires, but his internal contours and face planes remain softer and less decisively clustered than the best reference sprites. The collar, cuffs, lapels and narrow trims supply richness; they can also become busy after reduction.
- The prescribed **exactly four close curls** is not consistently met. The front reads as four principal top curls, while side and rear sources contain extra lower curl lobes. The rear standing hair is fuller and more segmented than intended.
- Eyes survived as dark marks, with two in the fronts and one visible eye in profiles. They are not uniformly exact isolated 1×1 marks: some include adjacent shaded pixels, and their contrast varies. Brow/eye separation and the broad flat nose are less clear in some reduced frames. The front nose is somewhat long, and the beard varies slightly in thickness. No code-painted face corrections were used.
- The skin masks combine spatial eligibility and colour classification, not perfect hand-labelled material segmentation. Mixed boundary pixels around hair, ears, cuffs and hands may be assigned to the wrong material ramp. Thus the absolute skin/non-skin separation rule is not fully certified.
- The pack sits above the belt in the rear views, but its lower edge reaches belt level in several profiles. The strict above-belt clearance is not consistently met. Its profile is somewhat oval rather than a perfect circular projection.
- The coat remains ankle-length and divided, but contact frames sweep the rear panel outward more than the strict vertical-blade design requests. Small chest straps also read thicker than the requested thin flat straps.
- The side walk is the weakest cycle. Frame 1 is almost a standing pose after its face redraw. Frame 3 has a higher passing foot than the two-pixel target. The two contact frames have ambiguous opposite-leg ownership behind the coat and similar foot silhouettes. Small head, shoulder, pack and hem changes between separately drawn frames can produce shimmer; this is not a production-polished walk loop.
- The long coat hides much of the front/back leg motion. Front and back steps alternate, but the passing/contact distinctions remain restrained and somewhat stiff. Some source hands show more finger divisions than requested, though reduction mostly merges them.
- The supplied style sheet was used only for rendering, and all other artwork references were this run's Halet images. No other sprites or repositories were accessed. A mandatory image-tool instruction file outside this folder was read to satisfy the tool workflow; this is an exception to the requested no-outside-reading rule. The image tool also automatically saved default copies in its own runtime directory. Those outside image files were not opened or copied from disk: returned image data was written directly into this folder.

The files are suitable for evaluating this character direction and the remaining work, rather than claiming every Round 23 rule has been met exactly.
