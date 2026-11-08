#!/usr/bin/env python3
"""Turn Codex raw.png outputs (work/<persona>/<name>/raw.png) into final images/<persona>/<name>.png."""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent
WORK, OUT = ROOT / "work", ROOT / "images"
L = Image.LANCZOS


def load(p, n):
    return Image.open(WORK / p / n / "raw.png")


def save(img, p, n):
    d = OUT / p
    d.mkdir(parents=True, exist_ok=True)
    img.save(d / f"{n}.png", optimize=True)


def cover(img, w, h, resample=L):
    s = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)), resample)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


def alpha_bbox(img, thr=12):
    return img.convert("RGBA").getchannel("A").point(lambda v: 255 if v > thr else 0).getbbox()


def fit_transparent(img, w, h, pad=0, resample=L):
    img = img.convert("RGBA").crop(alpha_bbox(img))
    s = min((w - 2 * pad) / img.width, (h - 2 * pad) / img.height)
    img = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), resample)
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    c.paste(img, ((w - img.width) // 2, (h - img.height) // 2), img)
    return c


def roll(img, dx, dy):
    return ImageChops.offset(img, dx, dy)


def seam_blend(img, xs=True, ys=True):
    """Tile seamlessly: blend with a half-rolled copy, weighted toward the copy near the edges."""
    w, h = img.size
    b = roll(img, w // 2 if xs else 0, h // 2 if ys else 0)
    def ramp(n):
        return [int(255 * min(1, max(0, (abs(2 * i / (n - 1) - 1) - 0.35) / 0.65)) ** 1.5) for i in range(n)]
    rx, ry = ramp(w) if xs else [0] * w, ramp(h) if ys else [0] * h
    mx = Image.new("L", (w, 1)); mx.putdata(rx); mx = mx.resize((w, h), Image.NEAREST)
    my = Image.new("L", (1, h)); my.putdata(ry); my = my.resize((w, h), Image.NEAREST)
    return Image.composite(b, img, ImageChops.lighter(mx, my))


def profile(img, axis):
    g = img.convert("L")
    if axis == 1:  # along x: mean of each column
        return list(g.resize((g.width, 1), Image.BOX).getdata())
    return list(g.resize((1, g.height), Image.BOX).getdata())


def period(img, axis, lo, hi):
    p = profile(img, axis)
    m = sum(p) / len(p); p = [v - m for v in p]
    n = len(p); hi = min(hi, n // 2)
    def ac(k):
        return sum(p[i] * p[i + k] for i in range(n - k)) / (n - k)
    a0 = ac(0) or 1
    best = max(range(lo, hi), key=ac)
    return best, ac(best) / a0


def strip(img, band, out_w=1920, out_h=48, periodic=True, resample=L):
    img = img.convert("RGB").crop((0, band[0], img.width, band[1]))
    if periodic:
        p, score = period(img, 1, 40, img.width // 3)
        n = max(1, img.width // p - 1)
        img = img.crop((p // 2, 0, p // 2 + n * p, img.height))
        print(f"   period {p}px (score {score:.2f}), using {n} periods")
    elif periodic is None:  # mirror: tile, flipped tile -> seamless with no ghosting
        m = img.transpose(Image.FLIP_LEFT_RIGHT)
        both = Image.new("RGB", (img.width * 2, img.height)); both.paste(img, (0, 0)); both.paste(m, (img.width, 0))
        img = both
    else:
        img = seam_blend(img, True, False)
    tw = img.width * out_h / img.height
    k = max(1, round(out_w / tw))
    tile = img.resize((out_w // k, out_h), resample)
    c = Image.new("RGB", (out_w, out_h))
    for i in range(k):
        c.paste(tile, (i * tile.width, 0))
    return c


def tile_texture(img, size, periodic=None, resample=L, count=None):
    img = img.convert("RGB")
    if periodic:
        lo, hi = periodic
        py, _ = period(img, 0, lo, hi)
        px, _ = period(img, 1, lo, hi)
        ny, nx = max(1, (img.height // 2) // py), max(1, (img.width // 2) // px)
        if count: nx = ny = count
        x0, y0 = img.width // 4, img.height // 4
        img = img.crop((x0, y0, x0 + nx * px, y0 + ny * py))
        print(f"   period {px}x{py}, using {nx}x{ny}")
    else:
        img = seam_blend(img)
    return img.resize((size, size), resample)


def nine_slice(img, size, border, resample=L):
    """Frame scaled to fill the square edge to edge; anything deeper than `border` px inside is cleared."""
    img = img.convert("RGBA").crop(alpha_bbox(img)).resize((size, size), resample)
    a = img.getchannel("A")
    ImageDraw.Draw(a).rectangle((border, border, size - border - 1, size - border - 1), fill=0)
    img.putalpha(a)
    return img


def window_9slice(img, size, top_keep, bottom_keep):
    """Square a wide pixel window: keep the title bar and bottom edge, stretch the plain middle rows."""
    img = img.convert("RGBA").crop(alpha_bbox(img))
    img = img.resize((size, round(img.height * size / img.width)), Image.NEAREST)
    h = img.height
    top = img.crop((0, 0, size, top_keep))
    bot = img.crop((0, h - bottom_keep, size, h))
    mid = img.crop((0, top_keep, size, h - bottom_keep)).resize((size, size - top_keep - bottom_keep), Image.NEAREST)
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    c.paste(top, (0, 0)); c.paste(mid, (0, top_keep)); c.paste(bot, (0, size - bottom_keep))
    return c


def frame_clean(img, min_sat=70):
    """Drop the grey haze some generations leave around a coloured frame: clear low-saturation pixels."""
    img = img.convert("RGBA")
    sat = img.convert("RGB").convert("HSV").getchannel("S").point(lambda v: 255 if v >= min_sat else 0)
    img.putalpha(ImageChops.multiply(img.getchannel("A"), sat))
    return img


def sticker_row(img, n, cell, pad=3, resample=L):
    """Split a row of n stickers on transparent gaps and centre each one in its own cell x cell square."""
    img = img.convert("RGBA")
    a = img.getchannel("A").point(lambda v: 255 if v > 12 else 0)
    cols = list(a.resize((a.width, 1), Image.BOX).get_flattened_data())
    segs, start = [], None
    for x, v in enumerate(cols + [0]):
        if v and start is None: start = x
        if not v and start is not None:
            segs.append((start, x)); start = None
    segs = sorted(sorted(segs, key=lambda s: s[1] - s[0])[-n:])  # n widest runs, left to right
    out = Image.new("RGBA", (cell * n, cell), (0, 0, 0, 0))
    for i, (x0, x1) in enumerate(segs):
        part = img.crop((x0, 0, x1, img.height))
        out.paste(fit_transparent(part, cell, cell, pad, resample), (i * cell, 0))
    return out


def calm_strip(img, leaf_band, out_w=1920, out_h=48, leaf_h=20, x0=400, x1=1500, feather=80):
    """Plain background from the raw's empty area, with a mirrored leaf band only between x0 and x1, on the bottom edge."""
    img = img.convert("RGB")
    bg = img.crop((0, 0, img.width, leaf_band[0] - 10)).resize((out_w, out_h), L)
    band = img.crop((0, leaf_band[0], img.width, leaf_band[1]))
    band = band.resize((round(band.width * leaf_h / band.height), leaf_h), L)
    m = band.transpose(Image.FLIP_LEFT_RIGHT)
    row = Image.new("RGB", (x1 - x0, leaf_h))
    for i in range(0, x1 - x0, band.width):
        row.paste(band if (i // band.width) % 2 == 0 else m, (i, 0))
    w = x1 - x0
    mask = Image.new("L", (w, 1))
    mask.putdata([int(255 * min(1, i / feather, (w - 1 - i) / feather)) for i in range(w)])
    bg.paste(row, (x0, out_h - leaf_h), mask.resize((w, leaf_h)))
    return bg


def character(img, w, h, resample=L):
    """Waist-up bust: scale the figure to the full height, centre it on its weight, bottom-aligned."""
    img = img.convert("RGBA").crop(alpha_bbox(img))
    img = img.resize((round(img.width * h / img.height), h), resample)
    cols = list(img.getchannel("A").resize((img.width, 1), Image.BOX).get_flattened_data())
    cx = round(sum(i * v for i, v in enumerate(cols)) / max(1, sum(cols)))
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    c.paste(img, (w // 2 - cx, 0), img)
    return c


def main(only):
    def want(p, n):
        return not only or f"{p}/{n}" in only

    def bd(p, n, w=1920, h=1080, r=L):
        if want(p, n) and (WORK / p / n / "raw.png").exists():
            save(cover(load(p, n).convert("RGB"), w, h, r), p, n); print("ok", p, n)

    for p in ["cozy", "neon", "minimal", "creator", "immersion", "access"]:
        bd(p, "backdrop-day"); bd(p, "backdrop-night")
    bd("maximal", "backdrop-day", 960, 540); bd("maximal", "backdrop-night", 960, 540)
    bd("creator", "thumbnail", 640, 400)

    strips = {
        # persona: (band rows in raw px, periodic pattern?)
        "cozy": (None, None),
        "neon": ("auto", True),
        "immersion": ((150, 285), True),
        "maximal": ("auto", True),
    }
    for p, (band, per) in strips.items():
        if not want(p, "topbar-strip"):
            continue
        img = load(p, "topbar-strip")
        if band is None:
            band = (0, img.height)
        elif band == "auto":
            g = img.convert("L")
            bg = sorted(g.crop((0, 0, g.width, 3)).getdata())[g.width * 3 // 2]  # top rows are background
            diff = g.point(lambda v: abs(v - bg)).resize((1, g.height), Image.BOX)
            rows = [y for y, v in enumerate(diff.getdata()) if v > 6]
            band = (max(0, rows[0] - 2), min(img.height, rows[-1] + 3))
            if p == "neon":  # thin glowing line: give it dark headroom above and below
                c = (band[0] + band[1]) // 2
                hh = max(band[1] - band[0], 40)
                band = (max(0, c - hh), min(img.height, c + hh))
        print(" ", p, "strip band", band)
        r = Image.NEAREST if p == "maximal" else L
        save(strip(img, band, periodic=per, resample=r), p, "topbar-strip"); print("ok", p, "topbar-strip")

    if want("minimal", "paper-tile"): save(tile_texture(load("minimal", "paper-tile"), 512), "minimal", "paper-tile")
    if want("immersion", "parchment-tile"): save(tile_texture(load("immersion", "parchment-tile"), 512), "immersion", "parchment-tile")
    if want("neon", "grid-tile"): save(tile_texture(load("neon", "grid-tile"), 64, periodic=(20, 400)), "neon", "grid-tile")
    if want("maximal", "dot-tile"): save(tile_texture(load("maximal", "dot-tile"), 16, periodic=(8, 200), resample=Image.BOX, count=2), "maximal", "dot-tile")

    for p, n, b in [("cozy", "frame-9slice", 32), ("neon", "hud-9slice", 32),
                    ("immersion", "gold-frame-9slice", 32), ("access", "thick-frame-9slice", 24)]:
        if want(p, n): save(nine_slice(load(p, n), 256, b), p, n); print("ok", p, n)
    if want("maximal", "window-9slice"):
        save(window_9slice(load("maximal", "window-9slice"), 192, 40, 16), "maximal", "window-9slice"); print("ok maximal window-9slice")

    if want("creator", "topbar-strip"): save(calm_strip(load("creator", "topbar-strip"), (603, 724)), "creator", "topbar-strip"); print("ok creator topbar-strip")
    if want("creator", "frame-9slice"): save(nine_slice(frame_clean(load("creator", "frame-9slice")), 96, 24), "creator", "frame-9slice"); print("ok creator frame-9slice")
    if want("creator", "stickers"): save(sticker_row(load("creator", "stickers"), 4, 64), "creator", "stickers"); print("ok creator stickers")
    if want("immersion", "char-seraphine"): save(character(load("immersion", "char-seraphine"), 420, 640), "immersion", "char-seraphine"); print("ok immersion char-seraphine")
    if want("cozy", "stickers"): save(fit_transparent(load("cozy", "stickers"), 512, 128, 4), "cozy", "stickers")
    if want("maximal", "stickers"): save(fit_transparent(load("maximal", "stickers"), 512, 128, 4, Image.NEAREST), "maximal", "stickers")
    if want("immersion", "dialogue-box"): save(fit_transparent(load("immersion", "dialogue-box"), 1200, 300, 0), "immersion", "dialogue-box")


if __name__ == "__main__":
    main(set(sys.argv[1:]))
