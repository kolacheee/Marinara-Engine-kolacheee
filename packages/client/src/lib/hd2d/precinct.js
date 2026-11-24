// @ts-nocheck
// Buildings round courts, at their ideal shells (towngen will be rebuilt round them). England / Low Countries 1450-1550.
//   planCourtInn: a great inn. Street range with the carriage way through it, tap room and parlour either side; a galleried side range
//                 (kitchen and buttery below, guest chambers off the gallery above); stables and coach house across the back of the yard.
//   planFriary, planHospital, planSchool: see each function.
// Plan rows run from the street (y = 0) back; x left -> right as seen from the street. One unit = 3 cells (+1).
import { rngOf, spiral, R, door, wins, ewin, plan, props, noStair } from './bkit.js';

const U = (c) => Math.ceil(c / 3);

export function planCourtInn(opt = {}) {
  const r = rngOf((opt.seed || 1) * 331 + 3), W = 5, Wi = 16, E = Wi - 1;
  const fy1 = 5, yy0 = 6, yy1 = 17, sy0 = 18, Di = 22, N = Di - 1, ax0 = 6, ax1 = 8, sw = 3;   // front range rows 0..5, yard 6..17 (four units deep), stables 18..21; carriage way x 6..8; side range x 0..3 (walk at x 3)
  // ---- ground floor
  const tap = R(0, 'tap', 0, 0, ax0 - 1, fy1, { floor: 'worn' }), arch = R(1, 'carriage', ax0, 0, ax1, fy1, { floor: 'cobble' }), parl = R(2, 'parlour', ax1 + 1, 0, 12, fy1, { floor: 'floor' }), off = R(3, 'office', 13, 0, E, fy1, { floor: 'floor' });
  const kit = R(4, 'kitchen', 0, yy0, sw - 1, 10, { floor: 'worn' }), but = R(5, 'buttery', 0, 11, sw - 1, yy1, { floor: 'worn' }), walk = R(6, 'walk', sw, yy0, sw, yy1, { floor: 'worn', arcade: 'timber' });
  const yard = R(7, 'yard', sw + 1, yy0, E, yy1, { open: 1, floor: 'cobble' }), stab = R(8, 'stable', 0, sy0, 10, N, { floor: 'earth' }), coach = R(9, 'coachhouse', 11, sy0, E, N, { floor: 'earth' });
  const rooms0 = [tap, arch, parl, off, kit, but, walk, yard, stab, coach];
  const d0 = [door('h,2,0', -1, 0, { street: 1 })]; for (let x = ax0; x <= ax1; x++) d0.push(door(`h,${x},0`, -1, 1, { street: 1 }), door(`h,${x},${yy0}`, 1, 7));
  d0.push(door(`v,${ax0},3`, 0, 1), door(`v,${ax1 + 1},3`, 1, 2), door('v,13,1', 2, 3), door(`h,1,${yy0}`, 0, 4), door(`h,${sw},${yy0}`, 0, 6), door('v,3,8', 4, 6), door('v,3,12', 5, 6));
  for (const y of [7, 10, 13, 16]) d0.push(door(`v,${sw + 1},${y}`, 6, 7));
  for (const x of [5, 6, 9]) d0.push(door(`h,${x},${sy0}`, 7, 8)); for (const x of [12, 13, 14]) d0.push(door(`h,${x},${sy0}`, 7, 9));
  const A = props(rooms0), P = A.P;
  // the tap room: the fire, settles and tables, a cask on its stillage
  P('fireplace', 0, 2, 1, 2, 1); P('settle', 1, 4, 2, 1, 2); P('table', 2, 1, 2, 1, 0); P('form', 2, 2, 2, 1, 2); P('table', 4, 4, 1, 2, 3); P('stillage', 4, 0, 1, 2, 3); P('form', 1, 0, 1, 1, 2);
  // the parlour for better guests: table and chairs, a cupboard of plate; the innholder's office with his book and coffer
  P('longtable', 10, 2, 2, 3, 1, { nochair: 1 }); P('chair', 10, 1, 1, 1, 0); P('form', 12, 2, 1, 3, 3); P('cupboard', 12, 0, 1, 1, 2); P('fireplace', 11, fy1, 2, 1, 0);
  P('desk', E, 1, 1, 1, 3); P('stool', E - 1, 1, 1, 1, 1); P('coffer', E, 4, 1, 1, 3); P('shelf', 14, fy1, 1, 1, 0);
  // the carriage way: mounting block, a lantern hook
  P('mountblock', ax0, 1, 1, 1, 1);
  // kitchen and buttery off the walk
  P('hoodhearth', 0, 7, 1, 2, 1); P('table', 1, 9, 1, 2, 1); P('dresser', 2, 10, 1, 1, 3); P('barrel', 2, yy0, 1, 1, 0); P('bucket', 0, 10, 1, 1, 1);
  P('stillage', 0, 12, 1, 2, 1); P('barrel', 0, yy1, 1, 1, 1); P('barrel', 2, yy1, 1, 1, 3); P('shelf', 2, 11, 1, 1, 3);
  // the yard: the well, the horse trough, a carrier's wagon, the dunghill by the stables
  P('well', 11, 9, 1, 1, 0); P('trough', 13, 10, 2, 1, 0); P('wagon', 6, 9, 2, 3, 0); P('dung', E, yy1 - 1, 1, 2, 0); if (r() < .6) P('cart', 11, yy0, 2, 1, 2); P('bucket', 10, 9, 1, 1, 0);
  // stables: a row of stalls along the back wall with horses in some, hay and harness; the coach house
  const coats = ['bay', 'bay', 'chestnut', 'grey', 'black'];
  for (let x = 0; x <= 9; x++) P('horsestall', x, N - 1, 1, 2, 0, r() < .6 ? { horse: coats[Math.floor(r() * coats.length)] } : {});   // travellers' horses stand in some stalls, rumps to the aisle
  P('sack', 10, N, 1, 1, 0); P('bale', 10, N - 1, 1, 1, 0); P('wagon', 12, sy0 + 1, 3, 2, 0); P('crate', E, N, 1, 1, 0);
  const stair = spiral([sw, yy1], 2, (x, y, f) => x === sw && y >= yy0 && y <= yy1);
  const f0 = { f: 0, rooms: rooms0, doors: d0, props: A.list, stair: stair(0),
    windows: [{ side: 'f', i: 1, kind: 'win' }, { side: 'f', i: 4, kind: 'win' }, { side: 'f', i: 10, kind: 'win' }, { side: 'f', i: 11, kind: 'win' }, { side: 'f', i: 14, kind: 'win' },
      ewin(`h,1,${fy1 + 1}`, 'win'), ewin(`h,11,${fy1 + 1}`, 'win'), ewin(`h,14,${fy1 + 1}`, 'win'), { side: 'l', i: 9, kind: 'win' }, { side: 'l', i: 15, kind: 'grate' }, ewin(`h,8,${sy0}`, 'grate'), ewin(`h,2,${sy0}`, 'grate')] };
  // ---- first floor: chambers over the street range, a gallery along the yard side of both ranges; the best chamber over the tap room
  const best = R(0, 'bestchamber', 0, 0, sw - 1 + 3, fy1 - 1), c1 = R(1, 'guest', sw + 3, 0, 9, fy1 - 1), c2 = R(2, 'guest', 10, 0, E, fy1 - 1);
  const gf = R(3, 'gallery', 0, fy1, E, fy1, { gallery: 1, floor: 'boards' }), gs = R(4, 'gallery', sw, yy0, sw, yy1, { gallery: 1, floor: 'boards' });
  const c3 = R(5, 'guest', 0, yy0, sw - 1, 10), c4 = R(6, 'guest', 0, 11, sw - 1, yy1);
  const rooms1 = [best, c1, c2, gf, gs, c3, c4], d1 = [door(`h,2,${fy1}`, 0, 3), door(`h,7,${fy1}`, 1, 3), door(`h,12,${fy1}`, 2, 3), door(`h,${sw},${yy0}`, 3, 4), door('v,3,8', 5, 4), door('v,3,12', 6, 4)];
  const B = props(rooms1), Q = B.P;
  Q('greatbed', 0, 0, 2, 2, 0); Q('fireplace', 0, 3, 1, 2, 1); Q('chest', 2, 0, 1, 1, 2); Q('chair', 3, 2, 1, 1, 0); Q('table', 4, 0, 2, 1, 2); Q('closestool', 5, 3, 1, 1, 3);
  Q('bed', 6, 0, 1, 2, 2); Q('bed', 8, 0, 1, 2, 2); Q('chest', 9, 3, 1, 1, 3); Q('stool', 7, 3, 1, 1, 0);
  Q('bed', 10, 0, 1, 2, 2); Q('bed', 12, 0, 1, 2, 2); Q('bed', 14, 0, 1, 2, 2); Q('chest', E, 3, 1, 1, 3); Q('washstand', 11, 3, 1, 1, 0);
  Q('bed', 0, yy0, 1, 2, 1); Q('bed', 0, 9, 1, 2, 1); Q('chest', 2, yy0, 1, 1, 0); Q('stool', 2, 10, 1, 1, 3);
  Q('bed', 0, 11, 1, 2, 1); Q('pallet', 0, 13, 1, 2, 1); Q('bed', 0, 15, 1, 2, 1); Q('chest', 2, yy1, 1, 1, 3);
  const f1 = { f: 1, rooms: rooms1, doors: d1, props: B.list, stair: stair(1),
    windows: [{ side: 'f', i: 1, kind: 'win' }, { side: 'f', i: 4, kind: 'win' }, { side: 'f', i: 7, kind: 'win' }, { side: 'f', i: 11, kind: 'win' }, { side: 'f', i: 14, kind: 'win' }, { side: 'l', i: 8, kind: 'win' }, { side: 'l', i: 12, kind: 'win' }, { side: 'l', i: 16, kind: 'win' }] };
  const names = { tap: 'Tap room', carriage: 'Carriage way', parlour: 'Parlour', office: "Innholder's room", kitchen: 'Kitchen', buttery: 'Buttery', walk: 'Covered walk', yard: 'Inn yard', stable: 'Stables', coachhouse: 'Coach house',
    bestchamber: 'Best chamber', guest: 'Guest chamber', gallery: 'Gallery' };
  const site = { w: W, d: U(Di), storeys: 2, front: 'street', doors: [{ side: 'f', at: 1 }, { side: 'f', at: 3, wide: 'carriage way, 1 unit' }], needs: ['main road or market place', 'back lane for the stable yard helps'],
    open: [{ x: 1, y: 2, w: 4, d: 4, what: 'inn yard' }], rank: '1+, 1-2 per town on the through road; ports and gate streets more' };
  return plan({ kind: 'courtinn', tier: 'merchant', Wi, Di, floors: [f0, f1], names, site, doorX: 7, core: { kind: 'spiral', cells: [[sw, yy1]] } });
}

// ---- a friary (Franciscan or Dominican) at the edge of town: the church on the street with a preaching nave, the walking place under the
// tower through to the cloister, the friars' choir to the east; the cloister behind it with the chapter house and sacristy in the east range,
// the refectory across the north, kitchen and guest hall on the west; the dormitory and library upstairs in the east range.
export function planFriary(opt = {}) {
  // the cloister garth is four units square (a real friary's garth was 15-25 m across): the church along the street, the west range the guest
  // hall and kitchen, the east range sacristy, chapter house and warming room with the dormitory over, the refectory across the back
  const r = rngOf((opt.seed || 1) * 457 + 11), Wi = 28, Di = 31, E = Wi - 1, N = Di - 1;
  const nave = R(0, 'fnave', 0, 0, 15, 8, { floor: 'pave' }), wp = R(1, 'walkplace', 16, 0, 18, 8, { floor: 'pave' }), choir = R(2, 'fchoir', 19, 0, E, 8, { floor: 'tiles' });
  const sw = R(3, 'cwalk', 6, 9, 21, 10, { floor: 'pave', arcade: 1 }), ww = R(4, 'cwalk', 6, 11, 7, 22, { floor: 'pave', arcade: 1 }), ew = R(5, 'cwalk', 20, 11, 21, 22, { floor: 'pave', arcade: 1 }), nw = R(6, 'cwalk', 6, 23, 21, 24, { floor: 'pave', arcade: 1 });
  const garth = R(7, 'garth', 8, 11, 19, 22, { open: 1, floor: 'grass' });
  const guest = R(8, 'guesthall', 0, 9, 5, 24, { floor: 'worn' }), kit = R(9, 'kitchen', 0, 25, 5, N, { floor: 'worn' }), refec = R(10, 'refectory', 6, 25, 21, N, { floor: 'pave' });
  const sac = R(11, 'sacristy', 22, 9, E, 12, { floor: 'tiles' }), chap = R(12, 'chapterhouse', 22, 13, E, 20, { floor: 'tiles' }), warm = R(13, 'warming', 22, 21, E, N, { floor: 'worn' });
  const rooms0 = [nave, wp, choir, sw, ww, ew, nw, garth, guest, kit, refec, sac, chap, warm];
  const d0 = [door('h,17,0', -1, 1, { street: 1 }), door('h,4,0', -1, 0, { street: 1 })];
  for (let y = 1; y <= 7; y++) d0.push(door(`v,16,${y}`, 0, 1)); d0.push(door('v,19,4', 1, 2));         // the walking place: open arches to the nave, the pulpitum door into the choir
  d0.push(door('h,17,9', 1, 3), door('h,9,9', 0, 3));                                                       // into the cloister from the walking place, the processional door from the nave
  for (const x of [6, 7]) d0.push(door(`h,${x},11`, 3, 4), door(`h,${x},23`, 4, 6)); for (const x of [20, 21]) d0.push(door(`h,${x},11`, 3, 5), door(`h,${x},23`, 5, 6));
  d0.push(door('h,14,11', 3, 7), door('h,13,23', 7, 6), door('v,8,16', 4, 7), door('v,20,17', 7, 5));       // ways out into the garth
  d0.push(door('v,6,10', 8, 3), door('v,6,16', 8, 4), door('h,2,25', 8, 9), door('v,6,27', 9, 10), door('h,14,25', 6, 10), door('h,10,25', 6, 10));
  d0.push(door('h,24,9', 2, 11), door('v,22,10', 3, 11), door('v,22,15', 5, 12), door('v,22,16', 5, 12), door('v,22,30', 10, 13));
  const A = props(rooms0), P = A.P;
  // the preaching nave: a row of piers, the pulpit on one, a few forms for the old and the great; the people stand
  for (const x of [2, 5, 8, 11, 14]) P('pier', x, 5, 1, 1, 0); P('pulpit', 6, 6, 1, 1, 2); for (const x of [3, 9]) P('form', x, 7, 2, 1, 2); P('tomb', 0, 7, 2, 1, 0); P('image', 15, 0, 1, 1, 2);
  // the friars' choir: stalls both sides, the lectern, sedilia and the high altar on its footpace
  P('stall', 19, 0, 3, 1, 2); P('stall', 19, 8, 3, 1, 0); P('stall', 22, 8, 3, 1, 0); P('sedilia', 23, 0, 2, 1, 2); P('lectern', 22, 4, 1, 1, 1);
  P('highaltar', E, 3, 1, 3, 3); P('footpace', E - 1, 2, 1, 5, 3, { walk: 1 }); P('candlestand', E - 1, 1, 1, 1, 0); P('candlestand', E - 1, 7, 1, 1, 0);
  // the cloister: the laver for washing before meals by the refectory door, the well in the garth, carrel desks in the walks
  P('laver', 15, 24, 3, 1, 0); P('well', 13, 16, 1, 1, 0); P('desk', 6, 9, 1, 1, 2); P('desk', 6, 18, 1, 1, 1); P('desk', 6, 20, 1, 1, 1);
  // the chapter house: a stone bench round the walls, the prior's seat at the east end, a lectern for the chapter of the rule
  P('sbench', 23, 20, 4, 1, 0); P('sbench', 23, 13, 4, 1, 2); P('sbench', E, 15, 1, 4, 3); P('chair', E - 1, 16, 1, 1, 3); P('lectern', 24, 16, 1, 1, 3); P('image', E, 13, 1, 1, 2);
  // the sacristy: vestment press and the plate chest; the warming room's fire
  P('press', 25, 9, 2, 1, 2, { vest: 1 }); P('chest', E, 11, 1, 1, 3, { iron: 1 }); P('table', 22, 12, 2, 1, 0);
  P('fireplace', E, 24, 1, 2, 3); P('form', 24, 28, 2, 1, 0); P('form', 24, 22, 2, 1, 2);
  // the refectory: tables down the long walls, the high table across the east end, the reader's pulpit
  P('longtable', 7, 29, 4, 1, 0, { nochair: 1 }); P('form', 7, 28, 4, 1, 2); P('longtable', 13, 29, 4, 1, 0, { nochair: 1 }); P('form', 13, 28, 4, 1, 2);
  P('longtable', 7, 25, 2, 1, 2, { nochair: 1 }); P('longtable', 16, 25, 3, 1, 2, { nochair: 1 }); P('hightable', 21, 26, 1, 4, 3); P('pulpit', 12, N, 1, 1, 0); P('cupboard', 6, N, 1, 1, 0);
  // the kitchen: a great fireplace, the bread oven, tables, water and stores
  P('fireplace', 0, 27, 1, 2, 1); P('oven', 0, 29, 2, 2, 1); P('table', 2, 27, 2, 1, 0); P('dresser', 5, N, 1, 1, 3); P('barrel', 5, 25, 1, 1, 3); P('bucket', 3, N, 1, 1, 0); P('woodpile', 2, N, 1, 1, 0);
  // the guest hall (travellers, the poor at the gate): a fire, a table and forms, beds; the cellarer's stores at its end
  P('fireplace', 0, 12, 1, 2, 1); P('table', 2, 13, 2, 1, 0); P('form', 2, 12, 2, 1, 2); P('bed', 0, 9, 1, 2, 1); P('bed', 2, 9, 1, 2, 2); P('bed', 0, 17, 1, 2, 1); P('bed', 0, 19, 1, 2, 1);
  P('barrel', 0, 23, 1, 1, 1); P('sack', 0, 24, 1, 1, 1); P('sack', 1, 24, 1, 1, 0); P('barrel', 5, 24, 1, 1, 3);
  const stair = spiral([21, 24], 2, (x, y, f) => f === 0 ? x >= 6 && x <= 21 && y >= 23 && y <= 24 : x === 21 && y === 23);
  const win0 = []; for (const x of [1, 4, 8, 11, 14]) win0.push({ side: 'f', i: x, kind: 'lancet' }); for (const x of [21, 23, 25]) win0.push({ side: 'f', i: x, kind: 'lancet' }); for (const y of [3, 4, 5]) win0.push({ side: 'r', i: y, kind: 'lancet' });
  win0.push({ side: 'l', i: 4, kind: 'lancet' }, { side: 'r', i: 16, kind: 'lancet' }, { side: 'r', i: 18, kind: 'lancet' }, { side: 'r', i: 11, kind: 'win' }, { side: 'r', i: 27, kind: 'win' }, { side: 'b', i: 9, kind: 'win' }, { side: 'b', i: 14, kind: 'win' }, { side: 'b', i: 19, kind: 'win' },
    { side: 'b', i: 2, kind: 'win' }, { side: 'l', i: 11, kind: 'win' }, { side: 'l', i: 15, kind: 'win' }, { side: 'l', i: 21, kind: 'win' }, ewin('v,22,17', 'win'), ewin('v,22,19', 'win'), ewin('h,4,9', 'lancet'), ewin('h,12,9', 'lancet'));
  const f0 = { f: 0, rooms: rooms0, doors: d0, props: A.list, windows: win0, stair: stair(0) };
  // upstairs in the east range: the dormitory of the friars' cubicles, the library at its north end
  const land = R(0, 'landing', 21, 23, 21, 24, { floor: 'boards' }), dorm = R(1, 'dorter', 22, 9, E, 24, { floor: 'boards' }), lib = R(2, 'library', 22, 25, E, N, { floor: 'boards' });
  const rooms1 = [land, dorm, lib], d1 = [door('v,22,23', 0, 1), door('h,25,25', 1, 2)], B = props(rooms1), Q = B.P;
  for (let y = 9; y <= 21; y += 2) { Q('pallet', 22, y, 1, 2, 1); Q('pallet', E, y, 1, 2, 3); Q('chest', 23, y, 1, 1, 1); Q('chest', E - 1, y + 1, 1, 1, 3); }
  Q('press', 22, N, 2, 1, 0, { books: 1 }); Q('press', 25, N, 2, 1, 0, { books: 1 }); Q('desk', 22, 26, 1, 1, 1); Q('desk', E, 26, 1, 1, 3); Q('lectern', 25, 27, 1, 1, 0); Q('chest', E, 25, 1, 1, 3);
  const f1 = { f: 1, rooms: rooms1, doors: d1, props: B.list, stair: stair(1), windows: [{ side: 'r', i: 10, kind: 'win' }, { side: 'r', i: 14, kind: 'win' }, { side: 'r', i: 18, kind: 'win' }, { side: 'r', i: 22, kind: 'win' }, { side: 'r', i: 28, kind: 'win' }, { side: 'b', i: 24, kind: 'win' }, ewin('v,22,11', 'win'), ewin('v,22,15', 'win'), ewin('v,22,19', 'win')] };
  const names = { fnave: 'Nave', walkplace: 'Walking place', fchoir: "Friars' choir", cwalk: 'Cloister walk', garth: 'Cloister garth', guesthall: 'Guest hall', kitchen: 'Kitchen', refectory: 'Refectory', sacristy: 'Sacristy',
    chapterhouse: 'Chapter house', warming: 'Warming room', landing: 'Stair head', dorter: 'Dormitory', library: 'Library' };
  const zone = (f, x, y) => f === 0 && y <= 8 ? [x < 16 ? 'Nave' : x < 19 ? 'Walking place' : "Friars' choir", 'Friary church'] : null;
  const site = { w: 9, d: 10, storeys: 2, front: 'street', doors: [{ side: 'f', at: 5, what: 'walking place' }, { side: 'f', at: 1, what: 'west door' }], needs: ['edge', 'open ground for preaching outside the west door helps'],
    open: [{ x: 3, y: 4, w: 4, d: 4, what: 'cloister garth' }], rank: '2+ (1-2 orders per town), city 3-6' };
  return plan({ kind: 'friary', tier: 'church', Wi, Di, floors: [f0, f1], names, zone, site, doorX: 17, posts: false, core: { kind: 'spiral', cells: [[21, 24]] } });
}

// ---- a hospital of St John: the infirmary hall of beds open to its chapel at the east end, so the sick can see the altar from their beds;
// the master's lodging and the kitchen behind, with a herb garden.
export function planHospital(opt = {}) {
  const r = rngOf((opt.seed || 1) * 271 + 5), Wi = 25, Di = 19, E = Wi - 1, N = Di - 1, xc = 18;
  const hall = R(0, 'infirmary', 0, 0, xc - 1, 9, { floor: 'pave' }), chap = R(1, 'hchapel', xc, 0, E, 9, { floor: 'tiles' });
  const lodge = R(2, 'lodging', 0, 10, 5, N, { floor: 'floor' }), kit = R(3, 'kitchen', 6, 10, 11, 15, { floor: 'worn' }), gard = R(4, 'herbgarden', 6, 16, E, N, { open: 1, floor: 'grass' }), yd = R(5, 'kyard', 12, 10, E, 15, { open: 1, floor: 'yard' });
  const rooms0 = [hall, chap, lodge, kit, gard, yd];
  const d0 = [door('h,3,0', -1, 0, { street: 1 })]; for (let y = 0; y <= 9; y++) d0.push(door(`v,${xc},${y}`, 0, 1));
  d0.push(door('h,3,10', 0, 2), door('h,8,10', 0, 3), door('v,12,12', 3, 5), door('h,8,16', 3, 4));
  const A = props(rooms0), P = A.P;
  // beds down both long walls, each in its curtained bay; a hearth in the middle of the floor, a table for the sisters, chests at the bed feet
  for (let x = 1; x <= 15; x += 2) { if (x !== 3) P('sickbed', x, 0, 1, 2, 2); if (x !== 3) P('sickbed', x, 8, 1, 2, 0); }
  P('brazier', 8, 4, 1, 1, 0); P('table', 11, 4, 2, 1, 0); P('stool', 11, 5, 1, 1, 2); P('chest', 0, 4, 1, 1, 1); P('washtub', 15, 4, 1, 1, 0); P('bucket', 16, 5, 1, 1, 0); P('basket', 5, 5, 1, 1, 0);
  // the chapel: a screen with a wide door, the altar on the east wall, lights, an image of the Baptist
  for (let y = 0; y <= 9; y++) if (y < 3 || y > 6) P('parclose', xc, y, 1, 1, 1);
  P('altar', E, 4, 1, 2, 3); P('footpace', E - 1, 3, 1, 4, 3, { walk: 1 }); P('candlestand', E, 3, 1, 1, 3); P('candlestand', E, 6, 1, 1, 3); P('image', E, 0, 1, 1, 2); P('form', 20, 8, 2, 1, 0);
  // the master's lodging (hall below, chamber above), the kitchen with its hearth; the garden of herbs for the sick
  P('fireplace', 0, 12, 1, 2, 1); P('table', 2, 15, 2, 1, 0); P('chair', 2, 16, 1, 1, 2); P('desk', 5, N, 1, 1, 0); P('chest', 0, N, 1, 1, 1);
  P('hoodhearth', 6, 12, 1, 2, 1); P('table', 8, 13, 2, 1, 0); P('dresser', 11, 10, 1, 1, 2); P('barrel', 11, 15, 1, 1, 3); P('woodpile', 6, 15, 1, 1, 1);
  P('well', 15, 12, 1, 1, 0); P('washtub', 18, 11, 1, 1, 0); P('woodpile', E, 10, 1, 1, 3);
  for (const x of [8, 12, 16, 20]) P('garden', x, 16, 2, 2, 0); P('coop', E, N, 1, 1, 3);
  const stair = spiral([5, 10], 2, (x, y) => x >= 0 && x <= 5 && y >= 10 && y <= N);
  const f0 = { f: 0, rooms: rooms0, doors: d0, props: A.list, stair: stair(0), windows: [...[1, 6, 10, 14].map((i) => ({ side: 'f', i, kind: 'win' })), ...[19, 22].map((i) => ({ side: 'f', i, kind: 'lancet' })), { side: 'r', i: 4, kind: 'lancet' }, { side: 'r', i: 5, kind: 'lancet' },
    ewin('h,14,10', 'win'), ewin('h,1,10', 'grate'), ewin('h,20,10', 'lancet'), { side: 'l', i: 14, kind: 'win' }, ewin('v,6,17', 'win'), ewin('h,9,16', 'win')] };
  const ch = R(0, 'masterchamber', 0, 10, 5, N, { floor: 'boards' }), B = props([ch]), Q = B.P; Q('bed', 0, 16, 1, 2, 1); Q('chest', 0, 15, 1, 1, 1); Q('chair', 3, N, 1, 1, 0); Q('cupboard', 0, 11, 1, 1, 1);
  const f1 = { f: 1, rooms: [ch], doors: [], props: B.list, stair: stair(1), windows: [{ side: 'l', i: 13, kind: 'win' }, { side: 'b', i: 2, kind: 'win' }] };
  const names = { infirmary: 'Infirmary hall', hchapel: 'Chapel', lodging: "Master's lodging", kitchen: 'Kitchen', herbgarden: 'Herb garden', kyard: 'Kitchen yard', masterchamber: "Master's chamber" };
  const site = { w: 8, d: 6, storeys: 1, front: 'street', doors: [{ side: 'f', at: 1 }], needs: ['by a town gate or a bridge (travellers, the sick from outside)', 'garden behind'], open: [{ x: 2, y: 3, w: 6, d: 3, what: 'herb garden and kitchen yard' }], rank: '1+, one; walled towns may have a leper house outside the walls too' };
  return plan({ kind: 'hospital', tier: 'church', Wi, Di, floors: [f0, f1], names, site, doorX: 3, posts: false, core: { kind: 'spiral', cells: [[5, 10]] } });
}

// ---- a grammar school: one long schoolroom (master's chair on a step at one end, the usher at the other, forms round the walls), boarders' loft above,
// the master's house joined to it.
export function planSchool(opt = {}) {
  const r = rngOf((opt.seed || 1) * 389 + 9), Wi = 19, Di = 10, E = Wi - 1, N = Di - 1, xs = 12;
  const sch = R(0, 'schoolroom', 0, 0, xs - 1, N, { floor: 'boards' }), mh = R(1, 'masterhall', xs, 0, E, N, { floor: 'worn' });
  const d0 = [door('h,5,0', -1, 0, { street: 1 }), door('h,15,0', -1, 1, { street: 1 }), door('v,12,6', 0, 1)], A = props([sch, mh]), P = A.P;
  P('dais', 9, 3, 3, 3, 3, { walk: 1 }); P('chairstate', 11, 4, 1, 1, 3); P('desk', 10, 4, 1, 1, 3); P('press', 11, 0, 1, 2, 3, { books: 1 }); P('desk', 0, 4, 1, 1, 1); P('stool', 1, 4, 1, 1, 1);
  for (const x of [1, 4, 6]) { P('form', x, N, 2, 1, 0); if (x !== 4) P('form', x, 0, 2, 1, 2); } P('form', 3, 3, 1, 2, 1); P('form', 7, 3, 1, 2, 3); P('form', 3, 6, 1, 2, 1); P('form', 7, 6, 1, 2, 3); P('chest', 0, N, 1, 1, 1);
  P('fireplace', E, 3, 1, 2, 3); P('table', 14, 4, 2, 1, 0); P('chair', 14, 5, 1, 1, 2); P('cupboard', E, N, 1, 1, 3); P('form', 14, 3, 2, 1, 2); P('chest', 12, N, 1, 1, 0);
  const stair = spiral([12, 0], 2, (x, y) => x >= xs && y <= N);
  const f0 = { f: 0, rooms: [sch, mh], doors: d0, props: A.list, stair: stair(0), windows: [...[1, 3, 8, 10].map((i) => ({ side: 'f', i, kind: 'win' })), ...[1, 4, 7, 10].map((i) => ({ side: 'b', i, kind: 'win' })), { side: 'l', i: 5, kind: 'win' }, { side: 'f', i: 17, kind: 'win' }, { side: 'b', i: 15, kind: 'win' }] };
  const loft = R(0, 'boarders', 0, 0, xs - 1, N, { floor: 'boards' }), mc = R(1, 'masterchamber', xs, 0, E, N, { floor: 'boards' }), B = props([loft, mc]), Q = B.P;
  for (const x of [0, 2, 4, 6, 8]) Q(x % 4 ? 'pallet' : 'bed', x, N - 1, 1, 2, 0); Q('chest', 10, N, 1, 1, 0); for (const x of [1, 5]) Q('chest', x, 0, 1, 1, 2);
  Q('greatbed', 16, 7, 2, 2, 0); Q('chest', 15, N, 1, 1, 0); Q('desk', E, 2, 1, 1, 3); Q('press', 15, 0, 2, 1, 2, { books: 1 }); Q('chair', 17, 2, 1, 1, 1);
  const f1 = { f: 1, rooms: [loft, mc], doors: [door('v,12,5', 0, 1)], props: B.list, stair: stair(1), windows: [...[2, 9].map((i) => ({ side: 'f', i, kind: 'win' })), { side: 'f', i: 16, kind: 'win' }, { side: 'l', i: 5, kind: 'win' }] };
  const names = { schoolroom: 'Schoolroom', masterhall: "Master's hall", boarders: "Boarders' loft", masterchamber: "Master's chamber" };
  const site = { w: 6, d: 3, storeys: 2, front: 'street', doors: [{ side: 'f', at: 2 }, { side: 'f', at: 5 }], needs: ['near the parish church or in its churchyard'], open: [], rank: '1+, one (chantry or guild school)' };
  return plan({ kind: 'school', tier: 'merchant', Wi, Di, floors: [f0, f1], names, site, doorX: 5, core: { kind: 'spiral', cells: [[12, 0]] } });
}
