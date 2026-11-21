"""Audit critic 10 artwork and candidates without importing rejected pixels."""
import hashlib
import json
from pathlib import Path

from PIL import Image

from draw_proofs import BASE, REVIEW, S
from check_op2_source_grid import MASTER, inspect, review
from review_c9 import lone_pixels
from review_c7 import run as contact_reviews
import check_operator_c as checks


def run():
    sources = sorted(REVIEW.glob("C10-keep-variant-*-source.png"))
    source_results = [inspect(p) for p in sources]
    for path in sources:
        review(path)
    (REVIEW / "C10-source-grid.json").write_text(json.dumps({
        "master": inspect(MASTER), "candidates": source_results,
        "accepted": [r["file"] for r in source_results
                     if r["exact_2x_grid"] and r["requested_288_canvas"]],
    }, indent=2) + "\n")
    checks.BODY.update({
        "temple": [("brass", 4)], "cave_crystal": [("dark-rock", 6)],
        "crypt": [("dark-masonry", 6)], "cave_lava": [("ash", 5), ("ash", 2)],
        "station_hydro": [("planters", 4), ("planters", 5),
                          ("overgrowth", 4), ("overgrowth", 5)],
    })
    lone = {}
    for name in S:
        floor = Image.open(REVIEW / f"C-layer-{name}-floor.png").convert("RGBA")
        wall = Image.open(REVIEW / f"C-layer-{name}-wall.png").convert("RGBA")
        surface = floor.copy()
        surface.paste(wall, (0, 0))
        proof = Image.open(BASE / f"proof/{name}.png")
        lone[name] = {region: lone_pixels(im) for region, im in (
            ("surface", surface), ("proof", proof),
            ("top", wall.crop((0, 8, 144, 48))),
            ("face", wall.crop((0, 48, 144, 95))), ("floor", floor),
        )}
        repeat = Image.new("RGBA", (floor.width * 3, floor.height * 3))
        for y in range(3):
            for x in range(3):
                repeat.paste(floor, (x * floor.width, y * floor.height))
        repeat.save(REVIEW / f"proof-3x3repeat-{name}.png")
    report = checks.run()
    report["lone_pixels"] = lone
    report["lone_pixel_ceiling_pass"] = all(
        region["percent"] <= 3 for look in lone.values() for region in look.values()
    )
    report["art_status"] = "critic 10 failures unresolved; candidates rejected before import"
    before = json.loads((REVIEW / "C10-start-hashes.json").read_text())
    report["changed_existing_art"] = [
        name for name, digest in before.items() if name.endswith(".png")
        and hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest
    ]
    (REVIEW / "C10-current-validation.json").write_text(json.dumps(report, indent=2) + "\n")
    contact_reviews()
    print(json.dumps({"source_candidates": len(sources),
                      "lone_pixel_ceiling_pass": report["lone_pixel_ceiling_pass"],
                      "changed_existing_art": report["changed_existing_art"]}))


if __name__ == "__main__":
    run()
