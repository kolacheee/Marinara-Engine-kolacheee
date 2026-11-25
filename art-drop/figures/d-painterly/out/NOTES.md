# Late Sun Gouache — notes

## Direction

Small adult town figures built from warm sunlit planes, saturated half-tones and cool violet shadows, with no black contour. Heads and shoulders carry the brightest accents; grounded boots and shaded lower garments carry the weight. The silhouettes distinguish a belted labourer, an open-cloaked ranger and a wide-sashed mage. All artwork is drawn directly at 32×48 using labelled shapes and authored pixel stamps. Colour swaps are exact dictionary lookups, and enlargement uses nearest-neighbour sampling.

## Delivered files and layout

There are 16 transparent 128×192 layer sheets. Rows are down, left, right, up; columns are standing, left stride, passing, right stride. Only the down row walks; other rows repeat the standing cell. Beard cells facing up are intentionally transparent. Both bodies share identical head and neck pixels in every corresponding cell. Outfits have man/woman variants; the female labourer has a calf-length skirt.

`lineup.png` has four bands: 1× grey, 4× grey, 1× dark stone, 4× dark stone. Character cells have 8 native pixels between them. `turn.png` shows character 1 down/left/right/up at 4×. `walk.png` shows four frames of character 1 above four of character 2, at 4×. `walk.gif` animates the same characters side by side, with four frames of 160 ms and an endless loop. `swatch.png` is 2×: six skin tones on character 2, then eight hair colours on character 1, in the target-ramp order below.

## Colourways used

| Character | Build / role | Skin | Hair | Eyes | Cloth A | Cloth B | Extras |
|---|---|---|---|---|---|---|---|
| 1 | Woman / ranger | Light | Long red | Green | Moss | Ochre | — |
| 2 | Man / labourer | Very dark | Short black | Grey | Oat | Rust | Black full beard |
| 3 | Woman / mage | Very light | White braid | Blue | Indigo | Ochre | Elf ears, staff |
| 4 | Man / labourer | Fantasy grey-green | Short violet | Amber | Madder | Slate | Curved horns |
| 5 | Man / mage | Medium | Long grey | Brown | Madder | Ochre | Grey full beard, oat hood |
| 6 | Man / ranger | Brown | Short blond | Hazel | Moss | Teal | Elf ears |

The hood on character 5 has its own cloth-A override to oat. Beards share the selected hair ramp. Eye colour on character 2 was not specified; grey gives its two-pixel irises more separation from the very dark skin and black beard.

## Ramp table

All values below run darkest to lightest. The supplied hex values are unchanged. No collision correction or other palette nudge was needed. The machine-readable authority is `ramps.json`.

### Source and fixed ramps

| Kind | Ramp | Colours |
|---|---|---|
| Source | skin | `#5a3a4a` `#8f5a55` `#c4846a` `#e6b08a` `#fbdcb4` |
| Source | hair | `#3a2a3e` `#5e3e45` `#8a5a48` `#b78258` `#e0b27a` |
| Source | eyes | `#3a2a5a` `#6a4a9a` `#9a7ac8` |
| Source | cloth_a | `#22243e` `#34406a` `#4c6496` `#7a94b8` `#d0d6c4` |
| Source | cloth_b | `#2e2228` `#54383a` `#84583e` `#b48a52` `#e8c88a` |
| Fixed | linen | `#4a3e4a` `#8a7a78` `#c8b8a0` |
| Fixed | leather | `#2e1e26` `#523428` `#7c5236` `#a87c50` |
| Fixed | wood | `#262026` `#4a3a30` `#74603e` `#a48e5e` |
| Fixed | metal | `#3a3e50` `#7a8494` `#d8dce0` |
| Fixed | horn | `#2a2230` `#5a4a4e` `#9a8a7a` `#e0d4b8` |
| Fixed | gem | `#3a6aa0` `#bff0ff` |
| Fixed | deep | `#241c2c` |

### Target ramps

| Region | Name / order | Colours |
|---|---|---|
| Skin | 1. Very light | `#6b4a5c` `#a9767a` `#dca596` `#f4cdb6` `#fff0dc` |
| Skin | 2. Light | `#5e3d4e` `#9a6260` `#cf9273` `#edbd96` `#fde3bf` |
| Skin | 3. Medium | `#4e3140` `#7d4c45` `#b47a56` `#d9a271` `#f2c994` |
| Skin | 4. Brown | `#3a2433` `#643a3a` `#925c45` `#bd8459` `#e0b07c` |
| Skin | 5. Very dark | `#241826` `#402430` `#643c38` `#8c5a44` `#b98763` |
| Skin | 6. Fantasy grey-green | `#2c3340` `#48585a` `#6f8676` `#9bb193` `#cfe0b8` |
| hair | black | `#151424` `#232538` `#353a52` `#50586e` `#8a93a8` |
| hair | brown | `#2a1f2e` `#45303a` `#6a4838` `#8f6845` `#c09a6c` |
| hair | chestnut | `#2e1a2a` `#552a32` `#84402f` `#ad6538` `#d99a5c` |
| hair | blond | `#5a4a4a` `#8a7458` `#c0a265` `#e3ca80` `#fff0b8` |
| hair | red | `#3a1a2e` `#6c2638` `#a83c32` `#d8653a` `#f5a05a` |
| hair | grey | `#3a3a4c` `#5c5e70` `#858a96` `#b0b3b8` `#e0ded8` |
| hair | white | `#6a6c86` `#9a9db2` `#c8cad6` `#e8e8ee` `#fffbf0` |
| hair | violet | `#2a1f44` `#4a3070` `#7448a0` `#a274c8` `#d4b0ec` |
| eyes | brown | `#2e1a1a` `#5a3424` `#86563a` |
| eyes | hazel | `#3a2e1e` `#6e5a2c` `#9a8a48` |
| eyes | green | `#1e3428` `#2e6a40` `#5aa060` |
| eyes | blue | `#1e2a4a` `#2e5a9a` `#5a9ad0` |
| eyes | grey | `#2e3440` `#5a6474` `#8a96a4` |
| eyes | amber | `#4a2a12` `#9a6418` `#d8a030` |
| cloth_a | madder | `#3a1a30` `#6a2638` `#9c3a3a` `#c8644a` `#f0a878` |
| cloth_a | moss | `#1e2a2e` `#2e4a3a` `#4a6e44` `#7a9a5a` `#c4d08c` |
| cloth_a | oat | `#3e3440` `#66585a` `#948068` `#c0a884` `#ece0bc` |
| cloth_a | indigo | `#1e1a38` `#362a5c` `#54408a` `#8064aa` `#c4a8d0` |
| cloth_b | ochre | `#3a2a22` `#6a4a2a` `#a0782e` `#d0a840` `#f4dc8c` |
| cloth_b | teal | `#142a34` `#1e4a52` `#2e7070` `#58a090` `#a8d8b8` |
| cloth_b | rust | `#3a1a22` `#6a2e26` `#a04a2a` `#d07a3a` `#f6b870` |
| cloth_b | slate | `#1e1e2a` `#34364a` `#525870` `#7c8494` `#c0c4c4` |

## Checks and visual review

`python3 -B src/check_figs.py` completed with **zero failures across 16 sheets**. It checks exact ramp contents and uniqueness; file sizes and RGBA mode; binary alpha; layer-specific colours and source-colour luminance; 44-pixel grounded body bounds and centring; identical heads/necks; literal eye and mouth pixels; isolated pixels with authored face exceptions; rim/core proportions per cell and ramp; complete coverage of body linen; exact recolouring; reflected profile silhouettes with independently relit colours; composite sizes; and GIF loop, duration and decoded frame pixels.

The maximum shade-4 proportion is 8.0%. The highest lone-pixel proportion is approximately 0.14%, in ranger hardware, against the 3% ceiling. The two-pixel braid tie is treated as an accent, rather than as a cylindrical lit region requiring a separate core-shadow pixel. Fixed ramps do not have five indexed shades and are excluded from the five-shade proportion check. The darkness threshold is evaluated by luminance on source sheets; recolour targets retain the exact prescribed values, including the darker black-hair target.

Every layer's complete frame grid was inspected on grey at 4×. The lineup was inspected at native size and 4× on grey, dark stone and generated cobbles. The turn and the greyscale cobble composites were inspected at 4×. The six skin and eight hair variations were inspected at 4× in addition to the delivered 2× swatch. The animation's four poses were inspected in the 4× walk sheet; decoded GIF frames are pixel-identical to the intended composites and have uniform timing. The image viewer exposes a static animation preview, so real-time playback was not independently observed.

Review-driven corrections included the missing profile forearm, cloak overlap at the hands, the lowered hood tip beneath long hair, straight hair bands, horn roots that were too bright, the lifted foot's height, and reflected profile accents that had changed the silhouette. The staff now keeps its lit edge on screen-left in both profile views. The final review images and numerical report remain in `scratch/`.

## Honest weaknesses and exact constraint compromises

- The clothing reads more as broad, graphic painted planes than as softly broken gouache. At this resolution the robe especially retains a large, quiet central plane. There is no added texture noise to simulate brushwork.
- Faces are calm but extremely compressed. The very dark, fully bearded labourer and the hooded mage have the least facial detail at 1×. Their eye pixels and mouths are present, but expression and eye colour read best at 2–4×.
- Long hair remains fairly curtain-like from the front. Its back and profile locks have more varied tapers and breaks, but there is no separate rear-hair layer; the specified stacking order limits how naturally hair can pass behind a cloak and around its collar.
- This is a restrained four-frame walk. Knees have little articulation, and cloth, beard and hair follow the shared pose without secondary motion. The standing and passing beats are deliberately similar. Side and rear walk animation are not supplied, as permitted for this sample.
- A literal one-pixel upward translation of a 44-pixel body cannot also keep its bounding box exactly 44 pixels tall and its sole on row 47. The passing pose therefore lifts the face, jaw, neck, shoulders, hands and attached layers by one pixel, retains the bald crown on row 4, and keeps the planted soles on row 47. The head compresses by one row in that pose. Both builds use the same treatment. This is a documented compromise, not a claim that every body pixel translates upward.
- Likewise, a forward foot cannot move below an already grounded row-47 sole. In each stride the forward toe widens at the same ground line; the trailing sole rises to row 46. Boot seams use a brighter left edge to preserve separation on dark stone.
- The shaft's grip aperture is authored against the woman mage's shared hand anchors for the required staff-bearing character. Its attachment is not demonstrated for every possible body/outfit combination. General-purpose runtime item sockets would be a separate integration task.

## What the layer system made hard

The shared 10-pixel frontal head leaves little room to distinguish adult facial features while keeping all hair, beard, ears and hood layers interchangeable. A two-pixel eye has to communicate both colour and a lid shadow. The hood must cover the brow without taking away either eye, and the fringe must remain above it. Keeping those pixels literal required protecting face stamps from the cleanup pass.

Relighting a reflected shape needs more than flipping colour indices. The cylinder calculation uses original part geometry, not just the fragments left visible after other labels cover it. Crown highlights, profile iris values, horn tips and staff edges need explicit screen-space decisions. Long hair also competes with the ranger's lowered hood and the elf ear roots; larger ear tips and a lower hood point preserve those cues within the fixed layer order.

## Rebuild

Run from this folder, with Pillow available:

```sh
python3 -B src/draw_figs.py
python3 -B src/compose.py
python3 -B src/check_figs.py
```

`src/skeleton.py` owns the shared geometry and motion; `src/stamps.py` contains the authored masks and accents; `src/palette.py` contains the exact ramps. The draw script produces source sheets, the compose script performs exact recolours and creates previews, and the checker writes `scratch/check-report.json`. Use `-B` to keep bytecode intermediates out of `src/`. Scripts and review intermediates are outside `out/`; only the requested deliverables are in `out/`.
