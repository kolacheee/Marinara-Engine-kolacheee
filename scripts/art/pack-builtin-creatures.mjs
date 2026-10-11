#!/usr/bin/env node
// ──────────────────────────────────────────────
// The Engine's own creature art (Pixelforge W1): the approved SRD monster walks and flights as the
// built-in creature pack (creature pack v2, Capability API 1.352), each block its own PNG file so a fight
// loads only the creatures on its board.
//
//   pnpm build:shared && node scripts/art/pack-builtin-creatures.mjs <monsters dir> <stills pack>
//
// <monsters dir> holds index.json (per creature: id, frameCells, walk, fly, variantOf) with walks/<id>.png
// and fly/<id>.png, each three frames across by the four facings down. <stills pack> is the review's
// srd-monsters.creatures.json, which names every creature's bestiary entry, name and size. A creature's
// variantOf looks are its extra looks, in the index's order. Sheets are copied byte for byte (optimise
// them losslessly first, e.g. oxipng -o4).
//
// Writes packages/server/src/assets/creature-art/srd-monsters/: pack.json and the sheets.
// ──────────────────────────────────────────────
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const shared = await import(pathToFileURL(join(ROOT, "packages/shared/dist/index.js")).href);
const sharp = createRequire(join(ROOT, "packages/server/package.json"))("sharp");
const { CREATURE_BUILT_IN_SHEET_PATH, builtInCreaturePackSchema } = shared;

const [source, stillsFile] = process.argv.slice(2);
if (!source || !stillsFile) {
  console.error("Usage: node scripts/art/pack-builtin-creatures.mjs <monsters dir> <stills pack>");
  process.exit(1);
}
const index = JSON.parse(readFileSync(join(source, "index.json"), "utf8"));
const stills = JSON.parse(readFileSync(stillsFile, "utf8"));
const OUT = join(ROOT, "packages/server/src/assets/creature-art/srd-monsters");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const art = new Map(index.creatures.map((entry) => [entry.id, entry]));
const sheets = [];
/** A block's sheet, copied in under its own id. */
async function sheetOf(id, file, cells) {
  const from = join(source, file);
  const { width, height, format } = await sharp(from).metadata();
  const [w, h] = cells;
  if (format !== "png" || width !== 3 * w * index.cellPx || height !== 4 * h * index.cellPx)
    throw new Error(`${file}: ${width} by ${height}, not three frames by four of ${w} by ${h} cells`);
  copyFileSync(from, join(OUT, `${id}.png`));
  sheets.push({ id, png: `${CREATURE_BUILT_IN_SHEET_PATH}${id}.png`, width, height });
  return { sheet: id, x: 0, y: 0 };
}

const creatures = [];
for (const still of stills.creatures) {
  const entry = art.get(still.id);
  if (!entry) throw new Error(`No art for ${still.id}`);
  const looks = [entry, ...index.creatures.filter((other) => other.variantOf === still.id)];
  const [w, h] = entry.frameCells;
  for (const look of looks)
    if (look.frameCells[0] !== w || look.frameCells[1] !== h) throw new Error(`${look.id}: another size`);
  const creature = { id: still.id, match: still.match, size: still.size, w, h, frames: 3, variants: [] };
  for (const look of looks) creature.variants.push(await sheetOf(`${look.id}-walk`, look.walk, look.frameCells));
  const flying = looks.filter((look) => look.fly);
  if (flying.length && flying.length !== looks.length) throw new Error(`${still.id}: only some looks fly`);
  if (flying.length) {
    creature.fly = [];
    for (const look of looks) creature.fly.push(await sheetOf(`${look.id}-fly`, look.fly, look.frameCells));
  }
  creatures.push(creature);
}
const used = new Set(creatures.flatMap((creature) => [creature.id]));
for (const entry of index.creatures)
  if (!used.has(entry.id) && !(entry.variantOf && used.has(entry.variantOf)))
    throw new Error(`${entry.id} is in the art but not in the stills pack`);

const pack = {
  creaturePackVersion: 2,
  id: "srd-monsters",
  name: "SRD monsters",
  version: 1,
  author: "Marinara Engine",
  tileSize: index.cellPx,
  sheets,
  creatures,
};
const read = builtInCreaturePackSchema.safeParse(pack);
if (!read.success) throw new Error(JSON.stringify(read.error.issues.slice(0, 5)));
writeFileSync(join(OUT, "pack.json"), `${JSON.stringify(pack)}\n`);
console.log(
  `${creatures.length} creatures, ${creatures.filter((creature) => creature.fly).length} flying, ${sheets.length} sheets`,
);
