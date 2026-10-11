// ──────────────────────────────────────────────
// Furniture (worldgen W13): what a building's rooms are furnished with, by what each piece is, and what
// a building is furnished as. A module of
// its own (no imports), so the edit layer's schema can name the pieces without loading the rooms' layout.
// ──────────────────────────────────────────────

/** Furniture, by what it is; each setting family's tiles draw their own look of it. */
export const WORLD_FURNITURE = Object.freeze([
  "bed",
  "table",
  "chair",
  "counter",
  "shelf",
  "hearth",
  "crate",
  "barrel",
  "altar",
  "bench",
  "workbench",
  "furnace",
  "desk",
  "bookshelf",
  "rack",
  "rug",
  "plant",
  "lamp",
  "longtable",
] as const);
export type WorldFurniture = (typeof WORLD_FURNITURE)[number];

/** Furniture that may stand against a back wall on its face (the wall cell with floor below it), its
 *  base on the floor line, rising over the wall behind it: a hearth, shelves, a bookcase, a lamp. It may
 *  stand on the floor as well. */
export const WORLD_WALL_FURNITURE: readonly WorldFurniture[] = Object.freeze(["hearth", "shelf", "bookshelf", "lamp"]);

/** Furniture two cells across where two of it stand side by side (a pack draws the pair as one piece). */
export const WORLD_WIDE_FURNITURE: readonly WorldFurniture[] = Object.freeze(["table", "desk", "counter", "longtable"]);

/** What a building's rooms are furnished as (worldgen W13). */
export const WORLD_INTERIOR_USES = Object.freeze([
  "home",
  "hall",
  "tavern",
  "shop",
  "workshop",
  "worship",
  "clinic",
  "guard",
  "study",
  "training",
  "store",
  "workroom",
] as const);
export type WorldInteriorUse = (typeof WORLD_INTERIOR_USES)[number];
