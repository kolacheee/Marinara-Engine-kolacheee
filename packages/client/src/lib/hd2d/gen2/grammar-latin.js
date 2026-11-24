// @ts-nocheck
// gen2/grammar-latin.js: the Latin-European grammar (England and the Low Countries, 1450-1550).
// The engine places roles; this file says which building fills each role, how big it is, how many a town has,
// where it wants to stand (social needs) and how streets and plots are cut. Physical needs (doors, water face,
// courts) come from the interior planners' site specs.
import { PLANNERS } from '../buildings.js';

const units = (pl) => [Math.ceil((pl.Wi - 1) / 3), Math.ceil((pl.Di - 1) / 3)];
const cache = new Map();
function fromPlanner(type, opt = {}) {
  const key = type + JSON.stringify(opt); if (cache.has(key)) return cache.get(key);
  const pl = PLANNERS[type]({ seed: 1, ...opt }), s = pl.site, [w, d] = units(pl);
  // doors from the plan itself: every street door on the ground floor, by the wall it is in and the unit it falls in
  const seen = new Set(), doors = [];
  for (const dr of (pl.floors[0].doors || []).filter((q) => q.street)) { const [o, a, b] = String(dr.e).split(',').map((v, i) => i ? +v : v);
    const side = o === 'h' ? (b === 0 ? 'f' : 'b') : (a === 0 ? 'l' : 'r'), along = o === 'h' ? a : b, at = Math.min(Math.floor(along * (o === 'h' ? w / pl.Wi : d / pl.Di)), (o === 'h' ? w : d) - 1);
    if (seen.has(side + at)) continue; seen.add(side + at); doors.push({ side, at, wide: 0 }); }
  for (const x of (s.doors || [])) if (x.what && /water|jib/.test(x.what) && !doors.some((q) => q.side === x.side)) doors.push({ side: x.side, at: x.at, wide: 0 });
  const out = { w, d, storeys: s.storeys, doors, courts: (s.open || []).map((o) => ({ u: o.x ?? 0, v: o.y ?? 0, w: o.w, d: o.d })) };
  cache.set(key, out); return out;
}

// social needs per type, as typed tags the engine scores: { t: feature, w: weight, hard }
// t: market (near the market), onMarket (front on it), main (front on a through street), gate, crossing, edge, inside,
//    outside, water (side touching water), quay, downstream, downwind, high, near (role), far (role), back (off the main street)
const T = {
  worship:   { roles: 'worship', phase: 1, mode: 'precinct', apron: { kind: 'burial', f: 3, b: 3, l: 3, r: 3 }, orient: [{ f: 's', m: 0 }, { f: 'n', m: 1 }],
               req: [{ t: 'market', w: 2.2, first: 1 }, { t: 'inside', hard: 1 }, { t: 'far', role: 'worship', w: 3 }] },   // the first church by the market, later parishes spread through the town
  seat:      { roles: 'seat', phase: 1, mode: 'frontage', req: [{ t: 'onMarket', hard: 1 }, { t: 'market', w: 1 }] },
  marketmark:{ roles: 'marketmark', phase: 1, mode: 'island', apron: { kind: 'market', f: 2, b: 2, l: 2, r: 2 }, req: [{ t: 'inMarket', hard: 1 }, { t: 'marketMid', w: 3 }] },
  lodging:   { roles: 'lodging', phase: 6, mode: 'frontage', req: [{ t: 'main', hard: 1 }, { t: 'gate', w: 1 }, { t: 'market', w: 1.2 }, { t: 'far', role: 'lodging', w: .8 }] },
  mendicant: { roles: 'mendicant', phase: 5, mode: 'precinct', apron: { kind: 'close', f: 5, b: 3, l: 3, r: 3 }, req: [{ t: 'edge', w: 2.5 }, { t: 'gate', w: .8 }, { t: 'inside', hard: 1 }, { t: 'far', role: 'market', w: 1 }, { t: 'south', w: 1.5 }, { t: 'far', role: 'mendicant', w: 2 }] },
  care:      { roles: 'care', phase: 5, mode: 'frontage', req: [{ t: 'gateOrCrossing', w: 3 }, { t: 'main', w: 1 }] },
  learning:  { roles: 'learning', phase: 6, mode: 'frontage', req: [{ t: 'near', role: 'worship', w: 3 }] },
  stronghold:{ roles: 'stronghold', phase: 1, mode: 'precinct', apron: { kind: 'ward', f: 5, b: 4, l: 9, r: 4 }, req: [{ t: 'high', w: 2 }, { t: 'edge', w: 2 }, { t: 'inside', hard: 1 }, { t: 'south', w: 2 }] },
  mill:      { roles: 'mill', phase: 3, mode: 'water', water: 'b', req: [{ t: 'upstream', w: 1 }, { t: 'edge', w: .5 }] },
  noxious:   { roles: 'noxious', phase: 3, mode: 'water', water: 'b', req: [{ t: 'downstream', w: 3 }, { t: 'downwind', w: 2 }, { t: 'edge', w: 1.5 }, { t: 'near', role: 'noxious', w: .8 }] },
  dye:       { roles: 'dye', phase: 3, mode: 'water', water: 'b', req: [{ t: 'downstream', w: 2 }, { t: 'downwind', w: 1 }, { t: 'near', role: 'dye', w: .6 }] },
  brew:      { roles: 'brew', phase: 6, mode: 'frontage', req: [{ t: 'back', w: 2 }, { t: 'waterNear', w: 1 }, { t: 'inside', hard: 1 }, { t: 'far', role: 'brew', w: .6 }] },
  oven:      { roles: 'oven', phase: 6, mode: 'frontage', req: [{ t: 'market', w: 1 }] },
  bath:      { roles: 'bath', phase: 6, mode: 'frontage', req: [{ t: 'gateOrCrossing', w: 1.5 }, { t: 'waterNear', w: 1.5 }] },
  store:     { roles: 'store', phase: 5, mode: 'frontage', req: [{ t: 'outside', hard: 1 }, { t: 'near', role: 'worship', w: 1.2 }] },
  crane:     { roles: 'crane', phase: 3, mode: 'water', water: 'b', req: [{ t: 'quay', hard: 1 }, { t: 'far', role: 'crane', w: 1 }] },
  shaft:     { roles: 'shaft', phase: 3, mode: 'frontage', req: [{ t: 'outside', hard: 1 }, { t: 'high', w: 5 }, { t: 'far', role: 'shaft', w: 2.5 }] },
  smelt:     { roles: 'smelt', phase: 3, mode: 'frontage', req: [{ t: 'downwind', w: 2 }, { t: 'waterNear', w: 1.5 }, { t: 'edge', w: 1 }] },
  meat:      { roles: 'meat', phase: 6, mode: 'frontage', req: [{ t: 'market', w: 2.5 }, { t: 'offMarket', hard: 1 }, { t: 'downwind', w: .5 }] },   // the shambles: off the market, never on it
  alms:      { roles: 'alms', phase: 6, mode: 'frontage', req: [{ t: 'near', role: 'worship', w: 2 }, { t: 'gate', w: .8 }, { t: 'far', role: 'alms', w: 1 }] },
  weigh:     { roles: 'weigh', phase: 1, mode: 'frontage', req: [{ t: 'onMarket', hard: 1 }, { t: 'far', role: 'seat', w: .6 }] },
  tenter:    { roles: 'tenter', phase: 5, mode: 'precinct', apron: { kind: 'tenter', f: 2, b: 4, l: 5, r: 5 }, req: [{ t: 'edge', w: 2 }, { t: 'near', role: 'dye', w: 1.5 }, { t: 'waterNear', w: 1 }, { t: 'far', role: 'market', w: 1 }, { t: 'far', role: 'tenter', w: .6 }] },   // tenter grounds: open, at the town's edge or just outside, by the dyers and fullers
  exchange:  { roles: 'exchange', phase: 1, mode: 'frontage', req: [{ t: 'onMarket', hard: 1 }, { t: 'far', role: 'clothmart', w: .6 }, { t: 'far', role: 'seat', w: .4 }] },
  clothmart: { roles: 'clothmart', phase: 1, mode: 'frontage', req: [{ t: 'onMarket', hard: 1 }, { t: 'far', role: 'seat', w: .6 }, { t: 'far', role: 'weigh', w: .6 }] },
  hall:      { roles: 'hall', phase: 1, mode: 'inner' },   // a range set inside another building's precinct (the castle's hall in its bailey)
  tower:     { roles: 'tower', phase: 6, mode: 'frontage', req: [{ t: 'main', w: 1.5 }, { t: 'market', w: 1 }, { t: 'far', role: 'tower', w: 1 }, { t: 'far', role: 'stronghold', w: 1 }] },   // a stone tower house on a merged plot: the richest merchant's or a lesser lord's town house
  // the city's great buildings (step 4): most stand inside a precinct the skeleton laid out, where only the loose needs (edge, south, near, far) count
  see:       { roles: 'see', phase: 1, mode: 'precinct', apron: { kind: 'burial', f: 4, b: 1, l: 4, r: 3 }, orient: [{ f: 's', m: 0 }, { f: 'n', m: 1 }], req: [{ t: 'south', w: 1 }] },
  abbey:     { roles: 'abbey', phase: 1, mode: 'precinct', apron: { kind: 'close', f: 4, b: 2, l: 3, r: 3 }, orient: [{ f: 's', m: 0 }, { f: 'n', m: 1 }], req: [{ t: 'south', w: 1 }] },
  chapel:    { roles: 'chapel', phase: 6, mode: 'frontage', apron: { kind: 'burial', f: 1, b: 1, l: 1, r: 1 }, req: [{ t: 'far', role: 'worship', w: 3 }, { t: 'main', w: 1 }, { t: 'far', role: 'chapel', w: 2 }] },
  bridgechapel: { roles: 'bridgechapel', phase: 3, mode: 'frontage', req: [{ t: 'gateOrCrossing', w: 6 }, { t: 'waterNear', w: 2 }] },
  warehouse: { roles: 'warehouse', phase: 3, mode: 'frontage', req: [{ t: 'waterNear', w: 3 }, { t: 'near', role: 'warehouse', w: .5 }] },
  mint:      { roles: 'mint', phase: 6, mode: 'frontage', req: [{ t: 'market', w: 1.5 }, { t: 'near', role: 'stronghold', w: 1 }, { t: 'back', w: .5 }] },
  rope:      { roles: 'rope', phase: 5, mode: 'frontage', req: [{ t: 'edge', w: 3 }, { t: 'waterNear', w: 1 }, { t: 'far', role: 'market', w: 1 }] },
  windmill:  { roles: 'windmill', phase: 5, mode: 'frontage', req: [{ t: 'edge', w: 4 }, { t: 'high', w: 2 }, { t: 'far', role: 'windmill', w: 3 }] },
  gate:      { roles: 'gate', phase: 4, mode: 'wall' },
  walltower: { roles: 'walltower', phase: 4, mode: 'wall' },
};

// building types: which role, which planner, footprint variants (w x d units), proxies where no planner exists yet
const TYPES = {
  cathedral:   { role: 'see', opt: (v) => (v === 'P' ? { monastic: 1 } : {}), label: 'Cathedral' },   // P: a monastic cathedral (a priory)
  abbey:       { role: 'abbey', opt: (v) => (v === 'R' ? { ruin: 1 } : {}), label: 'Abbey' },   // R: unroofed after the Dissolution
  mansion:     { role: 'lodging', planner: () => fromPlanner('mansion'), label: 'Great house' },   // a dissolved abbey's ranges made into a house
  bourse:      { role: 'exchange', planner: () => fromPlanner('bourse'), label: 'Exchange' },
  chapel:      { role: 'chapel', planner: () => fromPlanner('chapel'), label: 'Chapel of ease' },
  bridgechapel:{ role: 'bridgechapel', planner: () => fromPlanner('bridgechapel'), label: 'Bridge chapel' },
  warehouse:   { role: 'warehouse', planner: () => fromPlanner('warehouse'), label: 'Warehouse' },
  mint:        { role: 'mint', planner: () => fromPlanner('mint'), label: 'Mint' },
  ropewalk:    { role: 'rope', planner: () => fromPlanner('ropewalk'), label: 'Rope walk' },
  windmill:    { role: 'windmill', planner: () => fromPlanner('windmill'), label: 'Windmill' },
  parish:      { role: 'worship', opt: (v) => ({ bays: v === 'XL' ? 10 : v === 'L' ? 7 : v === 'M' ? 4 : 2, ...(v === 'XL' ? { xl: 1 } : {}) }), label: 'Parish church', apron: (v) => v === 'C' ? { kind: 'burial', f: 1, b: 1, l: 1, r: 1 } : null },   // C: a city church hemmed in by houses, its churchyard a strip
  townhall:    { role: 'seat', planner: () => fromPlanner('townhall') },
  guildhall:   { role: 'seat', planner: () => fromPlanner('guildhall') },
  marketcross: { role: 'marketmark', monument: true, proxy: { '': { w: 2, d: 2, storeys: 1, doors: [], courts: [] } } },
  markethouse: { role: 'marketmark', planner: () => fromPlanner('markethouse'), noDoors: true },
  courtinn:    { role: 'lodging', planner: () => fromPlanner('courtinn') },
  friary:      { role: 'mendicant', opt: (v) => (v === 'R' ? { ruin: 1 } : {}) },
  hospital:    { role: 'care', planner: () => fromPlanner('hospital') },
  school:      { role: 'learning', planner: () => fromPlanner('school') },
  keep:        { role: 'stronghold', planner: () => fromPlanner('keep'), inner: ['castlehall'] },
  castlehall:  { role: 'hall', planner: () => fromPlanner('castlehall') },
  towerhouse:  { role: 'tower', planner: () => fromPlanner('towerhouse') },
  mill:        { role: 'mill', planner: () => fromPlanner('mill') },
  tannery:     { role: 'noxious', planner: () => fromPlanner('tannery') },
  dyeworks:    { role: 'dye', planner: () => fromPlanner('dyeworks') },
  brewhouse:   { role: 'brew', planner: () => fromPlanner('brewhouse') },
  bakehouse:   { role: 'oven', planner: () => fromPlanner('bakehouse') },
  bathhouse:   { role: 'bath', planner: () => fromPlanner('bathhouse') },
  barn:        { role: 'store', planner: () => fromPlanner('barn') },
  cranehouse:  { role: 'crane', planner: () => fromPlanner('cranehouse') },
  windinghouse:{ role: 'shaft', planner: () => fromPlanner('windinghouse') },
  smelter:     { role: 'smelt', planner: () => fromPlanner('smelter') },
  shambles:    { role: 'meat', planner: () => fromPlanner('shambles') },
  almshouse:   { role: 'alms', planner: () => fromPlanner('almshouse') },
  weighhouse:  { role: 'weigh', planner: () => fromPlanner('weighhouse') },
  clothhall:   { role: 'clothmart', planner: () => fromPlanner('clothhall') },
  fullingmill: { role: 'mill', planner: () => fromPlanner('fullingmill') },
  tenterground:{ role: 'tenter', proxy: { '': { w: 2, d: 1, storeys: 1, doors: [], courts: [] } } },
  gate:        { role: 'gate', planner: () => fromPlanner('gate') },
  walltower:   { role: 'walltower', planner: () => fromPlanner('walltower') },
};

const LABEL = { castlehall: 'Castle hall', towerhouse: 'Tower house', clothhall: 'Cloth hall', fullingmill: 'Fulling mill', tenterground: 'Tenter ground', shambles: 'Shambles', almshouse: 'Almshouses', weighhouse: 'Weigh house', townhall: 'Town hall', guildhall: 'Guildhall', marketcross: 'Market cross', markethouse: 'Market house', courtinn: 'Inn', friary: 'Friary', hospital: 'Hospital of St John', school: 'Grammar school', keep: 'Castle keep',
  mill: 'Water mill', tannery: 'Tannery', dyeworks: 'Dye works', brewhouse: 'Brewhouse', bakehouse: 'Common bakehouse', bathhouse: 'Bathhouse', barn: 'Tithe barn', cranehouse: 'Crane house', windinghouse: 'Winding house', smelter: 'Smelter', gate: 'Gatehouse', walltower: 'Wall tower' };

export const LATIN = {
  id: 'latin',
  // way widths in cells
  ways: { main: 3, through: 3, side: 2, back: 1, alley: 1, gateStreet: 2 },
  wallLane: true, backLanes: true, crossLaneEvery: [8, 14],
  // plot series by the way they front: width along the street, depth back from it, the house's depth at the front
  plots: {
    market: { w: [1, 2], d: [7, 10], house: [2, 3], gap: 0 },
    main:   { w: [1, 2], d: [7, 10], house: [2, 3], gap: .02 },
    side:   { w: [1, 2], d: [4, 6], house: [2, 2], gap: .08 },
    back:   { w: [1, 3], d: [3, 4], house: [1, 2], gap: .25 },
    edge:   { w: [2, 3], d: [4, 6], house: [1, 2], gap: .35 },
  },
  merge: .14,             // share of plots taken two at a time by richer households
  hhPerHouse: { market: 1.2, main: 1.1, side: 1, back: 1, edge: 1 },
  market(pf) {            // the market place: shape and size by basis and rank
    const r = pf.rank;
    if (r === 0) return { shape: 'green', w: 9, d: 6 };
    if (pf.basis === 'road') return { shape: 'lens', len: [12, 14, 16, 18][r], wmax: [7, 9, 11, 13][r] };
    if (pf.basis === 'fishing') return { shape: 'strand', w: 14, d: 6 };
    return { shape: 'square', w: [9, 14, 15, 18][r], d: [6, 8, 9, 10][r] };
  },
  roles: T,
  smaller(type, v, city) { if (type === 'abbey') return { type: 'friary', variant: v === 'R' ? 'R' : '' }; if (type === 'cathedral') return v === 'P' ? { type, variant: '' } : { type: 'abbey', variant: '' }; if (type === 'parish') return v === 'XL' ? { type, variant: 'L' } : v === 'L' ? { type, variant: 'M' } : v === 'M' ? { type, variant: 'S' } : v === 'S' && city ? { type, variant: 'C' } : null; if (type === 'townhall' || type === 'guildhall') return { type: 'markethouse', variant: '' }; return null; },
  types: TYPES,
  spec(type, variant = '') {
    const t = TYPES[type]; if (!t) throw new Error('no type ' + type);
    const opt = t.opt ? t.opt(variant) : {}, base = (t.proxy && t.proxy[variant]) || (t.planner ? t.planner(variant) : t.proxy ? t.proxy[''] || t.proxy[Object.keys(t.proxy)[0]] : fromPlanner(type, opt));
    const role = T[t.role];
    return { type, variant, opt, planner: t.proxy && !t.planner && !t.opt ? null : type, label: (t.label || LABEL[type] || type) + (variant === 'R' ? ' (ruined)' : ''), role: t.role, monument: !!t.monument, proxy: !!(t.proxy && t.proxy[variant]) || !t.planner, ...base, doors: t.noDoors ? [] : base.doors,
      phase: role.phase, mode: role.mode, apron: (t.apron && t.apron(variant)) || role.apron || null, orient: role.orient || null, water: role.water || null, req: role.req || [], inner: t.inner || null };
  },
  // how many of each building a town has, from what it is (profile: basis, rank, pop, spec[], region, lord, walled)
  counts(pf, r) {
    const out = [], add = (type, n = 1, variant = '') => { for (let i = 0; i < n; i++) out.push({ type, variant }); };
    const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), en = pf.region !== 'lc', rk = pf.rank, hh = pf.households;
    const has = (s) => (pf.spec || []).includes(s);
    // worship: one parish per ~1,200-1,500 people (planted towns are under-churched; old boroughs over)
    const nW = Math.max(1, Math.round(pf.pop / (pf.planted ? 1600 : 1200)));
    for (let i = 0; i < nW; i++) add('parish', 1, i === 0 ? (has('cloth') || rk >= 3 ? 'L' : rk >= 1 ? 'M' : 'S') : 'S');
    if (rk >= 1) { add(rk >= 2 || r() < .5 ? 'townhall' : 'guildhall'); add(en ? 'marketcross' : 'markethouse'); }
    if (rk >= 1) add('courtinn', ri(1, 2) + (pf.basis === 'road' || pf.basis === 'port' ? 1 : 0) + (rk >= 2 ? 1 : 0));
    if (rk >= 2) add('friary', pf.pop > 2500 ? ri(1, 2) : ri(0, 1));
    if (rk >= 1) add('hospital');
    if (rk >= 1) add('shambles');
    if (rk >= 1) add('almshouse', (r() < .5 ? 1 : 0) + (rk >= 2 ? 1 : 0));
    if (!en && rk >= 1) add('weighhouse');
    if (rk >= 1 && r() < .7) add('school');
    if (pf.lord) add('keep');
    if (rk >= 2 && r() < (en ? .35 : .7)) add('towerhouse');   // a merchant's stone tower (a steen in Flanders): rare in England, common in the Low Countries
    if (pf.water) add('mill', pf.basis === 'bridge' ? 2 : 1);
    if (rk >= 1 && pf.water) add('tannery', has('tanning') ? ri(3, 4) : 1);
    if (has('cloth') && pf.water) add('dyeworks', ri(2, 3));
    if (has('cloth')) { add('tenterground', rk >= 2 ? ri(2, 3) : ri(1, 2)); if (pf.water) add('fullingmill', rk >= 2 ? 2 : 1); if (rk >= 2) add('clothhall'); }   // cloth: stretched on tenters to dry, fulled at the mill, searched and sold at the hall
    add('brewhouse', Math.max(rk >= 1 ? 1 : 0, Math.round(hh / 90)));
    if (rk === 0) add('bakehouse');
    if (!en && rk >= 2) add('bathhouse', ri(1, 2));
    if (rk <= 1 && pf.basis !== 'port' && pf.basis !== 'fishing') add('barn');
    if (pf.basis === 'port') add('cranehouse', ri(1, 2));
    if (pf.basis === 'mining') { add('windinghouse', 2 + rk); add('smelter', rk >= 1 ? 2 : 1); }
    return out;
  },
  // districts the 3D builder dresses houses by (distance to the market in cells, wealth of the map)
  // names for a building's own open ground, by its kind
  apronName: { tenter: 'Tenter ground', burial: 'Churchyard', close: 'Close', ward: 'Castle ward', market: 'Market place' },
  district(dMarket, onWater, outside) { return outside ? 'poor' : onWater ? 'craft' : dMarket <= 8 ? 'rich' : dMarket >= 18 ? 'craft' : 'common'; },
};
