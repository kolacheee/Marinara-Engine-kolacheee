// @ts-nocheck
// ──────────────────────────────────────────────
// The town index (fork): what the Engine needs from a generated HD-2D town, and where the world's own town
// (its named places, hall, workplaces and homes, worldgen W8b) stands in it.
// A building is keyed town-wide: "b<id>" a planned building (church, inn, guildhall ...), "p<plot>" a house.
// The same spec and the same world town give the same placing on every visit: a city's wards round its
// main market are filled before the index is read, whatever the party walked through first.
// ──────────────────────────────────────────────
import { townOf } from './gen2/adapt.js';
import { MW, MH } from './gen2/grid.js';
import { landmarks, quarter } from './gen2/citynav.js';
import { CITY_LATIN } from './gen2/city-latin.js';

/** What a world building's words ask of a planned building, by the planned building's type. */
const WANTS = [
  [/inn|tavern|alehouse|hostel|lodg/, /courtinn|inn|brewhouse/],
  [/temple|church|chapel|shrine|cathedral|abbey|monaster|priory|friar|sanctuar|worship/, /cathedral|parish|abbey|friary|priory|chapel|monastery/],
  [/hospital|healer|infirm|apothec|clinic|alms/, /hospital|almshouse|leper/],
  [/school|library|college|academ|scholar|study/, /school|college/],
  [/barrack|garrison|watch|gaol|jail|prison|guard|keep|castle/, /castle|towerhouse|keep|gate/],
  [/warehouse|granary|store/, /warehouse|barn/],
  [/tanner|leather/, /tannery/],
  [/miller|mill/, /windmill|mill/],
  [/baker|bakery/, /bakehouse/],
  [/butcher|shambles/, /shambles/],
  [/brewer|brewery/, /brewhouse/],
  [/dyer|dye/, /dyeworks/],
  [/weaver|cloth|draper/, /clothhall|tenter/],
  [/mint|coin|money/, /mint|bourse/],
  [/merchant|trader|exchange/, /bourse|clothhall|warehouse/],
  [/hall|council|mayor|guild|court|seat|elder/, /guildhall|townhall|hall/],
];

/** A label in running text: lower case, but a saint's name keeps its capitals. */
const lc = (label) => label.replace(/^[A-Z][a-z]/, (m) => m.toLowerCase());
/** The plural of a label's head word: inns, tanneries, parish churches, hospitals of St John, shambles. */
const pluralWord = (w) => (/s$/.test(w) ? w : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : /(ch|sh|x)$/.test(w) ? w + 'es' : w + 's');
const plural = (label) => (/ of /.test(label) ? label.replace(/^(.*?)([a-z]+)( of .*)$/, (m, a, w, b) => a + pluralWord(w) + b) : label.replace(/([a-z]+)$/, pluralWord));
const wordsOf = (b) => `${b.name || ''} ${b.role || ''} ${b.use || ''} ${b.kind === 'landmark' ? 'hall' : ''}`.toLowerCase();

/** The town generator's spec as the scene builds it (the same object shape, so one cached town serves both). */
export const g2specOf = (S) => ({ seed: +S.seed, basis: S.basis || 'market', rank: Math.min(2, +S.rank || 0), planted: !!S.planted, ground: S.ground || 'hill', gen: 2, multi: true, region: S.region || 'en', specs: S.trade ? [S.trade] : [], cpop: S.cpop || 0, csite: S.csite || 'river', lake: !!(S.lake || S.csite === 'lake'), cyear: S.cyear || 1500, cflags: S.cflags || '' });

/** The town's index: its planned buildings and house lots town-wide, its quarters and landmarks. */
export function townIndex(spec) {
  const T = townOf(spec), { Q, gm } = T, city = !!T.L;
  const [mw, mh] = T.maps;
  const mk = Q.market ? { x: Q.market.cx, y: Q.market.cy } : { x: (mw * MW) / 2, y: (mh * MH) / 2 };
  if (city) T.L.ensure(Math.floor(mk.x - MW * 1.5), Math.floor(mk.y - MH * 1.5), Math.floor(mk.x + MW * 1.5), Math.floor(mk.y + MH * 1.5));
  const S = city ? Q.city.S : null;
  const quarters = new Map();
  const qOf = (w) => { if (!S || w == null || w < 0) return null; if (!quarters.has(w)) quarters.set(w, quarter(S, CITY_LATIN, w, S.pf.flags)); return quarters.get(w); };
  const blds = city ? T.L.buildings : Q.buildings;
  const greats = [];
  for (const b of blds) {
    if (b.role === 'gate' || b.role === 'walltower' || b.monument) continue;
    if (!b.doors || !b.doors.some((d) => !d.water)) continue;
    const sp = gm.spec(b.type, b.variant) || {};
    if (!sp.planner && !b.planner) continue;
    greats.push({ key: 'b' + b.id, type: b.type, role: b.role, label: sp.label || b.type, ruin: b.variant === 'R', x: b.cx, y: b.cy, ward: b.ward ?? -1, d: Math.hypot(b.cx - mk.x, b.cy - mk.y) });
  }
  const lots = T.lots.map((L) => ({ key: 'p' + L.plot, plot: L.plot, street: L.street, dist: L.dist, x: L.x + L.w / 2, y: L.y + L.d / 2, ward: L.ward ?? -1, d: Math.hypot(L.x + L.w / 2 - mk.x, L.y + L.d / 2 - mk.y) }));
  greats.sort((a, b) => a.d - b.d || (a.key < b.key ? -1 : 1));
  lots.sort((a, b) => a.d - b.d || (a.key < b.key ? -1 : 1));
  const marks = S ? landmarks(S, T.L, CITY_LATIN) : [];
  return {
    spec, city, maps: T.maps, market: mk, greats, lots, quarterOf: qOf,
    quarters: S ? S.wards.filter((w) => w.cells > 0).map((w) => qOf(w.id)).filter(Boolean) : [],
    landmarks: marks, gates: S ? S.gates.length : Q.gates.filter((g) => !g.water).length,
    pop: city ? Q.pf.pop : Q.pf.pop, walled: !!Q.pf.walled, basis: Q.pf.basis,
  };
}

/** Where each of the world town's buildings stands in the 3D town: key -> world building id, and back.
 *  Named places first, then the hall, the workplaces, the homes (the named people's first); each takes the
 *  nearest planned building its words ask for, else the nearest free house (places and work on the market
 *  and main streets first). A world building with no room left stays off the 3D map. */
/** What the town's chronicle did to a house lot: 'burnt', 'empty' or ''. The same rule as the scene's lotFate
 *  (town-scene.js), so a house the scene draws boarded up or burned is never given to the world's people. */
export function lotFate(seed, chron, lot) {
  if (!chron) return '';
  const h01 = (k) => ((Math.imul(k + 1, 2654435761) ^ Math.imul(+seed + 977, 40503)) >>> 0) / 4294967296;
  const k = lot.plot * 3;
  if (lot.dist !== 'rich' && lot.dist !== 'ware' && h01(k + 1) < (chron.ruined || 0)) return 'burnt';
  if (['common', 'poor', 'craft', 'cottage', 'miner'].includes(lot.dist) && h01(k + 2) < (chron.empty || 0) / .85) return 'empty';
  return '';
}

export function placeWorldTown(index, worldTown, chron = null) {
  const byKey = new Map(), byWorld = new Map();
  if (!worldTown) return { byKey, byWorld };
  const named = new Set(worldTown.people.filter((p) => p.named).map((p) => p.id));
  const order = { place: 0, landmark: 1, work: 2, home: 3 };
  const list = [...worldTown.buildings].sort((a, b) => order[a.kind] - order[b.kind]
    || (b.people.some((id) => named.has(id)) ? 1 : 0) - (a.people.some((id) => named.has(id)) ? 1 : 0)
    || (a.id < b.id ? -1 : 1));
  const used = new Set();
  const front = new Set(['square', 'main', 'market']);
  for (const wb of list) {
    const words = wordsOf(wb);
    let pick = null;
    if (wb.kind !== 'home') {
      const want = WANTS.find(([w]) => w.test(words));
      if (want) pick = index.greats.find((g) => !used.has(g.key) && !g.ruin && want[1].test(g.type));
    }
    if (!pick) {
      const lots = index.lots.filter((l) => !used.has(l.key) && !lotFate(index.spec.seed, chron, l));
      pick = (wb.kind !== 'home' ? lots.find((l) => front.has(l.street)) : null) ?? (wb.kind === 'home' ? lots.find((l) => !front.has(l.street)) : null) ?? lots[0] ?? null;
    }
    if (!pick) continue;
    used.add(pick.key); byKey.set(pick.key, wb.id); byWorld.set(wb.id, pick.key);
  }
  return { byKey, byWorld };
}

/** The town as the Game Master is told it: its size, market, quarters and landmarks, gates. */
export function townBrief(index) {
  const parts = [];
  const pop = Math.round((index.pop || 0) / 50) * 50;
  parts.push(index.city ? `A walled city of about ${pop.toLocaleString('en')} people.` : `A ${index.walled ? 'walled town' : index.basis === 'fishing' ? 'fishing village' : (index.pop || 0) < 400 ? 'village' : 'town'} of about ${pop} people.`);
  const kinds = new Map();
  for (const g of index.greats) if (!g.ruin) kinds.set(g.label, (kinds.get(g.label) || 0) + 1);
  const ruins = index.greats.filter((g) => g.ruin).map((g) => g.label);
  const named = [...kinds].map(([label, n]) => (n > 1 ? `${n} ${plural(lc(label))}` : lc(label)));
  if (named.length) parts.push(`${index.city ? 'Round the main market' : 'In town'}: ${named.slice(0, 14).join(', ')}.`);
  if (ruins.length) parts.push(`Ruins: ${[...new Set(ruins)].map(lc).join(', ')}.`);
  if (index.quarters.length) parts.push(`Quarters: ${index.quarters.slice(0, 12).map((q) => `${q.name} (${q.trade})`).join(', ')}.`);
  const marks = [...new Set(index.landmarks.filter((l) => l.h >= 1.4).map((l) => l.name))];
  if (marks.length) parts.push(`Landmarks seen across the city: ${marks.slice(0, 8).join(', ')}.`);
  if (index.gates) parts.push(`${index.gates} gate${index.gates > 1 ? 's' : ''} in the walls.`);
  return parts.join(' ').slice(0, 1500);
}

/** The words for a building the party walks into, when the world never named it. */
export function spotWords(index, key, info = {}) {
  const g = index.greats.find((each) => each.key === key);
  const q = index.quarterOf(g ? g.ward : info.ward);
  const where = q ? ` in ${q.name}` : info.street ? ` on ${info.street}` : '';
  if (g) return `the ${lc(g.label)}${where}`;
  const kind = info.empty ? 'an empty house' : info.inn ? 'an alehouse' : info.shop ? (q ? `a ${q.trade.replace(/s$/, '')}'s shop` : 'a shop') : 'a house';
  return `${kind}${where}`.slice(0, 120);
}
