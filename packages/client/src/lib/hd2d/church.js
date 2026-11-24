// @ts-nocheck
// Parish church interior, planned inside the town's church shell (towngen placeChurch + the town.html church kit):
// nave 6 x 7 units with a shallow chancel on its east end and the west tower standing south of the nave's west half,
// entered from the square through the porch on the tower's south face. One unit = 3 cells (+1 for the walls), as for houses.
// England / Low Countries 1450-1550, pre-Reformation: rood screen and loft, side altars, font by the entrance, oak benches.
// Plan rows run from the square (y = 0, the front the camera looks from) northward; x runs west -> east, so the altar is on the right.
import { rngOf } from './interior.js';

export function planChurch(ch, opt = {}) {
  const r = rngOf((opt.seed || 1) * 977 + 31);
  // the shell: tower x 0..8 / y 0..9, nave x 0..18 / y 10..31, chancel x 19..21 / y 14..27 (it stands 1.3 units in from each long wall)
  const TW = 9, TD = 10, NW = 19, ND = 22, Wi = NW + 3, Di = TD + ND, n0 = TD, cy0 = n0 + 4, cy1 = n0 + ND - 5;
  const tower = { id: 0, t: 'tower', x0: 0, y0: 0, x1: TW - 1, y1: TD - 1 }, nave = { id: 1, t: 'nave', x0: 0, y0: n0, x1: NW - 1, y1: Di - 1 }, chancel = { id: 2, t: 'chancel', x0: NW, y0: cy0, x1: Wi - 1, y1: cy1 };
  // bands across the nave (south to north): south aisle, arcade, the nave proper, arcade, north aisle; growth by accretion makes some churches lopsided
  const lop = r() < .3, sA = [n0, n0 + (lop ? 4 : 5)], arcS = sA[1] + 1, mid = [arcS + 1, arcS + 8], arcN = mid[1] + 1, nA = [arcN + 1, Di - 1];
  const scr = 12;   // the screen line: nave to the west, quire and chapels to the east
  const doorX = 4, doors = [{ e: `h,${doorX},0`, x: doorX, y: 0, street: 1, a: -1, b: 0 }];
  const D = (e, p, q, a, b) => doors.push({ e, p, q, a, b });
  for (let x = 3; x <= 5; x++) D(`h,${x},${n0}`, [x, n0 - 1], [x, n0], 0, 1);   // the tower arch
  for (let y = mid[0]; y <= mid[1]; y++) D(`v,${NW},${y}`, [NW - 1, y], [NW, y], 1, 2);   // the chancel arch, the width of the nave proper
  const props = [], P = (type, x, y, w, h, rot, more = {}) => { props.push({ type, room: x >= NW ? 2 : y < n0 ? 0 : 1, x, y, w, h, rot, ...more }); };
  // arcade piers on the bay lines, either side of the nave proper
  const piers = []; for (let x = 2; x < NW - 1; x += 3) for (const y of [arcS, arcN]) { P('pier', x, y, 1, 1, 0); piers.push(x + ',' + y); }
  // the rood screen across the nave proper with its central door; the rood on the loft above; parclose screens across the aisles, each with a door
  const midDoor = [mid[0] + 3, mid[0] + 4];
  for (let y = mid[0]; y <= mid[1]; y++) if (!midDoor.includes(y)) P('screen', scr, y, 1, 1, 1, { end: y === mid[0] - 0 ? 's' : y === mid[1] ? 'n' : '' });
  P('rood', scr, midDoor[0], 1, 2, 1, { walk: 1 });
  const sDoor = sA[0] + 1, nDoor = nA[1] - 1;
  for (let y = sA[0]; y <= arcS; y++) if (y !== sDoor && !piers.includes(scr + ',' + y)) P('parclose', scr, y, 1, 1, 1);
  for (let y = arcN; y <= nA[1]; y++) if (y !== nDoor && !piers.includes(scr + ',' + y)) P('parclose', scr, y, 1, 1, 1);
  // the high altar against the east wall of the chancel, a step (footpace) before it, the Easter sepulchre on the north wall, sedilia on the south
  const ac = Math.round((cy0 + cy1) / 2) - 1;
  P('highaltar', Wi - 1, ac - 1, 1, 3, 3); P('footpace', Wi - 2, ac - 2, 1, 5, 3, { walk: 1 });
  P('tomb', NW, cy1, 2, 1, 0, { sepulchre: 1 }); P('sedilia', NW, cy0, 2, 1, 2); P('candlestand', Wi - 2, ac - 3, 1, 1, 0); P('candlestand', Wi - 2, ac + 3, 1, 1, 0);
  // the quire: stalls along both sides, the lectern in the middle
  P('stall', scr + 2, mid[0], 3, 1, 2); P('stall', scr + 2, mid[1], 3, 1, 0); P('lectern', NW - 3, midDoor[0], 1, 1, 1);
  // side chapels at the east ends of the aisles: an altar on the east wall, a tomb chest, an image
  const chapel = (y0, y1, north) => { const c = Math.floor((y0 + y1) / 2); P('altar', NW - 1, c, 1, 2, 3); P('candlestand', NW - 2, c - 1, 1, 1, 0); P('image', NW - 1, north ? y1 : y0, 1, 1, north ? 0 : 2);
    if (r() < .75) P('tomb', scr + 2, north ? y1 : y0 + 1, 2, 1, north ? 0 : 2); };
  chapel(sA[0], sA[1], false); chapel(nA[0], nA[1], true);
  // the pulpit on the north side at the east end of the nave, against the arcade, facing the people
  P('pulpit', scr - 2, mid[1], 1, 1, 0);
  // oak benches in two blocks either side of the central alley; the font area, the cross-alley at the door and two cells before the screen kept clear
  const benchX = [4, scr - 3], al = [mid[0] + 3, mid[0] + 4];
  for (let x = benchX[0]; x <= benchX[1]; x++) { P('pew', x, mid[0], 1, al[0] - mid[0], 1); P('pew', x, al[1] + 1, 1, mid[1] - al[1], 1); }
  for (let x = 6; x <= scr - 3; x += 1) P('pew', x, nA[0] + 1, 1, 3, 1);   // the north aisle too, women's side
  // the font by the entrance, on the nave's axis near the west wall; St Christopher painted on the north wall opposite the door
  P('font', 1, mid[0] + 3, 2, 2, 0); P('wallpaint', 3, Di - 1, 3, 1, 0, { walk: 1 });
  // the tower: bell ropes hanging through the ringing floor, the parish chest; the newel stair in the south-west corner
  P('bellropes', 3, 4, 3, 2, 0, { walk: 1 }); P('chest', TW - 2, TD - 2, 2, 1, 0, { iron: 1 });
  const core = { kind: 'spiral', cells: [[0, 1]] }, st = 3;
  const sp = (f) => { const c = core.cells[0], nbs = [[c[0] + 1, c[1]], [c[0], c[1] + 1], [c[0], c[1] - 1]].filter(([x, y]) => x >= 0 && y >= 0);
    return { block: f < st - 1 ? [c] : [], well: f === st - 1 ? [c] : [], wellUp: f > 0, nbs, need: [], one: true }; };
  // windows: tall lancets in the north wall, the west end and a great east window; the tower's west light; louvres in the belfry
  const win = [];
  for (let x = 1; x < NW; x += 3) if (x !== 4) win.push({ side: 'b', i: x, kind: 'lancet' });
  win.push({ side: 'l', i: mid[0] + 2, kind: 'lancet' }, { side: 'l', i: mid[0] + 5, kind: 'lancet' }, { side: 'l', i: 4, kind: 'lancet' });
  for (let y = ac - 1; y <= ac + 1; y++) win.push({ side: 'r', i: y, kind: 'lancet' });
  const f0 = { f: 0, rooms: [tower, nave, chancel], doors, windows: win, props, stair: sp(0) };
  // the ringing chamber: ringers' benches round the walls, the ropes; the bell chamber: the bells in their oak frame, louvred openings
  const T = (id, t) => ({ id, t, x0: 0, y0: 0, x1: TW - 1, y1: TD - 1 });
  const f1 = { f: 1, rooms: [T(0, 'ringing')], doors: [], windows: [{ side: 'f', i: 4, kind: 'win' }, { side: 'l', i: 5, kind: 'win' }],
    props: [{ type: 'bellropes', room: 0, x: 3, y: 4, w: 3, h: 2, rot: 0, walk: 1, ring: 1 }, { type: 'form', room: 0, x: 3, y: TD - 1, w: 3, h: 1, rot: 0 }, { type: 'form', room: 0, x: TW - 1, y: 3, w: 1, h: 3, rot: 3 }, { type: 'chest', room: 0, x: 0, y: TD - 1, w: 2, h: 1, rot: 0 }], stair: sp(1) };
  const f2 = { f: 2, rooms: [T(0, 'belfry')], doors: [], windows: [2, 6].map((i) => ({ side: 'f', i, kind: 'louvre' })).concat([{ side: 'l', i: 5, kind: 'louvre' }]),
    props: [{ type: 'bellframe', room: 0, x: 2, y: 3, w: 5, h: 4, rot: 0 }], stair: sp(2) };
  const ZN = { tower: 'Tower', nave: 'Nave', chancel: 'Chancel', ringing: 'Ringing chamber', belfry: 'Bell chamber' };
  const zone = (f, x, y) => { if (f !== 0) return null; if (y < n0) return x <= TW ? ['Tower', 'Base of the tower'] : null; if (x >= NW) return ['Chancel', 'Sanctuary'];
    if (x > scr) return y < arcS ? ['Lady Chapel', 'South aisle'] : y > arcN ? ["Guild chapel", 'North aisle'] : ['Quire', 'Behind the rood screen'];
    return y < arcS ? ['South aisle', 'Nave'] : y > arcN ? ['North aisle', 'Nave'] : ['Nave', 'Parish church']; };
  return { H: { id: 'church', W: 6, D: 7, st, gable: false }, kind: 'church', tier: 'church', Wi, Di, st, P: [], floors: [f0, f1, f2], yard: null, core, doorX, trade: null, wallH0: 4.6, zone, roomNames: ZN, checks: { ok: true, fails: [] } };
}

// ---- the parish church at its ideal shape (towngen will be rebuilt round it): west tower on the axis, a long nave with lean-to aisles,
// a chancel 4 units deep, the south porch opening into the south aisle. Plan rows run from the south (the porch, y = 0) northward; x west -> east.
// opt.bays: nave bays of 3 cells (5-8), opt.seed. Returns the plan plus `site` (what towngen must give it).
import { spiral as spiralK, R as RK, door as doorK, ewin, plan as planK } from './bkit.js';
export function planParish(opt = {}) {
  const r = rngOf((opt.seed || 1) * 613 + 7), bays = opt.bays || 6 + Math.floor(r() * 3), lop = r() < .3;
  const TW = 9, TD = 10, X0 = TW, NL = bays * 3, xC = X0 + NL, CL = 12, Wi = xC + CL;
  const sA = [5, 9], arcS = 10, mid = [11, 18], arcN = 19, nA = [20, lop ? 23 : 24], Di = nA[1] + 1, ty0 = 10, ty1 = ty0 + TD - 1;
  const px0 = X0 + 3, px1 = px0 + 5, doorX = px0 + 2;
  const tower = RK(0, 'tower', 0, ty0, TW - 1, ty1), nave = RK(1, 'nave', X0, sA[0], xC - 1, Di - 1), chancel = RK(2, 'chancel', xC, mid[0], Wi - 1, mid[1]), porch = RK(3, 'porch', px0, 0, px1, sA[0] - 1, { floor: 'pave' });
  const rooms = [tower, nave, chancel, porch], doors = [doorK(`h,${doorX},0`, -1, 3, { street: 1 }), doorK(`h,${doorX + 1},0`, -1, 3, { street: 1 })];
  for (const x of [doorX, doorX + 1]) doors.push(doorK(`h,${x},${sA[0]}`, 3, 1));                       // the south door into the aisle
  for (let y = mid[0] + 2; y <= mid[1] - 2; y++) doors.push(doorK(`v,${X0},${y}`, 0, 1));                 // the tower arch
  for (let y = mid[0]; y <= mid[1]; y++) doors.push(doorK(`v,${xC},${y}`, 1, 2));                         // the chancel arch
  const props = [], roomOf = (x, y) => rooms.find((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1)?.id ?? -1;
  const P = (type, x, y, w, h, rot, more = {}) => props.push({ type, room: roomOf(x, y), x, y, w, h, rot, ...more });
  const scr = xC - 1, pcl = xC - 6, alley = [14, 15];
  // arcade piers on the bay lines; not where a parclose screen runs
  const piers = new Set(); for (let x = X0 + 2; x < xC - 1; x += 3) for (const y of [arcS, arcN]) { P('pier', x, y, 1, 1, 0); piers.add(x + ',' + y); }
  // the rood screen across the chancel arch with its middle door, the rood on its loft above; parclose screens close the aisle chapels
  for (let y = mid[0]; y <= mid[1]; y++) if (!alley.includes(y)) P('screen', scr, y, 1, 1, 1, { end: y === mid[0] ? 's' : y === mid[1] ? 'n' : '' });
  P('rood', scr, alley[0], 1, 2, 1, { walk: 1 });
  const sDoor = sA[0] + 2, nDoor = nA[0] + 2;
  for (let y = sA[0]; y <= sA[1]; y++) if (y !== sDoor && !piers.has(pcl + ',' + y)) P('parclose', pcl, y, 1, 1, 1);
  for (let y = nA[0]; y <= nA[1]; y++) if (y !== nDoor && !piers.has(pcl + ',' + y)) P('parclose', pcl, y, 1, 1, 1);
  // the chancel: two ranks of stalls each side, the eagle lectern, sedilia on the south wall and the Easter sepulchre on the north, the high altar on its footpace
  P('stall', xC + 1, mid[0], 3, 1, 2); P('stall', xC + 1, mid[1], 3, 1, 0); P('stall', xC + 4, mid[0], 3, 1, 2); P('stall', xC + 4, mid[1], 3, 1, 0); P('lectern', xC + 3, alley[0], 1, 1, 1);
  const ac = alley[0]; P('highaltar', Wi - 1, ac - 1, 1, 3, 3); P('footpace', Wi - 2, ac - 2, 1, 5, 3, { walk: 1 }); P('candlestand', Wi - 2, ac - 3, 1, 1, 0); P('candlestand', Wi - 2, ac + 3, 1, 1, 0);
  P('sedilia', Wi - 5, mid[0], 2, 1, 2); P('tomb', Wi - 5, mid[1], 2, 1, 0, { sepulchre: 1 });
  // chapels at the east ends of the aisles: altar on the east wall, a light, an image, often a founder's tomb
  const chapel = (y0, y1, north) => { const c = Math.floor((y0 + y1) / 2); P('altar', xC - 1, c, 1, 2, 3); P('candlestand', xC - 1, c - 1, 1, 1, 0); P('image', xC - 1, north ? y1 : y0, 1, 1, north ? 0 : 2);
    if (r() < .75) P('tomb', pcl + 2, north ? y1 : y0, 2, 1, north ? 0 : 2); };
  chapel(sA[0], sA[1], false); chapel(nA[0], nA[1], true);
  // the pulpit against the north arcade near the east end, facing the people; benches in two blocks either side of the alley
  P('pulpit', xC - 4, mid[1], 1, 1, 0);
  for (let x = X0 + 4; x <= xC - 5; x++) { P('pew', x, mid[0], 1, 3, 1); if (x !== xC - 4) P('pew', x, alley[1] + 1, 1, 3, 1); }
  for (let x = X0 + 3; x <= pcl - 2; x++) if ((x - X0) % 3 !== 2) P('pew', x, nA[0] + 1, 1, 3, 1);
  // the font by the south door (baptism begins at the church door), St Christopher painted on the north wall facing it
  P('font', X0 + 1, sA[0] + 1, 2, 2, 0); P('wallpaint', doorX - 1, Di - 1, 3, 1, 0, { walk: 1 });
  // a bench along the porch walls (parish business, weddings at the church door), a holy water stoup by the inner door
  P('form', px0, 1, 1, 2, 1); P('form', px1, 1, 1, 2, 3);
  // the tower: ropes hanging through the ringing floor, the parish chest; the newel stair in the south-west corner
  P('bellropes', 3, ty0 + 4, 3, 2, 0, { walk: 1 }); P('chest', TW - 3, ty0, 2, 1, 2, { iron: 1 });
  const inT = (x, y) => x >= 0 && x < TW && y >= ty0 && y <= ty1, sp = spiralK([0, ty0], 3, inT);
  // windows: three-light lancets along the aisles, the west window of the tower, a great east window, the chancel's side windows
  const win = [];
  for (let x = X0 + 1; x < xC; x += 3) { if (x < px0 - 1 || x > px1 + 1) win.push(ewin(`h,${x},${sA[0]}`, 'lancet')); win.push({ side: 'b', i: x, kind: 'lancet' }); }
  win.push(ewin(`v,${X0},${sA[0] + 2}`, 'lancet'), ewin(`v,${X0},${nA[0] + 2}`, 'lancet'), { side: 'l', i: alley[0], kind: 'lancet' });
  for (let y = ac - 1; y <= ac + 1; y++) win.push({ side: 'r', i: y, kind: 'lancet' });
  for (let x = xC + 2; x < Wi - 1; x += 3) win.push(ewin(`h,${x},${mid[0]}`, 'lancet'), ewin(`h,${x},${mid[1] + 1}`, 'lancet'));
  win.push(ewin(`v,${px0},2`, 'win'), ewin(`v,${px1 + 1},2`, 'win'));
  const f0 = { f: 0, rooms, doors, windows: win, props, stair: sp(0) };
  const T = (id, t) => RK(id, t, 0, ty0, TW - 1, ty1);
  const f1 = { f: 1, rooms: [T(0, 'ringing')], doors: [], windows: [{ side: 'l', i: alley[0], kind: 'win' }, ewin(`h,4,${ty0}`, 'win')],
    props: [{ type: 'bellropes', room: 0, x: 3, y: ty0 + 4, w: 3, h: 2, rot: 0, walk: 1, ring: 1 }, { type: 'form', room: 0, x: 3, y: ty1, w: 3, h: 1, rot: 0 }, { type: 'form', room: 0, x: TW - 1, y: ty0 + 3, w: 1, h: 3, rot: 3 }, { type: 'chest', room: 0, x: 0, y: ty1, w: 2, h: 1, rot: 0 }], stair: sp(1) };
  const f2 = { f: 2, rooms: [T(0, 'belfry')], doors: [], windows: [ewin(`h,2,${ty0}`, 'louvre'), ewin(`h,6,${ty0}`, 'louvre'), { side: 'l', i: alley[0], kind: 'louvre' }, ewin(`h,4,${ty1 + 1}`, 'louvre')],
    props: [{ type: 'bellframe', room: 0, x: 2, y: ty0 + 3, w: 5, h: 4, rot: 0 }], stair: sp(2) };
  const ZN = { tower: 'Tower', nave: 'Nave', chancel: 'Chancel', porch: 'South porch', ringing: 'Ringing chamber', belfry: 'Bell chamber' };
  const zone = (f, x, y) => { if (f !== 0) return null; if (x < X0) return ['Tower', 'Base of the tower']; if (y < sA[0]) return ['South porch', 'Parish church']; if (x >= xC) return x >= Wi - 3 ? ['Sanctuary', 'Chancel'] : ['Chancel', 'Quire'];
    if (x > pcl) return y < arcS ? ['Lady Chapel', 'South aisle'] : y > arcN ? ['Guild chapel', 'North aisle'] : ['Nave', 'Before the rood screen'];
    return y < arcS ? ['South aisle', 'Nave'] : y > arcN ? ['North aisle', 'Nave'] : ['Nave', 'Parish church']; };
  const U = (c) => Math.ceil(c / 3);
  const site = { w: U(Wi), d: U(Di), storeys: 1, tower: { w: 3, d: 3, storeys: 3, at: 'west, on the axis' }, front: 'square', doors: [{ side: 'f', at: U(doorX) }], needs: ['churchyard all round (burials, processions)', 'east end free of buildings'],
    open: [], rank: '0+, one per parish (a town of rank 2+ has several parishes)' };
  // a great town church (XL): a clerestory lifts the nave and chancel over the aisles, the west tower rises a stage higher
  const lift = opt.xl ? [{ x0: X0, y0: mid[0], x1: Wi - 1, y1: mid[1], t: 2 }, { x0: 0, y0: ty0, x1: TW - 1, y1: ty1, t: 4 }] : null;
  return planK({ kind: 'church', tier: 'church', Wi, Di, floors: [f0, f1, f2], names: ZN, zone, site, core: { kind: 'spiral', cells: [[0, ty0]] }, doorX, wallH0: opt.xl ? 5.2 : 4.6, lift });
}
