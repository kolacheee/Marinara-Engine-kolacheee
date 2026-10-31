/**
 * Class lab combat: Fire Emblem-style math for Classic Marinara's classes (Alyssa 2026-10-31), run
 * headless so class balance can be measured before any of it is played. Every number that shapes a
 * fight is in `TUNING` so the lab can be re-run after a change.
 *
 *   Physical damage = Strength + power − Defense; magic = Magic + power − Resistance (at least 1).
 *   Hit  = base + Skill×2 + Luck/2 − (Speed×2 + Luck) of the target, 5..100.
 *   Crit = Skill/2 + bonuses − target Luck, 0..100; a crit doubles damage.
 *   Damage type: the hit is multiplied by the target's affinity to its type (weak ×1.5, resist ×0.5,
 *   immune ×0, absorb heals); a skill with a choice of types uses the best one against the target.
 *   Magic skills cost MP (no regeneration); the rest cost stamina, which regenerates each turn.
 *   Turn order is a timeline: each action pushes the actor's next turn back by
 *   weight × TIMELINE / (Speed + SPEED_FLOOR), so fast characters act more often.
 */
import {
  MARINARA_ARCHETYPE_ATTACKS,
  MARINARA_STAMINA,
  MARINARA_STATS,
  marinaraBestDamageType,
  marinaraDamageOptions,
  marinaraMaxMp,
  marinaraMaxStamina,
  type MarinaraAffinities,
  type MarinaraDamageType,
  type MarinaraSkillDamage,
  type MarinaraArchetype,
  type MarinaraSkillDef,
  type MarinaraStat,
  type MarinaraStats,
} from "../../packages/shared/src/features/marinara-classes.js";

export const TUNING = {
  hitBase: 80,
  critMultiplier: 2,
  basicPower: 5,
  timeline: 1000,
  speedFloor: 10,
  defendDefensePct: 0.5,
  minDamage: 1,
  /** Weapon and spell power grow with level, as better gear would: added to every hit's power. */
  powerPerLevel: 0.2,
  /** Fight HP is the HP stat times this, so an even fight takes three to five hits to drop someone. */
  hpMultiplier: 1.5,
  /** Heals add this share of the healer's Magic to their power. */
  healMagicPct: 0.5,
  /** How much the party AI minds spending a point of each resource. */
  mpCostWeight: 0.15,
  staminaCostWeight: 0.05,
  /** Doom's toll when it runs out, as a share of max HP; a boss (over 300 HP) takes the smaller one. */
  doomPct: 0.4,
  doomBossPct: 0.1,
  /** Front-row foes hit only the front row while any of it stands, unless ranged. */
  frontRowShield: true,
};

// ── Effects ──

export type EffectTarget = "enemy" | "all-enemies" | "front-row" | "self" | "ally" | "party" | "downed-ally";

export interface Effect {
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
    | "extra-turn"
    | "command"
    | "none";
  target: EffectTarget;
  power?: number;
  scales?: MarinaraStat;
  damage?: "physical" | "magic";
  /** A basic attack, which immunity and absorption only resist. */
  basic?: boolean;
  /** Damage type; a skill's own type comes from its definition. */
  type?: MarinaraSkillDamage;
  hits?: number;
  hitBonus?: number;
  critBonus?: number;
  /** Share of the target's Defense or Resistance ignored. */
  pierce?: number;
  /** Reaches the back row from anywhere. */
  ranged?: boolean;
  /** Buff/debuff: stat changed by a share, for `duration` of the target's turns. */
  stat?: MarinaraStat | "damage" | "damage-taken";
  pct?: number;
  duration?: number;
  status?: "sleep" | "stun" | "poison" | "confuse" | "doom" | "slow" | "regen";
  chance?: number;
  /** Timeline weight of the action: 1 normal, more for heavy actions. */
  weight?: number;
  /** Takes a turn of charging before it lands. */
  charge?: boolean;
  cooldown?: number;
  oncePerFight?: boolean;
  /** After damage, lowers the user's own stat (Reckless Swing). */
  selfDebuff?: { stat: MarinaraStat; pct: number; duration: number };
  /** Lowers the target's stat after a hit (Shield Bash stagger, Sundering). */
  onHit?: { stat: MarinaraStat; pct: number; duration: number };
  /** Damage counted from another stat (Verdict: Defense). */
  from?: MarinaraStat;
  /** Extra damage below this share of the target's HP (finishers). */
  finisher?: { below: number; bonus: number };
}

const dmg = (scales: MarinaraStat, power: number, extra: Partial<Effect> = {}): Effect => ({
  kind: "damage",
  target: "enemy",
  scales,
  power,
  damage: scales === "magic" ? "magic" : "physical",
  ...extra,
});

/** What every active skill does in the lab. Steal and similar have no fight effect. */
export const SKILL_EFFECTS: Record<string, Effect> = {
  // Blade
  "power-strike": dmg("strength", 9, { weight: 1.3 }),
  flurry: dmg("strength", 4, { hits: 2 }),
  "moonless-cut": dmg("strength", 10, { critBonus: 30, finisher: { below: 0.5, bonus: 0.5 } }),
  "reckless-swing": dmg("strength", 13, { selfDebuff: { stat: "defense", pct: -0.3, duration: 2 } }),
  "sweeping-ruin": dmg("strength", 9, { target: "front-row", weight: 1.2 }),
  arsenal: dmg("strength", 8, { pierce: 0.3 }),
  "thousand-edges": dmg("strength", 7, { target: "all-enemies", ranged: true, weight: 1.3, cooldown: 3 }),
  // Guard
  cover: { kind: "cover", target: "ally", duration: 1 },
  provoke: { kind: "provoke", target: "self", duration: 2 },
  challenge: { kind: "taunt", target: "enemy", duration: 2 },
  fortress: { kind: "buff", target: "party", stat: "damage-taken", pct: -0.5, duration: 1, cooldown: 5 },
  spellguard: { kind: "buff", target: "party", stat: "resistance", pct: 0.3, duration: 2 },
  verdict: dmg("magic", 6, { from: "resistance" }),
  "warding-stance": { kind: "buff", target: "self", stat: "resistance", pct: 0.5, duration: 2 },
  "oath-of-iron": { kind: "buff", target: "party", stat: "damage-taken", pct: -0.75, duration: 1, oncePerFight: true },
  // Scout
  steal: { kind: "none", target: "enemy" },
  backstab: dmg("strength", 10, { critBonus: 15 }),
  vanish: { kind: "buff", target: "self", stat: "damage", pct: 0.6, duration: 1 },
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
  headshot: dmg("strength", 20, { ranged: true, charge: true, critBonus: 10 }),
  "mark-prey": { kind: "debuff", target: "enemy", stat: "damage-taken", pct: 0.25, duration: 3 },
  "snare-field": { kind: "debuff", target: "all-enemies", stat: "speed", pct: -0.3, duration: 2 },
  volley: dmg("strength", 4, { ranged: true, target: "all-enemies", cooldown: 2 }),
  "ruinous-barrage": dmg("strength", 9, {
    ranged: true,
    target: "all-enemies",
    weight: 1.3,
    cooldown: 3,
    onHit: { stat: "defense", pct: -0.25, duration: 2 },
  }),
  // Arcanist
  "element-bolt": dmg("magic", 7, { ranged: true }),
  "twin-cast": dmg("magic", 5, { ranged: true, hits: 2 }),
  tempest: dmg("magic", 6, { ranged: true, target: "all-enemies", weight: 1.2, cooldown: 2 }),
  glyph: dmg("magic", 10, { ranged: true, weight: 0.8 }),
  seal: { kind: "status", target: "enemy", status: "stun", chance: 0.7, duration: 2 },
  starfall: dmg("magic", 8, { ranged: true, pierce: 1 }),
  convergence: dmg("magic", 24, { ranged: true, charge: true }),
  // Hexer
  weaken: { kind: "debuff", target: "enemy", stat: "damage", pct: -0.25, duration: 3 },
  rot: { kind: "status", target: "enemy", status: "poison", chance: 0.9, duration: 4, power: 0.08 },
  doom: { kind: "status", target: "enemy", status: "doom", chance: 0.6, duration: 3 },
  lull: { kind: "status", target: "enemy", status: "sleep", chance: 0.75, duration: 3 },
  "mass-confusion": { kind: "status", target: "all-enemies", status: "confuse", chance: 0.7, duration: 2 },
  siphon: dmg("magic", 8, { ranged: true, pierce: 0.5 }),
  "total-eclipse": { kind: "debuff", target: "all-enemies", stat: "damage", pct: -0.4, duration: 2, cooldown: 3 },
  // Mender
  mend: { kind: "heal", target: "ally", scales: "magic", power: 8 },
  revive: { kind: "revive", target: "downed-ally", power: 0.25 },
  sanctuary: { kind: "heal", target: "party", scales: "magic", power: 5, weight: 1.2 },
  remedy: { kind: "heal", target: "ally", scales: "magic", power: 5 },
  "elixir-rain": { kind: "status", target: "party", status: "regen", chance: 1, duration: 3, power: 0.1 },
  barrier: { kind: "shield", target: "ally", scales: "magic", power: 10 },
  "undying-light": { kind: "revive", target: "downed-ally", power: 0.5, oncePerFight: true },
  // Herald
  rally: { kind: "buff", target: "party", stat: "damage", pct: 0.2, duration: 2 },
  "battle-hymn": { kind: "buff", target: "party", stat: "damage", pct: 0.25, duration: 3 },
  crescendo: { kind: "buff", target: "party", stat: "damage", pct: 0.5, duration: 1, cooldown: 3 },
  command: { kind: "command", target: "ally" },
  "grand-strategy": { kind: "command", target: "party", cooldown: 4 },
  "raise-the-banner": { kind: "buff", target: "party", stat: "damage", pct: 0.25, duration: 3 },
  "hour-of-heroes": { kind: "command", target: "party", oncePerFight: true },
};

/** Passive hooks the resolver reads. */
export interface PassiveHooks {
  critBonus?: number;
  hitBonus?: number;
  /** Counter a melee attack: always, or only one that missed. */
  counter?: "always" | "on-miss";
  healOnKillPct?: number;
  damageBelowHalfPct?: number;
  evadeFirstHitEachRound?: boolean;
  statPct?: Partial<Record<MarinaraStat, number>>;
  mpPct?: number;
  mpRegenPct?: number;
  spellDamagePct?: number;
  partySpeedPct?: number;
  partyDefensePct?: number;
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
  /** Charges/extra delay of own heavy actions (Heavy Draw): damage up, slower. */
  heavyDraw?: boolean;
  bloodlust?: boolean;
  unstoppable?: boolean;
  noPenalty?: boolean;
}

export const PASSIVES: Record<string, PassiveHooks> = {
  riposte: { counter: "on-miss" },
  "keen-edge": { critBonus: 10 },
  "second-wind": { actOnKill: true },
  bloodrage: { damageBelowHalfPct: 0.3 },
  bloodlust: { healOnKillPct: 0.1 },
  unstoppable: { unstoppable: true },
  "adaptive-grip": { hitBonus: 10, noPenalty: true },
  peerless: { extraActionEvery: 3 },
  stalwart: { defendBonusPct: 0.2 },
  "shield-wall": { backRowTakenPct: -0.2 },
  "last-stand": { lastStand: true },
  retaliate: { counter: "always" },
  "aura-of-warding": { partyMagicTakenPct: -0.35 },
  "elder-oath": { statPct: { resistance: 0.5 } },
  immovable: { unstoppable: true },
  "bulwark-aura": { frontRowDefensePct: 0.2 },
  "light-feet": { statPct: { speed: 0.1 } },
  exploit: { critBonus: 15 },
  assassinate: { assassinate: true },
  fleet: { statPct: { speed: 0.2 } },
  tailwind: { partySpeedPct: 0.1 },
  elusive: { evadeFirstHitEachRound: true },
  "perfect-evasion": { evasionStacking: 10 },
  "true-aim": { hitBonus: 15 },
  steady: { hitBonus: 5 },
  overwatch: { counter: "always" },
  tracker: { critBonus: 5 },
  "pack-tactics": { bonusVsMarked: 0.25 },
  "heavy-draw": { heavyDraw: true },
  sundering: { hitsLowerDefense: 0.1 },
  attunement: { spellDamagePct: 0.15 },
  overcharge: { critBonus: 10 },
  "spell-ward": { statPct: { resistance: 0.25 } },
  "prepared-mind": { firstSpellFree: true },
  "deep-well": { mpPct: 0.5 },
  "mana-tide": { mpRegenPct: 0.08 },
  lingering: { debuffDurationBonus: 1 },
  "ill-omen": { enemyCritToMissChance: 0.5 },
  "slow-time": { slowDebuffed: 0.25 },
  nightmare: { nightmare: true },
  null: { debuffImmune: true },
  devour: { devour: true },
  grace: { healCrit: true },
  miracle: { miracle: true },
  "item-savant": {},
  "double-dose": {},
  overheal: { overheal: true },
  sanctified: { partyMagicTakenPct: -0.25 },
  encore: { buffDurationBonus: 1 },
  tempo: { partySpeedPct: 0.1 },
  foresight: { partyDefensePct: 0.1 },
  formation: { partyDefensePct: 0.15 },
  inspire: { partyDamageWhileWhole: 0.1 },
  "fortunes-favour": { partyCritBonus: 10 },
};

// ── Units ──

export interface LabUnit {
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
  /** The class it fights as; its weapons and basic attack follow it. */
  classId?: string;
  /** Damage type of a unit with no class (a plain foe). */
  attackType?: MarinaraDamageType;
  /** Active skills and passives it fights with. */
  skills: MarinaraSkillDef[];
  /** Basic attack reaches the back row (bows, spells). */
  rangedBasic: boolean;
  /** A dummy never acts. */
  dummy?: boolean;
  level: number;
  /** Basic attack uses Magic (casters). */
  magicBasic?: boolean;
  // fight state
  next: number;
  mods: Array<{ stat: string; pct: number; turns: number; source: string }>;
  statuses: Array<{ status: NonNullable<Effect["status"]>; turns: number; power?: number }>;
  shield: number;
  covering?: string;
  provoking: number;
  /** Taunted: must target this unit while `tauntTurns` lasts. */
  tauntedBy?: string;
  tauntTurns: number;
  cooldowns: Record<string, number>;
  used: Set<string>;
  charging?: { skillId: string; targetId: string };
  lastStandUsed?: boolean;
  miracleUsed?: boolean;
  evadedThisRound?: boolean;
  missesAgainst: number;
  firstSpellUsed?: boolean;
  actions: number;
  defending: boolean;
  marked: number;
}

export function makeUnit(input: {
  id: string;
  name: string;
  side: LabUnit["side"];
  row: LabUnit["row"];
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
}): LabUnit {
  const passives = passiveHooks(input.skills ?? []);
  const maxMp = Math.round(marinaraMaxMp(input.stats) * (1 + (passives.mpPct ?? 0)));
  const maxStamina = marinaraMaxStamina(input.stats);
  const maxHp = input.hpOverride ?? Math.max(1, Math.round(input.stats.hp * TUNING.hpMultiplier));
  return {
    ...input,
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
    cooldowns: {},
    used: new Set(),
    missesAgainst: 0,
    actions: 0,
    defending: false,
    marked: 0,
  };
}

const hookCache = new WeakMap<readonly MarinaraSkillDef[], PassiveHooks>();

export function passiveHooks(skills: readonly MarinaraSkillDef[]): PassiveHooks {
  const cached = hookCache.get(skills);
  if (cached) return cached;
  const out: PassiveHooks = {};
  for (const skill of skills) {
    if (skill.kind !== "passive") continue;
    const hooks = PASSIVES[skill.id] ?? {};
    for (const [key, value] of Object.entries(hooks) as Array<[keyof PassiveHooks, unknown]>) {
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
  hookCache.set(skills, out);
  return out;
}

// ── The fight ──

export interface FightLog {
  rounds: number;
  winner: "party" | "enemy" | "timeout";
  damageDealt: Record<string, number>;
  damageTaken: Record<string, number>;
  healingDone: Record<string, number>;
  mpSpent: Record<string, number>;
  staminaSpent: Record<string, number>;
  /** Damage dealt by actions that cost MP, by actor. */
  mpSkillDamage: Record<string, number>;
  actions: Record<string, number>;
  /** Party HP lost as a share of party max HP. */
  partyHpLostPct: number;
  downed: string[];
}

export interface FightOptions {
  random: () => number;
  /** A front-row area attack hits every foe (grouped) or only the one targeted (spread out). */
  grouped: boolean;
  maxActions?: number;
}

const living = (units: LabUnit[]) => units.filter((unit) => unit.hp > 0);

export function runFight(party: LabUnit[], enemies: LabUnit[], options: FightOptions): FightLog {
  const all = [...party, ...enemies];
  const log: FightLog = {
    rounds: 0,
    winner: "timeout",
    damageDealt: {},
    damageTaken: {},
    healingDone: {},
    mpSpent: {},
    staminaSpent: {},
    mpSkillDamage: {},
    actions: {},
    partyHpLostPct: 0,
    downed: [],
  };
  const partyMax = party.reduce((sum, unit) => sum + unit.maxHp, 0);
  const partyStart = party.reduce((sum, unit) => sum + unit.hp, 0);
  for (const unit of all)
    unit.next = (TUNING.timeline / (effStat(unit, "speed", all) + TUNING.speedFloor)) * options.random();
  const maxActions = options.maxActions ?? 400;
  let total = 0;
  let clock = 0;
  while (total < maxActions) {
    if (living(enemies).length === 0) {
      log.winner = "party";
      break;
    }
    if (living(party).length === 0) {
      log.winner = "enemy";
      break;
    }
    const actor = living(all).sort((a, b) => a.next - b.next)[0]!;
    clock = actor.next;
    actor.evadedThisRound = false;
    takeTurn(actor, all, options, log);
    total++;
  }
  // A round is one turn of a Speed 15 character.
  log.rounds = clock / (TUNING.timeline / (15 + TUNING.speedFloor));
  const partyEnd = party.reduce((sum, unit) => sum + Math.max(0, unit.hp), 0);
  log.partyHpLostPct = partyMax ? Math.max(0, partyStart - partyEnd) / partyMax : 0;
  log.downed = party.filter((unit) => unit.hp <= 0).map((unit) => unit.id);
  return log;
}

function effStat(unit: LabUnit, stat: MarinaraStat, all: LabUnit[]): number {
  const own = passiveHooks(unit.skills);
  let pct = own.statPct?.[stat] ?? 0;
  for (const mod of unit.mods) if (mod.stat === stat) pct += mod.pct;
  const allies = all.filter((other) => other.side === unit.side && other.hp > 0);
  for (const ally of allies) {
    const hooks = passiveHooks(ally.skills);
    if (stat === "speed") pct += hooks.partySpeedPct ?? 0;
    if (stat === "defense") {
      pct += hooks.partyDefensePct ?? 0;
      if (unit.row === "front") pct += hooks.frontRowDefensePct ?? 0;
    }
  }
  if (stat === "speed" && unit.statuses.some((s) => s.status === "slow")) pct -= 0.3;
  if (stat === "defense" && unit.defending) pct += TUNING.defendDefensePct + (own.defendBonusPct ?? 0);
  return Math.max(0, unit.stats[stat] * (1 + pct));
}

function modTotal(unit: LabUnit, stat: string): number {
  return unit.mods.filter((mod) => mod.stat === stat).reduce((sum, mod) => sum + mod.pct, 0);
}

function addMod(unit: LabUnit, stat: string, pct: number, turns: number, source: string) {
  if (pct < 0 && passiveHooks(unit.skills).debuffImmune) return;
  const existing = unit.mods.find((mod) => mod.source === source && mod.stat === stat);
  if (existing) existing.turns = Math.max(existing.turns, turns);
  else unit.mods.push({ stat, pct, turns, source });
}

function bump(record: Record<string, number>, id: string, amount: number) {
  record[id] = (record[id] ?? 0) + amount;
}

function basicAttack(unit: LabUnit): Effect {
  return dmg(unit.magicBasic ? "magic" : "strength", TUNING.basicPower, {
    ranged: unit.rangedBasic || unit.magicBasic,
    basic: true,
    type: unit.archetype ? MARINARA_ARCHETYPE_ATTACKS[unit.archetype] : "weapon",
  });
}

/** What a skill costs this unit right now, and in which resource. */
function costOf(unit: LabUnit, skill: MarinaraSkillDef): { resource: "mp" | "stamina"; cost: number } {
  const resource = skill.resource ?? "mp";
  const free = resource === "mp" && passiveHooks(unit.skills).firstSpellFree && !unit.firstSpellUsed;
  return { resource, cost: free ? 0 : (skill.cost ?? 0) };
}

function usable(unit: LabUnit): Array<{ skill: MarinaraSkillDef | null; effect: Effect }> {
  const out: Array<{ skill: MarinaraSkillDef | null; effect: Effect }> = [{ skill: null, effect: basicAttack(unit) }];
  for (const skill of unit.skills) {
    if (skill.kind !== "active") continue;
    const base = SKILL_EFFECTS[skill.id];
    if (!base || base.kind === "none") continue;
    const effect = skill.damage ? { ...base, type: skill.damage } : base;
    const { resource, cost } = costOf(unit, skill);
    if (cost > (resource === "mp" ? unit.mp : unit.stamina)) continue;
    if ((unit.cooldowns[skill.id] ?? 0) > 0) continue;
    if (effect.oncePerFight && unit.used.has(skill.id)) continue;
    out.push({ skill, effect });
  }
  return out;
}

function targetsFor(actor: LabUnit, effect: Effect, all: LabUnit[]): LabUnit[] {
  const foes = living(all.filter((unit) => unit.side !== actor.side));
  const friends = living(all.filter((unit) => unit.side === actor.side));
  if (effect.target === "self") return [actor];
  if (effect.target === "party") return friends;
  if (effect.target === "ally") return friends;
  if (effect.target === "downed-ally") return all.filter((unit) => unit.side === actor.side && unit.hp <= 0);
  const taunter = actor.tauntTurns > 0 ? foes.find((unit) => unit.id === actor.tauntedBy) : undefined;
  if (taunter && (effect.target === "enemy" || effect.target === "front-row")) return [taunter];
  const provokers = foes.filter((unit) => unit.provoking > 0);
  if (effect.target === "enemy" && provokers.length) return provokers;
  if (effect.ranged || !TUNING.frontRowShield) return foes;
  const front = foes.filter((unit) => unit.row === "front");
  return front.length ? front : foes;
}

/** Expected damage of one hit, for choosing; the real roll happens in `strike`. */
function expectedHit(actor: LabUnit, target: LabUnit, effect: Effect, all: LabUnit[]): number {
  const { damage, hitChance, critChance } = hitNumbers(actor, target, effect, all);
  return (hitChance / 100) * damage * (1 + (critChance / 100) * (TUNING.critMultiplier - 1)) * (effect.hits ?? 1);
}

function hitNumbers(actor: LabUnit, target: LabUnit, effect: Effect, all: LabUnit[]) {
  const hooks = passiveHooks(actor.skills);
  const magic = effect.damage === "magic";
  const attackStat = effect.from ?? effect.scales ?? (magic ? "magic" : "strength");
  const guard = effStat(target, magic ? "resistance" : "defense", all) * (1 - (effect.pierce ?? 0));
  let damage =
    effStat(actor, attackStat, all) + (effect.power ?? TUNING.basicPower) + actor.level * TUNING.powerPerLevel - guard;
  let pct = modTotal(actor, "damage") + modTotal(target, "damage-taken");
  for (const ally of living(all.filter((unit) => unit.side === actor.side))) {
    const allyHooks = passiveHooks(ally.skills);
    if (allyHooks.partyDamageWhileWhole && all.filter((u) => u.side === actor.side).every((u) => u.hp > 0))
      pct += allyHooks.partyDamageWhileWhole;
  }
  if (magic) pct += hooks.spellDamagePct ?? 0;
  if (hooks.damageBelowHalfPct && actor.hp < actor.maxHp / 2) pct += hooks.damageBelowHalfPct;
  if (target.marked > 0 && hooks.bonusVsMarked) pct += hooks.bonusVsMarked;
  if (effect.finisher && target.hp < target.maxHp * effect.finisher.below) pct += effect.finisher.bonus;
  for (const ally of living(all.filter((unit) => unit.side === target.side))) {
    const allyHooks = passiveHooks(ally.skills);
    if (magic) pct += allyHooks.partyMagicTakenPct ?? 0;
    if (target.row === "back") pct += allyHooks.backRowTakenPct ?? 0;
  }
  if (hooks.heavyDraw && !magic) pct += 0.2;
  const best = marinaraBestDamageType(
    actor.classId ? marinaraDamageOptions(effect.type ?? "weapon", actor.classId) : [actor.attackType ?? "blunt"],
    target.affinities,
  );
  // A basic attack is never walled off: immune and absorb count as resist for it.
  const multiplier = effect.basic ? Math.max(best.multiplier, 0.5) : best.multiplier;
  // Absorbed damage comes out negative: it heals the target.
  damage = Math.max(TUNING.minDamage, damage * (1 + pct)) * multiplier;
  const partyCrit = living(all.filter((unit) => unit.side === actor.side)).reduce(
    (sum, ally) => sum + (passiveHooks(ally.skills).partyCritBonus ?? 0),
    0,
  );
  const evade =
    effStat(target, "speed", all) * 2 +
    effStat(target, "luck", all) +
    target.missesAgainst * (passiveHooks(target.skills).evasionStacking ?? 0);
  const hitChance = Math.max(
    5,
    Math.min(
      100,
      TUNING.hitBase +
        effStat(actor, "skill", all) * 2 +
        effStat(actor, "luck", all) / 2 +
        (effect.hitBonus ?? 0) +
        (hooks.hitBonus ?? 0) -
        evade,
    ),
  );
  const critChance = Math.max(
    0,
    Math.min(
      100,
      effStat(actor, "skill", all) / 2 +
        (effect.critBonus ?? 0) +
        (hooks.critBonus ?? 0) +
        partyCrit -
        effStat(target, "luck", all),
    ),
  );
  if (target.statuses.some((s) => s.status === "sleep")) return { damage, hitChance: 100, critChance, multiplier };
  return { damage, hitChance, critChance, multiplier };
}

/** The lab's party AI: the best expected value with simple rules for support. */
function choose(
  actor: LabUnit,
  all: LabUnit[],
): { skill: MarinaraSkillDef | null; effect: Effect; targets: LabUnit[] } | null {
  const options = usable(actor);
  const friends = living(all.filter((unit) => unit.side === actor.side));
  const foes = living(all.filter((unit) => unit.side !== actor.side));
  if (!foes.length) return null;
  const threatened = foes.some((foe) => !foe.dummy);
  let best: { skill: MarinaraSkillDef | null; effect: Effect; targets: LabUnit[]; score: number } | null = null;
  const consider = (skill: MarinaraSkillDef | null, effect: Effect, targets: LabUnit[], score: number) => {
    const weight = effect.weight ?? 1;
    const perTime = score / weight;
    const price = skill ? costOf(actor, skill) : null;
    // MP is a budget: spend it when it pays, not on trifles. Stamina comes back, so it matters less.
    const adjusted =
      perTime - (price ? price.cost * (price.resource === "mp" ? TUNING.mpCostWeight : TUNING.staminaCostWeight) : 0);
    if (!best || adjusted > best.score) best = { skill, effect, targets, score: adjusted };
  };
  for (const { skill, effect } of options) {
    const pool = targetsFor(actor, effect, all);
    if (!pool.length) continue;
    switch (effect.kind) {
      case "damage": {
        if (effect.target === "all-enemies" || effect.target === "front-row") {
          const hit = effect.target === "front-row" ? pool.filter((u) => u.row === "front") : pool;
          const struck = effect.target === "front-row" && !groupedFlag ? hit.slice(0, 1) : hit;
          const value = struck.reduce(
            (sum, target) => sum + Math.min(target.hp, expectedHit(actor, target, effect, all)),
            0,
          );
          consider(skill, effect, struck, effect.charge ? value / 2 : value);
        } else {
          for (const target of pool) {
            const value = Math.min(target.hp * 1.2, expectedHit(actor, target, effect, all));
            consider(skill, effect, [target], effect.charge ? value / 2 : value);
          }
        }
        break;
      }
      case "heal": {
        const hurt = friends.filter((u) => u.hp < u.maxHp * 0.6);
        if (!hurt.length) break;
        const amount = effStat(actor, "magic", all) * TUNING.healMagicPct + (effect.power ?? 0);
        if (effect.target === "party")
          consider(skill, effect, friends, friends.reduce((sum, u) => sum + Math.min(u.maxHp - u.hp, amount), 0) * 1.1);
        else {
          const lowest = hurt.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]!;
          consider(skill, effect, [lowest], Math.min(lowest.maxHp - lowest.hp, amount) * 1.3);
        }
        break;
      }
      case "revive": {
        const down = all.filter((u) => u.side === actor.side && u.hp <= 0);
        if (down.length) consider(skill, effect, [down[0]!], down[0]!.maxHp * (effect.power ?? 0.25) * 3);
        break;
      }
      case "shield": {
        if (!threatened) break;
        const front = friends.filter((u) => u.row === "front" && u.shield <= 0)[0];
        if (front) consider(skill, effect, [front], (effStat(actor, "magic", all) + (effect.power ?? 0)) * 0.9);
        break;
      }
      case "buff": {
        const already = (effect.target === "self" ? [actor] : friends).some((u) =>
          u.mods.some((m) => m.source === skill!.id),
        );
        if (already) break;
        if (effect.stat === "damage-taken" || effect.stat === "resistance") {
          if (!threatened) break;
          const incoming = foes.reduce((sum, foe) => sum + effStat(foe, "strength", all), 0);
          consider(
            skill,
            effect,
            effect.target === "self" ? [actor] : friends,
            incoming * Math.abs(effect.pct ?? 0) * (effect.duration ?? 1) * 0.8,
          );
        } else {
          const damagers = effect.target === "self" ? [actor] : friends;
          const dealt = damagers.reduce((sum, u) => sum + effStat(u, u.magicBasic ? "magic" : "strength", all), 0);
          consider(skill, effect, damagers, dealt * (effect.pct ?? 0) * (effect.duration ?? 1) * 0.7);
        }
        break;
      }
      case "debuff": {
        const fresh = pool.filter((u) => !u.mods.some((m) => m.source === skill!.id));
        if (!fresh.length) break;
        if ((effect.stat === "damage" || effect.stat === "speed") && !threatened) break;
        const value =
          effect.stat === "damage-taken"
            ? friends.reduce((sum, u) => sum + effStat(u, "strength", all) * 0.5, 0) *
              (effect.pct ?? 0) *
              (effect.duration ?? 1)
            : fresh.reduce((sum, foe) => sum + effStat(foe, "strength", all), 0) *
              Math.abs(effect.pct ?? 0) *
              (effect.duration ?? 1) *
              0.6;
        consider(
          skill,
          effect,
          effect.target === "all-enemies" ? fresh : [fresh.sort((a, b) => b.hp - a.hp)[0]!],
          value,
        );
        break;
      }
      case "status": {
        if (effect.status === "regen") {
          if (!threatened || friends.some((u) => u.statuses.some((s) => s.status === "regen"))) break;
          consider(
            skill,
            effect,
            friends,
            friends.reduce((s, u) => s + u.maxHp * (effect.power ?? 0.1), 0) * (effect.duration ?? 1) * 0.6,
          );
          break;
        }
        const fresh = pool.filter((u) => !u.statuses.some((s) => s.status === effect.status));
        if (!fresh.length) break;
        if ((effect.status === "sleep" || effect.status === "stun" || effect.status === "confuse") && !threatened)
          break;
        const target = fresh.sort((a, b) => b.hp - a.hp)[0]!;
        const value =
          effect.status === "poison"
            ? target.maxHp * (effect.power ?? 0.08) * (effect.duration ?? 3) * (effect.chance ?? 1)
            : effect.status === "doom"
              ? Math.min(target.hp, target.maxHp * (target.maxHp > 300 ? TUNING.doomBossPct : TUNING.doomPct)) *
                (effect.chance ?? 1) *
                0.8
              : effStat(target, "strength", all) *
                1.5 *
                (effect.duration ?? 1) *
                (effect.chance ?? 1) *
                (effect.target === "all-enemies" ? fresh.length : 1);
        consider(skill, effect, effect.target === "all-enemies" ? fresh : [target], value);
        break;
      }
      case "cover": {
        if (!threatened) break;
        const back = friends.filter(
          (u) => u.id !== actor.id && u.hp < u.maxHp * 0.5 && !friends.some((f) => f.covering === u.id),
        )[0];
        if (back) consider(skill, effect, [back], effStat(foes[0]!, "strength", all) * 1.2);
        break;
      }
      case "provoke": {
        if (!threatened || actor.provoking > 0 || friends.length < 2) break;
        consider(skill, effect, [actor], foes.reduce((s, f) => s + effStat(f, "strength", all), 0) * 0.5);
        break;
      }
      case "taunt": {
        if (!threatened || friends.length < 2) break;
        const loose = foes.filter((f) => !(f.tauntTurns > 0 && f.tauntedBy === actor.id) && !f.dummy);
        if (!loose.length) break;
        const target = loose.sort(
          (a, b) =>
            effStat(b, "strength", all) +
            effStat(b, "magic", all) -
            effStat(a, "strength", all) -
            effStat(a, "magic", all),
        )[0]!;
        consider(
          skill,
          effect,
          [target],
          Math.max(effStat(target, "strength", all), effStat(target, "magic", all)) * 1.2,
        );
        break;
      }
      case "extra-turn":
        consider(skill, effect, [actor], bestDamage(actor, all) * 0.9);
        break;
      case "command": {
        const others = friends.filter((u) => u.id !== actor.id);
        if (!others.length) break;
        const value =
          effect.target === "party"
            ? others.reduce((s, u) => s + bestDamage(u, all), 0) * 0.9
            : Math.max(...others.map((u) => bestDamage(u, all)));
        consider(
          skill,
          effect,
          effect.target === "party" ? others : [others.sort((a, b) => bestDamage(b, all) - bestDamage(a, all))[0]!],
          value,
        );
        break;
      }
    }
  }
  // Defending: worth it only when hurt and threatened.
  if (threatened && actor.hp < actor.maxHp * 0.3 && best && (best as { score: number }).score < actor.maxHp * 0.15)
    return { skill: null, effect: { kind: "buff", target: "self" }, targets: [] };
  return best;
}

let groupedFlag = true;

function bestDamage(unit: LabUnit, all: LabUnit[]): number {
  const foes = living(all.filter((u) => u.side !== unit.side));
  if (!foes.length) return 0;
  let best = 0;
  for (const { effect } of usable(unit)) {
    if (effect.kind !== "damage") continue;
    for (const target of targetsFor(unit, effect, all)) best = Math.max(best, expectedHit(unit, target, effect, all));
  }
  return best;
}

function enemyChoose(actor: LabUnit, all: LabUnit[], random: () => number) {
  const effect = basicAttack(actor);
  let pool = targetsFor(actor, effect, all);
  const confused = actor.statuses.some((s) => s.status === "confuse");
  if (confused && random() < 0.5) pool = living(all.filter((u) => u.side === actor.side && u.id !== actor.id));
  if (!pool.length) return null;
  return { skill: null, effect, targets: [pool[Math.floor(random() * pool.length)]!] };
}

function takeTurn(actor: LabUnit, all: LabUnit[], options: FightOptions, log: FightLog) {
  const { random } = options;
  groupedFlag = options.grouped;
  actor.defending = false;
  // Statuses tick at the start of the actor's turn.
  for (const status of actor.statuses) {
    if (status.status === "poison") {
      const amount = Math.max(1, Math.round(actor.maxHp * (status.power ?? 0.08)));
      actor.hp -= amount;
      bump(log.damageTaken, actor.id, amount);
    }
    if (status.status === "regen") {
      const amount = Math.round(actor.maxHp * (status.power ?? 0.1));
      actor.hp = Math.min(actor.maxHp, actor.hp + amount);
    }
    if (status.status === "doom" && status.turns === 1 && actor.hp > 0) {
      const toll = Math.min(
        actor.hp,
        Math.round(actor.maxHp * (actor.maxHp > 300 ? TUNING.doomBossPct : TUNING.doomPct)),
      );
      bump(log.damageTaken, actor.id, toll);
      actor.hp -= toll;
    }
    if (status.status === "sleep") {
      const sleepers = all.filter((u) => u.side !== actor.side && u.hp > 0 && passiveHooks(u.skills).nightmare);
      if (sleepers.length) {
        const amount = Math.round(actor.maxHp * 0.1);
        actor.hp -= amount;
        bump(log.damageTaken, actor.id, amount);
      }
    }
  }
  const hooks = passiveHooks(actor.skills);
  if (hooks.mpRegenPct) actor.mp = Math.min(actor.maxMp, actor.mp + Math.round(actor.maxMp * hooks.mpRegenPct));
  actor.stamina = Math.min(
    actor.maxStamina,
    actor.stamina + Math.max(1, Math.round(actor.maxStamina * MARINARA_STAMINA.regenPct)),
  );
  const skips = actor.statuses.some((s) => s.status === "sleep" || s.status === "stun");
  tickMods(actor, all);
  if (actor.hp <= 0) {
    if (actor.side === "party") log.downed.push(actor.id);
    return;
  }
  actor.next += (TUNING.timeline / (effStat(actor, "speed", all) + TUNING.speedFloor)) * 1;
  if (actor.provoking > 0) actor.provoking--;
  if (actor.tauntTurns > 0) actor.tauntTurns--;
  for (const id of Object.keys(actor.cooldowns)) actor.cooldowns[id] = Math.max(0, actor.cooldowns[id]! - 1);
  if (skips || actor.dummy) return;
  actor.actions++;
  bump(log.actions, actor.id, 1);
  if (actor.charging) {
    const charging = actor.charging;
    actor.charging = undefined;
    const skill = actor.skills.find((s) => s.id === charging.skillId) ?? null;
    const effect = { ...SKILL_EFFECTS[charging.skillId]!, ...(skill?.damage ? { type: skill.damage } : {}) };
    const target = all.find((u) => u.id === charging.targetId && u.hp > 0) ?? targetsFor(actor, effect, all)[0];
    if (target) act(actor, skill, { ...effect, charge: false }, [target], all, options, log);
    return;
  }
  const choice = actor.side === "party" ? choose(actor, all) : enemyChoose(actor, all, random);
  if (!choice) return;
  if (choice.effect.kind === "buff" && !choice.effect.stat) {
    actor.defending = true;
    actor.stamina = Math.min(
      actor.maxStamina,
      actor.stamina + Math.round(actor.maxStamina * MARINARA_STAMINA.defendRegenPct),
    );
    return;
  }
  const extraWeight = (choice.effect.weight ?? 1) - 1;
  actor.next += (TUNING.timeline / (effStat(actor, "speed", all) + TUNING.speedFloor)) * extraWeight;
  if (choice.skill) {
    const { resource, cost } = costOf(actor, choice.skill);
    if (resource === "mp") {
      actor.firstSpellUsed = true;
      actor.mp -= cost;
      bump(log.mpSpent, actor.id, cost);
    } else {
      actor.stamina -= cost;
      bump(log.staminaSpent, actor.id, cost);
    }
    if (choice.effect.cooldown) actor.cooldowns[choice.skill.id] = choice.effect.cooldown;
    if (choice.effect.oncePerFight) actor.used.add(choice.skill.id);
  }
  if (choice.effect.charge) {
    actor.charging = { skillId: choice.skill!.id, targetId: choice.targets[0]!.id };
    return;
  }
  const dealtBefore = log.damageDealt[actor.id] ?? 0;
  act(actor, choice.skill, choice.effect, choice.targets, all, options, log);
  if (choice.skill?.resource === "mp" && choice.skill.cost)
    bump(log.mpSkillDamage, actor.id, (log.damageDealt[actor.id] ?? 0) - dealtBefore);
  if (hooks.extraActionEvery && actor.actions % hooks.extraActionEvery === 0) {
    const again = choose(actor, all);
    if (again && again.effect.kind === "damage")
      act(actor, again.skill, again.effect, again.targets, all, options, log);
  }
}

function tickMods(unit: LabUnit, all: LabUnit[]) {
  for (const mod of unit.mods) mod.turns--;
  unit.mods = unit.mods.filter((mod) => mod.turns > 0);
  for (const status of unit.statuses) status.turns--;
  const expired = unit.statuses.filter((s) => s.turns <= 0);
  unit.statuses = unit.statuses.filter((s) => s.turns > 0);
  if (expired.length) {
    for (const foe of all.filter((u) => u.side !== unit.side && u.hp > 0)) {
      if (passiveHooks(foe.skills).devour) foe.hp = Math.min(foe.maxHp, foe.hp + Math.round(foe.maxHp * 0.05));
    }
  }
  if (unit.marked > 0) unit.marked--;
}

function act(
  actor: LabUnit,
  skill: MarinaraSkillDef | null,
  effect: Effect,
  targets: LabUnit[],
  all: LabUnit[],
  options: FightOptions,
  log: FightLog,
) {
  const { random } = options;
  const hooks = passiveHooks(actor.skills);
  const durationBonus =
    effect.kind === "debuff" || effect.kind === "status"
      ? (hooks.debuffDurationBonus ?? 0)
      : effect.kind === "buff"
        ? (hooks.buffDurationBonus ?? 0)
        : 0;
  switch (effect.kind) {
    case "damage": {
      for (const target of targets) {
        for (let i = 0; i < (effect.hits ?? 1); i++) {
          if (target.hp <= 0) break;
          strike(actor, target, effect, all, options, log, true);
        }
      }
      if (effect.selfDebuff)
        addMod(actor, effect.selfDebuff.stat, effect.selfDebuff.pct, effect.selfDebuff.duration, `${skill?.id}:self`);
      break;
    }
    case "heal": {
      for (const target of targets) {
        let amount = effStat(actor, "magic", all) * TUNING.healMagicPct + (effect.power ?? 0);
        if (hooks.healCrit && random() < 0.15) amount *= 1.5;
        const before = target.hp;
        target.hp = Math.min(target.maxHp, target.hp + amount);
        if (hooks.overheal) target.shield += Math.max(0, before + amount - target.maxHp) * 0.5;
        bump(log.healingDone, actor.id, target.hp - before);
      }
      break;
    }
    case "revive": {
      const target = targets[0];
      if (target && target.hp <= 0) {
        target.hp = Math.round(target.maxHp * (effect.power ?? 0.25));
        bump(log.healingDone, actor.id, target.hp);
      }
      break;
    }
    case "shield": {
      for (const target of targets) target.shield += effStat(actor, "magic", all) + (effect.power ?? 0);
      break;
    }
    case "buff":
      for (const target of targets)
        addMod(target, effect.stat!, effect.pct ?? 0, (effect.duration ?? 1) + durationBonus, skill?.id ?? "buff");
      break;
    case "debuff":
      for (const target of targets) {
        addMod(target, effect.stat!, effect.pct ?? 0, (effect.duration ?? 1) + durationBonus, skill?.id ?? "debuff");
        if (skill?.id === "mark-prey") target.marked = (effect.duration ?? 3) + durationBonus;
      }
      break;
    case "status":
      for (const target of targets) {
        if (effect.status !== "regen" && random() > (effect.chance ?? 1)) continue;
        target.statuses.push({
          status: effect.status!,
          turns: (effect.duration ?? 2) + durationBonus,
          power: effect.power,
        });
      }
      break;
    case "cover":
      actor.covering = targets[0]?.id;
      break;
    case "provoke":
      actor.provoking = effect.duration ?? 2;
      break;
    case "taunt":
      for (const target of targets) {
        target.tauntedBy = actor.id;
        target.tauntTurns = effect.duration ?? 2;
      }
      break;
    case "extra-turn":
      actor.next -= TUNING.timeline / (effStat(actor, "speed", all) + TUNING.speedFloor);
      break;
    case "command":
      for (const target of targets) {
        const choice = choose(target, all);
        if (choice && choice.effect.kind !== "command")
          act(target, choice.skill, choice.effect, choice.targets, all, options, log);
      }
      break;
  }
}

function strike(
  actor: LabUnit,
  target: LabUnit,
  effect: Effect,
  all: LabUnit[],
  options: FightOptions,
  log: FightLog,
  canBeCountered: boolean,
) {
  const { random } = options;
  // Cover: a guard steps in front of the ally it covers.
  const coverer = living(all.filter((u) => u.side === target.side && u.covering === target.id))[0];
  if (coverer && effect.target === "enemy") {
    coverer.covering = undefined;
    target = coverer;
  }
  const targetHooks = passiveHooks(target.skills);
  if (targetHooks.evadeFirstHitEachRound && !target.evadedThisRound) {
    target.evadedThisRound = true;
    return;
  }
  const { damage, hitChance, critChance, multiplier } = hitNumbers(actor, target, effect, all);
  const hooks = passiveHooks(actor.skills);
  if (multiplier < 0) {
    target.hp = Math.min(target.maxHp, target.hp - damage);
    return;
  }
  if (random() * 100 >= hitChance) {
    target.missesAgainst++;
    if (canBeCountered && !effect.ranged && targetHooks.counter && target.hp > 0)
      strike(target, actor, basicAttack(target), all, options, log, false);
    return;
  }
  let crit = random() * 100 < critChance;
  if (crit) {
    const foeOmen = living(all.filter((u) => u.side === target.side)).some(
      (u) => passiveHooks(u.skills).enemyCritToMissChance,
    );
    if (foeOmen && random() < 0.5) crit = false;
  }
  let amount = Math.round(damage * (crit ? TUNING.critMultiplier : 1));
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, amount);
    target.shield -= absorbed;
    amount -= absorbed;
  }
  if (hooks.assassinate && crit && target.hp - amount < target.maxHp * 0.15 && target.maxHp <= 300) amount = target.hp;
  const before = target.hp;
  target.hp -= amount;
  if (target.hp <= 0 && targetHooks.lastStand && !target.lastStandUsed) {
    target.lastStandUsed = true;
    target.hp = 1;
  }
  const dealt = before - Math.max(0, target.hp);
  bump(log.damageDealt, actor.id, dealt);
  bump(log.damageTaken, target.id, dealt);
  if (effect.onHit) addMod(target, effect.onHit.stat, effect.onHit.pct, effect.onHit.duration, `onhit:${actor.id}`);
  if (hooks.hitsLowerDefense) addMod(target, "defense", -hooks.hitsLowerDefense, 2, `sunder:${actor.id}`);
  if (target.statuses.some((s) => s.status === "sleep"))
    target.statuses = target.statuses.filter((s) => s.status !== "sleep");
  if (target.hp <= 0) {
    target.hp = 0;
    if (hooks.healOnKillPct) actor.hp = Math.min(actor.maxHp, actor.hp + Math.round(actor.maxHp * hooks.healOnKillPct));
    if (hooks.actOnKill) actor.next -= (TUNING.timeline / (effStat(actor, "speed", all) + TUNING.speedFloor)) * 0.5;
    const savior = living(all.filter((u) => u.side === target.side)).find(
      (u) => passiveHooks(u.skills).miracle && !u.miracleUsed,
    );
    if (savior && target.side === "party") {
      savior.miracleUsed = true;
      target.hp = Math.round(target.maxHp * 0.3);
    }
    return;
  }
  if (canBeCountered && !effect.ranged && targetHooks.counter === "always")
    strike(target, actor, basicAttack(target), all, options, log, false);
}

export { MARINARA_STATS };
