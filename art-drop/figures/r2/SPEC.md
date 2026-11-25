# Figures, round 2: what every sample must do (shared by all artists; says nothing about style)

## Why there is a round 2

Round 1 produced five styles the owner rejected outright: they read as cute, toy-like or generic "pixel
RPG" figures, made for a younger audience, and did not belong next to the world's graphics. Round 1's art
is not available to you, and you must not look for it.

This game is a serious role-playing game for ADULTS. People in its towns should look like real adults living
in a real place: grounded proportions, believable faces, clothing with weight and construction, restrained
colour. Design as a senior art director would for a mature commercial game. No chibi, no big heads, no big
eyes, no cartoon expressions, no candy colours, no mascot charm.

## The world they stand in

Look closely at the two screenshots in world/ before deciding anything. They are the real game (people
hidden):
- market-normal-zoom.png: the usual play zoom.
- market-close-zoom.png: closest zoom.

The world is 3D: timber-framed plaster houses, slate and terracotta roofs, flagstone and cobble streets,
oak, iron and stone, all as pixel textures at 32 texels per metre, lit by a warm sun from the upper left
with soft ambient occlusion, real cast shadows, bloom and a tilt-shift blur at the screen's edges. The camera
looks down at about 35 degrees. People are flat, upright pixel sprites standing in that world, tilted slightly
back toward the camera, and they cast shadows.

The figures must look as if they belong to THIS world: the same texel density, the same light, a palette that
sits with these materials, and a level of detail that matches the textures around them.

## Scale (new this round)

- Frame: 48 x 64 px, RGBA, alpha on/off only.
- 32 px per metre, the same as the world's textures. An adult stands 52 to 60 px tall (1.65 to 1.85 m),
  head about 7 to 8 px tall, so roughly 7 to 7.5 heads. A child about 36 to 42 px.
- Feet on the bottom row, figure centred.
- On screen at normal zoom, one sprite pixel is about 2.3 screen pixels; at close zoom about 3.8.

## The figure system the art must fit

Every person is built from LAYERS drawn once and stacked at runtime, bottom first:
1. body (skin, face, eyes, plain underclothes)
2. race feature (long pointed ears; horns), when the person has one
3. outfit
4. facial hair, when any
5. hair
6. headwear, when any
7. held item, when any

Layers line up pixel for pixel with the body, so any outfit, hair or hat sits on any body of the same type.
A layer may draw over the ones below and leaves transparent what it does not cover.

Recolouring: each recolourable region (skin, hair, eyes, cloth A, cloth B) is drawn only in the exact colours
of its source ramp (you choose the colours and 3 to 6 shades, darkest first), and source colours are used
nowhere else. Target ramps you must give: 6 skin tones (very light to very dark, plus one non-human tone such
as ash grey), 8 hair colours (black, dark brown, brown, auburn, blond, red, grey, white), 6 eye colours,
4 colourways per cloth ramp. BLACK HAIR MUST READ AS BLACK (not purple or blue), and a very dark-skinned
person with black hair and a beard must keep a readable face (round 1 failed both). All in ramps.json:
`{"source": {...}, "targets": {...}, "fixed": {...}}`.

## Frames

- Directions, one row each, top to bottom: down (toward camera), left, right, up (back to camera).
- Walk: 6 frames per direction (frame 0 also the standing pose). The walk must read as walking: legs pass,
  arms swing opposite, the body rises and falls. Round 1's walks barely moved; that is a failure.

## The sample to deliver (a style test, nothing more)

Layers, each its own PNG sheet (288 x 256 = 6 frames x 4 directions; for this sample, walk frames for DOWN
and LEFT are required, other rows may repeat the standing frame):
- body/man.png, body/woman.png (adult, average build; they may differ in height and shape, then say which
  layers need @man / @woman variants)
- feature/elf-ears.png, feature/horns.png
- outfit/labourer.png, outfit/ranger.png (hooded cloak, leather), outfit/mage.png (long robe), with
  @man/@woman variants where needed
- hair/short.png, hair/long.png, hair/braid.png; beard/full.png
- head/hood.png (hood up)
- held/staff.png

Composites from the layers with recolouring (your own compose script):
- lineup.png: six characters facing down, standing, at 1x and 4x on mid grey (#7a7a7a):
  1. human woman, ranger, long red hair, green eyes, light skin
  2. human man, labourer, short black hair, full beard, very dark skin
  3. elf woman, mage, braid, white hair, blue eyes, staff
  4. horned man, ash-grey skin, labourer, short dark hair, amber eyes
  5. older human man, mage, long grey hair, beard, hood up
  6. elf man, ranger, short blond hair, hazel eyes
- in-world.png and in-world-close.png: the six characters pasted into the two world screenshots at the scale
  above (nearest-neighbour 2x/2.3x on market-normal-zoom, 4x on market-close-zoom), feet on the flagstones,
  each with a soft dark elliptical shadow under the feet. This is the main judging image: the owner will
  judge whether these people belong in this world.
- turn.png (character 1, four directions, 4x), walk.png + walk.gif (characters 1 and 2 walking down and left).
- swatch.png: character 2 in all skin tones; character 1 in all hair colours.
- NOTES.md: your direction, your ramps, honest weaknesses.

Look at every image at 1x and 4x, and at in-world.png at full size, before finishing. Redo anything weak.
Failures: anything cute or cartoonish; faces that are blobs; layers that don't line up; walks that don't
walk; figures that look pasted on (wrong light direction, wrong detail level, palette clashing with the
world).
