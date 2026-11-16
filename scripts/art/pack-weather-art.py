#!/usr/bin/env python3
# ──────────────────────────────────────────────
# Weather drawn on the overworld (art round 16, BRIEF-16): packs the approved weather overlays into one
# sheet the overworld loads beside its tiles. They are the same for every setting, so they are not part of a
# family's tile pack.
#
#   python3 scripts/art/pack-weather-art.py <art-drop/out/weather16>
#
# Writes packages/client/public/images/overworld-weather/weather.png and weather.json
# ({"version", "cell": 48, "frames": {name: [x, y, w, h]}}). The fog tile (fog-f0..f3) is left out: it failed
# its critic, and the overworld draws fog from the clouds and the fog edges instead.
# ──────────────────────────────────────────────
import json
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
OUT = os.path.join(ROOT, "packages", "client", "public", "images", "overworld-weather")
LEFT_OUT = {"fog-f0", "fog-f1", "fog-f2", "fog-f3"}
WIDTH = 1024


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__ or "usage: pack-weather-art.py <dir>")
    source = sys.argv[1]
    names = sorted(
        name[:-4]
        for name in os.listdir(source)
        if name.endswith(".png") and not name.startswith("icon-") and name[:-4] not in LEFT_OUT
    )
    images = {name: Image.open(os.path.join(source, f"{name}.png")).convert("RGBA") for name in names}
    # Tallest first on shelves, a pixel apart so no frame bleeds into the next when drawn scaled.
    order = sorted(names, key=lambda name: (-images[name].height, name))
    frames: dict[str, list[int]] = {}
    x = y = shelf = 0
    for name in order:
        image = images[name]
        if x + image.width > WIDTH:
            x, y, shelf = 0, y + shelf + 1, 0
        frames[name] = [x, y, image.width, image.height]
        x += image.width + 1
        shelf = max(shelf, image.height)
    sheet = Image.new("RGBA", (WIDTH, y + shelf), (0, 0, 0, 0))
    for name, (fx, fy, _w, _h) in frames.items():
        sheet.paste(images[name], (fx, fy))
    os.makedirs(OUT, exist_ok=True)
    sheet.save(os.path.join(OUT, "weather.png"), optimize=True)
    with open(os.path.join(OUT, "weather.json"), "w", encoding="utf8") as handle:
        json.dump({"version": 1, "cell": 48, "frames": dict(sorted(frames.items()))}, handle, separators=(",", ":"))
        handle.write("\n")
    print(f"{len(frames)} frames, sheet {WIDTH}x{y + shelf}")


if __name__ == "__main__":
    main()
