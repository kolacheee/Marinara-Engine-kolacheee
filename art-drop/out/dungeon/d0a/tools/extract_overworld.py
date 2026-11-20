"""Extract the summer references without changing a single source pixel."""
import base64
import hashlib
import io
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[5]
REF = ROOT / "art-drop/dungeon/reference"
REVIEW = ROOT / "art-drop/review-d0a"
SOURCE = "fork/claude/project-thread-vsyxr6:packages/server/src/assets/overworld-art/fantasy.json"


def main():
    from PIL import Image

    raw = subprocess.check_output(["git", "show", SOURCE], cwd=ROOT)
    data = json.loads(raw)
    assert data["tileSize"] == 48
    sheets = {s["id"]: Image.open(io.BytesIO(base64.b64decode(s["png"].split(",", 1)[1])))
              for s in data["sheets"]}
    report = {"source": SOURCE, "json_sha256": hashlib.sha256(raw).hexdigest(), "crops": []}
    # Unseasoned keys are summer. 'street' is the rounded cobble pattern;
    # 'square' is paving, so it is not substituted for cobble.
    source_checks = {}
    for key in ("grass", "path_joined", "street"):
        for index, tile in enumerate(data["tiles"][key]):
            x, y = tile["x"] * 48, tile["y"] * 48
            w, h = tile.get("w", 1) * 48, tile.get("h", 1) * 48
            source = sheets[tile["sheet"]]
            assert x + w <= source.width and y + h <= source.height
            crop = source.crop((x, y, x + w, y + h))
            target = REF / f"overworld-{key}-{index}.png"
            if target.exists():
                assert Image.open(target).convert("RGBA").tobytes() == crop.convert("RGBA").tobytes()
            else:
                crop.save(target)
            assert Image.open(target).convert("RGBA").tobytes() == crop.convert("RGBA").tobytes()
            rgba = crop.convert("RGBA")
            pixels = rgba.load()
            colors = rgba.getcolors(w * h)
            singletons = sum(
                1 for cy in range(1, h-1) for cx in range(1, w-1)
                if pixels[cx, cy][3] and all(pixels[cx+dx, cy+dy] != pixels[cx, cy]
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1))))
            source_checks[target.name] = {
                "size": [w,h], "colours_including_transparency": len(colors),
                "alpha_values": sorted({c[3] for _,c in colors}),
                "nonzero_transparent_rgb": sum(n for n,c in colors if c[3] == 0 and c[:3] != (0,0,0)),
                "interior_4_neighbor_singletons_in_unchanged_source": singletons}
            assert all(c[3] in (0,255) for _,c in colors)
            assert source_checks[target.name]["nonzero_transparent_rgb"] == 0
            report["crops"].append({"file": target.name, "sheet": tile["sheet"],
                                    "box_px": [x, y, x + w, y + h], "size": [w, h],
                                    "rgba_sha256": hashlib.sha256(crop.convert("RGBA").tobytes()).hexdigest()})
    REVIEW.mkdir(parents=True, exist_ok=True)
    (REVIEW / "A-overworld-provenance.json").write_text(json.dumps(report, indent=2) + "\n")
    (REVIEW / "A-source-checks.json").write_text(json.dumps(source_checks, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
