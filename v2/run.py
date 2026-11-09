#!/usr/bin/env python3
"""New starter themes: run one v2/requests-<name>.md through gen.sh, 3 at a time.

usage: run6.py r6/requests-batchN.md [persona/name ...]   (names limit the run; default all)

Line forms (blank lines and `## ` headings skipped):
  <persona>/<file>.png | WxH | alpha | prompt                  fresh, or style refs if the prompt names other images
  ... | REGEN: ...                                             current v2/current image is the reference:
                                                               an edit ("edit of the current") or a what-went-wrong ref
  relight A.png -> B.png | ...                                 B is a twin edit of A (A's new raw if A is in the batch)
  relight A.png | ... make B.png as a relight ...              same, target named in the prompt
Any other persona/file.png named in a prompt is passed as a style reference: the NEW raw if it is
generated in this batch (the job waits for it), else the v2/current or r6/images copy.
"""
import re, subprocess, sys, threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORK, CUR, OUT = ROOT / "work", ROOT / "v2" / "current", ROOT / "v2" / "images"
MENTION = re.compile(r"\b([a-z]+/[a-z0-9-]+)\.png")


def parse(path):
    jobs = {}
    for line in Path(path).read_text().splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        head, size, alpha, prompt = [s.strip() for s in line.split(" | ", 3)]
        src = None
        if head.startswith("relight "):
            body = head[len("relight "):]
            if "->" in body:
                a, b = [x.strip() for x in body.split("->")]
            else:
                a = body.strip()
                m = re.search(r"make ([a-z]+/[a-z0-9-]+\.png)", prompt)
                b = m.group(1) if m else a.replace("day", "night")
            src, key = a.removesuffix(".png"), b.removesuffix(".png")
        else:
            key = head.removesuffix(".png")
        w, h = map(int, size.split("x"))
        jobs[key] = dict(w=w, h=h, alpha=alpha.lower().startswith(("y", "transp")), prompt=prompt, src=src)
    return jobs


def hint(j):
    r = j["w"] / j["h"]
    shape = "square" if 0.8 < r < 1.25 else ("landscape, as wide as the tool allows" if r > 1 else "portrait, as tall as the tool allows")
    t = f" Final use size {j['w']}x{j['h']} px (aspect {r:.2f}:1), so make the image {shape} and keep every important element inside that aspect."
    if j["alpha"]:
        t += " Output a PNG with a real transparent alpha background (no checkerboard, no white or coloured backdrop)."
    return t


def existing(k):
    for d in (OUT, CUR):
        if (d / f"{k}.png").exists():
            return d / f"{k}.png"
    return None


def main():
    jobs = parse(sys.argv[1])
    only = set(sys.argv[2:])
    keys = [k for k in jobs if not only or k in only]
    done = {k: threading.Event() for k in keys}

    def deps(k):
        j = jobs[k]
        d = [m for m in MENTION.findall(j["prompt"]) if m != k and m in done]
        if j["src"] in done:
            d.append(j["src"])
        return d

    def newest(k):  # a batch-mate's fresh raw, else the delivered/current image
        r = WORK / k / "raw.png"
        return r if k in done and r.exists() else existing(k)

    def run(k):
        for d in deps(k):
            done[d].wait()
        j = jobs[k]
        p, n = k.split("/")
        styles = [m for m in dict.fromkeys(MENTION.findall(j["prompt"])) if m not in (k, j["src"])]
        style_paths = [str(x) for x in (newest(m) for m in styles) if x]
        refs, mode = [], ""
        if j["src"]:
            refs, mode = [str(newest(j["src"]))], "twin"
            look = existing(k) or (style_paths[0] if style_paths else None)
            if look:  # the current target (or a named night image) shows the lighting/palette to match
                refs.append(str(look))
        elif j["prompt"].startswith("REGEN"):
            cur = existing(k)
            mode = "twin" if "edit of the current" in j["prompt"][:80] else "regen"
            if cur:
                (WORK / k).mkdir(parents=True, exist_ok=True)
                ref = WORK / k / "ref-current.png"
                ref.write_bytes(cur.read_bytes())
                refs = [str(ref)] + (style_paths if mode == "regen" else [])
        elif style_paths:
            refs, mode = style_paths, "ref"
        prev = WORK / k / "raw.png"
        if prev.exists():
            n_old = len(list((WORK / k).glob("raw-prev*.png")))
            prev.rename(WORK / k / f"raw-prev{n_old + 1}.png")
        args = ["bash", str(ROOT / "gen.sh"), p, n, j["prompt"] + hint(j)] + ([",".join(refs), mode] if refs else [])
        print("start", k, mode or "fresh", [Path(r).name for r in refs], flush=True)
        subprocess.run(args)
        print("done ", k, (WORK / k / "raw.png").exists(), flush=True)
        done[k].set()

    # topological order: a job only waits on jobs already started, so no deadlock
    depth = {}
    def dep_depth(k):
        if k not in depth:
            depth[k] = 1 + max((dep_depth(d) for d in deps(k)), default=-1)
        return depth[k]
    order = sorted(keys, key=dep_depth)
    with ThreadPoolExecutor(3) as pool:
        list(pool.map(run, order))


if __name__ == "__main__":
    main()
