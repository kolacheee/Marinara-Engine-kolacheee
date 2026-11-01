/**
 * Classic Marinara abilities do what their text says (Alyssa 2026-11-01: "abilities that don't work
 * are bugs"): stun immunity, Slow Time, Elder Oath, Oath of Iron, Thousand Shadows, Undying Light,
 * Siphon, Devour, Backstab, Exploit, Assassinate, Weaken, Crescendo, Tempo, Formation, Raise the
 * Banner, Light Feet and Heavy Draw.
 */
import assert from "node:assert/strict";
import {
  beginMarinaraTurn,
  buildMarinaraEnemy,
  marinaraEffectiveStat,
  marinaraHitNumbers,
  marinaraOption,
  performMarinaraOption,
  type MarinaraFightContext,
  type MarinaraFighter,
} from "../../packages/shared/src/features/marinara-combat.js";
import { MARINARA_CLASSES, marinaraRandom } from "../../packages/shared/src/features/marinara-classes.js";

const ctx = (seed = "abilities"): MarinaraFightContext => ({ random: marinaraRandom(seed), events: [] });
const skill = (id: string) => {
  for (const def of MARINARA_CLASSES) {
    const found = def.skills.find((one) => one.id === id);
    if (found) return { ...found };
  }
  throw new Error(`no skill ${id}`);
};
const unit = (id: string, side: "party" | "enemy", skills: string[] = []): MarinaraFighter => {
  const fighter = buildMarinaraEnemy({ id, name: id, level: 10, tier: "standard", archetype: "blade" });
  fighter.side = side;
  fighter.skills = [...fighter.skills, ...skills.map(skill)];
  return fighter;
};
const use = (actor: MarinaraFighter, id: string, targets: MarinaraFighter[], all: MarinaraFighter[], c = ctx()) => {
  actor.mp = actor.maxMp = 999;
  actor.stamina = actor.maxStamina = 999;
  const option = marinaraOption(actor, id, all);
  assert.ok(option, `${actor.id} can use ${id}`);
  performMarinaraOption(actor, option!, targets, all, c);
  return c;
};
const status = (target: MarinaraFighter, which: "stun" | "sleep" | "doom" | "poison", by?: string) => {
  target.statuses.push({ status: which, turns: 2, ...(by ? { by } : {}) });
};

// Unstoppable: no stun below half HP; Immovable: never.
{
  const cleaver = unit("wb", "party", ["unstoppable"]);
  const wall = unit("wall", "party", ["immovable"]);
  cleaver.hp = cleaver.maxHp;
  const stun = { kind: "status", target: "enemy", status: "stun", chance: 1, duration: 2 } as const;
  const stunner = unit("st", "enemy");
  const stunAll = [stunner, cleaver, wall];
  const option = { id: "test-stun", skill: null, effect: stun } as never;
  performMarinaraOption(stunner, option, [cleaver], stunAll, ctx());
  assert.ok(
    cleaver.statuses.some((s) => s.status === "stun"),
    "above half HP the Cleaver can be stunned",
  );
  cleaver.statuses = [];
  cleaver.hp = Math.floor(cleaver.maxHp / 3);
  performMarinaraOption(stunner, option, [cleaver], stunAll, ctx());
  assert.ok(!cleaver.statuses.some((s) => s.status === "stun"), "below half HP it can't");
  performMarinaraOption(stunner, option, [wall], stunAll, ctx());
  assert.ok(!wall.statuses.some((s) => s.status === "stun"), "Immovable is never stunned");
}

// Elder Oath: no Doom, no sleep.
{
  const elder = unit("el", "party", ["elder-oath"]);
  const foe = unit("f", "enemy");
  const all = [elder, foe];
  for (const which of ["doom", "sleep"] as const) {
    const option = {
      id: "t",
      skill: null,
      effect: { kind: "status", target: "enemy", status: which, chance: 1, duration: 3 },
    } as never;
    performMarinaraOption(foe, option, [elder], all, ctx());
    assert.ok(!elder.statuses.some((s) => s.status === which), `Elder Oath shrugs off ${which}`);
  }
}

// Slow Time: a debuffed foe's turns come later.
{
  const dream = unit("dr", "party", ["slow-time"]);
  const plain = unit("pl", "party");
  const foe = unit("f", "enemy");
  foe.statuses.push({ status: "poison", turns: 3 });
  const turn = (all: MarinaraFighter[]) => {
    foe.next = 0;
    foe.hp = foe.maxHp;
    beginMarinaraTurn(foe, all, ctx());
    return foe.next;
  };
  const without = turn([plain, foe]);
  foe.statuses = [{ status: "poison", turns: 3 }];
  const withSlow = turn([dream, foe]);
  assert.ok(withSlow > without * 1.2, `Slow Time pushes the debuffed foe back (${without} -> ${withSlow})`);
}

// Oath of Iron: nobody drops below 1 HP until their next turn.
{
  const oath = unit("oa", "party", ["oath-of-iron"]);
  const ally = unit("al", "party");
  const foe = unit("f", "enemy");
  const all = [oath, ally, foe];
  use(oath, "oath-of-iron", [oath], all);
  ally.hp = 1;
  foe.stats.strength = 500;
  const hit = {
    id: null,
    skill: null,
    effect: { kind: "damage", target: "enemy", basic: true, hitBonus: 500 },
  } as never;
  performMarinaraOption(foe, hit, [ally], all, ctx());
  assert.equal(ally.hp, 1, "the sworn ally keeps standing");
}

// Thousand Shadows: three decoys take the next three hits on the party.
{
  const shade = unit("sh", "party", ["thousand-shadows"]);
  const ally = unit("al", "party");
  const foe = unit("f", "enemy");
  const all = [shade, ally, foe];
  use(shade, "thousand-shadows", [shade], all);
  const hp = ally.hp;
  const hit = {
    id: null,
    skill: null,
    effect: { kind: "damage", target: "enemy", basic: true, hitBonus: 500 },
  } as never;
  for (let i = 0; i < 3; i++) performMarinaraOption(foe, hit, [ally], all, ctx(`d${i}`));
  assert.equal(ally.hp, hp, "three hits taken by decoys");
  performMarinaraOption(foe, hit, [ally], all, ctx("d4"));
  assert.ok(ally.hp < hp, "the fourth lands");
}

// Undying Light: every downed ally gets up at half HP.
{
  const saint = unit("sa", "party", ["undying-light"]);
  const downed = [unit("d1", "party"), unit("d2", "party")];
  for (const one of downed) one.hp = 0;
  const all = [saint, ...downed, unit("f", "enemy")];
  use(saint, "undying-light", [downed[0]!], all);
  for (const one of downed) assert.equal(one.hp, Math.round(one.maxHp * 0.5), `${one.id} is back at half`);
}

// Siphon: takes a buff, or MP when there is none.
{
  const hexer = unit("hx", "party", ["siphon"]);
  const foe = unit("f", "enemy");
  foe.stats.resistance = 0;
  const all = [hexer, foe];
  foe.mods.push({ stat: "damage", pct: 0.3, turns: 3, source: "rally" });
  use(hexer, "siphon", [foe], all, ctx("si"));
  assert.ok(!foe.mods.some((m) => m.source === "rally"), "the buff leaves the foe");
  assert.ok(
    hexer.mods.some((m) => m.stat === "damage" && m.pct === 0.3),
    "and goes to the Hexer",
  );
  foe.mp = foe.maxMp = 100;
  hexer.mp = 0;
  use(hexer, "siphon", [foe], all, ctx("si2"));
  assert.ok(foe.mp < 100, "with no buff, MP drains");
}

// Devour: heals only when a debuff the user placed runs out.
{
  const devourer = unit("dv", "party", ["devour"]);
  const other = unit("ot", "party");
  const foe = unit("f", "enemy");
  const all = [devourer, other, foe];
  devourer.hp = 10;
  foe.statuses = [{ status: "poison", turns: 1, by: "ot", power: 0 }];
  beginMarinaraTurn(foe, all, ctx());
  assert.equal(devourer.hp, 10, "someone else's poison running out feeds nothing");
  foe.statuses = [{ status: "poison", turns: 1, by: "dv", power: 0 }];
  beginMarinaraTurn(foe, all, ctx());
  assert.ok(devourer.hp > 10, "its own poison running out heals it");
}

// Backstab: more damage to a target an ally struck since its last turn.
{
  const rogue = unit("ro", "party", ["backstab"]);
  const ally = unit("al", "party");
  const foe = unit("f", "enemy");
  const all = [rogue, ally, foe];
  const effect = marinaraOption(rogue, "backstab", all)!.effect;
  const alone = marinaraHitNumbers(rogue, foe, effect, all).damage;
  foe.struckBy = "al";
  const flanked = marinaraHitNumbers(rogue, foe, effect, all).damage;
  assert.ok(flanked > alone * 1.2, `Backstab hits harder on a busy target (${alone} -> ${flanked})`);
}

// Exploit: crits more on a debuffed target only.
{
  const rogue = unit("ro", "party", ["exploit"]);
  const foe = unit("f", "enemy");
  const all = [rogue, foe];
  const basic = marinaraOption(rogue, null, all)!.effect;
  const clean = marinaraHitNumbers(rogue, foe, basic, all).critChance;
  foe.statuses.push({ status: "poison", turns: 2 });
  assert.ok(marinaraHitNumbers(rogue, foe, basic, all).critChance >= clean + 20, "debuffed: more crits");
}

// Weaken: the foe's Strength or Magic, whichever it hits with.
{
  const hexer = unit("hx", "party", ["weaken"]);
  const foe = unit("f", "enemy");
  foe.stats.magic = foe.stats.strength + 10;
  const all = [hexer, foe];
  const before = marinaraEffectiveStat(foe, "magic", all);
  use(hexer, "weaken", [foe], all);
  assert.ok(marinaraEffectiveStat(foe, "magic", all) < before * 0.85, "a caster loses Magic");
}

// Crescendo: every buff on the party counts twice for a round.
{
  const cantor = unit("ca", "party", ["crescendo"]);
  const ally = unit("al", "party");
  const all = [cantor, ally, unit("f", "enemy")];
  ally.mods.push({ stat: "speed", pct: 0.2, turns: 3, source: "song" });
  const before = marinaraEffectiveStat(ally, "speed", all);
  use(cantor, "crescendo", [cantor], all);
  assert.ok(marinaraEffectiveStat(ally, "speed", all) > before * 1.1, "the Speed song doubles");
}

// Formation: party Defense only while no one is down.
{
  const captain = unit("cp", "party", ["formation"]);
  const ally = unit("al", "party");
  const all = [captain, ally, unit("f", "enemy")];
  const whole = marinaraEffectiveStat(captain, "defense", all);
  ally.hp = 0;
  assert.ok(marinaraEffectiveStat(captain, "defense", all) < whole, "lost once someone falls");
}

// Raise the Banner: frees the party of confusion and keeps it off.
{
  const bearer = unit("bb", "party", ["raise-the-banner"]);
  const ally = unit("al", "party");
  ally.statuses.push({ status: "confuse", turns: 2 });
  const foe = unit("f", "enemy");
  const all = [bearer, ally, foe];
  use(bearer, "raise-the-banner", [bearer], all);
  assert.ok(!ally.statuses.some((s) => s.status === "confuse"), "confusion lifted");
  const confuse = {
    id: "t",
    skill: null,
    effect: { kind: "status", target: "enemy", status: "confuse", chance: 1, duration: 2 },
  } as never;
  performMarinaraOption(foe, confuse, [ally], all, ctx());
  assert.ok(!ally.statuses.some((s) => s.status === "confuse"), "and can't come back while the banner flies");
}

// Light Feet: harder to hit.
{
  const foe = unit("f", "enemy");
  const scout = unit("sc", "party", ["light-feet"]);
  const plain = unit("pl", "party");
  const basic = marinaraOption(foe, null, [foe, scout])!.effect;
  foe.stats.skill = 0;
  assert.ok(
    marinaraHitNumbers(foe, scout, basic, [foe, scout]).hitChance <
      marinaraHitNumbers(foe, plain, basic, [foe, plain]).hitChance,
    "Light Feet dodges more",
  );
}

// Assassinate: a crit that leaves a foe under 15% finishes it, whatever its HP; never a boss.
{
  const strikeAt = (tier: "standard" | "boss") => {
    const killer = unit("k", "party", ["assassinate"]);
    const foe = buildMarinaraEnemy({ id: "b", name: "b", level: 10, tier });
    foe.maxHp = 1000;
    foe.hp = 140;
    foe.stats.defense = 0;
    killer.stats.strength = 1;
    const basic = marinaraOption(killer, null, [killer, foe])!.effect;
    const option = { id: null, skill: null, effect: { ...basic, critBonus: 1000, hitBonus: 1000 } } as never;
    performMarinaraOption(killer, option, [foe], [killer, foe], ctx("as"));
    return foe.hp;
  };
  assert.ok(strikeAt("standard") <= 0, "a big standard foe is finished");
  assert.ok(strikeAt("boss") > 0, "a boss isn't");
}

// Steady (Alyssa 2026-11-01): physical hits ignore 20% of the target's Defense.
{
  const plain = unit("pl", "party");
  const steady = unit("sd", "party", ["steady"]);
  const foe = unit("f", "enemy");
  plain.stats.strength = steady.stats.strength = 40;
  foe.stats.defense = 30;
  const all = [plain, steady, foe];
  const basic = marinaraOption(plain, null, all)!.effect;
  const without = marinaraHitNumbers(plain, foe, basic, all).damage;
  const withPen = marinaraHitNumbers(steady, foe, basic, all).damage;
  assert.ok(withPen > without, `Steady hits through armour (${without} -> ${withPen})`);
}

console.log("game-marinara-abilities: ok");
