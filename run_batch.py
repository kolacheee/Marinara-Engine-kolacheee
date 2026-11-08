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
SKIP = {"minimal/game-stage"}  # exact geometry: drawn by draw_minimal.py, not generated
# regen lines whose brief says to keep the delivered shape: edit the current image instead of starting over
EDIT = {"cozy/washi-tape"}

# twin <- source: the twin is an edit of the source's raw, so the pair lines up
TWINS = {
    "access/backdrop-night": "access/backdrop-day",
    "access/horizon-strip-night": "access/horizon-strip-day",
    "access/sprig-night": "access/sprig-day",
    "immersion/backdrop-day": "immersion/backdrop-night",
    "creator/backdrop-night-v2": "creator/backdrop-day-v2",
    "creator/topbar-band-night": "creator/topbar-band-day",
    "cozy/backdrop-night": "cozy/backdrop-day",
    "neon/backdrop-day": "neon/backdrop-night",
    "maximal/backdrop-night": "maximal/backdrop-day",
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
