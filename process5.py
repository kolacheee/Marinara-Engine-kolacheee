#!/usr/bin/env python3
"""Round 5: work/<persona>/<name>/raw.png -> images/<persona>/<name>.png at the exact size (recipes5.py).

usage: process5.py [persona/name ...]
"""
import sys
from process4 import WORK, save


def run(only):
    from recipes5 import RECIPES
    for k, f in RECIPES.items():
        if only and k not in only:
            continue
        if not (WORK / k / "raw.png").exists():
            print("skip (no raw)", k); continue
        save(f(), k)


if __name__ == "__main__":
    run(set(sys.argv[1:]))
