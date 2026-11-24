// Lab: settlements' chronicles and their people's fates across starter kits and seeds.
import assert from "node:assert/strict";
import {
  WORLD_STARTER_KITS,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldCast,
  worldChronicleLine,
  worldPersonSheet,
  worldTownChronicle,
  type GameWorld,
  type WorldKit,
} from "../../packages/shared/src/index.js";

function rivalWorld(kit: WorldKit, seed: number): GameWorld {
  const kinds = kit.groupKinds.map((kind) => kind.id);
  const plain = checkWorldBrief(kit, { briefVersion: 1, premise: "x" });
  assert.ok(plain.ok);
  const layout = compileGameWorld({ kit, seed, grounding: "expand", brief: plain.brief });
  const big = layout.places.filter((place) => place.rank !== undefined).sort((a, b) => b.rank! - a.rank!);
  const checked = checkWorldBrief(kit, {
    briefVersion: 1,
    premise: "x",
    peopleNames: kit.cultures.map((culture) => ({
      culture: culture.id,
      given: [
        "Hal",
        "Marta",
        "Odo",
        "Agnes",
        "Wat",
        "Isolde",
        "Piers",
        "Joan",
        "Rolf",
        "Edith",
        "Hugh",
        "Mabel",
        "Ralf",
        "Cecily",
        "Gib",
        "Alys",
      ],
      family: ["Ashby", "Thorne", "Miller", "Webb", "Fenn", "Crowe", "Hale", "Brook"],
    })),
    places: big.slice(0, 4).map((place) => ({ name: place.name, layer: place.layer })),
    groups: [0, 1, 2, 3].map((index) => ({
      name: `Group ${index}`,
      kind: kinds[index % kinds.length],
      seat: big[index % big.length]!.name,
      rivals: index ? [`Group ${index - 1}`] : [],
    })),
  });
  assert.ok(checked.ok);
  const inputs = { kit, seed, grounding: "expand" as const, brief: checked.brief };
  return { ...inputs, world: compileGameWorld(inputs) };
}
const only = process.argv[2];
let towns = 0,
  felt = 0,
  people = 0,
  successors = 0;
const rel: Record<string, number> = {};
for (const input of WORLD_STARTER_KITS) {
  const parsed = parseWorldKit(input);
  assert.ok(parsed.ok);
  if (only && parsed.kit.id !== only) continue;
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const game = rivalWorld(parsed.kit, seed);
    for (const place of game.world.places.filter((each) => each.rank !== undefined)) {
      towns++;
      const c = worldTownChronicle(game, place.id)!;
      const line = worldChronicleLine(c);
      if (line) felt++;
      const cast = worldCast(game, place.id);
      people += cast.length;
      for (const p of cast)
        if (p.succeeds) {
          successors++;
          rel[p.succeeds.relation] = (rel[p.succeeds.relation] ?? 0) + 1;
        }
      if (process.env.SHOW && line && (c.empty > 0.05 || c.refugees > 0))
        console.log(
          `\n${parsed.kit.id}/${seed} ${place.name}: ${JSON.stringify({ lost: c.lost, men: c.menLost, empty: c.empty, ruined: c.ruined, ref: c.refugees, camp: c.camp })}\n  ${line}\n${cast
            .filter((p) => p.succeeds)
            .map((p) => `  - ${p.name}: ${worldPersonSheet(game.kit, p)}`)
            .join("\n")}`,
        );
    }
  }
}
console.log({ towns, felt, people, successors, rel });
