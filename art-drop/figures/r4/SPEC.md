# Figures, round 4: the Octopath Traveler 2 sprite language

## Why round 4

Every earlier round was rejected. The last verdict on scripted, flat, blocky figures was "RuneScape graphics".
The owner has now named the target: characters that look like the field sprites of **Octopath Traveler 2**
(HD-2D). The towns these figures stand in were built after that game's look.

Match the QUALITY and LANGUAGE of those sprites. Use only ORIGINAL characters: never recreate, trace or copy any
Octopath character, costume, palette sheet or asset. Do not download any game asset or ripped sprite sheet.

## What that sprite language is (study this; it is the brief)

- **Proportions:** stylised but adult, about 3 to 3.5 heads tall. The head is large (roughly a third of the
  height) so the face and hair read at play zoom. Hands and feet are small and neat. The figures are not cute
  mascots. They are grown-up travellers, merchants and soldiers with serious faces and grounded costumes.
- **Outline:** a dark outline around the silhouette in a DARK HUE OF THE ADJACENT COLOUR (dark brown around
  skin and leather, dark navy around blue cloth), never pure black. Interior lines are lighter and are used
  sparingly (collar, belt, sleeve edge).
- **Shading:** clean pixel clusters, 3 to 5 shades per material, with hue-shifted ramps (warm highlights,
  cooler shadows). Soft light from the upper left. No noise, no dithering mush, no pillow shading, and no stray
  single pixels.
- **Faces:** eyes as small dark marks (1x2 or 2x2) with a skin-tone brow above, a hint of nose and mouth. The
  hair frames the face with clear, chunky locks and a highlight band.
- **Costume:** rich and specific. Layered cloth, belts, trims, buckles, a cape or scarf that moves, boots with
  a light edge. Every costume reads as a profession at a glance. Colours are saturated but tasteful, never candy.
- **Animation:** a 6-frame walk with real weight (the body bobs, arms swing, cloth and hair follow a frame
  late). Also a 4-frame idle "breath" (the shoulders rise one pixel, the cape and hair sway). Octopath figures
  are never frozen.
- **In the world:** the sprite is unlit pixel art. The 3D scene adds a soft ground shadow, bloom and depth
  blur around it. The sprite must look crisp and premium next to the textured houses.

## Technical

- Frame 48 x 64 px RGBA, alpha only on or off. An adult stands 52 to 58 px tall, feet on the bottom row, centred.
- Rows: down (toward the camera), left, right, up. Right may be a mirror of left only if nothing asymmetric
  breaks (a sword or bag can switch sides; note it).
- World: 32 texels per metre. One sprite pixel shows as about 2.3 screen pixels at play zoom and 3.8 at close zoom.
  The screenshots in `world/` are the real game with people hidden; composite into them.

## Deliver (two ORIGINAL characters, no layering yet; style first)

1. **Wren**, a woman ranger in her thirties: auburn hair in a tied tail, a hooded green travelling cloak worn
   down, a leather jerkin, bracers, a short bow on her back and a quiver.
2. **Hadrik**, a blacksmith in his forties: very dark skin, black short hair and a full black beard, a leather
   apron over a rolled-sleeve shirt, heavy boots, a hammer at his belt. (Black hair must read black, and his
   face must stay readable.)

Files in `out/`:
- `sheet-wren.png`, `sheet-hadrik.png`: 288 x 256 sheets (6 frames x 4 rows). The down and left rows have the
  full walk. Up and right have at least a standing frame repeated.
- `idle-wren.png`, `idle-hadrik.png`: 4 idle frames facing down, in a row (192 x 64).
- `lineup.png`: both, standing, facing down and left, at 1x and 4x on mid grey #7a7a7a.
- `walk.gif` (both walking down, then left, 110 ms per frame) and `idle.gif`.
- `in-world.png` (from `world/market-normal-zoom.png`, at 2.3x nearest-neighbour with a soft dark contact
  shadow) and `in-world-close.png` (from `world/market-close-zoom.png`, at 3.8x). Place both characters on
  open flagstones, not on top of anything.
- `NOTES.md`: method, tools, and an honest list of what still falls short of the target.

Before you finish, look at `in-world-close.png` at full size and ask: "Would this pass as a sprite from a
polished commercial HD-2D game?" If not, keep working. Stiff, blocky, flat, noisy or toy-like figures fail.

## Rules

Work only in your own folder. Do not open other lanes' folders or any earlier round's figure art. No ripped or
downloaded game assets. Generated reference images are allowed only where your lane's brief allows them.
