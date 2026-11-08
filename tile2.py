#!/usr/bin/env python3
"""tile2.py out.png img [bg-hex]: 2x2 tiling preview (check seams) on a flat background."""
import sys
from PIL import Image
im = Image.open(sys.argv[2]).convert("RGBA")
bg = sys.argv[3] if len(sys.argv) > 3 else "#808080"
c = Image.new("RGBA", (im.width * 2, im.height * 2), bg)
for x in (0, im.width):
    for y in (0, im.height):
        c.alpha_composite(im, (x, y))
c.thumbnail((1200, 1200)); c.convert("RGB").save(sys.argv[1])
