# Round 9: neutral base body (front, side, back, 4-frame side walk)

Method change (owner card 2026-11-25): one clean base body first, then hair/outfit layers painted onto it, colours by palette swap. This round makes ONLY the base body. Fresh art only: no earlier round's output as any input. Skeletons in art-drop/figures/r8/poses/ (drawn from numbers): single-front/side/back-1024x640.png and walk-side-0..3-1024x640.png.

Bodies: "man" and "woman", adults, plain neutral build (not muscular, not chibi).
Positive (both): "score_9, score_8_up, score_7_up, plain flat grey background, solo, full body, feet visible, standing, adult {man|woman}, average build, bald head, plain grey long-sleeved undershirt, plain grey leggings, simple grey shoes, no accessories, no hair, medium brown skin, neutral expression" + view tags as lane S (front: facing the viewer; side: side view, profile, facing right; back: from behind). Walk frames: "side view, profile, facing right, walking".
Negative: lane S negatives + "gradient background, vignette, scenery, hair, hat, hood, cloak, weapon, armor, jewelry, nude, nipples, muscular, chibi, child, multiple people".

Per body, seeds 11/23/37/41:
1. Front: text + front skeleton, ControlNet 0.8 end 1.0, CFG 5, no IP-Adapter.
2. Side, back, walk 0-3: same seed, same text, own skeleton, plus IP-Adapter setting C from 8d (0.40, style transfer, start 0.0, end 1.0), reference = THIS run's fresh front at that seed.
2 bodies x 4 seeds x 7 images = 56.

Output art-drop/figures/r9/run/: sprites/ (8x), per body a 4x sheet with one row per seed (front | side | back | walk 0 | 1 | 2 | 3), raw/ for the best 2 seeds per body, an animated GIF per seed of the 4 walk frames at 4x (150 ms per frame), and log.md: heights, flat background yes/no, facing check, same-body check across the 7 images (head shape, skin tone, clothes colour, proportions), and whether feet stay on one ground line across walk frames.
