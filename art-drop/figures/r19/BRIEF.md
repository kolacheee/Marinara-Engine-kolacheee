# Round 19: style reference sheets from a panel of artists (owner 2026-11-26)

Owner: "They don't look stylistically consistent. Have a panel of artists build reference sheets, I'll decide on one, that then we can give Codex so it can generate a consistent style."

You are ONE artist on a panel of five. Each artist builds one complete STYLE REFERENCE SHEET in their own direction. The owner will pick one; it then becomes the reference Codex uses for every character, so it must be precise, self-consistent and easy to follow.

Shared target: field sprites for a serious adult fantasy JRPG in the spirit of Octopath Traveler 2 (HD-2D): proper pixel art with a visible pixel grid, dark coloured outlines, strong but readable shading, muted earthy world. No game images, no earlier art: text only. Your image tool draws every figure; Python only for keying, downscaling, palette snapping, assembling the sheet and checks.

Sprite spec (same for every artist): figure about 92 px tall in a 96x128 frame, feet on row 124, transparent background, at most 32 colours per character, alpha on/off. Drawn big by the image tool on flat magenta #FF00FF and reduced; how you reduce and clean is part of your style and must be written down.

Characters on your sheet (same three for every artist, so the panel can be compared):
- Wren: adult woman ranger, auburn hair tied back in a low ponytail, green cloak with the hood down, brown leather jerkin, brown trousers, boots, wooden longbow, quiver.
- Hadrik: blacksmith in his forties, very dark skin, short black hair, full black beard, brown leather apron over a cream shirt with rolled sleeves, dark brown trousers, heavy boots, hammer.
- Noble: young woman, fair skin, golden hair in an updo, long deep blue gown with gold trim, short cape.
For each: front, side (facing right), back, and one walk-side passing frame. Draw each character's side view first and use it as the reference for that character's other views.

Deliver into out/:
- out/STYLE-SHEET.png: one page (about 1600-2200 px wide) on a neutral background containing: the title of your style; the master palette as labelled ramps; a proportion guide (one figure with head-unit lines and the head count); outline rule swatches; shading rule (light direction, number of tones, an example ramp on a sphere or cylinder); a do / don't strip; and all 12 sprites at 3x with labels.
- out/STYLE.md: the written rules another artist (or Codex) can follow to match your style exactly: head count, eye size, outline colour rule, shading tones and light direction, cluster size and dithering rule, palette (hex), how to draw hands, faces, hair, cloth and metal at this size, walk rules, and the exact reduction/cleanup steps from a big image-tool drawing. Include the exact image-tool prompt template you used.
- out/palette.json (named ramps, hex), out/sprites/<name>-<view>.png (96x128), out/big/ (the image tool's originals).
- out/NOTES.md: honest weaknesses.
