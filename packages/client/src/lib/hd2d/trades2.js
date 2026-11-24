// @ts-nocheck
// More stand-alone buildings for the town generator (England / Low Countries 1450-1550): the shambles, an almshouse row, a weigh house.
// Same conventions as trades.js: plan rows run from the street side (y = 0) back; x left -> right seen from outside; one unit = 3 cells (+1).
// Prop rot: 0 against the back wall, 2 against the front, 1 the left wall, 3 the right wall.
import { rngOf, spiral, R, door, plan, props, noStair } from './bkit.js';

const street = (x, a = 0) => door(`h,${x},0`, -1, a, { street: 1 });

// ---- the shambles: the butchers' row, a long timber shed open to the street on posts; each butcher's bay has its stall board at the front,
// the block and the hooks behind; the gutter runs down the back to the town ditch (the stink is why it stands off the market itself)
export function planShambles(opt = {}) {
  const r = rngOf((opt.seed || 1) * 61 + 7), Wi = 19, Di = 7, E = Wi - 1, N = Di - 1;
  const q = R(0, 'shambles', 0, 0, E, N, { floor: 'cobble', openSides: 'f' }), A = props([q]), P = A.P, d0 = []; for (let x = 0; x <= E; x++) d0.push(street(x));
  for (let b = 0; b < 3; b++) { const x0 = b * 6 + 1;   // three butchers, a bay each
    P('counter', x0, 1, 3, 1, 2, { goods: 'meat' }); P('choppingblock', x0 + 1, 4, 1, 1, 0); P('rack', x0, N, 3, 1, 0); if (r() < .7) P('bucket', x0 + 3, N, 1, 1, 0); if (r() < .5) P('tub', x0 + 4, 4, 1, 1, 0); }
  for (const x of [6, 12]) P('post', x, 3, 1, 1, 0); P('trough', 0, N, 1, 1, 1);
  const f0 = { f: 0, rooms: [q], doors: d0, props: A.list, stair: noStair(), windows: [{ side: 'b', i: 3, kind: 'shut' }, { side: 'b', i: 9, kind: 'shut' }, { side: 'b', i: 15, kind: 'shut' }] };
  return plan({ kind: 'shambles', tier: 'works', Wi, Di, floors: [f0], names: { shambles: 'Shambles' }, doorX: 9,
    site: { w: 6, d: 2, storeys: 1, front: 'street', doors: [{ side: 'f', at: 0, what: 'open on posts' }], needs: ['a street off the market (the meat market), never on it', 'water or a ditch behind for the offal'], open: [], rank: '1+, one per market town' } });
}

// ---- an almshouse: a row of small dwellings for poor old people, each with its own street door, hearth, bed and chest; a chapel at one end
// where the almsfolk pray for the founder; a covered walk along the back joins the rooms to the chapel (Ewelme, Browne's at Stamford)
export function planAlmshouse(opt = {}) {
  const Wi = 25, Di = 10, E = Wi - 1, N = Di - 1, n = 4, cw = 5, g0 = 7;   // n dwellings 5 cells wide; the walk from row g0
  const chapel = R(0, 'chapel', 0, 0, 4, N, { floor: 'tiles' }), rooms = [chapel], doors = [street(2, 0)];
  for (let k = 0; k < n; k++) { const x0 = 5 + k * cw; rooms.push(R(1 + k, 'dwelling', x0, 0, x0 + cw - 1, g0 - 1, { floor: 'boards' })); doors.push(street(x0 + 2, 1 + k), door(`h,${x0 + 2},${g0}`, 1 + k, n + 1)); }
  const walk = R(n + 1, 'walk', 5, g0, E, N, { floor: 'flags' }); rooms.push(walk); doors.push(door(`v,5,${g0 + 1}`, 0, n + 1));
  const A = props(rooms), P = A.P;
  P('altar', 2, N, 2, 1, 0); P('candlestand', 1, N, 1, 1, 0); P('candlestand', 4, N, 1, 1, 0); P('bench', 0, 3, 1, 3, 1); P('bench', 4, 3, 1, 3, 3); P('image', 0, N - 2, 1, 1, 1);
  for (let k = 0; k < n; k++) { const x0 = 5 + k * cw; P('fireplace', x0, 1, 1, 2, 1); P('bed', x0 + cw - 1, 3, 1, 2, 3); P('chest', x0 + cw - 1, 1, 1, 1, 3); P('stool', x0 + 1, 3, 1, 1, 0); if (k % 2) P('chair', x0 + 2, 5, 1, 1, 0); }
  P('bench', 7, N, 3, 1, 0); P('bench', 17, N, 3, 1, 0); P('bucket', E, N, 1, 1, 3);
  const win = [{ side: 'f', i: 0, kind: 'lancet' }, { side: 'l', i: 4, kind: 'lancet' }]; for (let k = 0; k < n; k++) win.push({ side: 'f', i: 5 + k * cw + 4, kind: 'win' });
  for (let x = 7; x <= E; x += 6) win.push({ side: 'b', i: x, kind: 'win' });
  const f0 = { f: 0, rooms, doors, props: A.list, stair: noStair(), windows: win };
  return plan({ kind: 'almshouse', tier: 'civic', Wi, Di, floors: [f0], names: { chapel: 'Almshouse chapel', dwelling: 'Almsman\'s room', walk: 'Covered walk' }, doorX: 2, stone: [0],
    site: { w: 8, d: 3, storeys: 1, front: 'street', doors: [{ side: 'f', at: 0, what: 'one door per room' }], needs: ['by the church or a town gate', 'a founder: a guild, a merchant, the town'], open: [], rank: '1+, one or two in a town' } });
}

// ---- a weigh house (waag): the town beam on the ground floor behind wide arches, where goods brought to market were weighed and taxed;
// the weighmaster's desk and the weights; the guild or court room above (Low Countries; England weighed at the tron in the market house)
export function planWeighHouse(opt = {}) {
  const Wi = 13, Di = 10, E = Wi - 1, N = Di - 1, q = R(0, 'weighfloor', 0, 0, E, N, { floor: 'flags' }), A = props([q]), P = A.P, d0 = []; for (const x of [2, 3, 6, 7, 10, 11]) d0.push(street(x));
  P('tron', 5, 4, 3, 2, 0); P('scales', 1, 6, 2, 1, 0); P('desk', 10, 6, 2, 1, 0); P('chair', 10, 5, 1, 1, 2); P('bale', 0, N, 1, 1, 0); P('bale', 1, N, 1, 1, 0); P('sack', 3, N, 1, 1, 0); P('sack', 4, N, 1, 1, 0); P('barrel', E, 1, 1, 1, 3); P('crate', E, 3, 1, 1, 3); P('townchest', 7, N, 2, 1, 0);
  const sp = spiral([0, 0], 2, (x, y) => x <= 1 && y <= 1 && !(x === 0 && y === 0));
  const f0 = { f: 0, rooms: [q], doors: d0, props: A.list, stair: sp(0), windows: [{ side: 'b', i: 3, kind: 'win' }, { side: 'b', i: 9, kind: 'win' }, { side: 'l', i: 5, kind: 'win' }, { side: 'r', i: 5, kind: 'win' }] };
  const u = R(0, 'guildroom', 0, 0, E, N, { floor: 'boards' }), B = props([u]), Q = B.P;
  Q('longtable', 3, 4, 6, 1, 0, { nochair: 1 }); Q('form', 3, 3, 6, 1, 2); Q('form', 3, 5, 6, 1, 0); Q('chairstate', 6, 7, 1, 1, 2); Q('fireplace', E, 4, 1, 2, 3); Q('chest', 0, N, 2, 1, 0, { iron: 1 }); Q('hanging', 5, N, 3, 1, 0);
  const f1 = { f: 1, rooms: [u], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: 6, kind: 'win' }, { side: 'f', i: 10, kind: 'win' }, { side: 'b', i: 6, kind: 'win' }, { side: 'l', i: 6, kind: 'win' }] };
  return plan({ kind: 'weighhouse', tier: 'civic', Wi, Di, floors: [f0, f1], names: { weighfloor: 'Weigh house', guildroom: 'Guild room' }, doorX: 6, stone: true, core: { kind: 'spiral', cells: [[0, 0]] },
    site: { w: 4, d: 3, storeys: 2, front: 'square', doors: [{ side: 'f', at: 1, wide: 'cart arches' }], needs: ['on the market place', 'towns with the right to weigh (Low Countries)'], open: [], rank: '1+ (Low Countries)' } });
}

// ---- a cloth hall (lakenhal, the drapers' hall): the town's cloth was brought here to be searched, sealed and sold; the selling floor
// below with the drapers' boards in rows and bales stacked, the searchers' table by the door; the hall of the cloth guild above (Ypres, Leiden; Blackwell Hall, Lavenham's)
export function planClothHall(opt = {}) {
  const r = rngOf((opt.seed || 1) * 43 + 5), Wi = 19, Di = 13, E = Wi - 1, N = Di - 1, q = R(0, 'clothfloor', 0, 0, E, N, { floor: 'flags' }), A = props([q]), P = A.P, d0 = [street(8), street(9), street(10)];
  for (const y of [3, 7]) for (const x0 of [2, 7, 12]) P('counter', x0, y, 3, 1, y === 3 ? 0 : 2, { goods: 'cloth' });   // the drapers' boards, aisles between
  for (let x = 2; x <= E - 2; x += 2) if (r() < .8) P('bale', x, N, 1, 1, 0); P('bale', E, 4, 1, 1, 3); P('bale', E, 6, 1, 1, 3); P('table', 13, 1, 2, 1, 0); P('chair', 13, 0, 1, 1, 0); P('scales', 4, 1, 2, 1, 0); P('chest', E, 9, 1, 1, 3, { iron: 1 });
  const sp = spiral([0, 0], 2, (x, y) => x <= 1 && y <= 1 && !(x === 0 && y === 0));
  const win = [{ side: 'b', i: 4, kind: 'win' }, { side: 'b', i: 9, kind: 'win' }, { side: 'b', i: 14, kind: 'win' }, { side: 'l', i: 6, kind: 'win' }, { side: 'r', i: 6, kind: 'win' }, { side: 'f', i: 4, kind: 'win' }, { side: 'f', i: 14, kind: 'win' }];
  const f0 = { f: 0, rooms: [q], doors: d0, props: A.list, stair: sp(0), windows: win };
  const u = R(0, 'drapershall', 0, 0, E, N, { floor: 'boards' }), B = props([u]), Q = B.P;
  Q('longtable', 5, 6, 9, 1, 0, { nochair: 1 }); Q('form', 5, 5, 9, 1, 2); Q('form', 5, 7, 9, 1, 0); Q('chairstate', 9, 10, 1, 1, 2); Q('hanging', 8, N, 3, 1, 0); Q('fireplace', E, 5, 1, 2, 3); Q('chest', 0, N, 2, 1, 0, { iron: 1 }); Q('clothshelf', 0, 5, 1, 2, 1);
  const f1 = { f: 1, rooms: [u], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'f', i: 3, kind: 'win' }, { side: 'f', i: 9, kind: 'win' }, { side: 'f', i: 15, kind: 'win' }, { side: 'b', i: 6, kind: 'win' }, { side: 'b', i: 12, kind: 'win' }, { side: 'l', i: 8, kind: 'win' }] };
  return plan({ kind: 'clothhall', tier: 'civic', Wi, Di, floors: [f0, f1], names: { clothfloor: 'Cloth hall', drapershall: 'Drapers\' hall' }, doorX: 9, stone: [0], core: { kind: 'spiral', cells: [[0, 0]] },
    site: { w: 6, d: 4, storeys: 2, front: 'square', doors: [{ side: 'f', at: 3 }], needs: ['on or by the market place', 'cloth towns'], open: [], rank: '2+, cloth towns' } });
}

// ---- a castle's hall range in the bailey: by 1450 the lord lived here, not in the keep. The screens passage from the bailey door, the
// buttery and pantry off it at the low end, the great hall open to the roof with the high table on the dais, the parlour beyond and the
// lord's solar over it (Ludlow's inner bailey, Haddon, Stokesay)
export function planCastleHall(opt = {}) {
  const r = rngOf((opt.seed || 1) * 67 + 3), Wi = 22, Di = 13, E = Wi - 1, N = Di - 1;
  const but = R(0, 'buttery', 0, 0, 3, 5, { floor: 'flags' }), pan = R(1, 'pantry', 0, 6, 3, N, { floor: 'flags' }), scr = R(2, 'screens', 4, 0, 5, N, { floor: 'flags' }), hall = R(3, 'greathall', 6, 0, 17, N, { floor: 'flags' }), par = R(4, 'parlour', 18, 0, E, N, { floor: 'boards' });
  const rooms = [but, pan, scr, hall, par], doors = [street(4, 2), street(5, 2), door('v,4,2', 0, 2), door('v,4,9', 1, 2), door('v,6,3', 2, 3), door('v,6,9', 2, 3), door('v,18,10', 3, 4)];
  const A = props(rooms), P = A.P;
  P('barrel', 0, 0, 1, 1, 1); P('barrel', 0, 1, 1, 1, 1); P('barrel', 2, 0, 1, 1, 2); if (r() < .6) P('barrel', 0, 4, 1, 1, 1); P('table', 1, 5, 2, 1, 0);
  P('dresser', 0, N, 2, 1, 0); P('chest', 3, N, 1, 1, 0); P('cupboard', 0, 7, 1, 1, 1); P('sack', 0, 9, 1, 1, 1);
  P('hightable', 16, 4, 1, 4, 3); P('chairstate', 17, 5, 1, 1, 3); P('longtable', 8, 2, 6, 1, 2, { nochair: 1 }); P('form', 8, 3, 6, 1, 0); P('longtable', 8, 10, 6, 1, 0, { nochair: 1 }); P('form', 8, 9, 6, 1, 2);
  P('fireplace', 11, N, 2, 1, 0); P('hanging', 15, 0, 3, 1, 2); P('cupboard', 17, N, 1, 1, 0);
  P('table', 19, 4, 2, 1, 0); P('chair', 19, 3, 1, 1, 2); P('chest', E, N, 1, 1, 3); P('fireplace', E, 6, 1, 2, 3);
  const sp = spiral([E, 0], 2, (x, y) => x >= E - 1 && x <= E && y <= 1 && !(x === E && y === 0));
  const win = [{ side: 'f', i: 8, kind: 'lancet' }, { side: 'f', i: 13, kind: 'lancet' }, { side: 'b', i: 8, kind: 'lancet' }, { side: 'b', i: 15, kind: 'lancet' }, { side: 'l', i: 3, kind: 'loop' }, { side: 'l', i: 9, kind: 'loop' }, { side: 'r', i: 9, kind: 'win' }, { side: 'f', i: 19, kind: 'win' }];
  const f0 = { f: 0, rooms, doors, props: A.list, stair: sp(0), windows: win };
  const u = R(0, 'solar', 18, 0, E, N, { floor: 'boards' }), B = props([u]), Q = B.P;
  Q('bed', 19, 9, 2, 2, 0); Q('chest', 18, N, 1, 1, 0); Q('fireplace', E, 6, 1, 2, 3); Q('chair', 19, 6, 1, 1, 1); Q('desk', 18, 4, 1, 1, 1);
  const f1 = { f: 1, rooms: [u], doors: [], props: B.list, stair: sp(1), windows: [{ side: 'r', i: 4, kind: 'win' }, { side: 'r', i: 9, kind: 'win' }, { side: 'f', i: 19, kind: 'win' }, { side: 'b', i: 19, kind: 'win' }] };
  return plan({ kind: 'castlehall', tier: 'civic', Wi, Di, floors: [f0, f1], names: { buttery: 'Buttery', pantry: 'Pantry', screens: 'Screens passage', greathall: 'Great hall', parlour: 'Parlour', solar: 'Solar' }, doorX: 4, stone: true, wallH0: 3.4,
    core: { kind: 'spiral', cells: [[E, 0]] }, site: { w: 7, d: 4, storeys: 2, front: 'bailey', doors: [{ side: 'f', at: 1 }], needs: ['inside a castle bailey, facing the keep across the ward'], open: [], rank: 'with a castle' } });
}
