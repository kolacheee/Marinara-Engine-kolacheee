#!/usr/bin/env node
// ──────────────────────────────────────────────
// The Engine's own art (Pixelforge W1): turns the approved Pixelforge image packs (tile pack v2, 48 px)
// into the built-in packs, one per setting family and one per dungeon set.
//
//   pnpm build:shared && node scripts/art/pack-builtin-art.mjs <art-review dir> [--only fantasy,cave_rock,...]
//
// <art-review dir> holds packs-2026-10-05/pack-<name>.json (the family packs; "town" is fantasy's) and
// dungeons-2026-10-05/pack-<set>.json. Each pack is filed under its family's or set's own id, every sheet is
// written again as a clean PNG (as the server does for a pack saved from the maker), and the result must
// read with no issues and no notes. --only packs just the named families and sets.
//
// Writes packages/server/src/assets/overworld-tiles/<family>.json and
// packages/server/src/assets/dungeon-tiles/<set>.json.
// ──────────────────────────────────────────────
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const shared = await import(pathToFileURL(join(ROOT, "packages/shared/dist/index.js")).href);
const sharp = createRequire(join(ROOT, "packages/server/package.json"))("sharp");
const { DUNGEON_SETS, WORLD_ART_FAMILIES, parseTilePack } = shared;

const [source, ...rest] = process.argv.slice(2);
if (!source) {
  console.error("Usage: node scripts/art/pack-builtin-art.mjs <art-review dir> [--only id,id]");
  process.exit(1);
}
const onlyAt = rest.indexOf("--only");
const only = onlyAt >= 0 ? new Set((rest[onlyAt + 1] ?? "").split(",").filter(Boolean)) : null;

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
const PNG = "data:image/png;base64,";

async function cleanSheets(pack) {
  const sheets = [];
  for (const sheet of pack.sheets) {
    const input = Buffer.from(sheet.png.slice(PNG.length), "base64");
    const output = await sharp(input).ensureAlpha().png({ compressionLevel: 9 }).toBuffer();
    sheets.push({ ...sheet, png: `${PNG}${output.toString("base64")}` });
  }
  return sheets;
}

/** The pack under its built-in id and name, its version first (the library tells image packs apart by it). */
async function builtIn(file, id, name, family) {
  const pack = JSON.parse(readFileSync(file, "utf8"));
  const { tilePackVersion, sheets, tiles, characters } = pack;
  const out = {
    tilePackVersion,
    id,
    name,
    family,
    version: 1,
    tileSize: pack.tileSize,
    sheets: await cleanSheets(pack),
    tiles,
  };
  if (characters?.length) out.characters = characters;
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

const overworld = join(ROOT, "packages/server/src/assets/overworld-tiles");
for (const family of WORLD_ART_FAMILIES) {
  if (only && !only.has(family)) continue;
  const file = join(source, "packs-2026-10-05", `pack-${FAMILY_FILES[family] ?? family}.json`);
  if (!existsSync(file)) throw new Error(`No pack for ${family} at ${file}`);
  write(overworld, family, await builtIn(file, family, FAMILY_NAMES[family], family));
}
const dungeons = join(ROOT, "packages/server/src/assets/dungeon-tiles");
for (const set of DUNGEON_SETS) {
  if (only && !only.has(set.id)) continue;
  const file = join(source, "dungeons-2026-10-05", `pack-${set.id}.json`);
  if (!existsSync(file)) throw new Error(`No pack for the ${set.id} set at ${file}`);
  write(dungeons, set.id, await builtIn(file, set.id, set.label, "dungeon"));
}
