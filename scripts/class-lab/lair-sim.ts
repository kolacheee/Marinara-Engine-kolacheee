/**
 * Lair fight sim (owner 2026-11-18, "Creature lairs"): each lair kind's maker, alone as a boss in its great
 * chamber as a dungeon's heart sets it, against the reference parties at its level, with the lair acting
 * once a round and without, through the combat director with the Engine's AI on both sides (reasons log on).
 *
 *   tsx scripts/class-lab/lair-sim.ts [fightsPerParty] [kind]
 *   LAIR_DROP=<action id> leaves one lair action out (what each action adds).
 */
import { marinaraEnemySpec, marinaraEnemyFamily } from "../../packages/shared/src/features/marinara-bestiary.js";
import type { MarinaraEvent } from "../../packages/shared/src/features/marinara-combat.js";
import {
  DUNGEON_LAIRS,
  DUNGEON_LAIR_KINDS,
  DUNGEON_LAIR_ACTIONS,
} from "../../packages/shared/src/features/world/lairs.js";
import { enemyFighter, playFight, referenceParty, REFERENCE_PARTIES, seedOf, REASON_LOG } from "./bestiary-units.js";

const fpp = Number(process.argv[2] ?? "2");
const LEVELS = [6, 10, 16];
const only = process.argv[3];
// The director reads the built package's table: drop from that one.
if (process.env.LAIR_DROP) {
  const built = (await import("@marinara-engine/shared")) as unknown as {
    DUNGEON_LAIR_ACTIONS: Record<string, Record<string, unknown>>;
  };
  for (const actions of Object.values(built.DUNGEON_LAIR_ACTIONS)) delete actions[process.env.LAIR_DROP];
}
console.log("reasons log:", REASON_LOG);
for (const kind of DUNGEON_LAIR_KINDS.filter((k) => !only || k === only)) {
  const lairIds = new Set(Object.keys(DUNGEON_LAIR_ACTIONS[kind]).map((id) => `enemy:${id}`));
  for (const level of LEVELS) {
    const maker = DUNGEON_LAIRS[kind].makers.find((id) => {
      const f = marinaraEnemyFamily(id);
      return f && f.tiers.includes("boss") && f.levels[0] <= level && f.levels[1] >= level;
    });
    if (!maker) continue;
    const row: Record<
      string,
      { wins: number; n: number; rounds: number; lost: number; lairDmg: number; lairActs: number }
    > = {};
    for (const withLair of [false, true]) {
      const r = (row[withLair ? "lair" : "none"] = { wins: 0, n: 0, rounds: 0, lost: 0, lairDmg: 0, lairActs: 0 });
      for (const name of Object.keys(REFERENCE_PARTIES))
        for (let i = 0; i < fpp; i++) {
          const boss = enemyFighter(
            marinaraEnemySpec({ familyId: maker, tier: "boss", level, setting: "high_fantasy", id: "e0" }),
          );
          const tap: MarinaraEvent[] = [];
          const fight = playFight(
            referenceParty(name, level, `l${i}`),
            [boss],
            seedOf(`lair:${kind}:${level}:${name}:${i}`),
            `lair ${kind} ${withLair ? "on" : "off"} L${level} ${name}`,
            tap,
            withLair ? { kind, makerId: "e0" } : undefined,
          );
          r.n++;
          if (fight.victory) r.wins++;
          r.rounds += fight.rounds;
          r.lost += fight.lost;
          const lair = tap.filter((ev) => ev.skillId && lairIds.has(ev.skillId));
          r.lairDmg += lair
            .filter((ev) => ev.kind === "hit" || ev.kind === "rider")
            .reduce((s, ev) => s + (ev.amount ?? 0), 0);
          r.lairActs += new Set(lair.map((ev, k) => `${ev.skillId}:${k}`)).size ? lair.length : 0;
        }
    }
    const f = (r: (typeof row)[string]) =>
      `win ${((100 * r.wins) / r.n).toFixed(0)}% rounds ${(r.rounds / r.n).toFixed(1)} lost ${((100 * r.lost) / r.n).toFixed(0)}% lairDmg/fight ${(r.lairDmg / r.n).toFixed(0)} lairEvents/fight ${(r.lairActs / r.n).toFixed(1)}`;
    console.log(`${kind} ${maker} L${level} | none: ${f(row.none!)} | lair: ${f(row.lair!)}`);
  }
}
