# HD-2D dungeon art drop (job 1)

32 texels = 1 grid cell. Light from top-left. Colours come only from the job's ramps (see NOTES.md).
Walls are 64x64, floors and ground 128x128, leafcard 64x64 RGBA, bark 32x64. Sprites are 32x48 RGBA
with feet on the bottom row. sheet.png shows each file at 1x and 4x, with textures tiled 2x2.

Provenance: all textures were drawn procedurally in Python/Pillow. The sprites started as AI image
generations (Codex image tool), then were reduced to the palette and hand-cleaned pixel by pixel.
NOTES.md has per-file methods and known weaknesses.
