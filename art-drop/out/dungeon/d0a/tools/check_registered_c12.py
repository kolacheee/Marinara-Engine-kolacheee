"""Measure source grid evidence before any palette conversion or art import.

Only review diagnostics are written. No resize, filtering or art drawing.
"""
import argparse
import json
from pathlib import Path

from collections import Counter
from math import cos, sin, pi, atan2
from statistics import median
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[4]
REVIEW = ROOT / 'review-d0a'


def axis_grid(im, axis):
    width, height = im.size
    px = im.load()
    length = width if axis == 1 else height
    cross = height if axis == 1 else width
    # Sample every third scanline; no source pixels are modified.
    hist = []
    for i in range(1, length):
        total = 0
        for j in range(0, cross, 3):
            a, b = (px[i, j], px[i-1, j]) if axis == 1 else (px[j, i], px[j, i-1])
            total += max(abs(a[k]-b[k]) for k in range(3))
        hist.append(total)
    cap = sorted(hist)[int(len(hist)*.9)]
    hist = [min(v, cap) for v in hist]
    best = None
    for step in range(401):
        pitch = 4 + step * .02
        re = sum(v*cos(2*pi*(i+1)/pitch) for i,v in enumerate(hist))
        imag = sum(v*sin(2*pi*(i+1)/pitch) for i,v in enumerate(hist))
        strength = (re*re+imag*imag)**.5
        if best is None or strength > best[0]:
            best = strength,pitch,atan2(imag,re)*pitch/(2*pi)%pitch
    return {'pitch': best[1], 'phase': best[2], 'edge_coherence': best[0]/max(sum(hist),1)}


def boundaries(length, grid):
    result = []
    pos = grid['phase']
    while pos < length:
        result.append(round(pos))
        pos += grid['pitch']
    return result


def blocks(im, gx, gy):
    xs, ys = boundaries(im.width,gx), boundaries(im.height,gy)
    dominant, tolerant = [], []
    px = im.load()
    for y0,y1 in zip(ys[:-1],ys[1:]):
        for x0,x1 in zip(xs[:-1],xs[1:]):
            pixels = [px[x,y] for y in range(y0,y1) for x in range(x0,x1)]
            mode,count = Counter(pixels).most_common(1)[0]
            dominant.append(count/len(pixels))
            tolerant.append(sum(max(abs(v[k]-mode[k]) for k in range(3))<=3 for v in pixels)/len(pixels))
    return {'measured_blocks':len(dominant),
            'exact_mode_75pct_blocks_percent':100*sum(v>=.75 for v in dominant)/len(dominant),
            'median_exact_mode_fraction':median(dominant),
            'rgb_tolerance_3_75pct_blocks_percent_diagnostic_only':100*sum(v>=.75 for v in tolerant)/len(tolerant)}


def inspect(path):
    im = Image.open(path).convert('RGB')
    gx, gy = axis_grid(im, 1), axis_grid(im, 0)
    stats = blocks(im, gx, gy)
    stats.update({'source': str(path), 'size': list(im.size), 'x_grid': gx, 'y_grid': gy})
    stats['majority_uniform_blocks'] = stats['exact_mode_75pct_blocks_percent'] > 50
    # Tolerance is evidence of shading, never a replacement for the raw mode test.
    return stats


def run(paths):
    report = [inspect(p) for p in paths]
    (REVIEW / 'C12-grid-validation.json').write_text(json.dumps(report, indent=2) + '\n')
    for r in report:
        print(Path(r['source']).stem, round(r['exact_mode_75pct_blocks_percent'], 3),
              'raw uniform %', round(r['x_grid']['pitch'], 2), round(r['y_grid']['pitch'], 2))
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('paths', nargs='*', type=Path)
    args = parser.parse_args()
    run(args.paths or sorted((REVIEW / 'C12-sources').glob('*.png')))
