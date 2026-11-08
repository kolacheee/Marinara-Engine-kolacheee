#!/usr/bin/env python3
"""Run one request list through gen.sh, 3 at a time, generating each day/night twin after its source.

usage: run_batch.py requests-batchN.md [persona/name ...]   (names limit the run; default all)
Lines: `<persona>/<file>.png | WxH | transparent? | prompt`.
"""
import subprocess, sys, threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WORK, R3 = ROOT / "work", ROOT / "work" / "_r3"
SKIP = set()
# regen lines whose brief says to keep the delivered shape: edit the current image instead of starting over
EDIT = set()

# twin <- source: the twin is an edit of the source's raw, so the pair lines up
TWINS = {
    "neon/backdrop-day-portrait": "neon/backdrop-night-portrait",
    "maximal/backdrop-night-portrait": "maximal/backdrop-day-portrait",
}
# r5: style/content references from the delivered round-4 images (persona/name under images/)
REFS = {
    "neon/backdrop-night-portrait": ["neon/backdrop-night"],
    "maximal/backdrop-day-portrait": ["maximal/backdrop-day"],
    "maximal/avatar-defaults": ["maximal/portraits", "maximal/emblem"],
    "maximal/petals-gutter": ["maximal/stickers"],
    "creator/avatar-defaults": ["creator/backdrop-day-v2", "creator/sidebar-foot"],
    "immersion/avatar-defaults": ["immersion/char-seraphine"],
}


def parse(path):
    jobs = {}
    for line in Path(path).read_text().splitlines():
        if not line.strip():
            continue
        name, size, alpha, prompt = [s.strip() for s in line.split(" | ", 3)]
        key = name.removesuffix(".png")
        w, h = map(int, size.split("x"))
        jobs[key] = dict(w=w, h=h, alpha=alpha.lower().startswith(("y", "transp")), prompt=prompt)
    return jobs


def hint(j):
    r = j["w"] / j["h"]
    shape = "square" if 0.8 < r < 1.25 else ("landscape, as wide as the tool allows" if r > 1 else "portrait, as tall as the tool allows")
    t = f" Final use size {j['w']}x{j['h']} px (aspect {r:.2f}:1), so make the image {shape} and keep every important element inside that aspect."
    if j["alpha"]:
        t += " Output a PNG with a real transparent alpha background (no checkerboard, no white or coloured backdrop)."
    return t


def main():
    jobs = parse(sys.argv[1])
    only = set(sys.argv[2:])
    keys = [k for k in jobs if k not in SKIP and (not only or k in only)]
    done = {k: threading.Event() for k in keys}
    pool = ThreadPoolExecutor(3)

    def run(k):
        j = jobs[k]
        src = TWINS.get(k)
        if src in done:
            done[src].wait()
        p, n = k.split("/")
        ref, mode = "", ""
        if src and (WORK / src / "raw.png").exists():
            ref, mode = str(WORK / src / "raw.png"), "twin"
            if k == "neon/backdrop-day-portrait":  # relight target look
                ref += "," + str(ROOT / "images/neon/backdrop-day.png")
            if k == "maximal/backdrop-night-portrait":
                ref += "," + str(ROOT / "images/maximal/backdrop-night.png")
        elif k in REFS:
            ref, mode = ",".join(str(ROOT / "images" / f"{r}.png") for r in REFS[k]), "ref"
        elif j["prompt"].startswith("REGEN"):
            cur = ROOT / "images" / f"{k}.png"  # the current delivered image; round 3's if this round has none yet
            old = cur if cur.exists() else R3 / f"{k}.png"
            if old.exists():
                ref, mode = str(WORK / k / "ref-current.png"), ("twin" if k in EDIT else "regen")
                (WORK / k).mkdir(parents=True, exist_ok=True)
                Path(ref).write_bytes(old.read_bytes())
        prev = WORK / k / "raw.png"
        if prev.exists():
            n_old = len(list((WORK / k).glob("raw-prev*.png")))
            prev.rename(WORK / k / f"raw-prev{n_old + 1}.png")
        args = ["bash", str(ROOT / "gen.sh"), p, n, j["prompt"] + hint(j)] + ([ref, mode] if ref else [])
        print("start", k, mode or "fresh", flush=True)
        subprocess.run(args)
        print("done ", k, (WORK / k / "raw.png").exists(), flush=True)
        done[k].set()

    # sources first so their twins are not stuck waiting behind a full pool
    order = sorted(keys, key=lambda k: k in TWINS)
    list(pool.map(run, order))


if __name__ == "__main__":
    main()
