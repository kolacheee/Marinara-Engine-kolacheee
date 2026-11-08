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
                # Cyberpunk's badlands are the wasteland's own ground.
                fallback = (f"wasteland-{look}{season}-base.png",) if family == "scifi" and look == "wasteland" else ()
                for base in (f"{family}-{look}{season}-base.png", f"{look}{season}-base.png", *fallback):
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
        def block(files, slots, size):
            """Sprites laid in a block left to right, top to bottom, each slot `size` cells (w, h), standing on
            its foot and centred across it when drawn smaller."""
            cols = max(x + w for x, _, w, _ in slots)
            rows = max(y + h for _, y, _, h in slots)
            out = Image.new("RGBA", (cols * CELL, rows * CELL))
            for f, (x, y, w, h) in zip(files, slots):
                art = Image.open(f).convert("RGBA")
                out.alpha_composite(art, (x * CELL + (w * CELL - art.width) // 2, y * CELL + h * CELL - art.height))
            return out, cols, rows

        def standing(tid, names, slots):
            for season in SEASONS:
                files = [os.path.join(out_dir, n.format(season=season, family=family)) for n in names]
                if all(os.path.exists(f) for f in files):
                    made[f"{tid}{season}"] = [block(files, slots, None)]

        if "bridges" in only:
            # A road's bridge over a river, one cell each: west-east, north-south, and the two diagonals.
            standing("road_bridge", [f"{{family}}-bridge-{o}{{season}}.png" for o in ("h", "v", "d1", "d2")],
                     [(i, 0, 1, 1) for i in range(4)])
        if "craters" in only:
            # Crater scars, shading only: four of one cell, then a row of four of two by two.
            standing("crater_props", [f"crater-prop-{i}{{season}}.png" for i in range(8)],
                     [(i, 0, 1, 1) for i in range(4)] + [(2 * i, 1, 2, 2) for i in range(4)])
        if "ruins" in only:
            # Ruins as props: the old world's for the settings near ours, fallen stone for the older ones.
            kind = "fantasy" if family in ("fantasy", "wuxia") else "wasteland"
            standing("ruins_props", [f"{kind}-ruins{{season}}-prop-{i}.png" for i in range(8)],
                     [(i, 0, 1, 1) for i in range(4)] + [(2 * i, 1, 2, 2) for i in range(4)])
        if "hills" in only:
            standing("hills_props", [f"hills{{season}}-prop-{i}.png" for i in range(8)],
                     [(i, 0, 1, 1) for i in range(4)] + [(2 * i, 1, 2, 2) for i in range(4)])
        if "dunes" in only:
            standing("dune_props", [f"dunes{{season}}-prop-{i}.png" for i in range(8)],
                     [(i, 0, 1, 1) for i in range(4)] + [(2 * i, 1, 2, 2) for i in range(4)])
        if "marsh" in only:
            standing("marsh_props", [f"marsh{{season}}-prop-{i}.png" for i in range(8)],
                     [(i, 0, 1, 1) for i in range(4)] + [(2 * i, 1, 2, 2) for i in range(4)])
        if "mountains" in only:
            standing("mountain_ridges", [f"mountains{{season}}-ridge-{i}.png" for i in range(8)],
                     [((i % 2) * 3, (i // 2) * 2, 3, 2) for i in range(8)])
            standing("mountain_pines", [f"mountains{{season}}-pine-{i}.png" for i in range(8)],
                     [(i % 4, i // 4, 1, 1) for i in range(8)])
        if "forest" in only:
            # A wood's floor under its trees, six cells square.
            # (Codex names the dead wood's floor "deadforest".)
            for look, name in (("forest", "forest"), ("conifer_forest", "conifer_forest"), ("dead_forest", "deadforest")):
                for season in SEASONS:
                    f = os.path.join(out_dir, f"{name}{season}-floor-base.png")
                    if os.path.exists(f):
                        made[f"floor_{look}{season}"] = [(Image.open(f).convert("RGBA"), 6, 6)]
        if "buildings" in only:
            # Built-up looks as buildings (BRIEF-8 for scifi, BRIEF-10 for jazz_age, modern and wasteland): each
            # look's buildings a block, in WORLD_BUILDING_PIECES' layout. They stand on the open ground round
            # them (the game draws no street under them since 2026-11-07), so the street bases are not used.
            row = lambda count, y, w, h: [(i * w, y, w, h) for i in range(count)]
            layouts = {
                "city": row(6, 0, 1, 1) + row(6, 1, 1, 2) + row(4, 3, 2, 2),
                "slums": row(8, 0, 1, 1) + row(4, 1, 2, 2),
                "industry": row(6, 0, 1, 1) + row(4, 1, 2, 2),
            }
            for look, slots in layouts.items():
                standing(f"buildings_{look}", [f"{family}-{look}{{season}}-bldg-{i}.png" for i in range(len(slots))], slots)
        if "lanes" in only:
            # A city's lanes (BRIEF-11), in the joined path's layout: one block, summer, for the whole year.
            f = os.path.join(out_dir, f"{family}-lane.png")
            if os.path.exists(f):
                made["lane_joined"] = [(Image.open(f).convert("RGBA"), 4, 23)]
        if "suburbs" in only and family in ("modern", "jazz_age"):
            # Suburbs as houses and yard props over the grass (BRIEF-9): the grass is the suburb's floor and its
            # ground, twelve houses then eight yard props, in WORLD_BUILDING_PIECES' layout.
            for season in SEASONS:
                f = os.path.join(out_dir, f"grass{season}-base.png")
                if os.path.exists(f) and f"suburb{season}" in pack["tiles"]:
                    made[f"floor_suburb{season}"] = [(Image.open(f).convert("RGBA"), 6, 6)]
                    made[f"suburb{season}"] = [(Image.open(f).convert("RGBA"), 6, 6)]
            names = [f"suburb{{season}}-house-{i}.png" for i in range(12)] + [f"suburb{{season}}-yard-{i}.png" for i in range(8)]
            standing("buildings_suburb", names, [(i % 8, i // 8, 1, 1) for i in range(12)] + [(i, 2, 1, 1) for i in range(8)])
        if "city" in only and family == "scifi":
            # Cyberpunk's built-up ground as one texture each, and the landmarks standing over it.
            for look in ("city", "slums", "industry"):
                for season in SEASONS:
                    f = os.path.join(out_dir, f"scifi-{look}{season}-base.png")
                    if os.path.exists(f):
                        made[f"{look}{season}"] = [(Image.open(f).convert("RGBA"), 6, 6)]
            standing("standing_city", [f"scifi-city{{season}}-tower-{i}.png" for i in range(8)],
                     [(i % 4, (i // 4) * 2, 1, 2) for i in range(8)])
            standing("standing_industry", [f"scifi-industry{{season}}-stack-{i}.png" for i in range(8)],
                     [(i % 4, (i // 4) * 2, 1, 2) for i in range(8)])
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
        # Every tile on the built sheet(s) is packed again from scratch with the new ones (what the new ones
        # replace is dropped), widest first, so the sheet never grows past the 4096-pixel limit with spare rows.
        kept = {}
        for tid, variants in pack["tiles"].items():
            if tid in made or not any(str(v.get("sheet", "")).startswith("built") for v in variants):
                continue
            kept[tid] = []
            for v in variants:
                w, h = v.get("w", 1), v.get("h", 1)
                im = sheets[v["sheet"]].crop((v["x"] * CELL, v["y"] * CELL, (v["x"] + w) * CELL, (v["y"] + h) * CELL))
                kept[tid].append((im, w, h))
        everything = {**kept, **made}
        across, limit = 32, 4096 // CELL
        items = sorted(
            ((tid, n, im, w, h) for tid, variants in everything.items() for n, (im, w, h) in enumerate(variants)),
            key=lambda item: (-item[4], -item[3]),
        )
        built, placed = [], {}
        x = y = row_h = 0
        for tid, n, im, w, h in items:
            if x + w > across:
                x, y, row_h = 0, y + row_h, 0
            if y + h > limit:
                built.append(y + row_h if x else y)
                x, y, row_h = 0, 0, 0
            placed[(tid, n)] = (len(built), x, y, w, h, im)
            x += w
            row_h = max(row_h, h)
        built.append(y + row_h)
        names = ["built" if k == 0 else f"built{k + 1}" for k in range(len(built))]
        canvases = [Image.new("RGBA", (across * CELL, rows * CELL)) for rows in built]
        for (tid, n), (k, x, y, w, h, im) in placed.items():
            canvases[k].alpha_composite(im, (x * CELL, y * CELL))
        out = []
        for name, canvas in zip(names, canvases):
            buf = io.BytesIO()
            canvas.save(buf, "PNG", optimize=True)
            out.append({"id": name, "png": PNG + base64.b64encode(buf.getvalue()).decode(), "width": canvas.width, "height": canvas.height})
        pack["sheets"] = [s for s in pack["sheets"] if not s["id"].startswith("built")] + out
        for tid, variants in everything.items():
            pack["tiles"][tid] = []
            for n in range(len(variants)):
                k, x, y, w, h, im = placed[(tid, n)]
                pack["tiles"][tid].append({"sheet": names[k], "x": x, "y": y, **({"w": w, "h": h} if w > 1 or h > 1 else {})})
        with open(path, "w") as f:
            f.write(json.dumps(pack, separators=(",", ":")) + "\n")
        print(path, {tid: len(v) for tid, v in made.items()})


if __name__ == "__main__":
    args = sys.argv[1:]
    only = {"markers", "farmland", "bridges", "marsh", "buildings", "suburbs", "lanes", "dunes", *TILE_LOOKS, *DECOR_LOOKS, *PATTERN_LOOKS, *(look for look, _ in STANDING)}
    if "--only" in args:
        at = args.index("--only")
        only = set(args[at + 1].split(","))
        del args[at : at + 2]
    main(args[0], args[1:], only)
