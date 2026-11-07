#!/usr/bin/env node
// ──────────────────────────────────────────────
// The Engine's own art (Pixelforge W1): turns the approved Pixelforge image packs (tile pack v2, 48 px)
// into the built-in packs, one per setting family and one per dungeon set.
//
//   pnpm build:shared && node scripts/art/pack-builtin-art.mjs <dir> [<dir> ...] [--only fantasy,cave_rock,...]
//
// Each <dir> is searched (with its subfolders) for the packs: pack-<family>-seasons.json or
// pack-<family>.json for a family ("town" is fantasy's; a seasons pack, which holds the family's whole pack
// and its seasons, wins), and pack-<set>.json for a dungeon set. Each pack is filed under its family's or
// set's own id, its characters and the character sprites (folk, party) are left out (they are drawn again
// on their own), every pixel no tile reads is cleared and every sheet written again as a clean PNG, trimmed
// to what is read. The result must read with no issues and no notes. --only packs just the named families
// and sets.
//
// Writes packages/server/src/assets/overworld-art/<family>.json and
// packages/server/src/assets/dungeon-tiles/<set>.json.
// ──────────────────────────────────────────────
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const shared = await import(pathToFileURL(join(ROOT, "packages/shared/dist/index.js")).href);
const sharp = createRequire(join(ROOT, "packages/server/package.json"))("sharp");
const { DUNGEON_SETS, WORLD_ART_FAMILIES, WORLD_SQUARE_LOOKS, parseTilePack } = shared;

const args = process.argv.slice(2);
const onlyAt = args.indexOf("--only");
const only = onlyAt >= 0 ? new Set((args[onlyAt + 1] ?? "").split(",").filter(Boolean)) : null;
const sources = args.filter((_, at) => onlyAt < 0 || (at !== onlyAt && at !== onlyAt + 1));
if (!sources.length) {
  console.error("Usage: node scripts/art/pack-builtin-art.mjs <dir> [<dir> ...] [--only id,id]");
  process.exit(1);
}

const FAMILY_NAMES = {
  fantasy: "Fantasy",
  wuxia: "Wuxia",
  modern: "Modern",
  scifi: "Sci-fi",
  jazz_age: "Jazz Age",
  wasteland: "Wasteland",
};
/** The family packs' files: fantasy's was drawn first, as the town test. */
const FAMILY_FILES = { fantasy: "town" };
/** Tiles that are characters, not places: drawn again on their own, never shipped from these packs. */
const CHARACTER_TILES = new Set(["folk", "party"]);
const PNG = "data:image/png;base64,";
/** Modern ground a family's setting has no place for (user, 2026-11-06: suburbs "don't fit in a
 *  fantasy/historical setting"): left out, so its worlds draw the fields instead (WORLD_GROUND_LOOK_FALLBACK). */
const MODERN_GROUND = new Set(["suburb", "city", "industry", "slums"]);
const NO_MODERN_GROUND = new Set(["fantasy", "wuxia"]);

/** Every file under the sources, by name (the first found wins). */
const files = new Map();
const walk = (dir) => {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (!files.has(name)) files.set(name, path);
  }
};
for (const source of sources) walk(source);
const find = (...names) => names.map((name) => files.get(name)).find(Boolean);

/** The sheets with only what the tiles read, packed again: each distinct cell block a tile reads is copied
 *  onto fresh sheets (tallest first, in rows), and the tiles pointed at their new places, so the pack holds
 *  no unread pixels and stays under the pixel cap (TILE_PACK_IMAGE_MAX_PIXELS) as the art grows. */
const SHEET_CELLS = 42;
async function cleanSheets(pack, tiles) {
  const cell = pack.tileSize;
  const raw = new Map();
  for (const sheet of pack.sheets) raw.set(sheet.id, sheet);
  const decoded = new Map();
  const pixelsOf = async (id) => {
    if (!decoded.has(id)) {
      const input = Buffer.from(raw.get(id).png.slice(PNG.length), "base64");
      decoded.set(id, await sharp(input).ensureAlpha().png().toBuffer());
    }
    return decoded.get(id);
  };
  // Each distinct block read, once.
  const blocks = new Map();
  for (const variants of Object.values(tiles))
    for (const v of variants) {
      const key = `${v.sheet}:${v.x}:${v.y}:${v.w ?? 1}:${v.h ?? 1}`;
      if (!blocks.has(key)) blocks.set(key, { sheet: v.sheet, x: v.x, y: v.y, w: v.w ?? 1, h: v.h ?? 1 });
    }
  const order = [...blocks.values()].sort((a, b) => b.h - a.h || b.w - a.w);
  const out = [];
  let [x, y, rowH] = [0, 0, 0];
  const open = () => {
    out.push({ id: `art${out.length}`, parts: [], height: 0, width: 0 });
    [x, y, rowH] = [0, 0, 0];
  };
  open();
  for (const block of order) {
    if (x + block.w > SHEET_CELLS) [x, y, rowH] = [0, y + rowH, 0];
    if (y + block.h > SHEET_CELLS) open();
    const sheet = out[out.length - 1];
    block.to = { sheet: sheet.id, x, y };
    sheet.parts.push(block);
    sheet.width = Math.max(sheet.width, x + block.w);
    sheet.height = Math.max(sheet.height, y + block.h);
    x += block.w;
    rowH = Math.max(rowH, block.h);
  }
  const sheets = [];
  for (const sheet of out) {
    if (!sheet.parts.length) continue;
    const layers = [];
    for (const part of sheet.parts) {
      const piece = await sharp(await pixelsOf(part.sheet))
        .extract({ left: part.x * cell, top: part.y * cell, width: part.w * cell, height: part.h * cell })
        .png()
        .toBuffer();
      layers.push({ input: piece, left: part.to.x * cell, top: part.to.y * cell });
    }
    const [width, height] = [sheet.width * cell, sheet.height * cell];
    const png = await sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(layers)
      .png({ compressionLevel: 9 })
      .toBuffer();
    sheets.push({ id: sheet.id, png: `${PNG}${png.toString("base64")}`, width, height });
  }
  for (const variants of Object.values(tiles))
    for (const v of variants) {
      const to = blocks.get(`${v.sheet}:${v.x}:${v.y}:${v.w ?? 1}:${v.h ?? 1}`).to;
      Object.assign(v, to);
    }
  return sheets;
}

/** The pack under its built-in id and name, its version first (the library tells image packs apart by it). */
async function builtIn(file, id, name, family) {
  const pack = JSON.parse(readFileSync(file, "utf8"));
  const tiles = Object.fromEntries(
    Object.entries(pack.tiles).filter(([tile]) => {
      const base = tile.split("@")[0];
      if (CHARACTER_TILES.has(base)) return false;
      // Square looks (WORLD_SQUARE_LOOKS) are drawn with no fringe.
      if (base.startsWith("fringe_") && WORLD_SQUARE_LOOKS.includes(base.slice("fringe_".length))) return false;
      return !(NO_MODERN_GROUND.has(family) && MODERN_GROUND.has(base.replace(/^fringe_/, "")));
    }),
  );
  const out = {
    tilePackVersion: pack.tilePackVersion,
    id,
    name,
    family,
    version: 1,
    author: "Marinara Engine",
    tileSize: pack.tileSize,
    sheets: await cleanSheets(pack, tiles),
    tiles,
  };
  const text = JSON.stringify(out);
  const read = parseTilePack(text);
  if (!read.ok) throw new Error(`${id}: ${read.issues.join("; ")}`);
  if (read.notes.length) throw new Error(`${id}: ${read.notes.join("; ")}`);
  return text;
}

const write = (dir, id, text) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${id}.json`), `${text}\n`);
  console.log(`${id}: ${(text.length / 1e6).toFixed(2)} MB`);
};

const overworld = join(ROOT, "packages/server/src/assets/overworld-art");
for (const family of WORLD_ART_FAMILIES) {
  if (only && !only.has(family)) continue;
  const name = FAMILY_FILES[family] ?? family;
  const file = find(`pack-${name}-seasons.json`, `pack-${name}.json`);
  if (!file || !existsSync(file)) throw new Error(`No pack for ${family}`);
  write(overworld, family, await builtIn(file, family, FAMILY_NAMES[family], family));
}
const dungeons = join(ROOT, "packages/server/src/assets/dungeon-tiles");
for (const set of DUNGEON_SETS) {
  if (only && !only.has(set.id)) continue;
  const file = find(`pack-${set.id}.json`);
  if (!file) throw new Error(`No pack for the ${set.id} set`);
  write(dungeons, set.id, await builtIn(file, set.id, set.label, "dungeon"));
}
