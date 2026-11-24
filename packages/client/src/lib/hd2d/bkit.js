// @ts-nocheck
// Shared kit for the stand-alone building planners (church, inn, friary, hospital, school, works ...).
// A plan here has the same shape as planInterior's; on top it carries `site`, what towngen must give the building.
import { rngOf } from './interior.js';
export { rngOf };

// a newel (spiral) stair in one cell, climbing through st floors; its landing cells are the neighbours inside `inside(x, y)`
export const spiral = (cell, st, inside = () => true) => (f) => { const c = cell, nbs = [[c[0] + 1, c[1]], [c[0] - 1, c[1]], [c[0], c[1] + 1], [c[0], c[1] - 1]].filter(([x, y]) => x >= 0 && y >= 0 && inside(x, y, f));
  return { block: f < st - 1 ? [c] : [], well: f === st - 1 ? [c] : [], wellUp: f > 0, nbs, need: [], one: true }; };
export const noStair = () => ({ block: [], well: [], need: [] });
// a prop pusher: room found by cell
export const props = (rooms) => { const list = []; const roomOf = (x, y) => { const q = rooms.find((r) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1); return q ? q.id : -1; };
  const P = (type, x, y, w, h, rot, more = {}) => { list.push({ type, room: roomOf(x, y), x, y, w, h, rot, ...more }); }; return { list, P }; };
export const R = (id, t, x0, y0, x1, y1, more = {}) => ({ id, t, x0, y0, x1, y1, ...more });
export const door = (e, a, b, more = {}) => { const [k, x, y] = e.split(','); return { e, a, b, x: +x, y: +y, ...more }; };
// windows along a stretch of edge: every `step` cells from i0 to i1 on side, or explicit edges
export const wins = (side, i0, i1, step, kind = 'win') => { const o = []; for (let i = i0; i <= i1; i += step) o.push({ side, i, kind }); return o; };
export const ewin = (e, kind = 'win') => ({ e, kind, side: e[0] === 'h' ? 'f' : 'l', i: +e.split(',')[e[0] === 'h' ? 1 : 2] });

export function plan(o) {
  const { kind, Wi, Di, floors, names, site, zone = () => null } = o, st = floors.length;
  return { H: { id: kind, W: (Wi - 1) / 3, D: (Di - 1) / 3, st, gable: false }, kind, tier: o.tier || 'civic', Wi, Di, st, P: [], floors, yard: null, core: o.core || null, doorX: o.doorX,
    trade: null, wallH0: o.wallH0 || null, lift: o.lift || null, stone: o.stone ?? false, posts: o.posts ?? true, zone, roomNames: names, site, checks: { ok: true, fails: [] } };
}

// reachability as the walk sees it: a step between cells is free inside a room, through a door, or between two open courts; props block unless walk:1
export function reach(pl) {
  const out = [];
  for (const F of pl.floors) {
    const inRoom = (x, y) => F.rooms.find((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1);
    const block = new Set(); for (const p of F.props) if (!p.walk && p.type !== 'trap') for (let j = 0; j < p.h; j++) for (let i = 0; i < p.w; i++) block.add((p.x + i) + ',' + (p.y + j));
    for (const c of (F.stair && F.stair.block) || []) block.add(c + '');
    const doorE = new Set(F.doors.map((d) => d.e)), edge = (x, y, nx, ny) => nx !== x ? `v,${Math.max(x, nx)},${y}` : `h,${x},${Math.max(y, ny)}`;
    const starts = F.f === 0 ? F.doors.filter((d) => d.street).map((d) => [d.x, d.y]) : ((F.stair && F.stair.nbs) || []).slice(0, 1);
    for (const s of F.extraStarts || []) starts.push(s);
    if (!starts.length) { out.push(`f${F.f}: no way in`); continue; }
    const seen = new Set(starts.map((s) => s + '')), Q = starts.slice();
    while (Q.length) { const [x, y] = Q.shift(); const r = inRoom(x, y); if (!r) { out.push(`f${F.f}: start ${x},${y} outside rooms`); continue; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny, r2 = inRoom(nx, ny); if (!r2 || seen.has(k) || block.has(k)) continue;
        if (r2 !== r && !doorE.has(edge(x, y, nx, ny)) && !(r.open && r2.open)) continue; seen.add(k); Q.push([nx, ny]); } }
    for (const s of starts) if (block.has(s + '')) out.push(`f${F.f}: start ${s} blocked`);
    for (const q of F.rooms) { let any = false; for (let y = q.y0; y <= q.y1 && !any; y++) for (let x = q.x0; x <= q.x1 && !any; x++) if (seen.has(x + ',' + y)) any = true; if (!any) out.push(`f${F.f}: room ${q.t} unreachable`); }
    for (const p of F.props) { if (p.walk || p.type === 'trap' || p.reach === 0) continue; let ok = false;
      for (let j = -1; j <= p.h && !ok; j++) for (let i = -1; i <= p.w && !ok; i++) { const side = (i < 0 || i >= p.w) !== (j < 0 || j >= p.h); if (side && seen.has((p.x + i) + ',' + (p.y + j))) ok = true; }
      if (!ok) out.push(`f${F.f}: ${p.type} at ${p.x},${p.y} unreachable`); }
    for (const p of F.props) if (p.x < 0 || p.y < 0 || p.x + p.w > pl.Wi || p.y + p.h > pl.Di || !inRoom(p.x, p.y) || !inRoom(p.x + p.w - 1, p.y + p.h - 1)) out.push(`f${F.f}: ${p.type} at ${p.x},${p.y} outside rooms`);
    // the stair's landing must be free on every floor it reaches
    for (const c of (F.stair && F.stair.nbs) || []) if (F.f > 0 && block.has(c + '') && c === F.stair.nbs[0]) out.push(`f${F.f}: stair landing blocked`);
    // overlap between props
    const occ = new Map(); for (const p of F.props) { if (p.walk) continue; for (let j = 0; j < p.h; j++) for (let i = 0; i < p.w; i++) { const k = (p.x + i) + ',' + (p.y + j); if (occ.has(k)) out.push(`f${F.f}: ${p.type} overlaps ${occ.get(k)} at ${k}`); occ.set(k, p.type); } }
  }
  return out;
}
