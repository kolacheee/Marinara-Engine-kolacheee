/**
 * Classic Marinara taming (Tracker line, Alyssa 2026-11-01): Tame takes a wild beast or vermin below
 * 30% HP (never an elite, boss or treasure foe) out of the fight; it pays XP, drops nothing and becomes
 * its keeper's companion, kept on the card. A companion raises its keeper's best-matching stat by 10%
 * while a Tracker-tree class is active; Bond makes that 20% and gives the rest of the party half. Sic
 * sends the companion in as a bonus action every other turn.
 */
import assert from "node:assert/strict";
import {
  combatDirectorView,
  createCombatDirector,
} from "../../packages/server/src/services/game/combat-director.service.js";
import {
  marinaraCombatant,
  performMarinaraAction,
} from "../../packages/server/src/services/game/marinara-director.service.js";
import { marinaraFightEnd } from "../../packages/server/src/services/game/marinara-fight-start.service.js";
import { MARINARA_CLASSES, createMarinaraProgression } from "../../packages/shared/src/features/marinara-classes.js";
import {
  buildMarinaraEnemy,
  marinaraOption,
  marinaraTameChance,
  marinaraTargetsFor,
  performMarinaraOption,
  type MarinaraFighter,
} from "../../packages/shared/src/features/marinara-combat.js";
import { marinaraApplyCompanions, marinaraFoeFighters } from "../../packages/shared/src/features/marinara-party.js";

const skill = (id: string) => {
  for (const def of MARINARA_CLASSES) {
    const found = def.skills.find((one) => one.id === id);
    if (found) return { ...found };
  }
  throw new Error(`no skill ${id}`);
};
const learnedAt = (classId: string, id: string) =>
  MARINARA_CLASSES.find((def) => def.id === classId)!.skills.find((one) => one.id === id)?.learnedAt;
assert.equal(learnedAt("tracker", "tame"), 12, "Tame is the Tracker's at class level 12");
assert.equal(learnedAt("huntsmaster", "sic"), 22, "Sic the Huntsmaster's at 22");
assert.equal(learnedAt("huntsmaster", "bond"), 26, "Bond at 26");

const hunter = (id: string, skills: string[]): MarinaraFighter => {
  const fighter = buildMarinaraEnemy({ id, name: id, level: 12, tier: "standard", archetype: "marksman" });
  fighter.side = "party";
  fighter.skills = [...fighter.skills, ...skills.map(skill)];
  fighter.mp = fighter.maxMp = 999;
  fighter.stamina = fighter.maxStamina = 999;
  return fighter;
};
const beasts = (tier: "standard" | "elite" = "standard") =>
  marinaraFoeFighters({
    foes: [{ id: "dog", name: "Dog", marinara: { family: { familyId: "hound", tier, level: 12 } } } as never],
    partyLevels: [12],
    partyAverageHp: 100,
    difficulty: "normal",
    keepAll: true,
    setting: "high_fantasy",
  }).fighters;

// Who can be tamed: a hound below 30% HP, not above it, never an elite.
{
  const [dog] = beasts();
  assert.ok(dog?.tameable, "a hound can be tamed");
  assert.equal(dog!.tameable!.stat, "strength", "its best stat is the one its family stands out in");
  const tracker = hunter("t", ["tame"]);
  const all = [tracker, dog!];
  const effect = marinaraOption(tracker, "tame", all)!.effect;
  assert.deepEqual(marinaraTargetsFor(tracker, effect, all), [], "not at full HP");
  dog!.hp = Math.floor(dog!.maxHp * 0.2);
  assert.deepEqual(
    marinaraTargetsFor(tracker, effect, all).map((u) => u.id),
    ["dog"],
    "below 30% it can be tamed",
  );
  const chance = marinaraTameChance(tracker, dog!, all);
  assert.ok(chance >= 10 && chance <= 90, `odds in range (${chance}%)`);
  dog!.level = 20;
  assert.ok(marinaraTameChance(tracker, dog!, all) < chance, "a beast above the user is harder");
  const [elite] = beasts("elite");
  assert.equal(elite?.tameable, undefined, "an elite can't be tamed");
  const goblin = buildMarinaraEnemy({ id: "g", name: "Goblin", level: 12, tier: "standard" });
  goblin.hp = 1;
  assert.deepEqual(marinaraTargetsFor(tracker, effect, [tracker, goblin]), [], "only beasts");
}

// A tamed beast leaves the fight, pays XP, drops nothing, and follows its keeper.
{
  const tracker = hunter("t", ["tame"]);
  const [dog] = beasts();
  dog!.hp = 1;
  const s = createCombatDirector({
    id: "tame",
    anchor: "anchor",
    party: [marinaraCombatant(tracker)],
    enemies: [marinaraCombatant(dog!)],
    style: "classic",
    difficulty: "normal",
    seed: 3,
    marinara: [tracker, dog!],
  });
  let tamed = false;
  const wild = () => s.marinara!.fighters.find((one) => one.id === "dog")!;
  for (let seed = 0; seed < 40 && !tamed; seed++) {
    performMarinaraAction(s.marinara!, "t", { type: "skill", skillId: "tame", targetId: "dog" }, seed, false, () => {});
    tamed = !!wild().tamedBy;
  }
  assert.ok(tamed, "Tame lands within a few tries");
  // The director takes the beast off the field on its next step.
  combatDirectorView(s);
  assert.equal(s.gone?.[0]?.left, "tamed", "the beast leaves as tamed");
  assert.equal(s.outcome, "victory", "with no foe left the fight is won");
  const progression = createMarinaraProgression({ seed: "k", primary: "marksman", temperament: "patient" });
  const end = marinaraFightEnd({
    state: s.marinara!,
    outcome: "victory",
    cards: [{ name: "t", marinara: progression }],
    seed: 1,
    permadeath: false,
  });
  const kept = end.cards?.[0]?.marinara as { companion?: { name: string; stat: string }; xp: number };
  assert.equal(kept.companion?.name, dog!.tameable!.name, "the beast is kept on the card");
  assert.ok(kept.xp > 0, "and it paid XP");
  assert.equal(end.growth[0]?.tamed, dog!.tameable!.name, "the fight's end says so");
}

// The companion's bonus: +10% to its stat with a Tracker-tree class active, Bond 20% and half to all.
{
  const base = createMarinaraProgression({ seed: "c", primary: "marksman", temperament: "patient" });
  const companion = { name: "Moor Hound", stat: "speed" as const };
  const make = (id: string) => buildMarinaraEnemy({ id, name: id, level: 10, tier: "standard", archetype: "scout" });
  const keeper = make("k"),
    friend = make("f");
  const speed = keeper.stats.speed;
  marinaraApplyCompanions([
    { fighter: keeper, progression: { ...base, activeClass: "tracker", companion } },
    { fighter: friend, progression: base },
  ]);
  assert.ok(Math.abs(keeper.stats.speed - speed * 1.1) < 1e-9, "+10% Speed to the keeper");
  assert.equal(friend.stats.speed, speed, "nobody else without Bond");
  assert.deepEqual(keeper.companion, companion, "the keeper has its companion for Sic");
  const off = make("o");
  marinaraApplyCompanions([{ fighter: off, progression: { ...base, activeClass: "marksman", companion } }]);
  assert.equal(off.stats.speed, speed, "no bonus outside the Tracker tree");
  const bonded = make("b"),
    ally = make("a");
  bonded.skills = [...bonded.skills, skill("bond")];
  marinaraApplyCompanions([
    { fighter: bonded, progression: { ...base, activeClass: "huntsmaster", companion } },
    { fighter: ally, progression: base },
  ]);
  assert.ok(Math.abs(bonded.stats.speed - speed * 1.2) < 1e-9, "Bond: +20% to the keeper");
  assert.ok(Math.abs(ally.stats.speed - speed * 1.1) < 1e-9, "and half of it to the party");
}

// Sic: needs a companion, a bonus action, every other turn.
{
  const master = hunter("m", ["sic"]);
  const foe = buildMarinaraEnemy({ id: "f", name: "Foe", level: 12, tier: "standard" });
  const all = [master, foe];
  assert.equal(marinaraOption(master, "sic", all), undefined, "no companion, no Sic");
  master.companion = { name: "Moor Hound", stat: "speed" };
  const option = marinaraOption(master, "sic", all)!;
  assert.equal(option.effect.from, "speed", "strikes from the user's matching stat");
  const hp = foe.hp;
  performMarinaraOption(master, option, [foe], all, { random: () => 0.5, events: [] });
  assert.ok(foe.hp < hp, "the companion hits");
  assert.equal(master.bonusTurns, 1, "a bonus action");
  assert.equal(master.cooldowns.sic, 2, "then waits a turn");
}

console.log("game-marinara-tame: ok");
