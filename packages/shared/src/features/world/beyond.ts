// ──────────────────────────────────────────────
// The land past the map's edge (owner 2026-11-07: "new land past the map edge is important"): the map's
// ground with WORLD_BEYOND_PAD cells more on every side, for the Overworld to draw round the map (never
// walked), so the world does not end in one repeated tile. Its own cells are the map's; out there the
// land runs on: a sea, a range or a forest at the edge goes on past it, and the rivers that leave the map
// run on too. No places, ways or worked ground out there (fields, suburbs, cities and ruins stand only where
// the map's own towns are). On Earth (the Earth seed) it is the real land, sampled with the map. Each side
// is the sea or a land, named for the Game Master: the real countries there on Earth, else names the
// brief's name lists hold that no place took. The same every time.
// ──────────────────────────────────────────────
import type { WorldBeyondLand } from "../../schemas/world-brief.schema.js";
import {
  WORLD_DAYS_PER_CELL,
  worldCultivatedTerrain,
  worldStream,
  worldTerrainEntries,
  worldUrbanTerrain,
  worldValueNoise,
  worldWetness,
} from "./compile.js";
import {
  WORLD_BEYOND_PAD,
  WORLD_BEYOND_SIDES,
  WORLD_EARTH_KM_PER_DAY,
  worldEarthFields,
  worldEarthGround,
  type WorldBeyondSide,
} from "./earth.js";
import type { GameWorld } from "./game-world.js";
import type { WorldRiver } from "./land.js";

export interface WorldBeyond {
  pad: number;
  /** The larger grid: the map's width and height and the pad on both sides. */
  width: number;
  height: number;
  /** The ground class of each cell of the larger grid, row by row, indexed as the map's own (its terrain);
   *  the map's own cells are its ground. */
  cells: Uint8Array;
  /** The rivers out there, as cells of the larger grid, each joined to the map's river it runs on from. */
  rivers: WorldRiver[];
  /** A seed of its own, for what is drawn out there (props, trees, fades) to stay put. */
  seed: number;
  /** Each side: the sea, or the lands there, the biggest first. */
  lands: WorldBeyondLand[];
}

const cache = new Map<string, WorldBeyond>();
const CACHE_SIZE = 8;

/** The land past the map's edge, round the map; see the top of this file. */
export function worldBeyondGround(game: GameWorld, pad = WORLD_BEYOND_PAD): WorldBeyond {
  const { world, brief } = game;
  const key = JSON.stringify([
    world.seed,
    world.width,
    world.height,
    world.ground,
    world.terrain,
    pad,
    brief.earth?.lon,
    brief.earth?.lat,
    brief.earth?.year,
    brief.earth?.beyond?.ground.length,
    brief.placeNames,
    world.places.map((place) => place.name),
    (world.rivers ?? []).map((river) => [river.path[0], river.path.at(-1)]),
  ]);
  const hit = cache.get(key);
  if (hit) return hit;
  const beyond = makeBeyond(game, pad);
  cache.set(key, beyond);
  if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value!);
  return beyond;
}

function makeBeyond(game: GameWorld, pad: number): WorldBeyond {
  const { world, kit, brief } = game;
  const { width, height } = world;
  const [outerWidth, outerHeight] = [width + pad * 2, height + pad * 2];
  const count = outerWidth * outerHeight;
  const own = Uint8Array.from(world.ground, (cell) => parseInt(cell, 36));
  const entries = world.terrain.map(
    (id) => worldTerrainEntries(kit).find((entry) => entry.id === id) ?? { id, kind: "open" as const, share: 0 },
  );
  const isWater = (index: number) => entries[index]?.kind === "water";
  // Wild ground: what the land is where nobody works or builds it.
  const wild = (index: number) => {
    const entry = entries[index];
    return (
      !!entry &&
      !(
        entry.kind === "open" &&
        (worldCultivatedTerrain(entry) || worldUrbanTerrain(entry) || /ruin|rubble/.test(entry.id))
      )
    );
  };
  const seed = worldStream(world.seed, "beyond", "seed")() * 2 ** 31;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height;

  // ── The ground out there ──
  const cells = new Uint8Array(count);
  const earth = brief.earth?.beyond && brief.earth.beyond.pad === pad ? brief.earth : null;
  const earthGround = earth
    ? (() => {
        const kmPerCell = WORLD_DAYS_PER_CELL[kit.scale] * WORLD_EARTH_KM_PER_DAY;
        const fields = worldEarthFields({ ...earth, ground: earth.beyond!.ground }, outerWidth, outerHeight, kmPerCell);
        if (!fields) return null;
        const terrain = worldTerrainEntries(kit);
        const laid = worldEarthGround(
          terrain,
          fields,
          outerWidth,
          outerHeight,
          worldWetness,
          (entry) => !!worldCultivatedTerrain(entry) || !!worldUrbanTerrain(entry),
          worldValueNoise(world.seed, "earth-beyond", outerWidth, outerHeight),
          kmPerCell,
        );
        // The kit's classes as the map indexes them.
        const indexOf = terrain.map((entry) => world.terrain.indexOf(entry.id));
        return Uint8Array.from(laid.kinds, (kind) => Math.max(0, indexOf[kind] ?? 0));
      })()
    : null;
  const warpX = worldValueNoise(seed, "beyond-x", outerWidth, outerHeight);
  const warpY = worldValueNoise(seed, "beyond-y", outerWidth, outerHeight);
  // Mirrored back over the edge, so what meets it runs on, bent by the noise more the further out it is
  // so the mirror does not show.
  const reflect = (value: number, size: number) => {
    let v = Math.round(value);
    if (v < 0) v = -v - 1;
    if (v >= size) v = 2 * size - 1 - v;
    return Math.max(0, Math.min(size - 1, v));
  };
  // Worked and built ground runs on past the edge where the map's edge is built or worked, the further the
  // more of that edge it is (a town map in a great city is city all round; a ring of fields the edge cuts
  // ends a step or two past it); elsewhere out there it is the wild ground most common round it.
  const builtShare = new Map<WorldBeyondSide, number>();
  for (const side of WORLD_BEYOND_SIDES) {
    const edge =
      side === "north" || side === "south"
        ? Array.from({ length: width }, (_, x) => own[(side === "north" ? 0 : height - 1) * width + x]!)
        : Array.from({ length: height }, (_, y) => own[y * width + (side === "west" ? 0 : width - 1)]!);
    builtShare.set(side, edge.filter((index) => !wild(index)).length / edge.length);
  }
  const fade = worldValueNoise(seed, "beyond-fade", outerWidth, outerHeight);
  const ranOn = new Uint8Array(count);
  for (let Y = 0; Y < outerHeight; Y++)
    for (let X = 0; X < outerWidth; X++) {
      const cell = Y * outerWidth + X;
      const [x, y] = [X - pad, Y - pad];
      if (inside(x, y)) {
        cells[cell] = own[y * width + x]!;
        continue;
      }
      const out = Math.max(-x, x - (width - 1), -y, y - (height - 1));
      const bend = Math.min(1, out / 3) * Math.min(8, Math.max(3, Math.min(width, height) / 6));
      const sx = reflect(x + (warpX[cell]! - 0.5) * 2 * bend, width);
      const sy = reflect(y + (warpY[cell]! - 0.5) * 2 * bend, height);
      const mirrored = own[sy * width + sx]!;
      const ground = earthGround ? earthGround[cell]! : mirrored;
      const side: WorldBeyondSide = y < 0 ? "north" : y >= height ? "south" : x < 0 ? "west" : "east";
      const reach = 1.5 + builtShare.get(side)! * pad * 1.6;
      if (!wild(mirrored) && !isWater(ground) && out <= reach * (0.6 + fade[cell]! * 0.8)) {
        cells[cell] = mirrored;
        ranOn[cell] = 1;
      } else cells[cell] = ground;
    }
  const counts = new Map<number, number>();
  for (const index of own) if (wild(index) && !isWater(index)) counts.set(index, (counts.get(index) ?? 0) + 1);
  const commonest = [...counts].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0];
  if (commonest !== undefined)
    for (let cell = 0; cell < count; cell++) {
      const [x, y] = [(cell % outerWidth) - pad, Math.floor(cell / outerWidth) - pad];
      if (inside(x, y) || ranOn[cell] || wild(cells[cell]!)) continue;
      const near = new Map<number, number>();
      for (let dy = -3; dy <= 3; dy++)
        for (let dx = -3; dx <= 3; dx++) {
          const [nx, ny] = [x + dx + pad, y + dy + pad];
          if (nx < 0 || ny < 0 || nx >= outerWidth || ny >= outerHeight) continue;
          const other = cells[ny * outerWidth + nx]!;
          if (wild(other) && !isWater(other)) near.set(other, (near.get(other) ?? 0) + 1);
        }
      cells[cell] = [...near].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? commonest;
    }

  // ── The rivers out there ──
  const rivers: WorldRiver[] = [];
  const toOuter = (inner: number) => (Math.floor(inner / width) + pad) * outerWidth + (inner % width) + pad;
  if (earth) {
    for (const river of earth.beyond!.rivers)
      rivers.push({ path: [...river.path], width: river.path.map(() => river.width) });
  } else {
    const random = worldStream(world.seed, "beyond", "rivers");
    for (const river of world.rivers ?? []) {
      // A river that ends on the edge (not in the sea) flows out past it; one that rises on it flows in.
      for (const end of ["mouth", "source"] as const) {
        const at = end === "mouth" ? river.path[river.path.length - 1]! : river.path[0]!;
        const [x, y] = [at % width, Math.floor(at / width)];
        if (x > 0 && y > 0 && x < width - 1 && y < height - 1) continue;
        if (isWater(own[at]!)) continue;
        const [dx, dy] = x === 0 ? [-1, 0] : x === width - 1 ? [1, 0] : y === 0 ? [0, -1] : [0, 1];
        const size = end === "mouth" ? river.width[river.width.length - 1]! : river.width[0]!;
        const path = [toOuter(at)];
        let [cx, cy] = [x + pad, y + pad];
        for (let step = 0; step < pad + 2; step++) {
          // Mostly straight out, now and then a step aside.
          const aside = random();
          const [sx, sy] = aside < 0.2 ? [dy, dx] : aside < 0.4 ? [-dy, -dx] : [dx, dy];
          const [nx, ny] = [cx + sx, cy + sy];
          if (nx < 0 || ny < 0 || nx >= outerWidth || ny >= outerHeight) break;
          if (inside(nx - pad, ny - pad)) continue;
          [cx, cy] = [nx, ny];
          path.push(cy * outerWidth + cx);
          if (isWater(cells[cy * outerWidth + cx]!)) break;
        }
        if (path.length < 2) continue;
        if (end === "source") path.reverse();
        rivers.push({ path, width: path.map(() => size) });
      }
    }
  }

  // ── Each side: the sea, or the lands there ──
  const sideOf = (cell: number): WorldBeyondSide => {
    const [x, y] = [(cell % outerWidth) - pad, Math.floor(cell / outerWidth) - pad];
    const past = { west: -x, east: x - (width - 1), north: -y, south: y - (height - 1) };
    return (Object.entries(past) as Array<[WorldBeyondSide, number]>).sort((a, b) => b[1] - a[1])[0]![0];
  };
  let lands: WorldBeyondLand[];
  if (earth) lands = earth.beyond!.lands;
  else {
    const wet = new Map<WorldBeyondSide, number>();
    const all = new Map<WorldBeyondSide, number>();
    for (let cell = 0; cell < count; cell++) {
      const [x, y] = [(cell % outerWidth) - pad, Math.floor(cell / outerWidth) - pad];
      if (inside(x, y)) continue;
      const side = sideOf(cell);
      all.set(side, (all.get(side) ?? 0) + 1);
      if (isWater(cells[cell]!)) wet.set(side, (wet.get(side) ?? 0) + 1);
    }
    // Names the brief's lists hold that no place took, in an order the seed keeps.
    const taken = new Set(world.places.map((place) => place.name.toLowerCase()));
    const random = worldStream(world.seed, "beyond", "names");
    const spare = (brief.placeNames ?? [])
      .flatMap((group) => group.names)
      .filter((name, index, names) => !taken.has(name.toLowerCase()) && names.indexOf(name) === index)
      .map((name) => ({ name, order: random() }))
      .sort((a, b) => a.order - b.order)
      .map((entry) => entry.name);
    lands = WORLD_BEYOND_SIDES.map((side) =>
      (wet.get(side) ?? 0) > (all.get(side) ?? 1) * 0.85
        ? { side, sea: true as const, names: [] }
        : { side, names: spare.length ? [spare.shift()!] : [] },
    );
  }
  return { pad, width: outerWidth, height: outerHeight, cells, rivers, seed: Math.floor(seed), lands };
}

const DIRECTION: Record<WorldBeyondSide, string> = { north: "North", east: "East", south: "South", west: "West" };

/** For the Game Master: what lies past each edge of the map, one line; empty when nothing is known. Each
 *  side the sea, or its lands' names and the ground most of it is (its forests, hills, desert). */
export function worldBeyondText(game: GameWorld): string {
  const beyond = worldBeyondGround(game);
  const { pad, width, height, cells, lands } = beyond;
  const terrain = worldTerrainEntries(game.kit);
  const entryOf = (index: number) => terrain.find((entry) => entry.id === game.world.terrain[index]);
  const parts = lands.map((land) => {
    if (land.sea) return `${DIRECTION[land.side]}: the open sea`;
    const count = new Map<number, number>();
    for (let cell = 0; cell < cells.length; cell++) {
      const [x, y] = [cell % width, Math.floor(cell / width)];
      const side =
        y < pad && y <= Math.min(x, width - 1 - x)
          ? "north"
          : y >= height - pad && height - 1 - y <= Math.min(x, width - 1 - x)
            ? "south"
            : x < pad
              ? "west"
              : x >= width - pad
                ? "east"
                : null;
      if (side === land.side) count.set(cells[cell]!, (count.get(cells[cell]!) ?? 0) + 1);
    }
    const ground = [...count]
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 2)
      .map(([index]) => entryOf(index)?.label?.toLowerCase() ?? game.world.terrain[index]!);
    const names = land.names.length ? land.names.join(", ") : "lands with no name yet";
    return `${DIRECTION[land.side]}: ${names} (${ground.join(", ")})`;
  });
  return `- Past the map's edges (lands the party can hear of or set out for, not on the map): ${parts.join("; ")}.`;
}
