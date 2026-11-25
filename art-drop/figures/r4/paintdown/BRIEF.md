# Lane: paint-down

Read `../SPEC.md` first (it is copied beside this file as `SPEC.md`).

Your method: design each character large, then bring it down to native pixels by hand.
1. Use your image generation tool to make clean character turnaround art for Wren and Hadrik (front, side,
   back), in the look of HD-2D JRPG field-sprite art (stylised adult proportions about 3.3 heads, a dark
   coloured outline, cel shading with hue-shifted ramps, a flat background). Original designs only. Iterate
   until the designs are strong. Keep the prompts and the images in `scratch/`.
2. Scale each view to the 52 to 58 px sprite height, quantize to a small hand-picked palette per character
   (about 20 to 28 colours), then clean every pixel at native size: the outline in a dark hue, the eyes, the
   clusters, no anti-aliasing fuzz, no orphans. This hand pass is where the quality comes from. Write
   your own tools (Python with Pillow, or Aseprite Lua: an Aseprite binary is at
   `~/Downloads/marinara-agent-handoff/tools/aseprite/build/bin/aseprite`).
3. Build the walk and idle frames from the cleaned standing frame: move limbs, cape and hair as pixel clusters,
   and redraw what the motion breaks.
Then deliver per SPEC.
