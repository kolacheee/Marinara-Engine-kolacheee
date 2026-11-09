"""Round 6 recipes (process6.py runs these). Each returns the final image at the exact requested size."""
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from process4 import raw, opaque, up, hexc, L, NN
import process as _P

P_OUT = _P.OUT  # set by process6.py before this module is imported


def sun_print():
    """Exact semicircle (centre bottom, r = 600) masked from the printed raw's ink texture."""
    src = raw("minimal/sun-print").convert("RGBA")
    a = src.getchannel("A")
    if a.getextrema()[0] >= 250:  # opaque raw: ink = strongly red pixels
        r, g, b = src.convert("RGB").split()
        a = ImageChops.subtract(r, g).point(lambda v: 255 if v > 60 else 0)
    box = a.point(lambda v: 255 if v > 128 else 0).getbbox()
    ink = src.convert("RGB").crop(box).resize((1200, 600), L)
    ss = 4  # supersampled mask: crisp but not jagged
    m = Image.new("L", (1200 * ss, 600 * ss), 0)
    ImageDraw.Draw(m).ellipse((0, 0, 1200 * ss - 1, 1200 * ss - 1), fill=255)
    m = m.resize((1200, 600), Image.BOX)
    # keep only the print texture's lightness variation (from the raw's interior, so its misaligned rim is not used),
    # re-centred on the spec ink #E10600
    import random
    rnd = random.Random(6)
    tex = src.convert("L").crop((box[0] + (box[2] - box[0]) // 4, box[1] + (box[3] - box[1]) // 3,
                                  box[2] - (box[2] - box[0]) // 4, box[3]))
    lum = tex.resize((1200, 600), L)
    mean = sum(i * c for i, c in enumerate(lum.histogram())) / (1200 * 600)
    grain = Image.effect_noise((1200, 600), 10).point(lambda v: v - 128 + int(mean))  # fine even ink grain
    lum = ImageChops.blend(lum, grain, 0.5)
    sp = ImageDraw.Draw(lum)
    for _ in range(140):  # a few lighter speckles where the ink did not fully cover
        x, y, rr = rnd.uniform(40, 1160), rnd.uniform(60, 590), rnd.choice([0.8, 1, 1.4, 2])
        sp.ellipse((x - rr, y - rr, x + rr, y + rr), fill=int(mean + rnd.uniform(18, 40)))
    base = Image.new("RGB", (1200, 600), hexc("#E10600"))
    up_ = Image.merge("RGB", [lum.point(lambda v: max(0, int((v - mean) * 1.2)))] * 3)
    dn_ = Image.merge("RGB", [lum.point(lambda v: max(0, int((mean - v) * 1.2)))] * 3)
    out = ImageChops.subtract(ImageChops.add(base, up_), dn_)
    # hairline of darker ink build-up just inside the curve (not along the flat horizon)
    inner = m.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1))
    rim = ImageChops.subtract(m, inner)
    rim.paste(0, (0, 596, 1200, 600))
    dark = Image.new("RGB", (1200, 600), hexc("#B40500"))
    out = Image.composite(dark, out, rim.point(lambda v: int(v * 0.6)))
    out = out.convert("RGBA"); out.putalpha(m)
    return out


def pixel_backdrop(k, w, h, px, colours=96):
    img = opaque(raw(k), w, h)
    art = img.resize((w // px, h // px), NN)  # nearest: keeps single lit windows
    # flat colours, no anti-aliased edge tints; no dither, so the sky steps in near-identical bands, not a checkerboard
    art = art.quantize(colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    return up(art, px).crop((0, 0, w, h)).convert("RGB")


def patch_from_below(img, box, dy, feather=14):
    """Cover box with the same columns dy px lower (clean wall), feathered so no seam shows."""
    x0, y0, x1, y1 = box
    src = img.crop((x0, y0 + dy, x1, y1 + dy))
    m = Image.new("L", src.size, 0)
    ImageDraw.Draw(m).rectangle((feather, feather, src.width - feather, src.height - feather), fill=255)
    img.paste(src, (x0, y0), m.filter(ImageFilter.GaussianBlur(feather / 2)))
    return img


def cozy_day():
    # the ivy tail reached 30% down; the brief caps it at 22%: the two lowest leaves are painted out with clean wall
    return patch_from_below(opaque(raw("cozy/backdrop-day"), 2560, 1440), (2290, 296, 2460, 450), 170)


LANTERN = (2198, 1148)  # access: centre of the lantern glass in the final 2560x1440 day image
GLASS = (2184, 1132, 2214, 1164)


def access_day():
    img = opaque(raw("access/backdrop-day"), 2560, 1440)
    # the raw put a warm bright spot in the glass; the brief says clear glass, no glow: flatten it to #e9e2cf
    g = img.crop(GLASS)
    flat = Image.new("RGB", g.size, hexc("#e9e2cf"))
    m = g.convert("L").point(lambda v: 180 if v > 200 else 0)
    img.paste(Image.composite(flat, g, m), GLASS[:2])
    return img


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def access_night():
    """Night relight of the final day image, pixel for pixel (the Codex night twin drifted: bigger tree, new clouds).
    Sky above the per-column horizon -> #121826..#1b2740 gradient (clouds kept as faint lifts); land and anything
    standing in the sky (post, lantern, tree) -> a #0e131d..#2b3850 ramp on the day lightness."""
    import random
    day = Image.open(P_OUT / "access/backdrop-day.png").convert("RGB")
    W, H = day.size
    px = day.load()
    lum = day.convert("L").load()
    # per-column horizon: first row of a 6-row run of green land
    def green(c):
        return c[1] - (c[0] + c[2]) / 2
    hor = []
    for x in range(W):
        run = 0; y0 = H
        for y in range(600, H):
            run = run + 1 if green(px[x, y]) > 9 else 0
            if run >= 6:
                y0 = y - 5; break
        hor.append(y0)
    hor = [sorted(hor[max(0, x - 6):x + 7])[len(hor[max(0, x - 6):x + 7]) // 2] for x in range(W)]  # median
    sky_top, sky_hor = hexc("#121826"), hexc("#1b2740")
    ramp = [hexc("#0e131d"), hexc("#1a2335"), hexc("#222e44"), hexc("#2b3850")]
    # row median of the day sky, to find what stands in it and to keep cloud lifts
    med = []
    for y in range(H):
        row = sorted(lum[x, y] for x in range(0, W, 16) if y < hor[x])
        med.append(row[len(row) // 2] if row else 230)
    out = Image.new("RGB", (W, H)); o = out.load()
    for y in range(H):
        base = lerp(sky_top, sky_hor, min(1, y / 1040))
        for x in range(W):
            L_ = lum[x, y]
            if y < hor[x] and abs(L_ - med[y]) < 22:
                d = (L_ - med[y]) * 0.35
                o[x, y] = tuple(max(0, min(255, round(c + d))) for c in base)
            else:
                t = max(0.0, min(1.0, (L_ - 95) / 135)) ** 1.15 * 3
                i = min(2, int(t))
                o[x, y] = lerp(ramp[i], ramp[i + 1], t - i)
    rnd = random.Random(61)
    d = ImageDraw.Draw(out)
    for _ in range(42):  # faint stars, top 25% only
        x, y = rnd.randrange(20, W - 20), rnd.randrange(12, 360)
        c = lerp(sky_top, hexc("#dfe6f5"), rnd.uniform(0.35, 0.8))
        r = rnd.choice([0.8, 1.1, 1.5])
        d.ellipse((x - r, y - r, x + r, y + r), fill=c)
    # the lantern is lit: flame in the glass, a soft #f2b84b glow (25% at the centre, gone within 3% of the width)
    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    cx, cy = LANTERN
    R = int(0.03 * W)
    for r in range(R, 0, -1):
        gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=round(64 * (1 - r / R) ** 1.6))
    # faint warm touch on the path just below
    pool = Image.new("L", (W, H), 0)
    ImageDraw.Draw(pool).ellipse((cx - 90, 1300, cx + 110, 1352), fill=26)
    glow = ImageChops.lighter(glow, pool.filter(ImageFilter.GaussianBlur(18)))
    warm = Image.new("RGB", (W, H), hexc("#f2b84b"))
    out = Image.composite(warm, out, glow)
    gx0, gy0, gx1, gy1 = GLASS
    glass = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glass).rectangle(GLASS, fill=255)
    glass = ImageChops.multiply(glass, day.convert("L").point(lambda v: 255 if v > 200 else 0))  # glass panes only, not the frame
    pane = Image.new("RGB", (W, H), hexc("#8a6a3a"))
    pd = ImageDraw.Draw(pane)
    pd.rectangle(GLASS, fill=hexc("#c98f3c"))
    pd.ellipse((cx - 5, cy - 9, cx + 5, cy + 7), fill=hexc("#f2b84b"))
    pd.ellipse((cx - 2.5, cy - 5, cx + 2.5, cy + 4), fill=hexc("#ffe2a6"))
    out = Image.composite(pane.filter(ImageFilter.GaussianBlur(1.2)), out, glass)
    return out


MAX_NIGHT = [  # day reference colour -> night colour (spec: buildings #5a4a85/#6c5a98, shading #4a3b70, trees #b06a9a)
    ("#a3a6dd", "#5a4a85"), ("#8d90cc", "#4a3b70"), ("#ecb4d0", "#6c5a98"), ("#d99abd", "#5a4a85"),
    ("#6f6aa8", "#3a2d5c"), ("#f2a7c6", "#b06a9a"), ("#f9d3e3", "#c58ab4"), ("#fff6fa", "#8a78b0"),
    ("#9cc49a", "#4f6a6a"), ("#7aa07a", "#3f5656"), ("#b8bcd8", "#5f5488"), ("#c8cce8", "#6a5f94"),
]


def maximal_night(day_key, px, star_rows, n_stars, moon_at, seed):
    """Night twin relit on the final day art grid, pixel for pixel (the Codex twin drifted)."""
    import random
    rnd = random.Random(seed)
    day = Image.open(P_OUT / f"{day_key}.png").convert("RGB")
    gw, gh = day.width // px, day.height // px
    a = day.resize((gw, gh), NN)
    d = a.load()
    lum = a.convert("L").load()

    def dist(c1, c2):
        return sum((c1[i] - c2[i]) ** 2 for i in range(3)) ** 0.5

    top_calm = int(gh * 0.5)  # nothing but sky and clouds stands this high
    med = []
    for y in range(top_calm):
        row = sorted((lum[x, y], d[x, y]) for x in range(gw))
        med.append(row[len(row) // 2][1])
    for y in range(top_calm, gh):  # track the day sky gradient down through the gaps between buildings
        cand = sorted((lum[x, y], d[x, y]) for x in range(gw) if dist(d[x, y], med[-1]) < 10)
        med.append(cand[len(cand) // 2][1] if cand else med[-1])
    sky = [[False] * gw for _ in range(gh)]
    stack = [(x, 0) for x in range(gw)]
    while stack:
        x, y = stack.pop()
        if not (0 <= x < gw and 0 <= y < gh) or sky[y][x]:
            continue
        if y >= top_calm and dist(d[x, y], med[y]) > 16:
            continue
        sky[y][x] = True
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    # windows: groups of near-white cells below the sky, small enough to be a window (not an awning)
    light = [[(not sky[y][x]) and min(d[x, y]) > 224 and max(d[x, y]) - min(d[x, y]) < 30 for x in range(gw)] for y in range(gh)]
    seen = [[False] * gw for _ in range(gh)]
    lit = {}
    for y in range(gh):
        for x in range(gw):
            if light[y][x] and not seen[y][x]:
                comp, st = [], [(x, y)]
                seen[y][x] = True
                while st:
                    cx, cy = st.pop(); comp.append((cx, cy))
                    for dx in (-2, -1, 0, 1, 2):
                        for dy in (-2, -1, 0, 1, 2):
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < gw and 0 <= ny < gh and light[ny][nx] and not seen[ny][nx]:
                                seen[ny][nx] = True; st.append((nx, ny))
                xs = [c[0] for c in comp]; ys = [c[1] for c in comp]
                bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
                # a window: small, chunky (not an awning stripe run, not a 1-cell glass glint)
                window = 4 <= bw <= 9 and 4 <= bh <= 9 and len(comp) / (bw * bh) > 0.45
                r = rnd.random()
                col = (None if not window else hexc("#ff8fbd") if r < 0.17 else hexc("#ffe28a") if r < 0.34 else hexc("#3f3266"))
                for c in comp:
                    lit[c] = col
    # cherry trees are the same pink as the pink buildings: tell them apart by shape (blobs, not rectangles)
    pinkish = [[(not sky[y][x]) and (dist(d[x, y], hexc("#edb3d6")) < 22 or dist(d[x, y], hexc("#d999ca")) < 22) for x in range(gw)] for y in range(gh)]
    tree = set()
    seen2 = [[False] * gw for _ in range(gh)]
    for y in range(gh):
        for x in range(gw):
            if pinkish[y][x] and not seen2[y][x]:
                comp, st = [], [(x, y)]
                seen2[y][x] = True
                while st:
                    cx, cy = st.pop(); comp.append((cx, cy))
                    for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                        if 0 <= nx < gw and 0 <= ny < gh and pinkish[ny][nx] and not seen2[ny][nx]:
                            seen2[ny][nx] = True; st.append((nx, ny))
                xs = [c[0] for c in comp]; ys = [c[1] for c in comp]
                bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
                rows = {}
                for cx, cy in comp:
                    lo, hi = rows.get(cy, (cx, cx)); rows[cy] = (min(lo, cx), max(hi, cx))
                span = sum(hi - lo + 1 for lo, hi in rows.values())  # window holes do not count against a building
                if span / (bw * bh) < 0.9 and bw < gw * 0.12:
                    tree.update(comp)
    refs = [(hexc(a_), hexc(b_)) for a_, b_ in MAX_NIGHT]
    out = Image.new("RGB", (gw, gh)); o = out.load()
    top, hor = hexc("#2b1f40"), hexc("#3a2b55")
    for y in range(gh):
        base = lerp(top, hor, min(1, y / (gh * 0.75)))
        for x in range(gw):
            c = d[x, y]
            if sky[y][x]:
                dl = (lum[x, y] - sum(med[y]) / 3) * 0.25 if dist(c, med[y]) < 16 else 0  # keep the gentle texture, drop clouds
                o[x, y] = tuple(max(0, min(255, round(v + dl))) for v in base)
            elif lit.get((x, y)):
                o[x, y] = lit[(x, y)]
            elif (x, y) in tree:
                o[x, y] = hexc("#94577f") if dist(c, hexc("#d999ca")) < 22 else hexc("#b06a9a")
            else:
                ref, night = min(refs, key=lambda r_: dist(c, r_[0]))
                if dist(c, ref) > 48:
                    night = lerp(c, top, 0.6)
                o[x, y] = night
    for _ in range(n_stars):  # single-cell stars in the sky
        for _t in range(20):
            x, y = rnd.randrange(2, gw - 2), rnd.randrange(1, star_rows)
            if sky[y][x] and abs(x - moon_at[0]) > 10:
                o[x, y] = hexc("#fff6fa"); break
    # small crescent moon (art cells), top-left
    mx, my = moon_at
    for yy in range(-6, 7):
        for xx in range(-6, 7):
            if xx * xx + yy * yy <= 30 and (xx - 3) ** 2 + (yy + 1) ** 2 > 22:
                o[mx + xx, my + yy] = hexc("#fff6fa")
    return up(out, px).crop((0, 0, day.width, day.height))


def cozy_night():  # the night twin lines up with the day at (0, 0): same ivy trim
    return patch_from_below(opaque(raw("cozy/backdrop-night"), 2560, 1440), (2290, 296, 2460, 450), 170)


def bd(k, w, h):
    return lambda: opaque(raw(k), w, h)


RECIPES = {
    "minimal/sun-print": sun_print,
    "creator/backdrop-phone-day": bd("creator/backdrop-phone-day", 1080, 2340),
    "creator/backdrop-phone-night": bd("creator/backdrop-phone-night", 1080, 2340),
    "access/backdrop-day": access_day,
    "access/backdrop-night": access_night,
    "maximal/backdrop-day": lambda: pixel_backdrop("maximal/backdrop-day", 1920, 1080, 4),
    "maximal/backdrop-night": lambda: maximal_night("maximal/backdrop-day", 4, 120, 36, (40, 26), 62),
    "maximal/backdrop-day-portrait": lambda: pixel_backdrop("maximal/backdrop-day-portrait", 1170, 2532, 6),
    "maximal/backdrop-night-portrait": lambda: maximal_night("maximal/backdrop-day-portrait", 6, 126, 30, (30, 30), 63),
    "neon/backdrop-day": bd("neon/backdrop-day", 2560, 1440),
    "neon/backdrop-day-portrait": bd("neon/backdrop-day-portrait", 1290, 2796),
    "cozy/backdrop-day": cozy_day,
    "cozy/backdrop-night": cozy_night,
    "cozy/card-placeholder": bd("cozy/card-placeholder", 768, 1024),
    "cozy/card-placeholder-night": bd("cozy/card-placeholder-night", 768, 1024),
    "cozy/backdrop-phone-day": bd("cozy/backdrop-phone-day", 1170, 2532),
    "cozy/backdrop-phone-night": bd("cozy/backdrop-phone-night", 1170, 2532),
    "immersion/backdrop-portrait-day": bd("immersion/backdrop-portrait-day", 1170, 2532),
    "immersion/backdrop-portrait-night": bd("immersion/backdrop-portrait-night", 1170, 2532),
}
