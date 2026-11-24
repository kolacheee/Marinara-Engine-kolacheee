// @ts-nocheck
// Interiors for the town's working buildings and its gates (England / Low Countries 1450-1550), planned inside the shells town.html draws:
//   planGate:    a gatehouse of two towers over the road. Ground: the porter's / watch room in the left tower, its door on the town side
//                (the toll was taken here). Upstairs, over the towers and the passage: the gatekeeper's chamber, the portcullis chamber with
//                its windlass over the slot, and the town lock-up in the other tower (gatehouse gaols were usual).
//   planMill:    a water mill (4 x 3 units). Ground: the stone floor with the millstones on their hurst frame, the meal spouts and bins, sacks,
//                the pit wheel's housing on the water side. Loft: the grain floor with bins and the sack hoist, the miller's bed.
//   planSmelter: a smelting house at a mining town (4 x 3 units, one floor): the furnace under its brick stack in the back corner, the great
//                bellows, ore and charcoal heaps, ingot moulds, the slag pile, tools.
// Plan rows run from the door side (y = 0) back; one unit = 3 cells (+1).
import { rngOf } from './interior.js';

const spiral = (core, st) => (f) => { const c = core.cells[0], nbs = [[c[0] + 1, c[1]], [c[0], c[1] + 1], [c[0], c[1] - 1]].filter(([x, y]) => x >= 0 && y >= 0);
  return { block: f < st - 1 ? [c] : [], well: f === st - 1 ? [c] : [], wellUp: f > 0, nbs, need: [], one: true }; };
const mkP = (props, roomOf) => (type, x, y, w, h, rot, more = {}) => { props.push({ type, room: roomOf(x, y), x, y, w, h, rot, ...more }); };
const out = (H, kind, Wi, Di, st, floors, core, doorX, ZN, zone = () => null, site = null) => ({ site, H: { id: kind, W: (Wi - 1) / 3, D: (Di - 1) / 3, st, gable: false }, kind, tier: 'civic', Wi, Di, st, P: [], floors, yard: null,
  core, doorX, trade: null, wallH0: null, zone, roomNames: ZN, checks: { ok: true, fails: [] } });

export function planGate(G = {}, opt = {}) {
  const r = rngOf((opt.seed || 1) * 211 + (G.u || 0) * 17 + 5), tw = G.gw > 2.3 ? 3 : 2, W = 2 * tw + 2, D = 3, Wi = 3 * W + 1, Di = 3 * D + 1, E = Wi - 1, N = Di - 1, st = 2;
  const lx1 = 3 * tw - 1, rx0 = E - 3 * tw + 1, doorX = Math.floor(lx1 / 2);   // left tower cells 0..lx1, right tower rx0..E, the passage between
  const core = { kind: 'spiral', cells: [[0, N]] }, sp = spiral(core, st);
  // ground: only the left tower is a room (the passage is the road; the right tower is solid below, or a store reached from the passage)
  const p0 = [], P0 = mkP(p0, () => 0);
  P0('brazier', 3, 4, 1, 1, 0); P0('table', lx1, 2, 1, 2, 3); P0('stool', lx1 - 1, 2, 1, 1, 0); P0('chest', lx1, 0, 1, 1, 2); P0('form', 0, 3, 1, 2, 1);
  P0('armsrack', lx1 - 1, N, 2, 1, 0); P0('pallet', lx1, 5, 1, 2, 3); P0('desk', 0, 0, 1, 1, 2);
  if (r() < .6) P0('barrel', 2, N, 1, 1, 0);
  const f0 = { f: 0, rooms: [{ id: 0, t: 'watch', x0: 0, y0: 0, x1: lx1, y1: N }], doors: [{ e: `h,${doorX},0`, x: doorX, y: 0, street: 1, a: -1, b: 0 }], props: p0,
    windows: [{ side: 'f', i: lx1 - 1, kind: 'grate' }, { side: 'l', i: 4, kind: 'grate' }], stair: sp(0) };
  // upstairs: the gatekeeper's chamber, the portcullis chamber over the road, the lock-up
  const R1 = [{ id: 0, t: 'keeper', x0: 0, y0: 0, x1: lx1, y1: N }, { id: 1, t: 'portcullis', x0: lx1 + 1, y0: 0, x1: rx0 - 1, y1: N }, { id: 2, t: 'lockup', x0: rx0, y0: 0, x1: E, y1: N }];
  const in1 = (x) => x <= lx1 ? 0 : x < rx0 ? 1 : 2, p1 = [], P1 = mkP(p1, in1), mid = Math.floor((lx1 + 1 + rx0 - 1) / 2) - 1;
  P1('bed', lx1, 1, 1, 2, 3); P1('chest', lx1, 3, 1, 1, 3); P1('fireplace', 0, 3, 1, 2, 1); P1('table', 2, 5, 2, 1, 0); P1('stool', 2, 6, 1, 1, 2); P1('cupboard', 1, 0, 1, 1, 2);
  // the portcullis hangs in a slot across the passage near its outer end; its windlass stands over it; murder holes along the inner end
  P1('portslot', lx1 + 1, N - 2, rx0 - lx1 - 1, 1, 0, { walk: 0 }); P1('windlass', mid, N - 4, 2, 1, 0); P1('murder', mid, 2, 2, 1, 0, { walk: 1 }); P1('armsrack', lx1 + 1, 0, 2, 1, 2); P1('crate', rx0 - 1, 0, 1, 1, 2);
  P1('stocks', rx0 + 1, N, 2, 1, 0); P1('pallet', E, 1, 1, 2, 3); P1('bucket', rx0, 0, 1, 1, 2);
  const d1 = [{ e: `v,${lx1 + 1},5`, a: 0, b: 1 }, { e: `v,${rx0},5`, a: 1, b: 2 }];
  const f1 = { f: 1, rooms: R1, doors: d1, props: p1, stair: sp(1),
    windows: [{ side: 'f', i: 1, kind: 'win' }, { side: 'b', i: mid, kind: 'win' }, { side: 'b', i: mid + 1, kind: 'win' }, { side: 'f', i: mid + 1, kind: 'win' }, { side: 'r', i: 4, kind: 'grate' }, { side: 'b', i: 1, kind: 'grate' }] };
  return out(G, 'gate', Wi, Di, st, [f0, f1], core, doorX, { watch: 'Watch room', keeper: "Gatekeeper's chamber", portcullis: 'Portcullis chamber', lockup: 'Lock-up' }, undefined,
    { w: W, d: D, storeys: 2, front: 'the gate passage', doors: [{ side: 'passage', at: 0, what: 'watch room door off the passage, town side' }], needs: ['wall', 'where a main road crosses the wall', 'the passage paved and walkable both ways'], open: [], rank: '2+, one per main road' });
}

export function planMill(F = {}, opt = {}) {
  const r = rngOf((opt.seed || 1) * 97 + (F.x0 || 0) * 13 + 1), W = 4, D = 3, Wi = 13, Di = 10, E = Wi - 1, N = Di - 1, st = 2, doorX = 6;
  const core = { kind: 'spiral', cells: [[0, N]] }, sp = spiral(core, st), wet = F.wz !== undefined && F.wz < (F.y0 + F.y1) / 2 ? 'back' : 'front';
  const p0 = [], P0 = mkP(p0, () => 0), wy = wet === 'back' ? N : 0;
  // the stones on the hurst frame toward the water side, the pit wheel housing against that wall; meal bins at the spouts; sacks waiting
  const fl = !!opt.fulling;   // a fulling mill: the wheel works stocks that beat the wet cloth in fuller's earth, not stones
  if (fl) { P0('fullingstocks', 3, wet === 'back' ? N - 3 : 2, 2, 2, 0); P0('fullingstocks', 6, wet === 'back' ? N - 3 : 2, 2, 2, 0); } else P0('millstones', 3, wet === 'back' ? N - 3 : 2, 2, 2, 0); P0('pitwheel', 8, wet === 'back' ? N - 1 : 1, 2, 1, wet === 'back' ? 0 : 2); if (fl) { P0('tub', 3, wet === 'back' ? N - 5 : 5, 1, 1, 0); P0('tub', 4, wet === 'back' ? N - 5 : 5, 1, 1, 0); } else P0('bin', 3, wet === 'back' ? N - 5 : 5, 2, 1, 0);
  for (let x = 9; x < E; x++) P0(fl ? 'bale' : 'sack', x, wet === 'back' ? 0 : N, 1, 1, wet === 'back' ? 2 : 0); P0('scales', E, 4, 1, 1, 3); P0('sack', E, 6, 1, 1, 3); P0('basket', 0, 4, 1, 1, 1); P0('chest', 0, 2, 1, 1, 1);
  if (r() < .6) P0('cart', 9, 4, 2, 1, 0);
  const f0 = { f: 0, rooms: [{ id: 0, t: 'stonefloor', x0: 0, y0: 0, x1: E, y1: N }], doors: [{ e: `h,${doorX},0`, x: doorX, y: 0, street: 1, a: -1, b: 0 }], props: p0,
    windows: [{ side: 'l', i: 4, kind: 'win' }, { side: 'r', i: 6, kind: 'win' }], stair: sp(0) };
  // the grain loft: bins along the walls, the hopper's feed, the sack hoist at its trap, sacks; the miller sleeps up here
  const p1 = [], P1 = mkP(p1, () => 0);
  P1('bin', 3, N, 2, 1, 0); P1('bin', 6, N, 2, 1, 0); P1('hoist', E, 4, 1, 1, 3); for (let x = 3; x < 8; x++) if (r() < .7) P1('sack', x, 0, 1, 1, 2); P1('bed', E - 1, N - 1, 1, 2, 0); P1('chest', E, N - 3, 1, 1, 3);
  P1('sack', 0, 4, 1, 1, 1); P1('sack', 0, 5, 1, 1, 1); P1('crate', 9, 0, 1, 1, 2);
  const f1 = { f: 1, rooms: [{ id: 0, t: 'grainloft', x0: 0, y0: 0, x1: E, y1: N }], doors: [], props: p1, windows: [{ side: 'f', i: 3, kind: 'win' }, { side: 'f', i: 9, kind: 'win' }], stair: sp(1) };
  return out(F, 'mill', Wi, Di, st, [f0, f1], core, f0.doors[0].x, { stonefloor: fl ? 'Fulling floor' : 'Stone floor', grainloft: fl ? 'Cloth loft' : 'Grain loft' }, undefined,
    { w: 4, d: 3, storeys: 2, front: 'track or lane', doors: [{ side: 'f', at: 2 }], needs: ['water: the wheel on the face opposite the door', 'leat and millpond upstream', 'a path to the door on dry ground'], open: [], rank: '0+, one per stream' });
}

export function planSmelter(F = {}, opt = {}) {
  const r = rngOf((opt.seed || 1) * 59 + (F.y0 || 0) * 11 + 9), Wi = 13, Di = 10, E = Wi - 1, N = Di - 1, doorX = 6;
  const p = [], P = mkP(p, () => 0);
  // the furnace stands under the brick stack in the back right corner, the bellows beside it worked by a water shaft through the wall
  P('furnace', E - 2, N - 2, 3, 3, 0); P('bellows', E - 5, N - 1, 2, 2, 0); P('moulds', E - 1, 3, 1, 2, 3); P('slag', E, 0, 1, 1, 2);
  P('oreheap', 0, N - 1, 2, 2, 0); P('charcoal', 3, N - 1, 2, 2, 0); P('anvil', 3, 3, 1, 1, 0); P('workbench', 0, 4, 1, 2, 1); P('basket', 2, N - 2, 1, 1, 0); P('barrel', 0, 0, 1, 1, 2); P('tub', 1, 0, 1, 1, 2);
  if (r() < .6) P('cart', 3, 0, 2, 1, 2);
  const f0 = { f: 0, rooms: [{ id: 0, t: 'smeltery', x0: 0, y0: 0, x1: E, y1: N }], doors: [{ e: `h,${doorX},0`, x: doorX, y: 0, street: 1, a: -1, b: 0 }], props: p,
    windows: [{ side: 'l', i: 5, kind: 'grate' }, { side: 'f', i: 2, kind: 'grate' }], stair: { block: [], well: [], need: [] } };
  return out(F, 'smelter', Wi, Di, 1, [f0], null, doorX, { smeltery: 'Smelting house' }, undefined,
    { w: 4, d: 3, storeys: 1, front: 'any', doors: [{ side: 'f', at: 2 }], needs: ['mining towns', 'water for the bellows wheel helps', 'downwind', 'a clear yard before the door'], open: [], rank: 'mining' });
}
