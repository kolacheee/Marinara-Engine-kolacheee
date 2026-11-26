# Round 13: OT2-like field sprites, whole characters (owner 2026-11-26 14:52 Berlin: "do whatever you need to make our sprites look like Octopath's", not necessarily Wren)

Gap found in-scene (town screenshot): our 12-recipe sprites are ~1.6x too big next to the party sprites, flat, no dark outline. OT2 field sprites: small (~44-48 px), dark coloured outline, high-contrast 3-4 tone shading, muted earthy palette, rich costume detail, big expressive hair.
No OT2 image is an input; style in words only. Inputs: number-drawn skeletons only.

Skeletons: art-drop/figures/r13/poses/small-*.png (figure 368 px -> ~46 px at 8x).
Recipe = round 12 (Pony + sakuemonq 1.0, CN openpose 0.8 end 1.0, CFG 5, 24 steps euler_a, clip skip 2, no IP-Adapter).
- EVERY view is its own 1024x640 image (8b showed same seed + same text + one view per image keeps the person; no sheets, no IP-Adapter):
  front small-single-front, side small-single-side, back small-single-back, walk small-walk-side-0..3, with the 8b lane-S view tags (walk: "side view, profile, facing right, walking").
Add to every positive: "detailed jrpg field sprite, dark outline, high contrast shading, muted earthy colors, intricate costume details". Negative add: "neon, oversaturated, flat colors, lineless".

Characters (text replaces the body description; seed 41 for all, plus seed 23 for wren and hadrik):
1. wren: the 8d Wren text
2. hadrik: "man, very dark skin, short black hair, full black beard, brown leather apron over cream shirt with rolled sleeves, dark brown trousers, heavy boots, holding a blacksmith's hammer"
3. merchant: "middle-aged woman, olive skin, dark hair under a patterned headscarf, mustard dress with a brown apron, satchel"
4. priest: "old man, pale skin, white beard, bald, long grey robe with a blue stole, wooden staff"
5. guard: "man, tan skin, short brown hair, chain mail under a red tabard, steel cap, spear"
6. farmhand: "young man, freckles, messy blond hair, straw hat, loose linen shirt, rolled brown trousers, sandals"
7. noble: "young woman, fair skin, golden hair in an updo, long deep blue gown with gold trim, short cape"
8. innkeeper: "stout man, ruddy skin, bald with a thick brown moustache, green waistcoat over white shirt, apron, carrying a mug"
(8 + 2) sets x 7 views = 70 images.

Output art-drop/figures/r13/run/: sprites 8x (no post-process; I add outline/contrast in the cloud), one row per character+seed in a 4x sheet (front | side | back | walk 0-3), raw/ none needed beyond the 8 best, log.md with heights and same-person check (front vs sheet).
