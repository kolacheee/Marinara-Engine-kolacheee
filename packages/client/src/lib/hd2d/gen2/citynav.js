// @ts-nocheck
// gen2/citynav.js: finding the way across a city of many maps. Culture-neutral: what counts as a landmark, a waymark or a
// quarter's look comes from the city grammar (cg.nav). Reads the skeleton S and the filled wards L (cityLazy).
//   landmarks(S, L)  tall things seen from afar: the cathedral, great churches, parish towers, the castle keep, windmills
//   waymarks(S, L)   things you steer by on the street: market places, gates, churches, crosses and conduits
//   entry(S, L, mx, my) where the party is set down on a map it travels to: its market, else its waymark nearest the middle, else a street
//   quarter(S, cg, wid) one quarter's identity: its name, its chief trade, its walls and roofs, its sign colour
import { MW, MH, K, isWay } from './grid.js';

const hash = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// the buildings known so far: the filled wards', and those made ahead by the worker and not yet taken in
const known = (L) => { const o = [...L.buildings]; for (const [wid, F] of L.pre || []) for (const b of F.buildings) o.push({ ...b, cx: b.cx + F.x0, cy: b.cy + F.y0, ward: wid }); return o; };
export function landmarks(S, L, cg) { const N = cg.nav, out = [];
  for (const b of known(L)) { const t = N.landmark[b.type === 'parish' ? 'parish' + (b.variant || '') : b.type + (b.variant === 'R' ? 'R' : '')]; if (!t) continue;
    const w = S.wards[b.ward]; out.push({ x: b.cx, y: b.cy, kind: t.kind, h: t.h, name: b.type === 'parish' ? (b.variant === 'XL' ? 'Great church' : (w ? w.name : 'Parish church')) : t.name, ward: b.ward }); }
  // precincts not yet filled still show from afar (their outline is in the skeleton): the cathedral, the castle
  for (const p of S.precincts) { const t = N.precinct[p.type]; if (!t || out.some((o) => Math.hypot(o.x - p.cx, o.y - p.cy) < Math.max(p.w, p.h) / 2 && o.h >= t.h * .7)) continue; out.push({ x: p.cx, y: p.cy, kind: t.kind, h: t.h, name: t.name, ward: p.ward }); }
  return out; }

export function waymarks(S, L, cg) { const N = cg.nav, out = [];
  S.markets.forEach((m, i) => out.push({ x: m.cx, y: m.cy, kind: 'market', name: (N.market[m.type] || m.type) }));
  for (const g of S.gates) out.push({ x: g.cx, y: g.cy, kind: 'gate', name: 'Gate' });
  for (const b of known(L)) if (N.waymark.includes(b.type) && b.variant !== 'R') out.push({ x: b.cx, y: b.cy, kind: b.type, name: b.label || b.type, ward: b.ward });
  return out; }

// the map-distance (in whole maps, the larger of the two axes) from map (mx, my) to the nearest waymark
export const mapGap = (W, mx, my) => W.reduce((a, w) => Math.min(a, Math.max(Math.abs(Math.floor(w.x / MW) - mx), Math.abs(Math.floor(w.y / MH) - my))), 99);

export function entry(S, L, cg, mx, my) { const G = S.G, x0 = mx * MW, y0 = my * MH, inM = (x, y) => x >= x0 + 3 && y >= y0 + 3 && x < x0 + MW - 3 && y < y0 + MH - 3;
  const m = S.markets.find((q) => inM(Math.round(q.cx), Math.round(q.cy))); if (m) return { at: [Math.round(m.cx) - x0, Math.round(m.cy) - y0], why: (cg.nav.market[m.type] || m.type) };
  const W = waymarks(S, L, cg).filter((w) => inM(Math.round(w.x), Math.round(w.y))).sort((a, b) => Math.hypot(a.x - x0 - MW / 2, a.y - y0 - MH / 2) - Math.hypot(b.x - x0 - MW / 2, b.y - y0 - MH / 2));
  // the way cell nearest the chosen point (a waymark's door street, or the middle)
  const tx = W.length ? W[0].x : x0 + MW / 2, ty = W.length ? W[0].y : y0 + MH / 2; let best = null;
  for (let y = y0 + 2; y < y0 + MH - 2; y++) for (let x = x0 + 2; x < x0 + MW - 2; x++) { if (x >= G.W || y >= G.H) continue; const k = G.k[G.I(x, y)]; if (!isWay(k)) continue; const d = Math.hypot(x - tx, y - ty); if (!best || d < best[2]) best = [x, y, d]; }
  return best ? { at: [best[0] - x0, best[1] - y0], why: W.length ? W[0].name : 'street' } : null; }

// a quarter's look: the grammar's palettes by plan unit, one chosen per quarter so neighbouring quarters read apart; its chief trade
export function quarter(S, cg, wid, flags = {}) { const w = S.wards[wid]; if (!w) return null; const N = cg.nav, u = w.units || {}, tot = Object.values(u).reduce((a, b) => a + b, 0) || 1;
  const unit = (u.core || 0) / tot > .4 ? 'core' : (u.suburb || 0) / tot > .5 ? 'suburb' : (u.planned || 0) / tot > .4 ? 'planned' : 'growth';
  const pals = N.looks[unit] || N.looks.growth, look = pals[Math.floor(hash(S.seed + 17, wid) * pals.length)];
  const tr = N.trades.filter((t) => (!t.unit || t.unit.includes(unit)) && (!t.flag || flags[t.flag]) && (!t.not || !flags[t.not])), trade = tr[Math.floor(hash(S.seed + 29, wid) * tr.length)] || N.trades[0];
  return { id: wid, name: w.name, unit, trade: trade.name, sign: trade.sign, walls: look.walls, roofs: look.roofs, ground: look.ground, timber: look.timber }; }
