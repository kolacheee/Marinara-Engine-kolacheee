// @ts-nocheck
// gen2/cityfill.js: fill a city skeleton's wards with the gen2 town engine, one ward at a time.
// Each ward reads only the skeleton (its own grid window, ground, the ways around it) and writes only its own cells,
// so the city comes out the same whatever order the wards are filled in. Engine code: culture-neutral.
import { MW, MH, K, N4, rngOf, makeGrid, isWater, isWay } from './grid.js';
import { generate } from './town2.js';
import { U } from './city2.js';

// one ward: returns the town engine's result in the ward's window plus the window origin
export function fillWard(S, wid, gm, cg) {
  const T0 = performance.now(), SG = S.G, w = S.wards[wid], pad = 4;
  const x0 = Math.max(0, w.x0 - pad), y0 = Math.max(0, w.y0 - pad), x1 = Math.min(SG.W - 1, w.x1 + pad), y1 = Math.min(SG.H - 1, w.y1 + pad);
  const G = makeGrid(x1 - x0 + 1, y1 - y0 + 1), R = new Uint8Array(G.n), inner = new Uint8Array(G.n), sub = new Uint8Array(G.n);
  const own = new Uint8Array(G.n);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const j = SG.I(x, y), i = G.I(x - x0, y - y0), kk = SG.k[j]; G.h[i] = SG.h[j];
    const mine = SG.ward[j] === wid && SG.unit[j] !== U.COUNTRY && SG.unit[j] !== U.NONE;
    if (mine || isWay(kk) || isWater(kk) || kk === K.GATE || kk === K.WALL || kk === K.APRON) G.k[i] = mine && kk === K.STREET && false ? K.OUT : kk;
    else G.k[i] = K.SPOIL;                                         // another ward's ground, or the country: never built on from here
    if (SG.prc[j] >= 0) G.k[i] = K.SPOIL;                          // a precinct is walled after: the ward's lanes never run through it
    if (mine && SG.unit[j] !== U.PRECINCT) { own[i] = 1; if (SG.unit[j] !== U.BELT) { R[i] = 1; if (SG.ring[j] > 0) inner[i] = 1; else sub[i] = 1; } }   // the open belt stays open: orchards, closes, tenter grounds, no houses
    if (mine && G.k[i] === K.GREEN) G.k[i] = K.OUT; }
  // the market the ward reads: the nearest of the city's (in window coordinates)
  const cxw = (w.x0 + w.x1) / 2, cyw = (w.y0 + w.y1) / 2; let mk = null, md = 1e9;
  for (const m of S.markets) { const d = Math.hypot(m.cx - cxw, m.cy - cyw); if (d < md) { md = d; mk = m; } }
  { const m0 = S.markets[0]; if (m0 && SG.ward[SG.I(Math.round(m0.cx), Math.round(m0.cy))] === wid) mk = m0; }   // the ward that holds the main market reads that one (its cross and hall stand there)
  const market = mk ? { x0: mk.x0 - x0, y0: mk.y0 - y0, x1: mk.x0 + mk.w - 1 - x0, y1: mk.y0 + mk.h - 1 - y0, cx: mk.cx - x0, cy: mk.cy - y0, shape: 'square' } : null;
  const gates = S.gates.map((g) => ({ ...g, cx: g.cx - x0, cy: g.cy - y0 })).filter((g) => g.cx >= 0 && g.cy >= 0 && g.cx < G.W && g.cy < G.H);
  // water and quay only where the ward's own building ground meets them (a river across the way belongs to another ward)
  let water = 0, quay = false; for (let i = 0; i < G.n; i++) { if (!R[i]) continue; const x = i % G.W, y = (i / G.W) | 0;
    for (const [dx, dy] of N4) { if (!G.in(x + dx, y + dy)) continue; const kk = G.k[G.I(x + dx, y + dy)]; if (kk === K.RIVER || kk === K.SEA || kk === K.STREAM) { const bx = x - dx * 4, by = y - dy * 4; if (G.in(bx, by) && R[G.I(bx, by)] && R[G.I(x - dx * 2, y - dy * 2)]) water++; } else if (kk === K.QUAY) quay = true; } }   // water a building can stand against: own ground four cells deep behind the bank
  // and a straight run of such bank at least six cells long (a water mill or a dye works backs onto it with its whole back wall)
  { const wet = (kk) => kk === K.RIVER || kk === K.SEA || kk === K.STREAM, fr = (x, y) => G.in(x, y) && R[G.I(x, y)] && G.k[G.I(x, y)] === K.OUT, ok = (x, y, dx, dy) => fr(x, y) && G.in(x + dx, y + dy) && wet(G.k[G.I(x + dx, y + dy)]) && fr(x - dx, y - dy) && fr(x - dx * 2, y - dy * 2) && fr(x - dx * 3, y - dy * 3);   // open ground, not the bank's street
    let best = 0; for (const [dx, dy] of N4) { if (dx) for (let x = 0; x < G.W; x++) { let run = 0; for (let y = 0; y < G.H; y++) { run = ok(x, y, dx, dy) ? run + 1 : 0; if (run > best) best = run; } }
      else for (let y = 0; y < G.H; y++) { let run = 0; for (let x = 0; x < G.W; x++) { run = ok(x, y, dx, dy) ? run + 1 : 0; if (run > best) best = run; } } }
    water = water >= 12 && best >= 6; }
  const main = S.markets[0], mainMarket = !!main && SG.ward[SG.I(Math.round(main.cx), Math.round(main.cy))] === wid;
  const down = ((cxw - S.core[0]) * S.flow[0] + (cyw - S.core[1]) * S.flow[1]) > S.R2 * .15;
  let gateRoad = false; for (let i = 0; i < G.n && !gateRoad; i++) if (own[i] && N4.some(([dx, dy]) => { const x = i % G.W + dx, y = ((i / G.W) | 0) + dy; return G.in(x, y) && G.k[G.I(x, y)] === K.MAIN; })) gateRoad = true;
  const r = rngOf((S.seed | 0) * 7907 + wid * 131 + 17);
  let bridge = false; for (let i = 0; i < G.n && !bridge; i++) if (R[i] && N4.some(([dx, dy]) => { const x = i % G.W + dx, y = ((i / G.W) | 0) + dy; return G.in(x, y) && G.k[G.I(x, y)] === K.BRIDGE; })) bridge = true;
  const ctx = { region: S.pf.region, flags: S.pf.flags, grain: cg.grain, mainMarket, water, quay, port: S.pf.site === 'coast', downstream: down, belt: (w.units.belt || 0) > 200, gateRoad, bridge, cityPop: S.pf.pop };
  const list = cg.wardBuildings ? cg.wardBuildings(w, ctx, r) : [];
  const pf = { basis: 'market', rank: 3, pop: Math.round(w.hh * cg.personsPerHousehold), households: w.hh, planted: (w.units.planned || 0) > w.cells * .5, walled: false, lord: false, region: S.pf.region,
    spec: S.pf.flags.cloth ? ['cloth'] : [], water, maps: [2, 2] };
  const coreShare = ((w.units.core || 0) + (w.units.planned || 0)) / w.cells, subShare = ((w.units.suburb || 0) + (w.units.village || 0)) / w.cells;
  const pc = cg.cityPlots[coreShare > .35 ? 'core' : subShare > .6 ? 'suburb' : 'growth'];
  const net = netOf(S), G0k = new Uint8Array(G.n); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (net[SG.I(x, y)]) G0k[G.I(x - x0, y - y0)] = SG.k[SG.I(x, y)];
  const base = { G0k, G, pf, R, inner, sub, ox: x0, oy: y0, market, gates, flow: S.flow, cross: [Math.round(cxw - x0), Math.round(cyw - y0)], plots: pc.plots, hhPerHouse: pc.hh, sideMin: pc.side };
  const P = generate({ grammar: gm, seed: (S.seed | 0) * 1009 + wid, base, buildings: list });
  // the poor among the ward's households: cottages in the suburb first, then the back plots (lean-tos, outbuildings let as rooms)
  if (S.people) { let want = Math.round(w.hh * S.people.poorShare), u = 0; const rank = (p) => (p.dist === 'poor' ? 0 : 2) + (p.cls === 'edge' ? 0 : p.cls === 'back' ? 1 : 3) + (p.house ? p.house.w * p.house.d / 40 : 9);
    const c = P.plots.filter((p) => p.house).map((p) => ({ p, s: rank(p) })).sort((a, b) => a.s - b.s || a.p.id - b.p.id);
    for (const { p } of c) { if (u >= want) break; p.poor = p.dist === 'poor' || p.cls === 'edge' ? 'cottage' : 'lean-to'; u += pc.hh[p.cls] || 1; } P.households.poor = Math.round(u); }
  P.precincts = []; if (cg.precinctPlan) for (const p of S.precincts) if (p.ward === wid) P.precincts.push(fillPrecinct(S, p, gm, cg, P, x0, y0, own, list));
  return { P, x0, y0, own, wid, ms: performance.now() - T0, list };
}

// a city filled on demand: wards are filled as the maps that need them are asked for (ensure), in any order, with the same
// result. Ids are stable whatever the order: a building or plot of ward w has id w * WARD_IDS + its number in the ward.
export const WARD_IDS = 4096;
export function cityLazy(S, gm, cg) {
  const SG = S.G, G = makeGrid(SG.W, SG.H);
  G.k.set(SG.k); G.h.set(SG.h); G.unit = SG.unit; G.ward = SG.ward; G.ring = SG.ring; G.prc = SG.prc;
  G.bid = new Int32Array(G.n).fill(-1); G.pid = new Int32Array(G.n).fill(-1); G.apr = new Int32Array(G.n).fill(-1);
  const L = { G, skeleton: S, buildings: [], plots: [], byId: new Map(), wards: [], precincts: [], report: [], households: { want: 0, got: 0, houses: 0 }, done: new Set(), ms: 0 };
  // the inns' share of beds taken: the city's travellers over the beds its inns are expected to have (about one inn to 140 households)
  L.occupancy = S.people ? Math.max(.15, Math.min(1, S.people.travellers / Math.max(1, S.pf.households / 140 * 16))) : .5;
  // who lives where, for the wards filled so far: households in houses (the poor among them), the precincts' people, beguines, travellers, rough sleepers
  L.census = () => { const pp = S.people || {}, beg = L.precincts.filter((q) => q.type === 'beguinage').reduce((a, q) => a + q.got, 0), inn = L.buildings.reduce((a, b) => a + (b.guests || 0), 0);
    return { households: L.households.got, want: L.households.want, poor: L.households.poor || 0, communal: pp.communal || {}, nComm: pp.nComm || 0, beguineHouses: beg, beguines: (pp.beguines || []).reduce((a, b) => a + b, 0),
      travellers: pp.travellers || 0, booked: inn, beds: L.buildings.reduce((a, b) => a + (b.beds || 0), 0), rough: pp.rough || 0, refugees: pp.refugees || 0, wards: L.done.size, of: S.wards.filter((w) => w.cells > 0).length }; };
  L.pre = new Map();   // ward results made ahead (by the city worker), used in place of filling here
  L.fill = (wid) => { if (L.done.has(wid)) return false; L.done.add(wid); const T0 = performance.now();
    const F = L.pre.get(wid) || wardResult(fillWard(S, wid, gm, cg)); L.pre.delete(wid); const P = F, base = wid * WARD_IDS, Wn = F.W;
    for (let i = 0; i < F.n; i++) { if (!F.own[i] && !(F.k[i] === K.GATE || F.k[i] === K.BRIDGE) && !(F.bid[i] >= 0)) continue;   // its own ground, plus a postern or footbridge its lanes needed
      const x = i % Wn + F.x0, y = ((i / Wn) | 0) + F.y0, j = G.I(x, y); let v = F.k[i] === K.OUT && SG.unit[j] === U.BELT ? K.GREEN : F.k[i];
      if (F.own[i] && v === SG.k[j] && G.k[j] !== SG.k[j] && !(F.bid[i] >= 0)) v = G.k[j];   // a neighbour's postern in this ward's wall stays, whichever ward came first
      G.k[j] = v;
      if (F.bid[i] >= 0) G.bid[j] = F.bid[i] + base; if (F.pid[i] >= 0) G.pid[j] = F.pid[i] + base; if (F.apr[i] >= 0) G.apr[j] = F.apr[i] + base; }
    const nb = [], np = [];
    for (const b of P.buildings) { const o = shift({ ...b, id: b.id + base, host: b.host != null && b.host >= 0 ? b.host + base : b.host, ward: wid }, F.x0, F.y0); nb.push(o); L.buildings.push(o); L.byId.set(o.id, o);
      if (cg.lodging && cg.lodging.includes(o.type) && o.precinct == null) { o.beds = 8 + ((o.id * 2654435761) >>> 0) % 17; o.guests = Math.round(o.beds * L.occupancy); } }   // travellers booked in the inns
    for (const p of P.plots) { const o = shiftPlot({ ...p, id: p.id + base, ward: wid }, F.x0, F.y0); np.push(o); L.plots.push(o); }
    L.households.want += P.households.want; L.households.got += P.households.got; L.households.houses += P.households.houses; L.households.poor = (L.households.poor || 0) + (P.households.poor || 0);
    for (const q of F.precincts || []) L.precincts.push({ ...q, ward: wid });
    L.wards.push({ id: wid, ms: Math.round(F.ms), want: P.households.want, got: P.households.got, houses: P.households.houses, buildings: P.buildings.length, list: F.list, report: P.report });
    for (const n of P.report) L.report.push(S.wards[wid].name + ': ' + n);
    L.ms += performance.now() - T0; if (L.onFill) L.onFill(wid, nb, np); return true; };
  // every ward whose window reaches the box (x0, y0)-(x1, y1); returns the wards filled now
  // every ward with ground in the box (x0, y0)-(x1, y1); returns the wards filled now
  L.ensure = (x0, y0, x1, y1) => { const need = new Set(); for (let y = Math.max(0, y0); y <= Math.min(G.H - 1, y1); y++) for (let x = Math.max(0, x0); x <= Math.min(G.W - 1, x1); x++) { const i = y * G.W + x, w = SG.ward[i]; if (w >= 0 && !L.done.has(w) && SG.unit[i] !== U.COUNTRY && SG.unit[i] !== U.NONE && !isWay(SG.k[i]) && !isWater(SG.k[i])) need.add(w); }   // ground a ward builds on (its ways are the skeleton's already)
    const out = [...need].sort((a, b) => a - b); for (const w of out) L.fill(w); return out; };
  return L;
}

// a precinct inside a filled ward: its wall with a gate where a way touches it, then its buildings and houses placed by the town
// engine on its own ground (the town's social needs left out), written back into the ward's window. Engine code: culture-neutral.
function fillPrecinct(S, p, gm, cg, WP, wx0, wy0, own, list) {
  const SG = S.G, WG = WP.G, pad = 3, r = rngOf((S.seed | 0) * 6151 + p.id * 97 + 5);
  const beg = p.type === 'beguinage' && S.people ? S.people.beguines[S.precincts.filter((q) => q.type === 'beguinage').indexOf(p)] || 0 : 0;
  const plan = cg.precinctPlan(p, S.pf, r, beg);
  const ax0 = Math.max(0, p.x0 - wx0 - pad), ay0 = Math.max(0, p.y0 - wy0 - pad), ax1 = Math.min(WG.W - 1, p.x0 + p.w - 1 - wx0 + pad), ay1 = Math.min(WG.H - 1, p.y0 + p.h - 1 - wy0 + pad);
  const G = makeGrid(ax1 - ax0 + 1, ay1 - ay0 + 1), R = new Uint8Array(G.n), inner = new Uint8Array(G.n), sub = new Uint8Array(G.n), G0k = new Uint8Array(G.n), mine = new Uint8Array(G.n);
  const inP = (x, y) => { const cx = x + ax0 + wx0, cy = y + ay0 + wy0; return cx >= 0 && cy >= 0 && cx < SG.W && cy < SG.H && SG.prc[cy * SG.W + cx] === p.id; };
  for (let y = 0; y < G.H; y++) for (let x = 0; x < G.W; x++) { const i = G.I(x, y), wi = (y + ay0) * WG.W + x + ax0, j = (y + ay0 + wy0) * SG.W + x + ax0 + wx0; G.h[i] = WG.h[wi];
    if (inP(x, y)) { mine[i] = 1; const edge = N4.some(([dx, dy]) => !inP(x + dx, y + dy));
      if (edge && plan.wall) G.k[i] = K.WALL; else { G.k[i] = K.OUT; R[i] = 1; if (SG.ring[j] > 0) inner[i] = 1; else sub[i] = 1; } continue; }
    const kk = WG.k[wi]; if (isWay(kk) || isWater(kk) || kk === K.GATE || kk === K.WALL) { G.k[i] = kk; if (isWay(kk) || kk === K.GATE) G0k[i] = kk; } else G.k[i] = K.SPOIL; }
  // the gate: on the wall where a way runs past outside, the stretch nearest the middle of that side
  let gate = null; { const pcx = p.x0 + p.w / 2 - wx0 - ax0, pcy = p.y0 + p.h / 2 - wy0 - ay0; let bd = 1e9;
    for (let i = 0; i < G.n; i++) { if (!mine[i] || (plan.wall && G.k[i] !== K.WALL)) continue; const x = i % G.W, y = (i / G.W) | 0;
      for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny) || mine[G.I(nx, ny)] || !(isWay(G.k[G.I(nx, ny)]) || G.k[G.I(nx, ny)] === K.GATE)) continue; const d = Math.hypot(x - pcx, y - pcy); if (d < bd) { bd = d; gate = { x, y, dx, dy }; } } } }
  if (gate && plan.wall) { const along = gate.dx ? [0, 1] : [1, 0]; for (const t of [0, 1]) { const x = gate.x + along[0] * t, y = gate.y + along[1] * t; if (G.in(x, y) && mine[G.I(x, y)] && G.k[G.I(x, y)] === K.WALL) G.k[G.I(x, y)] = K.GATE; } }
  // a short way in from the gate: the precinct's own paths join it (inside the wall nothing else is a way)
  if (gate && plan.wall) { const along = gate.dx ? [0, 1] : [1, 0]; for (const t of [0, 1]) for (const s of [1, 2]) { const x = gate.x + along[0] * t - gate.dx * s, y = gate.y + along[1] * t - gate.dy * s; if (G.in(x, y) && mine[G.I(x, y)] && G.k[G.I(x, y)] === K.OUT) G.k[G.I(x, y)] = K.LANE; } }
  const gx = gate ? gate.x : G.W >> 1, gy = gate ? gate.y : G.H >> 1;
  const pc = cg.cityPlots[plan.plots || 'growth'];
  const base = { G0k, G, pf: { basis: 'market', rank: 2, pop: Math.round(plan.hh * cg.personsPerHousehold), households: plan.hh, planted: false, walled: false, lord: false, region: S.pf.region, spec: [], water: false, maps: [2, 2] },
    R, inner, sub, ox: wx0 + ax0, oy: wy0 + ay0, market: { x0: gx, y0: gy, x1: gx, y1: gy, cx: gx, cy: gy, shape: 'square' }, gates: gate ? [{ cx: gx, cy: gy }] : [], flow: S.flow, cross: [gx, gy],
    plots: pc.plots, hhPerHouse: pc.hh, sideMin: pc.side, loose: true };
  if (globalThis.DUMPP === p.id) { const ch = { [K.OUT]: '.', [K.WALL]: '#', [K.GATE]: 'G', [K.LANE]: 'l', [K.SPOIL]: ' ' }; for (let y = 0; y < G.H; y++) { let s = ''; for (let x = 0; x < G.W; x++) { const kk = G.k[G.I(x, y)]; s += ch[kk] ?? (isWay(kk) ? '=' : isWater(kk) ? '~' : '?'); } console.log(s); } }
  const P = generate({ grammar: gm, seed: (S.seed | 0) * 1013 + p.id * 7 + 3, base, buildings: plan.list });
  if (globalThis.DUMPP === p.id) { console.log('--after', P.report); const ch = { [K.OUT]: '.', [K.WALL]: '#', [K.GATE]: 'G', [K.LANE]: 'l', [K.SPOIL]: ' ', [K.BLD]: 'B', [K.APRON]: 'a', [K.HOUSE]: 'h', [K.GARDEN]: 'g', [K.GREEN]: ',' }; for (let y = 0; y < G.H; y++) { let s = ''; for (let x = 0; x < G.W; x++) { const kk = P.G.k[G.I(x, y)]; s += ch[kk] ?? (isWay(kk) ? '=' : isWater(kk) ? '~' : '?'); } console.log(s); } }
  // back into the ward's window: the precinct's own cells (and its gate), ids after the ward's own
  const bo = WP.buildings.length, po = WP.plots.length;
  for (let i = 0; i < G.n; i++) { if (!mine[i]) continue; const x = i % G.W, y = (i / G.W) | 0, wi = (y + ay0) * WG.W + x + ax0; WG.k[wi] = P.G.k[i] === K.OUT ? K.GREEN : P.G.k[i];
    WG.bid[wi] = P.G.bid[i] >= 0 ? P.G.bid[i] + bo : -1; WG.pid[wi] = P.G.pid[i] >= 0 ? P.G.pid[i] + po : -1; WG.apr[wi] = P.G.apr[i] >= 0 ? P.G.apr[i] + bo : P.G.apr[i]; own[wi] = 1; }
  for (const b of P.buildings) WP.buildings.push(shift({ ...b, id: b.id + bo, host: b.host != null && b.host >= 0 ? b.host + bo : b.host, precinct: p.id }, ax0, ay0));
  for (const q of P.plots) WP.plots.push(shiftPlot({ ...q, id: q.id + po, precinct: p.id }, ax0, ay0));
  for (const b of plan.list) list.push(b);
  return { id: p.id, type: p.type, want: plan.hh, got: P.households.got, houses: P.households.houses, buildings: P.buildings.length, list: plan.list.length, report: P.report, gate: !!gate };
}

// what a filled ward hands back to the city: plain data and typed arrays, so a worker can make it and post it
export function wardResult(F) { const P = F.P, G = P.G;
  return { wid: F.wid, x0: F.x0, y0: F.y0, W: G.W, n: G.n, own: F.own, k: G.k, bid: G.bid, pid: G.pid, apr: G.apr, buildings: P.buildings, plots: P.plots, households: P.households, report: P.report, list: F.list.length, ms: F.ms, precincts: P.precincts || [] }; }
export const wardTransfer = (R) => [R.own.buffer, R.k.buffer, R.bid.buffer, R.pid.buffer, R.apr.buffer];

// a skeleton as plain data and back (worker messages, the saved-city store)
export function packCity(S) { const { G, _net, ...meta } = S;
  return { meta, W: G.W, H: G.H, k: G.k, h: G.h, unit: G.unit, ward: G.ward, prc: G.prc, ring: G.ring }; }
export const packTransfer = (o) => [o.k.buffer, o.h.buffer, o.unit.buffer, o.ward.buffer, o.prc.buffer, o.ring.buffer];
export function unpackCity(o) { const G = makeGrid(o.W, o.H); G.k.set(o.k); G.h.set(o.h); G.unit = o.unit; G.ward = o.ward; G.prc = o.prc; G.ring = o.ring; return { ...o.meta, G }; }

// the whole city at once (tests, overview pictures)
export function fillCity(S, gm, cg, only) {
  const T0 = performance.now(), L = cityLazy(S, gm, cg);
  for (const wid of only || S.wards.filter((w) => w.cells > 0).map((w) => w.id)) L.fill(wid);
  L.ms = Math.round(performance.now() - T0); return L;
}
function shift(b, dx, dy) { const o = { ...b, x0: b.x0 + dx, y0: b.y0 + dy, cx: b.cx + dx, cy: b.cy + dy, doors: b.doors.map((d) => ({ ...d, x: d.x + dx, y: d.y + dy })), box: b.box ? { ...b.box, x0: b.box.x0 + dx, y0: b.box.y0 + dy } : b.box }; if (b.gate) o.gate = { ...b.gate }; return o; }
function shiftPlot(p, dx, dy) { return { ...p, x: p.x + dx, y: p.y + dy, house: p.house ? { ...p.house, x: p.house.x + dx, y: p.house.y + dy } : null }; }

// the skeleton's ways that join the main market (a stub cut off in the skeleton is not taken as joined)
function netOf(S) { if (S._net) return S._net; const G = S.G, W = G.W, seen = new Uint8Array(G.n), walk = (kk) => (isWay(kk) && kk !== K.BEACH) || kk === K.GATE;
  const m = S.markets[0], q = [G.I(Math.round(m.cx), Math.round(m.cy))]; seen[q[0]] = 1;
  for (let h = 0; h < q.length; h++) { const c = q[h], x = c % W, y = (c / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = G.I(nx, ny); if (!seen[j] && walk(G.k[j])) { seen[j] = 1; q.push(j); } } }
  return (S._net = seen); }
