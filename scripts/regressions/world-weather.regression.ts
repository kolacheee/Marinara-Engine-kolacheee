/**
 * Weather from the world's climate (user, 2026-11-13: "is weather reflected realistically in desert regions").
 *
 *   - The climate is read from the map where the party stands: on the Earth seed a hot desert at Cairo,
 *     a mediterranean Rome, an oceanic London, a continental Moscow, a monsoon Mumbai.
 *   - Over a year: Cairo never snows and rarely rains, Moscow's winter snows, London's winter mostly
 *     rains, Rome's summer is dry, Mumbai's wet season is wet and its dry season dry.
 *   - The south has its summer in the north's winter, and the tropics have wet and dry seasons.
 *   - The weather drifts rather than flickering, and places a cell apart share their sky.
 *   - A weather asked for that the place cannot have now becomes the nearest it can.
 *   - A game with no map still reads its old biome, and the same inputs give the same weather.
 *   - The Game Master can hold a place (and everything inside it) at a weather, season or light whatever
 *     the climate: a cursed desert snows, a city is always night. Read from the replies, let go the same way.
 */
import assert from "node:assert/strict";
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
  worldClimateOfBiome,
  environmentHeldCells,
  environmentHeldPlaces,
  environmentHoldAt,
  environmentHoldNote,
  readEnvironmentHolds,
  worldDrawnSeason,
  worldWeatherAt,
  worldWeatherFit,
  worldWeatherNote,
  type GameWorld,
  type WorldClimate,
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
const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === "high_fantasy")!);
assert.ok(parsed.ok);
const kit = parsed.kit;
const emptyBrief = worldBriefSchema.parse({ briefVersion: 1, premise: "A quiet year.", places: [] });

function earthWorld(lon: number, lat: number): GameWorld {
  const brief = withWorldEarth(emptyBrief, sampleWorldEarth(data, { lon, lat, scale: kit.scale }));
  const inputs = { kit, seed: 7, grounding: "expand" as const, brief };
  return { ...inputs, world: compileGameWorld(inputs) };
}
/** The land cell nearest the map's middle (the sampled place). */
function middle(game: GameWorld) {
  const { width, height } = game.world;
  const [cx, cy] = [Math.floor(width / 2), Math.floor(height / 2)];
  let best = cy * width + cx;
  let far = Infinity;
  for (let cell = 0; cell < width * height; cell++) {
    const id = game.world.terrain[parseInt(game.world.ground[cell]!, 36)];
    if (game.kit.terrain?.find((entry) => entry.id === id)?.kind === "water") continue;
    const d = Math.hypot((cell % width) - cx, Math.floor(cell / width) - cy);
    if (d < far) [far, best] = [d, cell];
  }
  return best;
}
const WET = new Set(["rain", "heavy_rain", "storm", "snow", "blizzard", "hail"]);
/** A year of weather, four reads a day, counted by the calendar's season. */
function year(climate: WorldClimate, seed = 7) {
  const out: Record<
    string,
    { n: number; wet: number; snow: number; rain: number; temps: number[]; labels: Set<string> }
  > = {};
  for (let day = 1; day <= 360; day++)
    for (const hour of [3, 9, 15, 21]) {
      const w = worldWeatherAt({ seed, climate, day, hour });
      const calendar = ["spring", "summer", "autumn", "winter"][Math.floor((day - 1) / 90)]!;
      const s = (out[calendar] ??= { n: 0, wet: 0, snow: 0, rain: 0, temps: [], labels: new Set() });
      s.n++;
      if (WET.has(w.type)) s.wet++;
      if (w.type === "snow" || w.type === "blizzard") s.snow++;
      if (w.type === "rain" || w.type === "heavy_rain" || w.type === "storm") s.rain++;
      s.temps.push(w.temperature);
      s.labels.add(w.seasonLabel);
    }
  return out;
}
const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

// ── Climates from the map ──
const places = {
  cairo: earthWorld(31.2, 30.0),
  rome: earthWorld(12.5, 41.9),
  london: earthWorld(-0.1, 51.5),
  moscow: earthWorld(37.6, 55.75),
  mumbai: earthWorld(72.8, 19.0),
  sydney: earthWorld(151.2, -33.9),
};
const climates = Object.fromEntries(
  Object.entries(places).map(([name, game]) => [name, worldClimateAt(game, middle(game))]),
) as Record<keyof typeof places, WorldClimate>;
assert.equal(climates.cairo.zone, "hot_desert");
assert.ok(climates.cairo.sandy, "Cairo has sand to blow");
assert.equal(climates.rome.zone, "mediterranean");
assert.equal(climates.london.zone, "oceanic");
assert.equal(climates.moscow.zone, "continental");
assert.equal(climates.mumbai.zone, "savanna", "a monsoon coast: wet and dry seasons");
assert.ok(climates.sydney.latitude! < 0, "Sydney is south of the equator");
assert.ok(places.cairo.brief.earth?.seaKm, "an Earth sample keeps how far the sea is");

// ── A year of weather ──
const cairo = year(climates.cairo);
for (const [season, s] of Object.entries(cairo)) {
  assert.equal(s.snow, 0, `no snow in Cairo in ${season}`);
  assert.ok(s.wet / s.n < 0.08, `Cairo is dry in ${season}: ${s.wet}/${s.n}`);
}
const moscow = year(climates.moscow);
assert.ok(moscow.winter!.snow / moscow.winter!.n > 0.1, "Moscow's winter snows");
assert.equal(moscow.summer!.snow, 0, "and its summer does not");
assert.ok(mean(moscow.winter!.temps) < -3 && mean(moscow.summer!.temps) > 12, "cold winters, warm summers");
const london = year(climates.london);
assert.ok(london.winter!.rain > london.winter!.snow, "London's winter mostly rains");
const rome = year(climates.rome);
assert.ok(rome.summer!.wet * 3 < rome.winter!.wet, "Rome's summers are dry and its winters wet");
const mumbai = year(climates.mumbai);
assert.ok(mumbai.summer!.labels.has("wet season") && mumbai.winter!.labels.has("dry season"));
assert.ok(mumbai.summer!.wet > mumbai.winter!.wet * 5, "the monsoon brings the rain");
const sydney = year(climates.sydney);
assert.ok(mean(sydney.winter!.temps) > mean(sydney.summer!.temps) + 4, "the south's summer is the north's winter");
assert.equal(worldDrawnSeason(places.sydney, 300), "summer", "and the overworld draws it so");
assert.equal(worldDrawnSeason(places.mumbai, 300), "summer", "the tropics are never drawn in winter");

// ── Drift, not flicker; neighbours share a sky ──
{
  const game = places.london;
  const cell = middle(game);
  let changes = 0;
  let agree = 0;
  let hours = 0;
  let previous: string | null = null;
  const neighbour = worldClimateAt(game, cell + 1);
  for (let day = 1; day <= 60; day++)
    for (let hour = 0; hour < 24; hour++) {
      const here = worldWeatherAt({ seed: 7, climate: climates.london, day, hour }).type;
      if (previous !== null && previous !== here) changes++;
      if (worldWeatherAt({ seed: 7, climate: neighbour, day, hour }).type === here) agree++;
      previous = here;
      hours++;
    }
  assert.ok(changes / hours < 0.3, `the weather holds a while: ${changes} changes in ${hours} hours`);
  assert.ok(agree / hours > 0.8, `the next cell over has the same sky: ${agree}/${hours}`);
}

// ── Asking for a weather ──
{
  const midsummerNoon = (climate: WorldClimate) => ({ seed: 7, climate, day: 135, hour: 13 });
  const midwinter = (climate: WorldClimate) => ({ seed: 7, climate, day: 315, hour: 8 });
  const snowInCairo = worldWeatherFit(midsummerNoon(climates.cairo), "snow");
  assert.notEqual(snowInCairo.type, "snow", "no snow in a hot desert's summer");
  assert.equal(snowInCairo.asked, "snow");
  assert.ok(snowInCairo.impossible.includes("snow"));
  assert.equal(worldWeatherFit(midsummerNoon(climates.cairo), "storm").type, "storm", "a rare desert storm can");
  assert.equal(worldWeatherFit(midsummerNoon(climates.cairo), "sandstorm").type, "sandstorm");
  assert.equal(worldWeatherFit(midsummerNoon(climates.london), "sandstorm").type, "wind", "no sandstorm in London");
  const snowInMoscow = worldWeatherFit(midwinter(climates.moscow), "snow");
  assert.equal(snowInMoscow.type, "snow");
  assert.ok(snowInMoscow.temperature <= 1, "falling snow is cold");
  assert.ok(
    ["storm", "heavy_rain", "rain"].includes(worldWeatherFit(midsummerNoon(climates.mumbai), "blizzard").type),
    "a blizzard asked for in the tropics is a downpour",
  );
  assert.equal(worldWeatherFit(midsummerNoon(climates.london), "heat_wave").type, "heat_wave", "London can bake");
  assert.notEqual(
    worldWeatherFit(midwinter(climates.moscow), "heat_wave").type,
    "heat_wave",
    "but Moscow's winter can't",
  );
  assert.match(worldWeatherNote(snowInCairo), /^Climate here: hot desert, summer\. Not possible here now: .*snow/);
}

// ── Games without a map, and determinism ──
{
  const desert = worldClimateOfBiome("desert");
  const desertYear = year(desert, 99);
  for (const s of Object.values(desertYear)) assert.equal(s.snow, 0, "an old desert game never snows either");
  const input = { seed: 3, climate: climates.london, day: 47, hour: 17.5 };
  assert.deepEqual(worldWeatherAt(input), worldWeatherAt(input), "the same every time");
  const underground = worldWeatherAt({ ...input, climate: worldClimateOfBiome("underground") });
  assert.equal(underground.type, "clear");
}

// ── Holds the Game Master puts on a place ──
{
  const holds = readEnvironmentHolds([
    'The Court seals the city. [environment: place="Gotham" light="dark" weather="rain" note="the Court\'s long night"]',
    'The year turns no further. [environment: place="Sallowmarch" season="autumn"]',
    '[environment: place="Ashby" weather="snow"] And later: [environment: place="Ashby" release]',
    '[environment: place="Gotham" weather="none"]',
  ]);
  assert.deepEqual(
    holds.map((hold) => [hold.place, hold.weather, hold.season, hold.light]),
    [
      ["Gotham", undefined, undefined, "dark"],
      ["Sallowmarch", undefined, "autumn", undefined],
    ],
    "set, let go part by part, and released",
  );
  const here = environmentHoldAt(holds, null, null, "Gotham, the Narrows");
  assert.equal(here.light, "dark", "a game with no map reads the place from the location");
  assert.match(environmentHoldNote(here), /Held here \(Gotham\), by the Court's long night: it is always night/);
  assert.equal(environmentHoldAt(holds, null, null, "Metropolis").light, undefined, "elsewhere is not held");

  // On a world: a place and every place inside it, the nearest hold deciding; "world" holds everything.
  const drawn = { kit, seed: 3, grounding: "expand" as const, brief: emptyBrief };
  const game: GameWorld = { ...drawn, world: compileGameWorld(drawn) };
  const settlements = game.world.places.filter((place) => place.rank !== undefined && place.parentId);
  const town = settlements[0]!;
  const region = game.world.places.find((place) => place.id === town.parentId)!;
  const other = settlements.find((place) => place.parentId !== region.id && place.id !== region.id)!;
  const onWorld = readEnvironmentHolds([
    `[environment: place="${region.name}" season="winter" weather="blizzard"]`,
    `[environment: place="${town.name}" weather="clear" light="day"]`,
    `[environment: place="world" light="dusk"]`,
  ]);
  const atTown = environmentHoldAt(onWorld, game, town.id);
  assert.deepEqual(
    [atTown.weather, atTown.season, atTown.light],
    ["clear", "winter", "day"],
    "the nearest hold decides",
  );
  const atOther = environmentHoldAt(onWorld, game, other.id);
  assert.deepEqual([atOther.weather, atOther.season, atOther.light], [undefined, undefined, "dusk"]);
  assert.equal(environmentHeldPlaces(onWorld, game, "season")[town.id], "winter", "the town is inside the held region");
  const cells = environmentHeldCells(game, environmentHeldPlaces(onWorld, game, "light"));
  assert.ok(cells && cells.includes("day") && cells.includes("dusk"), "the overworld draws held light by cell");

  // A held weather beats the climate: snow in a summer desert, under a curse.
  const cursed = worldWeatherFit({ seed: 7, climate: worldClimateOfBiome("desert"), day: 135, hour: 13 }, "snow", true);
  assert.equal(cursed.type, "snow");
  assert.ok(cursed.temperature <= 1, "and it is cold enough for it");
}

console.log("world-weather regression passed");
