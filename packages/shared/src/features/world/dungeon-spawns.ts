// ──────────────────────────────────────────────
// Who lives in a dungeon (location spawns, 2026-11-13): a site's foes are fixed by the world, never by the
// party. Each generated map gets a site record (what kind of place it is, how it fell, the foes that hold
// it and the ones that squat in it, and a level band set once, when the party first goes in), and each of
// its areas a roster rolled from that record: guard posts and the heart for the holders, the rest for the
// squatters or nobody. The Game Master narrates the rosters and may not swap them; a fight in an area is
// fought by its roster at the site's levels. A cleared area stays empty for three days, then squatters move
// back in; the heart's leader, once dead, stays dead. Maps made by hand have no rosters: their author
// writes who is there. Pure and seeded: the same site and map always roll the same foes.
// ──────────────────────────────────────────────
import { z } from "zod";
import {
  MARINARA_BESTIARY,
  MARINARA_TIER_RULES,
  marinaraEnemyFamily,
  marinaraEnemyName,
  marinaraFitEncounter,
  type MarinaraBestiarySetting,
  type MarinaraEncounterFoe,
  type MarinaraEnemyFamily,
  type MarinaraHabitat,
} from "../marinara-bestiary.js";
import type { MarinaraEnemyTier } from "../marinara-combat.js";
import { MARINARA_LEVEL_CAP, marinaraRandom } from "../marinara-classes.js";
import {
  DUNGEON_SETS,
  dungeonFromGameDungeonMap,
  dungeonRoomCells,
  dungeonRoomHas,
  dungeonWalkable,
  gameDungeonMapForFloor,
  type DungeonRoom,
  type GameDungeonMap,
} from "./dungeon-map.js";
import {
  SITE_LOCK_PROP,
  SITE_STAIR_ROOMS,
  gameDungeonPlannedMap,
  sitePlanInputFor,
  siteTemplateForSet,
  type SiteTerrain,
} from "./site-plans.js";
import type { WorldHistory } from "./history.js";
import {
  DUNGEON_LAIRS,
  dungeonLairDeedRoom,
  DUNGEON_LAIR_LEAVINGS,
  DUNGEON_LAIR_KINDS,
  DUNGEON_LAIR_MIN_LEVEL,
  dungeonLairFor,
  dungeonLairTitle,
  readGameDungeonLairTag,
  type DungeonLairKind,
} from "./lairs.js";

/** What kind of place a site is, which decides who holds it. */
export const DUNGEON_SITE_ORIGINS = [
  "cave",
  "mine",
  "crypt",
  "ruin",
  "sewer",
  "station",
  "manor",
  "keep",
  "temple",
] as const;
export type DungeonSiteOrigin = (typeof DUNGEON_SITE_ORIGINS)[number];

/** How a site (or the town it lies by) fell, from the world's history: it decides who moved in. */
export const DUNGEON_SITE_FATES = ["war", "sickness", "famine", "flood"] as const;
export type DungeonSiteFate = (typeof DUNGEON_SITE_FATES)[number];

export interface DungeonLevelBand {
  low: number;
  high: number;
}

export interface DungeonSite {
  origin: DungeonSiteOrigin;
  fate?: DungeonSiteFate;
  band: DungeonLevelBand;
  /** The family that holds the place: its guard posts and its heart. */
  holder: string;
  /** Who leads the holders in the heart, when it is another family (a captain over sellswords). */
  leader?: string;
  /** Families that squat in the rest of it. */
  squatters: string[];
  /** A creature's lair (owner 2026-11-18): one great creature, its maker, holds the deepest floor alone as
   *  a boss, and the holders are its servants. */
  lair?: { kind: DungeonLairKind; maker: string };
}

export type DungeonAreaRole = "entry" | "guard" | "lair" | "empty" | "rest" | "heart";

export interface DungeonArea {
  /** The map's area number (1-based, as the Game Master's prompt counts them). */
  area: number;
  /** Where its clearing is kept (dungeonAreaKey). */
  key: string;
  /** The way down to the next floor stands in it: the holders guard it. */
  wayDown?: true;
  /** Its holders walk it, back and forth along its length (a wall walk, a long passage), rather than stand. */
  patrol?: true;
  /** Its holders are asleep, off watch (a barracks at rest): a party can slip past or catch them unready. */
  asleep?: true;
  /** Its one sentry keeps watch from a gallery over the room. */
  gallery?: true;
  /** A lair's servants hold the way into its maker's great chamber here, at the side nearest it (lair panel
   *  4: the chamber was reached unopposed). */
  throat?: true;
  role: DungeonAreaRole;
  level: number;
  foes: MarinaraEncounterFoe[];
}

/** How many in-game days a cleared area stays empty before squatters move back in. */
export const DUNGEON_REFILL_DAYS = 3;

/** How far each kind of place sits above the land around it. */
const ORIGIN_OFFSET: Record<DungeonSiteOrigin, number> = {
  cave: 0,
  mine: 0,
  sewer: 0,
  crypt: 1,
  ruin: 1,
  station: 1,
  manor: 1,
  keep: 1,
  temple: 1,
};
/** How many levels a site's band spans, from its first room to its heart. */
const BAND_SPAN = 4;

/** The habitats a kind of place takes its squatters from. */
const ORIGIN_HABITATS: Record<DungeonSiteOrigin, readonly MarinaraHabitat[]> = {
  cave: ["underground"],
  mine: ["underground"],
  crypt: ["ruins", "underground"],
  ruin: ["ruins"],
  sewer: ["urban", "underground"],
  station: ["ruins", "urban"],
  manor: ["urban", "ruins"],
  keep: ["ruins"],
  temple: ["ruins"],
};

/** Who holds each kind of place, best fit first; the first few the setting has at the band are drawn from. */
const HOLDERS: Record<DungeonSiteOrigin, readonly string[]> = {
  cave: ["great-beast", "stalker", "lout", "serpent", "gel", "drake"],
  mine: ["clay-spirit", "warder", "lout", "edge-spirit", "gel"],
  crypt: ["bones", "grave-duelist", "shade", "gorger", "night-courtier", "cultist"],
  ruin: ["cultist", "sellsword", "shade", "warder", "fiend", "cutpurse"],
  sewer: ["gnawer", "gel", "cutpurse", "stinger"],
  station: ["drone", "turret", "warder", "shooter", "adept"],
  manor: ["cutpurse", "cultist", "sellsword", "shade", "night-courtier"],
  keep: ["sellsword", "shieldbearer", "grave-duelist", "lout", "bones"],
  temple: ["cultist", "adept", "fiend", "shade", "warder"],
};
/** Undead holders for a building that grew a crypt for them (a vampire's mansion, a dead lord's keep). */
const UNDEAD_HOLDERS = ["night-courtier", "grave-duelist", "gorger", "shade", "bones"] as const;
/** Who a fall leaves behind: a ruin or crypt that fell this way is held by these first. */
const FATE_HOLDERS: Record<DungeonSiteFate, readonly string[]> = {
  war: ["sellsword", "bones", "grave-duelist", "cutpurse"],
  sickness: ["gorger", "bones", "shade"],
  famine: ["bones", "gnawer", "shade"],
  flood: ["tide-spirit", "gel", "serpent"],
};
/** Who squats in each kind of place first, before any vermin or beast. */
const SQUATTERS: Record<DungeonSiteOrigin, readonly string[]> = {
  cave: ["stinger", "serpent", "raptor", "gnawer"],
  mine: ["gnawer", "stinger", "clay-spirit", "gel"],
  crypt: ["bones", "gorger", "gnawer", "shade"],
  ruin: ["thornling", "stinger", "gnawer", "serpent", "bones"],
  sewer: ["gnawer", "gel", "serpent", "stinger"],
  station: ["drone", "gnawer", "gel"],
  manor: ["gnawer", "stinger", "shade", "gel"],
  keep: ["gnawer", "raptor", "bones", "stinger"],
  temple: ["gnawer", "thornling", "shade", "stinger"],
};
/** A cave's own look calls its holder: a lava cave the fire spirits, an ice cave the frost ones. */
const SET_HOLDERS: Partial<Record<string, readonly string[]>> = {
  cave_lava: ["cinder-spirit", "drake"],
  cave_ice: ["rime-spirit", "great-beast"],
  cave_crystal: ["edge-spirit", "clay-spirit"],
};

/** The kind of place a generated map is, by its set and name. */
export function dungeonSiteOrigin(setId: string, name = ""): DungeonSiteOrigin {
  const set = DUNGEON_SETS.find((each) => each.id === setId);
  const words = name.toLowerCase();
  if (set?.kind === "station") return "station";
  if (/\b(mines?|mineshaft|quarr(y|ies)|delve|adits?)\b/u.test(words)) return "mine";
  if (setId === "dungeon_sewer") return "sewer";
  if (setId === "dungeon_crypt") return "crypt";
  if (setId === "dungeon_temple") return "ruin";
  if (setId === "building_manor") return "manor";
  if (setId === "building_keep") return "keep";
  if (setId === "building_temple") return "temple";
  return "cave";
}

/** How a place fell, read from the history's severe events that name it or the town it lies by, the
 *  latest first. None for a place history never touched. */
export function dungeonSiteFate(
  history: Pick<WorldHistory, "events"> | null | undefined,
  name: string,
  nearId?: string,
): DungeonSiteFate | undefined {
  if (!history) return undefined;
  const own = name.toLowerCase();
  const touched = history.events
    .filter(
      (event) => event.severe && (event.text.toLowerCase().includes(own) || (nearId && event.places.includes(nearId))),
    )
    .sort((a, b) => a.yearsAgo - b.yearsAgo);
  for (const event of touched) {
    const text = event.text.toLowerCase();
    if (/\bflood/u.test(text)) return "flood";
    if (/\b(plague|sickness|pox|fever)\b/u.test(text)) return "sickness";
    if (/\b(famine|drought|dry spell)\b/u.test(text)) return "famine";
    if (event.kind === "conflict" || /\b(war|destroyed|sacked|razed)\b/u.test(text)) return "war";
    if (/\babandoned\b/u.test(text)) {
      // Abandoned "after it": the woe before it in the same year.
      const before = history.events.find(
        (other) => other.yearsAgo === event.yearsAgo && other !== event && other.kind === "catastrophe",
      );
      const was = before?.text.toLowerCase() ?? "";
      return /\bplague|sickness/u.test(was) ? "sickness" : "famine";
    }
  }
  return undefined;
}

/** How many floors each kind of place has, at least and at most (owner 2026-11-13: separate maps). */
const ORIGIN_FLOORS: Record<DungeonSiteOrigin, readonly [number, number]> = {
  cave: [1, 2],
  mine: [2, 3],
  crypt: [2, 3],
  ruin: [1, 2],
  sewer: [1, 2],
  station: [1, 2],
  manor: [3, 5],
  keep: [3, 4],
  temple: [2, 3],
};
/** How many levels each floor down climbs. */
const FLOOR_RISE = 2;

/** How many floors a place has: by its kind, drawn from its seed. */
export function dungeonSiteFloors(origin: DungeonSiteOrigin, siteSeed: number): number {
  const [least, most] = ORIGIN_FLOORS[origin];
  return least + Math.floor(marinaraRandom(`${siteSeed}:floors`)() * (most - least + 1));
}

/** A site's band from the land around it: the region's band, the kind of place's offset on top, and two
 *  levels more for each floor below the first. */
export function dungeonSiteBand(origin: DungeonSiteOrigin, region: DungeonLevelBand, floors = 1): DungeonLevelBand {
  const deeper = FLOOR_RISE * Math.max(0, floors - 1);
  const low = Math.max(
    1,
    Math.min(MARINARA_LEVEL_CAP - BAND_SPAN - deeper, Math.round(region.low) + ORIGIN_OFFSET[origin]),
  );
  return { low, high: Math.min(MARINARA_LEVEL_CAP, low + BAND_SPAN + deeper) };
}

/**
 * A floor of a place laid out by its name (owner 2026-11-13: separate maps per floor): how many floors it
 * has follows from what kind of place it is and its seed, the same every time it is laid out.
 */
export function gameDungeonSiteMap(input: {
  setId: string;
  name: string;
  siteSeed: number;
  id: string;
  floor?: number;
  /** What the world says of a building laid out to a plan: how it fell, the land under it. */
  fate?: DungeonSiteFate;
  terrain?: SiteTerrain;
  /** The game's rules can find traps (a ruleset with a skill for it): a building has them. */
  traps?: boolean;
}): GameDungeonMap {
  // A creature's lair is drawn from the site's seed when its maps are laid out, so its floor is part of the
  // building from the first (owner 2026-11-18); it wakes or stays cold by the band, at the first entry.
  const origin = dungeonSiteOrigin(input.setId, input.name);
  const lair = dungeonLairFor(origin, input.siteSeed) ?? undefined;
  // A building (a manor, a keep, a temple, a crypt) is laid out to a plan of the whole of it.
  const template = siteTemplateForSet(input.setId);
  if (template)
    return gameDungeonPlannedMap({
      plan: sitePlanInputFor({
        template,
        name: input.name,
        seed: input.siteSeed,
        ...(lair ? { lair } : {}),
        ...(input.fate ? { fate: input.fate } : {}),
        ...(input.terrain ? { terrain: input.terrain } : {}),
      }),
      name: input.name,
      id: input.id,
      ...(input.traps ? { traps: true } : {}),
    });
  const floors = dungeonSiteFloors(origin, input.siteSeed);
  return gameDungeonMapForFloor({ ...input, floor: input.floor ?? 1, floors, ...(lair ? { lair } : {}) });
}

/** One floor's band within its site's: two levels deeper for each floor down. */
export function dungeonFloorBand(band: DungeonLevelBand, floor: number): DungeonLevelBand {
  const low = Math.min(band.high, band.low + FLOOR_RISE * Math.max(0, floor - 1));
  return { low, high: Math.min(band.high, low + BAND_SPAN) };
}

/** The key an area's clearing is kept under: its number on the first floor, "floor:area" below it. */
export function dungeonAreaKey(floor: number, area: number): string {
  return floor > 1 ? `${floor}:${area}` : String(area);
}

/** Whether a family can stand in a site at every level of its band, in the game's setting. */
function livesAt(family: MarinaraEnemyFamily, setting: MarinaraBestiarySetting, band: DungeonLevelBand): boolean {
  return (
    family.role !== "treasure" &&
    family.levels[0] <= band.low &&
    family.levels[1] >= band.high &&
    Boolean(marinaraEnemyName(family, setting, band.low)) &&
    Boolean(marinaraEnemyName(family, setting, band.high))
  );
}

/** A seeded pick, the earlier entries a little likelier. */
function pickLeaning<T>(items: readonly T[], random: () => number): T | undefined {
  if (!items.length) return undefined;
  const weights = items.map((_, index) => 1 / (index + 1));
  let roll = random() * weights.reduce((sum, one) => sum + one, 0);
  for (let index = 0; index < items.length; index++) if ((roll -= weights[index]!) <= 0) return items[index];
  return items.at(-1);
}

/**
 * A site's record: who holds it and who squats in it, at its band. Null when the setting has nobody who
 * could live there at that band (a band past every family's reach).
 */
export function dungeonSiteFor(input: {
  setId: string;
  name: string;
  setting: MarinaraBestiarySetting;
  band: DungeonLevelBand;
  fate?: DungeonSiteFate;
  /** The map's seed (or the game's seed for the site): the same site always draws the same foes. */
  seed: string | number;
  /** A building planned with a crypt for undead holders: the dead hold it. */
  undead?: boolean;
  /** The site is a creature's lair (a woken one, its band high enough for a boss): its maker holds the
   *  heart and its servants the rest. No maker of the kind lives at the band: a plain site. */
  lair?: DungeonLairKind;
}): DungeonSite | null {
  const origin = dungeonSiteOrigin(input.setId, input.name);
  const random = marinaraRandom(`${input.seed}:site:${input.name.toLowerCase()}`);
  const fits = (ids: readonly string[]) =>
    ids.flatMap((id) => {
      const family = marinaraEnemyFamily(id);
      return family && livesAt(family, input.setting, input.band) ? [family.id] : [];
    });
  // A ruin or crypt that fell a known way is held by what the fall left; a cave by what its look calls.
  const preferred = [
    ...(input.undead ? UNDEAD_HOLDERS : []),
    ...((origin === "ruin" || origin === "crypt") && input.fate ? FATE_HOLDERS[input.fate] : []),
    ...(origin === "cave" ? (SET_HOLDERS[input.setId] ?? []) : []),
    ...HOLDERS[origin],
  ];
  let holders = fits([...new Set(preferred)]);
  // Nobody of the place's kind lives at this band in this setting: anyone whose habitat it is.
  if (!holders.length)
    holders = MARINARA_BESTIARY.filter(
      (family) =>
        family.role !== "swarm" &&
        family.habitats?.some((habitat) => ORIGIN_HABITATS[origin].includes(habitat)) &&
        livesAt(family, input.setting, input.band),
    ).map((family) => family.id);
  // A setting with no monsters for the place (a 1920s cave): people who hide there, smugglers and gangs.
  if (!holders.length) holders = fits(["sellsword", "cutpurse", "shooter", "brawler", "cultist"]);
  // A lair: its maker, the first of the kind that lives here and fights as a boss, and its servants.
  const lairSpec = input.lair && input.band.high >= DUNGEON_LAIR_MIN_LEVEL ? DUNGEON_LAIRS[input.lair] : undefined;
  const maker = lairSpec
    ? fits(lairSpec.makers).find((id) => marinaraEnemyFamily(id)!.tiers.includes("boss"))
    : undefined;
  if (maker && lairSpec) {
    // A swarm holds no post on its own: one only when nothing else serves here.
    const servants = fits(lairSpec.servants);
    const standing = servants.filter((id) => marinaraEnemyFamily(id)!.role !== "swarm");
    if (servants.length) holders = standing.length ? standing : servants;
  }
  const holder = maker ? holders[0] : pickLeaning(holders.slice(0, 3), random);
  if (!holder) return null;
  const holderFamily = marinaraEnemyFamily(holder)!;
  // People follow a captain: a gang's or a band's heart is its chief with their own around them. A lair's
  // heart is its maker's alone.
  const leader = maker
    ? maker
    : holderFamily.kind === "humanoid" && holderFamily.role !== "leader"
      ? fits(["captain"])[0]
      : undefined;
  // Squatters: what moves into an empty hole, the place's own kind first (rats in a sewer, the dead in a
  // crypt), then vermin, beasts, oozes and plants, the rest after; within each, in the site's own order.
  const flavour = SQUATTERS[origin];
  const critter = (family: MarinaraEnemyFamily) => ["vermin", "beast", "ooze", "plant"].includes(family.kind);
  const order = new Map(MARINARA_BESTIARY.map((family) => [family.id, random()]));
  const squatters = MARINARA_BESTIARY.filter(
    (family) =>
      family.id !== holder &&
      family.id !== leader &&
      family.role !== "leader" &&
      family.role !== "healer" &&
      family.kind !== "humanoid" &&
      family.habitats?.some((habitat) => ORIGIN_HABITATS[origin].includes(habitat)) &&
      livesAt(family, input.setting, input.band),
  )
    .map((family) => ({
      id: family.id,
      score: (flavour.includes(family.id) ? 2 : 0) + (critter(family) ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || order.get(a.id)! - order.get(b.id)!)
    .map((family) => family.id);
  const chosen: string[] = [];
  for (let tries = 0; tries < 6 && chosen.length < 2 && squatters.length; tries++) {
    const one = pickLeaning(squatters.slice(0, 4), random)!;
    if (!chosen.includes(one)) chosen.push(one);
  }
  return {
    origin,
    ...(input.fate ? { fate: input.fate } : {}),
    band: input.band,
    holder,
    ...(leader ? { leader } : {}),
    squatters: chosen,
    ...(maker && input.lair ? { lair: { kind: input.lair, maker } } : {}),
  };
}

/** The tier a foe can take at a level, from the one asked down. */
function tierAt(family: MarinaraEnemyFamily, tier: MarinaraEnemyTier, level: number): MarinaraEnemyTier | null {
  const order: MarinaraEnemyTier[] = ["boss", "elite", "standard", "minion"];
  for (const each of order.slice(order.indexOf(tier)))
    if (family.tiers.includes(each) && level >= MARINARA_TIER_RULES[each].minLevel) return each;
  return null;
}

function group(familyId: string, tier: MarinaraEnemyTier, level: number, count: number): MarinaraEncounterFoe[] {
  const family = marinaraEnemyFamily(familyId);
  if (!family) return [];
  const at = tierAt(family, tier, level);
  return at ? Array.from({ length: count }, () => ({ familyId, tier: at, level })) : [];
}

/** A roster held to a fight's caps, sized for a party of four at its own level. */
function fitted(
  setting: MarinaraBestiarySetting,
  level: number,
  foes: MarinaraEncounterFoe[],
  difficulty: "normal" | "hard",
): MarinaraEncounterFoe[] {
  if (!foes.length) return [];
  return marinaraFitEncounter({ setting, party: { level, size: 4 }, foes, difficulty, fixedLevels: true }).foes;
}

/** A squatters' roster for an area: a few of one squatter family. */
function squatRoster(
  site: DungeonSite,
  setting: MarinaraBestiarySetting,
  level: number,
  random: () => number,
): MarinaraEncounterFoe[] {
  const squatter = site.squatters.length ? site.squatters[Math.floor(random() * site.squatters.length)]! : site.holder;
  const swarm = marinaraEnemyFamily(squatter)?.role === "swarm";
  return fitted(
    setting,
    level,
    random() < 0.5 || swarm
      ? group(squatter, "minion", level, 3 + Math.floor(random() * 2))
      : group(squatter, "standard", level, 1 + Math.floor(random() * 2)),
    "normal",
  );
}

/** A woken lair's servants keep the way into the great chamber: the area the party enters it from (`into`,
 *  where the walk is known; else the room nearest it), never the way in or the way down, is always held, at
 *  its side nearest the chamber (lair panel 4, all five: servants stood in corners and the chamber was
 *  reached unopposed). */
function lairThroat(
  areas: DungeonArea[],
  map: GameDungeonMap,
  site: DungeonSite,
  setting: MarinaraBestiarySetting,
  into?: number,
): DungeonArea[] {
  if (!site.lair) return areas;
  const heart = areas.findIndex((area) => area.role === "heart");
  const h = map.rooms[heart];
  if (!h) return areas;
  const gap = (r: DungeonRoom) =>
    Math.max(0, r.x - (h.x + h.w), h.x - (r.x + r.w)) + Math.max(0, r.y - (h.y + h.h), h.y - (r.y + r.h));
  const open = (index: number) => index !== heart && areas[index]!.role !== "entry" && !areas[index]!.wayDown;
  const n =
    into !== undefined && into >= 0 && open(into)
      ? into
      : areas
          .map((_, index) => index)
          .filter(open)
          .sort((p, q) => gap(map.rooms[p]!) - gap(map.rooms[q]!) || p - q)[0];
  if (n === undefined) return areas;
  const { patrol: _patrol, asleep: _asleep, gallery: _gallery, ...area } = areas[n]!;
  areas[n] = {
    ...area,
    role: "guard",
    throat: true,
    foes: fitted(setting, area.level, group(site.holder, "standard", area.level, 2), "normal"),
  };
  // The deed room is kept (lair panel 10: "a visit alone removes a lair action, nothing at stake"): one
  // servant set over it, alone, so the deed costs a fight, or a quiet kill, before the party can do it.
  const deed = map.roomInfo?.findIndex((info) => dungeonLairDeedRoom(site.lair!.kind, info?.name)) ?? -1;
  if (deed >= 0 && deed !== n && open(deed) && areas[deed]) {
    const { patrol: _p, asleep: _a, gallery: _g, ...kept } = areas[deed]!;
    areas[deed] = {
      ...kept,
      role: "guard",
      foes: fitted(setting, kept.level, group(site.holder, "standard", kept.level, 1), "normal"),
    };
  }
  return areas;
}

/**
 * Each area of a generated map with its role and its foes. The entry (where the way in is) is always
 * empty; the area furthest in is the heart, held by the holder's strongest; areas past the halfway mark
 * are guard posts of the holders, the rest squatters' lairs or empty, and one empty area is a place to
 * rest. Levels climb from the band's low at the way in to its high in the heart. A map made by hand, or
 * with no areas, has none.
 */
export function dungeonAreas(map: GameDungeonMap, site: DungeonSite, setting: MarinaraBestiarySetting): DungeonArea[] {
  if (map.hand || !map.rooms.length) return [];
  if (map.site && map.roomInfo) return plannedAreas(map, site, setting);
  const floor = map.floor ?? 1;
  const deepest = floor >= (map.floors ?? 1);
  const band = dungeonFloorBand(site.band, floor);
  const cells = dungeonFromGameDungeonMap(map);
  // Steps from the way in to every cell.
  const steps = new Int32Array(cells.width * cells.height).fill(-1);
  const start = map.entrance.y * cells.width + map.entrance.x;
  steps[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]!;
    const x = cell % cells.width;
    const y = (cell - x) / cells.width;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (!dungeonWalkable(cells, nx, ny)) continue;
      const next = ny * cells.width + nx;
      if (steps[next] !== -1) continue;
      steps[next] = steps[cell]! + 1;
      queue.push(next);
    }
  }
  const distance = map.rooms.map((room) => {
    let best = -1;
    for (const { x, y } of dungeonRoomCells(room)) {
      const at = steps[y * cells.width + x]!;
      if (at >= 0 && (best < 0 || at < best)) best = at;
    }
    return best;
  });
  const inside = (room: DungeonRoom) => dungeonRoomHas(room, map.entrance.x, map.entrance.y);
  const entry = Math.max(0, map.rooms.findIndex(inside));
  const far = Math.max(1, ...distance);
  const furthest = distance.reduce(
    (best, d, index) => (index !== entry && d > (distance[best] ?? -1) ? index : best),
    -1,
  );
  // The heart is on the deepest floor; above it, the furthest area is where the way down is, held.
  const heart = deepest ? (map.lairRoom ?? furthest) : -1;
  const downArea = map.down ? map.rooms.findIndex((room) => dungeonRoomHas(room, map.down!.x, map.down!.y)) : -1;
  const random = marinaraRandom(`${map.seed}:areas:${site.holder}:${band.low}`);
  const levelAt = (index: number) =>
    Math.round(band.low + ((band.high - 1 - band.low) * Math.max(0, distance[index]!)) / far);
  const areas: DungeonArea[] = map.rooms.map((_, index) => {
    const level = index === heart ? band.high : levelAt(index);
    const area = index + 1;
    const key = dungeonAreaKey(floor, area);
    if (index === entry || distance[index]! < 0) return { area, key, role: "entry", level, foes: [] };
    if (index === downArea) {
      const foes = fitted(
        setting,
        level,
        group(site.holder, "standard", level, 2 + Math.floor(random() * 2)),
        "normal",
      );
      return { area, key, role: "guard", wayDown: true, level, foes };
    }
    if (index === heart) {
      const top = marinaraEnemyFamily(site.leader ?? site.holder)!;
      const head = group(top.id, top.tiers.includes("boss") ? "boss" : "elite", level, 1);
      const guard = site.lair
        ? []
        : group(site.holder, "standard", level, site.leader ? 2 : 1 + Math.floor(random() * 2));
      return { area, key, role: "heart", level, foes: fitted(setting, level, [...head, ...guard], "hard") };
    }
    const deep = distance[index]! / far >= 0.5;
    if (deep && random() < 0.75) {
      const size = 2 + Math.floor(random() * 2);
      // Not every post a pair at the ready (lair panel 12, all five: identical pairs spaced round a cave read
      // as a spawn grid): by a hash of the place and the room, which leaves the draws above as they were,
      // some are a lone sentry, some sleep at their post, some walk it.
      const kind = (Math.imul((map.seed ^ (index * 0x9e3779b1)) >>> 0, 0x85ebca6b) >>> 0) % 6;
      const foes = fitted(setting, level, group(site.holder, "standard", level, kind <= 1 ? 1 : size), "normal");
      return {
        area,
        key,
        role: "guard",
        level,
        foes,
        ...(kind === 2 ? { asleep: true as const } : kind === 3 ? { patrol: true as const } : {}),
      };
    }
    if (random() < 0.5) return { area, key, role: "lair", level, foes: squatRoster(site, setting, level, random) };
    return { area, key, role: "empty", level, foes: [] };
  });
  // One empty area (the one nearest halfway in) is quiet enough to rest in.
  const quiet = areas
    .filter((area) => area.role === "empty")
    .sort(
      (a, b) =>
        Math.abs(distance[a.area - 1]! / far - 0.5) - Math.abs(distance[b.area - 1]! / far - 0.5) || a.area - b.area,
    )[0];
  if (quiet) quiet.role = "rest";
  if (!deepest || heart < 0) return areas;
  // The room the walk reaches the great chamber from: the nearest step in just outside it.
  const chamber = map.rooms[heart]!;
  let into = -1;
  let least = Infinity;
  for (const { x, y } of dungeonRoomCells(chamber))
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const [nx, ny] = [x + dx, y + dy];
      if (dungeonRoomHas(chamber, nx, ny) || !dungeonWalkable(cells, nx, ny) || !dungeonWalkable(cells, x, y)) continue;
      // Never the crawl: the throat is held at the mouth, the crawl left as the quiet way round.
      if (map.lairCrawl && map.lairCrawl.x === nx && map.lairCrawl.y === ny) continue;
      const at = steps[ny * cells.width + nx]!;
      if (at < 0 || at >= least) continue;
      least = at;
      into = map.rooms.findIndex((room, index) => index !== heart && dungeonRoomHas(room, nx, ny));
    }
  return lairThroat(areas, map, site, setting, into);
}

// ── What the game keeps of a site ──

/** A site as the game keeps it: its band, set the first time the party went in, and what the party
 *  cleared (area number to the game day it was cleared). */
export const gameDungeonSiteStateSchema = z
  .object({
    band: z.object({ low: z.number().int().min(1).max(40), high: z.number().int().min(1).max(40) }).strict(),
    fate: z.enum(DUNGEON_SITE_FATES).optional(),
    /** Area keys (dungeonAreaKey: "5" on the first floor, "2:5" below) to the day each was cleared. */
    cleared: z.record(z.string().regex(/^(\d:)?\d{1,2}$/u), z.number().int().min(0)).default({}),
    /** The heart's leader is dead and stays dead. */
    leaderDead: z.literal(true).optional(),
    /** The holders are gone for good (owner 2026-11-13): people who lost their chief, or driven out by the
     *  story. Their posts stand empty or squatters take them, and they never come back. */
    displaced: z.literal(true).optional(),
    /** A creature's lair (owner 2026-11-18): the kind, set at the first entry when the site's seed drew one
     *  and its band is high enough for a boss, or by the story's `[site: lair=]`. */
    lair: z.enum(DUNGEON_LAIR_KINDS).optional(),
    /** A cold lair: the seed drew one but the land is too tame for a boss, its maker long gone. */
    lairCold: z.literal(true).optional(),
  })
  .strict();
export type GameDungeonSiteState = z.infer<typeof gameDungeonSiteStateSchema>;

/** Whether a new site is a creature's lair (owner 2026-11-18), as its maps were laid out: awake where its band
 *  is high enough for a boss, else cold, its maker long gone. Nothing when the seed drew no lair. */
export function dungeonSiteLairState(
  kind: DungeonLairKind | undefined,
  band: DungeonLevelBand,
): Pick<GameDungeonSiteState, "lair" | "lairCold"> {
  if (!kind) return {};
  return band.low >= DUNGEON_LAIR_MIN_LEVEL ? { lair: kind } : { lair: kind, lairCold: true };
}

/** The key a map's site is kept under: its world place, else its name. */
export function gameDungeonSiteKey(map: Pick<GameDungeonMap, "place" | "name">): string {
  return map.place ?? `name:${map.name.trim().toLowerCase()}`;
}

/** At most this many sites are kept; the oldest go first. */
export const GAME_DUNGEON_SITES_MAX = 64;

export function gameDungeonSitesFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): Record<string, GameDungeonSiteState> {
  const raw = metadata?.gameDungeonSites;
  if (!raw || typeof raw !== "object") return {};
  const kept: Record<string, GameDungeonSiteState> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const parsed = gameDungeonSiteStateSchema.safeParse(value);
    if (parsed.success) kept[key] = parsed.data;
  }
  return kept;
}

/** The sites with one set or changed, the oldest dropped past the limit. */
export function gameDungeonSitesWith(
  sites: Record<string, GameDungeonSiteState>,
  key: string,
  state: GameDungeonSiteState,
): Record<string, GameDungeonSiteState> {
  const { [key]: _old, ...rest } = sites;
  const entries = [...Object.entries(rest), [key, state] as const];
  return Object.fromEntries(entries.slice(-GAME_DUNGEON_SITES_MAX));
}

/** How many levels a planned building's level is from the one it is entered on: its floor, for its band. */
export function dungeonPlannedFloor(map: GameDungeonMap): number {
  if (!map.site) return map.floor ?? 1;
  const entry = map.site.levels.findIndex((level) => level.depth === 0);
  return 1 + Math.abs(map.site.level - Math.max(0, entry));
}

/** A planned building's areas (building plans, 2026-11-14): who is in each room by what it is for. The
 *  heart is the plan's heart room; the holders keep their own rooms and their posts; squatters take the
 *  neglected ones; quiet rooms are safe to rest in. Levels further from the way in stand deeper in the band. */
function plannedAreas(map: GameDungeonMap, site: DungeonSite, setting: MarinaraBestiarySetting): DungeonArea[] {
  const level = map.site!.level;
  const band = dungeonFloorBand(site.band, dungeonPlannedFloor(map));
  const cells = dungeonFromGameDungeonMap(map);
  // Steps from where the party comes onto the level, through locked doors too.
  const passable = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= cells.width || y >= cells.height) return false;
    const i = y * cells.width + x;
    return dungeonWalkable(cells, x, y) || (cells.ground[i] === "floor" && cells.props[i] === SITE_LOCK_PROP);
  };
  const steps = new Int32Array(cells.width * cells.height).fill(-1);
  const start = map.entrance.y * cells.width + map.entrance.x;
  steps[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const c = queue[head]!;
    const x = c % cells.width;
    const y = (c - x) / cells.width;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const next = (y + dy) * cells.width + x + dx;
      if (!passable(x + dx, y + dy) || steps[next] !== -1) continue;
      steps[next] = steps[c]! + 1;
      queue.push(next);
    }
  }
  const distance = map.rooms.map((room) => {
    let best = -1;
    for (const { x, y } of dungeonRoomCells(room)) {
      const at = steps[y * cells.width + x]!;
      if (at >= 0 && (best < 0 || at < best)) best = at;
    }
    return best;
  });
  const far = Math.max(1, ...distance);
  const random = marinaraRandom(`${map.seed}:planned:${level}:${site.holder}:${band.low}`);
  const areas: DungeonArea[] = map.rooms.map((_, index) => {
    const info = map.roomInfo![index]!;
    const area = index + 1;
    const key = dungeonAreaKey(level + 1, area);
    const level_ = Math.round(band.low + ((band.high - 1 - band.low) * Math.max(0, distance[index]!)) / far);
    if (info.heart) {
      const top = marinaraEnemyFamily(site.leader ?? site.holder)!;
      const head = group(top.id, top.tiers.includes("boss") ? "boss" : "elite", band.high, 1);
      const guard = site.lair
        ? []
        : group(site.holder, "standard", band.high, site.leader ? 2 : 1 + Math.floor(random() * 2));
      return {
        area,
        key,
        role: "heart",
        level: band.high,
        foes: fitted(setting, band.high, [...head, ...guard], "hard"),
      };
    }
    // A lone sentry, a pair or a squad of three, not always two (panel 2026-11-17).
    // A squad of three is led now and then by one of the family's elites, a sergeant over two (panel round
    // 29: every group of guards alike).
    const holders = () => {
      const count = 1 + Math.floor(random() * 3);
      const lead = count === 3 && marinaraEnemyFamily(site.holder)?.tiers.includes("elite") && random() < 0.5;
      return fitted(
        setting,
        level_,
        lead
          ? [...group(site.holder, "elite", level_, 1), ...group(site.holder, "standard", level_, 2)]
          : group(site.holder, "standard", level_, count),
        "normal",
      );
    };
    // Guards by what the room is for (gamer panel 2026-11-17): the gate and the gatehouse always held, a
    // barracks full, a stairwell mostly clear (a way up or down is not always a fight), a tower or the wall
    // walk now and then.
    const base = info.name.replace(/ \d+$/, "");
    if (base === "Gate passage" || base === "Gatehouse")
      return { area, key, role: "guard", level: level_, foes: holders() };
    if (base === "Barracks" || base === "Guardroom" || base === "Guard room")
      return {
        area,
        key,
        role: "guard",
        level: level_,
        foes: fitted(setting, level_, group(site.holder, "standard", level_, 3 + Math.floor(random() * 2)), "normal"),
      };
    if (SITE_STAIR_ROOMS.has(base)) return { area, key, role: "empty", level: level_, foes: [] };
    // The room the party walks into is never a fight on arrival (DM panel 2026-11-17).
    if (distance[index]! >= 0 && distance[index]! <= 2) return { area, key, role: "empty", level: level_, foes: [] };
    switch (info.use) {
      case "post":
        // A corner tower or a stretch of wall walk only now and then: the patrol keeps the walk, and a lone
        // figure in every tower reads as decoration (panel round 30).
        return random() < (base === "Corner tower" || base === "Wall walk" ? 0.25 : 1)
          ? { area, key, role: "guard", level: level_, foes: holders() }
          : { area, key, role: "empty", level: level_, foes: [] };
      // Guards keep the posts and some of the rooms they live in, not every room (panel 2026-11-16).
      case "holders":
        return random() < 0.4
          ? { area, key, role: "guard", level: level_, foes: holders() }
          : { area, key, role: "empty", level: level_, foes: [] };
      case "squat":
        return random() < 0.35
          ? { area, key, role: "lair", level: level_, foes: squatRoster(site, setting, level_, random) }
          : { area, key, role: "empty", level: level_, foes: [] };
      case "quiet":
        return { area, key, role: "rest", level: level_, foes: [] };
      case "open":
        return random() < 0.3
          ? { area, key, role: "lair", level: level_, foes: squatRoster(site, setting, level_, random) }
          : { area, key, role: "empty", level: level_, foes: [] };
      default:
        return random() < 0.2
          ? { area, key, role: "lair", level: level_, foes: squatRoster(site, setting, level_, random) }
          : { area, key, role: "empty", level: level_, foes: [] };
    }
  });
  plannedRoutes(
    map,
    cells,
    passable,
    areas,
    (index) => distance[index]! >= 0 && distance[index]! <= 2,
    (index) => {
      const level_ = areas[index]!.level;
      return fitted(setting, level_, group(site.holder, "standard", level_, 1 + Math.floor(random() * 2)), "normal");
    },
  );
  // A patrol on the floor's long walk (owner 2026-11-17, "Routes and guard posts"): the wall walk most of the
  // time, else a long passage or gallery now and then; never on the quiet way, never by the way in.
  const walks = map.rooms
    .map((room, n) => ({ n, room, info: map.roomInfo![n]! }))
    .filter(
      ({ n, room, info }) =>
        PATROL_WALKS.test(info.name.replace(/ \d+$/u, "")) &&
        !info.quiet &&
        info.use !== "quiet" &&
        !info.heart &&
        !info.post &&
        Math.max(room.w, room.h) >= 6 &&
        !(distance[n]! >= 0 && distance[n]! <= 2),
    )
    .sort((p, q) => Math.max(q.room.w, q.room.h) - Math.max(p.room.w, p.room.h));
  const beat = walks[0];
  if (beat && random() < (/^Wall walk/u.test(beat.info.name) ? 0.85 : 0.6)) {
    const level_ = areas[beat.n]!.level;
    const foes =
      areas[beat.n]!.role === "guard" && areas[beat.n]!.foes.length
        ? areas[beat.n]!.foes
        : fitted(setting, level_, group(site.holder, "standard", level_, 1 + Math.floor(random() * 2)), "normal");
    areas[beat.n] = { ...areas[beat.n]!, role: "guard", patrol: true, foes };
  }
  // A guard standing on a wall walk the patrol does not keep walks it too.
  for (const [n, area] of areas.entries())
    if (area.role === "guard" && !area.patrol && /^Wall walk/u.test(map.roomInfo![n]!.name))
      areas[n] = { ...area, patrol: true };
  // Set-ups by hand, not a pair in every room (owner 2026-11-18, "Authored guard set-ups"; panel rounds 35-36).
  const near = (n: number) => distance[n]! >= 0 && distance[n]! <= 2;
  const baseOf = (n: number) => map.roomInfo![n]!.name.replace(/ \d+$/u, "");
  const lone = (n: number) =>
    fitted(setting, areas[n]!.level, group(site.holder, "standard", areas[n]!.level, 1), "normal");
  // A barracks off watch: its sleepers lie in their beds, to be crept past or caught unready.
  for (const [n, area] of areas.entries())
    if (area.role === "guard" && baseOf(n) === "Barracks" && random() < 0.65) areas[n] = { ...area, asleep: true };
  // A hall with a gallery: one sentry up on it over the floor, the room's only watch.
  const raised = map.gallery ?? [];
  for (const [n, room] of map.rooms.entries()) {
    if (!raised.some(({ x, y }) => dungeonRoomHas(room, x, y))) continue;
    const area = areas[n]!;
    const info = map.roomInfo![n]!;
    if (area.role === "heart" || area.patrol || near(n) || info.quiet || info.use === "quiet") continue;
    if (area.role === "guard" || ((area.role === "empty" || area.role === "lair") && random() < 0.8))
      areas[n] = { ...area, role: "guard", gallery: true, foes: lone(n) };
  }
  // Guards kept to a few rooms that matter: the gate, the barracks, the held post, the gallery, the heart, the
  // way down and the patrols; of the rest, one room kept, the others left (a pair in every room read as
  // spread evenly, not placed).
  const keep = (n: number) => {
    const area = areas[n]!;
    return (
      area.role !== "guard" ||
      area.patrol ||
      area.gallery ||
      area.wayDown ||
      !!map.roomInfo![n]!.post ||
      /^(Gate passage|Gatehouse|Barracks|Guardroom|Guard room)$/u.test(baseOf(n))
    );
  };
  const loose = areas.map((_, n) => n).filter((n) => !keep(n));
  for (const n of loose.slice(1)) areas[n] = { ...areas[n]!, role: "empty", foes: [] };
  // A sentry walking the way round (panel round 36: a way past with nothing on it is no choice): the longest
  // room on it now and then has one guard pacing it, so crossing it is a matter of timing.
  const crossing = map.rooms
    .map((room, n) => ({ n, long: Math.max(room.w, room.h) }))
    .filter(
      ({ n, long }) =>
        map.roomInfo![n]!.quiet &&
        map.roomInfo![n]!.use !== "quiet" &&
        !map.roomInfo![n]!.heart &&
        long >= 6 &&
        !near(n),
    )
    .sort((p, q) => q.long - p.long)[0];
  // Each floor its own set-up (owner 2026-11-18, "Vary each floor's set-up"; panel round 38: every floor ran
  // the same beats): the post held with the way round free; the post walked by a patrol rather than held;
  // the post's holders asleep at it; or the post held and the way round watched as well.
  const roll = random();
  const setup = roll < 0.35 ? "held" : roll < 0.55 ? "walked" : roll < 0.75 ? "sleeping" : "watched";
  const post = map.roomInfo!.findIndex((info) => info.post);
  if (post >= 0 && areas[post]!.role === "guard" && !areas[post]!.gallery) {
    if (setup === "walked") areas[post] = { ...areas[post]!, patrol: true };
    if (setup === "sleeping") areas[post] = { ...areas[post]!, asleep: true };
  }
  if (crossing && (setup === "watched" || (setup === "held" && random() < 0.4)))
    areas[crossing.n] = { ...areas[crossing.n]!, role: "guard", patrol: true, foes: lone(crossing.n) };
  // The gate now and then lightly kept: one at the gate, its guardrooms dozing.
  if (random() < 0.4)
    for (const [n, area] of areas.entries()) {
      if (area.role !== "guard") continue;
      if (/^(Gate passage|Gatehouse)$/u.test(baseOf(n))) areas[n] = { ...area, foes: lone(n) };
      else if (/^(Guardroom|Guard room)$/u.test(baseOf(n)) && random() < 0.6) areas[n] = { ...area, asleep: true };
    }
  return lairThroat(areas, map, site, setting);
}

/** The long walks a patrol keeps. */
const PATROL_WALKS =
  /^(Wall walk|Screens passage|Cloister walk|Gallery|Long gallery|Ambulatory|Catacomb|Burial hall|Undercroft)$/u;

/**
 * The way across a floor and the way round it (owner 2026-11-17, "Routes and guard posts"): the shortest way
 * from where the party comes onto the floor to the way on is the main way, and the holders keep one room on
 * it, the one where it narrows; a second way that misses the main way's rooms, where the floor has one, is
 * the quiet way, its rooms left to nobody (no holders, no squatters) so a careful party can go round.
 */
function plannedRoutes(
  map: GameDungeonMap,
  cells: ReturnType<typeof dungeonFromGameDungeonMap>,
  passable: (x: number, y: number) => boolean,
  areas: DungeonArea[],
  near: (index: number) => boolean,
  postFoes: (index: number) => MarinaraEncounterFoe[],
): void {
  // The floor's own plan of it, where it was laid with one: its post held, its way round left to nobody.
  const post = map.roomInfo?.findIndex((info) => info.post) ?? -1;
  if (post >= 0) {
    for (const [n, info] of map.roomInfo!.entries())
      if (info.quiet && areas[n]!.role !== "heart") areas[n] = { ...areas[n]!, role: "empty", foes: [] };
    if (areas[post]!.role !== "heart" && !near(post) && !(areas[post]!.role === "guard" && areas[post]!.foes.length))
      areas[post] = { ...areas[post]!, role: "guard", foes: postFoes(post) };
    return;
  }
  const width = cells.width;
  const size = width * cells.height;
  const owner = new Int32Array(size).fill(-1);
  for (const [n, room] of map.rooms.entries()) for (const { x, y } of dungeonRoomCells(room)) owner[y * width + x] = n;
  const start = map.entrance.y * width + map.entrance.x;
  const walk = (blocked: (n: number) => boolean) => {
    const back = new Int32Array(size).fill(-2);
    back[start] = -1;
    const queue = [start];
    for (let head = 0; head < queue.length; head++) {
      const c = queue[head]!;
      const x = c % width;
      const y = (c - x) / width;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const next = (y + dy) * width + x + dx;
        if (!passable(x + dx, y + dy) || back[next] !== -2) continue;
        if (owner[next]! >= 0 && blocked(owner[next]!)) continue;
        back[next] = c;
        queue.push(next);
      }
    }
    return back;
  };
  const roomsOn = (back: Int32Array, to: number) => {
    const out: number[] = [];
    for (let c = to; c >= 0; c = back[c]!) if (owner[c]! >= 0 && out.at(-1) !== owner[c]) out.push(owner[c]!);
    return out.reverse();
  };
  const all = walk(() => false);
  // The way on: the link farthest from where the party comes in.
  const steps = (to: number) => {
    let k = 0;
    for (let c = to; c >= 0 && all[c] !== -2; c = all[c]!) k++;
    return k;
  };
  const ways = (map.links ?? [])
    .map((link) => link.y * width + link.x)
    .filter((c) => c !== start && all[c] !== -2)
    .sort((a, b) => steps(b) - steps(a));
  // The way on, else (a top or bottom floor) the heart, else the room farthest in.
  const heart = areas.findIndex((area) => area.role === "heart");
  const cellOf = (n: number) => {
    const room = map.rooms[n]!;
    const inner = dungeonRoomCells(room).find(({ x, y }) => all[y * width + x] !== -2);
    return inner ? inner.y * width + inner.x : undefined;
  };
  const far = map.rooms
    .map((_, n) => cellOf(n))
    .filter((c): c is number => c !== undefined && owner[c] !== owner[start])
    .sort((a, b) => steps(b) - steps(a))[0];
  const to = ways[0] ?? (heart >= 0 && owner[start] !== heart ? cellOf(heart) : undefined) ?? far;
  if (to === undefined) return;
  const name = (n: number) => (map.roomInfo?.[n]?.name ?? "").replace(/ \d+$/u, "");
  // Only rooms can be held across the way; a passage, a walk or an open court is gone along, not kept.
  const room = (n: number) =>
    map.roomInfo?.[n]?.use !== "open" &&
    !/passage|walk|corridor|cloister/iu.test(name(n)) &&
    !SITE_STAIR_ROOMS.has(name(n));
  // The main way: the shortest walk there, through whatever rooms it crosses.
  const main = roomsOn(all, to);
  // The room the party walks into and the one it makes for are the ends of the way, not on it.
  const ends = new Set([owner[start]!, owner[to]!, main[0] ?? -1, main.at(-1) ?? -1]);
  const fixed = (n: number) =>
    areas[n]!.role === "heart" || SITE_STAIR_ROOMS.has(name(n)) || /^(Gate passage|Gatehouse)$/u.test(name(n));
  const inner = main.filter((n) => !ends.has(n) && n >= 0 && room(n) && !fixed(n));
  if (!inner.length) return;
  // The main way is held at one room, the one a way round can miss: of its rooms, the smallest that a walk
  // avoiding it (and every other room the holders keep off the main way) still gets past.
  const guarded = (n: number) => (areas[n]!.role === "guard" || areas[n]!.role === "lair") && areas[n]!.foes.length > 0;
  const candidates = inner
    .filter((n) => !near(n) && map.roomInfo?.[n]?.use !== "quiet")
    .sort((a, b) => map.rooms[a]!.w * map.rooms[a]!.h - map.rooms[b]!.w * map.rooms[b]!.h);
  for (const choke of candidates) {
    // The way round misses the post; any other holders on it are moved off it below.
    const avoid = new Set([choke]);
    const round = walk((n) => avoid.has(n));
    if (round[to] === -2) continue;
    // Held there; the main way's other rooms left to their own (a cook, a clerk), the quiet way left to nobody.
    for (const n of inner) if (n !== choke && guarded(n)) areas[n] = { ...areas[n]!, role: "empty", foes: [] };
    if (!guarded(choke)) areas[choke] = { ...areas[choke]!, role: "guard", foes: postFoes(choke) };
    for (const n of roomsOn(round, to))
      if (!ends.has(n) && !fixed(n) && n !== choke) areas[n] = { ...areas[n]!, role: "empty", foes: [] };
    return;
  }
  // No way round: the main way held where it narrows, unless it is held already.
  if (inner.some(guarded)) return;
  const choke = candidates[0];
  if (choke === undefined) return;
  areas[choke] = { ...areas[choke]!, role: "guard", foes: postFoes(choke) };
}

/** Whether a site's holders think and band together (people, cunning spirits): beaten in their heart, they
 *  scatter for good rather than breed back. Beasts, vermin and the mindless come back. */
export function dungeonHoldersScatter(site: DungeonSite): boolean {
  // A lair's servants served its maker: with it dead they scatter.
  if (site.lair) return true;
  const mind = marinaraEnemyFamily(site.leader ?? site.holder)?.mind;
  return mind === "cunning" || mind === "tactical" || mind === "genius";
}

/**
 * The foes in an area now (owner 2026-11-13: places respawn after some days, unless their occupants were
 * displaced). Its roster until cleared; a cleared area stays empty DUNGEON_REFILL_DAYS days, then its
 * own come back, or squatters if the holders are gone (a fresh roll each time it was cleared). With the
 * holders displaced, their posts not yet cleared hold squatters or nobody. The heart, once cleared or its
 * leader dead, stays empty.
 */
export function dungeonAreaFoesNow(
  area: DungeonArea,
  site: DungeonSite,
  setting: MarinaraBestiarySetting,
  state: GameDungeonSiteState,
  today: number,
): MarinaraEncounterFoe[] {
  const cleared = state.cleared[area.key];
  const squat = (why: string) =>
    squatRoster(site, setting, area.level, marinaraRandom(`${area.key}:${why}:${site.holder}`));
  if (area.role === "heart") return cleared === undefined && !state.leaderDead && !state.displaced ? area.foes : [];
  if (cleared === undefined) {
    if (area.role !== "guard" || !state.displaced) return area.foes;
    return marinaraRandom(`${area.key}:left:${site.holder}`)() < 0.5 ? squat("left") : [];
  }
  if (area.role === "entry" || area.role === "rest") return [];
  if (today < cleared + DUNGEON_REFILL_DAYS) return [];
  if (area.role === "guard" && !state.displaced) return area.foes;
  return squat(`refill:${cleared}`);
}

/** A site's state after the party won the fight in an area: cleared that day, and a heart's leader dead,
 *  its holders displaced when they are ones to scatter. */
export function dungeonSiteAfterWin(
  state: GameDungeonSiteState,
  site: DungeonSite,
  area: Pick<DungeonArea, "key" | "role">,
  today: number,
): GameDungeonSiteState {
  const heart = area.role === "heart";
  return {
    ...state,
    cleared: { ...state.cleared, [area.key]: today },
    ...(heart ? { leaderDead: true as const } : {}),
    ...(heart && dungeonHoldersScatter(site)
      ? { displaced: true as const }
      : state.displaced
        ? { displaced: true as const }
        : {}),
  };
}

/** `[site: displaced]` in a reply: the story drove the holders of the map the party is on out (or they
 *  left); they never come back. */
export function readGameDungeonSiteTags(text: string): { displaced: boolean; lair: DungeonLairKind | null } {
  return { displaced: /\[site:\s*displaced\s*\]/iu.test(text), lair: readGameDungeonLairTag(text) };
}

/** The area a cell is in (1-based), or 0 in a passage. */
export function dungeonAreaNumberAt(map: Pick<GameDungeonMap, "rooms">, at: { x: number; y: number }): number {
  return map.rooms.findIndex((room) => dungeonRoomHas(room, at.x, at.y)) + 1;
}

/** A roster in words: "3 Mire Rats (minion, level 4), Bone Knight (boss, level 8)". */
export function dungeonRosterWords(foes: readonly MarinaraEncounterFoe[], setting: MarinaraBestiarySetting): string {
  const counted = new Map<string, number>();
  for (const foe of foes) {
    const family = marinaraEnemyFamily(foe.familyId);
    const name = (family && marinaraEnemyName(family, setting, foe.level)) ?? foe.familyId;
    const key = `${name} [${foe.familyId}] (${foe.tier}, level ${foe.level})`;
    counted.set(key, (counted.get(key) ?? 0) + 1);
  }
  return [...counted].map(([key, count]) => (count > 1 ? `${count}x ${key}` : key)).join(", ");
}

/** What the Game Master is told of a creature's lair: whose it is, what the land round it shows, and what
 *  the lair does in a fight in its heart; for a cold one, only that it was one. */
export function dungeonLairPromptLines(
  site: DungeonSite,
  state: Pick<GameDungeonSiteState, "lair" | "lairCold" | "leaderDead">,
  setting: MarinaraBestiarySetting,
): string[] {
  if (!state.lair) return [];
  const spec = DUNGEON_LAIRS[state.lair];
  // No maker of the kind lives in this setting at this band: a plain site.
  if (!state.lairCold && !site.lair) return [];
  if (state.lairCold || !site.lair)
    return [
      `This place was once ${spec.label}, its maker long gone: its signs remain (the deepest floor shaped round it, old marks, what it left behind), but nothing of it lives here now. In the heart, for a party that searches it, lies ${DUNGEON_LAIR_LEAVINGS[state.lair]}: give it when they look, so the long walk down pays.`,
    ];
  const family = marinaraEnemyFamily(site.lair.maker);
  const name = (family && marinaraEnemyName(family, setting, site.band.high)) ?? site.lair.maker;
  const title = dungeonLairTitle(site.lair.kind, setting);
  if (state.leaderDead)
    return [
      `This place was ${spec.label}; its maker, the ${name}, is dead, and its servants have scattered. The land round it is slowly healing.`,
    ];
  return [
    `THIS IS ${spec.label.toUpperCase()}: the heart is its maker's alone, the ${name} [${site.lair.maker}]${
      title ? `, which here is a ${title}: write it as one` : ""
    }, fought as a boss in its own lair; the rest of the place is held by its servants.`,
    `The land round it: ${spec.region}`,
    `In the heart: ${spec.field} A fight there is fought in the lair.`,
  ];
}

const FATE_WORDS: Record<DungeonSiteFate, string> = {
  war: "war",
  sickness: "plague",
  famine: "famine",
  flood: "flood",
};

/**
 * What the Game Master is told of the site: who holds it, every area's foes now (the party has seen only
 * where it stands), and the rule that fights here are fought by these foes and no others.
 */
export function dungeonSpawnPromptText(input: {
  map: GameDungeonMap;
  site: DungeonSite;
  areas: readonly DungeonArea[];
  state: GameDungeonSiteState;
  setting: MarinaraBestiarySetting;
  today: number;
  partyLevel?: number;
}): string {
  const { map, site, setting } = input;
  if (!input.areas.length) return "";
  const holderFamily = marinaraEnemyFamily(site.holder);
  const holderName = (holderFamily && marinaraEnemyName(holderFamily, setting, site.band.low)) ?? site.holder;
  const here = dungeonAreaNumberAt(map, map.at);
  const floor = map.floor ?? 1;
  const floors = map.floors ?? 1;
  const floorBand = dungeonFloorBand(site.band, floor);
  const floorLine =
    floors > 1
      ? ` This is floor ${floor} of ${floors}, its foes levels ${floorBand.low}-${floorBand.high}; each floor down is deadlier.`
      : "";
  const lines = [
    input.state.displaced
      ? `WHO IS IN ${map.name.toUpperCase()}: a ${site.origin} once held by ${holderName}, who are gone for good; only squatters remain. Foes here are levels ${site.band.low}-${site.band.high}, fixed by the world and never by the party.${floorLine}`
      : `WHO IS IN ${map.name.toUpperCase()}: a ${site.origin} held by ${holderName}${
          site.fate ? `, since the ${FATE_WORDS[site.fate]} that touched it` : ""
        }; foes here are levels ${site.band.low}-${site.band.high}, fixed by the world and never by the party.${floorLine}`,
  ];
  for (const area of input.areas) {
    const foes = dungeonAreaFoesNow(area, site, setting, input.state, input.today);
    const role =
      area.role === "heart"
        ? " (the heart)"
        : area.wayDown
          ? " (the way down)"
          : area.role === "rest"
            ? " (quiet: safe to rest)"
            : area.asleep
              ? " (asleep: a careful party can slip past or catch them unready)"
              : area.gallery
                ? " (one sentry watching from the gallery above the floor)"
                : area.patrol
                  ? " (on patrol: walking its length back and forth)"
                  : "";
    const where = area.area === here ? " (the party is here)" : "";
    const who = foes.length
      ? dungeonRosterWords(foes, setting)
      : input.state.cleared[area.key] !== undefined
        ? "cleared"
        : "nobody";
    lines.push(`- Area ${area.area}${role}${where}: ${who}.`);
  }
  lines.push(...dungeonLairPromptLines(site, input.state, setting));
  lines.push(
    "A fight in an area is fought by that area's foes exactly as listed, with their family ids, tiers and levels; never add, swap or level them, and never spawn a creature a player asks for that is not listed. Foes in other areas are unseen until the party goes there: hint at them (sounds, tracks, smells), never reveal them outright.",
  );
  if (!input.state.displaced)
    lines.push(
      `If the story drives ${holderName} out of this place for good (they flee, make peace and leave, are bought off), write [site: displaced]; they will not come back.`,
    );
  if (!input.state.lair && !input.state.displaced)
    lines.push(
      "If the story makes this place a great creature's lair (a dragon's hoard, a lich's sanctum, a vampire's haven, a great beast's den, a fiend's breach, a drowned hall, a hive), write [site: lair=dragon] (or lich, vampire, beast, fiend, drowned, hive): its heart becomes that creature's.",
    );
  if (input.partyLevel !== undefined && input.partyLevel + 3 < site.band.low)
    lines.push(
      `This place is far beyond the party (level ${Math.round(input.partyLevel)}): show it plainly through the signs at its way in, and let them turn back.`,
    );
  return lines.join("\n");
}
