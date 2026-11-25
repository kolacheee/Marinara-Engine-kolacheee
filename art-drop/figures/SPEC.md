# Figures: what every sample must do (shared by all artists; says nothing about style)

Marinara Engine draws its towns in an HD-2D way: buildings, streets and props are 3D models with pixel
textures (32 texels per metre), seen from a camera tilted about 35 degrees down, in warm daylight or lamp
light at night, with bloom and a tilt-shift blur at the screen's edges. People are flat upright pixel sprites
standing in that 3D world. Your job is the people.

Do NOT look at, copy or build on any existing sprite in the repository or on disk (the owner rejected their
style). Do not use another artist's work. Do not imitate a specific commercial game's characters; take
qualities, not looks.

## The figure system the art must fit

Every person is built from LAYERS drawn once and stacked at runtime, bottom first:

1. body (skin, face, eyes, plain underclothes)
2. race feature (long pointed ears; horns), when the person has one
3. outfit
4. facial hair (beard), when any
5. hair
6. headwear, when any
7. held item, when any

Every layer is a sheet of frames that line up pixel for pixel with the body, so any outfit, hair or hat sits
on any body of the same type without nudging. A layer may draw over the ones below (hair over outfit
collar) and must leave transparent everything it does not cover.

Recolouring: one drawn body serves every skin tone, one drawn hairstyle every hair colour, one outfit
several colourways, one pair of eyes every eye colour. Draw each recolourable region ONLY in the exact
colours of its source ramp (you choose the ramp colours and how many shades, 3 to 5, darkest first), and
never use a source ramp colour anywhere else. Ramps you must define: skin, hair, eyes (iris), cloth A (main
garment), cloth B (trim/second garment). Give target ramps for: 5 skin tones (very light to very dark, plus
one fantasy tone such as grey-green or blue), 8 hair colours (black, brown, chestnut, blond, red, grey,
white, one fantasy colour), 6 eye colours (brown, hazel, green, blue, grey, amber), 4 colourways per cloth
ramp. Put all ramps in ramps.json:
`{"source": {"skin": [...], ...}, "targets": {"skin": [[...], ...], "hair": {"black": [...]}, ...}}`.

## Frames

- Frame size: 32 x 48 px, RGBA, alpha on/off only (no semi-transparent pixels).
- Feet on the bottom row of the frame, figure centred.
- Directions, one row each, top to bottom: down (toward the camera), left, right, up (back to the camera).
  Left is drawn, not mirrored, but for this sample you may draw right as a mirror of left.
- Walk: 4 frames per direction, frame 0 is also the standing pose.
- An adult stands 40 to 46 px tall in the frame, a child about 30.

## Readability (judged in the 3D town at normal zoom, where one sprite pixel is about 2-3 screen pixels)

- A person must read at a glance: face direction, hair, the outfit's job (labourer vs ranger vs mage), and
  race features (ears, horns) must be clear at 1x.
- Eye colour only needs to show as one or two pixels per eye; that is fine.
- The figure must stand out from busy textured ground and walls (think about outline or value contrast).

## The sample to deliver (nothing more: this is a style test)

Layers (each its own PNG sheet, 128 x 192 = 4 walk frames x 4 directions, unused cells transparent):
- body/man.png, body/woman.png (adult, average build). All 4 directions; walk frames for DOWN only (other
  directions may repeat the standing frame in all 4 cells).
- feature/elf-ears.png, feature/horns.png (curved horns).
- outfit/labourer.png (plain tunic, belt, trousers or skirt), outfit/ranger.png (hooded cloak open at the
  front, leather), outfit/mage.png (long robe, sash). Each must fit both bodies, or provide @man/@woman
  variants (outfit/ranger@woman.png) when it truly needs to differ.
- hair/short.png, hair/long.png, hair/braid.png; beard/full.png.
- head/hood.png (hood up) or head/hat.png, one of them.
- held/staff.png.

Composites (built from the layers with recolouring, by your own compose script, to prove the system works):
- lineup.png: six characters side by side, facing down, standing, at 1x and again at 4x, on mid grey (#7a7a7a)
  and again on a dark warm stone colour (#3a3129):
  1. human woman, ranger, long red hair, green eyes, light skin
  2. human man, labourer, short black hair, full beard, very dark skin
  3. elf woman, mage, braid, white hair, blue eyes, with staff
  4. horned man (fantasy skin tone), labourer, short hair, amber eyes
  5. human man, mage, long grey hair, beard, brown eyes, hood or hat
  6. elf man, ranger, short blond hair, hazel eyes
- turn.png: character 1 in all four directions, standing, 4x.
- walk.png: characters 1 and 2 walking down, 4 frames, 4x, plus an animated walk.gif.
- swatch.png: character 2 in all 5+1 skin tones, and character 1 in all 8 hair colours, 2x.
- NOTES.md: your direction in a paragraph, the ramps, honest weaknesses, and anything the system makes hard.

Check your own work: open every image you produce and look at it at 4x before you finish. Redo weak files.
A wrong face, smeared pixels, mismatched layers or a figure that doesn't read at 1x are failures.
