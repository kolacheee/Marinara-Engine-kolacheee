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
import { marinaraGearBonus, type MarinaraEquipment } from "./marinara-items.js";

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
  const gear = marinaraFighterGear(progression.equipment, progression.stats.strength);
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
}): { fighters: MarinaraFighter[]; left: string[]; notes: string[] } {
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
    const tier = fit.tiers[index]!;
    if (tier !== tiers[index])
      notes.push(`${foe.name} fights as ${tier} instead of ${tiers[index]} (encounter budget).`);
    fighters.push(
      buildMarinaraEnemy({
        id: foe.id,
        name: foe.name,
        level: Math.max(1, level + (foe.marinara?.levelOffset ?? 0)),
        tier,
        archetype: archetypeOf(foe),
        ...(foe.marinara?.classId && marinaraClass(foe.marinara.classId) ? { classId: foe.marinara.classId } : {}),
        ...(foe.marinara?.row ? { row: foe.marinara.row } : {}),
        ...(foe.marinara?.affinities ? { affinities: foe.marinara.affinities } : {}),
        ...(foe.marinara?.enemySkills ? { enemySkills: foe.marinara.enemySkills } : {}),
        ...(foe.marinara?.statScale ? { statScale: foe.marinara.statScale } : {}),
      }),
    );
  });
  return { fighters, left, notes };
}
