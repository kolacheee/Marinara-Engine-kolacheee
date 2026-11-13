/**
 * Weather lab: the climate and a year of weather at real places on the Earth seed, and across drawn worlds.
 * Run: packages/server/node_modules/.bin/tsx scripts/worldgen-lab/climate.ts
 */
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import {
  WORLD_STARTER_KITS,
  compileGameWorld,
  parseWorldKit,
  sampleWorldEarth,
  withWorldEarth,
  worldBriefSchema,
  worldClimateAt,
  worldWeatherAt,
  worldWeatherFit,
  worldGroundCells,
  worldGroundLooks,
  type GameWorld,
  type WorldEarthData,
} from "../../packages/shared/src/index.js";

const dir = new URL("../../packages/server/src/assets/earth/", import.meta.url);
const data: WorldEarthData = {
  grid: { width: 3600, height: 1800, planes: new Uint8Array(gunzipSync(readFileSync(new URL("earth-grid.bin", dir)))) },
  features: JSON.parse(gunzipSync(readFileSync(new URL("earth-features.json.gz", dir))).toString("utf8")),
  coast: {
    width: 18000,
    height: 9000,
    bits: new Uint8Array(gunzipSync(readFileSync(new URL("earth-coast.bin", dir)))),
  },
};
const kitOf = (id: string) => {
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === id)!);
  if (!parsed.ok) throw new Error(id);
  return parsed.kit;
};
const fantasy = kitOf(process.env.KIT ?? "high_fantasy");
const brief0 = worldBriefSchema.parse({ briefVersion: 1, premise: "A quiet year.", places: [] });

function earthWorld(lon: number, lat: number): GameWorld {
  const earth = sampleWorldEarth(data, { lon, lat, scale: fantasy.scale });
  const brief = withWorldEarth(brief0, earth);
  const inputs = { kit: fantasy, seed: 7, grounding: "expand" as const, brief };
  return { ...inputs, world: compileGameWorld(inputs) };
}

export function year(game: GameWorld, cell: number, seed = game.seed) {
  const climate = worldClimateAt(game, cell);
  const bySeason: Record<string, { n: number; wet: number; snow: number; t: number[]; types: Record<string, number> }> =
    {};
  for (let day = 1; day <= 360; day++)
    for (const hour of [3, 9, 15, 21]) {
      const w = worldWeatherAt({ seed, climate, day, hour });
      const s = (bySeason[w.seasonLabel + "|" + w.season] ??= { n: 0, wet: 0, snow: 0, t: [], types: {} });
      s.n++;
      if (["rain", "heavy_rain", "storm", "snow", "blizzard", "hail"].includes(w.type)) s.wet++;
      if (w.type === "snow" || w.type === "blizzard") s.snow++;
      s.t.push(w.temperature);
      s.types[w.type] = (s.types[w.type] ?? 0) + 1;
    }
  return { climate, bySeason };
}

export function landNearMiddle(game: GameWorld) {
  const { width, height } = game.world;
  const [cx, cy] = [Math.floor(width / 2), Math.floor(height / 2)];
  let best = cy * width + cx;
  let far = Infinity;
  for (let cell = 0; cell < width * height; cell++) {
    const kind = game.kit.terrain?.find(
      (t) => t.id === game.world.terrain[parseInt(game.world.ground[cell]!, 36)],
    )?.kind;
    if (kind === "water") continue;
    const d = Math.hypot((cell % width) - cx, Math.floor(cell / width) - cy);
    if (d < far) [far, best] = [d, cell];
  }
  return best;
}

function show(name: string, game: GameWorld, cell: number) {
  const { climate, bySeason } = year(game, cell);
  console.log(
    `\n${name}: ${climate.zone} lat=${climate.latitude?.toFixed(1)} mean=${climate.meanTemp.toFixed(1)} swing=${climate.swing.toFixed(1)} wet=${climate.wet.toFixed(2)} m=${climate.metres} coast=${climate.coast} sandy=${climate.sandy}`,
  );
  for (const [key, s] of Object.entries(bySeason)) {
    const t = s.t.sort((a, b) => a - b);
    const top = Object.entries(s.types)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => `${k} ${Math.round((v / s.n) * 100)}%`);
    console.log(
      `  ${key.padEnd(22)} wet ${Math.round((s.wet / s.n) * 100)}% snow ${Math.round((s.snow / s.n) * 100)}%  T ${t[0]}..${t[t.length - 1]} med ${t[Math.floor(t.length / 2)]}  ${top.join(", ")}`,
    );
  }
}

const places: Array<[string, number, number]> = [
  ["London", -0.1, 51.5],
  ["Moscow", 37.6, 55.75],
  ["Cairo", 31.2, 30.0],
  ["Sahara (Tamanrasset)", 5.5, 22.8],
  ["Singapore", 103.8, 1.35],
  ["Rome", 12.5, 41.9],
  ["Sydney", 151.2, -33.9],
  ["Mumbai", 72.8, 19.0],
  ["Denver", -105, 39.7],
  ["Reykjavik", -21.9, 64.1],
  ["Yakutsk", 129.7, 62.0],
  ["Buenos Aires", -58.4, -34.6],
  ["Shanghai", 121.5, 31.2],
  ["La Paz", -68.1, -16.5],
];
const only = process.env.ONLY;
const skipEarth = !!process.env.DRAWN;
for (const [name, lon, lat] of places) {
  if (skipEarth || (only && !name.includes(only))) continue;
  const game = earthWorld(lon, lat);
  show(name, game, landNearMiddle(game));
}

if (!only) {
  // Drawn worlds: the zones over all their land, the zones by look, and a GM asking for snow at midsummer noon.
  for (const kitId of ["high_fantasy", "wuxia_xianxia", "the_1920s", "post_apocalyptic", "modern_day"]) {
    const kit = kitOf(kitId);
    for (const seed of [1, 2, 3, 4]) {
      const inputs = { kit, seed, grounding: "expand" as const, brief: brief0 };
      const game: GameWorld = { ...inputs, world: compileGameWorld(inputs) };
      const zones: Record<string, number> = {};
      const byLook: Record<string, Record<string, number>> = {};
      const looks = worldGroundLooks(game);
      const cells = worldGroundCells(game.world);
      for (let cell = 0; cell < cells.length; cell += 2) {
        const look = looks[cells[cell]!]!;
        if (look === "sea" || look === "lake") continue;
        const climate = worldClimateAt(game, cell);
        zones[climate.zone] = (zones[climate.zone] ?? 0) + 1;
        (byLook[look] ??= {})[climate.zone] = (byLook[look]![climate.zone] ?? 0) + 1;
      }
      let snowFits = 0;
      for (const place of game.world.places) {
        const climate = worldClimateAt(game, place.at.y * game.world.width + place.at.x);
        if (worldWeatherFit({ seed, climate, day: 135, hour: 14 }, "snow").type === "snow") snowFits++;
      }
      console.log(
        `${kitId} seed ${seed} (${kit.scale}): ${JSON.stringify(zones)}; snow fits midsummer noon ${snowFits}/${game.world.places.length}`,
      );
      if (process.env.LOOKS) console.log("   ", JSON.stringify(byLook));
    }
  }
}
