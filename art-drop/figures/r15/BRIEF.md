# Round 15: full roster, draw big and show at half (owner 2026-11-26 14:57 Berlin)

In-scene check of round 14 (Wren drawn at ~92 px, shown at half size in the town) kept the face and costume readable; shrinking the same art to native density lost the face. So big-at-half is the size method. Round 14's weak spot: front and back views (stick legs drawn literally, masks/skulls, blown-up hats and props). This round fixes that with more seeds and tighter text.

Inputs: round 14 number-drawn skeletons only (art-drop/figures/r14/poses/big-*.png, 896x1152). No earlier round's output as input. No IP-Adapter, no OT2 images.
Recipe = round 14 (Pony + sakuemonq 1.0, CN openpose 0.8 end 1.0, CFG 5, 24 steps euler_a, clip skip 2), one view per image, same r13 prompt additions.
Changes:
- Front and back views only: CN openpose 0.65, end 0.8.
- Negative add for every image: "mask, skull, helmet covering face, stick legs, thin legs, wireframe, skeleton, oversized hat, oversized weapon".
- Character text tweaks: guard "steel cap" -> "small round steel cap", spear -> "short spear held upright"; priest staff -> "short walking staff"; farmhand "straw hat" -> "small straw hat"; innkeeper mug -> "small mug". Others as round 13.
- Seeds 41, 7, 23, 88 for every character; the same seed across all 7 views of one set (front, side, back, walk 0-3). 8 characters x 4 seeds x 7 views = 224 images.

Output art-drop/figures/r15/run/: sprites/ at exact 8x shrink like r14 (no post-process), one sheet per character with one row per seed, log.md with a one-line note per set (same person across views? front/back usable?).
