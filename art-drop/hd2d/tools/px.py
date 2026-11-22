#!/usr/bin/env python3
"""Pixel-art helpers for the HD-2D job.

  px.py quant IN OUT --size WxH --ramps stone[,leaf] [--alpha] [--outline]
      Nearest-neighbour (box-averaged) downscale to WxH, quantise to the named ramps
      (perceptual nearest), despeckle lone pixels. --alpha keeps transparency (alpha < 128 -> clear);
      --outline adds the #24161f 1 px outline around opaque pixels.
  px.py check FILE [FILE...]   size, colour count, off-palette pixels, lone-pixel %, seam score
  px.py tile4 FILE             writes FILE-2x2x4.png (2x2 tiling at 4x) for viewing
  px.py zoom FILE N            writes FILE-xN.png
  px.py sheet OUT DIR...       contact sheet: each png at 1x and 4x, textures tiled 2x2
"""
import json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAMPS = json.load(open(os.path.join(HERE, "ramps.json")))
OUTLINE = (0x24, 0x16, 0x1f)
NON_TILE = {"leafcard"}


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


ALL = {hexrgb(c) for r in RAMPS.values() for c in r}


def pal(names):
    return [hexrgb(c) for n in names for c in RAMPS[n]]


def dist(a, b):
    # redmean perceptual distance
    rm = (a[0] + b[0]) / 2
    dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
    return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db


def nearest(c, p, cache):
    if c not in cache:
        cache[c] = min(p, key=lambda q: dist(c, q))
    return cache[c]


def lone_pixels(img, wrap):
    w, h = img.size
    px = img.load()
    n = tot = 0
    for y in range(h):
        for x in range(w):
            c = px[x, y]
            if len(c) == 4 and c[3] == 0:
                continue
            tot += 1
            same = False
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if wrap:
                    nx %= w; ny %= h
                elif not (0 <= nx < w and 0 <= ny < h):
                    continue
                if px[nx, ny] == c:
                    same = True; break
            if not same:
                n += 1
    return n, tot


def despeckle(img, wrap, passes=2):
    w, h = img.size
    for _ in range(passes):
        src = img.copy(); sp = src.load(); dp = img.load()
        for y in range(h):
            for x in range(w):
                c = sp[x, y]
                if len(c) == 4 and c[3] == 0:
                    continue
                nb = []
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if wrap:
                        nx %= w; ny %= h
                    elif not (0 <= nx < w and 0 <= ny < h):
                        continue
                    nb.append(sp[nx, ny])
                if nb and c not in nb:
                    opaque = [q for q in nb if len(q) < 4 or q[3]]
                    if not opaque:
                        continue
                    best = max(set(opaque), key=opaque.count)
                    if opaque.count(best) >= 3:  # only replace true islands
                        dp[x, y] = best
    return img


def quant(args):
    inp, out = args[0], args[1]
    opts = dict(zip(args[2::2], args[3::2])) if False else {}
    size = None; ramps = None; alpha = "--alpha" in args; outline = "--outline" in args
    for i, a in enumerate(args):
        if a == "--size": size = tuple(int(v) for v in args[i + 1].split("x"))
        if a == "--ramps": ramps = args[i + 1].split(",")
    p = pal(ramps)
    im = Image.open(inp).convert("RGBA")
    im = im.resize(size, Image.BOX)
    cache = {}
    px = im.load()
    for y in range(size[1]):
        for x in range(size[0]):
            r, g, b, a = px[x, y]
            if alpha and a < 128:
                px[x, y] = (0, 0, 0, 0)
            else:
                px[x, y] = nearest((r, g, b), p, cache) + (255,)
    name = os.path.splitext(os.path.basename(out))[0]
    im = despeckle(im, wrap=not alpha and name not in NON_TILE)
    if outline:
        add_outline(im)
    if not alpha:
        im = im.convert("RGB")
    im.save(out)
    print("wrote", out)


def add_outline(im):
    w, h = im.size
    src = im.copy(); sp = src.load(); dp = im.load()
    for y in range(h):
        for x in range(w):
            if sp[x, y][3]:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and sp[nx, ny][3]:
                    dp[x, y] = OUTLINE + (255,); break


def seam(img):
    """Mean colour jump across the wrap edges vs. inside; ~1 is seamless, >>1 is a visible seam."""
    im = img.convert("RGB"); w, h = im.size; px = im.load()
    def d(a, b): return sum(abs(a[i] - b[i]) for i in range(3))
    edge = [d(px[w - 1, y], px[0, y]) for y in range(h)] + [d(px[x, h - 1], px[x, 0]) for x in range(w)]
    inner = [d(px[w // 2 - 1, y], px[w // 2, y]) for y in range(h)] + [d(px[x, h // 2 - 1], px[x, h // 2]) for x in range(w)]
    return (sum(edge) / len(edge) + 1) / (sum(inner) / len(inner) + 1)


def check(files):
    for f in files:
        im = Image.open(f).convert("RGBA")
        name = os.path.splitext(os.path.basename(f))[0]
        cols = {c[:3] for c in im.get_flattened_data() if c[3]}
        off = [c for c in cols if c not in ALL and c != OUTLINE]
        semi = sum(1 for c in im.get_flattened_data() if 0 < c[3] < 255)
        sprite = "sprites" in f
        wrap = not sprite and name not in NON_TILE
        n, tot = lone_pixels(im, wrap)
        line = f"{f}: {im.size[0]}x{im.size[1]} colours={len(cols)} off_palette={len(off)} semi_alpha={semi} lone={100*n/max(tot,1):.1f}%"
        if wrap:
            line += f" seam={seam(im):.2f}"
        if sprite:
            bb = im.getbbox()
            line += f" bbox={bb} w={bb[2]-bb[0]} h={bb[3]-bb[1]} on_bottom={bb[3]==im.size[1]}"
        print(line)


def tile4(f, scale=4):
    im = Image.open(f).convert("RGBA"); w, h = im.size
    t = Image.new("RGBA", (w * 2, h * 2))
    for i in range(2):
        for j in range(2):
            t.paste(im, (i * w, j * h))
    t = t.resize((w * 2 * scale, h * 2 * scale), Image.NEAREST)
    out = os.path.splitext(f)[0] + f"-2x2x{scale}.png"
    t.save(out); print("wrote", out)


def zoom(f, n):
    im = Image.open(f); out = os.path.splitext(f)[0] + f"-x{n}.png"
    im.resize((im.size[0] * n, im.size[1] * n), Image.NEAREST).save(out); print("wrote", out)


def sheet(out, dirs):
    files = []
    for d in dirs:
        files += sorted(os.path.join(d, f) for f in os.listdir(d) if f.endswith(".png") and "-x" not in f and "-2x2" not in f)
    rows = []
    for f in files:
        im = Image.open(f).convert("RGBA"); w, h = im.size
        name = os.path.splitext(os.path.basename(f))[0]
        parts = [im, im.resize((w * 4, h * 4), Image.NEAREST)]
        if "sprites" not in f and name not in NON_TILE:
            t = Image.new("RGBA", (w * 2, h * 2))
            for i in range(2):
                for j in range(2):
                    t.paste(im, (i * w, j * h))
            k = 4 if w <= 64 else 2
            parts.append(t.resize((w * 2 * k, h * 2 * k), Image.NEAREST))
        rows.append(parts)
    pad = 8
    W = max(sum(p.size[0] for p in r) + pad * (len(r) + 1) for r in rows)
    H = sum(max(p.size[1] for p in r) + pad for r in rows) + pad
    bg = Image.new("RGBA", (W, H), (0x40, 0x3c, 0x44, 255))
    y = pad
    for r in rows:
        x = pad
        for p in r:
            bg.alpha_composite(p, (x, y)); x += p.size[0] + pad
        y += max(p.size[1] for p in r) + pad
    bg.convert("RGB").save(out); print("wrote", out, bg.size)


if __name__ == "__main__":
    cmd, rest = sys.argv[1], sys.argv[2:]
    if cmd == "quant": quant(rest)
    elif cmd == "check": check(rest)
    elif cmd == "tile4": tile4(rest[0])
    elif cmd == "zoom": zoom(rest[0], int(rest[1]))
    elif cmd == "sheet": sheet(rest[0], rest[1:])
    else: print(__doc__)
