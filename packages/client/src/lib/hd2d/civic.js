// @ts-nocheck
// Civic interiors (stage 7), England / Low Countries 1450-1550, planned inside the shells the town gives them.
// planGuild: the guildhall on the square (towngen placeGuild, 7 x 5 units behind its front arcade, two storeys). Two kinds by seed:
//   'guild'  a fraternity guildhall: almshouse beds in the undercroft opening onto the guild chapel at its east end, the great hall above
//   'town'   a market house / town hall: the undercroft is market and store space with the toll house and a lock-up, the hall above is the court
//   Both: hall at first floor, reached by a newel stair in an enclosed corner bay at the low (west) end, a timber screen with a gallery over the
//   screens passage, the dais at the high (east) end with the high table, and beyond it the council chamber and the treasury with the town chest.
// planKeep: a tower keep / tower house (no shell in the demo town yet): entrance and stores with the well, hall and chamber, great chamber and
//   chapel, garrison and armoury at the top; a spine wall divides every floor, a newel stair in one corner climbs through all of them.
// One unit = 3 cells (+1), as for houses. Plan rows run from the street (y = 0) northward; x runs west -> east, so the high end and the altar are on the right.
import { rngOf } from './interior.js';

const spiral = (core, st) => (f) => { const c = core.cells[0], nbs = [[c[0] + 1, c[1]], [c[0], c[1] + 1], [c[0], c[1] - 1]].filter(([x, y]) => x >= 0 && y >= 0);
  return { block: f < st - 1 ? [c] : [], well: f === st - 1 ? [c] : [], wellUp: f > 0, nbs, need: [], one: true }; };
const mkP = (props, roomOf) => (type, x, y, w, h, rot, more = {}) => { props.push({ type, room: roomOf(x, y), x, y, w, h, rot, ...more }); };

export function planGuild(gh, opt = {}) {
  const r = rngOf((opt.seed || 1) * 613 + 7), W = gh && gh.w || 7, D = 5, Wi = 3 * W + 1, Di = 3 * D + 1, st = 2;
  const kind = opt.kind || (r() < .5 ? 'guild' : 'town'), E = Wi - 1, N = Di - 1;
  const doorX = Math.floor((Wi - 1) / 2);   // the door in the middle of the arcade
  const core = { kind: 'spiral', cells: [[0, 0]] }, sp = spiral(core, st);
  // ---- ground floor: the stair bay in the south-west corner, a store behind it; the undercroft; (town hall) toll house and lock-up at the east end
  const R0 = [], room = (id, t, x0, y0, x1, y1) => { const q = { id, t, x0, y0, x1, y1 }; R0.push(q); return q; };
  room(0, 'stairbay', 0, 0, 2, 3); room(1, 'store', 0, 4, 2, N);
  const ux1 = kind === 'town' ? E - 4 : E; room(2, 'undercroft', 3, 0, ux1, N);
  if (kind === 'town') { room(3, 'gaol', ux1 + 1, 0, E, 4); room(4, 'tollhouse', ux1 + 1, 5, E, N); }
  const in0 = (x, y) => R0.find((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1)?.id ?? 2;
  const d0 = [{ e: `h,${doorX},0`, x: doorX, y: 0, street: 1, a: -1, b: 2 }], D0 = (e, a, b) => d0.push({ e, a, b });
  D0('v,3,2', 0, 2); D0(`h,1,4`, 0, 1); d0.push({ e: 'h,1,0', x: 1, y: 0, street: 1, a: -1, b: 0 });   // the stair turret has its own door from the street: the hall is reached without passing through the undercroft
  if (kind === 'town') { D0(`v,${ux1 + 1},2`, 2, 3); D0(`v,${ux1 + 1},${N - 2}`, 2, 4); }
  const p0 = [], P0 = mkP(p0, in0);
  // two rows of oak posts carry the hall floor: on the bay lines, clear of the door's alley
  const postY = [5, 10];
  for (let x = 6; x < ux1; x += 3) for (const y of postY) if (Math.abs(x - doorX) > 1) P0('post', x, y, 1, 1, 0);
  if (kind === 'guild') {
    // the almshouse: beds in a row along the back wall and between the posts, the chapel at the east end behind an open screen, its altar on the east wall
    const chX = E - 5;
    for (let x = 4; x < chX - 1; x += 2) P0('bed', x, N - 1, 1, 2, 0, { who: 'almsfolk' });
    for (let x = 4; x < chX - 1; x += 3) if (x + 1 < doorX - 1 || x > doorX + 1) P0('bed', x, 1, 1, 2, 2, { who: 'almsfolk' });
    P0('chest', 3, 7, 1, 1, 1); P0('table', 3, 12, 1, 2, 1); P0('stool', 4, 12, 1, 1, 0);
    for (let y = 0; y <= N; y++) if (y < 6 || y > 9) P0('parclose', chX, y, 1, 1, 1);
    P0('altar', E, 7, 1, 2, 3); P0('footpace', E - 1, 6, 1, 4, 3, { walk: 1 }); P0('candlestand', E - 1, 5, 1, 1, 0); P0('candlestand', E - 1, 10, 1, 1, 0);
    P0('image', E, N, 1, 1, 0); P0('image', E, 0, 1, 1, 2); P0('form', chX + 2, N, 2, 1, 0); P0('form', chX + 2, 0, 2, 1, 2);
  } else {
    // market and store space: wool sacks, cloth bales and casks along the walls, the town beam for weighing, trestles for market day
    const goods = ['sack', 'bale', 'barrel', 'crate'];
    for (let x = 4; x < ux1; x += 1) if (r() < .7 && !postY.some((py) => py === N - 1)) P0(goods[Math.floor(r() * goods.length)], x, N, 1, 1, 0);
    for (let x = 4; x < ux1; x += 1) if ((x < doorX - 2 || x > doorX + 2) && r() < .5) P0(goods[Math.floor(r() * goods.length)], x, 0, 1, 1, 2);
    P0('tron', doorX - 1, 7, 2, 1, 0);
    const wares = ['grocer', 'draper', 'shoemaker', 'cutler', 'baker', 'chandler'];   // market day: trestle stalls between the posts, each with its goods, baskets beside them
    for (const x of [5, 13]) for (const y of [3, 12]) if (x + 1 < ux1) { P0('table', x, y, 2, 1, y === 3 ? 0 : 2, { goods: wares[Math.floor(r() * wares.length)] }); if (r() < .7) P0('basket', x + 2, y, 1, 1, 0); } P0('table', 5, 7, 2, 1, 0, { goods: 'grocer' }); P0('table', ux1 - 2, 7, 2, 1, 0, { goods: 'grocer' });
    // the lock-up: a stout room with the stocks and a pallet; the toll house: the clerk of the market's desk, the town's weights, a chest
    P0('stocks', ux1 + 2, 0, 2, 1, 2); P0('pallet', E, 2, 1, 2, 3);
    P0('desk', E, 8, 1, 1, 3); P0('stool', E - 1, 8, 1, 1, 0); P0('scales', E, N, 1, 1, 0); P0('chest', ux1 + 1, N, 1, 1, 0); P0('shelf', E - 1, N, 1, 1, 0);
  }
  P0('woodpile', 0, N, 1, 1, 0); P0('barrel', 2, N, 1, 1, 0); P0('crate', 0, N - 3, 1, 1, 1);
  const w0 = [{ side: 'b', i: 1 }, { side: 'l', i: 9 }, ...(kind === 'town' ? [{ side: 'r', i: 10 }] : [{ side: 'r', i: 7, kind: 'lancet' }, { side: 'r', i: 8, kind: 'lancet' }])];   // the almshouse chapel's east window over its altar
  for (let x = 4; x < Wi - 2; x += 3) w0.push({ side: 'b', i: x });
  if (kind === 'town') w0.push({ side: 'r', i: 2, kind: 'grate' });
  const f0 = { f: 0, rooms: R0, doors: d0, windows: w0.map((w) => ({ kind: 'win', ...w })), props: p0, stair: sp(0) };

  // ---- first floor: the hall (screens passage, hall, dais), the council chamber beyond the dais, the treasury off the council chamber
  const hx1 = E - 6, R1 = [{ id: 0, t: 'hall', x0: 0, y0: 0, x1: hx1, y1: N }, { id: 1, t: 'council', x0: hx1 + 1, y0: 5, x1: E, y1: N }, { id: 2, t: 'treasury', x0: hx1 + 1, y0: 0, x1: E, y1: 4 }];
  const in1 = (x, y) => x <= hx1 ? 0 : y >= 5 ? 1 : 2, d1 = [{ e: `v,${hx1 + 1},${N - 2}`, a: 0, b: 1 }, { e: `h,${hx1 + 3},5`, a: 2, b: 1 }];
  const p1 = [], P1 = mkP(p1, in1), scr = 3;
  // the screen across the low end, two openings, the gallery over the passage; the passage keeps the stair head clear
  for (let y = 0; y <= N; y++) if (y !== 2 && y !== N - 2) P1('hallscreen', scr, y, 1, 1, 1, { end: y === 0 ? 's' : y === N ? 'n' : '' });
  // the dais: a raised floor across the high end, the high table on it facing down the hall, the chair of state, the cloth of estate behind
  const dx0 = hx1 - 2; P1('dais', dx0, 1, 3, N - 1, 0, { walk: 1 });
  P1('hightable', hx1 - 1, 5, 1, 6, 3); P1('chairstate', hx1, 7, 1, 1, 3); P1('form', hx1, 9, 1, 2, 3); P1('form', hx1, 4, 1, 2, 3); P1('hanging', hx1, 5, 1, 6, 3, { walk: 1 });
  P1('sideboard', dx0 + 1, N, 2, 1, 0, { goods: 'plate' }); P1('chest', hx1, 0, 1, 1, 2);
  // side tables along both long walls with forms on the wall side only; the fireplace on the back wall toward the dais
  for (const x of [scr + 2, scr + 6]) { P1('longtable', x, N - 1, 3, 1, 0, { nochair: 1 }); P1('form', x, N, 2, 1, 0); if (x === scr + 2) P1('form', x + 2, N, 1, 1, 0); }
  P1('fireplace', dx0 - 2, N, 2, 1, 0); for (const x of [scr + 2, scr + 6]) { P1('longtable', x, 1, 3, 1, 2, { nochair: 1 }); P1('form', x, 0, 3, 1, 2); }
  P1('candlestand', dx0 - 1, 1, 1, 1, 0); P1('candlestand', scr + 1, N - 4, 1, 1, 0);
  if (kind === 'town') { P1('bar', dx0 - 1, 4, 1, 8, 1, { walk: 0 }); P1('desk', dx0, 3, 1, 1, 1); }
  // council chamber: the table with forms round it, benches along the walls, a fireplace, a press for the books
  P1('longtable', hx1 + 3, 9, 1, 3, 1, { nochair: 1 }); P1('form', hx1 + 2, 9, 1, 3, 1); P1('form', hx1 + 4, 9, 1, 3, 3); P1('chairstate', hx1 + 3, 12, 1, 1, 2);
  P1('form', hx1 + 2, N, 2, 1, 0); P1('form', E, 7, 1, 2, 3); P1('fireplace', E, 10, 1, 2, 3); P1('cupboard', hx1 + 5, N, 1, 1, 0); P1('hanging', hx1 + 1, N, 3, 1, 0, { walk: 1, doom: 1 });
  // treasury: the town chest with its three locks, the plate coffer, a press for the charters
  P1('townchest', hx1 + 1, 0, 2, 1, 2); P1('coffer', E, 0, 1, 1, 2); P1('cupboard', E, 3, 1, 1, 3);
  const w1 = [];
  for (let u = 0; u < W; u++) w1.push({ side: 'f', i: 3 * u + 1, kind: 'win' });
  for (const x of [5, 8, 11]) w1.push({ side: 'b', i: x, kind: 'win' });
  w1.push({ side: 'r', i: 7, kind: 'win' }, { side: 'b', i: E - 1, kind: 'win' }, { side: 'l', i: 8, kind: 'win' });
  const f1 = { f: 1, rooms: R1, doors: d1, windows: w1, props: p1, stair: sp(1) };
  const ZN = { stairbay: 'Stair turret', store: 'Store', undercroft: kind === 'guild' ? 'Almshouse' : 'Market hall', gaol: 'Lock-up', tollhouse: 'Toll house', hall: kind === 'guild' ? 'Guild hall' : 'Town hall', council: 'Council chamber', treasury: 'Treasury' };
  const zone = (f, x, y) => { if (f === 0 && kind === 'guild' && x >= E - 5 && x > 2) return ['Guild chapel', 'Undercroft'];
    if (f === 1 && x <= hx1) return x < scr ? ['Screens passage', 'Hall'] : x >= dx0 ? ['Dais', 'High end of the hall'] : null; return null; };
  return { H: { id: 'guild', W, D, st, gable: false }, kind: 'guildhall', civic: kind, tier: 'civic', Wi, Di, st, P: [], floors: [f0, f1], yard: null, core, doorX, trade: null, wallH0: null,
    zone, roomNames: ZN, checks: { ok: true, fails: [] },
    site: { w: W, d: D, storeys: 2, front: 'square', doors: [{ side: 'f', at: Math.floor(W / 2), what: 'undercroft, under the arcade' }, { side: 'f', at: 0, what: 'stair turret to the hall' }],
      needs: ['square (the market under and before it)', 'stair turret drawn at the low (west) end, rising above the eaves', kind === 'guild' ? 'east window for the almshouse chapel' : 'lock-up and toll house at the east end'], open: [], rank: kind === 'guild' ? '1+, one per guild in big towns' : '1+, one' } };
}

export function planKeep(opt = {}) {
  const r = rngOf((opt.seed || 1) * 389 + 3), W = opt.W || 6, D = opt.D || 6, Wi = 3 * W + 1, Di = 3 * D + 1, st = 4, E = Wi - 1, N = Di - 1;
  const sx = Math.floor(Wi / 2);   // the spine wall: west half / east half
  const core = { kind: 'spiral', cells: [[0, N]] }, sp = spiral(core, st), doorX = Math.max(2, sx - 4);
  const two = (f, a, b) => [{ id: 0, t: a, x0: 0, y0: 0, x1: sx - 1, y1: N }, { id: 1, t: b, x0: sx, y0: 0, x1: E, y1: N }];
  const spine = (ys) => ys.map((y) => ({ e: `v,${sx},${y}`, a: 0, b: 1 }));
  const inR = (x) => x < sx ? 0 : 1;
  const floors = [];
  // ground: the entrance with the porter / guard, the stores with the well
  { const p = [], P = mkP(p, inR);
    P('form', 0, 3, 1, 2, 1); P('table', 1, 6, 2, 1, 1); P('stool', 3, 6, 1, 1, 0); P('armsrack', 0, 9, 1, 2, 1); P('brazier', 4, 10, 1, 1, 0); P('chest', sx - 1, 0, 1, 1, 2); P('pallet', sx - 1, 12, 1, 2, 3);
    P('well', sx + 3, 8, 1, 1, 0); for (let x = sx + 1; x < E; x++) P(r() < .5 ? 'barrel' : 'sack', x, N, 1, 1, 0); for (let y = 2; y < N - 1; y += 2) P(r() < .5 ? 'barrel' : 'crate', E, y, 1, 1, 3);
    P('sack', sx + 1, 0, 1, 1, 2); P('sack', sx + 2, 0, 1, 1, 2); P('stillage', sx + 4, 0, 2, 1, 2);
    floors.push({ f: 0, rooms: two(0, 'guard', 'stores'), doors: [{ e: `h,${doorX},0`, x: doorX, y: 0, street: 1, a: -1, b: 0 }, ...spine([4])], props: p,
      windows: [{ side: 'f', i: 2, kind: 'grate' }, { side: 'l', i: 8, kind: 'grate' }, { side: 'r', i: 9, kind: 'grate' }], stair: sp(0) }); }
  // first floor: the hall, its high table on a dais across the far (north) end, and the chamber through the spine wall
  { const p = [], P = mkP(p, inR);
    P('dais', 1, N - 2, sx - 2, 3, 0, { walk: 1 }); P('hightable', 2, N - 1, 4, 1, 0); P('chairstate', 3, N, 1, 1, 0); P('hanging', 2, N, 4, 1, 0, { walk: 1 });
    P('longtable', 1, 8, 1, 3, 1, { nochair: 1 }); P('form', 0, 8, 1, 3, 1); P('longtable', sx - 2, 8, 1, 3, 3, { nochair: 1 }); P('form', sx - 1, 8, 1, 3, 3);
    P('fireplace', 0, 4, 1, 2, 1); P('sideboard', sx - 1, 3, 1, 2, 3, { goods: 'plate' }); P('candlestand', 3, 5, 1, 1, 0);
    P('kingbed', E - 1, N - 1, 2, 2, 0); P('chest', sx, N, 1, 1, 0); P('table', E, 6, 1, 2, 3); P('chair', E - 1, 6, 1, 1, 1); P('closestool', E, 0, 1, 1, 2); P('fireplace', sx + 3, 0, 2, 1, 2);
    floors.push({ f: 1, rooms: two(1, 'hall', 'chamber'), doors: spine([N - 3]), props: p,
      windows: [{ side: 'f', i: 3, kind: 'win' }, { side: 'l', i: 6, kind: 'win' }, { side: 'l', i: 11, kind: 'win' }, { side: 'b', i: E - 3, kind: 'win' }, { side: 'r', i: 8, kind: 'win' }], stair: sp(1) }); }
  // second floor: the great chamber (the lord's bed, chests, a table) and the chapel with its altar on the east wall
  { const p = [], P = mkP(p, inR);
    P('greatbed', 1, 1, 2, 2, 2); P('chest', 0, 6, 1, 1, 1); P('chest', 0, 7, 1, 1, 1); P('cupboard', sx - 1, 0, 1, 1, 2); P('table', 3, 9, 2, 1, 0); P('chair', 3, 10, 1, 1, 2); P('fireplace', sx - 1, 6, 1, 2, 3); P('closestool', 0, 0, 1, 1, 2);
    const ac = Math.floor(Di / 2) - 1; P('altar', E, ac, 1, 2, 3); P('footpace', E - 1, ac - 1, 1, 4, 3, { walk: 1 }); P('candlestand', E - 1, ac - 2, 1, 1, 0); P('candlestand', E - 1, ac + 3, 1, 1, 0); P('image', E, N, 1, 1, 0); P('sedilia', E - 3, 0, 2, 1, 2);
    floors.push({ f: 2, rooms: two(2, 'great', 'chapel'), doors: spine([N - 3]), props: p,
      windows: [{ side: 'f', i: 3, kind: 'win' }, { side: 'l', i: 6, kind: 'win' }, { side: 'r', i: ac, kind: 'lancet' }, { side: 'r', i: ac + 1, kind: 'lancet' }, { side: 'b', i: E - 3, kind: 'win' }], stair: sp(2) }); }
  // top floor: the garrison's lodging (a handful of men, pallets and a chest each) and the armoury (racks of bills and pikes, harness, crossbows)
  { const p = [], P = mkP(p, inR), men = 4 + Math.floor(r() * 4);
    for (let i = 0; i < men; i++) { const y = 1 + (i % 4) * 3, x = i < 4 ? 0 : sx - 1; P('pallet', x, y, 1, 2, i < 4 ? 1 : 3); }
    P('table', 2, 7, 2, 1, 0); P('form', 2, 6, 2, 1, 2); P('chest', 2, N, 1, 1, 0); P('chest', 3, N, 1, 1, 0); P('brazier', 3, 3, 1, 1, 0);
    for (let x = sx + 1; x < E; x += 2) P('armsrack', x, N, 2, 1, 0); for (let y = 2; y < N - 3; y += 3) P('armsrack', E, y, 1, 2, 3); P('chest', sx, 0, 1, 1, 2); P('coffer', sx + 1, 0, 1, 1, 2); P('grindstone', sx + 4, 6, 1, 1, 0);
    floors.push({ f: 3, rooms: two(3, 'garrison', 'armoury'), doors: spine([N - 3]), props: p,
      windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: E - 2, kind: 'win' }, { side: 'l', i: 9, kind: 'win' }, { side: 'r', i: 9, kind: 'win' }], stair: sp(3) }); }
  const ZN = { guard: 'Guard room', stores: 'Stores', hall: 'Hall', chamber: 'Chamber', great: 'Great chamber', chapel: 'Chapel', garrison: 'Garrison', armoury: 'Armoury' };
  const zone = (f, x, y) => f === 1 && x < sx && y >= N - 2 ? ['Dais', 'High end of the hall'] : null;
  return { H: { id: 'keep', W, D, st, gable: false }, kind: 'keep', tier: 'civic', Wi, Di, st, P: [], floors, yard: null, core, doorX, trade: null, wallH0: null, stoneWalls: true,
    zone, roomNames: ZN, checks: { ok: true, fails: [] },
    site: { w: W, d: D, storeys: st, front: 'bailey or street', doors: [{ side: 'f', at: Math.floor(W / 2) }], needs: ['walled towns of rank 2+ or a castle ward', 'a bailey or courtyard round it', 'highest ground in the town'], open: [], rank: '2+, one (castle) or a tower house for the richest family' } };
}
