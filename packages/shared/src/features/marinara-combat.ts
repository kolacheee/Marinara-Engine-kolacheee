// ──────────────────────────────────────────────
// Game: Classic Marinara fight math
//
// Fire Emblem-style math for Marinara's own classes (Alyssa 2026-10-31), shared by the Engine's fights
// (Classic menu battles and Tactical boards, run by the combat director) and the headless class lab.
// Pure data and math: nothing here reads storage or calls a model, and every roll comes from the
// caller's random stream, so a fight replays from its seed.
//
//   Physical damage = Strength + power + level × 0.2 − Defense; magic = Magic + … − Resistance.
//   Hit  = 80 + Skill×2 + Luck/2 − (Speed×2 + Luck) of the target, never below 25.
//   Crit = Skill/2 + bonuses − target Luck; a crit doubles damage.
//   Damage type: the target's affinity multiplies the hit (weak ×1.5, resist ×0.5, immune ×0,
//   absorb heals); a skill with a choice of types uses the best one against the target.
//   Magic skills cost MP (no regeneration); the rest cost stamina, which comes back each turn.
//   Turn order is a timeline: each action pushes the actor's next turn back by
//   weight × TIMELINE / (Speed + SPEED_FLOOR), so fast characters act more often.
//
// A fighter is plain JSON, so a fight's state can be saved between steps.
// ──────────────────────────────────────────────

import {
  MARINARA_ARCHETYPE_ATTACKS,
  MARINARA_ARCHETYPE_BASES,
  MARINARA_ELEMENTS,
  MARINARA_PHYSICAL_TYPES,
  MARINARA_STAMINA,
  MARINARA_STATS,
  MARINARA_POISON_RIDER,
  MARINARA_RIDER_DAMAGE_PCT,
  MARINARA_BACK_ROW_MELEE_PCT,
  MARINARA_MIN_HIT_CHANCE,
  MARINARA_LEVEL_CAP,
  MARINARA_PROMOTION_LEVEL,
  marinaraFightHpMultiplier,
  marinaraAffinityMultiplier,
  marinaraRiderLands,
  marinaraBestDamageType,
  marinaraDamageOptions,
  marinaraMaxMp,
  marinaraMaxStamina,
  marinaraClass,
  marinaraCarriedStat,
  marinaraUsableSkills,
  expectedMarinaraStats,
  type MarinaraAffinities,
  type MarinaraDamageType,
  type MarinaraSkillDamage,
  type MarinaraArchetype,
  type MarinaraSkillDef,
  type MarinaraStat,
  type MarinaraStats,
  type MarinaraProgression,
} from "./marinara-classes.js";

export const MARINARA_TUNING = {
  hitBase: 80,
  critMultiplier: 2,
  basicPower: 5,
  timeline: 1000,
  speedFloor: 10,
  defendDefensePct: 0.5,
  minDamage: 1,
  /** A hit that lands always deals at least this share of its attack and power, so two walls
   *  never trade 1s forever (Engine balance 2026-11-01). */
  minDamagePct: 0.1,
  /** Weapon and spell power grow with level, as better gear would: added to every hit's power. */
  powerPerLevel: 0.2,
  /** Heals add this share of the healer's Magic to their power. */
  healMagicPct: 0.5,
  /** How much the lab's party AI minds spending a point of each resource. */
  mpCostWeight: 0.15,
  staminaCostWeight: 0.05,
  /** Doom's toll when it runs out, as a share of max HP; a boss (over 300 HP) takes the smaller one. */
  doomPct: 0.4,
  doomBossPct: 0.1,
  /** An area attack that strikes more than one foe deals this share to each (early Final Fantasy style). */
  areaSpreadPct: 0.6,
  /** Wound halves healing received. */
  woundHealing: 0.5,
};

/** A round, for logs and the Game Master: one turn of a Speed 15 character. */
export const MARINARA_ROUND_TIME = MARINARA_TUNING.timeline / (15 + MARINARA_TUNING.speedFloor);

// ── Effects ──

export type MarinaraEffectTarget = "enemy" | "all-enemies" | "front-row" | "self" | "ally" | "party" | "downed-ally";
export type MarinaraStatusId =
  "sleep" | "stun" | "poison" | "wither" | "bleed" | "wound" | "confuse" | "doom" | "slow" | "regen";

export interface MarinaraEffect {
  kind:
    | "damage"
    | "heal"
    | "buff"
    | "debuff"
    | "status"
    | "shield"
    | "revive"
    | "cover"
    | "provoke"
    | "taunt"
    | "ward"
    | "extra-turn"
    | "command"
    | "cleanse"
    | "steal"
    | "none";
  target: MarinaraEffectTarget;
  power?: number;
  scales?: MarinaraStat;
  damage?: "physical" | "magic";
  /** Comes from a carried skill: runs on the user's carried stats. */
  carried?: boolean;
  /** A basic attack, which immunity and absorption only resist. */
  basic?: boolean;
  /** Damage type; a skill's own type comes from its definition. */
  type?: MarinaraSkillDamage;
  hits?: number;
  hitBonus?: number;
  critBonus?: number;
  /** Share of the target's Defense or Resistance ignored. */
  pierce?: number;
  /** Reaches the back row at full damage from anywhere. */
  ranged?: boolean;
  /** Buff/debuff: stat changed by a share, for `duration` of the target's turns. */
  stat?: MarinaraStat | "damage" | "damage-taken" | "imbue" | "element-taken";
  /** Buff: more stats changed alongside `stat`, for the same turns (Grand Inscription). */
  alsoMods?: readonly { stat: MarinaraStat | "damage" | "damage-taken" | "element-taken"; pct: number }[];
  /** Heal: a share of the target's max HP instead of Magic-based power. */
  pctOfMax?: number;
  pct?: number;
  duration?: number;
  status?: MarinaraStatusId;
  chance?: number;
  /** Also lays a status on the target when it lands (Rend's bleed, Curse's wound). */
  applies?: { status: MarinaraStatusId; chance?: number; duration: number; power?: number };
  /** Share of damage per foe when an area attack strikes several. */
  spread?: number;
  /** Vanish: the user can't be targeted until its next turn. */
  hide?: boolean;
  /** Costs no turn: the user acts again at once (not from an action that was itself a bonus). */
  bonusAction?: boolean;
  /** The user's next landed hit exposes its target: everyone deals this much more to it for 2 turns. */
  exposeNext?: number;
  /** A landed status also exposes the target (Seal). */
  exposes?: { pct: number; duration: number };
  /** Heals that cleanse: every debuff, or the worst one on each target. */
  cleanse?: "all" | "one";
  /** Heals the user for this share of the damage it deals (Grave Tithe). */
  drain?: number;
  /** Timeline weight of the action: 1 normal, more for heavy actions. */
  weight?: number;
  /** Takes a turn of charging before it lands. */
  charge?: boolean;
  cooldown?: number;
  oncePerFight?: boolean;
  /** Only from the front row (on a board: with a foe next to the user). */
  frontOnly?: boolean;
  /** After damage, lowers the user's own stat (Reckless Swing). */
  selfDebuff?: { stat: MarinaraStat; pct: number; duration: number };
  /** Lowers the target's stat after a hit (Shield Bash stagger, Sundering). */
  onHit?: { stat: MarinaraStat | "damage"; pct: number; duration: number };
  /** Damage counted from another stat (Verdict: Resistance). */
  from?: MarinaraStat;
  /** Extra damage below this share of the target's HP (finishers). */
  finisher?: { below: number; bonus: number };
}

const dmg = (scales: MarinaraStat, power: number, extra: Partial<MarinaraEffect> = {}): MarinaraEffect => ({
  kind: "damage",
  target: "enemy",
  scales,
  power,
  damage: scales === "magic" ? "magic" : "physical",
  ...extra,
});

/** Steal's odds: a half chance, a little more for each point of Speed over the foe's, less for elites
 *  and bosses, plus gear (Light Fingers); never below 10% or above 95%. */
export const MARINARA_STEAL: { base: number; perSpeed: number; rank: Record<MarinaraEnemyTier, number> } = {
  base: 0.5,
  perSpeed: 0.02,
  rank: { minion: 0.1, standard: 0, elite: -0.15, boss: -0.3 },
};

/** What every active class skill does. Steal takes something from a foe, kept with the fight's loot. */
export const MARINARA_SKILL_EFFECTS: Record<string, MarinaraEffect> = {
  // Blade
  "power-strike": dmg("strength", 9, { weight: 1.3 }),
  flurry: dmg("strength", 4, { hits: 2 }),
  "moonless-cut": dmg("strength", 10, { critBonus: 30, finisher: { below: 0.5, bonus: 0.5 } }),
  "reckless-swing": dmg("strength", 13, { selfDebuff: { stat: "defense", pct: -0.3, duration: 2 } }),
  "sweeping-ruin": dmg("strength", 13, {
    target: "front-row",
    weight: 1.2,
    onHit: { stat: "damage", pct: -0.15, duration: 2 },
  }),
  arsenal: dmg("strength", 8, { pierce: 0.3 }),
  // Every enemy in reach: the front row in Classic (every adjacent enemy in Tactical).
  "thousand-edges": dmg("strength", 7, { target: "front-row", weight: 1.3, cooldown: 3 }),
  // Guard
  cover: { kind: "cover", target: "ally", duration: 1 },
  provoke: { kind: "provoke", target: "self", duration: 2 },
  challenge: { kind: "taunt", target: "enemy", duration: 2 },
  "sworn-ward": { kind: "ward", target: "ally", duration: 3 },
  fortress: { kind: "buff", target: "party", stat: "damage-taken", pct: -0.5, duration: 1, cooldown: 5 },
  spellguard: { kind: "buff", target: "party", stat: "resistance", pct: 0.3, duration: 2 },
  verdict: dmg("magic", 6, { from: "resistance" }),
  "warding-stance": { kind: "buff", target: "self", stat: "resistance", pct: 0.5, duration: 2 },
  "oath-of-iron": { kind: "buff", target: "party", stat: "damage-taken", pct: -0.75, duration: 1, oncePerFight: true },
  // Scout
  steal: { kind: "steal", target: "enemy" },
  backstab: dmg("strength", 10, { critBonus: 15 }),
  vanish: {
    kind: "buff",
    target: "self",
    stat: "damage",
    pct: 0.6,
    duration: 1,
    hide: true,
    exposeNext: 0.2,
    // A bonus action (Alyssa 2026-11-01): the Phantom vanishes and strikes in the same turn.
    bonusAction: true,
    cooldown: 2,
  },
  "hit-and-run": dmg("strength", 5, { weight: 0.6 }),
  "double-time": { kind: "extra-turn", target: "self", cooldown: 3 },
  shadowstep: dmg("strength", 9, { ranged: true, critBonus: 10 }),
  "thousand-shadows": {
    kind: "buff",
    target: "party",
    stat: "damage-taken",
    pct: -0.6,
    duration: 2,
    oncePerFight: true,
  },
  // Marksman
  "aimed-shot": dmg("strength", 8, { ranged: true, hitBonus: 30, weight: 1.2 }),
  pierce: dmg("strength", 7, { ranged: true, pierce: 0.5 }),
  headshot: dmg("strength", 20, { ranged: true, charge: true, critBonus: 25 }),
  "mark-prey": { kind: "debuff", target: "enemy", stat: "damage-taken", pct: 0.35, duration: 3 },
  "snare-field": { kind: "debuff", target: "all-enemies", stat: "speed", pct: -0.3, duration: 2 },
  volley: dmg("strength", 4, { ranged: true, target: "all-enemies", cooldown: 2 }),
  "ruinous-barrage": dmg("strength", 9, {
    ranged: true,
    target: "all-enemies",
    weight: 1.3,
    cooldown: 3,
    onHit: { stat: "defense", pct: -0.25, duration: 2 },
  }),
  // Channeler
  "element-bolt": dmg("magic", 7, { ranged: true }),
  "twin-cast": dmg("magic", 5, { ranged: true, hits: 2 }),
  // More power (Alyssa 2026-11-01): was 6.
  tempest: dmg("magic", 9, { ranged: true, target: "all-enemies", weight: 1.2, cooldown: 2 }),
  // Rune Scholar line (Alyssa 2026-11-01): party elemental support. The party's weapons take whichever
  // of fire, ice and lightning hurts most.
  "edge-runes": { kind: "buff", target: "party", stat: "imbue", pct: 1, duration: 3, cooldown: 2 },
  "grand-inscription": {
    kind: "buff",
    target: "party",
    stat: "imbue",
    pct: 1,
    duration: 3,
    cooldown: 3,
    alsoMods: [
      { stat: "damage", pct: 0.2 },
      { stat: "element-taken", pct: -0.3 },
    ],
  },
  starfall: dmg("magic", 8, { ranged: true, pierce: 1 }),
  convergence: dmg("magic", 24, { ranged: true, charge: true }),
  // Hexer
  weaken: { kind: "debuff", target: "enemy", stat: "damage", pct: -0.25, duration: 3 },
  rot: { kind: "status", target: "enemy", status: "poison", chance: 0.9, duration: 4, power: 0.08 },
  wither: { kind: "status", target: "enemy", status: "wither", chance: 1, duration: 3, power: 0.06 },
  doom: { kind: "status", target: "enemy", status: "doom", chance: 0.6, duration: 3 },
  // Carrion Lord (the Hexer's front-line master): a heavy drain on one foe, all of it back.
  "carrion-feast": dmg("magic", 14, { ranged: true, drain: 1, cooldown: 2 }),
  lull: { kind: "status", target: "enemy", status: "sleep", chance: 0.75, duration: 3 },
  "mass-confusion": { kind: "status", target: "all-enemies", status: "confuse", chance: 0.7, duration: 2 },
  siphon: dmg("magic", 8, { ranged: true, pierce: 0.5 }),
  // Every foe, and the Hexer drinks half of it back: a Hexer can hold the front against a swarm
  // (Alyssa 2026-11-01).
  // Front row only (Alyssa 2026-11-01): the Hexer's front-line drain.
  "grave-tithe": dmg("magic", 5, { target: "all-enemies", ranged: true, drain: 0.5, cooldown: 2, frontOnly: true }),
  // Void Sovereign (reworked 2026-11-01): it hurts every foe as well as weakening them.
  "total-eclipse": dmg("magic", 7, {
    target: "all-enemies",
    ranged: true,
    cooldown: 2,
    onHit: { stat: "damage", pct: -0.2, duration: 2 },
  }),
  // Mender
  mend: { kind: "heal", target: "ally", scales: "magic", power: 8 },
  revive: { kind: "revive", target: "downed-ally", power: 0.25 },
  sanctuary: { kind: "heal", target: "party", scales: "magic", power: 5, weight: 1.2, cleanse: "one" },
  remedy: { kind: "heal", target: "ally", scales: "magic", power: 5, cleanse: "all" },
  purify: { kind: "cleanse", target: "ally", cleanse: "all" },
  "elixir-rain": { kind: "status", target: "party", status: "regen", chance: 1, duration: 3, power: 0.07 },
  barrier: { kind: "shield", target: "ally", scales: "magic", power: 8 },
  "undying-light": { kind: "revive", target: "downed-ally", power: 0.5, oncePerFight: true },
  // Herald
  "imbue-weapon": { kind: "buff", target: "self", stat: "imbue", pct: 1, duration: 3 },
  "second-breath": { kind: "heal", target: "self", pctOfMax: 0.25, cooldown: 3 },
  rally: { kind: "buff", target: "party", stat: "damage", pct: 0.2, duration: 2 },
  "battle-hymn": { kind: "buff", target: "party", stat: "damage", pct: 0.25, duration: 3 },
  crescendo: { kind: "buff", target: "party", stat: "damage", pct: 0.5, duration: 1, cooldown: 3 },
  command: { kind: "command", target: "ally" },
  "grand-strategy": { kind: "command", target: "party", cooldown: 4 },
  "raise-the-banner": { kind: "buff", target: "party", stat: "damage", pct: 0.25, duration: 3 },
  "hour-of-heroes": { kind: "command", target: "party", oncePerFight: true },
};

/**
 * What foes can do besides attack and their class skills: damage over time and debuffs a healer
 * would want to remove. The bestiary adds its own abilities to this table.
 */
export const MARINARA_ENEMY_SKILLS: Record<string, MarinaraEffect & { label?: string }> = {
  // A bruiser's tearing blow: the target bleeds for 5% of max HP a turn.
  rend: {
    label: "Rend",
    ...dmg("strength", 5, { applies: { status: "bleed", duration: 3, power: 0.05 }, cooldown: 3 }),
  },
  // A guard's armour-breaking blow.
  sunder: {
    label: "Sunder",
    ...dmg("strength", 5, { onHit: { stat: "defense", pct: -0.25, duration: 2 }, cooldown: 3 }),
  },
  // An archer's poisoned arrow: 6% of max HP a turn.
  "venom-arrow": {
    label: "Venom Arrow",
    ...dmg("strength", 4, {
      ranged: true,
      type: "pierce",
      applies: { status: "poison", duration: 3, power: 0.06 },
      cooldown: 3,
    }),
  },
  // A caster's curse: healing received halved and damage dealt down a fifth.
  curse: {
    label: "Curse",
    kind: "debuff",
    target: "enemy",
    stat: "damage",
    pct: -0.2,
    duration: 2,
    ranged: true,
    applies: { status: "wound", duration: 3 },
    cooldown: 3,
  },
};

/** Adds abilities to the foes' table (the bestiary's), its own ids winning a clash. */
export function registerMarinaraEnemySkills(table: Record<string, MarinaraEffect & { label?: string }>): void {
  Object.assign(MARINARA_ENEMY_SKILLS, table);
}

const HARMFUL = new Set<MarinaraStatusId>([
  "poison",
  "wither",
  "bleed",
  "wound",
  "doom",
  "sleep",
  "stun",
  "confuse",
  "slow",
]);

// ── Passives ──

/** Passive hooks the resolver reads. */
/**
 * Grave Hunger (Alyssa 2026-11-01): every enemy within a Hexer's spell reach gives up a share of its
 * Defense and Resistance to the Hexer while it lives and stays in reach, a bigger share while the
 * Hexer stands in the front line (`frontPct`), so a Hexer stands up better
 * the more foes crowd the field. In Classic a Hexer's curses reach every foe; on a board, foes within
 * its spell range. Counts at most `most` foes.
 */
export const MARINARA_GRAVE_HUNGER = { pct: 0.15, frontPct: 0.25, most: 5 };

export interface MarinaraPassiveHooks {
  damagePct?: number;
  hpPct?: number;
  /** +30% Defense and Resistance until the next turn after defending or charging. */
  entrench?: boolean;
  holdTheLine?: boolean;
  vanguard?: boolean;
  /** Added to the weakness multiplier. */
  weakBonus?: number;
  lifestealPct?: number;
  /** Ammo Pouch: weapon hits may take any martial or elemental type. */
  ammo?: boolean;
  /** Magic damage the user takes changes by this share (Old Oath). */
  magicTakenPct?: number;
  /** Siphoning Rot: the user's poison and wither ticks heal it for this share of what they take. */
  curseFeedPct?: number;
  /** Grave Skin: damage taken is cut by this share while the user stands in the front line. */
  frontTakenPct?: number;
  /** Grave Hunger: takes this share of each enemy in reach's Defense and Resistance. */
  leechGuardPct?: number;
  partyDamagePct?: number;
  critBonus?: number;
  hitBonus?: number;
  /** Counter a melee attack: always, or only one that missed. */
  counter?: "always" | "on-miss";
  healOnKillPct?: number;
  damageBelowHalfPct?: number;
  /** More damage by this share times the share of max HP the user is missing (Bloodrage). */
  damagePerMissingPct?: number;
  evadeFirstHitEachRound?: boolean;
  statPct?: Partial<Record<MarinaraStat, number>>;
  mpPct?: number;
  mpRegenPct?: number;
  spellDamagePct?: number;
  partySpeedPct?: number;
  partyDefensePct?: number;
  partyResistancePct?: number;
  /** The party takes this share more (negative: less) fire, ice and lightning damage (Warding Runes). */
  partyElementTakenPct?: number;
  partyCritBonus?: number;
  partyMagicTakenPct?: number;
  frontRowDefensePct?: number;
  backRowTakenPct?: number;
  defendBonusPct?: number;
  lastStand?: boolean;
  miracle?: boolean;
  assassinate?: boolean;
  actOnKill?: boolean;
  extraActionEvery?: number;
  debuffImmune?: boolean;
  debuffDurationBonus?: number;
  buffDurationBonus?: number;
  overheal?: boolean;
  healCrit?: boolean;
  bonusVsMarked?: number;
  /** The whole party deals more to a marked target (Pack Tactics). */
  partyBonusVsMarked?: number;
  hitsLowerDefense?: number;
  firstSpellFree?: boolean;
  partyDamageWhileWhole?: number;
  reprisalPct?: number;
  enemyCritToMissChance?: number;
  /** Sleeping foes take damage each of their turns. */
  nightmare?: boolean;
  devour?: boolean;
  slowDebuffed?: number;
  /** Gains dodge with each miss against it. */
  evasionStacking?: number;
  /** Heavy Draw: physical damage up. */
  heavyDraw?: boolean;
  bloodlust?: boolean;
  unstoppable?: boolean;
  /** Damage taken changes by this share while below half HP. */
  takenBelowHalfPct?: number;
  /** Spells cost this share more (negative: less) MP. */
  mpCostPct?: number;
  noPenalty?: boolean;
}

export const MARINARA_PASSIVES: Record<string, MarinaraPassiveHooks> = {
  "battle-rhythm": { damagePct: 0.15 },
  steadfast: { hpPct: 0.2 },
  entrench: { entrench: true },
  "hold-the-line": { holdTheLine: true, vanguard: true },
  "keen-eye": { hitBonus: 15, critBonus: 10 },
  "exploit-weakness": { weakBonus: 0.5 },
  "drain-touch": { lifestealPct: 0.2 },
  "grave-hunger": { leechGuardPct: MARINARA_GRAVE_HUNGER.pct },
  "rallying-presence": { partyDamagePct: 0.1 },
  riposte: { counter: "on-miss" },
  "keen-edge": { critBonus: 10 },
  "second-wind": { actOnKill: true },
  // Bloodsworn (Alyssa 2026-11-01): the lower its HP, the harder it hits, and it drinks from every hit.
  bloodrage: { damagePerMissingPct: 0.6 },
  bloodlust: { lifestealPct: 0.15 },
  unstoppable: { unstoppable: true, takenBelowHalfPct: -0.15 },
  "adaptive-grip": { hitBonus: 10, noPenalty: true },
  peerless: { extraActionEvery: 3 },
  stalwart: { defendBonusPct: 0.2 },
  "shield-wall": { backRowTakenPct: -0.25 },
  "last-stand": { lastStand: true },
  retaliate: { counter: "always" },
  "aura-of-warding": { partyMagicTakenPct: -0.35 },
  "elder-oath": { statPct: { resistance: 0.5 } },
  immovable: { unstoppable: true },
  "shield-line": { partyDefensePct: 0.15, partyResistancePct: 0.15 },
  "light-feet": { statPct: { speed: 0.1 } },
  exploit: { critBonus: 15 },
  assassinate: { assassinate: true },
  fleet: { statPct: { speed: 0.2 } },
  tailwind: { partySpeedPct: 0.2 },
  elusive: { evadeFirstHitEachRound: true },
  "perfect-evasion": { evasionStacking: 10 },
  "true-aim": { hitBonus: 15 },
  steady: { hitBonus: 5 },
  overwatch: { counter: "always" },
  "abyssal-will": { spellDamagePct: 0.2 },
  "dead-eye": { critBonus: 15, weakBonus: 0.25 },
  "ammo-pouch": { ammo: true },
  "old-oath": { statPct: { resistance: 0.3 }, magicTakenPct: -0.2 },
  "read-the-signs": { critBonus: 5, bonusVsMarked: 0.2 },
  "pack-tactics": { partyBonusVsMarked: 0.4 },
  "heavy-draw": { heavyDraw: true },
  sundering: { hitsLowerDefense: 0.1 },
  attunement: { spellDamagePct: 0.15 },
  overcharge: { critBonus: 10 },
  "warding-runes": { partyElementTakenPct: -0.25 },
  "living-runes": { partyElementTakenPct: -0.35, buffDurationBonus: 1 },
  "deep-well": { mpPct: 0.5 },
  "mana-tide": { mpRegenPct: 0.08 },
  lingering: { debuffDurationBonus: 1 },
  "ill-omen": { enemyCritToMissChance: 0.5 },
  "grave-skin": { frontTakenPct: -0.15 },
  "siphoning-rot": { curseFeedPct: 0.5 },
  "slow-time": { slowDebuffed: 0.25 },
  nightmare: { nightmare: true },
  null: { debuffImmune: true },
  devour: { devour: true },
  grace: { healCrit: true },
  miracle: { miracle: true },
  "item-savant": {},
  "double-dose": {},
  overheal: { overheal: true },
  sanctified: { partyMagicTakenPct: -0.15 },
  encore: { buffDurationBonus: 1 },
  tempo: { partySpeedPct: 0.1 },
  foresight: { partyDefensePct: 0.1 },
  formation: { partyDefensePct: 0.15 },
  inspire: { partyDamageWhileWhole: 0.1 },
  "fortunes-favour": { partyCritBonus: 10 },
};

// ── Fighters ──

/** One combatant of a Classic Marinara fight: everything the math reads, as plain JSON. */
export interface MarinaraFighter {
  id: string;
  name: string;
  side: "party" | "enemy";
  row: "front" | "back";
  archetype?: MarinaraArchetype;
  stats: MarinaraStats;
  maxHp: number;
  hp: number;
  maxMp: number;
  mp: number;
  maxStamina: number;
  stamina: number;
  affinities?: MarinaraAffinities;
  /** On a board: the foes next to it, as the director last saw them (Sworn Ward). */
  nearFoes?: string[];
  /** On a board: the foes within a Hexer's spell reach (Grave Hunger). */
  spellFoes?: string[];
  /** Carried skill ids, and the stats they run on (best-trained class). */
  carriedIds?: string[];
  carriedStats?: Partial<MarinaraStats>;
  /** The class it fights as; its weapons and basic attack follow it. */
  classId?: string;
  /** A coating on the weapon: a rider type carried on weapon hits, for `coatingTurns` more turns. */
  coating?: MarinaraDamageType;
  coatingTurns?: number;
  /** Damage type of a unit with no class (a monster). */
  attackType?: MarinaraDamageType;
  /** Active skills and passives it fights with. */
  skills: MarinaraSkillDef[];
  /** A foe's own abilities (MARINARA_ENEMY_SKILLS ids). */
  enemySkills?: string[];
  /** Basic attack reaches the back row at full damage (bows, spells). */
  rangedBasic: boolean;
  /** A dummy never acts. */
  dummy?: boolean;
  level: number;
  /** Basic attack uses Magic (casters). */
  magicBasic?: boolean;
  /** Extra power from gear on every hit, on top of the level's. */
  gearPower?: number;
  /** What equipped gear gives (marinara-items.ts `marinaraGearBonus`): its weapon and spell power
   *  replace the level's stand-in, its weapon decides the weapon's damage type. */
  gear?: MarinaraFighterGear;
  /** The foe's tier, for balance and XP. */
  tier?: MarinaraEnemyTier;
  /** A bestiary foe's family (marinara-bestiary.ts), for its signature drops. */
  familyId?: string;
  /** Robbed by this fighter (Steal): a foe has one thing to take, kept with the fight's loot. */
  stolenBy?: string;
  /** A boss once below half its HP: it hits harder for the rest of the fight (MARINARA_BOSS_RULES). */
  enraged?: boolean;
  // fight state
  next: number;
  mods: Array<{ stat: string; pct: number; turns: number; source: string }>;
  /** `by`: who laid it, for a curse whose ticks feed its caster (Siphoning Rot). */
  statuses: Array<{ status: MarinaraStatusId; turns: number; power?: number; by?: string }>;
  shield: number;
  covering?: string;
  provoking: number;
  /** Taunted: must target this unit while `tauntTurns` lasts. */
  tauntedBy?: string;
  tauntTurns: number;
  /** Sworn Ward: the ally this unit watches over, and for how many of its own turns. */
  wardOn?: string;
  wardTurns: number;
  cooldowns: Record<string, number>;
  /** Skills used once per fight that have been used. */
  used: string[];
  charging?: { skillId: string; targetId: string };
  lastStandUsed?: boolean;
  miracleUsed?: boolean;
  evadedThisRound?: boolean;
  missesAgainst: number;
  firstSpellUsed?: boolean;
  actions: number;
  defending: boolean;
  marked: number;
  hidden?: boolean;
  exposeNext?: number;
  secondWindUsed?: boolean;
  /** Commanded (Command, Grand Strategy): acts again at once, outside its own place on the timeline. */
  bonusTurns?: number;
  /** This action is a commanded one, which can't command in turn. */
  commanded?: boolean;
}

export interface MarinaraFighterGear {
  power: number;
  spellPower: number;
  weaponType?: MarinaraDamageType;
  hit?: number;
  crit?: number;
  damagePct?: number;
  lifestealPct?: number;
  /** Added to the chance a Steal takes something. */
  stealChance?: number;
  /** Statuses it can't be given. */
  immune?: string[];
}

export interface MarinaraFighterInput {
  id: string;
  name: string;
  side: MarinaraFighter["side"];
  row: MarinaraFighter["row"];
  stats: MarinaraStats;
  skills?: MarinaraSkillDef[];
  archetype?: MarinaraArchetype;
  rangedBasic?: boolean;
  magicBasic?: boolean;
  dummy?: boolean;
  hpOverride?: number;
  level?: number;
  affinities?: MarinaraAffinities;
  classId?: string;
  attackType?: MarinaraDamageType;
  carriedIds?: readonly string[];
  carriedStats?: Partial<MarinaraStats>;
  coating?: MarinaraDamageType;
  enemySkills?: string[];
  gearPower?: number;
  gear?: MarinaraFighterGear;
  tier?: MarinaraEnemyTier;
}

export function makeMarinaraFighter(input: MarinaraFighterInput): MarinaraFighter {
  const passives = marinaraPassiveHooks(input.skills ?? []);
  // Carrying a skill that spends MP (or stamina) sizes that pool from the carried stats, as the
  // skill's own power is.
  const carries = (resource: "mp" | "stamina") =>
    (input.skills ?? []).some((skill) => input.carriedIds?.includes(skill.id) && skill.resource === resource);
  const pick = (stat: MarinaraStat, resource: "mp" | "stamina") =>
    carries(resource) ? Math.max(input.stats[stat], input.carriedStats?.[stat] ?? 0) : input.stats[stat];
  const maxMp = Math.round(marinaraMaxMp({ magic: pick("magic", "mp") }) * (1 + (passives.mpPct ?? 0)));
  const maxStamina = marinaraMaxStamina({ strength: pick("strength", "stamina"), speed: pick("speed", "stamina") });
  const maxHp =
    input.hpOverride ??
    Math.max(1, Math.round(input.stats.hp * marinaraFightHpMultiplier(input.level ?? 1) * (1 + (passives.hpPct ?? 0))));
  const { hpOverride: _h, carriedIds, ...rest } = input;
  return {
    ...rest,
    ...(carriedIds ? { carriedIds: [...carriedIds] } : {}),
    level: input.level ?? 1,
    skills: input.skills ?? [],
    rangedBasic: input.rangedBasic ?? false,
    maxHp,
    hp: maxHp,
    maxMp,
    mp: maxMp,
    maxStamina,
    stamina: maxStamina,
    next: 0,
    mods: [],
    statuses: [],
    shield: 0,
    provoking: 0,
    tauntTurns: 0,
    wardTurns: 0,
    cooldowns: {},
    used: [],
    missesAgainst: 0,
    actions: 0,
    defending: false,
    marked: 0,
  };
}

/** Where an archetype stands in a Classic fight by default. */
export const MARINARA_ARCHETYPE_ROWS: Record<MarinaraArchetype, MarinaraFighter["row"]> = {
  blade: "front",
  guard: "front",
  scout: "front",
  marksman: "back",
  channeler: "back",
  hexer: "back",
  mender: "back",
  // A Herald lifts the party from behind it (was front row: 41-48% downed, 1-4% of damage; playtest 2026-11-01).
  herald: "back",
};

const RANGED_ARCHETYPES = new Set<MarinaraArchetype>(["marksman"]);
const CASTER_ARCHETYPES = new Set<MarinaraArchetype>(["channeler", "hexer", "mender"]);

/** A party member's fighter, from their progression (and the gear power they carry, when known). */
export function buildMarinaraPartyFighter(input: {
  id: string;
  name: string;
  progression: MarinaraProgression;
  row?: MarinaraFighter["row"];
  gearPower?: number;
  gearStats?: Partial<MarinaraStats>;
  gear?: MarinaraFighterGear;
  /** A ranged weapon in hand: the basic attack reaches the back row at full damage. */
  rangedWeapon?: boolean;
  affinities?: MarinaraAffinities;
}): MarinaraFighter {
  const { progression } = input;
  const def = marinaraClass(progression.activeClass);
  const archetype = def?.archetype ?? progression.primary;
  const usable = marinaraUsableSkills(progression);
  const carriedIds = usable.filter((skill) => skill.classId !== progression.activeClass).map((skill) => skill.id);
  const carriedStats = Object.fromEntries(
    MARINARA_STATS.map((stat) => [stat, marinaraCarriedStat(progression, stat)]),
  ) as MarinaraStats;
  const stats = Object.fromEntries(
    MARINARA_STATS.map((stat) => [stat, progression.stats[stat] + (input.gearStats?.[stat] ?? 0)]),
  ) as MarinaraStats;
  return makeMarinaraFighter({
    id: input.id,
    name: input.name,
    side: "party",
    row: input.row ?? def?.row ?? MARINARA_ARCHETYPE_ROWS[archetype],
    stats,
    skills: usable.map(({ classId: _c, ...skill }) => skill),
    archetype,
    classId: progression.activeClass,
    level: progression.level,
    rangedBasic: input.rangedWeapon ?? RANGED_ARCHETYPES.has(archetype),
    magicBasic: CASTER_ARCHETYPES.has(archetype),
    carriedIds,
    ...(input.gear ? { gear: input.gear } : {}),
    carriedStats,
    ...(input.gearPower ? { gearPower: input.gearPower } : {}),
    ...(input.affinities ? { affinities: input.affinities } : {}),
  });
}

// ── Foes ──

export type MarinaraEnemyTier = "minion" | "standard" | "elite" | "boss";
export const MARINARA_ENEMY_TIERS_LIST = ["minion", "standard", "elite", "boss"] as const;

/** How a tier scales a foe: `hp` multiplies its fight HP, `stats` every other stat. Draft numbers,
 *  calibrated against the Engine's own combat AI. */
export const MARINARA_ENEMY_TIERS: Record<MarinaraEnemyTier, { hp: number; stats: number; xp: number }> = {
  minion: { hp: 0.6, stats: 0.85, xp: 0.5 },
  standard: { hp: 1, stats: 1, xp: 1 },
  elite: { hp: 2.2, stats: 1.15, xp: 2 },
  boss: { hp: 5, stats: 1.3, xp: 5 },
};

export interface MarinaraEnemySpec {
  id: string;
  name: string;
  /** A humanoid foe on a class tree fights with that class's skills. */
  classId?: string;
  archetype?: MarinaraArchetype;
  level: number;
  tier: MarinaraEnemyTier;
  row?: MarinaraFighter["row"];
  affinities?: MarinaraAffinities;
  attackType?: MarinaraDamageType;
  enemySkills?: string[];
  /** Per-stat multipliers on the archetype's expected stats, before the tier's (a slime's soft body). */
  statScale?: Partial<MarinaraStats>;
  /** Basic attack reaches the back row at full damage. */
  ranged?: boolean;
  /** Basic attack uses Magic. */
  magic?: boolean;
}

/** A foe built from the same tables as the party: the archetype's expected stats at its level,
 *  shaped by its kind and scaled by its tier. Humanoids on a class tree get that class's skills. */
export function buildMarinaraEnemy(spec: MarinaraEnemySpec): MarinaraFighter {
  const def = spec.classId ? marinaraClass(spec.classId) : undefined;
  const archetype = def?.archetype ?? spec.archetype ?? "blade";
  const level = Math.max(1, Math.min(MARINARA_LEVEL_CAP, Math.round(spec.level)));
  const tier = MARINARA_ENEMY_TIERS[spec.tier] ?? MARINARA_ENEMY_TIERS.standard;
  const expected = expectedMarinaraStats(archetype, level);
  const stats = Object.fromEntries(
    MARINARA_STATS.map((stat) => {
      const shaped = expected[stat] * (spec.statScale?.[stat] ?? 1);
      return [stat, Math.max(0, Math.round(stat === "hp" ? shaped : shaped * tier.stats))];
    }),
  ) as MarinaraStats;
  // The class's skills a character of this level would have learned in it.
  const classLevel = def ? (def.tier === "base" ? Math.min(level, MARINARA_PROMOTION_LEVEL.advanced) : level) : 0;
  const skills = def ? def.skills.filter((skill) => skill.learnedAt <= classLevel) : [];
  const fighter = makeMarinaraFighter({
    id: spec.id,
    name: spec.name,
    side: "enemy",
    row: spec.row ?? MARINARA_ARCHETYPE_ROWS[archetype],
    stats,
    skills,
    archetype,
    level,
    rangedBasic: spec.ranged ?? RANGED_ARCHETYPES.has(archetype),
    magicBasic: spec.magic ?? CASTER_ARCHETYPES.has(archetype),
    ...(def ? { classId: def.id } : { attackType: spec.attackType ?? "blunt" }),
    ...(spec.affinities ? { affinities: spec.affinities } : {}),
    ...(spec.enemySkills?.length ? { enemySkills: [...spec.enemySkills] } : {}),
    tier: spec.tier,
  });
  fighter.maxHp = Math.max(1, Math.round(fighter.maxHp * tier.hp));
  fighter.hp = fighter.maxHp;
  return fighter;
}

/** The party level a fight is balanced against: the average of its members' levels. */
export function marinaraPartyLevel(levels: readonly number[]): number {
  if (!levels.length) return 1;
  return Math.max(1, Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length));
}

/**
 * An encounter's budget, in standard foes at the party's level: a fight for a party of N is about
 * N standard foes on Normal. Minions count half, elites double, a boss four.
 */
export const MARINARA_TIER_COST: Record<MarinaraEnemyTier, number> = { minion: 0.5, standard: 1, elite: 2, boss: 4 };
export const MARINARA_DIFFICULTY_BUDGET: Record<string, number> = {
  casual: 0.7,
  normal: 1,
  hard: 1.3,
  brutal: 1.6,
};
export function marinaraEncounterBudget(partySize: number, difficulty: string): number {
  return Math.max(1, partySize) * (MARINARA_DIFFICULTY_BUDGET[difficulty] ?? 1);
}

/**
 * Holds a fight's foes to its budget: while they cost more, the costliest non-boss foe drops a tier
 * (an elite becomes standard, a standard a minion), then the boss drops to elite, then minions go.
 * Returns the tiers to use, by index, and whether anything changed.
 */
export function fitMarinaraEncounter(
  tiers: readonly MarinaraEnemyTier[],
  budget: number,
): { tiers: MarinaraEnemyTier[]; dropped: number[]; changed: boolean } {
  const out = [...tiers];
  const dropped: number[] = [];
  const cost = () =>
    out.reduce((sum, tier, index) => sum + (dropped.includes(index) ? 0 : MARINARA_TIER_COST[tier]), 0);
  const lower: Record<MarinaraEnemyTier, MarinaraEnemyTier | null> = {
    boss: "elite",
    elite: "standard",
    standard: "minion",
    minion: null,
  };
  let changed = false;
  for (let guard = 0; guard < 64 && cost() > budget + 1e-9; guard++) {
    const candidates = out.map((tier, index) => ({ tier, index })).filter(({ index }) => !dropped.includes(index));
    const nonBoss = candidates.filter(({ tier }) => tier !== "boss" && tier !== "minion");
    const pick =
      nonBoss.sort((a, b) => MARINARA_TIER_COST[b.tier] - MARINARA_TIER_COST[a.tier])[0] ??
      candidates.find(({ tier }) => tier === "boss" && candidates.length === 1 && budget < MARINARA_TIER_COST.boss) ??
      candidates.filter(({ tier }) => tier === "minion").at(-1);
    if (!pick) break;
    const next = lower[pick.tier];
    if (next) out[pick.index] = next;
    else if (candidates.length > 1) dropped.push(pick.index);
    else break;
    changed = true;
  }
  return { tiers: out, dropped, changed };
}

// ── Passive lookup ──

export function marinaraPassiveHooks(skills: readonly MarinaraSkillDef[]): MarinaraPassiveHooks {
  const out: MarinaraPassiveHooks = {};
  for (const skill of skills) {
    if (skill.kind !== "passive") continue;
    const hooks = MARINARA_PASSIVES[skill.id] ?? {};
    for (const [key, value] of Object.entries(hooks) as Array<[keyof MarinaraPassiveHooks, unknown]>) {
      const current = out[key];
      if (typeof value === "number") (out as Record<string, unknown>)[key] = ((current as number) ?? 0) + value;
      else if (key === "statPct") {
        const merged = { ...(out.statPct ?? {}) };
        for (const [stat, pct] of Object.entries(value as Record<string, number>))
          merged[stat as MarinaraStat] = (merged[stat as MarinaraStat] ?? 0) + pct;
        out.statPct = merged;
      } else (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

// Fighters are re-read many times a turn; their skill lists don't change in a fight.
const hookCache = new WeakMap<readonly MarinaraSkillDef[], MarinaraPassiveHooks>();
function hooksOf(unit: MarinaraFighter): MarinaraPassiveHooks {
  const cached = hookCache.get(unit.skills);
  if (cached) return cached;
  const hooks = marinaraPassiveHooks(unit.skills);
  hookCache.set(unit.skills, hooks);
  return hooks;
}

// ── A fight's context ──

export type MarinaraEventKind =
  | "hit"
  | "miss"
  | "evade"
  | "heal"
  | "absorb"
  | "rider"
  | "status"
  | "resist"
  | "tick"
  | "buff"
  | "debuff"
  | "cleanse"
  | "shield"
  | "down"
  | "revive"
  | "counter"
  | "cover"
  | "ward"
  | "taunt"
  | "provoke"
  | "skip"
  | "defend"
  | "charge"
  | "extra-turn"
  | "command"
  | "last-stand"
  | "miracle"
  | "hold-the-line"
  | "steal";

/** One thing that happened, for the log and the narration. */
export interface MarinaraEvent {
  kind: MarinaraEventKind;
  actorId: string;
  targetId?: string;
  skillId?: string;
  amount?: number;
  crit?: boolean;
  status?: string;
  /** The damage type a hit landed with, and how the target took it. */
  type?: MarinaraDamageType;
  affinity?: "weak" | "resist" | "immune" | "absorb";
  /** The chance a hit had, shown with its roll. */
  chance?: number;
  roll?: number;
}

export interface MarinaraFightContext {
  random: () => number;
  /** Tactical boards: no rows (the director checks reach). */
  tactical?: boolean;
  /** Lab only: an area attack on the front row hits only the one targeted when the foes are spread out. */
  grouped?: boolean;
  events: MarinaraEvent[];
}

const living = (units: readonly MarinaraFighter[]) => units.filter((unit) => unit.hp > 0);
const healFactor = (unit: MarinaraFighter) =>
  unit.statuses.some((s) => s.status === "wound") ? MARINARA_TUNING.woundHealing : 1;
const turnLength = (unit: MarinaraFighter, all: readonly MarinaraFighter[]) =>
  MARINARA_TUNING.timeline / (marinaraEffectiveStat(unit, "speed", all) + MARINARA_TUNING.speedFloor);

export function marinaraEffectiveStat(
  unit: MarinaraFighter,
  stat: MarinaraStat,
  all: readonly MarinaraFighter[],
): number {
  const own = hooksOf(unit);
  let pct = own.statPct?.[stat] ?? 0;
  for (const mod of unit.mods) if (mod.stat === stat) pct += mod.pct;
  const allies = all.filter((other) => other.side === unit.side && other.hp > 0);
  for (const ally of allies) {
    const hooks = hooksOf(ally);
    if (stat === "speed") pct += hooks.partySpeedPct ?? 0;
    if (stat === "resistance") pct += hooks.partyResistancePct ?? 0;
    if (stat === "defense") {
      pct += hooks.partyDefensePct ?? 0;
      if (marinaraRowOf(unit, all) === "front") pct += hooks.frontRowDefensePct ?? 0;
    }
  }
  if (stat === "speed" && unit.statuses.some((s) => s.status === "slow")) pct -= 0.3;
  if (stat === "defense" && unit.defending) pct += MARINARA_TUNING.defendDefensePct + (own.defendBonusPct ?? 0);
  let flat = 0;
  if (stat === "defense" || stat === "resistance") {
    // Grave Hunger: what the Hexer takes, its foes in reach lose.
    if (own.leechGuardPct)
      for (const foe of marinaraLeeched(unit, all)) flat += foe.stats[stat] * marinaraLeechPct(unit, all);
    for (const other of all) {
      if (other.side === unit.side || other.hp <= 0) continue;
      const leech = hooksOf(other).leechGuardPct;
      if (leech && marinaraLeeched(other, all).includes(unit)) flat -= unit.stats[stat] * marinaraLeechPct(other, all);
    }
  }
  return Math.max(0, unit.stats[stat] * (1 + pct) + flat);
}

/**
 * Whether a Sworn Ward's keeper can strike back at an attacker: a ranged keeper always can; a melee
 * one only an attacker next to it on a board, or in Classic one in the front row (or with no front
 * row left to hide behind). Ranged foes were struck from across the field (playtest 2026-11-01).
 */
export function marinaraWarderReaches(
  warder: MarinaraFighter,
  attacker: MarinaraFighter,
  all: readonly MarinaraFighter[],
): boolean {
  if (warder.rangedBasic || warder.magicBasic) return true;
  if (warder.nearFoes) return warder.nearFoes.includes(attacker.id);
  return marinaraRowOf(attacker, all) === "front";
}

/**
 * The row a fighter fights in now: with nobody left standing in its side's front row, the back row
 * is the front (Alyssa 2026-11-01), for every rule — melee damage, front-row hooks, sweeps, reach.
 */
export function marinaraRowOf(unit: MarinaraFighter, all: readonly MarinaraFighter[]): MarinaraFighter["row"] {
  if (unit.row === "front") return "front";
  return all.some((u) => u.side === unit.side && u.hp > 0 && u.row === "front") ? "back" : "front";
}

/**
 * Whether a fighter stands in the front line now: in Classic its row as it fights (see
 * marinaraRowOf; its own row when the side isn't known), on a board a foe next to it.
 */
export function marinaraStandsFront(unit: MarinaraFighter, all?: readonly MarinaraFighter[]): boolean {
  if (unit.nearFoes) return unit.nearFoes.length > 0;
  return (all ? marinaraRowOf(unit, all) : unit.row) === "front";
}

/** The share Grave Hunger takes from each foe now: more from the front line. */
export function marinaraLeechPct(unit: MarinaraFighter, all: readonly MarinaraFighter[]): number {
  return marinaraStandsFront(unit, all) ? MARINARA_GRAVE_HUNGER.frontPct : MARINARA_GRAVE_HUNGER.pct;
}

/** The foes a Grave Hunger Hexer drains now. */
export function marinaraLeeched(unit: MarinaraFighter, all: readonly MarinaraFighter[]): MarinaraFighter[] {
  if (unit.hp <= 0) return [];
  const foes = all.filter((other) => other.side !== unit.side && other.hp > 0);
  const inReach = unit.spellFoes ? foes.filter((foe) => unit.spellFoes!.includes(foe.id)) : foes;
  return inReach.slice(0, MARINARA_GRAVE_HUNGER.most);
}

/** The stat an effect's power runs on: a carried skill uses the better of own and carried stats. */
function powerStat(unit: MarinaraFighter, stat: MarinaraStat, effect: MarinaraEffect, all: readonly MarinaraFighter[]) {
  const own = marinaraEffectiveStat(unit, stat, all);
  const carried = effect.carried ? unit.carriedStats?.[stat] : undefined;
  return carried === undefined ? own : Math.max(own, carried * (own / Math.max(1, unit.stats[stat])));
}

/** The damage types this effect can hit with; an imbued weapon adds the elements. */
function damageOptions(actor: MarinaraFighter, effect: MarinaraEffect): readonly MarinaraDamageType[] {
  if (!actor.classId) {
    if (effect.type && effect.type !== "weapon" && effect.type !== "element" && effect.type !== "any-physical")
      return [effect.type];
    return [actor.attackType ?? "blunt"];
  }
  const type = effect.type ?? "weapon";
  // The weapon in hand decides a weapon hit's type; without gear, the best the class can wield.
  const options =
    type === "weapon" && actor.gear?.weaponType ? [actor.gear.weaponType] : marinaraDamageOptions(type, actor.classId);
  // Ammo Pouch: a Marksman loads whichever martial or elemental ammo hurts most.
  if ((type === "weapon" || type === "any-physical") && hooksOf(actor).ammo)
    return [...options, ...MARINARA_PHYSICAL_TYPES.filter((t) => !options.includes(t)), ...MARINARA_ELEMENTS];
  // Imbue Weapon: the weapon's damage becomes the user's pick of element.
  return type === "weapon" && modTotal(actor, "imbue") > 0 ? [...options, ...MARINARA_ELEMENTS] : options;
}

function modTotal(unit: MarinaraFighter, stat: string): number {
  return unit.mods.filter((mod) => mod.stat === stat).reduce((sum, mod) => sum + mod.pct, 0);
}

function addMod(unit: MarinaraFighter, stat: string, pct: number, turns: number, source: string) {
  if (pct < 0 && hooksOf(unit).debuffImmune) return;
  const existing = unit.mods.find((mod) => mod.source === source && mod.stat === stat);
  if (existing) existing.turns = Math.max(existing.turns, turns);
  else unit.mods.push({ stat, pct, turns, source });
}

/** The chance, in percent, that this fighter's Steal takes something from this foe. */
export function marinaraStealChance(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  all: readonly MarinaraFighter[],
): number {
  const speed = marinaraEffectiveStat(actor, "speed", all) - marinaraEffectiveStat(target, "speed", all);
  const chance =
    MARINARA_STEAL.base +
    speed * MARINARA_STEAL.perSpeed +
    MARINARA_STEAL.rank[target.tier ?? "standard"] +
    (actor.gear?.stealChance ?? 0);
  return Math.round(Math.min(0.95, Math.max(0.1, chance)) * 100);
}

/** A fighter's basic attack. */
export function marinaraBasicAttack(unit: MarinaraFighter): MarinaraEffect {
  return dmg(unit.magicBasic ? "magic" : "strength", MARINARA_TUNING.basicPower, {
    ranged: unit.rangedBasic || unit.magicBasic,
    basic: true,
    type: unit.archetype && unit.classId ? MARINARA_ARCHETYPE_ATTACKS[unit.archetype] : (unit.attackType ?? "weapon"),
  });
}

/** What a skill costs this fighter right now, and in which resource. */
export function marinaraSkillCost(
  unit: MarinaraFighter,
  skill: MarinaraSkillDef,
): { resource: "mp" | "stamina"; cost: number } {
  const hooks = hooksOf(unit);
  const resource = skill.resource ?? "mp";
  const free = resource === "mp" && hooks.firstSpellFree && !unit.firstSpellUsed;
  const cut = resource === "mp" ? (hooks.mpCostPct ?? 0) : 0;
  return { resource, cost: free ? 0 : Math.max(0, Math.round((skill.cost ?? 0) * (1 + cut))) };
}

/** The effect a class skill has for this fighter, or null when it has none in a fight. */
export function marinaraSkillEffect(unit: MarinaraFighter, skill: MarinaraSkillDef): MarinaraEffect | null {
  const base = MARINARA_SKILL_EFFECTS[skill.id];
  if (!base || base.kind === "none") return null;
  return {
    ...base,
    ...(skill.damage ? { type: skill.damage } : {}),
    ...(unit.carriedIds?.includes(skill.id) ? { carried: true } : {}),
  };
}

/** One thing a fighter can do now: a class skill, an enemy ability, or the basic attack (no id). */
export interface MarinaraOption {
  /** A class skill's id, `enemy:<id>` for a foe's ability, or null for the basic attack. */
  id: string | null;
  label: string;
  skill: MarinaraSkillDef | null;
  effect: MarinaraEffect;
  cost: number;
  resource?: "mp" | "stamina";
}

/** Everything the fighter can do this turn: paid for, off cooldown, not used up. */
export function marinaraUsable(unit: MarinaraFighter, all?: readonly MarinaraFighter[]): MarinaraOption[] {
  const front = marinaraStandsFront(unit, all);
  const out: MarinaraOption[] = [
    { id: null, label: "Attack", skill: null, effect: marinaraBasicAttack(unit), cost: 0 },
  ];
  for (const skill of unit.skills) {
    if (skill.kind !== "active") continue;
    const effect = marinaraSkillEffect(unit, skill);
    if (!effect) continue;
    const { resource, cost } = marinaraSkillCost(unit, skill);
    if (cost > (resource === "mp" ? unit.mp : unit.stamina)) continue;
    if ((unit.cooldowns[skill.id] ?? 0) > 0) continue;
    if (effect.oncePerFight && unit.used.includes(skill.id)) continue;
    if (effect.kind === "command" && unit.commanded) continue;
    if (effect.frontOnly && !front) continue;
    out.push({ id: skill.id, label: skill.label, skill, effect, cost, resource });
  }
  for (const id of unit.enemySkills ?? []) {
    const ability = MARINARA_ENEMY_SKILLS[id];
    if (!ability || (unit.cooldowns[`enemy:${id}`] ?? 0) > 0) continue;
    const { label, ...effect } = ability;
    out.push({ id: `enemy:${id}`, label: label ?? id, skill: null, effect, cost: 0 });
  }
  return out;
}

/** The option with this id, if the fighter can use it now. */
export function marinaraOption(
  unit: MarinaraFighter,
  id: string | null,
  all?: readonly MarinaraFighter[],
): MarinaraOption | undefined {
  return marinaraUsable(unit, all).find((option) => option.id === id);
}

/**
 * Who an effect can be aimed at. In Classic, a taunt or a provoker forces the pick; a vanished
 * unit can't be picked out while anyone else is there. Tactical leaves reach to the board.
 */
export function marinaraTargetsFor(
  actor: MarinaraFighter,
  effect: MarinaraEffect,
  all: readonly MarinaraFighter[],
): MarinaraFighter[] {
  const everyFoe = living(all.filter((unit) => unit.side !== actor.side));
  const seen = everyFoe.filter((unit) => !unit.hidden);
  const foes = effect.target === "enemy" && seen.length ? seen : everyFoe;
  const friends = living(all.filter((unit) => unit.side === actor.side));
  if (effect.target === "self") return [actor];
  if (effect.target === "party") return friends;
  // Guarding or watching over someone means someone else.
  if (effect.target === "ally")
    return effect.kind === "cover" || effect.kind === "ward" ? friends.filter((unit) => unit !== actor) : friends;
  if (effect.target === "downed-ally") return all.filter((unit) => unit.side === actor.side && unit.hp <= 0);
  const taunter = actor.tauntTurns > 0 ? foes.find((unit) => unit.id === actor.tauntedBy) : undefined;
  if (taunter && (effect.target === "enemy" || effect.target === "front-row")) return [taunter];
  const provokers = foes.filter((unit) => unit.provoking > 0);
  if (effect.target === "enemy" && provokers.length) return provokers;
  return foes;
}

/** Who a chosen target actually means: an area hits every foe (or every front-row foe), a party
 *  effect every friend, a self effect the user. */
export function marinaraStruck(
  actor: MarinaraFighter,
  effect: MarinaraEffect,
  picked: readonly MarinaraFighter[],
  all: readonly MarinaraFighter[],
): MarinaraFighter[] {
  const pool = marinaraTargetsFor(actor, effect, all);
  if (effect.target === "self") return [actor];
  if (effect.target === "party") return pool;
  if (effect.target === "all-enemies") return pool;
  if (effect.target === "front-row") {
    const front = pool.filter((unit) => unit.row === "front");
    return front.length ? front : pool;
  }
  return picked.filter((unit) => pool.includes(unit)).slice(0, 1);
}

export interface MarinaraHitNumbers {
  damage: number;
  hitChance: number;
  critChance: number;
  multiplier: number;
  type: MarinaraDamageType;
  rider: { type: MarinaraDamageType; multiplier: number; damage: number } | null;
}

/** The rider a weapon hit carries (a coating), if it lands. */
function riderFor(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  effect: MarinaraEffect,
  raw: number,
  weaponMultiplier: number,
) {
  if (effect.damage === "magic" || effect.kind !== "damage" || !actor.coating) return null;
  const type = actor.coating;
  if (!marinaraRiderLands(weaponMultiplier, type)) return null;
  const multiplier = marinaraAffinityMultiplier(target.affinities, type);
  const damage = type === "poison" ? 0 : raw * MARINARA_RIDER_DAMAGE_PCT.coating * multiplier;
  return multiplier !== 0 ? { type, multiplier, damage } : null;
}

/** Hit, crit and damage of one strike, before the roll. */
export function marinaraHitNumbers(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  effect: MarinaraEffect,
  all: readonly MarinaraFighter[],
  tactical = false,
): MarinaraHitNumbers {
  const hooks = hooksOf(actor);
  const magic = effect.damage === "magic";
  const attackStat = effect.from ?? effect.scales ?? (magic ? "magic" : "strength");
  const guard = marinaraEffectiveStat(target, magic ? "resistance" : "defense", all) * (1 - (effect.pierce ?? 0));
  let damage =
    powerStat(actor, attackStat, effect, all) +
    (effect.power ?? MARINARA_TUNING.basicPower) +
    (actor.gear ? (magic ? actor.gear.spellPower : actor.gear.power) : actor.level * MARINARA_TUNING.powerPerLevel) +
    (actor.gearPower ?? 0) -
    guard;
  let pct = modTotal(actor, "damage") + modTotal(target, "damage-taken");
  for (const ally of living(all.filter((unit) => unit.side === actor.side))) {
    const allyHooks = hooksOf(ally);
    pct += allyHooks.partyDamagePct ?? 0;
    if (allyHooks.partyDamageWhileWhole && all.filter((u) => u.side === actor.side).every((u) => u.hp > 0))
      pct += allyHooks.partyDamageWhileWhole;
    if (target.marked > 0) pct += allyHooks.partyBonusVsMarked ?? 0;
  }
  if (magic) pct += hooks.spellDamagePct ?? 0;
  pct += (hooks.damagePct ?? 0) + (actor.gear?.damagePct ?? 0);
  if (hooks.damageBelowHalfPct && actor.hp < actor.maxHp / 2) pct += hooks.damageBelowHalfPct;
  if (hooks.damagePerMissingPct) pct += hooks.damagePerMissingPct * Math.max(0, 1 - actor.hp / actor.maxHp);
  if (actor.enraged) pct += MARINARA_BOSS_RULES.enrageDamagePct;
  if (target.marked > 0 && hooks.bonusVsMarked) pct += hooks.bonusVsMarked;
  if (effect.finisher && target.hp < target.maxHp * effect.finisher.below) pct += effect.finisher.bonus;
  if (target.hp < target.maxHp / 2) pct += hooksOf(target).takenBelowHalfPct ?? 0;
  if (hooksOf(target).frontTakenPct && marinaraStandsFront(target, all)) pct += hooksOf(target).frontTakenPct!;
  if (magic) pct += hooksOf(target).magicTakenPct ?? 0;
  for (const ally of living(all.filter((unit) => unit.side === target.side))) {
    const allyHooks = hooksOf(ally);
    if (magic) pct += allyHooks.partyMagicTakenPct ?? 0;
    if (marinaraRowOf(target, all) === "back") pct += allyHooks.backRowTakenPct ?? 0;
  }
  if (hooks.heavyDraw && !magic) pct += 0.2;
  const best = marinaraBestDamageType(damageOptions(actor, effect), target.affinities);
  // A basic attack is never walled off: immune and absorb count as resist for it.
  let multiplier = effect.basic ? Math.max(best.multiplier, 0.5) : best.multiplier;
  if (multiplier > 1) multiplier += hooks.weakBonus ?? 0;
  // Warding Runes and Grand Inscription: the elements bite the warded party less.
  if (multiplier > 0 && (MARINARA_ELEMENTS as readonly string[]).includes(best.type)) {
    let cut = modTotal(target, "element-taken");
    for (const ally of living(all.filter((unit) => unit.side === target.side)))
      cut += hooksOf(ally).partyElementTakenPct ?? 0;
    multiplier *= Math.max(0.1, 1 + cut);
  }
  const melee = !effect.ranged && !magic && !(actor.rangedBasic && effect.basic);
  const rowFactor = !tactical && melee && marinaraRowOf(target, all) === "back" ? MARINARA_BACK_ROW_MELEE_PCT : 1;
  const floor = Math.max(
    MARINARA_TUNING.minDamage,
    (powerStat(actor, attackStat, effect, all) + (effect.power ?? MARINARA_TUNING.basicPower)) *
      MARINARA_TUNING.minDamagePct,
  );
  const raw = Math.max(floor, damage * (1 + pct)) * (effect.spread ?? 1) * rowFactor;
  // Absorbed damage comes out negative: it heals the target.
  damage = raw * multiplier;
  const rider = riderFor(actor, target, effect, raw, best.multiplier);
  const partyCrit = living(all.filter((unit) => unit.side === actor.side)).reduce(
    (sum, ally) => sum + (hooksOf(ally).partyCritBonus ?? 0),
    0,
  );
  const evade =
    marinaraEffectiveStat(target, "speed", all) * 2 +
    marinaraEffectiveStat(target, "luck", all) +
    Math.min(30, target.missesAgainst * (hooksOf(target).evasionStacking ?? 0));
  const hitChance = Math.max(
    MARINARA_MIN_HIT_CHANCE,
    Math.min(
      100,
      MARINARA_TUNING.hitBase +
        marinaraEffectiveStat(actor, "skill", all) * 2 +
        marinaraEffectiveStat(actor, "luck", all) / 2 +
        (effect.hitBonus ?? 0) +
        (hooks.hitBonus ?? 0) +
        (actor.gear?.hit ?? 0) -
        evade,
    ),
  );
  const critChance = Math.max(
    0,
    Math.min(
      100,
      marinaraEffectiveStat(actor, "skill", all) / 2 +
        (effect.critBonus ?? 0) +
        (hooks.critBonus ?? 0) +
        (actor.gear?.crit ?? 0) +
        partyCrit -
        marinaraEffectiveStat(target, "luck", all),
    ),
  );
  const asleep = target.statuses.some((s) => s.status === "sleep");
  return { damage, hitChance: asleep ? 100 : hitChance, critChance, multiplier, type: best.type, rider };
}

/** Expected damage of one use on one target, for choosing; the real roll happens when it is used. */
export function marinaraExpectedHit(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  effect: MarinaraEffect,
  all: readonly MarinaraFighter[],
  tactical = false,
): number {
  const { damage, hitChance, critChance, rider } = marinaraHitNumbers(actor, target, effect, all, tactical);
  const riderValue = !rider
    ? 0
    : rider.type === "poison"
      ? target.statuses.some((s) => s.status === "poison")
        ? 0
        : target.maxHp * MARINARA_POISON_RIDER.pctOfMaxHp * MARINARA_POISON_RIDER.turns * rider.multiplier * 0.5
      : rider.damage;
  return (
    (hitChance / 100) *
    (damage + riderValue) *
    (1 + (critChance / 100) * (MARINARA_TUNING.critMultiplier - 1)) *
    (effect.hits ?? 1)
  );
}

/** How much removing a fighter's debuffs is worth, in HP. */
export function marinaraDebuffBurden(unit: MarinaraFighter, all: readonly MarinaraFighter[]): number {
  let value = 0;
  for (const status of unit.statuses) {
    if (!HARMFUL.has(status.status)) continue;
    if (status.status === "poison" || status.status === "wither" || status.status === "bleed")
      value +=
        unit.maxHp *
        (status.power ?? 0.05) *
        status.turns *
        (status.status === "poison" ? marinaraAffinityMultiplier(unit.affinities, "poison") : 1);
    else if (status.status === "wound") value += (unit.maxHp - unit.hp) * 0.3 + unit.maxHp * 0.05;
    else if (status.status === "doom") value += Math.min(unit.hp, doomToll(unit));
    else value += marinaraEffectiveStat(unit, unit.magicBasic ? "magic" : "strength", all) * 1.5 * status.turns;
  }
  for (const mod of unit.mods) if (mod.pct < 0) value += Math.abs(mod.pct) * unit.maxHp * 0.15 * mod.turns;
  return value;
}

const doomToll = (unit: MarinaraFighter) =>
  Math.round(unit.maxHp * (unit.maxHp > 300 ? MARINARA_TUNING.doomBossPct : MARINARA_TUNING.doomPct));

function cleanse(unit: MarinaraFighter, how: "all" | "one", all: readonly MarinaraFighter[]) {
  if (how === "all") {
    unit.statuses = unit.statuses.filter((s) => !HARMFUL.has(s.status));
    unit.mods = unit.mods.filter((m) => m.pct >= 0);
    return;
  }
  let best: { kind: "status" | "mod"; index: number; value: number } | null = null;
  unit.statuses.forEach((status, index) => {
    if (!HARMFUL.has(status.status)) return;
    const solo = { ...unit, statuses: [status], mods: [] } as MarinaraFighter;
    const value = marinaraDebuffBurden(solo, all);
    if (!best || value > best.value) best = { kind: "status", index, value };
  });
  unit.mods.forEach((mod, index) => {
    if (mod.pct >= 0) return;
    const value = Math.abs(mod.pct) * unit.maxHp * 0.15 * mod.turns;
    if (!best || value > best.value) best = { kind: "mod", index, value };
  });
  const picked = best as { kind: "status" | "mod"; index: number } | null;
  if (!picked) return;
  if (picked.kind === "status") unit.statuses.splice(picked.index, 1);
  else unit.mods.splice(picked.index, 1);
}

/**
 * What only a boss has (Alyssa's strict rule: nothing legendary below a boss): it shrugs off the
 * statuses that would take whole turns from it, and once below half its HP it hits harder for the
 * rest of the fight.
 */
export const MARINARA_BOSS_RULES = {
  ignores: ["sleep", "stun", "confuse"] as readonly MarinaraStatusId[],
  enrageBelow: 0.5,
  enrageDamagePct: 0.2,
};

/** Whether a status can't take hold on this fighter. */
function shrugsOff(target: MarinaraFighter, status: string): boolean {
  return (
    !!hooksOf(target).debuffImmune ||
    !!target.gear?.immune?.includes(status) ||
    (target.tier === "boss" && (MARINARA_BOSS_RULES.ignores as readonly string[]).includes(status))
  );
}

function addStatus(target: MarinaraFighter, applies: NonNullable<MarinaraEffect["applies"]>, bonus: number) {
  if (applies.status === "poison" && marinaraAffinityMultiplier(target.affinities, "poison") <= 0) return false;
  if (shrugsOff(target, applies.status)) return false;
  target.statuses = target.statuses.filter((s) => s.status !== applies.status);
  target.statuses.push({ status: applies.status, turns: applies.duration + bonus, power: applies.power });
  return true;
}

// ── The clock ──

/** Sets everyone's first turn on the timeline: faster fighters sooner, Vanguard (a Guard) first. */
export function startMarinaraClock(all: MarinaraFighter[], random: () => number): void {
  for (const unit of all) unit.next = turnLength(unit, all) * random() * (hooksOf(unit).vanguard ? 0.2 : 1);
}

/** Who acts next: the living fighter soonest on the timeline. */
export function nextMarinaraActor(all: readonly MarinaraFighter[]): MarinaraFighter | undefined {
  const commanded = living(all).find((unit) => (unit.bonusTurns ?? 0) > 0);
  if (commanded) return commanded;
  return living(all)
    .filter((unit) => !unit.dummy)
    .sort((a, b) => a.next - b.next || a.id.localeCompare(b.id))[0];
}

/** The round a point on the timeline falls in, counted from 1. */
export function marinaraRoundAt(clock: number): number {
  return Math.floor(Math.max(0, clock) / MARINARA_ROUND_TIME) + 1;
}

/**
 * The start of a fighter's turn: its damage over time ticks, MP and stamina come back, its effects
 * count down and its next turn is set. Returns whether it may act now (not asleep, stunned, down
 * or charging), and the charged skill to release when it was charging one.
 */
export function beginMarinaraTurn(
  actor: MarinaraFighter,
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
): { acts: boolean; release?: { skillId: string; targetId: string } } {
  delete actor.commanded;
  // A commanded turn is an extra action: nothing ticks and the timeline stays where it was.
  if ((actor.bonusTurns ?? 0) > 0) {
    actor.bonusTurns! -= 1;
    if (!actor.bonusTurns) delete actor.bonusTurns;
    actor.commanded = true;
    const asleep = actor.statuses.some((s) => s.status === "sleep" || s.status === "stun");
    return { acts: !asleep && !actor.charging && !actor.dummy };
  }
  actor.defending = false;
  actor.hidden = false;
  actor.secondWindUsed = false;
  actor.evadedThisRound = false;
  for (const status of actor.statuses) {
    if (status.status === "poison" || status.status === "wither" || status.status === "bleed") {
      // Poison is a damage type foes can resist; Wither and Bleed are pure and nothing stops them.
      const multiplier = status.status === "poison" ? marinaraAffinityMultiplier(actor.affinities, "poison") : 1;
      const amount = Math.round(actor.maxHp * (status.power ?? 0.08) * multiplier);
      const before = actor.hp;
      actor.hp = Math.min(actor.maxHp, actor.hp - amount);
      if (amount !== 0) ctx.events.push({ kind: "tick", actorId: actor.id, status: status.status, amount });
      // Siphoning Rot: the curse's caster drinks a share of what it takes.
      const caster = status.by ? all.find((u) => u.id === status.by && u.hp > 0) : undefined;
      const feeds = caster ? (hooksOf(caster).curseFeedPct ?? 0) : 0;
      if (caster && feeds > 0 && before > actor.hp) {
        const healed = Math.min(
          caster.maxHp - caster.hp,
          Math.round((before - Math.max(0, actor.hp)) * feeds * healFactor(caster)),
        );
        if (healed > 0) {
          caster.hp += healed;
          ctx.events.push({ kind: "heal", actorId: caster.id, targetId: caster.id, amount: healed });
        }
      }
    }
    if (status.status === "regen") {
      const amount = Math.round(actor.maxHp * (status.power ?? 0.1) * healFactor(actor));
      const before = actor.hp;
      actor.hp = Math.min(actor.maxHp, actor.hp + amount);
      if (actor.hp > before)
        ctx.events.push({
          kind: "heal",
          actorId: actor.id,
          targetId: actor.id,
          status: "regen",
          amount: actor.hp - before,
        });
    }
    if (status.status === "doom" && status.turns === 1 && actor.hp > 0) {
      const toll = Math.min(actor.hp, doomToll(actor));
      actor.hp -= toll;
      ctx.events.push({ kind: "tick", actorId: actor.id, status: "doom", amount: toll });
    }
    if (status.status === "sleep") {
      const tormentors = all.filter((u) => u.side !== actor.side && u.hp > 0 && hooksOf(u).nightmare);
      if (tormentors.length) {
        const amount = Math.round(actor.maxHp * 0.1);
        actor.hp -= amount;
        ctx.events.push({ kind: "tick", actorId: actor.id, status: "nightmare", amount });
      }
    }
  }
  const hooks = hooksOf(actor);
  if (hooks.mpRegenPct) actor.mp = Math.min(actor.maxMp, actor.mp + Math.round(actor.maxMp * hooks.mpRegenPct));
  actor.stamina = Math.min(
    actor.maxStamina,
    actor.stamina + Math.max(1, Math.round(actor.maxStamina * MARINARA_STAMINA.regenPct)),
  );
  const skips = actor.statuses.find((s) => s.status === "sleep" || s.status === "stun");
  tickMods(actor, all);
  if (actor.coatingTurns !== undefined) {
    actor.coatingTurns--;
    if (actor.coatingTurns <= 0) {
      delete actor.coating;
      delete actor.coatingTurns;
    }
  }
  if (actor.hp <= 0) {
    actor.hp = 0;
    ctx.events.push({ kind: "down", actorId: actor.id, targetId: actor.id });
    return { acts: false };
  }
  actor.next += turnLength(actor, all);
  if (actor.provoking > 0) actor.provoking--;
  if (actor.tauntTurns > 0) actor.tauntTurns--;
  actor.covering = undefined; // Cover lasts until the coverer's next turn.
  if (actor.wardTurns > 0) actor.wardTurns--;
  for (const id of Object.keys(actor.cooldowns)) actor.cooldowns[id] = Math.max(0, actor.cooldowns[id]! - 1);
  if (skips) {
    ctx.events.push({ kind: "skip", actorId: actor.id, status: skips.status });
    return { acts: false };
  }
  if (actor.dummy) return { acts: false };
  actor.actions++;
  if (actor.charging) {
    const release = actor.charging;
    actor.charging = undefined;
    return { acts: false, release };
  }
  return { acts: true };
}

/** Releases a charged skill (Headshot, Convergence) on its target, or the nearest foe in reach. */
export function releaseMarinaraCharge(
  actor: MarinaraFighter,
  release: { skillId: string; targetId: string },
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
): void {
  const ability = release.skillId.startsWith("enemy:")
    ? MARINARA_ENEMY_SKILLS[release.skillId.slice("enemy:".length)]
    : undefined;
  const skill = ability ? null : (actor.skills.find((s) => s.id === release.skillId) ?? null);
  let base: MarinaraEffect | null = skill ? marinaraSkillEffect(actor, skill) : null;
  if (ability) {
    const { label: _label, ...effect } = ability;
    base = effect;
  }
  if (!base) return;
  const effect = { ...base, charge: false };
  const target = all.find((u) => u.id === release.targetId && u.hp > 0) ?? marinaraTargetsFor(actor, effect, all)[0];
  if (!target) return;
  // An area lands on everyone in it when it goes off, not only on the one it was aimed at.
  const struck = ctx.grouped === false ? [target] : marinaraStruck(actor, effect, [target], all);
  act(actor, skill, effect, struck, all, ctx, ability ? release.skillId : undefined);
}

/** Defending: Defense up until the fighter's next turn, a quarter of its stamina back. */
export function marinaraDefend(actor: MarinaraFighter, ctx: MarinaraFightContext): void {
  actor.defending = true;
  if (hooksOf(actor).entrench) entrench(actor);
  actor.stamina = Math.min(
    actor.maxStamina,
    actor.stamina + Math.round(actor.maxStamina * MARINARA_STAMINA.defendRegenPct),
  );
  ctx.events.push({ kind: "defend", actorId: actor.id });
}

/** A coating dipped on the weapon (an item action): its rider rides weapon hits for a few turns. */
export function marinaraCoat(actor: MarinaraFighter, rider: MarinaraDamageType, turns: number): void {
  actor.coating = rider;
  actor.coatingTurns = turns;
}

/**
 * Uses an option on the chosen targets: pays for it, starts its cooldown, pushes the user's next
 * turn back by its weight, then resolves it (or starts charging it). `targets` are the picked
 * fighters; an area or party effect finds the rest itself.
 */
export function performMarinaraOption(
  actor: MarinaraFighter,
  option: MarinaraOption,
  targets: readonly MarinaraFighter[],
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
): void {
  const hooks = hooksOf(actor);
  const extraWeight = (option.effect.weight ?? 1) - 1;
  actor.next += turnLength(actor, all) * extraWeight;
  if (option.skill) {
    const { resource, cost } = marinaraSkillCost(actor, option.skill);
    if (resource === "mp") {
      actor.firstSpellUsed = true;
      actor.mp -= cost;
    } else actor.stamina -= cost;
    if (option.effect.cooldown) actor.cooldowns[option.skill.id] = option.effect.cooldown;
    if (option.effect.oncePerFight) actor.used.push(option.skill.id);
  } else if (option.id?.startsWith("enemy:")) {
    actor.cooldowns[option.id] = option.effect.cooldown ?? 3;
  }
  // Confused: a single-target attack goes at one of the user's own side half the time.
  const confused = actor.statuses.some((s) => s.status === "confuse");
  if (confused && option.effect.kind === "damage" && option.effect.target === "enemy" && ctx.random() < 0.5) {
    const friends = living(all.filter((u) => u.side === actor.side && u.id !== actor.id));
    if (friends.length) {
      const victim = friends[Math.floor(ctx.random() * friends.length)]!;
      ctx.events.push({ kind: "status", actorId: actor.id, targetId: victim.id, status: "confuse" });
      act(actor, option.skill, option.effect, [victim], all, ctx, option.id ?? undefined);
      return;
    }
  }
  const struck = ctx.grouped === false ? [...targets] : marinaraStruck(actor, option.effect, targets, all);
  if (option.effect.charge) {
    const target = struck[0];
    const chargedId = option.skill?.id ?? option.id;
    if (!target || !chargedId) return;
    actor.charging = { skillId: chargedId, targetId: target.id };
    if (hooks.entrench) entrench(actor);
    ctx.events.push({ kind: "charge", actorId: actor.id, targetId: target.id, skillId: chargedId });
    return;
  }
  act(actor, option.skill, option.effect, struck, all, ctx, option.id ?? undefined);
  if (hooks.extraActionEvery && actor.actions % hooks.extraActionEvery === 0) {
    // Peerless: every third action, another basic attack on the same foe.
    const foe = struck.find((unit) => unit.hp > 0 && unit.side !== actor.side);
    if (foe) act(actor, null, marinaraBasicAttack(actor), [foe], all, ctx);
  }
}

function entrench(unit: MarinaraFighter) {
  addMod(unit, "defense", 0.3, 1, "entrench");
  addMod(unit, "resistance", 0.3, 1, "entrench");
}

function tickMods(unit: MarinaraFighter, all: readonly MarinaraFighter[]) {
  for (const mod of unit.mods) mod.turns--;
  unit.mods = unit.mods.filter((mod) => mod.turns > 0);
  for (const status of unit.statuses) status.turns--;
  const expired = unit.statuses.filter((s) => s.turns <= 0);
  unit.statuses = unit.statuses.filter((s) => s.turns > 0);
  if (expired.length) {
    for (const foe of all.filter((u) => u.side !== unit.side && u.hp > 0)) {
      if (hooksOf(foe).devour) foe.hp = Math.min(foe.maxHp, foe.hp + Math.round(foe.maxHp * 0.05));
    }
  }
  if (unit.marked > 0) unit.marked--;
}

function act(
  actor: MarinaraFighter,
  skill: MarinaraSkillDef | null,
  effect: MarinaraEffect,
  targets: readonly MarinaraFighter[],
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
  optionId?: string,
) {
  const { random } = ctx;
  const skillId = skill?.id ?? optionId;
  const hooks = hooksOf(actor);
  const durationBonus =
    effect.kind === "debuff" || effect.kind === "status"
      ? (hooks.debuffDurationBonus ?? 0)
      : effect.kind === "buff"
        ? (hooks.buffDurationBonus ?? 0)
        : 0;
  switch (effect.kind) {
    case "damage": {
      if ((effect.target === "all-enemies" || effect.target === "front-row") && targets.length > 1)
        effect = { ...effect, spread: MARINARA_TUNING.areaSpreadPct };
      for (const target of targets) {
        // Sworn Ward: whoever watches over this target strikes the attacker first, hit or miss.
        for (const warder of living(
          all.filter((u) => u.side === target.side && u.wardTurns > 0 && u.wardOn === target.id),
        ).filter((warder) => marinaraWarderReaches(warder, actor, all))) {
          if (actor.hp <= 0) break;
          ctx.events.push({ kind: "ward", actorId: warder.id, targetId: actor.id });
          strike(warder, actor, marinaraBasicAttack(warder), all, ctx, false);
        }
        if (actor.hp <= 0) break;
        for (let i = 0; i < (effect.hits ?? 1); i++) {
          if (target.hp <= 0) break;
          strike(actor, target, effect, all, ctx, true, skillId);
        }
      }
      if (effect.selfDebuff)
        addMod(actor, effect.selfDebuff.stat, effect.selfDebuff.pct, effect.selfDebuff.duration, `${skill?.id}:self`);
      break;
    }
    case "heal": {
      for (const target of targets) {
        let amount = effect.pctOfMax
          ? target.maxHp * effect.pctOfMax
          : powerStat(actor, "magic", effect, all) * MARINARA_TUNING.healMagicPct + (effect.power ?? 0);
        const crit = !!hooks.healCrit && random() < 0.15;
        if (crit) amount *= 1.5;
        amount *= healFactor(target);
        if (effect.cleanse) cleanse(target, effect.cleanse, all);
        const before = target.hp;
        target.hp = Math.round(Math.min(target.maxHp, target.hp + amount));
        if (hooks.overheal) target.shield += Math.max(0, before + amount - target.maxHp) * 0.5;
        ctx.events.push({
          kind: "heal",
          actorId: actor.id,
          targetId: target.id,
          skillId,
          amount: target.hp - before,
          crit,
        });
      }
      break;
    }
    case "cleanse":
      for (const target of targets) {
        cleanse(target, effect.cleanse ?? "all", all);
        ctx.events.push({ kind: "cleanse", actorId: actor.id, targetId: target.id, skillId });
      }
      break;
    case "revive": {
      const target = targets[0];
      if (target && target.hp <= 0) {
        target.hp = Math.max(1, Math.round(target.maxHp * (effect.power ?? 0.25)));
        target.statuses = [];
        ctx.events.push({ kind: "revive", actorId: actor.id, targetId: target.id, skillId, amount: target.hp });
      }
      break;
    }
    case "shield": {
      for (const target of targets) {
        const amount = Math.round(powerStat(actor, "magic", effect, all) + (effect.power ?? 0));
        target.shield += amount;
        ctx.events.push({ kind: "shield", actorId: actor.id, targetId: target.id, skillId, amount });
      }
      break;
    }
    case "buff":
      for (const target of targets) {
        addMod(target, effect.stat!, effect.pct ?? 0, (effect.duration ?? 1) + durationBonus, skill?.id ?? "buff");
        for (const also of effect.alsoMods ?? [])
          addMod(target, also.stat, also.pct, (effect.duration ?? 1) + durationBonus, skill?.id ?? "buff");
        ctx.events.push({ kind: "buff", actorId: actor.id, targetId: target.id, skillId, status: effect.stat });
      }
      if (effect.hide) actor.hidden = true;
      if (effect.bonusAction && !actor.commanded) {
        actor.bonusTurns = (actor.bonusTurns ?? 0) + 1;
        ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId });
      }
      if (effect.exposeNext) actor.exposeNext = effect.exposeNext;
      break;
    case "debuff":
      for (const target of targets) {
        if (hooksOf(target).debuffImmune) {
          ctx.events.push({ kind: "resist", actorId: actor.id, targetId: target.id, skillId });
          continue;
        }
        addMod(target, effect.stat!, effect.pct ?? 0, (effect.duration ?? 1) + durationBonus, skillId ?? "debuff");
        if (skill?.id === "mark-prey") target.marked = (effect.duration ?? 3) + durationBonus;
        ctx.events.push({ kind: "debuff", actorId: actor.id, targetId: target.id, skillId, status: effect.stat });
        if (
          effect.applies &&
          random() < (effect.applies.chance ?? 1) &&
          addStatus(target, effect.applies, durationBonus)
        )
          ctx.events.push({
            kind: "status",
            actorId: actor.id,
            targetId: target.id,
            skillId,
            status: effect.applies.status,
          });
      }
      break;
    case "status":
      for (const target of targets) {
        const roll = random();
        if (effect.status !== "regen" && (roll > (effect.chance ?? 1) || shrugsOff(target, effect.status!))) {
          ctx.events.push({ kind: "resist", actorId: actor.id, targetId: target.id, skillId, status: effect.status });
          continue;
        }
        if (effect.status === "poison" && marinaraAffinityMultiplier(target.affinities, "poison") <= 0) {
          ctx.events.push({ kind: "resist", actorId: actor.id, targetId: target.id, skillId, status: "poison" });
          continue;
        }
        target.statuses = target.statuses.filter((s) => s.status !== effect.status);
        target.statuses.push({
          status: effect.status!,
          turns: (effect.duration ?? 2) + durationBonus,
          power: effect.power,
          by: actor.id,
        });
        if (effect.exposes)
          addMod(target, "damage-taken", effect.exposes.pct, effect.exposes.duration + durationBonus, "exposed");
        ctx.events.push({ kind: "status", actorId: actor.id, targetId: target.id, skillId, status: effect.status });
      }
      break;
    case "cover":
      actor.covering = targets[0]?.id;
      ctx.events.push({ kind: "cover", actorId: actor.id, targetId: targets[0]?.id, skillId });
      break;
    case "provoke":
      actor.provoking = effect.duration ?? 2;
      ctx.events.push({ kind: "provoke", actorId: actor.id, skillId });
      break;
    case "ward":
      actor.wardOn = targets[0]?.id;
      actor.wardTurns = effect.duration ?? 3;
      ctx.events.push({ kind: "ward", actorId: actor.id, targetId: targets[0]?.id, skillId });
      break;
    case "taunt":
      for (const target of targets) {
        target.tauntedBy = actor.id;
        target.tauntTurns = effect.duration ?? 2;
        ctx.events.push({ kind: "taunt", actorId: actor.id, targetId: target.id, skillId });
      }
      break;
    case "extra-turn":
      actor.next -= turnLength(actor, all);
      ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId });
      break;
    case "steal":
      for (const target of targets) {
        if (target.side === actor.side || target.hp <= 0) continue;
        if (target.stolenBy) {
          ctx.events.push({ kind: "steal", actorId: actor.id, targetId: target.id, skillId, status: "empty" });
          continue;
        }
        const chance = marinaraStealChance(actor, target, all);
        const roll = random() * 100;
        const event = { actorId: actor.id, targetId: target.id, skillId, chance, roll: Math.floor(roll) };
        if (roll < chance) {
          target.stolenBy = actor.id;
          ctx.events.push({ kind: "steal", ...event });
        } else ctx.events.push({ kind: "miss", ...event });
      }
      break;
    case "command":
      // Commanded allies act at once, an action on top of their own turns.
      for (const target of targets) {
        if (target.id === actor.id || target.hp <= 0) continue;
        target.bonusTurns = (target.bonusTurns ?? 0) + 1;
        ctx.events.push({ kind: "command", actorId: actor.id, targetId: target.id, skillId });
      }
      break;
  }
}

function applyRider(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  rider: { type: MarinaraDamageType; multiplier: number; damage: number },
  crit: boolean,
  ctx: MarinaraFightContext,
) {
  if (rider.type === "poison") {
    if (rider.multiplier <= 0) return;
    target.statuses = target.statuses.filter((s) => s.status !== "poison");
    target.statuses.push({
      status: "poison",
      turns: MARINARA_POISON_RIDER.turns,
      power: MARINARA_POISON_RIDER.pctOfMaxHp,
    });
    ctx.events.push({ kind: "status", actorId: actor.id, targetId: target.id, status: "poison" });
    return;
  }
  const amount = Math.round(rider.damage * (crit ? MARINARA_TUNING.critMultiplier : 1));
  const before = target.hp;
  target.hp = Math.min(target.maxHp, target.hp - amount);
  ctx.events.push({
    kind: "rider",
    actorId: actor.id,
    targetId: target.id,
    type: rider.type,
    amount: before - target.hp,
  });
}

function strike(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  effect: MarinaraEffect,
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
  canBeCountered: boolean,
  skillId?: string,
) {
  const { random } = ctx;
  // Cover: a guard steps in front of the ally it covers.
  const coverer = living(all.filter((u) => u.side === target.side && u.covering === target.id))[0];
  if (coverer && effect.target === "enemy") {
    ctx.events.push({ kind: "cover", actorId: coverer.id, targetId: target.id });
    target = coverer;
  }
  const targetHooks = hooksOf(target);
  if (targetHooks.evadeFirstHitEachRound && !target.evadedThisRound) {
    target.evadedThisRound = true;
    if (random() < 0.5) {
      ctx.events.push({ kind: "evade", actorId: actor.id, targetId: target.id, skillId });
      return;
    }
  }
  const { damage, hitChance, critChance, multiplier, rider, type } = marinaraHitNumbers(
    actor,
    target,
    effect,
    all,
    ctx.tactical,
  );
  const hooks = hooksOf(actor);
  const affinity =
    multiplier < 0
      ? "absorb"
      : multiplier === 0
        ? "immune"
        : multiplier > 1
          ? "weak"
          : multiplier < 1
            ? "resist"
            : undefined;
  if (multiplier < 0) {
    const before = target.hp;
    target.hp = Math.round(Math.min(target.maxHp, target.hp - damage));
    ctx.events.push({
      kind: "absorb",
      actorId: actor.id,
      targetId: target.id,
      skillId,
      amount: target.hp - before,
      type,
      affinity,
    });
    if (rider && random() * 100 < hitChance) applyRider(actor, target, rider, false, ctx);
    return;
  }
  const roll = random() * 100;
  if (roll >= hitChance) {
    target.missesAgainst++;
    ctx.events.push({
      kind: "miss",
      actorId: actor.id,
      targetId: target.id,
      skillId,
      chance: Math.round(hitChance),
      roll: Math.floor(roll),
    });
    if (canBeCountered && !effect.ranged && targetHooks.counter && target.hp > 0) {
      ctx.events.push({ kind: "counter", actorId: target.id, targetId: actor.id });
      strike(target, actor, marinaraBasicAttack(target), all, ctx, false);
    }
    return;
  }
  let crit = random() * 100 < critChance;
  if (crit) {
    const omen = living(all.filter((u) => u.side === target.side)).some((u) => hooksOf(u).enemyCritToMissChance);
    if (omen && random() < 0.5) crit = false;
  }
  let amount = Math.round(damage * (crit ? MARINARA_TUNING.critMultiplier : 1));
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, amount);
    target.shield -= absorbed;
    amount -= absorbed;
  }
  if (hooks.assassinate && crit && target.hp - amount < target.maxHp * 0.15 && target.maxHp <= 300) amount = target.hp;
  const before = target.hp;
  target.hp -= amount;
  if (target.tier === "boss" && target.hp > 0 && target.hp < target.maxHp * MARINARA_BOSS_RULES.enrageBelow)
    target.enraged = true;
  if (target.hp <= 0 && targetHooks.lastStand && !target.lastStandUsed) {
    target.lastStandUsed = true;
    target.hp = 1;
    ctx.events.push({ kind: "last-stand", actorId: target.id });
  }
  const dealt = before - Math.max(0, target.hp);
  ctx.events.push({
    kind: "hit",
    actorId: actor.id,
    targetId: target.id,
    skillId,
    amount: dealt,
    crit,
    type,
    ...(affinity ? { affinity } : {}),
    chance: Math.round(hitChance),
    roll: Math.floor(roll),
  });
  if (rider) applyRider(actor, target, rider, crit, ctx);
  const lifesteal = (hooks.lifestealPct ?? 0) + (actor.gear?.lifestealPct ?? 0) + (effect.drain ?? 0);
  if (lifesteal) actor.hp = Math.round(Math.min(actor.maxHp, actor.hp + dealt * lifesteal * healFactor(actor)));
  if (effect.onHit) addMod(target, effect.onHit.stat, effect.onHit.pct, effect.onHit.duration, `onhit:${actor.id}`);
  if (actor.exposeNext) {
    addMod(target, "damage-taken", actor.exposeNext, 2, "exposed");
    actor.exposeNext = undefined;
  }
  if (effect.applies && amount > 0 && random() < (effect.applies.chance ?? 1) && addStatus(target, effect.applies, 0))
    ctx.events.push({ kind: "status", actorId: actor.id, targetId: target.id, skillId, status: effect.applies.status });
  if (hooks.hitsLowerDefense) addMod(target, "defense", -hooks.hitsLowerDefense, 2, `sunder:${actor.id}`);
  if (target.statuses.some((s) => s.status === "sleep"))
    target.statuses = target.statuses.filter((s) => s.status !== "sleep");
  if (target.hp <= 0) {
    target.hp = 0;
    ctx.events.push({ kind: "down", actorId: actor.id, targetId: target.id });
    if (hooks.healOnKillPct)
      actor.hp = Math.min(actor.maxHp, actor.hp + Math.round(actor.maxHp * hooks.healOnKillPct * healFactor(actor)));
    // Second Wind: a kill gives a whole new action, once per turn.
    if (hooks.actOnKill && !actor.secondWindUsed) {
      actor.secondWindUsed = true;
      actor.next -= turnLength(actor, all);
      ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId: "second-wind" });
    }
    const savior = living(all.filter((u) => u.side === target.side)).find((u) => hooksOf(u).miracle && !u.miracleUsed);
    if (savior && target.side === "party") {
      savior.miracleUsed = true;
      target.hp = Math.round(target.maxHp * 0.3);
      ctx.events.push({ kind: "miracle", actorId: savior.id, targetId: target.id, amount: target.hp });
    }
    return;
  }
  // Retaliate answers any hit it can reach back: a ranged user counters ranged attackers too.
  const reachesBack = !effect.ranged || target.rangedBasic || Boolean(target.magicBasic);
  if (canBeCountered && reachesBack && targetHooks.counter === "always" && target.hp > 0) {
    ctx.events.push({ kind: "counter", actorId: target.id, targetId: actor.id });
    strike(target, actor, marinaraBasicAttack(target), all, ctx, false);
  }
}

/** Hold the Line (Tactical): a melee foe moving next to a Guard-tree fighter is stopped there and
 *  struck once. Returns whether the mover still stands. */
export function marinaraHoldTheLine(
  guard: MarinaraFighter,
  mover: MarinaraFighter,
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
): boolean {
  if (!hooksOf(guard).holdTheLine || guard.hp <= 0 || mover.hp <= 0) return mover.hp > 0;
  ctx.events.push({ kind: "hold-the-line", actorId: guard.id, targetId: mover.id });
  strike(guard, mover, marinaraBasicAttack(guard), all, ctx, false);
  return mover.hp > 0;
}

export function marinaraHasHoldTheLine(unit: MarinaraFighter): boolean {
  return !!hooksOf(unit).holdTheLine;
}

// ── XP ──

/** XP a foe is worth to a party member who helped beat it, before scaling by level. */
export function marinaraFoeXp(foe: Pick<MarinaraFighter, "tier">): number {
  return Math.round(30 * MARINARA_ENEMY_TIERS[foe.tier ?? "standard"].xp);
}

/** An archetype's base stats, for a monster with no class (the bestiary's). */
export function marinaraArchetypeStart(archetype: MarinaraArchetype): MarinaraStats {
  return { ...MARINARA_ARCHETYPE_BASES[archetype].start };
}

// ── What a screen shows ──

/** A Classic Marinara fighter as a fight screen shows it. */
export interface MarinaraCombatantView {
  classId?: string;
  classLabel?: string;
  archetype?: MarinaraArchetype;
  level: number;
  tier?: MarinaraEnemyTier;
  row: MarinaraFighter["row"];
  stamina: number;
  maxStamina: number;
  stats: MarinaraStats;
  shield: number;
  statuses: Array<{ status: MarinaraStatusId; turns: number }>;
  /** Buffs and debuffs on it: the stat and the share, summed by stat. */
  mods: Array<{ stat: string; pct: number }>;
  charging?: string;
  covering?: string;
  defending?: boolean;
  hidden?: boolean;
  /** A boss below half its HP, hitting harder. */
  enraged?: boolean;
  coating?: MarinaraDamageType;
  /** Damage types it is known to be weak to, resist, be immune to or absorb. */
  affinities?: MarinaraAffinities;
  /** Where it stands on the timeline: lower acts sooner. */
  next: number;
}

/** What the fight screen shows of a fighter; with `all`, the row it fights in now (see marinaraRowOf). */
export function marinaraCombatantView(unit: MarinaraFighter, all?: readonly MarinaraFighter[]): MarinaraCombatantView {
  const def = unit.classId ? marinaraClass(unit.classId) : undefined;
  const mods = new Map<string, number>();
  for (const mod of unit.mods) if (mod.source !== "probe") mods.set(mod.stat, (mods.get(mod.stat) ?? 0) + mod.pct);
  return {
    ...(def ? { classId: def.id, classLabel: def.label } : {}),
    ...(unit.archetype ? { archetype: unit.archetype } : {}),
    level: unit.level,
    ...(unit.tier ? { tier: unit.tier } : {}),
    row: all ? marinaraRowOf(unit, all) : unit.row,
    stamina: unit.stamina,
    maxStamina: unit.maxStamina,
    stats: { ...unit.stats },
    shield: Math.round(unit.shield),
    statuses: unit.statuses.map(({ status, turns }) => ({ status, turns })),
    mods: [...mods.entries()].map(([stat, pct]) => ({ stat, pct: Math.round(pct * 100) / 100 })),
    ...(unit.charging ? { charging: unit.charging.skillId } : {}),
    ...(unit.covering ? { covering: unit.covering } : {}),
    ...(unit.defending ? { defending: true } : {}),
    ...(unit.hidden ? { hidden: true } : {}),
    ...(unit.enraged ? { enraged: true } : {}),
    ...(unit.coating ? { coating: unit.coating } : {}),
    ...(unit.affinities ? { affinities: { ...unit.affinities } } : {}),
    next: Math.round(unit.next),
  };
}

/** What a fight did for one party member: XP, level-ups with their stat gains, and class levels. */
export interface MarinaraFightGrowth {
  name: string;
  xp: number;
  level: number;
  classId: string;
  classLevel: number;
  levelUps: Array<{ level: number; gains: Partial<MarinaraStats> }>;
  /** Class levels reached that open a promotion. */
  promotionReady?: boolean;
  /** Fell under permadeath: gone for good. */
  fallen?: boolean;
}
