// Measures how a foe's worth changes per level it stands above or below the party (MARINARA_LEVEL_GAP_THREAT).
import { MARINARA_BESTIARY, marinaraEnemySpec } from "../../packages/shared/src/features/marinara-bestiary.js";
import { marinaraRandom } from "../../packages/shared/src/features/marinara-classes.js";
import { runFight } from "./combat.js";
import { enemyUnit, referenceParty, REFERENCE_PARTIES } from "./bestiary-units.js";
import { NORMAL_HP_LOST } from "./bestiary-lab.js";

const families = (process.env.FAMILIES ?? "sellsword,hound,adept,gel,shade").split(",");
const ratios: number[] = [];
for (const partyLevel of [6, 14, 22]) {
  for (const id of families) {
    const family = MARINARA_BESTIARY.find((f) => f.id === id)!;
    const setting = Object.keys(family.names)[0] as never;
    const worth: Record<number, number> = {};
    for (const gap of [-3, 0, 3]) {
      const level = partyLevel + gap;
      if (level < family.levels[0]) continue;
      let lo = Math.log(0.05), hi = Math.log(40);
      for (let s = 0; s < 9; s++) {
        const mid = (lo + hi) / 2;
        let lost = 0, n = 0;
        for (const name of Object.keys(REFERENCE_PARTIES))
          for (let i = 0; i < 4; i++) {
            const foes = [0, 1, 2].map((j) => {
              const u = enemyUnit(marinaraEnemySpec({ familyId: id, setting, level, tier: "standard", id: `e${j}` }));
              u.maxHp = u.hp = Math.max(1, Math.round(u.maxHp * Math.exp(mid)));
              return u;
            });
            const log = runFight(referenceParty(name, partyLevel, `${i}`), foes, { random: marinaraRandom(`gap:${id}:${partyLevel}:${gap}:${name}:${i}`), grouped: true, focus: true, maxActions: 800 });
            lost += log.winner === "party" ? log.partyHpLostPct : 1; n++;
          }
        if (lost / n < NORMAL_HP_LOST) lo = mid; else hi = mid;
      }
      worth[gap] = 4 / (3 * Math.sqrt(Math.exp((lo + hi) / 2)));
    }
    const up = worth[3] && worth[0] ? Math.pow(worth[3] / worth[0], 1 / 3) : NaN;
    const down = worth[-3] && worth[0] ? Math.pow(worth[0] / worth[-3], 1 / 3) : NaN;
    if (Number.isFinite(up)) ratios.push(up);
    if (Number.isFinite(down)) ratios.push(down);
    console.log(`party L${partyLevel} ${id}: -3 ${worth[-3]?.toFixed(2)} 0 ${worth[0]?.toFixed(2)} +3 ${worth[3]?.toFixed(2)}  per level up ${up.toFixed(3)} down ${down.toFixed(3)}`);
  }
}
ratios.sort((a, b) => a - b);
console.log(`median per-level factor ${ratios[Math.floor(ratios.length / 2)]!.toFixed(3)}`);
