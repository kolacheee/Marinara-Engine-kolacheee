// @ts-nocheck
// ──────────────────────────────────────────────
// HD-2D town view (fork): the walkable 3D town or city a settlement opens as. Ported from the standalone
// prototype page: the page's script is the body of mountHd2dTown, its controls replaced by the Engine's.
// ──────────────────────────────────────────────
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { planInterior, cellarSteps } from './interior.js';
import { buildInterior, makeWalk } from './interior3d.js';
import { planChurch } from './church.js';
import { PLANNERS } from './buildings.js';
import { planGuild, planKeep } from './civic.js';
import { planGate, planMill, planSmelter } from './works.js';
import { build, tex, M, plain, box, flame, preloadGLB, hd2dAsset } from './models.js';
import { MW, MH, rngOf, WATERK, WALKK, BASES, RANKS, plan, carve } from './towngen.js';
import { plan2, townOf, prepareCity } from './gen2/adapt.js';
import { buildShell, buildCross, buildTenter } from './shell3d.js';

export async function mountHd2dTown(host, opts = {}) {
const hostW = () => Math.max(1, host.clientWidth), hostH = () => Math.max(1, host.clientHeight);
const listeners = []; const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn, o]); };
let paused = false, disposed = false;
// keys move the party only while the town view holds the focus, so typing in the chat never walks it
const owns = () => document.activeElement === renderer.domElement;
host.insertAdjacentHTML('beforeend', `<div data-h2="where" class="hd2d-where"></div><canvas data-h2="sky" class="hd2d-sky" width="760" height="78" hidden></canvas><div data-h2="fade" class="hd2d-fade"></div><div data-h2="prompt" class="hd2d-prompt" hidden></div><div data-h2="tap" class="hd2d-tap off"></div><div data-h2="busy" class="hd2d-busy">${opts.busyText || 'Building town…'}</div>`);
const $ = (id) => host.querySelector('[data-h2="' + id + '"]');

// A walled town district built from a seeded street plan: perimeter blocks of narrow houses along the streets, yards
// inside, a square with church, guildhall, fountain and stalls, and the town wall with its gate. Same camera, light and
// post as the dungeon walk; the houses are real 3D shells wearing 32-texel-per-unit pixel textures.

globalThis.ASSET_V = 1;
await preloadGLB(['barrel', 'crate_sacks', 'tree_1', 'tree_2', 'tree_3', 'well', 'column', 'statue']);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
host.prepend(renderer.domElement); renderer.domElement.style.position = 'absolute'; renderer.domElement.style.inset = '0';
// the game view takes keyboard focus (not the page or a control), so held letters never reach the OS text system (Mac accent picker)
renderer.domElement.tabIndex = 0; renderer.domElement.style.outline = 'none'; renderer.domElement.setAttribute('inputmode', 'none'); if (opts.focus !== false) setTimeout(() => renderer.domElement.focus({ preventScroll: true }), 0);
const S = { hour: 10, seed: 1, day: true, hq: true, zoom: 1.35, season: 'summer', basis: 'market', rank: 3, gen: 2, planted: false, ground: 'hill', place: 'town', city: { seed: 1, rank: 'city', site: 'river', era: 'medieval', cell: -1 } };
S.gen = 2; S.place = 'town'; S.city = S.city || {}; S.rank = Math.min(2, +S.rank || 0);   // the old town and city generators are retired: every town and city comes from gen2
const save = () => { opts.onSave?.({ tcell: S.tcell, hour: S.hour }); };

const blob = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const rg = g.createRadialGradient(32, 32, 4, 32, 32, 32); rg.addColorStop(0, 'rgba(0,0,0,0.55)'); rg.addColorStop(.6, 'rgba(0,0,0,0.3)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c); })();
const charTex = {}; for (const n of ['knight', 'mage', 'rogue', 'cleric']) { const t = new THREE.TextureLoader().load(hd2dAsset('cx/spr/' + n + '.png')); t.magFilter = t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace; charTex[n] = t; }

// ---------- see-through: anything between the party and the camera dithers away (screen-door, so shadows stay) ----------
const HK = 20;   // a city plan's height unit in world units
const U = { party: { value: new THREE.Vector3() }, cam: { value: new THREE.Vector3() }, inner: { value: .6 }, tail: { value: new THREE.Vector3() }, p1: { value: new THREE.Vector3() }, p2: { value: new THREE.Vector3() }, walk: { value: null }, inside: { value: 0 } };
function seeThrough(m, hard = false, foot = true, extra = 0, ground = false) {
  if (!hard && m.isMeshStandardMaterial && !m.transparent && !m.alphaTest) m.side = THREE.DoubleSide;
  m.onBeforeCompile = (sh) => { sh.uniforms.uParty = U.party; sh.uniforms.uCam = U.cam; sh.uniforms.uInner = U.inner; sh.uniforms.uTail = U.tail; sh.uniforms.uP1 = U.p1; sh.uniforms.uP2 = U.p2; sh.uniforms.uWalk = U.walk; sh.uniforms.uIn = U.inside;
    sh.vertexShader = sh.vertexShader.replace('void main() {', 'varying vec3 vWp; attribute vec4 aAnc; varying vec4 vAnc;\nvoid main() {')
      .replace('#include <project_vertex>', '#include <project_vertex>\n{ vec4 wp4 = vec4(transformed, 1.);\n#ifdef USE_INSTANCING\nwp4 = instanceMatrix * wp4;\n#endif\nvWp = (modelMatrix * wp4).xyz; vAnc = aAnc.w < 0. ? vec4((modelMatrix * vec4(aAnc.xyz, 1.)).xyz, aAnc.w) : vec4(0., 0., 0., 1.); }');
    if (m.side === THREE.DoubleSide) sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n  if (!gl_FrontFacing) gl_FragColor.rgb = diffuseColor.rgb * uInner;');
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', `
uniform vec3 uParty; uniform vec3 uCam; uniform float uInner; uniform vec3 uTail; uniform vec3 uP1; uniform vec3 uP2; uniform sampler2D uWalk; uniform float uIn; varying vec3 vWp; varying vec4 vAnc;
float walkAt(vec3 q) { if (q.x < -${MW}. || q.z < -${MH}. || q.x >= ${2 * MW}. || q.z >= ${2 * MH}.) return .5; return texture2D(uWalk, vec2((q.x + ${MW}.) / ${3 * MW}., (q.z + ${MH}.) / ${3 * MH}.)).r; }
float gAt(vec3 q) { if (q.x < -${MW}. || q.z < -${MH}. || q.x >= ${2 * MW}. || q.z >= ${2 * MH}.) return 0.; return texture2D(uWalk, vec2((q.x + ${MW}.) / ${3 * MW}., (q.z + ${MH}.) / ${3 * MH}.)).g; }
// the cut only opens what hides walkable ground (or someone standing on it): never the floor or walls inside a house
bool opensWalk(vec3 wp, bool loose) { vec3 d = wp - uCam; if (d.y >= 0.) return false; float gb = uParty.y - .8;
  // walk the ray down: open if it reaches walkable space at standing height before it meets a house floor
  for (int k = 0; k < 4; k++) { float h = k == 0 ? 1.4 : k == 1 ? .7 : k == 2 ? .32 : 0.; if (wp.y < h + gb + .05) continue; vec3 q = uCam + d * ((h + gb - uCam.y) / d.y);
    float lim = uIn > .5 ? .75 : .25; if (walkAt(q) > lim) return true; if (k == 2 && !loose) return false;
    // a low stub, sill or floor at the path's level: open it when the path is just beyond, so the ground shows through instead of a ledge of the building
    if (k == 3 || loose) { vec3 hd = normalize(vec3(d.x, 0., d.z)); if (walkAt(q + hd * .5) > lim || walkAt(q + hd) > lim) return true; } } return false; }
// raised ground (a yard or terrace up the slope from the party) opens only where the path lies right behind it, so the cut never shows the sky under it; only well above the party, as stepped streets sit up to half a unit off the smooth height
float groundGate(vec3 wp) { float gb = uParty.y - .8; vec3 d = wp - uCam; if (d.y >= 0. || wp.y < gb + .6) return 0.; vec3 q = uCam + d * ((gb - uCam.y) / d.y); return walkAt(q) > .25 ? 1. : 0.; }
vec2 coneD(vec3 tgt, vec3 wp, float g) { vec3 ax = tgt - uCam; float total = length(ax); ax /= total; vec3 bv = wp - uCam; float along = dot(bv, ax);
  // how far in front of the party this point stands, measured on the ground plane toward the camera: a low ledge right in front of their feet counts as in front (along the slanted view line it fell behind the raised target)
  vec2 hz = tgt.xz - uCam.xz; vec3 pp = (bv - ax * along) * total / max(along, .01); vec3 rt = normalize(vec3(-ax.z, 0., ax.x)); float lat = dot(pp, rt), vert = length(pp - rt * lat); lat = max(abs(lat) - g, 0.); vert = max(vert - g, 0.);
  // a slot, not a disc: up and down it reaches the sprite's head and feet, sideways only a little past the sprite, so in side view the houses along the street stay whole
  return vec2(1.28 * length(vec2(lat / .44, vert / 1.28)), dot(tgt.xz - wp.xz, hz / max(length(hz), .01))); }
float bayer4(vec2 p){ ivec2 q = ivec2(mod(p, 4.)); int i = q.x + q.y * 4;
  float m[16] = float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.); return (m[i] + .5) / 16.; }
void main() {
  { // cones from the camera to the leader, the middle of the party and the last follower: a round-ended slot in screen space, never a tube
    bool whole = vAnc.w < 0.; vec3 wp = whole ? vAnc.xyz : vWp; float grow = whole ? -vAnc.w : 0.;
    vec3 o = vec3(0., .55, 0.); vec2 c0 = coneD(uParty + o, wp, grow), c1 = coneD(uP1 + o, wp, grow), c2 = coneD(uTail + o, wp, grow), c3 = coneD(uP2 + o, wp, grow);
    float dd = c0.x, t = c0.y; if (c1.x < dd) { dd = c1.x; t = c1.y; } if (c2.x < dd) { dd = c2.x; t = c2.y; } if (c3.x < dd) { dd = c3.x; t = c3.y; }
    // nothing behind the party is ever cut (the far side of the town wall, roofs past the party): only what stands between them and the camera
    if (max(max(c0.y, c3.y), max(c1.y, c2.y)) < -.06) t = -1.;
    // inside the circle, everything standing between the camera and the party goes: walls, floors, counters, signs, upper storeys. Ground is never cut, so the path always shows
    float fade = (1. - smoothstep(1.28 + EXTRA, 1.4 + EXTRA, dd)) * step(-.06, t + grow * .6) * (GROUND ? groundGate(wp) : step(.08, wp.y - gAt(wp)));
    if (whole) { if (fade > .3) discard; } else if (fade > (HARD || !gl_FrontFacing ? .0 : .7) || (!HARD && fade > 0. && bayer4(gl_FragCoord.xy) < fade / .7)) discard; }`.replaceAll('HARD', hard ? 'true' : 'false').replace('FOOT', foot ? 'smoothstep(.2, .3, wp.y - min(gAt(wp), uParty.y - .8))' : '1.').replaceAll('EXTRA', extra.toFixed(2)).replaceAll('GROUND', ground ? 'true' : 'false')); };
  m.customProgramCacheKey = () => 'see' + hard + foot + extra + ground; return m; }

// ---------- geometry buckets, merged per material ----------
const TEXDIM = { stained: [32, 32], roof_snow: [48, 40], plaster_cream: [128, 128], plaster_ochre: [128, 128], plaster_rose: [128, 128], plaster_white: [128, 128], roof_terra: [48, 40], roof_brown: [48, 40], ridge_terra: [48, 40], ridge_brown: [48, 40] };
function Buckets() {
  const B = {};
  let grp = null, lift = null; const add = (key, geo) => { if (lift !== null) geo.userData.dy = lift; (B[key] = B[key] || []).push(geo); if (grp) grp.push(geo); };
  // everything built inside fn vanishes from the see-through cut as one piece (lamp posts, signs, banners, chimneys)
  const group = (fn) => { const prev = grp; grp = []; fn(); const gs = grp; grp = prev; const bb = new THREE.Box3(); for (const g of gs) { g.computeBoundingBox(); bb.union(g.boundingBox); }
    const c = bb.getCenter(new THREE.Vector3()), r = bb.getSize(new THREE.Vector3()).length() / 2; for (const g of gs) g.userData.anc = [c.x, c.y, c.z, r]; for (const g of gs) g.userData.whole = true; if (prev) prev.push(...gs); };
  // a quad from four corners (counter-clockwise seen from outside); u runs along p0->p1, v along p0->p3, in texels
  const quad = (key, p0, p1, p2, p3, tw = 64, th = 64, uo = 0, vo = 0) => {
    const dim = TEXDIM[key.split('#')[0]]; if (dim) { tw = dim[0]; th = dim[1]; }
    const g = new THREE.BufferGeometry(), A = [p0, p1, p2, p0, p2, p3];
    const ua = new THREE.Vector3().subVectors(p1, p0), va = new THREE.Vector3().subVectors(p3, p0), ul = ua.length(), vl = va.length(); ua.normalize(); va.normalize();
    const n = new THREE.Vector3().crossVectors(ua, va).normalize();
    const pos = [], nor = [], uv = [];
    for (const p of A) { pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); const d = new THREE.Vector3().subVectors(p, p0); uv.push(uo + d.dot(ua) * 32 / tw, vo + d.dot(va) * 32 / th); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    add(key, g); };
  const tri = (key, p0, p1, p2, tw = 64, th = 64, uo = 0, vo = 0) => {
    const dim = TEXDIM[key.split('#')[0]]; if (dim) { tw = dim[0]; th = dim[1]; }
    const g = new THREE.BufferGeometry(), ua = new THREE.Vector3().subVectors(p1, p0).normalize(), e2 = new THREE.Vector3().subVectors(p2, p0);
    const n = new THREE.Vector3().crossVectors(ua, e2).normalize(), va = new THREE.Vector3().crossVectors(n, ua);
    const pos = [], nor = [], uv = [];
    for (const p of [p0, p1, p2]) { pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); const d = new THREE.Vector3().subVectors(p, p0); uv.push(uo + d.dot(ua) * 32 / tw, vo + d.dot(va) * 32 / th); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    add(key, g); };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  // an axis-aligned box in world coordinates with world-anchored UVs (textures run on across neighbours); skip: faces to leave out
  const cube = (key, x0, y0, z0, x1, y1, z1, tw = 32, th = 32, skip = '') => {
    { const dim = TEXDIM[key.split('#')[0]]; if (dim) { tw = dim[0]; th = dim[1]; } }
    const n0 = (B[key] || []).length;
    if (!skip.includes('n')) quad(key, V(x1, y0, z0), V(x0, y0, z0), V(x0, y1, z0), V(x1, y1, z0), tw, th, -x1 * 32 / tw, y0 * 32 / th);
    if (!skip.includes('s')) quad(key, V(x0, y0, z1), V(x1, y0, z1), V(x1, y1, z1), V(x0, y1, z1), tw, th, x0 * 32 / tw, y0 * 32 / th);
    if (!skip.includes('w')) quad(key, V(x0, y0, z0), V(x0, y0, z1), V(x0, y1, z1), V(x0, y1, z0), tw, th, z0 * 32 / tw, y0 * 32 / th);
    if (!skip.includes('e')) quad(key, V(x1, y0, z1), V(x1, y0, z0), V(x1, y1, z0), V(x1, y1, z1), tw, th, -z1 * 32 / tw, y0 * 32 / th);
    if (!skip.includes('t')) quad(key, V(x0, y1, z1), V(x1, y1, z1), V(x1, y1, z0), V(x0, y1, z0), tw, th, x0 * 32 / tw, -z1 * 32 / th);
    if (!skip.includes('b')) quad(key, V(x0, y0, z0), V(x1, y0, z0), V(x1, y0, z1), V(x0, y0, z1), tw, th);
    const L = B[key], anc = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, Math.hypot(x1 - x0, y1 - y0, z1 - z0) / 2]; if (L) for (let i = L.length - 1; i >= n0 && L[i].userData.anc === undefined; i--) L[i].userData.anc = anc;
  };
  // any three.js geometry placed with a matrix (cylinders, cones, rotated beams)
  const geo = (key, g0, mtx) => { let g = g0.index ? g0.toNonIndexed() : g0; g.applyMatrix4(mtx); for (const a of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(a)) g.deleteAttribute(a); add(key, g); };
  return { B, quad, tri, cube, geo, V, group, setLift: (v) => { lift = v; }, get lift() { return lift; } };
}

// ---------- materials ----------
const MATC = {}; function mats(day, season) { const k = day + season; return MATC[k] || (MATC[k] = mats0(day, season)); }
function mats0(day, season) {
  const T = (n, o = {}) => { const m = new THREE.MeshStandardMaterial({ map: tex('m/' + n), roughness: o.rough ?? .9, color: o.color ?? 0xffffff, metalness: o.metal ?? 0 });
    if (o.emissive) { m.emissive = new THREE.Color(o.emissive); m.emissiveIntensity = o.ei ?? 1; } return seeThrough(m, false, true, o.extra ?? 0); };
  const P = (c, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: o.rough ?? .85, metalness: o.metal ?? 0 }); if (o.emissive) { m.emissive = new THREE.Color(o.emissive); m.emissiveIntensity = o.ei ?? 1; } return seeThrough(m, false, !o.thin); };
  const snow = season === 'winter';
  const O = {
    plaster_cream: T('plaster_cream'), plaster_ochre: T('plaster_ochre'), plaster_rose: T('plaster_rose'), plaster_white: T('plaster_white'),
    ashlar: T('ashlar', { color: 0xe8e0d4 }), ashlar_dark: T('ashlar', { color: 0xb8b0a8 }), brick: T('brick_a'), brick_old: T('brick_a', { color: 0xb49a8e }), beam: T('beam', { rough: .8, extra: .35 }),
    roof_terra: T('roof_terra'), roof_slate: T('roof_slate', { rough: .6 }), roof_brown: T('roof_brown'), roof_thatch: T('roof_thatch', { rough: 1 }),
    roof_snow: T('roof_snow', { rough: .9, color: 0xe4e8ee }),
    ridge_terra: T('roof_terra', { color: 0x9a8a80 }), ridge_slate: T('roof_slate', { color: 0x8890a0 }), ridge_brown: T('roof_brown', { color: 0x9a8a80 }), ridge_thatch: T('roof_thatch', { color: 0xa09080 }),
    wood: T('wood', { rough: .7, color: 0xb89a80 }), door: T('wood_v', { rough: .7, color: 0x9c7a60 }), shutter_g: T('wood_v', { color: 0x7fa08a }), shutter_b: T('wood_v', { color: 0x7d92b0 }), shutter_r: T('wood_v', { color: 0xb07a6a }),
    stone: T('stone_block', { color: 0xd8d0c4 }), iron: P(0x34323c, { metal: .6, rough: .45, thin: true }),
    glass: P(0x3a4a60, { rough: .2, metal: .35 }), glass_lit: P(0x3a2a18, { emissive: 0xffb45a, ei: day ? 0 : 1.7, rough: .4 }),
    dark: P(0x17130f, { rough: 1 }), cloth_red: T('cloth_red'), cloth_teal: T('cloth_teal'), cloth_linen: T('cloth_linen'), cloth_green: T('cloth_linen', { color: 0x8fb070 }), cloth_blue: T('cloth_linen', { color: 0x5a78b8 }), turf: snow ? P(0xeef2f6, { rough: .95 }) : T('grass', { color: 0xd8e0c8 }), cloth_ochre: T('cloth_linen', { color: 0xe0b060 }),
    lamp: P(0xffe0a0, { emissive: 0xffc070, ei: day ? .45 : 2.4, thin: true }), water: new THREE.MeshStandardMaterial({ map: snow ? null : tex('m/water'), roughness: snow ? .3 : .1, metalness: .2, color: snow ? 0xdde8f4 : 0x9ab8c8 }),
    lead: P(0x5a6070, { metal: .5, rough: .4 }), gold: P(0xd8a840, { metal: .7, rough: .35 }),
    stained: (() => { const m = T('stained', { emissive: 0xffffff, ei: day ? .55 : 1.5, rough: .3, color: 0x9098a8 }); m.emissiveMap = m.map; return m; })(),
    floor: seeThrough(new THREE.MeshStandardMaterial({ map: tex('m/floor_wood'), color: 0xa88a72, roughness: .9 })), fl_r: P(0xc8403a), fl_y: P(0xe8c040), fl_w: P(0xf0ece0), fl_p: P(0xb070c0), fl_g: P(0x4a7a38, { rough: 1 }),
    ice: P(0xdcecff, { rough: .2, metal: .1 }), flags: T('pave', { color: snow ? 0xe8ecf2 : 0xc8c4bc }), path: T('path', { rough: 1, color: snow ? 0xe8ecf2 : 0xffffff }), soil: T(snow ? 'snow' : 'dirt', { rough: 1, color: snow ? 0xffffff : 0xb8a898 }), spoil: T('dirt', { rough: 1, color: 0x8c847c }), boat_b: P(0x5a88b8), boat_r: P(0xb85a44), boat_g: P(0x5a9a68), boat_w: P(0xe8e2d4), boat_in: T('floor_wood', { color: 0xd8b890 }),
    net: (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'); g.fillStyle = '#5a4a3a'; for (let i = 0; i < 32; i += 4) { g.fillRect(i, 0, 1, 32); g.fillRect(0, i, 32, 1); }
      const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return seeThrough(new THREE.MeshStandardMaterial({ map: t, alphaTest: .5, side: THREE.DoubleSide, roughness: 1 }), false, false); })(),
  };
  // per-building roof variants: the same tiles fired or weathered a little differently
  const TINT = { roof_terra: [0xffffff, 0xf0d8c8, 0xe0c0b0, 0xfff0e0], roof_slate: [0xffffff, 0xd8dce8, 0xc8ccd8, 0xe8e0e0], roof_brown: [0xffffff, 0xe8d8c8, 0xd0c0b0, 0xf8e8d0], roof_thatch: [0xffffff, 0xe8e0c8, 0xd8ccb0, 0xf0e8d0] };
  for (const k of ['cloth_red', 'cloth_teal', 'cloth_green', 'cloth_ochre', 'cloth_linen']) { O['sc_' + k] = seeThrough(O[k].clone()); O['sc_' + k].side = THREE.FrontSide; }
  for (const [k, ts] of Object.entries(TINT)) ts.forEach((c, i) => { const m = O[k].clone(); m.color.setHex(c); seeThrough(m); O[k + '#' + i] = m; });
  return O;
}

// ---------- the town ----------
const townTex = (() => { const out = [];
  const swap = (name, maps, ops = []) => { const t = charTex[name]; const img = t.image; const c = document.createElement('canvas'); c.width = 32; c.height = 48; const g = c.getContext('2d');
    const tt = new THREE.CanvasTexture(c); tt.magFilter = tt.minFilter = THREE.NearestFilter; tt.colorSpace = THREE.SRGBColorSpace;
    const draw = () => { g.drawImage(t.image, 0, 0); const d = g.getImageData(0, 0, 32, 48); for (let i = 0; i < d.data.length; i += 4) { const k = d.data[i] + ',' + d.data[i + 1] + ',' + d.data[i + 2]; const to = maps[k]; if (to) { d.data[i] = to[0]; d.data[i + 1] = to[1]; d.data[i + 2] = to[2]; } } g.putImageData(d, 0, 0); for (const [x0, y0, x1, y1, c] of ops) { g.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; g.fillRect(x0, y0, x1 - x0 + 1, y1 - y0 + 1); } tt.needsUpdate = true; };
    if (img && img.complete && img.width) draw(); else { const iv = setInterval(() => { if (t.image && t.image.width) { clearInterval(iv); draw(); } }, 50); } return tt; };
  const robe = (a, b, c2) => ({ '220,205,178': a, '194,177,153': b, '160,143,124': c2, '219,161,51': [120, 84, 52], '242,205,90': [150, 110, 70], '124,67,24': [80, 52, 34], '138,38,50': c2, '94,26,40': [60, 44, 40] });
  const hood = (a, b, c2) => ({ '60,67,80': a, '48,46,59': b, '102,112,128': c2, '74,72,88': b, '141,140,156': c2 });
  const O = [36, 22, 31];
  const HAT = [[10, 9, 22, 10, [186, 150, 84]], [9, 10, 23, 10, [150, 116, 62]], [12, 5, 20, 8, [206, 172, 100]], [13, 4, 19, 4, [206, 172, 100]], [12, 8, 20, 8, [120, 60, 40]], [8, 9, 8, 10, O], [24, 9, 24, 10, O], [9, 11, 23, 11, O], [11, 4, 11, 8, O], [21, 4, 21, 8, O], [12, 3, 20, 3, O]];
  const CAP = [[11, 5, 21, 9, [178, 52, 48]], [11, 5, 21, 5, [206, 80, 70]], [10, 6, 10, 9, O], [22, 6, 22, 9, O], [11, 4, 21, 4, O], [20, 3, 23, 5, [178, 52, 48]]];
  const APRON = [[13, 28, 18, 36, [226, 218, 196]], [15, 29, 15, 36, [200, 190, 168]], [17, 29, 17, 35, [204, 194, 172]], [13, 36, 18, 36, [196, 186, 160]], [13, 27, 18, 27, [176, 166, 142]], [12, 28, 12, 36, O], [19, 28, 19, 36, O]];
  const BASKET = [[22, 29, 27, 32, [150, 104, 56]], [22, 29, 27, 29, [186, 140, 80]], [23, 27, 26, 27, [120, 80, 40]], [21, 28, 21, 33, O], [28, 28, 28, 33, O], [21, 33, 28, 33, O], [23, 30, 24, 30, [206, 80, 60]], [25, 30, 26, 30, [220, 190, 90]]];
  out.push(swap('cleric', robe([150, 120, 160], [122, 96, 134], [92, 72, 104]), HAT), swap('cleric', robe([200, 120, 90], [168, 96, 70], [130, 72, 54]), APRON), swap('cleric', robe([120, 150, 110], [96, 124, 88], [72, 96, 66]), [...CAP, ...BASKET]));
  out.push(swap('rogue', hood([112, 84, 58], [84, 62, 44], [150, 118, 84]), [...HAT, ...BASKET]), swap('rogue', hood([70, 96, 120], [52, 70, 92], [110, 136, 160]), APRON), swap('rogue', hood([118, 110, 70], [90, 84, 52], [156, 148, 100]), CAP));
  out.push(swap('cleric', robe([90, 110, 150], [70, 88, 124], [52, 66, 96]), [...APRON, ...BASKET]), swap('rogue', hood([140, 70, 60], [104, 52, 46], [176, 104, 90]), []), swap('cleric', robe([210, 190, 120], [180, 160, 96], [140, 124, 72]), CAP));
  return out; })();
const guardTex = (() => { const t = charTex.knight, c = document.createElement('canvas'); c.width = 32; c.height = 48; const g = c.getContext('2d'); const tt = new THREE.CanvasTexture(c); tt.magFilter = tt.minFilter = THREE.NearestFilter; tt.colorSpace = THREE.SRGBColorSpace;
  const draw = () => { g.drawImage(t.image, 0, 0); const d = g.getImageData(0, 0, 32, 48); for (let i = 0; i < d.data.length; i += 4) { const R0 = d.data[i], G0 = d.data[i + 1], B0 = d.data[i + 2]; if (R0 > G0 + 50 && R0 > B0 + 40) { d.data[i] = G0 + 20; d.data[i + 1] = G0 + 50; d.data[i + 2] = R0; } } g.putImageData(d, 0, 0); tt.needsUpdate = true; };
  const iv = setInterval(() => { if (t.image && t.image.width) { clearInterval(iv); draw(); } }, 50); return tt; })();
let world = null;
function buildWorld(spec, day, season, arriveAt) {
  const seed = spec.seed, P = spec.gen === 2 ? plan2(spec) : plan(spec), { at, I, sq, ch, gh, r, ri, pick } = P, inG = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH;
  const { lots, lotId } = P.carved || carve(P);
  // ---------- ground height: a hill crowned by the church, falling to the water; every building stands on a level platform ----------
  const HA = spec.ground === 'flat' ? 0 : P.brief ? 1 : P.rank >= 2 ? 7.5 : P.rank === 1 ? 4.5 : 2;
  const mid = P.walls ? (() => { let sx = 0, sy = 0, n = 0; for (let i = 0; i < MW * MH; i++) if (P.walls.ins[i]) { sx += i % MW; sy += (i / MW) | 0; n++; } return n ? [sx / n, sy / n] : [MW / 2, MH / 2]; })() : sq ? [(sq.x0 + sq.x1) / 2, (sq.y0 + sq.y1) / 2] : [MW / 2, MH / 2];
  const crest = ch ? [(ch.x + ch.w / 2) * .55 + mid[0] * .45, (ch.y + ch.d / 2) * .55 + mid[1] * .45] : mid;   // the church takes the high ground, the town spreads down from it
  const LOWK = new Set(['river', 'sea', 'stream', 'quay', 'pier', 'beach']), FLATW = new Set(['river', 'sea', 'stream']);
  const wd = new Int16Array(MW * MH).fill(999); { const q = []; for (let i = 0; i < MW * MH; i++) if (LOWK.has(P.g[i])) { wd[i] = 0; q.push(i); }
    for (let h = 0; h < q.length; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (!inG(X, Y) || wd[I(X, Y)] <= wd[i] + 1) continue; wd[I(X, Y)] = wd[i] + 1; q.push(I(X, Y)); } } }
  const wdAt = (x, y) => wd[I(Math.min(MW - 1, Math.max(0, x)), Math.min(MH - 1, Math.max(0, y)))];
  const sstep = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const OX = 10, OY = 8, NW = MW + 20, NH = MH + 14, HN = new Float32Array((NW + 1) * (NH + 1));
  for (let cz = -OY; cz <= NH - OY; cz++) for (let cx = -OX; cx <= NW - OX; cx++) { const dx = cx - crest[0], dz = (cz - crest[1]) * 1.1, d2 = dx * dx + dz * dz;
    const w = Math.min(wdAt(cx, cz), wdAt(cx - 1, cz), wdAt(cx, cz - 1), wdAt(cx - 1, cz - 1));
    HN[(cz + OY) * (NW + 1) + cx + OX] = HA * sstep(1, 7, w) * (.7 * Math.exp(-d2 / (16 * 16)) + .3 * Math.exp(-d2 / (34 * 34))); }
  if (HA && P.brief) { // a city map: the plan's corner heights (shared with the neighbouring maps), relative to this map's lowest corner
    const C = P.brief.corners, lo = Math.min(...C);
    for (let cz = -OY; cz <= NH - OY; cz++) for (let cx = -OX; cx <= NW - OX; cx++) { const u = Math.min(1, Math.max(0, cx / MW)), v = Math.min(1, Math.max(0, cz / MH));
      const hb = (C[0] * (1 - u) + C[1] * u) * (1 - v) + (C[3] * (1 - u) + C[2] * u) * v, w = Math.min(wdAt(cx, cz), wdAt(cx - 1, cz), wdAt(cx, cz - 1), wdAt(cx - 1, cz - 1));
      HN[(cz + OY) * (NW + 1) + cx + OX] = (hb - lo) * HK * sstep(0, 4, w); } }
  // the market takes the flattest ground and the churchyard is levelled: both pull the slope flat around them, so the streets leaving them steepen instead
  const levelTo = (want, rad) => { const dist = new Float32Array(MW * MH).fill(99), q = []; let sx = 0, sz = 0, n = 0;
    for (let i = 0; i < MW * MH; i++) if (want(P.g[i])) { dist[i] = 0; q.push(i); sx += i % MW + .5; sz += ((i / MW) | 0) + .5; n++; } if (!n) return;
    for (let h = 0; h < q.length; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (!inG(X, Y) || dist[I(X, Y)] <= dist[i] + 1) continue; dist[I(X, Y)] = dist[i] + 1; q.push(I(X, Y)); } }
    const cx0 = Math.round(sx / n), cz0 = Math.round(sz / n), lv = HN[(cz0 + OY) * (NW + 1) + cx0 + OX];
    for (let cz = -OY; cz <= NH - OY; cz++) for (let cx = -OX; cx <= NW - OX; cx++) { let d = 99; for (const [ax, az] of [[cx, cz], [cx - 1, cz], [cx, cz - 1], [cx - 1, cz - 1]]) if (inG(ax, az)) d = Math.min(d, dist[I(ax, az)]);
      const w = 1 - sstep(0, rad, d), k = (cz + OY) * (NW + 1) + cx + OX; HN[k] = HN[k] * (1 - w) + lv * w; } };
  if (HA) { levelTo((k) => k === 'square', 5); levelTo((k) => k === 'church' || k === 'yardC', 2.5); }
  // upper town and lower town: in a walled hill town the upper ground (about the top two fifths) stands a storey higher behind a retaining wall,
  // with garden terraces along its edge; the streets cut ramps through it
  const dropLot = new Set();
  if (HA && P.rank >= 2 && P.walls && !P.brief) { const at0 = (cx, cz) => HN[(cz + OY) * (NW + 1) + cx + OX], C = 1.6, inW = (x, y) => inG(x, y) && P.walls.ins[I(x, y)];
    const hs = []; for (let cz = 0; cz <= MH; cz++) for (let cx = 0; cx <= MW; cx++) if (inW(cx, cz)) hs.push(at0(cx, cz)); hs.sort((a, b) => a - b); const Lc = hs[Math.floor(hs.length * .6)];
    const up = (cx, cz) => at0(cx, cz) > Lc && (inW(cx, cz) || inW(cx - 1, cz) || inW(cx, cz - 1) || inW(cx - 1, cz - 1));
    const lift = []; for (let cz = 0; cz <= MH; cz++) for (let cx = 0; cx <= MW; cx++) if (up(cx, cz)) lift.push((cz + OY) * (NW + 1) + cx + OX);
    const edge = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = P.g[I(x, y)]; if (!inW(x, y) || !(k === 'yard' || k === 'out' || k === 'field' || k === 'lot')) continue; const u = [up(x, y), up(x + 1, y), up(x, y + 1), up(x + 1, y + 1)]; if (u.some(Boolean) && !u.every(Boolean)) edge.push(I(x, y)); }
    for (const i of edge) { if (P.g[i] === 'lot' && lotId[i] >= 0) dropLot.add(lotId[i]); }
    for (let i = 0; i < MW * MH; i++) if (P.g[i] === 'lot' && dropLot.has(lotId[i])) P.g[i] = 'yard';
    for (const i of edge) P.g[i] = 'cliff';
    for (const k of lift) HN[k] += C; }
  // no slope steeper than a stepped lane can climb where people walk: neighbouring corners at most G apart (between two cells nobody walks, a step stays a wall)
  const walkC = (x, y) => !inG(x, y) || WALKK.has(P.g[I(x, y)]);
  if (HA) { const G = .42; for (let it = 0; it < 80; it++) { let moved = 0; for (let cz = 0; cz <= NH; cz++) for (let cx = 0; cx <= NW; cx++) { const a = cz * (NW + 1) + cx, wx = cx - OX, wz = cz - OY;
      for (const b of [cx < NW ? a + 1 : -1, cz < NH ? a + NW + 1 : -1]) { if (b < 0) continue; if (b === a + 1 ? !walkC(wx, wz - 1) && !walkC(wx, wz) : !walkC(wx - 1, wz) && !walkC(wx, wz)) continue; const d = HN[b] - HN[a], ex = Math.abs(d) - G; if (ex <= 0) continue; const m = Math.sign(d) * ex / 2; HN[a] += m; HN[b] -= m; moved++; } } if (!moved) break; } }
  const hn = (cx, cz) => HN[(Math.min(NH - OY, Math.max(-OY, cz)) + OY) * (NW + 1) + Math.min(NW - OX, Math.max(-OX, cx)) + OX];
  const hnF = (x, z) => { const x0 = Math.floor(x), z0 = Math.floor(z), fx = x - x0, fz = z - z0; return (hn(x0, z0) * (1 - fx) + hn(x0 + 1, z0) * fx) * (1 - fz) + (hn(x0, z0 + 1) * (1 - fx) + hn(x0 + 1, z0 + 1) * fx) * fz; };
  const flat = new Float32Array(MW * MH).fill(NaN), lotPlat = lots.map((L) => { const [fx, fz] = L.f === 'S' ? [L.x + L.w / 2, L.y + L.d] : L.f === 'N' ? [L.x + L.w / 2, L.y] : L.f === 'E' ? [L.x + L.w, L.y + L.d / 2] : [L.x, L.y + L.d / 2]; return Math.round(hnF(fx, fz) * 20) / 20; });
  const chPlat = ch ? Math.round(hnF(ch.cx, ch.y + ch.d) * 20) / 20 : 0, ghPlat = gh ? Math.round(hnF(gh.x + gh.w / 2, gh.y + gh.d) * 20) / 20 : 0;
  const bPlat = new Map(); if (P.BLDS) { const GB = P.bid; for (const b of P.BLDS) { const dd = b.doors.find((q) => !q.water) || { x: b.x0 + b.W / 2, y: b.y0 + b.H }; const v = Math.round(hnF(dd.x + .5, dd.y + .5) * 20) / 20; bPlat.set(b.id, v);
    for (let y = b.y0; y < b.y0 + b.H; y++) for (let x = b.x0; x < b.x0 + b.W; x++) if (inG(x, y) && GB[I(x, y)] === b.id && (P.g[I(x, y)] === 'bld' || P.g[I(x, y)] === 'court')) flat[I(x, y)] = v; } }
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const i = I(x, y), k = P.g[i];
    if (k === 'lot' && lotId[i] >= 0) flat[i] = lotPlat[lotId[i]]; else if (k === 'church') flat[i] = chPlat; else if (k === 'guild') flat[i] = ghPlat;
    else if (FLATW.has(k)) flat[i] = 0; else if (k === 'ditch') flat[i] = Math.floor((hn(x, y) + hn(x + 1, y) + hn(x, y + 1) + hn(x + 1, y + 1)) / 4 / .6) * .6 - .15; else if (k === 'cliff') flat[i] = Math.max(hn(x, y), hn(x + 1, y), hn(x, y + 1), hn(x + 1, y + 1)); else if (k === 'wall' || k === 'works' || k === 'bridge' || k === 'pier') flat[i] = (hn(x, y) + hn(x + 1, y) + hn(x, y + 1) + hn(x + 1, y + 1)) / 4; }
  const flatAt = (x, y) => inG(x, y) ? flat[I(x, y)] : NaN;
  const cornerOf = (x, y, cx, cz) => { const f = flatAt(x, y); return f === f ? f : hn(cx, cz); };
  const hAt = (px, pz) => { const f = flatAt(Math.floor(px), Math.floor(pz)); return f === f ? f : hnF(px, pz); };
  const scene = new THREE.Scene();
  const sky = day ? 0xa9c4dc : 0x0e1428; scene.background = new THREE.Color(sky); scene.fog = new THREE.Fog(sky, 18, 40);
  const Mt = mats(day, season), Bk = Buckets(), { quad, tri, cube, geo, V, group } = Bk;
  const snow = season === 'winter', autumn = season === 'autumn';
  const lights = [], solids = [], blockedCell = new Set(), openCell = new Set(), zoneName = new Map();   // openCell: building cells the party may walk (the guildhall's arcade)
  const addLight = (x, y, z, power, dist, color = 0xffa04a, prio = 1) => lights.push({ x, y: y + (Bk.lift ?? hAt(x, z)), z, power, dist, color, prio });

  // ground: merged per texture, 4-cell texture span
  const GT = { cliff: 'grass', main: 'setts', road: 'path', street: 'cobble', alley: 'cobble', lane: 'dirt', square: 'pave', yard: 'grass', yardC: 'grass', out: 'grass', lot: 'dirt', church: 'pave', guild: 'pave', wall: 'dirt', bridge: 'floor_wood', ditch: 'water', river: 'water', stream: 'water', sea: 'sea', quay: 'setts', pier: 'floor_wood', beach: 'sand', field: 'field', works: 'dirt', spoil: 'dirt', bld: 'pave', court: 'pave' };
  const TEXF = { sand: 'snow', field: 'dirt', riser: 'ashlar' };   // ground kinds that reuse a texture under a tint
  const byTex = {};
  const planeAt = (x, y, h, span, dip) => { const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2); g.translate(x + .5, h, y + .5);
    const uv = g.attributes.uv, pos = g.attributes.position; let bent = !!dip; for (let k = 0; k < uv.count; k++) { const cx = Math.round(pos.getX(k)), cz = Math.round(pos.getZ(k)), e = cornerOf(x, y, cx, cz); if (e) { pos.setY(k, h + e); bent = true; } uv.setXY(k, pos.getX(k) / span, -pos.getZ(k) / span); if (dip && dip(cx, cz)) pos.setY(k, -.34); }
    if (bent) g.computeVertexNormals(); return g; };
  // steep lanes are stepped: treads level along the climb, risers facing downhill (the street level under them stays the smooth ramp people walk)
  const STEPK = new Set(['alley', 'lane', 'street']);
  const stepAt = (x, y, span) => { const f = flatAt(x, y); if (f === f) return null; const c00 = hn(x, y), c10 = hn(x + 1, y), c01 = hn(x, y + 1), c11 = hn(x + 1, y + 1);
    const gx = ((c10 + c11) - (c00 + c01)) / 2, gz = ((c01 + c11) - (c00 + c10)) / 2, alongZ = Math.abs(gz) >= Math.abs(gx), g = alongZ ? gz : gx; if (Math.abs(g) < .3) return null;
    const N = Math.max(2, Math.round(Math.abs(g) / .2)), hb = (wx, wz) => { const fx = wx - x, fz = wz - y; return (c00 * (1 - fx) + c10 * fx) * (1 - fz) + (c01 * (1 - fx) + c11 * fx) * fz; };
    const P2 = (u, sv) => alongZ ? [x + u, y + sv] : [x + sv, y + u], T = { pos: [], nor: [], uv: [], idx: [] }, R = { pos: [], nor: [], uv: [], idx: [] }; let pos, nor, uv, idx; const use = (o) => { ({ pos, nor, uv, idx } = o); };
    const face = (pts, nd, uvf) => { const [a, b, c] = pts, n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)); let q = pts; if (n.dot(nd) < 0) q = [pts[3], pts[2], pts[1], pts[0]];
      const nn = new THREE.Vector3().subVectors(q[1], q[0]).cross(new THREE.Vector3().subVectors(q[2], q[0])).normalize(), o = pos.length / 3; for (const p of q) { pos.push(p.x, p.y, p.z); nor.push(nn.x, nn.y, nn.z); const [u0, v0] = uvf(p); uv.push(u0 / span, v0 / span); } idx.push(o, o + 1, o + 2, o, o + 2, o + 3); };
    const ht = (j, u) => { const [wx, wz] = P2(u, j / (N - 1)); return hb(wx, wz); }, up = new THREE.Vector3(0, 1, 0), down = alongZ ? new THREE.Vector3(0, 0, Math.sign(g)) : new THREE.Vector3(Math.sign(g), 0, 0);
    for (let j = 0; j < N; j++) { const s0 = j / N, s1 = (j + 1) / N, pts = [[0, s0], [1, s0], [1, s1], [0, s1]].map(([u, sv]) => { const [wx, wz] = P2(u, sv); return new THREE.Vector3(wx, ht(j, u), wz); }); use(T); face(pts, up, (p) => [p.x, -p.z]); use(R);
      if (j < N - 1) { const r = [0, 1].flatMap((u) => { const [wx, wz] = P2(u, s1); return [new THREE.Vector3(wx, ht(j, u), wz), new THREE.Vector3(wx, ht(j + 1, u), wz)]; }); face([r[0], r[2], r[3], r[1]], (alongZ ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0)).multiplyScalar(ht(j + 1, .5) < ht(j, .5) ? 1 : -1), (p) => [alongZ ? p.x : p.z, p.y]); } }
    const mk = (o) => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(o.pos, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(o.nor, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(o.uv, 2)); geo.setIndex(o.idx); return geo; }; return [mk(T), mk(R)]; };
  // the beach runs down into the water: corners touching the sea sink to the waterline
  const EB = P.brief ? P.brief.edges : null, gx0 = EB && EB.w.exists ? 0 : -8, gx1 = EB && EB.e.exists ? MW : MW + 8, gy0 = EB && EB.n.exists ? 0 : -6, gy1 = EB && EB.s.exists ? MH : MH + 4;
  const seaCorner = (cx, cz) => [[0, 0], [-1, 0], [0, -1], [-1, -1]].some(([dx, dy]) => at(cx + dx, cz + dy) === 'sea');
  for (let y = gy0; y < gy1; y++) for (let x = gx0; x < gx1; x++) { const k = at(x, y); let t = GT[k] || 'grass';
    if (k === 'yard' && ((x * 7 + y * 13) % 5 === 0)) t = 'dirt';
    if (snow && (t === 'grass' || t === 'dirt' || t === 'path' || t === 'field' || t === 'sand')) t = 'snow';
    const stp = HA && STEPK.has(k) ? stepAt(x, y, 4) : null;
    if (stp) (byTex.riser = byTex.riser || []).push(stp[1]);
    (byTex[t] = byTex[t] || []).push(stp ? stp[0] : planeAt(x, y, WATERK.has(k) ? -.35 : 0, t === 'water' || t === 'sea' ? 1 : 4, k === 'beach' ? seaCorner : null));
    // seams: where this map meets a neighbour, a skirt hangs down from the edge so a small height step between the two maps never opens a crack onto the sky
    if (EB) for (const [sd, on, a, b] of [['w', x === 0, [x, y + 1], [x, y]], ['e', x === MW - 1, [x + 1, y], [x + 1, y + 1]], ['n', y === 0, [x, y], [x + 1, y]], ['s', y === MH - 1, [x + 1, y + 1], [x, y + 1]]]) { if (!on || !EB[sd].exists) continue;
      const h0 = WATERK.has(k) ? -.35 : 0, ya = h0 + (cornerOf(x, y, a[0], a[1]) || 0), yb = h0 + (cornerOf(x, y, b[0], b[1]) || 0), g = new THREE.PlaneGeometry(1, 1), p = g.attributes.position, uv = g.attributes.uv;
      const V4 = [[a[0], ya, a[1]], [b[0], yb, b[1]], [a[0], ya - 2.5, a[1]], [b[0], yb - 2.5, b[1]]]; V4.forEach((v, i) => { p.setXYZ(i, v[0], v[1], v[2]); uv.setXY(i, (v[0] + v[2]) / 4, v[1] / 4); }); g.computeVertexNormals(); const g2 = g.clone(); g2.setIndex([...g.index.array].reverse()); g2.computeVertexNormals(); (byTex[t] = byTex[t] || []).push(g, g2); }
    if (!stp && (autumn && (t === 'grass' || t === 'cobble' || t === 'pave' || t === 'dirt') && ((x * 5 + y * 3) % 4 !== 0)) || (snow && t !== 'snow' && t !== 'water' && t !== 'sea')) (byTex[snow ? (t === 'pave' ? 'snowdust' : 'snowfull') : 'leaves_fall'] = byTex[snow ? (t === 'pave' ? 'snowdust' : 'snowfull') : 'leaves_fall'] || []).push(planeAt(x, y, .004, 4)); }
  const groundTint = { riser: 0x9a9088, sand: 0xe2c48e, field: autumn ? 0xc8a070 : 0xb09070, grass: autumn ? 0xd8c07a : 0xffffff, dirt: snow ? 0xdde2ea : 0xffffff, cobble: snow ? 0xc8ccd4 : 0xffffff, setts: snow ? 0xc8ccd4 : 0xffffff, pave: snow ? 0xd8dce4 : 0xffffff, path: snow ? 0xe0e4ec : 0xffffff };
  for (const [t, geos] of Object.entries(byTex)) { const over = t === 'leaves_fall' || t === 'snowdust';
    if (t === 'snowfull') { const m = new THREE.Mesh(mergeGeometries(geos), new THREE.MeshStandardMaterial({ map: tex('m/snow'), roughness: .9 })); m.receiveShadow = true; scene.add(m); continue; }   // lanes in shade keep their snow: bare cobbles read as black holes
    if (t === 'snowdust') { const m = new THREE.Mesh(mergeGeometries(geos), new THREE.MeshStandardMaterial({ map: tex('m/snowpatch'), alphaTest: .5, roughness: .9 })); m.receiveShadow = true; scene.add(m); continue; }
    const mat = t === 'sea' ? Mt.water : t === 'water' ? (snow ? new THREE.MeshStandardMaterial({ color: 0xc8d8e8, roughness: .3, metalness: .1 }) : Mt.water) : new THREE.MeshStandardMaterial({ map: tex('m/' + (t === 'snowdust' ? 'snow' : TEXF[t] || t)), roughness: t === 'pave' ? .75 : .95, color: groundTint[t] ?? 0xffffff, transparent: over, opacity: t === 'snowdust' ? .55 : 1, alphaTest: t === 'leaves_fall' ? .5 : 0, depthWrite: !over });
    const m = new THREE.Mesh(mergeGeometries(geos), mat); m.receiveShadow = true; scene.add(m); }
  // banks: dressed stone where water meets land, timber under piers; the beach slopes in on its own
  for (let y = gy0; y < gy1; y++) for (let x = gx0; x < gx1; x++) { if (!WATERK.has(at(x, y))) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = at(x + dx, y + dy); if (WATERK.has(n) || n === 'beach') continue; const k = n === 'pier' ? 'wood' : 'stone';
      if (dy < 0) cube(k, x, -.4, y - .08, x + 1, .02, y, 32, 32, 'b'); else if (dy > 0) cube(k, x, -.4, y + 1, x + 1, .02, y + 1.08, 32, 32, 'b');
      else if (dx < 0) cube(k, x - .08, -.4, y, x, .02, y + 1, 32, 32, 'b'); else cube(k, x + 1, -.4, y, x + 1.08, .02, y + 1, 32, 32, 'b'); } }
  // terraces: where one cell's ground stands above its neighbour's (a house platform, a churchyard wall, a cut into the hill) a dressed-stone face fills the step
  Bk.setLift(0);
  for (let y = gy0; y < gy1; y++) for (let x = gx0; x < gx1; x++) { if (WATERK.has(at(x, y))) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, nk = at(nx, ny); if (WATERK.has(nk) && nk !== 'ditch') continue; const deep = nk === 'ditch' ? .42 : .02;
      const c0 = dx > 0 ? [x + 1, y] : dx < 0 ? [x, y] : dy > 0 ? [x, y + 1] : [x, y], c1 = dx > 0 ? [x + 1, y + 1] : dx < 0 ? [x, y + 1] : dy > 0 ? [x + 1, y + 1] : [x + 1, y];
      const a0 = cornerOf(x, y, c0[0], c0[1]), a1 = cornerOf(x, y, c1[0], c1[1]), b0 = cornerOf(nx, ny, c0[0], c0[1]), b1 = cornerOf(nx, ny, c1[0], c1[1]);
      if (a0 < b0 - 1e-3 || a1 < b1 - 1e-3 || Math.max(a0 - b0, a1 - b1) < .03) continue;
      const p0 = V(c0[0], b0 - deep, c0[1]), p1 = V(c1[0], b1 - deep, c1[1]), p2 = V(c1[0], a1, c1[1]), p3 = V(c0[0], a0, c0[1]), out = V(nx + .5, (a0 + b0) / 2, ny + .5);
      const n = new THREE.Vector3().subVectors(p1, p0).cross(new THREE.Vector3().subVectors(p3, p0)), m = p0.clone().add(p1).add(p2).add(p3).multiplyScalar(.25);
      if (n.dot(new THREE.Vector3().subVectors(out, m)) < 0) quad('ashlar', p1, p0, p3, p2, 64, 64); else quad('ashlar', p0, p1, p2, p3, 64, 64);
      if (at(x, y) === 'cliff' && Math.min(a0 - b0, a1 - b1) > 1) { const t = Math.min(a0, a1), ix = dx > 0 ? -.16 : dx < 0 ? .16 : 0, iz = dy > 0 ? -.16 : dy < 0 ? .16 : 0; cube('ashlar', Math.min(c0[0], c1[0], c0[0] + ix), t, Math.min(c0[1], c1[1], c0[1] + iz), Math.max(c0[0], c1[0], c0[0] + ix), t + .42, Math.max(c0[1], c1[1], c0[1] + iz), 64, 64, 'b'); } } }
  // weirs: where the moat steps down the hill, a stone sill holds back each pool
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (at(x, y) !== 'ditch') continue; for (const [dx, dy] of [[1, 0], [0, 1]]) { if (!inG(x + dx, y + dy) || at(x + dx, y + dy) !== 'ditch') continue;
    const a = flat[I(x, y)], b = flat[I(x + dx, y + dy)]; if (Math.abs(a - b) < .05) continue; const top = Math.max(a, b) - .3, bot = Math.min(a, b) - .4;
    if (dx) cube('ashlar', x + 1 - .09, bot, y, x + 1 + .09, top, y + 1, 64, 64, 'b'); else cube('ashlar', x, bot, y + 1 - .09, x + 1, top, y + 1 + .09, 64, 64, 'b'); } }
  Bk.setLift(null);
  // bridges: stone parapets over the river, timber rails over the ditch and streams
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (at(x, y) !== 'bridge') continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = at(x + dx, y + dy); if (!WATERK.has(n)) continue; const big = n === 'river';
      const [x0, z0, x1, z1] = dx > 0 ? [x + .86, y, x + 1, y + 1] : dx < 0 ? [x, y, x + .14, y + 1] : dy > 0 ? [x, y + .86, x + 1, y + 1] : [x, y, x + 1, y + .14];
      if (big) { cube('ashlar', x0, 0, z0, x1, .62, z1, 64, 64, 'b'); cube('stone', x0 - .02, .62, z0 - .02, x1 + .02, .7, z1 + .02, 32, 32, 'b'); }
      else { cube('wood', x0 + (dy ? 0 : .03), .5, z0 + (dx ? 0 : .03), x1 - (dy ? 0 : .03), .58, z1 - (dx ? 0 : .03), 32, 32, ''); for (const t of [.1, .9]) { const px = dy ? x + t : (x0 + x1) / 2, pz = dx ? y + t : (z0 + z1) / 2; cube('beam', px - .04, 0, pz - .04, px + .04, .62, pz + .04, 32, 32, ''); } }
      solids.push([x0, z0, x1, z1]); } }
  // pier posts and bollards
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (at(x, y) === 'pier') for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1]]) if (at(x + dx, y + dy) === 'sea') {
    const px = dx > 0 ? x + .94 : dx < 0 ? x + .06 : x + .5, pz = dy > 0 ? y + .94 : y + .5; cube('beam', px - .07, -.6, pz - .07, px + .07, .22, pz + .07, 32, 32, ''); solids.push([px - .1, pz - .1, px + .1, pz + .1]); }
  // gutters: a darker channel down the middle of the main street and along the cross street
  const gut = [];

  // ---------- houses ----------
  const occ = (x, y) => { const k = at(x, y); return k === 'lot' || k === 'church' || k === 'guild' || k === 'wall' || k === 'bld' || k === 'court'; };
  const GH = 1.8, UH = 1.42;
  const STY = {
    rich: { walls: ['plaster_cream', 'plaster_white', 'plaster_ochre', 'plaster_rose'], ground: ['ashlar', 'ashlar', 'plaster'], roofs: ['roof_slate', 'roof_slate', 'roof_terra'], st: [2, 3], timber: .4 },
    common: { walls: ['plaster_cream', 'plaster_ochre', 'plaster_rose', 'plaster_white'], ground: ['plaster', 'ashlar'], roofs: ['roof_terra', 'roof_terra', 'roof_brown', 'roof_slate'], st: [1, 3], timber: .6 },
    craft: { walls: ['brick', 'plaster_cream', 'plaster_ochre'], ground: ['brick', 'plaster'], roofs: ['roof_brown', 'roof_brown', 'roof_slate'], st: [1, 2], timber: .4 },
    poor: { walls: ['plaster_cream', 'plaster_ochre', 'plaster_white'], ground: ['plaster'], roofs: ['roof_thatch', 'roof_thatch', 'roof_brown'], st: [1, 2], timber: .7 },
    ware: { walls: ['brick', 'plaster_white', 'plaster_cream', 'brick'], ground: ['brick', 'ashlar'], roofs: ['roof_brown', 'roof_slate', 'roof_terra'], st: [3, 4], timber: .25 },
    cottage: { walls: ['plaster_white', 'plaster_cream', 'plaster_white', 'plaster_ochre'], ground: ['plaster'], roofs: ['roof_thatch', 'roof_thatch', 'roof_brown'], st: [1, 2], timber: .25 },
    miner: { walls: ['plaster_ochre', 'plaster_cream', 'plaster_white'], ground: ['plaster', 'ashlar'], roofs: ['roof_brown', 'roof_slate', 'roof_brown'], st: [1, 1], timber: .2 },
  };
  const awn = new Set();   // street cells under a shop's awning or sign: no lamp posts there
  const shopSign = [['cloth_red', 0xb03a2a], ['cloth_teal', 0x2a8a8a], ['cloth_green', 0x6a9a50], ['cloth_ochre', 0xd0a040], ['cloth_linen', 0xe8e0d0]];
  // the town's chronicle (fork): what its past left: houses empty, plots burned, refugees camped, the dead buried; drawn over the plan,
  // never changing it, so the streets the party knows stay where they were (spec.chron: empty, ruined, camp, refugees, burialGround, memorial, lost, prosperity)
  const CH = spec.chron || window.CHRON || null, h01 = (k) => ((Math.imul(k + 1, 2654435761) ^ Math.imul(seed + 977, 40503)) >>> 0) / 4294967296;
  const lotFate = (L) => { if (!CH) return ''; const k = (L.plot ?? L.id) * 3; if (L.dist !== 'rich' && L.dist !== 'ware' && h01(k + 1) < (CH.ruined || 0)) return 'burnt';
    if (['common', 'poor', 'craft', 'cottage', 'miner'].includes(L.dist) && h01(k + 2) < (CH.empty || 0) / .85) return 'empty'; return ''; };
  const campTents = [];
  // a burned house: a low stone footing, the charred posts of its frame standing to uneven heights, its stone chimney stack still up,
  // ash and fallen beams on the floor
  const burnt = (L, W, D, lbox) => { P.chronAt.burnt.push([L.x + L.w / 2, L.y + L.d / 2]); const rb = rngOf(seed * 131 + ((L.plot ?? L.id) + 1) * 17), t = .18;
    lbox('stone', -.02, -.05, 0, W + .02, D + .02, .12, 32, 32, 'b'); lbox('soil', .1, .1, .12, W - .1, D - .1, .14, 32, 32, '');
    for (let k = 0; k < 4 + Math.floor(rb() * 3); k++) { const a = .3 + rb() * (W - .6), d = .3 + rb() * (D - .6), r0 = .25 + rb() * .35; lbox('dark', a - r0, d - r0 * .7, .14, a + r0, d + r0 * .7, .155, 16, 16, ''); }   // ash
    for (const [a0, d0, a1, d1] of [[0, 0, W, 0], [0, D - t, W, D], [0, 0, t, D], [W - t, 0, W, D]]) lbox('stone', a0, d0, .12, a1, d1, .32 + rb() * .12, 32, 32, '');   // the footing
    // posts at the corners and along the front and back, each burned down to its own height; a few still carry a stub of the rail
    const posts = []; for (const d of [0, D - .12]) for (let a = 0; a <= W + .01; a += Math.max(.4, W / Math.max(1, Math.round(W / .9)))) posts.push([Math.min(W - .12, a), d]);
    for (const a of [0, W - .12]) for (let d = Math.max(.4, D / Math.max(1, Math.round(D / .9))); d < D - .2; d += Math.max(.4, D / Math.max(1, Math.round(D / .9)))) posts.push([a, d]);
    for (const [a, d] of posts) { if (rb() < .18) continue; const h = .5 + rb() * rb() * 2.4; lbox('dark', a, d, .3, a + .12, d + .12, .3 + h, 16, 16, '');
      if (h > 1.3 && rb() < .5) lbox('dark', a - .02, d - .02, .3 + h - .12, a + .14 + (a < W / 2 ? .35 : -.35) * (d < D / 2 ? 1 : 1), d + .14, .3 + h - .02, 16, 16, ''); }
    { const ca = rb() < .5 ? .15 : W - .7, cd = D - .7; lbox('stone', ca, cd, .12, ca + .55, cd + .55, 2.6 + rb() * .8, 32, 32, ''); lbox('dark', ca + .1, cd + .1, 2.4, ca + .45, cd + .45, 3.5, 16, 16, ''); }   // the chimney stack
    for (let k = 0; k < 2 + Math.floor(rb() * 2); k++) { const along = rb() < .5, c = .35 + rb() * ((along ? D : W) - .7), y = .15 + k * .07;   // fallen beams
      if (along) lbox('dark', .25, c - .06, y, W - .25, c + .06, y + .12, 16, 16, ''); else lbox('dark', c - .06, .25, y, c + .06, D - .25, y + .12, 16, 16, ''); }
    for (let k = 0; k < 5 + Math.floor(rb() * 5); k++) { const a = .3 + rb() * (W - .6), d = .3 + rb() * (D - .6), sz = .07 + rb() * .12; lbox(rb() < .6 ? 'stone' : 'dark', a - sz, d - sz, .14, a + sz, d + sz * .8, .14 + sz * 1.2, 16, 16, ''); } };
  P.campTents = campTents; P.chronAt = { burnt: [], burial: null, memorial: null };
  const houseInfo = [], HOUSES = []; window.__HOUSES = HOUSES; P.HOUSES = HOUSES;   // HOUSES: each house's shell, read by the interior planner
  // blocks: connected building ground; a block keeps one roof covering per district (a few houses re-roofed), so corners read as one roofscape
  const comp = new Int16Array(MW * MH).fill(-1); { let n = 0; for (let i = 0; i < MW * MH; i++) if (P.g[i] === 'lot' && comp[i] < 0) { const q = [i]; comp[i] = n;
    while (q.length) { const c = q.pop(), cx = c % MW, cy = (c / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = cx + dx, y = cy + dy; if (at(x, y) === 'lot' && comp[I(x, y)] < 0) { comp[I(x, y)] = n; q.push(I(x, y)); } } } n++; } }
  const blockRoof = new Map(), lotSt = new Map(), rI = rngOf(seed * 31 + 7);   // icicles draw from their own stream: winter builds the same town as summer
  const fw = (L) => (L.f === 'N' || L.f === 'S') ? L.w : L.d;
  const innLot = lots.filter((L) => L.street === 'square' && L.f !== 'N' && fw(L) >= 3).sort((a, b) => (a.f === 'S' ? 0 : 1) - (b.f === 'S' ? 0 : 1) || fw(b) - fw(a))[0];
  // alehouses: about one drink-house per 187 people (1577 survey), the inn being one of them; ordinary houses on ordinary streets, from their own random stream
  const rA = rngOf(seed * 53 + 11), aleN = Math.max(1, Math.floor(lots.length * 4.5 / 187) - 1);
  const aleLots = new Set(lots.filter((L) => L !== innLot && !dropLot.has(L.id) && ['common', 'poor', 'craft'].includes(L.dist) && L.street !== 'square').map((L) => [rA(), L]).sort((a, b) => a[0] - b[0]).slice(0, aleN).map((q) => q[1].id));
  for (const L of lots) {
    if (dropLot.has(L.id)) continue;
    Bk.setLift(lotPlat[L.id]);
    // each house draws from its own stream (fork): a house burned or left empty leaves every other house as it was
    const r = rngOf(seed * 977 + ((L.plot ?? L.id) + 1) * 7919), ri = (a, b) => a + Math.floor(r() * (b - a + 1)), pick = (a) => a[Math.floor(r() * a.length)];
    const isInn = L === innLot, hj = .9 + r() * .2, fate = isInn ? '' : lotFate(L);
    // a city quarter keeps its own walls, roofs and timber framing (its chief trade colours the shop signs); the poor and the rich keep theirs
    const sty0 = STY[L.dist], qk = P.nav && L.ward >= 0 ? P.nav.quarter(L.ward) : null;
    const sty = qk ? { ...sty0, walls: L.dist === 'poor' || L.dist === 'cottage' ? sty0.walls : qk.walls, roofs: L.dist === 'poor' || L.dist === 'cottage' ? sty0.roofs : qk.roofs, ground: L.dist === 'rich' ? sty0.ground : qk.ground, timber: qk.timber } : sty0;
    // local frame: a along the front (0..W), d into the lot from the front (0..D), y up
    const W = (L.f === 'N' || L.f === 'S') ? L.w : L.d, D = (L.f === 'N' || L.f === 'S') ? L.d : L.w;
    const toW = (a, d) => { switch (L.f) { case 'S': return [L.x + a, L.y + L.d - d]; case 'N': return [L.x + L.w - a, L.y + d]; case 'E': return [L.x + L.w - d, L.y + L.d - a]; default: return [L.x + d, L.y + a]; } };
    const P3 = (a, d, y) => { const [x, z] = toW(a, d); return V(x, y, z); };
    const lbox = (key, a0, d0, y0, a1, d1, y1, tw, th, skip) => { const [xa, za] = toW(a0, d0), [xb, zb] = toW(a1, d1);
      // a front feature (door, shop void, sill) never shows a face into the house: it would float in the see-through cut
      if (Math.max(d0, d1) <= .001) { const [ix, iz] = toW(a0, 1), [ox, oz] = toW(a0, 0), dx = ix - ox, dz = iz - oz; skip = (skip || '') + (Math.abs(dz) > Math.abs(dx) ? (dz > 0 ? 's' : 'n') : (dx > 0 ? 'e' : 'w')); } cube(key, Math.min(xa, xb), y0, Math.min(za, zb), Math.max(xa, xb), y1, Math.max(za, zb), tw, th, skip); };
    // outward faces only where the outside is not another building (no windows into a neighbour)
    const cellOut = (a, d, dir) => { // dir: 'f' front, 'b' back, 'l' a<0, 'r' a>W
      const [x, z] = toW(Math.min(W - .5, Math.max(.5, a)), Math.min(D - .5, Math.max(.5, d)));
      const [x0, z0] = toW(Math.min(W - .5, Math.max(.5, a)) + (dir === 'r' ? 1 : dir === 'l' ? -1 : 0), Math.min(D - .5, Math.max(.5, d)) + (dir === 'b' ? 1 : dir === 'f' ? -1 : 0));
      const ox = Math.floor(x0), oz = Math.floor(z0); return !(occ(ox, oz) && lotId[I(ox, oz)] !== L.id); };
    if (fate === 'burnt') { burnt(L, W, D, lbox); continue; }
    let st = ri(sty.st[0], sty.st[1]);
    // never more than a storey's step from a neighbour already standing: no cliffs of blank party wall
    { const ns = new Set(); for (let y = L.y - 1; y <= L.y + L.d; y++) for (let x = L.x - 1; x <= L.x + L.w; x++) { if (x >= L.x && x < L.x + L.w && y >= L.y && y < L.y + L.d) continue; const o = x >= 0 && y >= 0 && x < MW && y < MH ? lotId[I(x, y)] : -1; if (o >= 0 && lotSt.has(o)) ns.add(lotSt.get(o)); }
      if (ns.size) st = Math.max(Math.min(st, Math.min(...ns) + 1), Math.max(...ns) - 1, 1); }
    if (L.street === 'square' && P.rank >= 1 && (L.dist === 'rich' || L.dist === 'common' || L.dist === 'craft')) st = Math.max(st, 3);
    if (L.street === 'quay' && L.dist === 'ware') st = Math.max(st, 3);
    if (isInn) st = 3;
    if (L.street === 'alley' || L.street === 'lane') st = Math.max(1, st - 1);
    // the near (south) edge of the town drops a storey so the street behind stays readable
    if (P.walls && P.basis !== 'port' && L.y > P.walls.y1 - 5) st = Math.min(st, 2);
    if (L.f === 'N') st = Math.min(st, L.street === 'square' ? 2 : 2), st = L.street === 'alley' || L.street === 'lane' ? 1 : st;
    lotSt.set(L.id, st);
    const timber = r() < sty.timber && st > 1, wallK = pick(sty.walls), gk = pick(sty.ground), groundK = gk === 'plaster' ? wallK : gk;
    // the block's own roof, from the block's own stream: the same whichever house in it is drawn first (one may be burned)
    const bk = comp[I(L.x, L.y)] + ':' + L.dist; if (!blockRoof.has(bk)) { const rb0 = rngOf(seed * 31 + (comp[I(L.x, L.y)] + 1) * 1013 + Object.keys(STY).indexOf(L.dist) * 7); blockRoof.set(bk, sty.roofs[Math.floor(rb0() * sty.roofs.length)]); } let roofK = r() < .15 ? pick(sty.roofs) : blockRoof.get(bk); const roofVar = roofK + '#' + Math.floor(r() * 4);
    const jet = timber ? .55 : 0, shutter = pick(['shutter_g', 'shutter_b', 'shutter_r', 'door']), flowers = L.dist !== 'poor' && r() < .45 && fate !== 'empty', flowerK = pick(['fl_r', 'fl_y', 'fl_w', 'fl_p']);
    const byGate = P.gates.some((G) => Math.hypot(L.x + L.w / 2 - G.cx, L.y + L.d / 2 - G.cy) < 5.5);   // just inside the gate: plain fronts, no awnings or signs poking into the passage view
    const isShop = !isInn && !byGate && L.dist !== 'cottage' && L.dist !== 'miner' && L.dist !== 'ware' && (L.street === 'main' || L.street === 'square' || L.street === 'quay' || (L.street === 'street' && r() < .35)) && W >= 2 && !aleLots.has(L.id) && fate !== 'empty';
    const HS = { id: L.id, plot: L.plot, ward: L.ward, empty: fate === 'empty', x: L.x, y: L.y, w: L.w, d: L.d, f: L.f, street: L.street, dist: L.dist, W, D, st, timber, shop: isShop, inn: isInn, ale: aleLots.has(L.id), plat: lotPlat[L.id] }; HOUSES.push(HS);
    if (isShop) { const [fx2, fz2] = { S: [0, 1], N: [0, -1], E: [1, 0], W: [-1, 0] }[L.f]; for (let i = 0; i < L.w; i++) for (let j = 0; j < L.d; j++) { const x = L.x + i, y = L.y + j; if (at(x + fx2, y + fz2) !== 'lot') awn.add(I(x + fx2, y + fz2)); } }
    const hs = []; let y = 0; // storey bands
    for (let i = 0; i < st; i++) { const h = (i === 0 ? GH : UH) * (i === 0 ? 1 : hj); hs.push([y, y + h, i ? jet * Math.min(i, 2) : 0]); y += h; }
    const eave = y, topJ = hs[hs.length - 1][2];
    // walls, storey by storey; jettied storeys stand forward of the one below
    hs.forEach(([y0, y1, j], i) => {
      const k = i === 0 ? groundK : wallK;
      const tw = k === 'brick' ? 64 : 64;
      lbox(k, 0, -j, y0, W, D, y1, tw, 64, 'tb');
      if (j > 0) { // jetty: floor joists poking out under the overhang, and the soffit
        lbox('beam', 0, -j, y0 - .02, W, 0, y0 + .08, 32, 32, '');
        for (let a = .25; a < W; a += .5) lbox('beam', a - .07, -j - .09, y0 - .14, a + .07, 0, y0, 32, 32, '');
        lbox('beam', 0, -j - .06, y0 - .02, W, -j + .04, y0 + .16, 32, 32, ''); }   // bressumer: the heavy beam carrying the overhang
      // timber frame: corner posts, sill and head rails, braces in the end panels, studs between the windows
      if (timber && i > 0) {
        const fz = -j - .035;
        lbox('beam', 0, fz, y0, W, -j, y0 + .1, 32, 32, ''); lbox('beam', 0, fz, y1 - .1, W, -j, y1, 32, 32, '');
        lbox('beam', 0, fz, y0, .12, -j, y1, 32, 32, ''); lbox('beam', W - .12, fz, y0, W, -j, y1, 32, 32, '');
        for (let a = 1; a < W; a += 1) lbox('beam', a - .05, fz, y0, a + .05, -j, y1, 32, 32, '');
        // braces: rotated thin boxes in the corner panels
        for (const [a0, sgn] of [[.12, 1], [W - .12, -1]]) { const len = Math.hypot(.36, y1 - y0 - .2), ang = Math.atan2(y1 - y0 - .2, .36);
          const [cx, cz] = toW(a0 + sgn * .18, fz / 2 + -j / 2 * 0); const m = new THREE.Matrix4();
          const yaw = L.f === 'S' ? 0 : L.f === 'N' ? Math.PI : L.f === 'E' ? Math.PI / 2 : -Math.PI / 2;
          m.compose(V(cx, (y0 + y1) / 2, cz), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, sgn * ang)), V(1, 1, 1));
          // place on the front face: shift outward by the jetty
          { const [bx, bz] = toW(a0 + sgn * .18, fz - .01); m.setPosition(V(bx, (y0 + y1) / 2, bz)); }   // on the frame's face (it was shifted out twice and floated off jettied fronts)
          geo('beam', new THREE.BoxGeometry(.08, len, .05), m); }
      }
      // string course over the stone ground floor
      if (i === 0 && st > 1) lbox('stone', -.02, -j - .06, y1 - .08, W + .02, D, y1 + .02, 32, 32, 'b');
    });
    // plinth with a lit top
    lbox('stone', -.02, -.05, 0, W + .02, D + .02, .16, 32, 32, 'b');
    { const [xa, za] = toW(0, -jet), [xb, zb] = toW(W, D); const x0 = Math.min(xa, xb), x1 = Math.max(xa, xb), z0 = Math.min(za, zb), z1 = Math.max(za, zb); quad('floor', V(x0, .3, z1), V(x1, .3, z1), V(x1, .3, z0), V(x0, .3, z0), 128, 128); }
    // windows: front on every storey, back and open sides on upper storeys; glass, frame, sill, shutters
    const litWin = () => { const v = r() < .55; return !day && v && fate !== 'empty'; };   // always draws, so night builds the same town as day
    const win = (face, a, y0, w, h, jj, quiet) => { // face: front/back; quiet: draw from a side stream so the town's random sequence is unchanged
      const out = face === 'f' ? -jj : D, s = face === 'f' ? -1 : 1, o = out + s * .002;
      const dO = (v) => out + s * v; // depth outward from the wall
      const g = (quiet ? !day && L.id % 2 && fate !== 'empty' : litWin()) ? 'glass_lit' : 'glass';
      lbox(g, a - w / 2, Math.min(o, dO(.01)), y0, a + w / 2, Math.max(o, dO(.01)), y0 + h, 16, 16, '');
      lbox('wood', a - w / 2 - .06, Math.min(out, dO(.05)), y0 - .02, a - w / 2, Math.max(out, dO(.05)), y0 + h + .02, 32, 32, '');
      lbox('wood', a + w / 2, Math.min(out, dO(.05)), y0 - .02, a + w / 2 + .06, Math.max(out, dO(.05)), y0 + h + .02, 32, 32, '');
      lbox('wood', a - w / 2 - .06, Math.min(out, dO(.06)), y0 + h, a + w / 2 + .06, Math.max(out, dO(.06)), y0 + h + .08, 32, 32, '');
      lbox('wood', a - .025, Math.min(out, dO(.03)), y0, a + .025, Math.max(out, dO(.03)), y0 + h, 32, 32, '');                    // mullion
      lbox('wood', a - w / 2, Math.min(out, dO(.03)), y0 + h * .55, a + w / 2, Math.max(out, dO(.03)), y0 + h * .55 + .04, 32, 32, '');  // transom
      lbox('stone', a - w / 2 - .1, Math.min(out, dO(.13)), y0 - .09, a + w / 2 + .1, Math.max(out, dO(.13)), y0, 32, 32, '');      // sill
      if (face === 'f' && y0 > 1 && flowers && !snow) { lbox('wood', a - w / 2, Math.min(out, dO(.2)), y0 - .2, a + w / 2, Math.max(out, dO(.2)), y0 - .08, 32, 32, '');
        for (let k = 0; k < 4; k++) { const fa = a - w / 2 + .07 + k * (w - .14) / 3; lbox(k % 2 ? 'fl_g' : flowerK, fa - .05, Math.min(out, dO(.18)), y0 - .08, fa + .05, Math.max(out, dO(.08)), y0 + .02 + (k % 2) * .03, 16, 16, ''); } }
      if (fate === 'empty' && face === 'f') lbox(shutter === 'door' ? 'door' : shutter, a - w / 2 - .03, Math.min(out, dO(.075)), y0 - .03, a + w / 2 + .03, Math.max(out, dO(.075)), y0 + h + .03, 32, 32, '');   // an empty house: shutters closed
      else if (shutter !== 'door' && face === 'f') for (const sg of [-1, 1]) lbox(shutter, a + sg * (w / 2 + .06), Math.min(out, dO(.04)), y0, a + sg * (w / 2 + .06 + w * .48), Math.max(out, dO(.04)), y0 + h, 32, 32, '');
      if (face === 'f' && !quiet && r() < .25 && !day) {} };
    const nWin = Math.max(1, Math.round(W / .95));
    hs.forEach(([y0, y1, j], i) => {
      const ww = i === 0 ? .5 : .46, wh = i === 0 ? .7 : .72;
      if (i > 0) for (let k = 0; k < nWin; k++) win('f', (k + .5) * W / nWin, y0 + .38, ww, wh, j);
      if (i > 0 && cellOut(W / 2, D - .5, 'b')) for (let k = 0; k < Math.max(1, nWin - 1); k++) win('b', (k + .5) * W / Math.max(1, nWin - 1), y0 + .42, .36, .58, 0);
    });
    // side walls that face open air: timber frame on timber houses, and windows
    for (const sd of ['l', 'r']) if (cellOut(sd === 'l' ? 0 : W, D / 2, sd)) {
      const a = sd === 'l' ? -.03 : W + .03, a2 = sd === 'l' ? 0 : W;
      if (timber) hs.forEach(([y0, y1, j], i) => { if (i === 0) return;
        lbox('beam', Math.min(a, a2), -j, y0, Math.max(a, a2), D, y0 + .1, 32, 32, ''); lbox('beam', Math.min(a, a2), -j, y1 - .1, Math.max(a, a2), D, y1, 32, 32, '');
        for (let d = -j; d <= D + .01; d += (D + j) / Math.max(2, Math.round(D + j))) lbox('beam', Math.min(a, a2), d - .05, y0, Math.max(a, a2), d + .05, y1, 32, 32, ''); });
      if (!timber && r() < .4) lbox('lead', Math.min(a, a2) - .03, -.02, .1, Math.max(a, a2) + .03, .06, eave, 16, 16, '');
    }
    for (const sd of ['l', 'r']) if (D >= 2) for (const dpos of D >= 3 ? [D * .3, D * .72] : [D / 2]) { if (!cellOut(sd === 'l' ? 0 : W, dpos, sd)) continue;
      hs.forEach(([y0], i) => { if (i === 0) return; const a = sd === 'l' ? -.001 : W + .001;
        const [x0, z0] = toW(a, dpos - .2), [x1, z1] = toW(a, dpos + .2), out = sd === 'l' ? -1 : 1;
        const lx = Math.min(x0, x1), hx = Math.max(x0, x1), lz = Math.min(z0, z1), hz = Math.max(z0, z1);
        const nx = (L.f === 'S' || L.f === 'N') ? (L.f === 'S' ? out : -out) * .02 : 0, nz = (L.f === 'E' || L.f === 'W') ? (L.f === 'W' ? out : -out) * .02 : 0;
        cube(litWin() ? 'glass_lit' : 'glass', lx + Math.min(0, nx), y0 + .45, lz + Math.min(0, nz), hx + Math.max(0, nx), y0 + 1.0, hz + Math.max(0, nz), 16, 16, '');
        cube('wood', lx + Math.min(0, nx * 2) - (nz ? .05 : 0), y0 + .4, lz + Math.min(0, nz * 2) - (nx ? .05 : 0), hx + Math.max(0, nx * 2) + (nz ? .05 : 0), y0 + .45, hz + Math.max(0, nz * 2) + (nx ? .05 : 0), 32, 32, '');
        cube('wood', lx + Math.min(0, nx * 2) - (nz ? .05 : 0), y0 + 1.0, lz + Math.min(0, nz * 2) - (nx ? .05 : 0), hx + Math.max(0, nx * 2) + (nz ? .05 : 0), y0 + 1.06, hz + Math.max(0, nz * 2) + (nx ? .05 : 0), 32, 32, '');
        cube('stone', lx - .08 + Math.min(0, nx * 4), y0 + .38, lz - .08 * (nz ? 0 : 0) + Math.min(0, nz * 4), hx + .08 * 0 + Math.max(0, nx * 4), y0 + .45, hz + Math.max(0, nz * 4), 32, 32, ''); }); }
    // ground floor: a shop (open front, counter, awning, sign) or a door with a window
    {
      // the door must open onto street, never onto the next lot: lots wider than their street frontage keep the door on the frontage
      const frontOK = (a) => { const [fx, fz] = toW(a, -.5); return WALKK.has(at(Math.floor(fx), Math.floor(fz))); };
      let doorA = W >= 2 ? (r() < .5 ? .55 : W - .55) : W / 2;
      if (W >= 2 && !frontOK(doorA)) { const alt = [W - doorA, ...Array.from({ length: W }, (_, k) => k + .5)].find((a) => frontOK(a)); if (alt != null) doorA = alt; }
      const door = (a, hw = .36) => { HS.doorA = a; HS.door = toW(a, -.45); HS.doorW = hw * 2; houseInfo.push({ door: toW(a, -.45), kind: isInn ? 'inn' : isShop ? 'shop' : 'home', hid: HS.id, empty: fate === 'empty' });
        if (fate === 'empty') for (const py of [.5, 1.05]) lbox('wood', a - hw - .14, -.09, py, a + hw + .14, -.04, py + .13, 32, 32, '');   // boarded up lbox('door', a - hw, -.03, .16, a + hw, 0, 1.45, 32, 32, ''); lbox('stone', a - hw - .1, -.08, .16, a - hw, 0, 1.55, 32, 32, ''); lbox('stone', a + hw, -.08, .16, a + hw + .1, 0, 1.55, 32, 32, '');
        lbox('stone', a - hw - .1, -.08, 1.45, a + hw + .1, 0, 1.58, 32, 32, ''); lbox('stone', a - hw - .14, -.32, 0, a + hw + .14, 0, .1, 32, 32, '');   // jambs, lintel, step
        lbox('iron', a + .18, -.06, .75, a + .24, -.03, .82, 16, 16, ''); };
      if (isShop) {
        // a two-bay shop keeps a door beside its window: established shops are walked into, the door never stands behind the counter
        const mir = !frontOK(W >= 3 ? W - .55 : W - .5) && frontOK(W >= 3 ? .55 : .5);   // door end faces the next lot: mirror, door on the street end
        const s0 = mir ? (W >= 3 ? 1.1 : 1.0) : W >= 3 ? .3 : .2, s1 = mir ? W - (W >= 3 ? .3 : .2) : W - (W >= 3 ? 1.1 : 1.0);
        const shopEnd = s1;
        lbox('dark', s0, -.01, .25, shopEnd, 0, 1.45, 32, 32, '');
        lbox('wood', s0 - .08, -.06, .16, s0, 0, 1.55, 32, 32, ''); lbox('wood', shopEnd, -.06, .16, shopEnd + .08, 0, 1.55, 32, 32, ''); lbox('beam', s0 - .1, -.08, 1.45, shopEnd + .1, 0, 1.6, 32, 32, '');
        lbox('wood', s0, -.4, .55, shopEnd, 0, .7, 32, 32, ''); lbox('wood', s0 + .05, -.36, .16, shopEnd - .05, -.04, .55, 32, 32, '');   // counter
        // the counter is solid: walking through it put the party's legs inside the boards
        { const [cx0, cz0] = toW(s0, -.3), [cx1, cz1] = toW(shopEnd, 0); solids.push([Math.min(cx0, cx1), Math.min(cz0, cz1), Math.max(cx0, cx1), Math.max(cz0, cz1)]); }
        const [ck, col] = qk && ((L.id * 2654435761) >>> 0) % 10 < 6 ? [qk.sign, 0] : pick(shopSign);
        // goods on the counter: two or three colour blocks
        const gcol = pick([[0xc8a050, 0xa86a3a], [0x7a9a4a, 0xc84a3a], [0xd8d0c0, 0x8a7aa8], [0x5a7aa8, 0xc8c0b0]]);
        for (let a = s0 + .15, k = 0; a < shopEnd - .15; a += .3, k++) lbox(k % 2 ? 'cloth_linen' : 'wood', a - .1, -.33, .7, a + .1, -.1, .82 + (k % 3) * .04, 32, 32, '');
        // awning: a sloped cloth from the lintel out over the street, with a valance
        const ay = 1.78, ao = -.85, av = 1.42;
        group(() => { quad(ck, P3(s0 - .1, ao, av), P3(shopEnd + .1, ao, av), P3(shopEnd + .1, -.02, ay), P3(s0 - .1, -.02, ay), 32, 32);
        quad(ck, P3(shopEnd + .1, -.02, ay - .02), P3(shopEnd + .1, ao, av - .02), P3(s0 - .1, ao, av - .02), P3(s0 - .1, -.02, ay - .02), 32, 32);
        quad(ck, P3(s0 - .1, ao, av - .14), P3(shopEnd + .1, ao, av - .14), P3(shopEnd + .1, ao, av), P3(s0 - .1, ao, av), 32, 32);
        quad(ck, P3(shopEnd + .1, ao, av - .14), P3(s0 - .1, ao, av - .14), P3(s0 - .1, ao, av), P3(shopEnd + .1, ao, av), 32, 32); });
        HS.shopA = [s0, shopEnd]; if (W >= 3) door(mir ? .55 : W - .55); else door(mir ? .5 : W - .5, .3);
        // hanging sign on an iron bracket
        group(() => { const sa = mir ? (W >= 3 ? .08 : W - .1) : W >= 3 ? W - .08 : .1; lbox('iron', sa - .02, -.75, 2.05, sa + .02, 0, 2.09, 16, 16, '');
        lbox(ck, sa - .03, -.68, 1.62, sa + .03, -.28, 2.0, 32, 32, ''); lbox('wood', sa - .035, -.7, 1.6, sa + .035, -.26, 1.64, 32, 32, ''); });
        if (!day) { const [lx, lz] = toW(W / 2, -.7); addLight(lx, 1.3, lz, 2.2, 4.5, 0xffb060, 1); }
      } else if (isInn) {
        const dA = W / 2; door(dA);
        for (const wa of [dA - 1.05, dA + 1.05]) if (wa > .35 && wa < W - .35) win('f', wa, .7, .6, .62, 0);
        for (const la of [dA - .62, dA + .62]) { group(() => { lbox('iron', la - .02, -.25, 1.78, la + .02, 0, 1.82, 16, 16, ''); lbox('lamp', la - .07, -.3, 1.52, la + .07, -.16, 1.72, 16, 16, ''); lbox('iron', la - .09, -.32, 1.72, la + .09, -.14, 1.76, 16, 16, ''); });
          const [lx, lz] = toW(la, -.4); addLight(lx, 1.6, lz, day ? 0 : 2.8, 5, 0xffa850, 2); }
        // a painted board on a long bracket over the street, with a gilt tankard on top
        group(() => { const sa = dA + 1.6 < W ? dA + 1.6 : .15; lbox('iron', sa - .02, -1.0, 2.25, sa + .02, 0, 2.3, 16, 16, ''); lbox('iron', sa - .02, -.5, 1.85, sa + .02, -.02, 1.89, 16, 16, '');
        lbox('wood', sa - .045, -.95, 1.55, sa + .045, -.4, 2.12, 32, 32, ''); lbox('cloth_red', sa - .05, -.9, 1.6, sa + .05, -.45, 2.07, 32, 32, ''); lbox('gold', sa - .06, -.76, 1.72, sa + .06, -.58, 1.95, 16, 16, ''); });
        // bench and barrels by the door
        lbox('wood', dA - 2.0, -.5, .32, dA - .9, -.2, .38, 32, 32, ''); for (const ba of [dA - 1.95, dA - .95]) lbox('wood', ba, -.48, 0, ba + .06, -.22, .32, 32, '');
        { const [bx0, bz0] = toW(dA - 2.0, -.5), [bx1, bz1] = toW(dA - .9, -.2); solids.push([Math.min(bx0, bx1), Math.min(bz0, bz1), Math.max(bx0, bx1), Math.max(bz0, bz1)]); }
        houseInfo.push({ inn: P3(dA, -.6, 0) });
      } else {
        // a one-bay front gets a narrower door to one side and a slit window beside it, so the ground floor has daylight
        if (W < 2) { door(.37, .27); win('f', .87, .7, .2, .62, 0, 1); } else door(doorA);
        // an alehouse hangs out its ale-stake: a pole over the street with a bush of greenery at its end
        if (HS.ale) { const sa = W < 2 ? .37 : doorA; group(() => { lbox('wood', sa - .03, -1.0, 2.02, sa + .03, 0, 2.08, 16, 16, ''); lbox('iron', sa - .02, -.55, 1.7, sa + .02, -.02, 1.74, 16, 16, '');
          lbox('grass', sa - .2, -1.18, 1.62, sa + .2, -.8, 2.0, 32, 32, ''); lbox('grass', sa - .14, -1.12, 1.52, sa + .14, -.86, 1.66, 32, 32, ''); }); }
        const wa = doorA < W / 2 ? doorA + 1 : doorA - 1; if (W >= 2 && wa > .3 && wa < W - .3) win('f', wa, .7, .5, .62, 0);
        if (W >= 3) win('f', doorA < W / 2 ? W - .5 : .5, .7, .5, .62, 0);
        // a lantern beside some doors
        if (r() < .45) { const la = doorA + (doorA < W / 2 ? .62 : -.62), lt = Math.min(1.72, eave - .42); lbox('iron', la - .02, -.25, lt + .06, la + .02, 0, lt + .1, 16, 16, ''); lbox('lamp', la - .07, -.3, lt - .2, la + .07, -.16, lt, 16, 16, ''); lbox('iron', la - .09, -.32, lt, la + .09, -.14, lt + .04, 16, 16, '');
          const [lx, lz] = toW(la, -.4); addLight(lx, 1.6, lz, 2.6, 5, 0xffa850, 2); }
      }
    }
    // cellar steps from the street: a pair of oak flaps flush in the paving by the front wall, iron-bound (planned by the interior planner's own seed, so the town's random stream is untouched)
    if (!isInn) { const cs = cellarSteps(HS, { seed: S.seed }); if (cs && cs.street) { const a = cs.a, hw = .26;
      lbox('stone', a - hw - .06, -.56, 0, a + hw + .06, -.04, .025, 32, 32, ''); lbox('door', a - hw, -.52, .025, a - .01, -.08, .04, 32, 32, ''); lbox('door', a + .01, -.52, .025, a + hw, -.08, .04, 32, 32, '');
      for (const d of [-.44, -.16]) lbox('iron', a - hw + .02, d - .02, .04, a + hw - .02, d + .02, .05, 16, 16, ''); lbox('iron', a - .05, -.33, .04, a + .05, -.27, .06, 16, 16, '');
      HS.cellarAt = toW(a, -.3); HS.cellarSx = cs.sx; } }
    // roof: ridge along the front for most, gable to the street on narrow deep plots; overhangs at eaves, none into a neighbour
    const gableFront = L.f !== 'N' && (W <= 3 && D >= 3 && r() < (L.dist === 'ware' ? .95 : L.street === 'main' || L.street === 'square' ? .8 : .6)) || (W === 2 && D === 2 && r() < (L.dist === 'ware' ? .8 : .3));
    HS.gable = gableFront; HS.out = { l: cellOut(0, D / 2, 'l'), r: cellOut(W, D / 2, 'r'), b: cellOut(W / 2, D - .5, 'b') };
    const rk = roofVar, ridgeK = roofK.replace('roof', 'ridge');
    const oh = .24, ohL = cellOut(0, D / 2, 'l') ? .14 : 0, ohR = cellOut(W, D / 2, 'r') ? .14 : 0;
    const roofTex = (k) => snow ? 'roof_snow' : k;
    const front = -topJ;
    if (!gableFront) {
      const span = D - front, rise = Math.min(L.f === 'N' && L.street === 'square' ? .85 : 1.5, span * .5), mid = front + span / 2, ry = eave + rise;
      const a0 = -ohL, a1 = W + ohR, fo = front - oh, bo = D + oh, dropF = rise * oh / (span / 2);
      // front slope (faces the street), back slope
      quad(roofTex(rk), P3(a0, fo, eave - dropF), P3(a1, fo, eave - dropF), P3(a1, mid, ry), P3(a0, mid, ry), 64, 64, 0, 0);
      quad(roofTex(rk), P3(a1, bo, eave - dropF), P3(a0, bo, eave - dropF), P3(a0, mid, ry), P3(a1, mid, ry), 64, 64, 0, 0);
      // undersides, so the eaves have thickness from below, and fascia boards
      lbox('beam', a0, fo - .03, eave - dropF - .1, a1, fo, eave - dropF + .02, 32, 32, '');
      lbox('beam', a0, bo, eave - dropF - .1, a1, bo + .03, eave - dropF + .02, 32, 32, '');
      // ridge cap
      lbox(snow ? 'roof_snow' : ridgeK, a0 - .02, mid - (snow ? .17 : .09), ry - .06, a1 + .02, mid + (snow ? .17 : .09), ry + (snow ? .15 : .07), 32, 32, '');
      if (snow) for (const [dd, sg] of [[fo, -1], [bo, 1]]) { lbox('roof_snow', a0, Math.min(dd, dd + sg * .11), eave - dropF - .05, a1, Math.max(dd, dd + sg * .11), eave - dropF + .12, 32, 32, '');
        for (let a = a0 + .12; a < a1 - .08; a += .17 + rI() * .12) { const [ix, iz] = toW(a, dd + sg * .03), hgt = .1 + rI() * .18; geo('ice', new THREE.ConeGeometry(.025, hgt, 4).rotateX(Math.PI), new THREE.Matrix4().makeTranslation(ix, eave - dropF - .02 - hgt / 2, iz)); } }
      // gable ends in the top storey's wall, with barge boards
      for (const [a, sg] of [[0, -1], [W, 1]]) {
        const pA = P3(a, front, eave), pB = P3(a, D, eave), pC = P3(a, mid, ry);
        if (sg < 0) tri(timber ? 'plaster_cream' : wallK, pB, pA, pC); else tri(timber ? 'plaster_cream' : wallK, pA, pB, pC);
        const edge = a + sg * (sg < 0 ? ohL : ohR);
        if ((sg < 0 ? ohL : ohR) > 0) for (const [d0, d1] of [[fo, mid], [bo, mid]]) { const p0 = P3(edge, d0, eave - dropF), p1 = P3(edge, d1, ry);
          const len = p0.distanceTo(p1), m = new THREE.Matrix4().lookAt(p0, p1, V(0, 1, 0)); m.setPosition(p0.clone().add(p1).multiplyScalar(.5)); geo('beam', new THREE.BoxGeometry(.06, .14, len), m); }
        if (timber) { const p0 = P3(a + sg * .01, front, eave + .02), p1 = P3(a + sg * .01, D, eave + .02); const m = new THREE.Matrix4().lookAt(p0, p1, V(0, 1, 0)); m.setPosition(p0.clone().add(p1).multiplyScalar(.5)); geo('beam', new THREE.BoxGeometry(.06, .1, p0.distanceTo(p1)), m);
          const p2 = P3(a + sg * .01, mid, eave), p3 = P3(a + sg * .01, mid, ry); const m2 = new THREE.Matrix4().lookAt(p2, p3, V(0, 0, 1)); m2.setPosition(p2.clone().add(p3).multiplyScalar(.5)); geo('beam', new THREE.BoxGeometry(.08, .06, p2.distanceTo(p3)), m2); }
      }
      // dormer on deep roofs of tall houses
      if (rise > 1.1 && W >= 2 && r() < .85) { group(() => { const da = W / 2, dw = .7, dd0 = front + span * .12, dy0 = eave + rise * .24, dh = .8;
        lbox(wallK === 'brick' ? 'brick' : 'plaster_cream', da - dw / 2, dd0, dy0, da + dw / 2, mid - .1, dy0 + dh, 64, 64, 'tb');
        lbox(litWin() ? 'glass_lit' : 'glass', da - .2, dd0 - .01, dy0 + .12, da + .2, dd0, dy0 + .62, 16, 16, '');
        lbox('wood', da - .26, dd0 - .04, dy0 + .62, da + .26, dd0, dy0 + .68, 32, 32, '');
        quad(roofTex(rk), P3(da - dw / 2 - .1, dd0 - .1, dy0 + dh), P3(da - dw / 2 - .1, mid - .1, dy0 + dh + .45), P3(da, mid - .1, dy0 + dh + .45), P3(da, dd0 - .1, dy0 + dh + .45), 64, 64);
        quad(roofTex(rk), P3(da, dd0 - .1, dy0 + dh + .45), P3(da, mid - .1, dy0 + dh + .45), P3(da + dw / 2 + .1, mid - .1, dy0 + dh), P3(da + dw / 2 + .1, dd0 - .1, dy0 + dh), 64, 64);
        tri(wallK === 'brick' ? 'brick' : 'plaster_cream', P3(da - dw / 2, dd0, dy0 + dh), P3(da + dw / 2, dd0, dy0 + dh), P3(da, dd0, dy0 + dh + .42)); }); }
      if (L.f === 'N' && W >= 2) for (const da of W >= 4 ? [W * .3, W * .72] : [W / 2]) { group(() => { const dw = .62, dd0 = D - span * .1, dy0 = eave + .12, dh = .46, ap = dy0 + dh + .26, wk = wallK === 'brick' ? 'brick' : 'plaster_cream';
        lbox(wk, da - dw / 2, mid + .05, dy0, da + dw / 2, dd0, dy0 + dh, 64, 64, 'tb');
        lbox(litWin() ? 'glass_lit' : 'glass', da - .17, dd0, dy0 + .08, da + .17, dd0 + .01, dy0 + .4, 16, 16, '');
        lbox('wood', da - .22, dd0, dy0 + .4, da + .22, dd0 + .04, dy0 + .45, 32, 32, '');
        quad(roofTex(rk), P3(da + dw / 2 + .1, dd0 + .1, dy0 + dh), P3(da + dw / 2 + .1, mid + .05, dy0 + dh), P3(da, mid + .05, ap), P3(da, dd0 + .1, ap), 64, 64);
        quad(roofTex(rk), P3(da, dd0 + .1, ap), P3(da, mid + .05, ap), P3(da - dw / 2 - .1, mid + .05, dy0 + dh), P3(da - dw / 2 - .1, dd0 + .1, dy0 + dh), 64, 64);
        tri(wk, P3(da + dw / 2, dd0, dy0 + dh), P3(da - dw / 2, dd0, dy0 + dh), P3(da, dd0, ap - .03)); }); }
      // chimney on the ridge near one end
      const hasC = r() < .75; if (hasC || L.dist === 'rich' || L.dist === 'ware') { group(() => { const ca = hasC ? (r() < .5 ? .45 : W - .45) : (L.id % 2 ? .45 : W - .45), cd = mid + (hasC ? (r() < .5 ? .3 : -.1) : .3); lbox(L.dist === 'craft' ? 'brick' : 'stone', ca - .2, cd - .16, ry - .6, ca + .2, cd + .16, ry + .55, 32, 32, 'b');
        lbox('stone', ca - .25, cd - .21, ry + .55, ca + .25, cd + .21, ry + .63, 32, 32, ''); lbox('dark', ca - .12, cd - .08, ry + .631, ca + .12, cd + .08, ry + .632, 16, 16, '');
        HS.chim = [ca, cd]; houseInfo.push({ smoke: P3(ca, cd, ry + .7) }); }); }
      houseInfo.push({ id: L.id, top: ry });
    } else {
      // gable facing the street: ridge runs from front to back; the gable wall is the front, stepped or plain
      const span = W + ohL + ohR, rise = Math.min(1.7, W * .62), mid = W / 2, ry = eave + rise, fo = front - .14, bo = D + oh, a0 = ohL ? -.22 : 0, a1 = W + (ohR ? .22 : 0), drop = rise * .22 / (W / 2);
      quad(roofTex(rk), P3(a0, bo, eave - drop), P3(a0, fo, eave - drop), P3(mid, fo, ry), P3(mid, bo, ry), 64, 64);
      quad(roofTex(rk), P3(a1, fo, eave - drop), P3(a1, bo, eave - drop), P3(mid, bo, ry), P3(mid, fo, ry), 64, 64);
      const [xa, za] = toW(mid, fo), [xb, zb] = toW(mid, bo); { const p0 = P3(mid, fo, ry), p1 = P3(mid, bo, ry); const m = new THREE.Matrix4().lookAt(p0, p1, V(0, 1, 0)); m.setPosition(p0.clone().add(p1).multiplyScalar(.5)); geo(snow ? 'roof_snow' : ridgeK, new THREE.BoxGeometry(.18, .13, p0.distanceTo(p1)), m); }
      // front gable wall (plaster or timber), with a loft window and a hoist beam
      if ((L.f === 'E' || L.f === 'W') && D >= 2.5) { const camA = L.f === 'E' ? 0 : W, sg = L.f === 'E' ? 1 : -1, af = camA + sg * W * .18, ah = mid - sg * .05, wk = wallK === 'brick' ? 'brick' : 'plaster_cream';
        for (const dc of D >= 4 ? [D * .35, D * .72] : [D / 2]) { const y0 = eave + .05, y1 = eave + .55;
          lbox(wk, Math.min(af, ah), dc - .3, y0, Math.max(af, ah), dc + .3, y1, 64, 64, 'b');
          lbox(litWin() ? 'glass_lit' : 'glass', Math.min(af, af - sg * .01), dc - .16, y0 + .1, Math.max(af, af - sg * .01), dc + .16, y0 + .42, 16, 16, '');
          const ap = y1 + .3, aF = af - sg * .1; quad(roofTex(rk), P3(aF, dc - .4, y1 - .04), P3(ah, dc - .4, y1 - .04), P3(ah, dc, ap), P3(aF, dc, ap), 64, 64);
          quad(roofTex(rk), P3(aF, dc, ap), P3(ah, dc, ap), P3(ah, dc + .4, y1 - .04), P3(aF, dc + .4, y1 - .04), 64, 64);
          tri(wk, P3(af, dc - .3, y1), P3(af, dc + .3, y1), P3(af, dc, ap - .04)); lbox('wood', Math.min(af, af - sg * .03), dc - .2, y0 + .42, Math.max(af, af - sg * .03), dc + .2, y0 + .47, 32, 32, ''); } }
      const gk2 = timber ? 'plaster_cream' : wallK;
      tri(gk2, P3(0, front, eave), P3(W, front, eave), P3(mid, front, ry));
      tri(gk2, P3(W, D, eave), P3(0, D, eave), P3(mid, D, ry));
      for (const [p0, p1] of [[P3(a0, fo, eave - drop), P3(mid, fo, ry)], [P3(a1, fo, eave - drop), P3(mid, fo, ry)]]) { const len = p0.distanceTo(p1), m = new THREE.Matrix4().lookAt(p0, p1, V(0, 0, 1)); m.setPosition(p0.clone().add(p1).multiplyScalar(.5)); geo('beam', new THREE.BoxGeometry(.06, .16, len), m); }
      if (timber) { lbox('beam', 0, front - .035, eave, W, front, eave + .1, 32, 32, ''); lbox('beam', mid - .05, front - .035, eave, mid + .05, front, ry - .1, 32, 32, ''); }
      win('f', mid + (timber ? .32 : 0), eave + .25, .34, .5, topJ);
      lbox('beam', mid - .05, front - .5, ry - .45, mid + .05, front, ry - .35, 32, 32, '');
      if (r() < .7 || L.dist === 'rich' || L.dist === 'ware') { const cd = D * .65; lbox('stone', W - .45, cd - .16, eave + rise * .45, W - .05, cd + .16, ry + .5, 32, 32, 'b'); lbox('stone', W - .5, cd - .21, ry + .5, W, cd + .21, ry + .58, 32, 32, ''); HS.chim = [W - .25, cd]; houseInfo.push({ smoke: P3(W - .25, cd, ry + .65) }); }
      houseInfo.push({ id: L.id, top: ry });
    }
    // snow on sills and roofs is the roof material swap; autumn adds nothing to houses
  }
  Bk.setLift(null);

  // ---------- church: nave, tower with spire, buttresses, tall windows; churchyard with graves and a yew ----------
  if (ch) { const cy = ch.y - 3;   // the kit was drawn for a church at row 3; everything below is offset from there
    const x0 = ch.x, x1 = ch.x + ch.w, z0 = ch.y + 1, z1 = ch.y + ch.d + 1, H = 5.2;
    cube('ashlar', x0, 0, z0, x1, H, z1, 64, 64, 'b');
    const rise = 3.0, mz = (z0 + z1) / 2, rk = snow ? 'roof_snow' : 'roof_slate';
    quad(rk, V(x0 - .2, H - .2, z1 + .3), V(x1 + .2, H - .2, z1 + .3), V(x1 + .2, H + rise, mz), V(x0 - .2, H + rise, mz), 64, 64);
    quad(rk, V(x1 + .2, H - .2, z0 - .3), V(x0 - .2, H - .2, z0 - .3), V(x0 - .2, H + rise, mz), V(x1 + .2, H + rise, mz), 64, 64);
    tri('ashlar', V(x0, H, z0), V(x0, H, z1), V(x0, H + rise, mz)); tri('ashlar', V(x1, H, z1), V(x1, H, z0), V(x1, H + rise, mz));
    cube(snow ? 'roof_snow' : 'ridge_slate', x0 - .2, H + rise - .06, mz - .1, x1 + .2, H + rise + .08, mz + .1, 32, 32, '');
    // west gable: a round rose window; east: a lower chancel with its own roof
    geo('stained', new THREE.CircleGeometry(.55, 12).rotateY(-Math.PI / 2), new THREE.Matrix4().makeTranslation(x0 - .02, H + .9, mz)); geo('stone', new THREE.TorusGeometry(.58, .07, 4, 12).rotateY(Math.PI / 2), new THREE.Matrix4().makeTranslation(x0 - .03, H + .9, mz));
    { const cz0 = z0 + 1.3, cz1 = z1 - 1.3, cx1 = x1 + 1.05, CH = H - 1.2, cr = 1.6, cmz = (cz0 + cz1) / 2;
      cube('ashlar', x1, 0, cz0, cx1, CH, cz1, 64, 64, 'b'); solids.push([x1, cz0, cx1, cz1]);
      quad(rk, V(x1, CH - .15, cz1 + .2), V(cx1 + .15, CH - .15, cz1 + .2), V(cx1 + .15, CH + cr, cmz), V(x1, CH + cr, cmz), 64, 64);
      quad(rk, V(cx1 + .15, CH - .15, cz0 - .2), V(x1, CH - .15, cz0 - .2), V(x1, CH + cr, cmz), V(cx1 + .15, CH + cr, cmz), 64, 64);
      tri('ashlar', V(cx1, CH, cz1), V(cx1, CH, cz0), V(cx1, CH + cr, cmz));
      cube('stained', cx1, 1.1, cmz - .25, cx1 + .02, 2.9, cmz + .25, 16, 16, ''); }
    // buttresses and lancet windows along both long sides
    { const tA = ch.x - .2, tB = ch.x + 3.2;
      for (let x = x0 + .4; x < x1; x += 1.4) for (const [z, s] of [[z0, -1], [z1, 1]]) { if (s > 0 && x > tA && x < tB) continue;
        cube('ashlar_dark', x - .18, 0, Math.min(z, z + s * .4), x + .18, H - .6, Math.max(z, z + s * .4), 64, 64, 'b'); cube('ashlar_dark', x - .18, H - .6, Math.min(z, z + s * .25), x + .18, H - .2, Math.max(z, z + s * .25), 64, 64, 'b'); solids.push([x - .2, Math.min(z, z + s * .4), x + .2, Math.max(z, z + s * .4)]);
        const wx = x + .7; if (wx + .3 < x1 && !(s > 0 && wx + .3 > tA && wx - .3 < tB) && !(s > 0 && wx > ch.x + 4.8 && wx < ch.x + 5.9)) { cube('stained', wx - .25, 1.3, Math.min(z, z + s * .02), wx + .25, 3.5, Math.max(z, z + s * .02), 16, 16, ''); tri('stained', V(wx - .25, 3.5, z + s * .021), V(wx + .25, 3.5, z + s * .021), V(wx, 3.95, z + s * .021)); cube('stone', wx - .33, 1.2, Math.min(z, z + s * .1), wx + .33, 1.3, Math.max(z, z + s * .1), 32, 32, ''); } } }
    // the tower on the square end, door facing the square
    const tx0 = ch.x, tx1 = tx0 + 3, tz0 = z1 - .5, tz1 = cy + 13.8, TH = 7.8;
    cube('ashlar', tx0, 0, tz0, tx1, TH, tz1, 64, 64, 'b');
    for (const [cx, cz] of [[tx0, tz1], [tx1, tz1]]) cube('ashlar_dark', cx - .22, 0, cz - .22, cx + .22, TH - 1.2, cz + .22, 64, 64, 'b');
    cube('stone', tx0 - .12, TH - .3, tz0 - .12, tx1 + .12, TH, tz1 + .12, 32, 32, 'b');
    // belfry: paired openings with wooden louvres and a stone hood
    const tcx = (tx0 + tx1) / 2;
    for (const bx of [tx0 + .55, tx1 - 1.25]) { cube('dark', bx, TH - 2.1, tz1, bx + .7, TH - .95, tz1 + .01, 16, 16, ''); tri('dark', V(bx, TH - .95, tz1 + .01), V(bx + .7, TH - .95, tz1 + .01), V(bx + .35, TH - .62, tz1 + .01));
      for (let k = 0; k < 4; k++) cube('wood', bx + .02, TH - 2.0 + k * .26, tz1 + .01, bx + .68, TH - 1.9 + k * .26, tz1 + .07, 32, 32, '');
      cube('stone', bx - .08, TH - 2.18, tz1, bx + .78, TH - 2.08, tz1 + .1, 32, 32, ''); }
    cube('stone', tx0 - .04, TH - 2.35, tz1, tx1 + .04, TH - 2.22, tz1 + .08, 32, 32, '');
    // great west window: a tall pointed lancet with tracery, set in a moulded surround
    { const wx0 = tcx - .55, wx1 = tcx + .55, wy0 = 3.25, wy1 = 4.95, wy2 = 5.65;
      cube('ashlar_dark', wx0 - .14, wy0 - .12, tz1, wx1 + .14, wy1, tz1 + .04, 64, 64, ''); tri('ashlar_dark', V(wx0 - .14, wy1, tz1 + .04), V(wx1 + .14, wy1, tz1 + .04), V(tcx, wy2 + .16, tz1 + .04));
      cube('stained', wx0, wy0, tz1 + .04, wx1, wy1, tz1 + .05, 16, 16, ''); tri('stained', V(wx0, wy1, tz1 + .05), V(wx1, wy1, tz1 + .05), V(tcx, wy2, tz1 + .05));
      cube('stone', tcx - .04, wy0, tz1 + .05, tcx + .04, wy1 + .25, tz1 + .09, 32, 32, ''); cube('stone', wx0, wy0 + .8, tz1 + .05, wx1, wy0 + .86, tz1 + .09, 32, 32, '');
      geo('stone', new THREE.TorusGeometry(.17, .03, 4, 10), new THREE.Matrix4().makeTranslation(tcx, wy1 + .3, tz1 + .07));
      cube('stone', wx0 - .2, wy0 - .2, tz1, wx1 + .2, wy0 - .1, tz1 + .14, 32, 32, ''); }
    // gabled porch out onto the square: pointed doorway, slate roof, lamp
    { const px0 = tcx - 1.0, px1 = tcx + 1.0, pz0 = tz1, pz1 = tz1 + 1.05, ph = 2.5, pr = 1.0, prk = snow ? 'roof_snow' : 'roof_slate';
      cube('ashlar', px0, 0, pz0, px0 + .32, ph, pz1, 64, 64, 'b'); cube('ashlar', px1 - .32, 0, pz0, px1, ph, pz1, 64, 64, 'b'); cube('ashlar', px0, 1.95, pz0, px1, ph, pz1, 64, 64, 'b');
      cube('dark', px0 + .32, 0, pz0 + .02, px1 - .32, 1.95, pz0 + .03, 16, 16, '');
      tri('ashlar', V(px0, ph, pz1), V(px1, ph, pz1), V(tcx, ph + pr, pz1)); tri('ashlar', V(px1, ph, pz0), V(px0, ph, pz0), V(tcx, ph + pr, pz0));
      tri('dark', V(px0 + .32, 1.95, pz1 + .005), V(px1 - .32, 1.95, pz1 + .005), V(tcx, 2.45, pz1 + .005));
      quad(prk, V(px0 - .15, ph - .1, pz1 + .12), V(px0 - .15, ph - .1, pz0), V(tcx, ph + pr + .05, pz0), V(tcx, ph + pr + .05, pz1 + .12), 64, 64);
      quad(prk, V(px1 + .15, ph - .1, pz0), V(px1 + .15, ph - .1, pz1 + .12), V(tcx, ph + pr + .05, pz1 + .12), V(tcx, ph + pr + .05, pz0), 64, 64);
      cube('stone', tcx - .05, ph + pr - .1, pz1 + .02, tcx + .05, ph + pr + .35, pz1 + .1, 32, 32, ''); cube('stone', tcx - .16, ph + pr + .12, pz1 + .02, tcx + .16, ph + pr + .2, pz1 + .1, 32, 32, '');
      cube('door', tcx - .38, .12, pz0 + .03, tcx + .38, 1.85, pz0 + .06, 32, 32, '');
      // no step: a slab out on the square read as a stray strip of dark brick (owner, r14)
      cube('iron', px1 - .02, 1.75, pz1, px1 + .02, 1.79, pz1 + .26, 16, 16, ''); cube('lamp', px1 - .07, 1.5, pz1 + .14, px1 + .07, 1.72, pz1 + .3, 16, 16, '');
      solids.push([px0, pz0, px0 + .32, pz1], [px1 - .32, pz0, px1, pz1]); }
    // the way in: standing in the porch before the south door (the church interior is planned by church.js)
    P.CHURCH = { church: true, id: 'church', door: [tcx, tz1 + .3], x: tx0, y: tz0, w: tx1 - tx0, d: tz1 - tz0, ch };
    // spire: a four-sided pyramid in slate with a gilded finial
    { const sh = 7.4, cxm = (tx0 + tx1) / 2, czm = (tz0 + tz1) / 2, hw = (tx1 - tx0) / 2 + .05, hd = (tz1 - tz0) / 2 + .05, apex = V(cxm, TH + sh, czm);
      const c = [V(cxm - hw, TH, czm + hd), V(cxm + hw, TH, czm + hd), V(cxm + hw, TH, czm - hd), V(cxm - hw, TH, czm - hd)];
      const cone = new THREE.ConeGeometry(Math.min(hw, hd) * .82, sh, 8, 1, true); const cu = cone.attributes.uv; for (let k = 0; k < cu.count; k++) cu.setXY(k, cu.getX(k) * 8 * 32 / 64, cu.getY(k) * sh * 32 / 64);
      geo(snow ? 'roof_snow' : 'roof_slate', cone, new THREE.Matrix4().makeRotationY(Math.PI / 8).setPosition(cxm, TH + sh / 2, czm)); void c;
      for (const [px, pz] of [[cxm - hw + .2, czm + hd - .2], [cxm + hw - .2, czm + hd - .2], [cxm - hw + .2, czm - hd + .2], [cxm + hw - .2, czm - hd + .2]]) { cube('ashlar', px - .14, TH, pz - .14, px + .14, TH + .5, pz + .14, 64, 64, 'b'); geo('stone', new THREE.ConeGeometry(.16, .7, 4), new THREE.Matrix4().makeRotationY(Math.PI / 4).setPosition(px, TH + .85, pz)); }
      geo('gold', new THREE.SphereGeometry(.14, 8, 6), new THREE.Matrix4().makeTranslation(cxm, TH + sh + .1, czm));
      geo('gold', new THREE.BoxGeometry(.05, .6, .05), new THREE.Matrix4().makeTranslation(cxm, TH + sh + .45, czm)); geo('gold', new THREE.BoxGeometry(.32, .05, .05), new THREE.Matrix4().makeTranslation(cxm, TH + sh + .55, czm)); }
    if (!day) addLight(tcx + 1.0, 1.6, tz1 + 1.5, 3, 5.5, 0xffb060, 2);
    for (let y = z0; y < z1; y++) for (let x = x0; x < x1; x++) zoneName.set(I(x, y), 'Church');
    // graves in the churchyard
    for (let y = ch.y; y <= ch.y + 10; y++) for (let x = ch.yx0 - 1; x <= x1 + 1; x++) if (at(x, y) === 'yardC' && (y - ch.y) % 2 === 0 && x % 2 === 0 && r() < .85 && !(x === x1 && y >= z0 + 1 && y < z1 - 1) && !(x >= ch.x + 4 && x <= ch.x + 6 && y >= ch.y + 8) && !(x >= ch.x && x <= ch.x + 3 && y >= ch.y + 8)) {
      const gx0 = x + .25 + r() * .35, gz0 = y + .4, k = r(), lean = (r() - .5) * .25, mt = new THREE.Matrix4();
      if (k < .3) { mt.makeRotationZ(lean).setPosition(gx0 + .1, .35, gz0 + .05); mt.setPosition(gx0 + .2, .6, gz0 + .05); geo('stone', new THREE.BoxGeometry(.13, 1.2, .13), mt); geo('stone', new THREE.BoxGeometry(.58, .13, .13), new THREE.Matrix4().makeRotationZ(lean).setPosition(gx0 + .2 - lean * .35, .9, gz0 + .05)); }
      else if (k < .42) { cube('stone', gx0 - .05, 0, gz0 - .2, gx0 + .55, .32, gz0 + .75, 32, 32, 'b'); cube('ashlar_dark', gx0 - .1, .32, gz0 - .25, gx0 + .6, .4, gz0 + .8, 64, 64, 'b'); solids.push([gx0 - .1, gz0 - .25, gx0 + .6, gz0 + .8]); }
      else { mt.makeRotationX(lean).setPosition(gx0 + .25, .42, gz0 + .05); geo(k < .7 ? 'stone' : 'ashlar_dark', new THREE.BoxGeometry(.62, .84 + r() * .16, .16), mt); geo('stone', new THREE.BoxGeometry(.46, .12, .17), new THREE.Matrix4().makeRotationX(lean).setPosition(gx0 + .25, .88, gz0 + .05)); }
      solids.push([gx0 - .08, gz0 - .06, gx0 + .58, gz0 + .18]); }
  }
  // ---------- guildhall: stone arcade, timber hall above, hipped roof with a clock turret ----------
  if (gh) {
    const x0 = gh.x, x1 = gh.x + gh.w, z0 = gh.y, z1 = gh.y + gh.d + 1, G1 = 2.3, G2 = 4.4;
    cube('ashlar', x0, 0, z0, x1, G1, z1 - .9, 64, 64, 'b');
    // arcade: piers along the front with dark arches behind
    cube('dark', x0 + .2, 0, z1 - .9, x1 - .2, G1 - .1, z1 - .89, 16, 16, '');
    for (let i = 0; i <= gh.w; i++) { const px = x0 + i * gh.w / gh.w; cube('ashlar_dark', px - .2, 0, z1 - .95, px + .2, G1, z1 - .05 + 0, 64, 64, 'b'); solids.push([px - .25, z1 - 1, px + .25, z1]); }
    cube('stone', x0 - .05, G1 - .25, z1 - .95, x1 + .05, G1, z1, 32, 32, 'b');
    for (let i = 0; i < gh.w; i++) { const ax = x0 + i + .5; cube('stone', ax - .3, G1 - .5, z1 - .1, ax + .3, G1 - .25, z1 - .05, 32, 32, ''); }
    cube('stone', x0, 0, z1 - .95, x1, .08, z1, 32, 32, 'b');
    // upper hall
    cube('plaster_white', x0 - .1, G1, z0, x1 + .1, G2, z1 + .1, 64, 64, 'b');
    for (let i = 0; i <= gh.w * 2; i++) cube('beam', x0 - .1 + i * (gh.w + .2) / (gh.w * 2) - .05, G1, z1 + .1, x0 - .1 + i * (gh.w + .2) / (gh.w * 2) + .05, G2, z1 + .14, 32, 32, '');
    cube('beam', x0 - .1, G1, z1 + .1, x1 + .1, G1 + .12, z1 + .15, 32, 32, ''); cube('beam', x0 - .1, G2 - .12, z1 + .1, x1 + .1, G2, z1 + .15, 32, 32, '');
    for (let i = 0; i < gh.w; i++) { const ax = x0 + i + .5; cube(day ? 'glass' : 'glass_lit', ax - .25, G1 + .55, z1 + .14, ax + .25, G1 + 1.55, z1 + .16, 16, 16, ''); cube('stone', ax - .32, G1 + .47, z1 + .14, ax + .32, G1 + .55, z1 + .26, 32, 32, ''); }
    // hip roof
    const rise = 2.4, ox = .3, X0 = x0 - .1 - ox, X1 = x1 + .1 + ox, Z0 = z0 - ox, Z1 = z1 + .1 + ox, rz0 = Z0 + (Z1 - Z0) / 2 - .4, rz1 = rz0 + .8, rk = snow ? 'roof_snow' : 'roof_terra';
    const hx0 = X0 + (Z1 - Z0) / 2 - .4, hx1 = X1 - (Z1 - Z0) / 2 + .4, ry = G2 + rise - .15, ey2 = G2 - .15;
    quad(rk, V(X0, ey2, Z1), V(X1, ey2, Z1), V(hx1, ry, (Z0 + Z1) / 2), V(hx0, ry, (Z0 + Z1) / 2), 64, 64);
    quad(rk, V(X1, ey2, Z0), V(X0, ey2, Z0), V(hx0, ry, (Z0 + Z1) / 2), V(hx1, ry, (Z0 + Z1) / 2), 64, 64);
    tri(rk, V(X0, ey2, Z0), V(X0, ey2, Z1), V(hx0, ry, (Z0 + Z1) / 2), 64, 64); tri(rk, V(X1, ey2, Z1), V(X1, ey2, Z0), V(hx1, ry, (Z0 + Z1) / 2), 64, 64);
    cube(snow ? 'roof_snow' : 'ridge_terra', hx0, ry - .05, (Z0 + Z1) / 2 - .09, hx1, ry + .08, (Z0 + Z1) / 2 + .09, 32, 32, '');
    // clock turret on the ridge
    const cx = (x0 + x1) / 2, cz = (Z0 + Z1) / 2;
    cube('plaster_white', cx - .5, ry - .6, cz - .5, cx + .5, ry + 1.2, cz + .5, 64, 64, 'b');
    for (const [a, b, c, d] of [[-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1]]) cube('beam', cx + a * .5 - .05, ry - .6, cz + b * .5 - .05, cx + a * .5 + .05, ry + 1.2, cz + b * .5 + .05, 32, 32, '');
    geo('stone', new THREE.CylinderGeometry(.34, .34, .04, 16).rotateX(Math.PI / 2), new THREE.Matrix4().makeTranslation(cx, ry + .55, cz + .52));
    geo('dark', new THREE.BoxGeometry(.04, .24, .02), new THREE.Matrix4().makeTranslation(cx, ry + .62, cz + .55)); geo('dark', new THREE.BoxGeometry(.18, .04, .02), new THREE.Matrix4().makeTranslation(cx + .07, ry + .55, cz + .555));
    { const ap = V(cx, ry + 2.3, cz), c = [V(cx - .7, ry + 1.2, cz + .7), V(cx + .7, ry + 1.2, cz + .7), V(cx + .7, ry + 1.2, cz - .7), V(cx - .7, ry + 1.2, cz - .7)];
      for (let i = 0; i < 4; i++) tri(snow ? 'roof_snow' : 'roof_slate', c[i], c[(i + 1) % 4], ap, 64, 64); geo('gold', new THREE.SphereGeometry(.09, 8, 6), new THREE.Matrix4().makeTranslation(cx, ry + 2.38, cz)); }
    // banners between the upper windows
    for (let i = 1; i < gh.w; i++) { const bx = x0 + i; cube(i % 2 ? 'cloth_red' : 'cloth_teal', bx - .14, G1 + .3, z1 + .16, bx + .14, G2 - .3, z1 + .2, 32, 32, ''); }
    { const dx = (x0 + x1) / 2; cube('door', dx - .45, .08, z1 - .9, dx + .45, 1.9, z1 - .86, 32, 32, ''); cube('stone', dx - .58, .08, z1 - .91, dx + .58, 2.05, z1 - .89, 32, 32, '');
      for (const lx of [dx - .75, dx + .75]) { cube('iron', lx - .03, 1.5, z1 - .89, lx + .03, 1.54, z1 - .7, 16, 16, ''); cube('lamp', lx - .08, 1.25, z1 - .78, lx + .08, 1.48, z1 - .62, 16, 16, ''); addLight(lx, 1.4, z1 - .3, day ? 0 : 2.6, 5, 0xffb060, 2); }
      cube('wood', dx - .9, G1 + 1.75, z1 + .16, dx + .9, G1 + 2.05, z1 + .2, 32, 32, ''); cube('gold', dx - .8, G1 + 1.8, z1 + .2, dx + .8, G1 + 2.0, z1 + .21, 16, 16, ''); }
    if (!day) for (let i = 1; i < gh.w; i += 2) addLight(x0 + i + .5, 1.8, z1 - .4, 2.6, 5, 0xffb060, 2);
    for (let y = z0; y < z1; y++) for (let x = x0; x < x1; x++) zoneName.set(I(x, y), 'Guildhall');
    // the way in: under the arcade, at the door in the middle of its back wall (the interior is planned by civic.js)
    for (let x = x0; x < x1; x++) openCell.add(I(x, z1 - 1));   // the arcade is open: people shelter under it and reach the door through it
    P.GUILD = { guild: true, id: 'guild', door: [(x0 + x1) / 2, z1 - .9 + .35], x: x0, y: z0, w: gh.w, d: z1 - .9 - z0, gh };
  }

  // ---------- precinct walls (a close, a friary, an abbey): coped stone about head height and a half, no battlements ----------
  { const pw = (x, y) => inG(x, y) && at(x, y) === 'pwall', PK = snow ? 'roof_snow' : 'stone';
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (!pw(x, y)) continue; const hz = pw(x - 1, y) || pw(x + 1, y), vt = pw(x, y - 1) || pw(x, y + 1), H = 1.9;
      const parts = []; if (hz || !vt) parts.push([pw(x - 1, y) ? x : x + .3, y + .3, pw(x + 1, y) ? x + 1 : x + .7, y + .7]); if (vt) parts.push([x + .3, pw(x, y - 1) ? y : y + .3, x + .7, pw(x, y + 1) ? y + 1 : y + .7]);
      for (const [a, b, c, d] of parts) { cube('ashlar', a, 0, b, c, H, d, 64, 64, 'b'); cube(PK, a - .05, H, b - .05, c + .05, H + .14, d + .05, 32, 32, ''); solids.push([a, b, c, d]); } } }
  // ---------- town wall, towers, gatehouses ----------
  if (P.walls) {
    const WSD = P.brief ? P.brief.spec.seed : P.seed;   // one city builds all its walls alike
    const WH2 = 3.0 + (WSD % 4) * .2, WK = WSD % 3 === 2 ? 'brick_old' : 'ashlar_dark', TR = snow ? 'roof_snow' : WSD % 2 ? 'roof_terra' : 'roof_slate';   // each town builds its wall in its own stone or brick
    const ins = (x, y) => inG(x, y) && P.walls.ins[I(x, y)] === 1;
    const gateAt = (x, y) => P.gates.some((G) => { const h = G.dir === 's' || G.dir === 'n', along = h ? x : y, across = h ? y : x; return across === G.line && along >= G.u - 2 && along <= G.u + 3; });
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (at(x, y) !== 'wall' || gateAt(x, y)) continue;
      cube(WK, x, 0, y, x + 1, WH2, y + 1, 64, 64, 'b');
      const n = x * 7 + y * 3;
      for (const [dx, dy] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) { if (ins(x + dx, y + dy) || at(x + dx, y + dy) === 'wall') continue; const outer = dy > 0 ? 's' : dy < 0 ? 'n' : dx < 0 ? 'w' : 'e';
        // merlons on the outer edge
        for (let k = 0; k < 2; k++) { const o = k * .5 + .05;
          if (outer === 's') cube(WK, x + o, WH2, y + .78, x + o + .3, WH2 + .42, y + 1, 64, 64, 'b');
          if (outer === 'n') cube(WK, x + o, WH2, y, x + o + .3, WH2 + .42, y + .22, 64, 64, 'b');
          if (outer === 'w') cube(WK, x, WH2, y + o, x + .22, WH2 + .42, y + o + .3, 64, 64, 'b');
          if (outer === 'e') cube(WK, x + .78, WH2, y + o, x + 1, WH2 + .42, y + o + .3, 64, 64, 'b'); }
        if (outer === 's' && n % 4 === 0) { cube(WK, x + .3, 0, y + 1, x + .7, WH2 - .7, y + 1.35, 64, 64, 'b'); cube('stone', x + .28, WH2 - .7, y + 1, x + .72, WH2 - .55, y + 1.2, 32, 32, ''); }
        if (outer === 's' && n % 4 === 2) cube('dark', x + .45, 1.4, y + 1, x + .55, 2.3, y + 1.01, 16, 16, '');
        if (outer === 'n' && n % 5 === 3) { cube('dark', x + .4, 2.0, y + 1, x + .6, 2.8, y + 1.01, 16, 16, ''); cube('stone', x + .3, 1.95, y + 1, x + .7, 2.02, y + 1.08, 32, 32, ''); }
        if ((outer === 'w' || outer === 'e') && n % 4 === 1) { const fx = outer === 'w' ? x + 1 : x; cube(WK, Math.min(fx, fx + (outer === 'w' ? .02 : -.02)), .5, y + .3, Math.max(fx, fx + (outer === 'w' ? .02 : -.02)), 1.3, y + .9, 64, 64, ''); } } }
    // towers: round with conical roofs, standing a little proud of the wall so the lane behind stays open
    for (const T of P.towers) { const cx = T.x + .5 + T.ox * .4, cz = T.y + .5 + T.oy * .4, R = 1.25, H = 4.6;
      const cyl = new THREE.CylinderGeometry(R, R + .08, H, 14, 1, true); const uv = cyl.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 2 * Math.PI * R * 32 / 64, uv.getY(k) * H * 32 / 64);
      geo(WK, cyl, new THREE.Matrix4().makeTranslation(cx, H / 2, cz));
      const cone = new THREE.ConeGeometry(R + .3, 2.4, 14, 1, true); const cu = cone.attributes.uv; for (let k = 0; k < cu.count; k++) cu.setXY(k, cu.getX(k) * 2 * Math.PI * R * 32 / 64, cu.getY(k) * 2.6 * 32 / 64);
      geo(TR, cone, new THREE.Matrix4().makeTranslation(cx, H + 1.2, cz));
      geo('stone', new THREE.CylinderGeometry(R + .12, R + .12, .14, 14), new THREE.Matrix4().makeTranslation(cx, H, cz));
      for (let k = 0; k < 3; k++) { const a = k * 2.1 + .4; geo('dark', new THREE.BoxGeometry(.1, .5, .06), new THREE.Matrix4().makeRotationY(-a).setPosition(cx + Math.cos(a) * (R + .03), 2.6, cz + Math.sin(a) * (R + .03))); }
      for (let y = T.y - 2; y <= T.y + 2; y++) for (let x = T.x - 2; x <= T.x + 2; x++) if (Math.hypot(x + .5 - cx, y + .5 - cz) < R) blockedCell.add(I(x, y));
      const hb = R * .86; solids.push([cx - hb, cz - hb, cx + hb, cz + hb]); }
    // gatehouses: two square towers flanking the road with an arch and a raised portcullis, drawn in the gate's own frame
    // (u along the wall from the passage's first cell, v outward from the wall's inner face)
    P.GATES = [];
    for (const G of P.gates) {
      const W2 = (u, v) => G.dir === 's' ? [u, G.line + v] : G.dir === 'n' ? [u, G.line + 1 - v] : G.dir === 'e' ? [G.line + v, u] : [G.line + 1 - v, u];
      const gc = (key, u0, y0, v0, u1, y1, v1, tw = 64, th = 64, skip = '') => { const [xa, za] = W2(u0, v0), [xb, zb] = W2(u1, v1); cube(key, Math.min(xa, xb), y0, Math.min(za, zb), Math.max(xa, xb), y1, Math.max(za, zb), tw, th, skip); };
      const gx = G.u, gw = WSD % 2 ? 2.6 : 2, g0 = gx - gw, g1 = gx + 2 + gw, z0 = -1, z1 = 1.3 + (WSD % 2) * .3, H = 4.7 + (WSD % 3) * .5, ban = ['cloth_red', 'cloth_teal', 'cloth_green', 'cloth_ochre'][WSD % 4];
      gc('ashlar', g0, 0, z0, gx, H, z1, 64, 64, 'b'); gc('ashlar', gx + 2, 0, z0, g1, H, z1, 64, 64, 'b');
      gc('ashlar', gx, 2.5, z0, gx + 2, 3.6, z1, 64, 64, '');
      for (let x = gx; x < gx + 1.9; x += .5) { gc('ashlar', x + .05, 3.6, z1 - .24, x + .3, 4.0, z1, 64, 64, 'b'); gc('ashlar', x + .05, 3.6, z0, x + .3, 4.0, z0 + .24, 64, 64, 'b'); }
      for (const [a, b] of [[g0, gx], [gx + 2, g1]]) { gc('flags', a + .02, H + .01, z0 + .02, b - .02, H + .05, z1 - .02, 64, 64, 'b'); for (let x = a; x < b - .1; x += .5) for (const [za, zb] of [[z1 - .22, z1 + .1], [z0 - .1, z0 + .22]]) gc('ashlar', x + .06, H, za, x + .32, H + .5, zb, 64, 64, 'b');
        for (let z = z0 + .4; z < z1 - .3; z += .5) for (const [xa, xb] of [[a - .1, a + .22], [b - .22, b + .1]]) gc('ashlar', xa, H, z, xb, H + .5, z + .26, 64, 64, 'b'); }
      gc('stone', gx - .1, 2.3, z1, gx + 2.1, 2.55, z1 + .08, 32, 32, '');
      for (const [a, b] of [[g0, gx], [gx + 2, g1]]) gc('stone', a - .1, H - .2, z0 - .1, b + .1, H, z1 + .1, 32, 32, 'b');
      for (const x of [gx - .55, gx + 2.55]) { gc('stone', x - .16, 3.05, z1, x + .16, 4.35, z1 + .04, 32, 32, ''); gc('dark', x - .04, 3.15, z1 + .04, x + .04, 4.25, z1 + .05, 16, 16, ''); gc('dark', x - .13, 3.62, z1 + .04, x + .13, 3.7, z1 + .05, 16, 16, ''); }
      for (let x = gx + .15; x < gx + 1.95; x += .25) gc('iron', x, 2.28, z1 - .62, x + .05, 2.5, z1 - .57, 16, 16, ''); gc('iron', gx, 2.44, z1 - .63, gx + 2, 2.5, z1 - .56, 16, 16, '');
      group(() => gc(ban, g0 + .45, 2.6, z1 + .01, g0 + 1.05, 4.6, z1 + .05, 32, 32, '')); group(() => gc(ban, g1 - 1.05, 2.6, z1 + .01, g1 - .45, 4.6, z1 + .05, 32, 32, ''));
      for (const [a, b] of [[g0, gx], [gx + 2, g1]]) { const [xa, za] = W2(a, z0), [xb, zb] = W2(b, z1); const X0 = Math.min(xa, xb), X1 = Math.max(xa, xb), Z0 = Math.min(za, zb), Z1 = Math.max(za, zb);
        solids.push([X0, Z0, X1, Z1]); for (let y = Math.floor(Z0); y < Math.ceil(Z1); y++) for (let x = Math.floor(X0); x < Math.ceil(X1); x++) if (x + .5 > X0 && x + .5 < X1 && y + .5 > Z0 && y + .5 < Z1) blockedCell.add(I(x, y)); }
      for (const x of [gx - .3, gx + 2.3]) { const [lx, lz] = W2(x, z1 + .5); addLight(lx, 2.2, lz, day ? 0 : 3.2, 6, 0xffa040, 2); }
      for (const x of [gx - .25, gx + 2.05]) { gc('iron', x, 1.9, z1, x + .2, 1.95, z1 + .3, 16, 16, ''); const [fx2, fz2] = W2(x + .1, z1 + .3); flame(scene, fx2, 2.15, fz2, 1); }
      // the watch room's door opens off the gate passage in the left tower's side (the interior is planned by works.js)
      { const vm = (z0 + z1) / 2 - .2; gc('door', gx - .01, .08, vm - .34, gx + .03, 1.65, vm + .34, 32, 32, ''); gc('stone', gx - .02, 1.65, vm - .44, gx + .05, 1.78, vm + .44, 32, 32, '');
        const [xa, za] = W2(g0, z0), [xb, zb] = W2(gx, z1); P.GATES.push({ gate: true, id: 'gate' + P.GATES.length, door: W2(gx + .35, vm), x: Math.min(xa, xb), y: Math.min(za, zb), w: Math.abs(xb - xa), d: Math.abs(zb - za), G: { ...G, gw } }); }
      zoneName.set(I(...W2(gx, .5).map(Math.floor)), 'Town gate'); zoneName.set(I(...W2(gx + 1, .5).map(Math.floor)), 'Town gate');
    }
  }

  // ---------- the square: fountain, market cross, stalls, lamps, trees ----------
  const props = [];
  const nearDoor = (x, z, r0) => HOUSES.some((h) => h.door && Math.hypot(h.door[0] - x, h.door[1] - z) < r0);   // nothing solid stands in front of a door
  const place = (name, x, z, rot = 0, s = 1, solid = true, seed) => { if (solid && nearDoor(x, z, 1.05)) return null; const g = build(name, seed); if (!g) return null; g.position.set(x, Bk.lift ?? hAt(x, z), z); g.rotation.y = rot; g.scale.setScalar(s); scene.add(g);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    if (solid) { const fp = g.userData.fp || { w: .6, d: .6 }; const hw = Math.max(fp.w, fp.d) * s / 2 * .8; solids.push([x - hw, z - hw, x + hw, z + hw]); } props.push(g); return g; };
  const [fx, fz] = P.fountain || [-99, -99];
  if (P.fountain) { // fountain: octagonal basin, water, centre pillar with a bowl
    const bas = new THREE.CylinderGeometry(1.25, 1.3, .55, 8, 1, true), uv = bas.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 8 * .95 * 32 / 32, uv.getY(k) * .55 * 32 / 32);
    geo('stone', bas, new THREE.Matrix4().makeRotationY(Math.PI / 8).setPosition(fx, .275, fz));
    geo('stone', new THREE.CylinderGeometry(1.15, 1.15, .5, 8, 1, true).scale(-1, 1, 1), new THREE.Matrix4().makeRotationY(Math.PI / 8).setPosition(fx, .3, fz));
    geo('stone', new THREE.TorusGeometry(1.2, .08, 4, 8).rotateX(Math.PI / 2), new THREE.Matrix4().makeRotationY(Math.PI / 8).setPosition(fx, .56, fz));
    const wat = new THREE.Mesh(new THREE.CircleGeometry(1.16, 8).rotateX(-Math.PI / 2), Mt.water); wat.position.set(fx, .42 + hAt(fx, fz), fz); wat.rotation.y = Math.PI / 8; scene.add(wat);
    geo('stone', new THREE.CylinderGeometry(.14, .2, 1.4, 8), new THREE.Matrix4().makeTranslation(fx, 1.0, fz));
    geo('stone', new THREE.CylinderGeometry(.55, .18, .25, 8), new THREE.Matrix4().makeTranslation(fx, 1.7, fz));
    geo('stone', new THREE.CylinderGeometry(.06, .1, .5, 8), new THREE.Matrix4().makeTranslation(fx, 2.0, fz));
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(.04, .25, 1.25, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xcfe6ff, transparent: true, opacity: .35, depthWrite: false })); jet.position.set(fx, 1.2 + hAt(fx, fz), fz); scene.add(jet);
    solids.push([fx - 1.3, fz - 1.3, fx + 1.3, fz + 1.3]); zoneName.set('fountain', 1);
  }
  // churchyard: low wall along the square with a lych-gate, a path to the south door, a dark yew
  if (ch) { const cy = ch.y - 3, zw0 = cy + 13.72, zw1 = cy + 13.98, xa = ch.yx0, xb = ch.x + ch.w + 2, ga = ch.x + 4.9, gb = ch.x + 5.9, tx0 = ch.x, tx1 = ch.x + 3;
    for (const [a, b] of [[xa, tx0], [tx1, ga], [gb, xb]]) if (b - a > .05) { cube('ashlar_dark', a, 0, zw0, b, .62, zw1, 64, 64, 'b'); cube('stone', a - .03, .62, zw0 - .04, b + .03, .72, zw1 + .04, 32, 32, 'b'); solids.push([a, zw0, b, zw1]); }
    const gk = snow ? 'roof_snow' : 'roof_brown', gm = (ga + gb) / 2;
    for (const px of [ga - .04, gb - .08]) for (const pz of [(cy + 13.35), (cy + 14.2)]) { cube('beam', px, 0, pz, px + .12, 1.75, pz + .12, 32, 32, ''); solids.push([px, pz, px + .12, pz + .12]); }
    for (const pz of [(cy + 13.35), (cy + 14.2)]) cube('beam', ga - .1, 1.65, pz, gb + .1, 1.78, pz + .12, 32, 32, '');
    cube('beam', ga - .04, 1.65, (cy + 13.35), ga + .08, 1.78, (cy + 14.32), 32, 32, ''); cube('beam', gb - .08, 1.65, (cy + 13.35), gb + .04, 1.78, (cy + 14.32), 32, 32, '');
    quad(gk, V(ga - .3, 1.62, (cy + 14.5)), V(gm, 2.45, (cy + 14.5)), V(gm, 2.45, (cy + 13.15)), V(ga - .3, 1.62, (cy + 13.15)), 64, 64);
    quad(gk, V(gm, 2.45, (cy + 14.5)), V(gb + .3, 1.62, (cy + 14.5)), V(gb + .3, 1.62, (cy + 13.15)), V(gm, 2.45, (cy + 13.15)), 64, 64);
    tri('beam', V(ga - .1, 1.78, (cy + 14.32)), V(gb + .1, 1.78, (cy + 14.32)), V(gm, 2.35, (cy + 14.32))); tri('beam', V(gb + .1, 1.78, (cy + 13.35)), V(ga - .1, 1.78, (cy + 13.35)), V(gm, 2.35, (cy + 13.35)));
    cube(snow ? 'roof_snow' : 'ridge_brown', gm - .06, 2.4, (cy + 13.15), gm + .06, 2.5, (cy + 14.5), 32, 32, '');
    // path: from the lych-gate north, then east to a door in the nave's south wall
    const pa = ga + .18, pb = gb - .18; quad('path', V(pa, .012, (cy + 14.0)), V(pb, .012, (cy + 14.0)), V(pb, .012, (cy + 11.05)), V(pa, .012, (cy + 11.05)), 64, 64);
    cube('stone', ga + .05, 0, (cy + 11), gb - .05, 1.95, (cy + 11.1), 32, 32, ''); cube('iron', gb + .05, 1.7, (cy + 11), gb + .09, 1.74, (cy + 11.3), 16, 16, ''); cube('lamp', gb - .02, 1.45, (cy + 11.2), gb + .14, 1.68, (cy + 11.38), 16, 16, ''); addLight(gb + .06, 1.5, (cy + 11.6), day ? 0 : 2.6, 5, 0xffb060, 2); cube('door', ga + .15, .1, (cy + 11.1), gb - .15, 1.8, (cy + 11.13), 32, 32, ''); tri('stone', V(ga + .05, 1.95, (cy + 11.1)), V(gb - .05, 1.95, (cy + 11.1)), V((ga + gb) / 2, 2.35, (cy + 11.1)));
    const yew = place('tree', ch.yx0 + .9, (cy + 8.2), 1.3, 1.0, true, 77); if (yew) { yew.name = 'yew'; yew.traverse((o) => { if (o.isMesh && !/trunk|bark/.test(o.name + (o.material.name || ''))) { o.material = o.material.clone(); o.material.color.setHex(snow ? 0xc8d4dc : 0x9cba90); } }); }
    cube('iron', gb + .05, 1.5, (cy + 14.32), gb + .09, 1.54, (cy + 14.55), 16, 16, ''); cube('lamp', gb - .02, 1.26, (cy + 14.45), gb + .14, 1.48, (cy + 14.62), 16, 16, ''); addLight(gb + .06, 1.4, (cy + 14.8), day ? 0 : 2.6, 5, 0xffb060, 2);
    zoneName.set(I(Math.floor(ga), ch.y + 10), 'Lych-gate'); }
  // market cross near the church
  if (false) { const cx = sq.x0 + 1.6, cz = sq.y0 + 4.2;   // dropped r9: in the west houses' shadow it read as a black disc geo('ashlar', new THREE.CylinderGeometry(.7, .8, .2, 8), new THREE.Matrix4().makeTranslation(cx, .1, cz)); geo('ashlar', new THREE.CylinderGeometry(.5, .55, .2, 8), new THREE.Matrix4().makeTranslation(cx, .3, cz));
    geo('stone', new THREE.BoxGeometry(.18, 2.4, .18), new THREE.Matrix4().makeTranslation(cx, 1.6, cz)); geo('stone', new THREE.BoxGeometry(.7, .16, .16), new THREE.Matrix4().makeTranslation(cx, 2.4, cz)); solids.push([cx - .6, cz - .6, cx + .6, cz + .6]); }
  // stalls in two rows: posts, counter, canopy, goods
  const STALL = [['cloth_red', [0xd8b060, 0xb07040]], ['cloth_teal', [0x9ac0d8, 0xd0d8e0]], ['cloth_green', [0xd04030, 0x80b040]], ['cloth_ochre', [0xd8d0c0, 0xa080c0]], ['cloth_linen', [0xb85a3a, 0x6a8ab0]], ['cloth_red', [0xe0a030, 0x804020]]];
  // stalls stand where the whole stall fits on the square, clear of the fountain, the landmarks' fronts and the road through
  const inGh = (x, z, m) => gh && x > gh.x - m && x < gh.x + gh.w + m && z > gh.y - m && z < gh.y + gh.d + 1 + m;
  const sqAll = (x0, z0, x1, z1) => { for (let y = Math.floor(z0); y <= Math.floor(z1); y++) for (let x = Math.floor(x0); x <= Math.floor(x1); x++) if (at(x, y) !== 'square') return false; return true; };
  const stallSpots = [], stallBase = [2, 4, 6, 6][P.rank], stallCap = !CH ? stallBase : CH.prosperity === 'struggling' ? Math.max(1, Math.floor(stallBase / 2)) : CH.prosperity === 'thriving' ? stallBase + 2 : stallBase;   // a struggling market keeps fewer stalls
  if (P.fountain) for (const [ox, oz] of [[4, -2.5], [6.5, -2.5], [-4, 2], [-6.5, 2], [9, -2.5], [4.5, 2.2], [-4, -2.5], [-6.5, -2.5], [7, 2.2], [-9, 2]]) { if (stallSpots.length >= stallCap) break; const sx = fx + ox, sz = fz + oz;
    if (!sqAll(sx - 1, sz - .5, sx + 1.4, sz + .8) || inGh(sx, sz, 1.6) || Math.abs(sx - (P.mx + 1.5)) < 2.4 || (ch && Math.abs(sx - (ch.x + 1.5)) < 3.6 && sz < ch.y + 16.5) || stallSpots.some(([a, b]) => Math.abs(a - sx) < 2.3 && Math.abs(b - sz) < 1.6)) continue; stallSpots.push([sx, sz]); }
  stallSpots.forEach(([sx, sz], i) => { const [ck, gc] = STALL[i];
    cube('wood', sx - .7, .55, sz - .1, sx + .7, .7, sz + .4, 32, 32, ''); cube('wood', sx - .65, 0, sz, sx + .65, .55, sz + .35, 32, 32, '');
    for (const px of [-.7, .7]) for (const pz of [-.25, .45]) cube('beam', sx + px - .04, 0, sz + pz - .04, sx + px + .04, pz < 0 ? 1.85 : 1.6, sz + pz + .04, 32, 32, '');
    quad('sc_' + ck, V(sx - .85, 1.55, sz + .65), V(sx + .85, 1.55, sz + .65), V(sx + .85, 1.95, sz - .4), V(sx - .85, 1.95, sz - .4), 32, 32);
    quad('sc_' + ck, V(sx + .85, 1.549, sz + .65), V(sx - .85, 1.549, sz + .65), V(sx - .85, 1.949, sz - .4), V(sx + .85, 1.949, sz - .4), 32, 32);
    cube('sc_' + ck, sx - .85, 1.42, sz + .64, sx + .85, 1.55, sz + .67, 32, 32, '');
    const gm = [seeThrough(new THREE.MeshStandardMaterial({ color: gc[0], roughness: .8 })), seeThrough(new THREE.MeshStandardMaterial({ color: gc[1], roughness: .8 }))];
    for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(k % 2 ? new THREE.SphereGeometry(.1, 6, 4) : new THREE.BoxGeometry(.24, .14, .2), gm[k % 2]); m.position.set(sx - .5 + k * .33, .78, sz + .15); m.castShadow = true; scene.add(m); }
    place(i % 2 ? 'barrel' : 'crate_sacks', sx + .95, sz - .3, i, .75);
    solids.push([sx - .75, sz - .3, sx + .75, sz + .45]); });
  const sqTrees = []; if (sq) for (const [tx, tz] of [[sq.x0 + 1.5, sq.y1 - 1.5], [sq.x1 - 1.5, sq.y1 - 1.5], [sq.x1 - 1.5, sq.y0 + 3.5], [sq.x0 + 1.5, sq.y0 + 3.5], [sq.x1 - 3.5, sq.y1 - .8]]) {
    if (sqTrees.length >= 3 || !sqAll(tx - 1, tz - 1, tx + 1, tz + 1) || Math.hypot(tx - fx, tz - fz) < 3.2 || inGh(tx, tz, 1.5) || Math.abs(tx - (P.mx + 1.5)) < 2.5 || (ch && Math.abs(tx - ch.cx) < 3.5 && tz < ch.y + 15) || stallSpots.some(([a, b]) => Math.abs(a - tx) < 2.2 && Math.abs(b - tz) < 1.8)) continue;
    sqTrees.push([tx, tz]); const t = place('tree', tx, tz, r() * 6, .9, true, Math.floor(tx * 3 + tz));
    geo('stone', new THREE.CylinderGeometry(.55, .6, .3, 8, 1, true), new THREE.Matrix4().makeTranslation(tx, .15, tz)); geo('stone', new THREE.TorusGeometry(.57, .06, 4, 8).rotateX(Math.PI / 2), new THREE.Matrix4().makeTranslation(tx, .3, tz));
    // bare earth inside the ring, a little below the kerb
    { const c = new THREE.CircleGeometry(.56, 8).rotateX(-Math.PI / 2); const cu = c.attributes.uv; for (let k = 0; k < cu.count; k++) cu.setXY(k, cu.getX(k) * .3, cu.getY(k) * .3); geo('soil', c, new THREE.Matrix4().makeTranslation(tx, .24, tz)); } }
  // lamp posts around the square and along the main street
  const lamp = (x, z) => { group(() => { cube('iron', x - .05, 0, z - .05, x + .05, 2.3, z + .05, 16, 16, ''); cube('iron', x - .12, 0, z - .12, x + .12, .18, z + .12, 16, 16, '');
    cube('lamp', x - .13, 2.0, z - .13, x + .13, 2.38, z + .13, 16, 16, ''); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cube('iron', x + a * .14 - .025, 1.98, z + b * .14 - .025, x + a * .14 + .025, 2.4, z + b * .14 + .025, 16, 16, '');
    cube('iron', x - .18, 1.94, z - .18, x + .18, 2.0, z + .18, 16, 16, ''); cube('iron', x - .19, 2.38, z - .19, x + .19, 2.46, z + .19, 16, 16, ''); geo('iron', new THREE.ConeGeometry(.14, .2, 4).rotateY(Math.PI / 4), new THREE.Matrix4().makeTranslation(x, 2.56, z)); });
    addLight(x, 2.2, z, day ? 0 : 4.2, 7.5, 0xffb060, 2); solids.push([x - .12, z - .12, x + .12, z + .12]); };
  const clearAt = (x, z, rr) => WALKK.has(at(Math.floor(x), Math.floor(z))) && !awn.has(I(Math.floor(x), Math.floor(z))) && !solids.some((b) => x + rr > b[0] && x - rr < b[2] && z + rr > b[1] && z - rr < b[3]) && !P.gates.some((G) => Math.hypot(x - G.cx, z - G.cy) < 4.5) && Math.hypot(x - P.start[0] - .5, z - P.start[1] - .5) > 2;
  if (sq) for (const [x, z] of [[sq.x0 + 1.2, sq.y1 - .5], [sq.x1 - 1.2, sq.y1 - .6], [fx - 3, fz - 2.5], [sq.x1 - 1.2, sq.y0 + 1.5], [sq.x0 + 1.2, sq.y0 + 1.5]]) if (at(Math.floor(x), Math.floor(z)) === 'square' && clearAt(x, z, .6) && !inGh(x, z, 1)) lamp(x, z);
  const notWalk = (x, y) => !WALKK.has(at(x, y)) || at(x, y) === 'yard';
  if (P.rank >= 1) for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = at(x, y);
    if ((k === 'main' || k === 'quay') && notWalk(x - 1, y) && y % 6 === (P.seed % 6) && clearAt(x + .15, y + .5, .4)) lamp(x + .15, y + .5);
    else if (k === 'street' && notWalk(x, y - 1) && (x + y * 3 + P.seed) % 8 === 0 && clearAt(x + .5, y + .2, .4)) lamp(x + .5, y + .2); }
  // trees: in the churchyard, a couple on the square, and in the larger yards
  const treeCells = [];
  // gen2: no trees on a castle ward or a market place, and none in front of any door (objects never block a way in)
  const g2Doors = P.BLDS ? P.BLDS.flatMap((b) => b.doors.filter((d) => !d.water)) : [], g2Kind = P.gen2 ? Object.fromEntries(P.gen2.buildings.map((b) => [b.id, b.apron])) : {}; const g2Host = P.gen2 ? Object.fromEntries(P.gen2.buildings.filter((b) => b.host != null).map((b) => [b.id, b.host])) : {};
  const g2NoTree = (x, y) => !!P.gen2 && ((P.apr[I(x, y)] >= 0 && ['ward', 'market', 'tenter', 'close', 'burial'].includes(g2Kind[P.apr[I(x, y)]])) || g2Doors.some((d) => Math.max(Math.abs(d.x - x), Math.abs(d.y - y)) <= 2));
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = at(x, y);
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dx, dy]) => at(x + dx, y + dy) === k);
    // a gen2 green inside the town is an orchard close: fruit trees in rows three cells apart, the grass between them open
    if (P.green && P.green(x, y)) { if (x % 3 === 1 && y % 3 === 1 && r() < .85 && !g2NoTree(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dx, dy]) => P.green(x + dx, y + dy))) treeCells.push([x, y, 1]); }
    else if ((k === 'yard' || k === 'yardC') && nb && r() < (k === 'yardC' ? .14 : .22) && !g2NoTree(x, y)) treeCells.push([x, y]);
    if (k === 'out' && [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]].every(([dx, dy]) => at(x + dx, y + dy) === 'out' || at(x + dx, y + dy) === 'field') && r() < .07) treeCells.push([x, y]); }
  for (const [x, y, orch] of treeCells) { if (treeCells.some(([a, b]) => (a !== x || b !== y) && Math.abs(a - x) + Math.abs(b - y) < 2 && a * 100 + b < x * 100 + y)) continue;
    const t = place('tree', x + .5, y + .5, r() * 6, orch ? .58 + r() * .14 : .85 + r() * .3, true, x * 7 + y); }
  // yards: woodpiles, barrels, washing lines, a well; fences along plot lines
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (at(x, y) === 'yard' && !treeCells.some(([a, b]) => a === x && b === y)) {
    const v = r();
    if (v < .07) place('woodpile', x + .5, y + .5, (r() < .5 ? 0 : Math.PI / 2), .9);
    else if (v < .13) place('barrel', x + .35 + r() * .3, y + .4 + r() * .2, r() * 6, .85);
    else if (v < .16) place('well', x + .5, y + .5, 0, .8);
    else if (v < .22 && at(x + 1, y) === 'yard') { // washing line between two posts with cloth
      for (const px of [x + .15, x + 1.85]) cube('beam', px - .03, 0, y + .45, px + .03, 1.55, y + .51, 32, 32, '');
      cube('dark', x + .15, 1.48, y + .475, x + 1.85, 1.49, y + .485, 16, 16, '');
      for (let k = 0; k < 3; k++) { const c = pick(['cloth_linen', 'cloth_teal', 'cloth_red', 'cloth_ochre']); const cx = x + .4 + k * .5; cube(c, cx - .15, .95 + r() * .15, y + .47, cx + .15, 1.48, y + .49, 32, 32, ''); }
      solids.push([x + .1, y + .4, x + .2, y + .55], [x + 1.8, y + .4, x + 1.9, y + .55]); }
    // fences on lot lines running back through the yard
    for (const [dx, dy] of [[1, 0], [0, 1]]) { const a = lotId[I(x - dx * 0 + (dx ? 0 : 0), y)] ; }
  }
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (at(x, y) === 'yard' && ((x * 13 + y * 7) % 11 === 0) && !solids.some((b) => b[0] < x + 1 && b[2] > x && b[1] < y + 1 && b[3] > y)) {
    cube('beam', x + .45, 0, y + .45, x + .53, 1.7, y + .53, 32, 32, ''); cube('iron', x + .4, 1.7, y + .4, x + .58, 1.74, y + .58, 16, 16, ''); cube('lamp', x + .42, 1.5, y + .42, x + .56, 1.7, y + .56, 16, 16, '');
    addLight(x + .5, 1.6, y + .5, day ? 0 : 2.4, 5, 0xffa850, 1); solids.push([x + .4, y + .4, x + .58, y + .58]); }
  { // fences: where two yard cells belong behind different houses (nearest lot differs), a paling fence on the line between
    const owner = (x, y) => { let best = -1, bd = 9; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const id = lotId[I(x + dx, y + dy)]; if (x + dx < 0 || y + dy < 0 || x + dx >= MW || y + dy >= MH || id < 0) continue; const d = Math.abs(dx) + Math.abs(dy); if (d < bd) { bd = d; best = id; } } return best; };
    for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) if (at(x, y) === 'yard') {
      if (at(x + 1, y) === 'yard' && owner(x, y) !== owner(x + 1, y) && (x + y) % 3 !== 0) { for (let k = 0; k < 4; k++) cube('wood', x + .97, 0, y + k * .25 + .03, x + 1.03, .7 + (k % 2) * .06, y + k * .25 + .2, 32, 32, ''); cube('beam', x + .96, .45, y, x + 1.04, .52, y + 1, 32, 32, ''); solids.push([x + .92, y, x + 1.08, y + 1]); }
      if (at(x, y + 1) === 'yard' && owner(x, y) !== owner(x, y + 1) && (x * 2 + y) % 3 !== 0) { for (let k = 0; k < 4; k++) cube('wood', x + k * .25 + .03, 0, y + .97, x + k * .25 + .2, .7 + (k % 2) * .06, y + 1.03, 32, 32, ''); cube('beam', x, .45, y + .96, x + 1, .52, y + 1.04, 32, 32, ''); solids.push([x, y + .92, x + 1, y + 1.08]); }
    } }
  // street life: barrels and crates against house fronts on the streets, a cart near the gate
  for (const L of lots) if ((L.street === 'street' || L.street === 'main') && r() < .22) {
    const [dx, dy] = { S: [0, 1], N: [0, -1], E: [1, 0], W: [-1, 0] }[L.f];
    const cx = L.f === 'E' ? L.x + L.w + .3 : L.f === 'W' ? L.x - .3 : L.x + .3 + r() * (L.w - .6), cz = L.f === 'S' ? L.y + L.d + .3 : L.f === 'N' ? L.y - .3 : L.y + .3 + r() * (L.d - .6);
    const k = at(Math.floor(cx), Math.floor(cz)); if (k === 'street' || k === 'main') { const sw = at(Math.floor(cx) + dx, Math.floor(cz) + dy); if (k === 'main' && sw !== 'main') {} else place(r() < .5 ? 'barrel' : 'crate_sacks', cx, cz, r() * 6, .7); } }
  { const G = P.gates.find((G) => G.dir === 's'); if (G && ['out', 'field'].includes(at(Math.floor(G.u + 5.2), Math.floor(G.line + 3.8))) && ['out', 'field'].includes(at(Math.floor(G.u + 5.2), Math.floor(G.line + 3.2)))) place('cart', G.u + 5.2, G.line + 3.8, .3, 1); }   // parked on the verge outside the gate, never across a lane of the road
  // ---------- the chronicle outside the walls (fork): a refugee camp by a gate, the burial ground of the latest plague ----------
  if (CH && (CH.camp || CH.burialGround)) { Bk.setLift(null);
    const WAYO = new Set(['main', 'street', 'lane', 'alley', 'square', 'road', 'bridge', 'quay']), OPEN = new Set(['out', 'field']);
    const outside = (x, y) => !(P.walls && P.walls.ins) || P.walls.ins[I(x, y)] !== 1;
    const nearWay = (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (WAYO.has(at(x + dx, y + dy))) return true; return false; };
    const blocked = (x0, z0, x1, z1) => solids.some((b) => x1 > b[0] && x0 < b[2] && z1 > b[1] && z0 < b[3]);
    const ground = (x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (!inG(x, y) || !OPEN.has(at(x, y)) || nearWay(x, y) || !outside(x, y)) return false; return !blocked(x0, y0, x0 + w, y0 + h); };
    // where to look: just outside each gate, along its road; a town without walls, round the edge of the built ground nearest the market
    const OUT = { s: [0, 1], n: [0, -1], e: [1, 0], w: [-1, 0] };
    let seeds = P.gates.filter((G) => !G.water && OUT[G.dir]).map((G) => [Math.round(G.cx + OUT[G.dir][0] * 5), Math.round(G.cy + OUT[G.dir][1] * 5)]);
    if (!seeds.length) { const mx = P.mx ?? MW / 2, my = P.my ?? MH / 2; seeds = [[Math.round(mx), Math.round(my)]]; }
    const rc2 = rngOf(seed * 61 + 5), sites = [];
    for (const [sx, sy] of seeds) { const cand = []; for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) if (OPEN.has(at(x, y)) && !nearWay(x, y) && outside(x, y)) cand.push([Math.hypot(x - sx, y - sy), x, y]); cand.sort((a, b) => a[0] - b[0]); sites.push(cand); }
    const used = [], free2 = (x, y, w, h) => !used.some(([a, b, c, d]) => x < c + 1 && x + w > a - 1 && y < d + 1 && y + h > b - 1);
    // the camp: a few households to a fire, tents and lean-tos in rows, a handcart
    if (CH.camp && sites[0]) { const want = Math.max(4, Math.min(14, Math.round((CH.refugees || .05) * 80)));
      for (const [, x, y] of sites[0]) { if (campTents.length >= want) break; if (Math.hypot(x - sites[0][0][1], y - sites[0][0][2]) > 12) break; if (!ground(x, y, 2, 2) || !free2(x, y, 2, 2)) continue; used.push([x, y, x + 2, y + 2]);
        const cx = x + 1, cz = y + .9, kind = campTents.length % 4 === 3 ? 'lean' : 'tent', cloth = ['cloth_linen', 'cloth_ochre', 'cloth_linen', 'wood'][campTents.length % 4];
        group(() => { if (kind === 'tent') { const hw = .58, hl = .78, top = 1.0, k = cloth === 'wood' ? 'cloth_linen' : cloth;   // a ridge tent, its end and door to the street side (south)
          for (const sd of [-1, 1]) { const a = V(cx + sd * hw, .02, cz - hl), b = V(cx + sd * hw, .02, cz + hl), c = V(cx, top, cz + hl), d = V(cx, top, cz - hl); quad(k, a, b, c, d, 32, 32); quad(k, d, c, b, a, 32, 32); }
          for (const ez of [-hl, hl]) { const a = V(cx - hw, .02, cz + ez), b = V(cx + hw, .02, cz + ez), c = V(cx, top, cz + ez); tri(k, a, b, c, 32, 32); tri(k, c, b, a, 32, 32); }
          { const z = cz + hl + .01, a = V(cx - .22, .02, z), b = V(cx + .22, .02, z), c = V(cx, .62, z); tri('dark', a, b, c, 16, 16); tri('dark', c, b, a, 16, 16); }   // the door flap open
          cube('beam', cx - .03, 0, cz + hl - .02, cx + .03, top + .14, cz + hl + .04, 16, 16, ''); cube('beam', cx - .03, 0, cz - hl - .04, cx + .03, top + .14, cz - hl + .02, 16, 16, '');
          cube('beam', cx - .02, top - .02, cz - hl, cx + .02, top + .03, cz + hl, 16, 16, ''); }
        else { cube('wood', cx - .8, 0, cz - .5, cx + .8, .95, cz - .38, 32, 32, ''); for (const ex of [-.8, .74]) cube('wood', cx + ex, 0, cz - .5, cx + ex + .06, .95, cz + .45, 32, 32, ''); cube('wood', cx - .9, .95, cz - .55, cx + .9, 1.02, cz + .5, 32, 32, ''); cube('cloth_linen', cx - .7, 0, cz + .1, cx - .1, .14, cz + .4, 16, 16, ''); } });
        solids.push([cx - .85, cz - .65, cx + .85, cz + .65]); campTents.push([cx, cz]); }
      // a fire to every three households: a ring of stones, logs and embers
      for (let i = 0; i < campTents.length; i += 3) { const [tx, tz] = campTents[i], fx2 = tx + (i % 2 ? -1.2 : 1.2), fz2 = tz + 1.3; if (!OPEN.has(at(Math.floor(fx2), Math.floor(fz2)))) continue;
        group(() => { for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; cube('stone', fx2 + Math.cos(a) * .28 - .06, 0, fz2 + Math.sin(a) * .28 - .06, fx2 + Math.cos(a) * .28 + .06, .1, fz2 + Math.sin(a) * .28 + .06, 16, 16, ''); }
        cube('dark', fx2 - .2, 0, fz2 - .05, fx2 + .2, .08, fz2 + .05, 16, 16, ''); cube('dark', fx2 - .05, .04, fz2 - .2, fx2 + .05, .12, fz2 + .2, 16, 16, ''); cube('lamp', fx2 - .09, .06, fz2 - .09, fx2 + .09, .14, fz2 + .09, 16, 16, ''); }); }
      if (campTents.length) { const [tx, tz] = campTents[campTents.length - 1]; if (OPEN.has(at(Math.floor(tx + 1.8), Math.floor(tz)))) place('cart', tx + 1.8, tz, rc2() * 6, .9); } }
    // the plague dead: a walled ground of fresh mounds in rows, wooden crosses, a gate in the wall; no building just south of it,
    // where it would stand between the ground and the camera
    const allOut = (x, y0, w, h) => { if (x < 3 || y0 < 3 || x + w > MW - 3 || y0 + h > MH - 3) return false; for (let y = y0; y < y0 + h; y++) for (let x1 = x; x1 < x + w; x1++) if (at(x1, y) !== 'out') return false; return true; };   // on grass, never in a ploughed field
    const clearSouth = (x, y0, w) => { for (let y = y0; y < y0 + 5; y++) for (let x1 = x; x1 < x + w; x1++) if (inG(x1, y) && !OPEN.has(at(x1, y)) && !WAYO.has(at(x1, y))) return false; return true; };
    if (CH.burialGround) { let at0 = null;
      // on grass if the town has any to spare, else at a field's edge
      for (const grass of [true, false]) { for (const list of [sites[1], sites[0]].filter(Boolean)) { for (const [, x, y] of list) { if (ground(x, y, 4, 3) && free2(x, y, 4, 3) && clearSouth(x, y + 3, 4) && (!grass || allOut(x, y, 4, 3))) { at0 = [x, y]; break; } } if (at0) break; } if (at0) break; }
      if (at0) { const [x, y] = at0, w = 4, h = 3; P.chronAt.burial = [x + w / 2, y + h / 2]; used.push([x, y, x + w, y + h]); group(() => {
        for (let k = 0; k <= 4; k++) for (const z of [y, y + h - .08]) cube('wood', x + k * (w - .08) / 4, 0, z, x + k * (w - .08) / 4 + .08, .75, z + .08, 16, 16, '');
        for (const xx of [x, x + w - .08]) for (let k = 1; k < 3; k++) cube('wood', xx, 0, y + k * h / 3, xx + .08, .75, y + k * h / 3 + .08, 16, 16, '');
        for (const z of [y + .02, y + h - .06]) for (const hh of [.28, .56]) { if (z > y + 1 && hh) { cube('wood', x, hh, z, x + 1.4, hh + .06, z + .04, 16, 16, ''); cube('wood', x + 2.4, hh, z, x + w, hh + .06, z + .04, 16, 16, ''); } else cube('wood', x, hh, z, x + w, hh + .06, z + .04, 16, 16, ''); }   // a gap for the gate on the near side
        for (const xx of [x + .02, x + w - .06]) for (const hh of [.28, .56]) cube('wood', xx, hh, y, xx + .04, hh + .06, y + h, 16, 16, '');
        for (let row = 0; row < 2; row++) for (let i = 0; i < 3; i++) { const gx = x + .4 + i * 1.15, gz = y + .55 + row * 1.15; cube('soil', gx, 0, gz, gx + .75, .13, gz + .45, 32, 32, 'b'); cube('soil', gx + .08, .13, gz + .07, gx + .67, .23, gz + .38, 32, 32, '');   // a fresh mound, heaped
          cube('wood', gx + .32, 0, gz - .1, gx + .42, .95, gz, 16, 16, ''); cube('wood', gx + .16, .62, gz - .1, gx + .58, .71, gz, 16, 16, ''); } });   // a cross at every head
        solids.push([x, y, x + w, y + h - 1.2]); solids.push([x, y + h - 1.2, x + 1.4, y + h]); solids.push([x + 2.4, y + h - 1.2, x + w, y + h]); } } }
  // ---------- the town's trade: boats, cranes, nets, pitheads, spoil, smelters, mills ----------
  const oquad = (key, a, b, c, d, out) => { const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(d, a)), m = a.clone().add(b).add(c).add(d).multiplyScalar(.25); if (n.dot(new THREE.Vector3().subVectors(m, out)) < 0) quad(key, d, c, b, a, 32, 32); else quad(key, a, b, c, d, 32, 32); };
  const beamTo = (key, p0, p1, w = .1) => { const m = new THREE.Matrix4().lookAt(p0, p1, Math.abs(p1.y - p0.y) > .9 * p0.distanceTo(p1) ? V(0, 0, 1) : V(0, 1, 0)); m.setPosition(p0.clone().add(p1).multiplyScalar(.5)); geo(key, new THREE.BoxGeometry(w, w, p0.distanceTo(p1)), m); };
  const boat = (F) => { const s = F.s || 1, L = 2.3 * s, Wd = .86 * s, Hh = .46 * s, y0 = F.beached ? .4 * s : -.12, c = Math.cos(F.rot), sn = Math.sin(F.rot), hk = pick(['boat_b', 'boat_r', 'boat_g', 'boat_b', 'boat_w']);
    const Pw = (a, b, y) => V(F.x + a * c - b * sn, y, F.z + a * sn + b * c), st = [[-L / 2, Wd * .4], [-L / 4, Wd / 2], [L / 5, Wd / 2], [L / 2, 0]];
    group(() => { for (const sg of [1, -1]) for (let i = 0; i < 3; i++) { const [a0, b0] = st[i], [a1, b1] = st[i + 1];
        oquad(hk, Pw(a0, b0 * sg, y0), Pw(a1, b1 * sg, y0), Pw(a1 * .86, 0, y0 - Hh), Pw(a0 * .86, 0, y0 - Hh), Pw((a0 + a1) / 2, 0, y0 - Hh * .3));
        tri('boat_in', Pw(a0, b0 * sg * .97, y0 - Hh * .18), Pw(a1, b1 * sg * .97, y0 - Hh * .18), Pw((a0 + a1) / 2, 0, y0 - Hh * .18)); tri('boat_in', Pw(a1, b1 * sg * .97, y0 - Hh * .18), Pw((a0 + a1) / 2, 0, y0 - Hh * .18), Pw((a1 + (st[i + 2] || st[3])[0]) / 2, 0, y0 - Hh * .18));
        oquad('plaster_white', Pw(a0, b0 * sg, y0 + .05), Pw(a1, b1 * sg, y0 + .05), Pw(a1, b1 * sg * 1.04, y0 - .04), Pw(a0, b0 * sg * 1.04, y0 - .04), Pw((a0 + a1) / 2, 0, y0)); }
      oquad(hk, Pw(-L / 2, Wd * .4, y0), Pw(-L / 2, -Wd * .4, y0), Pw(-L / 2 * .86, 0, y0 - Hh), Pw(-L / 2 * .86, 0, y0 - Hh), Pw(0, 0, y0 - Hh * .3));
      for (const a of [-L * .2, L * .15]) cube('wood', ...(() => { const p = Pw(a, 0, 0); return [p.x - .06, y0 - .12, p.z - .06, p.x + .06, y0 - .06, p.z + .06]; })(), 32, 32, '');
      if (F.mast) { const m0 = Pw(-L * .05, 0, y0 - Hh * .5), m1 = Pw(-L * .05, 0, y0 + 2.4 * s); beamTo('beam', m0, m1, .08); const y1 = y0 + 1.1 * s; beamTo('beam', Pw(-L * .05, 0, y1), Pw(-L * .45, 0, y1 + .05), .06); beamTo('cloth_linen', Pw(-L * .08, 0, y1 + .08), Pw(-L * .42, 0, y1 + .1), .16); } });
    if (F.beached) solids.push([F.x - L * .5, F.z - L * .5, F.x + L * .5, F.z + L * .5].map((v, i) => i % 2 ? F.z + (v - F.z) * (Math.abs(c) > .5 ? .45 : 1) : F.x + (v - F.x) * (Math.abs(c) > .5 ? 1 : .45))); };
  P.WORKS = [];
  for (const F of P.feats) {
    if (F.k === 'boat') boat(F);
    else if (F.k === 'crane') { const x = F.x, z = F.z; group(() => { cube('wood', x - .6, 0, z - .6, x + .6, 2.0, z + .6, 32, 32, 'b'); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cube('beam', x + a * .6 - .06, 0, z + b * .6 - .06, x + a * .6 + .06, 2.0, z + b * .6 + .06, 32, 32, '');
        const rk = snow ? 'roof_snow' : 'roof_brown'; for (const [p, q] of [[V(x - .75, 2.0, z + .75), V(x + .75, 2.0, z + .75)], [V(x + .75, 2.0, z + .75), V(x + .75, 2.0, z - .75)], [V(x + .75, 2.0, z - .75), V(x - .75, 2.0, z - .75)], [V(x - .75, 2.0, z - .75), V(x - .75, 2.0, z + .75)]]) tri(rk, p, q, V(x, 2.9, z), 64, 64);
        beamTo('beam', V(x, 1.6, z + .2), V(x, 3.6, z + 2.6), .14); beamTo('beam', V(x, 2.9, z), V(x, 3.5, z + 2.4), .08); beamTo('dark', V(x, 3.55, z + 2.55), V(x, 1.3, z + 2.55), .025);
        cube('wood', x - .22, .95, z + 2.33, x + .22, 1.3, z + 2.77, 32, 32, ''); }); solids.push([x - .65, z - .65, x + .65, z + .65]); zoneName.set(I(Math.floor(x), Math.floor(z)), 'Harbour crane'); }
    else if (F.k === 'net') { const x = F.x, z = F.z; for (const a of [-1, 1]) cube('beam', x + a - .04, 0, z - .04, x + a + .04, 1.45, z + .04, 32, 32, ''); cube('beam', x - 1.05, 1.38, z - .03, x + 1.05, 1.46, z + .03, 32, 32, '');
      quad('net', V(x - .96, .35, z), V(x + .96, .35, z), V(x + .96, 1.38, z), V(x - .96, 1.38, z), 32, 32); solids.push([x - 1.08, z - .1, x - .92, z + .1], [x + .92, z - .1, x + 1.08, z + .1]); }
    else if (F.k === 'headframe') { const x = F.x, z = F.z; group(() => { cube('stone', x - .75, 0, z - .75, x + .75, .35, z + .75, 32, 32, 'b'); cube('dark', x - .5, .351, z - .5, x + .5, .36, z + .5, 16, 16, '');
        for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) beamTo('beam', V(x + a * .85, 0, z + b * .85), V(x + a * .22, 3.1, z + b * .12), .13);
        cube('beam', x - .3, 3.0, z - .2, x + .3, 3.14, z + .2, 32, 32, ''); geo('wood', new THREE.TorusGeometry(.5, .06, 4, 14).rotateY(Math.PI / 2), new THREE.Matrix4().makeTranslation(x, 3.45, z));
        for (let k = 0; k < 4; k++) geo('beam', new THREE.BoxGeometry(.04, .96, .04).rotateX(k * Math.PI / 4), new THREE.Matrix4().makeTranslation(x, 3.45, z)); beamTo('dark', V(x, 3.0, z + .5), V(x, .36, z + .1), .025);
        cube('wood', x + .9, 0, z - .6, x + 1.9, 1.3, z + .6, 32, 32, 'b'); quad(snow ? 'roof_snow' : 'roof_brown', V(x + .8, 1.25, z + .7), V(x + 2.0, 1.55, z + .7), V(x + 2.0, 1.55, z - .7), V(x + .8, 1.25, z - .7), 64, 64); });
      solids.push([x - .95, z - .95, x + .95, z + .95], [x + .85, z - .65, x + 1.95, z + .65]); zoneName.set(I(Math.floor(x), Math.floor(z)), 'Pithead'); }
    else if (F.k === 'spoil') { const R2 = 1.35 * F.s, cone = new THREE.ConeGeometry(R2, 1.1 * F.s, 9, 2); const pos = cone.attributes.position; for (let k = 0; k < pos.count; k++) { const yy = pos.getY(k); if (yy < .5 * F.s && yy > -.5 * F.s) { pos.setX(k, pos.getX(k) * (1 + ((k * 37) % 7) / 30)); pos.setZ(k, pos.getZ(k) * (1 + ((k * 53) % 5) / 25)); } }
      cone.computeVertexNormals(); const cu = cone.attributes.uv; for (let k = 0; k < cu.count; k++) cu.setXY(k, cu.getX(k) * 4, cu.getY(k) * 1.5); geo(snow ? 'roof_snow' : 'spoil', cone, new THREE.Matrix4().makeTranslation(F.x, .55 * F.s - .05, F.z)); solids.push([F.x - R2 * .85, F.z - R2 * .85, F.x + R2 * .85, F.z + R2 * .85]); }
    else if (F.k === 'smelter' || F.k === 'mill') { const { x0, y0, x1, y1 } = F, mill = F.k === 'mill', H1 = mill ? 1.9 : 2.6, rk = snow ? 'roof_snow' : mill ? 'roof_thatch' : 'roof_slate';
      cube(mill ? 'ashlar' : 'stone', x0, 0, y0, x1, H1, y1, 64, 64, 'b'); if (mill) cube('plaster_cream', x0, H1, y0, x1, H1 + 1.3, y1, 64, 64, 'b');
      const eave = mill ? H1 + 1.3 : H1, mz = (y0 + y1) / 2, rr = 1.3;
      quad(rk, V(x0 - .2, eave - .15, y1 + .25), V(x1 + .2, eave - .15, y1 + .25), V(x1 + .2, eave + rr, mz), V(x0 - .2, eave + rr, mz), 64, 64); quad(rk, V(x1 + .2, eave - .15, y0 - .25), V(x0 - .2, eave - .15, y0 - .25), V(x0 - .2, eave + rr, mz), V(x1 + .2, eave + rr, mz), 64, 64);
      tri(mill ? 'plaster_cream' : 'stone', V(x0, eave, y0), V(x0, eave, y1), V(x0, eave + rr, mz)); tri(mill ? 'plaster_cream' : 'stone', V(x1, eave, y1), V(x1, eave, y0), V(x1, eave + rr, mz));
      cube('door', (x0 + x1) / 2 - .4, .1, y1, (x0 + x1) / 2 + .4, 1.6, y1 + .03, 32, 32, '');
      if (mill) { for (let k = 0; k < 2; k++) { const wx = x0 + 1 + k * 2; cube(r() < .55 && !day ? 'glass_lit' : 'glass', wx - .25, H1 + .4, y1, wx + .25, H1 + .95, y1 + .02, 16, 16, ''); }
        const wh = new THREE.Group(), wz = F.wz - .5; geo('wood', new THREE.TorusGeometry(1.0, .07, 4, 16).rotateY(Math.PI / 2), new THREE.Matrix4().makeTranslation(F.wx, .35, wz));
        for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; geo('beam', new THREE.BoxGeometry(.5, .08, .3), new THREE.Matrix4().makeRotationX(a).setPosition(F.wx, .35 + Math.sin(a) * 1.0, wz + Math.cos(a) * 1.0)); }
        for (let k = 0; k < 4; k++) geo('beam', new THREE.BoxGeometry(.06, 2.0, .06).rotateX(k * Math.PI / 4), new THREE.Matrix4().makeTranslation(F.wx, .35, wz)); cube('beam', F.wx - .35, .3, wz - .05, F.wx + .35, .4, y0, 32, 32, ''); void wh;
        zoneName.set(I(x0 + 1, y1), 'Mill'); }
      else { const cx = x1 - .7, cz = y0 + .7; group(() => { cube('brick', cx - .45, 0, cz - .45, cx + .45, 5.6, cz + .45, 64, 64, 'b'); cube('dark', cx - .3, 5.601, cz - .3, cx + .3, 5.61, cz + .3, 16, 16, ''); cube('stone', cx - .52, 5.4, cz - .52, cx + .52, 5.6, cz + .52, 32, 32, 'b'); });
        const mx2 = x0 + 1.2; cube('dark', mx2 - .45, .1, y1, mx2 + .45, 1.0, y1 + .02, 16, 16, ''); cube('lamp', mx2 - .3, .1, y1 + .021, mx2 + .3, .55, y1 + .03, 16, 16, ''); addLight(mx2, .7, y1 + .6, day ? 0 : 3.4, 6, 0xff7a30, 2);
        geo('dark', new THREE.ConeGeometry(.7, .6, 7), new THREE.Matrix4().makeTranslation(x0 - .8, .3, y1 - .6)); solids.push([x0 - 1.4, y1 - 1.2, x0 - .2, y1]); zoneName.set(I(x0 + 1, y1), 'Smelter'); }
      P.WORKS.push({ works: F.k, id: F.k + F.x0 + ',' + F.y0, door: [(x0 + x1) / 2, y1 + .35], x: x0, y: y0, w: x1 - x0, d: y1 - y0, F });   // the way in (works.js plans the inside)
      solids.push([x0, y0, x1, y1]); }
  }
  // ---------- gen2: every planned building raised from its own interior plan, turned and mirrored as the town placed it ----------
  P.BENTRY = [];
  if (P.BLDS) { const outK = new Set(['bld', 'lot', 'wall', 'court']), X = { THREE, cube, quad, tri, geo, V, group, solids, day, snow, addLight, out: (x, z) => !outK.has(at(Math.floor(x), Math.floor(z))) };
    for (const b of P.BLDS) { Bk.setLift(bPlat.get(b.id) ?? 0);
      try { if (b.type === 'tenterground') { const cs = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (P.apr[I(x, y)] === b.id && P.g[I(x, y)] === 'yardC') cs.push([x, y]); buildTenter(b, X, cs); }
        else if (b.monument || !b.planner) buildCross(b, X);
        else { const pl = PLANNERS[b.planner]({ seed, ...(b.opt || {}) }), S3 = buildShell(b, pl, X);
          for (const e of S3.entries) P.BENTRY.push({ gen2: true, id: 'b' + b.id + e.side, bid: b.id, door: e.at, x: b.x0, y: b.y0, w: b.W, d: b.H, planner: b.planner, opt: b.opt || {}, label: b.label }); }
      } catch (err) { console.warn('gen2 building', b.type, err); }
      for (let y = b.y0; y < b.y0 + b.H; y++) for (let x = b.x0; x < b.x0 + b.W; x++) if (inG(x, y) && P.bid[I(x, y)] === b.id) zoneName.set(I(x, y), b.label); }
    for (let i = 0; i < MW * MH; i++) if (P.apr[i] >= 0 && P.apronNames[P.apr[i]] && P.g[i] === 'yardC') zoneName.set(i, P.apronNames[P.apr[i]]);
    // a castle ward is closed by a curtain wall, open only where a way comes up to it (a gateway between two piers)
    const WAYK = new Set(['main', 'street', 'lane', 'alley', 'square', 'road', 'bridge', 'quay']);
    for (const b of P.gen2.buildings) { if (b.apron !== 'ward') continue;
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const i = I(x, y); if (P.apr[i] !== b.id || P.g[i] !== 'yardC') continue;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (inG(nx, ny) && (P.apr[I(nx, ny)] === b.id || P.bid[I(nx, ny)] === b.id || g2Host[P.bid[I(nx, ny)]] === b.id)) continue; const nk = at(nx, ny);
          const t = .32, [x0, z0, x1, z1] = dx > 0 ? [x + 1 - t, y, x + 1, y + 1] : dx < 0 ? [x, y, x + t, y + 1] : dy > 0 ? [x, y + 1 - t, x + 1, y + 1] : [x, y, x + 1, y + t];
          if (WAYK.has(nk)) { const pier = (px, pz) => { group(() => { cube('ashlar', px - .2, 0, pz - .2, px + .2, 1.9, pz + .2, 64, 64, 'b'); cube('stone', px - .26, 1.9, pz - .26, px + .26, 2.02, pz + .26, 32, 32, ''); }); solids.push([px - .2, pz - .2, px + .2, pz + .2]); };
            for (const [sx, sy] of dx ? [[0, 1], [0, -1]] : [[1, 0], [-1, 0]]) { const ax = x + sx, ay = y + sy; if (inG(ax, ay) && P.apr[I(ax, ay)] === b.id && !WAYK.has(at(ax + dx, ay + dy))) pier(dx ? (x0 + x1) / 2 : sx > 0 ? x + 1 : x, dy ? (z0 + z1) / 2 : sy > 0 ? y + 1 : y); }
            continue; }
          group(() => { cube('ashlar', x0, 0, z0, x1, 1.5, z1, 64, 64, 'b'); for (let a = 0; a < 1; a += .5) { if (dx) cube('ashlar', x0, 1.5, y + a, x1, 1.78, y + a + .26, 64, 64, 'b'); else cube('ashlar', x + a, 1.5, z0, x + a + .26, 1.78, z1, 64, 64, 'b'); } });
          solids.push([x0, z0, x1, z1]); } } }
    // a churchyard or a friary close: a low wall with a coping, open where a way comes up; graves in the churchyard (turf mounds, wooden
    // crosses, a few ledger slabs by the church, the churchyard cross), in the close the friars' garden beds and their preaching cross before the church
    for (const b of P.gen2.buildings) { if (b.apron !== 'burial' && b.apron !== 'close') continue; const cs = [];
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const i = I(x, y); if (P.apr[i] !== b.id || P.g[i] !== 'yardC') continue; cs.push([x, y]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inG(nx, ny) || P.apr[I(nx, ny)] === b.id || P.bid[I(nx, ny)] === b.id) continue; const nk = at(nx, ny);
          if (WAYK.has(nk) || nk === 'yardC') continue;   // open to the street (a gateway) and to another precinct
          const t = .26, [x0, z0, x1, z1] = dx > 0 ? [x + 1 - t, y, x + 1, y + 1] : dx < 0 ? [x, y, x + t, y + 1] : dy > 0 ? [x, y + 1 - t, x + 1, y + 1] : [x, y, x + 1, y + t];
          group(() => { cube(b.apron === 'burial' ? 'ashlar_dark' : 'stone', x0, 0, z0, x1, .8, z1, 64, 64, 'b'); cube('stone', x0 - .03, .8, z0 - .03, x1 + .03, .9, z1 + .03, 32, 32, ''); }); solids.push([x0, z0, x1, z1]); } }
      if (!cs.length) continue;
      const bx0 = b.x0, by0 = b.y0, bx1 = b.x0 + b.W, by1 = b.y0 + b.H, dn = (x, y) => g2Doors.some((d) => Math.max(Math.abs(d.x - x), Math.abs(d.y - y)) <= 2), rr = rngOf(seed * 31 + b.id * 7);
      const frontOf = (x, y) => b.f === 's' ? y >= by1 : b.f === 'n' ? y < by0 : b.f === 'e' ? x >= bx1 : x < bx0, ring = (x, y) => x >= bx0 - 1 && x <= bx1 && y >= by0 - 1 && y <= by1;
      const mx = Math.min(...cs.map((c) => c[0])), my = Math.min(...cs.map((c) => c[1]));
      // the cross: before the church door (a churchyard cross, the friars' preaching cross), on the front ground two cells out
      const fr = cs.filter(([x, y]) => frontOf(x, y) && !ring(x, y) && !dn(x, y));
      if (fr.length) { const [cx, cy] = fr[Math.floor(fr.length / 2)]; for (let k = 0; k < 2; k++) cube('ashlar', cx + .1 + k * .1, k * .16, cy + .1 + k * .1, cx + .9 - k * .1, (k + 1) * .16, cy + .9 - k * .1, 64, 64, 'b');
        cube('ashlar', cx + .42, .32, cy + .42, cx + .58, 2.3, cy + .58, 64, 64, 'b'); cube('ashlar', cx + .28, 1.9, cy + .44, cx + .72, 2.02, cy + .56, 64, 64, ''); solids.push([cx + .1, cy + .1, cx + .9, cy + .9]); }
      const crossAt = fr.length ? fr[Math.floor(fr.length / 2)] : null;
      // the chronicle: the war dead remembered at the churchyard cross, a wreath on its shaft and fresh flowers at its foot
      if (crossAt && CH && CH.memorial && b.apron === 'burial') { const [cx, cy] = crossAt; P.chronAt.memorial = [cx + .5, cy + .5]; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; cube(k % 2 ? 'fl_g' : 'fl_r', cx + .5 + Math.cos(a) * .16 - .04, 1.45, cy + .5 + Math.sin(a) * .16 - .04, cx + .5 + Math.cos(a) * .16 + .04, 1.55, cy + .5 + Math.sin(a) * .16 + .04, 16, 16, ''); }
        for (const [ox, oz, k] of [[.2, .95, 'fl_y'], [.55, .98, 'fl_w'], [.78, .92, 'fl_r']]) cube(k, cx + ox - .07, 0, cy + oz - .04, cx + ox + .07, .1, cy + oz + .06, 16, 16, ''); }
      for (const [x, y] of cs) { if (ring(x, y) || dn(x, y) || crossAt && Math.abs(x - crossAt[0]) <= 1 && Math.abs(y - crossAt[1]) <= 1) continue;
        if (b.apron === 'burial') { if ((x - mx) % 2 || (y - my) % 2 || rr() > .8) continue; const k = rr(), gx = x + .2 + rr() * .2, gz = y + .25;
          if (k < .3) cube('soil', gx, 0, gz, gx + .55, .14, gz + .34, 32, 32, 'b');   // a fresh mound, low enough to step over
          else if (k < .82) { cube('soil', gx, 0, gz, gx + .55, .1, gz + .34, 32, 32, 'b'); cube('wood', gx + .23, 0, gz - .07, gx + .33, .9, gz + .03, 32, 32, ''); cube('wood', gx + .08, .58, gz - .07, gx + .48, .68, gz + .03, 32, 32, ''); solids.push([gx + .2, gz - .09, gx + .36, gz + .05]); }   // a wooden cross at the head
          else { cube('ashlar_dark', gx - .05, 0, gz - .05, gx + .6, .12, gz + .4, 64, 64, 'b'); } }   // a ledger slab, flat in the turf
        else if (!frontOf(x, y)) { if ((x - mx) % 3 === 2 || (y - my) % 3 === 2) continue;   // garden beds two cells square, paths between
          cube('soil', x + .06, 0, y + .06, x + .94, .1, y + .94, 32, 32, 'b'); for (let k = 0; k < 3; k++) cube(rr() < .5 ? 'fl_g' : 'cloth_green', x + .15, .1, y + .2 + k * .28, x + .85, .2 + rr() * .1, y + .3 + k * .28, 16, 16, ''); } } }
    Bk.setLift(null); }
  if (false) { const pg = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = at(x, y); if (!['street', 'main', 'alley', 'square', 'lane'].includes(k) || r() > (k === 'square' ? .015 : .035)) continue;
      const sz = .6 + r() * .7, g = new THREE.PlaneGeometry(sz, sz * .7); g.rotateX(-Math.PI / 2); g.rotateY(r() * 3); g.translate(x + .5, .006, y + .5); pg.push(g); }
    if (pg.length) { const m = new THREE.Mesh(mergeGeometries(pg), new THREE.MeshStandardMaterial({ map: tex('m/puddle'), alphaTest: .5, roughness: .12, metalness: .15, color: day ? 0xffffff : 0x8090b0 })); m.receiveShadow = true; scene.add(m); } }
  // tufts and flowers where grass meets paving
  { const tm = new THREE.MeshStandardMaterial({ map: tex('m/tuft'), alphaTest: .5, side: THREE.DoubleSide, roughness: 1, color: snow ? 0xdde4ee : autumn ? 0xd8b060 : 0xffffff });
    const tg = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = at(x, y); if (!(k === 'yard' || k === 'yardC' || k === 'out')) continue;
      const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !['yard', 'yardC', 'out'].includes(at(x + dx, y + dy)));
      for (let n = 0; n < (edge ? 5 : 2); n++) { const px = x + r(), pz = y + r(); for (const a of [0, Math.PI / 2]) { const g = new THREE.PlaneGeometry(.32, .24); g.rotateY(a + r()); g.translate(px, .12 + hAt(px, pz), pz); tg.push(g); } } }
    if (tg.length) { const tmM = new THREE.Mesh(mergeGeometries(tg), tm); tmM.receiveShadow = true; scene.add(tmM); } }
  // crops in rows on the fields; each strip runs its own way; stubble in autumn, nothing showing under snow
  if (!snow) { const cm = new THREE.MeshStandardMaterial({ map: tex('m/tuft'), alphaTest: .5, side: THREE.DoubleSide, roughness: 1, color: autumn ? 0xc8a050 : 0xc8e078 }), cg = [], h = autumn ? .14 : .3;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (at(x, y) !== 'field') continue; const ns = ((Math.floor(x / 6) * 7 + Math.floor(y / 4) * 3) % 2) === 0;
      for (const o of [.17, .5, .83]) for (let t = .1; t < 1; t += .2) { const px = x + (ns ? o : t), pz = y + (ns ? t : o); for (const a of [0, Math.PI / 2]) { const g = new THREE.PlaneGeometry(.26, h); g.rotateY(a + .4); g.translate(px, h / 2, pz); cg.push(g); } } }
    if (cg.length) { const m = new THREE.Mesh(mergeGeometries(cg), cm); m.receiveShadow = true; scene.add(m); } }

  // the season on the trees: autumn leaves in two oranges, winter boughs laden white
  if (autumn || snow) props.forEach((t, i) => { if (t.name !== 'tree') return;
    t.traverse((o) => { if (o.isMesh && !/trunk|bark/.test(o.name + (o.material.name || ''))) { const card = o.material.alphaTest > 0; o.material = o.material.clone(); o.material.map = tex('m/' + (card ? 'leafcard' : 'leaves') + (snow ? '_snow' : '_autumn')); o.material.color.setHex(snow ? 0xffffff : i % 2 ? 0xffe0c8 : 0xffffff); } }); });
  // ---------- merge and add all the bucketed geometry ----------
  const depthSee = seeThrough(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }), true);
  const bb = new THREE.Box3(), bc = new THREE.Vector3(), bs = new THREE.Vector3();
  // everything built at ground level 0 now stands on its own ground: a house on its platform, a lamp or a group (stall, sign) where its middle stands
  { const done = new Set(); for (const geos of Object.values(Bk.B)) for (const g of geos) { const a = g.userData.anc; let dy = g.userData.dy;
      if (dy === undefined) { if (a) dy = hAt(a[0], a[2]); else { g.computeBoundingBox(); g.boundingBox.getCenter(bc); dy = hAt(bc.x, bc.z); } }
      if (dy) g.translate(0, dy, 0); if (a && !done.has(a)) { done.add(a); a[1] += dy; } } }
  for (const [k, geos] of Object.entries(Bk.B)) for (const g of geos) { const lim = g.userData.whole ? 99 : /^(cloth|iron|lamp)/.test(k) ? 1.4 : /^ashlar/.test(k) ? .45 : 0; let a = g.userData.anc; if (!a) { g.computeBoundingBox(); bb.copy(g.boundingBox); bb.getCenter(bc); bb.getSize(bs); a = [bc.x, bc.y, bc.z, bs.length() / 2]; }
    const n = g.attributes.position.count, arr = new Float32Array(n * 4), w = a[3] <= lim ? -(a[3] + .01) : 1; for (let i = 0; i < n; i++) arr.set([a[0], a[1], a[2], w], i * 4); g.setAttribute('aAnc', new THREE.BufferAttribute(arr, 4)); }
  for (const [k, geos] of Object.entries(Bk.B)) { const m = new THREE.Mesh(mergeGeometries(geos), Mt[k] || Mt.stone); m.customDepthMaterial = depthSee; m.castShadow = k !== 'glass' && k !== 'glass_lit' && k !== 'lamp' && k !== 'stained' && k !== 'floor'; m.receiveShadow = k !== 'floor'; scene.add(m); }
  // see-through for the Blender props too (trees in front of the party)
  const seen = new Map(), see = (m) => { if (!seen.has(m)) { const c = seeThrough(m.clone()); seen.set(m, c); } return seen.get(m); };
  for (const g of props) g.traverse((o) => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map(see) : see(o.material); if (!o.customDepthMaterial) o.customDepthMaterial = depthSee; } });

  // chimney smoke: soft billboards rising and fading
  const smokeTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 24; const g = c.getContext('2d');
    for (const [x, y, rr, a] of [[12, 13, 9, .35], [9, 11, 6, .5], [15, 10, 5, .5], [12, 14, 5, .7], [10, 14, 3, .8], [14, 12, 3, .8]]) { g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); for (let yy = -rr; yy <= rr; yy++) { const w = Math.round(Math.sqrt(rr * rr - yy * yy)); g.rect(x - w, y + yy, w * 2, 1); } g.fill(); }
    const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; return t; })();
  const puffs = [];
  for (const h of houseInfo) if (h.smoke && false) for (let k = 0; k < 3; k++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, color: day ? 0xdcdad6 : 0x50586a, transparent: true, opacity: .3, depthWrite: false }));
    s.userData = { base: h.smoke.clone(), ph: k / 4 + r() * .1 }; scene.add(s); puffs.push(s); }

  // ---------- light ----------
  const sun = new THREE.DirectionalLight(day ? 0xffe6c0 : 0x8aa0f0, day ? 3.4 : 1.25);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .03; scene.add(sun); scene.add(sun.target);
  scene.add(new THREE.HemisphereLight(day ? 0xcfe0f8 : 0x6c7898, day ? 0x5a4a38 : 0x1c2238, day ? 1.25 : 1.35));
  scene.add(new THREE.AmbientLight(day ? 0x8a8478 : 0x4a5068, day ? .35 : .6));
  U.inner.value = day ? .62 : .22;
  const rim = new THREE.DirectionalLight(day ? 0xa8b8e8 : 0x8090d0, day ? .45 : .2); scene.add(rim); scene.add(rim.target);
  // lantern shadows only at night (by day the sun swamps them); their maps are redrawn on demand, not every frame
  const POOL = 18, SHADOWED = 3, pool = [];
  for (let i = 0; i < POOL; i++) { const pl = new THREE.PointLight(0xffffff, 0, 1, 1.6); if (i < SHADOWED && !day) { pl.castShadow = true; pl.shadow.mapSize.set(512, 512); pl.shadow.bias = -.004; pl.shadow.autoUpdate = false; } scene.add(pl); pool.push(pl); }
  const lit = lights.filter((L) => L.power > 0);
  if (!day) { const pm = new THREE.MeshBasicMaterial({ map: blob, color: 0xffa850, transparent: true, opacity: .32, blending: THREE.AdditiveBlending, depthWrite: false }); const pg = [];
    for (const L of lit) { const rad = Math.min(2.6, L.dist * .42); const g = new THREE.PlaneGeometry(rad * 2, rad * 2); g.rotateX(-Math.PI / 2); g.translate(L.x, .02 + hAt(L.x, L.z + .2), L.z + .2); pg.push(g); }
    if (pg.length) { const pool2 = new THREE.Mesh(mergeGeometries(pg), pm); pool2.material.map = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const rg = x.createRadialGradient(32, 32, 2, 32, 32, 32); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.5, 'rgba(255,255,255,.4)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })(); scene.add(pool2); } }
  const assign = (px, pz) => {
    const near = lit.map((L) => ({ L, d: Math.hypot(L.x - px, L.z - pz) })).filter((o) => o.d < 16).sort((a, b) => a.d - b.d);
    const sh = near.filter((o) => o.L.prio >= 2 && o.d < 8).slice(0, SHADOWED), rest = near.filter((o) => !sh.includes(o)).slice(0, POOL - SHADOWED);
    pool.forEach((pl, i) => { const o = i < SHADOWED ? sh[i] : rest[i - SHADOWED]; if (!o) { pl.intensity = 0; pl.userData.base = 0; return; }
      pl.position.set(o.L.x, o.L.y, o.L.z); pl.color.setHex(o.L.color); pl.distance = o.L.dist; if (pl.castShadow) { pl.shadow.camera.far = Math.max(1.5, o.L.dist); pl.shadow.camera.updateProjectionMatrix(); pl.shadow.needsUpdate = true; } pl.userData.base = o.L.power; pl.userData.seed = (o.L.x * 13.1 + o.L.z * 7.7) % 6.28; }); };
  const partyLight = new THREE.PointLight(0xffe2c0, day ? .6 : 1.6, 4.2, 1.6); scene.add(partyLight);

  // ---------- walking ----------
  const ext = { fn: null }, canWalk = (x, y) => inG(x, y) ? (WALKK.has(at(x, y)) || openCell.has(I(x, y))) && !blockedCell.has(I(x, y)) : !!(ext.fn && ext.fn(x, y));
  const solidCell = (x, y) => !canWalk(x, y);
  const boxAt = new Map(); for (const b of solids) for (let y = Math.floor(b[1]); y <= Math.floor(b[3] - 1e-6); y++) for (let x = Math.floor(b[0]); x <= Math.floor(b[2] - 1e-6); x++) { const k = I(x, y); if (!boxAt.has(k)) boxAt.set(k, []); boxAt.get(k).push(b); }
  const circBox = (px, py, r2, x0, y0, x1, y1) => { const qx = Math.max(x0, Math.min(px, x1)), qy = Math.max(y0, Math.min(py, y1)); return (px - qx) ** 2 + (py - qy) ** 2 < r2 * r2; };
  const hits = (px, py, rr = .2) => { for (let y = Math.floor(py - rr); y <= Math.floor(py + rr); y++) for (let x = Math.floor(px - rr); x <= Math.floor(px + rr); x++) {
      if (solidCell(x, y) && circBox(px, py, rr, x, y, x + 1, y + 1)) return true; for (const b of boxAt.get(I(x, y)) || []) if (circBox(px, py, rr, b[0], b[1], b[2], b[3])) return true; } return false; };
  const cellFree = (x, y) => canWalk(x, y) && !hits(x + .5, y + .5, .18);
  const path = (sx, sy, tx, ty) => { if (!cellFree(tx, ty)) return null; const K = (x, y) => (y + 100) * 1000 + x + 100, prev = new Map([[K(sx, sy), -1]]), q = [[sx, sy]];
    for (let qi = 0; qi < q.length && qi < 9000; qi++) { const [cx, cy] = q[qi]; if (cx === tx && cy === ty) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) { const nx = cx + dx, ny = cy + dy;
        if (nx < -8 || ny < -8 || nx >= MW + 8 || ny >= MH + 8) continue;   // searches stay on this map and just over its edges
        if (prev.has(K(nx, ny)) || !cellFree(nx, ny)) continue; if (dx && dy && (!cellFree(cx + dx, cy) || !cellFree(cx, cy + dy))) continue; prev.set(K(nx, ny), [cx, cy]); q.push([nx, ny]); } }
    if (!prev.has(K(tx, ty))) return null; const out = []; let c = [tx, ty]; while (c[0] !== sx || c[1] !== sy) { out.unshift(c); c = prev.get(K(c[0], c[1])); } return out; };
  const start = arriveAt && WALKK.has(at(arriveAt[0], arriveAt[1])) && !WATERK.has(at(arriveAt[0], arriveAt[1])) ? arriveAt : P.start;
  const mkChar = (name) => mkCharT(charTex[name], start);
  const mkCharT = (t, at0, sc = 1.15) => { const w = 32 / 36 * sc, h = 48 / 36 * sc, start = at0;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, alphaTest: .5, roughness: 1, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .12 })); m.rotation.x = -.18; m.castShadow = true;
    m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: .5 }); scene.add(m);
    const sh = new THREE.Mesh(new THREE.CircleGeometry(.24, 16), new THREE.MeshBasicMaterial({ map: blob, color: 0, transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.scale.set(1.5, .9, 1); scene.add(sh);
    return { m, sh, h, cell: [...start], pos: new THREE.Vector2(start[0] + .5, start[1] + .5), queue: [] }; };
  const party = ['knight', 'mage', 'rogue', 'cleric'].map(mkChar), lead = party[0];
  const folk = [];
  // never two of the same look within 5 cells of each other
  const pickTex = (x, y) => { const o = Math.floor(r() * townTex.length); for (let k = 0; k < townTex.length; k++) { const t = townTex[(o + k) % townTex.length]; if (!folk.some((F) => F.tex === t && Math.hypot(F.pos.x - x, F.pos.y - y) < 5)) return t; } return townTex[o]; };
  { const spots = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = at(x, y); if ((k === 'square' || k === 'main' || k === 'street' || k === 'quay' || (k === 'beach' && at(x, y - 1) !== 'beach')) && cellFree(x, y)) spots.push([x, y]); }
    const used = []; for (let i = 0, tries = 0; folk.length < 0 && tries < 400; tries++) { const sp = spots[Math.floor(r() * spots.length)]; if (Math.abs(sp[0] - start[0]) + Math.abs(sp[1] - start[1]) < 4 || used.some(([a, b]) => Math.abs(a - sp[0]) + Math.abs(b - sp[1]) < 3)) continue; used.push(sp);
      const kid = i % 7 === 3, tx = pickTex(sp[0] + .5, sp[1] + .5), C = mkCharT(tx, sp, kid ? .82 : 1.15); C.tex = tx; C.home = sp; C.wait = r() * 3; C.speed = kid ? 2.2 : 1.1 + r() * .5; folk.push(C); i++; }
    // a merchant behind each stall, guards either side of the gate: they stand
    for (const [sx, sz] of stallSpots) if (at(Math.floor(sx), Math.floor(sz)) === 'square') { const tx = pickTex(sx - 1.3, sz + .5), C = mkCharT(tx, [Math.floor(sx - 1.3), Math.floor(sz + .5)]); C.tex = tx; C.pos.set(sx - 1.3, sz + .5); C.home = null; folk.push(C); }
    for (const G of P.gates) for (const u of [G.u - .35, G.u + 3.35]) { if (G.dir !== 's' && G.dir !== 'n') continue; const z = G.dir === 's' ? G.line - .7 : G.line + 1.7; const C = mkCharT(guardTex, [Math.floor(u), Math.floor(z)]); C.pos.set(u, z); C.home = null; folk.push(C); } }
  party.forEach((C, i) => { C.pos.set(start[0] + .5 + (i % 2 ? .3 : -.3) * (i ? 1 : 0), start[1] + .5 + i * .7); });
  const where = (x, y) => { const k = at(x, y); if (zoneName.get(I(x, y))) return zoneName.get(I(x, y));
    const d = P.district(x, y), SN = { poor: 'Tanner Row', craft: 'Smiths’ Street', ware: 'Warehouse Lane', cottage: P.basis === 'fishing' ? 'Shore Lane' : 'Back Lane', miner: 'Miners’ Row', rich: 'Bell Street', common: 'Bell Street' };
    return { main: 'High Street', square: P.basis === 'road' ? 'Market street' : P.basis === 'fishing' ? 'Fish market' : 'Market square', street: SN[d], alley: P.basis === 'port' && y > 30 ? 'Quay lane' : 'Alley', lane: P.walls ? 'Wall lane' : SN[d], yardC: 'Churchyard', yard: 'Back yards', road: P.walls ? 'Road out of town' : 'Road', bridge: 'Bridge', out: P.walls ? 'Outside the walls' : 'Meadow', field: 'Fields', wall: 'Town wall', quay: P.basis === 'bridge' ? 'Riverside' : 'Quay', pier: 'Pier', beach: P.basis === 'fishing' ? 'Beach' : 'Shore' }[k] || 'Town'; };
  const cellTop = new Float32Array(MW * MH); { const topOf = new Map(); for (const h of houseInfo) if (h.id !== undefined) topOf.set(h.id, Math.max(topOf.get(h.id) || 0, h.top));
    for (let i = 0; i < MW * MH; i++) { const k = P.g[i]; cellTop[i] = k === 'lot' ? (topOf.get(lotId[i]) ?? 4) : k === 'church' ? 12 : k === 'guild' ? 8 : k === 'wall' ? 3.6 : k === 'pwall' ? 2.1 : k === 'works' ? 4 : k === 'spoil' ? 1.2 : 0; } }
  const top = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? 0 : cellTop[I(x, y)];
  const cellTopW = new Float32Array(MW * MH); for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) cellTopW[I(x, y)] = cellTop[I(x, y)] ? cellTop[I(x, y)] + hAt(x + .5, y + .5) : -99;
  const topW = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? -99 : cellTopW[I(x, y)];   // roof height above sea level, -99 where nothing stands
  // ---------- the townsfolk: every resident has a home, most a workplace, and a day (the game's town schedule, W13) ----------
  // work 07-18; at dusk (18-21) a third each to the square, the tavern or home (the same third every evening); home at night.
  // The tavern's people keep it 11-24. Children, carers and the old run errands by day. Indoors = not drawn. ONE instanced draw for all.
  const crowd = (() => {
    const rc = rngOf(seed * 53 + 11), NL = townTex.length, AW = 32 * NL;
    const atlasC = document.createElement('canvas'); atlasC.width = AW; atlasC.height = 48; const ag = atlasC.getContext('2d');
    const atlas = new THREE.CanvasTexture(atlasC); atlas.magFilter = atlas.minFilter = THREE.NearestFilter; atlas.generateMipmaps = false; atlas.colorSpace = THREE.SRGBColorSpace;
    const redraw = () => { ag.clearRect(0, 0, AW, 48); townTex.forEach((t, i) => { if (t.image && t.image.width) ag.drawImage(t.image, i * 32, 0); }); atlas.needsUpdate = true; };
    redraw(); { let k = 0; const iv = setInterval(() => { redraw(); if (++k > 25) clearInterval(iv); }, 200); }
    const free = new Uint8Array(MW * MH); for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) free[I(x, y)] = cellFree(x, y) ? 1 : 0;
    const nearFree = (x, y) => { const cx = Math.floor(x), cy = Math.floor(y); for (let rr = 0; rr < 3; rr++) for (let dy = -rr; dy <= rr; dy++) for (let dx = -rr; dx <= rr; dx++) { const X = cx + dx, Y = cy + dy; if (X >= 0 && Y >= 0 && X < MW && Y < MH && free[I(X, Y)]) return I(X, Y); } return -1; };
    // places: every door (home, shop, inn), spots on the square, the gates
    const PL = []; const addP = (x, y, kind, hid) => { const c = nearFree(x, y); if (c < 0) return -1; const same = c === I(Math.floor(x), Math.floor(y)); PL.push({ x: same ? x : c % MW + .5, y: same ? y : Math.floor(c / MW) + .5, c, kind, hid }); return PL.length - 1; };
    for (const h of houseInfo) if (h.door && !h.empty) addP(h.door[0], h.door[1], h.kind || 'home', h.hid);
    // refugees (the chronicle): a household to each tent of the camp, at home in the open
    for (const t of campTents) addP(t[0], t[1] + 1.1, 'camp');
    const sqCells = []; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if ((at(x, y) === 'square' || at(x, y) === 'quay') && free[I(x, y)]) sqCells.push([x, y]);
    for (let k = 0; k < Math.min(40, sqCells.length); k++) { const [x, y] = sqCells[Math.floor(rc() * sqCells.length)]; addP(x + .2 + rc() * .6, y + .2 + rc() * .6, 'square'); }
    const idx = (kind) => PL.map((p, i) => i).filter((i) => PL[i].kind === kind);
    const homes = PL.map((p, i) => i).filter((i) => PL[i].kind === 'home' || PL[i].kind === 'shop' || PL[i].kind === 'camp'), shops = idx('shop'), inns = idx('inn'), squares = idx('square');
    const fields = new Map(), q = new Int32Array(MW * MH);
    const field = (c) => { let f = fields.get(c); if (f) return f; f = new Int16Array(MW * MH).fill(-1); let h = 0, t = 0; f[c] = 0; q[t++] = c;
      while (h < t) { const i = q[h++], x = i % MW, d = f[i] + 1; if (x > 0 && free[i - 1] && f[i - 1] < 0) { f[i - 1] = d; q[t++] = i - 1; } if (x < MW - 1 && free[i + 1] && f[i + 1] < 0) { f[i + 1] = d; q[t++] = i + 1; }
        if (i >= MW && free[i - MW] && f[i - MW] < 0) { f[i - MW] = d; q[t++] = i - MW; } if (i < MW * (MH - 1) && free[i + MW] && f[i + MW] < 0) { f[i + MW] = d; q[t++] = i + MW; } }
      fields.set(c, f); return f; };
    const reach = (a, b) => field(PL[b].c)[PL[a].c] >= 0;
    // roofs never show a head over them: baked once (the camera angle is fixed)
    const HS = 4, hid = new Uint8Array(MW * HS * MH * HS);
    for (let sy = 0; sy < MH * HS; sy++) for (let sx = 0; sx < MW * HS; sx++) { const x = (sx + .5) / HS, y = (sy + .5) / HS, g0 = hAt(x, y); let h = 0;
      for (const ox of [-.45, 0, .45]) for (let d = .15; d < 12 && !h; d += .2) if (topW(Math.floor(x + ox), Math.floor(y + d)) - g0 > d * 1.12 - .15) h = 1; hid[sy * MW * HS + sx] = h; }
    const hiddenAt = (x, y) => { const sx = Math.floor(x * HS), sy = Math.floor(y * HS); return sx < 0 || sy < 0 || sx >= MW * HS || sy >= MH * HS ? 0 : hid[sy * MW * HS + sx]; };
    // households: 2-7 people (mean ~4.75, Laslett); shopkeepers work at home; others at a shop, the inn, a market spot; children, carers and the old run errands
    const P_home = [], P_work = [], P_role = [], P_third = [], P_look = [], P_sc = [], P_spd = [], P_jit = [];
    const CAP = window.CROWD_CAP || 5000;
    const HH = []; window.__HH = HH; P.HH = HH;   // households by door, read by the interior planner
    // household size follows the house: its tier (district) and its floor area (bays x storeys), so a one-bay cottage never holds six adults
    // and a patrician house keeps its servants; a big shell let to the poor holds a second family of lodgers
    const houseAt = (x, y) => { let b = null, bd = 1.2; for (const q of HOUSES) { if (!q.door) continue; const d = Math.hypot(q.door[0] - x, q.door[1] - y); if (d < bd) { bd = d; b = q; } } return b; };
    const hhSize = (hs) => { const base = 2 + Math.floor(rc() * 3) + Math.floor(rc() * 3); if (!hs) return base;
      const bays = hs.W * hs.D * Math.max(1, hs.st), d = hs.dist, rich = d === 'rich' ? (hs.W * hs.D >= 6 && hs.st >= 2 ? 2 : 1) : d === 'ware' ? 1 : 0;
      const lo = rich === 2 ? 7 : rich === 1 ? 4 : 2, hi = Math.max(lo, Math.min(rich === 2 ? 11 : 9, 2 + bays));
      return Math.max(lo, Math.min(hi, base + (rich === 2 ? 4 : rich === 1 ? 1 : 0) + (d === 'poor' && bays >= 8 ? 2 + Math.floor(rc() * 2) : 0))); };
    for (const hm of homes) { const hs = HOUSES.find((q) => q.id === PL[hm].hid) || houseAt(PL[hm].x, PL[hm].y), size = hhSize(hs); const isShop = PL[hm].kind === 'shop'; const hh = { x: PL[hm].x, y: PL[hm].y, size, kids: 0, house: hs ? hs.id : null }; HH.push(hh);
      for (let k = 0; k < size && P_home.length < CAP; k++) { let role = 1, work = -1; const kid = k >= 2 && hh.kids < 5 && rc() < (size >= 7 || hs && (hs.dist === 'rich' || hs.dist === 'ware') ? .3 : .6);   // merchants keep servants   // big households are mostly servants, apprentices or lodgers
        if (!kid && k < 2 && (k === 0 || rc() < .45)) { role = 0; const u = rc(); const pool = isShop && k === 0 ? [hm] : inns.length && u < .06 ? inns : shops.length && u < .62 ? shops : squares.length && u < .70 ? squares : homes; work = pool[0]; let bd = 1e9;   // work near home, mostly
          for (let t = 0; t < 3; t++) { const j = pool[Math.floor(rc() * pool.length)], d = Math.hypot(PL[j].x - PL[hm].x, PL[j].y - PL[hm].y); if (d < bd) { bd = d; work = j; } }
          if (inns.includes(work)) role = 3; if (!reach(hm, work)) { work = -1; role = 1; } }
        if (kid) hh.kids++; P_home.push(hm); P_work.push(work); P_role.push(kid ? 2 : role); P_third.push(Math.floor(rc() * 3)); P_look.push(Math.floor(rc() * NL)); P_sc.push(kid ? .82 / 1.15 : 1); P_spd.push(kid ? 1.9 : 1.0 + rc() * .45); P_jit.push(rc() * .75); } }
    const n = window.CROWD_N ? Math.min(window.CROWD_N, P_home.length) : P_home.length, residents = n;
    // where someone wants to be at hour h: a place index, or -2 = free (errands)
    const want = (i, h) => { h = ((h - P_jit[i]) % 24 + 24) % 24; const role = P_role[i], home = P_home[i];
      if (WX.indoors && ((Math.imul(i + 1, 2654435761) >>> 0) / 4294967296) < WX.indoors) return home;   // the weather keeps them in
      if (role === 3) return h >= 11 ? P_work[i] : home;
      if (h >= 7 && h < 18) return role === 0 ? (P_work[i] >= 0 ? P_work[i] : -2) : -2;
      if (h >= 18 && h < 21) { const t = P_third[i]; if (t === 1 && inns.length) return inns[i % inns.length]; if (t === 2) return home; return squares.length ? squares[i % squares.length] : home; }
      return home; };
    const ST_IN = 0, ST_WALK = 1, ST_STAND = 2;
    const st = new Uint8Array(n), at0 = new Int32Array(n), dest = new Int32Array(n), until = new Float32Array(n), errand = new Uint8Array(n);
    const ax = new Float32Array(n), ay = new Float32Array(n), ox = new Float32Array(n), oy = new Float32Array(n), face = new Float32Array(n), ph = new Float32Array(n);
    const look = new Float32Array(n), flip = new Float32Array(n);
    const outdoor = (p) => p >= 0 && (PL[p].kind === 'square' || PL[p].kind === 'camp');
    const goTo = (i, p) => { if (p === at0[i] && st[i] !== ST_WALK) return; if (st[i] === ST_IN) { const D0 = PL[at0[i]]; ax[i] = D0.x; ay[i] = D0.y; } if (field(PL[p].c)[Math.min(MW * MH - 1, Math.max(0, I(Math.floor(ax[i]), Math.floor(ay[i]))))] < 0) return; st[i] = ST_WALK; dest[i] = p; };
    const arrive = (i, p, clock) => { at0[i] = p; if (outdoor(p)) { st[i] = ST_STAND; until[i] = clock + (5 + rc() * 25) / 60; } else st[i] = ST_IN; if (errand[i] && p !== P_home[i]) until[i] = clock + (outdoor(p) ? (P_role[i] === 2 ? 30 + rc() * 60 : 15 + rc() * 35) : 10 + rc() * 25) / 60; else if (errand[i]) { errand[i] = 0; until[i] = clock + (90 + rc() * 120) / 60; } };   // an errand or two a day: walking takes real seconds, so time at home is long
    const errandPick = (i) => { const u = rc(), pool = u < (P_role[i] === 2 ? .8 : .45) && squares.length ? squares : shops.length && u < .85 ? shops : homes, H = PL[P_home[i]]; let best = pool[0], bd = 1e9;   // the nearest of a few: people shop close to home
      for (let k = 0; k < 4; k++) { const j = pool[Math.floor(rc() * pool.length)], d = Math.hypot(PL[j].x - H.x, PL[j].y - H.y); if (d < bd) { bd = d; best = j; } } return best; };
    const h0 = S.hour;
    for (let i = 0; i < n; i++) { ox[i] = (rc() - .5) * .9; oy[i] = (rc() - .5) * .9; ph[i] = rc() * 6.28; face[i] = rc() < .5 ? 1 : -1; look[i] = P_look[i];
      const w = want(i, h0); let p = w === -2 ? (rc() < .3 ? errandPick(i) : P_home[i]) : w; if (w === -2 && p !== P_home[i]) errand[i] = 1;
      at0[i] = p; const P0 = PL[p]; ax[i] = P0.x + (outdoor(p) ? ox[i] : 0); ay[i] = P0.y + (outdoor(p) ? oy[i] : 0); st[i] = outdoor(p) ? ST_STAND : ST_IN; until[i] = h0 + (p === P_home[i] && w === -2 ? rc() * 6 : rc() * .5); }
    const w = 32 / 36 * 1.15, hgt = 48 / 36 * 1.15;
    const geo = new THREE.PlaneGeometry(w, hgt); geo.setAttribute('aLook', new THREE.InstancedBufferAttribute(look, 1)); const flipA = new THREE.InstancedBufferAttribute(flip, 1); flipA.setUsage(THREE.DynamicDrawUsage); geo.setAttribute('aFlip', flipA);
    const patch = (m) => { m.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace('void main() {', 'attribute float aLook; attribute float aFlip;\nvoid main() {').replace('#include <uv_vertex>', `#include <uv_vertex>
#ifdef USE_MAP
vMapUv.x = (mix(vMapUv.x, 1. - vMapUv.x, aFlip) + aLook) / ${NL}.;
#endif
#ifdef USE_EMISSIVEMAP
vEmissiveMapUv.x = (mix(vEmissiveMapUv.x, 1. - vEmissiveMapUv.x, aFlip) + aLook) / ${NL}.;
#endif`); }; m.customProgramCacheKey = () => 'crowd' + NL; return m; };
    const mesh = new THREE.InstancedMesh(geo, patch(new THREE.MeshStandardMaterial({ map: atlas, alphaTest: .5, roughness: 1, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: atlas, emissiveIntensity: .12 })), Math.max(1, n));
    mesh.customDepthMaterial = patch(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: atlas, alphaTest: .5 })); mesh.castShadow = true; mesh.frustumCulled = false; mesh.count = n; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(mesh);
    const bg = new THREE.CircleGeometry(.24, 16); bg.rotateX(-Math.PI / 2);
    const blobs = new THREE.InstancedMesh(bg, new THREE.MeshBasicMaterial({ map: blob, color: 0, transparent: true, depthWrite: false }), Math.max(1, n)); blobs.frustumCulled = false; blobs.count = n; blobs.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(blobs);
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-.18, 0, 0)), Q0 = new THREE.Quaternion(), Pv = new THREE.Vector3(), Sv = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 0);
    const HB = new Int32Array(MW * MH), NX = new Int32Array(Math.max(1, n)); let clockC = 0, outside = 0;
    const cellOf = (x, y) => I(Math.min(MW - 1, Math.max(0, Math.floor(x))), Math.min(MH - 1, Math.max(0, Math.floor(y))));
    const update = (dt, partyPos, hour) => { clockC += dt; HB.fill(-1); for (let i = 0; i < n; i++) if (st[i] !== ST_IN) { const c = cellOf(ax[i], ay[i]); NX[i] = HB[c]; HB[c] = i; }
      outside = 0;
      for (let i = 0; i < n; i++) { let moving = false;
        // the schedule: a few people a frame look at the clock (cheap), everyone within about a second
        if (((i + Math.floor(clockC * 60)) & 63) === 0 || st[i] === ST_STAND) {
          const w = want(i, hour);
          if (w === -2) { if (st[i] !== ST_WALK && hour >= until[i]) { if (at0[i] !== P_home[i]) { errand[i] = 1; goTo(i, P_home[i]); } else { errand[i] = 1; goTo(i, errandPick(i)); } } }
          else if (st[i] !== ST_WALK && at0[i] !== w) { errand[i] = 0; goTo(i, w); }
          else if (st[i] === ST_STAND && hour >= until[i] && squares.length) { const near = squares[Math.floor(rc() * squares.length)]; if (Math.hypot(PL[near].x - ax[i], PL[near].y - ay[i]) < 7) goTo(i, near); else until[i] = hour + .1; } }
        if (st[i] === ST_IN) { M.compose(Z, Q0, Z); mesh.setMatrixAt(i, M); blobs.setMatrixAt(i, M); continue; }
        if (st[i] === ST_WALK) { const T = PL[dest[i]], f = field(T.c), c = cellOf(ax[i], ay[i]); let tx, ty;
          if (f[c] < 0) { st[i] = ST_IN; at0[i] = P_home[i]; }
          else if (f[c] === 0) { tx = T.x + (outdoor(dest[i]) ? ox[i] : 0); ty = T.y + (outdoor(dest[i]) ? oy[i] : 0); if (Math.hypot(tx - ax[i], ty - ay[i]) < .2) { arrive(i, dest[i], hour); tx = undefined; } }
          else { let best = c, bv = f[c]; const x0 = c % MW, y0 = (c / MW) | 0;
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const X = x0 + dx, Y = y0 + dy; if (X < 0 || Y < 0 || X >= MW || Y >= MH) continue; const k = I(X, Y);
              if (!free[k] || f[k] < 0) continue; if (dx && dy && (!free[I(x0 + dx, y0)] || !free[I(x0, y0 + dy)])) continue; const v = f[k] + (dx && dy ? .4 : 0); if (v < bv) { bv = v; best = k; } }
            tx = best % MW + .5 + ox[i]; ty = ((best / MW) | 0) + .5 + oy[i]; if (f[best] === 0) { tx = T.x; ty = T.y; } }
          if (tx !== undefined) { let vx = tx - ax[i], vy = ty - ay[i]; const d = Math.hypot(vx, vy) || 1; vx /= d; vy /= d; const cx = Math.floor(ax[i]), cy = Math.floor(ay[i]);
            for (const p of partyPos) { const qx = ax[i] - p.x, qy = ay[i] - p.y, dd = Math.hypot(qx, qy); if (dd < .75 && dd > 1e-3) { vx += qx / dd * (.75 - dd) * 2.2 - vy * .6; vy += qy / dd * (.75 - dd) * 2.2 + vx * .6; } }
            for (let yy = cy - 1; yy <= cy + 1; yy++) for (let xx = cx - 1; xx <= cx + 1; xx++) { if (xx < 0 || yy < 0 || xx >= MW || yy >= MH) continue; for (let j = HB[I(xx, yy)]; j >= 0; j = NX[j]) { if (j === i) continue; const qx = ax[i] - ax[j], qy = ay[i] - ay[j], dd = Math.hypot(qx, qy); if (dd < .42 && dd > 1e-3) { vx += qx / dd * (.42 - dd) * 2; vy += qy / dd * (.42 - dd) * 2; } } }
            const sp = P_spd[i] * dt, nx = ax[i] + vx * sp, ny = ay[i] + vy * sp; let pb = false;
            for (const p of partyPos) if (Math.hypot(nx - p.x, ny - p.y) < .42 && Math.hypot(nx - p.x, ny - p.y) < Math.hypot(ax[i] - p.x, ay[i] - p.y)) pb = true;   // never walk through the party: wait instead
            if (!pb) { if (free[cellOf(nx, ny)] && !hits(nx, ny, .14)) { ax[i] = nx; ay[i] = ny; } else if (!hits(ax[i] + (tx - ax[i]) / d * sp, ay[i] + (ty - ay[i]) / d * sp, .14)) { ax[i] += (tx - ax[i]) / d * sp; ay[i] += (ty - ay[i]) / d * sp; }
              else { ox[i] *= .5; oy[i] *= .5; const bx = Math.floor(tx - ox[i]) + .5, by = Math.floor(ty - oy[i]) + .5, bd = Math.hypot(bx - ax[i], by - ay[i]) || 1; ax[i] += (bx - ax[i]) / bd * Math.min(sp, bd); ay[i] += (by - ay[i]) / bd * Math.min(sp, bd); } }   // wedged on a prop corner: walk the cell centres, which are always clear
            if (!pb && f[c] <= 1 && Math.abs(ax[i] - (nx - vx * sp)) + Math.abs(ay[i] - (ny - vy * sp)) < 1e-4 && Math.hypot(T.x - ax[i], T.y - ay[i]) < 1.2) { arrive(i, dest[i], hour); continue; }   // a door step a prop half-covers: close enough, go in
            moving = !pb; if (vx < -.05) face[i] = -1; else if (vx > .05) face[i] = 1; } }
        if (st[i] === ST_STAND) { let vx = 0, vy = 0; const cx = Math.floor(ax[i]), cy = Math.floor(ay[i]);
          for (let yy = cy - 1; yy <= cy + 1; yy++) for (let xx = cx - 1; xx <= cx + 1; xx++) { if (xx < 0 || yy < 0 || xx >= MW || yy >= MH) continue; for (let j = HB[I(xx, yy)]; j >= 0; j = NX[j]) { if (j === i) continue; const qx = ax[i] - ax[j], qy = ay[i] - ay[j], dd = Math.hypot(qx, qy); if (dd < .55) { if (dd < 1e-3) { vx += Math.cos(ph[i]); vy += Math.sin(ph[i]); } else { vx += qx / dd * (.55 - dd); vy += qy / dd * (.55 - dd); } } } }
          if (vx || vy) { const d = Math.hypot(vx, vy), sp = Math.min(d, .6 * dt) / d, nx = ax[i] + vx * sp, ny = ay[i] + vy * sp; if (free[cellOf(nx, ny)] && !hits(nx, ny, .14)) { ax[i] = nx; ay[i] = ny; } } }   // a group on a spot spreads into a loose ring instead of stacking
        if (st[i] === ST_IN) { M.compose(Z, Q0, Z); mesh.setMatrixAt(i, M); blobs.setMatrixAt(i, M); continue; }
        outside++; flip[i] = face[i] < 0 ? 1 : 0;
        if (hiddenAt(ax[i], ay[i])) { M.compose(Z, Q0, Z); mesh.setMatrixAt(i, M); blobs.setMatrixAt(i, M); continue; }
        const s = P_sc[i], bob = moving ? Math.abs(Math.sin(clockC * 10 + ph[i])) * .035 : 0;
        const gy = hAt(ax[i], ay[i]); Pv.set(ax[i], hgt * s / 2 - 1 / 32 + bob + gy, ay[i] + .05); Sv.set(s, s, s); M.compose(Pv, Q, Sv); mesh.setMatrixAt(i, M);
        Pv.set(ax[i], .012 + gy, ay[i] + .07); Sv.set(1.5 * s, 1, .9 * s); M.compose(Pv, Q0, Sv); blobs.setMatrixAt(i, M); }
      mesh.instanceMatrix.needsUpdate = true; blobs.instanceMatrix.needsUpdate = true; flipA.needsUpdate = true; };
    update(0, [], S.hour);
    return { get n() { return n; }, residents, update, mesh, ax, ay, get outside() { return outside; }, st, dest, at0, PL, want, field, cellOf };
  })();
  const walkF = new Float32Array(MW * MH * 2); for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const k = at(x, y), w = WALKK.has(k) ? (!P.walls || P.walls.ins[y * MW + x] ? 1 : .5) : 0; walkF[(y * MW + x) * 2] = w; walkF[(y * MW + x) * 2 + 1] = hAt(x + .5, y + .5); }
  const lo = P.brief && HA ? Math.min(...P.brief.corners) : 0;
  return { ext, walkF, lo, solids, blockedCell, top, topW, hAt, scene, hits, path, canWalk, cellFree, lead, party, folk, crowd, sun, rim, pool, assign, partyLight, puffs, where, day, I, P };
}

// ---------- camera and post (as the dungeon walk) ----------
const cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
let composer, gtao, tilts = [];
const vs = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }';
function makeComposer(scene) {
  const w = hostW(), h = hostH();
  composer?.dispose?.();
  composer = new EffectComposer(renderer); composer.setPixelRatio(1); composer.setSize(w, h);
  composer.addPass(new RenderPass(scene, cam));
  gtao = new GTAOPass(scene, cam, w, h); gtao.updateGtaoMaterial({ radius: .35, distanceExponent: 1, thickness: .25, scale: 1.1 }); seeThrough(gtao.normalMaterial); gtao.normalMaterial.side = THREE.DoubleSide; gtao.blendIntensity = .8; gtao.enabled = S.hq; composer.addPass(gtao);
  { const orig = gtao.render.bind(gtao); gtao.render = (...a) => { const fx = world ? world.puffs : []; fx.forEach((s) => (s.visible = false)); orig(...a); fx.forEach((s) => (s.visible = true)); }; }
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), S.day ? .18 : .4, .4, S.day ? .97 : .85));
  const tilt = (dir) => new ShaderPass({ uniforms: { tDiffuse: { value: null }, res: { value: new THREE.Vector2(w, h) }, dir: { value: dir }, focus: { value: .55 }, band: { value: .36 }, amount: { value: 2.6 * Math.min(1, w / 1600) + .8 } }, vertexShader: vs,
    fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; uniform vec2 dir; uniform float focus, band, amount; varying vec2 vUv;
    void main(){ float dy = vUv.y - focus; float b = dy < 0. ? band * 1.55 : band; float d = max(0., abs(dy) - b) / (0.5 - b); float r = amount * d * d;
      vec4 c = vec4(0.); float tw = 0.; for (int i=-6;i<=6;i++){ float w = exp(-float(i*i)/18.); c += texture2D(tDiffuse, vUv + dir * float(i) * r / res) * w; tw += w; } gl_FragColor = c / tw; }` });
  tilts = [tilt(new THREE.Vector2(1, 0)), tilt(new THREE.Vector2(0, 1))]; tilts.forEach((p) => { p.enabled = S.hq; composer.addPass(p); });
  composer.addPass(new ShaderPass({ uniforms: { tDiffuse: { value: null } }, vertexShader: vs,
    fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 p = vUv - .5; float v = smoothstep(.9, .3, length(p * vec2(1.05, 1.25))); gl_FragColor = vec4(c.rgb * mix(.72, 1., v), 1.); }` }));
  composer.addPass(new OutputPass());
  composer.addPass(new ShaderPass({ uniforms: { tDiffuse: { value: null } }, vertexShader: vs,
    fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb; float l = dot(c, vec3(.299,.587,.114));
      c = mix(c, c * vec3(.88,.92,1.1) + vec3(.01,.01,.025), 1. - smoothstep(.0, .45, l)); c = mix(c, c * vec3(1.05,1.0,.93), smoothstep(.5, 1., l)); c = (c - .5) * 1.08 + .5; gl_FragColor = vec4(clamp(c, 0., 1.), 1.); }` }));
}
function resize() { renderer.setSize(hostW(), hostH()); cam.aspect = hostW() / hostH(); cam.fov = hostW() < hostH() ? 44 : 30; cam.updateProjectionMatrix(); if (world) makeComposer(IN ? IN.I.scene : MS); }
const ro = new ResizeObserver(() => { if (world) resize(); }); ro.observe(host);

function dispose(W) { W.root.traverse((o) => { o.geometry?.dispose?.(); }); MS.remove(W.root); }
// ---------- one scene for every map that is loaded; each map hangs under its own root, the active map at the origin ----------
const MS = new THREE.Scene();
const worlds = new Map(); let AC = { x: 0, y: 0 }, ringGen = 0;
const wkey = (x, y) => x + ',' + y;
function adopt(W, gx, gy) { W.gx = gx; W.gy = gy; W.root = new THREE.Group(); while (W.scene.children.length) W.root.add(W.scene.children[0]); MS.add(W.root); return W; }
function activeVisual(W, on) { W.root.traverse((o) => { if (o.isLight) o.visible = on; }); for (const C of W.party) { C.m.visible = C.sh.visible = on; } }
function placeRoots() { for (const W of worlds.values()) W.root.position.set((W.gx - AC.x) * MW, (W.lo - world.lo) * HK, (W.gy - AC.y) * MH); }
function rebuildWalk() {
  const TW = 3 * MW, TH = 3 * MH, d = new Float32Array(TW * TH * 4); for (let i = 0; i < TW * TH; i++) { d[i * 4] = d[i * 4 + 2] = .5; d[i * 4 + 3] = 1; }
  const list = MULTI() ? [...worlds.values()] : [world];
  for (const W of list) { const dx = MULTI() ? W.gx - AC.x : 0, dz = MULTI() ? W.gy - AC.y : 0; if (Math.abs(dx) > 1 || Math.abs(dz) > 1) continue; const yo = (W.lo - world.lo) * HK;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const s = (y * MW + x) * 2, t = ((y + (dz + 1) * MH) * TW + x + (dx + 1) * MW) * 4; d[t] = d[t + 2] = W.walkF[s]; d[t + 1] = W.walkF[s + 1] + yo; } }
  const t = new THREE.DataTexture(d, TW, TH, THREE.RGBAFormat, THREE.FloatType); t.magFilter = t.minFilter = THREE.NearestFilter; t.needsUpdate = true; if (U.walk.value) U.walk.value.dispose(); U.walk.value = t; }
// a gen2 town over several maps plays the part of a city plan: its maps are the plan's cells
const G2 = () => true, MULTI = () => townNow().W * townNow().H > 1;
const g2spec = () => ({ chron: S.chron || null, seed: +S.seed, basis: S.basis, rank: Math.min(2, +S.rank), planted: !!S.planted, ground: S.ground || 'hill', gen: 2, multi: true, region: S.region || 'en', specs: S.trade ? [S.trade] : [], cpop: S.cpop || 0, csite: S.csite || 'river', cyear: S.cyear || 1500, cflags: S.cflags || '' });
function townNow() { const T = townOf(g2spec()), [w, h] = T.maps, mk = T.Q.market; const core = mk ? Math.min(h - 1, Math.floor(mk.cy / MH)) * w + Math.min(w - 1, Math.floor(mk.cx / MW)) : 0; return { W: w, H: h, built: new Int8Array(w * h), core }; }
const curCell = () => S.tcell >= 0 && S.tcell < townNow().W * townNow().H ? S.tcell : (S.tcell = townNow().core);
function cellAtG(x, y) { const P = townNow(); return x < 0 || y < 0 || x >= P.W || y >= P.H ? -1 : y * P.W + x; }
function specFor(cell) { const T = townNow(); return { ...g2spec(), win: [cell % T.W, (cell / T.W) | 0] }; }
function linkWalk(W) { W.ext.fn = !MULTI() ? null : (x, y) => { const dx = x < 0 ? -1 : x >= MW ? 1 : 0, dz = y < 0 ? -1 : y >= MH ? 1 : 0; const N = worlds.get(wkey(W.gx + dx, W.gy + dz)); return !!N && N !== W && N.canWalk(x - dx * MW, y - dz * MH); }; }
// the maps around the party: build the missing ones one at a time (nearest first), drop the far ones
function scheduleRing() {
  if (!MULTI()) return; const gen = ++ringGen;
  for (const [k, W] of worlds) if (Math.max(Math.abs(W.gx - AC.x), Math.abs(W.gy - AC.y)) > 2) { dispose(W); worlds.delete(k); }
  const step = () => { if (gen !== ringGen || !world) return; const L = world.lead; let best = null;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const gx = AC.x + dx, gy = AC.y + dz; if (worlds.has(wkey(gx, gy)) || cellAtG(gx, gy) < 0) continue;
      const rx = Math.max(dx * MW - L.pos.x, 0, L.pos.x - (dx * MW + MW)), rz = Math.max(dz * MH - L.pos.y, 0, L.pos.y - (dz * MH + MH)), d = Math.hypot(rx, rz); if (!best || d < best[2]) best = [gx, gy, d]; }
    if (!best) return;
    const W = adopt(buildWorld(specFor(cellAtG(best[0], best[1])), S.day, S.season, null), best[0], best[1]); W.camY = 0; activeVisual(W, false); worlds.set(wkey(W.gx, W.gy), W);
    placeRoots(); rebuildWalk(); setTimeout(step, 60); };
  setTimeout(step, 120); }
// walking over an edge: the map ahead becomes the active one; everything shifts so it sits at the origin
function shiftTo(dx, dz) {
  const N = worlds.get(wkey(AC.x + dx, AC.y + dz)), O = world; if (!N) return false;
  const ox = dx * MW, oz = dz * MH, yo = (N.lo - O.lo) * HK;
  N.party.forEach((C, i) => { const Q = O.party[i]; C.pos.set(Q.pos.x - ox, Q.pos.y - oz); C.cell = [Math.floor(C.pos.x), Math.floor(C.pos.y)]; C.moving = Q.moving; C.m.scale.x = Q.m.scale.x; });
  N.lead.queue = O.lead.queue.map(([x, y]) => [x - ox, y - oz]); N.trail = (O.trail || []).map((p) => [p[0] - ox, p[1] - oz]); N.camY = (O.camY ?? 0) - yo; N.lastMin = -1;
  cam.position.x -= ox; cam.position.z -= oz; cam.position.y -= yo;
  activeVisual(O, false); activeVisual(N, true); world = N; AC = { x: N.gx, y: N.gy }; S.tcell = cellAtG(AC.x, AC.y);
  MS.fog = N.scene.fog; MS.background = N.scene.background; linkWalk(N); placeRoots(); rebuildWalk(); lastCell = -1; save(); fill(); scheduleRing(); return true; }

function load(arriveAt) {
  $('busy').classList.remove('off');
  setTimeout(async () => {
    if (G2() && S.cpop) { const t0 = performance.now(); const E = await prepareCity(g2spec()); window.__cityPrep = { ms: performance.now() - t0, from: E.from }; }   // a city: its skeleton made in a worker (or from the saved cities) first
    ringGen++; for (const W of worlds.values()) dispose(W); worlds.clear(); if (world && world.root && world.root.parent) dispose(world);
    const spec = G2() ? specFor(curCell()) : { seed: +S.seed, basis: S.basis, rank: S.gen === 2 ? Math.min(2, +S.rank) : +S.rank, planted: !!S.planted, ground: S.ground || 'hill', gen: S.gen === 2 ? 2 : 1 };
    { const t0 = performance.now(); const P0 = townNow(), c0 = curCell(); AC = P0 ? { x: c0 % P0.W, y: (c0 / P0.W) | 0 } : { x: 0, y: 0 };
      world = adopt(buildWorld(spec, S.day, S.season, arriveAt), AC.x, AC.y); window.__bt = performance.now() - t0; }
    if (MULTI()) worlds.set(wkey(AC.x, AC.y), world);
    activeVisual(world, true); MS.fog = world.scene.fog; MS.background = world.scene.background; linkWalk(world); placeRoots(); world.root.position.set(0, 0, 0); rebuildWalk();
    resize(); tick(0, true); cam.position.copy(camGoal());
    // compile every shader now (main, shadow-depth, AO normals), not the first time a house scrolls into view: that compile was the walking hitch
    { const off = []; const hid = []; MS.traverse((o) => { if (o.frustumCulled) { o.frustumCulled = false; off.push(o); } if (!o.visible && (o.isMesh || o.isSprite)) { o.visible = true; hid.push(o); } }); const sh = world.pool.filter((pl) => pl.castShadow); sh.forEach((pl) => (pl.shadow.needsUpdate = true)); composer.render(); off.forEach((o) => (o.frustumCulled = true)); hid.forEach((o) => (o.visible = false)); sh.forEach((pl) => (pl.shadow.needsUpdate = true)); }
    const ready = () => { $('busy').classList.add('off'); if (!readyOnce) { readyOnce = true; opts.onReady?.(); } };
    THREE.DefaultLoadingManager.onLoad = ready; setTimeout(ready, 1500);
    fill(); save(); scheduleRing();
  }, 30);
}
function fill() { opts.onLabel?.(world ? world.P.label : ''); }
// swallow every stage of a held movement key so the browser never treats it as typing

const keys = new Set();
const DIRS = { KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1], KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0] };
on(window, 'keydown', (e) => { if (!owns()) return; if (IN && !e.repeat && IN.W.press(e.code)) { e.preventDefault(); return; } if (e.code === 'KeyE' && !e.repeat && !IN && world) { const c = flapNear(.55); if (c) { enterHouse(c, { cellar: true }); e.preventDefault(); return; } const h = doorNear(1.0); if (h) { enterHouse(h); e.preventDefault(); return; } }
  // wherever focus drifted (the city map, the seed box, the page itself), a movement key hands it back to the game view so held letters never open the accent picker
  if (DIRS[e.code] && !(document.activeElement instanceof HTMLSelectElement)) { keys.add(e.code); world && (world.lead.queue = []); e.preventDefault(); e.stopPropagation(); } }, { capture: true });
on(window, 'keyup', (e) => keys.delete(e.code));
on(window, 'blur', () => { keys.clear(); });


renderer.domElement.addEventListener('pointerdown', () => { renderer.domElement.focus({ preventScroll: true }); $('tap').classList.add('off'); });
renderer.domElement.addEventListener('wheel', (e) => { S.zoom = Math.min(2.4, Math.max(.7, S.zoom * (e.deltaY > 0 ? 1.08 : 1 / 1.08))); e.preventDefault(); }, { passive: false });
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (!world || IN) return; const rc = renderer.domElement.getBoundingClientRect();
  const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((e.clientX - rc.left) / rc.width * 2 - 1, -(e.clientY - rc.top) / rc.height * 2 + 1), cam);
  const hit = new THREE.Vector3(); if (!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit)) return;
  const L = world.lead, p = world.path(L.cell[0], L.cell[1], Math.floor(hit.x), Math.floor(hit.z)); if (p) L.queue = p; });
const SPEED = 4.2;
let zEff = 1.35; const camGoal = () => { const L = world.lead; const z = zEff; return new THREE.Vector3(L.pos.x, (window.CAMH || 9.4) * z + (world.camY || 0), L.pos.y + (window.CAMD || 8.4) * z); };
let clock = 0, lastCell = -1, shadowTick = 0, walkedAcc = 0, readyOnce = false;
// what the Engine is told of a door the party walks through: the building's town-wide key and its words
const doorInfo = (h) => ({ key: h.gen2 ? 'b' + h.bid : h.plot != null ? 'p' + h.plot : h.gate ? 'gate' : 'other', label: h.label || (h.empty ? 'Empty house' : h.inn ? 'Inn' : h.shop ? 'Shop' : h.gate ? 'Gatehouse' : 'House'), inn: !!h.inn, shop: !!h.shop, empty: !!h.empty, ward: h.ward ?? -1, street: world && h.door ? world.where(Math.floor(h.door[0]), Math.floor(h.door[1])) : '', tcell: S.tcell });
// ---------- the weather (fork): the world's weather where the party stands, drawn over the town: the sky, light and fog it
// brings, rain, snow, hail or dust falling round the party, lightning in a storm, and fewer people out in it ----------
// dim: light (tone exposure); sun: how much of the sun (and its shadows) gets through; fogN/fogF: how near the fog closes in; tint/tm: the sky and fog colour it turns to, and how far;
// p/n: what falls and how much of it; fall: its speed; wind: how hard it drives across; indoors: the share of people who stay in
const WXT = {
  clear: { dim: 1, sun: 1, fogN: 1, fogF: 1, indoors: 0 },
  cloudy: { dim: .94, sun: .55, fogN: .92, fogF: .92, tint: 0xb4bcc6, tm: .3, indoors: 0 },
  overcast: { dim: .86, sun: .25, fogN: .82, fogF: .82, tint: 0x99a1ab, tm: .55, indoors: .1 },
  rain: { dim: .8, sun: .18, fogN: .7, fogF: .72, tint: 0x8a929c, tm: .6, p: 'rain', n: 2200, fall: 13, wind: .6, indoors: .55 },
  heavy_rain: { dim: .72, sun: .12, fogN: .5, fogF: .58, tint: 0x78808a, tm: .7, p: 'rain', n: 3800, fall: 15, wind: 1.2, indoors: .8 },
  storm: { dim: .62, sun: .08, fogN: .45, fogF: .52, tint: 0x5c6472, tm: .75, p: 'rain', n: 4200, fall: 16, wind: 3, flash: true, indoors: .9 },
  snow: { dim: .95, sun: .35, fogN: .7, fogF: .72, tint: 0xd6dbe2, tm: .55, p: 'snow', n: 2400, fall: 1.1, wind: .4, indoors: .4 },
  blizzard: { dim: .88, sun: .15, fogN: .25, fogF: .36, tint: 0xe2e6ec, tm: .85, p: 'snow', n: 5000, fall: 2.4, wind: 5, indoors: .85 },
  fog: { dim: .9, sun: .3, fogN: .02, fogF: .17, tint: 0xc6cace, tm: .8, indoors: .2 },
  wind: { dim: 1, sun: 1, fogN: 1, fogF: 1, p: 'leaf', n: 140, fall: .7, wind: 3.5, indoors: .15 },
  hail: { dim: .75, sun: .15, fogN: .62, fogF: .66, tint: 0x8a929c, tm: .6, p: 'hail', n: 2200, fall: 11, wind: .8, indoors: .85 },
  sandstorm: { dim: .8, sun: .3, fogN: .22, fogF: .38, tint: 0xc4a274, tm: .85, p: 'dust', n: 3400, fall: .4, wind: 7, indoors: .85 },
  heat_wave: { dim: 1.06, sun: 1.1, fogN: .9, fogF: 1, tint: 0xf2e2c2, tm: .25, indoors: .35 },
};
let WX = WXT.clear, wxKind = '', wxP = null, wxFlash = 0, wxNext = 3;
const wxSky = new THREE.Color(), wxTint = new THREE.Color();
function setWeather(kind) { const k = WXT[kind] ? kind : 'clear'; if (k === wxKind) return; wxKind = k; WX = WXT[k]; S.weather = k;
  if (wxP) { MS.remove(wxP.obj); wxP.obj.geometry.dispose(); wxP.obj.material.dispose(); wxP = null; } if (WX.p) wxP = wxMake(WX.p, WX.n); }
function wxMake(kind, n) { const box = [28, 12, 24], line = kind === 'rain', base = new Float32Array(n * 3), pos = new Float32Array(n * (line ? 6 : 3));
  for (let i = 0; i < n * 3; i += 3) { base[i] = Math.random() * box[0]; base[i + 1] = Math.random() * box[1]; base[i + 2] = Math.random() * box[2]; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const obj = line ? new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xd4dcea, transparent: true, opacity: .62, depthWrite: false }))
    : new THREE.Points(g, new THREE.PointsMaterial({ color: { snow: 0xffffff, hail: 0xe6edf4, dust: 0xbf9a68, leaf: 0x7a8a3a }[kind], size: { snow: .15, hail: .07, dust: .07, leaf: .14 }[kind], transparent: true, opacity: kind === 'dust' ? .45 : .92, depthWrite: false }));
  obj.frustumCulled = false; obj.renderOrder = 5; MS.add(obj); return { kind, n, obj, base, box, line }; }
// each frame: what falls round the party, the light, the sky and fog drawn from the world's own (never changed)
function wxTick(W, L, dt) { const day = S.day, fog = MS.fog;
  if (!W.wxBase) W.wxBase = { sky: W.scene.background.clone(), fog: W.scene.fog.color.clone() };
  if (WX.tint) { wxTint.setHex(WX.tint); if (!day) wxTint.multiplyScalar(.22); }
  wxSky.copy(W.wxBase.sky); if (WX.tint) wxSky.lerp(wxTint, WX.tm); MS.background = wxSky;
  fog.color.copy(W.wxBase.fog); if (WX.tint) fog.color.lerp(wxTint, WX.tm);
  { const d0 = 13 * zEff; fog.near = d0 + (fog.near - d0) * WX.fogN; fog.far = d0 + (fog.far - d0) * WX.fogF; }   // measured past the party, never in front of it
  if (W.sun.userData.i0 === undefined) W.sun.userData.i0 = W.sun.intensity; W.sun.intensity = W.sun.userData.i0 * (day ? WX.sun : 1);
  let ex = day ? WX.dim : 1 - (1 - WX.dim) * .5;
  if (WX.flash) { wxNext -= dt; if (wxNext <= 0) { wxFlash = .16; wxNext = 3 + Math.random() * 9; } if (wxFlash > 0) { wxFlash -= dt; ex *= 1 + 2.6 * Math.max(0, wxFlash) / .16; } }
  renderer.toneMappingExposure = ex;
  if (!wxP) return; const { n, base, box, line } = wxP, a = wxP.obj.geometry.attributes.position.array, fall = WX.fall, wind = WX.wind || 0;
  const ox = L.pos.x - box[0] / 2, oy = W.camY - 1, oz = L.pos.y - box[2] + 6, t = clock, leaf = wxP.kind === 'leaf';
  for (let i = 0, j = 0; i < n * 3; i += 3) { const ph = base[i] * 1.7 + base[i + 2];
    const y = ((base[i + 1] - fall * t) % box[1] + box[1]) % box[1], x = ((base[i] + wind * t + (leaf || wxP.kind === 'snow' ? Math.sin(t * 1.3 + ph) * .35 : 0)) % box[0] + box[0]) % box[0], z = base[i + 2];
    const X = ox + x, Y = oy + (leaf ? y * .35 : y), Z = oz + z;
    a[j++] = X; a[j++] = Y; a[j++] = Z; if (line) { a[j++] = X - wind * .04; a[j++] = Y - .6; a[j++] = Z; } }
  wxP.obj.geometry.attributes.position.needsUpdate = true; }
function tick(dt, force) {
  if (world && !IN) { const pr = $('prompt'), c = flapNear(.55); if (c) { pr.hidden = false; pr.textContent = 'Cellar steps: E to go down'; } else if (!pr.hidden) pr.hidden = true; }
  if (MULTI() && !force) { const L0 = world.lead, dx = L0.pos.x < 0 ? -1 : L0.pos.x >= MW ? 1 : 0, dz = L0.pos.y < 0 ? -1 : L0.pos.y >= MH ? 1 : 0; if ((dx || dz) && shiftTo(dx, dz)) return tick(dt, true); }
  const W = world, L = W.lead;
  for (const N of worlds.values()) { if (N === W) { N.root.visible = true; continue; } const ox = (N.gx - AC.x) * MW, oz = (N.gy - AC.y) * MH, rx = Math.max(ox - L.pos.x, 0, L.pos.x - ox - MW), rz = Math.max(oz - L.pos.y, 0, L.pos.y - oz - MH);
    N.root.visible = Math.hypot(rx, rz * 1.4) < 34; if (N.root.visible && dt > 0) N.crowd.update(Math.min(dt, .05), [], S.hour); }
  let vx = 0, vy = 0; for (const k of keys) { vx += DIRS[k][0]; vy += DIRS[k][1]; }
  const ox0 = L.pos.x, oy0 = L.pos.y;
  if (vx || vy) { L.queue = []; const n = Math.hypot(vx, vy), st = SPEED * dt / n; const nx = L.pos.x + vx * st; if (!W.hits(nx, L.pos.y)) L.pos.x = nx; const ny = L.pos.y + vy * st; if (!W.hits(L.pos.x, ny)) L.pos.y = ny; }
  else if (L.queue.length) { const [tx, ty] = L.queue[0], gx = tx + .5 - L.pos.x, gy = ty + .5 - L.pos.y, dd = Math.hypot(gx, gy), st = SPEED * dt;
    if (dd <= st) { L.pos.set(tx + .5, ty + .5); L.queue.shift(); } else { L.pos.x += gx / dd * st; L.pos.y += gy / dd * st; } }
  L.moving = L.pos.x !== ox0 || L.pos.y !== oy0; if (L.moving && dt > 0) walkedAcc += Math.hypot(L.pos.x - ox0, L.pos.y - oy0); L.cell = [Math.floor(L.pos.x), Math.floor(L.pos.y)];
  if ((vx || vy) && dt > 0) { const h = doorNear(.6); if (h && h !== W.leftDoor) { const [ax, ay] = inward(h), n = 1; if ((vx * ax + vy * ay) / (n * Math.hypot(vx, vy)) > .5) { enterHouse(h); return; } } else if (!h) W.leftDoor = null; }
  if (!W.trail) W.trail = [];
  if (L.moving) { const tl = W.trail; if (!tl.length || Math.hypot(tl[0][0] - L.pos.x, tl[0][1] - L.pos.y) > .05) tl.unshift([L.pos.x, L.pos.y]); if (tl.length > 200) tl.length = 200; }
  W.party.slice(1).forEach((C, i) => { const want = (i + 1) * 1.0; let acc = 0, prev = [L.pos.x, L.pos.y], tgt = null;
    for (const p of W.trail) { acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; if (acc >= want) { tgt = p; break; } }
    const px = C.pos.x, py = C.pos.y; if (tgt) { const gx = tgt[0] - px, gy = tgt[1] - py, dd = Math.hypot(gx, gy), st = Math.min(dd, SPEED * 1.25 * dt); if (dd > .02) { C.pos.x += gx / dd * st; C.pos.y += gy / dd * st; } }
    C.moving = C.pos.x !== px || C.pos.y !== py; });
  for (const C of W.folk) { let near = null; for (const Pm of W.party) { const d = Math.hypot(Pm.pos.x - C.pos.x, Pm.pos.y - C.pos.y); if (d < 1.5 && (!near || d < near.d)) near = { d, Pm }; }
    if (near) { C.queue = []; C.wait = Math.max(C.wait, 1.5); if (near.d < 1.2) { const ax = (C.pos.x - near.Pm.pos.x) / (near.d || 1), ay = (C.pos.y - near.Pm.pos.y) / (near.d || 1), nx = C.pos.x + ax * 2.5 * dt, ny = C.pos.y + ay * 2.5 * dt; if (!W.hits(nx, ny, .18)) C.pos.set(nx, ny); } }
    if (C.queue.length) { const [tx, ty] = C.queue[0], gx = tx + .5 - C.pos.x, gy = ty + .5 - C.pos.y, dd = Math.hypot(gx, gy), st = C.speed * dt;
      const nx = C.pos.x + gx / Math.max(dd, 1e-3) * st, ny = C.pos.y + gy / Math.max(dd, 1e-3) * st, crowd = W.folk.some((F) => F !== C && Math.hypot(F.pos.x - nx, F.pos.y - ny) < .9 && Math.hypot(F.pos.x - nx, F.pos.y - ny) < Math.hypot(F.pos.x - C.pos.x, F.pos.y - C.pos.y));
      if (crowd) { C.queue = []; C.wait = 1 + Math.random() * 2; } else if (dd <= st) { C.pos.set(tx + .5, ty + .5); C.queue.shift(); } else { C.pos.set(nx, ny); } C.moving = !crowd; C.m.scale.x = gx < -.01 ? -1 : gx > .01 ? 1 : C.m.scale.x; }
    else { C.moving = false; C.wait -= dt; if (C.home && C.wait <= 0) { C.wait = 2 + Math.random() * 5; const tx = C.home[0] + Math.round((Math.random() - .5) * 10), ty = C.home[1] + Math.round((Math.random() - .5) * 8); const q = W.path(Math.floor(C.pos.x), Math.floor(C.pos.y), tx, ty); if (q && q.length < 14) C.queue = q; } }
    { // hidden whole as soon as anything between it and the camera reaches its feet: never a head over a roof
      let hid = false; for (const ox of [-.45, 0, .45]) for (let d = .15; d < 12 && !hid; d += .2) if (W.topW(Math.floor(C.pos.x + ox), Math.floor(C.pos.y + d)) - W.hAt(C.pos.x, C.pos.y) > d * 1.12 - .15) hid = true; C.m.visible = C.sh.visible = !hid; }
    const gy = W.hAt(C.pos.x, C.pos.y); C.m.position.set(C.pos.x, gy + C.h / 2 - 1 / 32 + (C.moving ? Math.abs(Math.sin(clock * 10 + C.speed * 7)) * .035 : 0), C.pos.y + .05); C.sh.position.set(C.pos.x, gy + .012, C.pos.y + .07); }
  if (opts.clock !== false) S.hour = (S.hour + dt / 60) % 24;   // one game minute a second
  if (!W.switching && S.day !== (S.hour >= 6 && S.hour < 20)) { W.switching = true; S.day = !S.day; save(); load(W.lead.cell); }
  { const mm = Math.floor(S.hour * 60); if (mm !== W.lastMin) { W.lastMin = mm; const t = $('clock'); if (t) t.textContent = String(Math.floor(mm / 60)).padStart(2, '0') + ':' + String(mm % 60).padStart(2, '0'); } }
  W.crowd.update(Math.min(dt, .05), W.party.map((C) => C.pos), S.hour);
  W.party.forEach((C, i) => { const gy = W.hAt(C.pos.x, C.pos.y); C.m.position.set(C.pos.x, gy + C.h / 2 - 1 / 32 + (C.moving ? Math.abs(Math.sin(clock * 14 + i)) * .045 : 0), C.pos.y + .05); C.sh.position.set(C.pos.x, gy + .012, C.pos.y + .07); });
  { const hl = W.hAt(L.pos.x, L.pos.y); W.camY = force || W.camY === undefined ? hl : W.camY + (hl - W.camY) * Math.min(1, dt * 3); }
  const cellKey = W.I(L.cell[0], L.cell[1]); if (force || cellKey !== lastCell) { W.assign(L.pos.x, L.pos.y); lastCell = cellKey;
    { const qa = W.P.nav && W.P.nav.quarterAt(L.cell[0], L.cell[1]); opts.onWhere?.({ where: W.where(L.cell[0], L.cell[1]), quarter: qa ? qa.name : null, trade: qa ? qa.trade : null }); $('where').innerHTML = `${W.where(L.cell[0], L.cell[1])}<small>${qa ? `${qa.name}, ${qa.trade} · ` : ''}${S.season[0].toUpperCase() + S.season.slice(1)}, <span data-h2="clock"></span></small>`; } W.lastMin = -1; drawSky(W); }
  W.sun.position.set(L.pos.x - 8, 14 + W.camY, L.pos.y + 7); W.sun.target.position.set(L.pos.x, W.camY, L.pos.y - 2);
  W.rim.position.set(L.pos.x + 3, 5 + W.camY, L.pos.y - 9); W.rim.target.position.set(L.pos.x, W.camY, L.pos.y);
  W.partyLight.position.set(L.pos.x, 1.7 + W.hAt(L.pos.x, L.pos.y + 1.6), L.pos.y + 1.6);
  if (L.moving && (++shadowTick % 3 === 0)) for (const pl of W.pool) if (pl.castShadow) pl.shadow.needsUpdate = true;
  for (const pl of W.pool) if (pl.userData.base) pl.intensity = pl.userData.base * (1 + .06 * Math.sin(clock * 9 + pl.userData.seed) + .03 * Math.sin(clock * 23 + pl.userData.seed * 2));
  for (const s of W.puffs) { const t = (clock * .18 + s.userData.ph) % 1; s.position.set(s.userData.base.x + t * .5, s.userData.base.y + t * 1.6, s.userData.base.z - t * .2); s.scale.setScalar(.25 + t * .45); s.material.opacity = .26 * Math.sin(t * Math.PI); }
  { const want = S.zoom * (W.P.at(L.cell[0], L.cell[1]) === 'square' ? 1.22 : 1); zEff = force ? want : zEff + (want - zEff) * Math.min(1, dt * 2.5); }
  cam.position.lerp(camGoal(), force ? 1 : Math.min(1, dt * 5));
  MS.fog.near = 13 * zEff + 4; MS.fog.far = 13 * zEff + 34;
  wxTick(W, L, dt);
  cam.lookAt(cam.position.x, .75 + W.camY, cam.position.z - (window.CAMD || 8.4) * zEff - .5);
  U.inside.value = W.P.walls && W.P.walls.ins[W.I(Math.max(0, Math.min(MW - 1, L.cell[0])), Math.max(0, Math.min(MH - 1, L.cell[1])))] ? 1 : 0; U.party.value.set(L.pos.x, .8 + W.hAt(L.pos.x, L.pos.y), L.pos.y); { const T = world.party[world.party.length - 1]; U.tail.value.set(T.pos.x, .8 + W.hAt(T.pos.x, T.pos.y), T.pos.y); const pm = (i) => world.party[Math.min(i, world.party.length - 1)]; for (const [u, C] of [[U.p1, pm(1)], [U.p2, pm(2)]]) u.value.set(C.pos.x, .8 + W.hAt(C.pos.x, C.pos.y), C.pos.y); } U.cam.value.copy(cam.position);
}
let last = performance.now();
renderer.setAnimationLoop((now) => { const dt = Math.min(.05, (now - last) / 1000); last = now; if (!world || window.PAUSE || paused) return; clock += dt; if (IN) inTick(dt); else tick(dt); composer.render(); });
// ---------- going indoors: a home's door leads to its own interior scene, planned from the house shell and its household ----------
let IN = null;
function gridOf(P) { const o = []; for (let y = 0; y < MH; y++) { let r = ''; for (let x = 0; x < MW; x++) r += (P.at(x, y) || '?')[0]; o.push(r); } return o; }
// the way into a house through its door: across the lot edge the door stands outside of
// ---------- the skyline band: the city's tall landmarks beyond the loaded maps, drawn on the north horizon by their bearing ----------
// the camera looks north and never sees the horizon, so the band stands in for it: towers and spires to steer by, named
function drawSky(W) { const cv = $('sky'), nav = W && W.P.nav; if (!nav) { cv.hidden = true; return; } cv.hidden = false; if (cv.width !== 760 * 2) { cv.width = 760 * 2; cv.height = 84 * 2; } cv.getContext('2d').setTransform(2, 0, 0, 2, 0, 0);
  const c = cv.getContext('2d'), Wd = 760, Hd = 84, base = Hd - 18, L = W.lead, px = L.pos.x, py = L.pos.y, FOV = 80 * Math.PI / 180;
  c.clearRect(0, 0, Wd, Hd); const day = S.day, g = c.createLinearGradient(0, 0, 0, Hd);
  g.addColorStop(0, day ? 'rgba(214,226,238,.92)' : 'rgba(22,28,48,.9)'); g.addColorStop(1, day ? 'rgba(238,232,218,.92)' : 'rgba(34,36,52,.9)');
  c.beginPath(); c.roundRect(1, 1, Wd - 2, Hd - 2, 10); c.fillStyle = g; c.fill(); c.strokeStyle = day ? 'rgba(90,80,60,.35)' : 'rgba(200,210,240,.25)'; c.lineWidth = 1; c.stroke();
  c.fillStyle = day ? 'rgba(120,128,110,.45)' : 'rgba(120,130,160,.35)'; c.fillRect(10, base, Wd - 20, 1.5);   // the horizon
  c.font = '700 10px system-ui, sans-serif'; c.textAlign = 'center'; c.fillStyle = day ? 'rgba(60,60,60,.55)' : 'rgba(220,226,240,.6)'; c.fillText('N', Wd / 2, 12); c.fillText('W', 16, 12); c.fillText('E', Wd - 16, 12);
  const ink = day ? 'rgba(52,58,78,' : 'rgba(180,192,220,', seen = [];
  for (const l of nav.landmarks) { const dx = l.x - px, dy = py - l.y, d = Math.hypot(dx, dy); if (dy <= 0 || d < 24) continue; const a = Math.atan2(dx, dy); if (Math.abs(a) > FOV) continue;
    seen.push({ ...l, d, u: Wd / 2 + a / FOV * (Wd / 2 - 24), s: 1.35 * Math.max(.4, Math.min(1, 80 / d)) * Math.min(1.25, .55 + l.h * .3) }); }
  seen.sort((a, b) => b.d - a.d);   // far first, near drawn over them
  const shape = (k, x, s) => { const R = (x0, w, h) => c.fillRect(x - x0 * s, base - h * s, w * s, h * s), sp = (x0, w, h0, h1) => { c.beginPath(); c.moveTo((x - x0) * 1, base - h0 * s); c.lineTo(x - x0 + w * s / 2, base - h1 * s); c.lineTo(x - x0 + w * s, base - h0 * s); c.fill(); };
    switch (k) {
      case 'cathedral': R(26, 52, 15); R(26, 7, 28); R(19, 7, 28); R(1, 8, 26); sp(-(-1 + 0) * s, 8 * s / s, 26, 48); break;
      case 'abbey': R(16, 34, 12); R(2, 9, 22); break;
      case 'church': R(10, 16, 8); R(-6, 5, 16); sp(-(6) * s, 5, 16, 27); break;
      case 'steeple': R(6, 12, 6); R(-2, 3, 10); sp(-(2) * s, 3, 10, 17); break;
      case 'castle': R(12, 26, 11); R(4, 9, 19); for (let k2 = 0; k2 < 3; k2++) R(4 - k2 * 3.4, 1.8, 21); break;
      case 'mill': { R(1.2, 2.4, 9); c.fillRect(x - 3 * s, base - 15 * s, 6 * s, 6 * s); c.save(); c.translate(x, base - 13 * s); c.rotate(.35); c.fillRect(-.6 * s, -9 * s, 1.2 * s, 18 * s); c.fillRect(-9 * s, -.6 * s, 18 * s, 1.2 * s); c.restore(); break; }
      case 'belfry': R(9, 18, 9); R(2.5, 5, 22); sp(2.5 * s, 5, 22, 27); break;
      case 'hall': R(9, 18, 10); break;
      case 'ruin': { c.beginPath(); c.moveTo(x - 14 * s, base); for (let k2 = 0; k2 <= 10; k2++) c.lineTo(x - 14 * s + k2 * 2.8 * s, base - (4 + ((k2 * 7) % 5) * 2.2) * s); c.lineTo(x + 14 * s, base); c.fill(); break; }
      default: R(5, 10, 8); } };
  const labels = [];
  for (const l of seen) { const al = Math.max(.42, Math.min(.95, 1.15 - l.d / 260)); c.fillStyle = ink + al + ')'; shape(l.kind, l.u, l.s);
    if (l.h >= 1.4 || l.d < 60) labels.push(l); }
  c.font = '600 11px system-ui, sans-serif'; c.textAlign = 'center'; const used = [];
  for (const l of labels.sort((a, b) => b.h - a.h || a.d - b.d)) { const w = c.measureText(l.name).width + 10; if (used.some(([a, b]) => l.u + w / 2 > a && l.u - w / 2 < b)) continue; used.push([l.u - w / 2, l.u + w / 2]);
    c.fillStyle = day ? 'rgba(40,44,56,.85)' : 'rgba(220,226,240,.9)'; c.fillText(l.name, l.u, Hd - 4); }
}
function inward(h) { const [dx, dy] = h.door; if (dy < h.y) return [0, 1]; if (dy > h.y + h.d) return [0, -1]; if (dx < h.x) return [1, 0]; if (dx > h.x + h.w) return [-1, 0]; const ax = h.x + h.w / 2 - dx, ay = h.y + h.d / 2 - dy; return Math.abs(ax) > Math.abs(ay) ? [Math.sign(ax), 0] : [0, Math.sign(ay)]; }
function flapNear(maxD = .55) { const L = world.lead; let best = null, bd = maxD; for (const h of world.P.HOUSES || []) { if (!h.cellarAt) continue; const d = Math.hypot(h.cellarAt[0] - L.pos.x, h.cellarAt[1] - L.pos.y); if (d < bd) { bd = d; best = h; } } return best; }
function doorNear(maxD = .7) { const L = world.lead; let best = null, bd = maxD; for (const h of [...(world.P.HOUSES || []), world.P.CHURCH, world.P.GUILD, ...(world.P.GATES || []), ...(world.P.WORKS || []), ...(world.P.BENTRY || [])]) { if (!h) continue; if (!h.door) continue; const d = Math.hypot(h.door[0] - L.pos.x, h.door[1] - L.pos.y); if (d < bd) { bd = d; best = h; } } return best; }
// test hook: walk into a hand-made plan (prop sheets)
function enterPlan(pl, o = {}) { const I = buildInterior(pl, { day: o.day ?? S.day, shadows: S.hq, stair: null });
  const W = makeWalk(I, ['knight', 'mage', 'rogue', 'cleric'].map((n) => charTex[n]), { blob, day: o.day ?? S.day }); W.enter(); IN = { I, W, h: pl.H, pl, zEff: 1.28, outAt: [world.lead.pos.x, world.lead.pos.y] }; keys.clear();
  makeComposer(I.scene); inTick(0, true); $('fade').style.opacity = 0; return IN; }
function enterHouse(h, o = {}) {
  const P = world.P, hh = (P.HH || []).find((q) => q.house === h.id) || null;
  const pl = h.gen2 ? PLANNERS[h.planner]({ seed: S.seed, ...h.opt }) : h.church ? planChurch(h.ch, { seed: S.seed }) : h.guild ? planGuild(h.gh, { seed: S.seed, kind: window.GUILD_KIND }) : h.gate ? planGate(h.G, { seed: S.seed }) : h.works === 'mill' ? planMill(h.F, { seed: S.seed }) : h.works === 'smelter' ? planSmelter(h.F, { seed: S.seed }) : planInterior(h, { seed: S.seed, hh, grid: gridOf(P) });
  const I = buildInterior(pl, { day: S.day, shadows: S.hq, stair: o.stair || window.STAIR || null });
  const W = makeWalk(I, ['knight', 'mage', 'rogue', 'cleric'].map((n) => charTex[n]), { blob, day: S.day });
  if (!(o.cellar && W.enterCellar())) W.enter(); IN = { I, W, h, pl, zEff: 1.28, outAt: [world.lead.pos.x, world.lead.pos.y] }; keys.clear(); opts.onEnter?.(doorInfo(h));
  makeComposer(I.scene); inTick(0, true); $('fade').style.opacity = 0; return IN; }
function leaveHouse() { const { h, W } = IN, fromCellar = W.f === -1 && h.cellarAt; W.dispose(); IN = null; keys.clear();
  // back on the street just outside the door (or up the cellar steps beside the flaps), facing away from it
  const L = world.lead, [ix, iy] = inward(h), ax = -ix, ay = -iy, n = 1, o = fromCellar ? h.cellarAt : h.door, od = fromCellar ? .4 : .35;
  L.pos.set(o[0] + ax / n * od, o[1] + ay / n * od); L.queue = []; world.trail = []; world.party.slice(1).forEach((C, i) => C.pos.set(L.pos.x + ax / n * .3 * (i + 1), L.pos.y + ay / n * .3 * (i + 1)));
  world.leftDoor = h; makeComposer(MS); tick(0, true); opts.onExit?.(); }
function inTick(dt, force) { const { W } = IN; let vx = 0, vy = 0; for (const k of keys) { vx += DIRS[k][0]; vy += DIRS[k][1]; }
  W.tick(dt, [vx, vy]); $('fade').style.opacity = W.fade;
  const pr = $('prompt'); if (W.prompt) { pr.hidden = false; pr.textContent = 'Stairs: W to go up, S to go down'; } else if (W.hint) { pr.hidden = false; pr.textContent = 'Cellar hatch: E to climb down'; } else pr.hidden = true;
  const [rn, ln] = W.roomName(), key = rn + ln; if (key !== IN.lastRoom) { IN.lastRoom = key; $('where').innerHTML = `${rn || '…'}<small>${ln}</small>`; }
  cam.position.lerp(W.camGoal(IN.zEff), force ? 1 : Math.min(1, dt * 5)); W.lookAt(cam, IN.zEff);
  if (W.exited) leaveHouse(); }
const __in = { PLANNERS, planKeep, planGuild, inward, enterHouse, enterPlan, flapNear, get IN() { return IN; }, leaveHouse, doorNear, inTick }; const __walk = { Raycaster: THREE.Raycaster, get worlds() { return worlds; }, get gtao() { return gtao; }, get composer() { return composer; }, renderer, U, step: (n, dt = .05) => { for (let i = 0; i < n; i++) { clock += dt; tick(dt); } composer.render(); }, stepNR: (n, dt = .05) => { for (let i = 0; i < n; i++) { clock += dt; tick(dt); } }, get world() { return world; }, get cam() { return cam; }, keys, S, load };
setWeather(S.weather || 'clear');

Object.assign(S, opts.spec || {}, { hour: opts.hour ?? S.hour, season: opts.season || S.season, hq: opts.hq ?? S.hq });
S.day = S.hour >= 6 && S.hour < 20; S.gen = 2; S.place = 'town'; S.rank = Math.min(2, +S.rank || 0); if (opts.tcell != null) S.tcell = opts.tcell;
setWeather(opts.weather || 'clear');
load(opts.arriveAt || null);
const api = {
  S, __in, __walk, get world() { return world; }, get inside() { return IN; },
  setHour(h) { if (!world || IN) { S.hour = h; return; } const d = h >= 6 && h < 20; S.hour = h; if (d !== S.day && !world.switching) { world.switching = true; S.day = d; load(world.lead.cell); } },
  setSeason(s) { if (s && s !== S.season && world) { S.season = s; load(world.lead.cell); } },
  setWeather(w) { setWeather(w || 'clear'); },
  setHq(v) { S.hq = !!v; if (gtao) gtao.enabled = S.hq; tilts.forEach((p) => (p.enabled = S.hq)); },
  pause(v) { paused = !!v; keys.clear(); },
  focus() { renderer.domElement.focus({ preventScroll: true }); },
  takeWalked() { const w = walkedAcc; walkedAcc = 0; return w; },
  position() { if (!world) return null; const L = world.lead; return { tcell: S.tcell, x: L.pos.x, y: L.pos.y }; },
  dispose() { disposed = true; renderer.setAnimationLoop(null); ro.disconnect(); for (const [t, ev, fn, o] of listeners) t.removeEventListener(ev, fn, o); listeners.length = 0;
    ringGen++; if (IN) { try { IN.W.dispose(); } catch {} IN = null; } for (const W of worlds.values()) dispose(W); worlds.clear(); if (world && world.root && world.root.parent) dispose(world); world = null;
    composer?.dispose?.(); renderer.dispose(); renderer.forceContextLoss?.(); renderer.domElement.remove(); host.querySelectorAll('[data-h2]').forEach((e) => e.remove()); },
};
if (opts.debug) window.__hd2d = api;
return api;
}
