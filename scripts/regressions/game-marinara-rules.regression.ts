/**
 * Classic Marinara rules the bestiary leans on (2026-11-01): a charged foe ability goes off on the
 * turn after it is charged and an area one lands on its whole area; a boss shrugs off sleep, stun and
 * confusion and hits harder once below half its HP; a fight's start gives party members progressions
 * from their cards and fits opponents to the encounter budget.
 */
import assert from "node:assert/strict";
import {
  beginMarinaraTurn,
  buildMarinaraEnemy,
  buildMarinaraPartyFighter,
  marinaraHitNumbers,
  performMarinaraOption,
  registerMarinaraEnemySkills,
  releaseMarinaraCharge,
  marinaraOption,
  type MarinaraFightContext,
} from "../../packages/shared/src/features/marinara-combat.js";
import { createMarinaraProgression, marinaraRandom } from "../../packages/shared/src/features/marinara-classes.js";
import { marinaraFightStart } from "../../packages/server/src/services/game/marinara-fight-start.service.js";
import type { Combatant } from "../../packages/shared/src/types/game.js";

const ctx = (): MarinaraFightContext => ({ random: marinaraRandom("rules"), events: [] });
const party = (id: string) =>
  buildMarinaraPartyFighter({
    id,
    name: id,
    progression: createMarinaraProgression({ seed: id, primary: "guard", temperament: "disciplined" }),
  });

// A charged area ability: charged on one turn, lands on every foe when released.
registerMarinaraEnemySkills({
  "test-breath": { kind: "damage", target: "all-enemies", stat: "magic", power: 10, charge: true, label: "Breath" },
});
{
  const drake = buildMarinaraEnemy({
    id: "drake",
    name: "Drake",
    level: 5,
    tier: "elite",
    enemySkills: ["test-breath"],
  });
  const a = party("a"),
    b = party("b");
  const all = [drake, a, b];
  const c = ctx();
  const option = marinaraOption(drake, "enemy:test-breath");
  assert.ok(option, "the charged ability is offered");
  performMarinaraOption(drake, option!, [a], all, c);
  assert.deepEqual(drake.charging, { skillId: "enemy:test-breath", targetId: "a" }, "an enemy ability charges");
  assert.equal(a.hp, a.maxHp, "nothing lands while charging");
  const turn = beginMarinaraTurn(drake, all, c);
  assert.ok(turn.release, "the charge is released on its next turn");
  releaseMarinaraCharge(drake, turn.release!, all, c);
  assert.ok(a.hp < a.maxHp && b.hp < b.maxHp, "the released area lands on every foe in it");
}

// A boss shrugs off sleep, stun and confusion; a standard foe doesn't.
registerMarinaraEnemySkills({
  "test-stun": { kind: "status", target: "enemy", status: "stun", chance: 1, duration: 2, label: "Stun" },
});
for (const tier of ["boss", "standard"] as const) {
  const foe = buildMarinaraEnemy({ id: "foe", name: "Foe", level: 5, tier });
  const caster = party("caster");
  caster.side = "party";
  caster.enemySkills = ["test-stun"];
  const all = [foe, caster];
  performMarinaraOption(caster, marinaraOption(caster, "enemy:test-stun")!, [foe], all, ctx());
  assert.equal(
    foe.statuses.some((s) => s.status === "stun"),
    tier !== "boss",
    `a ${tier} ${tier === "boss" ? "ignores" : "takes"} a stun`,
  );
}

// A boss below half hits harder, and stays enraged when healed.
{
  const boss = buildMarinaraEnemy({ id: "boss", name: "Boss", level: 5, tier: "boss" });
  const hero = party("hero");
  const all = [boss, hero];
  const calm = marinaraHitNumbers(boss, hero, { kind: "damage", target: "enemy", stat: "strength", power: 0 }, all);
  boss.enraged = true;
  const angry = marinaraHitNumbers(boss, hero, { kind: "damage", target: "enemy", stat: "strength", power: 0 }, all);
  assert.ok(angry.damage > calm.damage, "an enraged boss hits harder");
}

// A fight's start: progressions for cards without one, the fallen kept out, foes fitted to the budget.
{
  const unit = (id: string, name: string, side: "player" | "enemy", extra: Partial<Combatant> = {}): Combatant =>
    ({
      id,
      name,
      side,
      hp: 20,
      maxHp: 20,
      mp: 0,
      maxMp: 0,
      attack: 5,
      defense: 5,
      speed: 5,
      level: 1,
      skills: [],
      ...extra,
    }) as Combatant;
  const fallen = createMarinaraProgression({ seed: "x", primary: "blade", temperament: "reckless" });
  const start = marinaraFightStart({
    gameId: "game",
    cards: [
      { name: "Ayla", class: "Knight", temperament: "protective", temperamentInitial: "protective" },
      { name: "Bren", marinara: { ...fallen, fallen: true } },
    ],
    party: [unit("p1", "Ayla", "player", { sprite: "ayla.png" } as Partial<Combatant>), unit("p2", "Bren", "player")],
    enemies: Array.from({ length: 12 }, (_, i) => unit(`e${i}`, `Goblin ${i}`, "enemy")),
    difficulty: "normal",
    storyFight: false,
  });
  assert.deepEqual(
    start.party.map((u) => u.name),
    ["Ayla"],
    "a fallen party member stays out under permadeath",
  );
  assert.equal((start.party[0] as Combatant & { sprite?: string }).sprite, "ayla.png", "the unit keeps its own look");
  assert.ok(start.cards?.[0]?.marinara, "the new progression is written on the card");
  assert.equal(
    (start.cards?.[1]?.marinara as { fallen?: boolean })?.fallen,
    true,
    "a card with a progression is left as it was",
  );
  assert.ok(start.enemies.length < 12, "a random fight is fitted to the encounter budget");
  assert.ok(start.notes.length > 0, "and says what it changed");
  const story = marinaraFightStart({
    gameId: "game",
    cards: [],
    party: [unit("p1", "Ayla", "player")],
    enemies: Array.from({ length: 12 }, (_, i) => unit(`e${i}`, `Goblin ${i}`, "enemy")),
    difficulty: "normal",
    storyFight: true,
  });
  assert.equal(story.enemies.length, 12, "a story's fight keeps every opponent it wrote");
}

console.log("game-marinara-rules: ok");
