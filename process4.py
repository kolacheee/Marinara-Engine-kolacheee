#!/usr/bin/env python3
"""Round 4: turn work/<persona>/<name>/raw.png into images/<persona>/<name>.png at the exact requested size.

usage: process4.py [persona/name ...]   (recipes live in recipes.py)
Helpers shared with round 3 come from process.py.
"""
import math, random, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter
import process as P

ROOT = P.ROOT
WORK, OUT = P.WORK, P.OUT
L, NN = Image.LANCZOS, Image.NEAREST


def hexc(s):
    s = s.lstrip("#"); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def raw(k):
    return Image.open(WORK / k / "raw.png")


def save(img, k):
    p, n = k.split("/")
    P.save(img, p, n)
    print("ok", k, img.size, img.mode)


# ---------- generic shapes ----------

def opaque(img, w, h):
    return P.cover(img.convert("RGB"), w, h)


def edges_match(img, xs=True, ys=True, tol=4):
    g = img.convert("L"); w, h = g.size
    def mean_diff(a, b):
        d = ImageChops.difference(a, b); return sum(d.get_flattened_data()) / (d.width * d.height)
    ok = True
    if xs: ok &= mean_diff(g.crop((0, 0, 1, h)), g.crop((w - 1, 0, w, h))) < tol
    if ys: ok &= mean_diff(g.crop((0, 0, w, 1)), g.crop((0, h - 1, w, h))) < tol
    return ok


def seamless(img, w, h, xs=True, ys=True):
    if img.size == (w, h) and edges_match(img, xs, ys):
        return img.convert("RGB")  # Codex already delivered an exact-size seamless tile: no blend ghosting
    return P.seam_blend(P.cover(img.convert("RGB") if img.mode != "RGBA" else img, w, h), xs, ys)


def place(img, w, h, pad=0, anchor="center", resample=L):
    """Alpha-crop and fit inside w x h with `pad` margin; anchor center | topleft | bottom."""
    img = img.convert("RGBA")
    img = img.crop(P.alpha_bbox(img))
    s = min((w - 2 * pad) / img.width, (h - 2 * pad) / img.height)
    img = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), resample)
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    if anchor == "topleft":
        xy = (pad, pad)
    elif anchor == "bottom":
        xy = ((w - img.width) // 2, h - img.height)
    else:
        xy = ((w - img.width) // 2, (h - img.height) // 2)
    c.paste(img, xy, img)
    return c


def key_out(img, thr=24, soft=24):
    """Real alpha from a flat backdrop: colour sampled at the corners, distance-keyed with a soft edge."""
    img = img.convert("RGBA")
    if img.getchannel("A").getextrema()[0] < 250:
        return img  # already has alpha
    rgb = img.convert("RGB")
    cs = [rgb.getpixel(p) for p in [(2, 2), (rgb.width - 3, 2), (2, rgb.height - 3), (rgb.width - 3, rgb.height - 3)]]
    bg = tuple(sorted(c[i] for c in cs)[1] for i in range(3))
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, bg)).convert("L")
    a = diff.point(lambda v: 0 if v < thr else 255 if v > thr + soft else int(255 * (v - thr) / soft))
    img.putalpha(a)
    return img


def wrap_particles(img, size):
    """Seamless particle tile: drop any particle the raw's border cut, so nothing is sliced at the wrap."""
    img = img.convert("RGBA").resize((size, size), L)
    a = img.getchannel("A")
    m = a.point(lambda v: 255 if v > 4 else 0)
    w, h = m.size
    px = m.load()
    seen = set()
    for x0, y0 in [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]:
        if px[x0, y0] and (x0, y0) not in seen:
            ImageDraw.floodfill(m, (x0, y0), 128)  # mark border-touching blobs
            seen.add((x0, y0))
    kill = m.point(lambda v: 0 if v == 128 else 255).filter(ImageFilter.MinFilter(5))
    img.putalpha(ImageChops.multiply(a, kill))
    return img


def recolour(img, pairs):
    """Map each pixel to the target of its nearest source colour, keeping alpha and the luminance offset."""
    img = img.convert("RGBA")
    src = [hexc(s) for s, _ in pairs]; dst = [hexc(d) for _, d in pairs]
    out = Image.new("RGBA", img.size)
    ip, op = img.load(), out.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = ip[x, y]
            if a == 0:
                op[x, y] = (0, 0, 0, 0); continue
            i = min(range(len(src)), key=lambda i: sum((c - s) ** 2 for c, s in zip((r, g, b), src[i])))
            d = (r + g + b - sum(src[i])) / 3 * 0.6  # keep a little of the painted shading
            op[x, y] = tuple(max(0, min(255, round(c + d))) for c in dst[i]) + (a,)
    return out


# ---------- pixel art ----------

def pixelize(img, gw, gh, colours, alpha=False):
    """Down to a gw x gh art grid, at most `colours` flat colours, hard alpha."""
    img = img.convert("RGBA")
    small = img.resize((gw, gh), Image.BOX)
    a = small.getchannel("A").point(lambda v: 255 if v > 127 else 0)
    rgb = small.convert("RGB").quantize(colours, Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    out = rgb.convert("RGBA")
    if alpha:
        out.putalpha(a)
    return out


def up(img, k):
    return img.resize((img.width * k, img.height * k), NN)


def pixel_sprite(img, grid, margin, colours, scale, anchor="center"):
    """One sprite onto a grid x grid art canvas with `margin` art px clear, upscaled by `scale`."""
    img = img.convert("RGBA").crop(P.alpha_bbox(img))
    n = grid - 2 * margin
    s = min(n / img.width, n / img.height)
    w, h = max(1, round(img.width * s)), max(1, round(img.height * s))
    art = pixelize(img.resize((w * 8, h * 8), L), w, h, colours, alpha=True)
    c = Image.new("RGBA", (grid, grid), (0, 0, 0, 0))
    xy = (margin, margin) if anchor == "topleft" else ((grid - w) // 2, (grid - h) // 2)
    c.paste(art, xy, art)
    return up(c, scale)


def split_row(img, n):
    """Split a row of n sprites on transparent columns; the n widest runs, left to right."""
    img = img.convert("RGBA")
    a = img.getchannel("A").point(lambda v: 255 if v > 12 else 0)
    cols = list(a.resize((a.width, 1), Image.BOX).getdata())
    segs, start = [], None
    for x, v in enumerate(cols + [0]):
        if v and start is None: start = x
        if not v and start is not None: segs.append((start, x)); start = None
    segs = sorted(sorted(segs, key=lambda s: s[1] - s[0])[-n:])
    return [img.crop((x0, 0, x1, img.height)) for x0, x1 in segs]


# ---------- drawn exactly (spec is pixel-exact; the Codex raw stays in work/ for reference) ----------

HEART7 = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."]


def maximal_taskbar():
    """512x48 art grid x2: flat pink, 1-px checker dither, 2 faint hearts, highlight/shadow/plum lines."""
    g = Image.new("RGB", (512, 48), hexc("#F4C6D7"))
    d = g.load()
    for y in range(2, 45):
        for x in range(512):
            if (x + y) % 2 == 0: d[x, y] = hexc("#F0BBD0")
    for y in (0, 1): [d.__setitem__((x, y), hexc("#FFF6FA")) for x in range(512)]
    for y in (45, 46): [d.__setitem__((x, y), hexc("#C98AA6")) for x in range(512)]
    for x in range(512): d[x, 47] = hexc("#4A2340")
    for hx in (120, 380):
        for j, row in enumerate(HEART7):
            for i, ch in enumerate(row):
                if ch == "X": d[hx - 3 + i, 20 + j] = hexc("#E8A9C3")
    return up(g, 2)


def hills_silhouette(img, top_min, top_max, seed=4):
    """Give a band of painted hills a rolling, seamless top edge (periodic over the width)."""
    img = img.convert("RGBA")
    w, h = img.size
    rnd = random.Random(seed)
    waves = [(k, rnd.uniform(0, 2 * math.pi), 1 / k) for k in (1, 2, 3, 5)]
    S = 4  # draw the edge at 4x, then box-downsample: smooth anti-aliased curve, no stair steps
    a = Image.new("L", (w * S, h * S), 0)
    pts = []
    for X in range(w * S + 1):
        v = sum(amp * math.sin(2 * math.pi * k * X / (w * S) + ph) for k, ph, amp in waves) / sum(1 / k for k, _, _ in waves)
        pts.append((X, (top_min + (top_max - top_min) * (v + 1) / 2) * S))
    ImageDraw.Draw(a).polygon(pts + [(w * S, h * S), (0, h * S)], fill=255)
    a = a.resize((w, h), Image.BOX)
    img.putalpha(ImageChops.multiply(img.getchannel("A"), a))
    return img


def run(only):
    from recipes import RECIPES
    for k, f in RECIPES.items():
        if only and k not in only:
            continue
        if not (WORK / k / "raw.png").exists() and not getattr(f, "drawn", False):
            print("skip (no raw)", k); continue
        save(f(), k)


if __name__ == "__main__":
    run(set(sys.argv[1:]))
