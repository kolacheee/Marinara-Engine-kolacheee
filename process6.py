#!/usr/bin/env python3
"""Round 6: work/<persona>/<name>/raw.png -> r6/images/<persona>/<name>.png at the exact size (recipes6.py).

usage: process6.py [persona/name ...]
"""
import sys
from pathlib import Path
import process as P

P.OUT = Path(__file__).resolve().parent / "r6" / "images"  # process.save writes under P.OUT
from process4 import WORK, save  # noqa: E402


def run(only):
    from recipes6 import RECIPES
    for k, f in RECIPES.items():
        if only and k not in only:
            continue
        if not (WORK / k / "raw.png").exists():
            print("skip (no raw)", k); continue
        save(f(), k)


if __name__ == "__main__":
    run(set(sys.argv[1:]))
