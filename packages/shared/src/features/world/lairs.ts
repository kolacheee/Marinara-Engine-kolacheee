// ──────────────────────────────────────────────
// Creature lairs (owner 2026-11-18, "Creature lairs: design"): a site whose holder is one great creature,
// not a band. Its deepest floor is built round that creature (a dragon's hoard, a lich's sanctum), and a
// fight there is fought in its lair. Whether a site is a lair is drawn from its seed when its maps are laid
// out (so the lair floor is part of the building from the first), and it wakes only where the land is
// dangerous enough for a boss (band 5 and up); elsewhere it is a cold lair, its maker long gone. The story
// can make one with `[site: lair=<kind>]`. Pure and seeded.
// ──────────────────────────────────────────────
import { marinaraRandom } from "../marinara-classes.js";
import type { MarinaraBestiarySetting } from "../marinara-bestiary.js";

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
      "The hoard's heap is cover and the cavern's roof is cracked: the dragon's lair can bring stone down on a group, choke the air with smoke and heat, or send the gold sliding underfoot.",
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
      "Its ward stones pulse with death, its circle binds whoever stands in it, and the dead in the walls answer it: the sanctum can drain the living, hold a fighter fast or raise the fallen.",
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
      "Mist pours along the floor, the shadows answer its master and its thralls know every door: the haven can hide its lord in mist, darken a corner or call its thralls from the walls.",
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
      "Its master's own water fills the hall: the pool can surge across the floor, drag a fighter under, or hide what moves in it.",
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
