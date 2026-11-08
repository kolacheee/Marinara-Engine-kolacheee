/**
 * The Earth seed (worldgen): a world made from the real Earth over an area.
 *
 *   - The area is found from the real places the brief names (the start in the middle), or a named area.
 *   - Sampled at the scale's map size and kept with the brief, it fits the brief's schema and limits.
 *   - The compile lays the real coast, rivers and cities in their real countries, the same every time,
 *     and a world of another scale than the sample's is not on Earth.
 *   - The Game Master is told it is the real Earth, and no invented past is given for it.
 *   - In a year of the past: the cities that stood then, by the records, under their names of the year
 *     (Constantinople, Edo, Bianjing) and in the realms that held them; towns the records do not count
 *     only from the year 1000, and small; a city silent in the records for centuries small in between.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gunzipSync, inflateSync } from "node:zlib";

import {
  WORLD_EARTH_AREAS,
  WORLD_STARTER_KITS,
  checkWorldBrief,
  compileGameWorld,
  compileWorld,
  parseWorldKit,
  sampleWorldEarth,
  withWorldEarth,
  worldBriefSchema,
  worldEarthCentre,
  worldEarthCitiesIn,
  worldEarthDecode,
  worldEarthHistoricalPlace,
  worldEarthPeopleIn,
  worldEarthTownStood,
  worldHistory,
  worldEarthLocate,
  worldEarthNames,
  worldOverviewPromptText,
  type GameWorld,
  type WorldBrief,
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
{
  const raw = readFileSync(new URL("earth-polities.bin", dir));
  const length = raw.readUInt32LE(0);
  data.history = {
    ...JSON.parse(gunzipSync(readFileSync(new URL("earth-history.json.gz", dir))).toString("utf8")),
    polities: {
      ...JSON.parse(gunzipSync(raw.subarray(4, 4 + length)).toString("utf8")),
      masks: new Uint8Array(raw.subarray(4 + length)),
      inflate: (bytes: Uint8Array) => new Uint8Array(inflateSync(bytes)),
    },
  };
}
assert.equal(data.grid.planes.length, 3600 * 1800 * 3);
assert.equal(data.coast!.bits.length, (18000 * 9000) / 4);

const kitOf = (id: string) => {
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === id)!);
  assert.ok(parsed.ok);
  return parsed.kit;
};
const emptyBrief = (places: WorldBrief["places"] = []): WorldBrief =>
  worldBriefSchema.parse({ briefVersion: 1, premise: "A quiet year.", places });

// ── Where ──
const fantasy = kitOf("high_fantasy");
const settlement = fantasy.layers.find((layer) => layer.settlements)!.id;
const places = worldBriefSchema.parse({
  briefVersion: 1,
  premise: "x",
  places: [
    { name: "London", layer: settlement, start: true },
    { name: "York", layer: settlement },
    { name: "Hollowmere", layer: settlement, note: "A village the setting invents" },
  ],
}).places;
const found = worldEarthLocate(data, fantasy.scale, worldEarthNames({ places }));
assert.ok(found, "London and York are found");
assert.ok(
  Math.abs(found!.lon - -0.6) < 1.2 && found!.lat > 51.4 && found!.lat < 53,
  `around London: ${JSON.stringify(found)}`,
);
assert.equal(
  worldEarthLocate(data, fantasy.scale, [{ name: "Nowhere-in-particular" }]),
  null,
  "an invented place is not",
);
assert.ok(worldEarthLocate(data, fantasy.scale, [{ name: "Japan" }]), "a country is found");
assert.ok(WORLD_EARTH_AREAS.length >= 30);

// ── The sample ──
const earth = sampleWorldEarth(data, { ...found!, scale: fantasy.scale });
const brief = withWorldEarth(emptyBrief(places), earth);
const checked = checkWorldBrief(fantasy, brief);
assert.ok(checked.ok, "an Earth brief is a brief");
assert.equal(worldEarthDecode(earth.ground)!.length, 64 * 44 * 3, "a realm's map, three planes");
assert.ok(earth.ground.length < 60000);
assert.ok(earth.cities.some((city) => city.name === "London" && city.capital));
assert.ok(
  earth.rivers.some((river) => river.name === "Thames"),
  "the Thames",
);
assert.deepEqual(sampleWorldEarth(data, { ...found!, scale: fantasy.scale }), earth, "the same area samples the same");
assert.equal(withWorldEarth(brief, null).earth, undefined);

// ── The world ──
const inputs = { kit: fantasy, seed: 11, grounding: "expand" as const, brief: checked.ok ? checked.brief : brief };
const world = compileGameWorld(inputs);
assert.deepEqual(compileWorld({ seed: 11, kit: fantasy, brief: inputs.brief }), world, "the same every time");
const settlementsDepth = fantasy.layers.findIndex((layer) => layer.settlements);
const london = world.places.find((place) => place.name === "London")!;
assert.ok(london && london.depth === settlementsDepth && london.named, "the brief's London is the real one");
assert.equal(world.startId, london.id, "the party starts there");
const sizes = fantasy.sizes.map((size) => size.id);
assert.ok(london.rank! >= sizes.length - 2, `London is among the biggest: ${london.size}`);
const kindAt = (x: number, y: number) =>
  fantasy.terrain!.find((entry) => entry.id === world.terrain[parseInt(world.ground[y * world.width + x]!, 36)])!.kind;
assert.equal(kindAt(london.at.x, london.at.y), "open");
const parentOf = (id: string | null) => world.places.find((place) => place.id === id);
let top = london;
while (top.parentId) top = parentOf(top.parentId)!;
assert.equal(top.name, "United Kingdom", "in its real country");
assert.ok(
  world.places.some((place) => place.name === "Ireland" && place.depth === 0),
  "and Ireland beside it",
);
assert.ok(
  world.places.some((place) => place.name === "Hollowmere" && place.depth === settlementsDepth),
  "an invented village too",
);
const water = [...world.ground].filter((c) => world.terrain[parseInt(c, 36)] === "sea").length;
assert.ok(water > world.ground.length * 0.25 && water < world.ground.length * 0.7, `the seas round Britain: ${water}`);
// The Irish Sea lies between Dublin and Liverpool.
const dublin = world.places.find((place) => place.name === "Dublin")!;
const liverpool = world.places.find((place) => place.name === "Liverpool")!;
assert.ok(dublin && liverpool && dublin.at.x < liverpool.at.x);
let sea = 0;
for (let step = 1; step < 20; step++) {
  const x = Math.round(dublin.at.x + ((liverpool.at.x - dublin.at.x) * step) / 20);
  const y = Math.round(dublin.at.y + ((liverpool.at.y - dublin.at.y) * step) / 20);
  if (kindAt(x, y) === "water") sea++;
}
assert.ok(sea >= 10, `the Irish Sea: ${sea} of 19`);
assert.ok((world.rivers ?? []).length >= 3, "real rivers");

// Another scale than the sample's is not on Earth.
const regionKit = { ...fantasy, scale: "region" as const };
const notEarth = compileWorld({ seed: 11, kit: regionKit, brief: inputs.brief });
assert.ok(!notEarth.places.some((place) => place.name === "Ireland"));

// ── A town ──
const modern = kitOf("modern_day");
const tokyo = worldEarthCentre(data, "town", 139.7, 35.7);
const town = sampleWorldEarth(data, { ...tokyo, scale: "town", area: "Tokyo" });
const townBrief = withWorldEarth(emptyBrief(), town);
const townWorld = compileWorld({ seed: 3, kit: modern, brief: townBrief });
assert.ok(
  townWorld.places.some((place) => place.name === "Tokyo"),
  "Tokyo at the middle of its map",
);
const townGround = [...townWorld.ground].map((c) => townWorld.terrain[parseInt(c, 36)]!);
assert.ok(townGround.filter((id) => id === "suburbs").length > townGround.length * 0.4, "and Tokyo is most of it");
assert.ok(townGround.includes("coast"), "with its bay");

// ── The Game Master ──
const game: GameWorld = { ...inputs, world };
const overview = worldOverviewPromptText(game);
assert.ok(overview.includes("This is the real Earth"), overview);
assert.ok(!overview.includes("- The past:"), "no invented past");
const past = worldHistory(game);
assert.deepEqual([past.events, past.leaders, past.lost], [[], {}, []], "no invented events, rulers or lost towns");

// ── A year of the past ──
const history = data.history!;
const near = (lon: number, lat: number) => (x: number, y: number) => Math.abs(x - lon) < 1 && Math.abs(y - lat) < 1;
const cityIn = (lon: number, lat: number, year: number) =>
  worldEarthCitiesIn(history, data.features.cities, year, near(lon, lat));
const constantinople = cityIn(29, 41, 1000)[0]!;
assert.equal(constantinople.name, "Constantinople");
assert.equal(constantinople.country, "Byzantine Empire");
assert.ok(constantinople.pop > 200000 && constantinople.capital, `the great city of its time: ${constantinople.pop}`);
assert.equal(cityIn(139.7, 35.7, 1700)[0]!.name, "Edo");
assert.equal(cityIn(139.7, 35.7, 1700)[0]!.country, "Tokugawa Shogunate");
const song = cityIn(114.3, 34.8, 1100);
assert.equal(song[0]!.name, "Bianjing", "Kaifeng under its Song name, the biggest");
const zhengzhou = song.find((city) => city.name === "Zhengzhou");
assert.ok(zhengzhou && zhengzhou.pop <= 10000, `Zhengzhou, unrecorded since the Shang, small: ${zhengzhou?.pop}`);
assert.ok(!song.some((city) => city.name === "Yin"), "the Shang capital long gone");
const england = cityIn(-0.1, 51.5, 1300);
assert.equal(england[0]!.name, "London");
assert.equal(england[0]!.country, "Kingdom of England");
assert.ok(england[0]!.pop > 20000 && england[0]!.pop < 120000, `London in 1300: ${england[0]!.pop}`);
assert.ok(
  england.slice(1).every((city) => city.pop <= 1500),
  "the towns the records do not count are small",
);
assert.equal(cityIn(-6.2, 53.3, 1300)[0]!.country, "Kingdom of England", "Dublin English, not Norse, in 1300");
assert.ok(!worldEarthTownStood(-0.7, 51.5, 117) && worldEarthTownStood(-0.7, 51.5, 1300));
assert.ok(!worldEarthTownStood(-74, 40.7, 1650) && worldEarthTownStood(-74, 40.7, 1750), "the Americas as settled");
const rome = cityIn(12.5, 41.9, 117);
assert.ok(
  rome.length &&
    rome.every(
      (city) =>
        history.cities.some((dated) => dated.name === city.name || dated.alt?.includes(city.name)) ||
        city.name === "Rome",
    ),
  "only the dated cities of antiquity",
);
assert.equal(rome[0]!.country, "Roman Empire");
assert.equal(
  worldEarthPeopleIn(
    [
      [-1400, 32000],
      [-1360, 32000],
      [1975, 1271000],
    ],
    1100,
  ),
  10000,
);
assert.equal(worldEarthPeopleIn([[1300, 25000]], 1600), 0, "a city without today's gone after its records");
const istanbul = worldEarthHistoricalPlace(history, data.features.cities, "Constantinople", (text) =>
  text.toLowerCase(),
);
assert.ok(istanbul && Math.abs(istanbul.lon - 29) < 0.5, "an old name is found");

// A realm in 1300: the sample's cities in their realms of the year, and the world's countries those.
const medieval = sampleWorldEarth(data, { ...found!, scale: fantasy.scale, year: 1300 });
assert.equal(medieval.year, 1300);
assert.ok(!medieval.cities.some((city) => city.name === "Liverpool" && city.pop > 5000));
const medievalBrief = withWorldEarth(emptyBrief(places), medieval);
const medievalWorld = compileWorld({ seed: 11, kit: fantasy, brief: medievalBrief });
let realm = medievalWorld.places.find((place) => place.name === "London")!;
while (realm.parentId) {
  const parentId = realm.parentId;
  realm = medievalWorld.places.find((place) => place.id === parentId)!;
}
assert.equal(realm.name, "Kingdom of England", "London in its realm of 1300");
assert.ok(
  medievalWorld.places.some((place) => place.name === "Kingdom of France" && place.depth === 0),
  "and France over the Channel",
);
assert.ok(!medievalWorld.places.some((place) => place.name === "United Kingdom"), "no United Kingdom in 1300");
console.log("world-earth: ok");
