# Round 17 facade course

All ground floors, upper storeys, corners and wall ends are 48 native pixels
high. Facade widths are 48, 96 or 144; wall ends are 8; corner panels are 48.
Anchor every module at its bottom-left cell and advance floors by exactly 48.

Rows **0 and 47** use the retained drawn Round 15 course donor:

- x=0 and x=W−1: RGBA **(43,40,29,255)** / `#2b281d`.
- 1 ≤ x ≤ W−2: RGBA **(98,66,38,255)** / `#624226`.

The donor is `review/r15-A-course-donor.png`. Registration crops/repeats its
painted interior and transfers its end pixels; code does not draw a beam.
Both rows are byte-identical for every same-width piece and every colourway.
This retained stack contract takes precedence over panel 1's suggestion to
remove the repeated course belts. Keep additional framing quiet inside them.

All facade footprints are opaque, including recessed jetty backing. Depth is
painted: beam tops, recessed windows, sill tops, stone plinths, door steps and
painted jetty shade beneath the sill/ledge. No module projects outside its
canvas. Silhouette cleanup
retains a one-pixel dark side edge. Adjacent lots retain their separate edges;
the compositor never adds another border. No window is covered by wall ends.

Ground names retain `ground-KIND-wN` as variant 0 / colour 0 aliases. Variant 0 uses
`ground-KIND-wN-c0..2`; the other two use `ground-KIND-v1-wN-c0..2`
and `ground-KIND-v2-wN-c0..2`. Storeys use `storey-KIND-wN-c0..2`;
unsuffixed names are colour 0 aliases. Colourways preserve course and alpha.
The three material ramps are warm cream, muted warm grey and muted cool grey.

Wall ends also have `-c0..2` exports. Reveal only the outer 3 pixels inside
the facade's edge framing (rows 1..46), as `compose.py` does. Corners replace
the last 48 pixels of a lot; they never add width. Signs use the inspected
blank left bay of `ground-shop-w3` at (4,3), or the right blank bay of
`ground-shop-v1-w3` at (112,3), relative to that ground floor. The native
32x40 sign canvases stay inside the lot. Do not put them over an entrance.

Run `python -B art-drop/review/r17-A-verify.py` for saved-output course,
palette, alpha, replay and protected-file checks. Scene composition uses the
native pixels without resizing. Roofs and later-part scene ingredients remain
explicitly labelled temporary references until their own round 17 parts.
