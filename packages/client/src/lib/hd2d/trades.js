// @ts-nocheck
// Working buildings and small civic/defence buildings at their ideal shells (England / Low Countries 1450-1550); towngen will site them by `site.needs`.
//   planBarn, planBakehouse, planBrewhouse, planTannery, planDyeworks, planBathhouse, planMarketHouse, planWallTower, planCraneHouse, planWindingHouse.
// Plan rows run from the door side (y = 0) back; x left -> right seen from outside. One unit = 3 cells (+1).
import { rngOf, spiral, R, door, ewin, plan, props, noStair } from './bkit.js';

const street = (x, a = 0) => door(`h,${x},0`, -1, a, { street: 1 });

// ---- a tithe or town barn: aisled, posts on two rows, opposed cart doors in the middle bay with the threshing floor between them, bays of sheaves either side
export function planBarn(opt = {}) {
  const r = rngOf((opt.seed || 1) * 101 + 3), Wi = 22, Di = 10, E = Wi - 1, N = Di - 1, dc = 10;
  const barn = R(0, 'barn', 0, 0, E, N, { floor: 'earth' }), A = props([barn]), P = A.P, doors = []; for (let x = dc; x <= dc + 2; x++) doors.push(street(x));
  // posts on the two arcade lines; mows of sheaves in the aisles and down the middle of each bay, a walk left beside the posts
  for (const x of [2, 5, 8, 14, 17, 20]) for (const y of [2, 7]) P('post', x, y, 1, 1, 0); for (const y of [2, 7]) P('plate', 0, y, Wi, 1, 0, { walk: 1 });
  P('threshfloor', dc, 1, 3, 8, 0, { walk: 1 }); P('flails', dc + 3, 4, 1, 1, 3);
  const mow = (x, y, w, h) => P('sheaves', x, y, w, h, 0, { reach: 0 });
  for (const [a, b] of [[0, 8], [14, E]]) { for (let x = a; x <= b; x += 2) { const w = Math.min(2, b - x + 1); mow(x, 0, w, 2); mow(x, 8, w, 2); if (r() < .8 && !(x <= 9 && x + w > 8 && false)) mow(x, 4, w, 2); } }
  P('cart', dc + 1, 3, 1, 2, 1); P('sack', dc + 3, 9, 1, 1, 0); P('sack', dc - 1, 9, 1, 1, 0); P('basket', dc - 1, 0, 1, 1, 1);
  const f0 = { f: 0, rooms: [barn], doors, props: A.list, stair: noStair(),
    windows: [{ side: 'b', i: dc + 1, kind: 'shut' }, { side: 'b', i: dc, kind: 'shut' }, { side: 'b', i: dc + 2, kind: 'shut' }, { side: 'l', i: 4, kind: 'loop' }, { side: 'r', i: 4, kind: 'loop' }, { side: 'f', i: 4, kind: 'loop' }, { side: 'f', i: 17, kind: 'loop' }] };
  return plan({ kind: 'barn', tier: 'works', Wi, Di, floors: [f0], names: { barn: 'Barn' }, zone: (f, x) => x >= dc && x <= dc + 2 ? ['Threshing floor', 'Barn'] : null, wallH0: 4.2, stone: true, doorX: dc + 1,
    site: { w: 7, d: 3, storeys: 1, front: 'field', doors: [{ side: 'f', at: 4, wide: 'cart doors' }, { side: 'b', at: 4, wide: 'cart doors' }], needs: ['edge', 'a track to the fields', 'tithe barns stand by the parsonage or the abbey grange'], open: [], rank: '0+, one per parish' } });
}

// ---- the common bakehouse: two great ovens in the back wall, the moulding trough and boards, faggots for firing, flour
export function planBakehouse(opt = {}) {
  const Wi = 10, Di = 7, E = Wi - 1, N = Di - 1, q = R(0, 'bakery', 0, 0, E, N, { floor: 'worn' }), A = props([q]), P = A.P;
  P('oven', 0, N - 1, 2, 2, 0); P('oven', 3, N - 1, 2, 2, 0); P('woodpile', 2, N, 1, 1, 0); P('woodpile', 5, N, 1, 1, 0); P('peels', 6, N, 1, 1, 0); P('trough', 7, 3, 2, 1, 3, { r: 1 });
  P('table', E, 1, 1, 2, 3); P('sack', 0, 0, 1, 1, 2); P('sack', 1, 0, 1, 1, 2); P('bin', 0, 2, 1, 2, 1); P('shelf', E, N, 1, 1, 3); P('basket', E, 0, 1, 1, 3); P('bucket', 7, N, 1, 1, 0);
  const f0 = { f: 0, rooms: [q], doors: [street(4)], props: A.list, stair: noStair(), windows: [{ side: 'f', i: 7, kind: 'win' }, { side: 'l', i: 3, kind: 'win' }, { side: 'r', i: 4, kind: 'win' }] };
  return plan({ kind: 'bakehouse', tier: 'works', Wi, Di, floors: [f0], names: { bakery: 'Common bakehouse' }, stone: true, doorX: 4,
    site: { w: 3, d: 2, storeys: 1, front: 'street', doors: [{ side: 'f', at: 1 }], needs: ['back lane, away from thatch (fire)'], open: [], rank: '1+, one per ward or the lord\'s common oven' } });
}

// ---- a brewhouse: the copper on its furnace, the mash tun, the cooler, fermenting tuns, casks; the malt loft with its kiln above
export function planBrewhouse(opt = {}) {
  const r = rngOf((opt.seed || 1) * 83 + 1), Wi = 13, Di = 10, E = Wi - 1, N = Di - 1, q = R(0, 'brewing', 0, 0, E, N, { floor: 'worn' }), A = props([q]), P = A.P;
  P('copper', 0, N - 1, 2, 2, 0); P('woodpile', 2, N, 1, 1, 0); P('mashtun', 4, N - 1, 2, 2, 0); P('cooler', 7, N - 1, 3, 2, 0); P('tun', 11, N, 1, 1, 0); P('tun', E, N - 2, 1, 1, 3); P('tun', E, N - 4, 1, 1, 3);
  for (let x = 0; x <= 3; x++) P('barrel', x, 0, 1, 1, 2); P('stillage', 0, 3, 1, 2, 1); P('sack', 8, 0, 1, 1, 2); P('sack', 9, 0, 1, 1, 2); P('bucket', 4, 6, 1, 1, 0); if (r() < .6) P('cart', 10, 0, 2, 1, 2);
  const sp = spiral([E, 0], 2, (x, y) => x >= E - 1 && x <= E && y <= 1);
  const f0 = { f: 0, rooms: [q], doors: [street(6)], props: A.list, stair: sp(0), windows: [{ side: 'f', i: 9, kind: 'win' }, { side: 'l', i: 4, kind: 'win' }, { side: 'r', i: 5, kind: 'win' }, { side: 'b', i: 6, kind: 'grate' }] };
  const l = R(0, 'maltloft', 0, 0, E, N, { floor: 'boards' }), B = props([l]), Q = B.P;
  Q('kiln', 0, N - 1, 2, 2, 0); Q('maltfloor', 3, 3, 6, 4, 0, { walk: 1 }); for (const x of [0, 1, 2]) Q('sack', x, 0, 1, 1, 2); Q('sack', 0, 2, 1, 1, 1); Q('basket', 10, N, 1, 1, 0); Q('hoist', 6, 0, 1, 1, 2);
  const f1 = { f: 1, rooms: [l], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'l', i: 4, kind: 'louvre' }, { side: 'r', i: 5, kind: 'louvre' }] };
  return plan({ kind: 'brewhouse', tier: 'works', Wi, Di, floors: [f0, f1], names: { brewing: 'Brewhouse', maltloft: 'Malt loft' }, stone: [0], doorX: 6,
    site: { w: 4, d: 3, storeys: 2, front: 'street', doors: [{ side: 'f', at: 2 }], needs: ['water (a well or the river) helps', 'back lane or inn yard'], open: [], rank: '1+, several (inns and monasteries brew too)' } });
}

// ---- a tannery: the beam house (lime pits, fleshing beams) along the lane, the tan yard of bark pits open behind it, the bark store; hides drying in the loft
export function planTannery(opt = {}) {
  const Wi = 13, Di = 13, E = Wi - 1, N = Di - 1, bh = R(0, 'beamhouse', 0, 0, E, 4, { floor: 'worn' }), yd = R(1, 'tanyard', 0, 5, 8, N, { open: 1, floor: 'yard' }), bs = R(2, 'barkstore', 9, 5, E, N, { floor: 'earth' });
  const rooms = [bh, yd, bs], d0 = [street(6), door('h,3,5', 0, 1), door('h,6,5', 0, 1), door('v,9,8', 1, 2)], A = props(rooms), P = A.P;
  P('pit', 0, 0, 2, 2, 0, { liquor: 'lime' }); P('pit', 3, 0, 2, 2, 0, { liquor: 'lime' }); P('fleshbeam', 8, 0, 2, 1, 2); P('fleshbeam', 10, 3, 2, 1, 0); P('hides', E, 0, 1, 2, 3, { flat: 1 }); P('tub', 0, 3, 1, 1, 1); P('basket', 5, 4, 1, 1, 0);
  for (const [x, y] of [[0, 6], [3, 6], [6, 6], [0, 9], [3, 9], [6, 9]]) P('pit', x, y, 2, 2, 0, { liquor: 'tan' }); P('bucket', 2, N, 1, 1, 0); P('basket', 5, N, 1, 1, 0);
  P('barkheap', 10, 9, 3, 4, 0); P('barkmill', 10, 5, 2, 2, 0); P('sack', E, 7, 1, 1, 3);
  const sp = spiral([E, 4], 2, (x, y) => y <= 4 && x >= E - 1 && x <= E);
  const f0 = { f: 0, rooms, doors: d0, props: A.list, stair: sp(0), windows: [{ side: 'f', i: 3, kind: 'grate' }, { side: 'f', i: 10, kind: 'grate' }, { side: 'l', i: 2, kind: 'grate' }, ewin('h,1,5', 'grate'), ewin('v,9,6', 'grate')] };
  const lf = R(0, 'dryloft', 0, 0, E, 4, { floor: 'boards' }), B = props([lf]), Q = B.P; for (const x of [0, 4, 8]) Q('hides', x, 0, 3, 1, 2); Q('hides', 0, 4, 3, 1, 0); Q('hides', 5, 4, 3, 1, 0);
  const f1 = { f: 1, rooms: [lf], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'f', i: 2, kind: 'louvre' }, { side: 'f', i: 6, kind: 'louvre' }, { side: 'f', i: 10, kind: 'louvre' }, { side: 'l', i: 2, kind: 'louvre' }] };
  return plan({ kind: 'tannery', tier: 'works', Wi, Di, floors: [f0, f1], names: { beamhouse: 'Beam house', tanyard: 'Tan yard', barkstore: 'Bark store', dryloft: 'Drying loft' }, doorX: 6,
    site: { w: 4, d: 4, storeys: 2, front: 'lane', doors: [{ side: 'f', at: 2 }], needs: ['water', 'downstream of the town', 'downwind', 'edge (the stink)'], open: [{ x: 0, y: 2, w: 3, d: 2, what: 'tan yard' }], rank: '1+, a tanners\' row in bigger towns' } });
}

// ---- dye works: dye vats over their fires along the back, woad and madder stores, the rinsing stage open to the water at the back, a tenter frame for the cloth
export function planDyeworks(opt = {}) {
  const Wi = 13, Di = 13, E = Wi - 1, N = Di - 1, dh = R(0, 'dyehouse', 0, 0, E, 6, { floor: 'worn' }), st = R(1, 'stage', 0, 7, E, N, { open: 1, floor: 'boards' });
  const rooms = [dh, st], d0 = [street(6), door('h,3,7', 0, 1), door('h,9,7', 0, 1)], A = props(rooms), P = A.P;
  P('dyevat', 0, 5, 2, 2, 0, { dye: 0x2a4a8a }); P('dyevat', 4, 5, 2, 2, 0, { dye: 0x9a2a24 }); P('dyevat', 10, 5, 2, 2, 0, { dye: 0xc8a030 }); P('woodpile', 2, 6, 1, 1, 0); P('woodpile', 7, 6, 1, 1, 0);
  P('sack', 0, 0, 1, 1, 2); P('sack', 1, 0, 1, 1, 2); P('basket', 2, 0, 1, 1, 2); P('barrel', E, 0, 1, 1, 3); P('barrel', E, 1, 1, 1, 3); P('bale', 9, 0, 1, 1, 2); P('bale', 10, 0, 1, 1, 2); P('table', 0, 2, 1, 2, 1); P('vat', 8, 3, 1, 1, 0); P('bucket', 6, 3, 1, 1, 0);
  P('tenter', 1, 10, 5, 1, 0); P('tenter', 7, 10, 5, 1, 0); P('tub', 0, 8, 1, 1, 1); P('tub', E, 8, 1, 1, 3); P('bucket', 6, 8, 1, 1, 0);
  const f0 = { f: 0, rooms, doors: d0, props: A.list, stair: noStair(), windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: 10, kind: 'win' }, { side: 'l', i: 3, kind: 'win' }, { side: 'r', i: 3, kind: 'win' }] };
  return plan({ kind: 'dyeworks', tier: 'works', Wi, Di, floors: [f0], names: { dyehouse: 'Dye house', stage: 'Rinsing stage' }, doorX: 6, stone: true,
    site: { w: 4, d: 4, storeys: 1, front: 'lane', doors: [{ side: 'f', at: 2 }], needs: ['water at the back (rinsing stage over the river)', 'downstream of the drinking water'], open: [{ x: 0, y: 2, w: 4, d: 2, what: 'stage and tenter ground' }], rank: '1+ in cloth towns' } });
}

// ---- a bathhouse (stews): the furnace and copper heating the water, wooden tubs in a row under cloth canopies, a sweating room, a chamber upstairs
export function planBathhouse(opt = {}) {
  const Wi = 13, Di = 10, E = Wi - 1, N = Di - 1, ent = R(0, 'bathentry', 0, 0, 3, N, { floor: 'worn' }), bath = R(1, 'baths', 4, 0, E, 5, { floor: 'tiles' }), sweat = R(2, 'sweat', 4, 6, 8, N, { floor: 'tiles' }), fur = R(3, 'furnace', 9, 6, E, N, { floor: 'earth' });
  const rooms = [ent, bath, sweat, fur], d0 = [street(1), door('v,4,2', 0, 1), door('h,6,6', 1, 2), door('h,10,6', 1, 3)], A = props(rooms), P = A.P;
  P('rack', 0, 3, 1, 2, 1); P('form', 3, 3, 1, 2, 3); P('chest', 0, 6, 1, 1, 1); P('desk', 3, 0, 1, 1, 3); P('chair', 2, 0, 1, 1, 0);
  for (const x of [4, 7, 11]) P('bathtub', x, 4, 2, 2, 0); P('form', 6, 1, 4, 1, 2); P('bucket', E, 1, 1, 1, 3); P('table', 4, 0, 1, 1, 2);   // tubs along the back wall, curtained behind
  P('form', 4, N, 3, 1, 0); P('form', 8, 7, 1, 3, 3); P('brazier', 5, 7, 1, 1, 0); P('bucket', 4, 7, 1, 1, 1);
  P('copper', 10, N - 1, 2, 2, 0); P('woodpile', E, 7, 1, 1, 3); P('woodpile', 9, N, 1, 1, 0);
  const sp = spiral([0, N], 2, (x, y) => x <= 3);
  const f0 = { f: 0, rooms, doors: d0, props: A.list, stair: sp(0), windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: 7, kind: 'win' }, { side: 'f', i: 10, kind: 'win' }, { side: 'r', i: 8, kind: 'grate' }] };
  const ch = R(0, 'bathchamber', 0, 0, 6, N, { floor: 'floor' }), ch2 = R(1, 'bathchamber', 7, 0, E, N, { floor: 'floor' }), B = props([ch, ch2]), Q = B.P;
  Q('bed', 3, 0, 1, 2, 2); Q('bed', 5, 0, 1, 2, 2); Q('chest', 6, N, 1, 1, 0); Q('table', 3, 5, 2, 1, 0); Q('stool', 3, 6, 1, 1, 2); Q('bed', 8, 0, 1, 2, 2); Q('bed', 10, 0, 1, 2, 2); Q('chest', E, N, 1, 1, 3); Q('washstand', E, 4, 1, 1, 3);
  const f1 = { f: 1, rooms: [ch, ch2], doors: [door('v,7,5', 0, 1)], props: B.list, stair: sp(1), windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: 9, kind: 'win' }, { side: 'l', i: 4, kind: 'win' }] };
  return plan({ kind: 'bathhouse', tier: 'works', Wi, Di, floors: [f0, f1], names: { bathentry: 'Entry', baths: 'Baths', sweat: 'Sweating room', furnace: 'Furnace room', bathchamber: 'Chamber' }, doorX: 1, core: { kind: 'spiral', cells: [[0, N]] },
    site: { w: 4, d: 3, storeys: 2, front: 'street', doors: [{ side: 'f', at: 0 }], needs: ['water (well or river)', 'often by a bridge or the town edge'], open: [], rank: '2+, one or two' } });
}

// ---- a market house standing on its own in the square: an open ground floor on posts sheltering the market (corn, butter, the town beam),
// a room above for the court and the corn store, reached by a stair in the corner
export function planMarketHouse(opt = {}) {
  const Wi = 13, Di = 7, E = Wi - 1, N = Di - 1, q = R(0, 'undercover', 0, 0, E, N, { floor: 'cobble', openSides: 1 }), A = props([q]), P = A.P, d0 = []; for (let x = 0; x <= E; x++) d0.push(street(x));
  for (const x of [3, 6, 9]) P('post', x, 3, 1, 1, 0); P('table', 1, 1, 2, 1, 0, { goods: 'bread' }); P('table', 5, 1, 2, 1, 0); P('table', 1, 5, 2, 1, 0); P('table', 7, 5, 2, 1, 0); P('tron', 10, 1, 2, 1, 0); P('sack', 4, 5, 1, 1, 0); P('basket', 4, 1, 1, 1, 0); P('basket', 10, 5, 1, 1, 0);
  const sp = spiral([E, N], 2, (x, y) => x >= E - 2 && x <= E && y >= N - 1 && y <= N && !(x === E && y === N));
  const f0 = { f: 0, rooms: [q], doors: d0, props: A.list, stair: sp(0), windows: [] };
  const u = R(0, 'courtroom', 0, 0, E, N, { floor: 'boards' }), B = props([u]), Q = B.P;
  Q('longtable', 3, 3, 4, 1, 0, { nochair: 1 }); Q('chair', 4, 4, 1, 1, 2); Q('form', 3, 2, 4, 1, 2); Q('townchest', 0, N, 2, 1, 0); for (const x of [8, 9, 10]) Q('sack', x, 0, 1, 1, 2); Q('sack', E, 2, 1, 1, 3); Q('bin', 0, 0, 2, 1, 2);
  const f1 = { f: 1, rooms: [u], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: 6, kind: 'win' }, { side: 'f', i: 10, kind: 'win' }, { side: 'b', i: 4, kind: 'win' }, { side: 'l', i: 3, kind: 'win' }, { side: 'r', i: 3, kind: 'win' }] };
  return plan({ kind: 'markethouse', tier: 'civic', Wi, Di, floors: [f0, f1], names: { undercover: 'Market house', courtroom: 'Court room' }, doorX: 6, core: { kind: 'spiral', cells: [[E, N]] },
    site: { w: 4, d: 2, storeys: 2, front: 'square', doors: [{ side: 'all', at: 0, what: 'open on posts' }], needs: ['middle of the market place', 'only where there is no guildhall over the market'], open: [], rank: '1 (market towns)' } });
}

// ---- a tower of the town wall: a store at the foot (door from the town side), the guard room with arrow loops and doors out onto the wall walk, the fighting platform on top
export function planWallTower(opt = {}) {
  const Wi = 7, Di = 7, E = Wi - 1, N = Di - 1, sp = spiral([0, N], 3, (x, y) => x <= 2 && y >= N - 2);
  const g = R(0, 'towerstore', 0, 0, E, N, { floor: 'earth' }), A = props([g]), P = A.P;
  P('barrel', E, N, 1, 1, 0); P('barrel', E - 1, N, 1, 1, 0); P('crate', E, N - 2, 1, 1, 3); P('sack', E, 0, 1, 1, 3); P('armsrack', 0, 2, 1, 2, 1); P('basket', 1, 0, 1, 1, 2);
  const f0 = { f: 0, rooms: [g], doors: [street(3)], props: A.list, stair: sp(0), windows: [{ side: 'l', i: 3, kind: 'loop' }, { side: 'r', i: 3, kind: 'loop' }] };
  const gr = R(0, 'guardroom', 0, 0, E, N, { floor: 'boards' }), B = props([gr]), Q = B.P;
  Q('brazier', 3, 3, 1, 1, 0); Q('form', 4, 0, 2, 1, 2); Q('pallet', E, 2, 1, 2, 3); Q('armsrack', 3, N, 2, 1, 0); Q('chest', E, N, 1, 1, 3); Q('bucket', 1, 0, 1, 1, 2);
  const f1 = { f: 1, rooms: [gr], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'l', i: 2, kind: 'shut' }, { side: 'r', i: 2, kind: 'shut' }, { side: 'b', i: 3, kind: 'loop' }, { side: 'f', i: 3, kind: 'win' }, { side: 'b', i: 1, kind: 'loop' }, { side: 'b', i: 5, kind: 'loop' }] };
  const top = R(0, 'fighttop', 0, 0, E, N, { open: 1, floor: 'slate' }), C = props([top]), T = C.P; T('basket', E, N, 1, 1, 0); T('bucket', E, 0, 1, 1, 3);
  const f2 = { f: 2, rooms: [top], doors: [], props: C.list, stair: sp(2), windows: [] };
  return plan({ kind: 'walltower', tier: 'works', Wi, Di, floors: [f0, f1, f2], names: { towerstore: 'Tower store', guardroom: 'Guard room', fighttop: 'Tower top' }, doorX: 3, stone: true, core: { kind: 'spiral', cells: [[0, N]] },
    site: { w: 2, d: 2, storeys: 3, front: 'town side of the wall', doors: [{ side: 'f', at: 1 }, { side: 'l', at: 0, floor: 1, what: 'wall walk' }, { side: 'r', at: 0, floor: 1, what: 'wall walk' }], needs: ['wall', 'every ~10 cells along the wall, at the corners'], open: [], rank: '2+ (walled towns)' } });
}

// ---- a treadwheel crane house on the quay: the great wheel inside, its rope over the jib to the quay; bales and casks waiting
export function planCraneHouse(opt = {}) {
  const Wi = 10, Di = 7, E = Wi - 1, N = Di - 1, q = R(0, 'crane', 0, 0, E, N, { floor: 'boards' }), A = props([q]), P = A.P;
  P('treadwheel', 2, 2, 5, 2, 0); P('bale', 0, 0, 1, 1, 2); P('bale', 1, 0, 1, 1, 2); P('barrel', E, 0, 1, 1, 3); P('crate', E, 1, 1, 1, 3); P('rope', 0, N, 2, 1, 0); P('chest', E, N, 1, 1, 3);
  const f0 = { f: 0, rooms: [q], doors: [street(5)], props: A.list, stair: noStair(), windows: [{ side: 'b', i: 4, kind: 'shut' }, { side: 'b', i: 5, kind: 'shut' }, { side: 'l', i: 3, kind: 'win' }, { side: 'r', i: 4, kind: 'win' }] };
  return plan({ kind: 'cranehouse', tier: 'works', Wi, Di, floors: [f0], names: { crane: 'Crane house' }, doorX: 5, wallH0: 4.4,
    site: { w: 3, d: 2, storeys: 1, front: 'quay street', doors: [{ side: 'f', at: 1 }, { side: 'b', at: 1, what: 'jib over the water' }], needs: ['quay', 'back to the water'], open: [], rank: 'ports, 1-2' } });
}

// ---- a pithead winding house: the windlass over the shaft with its rail, kibbles and ore baskets, the tools, the reeve's corner with his tally board
export function planWindingHouse(opt = {}) {
  const Wi = 10, Di = 7, E = Wi - 1, N = Di - 1, q = R(0, 'pithead', 0, 0, E, N, { floor: 'earth' }), A = props([q]), P = A.P;
  P('shaft', 3, 3, 2, 2, 0); P('basket', 1, 3, 1, 1, 1); P('basket', 1, 4, 1, 1, 1); P('oreheap', 7, 4, 2, 2, 0); P('toolrack', 0, N, 2, 1, 0); P('bucket', 6, 3, 1, 1, 0);
  P('desk', E, 0, 1, 1, 3); P('stool', E - 1, 0, 1, 1, 1); P('chest', E, 2, 1, 1, 3); P('timber', 0, 0, 2, 1, 2);
  const f0 = { f: 0, rooms: [q], doors: [street(5)], props: A.list, stair: noStair(), windows: [{ side: 'l', i: 3, kind: 'win' }, { side: 'r', i: 4, kind: 'win' }] };
  return plan({ kind: 'windinghouse', tier: 'works', Wi, Di, floors: [f0], names: { pithead: 'Winding house' }, doorX: 5,
    site: { w: 3, d: 2, storeys: 1, front: 'any', doors: [{ side: 'f', at: 1 }], needs: ['over a shaft', 'spoil heap and ore floor beside it'], open: [], rank: 'mining towns, one per shaft' } });
}
