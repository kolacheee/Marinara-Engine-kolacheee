#!/usr/bin/env python3
"""Contact sheet of images on a checkerboard (shows alpha): sheet.py out.png file..."""
import sys
from PIL import Image, ImageDraw
files = sys.argv[2:]
T = 300
out = Image.new("RGB", (T * min(4, len(files)), T * ((len(files) + 3) // 4)), "white")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGBA"); im.thumbnail((T - 6, T - 6))
    bg = Image.new("RGBA", im.size, (200, 200, 200, 255)); d = ImageDraw.Draw(bg)
    for y in range(0, im.height, 8):
        for x in range(0, im.width, 8):
            if (x // 8 + y // 8) % 2: d.rectangle([x, y, x + 7, y + 7], fill=(120, 120, 120, 255))
    bg.alpha_composite(im)
    out.paste(bg.convert("RGB"), ((i % 4) * T + 3, (i // 4) * T + 3))
out.save(sys.argv[1])
