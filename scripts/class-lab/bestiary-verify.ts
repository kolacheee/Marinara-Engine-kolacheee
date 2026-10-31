/**
 * Bestiary verification: builds random encounters with the bestiary's own builder for every setting,
 * level and difficulty, fights them against the reference parties, and reports how each difficulty
 * plays (win rate, party HP lost, the worst encounters) and which families' foes land the biggest
 * plain hits.
 *
 *   node scripts/class-lab/bestiary-verify.ts <out.md> [encountersPerCell] [fightsPerParty]
 */
import { writeFileSync } from "node:fs";
import {
  MARINARA_BESTIARY_SETTINGS,
  MARINARA_DIFFICULTY_BUDGET,
  marinaraBuildEncounter,
  marinaraCheckEncounter,
  marinaraEnemySpec,
  type MarinaraEncounterDifficulty,
  type MarinaraEncounterFoe,
} from "../../packages/shared/src/features/marinara-bestiary.js";
import { marinaraRandom } from "../../packages/shared/src/features/marinara-classes.js";
import { runFight } from "./combat.js";
import { enemyUnit, referenceParty, REFERENCE_PARTIES } from "./bestiary-units.js";

export const VERIFY_LEVELS = [2, 6, 10, 14, 18, 22, 26, 30];
const DIFFICULTIES = Object.keys(MARINARA_DIFFICULTY_BUDGET) as MarinaraEncounterDifficulty[];

export interface EncounterResult {
  setting: string;
  level: number;
  difficulty: MarinaraEncounterDifficulty;
  foes: MarinaraEncounterFoe[];
  threat: number;
  wins: number;
  lost: number;
  downed: number;
  maxHit: number;
  maxHitFamily: string;
}

export function playEncounter(
  setting: string,
  level: number,
  foes: MarinaraEncounterFoe[],
  fightsPerParty: number,
  key: string,
) {
  let wins = 0;
  let lost = 0;
  let downed = 0;
  let maxHit = 0;
  let maxHitFamily = "";
  let total = 0;
  for (const name of Object.keys(REFERENCE_PARTIES))
    for (let i = 0; i < fightsPerParty; i++) {
      const party = referenceParty(name, level, `v${i}`);
      const units = foes.map((foe, j) =>
        enemyUnit(marinaraEnemySpec({ ...foe, setting: setting as never, id: `e${j}` })),
      );
      const log = runFight(party, units, {
        random: marinaraRandom(`verify:${key}:${name}:${i}`),
        grouped: true,
        focus: true,
        maxActions: 1000,
      });
      total++;
      if (log.winner === "party") wins++;
      lost += log.winner === "party" ? log.partyHpLostPct : 1;
      downed += log.downed.length;
      if ((log.maxHitPct ?? 0) > maxHit) {
        maxHit = log.maxHitPct ?? 0;
        const index = Number((log.maxHitBy ?? "e0").slice(1));
        maxHitFamily = `${foes[index]?.familyId}:${foes[index]?.tier}`;
      }
    }
  return { wins: wins / total, lost: lost / total, downed: downed / total, maxHit, maxHitFamily };
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

function quantile(values: number[], q: number) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
}

export function verify(perCell: number, fights: number): { report: string; results: EncounterResult[] } {
  const results: EncounterResult[] = [];
  for (const setting of MARINARA_BESTIARY_SETTINGS)
    for (const level of VERIFY_LEVELS)
      for (const difficulty of DIFFICULTIES)
        for (let e = 0; e < perCell; e++) {
          const random = marinaraRandom(`build:${setting}:${level}:${difficulty}:${e}`);
          const boss = difficulty !== "easy" && level >= 5 && e % 4 === 3;
          const built = marinaraBuildEncounter({ setting, party: { level, size: 4 }, difficulty, random, boss });
          if (!built.foes.length) continue;
          const check = marinaraCheckEncounter({ setting, party: { level, size: 4 }, foes: built.foes });
          if (check.problems.length) console.error(`builder made a bad fight: ${check.problems.join("; ")}`);
          const played = playEncounter(setting, level, built.foes, fights, `${setting}:${level}:${difficulty}:${e}`);
          results.push({ setting, level, difficulty, foes: built.foes, threat: built.threat, ...played });
        }
  const lines: string[] = [];
  lines.push("| Difficulty | Encounters | Wins (mean) | Wins (worst 10%) | HP lost (mean) | Allies down per fight | Foes per fight |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const difficulty of DIFFICULTIES) {
    const rows = results.filter((r) => r.difficulty === difficulty);
    const mean = (f: (r: EncounterResult) => number) => rows.reduce((s, r) => s + f(r), 0) / Math.max(1, rows.length);
    lines.push(
      `| ${difficulty} | ${rows.length} | ${pct(mean((r) => r.wins))} | ${pct(quantile(rows.map((r) => r.wins), 0.1))} | ${pct(mean((r) => r.lost))} | ${mean((r) => r.downed).toFixed(2)} | ${mean((r) => r.foes.length).toFixed(1)} |`,
    );
  }
  lines.push("", "By level (Normal / Hard / Deadly wins, mean):", "");
  lines.push("| Level | Easy | Normal | Hard | Deadly |", "| --- | --- | --- | --- | --- |");
  for (const level of VERIFY_LEVELS) {
    const cell = (d: MarinaraEncounterDifficulty) => {
      const rows = results.filter((r) => r.level === level && r.difficulty === d);
      const wins = rows.reduce((s, r) => s + r.wins, 0) / Math.max(1, rows.length);
      const lost = rows.reduce((s, r) => s + r.lost, 0) / Math.max(1, rows.length);
      return `${pct(wins)} (${pct(lost)} lost)`;
    };
    lines.push(`| ${level} | ${cell("easy")} | ${cell("normal")} | ${cell("hard")} | ${cell("deadly")} |`);
  }
  lines.push("", "By setting (Normal and Hard wins, mean):", "");
  lines.push("| Setting | Normal | Hard |", "| --- | --- | --- |");
  for (const setting of MARINARA_BESTIARY_SETTINGS) {
    const cell = (d: MarinaraEncounterDifficulty) => {
      const rows = results.filter((r) => r.setting === setting && r.difficulty === d);
      return pct(rows.reduce((s, r) => s + r.wins, 0) / Math.max(1, rows.length));
    };
    lines.push(`| ${setting} | ${cell("normal")} | ${cell("hard")} |`);
  }
  // Families in the encounters that went worst for their difficulty, and the biggest plain hits.
  const blame: Record<string, { n: number; over: number }> = {};
  const target: Record<MarinaraEncounterDifficulty, number> = { easy: 0.15, normal: 0.3, hard: 0.5, deadly: 0.7 };
  for (const r of results)
    for (const id of new Set(r.foes.map((f) => f.familyId))) {
      const entry = (blame[id] ??= { n: 0, over: 0 });
      entry.n++;
      entry.over += r.lost - target[r.difficulty];
    }
  lines.push("", "Family drift (mean party HP lost above (+) or below (−) the difficulty's mark, in encounters it was in):", "");
  lines.push("| Family | Encounters | Drift |", "| --- | --- | --- |");
  for (const [id, entry] of Object.entries(blame).sort((a, b) => b[1].over / b[1].n - a[1].over / a[1].n))
    lines.push(`| ${id} | ${entry.n} | ${entry.over / entry.n >= 0 ? "+" : ""}${Math.round((entry.over / entry.n) * 100)} |`);
  const hits = [...results].sort((a, b) => b.maxHit - a.maxHit).slice(0, 15);
  lines.push("", "Biggest plain (non-crit) hits on one party member, share of their max HP:", "");
  lines.push("| Hit | By | Level | Difficulty |", "| --- | --- | --- | --- |");
  for (const r of hits) lines.push(`| ${pct(r.maxHit)} | ${r.maxHitFamily} | ${r.level} | ${r.difficulty} |`);
  return { report: lines.join("\n"), results };
}

if (process.argv[1]?.endsWith("bestiary-verify.ts")) {
  const out = process.argv[2]!;
  const { report, results } = verify(Number(process.argv[3] ?? 4), Number(process.argv[4] ?? 3));
  writeFileSync(out, `${report}\n`);
  writeFileSync(`${out}.json`, JSON.stringify(results));
  console.log(report);
}
