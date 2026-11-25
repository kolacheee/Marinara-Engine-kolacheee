// Figures (fork): put a person's layers together into one sheet, and many people's sheets into one atlas
// the town draws in a single pass. Layers are drawn in fixed source ramps (skin, cloth, hair: four shades
// each, darkest first); a layer's tint swaps its source shades for the chosen ramp, pixel for pixel, so
// one drawn body serves every skin tone and one outfit every colourway.
// A sheet is 4 walk frames wide (frame 0 also standing) and one row per direction: down, left, right, up.

export const FIG = Object.freeze({ w: 32, h: 48, walk: 4, dirs: 4 });
export const FIG_DIRS = Object.freeze(['down', 'left', 'right', 'up']);

// Source ramps the layer art is drawn in: exact colours, darkest first.
export const SKIN_SOURCE = ['#5a3424', '#9a5f42', '#d79a74', '#f4c9a4'];
export const CLOTH_SOURCE = ['#2a3150', '#3f4c7a', '#5f73a8', '#8fa3d0'];
export const HAIR_SOURCE = ['#2c1d14', '#4f3424', '#7a5236', '#a8774e'];

// Five skin tones, lightest first.
export const SKIN_RAMPS = [
  ['#7a4a3a', '#c08470', '#ecc0a4', '#fbe2cc'],
  ['#6e4030', '#b07458', '#e0a888', '#f6cdb0'],
  ['#5c3624', '#96603e', '#c88a5e', '#e4ae82'],
  ['#3e2216', '#6e4228', '#9c6640', '#be8a5e'],
  ['#24140e', '#45281a', '#6a3e28', '#8c5a3c'],
];
// Four colourways for clothes and headwear: madder red, woad blue, weld-and-woad green, undyed brown.
export const CLOTH_RAMPS = [
  ['#4a1c1a', '#7a2e28', '#a8483c', '#cc7460'],
  ['#1e2a44', '#304670', '#4a689c', '#7894c4'],
  ['#1e3020', '#2e4c30', '#4a6c44', '#78966a'],
  ['#3a2a1c', '#5c4430', '#806248', '#a88a6a'],
];
export const HAIR_RAMPS = {
  black: ['#120e10', '#22191c', '#342629', '#4a383a'],
  brown: ['#24160e', '#3e2818', '#5a3c24', '#7a5634'],
  chestnut: ['#3a1e10', '#62341a', '#8a4e2a', '#b0703e'],
  blond: ['#6a4a1e', '#a07a34', '#cca852', '#ead27e'],
  red: ['#4a160c', '#7e2c14', '#ac4620', '#d26c34'],
  grey: ['#3c3c40', '#626266', '#8c8c90', '#b8b8bc'],
  white: ['#7c7c84', '#a8a8b0', '#d0d0d6', '#f0f0f4'],
  dyed: ['#1e2a5a', '#30449a', '#4c6ccc', '#7c9ae8'],
};

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const key = (r, g, b) => (r << 16) | (g << 8) | b;
/** The colour swap for a layer's tint: skin tone (a number on a body), colourway, or hair colour name. */
export function tintMap(layer, tint) {
  if (tint === undefined || tint === null) return null;
  const kind = layer.split('/')[0];
  const pairs = kind === 'body' ? [SKIN_SOURCE, SKIN_RAMPS[tint]] : typeof tint === 'string' ? [HAIR_SOURCE, HAIR_RAMPS[tint]] : [CLOTH_SOURCE, CLOTH_RAMPS[tint]];
  if (!pairs[1]) return null;
  const map = new Map();
  pairs[0].forEach((from, i) => map.set(key(...hex(from)), hex(pairs[1][i])));
  return map;
}

/** Recolour RGBA pixels in place. */
export function recolour(data, map) {
  if (!map) return data;
  for (let i = 0; i < data.length; i += 4) {
    if (!data[i + 3]) continue;
    const to = map.get(key(data[i], data[i + 1], data[i + 2]));
    if (to) { data[i] = to[0]; data[i + 1] = to[1]; data[i + 2] = to[2]; }
  }
  return data;
}

const canvasOf = (w, h) => { const c = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h }); return c; };

/**
 * One person's sheet from their layers (bottom first, as worldFigureLayers gives them). `image(layer)`
 * returns a loaded image (or canvas) of that layer's sheet, or null when the layer is not drawn yet: a
 * missing layer is left out, so a look still draws with the layers that exist.
 */
export function figureSheet(layers, image) {
  const W = FIG.w * FIG.walk, H = FIG.h * FIG.dirs;
  const out = canvasOf(W, H), g = out.getContext('2d');
  const tmp = canvasOf(W, H), tg = tmp.getContext('2d', { willReadFrequently: true });
  for (const { layer, tint } of layers) {
    const img = image(layer);
    if (!img) continue;
    tg.clearRect(0, 0, W, H); tg.drawImage(img, 0, 0);
    const map = tintMap(layer, tint);
    if (map) { const d = tg.getImageData(0, 0, W, H); recolour(d.data, map); tg.putImageData(d, 0, 0); }
    g.drawImage(tmp, 0, 0);
  }
  return out;
}

/**
 * Many sheets in one atlas, packed in a grid. `uv(i, dir, frame)` gives the frame's [u0, v0, u1, v1]
 * (v up, as three.js reads it) for person i.
 */
export function figureAtlas(sheets) {
  const SW = FIG.w * FIG.walk, SH = FIG.h * FIG.dirs;
  const cols = Math.max(1, Math.min(16, Math.ceil(Math.sqrt(sheets.length))));
  const rows = Math.max(1, Math.ceil(sheets.length / cols));
  const canvas = canvasOf(cols * SW, rows * SH), g = canvas.getContext('2d');
  sheets.forEach((s, i) => g.drawImage(s, (i % cols) * SW, Math.floor(i / cols) * SH));
  const uv = (i, dir, frame) => {
    const d = typeof dir === 'number' ? dir : Math.max(0, FIG_DIRS.indexOf(dir));
    const x = (i % cols) * SW + (frame % FIG.walk) * FIG.w, y = Math.floor(i / cols) * SH + d * FIG.h;
    return [x / canvas.width, 1 - (y + FIG.h) / canvas.height, (x + FIG.w) / canvas.width, 1 - y / canvas.height];
  };
  return { canvas, cols, rows, uv };
}

/** The direction a walker faces, from its step (screen: +x right, +y toward the camera). */
export function figureDir(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy) * 1.2) return dx < 0 ? 'left' : 'right';
  return dy < 0 ? 'up' : 'down';
}
