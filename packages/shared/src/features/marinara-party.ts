// ──────────────────────────────────────────────
// Game: a party on Classic Marinara (Marinara's own classes)
//
// What a game keeps of each party member: their progression, on the game's own card (never the
// library card), the primary tree read from the card, and the fighter a fight builds from both.
// Foes are read from what the fight's setup wrote of them: a tier and an archetype where it gave
// them, else read off what it said (a boss, a named leader, a mage).
// ──────────────────────────────────────────────

import {
  MARINARA_ARCHETYPES,
  MARINARA_STATS,
  createMarinaraProgression,
  isMarinaraPartyTemperament,
  marinaraClass,
  type MarinaraArchetype,
  type MarinaraPartyTemperament,
  type MarinaraProgression,
  type MarinaraStats,
} from "./marinara-classes.js";
import {
  MARINARA_ENEMY_TIERS_LIST,
  buildMarinaraEnemy,
  buildMarinaraPartyFighter,
  fitMarinaraEncounter,
  marinaraEncounterBudget,
  marinaraPartyLevel,
  type MarinaraEnemySpec,
  type MarinaraEnemyTier,
  type MarinaraFighter,
  type MarinaraFighterGear,
} from "./marinara-combat.js";
import {
  marinaraGearBonus,
  marinaraStandardEquipment,
  marinaraTierForLevel,
  type MarinaraEquipment,
} from "./marinara-items.js";
import {
  marinaraEnemySpec,
  marinaraFitEncounter,
  MARINARA_TIER_RULES,
  type MarinaraBestiarySetting,
  type MarinaraEncounterDifficulty,
  type MarinaraEncounterFoe,
} from "./marinara-bestiary.js";

/** A party member's Classic Marinara record on their game card. */
export interface MarinaraCardProgression extends MarinaraProgression {
  equipment?: MarinaraEquipment;
  /** Fell for good in a game with permadeath on. */
  fallen?: boolean;
}

/** Words that point at each archetype, strongest first within each. */
const ARCHETYPE_WORDS: Record<MarinaraArchetype, readonly string[]> = {
  guard: [
    "paladin",
    "guardian",
    "knight",
    "defender",
    "bodyguard",
    "sentinel",
    "protector",
    "templar",
    "tank",
    "shield",
    "warden",
  ],
  blade: [
    "swordsman",
    "swordswoman",
    "warrior",
    "fighter",
    "samurai",
    "berserker",
    "barbarian",
    "duelist",
    "mercenary",
    "soldier",
    "gladiator",
    "brawler",
    "monk",
    "sword",
    "blade",
  ],
  scout: [
    "rogue",
    "thief",
    "assassin",
    "ninja",
    "scout",
    "spy",
    "infiltrator",
    "smuggler",
    "pirate",
    "burglar",
    "trickster",
    "dagger",
  ],
  marksman: [
    "archer",
    "gunslinger",
    "sniper",
    "ranger",
    "hunter",
    "gunner",
    "marksman",
    "markswoman",
    "crossbow",
    "bow",
    "rifle",
    "pistol",
    "gun",
  ],
  channeler: [
    "mage",
    "wizard",
    "sorcerer",
    "sorceress",
    "elementalist",
    "magician",
    "netrunner",
    "psychic",
    "psion",
    "arcanist",
    "spellcaster",
    "pyromancer",
    "cryomancer",
    "esper",
    "magic",
  ],
  hexer: [
    "warlock",
    "necromancer",
    "witch",
    "hexer",
    "occultist",
    "curse",
    "shadow",
    "voodoo",
    "demonologist",
    "cultist",
  ],
  mender: [
    "healer",
    "cleric",
    "priest",
    "priestess",
    "medic",
    "doctor",
    "nurse",
    "druid",
    "shaman",
    "alchemist",
    "apothecary",
    "saint",
  ],
  herald: [
    "bard",
    "commander",
    "captain",
    "leader",
    "noble",
    "diplomat",
    "tactician",
    "singer",
    "idol",
    "performer",
    "officer",
    "merchant",
    "prince",
    "princess",
  ],
};

/**
 * The archetype a card's class, abilities and description point at: the first strong word in the
 * class wins, then the abilities, then the description. A card that says nothing a fight can read
 * fights as a Blade.
 */
export function guessMarinaraArchetype(card: {
  class?: string;
  abilities?: readonly string[];
  shortDescription?: string;
}): MarinaraArchetype {
  const sources = [card.class ?? "", (card.abilities ?? []).join(" "), card.shortDescription ?? ""];
  for (const source of sources) {
    const text = ` ${source.toLowerCase()} `;
    let best: { archetype: MarinaraArchetype; at: number } | null = null;
    for (const archetype of MARINARA_ARCHETYPES) {
      for (const word of ARCHETYPE_WORDS[archetype]) {
        const at = text.search(new RegExp(`[^a-z]${word}`));
        if (at >= 0 && (!best || at < best.at)) best = { archetype, at };
      }
    }
    if (best) return best.archetype;
  }
  return "blade";
}

/** How a card's RPG attributes lean each stat (−1 to 1), for the hidden aptitudes. */
export function marinaraLeanFromCard(card: {
  rpgStats?: { attributes: Array<{ name: string; value: number }> };
}): Partial<Record<keyof MarinaraStats, number>> {
  const attributes = card.rpgStats?.attributes ?? [];
  if (!attributes.length) return {};
  const values = attributes.map((a) => a.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const spread = Math.max(1, Math.max(...values) - Math.min(...values));
  const lean: Partial<Record<keyof MarinaraStats, number>> = {};
  const map: Record<string, keyof MarinaraStats> = {
    str: "strength",
    strength: "strength",
    con: "hp",
    constitution: "hp",
    vit: "hp",
    vitality: "hp",
    endurance: "hp",
    dex: "skill",
    dexterity: "skill",
    agi: "speed",
    agility: "speed",
    spd: "speed",
    speed: "speed",
    int: "magic",
    intelligence: "magic",
    mag: "magic",
    magic: "magic",
    wis: "resistance",
    wisdom: "resistance",
    spirit: "resistance",
    cha: "luck",
    charisma: "luck",
    luck: "luck",
    lck: "luck",
    def: "defense",
    defense: "defense",
  };
  for (const attribute of attributes) {
    const stat = map[attribute.name.trim().toLowerCase()];
    if (!stat) continue;
    lean[stat] = Math.max(-1, Math.min(1, ((attribute.value - mean) / spread) * 2));
  }
  return lean;
}

/** A new party member's progression for this game, from their card and the temperament kept on it. */
export function createMarinaraCardProgression(input: {
  gameId: string;
  card: {
    name: string;
    class?: string;
    abilities?: readonly string[];
    shortDescription?: string;
    rpgStats?: { attributes: Array<{ name: string; value: number }> };
  };
  temperament: MarinaraPartyTemperament;
  primary?: MarinaraArchetype;
}): MarinaraCardProgression {
  return createMarinaraProgression({
    seed: `${input.gameId}:${input.card.name}`,
    primary: input.primary ?? guessMarinaraArchetype(input.card),
    temperament: isMarinaraPartyTemperament(input.temperament) ? input.temperament : "disciplined",
    lean: marinaraLeanFromCard(input.card),
  });
}

/** Whether a stored value reads as a progression (written by this Engine). */
export function readMarinaraCardProgression(value: unknown): MarinaraCardProgression | undefined {
  if (!value || typeof value !== "object") return undefined;
  const p = value as Partial<MarinaraCardProgression>;
  if (
    typeof p.primary !== "string" ||
    !(MARINARA_ARCHETYPES as readonly string[]).includes(p.primary) ||
    !isMarinaraPartyTemperament(p.temperament) ||
    typeof p.level !== "number" ||
    typeof p.activeClass !== "string" ||
    !marinaraClass(p.activeClass) ||
    !p.stats ||
    !MARINARA_STATS.every((stat) => typeof p.stats![stat] === "number")
  )
    return undefined;
  return value as MarinaraCardProgression;
}

/** What a fighter takes from its gear. */
export function marinaraFighterGear(
  equipment: MarinaraEquipment | undefined,
  strength: number,
): { gear?: MarinaraFighterGear; stats: Partial<MarinaraStats>; ranged?: boolean } {
  if (!equipment || (!equipment.weapon && !equipment.armor && !equipment.accessories?.length)) return { stats: {} };
  const bonus = marinaraGearBonus(equipment, { strength });
  return {
    gear: {
      power: bonus.power,
      spellPower: bonus.spellPower,
      ...(bonus.weaponType ? { weaponType: bonus.weaponType } : {}),
      ...(bonus.effects.hit ? { hit: bonus.effects.hit } : {}),
      ...(bonus.effects.crit ? { crit: bonus.effects.crit } : {}),
      ...(bonus.effects.damagePct ? { damagePct: bonus.effects.damagePct } : {}),
      ...(bonus.effects.lifestealPct ? { lifestealPct: bonus.effects.lifestealPct } : {}),
      ...(bonus.immune.length ? { immune: [...bonus.immune] } : {}),
    },
    stats: bonus.stats,
    ...(bonus.ranged !== undefined ? { ranged: bonus.ranged } : {}),
  };
}

/** A party member's fighter for a fight. */
export function marinaraPartyFighter(id: string, name: string, progression: MarinaraCardProgression): MarinaraFighter {
  // Until a party member has gear of their own, they fight with their class's standard kit for their
  // level's tier, as the class and bestiary labs measured them (decided 2026-11-01).
  const archetype = marinaraClass(progression.activeClass)?.archetype ?? progression.primary;
  const equipment =
    progression.equipment ?? marinaraStandardEquipment(archetype, marinaraTierForLevel(progression.level));
  const gear = marinaraFighterGear(equipment, progression.stats.strength);
  return buildMarinaraPartyFighter({
    id,
    name,
    progression,
    gearStats: gear.stats,
    ...(gear.gear ? { gear: gear.gear } : {}),
    ...(gear.ranged !== undefined ? { rangedWeapon: gear.ranged } : {}),
  });
}

/** What a fight's setup said of an opponent, as Classic Marinara reads it. */
export interface MarinaraFoeBrief {
  id: string;
  name: string;
  hp?: number;
  maxHp?: number;
  boss?: unknown;
  /** The tier and archetype the setup gave it, where it gave them. */
  marinara?: Partial<
    Pick<MarinaraEnemySpec, "tier" | "archetype" | "classId" | "row" | "affinities" | "enemySkills" | "statScale">
  > & {
    /** Levels above (or below) the party's. */
    levelOffset?: number;
    /** A bestiary foe (marinara-bestiary.ts): its family, tier and level. */
    family?: { familyId: string; tier?: MarinaraEnemyTier; level?: number };
  };
  combatClass?: string;
  aiHints?: { named?: boolean; leader?: boolean; category?: string };
  skills?: Array<{ name?: string; spell?: boolean; type?: string }>;
}

const CLASS_ARCHETYPES: Record<string, MarinaraArchetype> = {
  fighter: "blade",
  knight: "guard",
  rogue: "scout",
  archer: "marksman",
  mage: "channeler",
  healer: "mender",
};

/** The tier a foe the setup gave none reads as: a boss is a boss, a named leader elite, a weak one
 *  (well under the party's HP) a minion, the rest standard. */
function tierOf(foe: MarinaraFoeBrief, partyHp: number): MarinaraEnemyTier {
  if (foe.marinara?.tier && (MARINARA_ENEMY_TIERS_LIST as readonly string[]).includes(foe.marinara.tier))
    return foe.marinara.tier;
  if (foe.boss) return "boss";
  if (foe.aiHints?.named || foe.aiHints?.leader) return "elite";
  const hp = foe.maxHp ?? foe.hp ?? 0;
  if (partyHp > 0 && hp > 0 && hp < partyHp * 0.5) return "minion";
  return "standard";
}

function archetypeOf(foe: MarinaraFoeBrief): MarinaraArchetype {
  if (foe.marinara?.archetype && (MARINARA_ARCHETYPES as readonly string[]).includes(foe.marinara.archetype))
    return foe.marinara.archetype;
  if (foe.marinara?.classId) {
    const def = marinaraClass(foe.marinara.classId);
    if (def) return def.archetype;
  }
  const byClass = foe.combatClass ? CLASS_ARCHETYPES[foe.combatClass.toLowerCase()] : undefined;
  if (byClass) return byClass;
  const guessed = guessMarinaraArchetype({ class: foe.name, abilities: (foe.skills ?? []).map((s) => s.name ?? "") });
  if (guessed !== "blade") return guessed;
  if ((foe.skills ?? []).some((s) => s.spell)) return "channeler";
  return "blade";
}

/**
 * A fight's foes as Classic Marinara fighters, built against the party's level and held to the
 * encounter budget for the party's size and the game's difficulty: over budget, foes drop a tier
 * and, last, the weakest stay out. A story's own fight (`keepAll`) is fought as written.
 */
export function marinaraFoeFighters(input: {
  foes: readonly MarinaraFoeBrief[];
  partyLevels: readonly number[];
  partyAverageHp: number;
  difficulty: string;
  keepAll?: boolean;
  /** The game's bestiary setting, for bestiary foes. */
  setting?: MarinaraBestiarySetting | null;
  /** The fight's own difficulty for bestiary foes (the GM's pick); Normal when none was given. */
  encounter?: MarinaraEncounterDifficulty;
}): { fighters: MarinaraFighter[]; left: string[]; notes: string[] } {
  // Bestiary foes are fitted by the bestiary's measured threat; the rest by tier.
  const bestiary = input.setting ? input.foes.filter((foe) => foe.marinara?.family?.familyId) : [];
  if (bestiary.length) {
    const rest = input.foes.filter((foe) => !bestiary.includes(foe));
    const fromBestiary = marinaraBestiaryFoes({ ...input, foes: bestiary, setting: input.setting! });
    const others = rest.length ? marinaraFoeFighters({ ...input, foes: rest, setting: null }) : null;
    return {
      fighters: [...fromBestiary.fighters, ...(others?.fighters ?? [])],
      left: [...fromBestiary.left, ...(others?.left ?? [])],
      notes: [...fromBestiary.notes, ...(others?.notes ?? [])],
    };
  }
  const level = marinaraPartyLevel(input.partyLevels);
  const tiers = input.foes.map((foe) => tierOf(foe, input.partyAverageHp));
  const fit = input.keepAll
    ? { tiers, dropped: [] as number[], changed: false }
    : fitMarinaraEncounter(tiers, marinaraEncounterBudget(input.partyLevels.length, input.difficulty));
  const notes: string[] = [];
  const fighters: MarinaraFighter[] = [];
  const left: string[] = [];
  input.foes.forEach((foe, index) => {
    if (fit.dropped.includes(index)) {
      left.push(foe.id);
      notes.push(`${foe.name} stays out of the fight (over the encounter budget).`);
      return;
    }
    let tier = fit.tiers[index]!;
    // The bestiary's floors hold for every foe: no boss below level 5, and so on (strict balance rule).
    const foeLevel = Math.max(1, level + (foe.marinara?.levelOffset ?? 0));
    while (tier !== "minion" && foeLevel < MARINARA_TIER_RULES[tier].minLevel)
      tier = tier === "boss" ? "elite" : tier === "elite" ? "standard" : "minion";
    if (tier !== tiers[index])
      notes.push(`${foe.name} fights as ${tier} instead of ${tiers[index]} (encounter budget).`);
    fighters.push(
      buildMarinaraEnemy({
        id: foe.id,
        name: foe.name,
        level: foeLevel,
        tier,
        archetype: archetypeOf(foe),
        ...(foe.marinara?.classId && marinaraClass(foe.marinara.classId) ? { classId: foe.marinara.classId } : {}),
        ...(foe.marinara?.row ? { row: foe.marinara.row } : {}),
        ...(foe.marinara?.affinities ? { affinities: foe.marinara.affinities } : {}),
        ...(foe.marinara?.enemySkills ? { enemySkills: foe.marinara.enemySkills } : {}),
        // No bestiary level growth here: it is measured with the bestiary's own threat fitting, and on the
        // flat tier budget it made level 20+ fights unwinnable on the Engine's AI (engine-balance, 2026-11-01).
        ...(foe.marinara?.statScale ? { statScale: foe.marinara.statScale } : {}),
      }),
    );
  });
  return { fighters, left, notes };
}

/**
 * How the game's difficulty setting scales a bestiary encounter's budget: it counts the party as this
 * many times its size (decided 2026-11-01, pending the bestiary's measurements). The fight's own
 * difficulty (easy to deadly) is the GM's per-fight pick on top.
 */
export const MARINARA_GAME_DIFFICULTY_SCALE: Record<string, number> = {
  casual: 0.8,
  normal: 1,
  hard: 1.15,
  brutal: 1.3,
};

function marinaraBestiaryFoes(input: {
  foes: readonly MarinaraFoeBrief[];
  partyLevels: readonly number[];
  difficulty: string;
  keepAll?: boolean;
  setting: MarinaraBestiarySetting;
  encounter?: MarinaraEncounterDifficulty;
}): { fighters: MarinaraFighter[]; left: string[]; notes: string[] } {
  const level = marinaraPartyLevel(input.partyLevels);
  const asked: Array<MarinaraEncounterFoe & { brief: MarinaraFoeBrief }> = input.foes.map((brief) => {
    const family = brief.marinara!.family!;
    return {
      brief,
      familyId: family.familyId,
      tier: family.tier ?? brief.marinara?.tier ?? "standard",
      level: family.level ?? level + (brief.marinara?.levelOffset ?? 0),
    };
  });
  const notes: string[] = [];
  let fitted: MarinaraEncounterFoe[] = asked;
  if (!input.keepAll) {
    const fit = marinaraFitEncounter({
      setting: input.setting,
      party: {
        level,
        size: Math.max(1, input.partyLevels.length * (MARINARA_GAME_DIFFICULTY_SCALE[input.difficulty] ?? 1)),
      },
      foes: asked.map(({ familyId, tier, level }) => ({ familyId, tier, level })),
      difficulty: input.encounter ?? "normal",
    });
    fitted = fit.foes;
    notes.push(...fit.changes);
  }
  // The fitter keeps foes in order and drops some: each fitted foe is the next asked one of its family.
  const fighters: MarinaraFighter[] = [];
  const used = new Set<number>();
  for (const foe of fitted) {
    const index = asked.findIndex((one, i) => !used.has(i) && one.familyId === foe.familyId);
    if (index < 0) continue;
    used.add(index);
    const brief = asked[index]!.brief;
    try {
      const spec = marinaraEnemySpec({
        familyId: foe.familyId,
        setting: input.setting,
        level: foe.level,
        tier: foe.tier,
        id: brief.id,
        name: brief.name,
      });
      fighters.push({
        ...buildMarinaraEnemy({
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
        }),
        familyId: foe.familyId,
      });
    } catch (err) {
      notes.push(`${brief.name}: ${err instanceof Error ? err.message : "not in the bestiary"}; fights by tier.`);
      fighters.push(
        ...marinaraFoeFighters({ ...input, foes: [brief], partyAverageHp: 0, keepAll: true, setting: null }).fighters,
      );
    }
  }
  const left = asked.filter((_, i) => !used.has(i)).map((one) => one.brief.id);
  return { fighters, left, notes };
}
