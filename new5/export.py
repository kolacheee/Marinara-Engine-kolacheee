#!/usr/bin/env python3
"""Copy each work/<persona>/<name>/raw.png of this batch to new5/raw/<persona>/<name>.webp (lossy q94, small
enough to push; the cloud side does the exact crops, tiling and alpha clean-up).
usage: export.py new5/requests-batchN.md"""
import sys
from pathlib import Path
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from run import parse  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
for key in parse(sys.argv[1]):
    raw = ROOT / "work" / key / "raw.png"
    out = ROOT / "new5" / "raw" / f"{key}.webp"
    if not raw.exists():
        print("MISSING", key); continue
    out.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(raw)
    im.save(out, "WEBP", quality=94, method=5, lossless=False, exact=im.mode == "RGBA")
    print("ok", key, im.size, im.mode)
