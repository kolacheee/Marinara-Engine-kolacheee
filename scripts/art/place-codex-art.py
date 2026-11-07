#!/usr/bin/env python3
# ──────────────────────────────────────────────
# Places art Codex drew for the overworld (branch art/overworld-codex-2026-11-06, art-drop/out) into the
# built-in packs.
#
#   python3 scripts/art/place-codex-art.py <art-drop/out> packages/server/src/assets/overworld-art/*.json [--only markers,farmland,city,...]
#   node scripts/art/pack-builtin-art.mjs <dir with the results as pack-<family>.json>   # clears unread pixels
#
# - markers: `<family>-marker0..3.png`, drawn at the size they show on the map (60, 84, 108 and 144 px for
#   a hamlet to a city: MARKER_GROWTH in WorldOverworld.tsx times 48), each set in a 3x3-cell sprite,
#   standing on its bottom and centred across it, so the overworld draws it at its own size with no
#   scaling (a sprite of several cells is drawn that many cells big).
# - tiles: `<look><season>-0..7.png` for slums, industry, city, suburbs and (wuxia) rice paddies, one cell each, every building inside
#   its cell with a street along its edges; for each family that has the look and season.
# - farmland: `farmland<season>-0..6.png` (fields, hedged along the edges) and `<family>-farmstead<season>.png`.
# Both go on the sheet `built` (carried on below what it holds), as a pack holds at most sixteen sheets.
# ──────────────────────────────────────────────
import base64, io, json, os, sys
from PIL import Image

CELL = 48
PNG = "data:image/png;base64,"
FAMILIES = ("fantasy", "wuxia", "jazz_age", "modern", "scifi", "wasteland")
TILE_LOOKS = ("slums", "industry", "city", "suburb", "paddies")
# Open ground redrawn with a texture (`<look><season>-base.png`, 288 px) and eight small things to scatter
# over it (`<look><season>-detail-0..7.png`, the tile `decor_<look><season>`).
DECOR_LOOKS = ("grass", "plains")
# Ground textures only (`[<family>-]<look><season>-base.png`, 288 px).
PATTERN_LOOKS = ("mountains", "craters", "ruins", "wasteland")
# Standing sprites planted over a look (eight files by this pattern, the tile `treeline_<look><season>`).
STANDING = (("mountains", "mountains{season}-peak-{i}.png"), ("forest", "treeline_forest{season}-{i}.png"))
SEASONS = ("", "@spring", "@autumn", "@winter")
# Settings whose farmland carries one of their own farmsteads among its variants.
FARMSTEADS = ("fantasy", "wuxia", "jazz_age", "modern")


def main(out_dir, paths, only):
    for path in paths:
        family = os.path.basename(path)[: -len(".json")]
        if family not in FAMILIES:
            continue
        pack = json.load(open(path))
        sheets = {
            s["id"]: Image.open(io.BytesIO(base64.b64decode(s["png"][len(PNG) :]))).convert("RGBA")
            for s in pack["sheets"]
        }
        made = {}  # tile id -> [(image, w, h)] in cells
        if "markers" in only:
            for tier in range(4):
                art = Image.open(os.path.join(out_dir, f"{family}-marker{tier}.png")).convert("RGBA")
                box = Image.new("RGBA", (3 * CELL, 3 * CELL))
                box.alpha_composite(art, ((3 * CELL - art.width) // 2, 3 * CELL - art.height))
                made[f"marker{tier}"] = [(box, 3, 3)]
        for look in TILE_LOOKS:
            if look not in only:
                continue
            for season in SEASONS:
                # A setting's own set (`<family>-<look><season>-<i>.png`) over the shared one, and it may add a
                # season the pack had none of.
                own = [os.path.join(out_dir, f"{family}-{look}{season}-{i}.png") for i in range(8)]
                if all(os.path.exists(f) for f in own):
                    made[f"{look}{season}"] = [(Image.open(f).convert("RGBA"), 1, 1) for f in own]
                    continue
                if f"{look}{season}" not in pack["tiles"]:
                    continue
                files = [os.path.join(out_dir, f"{look}{season}-{i}.png") for i in range(8)]
                if not all(os.path.exists(f) for f in files):
                    print(f"{family}: {look}{season} incomplete, left as it is")
                    continue
                made[f"{look}{season}"] = [(Image.open(f).convert("RGBA"), 1, 1) for f in files]
        for look in DECOR_LOOKS:
            if look not in only:
                continue
            for season in SEASONS:
                # The ground's own texture, six cells square, and the small things scattered over it.
                base = os.path.join(out_dir, f"{look}{season}-base.png")
                if os.path.exists(base) and f"{look}{season}" in pack["tiles"]:
                    made[f"{look}{season}"] = [(Image.open(base).convert("RGBA"), 6, 6)]
                files = [os.path.join(out_dir, f"{look}{season}-detail-{i}.png") for i in range(8)]
                if all(os.path.exists(f) for f in files):
                    made[f"decor_{look}{season}"] = [(Image.open(f).convert("RGBA"), 1, 1) for f in files]
        for look in PATTERN_LOOKS:
            if look not in only:
                continue
            for season in SEASONS:
                # A ground's texture, six cells square: the setting's own, else the shared one.
                for base in (f"{family}-{look}{season}-base.png", f"{look}{season}-base.png"):
                    if os.path.exists(os.path.join(out_dir, base)):
                        made[f"{look}{season}"] = [(Image.open(os.path.join(out_dir, base)).convert("RGBA"), 6, 6)]
                        break
        for look, name in STANDING:
            if look not in only:
                continue
            for season in SEASONS:
                # Eight standing sprites (peaks, trees) as one block four cells by two.
                files = [os.path.join(out_dir, name.format(season=season, i=i)) for i in range(8)]
                tid = f"treeline_{look}{season}"
                if not all(os.path.exists(f) for f in files):
                    continue
                if look != "mountains" and tid not in pack["tiles"] and f"treeline_{look}" not in pack["tiles"]:
                    continue
                # Each sprite one cell (trees) or two by two (a range's peaks, 96 px).
                span = 2 if look == "mountains" else 1
                block = Image.new("RGBA", (4 * span * CELL, 2 * span * CELL))
                for i, f in enumerate(files):
                    art = Image.open(f).convert("RGBA")
                    if art.width < span * CELL:  # a smaller drawing stands on the foot of its slot
                        slot = Image.new("RGBA", (span * CELL, span * CELL))
                        slot.alpha_composite(art, ((span * CELL - art.width) // 2, span * CELL - art.height))
                        art = slot
                    block.alpha_composite(art, ((i % 4) * span * CELL, (i // 4) * span * CELL))
                made[tid] = [(block, 4 * span, 2 * span)]
        if "farmland" in only:
            # Seven field tiles and, in a setting that has one, its farmstead: one cell in eight a farm.
            for season in SEASONS:
                if f"farmland{season}" not in pack["tiles"]:
                    continue
                files = [os.path.join(out_dir, f"farmland{season}-{i}.png") for i in range(7)]
                files = [f for f in files if os.path.exists(f)]  # a layout still being redrawn is left out
                if family in FARMSTEADS:
                    files.append(os.path.join(out_dir, f"{family}-farmstead{season}.png"))
                made[f"farmland{season}"] = [(Image.open(f).convert("RGBA"), 1, 1) for f in files]
        if not made:
            continue
        old = sheets.get("built")
        across = max(12, (old.width // CELL) if old else 0)
        x, y, row_h, spots = 0, (old.height // CELL) if old else 0, 0, []
        for tid, variants in made.items():
            for im, w, h in variants:
                if x + w > across:
                    x, y, row_h = 0, y + row_h, 0
                spots.append((tid, im, x, y, w, h))
                x += w
                row_h = max(row_h, h)
        sheet = Image.new("RGBA", (across * CELL, (y + row_h) * CELL))
        if old:
            sheet.alpha_composite(old, (0, 0))
        for tid, im, x, y, w, h in spots:
            sheet.alpha_composite(im, (x * CELL, y * CELL))
        buf = io.BytesIO()
        sheet.save(buf, "PNG", optimize=True)
        pack["sheets"] = [s for s in pack["sheets"] if s["id"] != "built"] + [
            {"id": "built", "png": PNG + base64.b64encode(buf.getvalue()).decode(), "width": sheet.width, "height": sheet.height}
        ]
        for tid in made:
            pack["tiles"][tid] = []
        for tid, im, x, y, w, h in spots:
            pack["tiles"][tid].append({"sheet": "built", "x": x, "y": y, **({"w": w, "h": h} if w > 1 or h > 1 else {})})
        with open(path, "w") as f:
            f.write(json.dumps(pack, separators=(",", ":")) + "\n")
        print(path, {tid: len(v) for tid, v in made.items()})


if __name__ == "__main__":
    args = sys.argv[1:]
    only = {"markers", "farmland", *TILE_LOOKS, *DECOR_LOOKS, *PATTERN_LOOKS, *(look for look, _ in STANDING)}
    if "--only" in args:
        at = args.index("--only")
        only = set(args[at + 1].split(","))
        del args[at : at + 2]
    main(args[0], args[1:], only)
