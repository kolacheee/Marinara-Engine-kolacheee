// @ts-nocheck
// gen2/grid.js: the map grid the second-generation town generator works on.
// Engine code: culture-neutral. It knows ground kinds, roles and physical needs; every building name, size,
// count and social rule comes from a grammar (see grammar-*.js). Keep words of any one culture out of this file.
export const MW = 52, MH = 48;
export const K = {
  OUT: 0, FIELD: 1, RIVER: 2, SEA: 3, STREAM: 4, DITCH: 5,
  MAIN: 10, STREET: 11, LANE: 12, ALLEY: 13, SQUARE: 14, ROAD: 15, BRIDGE: 16, QUAY: 17, BEACH: 18, PIER: 19, TRACK: 20,
  BLD: 30, COURT: 31, APRON: 32, HOUSE: 33, GARDEN: 34, WALL: 35, GATE: 36, GREEN: 37, SPOIL: 38,
};
export const KN = Object.fromEntries(Object.entries(K).map(([k, v]) => [v, k.toLowerCase()]));
export const isWater = (k) => k >= 2 && k <= 5;
export const isWay = (k) => k >= 10 && k <= 20;               // streets, roads, open market ground, quays
export const isWalk = (k) => isWay(k) || k === K.APRON || k === K.GATE || k === K.GREEN || k === K.GARDEN || k === K.FIELD || k === K.OUT;
// street ranks: higher wins when two are laid over each other
export const RANK = { [K.SQUARE]: 9, [K.QUAY]: 8, [K.PIER]: 8, [K.BRIDGE]: 8, [K.MAIN]: 7, [K.ROAD]: 6, [K.STREET]: 5, [K.LANE]: 3, [K.ALLEY]: 2, [K.TRACK]: 1 };
export const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
export const N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
export const SIDE = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };

export const rngOf = (seed) => { let a = seed * 2654435761 >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

export function makeGrid(W = MW, H = MH) {
  const n = W * H;
  const G = { W, H, n, k: new Uint8Array(n), bid: new Int16Array(n).fill(-1), pid: new Int16Array(n).fill(-1), apr: new Int16Array(n).fill(-1), h: new Float32Array(n), town: new Uint8Array(n), ins: new Uint8Array(n) };
  G.I = (x, y) => y * W + x;
  G.in = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  G.at = (x, y) => G.k[G.I(Math.max(0, Math.min(W - 1, x)), Math.max(0, Math.min(H - 1, y)))];
  G.set = (x, y, k) => { if (G.in(x, y)) G.k[G.I(x, y)] = k; };
  // lay a way cell: water becomes a crossing for roads, a better way is never overwritten, built ground never
  G.lay = (x, y, k) => { if (!G.in(x, y)) return false; const i = G.I(x, y), c = G.k[i];
    if (isWater(c)) { if (k === K.MAIN || k === K.ROAD || k === K.STREET || ((c === K.STREAM || c === K.DITCH) && k !== K.ALLEY)) { G.k[i] = K.BRIDGE; return true; } return false; }
    if (c >= 30 || c === K.SPOIL) return false; if ((RANK[c] || 0) >= RANK[k]) return true; G.k[i] = k; return true; };
  G.line = (x0, y0, x1, y1, w, k) => { // an axis-aligned run, w wide (grows east / south)
    if (y0 === y1) for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let j = 0; j < w; j++) G.lay(x, y0 + j, k);
    else for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (let j = 0; j < w; j++) G.lay(x0 + j, y, k); };
  return G;
}

// breadth-first distance over cells that pass(k, i); seeds are cell indices. 4-connected, integer steps.
export function field(G, seeds, pass, max = 9999) {
  const d = new Int16Array(G.n).fill(32767), q = new Int32Array(G.n), W = G.W, H = G.H, k = G.k; let h = 0, t = 0;
  for (const s of seeds) if (d[s] !== 0) { d[s] = 0; q[t++] = s; }
  // neighbours in N4 order (east, west, south, north), unrolled: this is the hottest loop of both generators
  while (h < t) { const c = q[h++], cy = (c / W) | 0, cx = c - cy * W, dc = d[c]; if (dc >= max) continue; const nd = dc + 1;
    for (let e = 0; e < 4; e++) { let j;
      if (e === 0) { if (cx + 1 >= W) continue; j = c + 1; } else if (e === 1) { if (cx < 1) continue; j = c - 1; } else if (e === 2) { if (cy + 1 >= H) continue; j = c + W; } else { if (cy < 1) continue; j = c - W; }
      if (d[j] <= nd || !pass(k[j], j)) continue; d[j] = nd; q[t++] = j; } }
  return d;
}

// summed-area table of a 0/1 mask: blocked(x0,y0,w,h) in O(1)
export function sat(G, mask) {
  const W = G.W + 1, S = new Int32Array(W * (G.H + 1));
  for (let y = 0; y < G.H; y++) { let row = 0; for (let x = 0; x < G.W; x++) { row += mask[y * G.W + x] ? 1 : 0; S[(y + 1) * W + x + 1] = S[y * W + x + 1] + row; } }
  return (x0, y0, w, h) => { if (x0 < 0 || y0 < 0 || x0 + w > G.W || y0 + h > G.H) return 1e9; return S[(y0 + h) * W + x0 + w] - S[y0 * W + x0 + w] - S[(y0 + h) * W + x0] + S[y0 * W + x0]; };
}

// A local frame for a footprint w x d (w along the front, d back from it) set down facing `f` (n/e/s/w), mirrored or not.
// u runs along the front from the left as seen from outside, v from the front row back.
export function frame(x0, y0, w, d, f, m) {
  const sw = f === 'e' || f === 'w', W = sw ? d : w, H = sw ? w : d;
  const uu = (u) => m ? w - 1 - u : u;
  const cell = (u0, v) => { const u = uu(u0);
    if (f === 's') return [x0 + u, y0 + d - 1 - v];
    if (f === 'n') return [x0 + w - 1 - u, y0 + v];
    if (f === 'e') return [x0 + d - 1 - v, y0 + w - 1 - u];
    return [x0 + v, y0 + u]; };
  return { x0, y0, W, H, f, m, w, d, cell };
}
// the cell just outside a door: side f (front), b (back), l, r at position `at` along that side
export function doorOut(F, side, at) {
  if (side === 'f') return F.cell(at, -1);
  if (side === 'b') return F.cell(at, F.d);
  if (side === 'l') return F.cell(-1, at);
  return F.cell(F.w, at);
}
