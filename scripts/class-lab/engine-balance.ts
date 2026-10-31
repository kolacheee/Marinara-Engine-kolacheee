/**
 * Engine balance: Classic Marinara fights run through the combat director with the Engine's own combat
 * AI playing both sides (the leader too), so encounter tiers are judged with what plays them.
 *
 *   node packages/server/node_modules/tsx/dist/cli.mjs scripts/class-lab/engine-balance.ts [fights] [style]
 */
import {
  commandCombatDirector,
  createCombatDirector,
  type CombatDirectorState,
} from "../../packages/server/src/services/game/combat-director.service.js";
import {
  marinaraAiAction,
  marinaraCombatant,
} from "../../packages/server/src/services/game/marinara-director.service.js";
import {
  MARINARA_ARCHETYPES,
  MARINARA_PARTY_TEMPERAMENTS,
  awardMarinaraXp,
  createMarinaraProgression,
  marinaraRandom,
  setMarinaraClass,
  marinaraOpenClasses,
  type MarinaraArchetype,
  type MarinaraProgression,
} from "../../packages/shared/src/features/marinara-classes.js";
import {
  buildMarinaraEnemy,
  buildMarinaraPartyFighter,
  type MarinaraEnemyTier,
} from "../../packages/shared/src/features/marinara-combat.js";

const count = Number(process.argv[2] ?? 40);
const style = (process.argv[3] ?? "classic") as "classic" | "tactical";

/** A character grown to a level in their primary tree, promoting at 10 and 20 to a random line. */
function grown(seed: string, primary: MarinaraArchetype, level: number): MarinaraProgression {
  const random = marinaraRandom(seed);
  const temperament = MARINARA_PARTY_TEMPERAMENTS[Math.floor(random() * MARINARA_PARTY_TEMPERAMENTS.length)]!;
  let p = createMarinaraProgression({ seed, primary, temperament });
  for (let at = 2; at <= level; at++) {
    p = awardMarinaraXp(p, 100, random).progression;
    const classLevel = p.classLevels[p.activeClass] ?? 1;
    if (classLevel === 10 || classLevel === 20) {
      const next = marinaraOpenClasses(p).filter(
        (def) => def.from === p.activeClass && def.archetype === primary && p.classLevels[def.id] === undefined,
      );
      if (next.length) p = setMarinaraClass(p, next[Math.floor(random() * next.length)]!.id);
    }
  }
  return p;
}

const PARTIES: MarinaraArchetype[][] = [
  ["blade", "guard", "channeler", "mender"],
  ["scout", "marksman", "hexer", "herald"],
  ["guard", "blade", "marksman", "mender"],
  ["blade", "scout", "channeler", "hexer"],
];
const FOE_KINDS: MarinaraArchetype[] = [...MARINARA_ARCHETYPES];

function fight(seed: number, level: number, tiers: MarinaraEnemyTier[]): CombatDirectorState {
  const kinds = PARTIES[seed % PARTIES.length]!;
  const party = kinds.map((primary, i) =>
    buildMarinaraPartyFighter({
      id: `p${i}`,
      name: `${primary}${i}`,
      progression: grown(`b:${seed}:${i}`, primary, level),
    }),
  );
  const random = marinaraRandom(`foes:${seed}`);
  const foes = tiers.map((tier, i) =>
    buildMarinaraEnemy({
      id: `e${i}`,
      name: `foe${i}`,
      archetype: FOE_KINDS[Math.floor(random() * FOE_KINDS.length)]!,
      level,
      tier,
      enemySkills: [["rend", "sunder", "venom-arrow", "curse"][i % 4]!],
    }),
  );
  return createCombatDirector({
    id: `b${seed}`,
    anchor: "a",
    party: party.map((f) => marinaraCombatant(f)),
    enemies: foes.map((f) => marinaraCombatant(f)),
    style,
    gm: false,
    difficulty: "normal",
    seed,
    marinara: [...party, ...foes],
  });
}

function playOut(s: CombatDirectorState) {
  for (let step = 0; step < 3000 && !s.outcome; step++) {
    if (s.stage === "action" && s.actorId) {
      const unit = [...s.party, ...s.enemies].find((u) => u.id === s.actorId)!;
      commandCombatDirector(s, {
        type: "classic",
        action: marinaraAiAction(s.marinara!, unit, s.round, "normal", false),
      });
    } else if (s.window) commandCombatDirector(s, { type: "fallback" }, "fallback");
    else commandCombatDirector(s, { type: "continue" });
  }
  return s;
}

const ENCOUNTERS: Array<[string, MarinaraEnemyTier[]]> = [
  ["4 standard (Normal budget)", ["standard", "standard", "standard", "standard"]],
  ["2 elite (Normal budget)", ["elite", "elite"]],
  ["1 boss (Normal budget)", ["boss"]],
  ["boss + 2 minions (Hard)", ["boss", "minion", "minion"]],
  ["5 standard + 1 minion (Hard)", ["standard", "standard", "standard", "standard", "standard", "minion"]],
];
const rows: string[] = [
  "| Level | Encounter | Party wins | Rounds | Party HP lost | Downed |",
  "| --- | --- | --- | --- | --- | --- |",
];
for (const level of [1, 5, 10, 20, 30]) {
  for (const [label, tiers] of ENCOUNTERS) {
    let wins = 0,
      rounds = 0,
      lost = 0,
      downed = 0;
    for (let n = 0; n < count; n++) {
      const s = playOut(fight(level * 1000 + n, level, tiers));
      if (s.outcome === "victory") wins++;
      rounds += s.round;
      const max = s.party.reduce((sum, u) => sum + u.maxHp, 0);
      lost += s.party.reduce((sum, u) => sum + (u.maxHp - u.hp), 0) / max;
      downed += s.party.filter((u) => u.hp <= 0).length;
    }
    rows.push(
      `| ${level} | ${label} | ${((wins / count) * 100).toFixed(0)}% | ${(rounds / count).toFixed(1)} | ${((lost / count) * 100).toFixed(0)}% | ${(downed / count).toFixed(1)} |`,
    );
  }
}
console.log(rows.join("\n"));
