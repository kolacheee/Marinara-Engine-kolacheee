"""Reject image-tool sources that cannot be read as exact native 2x pixels.

This diagnostic never resamples, quantizes, or writes scene art. All four
possible grid origins are measured before any palette conversion.
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[5]
REVIEW = ROOT / "art-drop/review-d0a"
MASTER = ROOT / "art-drop/dungeon/reference/master-interiors-mock.png"


def inspect(path):
    im = Image.open(path).convert("RGBA")
    pixels = im.load()
    phases = []
    for oy in range(2):
        for ox in range(2):
            total = identical = 0
            for y in range(oy, im.height - 1, 2):
                for x in range(ox, im.width - 1, 2):
                    total += 1
                    identical += (pixels[x, y] == pixels[x + 1, y]
                                  == pixels[x, y + 1] == pixels[x + 1, y + 1])
            phases.append({"origin": [ox, oy], "blocks": total,
                           "identical_blocks": identical,
                           "identical_percent": round(100 * identical / total, 4)})
    colours = set(im.get_flattened_data())
    return {"file": str(path.relative_to(ROOT)), "size": list(im.size),
            "colours": len(colours), "binary_alpha": all(c[3] in (0, 255) for c in colours),
            "phases": phases, "exact_2x_grid": any(p["identical_blocks"] == p["blocks"] for p in phases),
            "requested_288_canvas": im.size == (288, 288)}


def review(path):
    # Exact crops only. Enlargements and the explicitly requested squint are
    # diagnostic nearest-neighbour copies and never feed back into scene art.
    im = Image.open(path).convert("RGB")
    source = im.crop((352, 352, 448, 448))
    master = Image.open(MASTER).convert("RGB").crop((704, 64, 800, 160))
    sheet = Image.new("RGB", (1056, 512), "#222630")
    d = ImageDraw.Draw(sheet)
    d.text((12, 8), path.stem + " / REJECTED: no registered 2x grid", fill="white")
    for row, (label, crop) in enumerate((("Generated source pixels", source), ("Master source pixels (2x storage)", master))):
        y = 40 + row * 230
        d.text((12, y), label, fill="white")
        for scale, x in ((1, 12), (2, 128)):
            pic = crop.resize((96 * scale, 96 * scale), Image.Resampling.NEAREST)
            sheet.paste(pic, (x, y + 20))
        sheet.paste(crop.convert("L"), (670, y + 20))
        sheet.paste(crop.convert("L").resize((24, 24), Image.Resampling.NEAREST), (790, y + 20))
    sheet.save(REVIEW / (path.stem.replace("-source", "") + "-diagnostic.png"))
    zoom = Image.new("RGB", (612, 328), "#222630")
    zd = ImageDraw.Draw(zoom)
    zd.text((12, 8), "Rejected source crop 3x / master crop 3x; source pixels preserved", fill="white")
    zoom.paste(source.resize((288, 288), Image.Resampling.NEAREST), (12, 28))
    zoom.paste(master.resize((288, 288), Image.Resampling.NEAREST), (312, 28))
    zoom.save(REVIEW / (path.stem.replace("-source", "") + "-3x.png"))


if __name__ == "__main__":
    paths = sorted(REVIEW.glob("C-op2-keep-variant-*-source.png"))
    results = [inspect(p) for p in paths]
    for path in paths:
        review(path)
    report = {"status": "blocked" if not any(r["exact_2x_grid"] and r["requested_288_canvas"] for r in results) else "candidate",
              "master_control": inspect(MASTER), "generated_sources": results,
              "note": "Failed source pixels are not imported, resized or palette-locked into deliverables."}
    (REVIEW / "C-op2-source-grid.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    raise SystemExit(1 if report["status"] == "blocked" else 0)
