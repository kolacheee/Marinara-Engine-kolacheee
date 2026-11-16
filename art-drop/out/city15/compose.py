#!/usr/bin/env python3
"""Compose native city15 drawings. Requires Pillow; never resamples an asset.

    python art-drop/out/city15/compose.py
    python art-drop/out/city15/compose.py --seed 42 --seed2 43
    python art-drop/out/city15/compose.py --seed 42 --no-overlays
    python art-drop/out/city15/compose.py --seed 731 --mounts --no-sheets
    python art-drop/out/city15/compose.py --check-only
    python art-drop/out/city15/compose.py --replay art-drop/review/r15-C-street-42-1x.png

Default: two 12-building streets, a five-floor 8x proof, and all asset sheets.
Seeds, building specs, exact placements and asset hashes are in PNG metadata.
Floors include the ground floor. Storeys in build() are bottom-to-top.
All facade origins are separated by 48px; roof baseline is the top course.
Wall ends expose only their outer 3px inside the existing edge framing.
The remaining 5px are occluded by the intact foreground facade, not scaled.
The common course remains on top of cladding. Overlays never cross a lot edge.
"""

import argparse
import hashlib
import json
import random
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, PngImagePlugin

ASSETS = Path(__file__).resolve().parent
ART = ASSETS.parent.parent
REVIEW = ART / "review"
GROUNDS = ("shop", "door", "arch", "work")
STOREYS = ("timber", "plaster", "stone", "jetty")
ROOFS = ("gable", "ridge", "hip", "flat")
NEAREST = Image.Resampling.NEAREST
END_REVEAL = 3


@lru_cache(maxsize=None)
def asset(name):
    return Image.open(ASSETS / (name + ".png")).convert("RGBA")


def save(im, name, **metadata):
    info = PngImagePlugin.PngInfo()
    for key, value in metadata.items():
        info.add_text(key, json.dumps(value, sort_keys=True))
    im.save(REVIEW / ("r15-C-" + name + ".png"), pnginfo=info)


def scales(im, name, factors=(1, 4), **metadata):
    for scale in factors:
        proof = im if scale == 1 else im.resize((im.width * scale, im.height * scale), NEAREST)
        save(proof, f"{name}-{scale}x", Scale=scale, **metadata)


def grass(size):
    tile = Image.open(ASSETS.parent / "grass-base.png").convert("RGBA")
    im = Image.new("RGBA", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            im.paste(tile, (x, y))
    return im


def sign_mount(spec, name):
    """Mount an unchanged sign on the brace between timber-w2's windows.

    This is an inspected socket, not a general-purpose placement guess. The
    window/sill silhouettes lie outside x=33..61; the bracket meets the left
    diagonal brace. Prefer the lowest compatible floor, above the ground
    entrance/display. Return None when this drawing offers no known socket.
    Coordinates remain facade-relative, like manually positioned overlays.
    """
    if name not in {f"sign-{i}" for i in range(4)}:
        raise ValueError(f"Unknown hanging sign: {name}")
    if spec["width"] == 2:
        for floor, storey in enumerate(spec["storeys"]):
            if storey["kind"] == "timber":
                return dict(file=name, x=33,
                            y=(len(spec["storeys"]) - floor - 1) * 48 + 6)
    return None


def mounted_specs(seed, count=12, overlays=True):
    """The same seeded street, exercising both ends and safe sign sockets."""
    specs = random_specs(seed, count, overlays)
    sign = 0
    for spec in specs:
        spec["ends"] = ["left", "right"]
        overlay = sign_mount(spec, f"sign-{sign % 4}") if overlays else None
        if overlay:
            spec["overlays"].append(overlay)
            sign += 1
    return specs


def build(spec):
    """Return (RGBA, placements). A spec may have zero through four storeys.

    Required: width 1..3, ground kind, storeys [{kind, colour}], roof kind,
    roof_colour 0..2. Optional: ends ['left','right']; overlays [{file,x,y}],
    where x/y are relative to the facade's top-left (roof is at negative y).
    An overlay can specify layer='behind_roof' for a flue behind a gable.
    """
    width = spec["width"] * 48
    upper = spec["storeys"]
    if spec["width"] not in (1, 2, 3) or not 0 <= len(upper) <= 4:
        raise ValueError("Expected width 1..3 and 0..4 upper storeys")
    roof_name = f'roof-{spec["roof"]}-w{spec["width"]}-c{spec["roof_colour"]}'
    roof = asset(roof_name)
    # Fixed headroom accommodates flues without changing the 48px floor grid.
    top = 40 + roof.height
    im = Image.new("RGBA", (width, top + (1 + len(upper)) * 48))
    parts = []

    def put(name, x, y, crop=None):
        piece = asset(name)
        if crop:
            piece = piece.crop(crop)
        if x < 0 or y < 0 or x + piece.width > im.width or y + piece.height > im.height:
            raise ValueError(f"Out-of-bounds placement: {name} at {(x, y)}")
        im.alpha_composite(piece, (x, y))
        parts.append(dict(file=name + ".png", x=x, y=y, crop=crop))

    for overlay in spec.get("overlays", []):
        if overlay.get("layer") == "behind_roof":
            put(overlay["file"], overlay["x"], top + overlay["y"])
    put(roof_name, 0, 40)
    panels = [f'ground-{spec["ground"]}-w{spec["width"]}'] + [
        f'storey-{s["kind"]}-w{spec["width"]}-c{s["colour"]}' for s in upper
    ]
    for floor, name in enumerate(panels):
        y = im.height - 48 * (floor + 1)
        put(name, 0, y)
        for side in spec.get("ends", []):
            # All current facades reserve these outer 3px for edge framing.
            # Reveal a native crop of the end strip there; its inner 5px stay
            # behind the source facade. An 8px front overlay cuts shutters.
            # No source window, shutter, sill or course is erased/repainted.
            if side not in ("left", "right"):
                raise ValueError(f"Unknown wall end: {side}")
            x = 0 if side == "left" else width - END_REVEAL
            source_x = 0 if side == "left" else 8 - END_REVEAL
            put("wall-end-" + side, x, y + 1,
                (source_x, 1, source_x + END_REVEAL, 47))
    for overlay in spec.get("overlays", []):
        if overlay.get("layer") != "behind_roof":
            put(overlay["file"], overlay["x"], top + overlay["y"])
    return im, parts


def random_specs(seed, count=12, overlays=True):
    rng = random.Random(seed)
    specs = []
    for i in range(count):
        width, floors = rng.randint(1, 3), rng.randint(1, 5)
        colour = rng.randrange(3)
        # Random permutation avoids stamping the same storey repeatedly.
        kinds = rng.sample(STOREYS, 4)
        previous = specs[-1] if specs else None
        if previous and previous["width"] == width:
            # Reject adjacent identical window patterns at the same elevation.
            while any(a == b["kind"] for a, b in zip(kinds[:floors - 1], previous["storeys"])):
                kinds = rng.sample(STOREYS, 4)
        spec = dict(width=width, ground=rng.choice(GROUNDS),
                    storeys=[dict(kind=k, colour=colour) for k in kinds[:floors - 1]],
                    roof=rng.choice(ROOFS), roof_colour=rng.randrange(3), ends=[], overlays=[])
        if previous and previous["width"] == width:
            spec["ground"] = rng.choice([k for k in GROUNDS if k != previous["ground"]])
            spec["roof"] = rng.choice([k for k in ROOFS if k != previous["roof"]])
        if overlays:
            roof = asset(f'roof-{spec["roof"]}-w{width}-c{spec["roof_colour"]}')
            if rng.random() < .7:
                # Chimney base sits on the visible slope/deck, not in empty sky.
                ch = f"chimney-{rng.randrange(4)}"
                x = width * 48 - 28
                chimney = asset(ch)
                foot = chimney.getchannel("A").crop((0, chimney.height - 1, chimney.width, chimney.height)).getbbox()
                surface = max(next(y for y in range(roof.height) if roof.getpixel((xx, y))[3])
                              for xx in range(x + foot[0], x + foot[2]))
                base = min(roof.height - 5, surface + 10)
                spec["overlays"].append(dict(file=ch, x=x, y=base - roof.height - chimney.height,
                                             layer="behind_roof" if spec["roof"] == "gable" else "front"))
            if width > 1 and spec["roof"] in ("ridge", "hip") and rng.random() < .5:
                dm = f"dormer-{rng.randrange(4)}"
                spec["overlays"].append(dict(file=dm, x=width * 24 - 20, y=-36))
            if floors > 1 and rng.random() < .6:
                fl = f"flowerbox-{rng.randrange(2)}"
                # Mount below the first upper-storey window, above its bottom course.
                spec["overlays"].append(dict(file=fl, x=4, y=(floors - 1) * 48 - asset(fl).height - 2))
        specs.append(spec)
    return specs


def street(specs):
    buildings = [build(s) for s in specs]
    width = sum(im.width for im, _ in buildings)
    height = max(im.height for im, _ in buildings)
    im = grass((width + 32, height + 40))
    recipe = []
    x, baseline = 16, height + 16
    for spec, (building, parts) in zip(specs, buildings):
        y = baseline - building.height
        im.alpha_composite(building, (x, y))
        recipe.append(dict(spec=spec, x=x, y=y, width=building.width, height=building.height, parts=parts))
        x += building.width
    return im, recipe


def asset_sheets():
    groups = {}
    for path in sorted(ASSETS.glob("*.png")):
        name, piece = path.stem, asset(path.stem)
        size = (max(180, piece.width + 16), piece.height + 32)
        overlay = name.startswith(("chimney", "dormer", "sign", "flowerbox"))
        proof = grass(size) if overlay else Image.new("RGBA", size, (74, 81, 72, 255))
        ImageDraw.Draw(proof).text((6, 4), name, fill=(249, 238, 210))
        proof.alpha_composite(piece, (8, 24))
        scales(proof, "piece-" + name, File=path.name, Origin=[8, 24])
        key = name.split("-w")[1][0] if "-w" in name else "overlays-joins"
        groups.setdefault(key, []).append((name, piece))
    for key, pieces in groups.items():
        cw, ch, cols = 180, 100, 4
        size = (cols * cw, ((len(pieces) + cols - 1) // cols) * ch)
        proof = grass(size) if key == "overlays-joins" else Image.new("RGBA", size, (74, 81, 72, 255))
        for i, (name, piece) in enumerate(pieces):
            x, y = i % cols * cw, i // cols * ch
            ImageDraw.Draw(proof).text((x + 4, y + 3), name, fill=(249, 238, 210))
            proof.alpha_composite(piece, (x + 6, y + 24))
        scales(proof, "all-w" + key)
    # No new ground base belongs to C. Show the unchanged summer backdrop literally.
    tile = Image.open(ASSETS.parent / "grass-base.png").convert("RGBA")
    repeat = Image.new("RGBA", (tile.width * 3, tile.height * 3))
    for y in range(3):
        for x in range(3):
            repeat.paste(tile, (x * tile.width, y * tile.height))
    scales(repeat, "repeat-grass-base", Source="out/grass-base.png", Repeat=[3, 3])


def detail_sheets():
    """Mounted joins, overlays and native style comparison, using saved art only."""
    specs = []
    for colour in range(3):
        specs.append(dict(width=3, ground="door", storeys=[dict(kind=k, colour=colour) for k in ("plaster", "timber")],
                          roof="hip", roof_colour=colour, ends=["left", "right"], overlays=[]))
    im, recipe = street(specs)
    scales(im, "wall-ends-mounted", Specs=specs, Placements=recipe)
    # Exercise both ends on every width, storey kind and colourway. Grounds
    # cycle through the remaining kinds; check_mounts covers all ground kinds.
    for width in range(1, 4):
        specs = [dict(width=width, ground=GROUNDS[colour],
                      storeys=[dict(kind=k, colour=colour) for k in STOREYS],
                      roof="gable", roof_colour=colour,
                      ends=["left", "right"], overlays=[]) for colour in range(3)]
        im, recipe = street(specs)
        scales(im, f"wall-ends-w{width}", Specs=specs, Placements=recipe)
    names = [p.stem for p in sorted(ASSETS.glob("*.png")) if p.stem.startswith(("chimney", "dormer", "sign", "flowerbox"))]
    im = grass((4 * 160, 4 * 232))
    placements = []
    for i, name in enumerate(names):
        piece = asset(name)
        if name.startswith("chimney"):
            xy = (24, -asset("roof-ridge-w2-c0").height - piece.height + 14)
        elif name.startswith("dormer"):
            xy = (32, -36)
        elif name.startswith("sign"):
            xy = None  # Registered by the same socket used in streets below.
        else:
            xy = (4, 48 - piece.height - 2)
        spec = dict(width=2, ground="shop", storeys=[dict(kind="timber", colour=0)],
                    roof="ridge", roof_colour=0, ends=[], overlays=[])
        spec["overlays"] = [sign_mount(spec, name) if xy is None
                            else dict(file=name, x=xy[0], y=xy[1])]
        building, parts = build(spec)
        x, y = i % 4 * 160 + 16, i // 4 * 232 + 20
        im.alpha_composite(building, (x, y))
        ImageDraw.Draw(im).text((x, y - 16), name, fill=(30, 30, 30))
        placements.append(dict(spec=spec, x=x, y=y, parts=parts))
    scales(im, "overlays-mounted", Placements=placements)
    # Seed 731 supplies four compatible sockets among twelve mixed buildings.
    # All four signs use the exact same rule as the mounted overlay sheet.
    specs = mounted_specs(731)
    im, recipe = street(specs)
    scales(im, "street-mounts-731", (1, 3, 4), Seed=731, Specs=specs, Placements=recipe)
    im = grass((640, 430))
    for i, name in enumerate(("fantasy-house-1", "fantasy-house-2", "fantasy-hall-3")):
        reference = Image.open(ART / "reference" / "r15" / (name + ".png")).convert("RGBA")
        im.alpha_composite(reference, (12 + i * 210, 24))
        ImageDraw.Draw(im).text((12 + i * 210, 6), name, fill=(30, 30, 30))
    for i, kind in enumerate(("gable", "hip", "ridge")):
        spec = dict(width=i + 1, ground="shop", storeys=[dict(kind="plaster", colour=i)],
                    roof=kind, roof_colour=i, ends=[], overlays=[])
        building, _ = build(spec)
        im.alpha_composite(building, (12 + i * 210, 414 - building.height))
    scales(im, "style-comparison")


def check_assets():
    """Pixel-level invariants. Visual judgement remains a separate review."""
    measured = []
    for path in sorted(ASSETS.glob("*.png")):
        im = asset(path.stem)
        values = list(im.get_flattened_data())
        assert all(c[3] in (0, 255) for c in values), path
        assert all(c[:3] == (0, 0, 0) for c in values if not c[3]), path
        facade = path.stem.startswith(("ground-", "storey-", "corner-", "wall-end-"))
        if facade:
            assert im.height == 48 and all(c[3] == 255 for c in values), path
        if facade or path.stem.startswith("roof-"):
            expected = [(43, 40, 29, 255)] + [(98, 66, 38, 255)] * (im.width - 2) + [(43, 40, 29, 255)]
            assert list(im.crop((0, im.height - 1, im.width, im.height)).get_flattened_data()) == expected, path
            if facade:
                assert list(im.crop((0, 0, im.width, 1)).get_flattened_data()) == expected, path
        measured.append(dict(file=path.name, size=im.size, bounds=im.getbbox(),
                             colours=len({c[:3] for c in values if c[3]}), sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
    return measured


def check_mounts():
    """Regress the critic's occluded shutters and signs across entrances.

    Compare the actual assembled image with source pixels, rather than just
    checking placement bounds. Full facade interiors and courses must survive
    either/both ends. Signs must leave complete window/sill regions and the
    whole ground floor unchanged, and their bracket must touch source timber.
    """
    end_cases = sign_cases = 0
    for width in range(1, 4):
        for ground in GROUNDS:
            for colour in range(3):
                spec = dict(width=width, ground=ground,
                            storeys=[dict(kind=k, colour=colour) for k in STOREYS],
                            roof="hip", roof_colour=colour, overlays=[])
                bare, _ = build(spec)
                for ends in (["left"], ["right"], ["left", "right"]):
                    mounted, _ = build(dict(spec, ends=ends))
                    for floor in range(5):
                        y = bare.height - 48 * (floor + 1)
                        # Native source framing ends at x=2 and W-3. Everything
                        # inward, including all shutters, must remain exact.
                        box = (3, y, bare.width - 3, y + 48)
                        assert mounted.crop(box).tobytes() == bare.crop(box).tobytes(), (width, ground, colour, ends, floor)
                        for row in (y, y + 47):
                            box = (0, row, bare.width, row + 1)
                            assert mounted.crop(box).tobytes() == bare.crop(box).tobytes()
                    assert mounted.size == bare.size
                    assert mounted.getchannel("A").tobytes() == bare.getchannel("A").tobytes()
                    assert mounted.tobytes() != bare.tobytes(), "Wall ends must actually be mounted"
                    end_cases += 1
    for colour in range(3):
        for upper_count in range(1, 5):
            for timber_floor in range(upper_count):
                upper = [dict(kind="plaster", colour=colour) for _ in range(upper_count)]
                upper[timber_floor] = dict(kind="timber", colour=colour)
                spec = dict(width=2, ground="shop", storeys=upper,
                            roof="ridge", roof_colour=colour, ends=["left", "right"])
                bare, _ = build(spec)
                for index in range(4):
                    overlay = sign_mount(spec, f"sign-{index}")
                    mounted, _ = build(dict(spec, overlays=[overlay]))
                    ground_y = bare.height - 48
                    box = (0, ground_y, 96, bare.height)
                    assert mounted.crop(box).tobytes() == bare.crop(box).tobytes(), "Sign occludes ground entrance/display"
                    host_y = ground_y - (timber_floor + 1) * 48
                    # Conservative source-derived window/shutter/sill bounds.
                    for left, right in ((10, 33), (62, 85)):
                        box = (left, host_y + 6, right, host_y + 38)
                        assert mounted.crop(box).tobytes() == bare.crop(box).tobytes(), "Sign occludes upper window"
                    # Bracket wall plate occupies local x=3..8, y=6..17.
                    source = asset(f"storey-timber-w2-c{colour}")
                    sign = asset(f"sign-{index}")
                    contact = 0
                    for y in range(6, 18):
                        for x in range(3, 9):
                            r, g, b, a = source.getpixel((33 + x, 6 + y))
                            if sign.getpixel((x, y))[3] and r > g > b and r - b > 35 and g < 150:
                                contact += 1
                    assert contact >= 3, "Sign bracket has no timber attachment"
                    assert mounted.tobytes() != bare.tobytes(), "Sign must be visible"
                    sign_cases += 1
    return dict(wall_end_buildings=end_cases, sign_mounts=sign_cases)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--seed", type=int, default=15062026)
    parser.add_argument("--seed2", type=int, default=15112026)
    parser.add_argument("--count", type=int, default=12)
    parser.add_argument("--no-overlays", action="store_true")
    parser.add_argument("--no-sheets", action="store_true")
    parser.add_argument("--mounts", action="store_true", help="Exercise both wall ends and inspected hanging-sign sockets")
    parser.add_argument("--check-only", action="store_true", help="Check asset invariants and mounting regressions without writing proofs")
    parser.add_argument("--replay", type=Path, help="Replay Specs metadata from a saved native street PNG")
    args = parser.parse_args()
    if args.count < 1:
        parser.error("--count must be positive")
    measurements = check_assets()
    mounts = check_mounts()
    if args.check_only:
        print(f"PASS: {len(measurements)} assets; {mounts}")
        return
    if args.replay:
        specs = json.loads(Image.open(args.replay).info["Specs"])
        im, recipe = street(specs)
        scales(im, "street-replay", (1, 3), Specs=specs, Placements=recipe, Measurements=measurements)
        return
    for seed in (args.seed, args.seed2):
        specs = (mounted_specs if args.mounts else random_specs)(seed, args.count, not args.no_overlays)
        im, recipe = street(specs)
        name = f"street-{'mounts-' if args.mounts else ''}{seed}"
        scales(im, name, (1, 3), Seed=seed, Specs=specs, Placements=recipe, Measurements=measurements)
        print(f"street seed {seed}: {len(specs)} buildings, {im.width}x{im.height}")
    tall = dict(width=3, ground="shop", storeys=[dict(kind=k, colour=0) for k in ("stone", "plaster", "jetty", "timber")],
                roof="gable", roof_colour=0, ends=[], overlays=[])
    im, recipe = street([tall])
    scales(im, "five-storey", (1, 4, 8), Specs=[tall], Placements=recipe, Measurements=measurements)
    if not args.no_sheets:
        asset_sheets()
        detail_sheets()
    save(Image.new("RGB", (1, 1), (74, 81, 72)), "measurements", Measurements=measurements)
    print(f"Validated {len(measurements)} assets; proofs saved under {REVIEW}")


if __name__ == "__main__":
    main()
