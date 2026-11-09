## Aero Lagoon: judge report (persona: someone who misses 2005-2012 glossy UI)

**1. Verdict: 6.5/10**
The palette is right: aqua sky, turquoise water, lime-gel hills, iridescent bubbles. The day backdrop would pass as a Vista or Windows 7 "nature" wallpaper. The night and rain relights hold together as one set, and every centre is calm and readable. But it is Frutiger Aero without the *Aero*. The light swooshes, glass ribbons, bokeh, caustics and wet reflective horizon that made that era feel like it lived inside the OS chrome are all missing. What we have is closer to a clean, generic mobile-game sky. The hills are smooth plastic blobs, not dewy grass, and the bubbles sit in stiff, mirror-symmetric columns that look stamped rather than drifting. The leaf sprites read as jelly beans. The avatars are the strongest pieces in the set.

**2. Per image**
- backdrop-day: TWEAK. Authentic palette, calm centre. Break the mirrored bubble columns (vary the sizes, stagger the heights, add 2-3 tiny ones near the hilltops). Add a faint white light-swoosh arc low on one edge and a hint of grass texture with dew on the hills. The horizon is a hard ruler line; soften it with a mirrored reflection of the hills in the water.
- backdrop-night: TWEAK. Good, and the aurora reads as Aero. The bubbles were asked to glow from inside but only their rims glow. Add soft inner aqua/mint luminance and a little bokeh. Same column-symmetry fix as day.
- backdrop-overcast-day: KEEP (minor). The rain rings and droplets on the bubbles are lovely. The hills could look a touch wetter and glossier, but it is usable.
- backdrop-overcast-night: KEEP. Moody and readable, and the glowing bubbles carry it.
- backdrop-snow-day: TWEAK. The frost-crystal bubbles and the cracked turquoise ice are great. The sky is almost identical to the day sky; make it paler and icier with no puffy summer clouds (soft haze instead). The snow on the hills looks like folded fabric; make it a smooth glossy dome with a specular sheen.
- backdrop-phone-day: TWEAK. Calm, but eight bubbles in two perfect ladders look like a UI grid. Use fewer, varied sizes, offset left from right.
- backdrop-phone-night: TWEAK. Same ladder problem. Otherwise it matches desktop night well.
- backdrop-phone-overcast-day: REDO (light). It kept the two puffy white cumulus clouds, which contradicts the overcast desktop version and the prompt. Remove them so the sky is an even pearly layer. Fix the bubble ladder too.
- wx-leaves: REDO. Four lime gel capsules with no midrib, veins or stem. In motion they will read as pills or candy, not leaves. Rebuild them as glossy leaves like the one in avatar-char (midrib, stem, a dewdrop on one), with a two-tone lime/emerald gradient, and some tilted or curled for tumbling.
- avatar-char: KEEP. Peak Aero: a glass orb, a big curved specular, a leaf inside. Optional: add a thin bright inner rim and a faint bottom caustic glow.
- avatar-user: KEEP. A great pair with the char. The droplet with its ripple is exactly right.

**3. Missing or wrong**
- **No topbar-band in this set.** A theme about window chrome needs one. Expected: a glossy glass strip with a white top-half sheen, a pale aqua-to-clear gradient, a thin bright highlight line along the bottom edge, and maybe a faint repeating light-swoosh or tiny bubble row. That is the Vista taskbar or Win7 title-bar feel.
- Signature motifs missing: curved white light swooshes and ribbons, soft bokeh orbs, underwater caustics or a split above/below-waterline view, dewdrops on grass blades, lens-flare hexagons, reflective "wet floor" mirroring.
- The hills are untextured plastic; real Aero grass is a lush, blade-detailed, dew-sparkled meadow with a sheen.
- Everything is too symmetric and too static; Aero compositions flow diagonally (a swoosh sweeping corner to corner, through the edges only).
- There is no snow night variant, if the set expects one (night snow with glowing frosted orbs would be gorgeous).

**4. Weather**
- **Clear day:** rising glass bubbles (clear, iridescent rim, white specular dot) plus the occasional drifting real leaf. The leaves alone are not enough; bubbles are THE Aero particle.
- **Clear night:** softly glowing aqua/mint bubbles and slow bokeh fireflies (blurred mint/cyan dots).
- **Rain (day and night):** the app draws the rain, but add glassy water-droplet sprites (beaded drops with a highlight) that drift or slide, so it feels like rain on glass.
- **Snow:** frosted glass snowflakes or ice-crystal orbs (pale aqua, glossy, a small specular) instead of plain white flakes; at night, faintly glowing ones.
- **Optional ambient:** lens-flare sparkle glints and dandelion seeds for windy day.

**5. Top 3 redesign moves**
1. **Build the topbar band and a bubble particle sheet.** The theme has no chrome and its wrong particle; glossy glass trim and drifting bubbles are what make it feel like an Aero app skin rather than a wallpaper.
2. **Add Aero's light language to the edges of the backdrops:** curved white swooshes, bokeh, a reflective horizon and dewy textured grass. Keep it to the left and right edges so the centre stays calm.
3. **Break the symmetry and redo the leaves:** stagger the bubble columns (especially on phone), remove the leftover cumulus from phone overcast, and replace the jelly-bean leaves with real glossy leaves to match avatar-char.

No topbar-band preview existed in `/tmp/claude-1000/-home-kolache-Documents-GitHub-Marinara-Engine--claude-worktrees-objective-lamport-25df1d/4a483336-2a08-4dcb-b8f9-7aadb2b4ab0d/scratchpad/judge/aero/`, and the aero prompt section in `~/Downloads/marinara-theme-images-r6/new5/requests-batch1.md` has no request for one either. There is also no phone overcast-night, phone snow or snow-night image.
