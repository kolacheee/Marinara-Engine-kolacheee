// @ts-nocheck
// gen2/town2.js: the second-generation town generator. A town starts from what it is (profile), places the
// buildings its institutions and trades need in the order towns grew, then cuts streets and plots around them.
// Engine code: culture-neutral. Building types, sizes, counts and social needs come from spec.grammar.
import { MW, MH, K, RANK, N4, N8, SIDE, rngOf, makeGrid, field, sat, frame, doorOut, isWater, isWay } from './grid.js';

const OPP = { n: 's', s: 'n', e: 'w', w: 'e' };
const ALLO = [{ f: 's', m: 0 }, { f: 's', m: 1 }, { f: 'e', m: 0 }, { f: 'e', m: 1 }, { f: 'w', m: 0 }, { f: 'w', m: 1 }, { f: 'n', m: 0 }, { f: 'n', m: 1 }];
const BASES = ['market', 'road', 'bridge', 'port', 'fishing', 'mining'];

export function profileOf(spec) {
  const basis = BASES.includes(spec.basis) ? spec.basis : 'market', rank = Math.max(0, Math.min(basis === 'fishing' ? 1 : 3, spec.rank | 0));
  const r = rngOf((spec.seed | 0) * 31 + 5);
  // one map of a town at real density (spec.multi off), or the whole town at its real size over as many maps as it needs
  const pop = spec.pop || (spec.multi ? [200, 750, 2000, 3500][rank] * (.85 + r() * .3) | 0 : [150, 320, 250, 280][rank] + Math.round((r() - .5) * 40));
  const water = basis === "fishing" ? false : spec.water ?? (basis === "bridge" || basis === "port" || basis === "mining" || r() < .6);
  return { basis, rank, pop, households: Math.round(pop / 4.75), planted: !!spec.planted, walled: spec.walled ?? (rank >= 2 && basis !== 'fishing'),
    lord: spec.lord ?? (rank >= 2 && r() < .35), region: spec.region || 'en', spec: spec.specs || [], water, maps: spec.maps || (spec.multi ? mapsFor(pop, rank) : [1, 1]) };
}

// how many maps a town of this size needs: about 1,700 cells of town ground per map once streets, gardens and the edge are counted
export function mapsFor(pop, rank) { const need = pop / 4.75 * 12.5 + 600 * (rank + 1), n = Math.max(1, Math.ceil(need / 1700));
  return n <= 1 ? [1, 1] : n === 2 ? [2, 1] : n <= 4 ? [2, 2] : n <= 6 ? [3, 2] : [3, 3]; }

export function generate(spec) {
  const gm = spec.grammar, seed = spec.seed | 0, B0 = spec.base || null, pf = B0 ? B0.pf : profileOf(spec);   // spec.base: fill one ward of a city skeleton (its grid window, ground, market, gates)
  const r = rngOf(seed * 7919 + BASES.indexOf(pf.basis) * 131 + pf.rank * 17 + (pf.planted ? 7 : 0) + 1);
  const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = (a) => a[Math.floor(r() * a.length)], cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const G = B0 ? B0.G : makeGrid(spec.W || MW * pf.maps[0], spec.H || MH * pf.maps[1]), { W, H, I } = G, k = G.k;
  // positions are laid out for one 52x48 map and stretched to the town's size; sizes (widths, depths) are not
  const X = (v) => Math.round(v * W / MW), Y = (v) => Math.round(v * H / MH), rx = (a, b) => X(ri(a, b)), ry = (a, b) => Y(ri(a, b));
  // seams between maps: no building or house straddles one (each map builds its own)
  const ox = B0 ? B0.ox : 0, oy = B0 ? B0.oy : 0;   // a ward's window sits at (ox, oy) in the city: seams fall on the city's map lines
  const seamX = (x0, w) => Math.floor((x0 + ox) / MW) !== Math.floor((x0 + ox + w - 1) / MW), seamY = (y0, h) => Math.floor((y0 + oy) / MH) !== Math.floor((y0 + oy + h - 1) / MH);
  const nMaps = pf.maps[0] * pf.maps[1], mapOf = (i) => Math.floor((i % W + ox) / MW) + Math.floor((((i / W) | 0) + oy) / MH) * 64, crossSeam = (x0, y0, w, h) => Math.floor((x0 + ox) / MW) !== Math.floor((x0 + ox + w - 1) / MW) || Math.floor((y0 + oy) / MH) !== Math.floor((y0 + oy + h - 1) / MH);
  const T0 = performance.now(), report = [], B = [];
  const note = (s) => report.push(s);
  const P = { G, pf, grammar: gm.id, seed, buildings: B, plots: [], gates: [], towers: [], report, market: null, start: null, flow: [1, 0], wind: spec.wind || [0.92, -0.38] };
  if (B0) { P.gates = B0.gates.map((g) => ({ ...g })); P.flow = B0.flow || P.flow; }

  // ---------------- terrain: ground height, water ----------------
  if (!B0) { const n = (s) => { const gw = Math.ceil(W / s) + 2, gh = Math.ceil(H / s) + 2, v = Float32Array.from({ length: gw * gh }, r), sm = (t) => t * t * (3 - 2 * t);
      return (x, y) => { const fx = x / s, fy = y / s, ix = Math.floor(fx), iy = Math.floor(fy), tx = sm(fx - ix), ty = sm(fy - iy), a = (i, j) => v[(iy + j) * gw + ix + i];
        return (a(0, 0) * (1 - tx) + a(1, 0) * tx) * (1 - ty) + (a(0, 1) * (1 - tx) + a(1, 1) * tx) * ty; }; };
    const n1 = n(14), n2 = n(6), north = pf.basis === 'mining' ? 1.4 : .5;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) G.h[I(x, y)] = n1(x, y) * .7 + n2(x, y) * .25 + (1 - y / H) * north; }
  const wob = () => pf.planted ? 0 : r() < .5 ? 0 : pick([-1, 1]);
  let riverY = -1, streamX = -1, seaY = -1;
  if (B0) { /* the skeleton has the water */ } else if (pf.basis === 'bridge') { riverY = H - 18 + ri(0, 3); let o = 0; for (let x = 0; x < W; x++) { if (x % 9 === 0) o = cl(o + wob(), -1, 1); for (let j = 0; j < 3; j++) G.set(x, riverY + o + j, K.RIVER); } P.flow = [1, 0]; }
  else if (pf.basis === 'port' || pf.basis === 'fishing') { seaY = H - 7; for (let y = seaY; y < H; y++) for (let x = 0; x < W; x++) G.set(x, y, K.SEA);
    for (let y = seaY - 2; y < seaY; y++) for (let x = 0; x < W; x++) G.set(x, y, K.BEACH); P.flow = [0, 1];
    if (pf.water && pf.basis === 'port') { streamX = r() < .5 ? ri(5, 9) : W - 10 + ri(0, 4); let o = 0; for (let y = 0; y < seaY; y++) { if (y % 8 === 0) o = cl(o + wob(), -1, 1); G.set(streamX + o, y, K.STREAM); G.set(streamX + o + 1, y, K.STREAM); } } }
  else if (pf.water) { // a stream: across the bottom third (flowing east) or down one side (flowing south)
    if (pf.basis === 'mining' || r() < .45) { streamX = pf.basis === 'mining' ? W - 10 + ri(0, 3) : pick([ri(5, 8), W - 9 + ri(0, 3)]); let o = 0; for (let y = 0; y < H; y++) { if (y % 8 === 0) o = cl(o + wob(), -1, 1); G.set(streamX + o, y, K.STREAM); G.set(streamX + o + 1, y, K.STREAM); } P.flow = [0, 1]; }
    else { riverY = H - 13 + ri(0, 4); let o = 0; for (let x = 0; x < W; x++) { if (x % 8 === 0) o = cl(o + wob(), -1, 1); G.set(x, riverY + o, K.STREAM); G.set(x, riverY + o + 1, K.STREAM); } P.flow = [1, 0]; } }
  P.water = { riverY, streamX, seaY };

  // ---------------- through roads and the crossing ----------------
  const ways = gm.ways, mw = ways.main;
  let cx = B0 ? B0.cross[0] : rx(23, 26), cy = B0 ? B0.cross[1] : ry(26, 30); const ns = {};
  if (!B0) {
  if (pf.basis === 'bridge') cy = riverY - ri(9, 12) - (H - MH) / 2 | 0;
  if (pf.basis === 'port') cy = seaY - 15 + ri(0, 3) - (H - MH) / 2 | 0;
  if (pf.basis === 'fishing') cy = seaY - 4;
  if (pf.basis === 'mining') cy = ry(28, 32);
  if (streamX >= 0 && Math.abs(cx - streamX) < 10) cx = streamX < W / 2 ? streamX + X(14) : streamX - X(14);
  // the through roads keep clear of the seams between maps, so the gatehouses where they leave the town stand whole on one map
  // and the market place at the crossing (north of the cross road, astride the north road) stands whole on one map, with room for the buildings round it
  { const near = (lo, hi, M, n) => { for (let s0 = M; s0 < n; s0 += M) if (s0 > lo && s0 <= hi) return s0; return -1; };
    const sx0 = near(cx + 1 - 13, cx + 1 + 13, MW, W); if (sx0 >= 0) cx = cx + 1 < sx0 ? sx0 - 15 : sx0 + 13;
    const sy0 = near(cy - 16, cy + 8, MH, H); if (sy0 >= 0 && pf.basis !== 'fishing') cy = cy - 4 < sy0 ? Math.min(sy0 - 9, seaY > 0 ? seaY - 4 : 1e4, riverY > 0 ? riverY - 6 : 1e4) : sy0 + 17; }
  // the north-south road: a grown town's wanders a cell now and then (never across the market rows)
  { let x = cx; for (let y = H - 1; y >= 0; y--) { if (!pf.planted && Math.abs(y - cy) > 10 && y > 12 && y < H - 12 && y % 7 === 0 && r() < .5 && !(seaY > 0 && y >= seaY - 4) && !(riverY > 0 && Math.abs(y - riverY) < 5)) { const nx = cl(x + pick([-1, 1]), 6, W - 7 - mw); G.line(Math.min(x, nx), y, Math.max(x, nx) + mw - 1, y, 1, K.MAIN); x = nx; }
      ns[y] = x; if (pf.basis === 'fishing' && y > cy) continue; if (pf.basis === 'port' && y >= seaY - 2) continue; for (let j = 0; j < mw; j++) G.lay(x + j, y, K.MAIN); } }
  const ew = pf.basis === 'road' ? null : pf.basis === 'fishing' ? 2 : pf.rank >= 1 ? 2 : 2;
  if (ew) G.line(0, cy, W - 1, cy, ew, pf.basis === 'fishing' ? K.STREET : K.MAIN);
  if (pf.basis === 'port') G.line(0, seaY - 3, W - 1, seaY - 3, 1, K.QUAY), G.line(0, seaY - 2, W - 1, seaY - 2, 2, K.QUAY);
  cx = ns[cy]; }
  P.cross = [cx + 1, cy];

  // ---------------- the town's ground: grown out from the crossing along its roads to the area it needs ----------------
  const specs = (spec.buildings || gm.counts(pf, r)).map((b) => gm.spec(b.type, b.variant));
  const apA = (s) => (s.w + (s.apron ? s.apron.l + s.apron.r : 0)) * (s.d + (s.apron ? s.apron.f + s.apron.b : 0));
  const instA = specs.filter((s) => !s.req.some((q) => q.t === 'outside') && s.mode !== 'wall').reduce((a, s) => a + apA(s), 0);
  const need = Math.round(pf.households * 9.5 / (1 - .24) + instA);
  const guard = pf.walled ? 6 : 3;
  const R = B0 ? B0.R : new Uint8Array(G.n);
  if (!B0) { const dWay = field(G, [...Array(G.n).keys()].filter((i) => k[i] === K.MAIN), (kk) => !isWater(kk));
    const cost = (i) => (dWay[i] <= 9 ? 1 : 1.9) + (k[i] === K.BEACH ? 9 : 0) + (riverY > 0 && ((i / W) | 0) > riverY + 1 ? 1.5 : 0);
    const D = new Float64Array(G.n).fill(1e9), heap = [], push = (d, i) => { heap.push([d, i]); let j = heap.length - 1; while (j) { const p = (j - 1) >> 1; if (heap[p][0] <= heap[j][0]) break; [heap[p], heap[j]] = [heap[j], heap[p]]; j = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let j = 0; for (;;) { const a = 2 * j + 1, b = a + 1; let m = j; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === j) break; [heap[m], heap[j]] = [heap[j], heap[m]]; j = m; } } return top; };
    const c0 = I(cx + 1, cy - 2); D[c0] = 0; push(0, c0); let got = 0;
    const okc = (x, y) => x >= guard && y >= guard && x < W - guard && y < H - guard && !isWater(G.at(x, y)) && G.at(x, y) !== K.BEACH && !(seaY > 0 && y >= seaY - 3);
    while (heap.length && got < need) { const [d, i] = pop(); if (d > D[i] || R[i]) continue; R[i] = 1; if (k[i] === K.OUT) got++; const x = i % W, y = (i / W) | 0;
      for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!okc(nx, ny)) continue; const j = I(nx, ny), nd = d + cost(j); if (nd < D[j]) { D[j] = nd; push(nd, j); } } }
    if (got < need) note(`town ground short: ${got} of ${need} cells (map too small for ${pf.pop} people)`);
    // smooth: fill notches, drop spurs
    for (let pass = 0; pass < 3; pass++) { const add = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = I(x, y); if (R[i] || !okc(x, y)) continue; let n8 = 0; for (const [dx, dy] of N8) n8 += R[I(x + dx, y + dy)]; if (n8 >= 5) add.push(i); } for (const i of add) R[i] = 1; }
    for (let pass = 0; pass < 2; pass++) { const del = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = I(x, y); if (!R[i]) continue; let n4 = 0; for (const [dx, dy] of N4) n4 += R[I(x + dx, y + dy)]; if (n4 <= 1) del.push(i); } for (const i of del) R[i] = 0; } }
  G.town = R;

  // ---------------- the market place ----------------
  const M = gm.market(pf);
  if (B0) P.market = B0.market; else
  { let x0, y0, x1, y1;
    if (M.shape === 'lens') { const L = M.len; y0 = cl(cy - (L >> 1), guard + 2, H - guard - L - 2); y1 = y0 + L - 1; x0 = 1e4; x1 = -1;
      for (let y = y0; y <= y1; y++) { const t = (y - y0) / (L - 1), w = Math.round(mw + (M.wmax - mw) * (pf.planted ? 1 : Math.sin(Math.PI * t))), c = ns[y] + mw / 2, a = Math.round(c - w / 2), b = a + w - 1; for (let x = a; x <= b; x++) if (!isWater(G.at(x, y))) G.set(x, y, K.SQUARE); x0 = Math.min(x0, a); x1 = Math.max(x1, b); } }
    else if (M.shape === 'strand') { y1 = cy - 1; y0 = y1 - M.d + 1; x0 = cl(cx + 1 - (M.w >> 1), 3, W - M.w - 3); x1 = x0 + M.w - 1; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) G.set(x, y, K.SQUARE); }
    else { // a square on the north side of the crossing, astride the north road (a green in a village)
      y1 = cy - 1; y0 = y1 - M.d + 1; x0 = cl(cx + 1 - (M.w >> 1) + ri(-2, 2), guard + 1, W - guard - M.w - 1); x1 = x0 + M.w - 1;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (!isWater(G.at(x, y))) G.set(x, y, K.SQUARE);
      if (!pf.planted && M.shape === 'square') for (const c of [0, 1]) if (r() < .5) { const nx = ri(2, 3), ny = ri(2, 3); for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const x = c ? x1 - i : x0 + i, y = y0 + j; if (G.at(x, y) === K.SQUARE && Math.abs(x - cx - 1) > 2) G.set(x, y, K.OUT); } } }
    P.market = { x0, y0, x1, y1, shape: M.shape, cx: (x0 + x1 + 1) / 2, cy: (y0 + y1 + 1) / 2 };
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (G.in(x, y)) R[I(x, y)] = 1; }

  // ---------------- distance fields the placement scores read ----------------
  const cells = (pred) => { const o = []; for (let i = 0; i < G.n; i++) if (pred(k[i], i)) o.push(i); return o; };
  const F = {};
  const refields = () => {
    F.mkt = field(G, cells((kk) => kk === K.SQUARE), (kk) => !isWater(kk));
    F.water = field(G, cells((kk) => isWater(kk) && kk !== K.DITCH), () => true);
    F.cross = field(G, cells((kk) => kk === K.BRIDGE), () => true);
    const gs = P.gates.length ? P.gates.map((g) => I(g.cx | 0, g.cy | 0)) : cells((kk, i) => (kk === K.MAIN || kk === K.ROAD) && R[i] && N4.some(([dx, dy]) => { const x = i % W + dx, y = ((i / W) | 0) + dy; return G.in(x, y) && !R[I(x, y)]; }));
    F.gate = field(G, gs, () => true);
    F.edge = field(G, cells((kk, i) => !R[i]), () => true);
  };
  refields();
  let hmin = 1e9, hmax = -1e9; for (const v of G.h) { if (v < hmin) hmin = v; if (v > hmax) hmax = v; }
  const roleAt = (role) => B.filter((b) => b.role === role);

  // ---------------- placing one building ----------------
  // blocked: anything already used, the map's guard strip for buildings, and the other side of water
  const isFree = (kk) => kk === K.OUT;
  const onQuayOK = (sp) => sp.req.some((q) => q.t === 'quay');
  const LOOSE = new Set(['near', 'far', 'edge', 'south', 'high', 'back']);
  const placeOne = (sp0, phaseNote) => {
    const sp = B0 && B0.loose ? { ...sp0, req: sp0.req.filter((q) => LOOSE.has(q.t)) } : sp0;   // inside a precinct: the town's social needs (market, main street, gate) do not apply
    let nCand = 0, nBlk = 0, nApr = 0, nSeam = 0; const rolesNow = new Map(), roleNow = (q) => { if (!rolesNow.has(q)) rolesNow.set(q, roleAt(q)); return rolesNow.get(q); };   // nothing is placed during the search; the commonest rejections are counted without the report's string keys
    const ap = sp.apron, opts = sp.orient || ALLO, cands = [], quayOK = !B0 && onQuayOK(sp), why = {};
    const no = (w) => { why[w] = (why[w] || 0) + 1; };
    const freeMask = new Uint8Array(G.n), sqMask = new Uint8Array(G.n), outR = new Uint8Array(G.n);
    for (let i = 0; i < G.n; i++) { const x = i % W, y = (i / W) | 0, edge = x < 2 || y < 2 || x >= W - 2 || y >= H - 2; freeMask[i] = (isFree(k[i]) || (quayOK && k[i] === K.QUAY && y >= P.water.seaY - 2)) && !edge ? 0 : 1; sqMask[i] = k[i] === K.SQUARE ? 0 : 1; outR[i] = R[i] ? 0 : 1; }
    const blk = sat(G, freeMask), blkSq = sat(G, sqMask), outS = sat(G, outR);
    const hardIn = sp.req.some((q) => q.t === 'inside' && q.hard), hardOut = sp.req.some((q) => q.t === 'outside' && q.hard);
    const mk = P.market;
    for (const o of opts) {
      const F0 = frame(0, 0, sp.w, sp.d, o.f, o.m), lw = (() => { const a = F0.cell(-1, 0), b = F0.cell(0, 0), d = [a[0] - b[0], a[1] - b[1]]; return Object.keys(SIDE).find((s) => SIDE[s][0] === d[0] && SIDE[s][1] === d[1]); })();
      const aw = { n: 0, e: 0, s: 0, w: 0 }; if (ap) { aw[o.f] = ap.f; aw[OPP[o.f]] = ap.b; aw[lw] = ap.l; aw[OPP[lw]] = ap.r; }
      const bw = F0.W + aw.w + aw.e, bh = F0.H + aw.n + aw.s;
      const doors = sp.doors.map((d) => { const c = doorOut(F0, d.side, d.at), side = d.side === 'f' ? o.f : d.side === 'b' ? OPP[o.f] : d.side === 'l' ? lw : OPP[lw]; return { c, side, ap: aw[side] > 0, d }; });
      const wcells = sp.water ? [...Array(sp.w).keys()].map((u) => F0.cell(u, sp.d)) : null;
      for (let by = 0; by + bh <= H; by++) for (let bx = 0; bx + bw <= W; bx++) {
        const x0 = bx + aw.w, y0 = by + aw.n;
        // the cheap O(1) tests first (the reasons are only counted for the report; any order gives the same sites)
        if (sp.mode === 'island') { if (blkSq(bx, by, bw, bh)) continue; }
        else { if (blk(x0, y0, F0.W, F0.H)) { nBlk++; continue; } if (ap && blk(bx, by, bw, bh)) { nApr++; continue; } }
        if (nMaps > 1 && (seamX(x0 - 2, F0.W + 4) || seamY(y0 - 2, F0.H + 4) || ap && (seamX(bx - 1, bw + 2) || seamY(by - 1, bh + 2)))) { nSeam++; continue; }   // a precinct (ward, close, yard) never runs over onto the next map either; two cells clear of a seam: the door and its step stand on the building's own map
        if (ap && sp.mode !== 'island' && by + bh > H - 4) { no('south'); continue; }   // precinct walls never along the south edge (the camera looks over it)
        if (hardIn && pf.walled && (bx < guard - 1 || by < guard - 1 || bx + bw > W - guard + 1 || by + bh > H - guard + 1)) { no('wall room'); continue; }
        if (hardIn && !R[I(cl(Math.round(bx + bw / 2), 0, W - 1), cl(Math.round(by + bh / 2), 0, H - 1))]) { no('outside town'); continue; }
        if (hardOut && outS(x0, y0, F0.W, F0.H) < F0.W * F0.H) continue;
        let ok = true, onM = false, onMain = false, onQuay = false, dc = null, nF = 0, sqF = 0;
        for (const D of doors) { const x = x0 + D.c[0], y = y0 + D.c[1]; if (!G.in(x, y)) { ok = false; break; } const kk = k[I(x, y)];
          if (D.d.side === sp.water) { if (!isWater(kk)) { ok = false; break; } continue; }
          if (!D.ap && !(isFree(kk) || isWay(kk))) { ok = false; break; } if (D.d.side === 'f' && !dc) dc = [x, y]; if (D.d.side === 'f') { nF++; if (kk === K.SQUARE) sqF++; } if (kk === K.SQUARE) onM = true; if (kk === K.MAIN || kk === K.SQUARE || kk === K.ROAD) onMain = true; if (kk === K.QUAY) onQuay = true; }
        if (!ok) { no('door'); continue; }
        if (nF > 1 && sqF * 4 < nF * 3) onM = false;   // on the market means the front on it, not one door at a corner
        if (!dc) dc = [x0 + (F0.W >> 1), y0 + (F0.H >> 1)];
        if (wcells) { let wet = 0; for (const [u, v] of wcells) { const kk = G.at(x0 + u, y0 + v); if (isWater(kk) && kk !== K.DITCH || kk === K.BEACH) wet++; } if (wet < Math.ceil(sp.w / 2)) continue;
          if (sp.req.some((q) => q.t === 'quay') && !doors.some((D) => G.at(x0 + D.c[0], y0 + D.c[1]) === K.QUAY)) continue; }
        // score
        const ccx = bx + bw / 2, ccy = by + bh / 2, di = I(dc[0], dc[1]), ci = I(cl(Math.round(ccx), 0, W - 1), cl(Math.round(ccy), 0, H - 1));
        let s = 0, hard = true;
        for (const q of sp.req) { const w = q.w || 0; if (q.first && roleNow(sp.role).length) continue;   // a need only the first of its kind has
          switch (q.t) {
            case 'onMarket': if (!onM) hard = false; break;
            case 'offMarket': if (onM) hard = false; break;
            case 'main': if (q.hard && !onMain) hard = false; else s += onMain ? w : 0; break;
            case 'quay': if (!onQuay) hard = false; break;
            case 'inMarket': break;
            case 'marketMid': s -= w * Math.hypot(ccx - mk.cx, ccy - mk.cy) / 6; break;
            case 'market': s -= w * Math.min(F.mkt[di], 60) / 20; break;
            case 'gate': s -= w * Math.min(F.gate[di], 60) / 20; break;
            case 'gateOrCrossing': s -= w * Math.min(F.gate[di], F.cross[di], 60) / 20; break;
            case 'edge': s -= w * Math.min(F.edge[ci], 30) / 12; break;
            case 'downstream': s += w * ((ccx - cx) * P.flow[0] + (ccy - cy) * P.flow[1]) / 25; break;
            case 'upstream': s -= w * ((ccx - cx) * P.flow[0] + (ccy - cy) * P.flow[1]) / 25; break;
            case 'downwind': s += w * ((ccx - cx) * P.wind[0] + (ccy - cy) * P.wind[1]) / 25; break;
            case 'high': s += w * (G.h[ci] - hmin) / (hmax - hmin + 1e-6); break;
            case 'waterNear': s -= w * Math.min(F.water[ci], 30) / 15; break;
            case 'back': s += onMain ? 0 : w; break;
            case 'south': s += w * Math.min(H - (by + bh), 12) / 12; break;
            case 'near': case 'far': { const rs = roleNow(q.role === 'market' ? '_' : q.role); let dm = null; if (q.role === 'market') dm = Math.hypot(ccx - mk.cx, ccy - mk.cy); else for (const b of rs) { const dd = Math.hypot(ccx - b.cx, ccy - b.cy); if (dm === null || dd < dm) dm = dd; }
              if (dm == null) break; if (q.t === 'near') s -= w * Math.min(dm, 40) / 15; else s += w * Math.min(dm, 25 * Math.max(1, W / MW)) / 25; break; }
          } if (!hard) break; }
        if (!hard) { no('hard need'); continue; }
        if (o.f === 'n' && sp.doors.length) s -= .35;                   // doors face the camera or the side where they can
        if ((sp.storeys || 1) >= 2 || sp.apron) s += o.f === 's' ? .3 : o.f === 'n' ? 0 : .1;   // tall fronts stand north of the space they face
        s += r() * .25;
        // only the best 40 are ever tried: kept in order as they come (a stable sort's first 40, ties in arrival order)
        if (cands.length < 40 || s > cands[cands.length - 1].s) { let lo = 0, hi = cands.length; while (lo < hi) { const md = (lo + hi) >> 1; if (cands[md].s >= s) lo = md + 1; else hi = md; }
          cands.splice(lo, 0, { s, o, x0, y0, bx, by, bw, bh, F0, doors, aw, lw }); if (cands.length > 40) cands.pop(); } nCand++;
      }
    }
    if (nBlk) why.blocked = nBlk; if (nApr) why['apron blocked'] = nApr; if (nSeam) why.seam = nSeam;
    for (let t = 0; t < Math.min(cands.length, 40); t++) { const c = cands[t]; const b = commit(sp, c); if (b) return b; }
    note(`${phaseNote}: no site for ${sp.type}${sp.variant ? ' ' + sp.variant : ''} (${nCand} candidates; ${Object.entries(why).map(([a, b]) => a + ' ' + b).join(', ')})`); return null;
  };

  // set a building down; lay the paths its doors need; undo if a door can't be reached
  const commit = (sp, c) => {
    const snap = { k: k.slice(), bid: G.bid.slice(), apr: G.apr.slice() }, id = B.length;
    const { x0, y0, F0 } = c, Fw = frame(x0, y0, sp.w, sp.d, c.o.f, c.o.m);
    if (sp.apron) for (let y = c.by; y < c.by + c.bh; y++) for (let x = c.bx; x < c.bx + c.bw; x++) { const i = I(x, y); if (sp.mode === 'island') continue; k[i] = K.APRON; G.apr[i] = id; }
    for (let v = 0; v < sp.d; v++) for (let u = 0; u < sp.w; u++) { const [x, y] = Fw.cell(u, v), i = I(x, y); k[i] = K.BLD; G.bid[i] = id; }
    for (const ct of sp.courts || []) for (let v = ct.v; v < ct.v + ct.d; v++) for (let u = ct.u; u < ct.u + ct.w; u++) { if (u >= sp.w || v >= sp.d) continue; const [x, y] = Fw.cell(u, v); k[I(x, y)] = K.COURT; }
    const doors = [];
    for (const D of c.doors) { const x = x0 + D.c[0], y = y0 + D.c[1]; doors.push({ x, y, side: D.side, local: D.d.side, at: D.d.at, water: D.d.side === sp.water });
      if (D.d.side === sp.water) continue;
      let from = I(x, y);
      if (D.ap) { // the door opens on the building's own ground: that ground needs a way out
        if (apronLinked(id)) continue; from = apronExit(id, c, D); if (from < 0) { restore(snap); return null; } }
      if (!link(from, sp)) { restore(snap); return null; } }
    if (sp.mode === 'island' && sp.apron) { /* the ring stays market ground */ }
    if (sp.apron && sp.mode !== 'island' && !apronLinked(id) && !link(apronExit(id, c, null), sp)) { restore(snap); return null; }
    const b = { id, type: sp.type, variant: sp.variant, role: sp.role, monument: sp.monument, proxy: sp.proxy, x0, y0, W: F0.W, H: F0.H, w: sp.w, d: sp.d, f: c.o.f, m: c.o.m, doors,
      box: { x0: c.bx, y0: c.by, w: c.bw, h: c.bh }, apron: sp.apron ? sp.apron.kind : null, courts: sp.courts || [], storeys: sp.storeys, cx: c.bx + c.bw / 2, cy: c.by + c.bh / 2 };
    B.push(b); for (const t of sp.inner || []) if (!placeInner(b, gm.spec(t))) note(`no room for ${t} inside ${sp.type}`);
    if (sp.req.some((q) => q.t === 'inside')) for (let y = c.by; y < c.by + c.bh; y++) for (let x = c.bx; x < c.bx + c.bw; x++) R[I(x, y)] = 1;
    return b;
  };
  const restore = (s) => { k.set(s.k); G.bid.set(s.bid); G.apr.set(s.apr); };
  // a building set inside a host's precinct, on its own ground: footprint and the row before its door all precinct, a cell clear of the host
  // and of its doors, as far from the host as it can stand (against the curtain); the precinct must still join every door to its way out
  const placeInner = (host, sp) => {
    const own = (x, y) => G.in(x, y) && G.apr[I(x, y)] === host.id && k[I(x, y)] === K.APRON, hb = { x0: host.x0, y0: host.y0, x1: host.x0 + host.W, y1: host.y0 + host.H };
    const hostDoor = new Set(host.doors.map((d) => I(d.x, d.y))); let best = null;
    for (const o of ALLO) for (let y0 = host.box.y0; y0 < host.box.y0 + host.box.h; y0++) for (let x0 = host.box.x0; x0 < host.box.x0 + host.box.w; x0++) {
      const F0 = frame(x0, y0, sp.w, sp.d, o.f, o.m); let ok = true;
      for (let yy = y0 - 1; yy <= y0 + F0.H && ok; yy++) for (let xx = x0 - 1; xx <= x0 + F0.W && ok; xx++) { const inF = xx >= x0 && xx < x0 + F0.W && yy >= y0 && yy < y0 + F0.H;
        if (inF && !own(xx, yy)) ok = false; else if (!inF && (hostDoor.has(I(xx, yy)) || xx >= hb.x0 && xx < hb.x1 && yy >= hb.y0 && yy < hb.y1)) ok = false; }
      if (!ok) continue;
      const doors = sp.doors.map((d) => { const c = doorOut(F0, d.side, d.at); return { x: c[0], y: c[1], side: d.side === 'f' ? o.f : d.side, local: d.side, at: d.at, water: false }; });
      if (!doors.every((d) => own(d.x, d.y) && !hostDoor.has(I(d.x, d.y)))) continue;
      const dist = Math.min(Math.abs(x0 + F0.W / 2 - (hb.x0 + hb.x1) / 2) - (F0.W + hb.x1 - hb.x0) / 2, Math.abs(y0 + F0.H / 2 - (hb.y0 + hb.y1) / 2) - (F0.H + hb.y1 - hb.y0) / 2);
      const faces = Math.sign(((hb.x0 + hb.x1) / 2 - (x0 + F0.W / 2)) * SIDE[o.f][0] + ((hb.y0 + hb.y1) / 2 - (y0 + F0.H / 2)) * SIDE[o.f][1]) > 0 ? 1 : 0;   // its door toward the keep
      const s = dist + faces * 3 + (o.f === 's' ? .5 : 0) + r() * .2; if (!best || s > best.s) best = { s, o, x0, y0, F0, doors }; }
    if (!best) return null;
    const id = B.length, Fw = frame(best.x0, best.y0, sp.w, sp.d, best.o.f, best.o.m), snap = { k: k.slice(), bid: G.bid.slice(), apr: G.apr.slice() };
    for (let v = 0; v < sp.d; v++) for (let u = 0; u < sp.w; u++) { const [x, y] = Fw.cell(u, v), i = I(x, y); k[i] = K.BLD; G.bid[i] = id; G.apr[i] = -1; }
    // every door of host and hall still reaches the precinct's way out over precinct ground
    const seen = new Uint8Array(G.n), q = []; for (let i = 0; i < G.n; i++) if (own(i % W, (i / W) | 0) && N4.some(([dx, dy]) => { const x = i % W + dx, y = ((i / W) | 0) + dy; return G.in(x, y) && G.apr[I(x, y)] !== host.id && isWay(k[I(x, y)]); })) { seen[i] = 1; q.push(i); }
    for (let h = 0; h < q.length; h++) { const c0 = q[h]; for (const [dx, dy] of N4) { const x = c0 % W + dx, y = ((c0 / W) | 0) + dy; if (!own(x, y) || seen[I(x, y)]) continue; seen[I(x, y)] = 1; q.push(I(x, y)); } }
    if (![...host.doors, ...best.doors].every((d) => seen[I(d.x, d.y)])) { restore(snap); return null; }
    const b = { id, type: sp.type, variant: sp.variant, role: sp.role, monument: false, proxy: sp.proxy, x0: best.x0, y0: best.y0, W: best.F0.W, H: best.F0.H, w: sp.w, d: sp.d, f: best.o.f, m: best.o.m, doors: best.doors,
      box: { x0: best.x0, y0: best.y0, w: best.F0.W, h: best.F0.H }, apron: null, courts: [], storeys: sp.storeys, cx: best.x0 + best.F0.W / 2, cy: best.y0 + best.F0.H / 2, host: host.id };
    B.push(b); return b; };
  const apronLinked = (id) => { for (let i = 0; i < G.n; i++) if (G.apr[i] === id && k[i] === K.APRON) { const x = i % W, y = (i / W) | 0; for (const [dx, dy] of N4) { const kk = G.at(x + dx, y + dy); if (G.in(x + dx, y + dy) && isWay(kk)) return true; } } return false; };
  const apronExit = (id, c, D) => { // the apron cell nearest a way (front side first)
    let best = -1, bd = 1e9; const tgt = D ? [c.x0 + D.c[0], c.y0 + D.c[1]] : [c.bx + c.bw / 2, c.by + c.bh];
    for (let i = 0; i < G.n; i++) if (G.apr[i] === id && k[i] === K.APRON) { const x = i % W, y = (i / W) | 0; if (!N4.some(([dx, dy]) => G.in(x + dx, y + dy) && G.apr[I(x + dx, y + dy)] !== id && (k[I(x + dx, y + dy)] === K.OUT || isWay(k[I(x + dx, y + dy)])))) continue;
      const d = F.mkt[i] * .5 + Math.hypot(x - tgt[0], y - tgt[1]); if (d < bd) { bd = d; best = i; } }
    return best; };
  // a path from cell `from` over open ground to the nearest way; laid as a lane (a track outside the town)
  const link = (from, sp) => {
    if (from < 0) return false; if (isWay(k[from])) return true;
    const prev = new Int32Array(G.n).fill(-2), q = [from]; prev[from] = -1; let hit = -1;
    for (let h = 0; h < q.length && hit < 0; h++) { const c0 = q[h], x = c0 % W, y = (c0 / W) | 0; if (h > 1600 * nMaps) break;
      for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (prev[j] !== -2) continue; const kk = k[j];
        if (isWay(kk) && kk !== K.BEACH) { prev[j] = c0; hit = j; break; } if (kk !== K.OUT && !(kk === K.APRON && G.apr[j] === G.apr[from] && G.apr[from] >= 0)) continue; prev[j] = c0; q.push(j); } }
    if (hit < 0) return false;
    let n = 0; for (let c0 = prev[hit]; c0 >= 0; c0 = prev[c0]) { if (k[c0] === K.OUT || c0 === from && k[c0] !== K.APRON) { k[c0] = R[c0] ? K.LANE : K.TRACK; n++; } }
    return n < 40 * Math.sqrt(nMaps);
  };

  // ---------------- phases: market buildings, worship and the lord, water works, walls, edge, frontage ----------------
  // within a phase: what must stand on the market first (it has the least choice), then the biggest
  const onMk = (s) => s.req.some((q) => q.t === 'onMarket' || q.t === 'inMarket') ? 1 : 0;
  const byPhase = (p) => specs.filter((s) => s.phase === p).sort((a, b) => (B0 && B0.loose ? 0 : onMk(b) - onMk(a)) || b.w * b.d - a.w * a.d);   // in a precinct the biggest first: the great church before its lesser buildings
  // a building that finds no site tries its grammar's smaller variant before it is dropped
  const place = (sp, ph) => { let cur = sp; for (;;) { const b = placeOne(cur, ph); if (b) return b; const v = gm.smaller && gm.smaller(cur.type, cur.variant, !!B0); if (!v) return null; cur = gm.spec(v.type, v.variant); note(`${ph}: trying ${cur.type} ${cur.variant}`); } };
  for (const sp of byPhase(1)) place(sp, 'market');
  for (const sp of byPhase(2)) place(sp, 'worship/lord');
  refields();
  for (const sp of byPhase(3)) place(sp, 'water works');
  if (pf.walled) { walls(); refields(); }
  for (const sp of byPhase(5)) place(sp, 'edge');
  for (const sp of byPhase(6)) place(sp, 'frontage');

  // ---------------- walls: a ring just outside the town ground, gates where roads cross, a lane inside ----------------
  function walls() {
    const In = new Uint8Array(G.n); for (let i = 0; i < G.n; i++) In[i] = R[i];
    for (const b of B) if (R[I(b.cx | 0, b.cy | 0)]) for (let y = b.box.y0; y < b.box.y0 + b.box.h; y++) for (let x = b.box.x0; x < b.box.x0 + b.box.w; x++) In[I(x, y)] = 1;
    // straighten: rows in bands of like extent, each band one rectangle, so the wall runs in long straight lengths
    { let y0 = -1, y1 = -1; const Lx = [], Rx = []; for (let y = 0; y < H; y++) { let a = 1e4, b = -1; for (let x = 0; x < W; x++) if (In[I(x, y)]) { a = Math.min(a, x); b = Math.max(b, x); } Lx[y] = a; Rx[y] = b; if (b >= 0) { if (y0 < 0) y0 = y; y1 = y; } }
      const roadRow = (y) => { let n = 0; for (let x = 0; x < W; x++) if (k[I(x, y)] === K.MAIN || k[I(x, y)] === K.ROAD) n++; return n > W / 3; };
      const bands = []; let s = y0;
      while (s <= y1) { let e = s, la = Lx[s] < 1e4 ? Lx[s] : 1e4, lb = Lx[s], ra = Rx[s], rb = Rx[s];
        while (e + 1 <= y1) { const L2 = Lx[e + 1], R2 = Rx[e + 1]; if (R2 < 0) break; const na = Math.min(la, L2), nb = Math.max(lb, L2), nra = Math.min(ra, R2), nrb = Math.max(rb, R2);
          if (e - s + 1 >= 5 && (nb - na > 3 || nrb - nra > 3) && !roadRow(e + 1) && !roadRow(e) && !roadRow(e + 2)) break; la = na; lb = nb; ra = nra; rb = nrb; e++; }
        bands.push([s, e, la, rb]); s = e + 1; }
      for (const [a, b, l, rr] of bands) for (let y = a; y <= b; y++) for (let x = l; x <= rr; x++) if (!isWater(k[I(x, y)]) && k[I(x, y)] !== K.BEACH) In[I(x, y)] = 1; }
    // a building outside that stands hard against the line (within two cells) is taken inside: the wall never squeezes past its door
    for (let pass = 0; pass < 2; pass++) for (const b of B) { const bx = b.box; let near = false, all = true;
      for (let y = bx.y0 - 2; y < bx.y0 + bx.h + 2; y++) for (let x = bx.x0 - 2; x < bx.x0 + bx.w + 2; x++) { if (!G.in(x, y)) continue; const inside = x >= bx.x0 && y >= bx.y0 && x < bx.x0 + bx.w && y < bx.y0 + bx.h; if (inside) { if (!In[I(x, y)]) all = false; } else if (In[I(x, y)]) near = true; }
      if (near && !all) for (let y = bx.y0 - 1; y <= bx.y0 + bx.h; y++) for (let x = bx.x0 - 1; x <= bx.x0 + bx.w; x++) if (G.in(x, y) && x > 0 && y > 0 && x < W - 1 && y < H - 1 && !isWater(k[I(x, y)])) In[I(x, y)] = 1; }
    const ring = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = I(x, y); if (In[i]) continue; if (N8.some(([dx, dy]) => In[I(x + dx, y + dy)])) ring.push(i); }
    const runs = [], onRing = new Uint8Array(G.n); for (const i of ring) onRing[i] = 1;
    const doorAt = new Uint8Array(G.n); for (const b of B) for (const d of b.doors) if (G.in(d.x, d.y)) doorAt[I(d.x, d.y)] = 1;
    for (const i of ring) { const kk = k[i]; if (isWater(kk) || kk === K.BEACH || kk === K.QUAY) continue; if (kk === K.BLD || kk === K.APRON || kk === K.COURT) continue;
      if (doorAt[i]) { k[i] = K.GATE; G.apr[i] = -2; continue; }   // a building already standing where the wall runs keeps its door: a postern
      if (kk === K.MAIN || kk === K.ROAD || kk === K.STREET || kk === K.BRIDGE) { k[i] = K.GATE; continue; } if (kk === K.LANE || kk === K.TRACK) { // a postern only where the lane really passes through (a way inside and a way outside); a lane running along the wall line is walled over
        const x = i % W, y = (i / W) | 0, thr = (want) => N4.some(([dx, dy]) => { const j = I(x + dx, y + dy); return G.in(x + dx, y + dy) && !!In[j] === want && isWay(k[j]) && (want || !onRing[j]); });
        if (thr(true) && thr(false)) { k[i] = K.GATE; G.apr[i] = -2; continue; } } k[i] = K.WALL; }
    for (let i = 0; i < G.n; i++) G.ins[i] = In[i];
    // ditch four cells out (a berm between, where the gatehouses stand); ways cross it on bridges
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = I(x, y); if (In[i] || k[i] === K.WALL || k[i] === K.GATE) continue; let d = 9; for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (G.in(x + dx, y + dy) && In[I(x + dx, y + dy)]) d = Math.min(d, Math.max(Math.abs(dx), Math.abs(dy)));
      if (d !== 4 || y >= H - 2) continue; const kk = k[i]; if (isWay(kk) && kk !== K.QUAY && kk !== K.BEACH) k[i] = K.BRIDGE; else if (kk === K.OUT) k[i] = K.DITCH; }
    // the lane inside the wall
    if (gm.wallLane) for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = I(x, y); if (!In[i] || k[i] !== K.OUT) continue; if (N8.some(([dx, dy]) => k[I(x + dx, y + dy)] === K.WALL || k[I(x + dx, y + dy)] === K.GATE)) k[i] = K.LANE; }
    // gatehouses where main roads pass: a building astride the passage, passage cells stay open
    const seen = new Set(), gsp = gm.types.gate ? gm.spec('gate') : null;
    for (const i of ring) { if (k[i] !== K.GATE || G.apr[i] === -2 || seen.has(i)) continue; const x = i % W, y = (i / W) | 0;
      const horiz = k[I(x + 1, y)] === K.GATE || k[I(x - 1, y)] === K.GATE || (k[I(x, y - 1)] !== K.GATE && k[I(x, y + 1)] !== K.GATE && (In[I(x, y - 1)] || In[I(x, y + 1)]));
      const run = []; for (let u = horiz ? x : y; ; u++) { const j = horiz ? I(u, y) : I(x, u); if (k[j] !== K.GATE || G.apr[j] === -2) break; run.push(j); seen.add(j); }
      for (let u = (horiz ? x : y) - 1; ; u--) { const j = horiz ? I(u, y) : I(x, u); if (k[j] !== K.GATE || G.apr[j] === -2) break; run.unshift(j); seen.add(j); }
      const inDir = horiz ? (In[I(x, y - 1)] ? 'n' : 's') : (In[I(x - 1, y)] ? 'w' : 'e');
      const g = { dir: OPP[inDir], line: horiz ? y : x, u: horiz ? run[0] % W : (run[0] / W) | 0, wide: run.length, cx: horiz ? (run[0] % W) + run.length / 2 : x + .5, cy: horiz ? y + .5 : ((run[0] / W) | 0) + run.length / 2, inDir };
      P.gates.push(g);
      if (gsp) { // towers either side of the passage, one cell each way across the wall line
        const span = gsp.w, a0 = g.u - Math.floor((span - run.length) / 2), id = B.length, cells = [];
        const od = SIDE[g.dir], inPass = (xx, yy) => horiz ? xx >= g.u && xx < g.u + run.length : yy >= g.u && yy < g.u + run.length;
        const flank = (t) => { const xx = horiz ? t : x, yy = horiz ? y : t; return G.in(xx, yy) && k[I(xx, yy)] === K.WALL; };
        if (!flank(g.u - 1) || !flank(g.u + run.length)) { g.water = true; continue; }   // an opening beside water: no gatehouse
        // the gatehouse: three rows from the wall outward, or one inside and one outside where water presses on the wall
        // centred on the passage if it fits, else slid along the wall (a precinct or a jog in the wall line beside the gate)
        const shifts = [0]; for (let d = 1; d <= span - run.length - Math.floor((span - run.length) / 2) || d <= Math.floor((span - run.length) / 2); d++) shifts.push(-d, d);
        const tries = []; for (const sh of shifts) { const a = a0 + sh; if (a > g.u || a + span < g.u + run.length) continue; for (const os of [[0, 1, 2], [-1, 0, 1]]) tries.push([a, os]); }
        for (const [a, os] of tries) { cells.length = 0;
          for (let t = 0; t < span; t++) for (const o of os) { const xx = horiz ? a + t : x + od[0] * o, yy = horiz ? y + od[1] * o : a + t; cells.push([xx, yy]); }
          if (!cells.every(([xx, yy]) => { if (!G.in(xx, yy) || doorAt[I(xx, yy)]) return false; const kk = k[I(xx, yy)]; return inPass(xx, yy) ? isWay(kk) || kk === K.GATE : kk === K.WALL || kk === K.OUT || kk === K.TRACK || (os[0] < 0 && kk === K.LANE); })) continue;   // a field track along the wall foot gives way to the gatehouse
          for (const [xx, yy] of cells) { const j = I(xx, yy); G.bid[j] = id; if (k[j] !== K.GATE && !inPass(xx, yy)) k[j] = K.BLD; else k[j] = K.GATE; }
          const f = inDir, xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
          B.push({ id, type: 'gate', role: 'gate', x0, y0, W: horiz ? span : 3, H: horiz ? 3 : span, w: span, d: 3, f, m: 0, doors: [], box: { x0, y0, w: horiz ? span : 3, h: horiz ? 3 : span }, apron: null, courts: [], storeys: gsp.storeys, cx: g.cx, cy: g.cy, gate: g }); break; } } }
    // towers on straight runs, about every ten cells, clear of gates; they stand out from the wall, their doors on the lane
    const tsp = gm.types.walltower ? gm.spec('walltower') : null;
    if (tsp) { const fin = [];
      for (const i of ring) { if (k[i] !== K.WALL) continue; const x = i % W, y = (i / W) | 0;
        if (P.gates.some((g) => Math.hypot(x + .5 - g.cx, y + .5 - g.cy) < 7) || fin.some(([a, b]) => Math.max(Math.abs(a - x), Math.abs(b - y)) < 9)) continue;
        for (const [dx, dy, out] of [[1, 0, null], [0, 1, null]]) { const x2 = x + dx, y2 = y + dy; if (G.at(x2, y2) !== K.WALL) continue;
          const o = dx ? (In[I(x, y - 1)] ? [0, 1] : In[I(x, y + 1)] ? [0, -1] : null) : (In[I(x - 1, y)] ? [1, 0] : In[I(x + 1, y)] ? [-1, 0] : null); if (!o) continue;
          const c4 = [[x, y], [x2, y2], [x + o[0], y + o[1]], [x2 + o[0], y2 + o[1]]]; if (!c4.every(([a, b]) => G.in(a, b) && !doorAt[I(a, b)] && (k[I(a, b)] === K.WALL || k[I(a, b)] === K.OUT || k[I(a, b)] === K.DITCH))) continue;
          const id = B.length; for (const [a, b] of c4) { k[I(a, b)] = K.BLD; G.bid[I(a, b)] = id; } fin.push([x, y]);
          const f = o[1] === 1 ? 'n' : o[1] === -1 ? 's' : o[0] === 1 ? 'w' : 'e', bx = Math.min(...c4.map((c) => c[0])), by = Math.min(...c4.map((c) => c[1]));
          B.push({ id, type: 'walltower', role: 'walltower', x0: bx, y0: by, W: 2, H: 2, w: 2, d: 2, f, m: 0, doors: [], box: { x0: bx, y0: by, w: 2, h: 2 }, apron: null, courts: [], storeys: tsp.storeys, cx: bx + 1, cy: by + 1 }); P.towers.push({ x: bx, y: by }); break; } } }
  }

  // ---------------- streets and plots ----------------
  const inTown = (i) => B0 ? B0.inner[i] === 1 : pf.walled ? G.ins[i] === 1 : R[i] === 1;
  // suburbs: along the roads out of the gates (walled) or out of the town (open), a plot deep either side
  const sub = B0 ? B0.sub : new Uint8Array(G.n);
  if (!B0) { const ways0 = cells((kk) => kk === K.MAIN || kk === K.ROAD); const d = field(G, ways0, (kk) => kk === K.OUT, 7);
    const gd = field(G, P.gates.length ? P.gates.map((g) => I(g.cx | 0, g.cy | 0)) : cells((kk, i) => R[i] && (kk === K.MAIN)), () => true);
    const len = pf.rank >= 2 ? 14 : pf.rank === 1 ? 9 : 5;
    for (let i = 0; i < G.n; i++) if (!inTown(i) && k[i] === K.OUT && d[i] <= 6 && gd[i] <= len && !N8.some(([dx, dy]) => { const x = i % W + dx, y = ((i / W) | 0) + dy; return G.in(x, y) && (k[I(x, y)] === K.DITCH || k[I(x, y)] === K.WALL); })) sub[i] = 1; }
  const land = (i) => k[i] === K.OUT && (inTown(i) || sub[i]);
  const plotKind = (wk, i) => !inTown(i) ? 'edge' : wk === K.SQUARE ? 'market' : wk === K.MAIN || wk === K.ROAD || wk === K.QUAY ? 'main' : wk === K.STREET ? 'side' : 'back';
  const tailCand = new Set();
  const frontage = (kinds, back) => {
    // frontage cells: open land with a way of the given kinds on one side; runs along each street side
    const fr = new Map(); // key dir|line -> [{u, i, wk}]
    for (let i = 0; i < G.n; i++) { if (!land(i)) continue; const x = i % W, y = (i / W) | 0;
      for (const [s, [dx, dy]] of Object.entries(SIDE)) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const wk = k[I(nx, ny)]; if (!kinds.includes(wk)) continue;
        const key = s + '|' + (dx ? x : y), u = dx ? y : x; if (!fr.has(key)) fr.set(key, []); fr.get(key).push({ u, i, wk }); break; } }
    const md = (key) => Math.min(...fr.get(key).map((c) => F.mkt[c.i]));
    const keys = [...fr.keys()].sort((a, b) => ((RANK[fr.get(b)[0].wk] || 0) - (RANK[fr.get(a)[0].wk] || 0)) * 4 + (md(a) - md(b)) / 6);
    for (const key of keys) { const [s] = key.split('|'), list = fr.get(key).sort((a, b) => a.u - b.u), [fx, fy] = SIDE[s]; // fx,fy points from the plot to the street
      let run = []; const flush = () => { if (run.length) cutRun(run, s, fx, fy); run = []; };
      for (const c of list) { if (run.length && (c.u !== run[run.length - 1].u + 1 || c.wk !== run[0].wk)) flush(); run.push(c); } flush(); }
  };
  let housed = 0;
  const cutRun = (run, s, fx, fy) => {
    if (housed >= pf.households) return;
    const i0 = run[0].i, cls = plotKind(run[0].wk, i0), pc = (B0 && B0.plots || gm.plots)[cls], D = ri(pc.d[0], pc.d[1]), every = ri(gm.crossLaneEvery[0], gm.crossLaneEvery[1]);
    let n = 0;
    for (let a = 0; a < run.length;) {
      let w = ri(pc.w[0], pc.w[1]); if (r() < gm.merge && cls !== 'edge') w += 1; w = Math.min(w, run.length - a);
      let cols = run.slice(a, a + w).map((c) => c.i);
      if (!cols.every(land)) { a++; continue; }
      { const m0 = mapOf(cols[0]), cut = cols.findIndex((c) => mapOf(c) !== m0); if (cut > 0) { cols = cols.slice(0, cut); w = cut; } }
      // a cross lane every so often on the main streets: an alley back to the back lane
      if ((cls === 'main' || cls === 'market') && n > 0 && n % every === 0 && gm.backLanes) { const c = cols[0]; let x = c % W, y = (c / W) | 0; for (let j = 0; j <= D; j++) { const ii = I(x, y); if (!G.in(x, y) || !(k[ii] === K.OUT)) break; k[ii] = K.ALLEY; x -= fx; y -= fy; } n++; a += 1; continue; }
      let dep = D; for (const c of cols) { let x = c % W, y = (c / W) | 0, j = 0; while (j < dep && G.in(x, y) && land(I(x, y)) && mapOf(I(x, y)) === mapOf(c)) { j++; x -= fx; y -= fy; } dep = Math.min(dep, j); }
      if (dep < 2) { a += w; continue; }
      if (housed >= pf.households) return;
      const id = P.plots.length, hd = Math.min(dep, ri(pc.house[0], pc.house[1])), vacant = r() < pc.gap; if (!vacant) housed += (B0 && B0.hhPerHouse || gm.hhPerHouse)[cls] || 1;
      let xs = [], ys = [];
      for (const c of cols) { let x = c % W, y = (c / W) | 0; for (let j = 0; j < dep; j++) { const ii = I(x, y); k[ii] = vacant ? K.GREEN : j < hd ? K.HOUSE : K.GARDEN; G.pid[ii] = id; xs.push(x); ys.push(y); if (j === dep - 1 && dep === D) { const tx = x - fx, ty = y - fy; if (G.in(tx, ty) && land(I(tx, ty))) tailCand.add(I(tx, ty)); } x -= fx; y -= fy; } }
      const hx = [], hy = []; for (const c of cols) { let x = c % W, y = (c / W) | 0; for (let j = 0; j < hd; j++) { hx.push(x); hy.push(y); x -= fx; y -= fy; } }
      P.plots.push({ id, cls, dist: gm.district(F.mkt[cols[0]], F.water[cols[0]] <= 3, !inTown(cols[0])), f: s, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) + 1, d: Math.max(...ys) - Math.min(...ys) + 1, street: run[0].wk, vacant,
        house: vacant ? null : { x: Math.min(...hx), y: Math.min(...hy), w: Math.max(...hx) - Math.min(...hx) + 1, d: Math.max(...hy) - Math.min(...hy) + 1 } });
      a += w; n++; }
  };
  // back lanes along the tails of the deep plots, joined to the streets at their ends
  const backLanes = () => { const set = [...tailCand].filter((i) => k[i] === K.OUT); for (const i of set) k[i] = K.LANE; tailCand.clear();
    for (const i of set) { const x = i % W, y = (i / W) | 0; const n = N4.filter(([dx, dy]) => k[I(cl(x + dx, 0, W - 1), cl(y + dy, 0, H - 1))] === K.LANE).length; if (n !== 1) continue;
      const [dx, dy] = N4.find(([dx, dy]) => k[I(cl(x - dx, 0, W - 1), cl(y - dy, 0, H - 1))] === K.LANE) || [0, 0]; if (!dx && !dy) continue;
      let xx = x + dx, yy = y + dy, path = []; for (let s = 0; s < 14 && G.in(xx, yy); s++) { const kk = k[I(xx, yy)]; if (isWay(kk) || kk === K.GATE) { for (const j of path) k[j] = K.LANE; break; } if (kk !== K.OUT) break; path.push(I(xx, yy)); xx += dx; yy += dy; } } };
  // side streets through any big piece of land the frontages left
  const noLine = new Uint8Array(G.n);
  const sideStreets = (min, kind, wd) => { let added = 0;
    for (let iter = 0; iter < (B0 ? 40 : 14); iter++) { const comp = new Int32Array(G.n).fill(-1), comps = [];
      for (let i = 0; i < G.n; i++) { if (comp[i] >= 0 || !land(i)) continue; const q = [i]; comp[i] = comps.length; const c = { n: 0, x0: 1e4, y0: 1e4, x1: -1, y1: -1, skip: noLine[i] };
        for (let h = 0; h < q.length; h++) { const j = q[h], x = j % W, y = (j / W) | 0; c.n++; c.x0 = Math.min(c.x0, x); c.x1 = Math.max(c.x1, x); c.y0 = Math.min(c.y0, y); c.y1 = Math.max(c.y1, y);
          for (let e = 0; e < 4; e++) { let jj; if (e === 0) { if (x + 1 >= W) continue; jj = j + 1; } else if (e === 1) { if (x < 1) continue; jj = j - 1; } else if (e === 2) { if (y + 1 >= H) continue; jj = j + W; } else { if (y < 1) continue; jj = j - W; } if (comp[jj] < 0 && land(jj)) { comp[jj] = comp[i]; q.push(jj); } } } comps.push(c); }
      const big = comps.map((c, id) => ({ ...c, id })).filter((c) => !c.skip && c.n >= min && Math.min(c.x1 - c.x0, c.y1 - c.y0) >= 6).sort((a, b) => b.n - a.n);
      if (!big.length) break; const c = big[0], vert = (c.y1 - c.y0) >= (c.x1 - c.x0);
      // the line through the middle, run out both ways to the first way it meets
      // a line through the middle, run out both ways to the first way it meets; it may cut across plot backs, never a house
      let done = false;
      const tries = []; for (const v2 of [vert, !vert]) { const span = v2 ? c.x1 - c.x0 : c.y1 - c.y0; for (let o = 0; o <= span / 2 - 3; o += 2) { tries.push([v2, o, o + (v2 === vert ? 0 : 1)]); if (o) tries.push([v2, -o, o + (v2 === vert ? 0 : 1)]); } }
      tries.sort((p, q) => p[2] - q[2]);
      for (const [v2, off] of tries) {
        const mid = (v2 ? Math.round((c.x0 + c.x1) / 2) : Math.round((c.y0 + c.y1) / 2)) + off + (pf.planted ? 0 : ri(-1, 1));
        const run = (from, step) => { const cellsL = []; for (let u = from; u >= 0 && u < (v2 ? H : W); u += step) { let stop = false, ok = true;
            for (let j = 0; j < wd; j++) { const x = v2 ? mid + j : u, y = v2 ? u : mid + j; if (!G.in(x, y)) { ok = false; break; } const ii = I(x, y), kk = k[ii];
              if (isWay(kk) || kk === K.GATE) stop = true; else if (!((kk === K.OUT || kk === K.GARDEN || kk === K.GREEN) && (inTown(ii) || sub[ii]))) ok = false; }
            if (stop) return cellsL; if (!ok) return null; for (let j = 0; j < wd; j++) cellsL.push(v2 ? I(mid + j, u) : I(u, mid + j)); } return null; };
        const st = v2 ? Math.round((c.y0 + c.y1) / 2) : Math.round((c.x0 + c.x1) / 2);
        if (!(v2 ? st >= c.y0 && st <= c.y1 : st >= c.x0 && st <= c.x1)) continue;
        const ii0 = v2 ? I(mid, st) : I(st, mid); if (!G.in(v2 ? mid : st, v2 ? st : mid) || comp[ii0] !== c.id) continue;
        const a0 = run(st, -1), b0 = run(st + 1, 1), a = a0 && a0.length ? a0 : null, b = b0 && b0.length ? b0 : null; if (!a && !b) continue;
        // never alongside a way already there: two streets side by side make a wide bare strip, not a street
        { const all = [...(a || []), ...(b || [])]; let par = 0; for (const j of all) { const x = j % W, y = (j / W) | 0;
            for (const t of [-2, -1, wd, wd + 1]) { const xx = v2 ? x - (x - mid) + t : x, yy = v2 ? y : y - (y - mid) + t; if (G.in(xx, yy) && isWay(k[I(xx, yy)])) { par++; break; } } }
          if (par > all.length / wd * .3) continue; }
        if (globalThis.DBGSS) console.log("  lay", v2, mid, st, (a || []).length, (b || []).length);
        for (const j of [...(a || []), ...(b || [])]) { k[j] = kind; G.pid[j] = -1; } done = true; break; }
      if (globalThis.DBGSS) console.log("ss", kind, c.n, c.x0, c.y0, c.x1, c.y1, done);
      // in a city ward a piece may lie between wall and river with its only way at one corner: no straight line through
      // its middle meets a way, so a street runs from its middle by the shortest way over its own ground to the nearest way
      if (!done && B0) { const prev = new Int32Array(G.n).fill(-2), q = [];
        for (let i = 0; i < G.n; i++) if (comp[i] === c.id) { const x = i % W, y = (i / W) | 0; if (N4.some(([dx, dy]) => G.in(x + dx, y + dy) && (isWay(k[I(x + dx, y + dy)]) || k[I(x + dx, y + dy)] === K.GATE))) { prev[i] = -1; q.push(i); } }
        for (let h = 0; h < q.length; h++) { const cc = q[h], x = cc % W, y = (cc / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (prev[j] === -2 && comp[j] === c.id) { prev[j] = cc; q.push(j); } } }
        // the deepest cell of the piece, and the shortest way from it back out: the new street reaches into the middle
        if (q.length) { let n = 0; for (let cc = q[q.length - 1]; cc >= 0; cc = prev[cc]) { for (let j = 0; j < wd; j++) { const ii = j ? (vert ? cc + 1 : cc + W) : cc; if (ii < G.n && comp[ii] === c.id) { k[ii] = kind; G.pid[ii] = -1; } } n++; } done = n > 2; } if (globalThis.DBGSS) console.log("  fallback", q.length, done); }
      if (!done) { for (let i = 0; i < G.n; i++) if (comp[i] === c.id) noLine[i] = 1; } else added++; }   // left open: later frontages may still plot it; what stays empty turns green at the end
    return added; };

  // planted towns: the grid first, stopped short where a building stands
  if (!B0 && pf.planted && pf.rank >= 1) { const sp = 2 * ri(7, 9) + 1, sx = ri(15, 19);
    for (let x = cx + 1 + sp; x < W - 2; x += sp) for (let y = 0; y < H; y++) if (k[I(x, y)] === K.OUT && inTown(I(x, y))) { k[I(x, y)] = K.STREET; if (k[I(x + 1, y)] === K.OUT && inTown(I(x + 1, y))) k[I(x + 1, y)] = K.STREET; }
    for (let x = cx + 1 - sp; x > 1; x -= sp) for (let y = 0; y < H; y++) if (k[I(x, y)] === K.OUT && inTown(I(x, y))) { k[I(x, y)] = K.STREET; if (k[I(x + 1, y)] === K.OUT && inTown(I(x + 1, y))) k[I(x + 1, y)] = K.STREET; }
    for (let y = cy - sx; y > 1; y -= sx) for (let x = 0; x < W; x++) if (k[I(x, y)] === K.OUT && inTown(I(x, y))) { k[I(x, y)] = K.STREET; if (k[I(x, y + 1)] === K.OUT && inTown(I(x, y + 1))) k[I(x, y + 1)] = K.STREET; }
    for (let y = cy + sx; y < H - 2; y += sx) for (let x = 0; x < W; x++) if (k[I(x, y)] === K.OUT && inTown(I(x, y))) { k[I(x, y)] = K.STREET; if (k[I(x, y + 1)] === K.OUT && inTown(I(x, y + 1))) k[I(x, y + 1)] = K.STREET; } }

  frontage([K.SQUARE, K.MAIN, K.ROAD, K.QUAY]);
  if (gm.backLanes) backLanes();
  sideStreets(B0 && B0.sideMin ? B0.sideMin[0] : 90, K.STREET, ways.side);
  frontage([K.STREET]);
  sideStreets(B0 && B0.sideMin ? B0.sideMin[1] : 40, K.LANE, 1);
  frontage([K.LANE, K.ALLEY, K.TRACK]);
  frontage([K.STREET, K.LANE, K.ALLEY]);

  // ---------------- one street network: join stray pieces (back lanes, alleys) by the shortest way over open ground ----------------
  { const walk = (kk) => isWay(kk) && kk !== K.BEACH || kk === K.APRON || kk === K.GATE; let baseWay = null;
    const gave = new Uint8Array(G.n);
    for (let pass = 0; pass < 80; pass++) {
      const seen = new Uint8Array(G.n), q = [I(P.start ? P.start[0] : cx + 1, P.start ? P.start[1] : H - 1)];
      { let s0 = -1; for (let y = H - 1; y >= 0 && s0 < 0; y--) for (let x = 0; x < W; x++) if (k[I(x, y)] === K.MAIN || k[I(x, y)] === K.ROAD) { s0 = I(x, y); break; } q[0] = s0 >= 0 ? s0 : I(cx + 1, cy); }
      seen[q[0]] = 1; if (B0) { if (!baseWay) { baseWay = []; for (let i = 0; i < G.n; i++) if (B0.G0k ? isWay(B0.G0k[i]) : false) baseWay.push(i); } for (const i of baseWay) if (!seen[i] && walk(k[i])) { seen[i] = 1; q.push(i); } }   // a ward: the city's own ways all join beyond the window
      for (let h = 0; h < q.length; h++) { const c0 = q[h], x = c0 % W, y = (c0 / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (seen[j] || !walk(k[j])) continue; seen[j] = 1; q.push(j); } }
      const stray = []; for (let i = 0; i < G.n; i++) if (walk(k[i]) && !seen[i] && !gave[i] && k[i] !== K.QUAY && k[i] !== K.PIER) stray.push(i);
      if (!stray.length) break;
      // grow from the stray piece over open ground (and plot backs, never houses) to the network
      const comp = new Set([stray[0]]), cq = [stray[0]]; for (let h = 0; h < cq.length; h++) { const c0 = cq[h], x = c0 % W, y = (c0 / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (comp.has(j) || !walk(k[j]) || seen[j]) continue; comp.add(j); cq.push(j); } }
      let prev, hit = -1;
      for (const thru of [false, true, 2]) { // second try: an entry through a house (a covered passage), as old towns had; last: a footbridge over the ditch or a postern in the wall
        prev = new Int32Array(G.n).fill(-2); const bq = [...comp]; for (const c0 of bq) prev[c0] = -1; hit = -1;
        for (let h = 0; h < bq.length && hit < 0; h++) { const c0 = bq[h], x = c0 % W, y = (c0 / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (prev[j] !== -2) continue;
            if (seen[j]) { prev[j] = c0; hit = j; break; } const kk = k[j]; if (!(kk === K.OUT || kk === K.GREEN || kk === K.GARDEN || kk === K.FIELD || (thru && kk === K.HOUSE) || (thru === 2 && (kk === K.DITCH || kk === K.WALL)))) continue; prev[j] = c0; bq.push(j); } }
        if (hit >= 0) break; }
      if (hit < 0) { for (const j of comp) { gave[j] = 1; if (k[j] === K.LANE || k[j] === K.ALLEY || k[j] === K.TRACK || k[j] === K.STREET) k[j] = K.GREEN; } continue; }
      for (let c0 = prev[hit]; c0 >= 0 && prev[c0] !== -1 || (c0 >= 0 && !comp.has(c0)); c0 = prev[c0]) { if (comp.has(c0)) break; if (k[c0] === K.HOUSE) P.entries = (P.entries || 0) + 1; k[c0] = k[c0] === K.DITCH ? K.BRIDGE : k[c0] === K.WALL ? (G.apr[c0] = -2, K.GATE) : inTown(c0) ? K.ALLEY : K.TRACK; G.pid[c0] = -1; } } }

  // ---------------- what is left: orchards and closes in the town, fields beyond ----------------
  for (let i = 0; i < G.n; i++) if (k[i] === K.OUT) { if (inTown(i)) k[i] = K.GREEN; }
  { const fw = ri(5, 7), fh = ri(3, 5); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = I(x, y); if (k[i] !== K.OUT) continue; let ok = true;
      for (let dy = -1; dy <= 1 && ok; dy++) for (let dx = -1; dx <= 1 && ok; dx++) { const kk = G.at(x + dx, y + dy); if (kk !== K.OUT && kk !== K.FIELD) ok = false; }
      if (ok && rngOf(Math.floor(x / fw) * 73 + Math.floor(y / fh) * 191 + seed * 7)() < .6) k[i] = K.FIELD; } }

  // a house cut off from every way (its lane could not be joined to the town and went back to green) is not built: its plot stays a garden
  for (const p of P.plots) { const h = p.house; if (!h) continue; let ok = false;
    for (let y = h.y - 1; y <= h.y + h.d && !ok; y++) for (let x = h.x - 1; x <= h.x + h.w && !ok; x++) { if (!G.in(x, y) || (x < h.x || x >= h.x + h.w) === (y < h.y || y >= h.y + h.d)) continue; const kk = k[I(x, y)]; if (isWay(kk) && kk !== K.BEACH || kk === K.APRON || kk === K.GATE) ok = true; }
    if (!ok) { for (let y = h.y; y < h.y + h.d; y++) for (let x = h.x; x < h.x + h.w; x++) if (k[I(x, y)] === K.HOUSE && G.pid[I(x, y)] === p.id) k[I(x, y)] = K.GARDEN; p.house = null; } }
  // ---------------- households, start, report ----------------
  const hh = P.plots.reduce((a, p) => a + (p.house ? (B0 && B0.hhPerHouse || gm.hhPerHouse)[p.cls] || 1 : 0), 0);
  P.households = { want: pf.households, got: Math.round(hh), houses: P.plots.filter((p) => p.house).length, cut: Math.round(housed) };
  { let best = null; for (let y = H - 1; y >= H - 8 && !best; y--) for (let x = 0; x < W; x++) if (k[I(x, y)] === K.MAIN || k[I(x, y)] === K.ROAD) { best = [x, y]; break; } P.start = best || [cx + 1, cy]; }
  P.rng = r; P.ri = ri; P.pick = pick;
  P.ms = performance.now() - T0;
  return P;
}
