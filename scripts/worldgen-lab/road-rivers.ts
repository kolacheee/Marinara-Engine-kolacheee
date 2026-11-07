/**
 * Lab: how long roads run on river cells. Per generator version, the share of river crossings that are one
 * cell, two (a diagonal), or longer, over the starter kits.
 *   packages/server/node_modules/.bin/tsx scripts/worldgen-lab/road-rivers.ts 9 10
 */
import {
  WORLD_STARTER_KITS,
  checkWorldBrief,
  compileGameWorld,
  parseWorldKit,
} from "../../packages/shared/src/index.js";

for (const version of process.argv.slice(2).map(Number)) {
  const runs: number[] = [];
  let roads = 0;
  for (const input of WORLD_STARTER_KITS) {
    const parsed = parseWorldKit(input);
    if (!parsed.ok) continue;
    for (const scale of ["region", "realm"] as const) {
      for (const seed of [11, 4242, 777, 20261002, 31]) {
        const kit = { ...parsed.kit, scale };
        const checked = checkWorldBrief(kit, { briefVersion: 1, premise: "x" });
        if (!checked.ok) continue;
        const world = compileGameWorld({
          kit,
          seed,
          grounding: "expand",
          brief: checked.brief,
          generatorVersion: version,
        });
        const river = new Set((world.rivers ?? []).flatMap((each) => each.path.slice(0, -1)));
        for (const link of world.links) {
          if (!link.path) continue;
          roads++;
          let run = 0;
          for (const cell of [...link.path, -1]) {
            if (river.has(cell)) run++;
            else if (run) (runs.push(run), (run = 0));
          }
        }
      }
    }
  }
  const share = (test: (run: number) => boolean) => (runs.filter(test).length / Math.max(1, runs.length)).toFixed(3);
  console.log(
    `generator ${version}: roads ${roads}, crossings ${runs.length}, one ${share((r) => r === 1)}, two ${share((r) => r === 2)}, longer ${share((r) => r > 2)}, longest ${Math.max(0, ...runs)}`,
  );
}
