// Generated dungeon, cave and station maps (Game Mode): a grid of rock, floor, wall and liquid, props
// from the set's eight (slot 5 is the way out: stairs, a ladder or a hatch), named rooms, and where the
// party comes in. Pure and seeded: the same seed and set always lay out the same map.

import type { WorldPlaceMap } from "./place-maps.js";
import { worldMapWordsSchema, type WorldMapWords } from "./edits.js";
import { z } from "zod";
import {
  DUNGEON_LAIRS,
  DUNGEON_LAIR_FEATURE_WORDS,
  DUNGEON_LAIR_DEEDS,
  DUNGEON_LAIR_ACTIONS,
  dungeonLairDeedDone,
  dungeonLairDeedRoom,
  DUNGEON_LAIR_KINDS,
  dungeonLairFeature,
  type DungeonLairKind,
} from "./lairs.js";

export type DungeonKind = "cave" | "dungeon" | "station";

/** Ground of a cell. Rock is solid and drawn as nothing; a wall is rock that borders an open cell. */
export const DUNGEON_GROUND = ["rock", "floor", "wall", "liquid"] as const;
export type DungeonGround = (typeof DUNGEON_GROUND)[number];

/** The prop slot that is always the way out (stairs down, a ladder, a hatch) in every set. */
export const DUNGEON_EXIT_PROP = 5;
/** A hidden door in a planned building's wall: drawn as wall, walked through like floor. */
export const DUNGEON_SECRET_DOOR_PROP = 39;
/** A keep's portcullis hung raised over its gate passage: drawn over the floor, walked under. */
export const DUNGEON_PORTCULLIS_PROP = 43;

export interface DungeonSet {
  id: string;
  kind: DungeonKind;
  label: string;
  /** Words for the Game Master: the floor, the walls, the liquid, and each prop slot 0..7. */
  floor: string;
  wall: string;
  liquid: string;
  props: readonly [string, string, string, string, string, string, string, string, ...string[]];
}

/** A building's furnishings past its first five (gamer panel 2026-11-17: rooms dressed for what they are),
 *  slots 8 on, the same in every building set. */
export const BUILDING_DRESSING = [
  "barrels",
  "crates and sacks",
  "a wardrobe",
  "a writing desk",
  "a bathtub",
  "a high seat",
  "an anvil",
  "a statue",
  "a stone column",
  "a weapon rack",
  "a straw pallet",
  "a cooking range",
  "a well",
  "a font",
  "a manger",
  "a lectern",
  "an altar",
  "a pew",
  "a tomb",
  "a stool",
  "chains and shackles",
  "a bucket",
  "a heap of straw",
  "a wine rack",
  "a heap of bones",
  "a niche of skulls",
  "shelves of jars and sacks",
  "a stool knocked over",
  "a dropped sword",
  "a spilt jug",
  "cobwebs",
  "a hidden door",
  "a cart",
  "a training dummy",
  "a woodpile",
  "a raised portcullis",
  "a gallery rail",
] as const;

/** A prop as one character of a kept map: "-" none, 0-9, then a-z for 10 on. */
export function dungeonPropChar(prop: number): string {
  // 0-9, then a-z (10-35), then A-Z (36-61).
  return prop < 0
    ? "-"
    : prop < 10
      ? String(prop)
      : prop < 36
        ? String.fromCharCode(87 + prop)
        : String.fromCharCode(29 + prop);
}

export function dungeonPropOfChar(char: string): number {
  if (char === "-") return -1;
  const code = char.charCodeAt(0);
  return code >= 97 ? code - 87 : code >= 65 ? code - 29 : Number(char);
}

export const DUNGEON_SETS: readonly DungeonSet[] = Object.freeze([
  {
    id: "cave_rock",
    kind: "cave",
    label: "Rock cave",
    floor: "rough rock",
    wall: "rugged rock walls",
    liquid: "dark water",
    props: [
      "a stalagmite",
      "small stalagmites",
      "a boulder",
      "rubble",
      "glowing mushrooms",
      "a ladder down",
      "a rope and bucket",
      "bones",
    ],
  },
  {
    id: "cave_ice",
    kind: "cave",
    label: "Ice cave",
    floor: "frozen ice",
    wall: "walls of glacial ice",
    liquid: "freezing water",
    props: [
      "an ice spire",
      "icicles",
      "a frozen boulder",
      "a snow drift",
      "a frozen chest",
      "stairs down",
      "an ice crystal",
      "a frozen skeleton",
    ],
  },
  {
    id: "cave_crystal",
    kind: "cave",
    label: "Crystal cave",
    floor: "glinting stone",
    wall: "crystal-studded walls",
    liquid: "a glowing pool",
    props: [
      "violet crystals",
      "teal crystals",
      "crystal shards",
      "a geode",
      "a mossy boulder",
      "stairs down",
      "a miner's lantern",
      "a mining cart",
    ],
  },
  {
    id: "cave_lava",
    kind: "cave",
    label: "Lava cave",
    floor: "black basalt",
    wall: "volcanic rock",
    liquid: "molten lava",
    props: [
      "a basalt column",
      "a smoking vent",
      "obsidian shards",
      "a charred boulder",
      "a scorched chest",
      "stairs down",
      "a brazier",
      "a dragon skull",
    ],
  },
  {
    id: "dungeon_crypt",
    kind: "dungeon",
    label: "Crypt",
    floor: "worn flagstones",
    wall: "stone brick walls",
    liquid: "a murky channel",
    props: [
      "a sarcophagus",
      "a skeleton",
      "a torch stand",
      "a chest",
      "a spike trap",
      "stairs down",
      "a portcullis",
      "a pillar",
    ],
  },
  {
    id: "dungeon_sewer",
    kind: "dungeon",
    label: "Sewer",
    floor: "slimy walkways",
    wall: "mossy brick walls",
    liquid: "sewer water",
    props: ["a grate", "a pipe outlet", "junk", "a rat nest", "a crate", "a ladder up", "a valve wheel", "a barrel"],
  },
  {
    id: "dungeon_temple",
    kind: "dungeon",
    label: "Sunken temple",
    floor: "cracked sandstone",
    wall: "carved temple walls",
    liquid: "a still pool",
    props: [
      "a broken statue",
      "an altar",
      "a fallen column",
      "an urn",
      "a golden idol",
      "stairs down",
      "a carved door",
      "a brazier",
    ],
  },
  // Buildings laid out to a plan (building plans, 2026-11-14): slot 5 the door out, 6 a locked door, 7
  // rubble; 0-4 the furniture rooms are dressed with by their purpose.
  {
    id: "building_manor",
    kind: "dungeon",
    label: "Manor house",
    floor: "worn floorboards and rugs",
    wall: "panelled plaster walls",
    liquid: "standing water",
    props: [
      "a table",
      "a bed",
      "bookshelves",
      "a hearth",
      "a chest",
      "a door",
      "a locked door",
      "rubble",
      ...BUILDING_DRESSING,
    ],
  },
  {
    id: "building_keep",
    kind: "dungeon",
    label: "Keep",
    floor: "flagstones and rushes",
    wall: "thick stone walls",
    liquid: "standing water",
    props: [
      "a trestle table",
      "a cot",
      "shelves of stores",
      "a brazier",
      "a strongbox",
      "a door",
      "a locked door",
      "rubble",
      ...BUILDING_DRESSING,
    ],
  },
  {
    id: "building_temple",
    kind: "dungeon",
    label: "Temple",
    floor: "worn tiles",
    wall: "carved stone walls",
    liquid: "a flooded floor",
    props: [
      "a pew",
      "an altar",
      "shelves of scrolls",
      "a brazier",
      "an offering chest",
      "a door",
      "a locked door",
      "rubble",
      ...BUILDING_DRESSING,
    ],
  },
  {
    id: "station_corridor",
    kind: "station",
    label: "Station corridor",
    floor: "deck plates",
    wall: "bulkheads",
    liquid: "spilled coolant",
    props: [
      "a supply crate",
      "a terminal",
      "an airlock door",
      "a maintenance robot",
      "a coolant tank",
      "a ladder hatch",
      "a vent",
      "cargo containers",
    ],
  },
  {
    id: "station_lab",
    kind: "station",
    label: "Research lab",
    floor: "white lab tiles",
    wall: "lab walls",
    liquid: "a chemical spill",
    props: [
      "a specimen tube",
      "a lab bench",
      "a holo display",
      "a medical bed",
      "a sample freezer",
      "a ladder hatch",
      "a server rack",
      "a broken robot",
    ],
  },
  {
    id: "station_engine",
    kind: "station",
    label: "Engine room",
    floor: "grated decking",
    wall: "pipe-lined walls",
    liquid: "plasma coolant",
    props: [
      "a reactor core",
      "a generator",
      "a pipe junction",
      "a control console",
      "fuel canisters",
      "a ladder hatch",
      "a sparking cable box",
      "a tool cart",
    ],
  },
  {
    id: "station_hydro",
    kind: "station",
    label: "Hydroponics bay",
    floor: "drained decking",
    wall: "glass panels and plant racks",
    liquid: "a nutrient basin",
    props: [
      "a planter",
      "a fruit tree pod",
      "a water tank",
      "a grow-light rack",
      "seed storage",
      "a ladder hatch",
      "a gardening robot",
      "a compost bin",
    ],
  },
]);

export interface DungeonRoom {
  x: number;
  y: number;
  w: number;
  h: number;
  /** The rest of a room that is not a box (an L, a T), as more boxes; the first box is its main part. */
  parts?: Array<{ x: number; y: number; w: number; h: number }>;
}

/** Whether a room holds a cell: in its main box or one of its other parts. */
export function dungeonRoomHas(room: DungeonRoom, x: number, y: number): boolean {
  const inBox = (r: { x: number; y: number; w: number; h: number }) =>
    x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  return inBox(room) || !!room.parts?.some(inBox);
}

/** Every cell of a room, its main box first. */
export function dungeonRoomCells(room: DungeonRoom): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (const r of [room, ...(room.parts ?? [])])
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) out.push({ x, y });
  return out;
}

export interface DungeonMap {
  set: string;
  seed: number;
  width: number;
  height: number;
  /** Row-major, `width * height`. */
  ground: DungeonGround[];
  /** Row-major prop slot per cell, or -1. */
  props: number[];
  rooms: DungeonRoom[];
  /** Where the party comes in, on the way-out prop. */
  entrance: { x: number; y: number };
  /** A map made by hand (map editor Phase 3): its props are drawn only and never block a walk. */
  drawnProps?: true;
  /** A map made by hand's own words for the Game Master (1.357). */
  words?: WorldMapWords;
  /** A building's rooms by name (building plans), as its rooms are ordered. */
  roomNames?: readonly string[];
  /** Cells the party walks round (traps it has found). */
  blocked?: ReadonlySet<number>;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const at = (map: { width: number }, x: number, y: number) => y * map.width + x;

/** Whether the party can stand on a cell: floor, or the way out. Liquid, walls, rock and props block. */
export function dungeonWalkable(map: DungeonMap, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  const i = at(map, x, y);
  if (map.drawnProps) return map.ground[i] === "floor";
  if (map.blocked?.has(i)) return false;
  return (
    map.ground[i] === "floor" &&
    (map.props[i] === -1 ||
      map.props[i] === DUNGEON_EXIT_PROP ||
      map.props[i] === DUNGEON_SECRET_DOOR_PROP ||
      map.props[i] === DUNGEON_PORTCULLIS_PROP)
  );
}

/**
 * The cells a watcher at `from`, facing `face` (a step such as {x: 0, y: 1}), can see within `range`: a cone
 * some hundred degrees wide, every cell whose line from the watcher crosses no wall or rock (owner
 * 2026-11-18, "Add verticality and sightlines"). Furniture does not hide a cell; a watcher on a gallery
 * sees over it all the same.
 */
export function dungeonSightCells(
  map: DungeonMap,
  from: { x: number; y: number },
  face: { x: number; y: number },
  range = 7,
  /** Cells that stand in the way though they are not wall (a column, a pier). */
  blocks?: (x: number, y: number) => boolean,
): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  const len = Math.hypot(face.x, face.y) || 1;
  const [fx, fy] = [face.x / len, face.y / len];
  const open = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < map.width &&
    y < map.height &&
    (map.ground[at(map, x, y)] === "floor" || map.ground[at(map, x, y)] === "liquid");
  for (let y = from.y - range; y <= from.y + range; y++)
    for (let x = from.x - range; x <= from.x + range; x++) {
      const [dx, dy] = [x - from.x, y - from.y];
      const d = Math.hypot(dx, dy);
      if (!d || d > range + 0.5 || !open(x, y)) continue;
      if ((dx * fx + dy * fy) / d < 0.62) continue;
      // The line to the cell's middle, sampled finely, through open ground only.
      let clear = true;
      const steps = Math.ceil(d * 3);
      for (let k = 1; k < steps && clear; k++) {
        const sx = Math.round(from.x + (dx * k) / steps);
        const sy = Math.round(from.y + (dy * k) / steps);
        if ((sx !== x || sy !== y) && (!open(sx, sy) || blocks?.(sx, sy))) clear = false;
      }
      if (clear) out.push({ x, y });
    }
  return out;
}

/** The shortest walk between two cells, four ways, as the cells after the start; null when none. */
export function dungeonPath(
  map: DungeonMap,
  from: { x: number; y: number },
  to: { x: number; y: number },
): { x: number; y: number }[] | null {
  if (!dungeonWalkable(map, to.x, to.y)) return null;
  const prev = new Int32Array(map.width * map.height).fill(-2);
  const start = at(map, from.x, from.y);
  prev[start] = -1;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]!;
    const x = cell % map.width;
    const y = (cell - x) / map.width;
    if (x === to.x && y === to.y) {
      const path: { x: number; y: number }[] = [];
      for (let c = cell; c !== start; c = prev[c]!) path.unshift({ x: c % map.width, y: Math.floor(c / map.width) });
      return path;
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (!dungeonWalkable(map, nx, ny)) continue;
      const next = at(map, nx, ny);
      if (prev[next] !== -2) continue;
      prev[next] = cell;
      queue.push(next);
    }
  }
  return null;
}

function carveRoom(ground: DungeonGround[], width: number, room: DungeonRoom) {
  for (let y = room.y; y < room.y + room.h; y++)
    for (let x = room.x; x < room.x + room.w; x++) ground[y * width + x] = "floor";
}

function carveCorridor(
  ground: DungeonGround[],
  width: number,
  a: { x: number; y: number },
  b: { x: number; y: number },
  wide: boolean,
  random: () => number,
) {
  const horizontalFirst = random() < 0.5;
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    for (let x = x0, y = y0; ; x += dx, y += dy) {
      ground[y * width + x] = "floor";
      if (wide) ground[(y + (dx ? 1 : 0)) * width + x + (dy ? 1 : 0)] = "floor";
      if (x === x1 && y === y1) break;
    }
  };
  if (horizontalFirst) {
    line(a.x, a.y, b.x, a.y);
    line(b.x, a.y, b.x, b.y);
  } else {
    line(a.x, a.y, a.x, b.y);
    line(a.x, b.y, b.x, b.y);
  }
}

const centre = (room: DungeonRoom) => ({ x: room.x + Math.floor(room.w / 2), y: room.y + Math.floor(room.h / 2) });

/** Rooms that do not touch, a margin of rock between them and from the edge. */
function placeRooms(
  width: number,
  height: number,
  count: number,
  min: number,
  max: number,
  random: () => number,
): DungeonRoom[] {
  const rooms: DungeonRoom[] = [];
  for (let tries = 0; tries < count * 30 && rooms.length < count; tries++) {
    const w = min + Math.floor(random() * (max - min + 1));
    const h = min + Math.floor(random() * (max - min + 1));
    const x = 2 + Math.floor(random() * (width - w - 4));
    const y = 2 + Math.floor(random() * (height - h - 4));
    const room = { x, y, w, h };
    if (rooms.some((r) => x < r.x + r.w + 2 && r.x < x + w + 2 && y < r.y + r.h + 2 && r.y < y + h + 2)) continue;
    rooms.push(room);
  }
  // In reading order of their centres, so the way in is always the first.
  return rooms;
}

function caveGround(width: number, height: number, random: () => number): DungeonGround[] {
  let open = Array.from({ length: width * height }, (_, i) => {
    const x = i % width;
    const y = Math.floor(i / width);
    if (x < 2 || y < 2 || x >= width - 2 || y >= height - 2) return false;
    return random() < 0.55;
  });
  for (let step = 0; step < 5; step++) {
    open = open.map((_, i) => {
      const x = i % width;
      const y = Math.floor(i / width);
      if (x < 2 || y < 2 || x >= width - 2 || y >= height - 2) return false;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && open[(y + dy) * width + x + dx]) n++;
      return n >= 5 || (open[i] === true && n >= 4);
    });
  }
  return open.map((cell) => (cell ? "floor" : "rock"));
}

/** Keeps only the largest connected open area, so every floor cell can be walked to. */
function keepLargest(ground: DungeonGround[], width: number, height: number) {
  const seen = new Int32Array(width * height).fill(-1);
  let best = -1;
  let bestSize = 0;
  let label = 0;
  for (let i = 0; i < ground.length; i++) {
    if (ground[i] !== "floor" || seen[i] !== -1) continue;
    const queue = [i];
    seen[i] = label;
    for (let head = 0; head < queue.length; head++) {
      const c = queue[head]!;
      const x = c % width;
      for (const n of [c - 1, c + 1, c - width, c + width]) {
        if (n < 0 || n >= ground.length || (n === c - 1 && x === 0) || (n === c + 1 && x === width - 1)) continue;
        if (ground[n] === "floor" && seen[n] === -1) {
          seen[n] = label;
          queue.push(n);
        }
      }
    }
    if (queue.length > bestSize) {
      bestSize = queue.length;
      best = label;
    }
    label++;
  }
  for (let i = 0; i < ground.length; i++) if (ground[i] === "floor" && seen[i] !== best) ground[i] = "rock";
}

/** Areas of a cave as rooms: the open cells of each quarter-sized block, boxed. */
function caveRooms(ground: DungeonGround[], width: number, height: number): DungeonRoom[] {
  const rooms: DungeonRoom[] = [];
  const bw = Math.ceil(width / 3);
  const bh = Math.ceil(height / 3);
  for (let by = 0; by < 3; by++)
    for (let bx = 0; bx < 3; bx++) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -1,
        maxY = -1,
        n = 0;
      for (let y = by * bh; y < Math.min(height, (by + 1) * bh); y++)
        for (let x = bx * bw; x < Math.min(width, (bx + 1) * bw); x++)
          if (ground[y * width + x] === "floor") {
            n++;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
      if (n >= 12) rooms.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    }
  return rooms;
}

/** Whether every floor cell is one area, four ways. */
function floorConnected(ground: DungeonGround[], width: number): boolean {
  const first = ground.indexOf("floor");
  if (first < 0) return true;
  const seen = new Uint8Array(ground.length);
  const queue = [first];
  seen[first] = 1;
  for (let head = 0; head < queue.length; head++) {
    const c = queue[head]!;
    const x = c % width;
    for (const n of [x > 0 ? c - 1 : -1, x < width - 1 ? c + 1 : -1, c - width, c + width]) {
      if (n < 0 || n >= ground.length || seen[n] || ground[n] !== "floor") continue;
      seen[n] = 1;
      queue.push(n);
    }
  }
  return queue.length === ground.filter((cell) => cell === "floor").length;
}

export const DUNGEON_MAP_SIZES = { small: [28, 20], medium: [40, 28], large: [56, 36] } as const;
export type DungeonMapSize = keyof typeof DUNGEON_MAP_SIZES;

export function generateDungeonMap(setId: string, seed: number, size: DungeonMapSize = "medium"): DungeonMap {
  const set = DUNGEON_SETS.find((each) => each.id === setId) ?? DUNGEON_SETS[0]!;
  const [width, height] = DUNGEON_MAP_SIZES[size];
  const random = mulberry32(seed ^ 0x9e3779b9);
  let ground: DungeonGround[];
  let rooms: DungeonRoom[];
  if (set.kind === "cave") {
    ground = caveGround(width, height, random);
    keepLargest(ground, width, height);
    rooms = caveRooms(ground, width, height);
    // The way in at a seeded area along the cave's edge, not always its top left (owner 2026-11-20: the
    // lair chamber, the far end from the way in, landed on the east edge in every cave).
    const edge = rooms
      .map((room, index) => ({ room, index }))
      .filter(({ room }) => room.x <= 1 || room.y <= 1 || room.x + room.w >= width - 1 || room.y + room.h >= height - 1);
    const pool = edge.length ? edge : rooms.map((room, index) => ({ room, index }));
    const first = pool[Math.floor(random() * pool.length)]?.index ?? 0;
    rooms = [...rooms.slice(first), ...rooms.slice(0, first)];
  } else {
    ground = Array.from({ length: width * height }, () => "rock" as DungeonGround);
    const count = Math.round((width * height) / (set.kind === "station" ? 110 : 90));
    rooms =
      set.kind === "station"
        ? placeRooms(width, height, count, 4, 8, random)
        : placeRooms(width, height, count, 3, 7, random);
    rooms.sort((a, b) => a.y - b.y || a.x - b.x);
    for (const room of rooms) carveRoom(ground, width, room);
    // Each room joined to the nearest already joined, so all are reachable.
    for (let i = 1; i < rooms.length; i++) {
      const here = centre(rooms[i]!);
      let nearest = rooms[0]!;
      for (const other of rooms.slice(0, i)) {
        const c = centre(other);
        const n = centre(nearest);
        if (Math.abs(c.x - here.x) + Math.abs(c.y - here.y) < Math.abs(n.x - here.x) + Math.abs(n.y - here.y))
          nearest = other;
      }
      carveCorridor(ground, width, here, centre(nearest), set.kind === "station", random);
    }
  }
  // Liquid: a pool inside some rooms, never on their edge, so a room stays walkable round it.
  for (const room of rooms) {
    if (room.w < 5 || room.h < 5 || random() > 0.35) continue;
    const pw = 1 + Math.floor(random() * (room.w - 4));
    const ph = 1 + Math.floor(random() * (room.h - 4));
    const px = room.x + 2 + Math.floor(random() * (room.w - pw - 3));
    const py = room.y + 2 + Math.floor(random() * (room.h - ph - 3));
    const poured: number[] = [];
    for (let y = py; y < py + ph; y++)
      for (let x = px; x < px + pw; x++)
        if (ground[y * width + x] === "floor") {
          ground[y * width + x] = "liquid";
          poured.push(y * width + x);
        }
    // A pool that would cut the floor in two is not poured.
    if (!floorConnected(ground, width)) for (const i of poured) ground[i] = "floor";
  }
  // Walls: rock that borders an open cell (eight ways).
  const isOpen = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height && ground[y * width + x] !== "rock" && ground[y * width + x] !== "wall";
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (ground[y * width + x] !== "rock") continue;
      let near = false;
      for (let dy = -1; dy <= 1 && !near; dy++)
        for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && isOpen(x + dx, y + dy)) near = true;
      if (near) ground[y * width + x] = "wall";
    }
  const map: DungeonMap = {
    set: set.id,
    seed,
    width,
    height,
    ground,
    props: ground.map(() => -1),
    rooms,
    entrance: { x: 0, y: 0 },
  };
  // The way in: the way-out prop in the first room, on a floor cell.
  const firstFloor = (room: DungeonRoom) => {
    for (let y = room.y; y < room.y + room.h; y++)
      for (let x = room.x; x < room.x + room.w; x++) if (ground[y * width + x] === "floor") return { x, y };
    return null;
  };
  const way = (rooms[0] && firstFloor(rooms[0])) ?? { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  map.entrance = way;
  map.props[at(map, way.x, way.y)] = DUNGEON_EXIT_PROP;
  // Props: a few per room against its walls, never closing a way through (checked by walking).
  const reachable = () => {
    let n = 0;
    let open = 0;
    const seen = new Uint8Array(width * height);
    const queue = [at(map, way.x, way.y)];
    seen[queue[0]!] = 1;
    for (let head = 0; head < queue.length; head++) {
      const c = queue[head]!;
      const x = c % width;
      const y = Math.floor(c / width);
      n++;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const)
        if (dungeonWalkable(map, x + dx, y + dy) && !seen[at(map, x + dx, y + dy)]) {
          seen[at(map, x + dx, y + dy)] = 1;
          queue.push(at(map, x + dx, y + dy));
        }
    }
    for (let i = 0; i < ground.length; i++)
      if (ground[i] === "floor" && (map.props[i] === -1 || map.props[i] === DUNGEON_EXIT_PROP)) open++;
    return n === open;
  };
  for (const room of rooms) {
    const want = 1 + Math.floor(random() * Math.max(1, Math.floor((room.w * room.h) / 12)));
    for (let k = 0, tries = 0; k < want && tries < 20; tries++) {
      const x = room.x + Math.floor(random() * room.w);
      const y = room.y + Math.floor(random() * room.h);
      const i = at(map, x, y);
      if (ground[i] !== "floor" || map.props[i] !== -1) continue;
      const slots = [0, 1, 2, 3, 4, 6, 7];
      map.props[i] = slots[Math.floor(random() * slots.length)]!;
      if (!reachable()) {
        map.props[i] = -1;
        continue;
      }
      k++;
    }
  }
  return map;
}

/** The map in words for the Game Master: each room's props, and where the way out is. */
export function dungeonMapWords(map: DungeonMap): string {
  const set = DUNGEON_SETS.find((each) => each.id === map.set) ?? DUNGEON_SETS[0]!;
  if (!map.rooms.length) {
    // A map made by hand has no areas, and its pack's props are its own: what it is, not what stands
    // there by the set's names (the place's name and the story say that), unless it says so itself (1.357).
    const words = map.words;
    const hasLiquid = map.ground.includes("liquid");
    if (!words) {
      const liquid = hasLiquid ? ", with liquid in it" : "";
      return `A place made by hand${liquid}. The way out is where the party came in.`;
    }
    const counts = new Map<number, number>();
    for (const prop of map.props) if (prop >= 0 && words.props?.[prop]) counts.set(prop, (counts.get(prop) ?? 0) + 1);
    const ground = [words.floor, words.wall].filter(Boolean).join(", ");
    const things = [...counts]
      .sort(([a], [b]) => a - b)
      .map(([prop, n]) => (n > 1 ? `${words.props![prop]} (${n})` : words.props![prop]!));
    const liquid = hasLiquid ? (words.liquid ?? "liquid") : null;
    return `A place made by hand${ground ? ` (${ground})` : ""}${liquid ? `, with ${liquid} in it` : ""}${things.length ? `; in it: ${things.join(", ")}` : ""}. The way out is where the party came in.`;
  }
  const rooms = map.rooms.map((room, index) => {
    const counts = new Map<number, number>();
    let liquid = false;
    for (const { x, y } of dungeonRoomCells(room)) {
      {
        const i = at(map, x, y);
        if (map.ground[i] === "liquid") liquid = true;
        const prop = map.props[i]!;
        if (prop >= 0) counts.set(prop, (counts.get(prop) ?? 0) + 1);
      }
    }
    const things = [...counts].map(([prop, n]) => (n > 1 ? `${set.props[prop]} (${n})` : set.props[prop]!));
    if (liquid) things.push(set.liquid);
    const name = map.roomNames?.[index];
    return `area ${index + 1}${name ? ` (${name})` : ""}${things.length ? `: ${things.join(", ")}` : ""}`;
  });
  // A planned building's way in is a door from its hall, on the level it is entered from.
  if (map.roomNames)
    return `${set.label} (${set.floor}, ${set.wall}); a hall runs through it with these rooms off it: ${rooms.join("; ")}.`;
  return `${set.label} (${set.floor}, ${set.wall}); ${rooms.join("; ")}. The way out is ${set.props[DUNGEON_EXIT_PROP]} in area 1.`;
}

// ── Stored on the chat ──

/** One character per cell: rock, floor, wall, liquid. */
const GROUND_CHARS: Record<DungeonGround, string> = { rock: "r", floor: ".", wall: "#", liquid: "~" };
const GROUND_OF: Record<string, DungeonGround> = { r: "rock", ".": "floor", "#": "wall", "~": "liquid" };
const MAP_MAX_CELLS = 64 * 48;

/** The map a game keeps, as it was made: an update to the generator never changes one in play. */
export const gameDungeonMapSchema = z
  .object({
    /** Changes when the party enters another map, so a walk on the old one is never applied to it. */
    id: z.string().min(1).max(80),
    name: z.string().trim().min(1).max(80),
    /** The world place it is a map of, when it was entered from one (a building in town). */
    place: z.string().min(1).max(160).optional(),
    set: z.string().max(40),
    /** A hand-made map's own image pack, by its id (else the set's). */
    pack: z.string().max(120).optional(),
    /** Made by hand (map editor Phase 3): props drawn only, and the way out is where the party came in. */
    hand: z.literal(true).optional(),
    /** A map made by hand's own words for the Game Master (1.357). */
    words: worldMapWordsSchema.optional(),
    /** Where people stand on a map made by hand, by the hour (map editor Phase 3, B3), with their names as
     *  they were when the party went in. */
    spots: z
      .array(
        z
          .object({
            x: z.number().int().min(0).max(63),
            y: z.number().int().min(0).max(47),
            name: z.string().trim().min(1).max(80),
            people: z
              .array(z.object({ id: z.string().min(1).max(32), name: z.string().trim().min(1).max(120) }).strict())
              .max(8),
            from: z.number().int().min(0).max(23).optional(),
            to: z.number().int().min(1).max(24).optional(),
          })
          .strict(),
      )
      .max(32)
      .optional(),
    seed: z.number().int(),
    /** A floor of a place with several (owner 2026-11-13: separate maps per floor): which floor, of how
     *  many, the first floor's seed every floor is made from, and where the way down is (none on the
     *  deepest). On a floor below the first, the way in is the way up. */
    floor: z.number().int().min(1).max(9).optional(),
    floors: z.number().int().min(1).max(9).optional(),
    siteSeed: z.number().int().optional(),
    down: z.object({ x: z.number().int(), y: z.number().int() }).strict().optional(),
    /** A building laid out to a plan (building plans, 2026-11-14): its rooms' names and uses, as `rooms`
     *  are ordered. */
    roomInfo: z
      .array(
        z
          .object({
            name: z.string().trim().min(1).max(60),
            use: z.string().regex(/^[a-z]{1,12}$/u),
            heart: z.literal(true).optional(),
            /** The room on the way across the floor the holders keep, with a way round it. */
            post: z.literal(true).optional(),
            /** A room on that way round, left to nobody. */
            quiet: z.literal(true).optional(),
          })
          .strict(),
      )
      .max(40)
      .optional(),
    /** The way round the held room, drawn as a scuffed trail so the party can see there is one (panel
     *  round 30). */
    quietWay: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(600)
      .optional(),
    /** A second, longer way round through other rooms, where the floor has one (panel round 44). */
    quietWayLong: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(600)
      .optional(),
    /** Loose boards or rubble on the way round that give a sneaking party away (owner 2026-11-18). */
    creaks: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(8)
      .optional(),
    /** Fallen stone over a crypt's ruined rooms (owner 2026-11-18: varied big sites). */
    rubble: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(400)
      .optional(),
    /** Knee-deep water down a flooded floor's galleries (panel round 52). */
    wade: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(1200)
      .optional(),
    /** A robbers' tunnel dug into a sealed room (panel round 52). */
    tunnel: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(60)
      .optional(),
    /** What a floor below ground is built round (panel round 52). */
    theme: z.enum(["flooded", "fallen", "bones", "plague", "robbed"]).optional(),
    /** A creature's lair (owner 2026-11-18), on every floor of the site: the kind its seed drew. */
    lairKind: z.enum(DUNGEON_LAIR_KINDS).optional(),
    /** On a carved lair floor, its great chamber (an index into `rooms`): the heart. */
    lairRoom: z.number().int().min(0).max(39).optional(),
    /** On the lair's own floor, what its great chamber holds: the hoard, the ward ring, the coffins... */
    lairFeature: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(300)
      .optional(),
    /** On a cave lair floor, the one-cell crawl through fallen rock into the great chamber (lair panel 5). */
    lairCrawl: z.object({ x: z.number().int(), y: z.number().int() }).strict().optional(),
    /** A hidden door that leads past the held room (panel round 46). */
    secretWay: z.object({ x: z.number().int(), y: z.number().int() }).strict().optional(),
    /** A raised gallery over a hall: its walk and the steps up to it (owner 2026-11-18). */
    gallery: z
      .array(z.object({ x: z.number().int(), y: z.number().int() }).strict())
      .max(200)
      .optional(),
    /** The plan it is a level of, and what the party has done there on every level: which level this is,
     *  each level's name, the rooms seen on each, the locks opened and the traps found and gone. */
    site: z
      .object({
        template: z.string().regex(/^[a-z]{1,12}$/u),
        wealth: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        fate: z
          .string()
          .regex(/^[a-z]{1,12}$/u)
          .optional(),
        terrain: z
          .string()
          .regex(/^[a-z]{1,12}$/u)
          .optional(),
        undead: z.literal(true).optional(),
        lair: z.enum(DUNGEON_LAIR_KINDS).optional(),
        traps: z.literal(true).optional(),
        level: z.number().int().min(0).max(10),
        levels: z
          .array(z.object({ name: z.string().trim().min(1).max(60), depth: z.number().int().min(-9).max(9) }).strict())
          .min(1)
          .max(11),
        seen: z.record(z.string().regex(/^\d{1,2}$/u), z.array(z.number().int().min(0).max(39)).max(40)).default({}),
        unlocked: z.array(z.string().max(8)).max(40).default([]),
        trapsFound: z.array(z.string().max(12)).max(80).default([]),
        trapsGone: z.array(z.string().max(12)).max(80).default([]),
      })
      .strict()
      .optional(),
    /** Ways to other levels of a planned building: where, to which level, and what they are. */
    links: z
      .array(
        z
          .object({
            x: z.number().int(),
            y: z.number().int(),
            level: z.number().int().min(0).max(9),
            kind: z.string().regex(/^[a-z]{1,12}$/u),
          })
          .strict(),
      )
      .max(12)
      .optional(),
    /** Locked doors on this level: the room behind each and the room its key is in. */
    locks: z
      .array(
        z
          .object({
            x: z.number().int(),
            y: z.number().int(),
            room: z.number().int().min(0),
            key: z.number().int().min(0),
          })
          .strict(),
      )
      .max(12)
      .optional(),
    /** Traps on this level (only in games whose rules can find them): where, how hard, and whether the
     *  party has found it. One not found is never shown. */
    traps: z
      .array(
        z
          .object({
            x: z.number().int(),
            y: z.number().int(),
            dc: z.number().int().min(1).max(40),
            found: z.literal(true).optional(),
          })
          .strict(),
      )
      .max(16)
      .optional(),
    // As small as a map made by hand may be (WORLD_MAP_MAX's floor, map editor Phase 3).
    width: z.number().int().min(4).max(64),
    height: z.number().int().min(4).max(48),
    ground: z
      .string()
      .regex(/^[r.#~]+$/u)
      .max(MAP_MAX_CELLS),
    props: z
      .string()
      .regex(/^[-0-9a-zA-Z]+$/u)
      .max(MAP_MAX_CELLS),
    rooms: z
      .array(
        z
          .object({
            x: z.number().int(),
            y: z.number().int(),
            w: z.number().int(),
            h: z.number().int(),
            parts: z
              .array(
                z
                  .object({ x: z.number().int(), y: z.number().int(), w: z.number().int(), h: z.number().int() })
                  .strict(),
              )
              .max(24)
              .optional(),
          })
          .strict(),
      )
      .max(40),
    entrance: z.object({ x: z.number().int(), y: z.number().int() }).strict(),
    /** Where the party stands. */
    at: z.object({ x: z.number().int(), y: z.number().int() }).strict(),
  })
  .strict()
  .refine((map) => map.ground.length === map.width * map.height && map.props.length === map.width * map.height, {
    message: "A map's cells fill its width and height",
  })
  .refine(
    (map) =>
      [map.at, map.entrance].every((p) => p.x >= 0 && p.y >= 0 && p.x < map.width && p.y < map.height) &&
      !/[\p{Cc}]/u.test(map.name),
    { message: "A map's party and way in stand on it, and its name is one line" },
  );
export type GameDungeonMap = z.infer<typeof gameDungeonMapSchema>;

/** A walk on the map not yet told to the Game Master: from where to where, and how long it took. */
export const gameDungeonWalkSchema = z
  .object({
    /** Changes with every walk, so a turn clears only the walk it told. */
    id: z.string().min(1).max(80),
    map: z.string().max(80),
    from: z.object({ x: z.number().int(), y: z.number().int() }).strict(),
    to: z.object({ x: z.number().int(), y: z.number().int() }).strict(),
    minutes: z.number().int().min(0).max(600),
    /** On a map made by hand: the place it is the map of, and every cell walked, the last included, for
     *  the story's step events (map events). A generated map's cells are never a story's. */
    place: z.string().min(1).max(160).optional(),
    /** On a planned building (building plans): the locks the walk opened (their rooms' names), and a
     *  hidden trap it set off (its area, 0 the hall, and how hard). */
    unlocked: z.array(z.string().max(60)).max(12).optional(),
    trap: z
      .object({ area: z.number().int().min(0).max(40), dc: z.number().int().min(1).max(40) })
      .strict()
      .optional(),
    steps: z
      .array(z.object({ x: z.number().int().min(0).max(63), y: z.number().int().min(0).max(47) }).strict())
      .max(2000)
      .optional(),
  })
  .strict();
export type GameDungeonWalk = z.infer<typeof gameDungeonWalkSchema>;

/** The game's map from chat metadata, or null for none (every game before maps, and one that left). */
export function gameDungeonMapFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): GameDungeonMap | null {
  const parsed = gameDungeonMapSchema.safeParse(metadata?.gameDungeonMap);
  return parsed.success ? parsed.data : null;
}

export function gameDungeonWalkFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): GameDungeonWalk | null {
  const parsed = gameDungeonWalkSchema.safeParse(metadata?.gameDungeonWalk);
  return parsed.success ? parsed.data : null;
}

/** A generated map as the game keeps it, the party at its entrance. */
export function gameDungeonMapFromDungeon(map: DungeonMap, name: string, id: string): GameDungeonMap {
  return {
    id,
    name: name.trim().slice(0, 80) || (DUNGEON_SETS.find((set) => set.id === map.set)?.label ?? "Map"),
    set: map.set,
    seed: map.seed,
    width: map.width,
    height: map.height,
    ground: map.ground.map((cell) => GROUND_CHARS[cell]).join(""),
    props: map.props.map(dungeonPropChar).join(""),
    rooms: map.rooms.slice(0, 40),
    entrance: map.entrance,
    at: map.entrance,
  };
}

/** A kept map back as cells, for walking and drawing. */
export function dungeonFromGameDungeonMap(map: GameDungeonMap): DungeonMap {
  return {
    set: map.set,
    seed: map.seed,
    width: map.width,
    height: map.height,
    ground: [...map.ground].map((char) => GROUND_OF[char] ?? "rock"),
    props: [...map.props].map(dungeonPropOfChar),
    rooms: map.rooms,
    entrance: map.entrance,
    ...(map.hand ? { drawnProps: true as const } : {}),
    ...(map.words ? { words: map.words } : {}),
    ...(map.roomInfo ? { roomNames: map.roomInfo.map((room) => room.name) } : {}),
    // A trap the party has found is walked round.
    ...(map.traps?.some((trap) => trap.found)
      ? { blocked: new Set(map.traps.filter((trap) => trap.found).map((trap) => trap.y * map.width + trap.x)) }
      : {}),
  };
}

/** Whether the party stands on the way out: the way-out prop, or (a map made by hand has none) where it
 *  came in. */
export function gameDungeonOnWayOut(map: GameDungeonMap): boolean {
  // Below the first floor the way in leads up, never out; the way down is never the way out.
  if ((map.floor ?? 1) > 1 || gameDungeonOnWayDown(map)) return false;
  // A planned building is left only by its door, on the level it is entered from.
  if (map.site && (map.site.levels[map.site.level]?.depth ?? 0) !== 0) return false;
  if (map.at.x === map.entrance.x && map.at.y === map.entrance.y) return true;
  // A map made by hand: its props are drawn only, a way-out prop among them too.
  if (map.hand) return false;
  return map.props[map.at.y * map.width + map.at.x] === String(DUNGEON_EXIT_PROP);
}

/** Whether the party stands on the way down to the next floor. */
export function gameDungeonOnWayDown(map: GameDungeonMap): boolean {
  return !!map.down && map.at.x === map.down.x && map.at.y === map.down.y;
}

/** The way to another level of a planned building the party stands on, or null. */
export function gameDungeonLinkAt(map: GameDungeonMap): NonNullable<GameDungeonMap["links"]>[number] | null {
  return map.links?.find((link) => link.x === map.at.x && link.y === map.at.y) ?? null;
}

/** Whether the party stands on the way up, on a floor below the first. */
export function gameDungeonOnWayUp(map: GameDungeonMap): boolean {
  return (map.floor ?? 1) > 1 && map.at.x === map.entrance.x && map.at.y === map.entrance.y;
}

/** A floor's own seed, from the first floor's: the first floor keeps it. */
export function dungeonFloorSeed(siteSeed: number, floor: number): number {
  return floor <= 1 ? siteSeed : (Math.imul(siteSeed ^ 0x2545f491, 0x9e3779b1) + floor * 0x6d2b79f5) >>> 0;
}

/** Steps from a map's way in to every cell it can walk to (-1 where it cannot). */
function dungeonStepsFrom(made: DungeonMap, from: { x: number; y: number }): Int32Array {
  const steps = new Int32Array(made.width * made.height).fill(-1);
  const start = from.y * made.width + from.x;
  steps[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]!;
    const x = cell % made.width;
    const y = (cell - x) / made.width;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      if (!dungeonWalkable(made, x + dx, y + dy)) continue;
      const next = (y + dy) * made.width + x + dx;
      if (steps[next] !== -1) continue;
      steps[next] = steps[cell]! + 1;
      queue.push(next);
    }
  }
  return steps;
}

/** The signs on the way to a lair's great chamber (lair panel 9: "the approach has no payoff"): the last
 *  stretch of the walk from the way in to the chamber's mouth, nearest first, each cell with how far along
 *  the stretch it lies (0 at the mouth, 1 at its far end), so the signs can thin out away from the chamber. */
/** A carved lair's chamber doorway, for the map to draw as a threshold: the open cells of its mouth and the
 *  way in through them (lair panel 16, all five: the two-cell mouth still did not read as a doorway). */
export function gameDungeonLairDoor(
  map: GameDungeonMap,
): { cells: Array<{ x: number; y: number }>; dx: number; dy: number } | undefined {
  if (!map.lairKind || !map.lairFeature?.length || map.roomInfo) return undefined;
  const chamber = map.lairRoom !== undefined ? map.rooms[map.lairRoom] : undefined;
  if (!chamber) return undefined;
  const made = dungeonFromGameDungeonMap(map);
  delete made.blocked;
  const steps = dungeonStepsFrom(made, map.entrance);
  let best: { x: number; y: number; dx: number; dy: number } | undefined;
  for (const { x, y } of dungeonRoomCells(chamber))
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const [nx, ny] = [x + dx, y + dy];
      if (dungeonRoomHas(chamber, nx, ny) || !dungeonWalkable(made, nx, ny)) continue;
      if (map.lairCrawl && map.lairCrawl.x === nx && map.lairCrawl.y === ny) continue;
      const i = ny * map.width + nx;
      if (steps[i]! < 0) continue;
      if (!best || steps[i]! < steps[best.y * map.width + best.x]!) best = { x: nx, y: ny, dx: -dx, dy: -dy };
    }
  if (!best) return undefined;
  const cells = [{ x: best.x, y: best.y }];
  for (const side of [1, -1]) {
    const [sx, sy] = [best.x + side * best.dy, best.y + side * best.dx];
    if (
      dungeonWalkable(made, sx, sy) &&
      !dungeonRoomHas(chamber, sx, sy) &&
      dungeonRoomHas(chamber, sx + best.dx, sy + best.dy)
    )
      cells.push({ x: sx, y: sy });
  }
  return { cells, dx: best.dx, dy: best.dy };
}

export function gameDungeonLairTrail(map: GameDungeonMap): Array<{ x: number; y: number; t: number }> {
  if (!map.lairKind || !map.lairFeature?.length) return [];
  const heart = map.lairRoom ?? map.roomInfo?.findIndex((room) => room?.heart) ?? -1;
  const chamber = heart >= 0 ? map.rooms[heart] : undefined;
  if (!chamber) return [];
  const made = dungeonFromGameDungeonMap(map);
  delete made.blocked;
  const steps = dungeonStepsFrom(made, map.entrance);
  let mouth = -1;
  for (const { x, y } of dungeonRoomCells(chamber))
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const [nx, ny] = [x + dx, y + dy];
      if (dungeonRoomHas(chamber, nx, ny) || !dungeonWalkable(made, nx, ny)) continue;
      if (map.lairCrawl && map.lairCrawl.x === nx && map.lairCrawl.y === ny) continue;
      const i = ny * map.width + nx;
      if (steps[i]! < 0) continue;
      if (mouth < 0 || steps[i]! < steps[mouth]!) mouth = i;
    }
  if (mouth < 0) return [];
  const path = [mouth];
  for (let cell = mouth; steps[cell]! > 0; ) {
    const x = cell % map.width;
    const y = (cell - x) / map.width;
    const back = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]
      .filter(([nx, ny]) => nx! >= 0 && ny! >= 0 && nx! < map.width && ny! < map.height)
      .map(([nx, ny]) => ny! * map.width + nx!)
      .find((n) => steps[n] === steps[cell]! - 1);
    if (back === undefined) break;
    path.push(back);
    cell = back;
  }
  // The stretch: from just outside the mouth (its guards stand there) out to about two fifths of the walk.
  const reach = Math.max(4, Math.min(18, Math.floor(path.length * 0.4)));
  return path
    .slice(1, reach + 1)
    .filter((cell) => !dungeonRoomHas(chamber, cell % map.width, Math.floor(cell / map.width)))
    .map((cell, n, all) => ({
      x: cell % map.width,
      y: Math.floor(cell / map.width),
      t: all.length > 1 ? n / (all.length - 1) : 0,
    }));
}

/** A carved place's deepest floor as a creature's lair: its great chamber the biggest room in the far half
 *  from the way in (the heart), and what it holds drawn in it, the drowned hall's pool as water. */
function caveLairFloor(kept: GameDungeonMap, made: DungeonMap, kind: DungeonLairKind): GameDungeonMap {
  const grown = caveLairGrown(made, kind !== "drowned" && kind !== "den");
  return caveLairCarved(
    grown === made
      ? kept
      : { ...kept, ground: grown.ground.map((g) => GROUND_CHARS[g]).join(""), rooms: grown.rooms },
    grown,
    kind,
  );
}

/** The great chamber widened out of the rock round it, where nothing else stands, to at least eleven by
 *  nine, carved as an oval so it reads as a hollow and not a box (lair panel 12, all five: the chamber was
 *  a corner pocket of a great cave, too small for a dragon). The chamber picked the way caveLairCarved
 *  picks it. */
function caveLairGrown(made: DungeonMap, dry = false): DungeonMap {
  const steps = dungeonStepsFrom(made, made.entrance);
  const distance = made.rooms.map((room) => {
    let best = -1;
    for (const { x, y } of dungeonRoomCells(room)) {
      const at = steps[y * made.width + x]!;
      if (at >= 0 && (best < 0 || at < best)) best = at;
    }
    return best;
  });
  const entry = made.rooms.findIndex((room) => dungeonRoomHas(room, made.entrance.x, made.entrance.y));
  const far = Math.max(1, ...distance);
  const openFloor = (room: DungeonRoom) =>
    dungeonRoomCells(room).filter(({ x, y }) => made.ground[y * made.width + x] === "floor").length;
  let pick = -1;
  made.rooms.forEach((room, index) => {
    if (index === entry || distance[index]! < far * 0.5) return;
    if (pick < 0 || openFloor(room) > openFloor(made.rooms[pick]!)) pick = index;
  });
  if (pick < 0) return made;
  const room = { ...made.rooms[pick]! };
  const clearOf = (r: DungeonRoom) =>
    r.x >= 2 &&
    r.y >= 2 &&
    r.x + r.w <= made.width - 2 &&
    r.y + r.h <= made.height - 2 &&
    others.every(
      (other, index) =>
        index === pick ||
        other.x >= r.x + r.w + 1 ||
        other.x + other.w + 1 <= r.x ||
        other.y >= r.y + r.h + 1 ||
        other.y + other.h + 1 <= r.y,
    ) &&
    !(made.entrance.x >= r.x && made.entrance.x < r.x + r.w && made.entrance.y >= r.y && made.entrance.y < r.y + r.h);
  // A neighbour in the way gives up its facing edge, while it keeps at least three by three (lair panel 12
  // check: a chamber in a cave's corner had rooms on its open sides and could not grow at all).
  const others = made.rooms.map((each) => ({ ...each }));
  const overlaps = (a: DungeonRoom, b: DungeonRoom) =>
    a.x < b.x + b.w + 1 && b.x < a.x + a.w + 1 && a.y < b.y + b.h + 1 && b.y < a.y + a.h + 1;
  const yielded = (next: DungeonRoom): DungeonRoom[] | null => {
    if (next.x < 1 || next.y < 1 || next.x + next.w > made.width - 1 || next.y + next.h > made.height - 1) return null;
    const { x: ex, y: ey } = made.entrance;
    if (ex >= next.x && ex < next.x + next.w && ey >= next.y && ey < next.y + next.h) return null;
    const out = others.map((each) => ({ ...each }));
    for (const [index, other] of out.entries()) {
      if (index === pick || !overlaps(next, other)) continue;
      if (other.x >= room.x + room.w) {
        const cut = next.x + next.w + 1 - other.x;
        other.x += cut;
        other.w -= cut;
      } else if (other.x + other.w <= room.x) other.w -= other.x + other.w + 1 - next.x;
      else if (other.y >= room.y + room.h) {
        const cut = next.y + next.h + 1 - other.y;
        other.y += cut;
        other.h -= cut;
      } else if (other.y + other.h <= room.y) other.h -= other.y + other.h + 1 - next.y;
      else return null;
      if (other.w < 3 || other.h < 3 || overlaps(next, other)) return null;
      if (ex >= other.x && ex < other.x + other.w && ey >= other.y && ey < other.y + other.h) continue;
      const wasIn = (made.rooms[index]!.x <= ex && ex < made.rooms[index]!.x + made.rooms[index]!.w &&
        made.rooms[index]!.y <= ey && ey < made.rooms[index]!.y + made.rooms[index]!.h);
      if (wasIn) return null;
    }
    return out;
  };
  for (let tries = 0; tries < 24 && (room.w < 11 || room.h < 9); tries++) {
    const options: DungeonRoom[] = [];
    if (room.w < 11) options.push({ ...room, x: room.x - 1, w: room.w + 1 }, { ...room, w: room.w + 1 });
    if (room.h < 9) options.push({ ...room, y: room.y - 1, h: room.h + 1 }, { ...room, h: room.h + 1 });
    const next = options.find(clearOf);
    if (next) {
      Object.assign(room, next);
      continue;
    }
    let moved = false;
    for (const option of options) {
      const trimmed = yielded(option);
      if (!trimmed) continue;
      trimmed.forEach((each, index) => Object.assign(others[index]!, each));
      Object.assign(room, option);
      moved = true;
      break;
    }
    if (!moved) break;
  }
  const was = made.rooms[pick]!;
  if (room.w === was.w && room.h === was.h) {
    // Not grown, still dried (lair panel 13: the hive's pool across a chamber that could not grow).
    const wet = dungeonRoomCells(room).filter(({ x, y }) => made.ground[y * made.width + x] === "liquid");
    if (!dry || !wet.length) return made;
    const ground = [...made.ground];
    for (const { x, y } of wet) ground[y * made.width + x] = "floor";
    return { ...made, ground };
  }
  const ground = [...made.ground];
  const [cx, cy] = [room.x + (room.w - 1) / 2, room.y + (room.h - 1) / 2];
  for (const { x, y } of dungeonRoomCells(room)) {
    const i = y * made.width + x;
    const inside = ((x - cx) / (room.w / 2)) ** 2 + ((y - cy) / (room.h / 2)) ** 2 <= 1;
    if (inside && (ground[i] === "rock" || ground[i] === "wall") && made.props[i] === -1) ground[i] = "floor";
    // A dry lair's hollow keeps no cave pool across it (lair panel 13: water cut the hive's comb in a band).
    if (dry && ground[i] === "liquid") ground[i] = "floor";
  }
  // The old room's walls carved off, a rock lining left round the new hollow where it meets the dark.
  for (const { x, y } of dungeonRoomCells(room)) {
    const i = y * made.width + x;
    if (ground[i] !== "floor") continue;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const n = (y + dy) * made.width + x + dx;
      if (ground[n] === "rock" && !dungeonRoomHas(room, x + dx, y + dy)) ground[n] = "wall";
    }
  }
  const rooms = others.map((each, index) => (index === pick ? room : each));
  return { ...made, ground, rooms };
}

function caveLairCarved(kept: GameDungeonMap, made: DungeonMap, kind: DungeonLairKind): GameDungeonMap {
  const steps = dungeonStepsFrom(made, made.entrance);
  const distance = made.rooms.map((room) => {
    let best = -1;
    for (const { x, y } of dungeonRoomCells(room)) {
      const at = steps[y * made.width + x]!;
      if (at >= 0 && (best < 0 || at < best)) best = at;
    }
    return best;
  });
  const entry = made.rooms.findIndex((room) => dungeonRoomHas(room, made.entrance.x, made.entrance.y));
  const far = Math.max(1, ...distance);
  // The chamber with the most open dry floor, not the biggest box: a room half pool split the hoard (lair
  // panel 2 renders).
  const openFloor = (room: DungeonRoom) =>
    dungeonRoomCells(room).filter(({ x, y }) => made.ground[y * made.width + x] === "floor").length;
  let lairRoom = -1;
  made.rooms.forEach((room, index) => {
    if (index === entry || distance[index]! < far * 0.5) return;
    if (lairRoom < 0 || openFloor(room) > openFloor(made.rooms[lairRoom]!)) lairRoom = index;
  });
  if (lairRoom < 0) return kept;
  const at = (x: number, y: number) => y * made.width + x;
  const cells = dungeonRoomCells(made.rooms[lairRoom]!).map(({ x, y }) => at(x, y));
  const inRoom = new Set(cells);
  // The chamber walled off from the open cave but for a throat of two or three cells on the side the party
  // comes from, opened wider only where the rest of the cave would otherwise be cut off (lair panel 2: the
  // chamber was a corner of an open cavern, no edge, no way in to hold).
  let walledGround = kept.ground;
  let lairCrawl: { x: number; y: number } | undefined;
  let walledProps = kept.props;
  {
    const ring = [
      ...new Set(
        cells.flatMap((c) =>
          [c - 1, c + 1, c - made.width, c + made.width].filter(
            (n) =>
              n >= 0 &&
              n < made.ground.length &&
              !inRoom.has(n) &&
              made.ground[n] === "floor" &&
              Math.abs((n % made.width) - (c % made.width)) <= 1,
          ),
        ),
      ),
    ].filter((n) => n !== at(made.entrance.x, made.entrance.y) && !(kept.down && n === at(kept.down.x, kept.down.y)));
    const byStep = [...ring].sort((p, q) => (steps[p] ?? 1e9) - (steps[q] ?? 1e9));
    const mouth = byStep[0];
    if (mouth !== undefined && ring.length >= 6) {
      const [mx, my] = [mouth % made.width, Math.floor(mouth / made.width)];
      // A mouth two cells wide, not three: a doorway in the rock, with its shoulders built up either side
      // (lair panel 15, all five: the cave chamber had no neck, no threshold to hold or to plan round).
      const second = ring
        .filter((n) => n !== mouth && Math.abs((n % made.width) - mx) + Math.abs(Math.floor(n / made.width) - my) === 1)
        .sort((p, q) => (steps[p] ?? 1e9) - (steps[q] ?? 1e9))[0];
      const opened = new Set(second === undefined ? [mouth] : [mouth, second]);
      const shoulder = (n: number) =>
        Math.abs((n % made.width) - mx) + Math.abs(Math.floor(n / made.width) - my) <= 3;
      const near1 = (m: number, n: number) =>
        Math.abs((m % made.width) - (n % made.width)) +
          Math.abs(Math.floor(m / made.width) - Math.floor(n / made.width)) <=
        1;
      // The wall thickened outward here and there, so it reads as the cave's own rock and not a ruled line (lair
      // panel 3: a one-cell straight wall read as a debug line).
      const ringSet = new Set(ring);
      const outward = (n: number) =>
        [n - 1, n + 1, n - made.width, n + made.width].filter(
          (m) =>
            m >= 0 &&
            m < made.ground.length &&
            !inRoom.has(m) &&
            !ringSet.has(m) &&
            made.ground[m] === "floor" &&
            made.props[m] === -1 &&
            m !== at(made.entrance.x, made.entrance.y) &&
            Math.abs((m % made.width) - (n % made.width)) <= 1 &&
            (((m * 2654435761) >>> 0) % 5 < 2 || shoulder(n)),
        );
      const filled = new Set<number>();
      const tryWalls = () => {
        const base = ring.filter((n) => !opened.has(n));
        const wall = (thick: boolean) => {
          const shut = new Set([...base, ...filled]);
          if (thick)
            for (const n of base)
              for (const m of outward(n))
                if (![m - 1, m + 1, m - made.width, m + made.width].some((k) => opened.has(k))) shut.add(m);
          const ground = made.ground.map((each, i) => (shut.has(i) ? ("wall" as const) : each));
          const reached = dungeonStepsFrom({ ...made, ground }, made.entrance);
          const lost = Array.from(steps).flatMap((st, i) => (st >= 0 && !shut.has(i) && reached[i]! < 0 ? [i] : []));
          return { shut, ground, lost: new Set(lost) };
        };
        // The thickened rock only where it cuts no way through the cave (lair panel 6: it walled off the
        // chamber's own mouth).
        const thick = wall(true);
        if (!thick.lost.size) return thick;
        const thin = wall(false);
        return thin.lost.size < thick.lost.size ? thin : thick;
      };
      let walled = tryWalls();
      // A part of the cave reached only through the chamber gets a tunnel of its own round the chamber, through
      // the rock and never beside the chamber, so the chamber keeps one mouth and its crawl (lair panel 6: the
      // den, drowned and hive chambers had three and four gaps, no arena to hold).
      const tunnelled = new Set<number>();
      for (let tries = 0; walled.lost.size && tries < 6; tries++) {
        const near = new Set<number>();
        for (const c of cells)
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              const x = (c % made.width) + dx;
              const y = Math.floor(c / made.width) + dy;
              if (x >= 0 && y >= 0 && x < made.width && y < made.height) near.add(at(x, y));
            }
        const from = new Int32Array(made.ground.length).fill(-2);
        const queue: number[] = [];
        for (const n of walled.lost) {
          from[n] = -1;
          queue.push(n);
        }
        let hit = -1;
        for (let head = 0; head < queue.length && hit < 0; head++) {
          const c = queue[head]!;
          const [cx, cy] = [c % made.width, Math.floor(c / made.width)];
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const) {
            const [x, y] = [cx + dx, cy + dy];
            if (x < 1 || y < 1 || x >= made.width - 1 || y >= made.height - 1) continue;
            const n = at(x, y);
            if (
              from[n] !== -2 ||
              near.has(n) ||
              walled.shut.has(n) ||
              walled.ground[n] === "liquid" ||
              made.props[n] === DUNGEON_EXIT_PROP ||
              n === at(made.entrance.x, made.entrance.y)
            )
              continue;
            from[n] = c;
            if (walled.ground[n] === "floor" && (steps[n] ?? -1) >= 0 && !walled.lost.has(n)) {
              hit = n;
              break;
            }
            queue.push(n);
          }
        }
        if (hit < 0) break;
        for (let c = from[hit]!; c >= 0 && !walled.lost.has(c); c = from[c]!) tunnelled.add(c);
        made = {
          ...made,
          ground: made.ground.map((each, i) => (tunnelled.has(i) ? ("floor" as const) : each)),
          props: made.props.map((each, i) => (tunnelled.has(i) ? -1 : each)),
        };
        walled = tryWalls();
      }
      // A small pocket the tunnel cannot reach without breaking the chamber's wall is filled with fallen rock.
      if (walled.lost.size) {
        const keepCells = new Set([
          at(made.entrance.x, made.entrance.y),
          ...(kept.down ? [at(kept.down.x, kept.down.y)] : []),
        ]);
        const seen = new Set<number>();
        for (const start of walled.lost) {
          if (seen.has(start)) continue;
          const part = [start];
          seen.add(start);
          for (let head = 0; head < part.length; head++)
            for (const n of [part[head]! - 1, part[head]! + 1, part[head]! - made.width, part[head]! + made.width])
              if (walled.lost.has(n) && !seen.has(n)) {
                seen.add(n);
                part.push(n);
              }
          if (part.length <= 16 && !part.some((c) => keepCells.has(c))) for (const c of part) filled.add(c);
        }
        if (filled.size) walled = tryWalls();
      }
      if (tunnelled.size) {
        const rim = new Set<number>();
        for (const c of tunnelled)
          for (const n of [
            c - 1,
            c + 1,
            c - made.width,
            c + made.width,
            c - made.width - 1,
            c - made.width + 1,
            c + made.width - 1,
            c + made.width + 1,
          ])
            if (n >= 0 && n < made.ground.length && made.ground[n] === "rock") rim.add(n);
        made = { ...made, ground: made.ground.map((each, i) => (rim.has(i) ? ("wall" as const) : each)) };
        walledGround = [...walledGround]
          .map((char, i) => (tunnelled.has(i) ? GROUND_CHARS.floor : rim.has(i) ? GROUND_CHARS.wall : char))
          .join("");
        walledProps = [...walledProps].map((char, i) => (tunnelled.has(i) ? "-" : char)).join("");
        walled = tryWalls();
      }
      // A part of the cave reached only through the chamber keeps its own gap: the shut ring cell beside it
      // nearest the way in, and its neighbours (a second way through, not the whole side left open).
      for (let tries = 0; walled.lost.size && tries < 6; tries++) {
        const gap = byStep.find(
          (n) => !opened.has(n) && [n - 1, n + 1, n - made.width, n + made.width].some((m) => walled.lost.has(m)),
        );
        if (gap === undefined) break;
        for (const m of ring) if (near1(m, gap)) opened.add(m);
        walled = tryWalls();
      }
      if (!walled.lost.size && walled.shut.size) {
        // A second way in, one cell wide, on the chamber's far side from its mouth: a crawl through the fallen
        // rock (lair panel 5, all five: one throat, no flank, nothing to scout). Chosen once the cave is whole
        // without it, so the party never needs it to get anywhere (lair panel 6: the crawl was the only road
        // to the cave beyond).
        {
          const reached = dungeonStepsFrom({ ...made, ground: walled.ground }, made.entrance);
          const gapTo = (n: number) => Math.abs((n % made.width) - mx) + Math.abs(Math.floor(n / made.width) - my);
          const crawl = ring
            .filter(
              (n) =>
                walled.shut.has(n) &&
                gapTo(n) >= 6 &&
                [n - 1, n + 1, n - made.width, n + made.width].some(
                  (m) => !inRoom.has(m) && !walled.shut.has(m) && (reached[m] ?? -1) >= 0,
                ),
            )
            .sort((p, q) => gapTo(q) - gapTo(p) || p - q)[0];
          if (crawl !== undefined) {
            walled.shut.delete(crawl);
            walled.ground = walled.ground.map((each, i) => (i === crawl ? ("floor" as const) : each));
            lairCrawl = { x: crawl % made.width, y: Math.floor(crawl / made.width) };
          }
        }
        const { shut, ground } = walled;
        made = { ...made, ground, props: made.props.map((each, i) => (shut.has(i) ? -1 : each)) };
        walledGround = [...walledGround].map((char, i) => (shut.has(i) ? GROUND_CHARS.wall : char)).join("");
        walledProps = [...walledProps].map((char, i) => (shut.has(i) ? "-" : char)).join("");
      }
    }
  }
  // The great chamber is the maker's alone: the cave's odds and ends (crates, barrels, a lamp) are cleared
  // from it, the way in and out kept (lair panel 1: an ordinary cave room with a heap in it).
  const keep = new Set([at(made.entrance.x, made.entrance.y), ...(kept.down ? [at(kept.down.x, kept.down.y)] : [])]);
  const cleared = new Set(
    cells.filter((c) => made.props[c] !== -1 && made.props[c] !== DUNGEON_EXIT_PROP && !keep.has(c)),
  );
  const props = [...walledProps].map((char, i) => (cleared.has(i) ? "-" : char)).join("");
  const open = cells.filter(
    (c) => made.ground[c] === "floor" && (made.props[c] === -1 || cleared.has(c)) && !keep.has(c),
  );
  // The doors: open cells just outside the room that lead into it.
  const doors: number[] = [];
  for (const c of cells)
    for (const n of [c - 1, c + 1, c - made.width, c + made.width])
      if (n >= 0 && n < made.ground.length && !inRoom.has(n) && made.ground[n] === "floor") doors.push(n);
  const near = (c: number) => [c - 1, c + 1, c - made.width, c + made.width];
  let feature = dungeonLairFeature({
    kind,
    width: made.width,
    cells: open,
    doors,
    walls: (c) =>
      near(c).some((n) => n < 0 || n >= made.ground.length || made.ground[n] === "wall" || made.ground[n] === "rock"),
    seed: `${made.seed}:lair`,
  });
  let ground = walledGround;
  if (kind === "drowned" && feature.length) {
    // The pool, shrunk from its edge until every cell still reaches the way in round it.
    const mx = feature.reduce((n, c) => n + (c % made.width), 0) / feature.length;
    const my = feature.reduce((n, c) => n + Math.floor(c / made.width), 0) / feature.length;
    const order = [...feature].sort(
      (p, q) =>
        Math.hypot((p % made.width) - mx, Math.floor(p / made.width) - my) -
        Math.hypot((q % made.width) - mx, Math.floor(q / made.width) - my),
    );
    feature = [];
    const before = dungeonStepsFrom(made, made.entrance);
    for (let keep = order.length; keep >= 4; keep = Math.floor(keep * 0.8)) {
      const pool = new Set(order.slice(0, keep));
      const wet = made.ground.map((each, i) => (pool.has(i) ? ("liquid" as const) : each));
      const reached = dungeonStepsFrom({ ...made, ground: wet }, made.entrance);
      if (!before.every((s, i) => s < 0 || pool.has(i) || reached[i]! >= 0)) continue;
      feature = [...pool];
      ground = [...walledGround].map((char, i) => (pool.has(i) ? GROUND_CHARS.liquid : char)).join("");
      break;
    }
  }
  // A few stalagmites stand in the chamber, clear of its feature, its walls and its ways in: cover to fight
  // round and break a line of sight (lair panel 11, all five: a cave chamber was bare floor).
  let pillared = props;
  {
    const inFeature = new Set(feature);
    const wallish = (c: number) =>
      near(c).some((n) => n < 0 || n >= made.ground.length || ground[n] !== GROUND_CHARS.floor || inFeature.has(n));
    const doorNear = (c: number) =>
      doors.some(
        (d) => Math.abs((d % made.width) - (c % made.width)) + Math.abs(Math.floor(d / made.width) - Math.floor(c / made.width)) <= 2,
      );
    const fx = feature.length ? feature.reduce((n, c) => n + (c % made.width), 0) / feature.length : 0;
    const fy = feature.length ? feature.reduce((n, c) => n + Math.floor(c / made.width), 0) / feature.length : 0;
    const chars0 = [...props];
    const candidates = open
      .filter((c) => !inFeature.has(c) && !wallish(c) && !doorNear(c) && ground[c] === GROUND_CHARS.floor && chars0[c] === "-")
      .filter((c) => !near(c).some((n) => wallish(n)))
      .sort(
        (p, q) =>
          Math.hypot((q % made.width) - fx, Math.floor(q / made.width) - fy) -
            Math.hypot((p % made.width) - fx, Math.floor(p / made.width) - fy) || p - q,
      );
    const placed: number[] = [];
    const chars = [...props];
    const base = dungeonStepsFrom({ ...made, ground: [...ground].map((ch) => GROUND_OF[ch] ?? "rock"), props: chars.map(dungeonPropOfChar) }, made.entrance);
    for (const c of candidates) {
      if (placed.length >= Math.min(4, Math.floor(cells.length / 30))) break;
      if (placed.some((q) => Math.abs((q % made.width) - (c % made.width)) + Math.abs(Math.floor(q / made.width) - Math.floor(c / made.width)) < 4))
        continue;
      chars[c] = "0";
      const reached = dungeonStepsFrom(
        { ...made, ground: [...ground].map((ch) => GROUND_OF[ch] ?? "rock"), props: chars.map(dungeonPropOfChar) },
        made.entrance,
      );
      if (base.every((st, i) => st < 0 || i === c || reached[i]! >= 0)) placed.push(c);
      else chars[c] = "-";
    }
    pillared = chars.join("");
  }
  return {
    ...kept,
    ground,
    props: pillared,
    lairRoom,
    ...(lairCrawl ? { lairCrawl } : {}),
    ...(feature.length
      ? { lairFeature: feature.map((c) => ({ x: c % made.width, y: Math.floor(c / made.width) })) }
      : {}),
  };
}

/**
 * One floor of a place as the game keeps it (owner 2026-11-13: separate maps per floor), the party at its
 * way in. Above the deepest, the way down stands in the area furthest from the way in, on a floor cell
 * against a wall where it can be; the way in of a floor below the first is its way up.
 */
export function gameDungeonMapForFloor(input: {
  setId: string;
  name: string;
  siteSeed: number;
  floor: number;
  floors: number;
  id: string;
  size?: DungeonMapSize;
  /** A creature's lair (owner 2026-11-18): its deepest floor's great chamber holds its maker. */
  lair?: DungeonLairKind;
}): GameDungeonMap {
  const floor = Math.max(1, Math.min(input.floors, input.floor));
  const made = generateDungeonMap(input.setId, dungeonFloorSeed(input.siteSeed, floor), input.size ?? "medium");
  const kept = {
    ...gameDungeonMapFromDungeon(made, input.name, input.id),
    ...(input.lair ? { lairKind: input.lair } : {}),
    ...(input.floors > 1 || input.lair ? { siteSeed: input.siteSeed } : {}),
  };
  const floors = input.floors > 1 ? { floor, floors: input.floors, siteSeed: input.siteSeed } : {};
  if (floor >= input.floors)
    return input.lair ? caveLairFloor({ ...kept, ...floors }, made, input.lair) : { ...kept, ...floors };
  // Steps from the way in, to find the furthest area and the furthest floor cell in it.
  const steps = new Int32Array(made.width * made.height).fill(-1);
  const start = made.entrance.y * made.width + made.entrance.x;
  steps[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]!;
    const x = cell % made.width;
    const y = (cell - x) / made.width;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      if (!dungeonWalkable(made, x + dx, y + dy)) continue;
      const next = (y + dy) * made.width + x + dx;
      if (steps[next] !== -1) continue;
      steps[next] = steps[cell]! + 1;
      queue.push(next);
    }
  }
  let down: { x: number; y: number } | null = null;
  let best = -1;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]! <= 0 || made.props[i] !== -1) continue;
    const x = i % made.width;
    const y = (i - x) / made.width;
    // The furthest cell, one against a wall above it first (stairs set into the rock, as the way in is).
    const score = steps[i]! * 2 + (y > 0 && made.ground[(y - 1) * made.width + x] === "wall" ? 1 : 0);
    if (score > best) [down, best] = [{ x, y }, score];
  }
  if (!down) return { ...kept, ...floors };
  const props = [...kept.props];
  props[down.y * kept.width + down.x] = String(DUNGEON_EXIT_PROP);
  return { ...kept, ...floors, props: props.join(""), down };
}

/** A place's hand-made map (map editor Phase 3) as the map a game keeps: its cells, its props by slot
 *  (drawn only), in at its entry. */
export function gameDungeonMapFromPlaceMap(
  map: WorldPlaceMap,
  name: string,
  set: DungeonSet,
  id: string,
  place: string,
  /** A person's name by their id, for the people on the map's spots (one with none is left off). */
  personName: (id: string) => string | undefined = () => undefined,
): GameDungeonMap {
  const spots = (map.spots ?? []).map((spot) => ({
    x: spot.x,
    y: spot.y,
    name: spot.name,
    people: (spot.people ?? []).flatMap((person) => {
      const named = personName(person);
      return named ? [{ id: person, name: named }] : [];
    }),
    ...(spot.from !== undefined ? { from: spot.from } : {}),
    ...(spot.to !== undefined ? { to: spot.to } : {}),
  }));
  const props = Array.from({ length: map.width * map.height }, () => "-");
  for (const prop of map.props ?? []) props[prop.y * map.width + prop.x] = prop.tile.replace(/^dn_prop/u, "");
  return {
    id,
    name: name.trim().slice(0, 80) || set.label,
    place,
    set: set.id,
    ...(map.pack ? { pack: map.pack } : {}),
    hand: true,
    ...(map.words ? { words: structuredClone(map.words) } : {}),
    seed: 0,
    width: map.width,
    height: map.height,
    ground: map.ground,
    props: props.join(""),
    rooms: [],
    entrance: map.entry,
    at: map.entry,
    ...(spots.length ? { spots } : {}),
  };
}

/** The spots of a kept map whose people stand there at an hour (all day when a spot names no hours;
 *  hours wrap past midnight), as `worldPlaceMapSpotsAt` reads a map made by hand. */
export function gameDungeonSpotsAt(map: GameDungeonMap, hour: number): NonNullable<GameDungeonMap["spots"]> {
  return (map.spots ?? []).filter((spot) => {
    const [from, to] = [spot.from ?? 0, spot.to ?? 24];
    return from <= to ? hour >= from && hour < to : hour >= from || hour < to;
  });
}

/** The way out in words for leaving by it: "the stairs", "the ladder", "the ladder hatch" (the set's
 *  word for the tile says which way it goes, which leaving does not). */
export function dungeonWayOutWords(set: DungeonSet): string {
  // A trailing " down"/" up" goes without a /\s+(down|up)$/ regex, which stalls on long runs of spaces.
  const exit = set.props[DUNGEON_EXIT_PROP] ?? "way out";
  const way = ["down", "up"].find((word) => exit.endsWith(word));
  const head = way ? exit.slice(0, -way.length) : "";
  const tile = head.trimEnd() !== head ? head.trimEnd() : exit;
  return /^(an?|the) /u.test(tile) ? tile.replace(/^an? /u, "the ") : `the ${tile}`;
}

/** The ways out a set can have, for the label the client shows in the reader's language. */
export const DUNGEON_WAY_OUT_IDS = ["stairs", "ladder", "ladder_hatch", "door", "way_out"] as const;
export type DungeonWayOutId = (typeof DUNGEON_WAY_OUT_IDS)[number];

/** The way out of a set as an id (`dungeonWayOutWords` without its words): "stairs", "ladder",
 *  "ladder_hatch", else "way_out". */
export function dungeonWayOutId(set: DungeonSet | undefined): DungeonWayOutId {
  if (!set) return "way_out";
  const id = dungeonWayOutWords(set).replace(/^the /u, "").replace(/\s+/gu, "_");
  return (DUNGEON_WAY_OUT_IDS as readonly string[]).includes(id) ? (id as DungeonWayOutId) : "way_out";
}

/** Words in a place's name that make it one to go down into (map editor Phase 3, generated maps for
 *  places), and the look each gives. Only these: a "Frozen Flagon" or a "Gem Merchant" stays an inn and
 *  a shop. Station words only in a science fiction setting, and only for a station that is a ruin or a
 *  shelter: a research station or a maglev station in town is a building like any other. */
const PLACE_CORE =
  /\b(caves?|caverns?|grotto|grottoes|mines?|mineshaft|crypts?|tombs?|catacombs?|barrows?|ossuary|mausoleum|sewers?|cisterns?|tunnels?|undercroft|ruins?|ruined|dungeons?|labyrinth|oubliette|warrens?|lairs?|delve)\b/u;
const SHELTER_CORE = /\b(derelict|bunkers?|hangars?|orbital|space station)\b/u;
/** Of a place to go down into, the look its words give, in the order they are read; else by its kind. */
const PLACE_LOOKS: ReadonlyArray<[RegExp, string]> = [
  [/\b(lava|magma|volcanic|volcano|molten)\b/u, "cave_lava"],
  [/\b(ice|icy|frozen|glacier)\b/u, "cave_ice"],
  [/\b(crystal|crystals|crystalline|geode)\b/u, "cave_crystal"],
  [/\b(crypts?|tombs?|catacombs?|barrows?|ossuary|mausoleum)\b/u, "dungeon_crypt"],
  [/\b(sewers?|cisterns?|tunnels?|undercroft)\b/u, "dungeon_sewer"],
  [/\b(ruins?|ruined)\b/u, "dungeon_temple"],
  [/\b(dungeons?|labyrinth|oubliette)\b/u, "dungeon_crypt"],
];
const STATION_LOOKS: ReadonlyArray<[RegExp, string]> = [
  [/\b(labs?|laborator\w*)\b/u, "station_lab"],
  [/\b(reactors?|engines?|engineering)\b/u, "station_engine"],
  [/\b(hydroponics?|greenhouse)\b/u, "station_hydro"],
];

/** Buildings laid out to a plan (building plans, 2026-11-14), by the words of their names. */
const BUILDING_LOOKS: ReadonlyArray<[RegExp, string]> = [
  [/\b(temples?|monaster(y|ies)|abbey|church|cathedral|chapel|shrine|priory|convent|sanctum)\b/u, "building_temple"],
  [/\b(keeps?|castles?|forts?|fortress|citadel|stronghold|towers?|bastion)\b/u, "building_keep"],
  [/\b(manors?|mansions?|estate|villa|hall|house|lodge|palace|chateau)\b/u, "building_manor"],
];
/** Words that make a building one to explore: a house in use is a house, a haunted one is a dungeon. */
const BUILDING_MENACE =
  /\b(ruins?|ruined|abandoned|haunted|cursed|forsaken|burnt|burned|derelict|fallen|lost|dread|deserted|accursed|blighted)\b/u;

/** A building's look by its name, for a game whose art is not science fiction; null for none. */
export function dungeonBuildingSetForName(name: string, family: string | undefined): DungeonSet | null {
  if (family === "scifi") return null;
  const words = name.toLowerCase();
  const id = BUILDING_LOOKS.find(([pattern]) => pattern.test(words))?.[1];
  return id ? (DUNGEON_SETS.find((set) => set.id === id) ?? null) : null;
}

/** The look of a map for a place, by its name (and the tags "mine" and "ruin"), or null for a place
 *  that is not one to go down into (a house, an inn, a market). */
export function dungeonSetForPlace(
  place: { name?: string; tags?: readonly string[] },
  family: string | undefined,
): DungeonSet | null {
  const name = (place.name ?? "").toLowerCase();
  const tags = (place.tags ?? []).map((tag) => tag.toLowerCase());
  const byId = (id: string) => DUNGEON_SETS.find((set) => set.id === id)!;
  // A building gone bad (a haunted manor, a ruined keep, an abandoned temple) is explored room by room.
  if (BUILDING_MENACE.test(name)) {
    const building = dungeonBuildingSetForName(name, family);
    if (building) return building;
  }
  // A bunker or a derelict is a station's corridors in any setting; a station only in science fiction.
  if (SHELTER_CORE.test(name) && (family === "scifi" || /\b(derelict|bunkers?)\b/u.test(name)))
    return byId(STATION_LOOKS.find(([pattern]) => pattern.test(name))?.[1] ?? "station_corridor");
  if (PLACE_CORE.test(name)) return byId(PLACE_LOOKS.find(([pattern]) => pattern.test(name))?.[1] ?? "cave_rock");
  if (tags.includes("ruin")) return byId("dungeon_temple");
  if (tags.includes("mine")) return byId("cave_rock");
  return null;
}

/** The set a map of this kind uses in a setting of this art family: a station for a science fiction
 *  setting, else the kind's first set; a named set wins when it is one. */
export function dungeonSetFor(kind: string | undefined, family: string | undefined, named?: string): DungeonSet {
  const byId = named
    ? DUNGEON_SETS.find((set) => set.id === named || set.label.toLowerCase() === named.toLowerCase())
    : undefined;
  if (byId) return byId;
  const wanted: DungeonKind =
    kind === "cave" || kind === "dungeon" || kind === "station" ? kind : family === "scifi" ? "station" : "dungeon";
  return DUNGEON_SETS.find((set) => set.kind === wanted)!;
}

/** Which of the map's areas a cell is in (1-based), or 0 for a passage between them. */
export function dungeonAreaAt(map: { rooms: readonly DungeonRoom[] }, x: number, y: number): number {
  return map.rooms.findIndex((room) => dungeonRoomHas(room, x, y)) + 1;
}

/** How long a walk of `steps` cells takes: a cell is about two metres, a minute some thirty of them. */
export function dungeonWalkMinutes(steps: number): number {
  return Math.max(1, Math.round(steps / 30));
}

/** A planned building's ways between levels, in words. */
/** What the Game Master is told a floor below ground is built round (panel round 52). */
const SITE_THEME_WORDS: Record<string, string> = {
  flooded:
    "This floor is flooded: knee-deep black water runs down its galleries (drawn on the map). Wading is slow (half speed) and loud: a sneaking party wading makes a stealth check at disadvantage, and a fight in the water is on bad footing.",
  fallen:
    "Part of this floor's vault has come down: a gallery is choked with fallen stone, so the way on goes round through the rooms. The heaps are difficult ground and the ceiling still groans; loud noise or a blast may bring more down.",
  bones:
    "Its galleries are lined with the dead, skeletons laid on shelves cut into the rock on both sides: cramped, watched by empty eyes, and a place where the restless dead could rise from the walls.",
  plague:
    "This floor was where the plague dead were thrown: its pit is a sump of lime and rot (drawn as standing filth), the air thick; anyone who wades in or lingers by it risks the sickness (a constitution check).",
  robbed:
    "Robbers have been through this floor before the party: tombs broken open, rooms ransacked, and their own tunnel dug in.",
};
const SITE_LINK_WORDS: Record<string, string> = {
  stairs: "the main stairs",
  servants: "the servants' stairs",
  ladder: "a ladder",
  hidden: "a hidden stair",
  hole: "a collapsed floor",
};

/** The map and where the party stands, for the Game Master. */
export function gameDungeonMapPromptText(map: GameDungeonMap, hour?: number): string {
  const cells = dungeonFromGameDungeonMap(map);
  const area = dungeonAreaAt(map, map.at.x, map.at.y);
  const where = !map.rooms.length
    ? gameDungeonOnWayOut(map)
      ? "by the way out"
      : "inside"
    : area
      ? `in area ${area}`
      : map.roomInfo
        ? "in the hall"
        : "in a passage between areas";
  // Who stands where now, on a map made by hand with spots.
  const here =
    hour === undefined
      ? []
      : gameDungeonSpotsAt(map, hour).flatMap((spot) =>
          spot.people.length ? [`${spot.name}: ${spot.people.map((person) => person.name).join(", ")}`] : [],
        );
  // A place of several floors: which one, and where the ways up and down are.
  const floors =
    map.floors && map.floors > 1
      ? ` This is floor ${map.floor ?? 1} of ${map.floors}${
          map.down
            ? `; the way down is in ${dungeonAreaAt(map, map.down.x, map.down.y) ? `area ${dungeonAreaAt(map, map.down.x, map.down.y)}` : "a passage"}`
            : "; there is no deeper floor"
        }${(map.floor ?? 1) > 1 ? ", and the way the party came in leads back up" : ""}.`
      : "";
  // A planned building: its level, the ways to the others, its locked doors and the traps the party found.
  const site = map.site;
  const planned = site
    ? ` This is the ${site.levels[site.level]?.name ?? "level"} of ${site.levels.length} levels (${site.levels
        .map((level) => level.name)
        .join(", ")}).${
        map.links?.length
          ? ` Ways to other levels: ${map.links
              .map((link) => {
                const area = dungeonAreaAt(map, link.x, link.y);
                const to = site.levels[link.level]?.name ?? "another level";
                return `${SITE_LINK_WORDS[link.kind] ?? "stairs"} to the ${to}${area ? ` in area ${area}` : " in the hall"}`;
              })
              .join("; ")}.`
          : ""
      }${
        map.locks?.length
          ? ` Locked: ${map.locks.map((lock) => `area ${lock.room + 1}${map.roomInfo?.[lock.room] ? ` (${map.roomInfo[lock.room]!.name})` : ""}, its key in area ${lock.key + 1}`).join("; ")}. The Engine opens a lock when the party walks into its key's area; [map: unlock area=N] opens one the story opens (forced, picked, a key given).`
          : ""
      }${
        map.creaks?.length
          ? ` Loose ${site.template === "crypt" || (site.levels[site.level]?.depth ?? 0) < 0 ? "rubble" : "boards"} on the way round in ${[
              ...new Set(
                map.creaks.map((c) => {
                  const area = dungeonAreaAt(map, c.x, c.y);
                  return area ? `area ${area}` : "a passage";
                }),
              ),
            ].join(", ")}: anyone sneaking over them makes a stealth check or is heard by the nearest holders.${
              map.quietWayLong?.length ? " A second, longer way round has no loose boards: slower, but silent." : ""
            }`
          : map.quietWayLong?.length
            ? " There are two ways round the held room, a short one and a longer one through other rooms."
            : ""
      }${map.theme ? ` ${SITE_THEME_WORDS[map.theme]}` : ""}${
        map.tunnel?.length
          ? (() => {
              const end = map.tunnel.at(-1)!;
              const area = dungeonAreaAt(map, end.x, end.y);
              return ` A robbers' tunnel, low and narrow, is dug through the rock${area ? ` into area ${area}` : ""}, past its lock: whoever finds it gets in without the key.`;
            })()
          : ""
      }${
        map.secretWay
          ? ` A hidden door ${(() => {
              const area = dungeonAreaAt(map, map.secretWay.x, map.secretWay.y);
              return area ? `in area ${area}` : "off a passage";
            })()} leads past the held room, quick and unseen: a scrape on the floor is its tell, and a party that searches there (a perception check) finds it. Never name it before they do.`
          : ""
      }${
        map.traps?.some((trap) => trap.found)
          ? ` Traps the party found (shown on the map, walked round): ${map.traps
              .filter((trap) => trap.found)
              .map((trap) => {
                const area = dungeonAreaAt(map, trap.x, trap.y);
                return area ? `area ${area}` : "the hall";
              })
              .join(", ")}.`
          : ""
      }`
    : "";
  const areaName = (n: number) => (n && map.roomInfo?.[n - 1] ? ` (${map.roomInfo[n - 1]!.name})` : "");
  // A creature's lair floor (owner 2026-11-18): its great chamber and what is in it.
  const lairKind = map.lairKind ?? site?.lair;
  const lairHeart =
    map.lairRoom ??
    (site?.lair && site.level === site.levels.length - 1 ? map.roomInfo?.findIndex((room) => room.heart) : undefined);
  const lair =
    lairKind && lairHeart !== undefined && lairHeart >= 0
      ? ` This floor is the lair itself, ${DUNGEON_LAIRS[lairKind].label}: its great chamber is area ${lairHeart + 1}, and in it is ${DUNGEON_LAIR_FEATURE_WORDS[lairKind]}.${
          map.lairCrawl
            ? " A crawl shored with old timber leads into the chamber from the side, away from its guarded mouth: a quiet way in for a party that finds it."
            : ""
        }${(() => {
          const deed = DUNGEON_LAIR_DEEDS[lairKind];
          const room = map.roomInfo?.findIndex((info) => dungeonLairDeedRoom(lairKind, info?.name)) ?? -1;
          if (room < 0) return "";
          const done = dungeonLairDeedDone(lairKind, map);
          const label = DUNGEON_LAIR_ACTIONS[lairKind][deed.stops]?.label ?? "one of its lair's actions";
          // The deed room's back way: a cracked wall from it into the chamber (lair panel 14: one way in).
          const deedBox = cells.rooms[room];
          const heartBox = cells.rooms[lairHeart];
          const backWay =
            deedBox && heartBox
              ? cells.props.some((prop, i) => {
                  if (prop !== DUNGEON_SECRET_DOOR_PROP) return false;
                  const [x, y] = [i % cells.width, Math.floor(i / cells.width)];
                  const near = [
                    [x + 1, y],
                    [x - 1, y],
                    [x, y + 1],
                    [x, y - 1],
                  ] as const;
                  return (
                    near.some(([nx, ny]) => dungeonRoomHas(deedBox, nx, ny)) &&
                    near.some(([nx, ny]) => dungeonRoomHas(heartBox, nx, ny))
                  );
                })
              : false;
          const back = backWay
            ? ` A cracked wall in that room gives onto the great chamber: a party that does the deed quietly can go on through it and come at the maker from behind its guarded mouth.`
            : "";
          return done
            ? ` The party has been in area ${room + 1} (${deed.room}) and did it: they ${deed.deed}, and the lair will have no ${label} when they face its maker.${back}`
            : ` In area ${room + 1} (${deed.room}) the party can ${deed.deed} before they face the maker. One of its servants keeps the room, and any way past it serves: a fight, a quiet kill, slipping by, a bribe or a lie, a key taken from another servant, a lock picked, a spell; and the deed itself can be done the room's own way (rubble, fire, water, a lever) as the party thinks of it. Narrate the way they chose. The Engine counts it done when they go in, and the lair then has no ${label} in that fight. Let the room show it.${back}`;
        })()}`
      : "";
  return `MAP: ${map.name}.${floors}${planned}${lair} ${dungeonMapWords(cells)} The party is ${where}${areaName(area)}${
    gameDungeonOnWayDown(map) ? ", at the way down" : gameDungeonOnWayUp(map) ? ", at the way up" : ""
  }.${here.length ? ` Here now: ${here.join("; ")}.` : ""}`;
}

/** A walk on the map, told to the Game Master on the next turn. */
export function gameDungeonWalkText(map: GameDungeonMap, walk: GameDungeonWalk): string {
  const from = dungeonAreaAt(map, walk.from.x, walk.from.y);
  const to = dungeonAreaAt(map, walk.to.x, walk.to.y);
  const minutes = `${walk.minutes} minute${walk.minutes === 1 ? "" : "s"}`;
  if (!map.rooms.length) return `The party walked across ${map.name} (${minutes}).`;
  const where = (area: number) =>
    area
      ? `area ${area}${map.roomInfo?.[area - 1] ? ` (${map.roomInfo[area - 1]!.name})` : ""}`
      : map.roomInfo
        ? "the hall"
        : "a passage";
  const opened = walk.unlocked?.length
    ? ` On the way they found the key that opens ${walk.unlocked.join(" and ")}; the lock is open.`
    : "";
  const trap = walk.trap
    ? ` In ${where(walk.trap.area)} they set off a hidden trap (DC ${walk.trap.dc}): their walk stopped there. Resolve it by the rules (a save, or its harm) and describe it.`
    : "";
  return `The party walked from ${where(from)} to ${where(to)} of ${map.name} (${walk.minutes} minute${walk.minutes === 1 ? "" : "s"}).${opened}${trap}`;
}

/** What a reply's `[map: ...]` tags ask for, in order: a map to go into, or leaving the one the party
 *  is on. `[map_update: ...]` is the node map's own tag and never one of these. */
export type GameDungeonTag =
  | { leave: true }
  | { leave?: false; reveal?: false; kind?: string; name: string; set?: string }
  /** `[map: reveal name="..."]`: a site the story keeps closed is opened to the party (no map is opened). */
  | { leave?: false; reveal: true; name: string };

export function readGameDungeonTags(text: string): GameDungeonTag[] {
  const tags: GameDungeonTag[] = [];
  // Each `[map:` runs to the first "]" after it, found by indexOf: a /\[map:\s*([^\]]*)\]/ regex stalls
  // on a long tag left open (many spaces, or many `[map:`, with no "]" after them).
  const opener = /\[map:/giu;
  for (let open = opener.exec(text); open; open = opener.exec(text)) {
    const close = text.indexOf("]", opener.lastIndex);
    if (close < 0) break;
    const body = text.slice(opener.lastIndex, close).trimStart();
    opener.lastIndex = close + 1;
    if (/^\s*leave\b/iu.test(body) || /\baction\s*=\s*"leave"/iu.test(body)) {
      tags.push({ leave: true });
      continue;
    }
    // One line of plain text: a name goes into the Game Master's prompt.
    const value = (key: string) =>
      body
        .match(new RegExp(`\\b${key}\\s*=\\s*"([^"]{0,80})"`, "iu"))?.[1]
        ?.replace(/[\p{Cc}\s]+/gu, " ")
        .trim();
    const name = value("name");
    if (!name) continue;
    if (/^\s*reveal\b/iu.test(body) || /\baction\s*=\s*"reveal"/iu.test(body)) {
      tags.push({ reveal: true, name });
      continue;
    }
    tags.push({ name, kind: value("kind")?.toLowerCase(), set: value("set") });
  }
  return tags;
}

/** A seed from a game and a name, so the same place makes the same map when it is gone into again. */
export function gameDungeonSeed(chatId: string, name: string): number {
  let hash = 0x811c9dc5;
  for (const char of `${chatId}|${name.toLowerCase()}`) hash = Math.imul(hash ^ char.charCodeAt(0), 0x01000193) >>> 0;
  return hash;
}

/** A walk or a leaving not yet told, for the next turn. */
export function gameDungeonToldText(
  map: GameDungeonMap | null,
  walk: GameDungeonWalk | null,
  left: string | null,
): string {
  const lines: string[] = [];
  if (left) lines.push(`The party has left ${left} by its way out.`);
  if (map && walk && walk.map === map.id) lines.push(gameDungeonWalkText(map, walk));
  return lines.join(" ");
}
