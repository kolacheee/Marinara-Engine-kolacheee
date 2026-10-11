// ──────────────────────────────────────────────
// Inside a building (worldgen W13): the rooms behind a town building's door, furnished for what the
// building is: a home sleeps the people who live there, a workplace seats the people who work there,
// a temple has its altar and benches, a tavern its counter and tables. Its size follows what it holds,
// never a fixed table; its variations (which side the second room is on, where the hearth stands) come
// from a stream of its own, so nothing else in the world moves. Pure: the same building gives the same
// rooms. A quarter, a district or a neighbourhood is a part of town, not a building: it has none.
//
// Rooms are laid out when asked for, never kept in a world's snapshot (W11): a world holds a thousand or
// more buildings, most of them homes nobody named, and the rooms are what the party sees and what the
// Game Master is told in words, not world state. `WORLD_INTERIOR_VERSION` and the world-interiors lane's
// pinned rooms keep them from changing under a world unnoticed: a change to the layout bumps the
// version on purpose. Rooms laid out by hand (W13b) are kept in the world's hand edits.
// ──────────────────────────────────────────────
import { worldStream } from "./compile.js";
import {
  WORLD_BED_FURNITURE,
  WORLD_WALL_FURNITURE,
  WORLD_WIDE_FURNITURE,
  type WorldFurniture,
  type WorldInteriorUse,
} from "./furniture.js";
import type { GameWorld } from "./game-world.js";
import type { WorldPerson } from "./people.js";
import { worldTownWhere, type WorldTown, type WorldTownBuilding } from "./town.js";

/** Bumped whenever a building's rooms would lay out differently. 2: rooms seen three-quarters on, their
 *  back walls two cells deep (WORLD_INTERIOR_BACK_WALL), a hearth, shelves and bookcases standing against
 *  them, decorations hung high on them, tables two cells across, rugs of their own sizes, beds two cells
 *  long (double beds and bunk beds among them), and more buildings split into two rooms. */
export const WORLD_INTERIOR_VERSION = 2;
/** How deep a laid-out room's back (north) wall is, in cells: its face is seen from the room. */
export const WORLD_INTERIOR_BACK_WALL = 2;
/** How many wall decorations a tile pack may draw (`in_wall_deco0` on). */
export const WORLD_INTERIOR_DECOR_COUNT = 8;
/** A rug's tile by its size: one cell by the way in, a runner, a square one, a large one. */
export const WORLD_INTERIOR_RUG_SIZES = Object.freeze([
  { w: 1, h: 1, tile: "in_rug" },
  { w: 2, h: 1, tile: "in_rug_runner" },
  { w: 2, h: 2, tile: "in_rug_square" },
  { w: 3, h: 2, tile: "in_rug_large" },
] as const);

export { WORLD_INTERIOR_USES, type WorldInteriorUse } from "./furniture.js";

export {
  WORLD_BED_FURNITURE,
  WORLD_FURNITURE,
  WORLD_WALL_FURNITURE,
  WORLD_WIDE_FURNITURE,
  type WorldFurniture,
} from "./furniture.js";

export const WORLD_INTERIOR_ROOMS = Object.freeze(["main", "sleep", "back"] as const);
export type WorldInteriorRoom = (typeof WORLD_INTERIOR_ROOMS)[number];

export interface WorldInterior {
  buildingId: string;
  use: WorldInteriorUse;
  /** Cells across and down, walls included. */
  width: number;
  height: number;
  /** One character per cell, row by row: "#" wall, "." floor, "d" a doorway between rooms, "D" the way out. */
  ground: string;
  /** The way out, in the bottom wall: where the party stands on coming in. */
  door: { x: number; y: number };
  rooms: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    use: WorldInteriorRoom;
    /** A room drawn by hand need not be a rectangle: its floor cells (index y * width + x), when given. */
    cells?: number[];
  }>;
  furniture: Array<{ x: number; y: number; kind: WorldFurniture }>;
  /** What hangs high on the walls' faces (the row above the one against the floor): `pick` is which of the
   *  pack's decorations (`in_wall_deco<pick>`, or the next it has). Never above a piece standing against
   *  the wall. */
  decor: Array<{ x: number; y: number; pick: number }>;
  /** Rugs, flat on the floor under whatever stands on them, `w` by `h` cells (WORLD_INTERIOR_RUG_SIZES). */
  rugs: Array<{ x: number; y: number; w: number; h: number }>;
  /** Where each person who belongs here is while here, by person id: a work spot, or their bed. */
  seats: Record<string, { x: number; y: number }>;
}

/** What a workplace or a place is furnished as, by the words of its trade, its name and its tags. The
 *  lists reach across settings: an inn, a teahouse, a saloon and a cantina are all taverns. The first
 *  list that matches wins. */
const USE_WORDS: ReadonlyArray<readonly [WorldInteriorUse, RegExp]> = [
  [
    "tavern",
    /\b(inns?|innkeepers?|taverns?|alehouses?|pubs?|bars?|barkeeps?|bartenders?|saloons?|speakeasy|speakeasies|cantinas?|teahouses?|tea ?houses?|wine ?shops?|izakayas?|caf[eé]s?|coffee ?houses?|coffee ?shops?|diners?|restaurants?|canteens?|mess ?halls?|hostels?|hotels?|motels?|brewers?|brewery|breweries|cooks?|noodle|dumpling|baristas?|boarding ?houses?|clubs?|nightclubs?|capsule)\b/i,
  ],
  [
    "worship",
    /\b(temples?|shrines?|churche?s?|chapels?|cathedrals?|abbey|abbeys|monaster(?:y|ies)|mosques?|synagogues?|pagodas?|sanctuar(?:y|ies)|oracles?|priests?|priestess(?:es)?|monks?|nuns?|clerics?|shamans?|chaplains?|imams?|rabbis?|faith|holy|sacred|daoist|taoist|buddhist)\b/i,
  ],
  [
    "clinic",
    /\b(clinics?|hospitals?|infirmar(?:y|ies)|apothecar(?:y|ies)|pharmac(?:y|ies)|pharmacists?|med ?bays?|surger(?:y|ies)|surgeons?|healers?|herbalists?|doctors?|physicians?|medics?|nurses?|alchemists?|medicine|ripperdocs?)\b/i,
  ],
  [
    "guard",
    /\b(guards?|barracks|garrisons?|watch ?houses?|watchmen|police|sheriffs?|constables?|militia|soldiers?|patrols?|security|marshals?|forts?|outposts?|enforcers?|wardens?|yamen|cops?|sentr(?:y|ies)|bouncers?|gate ?watchers?)\b/i,
  ],
  [
    "study",
    /\b(librar(?:y|ies)|librarians?|archives?|archivists?|schools?|academ(?:y|ies)|colleges?|universit(?:y|ies)|scriptorium|observator(?:y|ies)|labs?|laborator(?:y|ies)|scholars?|scribes?|teachers?|tutors?|sages?|scientists?|researchers?|mages?|wizards?|astrologers?|offices?|professors?|bureaucrats?|diplomats?|archaeologists?|reporters?|journalists?|netrunners?|hackers?|radio)\b/i,
  ],
  [
    "training",
    /\b(dojos?|training ?halls?|martial ?halls?|sects?|sect ?halls?|gyms?|gymnasi(?:um|a)|arenas?|fencing|sword ?schools?|disciples?|drill ?yards?|boxing)\b/i,
  ],
  [
    "store",
    /\b(farmers?|farms?|farmland|fishers?|fishermen|fisherm[ae]n|fishing|miners?|mines?|mining|woodcutters?|lumberjacks?|hunters?|gardeners?|gardens?|groundskeepers?|scavengers?|boatm[ae]n|boats?|sailors?|dockhands?|stablehands?|stables?|granar(?:y|ies)|warehouses?|storehouses?|depots?|silos?|barns?|sheds?|scrapyards?|rangers?|herders?|shepherds?)\b/i,
  ],
  [
    "workshop",
    /\b(smiths?|blacksmiths?|forges?|smith(?:y|ies)|workshops?|carpenters?|joiners?|masons?|potters?|weavers?|tailors?|tanners?|cobblers?|crafters?|craftsm[ae]n|artisans?|mechanics?|engineers?|garages?|factor(?:y|ies)|mills?|millers?|foundr(?:y|ies)|fabricators?|machinists?|tinkers?|tinkerers?|technicians?|repair|armou?rers?|weaponsmiths?|jewell?ers?|workers?|labou?rers?|builders?|shipwrights?|wrights?|dockyards?)\b/i,
  ],
  [
    "shop",
    /\b(shops?|shopkeepers?|stores?|markets?|bazaars?|souks?|stalls?|merchants?|traders?|trading|vendors?|grocers?|bakers?|baker(?:y|ies)|butchers?|chandlers?|pawn|emporium|boutiques?|dealers?|brokers?|sellers?|peddlers?|pedlars?|hawkers?|booksellers?|hairdressers?|barbers?|florists?|clerks?)\b/i,
  ],
];

/** Fewest and most floor cells across and down a room. */
const MAIN_W = [5, 15] as const;
const MAIN_H = [4, 8] as const;
/** The most beds or work spots a building lays out. */
const MOST_PEOPLE = 8;

const clamp = (value: number, [low, high]: readonly [number, number]) => Math.max(low, Math.min(high, value));

/** Words without their accents (café, Café Noir), so the word lists' word boundaries hold. */
const plain = (words: string) => words.normalize("NFD").replace(/\p{M}/gu, "");

/** What a place the story added is furnished as, by its name alone, or nothing for a part of town. */
export function worldNamedPlaceUse(name: string): WorldInteriorUse | undefined {
  const words = plain(name);
  if (PART_OF_TOWN.test(words) && !USE_WORDS.some(([, pattern]) => pattern.test(words))) return undefined;
  return worldInteriorUse({ kind: "place", name });
}

/** The words of a part of town rather than a building: a place on such a layer has no rooms. */
const PART_OF_TOWN =
  /\b(quarters?|districts?|neighbou?rhoods?|wards?|boroughs?|sectors?|zones?|precincts?|parishes?|suburbs?|outskirts|areas?|levels?|decks?|rings?|blocks?|streets?|squares?|plazas?|parks?|docks?|harbou?rs?|ports?|beach(?:es)?|grounds?|fields?|woods?|forests?|cemeter(?:y|ies)|graveyards?)\b/i;

/** What a building is furnished as, from the words of its place's tags first, then its trade, then its
 *  name (each on whole words); `tags` are its world place's, when it is one. */
export function worldInteriorUse(
  building: Pick<WorldTownBuilding, "kind" | "role" | "name">,
  tags: readonly string[] = [],
): WorldInteriorUse {
  if (building.kind === "home") return "home";
  if (building.kind === "landmark") return "hall";
  for (const words of [tags.join(" ").replace(/_/g, " "), building.role ?? "", building.name ?? ""].map(plain)) {
    if (!words) continue;
    for (const [use, pattern] of USE_WORDS) if (pattern.test(words)) return use;
  }
  return building.kind === "place" ? "hall" : "workroom";
}

/** Whether a building has rooms: not when it stands for a part of town (a quarter, a district), by its
 *  place's layer in the kit or, for a place the story added, its name. */
export function worldBuildingHasRooms(game: GameWorld, building: WorldTownBuilding): boolean {
  if (building.kind !== "place") return true;
  const place = building.placeId ? game.world.places.find((each) => each.id === building.placeId) : undefined;
  const layer = place ? game.kit.layers.find((each) => each.id === place.layer) : undefined;
  if (layer) return !PART_OF_TOWN.test(`${layer.label} ${layer.id}`);
  // A place the story added has only its name: "the Old Quarter" is a part of town, "the Harbour Inn" a
  // building.
  return worldNamedPlaceUse(building.name ?? "") !== undefined;
}

/** A building's rooms, laid out now. Null for no such building, or one that is a part of town. */
export function worldInterior(game: GameWorld, town: WorldTown, buildingId: string): WorldInterior | null {
  const building = town.buildings.find((each) => each.id === buildingId);
  if (!building || !worldBuildingHasRooms(game, building)) return null;
  const laidOut = layOutInterior(game, town, building);
  const edit = game.edits?.interiors?.find(
    (each) => each.settlement === town.settlementId && each.building === buildingId,
  );
  if (!edit) return laidOut;
  // Rooms drawn by hand (W13c): in place of the laid-out rooms while the building is still what they were
  // drawn for; one that no longer passes its checks falls back to the laid-out rooms.
  if (edit.ground !== undefined) {
    if (edit.use && edit.use !== laidOut.use) return laidOut;
    if (handRoomIssues(edit).length) return laidOut;
    const drawn = drawnByHand(town, building, laidOut.use, edit);
    return {
      ...drawn,
      decor: wallDecor(game, town, building, drawn.width, drawn.height, drawn.ground, drawn.furniture),
    };
  }
  // Furnished by hand (W13b) when the rooms are still the size they were furnished at; a hand layout
  // that no longer fits is not applied (the editor says why).
  if (!worldInteriorEditFits(laidOut, edit) || interiorEditIssues(laidOut, edit).length) return laidOut;
  const furnished = furnishByHand(town, building, laidOut, edit);
  return {
    ...furnished,
    decor: wallDecor(game, town, building, laidOut.width, laidOut.height, laidOut.ground, furnished.furniture),
  };
}

/** A building's furniture as laid out by hand (worldgen W13b). */
export type WorldInteriorEdit = NonNullable<GameWorld["edits"]>["interiors"] extends Array<infer T> | undefined
  ? T
  : never;

/** Whether every bit of open floor in the rooms is reached from the step inside the way out, walking
 *  round the furniture, and every bed has open floor beside it. */
export function worldInteriorOpen(interior: Pick<WorldInterior, "width" | "ground" | "door" | "furniture">): boolean {
  const { width, ground } = interior;
  const blocked = new Set(interior.furniture.map((piece) => piece.y * width + piece.x));
  const seen = new Set<number>();
  const queue = [(interior.door.y - 1) * width + interior.door.x];
  if (blocked.has(queue[0]!)) return false;
  while (queue.length) {
    const at = queue.pop()!;
    if (seen.has(at)) continue;
    seen.add(at);
    for (const next of [at + 1, at - 1, at + width, at - width]) {
      const c = ground[next];
      if ((c === "." || c === "d") && !blocked.has(next) && !seen.has(next)) queue.push(next);
    }
  }
  for (let at = 0; at < ground.length; at++) {
    if (ground[at] !== "." && ground[at] !== "d") continue;
    if (!blocked.has(at) && !seen.has(at)) return false;
  }
  // Every bed has open floor beside some cell of it.
  const beside = (x: number, y: number) => [1, -1, width, -width].some((step) => seen.has(y * width + x + step));
  return worldBeds(interior.furniture).every((bed) => bed.cells.some((cell) => beside(cell.x, cell.y)));
}

/** Whether a hand furnishing is for the rooms as they are now laid out: their size, and what they are
 *  furnished as (a building's id can come to name another building after other hand edits). One that is
 *  not is kept but not applied, and never blocks a save (the room editor says so). */
export function worldInteriorEditFits(laidOut: WorldInterior, edit: WorldInteriorEdit): boolean {
  return edit.width === laidOut.width && edit.height === laidOut.height && (!edit.use || edit.use === laidOut.use);
}

/** The largest rooms drawn by hand, each way (the inside view does not pan), and the most rooms. */
export const WORLD_HAND_ROOM_MAX = 32;
export const WORLD_HAND_ROOM_MOST_ROOMS = 8;
/** The most cells all of a world's hand-drawn rooms hold together. */
export const WORLD_HAND_ROOM_CELLS = 65_536;
/** Pieces a worker works at, by preference; a worker stands beside the next one free. */
const WORK_PIECES: readonly WorldFurniture[] = ["counter", "workbench", "desk", "altar", "furnace", "table", "rack"];

/** A hand-drawn room's floor regions, split at its doorways: each region's cells, the region holding the
 *  step inside first. */
function handRegions(width: number, ground: string, entry: number): number[][] {
  const seen = new Set<number>();
  const regions: number[][] = [];
  const fill = (start: number) => {
    const cells: number[] = [];
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const at = queue.pop()!;
      cells.push(at);
      for (const next of [at + 1, at - 1, at + width, at - width]) {
        if (ground[next] !== "." || seen.has(next)) continue;
        if ((next === at + 1 || next === at - 1) && Math.floor(next / width) !== Math.floor(at / width)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
    return cells.sort((a, b) => a - b);
  };
  if (ground[entry] === ".") regions.push(fill(entry));
  for (let at = 0; at < ground.length; at++) if (ground[at] === "." && !seen.has(at)) regions.push(fill(at));
  return regions;
}

type Piece = { x: number; y: number; kind: WorldFurniture };

/** Whether a bed cell is the foot of a bed (a bed's head lies north of it): a bed is two cells long, head
 *  to the north, where there is room; a lone bed cell is a whole bed. `kind` is the bed's (a bed, a bunk
 *  bed or a double bed; WORLD_BED_FURNITURE), "bed" when not given. */
export function bedFoot(
  furniture: ReadonlyArray<Piece>,
  piece: {
    x: number;
    y: number;
    kind?: WorldFurniture;
  },
): boolean {
  const kind = piece.kind ?? "bed";
  // The head is the cell above unless that one is itself a foot (beds end to end, head, foot, head, foot).
  let heads = 0;
  for (let y = piece.y - 1; furniture.some((each) => each.kind === kind && each.x === piece.x && each.y === y); y--)
    heads++;
  return heads % 2 === 1;
}

/** A furnishing's beds, each whole: a bed or a bunk bed its head over its foot (bedFoot), a double bed two
 *  of those side by side (paired from the west, as wide furniture is). `x`, `y` its head's west cell, `w`
 *  by `h` the cells it covers (a lone cell is a whole bed, a lone column of a double bed half of one);
 *  `cells`, its furniture's cells; `sleeps`, where the people who sleep in it lie (a bed one, a bunk bed and
 *  a double bed two). */
export function worldBeds(furniture: ReadonlyArray<Piece>): Array<{
  kind: WorldFurniture;
  x: number;
  y: number;
  w: number;
  h: number;
  cells: Array<{ x: number; y: number }>;
  sleeps: Array<{ x: number; y: number }>;
}> {
  const has = (kind: WorldFurniture, x: number, y: number) =>
    furniture.some((each) => each.kind === kind && each.x === x && each.y === y);
  const head = (kind: WorldFurniture, x: number, y: number) => has(kind, x, y) && !bedFoot(furniture, { x, y, kind });
  const beds: ReturnType<typeof worldBeds> = [];
  for (const piece of furniture) {
    if (!WORLD_BED_FURNITURE.includes(piece.kind) || !head(piece.kind, piece.x, piece.y)) continue;
    const { kind, x, y } = piece;
    let west = 0;
    if (kind === "bed_double") while (head(kind, x - west - 1, y)) west++;
    if (west % 2 === 1) continue;
    const w = kind === "bed_double" && head(kind, x + 1, y) ? 2 : 1;
    const foot = (fx: number) => has(kind, fx, y + 1) && bedFoot(furniture, { x: fx, y: y + 1, kind });
    const h = foot(x) ? 2 : 1;
    const cells: Array<{ x: number; y: number }> = [];
    for (let dy = 0; dy < 2; dy++)
      for (let dx = 0; dx < w; dx++) if (dy === 0 || foot(x + dx)) cells.push({ x: x + dx, y: y + dy });
    const sleeps =
      kind === "bed_double" ? cells.filter((cell) => cell.y === y) : kind === "bed_bunk" ? cells : cells.slice(0, 1);
    beds.push({ kind, x, y, w, h, cells, sleeps });
  }
  return beds;
}

/** How a piece of furniture is drawn (worldInteriorSprites): the tiles to try, best first, each `w` cells
 *  across (a pack's variant that wide; else, last, any it has); failing those, `cell` a cell at a time;
 *  standing over the cells (x .. x + w - 1, y) (its bottom row: a sprite rises above it, over what is
 *  behind), centred on them, its foot `lift` cells above their bottom edge; drawn in order of `base`. */
export interface WorldInteriorSprite {
  ids: string[];
  cell?: string[];
  x: number;
  y: number;
  w: number;
  lift: number;
  base: number;
}

/** How far a piece against a back wall stands back against it: its foot a quarter of a cell into the floor
 *  row before the wall. */
const AGAINST_LIFT = 0.75;
/** The most cells across a piece of each kind is laid (WORLD_WIDE_FURNITURE): two, a long table three. */
const RUN: Partial<Record<WorldFurniture, number>> = { longtable: 3 };
/** Pieces a chair faces when beside one. */
const SEATED_AT: ReadonlySet<WorldFurniture> = new Set(["table", "longtable", "desk", "counter", "workbench"]);

/** A building's furniture as drawn, back to front: a pack's pieces facing the way they stand (a chair
 *  toward the table or desk beside it; a piece against a side wall away from it), sized by the cells they
 *  are laid over (a pair of tables one square table, three long tables one long one; a bench or a counter
 *  across a wide room, along a tall one), the plain tiles where a pack has none of these. Rugs are laid
 *  apart (`rugs`), under it all. */
export function worldInteriorSprites(
  interior: Pick<WorldInterior, "width" | "ground" | "furniture" | "rooms">,
): WorldInteriorSprite[] {
  const { width, ground } = interior;
  const kindAt = new Map(interior.furniture.map((piece) => [piece.y * width + piece.x, piece.kind]));
  const wall = (x: number, y: number) => ground[y * width + x] === "#";
  const tall = (x: number, y: number) => {
    const room = interior.rooms.find((each) =>
      each.cells
        ? each.cells.includes(y * width + x)
        : x >= each.x && x < each.x + each.w && y >= each.y && y < each.y + each.h,
    );
    return room ? room.h > room.w : false;
  };
  const sprites: WorldInteriorSprite[] = [];
  const add = (sprite: Omit<WorldInteriorSprite, "base">) =>
    sprites.push({ ...sprite, base: sprite.y + 1 - sprite.lift });
  const used = new Set<number>();
  for (const bed of worldBeds(interior.furniture)) {
    bed.cells.forEach((cell) => used.add(cell.y * width + cell.x));
    const y = bed.y + bed.h - 1;
    if (bed.kind === "bed_double" && bed.w === 2)
      add({ ids: ["in_bed_double"], cell: ["in_bed"], x: bed.x, y, w: 2, lift: 0 });
    else
      for (let dx = 0; dx < bed.w; dx++)
        add({ ids: bed.kind === "bed_bunk" ? ["in_bed_bunk", "in_bed"] : ["in_bed"], x: bed.x + dx, y, w: 1, lift: 0 });
  }
  const ordered = [...interior.furniture].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const piece of ordered) {
    const { x, y, kind } = piece;
    if (used.has(y * width + x) || kind === "rug") continue;
    // A run of the same piece side by side, taken from the west a whole piece at a time.
    let n = 1;
    if (WORLD_WIDE_FURNITURE.includes(kind))
      while (n < (RUN[kind] ?? 2) && kindAt.get(y * width + x + n) === kind && !used.has(y * width + x + n)) n++;
    for (let dx = 0; dx < n; dx++) used.add(y * width + x + dx);
    const back = Array.from({ length: n }, (_, dx) => wall(x + dx, y - 1)).every(Boolean);
    const lift = back && (WORLD_WALL_FURNITURE.includes(kind) || kind === "hearth") ? AGAINST_LIFT : 0;
    // Against a side wall a piece faces away from it.
    const side = n === 1 && wall(x - 1, y) ? "right" : n === 1 && wall(x + 1, y) ? "left" : null;
    const along = side !== null || tall(x, y);
    const plain = `in_${kind}`;
    let ids: string[];
    let cell: string[] | undefined;
    switch (kind) {
      case "chair": {
        const at = (dx: number, dy: number) => SEATED_AT.has(kindAt.get((y + dy) * width + x + dx) as WorldFurniture);
        const facing = at(1, 0) ? "right" : at(-1, 0) ? "left" : at(0, 1) ? "down" : at(0, -1) ? "up" : "down";
        ids = [`in_chair_${facing}`, plain];
        break;
      }
      case "table":
        ids = n === 2 ? ["in_table_square", plain] : [plain];
        cell = [plain];
        break;
      case "longtable":
        ids =
          n === 3
            ? ["in_longtable_h"]
            : n === 2
              ? [...(tall(x, y) ? ["in_longtable_v"] : []), plain, "in_table"]
              : [plain, "in_table"];
        cell = [plain, "in_table"];
        break;
      case "desk":
      case "workbench":
        ids = n === 2 ? [`${plain}_down`, plain] : side ? [`${plain}_${side}`, plain] : [plain];
        cell = [plain];
        break;
      case "counter":
      case "bench":
        ids = n === 2 ? [`${plain}_h`, plain] : along ? [`${plain}_v`, plain] : [plain];
        cell = [plain];
        break;
      case "bookshelf":
        ids = !back && side ? [`${plain}_${side}`, plain] : [plain];
        break;
      case "hearth":
        ids = n === 2 ? ["in_hearth_wide", plain] : [plain];
        cell = [plain];
        break;
      default:
        ids = [plain];
        cell = [plain];
    }
    add({ ids, ...(n > 1 && cell ? { cell } : {}), x, y, w: n, lift });
  }
  return sprites.sort((a, b) => a.base - b.base || a.x - b.x);
}

/** Why rooms drawn by hand cannot be used, or nothing. Places count from 1. */
function handRoomIssues(edit: WorldInteriorEdit): string[] {
  const { width, height } = edit;
  const ground = edit.ground ?? "";
  const issues: string[] = [];
  if (width > WORLD_HAND_ROOM_MAX || height > WORLD_HAND_ROOM_MAX)
    return [`the rooms are ${width} by ${height}; rooms drawn by hand are at most ${WORLD_HAND_ROOM_MAX} each way.`];
  if (ground.length !== width * height) return [`the drawing has ${ground.length} cells, not ${width} by ${height}.`];
  const doors = [...ground].flatMap((c, at) => (c === "D" ? [at] : []));
  if (doors.length !== 1) return [`the rooms need exactly one way out, not ${doors.length}.`];
  const door = doors[0]!;
  const [dx, dy] = [door % width, Math.floor(door / width)];
  if (dy !== height - 1 || dx === 0 || dx === width - 1)
    issues.push("the way out is in the bottom wall, not a corner.");
  else if (ground[door - width] !== ".") issues.push("the way out has floor inside it.");
  for (let at = 0; at < ground.length; at++) {
    const [x, y] = [at % width, Math.floor(at / width)];
    const edge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
    if (edge && ground[at] !== "#" && at !== door) {
      issues.push(`the rooms are open at column ${x + 1}, row ${y + 1}: their edge is wall but for the way out.`);
      break;
    }
    if (ground[at] !== "d") continue;
    const across = ground[at - 1] === "." && ground[at + 1] === ".";
    const down = ground[at - width] === "." && ground[at + width] === ".";
    if (!across && !down)
      issues.push(`the doorway at column ${x + 1}, row ${y + 1} does not lead from floor to floor.`);
  }
  if (issues.length) return issues;
  const entry = door - width;
  if (handRegions(width, ground, entry).length > WORLD_HAND_ROOM_MOST_ROOMS)
    issues.push(`the rooms are more than ${WORLD_HAND_ROOM_MOST_ROOMS}.`);
  const taken = new Set<number>();
  for (const piece of edit.furniture) {
    const at = piece.y * width + piece.x;
    const where = `column ${piece.x + 1}, row ${piece.y + 1}`;
    if (piece.x >= width || piece.y >= height || ground[at] !== ".")
      issues.push(`the ${piece.kind} at ${where} is not on the floor.`);
    else if (at === entry) issues.push(`the ${piece.kind} at ${where} stands in the way in.`);
    else if (taken.has(at)) issues.push(`two pieces stand at ${where}.`);
    taken.add(at);
  }
  if (!issues.length && !worldInteriorOpen({ width, ground, door: { x: dx, y: dy }, furniture: edit.furniture }))
    issues.push("the walls or the furniture cut off part of the rooms (or a bed) from the way in.");
  return issues;
}

/** Rooms drawn by hand (W13c) as Game Mode uses them: their rooms (split at doorways; the one with the way
 *  in is the front room, one with a bed a room to sleep in, the rest back rooms), and where everyone who
 *  belongs there is: each who lives there in a bed in turn; each who works there beside the next work
 *  piece (by WORK_PIECES); anyone left on the open floor nearest the way in. */
function drawnByHand(
  town: WorldTown,
  building: WorldTownBuilding,
  use: WorldInteriorUse,
  edit: WorldInteriorEdit,
): WorldInterior {
  const { width, height } = edit;
  const ground = edit.ground!;
  const doorAt = ground.indexOf("D");
  const door = { x: doorAt % width, y: Math.floor(doorAt / width) };
  const entry = doorAt - width;
  const furniture = edit.furniture.map((piece) => ({ ...piece }));
  const rooms: WorldInterior["rooms"] = handRegions(width, ground, entry).map((cells, index) => {
    const xs = cells.map((at) => at % width);
    const ys = cells.map((at) => Math.floor(at / width));
    const [x, y] = [Math.min(...xs), Math.min(...ys)];
    const inside = new Set(cells);
    const hasBed = furniture.some(
      (piece) => WORLD_BED_FURNITURE.includes(piece.kind) && inside.has(piece.y * width + piece.x),
    );
    const roomUse: WorldInteriorRoom = index === 0 ? "main" : hasBed && use !== "clinic" ? "sleep" : "back";
    return { x, y, w: Math.max(...xs) - x + 1, h: Math.max(...ys) - y + 1, use: roomUse, cells };
  });
  const covered = new Set(furniture.map((piece) => piece.y * width + piece.x));
  const used = new Set<number>([entry]);
  const open = (at: number) => ground[at] === "." && !covered.has(at) && !used.has(at);
  // Open floor by walking distance from the way in.
  const byDistance: number[] = [];
  const queue = [entry];
  const reached = new Set(queue);
  while (queue.length) {
    const at = queue.shift()!;
    byDistance.push(at);
    for (const next of [at + 1, at - 1, at + width, at - width]) {
      if (reached.has(next) || (ground[next] !== "." && ground[next] !== "d") || covered.has(next)) continue;
      reached.add(next);
      queue.push(next);
    }
  }
  const seats: WorldInterior["seats"] = {};
  const take = (at: number) => {
    used.add(at);
    return { x: at % width, y: Math.floor(at / width) };
  };
  const homeOf = (id: string) => town.homeOf[id] === building.id;
  const residents = building.people.filter(homeOf).slice(0, MOST_PEOPLE);
  const workers = building.people
    .filter((id) => town.workOf[id] === building.id || (!homeOf(id) && building.kind !== "home"))
    .slice(0, MOST_PEOPLE);
  const beds = worldBeds(furniture).flatMap((bed) => bed.sleeps);
  residents.forEach((id, index) => {
    const bed = beds[index];
    if (bed) seats[id] = { x: bed.x, y: bed.y };
  });
  const workPieces = WORK_PIECES.flatMap((kind) => furniture.filter((piece) => piece.kind === kind));
  for (const id of workers) {
    if (seats[id]) continue;
    // The next work piece with open floor beside it (each piece seats one).
    while (workPieces.length) {
      const piece = workPieces.shift()!;
      const at = piece.y * width + piece.x;
      const beside = [at + width, at - width, at - 1, at + 1].find((next) => open(next) && reached.has(next));
      if (beside === undefined) continue;
      seats[id] = take(beside);
      break;
    }
  }
  for (const id of [...residents, ...workers]) {
    if (seats[id]) continue;
    const at = byDistance.find((each) => open(each));
    if (at !== undefined) seats[id] = take(at);
  }
  return { buildingId: building.id, use, width, height, ground, door, rooms, furniture, decor: [], rugs: [], seats };
}

/** Why a hand furnishing does not fit the rooms as laid out, or nothing. Places count from 1. */
function interiorEditIssues(laidOut: WorldInterior, edit: WorldInteriorEdit): string[] {
  const issues: string[] = [];
  const taken = new Set<number>();
  const entry = (laidOut.door.y - 1) * laidOut.width + laidOut.door.x;
  for (const piece of edit.furniture) {
    const at = piece.y * laidOut.width + piece.x;
    const where = `column ${piece.x + 1}, row ${piece.y + 1}`;
    if (piece.x >= laidOut.width || piece.y >= laidOut.height || laidOut.ground[at] !== ".") {
      issues.push(`the ${piece.kind} at ${where} is not on the floor.`);
    } else if (at === entry) {
      issues.push(`the ${piece.kind} at ${where} stands in the way in.`);
    } else if (taken.has(at)) {
      issues.push(`two pieces stand at ${where}.`);
    }
    taken.add(at);
  }
  if (!issues.length && !worldInteriorOpen({ ...laidOut, furniture: edit.furniture })) {
    issues.push("the furniture walls off part of the rooms (or a bed) from the way in.");
  }
  return issues;
}

/** The rooms with their furniture as laid out by hand, and where everyone who belongs there is: each who
 *  lives there in a bed (in turn), each who works there where they stood if it is still open floor, else
 *  the open floor nearest it. */
function furnishByHand(
  town: WorldTown,
  building: WorldTownBuilding,
  laidOut: WorldInterior,
  edit: WorldInteriorEdit,
): WorldInterior {
  const { width, height } = laidOut;
  const furniture = edit.furniture.map((piece) => ({ ...piece }));
  const covered = new Set(furniture.map((piece) => piece.y * width + piece.x));
  const used = new Set<number>();
  const seats: WorldInterior["seats"] = {};
  const residents = building.people.filter((id) => town.homeOf[id] === building.id).slice(0, MOST_PEOPLE);
  const beds = worldBeds(furniture).flatMap((bed) => bed.sleeps);
  const open = (at: number) => laidOut.ground[at] === "." && !covered.has(at) && !used.has(at);
  const nearest = (from: { x: number; y: number }) => {
    let best: { x: number; y: number } | null = null;
    let distance = Infinity;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const d = Math.abs(x - from.x) + Math.abs(y - from.y);
        if (d < distance && open(y * width + x) && y * width + x !== (laidOut.door.y - 1) * width + laidOut.door.x) {
          [best, distance] = [{ x, y }, d];
        }
      }
    return best;
  };
  residents.forEach((id, index) => {
    const bed = beds[index];
    if (bed) seats[id] = { x: bed.x, y: bed.y };
  });
  for (const [id, seat] of Object.entries(laidOut.seats)) {
    if (seats[id]) continue;
    const spot = open(seat.y * width + seat.x) ? seat : nearest(seat);
    if (!spot) continue;
    seats[id] = spot;
    used.add(spot.y * width + spot.x);
  }
  return { ...laidOut, furniture, seats };
}

/**
 * Why buildings furnished by hand do not fit, or nothing: each against its rooms as the world with these
 * edits lays them out (its town laid out by hand too). `townOf` gives a settlement's town in that world.
 */
export function worldInteriorEditIssues(
  game: GameWorld,
  edits: NonNullable<GameWorld["edits"]>,
  townOf: (settlementId: string) => WorldTown | null,
): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const edit of edits.interiors ?? []) {
    const key = `${edit.settlement}/${edit.building}`;
    if (seen.has(key)) issues.push(`The rooms of "${edit.building}" in "${edit.settlement}" are furnished twice.`);
    seen.add(key);
    const town = townOf(edit.settlement);
    const building = town?.buildings.find((each) => each.id === edit.building);
    if (!town || !building) {
      issues.push(`No building "${edit.building}" in the town of "${edit.settlement}".`);
      continue;
    }
    if (!worldBuildingHasRooms(game, building)) {
      issues.push(`"${building.name ?? edit.building}" is a part of town, with no rooms to furnish.`);
      continue;
    }
    const laidOut = layOutInterior(game, town, building);
    if (edit.ground !== undefined) {
      // Drawn for another kind of building (its id has come to name another): kept, not applied.
      if (edit.use && edit.use !== laidOut.use) continue;
      for (const issue of handRoomIssues(edit))
        issues.push(`The rooms of "${building.name ?? edit.building}": ${issue}`);
      continue;
    }
    if (!worldInteriorEditFits(laidOut, edit)) continue;
    for (const issue of interiorEditIssues(laidOut, edit))
      issues.push(`The rooms of "${building.name ?? edit.building}": ${issue}`);
  }
  const cells = (edits.interiors ?? []).reduce((sum, edit) => sum + (edit.ground?.length ?? 0), 0);
  if (cells > WORLD_HAND_ROOM_CELLS)
    issues.push(`Rooms drawn by hand hold ${cells} cells together; a world holds at most ${WORLD_HAND_ROOM_CELLS}.`);
  return [...new Set(issues)].slice(0, 20);
}

type Item = {
  kind: WorldFurniture;
  where: "wall" | "floor" | "side";
  for?: string;
  /** Who sleeps in a bunk bed's or a double bed's other place. */
  also?: string;
  seat?: "below" | "above" | "on";
};

/** The words of a tavern that is also an inn, with rooms to sleep in. */
const INN_WORDS =
  /\b(inns?|innkeepers?|hostels?|hotels?|motels?|boarding ?houses?|lodges?|lodgings?|guest ?houses?|capsule|ryokans?|caravanserais?)\b/i;

/** Beds for people in turn, each bed's places filled before the next (a double bed and a bunk bed sleep
 *  two): the items given, their sleepers set. */
const sleepIn = (beds: Item[], people: ReadonlyArray<string | undefined>): Item[] => {
  let next = 0;
  return beds.map((bed) => {
    const two = bed.kind === "bed_double" || bed.kind === "bed_bunk";
    const item: Item = { ...bed, seat: "on", for: people[next++] };
    if (two) item.also = people[next++];
    return item;
  });
};

/** A building's rooms laid out from the seed and what it holds. */
export function layOutInterior(game: GameWorld, town: WorldTown, building: WorldTownBuilding): WorldInterior {
  const random = worldStream(game.seed, "interior", town.settlementId, building.id);
  const place = building.placeId ? game.world.places.find((each) => each.id === building.placeId) : undefined;
  const use = building.use ?? worldInteriorUse(building, place?.tags);
  const tier = Math.min(3, Math.max(0, Math.round((town.width - 22) / 10)));
  const homeOf = (id: string) => town.homeOf[id] === building.id;
  const workOf = (id: string) => town.workOf[id] === building.id;
  // Room for so many and no more: a home where too many share, or a hall every keeper in town sits in,
  // seats the first of them (the rest are about the place, unseated).
  const residents = building.people.filter(homeOf).slice(0, MOST_PEOPLE);
  const workers = building.people
    .filter((id) => workOf(id) || (!homeOf(id) && building.kind !== "home"))
    .slice(0, MOST_PEOPLE);

  // ── What it holds, in the order it is placed: the main room's, then the second room's ──
  const main: Item[] = [];
  const second: Item[] = [];
  let secondUse: WorldInteriorRoom | null = null;
  const each = (count: number, make: (index: number) => Item) => {
    for (let index = 0; index < count; index++) main.push(make(index));
  };
  const staff = (kind: WorldFurniture, seat: Item["seat"], where: Item["where"] = "floor") =>
    workers.forEach((id) => main.push({ kind, where, for: id, seat }));
  switch (use) {
    case "home": {
      main.push({ kind: "hearth", where: "wall" }, { kind: "shelf", where: "wall" }, { kind: "table", where: "floor" });
      secondUse = "sleep";
      // The first two who live here share a double bed (an empty home has one); anyone more has a bed.
      const sleepers = residents.length ? residents : [undefined, undefined];
      const beds: Item[] = sleepers.length >= 2 ? [{ kind: "bed_double", where: "wall" }] : [];
      while (beds.length + (sleepers.length >= 2 ? 1 : 0) < sleepers.length) beds.push({ kind: "bed", where: "wall" });
      second.push(...sleepIn(beds, sleepers), { kind: "drawers", where: "wall" }, { kind: "crate", where: "side" });
      break;
    }
    case "tavern": {
      main.push({ kind: "hearth", where: "wall" }, { kind: "barrel", where: "wall" }, { kind: "shelf", where: "wall" });
      staff("counter", "above");
      each(2 + tier, (index) => ({ kind: index % 2 ? "table" : "longtable", where: "floor" }));
      const words = [place?.tags.join(" ") ?? "", building.role ?? "", building.name ?? ""].map(plain).join(" ");
      if (INN_WORDS.test(words)) {
        // An inn: a room to sleep in, a double bed for the keepers and bunk beds for travellers.
        secondUse = "sleep";
        const beds: Item[] = [{ kind: "bed_double", where: "wall" }];
        for (let index = 0; index < 1 + tier; index++) beds.push({ kind: "bed_bunk", where: "wall" });
        second.push(...sleepIn(beds, residents), { kind: "barrel", where: "side" });
        break;
      }
      secondUse = "back";
      second.push(
        { kind: "barrel", where: "wall" },
        { kind: "barrel", where: "wall" },
        { kind: "crate", where: "side" },
      );
      break;
    }
    case "shop":
      each(2 + Math.min(2, tier), () => ({ kind: "shelf", where: "wall" }));
      staff("counter", "above");
      main.push({ kind: "crate", where: "side" }, { kind: "crate", where: "side" });
      secondUse = "back";
      second.push({ kind: "crate", where: "wall" }, { kind: "crate", where: "wall" }, { kind: "shelf", where: "side" });
      break;
    case "workshop":
      main.push({ kind: "furnace", where: "wall" }, { kind: "rack", where: "wall" });
      staff("workbench", "below");
      main.push({ kind: "crate", where: "side" });
      secondUse = "back";
      second.push(
        { kind: "crate", where: "wall" },
        { kind: "barrel", where: "wall" },
        { kind: "shelf", where: "side" },
      );
      break;
    case "worship":
      staff("altar", "below", "wall");
      if (workers.length === 0) main.push({ kind: "altar", where: "wall" });
      main.push({ kind: "lamp", where: "wall" }, { kind: "lamp", where: "wall" });
      each(2 + tier, () => ({ kind: "bench", where: "floor" }));
      // A vestry behind.
      secondUse = "back";
      second.push({ kind: "shelf", where: "wall" }, { kind: "crate", where: "side" });
      break;
    case "clinic":
      main.push({ kind: "shelf", where: "wall" }, { kind: "shelf", where: "wall" });
      staff("table", "below");
      // A ward of beds behind.
      secondUse = "back";
      for (let index = 0; index < 2 + tier; index++) second.push({ kind: "bed", where: "wall" });
      break;
    case "guard": {
      main.push({ kind: "rack", where: "wall" }, { kind: "rack", where: "wall" });
      staff("table", "below");
      // A barracks of bunk beds, two to each.
      secondUse = "sleep";
      const bunks = Math.ceil(Math.max(2, workers.length) / 2);
      for (let index = 0; index < bunks; index++) second.push({ kind: "bed_bunk", where: "wall" });
      break;
    }
    case "study":
      each(2 + Math.min(2, tier), () => ({ kind: "bookshelf", where: "wall" }));
      staff("desk", "below");
      if (workers.length === 0) main.push({ kind: "desk", where: "floor" });
      main.push({ kind: "lamp", where: "side" });
      // A store of books behind.
      secondUse = "back";
      second.push({ kind: "bookshelf", where: "wall" }, { kind: "crate", where: "side" });
      break;
    case "hall":
      main.push({ kind: "hearth", where: "wall" });
      staff("table", "below");
      each(Math.max(0, 2 - workers.length) + tier, () => ({ kind: "longtable", where: "floor" }));
      main.push({ kind: "plant", where: "side" });
      // A kitchen or a store behind.
      secondUse = "back";
      second.push(
        { kind: "shelf", where: "wall" },
        { kind: "barrel", where: "wall" },
        { kind: "crate", where: "side" },
      );
      break;
    case "training":
      main.push({ kind: "rack", where: "wall" }, { kind: "rack", where: "wall" });
      staff("bench", "below", "side");
      secondUse = "back";
      second.push({ kind: "crate", where: "wall" }, { kind: "barrel", where: "wall" });
      break;
    case "store":
      main.push({ kind: "rack", where: "wall" }, { kind: "shelf", where: "wall" });
      each(2 + tier, () => ({ kind: "crate", where: "floor" }));
      main.push({ kind: "barrel", where: "side" }, { kind: "barrel", where: "side" });
      workers.forEach((id) => main.push({ kind: "crate", where: "side", for: id, seat: "below" }));
      break;
    default:
      main.push({ kind: "shelf", where: "wall" });
      staff("workbench", "below");
      if (workers.length === 0) main.push({ kind: "table", where: "floor" });
      main.push({ kind: "crate", where: "side" });
      secondUse = "back";
      second.push({ kind: "crate", where: "wall" }, { kind: "shelf", where: "side" });
  }
  // Now and then a plant (a rug is laid with the rugs, layOutRugs).
  if (random() < 0.4) {
    const plant = random() < 0.5;
    const where = random() < 0.5 ? "side" : "floor";
    if (plant) main.push({ kind: "plant", where });
  }

  // ── How big: as wide as its wall and floor things need, as deep as its floor things ──
  const count = (items: Item[], where: Item["where"]) => items.filter((item) => item.where === where).length;
  // Floor things stand two apart (a chair or a seat between), in rows two apart; a table, a bench and the
  // like two cells across, a long table three, a double bed two.
  const across = (item: Item) =>
    item.kind === "longtable" ? 3 : WORLD_WIDE_FURNITURE.includes(item.kind) || item.kind === "bed_double" ? 2 : 1;
  const cellsOf = (items: Item[], where: Item["where"]) =>
    items.filter((item) => item.where === where).reduce((n, item) => n + across(item), 0);
  const mainFloor = cellsOf(main, "floor");
  const mainW = clamp(
    Math.max(cellsOf(main, "wall") + 2, Math.ceil(mainFloor / 2) * 2 + 1, 5 + (random() < 0.5 ? 1 : 0)),
    MAIN_W,
  );
  const floorRows = Math.ceil(mainFloor / Math.max(1, Math.floor((mainW - 1) / 2)));
  const mainH = clamp(3 + floorRows * 2 - (floorRows ? 1 : 0) + Math.ceil(count(main, "side") / 2 / 3), MAIN_H);
  const secondW = secondUse ? clamp(cellsOf(second, "wall") + 1, [3, 9]) : 0;
  const height = mainH + 1 + WORLD_INTERIOR_BACK_WALL;
  const width = mainW + 2 + (secondUse ? secondW + 1 : 0);

  // ── The walls, the rooms, the way out ──
  const cells = Array.from({ length: width * height }, () => "#");
  const secondLeft = secondUse ? random() < 0.5 : false;
  const mainX = secondLeft ? secondW + 2 : 1;
  const secondX = secondLeft ? 1 : mainW + 2;
  const top = WORLD_INTERIOR_BACK_WALL;
  const rooms: WorldInterior["rooms"] = [{ x: mainX, y: top, w: mainW, h: mainH, use: "main" }];
  if (secondUse) rooms.push({ x: secondX, y: top, w: secondW, h: mainH, use: secondUse });
  for (const room of rooms)
    for (let y = room.y; y < room.y + room.h; y++)
      for (let x = room.x; x < room.x + room.w; x++) cells[y * width + x] = ".";
  const door = { x: mainX + Math.floor(mainW / 2) + (mainW > 6 ? Math.floor(random() * 3) - 1 : 0), y: height - 1 };
  cells[door.y * width + door.x] = "D";
  // The doorway between the rooms, low in their shared wall, near the way out.
  const between = secondUse
    ? { x: secondLeft ? mainX - 1 : mainX + mainW, y: top - 1 + mainH - Math.floor(random() * 2) }
    : null;
  if (between) cells[between.y * width + between.x] = "d";

  // ── The furniture ──
  const furniture: WorldInterior["furniture"] = [];
  const seats: WorldInterior["seats"] = {};
  const taken = new Set<number>();
  const key = (x: number, y: number) => y * width + x;
  // Kept clear: the way in and the step inside it, the walk up the room from it, and both sides of the
  // doorway between the rooms.
  for (let y = top; y < height - 1; y++) taken.add(key(door.x, y));
  if (between) for (const dx of [-1, 1]) taken.add(key(between.x + dx, between.y));
  const isFloor = (x: number, y: number) => cells[key(x, y)] === ".";
  const free = (x: number, y: number) => isFloor(x, y) && !taken.has(key(x, y));
  /** Cells furniture stands on: what a person walks round. */
  const blocked = new Set<number>();
  /** Each bed's cells, so each keeps open floor beside it. */
  const beds: number[][] = [];
  const entry = key(door.x, door.y - 1);
  const xy = (cell: number) => ({ x: cell % width, y: Math.floor(cell / width) });
  /** Whether a piece may stand on these cells: free, and with it there every bit of open floor is still
   *  reached from the way in and every bed (this one too, when it is a bed) still has open floor beside
   *  some cell of it, so nothing and nobody is walled in. */
  const fitsCells = (part: number[], bed = false) => {
    if (!part.every((cell) => free(cell % width, Math.floor(cell / width)))) return false;
    part.forEach((cell) => blocked.add(cell));
    const seen = new Set<number>();
    const queue = [entry];
    while (queue.length) {
      const at = queue.pop()!;
      if (seen.has(at)) continue;
      seen.add(at);
      for (const next of [at + 1, at - 1, at + width, at - width]) {
        const c = cells[next];
        if ((c === "." || c === "d") && !blocked.has(next) && !seen.has(next)) queue.push(next);
      }
    }
    let ok = true;
    for (let at = 0; at < cells.length && ok; at++) {
      if (cells[at] !== "." && cells[at] !== "d") continue;
      if (!blocked.has(at)) ok = seen.has(at);
    }
    const beside = (c: number) => [c + 1, c - 1, c + width, c - width].some((next) => seen.has(next));
    if (ok) ok = [...beds, ...(bed ? [part] : [])].every((each) => each.some(beside));
    part.forEach((cell) => blocked.delete(cell));
    return ok;
  };
  const fits = (x: number, y: number) => fitsCells([key(x, y)]);
  const put = (item: Item, cells: number[], kind: WorldFurniture = item.kind) => {
    for (const cell of cells) {
      furniture.push({ ...xy(cell), kind });
      blocked.add(cell);
      taken.add(cell);
    }
    const { x, y } = xy(cells[0]!);
    if (WORLD_BED_FURNITURE.includes(kind)) {
      beds.push(cells);
      // Who sleeps in it: a double bed's two at its head, a bunk bed's at its head and its foot.
      const places = kind === "bed_double" ? cells.filter((cell) => xy(cell).y === y) : cells;
      [item.for, item.also].forEach((id, index) => {
        if (id && places[index] !== undefined) seats[id] = xy(places[index]!);
      });
      return;
    }
    if (!item.for) return;
    const at = item.seat === "on" ? { x, y } : item.seat === "above" ? { x, y: y - 1 } : { x, y: y + 1 };
    if (item.seat !== "on" && (!isFloor(at.x, at.y) || taken.has(key(at.x, at.y)))) return;
    seats[item.for] = at;
    taken.add(key(at.x, at.y));
  };
  /** A bed's shapes, best first: a double bed two cells across, then as a bed; a bunk bed, then as a bed;
   *  any of them two cells long, then one where its foot has no room. */
  const bedShapes = (kind: WorldFurniture): Array<[WorldFurniture, number, number]> => [
    ...(kind === "bed_double" ? [["bed_double", 2, 2] as [WorldFurniture, number, number]] : []),
    ...(kind === "bed_bunk" ? [["bed_bunk", 1, 2] as [WorldFurniture, number, number]] : []),
    ["bed", 1, 2],
    ["bed", 1, 1],
  ];
  const footprint = (x: number, y: number, w: number, h: number) => {
    const cells: number[] = [];
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) cells.push(key(x + dx, y + dy));
    return cells;
  };
  /** Puts a bed in the first shape that fits at one of the spots (its head's west cell), trying each shape
   *  at every spot before the next shape. */
  const putBed = (item: Item, spots: Array<{ x: number; y: number; east?: boolean }>) => {
    for (const [kind, w, h] of bedShapes(item.kind))
      for (const spot of spots) {
        // Against an east wall a bed two across reaches west from it.
        const cells = footprint(spot.east ? spot.x - w + 1 : spot.x, spot.y, w, h);
        if (!fitsCells(cells, true)) continue;
        put(item, cells, kind);
        return true;
      }
    return false;
  };
  const furnish = (room: (typeof rooms)[number], items: Item[]) => {
    const columns = Array.from({ length: room.w }, (_, index) => room.x + index);
    // Things against the back wall, spread from the middle out.
    const middle = room.x + Math.floor(room.w / 2);
    const byMiddle = [...columns].sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle) || a - b);
    const counters = items.filter((item) => item.kind === "counter");
    const walls = items.filter((item) => item.where === "wall");
    const floors = items.filter((item) => item.where === "floor" && item.kind !== "counter");
    const sides = items.filter((item) => item.where === "side");
    // A counter is a run across the room two rows down from the back wall, its keepers behind it.
    if (counters.length) {
      const row = room.y + 2;
      const run: number[] = [];
      for (const x of byMiddle) if (run.length < Math.max(2, counters.length + 1) && free(x, row)) run.push(x);
      run
        .sort((a, b) => a - b)
        .forEach((x, index) => {
          const item = counters[index] ?? { kind: "counter" as const, where: "floor" as const };
          if (fits(x, row)) put(item, [key(x, row)]);
        });
    }
    // Things against the back wall (a hearth, shelves or a bookcase drawn back against its face), and once
    // it is full, along the side walls instead.
    for (const item of walls) {
      const row = room.y;
      if (WORLD_BED_FURNITURE.includes(item.kind)) {
        if (
          !putBed(
            item,
            byMiddle.map((x) => ({ x, y: row })),
          )
        )
          sides.unshift(item);
        continue;
      }
      const ok = (column: number) => fits(column, row) && (!item.for || item.seat === "on" || free(column, row + 1));
      const x = byMiddle.find(ok);
      if (x === undefined) {
        sides.unshift(item);
        continue;
      }
      put(item, [key(x, row)]);
      // A hearth, a rack, an altar or drawers two cells across where there is room.
      if (WORLD_WIDE_FURNITURE.includes(item.kind) && fits(x + 1, row)) put({ ...item, for: undefined }, [key(x + 1, row)]);
    }
    // Things standing on the floor, in rows two apart from the counter or the back wall down.
    const firstRow = room.y + (counters.length ? 4 : 2);
    let index = 0;
    for (let y = firstRow; y < room.y + room.h - 1 && index < floors.length; y += 2) {
      for (const x of byMiddle) {
        if (index >= floors.length) break;
        if (!fits(x, y)) continue;
        // Not side by side with another thing on the floor, so a chair or a person fits between.
        if (taken.has(key(x - 1, y)) && furniture.some((f) => f.x === x - 1 && f.y === y)) continue;
        if (taken.has(key(x + 1, y)) && furniture.some((f) => f.x === x + 1 && f.y === y)) continue;
        const item = floors[index++]!;
        put(item, [key(x, y)]);
        // As many cells across as it is long where they fit (a long table three, a table, desk or bench two;
        // a bench along a tall room one), else one (a long table with no room is a table).
        const most = across(item) > 1 && !(item.kind === "bench" && room.h > room.w) ? across(item) : 1;
        let n = 1;
        while (n < most && fits(x + n, y) && !furniture.some((f) => f.x === x + n + 1 && f.y === y)) {
          put({ kind: item.kind, where: "floor" }, [key(x + n, y)]);
          n++;
        }
        if (item.kind === "longtable" && n === 1) furniture[furniture.length - 1]!.kind = "table";
        // A table has a chair at each end where there is room.
        if ((item.kind === "table" || item.kind === "longtable") && !item.for)
          for (const side of [x + n, x - 1]) if (fits(side, y)) put({ kind: "chair", where: "floor" }, [key(side, y)]);
      }
    }
    // Things along the side walls, from the back down.
    for (const item of sides) {
      const spots: Array<{ x: number; y: number; east?: boolean }> = [];
      for (let y = room.y; y < room.y + room.h - 1; y++)
        spots.push({ x: room.x, y }, { x: room.x + room.w - 1, y, east: true });
      if (WORLD_BED_FURNITURE.includes(item.kind)) {
        putBed(item, spots);
        continue;
      }
      const spot = spots.find((each) => fits(each.x, each.y));
      if (spot) put(item, [key(spot.x, spot.y)]);
    }
  };
  furnish(rooms[0]!, main);
  if (rooms[1]) furnish(rooms[1], second);

  // Anyone who belongs here and found no spot stands somewhere free in the main room.
  for (const id of [...workers, ...residents]) {
    if (seats[id]) continue;
    const room = rooms[0]!;
    outer: for (let y = room.y + 1; y < room.y + room.h; y++)
      for (let x = room.x; x < room.x + room.w; x++) {
        if (!free(x, y)) continue;
        seats[id] = { x, y };
        taken.add(key(x, y));
        break outer;
      }
  }

  const ground = cells.join("");
  const decor = wallDecor(game, town, building, width, height, ground, furniture);
  const rugs = layOutRugs(game, town, building, { width, ground, door, rooms, use });
  return { buildingId: building.id, use, width, height, ground, door, rooms, furniture, decor, rugs, seats };
}

/** Furniture that rises over the wall behind it: nothing hangs above it. */
const TALL_PIECES: ReadonlySet<WorldFurniture> = new Set(WORLD_WALL_FURNITURE);

/** Decorations hung high on the walls' faces (the wall cell above the one with floor below it), about one
 *  to each three or four cells of a run of face, never above a piece against the wall or standing tall
 *  before it, from a stream of their own so nothing else moves. */
function wallDecor(
  game: GameWorld,
  town: WorldTown,
  building: WorldTownBuilding,
  width: number,
  height: number,
  ground: string,
  furniture: WorldInterior["furniture"],
): WorldInterior["decor"] {
  const random = worldStream(game.seed, "interior-decor", town.settlementId, building.id);
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= width || y >= height ? "#" : ground[y * width + x]);
  const tall = new Set(furniture.filter((piece) => TALL_PIECES.has(piece.kind)).map((p) => p.y * width + p.x));
  const high = (x: number, y: number) =>
    at(x, y) === "#" &&
    at(x, y + 1) === "#" &&
    at(x, y + 2) === "." &&
    !tall.has((y + 1) * width + x) &&
    !tall.has((y + 2) * width + x);
  const decor: WorldInterior["decor"] = [];
  for (let y = 0; y < height - 2; y++) {
    let next = -1;
    for (let x = 0; x < width; x++) {
      if (!high(x, y)) {
        next = -1;
        continue;
      }
      // A run starts: its first decoration one or two cells in, then every three or four.
      if (next < 0) next = x + 1 + Math.floor(random() * 2);
      if (x !== next) continue;
      decor.push({ x, y, pick: Math.floor(random() * WORLD_INTERIOR_DECOR_COUNT) });
      next = x + 3 + Math.floor(random() * 2);
    }
  }
  return decor;
}

/** A laid-out building's rugs, from a stream of their own: one by the way in, a large one in a hall's
 *  main room, square mats in a training hall, now and then a runner; each wholly on open floor, none on
 *  another, none but the first on the step inside the way in. */
function layOutRugs(
  game: GameWorld,
  town: WorldTown,
  building: WorldTownBuilding,
  interior: Pick<WorldInterior, "width" | "ground" | "door" | "rooms" | "use">,
): WorldInterior["rugs"] {
  const random = worldStream(game.seed, "interior-rugs", town.settlementId, building.id);
  const { width, ground, door } = interior;
  const entry = (door.y - 1) * width + door.x;
  const rugs: WorldInterior["rugs"] = [{ x: door.x, y: door.y - 1, w: 1, h: 1 }];
  const covered = new Set([entry]);
  const lay = (room: WorldInterior["rooms"][number], w: number, h: number, middle: boolean) => {
    const spots: Array<{ x: number; y: number }> = [];
    for (let y = room.y; y + h <= room.y + room.h; y++)
      for (let x = room.x; x + w <= room.x + room.w; x++) spots.push({ x, y });
    const cx = room.x + (room.w - w) / 2;
    const cy = room.y + (room.h - h) / 2;
    const start = Math.floor(random() * spots.length);
    const order = middle
      ? spots.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy))
      : spots.map((_, index) => spots[(index + start) % spots.length]!);
    for (const spot of order) {
      const cells: number[] = [];
      for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) cells.push((spot.y + dy) * width + spot.x + dx);
      if (cells.some((cell) => ground[cell] !== "." || covered.has(cell))) continue;
      cells.forEach((cell) => covered.add(cell));
      rugs.push({ ...spot, w, h });
      return;
    }
  };
  const main = interior.rooms[0]!;
  if (interior.use === "hall" || interior.use === "tavern") lay(main, 3, 2, true);
  if (interior.use === "training") for (let n = 0; n < 2; n++) lay(main, 2, 2, false);
  if (random() < 0.4) lay(interior.rooms[interior.rooms.length - 1]!, 2, 1, false);
  return rugs;
}

/** The people inside a building at an hour, each where they are in it. */
export function worldInteriorPeopleAt(
  town: WorldTown,
  interior: WorldInterior,
  hour: number,
): Array<{ person: WorldPerson; at: { x: number; y: number }; asleep: boolean }> {
  const out: Array<{ person: WorldPerson; at: { x: number; y: number }; asleep: boolean }> = [];
  for (const person of town.people) {
    if (worldTownWhere(town, person.id, hour) !== interior.buildingId) continue;
    const seat = interior.seats[person.id];
    if (!seat) continue;
    const asleep = (hour < 7 || hour >= 21) && town.homeOf[person.id] === interior.buildingId;
    // Awake at home: beside their bed, not on it.
    const bed = worldBeds(interior.furniture).find((each) =>
      each.cells.some((cell) => cell.x === seat.x && cell.y === seat.y),
    );
    const at = !asleep && bed ? (besideBed(interior, bed.cells, out) ?? seat) : seat;
    out.push({ person, at, asleep });
  }
  return out;
}

/** Open floor beside a bed (any cell of it) nobody else stands on, if any. */
function besideBed(
  interior: WorldInterior,
  bed: ReadonlyArray<{ x: number; y: number }>,
  others: ReadonlyArray<{ at: { x: number; y: number } }>,
): { x: number; y: number } | null {
  for (const cell of bed)
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ] as const) {
      const [x, y] = [cell.x + dx, cell.y + dy];
      if (interior.ground[y * interior.width + x] !== ".") continue;
      if (interior.furniture.some((piece) => piece.x === x && piece.y === y)) continue;
      if (others.some((each) => each.at.x === x && each.at.y === y)) continue;
      return { x, y };
    }
  return null;
}

const FURNITURE_WORDS: Record<WorldFurniture, [string, string]> = {
  bed: ["a bed", "beds"],
  table: ["a table", "tables"],
  chair: ["a chair", "chairs"],
  counter: ["a counter", "a long counter"],
  shelf: ["shelves", "shelves"],
  hearth: ["a hearth", "hearths"],
  crate: ["a crate", "crates"],
  barrel: ["a barrel", "barrels"],
  altar: ["an altar", "altars"],
  bench: ["a bench", "rows of benches"],
  workbench: ["a workbench", "workbenches"],
  furnace: ["a furnace", "furnaces"],
  desk: ["a desk", "desks"],
  bookshelf: ["a bookcase", "bookcases"],
  rack: ["a rack", "racks"],
  rug: ["a rug", "rugs"],
  plant: ["a plant", "plants"],
  lamp: ["a lamp", "lamps"],
  longtable: ["a long table", "long tables"],
  drawers: ["a chest of drawers", "chests of drawers"],
  bed_double: ["a double bed", "double beds"],
  bed_bunk: ["a bunk bed", "bunk beds"],
};
/** A piece's words in a setting family, where they differ from the plain ones. */
const FAMILY_WORDS: Record<string, Partial<Record<WorldFurniture, [string, string]>>> = {
  wuxia: {
    hearth: ["a brazier", "braziers"],
    bench: ["a row of floor mats", "rows of floor mats"],
    bed: ["a sleeping mat", "sleeping mats"],
    bed_double: ["a wide sleeping mat", "wide sleeping mats"],
    furnace: ["a forge", "forges"],
    altar: ["an altar with incense", "altars with incense"],
  },
  modern: { hearth: ["a stove", "stoves"], furnace: ["a machine", "machines"], crate: ["a box", "boxes"] },
  jazz_age: { hearth: ["a fireplace", "fireplaces"], furnace: ["a boiler", "boilers"] },
  scifi: {
    hearth: ["a heater", "heaters"],
    furnace: ["a fabricator", "fabricators"],
    bed: ["a bunk", "bunks"],
    bed_bunk: ["a stacked bunk", "stacked bunks"],
    shelf: ["storage racks", "storage racks"],
    crate: ["a cargo crate", "cargo crates"],
  },
  wasteland: { hearth: ["a fire barrel", "fire barrels"], furnace: ["a scrap forge", "scrap forges"] },
};
const ROOM_WORDS: Record<WorldInteriorRoom, string> = {
  main: "a front room",
  sleep: "a room to sleep in",
  back: "a back room",
};

const list = (words: string[]) =>
  words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;

/** What the Game Master is told of a building's rooms, in words, in the setting family's words for its
 *  furniture: "Inside: a front room with a counter and shelves, and a back room with crates." Chairs and
 *  rugs go unsaid. A home is told as it is if the party is let in. English, as the rest of the prompt. */
export function worldInteriorWords(interior: WorldInterior, family?: string): string {
  const words = { ...FURNITURE_WORDS, ...(family ? FAMILY_WORDS[family] : undefined) };
  const heads = new Set(worldBeds(interior.furniture).map((bed) => `${bed.x},${bed.y}`));
  const parts = interior.rooms.map((room) => {
    const counts = new Map<WorldFurniture, number>();
    for (const piece of interior.furniture) {
      if (piece.kind === "chair" || piece.kind === "rug" || piece.kind === "plant" || piece.kind === "lamp") continue;
      // A pair side by side is one piece two cells across.
      const left = interior.furniture.some(
        (each) => each.kind === piece.kind && each.x === piece.x - 1 && each.y === piece.y,
      );
      if (left && WORLD_WIDE_FURNITURE.includes(piece.kind)) continue;
      // A bed is told once, by its head's west cell.
      if (WORLD_BED_FURNITURE.includes(piece.kind) && !heads.has(`${piece.x},${piece.y}`)) continue;
      const y = piece.y;
      if (
        room.cells
          ? !room.cells.includes(y * interior.width + piece.x)
          : piece.x < room.x || piece.x >= room.x + room.w || y < room.y || y >= room.y + room.h
      )
        continue;
      counts.set(piece.kind, (counts.get(piece.kind) ?? 0) + 1);
    }
    const things = [...counts].map(([kind, n]) => words[kind]![n > 1 ? 1 : 0]);
    const name = interior.rooms.length === 1 ? "one room" : ROOM_WORDS[room.use];
    return things.length ? `${name} with ${list(things)}` : name;
  });
  return `${interior.use === "home" ? "Inside, if the party is let in" : "Inside"}: ${list(parts)}.`;
}
