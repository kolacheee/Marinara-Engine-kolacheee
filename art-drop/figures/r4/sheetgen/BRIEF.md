# Lane: sheet-gen

Read `SPEC.md` first.

Your method: let your image generation tool draw pixel-art sprites directly, then make them exact.
1. Generate pixel-art character sprites of Wren and Hadrik in the HD-2D JRPG field-sprite look (stylised
   adult about 3.3 heads, dark coloured outlines, crisp clusters), several facings and walk poses on a flat
   background. Original designs only. Generate many, and choose and combine the best poses. Keep the prompts
   and the images in `scratch/`.
2. Recover the true pixel grid (detect the pixel size, sample the cell centres), snap to a clean palette,
   remove the fuzz and any half-pixels, and fix the scale so the height is 52 to 58 px. Then clean every pixel
   by hand at native size: outline, eyes, orphans, and consistency between frames (the same costume details
   and palette in every frame).
3. Fill any missing frames by editing pixels so the walk and idle are complete and consistent.
Then deliver per SPEC.
