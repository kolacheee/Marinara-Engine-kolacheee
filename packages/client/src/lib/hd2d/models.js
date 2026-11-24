// @ts-nocheck
// 3D prop models built from simple shapes wearing the 32-texel-per-unit pixel textures.
// Every model is a Group with its origin at the centre of its footprint on the floor, front facing +z.
import * as THREE from 'three';
/** Where the town's textures, sprites and models are served from (set by the Engine before a town is built). */
export const hd2dAsset = (path) => (globalThis.HD2D_ASSETS || 'assets/') + path;
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new THREE.TextureLoader();
const cache = {};
export function tex(name) {
  if (cache[name]) return cache[name];
  const t = loader.load(hd2dAsset(name + '.png'));
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.__name = name;
  return cache[name] = t;
}
const TS = {}; // texel size of each texture, filled lazily from the image
const SIZES = { wood: [32, 32], wood_v: [32, 32], board: [32, 32], barrel_side: [64, 26], barrel_top: [24, 24], crate: [24, 24],
  chest_body: [28, 14], chest_lid: [28, 22], lock: [8, 9], cloth_red: [32, 32], cloth_teal: [32, 32], cloth_linen: [32, 32], sack: [32, 32],
  books: [32, 12], stone_block: [32, 32], stone_big: [32, 32], iron: [16, 16], iron_dark: [16, 16], stone_smooth: [16, 16], clay: [16, 16],
  flagwell: [16, 16], gold: [32, 32], log_end: [12, 12], bark: [32, 64], leaves: [64, 64], water: [32, 32], grass: [128, 128], cobble: [128, 128], stair_tread: [32, 32] };
const matCache = {};
export function M(name, o = {}) {
  const key = name + JSON.stringify(o);
  if (matCache[key]) return matCache[key];
  const m = new THREE.MeshStandardMaterial({ map: tex('m/' + name), roughness: o.rough ?? .85, metalness: o.metal ?? 0, color: o.color ?? 0xffffff, flatShading: !!o.flat });
  if (o.emissive) { m.emissive = new THREE.Color(o.emissive); m.emissiveIntensity = o.ei ?? 1; }
  return matCache[key] = m;
}
export const plain = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? .8, metalness: o.metal ?? 0, flatShading: !!o.flat,
  ...(o.emissive ? { emissive: new THREE.Color(o.emissive), emissiveIntensity: o.ei ?? 1 } : {}) });

// world-scaled UVs so texels stay 32 per unit on any box
function boxUV(geo, w, h, d, tw, th) {
  const uv = geo.attributes.uv;
  const spans = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i;
    uv.setXY(k, uv.getX(k) * spans[f][0] * 32 / tw, uv.getY(k) * spans[f][1] * 32 / th);
  }
}
export function box(w, h, d, mat, x = 0, y = 0, z = 0, parent, texName) {
  const g = new THREE.BoxGeometry(w, h, d);
  const tn = texName || (mat.map && mat.map.__name);
  const sz = tn && SIZES[tn];
  if (sz) boxUV(g, w, h, d, sz[0], sz[1]);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true;
  if (parent) parent.add(m); return m;
}
function lathe(profile, mat, segs, parent, texName, circ) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segs);
  const sz = SIZES[texName];
  if (sz) { const uv = g.attributes.uv; const hgt = profile[profile.length - 1][1] - profile[0][1];
    for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * Math.max(1, Math.round(circ * 32 / sz[0])), uv.getY(k) * hgt * 32 / sz[1]); }
  const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
function cyl(rt, rb, h, mat, x, y, z, parent, segs = 10) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segs), mat); m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
// material by texture name, remembering the name so box() can scale UVs
function T(name, o) { const m = M(name, o); m.map.__name = name; return m; }

// ---- flames and lights: models report light anchors, the scene decides which ones to light
export function flame(parent, x, y, z, s = 1) {
  const mat = new THREE.SpriteMaterial({ map: tex('m/flame'), color: new THREE.Color(2.6, 2.2, 1.8), toneMapped: false, depthWrite: false, transparent: true, alphaTest: .4 });
  const sp = new THREE.Sprite(mat); sp.scale.set(.24 * s, .4 * s, 1); sp.position.set(x, y + .17 * s, z); parent.add(sp);
  parent.userData.lights = parent.userData.lights || [];
  parent.userData.lights.push({ x, y: y + .2 * s, z, s });
  return sp;
}

// ---------------------------------------------------------------- props
const B = {};
B.barrel = (g) => {
  const prof = [[.0, 0], [.25, 0], [.29, .2], [.31, .4], [.29, .6], [.25, .8], [0, .8]];
  lathe(prof.slice(1, 6), T('barrel_side'), 16, g, 'barrel_side', 1.9);
  const top = new THREE.Mesh(new THREE.CircleGeometry(.25, 16), T('barrel_top', { rough: .9 }));
  top.material.alphaTest = .5; top.rotation.x = -Math.PI / 2; top.position.y = .79; top.receiveShadow = true; g.add(top);
  return { w: .62, d: .62 };
};
B.crate = (g) => {
  const m = M('crate'); box(.7, .7, .7, m, 0, .35, 0, g);
  return { w: .7, d: .7 };
};
function chestModel(g, open) {
  const body = T('chest_body');
  box(.8, .38, .5, body, 0, .19, 0, g);
  const lidM = T('chest_lid');
  const lid = new THREE.Group(); lid.position.set(0, .38, -.25); g.add(lid);
  const half = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .8, 12, 1, false, 0, Math.PI), lidM);
  half.rotation.z = Math.PI / 2; half.rotation.y = 0; half.scale.set(1, 1, .7);
  half.rotation.set(0, 0, Math.PI / 2); half.position.set(0, 0, .25); half.castShadow = true; lid.add(half);
  const cap = (sx) => { const c = new THREE.Mesh(new THREE.CircleGeometry(.25, 12, 0, Math.PI), M('wood')); c.rotation.y = sx * Math.PI / 2; c.position.set(sx * .4, 0, .25); lid.add(c); };
  cap(1); cap(-1);
  half.scale.set(.7, 1, 1);
  if (open) { lid.rotation.x = -1.9; const heap = new THREE.Mesh(new THREE.SphereGeometry(.34, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), T('gold', { rough: .5, emissive: 0x5a3a08, ei: .5 }));
    heap.scale.set(1.1, .35, .62); heap.position.set(0, .37, 0); heap.castShadow = true; g.add(heap); }
  const lock = new THREE.Mesh(new THREE.PlaneGeometry(.1, .12), M('lock', { metal: .5, rough: .4 })); lock.position.set(0, .34, .252); g.add(lock);
  return { w: .82, d: .52 };
}
B.chest = (g) => chestModel(g, false);
B.chest_coins = (g) => chestModel(g, true);
B.coin_pile = (g) => {
  const gm = T('gold', { rough: .5, emissive: 0x5a3a08, ei: .5 });
  const glint = new THREE.SpriteMaterial({ color: new THREE.Color(3, 2.6, 1.6), toneMapped: false, transparent: true });
  for (const [x, y, z] of [[.1, .19, .05], [-.15, .1, .12], [.2, .08, -.1]]) { const sp = new THREE.Sprite(glint); sp.scale.set(.035, .035, 1); sp.position.set(x, y, z); g.add(sp); }
  for (let i = 0; i < 14; i++) { const c = cyl(.04, .04, .012, gm, Math.sin(i * 2.4) * (.3 + (i % 3) * .06), .006, Math.cos(i * 1.9) * (.28 + (i % 2) * .08), g, 8); c.rotation.set(i * .3, 0, i * .2); }
  lathe([[.34, 0], [.28, .07], [.17, .14], [.06, .19], [0, .2]], gm, 12, g, 'gold', 2);
  for (const [x, z, h] of [[.28, .2, .06], [-.3, .1, .1], [.2, -.22, .04]]) cyl(.07, .07, h, gm, x, h / 2, z, g, 10);
  return { w: .7, d: .7 };
};
B.sack = (g) => {
  const m = T('sack', { rough: 1, color: 0xc8b49a });
  const s = lathe([[.0, 0], [.25, .01], [.3, .15], [.28, .35], [.18, .5], [.07, .56], [.09, .64], [.05, .66]], m, 12, g, 'sack', 1.8);
  s.scale.set(1, 1, .85);
  cyl(.075, .075, .03, plain(0x5e4a33), 0, .56, 0, g, 8);
  return { w: .6, d: .52 };
};
B.woodpile = (g) => {
  const bark = T('bark'), end = M('log_end');
  const rows = [[-.24, 0, .24], [-.12, .12], [0]];
  rows.forEach((xs, r) => xs.forEach((x) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .78, 9), [bark, end, end]);
    m.rotation.z = Math.PI / 2; m.rotation.y = Math.PI / 2; m.position.set(x, .11 + r * .19, 0); m.castShadow = m.receiveShadow = true; g.add(m);
  }));
  return { w: .72, d: .78 };
};
function tableModel(g, w, d, h, opt = {}) {
  const top = T('wood', { rough: .6, color: 0xd8c0a8 }), dark = T('wood', { color: 0x8a7060 });
  box(w, .07, d, top, 0, h - .035, 0, g);
  box(w - .16, .08, .05, dark, 0, h - .11, d / 2 - .1, g); box(w - .16, .08, .05, dark, 0, h - .11, -d / 2 + .1, g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.08, h - .07, .08, dark, sx * (w / 2 - .1), (h - .07) / 2, sz * (d / 2 - .1), g);
  if (w > 1.2) box(.06, .06, d - .24, dark, 0, .14, 0, g);
}
const pewter = () => plain(0xa9a8b4, { metal: .5, rough: .4 });
B.table_long = (g) => { tableModel(g, 1.86, .76, .52); return { w: 1.86, d: .76 }; };
B.table_long_set = (g) => {
  tableModel(g, 1.86, .76, .52);
  const pl = pewter(), cl = M('clay', { rough: .7 });
  for (const x of [-.62, 0, .62]) {
    const p = cyl(.12, .1, .025, pl, x, .535, .08, g, 14);
    cyl(.045, .04, .11, cl, x + .2, .58, -.1, g, 8);
  }
  const bread = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 6), plain(0xc98a48)); bread.scale.set(1.5, .7, 1); bread.position.set(-.3, .56, -.16); bread.castShadow = true; g.add(bread);
  cyl(.05, .07, .05, pl, .32, .545, -.2, g, 8); cyl(.025, .025, .14, plain(0xeadfc6), .32, .64, -.2, g, 6);
  flame(g, .32, .71, -.2, .45);
  return { w: 1.86, d: .76 };
};
B.bench = (g) => {
  const top = T('wood', { rough: .6, color: 0xd8c0a8 }), dark = T('wood', { color: 0x8a7060 });
  box(1.8, .06, .32, top, 0, .3, 0, g);
  for (const sx of [-1, 1]) { box(.06, .27, .26, dark, sx * .72, .135, 0, g); }
  box(1.3, .05, .05, dark, 0, .12, 0, g);
  return { w: 1.8, d: .32 };
};
B.table_small = (g, dice) => {
  const top = T('wood', { rough: .6, color: 0xd8c0a8 }), dark = T('wood', { color: 0x8a7060 });
  cyl(.38, .38, .06, top, 0, .5, 0, g, 14); cyl(.06, .08, .47, dark, 0, .24, 0, g, 8); cyl(.24, .26, .04, dark, 0, .02, 0, g, 10);
  if (dice === true) {
    const dm = plain(0xe8dcc4);
    box(.035, .035, .035, dm, .1, .548, .05, g).rotation.y = .5; box(.035, .035, .035, dm, -.02, .548, .12, g).rotation.y = 1.1;
    cyl(.05, .04, .1, M('clay'), -.18, .58, -.1, g, 8); cyl(.05, .04, .1, M('clay'), .2, .58, -.12, g, 8);
    for (let i = 0; i < 5; i++) cyl(.035, .035, .012, T('gold', { metal: .5, rough: .4 }), -.08 + i * .015, .536 + i * .012, -.04, g, 8);
  } else {
    cyl(.05, .065, .05, pewter(), .05, .555, 0, g, 8); cyl(.025, .025, .13, plain(0xeadfc6), .05, .64, 0, g, 6); flame(g, .05, .7, 0, .45);
  }
  return { w: .78, d: .78 };
};
B.table_dice = (g) => B.table_small(g, true);
B.stool = (g) => {
  const top = T('wood', { rough: .6, color: 0xd8c0a8 }), dark = T('wood', { color: 0x8a7060 });
  cyl(.19, .19, .05, top, 0, .33, 0, g, 12);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + .5; const l = box(.045, .32, .045, dark, Math.cos(a) * .12, .155, Math.sin(a) * .12, g); l.rotation.set(Math.sin(a) * .12, 0, -Math.cos(a) * .12); }
  return { w: .4, d: .4 };
};
B.high_seat = (g) => {
  const w = T('wood', { rough: .55 }), dark = T('wood', { color: 0x8a7060 }), red = T('cloth_red', { rough: 1 }), gold = plain(0xdba133, { metal: .6, rough: .35 });
  box(.74, .1, .6, w, 0, .42, .05, g);
  box(.62, .07, .5, red, 0, .5, .08, g);
  for (const sx of [-1, 1]) {
    box(.09, .42, .09, dark, sx * .32, .21, .3, g); box(.09, .42, .09, dark, sx * .32, .21, -.2, g);
    box(.08, .06, .55, w, sx * .34, .72, .06, g); box(.06, .26, .06, dark, sx * .34, .58, .3, g);
  }
  box(.74, 1.28, .1, w, 0, 1.08, -.24, g);
  box(.56, .86, .03, red, 0, 1.0, -.18, g);
  for (const sx of [-1, 1]) { const f = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), gold); f.position.set(sx * .32, 1.78, -.24); f.castShadow = true; g.add(f); }
  const crest = new THREE.Mesh(new THREE.ConeGeometry(.12, .2, 4), gold); crest.position.set(0, 1.82, -.24); crest.rotation.y = .785; crest.castShadow = true; g.add(crest);
  return { w: .76, d: .62 };
};
B.shelf = (g) => {
  const w = T('wood', { color: 0xc8a888 }), dark = T('wood', { color: 0x806050 });
  const W = .9, D = .36, H = 1.55;
  box(.06, H, D, w, -W / 2 + .03, H / 2, 0, g); box(.06, H, D, w, W / 2 - .03, H / 2, 0, g);
  box(W, .06, D, w, 0, H - .03, 0, g); box(W - .1, H - .1, .03, dark, 0, H / 2, -D / 2 + .02, g);
  const levels = [.08, .46, .84, 1.2];
  for (const y of levels) box(W - .1, .04, D - .02, w, 0, y, 0, g);
  const books = M('books', { rough: .9 }); books.map.__name = 'books';
  for (const y of [.86, 1.22]) { const b = box(W - .14, .3, .2, books, 0, y + .17, -.03, g, 'books'); }
  for (let i = 0; i < 4; i++) { const r = .07 + (i % 2) * .02; cyl(r, r * .9, .18 + (i % 3) * .04, M('clay', { rough: .6 }), -.3 + i * .2, .49 + .1, 0, g, 10); }
  for (let i = 0; i < 3; i++) { const s = box(.22, .22, .22, M('crate'), -.27 + i * .27, .1 + .11, 0, g); s.scale.set(1, .9, 1); }
  return { w: W, d: D };
};
B.bed = (g) => {
  const w = T('wood', { rough: .6 }), dark = T('wood', { color: 0x8a7060 }), lin = T('cloth_linen', { rough: 1 }), bl = T('cloth_teal', { rough: 1 });
  const L = 1.86, W = .82;
  box(W, .2, L, dark, 0, .18, 0, g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.08, .3, .08, dark, sx * (W / 2 - .04), .15, sz * (L / 2 - .04), g);
  box(W - .06, .14, L - .1, lin, 0, .35, 0, g);
  const blanket = box(W - .02, .06, L * .64, bl, 0, .43, L * .17, g);
  box(W - .02, .14, .05, bl, 0, .37, L / 2 - .02, g);
  const pil = new THREE.Mesh(new THREE.BoxGeometry(.56, .1, .26, 2, 1, 2), lin); pil.position.set(0, .46, -L / 2 + .24); pil.castShadow = true; g.add(pil);
  box(W, .78, .08, w, 0, .39, -L / 2 + .04, g); box(W, .1, .1, dark, 0, .8, -L / 2 + .04, g);
  box(W, .42, .07, w, 0, .21, L / 2 - .03, g);
  return { w: W, d: L };
};
B.weapon_rack = (g) => {
  const w = T('wood', { rough: .6 }), iron = plain(0x9a99a8, { metal: .6, rough: .35 }), grip = plain(0x4a2a20);
  for (const sx of [-1, 1]) box(.07, 1.3, .07, w, sx * .36, .65, -.08, g);
  box(.8, .06, .08, w, 0, 1.18, -.08, g); box(.8, .06, .2, w, 0, .26, 0, g); box(.8, .06, .2, w, 0, .05, 0, g);
  for (const x of [-.22, 0, .22]) {
    cyl(.018, .018, 1.4, w, x, .72, -.02, g, 6); const tip = new THREE.Mesh(new THREE.ConeGeometry(.04, .16, 4), iron); tip.position.set(x, 1.5, -.02); tip.castShadow = true; g.add(tip);
  }
  const sword = box(.05, .85, .015, iron, .31, .7, .04, g); box(.18, .03, .04, plain(0xb16f1f, { metal: .5 }), .31, .3, .04, g); box(.035, .16, .035, grip, .31, .2, .04, g);
  return { w: .82, d: .3 };
};
B.armour_stand = (g) => {
  const w = T('wood', { rough: .6 }), steel = T('iron', { metal: .55, rough: .35 }), dark = T('iron_dark', { metal: .5, rough: .5 });
  cyl(.24, .26, .06, w, 0, .03, 0, g, 12); cyl(.03, .03, .55, w, 0, .3, 0, g, 6);
  const torso = lathe([[.13, 0], [.2, .12], [.22, .35], [.24, .5], [.2, .58], [.08, .62]], steel, 12, g, 'iron', 1.4); torso.position.y = .52; torso.scale.set(1, 1, .72);
  const skirt = lathe([[.24, 0], [.2, .2], [.14, .25]], dark, 12, g, 'iron_dark', 1.4); skirt.position.y = .32; skirt.scale.set(1, 1, .72);
  for (const sx of [-1, 1]) { const p = new THREE.Mesh(new THREE.SphereGeometry(.11, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), steel); p.position.set(sx * .24, 1.04, 0); p.scale.set(1, .7, .9); p.castShadow = true; g.add(p); }
  const helm = new THREE.Mesh(new THREE.CylinderGeometry(.12, .13, .22, 12), steel); helm.position.set(0, 1.27, 0); helm.castShadow = true; g.add(helm);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), steel); dome.position.set(0, 1.38, 0); g.add(dome);
  box(.18, .025, .01, plain(0x141218), 0, 1.29, .125, g);
  return { w: .5, d: .36 };
};
B.statue = (g) => {
  // pale polished stone on a tall moulded plinth, so it reads as a statue and not a person standing there
  const st = new THREE.MeshStandardMaterial({ color: 0xd6d0c6, roughness: .55, emissive: new THREE.Color(0x24201c) }), blk = T('stone_block', { rough: .95 });
  box(.62, .08, .5, blk, 0, .04, 0, g); box(.5, .3, .4, blk, 0, .23, 0, g); box(.62, .06, .52, blk, 0, .35, 0, g);
  const robe = lathe([[.24, 0], [.2, .4], [.17, .7], [.2, .86], [.1, .94]], st, 12, g, 'stone_smooth', 1.3); robe.position.y = .38; robe.scale.set(1, 1, .75);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), st); head.position.set(0, 1.4, 0); head.castShadow = true; g.add(head);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(.125, 10, 8, 0, Math.PI * 2, 0, Math.PI * .6), st); hood.position.set(0, 1.42, -.02); g.add(hood);
  for (const sx of [-1, 1]) { const a = box(.08, .38, .1, st, sx * .2, 1.0, .06, g); a.rotation.x = -.5; a.rotation.z = sx * .15; }
  box(.05, .9, .02, st, 0, .95, .2, g); box(.26, .04, .05, st, 0, 1.1, .2, g);
  return { w: .74, d: .58 };
};
B.brazier = (g) => {
  const iron = T('iron_dark', { metal: .6, rough: .45 });
  for (let i = 0; i < 3; i++) { const a = i * 2.094; const l = box(.04, .62, .04, iron, Math.cos(a) * .15, .31, Math.sin(a) * .15, g); l.rotation.set(Math.sin(a) * .25, 0, -Math.cos(a) * .25); }
  const bowl = lathe([[.06, 0], [.2, .04], [.27, .14], [.29, .18]], iron, 14, g, 'iron_dark', 1.6); bowl.position.y = .58;
  const coal = new THREE.Mesh(new THREE.CircleGeometry(.25, 12), plain(0x3a1208, { emissive: 0xff4a10, ei: 1.6 })); coal.rotation.x = -Math.PI / 2; coal.position.y = .74; g.add(coal);
  flame(g, -.06, .72, .02, 1.25); flame(g, .08, .72, -.04, 1.0);
  return { w: .6, d: .6 };
};
B.fireplace = (g) => {
  const blk = T('stone_block', { rough: .95 }), cap = T('stone_smooth', { rough: .9, color: 0xc0b0a0 });
  box(.34, 1.0, .5, blk, -.78, .5, 0, g); box(.34, 1.0, .5, blk, .78, .5, 0, g);
  box(1.96, .16, .62, cap, 0, 1.08, 0, g); box(1.6, .42, .4, blk, 0, 1.37, -.06, g);
  box(1.3, .9, .08, plain(0x120a0a), 0, .45, -.22, g);
  box(1.86, .06, .7, cap, 0, .03, .06, g);
  const bark = T('bark'), end = M('log_end');
  for (const [x, y, r] of [[-.2, .14, .25], [.15, .14, -.2], [0, .3, .05]]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .7, 8), [bark, end, end]); m.rotation.z = Math.PI / 2; m.rotation.y = r; m.position.set(x, y, -.02); m.castShadow = true; g.add(m); }
  const em = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .2), plain(0x2a0c06, { emissive: 0xff5a18, ei: 1.4 })); em.rotation.x = -Math.PI / 2; em.position.set(0, .065, 0); g.add(em);
  flame(g, -.22, .2, 0, 1.5); flame(g, .1, .22, .02, 1.8); flame(g, .32, .2, -.02, 1.2);
  return { w: 1.96, d: .62 };
};
B.jug = (g) => { lathe([[0, 0], [.1, 0], [.14, .08], [.13, .18], [.06, .26], [.06, .3], [.08, .32]], M('clay', { rough: .6 }), 12, g, 'clay', .9); return { w: .3, d: .3 }; };
B.bucket = (g) => {
  const wv = T('wood_v', { rough: .8 }); lathe([[.15, 0], [.18, .3]], wv, 12, g, 'wood_v', 1.1);
  const bt = new THREE.Mesh(new THREE.CircleGeometry(.15, 12), M('wood')); bt.rotation.x = -Math.PI / 2; bt.position.y = .02; g.add(bt);
  const wt = new THREE.Mesh(new THREE.CircleGeometry(.165, 12), M('water', { rough: .2 })); wt.rotation.x = -Math.PI / 2; wt.position.y = .24; g.add(wt);
  for (const y of [.05, .25]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.155 + y * .1, .012, 4, 16), plain(0x4a4858, { metal: .5 })); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); }
  return { w: .38, d: .38 };
};
B.dropped_sword = (g) => {
  const iron = plain(0x9a99a8, { metal: .6, rough: .35 });
  const s = new THREE.Group(); g.add(s); s.rotation.y = .6;
  box(.05, .015, .8, iron, 0, .01, -.12, s); box(.2, .03, .04, plain(0xb16f1f, { metal: .5 }), 0, .02, .3, s); box(.04, .03, .15, plain(0x4a2a20), 0, .02, .4, s);
  return { w: .5, d: .5 };
};
// ---- new pieces for lighting moods and outdoor rooms
B.candelabra = (g) => {
  const iron = T('iron_dark', { metal: .6, rough: .4 });
  cyl(.16, .2, .05, iron, 0, .025, 0, g, 10); cyl(.025, .03, 1.15, iron, 0, .6, 0, g, 6);
  box(.6, .03, .03, iron, 0, 1.12, 0, g);
  for (const x of [-.28, 0, .28]) { const h = x === 0 ? .14 : 0; cyl(.04, .03, .04, iron, x, 1.15 + h, 0, g, 8); cyl(.022, .022, .12, plain(0xeadfc6), x, 1.22 + h, 0, g, 6); flame(g, x, 1.28 + h, 0, .45); }
  return { w: .62, d: .3 };
};
B.crystals = (g, seed = 1) => {
  const mat = new THREE.MeshStandardMaterial({ color: 0x6fd8e6, emissive: 0x2aa8c8, emissiveIntensity: .6, roughness: .25, metalness: .1, flatShading: true, transparent: true, opacity: .92 });
  const rnd = (k) => { const v = Math.sin(seed * 91.7 + k * 12.9898) * 43758.5453; return v - Math.floor(v); };
  for (let i = 0; i < 7; i++) {
    const h = .35 + rnd(i) * .75, r = .07 + rnd(i + 9) * .07;
    const c = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), mat); c.scale.set(r, h / 2, r);
    c.position.set((rnd(i + 3) - .5) * .5, h / 2 - .05, (rnd(i + 5) - .5) * .4); c.rotation.set((rnd(i + 7) - .5) * .7, rnd(i) * 3, (rnd(i + 11) - .5) * .7);
    c.castShadow = false; g.add(c);
  }
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.28, 0), T('stone_smooth', { color: 0x6a6070 })); rock.scale.set(1.2, .4, 1); rock.position.y = .04; rock.receiveShadow = true; g.add(rock);
  g.userData.lights = [{ x: 0, y: .6, z: .2, s: 1, color: 0x58d8f0 }];
  return { w: .6, d: .5 };
};
B.tree = (g, seed = 1) => {
  const bark = T('bark', { rough: 1 }), lv = T('leaves', { rough: 1 });
  const trunk = lathe([[.2, 0], [.13, .15], [.11, .9], [.09, 1.5]], bark, 9, g, 'bark', .8);
  const rnd = (k) => { const v = Math.sin(seed * 51.3 + k * 7.77) * 9999.1; return v - Math.floor(v); };
  const blobs = [[0, 2.05, 0, .72], [-.42, 1.75, .1, .5], [.45, 1.8, -.05, .52], [.1, 1.62, .38, .45], [-.1, 1.7, -.38, .46], [.05, 2.5, .02, .45]];
  for (const [x, y, z, r] of blobs) {
    const geo = new THREE.IcosahedronGeometry(r, 3); const pp = geo.attributes.position;
    for (let k = 0; k < pp.count; k++) { const v = new THREE.Vector3().fromBufferAttribute(pp, k); const n = 1 + .12 * Math.sin(v.x * 23 + seed) * Math.cos(v.y * 19) + .08 * Math.sin(v.z * 31); pp.setXYZ(k, v.x * n, v.y * n, v.z * n); }
    geo.computeVertexNormals(); const b = new THREE.Mesh(geo, lv); b.position.set(x, y, z);
    b.rotation.set(rnd(x * 10 + 1) * 3, rnd(y * 10) * 3, 0); b.castShadow = b.receiveShadow = true; g.add(b);
  }
  // leaf cards break the silhouette: small alpha clumps scattered over the canopy surface
  const cardMat = new THREE.MeshStandardMaterial({ map: tex('m/leafcard'), alphaTest: .5, side: THREE.DoubleSide, roughness: 1 });
  let k = 0;
  for (const [x, y, z, r] of blobs) for (let i = 0; i < 9; i++, k++) {
    const th = rnd(k + 3) * 6.28, ph = rnd(k + 7) * 2.4 - .6;
    const card = new THREE.Mesh(new THREE.PlaneGeometry(.42, .42), cardMat);
    card.position.set(x + Math.cos(th) * Math.cos(ph) * r * 1.02, y + Math.sin(ph) * r * .95, z + Math.sin(th) * Math.cos(ph) * r * 1.02);
    card.rotation.set(-.5 + rnd(k) * .4, th, rnd(k + 1) * 3); card.castShadow = true; g.add(card);
  }
  return { w: 1.4, d: 1.4 };
};
B.tufts = (g, n = 30, w = 1, d = 1, seed = 3) => {
  const mat = new THREE.MeshStandardMaterial({ map: tex('m/tuft'), alphaTest: .5, side: THREE.DoubleSide, roughness: 1 });
  const rnd = (k) => { const v = Math.sin(seed * 33.1 + k * 4.7) * 9999.1; return v - Math.floor(v); };
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(.5, .375), mat); m.position.set((rnd(i) - .5) * w, .18, (rnd(i + 50) - .5) * d); m.rotation.y = (rnd(i + 9) - .5) * .8; g.add(m);
  }
  return { w, d };
};
B.well = (g) => {
  const blk = T('stone_block', { rough: .95 }), w = T('wood', { rough: .7 });
  const ring = lathe([[.48, 0], [.48, .5]], blk, 16, g, 'stone_block', 3);
  ring.material = blk; ring.material.side = THREE.DoubleSide;
  const inner = new THREE.Mesh(new THREE.CircleGeometry(.47, 16), M('water', { rough: .15, color: 0x80a0a0 })); inner.rotation.x = -Math.PI / 2; inner.position.y = .3; g.add(inner);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.48, .06, 4, 16), T('stone_smooth', { color: 0xc0b0a0 })); rim.rotation.x = Math.PI / 2; rim.position.y = .52; rim.castShadow = true; g.add(rim);
  for (const sx of [-1, 1]) box(.08, 1.15, .08, w, sx * .48, .9, 0, g);
  const roof = new THREE.Group(); roof.position.y = 1.5; g.add(roof);
  for (const sz of [-1, 1]) { const p = box(1.2, .05, .5, T('board', { rough: .8 }), 0, 0, sz * .2, roof); p.rotation.x = sz * .55; }
  const axle = cyl(.04, .04, .9, w, 0, 1.32, 0, g, 6); axle.rotation.z = Math.PI / 2;
  cyl(.11, .09, .16, T('wood_v'), .1, .95, 0, g, 10);
  return { w: 1.2, d: 1.2 };
};
B.planter = (g, seed = 2) => {
  const blk = T('stone_block', { rough: .95 });
  box(1.8, .26, .5, blk, 0, .13, 0, g);
  const soil = box(1.7, .02, .42, plain(0x3e2c22), 0, .265, 0, g);
  const lv = T('leaves', { rough: 1, flat: true });
  const cols = [0xd4604a, 0xf2cd5a, 0xdccdb2, 0xb06ac0];
  for (let i = 0; i < 6; i++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 0), lv); b.position.set(-.7 + i * .28, .38, (i % 2) * .08 - .04); b.scale.set(1, .8, 1); b.castShadow = true; g.add(b);
    const f = new THREE.Mesh(new THREE.IcosahedronGeometry(.045, 0), plain(cols[(i + seed) % 4], { rough: .9 })); f.position.set(-.66 + i * .28, .5, .05); g.add(f);
  }
  return { w: 1.8, d: .5 };
};
B.hay = (g) => {
  // a hay bale: striated straw texture, two twine bands, loose straws on top and at the foot
  if (!B._hayTex) { const c = document.createElement('canvas'); c.width = 32; c.height = 16; const x = c.getContext('2d'); const cols = ['#a8863e', '#c4a052', '#d8b868', '#8c6c30', '#e6cc80'];
    for (let i = 0; i < 160; i++) { x.fillStyle = cols[i % 5]; const y = (i * 7) % 16, xx = (i * 13) % 32; x.fillRect(xx, y, 3 + (i % 4), 1); }
    const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; B._hayTex = t; }
  const m = new THREE.MeshStandardMaterial({ map: B._hayTex, roughness: 1 });
  box(.8, .42, .52, m, 0, .21, 0, g);
  for (const x of [-.22, .22]) box(.025, .43, .53, plain(0x5a3c20), x, .21, 0, g);
  const s2 = plain(0xd8b868, { rough: 1 });
  for (let i = 0; i < 9; i++) { const l = box(.012, .012, .22, s2, -.3 + i * .075, .425, (i % 3 - 1) * .1, g); l.rotation.y = i * .7; l.rotation.z = .2; }
  for (let i = 0; i < 6; i++) { const l = box(.012, .012, .18, s2, -.3 + i * .12, .006, .33, g); l.rotation.y = i * 1.1; }
  return { w: .8, d: .55 };
};
B.cart = (g) => {
  const w = T('wood', { rough: .7 }), bd = T('board');
  box(1.1, .08, .7, bd, 0, .5, 0, g); for (const sz of [-1, 1]) box(1.1, .25, .05, bd, 0, .66, sz * .33, g); box(.05, .25, .7, bd, -.53, .66, 0, g);
  for (const sz of [-1, 1]) { const wh = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .06, 12), w); wh.rotation.x = Math.PI / 2; wh.position.set(.1, .3, sz * .4); wh.castShadow = true; g.add(wh); }
  const pole = box(.9, .05, .05, w, .95, .35, 0, g); pole.rotation.z = .25;
  for (let i = 0; i < 3; i++) { const s = new THREE.Group(); s.position.set(-.25 + i * .25, .54, 0); g.add(s); B.sack(s); s.scale.set(.7, .6, .7); }
  return { w: 1.3, d: .9 };
};

B.shield = (g) => {
  const c = document.createElement('canvas'); c.width = c.height = 20; const x = c.getContext('2d');
  x.fillStyle = '#8a2632'; x.fillRect(0, 0, 20, 20); x.fillStyle = '#d4a033'; x.fillRect(8, 0, 4, 20); x.fillRect(0, 8, 20, 4);
  x.fillStyle = '#5e1a28'; x.fillRect(0, 16, 20, 4); x.fillStyle = '#b9b8c4'; x.fillRect(8, 8, 4, 4);
  const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.MeshStandardMaterial({ map: t, roughness: .7 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .05, 18), [T('iron', { metal: .5, rough: .4 }), face, face]); m.rotation.x = Math.PI / 2; m.castShadow = true; g.add(m);
  const boss = new THREE.Mesh(new THREE.SphereGeometry(.06, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), plain(0xb9b8c4, { metal: .6, rough: .3 })); boss.rotation.x = Math.PI / 2; boss.position.z = .025; g.add(boss);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.28, .02, 4, 20), plain(0x686778, { metal: .6, rough: .4 })); rim.position.z = .02; g.add(rim);
  return { w: .6, d: .1 };
};
B.dummy = (g) => {
  const w = T('wood', { rough: .7 }), sk = T('sack', { rough: 1, color: 0xc8b49a });
  box(.5, .06, .5, w, 0, .03, 0, g); box(.08, 1.3, .08, w, 0, .7, 0, g); box(.7, .07, .07, w, 0, 1.05, 0, g);
  const body = lathe([[.12, 0], [.2, .1], [.22, .35], [.16, .5], [.06, .55]], sk, 10, g, 'sack', 1.3); body.position.y = .62;
  const head = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), sk); head.position.y = 1.3; head.castShadow = true; g.add(head);
  for (const y of [.72, .95]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.2, .015, 4, 14), plain(0x5e4a33)); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); }
  return { w: .7, d: .5 };
};
B.runner = (g, len = 4, w = 1) => {
  const c = document.createElement('canvas'); c.width = 32; c.height = 32; const x = c.getContext('2d');
  x.fillStyle = '#8a2632'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#5e1a28'; x.fillRect(0, 0, 32, 2); x.fillRect(0, 30, 32, 2);
  x.fillStyle = '#dba133'; x.fillRect(3, 0, 1, 32); x.fillRect(28, 0, 1, 32); x.fillStyle = '#b23a3a';
  for (let i = 0; i < 4; i++) { x.fillRect(12, i * 8 + 2, 8, 4); } x.fillStyle = '#dba133'; for (let i = 0; i < 4; i++) x.fillRect(15, i * 8 + 3, 2, 2);
  const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, len);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshStandardMaterial({ map: t, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.y = .01; m.receiveShadow = true; g.add(m);
  return { w, d: len };
};
B.straw = (g, seed = 4) => {
  // a loose heap of straw: strands laid over a low mound, lighter on top, a few blown off to the sides
  const cols = [0xa88840, 0xc4a052, 0xd8b868, 0xe6cc80, 0x8c6c30].map((c) => plain(c, { rough: 1 }));
  const rr = (i) => { const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return v - Math.floor(v); };
  const base = new THREE.Mesh(new THREE.SphereGeometry(.36, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), cols[0]); base.scale.set(1.15, .22, .85); base.receiveShadow = true; g.add(base);
  for (let i = 0; i < 70; i++) { const a = rr(i) * Math.PI * 2, d = Math.sqrt(rr(i + 100)) * .42, x = Math.cos(a) * d * 1.15, z = Math.sin(a) * d * .85;
    const h = Math.max(0, .08 * (1 - (d / .42) ** 2)) + .008, top = d < .25;
    const b = box(.014, .01, .16 + rr(i + 200) * .12, cols[top ? 2 + (i % 3 === 0 ? 1 : 0) : i % 5], x, h, z, g); b.rotation.set(0, rr(i + 300) * Math.PI, (rr(i + 400) - .5) * .5); b.castShadow = false; }
  for (let i = 0; i < 8; i++) { const a = rr(i + 500) * Math.PI * 2, d = .45 + rr(i + 600) * .12; const b = box(.014, .008, .14, cols[i % 4], Math.cos(a) * d, .005, Math.sin(a) * d * .8, g); b.rotation.y = rr(i + 700) * 3; }
  return { w: .9, d: .7 };
};
B.bones = (g, seed = 1) => {
  // a skeleton slumped on the floor: skull, spine, ribs, pelvis, limbs, plus a few loose bones
  const b = plain(0xe2d8c2, { rough: .8 }), bd = plain(0xb8ad96, { rough: .9 });
  const grp = new THREE.Group(); grp.rotation.y = (seed * 1.7) % 6.28; g.add(grp);
  const sk = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 8), b); sk.scale.set(.9, .85, 1.1); sk.position.set(0, .06, -.3); sk.castShadow = true; grp.add(sk);
  const jaw = box(.08, .025, .06, b, 0, .02, -.25, grp);
  for (const sx of [-1, 1]) box(.022, .022, .01, plain(0x1a1210), sx * .028, .075, -.218, grp);   // eye sockets
  box(.025, .025, .42, bd, 0, .02, -.02, grp);                                                  // spine
  for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.085 - i * .006, .009, 4, 10, Math.PI), b); r.scale.set(1, .55, 1); r.position.set(0, .015, -.17 + i * .045); r.castShadow = true; grp.add(r); }
  box(.16, .04, .07, b, 0, .025, .2, grp);                                                       // pelvis
  const limb = (x, z, len, rot) => { const l = box(.022, .022, len, b, x, .014, z, grp); l.rotation.y = rot; const k = new THREE.Mesh(new THREE.SphereGeometry(.018, 6, 4), b); k.position.set(x + Math.sin(rot) * len / 2, .018, z + Math.cos(rot) * len / 2); grp.add(k); };
  limb(-.06, .35, .3, .15); limb(.07, .34, .3, -.25); limb(-.15, -.08, .26, .6); limb(.15, -.1, .24, -.9);
  for (let i = 0; i < 3; i++) { const l = box(.02, .02, .14, bd, .25 - i * .08, .012, .3 - i * .1, g); l.rotation.y = i * 1.3 + seed; }
  return { w: .5, d: .8 };
};
B.shield_stack = (g) => {
  for (let i = 0; i < 3; i++) { const s = new THREE.Group(); B.shield(s); s.position.set(-.18 + i * .18, .3, -.02 + i * .03); s.rotation.x = -.25; s.scale.setScalar(.95); g.add(s); }
  return { w: .8, d: .3 };
};

// ---- pieces for generated buildings (one per dressing slot)
B.table_run = (g, len = 1, set = false) => {
  const L = len - .12; tableModel(g, L, .78, .52);
  if (set) { const pl = pewter(), cl = M('clay', { rough: .7 });
    for (let x = -L / 2 + .35; x < L / 2 - .2; x += .55) { cyl(.11, .09, .022, pl, x, .533, .14, g, 12); cyl(.04, .035, .1, cl, x + .18, .575, -.12, g, 8); } }
  return { w: L, d: .78 };
};
B.cot = (g) => {
  const dark = T('wood', { color: 0x8a7060 }), lin = T('cloth_linen', { rough: 1 }), bl = T('cloth_teal', { rough: 1 });
  box(.72, .16, .94, dark, 0, .14, 0, g); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.06, .22, .06, dark, sx * .33, .11, sz * .44, g);
  box(.66, .1, .88, lin, 0, .27, 0, g); box(.68, .05, .56, bl, 0, .34, .17, g); box(.46, .08, .2, lin, 0, .35, -.3, g);
  return { w: .72, d: .94 };
};
B.rubble = (g, seed = 1) => {
  // fallen masonry: a few squared blocks broken off a wall, chips around them, a pale dust patch
  const st = T('stone_block', { color: 0xb0a49c, rough: .95 }), ch = T('stone_smooth', { color: 0x8c8078, flat: true });
  const rr = (i) => Math.sin(i * 12.9898 + seed * 78.233) * .5 + .5;
  const dust = new THREE.Mesh(new THREE.CircleGeometry(.42, 12), plain(0x8a7c70, { rough: 1 })); dust.rotation.x = -Math.PI / 2; dust.position.y = .004; dust.receiveShadow = true; g.add(dust);
  const blocks = [[-.16, .12, .34, .2, .22, .1], [.18, -.1, .3, .18, .2, .5], [.02, .22, .24, .16, .18, -.4], [-.05, -.05, .26, .14, .2, .9]];
  blocks.forEach(([x, z, w, h, d, r], i) => { const m = box(w, h, d, st, x, h / 2 + (i === 3 ? .12 : 0), z, g); m.rotation.set(rr(i) * .3 - .15, r, (i === 3 ? .5 : rr(i + 9) * .2)); });
  for (let i = 0; i < 9; i++) { const r = .03 + rr(i + 20) * .05; const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), ch);
    m.position.set((rr(i + 30) - .5) * .8, r * .6, (rr(i + 40) - .5) * .75); m.rotation.set(i, i * 2, 0); m.castShadow = true; g.add(m); }
  return { w: .8, d: .8 };
};
B.wardrobe = (g) => {
  const w = T('wood', { rough: .6 }), dk = T('wood', { color: 0x806050 });
  box(.86, 1.6, .5, w, 0, .8, 0, g); box(.9, .08, .54, dk, 0, 1.64, 0, g); box(.02, 1.4, .02, dk, 0, .8, .26, g);
  for (const sx of [-1, 1]) box(.03, .1, .03, plain(0xdba133, { metal: .5 }), sx * .06, .85, .27, g);
  return { w: .9, d: .54 };
};
B.desk = (g) => {
  const w = T('wood', { rough: .5, color: 0xd8c0a8 }), dk = T('wood', { color: 0x8a7060 });
  box(.9, .06, .5, w, 0, .55, 0, g); box(.3, .52, .46, dk, .28, .26, 0, g); for (const sx of [-1]) for (const sz of [-1, 1]) box(.06, .52, .06, dk, sx * .4, .26, sz * .2, g);
  box(.28, .02, .2, plain(0xe8dcc4), -.1, .59, .02, g); cyl(.03, .03, .06, plain(0x241a1a), .15, .61, -.1, g, 6);
  return { w: .9, d: .5 };
};
B.tub = (g) => { const wv = T('wood_v'); const t = lathe([[.36, 0], [.4, .4]], wv, 14, g, 'wood_v', 2.4); t.material.side = THREE.DoubleSide; t.scale.set(1, 1, .7);
  const w = new THREE.Mesh(new THREE.CircleGeometry(.37, 14), M('water', { rough: .15 })); w.rotation.x = -Math.PI / 2; w.scale.set(1, .7, 1); w.position.y = .3; g.add(w); return { w: .8, d: .56 }; };
B.anvil = (g) => { const ir = T('iron_dark', { metal: .6, rough: .4 }); box(.3, .3, .3, M('wood'), 0, .15, 0, g); box(.14, .14, .18, ir, 0, .37, 0, g); box(.5, .12, .2, ir, 0, .5, 0, g);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(.08, .22, 8), ir); horn.rotation.z = Math.PI / 2; horn.position.set(.35, .5, 0); g.add(horn); return { w: .7, d: .3 }; };
B.column = (g, h = 2.3) => { const st = T('stone_block', { rough: .95, color: 0xd0c4bc }); box(.5, .14, .5, st, 0, .07, 0, g); cyl(.17, .19, h - .3, T('stone_smooth', { color: 0xc8bcb4 }), 0, .14 + (h - .3) / 2, 0, g, 12); box(.46, .16, .46, st, 0, h - .08, 0, g); return { w: .5, d: .5 }; };
B.pallet = (g) => { box(.7, .08, .9, plain(0xb89a50, { rough: 1 }), 0, .04, 0, g); box(.6, .06, .5, T('cloth_linen', { rough: 1 }), 0, .1, .1, g); return { w: .7, d: .9 }; };
B.range = (g) => B.fireplace(g);
B.font = (g) => { const st = T('stone_smooth', { color: 0xd0c8c0 }); cyl(.12, .16, .5, st, 0, .25, 0, g, 10); const bowl = lathe([[.1, 0], [.3, .08], [.34, .2]], st, 14, g, 'stone_smooth', 2); bowl.position.y = .48; bowl.material.side = THREE.DoubleSide;
  const w = new THREE.Mesh(new THREE.CircleGeometry(.3, 14), M('water', { rough: .1 })); w.rotation.x = -Math.PI / 2; w.position.y = .64; g.add(w); return { w: .68, d: .68 }; };
B.manger = (g) => { const w = T('wood', { rough: .8 }); box(.9, .08, .45, w, 0, .4, 0, g); for (const sz of [-1, 1]) { const b = box(.9, .3, .04, w, 0, .55, sz * .22, g); b.rotation.x = sz * .3; }
  box(.8, .1, .36, plain(0xc8a858, { rough: 1 }), 0, .47, 0, g); for (const sx of [-1, 1]) box(.06, .4, .4, w, sx * .42, .2, 0, g); return { w: .9, d: .5 }; };
B.lectern = (g) => { const w = T('wood', { rough: .6 }); box(.36, .06, .36, w, 0, .03, 0, g); box(.1, .9, .1, w, 0, .48, 0, g); const top = box(.46, .05, .36, w, 0, .96, 0, g); top.rotation.x = .4;
  const bk = box(.38, .03, .28, plain(0xe8dcc4), 0, 1.0, .01, g); bk.rotation.x = .4; return { w: .46, d: .4 }; };
B.altar = (g) => { const st = T('stone_block', { rough: .9, color: 0xe0d6cc }); box(1.0, .8, .55, st, 0, .4, 0, g); box(1.08, .06, .62, T('stone_smooth', { color: 0xe8e0d8 }), 0, .83, 0, g);
  box(.9, .02, .5, T('cloth_red', { rough: 1 }), 0, .87, 0, g); box(.9, .3, .01, T('cloth_red', { rough: 1 }), 0, .72, .282, g);
  for (const sx of [-1, 1]) { cyl(.03, .04, .04, plain(0xdba133, { metal: .6 }), sx * .35, .9, -.1, g, 8); cyl(.02, .02, .14, plain(0xeadfc6), sx * .35, .99, -.1, g, 6); flame(g, sx * .35, 1.05, -.1, .45); }
  return { w: 1.08, d: .62 };
};
B.pew = (g) => { const w = T('wood', { rough: .6, color: 0xc8a888 }); box(.95, .06, .34, w, 0, .32, 0, g); box(.95, .5, .05, w, 0, .58, -.15, g); for (const sx of [-1, 1]) box(.05, .78, .38, w, sx * .45, .39, 0, g); return { w: .95, d: .38 }; };
B.tomb = (g) => {
  // sarcophagus: stepped plinth, chest with recessed carved panels, chamfered lid, effigy of a knight lying with hands folded on a sword
  const st = T('stone_block', { rough: .95, color: 0xb8b0ac }), sm = T('stone_smooth', { color: 0xd4ccc6, rough: .8 }), dk = T('stone_smooth', { color: 0x7c7470, rough: .9 });
  box(.9, .08, 1.0, st, 0, .04, 0, g); box(.8, .46, .92, sm, 0, .31, 0, g);
  for (const sx of [-1, 1]) for (const z of [-.24, .24]) box(.012, .26, .34, dk, sx * .401, .31, z, g);
  for (const sz of [-1, 1]) box(.6, .26, .012, dk, 0, .31, sz * .461, g);
  box(.86, .06, .98, st, 0, .57, 0, g); box(.8, .04, .92, sm, 0, .62, 0, g);
  const ef = T('stone_smooth', { color: 0xe2dad2, rough: .75 });
  box(.28, .05, .16, ef, 0, .665, -.36, g);                                        // pillow
  const head = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 8), ef); head.scale.set(1, .8, 1.1); head.position.set(0, .7, -.34); head.castShadow = true; g.add(head);
  box(.26, .07, .5, ef, 0, .675, -.02, g);                                         // body under a robe
  box(.2, .05, .2, ef, 0, .66, .3, g);                                             // legs
  for (const sx of [-1, 1]) box(.07, .06, .06, ef, sx * .05, .67, .42, g);        // feet
  box(.03, .02, .5, T('stone_smooth', { color: 0xc8c0b8 }), 0, .72, .1, g);        // sword
  box(.14, .02, .03, T('stone_smooth', { color: 0xc8c0b8 }), 0, .72, -.12, g);     // crossguard
  box(.12, .05, .08, ef, 0, .72, -.15, g);                                         // hands
  return { w: .9, d: 1.0 };
};
B.chains = (g) => { const ir = plain(0x4a4858, { metal: .6, rough: .4 }); for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.TorusGeometry(.035, .01, 4, 8), ir); l.position.set(sx * .18, 1.25 - i * .07, .02); l.rotation.y = i % 2 ? Math.PI / 2 : 0; g.add(l); }
  for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.TorusGeometry(.06, .015, 4, 10), ir); c.position.set(sx * .18, .8, .03); g.add(c); } return { w: .5, d: .08 }; };
B.wine_rack = (g) => { const w = T('wood', { rough: .7 }); box(.9, 1.1, .4, w, 0, .55, 0, g); const bt = plain(0x2a4a2a, { rough: .3, metal: .2 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const b = cyl(.06, .06, .05, bt, -.3 + c * .2, .2 + r * .24, .2, g, 8); b.rotation.x = Math.PI / 2; } return { w: .9, d: .4 }; };
B.skulls = (g) => { box(.8, .7, .1, plain(0x120c0e), 0, .75, -.02, g); const b = plain(0xe0d6c0, { rough: .8 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), b); s.position.set(-.27 + c * .18, .5 + r * .2, .05); s.castShadow = true; g.add(s); } return { w: .8, d: .12 }; };
B.cobweb = (g) => { const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'); x.strokeStyle = 'rgba(230,230,240,0.7)'; x.lineWidth = 1;
  for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(0, 0); x.lineTo(32 * Math.cos(i * .3), 32 * Math.sin(i * .3)); x.stroke(); } for (let r = 6; r < 32; r += 7) { x.beginPath(); x.arc(0, 0, r, 0, Math.PI / 2); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; const m = new THREE.Mesh(new THREE.PlaneGeometry(.7, .7), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  m.position.set(-.15, 1.9, -.4); g.add(m); return { w: .1, d: .1 }; };
B.portcullis = (g) => { const ir = plain(0x302e3b, { metal: .6, rough: .5 }); for (let i = 0; i < 6; i++) box(.04, .5, .04, ir, -.4 + i * .16, 2.0, 0, g); for (let j = 0; j < 2; j++) box(.9, .04, .04, ir, 0, 1.85 + j * .25, 0, g); return { w: .9, d: .1 }; };
B.rail = (g) => { const w = T('wood', { rough: .6 }); box(1, .06, .08, w, 0, .7, 0, g); for (const x of [-.4, 0, .4]) box(.05, .7, .05, w, x, .35, 0, g); return { w: 1, d: .1 }; };
B.tipped_stool = (g) => { const s = new THREE.Group(); B.stool(s); s.rotation.z = Math.PI / 2; s.position.set(.1, .19, 0); g.add(s); return { w: .4, d: .4 }; };
B.crate_sacks = (g) => { box(.62, .62, .62, M('crate'), -.12, .31, -.08, g); const s = new THREE.Group(); B.sack(s); s.position.set(.28, 0, .22); s.scale.setScalar(.8); g.add(s); return { w: .9, d: .8 }; };
B.door = (g, locked = false) => { const w = T('wood_v', { rough: .7 }); box(.9, 1.5, .08, w, 0, .75, 0, g); const ir = plain(0x4a4858, { metal: .5 });
  for (const y of [.3, 1.2]) box(.9, .07, .1, ir, 0, y, 0, g); box(.06, .1, .12, plain(0xdba133, { metal: .5 }), .3, .75, .02, g); if (locked) box(.14, .18, .12, plain(0xb16f1f, { metal: .5 }), .3, .62, .03, g); return { w: .9, d: .1 }; };

B.spikes = (g) => { const ir = plain(0x686778, { metal: .6, rough: .35 }); box(.8, .03, .8, plain(0x2a2830, { metal: .4 }), 0, .015, 0, g);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.04, .16, 4), ir); c.position.set(-.27 + i * .18, .1, -.27 + j * .18); c.castShadow = true; g.add(c); } return { w: .8, d: .8 }; };
// props modelled in Blender (kit/props3d.py): bevelled meshes with baked per-vertex ambient occlusion, same pixel textures
const GLB = {};
export const GLB_NAMES = ['barrel', 'chest', 'tree_1', 'tree_2', 'tree_3', 'sarcophagus', 'crate_sacks', 'stool', 'cot', 'weapon_rack', 'candelabra', 'brazier', 'fireplace', 'wardrobe', 'shelf', 'column', 'altar', 'portcullis', 'pew', 'well', 'statue'];
// The artifact viewer's sandbox refuses fetch() of data: URLs, so the embedded buffer is decoded here and the model is
// handed to the loader as a binary .glb in memory: nothing but the .json file itself is fetched
function toGLB(json) { const b64 = json.buffers[0].uri.split(',')[1], bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  delete json.buffers[0].uri; const pad4 = (n) => (n + 3) & ~3;
  const js = new TextEncoder().encode(JSON.stringify(json)), jl = pad4(js.length), bl = pad4(bin.length), out = new ArrayBuffer(12 + 8 + jl + 8 + bl), dv = new DataView(out), u8 = new Uint8Array(out);
  dv.setUint32(0, 0x46546C67, true); dv.setUint32(4, 2, true); dv.setUint32(8, out.byteLength, true);
  dv.setUint32(12, jl, true); dv.setUint32(16, 0x4E4F534A, true); u8.fill(0x20, 20, 20 + jl); u8.set(js, 20);
  const o = 20 + jl; dv.setUint32(o, bl, true); dv.setUint32(o + 4, 0x004E4942, true); u8.set(bin, o + 8); return out; }
export async function preloadGLB(names = GLB_NAMES) {
  const L = new GLTFLoader();
  await Promise.all(names.map((n) => fetch(hd2dAsset('glb/' + n + '.json?v=' + (globalThis.ASSET_V || 1))).then((r) => r.json()).then((j) => L.parseAsync(toGLB(j), ''))
    .then((g) => { prepGLB(g.scene); GLB[n] = g.scene; }).catch((e) => console.warn('glb', n, e))));
}
function prepGLB(root) {
  const cache = {};
  root.traverse((o) => { if (!o.isMesh) return;
    const n = (o.material.name || '').split('.')[0], vc = !!o.geometry.attributes.color, key = n + vc;
    const ALIAS = { marble: [null, 0xcfc9bf], wood_dark: ['wood', 0x806050], wood_light: ['wood', 0xd8c0a8], linen: ['cloth_linen', 0xffffff], teal: ['cloth_teal', 0xffffff],
      sack: ['sack', 0xc8b49a], coal: [null, 0x3a1208], candle: [null, 0xeadfc6], steel: [null, 0x9a99a8], brass: [null, 0xdba133], soot: [null, 0x141010], red: ['cloth_red', 0xffffff], rope: [null, 0xa08860] };
    const [tn, col] = ALIAS[n] || [n, 0xffffff];
    if (!cache[key]) { const m = new THREE.MeshStandardMaterial({ map: tn ? tex('m/' + tn) : null, color: col, vertexColors: vc, roughness: .85 });
      if (n === 'coal') { m.emissive = new THREE.Color(0xff4a10); m.emissiveIntensity = 1.6; }
      if (n === 'marble') { m.roughness = .55; m.emissive = new THREE.Color(0x2a2620); }
      if (n === 'steel' || n === 'brass') { m.metalness = .6; m.roughness = .35; }
      if (n === 'leafcard') { m.alphaTest = .5; m.side = THREE.DoubleSide; m.roughness = 1; }
      if (/iron|gold/.test(n)) { m.metalness = .55; m.roughness = .45; }
      cache[key] = m; }
    o.material = cache[key]; o.castShadow = o.receiveShadow = true;
    if (n === 'leafcard') o.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex('m/leafcard'), alphaTest: .5 }); });
}
const GLB_FOR = { barrel: () => 'barrel', chest: () => 'chest', tomb: () => 'sarcophagus', tree: (seed = 1) => 'tree_' + (1 + Math.abs(Math.floor(seed)) % 3),
  crate_sacks: () => 'crate_sacks', stool: () => 'stool', cot: () => 'cot', weapon_rack: () => 'weapon_rack', candelabra: () => 'candelabra', brazier: () => 'brazier',
  fireplace: () => 'fireplace', range: () => 'fireplace', wardrobe: () => 'wardrobe', shelf: () => 'shelf', column: () => 'column',
  altar: () => 'altar', portcullis: () => 'portcullis', pew: () => 'pew', well: () => 'well', statue: () => 'statue' };
// flames (and the light points they register) for the Blender props that burn
const GLB_FLAMES = { candelabra: [[-.28, 1.3, 0, .45], [0, 1.44, 0, .45], [.28, 1.3, 0, .45]], brazier: [[-.06, .74, .02, 1.25], [.08, .74, -.04, 1.0]], altar: [[-.36, 1.19, 0, .4], [.36, 1.19, 0, .4]], fireplace: [[-.11, .16, -.02, .8], [.05, .18, -.01, 1.0], [.15, .16, -.02, .7]] };
export function build(name, ...args) {
  const gn = GLB_FOR[name] && GLB_FOR[name](...args);
  if (gn && GLB[gn]) { const g = new THREE.Group(); g.name = name; g.add(GLB[gn].clone());
    const bb = new THREE.Box3().setFromObject(g), sz = bb.getSize(new THREE.Vector3()); g.userData.fp = { w: sz.x, d: sz.z };
    for (const [x, y, z, sc] of GLB_FLAMES[gn] || []) flame(g, x, y, z, sc); return g; }
  if (!B[name]) return null;
  const g = new THREE.Group(); g.name = name;
  const fp = B[name](g, ...args); g.userData.fp = fp; return g;
}
export const HAS = (n) => !!B[n];
export function buildOld(name, ...args) { const g = new THREE.Group(); g.userData.fp = B[name](g, ...args); return g; }
