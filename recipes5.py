"""Round 5 recipes (process5.py runs these). Each returns the final image at the exact requested size."""
from PIL import Image, ImageChops, ImageDraw, ImageFilter
import process as P
from process4 import raw, opaque, wrap_particles, pixelize, up, split_row, hexc, L, NN


def corner_bg(img):
    cs = [img.getpixel(p) for p in [(3, 3), (img.width - 4, 3), (3, img.height - 4), (img.width - 4, img.height - 4)]]
    return tuple(sorted(c[i] for c in cs)[1] for i in range(3))


def key_half(half, thr=28, soft=28):
    """Alpha from the half's own flat backdrop colour (sampled at its corners).
    Only backdrop CONNECTED to the border goes: light fills inside the outline (same tone as the backdrop) stay."""
    rgb = half.convert("RGB")
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, corner_bg(rgb))).convert("L")
    a = diff.point(lambda v: 0 if v < thr else 255 if v > thr + soft else int(255 * (v - thr) / soft))
    m = a.point(lambda v: 255 if v > 0 else 0)
    w, h = m.size
    for x, y in [(x, 0) for x in range(0, w, 4)] + [(x, h - 1) for x in range(0, w, 4)] + [(0, y) for y in range(0, h, 4)] + [(w - 1, y) for y in range(0, h, 4)]:
        if m.getpixel((x, y)) == 0:
            ImageDraw.floodfill(m, (x, y), 128)
    inside = m.point(lambda v: 0 if v == 128 else 255)
    a = ImageChops.lighter(a, inside.filter(ImageFilter.MinFilter(3)))
    out = rgb.convert("RGBA"); out.putalpha(a)
    return out


def avatar_sheet(k, bgs, fill, grid=None):
    """512x256: two subjects, each recentred on its own exact 256x256 flat square.
    grid=64 makes each half crisp pixel art (64x64 art grid upscaled 4x)."""
    src = raw(k).convert("RGB")
    w = src.width // 2
    keyed = Image.new("RGBA", src.size)
    keyed.paste(key_half(src.crop((0, 0, w, src.height))), (0, 0))
    keyed.paste(key_half(src.crop((w, 0, src.width, src.height))), (w, 0))
    subs = split_row(keyed, 2)
    out = Image.new("RGB", (512, 256))
    for i, (sub, bg) in enumerate(zip(subs, bgs)):
        sub = sub.crop(P.alpha_bbox(sub, 40))
        n = grid or 256
        s = fill * n / max(sub.size)
        sub = sub.resize((max(1, round(sub.width * s)), max(1, round(sub.height * s))), NN if grid else L)
        if grid:  # nearest from the already-pixel raw: hard edges, no box blur of the 1-px outline
            sub = sub.resize((max(1, round(sub.width)), max(1, round(sub.height))), NN)
            sub.putalpha(sub.getchannel("A").point(lambda v: 255 if v > 127 else 0))
        c = Image.new("RGB", (n, n), hexc(bg))
        c.paste(sub, ((n - sub.width) // 2, (n - sub.height) // 2), sub)
        if grid:
            c = up(c, 256 // grid)
        out.paste(c, (256 * i, 0))
    return out


def pixel_backdrop(k, w, h, px=3, colours=32):
    img = opaque(raw(k), w, h)
    art = pixelize(img, w // px, h // px, colours)
    return up(art, px).crop((0, 0, w, h)).convert("RGB")


def petals():
    img = raw("maximal/petals-gutter").convert("RGBA")
    if img.getchannel("A").getextrema()[0] >= 250:
        img = key_half(img, 24, 24)
    img = wrap_particles(P.cover(img, 512, 512), 512)  # drop edge-cut petals: tiles with nothing sliced
    art = up(pixelize(img, 128, 128, 6, alpha=True), 4)
    # the raw's 3 edge-cut petals were dropped (not seamless); add 2 mirrored copies of whole ones in empty space
    # so the tile keeps 8 petals and nothing crosses an edge
    for box, at in [((208, 248, 248, 296), (440, 300)), ((64, 352, 108, 392), (224, 452))]:
        art.alpha_composite(art.crop(box).transpose(Image.FLIP_LEFT_RIGHT), at)
    return art


RECIPES = {
    "neon/backdrop-night-portrait": lambda: opaque(raw("neon/backdrop-night-portrait"), 1290, 2796),
    "neon/backdrop-day-portrait": lambda: opaque(raw("neon/backdrop-day-portrait"), 1290, 2796),
    "maximal/avatar-defaults": lambda: avatar_sheet("maximal/avatar-defaults", ["#FFF6FA", "#FBE3EF"], 0.70, grid=64),
    "maximal/petals-gutter": petals,
    "maximal/backdrop-day-portrait": lambda: pixel_backdrop("maximal/backdrop-day-portrait", 1170, 2532),
    "maximal/backdrop-night-portrait": lambda: pixel_backdrop("maximal/backdrop-night-portrait", 1170, 2532),
    "creator/avatar-defaults": lambda: avatar_sheet("creator/avatar-defaults", ["#F6ECDC", "#EFE2CC"], 0.65),
    "immersion/avatar-defaults": lambda: avatar_sheet("immersion/avatar-defaults", ["#3A2618", "#2B1D14"], 0.65),
}
