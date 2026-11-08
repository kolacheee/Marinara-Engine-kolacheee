// ──────────────────────────────────────────────
// A journey off the map (owner 2026-11-08: "Does it keep expanding if the player goes outside of bounds?
// How does it handle cases where the user travels long distance, let's say takes a flight from Tokyo to
// New York City"): a world holds more than one map (gameWorldSchema `maps`), all at its scale. When the
// Game Master puts the party at a place no map of the world has, a new map is made there and kept: on
// Earth, the real land round the real place (New York, sampled as the first map was); in a drawn world,
// the land past the edge the party left by, which runs on from the ground that map showed past it. A place
// one of the world's maps already has takes the party back to that map. Run where the Earth data is (the
// server); the maps it makes compile anywhere.
// ──────────────────────────────────────────────
import { checkWorldBrief, type WorldBrief } from "../../schemas/world-brief.schema.js";
import { worldBeyondGround } from "./beyond.js";
import { WORLD_DAYS_PER_CELL, WORLD_GROUND_SIZE, worldStream } from "./compile.js";
import { WORLD_BEYOND_SIDES, WORLD_EARTH_KM_PER_DAY, worldEarthCellDegrees, type WorldBeyondSide } from "./earth.js";
import { sampleWorldEarth, worldEarthCentre, worldEarthLocate, type WorldEarthData } from "./earth-sample.js";
import {
  WORLD_GAME_MAPS_MAX,
  gameWorldFromMetadata,
  gameWorldSchema,
  worldPlaceByName,
  type GameWorld,
  type WorldMapEntry,
} from "./game-world.js";

const OPPOSITE: Record<WorldBeyondSide, WorldBeyondSide> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};
const fold = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export interface WorldTravel {
  /** The game's `gameWorld` with the party on the map it went to (a new one kept in its `maps`). */
  gameWorld: Record<string, unknown>;
  /** The map it is on now: "home" for the first. */
  mapId: string;
  /** A map made for this journey, not one the world had. */
  made: boolean;
}

/**
 * Where a place the Game Master put the party at takes it, when the map it is on does not have it: back to
 * one of the world's maps that has it, or to a new map made there (`beyond` the side of the map it left by,
 * for a drawn world, as the Game Master says it). Null when it stays on this map: a place this map has, a
 * real place on this map's own ground, or one nothing can find.
 */
export function worldTravel(
  metadata: Record<string, unknown>,
  active: GameWorld,
  name: string,
  options: { beyond?: string; earth?: WorldEarthData | null } = {},
): WorldTravel | null {
  const parsed = gameWorldSchema.safeParse(metadata.gameWorld);
  if (!parsed.success || !name.trim()) return null;
  const stored = parsed.data;
  if (worldPlaceByName(active.world, name)) return null;
  const maps = stored.maps ?? [];
  const here = active.mapId ?? "home";
  const going = (mapId: string, added?: WorldMapEntry): WorldTravel => {
    const { here: _here, maps: _maps, ...rest } = stored;
    const all = added ? [...maps, added] : maps;
    return {
      gameWorld: { ...rest, ...(all.length ? { maps: all } : {}), ...(mapId !== "home" ? { here: mapId } : {}) },
      mapId,
      made: !!added,
    };
  };
  // Back to a map the world has, by one of its places or the name it was made for.
  for (const id of ["home", ...maps.map((map) => map.id)]) {
    if (id === here) continue;
    const entry = maps.find((map) => map.id === id);
    if (entry && fold(entry.name) === fold(name)) return going(id);
    const other = gameWorldFromMetadata(metadata, id);
    if (other && worldPlaceByName(other.world, name)) return going(id);
  }
  if (maps.length >= WORLD_GAME_MAPS_MAX) return null;

  const kit = active.kit;
  const settlement = kit.layers.find((layer) => layer.settlements)?.id;
  // The new map's brief: the setting as the first map's (its premise, names, peoples, cultures and faiths),
  // without the places, groups and past that belong to that map's land.
  const base: WorldBrief = {
    ...stored.brief,
    places: [],
    events: [],
    groups: [],
    earth: undefined,
    join: undefined,
  };
  const seed = Math.floor(worldStream(stored.seed, "map", maps.length + 1, fold(name))() * 0xffffffff);
  const id = `map-${maps.length + 1}`;
  const make = (brief: WorldBrief) => {
    const checked = checkWorldBrief(kit, brief);
    return checked.ok ? going(id, { id, name: name.trim().slice(0, 80), seed, brief: checked.brief }) : null;
  };

  // On Earth: the real place, when it is off this map's ground.
  const earth = active.brief.earth;
  if (earth) {
    if (!options.earth || kit.scale === "sector") return null;
    const found = worldEarthLocate(options.earth, kit.scale, [{ name, start: true }]);
    if (!found) return null;
    const [width, height] = WORLD_GROUND_SIZE[kit.scale];
    const degrees = worldEarthCellDegrees(WORLD_DAYS_PER_CELL[kit.scale] * WORLD_EARTH_KM_PER_DAY, earth.lat);
    let dlon = found.lon - earth.lon;
    if (dlon > 180) dlon -= 360;
    if (dlon < -180) dlon += 360;
    if (Math.abs(dlon) < (width / 2) * degrees.lon && Math.abs(found.lat - earth.lat) < (height / 2) * degrees.lat)
      return null;
    const centre = worldEarthCentre(options.earth, kit.scale, found.lon, found.lat);
    const sample = sampleWorldEarth(options.earth, {
      ...centre,
      scale: kit.scale,
      area: name.trim().slice(0, 120),
      ...(earth.year !== undefined ? { year: earth.year } : {}),
    });
    // The place itself where it is a real city there, so the party starts in it.
    const city = sample.cities.find((each) => fold(each.name) === fold(name));
    return make({
      ...base,
      places: city && settlement ? [{ name: city.name, layer: settlement, tags: [], start: true }] : [],
      earth: sample,
    });
  }

  // A drawn world: past the edge the Game Master names, the land that map showed there running on.
  const side = WORLD_BEYOND_SIDES.find((each) => each === options.beyond?.trim().toLowerCase());
  if (!side || !settlement) return null;
  const beyond = worldBeyondGround(active);
  const { pad, width: outerWidth } = beyond;
  const { width, height } = active.world;
  const along = side === "north" || side === "south" ? width : height;
  let ground = "";
  for (let row = 0; row < pad; row++)
    for (let at = 0; at < along; at++) {
      const [x, y] =
        side === "north"
          ? [pad + at, pad - 1 - row]
          : side === "south"
            ? [pad + at, pad + height + row]
            : side === "west"
              ? [pad - 1 - row, pad + at]
              : [pad + width + row, pad + at];
      ground += beyond.cells[y * outerWidth + x]!.toString(36);
    }
  return make({
    ...base,
    places: [{ name: name.trim().slice(0, 80), layer: settlement, tags: [], start: true }],
    join: { side: OPPOSITE[side], ground },
  });
}
