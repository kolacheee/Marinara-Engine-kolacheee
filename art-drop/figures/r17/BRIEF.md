# Round 17: Codex again, drawn big and shown at half (owner 2026-11-26 20:20 Berlin)

Owner: "try Codex again now that letting it draw larger images and just rendering it smaller works".
Earlier Codex rounds failed at 32x48: the image tool can't hold a true pixel grid that small, and figures drawn pixel by pixel in Python were rejected as programmer art ("runescape graphics"). This round keeps what works now: the figure is about 92 px tall and is shown in the town at half size (frame 96x128).

Rules
- Codex's IMAGE TOOL draws every figure. Do not draw figures with Python/Pillow, scripts or pixel-by-pixel code. Python only for cutting, downscaling and checks.
- Inputs: text only. Inside this run Codex may give its own image tool its own earlier image of the SAME character as a reference for the other views. No image from any earlier round, no game screenshots, nothing from art-drop/ as input.
- Style in words: Octopath Traveler 2 field sprites, HD-2D. Proper pixel art with a visible pixel grid, about 3 heads tall (adult proportions, not chibi), dark coloured outline (not pure black), high-contrast 3-4 tone shading lit from the top-left, muted earthy colours, readable face with eyes, rich but readable costume detail.
- Background flat magenta #FF00FF, one figure per image, full body, feet visible, nothing else in the frame.

Characters (3, as a test): wren (the 8d Wren text in r13/BRIEF.md), innkeeper and guard (r13/BRIEF.md text; props allowed).
Views per character: front, side (facing right), back, walk 0-3 (side, facing right, contact / passing / contact other leg / passing). Same person, same colours, same size in all 7.
Order: design the side view first, then make the other 6 with that side image as the reference.

Processing: key out magenta, then box-downscale so the figure is about 92 px tall in a 96x128 frame, feet on row 124. Snap to at most 48 colours per character; keep it crisp (alpha on/off only). Add a 1 px outline: each transparent pixel touching the figure gets mean neighbour colour x0.32 + (8,4,10). No hand edits other than removing stray pixels.

Output art-drop/figures/r17/run/: big/ (the image tool's originals), sprites/ (96x128 PNGs, name-view.png), one sheet per character at 3x (front | side | back | walk 0-3) on #4a4642, walk GIF per character at 3x (160 ms), NOTES.md with honest weaknesses per character. Codex workspace ~/Downloads/figure-samples/r17 (scratch outside repos), deliverables committed from a fresh clone.
