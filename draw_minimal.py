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


def draw_stage():
    """Game stage (round 4): three left-aligned black bars, red ember circle, horizon rule at 62%; flat below."""
    bg = "#D9D6CF"
    img = Image.new("RGB", (W * SS, H * SS), bg)
    mask = Image.new("L", (W * SS, H * SS), 0)
    for t in (img, mask):
        d = ImageDraw.Draw(t)
        ink = "#111111" if t is img else 255
        for y, ln in ((0.14, 0.46), (0.20, 0.30), (0.26, 0.18)):  # bar tops, lengths; height 2.2%
            d.rectangle([0.08 * W * SS, y * H * SS, (0.08 + ln) * W * SS, (y + 0.022) * H * SS], fill=ink)
        r = 0.22 * H / 2
        cx, cy = 0.78 * W, 0.24 * H
        d.ellipse([(cx - r) * SS, (cy - r) * SS, (cx + r) * SS, (cy + r) * SS], fill="#E10600" if t is img else 255)
        y = round(0.62 * H)
        d.rectangle([0, (y - 1) * SS, W * SS, (y + 2) * SS - 1], fill=ink)  # 3 px hairline
    img, mask = img.resize((W, H), Image.BOX), mask.resize((W, H), Image.BOX)
    n = Image.effect_noise((W, H), 6).convert("RGB")  # letterpress grain, inside the shapes only
    grainy = Image.blend(img, ImageChops.add(img, n, 1, -128), 0.5)
    return Image.composite(grainy, img, mask)


OUT.mkdir(parents=True, exist_ok=True)
draw_stage().save(OUT / "game-stage.png", optimize=True)
draw("#F2F0EC", "#000000", True).save(OUT / "backdrop-day.png", optimize=True)
draw("#0A0A0A", "#E8E8E8", False).save(OUT / "backdrop-night.png", optimize=True)
print("ok")
