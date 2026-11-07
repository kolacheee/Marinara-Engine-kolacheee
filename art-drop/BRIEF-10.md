# Round 10: more props (owner picked all four, 2026-11-07 16:59; cities first)

Same approach as BRIEF-8 (cyberpunk buildings): individual sprites planted like trees over a plain ground. Transparent PNGs in `art-drop/out/`: three-quarter overhead, top-left light, 1 px dark outline, the pixel density of the approved markers. Each setting's sprites must match its approved markers (`reference/<family>-marker*.png`) and house style (`reference/*-house.png` where present).

Seasons: built-up looks (parts 1-5) are summer (no suffix) and `@winter`. Parts 6-8 sit in fields and get all four: no suffix, `@spring`, `@autumn` and `@winter`. If the game needs other seasons, the cloud side will say. Winter means snow on roofs and ledges.

## Built-up looks as buildings (parts 1-5, one family each)

| Part | Family | Character |
|---|---|---|
| 1 | fantasy | timber-framed and stone medieval houses, thatch and slate roofs, a guild hall, a market stall, a smithy, mills and workshops for industry, hovels and lean-tos for slums |
| 2 | wuxia | grey-tile and upturned-eave houses, courtyards, a pagoda-roofed hall, teahouses, kilns, dye works and rice mills for industry, thatched hovels for slums |
| 3 | jazz_age | 1920s brick walk-ups, shopfronts with awnings, art deco blocks, a theatre, brick factories with sawtooth roofs and water towers, tenement shacks for slums |
| 4 | modern | contemporary low and mid-rise blocks, glass offices, a mall, a parking deck, warehouses and plants, makeshift housing for slums |
| 5 | wasteland | scrap-built shacks, patched concrete ruins turned into homes, a rusted water tower, a scrap foundry, tarp markets |

Each part:
- `<family>-street-base.png` and `<family>-street@winter-base.png`: 288x288, opaque, seamless. Fantasy and wuxia get cobbles and dirt lanes, jazz_age and modern pavement, wasteland cracked rubble. Calm, with no buildings.
- `<family>-city<season>-bldg-0..15.png`: 0-5 at 48x48, 6-11 at 48x96, 12-15 at 96x96.
- `<family>-slums<season>-bldg-0..11.png`: 0-7 at 48x48, 8-11 at 96x96.
- `<family>-industry<season>-bldg-0..9.png`: 0-5 at 48x48, 6-9 at 96x96.
- All sprites stand with their base on the bottom rows, centred, and every one is clearly different.

## 6. Farmsteads, `<family>-farmstead<season>-0..5.png`, 48x48
- For fantasy, wuxia, jazz_age and modern.
- The set covers a farmhouse, a barn, a shed or granary, a yard with a haystack or cart, a fenced pen with animals, and a silo or water tower (a mill for wuxia).
- Each stands on the bottom-centre and sits on the approved farmland fields.
- Wuxia's are paddy farmhouses (grey tile, upturned eaves) for the rice paddies.

## 7. Orchards and vineyards
- `orchard<season>-prop-0..7.png` and `vineyard<season>-prop-0..7.png`, 48x48, shared by all settings.
- Rows of small fruit trees, or vine rows on posts, over a field, filling about 70-85% of the cell with soft edges, so neighbouring props join into one orchard.
- Spring blossom on the orchards, autumn fruit and colour, bare in winter.

## 8. Landmarks, `<family>-landmark<season>-0..7.png`, 48x48
- For fantasy, wuxia, jazz_age, modern, scifi and wasteland.
- Sparse points of interest: a well, a shrine, standing stones, a watchtower, a windmill, a waystone, a campsite, a statue. Adapt each to the setting: a radio mast for modern, a holo beacon for scifi, a scrap totem for wasteland, a stone lantern or pagoda shrine for wuxia.

## QC
- Lay out each built-up family at 1x: the street base, buildings planted densely, then thinning out.
- Lay out farmsteads, orchards and vineyards on the farmland fields, and landmarks on the grass.
- Each must read clearly and match its setting's markers. Check sprites at 8x for clean edges and no fringe.
