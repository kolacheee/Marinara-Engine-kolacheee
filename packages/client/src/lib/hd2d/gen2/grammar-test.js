// @ts-nocheck
// gen2/grammar-test.js: a made-up grammar that shares no building with the Latin one. It exists to prove the engine
// is culture-neutral: every role is filled with plain boxes, streets and plots are cut differently, no walls lane.
const box = (w, d, doors = [{ side: 'f', at: w >> 1 }], courts = []) => ({ w, d, storeys: 1, doors, courts });
const T = {
  worship:    { phase: 2, mode: 'precinct', apron: { kind: 'forecourt', f: 4, b: 1, l: 1, r: 1 }, orient: [{ f: 'e', m: 0 }, { f: 'e', m: 1 }], req: [{ t: 'market', w: 3 }, { t: 'inside', hard: 1 }] },
  seat:       { phase: 2, mode: 'precinct', apron: { kind: 'court', f: 2, b: 2, l: 2, r: 2 }, req: [{ t: 'high', w: 2 }, { t: 'inside', hard: 1 }] },
  marketmark: { phase: 1, mode: 'island', apron: { kind: 'market', f: 1, b: 1, l: 1, r: 1 }, req: [{ t: 'inMarket', hard: 1 }, { t: 'marketMid', w: 2 }] },
  lodging:    { phase: 6, mode: 'frontage', req: [{ t: 'gate', w: 3 }, { t: 'main', hard: 1 }] },
  care:       { phase: 5, mode: 'frontage', req: [{ t: 'near', role: 'worship', w: 2 }] },
  noxious:    { phase: 3, mode: 'frontage', req: [{ t: 'outside', hard: 1 }, { t: 'downwind', w: 3 }] },
  gate:       { phase: 4, mode: 'wall' },
  walltower:  { phase: 4, mode: 'wall' },
};
const TYPES = {
  prayerhall: { role: 'worship', b: box(9, 7, [{ side: 'f', at: 4 }], [{ u: 2, v: 0, w: 5, d: 2 }]) },
  residence:  { role: 'seat', b: box(8, 8, [{ side: 'f', at: 4 }], [{ u: 2, v: 2, w: 4, d: 4 }]) },
  fountain:   { role: 'marketmark', b: box(1, 1, []) },
  caravanyard:{ role: 'lodging', b: box(6, 6, [{ side: 'f', at: 3 }], [{ u: 1, v: 1, w: 4, d: 4 }]) },
  healing:    { role: 'care', b: box(5, 4) },
  kilns:      { role: 'noxious', b: box(4, 3) },
  gate:       { role: 'gate', b: box(6, 3, []) },
  walltower:  { role: 'walltower', b: box(2, 2, []) },
};
export const TESTG = {
  id: 'test',
  ways: { main: 2, through: 2, side: 1, back: 1, alley: 1 },
  wallLane: false, backLanes: false, crossLaneEvery: [5, 7],
  plots: { market: { w: [2, 3], d: [3, 4], house: [3, 4], gap: 0 }, main: { w: [2, 3], d: [3, 5], house: [3, 5], gap: 0 }, side: { w: [2, 3], d: [3, 4], house: [3, 4], gap: .05 },
           back: { w: [2, 3], d: [3, 3], house: [3, 3], gap: .1 }, edge: { w: [3, 4], d: [3, 4], house: [2, 3], gap: .3 } },
  merge: .05, hhPerHouse: { market: 1, main: 1, side: 1, back: 1, edge: 1 },
  market(pf) { return { shape: 'square', w: 8, d: 5 }; },
  roles: T, types: TYPES,
  smaller() { return null; },
  spec(type, variant = '') { const t = TYPES[type], role = T[t.role];
    return { type, variant, role: t.role, monument: false, proxy: true, ...t.b, phase: role.phase, mode: role.mode, apron: role.apron || null, orient: role.orient || null, water: null, req: role.req || [] }; },
  counts(pf) { const o = [{ type: 'prayerhall' }, { type: 'fountain' }, { type: 'healing' }];
    if (pf.rank >= 1) o.push({ type: 'caravanyard' }, { type: 'kilns' }); if (pf.rank >= 2) o.push({ type: 'residence' }); return o; },
  district(d) { return d <= 8 ? 'rich' : 'common'; },
};
