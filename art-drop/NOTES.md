# Art drop notes

Revised 62 PNGs after `review/critic-1.json`: all 59 failures and the three
summer partners `city-0`, `city-1`, and `city-3`. All 48 district tiles now
have newly drawn summer/winter pairs. The ten other passed markers and
their source drawings are unchanged byte-for-byte.

Redrew 14 markers: fantasy 0–1, wuxia 0–2, jazz_age 1–2, modern 2,
scifi 1 and 3, and wasteland 0–3. Simplified roof, foliage, fence and wall
clusters; restored the brown water tower, slate rear roofs, green shop
awning, continuous glass domes and broad capped sci-fi towers. Wasteland
settlements have separate scrap-metal, olive tarp and concrete masses,
with clear entrances and less scaffold/debris noise.

District redraws separate city towers and their roof equipment, vary
heights and footprints, and remove the light city ground patch. Factory
compounds use complete sawtooth roof ends, distinct tanks/chimneys and
open yards. Shacks use fewer solid roof panels, readable walls and doors,
varied arrangements, and flat dirt alleys. Small compounds that extend
into the margin are fitted inside it rather than having roof corners cut.

Each redraw went through image generation, nearest-neighbor native-grid
sampling and reference-palette locking, with hard alpha for markers.
The palette step now preserves small slate-roof and olive-tarp reference
colors. Winter edits use the final summer tiles as their targets; only
painted snow colors replace summer pixels. Snow caps are separated from
walls and ground, and every winter tile shares a packed-snow street color
across its clear 3 px margin instead of a bare rectangular road border.

All 72 delivered files remain in `out/`: transparent markers at
60/84/108/144 px and opaque district tiles at 48×48. Refreshed comparisons
and joined-tile previews were visually inspected in `review/`.
`python art-drop/review_art.py` passes all 72 files: names, dimensions,
uniqueness, palettes, alpha, bounds, street margins, shared winter street
joins, snow coverage and unchanged summer pixels beneath the snow.
The scope/hash audit is `review/critic-1-redraw.json`. Updated prompts are
in `generation-prompts.json`; full-size drawings remain in the gitignored
`source-drawings/` directory. The original critic report is unchanged.

No requested redraw was omitted. Live in-game rendering could not be
tested because this checkout contains only the art drop; the supplied
in-game screenshots were reviewed. Nothing was committed or pushed.
