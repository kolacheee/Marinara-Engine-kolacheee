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
export const SITE_LINK_KINDS = ["stairs", "servants", "ladder", "hidden", "hole", "wall"] as const;
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
      ["Lady's chamber", 2, [BED, CHEST, FIRE]],
      ["Bedchamber", 2, [BED, CHEST]],
      ["Closet", 1, [CHEST, SHELF]],
      ["Writing room", 1, [T, SHELF]],
      ["Prayer closet", 1, [T]],
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
      ["Estate office", 1, [T, SHELF, CHEST]],
      ["Still room", 1, [SHELF, T]],
      ["Dairy", 1, [T, CHEST]],
      ["Housekeeper's room", 1, [BED, T]],
      ["Saloon", 3, [T, FIRE, SHELF]],
      ["Withdrawing room", 2, [T, FIRE]],
    ],
    below: [
      ["Coal store", 2, [CHEST]],
      ["Larder", 1, [SHELF, CHEST]],
      ["Brewhouse", 2, [FIRE, CHEST, T]],
      ["Lumber cellar", 3, [CHEST, CHEST]],
      ["Beer cellar", 2, [CHEST, CHEST]],
      ["Root cellar", 1, [CHEST]],
      ["Wood store", 2, [CHEST]],
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
      ["Bedchamber", 2, [BED, CHEST]],
      ["Lady's bower", 2, [BED, FIRE, CHEST]],
      ["Oratory", 1, [T]],
      ["Clerk's room", 1, [T, SHELF]],
    ],
    ground: [
      ["Guardroom", 2, [T, SHELF]],
      ["Smithy", 2, [FIRE, T, CHEST]],
      ["Well house", 1, [CHEST]],
      ["Granary", 2, [CHEST, CHEST]],
      ["Bakehouse", 2, [FIRE, T]],
      ["Kennels", 1, [CHEST]],
      ["Storehouse", 3, [CHEST, SHELF]],
      ["Buttery", 1, [CHEST, SHELF]],
      ["Brewhouse", 2, [FIRE, CHEST]],
      ["Workshop", 2, [T, CHEST]],
      ["Mews", 1, [CHEST]],
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
      ["Warming room", 2, [FIRE, T]],
      ["Infirmary", 2, [BED, T]],
      ["Book room", 2, [SHELF, T]],
      ["Parlour", 1, [T]],
    ],
    below: [
      ["Charnel", 2, [CHEST]],
      ["Store vault", 2, [CHEST, SHELF]],
      ["Crypt chapel", 2, [T, FIRE]],
      ["Relic store", 1, [CHEST]],
      ["Cellarium", 2, [CHEST, SHELF]],
      ["Well chamber", 1, [CHEST]],
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
    // A castle's wall walk has a stair of its own down into the range below it, a second way between the
    // floors that keeps clear of the donjon (panel 2026-11-17).
    if (input.template === "keep" && upper.depth === 1 && lower.depth === 0 && !upper.inset)
      links.push({ upper: i, lower: i + 1, kind: "wall" });
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
  COLUMN = 16,
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
    [CART, "scatter", 2],
    [DUMMY, "scatter", 2],
    [WOODPILE, "wall", 2],
    [HAY, "scatter", 2],
    [BARREL, "corner", 2],
    [CRATE, "scatter", 3],
    [ANVIL, "wall"],
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
// ── The layout core (rebuilt 2026-11-17, owner's call after panels plateaued at 5.5) ──
// A building's outline is drawn by its kind (a manor's wings, a keep's curtain with its ward, gate and
// towers, a temple's cross of nave and transepts with its apse and cloister, a crypt cut in rock); the
// spaces every such building has are laid down first (stairwells that stand one over another, the nave,
// the ward, the gate passage, the cloister walk, the towers); corridors run where the plan wants them,
// wandering, not ruled straight; and then every planned room grows from a seed to about its own size, so
// rooms come in many sizes and shapes (an L, a T, a room that wraps round a stair) and walls rarely line
// up into a lattice.

/** How big a planned room grows, in cells, by its size. */
const SITE_WANT = { 1: 12, 2: 26, 3: 46 } as const;
/** The rooms a floor is built round: they grow to twice and more the size of the rest. */
const SITE_SET_PIECES = new Set([
  "Great hall",
  "Ballroom",
  "Burial hall",
  "Undercroft",
  "Chapter house",
  "Long gallery",
]);
/** The stairwells, by every name they go by: kept clear of guards, so a stair is not always a fight. */
export const SITE_STAIR_ROOMS: ReadonlySet<string> = new Set(
  Object.values({
    manor: ["Stair hall", "Back stairs", "Attic stair"],
    keep: ["Stairwell", "Back stair", "Tower stair"],
    temple: ["Crypt stair", "Night stair", "Belfry stair"],
    crypt: ["Stair"],
  }).flat(),
);
/** What a building's hidden room is called: behind a hidden door, with something worth finding. */
const SITE_HIDDEN_ROOM: Record<SiteTemplateId, string> = {
  manor: "Priest hole",
  keep: "Secret strongroom",
  temple: "Hidden reliquary",
  crypt: "Robbers' cache",
};
/** What the stairwells are called: the main stairs, the back stairs, a ladder up to a top floor. */
const SITE_STAIR_NAMES: Record<SiteTemplateId, { main: string; back: string; ladder: string }> = {
  manor: { main: "Stair hall", back: "Back stairs", ladder: "Attic stair" },
  keep: { main: "Stairwell", back: "Back stair", ladder: "Tower stair" },
  temple: { main: "Crypt stair", back: "Night stair", ladder: "Belfry stair" },
  crypt: { main: "Stair", back: "Stair", ladder: "Stair" },
};

type SiteSide = "N" | "S" | "E" | "W";
interface SiteRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
type SiteEdge = { a: number; b: number; cells: Array<{ x: number; y: number }> };
type SiteKind = "court" | "hall" | "pass" | "walk" | "stair" | "tower" | "apse" | "entry" | "room";

/** A space laid down before the rooms grow. */
interface SiteFixed {
  kind: SiteKind;
  cells: number[];
  /** The levels it stands on. */
  on: (level: SitePlanLevel, index: number) => boolean;
  /** The plan's room it is, where the plan has one. */
  claim?: (room: SitePlanRoom) => boolean;
  /** Else this. */
  room?: SitePlanRoom;
  /** It opens on its neighbours through a wide arch. */
  arch?: true;
}

/** How hard a space holds its cells when a wall must go between it and its neighbour: the lower gives way. */
const SITE_HOLD: Record<SiteKind, number> = {
  walk: 3,
  pass: 3,
  stair: 3,
  court: 2,
  hall: 2,
  apse: 2,
  tower: 2,
  entry: 2,
  room: 1,
};

/** The building as a whole, from the plan alone: outline, the spaces every level of it shares, stairwells. */
const siteFrames = new WeakMap<SitePlan, ReturnType<typeof siteFrameOf>>();
/** A building's frame, worked out once for the plan and shared by every level laid out from it. */
function siteFrame(plan: SitePlan) {
  const known = siteFrames.get(plan);
  if (known) return known;
  const made = siteFrameOf(plan);
  siteFrames.set(plan, made);
  return made;
}

function siteFrameOf(plan: SitePlan) {
  const random = marinaraRandom(`site-frame2:${plan.template}:${plan.seed}:${plan.wealth}`);
  const kind = plan.template;
  const thick = kind === "keep" || kind === "temple" ? 2 : 1;
  const fx = kind === "keep" ? 6 : 2;
  const fy = kind === "keep" ? 6 : kind === "temple" ? 5 : 2;
  const mapW = plan.width + 2 * fx;
  const mapH = plan.height + 2 * fy;
  const L = fx + thick;
  const R = fx + plan.width - 1 - thick;
  const T = fy + thick;
  const B = fy + plan.height - 1 - thick;
  const W = R - L + 1;
  const H = B - T + 1;
  const cx = fx + Math.floor(plan.width / 2);
  const at = (x: number, y: number) => y * mapW + x;
  const cellsOf = (r: SiteRect, keep?: (x: number, y: number) => boolean) => {
    const out: number[] = [];
    for (let y = r.y; y < r.y + r.h; y++)
      for (let x = r.x; x < r.x + r.w; x++)
        if (x >= 2 && y >= 2 && x < mapW - 2 && y < mapH - 2 && (!keep || keep(x, y))) out.push(at(x, y));
    return out;
  };
  const put = (mask: Uint8Array, cells: readonly number[], value = 1) => {
    for (const c of cells) mask[c] = value;
  };
  const pct = (n: number, lo: number, hi: number) => Math.round(n * (lo + random() * (hi - lo)));
  const full = new Uint8Array(mapW * mapH);
  put(full, cellsOf({ x: L, y: T, w: W, h: H }));
  /** The part of the building a room grows in (a keep's ranges, its donjon; a temple's two sides); -2 none. */
  const zone = new Int16Array(mapW * mapH);
  const fixed: SiteFixed[] = [];
  const onGround = (level: SitePlanLevel) => level.depth === 0 && !level.inset;
  let groundOnly: number[] = [];
  let lightWell: number[] = [];
  let upper: Uint8Array | undefined;
  let below: Uint8Array | undefined;
  let inset: SiteRect = {
    x: fx + Math.max(4, Math.floor(plan.width * 0.22)),
    y: fy,
    w: plan.width - 2 * Math.max(4, Math.floor(plan.width * 0.22)),
    h: plan.height,
  };
  /** Where the main stairs want to stand, and the back stairs. */
  let mainAt = { x: cx + (random() < 0.5 ? -1 : 1) * (4 + Math.floor(random() * W * 0.15)), y: B - 4 };
  let backAt = { x: random() < 0.5 ? L + 2 : R - 2, y: T + Math.floor(H / 2) };
  /** A castle's wall stair: its foot in the ward against a side range, its head on the wall walk above. */
  let wallAt: { x: number; y: number; lower: { x: number; y: number } } | null = null;

  if (kind === "manor") {
    // The house's shape: a box, an L, a U round a forecourt, an H, or a T with its middle range forward.
    const roll = random();
    if (roll < 0.15) {
      /* a box */
    } else if (roll < 0.35) {
      const w = pct(W, 0.35, 0.45);
      const h = pct(H, 0.4, 0.5);
      put(full, cellsOf({ x: random() < 0.5 ? R - w + 1 : L, y: random() < 0.75 ? T : B - h + 1, w, h }), 0);
    } else if (roll < 0.6) {
      const w = pct(W, 0.34, 0.44);
      const h = pct(H, 0.3, 0.4);
      put(full, cellsOf({ x: cx - Math.floor(w / 2), y: B - h + 1, w, h }), 0);
    } else if (roll < 0.8) {
      const w = pct(W, 0.3, 0.4);
      const h = Math.max(3, pct(H, 0.18, 0.25));
      put(full, cellsOf({ x: cx - Math.floor(w / 2), y: B - h + 1, w, h }), 0);
      put(full, cellsOf({ x: cx - Math.floor(w / 2), y: T, w, h }), 0);
    } else {
      const w = pct(W, 0.25, 0.32);
      const h = pct(H, 0.3, 0.4);
      put(full, cellsOf({ x: L, y: B - h + 1, w, h }), 0);
      put(full, cellsOf({ x: R - w + 1, y: B - h + 1, w, h }), 0);
    }
    // A great house is built round a courtyard: open on the ground floor, a light well through the floors
    // above.
    if (plan.wealth === 3 && random() < 0.7) {
      const w = pct(W, 0.22, 0.28);
      const h = Math.max(5, pct(H, 0.24, 0.3));
      const r = { x: cx - Math.floor(w / 2), y: T + Math.floor((H - h) * 0.4), w, h };
      const cells = cellsOf(r);
      if (cells.every((c) => full[c])) {
        fixed.push({
          kind: "court",
          cells,
          on: (level) => level.depth === 0 && !level.inset,
          claim: (room) => room.use === "open",
          room: { name: SITE_COURT_NAMES.manor, use: "open", size: 3, zone: "public", furniture: [] },
        });
        lightWell = cells;
      }
    }
  } else if (kind === "keep") {
    // The donjon across the back, its own wall between it and the ward; ranges of rooms along the curtain
    // either side and across the front; the ward open in the middle; the gate passage through the front
    // range between two gate towers; a round tower at each corner.
    // The ward is the castle's middle, nearly half of it (gamer panel 2026-11-17): the donjon a third.
    const nb = Math.max(8, Math.round(H * 0.34));
    put(full, cellsOf({ x: L, y: T + nb, w: W, h: 1 }), 0);
    const yb = T + nb + 1;
    const side = W >= 32 ? 5 : 4;
    const front = 4;
    const gw = W >= 34 ? 3 : 2;
    const gx = cx - Math.floor(gw / 2);
    for (let y = T; y <= B; y++)
      for (let x = L; x <= R; x++)
        zone[at(x, y)] = y < T + nb ? 1 : y > B - front ? (x < cx ? 4 : 5) : x < L + side ? 2 : x > R - side ? 3 : 0;
    fixed.push({
      kind: "court",
      cells: cellsOf({ x: L + side, y: yb, w: W - 2 * side, h: B - front - yb + 1 }),
      on: onGround,
      claim: (room) => room.use === "open",
      room: { name: SITE_COURT_NAMES.keep, use: "open", size: 3, zone: "public", furniture: [] },
    });
    const td = 3;
    const gateTowers = [
      { x: gx - 3, y: B + 1, w: 3, h: td },
      { x: gx + gw, y: B + 1, w: 3, h: td },
    ];
    groundOnly = gateTowers.flatMap((r) => cellsOf(r));
    for (const c of groundOnly) zone[c] = c % mapW < cx ? 4 : 5;
    const passage = cellsOf({ x: gx, y: B - front + 1, w: gw, h: front + td });
    groundOnly.push(...cellsOf({ x: gx, y: B + 1, w: gw, h: td }));
    fixed.push({
      kind: "pass",
      cells: passage,
      on: onGround,
      room: { name: "Gate passage", use: "post", size: 1, zone: "public", furniture: [] },
    });
    const s = plan.wealth === 3 ? 5 : 4;
    const [left, right] = [fx, fx + plan.width - 1];
    const towers = [
      { r: { x: left - s + 1, y: T, w: s, h: s }, out: left - s + 1 },
      { r: { x: right, y: T, w: s, h: s }, out: right + s - 1 },
      { r: { x: left - s + 1, y: B - s + 1, w: s, h: s }, out: left - s + 1 },
      { r: { x: right, y: B - s + 1, w: s, h: s }, out: right + s - 1 },
    ];
    // Round on the outer face: the two outer corner cells are wall.
    const towerCells = towers.map(({ r, out }) =>
      cellsOf(r, (x, y) => !(x === out && (y === r.y || y === r.y + s - 1))),
    );
    for (const cells of towerCells) {
      put(full, cells);
      fixed.push({
        kind: "tower",
        cells,
        on: (level) => level.depth >= 0 && !level.inset,
        room: { name: "Corner tower", use: "post", size: 1, zone: "public", furniture: [RACK, CHEST] },
      });
    }
    // The floors above: the donjon, the wall walk along the curtain, the towers; below, the donjon alone.
    upper = new Uint8Array(mapW * mapH);
    below = new Uint8Array(mapW * mapH);
    put(upper, cellsOf({ x: L, y: T, w: W, h: nb }));
    // The dungeons run on under the ward as well, not a strip under the donjon alone.
    put(below, cellsOf({ x: L, y: T, w: W, h: Math.min(H, nb + Math.round(H * 0.3)) }));
    const walk = [
      ...cellsOf({ x: L, y: yb, w: 2, h: B - yb + 1 }),
      ...cellsOf({ x: R - 1, y: yb, w: 2, h: B - yb + 1 }),
      ...cellsOf({ x: L + 2, y: B - 1, w: W - 4, h: 2 }),
    ];
    put(upper, walk);
    for (const cells of towerCells) put(upper, cells);
    fixed.push({
      kind: "walk",
      cells: walk,
      on: (level) => level.depth > 0 && !level.inset,
      room: { name: "Wall walk", use: "post", size: 3, zone: "public", furniture: [] },
    });
    {
      const east = random() < 0.5;
      const y = yb + 1 + Math.floor(random() * Math.max(1, B - front - yb - 2));
      wallAt = { x: east ? R - 1 : L + 1, y, lower: { x: east ? R - side : L + side - 1 + 1, y } };
    }
    inset = { x: L + 3, y: T - 1, w: W - 6, h: nb + 2 };
    mainAt = { x: L + 3 + Math.floor(random() * 4), y: T + nb - 3 };
    backAt = { x: R - 3 - Math.floor(random() * 4), y: T + 2 };
  } else if (kind === "temple") {
    // The nave down the middle with its aisles, the transepts across it near the far end (a cross), the
    // narthex at the door, the apse past the far wall; a cloister on one side against the nave.
    const nw = W >= 26 ? 11 : 9;
    const nx = cx - Math.floor(nw / 2);
    const nh = 3;
    const ta = H >= 22 ? 4 : 3;
    const ty = T + 2 + Math.floor(random() * 2);
    const ext = Math.max(3, Math.min(6, Math.floor((nx - L) * 0.5)));
    for (let y = T; y <= B; y++) for (let x = L; x <= R; x++) zone[at(x, y)] = x < nx ? 1 : x >= nx + nw ? 2 : -2;
    const crossing = [
      ...cellsOf({ x: nx - ext, y: ty, w: ext, h: ta }),
      ...cellsOf({ x: nx + nw, y: ty, w: ext, h: ta }),
    ];
    const naveRect = { x: nx, y: T, w: nw, h: H - nh };
    fixed.push({
      kind: "hall",
      cells: [...cellsOf(naveRect), ...crossing],
      on: onGround,
      claim: (room) => SITE_HALL_ROOMS.has(room.name),
      room: { name: "Nave", use: "holders", size: 3, zone: "public", furniture: [T] },
    });
    fixed.push({
      kind: "hall",
      cells: cellsOf(naveRect),
      on: (level) => level.depth < 0,
      claim: (room) => SITE_HALL_ROOMS.has(room.name),
      room: { name: "Undercroft", use: "squat", size: 3, zone: "public", furniture: [CHEST] },
    });
    fixed.push({
      kind: "entry",
      cells: cellsOf({ x: nx, y: B - nh + 1, w: nw, h: nh }),
      on: onGround,
      claim: (room) => SITE_ENTRY_ROOMS.has(room.name),
      room: { name: "Narthex", use: "post", size: 2, zone: "public", furniture: [T] },
    });
    const aw = nw >= 11 ? 7 : 5;
    const apse = cellsOf(
      { x: cx - Math.floor(aw / 2), y: T - 4, w: aw, h: 3 },
      (x, y) => y > T - 4 || Math.abs(x - cx) <= Math.floor(aw / 2) - 1,
    );
    groundOnly = apse;
    fixed.push({
      kind: "apse",
      cells: apse,
      on: onGround,
      claim: (room) => room.name === "Sanctuary",
      room: { name: "Apse", use: "quiet", size: 1, zone: "private", furniture: [ALTAR] },
      arch: true,
    });
    const left = random() < 0.5;
    const room = left ? nx - L : R - (nx + nw - 1);
    const gs = Math.min(7, room - 8, H - ta - 9);
    if (gs >= 5) {
      const span = gs + 2;
      const wx = left ? nx - 1 - span : nx + nw + 1;
      const lo = ty + ta + 1;
      const wy = lo + Math.floor(random() * Math.max(1, B - span + 1 - lo + 1));
      const ring = cellsOf(
        { x: wx, y: wy, w: span, h: span },
        (x, y) => x === wx || y === wy || x === wx + span - 1 || y === wy + span - 1,
      );
      fixed.push({
        kind: "walk",
        cells: ring,
        on: onGround,
        room: { name: "Cloister walk", use: "quiet", size: 2, zone: "service", furniture: [] },
      });
      fixed.push({
        kind: "court",
        cells: cellsOf({ x: wx + 1, y: wy + 1, w: gs, h: gs }),
        on: onGround,
        claim: (each) => each.use === "open",
        room: { name: SITE_COURT_NAMES.temple, use: "open", size: 3, zone: "service", furniture: [] },
      });
      // Nothing grows in the cell between the walk and the nave: it is the nave's wall.
      for (let y = wy; y < wy + span; y++) zone[at(left ? nx - 1 : nx + nw, y)] = -2;
    }
    const other = left ? nx + nw + 2 : L + 1;
    mainAt = { x: left ? R - 2 : L + 2, y: B - 3 };
    backAt = { x: left ? nx - 3 : nx + nw + 2, y: ty + ta + 1 };
    void other;
    inset = { x: Math.max(L - 1, nx - 5), y: B - 7, w: Math.min(R + 2, nx + nw + 5) - Math.max(L - 1, nx - 5), h: 9 };
  } else {
    // A crypt: the vestibule at the door; galleries and chambers cut in the rock behind it.
    const vw = W >= 30 ? 7 : 5;
    fixed.push({
      kind: "entry",
      cells: cellsOf({ x: cx - Math.floor(vw / 2), y: B - 2, w: vw, h: 3 }),
      on: onGround,
      claim: (room) => SITE_ENTRY_ROOMS.has(room.name),
      room: { name: "Vestibule", use: "post", size: 2, zone: "public", furniture: [2] },
    });
    mainAt = { x: L + 2 + Math.floor(random() * (W - 4)), y: T + 2 + Math.floor(random() * Math.max(1, H / 2)) };
    backAt = { x: 2 * cx - mainAt.x, y: T + 2 };
  }

  const groundMask = full.slice();
  put(groundMask, groundOnly);
  // A house's floors above stand round its courtyard's light well.
  if (kind === "manor" && lightWell.length) {
    upper = full.slice();
    put(upper, lightWell, 0);
  }
  const insetMask = new Uint8Array(mapW * mapH);
  put(
    insetMask,
    cellsOf({ x: inset.x + 1, y: inset.y + 1, w: inset.w - 2, h: inset.h - 2 }, (x, y) =>
      kind === "keep" || upper ? !!upper![at(x, y)] : !!full[at(x, y)],
    ),
  );
  const maskOf = (level: SitePlanLevel) =>
    level.inset
      ? insetMask
      : (kind === "keep" || kind === "manor") && level.depth > 0 && upper
        ? upper
        : kind === "keep" && level.depth < 0
          ? below!
          : level.depth === 0
            ? groundMask
            : full;

  // The stairwells: each link in a small room of its own, standing at the same cells on both levels it
  // joins; the main stairs alternate between two stairwells far apart, so a floor is crossed from the stair
  // up to the stair down; the back stairs in one well of their own.
  const taken = new Uint8Array(mapW * mapH);
  for (const each of fixed) for (const c of each.cells) for (const d of [0, -1, 1, -mapW, mapW]) taken[c + d] = 1;
  const wells: Array<{ r: SiteRect; levels: Set<number>; name: string }> = [];
  const linkAt: Array<{ x: number; y: number; lower?: { x: number; y: number } }> = [];
  const pick = (
    w: number,
    h: number,
    levels: number[],
    want: { x: number; y: number },
    loose = false,
  ): SiteRect | undefined => {
    const masks = levels.map((n) => maskOf(plan.levels[n]!));
    let best: SiteRect | undefined;
    let score = Infinity;
    for (let y = 2; y + h < mapH - 2; y++)
      for (let x = 2; x + w < mapW - 2; x++) {
        let ok = true;
        for (let yy = y - 1; yy <= y + h && ok; yy++)
          for (let xx = x - 1; xx <= x + w && ok; xx++) {
            const c = at(xx, yy);
            const edge = yy === y - 1 || xx === x - 1 || yy === y + h || xx === x + w;
            if (!edge && masks.some((m) => !m[c])) ok = false;
            if (!edge && taken[c] && !loose) ok = false;
            if (wells.some(({ r }) => xx >= r.x - 1 && xx < r.x + r.w + 1 && yy >= r.y - 1 && yy < r.y + r.h + 1))
              ok = false;
          }
        if (!ok) continue;
        const s = Math.abs(x + w / 2 - want.x) + Math.abs(y + h / 2 - want.y) + random() * 3;
        if (s < score) [score, best] = [s, { x, y, w, h }];
      }
    return best;
  };
  const names = SITE_STAIR_NAMES[kind];
  const groups = new Map<
    string,
    { links: number[]; w: number; h: number; want: { x: number; y: number }; name: string }
  >();
  for (const [k, link] of plan.links.entries()) {
    if (link.kind === "wall") continue;
    const ladder = !!plan.levels[link.upper]!.inset || !!plan.levels[link.lower]!.inset;
    const key = ladder
      ? `ladder${k}`
      : link.kind === "servants"
        ? "back"
        : link.kind === "stairs"
          ? `main${link.upper % 2}`
          : `${link.kind}${k}`;
    const flip = link.upper % 2 === 1;
    const want = ladder
      ? { x: inset.x + inset.w / 2, y: inset.y + inset.h / 2 }
      : link.kind === "servants"
        ? backAt
        : link.kind === "stairs"
          ? flip
            ? mainAt
            : { x: 2 * cx - mainAt.x, y: T + B - mainAt.y }
          : { x: L + 2 + random() * (W - 4), y: T + 2 + random() * (H - 4) };
    const [w, h] =
      ladder || link.kind === "hidden" || link.kind === "hole"
        ? [2, 2]
        : link.kind === "servants"
          ? [2, 3]
          : kind === "crypt"
            ? [3, 3]
            : [plan.wealth === 3 ? 4 : 3, 3];
    const name = ladder
      ? names.ladder
      : link.kind === "servants"
        ? names.back
        : link.kind === "stairs"
          ? names.main
          : link.kind === "hidden"
            ? "Hidden stair"
            : "Broken floor";
    const group = groups.get(key) ?? { links: [], w, h, want, name };
    group.links.push(k);
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    const levels = [...new Set(group.links.flatMap((k) => [plan.links[k]!.upper, plan.links[k]!.lower]))];
    const r = pick(group.w, group.h, levels, group.want) ??
      pick(2, 2, levels, group.want) ??
      pick(1, 1, levels, group.want, true) ?? { x: cx, y: B - 2, w: 1, h: 1 };
    wells.push({ r, levels: new Set(levels), name: group.name });
    for (const k of group.links) {
      // Each stair at the back of its well, the up and the down of one well apart.
      const link = plan.links[k]!;
      const x =
        group.links.length > 1 && r.w > 1 ? r.x + (link.upper % 2 === 0 ? 0 : r.w - 1) : r.x + Math.floor(r.w / 2);
      linkAt[k] = { x, y: r.y };
    }
    const cells = cellsOf(r);
    fixed.push({
      kind: "stair",
      cells,
      on: (_, index) => levels.includes(index),
      room: { name: group.name, use: "post", size: 1, zone: "public", furniture: [] },
    });
  }
  for (const [k, link] of plan.links.entries()) if (link.kind === "wall") linkAt[k] = wallAt ?? { x: cx, y: T + 1 };
  // The front door: in the middle of the front, through the whole outer wall.
  let iy = B;
  for (iy = mapH - 3; iy > 0 && !groundMask[at(cx, iy)]; iy--);
  return {
    mapW,
    mapH,
    thick,
    cx,
    L,
    R,
    T,
    B,
    zone,
    fixed,
    maskOf,
    linkAt,
    door: { x: cx, y: iy + thick, ix: cx, iy },
  };
}

/**
 * A level of a site as a map, made anew from its seed: the building's outline and shared spaces from its
 * frame; corridors where the plan wants them; every planned room grown from a seed placed by how far it
 * should be from the way in (public near, private far, the heart deep); the spaces joined as a tree of
 * doors from the way in with loops besides, a hidden room behind a hidden door; then links, locks,
 * furniture, and traps only when the game's rules can find them.
 */
export function siteLevelMap(plan: SitePlan, index: number, options: { traps?: boolean } = {}): SiteLevelMap {
  const level = plan.levels[index]!;
  const random = marinaraRandom(`site-level2:${plan.template}:${plan.seed}:${level.id}`);
  const frame = siteFrame(plan);
  const { mapW, mapH } = frame;
  const kind = plan.template;
  const thick = level.inset ? 1 : frame.thick;
  const entry = index === plan.entry;
  const mask = frame.maskOf(level);
  const size = mapW * mapH;
  const cell = (x: number, y: number) => y * mapW + x;
  const inside = (r: SiteRect, x: number, y: number) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  const around = (c: number) => {
    const x = c % mapW;
    const out: number[] = [];
    if (x > 0) out.push(c - 1);
    if (x < mapW - 1) out.push(c + 1);
    if (c >= mapW) out.push(c - mapW);
    if (c + mapW < size) out.push(c + mapW);
    return out;
  };
  const shuffle = <T>(list: T[]) => {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j]!, list[i]!];
    }
    return list;
  };
  const links: SiteLevelLink[] = [];
  for (const [k, link] of plan.links.entries()) {
    if (link.upper !== index && link.lower !== index) continue;
    const at = link.lower === index ? (frame.linkAt[k]!.lower ?? frame.linkAt[k]!) : frame.linkAt[k]!;
    links.push({ x: at.x, y: at.y, level: link.upper === index ? link.lower : link.upper, kind: link.kind });
  }
  /** Cells that stay floor whatever stands next to them: the links, the cell inside the front door. */
  const hold = new Uint8Array(size);
  for (const link of links) hold[cell(link.x, link.y)] = 9;
  const doorIn = entry ? cell(frame.door.ix, frame.door.iy) : -1;
  if (doorIn >= 0) hold[doorIn] = 9;

  // ── The spaces laid down first ──
  interface Region {
    kind: SiteKind;
    room?: SitePlanRoom;
    arch?: true;
    hidden?: true;
    target: number;
    zone: number;
  }
  const regions: Region[] = [];
  const at = new Int32Array(size).fill(-1);
  let planned = [...level.rooms];
  const claim = (pick: (room: SitePlanRoom) => boolean) => {
    const room = planned.find(pick);
    if (room) planned = planned.filter((each) => each !== room);
    return room;
  };
  for (const each of frame.fixed) {
    if (!each.on(level, index)) continue;
    const cells = each.cells.filter((c) => mask[c]);
    if (!cells.length) continue;
    const id = regions.length;
    regions.push({
      kind: each.kind,
      room: (each.claim && claim(each.claim)) || each.room,
      ...(each.arch ? { arch: true as const } : {}),
      target: cells.length,
      zone: -1,
    });
    for (const c of cells) at[c] = id;
  }
  const zoneOf = (c: number) => (level.inset ? 0 : frame.zone[c]!);
  const free = (c: number) => mask[c] === 1 && at[c] === -1 && zoneOf(c) !== -2;

  // ── Corridors: wandering, from stairwell to stairwell or on to the far wing; a crypt's galleries ──
  const noise = new Uint8Array(size);
  {
    const blocks = new Map<number, number>();
    for (let c = 0; c < size; c++) {
      const key = Math.floor((c % mapW) / 4) * 100 + Math.floor(Math.floor(c / mapW) / 4);
      if (!blocks.has(key)) blocks.set(key, Math.floor(random() * 4));
      noise[c] = blocks.get(key)!;
    }
  }
  const route = (sources: number[], goal: (c: number) => boolean): number[] | null => {
    const dist = new Float64Array(size * 4).fill(Infinity);
    const prev = new Int32Array(size * 4).fill(-1);
    const heap: Array<[number, number]> = [];
    const push = (d: number, s: number) => {
      heap.push([d, s]);
      for (let i = heap.length - 1; i > 0;) {
        const p = (i - 1) >> 1;
        if (heap[p]![0] <= heap[i]![0]) break;
        [heap[p], heap[i]] = [heap[i]!, heap[p]!];
        i = p;
      }
    };
    const pop = () => {
      const top = heap[0]!;
      const last = heap.pop()!;
      if (heap.length) {
        heap[0] = last;
        for (let i = 0; ;) {
          const [l, r] = [2 * i + 1, 2 * i + 2];
          let m = i;
          if (l < heap.length && heap[l]![0] < heap[m]![0]) m = l;
          if (r < heap.length && heap[r]![0] < heap[m]![0]) m = r;
          if (m === i) break;
          [heap[m], heap[i]] = [heap[i]!, heap[m]!];
          i = m;
        }
      }
      return top;
    };
    for (const c of sources)
      for (let d = 0; d < 4; d++) {
        dist[c * 4 + d] = 0;
        push(0, c * 4 + d);
      }
    const steps = [1, -1, mapW, -mapW];
    while (heap.length) {
      const [d, s] = pop();
      if (d > dist[s]!) continue;
      const c = s >> 2;
      if (goal(c)) {
        const out: number[] = [];
        for (let k = s; k >= 0; k = prev[k]!) out.push(k >> 2);
        return out;
      }
      for (let nd = 0; nd < 4; nd++) {
        const n = c + steps[nd]!;
        if (n < 0 || n >= size || (nd === 0 && c % mapW === mapW - 1) || (nd === 1 && c % mapW === 0)) continue;
        if (!free(n) || hold[n]) continue;
        const cost = d + 2 + noise[n]! + (nd !== (s & 3) ? 3 : 0);
        const ns = n * 4 + nd;
        if (cost < dist[ns]!) {
          dist[ns] = cost;
          prev[ns] = s;
          push(cost, ns);
        }
      }
    }
    return null;
  };
  const touching = (id: number) => {
    const out = new Set<number>();
    for (let c = 0; c < size; c++) if (at[c] === id) for (const n of around(c)) if (free(n) && !hold[n]) out.add(n);
    return out;
  };
  const stairsHere = regions.map((r, n) => (r.kind === "stair" ? n : -1)).filter((n) => n >= 0);
  const entryRegion = regions.findIndex((r) => r.kind === "entry");
  let corridor = -1;
  const lay = (cells: number[]) => {
    if (corridor < 0) {
      corridor = regions.length;
      regions.push({ kind: "pass", target: 0, zone: -1 });
    }
    for (const c of cells) at[c] = corridor;
  };
  if (
    kind === "manor" &&
    !level.inset &&
    stairsHere.length &&
    random() < (level.depth > 0 ? 0.75 : level.depth === 0 ? 0.5 : 0.55)
  ) {
    const [first, ...rest] = shuffle([...stairsHere]);
    const from = [...touching(first!)];
    if (rest.length)
      for (const other of rest) {
        const goal = touching(other);
        const way = route(corridor >= 0 ? [...touching(corridor), ...from] : from, (c) => goal.has(c));
        if (way) lay(way);
      }
    else {
      // On to the far wing.
      const reach = new Int32Array(size).fill(-1);
      const queue = from.filter((c) => free(c));
      for (const c of queue) reach[c] = 0;
      for (let head = 0; head < queue.length; head++)
        for (const n of around(queue[head]!))
          if (reach[n]! < 0 && free(n)) {
            reach[n] = reach[queue[head]!]! + 1;
            queue.push(n);
          }
      const far = Math.max(0, ...reach);
      const way = far >= 8 ? route(from, (c) => reach[c]! >= far * 0.7) : null;
      if (way) lay(way.slice(0, Math.max(4, Math.round(way.length * 0.85))));
    }
  }
  if ((kind === "crypt" || kind === "keep") && level.depth < 0) {
    // Galleries: from the way in to every stair and on to a few points cut further into the rock.
    const ends = [entryRegion, ...stairsHere].filter((n) => n >= 0);
    const points: number[] = [];
    const want = 2 + plan.wealth;
    for (let tries = 0; tries < 200 && points.length < want; tries++) {
      const c = Math.floor(random() * size);
      if (
        !free(c) ||
        points.some(
          (p) => Math.abs((p % mapW) - (c % mapW)) + Math.abs(Math.floor(p / mapW) - Math.floor(c / mapW)) < 7,
        )
      )
        continue;
      points.push(c);
    }
    const start = ends[0];
    if (start !== undefined) {
      let sources = [...touching(start)];
      for (const other of ends.slice(1)) {
        const goal = touching(other);
        const way = route(sources, (c) => goal.has(c));
        if (way) {
          lay(way);
          sources = [...touching(corridor), ...sources];
        }
      }
      for (const p of points) {
        if (!free(p)) continue;
        const way = route(corridor >= 0 ? [...touching(corridor)] : sources, (c) => c === p);
        if (way) lay(way);
      }
    }
  }

  // ── The rooms, grown ──
  const arrival = entry
    ? doorIn
    : (() => {
        const toward =
          links.find((link) => Math.abs(link.level - plan.entry) < Math.abs(index - plan.entry)) ?? links[0];
        return toward ? cell(toward.x, toward.y) : -1;
      })();
  const dist = new Int32Array(size).fill(-1);
  {
    const queue = arrival >= 0 ? [arrival] : [];
    if (arrival >= 0) dist[arrival] = 0;
    for (let head = 0; head < queue.length; head++)
      for (const n of around(queue[head]!))
        if (dist[n]! < 0 && mask[n]) {
          dist[n] = dist[queue[head]!]! + 1;
          queue.push(n);
        }
  }
  const maxDist = Math.max(1, ...dist);
  let freeCount = 0;
  for (let c = 0; c < size; c++) if (free(c)) freeCount++;
  const pool =
    SITE_SPARE_ROOMS[kind][level.inset ? "top" : level.depth > 0 ? "up" : level.depth < 0 ? "below" : "ground"];
  const used = new Map<string, number>();
  const spare = (cells: number): SitePlanRoom => {
    const fresh = pool.filter(([name]) => !used.has(name));
    const many = pool.filter(([name]) => SITE_MANY.has(name));
    const choices = fresh.length ? fresh : many.length ? many : pool;
    const [name, roomSize, furniture] = choices.reduce((best, each) =>
      Math.abs(Math.log(cells / SITE_WANT[each[1]])) < Math.abs(Math.log(cells / SITE_WANT[best[1]])) ? each : best,
    );
    const times = (used.get(name) ?? 0) + 1;
    used.set(name, times);
    return { name: times > 1 ? `${name} ${times}` : name, use: "squat", size: roomSize, zone: "service", furniture };
  };
  // Cut in rock: a crypt's vaults and a castle's dungeons. A crypt's chapel at the surface is built, its
  // rooms filling it as in any building, never a void left inside its walls (panel 2026-11-17).
  const rock = (kind === "crypt" || kind === "keep") && level.depth < 0;
  // One space on a floor is the set piece, two or three times any other (gamer panel 2026-11-17).
  const weight = (r: SitePlanRoom) => SITE_WANT[r.size] * (r.heart || SITE_SET_PIECES.has(r.name) ? 2.2 : 1);
  const sum = planned.reduce((n, room) => n + weight(room), 0) || 1;
  const room = rock ? freeCount * 0.5 : freeCount;
  const scale = Math.max(0.6, Math.min(1.35, room / (sum * (rock ? 1 : 1.15))));
  const growers: number[] = [];
  const add = (r: SitePlanRoom, target: number, hidden = false) => {
    growers.push(regions.length);
    regions.push({ kind: "room", room: r, target, zone: -1, ...(hidden ? { hidden: true as const } : {}) });
  };
  for (const r of planned) add(r, Math.round(weight(r) * scale));
  planned = [];
  // The hidden room: small, deep, against an outer wall, behind a hidden door, with something worth it.
  // Never in a crypt: its walls are a tile pack's, with no hidden door drawn in them.
  if (!rock && kind !== "crypt" && !level.inset && level.rooms.length >= 3 && random() < 0.65)
    add(
      { name: SITE_HIDDEN_ROOM[kind], use: "store", size: 1, zone: "deep", furniture: [CHEST, CHEST, STATUE] },
      9,
      true,
    );
  let left = room - growers.reduce((n, g) => n + regions[g]!.target, 0);
  for (let k = 0; left > (rock ? 22 : 30) && growers.length < 30 && k < 20; k++) {
    // Made-up rooms only while there are names not used yet: past that the planned rooms grow instead.
    if (!pool.some(([name]) => !used.has(name))) break;
    const want = left > 60 && random() < 0.4 ? 3 : left > 34 && random() < 0.6 ? 2 : 1;
    const r = spare(SITE_WANT[want]);
    const target = Math.round(SITE_WANT[r.size] * scale);
    add(r, target);
    left -= target;
  }
  // Seeds: the way in's room at the door, then the heart, then the biggest first, each where its zone
  // says, apart from the others, near the rooms it belongs beside.
  const zoneAt = { public: 0.12, service: 0.45, guest: 0.55, private: 0.8, deep: 0.95 } as const;
  const isMate = (p: SitePlanRoom, q: SitePlanRoom) =>
    (SITE_NEXT_TO[siteBaseName(p.name)] ?? []).includes(siteBaseName(q.name)) ||
    (SITE_NEXT_TO[siteBaseName(q.name)] ?? []).includes(siteBaseName(p.name));
  const order = [...growers].sort((p, q) => {
    const rank = (g: number) => {
      const r = regions[g]!.room!;
      return entry && SITE_ENTRY_ROOMS.has(r.name) ? 0 : r.heart ? 1 : regions[g]!.hidden ? 3 : 2;
    };
    return rank(p) - rank(q) || regions[q]!.target - regions[p]!.target;
  });
  const seeds: Array<{ g: number; c: number }> = [];
  const keepGround = kind === "keep" && level.depth === 0 && !level.inset;
  // What the seeds weigh, worked out once: where the passages and the outside are.
  const byPass = new Uint8Array(size);
  const byOutside = new Uint8Array(size);
  for (let c = 0; c < size; c++) {
    if (!mask[c]) continue;
    for (const n of around(c)) {
      if (at[n]! >= 0 && regions[at[n]!]!.kind !== "room") byPass[c] = 1;
      if (!mask[n]) byOutside[c] = 1;
    }
  }
  const nearEdge = new Uint8Array(size);
  for (let c = 0; c < size; c++) if (byOutside[c]) for (const n of around(c)) nearEdge[n] = 1;
  for (const g of order) {
    const region = regions[g]!;
    const r = region.room!;
    const z = r.heart ? 1 : region.hidden ? 0.9 : zoneAt[r.zone];
    let best = -1;
    let score = Infinity;
    // How much is free in any box: sums from the top left, so a window is four lookups.
    const sums = new Int32Array((mapW + 1) * (mapH + 1));
    for (let y = 0; y < mapH; y++)
      for (let x = 0; x < mapW; x++)
        sums[(y + 1) * (mapW + 1) + x + 1] =
          (free(cell(x, y)) ? 1 : 0) +
          sums[y * (mapW + 1) + x + 1]! +
          sums[(y + 1) * (mapW + 1) + x]! -
          sums[y * (mapW + 1) + x]!;
    const freeIn = (x0: number, y0: number, x1: number, y1: number) =>
      sums[(y1 + 1) * (mapW + 1) + x1 + 1]! -
      sums[y0 * (mapW + 1) + x1 + 1]! -
      sums[(y1 + 1) * (mapW + 1) + x0]! +
      sums[y0 * (mapW + 1) + x0]!;
    const others = seeds.map((seed) => ({
      x: seed.c % mapW,
      y: Math.floor(seed.c / mapW),
      rr: (Math.sqrt(region.target) + Math.sqrt(regions[seed.g]!.target)) * 0.75,
      mate: isMate(r, regions[seed.g]!.room!),
    }));
    const hall = keepGround && (SITE_HALL_ROOMS.has(r.name) || r.name === "Chapel");
    // The set piece's seed where it has room all round to grow to its own shape, not in a band between passages.
    const big = r.heart || SITE_SET_PIECES.has(r.name);
    const reach = Math.max(1, Math.floor(Math.sqrt(region.target) / 2));
    if (entry && SITE_ENTRY_ROOMS.has(r.name) && free(doorIn)) best = doorIn;
    else
      for (let c = 0; c < size; c++) {
        if (!free(c) || hold[c]) continue;
        const x = c % mapW;
        const y = (c - x) / mapW;
        let s = 3 * Math.abs(Math.max(0, dist[c]!) / maxDist - z);
        for (const o of others) {
          const d = Math.abs(o.x - x) + Math.abs(o.y - y);
          if (d < o.rr) s += 8 * (1 - d / o.rr);
          if (o.mate) s += d * 0.05;
        }
        if (keepGround) {
          if (hall && zoneOf(c) !== 1) s += 20;
          if (!hall && !r.heart && zoneOf(c) === 1) s += 1.5;
          if (r.name === "Gatehouse" && !byPass[c]) s += 6;
        }
        if (rock && !byPass[c]) s += 30;
        if (region.hidden && !nearEdge[c]) s += 2;
        if (byOutside[c] && !region.hidden) s += 0.3;
        // Room to grow: a big room's seed where there is space round it.
        const [x0, y0, x1, y1] = [
          Math.max(0, x - reach),
          Math.max(0, y - reach),
          Math.min(mapW - 1, x + reach),
          Math.min(mapH - 1, y + reach),
        ];
        s += (big ? 10 : 2) * (1 - freeIn(x0, y0, x1, y1) / ((x1 - x0 + 1) * (y1 - y0 + 1)));
        s += random() * 0.5;
        if (s < score) [score, best] = [s, c];
      }
    if (best < 0) continue;
    at[best] = g;
    region.zone = zoneOf(best);
    seeds.push({ g, c: best });
  }
  // Growth: first each room as a box, the hungriest first, toward its own shape; then out along any side
  // in runs (an L, a T), to about half again its size; then (in a building, not in rock) whatever is left
  // to whoever borders it.
  const grown = new Set(seeds.map((seed) => seed.g));
  const longest = (g: number) => {
    const r = regions[g]!.room!;
    if (r.name === "Long gallery") return 5;
    return r.heart || SITE_SET_PIECES.has(r.name) ? 2 : 3;
  };
  const box = new Map<number, { x0: number; y0: number; x1: number; y1: number }>();
  const area = new Map<number, number>();
  const ratio = new Map<number, number>();
  for (const { g, c } of seeds) {
    const [x, y] = [c % mapW, Math.floor(c / mapW)];
    box.set(g, { x0: x, y0: y, x1: x, y1: y });
    area.set(g, 1);
    const a = 1 + random() * 0.8;
    ratio.set(g, random() < 0.5 ? a : 1 / a);
  }
  const takes = (g: number, c: number) => free(c) && zoneOf(c) === regions[g]!.zone;
  {
    const done = new Set<number>();
    for (let guard = 0; guard < 20000; guard++) {
      const active = [...grown].filter((g) => !done.has(g) && area.get(g)! < regions[g]!.target);
      if (!active.length) break;
      const g = active.reduce((p, q) =>
        area.get(q)! / regions[q]!.target + random() * 0.05 < area.get(p)! / regions[p]!.target ? q : p,
      );
      const b = box.get(g)!;
      const [w, h] = [b.x1 - b.x0 + 1, b.y1 - b.y0 + 1];
      const wide = w / h < ratio.get(g)!;
      const across = shuffle(["E", "W"] as const);
      const down = shuffle(["N", "S"] as const);
      const dirs = wide ? [...across, ...down] : [...down, ...across];
      let grew = false;
      for (const dir of dirs) {
        const strip: number[] =
          dir === "E" || dir === "W"
            ? Array.from({ length: h }, (_, k) => cell(dir === "E" ? b.x1 + 1 : b.x0 - 1, b.y0 + k))
            : Array.from({ length: w }, (_, k) => cell(b.x0 + k, dir === "S" ? b.y1 + 1 : b.y0 - 1));
        const [nw, nh] = dir === "E" || dir === "W" ? [w + 1, h] : [w, h + 1];
        if (Math.max(nw, nh) / Math.min(nw, nh) > Math.min(rock ? 2.5 : 3, longest(g))) continue;
        if (!strip.every((c) => c >= 0 && c < size && takes(g, c))) continue;
        for (const c of strip) at[c] = g;
        if (dir === "E") b.x1++;
        else if (dir === "W") b.x0--;
        else if (dir === "S") b.y1++;
        else b.y0--;
        area.set(g, area.get(g)! + strip.length);
        grew = true;
        break;
      }
      if (!grew) done.add(g);
    }
  }
  const spread = (cap: (g: number) => number, least: number) => {
    for (let changed = true; changed;) {
      changed = false;
      for (const g of [...grown].sort(
        (p, q) => area.get(p)! / regions[p]!.target - area.get(q)! / regions[q]!.target,
      )) {
        if (area.get(g)! >= cap(g)) continue;
        const b = box.get(g)!;
        let best: number[] = [];
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          // The free cells just past the room on this side, in runs along it.
          const lines = new Map<number, number[]>();
          for (let y = b.y0 - 1; y <= b.y1 + 1; y++)
            for (let x = b.x0 - 1; x <= b.x1 + 1; x++) {
              if (
                x - dx < 0 ||
                y - dy < 0 ||
                x - dx >= mapW ||
                y - dy >= mapH ||
                x < 0 ||
                y < 0 ||
                x >= mapW ||
                y >= mapH
              )
                continue;
              const c = cell(x, y);
              if (!takes(g, c) || at[cell(x - dx, y - dy)] !== g) continue;
              const line = dx ? x : y;
              lines.set(line, [...(lines.get(line) ?? []), dx ? y : x]);
            }
          for (const [line, list] of lines) {
            list.sort((p, q) => p - q);
            let run: number[] = [];
            const flush = () => {
              if (run.length >= least && run.length > best.length) {
                // Never so long and thin a hall reads as a corridor (history panel 2026-11-17).
                const [x0, x1] = dx
                  ? [Math.min(b.x0, line), Math.max(b.x1, line)]
                  : [Math.min(b.x0, run[0]!), Math.max(b.x1, run[run.length - 1]!)];
                const [y0, y1] = dx
                  ? [Math.min(b.y0, run[0]!), Math.max(b.y1, run[run.length - 1]!)]
                  : [Math.min(b.y0, line), Math.max(b.y1, line)];
                const [w, h] = [x1 - x0 + 1, y1 - y0 + 1];
                if (Math.max(w, h) / Math.min(w, h) <= longest(g))
                  best = run.map((k) => (dx ? cell(line, k) : cell(k, line)));
              }
              run = [];
            };
            for (const k of list) {
              if (run.length && k !== run[run.length - 1]! + 1) flush();
              run.push(k);
            }
            flush();
          }
        }
        if (!best.length) continue;
        for (const c of best) {
          at[c] = g;
          const [x, y] = [c % mapW, Math.floor(c / mapW)];
          b.x0 = Math.min(b.x0, x);
          b.x1 = Math.max(b.x1, x);
          b.y0 = Math.min(b.y0, y);
          b.y1 = Math.max(b.y1, y);
        }
        area.set(g, area.get(g)! + best.length);
        changed = true;
      }
    }
  };
  // A room squeezed to a sliver (two wide) or a scrap is no room: its space goes to its neighbours, and a
  // planned room so lost takes a made-up room's space further on (gamer panel 2026-11-17).
  const core = new Map(
    [...grown].map((g) => [g, Math.min(box.get(g)!.x1 - box.get(g)!.x0, box.get(g)!.y1 - box.get(g)!.y0) + 1]),
  );
  spread((g) => regions[g]!.target * (rock ? 1.15 : 1.45), rock ? 2 : 3);
  if (!rock)
    for (const g of [...grown]) {
      const region = regions[g]!;
      if (region.hidden || region.room!.heart || (entry && SITE_ENTRY_ROOMS.has(region.room!.name))) continue;
      if (core.get(g)! >= 4 && area.get(g)! >= 12) continue;
      for (let c = 0; c < size; c++) if (at[c] === g) at[c] = -1;
      grown.delete(g);
    }
  if (!rock) {
    // The hidden room stays small: it never takes what the others leave.
    spread((g) => (regions[g]!.hidden ? regions[g]!.target : Infinity), 3);
    // What no room reached: a room of its own when there is space for one, else to its neighbour.
    const seen = new Uint8Array(size);
    for (let c = 0; c < size; c++) {
      if (seen[c] || !free(c)) continue;
      const comp = [c];
      seen[c] = 1;
      for (let head = 0; head < comp.length; head++)
        for (const n of around(comp[head]!))
          if (!seen[n] && free(n)) {
            seen[n] = 1;
            comp.push(n);
          }
      const set = new Set(comp);
      const block = comp.some((p) => [0, 1, 2].every((dy) => [0, 1, 2].every((dx) => set.has(p + dx + dy * mapW))));
      if (comp.length >= 12 && block && growers.length < 34 && pool.some(([name]) => !used.has(name))) {
        const g = regions.length;
        regions.push({ kind: "room", room: spare(comp.length), target: comp.length, zone: zoneOf(c) });
        growers.push(g);
        grown.add(g);
        for (const p of comp) at[p] = g;
        continue;
      }
      // A strip too thin for a room, along a corridor, widens the corridor rather than giving some room a
      // tail (gamer panel 2026-11-17).
      if (!block) {
        const pass = comp
          .flatMap((p) => around(p))
          .map((n) => at[n]!)
          .find((n) => n >= 0 && regions[n]!.kind === "pass");
        if (pass !== undefined) for (const p of comp) at[p] = pass;
      }
    }
    for (let changed = true; changed;) {
      changed = false;
      for (let c = 0; c < size; c++) {
        if (!free(c)) continue;
        const counts = new Map<number, number>();
        for (const n of around(c))
          if (at[n]! >= 0 && regions[at[n]!]!.kind === "room" && !regions[at[n]!]!.hidden)
            counts.set(at[n]!, (counts.get(at[n]!) ?? 0) + 1);
        const best = [...counts.entries()].sort((p, q) => q[1] - p[1])[0];
        if (best) {
          at[c] = best[0];
          changed = true;
        }
      }
    }
  }

  // ── Walls: between two spaces the weaker gives up its cell; then nubs and stray bits are walled ──
  const ground: DungeonGround[] = Array.from({ length: size }, () => "rock" as DungeonGround);
  const props: number[] = ground.map(() => -1);
  for (let c = 0; c < size; c++) {
    if (!mask[c]) continue;
    const [x, y] = [c % mapW, Math.floor(c / mapW)];
    for (let dy = -thick; dy <= thick; dy++)
      for (let dx = -thick; dx <= thick; dx++) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && ny >= 0 && nx < mapW && ny < mapH) ground[cell(nx, ny)] = "wall";
      }
  }
  for (let c = 0; c < size; c++) if (at[c]! >= 0) ground[c] = "floor";
  const holdOf = (c: number) => hold[c] || SITE_HOLD[regions[at[c]!]!.kind];
  const lost: number[] = [];
  for (let c = 0; c < size; c++) {
    if (at[c]! < 0) continue;
    for (const n of [c % mapW < mapW - 1 ? c + 1 : -1, c + mapW < size ? c + mapW : -1]) {
      if (n < 0 || at[n]! < 0 || at[n] === at[c]) continue;
      const [hc, hn] = [holdOf(c), holdOf(n)];
      const loser = hc < hn ? c : hn < hc ? n : c;
      ground[loser] = "wall";
      lost.push(loser);
    }
  }
  for (const c of lost) if (!hold[c]) at[c] = -1;
  const isRoom = (c: number) => at[c]! >= 0 && regions[at[c]!]!.kind === "room";
  for (let changed = true; changed;) {
    changed = false;
    for (let c = 0; c < size; c++) {
      if (!isRoom(c) || hold[c] || ground[c] !== "floor") continue;
      const same = around(c).filter((n) => at[n] === at[c] && ground[n] === "floor").length;
      if (same <= 1) {
        ground[c] = "wall";
        at[c] = -1;
        changed = true;
      }
    }
  }
  // Each space keeps its largest piece.
  const cellsBy = new Map<number, number[]>();
  for (let c = 0; c < size; c++)
    if (at[c]! >= 0) {
      const list = cellsBy.get(at[c]!);
      if (list) list.push(c);
      else cellsBy.set(at[c]!, [c]);
    }
  for (const [g, cells] of cellsBy) {
    const set = new Set(cells);
    const seen = new Set<number>();
    let biggest: number[] = [];
    for (const c of cells) {
      if (seen.has(c)) continue;
      const comp = [c];
      seen.add(c);
      for (let head = 0; head < comp.length; head++)
        for (const n of around(comp[head]!))
          if (set.has(n) && !seen.has(n)) {
            seen.add(n);
            comp.push(n);
          }
      if (comp.length > biggest.length) biggest = comp;
    }
    const keep = new Set(biggest);
    const small = regions[g]!.kind === "room" && keep.size < 4;
    // A corridor's pieces that meet only through rooms are corridors of their own.
    if (regions[g]!.kind === "pass") {
      const pieces: number[][] = [];
      const seen2 = new Set<number>(biggest);
      for (const c of cells) {
        if (seen2.has(c)) continue;
        const comp = [c];
        seen2.add(c);
        for (let head = 0; head < comp.length; head++)
          for (const n of around(comp[head]!))
            if (set.has(n) && !seen2.has(n)) {
              seen2.add(n);
              comp.push(n);
            }
        pieces.push(comp);
      }
      for (const piece of pieces) {
        const id = regions.length;
        regions.push({ kind: "pass", target: 0, zone: -1 });
        for (const c of piece) at[c] = id;
        cellsBy.set(id, piece);
      }
      cellsBy.set(g, biggest);
      continue;
    }
    for (const c of cells)
      if (!keep.has(c) || small) {
        if (hold[c]) continue;
        ground[c] = "wall";
        at[c] = -1;
      }
    cellsBy.set(
      g,
      cells.filter((c) => at[c] === g),
    );
  }
  // Walls two thick between two rooms give a cell back to one of them, and a stray cell of wall inside a
  // room (a stub, a sliver between two parts of it) is floor again: one wall between neighbours, no nubs.
  for (let pass = 0; pass < 2; pass++)
    for (let c = mapW; c < size - mapW; c++) {
      if (ground[c] !== "wall" || !mask[c] || hold[c]) continue;
      const near = around(c).filter((n) => ground[n] === "floor" && at[n]! >= 0);
      const owners = new Set(near.map((n) => at[n]!));
      if (owners.size === 1 && near.length >= 2) {
        const g = [...owners][0]!;
        const opposite =
          (ground[c - 1] === "floor" && at[c - 1] === g && ground[c + 1] === "floor" && at[c + 1] === g) ||
          (ground[c - mapW] === "floor" && at[c - mapW] === g && ground[c + mapW] === "floor" && at[c + mapW] === g);
        if (regions[g]!.kind === "room" && (near.length >= 3 || opposite)) {
          ground[c] = "floor";
          at[c] = g;
          cellsBy.get(g)?.push(c);
          continue;
        }
      }
      for (const d of [1, mapW]) {
        for (const sign of [1, -1]) {
          const [p, q, r] = [c - sign * d, c + sign * d, c + 2 * sign * d];
          if (r < 0 || r >= size || ground[p] !== "floor" || ground[q] !== "wall" || ground[r] !== "floor") continue;
          const [a, b] = [at[p]!, at[r]!];
          if (a < 0 || b < 0 || a === b || regions[a]!.kind !== "room" || !mask[q] || hold[q]) continue;
          const side = d === 1 ? [c - mapW, c + mapW] : [c - 1, c + 1];
          if (side.some((n) => ground[n] === "floor" && at[n] !== a)) continue;
          ground[c] = "floor";
          at[c] = a;
          cellsBy.get(a)?.push(c);
          break;
        }
        if (ground[c] === "floor") break;
      }
    }
  // Wall more than one thick inside the building (a blob where a space was dropped, a double wall) goes to
  // the one room it touches, a cell at a time, until the walls are one thick (gamer panel 2026-11-17).
  if (!rock)
    for (let changed = true; changed;) {
      changed = false;
      for (let c = mapW + 1; c < size - mapW - 1; c++) {
        if (ground[c] !== "wall" || !mask[c] || hold[c]) continue;
        const owners = new Set(
          around(c)
            .filter((n) => ground[n] !== "wall")
            .map((n) => at[n]!),
        );
        if (owners.size !== 1) continue;
        const g = [...owners][0]!;
        if (g < 0 || !["room", "pass", "stair", "hall", "entry"].includes(regions[g]!.kind)) continue;
        // Only out of a mass: some two-by-two of wall inside the building round this cell.
        const mass = [
          [1, mapW],
          [-1, mapW],
          [1, -mapW],
          [-1, -mapW],
        ].some(([dx, dy]) =>
          [c + dx!, c + dy!, c + dx! + dy!].every((n) => ground[n] === "wall" && mask[n] && !hold[n]),
        );
        if (!mass) continue;
        // And never so as to touch another space across a corner.
        const x = c % mapW;
        const corners = [c - mapW - 1, c - mapW + 1, c + mapW - 1, c + mapW + 1].filter(
          (n) => Math.abs((n % mapW) - x) === 1,
        );
        if (corners.some((n) => ground[n] !== "wall" && at[n] !== g)) continue;
        ground[c] = "floor";
        at[c] = g;
        cellsBy.get(g)?.push(c);
        changed = true;
      }
    }
  // Then a room's one-wide tails (a strip left along a wall) are wall again, from their free end in.
  if (!rock)
    for (let changed = true; changed;) {
      changed = false;
      for (const [g, cells] of cellsBy) {
        if (regions[g]!.kind !== "room") continue;
        for (const c of cells) {
          if (at[c] !== g || hold[c] || ground[c] !== "floor") continue;
          if (around(c).filter((n) => at[n] === g && ground[n] === "floor").length > 1) continue;
          ground[c] = "wall";
          at[c] = -1;
          changed = true;
        }
        if (changed)
          cellsBy.set(
            g,
            cells.filter((c) => at[c] === g),
          );
      }
    }
  /** The biggest box inside a set of cells. */
  const biggestBox = (cells: readonly number[]): SiteRect | null => {
    if (!cells.length) return null;
    const xs = cells.map((c) => c % mapW);
    const ys = cells.map((c) => Math.floor(c / mapW));
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const set = new Set(cells);
    const heights = new Array(x1 - x0 + 1).fill(0);
    let best: SiteRect | null = null;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) heights[x - x0] = set.has(cell(x, y)) ? heights[x - x0] + 1 : 0;
      const stack: number[] = [];
      for (let k = 0; k <= heights.length; k++) {
        const hk = k < heights.length ? heights[k] : 0;
        while (stack.length && heights[stack[stack.length - 1]!] >= hk) {
          const top = stack.pop()!;
          const hh = heights[top];
          const from = stack.length ? stack[stack.length - 1]! + 1 : 0;
          const ww = k - from;
          if (hh * ww > (best ? best.w * best.h : 0)) best = { x: x0 + from, y: y - hh + 1, w: ww, h: hh };
        }
        stack.push(k);
      }
    }
    return best;
  };
  // A room that is a sliver at heart (its biggest box two wide or less, a corridor with a name) joins the
  // room across its longest wall, the wall between them taken down (panel 2026-11-17).
  for (const g of [...cellsBy.keys()]) {
    const cells = cellsBy.get(g);
    const region = regions[g]!;
    if (!cells?.length || region.kind !== "room" || region.hidden || region.room?.heart) continue;
    if (entry && SITE_ENTRY_ROOMS.has(region.room!.name)) continue;
    const main = biggestBox(cells);
    if (!main || Math.min(main.w, main.h) > 2) continue;
    const between = new Map<number, number[]>();
    for (const c of cells)
      for (const d of [1, -1, mapW, -mapW]) {
        const w = c + d;
        const far = w + d;
        if (far < 0 || far >= size || ground[w] !== "wall" || hold[w] || !mask[w]) continue;
        const h = at[far]!;
        if (h < 0 || h === g || ground[far] !== "floor" || !cellsBy.has(h)) continue;
        if (regions[h]!.kind !== "room" || regions[h]!.hidden) continue;
        between.set(h, [...(between.get(h) ?? []), w]);
      }
    const best = [...between].sort((p, q) => q[1].length - p[1].length)[0];
    if (!best || best[1].length < 2) continue;
    const [h, walls] = best;
    // The one that stays is the bigger; a planned room keeps its name over a made-up one.
    const keep = cellsBy.get(h)!.length >= cells.length ? h : g;
    const lose = keep === h ? g : h;
    for (const w of new Set(walls)) {
      ground[w] = "floor";
      at[w] = keep;
      cellsBy.get(keep)!.push(w);
    }
    for (const c of cellsBy.get(lose)!) {
      at[c] = keep;
      cellsBy.get(keep)!.push(c);
    }
    cellsBy.delete(lose);
  }
  const shapes = new Map<number, { main: SiteRect; parts: SiteRect[] }>();
  for (const [g, cells] of cellsBy) {
    if (!cells.length) continue;
    let rest = [...cells];
    const boxes: SiteRect[] = [];
    while (rest.length) {
      const b = biggestBox(rest)!;
      boxes.push(b);
      rest = rest.filter((c) => !inside(b, c % mapW, Math.floor(c / mapW)));
    }
    shapes.set(g, { main: boxes[0]!, parts: boxes.slice(1) });
  }
  const alive = (n: number) => shapes.has(n);
  const nodes: SiteRect[] = regions.map((_, n) => shapes.get(n)?.main ?? { x: 0, y: 0, w: 0, h: 0 });
  const isPassage = (n: number) => regions[n]!.kind === "pass" || regions[n]!.kind === "walk";

  // ── Neighbours: two spaces either side of one wall cell, that cell touching nothing else ──
  const edgeMap = new Map<number, SiteEdge>();
  for (let c = 0; c < size; c++) {
    if (ground[c] !== "wall" || hold[c]) continue;
    const x = c % mapW;
    if (x === 0 || x === mapW - 1 || c < mapW || c + mapW >= size) continue;
    for (const [p, q, s1, s2] of [
      [c - 1, c + 1, c - mapW, c + mapW],
      [c - mapW, c + mapW, c - 1, c + 1],
    ] as const) {
      if (ground[p] !== "floor" || ground[q] !== "floor" || ground[s1] === "floor" || ground[s2] === "floor") continue;
      const [a, b] = [at[p]!, at[q]!];
      if (a < 0 || b < 0 || a === b) continue;
      const key = Math.min(a, b) * 1000 + Math.max(a, b);
      const edge = edgeMap.get(key) ?? { a: Math.min(a, b), b: Math.max(a, b), cells: [] };
      edge.cells.push({ x, y: Math.floor(c / mapW) });
      edgeMap.set(key, edge);
    }
  }
  type Edge = SiteEdge;
  const edges: Edge[] = [...edgeMap.values()];
  const owner = new Map<number, SitePlanRoom>();
  for (const [n, region] of regions.entries()) if (alive(n) && region.room) owner.set(n, region.room);

  // ── The way in, and the tree of doors from it ──
  let entrance = { x: -1, y: -1 };
  let start = -1;
  if (entry) {
    for (let t = 1; t <= thick; t++) ground[cell(frame.door.ix, frame.door.iy + t)] = "floor";
    entrance = { x: frame.door.x, y: frame.door.y };
    start = at[doorIn]!;
  } else {
    const first = links.find((link) => cell(link.x, link.y) === arrival) ?? links[0];
    start = first ? at[cell(first.x, first.y)]! : -1;
    entrance = first ? { x: first.x, y: first.y } : { x: -1, y: -1 };
  }
  if (start < 0 || !alive(start)) start = regions.findIndex((_, n) => alive(n));
  if (entrance.x < 0) entrance = { x: nodes[start]!.x, y: nodes[start]!.y };
  const hiddenNode = (n: number) => !!regions[n]!.hidden;
  const lockedNode = (n: number) => !!owner.get(n)?.locked;
  const inTree = new Set([start]);
  const tree: Edge[] = [];
  for (;;) {
    const open = edges.filter(
      (edge) => !hiddenNode(edge.a) && !hiddenNode(edge.b) && inTree.has(edge.a) !== inTree.has(edge.b),
    );
    // A locked room is a dead end: the tree goes on from it only when nothing else is left.
    const onward = open.filter((edge) => !lockedNode(inTree.has(edge.a) ? edge.a : edge.b));
    const frontier = onward.length ? onward : open;
    if (!frontier.length) break;
    const weight = (edge: Edge) => (isPassage(edge.a) || isPassage(edge.b) ? 4 : 1) * (1 + edge.cells.length / 6);
    let roll = random() * frontier.reduce((sum2, edge) => sum2 + weight(edge), 0);
    const edge = frontier.find((each) => (roll -= weight(each)) < 0) ?? frontier[0]!;
    inTree.add(inTree.has(edge.a) ? edge.b : edge.a);
    tree.push(edge);
  }
  const depth = nodes.map(() => -1);
  depth[start] = 0;
  for (let changed = true; changed;) {
    changed = false;
    for (const edge of tree) {
      if (depth[edge.a]! >= 0 && depth[edge.b]! < 0) [depth[edge.b], changed] = [depth[edge.a]! + 1, true];
      else if (depth[edge.b]! >= 0 && depth[edge.a]! < 0) [depth[edge.a], changed] = [depth[edge.b]! + 1, true];
    }
  }
  // The hidden room behind a hidden door from the deepest room beside it.
  const secrets: Array<{ x: number; y: number }> = [];
  const hiddenId = regions.findIndex((region, n) => region.hidden && alive(n));
  if (hiddenId >= 0) {
    const way = edges
      .filter(
        (edge) => (edge.a === hiddenId || edge.b === hiddenId) && inTree.has(edge.a === hiddenId ? edge.b : edge.a),
      )
      .filter((edge) => !lockedNode(edge.a === hiddenId ? edge.b : edge.a))
      .sort((p, q) => {
        const other = (e: Edge) => (e.a === hiddenId ? e.b : e.a);
        return Number(isPassage(other(q))) - Number(isPassage(other(p))) || depth[other(q)]! - depth[other(p)]!;
      })[0];
    if (way) {
      const other = way.a === hiddenId ? way.b : way.a;
      inTree.add(hiddenId);
      depth[hiddenId] = depth[other]! + 1;
      const doorAt = way.cells[Math.floor(way.cells.length / 2)]!;
      ground[cell(doorAt.x, doorAt.y)] = "floor";
      secrets.push(doorAt);
    }
  }
  // A space the tree never reached gets a passage cut to the nearest one it did, through the wall or the
  // rock (a crypt's chambers apart from its galleries); failing that it is walled up.
  for (const [n] of [...regions.entries()].sort(
    (p, q) => (cellsBy.get(q[0])?.length ?? 0) - (cellsBy.get(p[0])?.length ?? 0),
  )) {
    if (!alive(n) || inTree.has(n) || hiddenNode(n)) continue;
    const from = (cellsBy.get(n) ?? []).filter((c) => ground[c] === "floor");
    const back = new Int32Array(size).fill(-2);
    const queue: number[] = [];
    for (const c of from) {
      back[c] = -1;
      queue.push(c);
    }
    let found = -1;
    for (let head = 0; head < queue.length && found < 0; head++) {
      const c = queue[head]!;
      for (const m of around(c)) {
        if (back[m] !== -2) continue;
        if (ground[m] === "floor" && at[m]! >= 0 && inTree.has(at[m]!) && !hiddenNode(at[m]!) && !lockedNode(at[m]!)) {
          back[m] = c;
          found = m;
          break;
        }
        if (!mask[m] || hold[m] || ground[m] === "floor") continue;
        back[m] = c;
        queue.push(m);
      }
    }
    if (found < 0) continue;
    const via = at[found]!;
    for (let c = back[found]!; c >= 0 && back[c] !== -1; c = back[c]!) ground[c] = "floor";
    inTree.add(n);
    depth[n] = depth[via]! + 1;
  }
  // What is still cut off is walled up; a planned room it held goes to a made-up room's space.
  for (const [n] of regions.entries()) {
    if (!alive(n) || inTree.has(n)) continue;
    for (const c of cellsBy.get(n) ?? []) {
      if (hold[c]) continue;
      ground[c] = "wall";
      at[c] = -1;
    }
    shapes.delete(n);
    owner.delete(n);
  }
  const madeUp = () =>
    [...owner.entries()].filter(
      ([m, room]) => regions[m]!.kind === "room" && !regions[m]!.hidden && !level.rooms.includes(room),
    );
  for (const [n, region] of regions.entries()) {
    if (alive(n) || !region.room || !level.rooms.includes(region.room)) continue;
    // A planned room the layout lost takes over the made-up room nearest its size.
    const fit = (m: number) => Math.abs(Math.log((cellsBy.get(m)?.length ?? 1) / SITE_WANT[region.room!.size]));
    const best = madeUp().sort((p, q) => fit(p[0]) - fit(q[0]))[0];
    if (best) owner.set(best[0], region.room);
    else if (region.room.heart) {
      // The heart is never lost: it takes the biggest room there is.
      const biggest = [...owner.keys()]
        .filter((m) => regions[m]!.kind === "room" && !regions[m]!.hidden && !owner.get(m)!.locked)
        .sort((p, q) => (cellsBy.get(q)?.length ?? 0) - (cellsBy.get(p)?.length ?? 0))[0];
      if (biggest !== undefined) owner.set(biggest, region.room);
    }
  }
  const degree = nodes.map((_, n) => tree.filter((edge) => edge.a === n || edge.b === n).length);
  const hasLink = (n: number) => links.some((link) => at[cell(link.x, link.y)] === n);
  for (const [n, room] of owner)
    if (room.locked && (degree[n] !== 1 || hasLink(n) || n === start)) owner.set(n, { ...room, locked: undefined });
  const court = regions.findIndex((region, n) => region.kind === "court" && alive(n));

  /** Each room's alcove, the cells of it, where it has one. */
  const alcoves = new Map<number, Array<{ x: number; y: number }>>();
  // ── Doors ──
  const doorOf = new Map<number, { x: number; y: number }>();
  const opened = new Set<Edge>();
  const openEdge = (edge: Edge, main: boolean, wide = false) => {
    opened.add(edge);
    const child = depth[edge.a]! > depth[edge.b]! ? edge.a : edge.b;
    // An open court and the walk or passage round it: an arcade, open but for every third pier.
    const kinds = [regions[edge.a]!.kind, regions[edge.b]!.kind];
    if (kinds.includes("court") && (kinds.includes("walk") || kinds.includes("pass"))) {
      const sorted = [...edge.cells].sort((p, q) => p.x - q.x || p.y - q.y);
      for (const [k, each] of sorted.entries())
        if (k % 3 !== 2 || sorted.length <= 3) ground[cell(each.x, each.y)] = "floor";
      const mid = sorted[Math.floor(sorted.length / 2)]!;
      ground[cell(mid.x, mid.y)] = "floor";
      if (main) doorOf.set(child, mid);
      return mid;
    }
    const both = isPassage(edge.a) && isPassage(edge.b);
    if (both) {
      for (const each of edge.cells) ground[cell(each.x, each.y)] = "floor";
      return edge.cells[0]!;
    }
    // Two rooms that go together open through a wide archway, one space of two parts, not two boxes.
    if ((wide || regions[edge.a]!.arch || regions[edge.b]!.arch) && edge.cells.length >= 3) {
      const sorted = [...edge.cells].sort((p, q) => p.x - q.x || p.y - q.y);
      const mid = sorted[Math.floor(sorted.length / 2)]!;
      const half = sorted.length >= 8 ? 2 : 1;
      for (const each of sorted)
        if (Math.abs(each.x - mid.x) + Math.abs(each.y - mid.y) <= half) ground[cell(each.x, each.y)] = "floor";
      if (main) doorOf.set(child, mid);
      return mid;
    }
    const doorAt = edge.cells[Math.floor(random() * edge.cells.length)]!;
    ground[cell(doorAt.x, doorAt.y)] = "floor";
    if (edge.a === court || edge.b === court)
      for (const each of edge.cells)
        if (Math.abs(each.x - doorAt.x) + Math.abs(each.y - doorAt.y) <= 1) ground[cell(each.x, each.y)] = "floor";
    if (main) doorOf.set(child, doorAt);
    return doorAt;
  };
  const live = (n: number) => alive(n) && !hiddenNode(n);
  for (const edge of tree) openEdge(edge, true);
  // Rooms that belong together open into each other (never into a locked room).
  const together = (p: number, q: number) => {
    const [a, b] = [owner.get(p), owner.get(q)];
    if (!a || !b || a.locked || b.locked) return false;
    return isMate(a, b);
  };
  const forced = new Set<Edge>();
  for (const edge of edges)
    if (!opened.has(edge) && live(edge.a) && live(edge.b) && together(edge.a, edge.b)) {
      openEdge(
        edge,
        false,
        random() < 0.6 && ![edge.a, edge.b].some((k) => SITE_CLOSED.has(siteBaseName(owner.get(k)?.name ?? ""))),
      );
      forced.add(edge);
    }
  for (const edge of edges) {
    if (opened.has(edge) || !live(edge.a) || !live(edge.b)) continue;
    if (lockedNode(edge.a) || lockedNode(edge.b)) continue;
    const passages2 = Number(isPassage(edge.a)) + Number(isPassage(edge.b));
    // Loops: rooms open into each other often, so a floor is more than a tree of dead ends; room to room
    // more than room to corridor, so a way round skips the corridor.
    const chance = edge.a === court || edge.b === court ? 0.6 : passages2 === 2 ? 0.6 : passages2 === 1 ? 0.12 : 0.4;
    if (random() < chance)
      openEdge(
        edge,
        false,
        passages2 === 0 &&
          random() < 0.15 &&
          ![edge.a, edge.b].some((k) => SITE_CLOSED.has(siteBaseName(owner.get(k)?.name ?? ""))),
      );
  }
  // A room with one way in and others to be had gets a second, mostly: rooms to go round.
  for (const [n] of nodes.entries()) {
    if (!live(n) || isPassage(n) || lockedNode(n) || n === court) continue;
    const mine = edges.filter((edge) => (edge.a === n || edge.b === n) && live(edge.a) && live(edge.b));
    if (mine.filter((edge) => opened.has(edge)).length !== 1) continue;
    const more = mine.filter((edge) => !opened.has(edge) && !lockedNode(edge.a === n ? edge.b : edge.a));
    const rooms2 = more.filter((edge) => !isPassage(edge.a === n ? edge.b : edge.a));
    const pool2 = rooms2.length ? rooms2 : more;
    if (pool2.length && random() < 0.6) openEdge(pool2[Math.floor(random() * pool2.length)]!, false);
  }
  // Without a hidden room, now and then a hidden door makes a short way between rooms far apart.
  if (hiddenId < 0 && !rock && !level.inset && random() < 0.5) {
    const best = edges
      .filter(
        (edge) =>
          !opened.has(edge) &&
          live(edge.a) &&
          live(edge.b) &&
          !isPassage(edge.a) &&
          !isPassage(edge.b) &&
          !lockedNode(edge.a) &&
          !lockedNode(edge.b) &&
          Math.abs(depth[edge.a]! - depth[edge.b]!) >= 2,
      )
      .sort((p, q) => Math.abs(depth[q.a]! - depth[q.b]!) - Math.abs(depth[p.a]! - depth[p.b]!))[0];
    if (best) {
      opened.add(best);
      const doorAt = best.cells[Math.floor(best.cells.length / 2)]!;
      ground[cell(doorAt.x, doorAt.y)] = "floor";
      secrets.push(doorAt);
    }
  }

  // Alcoves: a room now and then has a three-cell recess cut into a thick wall (or a crypt's rock): never
  // near the front door.
  if (!level.inset) {
    for (const [n, r] of nodes.entries()) {
      const room = owner.get(n);
      if (!alive(n) || isPassage(n) || !room || room.use === "open" || Math.min(r.w, r.h) < 4 || random() > 0.35)
        continue;
      const sides = shuffle(["n", "s", "e", "w"] as const);
      for (const side of sides) {
        const across = side === "n" || side === "s";
        if ((across ? r.w : r.h) < 5) continue;
        const [dx, dy] = side === "n" ? [0, -1] : side === "s" ? [0, 1] : side === "w" ? [-1, 0] : [1, 0];
        const along = across ? r.w : r.h;
        const first = Math.floor(random() * (along - 3 - 1)) + 1;
        const cellsOf = (k: number, d: number) =>
          across
            ? { x: r.x + first + k, y: (side === "n" ? r.y : r.y + r.h - 1) + dy * d }
            : { x: (side === "w" ? r.x : r.x + r.w - 1) + dx * d, y: r.y + first + k };
        const recess = [0, 1, 2].map((k) => cellsOf(k, 1));
        const behind = [-1, 0, 1, 2, 3].map((k) => cellsOf(k, 2));
        const flank = [cellsOf(-1, 1), cellsOf(3, 1)];
        const ok = (p: { x: number; y: number }) => p.x > 0 && p.y > 0 && p.x < mapW - 1 && p.y < mapH - 1;
        if (![...recess, ...behind, ...flank].every(ok)) continue;
        if (!recess.every((p) => ground[cell(p.x, p.y)] === "wall" && !hold[cell(p.x, p.y)])) continue;
        if (!flank.every((p) => ground[cell(p.x, p.y)] !== "floor")) continue;
        if (!behind.every((p) => ground[cell(p.x, p.y)] === "wall" || (rock && ground[cell(p.x, p.y)] === "rock")))
          continue;
        if (recess.some((p) => Math.abs(p.x - entrance.x) + Math.abs(p.y - entrance.y) < 4)) continue;
        // The inner face of the recess must be the room's own wall: the cells beside it inside the room.
        const inner = [0, 1, 2].map((k) => cellsOf(k, 0));
        if (!inner.every((p) => at[cell(p.x, p.y)] === n && ground[cell(p.x, p.y)] === "floor")) continue;
        for (const p of recess) ground[cell(p.x, p.y)] = "floor";
        for (const p of [...behind, ...flank]) if (ground[cell(p.x, p.y)] === "rock") ground[cell(p.x, p.y)] = "wall";
        alcoves.set(n, recess);
        break;
      }
    }
  }

  // Chamfered halls: a great room's corners cut off on the slant, an octagon more than a box, wherever no
  // door or stair stands in the corner.
  for (const [n, r] of nodes.entries()) {
    const room = owner.get(n);
    if (!alive(n) || isPassage(n) || !room || room.use === "open" || Math.min(r.w, r.h) < 6) continue;
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
          !hold[cell(p.x, p.y)] &&
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

  // A passage's dead ends, where no door or stair is, are walled: no carpet runs into a blank wall.
  for (let changed = true; changed;) {
    changed = false;
    for (let c = mapW; c < size - mapW; c++) {
      if (ground[c] !== "floor" || hold[c] || at[c]! < 0 || !isPassage(at[c]!)) continue;
      if (around(c).filter((n) => ground[n] !== "wall" && ground[n] !== "rock").length > 1) continue;
      ground[c] = "wall";
      at[c] = -1;
      changed = true;
    }
  }
  const rooms: DungeonRoom[] = [];
  const info: SiteLevelMap["rooms"] = [];
  const doors: Array<{ x: number; y: number; room: number; locked: boolean } | null> = [];
  const opens: Array<SiteSide | null> = [];
  const roomOf = new Map<SitePlanRoom, number>();
  /** The hidden room: never where a key lies, as the way to it may be through the lock. */
  const hiddenRooms = new Set<number>();
  const ways: SiteRect[] = nodes.filter((_, n) => alive(n) && isPassage(n));
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
    if (regions[n]!.hidden) hiddenRooms.add(k);
    const shape = shapes.get(n);
    // An alcove is part of its room.
    const recess = alcoves.get(n);
    const parts = [
      ...(shape?.parts ?? []),
      ...(recess
        ? [
            {
              x: Math.min(...recess.map((p) => p.x)),
              y: Math.min(...recess.map((p) => p.y)),
              w: Math.max(...recess.map((p) => p.x)) - Math.min(...recess.map((p) => p.x)) + 1,
              h: Math.max(...recess.map((p) => p.y)) - Math.min(...recess.map((p) => p.y)) + 1,
            },
          ]
        : []),
    ];
    rooms.push(parts.length ? { ...r, parts } : { ...r });
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
          // A stone column standing free, not a stub of wall (gamer panel 2026-11-17); a crypt's pack has
          // its own pillar.
          if (plan.template === "crypt") ground[cell(x, y)] = "wall";
          else props[cell(x, y)] = COLUMN;
        }
    }
  }
  if (entry) props[cell(entrance.x, entrance.y)] = DUNGEON_EXIT_PROP;
  for (const at of secrets) props[cell(at.x, at.y)] = DUNGEON_SECRET_DOOR_PROP;
  // Solid with nothing open beside it is not wall but the land round the building.
  const solid = ground.map((g, i) => {
    if (g !== "wall" || (mask[i] && (!rock || level.depth >= 0))) return false;
    const [x, y] = [i % mapW, Math.floor(i / mapW)];
    // A stone building's outer wall is two thick; rock between vaults is rock past one course of masonry.
    const t = rock ? 1 : thick;
    for (let dy = -t; dy <= t; dy++)
      for (let dx = -t; dx <= t; dx++) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx < 0 || ny < 0 || nx >= mapW || ny >= mapH) continue;
        if (ground[cell(nx, ny)] !== "wall" && ground[cell(nx, ny)] !== "rock") return false;
      }
    return true;
  });
  for (const [i, inside2] of solid.entries()) if (inside2) ground[i] = "rock";
  // Land shut inside the walls on the ground floor (a pocket the outline left) is wall, never a patch of
  // grass. Above, an enclosed hole is the open ward or light well below and stays open.
  if (level.depth === 0 && !level.inset) {
    const outside = new Uint8Array(size);
    const queue: number[] = [];
    for (let c = 0; c < size; c++) {
      const x = c % mapW;
      if ((x === 0 || x === mapW - 1 || c < mapW || c >= size - mapW) && ground[c] === "rock") {
        outside[c] = 1;
        queue.push(c);
      }
    }
    for (let head = 0; head < queue.length; head++)
      for (const n of around(queue[head]!))
        if (!outside[n] && ground[n] === "rock") {
          outside[n] = 1;
          queue.push(n);
        }
    for (let c = 0; c < size; c++) if (ground[c] === "rock" && !outside[c]) ground[c] = "wall";
  }
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
  // Water that cuts a room off is drained.
  if (level.flooded && !reachable())
    for (let i = 0; i < ground.length; i++) if (ground[i] === "liquid") ground[i] = "floor";
  // Locks: a locked room's door; its key in another room of the level that is open.
  const locks: SiteLevelLock[] = [];
  const open = rooms.map((_, n) => n).filter((n) => !doors[n]?.locked && !hiddenRooms.has(n));
  for (const door of doors) {
    if (!door?.locked || !open.length) continue;
    props[cell(door.x, door.y)] = SITE_LOCK_PROP;
    locks.push({ x: door.x, y: door.y, room: door.room, key: open[Math.floor(random() * open.length)]! });
  }
  // Furniture against each room's back wall (the one facing its door), then rubble in ruined rooms;
  // never closing a way.
  const doorCells = new Set(doors.flatMap((door) => (door ? [cell(door.x, door.y)] : [])));
  // A scene or two a floor, a few things together that tell what happened here (gamer panel 2026-11-17).
  const scenes = new Set(
    [...roomOf]
      .filter(
        ([room, n]) =>
          plan.template !== "crypt" &&
          room.use !== "open" &&
          !room.heart &&
          !hiddenRooms.has(n) &&
          !SITE_STAIR_ROOMS.has(siteBaseName(room.name)) &&
          rooms[n]!.w * rooms[n]!.h >= 16,
      )
      .sort(() => random() - 0.5)
      .slice(0, 1 + Math.floor(random() * 2))
      .map(([, n]) => n),
  );
  for (const [room, n] of roomOf) {
    const area = rooms[n]!;
    const side = opens[n];
    const put = (slot: number, x: number, y: number) => {
      const i = cell(x, y);
      // A room too small to stand in keeps its floor clear, and every room keeps a cell of its main part
      // to stand on.
      if (area.w * area.h < 4) return false;
      let open = 0;
      for (let yy = area.y; yy < area.y + area.h && open < 2; yy++)
        for (let xx = area.x; xx < area.x + area.w && open < 2; xx++)
          if (ground[cell(xx, yy)] === "floor" && props[cell(xx, yy)] === -1) open++;
      if (open < 2) return false;
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
    // Each kind of thing its own heap, in a corner of its own, so a big room or a ward is not all in one.
    const clustered = () => {
      const anchor = corners.length ? corners[Math.floor(random() * corners.length)]! : ([x0, y0] as [number, number]);
      return everywhere().sort(
        (p, q) =>
          Math.abs(p[0] - anchor[0]) +
          Math.abs(p[1] - anchor[1]) -
          (Math.abs(q[0] - anchor[0]) + Math.abs(q[1] - anchor[1])),
      );
    };
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
    const reps = Math.max(1, Math.min(8, Math.round((area.w * area.h) / 14)));
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
    // Between the arcades where a great room has them, the aisles outside them left clear.
    const arcades = SITE_HALL_ROOMS.has(room.name) && plan.template !== "manor" && area.w >= 7 && area.h >= 7;
    if (short >= 5)
      for (let k = 2; k < long - 2; k += 2) {
        // A long nave's pews in two blocks with a cross-aisle between them (panel 2026-11-17).
        if (long >= 12 && Math.abs(k - Math.round(long / 2)) <= 1) continue;
        for (let line = arcades ? 3 : 1; line < short - (arcades ? 3 : 1); line++) {
          if (Math.abs(line - (short - 1) / 2) < 1) continue;
          pews.push(along ? [x0 + k, y0 + line] : [x0 + line, y0 + k]);
        }
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
    if (scenes.has(n)) {
      const base = siteBaseName(room.name);
      // Several stories for each kind of room, and bigger heaps, so no two floors tell the same one (panel
      // 2026-11-17).
      const camp = [PALLET, BUCKET, JUG, WOODPILE, STOOL]; // someone camped here
      const stories = /cell|gaol|oubliette/iu.test(base)
        ? [
            [CHAINS, BONES, BUCKET, HAY, TIPPED], // a prisoner left to die
            [CHAINS, TIPPED, SWORD, BUCKET], // a breakout
          ]
        : /guard|barracks|armoury|gate|watch|interrogation|wall walk/iu.test(base)
          ? [
              [BONES, SWORD, TIPPED, JUG, BONES], // a fight lost
              [TIPPED, SWORD, SWORD, CHEST, BONES], // a last stand by the chest
              [STOOL, JUG, JUG, TIPPED, CHEST], // dice and drink, left mid-game
            ]
          : /store|cellar|pantry|larder|granary|buttery|cold|wine|lumber|dairy/iu.test(base)
            ? [
                [BARREL, CRATE, TIPPED, BONES, JARS], // broken into, the stores spilt
                [CRATE, CRATE, JARS, COBWEB, HAY], // rats' nest
                camp,
              ]
            : /hall|dining|refectory|kitchen|scullery|servants/iu.test(base)
              ? [
                  [TIPPED, JUG, TIPPED, BONES, STOOL], // a meal left in a hurry
                  [JUG, JUG, TIPPED, BARREL, STOOL], // a feast that ended badly
                ]
              : [
                  [CHEST, TIPPED, JUG, SWORD, CHEST], // ransacked
                  [BONES, COBWEB, TIPPED, JARS], // someone who never left
                  camp,
                ];
      const scene = stories[Math.floor(random() * stories.length)]!;
      const steps: Array<[number, number]> = shuffle([
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ]);
      for (const [x, y] of everywhere()) {
        if (near(x, y) || !put(scene[0]!, x, y)) continue;
        let k = 1;
        for (const [dx, dy] of steps) {
          if (k >= scene.length) break;
          const [sx, sy] = [x + dx, y + dy];
          if (sx < x0 || sy < y0 || sx > x1 || sy > y1 || near(sx, sy)) continue;
          if (put(scene[k]!, sx, sy)) k++;
        }
        break;
      }
    } else if (plan.template !== "crypt" && room.use !== "open" && !tiny && random() < 0.55) {
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
  /** The kind of way taken (main stairs, back stairs, the wall stair), to come out at its own end. */
  via?: string;
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
  const arrive =
    input.from === undefined
      ? undefined
      : (laid.links.find((link) => link.level === input.from && link.kind === input.via) ??
        laid.links.find((link) => link.level === input.from));
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
