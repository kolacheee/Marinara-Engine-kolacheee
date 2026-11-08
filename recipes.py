"""Per-image recipes for round 4 (process4.py runs these). Each returns the final image at the exact size."""
from PIL import Image, ImageChops
import process as P
from process4 import (raw, opaque, seamless, place, key_out, wrap_particles, recolour, pixelize, up,
                      pixel_sprite, split_row, maximal_taskbar, hills_silhouette, NN, L)


def drawn(f):
    f.drawn = True
    return f


def bd(k, w=2560, h=1440):
    return lambda: opaque(raw(k), w, h)


def alpha_scale(img, k):
    img = img.copy(); img.putalpha(img.getchannel("A").point(lambda v: round(v * k))); return img


ACC_DAY = [("#C9D6C4", "#24324A"), ("#A9BFA2", "#1C283B")]


def horizon_day():
    img = raw("access/horizon-strip-day").convert("RGBA")
    band = img.crop((0, P.alpha_bbox(img)[1], img.width, img.height)).resize((1600, 34), L)
    band = P.seam_blend(band, True, False)
    c = Image.new("RGBA", (1600, 112), (0, 0, 0, 0)); c.paste(band, (0, 78))
    return hills_silhouette(c, 78, 92)


def horizon_night():
    # the night twin is the day silhouette recoloured, so the shapes match pixel for pixel
    day = Image.open(P.OUT / "access" / "horizon-strip-day.png")
    n = recolour(day, ACC_DAY)
    a = n.getchannel("A"); px = n.load(); ap = a.load()
    for x in range(n.width):  # 1 px faint rim on the top edge
        for y in range(n.height):
            if ap[x, y] > 128:
                px[x, y] = (0x3A, 0x4E, 0x6B, ap[x, y]); break
    return n


def sprig_day():
    return place(raw("access/sprig-day"), 256, 256, pad=31)


def sprig_night():
    day = Image.open(P.OUT / "access" / "sprig-day.png")
    return recolour(day, [("#2F6B5E", "#8FC9BE"), ("#C98A1B", "#F2B84B")])


def seraphine():
    img = raw("immersion/char-seraphine").convert("RGBA")
    img = img.crop(P.alpha_bbox(img))
    W, H = 1024, 1792
    top = round(0.04 * H)
    s = (H - top) / img.height
    img = img.resize((round(img.width * s), H - top), L)
    if img.width > W * 0.9:
        s2 = W * 0.9 / img.width; img = img.resize((round(img.width * s2), round(img.height * s2)), L)
    cols = list(img.getchannel("A").resize((img.width, 1), Image.BOX).getdata())
    cx = round(sum(i * v for i, v in enumerate(cols)) / max(1, sum(cols)))
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    c.paste(img, (W // 2 - cx, H - img.height), img)
    return c


def paper_tile():
    from PIL import ImageStat
    g = seamless(raw("cozy/paper-tile"), 512, 512).convert("L")
    st = ImageStat.Stat(g); m, sd = st.mean[0], max(1e-6, st.stddev[0])
    k = 1.6 / sd  # ~ +/-4 levels around the base: inside a 4% luminance range
    chans = [g.point(lambda v, b=b: round(b + max(-2.5, min(2.5, (v - m) / sd)) * 1.6)) for b in (0xFB, 0xF6, 0xEC)]
    return Image.merge("RGB", chans)


def walnut():
    return seamless(raw("immersion/panel-walnut"), 512, 1024)


RECIPES = {
    "minimal/game-stage": drawn(lambda: Image.open(P.OUT / "minimal" / "game-stage.png")),  # drawn by draw_minimal.py
    "access/backdrop-day": bd("access/backdrop-day"),
    "access/backdrop-night": bd("access/backdrop-night"),
    "access/horizon-strip-day": horizon_day,
    "access/horizon-strip-night": drawn(horizon_night),
    "access/sprig-day": sprig_day,
    "access/sprig-night": drawn(sprig_night),
    "immersion/backdrop-night": bd("immersion/backdrop-night"),
    "immersion/backdrop-day": bd("immersion/backdrop-day"),
    "immersion/char-seraphine": seraphine,
    "immersion/panel-walnut": walnut,
    "immersion/ambient-motes": lambda: wrap_particles(key_out(raw("immersion/ambient-motes")), 1024),
    "immersion/icon-send": lambda: place(key_out(raw("immersion/icon-send")), 256, 256, pad=24),
    "immersion/cursor-quill": lambda: place(key_out(raw("immersion/cursor-quill")), 64, 64, pad=2, anchor="topleft"),
    "immersion/wax-seal": lambda: place(key_out(raw("immersion/wax-seal")), 160, 160, pad=10),
    "creator/backdrop-day-v2": bd("creator/backdrop-day-v2"),
    "creator/backdrop-night-v2": bd("creator/backdrop-night-v2"),
    "creator/ambient-leaves": lambda: wrap_particles(key_out(raw("creator/ambient-leaves")), 1024),
    "creator/frame-card": lambda: P.nine_slice(key_out(raw("creator/frame-card")), 192, 32),
    "creator/topbar-band-day": lambda: seamless(raw("creator/topbar-band-day"), 2880, 96, True, False),
    "creator/topbar-band-night": lambda: seamless(raw("creator/topbar-band-night"), 2880, 96, True, False),
    "creator/sidebar-foot": lambda: place(key_out(raw("creator/sidebar-foot")), 720, 560, anchor="bottom"),
    "creator/cursor-leaf": lambda: place(key_out(raw("creator/cursor-leaf")), 64, 64, pad=2, anchor="topleft"),
    "cozy/backdrop-day": bd("cozy/backdrop-day"),
    "cozy/backdrop-night": bd("cozy/backdrop-night"),
    "cozy/topbar-strip": lambda: seamless(raw("cozy/topbar-strip"), 2560, 56, True, False),
    "cozy/frame-9slice": lambda: P.nine_slice(key_out(raw("cozy/frame-9slice")), 384, 48),
    "cozy/washi-tape": lambda: alpha_scale(place(key_out(raw("cozy/washi-tape")), 360, 64, pad=2), 0.85),
    "cozy/sprigs": lambda: P.sticker_row(key_out(raw("cozy/sprigs")), 4, 256, pad=24),
    "cozy/paper-tile": paper_tile,
    "neon/backdrop-night": bd("neon/backdrop-night"),
    "neon/backdrop-day": bd("neon/backdrop-day"),
    "neon/rain-tile": lambda: wrap_particles(key_out(raw("neon/rain-tile")), 512),
    "neon/backdrop-game": bd("neon/backdrop-game"),
    "neon/topbar-strip": lambda: seamless(raw("neon/topbar-strip"), 2560, 96, True, False),
    "maximal/backdrop-day": lambda: up(pixelize(P.cover(raw("maximal/backdrop-day").convert("RGB"), 1920, 1080), 480, 270, 12), 4).convert("RGB"),
    "maximal/backdrop-night": lambda: up(pixelize(P.cover(raw("maximal/backdrop-night").convert("RGB"), 1920, 1080), 480, 270, 12), 4).convert("RGB"),
    "maximal/topbar-strip": drawn(maximal_taskbar),
    "maximal/emblem": lambda: pixel_sprite(key_out(raw("maximal/emblem")), 64, 4, 8, 8),
}
