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
