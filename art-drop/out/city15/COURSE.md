# Round 15 facade course

Coordinates are zero-based. Every panel is `48*N` pixels wide and exactly
48 pixels high. The fixed course occupies **top row 0** and **bottom row 47**.
Each is one native pixel high; two abutting pieces form a two-pixel timber
course with no overlap or transparent gap.

For width `W`, both rows have this exact RGBA pattern:

| x | Material | RGBA |
|---|---|---|
| 0 and W−1 | dark end outline | (43, 40, 29, 255), `#2b281d` |
| 1 through W−2 | dark warm timber | (98, 66, 38, 255), `#624226` |

These colours are sampled from the supplied fantasy house/hall palette.
The course is registered from a drawn horizontal timber beam, palette
locked to these two material tones and composited onto every panel. Code
registers and repeats that drawn strip; it constructs no facade art.
Beam pixels in the complete top and bottom rows must compare byte-for-byte
across all eight panels of each width, including jetty panels.

Jetty overhangs remain inside the requested width. The upper wall extends
to both outside edges; the lower wall steps inward by exactly three native
pixels on each side. The fixed course still spans the full width at y=47.
Thus the recessed lower wall and its brackets sit above the common course;
no panel is widened and no stack origin changes.

Ground-floor stone plinths sit immediately above the bottom timber course;
the shared dark course is their contact foot on row 47. No roofs or Part B
colour variants belong to this pass.

The finished donor is `review/r15-A-course-donor.png`, copied from the
96-pixel-wide top beam in `ground-shop-w2-a`, mode row 1. Its warm-brown
material is locked to `#624226`; its two dark end pixels remain `#2b281d`.
Width 48 crops its interior; width 144 repeats/crops the same drawn interior
and copies the two original end pixels. Every finished top and bottom row
is the same pattern specified above.

Jetty upper walls occupy rows **0–37** across the full width. The drawn lower
wall and brackets are registered to x **3 through W−4**, rows **38–46**.
The two recessed side returns are exactly **3×9 pixels** each, backed by
drawn opaque shadowed wall material. The front wall still steps inward by
three pixels, visible as depth shading rather than transparent slots. Row
**47** is the full-width common course. The whole rectangular footprint is
opaque, so adjacent jetties and mixed neighbours reveal no ground through
the side returns. Alpha is 0/255; hidden RGB is zero.

The ground pieces have stone plinths and steps immediately above the common
contact foot. Decorative framing remains inside the fixed course boundaries.
