// ──────────────────────────────────────────────
// Game: the Engine's combat AI for Classic Marinara fights
//
// What a fighter could do this turn, valued with Classic Marinara's own math (expected damage, heals,
// what a debuff or a guard is worth), as candidates for the Engine's combat AI (combat-ai.ts), which
// weighs them by the unit's temperament, mind and role. The same AI plays foes and the companions the
// player hands over, so a fight's balance is judged with what plays it.
// ──────────────────────────────────────────────

import {
  rankCombatCandidates,
  chooseRankedCombatCandidate,
  type AiCombatant,
  type CombatAiCandidate,
  type RankedCombatCandidate,
} from "./combat-ai.js";
import type { GameDifficulty } from "./combat-conditions.js";
import { MARINARA_ELEMENTS, marinaraAffinityMultiplier, marinaraClass } from "./marinara-classes.js";
import {
  MARINARA_TUNING,
  marinaraActionWeight,
  marinaraBasicAttack,
  marinaraDebuffBurden,
  marinaraEffectiveStat,
  marinaraExpectedHit,
  marinaraRowOf,
  marinaraSkillCost,
  marinaraStruck,
  marinaraTargetsFor,
  marinaraUsable,
  type MarinaraEffect,
  type MarinaraFighter,
  type MarinaraOption,
  marinaraVersesOf,
} from "./marinara-combat.js";

/** One choice: an option (null id: the basic attack, "defend": defending) and whom it is aimed at. */
export interface MarinaraChoice {
  optionId: string | null | "defend";
  targetIds: string[];
}

const living = (units: readonly MarinaraFighter[]) => units.filter((unit) => unit.hp > 0);

/** The best expected single hit this fighter could make now: what an extra action of theirs is worth. */
function bestDamage(unit: MarinaraFighter, all: readonly MarinaraFighter[], tactical: boolean): number {
  let best = 0;
  for (const { effect } of marinaraUsable(unit, all)) {
    if (effect.kind !== "damage") continue;
    for (const target of marinaraTargetsFor(unit, effect, all))
      best = Math.max(best, Math.min(target.hp, marinaraExpectedHit(unit, target, effect, all, tactical)));
  }
  return best;
}

/**
 * Every sensible choice for this fighter now, as candidates for the Engine's combat AI. Values are
 * shares of a fighter's HP, as the Engine's other fights score them: damage is expected damage over
 * the target's max HP, healing is HP restored over the patient's, and support, setup and protection
 * are the HP a buff, debuff or guard is expected to be worth over the side's average max HP.
 * `reach` narrows who a single-target option can be aimed at (a Tactical board's reach).
 */
/**
 * Support, setup and protection here are worked out in the same HP terms as damage, but the Engine's
 * combat AI weighs them at a fraction of damage by default (support 0.35, setup 0.2, protection 0
 * unless protective), tuned for its other fights' rougher numbers. On those weights buffs, debuffs
 * and taunts lost to a free attack almost every turn (playtest 2026-11-01: Rally 7%, Challenge 0%,
 * Mass Confusion 0%). These bring a temperament-neutral unit back to even; temperaments still lean.
 * A buff or debuff already on doesn't repeat, so a leaning unit can't spam it.
 */
export const MARINARA_AI_NORM = { support: 2.5, setup: 3.5, protection: 0.5, protectionAsSupport: 0.25 };

export function marinaraAiCandidates(
  actor: MarinaraFighter,
  all: readonly MarinaraFighter[],
  options: {
    tactical?: boolean;
    reach?: (option: MarinaraOption, target: MarinaraFighter) => boolean;
    /** It defended last turn. */
    noDefend?: boolean;
  } = {},
): CombatAiCandidate<MarinaraChoice>[] {
  const tactical = !!options.tactical;
  const friends = living(all.filter((unit) => unit.side === actor.side));
  const foes = living(all.filter((unit) => unit.side !== actor.side));
  if (!foes.length) return [{ action: { optionId: "defend", targetIds: [] }, hold: true }];
  const threatened = foes.some((foe) => !foe.dummy);
  const eff = (unit: MarinaraFighter, stat: Parameters<typeof marinaraEffectiveStat>[1]) =>
    marinaraEffectiveStat(unit, stat, all);
  const hit = (from: MarinaraFighter, to: MarinaraFighter, effect: MarinaraEffect) =>
    marinaraExpectedHit(from, to, effect, all, tactical);
  const sideHp = (units: readonly MarinaraFighter[]) =>
    Math.max(1, units.reduce((sum, unit) => sum + unit.maxHp, 0) / Math.max(1, units.length));
  const friendHp = sideHp(friends);
  const foeHp = sideHp(foes);
  // Who the foes are going for: a friend under attack is worth standing up for.
  const threatenedFriend = friends
    .filter((unit) => unit.id !== actor.id)
    .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  // Roughly how many rounds a foe has left: the whole foe side's HP over what the party deals a round.
  const partyDamage = Math.max(
    1,
    friends.reduce((sum, unit) => sum + bestDamage(unit, all, tactical), 0),
  );
  const lasts = (foe: MarinaraFighter) =>
    Math.max(foe.hp, foes.reduce((sum, unit) => sum + unit.hp, 0) * 0.6) / partyDamage;
  // What a foe's basic blow does to the party on average.
  const incomingFrom = (foe: MarinaraFighter) =>
    friends.reduce((sum, unit) => sum + hit(foe, unit, marinaraBasicAttack(foe)), 0) / Math.max(1, friends.length);
  // What the foes who hit with an element deal the party a round.
  const elementalIncoming = () =>
    foes
      .filter(
        (foe) =>
          (MARINARA_ELEMENTS as readonly string[]).includes(foe.attackType ?? "") ||
          (!!foe.classId && marinaraClass(foe.classId)?.archetype === "channeler"),
      )
      .reduce((sum, foe) => sum + incomingFrom(foe), 0);
  const out: CombatAiCandidate<MarinaraChoice>[] = [];
  const add = (
    option: MarinaraOption,
    targets: readonly MarinaraFighter[],
    parts: Omit<CombatAiCandidate<MarinaraChoice>, "action">,
  ) => {
    const weight = marinaraActionWeight(option.effect);
    const price = option.skill ? marinaraSkillCost(actor, option.skill) : null;
    const pool = price?.resource === "mp" ? actor.maxMp : actor.maxStamina;
    // MP never comes back in a fight; stamina does, so it is cheaper to spend. MP gets dearer as it
    // runs low (playtest 2026-11-01: Menders and Maestros spent it all early on top-ups and buffs).
    const left = price?.resource === "mp" ? Math.max(1, actor.mp) : pool;
    const cost = price
      ? (price.cost / Math.max(1, pool)) * (price.resource === "mp" ? Math.sqrt(pool / left) : 0.4)
      : 0;
    const scale = (value: number | undefined) => (value === undefined ? undefined : value / weight);
    // A guard's worth also counts as support, so a Guard who isn't protective by temperament still
    // covers and challenges (playtest 2026-11-01: Challenge was never picked).
    const guarded = parts.support === undefined ? (parts.protection ?? 0) * MARINARA_AI_NORM.protectionAsSupport : 0;
    out.push({
      action: { optionId: option.id, targetIds: targets.map((unit) => unit.id) },
      ...parts,
      damage: scale(parts.damage),
      healing: scale(parts.healing),
      support: scale(
        parts.support === undefined && !guarded
          ? undefined
          : ((parts.support ?? 0) + guarded) * MARINARA_AI_NORM.support,
      ),
      setup: scale(parts.setup === undefined ? undefined : parts.setup * MARINARA_AI_NORM.setup),
      protection: parts.protection === undefined ? undefined : parts.protection * MARINARA_AI_NORM.protection,
      cost: (parts.cost ?? 0) + cost,
    });
  };
  const reachable = (option: MarinaraOption, pool: MarinaraFighter[]) =>
    options.reach ? pool.filter((target) => options.reach!(option, target)) : pool;
  for (const option of marinaraUsable(actor, all)) {
    const { effect } = option;
    // A foe that yielded is the player's to spare or finish: the AI leaves it be.
    const pool = reachable(
      option,
      marinaraTargetsFor(actor, effect, all).filter((unit) => !(unit.yielded && unit.side !== actor.side)),
    );
    if (!pool.length && effect.target !== "party" && effect.target !== "self") continue;
    switch (effect.kind) {
      case "damage": {
        const area = effect.target === "all-enemies" || effect.target === "front-row";
        const aims = area ? [pool[0]!] : pool;
        for (const aim of aims) {
          const struck = area ? marinaraStruck(actor, effect, [aim], all) : [aim];
          const spread =
            struck.length > 1 ? { ...effect, spread: effect.areaPct ?? MARINARA_TUNING.areaSpreadPct } : effect;
          let damage = 0;
          let finish = 0;
          for (const target of struck) {
            const expected = Math.min(target.hp, hit(actor, target, spread));
            damage += expected / Math.max(1, target.maxHp);
            if (expected >= target.hp * 0.95) finish += 0.7;
          }
          // A charged skill lands a turn later.
          const later = effect.charge ? 0.5 : 1;
          // What it drinks back (Grave Tithe), as healing for the user.
          let drained = 0;
          if (effect.drain)
            for (const target of struck) drained += Math.min(target.hp, hit(actor, target, spread)) * effect.drain;
          const missing = actor.maxHp - actor.hp;
          add(option, [aim], {
            targetId: area ? undefined : aim.id,
            damage: damage * later,
            finish: finish * later,
            ...(drained > 0 && missing > 0
              ? { healing: (Math.min(missing, drained) / actor.maxHp) * (actor.hp / actor.maxHp < 0.5 ? 2 : 1) * later }
              : {}),
          });
        }
        break;
      }
      case "heal": {
        const amount = (u: MarinaraFighter) =>
          (effect.pctOfMax
            ? u.maxHp * effect.pctOfMax
            : eff(actor, "magic") * MARINARA_TUNING.healMagicPct + (effect.power ?? 0)) *
          (u.statuses.some((s) => s.status === "wound") ? MARINARA_TUNING.woundHealing : 1);
        const healed = (u: MarinaraFighter) => Math.min(u.maxHp - u.hp, amount(u));
        const cleaned = (u: MarinaraFighter) =>
          effect.cleanse === "all"
            ? marinaraDebuffBurden(u, all)
            : effect.cleanse === "one"
              ? marinaraDebuffBurden(u, all) * 0.6
              : 0;
        const urgency = (u: MarinaraFighter) => (u.hp / u.maxHp < 0.4 ? 2 : u.hp / u.maxHp < 0.7 ? 1 : 0.15);
        if (effect.target === "self" || effect.target === "party") {
          const who = effect.target === "self" ? [actor] : friends;
          const healing = who.reduce((sum, u) => sum + (healed(u) / u.maxHp) * urgency(u), 0);
          const support = who.reduce((sum, u) => sum + cleaned(u), 0) / friendHp;
          if (healing + support <= 0.02) break;
          add(option, [actor], { healing, support });
        } else {
          for (const target of pool) {
            const healing = (healed(target) / target.maxHp) * urgency(target);
            const support = cleaned(target) / friendHp;
            if (healing + support <= 0.02) continue;
            add(option, [target], { healing, support, protection: target.id === threatenedFriend?.id ? 0.3 : 0 });
          }
        }
        break;
      }
      case "cleanse":
        for (const target of pool) {
          const burden = marinaraDebuffBurden(target, all);
          if (burden <= 0) continue;
          add(option, [target], { support: (burden / friendHp) * 1.2 });
        }
        break;
      case "revive":
        // Undying Light raises them all at once: worth more the more are down.
        if (effect.allDowned) {
          if (pool.length)
            add(option, [pool[0]!], { healing: (effect.power ?? 0.25) * 3 * pool.length, support: 0.5 * pool.length });
          break;
        }
        for (const target of pool) add(option, [target], { healing: (effect.power ?? 0.25) * 3, support: 0.5 });
        break;
      case "shield":
        if (!threatened) break;
        for (const target of pool) {
          if (target.shield > 0) continue;
          const amount = eff(actor, "magic") + (effect.power ?? 0);
          add(option, [target], {
            support: (amount / target.maxHp) * (marinaraRowOf(target, all) === "front" ? 1 : 0.6),
            protection: target.id === threatenedFriend?.id ? 0.3 : 0,
          });
        }
        break;
      case "buff": {
        const who = effect.target === "self" ? [actor] : friends;
        // A song already sung is worth one more verse until it has them all (Cantor); anything else
        // already on doesn't repeat.
        const verses = effect.verses
          ? Math.max(...who.map((u) => marinaraVersesOf(u, effect, option.id ?? "buff")))
          : 0;
        const singing = !!effect.verses && who.some((u) => u.mods.some((m) => m.source === option.id));
        if (singing && verses >= effect.verses!.most) break;
        if (!effect.verses && who.some((u) => u.mods.some((m) => m.source === option.id))) break;
        const gain = singing ? effect.verses!.pct : (effect.pct ?? 0);
        let value = 0;
        if (effect.stat === "deathless") {
          // Oath of Iron: worth the friends a round of blows could put down.
          if (!threatened) break;
          const blow = Math.max(0, ...foes.map(incomingFrom)) * 1.5;
          value = who.filter((u) => u.hp <= blow).reduce((sum, u) => sum + u.maxHp * 0.6, 0);
        } else if (effect.decoys) {
          // Thousand Shadows: the blows its decoys will take.
          if (!threatened || (actor.decoys ?? 0) > 0) break;
          const blow = foes.reduce((sum, foe) => sum + incomingFrom(foe), 0) / Math.max(1, foes.length);
          value = blow * effect.decoys * 0.9;
        } else if (effect.doubles) {
          // Crescendo: what the party's buffs add once more for a round.
          for (const u of who)
            for (const mod of u.mods) {
              if (mod.pct <= 0 || mod.source.startsWith("crescendo")) continue;
              if (mod.stat === "damage") value += bestDamage(u, all, tactical) * mod.pct * 0.7;
              else if ((mod.stat === "defense" || mod.stat === "resistance") && threatened)
                value +=
                  (foes.reduce((sum, foe) => sum + incomingFrom(foe), 0) / Math.max(1, who.length)) * mod.pct * 0.5;
              else if (mod.stat === "speed") value += bestDamage(u, all, tactical) * mod.pct * 0.4;
            }
        } else if (effect.stat === "imbue") {
          // What the element adds to each imbued fighter's best hit (the whole party for Edge Runes).
          for (const u of who) {
            if (u.mods.some((m) => m.stat === "imbue")) continue;
            const plain = bestDamage(u, all, tactical);
            u.mods.push({ stat: "imbue", pct: 1, turns: 1, source: "probe" });
            const imbued = bestDamage(u, all, tactical);
            u.mods = u.mods.filter((m) => m.source !== "probe");
            value += Math.max(0, imbued - plain) * (effect.duration ?? 3) * 0.8;
          }
          // Grand Inscription's riders: more damage, and less from the elements while threatened.
          for (const also of effect.alsoMods ?? []) {
            if (also.stat === "damage")
              value +=
                who.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0) * also.pct * (effect.duration ?? 1) * 0.7;
            else if (also.stat === "element-taken" && threatened)
              value += elementalIncoming() * Math.abs(also.pct) * (effect.duration ?? 1) * 0.8;
          }
        } else if (effect.exposeNext) {
          if (actor.exposeNext) break;
          const others = friends
            .filter((u) => u.id !== actor.id)
            .reduce((sum, u) => sum + bestDamage(u, all, tactical), 0);
          value =
            bestDamage(actor, all, tactical) * (effect.pct ?? 0) +
            others * effect.exposeNext * 2 * 0.6 +
            (threatened ? actor.maxHp * 0.05 : 0);
        } else if (effect.stat === "damage-taken" || effect.stat === "resistance" || effect.stat === "defense") {
          if (!threatened) break;
          const incoming = foes.reduce((sum, foe) => sum + Math.max(eff(foe, "strength"), eff(foe, "magic")), 0);
          value = incoming * Math.abs(gain) * (effect.duration ?? 1) * 0.8 * (who.length > 1 ? 1 : 0.6);
        } else {
          const dealt = who.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0);
          value = dealt * gain * (effect.duration ?? 1) * 0.7;
        }
        if (value <= 0) break;
        add(option, [actor], { support: value / foeHp });
        break;
      }
      case "debuff": {
        const fresh = pool.filter((u) => !u.mods.some((m) => m.source === option.id));
        if (!fresh.length) break;
        // One mark at a time (lab 2026-11-01: Trackers marked every foe in turn, 231 of 314 actions, for
        // 6-8% of the party's damage): the party focuses the one it marked.
        if (
          effect.stat === "damage-taken" &&
          effect.target === "enemy" &&
          foes.some((u) => u.mods.some((m) => m.source === option.id))
        )
          break;
        if ((effect.stat === "damage" || effect.stat === "best-attack" || effect.stat === "speed") && !threatened)
          break;
        // Lasts as long as its duration or the foe, whichever ends first.
        const turns = (foe: MarinaraFighter) => Math.max(1, Math.min(effect.duration ?? 1, lasts(foe)));
        // A share of HP: for a damage cut, the damage it keeps off the party over the party's HP
        // (playtest 2026-11-01: valued on raw Strength, Weaken beat every other Hexer skill and
        // Wither was never cast); otherwise over the foes' HP, or the one target's.
        const worth = (targets: readonly MarinaraFighter[], over: number) =>
          effect.stat === "damage" || effect.stat === "best-attack"
            ? (targets.reduce((sum, foe) => sum + incomingFrom(foe) * turns(foe), 0) * Math.abs(effect.pct ?? 0)) /
              friendHp
            : (effect.stat === "damage-taken"
                ? // Only for the turns the target lasts once the party turns on it (lab 2026-11-01: Trackers spent
                  // 54% of their turns marking).
                  friends.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0) *
                  (effect.pct ?? 0) *
                  Math.min(...targets.map((foe) => Math.max(1, Math.min(effect.duration ?? 1, foe.hp / partyDamage))))
                : targets.reduce((sum, foe) => sum + Math.max(eff(foe, "strength"), eff(foe, "magic")), 0) *
                  Math.abs(effect.pct ?? 0) *
                  (effect.duration ?? 1) *
                  0.6) / over;
        if (effect.target === "all-enemies") add(option, [fresh[0]!], { setup: worth(fresh, foeHp) });
        else
          for (const target of fresh)
            add(option, [target], { targetId: target.id, setup: worth([target], Math.max(1, target.maxHp)) });
        break;
      }
      case "status": {
        if (effect.status === "regen") {
          if (!threatened || friends.some((u) => u.statuses.some((s) => s.status === "regen"))) break;
          const missing = friends.reduce(
            (s, u) =>
              s + Math.min(u.maxHp - u.hp + u.maxHp * 0.2, u.maxHp * (effect.power ?? 0.1) * (effect.duration ?? 1)),
            0,
          );
          add(option, [actor], { healing: (missing / friendHp) * 0.6 });
          break;
        }
        const fresh = pool.filter((u) => !u.statuses.some((s) => s.status === effect.status));
        if (!fresh.length) break;
        if ((effect.status === "sleep" || effect.status === "stun" || effect.status === "confuse") && !threatened)
          break;
        const worth = (target: MarinaraFighter) =>
          effect.status === "poison" || effect.status === "wither"
            ? Math.min(target.hp, target.maxHp * (effect.power ?? 0.08) * (effect.duration ?? 3)) *
              (effect.chance ?? 1) *
              (effect.status === "poison" ? marinaraAffinityMultiplier(target.affinities, "poison") : 1)
            : effect.status === "doom"
              ? Math.min(
                  target.hp,
                  target.maxHp * (target.maxHp > 300 ? MARINARA_TUNING.doomBossPct : MARINARA_TUNING.doomPct),
                ) *
                (effect.chance ?? 1) *
                0.8
              : Math.max(eff(target, "strength"), eff(target, "magic")) *
                1.5 *
                (effect.duration ?? 1) *
                (effect.chance ?? 1);
        if (effect.target === "all-enemies")
          add(option, [fresh[0]!], { setup: fresh.reduce((sum, u) => sum + worth(u), 0) / foeHp });
        else
          for (const target of fresh) {
            // Damage over time is damage, only slower; holding a foe down is setup.
            const dot = effect.status === "poison" || effect.status === "wither" || effect.status === "doom";
            const value = worth(target) / Math.max(1, target.maxHp);
            add(
              option,
              [target],
              dot ? { targetId: target.id, damage: value * 0.8 } : { targetId: target.id, setup: value },
            );
          }
        break;
      }
      case "cover": {
        if (!threatened || actor.covering) break;
        // Worth what the foes' hardest blow would do to them over what it does to the Guard: little
        // when the friend is as hard to hurt as the Guard, a lot for a soft one (playtest 2026-11-01:
        // Guards covered every turn and never struck).
        const incoming = (unit: MarinaraFighter) =>
          Math.max(0, ...foes.map((foe) => hit(foe, unit, marinaraBasicAttack(foe))));
        const own = incoming(actor);
        for (const target of pool) {
          if (target.id === actor.id || friends.some((f) => f.covering === target.id)) continue;
          const saved = Math.max(0, incoming(target) - own);
          if (saved <= 0) continue;
          const danger = 1 - target.hp / target.maxHp;
          add(option, [target], {
            support: (saved * (1 + danger)) / friendHp,
            protection: 0.2 + danger * 0.4,
          });
        }
        break;
      }
      case "provoke":
        if (option.effect.target === "ally") {
          // Draw Fire: onto the sturdiest ally standing who isn't drawing them already.
          if (!threatened || friends.length < 2 || friends.some((f) => f.provoking > 0)) break;
          for (const target of pool) {
            if (target.id === actor.id || target.hp <= 0) continue;
            const sturdy =
              (target.hp / target.maxHp) *
              ((eff(target, "defense") + eff(target, "resistance")) /
                Math.max(1, eff(actor, "defense") + eff(actor, "resistance")));
            add(option, [target], { targetId: target.id, protection: 0.2 + Math.min(0.6, sturdy * 0.3), risk: 0.1 });
          }
          break;
        }
        if (!threatened || actor.provoking > 0 || friends.length < 2) break;
        add(option, [actor], { protection: 0.5 + (actor.hp / actor.maxHp) * 0.4, risk: 0.2 });
        break;
      case "taunt": {
        if (!threatened || friends.length < 2) break;
        // Drawing a foe onto the user is worth less from the back row, where the user is the soft one
        // (balance pass 2026-11-01: a Farshot carrying Challenge spent over half its turns on it).
        const sturdy = actor.row === "front" ? 1 : 0.3;
        for (const target of pool) {
          if (target.tauntTurns > 0) continue;
          const menace = Math.max(eff(target, "strength"), eff(target, "magic")) / Math.max(1, friendHp);
          add(option, [target], { targetId: target.id, protection: (0.3 + menace) * sturdy, risk: 0.15 });
        }
        break;
      }
      case "ward": {
        if (!threatened || friends.length < 2 || actor.wardTurns > 0) break;
        // Worth the strikes back it buys (Alyssa 2026-11-01, item 7: a Farshot warding the tank): one per
        // foe attack the ward is likely to draw, so a ward on whoever draws the hits (a provoking or
        // covering tank, the front row) beats one on someone foes leave alone. A guard against nothing.
        const living = foes.filter((foe) => foe.hp > 0 && !foe.dummy);
        const front = friends.filter((f) => f.hp > 0 && f.row === "front").length || friends.length;
        const strikeBack = Math.max(0, ...living.map((foe) => hit(actor, foe, marinaraBasicAttack(actor))));
        for (const target of pool) {
          if (target.id === actor.id) continue;
          const draws =
            target.provoking > 0 || Boolean(target.covering)
              ? living.length
              : living.filter((foe) => foe.tauntedBy === target.id).length +
                (target.row === "front" ? living.length / front : living.length * 0.15);
          add(option, [target], {
            protection: target.id === threatenedFriend?.id ? 0.2 : 0.1,
            damage: (strikeBack * Math.min(3, draws)) / foeHp,
          });
        }
        break;
      }
      case "extra-turn":
        add(option, [actor], { damage: (bestDamage(actor, all, tactical) * 0.9) / foeHp });
        break;
      case "command": {
        const others = friends.filter((u) => u.id !== actor.id);
        if (!others.length) break;
        if (effect.target === "party") {
          add(option, [actor], {
            support: (others.reduce((s, u) => s + bestDamage(u, all, tactical), 0) * 0.9) / foeHp,
          });
        } else
          for (const target of others) add(option, [target], { support: bestDamage(target, all, tactical) / foeHp });
        break;
      }
    }
  }
  // Defending: a breather that brings stamina back and blunts the next blows. Never twice running,
  // as the Engine's other fights hold it (two walls defending at each other end nothing).
  const hurt = actor.hp / actor.maxHp;
  if (!options.noDefend)
    out.push({
      action: { optionId: "defend", targetIds: [] },
      hold: true,
      support: threatened ? (1 - hurt) * 0.15 + (actor.stamina < actor.maxStamina * 0.3 ? 0.05 : 0) : 0,
    });
  if (!out.length) out.push({ action: { optionId: "defend", targetIds: [] }, hold: true });
  return out;
}

/** The unit as the Engine's AI reads it: a Classic Marinara fighter under its combatant's tactics. */
type Profiled = AiCombatant & Required<Pick<AiCombatant, "tactics">>;

/**
 * What the Engine's combat AI picks for this fighter: its candidates weighed by the unit's
 * temperament, mind and role. `profile` is the combatant that carries those tactics and orders.
 */
export function chooseMarinaraAction(
  actor: MarinaraFighter,
  all: readonly MarinaraFighter[],
  profile: Profiled,
  turn: number,
  difficulty: GameDifficulty = "normal",
  options: {
    tactical?: boolean;
    reach?: (option: MarinaraOption, target: MarinaraFighter) => boolean;
    ranked?: (ranking: Array<RankedCombatCandidate<MarinaraChoice>>) => void;
  } = {},
): MarinaraChoice {
  const candidates = marinaraAiCandidates(actor, all, { ...options, noDefend: (profile.tactics.holds ?? 0) >= 1 });
  // A mindless creature only knows to hit the one it fixed on.
  if (profile.tactics.adjective === "mindless") {
    const attack = candidates.find((c) => c.action.optionId === null);
    if (attack) return attack.action;
  }
  const unit = { ...profile, hp: actor.hp, maxHp: actor.maxHp };
  const diff = actor.side === "enemy" ? difficulty : "normal";
  if (options.ranked) {
    const ranking = rankCombatCandidates(unit, candidates, turn, diff);
    options.ranked(ranking);
    return ranking[0]!.candidate.action;
  }
  const chosen = chooseRankedCombatCandidate(unit, candidates, turn, diff);
  // The unit keeps its memory of what it picked, as `chooseCombatCandidate` leaves it.
  profile.tactics.holds = unit.tactics.holds;
  profile.tactics.targetId = unit.tactics.targetId;
  return chosen.candidate.action;
}
