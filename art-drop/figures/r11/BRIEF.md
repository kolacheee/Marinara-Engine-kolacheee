# Round 11: chibi base body (owner 2026-11-26 12:40 Berlin: round 9 bodies rejected as base; go chibi like r8d row 2)

Text + number-drawn skeletons only. The owner's screenshot and all earlier outputs are NOT inputs (proportion target only, described in words below).
Target look: big head about 2.5-3 heads tall overall, short legs, small hands and feet, OT2-ish field sprite, ~56-60 px after the exact 8x shrink.

Skeletons (art-drop/figures/r11/poses/, from make_chibi_poses.py): chibi-sheet-side-walk-back-1792x640.png (side | walk 0 | 1 | 2 | 3 | back) and chibi-single-front-1024x640.png. Head takes the top ~37% of the 448 px figure box.

Prompt (both bodies), round 9b settings otherwise (LoRA 1.0, CFG 5, ControlNet union openpose 0.8 end 1.0, sampler as before):
- Positive: "score_9, score_8_up, score_7_up, plain flat grey background, chibi, big head, short body, short legs, small hands, full body, feet visible, adult {man|woman}, bald head, plain grey short-sleeved shirt, plain dark grey shorts, bare arms, simple brown shoes, no accessories, no hair, medium brown skin, flat colors, simple shading"
- Sheet adds "character sheet, same character, side view, walking, back view"; front adds "solo, front view, facing the viewer, face visible".
- Negative: round 9 negatives with "chibi" REMOVED, plus "different people, crowd, gradient background, tall, long legs, realistic proportions".
1. SHEET per seed (no IP-Adapter). 2. FRONT per seed with IP-Adapter setting C, reference = that seed's sheet from this run.
Seeds 11, 23, 37, 41, 53, 67, 79, 97. 2 bodies x 8 seeds x 2 = 32 images.

Output art-drop/figures/r11/run/: sprites/ 8x, per body a 4x sheet (one row per seed: front | side | back | walk 0-3), gif/, raw/ for the 3 best seeds, log.md with heights, head-to-height ratio, same-body check, feet line.

## Round 11b (after run 1: heads came out as huge bald balloons, child-like, ~40% of height and twice shoulder width; fronts worse)

- Skeleton: chibiB-sheet-side-walk-back-1792x640.png (head ~30% of height, narrower ear spread). Sheet only; NO front generation (I build the front from each seed's back view, as in r9).
- Positive: "score_9, score_8_up, score_7_up, plain flat grey background, chibi, 3 heads tall, young adult {man|woman}, slim, full body, feet visible, character sheet, same character, side view, walking, back view, short cropped dark hair, plain grey tunic shirt, plain grey trousers, simple brown shoes, no accessories, medium brown skin, flat colors, simple shading"
- Negative: round 11 negatives plus "baby, toddler, kid, oversized head, balloon head, bald, shorts, pink skin".
- Seeds 11, 23, 37, 41, 53, 67, 79, 97; 2 bodies -> 16 images, no IP-Adapter.
- Cut: keep the whole figure (merge the head and body blobs per cell, e.g. union of components inside each skeleton's column), not just the largest blob.
Output art-drop/figures/r11/run2/ in the same layout (front column empty), with head-height ratio and head-width / shoulder-width ratio per cell in log.md.

## Round 11c: fronts for the best 11b sets

Seeds man 23, 67, 41 and woman 67, 23, 53. Skeleton chibiB-single-front-1024x640.png. Same 11b prompt but replace the sheet tags with "solo, front view, facing the viewer, face visible, looking at viewer"; negative add "from behind, back view, multiple views".
Two variants per seed: (a) text + ControlNet only; (b) plus IP-Adapter setting C (0.40 style transfer) with reference = that seed's 11b sheet raw (this round family, fresh). 6 seeds x 2 = 12 images.
Output art-drop/figures/r11/run3/: sprites at 8x, and per seed a 4x row front(a) | front(b) | the 11b back cell, plus head-height ratio vs the 11b side view.
