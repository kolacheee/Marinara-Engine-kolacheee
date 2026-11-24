// @ts-nocheck
// towngen: a town plan from what the world knows about the place. Why it grew (basis: market, road, bridge, port,
// fishing, mining), how big it got (rank 0 village .. 3 city) and whether it grew or was laid out at once (planted).
// The result is a grid of ground kinds plus the landmarks the 3D builder stands up: square, church, guildhall,
// walls, gates, towers and the trade's own works (piers, boats, cranes, headframes, smelters, mills).
export const MW = 52, MH = 48;
export const rngOf = (seed) => { let a = seed * 2654435761 >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
export const WATERK = new Set(['ditch', 'river', 'sea', 'stream']);
export const WALKK = new Set(['main', 'street', 'alley', 'lane', 'square', 'yard', 'yardC', 'road', 'bridge', 'out', 'quay', 'pier', 'beach', 'field']);
export const FRONT = { main: 4, square: 4, quay: 4, street: 3, road: 2, alley: 1, lane: 1 };
export const BASES = { market: 'Market town', road: 'Road town', bridge: 'Bridge town', port: 'Port', fishing: 'Fishing village', mining: 'Mining town' };
export const RANKS = ['Village', 'Town', 'Walled town', 'City'];
const SRANK = { square: 9, quay: 8, pier: 8, bridge: 8, main: 7, road: 6, street: 5, alley: 3, lane: 2 };
const PROT = new Set(['church', 'yardC', 'guild', 'works', 'spoil', 'wall']);
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

export function plan(spec) {
  const B = spec.brief || null;   // a map inside a generated city: built from the city plan's brief for this square
  const basis = B ? 'market' : BASES[spec.basis] ? spec.basis : 'market', planted = !!spec.planted, seed = B ? (B.spec.seed * 7919 + B.cell) | 0 : spec.seed | 0;
  const rank = B ? 3 : Math.max(0, Math.min(basis === 'fishing' ? 1 : 3, spec.rank | 0));
  const r = rngOf(seed * 1009 + Object.keys(BASES).indexOf(basis) * 131 + rank * 17 + (planted ? 7 : 0) + 1);
  const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = (a) => a[Math.floor(r() * a.length)];
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const g = new Array(MW * MH).fill('out'), I = (x, y) => y * MW + x, inG = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH;
  const at = (x, y) => g[I(cl(x, 0, MW - 1), cl(y, 0, MH - 1))];     // off the map the edge carries on: roads, sea and fields run out of view
  const set = (x, y, k) => { if (inG(x, y)) g[I(x, y)] = k; };
  const rect = (x0, y0, x1, y1, k) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, k); };
  // a street cell: a main road crossing water becomes a bridge; never over a landmark or a better street
  const lay = (x, y, k) => { if (!inG(x, y)) return; const c = g[I(x, y)];
    if (WATERK.has(c)) { if (k === 'main' || k === 'road' || ((c === 'stream' || c === 'ditch') && k !== 'alley')) g[I(x, y)] = 'bridge'; return; }
    if (PROT.has(c) || (SRANK[c] || 0) >= SRANK[k]) return; g[I(x, y)] = k; };
  const hs = (x0, x1, y, w, k) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let j = 0; j < w; j++) lay(x, y + j, k); };
  const vs = (x, y0, y1, w, k) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let j = 0; j < w; j++) lay(x + j, y, k); };
  // a north-south spine from yS up to yN; a grown town's road wanders a cell or two at a few rows (never near a gate)
  const spine = (x, yS, yN, w, k, jogRows = []) => { let cx = x; const xs = {};
    for (let y = yS; y >= yN; y--) { if (jogRows.includes(y)) { const nx = cl(cx + pick([-2, -1, 1, 2]), 3, MW - 4 - w); hs(Math.min(cx, nx), Math.max(cx, nx) + w - 1, y, 1, k); cx = nx; } vs(cx, y, y, w, k); xs[y] = cx; } return xs; };
  const P = { g, at, I, r, ri, pick, seed, basis, rank, planted, sq: null, ch: null, gh: null, gates: [], towers: [], feats: [], walls: null, start: null, fountain: null, names: {} };

  // the town's footprint by size; walls for walled towns and cities (never for a fishing village)
  const RB = B ? [0, 0, MW - 1, MH - 1] : basis === 'fishing' ? [[12, 20, 40, 34], [6, 12, 46, 34]][rank] : [[13, 12, 38, 37], [7, 8, 44, 40], [4, 4, 47, basis === 'mining' ? 42 : 39], [1, 1, 50, basis === 'mining' ? 42 : 38]][rank]; const R = { x0: RB[0], y0: RB[1], x1: RB[2], y1: RB[3] };
  const walled = !B && rank >= 2 && basis !== 'fishing';
  const top0 = walled ? R.y0 + 2 : R.y0;                           // first row a landmark may use
  const jogs = (a, b, n = planted ? 0 : ri(1, 2)) => { const out = []; for (let i = 0; i < n && b - a > 6; i++) out.push(ri(a + 2, b - 2)); return out; };

  const placeChurch = (x0, y0) => {   // churchyard 10 x 11, nave and chancel, tower and porch facing south onto row y0 + 11
    x0 = cl(x0, 1, MW - 11); y0 = Math.max(1, y0);
    rect(x0, y0, x0 + 9, y0 + 10, 'yardC'); const ch = { x: x0 + 2, y: y0, w: 6, d: 7, yx0: x0, yx1: x0 + 9 }; ch.cx = ch.x + 3;
    rect(ch.x, ch.y + 1, ch.x + 5, ch.y + 7, 'church'); rect(ch.x, ch.y + 8, ch.x + 2, ch.y + 10, 'church');
    for (let x = x0; x <= x0 + 9; x++) if (!WALKK.has(at(x, y0 + 11)) || at(x, y0 + 11) === 'out') set(x, y0 + 11, 'street');
    P.ch = ch; };
  const placeGuild = (x0, y0) => { rect(x0, y0, x0 + 6, y0 + 5, 'guild'); P.gh = { x: x0, y: y0, w: 7, d: 5 };
    for (let x = x0 - 1; x <= x0 + 7; x++) if (!WALKK.has(at(x, y0 + 6)) || at(x, y0 + 6) === 'out') set(x, y0 + 6, 'square'); };
  // a square; a grown town's square has lost a corner or two to encroaching houses (south corners only: the north side is the church's)
  const square = (x0, y0, x1, y1, shape) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inG(x, y) && !PROT.has(at(x, y)) && !WATERK.has(at(x, y)) && (!shape || shape(x, y))) set(x, y, 'square');
    if (!planted && !shape) for (const c of [0, 1]) if (r() < .6) { const nx = ri(2, 3), ny = ri(2, 3); for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const x = c ? x1 - i : x0 + i, y = y1 - j; if (at(x, y) === 'square') set(x, y, 'out'); } }
    P.sq = { x0, y0, x1, y1 }; };
  // the north side of a square: church in its yard at one end, the road north beside it, the guildhall beyond (or standing in the square)
  const northFront = (guild) => {
    const s = P.sq, west = r() < .6, cx0 = west ? s.x0 + ri(0, 1) : s.x1 - 9 - ri(0, 1);
    placeChurch(cx0, s.y0 - 11);
    const nx = west ? P.ch.yx1 + 1 + ri(0, 1) : P.ch.yx0 - 3 - ri(0, 1);
    vs(nx, 0, s.y0 - 1, 3, 'main');
    if (guild === 'edge') { const gx0 = west ? nx + 4 : nx - 8; if (gx0 >= s.x0 && gx0 + 6 <= s.x1) placeGuild(gx0, s.y0 - 6); else guild = 'in'; }
    if (guild === 'in' && s.y1 - s.y0 + 1 >= 9) { const gx0 = west ? Math.max(nx + 4, s.x1 - 8 - ri(0, 1)) : Math.min(nx - 8, s.x0 + 2 + ri(0, 1)); if (gx0 >= s.x0 + 1 && gx0 + 6 <= s.x1 - 1) placeGuild(gx0, s.y0 + 1); }
    return nx; };

  let mx = ri(23, 26), ey = null, minerY = -1, quayY = -1;

  // ---------- one map of a city, from its brief ----------
  function cityMap() {
    const E = B.edges, SD = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
    const dist = { n: (x, y) => y, s: (x, y) => MH - 1 - y, w: (x, y) => x, e: (x, y) => MW - 1 - x };
    const urban = new Uint8Array(MW * MH).fill(1); P.urban = urban;
    const inner = { n: 0, e: 0, s: 0, w: 0 };
    const band = (sd, d0, d1, k, keep) => { for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const d = dist[sd](x, y); if (d >= d0 && d <= d1) { set(x, y, k); if (!keep) urban[I(x, y)] = 0; } } };
    const hubT = new Set(B.hubs.map((h) => h.type));
    const country = !B.built, wet = country && B.water;
    if (country) { urban.fill(0); if (wet) rect(0, 0, MW - 1, MH - 1, B.water === 2 ? 'sea' : 'river'); else if (B.ring >= 0) rect(0, 0, MW - 1, MH - 1, 'yard'); }
    // the edges: open country, gardens, water, then the town walls on top
    for (const sd of 'nesw') { const e = E[sd]; if (!country && !e.built && !e.water && !e.wall && !e.garden) { const m = ri(7, 11); band(sd, 0, m - 1, 'out'); inner[sd] = m; } }
    for (const sd of 'nesw') { const e = E[sd]; if (e.garden && !e.wall) { const m = ri(3, 5); band(sd, 0, m - 1, 'yard'); inner[sd] = m; } }
    const quayed = hubT.has('harbour') || hubT.has('waterside') || hubT.has('tanners') || hubT.has('mills') || B.qtype === 'harbour' || B.qtype === 'waterside';
    for (const sd of 'nesw') { const e = E[sd]; if (!e.water || wet) continue; band(sd, 0, 5, e.water === 2 ? 'sea' : 'river'); band(sd, 6, 6, quayed || e.water === 2 ? 'quay' : 'out', quayed || e.water === 2); inner[sd] = 7; }
    const gateCells = [];
    for (const sd of 'nesw') { const e = E[sd]; if (!e.wall || wet) continue; const o = e.water ? 5 : 0, vert = sd === 'e' || sd === 'w';
      const cellAt = (d, u) => sd === 'n' ? [u, d] : sd === 's' ? [u, MH - 1 - d] : sd === 'w' ? [d, u] : [MW - 1 - d, u];
      if (!e.wall.kept) { band(sd, o, o + 2, 'street', true); inner[sd] = o + 3; continue; }   // razed: the wall line is a boulevard now
      if (e.wall.side === 'in') {
        if (!e.water) band(sd, 0, 0, 'ditch'); band(sd, o + 1, o + 1, 'wall'); band(sd, o + 2, o + 2, 'lane', true); inner[sd] = o + 3;
        if (e.gate) { for (let k = 0; k < e.width; k++) { const [x, y] = cellAt(o + 1, e.pos + k); set(x, y, 'out'); urban[I(x, y)] = 1; }
          const line = sd === 'n' ? o + 1 : sd === 's' ? MH - 2 - o : sd === 'w' ? o + 1 : MW - 2 - o;
          P.gates.push({ dir: sd, u: e.pos, line, cx: vert ? line + .5 : e.pos + 1, cy: vert ? e.pos + 1 : line + .5, wide: e.width }); gateCells.push([sd, e.pos]); }
        // towers along the wall, standing out from it
        for (let u = 3; u < (vert ? MH : MW) - 3; u += 10) { if (e.gate && Math.abs(u - e.pos - 1) < 7) continue; const [x, y] = cellAt(o + 1, u); if (at(x, y) === 'wall') P.towers.push({ x, y, ox: SD[sd][0], oy: SD[sd][1] }); }
      } else { if (!e.water) band(sd, 0, 1, 'ditch'); band(sd, o + 2, o + 3, 'out'); inner[sd] = o + 4; }
    }
    // the free middle of the map
    const ux0 = inner.w, uy0 = inner.n, ux1 = MW - 1 - inner.e, uy1 = MH - 1 - inner.s;
    const lay2 = (x, y, k) => { if (!inG(x, y)) return; const c = at(x, y); if ((c === 'river' || c === 'sea') && k !== 'alley') { set(x, y, 'bridge'); return; }
      if (urban[I(x, y)] || c === 'out' || c === 'ditch' || WATERK.has(c) || c === 'yard' || c === 'lane' || c === 'field') lay(x, y, k); };
    const hs2 = (x0, x1, y, w, k) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let j = 0; j < w; j++) lay2(x, y + j, k); };
    const vs2 = (x, y0, y1, w, k) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let j = 0; j < w; j++) lay2(x + j, y, k); };
    // streets across the seams: north-south and east-west through streets, each with a bend where they would not line up
    const K = (e) => e.road === 'trade' ? (country ? 'road' : 'main') : e.road === 'track' ? 'lane' : country ? 'lane' : 'street';
    const cxm = Math.round((ux0 + ux1) / 2), cym = Math.round((uy0 + uy1) / 2);
    let nsX = null, ewY = null;
    const ord = Object.entries(E).filter(([, e]) => e.road).sort((a, b) => (a[1].road === 'trade' ? 0 : 1) - (b[1].road === 'trade' ? 0 : 1));
    const wid = (e) => e.road === 'track' ? 1 : e.width;
    const nE = E.n.road ? E.n : null, sE = E.s.road ? E.s : null, wE = E.w.road ? E.w : null, eE = E.e.road ? E.e : null;
    const jy = cl(cym + ri(-4, 4), uy0 + 3, uy1 - 3), jx = cl(cxm + ri(-4, 4), ux0 + 3, ux1 - 3);
    if (wE || eE) ewY = wE && eE ? jy : (wE || eE).pos;
    if (nE || sE) nsX = nE && sE ? jx : (nE || sE).pos;
    const roads = [];
    if (nE) roads.push(() => { const k = K(nE), w = wid(nE), yEnd = sE ? jy : ewY ?? cym; vs2(nE.pos, 0, yEnd, w, k); if (sE) hs2(nE.pos, sE.pos + w - 1, jy, w, k); else if (ewY == null) hs2(nE.pos, cxm, yEnd, w, k); });
    if (sE) roads.push(() => { const k = K(sE), w = wid(sE), yEnd = nE ? jy : ewY ?? cym; vs2(sE.pos, yEnd, MH - 1, w, k); if (!nE && ewY == null) hs2(sE.pos, cxm, yEnd, w, k); });
    if (wE) roads.push(() => { const k = K(wE), w = wid(wE), xEnd = eE ? jx : nsX ?? cxm; hs2(0, xEnd, wE.pos, w, k); if (eE) vs2(jx, wE.pos, eE.pos + w - 1, w, k); else if (nsX == null) vs2(xEnd, wE.pos, cym, w, k); });
    if (eE) roads.push(() => { const k = K(eE), w = wid(eE), xEnd = wE ? jx : nsX ?? cxm; hs2(xEnd, MW - 1, eE.pos, w, k); if (!wE && nsX == null) vs2(xEnd, eE.pos, cym, w, k); });
    // the landmark this map holds goes in first, at the crossing or in the biggest free ground near the middle
    const free = (x0, y0, w, h) => { if (x0 < ux0 + 1 || y0 < uy0 + 1 || x0 + w > ux1 || y0 + h > uy1) return false; for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (at(x, y) !== 'out' || !urban[I(x, y)]) return false; return true; };
    const spot = (w, h, cx = cxm, cy = cym) => { let best = null; for (let y = uy0 + 1; y + h <= uy1; y++) for (let x = ux0 + 1; x + w <= ux1; x++) { if (!free(x, y, w, h)) continue; const d = Math.hypot(x + w / 2 - cx, y + h / 2 - cy); if (!best || d < best[2]) best = [x, y, d]; } return best; };
    const crossX = nsX ?? cxm, crossY = ewY ?? cym;
    const hasT = (...t) => t.some((k) => hubT.has(k));
    if (hasT('market', 'gate', 'craft')) {   // the market square opens at the crossing, the guildhall on its north side
      const big = hubT.has('market'), sw = big ? 22 : 14, sdp = big ? 11 : 7, x0 = cl(crossX + 1 - Math.floor(sw / 2), ux0 + 1, ux1 - sw), y0 = cl(crossY - sdp, uy0 + 1, uy1 - sdp);
      if (big) { const gx = cl(crossX - 9 + ri(0, 2), ux0 + 1, ux1 - 7); if (free(gx, y0 - 6, 7, 6)) placeGuild(gx, y0 - 6); }
      square(x0, y0, x0 + sw - 1, y0 + sdp - 1);
    }
    const church = hasT('cathedral', 'parish', 'village', 'friary');   // a market map keeps its church too (it takes the free ground nearest the square)
    const hall = hasT('guildhall', 'university', 'foreign', 'station', 'palace') && !hubT.has('market');
    const castle = hasT('castle');
    for (const f of roads) f();
    if (wet === 2) for (let i = 0; i < 4; i++) P.feats.push({ k: 'boat', x: ri(4, MW - 5) + .5, z: ri(6, MH - 6) + .5, rot: r() * .8 - .4, s: 1 + r() * .3, mast: true });
    if (!country) {
    if (castle) { const s0 = spot(17, 15); if (s0) { const [x0, y0] = s0, x1 = x0 + 16, y1 = y0 + 14;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, x === x0 || x === x1 || y === y0 || y === y1 ? 'wall' : 'yardC');
      const gx = x0 + 7; for (let k = 0; k < 2; k++) set(gx + k, y1, 'street');
      P.gates.push({ dir: 's', u: gx, line: y1, cx: gx + 1, cy: y1 + .5, wide: 2 });
      for (const [tx, ty, ox, oy] of [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]]) P.towers.push({ x: tx, y: ty, ox: ox * .7, oy: oy * .7 });
      placeGuild(x0 + 5, y0 + 3); vs2(gx, y1 + 1, crossY, 2, 'street'); hs2(gx, crossX, crossY, 2, 'street'); } }
    if (church) { const s0 = spot(10, 12); if (s0) { placeChurch(s0[0], s0[1]); vs2(P.ch.cx - 1, s0[1] + 12, crossY, 2, 'street'); hs2(P.ch.cx - 1, crossX, crossY, 2, 'street'); } }
    if (hall) { const s0 = spot(9, 8); if (s0) { placeGuild(s0[0] + 1, s0[1]); vs2(s0[0] + 3, s0[1] + 7, crossY, 2, 'street'); hs2(s0[0] + 3, crossX, crossY, 2, 'street'); } }
    // the rest is blocks between back streets: wide blocks for the rich, packed courts for the poor
    const sp = { rich: 13, middle: 10, working: 8, poor: 7 }[B.wealth] || 10;
    // grown streets: each runs most of the way across with a bend of a cell or two somewhere along it
    for (let x = ux0 + ri(4, 7); x < ux1 - 3; x += ri(sp - 1, sp + 1)) { if (nsX != null && Math.abs(x - nsX) < 5) continue; const a = uy0 + ri(0, 3), b = uy1 - ri(0, 3), k = B.wealth === 'poor' && r() < .5 ? 'alley' : 'street', w = k === 'alley' ? 1 : 2;
      const j = ri(a + 4, b - 4), x2 = cl(x + pick([-2, -1, 1, 2]), ux0 + 2, ux1 - 3); vs2(x, a, j, w, k); hs2(Math.min(x, x2), Math.max(x, x2) + w - 1, j, w, k); vs2(x2, j, b, w, k); }
    for (let y = uy0 + ri(4, 6); y < uy1 - 3; y += ri(sp - 2, sp)) { if (ewY != null && Math.abs(y - ewY) < 5) continue; const a = ux0 + ri(0, 3), b = ux1 - ri(0, 3), k = (B.wealth === 'poor' || B.wealth === 'working') && r() < .4 ? 'alley' : 'street', w = k === 'alley' ? 1 : 2;
      const j = ri(a + 4, b - 4), y2 = cl(y + pick([-2, -1, 1, 2]), uy0 + 2, uy1 - 3); hs2(a, j, y, w, k); vs2(j, Math.min(y, y2), Math.max(y, y2) + w - 1, w, k); hs2(j, b, y2, w, k); }
    // water mills on a river bank to the north or south
    if (hubT.has('mills')) for (const sd of ['n', 's']) { if (E[sd].water !== 1) continue; for (let i = 0; i < 2; i++) { const x = ri(ux0 + 3, ux1 - 7), y = sd === 'n' ? 7 : MH - 10;
      rect(x, y, x + 3, y + 2, 'works'); P.feats.push({ k: 'mill', x0: x, y0: y, x1: x + 4, y1: y + 3, wx: x + 2, wz: sd === 'n' ? y - .05 : y + 3.05 }); } }
    // boats at the quays; piers into the sea at a harbour
    for (const sd of 'nesw') { const e = E[sd]; if (!e.water) continue; const along = sd === 'n' || sd === 's', wz = (d) => sd === 'n' ? d : sd === 's' ? MH - 1 - d : d;
      if (e.water === 2 && hasT('harbour')) for (let u = 8; u < (along ? MW : MH) - 8; u += ri(9, 12)) { for (let d = 1; d <= 5; d++) { const [x, y] = along ? [u, wz(d)] : [wz(d), u]; set(x, y, 'pier'); const [x2, y2] = along ? [u + 1, wz(d)] : [wz(d), u + 1]; set(x2, y2, 'pier'); }
        if (along) P.feats.push({ k: 'boat', x: u - .5, z: wz(3) + .5, rot: Math.PI / 2, s: 1, mast: r() < .6 }); }
      if (quayed || e.water === 2) for (let u = 4; u < (along ? MW : MH) - 4; u += ri(5, 9)) { if (!along) continue; P.feats.push({ k: 'boat', x: u + .5, z: wz(3) + .5, rot: r() * .5 - .25, s: .9 + r() * .3, mast: e.water === 2 && r() < .6 }); } }
    }
    // where the party arrives: the main road's edge, a few steps in
    const ent = ord.find(([sd]) => !E[sd].water) || ord[0];
    if (ent) { const [sd, e] = ent, d = (inner[sd] || 0) + 3; P.start = sd === 'n' ? [e.pos + 1, d] : sd === 's' ? [e.pos + 1, MH - 1 - d] : sd === 'w' ? [d, e.pos + 1] : [MW - 1 - d, e.pos + 1]; }
    // building ground: every free cell in the town is a plot
    for (let i = 0; i < MW * MH; i++) if (urban[i] && g[i] === 'out') g[i] = 'lot';
    // walls: which side of the town wall each cell is on (the x-ray never opens ground beyond the wall from inside)
    const ins = new Uint8Array(MW * MH), inTown = B.insideWalls.some(Boolean);
    if (inTown) for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { let o = 1; for (const sd of 'nesw') { const e = E[sd]; if (e.wall && e.wall.side === 'in' && e.wall.kept && dist[sd](x, y) < (e.water ? 6 : 1)) o = 0; } ins[I(x, y)] = o; }
    P.walls = (inTown || B.edges.n.wall || B.edges.s.wall || B.edges.e.wall || B.edges.w.wall) ? { ins, x0: 0, y0: 0, x1: MW - 1, y1: MH + 99 } : null;
    mx = nsX ?? -99; ey = ewY;
  }

  const sdR = [7, 9, 10, 11][rank], swR = [13, 17, 22, 25][rank];

  if (B) cityMap();
  else if (basis === 'market' || basis === 'port') {
    // the crossroads: a north-south road and an east-west one; the square opens on the north side of the crossing
    if (basis === 'port') { quayY = 39; rect(0, 41, MW - 1, MH - 1, 'sea'); rect(0, 39, MW - 1, 40, 'beach'); rect(walled ? R.x0 : R.x0 - 3, 39, walled ? R.x1 : R.x1 + 3, 40, 'quay'); R.y1 = 38; }
    ey = cl(ri(Math.round(R.y0 + (R.y1 - R.y0) * .55), Math.round(R.y0 + (R.y1 - R.y0) * .66)), top0 + 11 + sdR, R.y1 - (basis === 'port' ? 7 : 5));
    spine(mx, basis === 'port' ? 38 : MH - 1, ey, 3, 'main', jogs(ey + 2, R.y1 - 3));
    hs(0, MW - 1, ey, 2, 'main');
    const x0 = cl(mx + 1 - Math.floor(swR / 2) + ri(-2, 2), R.x0 + 2, R.x1 - swR - 1);
    square(x0, ey - sdR, x0 + swR - 1, ey - 1);
    northFront(basis === 'market' ? 'in' : rank >= 2 ? 'edge' : 'in');
    if (basis === 'port') {
      // piers out from the quay, boats along them; narrow lanes run straight up from the quay to the merchants' street
      const n = [1, 2, 3, 3][rank], xs = []; for (let i = 0; i < n; i++) xs.push(Math.round(R.x0 + 4 + (i + .5) * (R.x1 - R.x0 - 8) / n) + ri(-2, 2));
      for (const px of xs) { const len = ri(3, 5); rect(px, 41, px + 1, 40 + len, 'pier');
        for (const [bx, k] of [[px - 1, 0], [px + 2, 1]]) if (r() < .85) P.feats.push({ k: 'boat', x: bx + .5, z: 41.6 + ri(0, len - 2) + .5, rot: Math.PI / 2, s: .9 + r() * .3, mast: r() < .5 });
        if (rank >= 1 && r() < .8) P.feats.push({ k: 'crane', x: px + 3.2, z: 40.2 }); }
      for (let i = 0; i < 2 + rank; i++) P.feats.push({ k: 'boat', x: ri(3, MW - 4) + .5, z: ri(44, 46), rot: r() * .6 - .3, s: 1 + r() * .4, mast: true });
      for (let x = R.x0 + ri(3, 5); x < R.x1 - 3; x += planted ? 6 : ri(5, 7)) if (Math.abs(x - mx - 1) > 3) vs(x, ey + 2, 38, planted ? 2 : 1, planted ? 'street' : 'alley');
      P.start = [mx + 1, 39];
    }
  } else if (basis === 'road') {
    // a long street-market: the through road swells into a lens where the market is held, ribs and back lanes off it
    const L = [10, 12, 14, 16][rank], maxW = [7, 9, 13, 15][rank], lc = cl(Math.round((R.y0 + R.y1) / 2) + ri(-2, 2), top0 + L / 2 + 2, R.y1 - L / 2 - 3);
    spine(mx, MH - 1, 0, 3, 'main', [...jogs(lc + L / 2 + 3, R.y1 - 3, planted ? 0 : 1), ...jogs(top0 + 3, lc - L / 2 - 3, planted ? 0 : 1)]);
    const lens = {}; let mxc = mx;   // the spine's x at the lens
    for (let y = lc - L / 2; y <= lc + L / 2; y++) { const t = (y - (lc - L / 2)) / L, w = Math.round(3 + (maxW - 3) * (planted ? 1 : Math.sin(Math.PI * t))), c = mxc + 1.5; lens[y] = [Math.round(c - w / 2), Math.round(c + w / 2) - 1]; }
    const ys = Object.keys(lens).map(Number);
    for (const y of ys) hs(lens[y][0], lens[y][1], y, 1, 'square');
    P.sq = { x0: Math.min(...ys.map((y) => lens[y][0])), x1: Math.max(...ys.map((y) => lens[y][1])), y0: lc - L / 2, y1: lc + L / 2 };
    if (rank >= 1 && maxW >= 13) placeGuild(mxc - 2, lc - 3);
    const west = r() < .5, cy0 = cl(lc - 9 + ri(-1, 1), top0, R.y1 - 13), cx0 = west ? cl(lens[lc][0] - 12 - ri(0, 2), R.x0 + 1, MW) : cl(lens[lc][1] + 3 + ri(0, 2), 0, R.x1 - 10);
    placeChurch(cx0, cy0); hs(west ? P.ch.yx0 + 1 : mxc + 3, west ? mxc - 1 : P.ch.yx1 - 1, cy0 + 11, 2, 'street');
    const bw = Math.ceil(maxW / 2) + 4;
    for (const bx of [mxc + 1 - bw, mxc + 1 + bw]) vs(bx, top0 + 1, R.y1 - 1, 1, 'alley');       // back lanes behind the long plots
    for (let y = top0 + ri(3, 6); y < R.y1 - 3; y += planted ? 8 : ri(7, 10)) if (y < lc - L / 2 - 2 || y > lc + L / 2 + 2) { const a = planted ? R.x0 + 1 : mxc - ri(7, 13), b = planted ? R.x1 - 1 : mxc + 3 + ri(7, 13); hs(a, b, y, 2, 'street'); }
  } else if (basis === 'bridge') {
    // the river crossing: a bridgehead market on the north bank, the walls along the river, a bridge suburb and mills on the south bank
    if (walled) R.y1 = Math.min(R.y1, 33);
    const rv = walled ? R.y1 + 1 : ri(31, 33); const jx = r() < .5 ? ri(4, mx - 7) : ri(mx + 9, MW - 5);
    for (let x = 0; x < MW; x++) { const o = !planted && ((jx < mx) ? x < jx : x > jx) ? 1 : 0; rect(x, rv + o, x, rv + 2 + o, 'river'); }
    if (!walled) R.y1 = rv - 1;
    spine(mx, MH - 1, 0, 3, 'main', [...jogs(rv + 5, MH - 3, planted ? 0 : 1), ...jogs(top0 + 3, rv - 15, planted ? 0 : 1)]);
    const sd = sdR + 1, y1 = walled ? rv - 3 : rv - 2, y0 = y1 - sd + 1, sw = swR;
    const x0 = cl(mx + 1 - Math.floor(sw / 2) + ri(-2, 2), R.x0 + 2, R.x1 - sw - 1);
    square(x0, y0, x0 + sw - 1, y1, planted ? null : (x, y) => { const k = (y1 - y) >> 1; return x >= x0 + Math.min(k, 3) && x <= x0 + sw - 1 - Math.min(k, 3) || y > y0 + 1; });
    P.sq = { x0, y0, x1: x0 + sw - 1, y1 };
    northFront(rank >= 2 ? 'edge' : 'in');
    if (!walled) hs(R.x0 - 2, R.x1 + 2, rv - 1, 1, 'quay');
    ey = y0 - 1;
    // mills on the south bank, wheels in the stream
    for (let i = 0; i < (rank >= 1 ? 2 : 1); i++) { const x = cl(mx + (i % 2 ? -1 : 1) * ri(8, 14), 3, MW - 7), y = rv + 3 + (at(x, rv + 3) === 'river' ? 1 : 0);
      rect(x, y, x + 3, y + 2, 'works'); P.feats.push({ k: 'mill', x0: x, y0: y, x1: x + 4, y1: y + 3, wx: x + 2, wz: y - .05 }); vs(x + 1, y + 3, y + 4, 1, 'lane'); }
    P.start = [mx + 1, Math.min(MH - 2, rv + 6)];
    P.river = rv;
  } else if (basis === 'fishing') {
    // a shore lane above the beach; cottages face the sea; boats drawn up, nets drying
    rect(0, 41, MW - 1, MH - 1, 'sea'); rect(0, 37, MW - 1, 40, 'beach');
    const sl = 35; R.y1 = 34;
    hs(0, MW - 1, sl, 2, 'street');
    spine(mx, sl - 1, 0, 2, 'main', jogs(R.y0 + 2, sl - 4));
    if (rank >= 1) { const ly = ri(24, 27); hs(R.x0 + ri(0, 4), R.x1 - ri(0, 4), ly, 1, 'lane');
      const s0 = mx - 11; square(s0, sl - 4, mx + 6, sl - 1, () => true); P.sq = { x0: s0, y0: sl - 4, x1: mx + 6, y1: sl - 1 }; placeChurch(s0, sl - 15); }
    for (let x = 3; x < MW - 3; x += ri(4, 7)) { if (Math.abs(x - mx) < 3) continue; P.feats.push({ k: 'boat', x: x + .5, z: 38.6 + r() * .6, rot: Math.PI / 2 + (r() - .5) * .4, s: .85 + r() * .25, mast: false, beached: true });
      if (r() < .6) P.feats.push({ k: 'net', x: x + 2.5, z: 37.5, rot: 0 }); }
    for (let i = 0; i < 3; i++) P.feats.push({ k: 'boat', x: ri(4, MW - 5) + .5, z: ri(43, 46), rot: r() * .8 - .4, s: 1, mast: r() < .6 });
    P.start = [mx + 1, sl];
  } else if (basis === 'mining') {
    // a planted mining town below the workings: a big square with the church and the mint; miners' rows up the slope, headframes and spoil among them; smelters by the stream
    const sx = ri(42, 44);
    for (let y = 0; y < MH; y++) { const o = !planted && y > 20 ? 1 : 0; rect(sx + o, y, sx + 1 + o, y, 'stream'); }
    minerY = Math.round(R.y0 + (R.y1 - R.y0) * .3); const T = { x0: R.x0, y0: minerY, x1: Math.min(R.x1, sx - 3), y1: R.y1 };
    R.x0 = T.x0; R.x1 = T.x1; R.y0 = T.y0;
    mx = cl(Math.round((T.x0 + T.x1) / 2) - 1 + ri(-2, 2), T.x0 + 8, T.x1 - 10);
    const sd = sdR, sw = swR + 2, top1 = (walled ? T.y0 + 2 : T.y0) + 11;
    ey = Math.min(T.y1 - 3, Math.max(Math.round((T.y0 + T.y1) / 2) + 6, top1 + sd));
    spine(mx, MH - 1, 0, 3, 'main', []);
    hs(T.x0 - 4, MW - 1, ey, 2, 'main');
    const x0 = cl(mx + 1 - Math.floor(sw / 2), T.x0 + 2, T.x1 - sw - 1); square(x0, ey - sd, x0 + sw - 1, ey - 1, () => true); P.sq = { x0, y0: ey - sd, x1: x0 + sw - 1, y1: ey - 1 };
    northFront('in');
    // miners' rows: lanes wandering off the mine road, a cell up or down every few steps
    const mtop = 2, mbot = minerY - (walled ? 2 : 1);
    for (let y = mtop + ri(1, 3); y < mbot - 1; y += ri(4, 6)) for (const dir of [-1, 1]) { if (r() < .25) continue; let cx = mx + (dir < 0 ? -1 : 3), cy = y; const len = ri(8, 16);
      for (let i = 0; i < len; i++) { lay(cx, cy, 'lane'); cx += dir; if (cx < 2 || cx > sx - 2) break; if (r() < .22) { const ny = cl(cy + pick([-1, 1]), mtop, mbot - 1); lay(cx, ny, 'lane'); lay(cx - dir, ny, 'lane'); cy = ny; } } }
    // headframes over the shafts with spoil heaps beside them
    for (let tries = 0, n = 0; tries < 200 && n < 3 + rank; tries++) { const x = ri(3, sx - 6), y = ri(2, mbot - 4); let ok = true;
      for (let yy = y - 1; yy <= y + 3 && ok; yy++) for (let xx = x - 1; xx <= x + 4 && ok; xx++) if (at(xx, yy) !== 'out') ok = false;
      if (!ok) continue; rect(x, y, x + 1, y + 1, 'works'); rect(x + 2, y, x + 3, y + 2, 'spoil'); P.feats.push({ k: 'headframe', x: x + 1, z: y + 1 }, { k: 'spoil', x: x + 3, z: y + 1.6, s: 1 + r() * .3 }); n++; }
    // smelters across the stream, a road and a bridge over to them
    for (let i = 0, y = ri(10, 16); i < (rank >= 1 ? 2 : 1); i++, y += ri(9, 13)) { const x = sx + 3; if (y > MH - 6) break; rect(x, y, x + 3, y + 2, 'works'); P.feats.push({ k: 'smelter', x0: x, y0: y, x1: x + 4, y1: y + 3 }); hs(mx + 3, x - 1, y + 3, 1, 'lane'); }
    P.minerY = minerY;
  }

  // ---------- secondary streets: an even grid when planted, an irregular net of partial streets when grown ----------
  const zoneOK = (x, y) => x > R.x0 + (walled ? 1 : 0) && x < R.x1 - (walled ? 1 : 0) && y > R.y0 + (walled ? 1 : 0) && y < R.y1 - (walled ? 1 : 0);
  if (!B && basis !== 'fishing' && basis !== 'road') {
    if (planted) { const bx = ri(9, 10), by = ri(8, 9), oy = ey ?? Math.round((R.y0 + R.y1) / 2);
      for (let x = mx + 1 - bx * 4; x < R.x1; x += bx) if (x > R.x0 + 2 && Math.abs(x - mx - 1) > 3) vs(x, R.y0 + 1, R.y1 - 1, 2, 'street');
      for (let y = oy - by * 5; y < R.y1; y += by) if (y > R.y0 + 2 && Math.abs(y - oy) > 2) hs(R.x0 + 1, R.x1 - 1, y, 2, 'street'); }
    else { for (let x = R.x0 + ri(5, 8); x < R.x1 - 4; x += ri(8, 11)) { if (Math.abs(x - mx - 1) < 6) continue; const a = R.y0 + ri(1, 7), b = R.y1 - ri(1, 7), j = ri(a + 3, b - 3);
        vs(x, a, j, 2, 'street'); const x2 = cl(x + pick([-1, 1]), R.x0 + 2, R.x1 - 3); hs(Math.min(x, x2), Math.max(x, x2) + 1, j, 2, 'street'); vs(x2, j, b, 2, 'street'); }
      for (let y = R.y0 + ri(5, 7); y < R.y1 - 3; y += ri(7, 10)) { if (ey !== null && Math.abs(y - ey) < 4) continue; const a = R.x0 + ri(1, 8), b = R.x1 - ri(1, 8); hs(a, b, y, r() < .3 ? 1 : 2, r() < .3 ? 'alley' : 'street'); } }
  }
  // never leave a street running into a wall or the countryside short of a junction: trim stubs later (lots front them anyway)

  // ---------- walls, lane, gates, towers, ditch ----------
  const ins = new Uint8Array(MW * MH);
  if (walled) {
    for (let y = R.y0; y <= (basis === 'port' ? 40 : R.y1); y++) for (let x = R.x0; x <= R.x1; x++) ins[I(x, y)] = 1;
    // grown towns' walls take in irregular ground: notch the corners where nothing important stands
    if (!planted) for (const [cx, cy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { if (r() < .35 || (cy === 1 && (basis === 'port' || basis === 'bridge'))) continue; const w = ri(3, 7), h = ri(3, 6);
      const xs = cx ? [R.x1 - w + 1, R.x1] : [R.x0, R.x0 + w - 1], ys = cy ? [R.y1 - h + 1, R.y1] : [R.y0, R.y0 + h - 1]; let ok = true;
      for (let y = ys[0] - 2; y <= ys[1] + 2 && ok; y++) for (let x = xs[0] - 2; x <= xs[1] + 2 && ok; x++) { const k = at(x, y); if (PROT.has(k) || k === 'square' || k === 'main' || k === 'quay') ok = false; }
      if (ok) for (let y = ys[0]; y <= ys[1]; y++) for (let x = xs[0]; x <= xs[1]; x++) ins[I(x, y)] = 0; }
    const isIn = (x, y) => inG(x, y) && ins[I(x, y)] === 1;
    const wallC = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (isIn(x, y) && N8.some(([dx, dy]) => !isIn(x + dx, y + dy) && at(x + dx, y + dy) !== 'sea' && at(x + dx, y + dy) !== 'pier')) wallC.push([x, y]);
    const wallSet = new Set(wallC.map(([x, y]) => I(x, y)));
    // gates: where a main road crosses the wall on a straight run
    const seen = new Set();
    for (const [x, y] of wallC) { if (seen.has(I(x, y)) || at(x, y) !== 'main') continue; const out = N4.find(([dx, dy]) => !isIn(x + dx, y + dy)); if (!out) continue;
      const horiz = out[1] !== 0, run = []; let u = horiz ? x : y; while (true) { const cx = horiz ? u : x, cy = horiz ? y : u; if (!wallSet.has(I(cx, cy)) || at(cx, cy) !== 'main') break; run.push([cx, cy]); seen.add(I(cx, cy)); u++; }
      if (run.length < 2) continue; const dir = out[1] > 0 ? 's' : out[1] < 0 ? 'n' : out[0] > 0 ? 'e' : 'w';
      P.gates.push({ dir, u: horiz ? x : y, line: horiz ? y : x, cx: horiz ? x + 1 : x + .5, cy: horiz ? y + .5 : y + 1, wide: run.length }); }
    for (const [x, y] of wallC) { const G = P.gates.find((G) => { const along = G.dir === 's' || G.dir === 'n' ? x : y, across = G.dir === 's' || G.dir === 'n' ? y : x; return across === G.line && along >= G.u && along <= G.u + 1; }); if (!G) set(x, y, 'wall'); }
    // the lane inside the wall, then everything left inside is building ground
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (isIn(x, y) && !wallSet.has(I(x, y)) && N8.some(([dx, dy]) => wallSet.has(I(cl(x + dx, 0, MW - 1), cl(y + dy, 0, MH - 1))) && isIn(x + dx, y + dy)) && (at(x, y) === 'out' || at(x, y) === 'street' || at(x, y) === 'alley')) set(x, y, 'lane');
    // the ditch, one cell out; roads cross it on bridges
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (isIn(x, y)) continue; let d = 9; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (isIn(x + dx, y + dy)) d = Math.min(d, Math.max(Math.abs(dx), Math.abs(dy)));
      if (d !== 2) continue; const k = at(x, y); if (k === 'main' || k === 'road') set(x, y, 'bridge'); else if (k === 'out' || k === 'street' || k === 'alley' || k === 'lane') { if (!N4.some(([dx, dy]) => WATERK.has(at(x + dx, y + dy)) && at(x + dx, y + dy) !== 'ditch' || at(x + dx, y + dy) === 'beach' || at(x + dx, y + dy) === 'quay')) set(x, y, 'ditch'); } }
    // towers at every corner and along the straight runs, standing a little proud of the wall
    const tw = []; const isW = (x, y) => inG(x, y) && at(x, y) === 'wall';
    for (const [x, y] of wallC) { if (!isW(x, y)) continue; const h = isW(x - 1, y) || isW(x + 1, y), v = isW(x, y - 1) || isW(x, y + 1); if (h && v) tw.push([x, y]); }
    const nearGate = (x, y) => P.gates.some((G) => Math.hypot(x + .5 - G.cx, y + .5 - G.cy) < 7);
    const fin = []; for (const t of tw) if (!nearGate(...t) && !fin.some((f) => Math.max(Math.abs(f[0] - t[0]), Math.abs(f[1] - t[1])) < 6)) fin.push(t);
    for (const [x, y] of wallC.slice().sort((a, b) => ((a[0] * 7 + a[1] * 13 + seed) % 5) - ((b[0] * 7 + b[1] * 13 + seed) % 5))) { if (!isW(x, y) || nearGate(x, y)) continue; if (!fin.some((f) => Math.max(Math.abs(f[0] - x), Math.abs(f[1] - y)) < 10)) fin.push([x, y]); }
    for (const [x, y] of fin) { let ox = 0, oy = 0; for (const [dx, dy] of N4) if (!isIn(x + dx, y + dy)) { ox += dx; oy += dy; }
      if (!ox && !oy) for (const [dx, dy] of N8) if (!isIn(x + dx, y + dy)) { ox = dx; oy = dy; break; }
      const n = Math.hypot(ox, oy) || 1; if (N4.some(([dx, dy]) => at(x + dx, y + dy) === 'sea')) continue; P.towers.push({ x, y, ox: ox / n, oy: oy / n }); }
    for (let i = 0; i < MW * MH; i++) if (!ins[i] && g[i] === 'main') g[i] = 'road';
    for (let i = 0; i < MW * MH; i++) if (ins[i] && g[i] === 'out') g[i] = 'lot';
    P.walls = { ins, x0: R.x0, y0: R.y0, x1: R.x1, y1: basis === 'port' ? 40 : R.y1 };
  } else { for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (g[I(x, y)] === 'main' && (y > R.y1 + 1 || y < R.y0 - 1 || x < R.x0 - 1 || x > R.x1 + 1)) g[I(x, y)] = 'road'; }

  // ---------- big blocks get a back alley through the middle (burgage plots need a way to the yards) ----------
  if ((walled || rank >= 1) && basis !== 'fishing' && !(B && !B.built)) for (let pass = 0; pass < 6; pass++) {
    const comp = new Int32Array(MW * MH).fill(-1), boxes = [];
    for (let i = 0; i < MW * MH; i++) { const k = g[i]; if ((k !== 'lot' && !(k === 'out' && !walled)) || comp[i] >= 0) continue; const x0 = i % MW, y0 = (i / MW) | 0; if (!walled && !zoneOK(x0, y0)) continue;
      const q = [i]; comp[i] = boxes.length; const b = { x0, y0, x1: x0, y1: y0, n: 0 };
      while (q.length) { const c = q.pop(), cx = c % MW, cy = (c / MW) | 0; b.n++; b.x0 = Math.min(b.x0, cx); b.x1 = Math.max(b.x1, cx); b.y0 = Math.min(b.y0, cy); b.y1 = Math.max(b.y1, cy);
        for (const [dx, dy] of N4) { const x = cx + dx, y = cy + dy; if (!inG(x, y)) continue; const j = I(x, y); if (comp[j] < 0 && g[j] === k && (walled || zoneOK(x, y))) { comp[j] = boxes.length; q.push(j); } } }
      boxes.push(b); }
    let cut = 0;
    for (const b of boxes) { const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1; if (w <= 13 && h <= 12) continue;
      if (w / 13 >= h / 12) { const x = Math.round((b.x0 + b.x1) / 2) + (planted ? 0 : ri(-1, 1)); for (let y = b.y0; y <= b.y1; y++) if (g[I(x, y)] === 'lot' || (g[I(x, y)] === 'out' && !walled)) g[I(x, y)] = 'alley'; }
      else { const y = Math.round((b.y0 + b.y1) / 2) + (planted ? 0 : ri(-1, 1)); for (let x = b.x0; x <= b.x1; x++) if (g[I(x, y)] === 'lot' || (g[I(x, y)] === 'out' && !walled)) g[I(x, y)] = 'alley'; }
      cut++; }
    if (!cut) break; }

  // ---------- building ground: inside the walls it is all plots; open towns build along their streets only, suburbs along the roads out of the gates ----------
  {
    const depth = { main: 4, square: 4, quay: 4, street: 3, road: 3, alley: 2, lane: 2 }, rem = new Int8Array(MW * MH).fill(-1), q = [];
    const subL = basis === 'bridge' && walled ? 10 : rank >= 3 ? 11 : rank === 2 && r() < .5 ? 7 : 0;
    const okAt = (x, y) => { if (!inG(x, y) || x < 1 || y < 1 || x > MW - 2 || y > MH - 2) return false; if (basis === 'mining' && y < minerY - 2) return true; if (walled) { const G = P.gates.find((G) => Math.hypot(x + .5 - G.cx, y + .5 - G.cy) <= subL + 2); return !!G && !ins[I(x, y)] && N8.every(([dx, dy]) => g[I(cl(x + dx, 0, MW - 1), cl(y + dy, 0, MH - 1))] !== 'ditch') && Math.min(...[...Array(25)].map((_, k) => { const dx = k % 5 - 2, dy = ((k / 5) | 0) - 2; return inG(x + dx, y + dy) && ins[I(x + dx, y + dy)] ? 0 : 1; })) === 1; }
      return x >= R.x0 - 1 && x <= R.x1 + 1 && y >= R.y0 - 1 && y <= R.y1 + 1 || (rank >= 1 && Math.abs(y - R.y1) <= 6 && basis !== 'port' && basis !== 'fishing' && basis !== 'bridge'); };
    if (!(B && !B.built)) for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = g[I(x, y)], d = basis === 'fishing' || (basis === 'mining' && y < minerY - 2) ? Math.min(2, depth[k] || 0) : depth[k]; if (!d) continue; if (walled && ins[I(x, y)]) continue; if (k === 'road' && walled && !subL) continue; rem[I(x, y)] = d; q.push([x, y]); }
    while (q.length) { const [x, y] = q.shift(), d = rem[I(x, y)]; if (d <= 0) continue;
      for (const [dx, dy] of N4) { const nx = x + dx, ny = y + dy; if (!inG(nx, ny) || g[I(nx, ny)] !== 'out' || rem[I(nx, ny)] >= 0 || !okAt(nx, ny)) continue; rem[I(nx, ny)] = d - 1; g[I(nx, ny)] = 'lot'; q.push([nx, ny]); } }
  }
  // ---------- fields: strips beyond the houses, in a patchwork ----------
  { const fw = ri(5, 7), fh = ri(3, 5); for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (g[I(x, y)] !== 'out') continue; let ok = true;
      for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2 && ok; dx++) { const k = at(x + dx, y + dy); if (k !== 'out' && k !== 'field') ok = false; }
      if (!ok) continue; const h = rngOf(Math.floor(x / fw) * 73 + Math.floor(y / fh) * 191 + seed * 7)(); if (h < .55) g[I(x, y)] = 'field'; } }

  // ---------- fountain: the open heart of the square, clear of the landmarks ----------
  if (P.sq) { const s = P.sq, cxm = (s.x0 + s.x1) / 2, cym = (s.y0 + s.y1) / 2 + 1; let best = null;
    for (const m of [2, 1]) { if (best) break; for (let y = s.y0 + 1; y <= s.y1 - 1; y++) for (let x = s.x0 + 1; x <= s.x1 - 1; x++) { let ok = true; for (let dy = -m; dy <= m && ok; dy++) for (let dx = -m; dx <= m && ok; dx++) if (at(x + dx, y + dy) !== 'square') ok = false;
      if (P.gh && x >= P.gh.x - 2 && x <= P.gh.x + 8 && y >= P.gh.y - 2 && y <= P.gh.y + 8) ok = false;
      if (!ok) continue; if (P.ch && Math.abs(x + .5 - P.ch.cx) < 3.5 && y < P.ch.y + 15) continue; const sc = Math.hypot(x + .5 - cxm, (y + .5 - cym) * 1.4); if (!best || sc < best[2]) best = [x + .5, y + .5, sc]; } }
    if (best) P.fountain = [best[0], best[1]]; }
  if (B && P.start) { const [sx, sy] = P.start; let best = null; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = g[I(x, y)]; if (!WALKK.has(k) || k === 'field') continue; const d = Math.hypot(x - sx, y - sy); if (!best || d < best[2]) best = [x, y, d]; } if (best) P.start = [best[0], best[1]]; }
  // ---------- where the party arrives ----------
  if (!P.start) { const G = P.gates.find((G) => G.dir === 's') || P.gates[0];
    if (G && G.dir === 's') P.start = [G.u + 1, G.line - 6]; else if (G) P.start = G.dir === 'n' ? [G.u + 1, G.line + 3] : G.dir === 'e' ? [G.line - 3, G.u + 1] : [G.line + 3, G.u + 1];
    else { const y = Math.min(MH - 3, R.y1 + 3); let x = mx + 1; for (let dx = 0; dx < 6; dx++) { if (at(mx + 1 + dx, y) === 'road' || at(mx + 1 + dx, y) === 'main') { x = mx + 1 + dx; break; } if (at(mx + 1 - dx, y) === 'road' || at(mx + 1 - dx, y) === 'main') { x = mx + 1 - dx; break; } } P.start = [x, y]; } }

  // ---------- quarters: the rich round the square, crafts by the water, the poor under the walls and outside them ----------
  const dsq = new Int16Array(MW * MH).fill(999), dw = new Int16Array(MW * MH).fill(999);
  { const q = []; for (let i = 0; i < MW * MH; i++) if (g[i] === 'square' || g[i] === 'quay') { dsq[i] = 0; q.push(i); } if (!q.length) for (let y = 0; y < MH; y++) { dsq[I(mx + 1, y)] = 0; q.push(I(mx + 1, y)); }
    for (let h = 0; h < q.length; h++) { const c = q[h], cx = c % MW, cy = (c / MW) | 0; for (const [dx, dy] of N4) { const x = cx + dx, y = cy + dy; if (!inG(x, y) || dsq[I(x, y)] <= dsq[c] + 1) continue; dsq[I(x, y)] = dsq[c] + 1; q.push(I(x, y)); } }
    const q2 = []; for (let i = 0; i < MW * MH; i++) if (g[i] === 'river' || g[i] === 'stream') { dw[i] = 0; q2.push(i); }
    for (let h = 0; h < q2.length; h++) { const c = q2[h], cx = c % MW, cy = (c / MW) | 0; if (dw[c] > 6) continue; for (const [dx, dy] of N4) { const x = cx + dx, y = cy + dy; if (!inG(x, y) || dw[I(x, y)] <= dw[c] + 1) continue; dw[I(x, y)] = dw[c] + 1; q2.push(I(x, y)); } } }
  const side = seed % 2;
  P.district = (x, y) => { const i = I(cl(x, 0, MW - 1), cl(y, 0, MH - 1)), d = dsq[i];
    if (basis === 'fishing') return 'cottage';
    if (basis === 'mining' && y < minerY) return 'miner';
    if (rank === 0) return d <= 4 ? 'common' : 'cottage';
    if (basis === 'port' && y >= 33) return 'ware';
    if (walled && !ins[i]) return 'poor';
    if (!walled && d > 12) return 'cottage';
    if (dw[i] <= 4) return 'craft';
    if (d <= 8) return 'rich';
    if (d >= 16) return (x < mx) === !!side ? 'craft' : 'poor';
    return 'common'; };
  P.label = `${BASES[basis]}, ${RANKS[rank].toLowerCase()}, ${planted ? 'planted' : 'grown'}`;
  if (B) { const D = { rich: 'rich', middle: 'common', working: 'craft', poor: 'poor' }, base = D[B.wealth] || 'common';
    P.district = (x, y) => { const i = I(cl(x, 0, MW - 1), cl(y, 0, MH - 1)); if (!P.urban[i]) return base === 'rich' ? 'common' : 'cottage';
      if (dsq[i] <= 6 && (base === 'common' || base === 'craft') && P.sq) return base === 'craft' ? 'common' : 'rich'; return base; };
    P.label = `${B.city}: ${B.quarter || 'outskirts'}, ${B.wealth || ''} map ${B.x},${B.y}`; P.brief = B; }
  P.mx = mx; P.ey = ey; P.R = R; P.quayY = quayY;
  return P;
}

// ---------- lots: each street-facing edge of a block is cut into narrow plots, the rest is yard ----------
export function carve(P) {
  const { g, at, I, r, ri, district } = P;
  const lotId = new Int16Array(MW * MH).fill(-1), lots = [];
  const free = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH && at(x, y) === 'lot' && lotId[I(x, y)] < 0;
  const D = { S: [0, 1], N: [0, -1], E: [1, 0], W: [-1, 0] };
  const cand = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (at(x, y) === 'lot') for (const [f, [dx, dy]] of Object.entries(D)) {
    const k = at(x + dx, y + dy), w = FRONT[k]; if (w) cand.push({ x, y, f, w: w + (f === 'S' ? .5 : f === 'N' ? .3 : 0) + r() * .2 }); }
  cand.sort((a, b) => b.w - a.w);
  for (const c of cand) {
    if (!free(c.x, c.y)) continue;
    const dist = district(c.x, c.y), [fx, fy] = D[c.f], ax = fy !== 0 ? 1 : 0, ay = fx !== 0 ? 1 : 0;
    const sk = at(c.x + fx, c.y + fy), big = sk === 'main' || sk === 'square' || sk === 'quay', small = dist === 'cottage' || dist === 'miner';
    const want = ri(2, 3), dep = big ? ri(3, 4) : small || dist === 'poor' || sk === 'alley' || sk === 'lane' ? 2 : ri(2, 3);
    const cells = (w, d, s) => { const out = []; for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) out.push([c.x + ax * (i + s) - fx * j, c.y + ay * (i + s) - fy * j]); return out; };
    const j0 = (x, y) => FRONT[at(x + fx, y + fy)];
    let best = null;
    for (let w = want; w >= 1 && !best; w--) for (let d = dep; d >= 1 && !best; d--) for (const s of [0, -1, -(w - 1)]) {
      const cs = cells(w, d, s); if (cs.every(([x, y]) => free(x, y)) && cs.some(([x, y]) => j0(x, y))) { best = { w, d, s, cs }; break; } }
    if (!best) continue;
    const xs = best.cs.map((p) => p[0]), ys = best.cs.map((p) => p[1]);
    const L = { id: lots.length, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) + 1, d: Math.max(...ys) - Math.min(...ys) + 1, f: c.f, street: sk, dist };
    for (const [x, y] of best.cs) lotId[I(x, y)] = L.id;
    lots.push(L);
    // cottages and miners' houses stand apart, a garden between
    if (small && r() < .7) for (const [x, y] of cells(1, best.d, best.s + best.w)) if (free(x, y)) g[I(x, y)] = 'yard';
  }
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (at(x, y) === 'lot' && lotId[I(x, y)] < 0) g[I(x, y)] = 'yard';
  return { lots, lotId };
}
