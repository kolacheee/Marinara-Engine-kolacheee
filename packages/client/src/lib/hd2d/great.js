// @ts-nocheck
// great.js: the city's great buildings, at their ideal shells. England / Low Countries 1450-1550, before the Reformation.
//   planCathedral: a cruciform cathedral church. Two west towers, an aisled nave, the crossing under its tower, transepts with chapels on
//                  their east sides, the aisled quire with the bishop's throne and the high altar, the retrochoir (a saint's shrine) and the
//                  Lady Chapel at the east end; the cloister on the north side with the chapter house off its east walk. A monastic cathedral
//                  (opt.monastic: a priory, Canterbury or Norwich) has the monks' ranges round the cloister too: cellarer, refectory, dormitory.
//   planAbbey:     the same church on a smaller scale (no west towers, a short quire) with the full claustral ranges: a Benedictine abbey.
//   planChapel:    a chapel of ease (or a bridge chapel): one cell of nave and chancel under one roof, a bellcote, no aisles, no tower.
//   planWarehouse: a merchants' storehouse (the Hanse kontor, a staple): three floors of lofts over a vaulted ground floor, a hoist in the gable.
//   planMint:      the king's (or the city's) mint: the warden's office on the street, the melting house, the coining room, the strong room.
//   planRopewalk:  a rope walk: a long low open-sided shed where the yarn is laid out and twisted, the spinner's wheel at the head.
//   planBourse:    an exchange (Antwerp's of 1531): a paved court ringed by arcades where the merchants meet, galleries over them.
//   planWindmill:  a post mill on the town rampart: the buck on its post, the sails turning in the wind, a ladder and tail pole.
// Plan rows run from the front (y = 0, the side the camera looks from) back; x runs west -> east (the altar to the right). One unit = 3 cells (+1).
import { rngOf, spiral, R, door, ewin, plan, props, noStair } from './bkit.js';

const U = (c) => Math.ceil(c / 3);

// ---- the cathedral (and, smaller, the abbey church with its cloister) ----
export function planCathedral(opt = {}) {
  const r = rngOf((opt.seed || 1) * 1291 + 17), monastic = !!opt.monastic, abbey = !!opt.abbey;
  const NB = opt.naveBays || (abbey ? 7 : 10), QB = opt.quireBays || (abbey ? 4 : 6), wt = !abbey;          // bays of the nave and the quire; west towers
  const TA = abbey ? 7 : 10, AW = 6, MV = 11;                                                                 // the transept arm's depth beyond the aisle; aisle and main vessel widths
  const yA0 = TA, yAr = TA + AW, yM0 = yAr + 1, yM1 = yM0 + MV - 1, yNr = yM1 + 1, yN1 = yNr + AW, yB = yN1 + 1;   // south aisle (its arcade row yAr), main vessel, north aisle
  const X0 = wt ? 9 : 0, XN = X0 + NB * 3, XC = XN + 11, XQ1 = XC + QB * 3 - 1, XR = XQ1 + 1, XL = XR + 3, Wi = XL + (abbey ? 8 : 10);
  const claustral = monastic || abbey, CD = abbey ? 18 : 22, yC0 = yB, yC1 = yC0 + CD - 1, yRef = yC1 + 1, Di = claustral ? yRef + 7 : yC1 + 1;
  const NT1 = yB + TA - 1;                                                                                      // north transept's end
  const rooms = [], doors = [], add = (t, x0, y0, x1, y1, more = {}) => { const q = R(rooms.length, t, x0, y0, x1, y1, more); rooms.push(q); return q; };
  const swt = wt ? add('swtower', 0, yA0, X0 - 1, yAr, { floor: 'pave' }) : null, nwt = wt ? add('nwtower', 0, yNr, X0 - 1, yN1, { floor: 'pave' }) : null;
  const nave = add('nave', 0, yM0, XN - 1, yM1, { floor: 'pave' }), sa = add('saisle', X0, yA0, XN - 1, yAr, { floor: 'pave' }), na = add('naisle', X0, yNr, XN - 1, yN1, { floor: 'pave' });
  const cr = add('crossing', XN, yM0, XC - 1, yM1, { floor: 'pave' }), st = add('stransept', XN, 0, XC - 1, yAr, { floor: 'pave' }), nt = add('ntransept', XN, yNr, XC - 1, NT1, { floor: 'pave' });
  const qu = add('quire', XC, yM0, XQ1, yM1, { floor: 'tiles' }), sq = add('squireaisle', XC, yA0, XQ1, yAr, { floor: 'pave' }), nq = add('nquireaisle', XC, yNr, XQ1, yN1, { floor: 'pave' });
  const rc = add('retrochoir', XR, yA0, XL - 1, yN1, { floor: 'tiles' }), lc = add('ladychapel', XL, yM0 - 1, Wi - 1, yM1 + 1, { floor: 'tiles' });
  // the cloister north of the nave: four walks round the garth, the chapter house off the east walk beyond the north transept
  const cx0 = X0, cx1 = XN - 1, sw = add('cwalk', cx0, yC0, cx1, yC0 + 1, { floor: 'pave', arcade: 1 }), ww = add('cwalk', cx0, yC0 + 2, cx0 + 1, yC1 - 2, { floor: 'pave', arcade: 1 });
  const ew = add('cwalk', cx1 - 1, yC0 + 2, cx1, yC1 - 2, { floor: 'pave', arcade: 1 }), nw = add('cwalk', cx0, yC1 - 1, cx1, yC1, { floor: 'pave', arcade: 1 });
  const garth = add('garth', cx0 + 2, yC0 + 2, cx1 - 2, yC1 - 2, { open: 1, floor: 'grass' });
  const chY0 = NT1 + 1, chY1 = Math.min(chY0 + 11, claustral ? yRef - 1 : yC1), ch = add('chapterhouse', XN, chY0, XC - 1, chY1, { floor: 'tiles' });
  let cel = null, kit = null, ref = null, warm = null;
  if (claustral) { cel = add('cellarium', 0, yC0, X0 ? X0 - 1 : 0, yC1, { floor: 'worn' }); ref = add('refectory', cx0, yRef, cx1, Di - 1, { floor: 'pave' });
    kit = X0 ? add('kitchen', 0, yRef, X0 - 1, Di - 1, { floor: 'worn' }) : null; warm = add('warming', XN, chY1 + 1, XC - 1, Di - 1, { floor: 'worn' }); }
  if (!X0 && cel) { rooms.splice(rooms.indexOf(cel), 1); cel = null; }
  // doors: the west door and the south transept's portal to the close; the arcades open between the piers
  const D = (e, a, b, more) => doors.push(door(e, a.id, b.id, more)), piersX = new Set();
  for (let x = X0 + 2; x < XN - 1; x += 3) piersX.add(x); for (let x = XC + 2; x < XQ1; x += 3) piersX.add(x);
  const mid = (yM0 + yM1) >> 1;
  for (const y of [mid - 1, mid, mid + 1]) doors.push(door(`v,0,${y}`, -1, nave.id, { street: 1 }));                     // the great west door
  for (const x of [XN + 4, XN + 5, XN + 6]) doors.push(door(`h,${x},0`, -1, st.id, { street: 1 }));                        // the south transept portal on the close
  for (let x = X0; x < XN; x++) if (!piersX.has(x)) { D(`h,${x},${yM0}`, sa, nave); D(`h,${x},${yNr}`, nave, na); }       // the nave arcades
  for (let x = XC; x <= XQ1; x++) if (!piersX.has(x)) { D(`h,${x},${yM0}`, sq, qu); D(`h,${x},${yNr}`, qu, nq); }         // the quire arcades (stalls stand in them)
  if (wt) { for (let y = yA0 + 1; y < yAr; y++) D(`v,${X0},${y}`, swt, sa); for (let y = yNr + 1; y < yN1; y++) D(`v,${X0},${y}`, nwt, na); D(`h,4,${yM0}`, swt, nave); D(`h,4,${yNr}`, nave, nwt); }
  for (let y = yM0; y <= yM1; y++) { D(`v,${XN},${y}`, nave, cr); D(`v,${XC},${y}`, cr, qu); }                            // the pulpitum and the quire screen stand at these lines
  for (let x = XN; x < XC; x++) { D(`h,${x},${yM0}`, st, cr); D(`h,${x},${yNr}`, cr, nt); }
  for (let y = yA0; y < yAr; y++) { D(`v,${XN},${y}`, sa, st); D(`v,${XC},${y}`, st, sq); } for (let y = yNr + 1; y <= yN1; y++) { D(`v,${XN},${y}`, na, nt); D(`v,${XC},${y}`, nt, nq); }
  for (let y = yA0; y < yAr; y++) D(`v,${XR},${y}`, sq, rc); for (let y = yNr + 1; y <= yN1; y++) D(`v,${XR},${y}`, nq, rc);
  for (let y = yM0; y <= yM1; y++) D(`v,${XL},${y}`, rc, lc);
  D(`h,${X0 + 1},${yC0}`, na, sw); D(`h,${XN - 2},${yC0}`, na, sw);                                                       // the west and east processional doors into the cloister
  for (const x of [cx0, cx0 + 1]) { D(`h,${x},${yC0 + 2}`, sw, ww); D(`h,${x},${yC1 - 1}`, ww, nw); } for (const x of [cx1 - 1, cx1]) { D(`h,${x},${yC0 + 2}`, sw, ew); D(`h,${x},${yC1 - 1}`, ew, nw); }
  D(`h,${(cx0 + cx1) >> 1},${yC0 + 2}`, sw, garth); D(`v,${cx0 + 2},${(yC0 + yC1) >> 1}`, ww, garth); D(`v,${cx1 - 1},${(yC0 + yC1) >> 1}`, garth, ew); D(`h,${(cx0 + cx1) >> 1},${yC1 - 1}`, garth, nw);
  const chMid = (chY0 + chY1) >> 1; if (chY0 <= yC1 - 2) { D(`v,${XN},${chMid}`, ew, ch); D(`v,${XN},${chMid + 1}`, ew, ch); }
  D(`h,${XN + 5},${chY0}`, nt, ch); D(`v,${XN},${Math.min(NT1, yC1 - 2)}`, ew, nt);                                         // the slype from the transept, the cloister door of the transept
  if (claustral) { if (cel) { D(`v,${X0},${yC0 + 4}`, cel, ww); D(`v,${X0},${yC1 - 4}`, cel, ww); }
    for (const x of [(cx0 + cx1) >> 1, ((cx0 + cx1) >> 1) + 1]) D(`h,${x},${yRef}`, nw, ref);
    if (kit) { D(`v,${X0},${yRef + 3}`, kit, ref); if (cel) D(`h,4,${yRef}`, cel, kit); }
    D(`h,${XN + 3},${chY1 + 1}`, ch, warm); D(`v,${XN},${Di - 2}`, ref, warm); }
  // props
  const A = props(rooms), P = A.P;
  for (const x of piersX) { if (x < XN) { P('pier', x, yAr, 1, 1, 0); P('pier', x, yNr, 1, 1, 0); } else { P('pier', x, yAr, 1, 1, 0); P('pier', x, yNr, 1, 1, 0); } }
  for (const [x, y] of [[XN, yM0], [XC - 1, yM0], [XN, yM1], [XC - 1, yM1]]) P('pier', x, y, 1, 1, 0);                    // the crossing's four great piers
  // the nave: open floor (the people stand), the pulpit on a pier, the font by the west door, chantry tombs between the piers, a lay altar before the screen
  P('pulpit', X0 + 3 * Math.floor(NB / 2) + 2, yM1, 1, 1, 0); P('font', 2, yM0 + 1, 2, 2, 0); P('altar', XN - 1, mid - 1, 1, 3, 3);
  for (let x = X0 + 3; x < XN - 3; x += 6) { P('tomb', x, yAr - 1, 2, 1, 0); if (r() < .6) P('tomb', x + 3, yNr + 1, 2, 1, 2); }
  for (let y = yM0; y <= yM1; y++) if (Math.abs(y - mid) > 1) P('screen', XN - 1, y, 1, 1, 1, { end: y === yM0 ? 's' : y === yM1 ? 'n' : '' });   // the pulpitum, its door in the middle
  P('rood', XN - 1, mid - 1, 1, 3, 1, { walk: 1 });
  // the transepts: chapels with altars on their east walls, parclose screens between them; the tomb of a bishop
  for (const [q, y0, y1] of [[st, 1, yAr - 1], [nt, yNr + 2, NT1 - 1]]) { for (let y = y0; y + 1 <= y1; y += 4) { P('altar', XC - 1, y, 1, 2, 3); P('candlestand', XC - 1, y + 2, 1, 1, 0); } P('tomb', XN + 1, (y0 + y1) >> 1, 2, 1, 1); }
  // the quire: two ranks of stalls along each arcade with their desks, the bishop's throne on the south side, the eagle lectern, the high altar and its reredos
  for (let x = XC + 1; x <= XQ1 - 9; x += 3) { P('stall', x, yM0, 3, 1, 2); P('stall', x, yM1, 3, 1, 0); P('stall', x, yM0 + 1, 3, 1, 2); P('stall', x, yM1 - 1, 3, 1, 0); }
  P('chairstate', XQ1 - 5, yM0, 1, 1, 2); P('lectern', XC + 4, mid, 1, 1, 1); P('sedilia', XQ1 - 3, yM0, 2, 1, 2); P('tomb', XQ1 - 3, yM1, 2, 1, 0, { sepulchre: 1 });
  P('highaltar', XQ1, mid - 1, 1, 3, 3); P('footpace', XQ1 - 1, mid - 2, 1, 5, 3, { walk: 1 }); P('candlestand', XQ1 - 1, mid - 3, 1, 1, 0); P('candlestand', XQ1 - 1, mid + 3, 1, 1, 0);
  // the retrochoir: the saint's shrine behind the high altar, where the pilgrims come round; the Lady Chapel's altar at the far east
  P('tomb', XR + 1, mid - 1, 1, 3, 1, { shrine: 1 }); P('candlestand', XR + 1, mid - 2, 1, 1, 0); P('candlestand', XR + 1, mid + 2, 1, 1, 0);
  P('altar', Wi - 1, mid - 1, 1, 3, 3); P('footpace', Wi - 2, mid - 2, 1, 5, 3, { walk: 1 }); P('image', Wi - 1, yM0 - 1, 1, 1, 2); P('sedilia', Wi - 4, yM0 - 1, 2, 1, 2);
  for (let x = XL + 2; x <= Wi - 4; x += 2) P('form', x, mid + 2, 1, 2, 1);
  // the cloister: the monks' or canons' carrels in the north walk, the laver by the refectory, the well in the garth
  for (let x = cx0 + 3; x <= cx1 - 3; x += 3) P('desk', x, yC1, 1, 1, 0); P('well', (cx0 + cx1) >> 1, (yC0 + yC1) >> 1, 1, 1, 0);
  if (claustral) P('laver', ((cx0 + cx1) >> 1) - 4, yC1 - 1, 3, 1, 0);
  // the chapter house: a stone bench round the walls, the dean's (prior's) seat facing the door, a lectern
  P('sbench', XN, chY0 + 1, 1, chY1 - chY0 - 1, 1); P('sbench', XC - 1, chY0 + 1, 1, chY1 - chY0 - 1, 3); P('sbench', XN + 1, chY1, XC - XN - 2, 1, 0); P('chair', XN + 5, chY1 - 1, 1, 1, 0); P('lectern', XN + 5, chMid, 1, 1, 0);
  if (claustral) {
    if (cel) { for (let y = yC0 + 1; y < yC1; y += 3) { P('barrel', 0, y, 1, 1, 1); P('sack', X0 - 1, y + 1, 1, 1, 3); } P('table', 3, (yC0 + yC1) >> 1, 2, 1, 0); }
    for (let x = cx0 + 2; x <= cx1 - 6; x += 6) { P('longtable', x, Di - 2, 4, 1, 0, { nochair: 1 }); P('form', x, Di - 3, 4, 1, 2); }
    P('hightable', cx1, yRef + 1, 1, 4, 3); P('pulpit', cx0 + 8, Di - 1, 1, 1, 0);
    if (kit) { P('fireplace', 0, yRef + 1, 1, 2, 1); P('oven', 0, Di - 3, 2, 2, 1); P('table', 3, yRef + 2, 2, 1, 0); P('woodpile', X0 - 1, Di - 1, 1, 1, 3); }
    P('fireplace', XC - 1, chY1 + 3, 1, 2, 3); P('form', XN + 3, chY1 + 3, 3, 1, 0); }
  // stairs: a newel in each west tower (to the ringing floors), in the warming house to the dormitory
  const sts = []; const towerIn = (q) => (x, y) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1;
  const spS = wt ? spiral([0, yA0], 3, towerIn(swt)) : null, spN = wt ? spiral([0, yN1], 3, towerIn(nwt)) : null;
  const spD = claustral ? spiral([XC - 1, Di - 1], 2, (x, y, f) => f === 0 ? x >= warm.x0 && x <= warm.x1 && y >= warm.y0 && y <= warm.y1 : x >= XN && x <= XC - 1 && y >= chY0 && y <= Di - 1) : null;
  const stair0 = spS || spD; const both = (f) => { const a = [[spS, 3], [spN, 3], [spD, 2]].filter(([s, n]) => s && f < n).map(([s]) => s(f)); const o = { block: [], well: [], need: [], nbs: [] }; for (const s of a) { o.block.push(...s.block); o.well.push(...s.well); o.nbs.push(...s.nbs); } o.wellUp = f > 0; o.one = a.length === 1; return o; };
  // windows: the great west window, lancets down the aisles and round the east end, the transepts' end windows, the Lady Chapel's east window
  const win = [];
  for (const y of [mid - 1, mid, mid + 1]) win.push({ side: 'l', i: y, kind: 'lancet' });
  for (let x = XN + 1; x < XC - 1; x += 2) if (Math.abs(x - XN - 5) > 1) win.push({ side: 'f', i: x, kind: 'lancet' });
  for (let x = X0 + 1; x < XN; x += 3) win.push(ewin(`h,${x},${yA0}`, 'lancet')); for (let x = XC + 1; x <= XQ1; x += 3) win.push(ewin(`h,${x},${yA0}`, 'lancet'));
  for (let y = yM0; y <= yM1; y += 2) win.push({ side: 'r', i: y, kind: 'lancet' });
  const f0 = { f: 0, rooms, doors, props: A.list, windows: win, stair: stair0 ? both(0) : noStair() };
  const floors = [f0];
  // upper floors: the west towers' ringing chamber and bell chamber; over the east range the dormitory (a monastery)
  if (wt || claustral) for (let f = 1; f <= (wt ? 2 : 1); f++) { const rs = [], ds = [], ws = [];
    if (wt) { rs.push(R(rs.length, f === 1 ? 'ringing' : 'belfry', 0, yA0, X0 - 1, yAr), R(rs.length + 1, f === 1 ? 'ringing' : 'belfry', 0, yNr, X0 - 1, yN1)); ws.push({ side: 'l', i: yA0 + 3, kind: f === 2 ? 'louvre' : 'win' }, { side: 'l', i: yN1 - 3, kind: f === 2 ? 'louvre' : 'win' }); }
    if (claustral && f === 1) { rs.push(R(rs.length, 'dorter', XN, chY0, XC - 1, Di - 1, { floor: 'boards' })); for (let y = chY0 + 2; y < Di - 1; y += 3) ws.push({ side: 'b', i: XN + 2, kind: 'win' }); }
    const Q = props(rs).P, pl = []; const QP = (...a) => { Q(...a); };
    const B = props(rs); if (wt && f === 1) { B.P('bellropes', 3, yA0 + 2, 3, 2, 0, { walk: 1, ring: 1 }); B.P('bellropes', 3, yN1 - 3, 3, 2, 0, { walk: 1, ring: 1 }); }
    if (wt && f === 2) { B.P('bellframe', 2, yA0 + 1, 5, 4, 0); B.P('bellframe', 2, yN1 - 4, 5, 4, 0); }
    if (claustral && f === 1) for (let y = chY0 + 1; y < Di - 4; y += 2) { B.P('pallet', XN, y, 1, 2, 1); B.P('pallet', XC - 1, y, 1, 2, 3); }
    const sb = both(f); floors.push({ f, rooms: rs, doors: ds, props: B.list, windows: ws, stair: sb, extraStarts: sb.nbs.slice(1) }); void QP; void pl; }
  // heights: the nave, crossing, transepts, quire and Lady Chapel stand lofty over the aisles; the crossing tower and the west towers rise above all
  const lift = [{ x0: 0, y0: yM0, x1: XQ1, y1: yM1, t: 3 }, { x0: XN, y0: 0, x1: XC - 1, y1: NT1, t: 3 }, { x0: XR, y0: yM0, x1: Wi - 1, y1: yM1, t: 2 },
    { x0: XN, y0: yM0, x1: XC - 1, y1: yM1, t: abbey ? 4 : 5 }];
  if (wt) lift.push({ x0: 0, y0: yA0, x1: X0 - 1, y1: yAr, t: 4 }, { x0: 0, y0: yNr, x1: X0 - 1, y1: yN1, t: 4 }); if (claustral) lift.push({ x0: cx0, y0: yRef, x1: cx1, y1: Di - 1, t: 2 });
  const names = { swtower: 'South-west tower', nwtower: 'North-west tower', nave: 'Nave', saisle: 'South aisle', naisle: 'North aisle', crossing: 'Crossing', stransept: 'South transept', ntransept: 'North transept',
    quire: 'Quire', squireaisle: 'South quire aisle', nquireaisle: 'North quire aisle', retrochoir: 'Retrochoir', ladychapel: 'Lady Chapel', cwalk: 'Cloister walk', garth: 'Cloister garth', chapterhouse: 'Chapter house',
    cellarium: 'Cellarium', refectory: 'Refectory', kitchen: 'Kitchen', warming: 'Warming house', ringing: 'Ringing chamber', belfry: 'Bell chamber', dorter: 'Dormitory' };
  const zone = (f, x, y) => { if (f !== 0) return null; if (x >= XC && x <= XQ1 && y >= yM0 && y <= yM1) return x >= XQ1 - 4 ? ['Presbytery', 'Quire'] : ['Quire', abbey ? 'Abbey church' : 'Cathedral']; if (x >= XR && x < XL) return ['Retrochoir', 'The shrine']; return null; };
  const site = { w: U(Wi), d: U(Di), storeys: 3, front: 'close', doors: [{ side: 'f', at: U(XN + 5) }, { side: 'l', at: U(mid) }], needs: ['a close or precinct round it', 'burial ground on the south and east'],
    open: [{ x: U(cx0 + 2), y: U(yC0 + 2), w: U(cx1 - cx0 - 3), d: U(yC1 - yC0 - 3), what: 'cloister garth' }], rank: abbey ? 'monastery precinct' : 'one per diocese: the bishop\'s city' };
  return plan({ kind: abbey ? 'abbey' : 'cathedral', tier: 'church', Wi, Di, floors, names, zone, site, doorX: XN + 5, posts: false, stone: true, wallH0: abbey ? 5 : 5.6, lift,
    core: wt ? { kind: 'spiral', cells: [[0, yA0]] } : null });
}
export const planAbbey = (opt = {}) => planCathedral({ ...opt, abbey: 1, monastic: 1 });

// ---- a chapel of ease or a bridge chapel: nave and chancel in one, a bellcote over the west gable ----
export function planChapel(opt = {}) {
  const bays = opt.bays || 3, Wi = bays * 3 + 7, Di = 10, E = Wi - 1, N = Di - 1, xs = Wi - 6;
  const nave = R(0, 'cnave', 0, 0, xs - 1, N, { floor: 'pave' }), chancel = R(1, 'cchancel', xs, 0, E, N, { floor: 'tiles' }), rooms = [nave, chancel];
  const doors = [door('h,2,0', -1, 0, { street: 1 }), door('h,3,0', -1, 0, { street: 1 })]; for (let y = 2; y <= N - 2; y++) doors.push(door(`v,${xs},${y}`, 0, 1));
  const A = props(rooms), P = A.P;
  P('screen', xs - 1, 1, 1, 1, 1, { end: 's' }); P('screen', xs - 1, N - 1, 1, 1, 1, { end: 'n' }); P('rood', xs - 1, 3, 1, 4, 1, { walk: 1 });
  P('highaltar', E, 3, 1, 3, 3); P('footpace', E - 1, 2, 1, 5, 3, { walk: 1 }); P('candlestand', E - 1, 1, 1, 1, 0); P('candlestand', E - 1, 7, 1, 1, 0); P('sedilia', E - 3, 0, 2, 1, 2);
  for (let x = 5; x < xs - 2; x += 2) { P('pew', x, 1, 1, 3, 1); P('pew', x, N - 3, 1, 3, 1); } P('font', 0, N - 1, 1, 1, 0); P('image', 0, 2, 1, 1, 1); P('chest', 1, N, 1, 1, 0, { iron: 1 });
  if (opt.bridge) P('image', xs - 2, 0, 1, 1, 2);   // the bridge chapel's patron (St Thomas, St Nicholas): travellers give for the bridge's upkeep
  const win = [{ side: 'f', i: 6, kind: 'lancet' }, { side: 'f', i: 9, kind: 'lancet' }, { side: 'b', i: 4, kind: 'lancet' }, { side: 'b', i: 8, kind: 'lancet' }, { side: 'r', i: 4, kind: 'lancet' }, { side: 'r', i: 5, kind: 'lancet' }, { side: 'l', i: 5, kind: 'win' }];
  for (let x = xs + 1; x < E; x += 3) win.push({ side: 'f', i: x, kind: 'lancet' });
  const names = { cnave: 'Nave', cchancel: 'Chancel' };
  const site = { w: U(Wi), d: U(Di), storeys: 1, front: 'street', doors: [{ side: 'f', at: 1 }], needs: [opt.bridge ? 'the bridge foot or a pier of the bridge' : 'a suburb or hamlet far from its parish church'], open: [], rank: 'city 1-4' };
  return plan({ kind: opt.bridge ? 'bridgechapel' : 'chapel', tier: 'church', Wi, Di, floors: [{ f: 0, rooms, doors, props: A.list, windows: win, stair: noStair() }], names, site, doorX: 2, posts: false, stone: true, wallH0: 4 });
}

// ---- a merchants' warehouse: vaulted ground floor for wine and wool, lofts over with a hoist ----
export function planWarehouse(opt = {}) {
  const Wi = opt.W ? opt.W * 3 + 1 : 13, Di = opt.D ? opt.D * 3 + 1 : 19, E = Wi - 1, N = Di - 1, st = opt.storeys || 3;
  const floors = [];
  for (let f = 0; f < st; f++) { const q = R(0, f === 0 ? 'undercroft' : 'loft', 0, 0, E, N, { floor: f === 0 ? 'pave' : 'boards' }), A = props([q]), P = A.P;
    if (f === 0) { for (let y = 3; y < N - 1; y += 4) for (const x of [Math.floor(Wi / 3), Math.floor(2 * Wi / 3)]) P('pier', x, y, 1, 1, 0); for (let y = 1; y < N; y += 2) { P('tun', 0, y, 1, 1, 1); P('tun', E, y, 1, 1, 3); } P('scales', 3, 1, 2, 1, 0); P('desk', E - 2, 1, 1, 1, 0); }
    else { for (let y = 2; y < N - 1; y += 3) { P('bale', 0, y, 1, 2, 1); P('bale', E, y, 1, 2, 3); P('sack', 2, y, 1, 1, 1); P('crate', E - 2, y + 1, 1, 1, 3); } P('hoist', (Wi >> 1), 0, 1, 1, 2); }
    floors.push({ f, rooms: [q], doors: f === 0 ? [door(`h,${Wi >> 1},0`, -1, 0, { street: 1 }), door(`h,${(Wi >> 1) + 1},0`, -1, 0, { street: 1 })] : [], props: A.list, windows: [{ side: 'f', i: 2, kind: f ? 'shutters' : 'grate' }, { side: 'f', i: E - 2, kind: f ? 'shutters' : 'grate' }, { side: 'f', i: Wi >> 1, kind: f ? 'shut' : 'grate' }, { side: 'b', i: Wi >> 1, kind: 'shutters' }],
      stair: spiral([E, N], st, (x, y) => x >= 0 && y >= 0 && x <= E && y <= N)(f) }); }
  const names = { undercroft: 'Undercroft', loft: 'Loft' };
  const site = { w: U(Wi), d: U(Di), storeys: st, front: 'yard or quay', doors: [{ side: 'f', at: U(Wi >> 1) }], needs: ['a yard or a quay before the door (carts, the crane)'], open: [], rank: 'port and staple towns' };
  return plan({ kind: 'warehouse', tier: 'civic', Wi, Di, floors, names, site, doorX: Wi >> 1, posts: true, stone: [0] });
}

// ---- the mint: the warden's office on the street, the melting house with its furnaces, the coining room, the strong room ----
export function planMint(opt = {}) {
  const Wi = 16, Di = 16, E = Wi - 1, N = Di - 1;
  const off = R(0, 'mintoffice', 0, 0, 7, 6, { floor: 'boards' }), strong = R(1, 'strongroom', 8, 0, E, 6, { floor: 'pave' }), melt = R(2, 'meltinghouse', 0, 7, 6, N, { floor: 'earth' }), coin = R(3, 'coiningroom', 7, 7, E, N, { floor: 'pave' });
  const rooms = [off, strong, melt, coin], doors = [door('h,3,0', -1, 0, { street: 1 }), door('v,8,3', 0, 1), door('h,3,7', 0, 2), door('v,7,11', 2, 3), door('h,11,7', 1, 3)];
  const A = props(rooms), P = A.P;
  P('counter', 1, 2, 4, 1, 0); P('scales', 2, 3, 1, 1, 0); P('desk', 6, 5, 1, 1, 3); P('townchest', 0, 6, 2, 1, 0); P('chest', 7, 0, 1, 1, 2, { iron: 1 });
  P('coffer', 10, 1, 2, 1, 2, { iron: 1 }); P('coffer', 13, 1, 2, 1, 2, { iron: 1 }); P('chest', E, 4, 1, 1, 3, { iron: 1 }); P('scales', 10, 5, 1, 1, 0);
  P('furnace', 0, 9, 2, 2, 1); P('furnace', 0, 13, 2, 2, 1); P('bellows', 2, 10, 1, 1, 1); P('moulds', 4, N, 2, 1, 0); P('anvil', 4, 10, 1, 1, 0); P('charcoal', 6, N, 1, 1, 3);
  for (let x = 9; x <= 13; x += 2) { P('anvil', x, 10, 1, 1, 0); P('stool', x, 11, 1, 1, 0); } P('table', 9, 13, 4, 1, 0); P('bin', E, N, 1, 1, 3);
  const win = [{ side: 'f', i: 1, kind: 'win' }, { side: 'f', i: 5, kind: 'win' }, { side: 'f', i: 11, kind: 'grate' }, { side: 'f', i: 14, kind: 'grate' }, { side: 'l', i: 11, kind: 'louvre' }, { side: 'r', i: 11, kind: 'win' }, { side: 'b', i: 10, kind: 'win' }];
  const names = { mintoffice: "Warden's office", strongroom: 'Strong room', meltinghouse: 'Melting house', coiningroom: 'Coining room' };
  const site = { w: U(Wi), d: U(Di), storeys: 1, front: 'street', doors: [{ side: 'f', at: 1 }], needs: ['near the castle or the market'], open: [], rank: 'royal and episcopal mint towns' };
  // the warden's lodging and the assay chamber over the front range, reached by a newel stair in the office corner; the workshops behind stay one storey, open to the roof
  const st = spiral([7, 6], 2, (x, y, f) => f === 0 ? x <= 7 && y <= 6 : y <= 6);
  const lodg = R(0, 'wardenlodging', 0, 0, 7, 6, { floor: 'boards' }), assay = R(1, 'assay', 8, 0, E, 6, { floor: 'boards' }), B = props([lodg, assay]);
  B.P('bed', 0, 0, 2, 2, 2); B.P('chest', 3, 0, 1, 1, 2); B.P('table', 2, 4, 2, 1, 0); B.P('fireplace', 0, 3, 1, 2, 1); B.P('scales', 10, 1, 1, 1, 2); B.P('desk', 13, 1, 1, 1, 2); B.P('furnace', E - 1, 4, 2, 2, 3); B.P('table', 9, 4, 3, 1, 0);
  const up = { f: 1, rooms: [lodg, assay], doors: [door('v,8,3', 0, 1)], props: B.list, windows: [{ side: 'f', i: 2, kind: 'win' }, { side: 'f', i: 5, kind: 'win' }, { side: 'f', i: 10, kind: 'win' }, { side: 'f', i: 13, kind: 'win' }], stair: st(1) };
  names.wardenlodging = "Warden's lodging"; names.assay = 'Assay chamber'; site.storeys = 2;
  return plan({ kind: 'mint', tier: 'civic', Wi, Di, floors: [{ f: 0, rooms, doors, props: A.list, windows: win, stair: st(0) }, up], names, site, doorX: 3, posts: false, stone: true, wallH0: 3.0 });
}

// ---- a rope walk: a long open shed, the spinner's wheel at its head, the yarns laid on posts down its length ----
export function planRopewalk(opt = {}) {
  const L = opt.len || 22, Wi = L * 3 + 1, Di = 7, E = Wi - 1, N = Di - 1;
  const head = R(0, 'ropehead', 0, 0, 8, N, { floor: 'earth' }), walk = R(1, 'ropewalk', 9, 0, E, N, { floor: 'earth', openSides: 'fb' }), rooms = [head, walk];
  const doors = [door('h,3,0', -1, 0, { street: 1 }), door('h,4,0', -1, 0, { street: 1 })]; for (let y = 1; y < N; y++) doors.push(door(`v,9,${y}`, 0, 1));
  const A = props(rooms), P = A.P;
  P('wheel', 6, 3, 2, 1, 1); P('workbench', 0, 1, 1, 3, 1); P('rope', 1, N, 3, 1, 0); P('barrel', 0, N, 1, 1, 1); P('stack', 5, N, 2, 1, 0);
  for (let x = 12; x < E; x += 6) P('post', x, 3, 1, 1, 0);
  const names = { ropehead: 'Spinning house', ropewalk: 'Rope walk' };
  const site = { w: U(Wi), d: U(Di), storeys: 1, front: 'street', doors: [{ side: 'f', at: 1 }], needs: ['a long straight run of open ground: the town edge, along the wall or the strand'], open: [], rank: 'ports' };
  return plan({ kind: 'ropewalk', tier: 'civic', Wi, Di, floors: [{ f: 0, rooms, doors, props: A.list, windows: [{ side: 'l', i: 3, kind: 'win' }], stair: noStair() }], names, site, doorX: 3, posts: true });
}

// ---- a post mill on the rampart: the buck (the body) turns on its post; the miller climbs the ladder at the back ----
export function planWindmill(opt = {}) {
  const Wi = 7, Di = 7, E = Wi - 1, N = Di - 1, q = R(0, 'buck', 0, 0, E, N, { floor: 'boards' }), A = props([q]), P = A.P;
  P('post', 3, 3, 1, 1, 0); P('millstones', 1, 1, 2, 2, 0); P('hoist', 5, 1, 1, 1, 0); P('sack', 0, N, 1, 1, 1); P('sack', 1, N, 1, 1, 0); P('bin', E, N, 1, 1, 3);
  const names = { buck: 'Mill' };
  const site = { w: U(Wi), d: U(Di), storeys: 2, front: 'open', doors: [{ side: 'f', at: 1 }], needs: ['high open ground: the rampart, a mound outside the wall'], open: [], rank: 'Low Countries towns: several on the walls' };
  return plan({ kind: 'windmill', tier: 'civic', Wi, Di, floors: [{ f: 0, rooms: [q], doors: [door('h,3,0', -1, 0, { street: 1 })], props: A.list, windows: [{ side: 'f', i: 3, kind: 'shut' }], stair: noStair() }], names, site, doorX: 3, posts: true });
}

// ---- the exchange: a paved court ringed by open arcades on posts, a gallery over the arcades, the gate in the front range ----
export function planBourse(opt = {}) {
  const Wi = 22, Di = 19, E = Wi - 1, N = Di - 1, A = 3, rooms = [], add = (t, x0, y0, x1, y1, m = {}) => { const q = R(rooms.length, t, x0, y0, x1, y1, m); rooms.push(q); return q; };
  const sa = add('sarcade', 0, 0, E, A - 1, { floor: 'pave', openSides: 'b' }), na = add('narcade', 0, N - A + 1, E, N, { floor: 'pave', openSides: 'f' });
  const wa = add('warcade', 0, A, A - 1, N - A, { floor: 'pave', openSides: 'r' }), ea = add('earcade', E - A + 1, A, E, N - A, { floor: 'pave', openSides: 'l' });
  const ct = add('court', A, A, E - A, N - A, { floor: 'pave', open: 1 });
  const A0 = props(rooms), P = A0.P;
  for (let x = 5; x < E - 4; x += 4) { P('bench', x, 1, 2, 1, 2); P('bench', x, N - 1, 2, 1, 0); }
  for (let y = 5; y < N - 4; y += 4) { P('desk', 1, y, 1, 1, 1); P('desk', E - 1, y, 1, 1, 3); }
  P('table', (Wi >> 1) - 1, N, 2, 1, 0);   // the clerk's table under the board of ships and prices
  const doors = [door(`h,${Wi >> 1},0`, -1, sa.id, { street: 1 }), door(`h,${(Wi >> 1) + 1},0`, -1, sa.id, { street: 1 })];
  // the arcades stand open to the court all along, and run into each other at the corners
  for (let x = A; x <= E - A; x++) doors.push(door(`h,${x},${A}`, sa.id, ct.id), door(`h,${x},${N - A + 1}`, ct.id, na.id));
  for (let y = A; y <= N - A; y++) doors.push(door(`v,${A},${y}`, wa.id, ct.id), door(`v,${E - A + 1},${y}`, ct.id, ea.id));
  for (let x = 0; x < A; x++) doors.push(door(`h,${x},${A}`, sa.id, wa.id), door(`h,${x},${N - A + 1}`, wa.id, na.id), door(`h,${E - x},${A}`, sa.id, ea.id), door(`h,${E - x},${N - A + 1}`, ea.id, na.id));
  const st = spiral([0, 0], 2, (x, y, f) => x >= 0 && y >= 0 && x < A && y < A);
  const g = [R(0, 'sgallery', 0, 0, E, A - 1, { floor: 'boards' }), R(1, 'ngallery', 0, N - A + 1, E, N, { floor: 'boards' }), R(2, 'wgallery', 0, A, A - 1, N - A, { floor: 'boards' }), R(3, 'egallery', E - A + 1, A, E, N - A, { floor: 'boards' })];
  const G1 = props(g); for (let x = 6; x < E - 5; x += 5) G1.P('bench', x, 1, 2, 1, 2);
  const gd = [door(`h,1,${A}`, 0, 2), door(`h,${E - 1},${A}`, 0, 3), door(`h,1,${N - A + 1}`, 2, 1), door(`h,${E - 1},${N - A + 1}`, 3, 1)];
  const floors = [{ f: 0, rooms, doors, props: A0.list, windows: [], stair: st(0) },
    { f: 1, rooms: g, doors: gd, props: G1.list, windows: [2, 6, 10, 14, 18].map((i) => ({ side: 'f', i, kind: 'win' })).concat([2, 6, 10, 14, 18].map((i) => ({ side: 'b', i, kind: 'win' }))), stair: st(1) }];
  const names = { sarcade: 'South walk', narcade: 'North walk', warcade: 'West walk', earcade: 'East walk', court: 'Court', sgallery: 'Gallery', ngallery: 'Gallery', wgallery: 'Gallery', egallery: 'Gallery' };
  const site = { w: U(Wi), d: U(Di), storeys: 2, front: 'market', doors: [{ side: 'f', at: U(Wi >> 1) }], needs: ['on the main market'], open: [], rank: 'great ports and staples from 1531' };
  return plan({ kind: 'bourse', tier: 'civic', Wi, Di, floors, names, site, doorX: Wi >> 1, posts: true, stone: [0] });
}
