# Round 4 redraw lane: native pixels over a design guide

Read `SPEC.md` (the Octopath Traveler 2 field-sprite target, with original characters only).

The owner liked the STYLE and the designs of the two characters in `guide/`. These are large generated
turnarounds and the sprites another lane shrank from them. But the shrunk sprites look "jacked up": shrinking
and palette-quantizing a painting leaves stray pixels, broken outlines, lumpy clusters and smeared faces.
No cleanup of those sprites will fix that. DO NOT downscale, resample or quantize any guide image into your
sprite.

Your method:
1. Study the guide turnarounds for design only: silhouette, costume parts, colours and hair shape. Pick
   your palette by hand: 4 to 5 hue-shifted shades per material, with a dark coloured outline per material.
   About 24 to 32 colours per character.
2. DRAW each sprite at native 48 x 64, as a sprite artist would: silhouette mass, then flats, then the
   outline, then deliberate shading clusters (each cluster a clean shape, no single-pixel noise, no jaggy
   steps in curves; lines follow clean 1:1, 1:2 or 2:1 steps), then the face (clear eyes, brow, nose and
   mouth that read at 1x), then highlights. You may lay a guide image, scaled to the sprite height, at low
   opacity in a SEPARATE scratch layer to judge proportions, but every sprite pixel is placed on purpose.
   Author pixels as text grids, in Python, or in Aseprite
   (`~/Downloads/marinara-agent-handoff/tools/aseprite/build/bin/aseprite`).
3. Wren is in her thirties: adult face, no big anime eyes, firm brows and jaw. Hadrik is a strong man in his
   forties with a readable face under a black beard.
4. Make ONE master frame per facing (down, left, up), then build the walk (6 frames: contact, down, passing,
   up, contact, passing) and the idle (4 frames) by moving and redrawing limb, cape and hair clusters. The
   head, face and torso stay pixel-identical apart from the bob. The legs clearly part and pass.
5. Look at your sprite at 1x, 4x and 8x after every step, and fix what looks wrong.

Deliver per SPEC, but put in-world composites at EXACT integer scale: `in-world.png` with the sprites at 2x on
`world/market-normal-zoom.png`, and `in-world-close.png` at 4x on `world/market-close-zoom.png`. Also deliver
`lineup.png` at 1x and 4x, and `consistency.png` (each walk row at 4x). In NOTES.md, list honestly what still
falls short.
