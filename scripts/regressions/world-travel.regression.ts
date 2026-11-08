/**
 * Journeys off the map (worldgen): a world keeps more than one map.
 *
 *   - On Earth, a flight from Tokyo to New York opens a map of the real New York, kept with the world; a
 *     place the party's map has, or a real place on its own ground, opens none.
 *   - A place another of the world's maps has takes the party back to it, as it was.
 *   - In a drawn world, a land past an edge opens a map whose ground along the edge it meets runs on from
 *     what the first map showed past it.
 *   - Another map starts its living world from its own ground, not from the first map's fold.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

import {
  WORLD_EARTH_AREAS,
  WORLD_STARTER_KITS,
  gameWorldFromMetadata,
  gameWorldMapHere,
  parseWorldKit,
  sampleWorldEarth,
  worldBeyondGround,
  worldBriefSchema,
  worldEarthCentre,
  worldFold,
  worldOverviewPromptText,
  worldPlaceByName,
  worldPresent,
  worldTravel,
  type WorldEarthData,
} from "../../packages/shared/src/index.js";

const kitOf = (id: string) => {
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === id)!);
  assert.ok(parsed.ok);
  return parsed.kit;
};
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

// ── On Earth: Tokyo to New York ──
{
  const kit = kitOf("modern_day");
  const japan = WORLD_EARTH_AREAS.find((area) => area.id === "japan")!;
  const centre = worldEarthCentre(data, kit.scale, 139.7, 35.7);
  const earth = sampleWorldEarth(data, { ...centre, scale: kit.scale, area: japan.label });
  const brief = worldBriefSchema.parse({ briefVersion: 1, premise: "A quiet year in the city.", earth });
  const meta: Record<string, unknown> = {
    gameWorldKit: kit,
    gameWorld: { seed: 9, generatorVersion: 10, grounding: "expand", brief },
  };
  const tokyo = gameWorldFromMetadata(meta)!;
  assert.ok(tokyo && !tokyo.mapId && worldPlaceByName(tokyo.world, "Tokyo"), "the game starts in Tokyo");
  assert.equal(worldTravel(meta, tokyo, "Tokyo", { earth: data }), null, "a place the map has opens nothing");
  assert.equal(worldTravel(meta, tokyo, "Nowhere-in-particular", { earth: data }), null, "nor one nobody can find");

  const flight = worldTravel(meta, tokyo, "New York", { earth: data })!;
  assert.ok(flight && flight.made && flight.mapId === "map-1", "a flight to New York opens a map there");
  const after = { ...meta, gameWorld: flight.gameWorld };
  assert.equal(gameWorldMapHere(after), "map-1");
  const york = gameWorldFromMetadata(after)!;
  assert.equal(york.mapId, "map-1");
  assert.ok(
    Math.abs(york.brief.earth!.lat - 40.7) < 1 && Math.abs(york.brief.earth!.lon - -74) < 1,
    "the real New York",
  );
  assert.ok(worldPlaceByName(york.world, "New York"), "New York is on it");
  assert.equal(york.world.places.find((place) => place.id === york.world.startId)?.name, "New York");
  assert.deepEqual(gameWorldFromMetadata(after, "home")!.world, tokyo.world, "and the first map is as it was");
  assert.ok(worldOverviewPromptText(york).includes("travelled off the world's first map"));
  assert.ok(worldOverviewPromptText(tokyo).includes('[place: name="New York"]'), "the GM is told how");
  // The same flight again goes to the map it made, and Tokyo goes home.
  assert.equal(worldTravel(after, tokyo, "New York", { earth: data })?.mapId, "map-1");
  const home = worldTravel(after, york, "Tokyo", { earth: data })!;
  assert.ok(home && !home.made && home.mapId === "home");
  assert.equal((home.gameWorld as { here?: string }).here, undefined);
  assert.equal((home.gameWorld as { maps?: unknown[] }).maps?.length, 1, "New York is kept");
  // Another map starts its living world from its own ground, not from the first map's fold.
  const fold = worldFold(tokyo, []);
  assert.deepEqual(worldPresent(york, [{ from: fold }]), worldPresent(york, []));
}

// ── A drawn world: past the north edge ──
{
  const kit = kitOf("high_fantasy");
  const brief = worldBriefSchema.parse({
    briefVersion: 1,
    premise: "A quiet year.",
    placeNames: [{ culture: "x", names: ["Orrin", "Kesh", "Thalor", "Brenn", "Ystra", "Morrow", "Calder"] }],
  });
  const meta: Record<string, unknown> = {
    gameWorldKit: kit,
    gameWorld: { seed: 7, generatorVersion: 10, grounding: "expand", brief },
  };
  const first = gameWorldFromMetadata(meta)!;
  assert.equal(worldTravel(meta, first, "Valdmark"), null, "a land with no side named opens nothing");
  const trip = worldTravel(meta, first, "Valdmark", { beyond: "north" })!;
  assert.ok(trip && trip.made);
  const after = { ...meta, gameWorld: trip.gameWorld };
  const north = gameWorldFromMetadata(after)!;
  assert.equal(north.brief.join?.side, "south");
  assert.ok(worldPlaceByName(north.world, "Valdmark"), "the land named is on it");
  // Its south rows are what the first map showed past its north edge.
  const beyond = worldBeyondGround(first);
  const { width, height } = north.world;
  let same = 0;
  let all = 0;
  for (let row = 0; row < beyond.pad; row++)
    for (let x = 0; x < width; x++) {
      all++;
      const shown = beyond.cells[(beyond.pad - 1 - row) * beyond.width + beyond.pad + x]!;
      const here = parseInt(north.world.ground[(height - 1 - row) * width + x]!, 36);
      if (first.world.terrain[shown] === north.world.terrain[here]) same++;
    }
  assert.ok(same >= all * 0.8, `the land runs on across: ${same} of ${all}`);
  // Past its south edge is the first map itself, from its north edge down.
  const past = worldBeyondGround(north);
  let shown = 0;
  let rows = 0;
  for (let row = 0; row < past.pad; row++)
    for (let x = 0; x < width; x++) {
      rows++;
      const at = past.cells[(past.pad + height + row) * past.width + past.pad + x]!;
      if (north.world.terrain[at] === first.world.terrain[parseInt(first.world.ground[row * width + x]!, 36)]) shown++;
    }
  assert.equal(shown, rows, "the first map shows past the edge it is met by");
  // The new map keeps hand edits of its own; the first map's are not on it.
  {
    const spot = north.world.places.find((place) => place.rank !== undefined)!;
    const tw = after.gameWorld as { maps: Array<Record<string, unknown>> };
    const editedMeta = {
      ...after,
      gameWorld: {
        ...tw,
        maps: tw.maps.map((map) => ({
          ...map,
          edits: { editsVersion: 1, places: [{ id: spot.id, name: "Northwatch" }] },
        })),
      },
    };
    const editedNorth = gameWorldFromMetadata(editedMeta)!;
    assert.equal(editedNorth.world.places.find((place) => place.id === spot.id)?.name, "Northwatch");
    assert.ok(!worldPlaceByName(gameWorldFromMetadata(editedMeta, "home")!.world, "Northwatch"));
  }
  // Back by a place of the first map.
  const town = first.world.places.find(
    (place) => place.rank !== undefined && !worldPlaceByName(north.world, place.name),
  )!;
  assert.ok(town, "the first map has a town the new one has not");
  assert.equal(worldTravel(after, north, town.name)?.mapId, "home");
  assert.equal(worldTravel(after, north, "Valdmark"), null, "the new map has the land it was made for");
}
console.log("world-travel: ok");
