/**
 * The land past the map's edge (worldgen): the map's ground with a margin round it, for the Overworld to
 * draw (never walked).
 *
 *   - The map's own cells are its ground; the margin is the same every time.
 *   - Out there the land runs on: no fields or suburbs far past a mostly wild edge, and the rivers that
 *     leave the map run on from where they leave it.
 *   - Each side is the sea or a land, told to the Game Master.
 *   - On Earth it is the real land past the edge, with the real countries there.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

import {
  WORLD_BEYOND_PAD,
  WORLD_EARTH_AREAS,
  WORLD_STARTER_KITS,
  compileWorld,
  parseWorldKit,
  sampleWorldEarth,
  worldBeyondGround,
  worldBriefSchema,
  worldCultivatedTerrain,
  worldEarthCentre,
  worldEarthDecode,
  worldOverviewPromptText,
  type GameWorld,
  type WorldEarthData,
} from "../../packages/shared/src/index.js";

const kitOf = (id: string) => {
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === id)!);
  assert.ok(parsed.ok);
  return parsed.kit;
};
const gameOf = (kitId: string, seed: number, extra: Record<string, unknown> = {}): GameWorld => {
  const kit = kitOf(kitId);
  const brief = worldBriefSchema.parse({
    briefVersion: 1,
    premise: "A quiet year.",
    placeNames: [
      { culture: "x", names: ["Valdmark", "Orrin", "Kesh", "Thalor", "Brenn", "Ystra", "Morrow", "Calder"] },
    ],
    ...extra,
  });
  return { kit, seed, grounding: "expand", brief, world: compileWorld({ seed, kit, brief }) };
};

for (const [kitId, seed] of [
  ["high_fantasy", 7],
  ["wuxia_xianxia", 3],
  ["post_apocalyptic", 11],
  ["the_1920s", 5],
] as const) {
  const game = gameOf(kitId, seed);
  const { world } = game;
  const beyond = worldBeyondGround(game);
  const pad = WORLD_BEYOND_PAD;
  assert.equal(beyond.pad, pad);
  assert.equal(beyond.width, world.width + pad * 2);
  assert.equal(beyond.cells.length, beyond.width * beyond.height);
  for (let y = 0; y < world.height; y++)
    for (let x = 0; x < world.width; x++)
      assert.equal(
        beyond.cells[(y + pad) * beyond.width + x + pad],
        parseInt(world.ground[y * world.width + x]!, 36),
        `${kitId}: the map's own cells`,
      );
  assert.ok(beyond.cells.every((index) => index < world.terrain.length));
  // The same every time, and a world made again draws the same.
  const again = worldBeyondGround({ ...game, world: compileWorld({ seed, kit: game.kit, brief: game.brief }) });
  assert.deepEqual([...again.cells], [...beyond.cells], `${kitId}: the same every time`);
  assert.deepEqual(again.rivers, beyond.rivers);
  // The outermost ring: no fields or suburbs far past the edge of a map whose edge is mostly wild.
  const terrain = world.terrain.map((id) => game.kit.terrain!.find((entry) => entry.id === id)!);
  const worked = (index: number) => !!worldCultivatedTerrain(terrain[index]!);
  const edgeWorked = [...world.ground]
    .map((c, cell) => ({ c, x: cell % world.width, y: Math.floor(cell / world.width) }))
    .filter(({ x, y }) => x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1)
    .filter(({ c }) => worked(parseInt(c, 36))).length;
  if (edgeWorked < (world.width + world.height) * 0.2) {
    let far = 0;
    for (let cell = 0; cell < beyond.cells.length; cell++) {
      const [x, y] = [cell % beyond.width, Math.floor(cell / beyond.width)];
      if (x > 1 && y > 1 && x < beyond.width - 2 && y < beyond.height - 2) continue;
      if (worked(beyond.cells[cell]!)) far++;
    }
    assert.equal(far, 0, `${kitId}: no fields far out`);
  }
  // Rivers out there join a river of the map's where it meets the edge.
  const inner = (cell: number) => {
    const [x, y] = [(cell % beyond.width) - pad, Math.floor(cell / beyond.width) - pad];
    return x >= 0 && y >= 0 && x < world.width && y < world.height;
  };
  const toOuter = (cell: number) => (Math.floor(cell / world.width) + pad) * beyond.width + (cell % world.width) + pad;
  const ends = new Set((world.rivers ?? []).flatMap((river) => [river.path[0]!, river.path.at(-1)!].map(toOuter)));
  for (const river of beyond.rivers) {
    assert.equal(river.path.length, river.width.length);
    const joined = river.path.filter(inner);
    assert.equal(joined.length, 1, `${kitId}: one cell of the map in a river out there`);
    assert.ok(ends.has(joined[0]!), `${kitId}: from a river's end`);
    for (let index = 1; index < river.path.length; index++) {
      const [a, b] = [river.path[index - 1]!, river.path[index]!];
      assert.equal(
        Math.abs((a % beyond.width) - (b % beyond.width)) +
          Math.abs(Math.floor(a / beyond.width) - Math.floor(b / beyond.width)),
        1,
        `${kitId}: an unbroken line`,
      );
    }
  }
  assert.equal(beyond.lands.length, 4);
  const overview = worldOverviewPromptText(game);
  assert.ok(overview.includes("Past the map's edges"), overview);
}
// Some world has a river that leaves the map.
assert.ok(
  [7, 8, 9, 10, 11].some((seed) => worldBeyondGround(gameOf("high_fantasy", seed)).rivers.length > 0),
  "rivers run on past the edge",
);
// Names no place took name the lands; a name a place has is never a land's.
{
  const game = gameOf("high_fantasy", 7, {
    placeNames: [{ culture: "x", names: Array.from({ length: 160 }, (_, index) => `Name${index}`) }],
  });
  const names = worldBeyondGround(game).lands.flatMap((land) => land.names);
  assert.ok(names.length > 0);
  assert.ok(!names.some((name) => game.world.places.some((place) => place.name === name)));
}

// ── On Earth ──
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
const fantasy = kitOf("high_fantasy");
const isles = WORLD_EARTH_AREAS.find((area) => area.id === "british_isles")!;
const earth = sampleWorldEarth(data, {
  ...worldEarthCentre(data, fantasy.scale, isles.lon, isles.lat),
  scale: fantasy.scale,
});
const outer = earth.beyond!;
assert.ok(outer, "an Earth sample keeps the land past its edge");
assert.equal(outer.pad, WORLD_BEYOND_PAD);
assert.equal(worldEarthDecode(outer.ground)!.length, (64 + WORLD_BEYOND_PAD * 2) * (44 + WORLD_BEYOND_PAD * 2) * 3);
// The map's own cells read the same in the larger grid.
{
  const inner = worldEarthDecode(earth.ground)!;
  const big = worldEarthDecode(outer.ground)!;
  const [w, h, W, H] = [64, 44, 64 + WORLD_BEYOND_PAD * 2, 44 + WORLD_BEYOND_PAD * 2];
  let same = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) if (inner[y * w + x] === big[(y + WORLD_BEYOND_PAD) * W + x + WORLD_BEYOND_PAD]) same++;
  assert.ok(same >= w * h * 0.99, `the same land: ${same} of ${w * h}`);
  assert.ok(H > h);
}
const west = outer.lands.find((land) => land.side === "west")!;
assert.ok(west.sea, "the Atlantic west of Ireland");
const south = outer.lands.find((land) => land.side === "south")!;
assert.ok(south.names.includes("France"), `France over the Channel: ${JSON.stringify(outer.lands)}`);
const earthGame = gameOf("high_fantasy", 11, { earth });
const earthBeyond = worldBeyondGround(earthGame);
assert.ok(earthBeyond.rivers.length > 0, "the real rivers out there");
assert.ok(worldOverviewPromptText(earthGame).includes("West: the open sea"));
console.log("world-beyond: ok");
