# Round 5: regenerate, with grid-true generation only

Read `SPEC.md` (the Octopath Traveler 2 field-sprite target, original characters Wren and Hadrik). The owner
rejected every round-4 sprite as ugly. The causes:
- Painted turnarounds were shrunk and palette-quantized. That left stray pixels, broken outlines, lumpy
  clusters and smeared faces.
- Hand-drawn native sprites came out plain and blocky.

NEITHER METHOD IS ALLOWED THIS ROUND. No downscaling or resampling of a painting, and no drawing sprites
from scratch.

## Method: generate true pixel art, sample it losslessly, reject anything dirty

1. Prompt your image generation tool for pixel-art game sprites of each character, in the look of HD-2D JRPG
   field sprites: stylised adults about 3.3 heads tall, a dark coloured outline, clean hue-shifted
   clusters, limited palette, crisp hard pixels, no anti-aliasing, no blur, no gradients, on a flat solid
   background. Ask for one character per image, with a front view, side view, back view and walk poses in a
   row, every sprite the same size. Describe the costume exactly as in SPEC (Wren in her thirties, not a
   girl). Original designs only.
2. For every image: detect the pixel grid (the cell size and offset) and measure how clean it is. That means
   the colour variance inside each cell, and how many cells are mixed. Only accept an image whose cells are
   flat (nearly every cell a single colour). Sample one colour per cell, at the cell centre, so the result
   is LOSSLESS. Generate again until you have clean grids. Expect to generate many images and reject most.
   Log every attempt and its cleanliness score in `scratch/attempts.md`.
3. The sprite's native height is whatever the generator's grid gives, as long as an adult comes out 50 to 64
   px tall. Put each sprite into its frame without resampling, and widen the frame if a sprite needs it
   (say so).
4. The only edits allowed after sampling: removing the background, merging near-duplicate colours into one
   palette per character, and fixing single stray pixels. Never repaint shapes.
5. Use the same character across frames and views: pick the generation whose views and walk poses are
   mutually consistent. If you can't get a full walk from one image, deliver what is consistent and say so.
   Consistency matters more than frame count.

## Deliver in out/

- The sheets (per SPEC; missing frames left empty and listed).
- `lineup.png` at 1x and 4x.
- `in-world-close.png`: sprites at EXACT 4x on `world/market-close-zoom.png`. `in-world.png`: sprites at 2x on
  `world/market-normal-zoom.png`. No fractional scaling anywhere.
- `walk.gif` if a walk exists.
- `best-raw/`: the raw accepted generations.
- NOTES.md, including an honest judgement against this question: does it look like a premium HD-2D sprite at
  4x, or is it ugly? If it's ugly, say so plainly and keep generating.
