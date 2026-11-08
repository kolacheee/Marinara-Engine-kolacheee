#!/usr/bin/env python3
"""Draw the minimal persona's backdrops exactly (no AI): flat red circle + one thin line."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

OUT = Path(__file__).resolve().parent / "images" / "minimal"
W, H, SS = 1920, 1080, 4  # draw at 4x, then downsample for clean anti-aliased edges


def draw(bg, line, grain):
    img = Image.new("RGB", (W * SS, H * SS), bg)
    d = ImageDraw.Draw(img)
    r = 0.40 * H / 2
    cx, cy = 0.74 * W, 0.35 * H
    d.ellipse([(cx - r) * SS, (cy - r) * SS, (cx + r) * SS, (cy + r) * SS], fill="#E10600")
    y = round(0.82 * H)
    d.rectangle([0, (y - 1) * SS, W * SS, (y + 2) * SS - 1], fill=line)  # 3 px
    img = img.resize((W, H), Image.BOX)  # box: no ringing, exact flat colours
    if grain:  # very faint paper grain: gaussian noise, +/- about 1.5 levels
        n = Image.effect_noise((W, H), 6).convert("RGB")
        img = Image.blend(img, ImageChops.add(img, n, 1, -128), 0.25)
    return img


OUT.mkdir(parents=True, exist_ok=True)
draw("#F2F0EC", "#000000", True).save(OUT / "backdrop-day.png", optimize=True)
draw("#0A0A0A", "#E8E8E8", False).save(OUT / "backdrop-night.png", optimize=True)
print("ok")
