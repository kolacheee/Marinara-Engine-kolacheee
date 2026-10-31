import { marinaraEnemySpec, MARINARA_BESTIARY, type MarinaraEnemyTier } from "../../packages/shared/src/features/marinara-bestiary.js";
import { marinaraRandom } from "../../packages/shared/src/features/marinara-classes.js";
import { runFight } from "./combat.js";
import { enemyUnit, referenceParty } from "./bestiary-units.js";

const fam = process.argv[2] ?? "sellsword";
const tier = (process.argv[3] ?? "standard") as MarinaraEnemyTier;
const N = Number(process.argv[4] ?? 40);
const family = MARINARA_BESTIARY.find((f) => f.id === fam)!;
const setting = Object.keys(family.names)[0] as never;
const t0 = Date.now();
for (const level of [1, 5, 10, 15, 20, 25, 30]) {
  if (level < family.levels[0]) continue;
  const row: string[] = [];
  for (const k of [1, 2, 3, 4, 5, 6]) {
    let wins = 0, lost = 0, rounds = 0;
    for (let i = 0; i < N; i++) {
      const party = referenceParty(["classic", "skirmish", "noHealer"][i % 3]!, level, `${i}`);
      let foes;
      try {
        foes = Array.from({ length: k }, (_, j) => enemyUnit(marinaraEnemySpec({ familyId: fam, setting, level: Math.max(level, family.levels[0]), tier, id: `e${j}` })));
      } catch (e) { row.push("-"); break; }
      const log = runFight(party, foes, { random: marinaraRandom(`probe:${fam}:${level}:${k}:${i}`), grouped: true, focus: true, maxActions: 800 });
      if (log.winner === "party") wins++;
      lost += log.partyHpLostPct; rounds += log.rounds;
    }
    row.push(`${k}:${Math.round((wins / N) * 100)}%/${Math.round((lost / N) * 100)}%/${(rounds / N).toFixed(1)}r`);
  }
  console.log(`L${level} ${row.join("  ")}`);
}
console.error(`${Date.now() - t0} ms`);
