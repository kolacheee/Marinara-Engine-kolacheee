import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("../mari-theme-test/packages/server/node_modules/sharp");
const [, , out, cols, w, ...files] = process.argv;
const W = +w, C = +cols;
const imgs = await Promise.all(files.map(async (f) => { const b = await sharp(f).resize({ width: W }).png().toBuffer(); const m = await sharp(b).metadata(); return { b, h: m.height }; }));
const H = Math.max(...imgs.map((i) => i.h)); const rows = Math.ceil(imgs.length / C); const pad = 8;
await sharp({ create: { width: C * (W + pad) + pad, height: rows * (H + pad) + pad, channels: 3, background: "#222" } })
  .composite(imgs.map((i, k) => ({ input: i.b, left: pad + (k % C) * (W + pad), top: pad + Math.floor(k / C) * (H + pad) }))).png().toFile(out);
