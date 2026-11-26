# Round 18: full roster with Codex, drawn big and shown at half (owner 2026-11-26 21:34 Berlin: "switch to Codex for sure")

Method = round 17 exactly (art-drop/figures/r17/BRIEF.md): Codex image tool draws every figure (no Python-drawn figures), text only, magenta background, side view designed first and then used as the reference for every other view of the SAME character inside this run, shrink to 92 px tall in a 96x128 frame (feet on row 124), <=48 colours, alpha on/off, 1 px outline (mean neighbour colour x0.32 + (8,4,10)).
Approved inputs: round 17's own originals in art-drop/figures/r17/run/big/ for wren, innkeeper and guard (owner approved them); nothing else from art-drop/, no game images.

Views per character (15): front, side (facing right), back; walk-side 0-3 (contact, passing, contact other leg, passing); walk-front 0-3; walk-back 0-3. Left-facing = mirror of side in the engine, don't draw it.

Fixes from round 17:
- Walk: natural relaxed town walk, feet stay low, knees bend only slightly, short heel-to-toe stride, arms swing a little opposite the legs. No marching, no high knee lift. Passing frames: the lifted foot is only a few pixels off the ground.
- Proportions: everyone about 3 to 3.5 heads tall, adult (not chibi, not doll-like); eyes small-to-medium.
- Keep costume detail in large readable shapes; chain mail as simple shaded rows, never a checker texture; no fine details that change between frames. Frames of one character must match each other except where the pose moves.
- Background exactly #FF00FF if the tool allows; otherwise range key as before.

Characters (15)
Townsfolk (r13/BRIEF.md texts):
1. wren: redo ONLY walk-side, walk-front, walk-back from the r17 side original (keep r17 front/side/back).
2. innkeeper: same as wren (redo walks only).
3. guard: full redo of all 15 with the r17 side original as reference, but stockier (about 3.3 heads), chain mail as shaded rows.
4. hadrik  5. merchant (mustard yellow dress)  6. priest  7. farmhand (small straw hat)  8. noble
Party (new text):
9. knight: young man, light brown skin, short dark hair, steel breastplate over a blue gambeson, brown leather boots, longsword at the hip, small round shield on the back
10. mage: woman, pale skin, long silver hair in a braid, deep purple robe with brass clasps, satchel of scrolls, short wooden wand
11. rogue: young woman, tan skin, short black hair, charcoal hooded leather jerkin, red scarf, dark trousers, twin daggers at the belt
12. cleric: man, warm brown skin, shaved head, short beard, white and gold tabard over grey robes, holy symbol on a chain, mace at the hip
13. elder: old woman, wrinkled tan skin, white hair in a bun, shawl over a dark green dress, walking stick
14. child: girl about ten, freckles, auburn pigtails, patched blue dress, bare feet (child proportions about 2.8 heads, still not chibi, 70 px tall instead of 92, same frame)
15. bard: young man, olive skin, curly brown hair, feathered cap, maroon doublet, lute on the back

Run in parallel batches of about 3-4 characters (CODEX-WORKFLOW.md). Codex reviews its own sheets and redraws weak views before finishing.
Output art-drop/figures/r18/run/: big/, sprites/ (name-view.png, 96x128), per character a 3x sheet (rows: stand front/side/back; walk-side; walk-front; walk-back) on #4a4642 and three walk GIFs (side, front, back) at 3x, 160 ms; NOTES.md with honest weaknesses per character.
