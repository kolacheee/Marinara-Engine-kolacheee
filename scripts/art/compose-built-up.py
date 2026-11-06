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
            if look not in pack["tiles"]:
                continue
            base = pattern(look)
            rects = block_rects(base, opts["minw"], opts["minh"])
            road_at = road_mask(np.array(base))
            rng = random.Random(f"{look}-built")
            cells = [layout(rects, rng, opts["gap"]) for _ in range(VARIANTS)]
            for tid in [t for t in pack["tiles"] if t.split("@")[0] == look]:
                made[tid] = [(compose(pattern(tid), road_at, c), 1, 1) for c in cells]
        if not made:
            continue
        # The new sheet: twelve cells across, each tile in reading order.
        across, x, y, row_h, spots = 12, 0, 0, 0, []
        for tid, variants in made.items():
            for im, w, h in variants:
                if x + w > across:
                    x, y, row_h = 0, y + row_h, 0
                spots.append((tid, im, x, y, w, h))
                x += w
                row_h = max(row_h, h)
        sheet = Image.new("RGBA", (across * size, (y + row_h) * size))
        for tid, im, x, y, w, h in spots:
            sheet.alpha_composite(im, (x * size, y * size))
        buf = io.BytesIO()
        sheet.save(buf, "PNG", optimize=True)
        pack["sheets"] = [s for s in pack["sheets"] if s["id"] != "built"] + [
            {"id": "built", "png": PNG + base64.b64encode(buf.getvalue()).decode(), "width": sheet.width, "height": sheet.height}
        ]
        for tid in made:
            pack["tiles"][tid] = []
        for tid, im, x, y, w, h in spots:
            pack["tiles"][tid].append({"sheet": "built", "x": x, "y": y, **({"w": w, "h": h} if w > 1 else {})})
        with open(path, "w") as f:
            f.write(json.dumps(pack, separators=(",", ":")) + "\n")
        print(path, {tid: len(v) for tid, v in made.items()})


if __name__ == "__main__":
    main(sys.argv[1:])
