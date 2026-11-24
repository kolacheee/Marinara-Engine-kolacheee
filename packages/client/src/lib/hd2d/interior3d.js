// @ts-nocheck
// Stage 2: a walkable house interior built from the interior planner's plan (interior.js).
// One plan cell = one world unit (about 1.2 m). Plan x runs along the street front, plan y into the house.
// World x = plan x; world z = Di - Y, so the street front (Y = 0) faces the camera at z = Di and the house runs away from it.
// The yard behind is the same grid carried on: yard row y is Y = Di + y (negative z), so ground floor and yard are one walk.
// Each storey is its own group; one is shown at a time (the yard shows with the ground floor).
import * as THREE from 'three';
import { build, M, plain, flame } from './models.js';
import { PROP, ROOM } from './interior.js';

const SH = 2.4;          // storey height (floor to floor)
const WT = .16;          // wall thickness
const DOORH = 1.8;       // door opening height
const LOW = .42;         // cutaway height of walls between the camera and the party

// ---------------------------------------------------------------- boxes with world-scaled texels (32 per unit, like the town)
const SZ = { ashlar: 64, beam: 32, board: 32, brick_a: 64, cloth_linen: 32, cloth_red: 32, cloth_teal: 32, cobble: 128, crate: 24, dirt: 128, floor_hall: 128, floor_slate: 128,
  floor_tiles: 128, floor_wood: 128, floor_worn: 128, grass: 128, pave: 128, path: 128, plaster_white: 128, plaster_cream: 128, sack: 32, stone_big: 32, stone_block: 32,
  stone_smooth: 16, clay: 16, iron: 16, wainscot: 64, wallcap: 64, wood: 32, wood_v: 32, stair_tread: 32, setts: 128, stained: 12 };
const T = (name, o) => { const m = M(name, o); m.map.__name = name; return m; };
// small pixel textures drawn here (one 32-texel tile per cell, like the town's): encaustic floor tiles, grain spread on a floor
const CT = {}; function ctex(key, draw) { if (CT[key]) return CT[key]; const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'); let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647; draw(x, rnd);
  const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.__name = key; SZ[key] = 32;
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: .85 }); CT[key] = m; return m; }
const px = (x, c, X, Y, w = 1, h = 1) => { x.fillStyle = c; x.fillRect(X, Y, w, h); };
const encaustic = () => ctex('encaustic', (x, rnd) => {   // 2 x 2 tiles a cell: red tiles inlaid in yellow slip (a lion-less quatrefoil, a ring of dots), set diagonally with plain dark ones
  for (let ty = 0; ty < 2; ty++) for (let tx = 0; tx < 2; tx++) { const X = tx * 16, Y = ty * 16, inl = (tx + ty) % 2 === 0;
    px(x, inl ? '#8c4c3a' : '#4e3c32', X, Y, 16, 16); for (let i = 0; i < 18; i++) px(x, inl ? '#7a4232' : '#443428', X + Math.floor(rnd() * 16), Y + Math.floor(rnd() * 16));
    if (inl) { const Y2 = '#c8a25a'; for (const [a, b] of [[7, 2], [8, 2], [2, 7], [2, 8], [13, 7], [13, 8], [7, 13], [8, 13]]) px(x, Y2, X + a, Y + b);
      for (const [a, b, w, h] of [[6, 4, 4, 1], [6, 11, 4, 1], [4, 6, 1, 4], [11, 6, 1, 4], [7, 7, 2, 2]]) px(x, Y2, X + a, Y + b, w, h); for (const [a, b] of [[5, 5], [10, 5], [5, 10], [10, 10]]) px(x, Y2, X + a, Y + b); }
    px(x, '#3a3028', X, Y + 15, 16, 1); px(x, '#3a3028', X + 15, Y, 1, 16); } });
const grainTex = () => ctex('grain', (x, rnd) => { px(x, '#c69c58', 0, 0, 32, 32); for (let i = 0; i < 260; i++) px(x, ['#d8b06a', '#b08848', '#e0bc78', '#a07c40'][Math.floor(rnd() * 4)], Math.floor(rnd() * 32), Math.floor(rnd() * 32));
  for (let y = 3; y < 32; y += 8) for (let X = 0; X < 32; X++) if (rnd() < .7) px(x, '#a88040', X, y + (rnd() < .3 ? 1 : 0)); });
function box(w, h, d, mat, x = 0, y = 0, z = 0, parent) {
  const g = new THREE.BoxGeometry(w, h, d), tn = mat.map && mat.map.__name, s = tn && SZ[tn];
  if (s) { const uv = g.attributes.uv, spans = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) { const k = f * 4 + i; uv.setXY(k, uv.getX(k) * spans[f][0] * 32 / s, uv.getY(k) * spans[f][1] * 32 / s); } }
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; if (parent) parent.add(m); return m;
}
const cyl = (rt, rb, h, mat, x, y, z, parent, n = 10) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, n), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
const mat = {
  plaster: () => T('plaster_white', { rough: .95, color: 0xece2d2 }), plasterLow: () => T('plaster_white', { rough: .95, color: 0xd8ccb8 }), beam: () => T('beam', { rough: .85, color: 0x8a7060 }),
  wood: () => T('wood', { rough: .7, color: 0xc8a888 }), dark: () => T('wood', { rough: .8, color: 0x9a7258 }), floor: () => T('board', { rough: .9, color: 0xd8c4a8 }),
  boards: () => T('board', { rough: .9, color: 0xc0a080 }), worn: () => T('pave', { rough: .95, color: 0xd8d0c4 }), hallF: () => T('floor_hall', { rough: .9, color: 0xe0d8cc }),
  earth: () => T('dirt', { rough: 1, color: 0xd0bca8 }), yardE: () => T('dirt', { rough: 1, color: 0xc8b8a0 }), stone: () => T('stone_block', { rough: .95, color: 0xc8c0b4 }),
  stoneBig: () => T('stone_big', { rough: .95, color: 0xb8b0a4 }), wains: () => T('wainscot', { rough: .8, color: 0xd8c0a8 }), fence: () => T('wood_v', { rough: .9, color: 0xa89078 }),
  cobble: () => T('cobble', { rough: 1, color: 0xb8b0a4 }), linen: () => T('cloth_linen', { rough: 1 }), red: () => T('cloth_red', { rough: 1 }), teal: () => T('cloth_teal', { rough: 1 }),
  iron: () => plain(0x3a3840, { metal: .6, rough: .45 }), straw: () => plain(0xc8a860, { rough: 1 }), soot: () => plain(0x1a1410, { rough: 1 }), cap: () => plain(0x2c241e, { rough: 1 }),
  glass: () => plain(0xbcd8ec, { rough: .2, emissive: 0xa8c8e0, ei: .5 }), sack: () => T('sack', { rough: 1, color: 0xc8b49a }), clay: () => T('clay', { rough: .7 }),
  pewter: () => plain(0xa9a8b4, { metal: .5, rough: .4 }), candle: () => plain(0xeadfc6, { rough: .8 }), lime: () => T('ashlar', { rough: .9, color: 0xf2ead8 }),
};

// ---------------------------------------------------------------- a trade's wares laid out on a surface (top at y, a strip W wide and D deep, centred on x0,z) — what tells one shop from another
const WARE = { leather: () => plain(0x6a3e26, { rough: .7 }), tan: () => plain(0xa8703e, { rough: .8 }), bread: () => plain(0xc0803c, { rough: .9 }), crust: () => plain(0x9a5a28, { rough: .9 }),
  sugar: () => plain(0xf4f0e8, { rough: .8 }), blue: () => plain(0x3a5a98, { rough: .5 }), white: () => plain(0xe8e4dc, { rough: .5 }), green: () => plain(0x5a7a48, { rough: .6 }), ochre: () => plain(0xc89a40, { rough: .9 }),
  steel: () => plain(0xb8bcc4, { metal: .3, rough: .35 }), blackI: () => plain(0x5a5a62, { metal: .25, rough: .55 }), turned: () => plain(0xd4a870, { rough: .7 }), wine: () => plain(0x6a1c28, { rough: .4 }),
  dyes: [0xa83a30, 0x3a5a98, 0xc8a038, 0x4a7a4a, 0x7a4a8a], cloth: [0xa83a30, 0x3a6a78, 0xd8cfb8, 0x4a5a8a, 0x7a6a40] };
function wares(goods, W, D, y, z, g, k = 0, x0 = 0) {
  const n = Math.max(2, Math.floor(W / .26)), xs = (i) => x0 - W / 2 + (i + .5) * W / n;
  for (let i = 0; i < n; i++) { const x = xs(i), j = (i + k) % 5;
    switch (goods) {
      case 'shoemaker': { if (j === 4) { box(.08, .14, .2, WARE.tan(), x, y + .07, z, g); break; }   // pairs of shoes, toes to the room; now and then a wooden last
        for (const s of [-1, 1]) { box(.075, .07, .2, j % 2 ? WARE.leather() : WARE.tan(), x + s * .045, y + .035, z, g); box(.075, .09, .07, j % 2 ? WARE.leather() : WARE.tan(), x + s * .045, y + .08, z - .06, g); } break; }
      case 'tailor': case 'draper': case 'mercer': case 'weaver': {   // bolts of cloth lying end-on to the room, a folded pile between
        const c = plain(WARE.cloth[j], { rough: 1 }); if (j === 2 && goods === 'tailor') { for (let t = 0; t < 3; t++) box(.2, .04, .2, plain(WARE.cloth[(j + t) % 5], { rough: 1 }), x, y + .02 + t * .042, z, g); break; }
        const b = cyl(.08, .08, Math.min(D, .34), c, x, y + .08, z, g, 10); b.rotation.x = Math.PI / 2; break; }
      case 'cutler': { box(.03, .01, .22, WARE.steel(), x - .04, y + .005, z - .03, g); box(.035, .025, .09, WARE.leather(), x - .04, y + .013, z + .12, g);
        box(.03, .01, .16, WARE.steel(), x + .05, y + .005, z - .05, g); box(.035, .025, .08, mat.dark(), x + .05, y + .013, z + .07, g); break; }
      case 'chandler': { for (let t = 0; t < 5; t++) cyl(.018, .018, .26, mat.candle(), x - .06 + (t % 3) * .05, y + .13, z - .03 + Math.floor(t / 3) * .05, g, 6); break; }   // candles stood in bundles
      case 'turner': { if (j % 2) { for (let t = 0; t < 3; t++) cyl(.1 - t * .01, .06, .045, WARE.turned(), x, y + .025 + t * .04, z, g, 12); } else { cyl(.05, .04, .16, WARE.turned(), x - .04, y + .08, z, g, 8); cyl(.11, .11, .02, WARE.turned(), x + .05, y + .01, z + .03, g, 12); } break; }
      case 'baker': { const m = new THREE.Mesh(new THREE.SphereGeometry(.09, 10, 7), j % 2 ? WARE.bread() : WARE.crust()); m.scale.set(1.15, .62, .9); m.position.set(x, y + .055, z); m.castShadow = true; g.add(m);
        if (j % 3 === 0) { const m2 = m.clone(); m2.position.set(x + .03, y + .12, z - .02); g.add(m2); } break; }
      case 'grocer': { if (j === 0 || j === 3) cyl(.01, .075, .24, WARE.sugar(), x, y + .12, z, g, 10); else if (j === 1) { cyl(.06, .06, .14, WARE.blue(), x, y + .07, z, g, 10); cyl(.065, .065, .02, WARE.white(), x, y + .15, z, g, 10); } else { const sk = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), mat.sack()); sk.scale.set(1, 1.2, 1); sk.position.set(x, y + .09, z); g.add(sk); } break; }   // sugar loaves, a jar of spice, little sacks
      case 'apothecary': { const c = j % 2 ? WARE.blue() : WARE.white(); cyl(.068, .06, .22, c, x - .04, y + .11, z, g, 10); cyl(.07, .07, .035, j % 2 ? WARE.white() : WARE.blue(), x - .04, y + .13, z, g, 10);   // albarelli: the waisted drug jars
        cyl(.02, .035, .12, WARE.green(), x + .07, y + .06, z + .02, g, 8); break; }
      case 'inn': { if (j % 3 === 0) { cyl(.06, .08, .22, mat.clay(), x, y + .11, z, g, 10); cyl(.02, .02, .05, mat.clay(), x + .07, y + .16, z, g, 6); }   // ale jugs, leather jacks, pewter pots
        else if (j % 3 === 1) { cyl(.05, .06, .16, WARE.leather(), x - .03, y + .08, z, g, 10); cyl(.04, .04, .1, mat.pewter(), x + .06, y + .05, z + .03, g, 8); } else { cyl(.045, .04, .11, mat.pewter(), x, y + .055, z, g, 8); cyl(.12, .1, .02, mat.pewter(), x + .05, y + .01, z - .04, g, 12); } break; }
      case 'vintner': { cyl(.05, .07, .2, mat.clay(), x - .04, y + .1, z, g, 10); cyl(.04, .03, .07, mat.pewter(), x + .07, y + .035, z + .03, g, 8); break; }
      case 'ironmonger': case 'smith': { if (j % 2) { const t = new THREE.Mesh(new THREE.TorusGeometry(.06, .015, 5, 10, Math.PI * 1.4), WARE.blackI()); t.rotation.x = -Math.PI / 2; t.position.set(x, y + .015, z); g.add(t); }
        else { cyl(.09, .07, .12, WARE.blackI(), x, y + .06, z, g, 10); } break; }   // horseshoes and iron pots
      case 'cooper': { cyl(.08, .07, .16, mat.wood(), x, y + .08, z, g, 10); for (const hy of [.03, .13]) cyl(.083, .083, .015, mat.iron(), x, y + hy, z, g, 10); break; }   // little kegs and piggins
      case 'dyer': { box(.16, .06, .18, plain(WARE.dyes[j], { rough: 1 }), x, y + .03, z, g); break; }   // dyed hanks of yarn
      case 'carpenter': { box(.22, .05, .1, mat.wood(), x, y + .025, z, g); box(.04, .03, .08, mat.iron(), x + .06, y + .065, z, g); break; }   // planes
      default: cyl(.07, .06, .2, (i + k) % 2 ? mat.clay() : mat.pewter(), x, y + .1, z, g); } } }

// ---------------------------------------------------------------- props from the plan, fitted to their cells (origin: footprint centre, front faces +z)
function fitTo(g, fw, fd, grow = 1.25) { const fp = g.userData.fp || { w: 1, d: 1 }; const s = Math.min(fw / fp.w, fd / fp.d, grow); g.scale.setScalar(s); return g; }
const candleOn = (g, x, y, z) => { cyl(.05, .06, .03, mat.pewter(), x, y + .015, z, g); cyl(.025, .025, .12, mat.candle(), x, y + .09, z, g); flame(g, x, y + .17, z, .4); g.userData.candle = [x, y + .25, z]; };
// a heap of lumps on a low mound, its ragged edge spilling onto the floor
// a horse in its stall, seen from behind as the camera sees it: a pixel sprite drawn at the party's own density (36 px a unit), coat by palette
const HCOAT = { bay: ['#7a4a2c', '#5e361e', '#9a6640', '#1c1410'], chestnut: ['#9a5228', '#7a3e1c', '#b86c3a', '#6a3418'], grey: ['#b8b4ac', '#8e8a84', '#d8d4cc', '#5a5650'], black: ['#2e2826', '#1e1a18', '#4a423e', '#141010'] };
function horseTex(coat) { const key = 'horse-' + coat; if (CT[key]) return CT[key]; const W = 36, H = 64, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const [base, shade, hi, hair] = HCOAT[coat], cx = W / 2, OUT = '#140e0a';
  const lerp = (a, b, t) => a + (b - a) * t, hw = (y) => y < 13 ? 0 : y < 20 ? lerp(3.2, 4.5, (y - 13) / 7) : y < 28 ? lerp(4.5, 10, (y - 20) / 8) : y < 33 ? lerp(10, 15, (y - 28) / 5) : y < 47 ? 15.5 + .8 * Math.sin((y - 33) / 14 * Math.PI) : y < 52 ? lerp(15, 12, (y - 47) / 5) : 0;
  const inside = (X, Y) => { const dx = Math.abs(X + .5 - cx); if (Y < 14) return Y >= 10 && dx >= 1.5 && dx <= 4 - (13 - Y) * .4;   // ears pricked over the poll (the head is down at the manger)
    if (Y < 52) { if (Y >= 48 && dx < 1 + (Y - 48) * 1.1) return false; if (Y >= 33 && Y < 36 && dx > 14.5 && Y === 33) return false; return dx < hw(Y); }   // poll, neck, back, the broad quarters
    return Y < 63 && dx >= 4.5 && dx <= 10.5 - (Y > 58 ? .5 : (Y - 52) * .15); };                                                     // the two hind legs
  const col = (X, Y) => { const dx = Math.abs(X + .5 - cx); if (Y >= 59) return Y >= 61 ? '#2a221c' : hair;
    if (Y >= 53 && coat === 'bay') return hair; if (dx < 1.4 && Y >= 13 && Y < 29) return hair;                                     // bay points; the mane
    if (dx < 2.6 && Y >= 34 && Y < 57) return (Y + X) % 4 === 0 ? shade : hair;                                                       // the tail, set on high
    if (Y >= 33 && Y < 38 && dx > 7 && dx < 13) return hi; if (dx < 2 && Y >= 29 && Y < 34) return hi;                               // the points of the hips, the spine
    if (dx > hw(Y) - 2.5 && Y < 52) return shade; if (Y >= 52 && dx > 9) return shade; return base; };
  for (let Y = 0; Y < H; Y++) for (let X = 0; X < W; X++) if (inside(X, Y)) { x.fillStyle = col(X, Y); x.fillRect(X, Y, 1, 1); }
  const img = x.getImageData(0, 0, W, H), a = (X, Y) => X >= 0 && Y >= 0 && X < W && Y < H && img.data[(Y * W + X) * 4 + 3] > 0;   // a dark outline round the silhouette
  x.fillStyle = OUT; for (let Y = 0; Y < H; Y++) for (let X = 0; X < W; X++) if (!a(X, Y) && (a(X - 1, Y) || a(X + 1, Y) || a(X, Y - 1) || a(X, Y + 1))) x.fillRect(X, Y, 1, 1);
  const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshStandardMaterial({ map: t, alphaTest: .5, roughness: 1, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .14 }); m.userData.depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: .5 }); CT[key] = m; return m; }
function horseSprite(coat) { const m = horseTex(coat), p = new THREE.Mesh(new THREE.PlaneGeometry(36 / 36, 64 / 36), m); p.customDepthMaterial = m.userData.depth; p.castShadow = true; p.position.y = 32 / 36; p.rotation.x = -.18; return p; }
function heap(w, d, cols, H, sz, key) { const g = new THREE.Group(), ms = cols.map((c) => plain(c, { rough: 1, flat: true })); let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const base = new THREE.Mesh(new THREE.SphereGeometry(.5, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), ms[0]); base.scale.set(w * .86, H, d * .86); base.castShadow = base.receiveShadow = true; g.add(base);
  for (let i = 0; i < 46; i++) { const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()), x = Math.cos(a) * rr * w * .44, z = Math.sin(a) * rr * d * .44, y = H * Math.sqrt(Math.max(0, 1 - rr * rr)) * .95;
    const s2 = sz * (.6 + rnd() * .8), b = box(key === 'coal' && i % 3 === 0 ? s2 * 2.2 : s2, s2 * .8, s2, ms[i % ms.length], x, y, z, g); b.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); }
  return g; }
const BUILD = {
  hearth: (w, d, o) => { const g = new THREE.Group(), st = mat.stoneBig();
    box(w * .96, .12, d * .9, st, 0, .06, 0, g); box(w * .96, 1.55, .26, mat.soot(), 0, .78, -d / 2 + .13, g);             // hearth stone and sooted fireback
    const ash = T('stone_block', { rough: .95, color: 0xc8d0d8 }); box(.22, 1.2, d * .8, ash, -w / 2 + .14, .6, -.02, g); box(.22, 1.2, d * .8, ash, w / 2 - .14, .6, -.02, g);             // cheeks, grey ashlar
    box(w * .98, .22, d * .82, mat.beam(), 0, 1.3, .0, g);                                                                 // mantel beam
    const hood = box(w * .9, .95, d * .6, mat.plasterLow(), 0, 1.88, -d / 2 + .3, g);                                      // limewashed breast running up to the ceiling
    box(w * .55, .03, .5, mat.soot(), 0, .13, 0, g); const logs = mat.dark(); for (const dx of [-1, 1]) { const l = box(.5, .09, .09, logs, dx * .06, .19, .02, g); l.rotation.y = dx * .5; }
    if (o.cook) { const ir = mat.iron(); box(.04, 1.0, .04, ir, -w * .3, .6, -.25, g); box(w * .45, .03, .03, ir, -w * .1, 1.08, -.25, g); box(.025, .5, .025, ir, 0, .82, -.25, g);
      const pot = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 8), ir); pot.scale.y = .8; pot.position.set(0, .52, -.1); pot.castShadow = true; g.add(pot);
      for (const sx of [-1, 1]) box(.04, .42, .04, ir, sx * w * .32, .21, .22, g); box(w * .68, .025, .025, ir, 0, .42, .22, g); }
    flame(g, -.1, .2, .02, 1.1); flame(g, .1, .22, -.03, .9); g.userData.fire = [0, .5, .1]; return g; },
  fireplace: (w, d) => { const g = BUILD.hearth(w, d, {}); return g; },
  stack: (w, d) => { const g = new THREE.Group(); box(w * .98, SH - .35, d * .98, mat.plasterLow(), 0, .3 + (SH - .35) / 2, 0, g); box(w, .32, d, mat.stone(), 0, .16, 0, g); return g; },   // the flue from below, limewashed like the walls
  hoodhearth: (w, d) => { const g = new THREE.Group(), st = mat.stone(), pl = mat.plasterLow();
    box(w * .9, .16, d * .85, st, 0, .08, 0, g); box(w * .9, .5, .18, mat.soot(), 0, .25, -d / 2 + .1, g);
    box(w * .98, .6, d * .9, pl, 0, 1.78, -.02, g); box(w * 1.0, .08, d * .95, mat.beam(), 0, 1.46, 0, g); box(w * .45, .9, .45, pl, 0, 2.0, -.2, g);
    for (const sx of [-1, 1]) box(.08, 1.4, .08, mat.beam(), sx * (w / 2 - .06), .73, d / 2 - .1, g);
    const ir = mat.iron(); const pot = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 8), ir); pot.scale.y = .8; pot.position.set(0, .4, 0); pot.castShadow = true; g.add(pot); box(.03, 1.0, .03, ir, 0, .95, 0, g);
    flame(g, -.05, .18, .05, 1); g.userData.fire = [0, .5, .1]; return g; },
  greatbed: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), wd = mat.wood(), lin = mat.linen(), red = mat.red(); const W = w * .9, L = d * .92;
    box(W, .26, L, dk, 0, .22, 0, g); box(W - .08, .18, L - .1, lin, 0, .44, 0, g); box(W, .07, L * .62, red, 0, .55, L * .18, g); box(W * .7, .12, .28, lin, 0, .56, -L / 2 + .26, g);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.1, 2.05, .1, dk, sx * (W / 2 - .05), 1.02, sz * (L / 2 - .05), g);
    box(W, 1.2, .08, wd, 0, .9, -L / 2 + .04, g); box(W + .06, .1, L + .06, dk, 0, 2.06, 0, g); box(W, .05, L, red, 0, 2.0, 0, g);
    for (const sx of [-1, 1]) box(.04, 1.5, L * .3, red, sx * (W / 2 - .03), 1.25, -L / 2 + L * .15 + .05, g);
    box(W * .8, .14, L * .5, dk, 0, .07, L * .2, g); g.userData.fp = { w: W, d: L }; return g; },
  bed: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), lin = mat.linen(); const W = w * .86, L = d * .9;   // a boarded bedstead with a straw tick and a coverlet
    box(W, .3, L, dk, 0, .2, 0, g); box(W - .08, .14, L - .1, lin, 0, .41, 0, g); box(W - .02, .06, L * .6, Math.random() < .5 ? mat.red() : mat.teal(), 0, .49, L * .18, g);
    box(W * .7, .1, .26, lin, 0, .5, -L / 2 + .22, g); box(W, .75, .07, dk, 0, .55, -L / 2 + .035, g); box(W, .45, .07, dk, 0, .4, L / 2 - .035, g); return g; },
  kingbed: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), wd = mat.wood(), lin = mat.linen(); const W = w * .9, L = d * .9;   // a joined bedstead without a tester: a tall panelled headboard, turned posts at the foot
    box(W, .3, L, wd, 0, .22, 0, g); box(W - .08, .2, L - .1, lin, 0, .46, 0, g); box(W - .02, .08, L * .62, Math.random() < .5 ? mat.red() : mat.teal(), 0, .58, L * .18, g); for (const sx of [-1, 1]) box(W * .36, .13, .3, lin, sx * W * .22, .6, -L / 2 + .26, g);
    box(W, 1.35, .09, wd, 0, .88, -L / 2 + .045, g); for (let i = 0; i < 3; i++) box(W * .26, .8, .02, dk, -W * .3 + i * W * .3, .98, -L / 2 + .1, g); box(W + .08, .1, .14, dk, 0, 1.6, -L / 2 + .06, g);
    for (const sx of [-1, 1]) { box(.12, 1.65, .12, dk, sx * (W / 2 - .02), .82, -L / 2 + .05, g); box(.11, .8, .11, dk, sx * (W / 2 - .02), .4, L / 2 - .05, g); cyl(.07, .07, .1, dk, sx * (W / 2 - .02), .85, L / 2 - .05, g); }
    box(W, .4, .06, dk, 0, .36, L / 2 - .04, g); g.userData.fp = { w: W, d: L }; return g; },
  bunk: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), wd = mat.wood(), lin = mat.linen(); const W = w * .86, L = d * .9;   // two bunks, one over the other, a ladder at the foot
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.08, 1.75, .08, dk, sx * (W / 2 - .04), .875, sz * (L / 2 - .04), g);
    for (const y of [.22, 1.12]) { box(W, .14, L, wd, 0, y, 0, g); box(W - .08, .12, L - .1, lin, 0, y + .12, 0, g); box(W - .04, .05, L * .55, y > 1 ? mat.teal() : mat.red(), 0, y + .2, L * .2, g); box(W * .7, .08, .24, lin, 0, y + .2, -L / 2 + .2, g); }
    for (const sx of [-1, 1]) box(.05, .05, L, dk, sx * (W / 2 - .02), 1.45, 0, g); box(W, .05, .05, dk, 0, 1.45, -L / 2 + .02, g);
    for (const sx of [-1, 1]) box(.04, 1.4, .04, dk, sx * .14, .7, L / 2 + .02, g); for (let i = 1; i <= 4; i++) box(.3, .035, .035, dk, 0, i * .28, L / 2 + .02, g); return g; },
  pallet: (w, d) => { const g = new THREE.Group(); box(w * .8, .1, d * .9, mat.straw(), 0, .05, 0, g); box(w * .72, .06, d * .55, mat.linen(), 0, .12, d * .14, g); box(w * .5, .08, .22, mat.linen(), 0, .13, -d * .34, g); return g; },
  chest: (w, d) => fitTo(build('chest'), w * .9, d * .8),
  coffer: (w, d) => fitTo(build('chest'), w * .7, d * .6),
  table: (w, d, o) => { const g = new THREE.Group(); const L = w * .94, D = d * .74, top = mat.wood(), dk = mat.dark();
    box(L, .07, D, top, 0, .74, 0, g); for (const sx of [-1, 1]) { box(.08, .7, D * .7, dk, sx * (L / 2 - .2), .36, 0, g); box(.08, .06, D * .9, dk, sx * (L / 2 - .2), .04, 0, g); }
    box(L - .5, .05, .05, dk, 0, .3, 0, g);                                                                               // the stretcher
    if (o && o.goods) wares(o.goods, L - .3, D * .8, .775, 0, g, 1); else { box(L * .22, .02, .24, mat.linen(), L * .22, .785, 0, g); cyl(.05, .04, .1, mat.clay(), -L * .22, .82, .05, g); cyl(.12, .1, .03, mat.pewter(), -L * .05, .79, -.05, g); }
    if (o.night) candleOn(g, L * .05, .775, .08);
    if (o.forms !== false) { const f = new THREE.Group(); box(L * .8, .05, .24, top, 0, .44, 0, f); for (const sx of [-1, 1]) box(.05, .42, .2, dk, sx * L * .33, .21, 0, f); f.position.z = D / 2 + .2; g.add(f); }
    return g; },
  longtable: (w, d, o) => { const g = BUILD.table(w, d, o); if (o && o.p && o.p.nochair) return g; const ch = BUILD.chair(1, 1); ch.position.set(w * .47 - .05, 0, 0); ch.rotation.y = -Math.PI / 2; g.add(ch); return g; },
  settle: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const W = w * .92;   // a high-backed settle: panelled back, arms, a cushion
    box(W, .08, d * .5, wd, 0, .44, .05, g); box(W, 1.3, .07, wd, 0, .67, -d * .22, g); for (let i = 0; i <= 3; i++) box(.06, 1.3, .03, dk, -W / 2 + .03 + i * (W - .06) / 3, .67, -d * .22 + .05, g);
    box(W + .04, .07, .14, dk, 0, 1.34, -d * .2, g); for (const sx of [-1, 1]) { box(.07, .85, d * .55, dk, sx * (W / 2 - .035), .42, 0, g); box(.09, .05, d * .58, wd, sx * (W / 2 - .035), .86, .01, g); }
    box(W * .9, .07, d * .42, mat.red(), 0, .51, .06, g); box(W - .1, .4, .05, dk, 0, .2, d * .3, g); return g; },
  cupboard: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), wd = mat.wood(), ir = mat.iron(); const z = -d * .15, fz = z + d * .3 + .02;   // a press cupboard: two panelled doors, strap hinges, a jug and a bowl on top
    box(w * .86, 1.6, d * .6, wd, 0, .85, z, g); box(w * .9, .1, d * .64, dk, 0, .05, z, g); box(w * .92, .07, d * .66, dk, 0, 1.68, z, g);
    for (const sx of [-1, 1]) { box(w * .36, 1.25, .03, dk, sx * w * .2, .9, fz, g); box(w * .26, 1.05, .02, wd, sx * w * .2, .9, fz + .02, g); for (const y of [.45, 1.35]) box(w * .2, .04, .02, ir, sx * w * .12, y, fz + .035, g); }
    box(.03, .14, .03, ir, -.04, .95, fz + .04, g); box(.03, .14, .03, ir, .04, .95, fz + .04, g);
    cyl(.07, .09, .22, mat.clay(), -w * .18, 1.83, z, g); cyl(.15, .1, .07, mat.pewter(), w * .16, 1.75, z, g); return g; },
  shelf: (w, d, o) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const W = w * .86, D = d * .42, z = -d / 2 + D / 2 + .05;
    for (const sx of [-1, 1]) box(.05, 1.8, D, dk, sx * W / 2, .9, z, g); for (const y of [.08, .6, 1.1, 1.6]) box(W, .04, D, wd, 0, y, z, g);
    if (o && o.goods) { [.6, 1.1, 1.6].forEach((y, i) => wares(o.goods, W - .1, D, y + .02, z, g, i * 2)); wares(o.goods === 'baker' || o.goods === 'grocer' ? o.goods : 'x', W - .1, D, .1, z, g, 1); return g; }
    const ks = [mat.clay(), mat.pewter(), mat.sack(), mat.clay()]; let k = 0; for (const y of [.6, 1.1, 1.6]) for (let i = 0; i < 3; i++) { if ((i + y * 3) % 4 < 1) continue; const c = cyl(.07, .06, .18 + (k % 2) * .08, ks[k++ % 4], -W * .3 + i * W * .3, y + .11 + (k % 2) * .04, z, g); } return g; },
  dresser: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const W = w * .92;
    box(W, .85, d * .6, wd, 0, .42, -d * .1, g); for (let i = 0; i < 3; i++) box(W * .28, .55, .02, dk, -W * .32 + i * W * .32, .42, -d * .1 + d * .31, g); box(W, .05, d * .66, dk, 0, .87, -d * .1, g); box(W, 1.0, .06, wd, 0, 1.4, -d * .38, g);
    for (const y of [1.3, 1.7]) { box(W, .04, .24, wd, 0, y, -d * .3, g); for (let i = 0; i < 4; i++) { const p = cyl(.09, .07, .16, i % 2 ? mat.clay() : mat.pewter(), -W / 2 + .2 + i * (W - .4) / 3, y + .1, -d * .3, g); } }
    return g; },
  sideboard: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); box(w * .9, .9, d * .55, wd, 0, .45, -d * .15, g); for (let i = 0; i < 3; i++) box(w * .26, .6, .02, dk, -w * .3 + i * w * .3, .45, -d * .15 + d * .28, g); box(w * .92, .05, d * .6, wd, 0, .92, -d * .15, g);
    for (let i = 0; i < 3; i++) cyl(.08, .06, .2, mat.pewter(), -w * .3 + i * w * .3, 1.05, -d * .15, g); return g; },
  counter: (w, d, o) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); box(w * .96, .92, d * .55, wd, 0, .46, 0, g); for (let i = 0; i < 4; i++) box(w * .2, .6, .02, dk, -w * .36 + i * w * .24, .48, d * .28, g); box(w * .98, .06, d * .66, dk, 0, .95, 0, g);
    if (o && o.goods) { wares(o.goods, w * .8, d * .5, .98, 0, g, 3);
      if (o.goods === 'chandler') { const dk = mat.dark(); for (const sx of [-1, 1]) box(.06, 1.05, .06, dk, sx * w * .45, 1.5, -d * .2, g); box(w * .94, .05, .05, dk, 0, 2.0, -d * .2, g);
        for (let i = 0; i < 6; i++) { const X = -w * .36 + i * w * .145; box(.006, .08, .006, mat.cap(), X, 1.94, -d * .2, g); for (let t = 0; t < 6; t++) cyl(.016, .016, .34, mat.candle(), X - .03 + (t % 3) * .03, 1.72, -d * .2 + (t < 3 ? -.02 : .02), g, 5); } }   // candles hung by their wicks from a pole over the counter
      return g; }
    for (let i = 0; i < 3; i++) box(.24, .14, .2, i % 2 ? mat.linen() : mat.sack(), -w * .3 + i * w * .3, 1.05, 0, g); return g; },
  bench: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); box(w * .94, .08, d * .62, wd, 0, .78, -d * .08, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.08, .76, .08, dk, sx * (w * .44), .38, -d * .08 + sz * d * .24, g);
    box(w * .8, .05, d * .5, dk, 0, .2, -d * .08, g); const ir = mat.iron(); for (let i = 0; i < 4; i++) box(.05, .02, .2, ir, -w * .3 + i * .18, .83, -d * .1, g);
    const st = BUILD.stool(1, 1); st.position.z = d * .42; g.add(st); return g; },
  // ---- trade gear: each trade's own work place, so a shop says what is made there
  workbench: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(), ir = mat.iron(); const L = w * .94, D = d * .7;   // a heavy joiner's bench: thick top, vice, saw and planes
    box(L, .12, D, wd, 0, .8, -d * .05, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.12, .76, .12, dk, sx * (L / 2 - .1), .38, -d * .05 + sz * (D / 2 - .08), g); box(L - .2, .08, D - .1, dk, 0, .2, -d * .05, g);
    box(.22, .3, .1, dk, -L / 2 + .2, .72, -d * .05 + D / 2 + .03, g); cyl(.02, .02, .3, ir, -L / 2 + .2, .8, -d * .05 + D / 2 + .12, g).rotation.x = Math.PI / 2;
    const saw = box(.5, .12, .015, plain(0xb8bcc4, { metal: .7, rough: .35 }), .2, .9, -d * .05, g); saw.rotation.x = -Math.PI / 2; box(.1, .14, .03, dk, -.07, .9, -d * .05, g).rotation.x = -Math.PI / 2;
    box(.3, .08, .08, dk, -.2, .9, -d * .05 - .18, g); box(.04, .03, .2, ir, -.2, .95, -d * .05 - .18, g); for (let i = 0; i < 4; i++) { const sh = box(.06, .02, .14, plain(0xe8d0a0, { rough: 1 }), .1 + i * .12, .87, -d * .05 + .14, g); sh.rotation.y = i * .7; } return g; },
  lastbench: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const L = w * .9;   // the shoemaker's low bench: a seat, a tray of tools and lasts, shoes on a shelf behind
    box(L, .07, d * .45, wd, 0, .42, .05, g); for (const sx of [-1, 1]) box(.07, .4, d * .4, dk, sx * (L / 2 - .05), .2, .05, g); box(L * .45, .1, d * .4, dk, L * .25, .5, .05, g);
    for (let i = 0; i < 5; i++) { const l = box(.06, .06, .16, plain(0xc8a070, { rough: .8 }), L * .1 + i * .08, .58, .05, g); l.rotation.y = .3; }
    box(L, .05, .28, wd, 0, .9, -d * .32, g); for (const sx of [-1, 1]) box(.05, .9, .26, dk, sx * L / 2, .45, -d * .32, g);
    for (let i = 0; i < 4; i++) { const sh = box(.12, .1, .26, i % 2 ? plain(0x5a3a28, { rough: .6 }) : plain(0x8a5a38, { rough: .6 }), -L * .35 + i * L * .22, .98, -d * .32, g); sh.rotation.y = .2; }
    box(.4, .015, .3, plain(0x9a6a40, { rough: .8 }), -L * .25, .465, .05, g); return g; },
  cuttingtable: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const L = w * .94, D = d * .74;   // the tailor's broad table: a bolt of cloth unrolled, shears, chalk
    box(L, .07, D, wd, 0, .82, 0, g); for (const sx of [-1, 1]) { box(.1, .78, D * .8, dk, sx * (L / 2 - .15), .39, 0, g); }
    const c = Math.random() < .5 ? mat.red() : mat.teal(); box(L * .62, .025, D * .8, c, -L * .1, .87, 0, g); cyl(.09, .09, D * .86, c, L * .26, .94, 0, g).rotation.x = Math.PI / 2;
    const ir = plain(0xb8bcc4, { metal: .7, rough: .35 }); for (const a of [-.3, .3]) { const b = box(.26, .015, .03, ir, -L * .32, .89, .12, g); b.rotation.y = a; } box(.08, .03, .05, plain(0xf0f0e8), .1, .89, -.15, g); return g; },
  hatch: (w, d, o) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark();   // the tap hatch: a half-door with a board across it, the keeper's tally and stool behind; no bar counter
    box(w * .9, .95, .08, wd, 0, .48, d * .1, g); for (let i = 0; i < 3; i++) box(w * .26, .7, .02, dk, -w * .3 + i * w * .3, .48, d * .1 + .05, g); box(w * .96, .06, .34, dk, 0, .98, d * .12, g);
    for (const sx of [-1, 1]) box(.08, 1.9, .08, dk, sx * w * .46, .95, d * .1, g); box(w * .96, .08, .1, dk, 0, 1.9, d * .1, g);
    if (o && o.goods) wares('inn', w * .7, .2, 1.01, d * .14, g, 0); box(.3, .4, .02, plain(0x3a3028, { rough: 1 }), w * .2, 1.4, -d * .3, g);   // the tally board on the wall behind
    for (let i = 0; i < 6; i++) box(.012, .07, .005, mat.candle(), w * .2 - .11 + i * .045, 1.42, -d * .3 + .015, g);
    cyl(.16, .16, .05, wd, -w * .2, .48, -d * .25, g, 10); for (const a of [0, 2.1, 4.2]) box(.04, .46, .04, dk, -w * .2 + Math.cos(a) * .1, .23, -d * .25 + Math.sin(a) * .1, g); return g; },
  // ---------- the parish church (stage 6): fittings of an English town church c.1450-1540, before the Reformation ----------
  pier: () => { const g = new THREE.Group(), st = mat.lime(); box(.62, .3, .62, st, 0, .15, 0, g); for (const [dx, dz] of [[0, 0], [.17, 0], [-.17, 0], [0, .17], [0, -.17]]) cyl(dx || dz ? .1 : .2, dx || dz ? .1 : .2, 3.3, st, dx, 1.95, dz, g, 10);   // a clustered pier: a core with four shafts, a moulded capital
    box(.66, .14, .66, st, 0, 3.66, 0, g); box(.56, .5, .56, st, 0, 4.0, 0, g); return g; },
  pew: (w, d) => { const g = new THREE.Group(), oak = T('wood', { rough: .7, color: 0xb08a68 }), dk = mat.dark();   // an oak bench, poppyheads on its ends, its back to the bench behind
    box(w * .96, .06, .36, oak, 0, .45, .02, g); box(w * .96, .46, .05, oak, 0, .72, -.2, g); box(w * .96, .06, .08, dk, 0, .98, -.2, g);
    for (const sx of [-1, 1]) { box(.07, .95, .46, dk, sx * w * .48, .48, -.02, g); const ph = new THREE.Mesh(new THREE.SphereGeometry(.07, 6, 5), dk); ph.scale.set(1, 1.5, 1); ph.position.set(sx * w * .48, 1.02, -.02); g.add(ph); } return g; },
  screen: (w, d, o) => { const g = new THREE.Group(), oak = mat.dark(), red = plain(0x9a3428, { rough: .8 }), grn = plain(0x3a6a4a, { rough: .8 }), gold = plain(0xc8a040, { metal: .4, rough: .4 });   // the rood screen: painted dado, open tracery, the loft on top, its parapet to the nave
    box(w, 1.1, .1, oak, 0, .55, 0, g); for (let i = 0; i < 2; i++) box(w * .4, .8, .02, i % 2 ? red : grn, -w * .22 + i * w * .44, .6, .06, g);
    for (const sx of [-.5, 0, .5]) box(.07, 2.1, .08, oak, sx * w * .96, 2.15, 0, g); box(w, .08, .1, gold, 0, 1.12, 0, g); for (const sx of [-.25, .25]) { box(.04, 1.6, .04, oak, sx * w, 2.0, 0, g); }
    box(w, .14, 1.2, oak, 0, 3.24, -.3, g); box(w, .55, .07, oak, 0, 3.58, -.88, g); box(w * .9, .4, .02, red, 0, 3.58, -.92, g); box(w, .06, .1, gold, 0, 3.88, -.88, g); return g; },
  rood: (w, d, o) => { const g = new THREE.Group(), oak = mat.dark(), gold = plain(0xc8a040, { metal: .4, rough: .4 }), skin = plain(0xd8b898, { rough: .8 }), blue = plain(0x3a5a98, { rough: .8 }), red = plain(0x9a3428, { rough: .8 });
    // the doorway through the screen, the loft carried over it, and on the loft the Rood: Christ on the cross between Mary and John, candles before it
    for (const sx of [-1, 1]) box(.1, 3.2, .12, oak, sx * w * .48, 1.6, 0, g); box(w, .14, 1.2, oak, 0, 3.24, -.3, g); box(w, .55, .07, oak, 0, 3.58, -.88, g); box(w, .06, .1, gold, 0, 3.88, -.88, g);
    box(.12, 2.0, .1, oak, 0, 4.3, -.3, g); box(1.1, .12, .1, oak, 0, 4.85, -.3, g); box(.16, .62, .08, skin, 0, 4.55, -.24, g); const hd = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), skin); hd.position.set(0, 4.95, -.24); g.add(hd);
    for (const [sx, c] of [[-.7, blue], [.7, red]]) { cyl(.11, .15, .6, c, sx, 3.95, -.3, g, 8); const h2 = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), skin); h2.position.set(sx, 4.32, -.3); g.add(h2); }
    for (const sx of [-.35, .35]) { cyl(.025, .025, .22, mat.candle(), sx, 3.98, -.7, g, 6); flame(g, sx, 4.12, -.7, .5); } return g; },
  parclose: (w, d) => { const g = new THREE.Group(), oak = mat.dark(); box(w, .9, .08, oak, 0, .45, 0, g); for (const sx of [-.5, 0, .5]) box(.06, 1.7, .07, oak, sx * w * .96, 1.75, 0, g); box(w, .1, .1, oak, 0, 2.6, 0, g);   // an openwork chapel screen
    for (const sx of [-.25, .25]) box(.03, 1.6, .03, oak, sx * w, 1.75, 0, g); return g; },
  highaltar: (w, d, o) => { const g = new THREE.Group(), st = mat.lime(), lin = plain(0xcfc6b4, { rough: 1 }), red = plain(0x8a2a24, { rough: .9 }), gold = plain(0xc8a040, { metal: .45, rough: .35 }), blue = plain(0x2a4a88, { rough: .8 }), hi = w >= 2.5;
    // a stone altar (the mensa on a solid base), its frontal and linen, the cross and two candles; the high altar has a painted reredos behind it
    box(w * .88, .95, .7, st, 0, .48, -.05, g); box(w * .94, .08, .8, plain(0xd8d0c0, { rough: .8 }), 0, .99, -.05, g); box(w * .9, .03, .82, lin, 0, 1.04, -.05, g); box(w * .8, .78, .02, red, 0, .52, .31, g); box(w * .8, .08, .025, gold, 0, .88, .32, g);
    box(.05, .5, .05, gold, 0, 1.3, -.25, g); box(.28, .05, .05, gold, 0, 1.4, -.25, g);
    for (const sx of [-.32, .32]) { cyl(.04, .07, .22, gold, sx * w, 1.15, -.2, g, 8); cyl(.03, .03, .3, mat.candle(), sx * w, 1.41, -.2, g, 6); flame(g, sx * w, 1.6, -.2, .5); const c = new THREE.Object3D(); c.userData.candle = [sx * w, 1.6, -.2]; g.add(c); }
    if (hi) { box(w * .96, 1.6, .1, gold, 0, 1.85, -.44, g); for (let i = 0; i < 5; i++) box(w * .16, 1.2, .02, i % 2 ? blue : red, -w * .38 + i * w * .19, 1.85, -.38, g); }
    else box(w * .7, .9, .06, blue, 0, 1.55, -.42, g); return g; },
  altar: (w, d, o) => BUILD.highaltar(w, d, o),
  footpace: (w, d) => { const g = new THREE.Group(); box(w * .98, .14, d * .94, T('floor_hall', { rough: .9, color: 0xc8c0b4 }), 0, .07, 0, g); return g; },
  tomb: (w, d, o) => { const g = new THREE.Group(), st = mat.lime(), pale = plain(0xe0dcd0, { rough: .6 }), dk = mat.stoneBig();   // a tomb chest with its effigy; the one on the chancel's north wall serves as the Easter sepulchre
    box(w * .9, .72, d * .72, st, 0, .36, -.05, g); for (let i = 0; i < 4; i++) box(w * .16, .4, .02, dk, -w * .3 + i * w * .2, .36, d * .31, g); box(w * .94, .08, d * .78, pale, 0, .76, -.05, g);
    box(w * .62, .14, .3, pale, -w * .04, .87, -.05, g); const hd = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 6), pale); hd.position.set(w * .33, .9, -.05); g.add(hd); box(.1, .14, .24, pale, -w * .36, .9, -.05, g);
    if (o && o.p && o.p.sepulchre) { box(w * .96, 1.6, .1, st, 0, 1.6, -d * .46, g); box(w * .7, .9, .04, dk, 0, 1.45, -d * .4, g); } return g; },
  sedilia: (w, d) => { const g = new THREE.Group(), st = mat.lime(), dk = mat.stoneBig();   // three stepped stone seats for priest, deacon and subdeacon, each under its own arch
    for (let i = 0; i < 3; i++) { const x = -w * .33 + i * w * .33, hh = .5 - i * .06; box(w * .3, hh, .4, st, x, hh / 2, -.1, g); box(w * .3, 1.5, .08, dk, x, .75 + hh, -.32, g); box(w * .32, .12, .5, st, x, 1.6, -.1, g); }
    return g; },
  stall: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), lt = mat.wood();   // quire stalls: tip-up seats, a panelled back with a cresting, a desk in front for the books
    box(w * .96, .08, .42, lt, 0, .45, -.12, g); box(w * .96, 1.3, .06, oak, 0, 1.1, -.35, g); box(w * .98, .14, .3, oak, 0, 1.82, -.25, g); for (let i = 0; i <= 3; i++) box(.06, .95, .42, oak, -w * .48 + i * w * .32, .48, -.12, g);
    box(w * .96, .75, .05, oak, 0, .38, .3, g); box(w * .96, .05, .24, lt, 0, .8, .22, g); return g; },
  lectern: () => { const g = new THREE.Group(), br = plain(0xb89848, { metal: .55, rough: .35 });   // the brass eagle lectern: the Gospel on its spread wings
    cyl(.22, .26, .08, br, 0, .04, 0, g, 10); cyl(.05, .07, 1.0, br, 0, .55, 0, g, 8); const b = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), br); b.scale.set(1, .8, 1.5); b.position.set(0, 1.15, 0); g.add(b);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), br); hd.position.set(0, 1.25, .2); g.add(hd); for (const sx of [-1, 1]) { const wg = box(.26, .03, .34, br, sx * .14, 1.24, -.02, g); wg.rotation.z = sx * .25; }
    box(.38, .05, .28, plain(0x6a2a20, { rough: .9 }), 0, 1.3, -.02, g); return g; },
  pulpit: () => { const g = new THREE.Group(), oak = mat.dark(), lt = mat.wood();   // a wine-glass pulpit: a panelled drum on a stem, a few steps behind
    cyl(.14, .2, 1.0, oak, 0, .5, -.05, g, 8); cyl(.42, .34, .95, lt, 0, 1.5, -.05, g, 8); cyl(.45, .45, .06, oak, 0, 1.98, -.05, g, 8); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + Math.PI / 8; box(.04, .7, .04, oak, Math.cos(a) * .41, 1.5, -.05 + Math.sin(a) * .41, g); }
    for (let i = 0; i < 3; i++) box(.3, .1, .22, oak, -.38 - i * .05, .3 + i * .32, -.3 - i * .12, g); return g; },
  font: (w, d) => { const g = new THREE.Group(), st = mat.lime(), oak = mat.dark();   // the font by the door: an octagonal bowl on its stem, on a step, its lid locked
    cyl(.9, .95, .16, st, 0, .08, 0, g, 8); cyl(.6, .65, .14, st, 0, .23, 0, g, 8); cyl(.18, .24, .55, st, 0, .57, 0, g, 8); cyl(.5, .3, .42, st, 0, 1.03, 0, g, 8);
    cyl(.5, .5, .06, oak, 0, 1.27, 0, g, 8); const lid = new THREE.Mesh(new THREE.ConeGeometry(.36, .55, 8), oak); lid.position.set(0, 1.57, 0); g.add(lid); box(.04, .1, .06, mat.iron(), .5, 1.22, 0, g); return g; },
  wallpaint: (w) => { const g = new THREE.Group(), P2 = (c) => plain(c, { rough: 1 });   // St Christopher, opposite the door: the giant wading the river with the Christ child on his shoulder
    const z = -.44; box(w * .92, 2.9, .02, P2(0xe0d2b4), 0, 2.45, z, g); box(w * .92, .06, .03, P2(0x9a3428), 0, 3.9, z, g); box(w * .92, .06, .03, P2(0x9a3428), 0, 1.0, z, g);
    box(w * .9, .45, .03, P2(0x4a6a88), 0, 1.25, z + .005, g); box(.5, 1.4, .03, P2(0xa84a30), 0, 2.2, z + .01, g); box(.22, .22, .03, P2(0xd8b898), 0, 3.05, z + .012, g); box(.24, .06, .03, P2(0x6a4a2a), 0, 3.18, z + .013, g);
    box(.14, .26, .03, P2(0xc8a040), .2, 3.28, z + .014, g); box(.1, .1, .03, P2(0xd8b898), .2, 3.46, z + .015, g); box(.04, 2.3, .03, P2(0x5a3a22), -.38, 2.1, z + .016, g); box(.2, .12, .03, P2(0x3a6a4a), -.38, 3.25, z + .017, g); return g; },
  image: (w, d) => { const g = new THREE.Group(), st = mat.lime(), gold = plain(0xc8a040, { metal: .4, rough: .4 });   // a saint's image on a bracket, a light burning before it
    box(.4, .12, .3, st, 0, 1.7, -.3, g); cyl(.1, .14, .6, plain(0x3a5a98, { rough: .8 }), 0, 2.06, -.3, g, 8); const hd = new THREE.Mesh(new THREE.SphereGeometry(.08, 8, 6), plain(0xd8b898)); hd.position.set(0, 2.43, -.3); g.add(hd);
    const nb = new THREE.Mesh(new THREE.TorusGeometry(.11, .015, 4, 12), gold); nb.position.set(0, 2.45, -.35); g.add(nb); cyl(.03, .03, .1, mat.candle(), 0, 1.81, -.18, g, 6); flame(g, 0, 1.9, -.18, .4); return g; },
  bellropes: (w, d, o) => { const g = new THREE.Group(), rope = plain(0xc8b088, { rough: 1 }), red = plain(0xa83a30, { rough: 1 }), wh = plain(0xe8e0d0, { rough: 1 }), ring = o && o.p && o.p.ring;   // the bell ropes hanging through: striped woollen sallies at hand height
    for (let i = 0; i < 3; i++) { const x = -w * .3 + i * w * .3, z = (i % 2 ? .2 : -.2); cyl(.02, .02, ring ? 2.4 : 3.2, rope, x, ring ? 1.2 + .7 : 3.0, z, g, 5); for (let k = 0; k < 3; k++) cyl(.05, .05, .1, k % 2 ? wh : red, x, (ring ? 1.4 : 1.9) + k * .1, z, g, 6); }
    return g; },
  bellframe: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), br = plain(0xc09650, { metal: .15, rough: .45 });   // the bells hung in their oak frame, each on a headstock with its wheel
    for (const sz of [-1, 1]) { box(w * .95, .18, .18, oak, 0, .09, sz * d * .4, g); box(w * .95, .14, .14, oak, 0, 1.9, sz * d * .4, g); for (let i = 0; i < 4; i++) { const b2 = box(.14, 2.0, .14, oak, -w * .45 + i * w * .3, 1.0, sz * d * .4, g); b2.rotation.z = i % 2 ? .25 : -.25; } }
    for (let i = 0; i < 3; i++) { const x = -w * .3 + i * w * .3, s2 = 1 - i * .12; const bl = new THREE.Mesh(new THREE.LatheGeometry([[0, .3], [.15, .3], [.17, .26], [.18, .12], [.22, -.02], [.32, -.16], [.37, -.25], [.35, -.27], [0, -.24]].map(([r, y]) => new THREE.Vector2(r * s2, y * s2)), 16), br); bl.position.set(x, 1.3, 0); g.add(bl);
      cyl(.17 * s2, .17 * s2, .06, br, x, 1.25 + .28 * s2, 0, g, 12); box(.12, .12, .8 * s2, oak, x, 1.66, 0, g); const wh = new THREE.Mesh(new THREE.TorusGeometry(.42 * s2, .03, 4, 16), oak); wh.position.set(x + .3, 1.6, 0); wh.rotation.y = Math.PI / 2; g.add(wh); }
    return g; },
  // ---------- civic buildings (stage 7): guildhall / town hall, keep ----------
  post: (w, d) => { const g = new THREE.Group(), oak = T('wood_v', { rough: .85, color: 0x8a6650 }), hd = mat.beam(), st = mat.lime();   // an oak post on a stone pad, a head beam across it carrying the hall floor, a brace each side
    box(.42, .22, .42, st, 0, .11, 0, g); box(.26, 2.7, .26, oak, 0, 1.57, 0, g); box(1.5, .24, .28, hd, 0, 3.0, 0, g);
    for (const sx of [-1, 1]) { const b2 = box(.09, .62, .1, hd, sx * .28, 2.62, 0, g); b2.rotation.z = sx * .75; } return g; },
  hallscreen: (w, d, o) => { const g = new THREE.Group(), oak = mat.dark(), lt = mat.wood();   // the screen at the low end of the hall: linenfold panels, posts, the gallery front above the passage
    box(w, 2.2, .1, oak, 0, 1.1, 0, g); for (let i = 0; i < 2; i++) box(w * .38, 1.5, .02, lt, -w * .22 + i * w * .44, 1.05, .06, g);
    for (const sx of [-.5, .5]) box(.1, 3.3, .14, oak, sx * w * .96, 1.65, 0, g); box(w, .14, .14, oak, 0, 2.27, 0, g);
    box(w, .12, 1.0, oak, 0, 2.86, -.45, g); box(w, .62, .07, oak, 0, 3.2, .03, g); for (const sx of [-.3, 0, .3]) box(.05, .5, .04, lt, sx * w, 3.2, .08, g); box(w, .07, .12, oak, 0, 3.54, .03, g); return g; },
  dais: (w, d) => { const g = new THREE.Group(); box(w * .995, .24, d * .995, T('board', { rough: .9, color: 0xe8d4b4 }), 0, .12, 0, g); box(w * .995, .06, .08, mat.dark(), 0, .21, d / 2 - .04, g);   // a raised boarded floor, its edge moulded, a carpet laid where the table stands
    box(w * .7, .02, d * .8, mat.red(), 0, .25, 0, g); return g; },
  hightable: (w, d) => { const g = BUILD.table(w, d, {}), cloth = mat.linen(); box(w * .96, .02, d * .62, cloth, 0, .79, 0, g); box(w * .96, .3, .02, cloth, 0, .64, d * .31, g);   // a board on trestles under a white cloth, the salt and plate set out
    const pw = mat.pewter(), sl = plain(0xd8c060, { metal: .5, rough: .3 }); for (let i = 0; i < 4; i++) cyl(.09, .09, .02, pw, -w * .36 + i * w * .24, .81, .05, g, 10); cyl(.05, .07, .16, sl, 0, .88, -.05, g, 8); return g; },
  chairstate: () => { const g = new THREE.Group(), oak = mat.dark(), red = mat.red(); g.scale.setScalar(1.15);   // the chair of state: a box chair with a high panelled back and a cushion
    box(.6, .5, .5, oak, 0, .25, 0, g); box(.62, .06, .54, oak, 0, .52, 0, g); box(.5, .07, .44, red, 0, .58, .02, g); box(.62, 1.1, .08, oak, 0, 1.08, -.24, g); for (const sx of [-1, 1]) box(.07, .3, .5, oak, sx * .28, .72, 0, g);
    box(.68, .08, .14, oak, 0, 1.66, -.22, g); return g; },
  hanging: (w, d, o) => { const g = new THREE.Group(), P2 = (c) => plain(c, { rough: 1 }), z = -d * .44;   // painted cloths behind the high table (the cloth of estate); in the council chamber the Doom that reminds judges of their own judgement
    if (o && o.p && o.p.doom) { box(w * .9, 1.6, .02, P2(0xd8c8a0), 0, 2.1, z, g); box(w * .3, .4, .02, P2(0xc8a040), 0, 2.6, z + .01, g); box(w * .3, .5, .02, P2(0x7a2a20), -w * .28, 1.6, z + .01, g); box(w * .3, .5, .02, P2(0x5a7a9a), w * .28, 1.6, z + .01, g); return g; }
    box(w * .92, 2.0, .02, P2(0x7a2a24), 0, 2.0, z, g); for (let i = 0; i < Math.max(2, Math.round(w)); i++) box(.06, 2.0, .025, P2(0xc8a040), -w * .4 + i * w * .8 / Math.max(1, Math.round(w) - 1), 2.0, z + .006, g);
    box(w * .96, .1, .06, mat.dark(), 0, 3.05, z, g); return g; },
  townchest: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), ir = mat.iron();   // the town chest: oak bound all over in iron straps, three locks for three key-holders
    box(w * .9, .62, d * .62, oak, 0, .33, -.05, g); box(w * .92, .08, d * .66, oak, 0, .66, -.05, g); for (let i = 0; i < 5; i++) box(.05, .7, d * .66, ir, -w * .42 + i * w * .21, .35, -.05, g); box(w * .92, .05, d * .67, ir, 0, .5, -.05, g);
    for (const sx of [-.25, 0, .25]) { box(.1, .14, .04, ir, sx * w, .52, d * .27, g); cyl(.035, .035, .02, mat.pewter(), sx * w, .45, d * .29, g, 8); } return g; },
  armsrack: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), ir = mat.iron(), wd = mat.wood();   // a rack of staff weapons: bills and pikes against the wall, a sallet and a jack on pegs
    box(w * .9, .08, .3, oak, 0, .2, -.2, g); box(w * .9, .08, .12, oak, 0, 1.6, -.36, g); const n = Math.max(3, Math.round(w * 4));
    for (let i = 0; i < n; i++) { const x = -w * .4 + i * w * .8 / (n - 1); cyl(.025, .025, 2.6, wd, x, 1.4, -.25, g, 5); box(.06, .22, .03, ir, x + (i % 2 ? .04 : 0), 2.78, -.25, g); }
    const hm = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), ir); hm.position.set(0, 1.7, -.3); g.add(hm); return g; },
  stocks: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), ir = mat.iron();   // the stocks: two oak boards with leg holes, a bench behind
    for (const sx of [-1, 1]) box(.12, .6, .2, oak, sx * w * .44, .3, 0, g); box(w * .92, .3, .1, oak, 0, .3, .05, g); box(w * .92, .04, .12, ir, 0, .46, .05, g); for (const sx of [-.3, -.1, .1, .3]) cyl(.05, .05, .12, mat.soot(), sx * w, .3, .05, g, 8).rotation.x = Math.PI / 2;
    box(w * .8, .06, .3, mat.wood(), 0, .42, -.32, g); for (const sx of [-1, 1]) box(.06, .4, .26, oak, sx * w * .36, .2, -.32, g); return g; },
  bar: (w, d) => { const g = new THREE.Group(), oak = mat.dark();   // the bar of the court: a rail across the hall below the bench, a gate in it
    box(w * .98, .08, .1, oak, 0, 1.0, 0, g); box(w * .98, .06, .08, oak, 0, .1, 0, g); for (let i = 0; i <= Math.round(w * 2); i++) box(.05, .95, .05, oak, -w * .49 + i * w * .98 / Math.round(w * 2), .52, 0, g); return g; },
  tron: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), ir = mat.iron(), br = plain(0x9a7a40, { metal: .45, rough: .45 });   // the town beam (tron): a tall post with the great balance for wool and lead, iron weights at its foot
    box(.2, 2.6, .2, oak, 0, 1.3, -.1, g); box(1.7, .08, .08, ir, 0, 2.45, 0, g); for (const sx of [-.8, .8]) { box(.02, .9, .02, ir, sx, 2.0, 0, g); box(.5, .05, .5, br, sx, 1.55, 0, g); }
    for (let i = 0; i < 4; i++) box(.16 - i * .02, .14 - i * .02, .16 - i * .02, ir, -.5 + i * .3, .07, .3, g); box(.5, .4, .4, mat.sack(), .55, .2, -.1, g); return g; },
  hoist: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), wd = mat.wood(), rope = plain(0xc8b088, { rough: 1 });   // the hoist wheel: a big spoked wheel on a frame, its rope over the axle and out through the loading door above the street
    for (const sx of [-1, 1]) { box(.1, 1.7, .1, oak, sx * .32, .85, -.05, g); box(.1, .1, .6, oak, sx * .32, .05, -.05, g); }
    const wh = new THREE.Mesh(new THREE.TorusGeometry(.62, .05, 4, 16), wd); wh.position.set(0, 1.15, -.05); wh.rotation.y = Math.PI / 2; g.add(wh);
    for (let k = 0; k < 4; k++) { const sp = box(.04, 1.2, .04, wd, 0, 1.15, -.05, g); sp.rotation.x = k * Math.PI / 4; }
    cyl(.07, .07, .8, oak, 0, 1.15, -.05, g, 8).rotation.z = Math.PI / 2; cyl(.02, .02, 2.0, rope, .12, 1.5, .3, g, 5).rotation.x = .9; return g; },
  // ---------- working buildings and gates ----------
  millstones: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), wd = mat.wood(), st = plain(0xb8b0a4, { rough: .95 });   // the hurst frame, the stones in their wooden tun, the hopper over them on its horse, the meal spout
    box(w * .95, .6, d * .95, oak, 0, .3, 0, g); box(w * .98, .06, d * .98, wd, 0, .63, 0, g); cyl(.66, .66, .34, wd, 0, .83, 0, g, 16); cyl(.6, .6, .04, st, 0, 1.0, 0, g, 16);
    for (const sx of [-1, 1]) box(.07, .7, .07, oak, sx * .3, 1.35, 0, g); box(.7, .06, .5, oak, 0, 1.62, 0, g); const hp = new THREE.Mesh(new THREE.CylinderGeometry(.34, .08, .45, 4, 1, true), wd); hp.material.side = THREE.DoubleSide; hp.position.set(0, 1.85, 0); hp.rotation.y = Math.PI / 4; g.add(hp);
    const sp = box(.12, .1, .5, wd, w * .32, .55, d * .4, g); sp.rotation.x = .5; return g; },
  pitwheel: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), wd = mat.wood();   // the pit wheel turning in its pit by the wall, the great shaft coming through from the water wheel outside
    box(w * .95, .12, d * .8, plain(0x2a241e, { rough: 1 }), 0, .02, 0, g); const wh = new THREE.Mesh(new THREE.TorusGeometry(.75, .08, 5, 18), wd); wh.position.set(0, .55, -.1); g.add(wh);
    for (let k = 0; k < 4; k++) { const sp = box(.06, 1.5, .06, oak, 0, .55, -.1, g); sp.rotation.z = k * Math.PI / 4; } cyl(.12, .12, d * 1.2, oak, 0, .55, -.1, g, 8).rotation.x = Math.PI / 2;
    for (const sx of [-1, 1]) box(.12, 1.2, .12, oak, sx * w * .45, .6, -.1, g); box(w * .95, .1, .14, oak, 0, 1.25, -.1, g); return g; },
  fullingstocks: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), wd = mat.wood();   // fulling stocks: two great oak hammers on long helves, lifted by tappets on the wheel shaft and dropped into the trough of wet cloth
    box(w * .9, .5, d * .45, wd, 0, .25, d * .15, g); box(w * .8, .06, d * .35, plain(0x8a9aa8, { rough: .4 }), 0, .51, d * .15, g);
    for (const sx of [-1, 1]) box(.14, 1.6, .14, oak, sx * w * .44, .8, -d * .3, g); box(w * .95, .14, .16, oak, 0, 1.55, -d * .3, g);
    for (const sx of [-.22, .22]) { const h = box(.1, .1, d * .7, oak, sx * w, 1.05, -d * .05, g); h.rotation.x = -.35; box(.32, .34, .3, oak, sx * w, .78, d * .22, g); }
    cyl(.1, .1, w * .95, oak, 0, 1.25, -d * .42, g, 8).rotation.z = Math.PI / 2; return g; },
  bin: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark();   // a boarded bin of meal or grain, open at the top
    for (const [x, z, bw, bd] of [[0, -d * .35, w * .94, .06], [0, d * .35, w * .94, .06], [-w * .45, 0, .06, d * .76], [w * .45, 0, .06, d * .76]]) box(bw, .75, bd, wd, x, .38, z, g); box(w * .88, .05, d * .66, plain(0xe8dcc0, { rough: 1 }), 0, .6, 0, g);
    for (const sx of [-1, 1]) box(.08, .82, .08, dk, sx * w * .45, .41, d * .35, g); return g; },
  portslot: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), ir = mat.iron();   // the slot in the floor where the portcullis rises, its iron-shod oak grid showing at the top
    box(w * .98, .04, d * .5, plain(0x14100c, { rough: 1 }), 0, .005, 0, g); for (let i = 0; i < Math.round(w * 4); i++) box(.06, .5, .1, oak, -w * .45 + i * w * .9 / (Math.round(w * 4) - 1), .25, 0, g); box(w * .95, .08, .12, ir, 0, .48, 0, g);
    for (const sx of [-1, 1]) box(.14, .2, d * .8, plain(0xb8b0a4, { rough: .95 }), sx * w * .49, .1, 0, g); return g; },
  windlass: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), ir = mat.iron();   // the windlass that raises the portcullis: a drum between two cheeks, capstan bars, chains running down to the slot
    for (const sx of [-1, 1]) { box(.12, 1.1, d * .8, oak, sx * w * .44, .55, 0, g); box(.14, .12, d * .9, oak, sx * w * .44, .06, 0, g); }
    cyl(.22, .22, w * .82, oak, 0, .9, 0, g, 10).rotation.z = Math.PI / 2; for (let k = 0; k < 2; k++) { const b2 = box(.05, 1.1, .05, mat.wood(), w * .52, .9, 0, g); b2.rotation.x = k * Math.PI / 2; }
    for (const sx of [-.25, .25]) cyl(.025, .025, 1.6, ir, sx * w, .9, .7, g, 5).rotation.x = Math.PI / 2 - .5; return g; },
  murder: (w, d) => { const g = new THREE.Group(), dk = plain(0x14100c, { rough: 1 }), st = plain(0xb8b0a4, { rough: .95 });   // murder holes: slots in the floor over the gate passage, their stone lids beside them
    for (const sx of [-.25, .25]) { box(.3, .02, .4, dk, sx * w, .005, 0, g); box(.34, .06, .44, plain(0x8a8278, { rough: .95 }), sx * w + .05, .03, .45, g); } return g; },
  furnace: (w, d) => { const g = new THREE.Group(), st = mat.stoneBig(), br = T('brick_a', { rough: .9 }), glow = plain(0xff7020, { emissive: 0xff5010, ei: 2.2 });   // a shaft furnace in rough stone, the brick stack over it, the tap hole glowing at the front
    box(w * .9, 1.7, d * .9, st, 0, .85, 0, g); box(w * .6, 3.5, d * .6, br, 0, 3.4, -.1, g); box(.5, .4, .06, glow, 0, .45, d * .45 + .01, g); box(.7, .08, .4, plain(0x2a1e16), 0, .25, d * .45 + .2, g);
    box(w * .5, .5, .3, plain(0x3a3028, { rough: 1 }), 0, 1.9, d * .3, g); g.userData.fire = [0, .5, d * .45]; return g; },
  bellows: (w, d) => { const g = new THREE.Group(), lea = plain(0x5a3420, { rough: .85 }), oak = mat.dark(), wd = mat.wood(), ir = mat.iron();   // a pair of great bellows lying on a bed, nozzles toward the furnace, worked by a rocking lever overhead
    box(w * .9, .35, d * .8, oak, 0, .18, 0, g);
    for (const sx of [-.24, .24]) { const top = box(.5, .05, d * .7, wd, sx * w, .72, -.02, g); top.rotation.x = .12; box(.46, .3, d * .62, lea, sx * w, .52, .02, g); box(.36, .05, d * .6, wd, sx * w, .38, 0, g);
      cyl(.04, .07, .4, ir, sx * w * .6, .45, -d * .45, g, 6).rotation.x = Math.PI / 2; }
    for (const sx of [-1, 1]) box(.08, 1.5, .08, oak, sx * w * .46, .9, d * .3, g); const lv = box(w * .95, .07, .07, oak, 0, 1.6, d * .3, g); lv.rotation.z = .12; return g; },
  moulds: (w, d) => { const g = new THREE.Group(), st = plain(0x9a9088, { rough: .9 }), lead = plain(0x8a8e98, { metal: .5, rough: .4 });   // sand moulds on a low bed, some pigs of metal cooling in them
    box(w * .94, .2, d * .7, st, 0, .1, 0, g); for (let i = 0; i < 4; i++) box(w * .16, .05, d * .4, i < 2 ? lead : plain(0x2a2420), -w * .33 + i * w * .22, .22, 0, g); return g; },
  slag: () => { const g = new THREE.Group(), m = plain(0x2a2a30, { rough: .6, metal: .2 }); for (let i = 0; i < 6; i++) { const b2 = box(.14 + (i % 3) * .05, .1, .14, m, ((i * 37) % 7) / 10 - .3, .05 + (i % 2) * .08, ((i * 53) % 7) / 10 - .3, g); b2.rotation.y = i; } return g; },
  oreheap: (w, d) => heap(w, d, [0x7a5a48, 0x8a6a52, 0x5a4a42, 0x9a7458], .55, .14, 'ore'),     // broken ore: a mound of lumps, rusty and grey
  charcoal: (w, d) => heap(w, d, [0x1e1c1c, 0x2a2624, 0x141212, 0x34302c], .45, .1, 'coal'),       // charcoal: a black heap of sticks and lumps
  mortar: () => { const g = new THREE.Group(), br = plain(0x9a7a40, { metal: .45, rough: .45 });   // the apothecary's great bronze mortar on a block, the pestle standing in it
    box(.56, .42, .56, mat.wood(), 0, .21, 0, g); box(.6, .05, .6, mat.dark(), 0, .44, 0, g);   // a squared oak block, the mortar sitting on it
    cyl(.26, .19, .34, br, 0, .63, 0, g, 18); cyl(.27, .27, .04, br, 0, .8, 0, g, 18); cyl(.2, .2, .02, plain(0x3a2a1c, { rough: 1 }), 0, .815, 0, g, 16); for (const sx of [-1, 1]) box(.08, .07, .07, br, sx * .27, .66, 0, g);
    const ps = cyl(.035, .05, .62, mat.wood(), .07, 1.02, 0, g, 8); ps.rotation.z = -.3; return g; },
  grindstone: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(), ir = plain(0xa0a4aa, { metal: .2, rough: .5 });   // a sandstone wheel facing the room, turned by a crank over its water trough
    box(.86, .26, .4, wd, 0, .3, 0, g); box(.76, .04, .3, plain(0x6a8898, { rough: .2 }), 0, .43, 0, g);
    for (const sz of [-1, 1]) { box(.08, .88, .08, dk, 0, .44, sz * .2, g); box(.5, .07, .07, dk, 0, .06, sz * .2, g); }
    const st = cyl(.38, .38, .17, plain(0xd2c6ac, { rough: 1 }), 0, .86, 0, g, 24); st.rotation.x = Math.PI / 2;
    const hub = cyl(.08, .08, .19, plain(0x8a7a62), 0, .86, 0, g, 10); hub.rotation.x = Math.PI / 2;
    cyl(.025, .025, .56, ir, 0, .86, 0, g).rotation.x = Math.PI / 2;
    box(.04, .26, .04, ir, 0, .74, .28, g); box(.04, .04, .16, ir, 0, .62, .34, g); g.scale.setScalar(Math.min(w, d) * .95); return g; },
  dipframe: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const L = w * .9;   // the chandler's frame: rods of dipped candles hanging to dry, the tallow pot below
    for (const sx of [-1, 1]) box(.08, 1.6, .08, dk, sx * L / 2, .8, 0, g); for (const y of [1.55, 1.05]) box(L, .05, .05, wd, 0, y, 0, g);
    const cm = mat.candle(); for (const y of [1.55, 1.05]) for (let i = 0; i < 9; i++) { cyl(.025, .03, .4, cm, -L / 2 + .2 + i * (L - .4) / 8, y - .22, 0, g, 6); }
    cyl(.26, .22, .35, mat.iron(), L * .25, .18, d * .15, g, 12); cyl(.23, .23, .02, plain(0xf0e4c8, { rough: .6 }), L * .25, .35, d * .15, g, 12); return g; },
  staves: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), ir = mat.iron();   // the cooper's work: a cask being raised in its hoop, staves stacked by it
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; if (i % 4 === 3) continue; const sv = box(.09, .7, .03, wd, Math.cos(a) * .22, .35, Math.sin(a) * .22, g); sv.rotation.y = -a + Math.PI / 2; sv.rotation.z = Math.cos(a) * .08; sv.rotation.x = -Math.sin(a) * .08; }
    for (const y of [.12, .6]) { const h = new THREE.Mesh(new THREE.TorusGeometry(.25, .02, 4, 18), ir); h.rotation.x = Math.PI / 2; h.position.y = y; g.add(h); }
    for (let i = 0; i < 5; i++) box(.08, .03, .75, wd, .32 + (i % 2) * .02, .02 + i * .035, 0, g); return g; },
  clothshelf: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const W = w * .92, D = d * .45, z = -d / 2 + D / 2 + .05;   // pigeon-holes of folded cloth in many colours
    for (const sx of [-1, 0, 1]) box(.05, 1.8, D, dk, sx * W / 2, .9, z, g); for (const y of [.05, .6, 1.15, 1.7]) box(W, .04, D, wd, 0, y, z, g);
    const cs = [mat.red(), mat.teal(), mat.linen(), plain(0xd8b040, { rough: 1 }), plain(0x5a4a8a, { rough: 1 }), plain(0x6a8a4a, { rough: 1 })]; let k = 0;
    for (const y of [.07, .62, 1.17]) for (let i = 0; i < 4; i++) { const n = 2 + (k % 2); for (let j = 0; j < n; j++) box(W / 4 - .1, .1, D - .06, cs[(k + j) % cs.length], -W / 2 + W / 8 + i * W / 4, y + .07 + j * .11, z, g); k++; } return g; },
  barrel: (w, d) => fitTo(build('barrel'), w * .78, d * .78),
  stillage: (w, d) => { const g = new THREE.Group(), dk = mat.dark(); for (const sz of [-1, 1]) box(w * .95, .16, .12, dk, 0, .08, sz * d * .25, g);
    for (const sx of [-1, 1]) { const b = build('barrel'); fitTo(b, .75, .75); b.rotation.z = Math.PI / 2; b.position.set(sx * w * .24, .48, 0); g.add(b); } return g; },
  desk: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), wd = mat.wood(); box(w * .8, .78, d * .55, dk, 0, .39, -d * .1, g); const top = box(w * .86, .05, d * .6, wd, 0, .84, -d * .1, g); top.rotation.x = .12;
    box(.2, .02, .26, mat.linen(), -.1, .9, -d * .1, g); for (let i = 0; i < 4; i++) cyl(.03, .03, .015, plain(0xd8b040, { metal: .6, rough: .35 }), .12 + (i % 2) * .07, .88 + (i >> 1) * .015, -d * .12, g);
    const st = BUILD.stool(1, 1); st.position.z = d * .38; g.add(st); return g; },
  wheel: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); g.scale.setScalar(1.35); box(.6, .06, .22, wd, 0, .32, 0, g); for (const [x, z] of [[-.25, -.08], [-.25, .08], [.25, 0]]) { const l = box(.05, .34, .05, wd, x, .16, z, g); l.rotation.z = x > 0 ? -.2 : .2; }
    const wh = new THREE.Mesh(new THREE.TorusGeometry(.3, .025, 6, 18), wd); wh.position.set(.08, .72, 0); wh.rotation.y = Math.PI / 2; wh.castShadow = true; g.add(wh);
    for (let i = 0; i < 4; i++) { const s = box(.02, .58, .02, wd, .08, .72, 0, g); s.rotation.x = i * Math.PI / 4; } box(.04, .45, .04, wd, .08, .5, 0, g); box(.04, .55, .04, wd, -.2, .6, 0, g); cyl(.05, .05, .1, mat.linen(), -.2, .92, 0, g); return g; },
  closestool: (w, d) => { const g = new THREE.Group(); box(.56, .5, .48, mat.wood(), 0, .25, 0, g); box(.6, .05, .52, mat.dark(), 0, .52, 0, g); box(.62, .03, .54, mat.red(), 0, .56, 0, g); box(.62, .2, .02, mat.red(), 0, .46, .27, g); for (const sx of [-1, 1]) box(.03, .03, .16, mat.iron(), sx * .3, .4, 0, g); return g; },
  washstand: (w, d) => { const g = new THREE.Group(); g.scale.setScalar(1.2); box(.5, .7, .4, mat.wood(), 0, .35, 0, g); cyl(.18, .12, .1, mat.pewter(), 0, .76, 0, g); cyl(.05, .08, .24, mat.pewter(), .12, .88, -.08, g); return g; },
  stool: () => { const g = new THREE.Group(), wd = mat.wood(); g.scale.setScalar(1.4); cyl(.17, .17, .05, wd, 0, .44, 0, g, 12); for (let i = 0; i < 3; i++) { const a = i * 2.09, l = box(.04, .44, .04, mat.dark(), Math.cos(a) * .11, .21, Math.sin(a) * .11, g); l.rotation.set(Math.sin(a) * .15, 0, -Math.cos(a) * .15); } return g; },
  chair: () => { const g = new THREE.Group(), wd = mat.wood(); g.scale.setScalar(1.2); box(.48, .06, .44, wd, 0, .46, 0, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.06, .46, .06, wd, sx * .2, .23, sz * .18, g);
    box(.48, .7, .06, wd, 0, .82, -.2, g); for (const sx of [-1, 1]) box(.05, .05, .4, wd, sx * .22, .68, 0, g); return g; },
  woodpile: (w, d) => { const g = new THREE.Group(), wd = [T('bark', { rough: 1, color: 0xc0a088 }), plain(0xe0c090, { rough: 1 }), plain(0xe0c090, { rough: 1 })]; for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) { const l = cyl(.09, .09, d * .8, wd, -w * .28 + i * .19 + r * .095, .09 + r * .16, 0, g, 7); l.rotation.x = Math.PI / 2; } return g; },   // the sawn ends face the room
  basket: () => { const g = new THREE.Group(); g.scale.setScalar(1.3); const b = new THREE.Mesh(new THREE.CylinderGeometry(.24, .18, .3, 12, 1, true), plain(0xb08a58, { rough: 1 })); b.material.side = THREE.DoubleSide; b.position.y = .15; b.castShadow = true; g.add(b);
    const f = new THREE.Mesh(new THREE.CircleGeometry(.22, 12), plain(Math.random() < .5 ? 0x8a9a50 : 0xd8c8a0, { rough: 1 })); f.rotation.x = -Math.PI / 2; f.position.y = .26; g.add(f); return g; },
  bucket: () => { const g = new THREE.Group(); g.scale.setScalar(1.35); cyl(.16, .13, .3, mat.wood(), 0, .15, 0, g, 12); const w = new THREE.Mesh(new THREE.CircleGeometry(.14, 12), plain(0x506878, { rough: .2 })); w.rotation.x = -Math.PI / 2; w.position.y = .27; g.add(w); return g; },
  tub: (w, d) => { const g = new THREE.Group(); cyl(.36, .3, .4, mat.wood(), 0, .2, 0, g, 14); const wt = new THREE.Mesh(new THREE.CircleGeometry(.33, 14), plain(0x5a7080, { rough: .2 })); wt.rotation.x = -Math.PI / 2; wt.position.y = .36; g.add(wt);
    for (const y of [.08, .32]) { const h = new THREE.Mesh(new THREE.TorusGeometry(.345 - y * .1, .012, 4, 18), mat.iron()); h.rotation.x = Math.PI / 2; h.position.y = y; g.add(h); } return g; },
  washtub: (w, d) => BUILD.tub(w, d),
  vat: (w, d) => { const g = new THREE.Group(); cyl(.42, .4, .85, mat.wood(), 0, .42, 0, g, 14); const wt = new THREE.Mesh(new THREE.CircleGeometry(.4, 14), plain(0x2a3a8a, { rough: .2 })); wt.rotation.x = -Math.PI / 2; wt.position.y = .8; g.add(wt); return g; },
  sack: () => { const g = new THREE.Group(); for (const [x, z, s] of [[-.15, 0, 1], [.16, .05, .9], [0, -.12, .8]]) { const m = new THREE.Mesh(new THREE.SphereGeometry(.2 * s, 8, 6), mat.sack()); m.scale.set(1, 1.35, .9); m.position.set(x, .25 * s, z); m.castShadow = true; g.add(m); } return g; },
  crate: () => { const g = new THREE.Group(); box(.66, .6, .66, T('crate', { rough: .9 }), 0, .3, 0, g); box(.46, .4, .46, T('crate', { rough: .9 }), .05, .8, -.02, g); return g; },
  candlestand: (w, d) => { const g = new THREE.Group(); const ir = mat.iron(); box(.07, 1.3, .07, ir, 0, .65, 0, g); cyl(.16, .12, .04, ir, 0, 1.3, 0, g); box(.36, .04, .04, ir, 0, .03, 0, g); box(.04, .04, .36, ir, 0, .03, 0, g); for (let i = 0; i < 3; i++) { const l = box(.03, .3, .03, ir, Math.cos(i * 2.09) * .1, .1, Math.sin(i * 2.09) * .1, g); l.rotation.set(Math.sin(i * 2.09) * .6, 0, -Math.cos(i * 2.09) * .6); } candleOn(g, 0, 1.3, 0); return g; },
  form: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); box(w * .9, .05, .26, wd, 0, .44, 0, g); for (const sx of [-1, 1]) box(.05, .42, .22, mat.dark(), sx * w * .38, .21, 0, g); return g; },
  trap: () => { const g = new THREE.Group(); box(.9, .03, .9, T('board', { rough: .9, color: 0x8a6a50 }), 0, .015, 0, g); for (const z of [-.3, .3]) box(.9, .035, .06, mat.dark(), 0, .02, z, g); const r = new THREE.Mesh(new THREE.TorusGeometry(.06, .012, 6, 12), mat.iron()); r.rotation.x = -Math.PI / 2; r.position.set(.25, .04, 0); g.add(r); return g; },
  sickbed: (w, d) => { const g = new THREE.Group(), oak = mat.dark(), lin = mat.linen(), cur = plain(0xb8a88c, { rough: 1 }), blk = plain(0x6a5a8a, { rough: 1 });   // a bed in its bay: low frame, linen, a coverlet, curtains on a rail at the sides and foot
    box(w * .78, .32, d * .88, oak, 0, .2, 0, g); box(w * .74, .1, d * .84, lin, 0, .41, 0, g); box(w * .74, .06, d * .5, blk, 0, .48, d * .15, g); box(w * .5, .1, .22, lin, 0, .5, -d * .34, g);
    for (const sx of [-1, 1]) { box(.04, 1.55, d * .92, cur, sx * w * .47, .82, 0, g); box(.05, .05, d * .95, oak, sx * w * .47, 1.62, 0, g); } box(w * .94, .05, .05, oak, 0, 1.62, d * .47, g); return g; },
  sbench: (w, d) => { const g = new THREE.Group(), st = mat.lime(), dk = mat.stoneBig(); box(w * .98, .42, d * .6, st, 0, .21, -d * .18, g); box(w * .98, .05, d * .66, dk, 0, .44, -d * .16, g);   // a stone bench along the wall, under a blind arcade
    const n = Math.max(1, Math.round(w)); for (let k = 0; k <= n; k++) box(.1, 1.6, .1, st, -w / 2 + k * w / n, 1.25, -d / 2 + .06, g); box(w * .98, .1, .14, st, 0, 2.05, -d / 2 + .06, g); return g; },
  press: (w, d, o) => { const g = new THREE.Group(), oak = mat.dark(), books = [0x7a2a24, 0x2a4a6a, 0x5a4a2a, 0x3a5a3a, 0x8a6a3a];   // a tall oak press: books lying flat on its shelves, or vestments behind doors
    box(w * .94, 1.9, d * .5, oak, 0, .95, -d * .2, g); if (o.p.vest) { for (const sx of [-1, 1]) box(w * .44, 1.7, .04, plain(0x7a5a40, { rough: .8 }), sx * w * .23, .95, d * .06, g); box(.04, .2, .05, mat.iron(), 0, 1, d * .09, g); return g; }
    for (let k = 0; k < 4; k++) { box(w * .9, .04, d * .46, oak, 0, .3 + k * .45, -d * .17, g); let x = -w * .42; while (x < w * .4) { const bw = .1 + ((x * 17 + k) % 1 + 1) % 1 * .08; box(bw, .3, d * .36, plain(books[Math.abs(Math.round(x * 31 + k)) % 5], { rough: .8 }), x + bw / 2, .47 + k * .45, -d * .17, g); x += bw + .02; } }
    return g; },
  laver: (w, d) => { const g = new THREE.Group(), st = mat.lime(), wat = plain(0x6a8aa0, { rough: .15, metal: .2 }); box(w * .95, .8, d * .55, st, 0, .4, -d * .18, g); box(w * .9, .04, d * .4, wat, 0, .79, -d * .18, g);   // the laver: a long stone washing trough in the cloister walk, water running from spouts
    for (let k = 0; k < 3; k++) cyl(.04, .04, .2, mat.pewter(), -w * .3 + k * w * .3, 1.1, -d * .4, g); box(w * .95, .1, .1, st, 0, 1.25, -d * .44, g); return g; },
  plate: (w, d) => { const g = new THREE.Group(); box(w, .24, .28, mat.beam(), 0, 3.0, 0, g); return g; },   // an arcade plate: the long beam the posts carry, the roof's feet resting on it
  threshfloor: (w, d) => { const g = new THREE.Group(); box(w * .98, .04, d * .98, mat.boards(), 0, .02, 0, g); return g; },   // the threshing floor: oak boards laid between the cart doors
  sheaves: (w, d) => { const g = new THREE.Group(), st = mat.straw(), dk = plain(0xa88a48, { rough: 1 }); const nx = Math.max(1, Math.round(w * 1.6)), nz = Math.max(1, Math.round(d * 1.6));   // stacked sheaves of corn, ears inward
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) for (let k = 0; k < 3; k++) { const b = cyl(.2, .24, .55, (i + j + k) % 2 ? st : dk, -w / 2 + (i + .5) * w / nx, .2 + k * .42, -d / 2 + (j + .5) * d / nz, g, 7); b.rotation.z = Math.PI / 2; b.rotation.y = (i * 7 + j * 3 + k) % 3 * .4; } return g; },
  flails: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); for (const sx of [-.15, .15]) { const a = box(.05, 1.5, .05, wd, sx, .75, -d / 2 + .15, g); a.rotation.z = sx; const b = box(.06, .7, .06, mat.dark(), sx * 2.2, .35, -d / 2 + .2, g); b.rotation.z = -sx * 2; } return g; },
  peels: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); for (const sx of [-.2, 0, .2]) { const h = box(.05, 1.9, .05, wd, sx, 1.0, -d / 2 + .12, g); h.rotation.z = sx * .4; box(.28, .32, .03, wd, sx + .02, .16, -d / 2 + .14, g); } return g; },   // the oven peels leaning on the wall
  copper: (w, d) => { const g = new THREE.Group(), br = T('brick_a', { rough: .95, color: 0xc89a80 }), cu = plain(0xb06a3a, { metal: .7, rough: .35 }), wat = plain(0x6a5030, { rough: .2 });   // the copper: a great copper pan set in a brick furnace, a fire-hole in front
    box(w * .9, .9, d * .9, br, 0, .45, 0, g); cyl(w * .38, w * .32, .3, cu, 0, 1.0, 0, g, 18); cyl(w * .34, w * .34, .02, wat, 0, 1.165, 0, g, 18); box(.36, .3, .05, mat.soot(), 0, .3, d * .45, g);
    const f = new THREE.Group(); f.position.set(0, .25, d * .38); g.add(f); flame(f, 0, 0, 0, .7); g.userData.fire = true; return g; },
  mashtun: (w, d) => { const g = new THREE.Group(), wd = T('wood_v', { rough: .85, color: 0xa88866 }), ir = mat.iron(), mash = plain(0xb89a60, { rough: 1 });   // the mash tun: a broad open tub on a stand, iron hoops, the mash showing
    box(w * .8, .3, d * .8, mat.dark(), 0, .15, 0, g); cyl(w * .42, w * .4, .8, wd, 0, .7, 0, g, 16); for (const y of [.42, .95]) cyl(w * .43, w * .43, .05, ir, 0, y, 0, g, 16); cyl(w * .38, w * .38, .02, mash, 0, 1.115, 0, g, 16);
    const oar = box(.05, .05, 1.1, mat.wood(), .1, 1.25, 0, g); oar.rotation.x = .6; return g; },
  cooler: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), wort = plain(0x7a4a20, { rough: .15 }); box(w * .95, .2, d * .85, wd, 0, .75, 0, g); box(w * .9, .02, d * .75, wort, 0, .86, 0, g);   // the cooler: a wide shallow trough on legs where the wort cools
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(.08, .65, .08, mat.dark(), sx * w * .42, .33, sz * d * .36, g); return g; },
  tun: (w, d) => { const g = new THREE.Group(), wd = T('wood_v', { rough: .85, color: 0xa08060 }), ir = mat.iron(); cyl(w * .4, w * .36, 1.2, wd, 0, .6, 0, g, 14); for (const y of [.25, .7, 1.1]) cyl(w * .41, w * .41, .04, ir, 0, y, 0, g, 14);
    cyl(w * .34, w * .34, .02, plain(0xd8c8a0, { rough: 1 }), 0, 1.215, 0, g, 14); return g; },   // a fermenting tun, the barm rising
  kiln: (w, d) => { const g = new THREE.Group(), br = T('brick_a', { rough: .95, color: 0xc89a80 }); box(w * .9, .6, d * .9, br, 0, .3, 0, g); box(w * .84, .05, d * .84, plain(0x5a4a3a, { rough: .9 }), 0, .63, 0, g);   // the malt kiln: a brick firebox under a perforated floor of tiles, malt spread on it
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) box(.08, .02, .08, mat.soot(), i * w * .16, .66, j * d * .16, g); box(w * .8, .04, d * .8, plain(0xb89a5a, { rough: 1 }), 0, .69, -d * .02, g); box(.3, .25, .05, mat.soot(), 0, .2, d * .45, g); return g; },
  maltfloor: (w, d) => { const g = new THREE.Group(), gr = grainTex();   // germinating barley spread a hand deep on the floor, raked into furrows, the wooden shovel and a rake left in it
    box(w * .95, .05, d * .9, gr, 0, .025, 0, g); for (const sx of [-1, 1]) box(.05, .07, d * .9, gr, sx * w * .475, .035, 0, g); for (const sz of [-1, 1]) box(w * .95, .07, .05, gr, 0, .035, sz * d * .45, g);
    const sh = box(.3, .03, .4, mat.wood(), w * .3, .07, 0, g); sh.rotation.y = .5; const hd = box(.04, .04, 1.0, mat.wood(), w * .3 + .2, .09, .45, g); hd.rotation.y = .5;
    const rk = box(.04, .04, 1.2, mat.wood(), -w * .25, .09, -d * .1, g); rk.rotation.y = -.3; box(.5, .05, .06, mat.dark(), -w * .25 - .17, .08, -d * .1 - .56, g).rotation.y = -.3; return g; },
  pit: (w, d, o) => { const g = new THREE.Group(), st = mat.stoneBig(), liq = plain(o.p.liquor === 'lime' ? 0xd8d4c4 : 0x5a3a1e, { rough: .25 });   // a sunk pit, its rim of planks, the liquor (lime, or tan liquor brown with bark), a hide's edge showing
    box(w * .92, .12, .14, mat.dark(), 0, .06, -d * .42, g); box(w * .92, .12, .14, mat.dark(), 0, .06, d * .42, g); box(.14, .12, d * .92, mat.dark(), -w * .42, .06, 0, g); box(.14, .12, d * .92, mat.dark(), w * .42, .06, 0, g);
    box(w * .76, .02, d * .76, liq, 0, .03, 0, g); box(w * .3, .02, d * .2, plain(0xb89a78, { rough: .8 }), -w * .1, .045, d * .1, g); return g; },
  fleshbeam: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); const b = box(w * .9, .16, .3, wd, 0, .6, 0, g); b.rotation.z = .3; box(.08, .5, .08, mat.dark(), w * .3, .25, 0, g); box(.08, .2, .08, mat.dark(), -w * .35, .1, 0, g);   // a fleshing beam: a sloping log the hide is draped over and scraped
    const h = box(w * .6, .03, .5, plain(0xc8a07a, { rough: .9 }), w * .05, .72, 0, g); h.rotation.z = .3; return g; },
  hides: (w, d, o) => { const g = new THREE.Group(), hd = [plain(0xb88a5a, { rough: .9 }), plain(0x9a6a40, { rough: .9 }), plain(0xc8a07a, { rough: .9 })];   // hides hung over poles to dry (or stacked flat)
    if (o.p.flat) { for (let k = 0; k < 4; k++) box(w * .85, .05, d * .8, hd[k % 3], 0, .05 + k * .06, 0, g); return g; }
    box(w * .96, .06, .06, mat.dark(), 0, 1.9, 0, g); for (const sx of [-1, 1]) box(.07, 1.9, .07, mat.dark(), sx * w * .47, .95, 0, g); const n = Math.max(1, Math.round(w)); for (let k = 0; k < n; k++) box(w / n * .8, 1.1, .03, hd[k % 3], -w / 2 + (k + .5) * w / n, 1.32, 0, g); return g; },
  barkheap: (w, d) => { const g = new THREE.Group(), bk = plain(0x6a4a30, { rough: 1 }); const s2 = new THREE.Mesh(new THREE.SphereGeometry(.5, 9, 6), bk); s2.scale.set(w * .95, .9, d * .9); s2.position.y = 0; s2.castShadow = s2.receiveShadow = true; g.add(s2);
    for (let k = 0; k < 8; k++) { const c = box(.5, .05, .12, plain(0x5a3a22, { rough: 1 }), ((k * 37) % 10 / 10 - .5) * w * .7, .25 + (k % 3) * .1, ((k * 53) % 10 / 10 - .5) * d * .7, g); c.rotation.y = k; } return g; },
  barkmill: (w, d) => { const g = new THREE.Group(), st = mat.stoneBig(); cyl(w * .45, w * .45, .25, st, 0, .12, 0, g, 18); const r2 = cyl(.35, .35, .2, st, 0, .55, 0, g, 14); r2.rotation.z = Math.PI / 2; box(w * .9, .08, .08, mat.wood(), 0, .55, 0, g); return g; },   // an edge-runner stone for crushing bark
  dyevat: (w, d, o) => { const g = new THREE.Group(), br = T('brick_a', { rough: .95, color: 0xc89a80 }), cu = plain(0x8a5a3a, { metal: .5, rough: .4 }); box(w * .9, .7, d * .9, br, 0, .35, 0, g); cyl(w * .38, w * .36, .4, cu, 0, .85, 0, g, 16);   // a dye vat over its fire
    cyl(w * .34, w * .34, .02, plain(o.p.dye || 0x2a4a8a, { rough: .2 }), 0, 1.065, 0, g, 16); box(.32, .26, .05, mat.soot(), 0, .22, d * .45, g); const f = new THREE.Group(); f.position.set(0, .18, d * .38); g.add(f); flame(f, 0, 0, 0, .5); g.userData.fire = true;
    const pole = box(.04, .04, 1.2, mat.wood(), .1, 1.2, 0, g); pole.rotation.x = .7; return g; },
  tenter: (w, d, o) => { const g = new THREE.Group(), wd = mat.dark(), cl = plain([0x2a4a8a, 0x9a2a24, 0x4a6a3a][Math.floor((o.p.x || 0) / 3) % 3], { rough: 1 });   // a tenter frame: posts and rails, the wet cloth stretched on its hooks
    for (let k = 0; k <= Math.round(w / 1.5); k++) box(.08, 1.4, .08, wd, -w / 2 + .1 + k * (w - .2) / Math.round(w / 1.5), .7, 0, g); box(w * .96, .06, .06, wd, 0, 1.35, 0, g); box(w * .96, .06, .06, wd, 0, .35, 0, g); box(w * .92, .95, .02, cl, 0, .85, 0, g); return g; },
  bathtub: (w, d) => { const g = new THREE.Group(), wd = T('wood_v', { rough: .85, color: 0xa88866 }), ir = mat.iron(), wat = plain(0x8aaac0, { rough: .1, metal: .1 }), cl = plain(0xe8e0d0, { rough: 1 }).clone(); cl.side = THREE.DoubleSide;   // a bathing tub for two, a linen lining, a board across for food, a cloth canopy over it
    const tb = cyl(Math.min(w, d) * .42, Math.min(w, d) * .4, .7, wd, 0, .35, 0, g, 18); tb.scale.set(w / Math.min(w, d), 1, d / Math.min(w, d)); cyl(Math.min(w, d) * .38, Math.min(w, d) * .38, .02, wat, 0, .62, 0, g, 18).scale.set(w / Math.min(w, d), 1, d / Math.min(w, d));
    box(w * .7, .04, .3, mat.wood(), 0, .72, 0, g); for (const sx of [-1, 1]) box(.05, 2.1, .05, mat.dark(), sx * w * .45, 1.05, -d * .46, g); box(w * .95, .05, .05, mat.dark(), 0, 2.08, -d * .46, g);
    box(w * .9, 1.6, .02, cl, 0, 1.25, -d * .45, g); box(w * .95, .2, .3, cl, 0, 1.98, -d * .34, g); return g; },
  treadwheel: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(), R2 = Math.min(w * .42, 1.8), ax = R2 + .25;   // the treadwheel: a great wooden wheel men walk inside, on an axle between two frames, the rope drum on the axle
    for (const sz of [-d * .38, d * .38]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(R2, .07, 6, 28), dk); ring.position.set(0, ax, sz); ring.castShadow = true; g.add(ring);
      for (let k = 0; k < 8; k++) { const sp = box(.06, R2 * 2, .06, wd, 0, ax, sz, g); sp.rotation.z = k * Math.PI / 8; } }
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; box(.08, .05, d * .8, wd, Math.cos(a) * R2, ax + Math.sin(a) * R2, 0, g); }
    const axle = cyl(.12, .12, d * 1.0, dk, 0, ax, 0, g, 10); axle.rotation.x = Math.PI / 2; for (const sx of [-1, 1]) { box(.18, ax + .2, .18, dk, w * .46 * sx, (ax + .2) / 2, 0, g); } box(w * .95, .14, .14, dk, 0, .07, 0, g); return g; },
  rope: (w, d) => { const g = new THREE.Group(), rp = plain(0xb8a070, { rough: 1 }); for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.TorusGeometry(.3 - k * .03, .05, 6, 16), rp); c.rotation.x = Math.PI / 2; c.position.set(-w * .2, .05 + k * .08, 0); g.add(c); }
    box(.1, .3, .1, mat.iron(), w * .25, .15, 0, g); return g; },
  shaft: (w, d) => { const g = new THREE.Group(), dk = mat.dark(), hole = plain(0x050403, { rough: 1 }); box(w * .7, .02, d * .7, hole, 0, .01, 0, g);   // the shaft mouth: a timber collar round a black hole, a rail at knee height, the kibble rope going down
    for (const [x, z, ww, dd] of [[0, -d * .4, w * .9, .16], [0, d * .4, w * .9, .16], [-w * .4, 0, .16, d * .9], [w * .4, 0, .16, d * .9]]) { box(ww, .2, dd, dk, x, .1, z, g); box(ww, .06, dd * .5, mat.wood(), x, .75, z, g); }
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(.08, .78, .08, dk, x * w * .4, .39, z * d * .4, g); box(.03, 1.1, .03, plain(0xb8a070, { rough: 1 }), 0, .6, 0, g);
    for (const sx of [-1, 1]) { box(.14, 1.35, .14, dk, sx * w * .46, .68, 0, g); const c2 = box(.06, .4, .06, mat.iron(), sx * (w * .46 + .12), 1.1, .15, g); c2.rotation.x = .6; }   /* the windlass straddling the shaft: two stout posts, the drum with rope wound on it, a crank each end */
    const dr = cyl(.14, .14, w * .9, mat.wood(), 0, 1.15, 0, g, 10); dr.rotation.z = Math.PI / 2; const rp = cyl(.16, .16, w * .4, plain(0xb8a070, { rough: 1 }), 0, 1.15, 0, g, 10); rp.rotation.z = Math.PI / 2; return g; },
  toolrack: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), ir = mat.iron(); box(w * .9, .08, .08, mat.dark(), 0, 1.5, -d * .4, g); for (let k = 0; k < 5; k++) { const x = -w * .38 + k * w * .19; box(.04, 1.3, .04, wd, x, .8, -d * .36, g); box(k % 2 ? .25 : .12, .18, .05, ir, x, .2, -d * .34, g); } return g; },   // picks, shovels and gads on their rack
  horsestall: (w, d, o) => { const g = new THREE.Group(), wd = mat.fence(), dk = mat.dark(), hay = mat.straw();   // a horse's stall: boarded partition, manger and hay rack against the wall, straw underfoot
    box(w * .96, .02, d * .96, hay, 0, .01, 0, g); box(.08, 1.25, d * .9, wd, -w / 2 + .04, .62, 0, g); box(.12, 1.45, .12, dk, -w / 2 + .04, .72, d / 2 - .06, g);
    box(w * .9, .35, .32, dk, 0, .75, -d / 2 + .2, g); box(w * .8, .05, .24, hay, 0, .93, -d / 2 + .2, g); for (let k = 0; k < 5; k++) box(.03, .5, .03, dk, -w * .38 + k * w * .19, 1.45, -d / 2 + .12, g);
    box(w * .86, .04, .04, dk, 0, 1.7, -d / 2 + .16, g); box(w * .8, .3, .16, hay, 0, 1.45, -d / 2 + .08, g);
    if (o && o.p.horse) { const h = horseSprite(o.p.horse); h.position.z = .15; g.add(h); g.userData.billboard = h; } return g; },
  horse: (w, d, o) => { const g = new THREE.Group(), c = plain([0x6a4630, 0x8a6a4a, 0x3a2a22, 0xb0a090][((o.p.x * 7 + o.p.y * 3) % 4 + 4) % 4], { rough: .8 }), m = plain(0x2a201a, { rough: .9 });   // a horse standing in its stall
    box(.42, .5, 1.1, c, 0, 1.0, 0, g); for (const [x, z] of [[-.14, -.4], [.14, -.4], [-.14, .4], [.14, .4]]) box(.1, .75, .1, c, x, .38, z, g);
    const nk = box(.22, .55, .3, c, 0, 1.35, -.6, g); nk.rotation.x = .5; box(.2, .2, .42, c, 0, 1.55, -.82, g); box(.06, .4, .26, m, 0, 1.45, -.55, g); box(.05, .45, .06, m, 0, .9, .58, g); return g; },
  dung: (w, d) => { const g = new THREE.Group(), m = plain(0x5a4630, { rough: 1 }), st = mat.straw(); const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 8, 6), m); s.scale.set(w * .9, .45, d * .9); s.position.y = .05; g.add(s);
    for (let k = 0; k < 5; k++) box(.3, .02, .05, st, (Math.random() - .5) * w * .6, .22 + Math.random() * .08, (Math.random() - .5) * d * .6, g).rotation.y = Math.random() * 3; return g; },
  mountblock: (w, d) => { const g = new THREE.Group(), st = mat.stoneBig(); box(w * .8, .3, d * .8, st, 0, .15, 0, g); box(w * .8, .3, d * .4, st, 0, .45, -d * .2, g); return g; },
  wagon: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(), cl = plain(0xd8ccb0, { rough: 1 }).clone(); cl.side = THREE.DoubleSide;   // a covered carrier's wagon: bed, four wheels, hoops and a canvas tilt
    const L2 = Math.max(w, d) * .9, W2 = Math.min(w, d) * .75; const gg = new THREE.Group(); g.add(gg); if (w > d) gg.rotation.y = Math.PI / 2;
    box(W2, .2, L2, wd, 0, .7, 0, gg); for (const sx of [-1, 1]) { box(.05, .35, L2, dk, sx * W2 / 2, .9, 0, gg); for (const z of [-L2 * .32, L2 * .32]) { const wh = cyl(.42, .42, .08, dk, sx * (W2 / 2 + .06), .45, z, gg, 14); wh.rotation.z = Math.PI / 2; } }
    const tilt = new THREE.Mesh(new THREE.CylinderGeometry(W2 * .55, W2 * .55, L2 * .8, 12, 1, true, -Math.PI / 2, Math.PI), cl); tilt.rotation.x = Math.PI / 2; tilt.position.set(0, 1.05, 0); gg.add(tilt);
    box(.06, .06, .9, dk, 0, .65, L2 / 2 + .4, gg); return g; },
  trough: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); box(w * .9, .35, d * .6, wd, 0, .55, 0, g); box(w * .8, .02, d * .45, plain(0xe8dcc4, { rough: 1 }), 0, .73, 0, g); for (const sx of [-1, 1]) box(.07, .4, .07, mat.dark(), sx * w * .38, .2, 0, g); return g; },
  loom: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const W = w * .86, D = d * .8;   // a treadle loom: the warp running from the back beam to the cloth beam, heddles and beater hanging over it, the weaver's bench
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.1, 1.6, .1, dk, sx * W / 2, .8, sz * D / 2, g); for (const sx of [-1, 1]) box(.08, .08, D, dk, sx * W / 2, 1.6, 0, g);
    cyl(.08, .08, W, wd, 0, .85, -D / 2 + .05, g).rotation.z = Math.PI / 2; cyl(.1, .1, W, wd, 0, .8, D / 2 - .15, g).rotation.z = Math.PI / 2;
    box(W - .1, .01, D - .25, plain(0xf0e8d8, { rough: 1 }), 0, .86, -.05, g); box(W - .12, .02, .3, mat.red(), 0, .87, D / 2 - .3, g);
    for (const z of [-.12, .02]) box(W - .1, .25, .03, wd, 0, 1.15, z, g); box(W - .1, .08, .06, dk, 0, 1.0, D / 2 - .45, g); for (let i = 0; i < 3; i++) box(.06, .03, .5, dk, -.2 + i * .2, .1, D / 2 - .35, g);
    box(W, .08, .28, wd, 0, .55, D / 2 + .12, g); return g; },
  lathe: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const L = w * .9;   // a pole lathe: twin rails on legs, two poppets holding a bowl blank, the spring pole overhead, shavings on the floor
    for (const sz of [-.07, .07]) box(L, .1, .1, wd, 0, .85, sz, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = box(.08, .86, .08, dk, sx * (L / 2 - .1), .42, sz * .18, g); l.rotation.x = sz * .15; }
    for (const sx of [-.25, .25]) box(.12, .35, .12, dk, sx * L, 1.05, 0, g); cyl(.09, .07, .35, plain(0xe0c090, { rough: .8 }), 0, 1.05, 0, g, 12).rotation.z = Math.PI / 2;
    const p = box(.05, 1.8, .05, wd, L * .1, 1.75, -.25, g); p.rotation.z = 1.25; box(.01, .7, .01, plain(0x8a7a60), 0, 1.45, -.02, g); box(.4, .03, .15, dk, 0, .06, .3, g);
    for (let i = 0; i < 7; i++) { const sh = box(.08, .015, .05, plain(0xf0d8a8, { rough: 1 }), -.3 + i * .1, .01, .15 + (i % 3) * .08, g); sh.rotation.y = i; } return g; },
  bale: () => { const g = new THREE.Group(); const cs = [mat.red(), mat.teal(), mat.linen()]; for (let i = 0; i < 3; i++) box(.7, .2, .5, cs[i], 0, .1 + i * .21, 0, g); return g; },
  scales: () => { const g = new THREE.Group(), wd = mat.dark(), br = plain(0xb08a40, { metal: .5, rough: .4 }); box(.42, .8, .34, mat.wood(), 0, .4, 0, g); box(.07, .6, .07, wd, 0, 1.1, 0, g); box(.7, .04, .04, br, 0, 1.38, 0, g);
    for (const sx of [-1, 1]) { cyl(.14, .1, .04, br, sx * .33, 1.05, 0, g); box(.015, .32, .015, br, sx * .33, 1.22, 0, g); } return g; },
  rack: (w, d) => { const g = new THREE.Group(), wd = mat.wood(); for (const sx of [-1, 1]) box(.07, 1.7, .07, wd, sx * w * .44, .85, 0, g); for (const y of [1.1, 1.6]) box(w * .92, .05, .05, wd, 0, y, 0, g);
    const cs = [mat.red(), mat.teal(), plain(0xd8b040, { rough: 1 })]; for (let i = 0; i < 3; i++) box(.3, .9, .02, cs[i], -w * .3 + i * w * .3, 1.12, 0, g); return g; },
  ironrack: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), ir = plain(0xa8adb4, { metal: .15, rough: .45 }), rs = plain(0x8a6a52, { rough: .8 });   // the smith's stock: bar iron on two shelves, tongs and hammers hung on the front rail
    for (const y of [.3, .9]) box(w * .9, .07, d * .6, wd, 0, y, 0, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.07, 1.25, .07, wd, sx * w * .43, .62, sz * d * .26, g);
    box(w * .9, .06, .05, wd, 0, 1.22, d * .28, g);
    for (let i = 0; i < 5; i++) { box(w * .82, .05, .05, i % 2 ? rs : ir, 0, .36 + (i % 2) * .05, -d * .18 + i * .08, g); box(w * .74, .045, .045, i % 3 ? ir : rs, 0, .96 + (i % 2) * .04, -d * .18 + i * .08, g); }
    for (const [x, k] of [[-.3, 0], [-.1, 1], [.12, 0], [.32, 1]]) { const X = x * w; if (k) { box(.025, .5, .025, ir, X - .03, .95, d * .3, g); box(.025, .5, .025, ir, X + .03, .95, d * .3, g); }
      else { box(.03, .42, .03, wd, X, .98, d * .3, g); box(.12, .07, .07, ir, X, .76, d * .3, g); } } return g; },
  privy: () => { const g = new THREE.Group(), wd = mat.fence(); box(.9, 1.9, .06, wd, 0, .95, -.42, g); for (const sx of [-1, 1]) box(.06, 1.9, .9, wd, sx * .42, .95, 0, g); const rf = box(1.04, .06, 1.08, mat.dark(), 0, 1.95, 0, g); rf.rotation.x = -.12; box(.7, .45, .4, mat.boards(), 0, .22, -.18, g);
    const dr = box(.5, 1.6, .04, wd, -.18, .8, .42, g); dr.rotation.y = -.9; dr.position.x = -.36; dr.position.z = .6; return g; },
  well: (w, d) => fitTo(build('well'), w * .95, d * .95),
  coop: () => { const g = new THREE.Group(); box(.8, .5, .7, mat.boards(), 0, .3, 0, g); const r = box(.9, .05, .84, mat.dark(), 0, .6, 0, g); r.rotation.x = -.15; box(.2, .2, .02, mat.soot(), 0, .2, .36, g); return g; },
  sty: (w, d) => { const g = new THREE.Group(), wd = mat.fence(); for (const [x, z, ww, dd] of [[0, -d * .45, w * .9, .06], [0, d * .45, w * .9, .06], [-w * .45, 0, .06, d * .9], [w * .45, 0, .06, d * .9]]) box(ww, .7, dd, wd, x, .35, z, g);
    box(w * .86, .02, d * .86, mat.earth(), 0, .01, 0, g); box(w * .4, .8, d * .4, mat.boards(), -w * .2, .4, -d * .2, g); return g; },
  garden: (w, d) => { const g = new THREE.Group(); box(w * .92, .1, d * .92, T('dirt', { rough: 1, color: 0x8a7060 }), 0, .05, 0, g); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.13, 6, 4), plain(j % 2 ? 0x6a9040 : 0x7aa048, { rough: 1, flat: true })); p.scale.y = .6; p.position.set(-w * .35 + i * w * .23, .14, -d * .3 + j * d * .3); p.castShadow = true; g.add(p); } return g; },
  cart: (w, d) => fitTo(build('cart'), w * .95, d * .95, 1),
  timber: (w, d) => { const g = new THREE.Group(); for (let i = 0; i < 6; i++) box(w * .92, .14, .14, mat.wood(), 0, .07 + Math.floor(i / 3) * .15, -.15 + (i % 3) * .15, g); return g; },
  choppingblock: () => { const g = new THREE.Group(); cyl(.22, .25, .45, mat.wood(), 0, .22, 0, g); const a = box(.05, .4, .05, mat.dark(), .05, .6, 0, g); a.rotation.z = .4; box(.14, .1, .03, mat.iron(), .14, .74, 0, g); return g; },
  forge: (w, d) => { const g = new THREE.Group(), st = mat.stone(); box(w * .85, .8, d * .7, st, 0, .4, -.1, g); box(w * .5, .04, d * .4, plain(0x2a0a04, { emissive: 0xff5010, ei: 1.4 }), 0, .82, -.05, g);
    box(w * .9, .8, d * .7, st, 0, 2.0, -d * .2, g); box(.4, .25, .35, plain(0x6a4a30), w * .4, .65, d * .25, g); flame(g, 0, .82, -.05, .9); g.userData.fire = [0, 1, 0]; return g; },
  oven: (w, d) => { const g = new THREE.Group(); box(w * .9, .7, d * .9, mat.stone(), 0, .35, 0, g); const dm = new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) * .44, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), plain(0xc89a78, { rough: 1 })); dm.position.y = .7; dm.castShadow = true; g.add(dm);
    box(.4, .3, .1, mat.soot(), 0, .85, d * .44, g); return g; },
  anvil: (w, d) => { const g = new THREE.Group(); cyl(.3, .34, .45, [T('bark', { rough: 1, color: 0xa08068 }), plain(0xd0b088, { rough: 1 }), plain(0xd0b088, { rough: 1 })], 0, .22, 0, g, 10); const a = fitTo(build('anvil'), w * .75, d * .75, 1.6); a.position.y = .45; g.add(a); return g; },   // the anvil set on a log stump
  cradle: (w, d) => { const g = new THREE.Group(), wd = mat.wood(), dk = mat.dark(); const L = .8, W = .44;
    box(W, .3, L, wd, 0, .3, 0, g); box(W - .08, .06, L - .08, mat.linen(), 0, .4, .04, g); box(W - .1, .05, L * .45, mat.teal(), 0, .44, .12, g);
    box(W, .32, .06, wd, 0, .58, -L / 2 + .03, g); box(W, .04, .3, dk, 0, .74, -L / 2 + .15, g); for (const sx of [-1, 1]) box(.04, .3, .3, wd, sx * (W / 2 - .02), .58, -L / 2 + .15, g);
    for (const sz of [-1, 1]) { const r = box(W + .08, .06, .1, dk, 0, .12, sz * L * .32, g); } box(.04, .06, L * .9, dk, 0, .12, 0, g); return g; },
  brazier: (w, d) => { const g = fitTo(build('brazier'), w * .8, d * .8); g.userData.fire = [0, .8, 0]; return g; },
};

// winder and spiral treads: the slice of the stair's square (or circle) between two angles, as an extruded wedge
function wedge(a0, a1, round, h) {
  const s = new THREE.Shape(), R = .5, pts = [[0, 0]];
  const onSq = (a) => { const c = Math.cos(a), sn = Math.sin(a), k = R / Math.max(Math.abs(c), Math.abs(sn)); return [c * k, sn * k]; };
  const as = []; const N = round ? 6 : 1; for (let i = 0; i <= N; i++) as.push(a0 + (a1 - a0) * i / N);   /* square: only the ends and corners (collinear points make zero-area triangles) */
  if (!round) for (let k = -8; k <= 8; k++) { const c = Math.PI / 4 + k * Math.PI / 2; if (c > a0 && c < a1) as.push(c); }   // the square's corners inside the slice
  as.sort((p, q) => p - q); for (const a of as) { const q = round ? [Math.cos(a) * R * .96, Math.sin(a) * R * .96] : onSq(a), l = pts[pts.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) > 1e-3) pts.push(q); }   // no repeated points: they make NaN normals
  s.moveTo(pts[0][0], -pts[0][1]); for (const [x, y] of pts.slice(1)) s.lineTo(x, -y); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 4 }); g.rotateX(-Math.PI / 2); return g;
}

// ---------------------------------------------------------------- the interior
export function buildInterior(pl, opt = {}) {
  const { Wi, Di } = pl, day = opt.day !== false, stairStyle = opt.stair || null;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050404);
  const levels = new Map(), mats = { stained: (() => { const m = M('stained', { rough: .3 }).clone(); m.emissive = new THREE.Color(0xffffff); m.emissiveMap = m.map; m.emissiveIntensity = .55; return m; })(), lime: mat.lime(), dress: T('ashlar', { rough: .9, color: 0xf2ead8 }), dressCap: plain(0xa89c88, { rough: .9 }), plaster: mat.plaster(), plasterLow: mat.plasterLow(), beam: mat.beam(), cap: mat.cap(), stone: mat.stoneBig(), fence: mat.fence(), wood: mat.wood(), iron: mat.iron(), glass: mat.glass(), wains: mat.wains() };
  const coreKind = (S) => (S && S.kind) || (pl.core && pl.core.kind) || 'ladder';
  const oneKind = (k) => k === 'winder' || k === 'spiral' || k === 'newel' ? (stairStyle || k) : k;
  const FLOORS = { pave: () => T('pave', { rough: .95, color: 0xe8e0d4 }), tiles: () => encaustic(), boards: () => mat.boards(), floor: () => mat.floor(), earth: () => mat.earth(), yard: () => mat.yardE(),
    worn: () => mat.worn(), hall: () => mat.hallF(), cobble: () => mat.cobble(), grass: () => T('grass', { rough: 1, color: 0xc8d8b0 }), slate: () => T('floor_slate', { rough: .9, color: 0xd0ccc4 }), path: () => T('path', { rough: 1 }) };
  const floorMat = (F, q) => { const t = q.t; if (q.floor && FLOORS[q.floor]) return FLOORS[q.floor](); if (q.open) return mat.cobble(); if (pl.tier === 'civic') return F.f === 0 ? T('pave', { rough: .95, color: 0xe8e0d4 }) : mat.floor();
    if (pl.kind === 'church') return t === 'chancel' ? encaustic() : t === 'nave' || t === 'tower' ? T('pave', { rough: .95, color: 0xf0e8dc }) : mat.boards();
    if (q.t === 'yard') return mat.yardE(); if (F.f === -1) return pl.tier === 'merchant' || pl.tier === 'patrician' ? mat.worn() : mat.earth();
    if (F.f === 0 || F.f === 'yard') { if (pl.tier === 'poor') return mat.earth(); if (t === 'parlour' || t === 'counting') return mat.floor();
      if (t === 'hall') return pl.tier === 'patrician' || pl.tier === 'merchant' ? mat.hallF() : mat.worn(); return mat.worn(); }
    return t === 'garret' || t === 'loft' ? mat.boards() : mat.floor(); };

  // one level: rooms -> floors, walls (each with a full and a cut-down version), props, stairs, lights
  function level(F, kind, off) {
    const g = new THREE.Group(); g.visible = false; scene.add(g);
    const rows = kind === 'yard' ? F.rows : Di, zOf = (y) => Di - (y + off);      // front edge (larger z) of plan row y
    const roomAt = (x, y) => (x < 0 || y < 0 || x >= Wi || y >= rows) ? null : F.rooms.find((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1) || null;
    const L = { F, kind, g, off, rows, roomAt, segs: [], cut: [], block: new Set(), trig: new Map(), lights: [], flick: [] };
    const wellSet = new Set((F.stair?.well || []).map(([x, y]) => x + ',' + y));
    // floors: per room, row runs that skip stairwell holes
    for (const q of F.rooms) { const m = floorMat(F, q);
      for (let y = q.y0; y <= q.y1; y++) { let x = q.x0; while (x <= q.x1) { if (wellSet.has(x + ',' + y)) { x++; continue; } let e = x; while (e + 1 <= q.x1 && !wellSet.has((e + 1) + ',' + y)) e++;
        const fl = box(e - x + 1, .12, 1, m, (x + e + 1) / 2, -.06, zOf(y) - .5, g); fl.castShadow = false; x = e + 1; } } }
    // from an upper floor the open courts below show through gallery rails: their ground drawn a storey down
    if (kind === 'upper') for (const q of (pl.floors[0] && pl.floors[0].rooms) || []) if (q.open) { const fl = box(q.x1 - q.x0 + 1, .12, q.y1 - q.y0 + 1, floorMat(pl.floors[0], q), (q.x0 + q.x1 + 1) / 2, -SH - .06, Di - (q.y0 + q.y1 + 1) / 2, g); fl.castShadow = false; }
    // walls on every edge between two rooms or a room and the outside, with the door and window openings
    const doorE = new Map(F.doors.map((d) => [d.e, d])), winE = new Map();
    for (const w of F.windows || []) winE.set(w.e ? w.e : w.side === 'f' ? `h,${w.i},0` : w.side === 'b' ? `h,${w.i},${rows}` : w.side === 'l' ? `v,0,${w.i}` : `v,${Wi},${w.i}`, w);
    const stoneF = pl.stone === true || (Array.isArray(pl.stone) && pl.stone.includes(F.f)), fenceH = 1.5, wallH = F.wallH ? F.wallH : kind === 'cellar' ? SH - .2 : kind === 'ground' && pl.wallH0 ? pl.wallH0 : SH - .02;   /* a church's walls stand far higher than a house storey */
    // a loft is the roof space: low knee walls under the eaves, rafters rising to the ridge (eaves front and back, or at the sides under a gable-fronted roof)
    const loftL = kind === 'upper' && F.rooms.length && F.rooms.every((q) => q.t === 'loft'), eaveLR = !!(pl.H && pl.H.gable), KNEE = .8;
    // which way is in from an outer edge (world x / z sign): toward the side that has a roofed room
    const inSide = (e) => { const [k, a, b] = e.split(','), x = +a, y = +b; if (k === 'h') { const q = roomAt(x, y); return [0, q && !q.open ? -1 : 1]; } const q = roomAt(x, y); return [q && !q.open ? 1 : -1, 0]; };
    const seg = (e, x0, z0, x1, z1, outer, yardOuter, mode) => {
      const horiz = z0 === z1, len = horiz ? x1 - x0 : z1 - z0, mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, t = outer ? WT * 1.3 : WT;
      const full = new THREE.Group(), low = new THREE.Group(); g.add(full, low); low.visible = false;
      const mk = (h0, h1, m, grp = full, fat = 0) => box(horiz ? len + t : t + fat, h1 - h0, horiz ? t + fat : len + t, m, mx, (h0 + h1) / 2, mz, grp);
      const d = doorE.get(e), wn = winE.get(e), wm = kind === 'cellar' ? mats.stone : pl.kind === 'church' && F.f > 0 || pl.kind === 'keep' || pl.kind === 'gate' || pl.kind === 'smelter' || (pl.kind === 'guildhall' || pl.kind === 'mill') && F.f === 0 || stoneF ? mats.lime : mats.plaster;
      if (mode === 'parapet') {   // a crenellated parapet round a tower top: a breast-high wall, merlons standing up from it
        const st = mats.lime; mk(0, 1.0, st); mk(0, LOW, st, low); for (let k = 0; k < 2; k++) { const u0 = k * .5 + .05; const mxx = horiz ? x0 + (u0 + .2) * len : mx, mzz = horiz ? mz : z0 + (u0 + .2) * len;
          box(horiz ? .4 * len : WT * 1.3, .55, horiz ? WT * 1.3 : .4 * len, st, mxx, 1.27, mzz, full); }
        L.segs.push([x0, z0, x1, z1]); L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
      if (mode === 'rail' || mode === 'posts') {   // a gallery's balustrade over the court, or the open timber posts of a covered walk; the roof plate runs over them
        const oak = mats.beam, top = wallH - .02;
        for (const u of [0, 1]) { const px = horiz ? x0 + u * len : x0, pz = horiz ? z0 : z0 + u * len, onBay = Math.abs((horiz ? px : Di - off - pz) % 3) < .01; if (mode === 'posts' && !onBay) continue;   /* open posts stand on the bay lines */
          box(mode === 'posts' ? .24 : .16, top, mode === 'posts' ? .24 : .16, oak, px, top / 2, pz, full); box(.16, LOW, .16, oak, px, LOW / 2, pz, low); }
        mk(top - .2, top, oak, full, .04); if (mode === 'rail' || !d) { const rh = mode === 'rail' ? .95 : .5;
          mk(rh - .1, rh, mats.wood, full, .05); for (let k = 1; k < 5; k++) { const bx = horiz ? x0 + len * k / 5 : x0, bz = horiz ? z0 : z0 + len * k / 5; box(.07, rh - .1, .07, mats.wood, bx, (rh - .1) / 2, bz, full); }
          mk(rh - .08, rh, oak, low, .03); L.segs.push([x0, z0, x1, z1]); }
        L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
      if (mode === 'precinct' || mode === 'arcade') { const st = mode === 'arcade' ? mats.dress : mats.lime, cap = mode === 'arcade' ? mats.dressCap : mats.stone;
        if (mode === 'precinct') {   // a stone precinct wall round an open court, coped; a gateway is left open between two piers
          const H = 1.7; if (!d) { mk(0, H, st); mk(H, H + .1, cap, full, .06); mk(0, LOW, st, low); mk(LOW, LOW + .05, cap, low, .04); L.segs.push([x0, z0, x1, z1]); }
          else for (const u of [0, 1]) box(.34, H + .35, .34, st, horiz ? x0 + u * len : x0, (H + .35) / 2, horiz ? z0 : z0 + u * len, full);
          L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
        // an arcade onto a court: a pier at each cell end, a low parapet between unless it is a way through, the walk's roof plate over the arches
        const AH = Math.min(wallH, SH) - .02, SP = 1.45, AP = Math.min(AH - .18, 2.15), T2 = WT * 1.6;   // springing line, apex of a pointed arch, wall depth
        for (const u of [0, 1]) { const px = horiz ? x0 + u * len : x0, pz = horiz ? z0 : z0 + u * len;   // a pier (shared by the next bay): base, shaft, a moulded capital at the springing
          box(.34, .16, .34, cap, px, .08, pz, full); box(.24, SP, .24, st, px, SP / 2, pz, full); box(.36, .12, .36, cap, px, SP + .04, pz, full); box(.24, LOW, .24, st, px, LOW / 2, pz, low); }
        { const k = .13, a2 = len - k, mid2 = len / 2, sh = new THREE.Shape([new THREE.Vector2(0, SP), new THREE.Vector2(len, SP), new THREE.Vector2(len, AH), new THREE.Vector2(0, AH)]);   // the spandrel over the opening, a two-centred arch cut out of it
          const hole = new THREE.Path(); hole.moveTo(k, SP + .001); hole.lineTo(a2, SP + .001); const n = 10;
          const cR = (x, y) => hole.lineTo(x, y); const left = k, right = a2, R2 = (right - left) * .95, cxl = left + R2, cxr = right - R2, apY = SP + Math.sqrt(Math.max(0, R2 * R2 - (mid2 - cxr) ** 2));
          for (let i = 1; i <= n; i++) { const xx = right - (right - mid2) * i / n, yy = SP + Math.sqrt(Math.max(0, R2 * R2 - (xx - cxr) ** 2)) * Math.min(1, (AP - SP) / Math.max(.01, apY - SP)); cR(xx, yy); }
          for (let i = n - 1; i >= 1; i--) { const xx = left + (mid2 - left) * i / n, yy = SP + Math.sqrt(Math.max(0, R2 * R2 - (xx - cxl) ** 2)) * Math.min(1, (AP - SP) / Math.max(.01, apY - SP)); cR(xx, yy); }
          hole.closePath(); sh.holes.push(hole);
          const tg = new THREE.ExtrudeGeometry(sh, { depth: T2, bevelEnabled: false }), tm = new THREE.Mesh(tg, st); tm.castShadow = tm.receiveShadow = true;
          if (horiz) tm.position.set(x0, 0, mz - T2 / 2); else { tm.rotation.y = -Math.PI / 2; tm.position.set(mx + T2 / 2, 0, z0); } full.add(tm); }
        mk(AH - .08, AH, cap, full, .08);   // the walk's roof plate
        if (!d) { mk(0, .62, st, full, .02); mk(.62, .7, cap, full, .08); mk(0, Math.min(.62, LOW), st, low, .02); L.segs.push([x0, z0, x1, z1]); }
        L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
      if (yardOuter) {   // the yard's board fence, posts at each cell corner
        if (!d) { mk(0, fenceH, mats.fence); box(.12, fenceH + .1, .12, mats.beam, x0, (fenceH + .1) / 2, z0, full); }
        else { box(.12, fenceH + .1, .12, mats.beam, x0, (fenceH + .1) / 2, z0, full); }
        mk(0, Math.min(fenceH, LOW), mats.fence, low).visible = !d; if (!d) L.segs.push([x0, z0, x1, z1]); L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
      if (loftL && outer && horiz !== eaveLR) { mk(0, KNEE - .02, wm); mk(KNEE - .1, KNEE - .02, mats.beam, full, .03); mk(KNEE - .02, KNEE, mats.cap, full, .01); mk(0, Math.min(KNEE, LOW), wm, low); mk(Math.min(KNEE, LOW), Math.min(KNEE, LOW) + .02, mats.cap, low, .01);
        L.segs.push([x0, z0, x1, z1]); L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
      if (loftL && outer && horiz === eaveLR && !d && !wn) {   // a gable end: the wall's top follows the roof up to the ridge
        const prof = (u) => KNEE + (wallH - KNEE) * Math.max(0, 1 - Math.abs(u - (eaveLR ? Wi / 2 : Di - off - rows / 2)) / (eaveLR ? Wi / 2 : rows / 2));
        const ua = horiz ? x0 : z0, ub = horiz ? x1 : z1, ha = prof(ua), hb = prof(ub), hm = Math.min(ha, hb); mk(0, hm, wm);
        if (Math.abs(ha - hb) > .01) { const sh = new THREE.Shape([new THREE.Vector2(0, hm), new THREE.Vector2(len, hm), ha > hb ? new THREE.Vector2(0, ha) : new THREE.Vector2(len, hb)]);
          const tg = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false }), tm = new THREE.Mesh(tg, wm); tm.castShadow = tm.receiveShadow = true;
          if (horiz) tm.position.set(x0, 0, mz - t / 2); else { tm.rotation.y = -Math.PI / 2; tm.position.set(mx + t / 2, 0, z0); } full.add(tm); }
        mk(0, .14, mats.beam, full, .03); mk(0, LOW, wm, low); mk(LOW, LOW + .02, mats.cap, low, .01); L.segs.push([x0, z0, x1, z1]); L.cut.push({ z: Math.min(z0, z1), full, low }); return; }
      if (d) { mk(DOORH, wallH - .02, wm); mk(DOORH - .1, DOORH + .02, mats.beam); }   // door: a lintel over the opening
      else if (wn && wn.kind === 'shopfront') { mk(0, .8, wm); mk(1.9, wallH - .02, wm); mk(.8, .86, mats.wood); mk(1.86, 1.94, mats.beam); }
      else if (wn && (wn.kind === 'lancet' || wn.kind === 'louvre')) { const lv = wn.kind === 'louvre', a = lv ? 1.0 : 1.15, b = lv ? 1.9 : wallH - .75;   // a tall church lancet of coloured glass, or a belfry opening with oak louvres
        mk(0, a, wm); mk(b, wallH - .02, wm); const gl = mk(a, b, lv ? mats.beam : mats.stained); gl.scale.set(horiz ? .42 : .3, 1, horiz ? .3 : .42);
        for (const s2 of [-1, 1]) { const j = mk(a, b, wm); j.scale.set(horiz ? .3 / (len + t) : 1, 1, horiz ? 1 : .3 / (len + t)); j.position[horiz ? 'x' : 'z'] += s2 * .36; }
        if (!lv) { const m2 = mk(a + (b - a) * .55, a + (b - a) * .55 + .05, mats.stone, full, .04); m2.scale[horiz ? 'x' : 'z'] *= .45; }
        { const ins = lv ? 1.5 : 1.6, [sx, sz] = inSide(e); L.lights.push({ win: true, x: horiz ? mx : mx + sx * ins, z: horiz ? mz + sz * ins : mz, side: wn.side, horiz }); } }   /* lit from well inside the tall church windows, so the altar under the east window is not burnt out; louvres let in daylight too */
      else if (wn && wn.kind === 'shut') { mk(DOORH, wallH - .02, wm); mk(DOORH - .1, DOORH + .02, mats.beam); const dd = mk(0, DOORH - .1, mats.fence); dd.scale[horiz ? 'z' : 'x'] = .6; mk(DOORH * .45, DOORH * .45 + .08, mats.iron, full, .02); }   /* a closed door to somewhere the walk does not go (the wall walk, the far side of a barn) */
      else if (wn && wn.kind === 'loop') { mk(0, .7, wm); mk(1.9, wallH - .02, wm); for (const s2 of [-1, 1]) { const j = mk(.7, 1.9, wm); j.scale.set(horiz ? .42 / (len + t) : 1, 1, horiz ? 1 : .42 / (len + t)); j.position[horiz ? 'x' : 'z'] += s2 * .29; }
        L.lights.push({ win: true, x: horiz ? mx : mx + inSide(e)[0] * .5, z: horiz ? mz + inSide(e)[1] * .5 : mz, side: wn.side, horiz }); }   /* an arrow loop: a narrow slit, splayed inside */
      else if (wn && wn.kind === 'grate') { mk(0, wallH - .5, wm); mk(wallH - .1, wallH - .02, wm); const gr = mk(wallH - .5, wallH - .1, mats.iron); gr.scale.set(horiz ? .6 : 1, 1, horiz ? 1 : .6); }
      else if (wn) { mk(0, .9, wm); mk(1.8, wallH - .02, wm); const gl = mk(.9, 1.8, mats.glass); gl.scale.set(horiz ? .64 : .3, 1, horiz ? .3 : .64); mk(.84, .92, mats.wood, full, .05); mk(1.78, 1.86, mats.beam, full, .03);
        for (const s of [-1, 1]) { const j = mk(.9, 1.8, mats.beam); j.scale.set(horiz ? .1 / (len + t) : 1, 1, horiz ? 1 : .1 / (len + t)); j.position[horiz ? 'x' : 'z'] += s * .36; }
        const inward = horiz ? (z0 >= Di - off - .01 && kind !== 'yard' ? -1 : 1) * (e.endsWith(',0') && !e.startsWith('v') ? -1 : 1) : 0;
        { const [sx, sz] = inSide(e); L.lights.push({ win: true, x: horiz ? mx : mx + sx * .5, z: horiz ? mz + sz * .5 : mz, side: wn.side, horiz }); } }
      else mk(0, wallH - .02, wm);
      if (kind !== 'cellar' && pl.kind !== 'church') { if (!(wn && !d)) mk(0, .14, mats.beam, full, .03); mk(wallH - .16, wallH - .02, mats.beam, full, .03); }
      else if (pl.kind === 'church') mk(0, .18, mats.stone, full, .04);   /* a stone plinth, no timber plates */   // skirting and the plate under the joists
      mk(wallH - .02, wallH, mats.cap, full, .01);
      // the cut-down wall: knee height, dark top, the opening left open
      if (!d) { mk(0, LOW, wm, low); mk(LOW, LOW + .02, mats.cap, low, .01); if (kind !== 'cellar') mk(0, .14, mats.beam, low, .03); }
      if (!d) L.segs.push([x0, z0, x1, z1]); L.cut.push({ z: Math.min(z0, z1), full, low });
    };
    const osOk = (q, sd) => typeof q.openSides !== 'string' || !sd || q.openSides.includes(sd);   // openSides: 1 all round, or a string of the open sides ('f' street, 'b', 'l', 'r')
    const edgeMode = (a, b, sd) => { if ((a && a.gallery && !b) || (b && b.gallery && !a)) return 'rail'; if ((a && a.openSides && !b && osOk(a, sd)) || (b && b.openSides && !a && osOk(b, sd))) return 'posts';
      if (((a && a.open && !b) || (b && b.open && !a)) && kind !== 'ground') return 'parapet'; const ao = a && a.open, bo = b && b.open; if (!ao && !bo) return null; if ((ao || !a) && (bo || !b)) return a && b ? 'none' : kind === 'ground' ? 'precinct' : 'none';
      const roof = ao ? b : a; return roof && roof.arcade ? (roof.arcade === 'timber' ? 'posts' : 'arcade') : 'wall'; };
    const isYardEdge = (e) => kind === 'yard' && e.startsWith('h') && +e.split(',')[2] === 0;   // the house's back wall, drawn by the ground floor
    for (let y = 0; y < rows; y++) for (let x = 0; x <= Wi; x++) { const a = roomAt(x - 1, y), b = roomAt(x, y); if (a === b) continue; const e = `v,${x},${y}`;
      const md = edgeMode(a, b, x === 0 ? 'l' : x === Wi ? 'r' : ''); if (md === 'none') continue; seg(e, x, zOf(y) - 1, x, zOf(y), !a || !b || md === 'wall', kind === 'yard' && (!a || !b) && !(a && a.t !== 'yard') && !(b && b.t !== 'yard'), md); }
    for (let x = 0; x < Wi; x++) for (let y = 0; y <= rows; y++) { const a = roomAt(x, y - 1), b = roomAt(x, y); if (a === b) continue; const e = `h,${x},${y}`; if (isYardEdge(e)) continue;
      const md = edgeMode(a, b, y === 0 ? 'f' : y === rows ? 'b' : ''); if (md === 'none') continue; seg(e, x, zOf(y), x + 1, zOf(y), !a || !b || md === 'wall', kind === 'yard' && (!a || !b) && !(a && a.t !== 'yard') && !(b && b.t !== 'yard'), md); }
    if (loftL) { const RH = wallH, beam = (w, h, d, x, y, z, rx, rz) => { const b = box(w, h, d, mats.beam, x, y, z, g); b.rotation.x = rx; b.rotation.z = rz; return b; };
      if (!eaveLR) { const run = rows / 2, th = Math.atan2(RH - KNEE, run), len = Math.hypot(run, RH - KNEE);   // the back slope only: the front one is cut away with the wall
        for (let x = .5; x < Wi; x += 1) beam(.1, .12, len, x, (KNEE + RH) / 2, Di - off - rows + run / 2, -th, 0);
        { const u = box(Wi, .04, len, T('board', { rough: .95, color: 0xc4a888 }), Wi / 2, (KNEE + RH) / 2 + .08 / Math.cos(th), Di - off - rows + run / 2, g); u.rotation.x = -th; }   // the boards of the roof's underside, behind the rafters
        box(Wi, .14, .14, mats.beam, Wi / 2, RH, Di - off - rows / 2, g); box(Wi, .1, .1, mats.beam, Wi / 2, (KNEE + RH) / 2, Di - off - rows + run / 2, g); }
      else { const run = Wi / 2, th = Math.atan2(RH - KNEE, run), len = Math.hypot(run, RH - KNEE);
        for (let z = Di - off - rows + .5; z < Di - off; z += 1) { beam(len, .12, .1, run / 2, (KNEE + RH) / 2, z, 0, th); beam(len, .12, .1, Wi - run / 2, (KNEE + RH) / 2, z, 0, -th); }
        box(.14, .14, rows, mats.beam, Wi / 2, RH, Di - off - rows / 2, g); } }
    // the timber frame: posts at the bay lines of the outer walls
    const stoneW = ['church', 'keep', 'gate', 'smelter'].includes(pl.kind) || ['guildhall', 'mill'].includes(pl.kind) && F.f === 0 || stoneF;   /* stone walls carry no timber posts */
    if ((kind === 'ground' || kind === 'upper') && !stoneW && pl.posts !== false) { const bx = []; for (let k = 0; k <= Wi; k += 3) bx.push(k); const bz = []; for (let k = 0; k <= rows; k += 3) bz.push(k);
      for (const x of bx) for (const y of [0, rows]) { const p = box(.22, wallH, .22, mats.beam, x, wallH / 2, zOf(y), g); L.cut.push({ z: zOf(y) - .01, full: p, low: null }); }
      for (const y of bz) for (const x of [0, Wi]) { const p = box(.22, wallH, .22, mats.beam, x, wallH / 2, zOf(y), g); L.cut.push({ z: zOf(y) - .01, full: p, low: null }); } }
    // props
    for (const p of F.props) { const fn = BUILD[p.type]; if (!fn) { console.warn('no model', p.type); continue; } const along = p.rot % 2 === 0, fw = along ? p.w : p.h, fd = along ? p.h : p.w;
      const m = fn(fw, fd, { cook: p.cook, forms: (p.comp || []).includes('form'), night: !day, goods: p.goods, p }); if (!m) continue;
      const wx = p.x + p.w / 2, wz = Di - (p.y + off + p.h / 2);
      m.position.set(wx, 0, wz); m.rotation.y = [0, Math.PI / 2, Math.PI, -Math.PI / 2][p.rot] || 0;
      m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); g.add(m);
      if (p.type === 'pier') { const low = box(.62, .45, .62, mats.lime, wx, .22, wz, g); low.visible = false; L.cut.push({ z: wz - .1, full: m, low }); }   // an arcade pier in front of the party drops to its base, like a wall
      m.updateMatrixWorld(true);
      if (m.userData.fire) L.lights.push({ x: wx, z: wz, fire: true });
      m.traverse((o) => { if (o.userData.candle && !day) { const v = new THREE.Vector3(...o.userData.candle).applyMatrix4(o.matrixWorld); L.lights.push({ x: v.x, z: v.z, y: v.y, candle: true }); } });
      if (p.type !== 'trap' && !p.walk) for (let j = 0; j < p.h; j++) for (let i = 0; i < p.w; i++) L.block.add((p.x + i) + ',' + (p.y + off + j));
      if (p.type === 'trap') L.trap = [p.x, p.y]; }
    // stairs
    const S = F.stair || {}, ck = oneKind(coreKind(S));
    if ((S.block || []).length) { g.add(stairMesh(S, kind === 'cellar' ? 'ladder' : ck, 0, F)); for (const [x, y] of S.block) L.block.add(x + ',' + y); }
    if ((S.well || []).length && F.f > 0) { const below = pl.floors.find((q) => q.f === F.f - 1); if (below) g.add(stairMesh(below.stair, oneKind(coreKind(below.stair)), -SH, below, true));
      for (const [x, y] of S.well) railAround(g, x, y, wellSet, F, L); }
    L.wellSet = wellSet;
    // the street outside the front door, to walk back out onto (the cellar's own street steps too)
    const sd = kind === 'cellar' && F.doors.find((d) => d.street);
    if (sd && F.csteps) { // steps up out of the cellar to the street door, along the inside of the front wall: a landing behind the door, stone steps down to the floor
      const CS = F.csteps, top = 1.2, cz = Di - .5, per = 3, n = CS.cells.length * per;
      for (let i = 0; i < n; i++) { const h = (i + 1) * top / (n + 1), c = CS.cells[Math.floor(i / per)], x = c[0] + (CS.dir > 0 ? 1 - ((i % per) + .5) / per : ((i % per) + .5) / per);
        box(1 / per + .004, h, .94, mats.stone, x, h / 2, cz, g); box(1 / per - .03, .03, .94, T('stair_tread', { rough: .85, color: 0xd8ccb8 }), x, h + .015, cz, g); }
      box(.96, top, .94, mats.stone, CS.top[0] + .5, top / 2, cz, g); box(.96, .03, .94, T('stair_tread', { rough: .85, color: 0xd8ccb8 }), CS.top[0] + .5, top + .015, cz, g);
      const sun = new THREE.PointLight(day ? 0xfff0d8 : 0x8090c0, day ? 3.2 : .9, 4.5, 1.6); sun.position.set(CS.top[0] + .5, top + 1.1, Di - .2); g.add(sun);
      L.csteps = CS; }
    if (kind === 'ground') { const st = box(Wi + 6, .1, 3, mat.cobble(), Wi / 2, -.07, Di + 1.5, g); st.castShadow = false;
      if (kind === 'ground') for (let x = 0; x < Wi; x++) if (!F.doors.some((d) => d.street && d.e === `h,${x},0`)) { /* plinth under the front wall */ box(1, .12, .3, mats.stone, x + .5, .03, Di + .2, g); } }
    // lights: a soft fill, a pool of daylight under each window (a shaft of it in the air), the fire's warm glow, candles at night
    const amb = new THREE.HemisphereLight(day ? 0xfff0dc : 0x6a78a0, 0x4a3a2c, (kind === 'cellar' ? .6 : day ? 1.05 : .42) * (pl.tier === 'civic' && kind !== 'cellar' ? 1.3 : 1)); g.add(amb);   /* big civic rooms: more fill, their windows can't light the whole floor */
    const key = new THREE.DirectionalLight(day ? 0xffe8c8 : 0x8090c0, kind === 'cellar' ? .25 : kind === 'yard' ? (day ? 2.2 : .45) : day ? 1.3 : .36);
    key.position.set(Wi / 2 - 6, 12, Di - off - rows / 2 + 9); key.target.position.set(Wi / 2, 0, Di - off - rows / 2); key.castShadow = !!opt.shadows; Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 40 }); key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0008; key.shadow.normalBias = .02; g.add(key, key.target); L.key = key;
    let nl = 0; for (const s of L.lights) { if (nl > 8) break;
      if (s.win && day) { const l = new THREE.PointLight(0xfff0dc, 4.5, 5, 1.5); l.position.set(s.x, 1.5, s.z); g.add(l); nl++; }
      if (s.win && !day && kind !== 'yard') { /* moonlight: the glass glows faintly, nothing more */ }
      if (s.fire) { const l = new THREE.PointLight(0xff9040, day ? 5 : 12, day ? 6 : 9, 1.4); l.position.set(s.x, .9, s.z); l.userData.base = l.intensity; l.userData.seed = Math.random() * 10; l.castShadow = !!opt.shadows && !day; if (l.castShadow) { l.shadow.mapSize.set(512, 512); l.shadow.bias = -.002; } g.add(l); L.flick.push(l); nl++; }
      if (s.candle) { const l = new THREE.PointLight(0xffb060, 3.2, 4.5, 1.5); l.position.set(s.x, (s.y || 1.4) + .1, s.z); l.userData.base = l.intensity; l.userData.seed = Math.random() * 10; g.add(l); L.flick.push(l); nl++; } }
    if (kind === 'cellar') { const t = (S.block || [])[0] || [Wi / 2, 1]; const l = new THREE.PointLight(0xffd8a0, 4, 6, 1.3); l.position.set(t[0] + .5, 2.0, Di - t[1] - .5); g.add(l);
      const ext = L.F.rooms[0]; const lan = new THREE.PointLight(0xffb868, 6, 8, 1.3); lan.position.set(Wi / 2, 1.9, Di - (ext.y1 + 1) / 2); lan.userData.base = 6; lan.userData.seed = 3; g.add(lan); L.flick.push(lan);
      const hook = new THREE.Group(); box(.04, .35, .04, mat.iron(), 0, .17, 0, hook); box(.16, .2, .16, plain(0xffd890, { emissive: 0xffb050, ei: 2 }), 0, -.1, 0, hook); hook.position.set(Wi / 2, 2.0, Di - (ext.y1 + 1) / 2); g.add(hook);
      if (F.doors.some((d) => d.street)) { const d = F.doors.find((q) => q.street); const l2 = new THREE.PointLight(day ? 0xfff0dc : 0x8090c0, day ? 4 : 1, 5, 1.5); l2.position.set(d.x + .5, 1.8, Di - .6); g.add(l2); } }
    if (kind === 'yard') scene.userData.yardSky = true;
    for (const q of F.rooms) if (q.open || q.openSides) { const w = q.x1 - q.x0 + 1, h = q.y1 - q.y0 + 1, l = new THREE.PointLight(day ? 0xfff4e0 : 0x8090c0, (day ? 6 : 1.2) * Math.sqrt(w * h) / 3, Math.max(w, h) * 1.4 + 3, 1.2);
      l.position.set(q.x0 + w / 2, 4.5, Di - (q.y0 + off + h / 2)); g.add(l); }   /* the sky over an open court */
    return L;
  }
  // a shaft of daylight from a window, slanting down into the room
  function shaft(g, s) {
    const c = document.createElement('canvas'); c.width = 8; c.height = 64; const x = c.getContext('2d'); const gr = x.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, 'rgba(255,240,210,0.55)'); gr.addColorStop(1, 'rgba(255,240,210,0)'); x.fillStyle = gr; x.fillRect(0, 0, 8, 64);
    const t = new THREE.CanvasTexture(c); const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .35, side: THREE.DoubleSide });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(.7, 2.2), m); p.renderOrder = 5;
    const dirX = s.horiz ? 0 : (s.side === 'l' ? 1 : -1), dirZ = s.horiz ? (s.side === 'f' ? -1 : 1) : 0;
    p.position.set(s.x - dirX * .5 + dirX * .7, 1.0, s.z - dirZ * .5 + dirZ * .7);
    if (s.horiz) { p.rotation.x = dirZ * -.55; } else { p.rotation.y = Math.PI / 2; p.rotation.x = dirX * .55; }
    g.add(p);
  }
  // a rail round a stairwell, left open where the stair arrives
  function railAround(g, x, y, wellSet, F, L) { const wd = mat.dark(), need = (F.stair.need || []).map(([a, b]) => a + ',' + b);
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const nx = x + dx, ny = y + dy; if (wellSet.has(nx + ',' + ny) || need.includes(nx + ',' + ny)) continue;
      if (!L.roomAt(nx, ny)) continue;   // a wall stands there already
      const ex = x + .5 + dx * .48, ez = Di - y - .5 - dy * .48;
      if (dy) { box(1, .06, .07, wd, x + .5, .95, ez, g); for (const k of [-.45, 0, .45]) box(.05, .95, .05, wd, x + .5 + k, .47, ez, g); }
      else { box(.07, .06, 1, wd, ex, .95, Di - y - .5, g); for (const k of [-.45, 0, .45]) box(.05, .95, .05, wd, ex, .47, Di - y - .5 + k, g); } } }
  // stair geometry: ladder, 1x1 winder (boxed timber treads round a newel), spiral (stone vice) or a straight flight
  function stairMesh(S, kind, y0, F, fromBelow) { const g = new THREE.Group(); g.position.y = y0; const wd = mat.wood(), dk = mat.dark(), tr = T('stair_tread', { rough: .85, color: 0xc8a888 });
    if (!S || !(S.block || []).length) return g;
    if (kind === 'flight' && S.climb) { const cs = S.climb.cells, lo = S.climb.low, n = Math.round(cs.length * 3.5);
      const first = cs.reduce((b, c) => Math.abs(c[0] - lo[0]) + Math.abs(c[1] - lo[1]) < Math.abs(b[0] - lo[0]) + Math.abs(b[1] - lo[1]) ? c : b, cs[0]);
      const ux = first[0] - lo[0], uy = first[1] - lo[1];                     // plan direction of climb
      const wx = ux, wz = -uy;                                               // in the world
      const sx0 = lo[0] + .5 + ux * .5, sz0 = Di - lo[1] - .5 - uy * .5 * -1 * -1;
      const startX = lo[0] + .5 + ux * .5, startZ = Di - lo[1] - .5 + wz * .5;
      // over a stairwell (a stacked flight hung above the flight below) the steps hang on their strings with open space beneath
      const holes = new Set(((F && F.stair && F.stair.well) || []).map((c) => c[0] + ',' + c[1]));
      for (let i = 0; i < n; i++) { const h = (i + 1) * SH / n, a = (i + .5) / n * cs.length, px = startX + wx * a, pz = startZ + wz * a;
        const hang = holes.has(Math.floor(px) + ',' + Math.floor(Di - pz)) || wz > 0,   // a flight climbing toward the camera is drawn open-strung, or its tall end reads as a cupboard
           bh = hang ? Math.min(h, .34) : h;
        box(wx ? cs.length / n + .005 : .92, bh, wz ? cs.length / n + .005 : .92, i % 2 ? T('wood', { rough: .75, color: 0xb89878 }) : T('wood', { rough: .7, color: 0xd0b090 }), px, h - bh / 2, pz, g);
        if (hang) for (const sd of [-1, 1]) box(wx ? cs.length / n + .01 : .06, .5, wz ? cs.length / n + .01 : .06, dk, px + (wz ? sd * .47 : 0), h - .2, pz + (wx ? sd * .47 : 0), g); box(wx ? cs.length / n : .94, .04, wz ? cs.length / n : .94, T('stair_tread', { rough: .8, color: 0xf0dcc0 }), px, h + .02, pz, g); }
      // handrail on the open side (posts at the ends)
      const side = [[1, 0], [-1, 0], [0, 1], [0, -1]].find(([sx, sy]) => (sx && !wx) || (sy && !wz)) || [1, 0];
      return g; }
    const [x, y] = S.block[0], X = x + .5, Zc = Di - y - .5;
    if (kind === 'ladder') { const lean = .36; for (const sx of [-1, 1]) { const r = box(.06, 2.75, .08, dk, X + sx * .24, 1.3, Zc - .02, g); r.rotation.x = -lean; }
      for (let i = 0; i < 9; i++) { const yy = .22 + i * .27; box(.5, .04, .05, wd, X, yy, Zc + .44 - yy * Math.tan(lean), g); }
      return g; }
    // 1x1 winder / spiral: the first tread faces the landing on this floor; one full turn per storey
    const nb = (F && F.stair && (F.stair.need || [])[0]) || [x, y - 1];
    const a0 = Math.atan2(-(nb[1] - y), nb[0] - x);   // world angle (x, -z) toward the landing
    // the upper floor is never drawn above a room, so a 1x1 stair shows its lower half here (cut like the walls),
    // and the floor above shows its upper half rising through the well
    const n = 12, round = kind === 'spiral', cut = SH * .58, oak = T('wood', { rough: .75, color: 0xc0a080 }), lightW = T('wood', { rough: .7, color: 0xe0c4a0 });
    const keep = (h) => fromBelow ? h > SH - cut + .01 : h <= cut + .01;
    for (let i = 0; i < n; i++) { const aa = a0 + i * Math.PI * 2 / n * .94, ab = aa + Math.PI * 2 / n * .94, h = (i + 1) * SH / n; if (!keep(h)) continue;
      if (round) { const body = new THREE.Mesh(wedge(aa, ab, true, .15), T('pave', { rough: .9, color: 0xe4e0d8 })); body.position.set(X, h - .15, Zc); body.castShadow = body.receiveShadow = true; g.add(body); }
      else { const body = new THREE.Mesh(wedge(aa, ab, false, .15), i % 2 ? oak : lightW); body.position.set(X, h - .2, Zc); body.castShadow = body.receiveShadow = true; g.add(body);
        const top = new THREE.Mesh(wedge(aa, ab, false, .05), T('stair_tread', { rough: .8, color: 0xf0dcc0 })); top.position.set(X, h - .05, Zc); top.receiveShadow = true; g.add(top); } }
    const y0p = fromBelow ? SH - cut : 0, hp = fromBelow ? cut : cut + .25;
    if (round) { cyl(.1, .1, hp, T('pave', { rough: .9, color: 0xd0ccc4 }), X, y0p + hp / 2, Zc, g, 10);
      // the stone drum round the back half only, so the steps show from the camera's side
      const dm = T('stone_big', { rough: .95, color: 0xb0aaa0 }).clone(); dm.side = THREE.DoubleSide; const wall = new THREE.Mesh(new THREE.CylinderGeometry(.58, .58, hp, 20, 1, true, Math.PI / 2, Math.PI), dm); wall.position.set(X, y0p + hp / 2, Zc); wall.castShadow = wall.receiveShadow = true; g.add(wall);
      const cm = mat.cap().clone(); cm.side = THREE.DoubleSide; const capR = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, .05, 20, 1, false, Math.PI / 2, Math.PI), cm); capR.position.set(X, y0p + hp, Zc); g.add(capR); }
    else { cyl(.07, .07, hp, dk, X, y0p + hp / 2, Zc, g, 8); if (!fromBelow) { const k = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), dk); k.position.set(X, hp + .05, Zc); k.castShadow = true; g.add(k); } }
    return g; }

  // build every level: cellar, ground (+ yard), floors above
  for (const F of pl.floors) { const kind = F.f === -1 ? 'cellar' : F.f === 0 ? 'ground' : 'upper'; levels.set(F.f, level(F, kind, 0)); }
  if (pl.yard) { const Y = level({ ...pl.yard, f: 'yard', rows: pl.yard.rows }, 'yard', Di); levels.get(0).yard = Y; }
  // stair triggers: which cell on which level leads where, and the cell you arrive on
  const top = Math.max(...pl.floors.map((F) => F.f));
  const free = (Lv, c) => c && Lv.roomAt(c[0], c[1]) && !Lv.block.has(c[0] + ',' + c[1]);
  const landing = (Lv, c, pref) => { if (pref && free(Lv, pref)) return pref; for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const q = [c[0] + dx, c[1] + dy]; if (free(Lv, q) && !(Lv.wellSet.has(q[0] + ',' + q[1])) && !(Lv.trap && Lv.trap[0] === q[0] && Lv.trap[1] === q[1])) return q; } return pref || c; };
  for (const [f, Lv] of levels) { const S = Lv.F.stair || {}, kind = coreKind(S);
    if (f === -1 && Lv.csteps) { const CS = Lv.csteps; for (const c of [...CS.cells, CS.top]) Lv.block.add(c[0] + ',' + c[1]);
      const lo = CS.cells[0]; Lv.trig.set(lo[0] + ',' + lo[1], { exit: true, from: [CS.foot] }); }   // walking into the foot of the steps climbs them out to the street
    if (f === -1) { for (const c of S.block || []) { const G = levels.get(0); if (G && G.trap) Lv.trig.set(c[0] + ',' + c[1], { to: 0, at: landing(G, G.trap) }); } continue; }
    if (Lv.trap && levels.has(-1)) { const C = levels.get(-1), cs = C.F.stair, [tx, ty] = Lv.trap, inR = (q, x, y) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1, rm = Lv.F.rooms.find((q) => inR(q, tx, ty));
      const from = rm ? [[tx + 1, ty], [tx - 1, ty], [tx, ty + 1], [tx, ty - 1]].filter(([x, y]) => inR(rm, x, y) && !Lv.block.has(x + ',' + y)) : [];   // the hatch is opened from its own room, never through a partition
      Lv.trig.set(tx + ',' + ty, { to: -1, at: landing(C, (cs.block || [])[0] || [0, 0], (cs.need || [])[0]), from, key: 'KeyE' }); }
    if (kind === 'flight') {
      if (S.climb && levels.has(f + 1)) { const U = levels.get(f + 1); for (const c of S.block) Lv.trig.set(c[0] + ',' + c[1], { to: f + 1, at: landing(U, S.climb.high, S.climb.high), from: [S.climb.low] }); }
      if ((S.well || []).length && levels.has(f - 1)) { const D = levels.get(f - 1), ds = D.F.stair; for (const c of S.well) { Lv.block.add(c[0] + ',' + c[1]); Lv.trig.set(c[0] + ',' + c[1], { to: f - 1, at: landing(D, ds.climb.low, ds.climb.low), from: (S.need || []).filter((n) => S.well.some((w) => Math.abs(w[0] - n[0]) + Math.abs(w[1] - n[1]) === 1)) }); } }
      continue; }
    // ladder / winder / spiral: one cell, the same on every floor
    const c = (S.block || [])[0] || (S.well || [])[0]; if (!c) continue; const k = c[0] + ',' + c[1];
    const upT = f < top && levels.has(f + 1) ? { to: f + 1, at: landing(levels.get(f + 1), c, (levels.get(f + 1).F.stair.need || [])[0]) } : null;
    const dnT = f > 0 && levels.has(f - 1) ? { to: f - 1, at: landing(levels.get(f - 1), c, (levels.get(f - 1).F.stair.need || [])[0]) } : null;
    // entered only from its own room's side (need cells): never through a partition from the next room
    const fromC = (S.need || []).filter((n) => Math.abs(n[0] - c[0]) + Math.abs(n[1] - c[1]) === 1); if (fromC.length) { if (upT) upT.from = fromC; if (dnT) dnT.from = fromC; }
    if (upT && dnT) Lv.trig.set(k, { choice: true, up: upT, down: dnT, from: fromC }); else if (upT || dnT) Lv.trig.set(k, upT || dnT);
    Lv.block.add(k); }
  return { scene, levels, Wi, Di, SH, LOW, pl };
}

// ---------------------------------------------------------------- walking inside: the party, collision, stairs, cutaway, camera
const SPEED = 3.4;
export function makeWalk(I, tex, opt = {}) {
  const { scene, levels, Wi, Di } = I, R = .2;
  const blob = opt.blob, party = tex.map((t, i) => sprite(t));
  function sprite(t, sc = 1.15) { const w = 32 / 36 * sc, h = 48 / 36 * sc;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, alphaTest: .5, roughness: 1, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .14 })); m.rotation.x = -.18; m.castShadow = true;
    m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: .5 }); scene.add(m);
    const sh = new THREE.Mesh(new THREE.CircleGeometry(.24, 16), new THREE.MeshBasicMaterial({ map: blob, color: 0, transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.scale.set(1.5, .9, 1); scene.add(sh);
    return { m, sh, h, pos: new THREE.Vector2() }; }
  // the party's own light: a lantern at night, a faint fill by day so faces read in dark corners
  const lamp = new THREE.PointLight(0xffd8a8, opt.day === false ? 3.2 : .7, opt.day === false ? 6.5 : 4, 1.5); scene.add(lamp);
  const W = { f: 0, lead: party[0], party, trail: [], fade: 0, pending: null, prompt: null, exited: false, clock: 0 };
  const lv = () => levels.get(W.f);
  // what stands at cell (X, Y) of the current walk (Y counts on into the yard behind the ground floor; below 0 is the street)
  const cellOK = (X, Y) => { const L = lv();
    if (Y < 0) return (W.f === 0 || (W.f === -1 && L.F.doors.some((d) => d.street))) && X >= -2 && X < Wi + 2 && Y >= -2;
    if (Y >= Di) { const Yd = W.f === 0 && L.yard; if (!Yd) return false; const y = Y - Di; return !!Yd.roomAt(X, y) && !Yd.block.has(X + ',' + Y); }
    return !!L.roomAt(X, Y) && !L.block.has(X + ',' + Y); };
  const segsNow = () => { const L = lv(); return W.f === 0 && L.yard ? L.segs.concat(L.yard.segs) : L.segs; };
  const hits = (x, z) => { const X0 = Math.floor(x - R), X1 = Math.floor(x + R), Y0 = Math.floor(Di - (z + R)), Y1 = Math.floor(Di - (z - R));
    for (let Y = Y0; Y <= Y1; Y++) for (let X = X0; X <= X1; X++) { if (cellOK(X, Y)) continue; const qx = Math.max(X, Math.min(x, X + 1)), qz = Math.max(Di - Y - 1, Math.min(z, Di - Y)); if ((x - qx) ** 2 + (z - qz) ** 2 < R * R) return true; }
    for (const [x0, z0, x1, z1] of segsNow()) { const qx = Math.max(Math.min(x0, x1), Math.min(x, Math.max(x0, x1))), qz = Math.max(Math.min(z0, z1), Math.min(z, Math.max(z0, z1))); if ((x - qx) ** 2 + (z - qz) ** 2 < (R + WT * .5) ** 2) return true; }
    return false; };
  function show() { for (const [f, L] of levels) { L.g.visible = f === W.f; if (L.yard) L.yard.g.visible = f === W.f; } }
  function place(f, c, face) { W.f = f; show(); const x = c[0] + .5, z = Di - c[1] - .5; W.trail = [];
    W.party.forEach((C, i) => { C.pos.set(x + (face ? face[0] : 0) * i * .35, z + (face ? face[1] : .0) * i * .35 + i * .01); });
    for (let i = 0; i < 80; i++) W.trail.push([x + (face ? face[0] : 0) * i * .05, z + (face ? face[1] : 0) * i * .05]);
    W.cell = null; }
  W.enter = () => { const d = (levels.get(0).F.doors.find((q) => q.street && !q.steps)) || { x: I.pl.doorX }; place(0, [d.x, 0], [0, 1]);
    // the party files in from the street behind the leader
    W.party.forEach((C, i) => C.pos.set(d.x + .5, Di - .5 + i * .75)); W.trail = []; for (let i = 0; i < 80; i++) W.trail.push([d.x + .5, Di - .5 + i * .05]); };
  // in from the street by the cellar flaps: down the steps, into the cellar's doorway
  W.enterCellar = () => { const C = levels.get(-1), CS = C && C.csteps; if (!CS) return false; const ft = CS.foot, lo = CS.cells[0]; place(-1, ft, [Math.sign(lo[0] - ft[0]) * .5, -Math.sign(lo[1] - ft[1]) * .5]); return true; };   // the party strung out behind, back toward the steps
  W.go = (to, at, from) => { W.pending = { to, at, from, t: 0 }; };
  W.press = (code) => { if (!W.prompt) { if (code === 'KeyE' && W.hint && !W.pending) { const h = W.hint; W.hint = null; W.go(h.to, h.at, h.c); return true; } return false; } const P = W.prompt;
    if (code === 'KeyW' || code === 'ArrowUp') { W.prompt = null; W.go(P.up.to, P.up.at, P.from); return true; }
    if (code === 'KeyS' || code === 'ArrowDown') { W.prompt = null; W.go(P.down.to, P.down.at, P.from); return true; }
    if (code === 'Escape' || code === 'KeyA' || code === 'KeyD' || code === 'ArrowLeft' || code === 'ArrowRight') { W.prompt = null; return true; } return false; };
  W.roomName = () => { const L = lv(), x = Math.floor(W.lead.pos.x), Y = Math.floor(Di - W.lead.pos.y);
    const lvlName = W.f === -1 ? 'Cellar' : W.f === 0 ? 'Ground floor' : W.f === 1 ? 'First floor' : W.f === 2 ? 'Second floor' : 'Floor ' + W.f;
    if (Y < 0) return ['Street', '']; if (Y >= Di && L.yard) { const q = L.yard.roomAt(x, Y - Di); return [q ? (q.t === 'yard' ? 'Yard' : ROOM[q.t]?.name || q.t) : 'Yard', 'Behind the house']; }
    if (I.pl.zone) { const z = I.pl.zone(W.f, x, Y); if (z) return z; }
    const q = L.roomAt(x, Y); return [q ? (I.pl.roomNames && I.pl.roomNames[q.t]) || ROOM[q.t]?.name || q.t : '', lvlName]; };
  W.tick = (dt, mv) => { W.clock += dt; const L = lv(), Ld = W.lead;
    // fading between levels
    if (W.pending) { const P = W.pending; P.t += dt; W.fade = Math.min(1, P.t / .22);
      if (P.t >= .22 && !P.done) { P.done = true; const fc = P.from ? [Math.sign(P.from[0] - P.at[0]), -Math.sign(P.from[1] - P.at[1])] : null; place(P.to, P.at, fc && (fc[0] || fc[1]) ? fc : null); }
      if (P.done) { W.fade = Math.max(0, 1 - (P.t - .22) / .25); if (P.t > .5) { W.pending = null; W.fade = 0; } } }
    else if (W.exiting) { W.exiting += dt; W.fade = Math.min(1, W.exiting / .25); if (W.exiting > .3) W.exited = true; }
    const ox = Ld.pos.x, oz = Ld.pos.y; let [vx, vy] = mv || [0, 0];
    if (W.prompt || W.pending || W.exiting) vx = vy = 0;
    if (vx || vy) { const n = Math.hypot(vx, vy), st = SPEED * dt / n; const nx = Ld.pos.x + vx * st; if (!hits(nx, Ld.pos.y)) Ld.pos.x = nx; const nz = Ld.pos.y + vy * st; if (!hits(Ld.pos.x, nz)) Ld.pos.y = nz;
      // a stair cell is entered by walking into it (it is solid to the collision); test the cell just ahead
      const ahead = R + SPEED * dt + .06, ax = Math.floor(Ld.pos.x + Math.sign(vx) * ahead), aY = Math.floor(Di - (Ld.pos.y + Math.sign(vy) * ahead));
      const here = [Math.floor(Ld.pos.x), Math.floor(Di - Ld.pos.y)];
      for (const c of [[ax, here[1]], [here[0], aY], here]) { const t = L.trig.get(c[0] + ',' + c[1]); if (!t || t.key) continue; if (t.from && t.from.length && !t.from.some((q) => q[0] === here[0] && q[1] === here[1])) continue;
        if (t.exit) { if (!W.exiting) W.exiting = 1e-6; break; } if (t.choice) { if (!W.prompt && !W.pending) W.prompt = { ...t, from: c }; } else if (!W.pending) W.go(t.to, t.at, c); break; } }
    // a cellar hatch is plain floor to walk over; standing on it or beside it (in its room) offers E to climb down
    W.hint = null; if (L.trap && !W.pending && !W.exiting) { const t = L.trig.get(L.trap[0] + ',' + L.trap[1]), hx = Math.floor(Ld.pos.x), hy = Math.floor(Di - Ld.pos.y);
      if (t && t.key && ((hx === L.trap[0] && hy === L.trap[1]) || (t.from || []).some((q) => q[0] === hx && q[1] === hy))) W.hint = { ...t, c: L.trap }; }
    Ld.moving = Ld.pos.x !== ox || Ld.pos.y !== oz; if (vx) Ld.m.scale.x = vx < 0 ? -1 : 1;
    if (Ld.moving) { if (!W.trail.length || Math.hypot(W.trail[0][0] - Ld.pos.x, W.trail[0][1] - Ld.pos.y) > .05) W.trail.unshift([Ld.pos.x, Ld.pos.y]); if (W.trail.length > 200) W.trail.length = 200; }
    W.party.slice(1).forEach((C, i) => { const want = (i + 1) * .9; let acc = 0, prev = [Ld.pos.x, Ld.pos.y], tgt = null;
      for (const p of W.trail) { acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; if (acc >= want) { tgt = p; break; } }
      const px = C.pos.x, pz = C.pos.y; if (tgt) { const gx = tgt[0] - px, gz = tgt[1] - pz, dd = Math.hypot(gx, gz), st = Math.min(dd, SPEED * 1.25 * dt); if (dd > .02) { C.pos.x += gx / dd * st; C.pos.y += gz / dd * st; if (Math.abs(gx) > .01) C.m.scale.x = gx < 0 ? -1 : 1; } }
      C.moving = C.pos.x !== px || C.pos.y !== pz; });
    W.party.forEach((C, i) => { C.m.position.set(C.pos.x, C.h / 2 - 1 / 32 + (C.moving ? Math.abs(Math.sin(W.clock * 14 + i)) * .045 : 0), C.pos.y + .05); C.sh.position.set(C.pos.x, .012, C.pos.y + .07); C.m.visible = C.sh.visible = true; });
    lamp.position.set(Ld.pos.x, 1.8, Ld.pos.y + 1.2);
    // out through the street door: back to the town
    if (!W.exiting && Ld.pos.y > Di + .9) W.exiting = 1e-6;
    // cutaway: every wall wholly in front of the leader drops to knee height
    const zc = Ld.pos.y + .25, cuts = W.f === 0 && L.yard ? L.cut.concat(L.yard.cut) : L.cut;
    for (const c of cuts) { const front = c.z > zc - .02 && Ld.pos.y < Di + .2; c.full.visible = !front; if (c.low) c.low.visible = front; }
    for (const l of L.flick) l.intensity = l.userData.base * (1 + .08 * Math.sin(W.clock * 9 + l.userData.seed) + .05 * Math.sin(W.clock * 23 + l.userData.seed * 2));
  };
  W.cellOK = cellOK; W.hits = hits;
  W.camGoal = (zEff = 1) => new THREE.Vector3(W.lead.pos.x, 9.4 * zEff, W.lead.pos.y + 8.4 * zEff);
  W.lookAt = (cam, zEff = 1) => cam.lookAt(cam.position.x, .75, cam.position.z - 8.4 * zEff - .5);
  W.dispose = () => scene.traverse((o) => { o.geometry?.dispose?.(); });
  return W;
}
