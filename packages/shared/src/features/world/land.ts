import { worldRoadCells } from "./edges.js";

// ──────────────────────────────────────────────
// Rivers and resources (world generator 7): what the shaped ground (generator 6) carries. Rain falls on
// the land as the winds bring it and runs downhill to the sea, a lake or off the map's edge; where enough
// of it gathers, a river. Then the things settlements grow around: harbours, mountain passes, ore, salt,
// timber, fishing grounds, rich river soil, falls, and the fords where ways cross the rivers. All of it is
// a pure function of the ground and the seed, as the rest of the world compile is.
// ──────────────────────────────────────────────

/** The things a settlement grows around, as the world marks them on its map. */
export const WORLD_RESOURCE_KINDS = Object.freeze([
  "harbor",
  "pass",
  "ore",
  "salt",
  "timber",
  "fish",
  "fertile",
  "falls",
  "ford",
] as const);
export type WorldResourceKind = (typeof WORLD_RESOURCE_KINDS)[number];

export interface WorldResource {
  kind: WorldResourceKind;
  at: { x: number; y: number };
}

/** A river, from its source down to where it ends: its last cell is the water it flows into, the river it
 *  joins, or a cell on the map's edge it flows off. `width` is each cell's size, 1 a stream to 3 a great
 *  river. */
export interface WorldRiver {
  path: number[];
  width: number[];
}

/** How the GM and the map name each resource, whatever the setting. */
export const WORLD_RESOURCE_WORDS: Readonly<Record<WorldResourceKind, string>> = Object.freeze({
  harbor: "a sheltered harbour",
  pass: "a pass through the mountains",
  ore: "ore in the hills",
  salt: "salt pans",
  timber: "good timber",
  fish: "rich fishing waters",
  fertile: "rich river soil",
  falls: "falls on the river",
  ford: "a ford where the road crosses the river",
});

/** The words of a setting's place tags that each resource answers to, so a town beside one is tagged for
 *  it when the setting has such a tag (a mining town beside ore, a port at a harbour). */
export const WORLD_RESOURCE_TAG_WORDS: Readonly<Record<WorldResourceKind, RegExp>> = Object.freeze({
  harbor: /port|harbo|dock|wharf|pier|shipyard/,
  pass: /pass\b|border|fort|gate/,
  ore: /mine|mining|quarry|scrapyard/,
  salt: /salt|market|trade/,
  timber: /forest|woods|lumber|bamboo|mill/,
  fish: /fish|beach|port|harbo/,
  fertile: /farm|field|agricult|padd|orchard/,
  falls: /mill|factory|falls/,
  ford: /crossroads|bridge|ford|inn|station/,
});

/** How strongly each resource beside a cell draws a settlement to it. */
export const WORLD_RESOURCE_PULL: Readonly<Record<WorldResourceKind, number>> = Object.freeze({
  harbor: 1.6,
  pass: 0.9,
  ore: 0.9,
  salt: 0.9,
  timber: 0.4,
  fish: 0.5,
  fertile: 0.7,
  falls: 0.8,
  ford: 0,
});

export interface WorldLandFields {
  width: number;
  height: number;
  elevation: Float64Array;
  moisture: Float64Array;
  uplift: Float64Array;
  isWater: Uint8Array;
  isBarrier: Uint8Array;
  /** Each cell's ground class id (pre-cultivation), for the words. */
  groundId: (cell: number) => string;
}

const WOODED = /forest|wood|grove|bamboo|jungle|taiga|conifer|pine/;
const FERTILE = /grass|plain|prairie|farm|field|padd|rice|meadow|steppe|pasture|orchard|vineyard/;
const HILL = /hill|highland|moor|upland/;
const POOR = /marsh|swamp|bog|\bfen|wetland|snow|tundra|\bice\b|glacier|toxic|waste|blight|dead|crater/;

/** The share of the land that is river, by how many cells a map has (more, thinner rivers on a big map). */
const RIVER_SHARE = 0.035;

/** A small binary heap of cells by a key, lowest first, ties by cell (so the order never depends on the
 *  engine). */
class CellHeap {
  private cells: number[] = [];
  constructor(private readonly key: Float64Array) {}
  get size() {
    return this.cells.length;
  }
  private less(a: number, b: number) {
    const [ka, kb] = [this.key[a]!, this.key[b]!];
    return ka < kb || (ka === kb && a < b);
  }
  push(cell: number) {
    const heap = this.cells;
    heap.push(cell);
    let at = heap.length - 1;
    while (at > 0) {
      const up = (at - 1) >> 1;
      if (!this.less(heap[at]!, heap[up]!)) break;
      [heap[at], heap[up]] = [heap[up]!, heap[at]!];
      at = up;
    }
  }
  pop(): number {
    const heap = this.cells;
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let at = 0;
      for (;;) {
        const [l, r] = [at * 2 + 1, at * 2 + 2];
        let best = at;
        if (l < heap.length && this.less(heap[l]!, heap[best]!)) best = l;
        if (r < heap.length && this.less(heap[r]!, heap[best]!)) best = r;
        if (best === at) break;
        [heap[at], heap[best]] = [heap[best]!, heap[at]!];
        at = best;
      }
    }
    return top;
  }
}

const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
] as const;

export interface WorldDrainage {
  /** Each cell's next cell downhill (-1: water, or off the map's edge). */
  down: Int32Array;
  /** How much rain has gathered at each cell. */
  flow: Float64Array;
  rivers: WorldRiver[];
  /** The river cells, with each one's width. */
  riverAt: Map<number, number>;
  /** River cells where one river runs into another, and land cells where a river meets the water. */
  confluences: Set<number>;
  mouths: Set<number>;
}

/**
 * The rain run downhill. Every land cell drains, by a priority flood from the water and the map's edge
 * (Barnes et al.), toward the lowest way out, so a hollow fills and spills rather than trapping it. Each
 * cell gathers its own rain and all that drains through it; cells that gather the most (a share of the
 * land) are river. Rivers are listed from their highest sources first, so a river's trunk is one path and
 * each tributary ends where it joins it.
 */
export function worldDrainage(land: WorldLandFields): WorldDrainage {
  const { width, height, elevation, moisture, isWater } = land;
  const count = width * height;
  const down = new Int32Array(count).fill(-1);
  const filled = new Float64Array(elevation);
  const seen = new Uint8Array(count);
  const heap = new CellHeap(filled);
  for (let cell = 0; cell < count; cell++) {
    const [x, y] = [cell % width, Math.floor(cell / width)];
    if (isWater[cell] || x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      seen[cell] = 1;
      heap.push(cell);
    }
  }
  while (heap.size) {
    const cell = heap.pop();
    const [x, y] = [cell % width, Math.floor(cell / width)];
    for (const [dx, dy] of NEIGHBOURS) {
      const [nx, ny] = [x + dx, y + dy];
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const next = ny * width + nx;
      if (seen[next]) continue;
      seen[next] = 1;
      filled[next] = Math.max(filled[next]!, filled[cell]! + 1e-6);
      down[next] = cell;
      heap.push(next);
    }
  }
  // Water cells and the edge drain nowhere further.
  for (let cell = 0; cell < count; cell++) {
    const [x, y] = [cell % width, Math.floor(cell / width)];
    if (isWater[cell] || x === 0 || y === 0 || x === width - 1 || y === height - 1) down[cell] = -1;
  }
  const landCells = [...Array(count).keys()].filter((cell) => !isWater[cell]);
  const order = [...landCells].sort((a, b) => filled[b]! - filled[a]! || a - b);
  const flow = new Float64Array(count);
  const rainMin = Math.min(...landCells.map((cell) => moisture[cell]!));
  for (const cell of order) {
    flow[cell] = flow[cell]! + 0.05 + Math.max(0, moisture[cell]! - rainMin);
    const next = down[cell]!;
    if (next >= 0 && !isWater[next]) flow[next] = flow[next]! + flow[cell]!;
  }
  // The river cells: the share of the land that gathers most.
  const ranked = [...landCells].sort((a, b) => flow[b]! - flow[a]! || a - b);
  const riverCount = Math.round(landCells.length * RIVER_SHARE);
  const threshold = riverCount > 0 ? flow[ranked[riverCount - 1]!]! : Infinity;
  const isRiver = (cell: number) => cell >= 0 && !isWater[cell] && flow[cell]! >= threshold;
  const widthOf = (cell: number) => (flow[cell]! >= threshold * 5 ? 3 : flow[cell]! >= threshold * 2.2 ? 2 : 1);
  const fed = new Uint8Array(count);
  for (const cell of landCells) if (isRiver(cell) && isRiver(down[cell]!)) fed[down[cell]!] = 1;
  const sources = landCells
    .filter((cell) => isRiver(cell) && !fed[cell])
    .sort((a, b) => filled[b]! - filled[a]! || a - b);
  const claimed = new Uint8Array(count);
  const rivers: WorldRiver[] = [];
  const riverAt = new Map<number, number>();
  const confluences = new Set<number>();
  const mouths = new Set<number>();
  for (const source of sources) {
    const path: number[] = [];
    let cell = source;
    while (cell >= 0 && !isWater[cell] && !claimed[cell]) {
      claimed[cell] = 1;
      path.push(cell);
      cell = down[cell]!;
    }
    const ending = cell >= 0 ? cell : undefined;
    // A stub of fewer than four cells is left out: a trickle into a river or straight into the sea is no
    // river worth a name (and reads as a mark on the map, not a river).
    if (path.length < 4) {
      for (const each of path) claimed[each] = 0;
      continue;
    }
    if (ending !== undefined) {
      if (isWater[ending]) mouths.add(path[path.length - 1]!);
      else confluences.add(ending);
      path.push(ending);
    }
    for (const each of path) if (!isWater[each]) riverAt.set(each, Math.max(riverAt.get(each) ?? 0, widthOf(each)));
    rivers.push({
      path,
      width: path.map((each) => (isWater[each] ? widthOf(path[path.length - 2] ?? each) : widthOf(each))),
    });
  }
  return { down, flow, rivers, riverAt, confluences, mouths };
}

/**
 * The resources: for each kind, its best few cells by what makes one (a harbour a sheltered shore or a
 * river mouth, ore the hills along a range, a pass a gap between mountains, salt a dry shore, timber woods
 * beside water to float it on, fishing waters shallow water near land, rich soil the lowland beside a
 * river, falls a river's steepest drop), a few cells apart, by the stream's jitter among near equals.
 */
export function worldResources(land: WorldLandFields, drainage: WorldDrainage, random: () => number): WorldResource[] {
  const { width, height, elevation, moisture, uplift, isWater, isBarrier, groundId } = land;
  const count = width * height;
  const around = (cell: number, r: number, test: (other: number) => boolean) => {
    const [x, y] = [cell % width, Math.floor(cell / width)];
    let n = 0;
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (!dx && !dy) continue;
        const [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && test(ny * width + nx)) n++;
      }
    return n;
  };
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= width || y >= height ? -1 : y * width + x);
  const openLand = (cell: number) => cell >= 0 && !isWater[cell] && !isBarrier[cell];
  // How wet a cell is among the land, 0 (driest) to 1.
  const landCells = [...Array(count).keys()].filter((cell) => !isWater[cell]);
  const wetRank = new Float64Array(count);
  [...landCells]
    .sort((a, b) => moisture[a]! - moisture[b]! || a - b)
    .forEach((cell, rank) => (wetRank[cell] = rank / Math.max(1, landCells.length - 1)));
  // The water a cell is beside is a big body (a sea, a big lake), not a pond.
  const body = new Int32Array(count);
  {
    const seen = new Uint8Array(count);
    for (let start = 0; start < count; start++) {
      if (!isWater[start] || seen[start]) continue;
      const part = [start];
      seen[start] = 1;
      for (let i = 0; i < part.length; i++) {
        const [x, y] = [part[i]! % width, Math.floor(part[i]! / width)];
        for (const [dx, dy] of NEIGHBOURS) {
          const next = at(x + dx, y + dy);
          if (next >= 0 && isWater[next] && !seen[next]) {
            seen[next] = 1;
            part.push(next);
          }
        }
      }
      for (const cell of part) body[cell] = part.length;
    }
  }
  const beside = (cell: number, test: (other: number) => boolean) => around(cell, 1, test) > 0;
  const lowRank = new Float64Array(count);
  [...landCells]
    .sort((a, b) => elevation[a]! - elevation[b]! || a - b)
    .forEach((cell, rank) => (lowRank[cell] = 1 - rank / Math.max(1, landCells.length - 1)));

  const scores: Record<Exclude<WorldResourceKind, "ford">, (cell: number) => number> = {
    harbor: (cell) => {
      if (!openLand(cell) || !beside(cell, (o) => isWater[o] === 1 && body[o]! >= 12)) return -Infinity;
      // Sheltered: water on several sides within two cells, but not a spit out into it.
      const wet = around(cell, 2, (o) => isWater[o] === 1);
      const shelter = 1 - Math.abs(wet - 10) / 10;
      return shelter * 2 + (drainage.mouths.has(cell) ? 2.5 : 0);
    },
    pass: (cell) => {
      if (!openLand(cell)) return -Infinity;
      const [x, y] = [cell % width, Math.floor(cell / width)];
      const wall = (dx: number, dy: number) =>
        [1, 2].some((step) => {
          const other = at(x + dx * step, y + dy * step);
          return other >= 0 && isBarrier[other] === 1;
        });
      const pinched =
        (wall(1, 0) && wall(-1, 0)) ||
        (wall(0, 1) && wall(0, -1)) ||
        (wall(1, 1) && wall(-1, -1)) ||
        (wall(1, -1) && wall(-1, 1));
      return pinched ? around(cell, 2, (o) => isBarrier[o] === 1) / 6 : -Infinity;
    },
    ore: (cell) => {
      if (!openLand(cell) || !around(cell, 2, (o) => isBarrier[o] === 1)) return -Infinity;
      return uplift[cell]! * 2 + (HILL.test(groundId(cell)) ? 0.8 : 0) + elevation[cell]!;
    },
    salt: (cell) => {
      if (!openLand(cell) || wetRank[cell]! > 0.3) return -Infinity;
      return (1 - wetRank[cell]!) * 2 + (beside(cell, (o) => isWater[o] === 1) ? 1.5 : 0) + lowRank[cell]!;
    },
    timber: (cell) => {
      if (!openLand(cell) || !WOODED.test(groundId(cell))) return -Infinity;
      const floated = drainage.riverAt.has(cell) || beside(cell, (o) => isWater[o] === 1 || drainage.riverAt.has(o));
      return around(cell, 2, (o) => WOODED.test(groundId(o))) / 8 + (floated ? 1.5 : 0);
    },
    fish: (cell) => {
      if (!isWater[cell]) return -Infinity;
      const shore = around(cell, 1, (o) => !isWater[o]);
      if (!shore) return -Infinity;
      return (
        1 -
        Math.abs(shore - 3) / 3 +
        (body[cell]! < 60 ? 0.4 : 0) +
        around(cell, 2, (o) => drainage.mouths.has(o)) * 0.6
      );
    },
    fertile: (cell) => {
      if (!openLand(cell) || POOR.test(groundId(cell)) || WOODED.test(groundId(cell))) return -Infinity;
      if (!drainage.riverAt.has(cell) && !beside(cell, (o) => drainage.riverAt.has(o))) return -Infinity;
      return lowRank[cell]! * 2 + (FERTILE.test(groundId(cell)) ? 0.8 : 0) + Math.log1p(drainage.flow[cell]!) * 0.2;
    },
    falls: (cell) => {
      if (!drainage.riverAt.has(cell)) return -Infinity;
      const next = drainage.down[cell]!;
      if (next < 0 || isWater[next]) return -Infinity;
      return (elevation[cell]! - elevation[next]!) * 10 + (drainage.riverAt.get(cell) ?? 1) * 0.3;
    },
  };
  // How many of each, by the map's size: about one for every 600 cells, at least one where any fits.
  const wanted = Math.max(1, Math.round(count / 600));
  const spacing = Math.max(4, Math.round(Math.sqrt(count / wanted) * 0.6));
  const out: WorldResource[] = [];
  for (const kind of Object.keys(scores) as Array<keyof typeof scores>) {
    const scored: Array<{ cell: number; score: number }> = [];
    for (let cell = 0; cell < count; cell++) {
      const score = scores[kind](cell);
      if (score > -Infinity) scored.push({ cell, score: score + random() * 0.3 });
    }
    scored.sort((a, b) => b.score - a.score || a.cell - b.cell);
    const chosen: number[] = [];
    for (const { cell } of scored) {
      if (chosen.length >= wanted) break;
      const [x, y] = [cell % width, Math.floor(cell / width)];
      if (chosen.some((other) => Math.hypot((other % width) - x, Math.floor(other / width) - y) < spacing)) continue;
      chosen.push(cell);
    }
    for (const cell of chosen) out.push({ kind, at: { x: cell % width, y: Math.floor(cell / width) } });
  }
  return out;
}

/** How much a cell draws a settlement for the rivers and resources around it (generator 7): a river
 *  beside it (more on it, where a town can bridge it), a confluence or a river mouth near, and each
 *  resource beside it by its pull (half as much two cells out). */
export function worldLandPull(
  width: number,
  height: number,
  drainage: WorldDrainage,
  resources: readonly WorldResource[],
): Float64Array {
  const pull = new Float64Array(width * height);
  const add = (cx: number, cy: number, r: number, amount: (ring: number) => number) => {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        const [x, y] = [cx + dx, cy + dy];
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const cell = y * width + x;
        pull[cell] = pull[cell]! + amount(Math.max(Math.abs(dx), Math.abs(dy)));
      }
  };
  const riverNear = new Float64Array(width * height);
  for (const [cell, size] of drainage.riverAt) {
    const [cx, cy] = [cell % width, Math.floor(cell / width)];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const [x, y] = [cx + dx, cy + dy];
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const at = y * width + x;
        riverNear[at] = Math.max(riverNear[at]!, (dx || dy ? 0.9 : 1.2) + (size - 1) * 0.2);
      }
  }
  for (let cell = 0; cell < pull.length; cell++) pull[cell] = pull[cell]! + riverNear[cell]!;
  for (const cell of [...drainage.confluences, ...drainage.mouths])
    add(cell % width, Math.floor(cell / width), 1, (ring) => (ring ? 0.4 : 0.7));
  for (const resource of resources) {
    const strength = WORLD_RESOURCE_PULL[resource.kind];
    if (strength) add(resource.at.x, resource.at.y, 2, (ring) => (ring <= 1 ? strength : strength / 2));
  }
  return pull;
}

/** The fords (generator 7): where each way over open ground first meets a river on its line, one ford to a
 *  crossing (a way that runs along a river is not crossing it again), none on a settlement's own cell. */
export function worldRoadFords(
  width: number,
  height: number,
  riverAt: ReadonlyMap<number, number>,
  ways: ReadonlyArray<{ from: { x: number; y: number }; to: { x: number; y: number } }>,
  settled: ReadonlySet<number>,
  wet: (cell: number) => boolean,
): WorldResource[] {
  const fords = new Set<number>();
  for (const way of ways) {
    const cells = worldRoadCells(way.from, way.to, (x, y) => wet(y * width + x) || settled.has(y * width + x));
    let onRiver = false;
    for (const { x, y } of cells) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const cell = y * width + x;
      const river = riverAt.has(cell);
      if (river && !onRiver) fords.add(cell);
      onRiver = river;
    }
  }
  // Two fords side by side are one crossing.
  const kept: number[] = [];
  for (const cell of [...fords].sort((a, b) => a - b)) {
    const [x, y] = [cell % width, Math.floor(cell / width)];
    if (kept.some((other) => Math.max(Math.abs((other % width) - x), Math.abs(Math.floor(other / width) - y)) <= 1))
      continue;
    kept.push(cell);
  }
  return kept.map((cell) => ({ kind: "ford" as const, at: { x: cell % width, y: Math.floor(cell / width) } }));
}
