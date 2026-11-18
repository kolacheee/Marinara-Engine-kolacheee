# Cycle 5 — pixel-art lead

Reviewed `r17-city-final.png` at 1x, the full `r17-city-final-2x.png`, and `r17-city-final-vs-r15-vs-today.png`, against `BRIEF-17.md` and all four house/six hall references. Made and viewed Pillow nearest-neighbour 3x crops in memory: square `(480,672)–(1152,1056)`, east side street `(1392,288)–(1824,768)`, south gate `(1104,1008)–(1392,1440)`, and north wall `(288,48)–(768,288)`. Coordinates below are pixels in the 1920×1440 1x image, origin top-left.

No `critic-r17R*squint*` file exists in this checkout, including subdirectories. Used the current full-city `r17-city-final-squint.png`, viewed full size and additionally reduced for value grouping. The comparison sheet labels this final city R17 C4.

## 1. What works

The church and guildhall frame the square; the gate and pale approach survive greyscale. Window recesses, projecting bays and the major sprites' shaded right faces establish some depth. Trades are identifiable at 1x. The 2x file is an exact nearest-neighbour enlargement: no scaling blur. Street frontages have no lawns; rounded grid corners are not the main failure.

## 2. Blocking problems

1. **The modular roofs still fail the town houses' high 3/4 view.** Northwest roofs `(144,288)–(432,528)`, northeast slate roofs `(1392,288)–(1680,528)`, and the block beside the guildhall `(1056,288)–(1344,624)`: enormous square-ended, horizontally tiled rectangles abruptly become pitched gables or narrow hips. A ridge and two planes appear only in the lower section; the extension above reads as a flat roofing sample. Adjacent eaves change height without a convincing intervening wall or roof junction. The town references establish their volume through the whole roof silhouette. These rows still look like cardboard fronts attached to carpet strips. More roof area has not solved the camera.

2. **Shared outlines are visibly doubled.** Northwest joins at `x=239–240` and `335–336`, and the northeast join at `x=1487–1488`, all carry two adjacent dark pixels throughout `y=289–383`. These are confirmed samples, not shadows guessed from a scaled preview. The result is a black module grid inside the roof mass. It violates the 1 px rule and makes the construction kit more legible than the buildings.

3. **Material scale and palette are inconsistent across adjoining pieces.** At the east side street `(1392,288)–(1776,720)`, tiny regular slate courses meet coarse diagonal marks, then a richly mottled oblique tower-house. Around the square, the market hall `(720,720)–(912,864)` has large, heavily outlined scalloped tiles while the surrounding roof fills have fine brick-like stripes. Along the north wall `(432,144)–(768,240)`, uninterrupted mortar courses produce another high-frequency band. At 1x these texture densities do not belong to one kit. The connected block east of the guildhall also mixes red and slate roofs, contrary to the brief's one-roof-colour-per-block rule. Muting the overall colours has not unified the drawing.

4. **Trade signs have become flat billboards that damage the square's value hierarchy.** Baker `(720,528)–(816,624)`, apothecary `(1104,624)–(1200,720)`, smith/cobbler `(144,864)–(432,960)`, and tailor/scribe `(1584,864)–(1776,1008)`: large symbols sit against almost empty cream wall panels, with little board thickness or convincing projection. Their dark badges and pale rectangles read like interface cards. In greyscale the ordinary shop panels repeatedly outshout the guildhall facade. Naming the shop succeeds; matching the town houses and keeping landmarks dominant fails.

5. **Cast shadows expose the assembly instead of consistently describing its volume.** Under the north curtain wall, especially `(432,236)–(768,264)`, thin regularly spaced diagonal strokes suggest projecting posts while the solid wall lacks a corresponding broad shadow footprint. Beside the northeast block `(1584,384)–(1632,624)`, the dark strip reads as a rectangular backing mat despite the changing building profile. The gate and church have much more convincing southeast shadow masses. Top-left lighting exists, but these treatments do not agree about what is casting the shadow.

## 3. Ranked suggestions

1. **Rebuild one complete roof volume before propagating the kit.** Use the northeast two-cell house at `(1392,288)` as the proof piece. On a 96 px width and a 96 or 144 px depth, continue one ridge through the roof, carry the left/right value split to its far end, and terminate it with a drawn hip or gable. Replace the current flat-fill-to-gable transition. Make `roof-fill-w1` continue the appropriate slope and tile direction; use `roof-valley`/`roof-hip-end` at actual changes of direction. At height steps, expose a narrow shaded firewall with a lit coping. Keep the same roof-tile size across cap, fill and adapter. Place the finished house beside `fantasy-house-2` at 1x before repeating it.

2. **Give each shared edge one outline owner.** Fix the three measured joins first. Suppress one touching border inside the compositor while retaining the full 48 px placement pitch; do not overlap whole sprites and distort lot widths. Keep a single dark pixel at a party boundary, with additional width only where an explicitly drawn coping or side plane needs it. Check every w1/w2/w3 neighbour combination at 1x.

3. **Unify material ramps and reduce texture frequency.** On the 48×48 roof-fill pieces, group marks into roughly 6–10 px tile clusters and use one restrained highlight/shadow pair per plane; remove the fine all-over horizontal striping. Rework the market-hall roof to the same cluster scale without rounded, pillow-like tile bulges. For the north wall, group stones into roughly 12–20 px lengths and interrupt mortar within each 48 px module instead of running every dark course across the whole wall. Use one slate ramp for the entire connected block east of the guildhall, with at most two wall colours.

4. **Redraw the sign-and-wall assembly at architectural scale.** Start with baker and apothecary flanking the guildhall. Keep a 48×48 sign asset, but constrain the board to about 28–36 px, the trade symbol to 18–24 px, and the bracket projection to 6–8 px. Give the board a 1 px outline, a lit top edge, a 2 px shaded right thickness and a small southeast cast shadow. Restore a window or timber bay to the empty wall area. Recheck symbol recognition at 1x; do not recover readability by enlarging the blank cream panel again.

5. **Replace shadow stamps with joined footprints.** Begin with a continuous 12–18 px-deep hard-edged southeast shadow along the north wall base at `y≈240`, with deeper tower projections added to that mass. Recut the northeast house shadow to follow the actual facade steps and roof overhangs. Keep opacity at or below 50%, preserve visible paving, and use the gate's direction as the common reference. Inspect the joined result in greyscale for isolated strips and rectangular padding.

6. **Break the remaining repetition through shape, not extra flecks.** Along the north residential band, stagger selected roof ends by one 48 px cell and alternate real ridge/hip arrangements. Across the north wall, vary window groupings and tower caps while preserving their construction. Check sliding runs of five placements against the two-identical-piece limit; colour speckles alone should not count as a new visual variant. Do this after the roof and outline fixes, otherwise it only multiplies faulty pieces.

SCORE: 4/10
BLOCKING: 5
