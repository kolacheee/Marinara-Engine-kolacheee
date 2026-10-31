// ──────────────────────────────────────────────
// Game: Marinara's own classes and growth (Classic Marinara)
//
// The rules a game on Marinara's own rules (no ruleset) grows its party by, in every combat mode
// it can be played in (Classic menu battles and Tactical boards). Pure data and math: nothing here
// reads storage or calls a model. Class and skill labels are placeholders: a game names them in its
// setting's own words.
//
//   - Eight stats, rising on level-up at random, weighted by the class's growth and the
//     character's hidden aptitudes, with a floor (at least two stats a level) and a drift guard
//     (a stat that falls well behind its expected value catches up).
//   - Eight archetype trees of seven classes: a base class, two advanced classes at class level
//     10, a master class for each at class level 20, and a pure branch (one advanced class and its
//     master) open only to a character whose secondary tree is their primary one.
//   - A character trains in two trees: the primary from their sheet, the secondary from the
//     temperament they started the game with.
//   - Only the active class's skills are used, plus up to four carried from classes trained in.
//   - Skills cost MP (magic) or stamina (everything else). Damage has a type (slash, pierce, blunt,
//     fire, ice, lightning, light, dark) that foes can be weak to, resist, be immune to or absorb.
// ──────────────────────────────────────────────

import { combatAiHash } from "./combat-ai.js";
import type { CombatTemperament } from "./combat-minds.js";

// ── Stats ──

export const MARINARA_STATS = ["hp", "strength", "magic", "skill", "speed", "defense", "resistance", "luck"] as const;
export type MarinaraStat = (typeof MARINARA_STATS)[number];
export type MarinaraStats = Record<MarinaraStat, number>;

export const MARINARA_LEVEL_CAP = 30;
/** The class level a class must reach before it promotes to the next tier. */
export const MARINARA_PROMOTION_LEVEL = { advanced: 10, master: 20 } as const;
/** Skills carried from other trained classes, actives and passives in any mix. */
export const MARINARA_CARRY_SLOTS = 4;
export const MARINARA_XP_PER_LEVEL = 100;
/** A level-up always raises at least this many stats. */
export const MARINARA_GROWTH_FLOOR = 2;
/** A stat this far under its expected value gets `MARINARA_DRIFT_BONUS` on its next roll. */
export const MARINARA_DRIFT_GAP = 3;
export const MARINARA_DRIFT_BONUS = 25;
/** Hidden aptitude points per stat, and what a character's aptitudes add up to. */
export const MARINARA_APTITUDE_RANGE = { min: -15, max: 20 } as const;
export const MARINARA_APTITUDE_TOTAL = 15;

const statRecord = (fill: (stat: MarinaraStat) => number): MarinaraStats =>
  Object.fromEntries(MARINARA_STATS.map((stat) => [stat, fill(stat)])) as MarinaraStats;

// ── Archetypes ──

export const MARINARA_ARCHETYPES = [
  "blade",
  "guard",
  "scout",
  "marksman",
  "arcanist",
  "hexer",
  "mender",
  "herald",
] as const;
export type MarinaraArchetype = (typeof MARINARA_ARCHETYPES)[number];

const stats = (
  hp: number,
  strength: number,
  magic: number,
  skill: number,
  speed: number,
  defense: number,
  resistance: number,
  luck: number,
): MarinaraStats => ({ hp, strength, magic, skill, speed, defense, resistance, luck });

/** Each archetype's base class at level 1, and its growth rates in percent. */
export const MARINARA_ARCHETYPE_BASES: Record<MarinaraArchetype, { start: MarinaraStats; growth: MarinaraStats }> = {
  blade: { start: stats(20, 7, 1, 6, 7, 5, 1, 4), growth: stats(75, 50, 5, 45, 50, 30, 10, 30) },
  guard: { start: stats(24, 6, 0, 4, 3, 9, 3, 3), growth: stats(90, 40, 0, 35, 20, 55, 20, 25) },
  scout: { start: stats(18, 5, 1, 7, 9, 3, 2, 7), growth: stats(60, 35, 10, 50, 60, 20, 20, 50) },
  marksman: { start: stats(18, 6, 1, 8, 6, 4, 2, 4), growth: stats(65, 45, 5, 60, 45, 25, 15, 30) },
  arcanist: { start: stats(16, 1, 8, 5, 5, 2, 6, 3), growth: stats(50, 5, 60, 40, 40, 15, 40, 25) },
  hexer: { start: stats(17, 1, 7, 5, 4, 2, 7, 4), growth: stats(55, 5, 50, 40, 35, 15, 50, 35) },
  mender: { start: stats(17, 1, 7, 4, 4, 2, 8, 6), growth: stats(55, 5, 50, 35, 35, 15, 55, 45) },
  herald: { start: stats(18, 3, 4, 5, 6, 3, 4, 8), growth: stats(60, 25, 30, 40, 45, 20, 30, 60) },
};

// ── Temperaments ──

/** The temperaments a party member may have: the ten dealt by chance, and three named ones. */
export const MARINARA_PARTY_TEMPERAMENTS = [
  "reckless",
  "cautious",
  "opportunistic",
  "protective",
  "supportive",
  "disciplined",
  "cowardly",
  "patient",
  "methodical",
  "coordinated",
  "arrogant",
  "cruel",
  "honourable",
] as const satisfies readonly CombatTemperament[];
export type MarinaraPartyTemperament = (typeof MARINARA_PARTY_TEMPERAMENTS)[number];

/** The tree a character's starting temperament opens as their secondary tree. */
export const MARINARA_TEMPERAMENT_TREES: Record<MarinaraPartyTemperament, MarinaraArchetype> = {
  reckless: "blade",
  protective: "guard",
  honourable: "guard",
  opportunistic: "scout",
  cowardly: "scout",
  patient: "marksman",
  cautious: "marksman",
  arrogant: "arcanist",
  methodical: "arcanist",
  cruel: "hexer",
  supportive: "mender",
  coordinated: "herald",
  disciplined: "herald",
};

export function isMarinaraPartyTemperament(value: unknown): value is MarinaraPartyTemperament {
  return typeof value === "string" && (MARINARA_PARTY_TEMPERAMENTS as readonly string[]).includes(value);
}

/** A character's two trees. A temperament that points back at the primary tree makes them Pure:
 *  one tree only, with its pure branch open. */
export function marinaraTrees(
  primary: MarinaraArchetype,
  temperament: MarinaraPartyTemperament,
): { primary: MarinaraArchetype; secondary: MarinaraArchetype | null; pure: boolean } {
  const secondary = MARINARA_TEMPERAMENT_TREES[temperament];
  return secondary === primary ? { primary, secondary: null, pure: true } : { primary, secondary, pure: false };
}

// ── Damage types ──

export const MARINARA_DAMAGE_TYPES = ["slash", "pierce", "blunt", "fire", "ice", "lightning", "light", "dark"] as const;
export type MarinaraDamageType = (typeof MARINARA_DAMAGE_TYPES)[number];
export const MARINARA_PHYSICAL_TYPES = ["slash", "pierce", "blunt"] as const satisfies readonly MarinaraDamageType[];
/** The elements a caster picks between when a spell is "in the caster's element". */
export const MARINARA_ELEMENTS = ["fire", "ice", "lightning"] as const satisfies readonly MarinaraDamageType[];
/**
 * What a skill hits with: a fixed type, the user's equipped weapon (Alyssa 2026-10-31: a Blade with
 * a mace hits blunt, and a carried Power Strike takes the type of whatever its user holds), the
 * caster's pick of element, or whichever physical type the target is weakest to.
 */
export type MarinaraSkillDamage = MarinaraDamageType | "weapon" | "element" | "any-physical";
export type MarinaraAffinity = "weak" | "resist" | "immune" | "absorb";
export type MarinaraAffinities = Partial<Record<MarinaraDamageType, MarinaraAffinity>>;
/** Damage multiplier per affinity; absorb heals the target instead. */
export const MARINARA_AFFINITY_MULTIPLIER: Record<MarinaraAffinity, number> = {
  weak: 1.5,
  resist: 0.5,
  immune: 0,
  absorb: -1,
};
/** Each archetype's basic attack: physical archetypes strike with their weapon, casters with magic. */
export const MARINARA_ARCHETYPE_ATTACKS: Record<MarinaraArchetype, MarinaraSkillDamage> = {
  blade: "weapon",
  guard: "weapon",
  scout: "weapon",
  marksman: "weapon",
  arcanist: "element",
  hexer: "dark",
  mender: "light",
  herald: "weapon",
};

/**
 * The weapon types each archetype can equip (swords and spears, maces and lances, and so on); a
 * class can widen it (`MarinaraClassDef.weapons`). Switching weapons is how a fighter answers a
 * resistance, as a caster answers one by changing element.
 */
export const MARINARA_ARCHETYPE_WEAPONS: Record<MarinaraArchetype, readonly MarinaraDamageType[]> = {
  blade: ["slash", "pierce"],
  guard: ["blunt", "pierce"],
  scout: ["slash", "pierce"],
  marksman: ["pierce", "blunt"],
  arcanist: ["blunt"],
  hexer: ["blunt", "pierce"],
  mender: ["blunt"],
  herald: ["slash", "pierce"],
};

/** The weapon types a character can equip in this class. */
export function marinaraWeaponTypes(classId: string): readonly MarinaraDamageType[] {
  const def = marinaraClass(classId);
  if (!def) return [];
  return def.weapons ?? MARINARA_ARCHETYPE_WEAPONS[def.archetype];
}

/**
 * The concrete types a skill can hit with in this class, `weapon` meaning every weapon type the
 * class can equip (the best one is the one a character would have in hand).
 */
export function marinaraDamageOptions(damage: MarinaraSkillDamage, classId: string): readonly MarinaraDamageType[] {
  if (damage === "weapon") return marinaraWeaponTypes(classId);
  if (damage === "element") return MARINARA_ELEMENTS;
  if (damage === "any-physical") return MARINARA_PHYSICAL_TYPES;
  return [damage];
}

export function marinaraAffinityMultiplier(
  affinities: MarinaraAffinities | undefined,
  type: MarinaraDamageType,
): number {
  const affinity = affinities?.[type];
  return affinity ? MARINARA_AFFINITY_MULTIPLIER[affinity] : 1;
}

/** The best type to hit a target with out of `options`, and its multiplier. */
export function marinaraBestDamageType(
  options: readonly MarinaraDamageType[],
  affinities: MarinaraAffinities | undefined,
): { type: MarinaraDamageType; multiplier: number } {
  let best = { type: options[0]!, multiplier: marinaraAffinityMultiplier(affinities, options[0]!) };
  for (const type of options.slice(1)) {
    const multiplier = marinaraAffinityMultiplier(affinities, type);
    if (multiplier > best.multiplier) best = { type, multiplier };
  }
  return best;
}

// ── Resources ──

/** Magic skills spend MP, which does not come back in a fight. Everything else spends stamina. */
export type MarinaraResource = "mp" | "stamina";
export const MARINARA_MP = { base: 8, perMagic: 2 } as const;
/** Stamina comes back a little each turn, and more on a turn spent defending. */
export const MARINARA_STAMINA = {
  base: 10,
  perStrength: 1,
  perSpeed: 0.5,
  regenPct: 0.1,
  defendRegenPct: 0.25,
} as const;

export function marinaraMaxMp(stats: Pick<MarinaraStats, "magic">): number {
  return Math.round(MARINARA_MP.base + stats.magic * MARINARA_MP.perMagic);
}

export function marinaraMaxStamina(stats: Pick<MarinaraStats, "strength" | "speed">): number {
  return Math.round(
    MARINARA_STAMINA.base + stats.strength * MARINARA_STAMINA.perStrength + stats.speed * MARINARA_STAMINA.perSpeed,
  );
}

// ── Classes and skills ──

export type MarinaraClassTier = "base" | "advanced" | "master";

export interface MarinaraSkillDef {
  id: string;
  label: string;
  kind: "active" | "passive";
  /** The class level it is learned at, in the class that teaches it. */
  learnedAt: number;
  /** The stat its power runs on, so a carried skill runs on its user's own stat. */
  scales?: MarinaraStat;
  /** What using it costs, in `resource`. */
  cost?: number;
  resource?: MarinaraResource;
  /** What a damaging skill hits with. */
  damage?: MarinaraSkillDamage;
  /** Designed to be worth carrying into other classes. Any skill can be carried. */
  carryPick?: boolean;
  summary: string;
}

export interface MarinaraClassDef {
  id: string;
  label: string;
  archetype: MarinaraArchetype;
  tier: MarinaraClassTier;
  /** Open only to a Pure character of this archetype. */
  pure: boolean;
  /** The class it promotes from; none for a base class. */
  from?: string;
  role: string;
  /** Weapon types it can equip, when wider than its archetype's. */
  weapons?: readonly MarinaraDamageType[];
  /** The stats it grows best: a promoted class adds to these. */
  leans: readonly MarinaraStat[];
  skills: readonly MarinaraSkillDef[];
}

/** The damage type of every damaging active skill. */
const SKILL_DAMAGE: Record<string, MarinaraSkillDamage> = {
  "power-strike": "weapon",
  flurry: "weapon",
  "moonless-cut": "weapon",
  "reckless-swing": "weapon",
  "sweeping-ruin": "weapon",
  arsenal: "any-physical",
  "thousand-edges": "weapon",
  verdict: "light",
  backstab: "weapon",
  "hit-and-run": "weapon",
  shadowstep: "dark",
  "aimed-shot": "weapon",
  pierce: "pierce",
  headshot: "weapon",
  volley: "weapon",
  "ruinous-barrage": "blunt",
  "element-bolt": "element",
  "twin-cast": "element",
  tempest: "element",
  glyph: "element",
  starfall: "light",
  convergence: "element",
  siphon: "dark",
};

const active = (
  id: string,
  label: string,
  learnedAt: number,
  scales: MarinaraStat,
  cost: number,
  summary: string,
  carryPick = false,
): MarinaraSkillDef => ({
  id,
  label,
  kind: "active",
  learnedAt,
  scales,
  cost,
  resource: scales === "magic" ? "mp" : "stamina",
  ...(SKILL_DAMAGE[id] ? { damage: SKILL_DAMAGE[id] } : {}),
  summary,
  ...(carryPick ? { carryPick } : {}),
});
const passive = (
  id: string,
  label: string,
  learnedAt: number,
  summary: string,
  carryPick = false,
): MarinaraSkillDef => ({
  id,
  label,
  kind: "passive",
  learnedAt,
  summary,
  ...(carryPick ? { carryPick } : {}),
});

type ClassRow = Omit<MarinaraClassDef, "archetype" | "tier" | "pure"> & { tier?: MarinaraClassTier; pure?: boolean };

/** One tree, in the order base, advanced A, master A, advanced B, master B, pure advanced, pure master. */
function tree(archetype: MarinaraArchetype, rows: readonly ClassRow[]): MarinaraClassDef[] {
  const tiers: Array<[MarinaraClassTier, boolean]> = [
    ["base", false],
    ["advanced", false],
    ["master", false],
    ["advanced", false],
    ["master", false],
    ["advanced", true],
    ["master", true],
  ];
  return rows.map((row, index) => ({ ...row, archetype, tier: tiers[index]![0], pure: tiers[index]![1] }));
}

export const MARINARA_CLASSES: readonly MarinaraClassDef[] = [
  ...tree("blade", [
    {
      id: "blade",
      label: "Blade",
      role: "Front-row striker",
      leans: ["strength", "speed"],
      skills: [
        active("power-strike", "Power Strike", 1, "strength", 0, "A heavy hit that delays the user's next turn.", true),
      ],
    },
    {
      id: "duelist",
      label: "Duelist",
      from: "blade",
      role: "Single-target crits and counters",
      leans: ["speed", "skill"],
      skills: [
        active("flurry", "Flurry", 10, "speed", 4, "Two quick hits."),
        passive("riposte", "Riposte", 12, "Counters a melee attack that misses."),
        passive("keen-edge", "Keen Edge", 15, "+10% crit chance.", true),
      ],
    },
    {
      id: "sword-saint",
      label: "Sword Saint",
      from: "duelist",
      role: "Ends duels in one turn",
      leans: ["speed", "skill"],
      skills: [
        active("moonless-cut", "Moonless Cut", 20, "skill", 8, "A crit-boosted finisher.", true),
        passive("second-wind", "Second Wind", 24, "Acts again on a kill, once a round."),
      ],
    },
    {
      id: "ravager",
      label: "Ravager",
      from: "blade",
      role: "Grows deadlier as it is hurt",
      leans: ["strength", "hp"],
      skills: [
        active("reckless-swing", "Reckless Swing", 10, "strength", 3, "A big hit that lowers the user's Defense."),
        passive("bloodrage", "Bloodrage", 12, "More damage below half HP."),
        passive("bloodlust", "Bloodlust", 15, "Heals 10% of max HP on a kill.", true),
      ],
    },
    {
      id: "warbringer",
      label: "Warbringer",
      from: "ravager",
      role: "Cleaves the front row",
      leans: ["strength", "hp"],
      skills: [
        active("sweeping-ruin", "Sweeping Ruin", 20, "strength", 8, "Hits the whole enemy front row.", true),
        passive("unstoppable", "Unstoppable", 24, "Cannot be stunned while below half HP."),
      ],
    },
    {
      id: "weaponmaster",
      label: "Weaponmaster",
      from: "blade",
      role: "Every weapon, every answer",
      weapons: ["slash", "pierce", "blunt"],
      leans: ["strength", "skill", "speed"],
      skills: [
        active("arsenal", "Arsenal", 10, "strength", 4, "An attack against the target's weakest defense.", true),
        passive("adaptive-grip", "Adaptive Grip", 15, "No penalty against armoured or evasive foes."),
      ],
    },
    {
      id: "paragon-of-arms",
      label: "Paragon of Arms",
      from: "weaponmaster",
      role: "The pinnacle of the blade",
      weapons: ["slash", "pierce", "blunt"],
      leans: ["strength", "skill", "speed", "defense"],
      skills: [
        active("thousand-edges", "Thousand Edges", 20, "strength", 12, "One hit on every living enemy."),
        passive("peerless", "Peerless", 25, "An extra action every third round.", true),
      ],
    },
  ]),
  ...tree("guard", [
    {
      id: "guard",
      label: "Guard",
      role: "Front-row protector",
      leans: ["hp", "defense"],
      skills: [
        active("cover", "Cover", 1, "defense", 0, "Takes the next hit aimed at an ally."),
        active("challenge", "Challenge", 1, "defense", 2, "One enemy must target the user for 2 turns.", true),
        passive(
          "hold-the-line",
          "Hold the Line",
          5,
          "Tactical: a foe that moves next to the user stops there, and one that leaves its reach takes a free attack.",
        ),
        passive("stalwart", "Stalwart", 5, "+20% Defense while defending.", true),
      ],
    },
    {
      id: "sentinel",
      label: "Sentinel",
      from: "guard",
      role: "Damage sponge, taunts",
      leans: ["hp", "defense"],
      skills: [
        active("provoke", "Provoke", 10, "defense", 3, "Every enemy must target the user for a round.", true),
        passive("shield-wall", "Shield Wall", 15, "The back row takes less damage while the user stands."),
        passive("retaliate", "Retaliate", 18, "Counters any melee hit.", true),
      ],
    },
    {
      id: "bastion",
      label: "Bastion",
      from: "sentinel",
      role: "Nothing gets past",
      leans: ["hp", "defense", "resistance"],
      skills: [
        active("fortress", "Fortress", 20, "defense", 12, "The party takes half damage for a round. Long cooldown."),
        passive("last-stand", "Last Stand", 24, "Survives one lethal hit a fight.", true),
      ],
    },
    {
      id: "warden",
      label: "Warden",
      from: "guard",
      role: "Wards the party against magic (an old oath, nature and light)",
      leans: ["resistance", "hp"],
      skills: [
        active("spellguard", "Spellguard", 10, "resistance", 4, "+30% Resistance to the party for 2 rounds."),
        passive(
          "aura-of-warding",
          "Aura of Warding",
          15,
          "Allies take 35% less magic damage while the user stands.",
          true,
        ),
      ],
    },
    {
      id: "elder-warden",
      label: "Elder Warden",
      from: "warden",
      role: "Unbowed by any spell",
      leans: ["resistance", "hp", "defense"],
      skills: [
        active("verdict", "Verdict", 20, "resistance", 8, "Light damage based on the user's Resistance.", true),
        passive("elder-oath", "Elder Oath", 24, "+50% Resistance; immune to Doom and sleep."),
      ],
    },
    {
      id: "aegis",
      label: "Aegis",
      from: "guard",
      role: "Guards against everything",
      leans: ["hp", "defense", "resistance"],
      skills: [
        active(
          "warding-stance",
          "Warding Stance",
          10,
          "resistance",
          4,
          "Defending blocks magic as well as steel.",
          true,
        ),
        passive("immovable", "Immovable", 15, "Immune to push and stagger."),
      ],
    },
    {
      id: "unbroken",
      label: "Unbroken",
      from: "aegis",
      role: "The wall that never falls",
      leans: ["hp", "defense", "resistance", "luck"],
      skills: [
        active(
          "oath-of-iron",
          "Oath of Iron",
          20,
          "defense",
          15,
          "Allies cannot drop below 1 HP for a round. Once a fight.",
        ),
        passive("bulwark-aura", "Bulwark Aura", 25, "The front row gains Defense.", true),
      ],
    },
  ]),
  ...tree("scout", [
    {
      id: "scout",
      label: "Scout",
      role: "Quick, slippery, opportunist",
      leans: ["speed", "luck"],
      skills: [
        active("steal", "Steal", 1, "speed", 0, "Takes an item or gold from an enemy.", true),
        passive("light-feet", "Light Feet", 5, "Better dodge."),
      ],
    },
    {
      id: "rogue",
      label: "Rogue",
      from: "scout",
      role: "Crits from the shadows",
      leans: ["skill", "luck"],
      skills: [
        active("backstab", "Backstab", 10, "skill", 3, "More damage to a target busy with an ally."),
        passive("exploit", "Exploit", 15, "Crits more against debuffed targets.", true),
      ],
    },
    {
      id: "phantom",
      label: "Phantom",
      from: "rogue",
      role: "Unseen killer",
      leans: ["skill", "luck", "speed"],
      skills: [
        active("vanish", "Vanish", 20, "speed", 8, "Untargetable for a turn; the next hit crits.", true),
        passive("assassinate", "Assassinate", 24, "A crit on a target below 15% HP defeats it. Never bosses."),
      ],
    },
    {
      id: "skirmisher",
      label: "Skirmisher",
      from: "scout",
      role: "Acts often, moves the fight",
      leans: ["speed"],
      skills: [
        active("hit-and-run", "Hit and Run", 10, "speed", 3, "An attack after which the user's turn comes sooner."),
        passive("fleet", "Fleet", 15, "+Speed.", true),
      ],
    },
    {
      id: "windrunner",
      label: "Windrunner",
      from: "skirmisher",
      role: "Owns the turn order",
      leans: ["speed", "skill"],
      skills: [
        active("double-time", "Double Time", 20, "speed", 10, "Two actions this turn."),
        passive("tailwind", "Tailwind", 24, "The whole party acts a little sooner.", true),
      ],
    },
    {
      id: "shade",
      label: "Shade",
      from: "scout",
      role: "Lives in the enemy's blind spots",
      leans: ["speed", "skill", "luck"],
      skills: [
        active("shadowstep", "Shadowstep", 10, "skill", 4, "Strikes the back row from the front.", true),
        passive("elusive", "Elusive", 15, "The first hit each round misses."),
      ],
    },
    {
      id: "veil-lord",
      label: "Veil Lord",
      from: "shade",
      role: "Untouchable",
      leans: ["speed", "luck", "skill", "hp"],
      skills: [
        active(
          "thousand-shadows",
          "Thousand Shadows",
          20,
          "speed",
          14,
          "Decoys absorb the next 3 hits on the party.",
          true,
        ),
        passive("perfect-evasion", "Perfect Evasion", 25, "Dodge rises with each miss against the user."),
      ],
    },
  ]),
  ...tree("marksman", [
    {
      id: "marksman",
      label: "Marksman",
      role: "Back-row damage",
      leans: ["skill", "strength"],
      skills: [
        active("aimed-shot", "Aimed Shot", 1, "skill", 0, "A shot that rarely misses but delays the next turn."),
        passive("true-aim", "True Aim", 5, "+15% hit chance.", true),
      ],
    },
    {
      id: "sharpshooter",
      label: "Sharpshooter",
      from: "marksman",
      role: "Precision, weak points",
      leans: ["skill"],
      skills: [
        active("pierce", "Pierce", 10, "skill", 4, "Ignores half the target's Defense.", true),
        passive("steady", "Steady", 15, "No hit penalty from weather."),
      ],
    },
    {
      id: "deadeye",
      label: "Deadeye",
      from: "sharpshooter",
      role: "One shot, one kill",
      leans: ["skill", "strength"],
      skills: [
        active("headshot", "Headshot", 20, "skill", 10, "A huge single hit after a turn of charging."),
        passive("overwatch", "Overwatch", 24, "Shoots the first enemy to act each round.", true),
      ],
    },
    {
      id: "hunter",
      label: "Hunter",
      from: "marksman",
      role: "Marks and traps",
      leans: ["skill", "speed"],
      skills: [
        active("mark-prey", "Mark Prey", 10, "skill", 3, "The target takes more damage from everyone.", true),
        passive("tracker", "Tracker", 15, "Sees enemy weaknesses."),
      ],
    },
    {
      id: "grand-hunter",
      label: "Grand Hunter",
      from: "hunter",
      role: "Controls the hunt",
      leans: ["skill", "speed", "luck"],
      skills: [
        active("snare-field", "Snare Field", 20, "skill", 10, "Enemies that act are slowed."),
        passive("pack-tactics", "Pack Tactics", 24, "More damage to a marked target.", true),
      ],
    },
    {
      id: "artillerist",
      label: "Artillerist",
      from: "marksman",
      role: "Area fire from afar",
      leans: ["strength", "skill"],
      skills: [
        active("volley", "Volley", 10, "strength", 6, "A weaker hit on every enemy.", true),
        passive("heavy-draw", "Heavy Draw", 15, "More damage, acts later."),
      ],
    },
    {
      id: "siegebreaker",
      label: "Siegebreaker",
      from: "artillerist",
      role: "Breaks armies and armour",
      leans: ["strength", "skill", "hp"],
      skills: [
        active("ruinous-barrage", "Ruinous Barrage", 20, "strength", 14, "A big area hit that shatters Defense."),
        passive("sundering", "Sundering", 25, "Hits lower the target's Defense.", true),
      ],
    },
  ]),
  ...tree("arcanist", [
    {
      id: "arcanist",
      label: "Arcanist",
      role: "Back-row caster",
      leans: ["magic"],
      skills: [active("element-bolt", "Element Bolt", 1, "magic", 3, "One target, in the caster's element.", true)],
    },
    {
      id: "elementalist",
      label: "Elementalist",
      from: "arcanist",
      role: "Chains elements into reactions",
      leans: ["magic", "skill"],
      skills: [
        active("twin-cast", "Twin Cast", 10, "magic", 6, "Two elements at once, setting up reactions."),
        passive("attunement", "Attunement", 15, "Reactions hit harder.", true),
      ],
    },
    {
      id: "stormcaller",
      label: "Stormcaller",
      from: "elementalist",
      role: "Area devastation",
      leans: ["magic", "speed"],
      skills: [
        active("tempest", "Tempest", 20, "magic", 14, "Hits every enemy with a chosen element.", true),
        passive("overcharge", "Overcharge", 24, "Spells crit on a reaction."),
      ],
    },
    {
      id: "rune-scholar",
      label: "Rune Scholar",
      from: "arcanist",
      role: "Wards and prepared spells",
      leans: ["magic", "resistance"],
      skills: [
        active("glyph", "Glyph", 10, "magic", 5, "A spell set now that fires on the next enemy to act."),
        passive("spell-ward", "Spell Ward", 15, "+Resistance.", true),
      ],
    },
    {
      id: "runelord",
      label: "Runelord",
      from: "rune-scholar",
      role: "Bends the battlefield",
      leans: ["magic", "resistance"],
      skills: [
        active("seal", "Seal", 20, "magic", 10, "Locks an enemy's skills for 2 turns."),
        passive("prepared-mind", "Prepared Mind", 24, "The first spell each fight costs no MP.", true),
      ],
    },
    {
      id: "astral-adept",
      label: "Astral Adept",
      from: "arcanist",
      role: "Raw, unaligned power",
      leans: ["magic", "resistance", "skill"],
      skills: [
        active("starfall", "Starfall", 10, "magic", 7, "Non-elemental; ignores resistances."),
        passive("deep-well", "Deep Well", 15, "+MP.", true),
      ],
    },
    {
      id: "starweaver",
      label: "Starweaver",
      from: "astral-adept",
      role: "Magic at its source",
      leans: ["magic", "resistance", "skill", "speed"],
      skills: [
        active("convergence", "Convergence", 20, "magic", 18, "A turn of charging, then a massive hit."),
        passive("mana-tide", "Mana Tide", 25, "MP returns each round.", true),
      ],
    },
  ]),
  ...tree("hexer", [
    {
      id: "hexer",
      label: "Hexer",
      role: "Weakens enemies",
      leans: ["magic", "resistance"],
      skills: [active("weaken", "Weaken", 1, "magic", 3, "-20% Strength or Magic for 3 rounds.", true)],
    },
    {
      id: "witch",
      label: "Witch",
      from: "hexer",
      role: "Curses and damage over time",
      leans: ["magic"],
      skills: [
        active("rot", "Rot", 10, "magic", 5, "A poison that spreads when its target falls."),
        passive("lingering", "Lingering", 15, "Debuffs last a round longer.", true),
      ],
    },
    {
      id: "doom-oracle",
      label: "Doom Oracle",
      from: "witch",
      role: "Seals fates",
      leans: ["magic", "luck"],
      skills: [
        active("doom", "Doom", 20, "magic", 12, "The target falls in 3 turns unless cleansed. Never bosses."),
        passive("ill-omen", "Ill Omen", 24, "Enemy crits sometimes become misses.", true),
      ],
    },
    {
      id: "mesmer",
      label: "Mesmer",
      from: "hexer",
      role: "Sleep, confusion, delay",
      leans: ["magic", "speed"],
      skills: [
        active("lull", "Lull", 10, "magic", 5, "Sleep until hit.", true),
        passive("slow-time", "Slow Time", 15, "Debuffed enemies act later."),
      ],
    },
    {
      id: "dreamweaver",
      label: "Dreamweaver",
      from: "mesmer",
      role: "Takes enemies out of the fight",
      leans: ["magic", "speed"],
      skills: [
        active("mass-confusion", "Mass Confusion", 20, "magic", 14, "Enemies may strike each other."),
        passive("nightmare", "Nightmare", 24, "Sleeping enemies take damage.", true),
      ],
    },
    {
      id: "void-binder",
      label: "Void Binder",
      from: "hexer",
      role: "Steals power",
      leans: ["magic", "resistance", "luck"],
      skills: [
        active("siphon", "Siphon", 10, "magic", 5, "Steals a buff or drains MP.", true),
        passive("null", "Null", 15, "Immune to debuffs."),
      ],
    },
    {
      id: "eclipse",
      label: "Eclipse",
      from: "void-binder",
      role: "Darkness made will",
      leans: ["magic", "resistance", "luck", "hp"],
      skills: [
        active(
          "total-eclipse",
          "Total Eclipse",
          20,
          "magic",
          18,
          "Strips every enemy buff and lowers their stats for 2 rounds.",
        ),
        passive("devour", "Devour", 25, "Heals when a debuff the user placed expires.", true),
      ],
    },
  ]),
  ...tree("mender", [
    {
      id: "mender",
      label: "Mender",
      role: "Keeps the party up",
      leans: ["magic", "resistance"],
      skills: [active("mend", "Mend", 1, "magic", 3, "Heals one ally.", true)],
    },
    {
      id: "cleric",
      label: "Cleric",
      from: "mender",
      role: "Big heals and revival",
      leans: ["magic", "resistance"],
      skills: [
        active("revive", "Revive", 10, "magic", 10, "Brings back a downed ally at 25% HP.", true),
        passive("grace", "Grace", 15, "Heals can crit."),
      ],
    },
    {
      id: "saint",
      label: "Saint",
      from: "cleric",
      role: "Saves the whole party",
      leans: ["magic", "resistance", "luck"],
      skills: [
        active("sanctuary", "Sanctuary", 20, "magic", 16, "Heals everyone and cleanses one debuff each."),
        passive("miracle", "Miracle", 24, "Once a fight, a downed ally rises on their own.", true),
      ],
    },
    {
      id: "apothecary",
      label: "Apothecary",
      from: "mender",
      role: "Items, cures and regeneration",
      leans: ["skill", "magic"],
      skills: [
        active("remedy", "Remedy", 10, "magic", 4, "Cleanses all debuffs on one ally."),
        passive("item-savant", "Item Savant", 15, "Items work 50% better.", true),
      ],
    },
    {
      id: "panacean",
      label: "Panacean",
      from: "apothecary",
      role: "Nothing lingers",
      leans: ["skill", "magic", "speed"],
      skills: [
        active("elixir-rain", "Elixir Rain", 20, "magic", 12, "The party regenerates for 3 rounds.", true),
        passive("double-dose", "Double Dose", 24, "Using an item is a free action once a round."),
      ],
    },
    {
      id: "lifebinder",
      label: "Lifebinder",
      from: "mender",
      role: "Prevents harm, not just mends it",
      leans: ["magic", "resistance", "hp"],
      skills: [
        active("barrier", "Barrier", 10, "magic", 6, "A shield that absorbs damage.", true),
        passive("overheal", "Overheal", 15, "Healing past full becomes a shield."),
      ],
    },
    {
      id: "eternal",
      label: "Eternal",
      from: "lifebinder",
      role: "Death has no hold",
      leans: ["magic", "resistance", "hp", "luck"],
      skills: [
        active(
          "undying-light",
          "Undying Light",
          20,
          "magic",
          20,
          "The downed party revives at 50% once. Long cooldown.",
        ),
        passive("sanctified", "Sanctified", 25, "The party takes less magic damage.", true),
      ],
    },
  ]),
  ...tree("herald", [
    {
      id: "herald",
      label: "Herald",
      role: "Lifts the party",
      leans: ["luck", "speed"],
      skills: [active("rally", "Rally", 1, "luck", 3, "+15% attack to the party for 2 rounds.", true)],
    },
    {
      id: "chanter",
      label: "Chanter",
      from: "herald",
      role: "Songs that stack",
      leans: ["luck", "magic"],
      skills: [
        active("battle-hymn", "Battle Hymn", 10, "magic", 5, "A lasting party buff while the user keeps chanting."),
        passive("encore", "Encore", 15, "Buffs the user gives last a round longer.", true),
      ],
    },
    {
      id: "maestro",
      label: "Maestro",
      from: "chanter",
      role: "Conducts the fight",
      leans: ["luck", "magic", "speed"],
      skills: [
        active("crescendo", "Crescendo", 20, "magic", 14, "Every active party buff doubles for a round."),
        passive("tempo", "Tempo", 24, "The party acts sooner after each buff.", true),
      ],
    },
    {
      id: "tactician",
      label: "Tactician",
      from: "herald",
      role: "Orders allies",
      leans: ["speed", "skill"],
      skills: [
        active("command", "Command", 10, "skill", 6, "An ally acts right now.", true),
        passive("foresight", "Foresight", 15, "The party sees the next enemy action."),
      ],
    },
    {
      id: "marshal",
      label: "Marshal",
      from: "tactician",
      role: "Turns a party into an army",
      leans: ["speed", "skill", "luck"],
      skills: [
        active(
          "grand-strategy",
          "Grand Strategy",
          20,
          "skill",
          18,
          "Every ally acts once, in an order the user chooses.",
        ),
        passive("formation", "Formation", 24, "+Defense to the party while no one is downed.", true),
      ],
    },
    {
      id: "standard-bearer",
      label: "Standard-Bearer",
      from: "herald",
      role: "The flag the party fights under",
      leans: ["luck", "hp", "defense"],
      skills: [
        active(
          "raise-the-banner",
          "Raise the Banner",
          10,
          "luck",
          6,
          "The party cannot lose heart and deals more damage.",
        ),
        passive("inspire", "Inspire", 15, "Limit meters fill faster.", true),
      ],
    },
    {
      id: "exalted",
      label: "Exalted",
      from: "standard-bearer",
      role: "Legends follow them",
      leans: ["luck", "speed", "hp", "skill"],
      skills: [
        active("hour-of-heroes", "Hour of Heroes", 20, "luck", 20, "The party takes an extra turn. Once a fight."),
        passive("fortunes-favour", "Fortune's Favour", 25, "The party crits more.", true),
      ],
    },
  ]),
];

const CLASS_BY_ID = new Map(MARINARA_CLASSES.map((def) => [def.id, def]));

export function marinaraClass(id: string): MarinaraClassDef | undefined {
  return CLASS_BY_ID.get(id);
}

/** The base class a tree starts in. */
export function marinaraBaseClass(archetype: MarinaraArchetype): MarinaraClassDef {
  return MARINARA_CLASSES.find((def) => def.archetype === archetype && def.tier === "base")!;
}

/** Growth rates of a class: its archetype's, plus 10 on each of its leans for an advanced class and
 *  15 for a master. */
export function marinaraClassGrowth(def: MarinaraClassDef): MarinaraStats {
  const base = MARINARA_ARCHETYPE_BASES[def.archetype].growth;
  const lift = def.tier === "base" ? 0 : def.tier === "advanced" ? 10 : 15;
  return statRecord((stat) => base[stat] + (def.leans.includes(stat) ? lift : 0));
}

/** What promoting into a class adds at once: its leans +2 (+3 for a master), HP +4 (+5), and +1 to
 *  every other stat its archetype grows at all. */
export function marinaraPromotionBonus(def: MarinaraClassDef): MarinaraStats {
  if (def.tier === "base") return statRecord(() => 0);
  const master = def.tier === "master";
  const growth = MARINARA_ARCHETYPE_BASES[def.archetype].growth;
  return statRecord((stat) =>
    stat === "hp"
      ? (master ? 5 : 4) + (def.leans.includes("hp") ? 1 : 0)
      : def.leans.includes(stat)
        ? master
          ? 3
          : 2
        : growth[stat] > 10
          ? 1
          : 0,
  );
}

// ── A character's progression ──

export interface MarinaraProgression {
  primary: MarinaraArchetype;
  /** The temperament the character started the game with; their secondary tree follows it. */
  temperament: MarinaraPartyTemperament;
  level: number;
  xp: number;
  activeClass: string;
  /** Class level of every class trained in, by class id. */
  classLevels: Record<string, number>;
  /** Class XP toward the next class level, by class id. */
  classXp: Record<string, number>;
  stats: MarinaraStats;
  /** Fractional stats the character's growth would give on average, for the drift guard. */
  expected: MarinaraStats;
  /** Hidden: never shown as numbers. */
  aptitudes: MarinaraStats;
  /** Up to four skill ids carried from other trained classes. */
  carried: string[];
}

/** A deterministic random stream from a string seed (mulberry32). */
export function marinaraRandom(seed: string): () => number {
  let state = combatAiHash(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hidden aptitudes, rolled once per game. `lean` (−1 to 1 per stat) is how the character's
 * Description leans each stat, read by the model; the roll stays the Engine's. Each stat ends within
 * `MARINARA_APTITUDE_RANGE` and the stats add up to `MARINARA_APTITUDE_TOTAL`.
 */
export function rollMarinaraAptitudes(seed: string, lean: Partial<Record<MarinaraStat, number>> = {}): MarinaraStats {
  const random = marinaraRandom(`aptitudes:${seed}`);
  const { min, max } = MARINARA_APTITUDE_RANGE;
  const clampStat = (value: number) => Math.max(min, Math.min(max, Math.round(value)));
  const out = statRecord((stat) => {
    const tilt = Math.max(-1, Math.min(1, lean[stat] ?? 0));
    return clampStat(random() * 20 - 8 + tilt * 10);
  });
  // Spread what the stats are off by over the stats with room, a point at a time.
  for (let guard = 0; guard < 400; guard++) {
    const gap = MARINARA_APTITUDE_TOTAL - MARINARA_STATS.reduce((sum, stat) => sum + out[stat], 0);
    if (gap === 0) break;
    const step = gap > 0 ? 1 : -1;
    const room = MARINARA_STATS.filter((stat) => (step > 0 ? out[stat] < max : out[stat] > min));
    if (room.length === 0) break;
    const stat = room[Math.floor(random() * room.length)]!;
    out[stat] += step;
  }
  return out;
}

/** A new character in their primary base class at level 1. */
export function createMarinaraProgression(input: {
  seed: string;
  primary: MarinaraArchetype;
  temperament: MarinaraPartyTemperament;
  lean?: Partial<Record<MarinaraStat, number>>;
}): MarinaraProgression {
  const base = marinaraBaseClass(input.primary);
  const start = MARINARA_ARCHETYPE_BASES[input.primary].start;
  return {
    primary: input.primary,
    temperament: input.temperament,
    level: 1,
    xp: 0,
    activeClass: base.id,
    classLevels: { [base.id]: 1 },
    classXp: { [base.id]: 0 },
    stats: { ...start },
    expected: { ...start },
    aptitudes: rollMarinaraAptitudes(input.seed, input.lean),
    carried: [],
  };
}

/** The classes a character may train in now: the base classes of their trees, and every class one
 *  promotion past a class they have trained in. */
export function marinaraOpenClasses(progression: MarinaraProgression): MarinaraClassDef[] {
  const trees = marinaraTrees(progression.primary, progression.temperament);
  const archetypes = [trees.primary, ...(trees.secondary ? [trees.secondary] : [])];
  return MARINARA_CLASSES.filter(
    (def) =>
      archetypes.includes(def.archetype) &&
      (!def.pure || trees.pure) &&
      (def.tier === "base" || (def.from !== undefined && progression.classLevels[def.from] !== undefined)),
  );
}

/** Why a character cannot take a class now, or null when they can. */
export function marinaraClassBlock(progression: MarinaraProgression, classId: string): string | null {
  const def = marinaraClass(classId);
  if (!def) return "unknown-class";
  if (!marinaraOpenClasses(progression).some((open) => open.id === classId)) return "not-in-trees";
  if (def.from) {
    const needed = MARINARA_PROMOTION_LEVEL[def.tier as "advanced" | "master"];
    if ((progression.classLevels[def.from] ?? 0) < needed) return "class-level";
  }
  return null;
}

/**
 * Makes a class the active one, out of combat. A class trained in before is switched back to as it
 * was; a promotion starts at its parent's class level and adds its promotion bonus once.
 */
export function setMarinaraClass(progression: MarinaraProgression, classId: string): MarinaraProgression {
  if (progression.classLevels[classId] !== undefined) return { ...progression, activeClass: classId };
  const block = marinaraClassBlock(progression, classId);
  if (block) throw new Error(`Cannot take class ${classId}: ${block}`);
  const def = marinaraClass(classId)!;
  const bonus = marinaraPromotionBonus(def);
  const startLevel = def.from ? progression.classLevels[def.from]! : 1;
  return {
    ...progression,
    activeClass: classId,
    classLevels: { ...progression.classLevels, [classId]: startLevel },
    classXp: { ...progression.classXp, [classId]: 0 },
    stats: statRecord((stat) => progression.stats[stat] + bonus[stat]),
    expected: statRecord((stat) => progression.expected[stat] + bonus[stat]),
  };
}

/** Every skill the character has learned, in any class. */
export function marinaraLearnedSkills(progression: MarinaraProgression): Array<MarinaraSkillDef & { classId: string }> {
  return Object.entries(progression.classLevels).flatMap(([classId, classLevel]) =>
    (marinaraClass(classId)?.skills ?? [])
      .filter((skill) => skill.learnedAt <= classLevel)
      .map((skill) => ({ ...skill, classId })),
  );
}

/** The skills a character fights with: their active class's learned skills and what they carry. */
export function marinaraUsableSkills(progression: MarinaraProgression): Array<MarinaraSkillDef & { classId: string }> {
  const learned = marinaraLearnedSkills(progression);
  const own = learned.filter((skill) => skill.classId === progression.activeClass);
  const carried = learned.filter(
    (skill) => skill.classId !== progression.activeClass && progression.carried.includes(skill.id),
  );
  return [...own, ...carried.slice(0, MARINARA_CARRY_SLOTS)];
}

/** Picks the carried skills: up to four, each learned in a class other than the active one. */
export function setMarinaraCarried(progression: MarinaraProgression, skillIds: readonly string[]): MarinaraProgression {
  const unique = [...new Set(skillIds)];
  if (unique.length > MARINARA_CARRY_SLOTS) throw new Error(`At most ${MARINARA_CARRY_SLOTS} carried skills.`);
  const learned = marinaraLearnedSkills(progression);
  for (const id of unique) {
    if (!learned.some((skill) => skill.id === id && skill.classId !== progression.activeClass))
      throw new Error(`Skill ${id} is not learned in another class.`);
  }
  return { ...progression, carried: unique };
}

export interface MarinaraLevelUp {
  level: number;
  gains: Partial<MarinaraStats>;
}

/**
 * One level-up in the active class: each stat rolls d100 under its growth plus aptitude (plus the
 * drift bonus when it has fallen behind); at least `MARINARA_GROWTH_FLOOR` stats rise.
 */
export function rollMarinaraLevelUp(
  progression: MarinaraProgression,
  random: () => number,
): { progression: MarinaraProgression; levelUp: MarinaraLevelUp } {
  const def = marinaraClass(progression.activeClass)!;
  const growth = marinaraClassGrowth(def);
  const chance = statRecord((stat) => {
    const base = Math.max(0, growth[stat] + progression.aptitudes[stat]);
    const behind = progression.expected[stat] - progression.stats[stat] > MARINARA_DRIFT_GAP;
    return base + (behind && base > 0 ? MARINARA_DRIFT_BONUS : 0);
  });
  const gains: Partial<MarinaraStats> = {};
  for (const stat of MARINARA_STATS) {
    // Past 100%, the rest is a chance at a second point.
    const roll = random() * 100;
    const points = Math.floor(chance[stat] / 100) + (roll < chance[stat] % 100 ? 1 : 0);
    if (points > 0) gains[stat] = points;
  }
  const risen = () => MARINARA_STATS.filter((stat) => (gains[stat] ?? 0) > 0).length;
  for (const stat of [...MARINARA_STATS].sort((a, b) => chance[b] - chance[a])) {
    if (risen() >= MARINARA_GROWTH_FLOOR) break;
    if (!gains[stat] && chance[stat] > 0) gains[stat] = 1;
  }
  const level = progression.level + 1;
  return {
    progression: {
      ...progression,
      level,
      stats: statRecord((stat) => progression.stats[stat] + (gains[stat] ?? 0)),
      expected: statRecord(
        (stat) => progression.expected[stat] + Math.max(0, growth[stat] + progression.aptitudes[stat]) / 100,
      ),
    },
    levelUp: { level, gains },
  };
}

/**
 * XP earned by an action, before the catch-up: `base` scaled by how the foe's level compares, so
 * beating weak foes pays little. A character below the party's average level earns 1.5×.
 */
export function scaleMarinaraXp(input: {
  base: number;
  level: number;
  foeLevel: number;
  partyAverageLevel: number;
}): number {
  const gap = input.foeLevel - input.level;
  const scale = gap >= 0 ? 1 + Math.min(gap, 5) * 0.2 : Math.max(0.1, 1 + gap * 0.25);
  const catchUp = input.level < input.partyAverageLevel ? 1.5 : 1;
  return Math.max(1, Math.round(input.base * scale * catchUp));
}

/** Adds XP to the character and their active class; levels up (rolling growth) as it passes 100s,
 *  up to the cap. */
export function awardMarinaraXp(
  progression: MarinaraProgression,
  xp: number,
  random: () => number,
): { progression: MarinaraProgression; levelUps: MarinaraLevelUp[] } {
  let next: MarinaraProgression = {
    ...progression,
    xp: progression.xp + Math.max(0, Math.round(xp)),
    classXp: {
      ...progression.classXp,
      [progression.activeClass]: (progression.classXp[progression.activeClass] ?? 0) + Math.max(0, Math.round(xp)),
    },
  };
  const levelUps: MarinaraLevelUp[] = [];
  while (next.xp >= MARINARA_XP_PER_LEVEL && next.level < MARINARA_LEVEL_CAP) {
    next = { ...next, xp: next.xp - MARINARA_XP_PER_LEVEL };
    const rolled = rollMarinaraLevelUp(next, random);
    next = rolled.progression;
    levelUps.push(rolled.levelUp);
  }
  if (next.level >= MARINARA_LEVEL_CAP) next = { ...next, xp: 0 };
  const active = next.activeClass;
  let classXp = next.classXp[active] ?? 0;
  let classLevel = next.classLevels[active] ?? 1;
  while (classXp >= MARINARA_XP_PER_LEVEL && classLevel < MARINARA_LEVEL_CAP) {
    classXp -= MARINARA_XP_PER_LEVEL;
    classLevel++;
  }
  if (classLevel >= MARINARA_LEVEL_CAP) classXp = 0;
  next = {
    ...next,
    classXp: { ...next.classXp, [active]: classXp },
    classLevels: { ...next.classLevels, [active]: classLevel },
  };
  return { progression: next, levelUps };
}

/**
 * The stats a character of this archetype is expected to have at a level, following one advanced
 * and one master class of its own tree with no aptitudes: what fights are balanced against, so
 * enemy curves never chase anyone's lucky rolls.
 */
export function expectedMarinaraStats(archetype: MarinaraArchetype, level: number): MarinaraStats {
  const capped = Math.max(1, Math.min(MARINARA_LEVEL_CAP, Math.floor(level)));
  const line = MARINARA_CLASSES.filter((def) => def.archetype === archetype && !def.pure);
  const base = line.find((def) => def.tier === "base")!;
  const advanced = line.find((def) => def.tier === "advanced")!;
  const master = line.find((def) => def.tier === "master" && def.from === advanced.id)!;
  const out = { ...MARINARA_ARCHETYPE_BASES[archetype].start };
  for (let at = 2; at <= capped; at++) {
    if (at === MARINARA_PROMOTION_LEVEL.advanced + 1 || at === MARINARA_PROMOTION_LEVEL.master + 1) {
      const promoted = at === MARINARA_PROMOTION_LEVEL.advanced + 1 ? advanced : master;
      const bonus = marinaraPromotionBonus(promoted);
      for (const stat of MARINARA_STATS) out[stat] += bonus[stat];
    }
    const def =
      at <= MARINARA_PROMOTION_LEVEL.advanced ? base : at <= MARINARA_PROMOTION_LEVEL.master ? advanced : master;
    const growth = marinaraClassGrowth(def);
    for (const stat of MARINARA_STATS) out[stat] += growth[stat] / 100;
  }
  return statRecord((stat) => Math.round(out[stat] * 10) / 10);
}
