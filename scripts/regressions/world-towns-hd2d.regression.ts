/**
 * HD-2D towns (fork).
 *
 *   - Only fantasy-family games open their settlements as HD-2D towns; the rest keep the 2D town.
 *   - A settlement's town spec is read from the world, the same every time: villages are villages, towns
 *     towns or walled towns, the biggest settlements cities of 5,000 to 40,000; every spec stays inside the
 *     generator's ranges.
 *   - A visit to a building the world never named carries its words and is told by them.
 *   - The party's spot is kept one per settlement, the latest first, at most WORLD_TOWN_HD2D_SPOTS_MAX.
 */
import assert from "node:assert/strict";

import {
  WORLD_STARTER_KITS,
  WORLD_TOWN_HD2D_SPOTS_MAX,
  WORLD_TOWN_SPOT,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldTown,
  worldTownHd2d,
  worldTownHd2dSpec,
  worldTownHd2dSpotsWith,
  worldTownVisitSchema,
  worldTownVisitText,
  type GameWorld,
  type WorldTownHd2dSpot,
} from "../../packages/shared/src/index.js";

const gameOf = (id: string, seed: number): GameWorld => {
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((each) => each.id === id)!);
  assert.ok(parsed.ok);
  const kit = parsed.kit;
  const checked = checkWorldBrief(kit, { briefVersion: 1, premise: "x" });
  assert.ok(checked.ok);
  const inputs = { kit, seed, grounding: "expand" as const, brief: checked.brief };
  return { ...inputs, world: compileGameWorld(inputs) };
};

for (const kit of WORLD_STARTER_KITS) {
  const game = gameOf(kit.id, 41);
  assert.equal(worldTownHd2d(game), kit.family === "fantasy", `${kit.id}: HD-2D towns only for fantasy`);
}

const fantasy = WORLD_STARTER_KITS.filter((kit) => kit.family === "fantasy");
assert.ok(fantasy.length > 0);
let cities = 0;
let villages = 0;
for (const kit of fantasy)
  for (const seed of [41, 42, 43]) {
    const game = gameOf(kit.id, seed);
    const top = Math.max(1, game.kit.sizes.length - 1);
    for (const place of game.world.places.filter((each) => each.rank !== undefined)) {
      const spec = worldTownHd2dSpec(game, place.id)!;
      const label = `${kit.id}/${seed} ${place.name}`;
      assert.deepEqual(worldTownHd2dSpec(game, place.id), spec, `${label}: the same world, the same spec`);
      assert.ok(spec.seed >= 1 && spec.seed <= 99991, label);
      assert.ok([0, 1, 2].includes(spec.rank), label);
      assert.ok(spec.cpop === 0 || (spec.cpop >= 5000 && spec.cpop <= 40000 && spec.rank === 2), label);
      assert.ok(spec.cyear >= 1100 && spec.cyear <= 1600, label);
      if (place.rank! / top < 0.45) assert.ok(spec.rank === 0 && !spec.cpop, `${label}: a small place is a village`);
      if (place.rank! / top >= 0.7) assert.ok(spec.cpop > 0, `${label}: a big place is a city`);
      if (spec.cpop) cities++;
      if (!spec.cpop && spec.rank === 0) villages++;
    }
  }
assert.ok(cities > 0 && villages > 0, "the ladder runs from villages to cities");
assert.equal(worldTownHd2dSpec(gameOf(fantasy[0]!.id, 41), "nowhere"), null);

// ── A spot visit is told by its words ──
const game = gameOf(fantasy[0]!.id, 41);
const settlement = game.world.places.find((each) => each.rank !== undefined)!;
const town = worldTown(game, settlement.id)!;
const visit = worldTownVisitSchema.parse({
  id: "v1",
  settlementId: settlement.id,
  to: WORLD_TOWN_SPOT,
  minutes: 3,
  label: "a goldsmith's shop in St Giles",
});
assert.match(worldTownVisitText(game, town, visit, 12), /walked to a goldsmith's shop in St Giles\./u);
assert.equal(worldTownVisitSchema.safeParse({ ...visit, label: "x".repeat(121) }).success, false);

// ── One spot a settlement, latest first ──
let spots: WorldTownHd2dSpot[] = [];
for (let i = 0; i < WORLD_TOWN_HD2D_SPOTS_MAX + 5; i++)
  spots = worldTownHd2dSpotsWith(spots, { settlementId: `s${i}`, c: 0, x: i, y: 1 });
assert.equal(spots.length, WORLD_TOWN_HD2D_SPOTS_MAX);
spots = worldTownHd2dSpotsWith(spots, { settlementId: "s10", c: 2, x: 5, y: 6 });
assert.equal(spots[0]!.settlementId, "s10");
assert.equal(spots.filter((each) => each.settlementId === "s10").length, 1);

console.log("world-towns-hd2d: ok");
