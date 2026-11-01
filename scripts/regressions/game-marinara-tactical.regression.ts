/**
 * Classic Marinara on a Tactical board (2026-11-01): the board moves units and says who is in reach,
 * the shared math resolves what they do, each fighter's turn ticks its own statuses and stamina, units
 * take their archetype's reach, and a fight plays out to an end.
 */
import assert from "node:assert/strict";
import {
  commandCombatDirector,
  createCombatDirector,
  type CombatDirectorState,
} from "../../packages/server/src/services/game/combat-director.service.js";
import {
  marinaraCombatant,
  performMarinaraTacticalAction,
} from "../../packages/server/src/services/game/marinara-director.service.js";
import {
  awardMarinaraXp,
  createMarinaraProgression,
  marinaraRandom,
  type MarinaraArchetype,
  type MarinaraPartyTemperament,
} from "../../packages/shared/src/features/marinara-classes.js";
import { buildMarinaraEnemy, buildMarinaraPartyFighter } from "../../packages/shared/src/features/marinara-combat.js";
import { decideTacticalAction } from "../../packages/shared/src/features/tactical-combat/index.js";
import type { TacticalUnit } from "../../packages/shared/src/features/tactical-combat/types.js";

function hero(id: string, primary: MarinaraArchetype, temperament: MarinaraPartyTemperament, level: number) {
  let progression = createMarinaraProgression({ seed: `tt:${id}`, primary, temperament });
  if (level > 1)
    progression = awardMarinaraXp(progression, (level - 1) * 100, marinaraRandom(`tt:${id}:xp`)).progression;
  return buildMarinaraPartyFighter({ id, name: id, progression });
}

function fight(seed: number): CombatDirectorState {
  const party = [
    hero("ana", "blade", "reckless", 5),
    hero("bo", "guard", "protective", 5),
    hero("cy", "marksman", "patient", 5),
    hero("di", "mender", "supportive", 5),
  ];
  const foes = (["blade", "scout", "channeler"] as const).map((archetype, i) =>
    buildMarinaraEnemy({ id: `foe${i}`, name: `Foe ${i}`, archetype, level: 5, tier: "standard" }),
  );
  return createCombatDirector({
    id: `tac${seed}`,
    anchor: "anchor",
    party: party.map((f) => marinaraCombatant(f)),
    enemies: foes.map((f) => marinaraCombatant(f)),
    style: "tactical",
    difficulty: "normal",
    seed,
    battlefield: { size: "small" } as never,
    marinara: [...party, ...foes],
  });
}

function playOut(s: CombatDirectorState) {
  for (let step = 0; step < 3000 && !s.outcome; step++) {
    if (s.stage === "action" && s.actorId) {
      const unit = s.tactical!.units.find((u) => u.id === s.actorId) as TacticalUnit;
      commandCombatDirector(s, { type: "tactical", action: decideTacticalAction(s.tactical!, unit) as never });
    } else if (s.window) commandCombatDirector(s, { type: "fallback" }, "fallback");
    else if (s.stage === "select") {
      const next = s.tactical!.units.find((u) => u.side === "party" && u.hp > 0 && !u.hasActed);
      commandCombatDirector(s, next ? { type: "begin", unitId: next.id } : { type: "continue" });
    } else commandCombatDirector(s, { type: "continue" });
  }
  return s;
}

const s = fight(5);
assert.ok(s.tactical && s.marinara, "a Tactical fight keeps its Classic Marinara fighters");
const archer = s.tactical!.units.find((u) => u.id === "cy")!;
assert.equal(archer.attackRange.max, 3, "a Marksman shoots from range on the board");
assert.equal(s.tactical!.units.find((u) => u.id === "bo")!.attackRange.max, 1, "a Guard fights up close");
playOut(s);
assert.ok(s.outcome === "victory" || s.outcome === "defeat", `ended: ${s.outcome}`);
assert.ok(
  s.log.some((line) => line.kind === "marinara:hit"),
  "hits are resolved by the shared math",
);
assert.ok(
  s.log.every((line) => !/undefined|NaN/.test(line.text)),
  "no broken log lines",
);
for (const unit of s.tactical!.units) {
  const fighter = s.marinara!.fighters.find((f) => f.id === unit.id)!;
  assert.equal(unit.hp, Math.max(0, Math.round(fighter.hp)), `${unit.name}'s board HP mirrors the fighter`);
}
const again = playOut(fight(5));
assert.equal(again.outcome, s.outcome, "the same seed plays the same fight");

// A friend's skill aimed loosely (at a foe, or a guard at itself) lands on the friend who needs it
// most, and never fails the turn (playtest 2026-11-01).
{
  const t = fight(7);
  const lines: string[] = [];
  const log = (text: string) => void lines.push(text);
  const ana = t.marinara!.fighters.find((f) => f.id === "ana")!;
  ana.hp = Math.round(ana.maxHp / 3);
  const cover = (targetId: string) =>
    performMarinaraTacticalAction(
      t.marinara!,
      "bo",
      { type: "skill", skillId: "cover", targetId },
      7,
      log as never,
      () => [],
      () => true,
    );
  assert.doesNotThrow(() => cover("foe0"), "a guard aimed at a foe doesn't fail the turn");
  assert.doesNotThrow(() => cover("bo"), "a guard aimed at itself doesn't fail the turn");
  const bo = t.marinara!.fighters.find((f) => f.id === "bo")!;
  assert.notEqual(bo.covering, "bo", "nobody guards themselves");
}

// A stunned party member's turn is taken for it, so the round still moves on.
{
  const t = fight(9);
  const ana = t.marinara!.fighters.find((f) => f.id === "ana")!;
  ana.statuses.push({ status: "stun", turns: 1 } as never);
  playOut(t);
  assert.ok(t.outcome, "a fight with a stunned party member still ends");
}

// Tactical Marinara stops at the same round limit as Classic.
{
  const t = fight(11);
  t.round = 60;
  t.tactical!.round = 60;
  for (const f of t.marinara!.fighters) f.hp = f.maxHp * 50;
  for (const f of t.marinara!.fighters) f.maxHp = f.hp;
  playOut(t);
  assert.equal(t.outcome, "flee", "a fight past the round limit breaks off");
  assert.ok(t.stalled, "and says it stalled");
}

let wins = 0;
for (let seed = 100; seed < 112; seed++) if (playOut(fight(seed)).outcome === "victory") wins++;
console.log(`game-marinara-tactical: ok (party of 4 beat 3 standard foes in ${wins}/12)`);
