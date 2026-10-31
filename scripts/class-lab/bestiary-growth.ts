import { MARINARA_BESTIARY } from "../../packages/shared/src/features/marinara-bestiary.js";
import { foes, outcome, NORMAL_HP_LOST } from "./bestiary-lab.js";
const fams = (process.env.FAMILIES ?? "gel,sellsword,hound,shade,adept,warder").split(",");
const levels = [4, 12, 20, 28];
for (const id of fams) {
  const family = MARINARA_BESTIARY.find((f) => f.id === id)!;
  const row: string[] = [];
  for (const level of levels) {
    let lo = Math.log(0.05), hi = Math.log(40);
    for (let s = 0; s < 9; s++) {
      const mid = (lo + hi) / 2;
      const { lost } = outcome(() => foes(family, "standard", level, 3, Math.exp(mid)), level, 4, `g:${id}:${level}`);
      if (lost < NORMAL_HP_LOST) lo = mid; else hi = mid;
    }
    row.push(`L${level} ${(4 / (3 * Math.sqrt(Math.exp((lo + hi) / 2)))).toFixed(2)}`);
  }
  console.log(id.padEnd(10), row.join("  "));
}
