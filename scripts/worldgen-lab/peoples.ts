/**
 * Peoples lab: prints the non-human peoples generator 9 gives each starter kit. Not a regression; run with
 *   packages/server/node_modules/.bin/tsx scripts/worldgen-lab/peoples.ts [seeds]
 */
import {
  WORLD_STARTER_KITS,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
  worldPeoples,
  worldPeopleLines,
  type GameWorld,
} from "../../packages/shared/src/index.js";

const seeds = Number(process.argv[2] ?? 4);
for (const input of WORLD_STARTER_KITS) {
  const parsed = parseWorldKit(input);
  if (!parsed.ok) continue;
  for (let s = 0; s < seeds; s++) {
    const seed = 101 + s * 977;
    const kit = parsed.kit;
    const layer = kit.layers.find((each) => each.settlements)!.id;
    const checked = checkWorldBrief(kit, {
      briefVersion: 1,
      premise: "x",
      places: ["Ashby", "Wending", "Calder"].map((name) => ({ name, layer, tags: [] })),
      groups: [],
      placeNames: [
        {
          culture: kit.cultures[0]!.id,
          names: ["Ashby", "Wending", "Calder", "Ravel", "Brennock", "Sallow", "Dunmere", "Orrin", "Tamsk", "Vell"],
        },
      ],
    });
    if (!checked.ok) throw new Error(`brief ${kit.id}`);
    const inputs = { kit, seed, grounding: "expand" as const, brief: checked.brief, generatorVersion: 9 };
    const game: GameWorld = { ...inputs, world: compileGameWorld(inputs) };
    const peoples = worldPeoples(kit, game.world);
    if (!peoples.length) continue;
    console.log(`\n## ${kit.id} (${kit.family}, ${kit.scale}) seed ${seed}`);
    if (process.env.STATS) {
      for (const p of peoples) console.log("STAT", p.archetype, p.temper);
      continue;
    }
    for (const people of peoples) console.log(worldPeopleLines(people, true, peoples).join("\n"));
  }
}
