/**
 * Bestiary lab helpers: bestiary foes built by the Engine's own `buildMarinaraEnemy`, reference
 * parties of four grown with real level-ups and wearing standard gear, and fights played out by the
 * combat director with the Engine's own combat AI on both sides (as engine-balance.ts does), so
 * threat is measured with what plays the game.
 */
import {
  commandCombatDirector,
  createCombatDirector,
} from "../../packages/server/src/services/game/combat-director.service.js";
import {
  marinaraAiAction,
  marinaraCombatant,
} from "../../packages/server/src/services/game/marinara-director.service.js";
import {
  MARINARA_CARRY_SLOTS,
  MARINARA_PARTY_TEMPERAMENTS,
  MARINARA_TEMPERAMENT_TREES,
  awardMarinaraXp,
  createMarinaraProgression,
  marinaraClass,
  marinaraClassBlock,
  marinaraKeptTraits,
  marinaraLearnedSkills,
  marinaraOpenClasses,
  marinaraRandom,
  setMarinaraCarried,
  setMarinaraClass,
  type MarinaraProgression,
  type MarinaraStats,
} from "../../packages/shared/src/features/marinara-classes.js";
import {
  buildMarinaraEnemy,
  buildMarinaraPartyFighter,
  registerMarinaraEnemySkills,
  type MarinaraEffect,
  type MarinaraFighter,
} from "../../packages/shared/src/features/marinara-combat.js";
import {
  MARINARA_BESTIARY_ABILITIES,
  type MarinaraBestiaryFoeSpec,
} from "../../packages/shared/src/features/marinara-bestiary.js";
import {
  marinaraGearBonus,
  marinaraStandardEquipment,
  marinaraTierForLevel,
} from "../../packages/shared/src/features/marinara-items.js";

// The bestiary's abilities join the Engine's foe abilities (same effect shape; ours win on a clash).
registerMarinaraEnemySkills(
  Object.fromEntries(
    MARINARA_BESTIARY_ABILITIES.map((ability) => [
      ability.id,
      { ...(ability.effect as MarinaraEffect), label: ability.label },
    ]),
  ),
);

/** A foe from its bestiary spec, as the Engine builds it. */
export function enemyFighter(spec: MarinaraBestiaryFoeSpec): MarinaraFighter {
  const fighter = buildMarinaraEnemy({
    id: spec.id,
    name: spec.name,
    ...(spec.classId ? { classId: spec.classId } : { archetype: spec.archetype }),
    level: spec.level,
    tier: spec.tier,
    ...(spec.row ? { row: spec.row } : {}),
    ...(spec.affinities ? { affinities: spec.affinities } : {}),
    ...(spec.attackType ? { attackType: spec.attackType } : {}),
    ...(spec.enemySkills?.length ? { enemySkills: spec.enemySkills } : {}),
    ...(spec.statScale ? { statScale: spec.statScale } : {}),
    ...(spec.ranged ? { ranged: true } : {}),
  });
  // The Engine applies damageScale when it builds the foe; the lab does it with a lasting damage mod.
  const scale = (spec as { damageScale?: number }).damageScale;
  if (scale !== undefined && scale !== 1)
    fighter.mods.push({ stat: "damage", pct: scale - 1, turns: 99999, source: "damage-scale" });
  return fighter;
}

/** Fixed-line parties: an early-FF four (fighter, guard, caster, healer), a skirmish four and a no-healer four. */
const LINE_PARTIES: Record<string, string[][]> = {
  classic: [
    ["blade", "duelist", "headsman"],
    ["guard", "sentinel", "stonewall"],
    ["channeler", "fusionist", "stormcaller"],
    ["mender", "cleric", "saint"],
  ],
  skirmish: [
    ["scout", "rogue", "phantom"],
    ["guard", "warden", "elder-warden"],
    ["marksman", "sharpshooter", "farshot"],
    ["herald", "cantor", "maestro"],
  ],
  noHealer: [
    ["blade", "bloodsworn", "cleaver"],
    ["guard", "aegis", "bulwark"],
    ["marksman", "artillerist", "siegebreaker"],
    ["hexer", "witch", "carrion-lord"],
  ],
};

/** The playtest harness's five parties (/mnt/project-files/playtest/classic-overhaul/PARTIES.md): by
 *  primary tree, everyone "disciplined" (Herald secondary), promoted at random among the open classes. */
const HARNESS_PARTIES: Record<string, string[]> = {
  classic: ["blade", "guard", "channeler", "mender"],
  skirmish: ["scout", "marksman", "hexer", "herald"],
  bruisers: ["blade", "guard", "marksman", "mender"],
  skirmishGuard: ["scout", "guard", "marksman", "herald"],
  casters: ["channeler", "hexer", "mender", "guard"],
};

/** Which parties the lab measures against: LAB_PARTIES=lines (three fixed lines) or harness (the
 *  playtest's five, the default: more varied, closer to what players field). */
export const LAB_PARTY_SET = process.env.LAB_PARTIES === "lines" ? "lines" : "harness";
export const REFERENCE_PARTIES: Record<string, unknown> = LAB_PARTY_SET === "lines" ? LINE_PARTIES : HARNESS_PARTIES;

/** A harness character: a primary tree, "disciplined", promoted at class level 10 and 20 to a random
 *  open class that follows the active one, carrying the best of what earlier classes taught. */
function harnessGrown(primary: string, level: number, seed: string): MarinaraProgression {
  const random = marinaraRandom(`grow:${seed}`);
  let p = createMarinaraProgression({ seed, primary: primary as never, temperament: "disciplined" });
  while (p.level < level) {
    p = awardMarinaraXp(p, 100, random).progression;
    const classLevel = p.classLevels[p.activeClass] ?? 1;
    if (classLevel >= 10 && classLevel % 10 === 0) {
      const next = marinaraOpenClasses(p).filter(
        (def) => def.from === p.activeClass && p.classLevels[def.id] === undefined && !marinaraClassBlock(p, def.id),
      );
      if (next.length) p = setMarinaraClass(p, next[Math.floor(random() * next.length)]!.id);
    }
  }
  return carried(p);
}

function carried(p: MarinaraProgression): MarinaraProgression {
  // Tree traits are kept by every class of the tree and can't be carried.
  const kept = new Set(marinaraKeptTraits(p));
  const earlier = marinaraLearnedSkills(p).filter((skill) => skill.classId !== p.activeClass && !kept.has(skill.id));
  const ranked = [...earlier].sort(
    (a, b) =>
      Number(Boolean(b.carryPick)) - Number(Boolean(a.carryPick)) ||
      Number(b.kind === "active") - Number(a.kind === "active") ||
      b.learnedAt - a.learnedAt,
  );
  return setMarinaraCarried(
    p,
    ranked.slice(0, MARINARA_CARRY_SLOTS).map((skill) => skill.id),
  );
}

/** A character on a class line at a level: promoted at class level 10 and 20, carrying the best of
 *  what earlier classes taught (marked picks first). */
function grown(line: string[], level: number, seed: string): MarinaraProgression {
  const random = marinaraRandom(`grow:${seed}`);
  const base = marinaraClass(line[0]!)!;
  // A pure line needs a temperament that points back at its own tree.
  const pure = line.some((id) => marinaraClass(id)?.pure);
  const temperament =
    MARINARA_PARTY_TEMPERAMENTS.find((t) => (MARINARA_TEMPERAMENT_TREES[t] === base.archetype) === pure) ?? "patient";
  let p = createMarinaraProgression({ seed, primary: base.archetype, temperament });
  for (let step = 0; step < 3; step++) {
    if (step > 0) {
      if (level <= step * 10) break;
      p = setMarinaraClass(p, line[step]!);
    }
    const target = step === 2 ? level : Math.min(level, (step + 1) * 10);
    if (target > p.level) p = awardMarinaraXp(p, (target - p.level) * 100, random).progression;
  }
  const earlier = marinaraLearnedSkills(p).filter((skill) => skill.classId !== p.activeClass);
  const ranked = [...earlier].sort(
    (a, b) =>
      Number(Boolean(b.carryPick)) - Number(Boolean(a.carryPick)) ||
      Number(b.kind === "active") - Number(a.kind === "active") ||
      b.learnedAt - a.learnedAt,
  );
  return setMarinaraCarried(
    p,
    ranked.slice(0, MARINARA_CARRY_SLOTS).map((skill) => skill.id),
  );
}

/** Standard gear on the party (marinara-items.ts): armour and weight stats, weapon power. LAB_GEAR=0 leaves it off. */
export const LAB_GEAR = process.env.LAB_GEAR !== "0";

const partyCache = new Map<string, MarinaraFighter[]>();

/** A reference party at a level, fresh for a fight (built once per key, then copied). */
export function referenceParty(name: string, level: number, seed: string): MarinaraFighter[] {
  const key = `${name}:${level}:${seed}:${LAB_GEAR}`;
  let party = partyCache.get(key);
  if (!party) {
    party = buildReferenceParty(name, level, seed);
    partyCache.set(key, party);
  }
  return structuredClone(party);
}

function buildReferenceParty(name: string, level: number, seed: string): MarinaraFighter[] {
  const members = (REFERENCE_PARTIES[name] as Array<string[] | string>)!;
  return members.map((member, n) => {
    const progression =
      typeof member === "string"
        ? harnessGrown(member, level, `${name}:${seed}:${n}`)
        : grown(member, level, `${name}:${seed}:${n}`);
    const def = marinaraClass(progression.activeClass)!;
    if (!LAB_GEAR) return buildMarinaraPartyFighter({ id: `p${n}`, name: def.label, progression });
    const bonus = marinaraGearBonus(marinaraStandardEquipment(def.archetype, marinaraTierForLevel(level)), {
      strength: progression.stats.strength,
    });
    const gearStats: Partial<MarinaraStats> = { ...bonus.stats };
    delete gearStats.hp;
    return buildMarinaraPartyFighter({
      id: `p${n}`,
      name: def.label,
      progression,
      gearStats,
      gear: { power: bonus.power, spellPower: bonus.spellPower },
    });
  });
}

export interface PlayedFight {
  victory: boolean;
  /** Party HP lost as a share of its max (all of it on a loss). */
  lost: number;
  downed: number;
  rounds: number;
  /** Neither side could finish the other and the director called the fight off (counted as no win). */
  stalled: boolean;
}

/** One fight through the combat director, the Engine's combat AI playing both sides. */
export function playFight(party: MarinaraFighter[], foes: MarinaraFighter[], seed: number): PlayedFight {
  const s = createCombatDirector({
    id: `bl${seed}`,
    anchor: "a",
    party: party.map((f) => marinaraCombatant(f)),
    enemies: foes.map((f) => marinaraCombatant(f)),
    style: "classic",
    gm: false,
    difficulty: "normal",
    seed,
    marinara: [...party, ...foes],
  });
  for (let step = 0; step < 4000 && !s.outcome; step++) {
    if (s.mercy) {
      commandCombatDirector(s, { type: "mercy", choice: "spare" });
      continue;
    }
    if (s.stage === "action" && s.actorId) {
      const unit = [...s.party, ...s.enemies].find((u) => u.id === s.actorId)!;
      commandCombatDirector(s, {
        type: "classic",
        action: marinaraAiAction(s.marinara!, unit, s.round, "normal", false),
      });
    } else if (s.window) commandCombatDirector(s, { type: "fallback" }, "fallback");
    else commandCombatDirector(s, { type: "continue" });
  }
  const max = s.party.reduce((sum, u) => sum + u.maxHp, 0);
  const left = s.party.reduce((sum, u) => sum + Math.max(0, u.hp), 0);
  const victory = s.outcome === "victory";
  const stalled = Boolean(s.stalled);
  return {
    victory,
    stalled,
    lost: victory || stalled ? (max - left) / Math.max(1, max) : 1,
    downed: s.party.filter((u) => u.hp <= 0).length,
    rounds: s.round,
  };
}

/** A numeric seed from a string key. */
export function seedOf(key: string): number {
  return Math.floor(marinaraRandom(key)() * 2 ** 31);
}
