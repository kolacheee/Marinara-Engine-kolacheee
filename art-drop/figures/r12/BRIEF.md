# Round 12: base bodies with the exact round-8d front method (owner 2026-11-26 13:30 Berlin)

She rejected the 11b chibi bodies and picked the look of the 8d Wren seed-41 FRONT. Use that pipeline exactly; only the character text changes. Her screenshot and all earlier outputs are NOT inputs.

8d front pipeline (copy from the 8d workflow you ran, change nothing else): Pony V6 XL + sakuemonq LoRA 1.0, 1024x640, skeleton art-drop/figures/r8/poses/single-front-1024x640.png, xinsir union promax openpose 0.8, start 0, end 1.0, euler_ancestral 24 steps, CFG 5, clip skip 2, no IP-Adapter for the front. Positive = the 8d lane-S front prompt (common positive with the turnaround tags swapped for "solo, front view, facing the viewer, face visible, looking at viewer", plus "plain flat grey background, no gradient"), Negative = the 8d front negative.
Character text replaces the Wren/Hadrik description:
- woman: "young woman, short neat dark brown hair, plain grey tunic, plain brown trousers, simple brown boots, medium brown skin, empty hands"
- man: "young man, short neat black hair, plain grey tunic, plain brown trousers, simple brown boots, medium brown skin, empty hands"
(Also keep one control image: the exact 8d Wren text at seed 41, to confirm the pipeline reproduces the look she picked.)

Step 1, fronts: seeds 11, 23, 37, 41, 53, 67, 79, 97 per body = 16 + 1 control.
Step 2, for the 3 best fronts per body: side and back (single-side/back-1024x640.png) and walk 0-3 (walk-side-0..3-1024x640.png), each with IP-Adapter setting C (0.40 style transfer, end 1.0) referencing that front (same run), same seed and text with the 8d side/back view tags (walk: "side view, profile, facing right, walking"). 6 x 6 = 36.
Output art-drop/figures/r12/run/: sprites 8x, per body a 4x sheet (one row per seed: front | side | back | walk 0-3; step-1-only seeds show just the front), walk GIFs, log.md with heights, head-to-height ratio, and same-body check. Flood-fill cut (tol 10) so gradients don't count as figure.

## Round 12b: keep the 12 look, get one body across views

12 result: fronts have the picked look, but IP-Adapter side/back/walk drift (pink skin, mottled clothes, hair colour changes). 9b showed one SHEET keeps one body. Combine:
- SHEET: art-drop/figures/r8/poses/sheet-side-walk-back-1792x640.png (adult skeleton, side | walk 0-3 | back), exact 12 recipe otherwise (LoRA 1.0, CN 0.8 end 1.0, CFG 5, 24 steps euler_a, clip skip 2, no IP-Adapter), 12 base-body text, view tags "character sheet, same character, side view, walking, back view", negative = 12 negative minus "multiple views, character sheet" plus "different people, crowd".
- Seeds 11, 23, 37, 41, 53, 67, 79, 97, both bodies = 16 sheets. Also 2 control sheets with the 8d Wren text (seeds 41 and 11) to see whether the sheet keeps her chunky look.
- FRONT for each sheet: the 12 front recipe exactly (no IP-Adapter), same seed and text.
Output art-drop/figures/r12/run2/ same layout as r11/run2 plus the front column; log.md: does each sheet look like the 12 fronts (chunky, short legs, big hair/head) or slimmer like 9b? same body across sheet cells? Flood-fill cut tol 10, and also clear enclosed background holes (pixels within 10 of the border median).
