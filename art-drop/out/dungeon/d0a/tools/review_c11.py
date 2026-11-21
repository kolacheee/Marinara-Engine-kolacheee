"""Refresh Part C diagnostics without modifying artwork.

Critic 11 explicitly rejects the old flat-square coverage acceptance rule.
Keep its measurements as diagnostics, but do not require noisy surfaces.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image

from draw_proofs import BASE, REVIEW, S
from review_c9 import lone_pixels
from review_c7 import run as contact_reviews
import check_operator_c as checks


def run():
    checks.BODY.update({
        "temple": [("brass", 4)], "cave_crystal": [("dark-rock", 6)],
        "crypt": [("dark-masonry", 6)], "cave_lava": [("ash", 5), ("ash", 2)],
        "station_hydro": [("planters", 4), ("planters", 5),
                          ("overgrowth", 4), ("overgrowth", 5)],
    })
    report = checks.run()
    for name, stats in report["results"].items():
        stats["checks"].pop("coverage_8px")
        floor = Image.open(REVIEW / f"C-layer-{name}-floor.png").convert("RGBA")
        wall = Image.open(REVIEW / f"C-layer-{name}-wall.png").convert("RGBA")
        surface = floor.copy()
        surface.paste(wall, (0, 0))
        proof = Image.open(BASE / f"proof/{name}.png")
        stats["lone_pixels"] = {region: lone_pixels(im) for region, im in (
            ("surface", surface), ("proof", proof),
            ("top", wall.crop((0, 8, 144, 48))),
            ("face", wall.crop((0, 48, 144, 95))), ("floor", floor),
        )}
        stats["checks"]["lone_pixel_ceiling_3pct"] = all(
            item["percent"] <= 3 for item in stats["lone_pixels"].values()
        )
        repeat = Image.new("RGBA", (floor.width * 3, floor.height * 3))
        for y in range(3):
            for x in range(3):
                repeat.paste(floor, (x * floor.width, y * floor.height))
        repeat.save(REVIEW / f"proof-3x3repeat-{name}.png")
    report["failures"] = [
        f"{name}: {key}" for name, stats in report["results"].items()
        for key, passed in stats["checks"].items() if not passed
    ]
    report["pass"] = not report["failures"]
    report["notes"] += [
        "Numeric pass is not artistic acceptance. See critic-C-11.json.",
        "Flat-square coverage is diagnostic only, per critic 11; calm fill is required.",
    ]
    before = json.loads((REVIEW / "C11-start-hashes.json").read_text())
    report["changed_existing_art"] = [
        name for name, digest in before.items() if name.endswith(".png")
        and hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest
    ]
    (REVIEW / "C11-current-validation.json").write_text(json.dumps(report, indent=2) + "\n")
    contact_reviews()
    print(json.dumps({
        "numeric_pass": report["pass"], "failures": report["failures"],
        "changed_existing_art": report["changed_existing_art"],
        "lone_pixel_percent_by_tile": {
            n: s["lone_pixels"]["surface"]["percent"] for n, s in report["results"].items()
        },
    }, indent=2))
    return report


if __name__ == "__main__":
    raise SystemExit(0 if run()["pass"] else 1)
