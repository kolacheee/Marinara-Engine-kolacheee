// @ts-nocheck
// gen2/city-latin.js: the Latin-European city grammar (England and the Low Countries, 1450-1550) for the city skeleton.
// The engine (city2.js) knows rings, roads, markets, precincts, plan units and wards; this file says how a city of
// this culture grew, which institutions its status brings, how big they are and how many of each.
// Named real places are only used by the real-world seed (spec.real); fictional cities go by their status flags.

const lerp = (t, a) => { // piecewise over the table columns 5k, 10k, 20k, 40k
  const P = [5000, 10000, 20000, 40000]; if (t <= P[0]) return a[0]; if (t >= P[3]) return a[3];
  for (let i = 0; i < 3; i++) if (t <= P[i + 1]) { const f = (t - P[i]) / (P[i + 1] - P[i]); return a[i] + (a[i + 1] - a[i]) * f; } return a[3]; };
const range = (pop, lo, hi, r) => Math.round(lerp(pop, lo) + (lerp(pop, hi) - lerp(pop, lo)) * r());

export const CITY_LATIN = {
  id: 'latin',
  personsPerHousehold: 4.2,
  // flags a fictional city gets when the world does not say (rates by region)
  flags(pf, r) {
    const en = pf.region === 'en', big = pf.pop >= 10000;
    return {
      bishop: pf.flags.bishop ?? r() < (en ? (big ? .55 : .3) : (big ? .3 : .12)),
      university: pf.flags.university ?? (pf.pop >= 9000 && r() < .12),
      port: pf.flags.port ?? pf.site === 'coast',
      staple: pf.flags.staple ?? (pf.pop >= 12000 && r() < (en ? .2 : .45)),
      county: pf.flags.county ?? (en && r() < .7),
      seat: pf.flags.seat ?? r() < (en ? .15 : .35),
      cloth: pf.flags.cloth ?? r() < (en ? .5 : .75),
      monastic: pf.flags.monastic ?? (en && r() < .3),   // a cathedral run by monks (Norwich, Canterbury) instead of a secular close
    };
  },
  // the real-world seed: institutions only where they really were (named places)
  real: { university: ['Oxford', 'Cambridge', 'Leuven'], bishopLC: ['Utrecht'], bourse: [['Antwerp', 1531]] },
  suburbShare: (pf, r) => .15 + r() * .3 + (pf.region === 'lc' ? .05 : 0),
  // growth history as data: plan units and wall rings in order. share = share of the intramural ground.
  history(pf, r) {
    const rings = pf.pop >= 9000 || r() < .3 ? 2 : 1;
    const planned = r() < (pf.region === 'en' ? .55 : .35);
    return {
      core: { share: rings === 2 ? .28 : .45, era: 'c. 900' },
      planned: planned ? { share: .14, era: 'c. 1100' } : null,
      rings: rings === 2
        ? [{ era: 'c. 1250', share: .55, fate: pf.region === 'lc' && pf.site !== 'plain' ? 'canal' : 'street' }, { era: 'c. 1350', share: 1, fate: 'wall' }]
        : [{ era: 'c. 1250', share: 1, fate: 'wall' }],
      villages: Math.round(pf.pop / 9000 + r() * 1.5),
    };
  },
  // ground per household in cells (streets, yards and gardens included) by plan unit, and open ground inside the walls
  density: { core: 9.5, planned: 11, growth: 12.5, suburb: 14, village: 15 },
  openInside: (r) => .18 + r() * .14,
  gates: (pf, r) => range(pf.pop, [4, 4, 6, 7], [6, 8, 10, 14], r),
  markets(pf, r) {
    const n = range(pf.pop, [1, 2, 3, 6], [2, 4, 6, 10], r), o = [{ type: 'main' }];
    if (pf.site !== 'plain') o.push({ type: 'fish', near: 'water' });
    o.push({ type: 'cattle', near: 'gate', outside: 1 });
    const more = ['corn', pf.flags.cloth ? 'cloth' : 'wool', 'hay', 'timber', 'poultry', 'butter', 'horse'];
    while (o.length < n) o.push({ type: more[o.length - 3] || 'corn' });
    return o.slice(0, Math.max(n, 1));
  },
  marketSize: { main: (pop) => [Math.round(14 + pop / 1500), Math.round(9 + pop / 3500)], fish: () => [12, 7], cattle: () => [18, 14], other: () => [11, 8] },
  // precincts in the skeleton: outline size in cells, where they want to be, how many
  precincts(pf, r) {
    const o = [], add = (type, n, w, h, zone) => { for (let i = 0; i < n; i++) o.push({ type, w: w[0] + Math.floor(r() * (w[1] - w[0] + 1)), h: h[0] + Math.floor(r() * (h[1] - h[0] + 1)), zone }); };
    const P = pf.pop, F = pf.flags;
    if (F.bishop) { add(F.monastic ? 'cathedral priory' : 'cathedral close', 1, [Math.round(40 + P / 1500), Math.round(52 + P / 1200)], [Math.round(32 + P / 2000), Math.round(42 + P / 1600)], 'core'); o[o.length - 1].core = F.monastic ? [37, 29] : [37, 27]; }
    if (F.seat || F.county || r() < .4) add('castle', 1, [30, 40], [26, 34], 'wall');
    if (F.seat && pf.pop >= 12000) add('palace', 1, [26, 34], [22, 28], 'growth');
    add('friary', range(P, [2, 3, 4, 5], [3, 5, 6, 8], r), [22, 26], [24, 28], 'ring1');
    add('monastery', range(P, [1, 1, 2, 5], [2, 3, 5, 10], r), [36, 44], [34, 40], 'belt'); for (const q of o) if (q.type === 'monastery') q.core = [29, 30];   // the abbey's box clear of the seams; the precinct may run over them
    // a beguinage is sized by its beguines (one small house and garden to about one and a half, the church, the green, the lanes)
    if (pf.region === 'lc') for (let i = range(P, [1, 1, 1, 2], [1, 2, 2, 3], r); i > 0; i--) { const n = Math.round(Math.min(160, 30 + P / 400) * (.5 + r() * .5)), a = Math.sqrt(n * 9 + 320); o.push({ type: 'beguinage', w: Math.round(a * 1.15), h: Math.round(a * .9), zone: 'belt', n }); }
    add('hospital', range(P, [1, 1, 2, 3], [2, 3, 4, 6], r), [14, 18], [12, 15], 'gate');
    add('leper house', range(P, [1, 1, 2, 2], [1, 2, 2, 4], r), [14, 16], [12, 14], 'far');
    if (P >= 10000) { add('great church', 1, [27, 29], [19, 21], 'core'); o[o.length - 1].core = [25, 16]; }   // the great town church and its churchyard beside the main market (St Mary Redcliffe, St Botolph's, St Bavo's)
    if (F.university) add('college', range(P, [2, 3, 4, 6], [3, 5, 7, 10], r), [20, 26], [18, 24], 'core');
    if (F.staple || F.port) add("merchants' house", 1, [16, 22], [14, 18], 'water');
    return o;
  },
  // who lives outside ordinary households (step 4): clergy, inmates, scholars and garrisons in their precincts, travellers
  // in the inns, vagrants sleeping rough. Counts per precinct are late-medieval (houses had shrunk since 1300).
  residents: { friary: [15, 35], monastery: [25, 60], 'cathedral close': [30, 70], 'cathedral priory': [50, 100], castle: [10, 40], palace: [30, 80],
    college: [20, 60], 'great church': [3, 10], hospital: [10, 30], 'leper house': [5, 15], "merchants' house": [20, 60], beguinage: [0, 0] },
  lodging: ['courtinn'],
  // the Dissolution (England only, a year gate): what became of a religious house after its suppression. Friaries went in 1538,
  // the great abbeys in 1539, the monastic cathedrals were refounded with secular deans and chapters in 1540-41.
  // parish: the abbey church bought by the town for its parish church, the claustral ranges pulled down; mansion: the ranges made
  // into a great house; ruin: unroofed and quarried; houses: the site cut into tenements and gardens; reused: a hall or a store.
  dissolution: { friary: 1538, monastery: 1539, 'cathedral priory': 1540 },
  fate(p, pf, r) { if (pf.region === 'lc' || pf.real?.noDissolution) return null; const y = this.dissolution[p.type]; if (!y || pf.year < y) return null; const x = r();
    if (p.type === 'cathedral priory') return 'secular';
    if (p.type === 'monastery') return x < .25 ? 'parish' : x < .6 ? 'mansion' : 'ruin';
    return x < .45 ? 'houses' : x < .75 ? 'ruin' : 'reused'; },
  afterFate: { secular: [30, 70], parish: [2, 6], mansion: [12, 30], ruin: [0, 0], houses: [0, 0], reused: [0, 2] },   // public inns: travellers sleep here
  people(pf, precs, r) { const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), communal = {};
    for (const p of precs) { const [a, b] = (p.fate ? this.afterFate[p.fate] : this.residents[p.type]) || [0, 0]; communal[p.type] = (communal[p.type] || 0) + ri(a, b); }
    const nComm = Object.values(communal).reduce((a, b) => a + b, 0);
    const travellers = Math.round(pf.pop * (.007 + r() * .008)), rough = Math.round(pf.pop * (.005 + r() * .01));
    // beguines live in their own small houses inside the beguinage: households of about 1.5, outside the wards' count
    const beguines = precs.filter((p) => p.type === 'beguinage').map((p) => p.n || ri(40, 120)), poorShare = .03 + r() * .04;
    // refugees only come from an event (worldgen or history: war, famine, flood): they lodge with the poor and put up shacks at the edges
    const refugees = Math.round(pf.refugees || 0), hhPeople = pf.pop - nComm - travellers - rough - beguines.reduce((a, b) => a + b, 0);
    const households = Math.round(hhPeople / this.personsPerHousehold), refHH = Math.round(refugees / this.personsPerHousehold);
    return { communal, nComm, travellers, rough, beguines, refugees, poorShare: Math.min(.4, poorShare + refHH / Math.max(1, households)), households }; },
  // what fills a precinct outline: its buildings (proxies from the planners there are until step 4b brings the new ones), the households
  // of the houses inside it (canons, beguines, lay servants) and whether a wall rings it
  precinctPlan(p, pf, r, beguines = 0) { const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), en = pf.region !== 'lc', L = (type, variant = '') => ({ type, variant });
    const lay = Math.round(p.w * p.h / 26);   // households a dissolved site cut into tenements holds
    switch (p.fate) {
      case 'parish': return { list: [L('abbey', 'N')], hh: ri(Math.round(lay * .3), Math.round(lay * .5)), wall: false, plots: 'growth' };   // the church kept, the ranges gone, houses on the precinct
      case 'mansion': return { list: [L('mansion'), L('barn'), L('abbey', 'R')], hh: ri(0, 3), wall: true };
      case 'ruin': return { list: p.type === 'friary' ? [L('friary', 'R')] : [L('abbey', 'R'), L('barn')], hh: ri(0, 2), wall: true };
      case 'houses': return { list: [], hh: ri(Math.round(lay * .5), Math.round(lay * .8)), wall: false, plots: 'growth' };
      case 'reused': return { list: [L('friary')], hh: ri(1, 4), wall: false, plots: 'growth' };
      case 'secular': return { list: [L('cathedral', 'P'), L('guildhall'), L('almshouse'), L('school')], hh: ri(8, 18), wall: true, plots: 'close' };   // the monks' ranges kept, the canons' houses built in the old precinct
    }
    switch (p.type) {
      case 'friary': return { list: [L('friary')], hh: 0, wall: true };
      case 'monastery': return { list: [L('abbey'), L('barn'), L('brewhouse'), L('bakehouse')], hh: ri(0, 4), wall: true };
      case 'cathedral close': return { list: [L('cathedral'), L('guildhall'), L('almshouse'), L('school')], hh: ri(12, 26), wall: true, plots: 'close' };   // the guildhall stands in for the bishop's palace until it has its own plan; the canons' houses round the green
      case 'cathedral priory': return { list: [L('cathedral', 'P'), L('guildhall'), L('barn'), L('brewhouse')], hh: ri(2, 6), wall: true };
      case 'castle': return { list: [L('keep'), L('barn')], hh: 0, wall: false };
      case 'palace': return { list: [L('guildhall'), L('courtinn'), L('barn')], hh: ri(0, 3), wall: true };
      case 'college': return { list: [L('school'), L('parish', 'S')], hh: 0, wall: true };
      case 'hospital': return { list: [L('hospital')], hh: 0, wall: true };
      case 'leper house': return { list: [L('hospital')], hh: 0, wall: true };
      case "merchants' house": return { list: [L('courtinn'), L('warehouse'), L('warehouse')], hh: 0, wall: true };   // the Hanse kontor or the staple: hall and lodgings round the yard, the storehouses
      case 'great church': return { list: [L('parish', 'XL')], hh: 0, wall: false };
      case 'beguinage': return { list: [L('parish', 'S')], hh: Math.round(beguines / 1.5), wall: true, plots: 'beguinage' };
      default: return { list: [], hh: 0, wall: true }; } },
  // the buildings one ward needs (precincts come from the skeleton): parishes by the parish grain, the civic buildings
  // in the ward that holds the main market, inns on the gate roads, trades by households and by the water
  wardBuildings(w, ctx, r) {
    const out = [], add = (type, n = 1, variant = '') => { for (let i = 0; i < n; i++) out.push({ type, variant }); }, ri = (a, b) => a + Math.floor(r() * (b - a + 1));
    const pop = w.hh * this.personsPerHousehold, en = ctx.region !== 'lc', F = ctx.flags, sub = (w.units.suburb || 0) > w.cells * .6;
    const nP = Math.max(sub ? 0 : 1, Math.round(pop / ctx.grain + (r() - .5) * .6));
    for (let i = 0; i < nP; i++) add('parish', 1, i === 0 && !sub && pop > 2000 ? 'M' : 'S');   // the great town church by the main market
    if (sub && nP === 0 && pop > 300 && r() < .6) add('chapel');                                     // a chapel of ease for a suburb far from its parish church
    if (ctx.bridge && ctx.gateRoad && r() < .25) add('bridgechapel');   // on the main road's bridge, not every footbridge
    if (ctx.mainMarket && F.bourse) add('bourse');   // the exchange: Antwerp's of 1531 and its like, never before
    if (ctx.mainMarket && (F.mint || F.bishop && r() < .5 || ctx.cityPop >= 20000)) add('mint');
    if (ctx.port && ctx.water && (sub || ctx.belt) && r() < .3) add('ropewalk');
    if (ctx.port && ctx.water && !sub && r() < .5) add('warehouse', ri(1, 2));
    if ((ctx.belt || sub) && r() < (ctx.region === 'lc' ? .7 : .2)) add('windmill', ctx.region === 'lc' ? ri(1, 2) : 1);
    if (ctx.mainMarket) { add(en ? 'guildhall' : 'townhall'); add(en ? 'marketcross' : 'markethouse'); add('shambles'); if (!en) add('weighhouse'); if (F.cloth) add('clothhall'); }
    add('courtinn', Math.round(w.hh / 220 + (ctx.gateRoad ? 1 : 0) + (sub ? 1 : 0) * r()));
    add('almshouse', Math.round(w.hh / 300 * r() * 2));
    if (ctx.mainMarket || r() < .15) add('school');
    if (!en && r() < .35) add('towerhouse'); else if (en && !sub && r() < .12) add('towerhouse');
    add('brewhouse', Math.round(w.hh / 110));
    if (!en && r() < .4) add('bathhouse');
    if (ctx.water) { if (ctx.downstream) add('tannery', ri(1, 2)); if (F.cloth && r() < .6) add('dyeworks', ri(1, 2)); if (r() < .4) add(F.cloth && r() < .5 ? 'fullingmill' : 'mill'); }
    if (F.cloth && (ctx.belt || sub) && r() < .6) add('tenterground', ri(1, 2));
    // cranes on the quays come with the quay furniture (step 4): a building on a city quay would cut the quay
    return out;
  },
  // plot series in a city by the ward's ground: an old core is built up tight (narrow deep-fronted tenements, several
  // households a house); later growth like a town; suburbs looser. hh = households per house by the way it fronts
  cityPlots: {
    core: { plots: { market: { w: [1, 2], d: [5, 7], house: [3, 4], gap: 0 }, main: { w: [1, 2], d: [5, 7], house: [3, 4], gap: 0 }, side: { w: [1, 2], d: [4, 5], house: [2, 3], gap: .03 }, back: { w: [1, 2], d: [3, 4], house: [2, 2], gap: .08 }, edge: { w: [1, 2], d: [4, 5], house: [2, 2], gap: .15 } },
      hh: { market: 1.6, main: 1.5, side: 1.3, back: 1.2, edge: 1.1 }, side: [60, 24] },
    growth: { plots: { market: { w: [1, 2], d: [6, 8], house: [2, 3], gap: 0 }, main: { w: [1, 2], d: [6, 9], house: [2, 3], gap: .02 }, side: { w: [1, 2], d: [4, 6], house: [2, 2], gap: .06 }, back: { w: [1, 2], d: [3, 4], house: [1, 2], gap: .15 }, edge: { w: [1, 3], d: [4, 6], house: [1, 2], gap: .25 } },
      hh: { market: 1.4, main: 1.3, side: 1.15, back: 1.1, edge: 1 }, side: [70, 30] },
    beguinage: { plots: { market: { w: [1, 1], d: [3, 4], house: [1, 2], gap: 0 }, main: { w: [1, 1], d: [3, 4], house: [1, 2], gap: 0 }, side: { w: [1, 1], d: [3, 4], house: [1, 2], gap: 0 }, back: { w: [1, 1], d: [3, 3], house: [1, 1], gap: 0 }, edge: { w: [1, 1], d: [3, 4], house: [1, 2], gap: 0 } },
      hh: { market: 1, main: 1, side: 1, back: 1, edge: 1 }, side: [40, 20] },   // a beguine's house: one room up, one down, its garden behind
    close: { plots: { market: { w: [2, 3], d: [5, 7], house: [3, 3], gap: 0 }, main: { w: [2, 3], d: [5, 7], house: [3, 3], gap: 0 }, side: { w: [2, 3], d: [5, 6], house: [2, 3], gap: 0 }, back: { w: [2, 2], d: [4, 5], house: [2, 2], gap: 0 }, edge: { w: [2, 3], d: [5, 6], house: [2, 3], gap: 0 } },
      hh: { market: 1, main: 1, side: 1, back: 1, edge: 1 }, side: [60, 30] },   // a canon's house: hall and chambers on a broad plot, its garden behind
    suburb: { plots: { market: { w: [1, 2], d: [6, 8], house: [2, 3], gap: .02 }, main: { w: [1, 2], d: [5, 8], house: [2, 3], gap: .05 }, side: { w: [1, 2], d: [4, 5], house: [1, 2], gap: .1 }, back: { w: [1, 2], d: [3, 4], house: [1, 2], gap: .2 }, edge: { w: [1, 2], d: [4, 6], house: [1, 2], gap: .15 } },
      hh: { market: 1.2, main: 1.15, side: 1.05, back: 1, edge: 1.05 }, side: [80, 34] },
  },
  parishGrain: (pf, r) => pf.region === 'en' && !pf.planted ? 300 + r() * 300 : 3000 + r() * 5000,
  wardCells: 7000,   // about 2.8 maps of 52 x 48 per ward
  // finding the way (citynav.js): what stands up over the roofs, what you steer by on the street, how quarters differ
  nav: {
    landmark: { cathedral: { kind: 'cathedral', h: 3, name: 'Cathedral' }, abbey: { kind: 'abbey', h: 2, name: 'Abbey' }, abbeyR: { kind: 'ruin', h: 1, name: 'Abbey ruins' }, parishXL: { kind: 'church', h: 2, name: 'Great church' },
      parishM: { kind: 'church', h: 1.3 }, parishL: { kind: 'church', h: 1.5 }, parish: { kind: 'church', h: 1 }, parishS: { kind: 'church', h: 1 }, parishC: { kind: 'church', h: 1 }, keep: { kind: 'castle', h: 1.6, name: 'Castle' },
      friary: { kind: 'steeple', h: .8, name: 'Friary' }, windmill: { kind: 'mill', h: .8, name: 'Windmill' }, guildhall: { kind: 'hall', h: .9, name: 'Guildhall' }, townhall: { kind: 'belfry', h: 1.4, name: 'Town hall belfry' } },
    precinct: { 'cathedral close': { kind: 'cathedral', h: 3, name: 'Cathedral' }, 'cathedral priory': { kind: 'cathedral', h: 3, name: 'Cathedral' }, castle: { kind: 'castle', h: 1.6, name: 'Castle' }, 'great church': { kind: 'church', h: 2, name: 'Great church' }, monastery: { kind: 'abbey', h: 2, name: 'Abbey' } },
    waymark: ['parish', 'chapel', 'cathedral', 'friary', 'marketcross', 'markethouse', 'conduit', 'bridgechapel', 'guildhall', 'townhall', 'clothhall', 'weighhouse'],
    market: { main: 'Market place', fish: 'Fish market', cattle: 'Cattle market', corn: 'Corn market', cloth: 'Cloth market', wool: 'Wool market', hay: 'Haymarket', timber: 'Timber market', poultry: 'Poultry market', butter: 'Butter market', horse: 'Horse fair' },
    // materials by plan unit: the old core in stone and slate, the later town in timber and plaster, the suburbs thatched
    looks: {
      core: [{ walls: ['plaster_cream', 'plaster_white'], roofs: ['roof_slate', 'roof_slate', 'roof_terra'], ground: ['ashlar', 'ashlar', 'plaster'], timber: .35 }, { walls: ['plaster_ochre', 'plaster_cream'], roofs: ['roof_slate', 'roof_terra'], ground: ['ashlar', 'plaster'], timber: .45 }],
      planned: [{ walls: ['plaster_white', 'plaster_rose'], roofs: ['roof_terra', 'roof_terra', 'roof_slate'], ground: ['plaster', 'ashlar'], timber: .6 }, { walls: ['brick', 'plaster_cream'], roofs: ['roof_terra', 'roof_brown'], ground: ['brick', 'plaster'], timber: .3 }],
      growth: [{ walls: ['plaster_ochre', 'plaster_cream'], roofs: ['roof_terra', 'roof_brown'], ground: ['plaster'], timber: .65 }, { walls: ['plaster_rose', 'plaster_white'], roofs: ['roof_terra', 'roof_terra', 'roof_slate'], ground: ['plaster', 'ashlar'], timber: .55 }, { walls: ['brick', 'brick', 'plaster_white'], roofs: ['roof_brown', 'roof_terra'], ground: ['brick'], timber: .25 }],
      suburb: [{ walls: ['plaster_white', 'plaster_cream'], roofs: ['roof_thatch', 'roof_thatch', 'roof_brown'], ground: ['plaster'], timber: .5 }, { walls: ['plaster_ochre', 'plaster_white'], roofs: ['roof_thatch', 'roof_brown', 'roof_brown'], ground: ['plaster'], timber: .4 }],
    },
    // a quarter's chief trade (the signs over its shops take its colour)
    trades: [{ name: 'mercers', sign: 'cloth_teal', unit: ['core', 'planned'] }, { name: 'goldsmiths', sign: 'cloth_ochre', unit: ['core'] }, { name: 'drapers', sign: 'cloth_red', flag: 'cloth' }, { name: 'weavers', sign: 'cloth_linen', flag: 'cloth', unit: ['growth', 'suburb'] },
      { name: 'cordwainers', sign: 'cloth_green', unit: ['growth', 'planned'] }, { name: 'butchers', sign: 'cloth_red', unit: ['growth', 'core'] }, { name: 'bakers', sign: 'cloth_linen' }, { name: 'smiths', sign: 'cloth_ochre', unit: ['suburb', 'growth'] },
      { name: 'tanners', sign: 'cloth_ochre', unit: ['suburb'] }, { name: 'coopers', sign: 'cloth_green', unit: ['suburb', 'growth'] }, { name: 'fishmongers', sign: 'cloth_teal', flag: 'port' }, { name: 'chandlers', sign: 'cloth_linen', unit: ['growth', 'planned'] }],
  },
  datesOK: { bastion: 1540, pesthouse: 1550, bourse: 1531, dissolution: [1536, 1548] },
};
