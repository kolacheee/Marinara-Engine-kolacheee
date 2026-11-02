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
  MARINARA_CHANNEL_CHOICES,
  MARINARA_GREATER_CHANNEL_CHOICES,
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
  | "sleep"
  | "stun"
  | "poison"
  | "wither"
  | "bleed"
  | "burn"
  | "freeze"
  | "shock"
  | "entangle"
  | "crumble"
  | "soak"
  | "rend"
  | "windswept"
  | "sear"
  | "wound"
  | "confuse"
  | "doom"
  | "slow"
  | "regen";

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
    | "tame"
    | "none";
  target: MarinaraEffectTarget;
  power?: number;
  scales?: MarinaraStat;
  damage?: "physical" | "magic";
  /** The skill's own kind of damage before the weapon's Strength-or-Magic rule switched it: a weapon skill
   *  struck with Magic still carries coatings, a spell struck with Strength still doesn't. */
  /** Weaken: the user gains the stat the debuff takes from the foe (Strength or Magic), by the same share. */
  sapsToUser?: boolean;
  nature?: "physical" | "magic";
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
  /** deathless: Oath of Iron; shadows: Thousand Shadows' marker (the decoys last until used); best-attack: Weaken; crescendo: Crescendo's marker. */
  stat?:
    | MarinaraStat
    | "damage"
    | "damage-taken"
    | "imbue"
    | "element-taken"
    | "deathless"
    | "shadows"
    | "evasion"
    | "best-attack"
    | "crescendo";
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
  /** This area attack's own share per foe, in place of MARINARA_TUNING.areaSpreadPct (Tempest). */
  areaPct?: number;
  /** Never misses (Convergence's charged blow). */
  sureHit?: boolean;
  /** Tempest: an area attack that deals full damage when only one foe is left. */
  loneFull?: boolean;
  /** Vanish: +40 evasion until the user's next turn. They can still be targeted, so Provoke and
   *  Challenge still pull foes onto them (evasion tanking). */
  hide?: boolean;
  /** A song: re-cast while it lasts, it adds a verse (this much more, up to `most` verses) to every
   *  stat it changes, and starts its turns again (Cantor). */
  verses?: { pct: number; most: number };
  /** Costs no turn: the user acts again at once (not from an action that was itself a bonus). */
  bonusAction?: boolean;
  /** Sic: the user's tamed companion strikes, from the user's stat the companion is strongest in. */
  companion?: boolean;
  /** Draws every foe's single-target attacks to the user for this many of its turns (Warding Stance). */
  provokes?: number;
  /** The user's next landed hit exposes its target: everyone deals this much more to it for 2 turns. */
  exposeNext?: number;
  /** Vanish: the user's next hit that lands is a critical hit. */
  critNext?: boolean;
  /** A landed status also exposes the target (Seal). */
  exposes?: { pct: number; duration: number };
  /** Heals that cleanse: every debuff, or the worst one on each target. */
  cleanse?: "all" | "one";
  /** Heals the user for this share of the damage it deals (Grave Tithe). */
  drain?: number;
  /** Timeline weight of the action: 1 normal, more for heavy actions. */
  weight?: number;
  /** The user's Speed changes by this share until its next turn (Alyssa 2026-11-02: heavy skills
   *  say "Reduces the user's Speed by 25% until its next turn", not "delays its next turn"). */
  speedUntilNext?: number;
  /** Takes a turn of charging before it lands. */
  charge?: boolean;
  cooldown?: number;
  /** Its cooldown falls on every fighter of the user's side who has it (Fortress). */
  sideCooldown?: boolean;
  oncePerFight?: boolean;
  /** Usable this many times a fight (Thousand Shadows: twice). */
  usesPerFight?: number;
  /** A revive that raises every downed ally, not one (Undying Light). */
  allDowned?: boolean;
  /** Decoys that take the next hits on the user's party (Thousand Shadows). */
  decoys?: number;
  /** Every buff on the target doubles for the buff's duration (Crescendo). */
  doubles?: boolean;
  /** The targets can't be confused while it lasts, and are freed of it (Raise the Banner). */
  steadies?: boolean;
  /** More damage by this share to a target an ally struck since its own last turn (Backstab). */
  flankPct?: number;
  /** On a hit: steals one of the target's buffs, or drains MP when it has none (Siphon). */
  siphon?: { mpPct: number };
  /** Only from the front row (on a board: with a foe next to the user). */
  frontOnly?: boolean;
  /** After damage, lowers the user's own stat (Reckless Swing). */
  selfDebuff?: { stat: MarinaraStat; pct: number; duration: number };
  /** Lowers the target's stat after a hit (Shield Bash stagger, Sundering). */
  onHit?: { stat: MarinaraStat | "damage"; pct: number; duration: number };
  /** Damage counted from another stat; "guard" is Defense or Resistance, whichever is higher
   *  (Landslide; Alyssa 2026-11-02). */
  from?: MarinaraStat | "guard";
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

/**
 * Tame (Tracker, Alyssa 2026-11-01): a wild beast or vermin below `belowHp` of its HP, never a boss or
 * treasure foe. The odds are `base`, plus up to `skillLuck` as the user's Skill and Luck outweigh the
 * beast's, plus `perHpMissing` for each share of HP under the line it has lost, less `perLevel` for
 * every level the beast stands above the user, less `elite` for an elite (23:36); never below `min` or
 * above `max`.
 */
export const MARINARA_TAME = {
  belowHp: 0.3,
  base: 0.3,
  skillLuck: 0.4,
  perHpMissing: 1,
  perLevel: 0.06,
  elite: 0.2,
  min: 0.1,
  max: 0.9,
} as const;
/** A companion raises its keeper's matching stat while a Tracker-tree class is active, by `base` plus
 *  `perLevel` for each level it was tamed at, times its rank's factor (Alyssa 23:36: stronger catches
 *  pay); Bond multiplies that by `bond`, and the rest of the party gets `shared` of the result. */
export const MARINARA_COMPANION = {
  base: 0.04,
  perLevel: 0.004,
  tier: { minion: 0.5, standard: 1, elite: 1.5, boss: 0 } as Record<MarinaraEnemyTier, number>,
  bond: 1.5,
  shared: 0.5,
} as const;

/** What a companion tamed at this level and rank adds to its keeper's stat, as a share. */
export function marinaraCompanionBonus(companion: { level?: number; tier?: MarinaraEnemyTier }): number {
  return (
    (MARINARA_COMPANION.base + MARINARA_COMPANION.perLevel * (companion.level ?? 1)) *
    (MARINARA_COMPANION.tier[companion.tier ?? "standard"] ?? 1)
  );
}

/** What every active class skill does. Steal takes something from a foe, kept with the fight's loot. */
export const MARINARA_SKILL_EFFECTS: Record<string, MarinaraEffect> = {
  // Blade
  "power-strike": dmg("strength", 9, { speedUntilNext: -0.25 }),
  flurry: dmg("strength", 4, { hits: 2 }),
  "last-cut": dmg("strength", 10, { critBonus: 30, finisher: { below: 0.5, bonus: 0.5 } }),
  // Balance pass (2026-11-01): it missed evasive foes too often, and opens a Wound (the party's anti-heal).
  "reckless-swing": dmg("strength", 13, {
    hitBonus: 15,
    selfDebuff: { stat: "defense", pct: -0.2, duration: 2 },
    applies: { status: "wound", duration: 3 },
  }),
  // Every foe (playtest 2026-11-02): melee, so the back row takes half, as for any melee hit.
  "sweeping-ruin": dmg("strength", 13, {
    target: "all-enemies",
    speedUntilNext: -0.2,
    onHit: { stat: "damage", pct: -0.15, duration: 2 },
  }),
  arsenal: dmg("strength", 8, { pierce: 0.3 }),
  // Every enemy in reach: the front row in Classic (every adjacent enemy in Tactical).
  "thousand-edges": dmg("strength", 7, { target: "front-row", speedUntilNext: -0.25, cooldown: 3 }),
  // Guard
  cover: { kind: "cover", target: "ally", duration: 1 },
  provoke: { kind: "provoke", target: "self", duration: 2 },
  challenge: { kind: "taunt", target: "enemy", duration: 2 },
  "sworn-ward": { kind: "ward", target: "ally", duration: 3 },
  fortress: {
    kind: "buff",
    target: "party",
    stat: "damage-taken",
    pct: -0.5,
    duration: 1,
    cooldown: 5,
    sideCooldown: true,
  },
  spellguard: { kind: "buff", target: "party", stat: "resistance", pct: 0.3, duration: 2 },
  landslide: dmg("magic", 6, { from: "guard" }),
  // Balance pass (2026-11-01): the Pure Guard line's taunt; its tank held fewer fights than a Sentinel's.
  "warding-stance": { kind: "buff", target: "self", stat: "resistance", pct: 0.5, duration: 2, provokes: 2 },
  // Oath of Iron: nobody of the party drops below 1 HP until their next turn.
  "oath-of-iron": { kind: "buff", target: "party", stat: "deathless", pct: 1, duration: 1, oncePerFight: true },
  // Scout
  steal: { kind: "steal", target: "enemy" },
  backstab: dmg("strength", 10, { critBonus: 15, flankPct: 0.5 }),
  vanish: {
    kind: "buff",
    target: "self",
    // The evasion itself comes from `hide` (MARINARA_VANISH_EVADE); the mod only shows it on the sheet.
    stat: "evasion",
    pct: 0.4,
    duration: 1,
    hide: true,
    critNext: true,
    exposeNext: 0.2,
    // A bonus action (Alyssa 2026-11-01): the Phantom vanishes and strikes in the same turn.
    bonusAction: true,
    cooldown: 2,
  },
  "hit-and-run": dmg("strength", 5, { speedUntilNext: 0.6 }),
  // A bonus action that grants one more action: two actions on the turn it is used.
  "double-time": { kind: "extra-turn", target: "self", cooldown: 3, bonusAction: true },
  shadowstep: dmg("strength", 9, { ranged: true, critBonus: 10 }),
  // Thousand Shadows: three decoys take the next three hits on the party; they last until used
  // (Alyssa 2026-11-02: no time limit). The buff is only the "shadows" marker.
  "thousand-shadows": {
    kind: "buff",
    target: "self",
    stat: "shadows",
    pct: 0,
    duration: 3,
    decoys: 3,
    usesPerFight: 2,
  },
  // Marksman
  "aimed-shot": dmg("strength", 8, { ranged: true, hitBonus: 30, speedUntilNext: -0.2 }),
  pierce: dmg("strength", 7, { ranged: true, pierce: 0.5 }),
  headshot: dmg("strength", 20, { ranged: true, charge: true, critBonus: 25 }),
  // A bonus action (lab 2026-11-01: marking ate 54-73% of a Tracker's turns for 6% of party damage).
  "mark-prey": { kind: "debuff", target: "enemy", stat: "damage-taken", pct: 0.35, duration: 3, bonusAction: true },
  "snare-field": { kind: "debuff", target: "all-enemies", stat: "speed", pct: -0.3, duration: 2 },
  // Tame (Alyssa 2026-11-01): a weakened wild beast becomes the user's companion; Sic sends it in.
  tame: { kind: "tame", target: "enemy" },
  sic: dmg("strength", 7, { ranged: true, bonusAction: true, cooldown: 2, companion: true }),
  // Volley: a basic attack's power, at the usual 60% area share per foe.
  volley: dmg("strength", MARINARA_TUNING.basicPower, { ranged: true, target: "all-enemies", cooldown: 2 }),
  // Balance pass (2026-11-01): power 9 -> 13 (Volley did as much for 6 stamina).
  "ruinous-barrage": dmg("strength", 13, {
    ranged: true,
    target: "all-enemies",
    speedUntilNext: -0.25,
    cooldown: 3,
    onHit: { stat: "defense", pct: -0.25, duration: 2 },
  }),
  // Channeler
  // Channel Element is a bonus action taken outside the skill menu (marinaraChannelElement).
  "channel-element": { kind: "none", target: "self" },
  "greater-channel-element": { kind: "none", target: "self" },
  "greater-channel-element-starweaver": { kind: "none", target: "self" },
  // More power (Alyssa 2026-11-01): was 6.
  // Hits every foe nearly as hard as one (85% each, not the usual 60%), at a normal turn's weight: the
  // AI cast it 1% of the time against the old Twin Cast's 80% (lab, 2026-11-01).
  "elemental-lance": dmg("magic", 11, { ranged: true }),
  tempest: dmg("magic", 9, { ranged: true, target: "all-enemies", cooldown: 3, areaPct: 0.7, loneFull: true }),
  // Rune Scholar line (Alyssa 2026-11-01): party elemental support. The party's weapon attacks and
  // skills strike in the caster's channeled element (Alyssa 2026-11-02).
  "edge-runes": { kind: "buff", target: "party", stat: "imbue", pct: 1, duration: 3, cooldown: 2 },
  "grand-inscription": {
    kind: "buff",
    target: "party",
    stat: "imbue",
    pct: 1,
    duration: 3,
    cooldown: 3,
    // Ward cut (Alyssa 2026-11-02): it overlapped Living Runes.
    alsoMods: [{ stat: "damage", pct: 0.2 }],
  },
  // Balance pass (2026-11-01): ignores half of Resistance (was all of it) and every elemental resistance.
  starfall: dmg("magic", 8, { ranged: true, pierce: 0.5 }),
  // A sure hit on its charged turn (playtest 2026-11-02), paid for with a very high MP cost.
  convergence: dmg("magic", 24, { ranged: true, charge: true, sureHit: true }),
  // Hexer
  // Weaken: the foe's Strength or Magic, whichever it hits with.
  weaken: { kind: "debuff", target: "enemy", stat: "best-attack", pct: -0.25, duration: 3, sapsToUser: true },
  // Balance pass (2026-11-01): 8% -> 6% a turn; a share of max HP grew too big on bosses.
  rot: { kind: "status", target: "enemy", status: "poison", chance: 0.9, duration: 4, power: 0.06 },
  // Wither also wounds (healing halved): the party's anti-heal (Alyssa 2026-11-01, item 8).
  wither: {
    kind: "status",
    target: "enemy",
    status: "wither",
    chance: 1,
    duration: 3,
    power: 0.05,
    applies: { status: "wound", duration: 3 },
  },
  doom: { kind: "status", target: "enemy", status: "doom", chance: 0.6, duration: 3 },
  // Carrion Lord (the Hexer's front-line master): a heavy drain on one foe, all of it back.
  "carrion-feast": dmg("magic", 14, { ranged: true, drain: 1, cooldown: 2 }),
  lull: { kind: "status", target: "enemy", status: "sleep", chance: 0.75, duration: 3 },
  // Cooldown (Alyssa 2026-11-02): Confusion is strong (half of single-target attacks go at allies).
  "mass-confusion": { kind: "status", target: "all-enemies", status: "confuse", chance: 0.7, duration: 2, cooldown: 3 },
  siphon: dmg("magic", 8, { ranged: true, pierce: 0.5, siphon: { mpPct: 0.15 } }),
  // Every foe, and the Hexer drinks half of it back: a Hexer can hold the front against a swarm
  // (Alyssa 2026-11-01).
  // Front row only (Alyssa 2026-11-01): the Hexer's front-line drain.
  "grave-tithe": dmg("magic", 5, { target: "all-enemies", ranged: true, drain: 0.5, cooldown: 2, frontOnly: true }),
  // Void Sovereign (reworked 2026-11-01): it hurts every foe as well as weakening them.
  "total-eclipse": dmg("magic", 7, {
    target: "all-enemies",
    ranged: true,
    cooldown: 2,
    onHit: { stat: "damage", pct: -0.25, duration: 2 },
  }),
  // Mender
  mend: { kind: "heal", target: "ally", scales: "magic", power: 8 },
  revive: { kind: "revive", target: "downed-ally", power: 0.35, cooldown: 3 },
  sanctuary: { kind: "heal", target: "party", scales: "magic", power: 5, speedUntilNext: -0.2, cleanse: "one" },
  remedy: { kind: "heal", target: "ally", scales: "magic", power: 5, cleanse: "all" },
  purify: { kind: "cleanse", target: "ally", cleanse: "all" },
  "elixir-rain": { kind: "status", target: "party", status: "regen", chance: 1, duration: 3, power: 0.07 },
  barrier: { kind: "shield", target: "ally", scales: "magic", power: 8 },
  "undying-light": { kind: "revive", target: "downed-ally", power: 0.5, oncePerFight: true, allDowned: true },
  // A smite (Alyssa 2026-11-02): replaces Second Breath so a Mender on their own can still hurt a foe.
  verdict: dmg("magic", 9, { ranged: true, hitBonus: 15 }),
  // Herald
  rally: { kind: "buff", target: "party", stat: "damage", pct: 0.2, duration: 2 },
  // Cantor's songs stack by verse (Alyssa 2026-11-01): each re-cast while one lasts adds 10%, up to 3.
  "battle-hymn": {
    kind: "buff",
    target: "party",
    stat: "damage",
    pct: 0.25,
    duration: 3,
    verses: { pct: 0.1, most: 3 },
    // A bonus action (Alyssa 2026-11-01): the Cantor sings and still acts.
    bonusAction: true,
  },
  "swift-refrain": {
    kind: "buff",
    target: "party",
    stat: "speed",
    pct: 0.15,
    duration: 3,
    verses: { pct: 0.1, most: 3 },
    // A bonus action (Alyssa 2026-11-01): the Cantor sings and still acts.
    bonusAction: true,
  },
  "guarding-refrain": {
    kind: "buff",
    target: "party",
    stat: "defense",
    pct: 0.15,
    duration: 3,
    alsoMods: [{ stat: "resistance", pct: 0.15 }],
    verses: { pct: 0.1, most: 3 },
    // A bonus action (Alyssa 2026-11-01): the Cantor sings and still acts.
    bonusAction: true,
  },
  // Crescendo: every buff the party carries counts twice for a round.
  crescendo: { kind: "buff", target: "party", stat: "crescendo", pct: 0, duration: 1, cooldown: 3, doubles: true },
  // Field Captain (reworked 2026-11-02, Alyssa): turns the foes onto an ally who can take it.
  "draw-fire": { kind: "provoke", target: "ally", duration: 2 },
  // Reworked (Alyssa 2026-11-02): the old Command as a bonus action; the whole-party order is Hour of Heroes.
  "grand-strategy": { kind: "command", target: "ally", cooldown: 3, bonusAction: true },
  "raise-the-banner": { kind: "buff", target: "party", stat: "damage", pct: 0.25, duration: 3, steadies: true },
  "hour-of-heroes": { kind: "command", target: "party", cooldown: 4 },
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
  "burn",
  "freeze",
  "shock",
  "entangle",
  "crumble",
  "soak",
  "rend",
  "windswept",
  "sear",
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
  /** Dead Eye: hits on a weakness deal this share more, after the weakness multiplier. */
  weakDamagePct?: number;
  lifestealPct?: number;
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
  /** Steady: every hit ignores this share of the target's Defense or Resistance (after any skill pierce). */
  armorPenPct?: number;
  /** Counter a melee attack: always, or only one that missed. */
  counter?: "always" | "on-miss";
  /** Counters at most once a round (balance pass 2026-11-01). */
  counterOncePerRound?: boolean;
  /** Return Fire: once between its own turns, shoots the first foe to attack it or any ally, if it
   *  can reach that foe (Alyssa 2026-11-01: a taunting ally mustn't make it useless). */
  coverFire?: boolean;
  /** Counters add this share of the user's Defense or Resistance, whichever is higher, to their power
   *  (Retaliate; Alyssa 2026-11-02: Res too, so Warden and Witch builds use it). */
  counterDefensePct?: number;
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
  /** The party takes this share more (negative: less) elemental damage (Warding Runes). */
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
  /** Heavy Draw: all damage up 30%. */
  heavyDraw?: boolean;
  /** Element Mastery: fire hits Burn, ice hits Freeze, lightning hits Shock. */
  elementMastery?: boolean;
  /** Resonance: hits in an element the target is weak to deal this much more damage. */
  elementWeakPct?: number;
  /** Attunement: more damage on hits in the user's channeled element. */
  channeledDamagePct?: number;
  bloodlust?: boolean;
  /** Can't be stunned: ever, or while below half HP (Immovable, Unstoppable). */
  stunImmune?: "always" | "below-half";
  /** Statuses that never take hold (Elder Oath). */
  immuneTo?: MarinaraStatusId[];
  /** Items used work this share better (Item Savant). */
  itemPowerPct?: number;
  /** Using an item once a round gives an extra action (Double Dose). */
  freeItem?: boolean;
  /** Crit chance against a target that carries a debuff or harmful status (Exploit). */
  critVsDebuffed?: number;
  /** Harder to hit (Light Feet). */
  evadeBonus?: number;
  /** The party's Defense rises by this share while no one of it is down (Formation). */
  partyDefenseWhileWhole?: number;
  /** Hold Fast: a provoking ally of the holder takes this much less damage (negative). */
  partyProvokerTakenPct?: number;
  /** Kill Zone: while an ally of the holder provokes, the party deals this much more damage. */
  partyDamageWhileProvoked?: number;
  /** Morale: the holder's side resists each harmful status ailment this share of the time. */
  partyStatusResistPct?: number;
  /** A buff on a party member moves its next turn this share of a turn sooner (Tempo). */
  tempoPct?: number;
  /** The user's turns take this share longer (Heavy Draw). */
  turnPct?: number;
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
  "follow-through": { actOnKill: true },
  // Bloodsworn (Alyssa 2026-11-01): the lower its HP, the harder it hits, and it drinks from every hit.
  bloodrage: { damagePerMissingPct: 0.6 },
  bloodlust: { lifestealPct: 0.15 },
  unstoppable: { stunImmune: "below-half", takenBelowHalfPct: -0.15 },
  "adaptive-grip": { hitBonus: 10, noPenalty: true },
  peerless: { extraActionEvery: 3 },
  "shield-wall": { backRowTakenPct: -0.25 },
  "last-stand": { lastStand: true },
  retaliate: { counter: "always", counterDefensePct: 0.5 },
  "aura-of-warding": { partyMagicTakenPct: -0.35 },
  "elder-oath": { statPct: { resistance: 0.5 }, immuneTo: ["doom", "sleep"] },
  immovable: { stunImmune: "always", defendBonusPct: 0.2 },
  "shield-line": { partyDefensePct: 0.15, partyResistancePct: 0.15 },
  "light-feet": { evadeBonus: 10 },
  exploit: { critVsDebuffed: 25 },
  assassinate: { assassinate: true },
  fleet: { statPct: { speed: 0.2 } },
  tailwind: { partySpeedPct: 0.2 },
  elusive: { evadeFirstHitEachRound: true },
  "perfect-evasion": { evasionStacking: 10 },
  "true-aim": { hitBonus: 15 },
  steady: { armorPenPct: 0.2 },
  "return-fire": { coverFire: true },
  "abyssal-will": { spellDamagePct: 0.2 },
  "dead-eye": { critBonus: 15, weakDamagePct: 0.25 },
  "old-oath": { statPct: { resistance: 0.3 }, magicTakenPct: -0.2 },
  "read-the-signs": { critBonus: 5, bonusVsMarked: 0.2 },
  "pack-tactics": { partyBonusVsMarked: 0.4 },
  // Heavy Draw: a bigger draw, a slower user: plain Speed down (Alyssa 2026-11-02).
  "heavy-draw": { heavyDraw: true, statPct: { speed: -0.15 } },
  // Resonance (Alyssa 2026-11-02, in Imbue Weapon's place): the channeled element bites harder on a weakness.
  resonance: { elementWeakPct: 0.2 },
  // Element Mastery (Alyssa 2026-11-02, the Elementalist in the Fusionist's place).
  "element-mastery": { elementMastery: true },
  sundering: { hitsLowerDefense: 0.1 },
  // Attunement (Alyssa 2026-11-02): damage in the channeled element, not all spells.
  attunement: { channeledDamagePct: 0.15 },
  overcharge: { critBonus: 10 },
  "warding-runes": { partyElementTakenPct: -0.25 },
  "living-runes": { partyElementTakenPct: -0.35, buffDurationBonus: 1 },
  "deep-well": { mpPct: 0.3 },
  "mana-tide": { mpRegenPct: 0.05 },
  lingering: { debuffDurationBonus: 1 },
  "ill-omen": { enemyCritToMissChance: 0.5 },
  "grave-skin": { frontTakenPct: -0.2 },
  "siphoning-rot": { curseFeedPct: 0.5 },
  // Slow Time (Alyssa 2026-11-02, worded as Speed): -20% Speed until the foe's next turn (was "25% longer").
  "slow-time": { slowDebuffed: 0.2 },
  nightmare: { nightmare: true },
  null: { debuffImmune: true },
  devour: { devour: true },
  grace: { healCrit: true },
  miracle: { miracle: true },
  "item-savant": { itemPowerPct: 0.5 },
  "double-dose": { freeItem: true },
  overheal: { overheal: true },
  sanctified: { partyMagicTakenPct: -0.15 },
  encore: { buffDurationBonus: 1 },
  tempo: { tempoPct: 0.15 },
  "hold-fast": { partyProvokerTakenPct: -0.25 },
  "kill-zone": { partyDamageWhileProvoked: 0.25 },
  // Replaced Inspire, then Defiance (Alyssa 2026-11-02): useful in any party, no healing needed.
  morale: { partyStatusResistPct: 0.3 },
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
  /** The ammunition types the party owns, for a Marksman's bow or gun (Alyssa 2026-11-01). */
  ammoOwned?: MarinaraDamageType[];
  /** The ammunition loaded by hand; absent, the weapon's own. */
  ammoLoaded?: MarinaraDamageType;
  /** Run by the AI: loads whichever owned ammunition hurts the target most, shot by shot. */
  ammoAuto?: boolean;
  /** Channel Element (Alyssa 2026-11-02): the element a Channeler-tree caster has channeled; their
   *  basic attacks and Channeler-tree element spells strike with it. Absent, raw (arcane) magic: nothing is channeled until they channel (Alyssa 2026-11-02). */
  channeled?: MarinaraDamageType;
  /** Channel Element is a bonus action: once between the user's own turns. */
  channeledThisTurn?: boolean;
  /** Where on the timeline this fighter's latest turn began: "now" while it acts. */
  turnAt?: number;
  /** Slow Time already stretched the wait to this fighter's next turn. */
  waitSlowed?: boolean;
  /** Run by the player: channels by hand. Otherwise (the AI, foes, harnesses) it channels, as its bonus
   *  action, the element its target is weakest to when it strikes with an element. */
  channelManual?: boolean;
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
  /** A treasure foe (marinara-bestiary.ts): what beating it pays, as multiples of a standard foe of its
   *  level, and the round after which it flees, paying nothing. */
  windfall?: { xp: number; gold: number; fleeAfterRounds: number };
  /** Threw down its arms: never acts, and the party's AI leaves it be; the player may spare or finish it. */
  yielded?: boolean;
  /** Robbed by this fighter (Steal): a foe has one thing to take, kept with the fight's loot. */
  stolenBy?: string;
  /** What Steal took, once the director knows the place (logged at once and kept for the loot). */
  stolen?: { item: string } | { gold: number };
  /** A wild beast or vermin Tame can take: what it is called and the stat it is strongest in. */
  tameable?: { name: string; stat: MarinaraStat; familyId?: string };
  /** Tamed by this fighter: it leaves the fight, pays XP and drops nothing. */
  tamedBy?: string;
  /** The tamed beast that follows this party member (Tracker): Sic strikes with it. */
  companion?: { name: string; stat: MarinaraStat };
  /** A boss once below half its HP: it hits harder for the rest of the fight (MARINARA_BOSS_RULES). */
  enraged?: boolean;
  // fight state
  next: number;
  /** `element`: on an "imbue" mod, the element the caster had channeled (Edge Runes, Grand Inscription). */
  mods: Array<{ stat: string; pct: number; turns: number; source: string; by?: string; element?: MarinaraDamageType }>;
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
  counteredThisRound?: boolean;
  /** Who of the other side struck it since its own last turn (Backstab). */
  struckBy?: string;
  /** Decoys left that take the next hits on this fighter's party (Thousand Shadows). */
  decoys?: number;
  /** Used its free item this round (Double Dose). */
  freeItemUsed?: boolean;
  missesAgainst: number;
  firstSpellUsed?: boolean;
  actions: number;
  defending: boolean;
  marked: number;
  hidden?: boolean;
  exposeNext?: number;
  /** Vanish: the user's next hit that lands is a critical hit. */
  critNext?: boolean;
  followThroughUsed?: boolean;
  /** Commanded (Command, Grand Strategy): acts again at once, outside its own place on the timeline. */
  bonusTurns?: number;
  /** When its extra actions were granted, so they're taken in that order (a commanded ally before the
   *  commander's own bonus action: Grand Strategy "acts at once"). */
  bonusAt?: number;
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
  | "slowed"
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
  | "steal"
  | "tame"
  | "decoy"
  | "oath"
  | "siphon"
  | "channel";

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
  /** Steal: the name of the item taken (gold goes in `amount`). */
  item?: string;
  /** Why a skill didn't take hold (resist): an immunity, Morale, or the roll. */
  why?: "immune" | "morale" | "chance";
  /** A hit: how much a shield soaked up, and what it has left. */
  shielded?: number;
  shieldLeft?: number;
  /** A hit halved by the back-row melee rule. */
  halved?: boolean;
  /** Passives that changed a hit, by name (Hold Fast, Kill Zone), for the log. */
  notes?: string[];
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
const turnLength = (unit: MarinaraFighter, all: readonly MarinaraFighter[], speedPct = 0) => {
  let length =
    MARINARA_TUNING.timeline /
    (marinaraEffectiveStat(unit, "speed", all) * (1 + speedPct) + MARINARA_TUNING.speedFloor);
  length *= 1 + (hooksOf(unit).turnPct ?? 0);
  // Slow Time: a debuffed fighter acts later while a foe of its holds time back.
  if (marinaraDebuffed(unit)) {
    // Speed down by `slowing` for the wait to their next turn.
    length /= 1 - slowTimeOn(unit, all);
  }
  return length;
};
/** Slow Time: how much a standing foe of the unit slows it while it is debuffed (0 when none can). */
const slowTimeOn = (unit: MarinaraFighter, all: readonly MarinaraFighter[]) =>
  Math.min(
    0.9,
    Math.max(
      0,
      ...living(all.filter((other) => other.side !== unit.side)).map((other) => hooksOf(other).slowDebuffed ?? 0),
    ),
  );

/**
 * Slow Time (Alyssa 2026-11-02): a debuff or status ailment that lands slows at once. Each fighter
 * not debuffed before the action and debuffed after it has the rest of its wait stretched, once per wait.
 */
function slowNewlyDebuffed(
  before: ReadonlySet<MarinaraFighter>,
  now: number,
  all: readonly MarinaraFighter[],
  ctx?: MarinaraFightContext,
): void {
  for (const unit of living(all)) {
    if (before.has(unit) || unit.waitSlowed || !marinaraDebuffed(unit)) continue;
    const slowing = slowTimeOn(unit, all);
    if (slowing <= 0) continue;
    const left = Math.max(0, unit.next - now);
    unit.next = now + left / (1 - slowing);
    unit.waitSlowed = true;
    // Shown in the log (playtest 2026-11-02: "a passive with no visible effect").
    const by = living(all.filter((other) => other.side !== unit.side)).find((other) => hooksOf(other).slowDebuffed);
    if (by && ctx)
      ctx.events.push({
        kind: "slowed",
        actorId: by.id,
        targetId: unit.id,
        skillId: "slow-time",
        amount: Math.round(slowing * 100),
      });
  }
}

/** Runs an action, then slows whoever it newly debuffed (Slow Time). */
function withSlowTime(
  actor: MarinaraFighter,
  all: readonly MarinaraFighter[],
  run: () => void,
  ctx?: MarinaraFightContext,
): void {
  const before = new Set(all.filter((unit) => marinaraDebuffed(unit)));
  try {
    run();
  } finally {
    slowNewlyDebuffed(before, actor.turnAt ?? Math.min(...living(all).map((unit) => unit.next)), all, ctx);
  }
}

/** Whether a fighter carries a debuff or a harmful status. */
export function marinaraDebuffed(unit: MarinaraFighter): boolean {
  return (
    unit.statuses.some((s) => HARMFUL.has(s.status)) ||
    unit.mods.some((mod) => (mod.stat === "damage-taken" ? mod.pct > 0 : mod.pct < 0) && mod.source !== "probe")
  );
}

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
      if (hooks.partyDefenseWhileWhole && all.filter((u) => u.side === unit.side).every((u) => u.hp > 0))
        pct += hooks.partyDefenseWhileWhole;
      if (marinaraRowOf(unit, all) === "front") pct += hooks.frontRowDefensePct ?? 0;
    }
  }
  if (stat === "speed" && unit.statuses.some((s) => s.status === "slow")) pct -= 0.3;
  // Freeze (Element Mastery's ice): Speed down while it lasts.
  if (stat === "speed" && unit.statuses.some((s) => s.status === "freeze"))
    pct -= MARINARA_ELEMENT_MASTERY.freezeSpeedPct;
  // Crumble (earth) and Soak (water): Defense or Resistance down while it lasts.
  if (stat === "defense" && unit.statuses.some((s) => s.status === "crumble"))
    pct -= MARINARA_ELEMENT_MASTERY.crumbleDefensePct;
  if (stat === "resistance" && unit.statuses.some((s) => s.status === "soak"))
    pct -= MARINARA_ELEMENT_MASTERY.soakResistancePct;
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

/**
 * Heals and shields grow with the caster's level as fight HP does (Alyssa 2026-11-02): max HP is
 * multiplied by marinaraFightHpMultiplier, so a flat Magic-based heal fell from about a third of an
 * ally's max HP at level 1 to under a fifth at level 30.
 */
function healScale(actor: MarinaraFighter): number {
  return marinaraFightHpMultiplier(actor.level ?? 1) / marinaraFightHpMultiplier(1);
}
/** A Magic-based heal: (8 for Mend, 5 for the others) plus half the caster's Magic, scaled by level. */
function magicHeal(actor: MarinaraFighter, effect: MarinaraEffect, all: readonly MarinaraFighter[]): number {
  return (
    (powerStat(actor, "magic", effect, all) * MARINARA_TUNING.healMagicPct + (effect.power ?? 0)) * healScale(actor)
  );
}

/** The damage types this effect can hit with; an imbued weapon adds the elements. */
function damageOptions(actor: MarinaraFighter, effect: MarinaraEffect): readonly MarinaraDamageType[] {
  if (!actor.classId) {
    if (effect.type && effect.type !== "weapon" && effect.type !== "element" && effect.type !== "any-physical")
      return [effect.type];
    return [actor.attackType ?? "blunt"];
  }
  const type = effect.type ?? "weapon";
  // Channel Element: a Channeler-tree caster's element hits are the channeled element.
  // Channel Element: element hits are the channeled element only (Alyssa 2026-11-02). One the AI runs
  // that hasn't channeled yet this turn can still pick any, so it weighs them all.
  if (type === "element" && marinaraCanChannel(actor))
    return !actor.channelManual && !actor.channeledThisTurn
      ? marinaraChannelChoices(actor)
      : [marinaraChanneled(actor)];
  // The weapon in hand decides a weapon hit's type; without gear, the best the class can wield.
  const options =
    type === "weapon" && actor.gear?.weaponType ? [actor.gear.weaponType] : marinaraDamageOptions(type, actor.classId);
  // Edge Runes / Grand Inscription: weapon attacks and skills also strike in the caster's channeled element.
  const runes = imbueElements(actor, type);
  // Ammunition: a Marksman's shot is the loaded type, or under the AI the best type owned.
  const ammo = type === "weapon" || type === "any-physical" ? marinaraAmmoChoices(actor) : [];
  if (ammo.length) {
    const shots = actor.ammoAuto
      ? [...new Set([...options, ...ammo])]
      : actor.ammoLoaded && ammo.includes(actor.ammoLoaded)
        ? [actor.ammoLoaded]
        : options;
    return runes.length ? [...new Set([...shots, ...runes])] : shots;
  }
  return runes.length ? [...new Set([...options, ...runes])] : options;
}

/**
 * The elements rune buffs lend this fighter's weapon attacks and skills: each caster's channeled one.
 * A caster who was unchanneled lends none (Alyssa 2026-11-02); Grand Inscription's damage still counts.
 */
function imbueElements(actor: MarinaraFighter, type: string): MarinaraDamageType[] {
  if (type !== "weapon" && type !== "any-physical") return [];
  const lent = actor.mods
    .filter((mod) => mod.stat === "imbue" && mod.pct > 0)
    .map((mod) => mod.element)
    .filter((element): element is MarinaraDamageType => !!element && element !== "arcane");
  return [...new Set(lent)];
}

/**
 * What a Marksman can load (Alyssa 2026-11-01: not a skill, an inherent quality of their bows and
 * guns): the weapon's own type and every ammunition type the party owns. Empty for anyone else, or
 * for a Marksman whose party owns no ammunition.
 */
export function marinaraAmmoChoices(actor: MarinaraFighter): MarinaraDamageType[] {
  if (actor.archetype !== "marksman" || !actor.ammoOwned?.length || !actor.classId) return [];
  const own = actor.gear?.weaponType ? [actor.gear.weaponType] : marinaraDamageOptions("weapon", actor.classId);
  return [...new Set([...own, ...actor.ammoOwned])];
}

/** Whether this fighter channels an element: a class of the Channeler tree. */
export function marinaraCanChannel(actor: MarinaraFighter): boolean {
  if (!actor.classId) return false;
  // A Channeler-tree class, or anyone carrying a Channeler element spell (Tempest...) or rune buff.
  return (
    actor.archetype === "channeler" ||
    actor.skills.some(
      (skill) =>
        skill.id === "channel-element" ||
        skill.id.startsWith("greater-channel-element") ||
        skill.damage === "element" ||
        MARINARA_SKILL_EFFECTS[skill.id]?.stat === "imbue",
    )
  );
}

/** What this caster can channel: Greater Channel Element adds light and dark. */
export function marinaraChannelChoices(actor: MarinaraFighter): readonly MarinaraDamageType[] {
  return actor.skills.some((skill) => skill.id.startsWith("greater-channel-element"))
    ? MARINARA_GREATER_CHANNEL_CHOICES
    : MARINARA_CHANNEL_CHOICES;
}

/** The element a Channeler-tree caster strikes with now: the channeled one, raw (arcane) magic until they channel. */
export function marinaraChanneled(actor: MarinaraFighter): MarinaraDamageType {
  return actor.channeled ?? "arcane";
}

/**
 * Channel Element, a bonus action (Alyssa 2026-11-02): sets the element a Channeler-tree caster's
 * basic attacks and element spells strike with, until they channel another. Once between their turns.
 */
export function marinaraChannelElement(actor: MarinaraFighter, element: MarinaraDamageType): boolean {
  if (!marinaraCanChannel(actor) || actor.channeledThisTurn) return false;
  if (!(marinaraChannelChoices(actor) as readonly string[]).includes(element)) return false;
  actor.channeled = element;
  actor.channeledThisTurn = true;
  return true;
}

/** Loads a Marksman's ammunition by hand: one of `marinaraAmmoChoices`. A free action. */
export function marinaraLoadAmmo(actor: MarinaraFighter, type: MarinaraDamageType): boolean {
  if (!marinaraAmmoChoices(actor).includes(type)) return false;
  actor.ammoLoaded = type;
  return true;
}

/** A song re-sung while it lasts: one more verse on each stat it changes, and its turns start again. */
function singVerse(unit: MarinaraFighter, effect: MarinaraEffect, turns: number, source: string) {
  const verses = effect.verses!;
  const stats = [{ stat: effect.stat!, pct: effect.pct ?? 0 }, ...(effect.alsoMods ?? [])];
  for (const { stat, pct } of stats) {
    const mod = unit.mods.find((m) => m.source === source && m.stat === stat);
    if (!mod) continue;
    mod.pct = Math.min(pct + verses.pct * verses.most, mod.pct + verses.pct);
    mod.turns = Math.max(mod.turns, turns);
  }
}

/** How many verses of a song this unit already has (0: not singing it). */
export function marinaraVersesOf(unit: MarinaraFighter, effect: MarinaraEffect, source: string): number {
  if (!effect.verses) return 0;
  const mod = unit.mods.find((m) => m.source === source && m.stat === effect.stat);
  return mod ? Math.round((mod.pct - (effect.pct ?? 0)) / effect.verses.pct) : 0;
}

function modTotal(unit: MarinaraFighter, stat: string): number {
  return unit.mods.filter((mod) => mod.stat === stat).reduce((sum, mod) => sum + mod.pct, 0);
}

function addMod(unit: MarinaraFighter, stat: string, pct: number, turns: number, source: string, by?: string) {
  if (pct < 0 && hooksOf(unit).debuffImmune) return;
  const existing = unit.mods.find((mod) => mod.source === source && mod.stat === stat);
  if (existing) existing.turns = Math.max(existing.turns, turns);
  else unit.mods.push({ stat, pct, turns, source, ...(by ? { by } : {}) });
}

/** Oath of Iron: one sworn to stay standing keeps 1 HP. */
function holdOn(unit: MarinaraFighter, ctx: MarinaraFightContext) {
  if (unit.hp > 0 || !unit.mods.some((mod) => mod.stat === "deathless")) return;
  unit.hp = 1;
  ctx.events.push({ kind: "oath", actorId: unit.id });
}

/** Siphon: takes one of the target's buffs for the user, or drains its MP when it has none. */
function siphon(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  mpPct: number,
  ctx: MarinaraFightContext,
  skillId?: string,
) {
  const buff = target.mods.find((mod) => mod.pct > 0 && mod.stat !== "damage-taken" && mod.source !== "probe");
  if (buff) {
    target.mods = target.mods.filter((mod) => mod !== buff);
    addMod(actor, buff.stat, buff.pct, buff.turns, `siphon:${buff.source}`);
    ctx.events.push({ kind: "siphon", actorId: actor.id, targetId: target.id, skillId, status: buff.stat });
    return;
  }
  const drained = Math.min(target.mp, Math.round(target.maxMp * mpPct));
  if (drained <= 0) return;
  target.mp -= drained;
  actor.mp = Math.min(actor.maxMp, actor.mp + drained);
  ctx.events.push({ kind: "siphon", actorId: actor.id, targetId: target.id, skillId, amount: drained });
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
  // Balance pass (2026-11-01): the Herald tree swings with the better of Strength and Magic, and the
  // Apothecary line with the better of Magic and Skill (they did 4-5 a hit at level 25-30).
  const from =
    unit.archetype === "herald" && unit.stats.magic > unit.stats.strength
      ? ("magic" as const)
      : (unit.classId === "apothecary" || unit.classId === "panacean") && unit.stats.skill > unit.stats.magic
        ? ("skill" as const)
        : undefined;
  // Channeler-tree classes cast a stronger basic spell (playtest 2026-11-02: they lagged on one big foe).
  const power =
    MARINARA_TUNING.basicPower +
    (unit.classId && unit.archetype === "channeler" && unit.magicBasic ? MARINARA_CHANNELER_BASIC_BONUS : 0);
  return dmg(unit.magicBasic ? "magic" : "strength", power, {
    ...(from ? { from } : {}),
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
  // Sic needs a companion, and strikes from the user's stat it is strongest in (Strength when that is a
  // guarding stat or HP).
  if (base.companion && !unit.companion) return null;
  const sicFrom = base.companion && unit.companion ? companionAttackStat(unit.companion.stat) : undefined;
  // Every skill that runs on Strength or Magic uses the one the user's weapon calls for (Alyssa
  // 2026-11-02): a focus (more spell power than weapon power) means Magic and magic damage against
  // Resistance, any other weapon Strength against Defense. Unarmed, the class's standard weapon
  // decides. Skills on another stat (Speed, Skill, a guard stat, Sic's companion) are unchanged.
  const powered = !base.from && (base.scales === "strength" || base.scales === "magic");
  const best = marinaraWeaponStat(unit);
  return {
    ...base,
    ...(powered
      ? {
          scales: best,
          ...(base.damage ? { damage: best === "magic" ? "magic" : "physical", nature: base.damage } : {}),
        }
      : {}),
    ...(sicFrom ? { from: sicFrom } : {}),
    ...(skill.damage ? { type: skill.damage } : {}),
    ...(unit.carriedIds?.includes(skill.id) ? { carried: true } : {}),
  };
}

/** Strength or Magic, by the weapon in hand: a focus (more spell power than weapon power) is Magic. */
export function marinaraWeaponStat(unit: MarinaraFighter): "strength" | "magic" {
  if (unit.gear) return unit.gear.spellPower > unit.gear.power ? "magic" : "strength";
  return unit.archetype === "channeler" || unit.archetype === "hexer" || unit.archetype === "mender"
    ? "magic"
    : "strength";
}

function companionAttackStat(stat: MarinaraStat): MarinaraStat {
  return stat === "magic" || stat === "skill" || stat === "speed" || stat === "luck" ? stat : "strength";
}

/** Whether Tame can be tried on this foe now. */
export function marinaraTameable(target: MarinaraFighter): boolean {
  return (
    !!target.tameable &&
    target.hp > 0 &&
    target.hp < target.maxHp * MARINARA_TAME.belowHp &&
    target.tier !== "boss" &&
    !target.windfall &&
    !target.yielded
  );
}

/** The chance, in percent, that this fighter's Tame takes this beast. */
export function marinaraTameChance(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  all: readonly MarinaraFighter[],
): number {
  const mine = marinaraEffectiveStat(actor, "skill", all) + marinaraEffectiveStat(actor, "luck", all);
  const its = marinaraEffectiveStat(target, "skill", all) + marinaraEffectiveStat(target, "luck", all);
  const share = mine / Math.max(1, mine + its);
  const missing = Math.max(0, MARINARA_TAME.belowHp - target.hp / Math.max(1, target.maxHp));
  const chance =
    MARINARA_TAME.base +
    MARINARA_TAME.skillLuck * share +
    MARINARA_TAME.perHpMissing * missing -
    MARINARA_TAME.perLevel * Math.max(0, target.level - actor.level) -
    (target.tier === "elite" ? MARINARA_TAME.elite : 0);
  return Math.round(Math.min(MARINARA_TAME.max, Math.max(MARINARA_TAME.min, chance)) * 100);
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
    if (
      (effect.oncePerFight || effect.usesPerFight) &&
      unit.used.filter((id) => id === skill.id).length >= (effect.usesPerFight ?? 1)
    )
      continue;
    // A commanded action can't command or take extra actions in turn (it would only spend itself).
    if ((effect.kind === "command" || effect.kind === "extra-turn") && unit.commanded) continue;
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

/** Element Mastery's ailments, 2 turns each: Burn 4% max HP a turn, Freeze -15% Speed, Shock +10 critical
 *  chance (flat, added to the attacker's own) on every attack against the target; the wuxing elements
 *  (Alyssa 2026-11-02): Entangle -15 hit chance, Crumble -15% Defense, Soak -15% Resistance, Rend -15%
 *  damage dealt. */
export const MARINARA_ELEMENT_MASTERY = {
  turns: 2,
  burnPct: 0.04,
  freezeSpeedPct: 0.15,
  shockCrit: 10,
  entangleHit: 15,
  crumbleDefensePct: 0.15,
  soakResistancePct: 0.15,
  rendDamagePct: 0.15,
  windsweptHit: 15,
  searTakenPct: 0.1,
} as const;

/** The ailment Element Mastery leaves for each element. */
/**
 * The wuxing cycles (Alyssa 2026-11-02). Overcoming: each element beats the next (wood parts earth,
 * earth dams water, water quenches fire, fire melts metal, metal cuts wood); the bestiary sets foe
 * weaknesses and resistances by it. Generating: each element feeds the next (wood feeds fire, fire
 * makes earth, earth bears metal, metal gathers water, water nourishes wood); a hit deals
 * MARINARA_WUXING_FEED_PCT more to a foe already suffering the ailment of the element that feeds it.
 * Nothing to sequence by hand: it pays off whenever two elements meet on one foe.
 */
export const MARINARA_WUXING_OVERCOMES = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
} as const satisfies Partial<Record<MarinaraDamageType, MarinaraDamageType>>;
/** What feeds each wuxing element: a target with the feeder's ailment takes more from it. */
export const MARINARA_WUXING_FED_BY = {
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
  wood: "water",
} as const satisfies Partial<Record<MarinaraDamageType, MarinaraDamageType>>;
export const MARINARA_WUXING_FEED_PCT = 0.15;
/**
 * The phase each element takes in both cycles (Alyssa 2026-11-02): ice counts as water, lightning and
 * wind as wood (both wood trigrams). Light and dark stay outside the phases, yang and yin, weak only
 * to each other.
 */
export const MARINARA_ELEMENT_PHASE = {
  wood: "wood",
  lightning: "wood",
  wind: "wood",
  fire: "fire",
  earth: "earth",
  metal: "metal",
  water: "water",
  ice: "water",
} as const satisfies Record<(typeof MARINARA_ELEMENTS)[number], keyof typeof MARINARA_WUXING_OVERCOMES>;

export const MARINARA_ELEMENT_AILMENTS: Record<
  (typeof MARINARA_ELEMENTS)[number] | "light" | "dark",
  MarinaraStatusId
> = {
  fire: "burn",
  ice: "freeze",
  lightning: "shock",
  wood: "entangle",
  earth: "crumble",
  water: "soak",
  metal: "rend",
  wind: "windswept",
  // Light and dark: only a Greater Channel Element caster carrying Element Mastery channels them.
  light: "sear",
  dark: "wound",
};

/** Vanish's evasion bonus until the user's next turn (Alyssa 2026-11-02: auto-evade was too strong). */
export const MARINARA_VANISH_EVADE = 40;
/** Added to a Channeler-tree class's basic attack power (playtest 2026-11-02). */
export const MARINARA_CHANNELER_BASIC_BONUS = 2;
/** Perfect Evasion's most (playtest 2026-11-02: 30 to 40). */
export const MARINARA_PERFECT_EVASION_CAP = 40;

/**
 * Who an effect can be aimed at. In Classic, a taunt or a provoker forces the pick (a vanished
 * unit stays targetable, it is just hard to hit). Tactical leaves reach to the board.
 */
export function marinaraTargetsFor(
  actor: MarinaraFighter,
  effect: MarinaraEffect,
  all: readonly MarinaraFighter[],
): MarinaraFighter[] {
  const everyFoe = living(all.filter((unit) => unit.side !== actor.side));
  const foes = everyFoe;
  const friends = living(all.filter((unit) => unit.side === actor.side));
  if (effect.target === "self") return [actor];
  if (effect.target === "party") return friends;
  // Guarding or watching over someone means someone else.
  if (effect.target === "ally")
    return effect.kind === "cover" || effect.kind === "ward" || effect.kind === "provoke" || effect.kind === "command"
      ? friends.filter((unit) => unit !== actor)
      : friends;
  if (effect.target === "downed-ally") return all.filter((unit) => unit.side === actor.side && unit.hp <= 0);
  // Tame looks past taunts: only a beast it can take.
  if (effect.kind === "tame") return everyFoe.filter(marinaraTameable);
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
  /** Halved by the back-row melee rule. */
  halved?: boolean;
  /** Passives that changed it, for the log (Hold Fast, Kill Zone). */
  notes?: string[];
}

/** The rider a weapon hit carries (a coating), if it lands. */
function riderFor(
  actor: MarinaraFighter,
  target: MarinaraFighter,
  effect: MarinaraEffect,
  raw: number,
  weaponMultiplier: number,
) {
  if ((effect.nature ?? effect.damage) === "magic" || effect.kind !== "damage" || !actor.coating) return null;
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
  const attackStat =
    effect.from === "guard"
      ? marinaraEffectiveStat(actor, "defense", all) > marinaraEffectiveStat(actor, "resistance", all)
        ? "defense"
        : "resistance"
      : (effect.from ?? effect.scales ?? (magic ? "magic" : "strength"));
  const guard =
    marinaraEffectiveStat(target, magic ? "resistance" : "defense", all) *
    (1 - (effect.pierce ?? 0)) *
    (1 - (hooks.armorPenPct ?? 0));
  let damage =
    powerStat(actor, attackStat, effect, all) +
    (effect.power ?? MARINARA_TUNING.basicPower) +
    (actor.gear ? (magic ? actor.gear.spellPower : actor.gear.power) : actor.level * MARINARA_TUNING.powerPerLevel) +
    (actor.gearPower ?? 0) -
    guard;
  let pct = modTotal(actor, "damage") + modTotal(target, "damage-taken");
  // Sear (light): the target takes more.
  if (target.statuses.some((st) => st.status === "sear")) pct += MARINARA_ELEMENT_MASTERY.searTakenPct;
  // Rend (metal): a rent attacker deals less.
  if (actor.statuses.some((st) => st.status === "rend")) pct -= MARINARA_ELEMENT_MASTERY.rendDamagePct;
  const notes = new Set<string>();
  for (const ally of living(all.filter((unit) => unit.side === actor.side))) {
    const allyHooks = hooksOf(ally);
    pct += allyHooks.partyDamagePct ?? 0;
    if (allyHooks.partyDamageWhileWhole && all.filter((u) => u.side === actor.side).every((u) => u.hp > 0))
      pct += allyHooks.partyDamageWhileWhole;
    if (target.marked > 0) pct += allyHooks.partyBonusVsMarked ?? 0;
    if (
      allyHooks.partyDamageWhileProvoked &&
      living(all.filter((u) => u.side === actor.side)).some((u) => u.provoking > 0)
    ) {
      pct += allyHooks.partyDamageWhileProvoked;
      notes.add("Kill Zone");
    }
  }
  if (magic) pct += hooks.spellDamagePct ?? 0;
  pct += (hooks.damagePct ?? 0) + (actor.gear?.damagePct ?? 0);
  if (hooks.damageBelowHalfPct && actor.hp < actor.maxHp / 2) pct += hooks.damageBelowHalfPct;
  if (hooks.damagePerMissingPct) pct += hooks.damagePerMissingPct * Math.max(0, 1 - actor.hp / actor.maxHp);
  if (actor.enraged) pct += MARINARA_BOSS_RULES.enrageDamagePct;
  if (target.marked > 0 && hooks.bonusVsMarked) pct += hooks.bonusVsMarked;
  if (effect.finisher && target.hp < target.maxHp * effect.finisher.below) pct += effect.finisher.bonus;
  // Backstab: a target busy with one of the user's allies.
  if (effect.flankPct && target.struckBy && target.struckBy !== actor.id) {
    const by = all.find((u) => u.id === target.struckBy);
    if (by && by.side === actor.side) pct += effect.flankPct;
  }
  if (target.hp < target.maxHp / 2) pct += hooksOf(target).takenBelowHalfPct ?? 0;
  if (hooksOf(target).frontTakenPct && marinaraStandsFront(target, all)) pct += hooksOf(target).frontTakenPct!;
  if (magic) pct += hooksOf(target).magicTakenPct ?? 0;
  for (const ally of living(all.filter((unit) => unit.side === target.side))) {
    const allyHooks = hooksOf(ally);
    if (magic) pct += allyHooks.partyMagicTakenPct ?? 0;
    if (target.provoking > 0 && allyHooks.partyProvokerTakenPct) {
      pct += allyHooks.partyProvokerTakenPct;
      notes.add("Hold Fast");
    }
    if (marinaraRowOf(target, all) === "back") pct += allyHooks.backRowTakenPct ?? 0;
  }
  if (hooks.heavyDraw) pct += 0.3;
  const best = marinaraBestDamageType(damageOptions(actor, effect), target.affinities);
  // A basic attack is never walled off: immune and absorb count as resist for it.
  let multiplier = effect.basic ? Math.max(best.multiplier, 0.5) : best.multiplier;
  // Adaptive Grip: an armored foe's resistance to slash, pierce or blunt doesn't count against the user.
  if (
    hooks.noPenalty &&
    multiplier > 0 &&
    multiplier < 1 &&
    (MARINARA_PHYSICAL_TYPES as readonly string[]).includes(best.type)
  )
    multiplier = 1;
  if (multiplier > 1) multiplier += hooks.weakBonus ?? 0;
  if (multiplier > 1) multiplier *= 1 + (hooks.weakDamagePct ?? 0);
  // A channeled light or dark hit counts as elemental too (Greater Channel Element).
  const channeledHit = marinaraCanChannel(actor) && best.type === marinaraChanneled(actor) && best.type !== "arcane";
  if (
    multiplier > 1 &&
    hooks.elementWeakPct &&
    ((MARINARA_ELEMENTS as readonly string[]).includes(best.type) || channeledHit)
  )
    multiplier *= 1 + hooks.elementWeakPct;
  // Wuxing generating cycle: an element of the phase that feeds this one has left its ailment on the target.
  const phase = (MARINARA_ELEMENT_PHASE as Partial<Record<string, keyof typeof MARINARA_WUXING_FED_BY>>)[best.type];
  const feeder = phase ? MARINARA_WUXING_FED_BY[phase] : undefined;
  if (
    multiplier > 0 &&
    feeder &&
    MARINARA_ELEMENTS.some(
      (element) =>
        MARINARA_ELEMENT_PHASE[element] === feeder &&
        target.statuses.some((st) => st.status === MARINARA_ELEMENT_AILMENTS[element]),
    )
  )
    multiplier *= 1 + MARINARA_WUXING_FEED_PCT;
  // Attunement: hits in the user's own channeled element.
  if (hooks.channeledDamagePct && channeledHit) multiplier *= 1 + hooks.channeledDamagePct;
  // Warding Runes and Living Runes (and any "element-taken" mod): the elements bite the warded party less.
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
    // Adaptive Grip: an evasive foe's own evasion bonuses don't count against the user.
    (hooks.noPenalty
      ? 0
      : (hooksOf(target).evadeBonus ?? 0) +
        Math.min(MARINARA_PERFECT_EVASION_CAP, target.missesAgainst * (hooksOf(target).evasionStacking ?? 0))) +
    (target.hidden ? MARINARA_VANISH_EVADE : 0);
  const hitChance = Math.max(
    MARINARA_MIN_HIT_CHANCE,
    Math.min(
      100,
      MARINARA_TUNING.hitBase +
        marinaraEffectiveStat(actor, "skill", all) * 2 +
        marinaraEffectiveStat(actor, "luck", all) / 2 +
        (effect.hitBonus ?? 0) +
        (hooks.hitBonus ?? 0) +
        (actor.gear?.hit ?? 0) +
        // Windswept (wind): attacks against the target gain hit chance.
        (target.statuses.some((st) => st.status === "windswept") ? MARINARA_ELEMENT_MASTERY.windsweptHit : 0) -
        // Entangle (wood): the bound attacker's hit chance drops.
        (actor.statuses.some((st) => st.status === "entangle") ? MARINARA_ELEMENT_MASTERY.entangleHit : 0) -
        evade,
    ),
  );
  const baseCrit = Math.max(
    0,
    Math.min(
      100,
      marinaraEffectiveStat(actor, "skill", all) / 2 +
        (effect.critBonus ?? 0) +
        (hooks.critBonus ?? 0) +
        (hooks.critVsDebuffed && marinaraDebuffed(target) ? hooks.critVsDebuffed : 0) +
        (actor.gear?.crit ?? 0) +
        partyCrit -
        marinaraEffectiveStat(target, "luck", all),
    ),
  );
  // Shock (Element Mastery's lightning): a flat +10 on top of whatever the attacker has, never eaten by
  // the target's Luck (Alyssa 2026-11-02).
  const critChance = Math.min(
    100,
    baseCrit + (target.statuses.some((st) => st.status === "shock") ? MARINARA_ELEMENT_MASTERY.shockCrit : 0),
  );
  // Hard crowd control (Alyssa 2026-11-02): a stunned or sleeping target can't dodge, on either side.
  return {
    damage,
    hitChance: marinaraHelpless(target) || effect.sureHit ? 100 : hitChance,
    critChance,
    multiplier,
    type: best.type,
    rider,
    ...(rowFactor < 1 ? { halved: true } : {}),
    ...(notes.size ? { notes: [...notes] } : {}),
  };
}

/** Stunned or asleep: every attack on it lands (no evasion, no Elusive dodge). */
export function marinaraHelpless(unit: MarinaraFighter): boolean {
  return unit.statuses.some((s) => s.status === "sleep" || s.status === "stun");
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

/** What one use of an effect would do right now, as the skill button shows it: the damage per foe
 *  (or the healing per ally) across whoever it can land on, before the hit roll. A crit doubles a hit. */
export interface MarinaraSkillEstimate {
  kind: "damage" | "heal";
  min: number;
  max: number;
  critMax?: number;
  hits?: number;
}

export function marinaraSkillEstimate(
  actor: MarinaraFighter,
  effect: MarinaraEffect,
  all: readonly MarinaraFighter[],
  tactical = false,
): MarinaraSkillEstimate | null {
  if (effect.kind === "damage") {
    const foes = living(all.filter((unit) => unit.side !== actor.side && !unit.yielded));
    if (!foes.length) return null;
    const area =
      (effect.target === "all-enemies" || effect.target === "front-row") && !(effect.loneFull && foes.length === 1);
    const used = area ? { ...effect, spread: effect.areaPct ?? MARINARA_TUNING.areaSpreadPct } : effect;
    const amounts = foes.map((foe) =>
      Math.max(0, Math.round(marinaraHitNumbers(actor, foe, used, all, tactical).damage)),
    );
    const max = Math.max(...amounts);
    return {
      kind: "damage",
      min: Math.min(...amounts),
      max,
      critMax: Math.round(max * MARINARA_TUNING.critMultiplier),
      ...((effect.hits ?? 1) > 1 ? { hits: effect.hits } : {}),
    };
  }
  if (effect.kind === "heal") {
    const allies = effect.target === "self" ? [actor] : living(all.filter((unit) => unit.side === actor.side));
    if (!allies.length) return null;
    const amounts = allies.map((ally) =>
      Math.round((effect.pctOfMax ? ally.maxHp * effect.pctOfMax : magicHeal(actor, effect, all)) * healFactor(ally)),
    );
    const max = Math.max(...amounts);
    return {
      kind: "heal",
      min: Math.min(...amounts),
      max,
      ...(hooksOf(actor).healCrit ? { critMax: Math.round(max * 1.5) } : {}),
    };
  }
  return null;
}

/** How much removing a fighter's debuffs is worth, in HP. */
export function marinaraDebuffBurden(unit: MarinaraFighter, all: readonly MarinaraFighter[]): number {
  let value = 0;
  for (const status of unit.statuses) {
    if (!HARMFUL.has(status.status)) continue;
    if (
      status.status === "poison" ||
      status.status === "wither" ||
      status.status === "bleed" ||
      status.status === "burn"
    )
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
  /** A boss takes this share of Poison and Wither ticks (balance pass 2026-11-01): a share of max HP
   *  a turn grew too big on a boss's HP. */
  dotPct: 0.5,
  /** An elite shakes off confusion this share of the time a non-boss would not. */
  eliteConfuseResist: 0.5,
};

/** Whether a status can't take hold on this fighter (the AI checks it before trying). */
export function marinaraShrugsOff(target: MarinaraFighter, status: string): boolean {
  return shrugsOff(target, status);
}

function shrugsOff(target: MarinaraFighter, status: string): boolean {
  const hooks = hooksOf(target);
  if (status === "stun" && (hooks.stunImmune === "always" || (hooks.stunImmune && target.hp < target.maxHp / 2)))
    return true;
  if (hooks.immuneTo?.includes(status as MarinaraStatusId)) return true;
  // Raise the Banner: a steadied fighter can't be confused.
  if (status === "confuse" && target.mods.some((mod) => mod.stat === "steady-heart")) return true;
  return (
    !!hooks.debuffImmune ||
    !!target.gear?.immune?.includes(status) ||
    (target.tier === "boss" && (MARINARA_BOSS_RULES.ignores as readonly string[]).includes(status))
  );
}

/**
 * Morale (Standard-Bearer, Alyssa 2026-11-02): while a holder stands, their side resists each harmful
 * status ailment some of the time.
 */
function moraleHolds(
  target: MarinaraFighter,
  status: string,
  all: readonly MarinaraFighter[],
  random: () => number,
): boolean {
  if (!HARMFUL.has(status as MarinaraStatusId)) return false;
  const pct = Math.max(
    0,
    ...living(all.filter((u) => u.side === target.side)).map((u) => hooksOf(u).partyStatusResistPct ?? 0),
  );
  return pct > 0 && random() < pct;
}

function addStatus(
  target: MarinaraFighter,
  applies: NonNullable<MarinaraEffect["applies"]>,
  bonus: number,
  by: string | undefined,
  all: readonly MarinaraFighter[],
  random: () => number,
) {
  if (applies.status === "poison" && marinaraAffinityMultiplier(target.affinities, "poison") <= 0) return false;
  if (shrugsOff(target, applies.status)) return false;
  if (moraleHolds(target, applies.status, all, random)) return false;
  target.statuses = target.statuses.filter((s) => s.status !== applies.status);
  target.statuses.push({
    status: applies.status,
    turns: applies.duration + bonus,
    power: applies.power,
    ...(by ? { by } : {}),
  });
  return true;
}

// ── The clock ──

/** Sets everyone's first turn on the timeline: faster fighters sooner, Vanguard (a Guard) first. */
export function startMarinaraClock(all: MarinaraFighter[], random: () => number): void {
  for (const unit of all) unit.next = turnLength(unit, all) * random() * (hooksOf(unit).vanguard ? 0.2 : 1);
}

/** A skill that works only from the front row (Grave Skin, Grave Tithe), to show it idle in the back. */
export function marinaraFrontOnly(skillId: string): boolean {
  return !!(MARINARA_PASSIVES[skillId]?.frontTakenPct || MARINARA_SKILL_EFFECTS[skillId]?.frontOnly);
}

/** Grants a fighter extra actions, queued after any already granted. */
export function marinaraGrantBonus(unit: MarinaraFighter, all: readonly MarinaraFighter[], count = 1): void {
  if (!unit.bonusTurns) unit.bonusAt = Math.max(0, ...all.map((other) => other.bonusAt ?? 0)) + 1;
  unit.bonusTurns = (unit.bonusTurns ?? 0) + count;
}

/** Who acts next: one owed an extra action (the earliest granted first), else the soonest on the timeline. */
export function nextMarinaraActor(all: readonly MarinaraFighter[]): MarinaraFighter | undefined {
  const commanded = living(all)
    .filter((unit) => (unit.bonusTurns ?? 0) > 0)
    .sort((a, b) => (a.bonusAt ?? 0) - (b.bonusAt ?? 0))[0];
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
    if (!actor.bonusTurns) {
      delete actor.bonusTurns;
      delete actor.bonusAt;
    }
    actor.commanded = true;
    const asleep = actor.statuses.some((s) => s.status === "sleep" || s.status === "stun");
    return { acts: !asleep && !actor.charging && !actor.dummy };
  }
  actor.defending = false;
  actor.hidden = false;
  actor.followThroughUsed = false;
  actor.evadedThisRound = false;
  actor.counteredThisRound = false;
  actor.channeledThisTurn = false;
  actor.freeItemUsed = false;
  // Its own turn came: whoever struck it is no longer keeping it busy (Backstab).
  delete actor.struckBy;
  for (const status of actor.statuses) {
    if (
      status.status === "poison" ||
      status.status === "wither" ||
      status.status === "bleed" ||
      status.status === "burn"
    ) {
      // Poison and Burn are damage types foes can resist; Wither and Bleed are pure and nothing stops them.
      const multiplier =
        (status.status === "poison" || status.status === "burn"
          ? marinaraAffinityMultiplier(actor.affinities, status.status === "burn" ? "fire" : "poison")
          : 1) * (actor.tier === "boss" && status.status !== "bleed" ? MARINARA_BOSS_RULES.dotPct : 1);
      const amount = Math.round(actor.maxHp * (status.power ?? 0.08) * multiplier);
      const before = actor.hp;
      actor.hp = Math.min(actor.maxHp, actor.hp - amount);
      if (amount !== 0) ctx.events.push({ kind: "tick", actorId: actor.id, status: status.status, amount });
      holdOn(actor, ctx);
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
  actor.turnAt = actor.next;
  actor.next += turnLength(actor, all);
  // A wait timed while debuffed under Slow Time is already slowed.
  actor.waitSlowed = marinaraDebuffed(actor) && slowTimeOn(actor, all) > 0;
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
  withSlowTime(actor, all, () => releaseMarinaraChargeNow(actor, release, all, ctx), ctx);
}

function releaseMarinaraChargeNow(
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
  withSlowTime(actor, all, () => performMarinaraOptionNow(actor, option, targets, all, ctx), ctx);
}

function performMarinaraOptionNow(
  actor: MarinaraFighter,
  option: MarinaraOption,
  targets: readonly MarinaraFighter[],
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
): void {
  const hooks = hooksOf(actor);
  const extraWeight = (option.effect.weight ?? 1) - 1;
  actor.next += turnLength(actor, all) * extraWeight;
  // Speed until its next turn: the wait to that turn is timed at the changed Speed.
  if (option.effect.speedUntilNext)
    actor.next += turnLength(actor, all, option.effect.speedUntilNext) - turnLength(actor, all);
  // An AI-run caster channels, as its bonus action, the element its target is weakest to, then strikes.
  const first = targets[0];
  if (
    option.effect.type === "element" &&
    first &&
    marinaraCanChannel(actor) &&
    !actor.channelManual &&
    !actor.channeledThisTurn
  ) {
    // Raw magic (unchanneled) only when every element does worse: ties go to an element.
    const element = marinaraBestDamageType(marinaraChannelChoices(actor), first.affinities).type;
    if (element !== marinaraChanneled(actor) && marinaraChannelElement(actor, element))
      ctx.events.push({ kind: "channel", actorId: actor.id, type: element });
    else actor.channeledThisTurn = true;
  }
  // Before a rune buff, it channels the element the most foes standing are weakest to.
  if (option.effect.stat === "imbue" && marinaraCanChannel(actor) && !actor.channelManual && !actor.channeledThisTurn) {
    const foes = living(all.filter((unit) => unit.side !== actor.side));
    const score = (element: MarinaraDamageType) =>
      foes.reduce((sum, foe) => sum + marinaraBestDamageType([element], foe.affinities).multiplier, 0);
    const element = [...MARINARA_ELEMENTS].sort((a, b) => score(b) - score(a))[0]!;
    if (element !== marinaraChanneled(actor) && marinaraChannelElement(actor, element))
      ctx.events.push({ kind: "channel", actorId: actor.id, type: element });
    else actor.channeledThisTurn = true;
  }
  if (option.skill) {
    const { resource, cost } = marinaraSkillCost(actor, option.skill);
    if (resource === "mp") {
      actor.firstSpellUsed = true;
      actor.mp -= cost;
    } else actor.stamina -= cost;
    if (option.effect.cooldown) actor.cooldowns[option.skill.id] = option.effect.cooldown;
    // A side-wide guard (Fortress): the whole side waits out its cooldown, so several casters can't
    // take turns keeping it up (playtest 2026-11-01: three Stonewall foes held the party at half damage).
    if (option.effect.cooldown && option.effect.sideCooldown)
      for (const ally of all)
        if (ally.side === actor.side && ally !== actor)
          ally.cooldowns[option.skill.id] = Math.max(ally.cooldowns[option.skill.id] ?? 0, option.effect.cooldown);
    if (option.effect.oncePerFight || option.effect.usesPerFight) actor.used.push(option.skill.id);
  } else if (option.id?.startsWith("enemy:")) {
    actor.cooldowns[option.id] = option.effect.cooldown ?? 3;
    // Harden and Self-Repair share one cooldown, so a boss can't stack them into a wall (balance pass).
    const pair = MARINARA_SHARED_FOE_COOLDOWNS[option.id];
    if (pair) actor.cooldowns[pair] = Math.max(actor.cooldowns[pair] ?? 0, option.effect.cooldown ?? 3);
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
    ctx.events.push({ kind: "charge", actorId: actor.id, targetId: target.id, skillId: chargedId });
    return;
  }
  act(actor, option.skill, option.effect, struck, all, ctx, option.id ?? undefined);
  if (hooks.extraActionEvery && !actor.commanded && actor.actions % hooks.extraActionEvery === 0) {
    // Peerless: every third action grants another action, chosen like any other. `actions` counts only
    // the user's own turns, so the extra action itself (a commanded turn) never grants another.
    marinaraGrantBonus(actor, all);
    ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId: "peerless" });
  }
}

/** Entrench: a defending Guard braces and hits back harder (Strength for counters; Alyssa 2026-11-02). */
function entrench(unit: MarinaraFighter) {
  addMod(unit, "defense", 0.3, 1, "entrench");
  addMod(unit, "resistance", 0.3, 1, "entrench");
  addMod(unit, "strength", 0.3, 1, "entrench");
}

function tickMods(unit: MarinaraFighter, all: readonly MarinaraFighter[]) {
  for (const mod of unit.mods) mod.turns--;
  const expiredMods = unit.mods.filter((mod) => mod.turns <= 0);
  unit.mods = unit.mods.filter((mod) => mod.turns > 0);
  for (const status of unit.statuses) status.turns--;
  const expired = unit.statuses.filter((s) => s.turns <= 0);
  unit.statuses = unit.statuses.filter((s) => s.turns > 0);
  // Devour: the one who placed a debuff or a harmful status heals 5% when it runs out.
  const placers = [
    ...expired.filter((s) => HARMFUL.has(s.status)).map((s) => s.by),
    ...expiredMods.filter((mod) => mod.pct < 0 || (mod.stat === "damage-taken" && mod.pct > 0)).map((mod) => mod.by),
  ];
  for (const id of placers) {
    const foe = id ? all.find((u) => u.id === id && u.side !== unit.side && u.hp > 0) : undefined;
    if (foe && hooksOf(foe).devour) foe.hp = Math.min(foe.maxHp, foe.hp + Math.round(foe.maxHp * 0.05));
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
      // An area attack always deals its per-foe share, even on a lone foe (Alyssa 2026-11-02: a
      // single target is what single-target skills are for).
      // Tempest (playtest 2026-11-02) is the exception: full damage when only one foe is left.
      if (
        (effect.target === "all-enemies" || effect.target === "front-row") &&
        !(effect.loneFull && targets.length === 1)
      )
        effect = { ...effect, spread: effect.areaPct ?? MARINARA_TUNING.areaSpreadPct };
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
      if (effect.bonusAction && !actor.commanded) {
        marinaraGrantBonus(actor, all);
        ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId });
      }
      break;
    }
    case "heal": {
      for (const target of targets) {
        let amount = effect.pctOfMax ? target.maxHp * effect.pctOfMax : magicHeal(actor, effect, all);
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
      // Undying Light raises every downed ally; a revive otherwise raises the one aimed at.
      const raised = effect.allDowned
        ? all.filter((unit) => unit.side === actor.side && unit.hp <= 0 && !unit.dummy)
        : targets.slice(0, 1);
      for (const target of raised) {
        if (target.hp > 0) continue;
        target.hp = Math.max(1, Math.round(target.maxHp * (effect.power ?? 0.25)));
        target.statuses = [];
        ctx.events.push({ kind: "revive", actorId: actor.id, targetId: target.id, skillId, amount: target.hp });
      }
      break;
    }
    case "shield": {
      for (const target of targets) {
        const amount = Math.round((powerStat(actor, "magic", effect, all) + (effect.power ?? 0)) * healScale(actor));
        // Cheaper than a heal (2 MP; Alyssa 2026-11-02), so it doesn't stack: the stronger shield holds.
        target.shield = Math.max(target.shield, amount);
        ctx.events.push({ kind: "shield", actorId: actor.id, targetId: target.id, skillId, amount });
      }
      break;
    }
    case "buff":
      for (const target of targets) {
        // Crescendo: every buff the target carries counts twice for the round.
        if (effect.doubles)
          for (const mod of target.mods.filter(
            (one) => one.pct > 0 && one.stat !== "damage-taken" && !one.source.startsWith("crescendo"),
          ))
            addMod(target, mod.stat, mod.pct, (effect.duration ?? 1) + durationBonus, `crescendo:${mod.source}`);
        if (effect.steadies) {
          target.statuses = target.statuses.filter((one) => one.status !== "confuse");
          addMod(target, "steady-heart", 1, (effect.duration ?? 1) + durationBonus, skillId ?? "buff");
        }
        if (effect.verses) singVerse(target, effect, (effect.duration ?? 1) + durationBonus, skillId ?? "buff");
        addMod(target, effect.stat!, effect.pct ?? 0, (effect.duration ?? 1) + durationBonus, skillId ?? "buff");
        if (effect.stat === "imbue") {
          const rune = target.mods.find((mod) => mod.stat === "imbue" && mod.source === (skillId ?? "buff"));
          if (rune) rune.element = marinaraChanneled(actor);
        }
        for (const also of effect.alsoMods ?? [])
          addMod(target, also.stat, also.pct, (effect.duration ?? 1) + durationBonus, skillId ?? "buff");
        ctx.events.push({ kind: "buff", actorId: actor.id, targetId: target.id, skillId, status: effect.stat });
        // Tempo: a buffed party member's next turn comes sooner.
        const tempo = Math.max(
          0,
          ...living(all.filter((u) => u.side === target.side)).map((u) => hooksOf(u).tempoPct ?? 0),
        );
        if (tempo && target.side === actor.side) target.next -= turnLength(target, all) * tempo;
      }
      if (effect.decoys) actor.decoys = effect.decoys;
      if (effect.hide) actor.hidden = true;
      if (effect.provokes) {
        actor.provoking = Math.max(actor.provoking, effect.provokes);
        ctx.events.push({ kind: "provoke", actorId: actor.id, skillId });
      }
      if (effect.bonusAction && !actor.commanded) {
        marinaraGrantBonus(actor, all);
        ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId });
      }
      if (effect.exposeNext) actor.exposeNext = effect.exposeNext;
      if (effect.critNext) actor.critNext = true;
      break;
    case "debuff":
      for (const target of targets) {
        if (hooksOf(target).debuffImmune) {
          ctx.events.push({ kind: "resist", actorId: actor.id, targetId: target.id, skillId, why: "immune" });
          continue;
        }
        // Weaken: whichever of Strength and Magic the target hits with.
        const stat =
          effect.stat === "best-attack"
            ? target.stats.magic > target.stats.strength
              ? "magic"
              : "strength"
            : effect.stat!;
        addMod(target, stat, effect.pct ?? 0, (effect.duration ?? 1) + durationBonus, skillId ?? "debuff", actor.id);
        if (skill?.id === "mark-prey") target.marked = (effect.duration ?? 3) + durationBonus;
        // Weaken saps (Alyssa 2026-11-02): the user gains the very stat the foe loses.
        if (effect.stat === "best-attack" && effect.sapsToUser)
          addMod(actor, stat, -(effect.pct ?? 0), (effect.duration ?? 1) + durationBonus, `${skillId ?? "debuff"}:sap`);
        ctx.events.push({
          kind: "debuff",
          actorId: actor.id,
          targetId: target.id,
          skillId,
          status: stat,
          amount: Math.round((effect.pct ?? 0) * 100),
          ...(effect.sapsToUser ? { notes: ["sap"] } : {}),
        });
        if (
          effect.applies &&
          random() < (effect.applies.chance ?? 1) &&
          addStatus(target, effect.applies, durationBonus, actor.id, all, random)
        )
          ctx.events.push({
            kind: "status",
            actorId: actor.id,
            targetId: target.id,
            skillId,
            status: effect.applies.status,
          });
      }
      if (effect.bonusAction && !actor.commanded) {
        marinaraGrantBonus(actor, all);
        ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId });
      }
      break;
    case "status":
      for (const target of targets) {
        const roll = random();
        const chance =
          (effect.chance ?? 1) *
          (effect.status === "confuse" && target.tier === "elite" ? 1 - MARINARA_BOSS_RULES.eliteConfuseResist : 1);
        // Why it didn't take, for the log (Alyssa 2026-11-02: an immunity says so).
        const why =
          effect.status === "regen"
            ? undefined
            : shrugsOff(target, effect.status!) ||
                (effect.status === "poison" && marinaraAffinityMultiplier(target.affinities, "poison") <= 0)
              ? ("immune" as const)
              : roll > chance
                ? ("chance" as const)
                : moraleHolds(target, effect.status!, all, random)
                  ? ("morale" as const)
                  : undefined;
        if (why) {
          ctx.events.push({
            kind: "resist",
            actorId: actor.id,
            targetId: target.id,
            skillId,
            status: effect.status,
            why,
            ...(why === "chance" ? { chance: Math.round(chance * 100), roll: Math.floor(roll * 100) } : {}),
          });
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
        // A second status riding on it (Wither's Wound).
        if (effect.applies && addStatus(target, effect.applies, durationBonus, actor.id, all, random))
          ctx.events.push({
            kind: "status",
            actorId: actor.id,
            targetId: target.id,
            skillId,
            status: effect.applies.status,
          });
      }
      break;
    case "cover":
      actor.covering = targets[0]?.id;
      ctx.events.push({ kind: "cover", actorId: actor.id, targetId: targets[0]?.id, skillId });
      break;
    case "provoke": {
      // Draw Fire: an ally provokes in the user's place.
      const who = effect.target === "ally" ? (targets[0] ?? actor) : actor;
      who.provoking = effect.duration ?? 2;
      ctx.events.push({ kind: "provoke", actorId: who.id, skillId });
      break;
    }
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
      // Double Time: one extra action, plus the action it gives back as a bonus action. Extra
      // actions are commanded ones: nothing ticks and the timeline stays where it was.
      marinaraGrantBonus(actor, all, effect.bonusAction && !actor.commanded ? 2 : 1);
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
    case "tame":
      for (const target of targets) {
        if (target.side === actor.side || !marinaraTameable(target)) {
          ctx.events.push({ kind: "resist", actorId: actor.id, targetId: target.id, skillId });
          continue;
        }
        const chance = marinaraTameChance(actor, target, all);
        const roll = random() * 100;
        const event = { actorId: actor.id, targetId: target.id, skillId, chance, roll: Math.floor(roll) };
        if (roll < chance) {
          target.tamedBy = actor.id;
          ctx.events.push({ kind: "tame", ...event });
        } else ctx.events.push({ kind: "miss", ...event });
      }
      break;
    case "command":
      // Commanded allies act at once, an action on top of their own turns.
      for (const target of targets) {
        if (target.id === actor.id || target.hp <= 0) continue;
        marinaraGrantBonus(target, all);
        ctx.events.push({ kind: "command", actorId: actor.id, targetId: target.id, skillId });
      }
      if (effect.bonusAction && !actor.commanded) {
        marinaraGrantBonus(actor, all);
        ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId });
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
  strikeOnce(actor, target, effect, all, ctx, canBeCountered, skillId);
  if (canBeCountered && actor.side !== target.side) returnFire(actor, target.side, all, ctx);
}

/** Return Fire: the first ready shooter on the attacked side answers the attack, once per its turn. */
function returnFire(
  attacker: MarinaraFighter,
  side: MarinaraFighter["side"],
  all: MarinaraFighter[],
  ctx: MarinaraFightContext,
) {
  if (attacker.hp <= 0) return;
  const shooter = living(all.filter((u) => u.side === side)).find(
    (u) =>
      hooksOf(u).coverFire &&
      !u.counteredThisRound &&
      !u.statuses.some((s) => s.status === "sleep" || s.status === "stun") &&
      marinaraWarderReaches(u, attacker, all),
  );
  if (!shooter) return;
  shooter.counteredThisRound = true;
  ctx.events.push({ kind: "counter", actorId: shooter.id, targetId: attacker.id, skillId: "return-fire" });
  strikeOnce(shooter, attacker, marinaraBasicAttack(shooter), all, ctx, false);
}

function strikeOnce(
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
  // Elusive: a separate 50% dodge before the normal roll, so the first attack halves its hit chance.
  if (targetHooks.evadeFirstHitEachRound && !target.evadedThisRound && !marinaraHelpless(target) && !effect.sureHit) {
    target.evadedThisRound = true;
    if (random() < 0.5) {
      ctx.events.push({ kind: "evade", actorId: actor.id, targetId: target.id, skillId });
      return;
    }
  }
  const { damage, hitChance, critChance, multiplier, rider, type, halved, notes } = marinaraHitNumbers(
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
    if (canBeCountered && !effect.ranged && targetHooks.counter && target.hp > 0 && mayCounter(target, targetHooks)) {
      ctx.events.push({ kind: "counter", actorId: target.id, targetId: actor.id });
      strike(target, actor, counterAttack(target, targetHooks, all), all, ctx, false);
    }
    return;
  }
  // Thousand Shadows: a decoy takes a hit that would land (not a miss or dodge), unless the target is stunned or asleep.
  const shadow = marinaraHelpless(target)
    ? undefined
    : living(all.filter((u) => u.side === target.side)).find((u) => (u.decoys ?? 0) > 0);
  if (shadow) {
    shadow.decoys! -= 1;
    ctx.events.push({ kind: "decoy", actorId: actor.id, targetId: target.id, skillId, amount: shadow.decoys });
    return;
  }
  // Vanish: the first hit to land after it is a sure critical.
  const sureCrit = !!actor.critNext;
  if (sureCrit) actor.critNext = undefined;
  let crit = sureCrit || random() * 100 < critChance;
  if (crit && !sureCrit) {
    const omen = living(all.filter((u) => u.side === target.side)).some((u) => hooksOf(u).enemyCritToMissChance);
    if (omen && random() < 0.5) crit = false;
  }
  let amount = Math.round(damage * (crit ? MARINARA_TUNING.critMultiplier : 1));
  let shielded = 0;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, amount);
    target.shield -= absorbed;
    amount -= absorbed;
    shielded = absorbed;
  }
  if (hooks.assassinate && crit && target.hp - amount < target.maxHp * 0.15 && target.tier !== "boss")
    amount = target.hp;
  const before = target.hp;
  target.hp -= amount;
  if (actor.side !== target.side) target.struckBy = actor.id;
  holdOn(target, ctx);
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
    ...(shielded > 0 ? { shielded, shieldLeft: Math.round(target.shield) } : {}),
    ...(halved ? { halved } : {}),
    ...(notes?.length ? { notes } : {}),
    chance: Math.round(hitChance),
    roll: Math.floor(roll),
  });
  if (rider) applyRider(actor, target, rider, crit, ctx);
  // Element Mastery: each element leaves its ailment (fire Burn, ice Freeze, lightning Shock), renewed
  // by further hits rather than stacked.
  if (hooks.elementMastery && target.hp > 0) {
    const m = MARINARA_ELEMENT_MASTERY;
    const status = (MARINARA_ELEMENT_AILMENTS as Partial<Record<string, MarinaraStatusId>>)[type];
    if (
      status &&
      addStatus(
        target,
        { status, duration: m.turns, ...(status === "burn" ? { power: m.burnPct } : {}) },
        0,
        actor.id,
        all,
        random,
      )
    )
      ctx.events.push({ kind: "debuff", actorId: actor.id, targetId: target.id, status, skillId: "element-mastery" });
  }

  if (effect.siphon && target.hp > 0) siphon(actor, target, effect.siphon.mpPct, ctx, skillId);
  const lifesteal = (hooks.lifestealPct ?? 0) + (actor.gear?.lifestealPct ?? 0) + (effect.drain ?? 0);
  if (lifesteal) actor.hp = Math.round(Math.min(actor.maxHp, actor.hp + dealt * lifesteal * healFactor(actor)));
  if (effect.onHit) addMod(target, effect.onHit.stat, effect.onHit.pct, effect.onHit.duration, `onhit:${actor.id}`);
  if (actor.exposeNext) {
    addMod(target, "damage-taken", actor.exposeNext, 2, "exposed");
    actor.exposeNext = undefined;
  }
  if (
    effect.applies &&
    amount > 0 &&
    random() < (effect.applies.chance ?? 1) &&
    addStatus(target, effect.applies, 0, undefined, all, random)
  )
    ctx.events.push({ kind: "status", actorId: actor.id, targetId: target.id, skillId, status: effect.applies.status });
  if (hooks.hitsLowerDefense) addMod(target, "defense", -hooks.hitsLowerDefense, 2, `sunder:${actor.id}`);
  if (target.statuses.some((s) => s.status === "sleep"))
    target.statuses = target.statuses.filter((s) => s.status !== "sleep");
  // Follow Through (playtest 2026-11-02): a critical hit counts as well as a kill, once per turn.
  if (crit && target.hp > 0 && hooks.actOnKill && !actor.followThroughUsed) {
    actor.followThroughUsed = true;
    actor.next -= turnLength(actor, all);
    ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId: "follow-through" });
  }
  if (target.hp <= 0) {
    target.hp = 0;
    ctx.events.push({ kind: "down", actorId: actor.id, targetId: target.id });
    if (hooks.healOnKillPct)
      actor.hp = Math.min(actor.maxHp, actor.hp + Math.round(actor.maxHp * hooks.healOnKillPct * healFactor(actor)));
    // Follow Through: a kill gives a whole new action, once per turn.
    if (hooks.actOnKill && !actor.followThroughUsed) {
      actor.followThroughUsed = true;
      actor.next -= turnLength(actor, all);
      ctx.events.push({ kind: "extra-turn", actorId: actor.id, skillId: "follow-through" });
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
  if (
    canBeCountered &&
    reachesBack &&
    targetHooks.counter === "always" &&
    target.hp > 0 &&
    mayCounter(target, targetHooks)
  ) {
    ctx.events.push({ kind: "counter", actorId: target.id, targetId: actor.id });
    strike(target, actor, counterAttack(target, targetHooks, all), all, ctx, false);
  }
}

/** Foe abilities that share a cooldown on one foe. */
const MARINARA_SHARED_FOE_COOLDOWNS: Record<string, string> = {
  "enemy:harden": "enemy:self-repair",
  "enemy:self-repair": "enemy:harden",
};

/** Whether a fighter may counter now: some counter once a round (balance pass 2026-11-01). */
function mayCounter(unit: MarinaraFighter, hooks: MarinaraPassiveHooks): boolean {
  if (!hooks.counterOncePerRound) return true;
  if (unit.counteredThisRound) return false;
  unit.counteredThisRound = true;
  return true;
}

/** A counter's strike: the basic attack, plus a share of Defense or Resistance for Retaliate. */
function counterAttack(unit: MarinaraFighter, hooks: MarinaraPassiveHooks, all: readonly MarinaraFighter[]) {
  const basic = marinaraBasicAttack(unit);
  if (!hooks.counterDefensePct) return basic;
  const guard = Math.max(marinaraEffectiveStat(unit, "defense", all), marinaraEffectiveStat(unit, "resistance", all));
  const extra = guard * hooks.counterDefensePct;
  return { ...basic, power: (basic.power ?? MARINARA_TUNING.basicPower) + extra };
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
  /** Threw down its arms: waits on the party, who may spare it or finish it off. */
  yielded?: boolean;
  coating?: MarinaraDamageType;
  /** A Marksman's ammunition: what is loaded and what can be (owned types and the weapon's own). The
   *  AI loads by itself for one it runs (`auto`). */
  ammo?: { loaded: MarinaraDamageType; choices: MarinaraDamageType[]; auto?: boolean };
  /** Channel Element: the channeled element, the choices, whether it may change now, and AI-run. */
  channel?: { element: MarinaraDamageType; choices: MarinaraDamageType[]; ready: boolean; auto?: boolean };
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
    ...(unit.yielded ? { yielded: true } : {}),
    ...(unit.coating ? { coating: unit.coating } : {}),
    ...marinaraAmmoView(unit),
    ...(marinaraCanChannel(unit)
      ? {
          channel: {
            element: marinaraChanneled(unit),
            choices: [...marinaraChannelChoices(unit)],
            ready: !unit.channeledThisTurn,
            ...(unit.channelManual ? {} : { auto: true }),
          },
        }
      : {}),
    ...(unit.affinities ? { affinities: { ...unit.affinities } } : {}),
    next: Math.round(unit.next),
  };
}

function marinaraAmmoView(unit: MarinaraFighter): Pick<MarinaraCombatantView, "ammo"> {
  const choices = marinaraAmmoChoices(unit);
  if (!choices.length) return {};
  const loaded = unit.ammoLoaded && choices.includes(unit.ammoLoaded) ? unit.ammoLoaded : choices[0]!;
  return { ammo: { loaded, choices, ...(unit.ammoAuto ? { auto: true } : {}) } };
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
  /** Tamed this beast in the fight: their companion now. */
  tamed?: string;
  /** Their stable was full: the player picks one to release on their sheet. */
  stableFull?: boolean;
}

/** How long an action holds its user, against a plain action's 1 (for the AI's damage per time). */
export function marinaraActionWeight(effect: MarinaraEffect): number {
  return (effect.weight ?? 1) / (1 + (effect.speedUntilNext ?? 0));
}
