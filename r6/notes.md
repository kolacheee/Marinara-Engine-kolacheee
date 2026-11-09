# Round 6 notes (one line per image: tries, anything redrawn in code)

## Batch 1
- minimal/sun-print: 1 try. Raw was a good printed semicircle but its darker rim did not sit on an exact circle and the grain was faint, so the final is an exact 1200x600 semicircle mask (4x supersampled edge) filled with the raw's interior ink texture, re-centred on #E10600, plus code grain, ~140 lighter speckles and a darker hairline just inside the curve (not on the horizon). Real alpha outside.
- creator/backdrop-phone-day: 1 try (style ref creator/backdrop-day). Branch fills ~17% of the top (spec 14%), otherwise as asked.
- creator/backdrop-phone-night: 1 try, Codex edit of the day raw (lantern top right, calm band dark). Not code-relit.
- access/backdrop-day: 1 try (edit of the current). Lantern on a post at ~86% across, ~79% down (spec 66% down; it hangs a little lower). The raw put a warm spot in the glass; flattened to #e9e2cf in code (brief: clear glass, no glow).
- access/backdrop-night: Codex twin drifted (bigger tree, new clouds), so the night is a code relight of the final day, pixel for pixel: sky #121826->#1b2740 with clouds kept as faint lifts, land on a #0e131d..#2b3850 ramp, 42 faint stars in the top 25%, lantern lit in code (flame, #f2b84b glow 25% fading within 3% of the width, faint warm pool on the path). The Codex raw stays in work/.
- maximal/backdrop-day: 1 try (regen, emblem as style ref). Snapped to a 480x270 art grid (every art pixel 4x4), 96 flat colours, no dither (sky steps in near-identical bands, no checkerboard). Left/right edges tile (two whole cherry trees meet at the seam).
- maximal/backdrop-night: Codex twin drifted, so code relight of the final day art grid, pixel for pixel: sky #2b1f40->#3a2b55, clouds dropped, buildings/shading/trees mapped to the spec colours (trees told apart from same-pink buildings by shape), about a third of the windows lit #ff8fbd/#ffe28a, the rest #3f3266, 36 single-cell stars, crescent moon top left. The shop awning stripes count as windows in two places (they glow like a lit sign).
- maximal/backdrop-day-portrait: 1 try (regen; ref = current portrait + new landscape raw). 195x422 art grid at 6x6, 96 colours.
- maximal/backdrop-night-portrait: code relight of the final portrait day, same method; stars in the top 30% only.
- neon/backdrop-day: 1 try (edit of the current). Changes are subtle as briefed: tube edge lights and magenta bands on the right and left towers, faint grid on the water.
- neon/backdrop-day-portrait: 1 try (edit of the current), same subtle changes.
- cozy/backdrop-day: 1 try (edit of the current). Shelf and curtain gone, still life on the counter bottom right (it starts at ~78% across, spec 86%). The ivy reached 30% down; the two lowest leaves were painted out with clean wall in code so it ends at ~21% (spec 22%).
- cozy/backdrop-night: 1 try (edit of the new day raw; it lines up at 0,0), same ivy trim applied. Candle in a jar beside the teapot.
- cozy/card-placeholder: 1 try (style refs cozy/sprigs, cozy/paper-tile).
- cozy/card-placeholder-night: 1 try (edit of the day raw).
- cozy/backdrop-phone-day: 1 try (style ref = new cozy day raw).
- cozy/backdrop-phone-night: 1 try (edit of the phone day raw; style ref = new cozy night raw).
- immersion/backdrop-portrait-day: 1 try (style ref immersion/backdrop-day).
- immersion/backdrop-portrait-night: 1 try (edit of the day raw; ref immersion/backdrop-night). Close to the day composition, not pixel-exact.
