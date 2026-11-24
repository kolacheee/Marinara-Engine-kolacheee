// @ts-nocheck
// gen2/cityworker.js: builds a city off the main thread. Posts the skeleton first, then every ward filled,
// nearest the main market first, so the maps the party walks into are usually ready before they are asked for.
import { citySkeleton, U } from './city2.js';
import { MW, MH, isWay, isWater } from './grid.js';
import { CITY_LATIN } from './city-latin.js';
import { LATIN } from './grammar-latin.js';
import { citySpec } from './cityspec.js';
import { fillWard, wardResult, wardTransfer, packCity, packTransfer } from './cityfill.js';

self.onmessage = (e) => {
  const { id, spec } = e.data;
  const S = citySkeleton(citySpec(spec));
  CITY_LATIN.grain = CITY_LATIN.parishGrain(S.pf, () => .5);
  // a copy of the arrays goes with the message (sent, not shared); the wards below read the originals
  const p0 = packCity(S), pk = { ...p0, k: p0.k.slice(), h: p0.h.slice(), unit: p0.unit.slice(), ward: p0.ward.slice(), prc: p0.prc.slice(), ring: p0.ring.slice() };
  self.postMessage({ id, type: 'skeleton', city: pk }, packTransfer(pk));
  const S2 = S, m = S2.markets[0], order = S2.wards.filter((w) => w.cells > 0).map((w) => ({ id: w.id, d: m ? Math.hypot((w.x0 + w.x1) / 2 - m.cx, (w.y0 + w.y1) / 2 - m.cy) : 0 })).sort((a, b) => a.d - b.d);
  // the wards with ground on the market's map (where the party arrives) go first; the page waits for them
  const G = S2.G, mx = Math.floor(m.cx / MW) * MW, my = Math.floor(m.cy / MH) * MH, first = new Set();
  for (let y = Math.max(0, my - 2); y <= Math.min(G.H - 1, my + MH + 1); y++) for (let x = Math.max(0, mx - 2); x <= Math.min(G.W - 1, mx + MW + 1); x++) { const i = y * G.W + x, wd = G.ward[i]; if (wd >= 0 && G.unit[i] !== U.COUNTRY && G.unit[i] !== U.NONE && !isWay(G.k[i]) && !isWater(G.k[i])) first.add(wd); }
  order.sort((a, b) => (first.has(b.id) ? 1 : 0) - (first.has(a.id) ? 1 : 0) || a.d - b.d); let n = 0;
  for (const w of order) { const R = wardResult(fillWard(S2, w.id, LATIN, CITY_LATIN)); self.postMessage({ id, type: 'ward', ward: R }, wardTransfer(R)); if (++n === first.size) self.postMessage({ id, type: 'first' }); }
  self.postMessage({ id, type: 'done' });
};
