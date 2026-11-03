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
import {
  MARINARA_ELEMENTS,
  marinaraAffinityMultiplier,
  marinaraBestDamageType,
  marinaraClass,
} from "./marinara-classes.js";
import {
  MARINARA_TUNING,
  marinaraActionWeight,
  marinaraBasicAttack,
  marinaraCanChannel,
  marinaraChanneled,
  marinaraDebuffBurden,
  marinaraEffectiveStat,
  marinaraExpectedHit,
  marinaraHelpless,
  marinaraStatusLandChance,
  marinaraRowOf,
  marinaraShrugsOff,
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

/** The best share of a foe's HP one hit of this fighter's could take now: what one more action is worth,
 *  in the same terms as a damage candidate. */
function bestShare(unit: MarinaraFighter, all: readonly MarinaraFighter[], tactical: boolean): number {
  let best = 0;
  const foes = all.filter((one) => one.side !== unit.side && one.hp > 0);
  const foeMeanHp = Math.max(1, foes.reduce((sum, foe) => sum + foe.maxHp, 0) / Math.max(1, foes.length));
  for (const { effect } of marinaraUsable(unit, all)) {
    if (effect.kind !== "damage" || effect.charge) continue;
    for (const target of marinaraTargetsFor(unit, effect, all))
      if (target.side !== unit.side && target.hp > 0)
        best = Math.max(
          best,
          Math.min(target.hp, marinaraExpectedHit(unit, target, effect, all, tactical)) / foeMeanHp,
        );
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
    /** On a board: whether a fighter could reach a foe with one more action (move and act). An action
     *  handed to one who can't is wasted on a Defend (Sonnet panel r3: Hour of Heroes' four free
     *  actions all went on Defend). */
    canStrike?: (unitId: string) => boolean;
    /** On a board: whether one fighter could reach another this round (a move and its reach). */
    reaches?: (fromId: string, toId: string) => boolean;
  } = {},
): CombatAiCandidate<MarinaraChoice>[] {
  const tactical = !!options.tactical;
  // A friend who surrendered is out of the fight: nobody heals, buffs or covers it.
  const friends = living(all.filter((unit) => unit.side === actor.side && (!unit.yielded || unit === actor)));
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
  // What a foe typically stands on: extra damage a buff or a debuff makes the party deal is weighed as a
  // blow of that size would be, against this unit's own attack (Alyssa 2026-11-03: a buffer or debuffer
  // weighs whether the team does more damage with it than this unit would by attacking).
  const foeMeanHp = Math.max(1, foes.reduce((sum, foe) => sum + foe.maxHp, 0) / Math.max(1, foes.length));
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
  // What a foe's hardest hit does to the party on average, and whether it lands on Defense or
  // Resistance: a guard buff is worth only the blows it stands in front of (review 2026-11-02: Spellguard
  // was cast every other turn against gels and rats that only hit with their bodies).
  const hardestFrom = (foe: MarinaraFighter) => {
    let best = { damage: 0, magic: false };
    for (const { effect } of marinaraUsable(foe, all)) {
      if (effect.kind !== "damage") continue;
      const damage = friends.reduce((sum, unit) => sum + hit(foe, unit, effect), 0) / Math.max(1, friends.length);
      if (damage > best.damage) best = { damage, magic: effect.damage === "magic" };
    }
    return best;
  };
  // What the foes who hit with an element deal the party a round.
  const elementalIncoming = () =>
    foes
      .filter(
        (foe) =>
          (MARINARA_ELEMENTS as readonly string[]).includes(foe.attackType ?? "") ||
          (!!foe.classId && marinaraClass(foe.classId)?.archetype === "channeler"),
      )
      .reduce((sum, foe) => sum + incomingFrom(foe), 0);
  // About how many rounds the fight has left: the foes' HP over what the party deals a round. A buff
  // longer than that is partly wasted (Alyssa 2026-11-03: no buffs as the fight ends).
  const roundsLeft = Math.max(1, foes.reduce((sum, foe) => sum + foe.hp, 0) / partyDamage);
  // The damage a foe would deal the party over the next `turns` of its turns, as a share of a friend's
  // HP: what killing it now, or holding it down, keeps off (Alyssa 2026-11-03: a dead foe deals none).
  const threatOf = (foe: MarinaraFighter, turns: number) => (hardestFrom(foe).damage * Math.max(0, turns)) / friendHp;
  // What could land on a friend before its next turn: each foe's hardest blow, shared among the
  // friends it might pick (all of it when the friend draws the foes).
  const incomingOn = (u: MarinaraFighter) =>
    foes.reduce((sum, foe) => {
      if (foe.dummy) return sum;
      let most = 0;
      for (const { effect } of marinaraUsable(foe, all))
        if (effect.kind === "damage" && !effect.charge) most = Math.max(most, hit(foe, u, effect));
      return sum + most * (u.provoking > 0 ? 1 : 1 / Math.max(1, friends.length));
    }, 0);
  // Drawing every foe onto one friend: the blows that would have landed on the others, less what they
  // do to the one who draws them, for the turns it lasts (Alyssa 2026-11-03, aggro control; Sonnet
  // panel r4: Provoke and Draw Fire were weighed flat and filled tanks' turns).
  const drawnOff = (onto: MarinaraFighter, duration: number) =>
    foes.reduce((sum, foe) => {
      if (foe.dummy || (options.reaches && !options.reaches(foe.id, onto.id))) return sum;
      let pulled = 0;
      for (const { effect } of marinaraUsable(foe, all)) {
        if (effect.kind !== "damage" || effect.charge || effect.target !== "enemy") continue;
        const off =
          friends.reduce(
            (s, u) => s + (u.id === onto.id ? 0 : Math.max(0, hit(foe, u, effect) - hit(foe, onto, effect))),
            0,
          ) / Math.max(1, friends.length);
        pulled = Math.max(pulled, off);
      }
      return sum + pulled * Math.max(1, Math.min(duration, lasts(foe)));
    }, 0);
  const out: CombatAiCandidate<MarinaraChoice>[] = [];
  // A bonus action leaves the turn's action still to take (review 2026-11-02: songs, Mark Prey and
  // Double Time were weighed against a whole attack, as if they cost the turn, and lost to it).
  const strikes = (unit: MarinaraFighter) => !options.canStrike || options.canStrike(unit.id);
  const stillActs = actor.commanded || !strikes(actor) ? 0 : bestShare(actor, all, tactical);
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
    const free = option.effect.bonusAction && !actor.commanded ? stillActs : 0;
    out.push({
      action: { optionId: option.id, targetIds: targets.map((unit) => unit.id) },
      ...parts,
      damage: parts.damage === undefined && !free ? undefined : (scale(parts.damage) ?? 0) + free,
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
    // A commanded or extra action grants no further action, so a bonus-action setup (Vanish, a song, Mark
    // Prey) would spend the whole of it on what the fighter can do for free on its own turn (panel t12: a
    // Phantom spent a Grand Strategy turn on Vanish and never struck).
    if (actor.commanded && effect.bonusAction && effect.kind !== "damage") continue;
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
          let prevented = 0;
          // Decoys on the target's side (Thousand Shadows) take the next hits that land: a big blow into
          // one is worth only the cheap one that would strip it as well (Sonnet panel r4: three 30-MP
          // Convergences charged into a Vault Gorger's decoys).
          let decoys = living(all.filter((u) => u.side === aim.side)).reduce((sum, u) => sum + (u.decoys ?? 0), 0);
          for (const aimed of struck) {
            // A guard covering the target takes a single-target blow in its place (Sonnet panel r5: foes hit
            // a covered healer for 1-4 off the Guard for 14 rounds while the Guard was what they struck).
            const coverer =
              effect.target === "enemy"
                ? living(all.filter((u) => u.side === aimed.side && u.covering === aimed.id))[0]
                : undefined;
            const target = coverer ?? aimed;
            const landed = Math.min(target.hp, hit(actor, target, spread));
            const absorbed = decoys > 0 && !marinaraHelpless(target);
            if (absorbed) decoys--;
            const expected = absorbed
              ? Math.min(landed, Math.min(target.hp, hit(actor, target, marinaraBasicAttack(actor)))) * 0.5
              : landed;
            // Progress toward winning: the same blow is worth the same on any foe, over the foe side's mean
            // HP (Sonnet panel r4: 68 on a 1,420-HP boss scored +0.02 over the boss's own HP, and Rally,
            // Cover and Defend took the turns). Kill shots and focus carry the rest (finish, prevented).
            damage += expected / foeMeanHp;
            if (expected >= target.hp * 0.95) {
              finish += 0.7;
              // A kill shot: the blows it would have dealt before the party brought it down anyway.
              if (target.side !== actor.side)
                prevented += threatOf(target, Math.min(2, Math.max(1, target.hp / partyDamage)));
            }
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
            ...(prevented > 0 ? { prevented: prevented * later } : {}),
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
        // By threat, not by HP alone (Alyssa 2026-11-03): most for a friend who would go down before its
        // next turn, less for one low but out of harm's way.
        const urgency = (u: MarinaraFighter) => {
          if (threatened && incomingOn(u) >= u.hp) return 3;
          const share = u.hp / u.maxHp;
          return share < 0.4 ? 1.5 : share < 0.7 ? 0.8 : 0.15;
        };
        // Nobody hurt and nothing to clean: no heal (Alyssa 2026-11-02).
        const hurt = (u: MarinaraFighter) => u.hp < u.maxHp || cleaned(u) > 0;
        if (effect.target === "self" || effect.target === "party") {
          const who = effect.target === "self" ? [actor] : friends;
          if (!who.some(hurt)) break;
          const healing = who.reduce((sum, u) => sum + (healed(u) / u.maxHp) * urgency(u), 0);
          const support = who.reduce((sum, u) => sum + cleaned(u), 0) / friendHp;
          if (healing + support <= 0.02) break;
          add(option, [actor], { healing, support });
        } else {
          for (const target of pool) {
            if (!hurt(target)) continue;
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
        // The extra damage it makes the party deal, in HP (weighed as damage, not support).
        let extra = 0;
        // Whether `value` is HP kept off this side (over its own mean HP) or extra damage on the foes'.
        let kept = true;
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
              if (mod.stat === "damage") extra += bestDamage(u, all, tactical) * mod.pct * 0.8;
              else if ((mod.stat === "defense" || mod.stat === "resistance") && threatened)
                value +=
                  (foes.reduce((sum, foe) => sum + incomingFrom(foe), 0) / Math.max(1, who.length)) * mod.pct * 0.5;
              else if (mod.stat === "speed") extra += bestDamage(u, all, tactical) * mod.pct * 0.4;
            }
        } else if (effect.stat === "imbue") {
          // The element the runes will carry: the caster channels, before casting, the one most foes are
          // weakest to (review 2026-11-02: valued unchanneled, as arcane, Edge Runes were worth nothing and
          // never cast).
          const score = (element: (typeof MARINARA_ELEMENTS)[number]) =>
            foes.reduce((sum, foe) => sum + marinaraBestDamageType([element], foe.affinities).multiplier, 0);
          const runeElement =
            marinaraCanChannel(actor) && !actor.channelManual && !actor.channeledThisTurn
              ? [...MARINARA_ELEMENTS].sort((a, b) => score(b) - score(a))[0]!
              : marinaraChanneled(actor);
          // What the element adds to each imbued fighter's best hit (the whole party for Edge Runes).
          for (const u of who) {
            if (u.mods.some((m) => m.stat === "imbue")) continue;
            const plain = bestDamage(u, all, tactical);
            u.mods.push({ stat: "imbue", pct: 1, turns: 1, source: "probe", element: runeElement });
            const imbued = bestDamage(u, all, tactical);
            u.mods = u.mods.filter((m) => m.source !== "probe");
            extra += Math.max(0, imbued - plain) * Math.min(effect.duration ?? 3, roundsLeft) * 0.8;
          }
          // Grand Inscription's riders: more damage, and less from the elements while threatened.
          for (const also of effect.alsoMods ?? []) {
            if (also.stat === "damage")
              extra +=
                who.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0) * also.pct * (effect.duration ?? 1) * 0.8;
            else if (also.stat === "element-taken" && threatened)
              value += elementalIncoming() * Math.abs(also.pct) * (effect.duration ?? 1) * 0.8;
          }
        } else if (effect.exposeNext) {
          if (actor.exposeNext || actor.critNext) break;
          const others = friends
            .filter((u) => u.id !== actor.id)
            .reduce((sum, u) => sum + bestDamage(u, all, tactical), 0);
          // Vanish: the next hit is a sure critical, and the foes it slips past are exposed.
          extra =
            (effect.critNext ? bestDamage(actor, all, tactical) * (MARINARA_TUNING.critMultiplier - 1) : 0) +
            others * effect.exposeNext * 2 * 0.6;
          value = threatened ? actor.maxHp * 0.05 : 0;
        } else if (effect.stat === "damage-taken" || effect.stat === "resistance" || effect.stat === "defense") {
          if (!threatened) break;
          // The damage it keeps off whoever it covers for its turns: a share of every blow for a damage
          // cut; for more Defense or Resistance, the stat it adds, off each blow that lands on that stat.
          const stats = [effect.stat, ...(effect.alsoMods ?? []).map((m) => m.stat)];
          let saved = 0;
          for (const foe of foes) {
            // Only blows that can land this round: a foe out of reach of everyone it covers adds nothing
            // (Sonnet panel r5: Harden and Fortress cast ten tiles from the party).
            if (options.reaches && !who.some((u) => options.reaches!(foe.id, u.id))) continue;
            const blow = hardestFrom(foe);
            if (blow.damage <= 0) continue;
            if (stats.includes("damage-taken")) saved += blow.damage * Math.abs(gain);
            else {
              const stat = blow.magic ? "resistance" : "defense";
              if (!stats.includes(stat)) continue;
              const added = (who.reduce((sum, u) => sum + eff(u, stat), 0) / Math.max(1, who.length)) * Math.abs(gain);
              saved += Math.min(blow.damage, added);
            }
          }
          // A foe's blow lands on one of them: on the user alone only if it is the one foes go for.
          value =
            saved *
            (effect.duration ?? 1) *
            0.8 *
            (who.length > 1 || effect.provokes || actor.provoking > 0 ? 1 : 1 / Math.max(1, friends.length));
          if (value <= 0) break;
          // Warding Stance also draws the foes: worth what Provoke is.
          if (effect.provokes && actor.provoking <= 0 && friends.length > 1) {
            add(option, [actor], {
              support: value / friendHp,
              protection: 0.2 + (actor.hp / actor.maxHp) * 0.2,
              risk: 0.2,
            });
            break;
          }
        } else {
          const dealt = who.reduce((sum, u) => sum + bestDamage(u, all, tactical), 0);
          // Rally, War Cry, songs, Strength or Speed up: the party's own blows, bigger for its turns.
          if (OFFENSIVE_STATS.has(effect.stat ?? ""))
            extra = dealt * gain * Math.min(effect.duration ?? 1, roundsLeft) * 0.8;
          else {
            value = dealt * gain * (effect.duration ?? 1) * 0.7;
            kept = false;
          }
        }
        if (value <= 0 && extra <= 0) break;
        add(option, [actor], {
          ...(extra > 0 ? { damage: extra / foeMeanHp } : {}),
          // HP kept off this side over this side's HP (Sonnet panel r5: over the other side's, a boss's Harden
          // against a party of 150-HP fighters scored as if it saved a third of the boss).
          ...(value > 0 ? { support: value / (kept ? friendHp : foeHp) } : {}),
        });
        break;
      }
      case "debuff": {
        // Not on a foe that can't be debuffed (review 2026-11-02).
        const fresh = pool.filter(
          (u) =>
            !u.mods.some((m) => m.source === option.id) && !(u.side !== actor.side && marinaraShrugsOff(u, "debuff")),
        );
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
        // A mark (damage taken up) is the party's extra damage on it: weighed as damage, as an attack is.
        const part = effect.stat === "damage-taken" ? "damage" : "setup";
        if (effect.target === "all-enemies")
          add(option, [fresh[0]!], { [part]: worth(fresh, part === "damage" ? foeMeanHp : foeHp) });
        else
          for (const target of fresh)
            add(option, [target], { targetId: target.id, [part]: worth([target], foeMeanHp) });
        break;
      }
      case "status": {
        if (effect.status === "regen") {
          const mending = effect.target === "self" ? [actor] : friends;
          if (!threatened || mending.some((u) => u.statuses.some((s) => s.status === "regen"))) break;
          // What it can mend: HP already lost plus the blows due before it runs out, no more (Sonnet panel
          // r5: Self-Repair at full HP, ten tiles from the party).
          const missing = mending.reduce(
            (s, u) =>
              s +
              Math.min(
                u.maxHp -
                  u.hp +
                  (!options.reaches || foes.some((foe) => options.reaches!(foe.id, u.id)) ? incomingOn(u) : 0) *
                    (effect.duration ?? 1),
                u.maxHp * (effect.power ?? 0.1) * (effect.duration ?? 1),
              ),
            0,
          );
          if (missing <= 0) break;
          add(option, [actor], { healing: (missing / friendHp) * 0.6 });
          break;
        }
        // Not on one it can't take hold of: a boss shrugs off sleep, stun and confusion (review 2026-11-02:
        // Rot and Lull were cast at bosses and immune foes).
        const fresh = pool.filter(
          (u) => !u.statuses.some((s) => s.status === effect.status) && !marinaraShrugsOff(u, effect.status!),
        );
        if (!fresh.length) break;
        if ((effect.status === "sleep" || effect.status === "stun" || effect.status === "confuse") && !threatened)
          break;
        const worth = (target: MarinaraFighter) =>
          effect.status === "poison" || effect.status === "wither"
            ? Math.min(target.hp, target.maxHp * (effect.power ?? 0.08) * (effect.duration ?? 3)) *
              marinaraStatusLandChance(target, effect, all) *
              (effect.status === "poison" ? marinaraAffinityMultiplier(target.affinities, "poison") : 1)
            : effect.status === "doom"
              ? Math.min(
                  target.hp,
                  target.maxHp * (target.maxHp > 300 ? MARINARA_TUNING.doomBossPct : MARINARA_TUNING.doomPct),
                ) *
                marinaraStatusLandChance(target, effect, all) *
                0.8
              : Math.max(eff(target, "strength"), eff(target, "magic")) *
                1.5 *
                (effect.duration ?? 1) *
                marinaraStatusLandChance(target, effect, all);
        // Holding a foe down (sleep, stun; confusion about half the time) is worth the blows it loses
        // (Alyssa 2026-11-03: control removes a foe's whole turn).
        // Slow (-30% Speed) takes about a third of a turn off each of the foe's turns it lasts (Sonnet panel
        // r5: Shriek was valued on the party's raw Strength at setup +9.33 and re-cast for 14 rounds).
        const held =
          effect.status === "sleep" || effect.status === "stun"
            ? 1
            : effect.status === "confuse"
              ? 0.5
              : effect.status === "slow"
                ? 0.3
                : 0;
        if (held) {
          const turns = effect.duration ?? (effect.status === "slow" ? 2 : 1);
          const lost = (u: MarinaraFighter) =>
            threatOf(u, Math.min(turns, Math.max(1, lasts(u)))) * held * marinaraStatusLandChance(u, effect, all);
          if (effect.target === "all-enemies")
            add(option, [fresh[0]!], { prevented: fresh.reduce((sum, u) => sum + lost(u), 0) });
          else for (const target of fresh) add(option, [target], { targetId: target.id, prevented: lost(target) });
          break;
        }
        if (effect.target === "all-enemies")
          add(option, [fresh[0]!], { setup: fresh.reduce((sum, u) => sum + worth(u), 0) / foeHp });
        else
          for (const target of fresh) {
            // Damage over time is damage, only slower; holding a foe down is setup.
            const dot = effect.status === "poison" || effect.status === "wither" || effect.status === "doom";
            const value = worth(target) / foeMeanHp;
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
        // The blows likely to land on the friend before the Guard's next turn: each foe that can get at it
        // picks it about one time in as many friends as it could pick (all of them when the friend draws
        // the foes), less what they would do to the Guard instead (Sonnet panel r4: Cover on a friend
        // nobody was hitting; tanks spent 60%+ of their turns guarding).
        const saved = (target: MarinaraFighter) =>
          foes.reduce((sum, foe) => {
            if (foe.dummy || (options.reaches && !options.reaches(foe.id, target.id))) return sum;
            const share = target.provoking > 0 ? 1 : 1 / Math.max(1, friends.length);
            const basic = marinaraBasicAttack(foe);
            return sum + Math.max(0, hit(foe, target, basic) - hit(foe, actor, basic)) * share;
          }, 0);
        for (const target of pool) {
          if (target.id === actor.id || friends.some((f) => f.covering === target.id)) continue;
          // No more than the friend has left to lose (Sonnet panel r5: a 2-HP minion covered for 10 rounds).
          const kept = Math.min(saved(target), target.hp);
          if (kept <= 0) continue;
          const danger = 1 - target.hp / target.maxHp;
          add(option, [target], {
            support: (kept * (1 + danger)) / friendHp,
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
            // Never onto a friend already low (Alyssa 2026-11-03), nor onto a healer, whose turns keep the
            // others up (Sonnet panel r4: Draw Fire on the healer).
            if (target.id === actor.id || target.hp <= 0 || target.hp < target.maxHp * 0.5) continue;
            if (marinaraUsable(target, all).some((o) => o.effect.kind === "heal" || o.effect.kind === "revive"))
              continue;
            const kept = drawnOff(target, effect.duration ?? 1);
            if (kept <= 0) continue;
            add(option, [target], {
              targetId: target.id,
              support: kept / friendHp,
              protection: 0.2,
              risk: 0.1,
            });
          }
          break;
        }
        if (!threatened || actor.provoking > 0 || friends.length < 2) break;
        // On a board a foe that can't get at the provoker ignores it (tactical defeats 2026-11-02: a Guard
        // provoked every turn while the boss tore into the back line).
        if (options.reaches && !foes.some((foe) => options.reaches!(foe.id, actor.id))) break;
        {
          // Worth the blows it pulls off softer friends onto the user (one currency: HP kept off the side).
          const kept = drawnOff(actor, effect.duration ?? 1);
          if (kept <= 0) break;
          add(option, [actor], {
            support: kept / friendHp,
            protection: 0.2 + (actor.hp / actor.maxHp) * 0.2,
            risk: 0.2,
          });
        }
        break;
      case "taunt": {
        if (!threatened || friends.length < 2) break;
        // Drawing a foe onto the user is worth less from the back row, where the user is the soft one
        // (balance pass 2026-11-01: a Farshot carrying Challenge spent over half its turns on it).
        const sturdy = actor.row === "front" ? 1 : 0.3;
        for (const target of pool) {
          if (target.tauntTurns > 0) continue;
          // The foe's blows on softer friends, landing on the user instead, for the turns it lasts.
          const basic = marinaraBasicAttack(target);
          const others = friends.filter((u) => u.id !== actor.id);
          const off =
            others.reduce((sum, u) => sum + Math.max(0, hit(target, u, basic) - hit(target, actor, basic)), 0) /
            Math.max(1, friends.length);
          const kept = off * Math.max(1, Math.min(effect.duration ?? 2, lasts(target)));
          if (kept <= 0) continue;
          add(option, [target], {
            targetId: target.id,
            support: (kept / friendHp) * sturdy,
            protection: 0.2 * sturdy,
            risk: 0.15,
          });
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
        // One more action of the fighter's best (as a bonus action, Double Time also leaves the turn's own).
        if (strikes(actor)) add(option, [actor], { damage: bestShare(actor, all, tactical) * 0.9 });
        break;
      case "command": {
        const others = friends.filter((u) => u.id !== actor.id && strikes(u));
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
  // Defending: +30% Defense and Resistance until the unit's next turn, and a breather for stamina. Worth
  // the HP it keeps off the unit this round, from the foes that can get at it, over its max HP (as a
  // blow is worth a share of the foe's): reasons audit 2026-11-03 found Defend winning on a flat
  // "hurt" bonus or by default over chip damage on 6.6% of Classic party turns. Never twice running,
  // as the Engine's other fights hold it (two walls defending at each other end nothing).
  const hurt = actor.hp / actor.maxHp;
  // A commanded or extra action has no turn to brace for: Defend only when nothing else can be done.
  if (!options.noDefend && !actor.commanded) {
    const drawn =
      actor.provoking > 0 ? 1 : friends.some((f) => f.covering === actor.id) ? 0 : 1 / Math.max(1, friends.length);
    const hardestOnMe = (foe: MarinaraFighter) => {
      let most = 0;
      for (const { effect } of marinaraUsable(foe, all))
        if (effect.kind === "damage" && !effect.charge) most = Math.max(most, hit(foe, actor, effect));
      return most;
    };
    const attackers = foes.filter((foe) => !foe.dummy && (!options.reaches || options.reaches(foe.id, actor.id)));
    const was = actor.defending;
    const open = attackers.reduce((sum, foe) => sum + hardestOnMe(foe), 0);
    actor.defending = true;
    const braced = attackers.reduce((sum, foe) => sum + hardestOnMe(foe), 0);
    actor.defending = was;
    // Bracing buys time for the others to win; the last one standing only puts off the end (Sonnet
    // panel r3: lone survivors and hurt foes defended for dozens of rounds).
    const urgency = hurt < 0.4 ? 2 : hurt < 0.7 ? 1.3 : 1;
    const saved =
      friends.length > 1 ? (Math.min(actor.hp, Math.max(0, open - braced) * drawn) / actor.maxHp) * urgency : 0;
    const winded = actor.stamina < actor.maxStamina * 0.3 && marinaraUsable(actor, all).length <= 1 ? 0.05 : 0;
    // The fight is won by hitting: bracing is a choice only when this round's blows are a real danger to
    // the unit (a quarter of what it has left), never a default over chip damage (Alyssa 2026-11-03:
    // "is the objective of fights not to win?").
    const danger = open * drawn >= actor.hp * 0.25;
    const support = (danger ? saved * MARINARA_AI_NORM.support : 0) + winded;
    if (support > 0.005) out.push({ action: { optionId: "defend", targetIds: [] }, hold: true, support });
  }
  if (!out.length) out.push({ action: { optionId: "defend", targetIds: [] }, hold: true });
  return out;
}

/** Buffs whose worth is the extra damage the party deals with them. */
const OFFENSIVE_STATS: ReadonlySet<string> = new Set([
  "damage",
  "strength",
  "magic",
  "skill",
  "speed",
  "best-attack",
  "accuracy",
  "crit",
]);

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
    canStrike?: (unitId: string) => boolean;
    reaches?: (fromId: string, toId: string) => boolean;
    ranked?: (ranking: Array<RankedCombatCandidate<MarinaraChoice>>) => void;
    /** Told how the pick was weighed (best first; the first is the pick), without changing it: the
     *  Debug log's reasons (Alyssa's rule: every playtest runs with the AI's reasons). */
    explain?: (ranking: Array<RankedCombatCandidate<MarinaraChoice>>) => void;
  } = {},
): MarinaraChoice {
  const candidates = marinaraAiCandidates(actor, all, { ...options, noDefend: (profile.tactics.holds ?? 0) >= 1 });
  // A mindless creature only knows to hit the one it fixed on.
  if (profile.tactics.adjective === "mindless") {
    const attack = candidates.find((c) => c.action.optionId === null);
    if (attack) return attack.action;
  }
  // A patient one waits for its moment in the Engine's other fights (a readied action); a Classic
  // Marinara turn has no waiting, only Defend, so patience is not a reason to defend (review 2026-11-02:
  // patient units defended 50% of their turns on both sides). Its own memory of defending still rules
  // out a second Defend in a row.
  const patient = profile.tactics.adjective === "patient";
  const unit = {
    ...profile,
    tactics: { ...profile.tactics, ...(patient ? { holds: Math.max(1, profile.tactics.holds ?? 0) } : {}) },
    hp: actor.hp,
    maxHp: actor.maxHp,
  };
  const diff = actor.side === "enemy" ? difficulty : "normal";
  // Nothing worth its price once weighed (Sonnet panel r4: Starfall for +0.02 at -0.14 MP, Sanctuary
  // healing nobody, Warding Stance at a net loss, "no other choice"): letting the turn go beats spending
  // on it. In Classic that is a Defend; on a board, a walk in.
  const pass = (ranking: Array<RankedCombatCandidate<MarinaraChoice>>) =>
    !actor.commanded && ranking[0] && ranking[0].score < 0 && ranking[0].candidate.action.optionId !== "defend"
      ? [{ candidate: { action: { optionId: "defend" as const, targetIds: [] } }, score: 0, parts: {} }, ...ranking]
      : ranking;
  if (options.ranked) {
    const ranking = pass(rankCombatCandidates(unit, candidates, turn, diff));
    options.ranked(ranking);
    return ranking[0]!.candidate.action;
  }
  let chosen: RankedCombatCandidate<MarinaraChoice>;
  if (options.explain) {
    // The same pick `chooseRankedCombatCandidate` makes (its first), with the memory it leaves.
    const ranking = pass(rankCombatCandidates(unit, candidates, turn, diff));
    chosen = ranking[0]!;
    unit.tactics.holds = chosen.candidate.hold ? Math.min(2, (unit.tactics.holds ?? 0) + 1) : 0;
    if (chosen.candidate.targetId) unit.tactics.targetId = chosen.candidate.targetId;
    options.explain(ranking);
  } else {
    chosen = chooseRankedCombatCandidate(unit, candidates, turn, diff);
    chosen = pass([chosen])[0]!;
  }
  // The unit keeps its memory of what it picked, as `chooseCombatCandidate` leaves it.
  profile.tactics.holds = chosen.candidate.hold ? Math.min(2, (profile.tactics.holds ?? 0) + 1) : 0;
  profile.tactics.targetId = unit.tactics.targetId;
  return chosen.candidate.action;
}
