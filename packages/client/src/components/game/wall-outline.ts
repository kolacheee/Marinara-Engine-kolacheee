/**
 * The outline of a dungeon floor's open ground, traced from its grid and smoothed into diagonal and curved
 * walls (owner 2026-11-20: "implement curved and diagonal walls properly"). The grid stays as it is for
 * play; this is only how the walls are drawn: the outline the floor, the wall tops and the wall faces all
 * follow, so a slope or a curve is one wall with its face along it, not a cell-shaped patch.
 *
 * Points are in cells (x right, y down). Every loop keeps the open ground on its right-hand side, so an
 * outer outline runs clockwise on screen and a pillar's outline the other way round: filled nonzero, the
 * pillars stay holes.
 */
export type OutlinePoint = { x: number; y: number };

/** The edges between open and closed cells, chained into closed loops of their corners. */
export function traceOutline(
  inside: (x: number, y: number) => boolean,
  width: number,
  height: number,
): OutlinePoint[][] {
  const W = width + 1;
  const out = new Map<number, number[]>();
  const add = (ax: number, ay: number, bx: number, by: number) => {
    const key = ay * W + ax;
    const next = by * W + bx;
    const list = out.get(key);
    if (list) list.push(next);
    else out.set(key, [next]);
  };
  const open = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && inside(x, y);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (!open(x, y)) continue;
      if (!open(x, y - 1)) add(x, y, x + 1, y);
      if (!open(x + 1, y)) add(x + 1, y, x + 1, y + 1);
      if (!open(x, y + 1)) add(x + 1, y + 1, x, y + 1);
      if (!open(x - 1, y)) add(x, y + 1, x, y);
    }
  const loops: OutlinePoint[][] = [];
  const at = (key: number) => ({ x: key % W, y: Math.floor(key / W) });
  while (out.size) {
    const start = out.keys().next().value as number;
    const corners: OutlinePoint[] = [];
    let cur = start;
    let dir: OutlinePoint | null = null;
    for (let guard = 0; guard < 4 * W * (height + 1) + 8; guard++) {
      const list = out.get(cur);
      if (!list?.length) break;
      // Where two open cells touch only at a corner, keep to the cell the edge came along (turn right
      // first): they are two places, as a fighter who cannot step across a corner finds them.
      let pick = 0;
      if (dir && list.length > 1) {
        const p = at(cur);
        const rank = (key: number) => {
          const q = at(key);
          const [dx, dy] = [q.x - p.x, q.y - p.y];
          if (dx === -dir!.y && dy === dir!.x) return 0;
          if (dx === dir!.x && dy === dir!.y) return 1;
          return 2;
        };
        for (let i = 1; i < list.length; i++) if (rank(list[i]!) < rank(list[pick]!)) pick = i;
      }
      const next = list.splice(pick, 1)[0]!;
      if (!list.length) out.delete(cur);
      const p = at(cur);
      const q = at(next);
      corners.push(p);
      dir = { x: q.x - p.x, y: q.y - p.y };
      cur = next;
      if (cur === start) break;
    }
    const merged = mergeStraight(corners);
    if (merged.length >= 3) loops.push(merged);
  }
  return loops;
}

/** The corners of a loop with every point dropped that lies on the straight line through its neighbours. */
function mergeStraight(points: OutlinePoint[]): OutlinePoint[] {
  let pts = points;
  for (let pass = 0; pass < 3; pass++) {
    const keep: OutlinePoint[] = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i - 1 + pts.length) % pts.length]!;
      const b = pts[i]!;
      const c = pts[(i + 1) % pts.length]!;
      const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
      const la = Math.hypot(b.x - a.x, b.y - a.y);
      const lc = Math.hypot(c.x - b.x, c.y - b.y);
      if (la < 1e-9 || lc < 1e-9 || Math.abs(cross) > 1e-9 * la * lc + 1e-12) keep.push(b);
    }
    if (keep.length === pts.length) return keep;
    pts = keep;
  }
  return pts;
}

export interface SmoothOptions {
  /** Whether a step of the stair may be cut across: the wall cell `wall` the cut lays floor into, and the
   *  side its floor lies on (`sx`, `sy`). Left out, every step may. */
  cut?: (wall: OutlinePoint, sx: number, sy: number) => boolean;
  /** Round every corner (a place cut from rock), or only the ends of each cut (a carved room's corners). */
  round?: "all" | "cuts" | "none";
  /** The widest a rounded corner may run along each of its walls, in cells. */
  radius?: number;
  /** With every corner rounded, how widely the ends of a cut are: less, so an eight-sided room keeps its
   *  straight slopes. */
  cutRadius?: number;
  /** Any other corner to round, and how widely (0: none): a round chamber's (dungeonShapeRoom). */
  roundAt?: (corner: OutlinePoint) => number;
}

/**
 * A stair of single steps along the outline becomes one straight diagonal through its outer corners (the
 * floor grows into the steps), then corners are rounded as asked. The result is flattened to points.
 */
export function smoothOutline(loop: OutlinePoint[], options: SmoothOptions = {}): OutlinePoint[] {
  const n = loop.length;
  const p = (i: number) => loop[((i % n) + n) % n]!;
  const turn = (i: number) => {
    const [a, b, c] = [p(i - 1), p(i), p(i + 1)];
    return (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
  };
  const unit = (a: OutlinePoint, b: OutlinePoint) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  const dropped = new Array<boolean>(n).fill(false);
  for (let i = 0; i < n; i++) {
    // An inner corner of the floor (turning left: the floor wraps three of the four cells round it) one
    // cell from each neighbour, both of them outer corners: one step of a stair.
    if (turn(i) >= 0 || turn(i - 1) <= 0 || turn(i + 1) <= 0) continue;
    if (!unit(p(i - 1), p(i)) || !unit(p(i), p(i + 1))) continue;
    if (options.cut) {
      // The wall cell at this corner: of the four cells round it, the one toward the middle of its two
      // neighbours (the floor holds the other three); its floor lies the other way.
      const [a, b, c] = [p(i - 1), p(i), p(i + 1)];
      const sx = Math.sign((a.x + c.x) / 2 - b.x);
      const sy = Math.sign((a.y + c.y) / 2 - b.y);
      const wx = sx > 0 ? b.x : b.x - 1;
      const wy = sy > 0 ? b.y : b.y - 1;
      if (!options.cut({ x: wx, y: wy }, -sx, -sy)) continue;
    }
    dropped[i] = true;
  }
  const marked = new Set<OutlinePoint>();
  const kept: OutlinePoint[] = [];
  for (let i = 0; i < n; i++) {
    if (dropped[i]) continue;
    if (dropped[(i - 1 + n) % n] || dropped[(i + 1) % n]) marked.add(p(i));
    kept.push(p(i));
  }
  const poly = mergeStraight(kept);
  const round = options.round ?? "none";
  if (round === "none" && !options.roundAt) return poly;
  const radius = options.radius ?? 1;
  const res: OutlinePoint[] = [];
  const m = poly.length;
  for (let i = 0; i < m; i++) {
    const a = poly[(i - 1 + m) % m]!;
    const b = poly[i]!;
    const c = poly[(i + 1) % m]!;
    const wide =
      round === "all"
        ? marked.has(b)
          ? (options.cutRadius ?? radius)
          : radius
        : round === "cuts" && marked.has(b)
          ? radius
          : (options.roundAt?.(b) ?? 0);
    if (!wide) {
      res.push(b);
      continue;
    }
    const la = Math.hypot(b.x - a.x, b.y - a.y);
    const lc = Math.hypot(c.x - b.x, c.y - b.y);
    // How far the curve runs along each wall: half of each side at most, so two rounded ends of one side
    // meet in its middle.
    const d = Math.min(la / 2, lc / 2, wide);
    if (d < 0.05) {
      res.push(b);
      continue;
    }
    const p0 = { x: b.x - ((b.x - a.x) / la) * d, y: b.y - ((b.y - a.y) / la) * d };
    const p1 = { x: b.x + ((c.x - b.x) / lc) * d, y: b.y + ((c.y - b.y) / lc) * d };
    res.push(p0);
    const steps = Math.max(3, Math.ceil(d * 6));
    for (let k = 1; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      res.push({
        x: u * u * p0.x + 2 * u * t * b.x + t * t * p1.x,
        y: u * u * p0.y + 2 * u * t * b.y + t * t * p1.y,
      });
    }
  }
  return res;
}
