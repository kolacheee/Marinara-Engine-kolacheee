// ──────────────────────────────────────────────
// The Earth seed (worldgen, owner 2026-11-07: "there will of course be users who want to play in a modern
// real earth setting, and some historical, so to make that reliable we should have an earth seed"). An
// Earth world is an ordinary world whose ground, rivers and towns come from the real Earth over an area
// rather than from the seed: the coast and the lakes as they are, mountains and hills where the land is
// high, the kit's ground laid by the real climate (dry to wet), the real rivers, and the real cities in
// their countries and states. The area is sampled once, at the map's own size, and kept with the brief
// (WorldEarth), so the compile needs no Earth data of its own and runs the same on the server and client.
// ──────────────────────────────────────────────
import type { WorldEarth } from "../../schemas/world-brief.schema.js";
import type { WorldDrainage, WorldLandFields, WorldRiver } from "./land.js";

/** The kilometres a day's walk covers, which sets how much of the Earth a map cell spans. */
export const WORLD_EARTH_KM_PER_DAY = 30;

/** How many cells of land past the map's edge are drawn round it (never walked), on every side. */
export const WORLD_BEYOND_PAD = 12;
export const WORLD_BEYOND_SIDES = ["north", "east", "south", "west"] as const;
export type WorldBeyondSide = (typeof WORLD_BEYOND_SIDES)[number];

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function worldEarthEncode(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const [a, b, c] = [bytes[i]!, bytes[i + 1], bytes[i + 2]];
    const n = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += BASE64[(n >> 18) & 63]! + BASE64[(n >> 12) & 63]!;
    out += b === undefined ? "=" : BASE64[(n >> 6) & 63]!;
    out += c === undefined ? "=" : BASE64[n & 63]!;
  }
  return out;
}

export function worldEarthDecode(text: string): Uint8Array | null {
  const clean = text.replace(/=+$/, "");
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let value = 0;
  let at = 0;
  for (const char of clean) {
    const index = BASE64.indexOf(char);
    if (index < 0) return null;
    value = (value << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[at++] = (value >> bits) & 255;
    }
  }
  return out;
}

/** The degrees one cell of a map spans, at the area's middle (the map is drawn flat: fine for an area a
 *  few thousand kilometres across, and no Earth world is bigger). */
export function worldEarthCellDegrees(kmPerCell: number, lat: number) {
  return {
    lat: kmPerCell / 110.57,
    lon: kmPerCell / (111.32 * Math.max(0.2, Math.cos((lat * Math.PI) / 180))),
  };
}

export interface WorldEarthFields {
  surface: Uint8Array;
  metres: Float64Array;
  dry: Float64Array;
  latitude: Float64Array;
}

/** The area's planes at the map's size, or null when they are not the map's size (a world whose kit has
 *  changed scale since it was sampled is not on Earth any more). */
export function worldEarthFields(earth: WorldEarth, width: number, height: number, kmPerCell: number) {
  const count = width * height;
  const bytes = worldEarthDecode(earth.ground);
  if (!bytes || bytes.length < count * 3) return null;
  const degrees = worldEarthCellDegrees(kmPerCell, earth.lat);
  const latitude = new Float64Array(count);
  for (let cell = 0; cell < count; cell++)
    latitude[cell] = earth.lat + (height / 2 - Math.floor(cell / width) - 0.5) * degrees.lat;
  return {
    surface: bytes.slice(0, count),
    metres: Float64Array.from(bytes.subarray(count, count * 2), (value) => value * 32),
    dry: Float64Array.from(bytes.subarray(count * 2, count * 3), (value) => value / 255),
    latitude,
  } satisfies WorldEarthFields;
}

type Entry = { id: string; kind: string; share: number };

/** Where an open ground class sits from driest to wettest, by the same words the shaped ground uses. */
export type WorldWetness = (id: string) => number;

/**
 * The kit's ground over the real land: sea and lakes where they are; the barrier (mountains) where the land
 * is high or steep, the hills below them, snow on the ice and the high peaks, marsh on wet low ground by the
 * water, and the rest by the real climate, each cell the wild ground class whose place from dry to wet is
 * nearest its dryness. Worked and built-up ground (fields, suburbs, the city) is left to the rings round
 * the settlements, as on any map; ruins keep their share, for the history to lay them.
 */
export function worldEarthGround(
  terrain: Entry[],
  fields: WorldEarthFields,
  width: number,
  height: number,
  wetness: WorldWetness,
  worked: (entry: Entry) => boolean,
  noise: Float64Array,
  kmPerCell: number,
) {
  const count = width * height;
  const { surface, metres, dry, latitude } = fields;
  const kinds = new Uint8Array(count);
  const all = Array.from({ length: count }, (_, cell) => cell);
  const indexed = terrain.map((entry, index) => ({ ...entry, index }));
  const lakeWords = /lake|pond|river|loch|lagoon|canal|toxic/;
  const water = indexed.filter((entry) => entry.kind === "water");
  const sea = water.find((entry) => !lakeWords.test(entry.id)) ?? water[0];
  const lake = water.find((entry) => lakeWords.test(entry.id)) ?? sea;
  const barriers = indexed.filter((entry) => entry.kind === "barrier");
  const open = indexed.filter((entry) => entry.kind === "open");
  const isWater = new Uint8Array(count);
  const isBarrier = new Uint8Array(count);
  const relief = new Float64Array(count);
  for (const cell of all) {
    const [x, y] = [cell % width, Math.floor(cell / width)];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        relief[cell] = Math.max(relief[cell]!, Math.abs(metres[cell]! - metres[ny * width + nx]!));
      }
  }
  const nearWater = (cell: number) => {
    const [x, y] = [cell % width, Math.floor(cell / width)];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && surface[ny * width + nx]! <= 1) return true;
      }
    return false;
  };

  const firstOf = (test: RegExp) => open.filter((entry) => test.test(entry.id));
  const hills = firstOf(/hill|highland|moor|upland/);
  const snow = firstOf(/snow|tundra|\bice\b|glacier|frost/);
  const marsh = firstOf(/marsh|swamp|bog|\bfen|wetland/);
  const ruins = firstOf(/\bruin/);
  const special = new Set([...hills, ...snow, ...marsh, ...ruins]);
  let wild = open.filter((entry) => !special.has(entry) && !worked(entry));
  if (!wild.length) wild = open.filter((entry) => !special.has(entry));
  if (!wild.length) wild = open;
  // Each wild class's dryness, from its place on the dry-to-wet ladder (a desert 0.9, grass 0.46,
  // forest 0.19, jungle 0.02).
  const target = wild
    .map((entry) => ({ entry, dry: 0.9 - wetness(entry.id) * 0.11 }))
    .sort((a, b) => b.dry - a.dry || a.entry.index - b.entry.index);
  // How steep the land must be to read as hills, and as mountains: a cell a few kilometres across rises
  // less across it than one thirty kilometres across.
  const steep = Math.max(120, Math.min(350, kmPerCell * 12));
  const pickBy = <T extends { index: number }>(list: T[], cell: number) =>
    list[Math.min(list.length - 1, Math.floor(noise[cell]! * list.length))]!;

  const landCells: number[] = [];
  for (const cell of all) {
    const kind = surface[cell]!;
    if (kind <= 1 && (kind === 0 ? sea : lake)) {
      kinds[cell] = (kind === 0 ? sea : lake)!.index;
      isWater[cell] = 1;
      continue;
    }
    const high = metres[cell]! >= 2200 || (metres[cell]! >= 1100 && relief[cell]! >= steep * 2);
    if (high && barriers.length) {
      kinds[cell] = pickBy(barriers, cell).index;
      isBarrier[cell] = 1;
      continue;
    }
    if (snow.length && (kind === 3 || metres[cell]! >= 3800 || Math.abs(latitude[cell]!) >= 70)) {
      kinds[cell] = pickBy(snow, cell).index;
      continue;
    }
    if (hills.length && (high || metres[cell]! >= 1000 || (metres[cell]! >= 250 && relief[cell]! >= steep))) {
      kinds[cell] = pickBy(hills, cell).index;
      continue;
    }
    if (marsh.length && metres[cell]! < 60 && dry[cell]! < 0.4 && noise[cell]! > 0.55 && nearWater(cell)) {
      kinds[cell] = pickBy(marsh, cell).index;
      continue;
    }
    landCells.push(cell);
  }
  // The wild ground by the kit's shares over the area's land from dry to wet, as on any map, so a green
  // country is the setting's grass and woods in its proportions; but never a class far from the real
  // climate (no forest in a desert because the kit has a forest share), which takes the nearest instead.
  {
    const wobbled = (cell: number) => dry[cell]! + (noise[cell]! - 0.5) * 0.12;
    const ranked = [...landCells].sort((a, b) => wobbled(b) - wobbled(a) || a - b);
    const total = target.reduce((sum, each) => sum + each.entry.share, 0);
    let start = 0;
    let running = 0;
    target.forEach((each, position) => {
      running += each.entry.share;
      const end = position === target.length - 1 ? ranked.length : Math.round((running / total) * ranked.length);
      for (let at = start; at < end; at++) {
        const cell = ranked[at]!;
        const d = wobbled(cell);
        const near =
          Math.abs(each.dry - d) <= 0.3
            ? each
            : target.reduce((a, b) => (Math.abs(b.dry - d) < Math.abs(a.dry - d) ? b : a));
        kinds[cell] = near.entry.index;
      }
      start = end;
    });
  }
  // Ruins keep their share of the open ground, for the history to lay where the old towns stood.
  if (ruins.length) {
    const openTotal = open.reduce((sum, entry) => sum + entry.share, 0);
    const want = Math.round(
      (ruins.reduce((sum, entry) => sum + entry.share, 0) / Math.max(1e-9, openTotal)) * landCells.length,
    );
    const ranked = [...landCells].sort((a, b) => noise[b]! - noise[a]! || a - b).slice(0, want);
    for (const cell of ranked) kinds[cell] = pickBy(ruins, cell).index;
  }

  const elevation = new Float64Array(count);
  const moisture = new Float64Array(count);
  const uplift = new Float64Array(count);
  for (const cell of all) {
    elevation[cell] = isWater[cell] ? 0 : Math.min(1, 0.05 + metres[cell]! / 5000);
    moisture[cell] = 1 - dry[cell]!;
    uplift[cell] = isBarrier[cell] ? Math.min(1, relief[cell]! / 1500 + 0.3) : 0;
  }
  return { kinds, land: { elevation, moisture, uplift, isWater, isBarrier } };
}

/**
 * The real rivers in place of the rivers run down the ground: each from its source to where it meets the
 * water (a river through a lake goes on from the far shore as its own stretch), the ground's own drainage
 * kept for the resources that read how water gathers (rich soil, falls).
 */
export function worldEarthDrainage(land: WorldLandFields, base: WorldDrainage, earth: WorldEarth): WorldDrainage {
  const count = land.width * land.height;
  const rivers: WorldRiver[] = [];
  const riverAt = new Map<number, number>();
  const confluences = new Set<number>();
  const mouths = new Set<number>();
  const stretches: Array<{ cells: number[]; ending?: number; width: number }> = [];
  for (const river of earth.rivers) {
    let cells: number[] = [];
    for (const cell of river.path) {
      if (cell < 0 || cell >= count) continue;
      if (land.isWater[cell]) {
        if (cells.length) stretches.push({ cells, ending: cell, width: river.width });
        cells = [];
        continue;
      }
      if (cells[cells.length - 1] !== cell) cells.push(cell);
    }
    if (cells.length) stretches.push({ cells, width: river.width });
  }
  // The biggest first, so a smaller river that joins one ends where it meets it.
  stretches.sort((a, b) => b.width - a.width);
  for (const stretch of stretches) {
    const path: number[] = [];
    let ending = stretch.ending;
    for (const cell of stretch.cells) {
      if (riverAt.has(cell)) {
        ending = cell;
        break;
      }
      path.push(cell);
    }
    if (path.length < 2) continue;
    for (const cell of path) riverAt.set(cell, stretch.width);
    if (ending !== undefined) {
      if (land.isWater[ending]) mouths.add(path[path.length - 1]!);
      else confluences.add(ending);
      path.push(ending);
    }
    rivers.push({ path, width: path.map(() => stretch.width) });
  }
  return { down: base.down, flow: base.flow, rivers, riverAt, confluences, mouths };
}

/** A real city's rung on the kit's size ladder, by its people: a few thousand the smallest, a metropolis of
 *  three million the biggest. */
export function worldEarthSizeRank(pop: number, ladder: number) {
  if (ladder <= 1) return 0;
  const step = (Math.log10(Math.max(1, pop)) - 3.5) / 3;
  return Math.max(0, Math.min(ladder - 1, Math.round(step * (ladder - 1))));
}
