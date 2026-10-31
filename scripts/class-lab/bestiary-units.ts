/**
 * Bestiary lab helpers: turn a bestiary spec into a lab unit (as the Engine's buildMarinaraEnemy
 * would) and build the reference parties foes are measured against.
 */
import {
  MARINARA_ARCHETYPE_TRAITS,
  MARINARA_STATS,
  expectedMarinaraStats,
  marinaraClass,
  marinaraFightHpMultiplier,
  type MarinaraArchetype,
  type MarinaraStats,
} from "../../packages/shared/src/features/marinara-classes.js";
import {
  MARINARA_BESTIARY_ABILITIES,
  MARINARA_BESTIARY_TIER_SIZES,
  type MarinaraEnemySpec,
} from "../../packages/shared/src/features/marinara-bestiary.js";
import { ENEMY_SKILLS, makeUnit, type Effect, type LabUnit } from "./combat.js";
import { buildCharacter, unitFrom } from "./class-lab.js";

// The bestiary's abilities join the lab's foe abilities (same effect shape).
for (const ability of MARINARA_BESTIARY_ABILITIES) ENEMY_SKILLS[ability.id] = ability.effect as Effect;

const RANGED: ReadonlySet<MarinaraArchetype> = new Set(["marksman"]);
const CASTERS: ReadonlySet<MarinaraArchetype> = new Set(["channeler", "hexer", "mender", "herald"]);

/** A foe from its spec: expected stats of its class or archetype at its level, scaled per stat, then
 *  sized by its tier (non-HP stats by `stats`, fight HP by `hp`). */
export function enemyUnit(spec: MarinaraEnemySpec): LabUnit {
  const def = spec.classId ? marinaraClass(spec.classId) : undefined;
  const archetype = def?.archetype ?? spec.archetype!;
  const expected = expectedMarinaraStats(archetype, spec.level);
  const size = MARINARA_BESTIARY_TIER_SIZES[spec.tier];
  const stats = Object.fromEntries(
    MARINARA_STATS.map((stat) => {
      const scaled = expected[stat] * (spec.statScale?.[stat] ?? 1);
      return [stat, stat === "hp" ? scaled : scaled * size.stats];
    }),
  ) as MarinaraStats;
  const traits = MARINARA_ARCHETYPE_TRAITS[archetype] ?? [];
  const skills = def
    ? [
        ...def.skills.filter((skill) => skill.learnedAt <= spec.level),
        ...(def.from ? marinaraClassChain(def.id) : [])
          .flatMap((id) => marinaraClass(id)!.skills)
          .filter((skill) => traits.includes(skill.id) && skill.learnedAt <= spec.level),
      ]
    : [];
  const unit = makeUnit({
    id: spec.id,
    name: spec.name,
    side: "enemy",
    row: spec.row ?? "front",
    stats,
    skills,
    ...(def ? { archetype, classId: def.id } : {}),
    attackType: spec.attackType,
    rangedBasic: spec.rangedBasic ?? (def ? RANGED.has(archetype) : false),
    magicBasic: def ? CASTERS.has(archetype) : isMagicType(spec.attackType),
    hpOverride: Math.max(1, Math.round(stats.hp * marinaraFightHpMultiplier(spec.level) * size.hp)),
    level: spec.level,
    affinities: spec.affinities,
  });
  unit.enemySkills = spec.enemySkills ?? [];
  unit.boss = spec.tier === "boss";
  return unit;
}

const isMagicType = (type: string | undefined) =>
  type === "fire" || type === "ice" || type === "lightning" || type === "light" || type === "dark";

function marinaraClassChain(classId: string): string[] {
  const chain: string[] = [];
  let at = marinaraClass(classId)?.from;
  while (at) {
    chain.unshift(at);
    at = marinaraClass(at)?.from;
  }
  return chain;
}

/** Reference parties: an early-FF four (fighter, guard, caster, healer), a skirmish four and a no-healer four. */
export const REFERENCE_PARTIES: Record<string, string[][]> = {
  classic: [
    ["blade", "duelist", "moonless-blade"],
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
    ["blade", "bloodsworn", "warbringer"],
    ["guard", "aegis", "bulwark"],
    ["marksman", "artillerist", "siegebreaker"],
    ["hexer", "witch", "doom-oracle"],
  ],
};

const lineClass = (line: string[], level: number) =>
  marinaraClass(level <= 10 ? line[0]! : level <= 20 ? line[1]! : line[2]!)!;

/** A party of `size` from a reference line-up at a level (each member grown with real level-ups). */
export function referenceParty(name: string, level: number, seed: string, size = 4): LabUnit[] {
  const lines = REFERENCE_PARTIES[name]!.slice(0, size);
  return lines.map((line, n) =>
    unitFrom(buildCharacter(lineClass(line, level), level, `${name}:${seed}:${n}`), `p${n}`, "party"),
  );
}
