// Building plans for dungeon sites (owner 2026-11-14, "Dungeon building plans: design"): a site is planned
// once as a whole building, its levels, their zones and their rooms each with a purpose, from what the
// place is, how rich its builder was, the land it stands on and what history did to it. Each level is then
// laid out as its own map from the plan: one footprint shared by every level, its stairs at the same cells
// on every level they join, rooms off a hall, so a mansion has a cellar, a ground floor with its hall and
// kitchen, an upper floor of bedrooms and a guest wing, and an attic. Pure and seeded: the same input
// always gives the same building.

import { marinaraRandom } from "../marinara-classes.js";
import {
  DUNGEON_EXIT_PROP,
  DUNGEON_SECRET_DOOR_PROP,
  gameDungeonMapFromDungeon,
  type DungeonGround,
  type DungeonMap,
  type DungeonRoom,
  type GameDungeonMap,
} from "./dungeon-map.js";

/** The kinds of place built to a plan. Caves, mines, sewers, ruins and stations keep their carved maps. */
export const SITE_TEMPLATE_IDS = ["manor", "keep", "temple", "crypt"] as const;
export type SiteTemplateId = (typeof SITE_TEMPLATE_IDS)[number];

/** What a room is for, as the spawns read it: the heart (the leader's room), the holders' own rooms,
 *  their posts at the chokepoints, rooms left to squatters, quiet rooms, stores, and open ground. */
export const SITE_ROOM_USES = ["heart", "holders", "post", "squat", "quiet", "store", "open"] as const;
export type SiteRoomUse = (typeof SITE_ROOM_USES)[number];

/** How a site stands on its land (from the world cell it is on). */
export const SITE_TERRAINS = ["hill", "coast", "wet", "city"] as const;
export type SiteTerrain = (typeof SITE_TERRAINS)[number];

/** The fates history can leave on a site (as dungeon spawns read them). */
export type SiteFate = "war" | "sickness" | "famine" | "flood";

/** Ways between levels: the main stair, the servants' stair, a ladder, a hidden stair, a collapsed floor. */
export const SITE_LINK_KINDS = ["stairs", "servants", "ladder", "hidden", "hole"] as const;
export type SiteLinkKind = (typeof SITE_LINK_KINDS)[number];

/** Prop slots every building set shares (dungeon_crypt's own slots agree: 4 a trap, 6 a portcullis). */
export const SITE_LOCK_PROP = 6;
export const SITE_RUBBLE_PROP = 7;

interface RoomSpec {
  name: string;
  use: SiteRoomUse;
  /** 1 small, 2 medium, 3 large: its share of the band it stands in. */
  size: 1 | 2 | 3;
  /** Public rooms stand near the way in, private ones at the far end. */
  zone: "public" | "service" | "private" | "guest" | "deep";
  /** The least wealth (1-3) a builder needs for it. */
  wealth?: 2 | 3;
  /** The odds it is there at all (1 when omitted). */
  chance?: number;
  /** Its door is locked, its key somewhere else on the level. */
  locked?: true;
  /** It is the heart, when the plan puts it here. */
  heart?: true;
  /** Prop slots its furniture is drawn from, against its walls. */
  furniture: readonly number[];
  /** How many of it (1 when omitted): at least, at most. */
  count?: readonly [number, number];
}

interface LevelSpec {
  id: string;
  name: string;
  /** 0 is the level the way in is on; up is positive. */
  depth: number;
  rooms: readonly RoomSpec[];
  wealth?: 2 | 3;
  chance?: number;
  /** Laid out narrower than the footprint (an attic under the roof). */
  inset?: true;
  /** Only when something says so (a crypt under a mansion with undead in it, a hillside's rock cellar). */
  when?: "undead" | "hill";
  /** Never on wet ground. */
  dry?: true;
}

interface TemplateSpec {
  id: SiteTemplateId;
  /** The map look its levels use, by the setting's art family. */
  set: string;
  /** Footprint (width, height) by wealth 1-3; every level shares it. */
  footprint: readonly [readonly [number, number], readonly [number, number], readonly [number, number]];
  levels: readonly LevelSpec[];
}

// Furniture slots, by the building sets' props: 0 table, 1 bed, 2 shelves, 3 hearth, 4 chest or barrel.
// The crypt's: 0 sarcophagus, 1 skeleton, 2 torch stand, 3 chest, 7 pillar.
const T = 0,
  BED = 1,
  SHELF = 2,
  FIRE = 3,
  CHEST = 4;

const TEMPLATES: Record<SiteTemplateId, TemplateSpec> = {
  manor: {
    id: "manor",
    set: "building_manor",
    footprint: [
      [30, 19],
      [38, 23],
      [46, 27],
    ],
    levels: [
      {
        id: "attic",
        name: "Attic",
        depth: 2,
        wealth: 2,
        inset: true,
        rooms: [
          { name: "Attic store", use: "squat", size: 2, zone: "service", furniture: [CHEST], count: [1, 2] },
          { name: "Servants' garret", use: "squat", size: 1, zone: "service", furniture: [BED], count: [1, 2] },
        ],
      },
      {
        id: "upper",
        name: "Upper floor",
        depth: 1,
        rooms: [
          { name: "Gallery", use: "post", size: 2, zone: "public", furniture: [SHELF] },
          {
            name: "Master bedroom",
            use: "holders",
            size: 3,
            zone: "private",
            heart: true,
            furniture: [BED, CHEST, FIRE],
          },
          { name: "Dressing room", use: "store", size: 1, zone: "private", furniture: [CHEST] },
          { name: "Bedroom", use: "holders", size: 2, zone: "private", furniture: [BED, CHEST], count: [1, 2] },
          { name: "Guest bedroom", use: "holders", size: 2, zone: "guest", furniture: [BED], count: [1, 3] },
          { name: "Nursery", use: "squat", size: 1, zone: "private", chance: 0.5, furniture: [BED, CHEST] },
          { name: "Bathroom", use: "squat", size: 1, zone: "guest", wealth: 2, furniture: [CHEST] },
        ],
      },
      {
        id: "ground",
        name: "Ground floor",
        depth: 0,
        rooms: [
          { name: "Entrance hall", use: "post", size: 2, zone: "public", furniture: [T] },
          { name: "Great hall", use: "holders", size: 3, zone: "public", furniture: [T, FIRE] },
          { name: "Dining room", use: "holders", size: 2, zone: "public", furniture: [T, T] },
          { name: "Ballroom", use: "holders", size: 3, zone: "public", wealth: 3, furniture: [] },
          { name: "Kitchen", use: "holders", size: 2, zone: "service", furniture: [FIRE, T, CHEST] },
          { name: "Pantry", use: "store", size: 1, zone: "service", furniture: [CHEST, SHELF] },
          { name: "Servants' hall", use: "holders", size: 2, zone: "service", furniture: [T, BED] },
          { name: "Library", use: "quiet", size: 2, zone: "private", wealth: 2, furniture: [SHELF, SHELF, T] },
          { name: "Study", use: "quiet", size: 1, zone: "private", locked: true, furniture: [T, SHELF] },
          { name: "Chapel", use: "quiet", size: 1, zone: "private", chance: 0.5, furniture: [T] },
        ],
      },
      {
        id: "cellar",
        name: "Cellar",
        depth: -1,
        dry: true,
        rooms: [
          { name: "Wine cellar", use: "squat", size: 3, zone: "service", furniture: [CHEST, CHEST, SHELF] },
          { name: "Store room", use: "squat", size: 2, zone: "service", furniture: [CHEST], count: [1, 2] },
          { name: "Cold room", use: "store", size: 1, zone: "service", furniture: [SHELF] },
          { name: "Vault", use: "store", size: 1, zone: "deep", wealth: 2, locked: true, furniture: [CHEST, CHEST] },
        ],
      },
      {
        id: "rock-cellar",
        name: "Rock cellars",
        depth: -2,
        when: "hill",
        rooms: [
          { name: "Cut cellar", use: "squat", size: 2, zone: "service", furniture: [CHEST], count: [2, 3] },
          { name: "Cistern", use: "squat", size: 2, zone: "deep", furniture: [] },
        ],
      },
      {
        id: "crypt",
        name: "Family crypt",
        depth: -3,
        when: "undead",
        rooms: [
          { name: "Family crypt", use: "holders", size: 3, zone: "deep", heart: true, furniture: [CHEST, FIRE] },
          { name: "Ossuary", use: "squat", size: 2, zone: "deep", furniture: [SHELF] },
          { name: "Tomb", use: "holders", size: 1, zone: "deep", furniture: [CHEST], count: [1, 2] },
        ],
      },
    ],
  },
  keep: {
    id: "keep",
    set: "building_keep",
    footprint: [
      [28, 21],
      [34, 25],
      [40, 29],
    ],
    levels: [
      {
        id: "top",
        name: "Tower top",
        depth: 2,
        inset: true,
        rooms: [
          { name: "Watch room", use: "post", size: 2, zone: "public", furniture: [T, CHEST] },
          { name: "Signal room", use: "squat", size: 1, zone: "private", furniture: [FIRE] },
        ],
      },
      {
        id: "upper",
        name: "Keep upper floor",
        depth: 1,
        rooms: [
          { name: "Guard room", use: "post", size: 2, zone: "public", furniture: [T, SHELF] },
          {
            name: "Lord's chamber",
            use: "holders",
            size: 3,
            zone: "private",
            heart: true,
            furniture: [BED, FIRE, CHEST],
          },
          { name: "Solar", use: "holders", size: 2, zone: "private", furniture: [T, FIRE] },
          { name: "Treasury", use: "store", size: 1, zone: "private", locked: true, furniture: [CHEST, CHEST] },
          { name: "Officers' quarters", use: "holders", size: 2, zone: "guest", furniture: [BED, BED] },
        ],
      },
      {
        id: "ground",
        name: "Keep ground floor",
        depth: 0,
        rooms: [
          { name: "Gatehouse", use: "post", size: 2, zone: "public", furniture: [SHELF] },
          { name: "Great hall", use: "holders", size: 3, zone: "public", furniture: [T, T, FIRE] },
          { name: "Barracks", use: "holders", size: 3, zone: "service", furniture: [BED, BED, CHEST] },
          { name: "Armoury", use: "store", size: 1, zone: "service", locked: true, furniture: [SHELF, SHELF] },
          { name: "Kitchen", use: "holders", size: 2, zone: "service", furniture: [FIRE, T] },
          { name: "Chapel", use: "quiet", size: 1, zone: "private", chance: 0.6, furniture: [T] },
          { name: "Stables", use: "squat", size: 2, zone: "service", chance: 0.6, furniture: [CHEST] },
        ],
      },
      {
        id: "dungeons",
        name: "Dungeons",
        depth: -1,
        dry: true,
        rooms: [
          { name: "Gaoler's room", use: "post", size: 2, zone: "public", furniture: [T, CHEST] },
          { name: "Cell", use: "squat", size: 1, zone: "deep", furniture: [BED], count: [3, 5] },
          { name: "Interrogation room", use: "holders", size: 2, zone: "deep", furniture: [T, FIRE] },
          { name: "Oubliette", use: "squat", size: 1, zone: "deep", locked: true, furniture: [] },
        ],
      },
    ],
  },
  temple: {
    id: "temple",
    set: "building_temple",
    footprint: [
      [28, 19],
      [34, 23],
      [42, 27],
    ],
    levels: [
      {
        id: "bells",
        name: "Bell tower",
        depth: 1,
        inset: true,
        chance: 0.7,
        rooms: [
          { name: "Bell chamber", use: "squat", size: 2, zone: "public", furniture: [] },
          { name: "Ringers' loft", use: "squat", size: 1, zone: "private", furniture: [CHEST] },
        ],
      },
      {
        id: "ground",
        name: "Temple floor",
        depth: 0,
        rooms: [
          { name: "Narthex", use: "post", size: 2, zone: "public", furniture: [T] },
          { name: "Nave", use: "holders", size: 3, zone: "public", furniture: [T, T, T] },
          { name: "Sanctuary", use: "holders", size: 2, zone: "private", heart: true, furniture: [BED, FIRE] },
          { name: "Vestry", use: "store", size: 1, zone: "private", locked: true, furniture: [CHEST, SHELF] },
          { name: "Cloister", use: "open", size: 3, zone: "service", furniture: [] },
          { name: "Refectory", use: "holders", size: 2, zone: "service", furniture: [T, T] },
          { name: "Monks' cells", use: "holders", size: 2, zone: "guest", furniture: [BED], count: [1, 2] },
          { name: "Scriptorium", use: "quiet", size: 2, zone: "private", wealth: 2, furniture: [SHELF, T] },
        ],
      },
      {
        id: "undercroft",
        name: "Undercroft",
        depth: -1,
        dry: true,
        rooms: [
          { name: "Undercroft", use: "squat", size: 3, zone: "public", furniture: [CHEST] },
          { name: "Ossuary", use: "squat", size: 2, zone: "deep", furniture: [SHELF] },
          { name: "Reliquary", use: "store", size: 1, zone: "deep", locked: true, furniture: [CHEST] },
          { name: "Burial vault", use: "holders", size: 2, zone: "deep", furniture: [CHEST], count: [1, 2] },
        ],
      },
    ],
  },
  crypt: {
    id: "crypt",
    set: "dungeon_crypt",
    footprint: [
      [24, 17],
      [30, 19],
      [36, 23],
    ],
    levels: [
      {
        id: "chapel",
        name: "Crypt chapel",
        depth: 0,
        rooms: [
          { name: "Vestibule", use: "post", size: 2, zone: "public", furniture: [2] },
          { name: "Mortuary chapel", use: "quiet", size: 3, zone: "public", furniture: [0, 2, 7] },
          { name: "Embalming room", use: "holders", size: 2, zone: "service", furniture: [0, 3] },
          { name: "Keeper's room", use: "store", size: 1, zone: "private", furniture: [3] },
        ],
      },
      {
        id: "burials",
        name: "Upper burials",
        depth: -1,
        rooms: [
          { name: "Burial hall", use: "holders", size: 3, zone: "public", furniture: [0, 0, 7] },
          { name: "Ossuary", use: "squat", size: 2, zone: "service", furniture: [1, 1] },
          { name: "Family vault", use: "holders", size: 1, zone: "private", furniture: [0, 3], count: [2, 3] },
          { name: "Sealed vault", use: "store", size: 1, zone: "deep", locked: true, furniture: [0, 3] },
        ],
      },
      {
        id: "deep-burials",
        name: "Deep burials",
        depth: -2,
        chance: 0.6,
        rooms: [
          { name: "Catacomb", use: "squat", size: 3, zone: "public", furniture: [1, 7] },
          { name: "Bone pit", use: "squat", size: 2, zone: "service", furniture: [1] },
          { name: "Old vault", use: "holders", size: 1, zone: "private", furniture: [0], count: [2, 3] },
        ],
      },
      {
        id: "founder",
        name: "Founder's tomb",
        depth: -3,
        wealth: 2,
        rooms: [
          { name: "Hall of guardians", use: "post", size: 3, zone: "public", furniture: [7, 7, 2] },
          { name: "Founder's tomb", use: "holders", size: 3, zone: "deep", heart: true, furniture: [0, 2, 3, 7] },
          { name: "Grave goods", use: "store", size: 1, zone: "private", locked: true, furniture: [3, 3] },
        ],
      },
    ],
  },
};

/** The map looks building plans add (fantasy and history; a science fiction building is a station). */
export const SITE_TEMPLATE_SETS: Readonly<Record<SiteTemplateId, string>> = Object.freeze(
  Object.fromEntries(SITE_TEMPLATE_IDS.map((id) => [id, TEMPLATES[id].set])) as Record<SiteTemplateId, string>,
);

/** Which template a map look is built to, or null for a carved one (caves, mines, sewers, stations). */
export function siteTemplateForSet(setId: string): SiteTemplateId | null {
  return SITE_TEMPLATE_IDS.find((id) => TEMPLATES[id].set === setId) ?? null;
}

/** What a building's spare rooms (what is left of a band) are called, by its kind. */
type SiteSpare = readonly [name: string, size: 1 | 2 | 3, furniture: readonly number[]];
/** What a space the plan has no room for is, by the kind of building and its floor. */
const SITE_SPARE_ROOMS: Record<SiteTemplateId, Record<"top" | "up" | "ground" | "below", readonly SiteSpare[]>> = {
  manor: {
    top: [
      ["Lumber room", 2, [CHEST, CHEST]],
      ["Maids' room", 1, [BED, CHEST]],
      ["Trunk room", 1, [CHEST, CHEST]],
      ["Drying loft", 3, [SHELF]],
    ],
    up: [
      ["Sitting room", 2, [T, FIRE, SHELF]],
      ["Sewing room", 1, [T, CHEST]],
      ["Linen room", 1, [SHELF, CHEST]],
      ["Long gallery", 3, [SHELF, T]],
      ["Boudoir", 1, [T, CHEST]],
      ["Governess's room", 1, [BED, T]],
    ],
    ground: [
      ["Parlour", 2, [T, FIRE, SHELF]],
      ["Morning room", 2, [T, SHELF]],
      ["Steward's office", 1, [T, SHELF, CHEST]],
      ["Scullery", 1, [T, CHEST]],
      ["Laundry", 2, [T, FIRE, CHEST]],
      ["Music room", 2, [T, SHELF]],
      ["Gun room", 1, [SHELF, CHEST]],
      ["Butler's pantry", 1, [SHELF, CHEST]],
    ],
    below: [
      ["Coal store", 2, [CHEST]],
      ["Larder", 1, [SHELF, CHEST]],
      ["Brewhouse", 2, [FIRE, CHEST, T]],
      ["Lumber cellar", 3, [CHEST, CHEST]],
    ],
  },
  keep: {
    top: [
      ["Lookout", 1, [CHEST]],
      ["Beacon platform", 2, [FIRE]],
      ["Wall walk", 3, [SHELF]],
    ],
    up: [
      ["Guest chamber", 2, [BED, CHEST, FIRE]],
      ["Wardrobe", 1, [CHEST, SHELF]],
      ["Chaplain's room", 1, [BED, T]],
      ["Muniment room", 1, [SHELF, CHEST]],
      ["Garderobe", 1, [CHEST]],
    ],
    ground: [
      ["Guardroom", 2, [T, SHELF]],
      ["Smithy", 2, [FIRE, T, CHEST]],
      ["Well house", 1, [CHEST]],
      ["Granary", 2, [CHEST, CHEST]],
      ["Bakehouse", 2, [FIRE, T]],
      ["Kennels", 1, [CHEST]],
      ["Storehouse", 3, [CHEST, SHELF]],
    ],
    below: [
      ["Storeroom", 2, [CHEST, SHELF]],
      ["Well chamber", 1, [CHEST]],
      ["Guard post", 2, [T, SHELF]],
      ["Cell", 1, [BED]],
      ["Powder store", 1, [CHEST, CHEST]],
    ],
  },
  temple: {
    top: [
      ["Belfry stair", 1, [CHEST]],
      ["Clock room", 1, [SHELF]],
      ["Bell loft", 2, [CHEST]],
    ],
    up: [
      ["Clock room", 1, [SHELF]],
      ["Gallery", 2, [SHELF]],
    ],
    ground: [
      ["Side chapel", 1, [T, SHELF]],
      ["Chantry chapel", 1, [T, FIRE]],
      ["Sacristy", 1, [CHEST, SHELF]],
      ["Almonry", 2, [T, CHEST]],
      ["Chapter house", 3, [T, T, SHELF]],
      ["Lady chapel", 2, [T, FIRE]],
    ],
    below: [
      ["Charnel", 2, [CHEST]],
      ["Store vault", 2, [CHEST, SHELF]],
      ["Crypt chapel", 2, [T, FIRE]],
      ["Relic store", 1, [CHEST]],
    ],
  },
  crypt: {
    top: [["Mourners' room", 1, [3]]],
    up: [["Mourners' room", 1, [3]]],
    ground: [
      ["Mourners' room", 2, [2, 3]],
      ["Side vault", 1, [0]],
      ["Columbarium", 2, [0, 2]],
      ["Wall tombs", 3, [0, 0, 2]],
    ],
    below: [
      ["Side vault", 1, [0]],
      ["Columbarium", 2, [0, 2]],
      ["Wall tombs", 3, [0, 0, 2]],
      ["Bone niche", 1, [1]],
      ["Charnel pit", 2, [1, 1]],
    ],
  },
};

// ── The plan ──

export interface SitePlanInput {
  template: SiteTemplateId;
  seed: number;
  /** 1 a modest house, 2 a rich one, 3 a palace. */
  wealth: 1 | 2 | 3;
  fate?: SiteFate;
  terrain?: SiteTerrain;
  /** Its holders are undead: the plan grows a crypt for them (a vampire's mansion). */
  undead?: boolean;
}

export interface SitePlanRoom {
  name: string;
  use: SiteRoomUse;
  size: 1 | 2 | 3;
  zone: RoomSpec["zone"];
  furniture: readonly number[];
  locked?: true;
  heart?: true;
  /** Burnt or broken by the site's fate: rubble in it, its wall to the hall breached. */
  ruined?: true;
}

export interface SitePlanLevel {
  id: string;
  name: string;
  depth: number;
  rooms: SitePlanRoom[];
  inset?: true;
  /** Water stands in its rooms (a flood, or wet ground under a cellar). */
  flooded?: true;
}

export interface SitePlanLink {
  /** Level indexes, top to bottom order: `upper` is above `lower`. */
  upper: number;
  lower: number;
  kind: SiteLinkKind;
}

export interface SitePlan {
  template: SiteTemplateId;
  set: string;
  seed: number;
  wealth: 1 | 2 | 3;
  /** Top to bottom. */
  levels: SitePlanLevel[];
  /** The level the way in is on. */
  entry: number;
  links: SitePlanLink[];
  /** The footprint every level shares. */
  width: number;
  height: number;
}

/** The plan of a site: the same input always gives the same building. */
export function sitePlan(input: SitePlanInput): SitePlan {
  const spec = TEMPLATES[input.template];
  const random = marinaraRandom(`site:${input.template}:${input.seed}:${input.wealth}`);
  // The footprint, a little wider or narrower and deeper or shallower than the template's, by its own
  // rolls so the rooms rolled after stay put.
  const shape = marinaraRandom(`site-shape:${input.template}:${input.seed}:${input.wealth}`);
  const [baseW, baseH] = spec.footprint[input.wealth - 1]!;
  const width = baseW + Math.round((shape() - 0.5) * 8);
  const height = baseH + Math.round((shape() - 0.5) * 4);
  const levels: SitePlanLevel[] = [];
  for (const level of spec.levels) {
    if (level.wealth && input.wealth < level.wealth) continue;
    if (level.when === "undead" && !input.undead) continue;
    if (level.when === "hill" && input.terrain !== "hill") continue;
    if (level.dry && input.terrain === "wet") continue;
    // The chance is rolled even for a level that is always there, so the rolls after stay put.
    const roll = random();
    if (level.chance !== undefined && level.depth !== 0 && roll >= level.chance) continue;
    const rooms: SitePlanRoom[] = [];
    for (const room of level.rooms) {
      const roll = random();
      if (room.wealth && input.wealth < room.wealth) continue;
      if (room.chance !== undefined && roll >= room.chance) continue;
      const [least, most] = room.count ?? [1, 1];
      const count = least + Math.floor(random() * (most - least + 1)) + (input.wealth === 3 && most > 1 ? 1 : 0);
      for (let n = 0; n < Math.min(count, most + 1); n++)
        rooms.push({
          name: count > 1 ? `${room.name} ${n + 1}` : room.name,
          use: room.use,
          size: room.size,
          zone: room.zone,
          furniture: room.furniture,
          ...(room.locked ? { locked: true as const } : {}),
          ...(room.heart ? { heart: true as const } : {}),
        });
    }
    levels.push({
      id: level.id,
      name: level.name,
      depth: level.depth,
      rooms,
      ...(level.inset ? { inset: true as const } : {}),
    });
  }
  levels.sort((a, b) => b.depth - a.depth);
  // One heart: the deepest-planned one wins (a vampire's crypt over its bedroom); the others are the
  // holders' rooms.
  const hearts = levels.flatMap((level) => level.rooms.filter((room) => room.heart));
  const heart = input.undead ? hearts.at(-1) : hearts[0];
  for (const room of hearts) if (room !== heart) delete room.heart;
  // A plan whose heart room was not built (a poor crypt has no founder's tomb) still gets one: the
  // biggest holders' room of the deepest level that has one, else the biggest room on the way in's level.
  if (!heart) {
    const pick = (rooms: SitePlanRoom[]) =>
      rooms.reduce<SitePlanRoom | undefined>((best, room) => (!best || room.size > best.size ? room : best), undefined);
    const holders = [...levels]
      .reverse()
      .map((level) => pick(level.rooms.filter((room) => room.use === "holders" && !room.locked)));
    const chosen = holders.find(Boolean) ?? pick(levels.find((level) => level.depth === 0)?.rooms ?? levels[0]!.rooms);
    if (chosen) chosen.heart = true;
  }
  // Coast: a sea cave under the lowest level.
  if (input.terrain === "coast") {
    const lowest = levels.at(-1)!;
    if (lowest.depth < 0) lowest.rooms.push({ name: "Sea cave", use: "squat", size: 2, zone: "deep", furniture: [] });
  }
  // The fate pass: what history did to the building.
  if (input.fate === "war") {
    // A breached wing: the far rooms of the way in's level burnt and broken.
    const ground = levels.find((level) => level.depth === 0)!;
    for (const room of ground.rooms.filter((each) => each.zone === "private" || each.zone === "guest"))
      if (!room.heart && !room.locked) room.ruined = true;
  }
  if (input.fate === "flood" || input.terrain === "wet") {
    const lowest = levels.at(-1)!;
    if (lowest.depth < 0 || input.fate === "flood") lowest.flooded = true;
  }
  if (input.fate === "sickness")
    for (const level of levels)
      for (const room of level.rooms) if (room.use === "quiet" && !room.locked) room.locked = true;
  if (input.fate === "famine")
    for (const level of levels)
      for (const room of level.rooms) if (room.use === "store") room.furniture = room.furniture.slice(0, 1);
  const entry = levels.findIndex((level) => level.depth === 0);
  // The ways between levels: the main stair between neighbours; a servants' stair besides in a big house;
  // a ladder to an attic or a tower top; a hidden stair to a crypt; a collapsed floor after a war.
  const links: SitePlanLink[] = [];
  for (let i = 0; i + 1 < levels.length; i++) {
    const [upper, lower] = [levels[i]!, levels[i + 1]!];
    const kind: SiteLinkKind = upper.inset ? "ladder" : lower.id === "crypt" ? "hidden" : "stairs";
    links.push({ upper: i, lower: i + 1, kind });
    if (input.wealth >= 2 && !upper.inset && kind === "stairs" && random() < 0.6)
      links.push({ upper: i, lower: i + 1, kind: "servants" });
    if (input.fate === "war" && upper.depth === 1 && lower.depth === 0)
      links.push({ upper: i, lower: i + 1, kind: "hole" });
  }
  return {
    template: input.template,
    set: spec.set,
    seed: input.seed,
    wealth: input.wealth,
    levels,
    entry,
    links,
    width,
    height,
  };
}

// ── A level laid out ──

export interface SiteLevelLink {
  x: number;
  y: number;
  /** The level it leads to. */
  level: number;
  kind: SiteLinkKind;
}

export interface SiteLevelLock {
  x: number;
  y: number;
  /** The locked room (an index into the map's rooms) and the room its key is found in. */
  room: number;
  key: number;
}

export interface SiteLevelTrap {
  x: number;
  y: number;
  /** How hard it is to find and to disarm, on the ruleset's own scale (a d20 DC). */
  dc: number;
}

export interface SiteLevelMap {
  map: DungeonMap;
  /** Each room's name and use, as the map's rooms are ordered. */
  rooms: Array<{ name: string; use: SiteRoomUse; heart?: true }>;
  links: SiteLevelLink[];
  locks: SiteLevelLock[];
  traps: SiteLevelTrap[];
}

/** The rooms that are a level's great room: the biggest space on it. */
const SITE_HALL_ROOMS = new Set(["Great hall", "Nave", "Undercroft", "Burial hall"]);
/** The rooms the way in opens into. */
/** Rooms whose tables are set end to end down the middle. */
const SITE_FEAST_ROOMS = new Set(["Great hall", "Dining room", "Refectory", "Servants' hall", "Chapter house"]);

/** Rooms where many sleep, so their beds go in rows. */
const SITE_DORMS = new Set(["Barracks", "Servants' garret", "Servants' hall", "Monks' cells", "Officers' quarters"]);

type SiteRole = "center" | "wall" | "back" | "corner" | "scatter" | "pillar" | "pews" | "seats";
// The furnishings past the first five (dungeon-map BUILDING_DRESSING), by slot.
const BARREL = 8,
  CRATE = 9,
  WARDROBE = 10,
  DESK = 11,
  BATH = 12,
  SEAT = 13,
  ANVIL = 14,
  STATUE = 15,
  RACK = 17,
  PALLET = 18,
  RANGE = 19,
  WELL = 20,
  FONT = 21,
  MANGER = 22,
  LECTERN = 23,
  ALTAR = 24,
  PEW = 25,
  TOMB = 26,
  STOOL = 27,
  CHAINS = 28,
  BUCKET = 29,
  HAY = 30,
  WINE = 31,
  BONES = 32,
  SKULLS = 33,
  JARS = 34,
  TIPPED = 35,
  SWORD = 36,
  JUG = 37,
  COBWEB = 38,
  CART = 40,
  DUMMY = 41,
  WOODPILE = 42;
type SiteRecipe = ReadonlyArray<readonly [slot: number, role: SiteRole, count?: number | "reps" | "all"]>;
const KITCHEN: SiteRecipe = [
  [RANGE, "back"],
  [T, "center", 2],
  [BARREL, "corner", 2],
  [CRATE, "corner"],
  [SHELF, "wall", 2],
];
const BEDROOM: SiteRecipe = [
  [BED, "back"],
  [WARDROBE, "wall"],
  [CHEST, "corner"],
  [DESK, "wall"],
];
const STORE: SiteRecipe = [
  [CRATE, "scatter", "reps"],
  [BARREL, "corner", 2],
  [SHELF, "wall"],
];
const CHAPEL: SiteRecipe = [
  [ALTAR, "back"],
  [PEW, "pews", "all"],
  [FIRE, "corner", 2],
];
const PARLOUR: SiteRecipe = [
  [T, "center", 1],
  [FIRE, "back"],
  [WARDROBE, "wall"],
  [SHELF, "wall"],
  [STATUE, "corner"],
];
const DORM: SiteRecipe = [
  [BED, "wall", "all"],
  [CHEST, "corner", 2],
];
/** How a room is dressed by what it is (gamer panel 2026-11-17), for every building but the crypt (its
 *  pack has its own furnishings). Rooms without a recipe use their plan's furniture. */
const SITE_RECIPES: Record<string, SiteRecipe> = {
  "Entrance hall": [
    [STATUE, "corner", 2],
    [T, "center", 1],
    [CHEST, "wall"],
  ],
  "Great hall": [
    [SEAT, "back"],
    [FIRE, "wall"],
    [T, "center", "all"],
    [STOOL, "seats", "all"],
    [STATUE, "corner", 2],
  ],
  "Dining room": [
    [T, "center", "all"],
    [STOOL, "seats", "all"],
    [FIRE, "back"],
    [WARDROBE, "wall"],
  ],
  Ballroom: [
    [STATUE, "corner", 4],
    [FIRE, "back"],
  ],
  Kitchen: KITCHEN,
  Bakehouse: KITCHEN,
  Pantry: [
    [SHELF, "wall", "reps"],
    [BARREL, "corner", 2],
    [CRATE, "corner"],
  ],
  Larder: [
    [SHELF, "wall", "reps"],
    [BARREL, "corner"],
    [CRATE, "corner"],
  ],
  "Butler's pantry": [
    [SHELF, "wall", "reps"],
    [WARDROBE, "wall"],
    [CHEST, "corner"],
  ],
  "Servants' hall": [
    [T, "center", "all"],
    [STOOL, "seats", "all"],
    [FIRE, "back"],
    [CHEST, "corner"],
  ],
  Library: [
    [SHELF, "wall", "all"],
    [DESK, "center", 1],
    [LECTERN, "center", 1],
  ],
  Study: [
    [DESK, "back"],
    [SHELF, "wall", 3],
    [CHEST, "corner"],
  ],
  "Steward's office": [
    [DESK, "back"],
    [SHELF, "wall", 2],
    [CHEST, "corner", 2],
  ],
  "Muniment room": [
    [SHELF, "wall", "reps"],
    [DESK, "center", 1],
    [CHEST, "corner", 2],
  ],
  Chapel: CHAPEL,
  "Side chapel": CHAPEL,
  "Chantry chapel": CHAPEL,
  "Lady chapel": CHAPEL,
  "Crypt chapel": CHAPEL,
  "Master bedroom": [
    [BED, "back"],
    [FIRE, "wall"],
    [WARDROBE, "wall", 2],
    [DESK, "wall"],
    [CHEST, "corner"],
  ],
  "Lord's chamber": [
    [BED, "back"],
    [FIRE, "wall"],
    [WARDROBE, "wall"],
    [DESK, "wall"],
    [CHEST, "corner", 2],
  ],
  Bedroom: BEDROOM,
  "Guest bedroom": BEDROOM,
  "Guest chamber": BEDROOM,
  "Governess's room": BEDROOM,
  "Chaplain's room": [
    [BED, "back"],
    [DESK, "wall"],
    [ALTAR, "wall"],
  ],
  Nursery: [
    [BED, "wall", 2],
    [CHEST, "corner"],
    [CRATE, "corner"],
  ],
  "Dressing room": [
    [WARDROBE, "wall", "reps"],
    [CHEST, "corner"],
  ],
  Wardrobe: [
    [WARDROBE, "wall", "reps"],
    [CHEST, "corner"],
  ],
  Bathroom: [
    [BATH, "center", 1],
    [WARDROBE, "wall"],
  ],
  Laundry: [
    [BATH, "center", 2],
    [FIRE, "back"],
    [CRATE, "corner", 2],
  ],
  Scullery: [
    [BATH, "back"],
    [BARREL, "corner", 2],
    [T, "center", 1],
  ],
  Gallery: [[STATUE, "wall", "reps"]],
  "Long gallery": [
    [STATUE, "wall", "reps"],
    [SHELF, "wall", 2],
  ],
  "Wine cellar": [
    [WINE, "wall", "all"],
    [BARREL, "corner", 2],
  ],
  Brewhouse: [
    [BARREL, "wall", "reps"],
    [RANGE, "back"],
  ],
  "Store room": STORE,
  "Cut cellar": STORE,
  "Lumber cellar": STORE,
  "Lumber room": STORE,
  "Coal store": STORE,
  "Attic store": STORE,
  "Trunk room": [
    [CHEST, "wall", "reps"],
    [CRATE, "corner", 2],
  ],
  "Drying loft": [
    [CRATE, "corner", 3],
    [BARREL, "corner"],
  ],
  Storehouse: STORE,
  Storeroom: STORE,
  Granary: [
    [CRATE, "scatter", "reps"],
    [BARREL, "corner", 2],
  ],
  "Store vault": STORE,
  "Cold room": [
    [SHELF, "wall", "reps"],
    [BARREL, "corner", 2],
  ],
  Vault: [[CHEST, "wall", "reps"]],
  Treasury: [
    [CHEST, "wall", "reps"],
    [STATUE, "corner"],
  ],
  "Servants' garret": DORM,
  "Maids' room": DORM,
  Barracks: [
    [BED, "wall", "all"],
    [RACK, "back", 2],
    [CHEST, "corner", 2],
  ],
  "Officers' quarters": [
    [BED, "wall", 2],
    [T, "center", 1],
    [RACK, "wall"],
    [CHEST, "corner"],
  ],
  "Monks' cells": [
    [PALLET, "wall", 2],
    [DESK, "wall"],
  ],
  Parlour: PARLOUR,
  "Sitting room": PARLOUR,
  "Morning room": PARLOUR,
  Boudoir: PARLOUR,
  "Music room": [
    [LECTERN, "center", 2],
    [FIRE, "back"],
    [STATUE, "corner", 2],
  ],
  "Sewing room": [
    [T, "center", 1],
    [WARDROBE, "wall", 2],
    [CRATE, "corner"],
  ],
  "Linen room": [
    [WARDROBE, "wall", "reps"],
    [CHEST, "corner"],
  ],
  "Gun room": [
    [RACK, "wall", "reps"],
    [CHEST, "corner"],
  ],
  Gatehouse: [
    [RACK, "wall", 2],
    [T, "center", 1],
    [FIRE, "back"],
    [BARREL, "corner"],
  ],
  "Guard room": [
    [T, "center", 1],
    [RACK, "wall", 2],
    [FIRE, "back"],
    [BARREL, "corner"],
  ],
  Guardroom: [
    [T, "center", 1],
    [RACK, "wall", 2],
    [FIRE, "back"],
  ],
  "Guard post": [
    [RACK, "wall"],
    [FIRE, "back"],
  ],
  "Watch room": [
    [T, "center", 1],
    [RACK, "wall"],
    [FIRE, "back"],
  ],
  Armoury: [
    [RACK, "wall", "all"],
    [CHEST, "corner", 2],
  ],
  Smithy: [
    [ANVIL, "center", 1],
    [FIRE, "back"],
    [BARREL, "corner"],
    [RACK, "wall", 2],
    [CRATE, "corner"],
  ],
  Stables: [
    [MANGER, "wall", "all"],
    [HAY, "corner", 2],
    [BUCKET, "corner"],
  ],
  Kennels: [
    [HAY, "wall", "reps"],
    [BONES, "scatter", 2],
    [BUCKET, "corner"],
  ],
  "Well house": [
    [WELL, "center", 1],
    [BARREL, "corner", 2],
  ],
  "Well chamber": [
    [WELL, "center", 1],
    [BARREL, "corner"],
  ],
  Cistern: [[WELL, "center", 1]],
  "Powder store": [[BARREL, "scatter", "reps"]],
  "Corner tower": [
    [RACK, "wall"],
    [CRATE, "corner"],
  ],
  Solar: [
    [T, "center", 1],
    [FIRE, "back"],
    [DESK, "wall"],
    [SHELF, "wall"],
  ],
  "Gaoler's room": [
    [T, "center", 1],
    [STOOL, "seats", 2],
    [CHEST, "corner"],
    [RACK, "wall"],
    [FIRE, "back"],
  ],
  Oubliette: [
    [BONES, "center", 1],
    [CHAINS, "wall"],
  ],
  "Inner ward": [
    [WELL, "center", 1],
    [CART, "corner"],
    [DUMMY, "scatter", 2],
    [WOODPILE, "wall"],
    [HAY, "corner"],
    [BARREL, "corner"],
    [CRATE, "corner"],
  ],
  "Cloister garth": [[WELL, "center", 1]],
  Cloister: [[WELL, "center", 1]],
  Cell: [
    [PALLET, "corner"],
    [CHAINS, "wall"],
    [BUCKET, "corner"],
  ],
  "Interrogation room": [
    [T, "center", 1],
    [FIRE, "back"],
    [RACK, "wall"],
    [CHAINS, "wall", 2],
    [BUCKET, "corner"],
  ],
  "Signal room": [[FIRE, "center", 1]],
  "Beacon platform": [[FIRE, "center", 1]],
  Lookout: [[CRATE, "corner"]],
  "Wall walk": [[RACK, "wall", 2]],
  Garderobe: [[BATH, "corner"]],
  Narthex: [
    [FONT, "center", 1],
    [STATUE, "corner", 2],
  ],
  Nave: [
    [PEW, "pews", "all"],
    [STATUE, "corner", 2],
  ],
  Sanctuary: [
    [ALTAR, "back"],
    [FIRE, "corner", 2],
    [STATUE, "corner", 2],
  ],
  Apse: [[ALTAR, "center", 1]],
  Vestry: [
    [WARDROBE, "wall", 2],
    [CHEST, "corner"],
    [SHELF, "wall"],
  ],
  Sacristy: [
    [WARDROBE, "wall", 2],
    [CHEST, "corner"],
  ],
  Refectory: [
    [T, "center", "all"],
    [STOOL, "seats", "all"],
    [LECTERN, "back"],
  ],
  Scriptorium: [
    [DESK, "center", "reps"],
    [SHELF, "wall", "reps"],
  ],
  "Chapter house": [
    [PEW, "wall", "all"],
    [LECTERN, "center", 1],
  ],
  Almonry: [
    [T, "center", 1],
    [CRATE, "corner", 2],
    [CHEST, "corner"],
  ],
  "Bell chamber": [[CRATE, "corner"]],
  "Ringers' loft": [[CHEST, "corner"]],
  "Belfry stair": [[CRATE, "corner"]],
  "Bell loft": [[CRATE, "corner", 2]],
  "Clock room": [[SHELF, "wall", 2]],
  Undercroft: [
    [SKULLS, "wall", "reps"],
    [CRATE, "corner", 2],
    [BARREL, "corner"],
  ],
  Reliquary: [
    [CHEST, "wall", 2],
    [STATUE, "corner", 2],
    [ALTAR, "back"],
  ],
  "Relic store": [[CHEST, "wall", "reps"]],
  "Burial vault": [[TOMB, "center", "reps"]],
  Charnel: [
    [SKULLS, "wall", "all"],
    [BONES, "scatter", "reps"],
  ],
  Ossuary: [
    [SKULLS, "wall", "all"],
    [BONES, "scatter", "reps"],
  ],
  "Family crypt": [
    [TOMB, "center", "reps"],
    [FIRE, "corner", 2],
  ],
  Tomb: [[TOMB, "center", 1]],
};

/** Where a piece of furniture stands in its room, by its prop slot. */
function siteFurnitureRole(template: SiteTemplateId, slot: number): SiteRole {
  if (template === "crypt")
    return slot === 0 ? "center" : slot === 1 ? "scatter" : slot === 2 ? "wall" : slot === 7 ? "pillar" : "corner";
  return slot === 0 ? "center" : slot === 3 ? "back" : slot === 4 ? "corner" : "wall";
}

/** Rooms that belong beside one another, by name (numbered copies count as the same room). */
const SITE_NEXT_TO: Record<string, readonly string[]> = {
  Kitchen: ["Dining room", "Pantry", "Servants' hall", "Great hall"],
  "Dressing room": ["Master bedroom"],
  Bathroom: ["Master bedroom", "Bedroom", "Guest bedroom"],
  Study: ["Library"],
  Nursery: ["Bedroom", "Master bedroom"],
  Vault: ["Wine cellar"],
  "Cold room": ["Store room", "Wine cellar"],
  Solar: ["Lord's chamber"],
  Treasury: ["Lord's chamber", "Solar"],
  Armoury: ["Barracks", "Gatehouse"],
  Barracks: ["Gatehouse"],
  "Interrogation room": ["Gaoler's room"],
  Cell: ["Gaoler's room", "Cell"],
  Vestry: ["Sanctuary"],
  Sanctuary: ["Nave"],
  Refectory: ["Kitchen", "Cloister"],
  Scriptorium: ["Library"],
  "Embalming room": ["Mortuary chapel"],
  "Keeper's room": ["Vestibule"],
  "Grave goods": ["Founder's tomb"],
  Ossuary: ["Burial hall"],
  "Ringers' loft": ["Bell chamber"],
  "Signal room": ["Watch room"],
  "Monks' cells": ["Monks' cells", "Refectory"],
  "Entrance hall": ["Great hall"],
  "Dining room": ["Great hall"],
  Ballroom: ["Great hall", "Long gallery"],
  "Sitting room": ["Parlour", "Great hall"],
  "Morning room": ["Parlour"],
  Gallery: ["Long gallery", "Great hall"],
  "Music room": ["Ballroom", "Parlour"],
  Scullery: ["Kitchen"],
  Bakehouse: ["Kitchen"],
  Larder: ["Kitchen"],
  Smithy: ["Armoury"],
  Stables: ["Kennels"],
  "Chapter house": ["Cloister"],
  Charnel: ["Ossuary"],
  Undercroft: ["Crypt chapel"],
};
/** Great rooms whose corners are cut on the slant. */
const SITE_CHAMFERED = new Set([
  "Great hall",
  "Chapel",
  "Chapter house",
  "Founder's tomb",
  "Burial hall",
  "Hall of guardians",
  "Ballroom",
  "Mourners' room",
  "Undercroft",
]);
/** Rooms a building can have several of. */
const SITE_MANY = new Set([
  "Cell",
  "Store room",
  "Storeroom",
  "Storehouse",
  "Lumber room",
  "Lumber cellar",
  "Bedroom",
  "Guest chamber",
  "Guest bedroom",
  "Monks' cells",
  "Maids' room",
  "Servants' garret",
  "Attic store",
  "Burial vault",
  "Wall tombs",
  "Granary",
]);
/** Rooms whose shelves hold books. */
const SITE_BOOK_ROOMS = new Set([
  "Library",
  "Study",
  "Steward's office",
  "Muniment room",
  "Scriptorium",
  "Chapter house",
  "Vestry",
  "Sacristy",
  "Chaplain's room",
  "Gallery",
  "Long gallery",
  "Parlour",
  "Sitting room",
  "Morning room",
  "Music room",
  "Governess's room",
  "Solar",
  "Lord's chamber",
  "Master bedroom",
  "Bedroom",
  "Guest bedroom",
  "Guest chamber",
  "Nursery",
  "Boudoir",
]);
/** Pieces a room has one or two of however big it is: one high seat, one hearth, one altar. */
const SITE_ONE_OFF = new Set<number>([SEAT, FIRE, ALTAR, WELL, ANVIL, BATH, RANGE, FONT, LECTERN, DESK, STATUE]);
/** Rooms shut away behind a door of their own, never opened wide into the next. */
const SITE_CLOSED = new Set([
  "Cell",
  "Monks' cells",
  "Bathroom",
  "Vault",
  "Treasury",
  "Garderobe",
  "Oubliette",
  "Dressing room",
  "Interrogation room",
]);
const siteBaseName = (name: string) => name.replace(/ \d+$/u, "");

const SITE_ENTRY_ROOMS = new Set(["Entrance hall", "Gatehouse", "Narthex", "Vestibule"]);
/** The open court of a building that has one, when its plan names no open room for it. */
const SITE_COURT_NAMES: Record<SiteTemplateId, string> = {
  manor: "Courtyard",
  keep: "Inner ward",
  temple: "Cloister garth",
  crypt: "Open court",
};
/** How each kind of building is cut up: how often a cut leaves a passage and how often one two wide, how
 *  many rooms beyond the plan's, how often its ground floor keeps an open court, and how often a floor
 *  loses a corner (an L or a U, not a box). */
const SITE_STYLES: Record<
  SiteTemplateId,
  { passage: number; wide: number; extra: readonly [number, number]; court: number; corner: number }
> = {
  manor: { passage: 0.5, wide: 0.5, extra: [1, 3], court: 0.25, corner: 0.8 },
  keep: { passage: 0.4, wide: 0.3, extra: [1, 3], court: 0.45, corner: 0.35 },
  temple: { passage: 0.35, wide: 0.3, extra: [0, 2], court: 0.4, corner: 0.4 },
  crypt: { passage: 0.7, wide: 0.1, extra: [2, 5], court: 0, corner: 0.5 },
};

type SiteSide = "N" | "S" | "E" | "W";
interface SiteRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type SiteEdge = { a: number; b: number; cells: Array<{ x: number; y: number }> };
/** Spaces that are neighbours across one wall, and the wall cells between them. */
function siteEdges(nodes: readonly SiteRect[]): SiteEdge[] {
  const edges: SiteEdge[] = [];
  for (let a = 0; a < nodes.length; a++)
    for (let b = 0; b < nodes.length; b++) {
      const [one, two] = [nodes[a]!, nodes[b]!];
      const cells: Array<{ x: number; y: number }> = [];
      if (one.x + one.w + 1 === two.x)
        for (let y = Math.max(one.y, two.y); y < Math.min(one.y + one.h, two.y + two.h); y++)
          cells.push({ x: one.x + one.w, y });
      else if (one.y + one.h + 1 === two.y)
        for (let x = Math.max(one.x, two.x); x < Math.min(one.x + one.w, two.x + two.w); x++)
          cells.push({ x, y: one.y + one.h });
      if (cells.length) edges.push({ a, b, cells });
    }
  return edges;
}

/** Cuts spaces at random until there are `target` of them: big and long thin ones first, toward the
 *  middle more often than the edges, a cut now and then leaving a passage; never a wall where `clear`
 *  says no. */
function siteCut(
  random: () => number,
  leaves: SiteRect[],
  passages: SiteRect[],
  target: number,
  style: { passage: number; wide: number },
  clear: (vertical: boolean, at: number, r: SiteRect) => boolean,
  MIN = 3,
) {
  for (let tries = 0; leaves.length < target && tries < 400; tries++) {
    const weights = leaves.map((r) =>
      r.w >= 2 * MIN + 1 || r.h >= 2 * MIN + 1
        ? Math.pow(r.w * r.h, 1.3) * (Math.max(r.w / r.h, r.h / r.w) > 2.2 ? 6 : 1)
        : 0,
    );
    const total = weights.reduce((sum, each) => sum + each, 0);
    if (!total) break;
    let roll = random() * total;
    let pick = 0;
    while (pick < weights.length - 1 && (roll -= weights[pick]!) >= 0) pick++;
    const r = leaves[pick]!;
    const canV = r.w >= 2 * MIN + 1;
    const canH = r.h >= 2 * MIN + 1;
    const ratio = r.w / r.h;
    const vertical =
      canV && (!canH || ratio > 2 || (ratio >= 0.5 && random() < (ratio > 1.25 ? 0.85 : ratio < 0.8 ? 0.15 : 0.5)));
    const len = vertical ? r.w : r.h;
    const line = vertical ? r.h : r.w;
    const passage =
      line >= 8 && len >= 2 * MIN + 3 && random() < Math.min(0.95, style.passage * Math.min(1, (r.w * r.h) / 110));
    const pw = passage ? (len >= 2 * MIN + 5 && random() < style.wide ? 2 : 1) : 0;
    const hi = len - MIN - (pw ? pw + 2 : 1);
    if (hi < MIN) continue;
    const start = vertical ? r.x : r.y;
    let a = -1;
    for (let k = 0; k < 8 && a < 0; k++) {
      const at = MIN + Math.floor(((random() + random()) / 2) * (hi - MIN + 1));
      const walls = pw ? [start + at, start + at + pw + 1] : [start + at];
      if (walls.every((wall) => clear(vertical, wall, r))) a = at;
    }
    if (a < 0) continue;
    const gap = pw ? pw + 2 : 1;
    const [first, second] = vertical
      ? [
          { x: r.x, y: r.y, w: a, h: r.h },
          { x: r.x + a + gap, y: r.y, w: r.w - a - gap, h: r.h },
        ]
      : [
          { x: r.x, y: r.y, w: r.w, h: a },
          { x: r.x, y: r.y + a + gap, w: r.w, h: r.h - a - gap },
        ];
    leaves.splice(pick, 1, first, second);
    if (pw)
      passages.push(vertical ? { x: r.x + a + 1, y: r.y, w: pw, h: r.h } : { x: r.x, y: r.y + a + 1, w: r.w, h: pw });
  }
}

/** What every full level of a building shares, from the plan alone: its outline (a corner or two left off,
 *  an L or a U), its main walls and passages (the first cuts, standing one on another floor to floor), and
 *  where each link stands (in a passage where there is one, so the stairs rise in a stairwell). */
function siteFrame(plan: SitePlan) {
  const random = marinaraRandom(`site-frame:${plan.template}:${plan.seed}:${plan.wealth}`);
  const style = SITE_STYLES[plan.template];
  // Stone buildings stand on walls two thick; a keep's corner towers and a temple's apse stand out
  // past them, so the map leaves room round the building for them.
  const wall = plan.template === "keep" || plan.template === "temple" ? 2 : 1;
  const fx = plan.template === "keep" ? 6 : 2;
  const fy = plan.template === "keep" ? 6 : plan.template === "temple" ? 5 : 2;
  const [left, right, top, bottom] = [fx, fx + plan.width - 1, fy, fy + plan.height - 1];
  const cx = fx + Math.floor(plan.width / 2);
  const inner: SiteRect = {
    x: left + wall,
    y: top + wall,
    w: right - left - 2 * wall + 1,
    h: bottom - top - 2 * wall + 1,
  };
  let leaves: SiteRect[] = [inner];
  const passages: SiteRect[] = [];
  // The spaces each kind is built round, never cut into rooms: a temple's nave down the middle from its
  // narthex at the door to the apse at the far end; a keep's bailey, the open yard inside its gate, with
  // ranges along the curtain walls either side and the gate range across the front, and the keep itself
  // behind it, the only part with floors above and cellars below.
  const heroes: { court?: SiteRect; nave?: SiteRect; narthex?: SiteRect } = {};
  const ranges: SiteRect[] = [];
  let block: SiteRect | undefined;
  if (plan.template === "temple") {
    const nw = Math.max(5, Math.min(9, Math.round(inner.w * 0.26)));
    const nx = cx - Math.floor(nw / 2);
    const nh = 3;
    heroes.nave = { x: nx, y: inner.y, w: nw, h: inner.h - nh - 1 };
    heroes.narthex = { x: nx, y: inner.y + inner.h - nh, w: nw, h: nh };
    leaves = [
      { x: inner.x, y: inner.y, w: nx - 1 - inner.x, h: inner.h },
      { x: nx + nw + 1, y: inner.y, w: inner.x + inner.w - (nx + nw + 1), h: inner.h },
    ];
  } else if (plan.template === "keep") {
    const nb = Math.round(inner.h * 0.55);
    block = { x: inner.x, y: inner.y, w: inner.w, h: nb };
    const yb = inner.y + nb + 1;
    const hb = inner.y + inner.h - yb;
    const side = 4;
    const front = hb >= 9 ? 3 : 0;
    const ch = front ? hb - front - 1 : hb;
    ranges.push({ x: inner.x, y: yb, w: side, h: ch }, { x: inner.x + inner.w - side, y: yb, w: side, h: ch });
    if (front) ranges.push({ x: inner.x, y: yb + ch + 1, w: inner.w, h: front });
    heroes.court = { x: inner.x + side + 1, y: yb, w: inner.w - 2 * side - 2, h: ch };
    leaves = [block];
    // The ranges as rows of rooms along the walls, none longer than a room should be.
    const long = ranges.reduce((sum, r) => sum + Math.max(r.w, r.h), 0);
    siteCut(random, ranges, [], ranges.length + Math.floor(long / 8), { passage: 0, wide: 0 }, () => true, 3);
  }
  const cy = block ? block.y + Math.floor(block.h / 2) : fy + Math.floor(plan.height / 2);
  const heroRects = [heroes.nave, heroes.narthex, heroes.court].filter((r): r is SiteRect => !!r);
  siteCut(
    random,
    leaves,
    passages,
    leaves.length - 1 + (block ? 2 : 3) + plan.wealth + Math.floor(random() * 2),
    { ...style, passage: style.passage * 2 },
    () => true,
    plan.template === "crypt" ? 3 : 4,
  );
  // The outline: a corner left off now and then, never cutting the rest apart. A passage that ran along
  // a corner left off is cut back to where it still has rooms beside it, so no corridor juts out alone.
  const removed = new Set<number>();
  const kept = () => {
    const keptLeaves = leaves.filter((_, n) => !removed.has(n));
    const inAny = (x: number, y: number, self: SiteRect) =>
      [...keptLeaves, ...passages, ...heroRects, ...ranges].some(
        (r) => r !== self && x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h,
      );
    const keptPassages: SiteRect[] = [];
    for (const r of passages) {
      const across = r.w >= r.h;
      const backed = (k: number) =>
        across
          ? inAny(r.x + k, r.y - 2, r) || inAny(r.x + k, r.y + r.h + 1, r)
          : inAny(r.x - 2, r.y + k, r) || inAny(r.x + r.w + 1, r.y + k, r);
      const len = across ? r.w : r.h;
      let lo = 0;
      let hi = len - 1;
      while (lo <= hi && !backed(lo)) lo++;
      while (hi >= lo && !backed(hi)) hi--;
      if (hi - lo + 1 < 4) continue;
      keptPassages.push(across ? { ...r, x: r.x + lo, w: hi - lo + 1 } : { ...r, y: r.y + lo, h: hi - lo + 1 });
    }
    return { keptLeaves, keptPassages };
  };
  const connected = () => {
    const { keptLeaves, keptPassages } = kept();
    const nodes = [...keptPassages, ...keptLeaves, ...heroRects, ...ranges];
    const edges = siteEdges(nodes);
    const seen = new Set([0]);
    const queue = [0];
    for (let head = 0; head < queue.length; head++)
      for (const edge of edges) {
        const other = edge.a === queue[head] ? edge.b : edge.b === queue[head] ? edge.a : -1;
        if (other >= 0 && !seen.has(other)) {
          seen.add(other);
          queue.push(other);
        }
      }
    return seen.size === nodes.length;
  };
  const total = plan.width * plan.height;
  // A castle keeps its square of curtain walls.
  for (let k = 0; k < 2 && random() < style.corner && plan.template !== "keep"; k++) {
    const corners = leaves
      .map((r, n) => ({ r, n }))
      .filter(({ r, n }) => {
        if (removed.has(n) || r.w * r.h > total * 0.3) return false;
        return (
          (r.x === left + wall || r.x + r.w === right - wall + 1) &&
          (r.y === top + wall || r.y + r.h === bottom - wall + 1)
        );
      });
    const corner = corners[Math.floor(random() * corners.length)];
    if (!corner) break;
    removed.add(corner.n);
    if (!connected()) removed.delete(corner.n);
  }
  const { keptLeaves, keptPassages } = kept();
  // Links: stairwells in the passages, spread apart; ladders to an inset level near the middle.
  const spots: Array<{ x: number; y: number; passage: boolean }> = [];
  for (const [list, passage] of [
    [keptPassages, true],
    [keptLeaves, false],
  ] as const)
    for (const r of list)
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++)
          // In a room, a stair stands against its wall, not in the middle of the floor.
          // In a passage, a stair rises at one end, a stairwell, not out in the middle of the corridor.
          if (
            passage
              ? Math.max(r.w, r.h) < 5 ||
                (r.w >= r.h ? x <= r.x + 1 || x >= r.x + r.w - 2 : y <= r.y + 1 || y >= r.y + r.h - 2)
              : x === r.x || y === r.y || x === r.x + r.w - 1 || y === r.y + r.h - 1
          )
            spots.push({ x, y, passage });
  const taken: Array<{ x: number; y: number }> = [];
  const far = (spot: { x: number; y: number }, gap: number) =>
    taken.every((each) => Math.abs(each.x - spot.x) + Math.abs(each.y - spot.y) >= gap);
  const linkAt = plan.links.map((link) => {
    const ladder = plan.levels[link.upper]!.inset || plan.levels[link.lower]!.inset;
    let pick: { x: number; y: number } | undefined;
    if (ladder) {
      pick = spots
        .filter((spot) => far(spot, 2))
        .sort(
          (a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx) || Math.abs(a.y - cy) - Math.abs(b.y - cy) || a.x - b.x,
        )[0];
    } else {
      for (const want of [true, false])
        // The ways up and down far apart, so a floor is crossed, not climbed past (panel 2026-11-17).
        for (const gap of [14, 10, 6, 4, 2]) {
          if (pick) break;
          const choices = spots.filter((spot) => spot.passage === want && Math.abs(spot.x - cx) >= 2 && far(spot, gap));
          pick = choices[Math.floor(random() * choices.length)];
        }
    }
    pick ??= spots.find((spot) => far(spot, 1)) ?? { x: cx, y: cy };
    taken.push(pick);
    return { x: pick.x, y: pick.y };
  });
  return {
    fx,
    fy,
    left,
    right,
    top,
    bottom,
    cx,
    leaves: keptLeaves,
    passages: keptPassages,
    heroes,
    ranges,
    block,
    linkAt,
    wall,
    mapW: plan.width + 2 * fx,
    mapH: plan.height + 2 * fy,
  };
}

/**
 * A level of a site as a map, made anew from its seed: the footprint cut again and again at random into
 * rooms, a cut now and then leaving a passage; a corner left off now and then; the spaces joined as a
 * tree from the way in (rooms hang off passages first), with a few more doors for loops; the plan's rooms
 * placed by how far they are from the way in (public near, private far, the heart deep, locked rooms at
 * dead ends, the great room the biggest space, an open court inside the ground floor); then links, locks,
 * furniture, and traps only when the game's rules can find them.
 */
export function siteLevelMap(plan: SitePlan, index: number, options: { traps?: boolean } = {}): SiteLevelMap {
  const level = plan.levels[index]!;
  const random = marinaraRandom(`site-level:${plan.template}:${plan.seed}:${level.id}`);
  const frame = siteFrame(plan);
  const { fx, mapW, mapH } = frame;
  const style = SITE_STYLES[plan.template];
  // An inset level (an attic, a tower top) is a narrower box round the middle.
  const inset = level.inset ? Math.max(4, Math.floor(plan.width * 0.22)) : 0;
  const left = fx + inset;
  const right = fx + plan.width - 1 - inset;
  // A keep's floors above and below are the keep alone; its bailey and ranges are on the ground only.
  const keepOnly = plan.template === "keep" && level.depth !== 0 && frame.block;
  const top = frame.top;
  const bottom = keepOnly ? frame.block!.y + frame.block!.h - 1 + frame.wall : frame.bottom;
  const entry = index === plan.entry;
  const ground: DungeonGround[] = Array.from({ length: mapW * mapH }, () => "rock" as DungeonGround);
  const props: number[] = ground.map(() => -1);
  const cell = (x: number, y: number) => y * mapW + x;
  const inside = (r: SiteRect, x: number, y: number) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) ground[cell(x, y)] = "wall";
  const carve = (r: SiteRect, to: DungeonGround = "floor") => {
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) ground[cell(x, y)] = to;
  };
  // Links first: no cut runs through them.
  const links: SiteLevelLink[] = [];
  for (const link of plan.links) {
    if (link.upper !== index && link.lower !== index) continue;
    const at = frame.linkAt[plan.links.indexOf(link)]!;
    links.push({
      x: Math.min(right - 1, Math.max(left + 1, at.x)),
      y: at.y,
      level: link.upper === index ? link.lower : link.upper,
      kind: link.kind,
    });
  }

  // ── Cutting: on from the building's main walls and passages (an inset level is its own box) ──
  let planned = [...level.rooms];
  const leaves: SiteRect[] = level.inset
    ? [{ x: left + 1, y: top + 1, w: right - left - 1, h: bottom - top - 1 }]
    : [...frame.leaves, ...(plan.template === "keep" && level.depth === 0 ? frame.ranges : [])].map((r) => ({ ...r }));
  const passages: SiteRect[] = level.inset ? [] : frame.passages.map((r) => ({ ...r }));
  const heroes: Array<{ r: SiteRect; kind: "court" | "nave" | "narthex" }> = level.inset
    ? []
    : plan.template === "temple"
      ? [
          { r: { ...frame.heroes.nave! }, kind: "nave" as const },
          { r: { ...frame.heroes.narthex! }, kind: "narthex" as const },
        ]
      : plan.template === "keep" && level.depth === 0
        ? [{ r: { ...frame.heroes.court! }, kind: "court" as const }]
        : [];
  /** Which of the building's main spaces (its wings) each space of this level lies in. */
  const wingOf = (r: SiteRect) =>
    level.inset
      ? 0
      : frame.leaves.findIndex((wing) => inside(wing, r.x + Math.floor(r.w / 2), r.y + Math.floor(r.h / 2)));
  const [least, most] = style.extra;
  void least;
  void most;
  // About as many spaces as the level has rooms: a space left over gets a purpose of its own, but a
  // building of mostly made-up rooms is no plan at all (panel 2026-11-16).
  const target = Math.max(
    leaves.length,
    planned.length - heroes.length + (level.inset ? 0 : 1) + Math.floor(random() * 2),
  );
  siteCut(
    random,
    leaves,
    passages,
    target,
    style,
    (vertical, at, r) =>
      !links.some((link) =>
        vertical
          ? link.x === at && link.y >= r.y && link.y < r.y + r.h
          : link.y === at && link.x >= r.x && link.x < r.x + r.w,
      ),
    plan.template === "crypt" ? 3 : 4,
  );
  for (const r of [...leaves, ...passages, ...heroes.map((each) => each.r)]) carve(r);
  const thick = level.inset ? 1 : frame.wall;

  // ── What stands out past the walls: a keep's corner towers, a temple's apse ──
  const extras: Array<{ r: SiteRect; room: SitePlanRoom; shape?: (x: number, y: number) => boolean }> = [];
  const meets = (r: SiteRect) =>
    siteEdges([r, ...passages, ...leaves, ...heroes.map((each) => each.r)]).some(
      (edge) => edge.a === 0 || edge.b === 0,
    );
  const raise = (r: SiteRect, shape?: (x: number, y: number) => boolean) => {
    for (let y = r.y - thick; y < r.y + r.h + thick; y++)
      for (let x = r.x - thick; x < r.x + r.w + thick; x++)
        if (x >= 0 && y >= 0 && x < mapW && y < mapH && ground[cell(x, y)] === "rock") ground[cell(x, y)] = "wall";
    for (let y = r.y; y < r.y + r.h; y++)
      for (let x = r.x; x < r.x + r.w; x++) ground[cell(x, y)] = !shape || shape(x, y) ? "floor" : "wall";
  };
  if (!level.inset && level.depth >= 0 && plan.template === "keep") {
    const s = plan.wealth === 3 ? 4 : 3;
    // Each tower stands out past a corner, flush with the first rooms inside it.
    const towers: SiteRect[] = [
      { x: left - s + 1, y: top + thick, w: s, h: s },
      { x: right, y: top + thick, w: s, h: s },
      { x: left - s + 1, y: bottom - thick - s + 1, w: s, h: s },
      { x: right, y: bottom - thick - s + 1, w: s, h: s },
    ];
    for (const r of towers)
      if (meets(r) && !links.some((link) => inside(r, link.x, link.y))) {
        // A big tower is rounded on its outer face: the two corner cells away from the building are wall
        // (its doors are all on the inner face).
        const outer = r.x < left ? r.x : r.x + s - 1;
        const round =
          s === 4 ? (x: number, y: number) => !(x === outer && (y === r.y || y === r.y + s - 1)) : undefined;
        raise(r, round);
        extras.push({
          r,
          shape: round,
          room: { name: "Corner tower", use: "squat", size: 1, zone: "public", furniture: [SHELF, CHEST] },
        });
      }
  }
  if (!level.inset && level.depth === 0 && plan.template === "temple") {
    // The apse: a rounded end past the far wall, behind the altar; in the middle, or off the middle of
    // whichever room meets the far wall nearest it when the middle is a corner left off.
    const along = [
      frame.cx,
      ...leaves.filter((r) => r.y === top + thick && r.w >= 7).map((r) => r.x + Math.floor(r.w / 2)),
    ].sort((p, q) => Math.abs(p - frame.cx) - Math.abs(q - frame.cx));
    for (const cx of along) {
      const r: SiteRect = { x: cx - 2, y: top - 2, w: 5, h: 3 };
      const shape = (x: number, y: number) => y > r.y || Math.abs(x - cx) <= 1;
      if (!meets(r)) continue;
      raise(r, shape);
      // The sanctuary is the apse itself, at the far end of the nave, not a room off in a corner.
      const sanctuary = planned.find((room) => room.name === "Sanctuary");
      if (sanctuary) planned = planned.filter((room) => room !== sanctuary);
      extras.push({
        r,
        room: sanctuary
          ? { ...sanctuary, size: 1 }
          : { name: "Apse", use: "quiet", size: 1, zone: "private", furniture: [T] },
        shape,
      });
      break;
    }
  }

  // ── The spaces as a graph: two are neighbours across one wall ──
  const nodes: SiteRect[] = [...passages, ...leaves, ...heroes.map((each) => each.r), ...extras.map((each) => each.r)];
  const heroAt = (kind: "court" | "nave" | "narthex") => {
    const k = heroes.findIndex((each) => each.kind === kind);
    return k < 0 ? -1 : passages.length + leaves.length + k;
  };
  const isPassage = (n: number) => n < passages.length;
  type Edge = SiteEdge;
  const edges = siteEdges(nodes);
  const touches = (r: SiteRect) => ({
    w: r.x === left + thick,
    e: r.x + r.w === right - thick + 1,
    n: r.y === top + thick,
    s: r.y + r.h === bottom - thick + 1,
  });
  const live = (_n: number) => true;

  // ── The way in, and the tree of doors from it ──
  let entrance = { x: -1, y: -1 };
  let start = -1;
  const hallWanted = entry && planned.some((room) => SITE_ENTRY_ROOMS.has(room.name));
  if (entry) {
    const sides: Array<{ n: number; x: number; y: number; weight: number }> = [];
    for (const [n, r] of nodes.entries()) {
      // Never in through a tower or the apse: the way in is through the main walls.
      if (!live(n) || n >= passages.length + leaves.length + heroes.length) continue;
      const t = touches(r);
      // In by a passage, or straight into the entrance hall where the level has one.
      const bonus = isPassage(n) === !hallWanted ? 3 : 1;
      const pickAlong = (from: number, to: number) => from + Math.floor(random() * (to - from));
      if (t.s) sides.push({ n, x: pickAlong(r.x, r.x + r.w), y: bottom, weight: 3 * bonus });
      if (t.w) sides.push({ n, x: left, y: pickAlong(r.y, r.y + r.h), weight: bonus });
      if (t.e) sides.push({ n, x: right, y: pickAlong(r.y, r.y + r.h), weight: bonus });
      if (t.n) sides.push({ n, x: pickAlong(r.x, r.x + r.w), y: top, weight: 0.5 * bonus });
    }
    let roll = random() * sides.reduce((sum, side) => sum + side.weight, 0);
    const side = sides.find((each) => (roll -= each.weight) < 0) ?? sides[0]!;
    entrance = { x: side.x, y: side.y };
    start = side.n;
    // The front door in the middle of the front: into a temple's narthex, a keep's gate range, a manor's
    // entrance hall most of the time.
    const axis =
      heroAt("narthex") >= 0
        ? heroAt("narthex")
        : nodes.findIndex((r, n) => touches(r).s && r.x <= frame.cx && r.x + r.w > frame.cx && !isPassage(n));
    if (axis >= 0 && (plan.template !== "manor" || random() < 0.75)) {
      entrance = { x: frame.cx, y: bottom };
      start = axis;
    }
  } else {
    const first = links[0];
    start = first ? nodes.findIndex((r, n) => live(n) && inside(r, first.x, first.y)) : -1;
    if (start < 0) start = nodes.findIndex((_, n) => live(n));
    entrance = first ? { x: first.x, y: first.y } : { x: nodes[start]!.x, y: nodes[start]!.y };
  }
  const inTree = new Set([start]);
  const tree: Edge[] = [];
  const parent = new Map<number, Edge>();
  while (true) {
    const frontier = edges.filter((edge) => live(edge.a) && live(edge.b) && inTree.has(edge.a) !== inTree.has(edge.b));
    if (!frontier.length) break;
    const weight = (edge: Edge) => (isPassage(edge.a) || isPassage(edge.b) ? 4 : 1);
    let roll = random() * frontier.reduce((sum, edge) => sum + weight(edge), 0);
    const edge = frontier.find((each) => (roll -= weight(each)) < 0) ?? frontier[0]!;
    const child = inTree.has(edge.a) ? edge.b : edge.a;
    inTree.add(child);
    tree.push(edge);
    parent.set(child, edge);
  }
  const degree = nodes.map((_, n) => tree.filter((edge) => edge.a === n || edge.b === n).length);
  const depth = nodes.map(() => -1);
  depth[start] = 0;
  for (let changed = true; changed;) {
    changed = false;
    for (const edge of tree) {
      if (depth[edge.a]! >= 0 && depth[edge.b]! < 0) [depth[edge.b], changed] = [depth[edge.a]! + 1, true];
      else if (depth[edge.b]! >= 0 && depth[edge.a]! < 0) [depth[edge.a], changed] = [depth[edge.b]! + 1, true];
    }
  }

  /** Each room's alcove, the cells of it, where it has one. */
  const alcoves = new Map<number, Array<{ x: number; y: number }>>();
  // ── The plan's rooms on the spaces ──
  const owner = new Map<number, SitePlanRoom>();
  for (const [k, each] of extras.entries()) owner.set(passages.length + leaves.length + heroes.length + k, each.room);
  const free = () =>
    nodes
      .map((r, n) => ({ r, n }))
      .filter(({ n }) => live(n) && !isPassage(n) && !owner.has(n))
      .sort((p, q) => depth[p.n]! - depth[q.n]! || q.r.w * q.r.h - p.r.w * p.r.h);
  const claim = (pick: (room: SitePlanRoom) => boolean) => {
    const room = planned.find(pick);
    if (room) planned = planned.filter((each) => each !== room);
    return room;
  };
  const area = (n: number) => nodes[n]!.w * nodes[n]!.h;
  const hasLink = (n: number) => links.some((link) => inside(nodes[n]!, link.x, link.y));
  // The spaces built round: the nave (or the undercroft under it), the narthex at the door, the bailey.
  if (heroAt("nave") >= 0) {
    const hall = claim((room) => SITE_HALL_ROOMS.has(room.name));
    if (hall) owner.set(heroAt("nave"), hall);
  }
  if (heroAt("narthex") >= 0 && entry) {
    const way = claim((room) => SITE_ENTRY_ROOMS.has(room.name));
    if (way) owner.set(heroAt("narthex"), way);
  }
  // The great room: the biggest space, and on the level the party comes in by, near the door.
  const great = claim((room) => SITE_HALL_ROOMS.has(room.name));
  if (great) {
    const worth = (n: number) => area(n) - (entry ? 10 * depth[n]! : 0);
    // Never the bailey: that is the yard, named below, and the hall would vanish under it.
    const best = free()
      .filter(({ n }) => n !== heroAt("court"))
      .reduce<{ r: SiteRect; n: number } | undefined>(
        (most, each) => (!most || worth(each.n) > worth(most.n) ? each : most),
        undefined,
      );
    if (best) owner.set(best.n, great);
  }
  // An open court: a space inside the ground floor, walled on every side.
  let court = heroAt("court");
  if (court >= 0)
    owner.set(
      court,
      claim((room) => room.use === "open") ?? {
        name: SITE_COURT_NAMES[plan.template],
        use: "open",
        size: 3,
        zone: "public",
        furniture: [],
      },
    );
  else if (level.depth === 0 && !level.inset && random() < style.court) {
    const open = free().filter(({ r, n }) => {
      const t = touches(r);
      return !t.n && !t.s && !t.e && !t.w && r.w >= 5 && r.h >= 5 && n !== start && !hasLink(n);
    });
    const chosen = open[Math.floor(random() * open.length)];
    if (chosen) {
      court = chosen.n;
      owner.set(
        court,
        claim((room) => room.use === "open") ?? {
          name: SITE_COURT_NAMES[plan.template],
          use: "open",
          size: 3,
          zone: "public",
          furniture: [],
        },
      );
    }
  }
  // The way in opens into the entrance hall.
  const hallIn = entry ? claim((room) => SITE_ENTRY_ROOMS.has(room.name)) : undefined;
  if (hallIn) {
    const first = !isPassage(start) && !owner.has(start) ? { n: start } : free()[0];
    if (first) owner.set(first.n, hallIn);
  }
  // The heart deep in, in a big space.
  const heart = claim((room) => !!room.heart);
  if (heart) {
    const best = free().reduce<{ r: SiteRect; n: number } | undefined>(
      (most, each) =>
        !most || depth[each.n]! * 6 + area(each.n) / 4 > depth[most.n]! * 6 + area(most.n) / 4 ? each : most,
      undefined,
    );
    if (best) owner.set(best.n, heart);
  }
  // The rest by zone: public rooms near the way in, private and deep ones far from it, each in a space
  // of about its size, kept to one wing per zone where it can be, and beside what it belongs with (the
  // kitchen by the dining room, a dressing room off the bedroom). A locked room only at a dead end.
  const zoneAt = { public: 0.15, service: 0.45, guest: 0.55, private: 0.8, deep: 0.95 } as const;
  const want = { 1: 12, 2: 28, 3: 55 } as const;
  const deepest = Math.max(1, ...depth);
  const neighbours = (p: number, q: number) =>
    edges.some((edge) => (edge.a === p && edge.b === q) || (edge.a === q && edge.b === p));
  const nodeOf = (room: SitePlanRoom) => [...owner.entries()].find(([, each]) => each === room)?.[0];
  const placedNamed = (name: string) =>
    [...owner.entries()].filter(([, each]) => siteBaseName(each.name) === name).map(([n]) => n);
  const partners = (room: SitePlanRoom) => {
    const base = siteBaseName(room.name);
    const out = new Set(SITE_NEXT_TO[base] ?? []);
    for (const [other, list] of Object.entries(SITE_NEXT_TO)) if (list.includes(base)) out.add(other);
    return [...out];
  };
  const firstWing = new Map<string, number>();
  for (const room of owner.values()) {
    const n = nodeOf(room)!;
    if (!firstWing.has(room.zone)) firstWing.set(room.zone, wingOf(nodes[n]!));
  }
  const queue = [...planned].sort(
    (p, q) => Number(partners(p).length > 0) - Number(partners(q).length > 0) || zoneAt[p.zone] - zoneAt[q.zone],
  );
  for (const room of queue) {
    let spaces = free();
    if (room.locked) {
      const ends = spaces.filter(({ n }) => degree[n] === 1 && !hasLink(n) && n !== start);
      if (ends.length) spaces = ends;
    }
    const mates = partners(room);
    const score = (n: number) => {
      let s =
        1.5 * Math.abs(Math.log(area(n) / want[room.size])) + 2.5 * Math.abs(depth[n]! / deepest - zoneAt[room.zone]);
      for (const mate of mates)
        for (const at of placedNamed(mate)) s += neighbours(n, at) ? -2.5 : 0.5 / Math.max(1, placedNamed(mate).length);
      const wing = firstWing.get(room.zone);
      if (wing !== undefined && wing !== wingOf(nodes[n]!)) s += 1;
      return s;
    };
    const best = spaces.reduce<{ r: SiteRect; n: number } | undefined>(
      (most, each) => (!most || score(each.n) < score(most.n) ? each : most),
      undefined,
    );
    if (!best) break;
    planned = planned.filter((each) => each !== room);
    const fits = !room.locked || (degree[best.n] === 1 && !hasLink(best.n) && best.n !== start);
    owner.set(best.n, fits ? room : { ...room, locked: undefined });
    if (!firstWing.has(room.zone)) firstWing.set(room.zone, wingOf(best.r));
  }
  // A space the plan has no room for gets a purpose of its own from what such a building has on such a
  // floor, the one whose size suits it best, each once (panel 2026-11-16: no "Box room 3").
  const pool =
    SITE_SPARE_ROOMS[plan.template][
      level.inset ? "top" : level.depth > 0 ? "up" : level.depth < 0 ? "below" : "ground"
    ];
  const used = new Map<string, number>();
  const sizes = { 1: 12, 2: 28, 3: 55 } as const;
  for (const { n } of [...free()].sort((p, q) => area(q.n) - area(p.n))) {
    // Once each; past that only what a building has many of (cells, stores, bedrooms), never a third well house.
    const fresh = pool.filter(([name]) => !used.has(name));
    const many = pool.filter(([name]) => SITE_MANY.has(name));
    const choices = fresh.length ? fresh : many.length ? many : pool;
    const [name, size, furniture] = choices.reduce((best, each) =>
      Math.abs(Math.log(area(n) / sizes[each[1]])) < Math.abs(Math.log(area(n) / sizes[best[1]])) ? each : best,
    );
    const times = (used.get(name) ?? 0) + 1;
    used.set(name, times);
    owner.set(n, {
      name: times > 1 ? `${name} ${times}` : name,
      use: "squat",
      size,
      zone: "service",
      furniture,
    });
  }

  // ── Doors ──
  const doorOf = new Map<number, { x: number; y: number }>();
  const lockedNode = (n: number) => !!owner.get(n)?.locked;
  const opened = new Set<Edge>();
  const openEdge = (edge: Edge, main: boolean, wide = false) => {
    opened.add(edge);
    const both = isPassage(edge.a) && isPassage(edge.b);
    if (both) {
      for (const each of edge.cells) ground[cell(each.x, each.y)] = "floor";
      return edge.cells[0]!;
    }
    // Two rooms that go together open through a wide archway, one space of two parts (an L, a T), not two
    // boxes (panel 2026-11-17).
    if (wide && edge.cells.length >= 5) {
      const mid = edge.cells[Math.floor(edge.cells.length / 2)]!;
      const half = edge.cells.length >= 8 ? 2 : 1;
      for (const each of edge.cells)
        if (Math.abs(each.x - mid.x) + Math.abs(each.y - mid.y) <= half) ground[cell(each.x, each.y)] = "floor";
      if (main) doorOf.set(depth[edge.a]! > depth[edge.b]! ? edge.a : edge.b, mid);
      return mid;
    }
    const at = edge.cells[Math.floor(random() * edge.cells.length)]!;
    ground[cell(at.x, at.y)] = "floor";
    // A doorway with an open court is three wide where it can be.
    if (edge.a === court || edge.b === court)
      for (const each of edge.cells)
        if (Math.abs(each.x - at.x) + Math.abs(each.y - at.y) <= 1) ground[cell(each.x, each.y)] = "floor";
    if (main) {
      const child = depth[edge.a]! > depth[edge.b]! ? edge.a : edge.b;
      doorOf.set(child, at);
    }
    return at;
  };
  for (const edge of tree) openEdge(edge, true);
  // Rooms that belong together open into each other (never into a locked room).
  const together = (p: number, q: number) => {
    const [a, b] = [owner.get(p), owner.get(q)];
    if (!a || !b || a.locked || b.locked) return false;
    return (
      (SITE_NEXT_TO[siteBaseName(a.name)] ?? []).includes(siteBaseName(b.name)) ||
      (SITE_NEXT_TO[siteBaseName(b.name)] ?? []).includes(siteBaseName(a.name))
    );
  };
  const forced = new Set<Edge>();
  for (const edge of edges)
    if (
      !tree.includes(edge) &&
      together(edge.a, edge.b) &&
      !tree.some((each) => (each.a === edge.a && each.b === edge.b) || (each.a === edge.b && each.b === edge.a))
    ) {
      openEdge(
        edge,
        false,
        random() < 0.6 && ![edge.a, edge.b].some((k) => SITE_CLOSED.has(siteBaseName(owner.get(k)?.name ?? ""))),
      );
      forced.add(edge);
    }
  for (const edge of edges) {
    if (tree.includes(edge) || forced.has(edge) || !live(edge.a) || !live(edge.b) || edge.a > edge.b) continue;
    if (lockedNode(edge.a) || lockedNode(edge.b)) continue;
    const passages2 = Number(isPassage(edge.a)) + Number(isPassage(edge.b));
    // Loops: rooms open into each other often, so a floor is more than a tree of dead ends.
    // Room to room more than room to corridor, so a way round skips the corridor (panel 2026-11-17).
    const chance = edge.a === court || edge.b === court ? 0.7 : passages2 === 2 ? 0.6 : passages2 === 1 ? 0.15 : 0.6;
    if (random() < chance)
      openEdge(
        edge,
        false,
        passages2 === 0 &&
          random() < 0.2 &&
          ![edge.a, edge.b].some((k) => SITE_CLOSED.has(siteBaseName(owner.get(k)?.name ?? ""))),
      );
  }
  // A room with one way in and others to be had gets a second, mostly: rooms to go round, not only to
  // walk into and back out of (panel 2026-11-16).
  for (const [n] of nodes.entries()) {
    if (isPassage(n) || lockedNode(n) || n === court) continue;
    const mine = edges.filter((edge) => edge.a === n || edge.b === n);
    if (mine.filter((edge) => opened.has(edge)).length !== 1) continue;
    const more = mine.filter((edge) => !opened.has(edge) && !lockedNode(edge.a === n ? edge.b : edge.a));
    // Into the next room where there is one, not back onto the same corridor.
    const rooms2 = more.filter((edge) => !isPassage(edge.a === n ? edge.b : edge.a));
    const pool = rooms2.length ? rooms2 : more;
    if (pool.length && random() < 0.7) openEdge(pool[Math.floor(random() * pool.length)]!, false);
  }
  // A hidden door: a short way between two rooms far apart on the tree of doors, through a wall that
  // looks whole (panel round 5: no secrets). Never into a locked room, never in a crypt (its walls are
  // a tile pack's).
  const secrets: Array<{ x: number; y: number }> = [];
  if (plan.template !== "crypt" && !level.inset && random() < 0.75) {
    const best = edges
      .filter(
        (edge) =>
          !opened.has(edge) &&
          !isPassage(edge.a) &&
          !isPassage(edge.b) &&
          !lockedNode(edge.a) &&
          !lockedNode(edge.b) &&
          owner.has(edge.a) &&
          owner.has(edge.b) &&
          Math.abs(depth[edge.a]! - depth[edge.b]!) >= 2,
      )
      .sort((p, q) => Math.abs(depth[q.a]! - depth[q.b]!) - Math.abs(depth[p.a]! - depth[p.b]!))[0];
    if (best) {
      opened.add(best);
      const at = best.cells[Math.floor(best.cells.length / 2)]!;
      ground[cell(at.x, at.y)] = "floor";
      secrets.push(at);
    }
  }
  if (entry) {
    // Through the whole thickness of the outer wall.
    const [dx, dy] =
      entrance.y === bottom ? [0, -1] : entrance.y === top ? [0, 1] : entrance.x === left ? [1, 0] : [-1, 0];
    for (let t = 0; t < thick; t++) ground[cell(entrance.x + dx * t, entrance.y + dy * t)] = "floor";
  }

  // Alcoves: a room on the outer wall now and then has a three-cell recess cut into a thick wall (or a
  // crypt's rock), so a floor is not all boxes (panel 2026-11-17). Never on the front with the door.
  if (!level.inset) {
    const front = entry ? entrance : null;
    for (const [n, r] of nodes.entries()) {
      const room = owner.get(n);
      if (isPassage(n) || !room || room.use === "open" || Math.min(r.w, r.h) < 4 || random() > 0.35) continue;
      const t = touches(r);
      const sides = (["n", "s", "e", "w"] as const).filter(
        (side) =>
          t[side] &&
          (side === "n" || side === "s" ? r.w : r.h) >= 5 &&
          !(
            front &&
            (side === "s"
              ? front.y === bottom
              : side === "n"
                ? front.y === top
                : side === "w"
                  ? front.x === left
                  : front.x === right)
          ),
      );
      const side = sides[Math.floor(random() * sides.length)];
      if (!side) continue;
      const across = side === "n" || side === "s";
      const [dx, dy] = side === "n" ? [0, -1] : side === "s" ? [0, 1] : side === "w" ? [-1, 0] : [1, 0];
      const along = across ? r.w : r.h;
      const start = Math.floor(random() * (along - 3 - 1)) + 1;
      const cellsOf = (k: number, d: number) =>
        across
          ? { x: r.x + start + k, y: (side === "n" ? r.y : r.y + r.h - 1) + dy * d }
          : { x: (side === "w" ? r.x : r.x + r.w - 1) + dx * d, y: r.y + start + k };
      // The recess: the first cell out along three; past it, wall (or the thick wall's second course).
      const recess = [0, 1, 2].map((k) => cellsOf(k, 1));
      const behind = [-1, 0, 1, 2, 3].map((k) => cellsOf(k, 2));
      const flank = [cellsOf(-1, 1), cellsOf(3, 1)];
      const ok = (p: { x: number; y: number }) => p.x > 0 && p.y > 0 && p.x < mapW - 1 && p.y < mapH - 1;
      if (![...recess, ...behind, ...flank].every(ok)) continue;
      if (!recess.every((p) => ground[cell(p.x, p.y)] === "wall")) continue;
      // Only into a wall thick enough to hold it: a bay pushed out past a thin wall reads as a stray bump
      // (panel round 4).
      // A crypt is cut in rock, so a niche can go back into it.
      if (
        !behind.every(
          (p) => ground[cell(p.x, p.y)] === "wall" || (plan.template === "crypt" && ground[cell(p.x, p.y)] === "rock"),
        )
      )
        continue;
      if (links.some((link) => [...recess, ...behind].some((p) => p.x === link.x && p.y === link.y))) continue;
      for (const p of recess) ground[cell(p.x, p.y)] = "floor";
      for (const p of [...behind, ...flank]) if (ground[cell(p.x, p.y)] === "rock") ground[cell(p.x, p.y)] = "wall";
      alcoves.set(n, recess);
    }
  }

  // Chamfered halls: a great room's corners cut off on the slant, an octagon more than a box, wherever no
  // door or stair stands in the corner (panel 2026-11-17).
  for (const [n, r] of nodes.entries()) {
    const room = owner.get(n);
    if (isPassage(n) || !room || room.use === "open" || Math.min(r.w, r.h) < 6) continue;
    if (!SITE_CHAMFERED.has(siteBaseName(room.name)) && !(Math.min(r.w, r.h) >= 7 && random() < 0.25)) continue;
    const k = Math.min(r.w, r.h) >= 9 ? 2 : 1;
    for (const [sx, sy] of [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ] as const) {
      const [cx, cy] = [sx > 0 ? r.x : r.x + r.w - 1, sy > 0 ? r.y : r.y + r.h - 1];
      const cut: Array<{ x: number; y: number }> = [];
      for (let a = 0; a < k; a++) for (let b = 0; b < k - a; b++) cut.push({ x: cx + sx * a, y: cy + sy * b });
      const isCut = (x: number, y: number) => cut.some((p) => p.x === x && p.y === y);
      const safe = cut.every(
        (p) =>
          ground[cell(p.x, p.y)] === "floor" &&
          !links.some((link) => link.x === p.x && link.y === p.y) &&
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].every(([dx, dy]) => {
            const [x, y] = [p.x + dx!, p.y + dy!];
            return inside(r, x, y) || isCut(x, y) || ground[cell(x, y)] !== "floor";
          }),
      );
      if (safe) for (const p of cut) ground[cell(p.x, p.y)] = "wall";
    }
  }

  const rooms: DungeonRoom[] = [];
  const info: SiteLevelMap["rooms"] = [];
  const doors: Array<{ x: number; y: number; room: number; locked: boolean } | null> = [];
  const opens: Array<SiteSide | null> = [];
  const roomOf = new Map<SitePlanRoom, number>();
  const ways: SiteRect[] = passages.filter((_, n) => live(n));
  for (const [n, room] of [...owner.entries()].sort((p, q) => depth[p[0]]! - depth[q[0]]! || p[0] - q[0])) {
    const r = nodes[n]!;
    const door = n === start && entry ? entrance : (doorOf.get(n) ?? null);
    const side: SiteSide | null = !door
      ? null
      : door.y < r.y
        ? "N"
        : door.y >= r.y + r.h
          ? "S"
          : door.x < r.x
            ? "W"
            : "E";
    const k = rooms.length;
    roomOf.set(room, k);
    rooms.push({ ...r });
    info.push({ name: room.name, use: room.use, ...(room.heart ? { heart: true as const } : {}) });
    doors.push(door && n !== court ? { ...door, room: k, locked: !!room.locked && n !== start } : null);
    opens.push(side);
    // A great room's pillars: two rows of them down a big one, clear of its doors and links.
    if (SITE_HALL_ROOMS.has(room.name) && plan.template !== "manor" && r.w >= 7 && r.h >= 7) {
      const doorway = (x: number, y: number) =>
        [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ].some(([dx, dy]) => ground[cell(dx!, dy!)] === "floor" && !inside(r, dx!, dy!));
      const vertical = r.h > r.w;
      for (const off of [2, (vertical ? r.w : r.h) - 3])
        for (let along = 2; along < (vertical ? r.h : r.w) - 2; along += 3) {
          const [x, y] = vertical ? [r.x + off, r.y + along] : [r.x + along, r.y + off];
          if (links.some((link) => link.x === x && link.y === y) || doorway(x, y)) continue;
          ground[cell(x, y)] = "wall";
        }
    }
  }
  if (entry) props[cell(entrance.x, entrance.y)] = DUNGEON_EXIT_PROP;
  for (const at of secrets) props[cell(at.x, at.y)] = DUNGEON_SECRET_DOOR_PROP;
  // Solid with nothing open beside it is not wall but the land round the building.
  const solid = ground.map((g, i) => {
    if (g !== "wall") return false;
    const [x, y] = [i % mapW, Math.floor(i / mapW)];
    // A stone building's outer wall is two thick.
    for (let dy = -thick; dy <= thick; dy++)
      for (let dx = -thick; dx <= thick; dx++) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx < 0 || ny < 0 || nx >= mapW || ny >= mapH) continue;
        if (ground[cell(nx, ny)] !== "wall" && ground[cell(nx, ny)] !== "rock") return false;
      }
    return true;
  });
  for (const [i, inside2] of solid.entries()) if (inside2) ground[i] = "rock";
  // Flooded: water across the rooms' middles, never cutting a room off from its door.
  if (level.flooded)
    for (const area of rooms) {
      if (area.w < 3 || area.h < 3) continue;
      for (let y = area.y + 1; y < area.y + area.h - 1; y++)
        for (let x = area.x + 1; x < area.x + area.w - 1; x++)
          if (ground[cell(x, y)] === "floor" && !links.some((link) => link.x === x && link.y === y) && random() < 0.7)
            ground[cell(x, y)] = "liquid";
    }
  const map: DungeonMap = {
    set: plan.set,
    seed: plan.seed,
    width: mapW,
    height: mapH,
    ground,
    props,
    rooms,
    entrance,
    roomNames: info.map((each) => each.name),
  };
  const linked = new Set(links.map((link) => cell(link.x, link.y)));
  // Every open cell reachable from the way in (or the first link), so water and furniture never cut
  // a room off.
  const reachable = () => {
    const begin = cell(entrance.x, entrance.y);
    const seen = new Uint8Array(ground.length);
    const queue = [begin];
    seen[begin] = 1;
    for (let head = 0; head < queue.length; head++) {
      const c = queue[head]!;
      const x = c % mapW;
      for (const n of [c - 1, c + 1, c - mapW, c + mapW]) {
        if (n < 0 || n >= ground.length || seen[n] || (n === c - 1 && x === 0) || (n === c + 1 && x === mapW - 1))
          continue;
        if (
          ground[n] !== "floor" ||
          (props[n] !== -1 &&
            props[n] !== DUNGEON_EXIT_PROP &&
            props[n] !== SITE_LOCK_PROP &&
            props[n] !== DUNGEON_SECRET_DOOR_PROP)
        )
          continue;
        seen[n] = 1;
        queue.push(n);
      }
    }
    return ground.every((g, i) => g !== "floor" || seen[i] || (props[i] !== -1 && props[i] !== DUNGEON_EXIT_PROP));
  };
  // Stepped walls: the wall between two rooms side by side jogs over by a cell part of the way along, so
  // one room takes a bite out of the other and they interlock instead of lining up in a lattice (panel
  // round 4). Only where the wall has no door in the stretch that moves, and nothing is cut off by it.
  for (const edge of edges) {
    if (isPassage(edge.a) || isPassage(edge.b) || edge.cells.length < 6) continue;
    const [one, two] = [owner.get(edge.a), owner.get(edge.b)];
    if (!one || !two || one.use === "open" || two.use === "open" || random() > 0.2) continue;
    const vertical = edge.cells[0]!.x === edge.cells[1]!.x;
    const giver = random() < 0.5 ? edge.a : edge.b;
    if ((vertical ? nodes[giver]!.w : nodes[giver]!.h) < 5) continue;
    const d = giver === edge.a ? -1 : 1;
    const shift = (p: { x: number; y: number }, by = d) =>
      vertical ? { x: p.x + by, y: p.y } : { x: p.x, y: p.y + by };
    const k = 2 + Math.floor(random() * (edge.cells.length - 4));
    const tail = random() < 0.5;
    const stretch = tail ? edge.cells.slice(k) : edge.cells.slice(0, k);
    const jog = tail ? edge.cells[k - 1]! : edge.cells[k]!;
    const rise = [...stretch.map((p) => shift(p)), shift(jog)];
    const clearOf = (p: { x: number; y: number }) => !links.some((link) => link.x === p.x && link.y === p.y);
    if (
      !stretch.every((p) => ground[cell(p.x, p.y)] === "wall") ||
      !rise.every((p) => ground[cell(p.x, p.y)] === "floor" && clearOf(p)) ||
      !stretch.every((p) => ground[cell(shift(p, 2 * d).x, shift(p, 2 * d).y)] === "floor")
    )
      continue;
    for (const p of stretch) ground[cell(p.x, p.y)] = "floor";
    for (const p of rise) ground[cell(p.x, p.y)] = "wall";
    if (!reachable()) {
      for (const p of stretch) ground[cell(p.x, p.y)] = "wall";
      for (const p of rise) ground[cell(p.x, p.y)] = "floor";
    }
  }
  // Water that cuts a room off is drained.
  if (level.flooded && !reachable())
    for (let i = 0; i < ground.length; i++) if (ground[i] === "liquid") ground[i] = "floor";
  // Locks: a locked room's door; its key in another room of the level that is open.
  const locks: SiteLevelLock[] = [];
  const open = rooms.map((_, n) => n).filter((n) => !doors[n]?.locked);
  for (const door of doors) {
    if (!door?.locked || !open.length) continue;
    props[cell(door.x, door.y)] = SITE_LOCK_PROP;
    locks.push({ x: door.x, y: door.y, room: door.room, key: open[Math.floor(random() * open.length)]! });
  }
  // Furniture against each room's back wall (the one facing its door), then rubble in ruined rooms;
  // never closing a way.
  const doorCells = new Set(doors.flatMap((door) => (door ? [cell(door.x, door.y)] : [])));
  for (const [room, n] of roomOf) {
    const area = rooms[n]!;
    const side = opens[n];
    const put = (slot: number, x: number, y: number) => {
      const i = cell(x, y);
      if (ground[i] !== "floor" || props[i] !== -1 || linked.has(i) || doorCells.has(i)) return false;
      props[i] = slot;
      if (reachable()) return true;
      props[i] = -1;
      return false;
    };
    // Where each piece goes, by what it is: tables down the middle, beds and shelves against the walls
    // (the back wall first), the hearth in the middle of the back wall, chests in the corners; in a crypt
    // sarcophagi down the middle, bones about the floor, torches on the walls, pillars in rows. A big room
    // gets more of what it is furnished with, never so much that it is cluttered or a way is closed.
    const near = (x: number, y: number) =>
      [...doorCells, ...linked, cell(entrance.x, entrance.y)].some((c) => {
        const [cx2, cy2] = [c % mapW, Math.floor(c / mapW)];
        return Math.abs(cx2 - x) + Math.abs(cy2 - y) <= 1;
      });
    const [x0, y0, x1, y1] = [area.x, area.y, area.x + area.w - 1, area.y + area.h - 1];
    const backRow: Array<[number, number]> = [];
    const sideRows: Array<Array<[number, number]>> = [];
    const frontRow: Array<[number, number]> = [];
    // Each wall a run of its own, so "every other cell" holds along it.
    const run = (from: [number, number], step: [number, number], n: number) =>
      Array.from({ length: Math.max(0, n) }, (_, k): [number, number] => [
        from[0] + step[0] * k,
        from[1] + step[1] * k,
      ]);
    const walls = {
      N: run([x0 + 1, y0], [1, 0], area.w - 2),
      S: run([x0 + 1, y1], [1, 0], area.w - 2),
      W: run([x0, y0 + 1], [0, 1], area.h - 2),
      E: run([x1, y0 + 1], [0, 1], area.h - 2),
    };
    const facing = { N: "S", S: "N", W: "E", E: "W" } as const;
    const back = side ? facing[side] : "N";
    const front = side ?? "S";
    backRow.push(...walls[back]);
    frontRow.push(...walls[front]);
    for (const key of ["N", "S", "W", "E"] as const) if (key !== back && key !== front) sideRows.push(walls[key]);
    const corners: Array<[number, number]> = [
      [x0, y0],
      [x1, y0],
      [x0, y1],
      [x1, y1],
    ];
    const along = area.w >= area.h;
    const short = along ? area.h : area.w;
    const long = along ? area.w : area.h;
    // A hall's, a dining room's or a refectory's tables make one long board down the middle.
    const feast = SITE_FEAST_ROOMS.has(siteBaseName(room.name));
    const lines =
      short >= 7 && !feast ? [Math.floor(short / 3), short - 1 - Math.floor(short / 3)] : [Math.floor((short - 1) / 2)];
    const middle: Array<[number, number]> = [];
    for (const line of lines)
      for (let k = short >= 3 ? 1 : 0; k < (short >= 3 ? long - 1 : long); k += feast || long < 5 ? 1 : 2)
        // A long board is broken every few places, so a hall has tables, not one endless row.
        if (!feast || k % 5 !== 0) middle.push(along ? [x0 + k, y0 + line] : [x0 + line, y0 + k]);
    const pillars: Array<[number, number]> = [];
    if (short >= 5) for (let y = y0 + 1; y < y1; y += 3) for (let x = x0 + 1; x < x1; x += 3) pillars.push([x, y]);
    const shuffle = <T>(list: T[]) => {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [list[i], list[j]] = [list[j]!, list[i]!];
      }
      return list;
    };
    const everywhere = () => {
      const out: Array<[number, number]> = [];
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) out.push([x, y]);
      return shuffle(out);
    };
    // Stacked together: heaps of one thing in a corner of the room, not dotted about the floor (panel
    // 2026-11-17).
    const anchor = corners.length ? corners[Math.floor(random() * corners.length)]! : ([x0, y0] as [number, number]);
    const clustered = () =>
      everywhere().sort(
        (p, q) =>
          Math.abs(p[0] - anchor[0]) +
          Math.abs(p[1] - anchor[1]) -
          (Math.abs(q[0] - anchor[0]) + Math.abs(q[1] - anchor[1])),
      );
    // Every other cell along each wall in turn (starting at random), and only then the cells between.
    // A few cells held back to the end, so a row has gaps in it and not an even beat (panel round 4).
    const spread = (...lists: Array<Array<[number, number]>>) => {
      const skips = lists.map(() => Math.floor(random() * 2));
      const order = [0, 1].flatMap((odd) =>
        lists.flatMap((list, n) => list.filter((_, k) => (k + skips[n]!) % 2 === odd)),
      );
      const held = order.map(() => random() < 0.3);
      return [...order.filter((_, k) => !held[k]), ...order.filter((_, k) => held[k])];
    };
    const backMiddle = [...backRow].sort((p, q) => {
      const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2];
      return Math.abs(p[0] - mx) + Math.abs(p[1] - my) - (Math.abs(q[0] - mx) + Math.abs(q[1] - my));
    });
    const reps = Math.max(1, Math.min(5, Math.round((area.w * area.h) / 14)));
    let budget = Math.max(1, Math.floor((area.w * area.h) / 4));
    const tiny = Math.min(area.w, area.h) < 3;
    // What the room is dressed with: its recipe by name where it has one (gamer panel 2026-11-17: a
    // kitchen has its range and barrels, a nave its pews), else its plan's furniture by slot.
    const recipe = plan.template === "crypt" ? undefined : SITE_RECIPES[siteBaseName(room.name)];
    const items: Array<{ slot: number; kind: SiteRole; count: number }> = recipe
      ? recipe.map(([slot, kind, n]) => ({
          // Books where people read; jars, pots and sacks on the shelves of stores and kitchens.
          slot: slot === SHELF && !SITE_BOOK_ROOMS.has(siteBaseName(room.name)) ? JARS : slot,
          kind,
          // A big room holds more of what stands round its walls than a small one (panel 2026-11-17).
          count:
            n === "all"
              ? Infinity
              : n === "reps"
                ? reps
                : (n ?? 1) *
                  (kind === "center" || kind === "back" || SITE_ONE_OFF.has(slot) || room.use === "open"
                    ? 1
                    : Math.max(1, Math.floor((area.w * area.h) / 40))),
        }))
      : room.furniture.map((slot) => {
          const kind = siteFurnitureRole(plan.template, slot);
          // A bed is one to a room but in a dormitory; everything else set out along a wall or down the
          // middle repeats with the room's size.
          const one =
            (plan.template !== "crypt" && slot === BED && !SITE_DORMS.has(siteBaseName(room.name))) ||
            // A crypt's heart has the one tomb in the middle of it, the founder's, not a row.
            (plan.template === "crypt" && !!room.heart && slot === 0);
          const count =
            feast && kind === "center"
              ? middle.length
              : !one && (kind === "center" || kind === "wall" || kind === "scatter" || kind === "pillar")
                ? reps
                : 1;
          return { slot, kind, count };
        });
    // Pews: rows across the room, every other line, either side of an aisle down the middle, clear of both
    // ends and of the side walls (panel 2026-11-17).
    const pews: Array<[number, number]> = [];
    if (short >= 5)
      for (let k = 2; k < long - 2; k += 2)
        for (let line = 1; line < short - 1; line++) {
          if (Math.abs(line - (short - 1) / 2) < 1) continue;
          pews.push(along ? [x0 + k, y0 + line] : [x0 + line, y0 + k]);
        }
    // Seats: stools along both sides of each table set out, a table to sit at (panel 2026-11-17).
    const seats = () => {
      const isTable = (x: number, y: number) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && props[cell(x, y)] === T;
      const out: Array<[number, number]> = [];
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          if (!isTable(x, y)) continue;
          const upright = !isTable(x - 1, y) && !isTable(x + 1, y) && (isTable(x, y - 1) || isTable(x, y + 1));
          for (const [sx, sy] of upright
            ? [
                [x - 1, y],
                [x + 1, y],
              ]
            : [
                [x, y - 1],
                [x, y + 1],
              ])
            if (sx! >= x0 && sx! <= x1 && sy! >= y0 && sy! <= y1) out.push([sx!, sy!]);
        }
      return out;
    };
    for (const { slot, kind, count } of items) {
      const spots = tiny
        ? everywhere()
        : kind === "back"
          ? [...backMiddle, ...spread(...sideRows)]
          : kind === "corner"
            ? [...shuffle(corners), ...spread(backRow)]
            : kind === "wall"
              ? spread(backRow, ...sideRows, frontRow)
              : kind === "center"
                ? // A centrepiece or two in the very middle; a long board along it.
                  count <= 2
                  ? [...middle].sort(
                      (p, q) =>
                        Math.abs(p[0] - (x0 + x1) / 2) +
                        Math.abs(p[1] - (y0 + y1) / 2) -
                        Math.abs(q[0] - (x0 + x1) / 2) -
                        Math.abs(q[1] - (y0 + y1) / 2),
                    )
                  : middle
                : kind === "pillar"
                  ? pillars
                  : kind === "pews"
                    ? pews
                    : kind === "seats"
                      ? seats()
                      : kind === "scatter" && plan.template !== "crypt"
                        ? clustered()
                        : everywhere();
      let placed = 0;
      for (const [x, y] of spots) {
        // Seats come with their table, outside the room's budget.
        if (placed >= count || (budget <= 0 && kind !== "seats")) break;
        if (near(x, y)) continue;
        if (put(slot, x, y)) {
          placed++;
          if (kind !== "seats") budget--;
        }
      }
    }
    // Something left lying about now and then, a sign of who was here: a stool knocked over, a jug spilt, a
    // sword dropped, cobwebs where nobody goes (panel round 4).
    if (plan.template !== "crypt" && room.use !== "open" && !tiny && random() < 0.55) {
      const base = siteBaseName(room.name);
      const pick =
        /store|cellar|lumber|attic|trunk|coal|granary|vault|garret|loft|undercroft|relic|charnel|ossuary/iu.test(base)
          ? COBWEB
          : /guard|barracks|armoury|gate|watch|gaol|interrogation|wall walk|lookout/iu.test(base)
            ? SWORD
            : random() < 0.5
              ? TIPPED
              : JUG;
      const spots = pick === COBWEB ? [...shuffle(corners), ...everywhere()] : everywhere();
      for (const [x, y] of spots) if (!near(x, y) && put(pick, x, y)) break;
    }
    if (room.ruined)
      for (let k = 0; k < Math.ceil((area.w * area.h) / 6); k++)
        put(SITE_RUBBLE_PROP, area.x + Math.floor(random() * area.w), area.y + Math.floor(random() * area.h));
  }
  // Each alcove holds one thing: a statue, or in a crypt a sarcophagus.
  for (const recess of alcoves.values()) {
    const mid = recess[1]!;
    if (props[cell(mid.x, mid.y)] !== -1) continue;
    props[cell(mid.x, mid.y)] = plan.template === "crypt" ? 0 : STATUE;
    // Never the piece that shuts a way: a recess can be the one way round a crowded room.
    if (!reachable()) props[cell(mid.x, mid.y)] = -1;
  }
  // Traps, only where the rules can find them: in the ways and in the holders' rooms and stores, never on
  // a link, a door or the way in.
  const traps: SiteLevelTrap[] = [];
  if (options.traps) {
    const want = 1 + Math.floor(random() * (2 + plan.wealth));
    for (let tries = 0; tries < 60 && traps.length < want; tries++) {
      const target = random() < 0.4 ? -1 : Math.floor(random() * rooms.length);
      const area = target < 0 && ways.length ? ways[Math.floor(random() * ways.length)]! : rooms[Math.max(0, target)]!;
      if (target >= 0 && (info[target]!.use === "quiet" || info[target]!.use === "open")) continue;
      const x = area.x + Math.floor(random() * area.w);
      const y = area.y + Math.floor(random() * area.h);
      const i = cell(x, y);
      if (ground[i] !== "floor" || props[i] !== -1 || linked.has(i) || doorCells.has(i)) continue;
      if (Math.abs(x - entrance.x) + Math.abs(y - entrance.y) < 3) continue;
      if (traps.some((trap) => trap.x === x && trap.y === y)) continue;
      traps.push({ x, y, dc: 10 + plan.wealth * 2 + Math.floor(random() * 4) - level.depth });
    }
  }
  map.entrance = entrance;
  return { map, rooms: info, links, locks, traps };
}

// ── As the game keeps it ──

/** What the party has done in a planned building, kept across its levels. */
export interface SitePlanState {
  seen?: Record<string, number[]>;
  unlocked?: string[];
  trapsFound?: string[];
  trapsGone?: string[];
}

const WEALTH_WORDS: ReadonlyArray<[RegExp, 1 | 2 | 3]> = [
  [/\b(palace|castle|citadel|cathedral|chateau)\b/u, 3],
  [/\b(estate|manor|mansion|abbey|fortress|monastery|stronghold)\b/u, 2],
  [/\b(house|lodge|cottage|chapel|shrine|fort|tower)\b/u, 1],
];
const UNDEAD_WORDS =
  /\b(vampires?|counts?|countess|haunted|cursed|accursed|dread|blood|necro\w*|lich|graves?|bones?|blighted|dead)\b/u;

/** The plan input of a building from its name and the game's seed for it, with what the world says
 *  (its fate, its land) on top. */
export function sitePlanInputFor(input: {
  template: SiteTemplateId;
  name: string;
  seed: number;
  fate?: SiteFate;
  terrain?: SiteTerrain;
  wealth?: 1 | 2 | 3;
  undead?: boolean;
}): SitePlanInput {
  const words = input.name.toLowerCase();
  const random = marinaraRandom(`site-input:${input.seed}:${words}`);
  const roll = random();
  const wealth = input.wealth ?? WEALTH_WORDS.find(([pattern]) => pattern.test(words))?.[1] ?? (roll < 0.5 ? 1 : 2);
  const undead =
    input.undead ??
    (UNDEAD_WORDS.test(words) ||
      input.fate === "sickness" ||
      ((input.template === "manor" || input.template === "keep") && random() < 0.25));
  return {
    template: input.template,
    seed: input.seed,
    wealth,
    ...(input.fate ? { fate: input.fate } : {}),
    ...(input.terrain ? { terrain: input.terrain } : {}),
    ...(undead ? { undead: true } : {}),
  };
}

/**
 * A level of a planned building as the game keeps it: its rooms by name and use, its links, locks and
 * traps, with what the party has done there (locks opened, traps found and gone) laid back on, and the
 * party at the way in or, coming from another level, at the link it came by.
 */
export function gameDungeonPlannedMap(input: {
  plan: SitePlanInput;
  name: string;
  id: string;
  level?: number;
  /** The level the party comes from, to stand at the link from it. */
  from?: number;
  traps?: boolean;
  state?: SitePlanState;
}): GameDungeonMap {
  const plan = sitePlan(input.plan);
  const level = Math.max(0, Math.min(plan.levels.length - 1, input.level ?? plan.entry));
  const laid = siteLevelMap(plan, level, { traps: input.traps });
  const state = input.state ?? {};
  const unlocked = new Set(state.unlocked ?? []);
  const gone = new Set(state.trapsGone ?? []);
  const found = new Set(state.trapsFound ?? []);
  const kept = gameDungeonMapFromDungeon(laid.map, input.name, input.id);
  const props = [...kept.props];
  const locks = laid.locks.filter((lock) => {
    if (!unlocked.has(`${level}:${lock.room}`)) return true;
    props[lock.y * laid.map.width + lock.x] = "-";
    return false;
  });
  const traps = laid.traps
    .filter((trap) => !gone.has(`${level}:${trap.x}:${trap.y}`))
    .map((trap) => ({ ...trap, ...(found.has(`${level}:${trap.x}:${trap.y}`) ? { found: true as const } : {}) }));
  const arrive = input.from !== undefined ? laid.links.find((link) => link.level === input.from) : undefined;
  const at = arrive ? { x: arrive.x, y: arrive.y } : laid.map.entrance;
  return {
    ...kept,
    props: props.join(""),
    entrance: laid.map.entrance,
    at,
    roomInfo: laid.rooms.map((room) => ({
      name: room.name,
      use: room.use,
      ...(room.heart ? { heart: true as const } : {}),
    })),
    site: {
      template: plan.template,
      wealth: plan.wealth,
      ...(input.plan.fate ? { fate: input.plan.fate } : {}),
      ...(input.plan.terrain ? { terrain: input.plan.terrain } : {}),
      ...(input.plan.undead ? { undead: true as const } : {}),
      ...(input.traps ? { traps: true as const } : {}),
      level,
      levels: plan.levels.map((each) => ({ name: each.name, depth: each.depth })),
      seen: state.seen ?? {},
      unlocked: [...unlocked],
      trapsFound: [...found],
      trapsGone: [...gone],
    },
    links: laid.links,
    ...(locks.length ? { locks } : {}),
    ...(traps.length ? { traps } : {}),
  };
}

/** A planned building's plan input back from a level the game keeps. */
export function sitePlanInputOf(map: GameDungeonMap): SitePlanInput | null {
  const site = map.site;
  const template = SITE_TEMPLATE_IDS.find((id) => id === site?.template);
  if (!site || !template) return null;
  return {
    template,
    seed: map.siteSeed ?? map.seed,
    wealth: site.wealth,
    ...(site.fate ? { fate: site.fate as SiteFate } : {}),
    ...(site.terrain ? { terrain: site.terrain as SiteTerrain } : {}),
    ...(site.undead ? { undead: true } : {}),
  };
}

/** What a walk on a planned building's level did: where it really ended (a hidden trap stops it), the
 *  rooms it went through, the locks it opened and the trap it set off. */
export interface SiteWalkResult {
  map: GameDungeonMap;
  /** The cells walked, cut at a trap set off. */
  path: Array<{ x: number; y: number }>;
  /** Names of the rooms whose locks opened: their keys were in a room walked into. */
  unlocked: string[];
  /** A hidden trap set off on the way: its area (0 the hall) and how hard. */
  trap?: { area: number; dc: number };
}

/** A walk on a level: rooms walked into are seen, their keys open their locks, and a hidden trap on the
 *  way stops the party on it, set off and spent. Maps that are not planned pass through untouched. */
export function siteWalk(map: GameDungeonMap, path: Array<{ x: number; y: number }>): SiteWalkResult {
  if (!map.site || !map.roomInfo) return { map: { ...map, at: path.at(-1) ?? map.at }, path, unlocked: [] };
  const site = { ...map.site };
  const areaAt = (x: number, y: number) =>
    map.rooms.findIndex((room) => x >= room.x && x < room.x + room.w && y >= room.y && y < room.y + room.h);
  // A hidden trap on the way: the walk ends on it.
  let walked = path;
  let trap: SiteWalkResult["trap"];
  const traps = [...(map.traps ?? [])];
  const hit = walked.findIndex((step) => traps.some((each) => !each.found && each.x === step.x && each.y === step.y));
  if (hit >= 0) {
    walked = walked.slice(0, hit + 1);
    const step = walked[hit]!;
    const sprung = traps.find((each) => each.x === step.x && each.y === step.y)!;
    trap = { area: areaAt(step.x, step.y) + 1, dc: sprung.dc };
    traps.splice(traps.indexOf(sprung), 1);
  }
  const rooms = new Set<number>();
  for (const step of walked) {
    const area = areaAt(step.x, step.y);
    if (area >= 0) rooms.add(area);
  }
  const key = String(site.level);
  const seen = [...new Set([...(site.seen[key] ?? []), ...rooms])].sort((a, b) => a - b);
  const props = [...map.props];
  const unlocked: string[] = [];
  const locks = (map.locks ?? []).filter((lock) => {
    if (!rooms.has(lock.key)) return true;
    props[lock.y * map.width + lock.x] = "-";
    unlocked.push(map.roomInfo![lock.room]?.name ?? `area ${lock.room + 1}`);
    site.unlocked = [...site.unlocked, `${site.level}:${lock.room}`];
    return false;
  });
  const end = walked.at(-1) ?? map.at;
  return {
    map: {
      ...map,
      at: end,
      props: props.join(""),
      site: {
        ...site,
        seen: { ...site.seen, [key]: seen },
        unlocked: [...new Set(site.unlocked)],
        trapsGone: trap ? [...site.trapsGone, `${site.level}:${end.x}:${end.y}`] : site.trapsGone,
      },
      ...(locks.length ? { locks } : { locks: undefined }),
      ...(traps.length ? { traps } : { traps: undefined }),
    },
    path: walked,
    unlocked,
    ...(trap ? { trap } : {}),
  };
}

/** What a reply's planned-building tags ask: `[map: unlock area=N]` opens a lock the story opened;
 *  `[trap: found area=N]` marks the traps in an area found (0 the hall), `[trap: disarmed area=N]` gone. */
export function readGameDungeonPlanTags(text: string): { unlock: number[]; found: number[]; disarmed: number[] } {
  const out = { unlock: [] as number[], found: [] as number[], disarmed: [] as number[] };
  for (const match of text.matchAll(/\[map:\s*unlock\s+area\s*=\s*"?(\d{1,2})"?\s*\]/giu))
    out.unlock.push(Number(match[1]));
  for (const match of text.matchAll(/\[trap:\s*(found|disarmed)\s+area\s*=\s*"?(\d{1,2})"?\s*\]/giu))
    (match[1]!.toLowerCase() === "found" ? out.found : out.disarmed).push(Number(match[2]));
  return out;
}

/** A planned level with a reply's tags laid on: locks opened, traps found or disarmed. */
export function siteApplyTags(map: GameDungeonMap, tags: ReturnType<typeof readGameDungeonPlanTags>): GameDungeonMap {
  if (!map.site || (!tags.unlock.length && !tags.found.length && !tags.disarmed.length)) return map;
  const site = { ...map.site };
  const areaOf = (x: number, y: number) =>
    map.rooms.findIndex((room) => x >= room.x && x < room.x + room.w && y >= room.y && y < room.y + room.h) + 1;
  const props = [...map.props];
  const locks = (map.locks ?? []).filter((lock) => {
    if (!tags.unlock.includes(lock.room + 1)) return true;
    props[lock.y * map.width + lock.x] = "-";
    site.unlocked = [...new Set([...site.unlocked, `${site.level}:${lock.room}`])];
    return false;
  });
  const traps = (map.traps ?? []).flatMap((trap) => {
    const area = areaOf(trap.x, trap.y);
    const id = `${site.level}:${trap.x}:${trap.y}`;
    if (tags.disarmed.includes(area)) {
      site.trapsGone = [...new Set([...site.trapsGone, id])];
      return [];
    }
    if (tags.found.includes(area)) {
      site.trapsFound = [...new Set([...site.trapsFound, id])];
      return [{ ...trap, found: true as const }];
    }
    return [trap];
  });
  return {
    ...map,
    props: props.join(""),
    site,
    ...(locks.length ? { locks } : { locks: undefined }),
    ...(traps.length ? { traps } : { traps: undefined }),
  };
}

/** The hidden traps of a level, for the Game Master only (the party sees none until found), with the
 *  checks the game's rules find them by. */
export function siteTrapPromptText(map: GameDungeonMap, skills: readonly string[]): string {
  const hidden = (map.traps ?? []).filter((trap) => !trap.found);
  if (!map.site?.traps) return "";
  const areaOf = (x: number, y: number) =>
    map.rooms.findIndex((room) => x >= room.x && x < room.x + room.w && y >= room.y && y < room.y + room.h) + 1;
  const where = hidden.map((trap) => {
    const area = areaOf(trap.x, trap.y);
    return `${area ? `area ${area}${map.roomInfo?.[area - 1] ? ` (${map.roomInfo[area - 1]!.name})` : ""}` : "the hall"}, DC ${trap.dc}`;
  });
  const by = skills.length ? skills.join(" or ") : "a search";
  return `TRAPS ON THIS LEVEL (secret: never name one the party has not found): ${where.length ? where.join("; ") : "none left"}. When the party searches an area, or walks in with its guard up, call for a ${by} check against the trap's DC; found, write [trap: found area=N] and the map shows it; disarmed, write [trap: disarmed area=N] (a trap set off is spent and gone). A party that walks onto a hidden trap sets it off: the Engine stops their walk there and tells you; resolve it by the rules.`;
}
