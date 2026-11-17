// ──────────────────────────────────────────────
// Buildings gone bad (building plans, 2026-11-14) drawn without a tile pack: a manor, a keep or a temple
// in plain pixel art, so a haunted house reads as a house at a glance. Walls show their face where a
// floor lies below them; the hall is set apart from the rooms; furniture follows the set's prop slots
// (0 table, 1 bed, 2 shelves, 3 hearth, 4 chest, 5 the door out, 6 a locked door, 7 rubble). Each cell's
// pattern comes from its own position, so the same building always looks the same.
// ──────────────────────────────────────────────
import { OVERWORLD_TILE } from "./overworld-paint";

const T = OVERWORLD_TILE;
type Ctx = CanvasRenderingContext2D;
type Noise = (n: number) => number;

const px = (ctx: Ctx, color: string, x: number, y: number, w = 1, h = 1) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

export type BuildingStyle = "manor" | "keep" | "temple";

/** The building look of a dungeon set, or null for a set that is not a building. */
export function buildingStyleOf(set: string | undefined): BuildingStyle | null {
  if (set === "building_manor") return "manor";
  if (set === "building_keep") return "keep";
  if (set === "building_temple") return "temple";
  return null;
}

const LOOK: Record<
  BuildingStyle,
  { top: string; topEdge: string; face: string; faceDark: string; faceLine: string; trim: string }
> = {
  manor: {
    top: "#2e2320",
    topEdge: "#4a3a33",
    face: "#a38d74",
    faceDark: "#5e3f2a",
    faceLine: "#3a2618",
    trim: "#8a6a48",
  },
  keep: {
    top: "#2c2c32",
    topEdge: "#4a4a52",
    face: "#6f6b66",
    faceDark: "#57534e",
    faceLine: "#423f3b",
    trim: "#7d7973",
  },
  temple: {
    top: "#3a3128",
    topEdge: "#5a4c3c",
    face: "#a8956e",
    faceDark: "#8a7856",
    faceLine: "#6a5a3e",
    trim: "#c4b088",
  },
};

/** A wall cell: its top, and its face when a floor lies below it. */
export function paintBuildingWall(
  ctx: Ctx,
  style: BuildingStyle,
  x: number,
  y: number,
  faceBelow: boolean,
  noise: Noise,
) {
  const look = LOOK[style];
  if (!faceBelow) {
    px(ctx, look.top, x, y, T, T);
    px(ctx, look.topEdge, x, y, T, 1);
    return;
  }
  px(ctx, look.top, x, y, T, 5);
  px(ctx, look.topEdge, x, y + 4, T, 1);
  if (style === "manor") {
    // Plaster above, a dado rail, panelled wainscot below.
    px(ctx, look.face, x, y + 5, T, 5);
    px(ctx, "#b8a286", x, y + 5, T, 1);
    px(ctx, look.trim, x, y + 10, T, 1);
    px(ctx, look.faceDark, x, y + 11, T, 5);
    px(ctx, look.faceLine, x + ((x / T) % 2 ? 7 : 3), y + 11, 1, 5);
    px(ctx, look.faceLine, x, y + 15, T, 1);
  } else if (style === "keep") {
    // Rough-cut blocks, two courses, offset.
    px(ctx, look.face, x, y + 5, T, 11);
    px(ctx, look.faceLine, x, y + 10, T, 1);
    px(ctx, look.faceLine, x, y + 15, T, 1);
    const off = Math.floor(noise(3) * 6);
    px(ctx, look.faceLine, x + 3 + off, y + 5, 1, 5);
    px(ctx, look.faceLine, x + 9 - Math.floor(off / 2), y + 11, 1, 4);
    px(ctx, look.faceDark, x + 1, y + 6, 2, 1);
    px(ctx, "#827d77", x + 10, y + 12, 3, 1);
  } else {
    // Dressed sandstone with a carved band.
    px(ctx, look.face, x, y + 5, T, 11);
    px(ctx, look.trim, x, y + 5, T, 1);
    px(ctx, look.faceDark, x, y + 8, T, 3);
    for (let i = 1; i < T; i += 4) px(ctx, look.faceLine, x + i, y + 9, 2, 1);
    px(ctx, look.faceLine, x, y + 15, T, 1);
  }
}

/** A room's own floor where its use calls for one (casual panel 2026-11-17: one floor for every room
 *  of a building read as generated): tiles where water is used, flags in the stores, parquet in the fine
 *  rooms, rushes on the barracks' stone, a marble check in the entrance hall. */
export type BuildingFloorKind = "tiles" | "flags" | "parquet" | "rushes" | "marble";

const FLOOR_OF: Readonly<Record<string, BuildingFloorKind>> = {
  Kitchen: "tiles",
  Scullery: "tiles",
  Laundry: "tiles",
  Bathroom: "tiles",
  "Bath house": "tiles",
  Dairy: "tiles",
  Bakehouse: "tiles",
  Brewhouse: "tiles",
  Washhouse: "tiles",
  "Still room": "tiles",
  Pantry: "flags",
  Larder: "flags",
  Buttery: "flags",
  "Store room": "flags",
  Storeroom: "flags",
  "Lumber room": "flags",
  "Gun room": "flags",
  Library: "parquet",
  Study: "parquet",
  Ballroom: "parquet",
  Saloon: "parquet",
  "Long gallery": "parquet",
  "Drawing room": "parquet",
  "Withdrawing room": "parquet",
  "Music room": "parquet",
  Barracks: "rushes",
  Stables: "rushes",
  Kennels: "rushes",
  Guardroom: "rushes",
  "Guard room": "rushes",
  Mews: "rushes",
  Granary: "rushes",
  // A temple's own rooms off its nave: boards where monks read and robe, flags where they eat and meet,
  // rushes where they sleep, so the check is the church's alone (panel 2026-11-17).
  Scriptorium: "parquet",
  Vestry: "parquet",
  Sacristy: "parquet",
  "Chapter house": "flags",
  Refectory: "flags",
  Infirmary: "flags",
  Almonry: "flags",
  "Monks' cells": "rushes",
  Dormitory: "rushes",
  Dorter: "rushes",
  Cell: "rushes",
  "Entrance hall": "marble",
  Chapel: "marble",
  Narthex: "marble",
};

export function buildingFloorKindOf(name: string | undefined): BuildingFloorKind | null {
  return name ? (FLOOR_OF[name.replace(/\s+\d+$/u, "")] ?? null) : null;
}

function paintRoomFloor(ctx: Ctx, kind: BuildingFloorKind, x: number, y: number, noise: Noise) {
  switch (kind) {
    case "tiles": {
      // Red quarry tiles, four to a cell, a little worn.
      px(ctx, "#5a3428", x, y, T, T);
      for (let cy = 0; cy < 2; cy++)
        for (let cx = 0; cx < 2; cx++) {
          const shade = noise(cx + cy * 2 + 30);
          px(ctx, shade < 0.4 ? "#8a4a36" : shade < 0.8 ? "#94523c" : "#7c4232", x + cx * 8, y + cy * 8, 7, 7);
        }
      if (noise(40) < 0.2)
        px(ctx, "#6a3a2c", x + 2 + Math.floor(noise(41) * 10), y + 2 + Math.floor(noise(42) * 10), 2, 1);
      return;
    }
    case "flags": {
      px(ctx, "#5c5750", x, y, T, T);
      const split = 5 + Math.floor(noise(1) * 6);
      px(ctx, "#47433d", x, y + split, T, 1);
      px(ctx, "#47433d", x + 4 + Math.floor(noise(2) * 8), y, 1, split);
      px(ctx, "#47433d", x + 2 + Math.floor(noise(3) * 10), y + split, 1, T - split);
      px(ctx, "#47433d", x, y + 15, T, 1);
      px(ctx, "#47433d", x + 15, y, 1, T);
      return;
    }
    case "parquet": {
      // Herringbone in a honey wood, set a little lighter than the boards elsewhere.
      px(ctx, "#8a6438", x, y, T, T);
      for (let k = 0; k < 4; k++) {
        const flip = ((x / T + y / T + k) & 1) === 0;
        px(ctx, flip ? "#9a7244" : "#7e5a32", x + (flip ? 0 : 8), y + k * 4, 8, 3);
        px(ctx, flip ? "#7e5a32" : "#9a7244", x + (flip ? 8 : 0), y + k * 4, 8, 3);
        px(ctx, "#6a4a2a", x, y + k * 4 + 3, T, 1);
      }
      px(ctx, "#6a4a2a", x + 7, y, 1, T);
      return;
    }
    case "rushes": {
      paintRoomFloor(ctx, "flags", x, y, noise);
      for (let i = 0; i < 4; i++)
        px(
          ctx,
          noise(50 + i) < 0.5 ? "#9a8442" : "#8a7438",
          x + Math.floor(noise(54 + i) * 12),
          y + Math.floor(noise(58 + i) * 15),
          4,
          1,
        );
      return;
    }
    case "marble": {
      // A black-and-white check of marble slabs, one to a cell.
      const light = ((x / T + y / T) & 1) === 0;
      px(ctx, light ? "#d8d2c4" : "#3e3a3a", x, y, T, T);
      px(ctx, light ? "#c4bdae" : "#2e2a2a", x, y + 15, T, 1);
      px(ctx, light ? "#c4bdae" : "#2e2a2a", x + 15, y, 1, T);
      if (noise(60) < 0.5)
        px(
          ctx,
          light ? "#bdb5a5" : "#4e4848",
          x + 3 + Math.floor(noise(61) * 8),
          y + 4 + Math.floor(noise(62) * 8),
          4,
          1,
        );
      return;
    }
  }
}

/** A floor cell: a room's, or the hall's (set apart from the rooms). */
export function paintBuildingFloor(
  ctx: Ctx,
  style: BuildingStyle,
  x: number,
  y: number,
  hall: boolean,
  noise: Noise,
  /** Whether the hall goes on above and below this cell, so a runner's borders mark only its edges. */
  hallGoesOn: { up: boolean; down: boolean } = { up: false, down: false },
  /** The room's own floor, when its use calls for one. */
  room: BuildingFloorKind | null = null,
) {
  if (room && !hall) {
    paintRoomFloor(ctx, room, x, y, noise);
    return;
  }
  if (style === "manor") {
    if (hall) {
      // A worn runner the length of the hall, bordered only where the hall ends.
      px(ctx, "#5e2329", x, y, T, T);
      if (!hallGoesOn.up) {
        px(ctx, "#3a1418", x, y, T, 1);
        px(ctx, "#8a6a3a", x, y + 1, T, 1);
        px(ctx, "#4a1a20", x, y + 2, T, 1);
      }
      if (!hallGoesOn.down) {
        px(ctx, "#4a1a20", x, y + 13, T, 1);
        px(ctx, "#8a6a3a", x, y + 14, T, 1);
        px(ctx, "#3a1418", x, y + 15, T, 1);
      }
      // A small lozenge every other cell, along the runner's middle.
      // (A runner two cells wide has its lozenge across the seam between them.)
      if ((x / T) % 2 === 0) {
        const top = hallGoesOn.down && !hallGoesOn.up ? 13 : hallGoesOn.up && !hallGoesOn.down ? -3 : 5;
        if (!(hallGoesOn.up && hallGoesOn.down))
          [2, 4, 6, 6, 4, 2].forEach((w, i) => {
            const row = top + i;
            if (row >= 0 && row < T) px(ctx, i === 0 || i === 5 ? "#8a6a3a" : "#7a3a40", x + 8 - w / 2, y + row, w, 1);
          });
      }
      if (noise(4) < 0.3) px(ctx, "#4f1d22", x + Math.floor(noise(5) * 12), y + 4 + Math.floor(noise(6) * 8), 3, 1);
      return;
    }
    // Floorboards: four long planks to a cell, a rare joint, a little grain.
    for (let row = 0; row < 4; row++) {
      const shade = noise(row + 20);
      px(ctx, shade < 0.33 ? "#674730" : shade < 0.66 ? "#6c4b32" : "#715035", x, y + row * 4, T, 3);
      px(ctx, "#56392a", x, y + row * 4 + 3, T, 1);
      if (noise(row) < 0.3) px(ctx, "#56392a", x + 2 + Math.floor(noise(row + 4) * 12), y + row * 4, 1, 3);
      if (noise(row + 8) < 0.5) px(ctx, "#5f412c", x + Math.floor(noise(row + 12) * 11), y + row * 4 + 1, 4, 1);
    }
    return;
  }
  if (style === "keep") {
    // Flagstones, the hall's darker and strewn with rushes.
    px(ctx, hall ? "#4d4943" : "#5c5750", x, y, T, T);
    const line = hall ? "#3a3733" : "#47433d";
    const split = 5 + Math.floor(noise(1) * 6);
    px(ctx, line, x, y + split, T, 1);
    px(ctx, line, x + 4 + Math.floor(noise(2) * 8), y, 1, split);
    px(ctx, line, x + 2 + Math.floor(noise(3) * 10), y + split, 1, T - split);
    px(ctx, line, x, y + 15, T, 1);
    px(ctx, line, x + 15, y, 1, T);
    if (hall)
      for (let i = 0; i < 3; i++)
        px(ctx, "#7a6a3a", x + Math.floor(noise(4 + i) * 13), y + Math.floor(noise(8 + i) * 15), 3, 1);
    return;
  }
  // Temple tiles: a checker in the rooms, larger slabs down the hall.
  if (hall) {
    px(ctx, "#6e6552", x, y, T, T);
    px(ctx, "#5c5444", x, y + 15, T, 1);
    px(ctx, "#5c5444", x + 15, y, 1, T);
    px(ctx, "#7c725d", x + 1, y + 1, 14, 1);
    return;
  }
  for (let cy = 0; cy < 2; cy++)
    for (let cx = 0; cx < 2; cx++)
      px(ctx, (cx + cy + x / T + y / T) % 2 ? "#7a6f59" : "#8c8068", x + cx * 8, y + cy * 8, 8, 8);
  if (noise(1) < 0.25) px(ctx, "#5e5644", x + Math.floor(noise(2) * 12), y + Math.floor(noise(3) * 12), 4, 1);
}

/** Standing water over a flooded floor. */
export function paintBuildingWater(ctx: Ctx, x: number, y: number, noise: Noise) {
  px(ctx, "#25404c", x, y, T, T);
  for (let i = 0; i < 2; i++) {
    const rx = x + Math.floor(noise(i * 2) * 10);
    const ry = y + 3 + Math.floor(noise(i * 2 + 1) * 10);
    px(ctx, "#3d6474", rx, ry, 5, 1);
    px(ctx, "#1c323c", rx + 1, ry + 1, 4, 1);
  }
}

/** One piece of furniture, by the set's prop slot. */
export function paintBuildingProp(
  ctx: Ctx,
  style: BuildingStyle,
  prop: number,
  x: number,
  y: number,
  /** Which neighbours hold the same piece: tables side by side are drawn as one long board. */
  join: { w?: boolean; e?: boolean; n?: boolean; s?: boolean } = {},
) {
  const ink = "#140d08";
  // A store's shelves: jars, pots and sacks, as a keep's are, in any building.
  if (prop === 34 && style !== "keep") return paintBuildingProp(ctx, "keep", 2, x, y);
  if (prop === 34) prop = 2;
  switch (prop) {
    case 0: {
      if (style === "temple") {
        // A pew: a bench and its back.
        px(ctx, ink, x + 1, y + 3, 14, 10);
        px(ctx, "#5e3d22", x + 2, y + 4, 12, 4);
        px(ctx, "#7a5230", x + 2, y + 4, 12, 1);
        px(ctx, "#6e4828", x + 2, y + 8, 12, 3);
        px(ctx, "#8a6038", x + 2, y + 8, 12, 1);
        px(ctx, "#3e2614", x + 3, y + 11, 1, 2);
        px(ctx, "#3e2614", x + 12, y + 11, 1, 2);
        return;
      }
      const [topCol, light, leg] =
        style === "keep" ? ["#7a6040", "#94784f", "#4e3c26"] : ["#7e4f2c", "#a06a3c", "#4a2e1a"];
      if (join.w || join.e || join.n || join.s) {
        // One board of a long table: the top runs on into the next piece, legs only at the ends.
        const across = Boolean(join.w || join.e);
        const [x0, x1] = across ? [join.w ? 0 : 1, join.e ? 16 : 15] : [3, 13];
        const [y0, y1] = across ? [4, 12] : [join.n ? 0 : 1, join.s ? 16 : 15];
        const [ix, iw] = [x0 + (join.w ? 0 : 1), x1 - x0 - (join.w ? 0 : 1) - (join.e ? 0 : 1)];
        px(ctx, ink, x + x0, y + y0 - 1, x1 - x0, y1 - y0 + 2);
        px(ctx, topCol, x + ix, y + y0, iw, y1 - y0);
        px(ctx, light, x + ix, y + y0, iw, 1);
        if (across) {
          px(ctx, "#3a2414", x + ix, y + y1 - 1, iw, 1);
          if (!join.w) px(ctx, leg, x + 2, y + y1 + 1, 2, 2);
          if (!join.e) px(ctx, leg, x + 12, y + y1 + 1, 2, 2);
          if (style === "manor") px(ctx, "#d8d0c0", x + 7, y + 6, 2, 2);
        } else if (style === "manor") px(ctx, "#d8d0c0", x + 7, y + 7, 2, 2);
        return;
      }
      px(ctx, ink, x + 1, y + 3, 14, 10);
      px(ctx, topCol, x + 2, y + 4, 12, 6);
      px(ctx, light, x + 2, y + 4, 12, 1);
      px(ctx, "#3a2414", x + 2, y + 10, 12, 1);
      px(ctx, leg, x + 3, y + 11, 2, 2);
      px(ctx, leg, x + 11, y + 11, 2, 2);
      if (style === "manor") {
        px(ctx, "#d8d0c0", x + 5, y + 5, 2, 2);
        px(ctx, "#c8a040", x + 10, y + 5, 1, 3);
      }
      return;
    }
    case 1: {
      if (style === "temple") {
        // The altar: a stone block, its cloth and two candles.
        px(ctx, ink, x + 1, y + 4, 14, 11);
        px(ctx, "#b0a890", x + 2, y + 5, 12, 9);
        px(ctx, "#d2caae", x + 2, y + 5, 12, 2);
        px(ctx, "#8a2a36", x + 6, y + 6, 4, 6);
        px(ctx, "#c8a040", x + 6, y + 11, 4, 1);
        px(ctx, "#e8e0c8", x + 3, y + 3, 1, 3);
        px(ctx, "#e8e0c8", x + 12, y + 3, 1, 3);
        px(ctx, "#f4c050", x + 3, y + 2, 1, 1);
        px(ctx, "#f4c050", x + 12, y + 2, 1, 1);
        return;
      }
      const blanket = style === "keep" ? ["#6a6450", "#7e7860"] : ["#7e2632", "#9e3a46"];
      px(ctx, ink, x + 2, y + 1, 12, 14);
      px(ctx, style === "keep" ? "#5a4630" : "#4a2e1a", x + 3, y + 2, 10, 12);
      px(ctx, "#e4dccb", x + 4, y + 3, 8, 3);
      px(ctx, "#bdb3a0", x + 4, y + 5, 8, 1);
      px(ctx, blanket[0]!, x + 3, y + 7, 10, 7);
      px(ctx, blanket[1]!, x + 3, y + 7, 10, 1);
      px(ctx, blanket[1]!, x + 4, y + 10, 8, 1);
      return;
    }
    case 17: {
      // A weapon rack against the wall: a rail on two posts with a spear, a sword and an axe stood in it;
      // open, not a barred window (panel 2026-11-17).
      px(ctx, ink, x + 1, y + 4, 14, 3);
      px(ctx, ink, x + 1, y + 12, 14, 3);
      px(ctx, "#7a5a34", x + 2, y + 5, 12, 1);
      px(ctx, "#7a5a34", x + 2, y + 13, 12, 1);
      px(ctx, "#4e3c26", x + 2, y + 4, 1, 11);
      px(ctx, "#4e3c26", x + 13, y + 4, 1, 11);
      // The spear: a long shaft, a bright head.
      px(ctx, "#8a6a3a", x + 4, y + 2, 1, 13);
      px(ctx, "#d8d8e0", x + 4, y, 1, 3);
      // The sword: blade, crossguard, grip.
      px(ctx, "#c4c4cc", x + 7, y + 1, 1, 9);
      px(ctx, "#e8e8f0", x + 7, y + 1, 1, 1);
      px(ctx, "#c8a040", x + 6, y + 10, 3, 1);
      px(ctx, "#5a3a20", x + 7, y + 11, 1, 3);
      // The axe: haft and a head to one side.
      px(ctx, "#8a6a3a", x + 10, y + 3, 1, 12);
      px(ctx, "#b4b4bc", x + 11, y + 3, 2, 3);
      px(ctx, "#d8d8e0", x + 12, y + 3, 1, 3);
      return;
    }
    case 3: {
      if (style !== "manor") {
        // A brazier: a bowl of coals on three legs.
        px(ctx, "#2a2424", x + 4, y + 11, 1, 4);
        px(ctx, "#2a2424", x + 11, y + 11, 1, 4);
        px(ctx, "#2a2424", x + 7, y + 12, 2, 3);
        px(ctx, ink, x + 2, y + 7, 12, 5);
        px(ctx, "#5a4a3a", x + 3, y + 8, 10, 3);
        px(ctx, "#c84a20", x + 4, y + 6, 8, 2);
        px(ctx, "#f0a030", x + 5, y + 3, 6, 4);
        px(ctx, "#f8e070", x + 7, y + 2, 2, 3);
        return;
      }
      // A fireplace in its stone surround.
      px(ctx, ink, x, y + 1, T, 15);
      px(ctx, "#6b6560", x + 1, y + 2, 14, 14);
      px(ctx, "#8a837c", x + 1, y + 2, 14, 2);
      px(ctx, "#140c08", x + 4, y + 6, 8, 10);
      px(ctx, "#c84a20", x + 5, y + 12, 6, 3);
      px(ctx, "#f0a030", x + 6, y + 10, 4, 3);
      px(ctx, "#f8e070", x + 7, y + 9, 2, 2);
      return;
    }
    case 4: {
      // A chest: lid, iron bands, a lock.
      px(ctx, ink, x + 2, y + 4, 12, 10);
      px(ctx, "#6a4020", x + 3, y + 7, 10, 6);
      px(ctx, "#86522a", x + 3, y + 5, 10, 3);
      px(ctx, "#a06a3a", x + 3, y + 5, 10, 1);
      px(ctx, "#3a2412", x + 3, y + 8, 10, 1);
      px(ctx, "#8a8a92", x + 5, y + 5, 1, 8);
      px(ctx, "#8a8a92", x + 10, y + 5, 1, 8);
      px(ctx, "#d8b040", x + 7, y + 8, 2, 2);
      return;
    }
    case 5: {
      // The door out: an open door with daylight beyond.
      px(ctx, ink, x + 1, y, 14, T);
      px(ctx, "#3a2414", x + 2, y + 1, 12, 15);
      px(ctx, "#e8d8a0", x + 4, y + 2, 8, 14);
      px(ctx, "#f4ecc8", x + 5, y + 3, 6, 12);
      px(ctx, "#7a4e2a", x + 2, y + 2, 3, 14);
      px(ctx, "#5e3a1e", x + 4, y + 2, 1, 14);
      px(ctx, "#d8b040", x + 3, y + 9, 1, 1);
      return;
    }
    case 6: {
      // A locked door: iron-banded, a padlock.
      px(ctx, ink, x + 1, y, 14, T);
      px(ctx, "#5a3a22", x + 2, y + 1, 12, 15);
      px(ctx, "#4a2e1a", x + 6, y + 1, 1, 15);
      px(ctx, "#4a2e1a", x + 10, y + 1, 1, 15);
      px(ctx, "#5e5e68", x + 2, y + 3, 12, 2);
      px(ctx, "#5e5e68", x + 2, y + 12, 12, 2);
      px(ctx, "#7c7c86", x + 2, y + 3, 12, 1);
      px(ctx, ink, x + 6, y + 6, 5, 6);
      px(ctx, "#d8b040", x + 7, y + 8, 3, 3);
      px(ctx, "#a08020", x + 7, y + 6, 1, 2);
      px(ctx, "#a08020", x + 9, y + 6, 1, 2);
      px(ctx, ink, x + 8, y + 9, 1, 1);
      return;
    }
    case 2: {
      px(ctx, ink, x + 1, y + 1, 14, 14);
      if (style === "keep") {
        // Plain shelves of jars, bundles and pots.
        px(ctx, "#4e3c26", x + 2, y + 2, 12, 12);
        px(ctx, "#6a5236", x + 2, y + 6, 12, 1);
        px(ctx, "#6a5236", x + 2, y + 10, 12, 1);
        for (const row of [3, 7, 11])
          for (let i = 0; i < 3; i++)
            px(ctx, ["#8a7a5a", "#6a6a72", "#9a6a3a"][(i + row) % 3]!, x + 3 + i * 4, y + row, 3, 3);
        return;
      }
      // Shelves: of books in a manor, of scrolls in a temple.
      px(ctx, "#3e2616", x + 2, y + 2, 12, 12);
      px(ctx, "#5a3a22", x + 2, y + 6, 12, 1);
      px(ctx, "#5a3a22", x + 2, y + 10, 12, 1);
      const books =
        style === "temple" ? ["#e0d4b0", "#cfc29c", "#e8dcbc"] : ["#8a2a36", "#2a4a6a", "#4a6a2a", "#a07a2a"];
      for (const row of [3, 7, 11])
        for (let i = 0; i < 5; i++) {
          const colour = books[(i + row) % books.length]!;
          if (style === "temple") px(ctx, colour, x + 3 + i * 2, y + row + 1, 2, 2);
          else px(ctx, colour, x + 3 + i * 2, y + row, 1 + ((i + row) % 2), 3);
        }
      return;
    }
    case 7: {
      // Rubble: broken stone and a charred beam.
      px(ctx, "#2e1e12", x + 1, y + 9, 13, 2);
      px(ctx, "#4a3020", x + 1, y + 9, 13, 1);
      for (const [rx, ry, w, h, c] of [
        [2, 5, 5, 4, "#7a746c"],
        [7, 8, 6, 5, "#5e5952"],
        [3, 11, 4, 3, "#9a948a"],
        [10, 3, 4, 4, "#8a847c"],
        [12, 11, 3, 3, "#6a655e"],
      ] as const) {
        px(ctx, ink, x + rx - 1, y + ry - 1, w + 2, h + 2);
        px(ctx, c, x + rx, y + ry, w, h);
        px(ctx, "#b0aaa0", x + rx, y + ry, w - 1, 1);
      }
      return;
    }
    default:
      paintBuildingDressing(ctx, style, prop, x, y, join);
  }
}

/** A building's furnishings past its first five (slots 8 on, dungeon-map BUILDING_DRESSING), in the same
 *  plain pixel art (gamer panel 2026-11-17: a kitchen should look like a kitchen). */
function paintBuildingDressing(
  ctx: Ctx,
  style: BuildingStyle,
  prop: number,
  x: number,
  y: number,
  join: { w?: boolean; e?: boolean; n?: boolean; s?: boolean },
) {
  const ink = "#140d08";
  const wood = style === "keep" ? ["#5a4630", "#7a6040", "#3a2c1c"] : ["#6a4020", "#8a5a30", "#3a2412"];
  const stone = style === "temple" ? ["#b8b09a", "#d6ceb4", "#8a836e"] : ["#7a756e", "#9a958c", "#55514c"];
  switch (prop) {
    case 8: {
      // Barrels: two casks, hooped.
      for (const [bx, by] of [
        [1, 3],
        [8, 6],
      ] as const) {
        px(ctx, ink, x + bx, y + by, 7, 9);
        px(ctx, wood[0]!, x + bx + 1, y + by + 1, 5, 7);
        px(ctx, wood[1]!, x + bx + 1, y + by + 1, 5, 1);
        px(ctx, "#4a4a52", x + bx + 1, y + by + 2, 5, 1);
        px(ctx, "#4a4a52", x + bx + 1, y + by + 6, 5, 1);
        px(ctx, wood[2]!, x + bx + 3, y + by + 1, 1, 7);
      }
      return;
    }
    case 9: {
      // Crates and a sack.
      px(ctx, ink, x + 1, y + 5, 9, 9);
      px(ctx, "#8a6a3a", x + 2, y + 6, 7, 7);
      px(ctx, "#a4844c", x + 2, y + 6, 7, 1);
      px(ctx, "#5e4422", x + 2, y + 9, 7, 1);
      px(ctx, "#5e4422", x + 5, y + 6, 1, 7);
      px(ctx, ink, x + 9, y + 2, 6, 8);
      px(ctx, "#b8a478", x + 10, y + 3, 4, 6);
      px(ctx, "#d4c498", x + 10, y + 3, 4, 1);
      px(ctx, "#7a6a48", x + 11, y + 2, 2, 1);
      return;
    }
    case 10: {
      // A wardrobe: tall doors, a handle each.
      px(ctx, ink, x + 2, y, 12, 15);
      px(ctx, wood[0]!, x + 3, y + 1, 10, 13);
      px(ctx, wood[1]!, x + 3, y + 1, 10, 1);
      px(ctx, wood[2]!, x + 8, y + 2, 1, 12);
      px(ctx, "#d8b040", x + 6, y + 7, 1, 2);
      px(ctx, "#d8b040", x + 10, y + 7, 1, 2);
      return;
    }
    case 11: {
      // A writing desk: paper, ink and a candle.
      px(ctx, ink, x + 1, y + 4, 14, 9);
      px(ctx, wood[0]!, x + 2, y + 5, 12, 5);
      px(ctx, wood[1]!, x + 2, y + 5, 12, 1);
      px(ctx, wood[2]!, x + 3, y + 10, 2, 3);
      px(ctx, wood[2]!, x + 11, y + 10, 2, 3);
      px(ctx, "#e8e0c8", x + 4, y + 6, 4, 3);
      px(ctx, "#202028", x + 9, y + 6, 1, 2);
      px(ctx, "#e8e0c8", x + 12, y + 3, 1, 3);
      px(ctx, "#f4c050", x + 12, y + 2, 1, 1);
      return;
    }
    case 12: {
      // A bathtub: a wooden tub with water.
      px(ctx, ink, x + 1, y + 3, 14, 11);
      px(ctx, wood[1]!, x + 2, y + 4, 12, 9);
      px(ctx, "#4a7a9a", x + 3, y + 5, 10, 6);
      px(ctx, "#7aaac8", x + 4, y + 6, 4, 1);
      px(ctx, "#4a4a52", x + 2, y + 8, 12, 1);
      return;
    }
    case 13: {
      // A high seat on its step, a cushion and a back.
      px(ctx, ink, x + 2, y, 12, 16);
      px(ctx, stone[2]!, x + 2, y + 12, 12, 3);
      px(ctx, wood[0]!, x + 4, y + 1, 8, 11);
      px(ctx, wood[1]!, x + 4, y + 1, 8, 1);
      px(ctx, "#8a2a36", x + 5, y + 7, 6, 4);
      px(ctx, "#c8a040", x + 5, y + 2, 1, 1);
      px(ctx, "#c8a040", x + 10, y + 2, 1, 1);
      return;
    }
    case 14: {
      // An anvil on its block.
      px(ctx, ink, x + 1, y + 4, 14, 11);
      px(ctx, "#3a3a42", x + 2, y + 5, 12, 3);
      px(ctx, "#5a5a64", x + 2, y + 5, 12, 1);
      px(ctx, "#3a3a42", x + 5, y + 8, 6, 2);
      px(ctx, wood[0]!, x + 4, y + 10, 8, 4);
      px(ctx, wood[1]!, x + 4, y + 10, 8, 1);
      return;
    }
    case 15: {
      // A statue on its plinth.
      px(ctx, ink, x + 3, y, 10, 16);
      px(ctx, stone[2]!, x + 3, y + 12, 10, 3);
      px(ctx, stone[0]!, x + 6, y + 1, 4, 3);
      px(ctx, stone[0]!, x + 5, y + 4, 6, 8);
      px(ctx, stone[1]!, x + 5, y + 4, 2, 8);
      px(ctx, stone[1]!, x + 6, y + 1, 2, 2);
      return;
    }
    case 16: {
      // A stone column.
      px(ctx, ink, x + 3, y, 10, 16);
      px(ctx, stone[0]!, x + 4, y + 1, 8, 14);
      px(ctx, stone[1]!, x + 4, y + 1, 3, 14);
      px(ctx, stone[2]!, x + 3, y + 13, 10, 2);
      px(ctx, stone[2]!, x + 3, y + 1, 10, 2);
      return;
    }
    case 18: {
      // A straw pallet and a blanket.
      px(ctx, ink, x + 2, y + 2, 12, 12);
      px(ctx, "#b8a050", x + 3, y + 3, 10, 10);
      px(ctx, "#d0bc6a", x + 3, y + 3, 10, 1);
      px(ctx, "#6a6450", x + 3, y + 8, 10, 5);
      return;
    }
    case 19: {
      // A cooking range: a hearth with a pot over it.
      px(ctx, ink, x, y + 1, T, 15);
      px(ctx, stone[0]!, x + 1, y + 2, 14, 13);
      px(ctx, stone[1]!, x + 1, y + 2, 14, 2);
      px(ctx, "#140c08", x + 3, y + 6, 10, 9);
      px(ctx, "#c84a20", x + 4, y + 12, 8, 2);
      px(ctx, "#2a2a30", x + 5, y + 8, 6, 4);
      px(ctx, "#4a4a52", x + 5, y + 8, 6, 1);
      px(ctx, "#f0a030", x + 6, y + 13, 4, 1);
      return;
    }
    case 20: {
      // A well: a stone ring round dark water.
      px(ctx, ink, x + 1, y + 2, 14, 13);
      px(ctx, stone[0]!, x + 2, y + 3, 12, 11);
      px(ctx, stone[1]!, x + 2, y + 3, 12, 2);
      px(ctx, "#1a2a3a", x + 4, y + 5, 8, 7);
      px(ctx, "#2a4a6a", x + 5, y + 6, 3, 1);
      return;
    }
    case 21: {
      // A font: a stone basin on a stem.
      px(ctx, ink, x + 2, y + 3, 12, 12);
      px(ctx, stone[0]!, x + 3, y + 4, 10, 5);
      px(ctx, "#4a7a9a", x + 4, y + 5, 8, 2);
      px(ctx, stone[2]!, x + 6, y + 9, 4, 4);
      px(ctx, stone[0]!, x + 4, y + 13, 8, 1);
      return;
    }
    case 22: {
      // A manger with hay.
      px(ctx, ink, x + 1, y + 5, 14, 9);
      px(ctx, wood[0]!, x + 2, y + 6, 12, 7);
      px(ctx, "#c8b060", x + 3, y + 6, 10, 3);
      px(ctx, "#e0cc78", x + 4, y + 6, 3, 1);
      px(ctx, wood[2]!, x + 2, y + 10, 12, 1);
      return;
    }
    case 23: {
      // A lectern with an open book.
      px(ctx, ink, x + 3, y + 2, 10, 13);
      px(ctx, wood[0]!, x + 7, y + 7, 2, 7);
      px(ctx, wood[0]!, x + 5, y + 13, 6, 1);
      px(ctx, wood[1]!, x + 4, y + 3, 8, 4);
      px(ctx, "#e8e0c8", x + 5, y + 3, 3, 3);
      px(ctx, "#e8e0c8", x + 8, y + 3, 3, 3);
      return;
    }
    case 24: {
      // An altar: a stone block, its cloth and two candles.
      px(ctx, ink, x + 1, y + 4, 14, 11);
      px(ctx, stone[0]!, x + 2, y + 5, 12, 9);
      px(ctx, stone[1]!, x + 2, y + 5, 12, 2);
      px(ctx, "#8a2a36", x + 6, y + 6, 4, 6);
      px(ctx, "#c8a040", x + 6, y + 11, 4, 1);
      px(ctx, "#e8e0c8", x + 3, y + 3, 1, 3);
      px(ctx, "#e8e0c8", x + 12, y + 3, 1, 3);
      px(ctx, "#f4c050", x + 3, y + 2, 1, 1);
      px(ctx, "#f4c050", x + 12, y + 2, 1, 1);
      return;
    }
    case 25: {
      if (join.w || join.e) {
        // A long pew across the nave: one bench and back running on from its neighbours.
        const [x0, x1] = [join.w ? 0 : 1, join.e ? 16 : 15];
        const [ix, iw] = [join.w ? 0 : x0 + 1, x1 - (join.w ? 0 : x0 + 1) - (join.e ? 0 : 1)];
        px(ctx, ink, x + x0, y + 3, x1 - x0, 10);
        px(ctx, wood[0]!, x + ix, y + 4, iw, 4);
        px(ctx, wood[1]!, x + ix, y + 4, iw, 1);
        px(ctx, wood[0]!, x + ix, y + 8, iw, 3);
        px(ctx, wood[1]!, x + ix, y + 8, iw, 1);
        if (!join.w) px(ctx, wood[2]!, x + 3, y + 11, 1, 2);
        if (!join.e) px(ctx, wood[2]!, x + 12, y + 11, 1, 2);
        return;
      }
      if (join.n || join.s) {
        const [y0, y1] = [join.n ? 0 : 1, join.s ? 16 : 15];
        px(ctx, ink, x + 3, y + y0, 10, y1 - y0);
        px(ctx, wood[0]!, x + 4, y + y0 + (join.n ? 0 : 1), 4, y1 - y0 - (join.n ? 0 : 1) - (join.s ? 0 : 1));
        px(ctx, wood[1]!, x + 4, y + y0 + (join.n ? 0 : 1), 1, y1 - y0 - (join.n ? 0 : 1) - (join.s ? 0 : 1));
        px(ctx, wood[0]!, x + 8, y + y0 + (join.n ? 0 : 1), 3, y1 - y0 - (join.n ? 0 : 1) - (join.s ? 0 : 1));
        return;
      }
      // A pew: a bench and its back.
      px(ctx, ink, x + 1, y + 3, 14, 10);
      px(ctx, wood[0]!, x + 2, y + 4, 12, 4);
      px(ctx, wood[1]!, x + 2, y + 4, 12, 1);
      px(ctx, wood[0]!, x + 2, y + 8, 12, 3);
      px(ctx, wood[1]!, x + 2, y + 8, 12, 1);
      px(ctx, wood[2]!, x + 3, y + 11, 1, 2);
      px(ctx, wood[2]!, x + 12, y + 11, 1, 2);
      return;
    }
    case 26: {
      // A tomb: a carved lid on a stone chest.
      px(ctx, ink, x + 2, y, 12, 16);
      px(ctx, stone[2]!, x + 3, y + 1, 10, 14);
      px(ctx, stone[0]!, x + 4, y + 2, 8, 12);
      px(ctx, stone[1]!, x + 4, y + 2, 8, 1);
      px(ctx, stone[2]!, x + 7, y + 4, 2, 7);
      px(ctx, stone[2]!, x + 5, y + 6, 6, 2);
      return;
    }
    case 27: {
      // A stool: a round seat on three legs.
      px(ctx, ink, x + 4, y + 5, 8, 7);
      px(ctx, wood[0]!, x + 5, y + 6, 6, 4);
      px(ctx, wood[1]!, x + 5, y + 6, 6, 1);
      px(ctx, wood[2]!, x + 5, y + 10, 1, 3);
      px(ctx, wood[2]!, x + 10, y + 10, 1, 3);
      return;
    }
    case 28: {
      // Chains and shackles: an iron plate in the wall, a heavy chain hanging in a loop, a cuff at each end.
      px(ctx, ink, x + 5, y, 6, 4);
      px(ctx, "#5a5a62", x + 6, y + 1, 4, 2);
      const links: Array<[number, number]> = [
        [6, 4],
        [5, 6],
        [4, 8],
        [4, 10],
        [9, 4],
        [10, 6],
        [11, 8],
        [11, 10],
      ];
      for (const [k, [lx, ly]] of links.entries()) {
        px(ctx, ink, x + lx - 1, y + ly - 1, 3, 3);
        px(ctx, k % 2 ? "#6a6a74" : "#9a9aa4", x + lx, y + ly, 1, 2);
      }
      for (const cx of [3, 10]) {
        px(ctx, ink, x + cx - 1, y + 11, 5, 5);
        px(ctx, "#8a8a94", x + cx, y + 12, 3, 3);
        px(ctx, "#2a2a30", x + cx + 1, y + 13, 1, 1);
      }
      return;
    }
    case 29: {
      // A wooden bucket with an iron hoop and a rope handle.
      px(ctx, ink, x + 4, y + 6, 8, 9);
      px(ctx, wood[0]!, x + 5, y + 7, 6, 7);
      px(ctx, "#2a3a48", x + 5, y + 7, 6, 2);
      px(ctx, "#4a4a52", x + 5, y + 10, 6, 1);
      px(ctx, "#b8a478", x + 5, y + 4, 1, 3);
      px(ctx, "#b8a478", x + 10, y + 4, 1, 3);
      px(ctx, "#b8a478", x + 6, y + 3, 4, 1);
      return;
    }
    case 30: {
      // A heap of straw.
      px(ctx, "#6a5a24", x + 1, y + 6, 14, 9);
      px(ctx, "#a08a3a", x + 2, y + 5, 12, 8);
      px(ctx, "#c4ac54", x + 4, y + 4, 8, 4);
      for (const [hx, hy] of [
        [3, 8],
        [7, 6],
        [10, 9],
        [5, 11],
        [12, 7],
      ] as const)
        px(ctx, "#e0cc78", x + hx, y + hy, 2, 1);
      return;
    }
    case 31: {
      // A wine rack: a lattice of bottle ends.
      px(ctx, ink, x + 1, y + 1, 14, 14);
      px(ctx, wood[2]!, x + 2, y + 2, 12, 12);
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++) {
          px(ctx, wood[1]!, x + 2 + c * 4, y + 2 + r * 4, 4, 1);
          px(ctx, (r + c) % 2 ? "#3a1a24" : "#2a3a1a", x + 3 + c * 4, y + 3 + r * 4, 2, 2);
        }
      return;
    }
    case 32: {
      // A heap of bones and a skull.
      for (const [bx, by, w, h] of [
        [2, 10, 7, 1],
        [6, 12, 8, 1],
        [3, 7, 1, 6],
        [11, 8, 1, 5],
        [8, 9, 5, 1],
      ] as const)
        px(ctx, "#cfc6aa", x + bx, y + by, w, h);
      px(ctx, ink, x + 4, y + 3, 6, 6);
      px(ctx, "#e4dcc0", x + 5, y + 3, 4, 4);
      px(ctx, ink, x + 5, y + 5, 1, 1);
      px(ctx, ink, x + 8, y + 5, 1, 1);
      return;
    }
    case 33: {
      // A wall niche under a round arch, stacked with four skulls.
      px(ctx, ink, x + 1, y + 2, 14, 13);
      px(ctx, ink, x + 3, y, 10, 2);
      px(ctx, "#1c1814", x + 2, y + 3, 12, 11);
      for (const [sx, sy] of [
        [2, 3],
        [8, 3],
        [2, 9],
        [8, 9],
      ] as const) {
        px(ctx, "#d8d0b4", x + sx + 1, y + sy, 4, 1);
        px(ctx, "#d8d0b4", x + sx, y + sy + 1, 6, 3);
        px(ctx, "#b8b094", x + sx + 1, y + sy + 4, 4, 1);
        px(ctx, ink, x + sx + 1, y + sy + 2, 1, 1);
        px(ctx, ink, x + sx + 4, y + sy + 2, 1, 1);
      }
      return;
    }
    case 35: {
      // A stool knocked over on its side.
      px(ctx, ink, x + 3, y + 8, 10, 6);
      px(ctx, wood[0]!, x + 4, y + 9, 3, 4);
      px(ctx, wood[1]!, x + 4, y + 9, 1, 4);
      px(ctx, wood[2]!, x + 7, y + 10, 5, 1);
      px(ctx, wood[2]!, x + 7, y + 12, 5, 1);
      return;
    }
    case 36: {
      // A sword dropped on the floor, on the slant.
      for (let k = 0; k < 9; k++) px(ctx, k === 0 ? "#e8e8f0" : "#b4b4bc", x + 3 + k, y + 3 + k, 1, 1);
      px(ctx, "#c8a040", x + 10, y + 13, 3, 1);
      px(ctx, "#c8a040", x + 12, y + 11, 1, 3);
      px(ctx, "#5a3a20", x + 13, y + 14, 2, 1);
      return;
    }
    case 37: {
      // A jug on its side and what ran out of it.
      px(ctx, "#5a1a20", x + 2, y + 10, 9, 3);
      px(ctx, "#7a2a30", x + 3, y + 11, 6, 1);
      px(ctx, ink, x + 8, y + 6, 6, 6);
      px(ctx, "#a06a3c", x + 9, y + 7, 4, 4);
      px(ctx, "#c88a54", x + 9, y + 7, 4, 1);
      px(ctx, ink, x + 7, y + 8, 1, 2);
      return;
    }
    case 38: {
      // Cobwebs strung across a corner.
      const web = "rgba(220, 220, 228, 0.55)";
      for (let k = 0; k < 12; k++) {
        px(ctx, web, x + k, y, 1, 1);
        px(ctx, web, x, y + k, 1, 1);
        if (k < 11) px(ctx, web, x + k, y + 11 - k, 1, 1);
        if (k < 7) px(ctx, web, x + k, y + 6 - k, 1, 1);
      }
      px(ctx, web, x + 2, y + 2, 1, 1);
      px(ctx, web, x + 4, y + 4, 1, 1);
      return;
    }
    case 40: {
      // A handcart: a box bed on two wheels, its shafts out in front.
      px(ctx, ink, x + 1, y + 3, 11, 8);
      px(ctx, wood[0]!, x + 2, y + 4, 9, 6);
      px(ctx, wood[1]!, x + 2, y + 4, 9, 1);
      px(ctx, wood[2]!, x + 5, y + 4, 1, 6);
      px(ctx, wood[2]!, x + 12, y + 5, 4, 1);
      px(ctx, wood[2]!, x + 12, y + 8, 4, 1);
      for (const wy of [1, 10]) {
        px(ctx, ink, x + 4, y + wy, 5, 5);
        px(ctx, "#4a3420", x + 5, y + wy + 1, 3, 3);
        px(ctx, "#8a6a3a", x + 6, y + wy + 2, 1, 1);
      }
      return;
    }
    case 41: {
      // A training dummy: a straw man on a post, a cross-bar for arms.
      px(ctx, wood[2]!, x + 7, y + 6, 2, 10);
      px(ctx, ink, x + 2, y + 6, 12, 3);
      px(ctx, wood[1]!, x + 3, y + 7, 10, 1);
      px(ctx, ink, x + 4, y + 7, 8, 7);
      px(ctx, "#b8a050", x + 5, y + 8, 6, 5);
      px(ctx, "#d8c070", x + 5, y + 8, 6, 1);
      px(ctx, ink, x + 5, y, 6, 6);
      px(ctx, "#c8b060", x + 6, y + 1, 4, 4);
      px(ctx, "#8a2a20", x + 7, y + 9, 2, 2);
      return;
    }
    case 42: {
      // A woodpile: split logs stacked end-on.
      px(ctx, ink, x + 1, y + 5, 14, 10);
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 4; c++) {
          const [lx, ly] = [x + 2 + c * 3 + (r % 2), y + 6 + r * 3];
          px(ctx, "#6a4426", lx, ly, 3, 3);
          px(ctx, "#b88a54", lx + 1, ly + 1, 1, 1);
        }
      return;
    }
  }
}

/** A rug laid down the middle of a room: a border and a field. */
/** A colour lightened (amount > 0) or darkened (amount < 0), for a rug's pattern from its one colour. */
function shade(colour: string, amount: number): string {
  const n = parseInt(colour.slice(1), 16);
  const f = (v: number) =>
    Math.max(0, Math.min(255, Math.round(amount > 0 ? v + (255 - v) * amount : v * (1 + amount))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
}

/** A great rug: a fringed edge, a gold border with a running pattern, a lattice field of small lozenges and
 *  a medallion in the middle (roguelike panel 2026-11-17: a flat slab read as a placeholder). */
export function paintBuildingRug(ctx: Ctx, x: number, y: number, w: number, h: number, colour: string) {
  const light = shade(colour, 0.25);
  const dark = shade(colour, -0.35);
  // Fringe at the two short ends.
  const across = w >= h;
  for (let k = 0; k < (across ? h : w); k += 2)
    if (across) {
      px(ctx, "#d8c8a0", x - 2, y + k, 2, 1);
      px(ctx, "#d8c8a0", x + w, y + k, 2, 1);
    } else {
      px(ctx, "#d8c8a0", x + k, y - 2, 1, 2);
      px(ctx, "#d8c8a0", x + k, y + h, 1, 2);
    }
  px(ctx, "#2a1a10", x, y, w, h);
  px(ctx, "#b08a38", x + 1, y + 1, w - 2, h - 2);
  px(ctx, dark, x + 3, y + 3, w - 6, h - 6);
  // The border's running pattern: small squares along its middle.
  for (let k = x + 4; k < x + w - 4; k += 4) {
    px(ctx, dark, k, y + 2, 2, 1);
    px(ctx, dark, k, y + h - 3, 2, 1);
  }
  for (let k = y + 4; k < y + h - 4; k += 4) {
    px(ctx, dark, x + 2, k, 1, 2);
    px(ctx, dark, x + w - 3, k, 1, 2);
  }
  // The field, inside a thin inner border, set with a lattice of lozenges.
  const [fx, fy, fw, fh] = [x + 5, y + 5, w - 10, h - 10];
  if (fw <= 0 || fh <= 0) return;
  px(ctx, colour, fx, fy, fw, fh);
  px(ctx, light, fx, fy, fw, 1);
  px(ctx, light, fx, fy + fh - 1, fw, 1);
  px(ctx, light, fx, fy, 1, fh);
  px(ctx, light, fx + fw - 1, fy, 1, fh);
  for (let ly = fy + 4; ly < fy + fh - 3; ly += 8)
    for (let lx = fx + 4 + (((ly - fy - 4) / 8) % 2) * 4; lx < fx + fw - 3; lx += 8) {
      px(ctx, light, lx, ly - 1, 1, 1);
      px(ctx, light, lx - 1, ly, 3, 1);
      px(ctx, light, lx, ly + 1, 1, 1);
    }
  // The medallion: a gold lozenge in the middle with the dark colour inside.
  const [mx, my] = [Math.round(x + w / 2), Math.round(y + h / 2)];
  const r = Math.max(4, Math.min(12, Math.floor(Math.min(w, h) / 5)));
  for (let k = -r; k <= r; k++) {
    const span = r - Math.abs(k);
    px(ctx, "#b08a38", mx - span, my + k, span * 2 + 1, 1);
    if (span > 2) px(ctx, dark, mx - span + 2, my + k, span * 2 - 3, 1);
    if (span > 5) px(ctx, light, mx - span + 5, my + k, span * 2 - 9, 1);
  }
  // A corner piece in each corner of the field.
  for (const [cx, cy] of [
    [fx + 2, fy + 2],
    [fx + fw - 5, fy + 2],
    [fx + 2, fy + fh - 5],
    [fx + fw - 5, fy + fh - 5],
  ] as const)
    px(ctx, "#b08a38", cx, cy, 3, 3);
}

/** A dais: the raised end of a hall under its high seat or altar, a step lit along the edge facing the room
 *  (gamer panel 2026-11-17). `front` is the side the step faces. */
export function paintBuildingDais(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  front: "N" | "S" | "E" | "W",
  stone: boolean,
) {
  const [base, top, line] = stone ? ["#5e5a52", "#7a756a", "#46423c"] : ["#5a3a22", "#7a5432", "#3a2414"];
  px(ctx, base, x, y, w, h);
  px(ctx, top, x + 1, y + 1, w - 2, h - 2);
  for (let k = y + 8; k < y + h - 2; k += 8) px(ctx, line, x + 1, k, w - 2, 1);
  // The step: a lit lip and its shadow on the side facing the hall.
  if (front === "S") {
    px(ctx, "#a89c84", x, y + h - 3, w, 1);
    px(ctx, "#1a120c", x, y + h - 1, w, 1);
  } else if (front === "N") {
    px(ctx, "#a89c84", x, y + 2, w, 1);
    px(ctx, "#1a120c", x, y, w, 1);
  } else if (front === "E") {
    px(ctx, "#a89c84", x + w - 3, y, 1, h);
    px(ctx, "#1a120c", x + w - 1, y, 1, h);
  } else {
    px(ctx, "#a89c84", x + 2, y, 1, h);
    px(ctx, "#1a120c", x, y, 1, h);
  }
}

/** A way to another level: stairs down or up, a ladder, a hole in the floor. */
export function paintSiteLink(ctx: Ctx, kind: string, down: boolean, x: number, y: number) {
  const ink = "#0c0806";
  if (kind === "hole") {
    px(ctx, "#3a2414", x + 1, y + 2, 14, 12);
    px(ctx, ink, x + 2, y + 3, 12, 10);
    px(ctx, "#050302", x + 4, y + 5, 8, 6);
    for (const [bx, by, w] of [
      [1, 2, 3],
      [10, 2, 5],
      [1, 12, 5],
      [12, 11, 3],
    ] as const)
      px(ctx, "#6a4a30", x + bx, y + by, w, 2);
    return;
  }
  if (kind === "ladder" || kind === "wall") {
    if (down) px(ctx, ink, x + 2, y + 1, 12, 14);
    px(ctx, "#7a5a34", x + 4, y, 2, T);
    px(ctx, "#7a5a34", x + 10, y, 2, T);
    for (let r = 2; r < T; r += 4) px(ctx, "#9a7444", x + 4, y + r, 8, 1);
    return;
  }
  // Stairs: steps that darken going down, or lighten going up; a servants' stair is narrower.
  const [l, r] = kind === "servants" ? [4, 12] : [2, 14];
  px(ctx, ink, x + l - 1, y, r - l + 2, T);
  const shades = down ? ["#8a8070", "#6a6256", "#4a443c", "#2a2620"] : ["#3a3530", "#5a544a", "#7a7266", "#9a9282"];
  for (let i = 0; i < 4; i++) {
    px(ctx, shades[i]!, x + l, y + i * 4, r - l, 3);
    px(ctx, ink, x + l, y + i * 4 + 3, r - l, 1);
  }
  // Its way: a solid arrowhead, outlined, over the steps.
  const pale = "#f4ead0";
  const rows = [8, 6, 4, 2].map((w, i) => ({ w, i, row: down ? y + 6 + i : y + 9 - i }));
  for (const { w, i, row } of rows) px(ctx, ink, x + 3 + i, row - 1, w + 2, 3);
  for (const { w, i, row } of rows) px(ctx, pale, x + 4 + i, row, w, 1);
}

/** A trap the party has found: its plate, marked. */
export function paintFoundTrap(ctx: Ctx, x: number, y: number) {
  px(ctx, "#140d08", x + 2, y + 2, 12, 12);
  px(ctx, "#5a5040", x + 3, y + 3, 10, 10);
  px(ctx, "#6e6450", x + 3, y + 3, 10, 1);
  for (let i = 0; i < 8; i++) {
    px(ctx, "#d84030", x + 4 + i, y + 4 + i, 1, 1);
    px(ctx, "#d84030", x + 11 - i, y + 4 + i, 1, 1);
  }
}

/** An open court (a courtyard, an inner ward, a cloister garth): grass with a flagged path across it,
 *  open to the sky. */
export function paintBuildingCourt(ctx: Ctx, x: number, y: number, path: boolean, noise: Noise) {
  if (path) {
    px(ctx, "#6f6a5e", x, y, T, T);
    for (let row = 0; row < 2; row++) {
      const offset = row % 2 ? 4 : 0;
      px(ctx, "#57524a", x, y + row * 8 + 7, T, 1);
      px(ctx, "#57524a", x + ((offset + 8) % T), y + row * 8, 1, 7);
    }
    if (noise(31) < 0.4) px(ctx, "#5f6b3c", x + Math.floor(noise(32) * 13), y + Math.floor(noise(33) * 13), 2, 1);
    return;
  }
  px(ctx, "#4d6a32", x, y, T, T);
  for (let k = 0; k < 7; k++) {
    const shade = noise(40 + k);
    px(
      ctx,
      shade < 0.5 ? "#5c7a3a" : "#41592b",
      x + Math.floor(noise(50 + k) * 15),
      y + Math.floor(noise(60 + k) * 14),
      1,
      2,
    );
  }
  if (noise(70) < 0.15) px(ctx, "#c9c07a", x + 4 + Math.floor(noise(71) * 8), y + 4 + Math.floor(noise(72) * 8), 1, 1);
}

/** The earth and rock a building's cellars are dug into: packed earth with stones in it, never a void
 *  (panel 2026-11-17). */
/** A castle's bailey: packed, trodden earth with cart ruts and a few tufts, one open yard rather than
 *  beds of grass between paved strips (panel 2026-11-17). */
export function paintBuildingYard(ctx: Ctx, x: number, y: number, noise: Noise) {
  px(ctx, "#7a6448", x, y, T, T);
  for (let k = 0; k < 8; k++)
    px(
      ctx,
      noise(120 + k) < 0.5 ? "#6c583e" : "#86704f",
      x + Math.floor(noise(130 + k) * 14),
      y + Math.floor(noise(140 + k) * 15),
      2 + Math.floor(noise(150 + k) * 3),
      1,
    );
  if (noise(160) < 0.25)
    px(ctx, "#5a4a34", x + 1 + Math.floor(noise(161) * 12), y + 2 + Math.floor(noise(162) * 11), 1, 1);
  if (noise(163) < 0.18)
    for (let k = 0; k < 3; k++)
      px(ctx, "#5c7a3a", x + 4 + Math.floor(noise(164 + k) * 8) + k, y + 9 + Math.floor(noise(167) * 4), 1, 2);
}
export function paintBuildingEarth(ctx: Ctx, x: number, y: number, noise: Noise) {
  px(ctx, "#2b251f", x, y, T, T);
  for (let k = 0; k < 6; k++)
    px(
      ctx,
      noise(80 + k) < 0.5 ? "#342d25" : "#231e19",
      x + Math.floor(noise(90 + k) * 14),
      y + Math.floor(noise(100 + k) * 15),
      2,
      1,
    );
  if (noise(110) < 0.35) {
    const [sx, sy] = [x + 2 + Math.floor(noise(111) * 9), y + 2 + Math.floor(noise(112) * 9)];
    px(ctx, "#17130f", sx, sy + 1, 5, 4);
    px(ctx, "#4a4239", sx, sy, 5, 4);
    px(ctx, "#5c5348", sx, sy, 4, 1);
  }
}
