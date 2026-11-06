#!/usr/bin/env python3
# ──────────────────────────────────────────────
# Built-up ground at the overworld's scale (user, 2026-11-06: houses "getting cut off", and "one of these
# houses is half the size of the village just about").
#
#   python3 scripts/art/compose-built-up.py packages/server/src/assets/overworld-art/<family>.json ...
#   node scripts/art/pack-builtin-art.mjs <dir with the results as pack-<family>.json>   # clears unread pixels
#
# The packs drew suburbs as one 6x6-cell pattern at the towns' scale, cut at the cell lines wherever the
# look ended. This writes it again on a sheet of its own (`built`): eight one-cell variants, each two rows of
# whole blocks (lifted from the pattern between its streets) at about half size, with half a street along
# every side, so cells side by side join into streets and a district's edge is a street, never a cut house.
# Seasonal variants reuse the summer pattern's block layout, so a season never moves a block.
# Industry, city and slums stay at full size: shrunk, their finer detail turned to mush, and they meet
# mostly each other (in the cyberpunk sprawl), where a full-size cut reads as a district's edge.
# Needs Pillow and numpy.
# ──────────────────────────────────────────────
import base64, io, json, random, sys
import numpy as np
from PIL import Image

CELL = 48
BLOCKS = {"suburb": dict(minw=20, minh=20, gap=3)}
VARIANTS = 8
FARM_VARIANTS = 8  # a pack holds at most eight variants of a tile
PNG = "data:image/png;base64,"


def road_mask(a):
    rgb = a[..., :3].astype(int)
    mx, mn = rgb.max(2), rgb.min(2)
    return ((mx - mn) < 22) & (mx > 95)


def runs(flags):
    out, start = [], None
    for i, f in enumerate(list(flags) + [True]):
        if not f and start is None:
            start = i
        if f and start is not None:
            out.append((start, i))
            start = None
    return out


def tiled(im):
    w, h = im.size
    big = Image.new("RGBA", (w * 3, h * 3))
    for i in range(3):
        for j in range(3):
            big.paste(im, (i * w, j * h))
    return big


def block_rects(im, minw, minh, thr=0.8):
    """The blocks between the pattern's streets, as rectangles in the pattern tiled 3x3 (whole ones only)."""
    w, h = im.size
    road = road_mask(np.array(tiled(im)))
    rects = []
    for y0, y1 in runs(road[:, w : 2 * w].mean(1) > thr):
        if y1 - y0 < minh or not (h <= y0 < 2 * h):
            continue
        for x0, x1 in runs(road[y0:y1].mean(0) > thr):
            if x1 - x0 < minw or not (w <= x0 < 2 * w):
                continue
            rects.append((x0, y0, x1, y1))
    return rects


def layout(rects, rng, gap, margin=1.5, rows=2):
    """One cell's blocks: (source rect, x, y, w, h) each, rows of whole blocks filling the cell."""
    inner = CELL - 2 * margin
    row_h = (inner - gap * (rows - 1)) / rows
    placed, y = [], float(margin)
    for _ in range(rows):
        h = round(y + row_h) - round(y)
        pick, total, tries = [], -gap, 0
        while total < inner - 6 and tries < 200:
            tries += 1
            r = rng.choice(rects)
            width = (r[2] - r[0]) * h / (r[3] - r[1])
            if total + gap + width > inner + 6:
                continue
            pick.append((r, width))
            total += gap + width
        if not pick:
            r = min(rects, key=lambda r: (r[2] - r[0]) / (r[3] - r[1]))
            pick = [(r, (r[2] - r[0]) * h / (r[3] - r[1]))]
        k = (inner - gap * (len(pick) - 1)) / sum(width for _, width in pick)
        x = float(margin)
        for r, width in pick:
            placed.append((r, round(x), round(y), round(x + width * k) - round(x), h))
            x += width * k + gap
        y += row_h + gap
    return placed


def compose(im, road_at, cell_layout):
    big = tiled(im)
    a = np.array(im)
    fill = tuple(int(v) for v in np.median(a[road_at][:, :3], axis=0)) + (255,)
    out = Image.new("RGBA", (CELL, CELL), fill)
    for (x0, y0, x1, y1), x, y, w, h in cell_layout:
        out.alpha_composite(big.crop((x0, y0, x1, y1)).resize((w, h), Image.LANCZOS), (x, y))
    return out


# ── Farmland (user, 2026-11-06: the fields were "too huge and same-y", and "should include small roads and
# houses so it doesn't just look like an endless field"): a patchwork seen from above. Each cell is two to
# four fields of different crops, hedged, with a hedge tree or two, and now and then a farmstead (the
# setting's own house, small, in its yard) with a lane out to the cell's edge. The layout is made once and
# painted in each season's crops, so a season never moves a field.
# Weighted toward greens, as fields seen from above mostly are.
FIELD_KINDS = ("green", "green", "dark", "dark", "young", "pasture", "pasture", "grain", "grain", "plowed", "hay")
SEASON_CROPS = {
    # kind: (base, stripe) per season; pasture is the season's own grass.
    None: {"grain": ((201, 169, 72), (172, 140, 52)), "green": ((110, 140, 52), (88, 116, 40)),
           "plowed": ((126, 96, 60), (108, 80, 48)), "young": ((150, 176, 80), (132, 158, 66)),
           "hay": ((196, 184, 120), (176, 162, 100)), "dark": ((92, 122, 46), (74, 100, 36))},
    "spring": {"grain": ((206, 190, 70), (180, 164, 50)), "green": ((132, 166, 70), (110, 142, 54)),
               "plowed": ((118, 80, 48), (94, 62, 36)), "young": ((168, 190, 96), (140, 164, 76)),
               "hay": ((128, 88, 52), (150, 176, 80)), "dark": ((110, 74, 44), (130, 160, 70))},
    "autumn": {"grain": ((196, 158, 78), (166, 128, 58)), "green": ((96, 118, 50), (78, 98, 40)),
               "plowed": ((122, 84, 50), (98, 66, 38)), "young": ((176, 144, 74), (150, 118, 56)),
               "hay": ((206, 182, 120), (176, 150, 92)), "dark": ((112, 78, 46), (90, 62, 36))},
    "winter": {"grain": ((228, 234, 242), (196, 206, 220)), "green": ((214, 222, 232), (176, 188, 204)),
               "plowed": ((222, 228, 238), (178, 168, 160)), "young": ((232, 238, 246), (204, 212, 226)),
               "hay": ((218, 226, 236), (184, 194, 210)), "dark": ((226, 232, 240), (186, 178, 172))},
}
HEDGES = {None: ((58, 84, 40), (84, 112, 52), (40, 62, 30)), "spring": ((62, 92, 42), (92, 124, 58), (42, 66, 32)),
          "autumn": ((92, 84, 40), (140, 104, 48), (64, 56, 30)), "winter": ((86, 80, 72), (236, 240, 246), (60, 56, 50))}
YARD = {None: (172, 148, 102), "spring": (168, 146, 100), "autumn": (170, 144, 98), "winter": (224, 230, 238)}
LANE = {None: (150, 122, 82), "spring": (146, 118, 80), "autumn": (148, 118, 78), "winter": (170, 160, 150)}


def field_split(rect, rng, depth=0):
    x, y, w, h = rect
    if depth >= 2 or (w < 22 and h < 22) or (depth == 1 and rng.random() < 0.7) or (depth == 0 and rng.random() < 0.2):
        return [rect]
    if (w >= h and w >= 22) or h < 22:
        cut = round(w * rng.uniform(0.38, 0.62))
        return field_split((x, y, cut, h), rng, depth + 1) + field_split((x + cut, y, w - cut, h), rng, depth + 1)
    cut = round(h * rng.uniform(0.38, 0.62))
    return field_split((x, y, w, cut), rng, depth + 1) + field_split((x, y + cut, w, h - cut), rng, depth + 1)


def farm_layout(rng, houses, farmstead):
    fields = []
    for rect in field_split((1, 1, CELL - 1, CELL - 1), rng):
        fields.append(dict(rect=rect, kind=rng.choice(FIELD_KINDS), vertical=rng.random() < 0.5,
                           grass_at=(rng.randrange(0, 240), rng.randrange(0, 240)), seed=rng.random()))
    trees = []
    for _ in range(rng.randint(1, 4)):
        x, y, w, h = rng.choice(fields)["rect"]
        trees.append((x + w - 1, y + rng.randrange(2, max(3, h - 2))) if rng.random() < 0.5
                     else (x + rng.randrange(2, max(3, w - 2)), y + h - 1))
    farm = None
    if farmstead:
        yx, yy = rng.randrange(4, CELL - 26), rng.randrange(4, CELL - 30)
        farm = dict(at=(yx, yy), house=rng.randrange(houses), down=rng.random() < 0.5)
    return dict(fields=fields, trees=trees, farm=farm)


def field_texture(w, h, base, stripe, vertical, seed):
    rng = random.Random(seed)
    a = np.zeros((h, w, 4), np.uint8)
    a[...] = base + (255,)
    for y in range(h):
        for x in range(w):
            if (x if vertical else y) % 3 == 0:
                a[y, x, :3] = stripe
            n = rng.random()
            if n < 0.06:
                a[y, x, :3] = np.minimum(255, a[y, x, :3].astype(int) + 14)
            elif n < 0.10:
                a[y, x, :3] = np.maximum(0, a[y, x, :3].astype(int) - 10)
    return Image.fromarray(a)


def hedge_tree(im, x, y, hedge):
    from PIL import ImageDraw

    d = ImageDraw.Draw(im)
    d.ellipse((x - 2, y - 2, x + 2, y + 2), fill=hedge[0] + (255,))
    d.point((x - 1, y - 1), fill=hedge[1] + (255,))
    d.point((x + 1, y + 2), fill=hedge[2] + (255,))


def farm_cell(plan, season, grass, houses):
    from PIL import ImageDraw

    crops, hedge = SEASON_CROPS[season], HEDGES[season]
    im = Image.new("RGBA", (CELL, CELL), hedge[0] + (255,))
    d = ImageDraw.Draw(im)
    for f in plan["fields"]:
        x, y, w, h = f["rect"]
        if f["kind"] == "pasture":
            gx, gy = f["grass_at"]
            im.paste(grass.crop((gx, gy, gx + w, gy + h)), (x, y))
        else:
            base, stripe = crops[f["kind"]]
            im.paste(field_texture(w, h, base, stripe, f["vertical"], f["seed"]), (x, y))
        if x + w < CELL:
            d.line((x + w - 1, y, x + w - 1, y + h - 1), fill=hedge[0] + (255,))
        if y + h < CELL:
            d.line((x, y + h - 1, x + w - 1, y + h - 1), fill=hedge[0] + (255,))
    for x, y in plan["trees"]:
        hedge_tree(im, x, y, hedge)
    if plan["farm"]:
        yx, yy = plan["farm"]["at"]
        # A yard a little wider than the house, a lane from it to the cell's edge, a tree beside it.
        d.rounded_rectangle((yx - 1, yy + 8, yx + 22, yy + 24), radius=3, fill=YARD[season] + (255,))
        lane_x = yx + 10
        if plan["farm"]["down"]:
            d.rectangle((lane_x, yy + 24, lane_x + 1, CELL - 1), fill=LANE[season] + (255,))
        else:
            d.rectangle((lane_x, 0, lane_x + 1, yy + 8), fill=LANE[season] + (255,))
        im.alpha_composite(houses[plan["farm"]["house"]].resize((21, 21), Image.LANCZOS), (yx, yy + 1))
        hedge_tree(im, yx + 22, yy + 18, hedge)
    return im


def main(paths):
    for path in paths:
        pack = json.load(open(path))
        size = pack["tileSize"]
        assert size == CELL, f"{path}: {size} px cells"
        sheets = {
            s["id"]: Image.open(io.BytesIO(base64.b64decode(s["png"][len(PNG) :]))).convert("RGBA")
            for s in pack["sheets"]
        }

        def pattern(tid):
            t = pack["tiles"][tid][0]
            return sheets[t["sheet"]].crop(
                (t["x"] * size, t["y"] * size, (t["x"] + t.get("w", 1)) * size, (t["y"] + t.get("h", 1)) * size)
            )

        made = {}  # tile id -> list of (image, w, h) in cells
        for look, opts in BLOCKS.items():
            if look not in pack["tiles"] or pack["tiles"][look][0].get("w", 1) == 1:
                continue
            base = pattern(look)
            rects = block_rects(base, opts["minw"], opts["minh"])
            road_at = road_mask(np.array(base))
            rng = random.Random(f"{look}-built")
            cells = [layout(rects, rng, opts["gap"]) for _ in range(VARIANTS)]
            for tid in [t for t in pack["tiles"] if t.split("@")[0] == look]:
                made[tid] = [(compose(pattern(tid), road_at, c), 1, 1) for c in cells]
        farm_ids = [t for t in pack["tiles"] if t.split("@")[0] == "farmland"]
        # Laid out once: a pack whose farmland is already one-cell variants was composed before.
        if "farmland" in pack["tiles"] and pack["tiles"]["farmland"][0].get("w", 1) > 1 and "house" in pack["tiles"]:
            houses = [
                sheets[t["sheet"]].crop((t["x"] * size, t["y"] * size, (t["x"] + t.get("w", 1)) * size, (t["y"] + t.get("h", 1)) * size))
                for t in pack["tiles"]["house"]
            ]
            rng = random.Random("farmland-patchwork")
            # One variant in eight carries a farmstead (farms are spread out).
            plans = [farm_layout(rng, len(houses), at == 3) for at in range(FARM_VARIANTS)]
            for tid in farm_ids:
                season = tid.split("@")[1] if "@" in tid else None
                grass_id = f"grass@{season}" if season and f"grass@{season}" in pack["tiles"] else "grass"
                grass = pattern(grass_id)
                made[tid] = [(farm_cell(plan, season, grass, houses), 1, 1) for plan in plans]
        if not made:
            continue
        # The sheet `built` (made if new, else carried on below what it holds): twelve cells across, each
        # tile in reading order. One sheet, as a pack holds at most sixteen.
        old = sheets.get("built")
        across = 12
        top = old.height // size if old else 0
        x, y, row_h, spots = 0, top, 0, []
        for tid, variants in made.items():
            for im, w, h in variants:
                if x + w > across:
                    x, y, row_h = 0, y + row_h, 0
                spots.append((tid, im, x, y, w, h))
                x += w
                row_h = max(row_h, h)
        sheet = Image.new("RGBA", (max(across * size, old.width if old else 0), (y + row_h) * size))
        if old:
            sheet.alpha_composite(old, (0, 0))
        for tid, im, x, y, w, h in spots:
            sheet.alpha_composite(im, (x * size, y * size))
        buf = io.BytesIO()
        sheet.save(buf, "PNG", optimize=True)
        sheet_id = "built"
        pack["sheets"] = [s for s in pack["sheets"] if s["id"] != "built"] + [
            {"id": sheet_id, "png": PNG + base64.b64encode(buf.getvalue()).decode(), "width": sheet.width, "height": sheet.height}
        ]
        for tid in made:
            pack["tiles"][tid] = []
        for tid, im, x, y, w, h in spots:
            pack["tiles"][tid].append({"sheet": sheet_id, "x": x, "y": y, **({"w": w, "h": h} if w > 1 else {})})
        with open(path, "w") as f:
            f.write(json.dumps(pack, separators=(",", ":")) + "\n")
        print(path, {tid: len(v) for tid, v in made.items()})


if __name__ == "__main__":
    main(sys.argv[1:])
