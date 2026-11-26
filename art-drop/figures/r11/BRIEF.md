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
