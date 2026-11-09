#!/usr/bin/env python3
"""Rebuild themes/index.json from the theme packages in this folder.

usage: python3 themes/build-index.py      (run after adding, removing or changing a theme file)

Each entry carries the file's exact size and sha256 (the app refuses a download that doesn't match),
the theme's name and details, and a small preview made from the theme's thumbnail.
"""
import base64, hashlib, io, json, sys
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ORDER_FIRST = []  # optional: gallery ids to list first; the rest are alphabetical


def preview(data_url):
    if not data_url:
        return None
    raw = base64.b64decode(data_url.split(",", 1)[1])
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    im.thumbnail((480, 270), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, "WEBP", quality=78, method=6)
    return "data:image/webp;base64," + base64.b64encode(out.getvalue()).decode()


entries = []
for path in sorted(HERE.glob("*.json")):
    if path.name == "index.json":
        continue
    blob = path.read_bytes()
    theme = json.loads(blob)
    if theme.get("kind") != "marinara.theme":
        sys.exit(f"{path.name}: not a marinara.theme package")
    entry = {
        "id": path.stem,
        "file": path.name,
        "name": theme["name"],
        "author": theme.get("author"),
        "version": theme.get("version"),
        "description": theme.get("description"),
        "colorScheme": theme.get("colorScheme"),
        "labels": theme.get("labels"),
        "preview": preview(theme.get("thumbnail")),
        "bytes": len(blob),
        "sha256": hashlib.sha256(blob).hexdigest(),
    }
    entries.append({k: v for k, v in entry.items() if v is not None})

entries.sort(key=lambda e: (e["id"] not in ORDER_FIRST, ORDER_FIRST.index(e["id"]) if e["id"] in ORDER_FIRST else 0, e["name"].lower()))
(HERE / "index.json").write_text(json.dumps({"formatVersion": 1, "themes": entries}, ensure_ascii=False, indent=1) + "\n")
print(f"{len(entries)} themes, index {(HERE / 'index.json').stat().st_size // 1024} KB")
