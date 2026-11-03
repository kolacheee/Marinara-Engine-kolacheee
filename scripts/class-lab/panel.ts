/**
 * Playtester panel CLI (thread "Run a Haiku playtester panel on classes", 2026-11-01).
 * One tester's game lives in a state directory: a random party (names, descriptions, temperaments),
 * the classes and rows the tester picks, and real fights through the Engine's own Classic / Tactical
 * director, foes from the bestiary and played by the Engine's AI. The tester plays its own party's
 * Classic turns from the same action menu a player gets (or hands a turn to the Engine's AI).
 *
 *   tsx scripts/class-lab/panel.ts <dir> <command> [...args]     (run with no command for help)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import {
  commandCombatDirector,
  createCombatDirector,
  marinaraBoardTurn,
  type CombatDirectorState,
} from "../../packages/server/src/services/game/combat-director.service.js";
import {
  marinaraActionChoices,
  marinaraAiAction,
} from "../../packages/server/src/services/game/marinara-director.service.js";
import {
  marinaraFightEnd,
  marinaraFightStart,
} from "../../packages/server/src/services/game/marinara-fight-start.service.js";
import {
  MARINARA_ARCHETYPES,
  MARINARA_CARRY_SLOTS,
  MARINARA_CLASSES,
  MARINARA_PARTY_TEMPERAMENTS,
  MARINARA_TEMPERAMENT_TREES,
  MARINARA_ARCHETYPE_TRAITS,
  awardMarinaraXp,
  marinaraClass,
  marinaraClassBlock,
  marinaraLearnedSkills,
  marinaraOpenClasses,
  marinaraRandom,
  marinaraTrees,
  marinaraUsableSkills,
  setMarinaraCarried,
  setMarinaraClass,
  type MarinaraArchetype,
  type MarinaraPartyTemperament,
} from "../../packages/shared/src/features/marinara-classes.js";
import {
  createMarinaraCardProgression,
  marinaraPartyFighter,
  readMarinaraCardProgression,
  type MarinaraCardProgression,
} from "../../packages/shared/src/features/marinara-party.js";
import {
  MARINARA_BESTIARY_SETTINGS,
  marinaraBuildEncounter,
  marinaraEnemyFamily,
  marinaraEnemyName,
  type MarinaraBestiarySetting,
  type MarinaraEncounterDifficulty,
} from "../../packages/shared/src/features/marinara-bestiary.js";
import type { TacticalUnit } from "../../packages/shared/src/features/tactical-combat/types.js";
import {
  marinaraAmmoChoices,
  marinaraCanChannel,
  marinaraChannelChoices,
  marinaraChanneled,
  marinaraUsable,
} from "../../packages/shared/src/features/marinara-combat.js";
import { keepFightReasons } from "./reasons-log.js";
import { marinaraItemPlace } from "../../packages/shared/src/features/marinara-items.js";
import { isImpassable } from "../../packages/shared/src/features/tactical-combat/math.js";
import type { Combatant } from "../../packages/shared/src/index.js";

process.stdout.on("error", () => process.exit(0));
const [dir, cmd, ...args] = process.argv.slice(2);
if (!dir) {
  console.log("usage: panel.ts <dir> <command> ...");
  process.exit(1);
}
mkdirSync(dir, { recursive: true });
const GAME = `${dir}/game.json`;
const FIGHT = `${dir}/fight.json`;
const LOG = `${dir}/history.log`;
// Structured data (round 4, 2026-11-03): every recorded fight event, every AI pick's reasons, and one
// summary line per fight, so skills and classes can be rated from numbers, not only from prose.
const EVENTS = `${dir}/events.jsonl`;
const REASONS = `${dir}/reasons.jsonl`;
const FIGHTS = `${dir}/fights.jsonl`;
// Standard setup (playtest thread r41): the party's bags hold every element of ammunition plus Serrated.
const AMMO = ["fire", "ice", "lightning", "wood", "earth", "water", "metal", "wind"];

interface Member {
  name: string;
  description: string;
  temperament: MarinaraPartyTemperament;
  marinara?: MarinaraCardProgression;
  row?: "front" | "back";
}
interface Game {
  seed: string;
  setting: MarinaraBestiarySetting;
  members: Member[];
  fights: number;
  record: Array<{ n: number; style: string; level: number; difficulty: string; boss: boolean; outcome: string; rounds: number }>;
}
interface Fight {
  n: number;
  style: "classic" | "tactical";
  difficulty: string;
  boss: boolean;
  placing: boolean;
  seenLog: number;
  /** Units whose ammunition a tester loaded by hand; the panel never reloads these. */
  handAmmo?: string[];
  s: CombatDirectorState;
  cards: Record<string, unknown>[];
  seed: number;
}

const load = (): Game => JSON.parse(readFileSync(GAME, "utf8"));
const save = (g: Game) => writeFileSync(GAME, JSON.stringify(g));
const loadFight = (): Fight | null => (existsSync(FIGHT) ? JSON.parse(readFileSync(FIGHT, "utf8")) : null);
const saveFight = (f: Fight | null) => writeFileSync(FIGHT, f ? JSON.stringify(f) : "null");
const say = (text: string) => {
  console.log(text);
  appendFileSync(LOG, text + "\n");
};
const member = (g: Game, name: string) => {
  const m = g.members.find((one) => one.name.toLowerCase() === (name ?? "").toLowerCase());
  if (!m) throw new Error(`No party member "${name}". Party: ${g.members.map((one) => one.name).join(", ")}`);
  return m;
};
const cls = (id: string) => marinaraClass(id)?.label ?? id;

// ── Random party ──
const NAMES = [
  "Aldric", "Brisa", "Corwin", "Dagny", "Elowen", "Fenn", "Garrick", "Hesper", "Isolde", "Jory", "Kael", "Liora",
  "Mireth", "Nadia", "Orrin", "Perrin", "Quenna", "Rasmus", "Saoirse", "Tobin", "Ulla", "Varis", "Wren", "Yusuf",
  "Zara", "Ansel", "Bryony", "Cassius", "Delphine", "Emrys",
];
const DESCRIPTIONS = [
  "A former soldier who still wakes before dawn.",
  "A runaway noble with a quick tongue and quicker hands.",
  "A temple acolyte who left the cloister to see the world.",
  "A trapper from the northern woods, quiet and watchful.",
  "A scholar obsessed with old ruins and forbidden texts.",
  "A street performer who knows every song in three kingdoms.",
  "A blacksmith's daughter who can lift an anvil.",
  "A disgraced knight trying to earn back a name.",
  "A herbalist who is kinder to plants than to people.",
  "A sellsword who counts every coin twice.",
  "A ship's navigator who reads the stars and the weather.",
  "A grave-keeper's apprentice who isn't afraid of the dead.",
  "An orphan raised by a band of smugglers.",
  "A wandering monk with a calm smile and hard fists.",
  "A hedge-witch's grandchild with strange dreams.",
  "A courier who has never once been late.",
];

function newGame(seed: string) {
  const r = marinaraRandom(`panel:${seed}`);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)]!;
  const size = 3 + Math.floor(r() * 3); // 3-5
  const names = new Set<string>();
  while (names.size < size) names.add(pick(NAMES));
  const descs = new Set<string>();
  while (descs.size < size) descs.add(pick(DESCRIPTIONS));
  const ds = [...descs];
  const members: Member[] = [...names].map((name, i) => ({
    name,
    description: ds[i]!,
    temperament: pick(MARINARA_PARTY_TEMPERAMENTS),
  }));
  const g: Game = { seed, setting: pick(MARINARA_BESTIARY_SETTINGS.filter((s) => s !== "modern_day")), members, fights: 0, record: [] };
  save(g);
  saveFight(null);
  say(`New game (seed ${seed}), setting ${g.setting}. Your party of ${size}:`);
  for (const m of members)
    say(`  ${m.name} - "${m.description}" Temperament: ${m.temperament} -> secondary tree ${MARINARA_TEMPERAMENT_TREES[m.temperament]}.`);
  say(
    `\nEach character has two class trees: a PRIMARY tree you pick freely, and a SECONDARY tree set by their temperament.` +
      ` If you pick the same tree as primary, they are "Pure": one tree only, but its pure-only branch opens.` +
      `\nTrees: ${MARINARA_ARCHETYPES.join(", ")}. See \`classes\` for every class, skill and passive.` +
      `\nNext: \`pick <name> <primaryTree> [startingBaseClass]\` for each member, then \`row\`, then \`fight\`.`,
  );
}

// ── Class catalogue ──
function catalogue(only?: string) {
  for (const arch of MARINARA_ARCHETYPES) {
    if (only && only !== arch) continue;
    const temps = Object.entries(MARINARA_TEMPERAMENT_TREES)
      .filter(([, t]) => t === arch)
      .map(([k]) => k);
    console.log(`\n=== ${arch.toUpperCase()} tree (secondary for temperaments: ${temps.join(", ")}) ===`);
    const traits = MARINARA_ARCHETYPE_TRAITS[arch];
    if (traits) console.log(`  Tree traits kept by every class in this tree once learned: ${traits.join(", ")}`);
    for (const def of MARINARA_CLASSES.filter((d) => d.archetype === arch)) {
      const from = def.from ? ` <- promotes from ${cls(def.from)} at class level ${def.tier === "advanced" ? 10 : 20}` : " (base class)";
      console.log(`  [${def.id}] ${def.label} - ${def.tier}${def.pure ? ", PURE only" : ""}${from}. Role: ${def.role}. Grows: ${def.leans.join("/")}${def.row ? `. Row: ${def.row}` : ""}`);
      for (const s of [...def.skills].sort((a, b) => a.learnedAt - b.learnedAt))
        console.log(
          `     L${s.learnedAt} ${s.kind === "active" ? "ACTIVE" : "passive"} ${s.label}${s.cost ? ` (${s.cost} ${s.resource})` : ""}${s.carryPick ? " [good to carry]" : ""}: ${s.summary}`,
        );
    }
  }
}

// ── Party ──
function show(g: Game) {
  console.log(`Setting ${g.setting}. Fights so far: ${g.fights}.`);
  for (const m of g.members) {
    const p = m.marinara;
    if (!p) {
      console.log(`- ${m.name}: no class yet (temperament ${m.temperament}; secondary tree ${MARINARA_TEMPERAMENT_TREES[m.temperament]})`);
      continue;
    }
    const trees = marinaraTrees(p.primary, p.temperament);
    const def = marinaraClass(p.activeClass)!;
    console.log(
      `- ${m.name}: Level ${p.level}, class ${def.label} (class level ${p.classLevels[p.activeClass]}), trees ${trees.primary}${trees.secondary ? ` + ${trees.secondary}` : " (Pure)"}, row ${m.row ?? "default"}${p.fallen ? " FALLEN" : ""}`,
    );
    console.log(`    fight HP ${marinaraPartyFighter("x", m.name, p).maxHp} (the stat line's HP is the base stat, scaled by level in fights)`);
    console.log(`    stats ${Object.entries(p.stats).map(([k, v]) => `${k} ${Math.round(v)}`).join(", ")}`);
    console.log(`    trained: ${Object.entries(p.classLevels).map(([id, l]) => `${cls(id)} ${l}`).join(", ")}`);
    console.log(`    fights with: ${marinaraUsableSkills(p).map((s) => `${s.label}${s.kind === "passive" ? " (passive)" : ""}${s.classId !== p.activeClass ? ` [carried from ${cls(s.classId)}]` : ""}`).join("; ") || "basic attack only"}`);
    const open = marinaraOpenClasses(p).filter((d) => p.classLevels[d.id] === undefined);
    const ready = open.filter((d) => !marinaraClassBlock(p, d.id));
    if (ready.length) console.log(`    CAN TAKE NOW: ${ready.map((d) => `${d.label} [${d.id}]`).join(", ")}`);
    const later = open.filter((d) => marinaraClassBlock(p, d.id) === "class-level");
    if (later.length) console.log(`    later (needs class level): ${later.map((d) => `${d.label} <- ${cls(d.from!)}`).join(", ")}`);
  }
}

function pickPrimary(g: Game, name: string, primary: string, start?: string) {
  const m = member(g, name);
  if (m.marinara && m.marinara.level > 1) throw new Error(`${m.name} already started; use switch instead.`);
  if (!(MARINARA_ARCHETYPES as readonly string[]).includes(primary)) throw new Error(`Unknown tree ${primary}. Trees: ${MARINARA_ARCHETYPES.join(", ")}`);
  let p = createMarinaraCardProgression({
    gameId: `panel:${g.seed}`,
    card: { name: m.name, shortDescription: m.description },
    temperament: m.temperament,
    primary: primary as MarinaraArchetype,
  });
  if (start && start !== p.activeClass) p = setMarinaraClass(p, start) as MarinaraCardProgression;
  m.marinara = p;
  save(g);
  const t = marinaraTrees(p.primary, p.temperament);
  say(`${m.name}: primary ${t.primary}${t.secondary ? `, secondary ${t.secondary}` : " (Pure)"}; starts as ${cls(p.activeClass)}.`);
}

function grow(g: Game, to: number) {
  if (to > 30) { say("Level cap is 30; growing to 30."); to = 30; }
  if (g.members.some((m) => !m.marinara)) throw new Error("Pick a primary tree for everyone first.");
  for (const m of g.members) {
    let p = m.marinara!;
    if (p.fallen) continue;
    const random = marinaraRandom(`panel-grow:${g.seed}:${m.name}:${p.level}`);
    while (p.level < to) p = awardMarinaraXp(p, 100, random).progression as MarinaraCardProgression;
    m.marinara = p;
  }
  save(g);
  say(`Party trained up to level ${to} (each in their current class).`);
  show(g);
}

function setClass(g: Game, name: string, classId: string) {
  const m = member(g, name);
  const before = m.marinara!.activeClass;
  m.marinara = setMarinaraClass(m.marinara!, classId) as MarinaraCardProgression;
  save(g);
  say(`${m.name}: ${cls(before)} -> ${cls(classId)} (class level ${m.marinara.classLevels[classId]}).`);
}

function setCarry(g: Game, name: string, ids: string[]) {
  const m = member(g, name);
  const p = m.marinara!;
  const learned = marinaraLearnedSkills(p).filter((s) => s.classId !== p.activeClass);
  const resolved = ids.map((id) => learned.find((s) => s.id === id || s.label.toLowerCase() === id.toLowerCase())?.id ?? id);
  // One refused id (a tree trait, an unknown skill) skips only that id, with its reason; the rest still carry.
  let kept: string[] = [];
  let next = p;
  for (const id of resolved) {
    try {
      next = setMarinaraCarried(p, [...kept, id]) as MarinaraCardProgression;
      kept = [...kept, id];
    } catch (e) {
      say(`  skipped ${id}: ${(e as Error).message}`);
    }
  }
  m.marinara = kept.length ? next : (setMarinaraCarried(p, []) as MarinaraCardProgression);
  save(g);
  say(`${m.name} carries: ${kept.join(", ") || "nothing"} (max ${MARINARA_CARRY_SLOTS}).`);
}

function carryable(g: Game, name: string) {
  const m = member(g, name);
  const p = m.marinara!;
  console.log(`${m.name} can carry (learned in other classes, up to ${MARINARA_CARRY_SLOTS}):`);
  for (const s of marinaraLearnedSkills(p).filter((s) => s.classId !== p.activeClass))
    console.log(`  [${s.id}] ${s.label} (${s.kind}, from ${cls(s.classId)})${p.carried.includes(s.id) ? " CARRIED" : ""}: ${s.summary}`);
}

// ── Fights ──
function unitLine(s: CombatDirectorState, f: NonNullable<CombatDirectorState["marinara"]>["fighters"][number]) {
  const st = f.statuses.length ? ` [${f.statuses.map((x) => `${x.status} ${x.turns}`).join(", ")}]` : "";
  const res = f.maxMp ? ` MP ${f.mp}/${f.maxMp}` : "";
  const sta = f.maxStamina ? ` Sta ${Math.round(f.stamina)}/${f.maxStamina}` : "";
  const pos = s.tactical ? (() => { const u = s.tactical!.units.find((x) => x.id === f.id); return u ? ` at (${u.x},${u.y})` : ""; })() : ` ${f.row}`;
  return `${f.name}${f.classId ? ` (${cls(f.classId)} L${f.level})` : ` (L${f.level}${f.tier ? ` ${f.tier}` : ""})`}${pos}: HP ${Math.max(0, Math.round(f.hp))}/${f.maxHp}${f.shield > 0 ? ` +${Math.round(f.shield)} shield` : ""}${res}${sta}${st}${f.hp <= 0 ? " DOWN" : ""}`;
}
function status(s: CombatDirectorState) {
  const fs = s.marinara!.fighters;
  console.log(`-- Round ${s.round} --`);
  console.log("Party:");
  for (const f of fs.filter((x) => x.side === "party")) console.log("  " + unitLine(s, f));
  console.log("Foes:");
  for (const f of fs.filter((x) => x.side !== "party")) console.log("  " + unitLine(s, f));
}
function board(s: CombatDirectorState) {
  const t = s.tactical!;
  const grid = t.grid;
  const at = new Map(t.units.filter((u) => u.hp > 0).map((u) => [`${u.x},${u.y}`, u]));
  const letters = new Map<string, string>();
  t.units.filter((u) => u.side === "party").forEach((u, i) => letters.set(u.id, String(i + 1)));
  t.units.filter((u) => u.side !== "party").forEach((u, i) => letters.set(u.id, String.fromCharCode(97 + (i % 26))));
  console.log(`Board ${grid.width}x${grid.height} (x right, y down). Digits = your party, letters = foes, # impassable (wall/mountain/water), F forest (cover, slow), r ruins (cover), . open.`);
  console.log("    " + Array.from({ length: grid.width }, (_, x) => x % 10).join(""));
  for (let y = 0; y < grid.height; y++) {
    let line = `${String(y).padStart(3)} `;
    for (let x = 0; x < grid.width; x++) {
      const u = at.get(`${x},${y}`);
      if (u) line += letters.get(u.id);
      else {
        const tile = String(grid.tiles[y]![x]);
        line += isImpassable(grid, x, y) || grid.outside?.[y]?.[x] ? "#" : tile === "forest" ? "F" : tile === "ruin" ? "r" : ".";
      }
    }
    console.log(line);
  }
  for (const u of t.units) console.log(`  ${letters.get(u.id)} = ${u.name}${u.hp <= 0 ? " (down)" : ""}`);
}

const DEPLOY_COLS = 3;
function blockedTile(s: CombatDirectorState, x: number, y: number) {
  const g = s.tactical!.grid;
  if (x < 0 || y < 0 || x >= g.width || y >= g.height) return true;
  return isImpassable(g, x, y) || !!g.outside?.[y]?.[x];
}

function startFight(g: Game, style: "classic" | "tactical", difficulty: MarinaraEncounterDifficulty, boss: boolean) {
  if (loadFight()) throw new Error("A fight is already running; finish it (act/auto) first.");
  if (g.members.some((m) => !m.marinara)) throw new Error("Pick a primary tree for everyone first.");
  const n = g.fights + 1;
  const key = `panel:${g.seed}:fight${n}`;
  const random = marinaraRandom(key);
  const alive = g.members.filter((m) => !m.marinara!.fallen);
  const level = Math.round(alive.reduce((a, m) => a + m.marinara!.level, 0) / alive.length);
  const built = marinaraBuildEncounter({ setting: g.setting, party: { level, size: alive.length }, difficulty, random, boss: boss && level >= 5 });
  const enemies = built.foes.map((foe, i) => {
    const family = marinaraEnemyFamily(foe.familyId)!;
    return {
      id: `e${i}`,
      name: marinaraEnemyName(family, g.setting, foe.level) ?? foe.familyId,
      hp: 50, maxHp: 50, attack: 5, defense: 5, speed: 5, level: foe.level, skills: [], side: "enemy",
      ...(foe.tier === "boss" ? { boss: { points: 0 } } : {}),
      marinara: { family: { familyId: foe.familyId, tier: foe.tier, level: foe.level }, tier: foe.tier },
    };
  });
  const names = new Map<string, number>();
  for (const e of enemies) names.set(e.name, (names.get(e.name) ?? 0) + 1);
  const count = new Map<string, number>();
  for (const e of enemies) if (names.get(e.name)! > 1) { const k = (count.get(e.name) ?? 0) + 1; count.set(e.name, k); e.name = `${e.name} ${"ABCDEF"[k - 1]}`; }
  const cards = alive.map((m) => ({ name: m.name, shortDescription: m.description, marinara: m.marinara }));
  const party = alive.map((m, i) => ({ id: `p${i}`, name: m.name, side: "player", hp: 1, maxHp: 1, attack: 1, defense: 1, speed: 1, level: 1, skills: [] }));
  const start = marinaraFightStart({
    gameId: `panel:${g.seed}`,
    cards,
    party: party as unknown as Combatant[],
    enemies: enemies as unknown as Combatant[],
    difficulty: "normal",
    storyFight: false,
    setting: g.setting,
    encounter: difficulty,
    ammo: AMMO as never,
    woundingAmmo: true,
  });
  // The player's row choice.
  for (const f of start.fighters) {
    if (f.side !== "party") continue;
    const m = alive.find((one) => one.name === f.name);
    if (m?.row) f.row = m.row;
  }
  const seed = Math.floor(random() * 2 ** 31);
  // The player takes control of every companion in Classic (the director's `control` command), from
  // before the first round, so the tester plays each member's turn; Tactical stays with the Engine's AI.
  if (style === "classic") for (const u of start.party) (u as { controller?: string }).controller = "manual";
  const s = createCombatDirector({
    id: key, anchor: "a", party: start.party, enemies: start.enemies, style, gm: false, difficulty: "normal", seed,
    ...(style === "tactical" ? { battlefield: { size: start.enemies.length + start.party.length > 8 ? "medium" : "small" } as never } : {}),
    marinara: start.fighters,
    marinaraPlace: marinaraItemPlace(g.setting),
  });
  // Tactical: the Engine's AI runs the whole party, as AI companions (so they channel and load ammunition
  // themselves); the director's Tactical default is hand-run companions.
  if (style === "tactical") for (const u of s.party) (u as { controller?: string }).controller = "ai";
  const fight: Fight = { n, style, difficulty, boss, placing: style === "tactical", seenLog: 0, s, cards, seed };
  say(`\n=== Fight ${n}: ${style}, ${difficulty}${boss ? ", boss" : ""}, party level ${level}, ${g.setting} ===`);
  if (start.notes.length) say(`Notes: ${start.notes.join(" ")}`);
  for (const f of start.fighters.filter((x) => x.side !== "party"))
    say(`  Foe: ${f.name} (level ${f.level}${f.tier ? `, ${f.tier}` : ""}${f.familyId ? `, ${f.familyId}` : ""}) HP ${f.maxHp}${f.enemySkills?.length ? `, abilities: ${f.enemySkills.join(", ")}` : ""}`);
  if (style === "tactical") {
    board(s);
    console.log(`\nPlace your party: \`place <name> <x> <y>\` (any open tile in columns 0-${DEPLOY_COLS - 1}), then \`go\`. Tactical turns are played by the Engine's AI for your party (like companions), so placement is your main choice; watch the log.`);
    saveFight(fight);
    return;
  }
  saveFight(fight);
  advance(g, fight);
}

function newLines(f: Fight) {
  const lines = f.s.log.filter((l) => l.id > f.seenLog);
  if (lines.length) f.seenLog = Math.max(...lines.map((l) => l.id));
  return lines.filter((l) => l.kind !== "phase" || /Round/.test(l.text)).map((l) => `  ${l.text}`);
}

/**
 * The party leader stays hand-run in the director, so on the Tactical board (and under `auto`) the panel
 * channels for a Channeler leader as an AI companion would: the element most living foes are weakest to.
 */
function leadChannel(s: CombatDirectorState, unitId: string) {
  const f = s.marinara?.fighters.find((x) => x.id === unitId);
  if (!f || f.side !== "party" || !f.channelManual || f.channeledThisTurn || !marinaraCanChannel(f)) return;
  const foes = s.marinara!.fighters.filter((x) => x.side !== "party" && x.hp > 0);
  const mult = (a: string | undefined) => (a === "weak" ? 1.5 : a === "resist" ? 0.5 : a === "immune" ? 0 : a === "absorb" ? -1 : 1);
  const score = (el: string) => foes.reduce((sum, foe) => sum + mult((foe.affinities as Record<string, string> | undefined)?.[el]), 0);
  const best = [...marinaraChannelChoices(f)].sort((a, b) => score(b) - score(a))[0];
  if (!best || best === marinaraChanneled(f) || score(best) <= score(marinaraChanneled(f))) return;
  try { commandCombatDirector(s, { type: "channelElement", unitId, element: best } as never); } catch {}
}

type Tag = "player" | "auto" | "engine";
/** Every command goes through here: it taps the fight's events and AI reasons into the tester's files. */
function run(f: Fight, command: Parameters<typeof commandCombatDirector>[1], tag: Tag, source?: string) {
  const s = f.s;
  if (s.marinara) s.marinara.eventTap ??= [];
  try {
    if (source) commandCombatDirector(s, command, source as never);
    else commandCombatDirector(s, command);
  } finally {
    flush(f, tag);
  }
}
function flush(f: Fight, tag: Tag) {
  const m = f.s.marinara;
  if (!m) return;
  const all = [...m.fighters, ...(m.left ?? [])];
  const who = (id?: string) => all.find((x) => x.id === id);
  const head = { fight: f.n, style: f.style, difficulty: f.difficulty, boss: f.boss, round: f.s.round, tag };
  const ev = m.eventTap ?? [];
  if (ev.length) {
    appendFileSync(
      EVENTS,
      ev.map((e) => {
        const a = who(e.actorId);
        const t = who(e.targetId);
        return JSON.stringify({ ...head, ...e, actor: a?.name, actorSide: a?.side, actorClass: a?.classId ?? a?.familyId, target: t?.name, targetSide: t?.side, targetHp: t ? Math.round(t.hp) : undefined });
      }).join("\n") + "\n",
    );
    m.eventTap = [];
  }
  const rs = m.aiReasons ?? [];
  if (rs.length) {
    appendFileSync(
      REASONS,
      rs.map((r) => { const a = who(r.unitId); return JSON.stringify({ ...head, round: r.round, unit: a?.name, side: a?.side, cls: a?.classId ?? a?.familyId, text: r.text }); }).join("\n") + "\n",
    );
    (f as Fight & { reasons?: unknown[] }).reasons = [...((f as Fight & { reasons?: unknown[] }).reasons ?? []), ...rs];
    m.aiReasons = [];
  }
}

/** The Tactical leader stays hand-run, so the panel loads a Marksman leader's ammunition as the AI would. */
function leadAmmo(s: CombatDirectorState, unitId: string, f: Fight) {
  const fi = s.marinara?.fighters.find((x) => x.id === unitId);
  if (!fi || fi.side !== "party" || !fi.ammoOwned || fi.ammoAuto || f.handAmmo?.includes(unitId)) return;
  const foes = s.marinara!.fighters.filter((x) => x.side !== "party" && x.hp > 0);
  const mult = (a: string | undefined) => (a === "weak" ? 1.5 : a === "resist" ? 0.5 : a === "immune" ? 0 : a === "absorb" ? -1 : 1);
  const score = (el: string) => foes.reduce((sum, foe) => sum + mult((foe.affinities as Record<string, string> | undefined)?.[el]), 0);
  const best = [...marinaraAmmoChoices(fi)].sort((a, b) => score(b) - score(a))[0];
  if (!best || best === fi.ammoLoaded) return;
  try { run(f, { type: "loadAmmo", unitId, ammo: best } as never, "engine"); } catch {}
}

/** Runs foes (and, in Tactical or under `auto`, the party) until a party decision or the end. */
function advance(g: Game, f: Fight, autoParty = 0) {
  const s = f.s;
  let autoLeft = autoParty;
  for (let steps = 0; steps < 6000 && !s.outcome; steps++) {
    // The director keeps only its last 240 log lines; print as we go so a long run loses nothing.
    if (steps % 20 === 0) for (const line of newLines(f)) say(line);
    if (s.mercy) break;
    if (s.tactical) {
      if (s.stage === "action" && s.actorId) {
        const unit = s.tactical.units.find((u) => u.id === s.actorId) as TacticalUnit;
        leadChannel(s, unit.id);
        leadAmmo(s, unit.id, f);
        run(f, { type: "tactical", action: marinaraBoardTurn(s, unit) as never }, "engine");
      } else if (s.window) run(f, { type: "fallback" }, "engine", "fallback");
      else if (s.stage === "select") {
        const next = s.tactical.units.filter((u) => u.side === "party" && u.hp > 0 && !u.hasActed);
        let begun = false;
        for (const one of next)
          try { run(f, { type: "begin", unitId: one.id }, "engine"); begun = true; break; } catch {}
        if (!begun) {
          if (next.length) run(f, { type: "tactical", action: { type: "endTurn" } as never }, "engine");
          else run(f, { type: "continue" }, "engine");
        }
      } else run(f, { type: "continue" }, "engine");
      continue;
    }
    if (s.stage === "action" && s.actorId) {
      const unit = [...s.party, ...s.enemies].find((u) => u.id === s.actorId)!;
      const ours = s.party.some((u) => u.id === unit.id);
      if (ours && autoLeft === 0) break;
      if (ours && autoLeft > 0) autoLeft--;
      if (ours) leadChannel(s, unit.id);
      const action = marinaraAiAction(s.marinara!, unit, s.round, "normal", false);
      run(f, { type: "classic", action }, ours ? "auto" : "engine");
    } else if (s.window) run(f, { type: "fallback" }, "engine", "fallback");
    else run(f, { type: "continue" }, "engine");
  }
  for (const line of newLines(f)) say(line);
  if (s.outcome) return finish(g, f);
  if (s.round > 60) say("(Fight passed round 60.)");
  saveFight(f);
  status(s);
  if (s.mercy) {
    const names = s.mercy.foeIds.map((id) => s.marinara!.fighters.find((x) => x.id === id)?.name ?? id);
    console.log(`\nOnly foes who yielded are left: ${names.join(", ")}. Choose \`mercy spare\` (accept the surrender) or \`mercy finish\` (finish them off).`);
    return;
  }
  if (s.tactical) return;
  menu(f);
}

function menu(f: Fight) {
  const s = f.s;
  const actor = s.marinara!.fighters.find((x) => x.id === s.actorId)!;
  const choices = marinaraActionChoices(s.marinara!, actor.id);
  const name = (id?: string) => s.marinara!.fighters.find((x) => x.id === id)?.name ?? id;
  console.log(`\n${actor.name}'s turn (${cls(actor.classId ?? "")}, ${actor.row} row). Choose with \`act <number>\`, or \`auto\` to let the Engine's AI take this turn, \`auto all\` for the rest of the fight:`);
  if (actor.ammoOwned?.length)
    console.log(`  (Free action: \`ammo <type>\` loads ammunition for shots. Loaded: ${actor.ammoLoaded ?? "none (weapon's own type)"}. Owned: ${marinaraAmmoChoices(actor).join(", ")}${actor.ammoWounds ? "; Serrated shots also wound" : ""}.)`);
  // Self / party / all-foes skills fire untargeted: the menu must not name a target for them (round 3 harness bug).
  const untargeted = new Set(
    marinaraUsable(actor, s.marinara!.fighters)
      .filter((o) => o.effect.target === "self" || o.effect.target === "party" || o.effect.target === "all-enemies")
      .map((o) => o.id ?? "__attack"),
  );
  if (marinaraCanChannel(actor))
    console.log(`  (Bonus action: \`channel <element>\` before choosing. Now: ${marinaraChanneled(actor)}. Choices: ${marinaraChannelChoices(actor).join(", ")} (arcane = unchanneled raw magic).)`);
  choices.forEach((c, i) => {
    const a = c.action as { type: string; skillId?: string; targetId?: string };
    const skill = a.skillId ? actor.skills.find((sk) => sk.id === a.skillId) : undefined;
    const what = a.type === "defend" ? "Defend" : a.type === "attack" ? "Attack" : (c.label ?? skill?.label ?? a.skillId);
    const cost = skill?.cost ? ` (${skill.cost} ${skill.resource})` : "";
    const aimless = untargeted.has(a.skillId ?? (a.type === "attack" ? "__attack" : ""));
    const aim = a.targetId && a.type !== "defend" ? (aimless ? (a.type === "skill" ? " (no target needed)" : "") : ` -> ${name(a.targetId)}`) : "";
    console.log(`  ${i + 1}. ${what}${cost}${aim}${skill ? ` - ${skill.summary}` : ""}`);
  });
}

function act(g: Game, f: Fight, n: number) {
  const s = f.s;
  const actor = s.marinara!.fighters.find((x) => x.id === s.actorId)!;
  const choices = marinaraActionChoices(s.marinara!, actor.id);
  const c = choices[n - 1];
  if (!c) throw new Error(`No choice ${n}.`);
  run(f, { type: "classic", action: c.action }, "player");
  advance(g, f);
}

function place(g: Game, f: Fight, name: string, x: number, y: number) {
  if (!f.placing) throw new Error("Placement is over.");
  const t = f.s.tactical!;
  const u = t.units.find((one) => one.side === "party" && one.name.toLowerCase() === name.toLowerCase());
  if (!u) throw new Error(`No party unit ${name}.`);
  if (x >= DEPLOY_COLS) throw new Error(`Deploy in columns 0-${DEPLOY_COLS - 1}.`);
  if (blockedTile(f.s, x, y)) throw new Error("That tile is blocked.");
  const other = t.units.find((one) => one !== u && one.x === x && one.y === y);
  if (other) { other.x = u.x; other.y = u.y; }
  u.x = x;
  u.y = y;
  saveFight(f);
  say(`${u.name} placed at (${x},${y})${other ? ` (swapped with ${other.name})` : ""}.`);
}

function finish(g: Game, f: Fight) {
  const s = f.s;
  status(s);
  const ended = marinaraFightEnd({ state: s.marinara!, outcome: s.outcome!, cards: f.cards, seed: f.seed, permadeath: false });
  say(`\n*** Fight ${f.n} over: ${s.outcome} after ${s.round} rounds. ***`);
  const credit = s.marinara!.credit;
  for (const fi of s.marinara!.fighters.filter((x) => x.side === "party"))
    say(`  ${fi.name}: damage ${Math.round(credit[fi.id]?.damage ?? 0)}, support ${Math.round(credit[fi.id]?.support ?? 0)}, ended at HP ${Math.max(0, Math.round(fi.hp))}/${fi.maxHp}`);
  for (const gr of ended.growth)
    say(`  ${gr.name}: +${Math.round(gr.xp)} XP${gr.levelUps.length ? `, level up to ${gr.level}` : ""}${gr.promotionReady ? " - PROMOTION READY" : ""}`);
  for (const card of ended.cards ?? f.cards) {
    const m = g.members.find((one) => one.name === card.name);
    const p = readMarinaraCardProgression(card.marinara);
    if (m && p) m.marinara = p;
  }
  flush(f, "engine");
  const reasons = (f as Fight & { reasons?: NonNullable<NonNullable<CombatDirectorState["marinara"]>["aiReasons"]> }).reasons ?? [];
  try {
    keepFightReasons(`panel-${dir.split("/").pop()}`, `panel:${g.seed}:fight${f.n}:${f.style}:${f.difficulty}${f.boss ? ":boss" : ""}`, { ...s, marinara: { ...s.marinara!, aiReasons: reasons } } as CombatDirectorState);
  } catch (e) { console.error(`[reasons] ${(e as Error).message}`); }
  const fs = [...s.marinara!.fighters, ...(s.marinara!.left ?? [])];
  appendFileSync(FIGHTS, JSON.stringify({
    fight: f.n, style: f.style, difficulty: f.difficulty, boss: f.boss, outcome: s.outcome, rounds: s.round, setting: g.setting,
    party: fs.filter((x) => x.side === "party").map((x) => {
      const m = g.members.find((one) => one.name === x.name);
      const p = m?.marinara;
      const t = p ? marinaraTrees(p.primary, p.temperament) : undefined;
      return {
        name: x.name, cls: x.classId, level: x.level, classLevel: p?.classLevels[p.activeClass], primary: t?.primary, secondary: t?.secondary ?? null,
        temperament: m?.temperament, row: x.row, carried: p?.carried ?? [], skills: x.skills.map((k) => k.id),
        damage: Math.round(credit[x.id]?.damage ?? 0), support: Math.round(credit[x.id]?.support ?? 0), hp: Math.max(0, Math.round(x.hp)), maxHp: x.maxHp,
      };
    }),
    foes: fs.filter((x) => x.side !== "party").map((x) => ({ name: x.name, family: x.familyId, tier: x.tier, level: x.level, maxHp: x.maxHp, hp: Math.max(0, Math.round(x.hp)), yielded: !!x.yielded })),
  }) + "\n");
  const level = Math.round(g.members.reduce((a, m) => a + m.marinara!.level, 0) / g.members.length);
  g.fights = f.n;
  g.record.push({ n: f.n, style: f.style, level, difficulty: f.difficulty, boss: f.boss, outcome: s.outcome!, rounds: s.round });
  save(g);
  saveFight(null);
}

// ── Commands ──
try {
  const g = cmd === "new" ? null : existsSync(GAME) ? load() : null;
  const need = () => { if (!g) throw new Error("No game here; run `new <seed>` first."); return g; };
  switch (cmd) {
    case "new": newGame(args[0] ?? dir); break;
    case "classes": catalogue(args[0]); break;
    case "party": show(need()); break;
    case "pick": pickPrimary(need(), args[0]!, args[1]!, args[2]); break;
    case "row": { const gg = need(); const m = member(gg, args[0]!); if (args[1] !== "front" && args[1] !== "back") throw new Error("row <name> front|back"); m.row = args[1]; save(gg); say(`${m.name} will fight in the ${args[1]} row (Classic).`); break; }
    case "grow": grow(need(), Number(args[0])); break;
    case "promote":
    case "switch": setClass(need(), args[0]!, args[1]!); break;
    case "carry": setCarry(need(), args[0]!, args.slice(1)); break;
    case "carryable": carryable(need(), args[0]!); break;
    case "fight": startFight(need(), (args[0] as "classic" | "tactical") ?? "classic", (args[1] as MarinaraEncounterDifficulty) ?? "normal", args[2] === "boss"); break;
    case "status": { const f = loadFight(); if (!f) { console.log("No fight running."); break; } if (f.s.tactical) board(f.s); status(f.s); if (!f.s.tactical) menu(f); break; }
    case "act": { const f = loadFight(); if (!f || f.s.tactical) throw new Error("No Classic fight waiting on you."); act(need(), f, Number(args[0])); break; }
    case "auto": {
      const f = loadFight();
      if (!f) throw new Error("No fight running.");
      if (f.s.tactical) throw new Error("Tactical: use `go`.");
      advance(need(), f, args[0] === "all" ? 1e9 : 1);
      break;
    }
    case "place": { const f = loadFight(); if (!f) throw new Error("No fight running."); place(need(), f, args[0]!, Number(args[1]), Number(args[2])); break; }
    case "board": { const f = loadFight(); if (!f?.s.tactical) throw new Error("No Tactical fight."); board(f.s); break; }
    case "go": { const f = loadFight(); if (!f?.s.tactical) throw new Error("No Tactical fight."); f.placing = false; board(f.s); advance(need(), f); break; }
    case "mercy": {
      const f = loadFight();
      if (!f?.s.mercy) throw new Error("No foe is waiting on mercy.");
      if (args[0] !== "spare" && args[0] !== "finish") throw new Error("mercy spare|finish");
      say(`You choose to ${args[0] === "spare" ? "spare" : "finish off"} the foes who yielded.`);
      run(f, { type: "mercy", choice: args[0] } as never, "player");
      advance(need(), f);
      break;
    }
    case "channel": {
      const f = loadFight();
      if (!f || f.s.tactical || !f.s.actorId) throw new Error("No Classic turn waiting on you.");
      run(f, { type: "channelElement", unitId: f.s.actorId, element: args[0] } as never, "player");
      for (const line of newLines(f)) say(line);
      saveFight(f);
      menu(f);
      break;
    }
    case "ammo": {
      const f = loadFight();
      if (!f || f.s.tactical || !f.s.actorId) throw new Error("No Classic turn waiting on you.");
      run(f, { type: "loadAmmo", unitId: f.s.actorId, ammo: args[0] } as never, "player");
      f.handAmmo = [...new Set([...(f.handAmmo ?? []), f.s.actorId])];
      for (const line of newLines(f)) say(line);
      saveFight(f);
      menu(f);
      break;
    }
    case "record": console.log(JSON.stringify(need().record, null, 1)); break;
    default:
      console.log(`Commands:
  new <seed>                         random party
  classes [tree]                     every class, skill and passive (trees: ${MARINARA_ARCHETYPES.join(", ")})
  party                              your party, classes, skills, what they can take
  pick <name> <tree> [baseClassId]   primary tree (and optionally start in the secondary tree's base class)
  row <name> front|back              Classic row
  grow <level>                       train the party up to a level in their current classes
  promote|switch <name> <classId>    take a promotion / switch class (outside fights)
  carryable <name> / carry <name> <skillId...>   carried skills (max ${MARINARA_CARRY_SLOTS})
  fight classic|tactical easy|normal|hard|deadly [boss]
  act <n> / auto / auto all          Classic turns
  channel <element>                  Channeler bonus action on their turn
  ammo <type>                        Marksman: load owned ammunition (free action, stays loaded)
  mercy spare|finish                 when only surrendered foes are left
  place <name> <x> <y> / board / go  Tactical placement, then the Engine plays it out
  status / record`);
  }
} catch (error) {
  console.log(`ERROR: ${(error as Error).message}`);
  process.exitCode = 1;
}
