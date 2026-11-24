// @ts-nocheck
// gen2/adapt.js: hand a gen2 town to the 3D builder (town.html) in the shape it already reads: a grid of ground
// kinds by name, house lots, gates and towers, plus the list of planned buildings it stands up from their planners.
// A town bigger than one map is generated whole once (townOf) and each map is a 52x48 window onto it (plan2 with win).
import { generate } from './town2.js';
import { K, MW, MH, isWater } from './grid.js';
import { LATIN } from './grammar-latin.js';
import { TESTG } from './grammar-test.js';
import { citySkeleton } from './city2.js';
import { CITY_LATIN } from './city-latin.js';
import { cityLazy, unpackCity } from './cityfill.js';
import { citySpec } from './cityspec.js';
import { landmarks, entry, quarter } from './citynav.js';
export { citySpec };

export const GRAMMARS = { latin: LATIN, test: TESTG };
const NAME = { [K.OUT]: 'out', [K.FIELD]: 'field', [K.RIVER]: 'river', [K.SEA]: 'sea', [K.STREAM]: 'stream', [K.DITCH]: 'ditch',
  [K.MAIN]: 'main', [K.STREET]: 'street', [K.LANE]: 'lane', [K.ALLEY]: 'alley', [K.SQUARE]: 'square', [K.ROAD]: 'road', [K.BRIDGE]: 'bridge', [K.QUAY]: 'quay', [K.BEACH]: 'beach', [K.PIER]: 'pier', [K.TRACK]: 'lane',
  [K.BLD]: 'bld', [K.COURT]: 'court', [K.APRON]: 'yardC', [K.HOUSE]: 'lot', [K.GARDEN]: 'yard', [K.WALL]: 'wall', [K.GATE]: 'main', [K.GREEN]: 'yard', [K.SPOIL]: 'spoil' };
const STREETN = { [K.SQUARE]: 'square', [K.MAIN]: 'main', [K.ROAD]: 'road', [K.QUAY]: 'quay', [K.STREET]: 'street', [K.LANE]: 'lane', [K.ALLEY]: 'alley', [K.TRACK]: 'lane' };

// the whole town, generated once per spec and kept (every map of it is cut from the same plan)
const CACHE = new Map();
// cities made ahead: prepareCity builds the skeleton in a worker (or takes it from the browser's saved cities) before townOf
// asks for it; wards the worker fills later are handed to the city as they come and saved with it once all are done
export const CITY_VERSION = 's5a';   // bump when the city code changes: saved cities from older code are made again
const PREP = new Map(), cityKey = (s) => [CITY_VERSION, s.seed, s.cpop, s.csite || 'river', s.region || 'en', s.cyear || 1500, s.cflags || ''].join('|');
const idb = () => new Promise((res) => { try { const q = indexedDB.open('hd2d-cities', 1); q.onupgradeneeded = () => q.result.createObjectStore('c'); q.onsuccess = () => res(q.result); q.onerror = () => res(null); } catch { res(null); } });
const idbGet = async (key) => { const db = await idb(); if (!db) return null; return new Promise((res) => { try { const q = db.transaction('c').objectStore('c').get(key); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch { res(null); } }); };
const idbPut = async (key, v) => { const db = await idb(); if (!db) return; try { db.transaction('c', 'readwrite').objectStore('c').put(v, key); } catch {} };
export async function prepareCity(spec) {
  const key = cityKey(spec); if (PREP.has(key)) return PREP.get(key).ready;
  const E = { wards: new Map(), T: null }; PREP.set(key, E);
  E.ready = (async () => {
    const saved = await idbGet(key);
    if (saved) { E.S = unpackCity({ ...saved.city }); for (const R of saved.wards) E.wards.set(R.wid, R); E.from = 'saved'; return E; }   // a city saved part-way: the wards it lacks are filled when their maps are asked for
    if (typeof Worker === 'undefined') return E;   // no worker (node): townOf builds it in place
    const w = new Worker(new URL('./cityworker.js', import.meta.url), { type: 'module' }); let pk = null; const all = [];
    await new Promise((res) => { w.onmessage = (e) => { const m = e.data;
      if (m.type === 'skeleton') { pk = m.city; E.S = unpackCity({ ...m.city, k: m.city.k.slice(), h: m.city.h.slice(), unit: m.city.unit.slice(), ward: m.city.ward.slice(), prc: m.city.prc.slice(), ring: m.city.ring.slice() }); E.from = 'worker'; E.tS = performance.now(); }
      else if (m.type === 'first') { E.tF = performance.now(); idbPut(key, { city: pk, wards: all.slice() }); res(); }   // the arrival map's wards are in: the page can build (and a reload need not wait for the rest)
      else if (m.type === 'ward') { all.push(m.ward); if (E.tF && all.length % 4 === 0) idbPut(key, { city: pk, wards: all.slice() }); if (E.T && E.T.L) { if (!E.T.L.done.has(m.ward.wid)) E.T.L.pre.set(m.ward.wid, m.ward); } else E.wards.set(m.ward.wid, m.ward); }
      else if (m.type === 'done') { w.terminate(); res(); E.done = true; idbPut(key, { city: pk, wards: all }); } }; w.postMessage({ id: 1, spec }); });
    return E; })();
  return E.ready;
}
const keyOf = (s) => [s.cpop ? 'city' + s.cpop + (s.csite || 'river') + (s.cyear || 1500) + (s.cflags || '') : '', s.grammar || 'latin', s.basis, s.rank, s.planted ? 1 : 0, s.seed, s.multi ? 1 : 0, s.region || 'en', (s.specs || []).join(',')].join('|');
export function townOf(spec) {
  const key = keyOf(spec); if (CACHE.has(key)) return CACHE.get(key);
  const gm = GRAMMARS[spec.grammar] || LATIN;
  if (spec.cpop) { const T = cityT(spec, gm); CACHE.set(key, T); if (CACHE.size > 6) CACHE.delete(CACHE.keys().next().value); return T; }
  const Q = generate({ ...spec, grammar: gm }), G = Q.G, { I } = G;
  const g = new Array(G.n); for (let i = 0; i < G.n; i++) g[i] = NAME[G.k[i]] || 'out';
  // gates: the passage stays a street, the gatehouse's other cells read as wall (the builder draws its own gatehouse there)
  for (const b of Q.buildings) if (b.role === 'gate') for (let y = b.y0; y < b.y0 + b.H; y++) for (let x = b.x0; x < b.x0 + b.W; x++) { const i = I(x, y); if (G.bid[i] !== b.id) continue; if (G.k[i] === K.BLD) g[i] = b.gate && (b.gate.dir === 'n' || b.gate.dir === 's' ? y === b.gate.line : x === b.gate.line) ? 'wall' : 'out'; }
  // wall towers: the builder's round towers stand on the wall cell, pushed out a little
  const towers = [];
  for (const b of Q.buildings) if (b.role === 'walltower') { let wx = -1, wy = -1, ox = 0, oy = 0;
    for (let y = b.y0; y < b.y0 + 2; y++) for (let x = b.x0; x < b.x0 + 2; x++) { const i = I(x, y); if (G.ins[i]) continue; const inner = [[1, 0], [-1, 0], [0, 1], [0, -1]].find(([dx, dy]) => G.in(x + dx, y + dy) && G.ins[I(x + dx, y + dy)]); if (inner && wx < 0) { wx = x; wy = y; ox = -inner[0]; oy = -inner[1]; } }
    for (let y = b.y0; y < b.y0 + 2; y++) for (let x = b.x0; x < b.x0 + 2; x++) { const i = I(x, y); g[i] = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => G.in(x + dx, y + dy) && G.ins[I(x + dx, y + dy)]) && !G.ins[i] ? 'wall' : 'out'; }
    if (wx >= 0) towers.push({ x: wx, y: wy, ox, oy }); }
  // house lots: the house part of each plot, its face toward the street, its district (the generator never lets one cross a seam)
  const lots = lotsOf(Q.plots, G, g);
  const T = { Q, gm, g, towers, lots, maps: Q.pf.maps };
  CACHE.set(key, T); if (CACHE.size > 6) CACHE.delete(CACHE.keys().next().value);
  return T;
}
// house lots: the house part of each plot, its face toward the street, its district (the generator never lets one cross a seam)
function lotsOf(plots, G, g) { const I = G.I, lots = [];
  for (const p of plots) { if (!p.house) continue; let x0 = 1e4, y0 = 1e4, x1 = -1, y1 = -1;
    for (let y = p.y; y < p.y + p.d; y++) for (let x = p.x; x < p.x + p.w; x++) { const i = I(x, y); if (G.pid[i] === p.id && G.k[i] === K.HOUSE) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } }
    if (x1 < 0) continue; const L = { x: x0, y: y0, w: x1 - x0 + 1, d: y1 - y0 + 1, f: p.f.toUpperCase(), street: STREETN[p.street] || 'street', dist: p.dist || 'common', plot: p.id, ward: G.ward ? G.ward[I(x0, y0)] : -1 };
    let ok = true; for (let y = y0; y <= y1 && ok; y++) for (let x = x0; x <= x1; x++) if (G.k[I(x, y)] !== K.HOUSE || G.pid[I(x, y)] !== p.id) { ok = false; break; }
    if (!ok) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (G.pid[I(x, y)] === p.id && G.k[I(x, y)] === K.HOUSE) g[I(x, y)] = 'yard'; continue; }   // a house cut by a passage: its plot stays open ground
    lots.push(L); }
  return lots;
}

// one map of the town: spec.win = [wx, wy], which of the town's maps (0,0 for a one-map town)
export function plan2(spec) {
  const T = townOf(spec), { Q, gm, maps } = T, G = Q.G, [wx, wy] = spec.win || [0, 0], ox = wx * MW, oy = wy * MH, multi = maps[0] * maps[1] > 1;
  if (T.L) T.L.ensure(ox - 2, oy - 2, ox + MW + 1, oy + MH + 1);   // a city: fill the wards this map shows (a ward fills whole, the same in any order)
  const inW = (x, y) => x >= ox && y >= oy && x < ox + MW && y < oy + MH, cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const I = (x, y) => y * MW + x, n = MW * MH, GI = (x, y) => cl(y, 0, G.H - 1) * G.W + cl(x, 0, G.W - 1);
  const g = new Array(n), bid = new Int32Array(n).fill(-1), apr = new Int32Array(n).fill(-1), ins = new Uint8Array(n);
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const j = GI(x + ox, y + oy); g[I(x, y)] = T.g[j]; bid[I(x, y)] = G.bid[j]; apr[I(x, y)] = G.apr[j]; ins[I(x, y)] = G.ins[j]; }
  // lots on this map, in its own coordinates
  const lots = [], lotId = new Int32Array(n).fill(-1);
  for (const L0 of T.lots) { if (!inW(L0.x, L0.y)) continue; const L = { ...L0, id: lots.length, x: L0.x - ox, y: L0.y - oy };
    for (let y = L.y; y < L.y + L.d; y++) for (let x = L.x; x < L.x + L.w; x++) if (x < MW && y < MH) lotId[I(x, y)] = L.id; lots.push(L); }
  const mk = Q.market, dist = new Array(n).fill('common'); for (const L of lots) for (let y = L.y; y < L.y + L.d; y++) for (let x = L.x; x < L.x + L.w; x++) if (x < MW && y < MH) dist[I(x, y)] = L.dist;
  const sq = mk && inW(Math.floor(mk.cx), Math.floor(mk.cy)) ? { x0: mk.x0 - ox, y0: mk.y0 - oy, x1: mk.x1 - ox, y1: mk.y1 - oy } : null;
  // where the party starts on this map: the town's start if it is here, else the way cell nearest the middle
  let start = inW(Q.start[0], Q.start[1]) ? [Q.start[0] - ox, Q.start[1] - oy] : null;
  if (!start && Q.city) { const e = entry(Q.city.S, Q.city.L, CITY_LATIN, wx, wy); if (e) start = e.at; }   // a city map: its market, else its waymark nearest the middle
  if (!start) { let bd = 1e9; for (let y = 4; y < MH - 4; y++) for (let x = 4; x < MW - 4; x++) { const k = g[I(x, y)]; if (!['main', 'street', 'road', 'square', 'lane'].includes(k)) continue; const d = Math.hypot(x - MW / 2, y - MH / 2); if (d < bd) { bd = d; start = [x, y]; } } }
  start = start || [MW >> 1, MH >> 1];
  const shift = (b) => ({ ...b, x0: b.x0 - ox, y0: b.y0 - oy, cx: b.cx - ox, cy: b.cy - oy, doors: b.doors.map((d) => ({ ...d, x: d.x - ox, y: d.y - oy })), box: { ...b.box, x0: b.box.x0 - ox, y0: b.box.y0 - oy } });
  // ground heights at this map's corners, from the town's own ground (gentle: a town site was chosen for it)
  const hc = (x, y) => G.h[GI(x, y)] * .06;
  const brief = multi ? { spec: { seed: Q.seed }, corners: [hc(ox, oy), hc(ox + MW, oy), hc(ox + MW, oy + MH), hc(ox, oy + MH)], gen2: true,
    edges: { n: { exists: wy > 0 }, s: { exists: wy < maps[1] - 1 }, w: { exists: wx > 0 }, e: { exists: wx < maps[0] - 1 } } } : null;
  const P = {
    gen2: Q, g, I, bid, apr, apronNames: Object.fromEntries(Q.buildings.filter((b) => b.apron).map((b) => [b.id, (gm.apronName || {})[b.apron] || null])), at: (x, y) => T.g[GI(x + ox, y + oy)], r: Q.rng, ri: Q.ri, pick: Q.pick, seed: Q.seed + (wx * 7 + wy * 13) * 1009, basis: Q.pf.basis, rank: Q.pf.rank, planted: Q.pf.planted,
    sq, ch: null, gh: null, towers: T.towers.filter((t) => inW(t.x, t.y)).map((t) => ({ ...t, x: t.x - ox, y: t.y - oy })), feats: [],
    gates: Q.gates.filter((q) => !q.water && inW(Math.floor(q.cx), Math.floor(q.cy))).map((q) => { const ns = q.dir === 'n' || q.dir === 's'; return { dir: q.dir, u: q.u - (ns ? ox : oy), line: q.line - (ns ? oy : ox), cx: q.cx - ox, cy: q.cy - oy, wide: q.wide }; }),
    walls: Q.pf.walled ? { ins, x0: 0, y0: 0, x1: MW - 1, y1: MH - 1 } : null, start, fountain: null, names: {}, mx: Q.cross[0] - 1 - ox, ey: Q.cross[1] - oy, R: { x0: 0, y0: 0, x1: MW - 1, y1: MH - 1 },
    quayY: Q.water.seaY > 0 ? Q.water.seaY - 3 - oy : -1, brief, win: [wx, wy], maps,
    district: (x, y) => dist[I(cl(x, 0, MW - 1), cl(y, 0, MH - 1))],
    green: (x, y) => x >= 0 && y >= 0 && x < MW && y < MH && Q.G.k[GI(x + ox, y + oy)] === K.GREEN,   // open ground inside the town: closes and orchards
    label: Q.city ? `city of about ${Q.pf.pop} people${Q.city.S.pf.year !== 1500 ? ' in ' + Q.city.S.pf.year : ''}, ${Q.households.houses} houses so far, map ${wx + 1},${wy + 1} of ${maps[0]}x${maps[1]}` : `${Q.pf.basis} town, rank ${Q.pf.rank}${Q.pf.planted ? ', planted' : ''}, about ${Q.pf.pop} people, ${Q.households.houses} houses${multi ? `, map ${wx + 1},${wy + 1} of ${maps[0]}x${maps[1]}` : ''} (new generator, ${gm.id} grammar)`,
    carved: { lots, lotId },
    BLDS: Q.buildings.filter((b) => b.role !== 'gate' && b.role !== 'walltower' && inW(b.x0, b.y0)).map((b) => { const sp = gm.spec(b.type, b.variant); return { ...shift(b), label: sp.label, opt: sp.opt, planner: sp.planner, stone: sp.stone, monument: sp.monument }; }),
  };
  // a city: each quarter's look and trade (houses and signs), the landmarks seen beyond this map (the skyline band)
  if (Q.city) { const { S, L } = Q.city, looks = new Map(), qOf = (w) => { if (w < 0) return null; if (!looks.has(w)) looks.set(w, quarter(S, CITY_LATIN, w, S.pf.flags)); return looks.get(w); };
    P.nav = { quarter: qOf, quarterAt: (x, y) => qOf(G.ward[GI(x + ox, y + oy)]), landmarks: landmarks(S, L, CITY_LATIN).map((l) => ({ ...l, x: l.x - ox, y: l.y - oy })), city: S.pf }; }
  // boats along a quay
  const sy = Q.water.seaY - oy;
  if (Q.water.seaY > 0 && sy > 0 && sy < MH) for (let x = 3; x < MW - 3; x += 5 + (x * 7 % 4)) if (!isWater(G.k[GI(x + ox, Q.water.seaY - 1)])) P.feats.push({ k: 'boat', x: x + .5, z: sy + 1.6, rot: Math.PI / 2 * ((x % 3) ? 0 : 1) + .1, s: 1, mast: x % 2 === 0 });
  return P;
}

// a city (gen2 skeleton + wards filled on demand) in the shape of a generated town, so the same windows and builder serve it.
// The ground names (g) and lots are brought up to date as each ward is filled.
function cityT(spec, gm) {
  const E = PREP.get(cityKey(spec)), S = (E && E.S) || citySkeleton(citySpec(spec));
  CITY_LATIN.grain = CITY_LATIN.parishGrain(S.pf, () => .5);
  const L = cityLazy(S, gm, CITY_LATIN), G = L.G; if (E) { for (const [wid, R] of E.wards) L.pre.set(wid, R); E.wards.clear(); } G.ins = new Uint8Array(G.n); for (let i = 0; i < G.n; i++) G.ins[i] = G.ring[i] > 0 ? 1 : 0;
  const nm = (i) => G.k[i] === K.WALL && G.prc[i] >= 0 ? 'pwall' : NAME[G.k[i]] || 'out';   // a precinct's low wall, not the town's
  const g = new Array(G.n); for (let i = 0; i < G.n; i++) g[i] = nm(i);
  const m = S.markets[0], mk = m ? { x0: m.x0, y0: m.y0, x1: m.x0 + m.w - 1, y1: m.y0 + m.h - 1, cx: m.cx, cy: m.cy, shape: 'square' } : null;
  let r0 = (spec.seed * 2654435761) >>> 0; const rng = () => ((r0 = (r0 * 1664525 + 1013904223) >>> 0) / 4294967296), ri = (a, b) => a + Math.floor(rng() * (b - a + 1)), pick = (a) => a[Math.floor(rng() * a.length)];
  const Q = { G, plots: L.plots, buildings: L.buildings, gates: [], market: mk, start: mk ? [Math.round(m.cx), Math.round(m.cy)] : [G.W >> 1, G.H >> 1], water: { seaY: -1 }, seed: spec.seed,
    pf: { basis: 'market', rank: 3, pop: spec.cpop, planted: false, walled: true, maps: [Math.ceil(G.W / MW), Math.ceil(G.H / MH)] }, cross: mk ? [Math.round(m.cx), Math.round(m.cy)] : [G.W >> 1, G.H >> 1],
    households: L.households, rng, ri, pick, city: { S, L } };
  const T = { Q, gm, g, towers: S.towers.map(([x, y]) => ({ x, y, ox: 0, oy: 0 })), lots: [], maps: Q.pf.maps, L };
  L.onFill = (wid, nb, np) => { const w = S.wards[wid]; for (let y = Math.max(0, w.y0 - 4); y <= Math.min(G.H - 1, w.y1 + 4); y++) for (let x = Math.max(0, w.x0 - 4); x <= Math.min(G.W - 1, w.x1 + 4); x++) { const i = G.I(x, y); g[i] = nm(i); }
    for (const Lt of lotsOf(np, G, g)) T.lots.push(Lt); };
  if (E) E.T = T;
  return T;
}
