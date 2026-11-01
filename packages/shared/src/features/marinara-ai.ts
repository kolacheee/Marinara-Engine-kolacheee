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
import { marinaraAffinityMultiplier } from "./marinara-classes.js";
import {
  MARINARA_TUNING,
  marinaraBasicAttack,
  marinaraDebuffBurden,
  marinaraEffectiveStat,
  marinaraExpectedHit,
  marinaraSkillCost,
  marinaraStruck,
  marinaraTargetsFor,
  marinaraUsable,
  type MarinaraEffect,
  type MarinaraFighter,
  type MarinaraOption,
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
  for (const { effect } of marinaraUsable(unit)) {
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
  const out: CombatAiCandidate<MarinaraChoice>[] = [];
  const add = (
    option: MarinaraOption,
    targets: readonly MarinaraFighter[],
    parts: Omit<CombatAiCandidate<MarinaraChoice>, "action">,
  ) => {
    const weight = option.effect.weight ?? 1;
    const price = option.skill ? marinaraSkillCost(actor, option.skill) : null;
    const pool = price?.resource === "mp" ? actor.maxMp : actor.maxStamina;
    // MP never comes back in a fight; stamina does, so it is cheaper to spend.
    const cost = price ? (price.cost / Math.max(1, pool)) * (price.resource === "mp" ? 1 : 0.4) : 0;
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
  for (const option of marinaraUsable(actor)) {
    const { effect } = option;
    const pool = reachable(option, marinaraTargetsFor(actor, effect, all));
    if (!pool.length && effect.target !== "party" && effect.target !== "self") continue;
    switch (effect.kind) {
      case "damage": {
        const area = effect.target === "all-enemies" || effect.target === "front-row";
        const aims = area ? [pool[0]!] : pool;
        for (const aim of aims) {
          const struck = area ? marinaraStruck(actor, effect, [aim], all) : [aim];
          const spread = struck.length > 1 ? { ...effect, spread: MARINARA_TUNING.areaSpreadPct } : effect;
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
        const urgency = (u: MarinaraFighter) => (u.hp / u.maxHp < 0.4 ? 2 : u.hp / u.maxHp < 0.7 ? 1 : 0.3);
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
        for (const target of pool) add(option, [target], { healing: (effect.power ?? 0.25) * 3, support: 0.5 });
        break;
      case "shield":
        if (!threatened) break;
        for (const target of pool) {
          if (target.shield > 0) continue;
          const amount = eff(actor, "magic") + (effect.power ?? 0);
          add(option, [target], {
            support: (amount / target.maxHp) * (target.row === "front" ? 1 : 0.6),
            protection: target.id === threatenedFriend?.id ? 0.3 : 0,
          });
        }
        break;
      case "buff": {
        const who = effect.target === "self" ? [actor] : friends;
        if (who.some((u) => u.mods.some((m) => m.source === option.id))) break;
        let value = 0;
        if (effect.stat === "imbue") {
          const plain = bestDamage(actor, all, tactical);
          actor.mods.push({ stat: "imbue", pct: 1, turns: 1, source: "probe" });
          const imbued = bestDamage(actor, all, tactical);
          actor.mods = actor.mods.filter((m) => m.source !== "probe");
          value = Math.max(0, imbued - plain) * (effect.duration ?? 3) * 0.8;
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
          value = incoming * Math.abs(effect.pct ?? 0) * (effect.duration ?? 1) * 0.8 * (who.length > 1 ? 1 : 0.6);
        } else {
          const dealt = who.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0);
          value = dealt * (effect.pct ?? 0) * (effect.duration ?? 1) * 0.7;
        }
        if (value <= 0) break;
        add(option, [actor], { support: value / foeHp });
        break;
      }
      case "debuff": {
        const fresh = pool.filter((u) => !u.mods.some((m) => m.source === option.id));
        if (!fresh.length) break;
        if ((effect.stat === "damage" || effect.stat === "speed") && !threatened) break;
        const worth = (targets: readonly MarinaraFighter[]) =>
          effect.stat === "damage-taken"
            ? friends.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0) *
              (effect.pct ?? 0) *
              (effect.duration ?? 1)
            : targets.reduce((sum, foe) => sum + Math.max(eff(foe, "strength"), eff(foe, "magic")), 0) *
              Math.abs(effect.pct ?? 0) *
              (effect.duration ?? 1) *
              0.6;
        if (effect.target === "all-enemies") add(option, [fresh[0]!], { setup: worth(fresh) / foeHp });
        else
          for (const target of fresh)
            add(option, [target], { targetId: target.id, setup: worth([target]) / Math.max(1, target.maxHp) });
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
        if (!threatened || actor.provoking > 0 || friends.length < 2) break;
        add(option, [actor], { protection: 0.5 + (actor.hp / actor.maxHp) * 0.4, risk: 0.2 });
        break;
      case "taunt": {
        if (!threatened || friends.length < 2) break;
        for (const target of pool) {
          if (target.tauntTurns > 0 && target.tauntedBy === actor.id) continue;
          const menace = Math.max(eff(target, "strength"), eff(target, "magic")) / Math.max(1, friendHp);
          add(option, [target], { targetId: target.id, protection: 0.3 + menace, risk: 0.15 });
        }
        break;
      }
      case "ward": {
        if (!threatened || friends.length < 2 || actor.wardTurns > 0) break;
        for (const target of pool) {
          if (target.id === actor.id) continue;
          add(option, [target], {
            protection: target.id === threatenedFriend?.id ? 0.6 : 0.3,
            damage: (bestDamage(actor, all, tactical) * 0.5) / foeHp,
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
