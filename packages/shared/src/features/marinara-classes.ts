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
  "channeler",
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
  // Guard Skill 7/60% (was 4/35%): a Guard missed 34-44% of its hits and couldn't finish a fight (playtest 2026-11-01).
  guard: { start: stats(24, 6, 0, 7, 3, 9, 3, 3), growth: stats(90, 40, 0, 60, 20, 55, 20, 25) },
  // Scout HP 20/70% and Defense 5/40% (were 18/60, 3/20): the line went down 25-36% of fights, most others 5-15%.
  scout: { start: stats(20, 5, 1, 7, 9, 5, 2, 7), growth: stats(70, 35, 10, 50, 60, 40, 20, 50) },
  marksman: { start: stats(18, 6, 1, 8, 6, 4, 2, 4), growth: stats(65, 45, 5, 60, 45, 25, 15, 30) },
  channeler: { start: stats(16, 1, 8, 5, 5, 2, 6, 3), growth: stats(50, 5, 60, 40, 40, 15, 40, 25) },
  // Hexer HP 19 (was 17, balance pass 2026-11-01): the lowest base class early, down in half its fights.
  hexer: { start: stats(19, 1, 7, 5, 4, 2, 7, 4), growth: stats(55, 5, 50, 40, 35, 15, 50, 35) },
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
  arrogant: "channeler",
  methodical: "channeler",
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

export const MARINARA_DAMAGE_TYPES = [
  "slash",
  "pierce",
  "blunt",
  "fire",
  "ice",
  "lightning",
  "light",
  "dark",
  "poison",
] as const;
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
  channeler: "element",
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
  channeler: ["blunt"],
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

// ── Weapon riders ──

/**
 * A rider is damage of another type carried on top of a weapon hit (Alyssa 2026-10-31): from an
 * enchantment (Imbue Weapon) or a coating item the user dips the weapon in. It deals a share of
 * the hit's damage before affinities, in its own type, so the target's affinity to the rider's type
 * applies (more for an enchantment than a coating); a Poison rider poisons instead. It lands only when the hit does and the weapon's own
 * type is not immune, absorbed or otherwise walled off, except Light and Dark, which pierce any
 * physical immunity (a ghost that steel passes through still burns in holy water).
 */
/** Rider damage as a share of the hit: an enchantment (a trained skill) carries more than a coating item. */
export const MARINARA_RIDER_DAMAGE_PCT = { enchantment: 0.6, coating: 0.4 } as const;
// Imbue Weapon is not a rider (Alyssa 2026-10-31): it turns the weapon's damage into the element.
export const MARINARA_POISON_RIDER = { pctOfMaxHp: 0.05, turns: 3 } as const;
export const MARINARA_PIERCING_RIDERS = ["light", "dark"] as const satisfies readonly MarinaraDamageType[];

/** Whether a rider lands, given the weapon type's own affinity multiplier against the target. */
export function marinaraRiderLands(weaponMultiplier: number, rider: MarinaraDamageType): boolean {
  return weaponMultiplier > 0 || (MARINARA_PIERCING_RIDERS as readonly MarinaraDamageType[]).includes(rider);
}

/** Coating items: applying one is an item action, and it lasts this many of the user's turns. */
export const MARINARA_COATING_TURNS = 5;
export const MARINARA_WEAPON_COATINGS = [
  { id: "venom-vial", label: "Venom Vial", rider: "poison" },
  { id: "fire-oil", label: "Fire Oil", rider: "fire" },
  { id: "frost-salts", label: "Frost Salts", rider: "ice" },
  { id: "storm-flask", label: "Storm Flask", rider: "lightning" },
  { id: "holy-water", label: "Holy Water", rider: "light" },
  { id: "grave-dust", label: "Grave Dust", rider: "dark" },
] as const satisfies ReadonlyArray<{ id: string; label: string; rider: MarinaraDamageType }>;

// ── Fight HP ──

/**
 * HP in a fight is the HP stat times a multiplier that grows with level (2026-10-31): attack stats
 * outgrow HP and defenses as levels rise, so without it a level 30 fight ends in half the hits of a
 * level 10 one. The same rule holds for party members and for humanoid foes built on these classes.
 */
export const MARINARA_FIGHT_HP = { atLevel1: 1.5, atCap: 2.5 } as const;

export function marinaraFightHpMultiplier(level: number): number {
  const at = Math.max(1, Math.min(MARINARA_LEVEL_CAP, level));
  return (
    MARINARA_FIGHT_HP.atLevel1 +
    ((MARINARA_FIGHT_HP.atCap - MARINARA_FIGHT_HP.atLevel1) * (at - 1)) / (MARINARA_LEVEL_CAP - 1)
  );
}

/** No attack's chance to hit drops below this, however evasive the target. */
export const MARINARA_MIN_HIT_CHANCE = 25;
/**
 * Classic rows (early Final Fantasy): melee can reach the back row, but deals this share of its
 * damage there. Ranged attacks and spells deal full damage to either row. Tactical has no rows.
 */
export const MARINARA_BACK_ROW_MELEE_PCT = 0.5;

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
  /** Where it stands by default when its archetype's row doesn't fit (the Witch line fights in front). */
  row?: "front" | "back";
  /** Growth points added to (or taken from) its archetype's on top of its leans, for a class whose role
   *  wants a stat its archetype grows poorly (the Warden's Resistance). Promotion adds a point for
   *  each 10. */
  tune?: Partial<Record<MarinaraStat, number>>;
  skills: readonly MarinaraSkillDef[];
}

/** The damage type of every damaging active skill. */
const SKILL_DAMAGE: Record<string, MarinaraSkillDamage> = {
  "power-strike": "weapon",
  flurry: "weapon",
  "last-cut": "weapon",
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
  starfall: "light",
  convergence: "element",
  siphon: "dark",
  "grave-tithe": "dark",
  "carrion-feast": "dark",
  "total-eclipse": "dark",
  "rune-strike": "element",
  rot: "poison",
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
      role: "Weapon fighters who meet the enemy head-on and put extra force behind every blow.",
      leans: ["strength", "speed"],
      skills: [
        passive("battle-rhythm", "Battle Rhythm", 5, "Increases all damage dealt by 15%.", true),
        active(
          "power-strike",
          "Power Strike",
          1,
          "strength",
          0,
          "Deals heavy damage to one foe. Reduces the user's Speed by 25% until their next turn.",
          true,
        ),
      ],
    },
    {
      id: "duelist",
      label: "Duelist",
      from: "blade",
      role: "Swordsmen who excel at single combat, striking twice and punishing every missed attack.",
      leans: ["speed", "skill"],
      skills: [
        active("flurry", "Flurry", 10, "speed", 4, "Strikes one foe twice."),
        passive("riposte", "Riposte", 12, "Counterattacks when a melee attack misses the user."),
        passive("keen-edge", "Keen Edge", 15, "Increases critical rate by 10%.", true),
      ],
    },
    {
      id: "headsman",
      label: "Headsman",
      from: "duelist",
      role: "Executioners who finish off the wounded. Each kill earns them another action.",
      leans: ["speed", "skill"],
      skills: [
        active(
          "last-cut",
          "Last Cut",
          20,
          "skill",
          8,
          "Deals damage to one foe with +30% critical rate. Deals 50% more to foes below half HP.",
          true,
        ),
        passive("follow-through", "Follow Through", 24, "Once per turn, defeating a foe grants another action."),
      ],
    },
    {
      id: "bloodsworn",
      label: "Bloodsworn",
      from: "blade",
      role: "Berserkers who grow stronger as they bleed, and heal by drawing blood.",
      leans: ["strength", "hp"],
      skills: [
        active(
          "reckless-swing",
          "Reckless Swing",
          10,
          "strength",
          3,
          "Deals massive damage to one foe with +15% accuracy and inflicts Wound (healing received halved) for 3 turns. Reduces the user's Defense by 30% for 2 turns.",
        ),
        passive("bloodrage", "Bloodrage", 12, "Increases damage dealt by up to 60% as the user's HP falls."),
        passive("bloodlust", "Bloodlust", 15, "Restores HP equal to 15% of damage dealt.", true),
      ],
    },
    {
      id: "cleaver",
      label: "Cleaver",
      from: "bloodsworn",
      role: "Berserkers who cut through whole enemy lines, and are hardest to stop when nearly beaten.",
      leans: ["strength", "hp"],
      skills: [
        active(
          "sweeping-ruin",
          "Sweeping Ruin",
          20,
          "strength",
          8,
          "Deals damage to all foes in the front row and reduces the damage of foes hit by 15% for 2 turns. Reduces the user's Speed by 20% until their next turn.",
          true,
        ),
        passive("unstoppable", "Unstoppable", 24, "Below half HP, nullifies Stun and reduces damage taken by 15%."),
      ],
    },
    {
      id: "weaponmaster",
      label: "Weaponmaster",
      from: "blade",
      role: "Weapon experts who change arms mid-battle to strike any foe's weakness.",
      weapons: ["slash", "pierce", "blunt"],
      leans: ["strength", "skill", "speed"],
      skills: [
        active(
          "arsenal",
          "Arsenal",
          10,
          "strength",
          4,
          "Attacks one foe with whichever of slash, pierce or blunt they are weakest to, ignoring 30% of their Defense.",
          true,
        ),
        passive(
          "adaptive-grip",
          "Adaptive Grip",
          15,
          "Increases accuracy by 10%. Armored and evasive foes gain no defensive bonus.",
        ),
      ],
    },
    {
      id: "paragon-of-arms",
      label: "Paragon of Arms",
      from: "weaponmaster",
      role: "Masters of every weapon, said to strike faster than the eye can follow.",
      weapons: ["slash", "pierce", "blunt"],
      leans: ["strength", "skill", "speed", "defense"],
      skills: [
        active(
          "thousand-edges",
          "Thousand Edges",
          20,
          "strength",
          12,
          "Deals damage to every foe within reach. Reduces the user's Speed by 25% until their next turn. Cooldown: 3 turns.",
        ),
        passive("peerless", "Peerless", 25, "Grants an extra action every third action.", true),
      ],
    },
  ]),
  ...tree("guard", [
    {
      id: "guard",
      label: "Guard",
      role: "Shield-bearers who take the blows meant for their allies and make the enemy come to them.",
      leans: ["hp", "defense"],
      skills: [
        passive("steadfast", "Steadfast", 5, "Increases max HP by 20%.", true),
        active(
          "cover",
          "Cover",
          1,
          "defense",
          0,
          "Until the user's next turn, single-target attacks on one ally hit the user instead.",
        ),
        active("challenge", "Challenge", 1, "defense", 2, "Forces one foe to target the user for 2 turns.", true),
        passive(
          "hold-the-line",
          "Hold the Line",
          5,
          "The user acts early in the first round. In Tactical, foes that move next to the user must stop, and foes that leave their reach take a free attack.",
        ),
      ],
    },
    {
      id: "sentinel",
      label: "Sentinel",
      from: "guard",
      role: "Guards who draw attacks onto themselves and strike back at anyone who hits them or their ward.",
      leans: ["hp", "defense"],
      skills: [
        active("provoke", "Provoke", 10, "defense", 3, "Forces all foes to target the user for 2 turns.", true),
        active(
          "sworn-ward",
          "Sworn Ward",
          12,
          "defense",
          3,
          "For 3 turns, the user strikes any foe that attacks the chosen ally, hit or miss, if the foe is in reach.",
          true,
        ),
        passive(
          "retaliate",
          "Retaliate",
          15,
          "Counterattacks every hit within reach, adding half the user's Defense to the counter's power.",
          true,
        ),
      ],
    },
    {
      id: "stonewall",
      label: "Stonewall",
      from: "sentinel",
      role: "Living fortresses who shelter the whole party behind their shields.",
      leans: ["hp", "defense", "resistance"],
      // Grows past the Sentinel it came from (Alyssa 2026-11-01: at level 30 it held fewer rounds than
      // a level 20 Sentinel).
      tune: { hp: 20, defense: 20, resistance: 10 },
      skills: [
        active(
          "fortress",
          "Fortress",
          20,
          "defense",
          12,
          "Halves damage taken by the party for one round. Cooldown: 5 turns, shared by every Fortress user in the party.",
        ),
        passive("shield-wall", "Shield Wall", 22, "While the user stands, the back row takes 25% less damage."),
        passive("last-stand", "Last Stand", 24, "Once per battle, survives a fatal blow with 1 HP.", true),
      ],
    },
    {
      id: "warden",
      label: "Warden",
      from: "guard",
      role: "Oathbound knights sworn against sorcery, who turn spells aside for the whole party.",
      leans: ["resistance", "hp"],
      // The magic tank (Alyssa 2026-11-01): out-grows any Hexer in Resistance.
      tune: { resistance: 20 },
      skills: [
        active(
          "spellguard",
          "Spellguard",
          10,
          "resistance",
          4,
          "Increases the party's Resistance by 30% for 2 rounds.",
        ),
        passive(
          "aura-of-warding",
          "Aura of Warding",
          15,
          "While the user stands, allies take 35% less magic damage.",
          true,
        ),
        // More anti-magic tanking at level 20 (Alyssa 2026-11-01).
        passive("old-oath", "Old Oath", 18, "Increases Resistance by 30% and reduces magic damage taken by 20%."),
      ],
    },
    {
      id: "elder-warden",
      label: "Elder Warden",
      from: "warden",
      role: "Veteran Wardens whose resistance to magic has become a weapon of judgement.",
      leans: ["resistance", "hp", "defense"],
      tune: { resistance: 20 },
      skills: [
        active(
          "verdict",
          "Verdict",
          20,
          "resistance",
          8,
          "Deals light damage to one foe based on the user's Resistance.",
          true,
        ),
        passive("elder-oath", "Elder Oath", 24, "Increases Resistance by 50%. Nullifies Doom and Sleep."),
      ],
    },
    {
      id: "aegis",
      label: "Aegis",
      from: "guard",
      role: "Guardians who block spells as surely as steel, and dare the enemy to try both.",
      leans: ["hp", "defense", "resistance"],
      // A Pure Guard stands up to magic too, so a magic-heavy game doesn't push it into the Warden.
      tune: { resistance: 5 },
      skills: [
        active(
          "warding-stance",
          "Warding Stance",
          10,
          "resistance",
          4,
          "Increases the user's Resistance by 50% for 2 turns, and draws every foe's single-target attacks to the user for 2 turns.",
          true,
        ),
        passive(
          "entrench",
          "Entrench",
          12,
          "After defending or charging a skill, increases Defense and Resistance by 30% until the user's next turn.",
          true,
        ),
        passive("immovable", "Immovable", 15, "Nullifies Stun. Increases Defense by 20% while defending."),
      ],
    },
    {
      id: "bulwark",
      label: "Bulwark",
      from: "aegis",
      role: "The last line of defense. While a Bulwark holds, no ally falls.",
      leans: ["hp", "defense", "resistance", "luck"],
      tune: { resistance: 5 },
      skills: [
        active(
          "oath-of-iron",
          "Oath of Iron",
          20,
          "defense",
          15,
          "Until each ally's next turn, no party member can drop below 1 HP, from attacks or damage over time. Once per battle.",
        ),
        passive("shield-line", "Shield Line", 25, "Increases the party's Defense and Resistance by 15%.", true),
      ],
    },
  ]),
  ...tree("scout", [
    {
      id: "scout",
      label: "Scout",
      role: "Nimble opportunists who strike fast, dodge faster, and leave with the enemy's valuables.",
      leans: ["speed", "luck"],
      skills: [
        passive("keen-eye", "Keen Eye", 5, "Increases accuracy by 15% and critical rate by 10%.", true),
        active(
          "steal",
          "Steal",
          1,
          "speed",
          0,
          "Attempts to steal an item or gold from one foe. Better odds the faster the user is than the foe; worse against elites and bosses.",
          true,
        ),
        passive("light-feet", "Light Feet", 5, "Increases evasion by 10%."),
      ],
    },
    {
      id: "rogue",
      label: "Rogue",
      from: "scout",
      role: "Cutthroats who strike when the enemy's attention is elsewhere.",
      leans: ["skill", "luck"],
      skills: [
        active(
          "backstab",
          "Backstab",
          10,
          "skill",
          3,
          "Deals damage to one foe with +15% critical rate. Deals 50% more if an ally struck the target since their last turn.",
        ),
        passive(
          "exploit",
          "Exploit",
          15,
          "Increases critical rate by 25% against foes with a debuff or status ailment.",
          true,
        ),
      ],
    },
    {
      id: "phantom",
      label: "Phantom",
      from: "rogue",
      role: "Assassins who vanish from sight and reappear for the killing blow.",
      leans: ["skill", "luck", "speed"],
      skills: [
        active(
          "vanish",
          "Vanish",
          20,
          "speed",
          8,
          "Bonus action. The user can't be targeted until their next turn. Their next hit is a critical hit, and the target takes 20% more damage from all sources for 2 turns. Usable every other turn.",
          true,
        ),
        passive(
          "assassinate",
          "Assassinate",
          24,
          "A critical hit that leaves a foe below 15% HP defeats it outright. Doesn't work on bosses.",
        ),
      ],
    },
    {
      id: "skirmisher",
      label: "Skirmisher",
      from: "scout",
      role: "Hit-and-run fighters who take more turns than anyone on the field.",
      leans: ["speed"],
      skills: [
        active(
          "hit-and-run",
          "Hit and Run",
          10,
          "speed",
          3,
          "Deals light damage to one foe. Increases the user's Speed by 60% until their next turn.",
        ),
        passive("fleet", "Fleet", 15, "Increases Speed by 20%.", true),
      ],
    },
    {
      id: "harrier",
      label: "Harrier",
      from: "skirmisher",
      role: "Swift skirmishers who set the pace of battle and pull the party along with them.",
      leans: ["speed", "skill"],
      skills: [
        active(
          "double-time",
          "Double Time",
          20,
          "speed",
          10,
          "The user takes another action at once. Cooldown: 3 turns.",
        ),
        passive("tailwind", "Tailwind", 24, "Increases the party's Speed by 20%.", true),
      ],
    },
    {
      id: "shade",
      label: "Shade",
      from: "scout",
      role: "Shadow-walkers who slip past the enemy's guard and are hard to pin down.",
      leans: ["speed", "skill", "luck"],
      skills: [
        active(
          "shadowstep",
          "Shadowstep",
          10,
          "skill",
          4,
          "Deals damage to one foe with +10% critical rate. Reaches the back row at full damage.",
          true,
        ),
        passive("elusive", "Elusive", 15, "The first attack on the user each round has a 50% chance to miss."),
      ],
    },
    {
      id: "shroud",
      label: "Shroud",
      from: "shade",
      role: "Masters of misdirection who fill the field with shadow decoys.",
      leans: ["speed", "luck", "skill", "hp"],
      skills: [
        active(
          "thousand-shadows",
          "Thousand Shadows",
          20,
          "speed",
          14,
          "Creates three decoys that take the next three hits on any party member. Lasts 3 of the user's turns. Once per battle.",
          true,
        ),
        passive(
          "perfect-evasion",
          "Perfect Evasion",
          25,
          "Each attack that misses the user increases their evasion by 10%, up to 30%.",
        ),
      ],
    },
  ]),
  ...tree("marksman", [
    {
      id: "marksman",
      label: "Marksman",
      role: "Archers who switch ammunition to suit any target.",
      leans: ["skill", "strength"],
      skills: [
        // Ammunition is no skill (Alyssa 2026-11-01): every Marksman's bow or gun loads whatever
        // ammunition the party owns (marinara-items.ts `ammo-*`), switched by hand mid-fight.
        passive(
          "exploit-weakness",
          "Exploit Weakness",
          5,
          "Hits on a weakness deal double damage instead of 1.5x.",
          true,
        ),
        active(
          "aimed-shot",
          "Aimed Shot",
          1,
          "skill",
          0,
          "Fires at one foe with +30% accuracy. Reduces the user's Speed by 20% until their next turn.",
        ),
        passive("true-aim", "True Aim", 5, "Increases accuracy by 15%.", true),
      ],
    },
    {
      id: "sharpshooter",
      label: "Sharpshooter",
      from: "marksman",
      role: "Precision shooters who put arrows through armor.",
      leans: ["skill"],
      skills: [
        active("pierce", "Pierce", 10, "skill", 4, "Fires at one foe, ignoring half their Defense.", true),
        passive(
          "steady",
          "Steady",
          15,
          "The user's attacks and skills ignore 20% of the target's Defense and Resistance.",
        ),
      ],
    },
    {
      id: "farshot",
      label: "Farshot",
      from: "sharpshooter",
      role: "Long-range snipers who line up one devastating shot, and return fire on anyone who attacks the party.",
      leans: ["skill", "strength"],
      skills: [
        active(
          "headshot",
          "Headshot",
          20,
          "skill",
          10,
          "Charges for one turn, then deals massive damage to one foe with +25% critical rate.",
        ),
        passive("dead-eye", "Dead Eye", 22, "Increases critical rate by 15%. Hits on a weakness deal 25% more."),
        passive(
          "return-fire",
          "Return Fire",
          24,
          "Once between the user's turns, shoots back at the first foe to attack the user or an ally, if that foe is in reach.",
          true,
        ),
      ],
    },
    {
      id: "tracker",
      label: "Tracker",
      from: "marksman",
      role: "Hunters who mark their quarry for the whole party and tame the beasts they bring down.",
      leans: ["skill", "speed"],
      skills: [
        active(
          "mark-prey",
          "Mark Prey",
          10,
          "skill",
          3,
          "Bonus action. The target takes 35% more damage from all sources for 3 turns.",
          true,
        ),
        active(
          "tame",
          "Tame",
          12,
          "skill",
          4,
          "Tames one wild beast below 30% HP, taking it out of the fight. Success rises with Skill and Luck. Tamed beasts join the user's companions, up to 8. The active companion increases the user's stat it is strongest in, by more for higher-level and elite beasts; companions are swapped outside battle.",
          true,
        ),
        passive(
          "read-the-signs",
          "Read the Signs",
          15,
          "Increases critical rate by 5%. Deals 20% more damage to marked foes.",
        ),
      ],
    },
    {
      id: "huntsmaster",
      label: "Huntsmaster",
      from: "tracker",
      role: "Masters of the hunt who slow their prey and send the whole pack after it.",
      leans: ["skill", "speed", "luck"],
      skills: [
        active("snare-field", "Snare Field", 20, "skill", 10, "Reduces all foes' Speed by 30% for 2 turns."),
        active(
          "sic",
          "Sic",
          22,
          "strength",
          4,
          "Bonus action. The user's active companion strikes one foe. Usable every other turn.",
        ),
        passive("pack-tactics", "Pack Tactics", 24, "The party deals 40% more damage to marked foes.", true),
        passive(
          "bond",
          "Bond",
          26,
          "The active companion's bonus increases by half, and the rest of the party gains half of it.",
        ),
      ],
    },
    {
      id: "artillerist",
      label: "Artillerist",
      from: "marksman",
      role: "Bombardiers who rain arrows on the whole enemy side.",
      leans: ["strength", "skill"],
      skills: [
        active("volley", "Volley", 10, "strength", 6, "Deals light damage to all foes. Cooldown: 2 turns.", true),
        passive("heavy-draw", "Heavy Draw", 15, "Increases damage by 30% and reduces Speed by 15%."),
      ],
    },
    {
      id: "siegebreaker",
      label: "Siegebreaker",
      from: "artillerist",
      role: "Siege archers who shatter the enemy's armor across the field.",
      leans: ["strength", "skill", "hp"],
      skills: [
        active(
          "ruinous-barrage",
          "Ruinous Barrage",
          20,
          "strength",
          10,
          "Deals heavy damage to all foes and reduces the Defense of foes hit by 25% for 2 turns. Reduces the user's Speed by 25% until their next turn. Cooldown: 3 turns.",
        ),
        passive(
          "sundering",
          "Sundering",
          25,
          "Hits reduce the target's Defense by 10% for 2 turns. Further hits renew the time instead of stacking.",
          true,
        ),
      ],
    },
  ]),
  ...tree("channeler", [
    {
      id: "channeler",
      label: "Channeler",
      role: "Elemental mages who wield fire, ice and lightning.",
      leans: ["magic"],
      skills: [
        active(
          "element-bolt",
          "Element Bolt",
          1,
          "magic",
          3,
          "Deals magic damage to one foe in the user's element.",
          true,
        ),
        active(
          "imbue-weapon",
          "Imbue Weapon",
          5,
          "magic",
          3,
          "For 3 turns, the user's weapon attacks and skills can strike as fire, ice or lightning, whichever the target is weakest to.",
          true,
        ),
      ],
    },
    {
      id: "fusionist",
      label: "Fusionist",
      from: "channeler",
      role: "Mages who cast two elements at once.",
      leans: ["magic", "skill"],
      skills: [
        active("twin-cast", "Twin Cast", 10, "magic", 6, "Casts two spells on one foe in one action."),
        passive("attunement", "Attunement", 15, "Increases spell damage by 15%.", true),
      ],
    },
    {
      id: "stormcaller",
      label: "Stormcaller",
      from: "fusionist",
      role: "Weather-callers who strike every foe with the element it fears most.",
      leans: ["magic", "speed"],
      skills: [
        active(
          "tempest",
          "Tempest",
          20,
          "magic",
          10,
          "Deals magic damage to all foes at 85% of a single-target spell, each in the element they are weakest to. Cooldown: 2 turns.",
          true,
        ),
        passive("overcharge", "Overcharge", 24, "Increases critical rate by 10%."),
      ],
    },
    {
      id: "rune-scholar",
      label: "Rune Scholar",
      from: "channeler",
      // Party elemental support (Alyssa 2026-11-01): wards the party against the elements and lends
      // its weapons an edge of them. Not a durable class.
      role: "Rune-carvers who arm the party with elemental weapons and wards.",
      leans: ["magic", "speed"],
      skills: [
        active(
          "edge-runes",
          "Edge Runes",
          10,
          "magic",
          6,
          "For 3 turns, the party's weapon attacks and skills strike with fire, ice or lightning, whichever the target is weakest to. Cooldown: 2 turns.",
        ),
        active(
          "rune-strike",
          "Rune Strike",
          12,
          "magic",
          5,
          "Deals magic damage to one foe in whichever of fire, ice or lightning they are weakest to.",
          true,
        ),
        passive(
          "warding-runes",
          "Warding Runes",
          15,
          "While the user stands, the party takes 25% less fire, ice and lightning damage.",
          true,
        ),
      ],
    },
    {
      id: "runelord",
      label: "Runelord",
      from: "rune-scholar",
      role: "Rune masters who inscribe the whole party with elemental power.",
      leans: ["magic", "speed", "luck"],
      skills: [
        active(
          "grand-inscription",
          "Grand Inscription",
          20,
          "magic",
          12,
          "For 3 turns, the party's weapons take their best element, the party deals 20% more damage, and it takes 30% less fire, ice and lightning damage. Cooldown: 3 turns.",
          true,
        ),
        passive(
          "living-runes",
          "Living Runes",
          24,
          "While the user stands, the party takes 35% less fire, ice and lightning damage. The user's buffs last one turn longer.",
        ),
      ],
    },
    {
      id: "astral-adept",
      label: "Astral Adept",
      from: "channeler",
      role: "Mages who cast raw starlight that pierces magical defenses.",
      leans: ["magic", "resistance", "skill"],
      skills: [
        active(
          "starfall",
          "Starfall",
          10,
          "magic",
          7,
          "Deals magic damage to one foe, ignoring half their Resistance.",
        ),
        passive("deep-well", "Deep Well", 15, "Increases max MP by 50%.", true),
      ],
    },
    {
      id: "starweaver",
      label: "Starweaver",
      from: "astral-adept",
      role: "Archmages who gather the power of the stars into a single, devastating spell.",
      leans: ["magic", "resistance", "skill", "speed"],
      skills: [
        active(
          "convergence",
          "Convergence",
          20,
          "magic",
          18,
          "Charges for one turn, then deals massive magic damage to one foe.",
        ),
        passive("mana-tide", "Mana Tide", 25, "Restores 8% of max MP every turn.", true),
      ],
    },
  ]),
  ...tree("hexer", [
    {
      id: "hexer",
      label: "Hexer",
      role: "Curse-casters who sap the enemy's strength and drain their HP.",
      leans: ["magic", "resistance"],
      skills: [
        active(
          "weaken",
          "Weaken",
          1,
          "magic",
          3,
          "Reduces one foe's Strength or Magic, whichever is higher, by 20% for 3 turns.",
          true,
        ),
        active(
          "wither",
          "Wither",
          3,
          "magic",
          3,
          "Inflicts Wither: the foe loses 6% of max HP each turn for 3 turns. Cannot be resisted. Also inflicts Wound (healing received halved) for 3 turns.",
        ),
        passive("drain-touch", "Drain Touch", 5, "Restores HP equal to 20% of damage dealt.", true),
      ],
    },
    // The Hexer's front line (Alyssa 2026-11-01): it stands in front and lives on what it drains,
    // holding a line without taunts or control. Leans HP and Defense; Grave Skin cuts what it takes
    // in front, Siphoning Rot turns its curses' ticks into healing, Carrion Feast drains one foe.
    {
      id: "witch",
      label: "Witch",
      from: "hexer",
      role: "Hexers who spread rot from foe to foe and grow tougher in the thick of battle.",
      leans: ["magic", "hp", "defense"],
      row: "front",
      // A little more Defense for the front line (Alyssa 2026-11-01).
      tune: { defense: 10 },
      skills: [
        active(
          "rot",
          "Rot",
          10,
          "magic",
          5,
          "Inflicts Poison on one foe (6% of max HP per turn for 4 turns). 90% success.",
        ),
        passive(
          "grave-hunger",
          "Grave Hunger",
          12,
          "Steals 15% of Defense and Resistance from each foe in spell range, up to five (25% from the front row).",
        ),
        passive("grave-skin", "Grave Skin", 15, "Reduces damage taken by 15% while in the front row.", true),
      ],
    },
    {
      id: "carrion-lord",
      label: "Carrion Lord",
      from: "witch",
      role: "Witches who feed on the battlefield, restoring HP from every foe they devour.",
      // No Resistance lean (Alyssa 2026-11-01): the Hexer is the best magic tank at level 10, but the
      // Warden line is the best one after.
      leans: ["magic", "hp", "defense"],
      row: "front",
      tune: { defense: 10 },
      skills: [
        active(
          "carrion-feast",
          "Carrion Feast",
          20,
          "magic",
          10,
          "Deals heavy dark damage to one foe and restores HP equal to the damage dealt. Cooldown: 2 turns.",
        ),
        active(
          "grave-tithe",
          "Grave Tithe",
          22,
          "magic",
          6,
          "Deals dark damage to all foes and restores HP equal to half the damage dealt. Front row only. Usable every other turn.",
        ),
        passive(
          "siphoning-rot",
          "Siphoning Rot",
          24,
          "The user's Poison and Wither restore HP equal to half the damage they deal.",
          true,
        ),
      ],
    },
    {
      id: "dreamcaller",
      label: "Dreamcaller",
      from: "hexer",
      role: "Hexers who lull foes to sleep and slow the battle to a crawl.",
      leans: ["magic", "speed"],
      // The Hexer lines' Resistance cut (Alyssa 2026-11-01): the Warden line is the magic tank.
      tune: { resistance: -10 },
      skills: [
        active(
          "lull",
          "Lull",
          10,
          "magic",
          5,
          "Inflicts Sleep on one foe for 3 turns. 75% success. Taking damage wakes the target.",
          true,
        ),
        passive(
          "slow-time",
          "Slow Time",
          15,
          "While the user stands, foes with a debuff or status ailment take 25% longer between turns.",
        ),
      ],
    },
    {
      id: "dreamweaver",
      label: "Dreamweaver",
      from: "dreamcaller",
      role: "Illusionists who turn the enemy against itself.",
      leans: ["magic", "speed"],
      tune: { resistance: -10 },
      skills: [
        active(
          "mass-confusion",
          "Mass Confusion",
          20,
          "magic",
          14,
          "Inflicts Confusion on all foes for 2 turns. 70% success each.",
        ),
        passive("nightmare", "Nightmare", 24, "Sleeping foes lose 10% of max HP each turn.", true),
      ],
    },
    {
      id: "nullifier",
      label: "Nullifier",
      from: "hexer",
      role: "Hexers who strip the enemy of buffs and MP.",
      leans: ["magic", "resistance", "luck"],
      tune: { resistance: -10 },
      skills: [
        active(
          "siphon",
          "Siphon",
          10,
          "magic",
          5,
          "Deals dark damage to one foe, ignoring half their Resistance. Steals one of their buffs, or drains 15% of their max MP if they have none.",
          true,
        ),
        passive(
          "devour",
          "Devour",
          15,
          "Restores 5% of max HP whenever a debuff or status the user inflicted wears off.",
          true,
        ),
      ],
    },
    {
      id: "void-sovereign",
      label: "Void Sovereign",
      from: "nullifier",
      role: "Nullifiers who command the void itself and blanket the enemy in darkness.",
      leans: ["magic", "resistance", "luck", "hp"],
      // Below the Elder Warden against casters (Alyssa 2026-11-01).
      tune: { resistance: -25 },
      skills: [
        active(
          "total-eclipse",
          "Total Eclipse",
          20,
          "magic",
          12,
          "Deals dark damage to all foes and reduces the damage of foes hit by 20% for 2 turns. Cooldown: 2 turns.",
          true,
        ),
        passive("abyssal-will", "Abyssal Will", 22, "Increases spell damage by 20%."),
        // Immunity is a master's gift (Alyssa 2026-11-01): Null moved here from the Nullifier.
        passive("null", "Null", 25, "Nullifies all debuffs.", true),
      ],
    },
  ]),
  ...tree("mender", [
    {
      id: "mender",
      label: "Mender",
      role: "Healers who keep the party standing and cure what ails them.",
      leans: ["magic", "resistance"],
      skills: [
        active("mend", "Mend", 1, "magic", 3, "Restores HP to one ally.", true),
        active(
          "second-breath",
          "Second Breath",
          5,
          "hp",
          4,
          "Restores 25% of the user's max HP. Cooldown: 3 turns.",
          true,
        ),
        active("purify", "Purify", 8, "magic", 3, "Removes all debuffs and status ailments from one ally.", true),
      ],
    },
    {
      id: "cleric",
      label: "Cleric",
      from: "mender",
      role: "Priests who call fallen allies back to the fight.",
      leans: ["magic", "resistance"],
      skills: [
        active("revive", "Revive", 10, "magic", 10, "Revives one downed ally with 25% HP. Cooldown: 3 turns.", true),
        passive("grace", "Grace", 15, "Healing has a 15% chance to be a critical heal."),
      ],
    },
    {
      id: "saint",
      label: "Saint",
      from: "cleric",
      role: "Holy healers who mend the entire party at once.",
      leans: ["magic", "resistance", "luck"],
      skills: [
        active(
          "sanctuary",
          "Sanctuary",
          20,
          "magic",
          16,
          "Restores HP to all allies and removes one debuff from each. Reduces the user's Speed by 20% until their next turn.",
        ),
        passive("miracle", "Miracle", 24, "Once per battle, the first ally to fall gets back up with 30% HP.", true),
      ],
    },
    {
      id: "apothecary",
      label: "Apothecary",
      from: "mender",
      role: "Alchemists who heal with remedies and get the most out of every item.",
      leans: ["skill", "magic"],
      skills: [
        active("remedy", "Remedy", 10, "magic", 4, "Restores HP to one ally and removes all their debuffs."),
        passive("item-savant", "Item Savant", 15, "Items used by the user are 50% more effective.", true),
      ],
    },
    {
      id: "panacean",
      label: "Panacean",
      from: "apothecary",
      role: "Master alchemists who keep the whole party regenerating.",
      leans: ["skill", "magic", "speed"],
      skills: [
        active(
          "elixir-rain",
          "Elixir Rain",
          20,
          "magic",
          12,
          "Grants Regen to the party: 7% of max HP restored each turn for 3 turns.",
          true,
        ),
        passive(
          "double-dose",
          "Double Dose",
          24,
          "The first item the user uses each round grants another action at once.",
        ),
      ],
    },
    {
      id: "lifebinder",
      label: "Lifebinder",
      from: "mender",
      role: "Protectors who shield allies before the blow lands.",
      leans: ["magic", "resistance", "hp"],
      skills: [
        active("barrier", "Barrier", 10, "magic", 6, "Grants one ally a shield that absorbs damage.", true),
        passive("overheal", "Overheal", 15, "Half of any healing beyond max HP becomes a shield."),
      ],
    },
    {
      id: "lightbearer",
      label: "Lightbearer",
      from: "lifebinder",
      role: "Saints of light who bring the whole party back from the brink.",
      leans: ["magic", "resistance", "hp", "luck"],
      skills: [
        active(
          "undying-light",
          "Undying Light",
          20,
          "magic",
          20,
          "Revives every downed ally with 50% HP. Once per battle.",
        ),
        passive("sanctified", "Sanctified", 25, "The party takes 15% less magic damage.", true),
      ],
    },
  ]),
  ...tree("herald", [
    {
      id: "herald",
      label: "Herald",
      role: "Battle leaders who rally the party to fight harder.",
      leans: ["luck", "speed"],
      skills: [
        active("rally", "Rally", 1, "luck", 3, "Increases the party's damage by 20% for 2 rounds.", true),
        passive(
          "rallying-presence",
          "Rallying Presence",
          5,
          "While the user stands, allies deal 10% more damage.",
          true,
        ),
      ],
    },
    {
      id: "cantor",
      label: "Cantor",
      from: "herald",
      role: "Battle singers whose songs stack verse upon verse.",
      leans: ["luck", "magic"],
      // A little more of its own damage (Alyssa 2026-11-01), so it isn't helpless alone.
      tune: { strength: 15 },
      skills: [
        active(
          "battle-hymn",
          "Battle Hymn",
          10,
          "magic",
          5,
          "Bonus action. Increases the party's damage by 25% for 3 turns. Each recast while it lasts adds 10%, up to 3 times.",
        ),
        active(
          "swift-refrain",
          "Swift Refrain",
          12,
          "magic",
          5,
          "Bonus action. Increases the party's Speed by 15% for 3 turns. Each recast while it lasts adds 10%, up to 3 times.",
        ),
        active(
          "guarding-refrain",
          "Guarding Refrain",
          14,
          "magic",
          5,
          "Bonus action. Increases the party's Defense and Resistance by 15% for 3 turns. Each recast while it lasts adds 10%, up to 3 times.",
        ),
        passive("encore", "Encore", 15, "Buffs the user grants last one turn longer.", true),
      ],
    },
    {
      id: "maestro",
      label: "Maestro",
      from: "cantor",
      role: "Conductors who build the party's buffs to a thundering finale.",
      leans: ["luck", "magic", "speed"],
      skills: [
        active(
          "crescendo",
          "Crescendo",
          20,
          "magic",
          14,
          "Every buff on the party counts twice for one round. Cooldown: 3 turns.",
        ),
        passive("tempo", "Tempo", 24, "Whenever a party member is buffed, their next turn comes 15% sooner.", true),
      ],
    },
    {
      id: "field-captain",
      label: "Field Captain",
      from: "herald",
      role: "Officers who command allies to act on their order.",
      leans: ["speed", "skill"],
      skills: [
        active("command", "Command", 10, "skill", 6, "One ally acts at once.", true),
        passive("foresight", "Foresight", 15, "Increases the party's Defense by 10%."),
      ],
    },
    {
      id: "marshal",
      label: "Marshal",
      from: "field-captain",
      role: "Generals who move the whole party as one.",
      leans: ["speed", "skill", "luck"],
      skills: [
        active(
          "grand-strategy",
          "Grand Strategy",
          20,
          "skill",
          18,
          "Every ally acts once, at once. Cooldown: 4 turns.",
        ),
        passive("formation", "Formation", 24, "Increases the party's Defense by 15% while no ally is down.", true),
      ],
    },
    {
      id: "standard-bearer",
      label: "Standard-Bearer",
      from: "herald",
      role: "Flag-bearers whose banner keeps the party fighting.",
      // Luck, Speed and Skill (Alyssa 2026-11-01: not HP and Defense): raises the banner first and
      // carries it well, but isn't a wall.
      leans: ["luck", "speed", "skill"],
      skills: [
        active(
          "raise-the-banner",
          "Raise the Banner",
          10,
          "luck",
          6,
          "Increases the party's damage by 25% for 3 turns. Cures Confusion and prevents it while the banner flies.",
        ),
        passive("inspire", "Inspire", 15, "While no ally is down, the party deals 10% more damage.", true),
      ],
    },
    {
      id: "lodestar",
      label: "Lodestar",
      from: "standard-bearer",
      role: "Legendary leaders the party steers by, who turn the tide when it matters.",
      leans: ["luck", "speed", "hp", "skill"],
      skills: [
        active("hour-of-heroes", "Hour of Heroes", 20, "luck", 20, "Every ally acts once, at once. Once per battle."),
        passive("fortunes-favour", "Fortune's Favour", 25, "Increases the party's critical rate by 10%.", true),
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
  return statRecord((stat) =>
    Math.max(0, base[stat] + (def.leans.includes(stat) ? lift : 0) + (def.tune?.[stat] ?? 0)),
  );
}

/** What promoting into a class adds at once: its leans +2 (+3 for a master), HP +4 (+5), +1 to
 *  every other stat its archetype grows at all, and a point for each 10 of its tune. */
export function marinaraPromotionBonus(def: MarinaraClassDef): MarinaraStats {
  if (def.tier === "base") return statRecord(() => 0);
  const master = def.tier === "master";
  const growth = MARINARA_ARCHETYPE_BASES[def.archetype].growth;
  return statRecord(
    (stat) =>
      (stat === "hp"
        ? (master ? 5 : 4) + (def.leans.includes("hp") ? 1 : 0)
        : def.leans.includes(stat)
          ? master
            ? 3
            : 2
          : growth[stat] > 10
            ? 1
            : 0) + Math.round((def.tune?.[stat] ?? 0) / 10),
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

/** What a class block means in words: "needs Bloodsworn 20 (now 19)". */
export function marinaraClassBlockText(progression: MarinaraProgression, classId: string, block: string): string {
  const def = marinaraClass(classId);
  if (block === "class-level" && def?.from) {
    const needed = MARINARA_PROMOTION_LEVEL[def.tier as "advanced" | "master"];
    return `${def.label} needs ${marinaraClass(def.from)?.label ?? def.from} ${needed} (now ${progression.classLevels[def.from] ?? 0}).`;
  }
  if (block === "not-in-trees") return `${def?.label ?? classId} is not in this character's trees.`;
  return `Cannot take class ${def?.label ?? classId}.`;
}

/** The skills every class of the active class's tree keeps (Cover, Hold the Line): they need no
 *  carry slot. */
export function marinaraKeptTraits(progression: MarinaraProgression): readonly string[] {
  const archetype = marinaraClass(progression.activeClass)?.archetype;
  return (archetype && MARINARA_ARCHETYPE_TRAITS[archetype]) || [];
}

/**
 * Makes a class the active one, out of combat. A class trained in before is switched back to as it
 * was; a promotion starts at its parent's class level and adds its promotion bonus once.
 */
export function setMarinaraClass(progression: MarinaraProgression, classId: string): MarinaraProgression {
  if (progression.classLevels[classId] !== undefined) return { ...progression, activeClass: classId };
  const block = marinaraClassBlock(progression, classId);
  if (block) throw new Error(marinaraClassBlockText(progression, classId, block));
  const def = marinaraClass(classId)!;
  const bonus = marinaraPromotionBonus(def);
  const startLevel = def.from ? progression.classLevels[def.from]! : 1;
  const promoted: MarinaraProgression = {
    ...progression,
    activeClass: classId,
    classLevels: { ...progression.classLevels, [classId]: startLevel },
    // A promotion keeps the parent class's progress toward its next level (playtest 2026-11-01: starting
    // at 0 left the class a level behind the character, and the next promotion was refused).
    classXp: { ...progression.classXp, [classId]: def.from ? (progression.classXp[def.from] ?? 0) : 0 },
    stats: statRecord((stat) => progression.stats[stat] + bonus[stat]),
    expected: statRecord((stat) => progression.expected[stat] + bonus[stat]),
  };
  return def.from ? { ...promoted, carried: promotionCarries(promoted, def) } : promoted;
}

/**
 * On a promotion, empty carry slots take the actives of the classes promoted from, latest class and
 * designed carry picks first. A promoted class starts with one active of its own, so without this a
 * companion nobody kits out lost its whole kit at level 10 and 20 (engine balance 2026-11-01: level
 * 14 and 22 were the weakest bands). The player can change them on the class screen.
 */
function promotionCarries(progression: MarinaraProgression, def: MarinaraClassDef): string[] {
  const carried = [...progression.carried];
  const traits = MARINARA_ARCHETYPE_TRAITS[def.archetype] ?? [];
  const learned = marinaraLearnedSkills(progression);
  for (
    let from = def.from ? marinaraClass(def.from) : undefined;
    from;
    from = from.from ? marinaraClass(from.from) : undefined
  ) {
    const picks = learned
      .filter((skill) => skill.classId === from!.id && skill.kind === "active" && !traits.includes(skill.id))
      .sort((a, b) => Number(!!b.carryPick) - Number(!!a.carryPick) || b.learnedAt - a.learnedAt);
    for (const skill of picks) {
      if (carried.length >= MARINARA_CARRY_SLOTS) return carried;
      if (!carried.includes(skill.id)) carried.push(skill.id);
    }
  }
  return carried;
}

/** Every skill the character has learned, in any class. */
export function marinaraLearnedSkills(progression: MarinaraProgression): Array<MarinaraSkillDef & { classId: string }> {
  return Object.entries(progression.classLevels).flatMap(([classId, classLevel]) =>
    (marinaraClass(classId)?.skills ?? [])
      .filter((skill) => skill.learnedAt <= classLevel)
      .map((skill) => ({ ...skill, classId })),
  );
}

/**
 * Skills every class of an archetype's tree keeps once learned, without a carry slot. (The Hexer's
 * went away 2026-11-01: Grave Hunger is the Witch's, Grave Tithe the Carrion Lord's, Drain Touch a
 * Hexer skill carried like any other.)
 */
export const MARINARA_ARCHETYPE_TRAITS: Partial<Record<MarinaraArchetype, readonly string[]>> = {
  guard: ["hold-the-line", "cover"],
};

/** The skills a character fights with: their active class's learned skills and what they carry. */

export function marinaraUsableSkills(progression: MarinaraProgression): Array<MarinaraSkillDef & { classId: string }> {
  const learned = marinaraLearnedSkills(progression);
  const archetype = marinaraClass(progression.activeClass)?.archetype;
  const traits = (archetype && MARINARA_ARCHETYPE_TRAITS[archetype]) || [];
  const own = learned.filter(
    (skill) =>
      skill.classId === progression.activeClass ||
      (traits.includes(skill.id) && marinaraClass(skill.classId)?.archetype === archetype),
  );
  const carried = learned.filter(
    (skill) => skill.classId !== progression.activeClass && progression.carried.includes(skill.id),
  );
  return [...own, ...carried.slice(0, MARINARA_CARRY_SLOTS)];
}

/**
 * The stat a carried skill runs on (Alyssa 2026-10-31): the better of the character's own and what
 * they would have in their best-trained class for that stat, as that class's expected stats at its
 * class level. A Blade who trained Channeler to 10 casts a carried Element Bolt with a Channeler's
 * Magic at level 10, not a Blade's.
 */
export function marinaraCarriedStat(progression: MarinaraProgression, stat: MarinaraStat): number {
  let best = progression.stats[stat];
  for (const [classId, classLevel] of Object.entries(progression.classLevels)) {
    const def = marinaraClass(classId);
    if (def) best = Math.max(best, expectedMarinaraStats(def.archetype, classLevel)[stat]);
  }
  return best;
}

/** Picks the carried skills: up to four, each learned in a class other than the active one. */
export function setMarinaraCarried(progression: MarinaraProgression, skillIds: readonly string[]): MarinaraProgression {
  const unique = [...new Set(skillIds)];
  if (unique.length > MARINARA_CARRY_SLOTS) throw new Error(`At most ${MARINARA_CARRY_SLOTS} carried skills.`);
  const learned = marinaraLearnedSkills(progression);
  const kept = marinaraKeptTraits(progression);
  const archetype = marinaraClass(progression.activeClass)?.archetype;
  for (const id of unique) {
    const skill = learned.find((one) => one.id === id && one.classId !== progression.activeClass);
    if (!skill) throw new Error(`Skill ${id} is not learned in another class.`);
    // A tree trait from the active tree is kept anyway: carried too, it showed twice and took a slot.
    if (kept.includes(id) && marinaraClass(skill.classId)?.archetype === archetype)
      throw new Error(`${skill.label} is kept by every class of this tree; it needs no carry slot.`);
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
/** A class below this share of the character's level earns class XP times `multiplier`. */
export const MARINARA_CLASS_CATCH_UP = { below: 0.5, multiplier: 2 } as const;

export function awardMarinaraXp(
  progression: MarinaraProgression,
  xp: number,
  random: () => number,
): { progression: MarinaraProgression; levelUps: MarinaraLevelUp[] } {
  // Class catch-up (Alyssa 2026-11-01, item 7): a class trained below half the character's level earns
  // double class XP, so trying the secondary tree late isn't a grind from class level 1.
  const behind =
    (progression.classLevels[progression.activeClass] ?? 1) <
    Math.floor(progression.level * MARINARA_CLASS_CATCH_UP.below);
  const classGain = Math.max(0, Math.round(xp)) * (behind ? MARINARA_CLASS_CATCH_UP.multiplier : 1);
  let next: MarinaraProgression = {
    ...progression,
    xp: progression.xp + Math.max(0, Math.round(xp)),
    classXp: {
      ...progression.classXp,
      [progression.activeClass]: (progression.classXp[progression.activeClass] ?? 0) + classGain,
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

/**
 * Carries from the secondary tree that suit a character's primary tree (Alyssa 2026-11-01, item 7):
 * testers rarely trained their secondary tree because nothing said what it offered. Named pairs carry
 * their own reason; otherwise the secondary tree's carry picks from its base class, with their summary.
 */
const SECONDARY_FITS: Partial<Record<`${MarinaraArchetype}>${MarinaraArchetype}`, Array<[string, string]>>> = {
  "marksman>guard": [
    ["sworn-ward", "Ward your tank: whoever attacks them gets shot back, at range."],
    ["challenge", "Pull one foe off the back row while you shoot."],
  ],
  "scout>guard": [["challenge", "Draw a foe onto your hard-to-hit Scout so the rest of the party strikes freely."]],
  "guard>hexer": [["drain-touch", "Your hits heal you: a tank that mends itself."]],
  "guard>marksman": [["true-aim", "Your counters land more often."]],
  "blade>herald": [["rally", "Lift the party's damage before your heavy hits."]],
  "blade>scout": [["keen-eye", "More hits and crits on every swing."]],
  "channeler>hexer": [["weaken", "Blunt the foe that threatens your back row."]],
  "hexer>channeler": [["element-bolt", "A damage spell that finds weaknesses."]],
  "hexer>mender": [["second-breath", "Heal yourself without spending a healer's turn."]],
  "mender>guard": [["steadfast", "+20% max HP keeps the healer standing."]],
  "herald>blade": [["battle-rhythm", "+15% damage on every attack, so a Herald hits back."]],
  "marksman>herald": [["rally", "Raise the party's damage, then shoot."]],
};

export interface MarinaraSecondaryFit {
  skillId: string;
  label: string;
  classId: string;
  classLabel: string;
  learnedAt: number;
  reason: string;
}

export function marinaraSecondaryFits(progression: MarinaraProgression, max = 3): MarinaraSecondaryFit[] {
  const trees = marinaraTrees(progression.primary, progression.temperament);
  if (!trees.secondary) return [];
  const inTree = MARINARA_CLASSES.filter((def) => def.archetype === trees.secondary);
  const find = (skillId: string) => {
    for (const def of inTree) {
      const skill = def.skills.find((one) => one.id === skillId);
      if (skill) return { def, skill };
    }
    return undefined;
  };
  const out: MarinaraSecondaryFit[] = [];
  const add = (skillId: string, reason?: string) => {
    const hit = find(skillId);
    if (!hit || out.some((one) => one.skillId === skillId) || out.length >= max) return;
    out.push({
      skillId,
      label: hit.skill.label,
      classId: hit.def.id,
      classLabel: hit.def.label,
      learnedAt: hit.skill.learnedAt,
      reason: reason ?? hit.skill.summary,
    });
  };
  for (const [skillId, reason] of SECONDARY_FITS[`${trees.primary}>${trees.secondary}`] ?? []) add(skillId, reason);
  const traits = MARINARA_ARCHETYPE_TRAITS[trees.secondary] ?? [];
  for (const skill of inTree.find((def) => def.tier === "base")?.skills ?? [])
    if (skill.carryPick && !traits.includes(skill.id)) add(skill.id);
  return out;
}
