// Building plans for dungeon sites (owner 2026-11-14, "Dungeon building plans: design"): a site is planned
// once as a whole building, its levels, their zones and their rooms each with a purpose, from what the
// place is, how rich its builder was, the land it stands on and what history did to it. Each level is then
// laid out as its own map from the plan: one footprint shared by every level, its stairs at the same cells
// on every level they join, rooms off a hall, so a mansion has a cellar, a ground floor with its hall and
// kitchen, an upper floor of bedrooms and a guest wing, and an attic. Pure and seeded: the same input
// always gives the same building.

import { marinaraRandom } from "../marinara-classes.js";
import { SITE_STAMP_LEGEND, siteStampStretch, siteStampsFor } from "./site-stamps.js";
import {
  DUNGEON_EXIT_PROP,
  DUNGEON_PORTCULLIS_PROP,
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
        wealth: 2,
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
      ["Guardroom", 2, [T, SHELF, CHEST]],
      ["Wine vault", 2, [CHEST, CHEST, SHELF]],
      ["Sally port tunnel", 1, [CHEST]],
      ["Strongroom", 1, [CHEST, CHEST, CHEST]],
      ["Torture chamber", 2, [T, FIRE, CHEST]],
      ["Charnel pit", 1, [CHEST]],
      ["Cistern", 2, [CHEST]],
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
    // Never through a tower top, whose one floor is its ladder.
    if (input.fate === "war" && upper.depth === 1 && lower.depth === 0 && !upper.inset)
      links.push({ upper: i, lower: i + 1, kind: "hole" });
    // A castle's wall walk has a stair of its own down into the range below it, a second way between the
    // floors that keeps clear of the donjon (panel 2026-11-17).
    if (input.template === "keep" && upper.depth === 1 && lower.depth === 0 && !upper.inset)
      links.push({ upper: i, lower: i + 1, kind: "wall" });
    // A house or a castle now and then has a priest's hole: a ladder in the wall between the ground floor
    // and the one above, behind hidden doors on both (owner 2026-11-18, "Add verticality and sightlines").
    if (
      (input.template === "manor" || input.template === "keep") &&
      upper.depth === 1 &&
      lower.depth === 0 &&
      !upper.inset &&
      input.fate !== "war" &&
      random() < 0.6
    )
      links.push({ upper: i, lower: i + 1, kind: "hidden" });
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
  rooms: Array<{ name: string; use: SiteRoomUse; heart?: true; post?: true; quiet?: true }>;
  links: SiteLevelLink[];
  locks: SiteLevelLock[];
  traps: SiteLevelTrap[];
  /** The way round the held room, cell by cell, through the rooms left to nobody. */
  quietWay?: Array<{ x: number; y: number }>;
  /** Loose boards or rubble on the way round, which give a sneaking party away. */
  creaks?: Array<{ x: number; y: number }>;
  /** A raised gallery over the hall: its walk and the steps up to it (the rail is a prop). */
  gallery?: Array<{ x: number; y: number }>;
}

/** The rooms that are a level's great room: the biggest space on it. */
/** Rooms never given a floor's set piece: ways, stairs and the rooms whose own plan is their set piece. */
const SITE_STAMP_FREE_SET_PIECE =
  /stair|passage|walk|corridor|gallery|cell|ward|court|cloister|garth|great hall|chapel|founder/iu;
const SITE_HALL_ROOMS = new Set(["Great hall", "Nave", "Undercroft", "Burial hall"]);
/** The rooms the way in opens into. */
/** Rooms whose tables are set end to end down the middle. */
/** A house's kitchen and offices, on the service side of its ground floor. */
const SITE_SERVICE_ROOMS = new Set([
  "Kitchen",
  "Pantry",
  "Servants' hall",
  "Scullery",
  "Laundry",
  "Still room",
  "Dairy",
  "Butler's pantry",
  "Housekeeper's room",
  "Larder",
  "Gun room",
  "Steward's office",
  "Estate office",
]);
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
  WOODPILE = 42,
  RAIL = 44;
type SiteRecipe = ReadonlyArray<readonly [slot: number, role: SiteRole, count?: number | "reps" | "all"]>;
const KITCHEN: SiteRecipe = [
  [RANGE, "back"],
  [T, "center", 2],
  [BARREL, "corner", 2],
  [CRATE, "corner"],
  [SHELF, "wall", 2],
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
  // One table in the middle of a dining room, not a hall's boards (panel round 20 2026-11-17: the hall,
  // the dining room and the servants' hall all the same two rows of long table).
  "Dining room": [
    [T, "center", 3],
    [STOOL, "seats", "all"],
    [FIRE, "back"],
    [WARDROBE, "wall"],
    [STATUE, "corner", 2],
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
  // The servants eat at tables along the walls, the middle kept clear for passing through.
  "Servants' hall": [
    [T, "wall", "reps"],
    [STOOL, "seats", "all"],
    [FIRE, "back"],
    [BARREL, "corner"],
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
  // Each bedroom something of its own (panel 2026-11-17: bed, wardrobe and chest everywhere).
  Bedroom: [
    [BED, "back"],
    [WARDROBE, "wall"],
    [BATH, "corner"],
    [STOOL, "wall"],
  ],
  "Guest bedroom": [
    [BED, "back"],
    [CHEST, "corner"],
    [FIRE, "wall"],
    [STOOL, "wall"],
  ],
  "Guest chamber": [
    [BED, "back"],
    [DESK, "wall"],
    [SHELF, "wall"],
    [CHEST, "corner"],
  ],
  "Governess's room": [
    [BED, "back"],
    [DESK, "wall"],
    [SHELF, "wall", 2],
    [LECTERN, "corner"],
  ],
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
  // A hoard heaped in a corner or two, not a shop shelf of chests round the walls (panel rounds 40-41).
  Vault: [
    [CHEST, "corner", 3],
    [CHEST, "wall", 2],
    [CRATE, "corner", 2],
  ],
  Treasury: [
    [CHEST, "corner", 3],
    [STATUE, "corner"],
    [CHEST, "wall", 2],
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
    [HAY, "corner"],
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
  "Mural tower": [
    [RACK, "wall"],
    [CHEST, "corner"],
    [FIRE, "back"],
  ],
  // The windlass the portcullis hangs from, its chains, the murder holes' stones.
  "Gate chamber": [
    [CHAINS, "center", 1],
    [CRATE, "corner"],
    [RACK, "wall"],
  ],
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
  // The choir's stalls down both its long walls, the lectern between them.
  Choir: [
    [PEW, "wall", "all"],
    [LECTERN, "center", 1],
  ],
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
    // Stores heaped by kind in a few bays, not a fringe along every wall (panel round 41: a spreadsheet of
    // the dead).
    [TOMB, "center", 2],
    [SKULLS, "corner", 2],
    [CRATE, "corner", 3],
    [BARREL, "corner", 2],
  ],
  Reliquary: [
    [CHEST, "wall", 2],
    [STATUE, "corner", 2],
    [ALTAR, "back"],
  ],
  "Relic store": [
    [CHEST, "corner", 3],
    [STATUE, "corner"],
  ],
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
  const within = (r: SiteRect, x: number, y: number) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
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
  /** Where the front door stands across the front: the middle, but for a castle whose gate is off to one side. */
  let doorX = cx;
  /** The keep's portcullis, raised, across the gate passage. */
  let portcullisAt: { x: number; y: number; w: number } | null = null;
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
  /** A house's ground floor: the side of the front door its kitchen and offices are on. */
  let serviceSide = 0;
  /** A castle's stairs where its back range was laid by rule. */
  /** A castle's donjon, where it was laid by rule. */
  let donjonRect: SiteRect | null = null;
  let stairsAt: {
    main: { x: number; y: number };
    alt: { x: number; y: number };
    tower: SiteRect;
    ladder: { x: number; y: number };
    back: { x: number; y: number };
  } | null = null;

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
    // The ground floor in two sides either side of the front door, as a house is: the family's rooms and
    // the hall on one, the kitchen and the offices on the other, the dining room and the kitchen each by
    // the line between (history panel 2026-11-17: the kitchen thirty cells from the dining room).
    serviceSide = random() < 0.5 ? 1 : 2;
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
    // The back range a little under a third (panel round 29: the ward too small for the castle round it).
    const nb = Math.max(7, Math.round(H * 0.3));
    put(full, cellsOf({ x: L, y: T + nb, w: W, h: 1 }), 0);
    const yb = T + nb + 1;
    const side = W >= 32 ? 5 : 4;
    const front = 4;
    const gw = W >= 34 ? 3 : 2;
    // The gate in the middle of the front, or off to one side of it (DM panel round 24: every castle the same
    // plan); never so far over that its towers meet a corner tower.
    const lean = Math.floor((W - 2 * side) / 4);
    const shift = random() < 0.5 || lean < 3 ? 0 : (random() < 0.5 ? -1 : 1) * lean;
    const gx = Math.max(L + side + 1, Math.min(R - side - gw, cx + shift - Math.floor(gw / 2)));
    const gcx = gx + Math.floor(gw / 2);
    doorX = gcx;
    for (let y = T; y <= B; y++)
      for (let x = L; x <= R; x++)
        zone[at(x, y)] = y < T + nb ? 1 : y > B - front ? (x < gcx ? 4 : 5) : x < L + side ? 2 : x > R - side ? 3 : 0;
    fixed.push({
      kind: "court",
      cells: cellsOf({ x: L + side, y: yb, w: W - 2 * side, h: B - front - yb + 1 }),
      on: onGround,
      claim: (room) => room.use === "open",
      room: { name: SITE_COURT_NAMES.keep, use: "open", size: 3, zone: "public", furniture: [] },
    });
    // The back range laid out as a castle's is (history panel 2026-11-17): the donjon at one end, a square
    // block behind a wall two thick; the great hall beside it, its dais at the donjon end; across its low end
    // the screens passage from the ward, and past that the buttery and pantry, then the kitchen. Whatever
    // is left at the far end is free for the chapel and the rest.
    {
      const westKeep = random() < 0.5;
      const d = Math.max(7, Math.min(W - 18, Math.max(9, Math.min(nb + 1, Math.floor(W / 3)))));
      const rest = W - d;
      const hw = Math.max(7, Math.min(14, Math.round(rest * 0.38)));
      const sw = 2;
      const bw = 4;
      const kw = Math.max(5, Math.min(7, rest - hw - sw - bw - 1));
      // Spans along the band, from the donjon's end outward.
      const span = (from: number, w: number) => (westKeep ? { x: L + from, w } : { x: R - from - w + 1, w });
      const donjon = span(0, d);
      const hall = span(d, hw);
      const screens = span(d + hw, sw);
      const buttery = span(d + hw + sw, bw);
      const kitchen = span(d + hw + sw + bw, kw);
      if (d + hw + sw + bw + kw <= W) {
        // The donjon's own wall: two thick, nothing grows in it.
        // The donjon stands forward of the range into the ward, the biggest block in the castle (history
        // panel round 23: a keep smaller than its hall is no keep).
        const ext = Math.max(0, Math.min(3, Math.floor((B - front - yb) / 4)));
        const nd = nb + ext;
        donjonRect = { x: donjon.x, y: T, w: donjon.w, h: nd };
        put(full, cellsOf({ x: donjon.x, y: T + nb, w: donjon.w, h: ext }));
        for (const each of fixed)
          if (each.kind === "court")
            each.cells = each.cells.filter(
              (c) =>
                !within(donjonRect!, c % mapW, Math.floor(c / mapW)) &&
                !within({ x: donjon.x - 1, y: T, w: donjon.w + 2, h: nd + 1 }, c % mapW, Math.floor(c / mapW)),
            );
        for (const c of cellsOf({ x: donjon.x, y: T, w: donjon.w, h: nd })) zone[c] = -2;
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: donjon.x + 1, y: T + 1, w: donjon.w - 2, h: nd - 2 }),
          on: onGround,
          claim: (room) => room.name === "Keep store",
          room: { name: "Keep store", use: "store", size: 2, zone: "private", furniture: [CHEST, CRATE, BARREL] },
        });
        // Over it, the donjon's first floor: the guard room the stair comes up into.
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: donjon.x + 1, y: T + 1, w: donjon.w - 2, h: nd - 2 }),
          on: (level) => level.depth === 1 && !level.inset,
          claim: (room) => room.name === "Guard room",
          room: { name: "Guard room", use: "post", size: 2, zone: "public", furniture: [T, SHELF] },
        });
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: hall.x, y: T, w: hall.w, h: nb }),
          on: onGround,
          claim: (room) => room.name === "Great hall",
          room: { name: "Great hall", use: "holders", size: 3, zone: "public", furniture: [T, T, FIRE] },
        });
        fixed.push({
          kind: "pass",
          cells: cellsOf({ x: screens.x, y: T, w: screens.w, h: nb }),
          on: onGround,
          room: { name: "Screens passage", use: "post", size: 1, zone: "public", furniture: [] },
        });
        const half = Math.floor(nb / 2);
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: buttery.x, y: T, w: buttery.w, h: half }),
          on: onGround,
          claim: (room) => room.name === "Buttery",
          room: { name: "Buttery", use: "store", size: 1, zone: "service", furniture: [BARREL, WINE] },
        });
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: buttery.x, y: T + half, w: buttery.w, h: nb - half }),
          on: onGround,
          claim: (room) => room.name === "Pantry",
          room: { name: "Pantry", use: "store", size: 1, zone: "service", furniture: [SHELF, CRATE] },
        });
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: kitchen.x, y: T, w: kitchen.w, h: nb }),
          on: onGround,
          claim: (room) => room.name === "Kitchen",
          room: { name: "Kitchen", use: "holders", size: 2, zone: "service", furniture: [FIRE, T] },
        });
        // The stair up in the donjon's corner by the hall, the back stair at the kitchen's end: the donjon
        // one room round its stair, not a store between two stairwells (panel round 20 2026-11-17).
        stairsAt = {
          main: { x: westKeep ? donjon.x + donjon.w - 2.5 : donjon.x + 2.5, y: T + 2.5 },
          tower: { x: donjon.x - 1, y: T - 1, w: donjon.w + 2, h: nd + 2 },
          ladder: { x: westKeep ? donjon.x + 2 : donjon.x + donjon.w - 2, y: T + nd - 2 },
          alt: { x: westKeep ? donjon.x + 2.5 : donjon.x + donjon.w - 2.5, y: T + nd - 2.5 },
          back: { x: westKeep ? R - 2 : L + 2, y: T + nb - 2 },
        };
      }
    }
    // A well house standing free in the ward, on the side away from the donjon (history panel round 23:
    // a ward is a yard with buildings in it, not an empty square).
    {
      const [wx0, ww, wh] = [L + side, W - 2 * side, B - front - yb + 1];
      const awayEast = donjonRect ? donjonRect.x + donjonRect.w / 2 < L + W / 2 : random() < 0.5;
      if (ww >= 15 && wh >= 7) {
        // Two clear of the side range, so the lane past it is a lane.
        const bx = awayEast ? wx0 + ww - 7 : wx0 + 2;
        const by = yb + 1;
        const block = { x: bx, y: by, w: 5, h: 5 };
        const court = fixed.find((each) => each.kind === "court");
        const near = donjonRect && { x: donjonRect.x - 2, y: 0, w: donjonRect.w + 4, h: donjonRect.h + 2 };
        const blocked = near && cellsOf(block).some((c) => within(near, c % mapW, Math.floor(c / mapW)));
        if (court && !blocked) {
          court.cells = court.cells.filter((c) => !within(block, c % mapW, Math.floor(c / mapW)));
          for (const c of cellsOf(block)) zone[c] = -2;
          fixed.push({
            kind: "room",
            cells: cellsOf({ x: bx + 1, y: by + 1, w: 3, h: 3 }),
            on: onGround,
            room: { name: "Well house", use: "store", size: 1, zone: "service", furniture: [WELL] },
          });
        }
      }
    }
    const td = 3;
    // Two gate towers astride the passage, each a guard room the gate is worked from (panel round 23: the
    // gate was a gap in the wall).
    const gateTowers = [
      { x: gx - 4, y: B + 1, w: 3, h: td },
      { x: gx + gw + 1, y: B + 1, w: 3, h: td },
    ];
    groundOnly = gateTowers.flatMap((r) => cellsOf(r));
    for (const c of groundOnly) zone[c] = c % mapW < gcx ? 4 : 5;
    for (const r of gateTowers)
      fixed.push({
        kind: "tower",
        cells: cellsOf(r),
        on: onGround,
        room: { name: "Gate tower", use: "post", size: 1, zone: "public", furniture: [RACK] },
      });
    const passage = cellsOf({ x: gx, y: B - front + 1, w: gw, h: front + td });
    groundOnly.push(...cellsOf({ x: gx, y: B + 1, w: gw, h: td }));
    portcullisAt = { x: gx, y: B + 2, w: gw };
    fixed.push({
      kind: "pass",
      cells: passage,
      on: onGround,
      room: { name: "Gate passage", use: "post", size: 1, zone: "public", furniture: [] },
    });
    const s = plan.wealth === 3 ? 5 : 4;
    // Mirrored about the curtain: the east towers stood a cell further out than the west, so the one by the
    // donjon was cut off and walled up (round 24 check: a corner tower lost in four keeps of five).
    const left = fx;
    const right = R + (L - left);
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
    if (donjonRect) put(upper, cellsOf(donjonRect));
    // The dungeons run on under the ward as well, not a strip under the donjon alone.
    put(below, cellsOf({ x: L, y: T, w: W, h: Math.min(H, nb + Math.round(H * 0.55)) }));
    const walk = [
      // From the back range's foot, so the walk meets the floors of the back range (round 21 2026-11-17:
      // a walk cut off from them was walled up whole).
      ...cellsOf({ x: L, y: T + nb, w: 2, h: B - T - nb + 1 }),
      ...cellsOf({ x: R - 1, y: T + nb, w: 2, h: B - T - nb + 1 }),
      ...cellsOf({ x: L + 2, y: B - 1, w: W - 4, h: 2 }),
    ].filter((c) => !donjonRect || !within(donjonRect, c % mapW, Math.floor(c / mapW)));
    put(upper, walk);
    for (const cells of towerCells) put(upper, cells);
    fixed.push({
      kind: "walk",
      cells: walk,
      on: (level) => level.depth > 0 && !level.inset,
      room: { name: "Wall walk", use: "post", size: 3, zone: "public", furniture: [] },
    });
    {
      // On the side away from the donjon, which now stands forward into the ward.
      const coin = random() < 0.5;
      const east = donjonRect ? donjonRect.x + donjonRect.w / 2 < L + W / 2 : coin;
      const y = yb + 1 + Math.floor(random() * Math.max(1, B - front - yb - 2));
      wallAt = { x: east ? R - 1 : L + 1, y, lower: { x: east ? R - side : L + side - 1 + 1, y } };
    }
    // Along the walk: a mural tower part way down each side span, and the gate chamber over the gate where
    // the portcullis is worked, each a room the walk passes (panel round 24: a bare ring that leads nowhere).
    {
      const span0 = T + nb + 1;
      const span1 = B - 3;
      for (const west of [true, false]) {
        let my = Math.floor((span0 + span1) / 2) - 1;
        if (wallAt && wallAt.x < cx === west && Math.abs(wallAt.y - my) < 4) my = wallAt.y + (my < wallAt.y ? -5 : 4);
        if (my < span0 || my + 3 > span1 || side < 4) continue;
        const r = { x: west ? L + 2 : R - 5, y: my, w: 4, h: 4 };
        const cells = cellsOf(r).filter((c) => !donjonRect || !within(donjonRect, c % mapW, Math.floor(c / mapW)));
        if (cells.length < 16) continue;
        put(upper, cells);
        fixed.push({
          kind: "room",
          cells,
          on: (level) => level.depth === 1 && !level.inset,
          room: { name: "Mural tower", use: "post", size: 1, zone: "public", furniture: [RACK, CHEST] },
        });
      }
      const gate = cellsOf({ x: gx - 1, y: B - 4, w: gw + 2, h: 3 });
      if (B - 4 > T + nb + 2) {
        put(upper, gate);
        fixed.push({
          kind: "room",
          cells: gate,
          on: (level) => level.depth === 1 && !level.inset,
          room: { name: "Gate chamber", use: "post", size: 1, zone: "public", furniture: [CHEST] },
        });
      }
    }
    inset = { x: L + 3, y: T - 1, w: W - 6, h: nb + 2 };
    mainAt = { x: L + 3 + Math.floor(random() * 4), y: T + nb - 3 };
    backAt = { x: R - 3 - Math.floor(random() * 4), y: T + 2 };
    if (stairsAt) [mainAt, backAt] = [stairsAt.main, stairsAt.back];
    // The tower top over the donjon, the one tower that rises above the rest.
    if (stairsAt) inset = stairsAt.tower;
  } else if (kind === "temple") {
    // Laid out as a church is: the choir and its stalls at the high end under the apse, the crossing with a
    // transept arm either side below it, the nave and its arcades down to the narthex at the west door. On
    // one side the cloister against the nave, its walk round the garth, the claustral ranges off the walk:
    // the chapter house and the dorter on the outer range, the refectory across the front (history panel
    // 2026-11-17: a church plan, not a hall with rooms stuck on).
    // The cloister on one side; the bell tower at the front corner on the other where there is room for
    // it (a narrower nave to make room), else none: a small church has a bellcote.
    const left = random() < 0.5;
    const sideRoom = (nw: number) => {
      const nx = cx - Math.floor(nw / 2);
      return left ? R - (nx + nw) : nx - L;
    };
    const nw = W >= 30 && sideRoom(11) >= 8 ? 11 : 9;
    const nx = cx - Math.floor(nw / 2);
    // A tower base no more than five square when there is room beside it for a side chapel (history panel
    // round 23: a 7x7 tower base is a hall, not a tower); else out to the nave as before.
    const spare = sideRoom(nw) - 1;
    const tw = spare >= 9 ? 5 : Math.min(7, spare);
    const sideTower = tw >= 7 || spare >= 9;
    const nh = 3;
    const ta = H >= 22 ? 4 : 3;
    const chh = H >= 18 ? 5 : 4;
    const ty = T + chh + Math.floor(random() * 2);
    const ext = Math.max(3, Math.min(6, Math.floor((nx - L) * 0.5)));
    for (let y = T; y <= B; y++) for (let x = L; x <= R; x++) zone[at(x, y)] = x < nx ? 1 : x >= nx + nw ? 2 : -2;
    const crossing = [
      ...cellsOf({ x: nx - ext, y: ty, w: ext, h: ta }),
      ...cellsOf({ x: nx + nw, y: ty, w: ext, h: ta }),
    ];
    const naveRect = { x: nx, y: T + chh, w: nw, h: H - nh - chh };
    fixed.push({
      kind: "hall",
      cells: [...cellsOf(naveRect), ...crossing],
      on: onGround,
      claim: (room) => SITE_HALL_ROOMS.has(room.name),
      room: { name: "Nave", use: "holders", size: 3, zone: "public", furniture: [T] },
    });
    // The choir: the stalls facing each other across it, through a wide arch from the crossing.
    fixed.push({
      kind: "room",
      cells: cellsOf({ x: nx, y: T, w: nw, h: chh }),
      on: onGround,
      claim: (room) => room.name === "Choir",
      room: { name: "Choir", use: "quiet", size: 2, zone: "private", furniture: [PEW] },
      arch: true,
    });
    fixed.push({
      kind: "hall",
      cells: cellsOf({ x: nx, y: T, w: nw, h: H - nh }),
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
    // The apse: the sanctuary, its altar, rounded at its far end.
    const aw = nw - 2;
    const ad = 4;
    const apse = cellsOf({ x: cx - Math.floor(aw / 2), y: T - ad - 1, w: aw, h: ad }, (x, y) => {
      const fromEnd = y - (T - ad - 1);
      const half = Math.floor(aw / 2);
      return fromEnd >= 2 || Math.abs(x - cx) <= half - (2 - fromEnd);
    });
    groundOnly = apse;
    fixed.push({
      kind: "apse",
      cells: apse,
      on: onGround,
      claim: (room) => room.name === "Sanctuary",
      room: { name: "Apse", use: "quiet", size: 1, zone: "private", furniture: [ALTAR] },
      arch: true,
    });
    const room = left ? nx - L : R - (nx + nw - 1);
    const lo = ty + ta + 1;
    // The garth as big as leaves an outer range four deep and the refectory four deep across the front;
    // failing the range, the garth alone.
    const ranged = Math.min(7, room - 7, B - lo - 6) >= 3;
    const gs = ranged ? Math.min(7, room - 7, B - lo - 6) : Math.min(7, room - 3, B - lo - 2);
    if (gs >= 3) {
      const span = gs + 2;
      const wx = left ? nx - 1 - span : nx + nw + 1;
      const wy = lo;
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
      // The outer range off the walk: the chapter house nearer the church, the dorter past it.
      if (ranged) {
        const ox = left ? L : wx + span;
        const ow = left ? wx - L : R - (wx + span) + 1;
        const split = Math.ceil(span * 0.55);
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: ox, y: wy, w: ow, h: split }),
          on: onGround,
          claim: (each) => each.name === "Chapter house",
          room: { name: "Chapter house", use: "quiet", size: 2, zone: "service", furniture: [PEW, LECTERN] },
        });
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: ox, y: wy + split, w: ow, h: span - split }),
          on: onGround,
          claim: (each) => /^Monks' cells/u.test(each.name),
          room: { name: "Monks' cells", use: "holders", size: 2, zone: "guest", furniture: [BED] },
        });
        // The refectory across the front of the cloister, the walk's whole width and the range's.
        const fy0 = wy + span;
        fixed.push({
          kind: "room",
          cells: cellsOf({ x: left ? L : wx, y: fy0, w: span + ow, h: B - fy0 + 1 }),
          on: onGround,
          claim: (each) => each.name === "Refectory",
          room: { name: "Refectory", use: "holders", size: 2, zone: "service", furniture: [T, T] },
        });
        for (const c of cellsOf({ x: left ? L : wx, y: wy, w: span + ow, h: B - wy + 1 })) zone[c] = -2;
      }
    }
    backAt = { x: left ? nx - 3 : nx + nw + 2, y: ty + ta + 1 };
    // The bell tower: one square tower at the front corner beside the narthex, on the side away from the
    // cloister, its base a room of its own (all five testers 2026-11-17: a walled box in the nave reads as
    // a broken wall). Failing the room for it, over the west end as before.
    if (sideTower) {
      // Five square in the outer corner, a side chapel's room left between it and the nave; else against
      // the nave and out to the outer wall, so no strip of a room is left beside it (round 21 2026-11-17).
      const square = spare >= 9;
      const tx = square ? (left ? R - tw + 1 : L) : left ? nx + nw + 1 : nx - 1 - tw;
      const tyy = B - tw + 1;
      const base = square
        ? cellsOf({ x: tx, y: tyy, w: tw, h: tw })
        : cellsOf({ x: left ? tx : L, y: tyy, w: left ? R - tx + 1 : nx - 1 - L, h: tw });
      fixed.push({
        kind: "room",
        cells: base,
        on: onGround,
        room: { name: "Tower base", use: "post", size: 2, zone: "public", furniture: [CRATE] },
      });
      for (const c of base) zone[c] = -2;
      // The bell chamber as wide inside as the base below it.
      inset = square
        ? { x: tx - 2, y: tyy - 2, w: tw + 4, h: tw + 4 }
        : { x: tx - 1, y: tyy - 1, w: tw + 2, h: tw + 2 };
      mainAt = { x: left ? R - 2 : L + 2, y: tyy - 3 };
    } else {
      mainAt = { x: left ? R - 2 : L + 2, y: B - 3 };
      inset = { x: cx - 5, y: B - 10, w: 11, h: 11 };
    }
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
    // The chapel at the surface is a chapel: its body down the middle from the vestibule to the altar at
    // the far end, a few rooms either side (history panel 2026-11-17: eight rooms in a box, no chapel).
    const cw = W >= 28 ? 7 : 5;
    fixed.push({
      kind: "hall",
      cells: cellsOf({ x: cx - Math.floor(cw / 2), y: T, w: cw, h: H - 4 }),
      on: onGround,
      claim: (room) => room.name === "Mortuary chapel",
      room: { name: "Mortuary chapel", use: "quiet", size: 3, zone: "public", furniture: [0, 2, 7] },
    });
    for (let y = T; y <= B; y++) for (let x = L; x <= R; x++) zone[at(x, y)] = x < cx ? 1 : 2;
    const side = random() < 0.5 ? -1 : 1;
    mainAt = { x: cx + side * (Math.floor(cw / 2) + 3), y: T + 2 + Math.floor(random() * Math.max(1, H / 2)) };
    backAt = { x: cx - side * (Math.floor(cw / 2) + 3), y: T + 2 };
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
  // A room laid down by rule may have a stairwell cut in it; a court, a hall or a walk may not.
  for (const each of fixed)
    if (each.kind !== "room") for (const c of each.cells) for (const d of [0, -1, 1, -mapW, mapW]) taken[c + d] = 1;
  // A stairwell never stands on the wall stair's foot or head.
  const banned = new Uint8Array(mapW * mapH);
  // Nor across a wall walk or a cloister walk, which would cut it in two.
  for (const each of fixed) if (each.kind === "walk") for (const c of each.cells) banned[c] = 1;
  if (wallAt)
    for (const p of [wallAt, wallAt.lower])
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) banned[at(p.x + dx, p.y + dy)] = 2;
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
            if (banned[c] === 2 || (banned[c] === 1 && !loose)) ok = false;
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
          ? // A castle's main stairs all in the one stair of its donjon.
            stairsAt
            ? "main"
            : `main${link.upper % 2}`
          : `${link.kind}${k}`;
    const flip = link.upper % 2 === 1;
    const want = ladder
      ? (stairsAt?.ladder ?? { x: inset.x + inset.w / 2, y: inset.y + inset.h / 2 })
      : link.kind === "servants"
        ? backAt
        : link.kind === "stairs"
          ? stairsAt
            ? stairsAt.main
            : flip
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
            ? kind === "crypt" || plan.levels[link.lower]!.depth < 0
              ? "Hidden stair"
              : "Priest's hole"
            : "Broken floor";
    const group = groups.get(key) ?? { links: [], w, h, want, name };
    group.links.push(k);
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    const levels = [...new Set(group.links.flatMap((k) => [plan.links[k]!.upper, plan.links[k]!.lower]))];
    const r = pick(group.w, group.h, levels, group.want) ??
      pick(2, 2, levels, group.want) ??
      pick(2, 2, levels, group.want, true) ??
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
    // A stair that stands inside a room laid down by rule (the donjon, a tower's base, the hall) is open in
    // that room on the levels the room stands on, not a walled box cut in it (panel round 20 2026-11-17).
    const hosts = fixed.filter(
      (each) => (each.kind === "room" || each.kind === "hall") && cells.every((c) => each.cells.includes(c)),
    );
    fixed.push({
      kind: "stair",
      cells,
      on: (level, index) => levels.includes(index) && !hosts.some((each) => each.on(level, index)),
      room: { name: group.name, use: "post", size: 1, zone: "public", furniture: [] },
    });
  }
  for (const [k, link] of plan.links.entries()) if (link.kind === "wall") linkAt[k] = wallAt ?? { x: cx, y: T + 1 };
  // The front door: in the middle of the front, through the whole outer wall.
  let iy = B;
  for (iy = mapH - 3; iy > 0 && !groundMask[at(doorX, iy)]; iy--);
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
    serviceSide,
    fixed,
    maskOf,
    linkAt,
    door: { x: doorX, y: iy + thick, ix: doorX, iy },
    portcullisAt,
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
  const fixedCount = regions.length;
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
    // A house has its passages more often than not, and always where they make the way round the rooms the
    // household keeps (owner 2026-11-17, "Routes and guard posts").
    random() < (level.depth > 0 ? 0.9 : level.depth === 0 ? 0.85 : 0.6)
  ) {
    const [first, ...rest] = shuffle([...stairsHere]);
    const from = [...touching(first!)];
    // From the front door's hall as well, on the floor it opens onto, so the way in has a passage on.
    // Near the front door, a few steps in from it: the hall the house is entered by is grown there later.
    const door = new Set<number>();
    if (doorIn >= 0) {
      const [dx, dy] = [doorIn % mapW, Math.floor(doorIn / mapW)];
      for (let y = dy - 4; y <= dy - 2; y++)
        for (let x = dx - 2; x <= dx + 2; x++) if (free(cell(x, y))) door.add(cell(x, y));
    }
    const goals = [...rest.map((other) => touching(other)), ...(door.size ? [door] : [])];
    if (goals.length)
      for (const goal of goals) {
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
    // A castle's dungeons run out under its whole ward, not a knot of cells by the stair (panel 2026-11-17).
    const want = (kind === "keep" ? 5 : 2) + plan.wealth;
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
    // A crypt's galleries close a loop or two, a short cut through the rock between two of them far apart
    // along the galleries, so there is more than one way round (panel round 29: single paths).
    if (kind === "crypt" && corridor >= 0)
      for (let loops = 0, tries = 0; loops < 1 + Math.floor(plan.wealth / 2) && tries < 80; tries++) {
        const lane: number[] = [];
        for (let c = 0; c < size; c++) if (at[c] === corridor) lane.push(c);
        const a = lane[Math.floor(random() * lane.length)]!;
        const b = lane[Math.floor(random() * lane.length)]!;
        const span = Math.abs((a % mapW) - (b % mapW)) + Math.abs(Math.floor(a / mapW) - Math.floor(b / mapW));
        if (span < 5 || span > 14) continue;
        const along = new Int32Array(size).fill(-1);
        along[a] = 0;
        const queue = [a];
        for (let head = 0; head < queue.length && along[b]! < 0; head++)
          for (const n of around(queue[head]!))
            if (along[n]! < 0 && at[n] === corridor) {
              along[n] = along[queue[head]!]! + 1;
              queue.push(n);
            }
        if (along[b]! >= 0 && along[b]! < span * 2.5) continue;
        const from = around(a).filter((n) => free(n) && !hold[n]);
        const way = from.length ? route(from, (c) => around(c).includes(b)) : null;
        if (!way || way.length > span + 6) continue;
        lay(way);
        loops++;
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
  const scale = Math.max(0.6, Math.min(rock ? 1.6 : 1.35, room / (sum * (rock ? 1 : 1.15))));
  const growers: number[] = [];
  const add = (r: SitePlanRoom, target: number, hidden = false) => {
    growers.push(regions.length);
    regions.push({ kind: "room", room: r, target, zone: -1, ...(hidden ? { hidden: true as const } : {}) });
  };
  // A castle's cells are cells, two by three off the gallery, not chambers (panel 2026-11-17).
  const cellLike = (r: SitePlanRoom) => rock && kind === "keep" && /^(Cell|Oubliette)\b/u.test(r.name);
  // In rock a chamber starts big enough to stay a chamber once its walls are cut: a vault grown to a dozen
  // cells came out a two-wide sliver and was merged away (round 29: Upper burials kept 128 of 176 rooms).
  for (const r of planned) add(r, cellLike(r) ? 10 : Math.max(rock ? 36 : 0, Math.round(weight(r) * scale)));
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
  // A crypt's chapel keeps to a few rooms beside its body.
  const most = kind === "crypt" && !rock ? 6 : 30;
  for (let k = 0; left > (rock ? 22 : 30) && growers.length < most && k < 20; k++) {
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
  // In rock a chamber's seed a course of rock off its gallery, the gallery two cells off.
  const byPass2 = new Uint8Array(size);
  for (let c = 0; c < size; c++) if (byPass[c]) for (const n of around(c)) if (mask[n] && at[n]! < 0) byPass2[n] = 1;
  const apart = (g: number, c: number) => around(c).every((n) => at[n]! < 0 || at[n] === g);
  const nearEdge = new Uint8Array(size);
  for (let c = 0; c < size; c++) if (byOutside[c]) for (const n of around(c)) nearEdge[n] = 1;
  // Near a tower or a gate tower, whose only way in it would take (seed 4 keep: a corner tower walled up
  // behind a secret strongroom).
  const nearTower = new Uint8Array(size);
  for (let c = 0; c < size; c++)
    if (at[c]! >= 0 && regions[at[c]!]!.kind === "tower")
      for (let dy = -4; dy <= 4; dy++)
        for (let dx = -4; dx <= 4; dx++) {
          const [x, y] = [(c % mapW) + dx, Math.floor(c / mapW) + dy];
          if (x >= 0 && y >= 0 && x < mapW && y < mapH) nearTower[y * mapW + x] = 1;
        }
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
        if (rock && !byPass2[c]) s += 30;
        if (rock && !apart(g, c)) s += 40;
        if (kind === "manor" && level.depth === 0 && frame.serviceSide && !(entry && SITE_ENTRY_ROOMS.has(r.name))) {
          const service = SITE_SERVICE_ROOMS.has(siteBaseName(r.name));
          if (service !== ((x < frame.cx ? 1 : 2) === frame.serviceSide)) s += 25;
          // The dining room and the kitchen each against the line between the two sides.
          if (r.name === "Dining room" || r.name === "Kitchen") s += Math.abs(x - frame.cx) * 0.4;
        }
        if (region.hidden && !nearEdge[c]) s += 2;
        if (region.hidden && nearTower[c]) s += 6;
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
    if (cellLike(r)) return 2;
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
  // In rock a chamber is cut where there is rock to cut, whatever band it lies in (panel 2026-11-17: a castle's
  // dungeons came out as five rooms in a field of rock).
  // In rock a chamber keeps a course of rock between it and every other space, so cutting the walls never
  // eats it down to a sliver merged away (round 29: Upper burials kept 128 of the 176 rooms planned).
  const takes = (g: number, c: number) => free(c) && (rock ? apart(g, c) : zoneOf(c) === regions[g]!.zone);
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

  // The line between two rooms runs straight: a cell of one tucked into the corner of another (a step down
  // their shared wall, a notch) goes over to it, always the same way between the same two, until the line is
  // square (gamer panel 2026-11-17: stepped walls read as stubs and broken partitions).
  if (!rock) {
    const plain = (g: number) => g >= 0 && regions[g]!.kind === "room" && !regions[g]!.hidden;
    const count = new Map<number, number>();
    for (let c = 0; c < size; c++) if (at[c]! >= 0) count.set(at[c]!, (count.get(at[c]!) ?? 0) + 1);
    const winner = new Map<string, number>();
    for (let pass = 0, changed = true; changed && pass < 60; pass++) {
      changed = false;
      for (let c = mapW + 1; c < size - mapW - 1; c++) {
        const g = at[c]!;
        if (!plain(g) || hold[c]) continue;
        const x = c % mapW;
        if (x === 0 || x === mapW - 1) continue;
        const [n, s, w, e] = [at[c - mapW]!, at[c + mapW]!, at[c - 1]!, at[c + 1]!];
        for (const h of new Set([n, s, w, e])) {
          if (h === g || !plain(h)) continue;
          const k = [n, s, w, e].filter((v) => v === h).length;
          const vert = n === h ? -mapW : s === h ? mapW : 0;
          const hor = w === h ? -1 : e === h ? 1 : 0;
          if (k < 2 || (k === 2 && (!vert || !hor))) continue;
          if (k === 2) {
            // Never so as to cut the room in two: the cell across the corner from the other is its own.
            if (at[c - vert - hor] !== g) continue;
            const key = g < h ? `${g}:${h}` : `${h}:${g}`;
            if (!winner.has(key))
              winner.set(key, count.get(h)! / regions[h]!.target < count.get(g)! / regions[g]!.target ? h : g);
            if (winner.get(key) !== h) continue;
          }
          if (count.get(g)! <= Math.max(9, 0.7 * regions[g]!.target)) continue;
          at[c] = h;
          count.set(g, count.get(g)! - 1);
          count.set(h, count.get(h)! + 1);
          changed = true;
          break;
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
      // A cloister walk opens on its garth along its whole length: no wall between them (round 21
      // 2026-11-17: the walk's wall ate the garth down to one cell).
      const pair = [regions[at[c]!]!.kind, regions[at[n]!]!.kind];
      if (pair.includes("walk") && pair.includes("court")) continue;
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
    if (
      !cells?.length ||
      region.kind !== "room" ||
      region.hidden ||
      region.room?.heart ||
      cellLike(region.room!) ||
      // A room the frame laid down by rule (a buttery, a choir) stays as it was laid.
      region.zone === -1
    )
      continue;
    if (entry && SITE_ENTRY_ROOMS.has(region.room!.name)) continue;
    const main = biggestBox(cells);
    // Three wide counts too when it runs four times as long: a 13x3 dining room is a corridor (round 21).
    if (!main || Math.min(main.w, main.h) > 3 || (Math.min(main.w, main.h) === 3 && Math.max(main.w, main.h) < 12))
      continue;
    // In rock a narrow vault cut between galleries is a vault still, a row of burial niches, and keeps its
    // name rather than vanish into its neighbour (round 29: crypts' planned vaults lost).
    if (rock && Math.min(main.w, main.h) >= 2 && cells.length >= 10) continue;
    const between = new Map<number, number[]>();
    for (const c of cells)
      for (const d of [1, -1, mapW, -mapW]) {
        const w = c + d;
        const far = w + d;
        if (far < 0 || far >= size || ground[w] !== "wall" || hold[w] || !mask[w]) continue;
        const h = at[far]!;
        if (h < 0 || h === g || ground[far] !== "floor" || !cellsBy.has(h)) continue;
        if ((regions[h]!.kind !== "room" && (regions[h]!.kind !== "pass" || cells.length > 32)) || regions[h]!.hidden)
          continue;
        between.set(h, [...(between.get(h) ?? []), w]);
      }
    // Into a room beside it, failing that (a scrap) into the corridor it opens on, which widens.
    const best = [...between].sort(
      (p, q) =>
        Number(regions[q[0]]!.kind === "room") - Number(regions[p[0]]!.kind === "room") || q[1].length - p[1].length,
    )[0];
    if (!best || best[1].length < 2) continue;
    const [h, walls] = best;
    // The one that stays is the bigger; a planned room keeps its name over a made-up one.
    const keep = regions[h]!.kind === "pass" || cellsBy.get(h)!.length >= cells.length ? h : g;
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
  // A small thin limb off a room (two wide or less, a few cells, hanging off its body: a kitchen's tail down
  // beside the gate) is walled up, so a room is its body and not its body and a spill (panel 2026-11-17).
  if (!rock)
    for (const [g, cells] of cellsBy) {
      const region = regions[g]!;
      if (region.kind !== "room" || region.hidden || cells.length < 12) continue;
      const main = biggestBox(cells);
      if (!main || Math.min(main.w, main.h) < 3) continue;
      let rest = cells.filter((c) => !inside(main, c % mapW, Math.floor(c / mapW)));
      const drop: number[] = [];
      while (rest.length) {
        const b = biggestBox(rest)!;
        const part = rest.filter((c) => inside(b, c % mapW, Math.floor(c / mapW)));
        const byShell = part.some((c) =>
          [1, -1, mapW, -mapW, 2, -2, 2 * mapW, -2 * mapW].some((d) => c + d >= 0 && c + d < size && !mask[c + d]),
        );
        const thin = Math.min(b.w, b.h) <= 1 && b.w * b.h <= 3;
        const limb = kind === "keep" && byShell && Math.min(b.w, b.h) <= 2 && b.w * b.h <= 8;
        if ((thin || limb) && part.every((c) => !hold[c])) {
          // Never so as to cut the room in two.
          const gone = new Set([...drop, ...part]);
          const left = cells.filter((c) => !gone.has(c));
          const set = new Set(left);
          const seen = new Set([left[0]]);
          const queue = [left[0]!];
          for (let head = 0; head < queue.length; head++)
            for (const n of around(queue[head]!))
              if (set.has(n) && !seen.has(n)) {
                seen.add(n);
                queue.push(n);
              }
          if (seen.size === left.length) drop.push(...part);
        }
        rest = rest.filter((c) => !inside(b, c % mapW, Math.floor(c / mapW)));
      }
      if (!drop.length) continue;
      for (const c of drop) {
        ground[c] = "wall";
        at[c] = -1;
      }
      const gone = new Set(drop);
      cellsBy.set(
        g,
        cells.filter((c) => !gone.has(c)),
      );
    }
  // Last, a notch of wall mass (a cell in a two-by-two of wall that two sides of one space close round) is
  // that space's again, cell by cell, so no blobs of black stand between rooms (panel round 20 2026-11-17).
  if (!rock)
    for (let changed = true; changed;) {
      changed = false;
      for (let c = mapW + 1; c < size - mapW - 1; c++) {
        if (ground[c] !== "wall" || !mask[c] || hold[c]) continue;
        const mass = [
          [1, mapW],
          [-1, mapW],
          [1, -mapW],
          [-1, -mapW],
        ].some(([dx, dy]) => [c + dx!, c + dy!, c + dx! + dy!].every((n) => ground[n] === "wall" && mask[n]));
        if (!mass) continue;
        const open = around(c).filter((n) => ground[n] !== "wall");
        const owners = new Set(open.map((n) => at[n]!));
        if (owners.size !== 1 || open.length < 2) continue;
        const g = [...owners][0]!;
        if (g < 0 || !cellsBy.has(g) || !["room", "pass", "hall", "entry"].includes(regions[g]!.kind)) continue;
        if (regions[g]!.hidden) continue;
        const x = c % mapW;
        const corners = [c - mapW - 1, c - mapW + 1, c + mapW - 1, c + mapW + 1].filter(
          (n) => Math.abs((n % mapW) - x) === 1,
        );
        if (corners.some((n) => ground[n] !== "wall" && at[n] !== g)) continue;
        ground[c] = "floor";
        at[c] = g;
        cellsBy.get(g)!.push(c);
        changed = true;
      }
    }
  // Thin walls (owner 2026-11-17, "Thin walls everywhere"): a wall two or more thick between two spaces
  // inside the building is one thick, the space beside it taking the near course along its whole side, so
  // rooms stay square; the outer shell, the towers, the donjon and the stairwells keep their thickness.
  if (!rock && !level.inset)
    for (let pass = 0, changed = true; changed && pass < 4; pass++) {
      changed = false;
      for (const [g, cells] of cellsBy) {
        const region = regions[g]!;
        if (g < fixedCount || region.hidden || !["room", "hall", "pass", "entry"].includes(region.kind)) continue;
        for (const d of [-mapW, mapW, -1, 1]) {
          const e = Math.abs(d) === 1 ? mapW : 1;
          // The room's cells on this side, by the line they stand on.
          const lines = new Map<number, number[]>();
          for (const c of cells) {
            if (at[c] !== g || ground[c] !== "floor") continue;
            const n = c + d;
            if (n < 0 || n >= size || (Math.abs(d) === 1 && Math.floor(n / mapW) !== Math.floor(c / mapW))) continue;
            if (ground[n] !== "wall") continue;
            const key = Math.abs(d) === 1 ? c % mapW : Math.floor(c / mapW);
            lines.set(key, [...(lines.get(key) ?? []), c]);
          }
          for (const run of lines.values()) {
            // The whole side of the room on that line, or nothing: no jogs.
            const sideLen = cells.filter(
              (c) =>
                at[c] === g &&
                (Math.abs(d) === 1 ? c % mapW === run[0]! % mapW : Math.floor(c / mapW) === Math.floor(run[0]! / mapW)),
            ).length;
            if (run.length < 2 || run.length !== sideLen) continue;
            const strip = run.map((c) => c + d);
            const ok = strip.every((m) => {
              const beyond = m + d;
              if (!mask[m] || hold[m] || ground[m] !== "wall" || (at[m]! >= 0 && at[m] !== g)) return false;
              if (beyond < 0 || beyond >= size || ground[beyond] !== "wall") return false;
              // Never so as to meet another space at the strip's sides or across a corner.
              for (const side of [m + e, m - e, beyond + e, beyond - e])
                if (side >= 0 && side < size && ground[side] !== "wall" && at[side] !== g) return false;
              return true;
            });
            if (!ok) continue;
            for (const m of strip) {
              ground[m] = "floor";
              at[m] = g;
              cells.push(m);
            }
            changed = true;
          }
        }
      }
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
  // Over again while any is reached, so a space boxed in by another that was itself cut off gets its turn
  // once that one joins (round 29: a crypt's burial hall walled up inside its own gallery's loop).
  for (let reached = true; reached;) {
    reached = false;
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
          if (
            ground[m] === "floor" &&
            at[m]! >= 0 &&
            inTree.has(at[m]!) &&
            !hiddenNode(at[m]!) &&
            !lockedNode(at[m]!)
          ) {
            back[m] = c;
            found = m;
            break;
          }
          // Through one course of wall outside the plan with the plan again beyond it (a tower through the
          // curtain it stands on; a kitchen through the line between the back range and the ward, its only
          // neighbours locked: round 25 keep 1), never further out.
          const beyond = m + (m - c);
          const curtain =
            !mask[m] && mask[c] === 1 && beyond >= 0 && beyond < size && !!mask[beyond] && ground[m] === "wall";
          // A passage already cut (floor of no space's) is followed on to whatever it reached.
          if ((!mask[m] && !curtain) || hold[m] || (ground[m] === "floor" && at[m]! >= 0)) continue;
          back[m] = c;
          queue.push(m);
        }
      }
      if (found < 0) continue;
      const via = at[found]!;
      for (let c = back[found]!; c >= 0 && back[c] !== -1; c = back[c]!) ground[c] = "floor";
      inTree.add(n);
      depth[n] = depth[via]! + 1;
      reached = true;
    }
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
      ([m, room]) =>
        regions[m]!.kind === "room" && !regions[m]!.hidden && regions[m]!.zone !== -1 && !level.rooms.includes(room),
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
  // The heart behind a locked door where it is a room at the end of its way, its key kept by the holders
  // elsewhere on the floor (panel round 31: no locks and keys).
  for (const [n, room] of owner)
    if (room.heart && !room.locked && degree[n] === 1 && !hasLink(n) && n !== start)
      owner.set(n, { ...room, locked: true });
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
    const chance = edge.a === court || edge.b === court ? 0.6 : passages2 === 2 ? 0.6 : passages2 === 1 ? 0.12 : 0.55;
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
    if (pool2.length && random() < 0.85) openEdge(pool2[Math.floor(random() * pool2.length)]!, false);
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
  // ── The quiet way (owner 2026-11-17, "Routes and guard posts") ──
  let postRegion = -1;
  let wayTargetRegion = -1;
  // From where the party comes onto the floor to the way on there is the main way, and the holders keep a room
  // on it; where no second way misses the main way's rooms, a door is opened to make one, so a careful party
  // can go round (a door between two spaces either side of it, or two doors through a space between).
  {
    const near = new Map<number, number[]>();
    for (const edge of opened) {
      near.set(edge.a, [...(near.get(edge.a) ?? []), edge.b]);
      near.set(edge.b, [...(near.get(edge.b) ?? []), edge.a]);
    }
    const reach = (from: number, blocked: Set<number>) => {
      const prev = new Map<number, number>([[from, -1]]);
      const queue = [from];
      for (let head = 0; head < queue.length; head++)
        for (const m of near.get(queue[head]!) ?? [])
          if (!prev.has(m) && !blocked.has(m) && !hiddenNode(m) && !lockedNode(m)) {
            prev.set(m, queue[head]!);
            queue.push(m);
          }
      return prev;
    };
    const all = reach(start, new Set());
    const hops = (n: number) => {
      let k = 0;
      for (let m = n; m >= 0; m = all.get(m)!) k++;
      return k;
    };
    // The way on, else (a top or bottom floor) the heart, else the space farthest in.
    const heartRegion = [...all.keys()].find((n) => owner.get(n)?.heart);
    const target =
      links
        .map((link) => at[cell(link.x, link.y)]!)
        .filter((n) => n >= 0 && n !== start && all.has(n))
        .sort((p, q) => hops(q) - hops(p))[0] ??
      (heartRegion !== undefined && heartRegion !== start
        ? heartRegion
        : [...all.keys()].filter((n) => n !== start).sort((p, q) => hops(q) - hops(p))[0]);
    if (target !== undefined && !level.inset) {
      // The rooms that can be held across the way: not the gate (there is one way in) nor the heart.
      const held = (n: number) =>
        ["room", "hall", "tower"].includes(regions[n]!.kind) &&
        !owner.get(n)?.heart &&
        owner.get(n)?.use !== "quiet" &&
        !/^(Gatehouse|Gate tower)$/u.test(siteBaseName(owner.get(n)?.name ?? ""));
      const inner = new Set<number>();
      for (let m = all.get(target)!; m >= 0 && m !== start; m = all.get(m)!) if (held(m)) inner.add(m);
      // One room on the main way the holders can keep with a way round it is enough: the first that has one
      // already, else the first a door or a short passage can give one.
      const order = [...inner];
      const roundOne = (r: number) => {
        const lone = new Set([r]);
        if (reach(start, lone).has(target)) return true;
        const fromStart = reach(start, lone);
        const fromTarget = reach(target, lone);
        const usable = (n: number) => live(n) && !lockedNode(n) && n !== r;
        const one = edges
          .filter(
            (edge) =>
              !opened.has(edge) &&
              usable(edge.a) &&
              usable(edge.b) &&
              ((fromStart.has(edge.a) && fromTarget.has(edge.b)) || (fromStart.has(edge.b) && fromTarget.has(edge.a))),
          )
          .sort((p, q) => q.cells.length - p.cells.length)[0];
        if (one) {
          openEdge(one, false);
          return true;
        }
        // A short passage cut through the wall from one side to the other, never opening into the room itself.
        const touchesR = (c: number) => around(c).some((m) => at[m] === r && ground[m] === "floor");
        const costTo = new Int32Array(size).fill(1 << 20);
        const back = new Int32Array(size).fill(-1);
        const queue: number[] = [];
        for (let c = 0; c < size; c++)
          if (ground[c] === "floor" && at[c]! >= 0 && fromStart.has(at[c]!)) {
            costTo[c] = 0;
            queue.push(c);
          }
        let goal = -1;
        for (let head = 0; head < queue.length; head++) {
          const c = queue[head]!;
          if (costTo[c]! > 6) continue;
          if (ground[c] === "floor" && at[c]! >= 0 && fromTarget.has(at[c]!)) {
            goal = c;
            break;
          }
          for (const m of around(c)) {
            const open =
              ground[m] === "floor" && at[m] !== r && !(at[m]! >= 0 && (hiddenNode(at[m]!) || lockedNode(at[m]!)));
            const cut = ground[m] === "wall" && mask[m] && !hold[m] && !touchesR(m);
            if (!open && !cut) continue;
            const next = costTo[c]! + (cut ? 1 : 0);
            if (next >= costTo[m]!) continue;
            costTo[m] = next;
            back[m] = c;
            if (cut) queue.push(m);
            else queue.splice(head + 1, 0, m);
          }
        }
        if (goal < 0) return false;
        for (let c = goal; c >= 0; c = back[c]!) if (ground[c] === "wall") ground[c] = "floor";
        return true;
      };
      for (const r of order)
        if (roundOne(r)) {
          postRegion = r;
          wayTargetRegion = target;
          break;
        }
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
  const roomOfRegion = new Map<number, number>();
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
    info.push({
      name: room.name,
      use: room.use,
      ...(room.heart ? { heart: true as const } : {}),
      ...(n === postRegion ? { post: true as const } : {}),
    });
    roomOfRegion.set(n, k);
    doors.push(door && n !== court ? { ...door, room: k, locked: !!room.locked && n !== start } : null);
    opens.push(side);
    // A great room's pillars: two rows of them down a big one, clear of its doors and links. Below ground a
    // vault is carried on piers in bays every third cell both ways, not two arcades round an empty middle
    // (panel rounds 39-40: undercrofts and cellaria a dark void).
    const vaultedBelow =
      level.depth < 0 &&
      plan.template !== "crypt" &&
      Math.min(r.w, r.h) >= 5 &&
      Math.max(r.w, r.h) >= 8 &&
      /undercroft|cellarium|vault|cistern|cellar/iu.test(room.name);
    if (vaultedBelow) {
      const vertical = r.h > r.w;
      const short = vertical ? r.w : r.h;
      for (let off = 2; off <= short - 3; off += 3)
        for (let along = 2; along < (vertical ? r.h : r.w) - 2; along += 3) {
          const [x, y] = vertical ? [r.x + off, r.y + along] : [r.x + along, r.y + off];
          if (links.some((link) => link.x === x && link.y === y)) continue;
          if (
            [
              [x - 1, y],
              [x + 1, y],
              [x, y - 1],
              [x, y + 1],
            ].some(([dx, dy]) => ground[cell(dx!, dy!)] === "floor" && !inside(r, dx!, dy!))
          )
            continue;
          props[cell(x, y)] = COLUMN;
        }
    } else if (SITE_HALL_ROOMS.has(room.name) && plan.template !== "manor" && r.w >= 7 && r.h >= 7) {
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
  // A priest's hole is shut behind hidden doors: the ways into its well drawn as wall, walked through.
  for (const [n, region] of regions.entries()) {
    if (region.kind !== "stair" || region.room?.name !== "Priest's hole") continue;
    const own = new Set(cellsBy.get(n) ?? []);
    const ways = [...new Set([...own].flatMap(around))].filter(
      (c) => !own.has(c) && ground[c] === "floor" && props[c] === -1,
    );
    // Only where it is walled in with a door or two, not standing open in a room.
    if (ways.length && ways.length <= 2)
      for (const c of ways) {
        props[c] = DUNGEON_SECRET_DOOR_PROP;
        secrets.push({ x: c % mapW, y: Math.floor(c / mapW) });
      }
  }
  // The keep's portcullis hangs raised over the gate passage: drawn, walked under.
  if (frame.portcullisAt && level.depth === 0 && !level.inset)
    for (let k = 0; k < frame.portcullisAt.w; k++) {
      const i = cell(frame.portcullisAt.x + k, frame.portcullisAt.y);
      if (ground[i] === "floor" && props[i] === -1) props[i] = DUNGEON_PORTCULLIS_PROP;
    }
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
  // Each lock's key room, once the locks are set: reached without going through any locked door.
  const keyRooms: SiteRect[] = [];
  // The way round the holders' post, once laid: from the way in to the way on without entering the post.
  const wayTo =
    wayTargetRegion >= 0 ? (cellsBy.get(wayTargetRegion) ?? []).find((c) => ground[c] === "floor") : undefined;
  const round = (trace = false) => {
    if (postRegion < 0 || wayTo === undefined) return null;
    const begin = cell(entrance.x, entrance.y);
    const prev = new Int32Array(ground.length).fill(-2);
    prev[begin] = -1;
    const queue = [begin];
    for (let head = 0; head < queue.length; head++) {
      const c = queue[head]!;
      const x = c % mapW;
      for (const n of [c - 1, c + 1, c - mapW, c + mapW]) {
        if (
          n < 0 ||
          n >= ground.length ||
          prev[n] !== -2 ||
          (n === c - 1 && x === 0) ||
          (n === c + 1 && x === mapW - 1)
        )
          continue;
        if (ground[n] !== "floor" || at[n] === postRegion) continue;
        if (props[n] !== -1 && props[n] !== DUNGEON_EXIT_PROP && props[n] !== DUNGEON_PORTCULLIS_PROP) continue;
        prev[n] = c;
        queue.push(n);
      }
    }
    if (prev[wayTo] === -2) return null;
    if (!trace) return [];
    const path: number[] = [];
    for (let c = wayTo; c >= 0; c = prev[c]!) path.push(c);
    return path;
  };
  const reachable = () => {
    const begin = cell(entrance.x, entrance.y);
    const seen = new Uint8Array(ground.length);
    const queue = [begin];
    seen[begin] = 1;
    const spread = (locks: boolean) => {
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
              props[n] !== DUNGEON_PORTCULLIS_PROP &&
              (props[n] !== SITE_LOCK_PROP || !locks) &&
              props[n] !== DUNGEON_SECRET_DOOR_PROP)
          )
            continue;
          seen[n] = 1;
          queue.push(n);
        }
      }
    };
    spread(false);
    const keys = keyRooms.every((r) => {
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (seen[cell(x, y)]) return true;
      return false;
    });
    if (!keys) return false;
    for (let c = 0; c < ground.length; c++) if (seen[c]) queue.push(c);
    spread(true);
    return (
      ground.every(
        (g, i) =>
          g !== "floor" ||
          seen[i] ||
          (props[i] !== -1 && props[i] !== DUNGEON_EXIT_PROP && props[i] !== DUNGEON_PORTCULLIS_PROP),
      ) &&
      // Nothing set down blocks the way round the holders' post.
      (!keepRound || round() !== null)
    );
  };
  const keepRound = round() !== null;
  // Water that cuts a room off is drained.
  if (level.flooded && !reachable())
    for (let i = 0; i < ground.length; i++) if (ground[i] === "liquid") ground[i] = "floor";
  // Locks: a locked room's door; its key in another room of the level that is open.
  const locks: SiteLevelLock[] = [];
  for (const door of doors) if (door?.locked) props[cell(door.x, door.y)] = SITE_LOCK_PROP;
  // A key only in a room reached without going through a locked door (a room behind a locked room is not).
  const keyFree = new Uint8Array(ground.length);
  {
    const begin = cell(entrance.x, entrance.y);
    const queue = [begin];
    keyFree[begin] = 1;
    for (let head = 0; head < queue.length; head++) {
      const c = queue[head]!;
      const x = c % mapW;
      for (const n of [c - 1, c + 1, c - mapW, c + mapW]) {
        if (n < 0 || n >= ground.length || keyFree[n] || (n === c - 1 && x === 0) || (n === c + 1 && x === mapW - 1))
          continue;
        if (ground[n] !== "floor" || props[n] === SITE_LOCK_PROP) continue;
        keyFree[n] = 1;
        queue.push(n);
      }
    }
  }
  const open = rooms
    .map((_, n) => n)
    .filter((n) => {
      if (doors[n]?.locked || hiddenRooms.has(n)) return false;
      const r = rooms[n]!;
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (keyFree[cell(x, y)]) return true;
      return false;
    });
  for (const door of doors) {
    if (!door?.locked || !open.length) continue;
    // The heart's key where its holders keep the way, else in a room they live in, else anywhere open.
    const keepers = info[door.room]?.heart
      ? [
          open.filter((n) => info[n]?.post),
          open.filter((n) => info[n]?.use === "holders" || info[n]?.use === "post"),
        ].find((list) => list.length)
      : undefined;
    const choices = keepers ?? open;
    locks.push({ x: door.x, y: door.y, room: door.room, key: choices[Math.floor(random() * choices.length)]! });
    keyRooms.push(rooms[locks[locks.length - 1]!.key]!);
  }
  // Furniture against each room's back wall (the one facing its door), then rubble in ruined rooms;
  // never closing a way.
  const doorCells = new Set(doors.flatMap((door) => (door ? [cell(door.x, door.y)] : [])));
  // A scene or two a floor, a few things together that tell what happened here (gamer panel 2026-11-17).
  // The room on a floor whose corner has fallen in, now and then: not the heart, a stair or a hidden room.
  const fallen = (() => {
    const fit = [...roomOf].filter(
      ([room, n]) =>
        room.use !== "open" &&
        !room.heart &&
        !hiddenRooms.has(n) &&
        !SITE_STAIR_ROOMS.has(siteBaseName(room.name)) &&
        rooms[n]!.w * rooms[n]!.h >= 30,
    );
    return fit.length && random() < 0.6 ? fit[Math.floor(random() * fit.length)]![1] : -1;
  })();
  const scenes = new Set(
    [...roomOf]
      .filter(
        ([room, n]) =>
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
    // A hall's high end is one of its short walls, so its long boards run down the hall away from the dais,
    // not alongside it (history panel 2026-11-17).
    const hallEnd = SITE_FEAST_ROOMS.has(siteBaseName(room.name)) && Math.max(area.w, area.h) >= 6;
    const ends = area.w >= area.h ? (["W", "E"] as const) : (["N", "S"] as const);
    const back = hallEnd
      ? side && (ends as readonly string[]).includes(side)
        ? facing[side]
        : ends[Math.floor(random() * 2)]!
      : side
        ? facing[side]
        : "N";
    const front = hallEnd ? facing[back] : (side ?? "S");
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
    // Not every hall sets its tables the same way: one long board, or two down either side of a clear
    // middle; a crypt's tombs one row down the middle, rarely two (panel 2026-11-17: halls all alike,
    // sarcophagi parked in rows).
    const twin = short >= 7 && (feast ? random() < 0.5 : plan.template !== "crypt" || random() < 0.3);
    const lines = twin ? [Math.floor(short / 3), short - 1 - Math.floor(short / 3)] : [Math.floor((short - 1) / 2)];
    const breakAt = Math.floor(random() * 3);
    const middle: Array<[number, number]> = [];
    for (const line of lines)
      for (let k = short >= 3 ? 1 : 0; k < (short >= 3 ? long - 1 : long); k += feast || long < 5 ? 1 : 2)
        // A long board is broken every few places, so a hall has tables, not one endless row.
        if (!feast || (k + breakAt) % 5 !== 0) middle.push(along ? [x0 + k, y0 + line] : [x0 + line, y0 + k]);
    // A crypt's burial rooms half the time lay their dead in niches along the walls instead.
    const niches = plan.template === "crypt" && !room.heart && random() < 0.5;
    const pillars: Array<[number, number]> = [];
    if (short >= 5) for (let y = y0 + 1; y < y1; y += 3) for (let x = x0 + 1; x < x1; x += 3) pillars.push([x, y]);
    // A big burial room is vaulted in bays: piers every third cell, a tomb in the middle of every other bay,
    // so the dead lie among the piers with ways round them, not parked along the walls (panel round 20
    // 2026-11-17: no cover, sarcophagi in parking rows).
    const bays: Array<[number, number]> = [];
    const vaulted =
      plan.template === "crypt" &&
      !room.heart &&
      short >= 5 &&
      long >= 7 &&
      room.furniture.includes(0) &&
      !/chapel|stair|vestibule/iu.test(room.name);
    if (vaulted)
      for (let y = y0 + 2, j = 0; y < y1; y += 3, j++)
        for (let x = x0 + 2, i = 0; x < x1; x += 3, i++) if ((i + j) % 2 === 0 || random() < 0.25) bays.push([x, y]);
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
    // A castle's ward has its heaps out in the yard, a cart and its crates in each quarter, as cover to
    // fight round, clear of the cobbled ways across it (panel 2026-11-17: props pushed into the corners
    // left a bare field).
    const ward = plan.template === "keep" && room.use === "open";
    const [wx, wy] = [x0 + Math.floor((x1 - x0 + 1) / 2), y0 + Math.floor((y1 - y0 + 1) / 2)];
    const quarters: Array<[number, number]> = [
      [Math.round((x0 + wx) / 2), Math.round((y0 + wy) / 2)],
      [Math.round((wx + x1) / 2), Math.round((y0 + wy) / 2)],
      [Math.round((x0 + wx) / 2), Math.round((wy + y1) / 2)],
      [Math.round((wx + x1) / 2), Math.round((wy + y1) / 2)],
    ];
    const clustered = () => {
      const anchor = ward
        ? quarters[Math.floor(random() * quarters.length)]!
        : corners.length
          ? corners[Math.floor(random() * corners.length)]!
          : ([x0, y0] as [number, number]);
      return (ward ? everywhere().filter(([x, y]) => x !== wx && y !== wy) : everywhere()).sort(
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
    // A cell is small but never bare: its straw, its bucket, its chains (panel 2026-11-17).
    let budget = Math.max(/^(Cell|Oubliette)\b/u.test(room.name) ? 4 : 1, Math.floor((area.w * area.h) / 4));
    const tiny = Math.min(area.w, area.h) < 3;
    // What the room is dressed with: its recipe by name where it has one (gamer panel 2026-11-17: a
    // kitchen has its range and barrels, a nave its pews), else its plan's furniture by slot.
    const recipe = (plan.template === "crypt" ? undefined : SITE_RECIPES[siteBaseName(room.name)])?.filter(
      // The ward's well is in its well house where it has one.
      ([slot]) => !(slot === WELL && room.use === "open" && info.some((each) => each.name === "Well house")),
    );
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
                    : // Heaps in the corners grow a little with the room, never into a fringe down its walls
                      // (panel round 41: a big undercroft's crates and skulls lined every wall).
                      Math.min(kind === "corner" ? 2 : Infinity, Math.max(1, Math.floor((area.w * area.h) / 40)))),
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
    // A hand-drawn plan for the room where one is drawn for its kind and size: every piece where the plan
    // puts it, turned to face the door (owner's call 2026-11-17: set-piece rooms by hand).
    let stamped = false;
    {
      const deepAlong = back === "N" || back === "S";
      const [across, deep] = deepAlong ? [area.w, area.h] : [area.h, area.w];
      const grids = siteStampsFor(siteBaseName(room.name))
        .map((each) => siteStampStretch(each, across, deep))
        .filter((grid): grid is string[] => !!grid);
      if (!tiny && grids.length && !hiddenRooms.has(n) && random() < 0.9) {
        const grid = grids[Math.floor(random() * grids.length)]!;
        const flip = random() < 0.5;
        let drawn = 0;
        for (let r = 0; r < deep; r++)
          for (let c = 0; c < across; c++) {
            // A crypt's tile pack has no altar: its altar is a tomb, the altar tomb of a mortuary chapel.
            const raw = SITE_STAMP_LEGEND[grid[r]![c]!];
            // Its loose bones are the pack's skeletons; what else it cannot draw is left out.
            const slot =
              plan.template === "crypt" && raw !== undefined && raw > 7
                ? raw === ALTAR
                  ? 0
                  : raw === BONES
                    ? 1
                    : undefined
                : raw;
            if (slot === undefined) continue;
            const k = flip ? across - 1 - c : c;
            const [x, y] =
              back === "N"
                ? [x0 + k, y0 + r]
                : back === "S"
                  ? [x1 - k, y1 - r]
                  : back === "W"
                    ? [x0 + r, y1 - k]
                    : [x1 - r, y0 + k];
            if (near(x, y)) continue;
            put(slot, x, y);
            drawn++;
          }
        // A plan that left nothing the pack can draw falls back to the room's own furniture.
        if (drawn) {
          items.length = 0;
          stamped = true;
        }
      }
    }
    if (vaulted && !stamped) {
      for (const each of items)
        if (each.kind === "center" || each.slot === 0) [each.kind, each.count] = ["center", bays.length];
      if (!items.some((each) => each.kind === "pillar"))
        items.unshift({ slot: 7, kind: "pillar", count: pillars.length });
      else for (const each of items) if (each.kind === "pillar") each.count = pillars.length;
      budget += pillars.length + bays.length;
    }
    for (const { slot, kind, count } of items) {
      const spots = tiny
        ? everywhere()
        : kind === "back"
          ? [...backMiddle, ...spread(...sideRows)]
          : kind === "corner"
            ? // Then heaped out from the corners, not strung along the back wall (panel round 41).
              [
                ...shuffle(corners),
                ...everywhere().sort(
                  (p, q) =>
                    Math.min(...corners.map(([cx, cy]) => Math.abs(p[0] - cx) + Math.abs(p[1] - cy))) -
                    Math.min(...corners.map(([cx, cy]) => Math.abs(q[0] - cx) + Math.abs(q[1] - cy))),
                ),
              ]
            : kind === "wall"
              ? spread(backRow, ...sideRows, frontRow)
              : kind === "center" && vaulted
                ? bays
                : kind === "center" && niches && count > 2
                  ? spread(backRow, ...sideRows)
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
      // A crypt tells its own, in its own pieces: robbers caught by a trap at the chest they came for, a tomb
      // broken open and its dead dragged out (owner 2026-11-18, "Build play content next").
      const stories =
        plan.template === "crypt"
          ? [
              [1, 4, 3, 1, 4], // robbers caught by the spikes at the chest
              [0, 1, 1, 3], // a tomb broken open, its dead dragged out
            ]
          : /cell|gaol|oubliette/iu.test(base)
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
    // A fall of the vault or ceiling in one corner of a room a floor, heaped where it came down: something
    // to climb round or hide behind (owner 2026-11-18, "Build play content next"). A crypt's pack has no
    // rubble; its fall is told by its scenes.
    if (fallen === n && plan.template !== "crypt") {
      const [cx0, cy0] = corners[Math.floor(random() * corners.length)]!;
      const heap = everywhere()
        .sort((p, q) => Math.abs(p[0] - cx0) + Math.abs(p[1] - cy0) - (Math.abs(q[0] - cx0) + Math.abs(q[1] - cy0)))
        .slice(0, 8);
      let laid = 0;
      for (const [x, y] of heap) if (laid < 4 && !near(x, y) && put(SITE_RUBBLE_PROP, x, y)) laid++;
    }
  }
  // The way to a crypt's heart is lit: torches either side of the passage for the last cells to its door,
  // so the founder's tomb is a place arrived at (panel round 24: no climax).
  if (plan.template === "crypt")
    for (const [k, door] of doors.entries()) {
      if (!door || !info[k]?.heart) continue;
      const room = rooms[k]!;
      const ins = (x: number, y: number) => [room, ...(room.parts ?? [])].some((b) => inside(b, x, y));
      for (const [dx, dy] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ] as const) {
        if (ins(door.x + dx, door.y + dy) || ground[cell(door.x + dx, door.y + dy)] !== "floor") continue;
        for (let step = 1; step <= 4; step += 2)
          for (const side of [-1, 1]) {
            const [x, y] = [door.x + dx * step + dy * side, door.y + dy * step + dx * side];
            const i = cell(x, y);
            if (ground[i] !== "floor" || props[i] !== -1 || linked.has(i) || ins(x, y)) continue;
            props[i] = 2;
            if (!reachable()) props[i] = -1;
          }
        break;
      }
    }
  // Loculi and arcosola (panel rounds 39-40: crypts are boxes stamped in rock): a crypt's burial rooms below
  // ground have their dead laid in niches cut back into the rock round their walls, every other cell along
  // a wall that has rock behind it, a skeleton on its shelf or now and then a sarcophagus under an arch, so
  // a chamber's outline is cut and ragged as a dug vault is, not a ruled box.
  if (plan.template === "crypt" && level.depth < 0)
    for (const [k, room] of rooms.entries()) {
      const name = info[k]?.name ?? "";
      if (!room || !/burial|vault|crypt|tomb|ossuar|charnel|columbar|catacomb|founder/iu.test(name)) continue;
      const parts = (room.parts ??= []);
      const bones = /ossuar|charnel/iu.test(name);
      let cut = 0;
      const most = Math.min(bones ? 6 : 10, 24 - parts.length);
      const inRoom = (x: number, y: number) => [room, ...parts].some((b) => inside(b, x, y));
      for (const [dx, dy] of [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ] as const) {
        const along = dy !== 0;
        const span = along ? room.w : room.h;
        const offset = Math.floor(random() * 2);
        // Spaced unevenly, a pair now and then and a gap, as dug graves are (panel round 41: evenly spaced
        // niches read as crenellations).
        for (let i = 1 + offset; i < span - 1 && cut < most; i += random() < 0.25 ? 1 : random() < 0.35 ? 3 : 2) {
          if (random() < 0.15) continue;
          const [fx, fy] = along
            ? [room.x + i, dy < 0 ? room.y : room.y + room.h - 1]
            : [dx < 0 ? room.x : room.x + room.w - 1, room.y + i];
          const [nx, ny] = [fx + dx, fy + dy];
          if (nx < 1 || ny < 1 || nx >= mapW - 1 || ny >= mapH - 1) continue;
          const f = cell(fx, fy);
          const n = cell(nx, ny);
          if (ground[f] !== "floor" || !inRoom(fx, fy) || doorCells.has(f) || linked.has(f)) continue;
          if (ground[n] === "floor" || inRoom(nx, ny)) continue;
          // Nothing else may touch the niche: only the room it opens from.
          const lonely = [
            [nx + dx, ny + dy],
            [nx + dy, ny + dx],
            [nx - dy, ny - dx],
            [nx + dx + dy, ny + dy + dx],
            [nx + dx - dy, ny + dy - dx],
          ].every(([x, y]) => x! >= 0 && y! >= 0 && x! < mapW && y! < mapH && ground[cell(x!, y!)] !== "floor");
          if (!lonely) continue;
          ground[n] = "floor";
          props[n] = !bones && random() < 0.3 ? 0 : 1;
          for (let yy = ny - 1; yy <= ny + 1; yy++)
            for (let xx = nx - 1; xx <= nx + 1; xx++)
              if (ground[cell(xx, yy)] === "rock") ground[cell(xx, yy)] = "wall";
          parts.push({ x: nx, y: ny, w: 1, h: 1 });
          cut++;
        }
      }
      if (!parts.length) delete room.parts;
    }
  // Each alcove holds one thing: a statue, or in a crypt a sarcophagus.
  for (const recess of alcoves.values()) {
    const mid = recess[1]!;
    if (props[cell(mid.x, mid.y)] !== -1) continue;
    // A statue where people are received or pray; in a working room what that room keeps (panel round 23: a
    // statue in a smithy).
    const owner = rooms.findIndex((r) => [r, ...(r.parts ?? [])].some((b) => inside(b, mid.x, mid.y)));
    const work =
      owner >= 0 &&
      /smith|kitchen|stable|store|cellar|barrack|armou?ry|bake|brew|pantry|buttery|larder|guard|gaol|scullery|laundry/iu.test(
        info[owner]?.name ?? "",
      );
    props[cell(mid.x, mid.y)] =
      plan.template === "crypt"
        ? 0
        : work
          ? /armou?ry|guard|barrack/iu.test(info[owner]!.name)
            ? RACK
            : BARREL
          : STATUE;
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
  // Cover (owner 2026-11-18, "Build play content next"): a big room whose middle is bare gets two or three
  // islands of cover with clear ways between them, so a fight there has something to move round (panel
  // rounds 30-32: undercrofts and burial halls a sea of empty floor). Never in a house's rooms, whose
  // panel asks were for less clutter, nor the castle's ward, which has its carts.
  if (plan.template !== "manor")
    for (const [k, box] of rooms.entries()) {
      const use = info[k]?.use;
      if (!box || use === "open" || SITE_STAIR_ROOMS.has(siteBaseName(info[k]?.name ?? ""))) continue;
      if (box.w < 8 || box.h < 6) continue;
      const inner = (x: number, y: number) =>
        x >= box.x + 2 && x < box.x + box.w - 2 && y >= box.y + 2 && y < box.y + box.h - 2;
      let busy = 0;
      for (let y = box.y; y < box.y + box.h; y++)
        for (let x = box.x; x < box.x + box.w; x++)
          if (inner(x, y) && props[cell(x, y)]! >= 0 && props[cell(x, y)] !== (plan.template === "crypt" ? 7 : COLUMN))
            busy++;
      const middle = (box.w - 4) * (box.h - 4);
      if (busy > middle / 12) continue;
      const pieces: Array<[number, number]> =
        plan.template === "crypt"
          ? [
              [0, 1],
              [7, 1],
              [0, 7],
            ]
          : level.depth < 0
            ? [
                [CRATE, BARREL],
                [BARREL, CRATE],
                [CRATE, CRATE],
              ]
            : [
                [TIPPED, STOOL],
                [CRATE, BARREL],
                [T, STOOL],
              ];
      const spots: Array<[number, number]> = [
        [box.x + Math.floor(box.w / 3), box.y + Math.floor(box.h / 3)],
        [box.x + Math.floor((2 * box.w) / 3), box.y + Math.floor((2 * box.h) / 3)],
        [box.x + Math.floor((2 * box.w) / 3), box.y + Math.floor(box.h / 3)],
      ];
      for (const [n, [x, y]] of spots.slice(0, box.w * box.h >= 80 ? 3 : 2).entries()) {
        const [a1, a2] = pieces[n % pieces.length]!;
        const flat = random() < 0.5;
        const pair = [cell(x, y), flat ? cell(x + 1, y) : cell(x, y + 1)];
        if (
          pair.some(
            (c) =>
              ground[c] !== "floor" ||
              props[c] !== -1 ||
              linked.has(c) ||
              doorCells.has(c) ||
              traps.some((trap) => cell(trap.x, trap.y) === c),
          )
        )
          continue;
        props[pair[0]!] = a1;
        props[pair[1]!] = a2;
        if (!reachable()) {
          props[pair[0]!] = -1;
          props[pair[1]!] = -1;
        }
      }
    }
  // One set piece a floor (panel round 42: big rooms spread their props with nothing to anchor them, and no floor
  // has one thing to remember it by). A church's transept arms each end in a side altar; below ground the
  // biggest room has a flooded bay, a pool of standing water with a way round it; above ground in a castle
  // or a church a pillar of the hall's arcade has come down in a heap of masonry.
  {
    const free = (c: number) =>
      ground[c] === "floor" &&
      props[c] === -1 &&
      !linked.has(c) &&
      !doorCells.has(c) &&
      !traps.some((trap) => cell(trap.x, trap.y) === c) &&
      around(c).every((n) => !doorCells.has(n) && !linked.has(n));
    if (plan.template === "temple" && level.depth === 0)
      for (const [k, room] of rooms.entries()) {
        if (!room || siteBaseName(info[k]?.name ?? "") !== "Nave") continue;
        for (const arm of room.parts ?? []) {
          // An arm out to one side of the nave: its altar against its far end wall, in the middle.
          const west = arm.x + arm.w <= room.x;
          const east = arm.x >= room.x + room.w;
          if (!west && !east) continue;
          const [x, y] = [west ? arm.x : arm.x + arm.w - 1, arm.y + Math.floor(arm.h / 2)];
          const c = cell(x, y);
          if (!free(c)) continue;
          props[c] = ALTAR;
          if (!reachable()) props[c] = -1;
        }
      }
    const big = rooms
      .map((room, k) => ({ room, k, name: siteBaseName(info[k]?.name ?? "") }))
      .filter(
        ({ room, k, name }) =>
          room &&
          room.w >= 6 &&
          room.h >= 5 &&
          !info[k]?.heart &&
          info[k]?.use !== "open" &&
          info[k]?.use !== "quiet" &&
          !SITE_STAMP_FREE_SET_PIECE.test(name),
      )
      .sort((a, b) => b.room.w * b.room.h - a.room.w * a.room.h);
    if (level.depth < 0 && big.length && random() < 0.65) {
      for (const { room } of big.slice(0, 3)) {
        const [rx, ry] = [Math.max(1, Math.min(3, (room.w - 4) / 2)), Math.max(1, Math.min(2.5, (room.h - 4) / 2))];
        const [cx, cy] = [
          room.x + 2 + rx + Math.floor(random() * Math.max(1, room.w - 4 - 2 * rx)),
          room.y + 2 + ry + Math.floor(random() * Math.max(1, room.h - 4 - 2 * ry)),
        ];
        const pool: number[] = [];
        for (let y = room.y + 2; y < room.y + room.h - 2; y++)
          for (let x = room.x + 2; x < room.x + room.w - 2; x++) {
            const d = ((x - cx) / (rx + 0.5)) ** 2 + ((y - cy) / (ry + 0.5)) ** 2;
            const c = cell(x, y);
            if (d <= 1 + (random() - 0.5) * 0.5 && free(c)) pool.push(c);
          }
        if (pool.length < 4) continue;
        for (const c of pool) ground[c] = "liquid";
        if (reachable()) break;
        for (const c of pool) ground[c] = "floor";
      }
    } else if (level.depth >= 0 && plan.template !== "manor" && plan.template !== "crypt" && random() < 0.6) {
      for (const { room } of big) {
        const piers: number[] = [];
        for (let y = room.y; y < room.y + room.h; y++)
          for (let x = room.x; x < room.x + room.w; x++) if (props[cell(x, y)] === COLUMN) piers.push(cell(x, y));
        if (piers.length < 4) continue;
        const fell = piers[Math.floor(random() * piers.length)]!;
        props[fell] = SITE_RUBBLE_PROP;
        const heap = around(fell).filter(free);
        let laid = 0;
        for (const c of heap) {
          if (laid >= 3) break;
          props[c] = SITE_RUBBLE_PROP;
          if (reachable()) laid++;
          else props[c] = -1;
        }
        break;
      }
    }
  }
  // A gallery over the hall (owner 2026-11-18, "Add verticality and sightlines"): a raised walk along one of
  // its walls behind a rail, up a few steps at one end, where the holders can stand over the floor below (the
  // minstrels' gallery over a house's screens, a castle hall's, the west gallery of a church). Its low end
  // first, away from the dais, then a long side; never where a door opens onto it.
  const gallery: number[] = [];
  if (plan.template !== "crypt" && level.depth >= 0 && !level.inset)
    for (const [k, box] of rooms.entries()) {
      const name = info[k]?.name ?? "";
      if (!box || !["Great hall", "Nave"].includes(siteBaseName(name))) continue;
      if (Math.max(box.w, box.h) < 8 || Math.min(box.w, box.h) < 5) continue;
      const inBox = (c: number) => inside(box, c % mapW, Math.floor(c / mapW));
      const fixedProp = (c: number) =>
        [COLUMN, SEAT, ALTAR, FONT, DUNGEON_EXIT_PROP, DUNGEON_SECRET_DOOR_PROP].includes(props[c]!);
      const free = (c: number) =>
        inBox(c) &&
        ground[c] === "floor" &&
        !fixedProp(c) &&
        !linked.has(c) &&
        !doorCells.has(c) &&
        !traps.some((trap) => cell(trap.x, trap.y) === c);
      const shut = (c: number) => around(c).every((m) => inBox(m) || ground[m] !== "floor");
      let dais = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
      for (let y = box.y; y < box.y + box.h; y++)
        for (let x = box.x; x < box.x + box.w; x++)
          if (props[cell(x, y)] === SEAT || props[cell(x, y)] === ALTAR) dais = { x, y };
      // A nave's altar is beyond it in the choir: its gallery goes at the west end, by the way in (panel round
      // 35: a gallery across the nave's crossing end cut the church in two).
      if (siteBaseName(name) === "Nave" && dais.x === box.x + box.w / 2 && dais.y === box.y + box.h / 2)
        dais = { x: 2 * dais.x - entrance.x, y: 2 * dais.y - entrance.y };
      // Each side as (walk cell, rail cell) at position b along it, the wall behind the walk.
      const sides = (["N", "S", "W", "E"] as const).map((side) => {
        const along = side === "N" || side === "S" ? box.w : box.h;
        const cellAt = (b: number, d: number) =>
          side === "N"
            ? cell(box.x + b, box.y + d)
            : side === "S"
              ? cell(box.x + b, box.y + box.h - 1 - d)
              : side === "W"
                ? cell(box.x + d, box.y + b)
                : cell(box.x + box.w - 1 - d, box.y + b);
        const mid = cellAt(Math.floor(along / 2), 0);
        const far = Math.abs((mid % mapW) - dais.x) + Math.abs(Math.floor(mid / mapW) - dais.y);
        const short = along === Math.min(box.w, box.h);
        return { along, cellAt, score: far + (short ? 6 : 0) };
      });
      sides.sort((p, q) => q.score - p.score);
      // Never across a nave's east end, which opens on the crossing (panel round 36).
      if (siteBaseName(name) === "Nave") sides.pop();
      for (const { along, cellAt } of sides) {
        // The longest run of places the walk and its rail can go.
        const good = (b: number) =>
          b >= 0 && b < along && free(cellAt(b, 0)) && free(cellAt(b, 1)) && shut(cellAt(b, 0)) && shut(cellAt(b, 1));
        let [a, z] = [0, -1];
        for (let b = 0; b < along;) {
          if (!good(b)) {
            b++;
            continue;
          }
          let e = b;
          while (good(e + 1)) e++;
          if (e - b > z - a) [a, z] = [b, e];
          b = e + 1;
        }
        // Ends cut short are capped with the rail where it can stand, else the walk draws back a cell for it.
        const lo = a > 0 && !free(cellAt(a - 1, 0)) ? a + 1 : a;
        const hi = z < along - 1 && !free(cellAt(z + 1, 0)) ? z - 1 : z;
        if (hi - lo + 1 < 3) continue;
        const walk: number[] = [];
        const rail: number[] = [];
        for (let b = lo; b <= hi; b++) walk.push(cellAt(b, 0));
        for (let b = lo - 1; b <= hi + 1; b++) if (b >= 0 && b < along && free(cellAt(b, 1))) rail.push(cellAt(b, 1));
        const caps: number[] = [];
        if (lo > 0) caps.push(cellAt(lo - 1, 0));
        if (hi < along - 1) caps.push(cellAt(hi + 1, 0));
        if (caps.some((c) => !free(c))) continue;
        // The steps: a cap whose far side is open floor, else the rail's end cell.
        const open = (c: number) => ground[c] === "floor" && props[c] === -1 && !linked.has(c);
        const stepCaps = [
          ...(lo > 0 ? [[cellAt(lo - 1, 0), cellAt(lo - 2, 0)] as const] : []),
          ...(hi < along - 1 ? [[cellAt(hi + 1, 0), cellAt(hi + 2, 0)] as const] : []),
        ]
          .filter(([, beyond]) => inBox(beyond) && open(beyond))
          .map(([c]) => c);
        // Else the rail cell in front of one end of the walk, onto the hall floor beyond it.
        const railEnds = [lo, hi]
          .filter((b) => rail.includes(cellAt(b, 1)) && inBox(cellAt(b, 2)) && open(cellAt(b, 2)))
          .map((b) => cellAt(b, 1));
        const stepPool = stepCaps.length ? stepCaps : railEnds;
        if (!stepPool.length) continue;
        // Steps at both ends where both can have them, so the gallery is a way round and not a dead end (panel
        // round 36), the far ones now and then left out.
        const steps =
          stepPool.length > 1 && random() < 0.75 ? stepPool : [stepPool[Math.floor(random() * stepPool.length)]!];
        const mine = [...walk, ...rail, ...caps];
        // What stood there is moved off: the gallery's walk is kept clear.
        const was = mine.map((c) => [c, props[c]!] as const);
        for (const c of mine) props[c] = steps.includes(c) || walk.includes(c) ? -1 : RAIL;
        if (!reachable()) {
          for (const [c, p] of was) props[c] = p;
          continue;
        }
        gallery.push(...walk, ...steps);
        break;
      }
    }
  // The heart's hoard (panel round 30: the payoff not where the fight is): what the holders keep, two or three
  // chests together against the wall farthest from the door, behind whoever holds the room.
  {
    const k = info.findIndex((each) => each.heart);
    const box = k >= 0 ? rooms[k] : undefined;
    if (box) {
      const chest = plan.template === "crypt" ? 3 : CHEST;
      const cells: number[] = [];
      for (const b of [box, ...(box.parts ?? [])])
        for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) cells.push(cell(x, y));
      const doors = [...doorCells].filter((d) => around(d).some((m) => cells.includes(m)));
      const far = (c: number) =>
        Math.min(
          99,
          ...doors.map(
            (d) => Math.abs((d % mapW) - (c % mapW)) + Math.abs(Math.floor(d / mapW) - Math.floor(c / mapW)),
          ),
        );
      const have = cells.filter((c) => props[c] === chest).length;
      const spots = cells
        .filter(
          (c) =>
            ground[c] === "floor" &&
            props[c] === -1 &&
            !linked.has(c) &&
            !traps.some((trap) => cell(trap.x, trap.y) === c) &&
            around(c).some((m) => ground[m] === "wall"),
        )
        .sort((p, q) => far(q) - far(p));
      const anchor = spots[0];
      let placed = 0;
      if (anchor !== undefined)
        for (const c of spots
          .filter(
            (c) =>
              Math.abs((c % mapW) - (anchor % mapW)) + Math.abs(Math.floor(c / mapW) - Math.floor(anchor / mapW)) <= 2,
          )
          .slice(0, 4)) {
          if (have + placed >= 3) break;
          props[c] = chest;
          if (reachable()) placed++;
          else props[c] = -1;
        }
    }
  }
  map.entrance = entrance;
  // The rooms the way round goes through, left to nobody.
  const quietPath = keepRound ? round(true) : null;
  if (quietPath)
    for (const c of quietPath) {
      const k = roomOfRegion.get(at[c]!);
      // Not the room it starts from (the gate stays held) nor the one it makes for.
      if (k === undefined || [postRegion, start, wayTargetRegion].includes(at[c]!) || info[k]!.heart) continue;
      info[k] = { ...info[k]!, quiet: true };
    }
  // Something for taking the quiet way (panel round 26): a cache left in its farthest room, against a wall.
  if (quietPath) {
    const cache = plan.template === "crypt" ? 3 : CHEST;
    const walled = (c: number) => around(c).some((m) => ground[m] === "wall");
    const spots = [...quietPath]
      .reverse()
      .filter((c) => {
        const k = roomOfRegion.get(at[c]!);
        return k !== undefined && info[k]!.quiet && !SITE_STAIR_ROOMS.has(siteBaseName(info[k]!.name));
      })
      .flatMap((c) =>
        around(c).filter((m) => at[m] === at[c] && ground[m] === "floor" && props[m] === -1 && walled(m)),
      );
    const onLink = (m: number) =>
      links.some((link) => cell(link.x, link.y) === m) || traps.some((trap) => cell(trap.x, trap.y) === m);
    for (const m of spots) {
      if (onLink(m)) continue;
      props[m] = cache;
      if (reachable()) break;
      props[m] = -1;
    }
  } else
    for (const [k, each] of info.entries())
      if (each.post) info[k] = { name: each.name, use: each.use, ...(each.heart ? { heart: true as const } : {}) };
  // The way round as the party will see it: its cells from where it leaves the main way to where it rejoins,
  // through the quiet rooms and the doors between them (panel round 30: the way round not visible).
  const quietWay = quietPath
    ? quietPath
        .filter((c) => {
          if (ground[c] === "wall") return false;
          const k = at[c]! >= 0 ? roomOfRegion.get(at[c]!) : undefined;
          return k === undefined ? at[c]! < 0 || regions[at[c]!]!.kind !== "room" : !!info[k]!.quiet;
        })
        .map((c) => ({ x: c % mapW, y: Math.floor(c / mapW) }))
    : [];
  // The way round at a price on some floors (owner 2026-11-18, "Vary each floor's set-up"; panel round 38: the way
  // round cost nothing): a stretch of loose boards, or rubble below ground, part way along it.
  const creaks: Array<{ x: number; y: number }> = [];
  if (quietWay.length >= 8 && random() < 0.45) {
    const clear = (p: { x: number; y: number }) => {
      const c = cell(p.x, p.y);
      return (
        ground[c] === "floor" &&
        props[c] === -1 &&
        !linked.has(c) &&
        !doorCells.has(c) &&
        !traps.some((trap) => trap.x === p.x && trap.y === p.y)
      );
    };
    const mid = Math.floor(quietWay.length / 2);
    for (const p of [quietWay[mid]!, quietWay[mid + 1]!, quietWay[mid - 1]!]) if (p && clear(p)) creaks.push(p);
  }
  return {
    map,
    rooms: info,
    links,
    locks,
    traps,
    ...(quietWay.length >= 3 ? { quietWay } : {}),
    ...(creaks.length >= 2 ? { creaks } : {}),
    ...(gallery.length ? { gallery: gallery.map((c) => ({ x: c % mapW, y: Math.floor(c / mapW) })) } : {}),
  };
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
    ...(laid.quietWay ? { quietWay: laid.quietWay } : {}),
    ...(laid.gallery ? { gallery: laid.gallery } : {}),
    ...(laid.creaks ? { creaks: laid.creaks } : {}),
    roomInfo: laid.rooms.map((room) => ({
      name: room.name,
      use: room.use,
      ...(room.heart ? { heart: true as const } : {}),
      ...(room.post ? { post: true as const } : {}),
      ...(room.quiet ? { quiet: true as const } : {}),
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
