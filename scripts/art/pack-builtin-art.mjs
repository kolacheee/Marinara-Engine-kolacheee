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
const { DUNGEON_SETS, WORLD_ART_FAMILIES, parseTilePack } = shared;

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

/** The sheets with only what the tiles read: every other pixel cleared, each trimmed to the cells read
 *  (a sheet nothing reads is dropped). */
async function cleanSheets(pack, tiles) {
  const cell = pack.tileSize;
  const rects = new Map();
  for (const variants of Object.values(tiles))
    for (const v of variants) {
      const list = rects.get(v.sheet) ?? [];
      list.push([v.x * cell, v.y * cell, (v.w ?? 1) * cell, (v.h ?? 1) * cell]);
      rects.set(v.sheet, list);
    }
  const sheets = [];
  for (const sheet of pack.sheets) {
    const read = rects.get(sheet.id);
    if (!read) continue;
    const input = Buffer.from(sheet.png.slice(PNG.length), "base64");
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const kept = Buffer.alloc(data.length);
    let [right, bottom] = [0, 0];
    for (const [x, y, w, h] of read) {
      const [x1, y1] = [Math.min(info.width, x + w), Math.min(info.height, y + h)];
      for (let row = y; row < y1; row++)
        data.copy(kept, (row * info.width + x) * 4, (row * info.width + x) * 4, (row * info.width + x1) * 4);
      right = Math.max(right, x1);
      bottom = Math.max(bottom, y1);
    }
    const output = await sharp(kept, { raw: { width: info.width, height: info.height, channels: 4 } })
      .extract({ left: 0, top: 0, width: right, height: bottom })
      .png({ compressionLevel: 9 })
      .toBuffer();
    sheets.push({
      ...sheet,
      png: `${PNG}${output.toString("base64")}`,
      ...("width" in sheet ? { width: right } : {}),
      ...("height" in sheet ? { height: bottom } : {}),
    });
  }
  return sheets;
}

/** The pack under its built-in id and name, its version first (the library tells image packs apart by it). */
async function builtIn(file, id, name, family) {
  const pack = JSON.parse(readFileSync(file, "utf8"));
  const tiles = Object.fromEntries(
    Object.entries(pack.tiles).filter(([tile]) => !CHARACTER_TILES.has(tile.split("@")[0])),
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
