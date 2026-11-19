// ──────────────────────────────────────────────
// Creature lairs (owner 2026-11-18, "Creature lairs: design"): a site whose holder is one great creature,
// not a band. Its deepest floor is built round that creature (a dragon's hoard, a lich's sanctum), and a
// fight there is fought in its lair. Whether a site is a lair is drawn from its seed when its maps are laid
// out (so the lair floor is part of the building from the first), and it wakes only where the land is
// dangerous enough for a boss (band 5 and up); elsewhere it is a cold lair, its maker long gone. The story
// can make one with `[site: lair=<kind>]`. Pure and seeded.
// ──────────────────────────────────────────────
import { marinaraRandom, type MarinaraArchetype } from "../marinara-classes.js";
import type { MarinaraBestiarySetting } from "../marinara-bestiary.js";
import {
  buildMarinaraEnemy,
  registerMarinaraEnemySkills,
  type MarinaraEffect,
  type MarinaraFighter,
} from "../marinara-combat.js";

export const DUNGEON_LAIR_KINDS = ["hoard", "sanctum", "haven", "den", "breach", "drowned", "hive"] as const;
export type DungeonLairKind = (typeof DUNGEON_LAIR_KINDS)[number];

/** The least level a lair's maker fights at: a boss (no legendary or lair powers below level 5). */
export const DUNGEON_LAIR_MIN_LEVEL = 5;

export interface DungeonLairSpec {
  kind: DungeonLairKind;
  /** What the Game Master and the map call it. */
  label: string;
  /** Who makes the lair, first that can live at the site's band. */
  makers: readonly string[];
  /** Who serves it on the floors above, first that can live there. */
  servants: readonly string[];
  /** The kinds of place it takes over, by the site's origin, with how likely each picks it. */
  origins: Readonly<Record<string, number>>;
  /** Its maker's own title by setting, where the family's own names do not say it (a lich is a shade's
   *  deathless sorcerer). */
  titles?: Partial<Record<MarinaraBestiarySetting, string>> & { default?: string };
  /** What the land round it shows, for the Game Master (regional effects). */
  region: string;
  /** What the lair does in a fight there, for the Game Master and the fight. */
  field: string;
}

export const DUNGEON_LAIRS: Readonly<Record<DungeonLairKind, DungeonLairSpec>> = {
  hoard: {
    kind: "hoard",
    label: "a dragon's hoard",
    makers: ["drake"],
    servants: ["cultist", "lout", "stalker", "sellsword"],
    origins: { cave: 3, mine: 2, keep: 1 },
    region:
      "Within a day's walk the land knows it: scorched ridges and bones of cattle, herds gone thin, no birdsong near the mouth, villages paying tribute or hiding.",
    field:
      "The hoard's heap is cover and the cavern's roof is cracked: the dragon's lair can bring stone down on a group, choke the air with smoke heavy with the dragon's dread, or send the gold sliding underfoot.",
  },
  sanctum: {
    kind: "sanctum",
    label: "a lich's sanctum",
    makers: ["shade"],
    servants: ["bones", "grave-duelist", "cultist", "gorger"],
    origins: { crypt: 3, temple: 2, ruin: 1 },
    titles: {
      high_fantasy: "Lich",
      wuxia_xianxia: "Corpse Immortal",
      modern_supernatural: "Deathless Sorcerer",
      space_opera: "Undying Archon",
      post_apocalyptic: "Deathless Prophet",
      default: "Deathless Sorcerer",
    },
    region:
      "Round it the land is wrong: graves found opened, a cold that does not lift at noon, animals that will not cross the old road, dreams of a voice reading names.",
    field:
      "Its ward stones pulse with death, its circle binds whoever stands in it, and the dead in the walls answer it: the sanctum can drain the living, hold a fighter fast or feed its master from the dead.",
  },
  haven: {
    kind: "haven",
    label: "a vampire's haven",
    makers: ["night-courtier"],
    servants: ["night-courtier", "cutpurse", "sellsword", "gnawer"],
    origins: { manor: 3, keep: 2, crypt: 1 },
    region:
      "Near it people go missing a few at a time, the pale ones who come back will not say where they were, rats and bats are bold, and nobody goes out after dark.",
    field:
      "Mist pours along the floor, the shadows answer its master and its thralls know every door: the haven can hide its lord in mist, set the shadows on the party or drink from the living for it.",
  },
  den: {
    kind: "den",
    label: "a great beast's den",
    makers: ["great-beast", "stalker"],
    servants: ["hound", "stalker", "gnawer"],
    origins: { cave: 3, mine: 1 },
    region:
      "Trees clawed bare far round, trails trampled wide, carcasses dragged off whole: hunters and herders stay away, and smaller beasts have fled the land.",
    field:
      "The den is the beast's own ground: bones that shift and trip, a pool it drives prey into, a way out it knows and the party does not.",
  },
  breach: {
    kind: "breach",
    label: "a fiend's breach",
    makers: ["fiend"],
    servants: ["cultist", "fiend", "adept"],
    origins: { temple: 3, ruin: 2, crypt: 1 },
    region:
      "Milk sours and wells turn bitter round it, people bargain for things they did not want, fires burn green, and a cult gathers in the villages.",
    field:
      "The rift where the altar stood burns and pulls: the breach can scorch those near it, drag a fighter toward it, or open to let something else through.",
  },
  drowned: {
    kind: "drowned",
    label: "a drowned hall",
    makers: ["tide-spirit", "serpent"],
    servants: ["serpent", "gel", "tide-spirit"],
    origins: { cave: 2, sewer: 2, crypt: 1 },
    region:
      "The water round it goes still and dark, nets come up empty or come up wrong, and people near it wake from dreams of drowning.",
    field:
      "Its master's own water fills the hall: the pool can surge across the floor, drag a fighter under, rise to slow the party, or give back the drowned dead to fight for it.",
  },
  hive: {
    kind: "hive",
    label: "a hive",
    makers: ["stinger"],
    servants: ["stinger", "gnawer", "cultist"],
    origins: { cave: 2, sewer: 2, mine: 2, ruin: 1 },
    titles: { default: "Brood Queen" },
    region:
      "The land round it is fouled: swarms on the wind, crops eaten in a night, sickness in the villages, and the hum carries for miles at dusk.",
    field:
      "The hive's walls crawl: it can loose a swarm on a group, seal a way with its resin, or call the brood to its queen.",
  },
};

/** How many sites in a hundred are lairs, of the kinds of place a lair can take. */
const LAIR_CHANCE = 12.5;

/** Whether a site is a lair, and of what, from its kind of place and its seed: about one in eight of the
 *  places some lair can take, the same every time. */
export function dungeonLairFor(origin: string, seed: string | number): DungeonLairKind | null {
  const random = marinaraRandom(`${seed}:lair`);
  if (random() * 100 >= LAIR_CHANCE) return null;
  const kinds = DUNGEON_LAIR_KINDS.flatMap((kind) => {
    const weight = DUNGEON_LAIRS[kind].origins[origin] ?? 0;
    return weight > 0 ? [{ kind, weight }] : [];
  });
  if (!kinds.length) return null;
  let roll = random() * kinds.reduce((sum, one) => sum + one.weight, 0);
  for (const one of kinds) if ((roll -= one.weight) <= 0) return one.kind;
  return kinds.at(-1)!.kind;
}

/** A lair's maker's title in a setting, where its kind gives one. */
export function dungeonLairTitle(kind: DungeonLairKind, setting: MarinaraBestiarySetting): string | undefined {
  const titles = DUNGEON_LAIRS[kind].titles;
  return titles?.[setting] ?? titles?.default;
}

/** `[site: lair=hoard]` (or a word for it: dragon, lich, vampire, beast, fiend, drowned, hive) in a reply:
 *  the story made the place the party is on a creature's lair. */
const LAIR_WORDS: Record<string, DungeonLairKind> = {
  hoard: "hoard",
  dragon: "hoard",
  sanctum: "sanctum",
  lich: "sanctum",
  haven: "haven",
  vampire: "haven",
  den: "den",
  beast: "den",
  breach: "breach",
  fiend: "breach",
  demon: "breach",
  drowned: "drowned",
  hive: "hive",
  brood: "hive",
};
export function readGameDungeonLairTag(text: string): DungeonLairKind | null {
  const match = /\[site:\s*lair\s*=\s*"?([a-z]+)"?\s*\]/iu.exec(text);
  return match ? (LAIR_WORDS[match[1]!.toLowerCase()] ?? null) : null;
}

/** What a lair's great chamber has in it, by kind: the hoard's heap of gold, the sanctum's ring of ward
 *  stones, the haven's coffins, the den's bones, the breach's rift, the drowned hall's pool, the hive's comb. */
export const DUNGEON_LAIR_FEATURE_WORDS: Readonly<Record<DungeonLairKind, string>> = {
  hoard: "the hoard itself, a heap of coins and plate in the middle of the cavern (cover, and it slides underfoot)",
  sanctum: "a ring of ward stones round the middle of the chamber (whoever stands inside it is bound)",
  haven: "coffins along the far wall, earth from its grave in them (its resting place: mist gathers there)",
  den: "gnawed bones heaped along the walls and spread over the floor (they shift and trip)",
  breach: "the rift, a burning crack across the chamber floor where the altar stood (it scorches and pulls)",
  drowned: "a deep pool filling most of the hall, a rim of wet stone round it (it drags the unwary under)",
  hive: "comb of resin crusting the walls, cells of brood in it (it seals ways and wakes the swarm)",
};

/**
 * The cells of a lair's great chamber that hold its feature, from the chamber's open floor cells (indexes
 * into a map `width` wide) and its doors: the hoard heaped far from the door, the sanctum's ward stones in a
 * ring, the haven's coffins along the far wall, the den's bones by the walls, the breach's rift across the
 * middle, the drowned hall's pool, the hive's comb on the walls. `walls` says which cells touch a wall.
 * Pure and seeded.
 */
export function dungeonLairFeature(input: {
  kind: DungeonLairKind;
  width: number;
  /** The chamber's open floor cells, free of props, stairs and doors. */
  cells: readonly number[];
  doors: readonly number[];
  walls: (cell: number) => boolean;
  seed: string | number;
}): number[] {
  const { kind, width, cells } = input;
  if (cells.length < 6) return [];
  const random = marinaraRandom(`${input.seed}:lair-feature:${kind}`);
  const xy = (c: number) => [c % width, Math.floor(c / width)] as const;
  const cx = cells.reduce((sum, c) => sum + xy(c)[0], 0) / cells.length;
  const cy = cells.reduce((sum, c) => sum + xy(c)[1], 0) / cells.length;
  const fromMid = (c: number) => Math.hypot(xy(c)[0] - cx, xy(c)[1] - cy);
  const fromDoor = (c: number) =>
    Math.min(99, ...input.doors.map((d) => Math.abs(xy(d)[0] - xy(c)[0]) + Math.abs(xy(d)[1] - xy(c)[1])));
  const xs = cells.map((c) => xy(c)[0]);
  const ys = cells.map((c) => xy(c)[1]);
  const spanX = Math.max(...xs) - Math.min(...xs) + 1;
  const spanY = Math.max(...ys) - Math.min(...ys) + 1;
  const near = (from: number, n: number) =>
    [...cells]
      .sort(
        (p, q) =>
          Math.hypot(xy(p)[0] - xy(from)[0], xy(p)[1] - xy(from)[1]) -
          Math.hypot(xy(q)[0] - xy(from)[0], xy(q)[1] - xy(from)[1]),
      )
      .slice(0, n);
  switch (kind) {
    case "hoard": {
      // A heap a quarter of the floor, round the open cell farthest from the doors, off the walls.
      // Off the walls, and better well inside the chamber (a cave's chamber runs on round corners).
      const inSet = new Set(cells);
      const deep = cells.filter((c) =>
        [-1, 0, 1].every((dy) =>
          [-1, 0, 1].every((dx) => inSet.has(c + dy * width + dx) && inSet.has(c + 2 * dy * width + 2 * dx)),
        ),
      );
      const open = deep.length >= 4 ? deep : cells.filter((c) => !input.walls(c));
      const middle = [...(open.length ? open : cells)].sort(
        (p, q) => fromDoor(q) - fromDoor(p) || fromMid(p) - fromMid(q),
      );
      const heart = middle[Math.floor(random() * Math.min(3, middle.length))]!;
      // Never against a wall: a heap cut flat by the wall read as cropped (lair panels 3-5, hoard-keep).
      // At most twenty cells, so a wide chamber leaves floor to fight round the heap (lair panel 12 check:
      // the widened cave chamber was all heap).
      return near(heart, Math.max(4, Math.min(20, Math.round(cells.length * 0.3)))).filter((c) => !input.walls(c));
    }
    case "sanctum": {
      // A ring, every other cell a stone, round the middle.
      const r = Math.max(1.5, Math.min(spanX, spanY) / 3);
      return cells.filter((c) => Math.abs(fromMid(c) - r) < 0.55 && (xy(c)[0] + xy(c)[1]) % 2 === 0);
    }
    case "haven": {
      // Coffins along the far wall from the doors, one cell apart.
      const along = cells.filter((c) => input.walls(c)).sort((p, q) => fromDoor(q) - fromDoor(p));
      const out: number[] = [];
      for (const c of along) {
        if (out.length >= 5) break;
        if (out.every((o) => Math.abs(xy(o)[0] - xy(c)[0]) + Math.abs(xy(o)[1] - xy(c)[1]) >= 2)) out.push(c);
      }
      return out;
    }
    case "den": {
      // Bones heaped by the walls and strewn over the floor, and its nest of them, far from the doors (lair
      // panel 1: a few strewn bones read as any cave).
      const far = [...cells].filter((c) => !input.walls(c)).sort((p, q) => fromDoor(q) - fromDoor(p))[0];
      const nest = new Set(far !== undefined ? near(far, Math.max(4, Math.round(cells.length * 0.14))) : []);
      // Strewn bones keep near the nest (lair panel 2: bones over the whole chamber read as litter).
      const byNest = (c: number) =>
        far !== undefined &&
        Math.hypot(xy(c)[0] - xy(far)[0], xy(c)[1] - xy(far)[1]) <= Math.max(4, Math.sqrt(cells.length) * 0.6);
      return cells.filter(
        (c) => nest.has(c) || (byNest(c) && (input.walls(c) ? random() < 0.4 : random() < 0.12) && fromDoor(c) > 1),
      );
    }
    case "breach": {
      // A crack across the long way of the chamber, wandering a cell either side of the middle line.
      const long = spanX >= spanY;
      let drift = 0;
      const out: number[] = [];
      const key = (c: number) => (long ? xy(c)[0] : xy(c)[1]);
      const across = (c: number) => (long ? xy(c)[1] - cy : xy(c)[0] - cx);
      const steps = [...new Set(cells.map(key))].sort((a, b) => a - b).slice(1, -1);
      for (const step of steps) {
        if (random() < 0.35) drift += random() < 0.5 ? -1 : 1;
        drift = Math.max(-1, Math.min(1, drift));
        // Two cells wide where the floor allows (lair panel 1: one cell read as a seam, not a rift).
        for (const off of [drift, drift + (drift > 0 ? -1 : 1)]) {
          const at = cells.find((c) => key(c) === step && Math.round(across(c)) === off);
          if (at !== undefined && fromDoor(at) > 1) out.push(at);
        }
      }
      return out;
    }
    case "drowned":
      // A pool over the middle, a rim of stone kept round it to walk.
      return cells.filter(
        (c) =>
          !input.walls(c) &&
          fromDoor(c) > 2 &&
          fromMid(c) < Math.max(1.5, Math.min(spanX, spanY) * 0.46 + random() * 0.6),
      );
    case "hive": {
      // Comb grown over the walls two cells deep, broken only where it thins (lair panel 1: clumps of one
      // cell read as squares, not a hive).
      const inSet = new Set(cells);
      const byWall = (c: number) =>
        input.walls(c) || [c - 1, c + 1, c - width, c + width].some((n) => inSet.has(n) && input.walls(n));
      return cells.filter(
        (c) =>
          byWall(c) &&
          fromDoor(c) > 1 &&
          (input.walls(c) || (Math.floor(xy(c)[0] / 3) + Math.floor(xy(c)[1] / 3)) % 4 !== 0),
      );
    }
  }
}

// ── Lair actions in a Classic fight (owner 2026-11-18: MRPG combat is turn-based in its own instance, so the
// lair's field is carried into it) ──

/** What a lair action calls up in a Classic fight: fresh minions on its maker's side, at most `count` of
 *  them standing at once (more than that and the action falls back to its effect). */
export interface DungeonLairSummon {
  name: string;
  archetype: MarinaraArchetype;
  count: number;
}

/** A lair action: what the lair does once a round, on its maker's side, while its maker stands. */
type LairAction = MarinaraEffect & {
  label: string;
  summon?: DungeonLairSummon;
  /** Seals the chamber's ways out for this many rounds: nobody flees (the hive's resin). */
  seals?: number;
};

const strike = (power: number, type: MarinaraEffect["type"], extra: Partial<MarinaraEffect> = {}): MarinaraEffect => ({
  kind: "damage",
  target: "all-enemies",
  scales: "magic",
  power,
  damage: "magic",
  type,
  ranged: true,
  sureHit: true,
  areaPct: 0.2,
  ...extra,
});

/** Each kind's lair actions, one a round (D&D's initiative count 20), in a shuffled order that never
 *  repeats the last one, each told a round ahead: the lair's field (`field`) as things that happen in a
 *  fight. Modest beside the maker's own blows: the lair is pressure and position, not a second boss. No two
 *  kinds share a set: each lair fights like itself (lair panel 1, 2026-11-18). */
export const DUNGEON_LAIR_ACTIONS: Readonly<Record<DungeonLairKind, Readonly<Record<string, LairAction>>>> = {
  hoard: {
    "lair-falling-stone": {
      label: "Falling Stone",
      ...strike(1.5, "earth", { scales: "strength", damage: "physical" }),
    },
    // The smoke carries the dragon's dread: eyes stream and hearts fail, aim and blows both weaker (lair
    // panel 11, all five: "a dragon with no fear").
    "lair-choking-smoke": {
      label: "Smoke and Dread",
      kind: "debuff",
      target: "all-enemies",
      stat: "skill",
      pct: -0.2,
      alsoMods: [{ stat: "damage", pct: -0.15 }],
      duration: 2,
      ranged: true,
    },
    // The heap gives way under one of them: hurt and buried to the waist in coin, slowed while they dig out
    // (lair panel 2: a coin-flip stun took a whole turn away).
    // The heap slides and carries one off its feet down toward the dragon (lair panel 9: every hoard action
    // was a stat hit; nothing moved anyone the way the rift's pull does).
    "lair-sliding-gold": {
      label: "Sliding Gold",
      ...strike(1.2, "earth", {
        target: "enemy",
        scales: "strength",
        damage: "physical",
        applies: { status: "drawn", chance: 0.8, duration: 2 },
      }),
    },
    // The vents under the heap breathe with the dragon: told a round ahead, the hardest blow the lair has.
    "lair-dragonfire-vents": {
      label: "Dragonfire Vents",
      ...strike(1.8, "fire", { areaPct: 0.3, applies: { status: "burn", chance: 0.4, duration: 2, power: 0.04 } }),
    },
  },
  sanctum: {
    "lair-death-ward": {
      label: "Death Ward",
      // Softer since the ward stone no longer stops it (lair sim 23: the sanctum at 67% wins).
      // The ward turns life away: what it touches heals by half (lair panel 11: "a lich with no healing cut").
      ...strike(0.8, "dark", { applies: { status: "wound", chance: 0.5, duration: 2 } }),
    },
    // The circle closes on whoever stands in it: the front of the party, nearest the master.
    "lair-binding-circle": {
      label: "Binding Circle",
      kind: "status",
      target: "front-row",
      status: "entangle",
      chance: 0.45,
      duration: 2,
      ranged: true,
    },
    "lair-dead-answer": {
      label: "The Dead Answer",
      summon: { name: "Risen Bones", archetype: "blade", count: 1 },
      ...strike(1, "dark"),
    },
    // Its fourth: the voice that reads the names of the dead reads theirs too (lair panel 13: a ward stone
    // and the vault's deed together left the sanctum with nothing to do).
    "lair-names-read": {
      label: "The Names Are Read",
      kind: "status",
      target: "all-enemies",
      status: "wither",
      chance: 0.4,
      duration: 2,
      ranged: true,
    },
  },
  haven: {
    // The mist hides its lord: hard to find until it acts again (lair panel 6: +30% evasion was no hiding).
    "lair-grave-mist": { label: "Grave Mist", kind: "buff", target: "self", stat: "evasion", pct: 0.4, duration: 1 },
    "lair-thralls-gaze": {
      label: "Thrall's Gaze",
      kind: "status",
      target: "enemy",
      status: "confuse",
      chance: 0.35,
      duration: 1,
      ranged: true,
    },
    // The chamber drinks for its master: it scales with what the maker hits with (a courtier is all speed
    // and blade, no spellcraft; lair sim 8: as a spell it hardly scratched).
    "lair-bats-answer": {
      label: "The Bats Answer",
      summon: { name: "Blood Bat", archetype: "scout", count: 1 },
      kind: "debuff",
      target: "all-enemies",
      stat: "skill",
      pct: -0.15,
      duration: 2,
      ranged: true,
    },
    "lair-blood-tithe": {
      label: "Blood Tithe",
      // A third of the blood back, not half (lair panel 9: at level 16 the haven won two fights in three).
      ...strike(1, "dark", { scales: "strength", damage: "physical", drain: 0.3 }),
    },
  },
  den: {
    "lair-shifting-bones": {
      label: "Shifting Bones",
      kind: "status",
      target: "all-enemies",
      status: "slow",
      chance: 0.5,
      duration: 2,
      ranged: true,
    },
    "lair-driven-to-water": {
      label: "Driven to the Pool",
      kind: "status",
      target: "enemy",
      status: "soak",
      chance: 0.8,
      duration: 2,
      ranged: true,
    },
    // The den has teeth of its own: its roof sheds stone on whoever the beast drives under it.
    "lair-den-roof": {
      label: "The Roof Sheds Stone",
      ...strike(1, "earth", { scales: "strength", damage: "physical" }),
    },
    "lair-known-ground": {
      label: "Its Own Ground",
      kind: "buff",
      target: "self",
      stat: "speed",
      pct: 0.25,
      duration: 2,
    },
  },
  breach: {
    "lair-scorching-rift": {
      label: "Scorching Rift",
      ...strike(1.5, "fire", { applies: { status: "burn", chance: 0.5, duration: 2, power: 0.04 } }),
    },
    // The rift drags one of them out from behind the others, into the front where the maker's blows land in
    // full (lair panel 6: a speed cut named a pull and moved no one).
    "lair-pull-of-the-rift": {
      label: "Pull of the Rift",
      kind: "status",
      target: "enemy",
      status: "drawn",
      chance: 0.85,
      duration: 2,
      ranged: true,
    },
    "lair-something-comes": {
      label: "Something Comes Through",
      summon: { name: "Rift-Spawn", archetype: "blade", count: 1 },
      ...strike(2, "fire", { areaPct: 0.3 }),
    },
    // Its fourth: burning stone falls out of the rift onto the front (lair panel 13: anchor and pit together
    // left the breach with nothing).
    "lair-brimstone": {
      label: "Brimstone Falls",
      ...strike(1.1, "fire", {
        target: "front-row",
        scales: "strength",
        damage: "physical",
        applies: { status: "sear", chance: 0.4, duration: 2 },
      }),
    },
  },
  drowned: {
    "lair-surge": {
      label: "Surge",
      ...strike(1.5, "water", { applies: { status: "soak", chance: 0.6, duration: 2 } }),
    },
    "lair-drag-under": {
      label: "Drag Under",
      kind: "status",
      target: "enemy",
      status: "stun",
      chance: 0.4,
      duration: 1,
      ranged: true,
    },
    "lair-rising-water": {
      label: "Rising Water",
      kind: "debuff",
      target: "all-enemies",
      stat: "speed",
      pct: -0.2,
      duration: 2,
      ranged: true,
    },
    // Its fourth: what the water took, given back to fight for it (lair panel 3 and 4: three actions, all of
    // one texture, no summon).
    "lair-drowned-rise": {
      label: "The Drowned Rise",
      summon: { name: "Drowned Dead", archetype: "blade", count: 1 },
      ...strike(1, "water", { scales: "strength", damage: "physical" }),
    },
  },
  hive: {
    "lair-swarm": {
      label: "Swarm",
      ...strike(1.2, "poison", {
        scales: "strength",
        damage: "physical",
        applies: { status: "poison", chance: 0.5, duration: 2, power: 0.04 },
      }),
    },
    // It also seals the chamber's ways out for 2 rounds: the party can't flee (lair panel 7: one action per
    // lair that acts on the place).
    "lair-resin-seal": {
      label: "Resin Seal",
      seals: 2,
      kind: "status",
      target: "enemy",
      status: "entangle",
      chance: 0.7,
      duration: 2,
      ranged: true,
    },
    "lair-brood-call": {
      label: "The Brood Answers",
      summon: { name: "Brood Stinger", archetype: "scout", count: 2 },
      kind: "buff",
      target: "self",
      stat: "damage",
      pct: 0.2,
      duration: 2,
    },
    // Its fourth: the hive's drone lulls one of them where they stand (lair panel 13: eggs and larder together
    // left the hive with nothing).
    "lair-drone": {
      label: "The Lulling Drone",
      kind: "status",
      target: "enemy",
      status: "sleep",
      chance: 0.35,
      duration: 1,
      ranged: true,
    },
  },
};

registerMarinaraEnemySkills(
  Object.fromEntries(
    Object.values(DUNGEON_LAIR_ACTIONS).flatMap((actions) =>
      Object.entries(actions).map(([id, { summon: _summon, seals: _seals, ...action }]) => [id, action]),
    ),
  ),
);

/** The lair action that comes next: any of its kind's actions but the one just taken, picked by `random`. */
export function dungeonLairActionFor(
  kind: DungeonLairKind,
  last: string | undefined,
  random: () => number,
  broken: readonly string[] = [],
): string {
  const left = Object.keys(DUNGEON_LAIR_ACTIONS[kind]).filter((id) => !broken.includes(id));
  const ids = left.length > 1 ? left.filter((id) => id !== last) : left;
  return ids[Math.min(ids.length - 1, Math.floor(random() * ids.length))]!;
}

/** The one thing in each great chamber the party can break mid-fight (owner 2026-11-18, after lair panel 3):
 *  breaking it stops the lair action it feeds. It never acts, and it falls when its maker does. */
export const DUNGEON_LAIR_ANCHORS: Readonly<
  Record<
    DungeonLairKind,
    {
      name: string;
      stops: string;
      breaks: string;
      /** A second action it feeds, gone with it too (lair panel 8: one action was too thin a trade). */
      also?: string;
      /** What breaking it does to its maker at once: a share of its max HP lost, a status for a turn, or a
       *  stat down for some of its turns. */
      onBreak?: {
        makerHpPct?: number;
        status?: "stun";
        makerMod?: { stat: "damage" | "resistance" | "defense"; pct: number; turns: number };
      };
    }
  >
> = {
  // Every one of them takes two things from the lair, or one and something of its maker (lair panel 8:
  // all five asked that a break compete with hitting the boss).
  hoard: {
    name: "Fire Vent",
    stops: "lair-dragonfire-vents",
    breaks: "the vent is choked with rubble and the fire in the dragon banks low",
    onBreak: { makerMod: { stat: "resistance", pct: -0.2, turns: 3 } },
  },
  // The stone that keeps the dead answering and the circle closed (lair panel 6: it guarded Death Ward, the
  // weakest thing the sanctum does).
  sanctum: {
    name: "Ward Stone",
    stops: "lair-dead-answer",
    also: "lair-binding-circle",
    breaks: "the ward stone cracks, its light goes out, the circle opens and the dead stop answering",
  },
  haven: {
    name: "Master's Coffin",
    stops: "lair-blood-tithe",
    also: "lair-grave-mist",
    breaks: "the coffin splinters, the grave earth spills, and its master has no mist to hide in",
  },
  // Knocked out, the prop brings the loose roof down on whatever stands under it: the beast's own nest
  // (lair panel 6: breaking it bought one power-1 action and nothing more).
  den: {
    name: "Cracked Roof Prop",
    stops: "lair-den-roof",
    breaks: "the loose roof comes down at once, onto the beast in its nest",
    onBreak: { makerHpPct: 0.08, status: "stun" },
  },
  breach: {
    name: "Rift Anchor",
    stops: "lair-something-comes",
    also: "lair-pull-of-the-rift",
    breaks: "the anchor stone shatters, the rift narrows, and it no longer pulls",
  },
  drowned: {
    name: "Sluice Gate",
    stops: "lair-surge",
    also: "lair-rising-water",
    breaks: "the sluice gate is wrenched open and the pool runs out through it: no more surge, no more rising water",
  },
  hive: {
    name: "Egg Cluster",
    stops: "lair-brood-call",
    also: "lair-resin-seal",
    breaks: "the eggs burst, the brood is gone, the resin goes soft and the queen's fury falters",
    onBreak: { makerMod: { stat: "damage", pct: -0.2, turns: 3 } },
  },
};

/** Where a lair's breakable thing stands among its feature's cells, so the map can show it (lair panel 4:
 *  "show it in the scene" had nothing on the map to point at): the vampire's middle coffin, the ward stone
 *  at the back of the ring, otherwise the feature's far edge (the vent behind the heap, the rift's end, the
 *  sluice at the pool's rim, the prop at the nest's back) or the comb's inner face for the eggs. */
export function dungeonLairAnchorCell(
  kind: DungeonLairKind,
  cells: ReadonlyArray<{ x: number; y: number }>,
): { x: number; y: number } | undefined {
  if (!cells.length) return undefined;
  const mx = cells.reduce((sum, c) => sum + c.x, 0) / cells.length;
  const my = cells.reduce((sum, c) => sum + c.y, 0) / cells.length;
  const far = (c: { x: number; y: number }) => (c.x - mx) ** 2 + (c.y - my) ** 2;
  const sorted = [...cells].sort((a, b) =>
    kind === "sanctum" ? a.y - b.y || a.x - b.x : far(a) - far(b) || a.y - b.y || a.x - b.x,
  );
  // The comb rings its bowl, so the eggs sit on its inner face, nearest the middle (lair panel 5 check: on
  // the far edge they were outside the bowl).
  // The den's prop stands in the nest's ring, not out at a stray bone (lair panel 5: in a stream).
  if (kind === "den") return sorted[Math.floor(sorted.length * 0.35)];
  return kind === "haven" || kind === "sanctum" || kind === "hive" ? sorted[0] : sorted[sorted.length - 1];
}

/** A lair's breakable thing as a fighter on its maker's side: it never acts, a fair share of its maker's HP. */
export function dungeonLairAnchorFighter(kind: DungeonLairKind, maker: MarinaraFighter): MarinaraFighter {
  const anchor = DUNGEON_LAIR_ANCHORS[kind];
  const fighter = buildMarinaraEnemy({
    id: `lair-anchor-${kind}`,
    name: anchor.name,
    archetype: "guard",
    level: maker.level,
    tier: "minion",
    row: "front",
  });
  fighter.side = maker.side;
  fighter.dummy = true;
  fighter.lairAnchor = anchor.stops;
  fighter.maxHp = Math.max(10, Math.round(maker.maxHp * 0.14));
  fighter.hp = fighter.maxHp;
  return fighter;
}

/** The board a fight in a lair's great chamber is laid out as (Tactical): the cavern, the vault, the hall. */
export const DUNGEON_LAIR_BOARD: Readonly<Record<DungeonLairKind, string>> = {
  hoard: "cave",
  sanctum: "dungeon",
  haven: "castle",
  den: "cave",
  breach: "volcanic",
  drowned: "water",
  hive: "swamp",
};

/** How each lair's chamber is told in a fight: its own voice, not one line for all (lair panel 2). */
const DUNGEON_LAIR_NARRATION: Readonly<Record<DungeonLairKind, string>> = {
  hoard:
    "Narrate the cavern as part of the dragon: the heap shifting when it moves, heat breathing from the vents before they burn.",
  sanctum:
    "Narrate the sanctum as the lich's will made stone: the circle's light tightening, the walls whispering names before the dead answer.",
  haven:
    "Narrate the haven as its master's household: candles guttering, the mist leaning toward the living, the bats a sound before they are a sight.",
  den: "Narrate the den as the beast's ground: the smell, the bones underfoot, the roof grumbling before it sheds stone.",
  breach:
    "Narrate the breach as a wound in the world: the rift's heat and pull, something moving in the light before it comes through.",
  drowned:
    "Narrate the drowned hall as rising cold water: the surge drawing back before it breaks, things brushing legs in the murk.",
  hive: "Narrate the hive as one body: the hum rising before the swarm, resin creeping, the brood stirring in the comb.",
};

/** What a cold lair's long-gone maker left in its great chamber (lair panel 9: "a cold lair gives only
 *  signs", and players stop looking): one find worth the walk, and a hint of where the maker went. */
export const DUNGEON_LAIR_LEAVINGS: Readonly<Record<DungeonLairKind, string>> = {
  hoard:
    "a scorched coin cache the dragon missed when it moved its hoard (a fair purse of old coin and one gem), and a claw-scored trail of dropped coin toward the surface",
  sanctum:
    "the cracked shell of a phylactery, emptied: worth a scholar's fee as it is, and the runes on it name where its master carried the rest",
  haven:
    "a coffin of grave earth left behind, a signet ring of the old house in it, and a coach's wheel ruts leading out to where its master went",
  den: "the beast's old kills picked clean, a traveller's pack among them with something still worth having in it, and claw marks going out",
  breach:
    "a cooled shard of the rift's stone, still warm to the hand and worth much to the right buyer, and the cult's ash-smeared tally of what came through",
  drowned:
    "a drowned offering-box in the dried pool, its coin green but good, and the tide-marks of where the water and its master went",
  hive: "old honey-wax sealed in the comb, a healer's prize, and the husk of the queen's last moult, too small for the queen that left",
};

/** One thing the party can do in a room off a built lair's great chamber before the fight (lair panel 9:
 *  "nothing in a lair is playable outside the fight"): the room, the deed done there, and the lair action
 *  it takes out of the fight to come. The Engine counts it done once the party has been in the room. */
export const DUNGEON_LAIR_DEEDS: Readonly<
  Record<DungeonLairKind, { room: string; deed: string; stops: string }>
> = {
  hoard: { room: "Smoke vent", deed: "choke the smoke vent with rubble", stops: "lair-choking-smoke" },
  sanctum: { room: "Phylactery vault", deed: "smash the soul-vessels in the phylactery vault", stops: "lair-death-ward" },
  haven: { room: "Thralls' cell", deed: "free the thralls from their cell", stops: "lair-thralls-gaze" },
  den: { room: "Drinking pool", deed: "foul the beast's drinking pool", stops: "lair-driven-to-water" },
  breach: { room: "Sacrifice pit", deed: "douse the coals of the sacrifice pit", stops: "lair-scorching-rift" },
  drowned: { room: "Sunken shrine", deed: "cast down the sunken shrine's idol", stops: "lair-drowned-rise" },
  hive: { room: "Larder of husks", deed: "burn the larder of husks", stops: "lair-swarm" },
};

/** The lair action a party's deed before the fight has already taken away, if it went into the deed's
 *  room on the lair's own level. */
export function dungeonLairDeedDone(
  kind: DungeonLairKind,
  map: {
    roomInfo?: ReadonlyArray<{ name: string } | null | undefined>;
    site?: { level: number; seen: Readonly<Record<string, readonly number[]>> };
  },
): string | undefined {
  const deed = DUNGEON_LAIR_DEEDS[kind];
  const seen = map.site?.seen[String(map.site.level)] ?? [];
  return map.roomInfo?.some((info, index) => dungeonLairDeedRoom(kind, info?.name) && seen.includes(index))
    ? deed.stops
    : undefined;
}

/** Whether a room (by its name, a number after it or not) is its lair's deed room. */
export function dungeonLairDeedRoom(kind: DungeonLairKind, name: string | undefined): boolean {
  return !!name && name.replace(/ \d+$/u, "") === DUNGEON_LAIR_DEEDS[kind].room;
}

/** What the fight's Game Master is told of a fight in a lair's great chamber. */
export function dungeonLairFightText(kind: DungeonLairKind, undone?: string): string {
  const spec = DUNGEON_LAIRS[kind];
  const actions = Object.values(DUNGEON_LAIR_ACTIONS[kind]);
  const anchor = DUNGEON_LAIR_ANCHORS[kind];
  const stops =
    [anchor.stops, ...(anchor.also ? [anchor.also] : [])]
      .map((id) => DUNGEON_LAIR_ACTIONS[kind][id]?.label)
      .filter(Boolean)
      .join(" and ") || "one of its actions";
  return `This fight is in ${spec.label}, its maker's own great chamber: ${spec.field} The Engine plays the lair itself, once a round while its maker stands (every other round while its maker is under level 10), and the log tells the party a round ahead what the chamber does next (${actions.map((action) => action.label).join(", ")}). The ${anchor.name} stands among the foes as something the party can strike: broken, ${anchor.breaks}, and the lair has no more ${stops}. Show it in the scene before anyone thinks to hit it.${
    undone && DUNGEON_LAIR_ACTIONS[kind][undone]
      ? ` Before the fight the party went to ${DUNGEON_LAIR_DEEDS[kind].deed}: the lair has no ${DUNGEON_LAIR_ACTIONS[kind][undone]!.label} in this fight, and its absence shows.`
      : ""
  } ${DUNGEON_LAIR_NARRATION[kind]} Foreshadow the action the log announces; anything the chamber calls up comes out of it. Add no lair effects of your own.`;
}
