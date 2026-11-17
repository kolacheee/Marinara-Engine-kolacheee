# Round 16 part E polish: the 24x24 weather icons (owner, 2026-11-17: "they need a polish pass")

Redo all 14 `icon-*.png` in `art-drop/out/weather16/` (same names, 24x24, transparent). Push as "art-drop: round 16 part E polish" when it passes its critic (at most 4 rounds). They are shown in the overworld's corner badge at 2x (48 px) on a dark translucent panel, next to the weather's name, and must also read at 1x.

## One family, not 14 drawings
- One shared cloud silhouette (a full, rounded pixel cloud with 2-3 puffs, lit top-left, shaded bottom-right), used by cloudy, overcast, rain, heavy_rain, storm, snow and hail. Only its colour changes: white-grey for cloudy/rain/snow, slate for heavy_rain/hail/overcast, dark slate for storm.
- Every icon fills the 24x24 canvas the same way: a 1 px margin, the main shape 20-22 px wide. Today blizzard, fog and wind are tiny next to the rest.
- A 1 px dark outline (near-black navy) round every shape, as the brief asked. Several icons have none and sink into the dark panel (overcast, fog, heavy_rain).
- Light from the top left, 3-4 tones per colour, no single-tone flat fills.

## Per icon (what is wrong now)
- `clear-day`: the sun is a flat diamond with uneven rays. Make a round disc with 8 even rays and a highlight.
- `clear-night`: keep the crescent; the lone dot star reads as a stray pixel. Use one or two small 4-point stars.
- `cloudy`: the sun behind the cloud is a muddle at 1x and the cloud is a flat slab. Use the shared cloud with a clear sun disc peeking out top-left.
- `overcast`: two dark blobs, low contrast. Two shared clouds overlapping, grey, no sun, outlined.
- `rain`: fine idea; use the shared cloud and 3 short slanted drops.
- `heavy_rain`: slate cloud, 5-6 longer streaks. Must read heavier than rain at 1x.
- `storm`: the bolt is good; keep it, on the dark shared cloud, maybe with 1-2 drops.
- `snow`: the flakes look like sparkles or stars. Use 2-3 small six-arm snowflakes (or 3x3 plus shapes) under the cloud.
- `blizzard`: a tiny flake with "=>" arrows reads like a symbol. Fill the canvas: a snowflake or flakes driven sideways with 2-3 bold wind streaks, white-blue.
- `fog`: three thin bars, low contrast. Use 3-4 thick, offset, rounded pale bars (or a cloud fading into bars).
- `wind`: the curl looks like the digit "3". Use 2-3 sweeping gust lines that curl at their ends (the usual wind glyph), not a numeral.
- `hail`: square pellets, sparse. Shared slate cloud with 3-4 round white-grey pellets with a highlight; clearly not snow and not rain.
- `sandstorm`: reads as a brown fist or bread. Swirling tan and ochre dust bands blowing left to right, maybe with a dim sun behind. Keep it distinct from wind by its colour and density.
- `heat_wave`: the waves read as flames or "SSS". Use a sun (or half sun) with 2-3 gentle wavy heat lines under or across it, pale gold.

## Critic
Render all 14 in a row at 1x, 2x and 4x on a dark translucent panel (like `critic-r16E-2-row-dark-*`) and inside the badge (icon at 2x + the weather's name). Fail any icon that: has no outline, is noticeably smaller or larger than the rest, uses a different cloud, or can be confused with another at 1x (watch cloudy/overcast, rain/heavy_rain, snow/hail, wind/blizzard/sandstorm, fog/overcast). Fail anything a glance reads as a letter, a digit or an object that isn't weather.
