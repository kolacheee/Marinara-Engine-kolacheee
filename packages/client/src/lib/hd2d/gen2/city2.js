// @ts-nocheck
// gen2/city2.js: the city skeleton. One pass over the whole city at full resolution (one cell = one town cell,
// a map is 52 x 48 of them): water, wall rings by era, gates, gate roads, market places, precinct outlines,
// plan units and wards. Wards are filled later by the gen2 town engine, one at a time, reading only this skeleton.
// Engine code: culture-neutral. How the city grew, its institutions, sizes and counts come from spec.grammar.
import { MW, MH, K, N4, N8, rngOf, makeGrid, field, sat, isWater, isWay } from './grid.js';

export const U = { COUNTRY: 0, CORE: 1, PLANNED: 2, GROWTH: 3, BELT: 4, SUBURB: 5, VILLAGE: 6, PRECINCT: 7, NONE: 255 };
export const UN = ['country', 'core', 'planned', 'growth', 'belt', 'suburb', 'village', 'precinct'];

export function cityProfile(spec) {
  const gm = spec.grammar, r = rngOf((spec.seed | 0) * 104729 + 3);
  const pf = { pop: spec.pop || 12000, region: spec.region || 'en', site: spec.site || (r() < .75 ? 'river' : r() < .5 ? 'coast' : 'plain'), year: spec.year || 1500, real: spec.real || null, flags: spec.flags || {}, planted: !!spec.planted, refugees: spec.refugees || 0 };
  pf.flags = gm.flags(pf, r);
  if (pf.real) { // the real-world seed: institutions only where they really were
    const nm = pf.real.name || '';
    pf.flags.university = gm.real.university.includes(nm);
    if (pf.region === 'lc') pf.flags.bishop = gm.real.bishopLC.includes(nm);
    pf.flags.bourse = gm.real.bourse.some(([n, y]) => n === nm && pf.year >= y);
  } else pf.flags.bourse = (pf.flags.staple || pf.flags.port) && pf.pop >= 15000 && pf.year >= gm.datesOK.bourse;
  pf.households = Math.round(pf.pop / gm.personsPerHousehold);
  return { pf, r };
}

export function citySkeleton(spec) {
  const T0 = performance.now(), gm = spec.grammar, { pf, r } = cityProfile(spec);
  const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const report = [], note = (s) => report.push(s), P0 = {};
  const hist = gm.history(pf, r), sub = gm.suburbShare(pf, r), openIn = gm.openInside(r), D = gm.density;
  const precs = gm.precincts(pf, r);
  // who lives where: the people in precincts, inns and on the street are not households in houses (own random stream, so the plan is unchanged by it)
  if (gm.people) { P0.people = gm.people(pf, precs, rngOf((spec.seed | 0) * 7919 + 101)); pf.households = P0.people.households; }
  const hhIn = Math.round(pf.households * (1 - sub)), hhOut = pf.households - hhIn;
  const precA = precs.filter((p) => !/far|gate/.test(p.zone)).reduce((a, p) => a + (p.w + 4) * (p.h + 4), 0);
  const coreS = hist.core.share, planS = hist.planned ? hist.planned.share : 0;
  const dIn = coreS * D.core + planS * D.planned + (1 - coreS - planS) * D.growth;
  const Ain = hhIn * dIn / (1 - openIn) + precA, R2 = Math.sqrt(Ain / Math.PI) * (pf.site === 'coast' ? 1.13 : 1);
  // suburbs: ribbons along the gate roads, about 9 cells either side, as long as their households need
  const nG = gm.gates(pf, r), ribbon = 13, Ls = cl(Math.round(hhOut * D.suburb / (nG * (2 * ribbon + 3)) * 1.1), 10, 220);
  const margin = Math.max(Ls + 16, 34) + 10;
  // a coast city has the sea a little south of its middle: the grid keeps only a strip of sea
  const coast = pf.site === 'coast', W = MW * Math.ceil((2 * R2 * 1.22 + 2 * margin) / MW), H = MH * Math.ceil((coast ? R2 * 1.22 + margin + R2 * .62 + 40 : 2 * R2 * 1.22 + 2 * margin) / MH);
  const G = makeGrid(W, H), { I } = G, k = G.k;
  const idx = (pred) => { const o = []; for (let i = 0; i < G.n; i++) if (pred(i)) o.push(i); return o; };   // the cells that pass
  G.unit = new Uint8Array(G.n).fill(U.NONE); G.ward = new Int16Array(G.n).fill(-1); G.prc = new Int16Array(G.n).fill(-1); G.ring = new Uint8Array(G.n);
  const P = { ...P0, G, pf, hist, grammar: gm.id, seed: spec.seed | 0, report, gates: [], bars: [], towers: [], markets: [], precincts: [], wards: [], roads: [], bridges: [], quays: [], villages: [], households: pf.households, hhIn, hhOut, R2, Ls };
  const C = [W / 2 + ri(-4, 4), (coast ? margin + R2 * 1.22 : H / 2) + ri(-4, 4)];

  // ---------------- terrain and water ----------------
  const noise = (s, rr = r) => { const gw = Math.ceil(W / s) + 2, gh = Math.ceil(H / s) + 2, v = Float32Array.from({ length: gw * gh }, rr), sm = (t) => t * t * (3 - 2 * t);
    return (x, y) => { const fx = x / s, fy = y / s, ix = Math.floor(fx), iy = Math.floor(fy), tx = sm(fx - ix), ty = sm(fy - iy), a = (i, j) => v[(iy + j) * gw + ix + i];
      return (a(0, 0) * (1 - tx) + a(1, 0) * tx) * (1 - ty) + (a(0, 1) * (1 - tx) + a(1, 1) * tx) * ty; }; };
  { const n1 = noise(60), n2 = noise(18); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) G.h[I(x, y)] = n1(x, y) * .75 + n2(x, y) * .25; }
  const rw = cl(Math.round(4 + pf.pop / 8000), 4, 9);          // river width in cells
  let riverAt = null, seaY = -1, flow = [1, 0];
  if (pf.site === 'river' || pf.site === 'coast') {
    const wv = noise(90), y0 = C[1] + R2 * (pf.site === 'coast' ? -9 : .28);
    if (pf.site === 'coast') { // the sea to the south, a river down to it
      seaY = Math.round(C[1] + R2 * .62); flow = [0, 1];
      for (let y = seaY; y < H; y++) for (let x = 0; x < W; x++) G.set(x, y + Math.round((wv(x, 0) - .5) * 6), K.SEA);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (y >= seaY + 8) G.set(x, y, K.SEA);
      const x0 = C[0] + R2 * (r() < .5 ? -.3 : .3); riverAt = (y) => Math.round(x0 + (wv(0, y) - .5) * R2 * .5);
      for (let y = 0; y < seaY + 4; y++) { const xc = riverAt(y); for (let j = 0; j < rw; j++) if (k[I(cl(xc + j, 0, W - 1), y)] !== K.SEA) G.set(xc + j, y, K.RIVER); }
    } else {
      riverAt = (x) => Math.round(y0 + (wv(x, 0) - .5) * R2 * .55);
      for (let x = 0; x < W; x++) { const yc = riverAt(x); for (let j = 0; j < rw; j++) G.set(x, yc + j, K.RIVER); }
    }
  }
  P.flow = flow; P.seaY = seaY;
  // the core: on the bank by the crossing (river), behind the harbour (coast), on the highest ground near the middle (plain)
  let core;
  if (pf.site === 'river') { const x = Math.round(C[0] + ri(-8, 8)); core = [x, riverAt(x) - Math.round(R2 * .25)]; }
  else if (pf.site === 'coast') { const y = seaY - Math.round(R2 * .3); core = [riverAt(y) + (r() < .5 ? -1 : 1) * Math.round(R2 * .18), y]; }
  else core = [Math.round(C[0]), Math.round(C[1])];
  P.core = core;

  P.t = P.t || {}; P.t['wall'] = Math.round(performance.now() - T0);
  // ---------------- wall rings by era (masks first, drawn after the roads) ----------------
  // a wall ring is a polygon of straight runs (10-16 corners), not a circle; f(x, y) <= 1 inside
  const shape = (cx, cy, R, jit = .12) => { const n = ri(10, 16), A = [], Rr = [];
    for (let q = 0; q < n; q++) { A.push((q + (r() - .5) * .5) / n * 6.2832); Rr.push(R * (1 + (r() - .5) * 2 * jit)); }
    const V = A.map((a, q) => [Math.cos(a) * Rr[q], Math.sin(a) * Rr[q]]);
    const Rmax = Math.max(...Rr), Rin = Math.min(...Rr) * Math.cos(Math.PI * 1.5 / n) * .98;   // well outside / well inside need no corner search
    return (x, y) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy); if (d < 1e-6) return 0; if (d > Rmax + 1) return 2; if (d < Rin) return .5; let t = Math.atan2(dy, dx); if (t < 0) t += 6.2832;
      let q = n - 1; for (let j = 0; j < n; j++) { const a = (A[j] + 6.2832) % 6.2832, b = (A[(j + 1) % n] + 6.2832) % 6.2832; if (a <= b ? t >= a && t < b : t >= a || t < b) { q = j; break; } }
      const [ax, ay] = V[q], [bx, by] = V[(q + 1) % n], ux = dx / d, uy = dy / d, ex = bx - ax, ey = by - ay, den = ux * ey - uy * ex;
      const re = Math.abs(den) < 1e-9 ? R : (ax * ey - ay * ex) / den; return d / Math.max(re, 1); }; };
  const nR = hist.rings.length, rings = [];
  for (let q = 0; q < nR; q++) { const s = hist.rings[q].share, t = q === nR - 1 ? 1 : .35, cx = core[0] + (C[0] - core[0]) * t, cy = core[1] + (C[1] - core[1]) * t;
    // the outermost ring is centred on the city, inner rings on the core (the old town is off-centre in the city it grew into)
    rings.push({ ...hist.rings[q], R: R2 * Math.sqrt(s), cx, cy, f: shape(cx, cy, R2 * Math.sqrt(s)) }); }
  const land = (i) => !isWater(k[i]) && !(seaY > 0 && ((i / W) | 0) >= seaY - 4);
  const inR = rings.map(() => new Uint8Array(G.n));
  for (let q = 0; q < nR; q++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = I(x, y); if (rings[q].f(x, y) <= 1) inR[q][i] = 1; }
  // inner rings stay at least 10 cells inside the outer ring
  for (let q = nR - 2; q >= 0; q--) { const dOut = field(G, idx((i) => !inR[q + 1][i]), () => true, 12); for (let i = 0; i < G.n; i++) if (dOut[i] < 10) inR[q][i] = 0; }
  const IN = inR[nR - 1], IN1 = inR[0];
  for (let i = 0; i < G.n; i++) G.ring[i] = IN[i] ? (IN1[i] ? 2 : 1) : 0;
  const inBox = [W, H, 0, 0]; for (let i = 0; i < G.n; i++) if (IN[i]) { const x = i % W, y = (i / W) | 0; inBox[0] = Math.min(inBox[0], x); inBox[1] = Math.min(inBox[1], y); inBox[2] = Math.max(inBox[2], x); inBox[3] = Math.max(inBox[3], y); }

  // the old ring that became a canal is dug before the roads, so roads bridge it
  const edgeOf = (M, inside = true, NB = N4) => { const o = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = I(x, y); if (!M[i] !== !inside) continue; if (NB.some(([dx, dy]) => !M[I(x + dx, y + dy)] === inside)) o.push(i); } return o; };
  if (nR === 2 && rings[0].fate === 'canal') for (const i of edgeOf(IN1, false)) if (land(i)) { k[i] = K.STREAM; }

  P.t = P.t || {}; P.t['precincts'] = Math.round(performance.now() - T0);
  // ---------------- precincts: outlines reserved on open ground beside a way ----------------
  // the cathedral close and the castle come first (the gate roads go round them), the rest once the roads are in
  const dWay = () => field(G, idx((i) => isWay(k[i]) && k[i] !== K.SQUARE), () => true, 40);
  // is there a stretch of nd cells inside (a0 .. a0 + len - 1), off its edge, on one map and two cells clear of the map's edges?
  const fitAxis = (a0, len, M, nd) => { for (let m = Math.floor(a0 / M); m <= Math.floor((a0 + len - 1) / M); m++) { const lo = Math.max(a0 + 1, m * M + 2), hi = Math.min(a0 + len - 2, (m + 1) * M - 3); if (hi - lo + 1 >= nd) return true; } return false; };
  const placePrecs = (precs, early) => { const order = ['cathedral close', 'cathedral priory', 'castle', 'palace', 'great church', 'college', "merchants' house", 'friary', 'monastery', 'beguinage', 'hospital', 'leper house'];
    precs.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
    const dWallIn = field(G, idx((i) => !IN[i]), () => true, 60), dWallOut = field(G, idx((i) => IN[i]), () => true, 120);
    const dR1 = nR === 2 ? field(G, edgeOf(IN1), () => true, 40) : null;
    const dGate = field(G, P.gates.map((g) => I(g.cx | 0, g.cy | 0)), () => true, 60);
    const dWat = field(G, idx((i) => k[i] === K.QUAY || (isWater(k[i]) && k[i] !== K.DITCH)), () => true, 60);
    let hmin = 1e9, hmax = -1e9; for (const v of G.h) { if (v < hmin) hmin = v; if (v > hmax) hmax = v; }
    const dw = dWay(), free = new Uint8Array(G.n); for (let i = 0; i < G.n; i++) free[i] = k[i] === K.OUT && (seaY < 0 || ((i / W) | 0) < seaY - 4) ? 0 : 1;
    // keep 3 cells off other precincts and squares
    { const dP = field(G, idx((i) => G.prc[i] >= 0 || k[i] === K.SQUARE), () => true, 4); for (let i = 0; i < G.n; i++) if (dP[i] <= 3) free[i] = 1; }
    const nearW = new Uint8Array(G.n); for (let i = 0; i < G.n; i++) nearW[i] = dw[i] <= 2 ? 1 : 0; const acc = sat(G, nearW);
    for (const p of precs) {
      const blk = sat(G, free); let best = null;
      // where to look: inside zones within the walls' box, the rest over the whole grid
      const ex = p.zone === 'far' ? 1e4 : p.zone === 'gate' ? 40 : p.zone === 'belt' || p.zone === 'ring1' ? 32 : 2, bx = [inBox[0] - ex, inBox[1] - ex, inBox[2] + ex, inBox[3] + ex], stp = Math.max(p.w, p.h) > 30 && !p.core ? 3 : 2;
      for (const [w, h] of p.core ? [[p.w, p.h]] : [[p.w, p.h], [p.h, p.w]]) for (let y0 = Math.max(3, bx[1]); y0 < Math.min(H - h - 3, bx[3]); y0 += stp) for (let x0 = Math.max(3, bx[0]); x0 < Math.min(W - w - 3, bx[2]); x0 += stp) {
        if (blk(x0, y0, w, h)) continue;
        // a way within 2 cells of the outline
        if (!early && acc(x0, y0, w, h) === acc(x0 + 1, y0 + 1, w - 2, h - 2)) continue;
        const cx = x0 + (w >> 1), cy = y0 + (h >> 1), ci = I(cx, cy), inside = IN[I(x0, y0)] && IN[I(x0 + w - 1, y0 + h - 1)] && IN[I(x0 + w - 1, y0)] && IN[I(x0, y0 + h - 1)];
        let s = 0; const dc = Math.hypot(cx - core[0], cy - core[1]);
        switch (p.zone) {
          case 'core': s = inside ? (early ? -Math.abs(dc - Math.max(w, h) / 2 - 16) : -dc) : -1e4; break;
          case 'wall': s = inside ? -dWallIn[ci] * 2 + (G.h[ci] - hmin) / (hmax - hmin + 1e-6) * 25 - Math.min(dWat[ci], 60) * .3 : -1e4; break;
          case 'growth': s = inside && !(IN1[ci] && nR === 2) ? -Math.abs(dc - R2 * .6) : -1e4; break;
          case 'ring1': s = nR === 2 ? -(dR1[ci] || 0) * 2 - (inside ? 0 : 8) : -Math.abs(dWallIn[ci] - 14) - (inside ? 0 : 4); if (!inside && dWallOut[ci] > 25) s -= 1e3; break;
          case 'belt': s = inside ? -Math.abs(dWallIn[ci] - 18) : (dWallOut[ci] < 30 ? -10 - dWallOut[ci] : -1e4); break;
          case 'gate': s = -Math.min(dGate[ci], 60) * 2 + (inside ? 0 : 3); break;
          case 'far': s = !IN[ci] && dWallOut[ci] > 30 ? -Math.abs(dWallOut[ci] - 45) : -1e4; break;
          case 'water': s = inside ? -Math.min(dWat[ci], 60) * 3 - dc * .1 : -1e4; break;
        }
        // a precinct that fits one map stands on one map, two cells clear of its edges (its buildings never cross a seam)
        // a bigger one keeps room on one map, clear of the seams, for its great building (p.core: that building's box with its margins)
        if (w <= MW - 6 && h <= MH - 6 && !p.core) { if (Math.floor((x0 - 2) / MW) !== Math.floor((x0 + w + 1) / MW)) s -= 1500; if (Math.floor((y0 - 2) / MH) !== Math.floor((y0 + h + 1) / MH)) s -= 1500; }
        else if (p.core) { const [cw0, ch0] = w === p.w ? p.core : [p.core[1], p.core[0]]; if (!fitAxis(x0, w, MW, cw0)) s -= 1500; if (!fitAxis(y0, h, MH, ch0)) s -= 1500; }
        const rr = r() * .5; if (best && s + rr <= best.s) continue;   // the spacing terms below only lower it
        for (const o of P.precincts) { const dd = Math.hypot(cx - o.cx, cy - o.cy), want = o.type === p.type ? 70 : 30; if (dd < want) s -= (want - dd) * (o.type === p.type ? 3 : 1); }
        for (const m of P.markets) { const dd = Math.hypot(cx - m.cx, cy - m.cy); if (dd < 25 && p.zone !== 'core') s -= (25 - dd); }
        s += rr;
        if (!best || s > best.s) best = { s, x0, y0, w, h, inside };
      }
      if (!best || best.s < -5000) { note(`${p.type} unplaced (${best ? best.s | 0 : "no room"} ${p.w}x${p.h})`); continue; }
      const id = P.precincts.length; P.precincts.push({ id, type: p.type, zone: p.zone, x0: best.x0, y0: best.y0, w: best.w, h: best.h, cx: best.x0 + best.w / 2, cy: best.y0 + best.h / 2, inside: best.inside, n: p.n || 0, core: p.core || null });
      for (let y = best.y0; y < best.y0 + best.h; y++) for (let x = best.x0; x < best.x0 + best.w; x++) { const i = I(x, y); k[i] = K.APRON; G.prc[i] = id; }
      for (let y = best.y0 - 3; y < best.y0 + best.h + 3; y++) for (let x = best.x0 - 3; x < best.x0 + best.w + 3; x++) if (G.in(x, y)) free[I(x, y)] = 1;
    } };
  for (const p of precs) p.early = /cathedral|castle/.test(p.type);
  placePrecs(precs.filter((p) => p.early), true);

  P.t = P.t || {}; P.t['gate'] = Math.round(performance.now() - T0);
  // ---------------- gate roads: from the country to the core market, joining one another ----------------
  const way0 = new Uint8Array(G.n);
  const HW = 1.15;   // A* heuristic weight: a little over 1 finds near-best roads in a fraction of the search
  const astar = (s, goal, costOf) => {
    const N = G.n * 4; if (!astar.g || astar.g.length !== N) { astar.g = new Float64Array(N).fill(1e9); astar.from = new Int32Array(N).fill(-1); astar.touched = new Int32Array(1 << 16); }
    const g = astar.g, from = astar.from; let tn = 0; const touch = (st) => { if (tn === astar.touched.length) { const a = new Int32Array(tn * 2); a.set(astar.touched); astar.touched = a; } astar.touched[tn++] = st; };
    let hk = new Float64Array(1 << 16), hv = new Int32Array(1 << 16), hn = 0; const heap = { get length() { return hn; } };
    const push = (f, st) => { if (hn === hk.length) { const a = new Float64Array(hn * 2), b = new Int32Array(hn * 2); a.set(hk); b.set(hv); hk = a; hv = b; } let j = hn++; while (j) { const p = (j - 1) >> 1; if (hk[p] <= f) break; hk[j] = hk[p]; hv[j] = hv[p]; j = p; } hk[j] = f; hv[j] = st; };
    let pf0 = 0, ps0 = 0; const pop = () => { pf0 = hk[0]; ps0 = hv[0]; const lk = hk[--hn], lv = hv[hn]; let j = 0; for (;;) { const a = 2 * j + 1; if (a >= hn) break; const m = a + 1 < hn && hk[a + 1] < hk[a] ? a + 1 : a; if (hk[m] >= lk) break; hk[j] = hk[m]; hv[j] = hv[m]; j = m; } hk[j] = lk; hv[j] = lv; };
    const gx = goal % W, gy = (goal / W) | 0, hh = (i) => { const y = (i / W) | 0; return (Math.abs(i - y * W - gx) + Math.abs(y - gy)) * HW; };
    for (let d = 0; d < 4; d++) { g[s * 4 + d] = 0; touch(s * 4 + d); push(hh(s), s * 4 + d); }
    let end = -1; astar.exp = 0;
    while (hn) { astar.exp++; pop(); const f = pf0, st = ps0, i = st >> 2, d = st & 3; if (f - hh(i) > g[st] + 1e-6) continue; if (i === goal || way0[i] === 2) { end = st; break; }
      const y = (i / W) | 0, x = i - y * W;
      for (let nd = 0; nd < 4; nd++) { const nx = nd === 0 ? x + 1 : nd === 1 ? x - 1 : x, ny = nd === 2 ? y + 1 : nd === 3 ? y - 1 : y; if (nx < 1 || ny < 1 || nx >= W - 1 || ny >= H - 1) continue; const j = ny * W + nx, c = costOf(i, j); if (c >= 1e8) continue;
        const ng = g[st] + c + (nd !== d ? 11 : 0), ns = j * 4 + nd; if (ng < g[ns]) { if (g[ns] === 1e9) touch(ns); g[ns] = ng; from[ns] = st; push(ng + hh(j), ns); } } }
    const path = []; if (end >= 0) for (let st = end; st >= 0; st = from[st]) path.push(st >> 2);
    for (let q = 0; q < tn; q++) { g[astar.touched[q]] = 1e9; from[astar.touched[q]] = -1; }   // the buffers are kept for the next road
    return end < 0 ? null : path.reverse(); };
  // gate roads run fairly straight from the country to the core; they join one another only inside the town
  let line = null, lA = 0, lB = 0, lC = 0; const dev = (j) => { if (!line) return 0; const y = (j / W) | 0, x = j - y * W; return Math.abs(lA * x + lB * y + lC); };   // distance from the straight line, as a*x + b*y + c
  const roadCost = (i, j) => { const kk = k[j]; if (kk === K.SEA || G.prc[j] >= 0) return 1e9; let c = way0[j] && IN[j] ? .35 : 1;
    c += Math.min(dev(j), 40) * .12;
    if (kk === K.RIVER) c += 70; else if (kk === K.STREAM) c += 12;
    c += Math.abs(G.h[j] - G.h[i]) * 60;
    if (!way0[j] && near[j]) c += IN[j] ? 1.6 : 4;               // no road running beside another
    return c; };
  const near = new Uint8Array(G.n);
  // cells within 4 steps of a road (not on it): marked around each new road's cells only (4 steps = a diamond of radius 4)
  const markNear = (cells) => { for (const i of cells) { const x = i % W, y = (i / W) | 0; for (let dy = -4; dy <= 4; dy++) for (let dx = -4 + Math.abs(dy); dx <= 4 - Math.abs(dy); dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H) near[ny * W + nx] = 1; } } for (const i of cells) near[i] = 0; };
  const goal = I(core[0], core[1]); way0[goal] = 2;
  const angs = []; if (coast) { const st = (Math.PI - .5) / nG; for (let q = 0; q < nG; q++) angs.push(Math.PI + .25 + (q + .5) * st + (r() - .5) * st * .4); } // the sea is south: the roads come from the land side
  else { const a0 = r() * 6.28, st = 6.283 / nG; for (let q = 0; q < nG; q++) angs.push(a0 + q * st + (r() - .5) * st * .5); }
  if (pf.site === 'river') { // one road always comes over the bridge from the far bank
    const t = angs.reduce((b, a, q) => Math.abs(Math.sin(a) - 1) < Math.abs(Math.sin(angs[b]) - 1) ? q : b, 0); angs[t] = Math.PI / 2 + (r() - .5) * .3; }
  const edgePt = (a) => { let x = C[0], y = C[1]; const dx = Math.cos(a), dy = Math.sin(a); while (x > 2 && y > 2 && x < W - 3 && y < H - 3) { x += dx; y += dy; } return [Math.round(x), Math.round(y)]; };
  const roadW = (i) => IN[i] ? 3 : 2;
  for (const a of angs) {
    const [ex, ey] = edgePt(a); if (k[I(ex, ey)] === K.SEA || (seaY > 0 && ey > seaY - 6)) continue;
    line = [ex, ey, core[0], core[1], Math.hypot(core[0] - ex, core[1] - ey) || 1]; { const [ax, ay, bx, by, L] = line; lA = (by - ay) / L; lB = -(bx - ax) / L; lC = ((bx - ax) * ay - (by - ay) * ax) / L; }
    const path = astar(I(ex, ey), goal, roadCost); if (!path) { note(`road failed from ${ex},${ey} k${k[I(ex, ey)]} to ${core} k${k[goal]} exp ${astar.exp}`); continue; }
    P.roads.push({ a, path: path.length, exp: astar.exp });
    const laid = []; for (const i of path) { const x = i % W, y = (i / W) | 0, w = roadW(i); for (let dy = 0; dy < w; dy++) for (let dx = 0; dx < w; dx++) { const j = I(cl(x + dx, 0, W - 1), cl(y + dy, 0, H - 1)); if (G.lay(x + dx, y + dy, IN[i] ? K.MAIN : K.ROAD)) { if (!way0[j]) laid.push(j); way0[j] = way0[j] || 1; } } }
    markNear(laid); for (let i = 0; i < G.n; i++) if (way0[i] && near[i]) near[i] = 0;
  }
  for (let i = 0; i < G.n; i++) if (k[i] === K.BRIDGE) way0[i] = 1;

  P.t = P.t || {}; P.t['walls'] = Math.round(performance.now() - T0);
  // a precinct set down before the roads gets a street out to the nearest way
  const connect = (p) => { const per = []; for (let x = p.x0; x < p.x0 + p.w; x++) per.push([x, p.y0 - 1], [x, p.y0 + p.h]); for (let y = p.y0; y < p.y0 + p.h; y++) per.push([p.x0 - 1, y], [p.x0 + p.w, y]);
    const st = per.filter(([x, y]) => G.in(x, y)).map(([x, y]) => I(x, y)); if (st.some((i) => isWay(k[i]))) return;
    const prev = new Int32Array(G.n).fill(-2), q = []; for (const i of st) if (k[i] === K.OUT || k[i] === K.FIELD) { prev[i] = -1; q.push(i); }
    let h = 0, end = -1; while (h < q.length && end < 0) { const c = q[h++], x = c % W, y = (c / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (prev[j] !== -2) continue; if (isWay(k[j])) { prev[j] = c; end = j; break; } if (k[j] === K.OUT || k[j] === K.FIELD) { prev[j] = c; q.push(j); } } }
    if (end < 0) { note(`${p.type} cut off`); return; } for (let c = prev[end]; c >= 0; c = prev[c]) G.lay(c % W, (c / W) | 0, K.STREET); };
  for (const p of P.precincts) connect(p);

  // ---------------- walls, ditch, gates, towers; the old ring as street or canal ----------------
  const wallE = edgeOf(IN), wallSet = new Uint8Array(G.n);
  for (const i of wallE) { if (isWater(k[i])) continue; if (k[i] === K.MAIN || k[i] === K.ROAD || k[i] === K.BRIDGE) { k[i] = K.GATE; } else k[i] = K.WALL; wallSet[i] = 1; }
  { const dW = field(G, wallE.filter((i) => wallSet[i]), (kk, i) => !IN[i], 3);
    for (let i = 0; i < G.n; i++) if (!IN[i] && dW[i] >= 1 && dW[i] <= 2) { if (k[i] === K.OUT) k[i] = K.DITCH; else if (k[i] === K.MAIN || k[i] === K.ROAD) k[i] = K.BRIDGE; } }
  // gates: clusters of gate cells
  { const seen = new Uint8Array(G.n); for (let i = 0; i < G.n; i++) if (k[i] === K.GATE && !seen[i]) { const st = [i], cs = []; seen[i] = 1; while (st.length) { const c = st.pop(); cs.push(c); for (const [dx, dy] of N8) { const j = c + dx + dy * W; if (j >= 0 && j < G.n && k[j] === K.GATE && !seen[j]) { seen[j] = 1; st.push(j); } } }
      const gx = cs.reduce((a, c) => a + c % W, 0) / cs.length, gy = cs.reduce((a, c) => a + ((c / W) | 0), 0) / cs.length; P.gates.push({ cx: gx, cy: gy, n: cs.length }); } }
  { let t = 0; for (const i of wallE) if (wallSet[i] && k[i] === K.WALL && (t++ % 11 === 0)) P.towers.push([i % W, (i / W) | 0]); }
  if (nR === 2) { const e1 = edgeOf(IN1); for (const i of edgeOf(IN1, true, N8)) if (land(i) || k[i] === K.STREAM) { const x = i % W, y = (i / W) | 0; G.lay(x, y, K.STREET); }
    // old gates (bars) where the roads cross the old line
    for (const i of e1) if (k[i] === K.MAIN && N4.some(([dx, dy]) => !IN1[i + dx + dy * W])) { const x = i % W, y = (i / W) | 0; if (!P.bars.some(([bx, by]) => Math.abs(bx - x) + Math.abs(by - y) < 8)) P.bars.push([x, y]); } }

  P.t = P.t || {}; P.t['quays'] = Math.round(performance.now() - T0);
  // ---------------- quays along the water inside the walls ----------------
  // only the stretch by the bridge and the old core is quayed; the rest of the bank stays open for mills, dyers and tanners
  const quayR = R2 * (pf.site === 'coast' ? .55 : .38);
  if (pf.site !== 'plain') { for (let i = 0; i < G.n; i++) { if (k[i] !== K.OUT || !IN[i]) continue; const x = i % W, y = (i / W) | 0; if (Math.hypot(x - core[0], y - core[1]) > quayR) continue; if (N4.some(([dx, dy]) => { const kk = G.at(x + dx, y + dy); return kk === K.RIVER || kk === K.SEA; })) k[i] = K.QUAY; }
    for (let i = 0; i < G.n; i++) if (k[i] === K.OUT && IN[i]) { const x = i % W, y = (i / W) | 0; if (N4.some(([dx, dy]) => G.at(x + dx, y + dy) === K.QUAY && N4.some(([ex, ey]) => { const kk = G.at(x + dx + ex, y + dy + ey); return kk === K.RIVER || kk === K.SEA; }))) G.ins[i] = 1; }
    for (let i = 0; i < G.n; i++) if (G.ins[i]) { k[i] = K.QUAY; G.ins[i] = 0; } }

  P.t = P.t || {}; P.t['market'] = Math.round(performance.now() - T0);
  // ---------------- market places ----------------
  const MS = gm.markets(pf, r);
  const carve = (x0, y0, w, h) => { let n = 0; for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { if (!G.in(x, y)) continue; const i = I(x, y), kk = k[i]; if (isWater(kk) || kk === K.WALL || kk === K.GATE || kk === K.BRIDGE || kk === K.QUAY) continue; k[i] = K.SQUARE; n++; } return n; };
  { const sIN = sat(G, IN), dw = dWay(), dGate = field(G, P.gates.map((g) => I(g.cx | 0, g.cy | 0)), () => true), dWat = field(G, idx((i) => k[i] === K.QUAY || (isWater(k[i]) && k[i] !== K.DITCH)), () => true, 80);
    for (const m of MS) {
      const [w, h] = (gm.marketSize[m.type] || gm.marketSize.other)(pf.pop); let best = null;
      // summed-area tables: no water, wall, gate or square under it; a road through it; how much of it inside the walls
      const mB = new Uint8Array(G.n), mW = new Uint8Array(G.n); for (let i = 0; i < G.n; i++) { const kk = k[i]; mB[i] = isWater(kk) || kk === K.WALL || kk === K.GATE || kk === K.SQUARE || G.prc[i] >= 0 ? 1 : 0; mW[i] = kk === K.MAIN || kk === K.ROAD ? 1 : 0; }
      const sB = sat(G, mB), sW = sat(G, mW), all = w * h;
      for (let y0 = 4; y0 < H - h - 4; y0 += 2) for (let x0 = 4; x0 < W - w - 4; x0 += 2) {
        const cx = x0 + (w >> 1), cy = y0 + (h >> 1), ci = I(cx, cy);
        if (sB(x0, y0, w, h) || !sW(x0, y0, w, h)) continue; const inn = sIN(x0, y0, w, h);
        let s;
        if (m.type === 'main') s = -Math.hypot(cx - core[0], cy - core[1]) - (inn < all ? 1e3 : 0);
        else if (m.near === 'water') s = -dWat[ci] * 3 - (inn < all ? 1e3 : 0) - Math.hypot(cx - core[0], cy - core[1]) * .2;
        else if (m.outside) s = -Math.abs(dGate[ci] - 12) * 2 - (inn > 0 ? 1e3 : 0);
        else s = -(inn < all ? 1e3 : 0) - Math.abs(Math.hypot(cx - core[0], cy - core[1]) - R2 * .45);
        for (const o of P.markets) { const dd = Math.hypot(cx - o.cx, cy - o.cy); if (dd < 30) s -= (30 - dd) * 40; }
        // the market and the row of buildings round it stand on one map: no seam through it
        if (Math.floor((x0 - 4) / MW) !== Math.floor((x0 + w + 3) / MW) || Math.floor((y0 - 4) / MH) !== Math.floor((y0 + h + 3) / MH)) s -= m.type === 'main' ? 60 : 25;
        if (!best || s > best.s) best = { s, x0, y0 }; }
      if (!best || best.s < -900) { note(`market ${m.type} unplaced`); continue; }
      carve(best.x0, best.y0, w, h); P.markets.push({ type: m.type, x0: best.x0, y0: best.y0, w, h, cx: best.x0 + w / 2, cy: best.y0 + h / 2 });
    } }

  placePrecs(precs.filter((p) => !p.early), false);
  if (gm.fate) for (const p of P.precincts) p.fate = gm.fate(p, pf, rngOf((spec.seed | 0) * 6007 + p.x0 * 977 + p.y0 * 31 + 5));   // the year gate (the Dissolution)
  if (gm.people) { P.people = gm.people(pf, P.precincts, rngOf((spec.seed | 0) * 7919 + 101)); pf.households = P.people.households; }   // count again over the precincts that found room
  for (const p of P.precincts) connect(p);   // one a way only passes near (within two cells) gets its short street to the gate

  P.t = P.t || {}; P.t['plan'] = Math.round(performance.now() - T0);
  // ---------------- plan units ----------------
  const unit = G.unit;
  { const Rc = R2 * Math.sqrt(coreS) * 1.05, cf = shape(core[0], core[1], Rc, .2);
    for (let i = 0; i < G.n; i++) { const kk = k[i]; if (isWater(kk) || kk === K.WALL || kk === K.GATE) continue; if (G.prc[i] >= 0) { unit[i] = U.PRECINCT; continue; }
      if (!IN[i]) { unit[i] = U.COUNTRY; continue; } const x = i % W, y = (i / W) | 0; unit[i] = cf(x, y) <= 1 && IN1[i] ? U.CORE : U.GROWTH; }
    // the planned extension: a block of the growth ground next to the core, away from the water, of its share
    if (hist.planned) { const want = Math.round(Ain * planS), ok = (i) => unit[i] === U.GROWTH && (nR === 1 || IN1[i]) && k[i] === K.OUT;
      // the side of the core with the most room (never across the water): a wedge of the growth ground hugging the core
      let bestA = 0, bestN = -1; for (let t = 0; t < 8; t++) { const a = t * Math.PI / 4; let n = 0; for (let i = 0; i < G.n; i += 3) if (ok(i)) { const x = i % W, y = (i / W) | 0, da = Math.abs(((Math.atan2(y - core[1], x - core[0]) - a + 9.42) % 6.283) - 3.14); if (da < .8) n++; } if (n > bestN) { bestN = n; bestA = a; } }
      const cand = []; for (let i = 0; i < G.n; i++) if (ok(i)) { const x = i % W, y = (i / W) | 0, da = Math.abs(((Math.atan2(y - core[1], x - core[0]) - bestA + 9.42) % 6.283) - 3.14); if (da < 1.05) cand.push([Math.hypot(x - core[0], y - core[1]) * (1 + da * .6), i]); }
      cand.sort((a, b) => a[0] - b[0]); let n = 0; P.planned = null; let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
      for (const [, i] of cand) { if (n >= want) break; unit[i] = U.PLANNED; n++; const x = i % W, y = (i / W) | 0; bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y); }
      P.planned = { x0: bx0, y0: by0, x1: bx1, y1: by1, cells: n };
      // its grid of streets
      const sx = 15, sy = 12; for (let i = 0; i < G.n; i++) if (unit[i] === U.PLANNED) { const x = i % W, y = (i / W) | 0; if ((x - bx0) % sx === 0 || (y - by0) % sy === 0) { if (G.lay(x, y, K.STREET)) G.lay(x + ((x - bx0) % sx === 0 ? 1 : 0), y + ((y - by0) % sy === 0 ? 1 : 0), K.STREET); } } }
    // the open belt inside the outer wall: the cells nearest the wall and away from the gate roads, up to the open-ground share
    { const dWallIn = field(G, idx((i) => !IN[i]), () => true, 200), dMain = field(G, idx((i) => k[i] === K.MAIN || k[i] === K.SQUARE), () => true, 30);
      const inside = idx((i) => IN[i] && unit[i] !== U.NONE).length, openNow = idx((i) => IN[i] && unit[i] === U.PRECINCT).length * .45;
      const want = Math.max(0, Math.round(inside * openIn * .65 - openNow)); const cand = [];
      for (let i = 0; i < G.n; i++) if (unit[i] === U.GROWTH && k[i] === K.OUT && dMain[i] > 8) cand.push([dWallIn[i] + (pf.region === 'en' ? 0 : 0), i]);
      cand.sort((a, b) => a[0] - b[0]); let n = 0; for (const [, i] of cand) { if (n >= want) break; unit[i] = U.BELT; n++; } P.belt = n; }
    // suburbs: ribbons along the roads outside the gates, as long as the households outside need
    { const gateCells = idx((i) => k[i] === K.GATE), along = field(G, gateCells, (kk, i) => (kk === K.ROAD || kk === K.BRIDGE || kk === K.MAIN || kk === K.SQUARE) && !IN[i], 600);
      const roadCells = idx((i) => !IN[i] && (k[i] === K.ROAD || k[i] === K.BRIDGE || k[i] === K.SQUARE) && along[i] < 600);
      const want = hhOut * D.suburb; let lo = 5, hi = 400, best = null;
      const near = (L) => field(G, roadCells.filter((i) => along[i] <= L), (kk, i) => !IN[i] && !isWater(kk) && kk !== K.DITCH && kk !== K.WALL, ribbon);
      for (let it = 0; it < 10; it++) { const L = (lo + hi) >> 1, d = near(L); let n = 0; for (let i = 0; i < G.n; i++) if (d[i] <= ribbon && unit[i] === U.COUNTRY && k[i] === K.OUT) n++; if (n < want) lo = L + 1; else { hi = L; best = d; } }
      const d = best || near(hi); let n = 0; for (let i = 0; i < G.n; i++) if (d[i] <= ribbon && unit[i] === U.COUNTRY && k[i] === K.OUT) { unit[i] = U.SUBURB; n++; } P.Ls = hi; P.suburbCells = n; }
    // absorbed villages: a church green inside the growth ground or among the suburbs
    for (let v = 0; v < hist.villages; v++) { let best = null;
      for (let t = 0; t < 400; t++) { const x = ri(10, W - 11), y = ri(10, H - 11), i = I(x, y); if (!(unit[i] === U.GROWTH || unit[i] === U.SUBURB) || k[i] !== K.OUT) continue; let s = -Math.abs(Math.hypot(x - core[0], y - core[1]) - R2 * .8); for (const o of P.villages) s -= Math.max(0, 60 - Math.hypot(x - o[0], y - o[1])) * 2; if (!best || s > best.s) best = { s, x, y }; }
      if (!best) continue; P.villages.push([best.x, best.y]);
      for (let y = best.y - 8; y <= best.y + 8; y++) for (let x = best.x - 9; x <= best.x + 9; x++) { if (!G.in(x, y)) continue; const i = I(x, y); if ((unit[i] === U.GROWTH || unit[i] === U.SUBURB || unit[i] === U.BELT) && Math.hypot((x - best.x) / 9, (y - best.y) / 8) <= 1) unit[i] = U.VILLAGE; }
      for (let y = best.y - 2; y <= best.y + 2; y++) for (let x = best.x - 4; x <= best.x + 4; x++) if (G.in(x, y) && k[I(x, y)] === K.OUT) k[I(x, y)] = K.GREEN; }
    for (let i = 0; i < G.n; i++) if (unit[i] === U.COUNTRY && k[i] === K.OUT) k[i] = K.FIELD;
  }

  P.t = P.t || {}; P.t['wards'] = Math.round(performance.now() - T0);
  // ---------------- wards: about wardCells each, bounded by streets where they can be ----------------
  { const town = (i) => unit[i] !== U.NONE && unit[i] !== U.COUNTRY;
    const cells = idx(town), nW = Math.max(1, Math.ceil(cells.length / gm.wardCells));
    // seeds: farthest-point sampling over town cells, starting at the core
    const seeds = [goal]; let dmin = field(G, seeds, (kk, i) => town(i) || isWay(kk));
    while (seeds.length < nW) { let bi = -1, bd = -1; for (const i of cells) if (dmin[i] < 32767 && dmin[i] > bd) { bd = dmin[i]; bi = i; } if (bi < 0) break; seeds.push(bi);
      // the new seed's distances, spread only where they beat what the earlier seeds gave (same result as a full field + min)
      const q = [bi]; dmin[bi] = 0; for (let h = 0; h < q.length; h++) { const c = q[h], cy = (c / W) | 0, cx = c - cy * W, nd = dmin[c] + 1;
        for (let e = 0; e < 4; e++) { let j; if (e === 0) { if (cx + 1 >= W) continue; j = c + 1; } else if (e === 1) { if (cx < 1) continue; j = c - 1; } else if (e === 2) { if (cy + 1 >= H) continue; j = c + W; } else { if (cy < 1) continue; j = c - W; }
          if (dmin[j] <= nd || !(town(j) || isWay(k[j]))) continue; dmin[j] = nd; q.push(j); } } }
    // grow: cheap over plots, dear across ways and water (so boundaries follow streets), capped in size
    const ward = G.ward, cnt = new Int32Array(seeds.length), cap = cells.length / seeds.length * 1.3, dist = new Float64Array(G.n).fill(1e9), heap = {};
    // a binary heap in typed arrays (the same sift rules as before, so the same order on ties)
    let hd = new Float64Array(1 << 16), hi = new Int32Array(1 << 16), hw = new Int32Array(1 << 16), hn = 0; Object.defineProperty(heap, 'length', { get: () => hn });
    const swap = (a, b) => { let t = hd[a]; hd[a] = hd[b]; hd[b] = t; t = hi[a]; hi[a] = hi[b]; hi[b] = t; t = hw[a]; hw[a] = hw[b]; hw[b] = t; };
    const push = (d, i, w) => { if (hn === hd.length) { const a = new Float64Array(hn * 2), b = new Int32Array(hn * 2), c = new Int32Array(hn * 2); a.set(hd); b.set(hi); c.set(hw); hd = a; hi = b; hw = c; }
      hd[hn] = d; hi[hn] = i; hw[hn] = w; let j = hn++; while (j) { const p = (j - 1) >> 1; if (hd[p] <= hd[j]) break; swap(p, j); j = p; } };
    const top = [0, 0, 0];
    const pop = () => { top[0] = hd[0]; top[1] = hi[0]; top[2] = hw[0]; hn--; if (hn) { hd[0] = hd[hn]; hi[0] = hi[hn]; hw[0] = hw[hn]; let j = 0; for (;;) { const a = 2 * j + 1, b = a + 1; let m = j; if (a < hn && hd[a] < hd[m]) m = a; if (b < hn && hd[b] < hd[m]) m = b; if (m === j) break; swap(m, j); j = m; } } return top; };
    seeds.forEach((s, w) => { dist[s] = 0; push(0, s, w); });
    const stepCost = (i) => { const kk = k[i]; if (kk === K.MAIN || kk === K.ROAD || kk === K.SQUARE || kk === K.BRIDGE) return 25; if (kk === K.STREET) return 12; if (isWater(kk) || kk === K.WALL || kk === K.GATE) return 60; if (G.prc[i] >= 0) return .6; return 1; };
    while (heap.length) { const [d, i, w] = pop(); if (ward[i] >= 0 || d > dist[i] + 1e-6) continue; if (town(i) && cnt[w] >= cap) continue; ward[i] = w; if (town(i)) cnt[w]++;
      const x = i % W, y = (i / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (ward[j] >= 0 || !(town(j) || isWay(k[j]) || k[j] === K.GATE || k[j] === K.WALL || isWater(k[j]) && IN[j])) continue;
        // a precinct is never split between wards
        const nd = d + stepCost(j) + (G.prc[j] >= 0 && G.prc[i] !== G.prc[j] ? 0 : 0); if (nd < dist[j]) { dist[j] = nd; push(nd, j, w); } } }
    // leftovers (wards that hit their cap): join the nearest ward
    { const left = cells.filter((i) => ward[i] < 0); if (left.length) { const st = cells.filter((i) => ward[i] >= 0); const own = new Int16Array(G.n).fill(-1), q = [...st]; for (const i of st) own[i] = ward[i]; let h = 0; while (h < q.length) { const c = q[h++], x = c % W, y = (c / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (own[j] >= 0) continue; own[j] = own[c]; q.push(j); } } for (const i of left) ward[i] = own[i]; } }
    // a precinct goes whole to the ward holding most of it
    for (const p of P.precincts) { const c = new Map(); for (let y = p.y0; y < p.y0 + p.h; y++) for (let x = p.x0; x < p.x0 + p.w; x++) { const w = ward[I(x, y)]; c.set(w, (c.get(w) || 0) + 1); } const w = [...c].sort((a, b) => b[1] - a[1])[0][0]; p.ward = w; for (let y = p.y0; y < p.y0 + p.h; y++) for (let x = p.x0; x < p.x0 + p.w; x++) ward[I(x, y)] = w; }
    // clean-up: a ward is one piece (pieces cut off go to the neighbour they touch most) and no ward is tiny
    const tgt = cells.length / seeds.length, belongs = (i) => ward[i] >= 0 && unit[i] !== U.COUNTRY;
    const wsize = new Map(); for (const i of cells) if (ward[i] >= 0) wsize.set(ward[i], (wsize.get(ward[i]) || 0) + 1);
    // the neighbour a piece joins: wards it touches (also across a wall, ditch or water up to 4 cells), the smallest of those it touches well
    const neighbourOf = (set) => { const c = new Map(), own = ward[set[0]], seen = new Map(), q = []; for (const i of set) { seen.set(i, 0); q.push(i); }
      for (let h = 0; h < q.length; h++) { const i = q[h], d = seen.get(i), x = i % W, y = (i / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (seen.has(j)) continue; seen.set(j, d + 1);
        if (belongs(j) && ward[j] !== own) c.set(ward[j], (c.get(ward[j]) || 0) + 1); else if (!belongs(j) && unit[j] === U.NONE && d < 4) q.push(j); } }
      let mx = 0; for (const n of c.values()) mx = Math.max(mx, n); let b = -1, bs = 1e9; for (const [w, n] of c) if (n >= mx * .2 && (wsize.get(w) || 0) < bs) { bs = wsize.get(w) || 0; b = w; } return b; };
    for (let pass = 0; pass < 2; pass++) {
      const comp = new Int32Array(G.n).fill(-1), comps = []; for (let i = 0; i < G.n; i++) { if (!belongs(i) || comp[i] >= 0) continue; const w = ward[i], id = comps.length, st = [i], set = []; comp[i] = id;
        while (st.length) { const c = st.pop(); set.push(c); const x = c % W, y = (c / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (comp[j] < 0 && belongs(j) && ward[j] === w) { comp[j] = id; st.push(j); } } }
        comps.push({ w, set }); }
      const big = new Map(); for (const c of comps) if (!big.has(c.w) || big.get(c.w).set.length < c.set.length) big.set(c.w, c);
      const size = new Map(); for (const c of comps) size.set(c.w, (size.get(c.w) || 0) + c.set.length);
      for (const c of comps) { if (big.get(c.w) === c && size.get(c.w) >= tgt * .35) continue; const nb = neighbourOf(c.set); if (nb >= 0) { for (const i of c.set) ward[i] = nb; wsize.set(nb, (wsize.get(nb) || 0) + c.set.length); wsize.set(c.w, (wsize.get(c.w) || 0) - c.set.length); } }
    }
    // a ward whose suburb outside the gate is large gets that suburb as a ward of its own ("... Without")
    const without = new Map(); { let next = 0; for (const i of cells) if (ward[i] >= next) next = ward[i] + 1; const seen = new Uint8Array(G.n);
      for (const i0 of cells) { if (seen[i0] || IN[i0] || ward[i0] < 0) continue; const w = ward[i0], st = [i0], set = []; seen[i0] = 1;
        const via = new Set(); while (st.length) { const c = st.pop(); if (belongs(c) && ward[c] === w) set.push(c); const x = c % W, y = (c / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (IN[j]) continue;
          if (!seen[j] && ward[j] === w && belongs(j)) { seen[j] = 1; st.push(j); } else if (isWay(k[j]) && !via.has(j)) { via.add(j); st.push(j); } } }
        if (set.length >= tgt * .45 && (wsize.get(w) || 0) - set.length >= tgt * .35) { for (const c of set) ward[c] = next; without.set(next, w); wsize.set(w, wsize.get(w) - set.length); next++; } } }
    { const used = [...new Set([...cells].map((i) => ward[i]).filter((w) => w >= 0))].sort((a, b) => a - b), re = new Map(used.map((w, n) => [w, n]));
      for (let i = 0; i < G.n; i++) if (ward[i] >= 0) ward[i] = re.has(ward[i]) ? re.get(ward[i]) : -1; seeds.length = 0; for (const w of used) seeds.push(0);
      for (const p of P.precincts) { const wc = ward[I(Math.round(p.x0 + p.w / 2), Math.round(p.y0 + p.h / 2))]; p.ward = re.has(p.ward) ? re.get(p.ward) : wc >= 0 ? wc : -1; } P.without = new Map([...without].filter(([a, b]) => re.has(a) && re.has(b)).map(([a, b]) => [re.get(a), re.get(b)])); }
    // a precinct stays whole in one ward (the clean-up above may have moved part of it): the ward most of its cells ended in
    for (const p of P.precincts) { const c = new Map(); for (let y = p.y0; y < p.y0 + p.h; y++) for (let x = p.x0; x < p.x0 + p.w; x++) { const w = ward[I(x, y)]; if (w >= 0) c.set(w, (c.get(w) || 0) + 1); }
      if (!c.size) continue; const w = [...c].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]; p.ward = w; for (let y = p.y0; y < p.y0 + p.h; y++) for (let x = p.x0; x < p.x0 + p.w; x++) if (ward[I(x, y)] >= 0) ward[I(x, y)] = w; }
    // each market place and the frontages round it belong to one ward (the main market's widest): the guildhall, cross and shambles stand together
    for (const m of [...P.markets].reverse()) { const bd = m === P.markets[0] ? 9 : 5; { const mw = ward[I(Math.round(m.cx), Math.round(m.cy))]; if (mw >= 0) for (let y = m.y0 - bd; y < m.y0 + m.h + bd; y++) for (let x = m.x0 - bd; x < m.x0 + m.w + bd; x++) { if (!G.in(x, y)) continue; const i = I(x, y); if ((ward[i] >= 0 && town(i) && G.prc[i] < 0 && IN[i] === IN[I(Math.round(m.cx), Math.round(m.cy))]) || (k[i] === K.SQUARE && x >= m.x0 && x < m.x0 + m.w && y >= m.y0 && y < m.y0 + m.h)) ward[i] = mw; } } }   // the square itself always (its cross or market house stands on it)
    // ward boundaries that do not follow a way become streets
    let laid = 0; if (gm.wardStreets) for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = I(x, y); if (!town(i) || k[i] !== K.OUT && k[i] !== K.FIELD) continue; if (G.prc[i] >= 0) continue;
      if ([[1, 0], [0, 1]].some(([dx, dy]) => { const j = I(x + dx, y + dy); return town(j) && ward[j] >= 0 && ward[j] !== ward[i] && !isWay(k[j]); })) { if (G.lay(x, y, K.STREET)) laid++; } }
    P.wardStreet = laid;
    // ward records: ground by plan unit, households it can hold
    const names = gm.saints || ['St Mary', 'St Peter', 'St Andrew', 'St Michael', 'St John', 'St Martin', 'St Giles', 'St Nicholas', 'St Margaret', 'St Laurence', 'St Botolph', 'St Clement', 'St Stephen', 'St Helen', 'St Gregory', 'St Edmund', 'St Swithin', 'All Saints', 'Holy Trinity', 'St Saviour', 'St Lambert', 'St Bavo', 'St Jacob', 'St Walburga', 'St Gertrude', 'St Denis', 'St Pancras', 'St Olave', 'St Benet', 'St Faith'];
    const wr = seeds.map((s, w) => ({ id: w, name: names[w % names.length] + (w >= names.length ? ' ' + (1 + Math.floor(w / names.length)) : ''), cells: 0, units: {}, cap: 0, seed: [s % W, (s / W) | 0], maps: new Set(), x0: 1e9, y0: 1e9, x1: -1, y1: -1, precincts: [] }));
    for (let i = 0; i < G.n; i++) { const w = ward[i]; if (w < 0 || !town(i)) continue; const o = wr[w], u = unit[i], x = i % W, y = (i / W) | 0; o.cells++; o.units[UN[u]] = (o.units[UN[u]] || 0) + 1; o.maps.add(Math.floor(x / MW) + ',' + Math.floor(y / MH)); o.x0 = Math.min(o.x0, x); o.y0 = Math.min(o.y0, y); o.x1 = Math.max(o.x1, x); o.y1 = Math.max(o.y1, y);
      const den = u === U.CORE ? D.core : u === U.PLANNED ? D.planned : u === U.GROWTH ? D.growth : u === U.SUBURB ? D.suburb : u === U.VILLAGE ? D.village : 0;
      if (den && (k[i] === K.OUT || k[i] === K.FIELD || k[i] === K.STREET || k[i] === K.GREEN)) o.cap += 1 / den; }
    for (const [a, b] of P.without) wr[a].name = wr[b].name + ' Without';
    for (const p of P.precincts) if (p.ward >= 0) wr[p.ward].precincts.push(p.id);
    // households: in-wall and outside shares spread by what each ward can hold
    const capIn = wr.reduce((a, o) => a + o.cap * (1 - ((o.units.suburb || 0) + (o.units.village || 0) * 0) / Math.max(1, o.cells)), 0), capAll = wr.reduce((a, o) => a + o.cap, 0);
    for (const o of wr) { o.hh = Math.round(o.cap / capAll * pf.households); o.maps = [...o.maps]; }
    P.wards = wr; P.capacity = Math.round(capAll);
  }

  P.t = P.t || {}; P.t['checks'] = Math.round(performance.now() - T0);
  // every piece of a ward's ground reaches a way inside the ward: a piece the roads left shut in (between wall and river, say) gets a street,
  // with a bridge if it must, by the shortest way out to the nearest way
  { const town = (i) => unit[i] !== U.NONE && unit[i] !== U.COUNTRY && unit[i] !== U.PRECINCT && unit[i] !== U.BELT, land = (i) => town(i) && (k[i] === K.OUT || k[i] === K.GREEN);   // the belt is not built on: ground behind it needs its own street
    const pc = new Int32Array(G.n).fill(-1); let np = 0; P.access = [];
    for (let i0 = 0; i0 < G.n; i0++) { if (pc[i0] >= 0 || !land(i0)) continue; const q = [i0]; pc[i0] = np; let touch = false;
      for (let h = 0; h < q.length; h++) { const c = q[h], x = c % W, y = (c / W) | 0; for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny); if (isWay(k[j])) touch = true; else if (pc[j] < 0 && land(j) && G.ward[j] === G.ward[c]) { pc[j] = np; q.push(j); } } }
      np++; if (touch || q.length < 120) continue;
      // cheapest way out: open ground 1, water 9 (a bridge), never through a wall, gate, precinct or the sea
      const dist = new Int32Array(G.n).fill(1 << 30), prev = new Int32Array(G.n).fill(-1), B = []; const put = (d, i) => { (B[d] || (B[d] = [])).push(i); };
      for (const i of q) { dist[i] = 0; put(0, i); } let end = -1;
      for (let d = 0; d < B.length && end < 0; d++) { const L = B[d]; if (!L) continue; for (let h = 0; h < L.length && end < 0; h++) { const c = L[h]; if (dist[c] !== d) continue; const x = c % W, y = (c / W) | 0;
        for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!G.in(nx, ny)) continue; const j = I(nx, ny), kk = k[j]; if (isWay(kk) && kk !== K.BRIDGE || kk === K.BRIDGE) { prev[j] = c; end = j; break; }
          if (kk === K.SEA || kk === K.WALL || kk === K.GATE || kk === K.DITCH || G.prc[j] >= 0 || kk >= 30) continue; const nd = d + (isWater(kk) ? 9 : 1); if (nd < dist[j]) { dist[j] = nd; prev[j] = c; put(nd, j); } } } }
      if (end < 0) { note(`ground shut in (${q.length} cells)`); continue; }
      let n = 0; for (let c = prev[end]; c >= 0 && dist[c] > 0; c = prev[c]) { G.lay(c % W, (c / W) | 0, K.STREET); n++; }
      // into the piece too, a few cells, so its frontages have a street to stand on
      { let c = prev[end], b = -1; while (c >= 0 && dist[c] > 0) { b = c; c = prev[c]; } if (c < 0) c = b; if (c < 0) continue;
        const sx = (c % W) - (b >= 0 ? b % W : end % W), sy = ((c / W) | 0) - (b >= 0 ? (b / W) | 0 : (end / W) | 0); let x = c % W, y = (c / W) | 0, s = 0;
        while (G.in(x, y) && land(I(x, y)) && s < 400) { G.lay(x, y, K.STREET); if (sx === 0) G.lay(x + 1, y, K.STREET); else G.lay(x, y + 1, K.STREET); x += sx; y += sy; s++; }
        P.access.push({ cells: q.length, len: n, spine: s, at: [c % W, (c / W) | 0] }); } } }

  // ---------------- checks ----------------
  { const mk = P.markets[0]; if (mk) { const s = I(Math.round(mk.cx), Math.round(mk.cy)), d = field(G, [s], (kk) => isWay(kk) || kk === K.GATE || kk === K.APRON); P.gatesReached = P.gates.filter((g) => d[I(Math.round(g.cx), Math.round(g.cy))] < 32767).length; } }
  { let inside = 0, open = 0; for (let i = 0; i < G.n; i++) if (IN[i] && unit[i] !== U.NONE) { inside++; if (unit[i] === U.BELT || k[i] === K.GREEN || k[i] === K.SQUARE) open++; else if (unit[i] === U.PRECINCT) open += .45; } P.openShare = open / inside; P.insideCells = inside; }
  P.maps = [W / MW, H / MH];
  { const m = new Map(); for (let i = 0; i < G.n; i++) if (unit[i] !== U.NONE && unit[i] !== U.COUNTRY) { const key = Math.floor((i % W) / MW) + ',' + Math.floor(((i / W) | 0) / MH); m.set(key, (m.get(key) || 0) + 1); } P.townMaps = [...m.values()].filter((v) => v >= MW * MH * .15).length; }
  P.ms = Math.round(performance.now() - T0);
  return P;
}
