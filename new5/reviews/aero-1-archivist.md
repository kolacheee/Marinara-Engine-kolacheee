## Aero Lagoon (aero): archivist's verdict

Files reviewed (all 11 present): backdrop-day, -night, -overcast-day, -overcast-night, -snow-day, -phone-day, -phone-night, -phone-overcast-day, wx-leaves, avatar-char, avatar-user. **No topbar-band image exists for aero**, and there is no phone overcast-night or phone snow backdrop. The prompt section in requests-batch1.md never asks for a band, so this is a gap in the request, not a failed generation.

### 1. Verdict: 6.5/10

The materials are right: real soap-film bubbles with rainbow rims and twin speculars, a sharp turquoise lagoon with caustic glints, glossy lime hills and a lens bloom from the upper right. The night aurora is a fair nod to the Vista aurora wallpaper era. The palette is canonical and the centre is very usable. But this reads as "clip-art lagoon", not a 2006 stock render. The hills are flat, featureless gel with no grass texture, dew, sprouts or flowers. The bubbles sit in two mirrored ladders (identical x positions, identical sizes, left to right), so it looks templated rather than drifting. There is no depth: no distant shoreline and no light shafts under the water. Real Aero has a hero element with lush detail at the edges. This has tasteful props and nothing more. It does hold together well across the variants, because the composition is locked across relights.

### 2. Per image

- backdrop-day: TWEAK. Break the mirror-symmetric bubble ladders (vary size, x position and count per side, add 1-2 tiny ones clustered). Give the hills real Aero grass, a glossy blade-textured turf with dew beads and a couple of curled sprouts at the edges.
- backdrop-night: KEEP. The aurora sits in the top band and the centre is dark and even, so it reads well. It would be nicer if the bubbles glowed a bit more from inside, as the prompt asked.
- backdrop-overcast-day: TWEAK. The streaky stratus texture runs straight through the chat area. Smooth the centre to a near-flat pearly gradient and keep the cloud texture to the top 15%. The hills read dull olive, so add a wetter sheen. Rain rings are good.
- backdrop-overcast-night: KEEP. It is calm and moody, and the bubbles as the only light source works. The sky texture is a touch busy but dark enough.
- backdrop-snow-day: KEEP. The frost-crystal bubbles are the best detail in the set, and the cracked ice lagoon is nice. Optional: drop the puffy clouds so it reads as cold.
- backdrop-phone-day: TWEAK. The two bubble columns are an exact mirror image, so stagger them. The sun flare cropped at top right is fine.
- backdrop-phone-night: KEEP.
- backdrop-phone-overcast-day: TWEAK. It kept the puffy cumulus (an off-model match to the desktop overcast), and the sky texture is busy in the centre band. Flatten it.
- wx-leaves: REDO. These are green jelly beans and gel pills, not leaves. There is no midrib, no veins and no stem, and two are just an oval and a circle. Aero leaves are glossy but botanical: a pointed tip, a curved midrib, a translucent backlit edge and a specular streak.
- avatar-char: KEEP. A textbook Aero orb with a crisp leaf inside, and it reads at small size.
- avatar-user: KEEP. It pairs well. The droplet could be a bit larger for legibility at 32 px.
- topbar-band: MISSING. It needs to be requested (see moves).

### 3. Missing or wrong

- **Motifs absent:** light rays and god-rays (from the sky and underwater), lens-flare hexagon chains, green "swoosh" ribbons and light streaks, dew beads on grass, fresh sprouts and unfurling fern tips, sparkle and glint stars, an underwater cutaway (half above, half below the waterline) with caustics. No animal motifs are expected here because the prompt forbade them, though goldfish, koi and butterflies are classic Aero.
- **Material:** the hills need the "glossy turf" look (fine blade texture under a gel highlight), not untextured plastic.
- **Composition:** the bubble layout is too symmetric and too static. It needs depth (a distant shore or misty islands at the horizon) so it doesn't read as a stage set.
- **Clash:** the overcast day sky texture fights the readable-centre rule. The leaf sprites look like candy, not nature, and that breaks the "tech meets nature" balance.

### 4. Weather

- **Clear day:** rising soap bubbles (a rainbow rim with a white specular, slow upward drift with a wobble) plus occasional glossy green leaves drifting sideways. Bubbles are the signature effect and are currently not a particle sheet at all. Add wx-bubbles.
- **Clear night:** glowing aqua bubbles plus tiny drifting firefly-like aqua and green sparkle motes (soft four-point glints).
- **Rain day/night:** glossy clear water droplets with a highlight (bead-shaped, not streaks), plus ripple rings at the bottom edge if the app supports them. The app's rain plus a "droplet on glass" sheet would be ideal.
- **Snow:** frosty glass snowflakes and small frosted orbs with a specular, matching the snow-day bubbles.
- **Wind:** the existing leaves, once redrawn as real glossy leaves.

### 5. Top 3 redesign moves

1. **Redo wx-leaves as botanical glossy leaves, and add a wx-bubbles sheet** (four soap bubbles of different sizes, rainbow rims, white speculars, transparent background). Bubbles drifting across the screen is the single most Aero effect possible, and right now the theme lacks it.
2. **Request a topbar-band:** a thin glossy aqua glass bar with a top-half white gloss, a soft green-aqua "swoosh" light streak and a few tiny bubbles. It should tile horizontally, Vista and Wii-channel style.
3. **Re-roll the day master with organic edge detail:** an asymmetric bubble scatter, textured glossy turf with dew beads and a sprout or two, a faint light-ray fan from the upper-right bloom, and a hazy far shoreline. Then relight from it and smooth the centre of both overcast skies.
