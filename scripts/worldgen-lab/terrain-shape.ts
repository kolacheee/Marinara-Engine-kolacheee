/**
 * Terrain lab: measures how realistic a compiled world's ground is, so a generator change can be shown to
 * help. Not a regression; run with
 *   packages/server/node_modules/.bin/tsx scripts/worldgen-lab/terrain-shape.ts [version...]
 * Measures:
 *   waterBlobs   separate bodies of water per 1000 cells (lower: seas and lakes, not puddles)
 *   bigWater     share of all water in the largest body (higher: one sea or ocean)
 *   rangeLen     mountain ranges' length to width (elongation of barrier patches of 4+ cells; higher = ranges)
 *   peaks        barrier patches per 1000 cells (lower: ranges, not scattered peaks)
 *   foothills    hill cells within 2 cells of mountains (higher: hills rise into ranges)
 *   marshWater   marsh cells within 2 cells of water (higher: wetlands by lakes, rivers and coasts)
 *   patch        mean patch size of open ground classes, in cells (higher: coherent forests and plains)
 */
import { WORLD_STARTER_KITS, compileWorld, parseWorldKit } from "../../packages/shared/src/index.js";

const kits = WORLD_STARTER_KITS.map((input) => {
  const parsed = parseWorldKit(input);
  if (!parsed.ok) throw new Error("kit");
  return parsed.kit;
});
const HILL = /hill|highland|moor|upland/;
const MARSH = /marsh|swamp|bog|\bfen|wetland/;

function components(cells: boolean[], width: number, height: number): number[][] {
  const seen = new Uint8Array(cells.length);
  const out: number[][] = [];
  for (let start = 0; start < cells.length; start++) {
    if (!cells[start] || seen[start]) continue;
    const stack = [start];
    const part: number[] = [];
    seen[start] = 1;
    while (stack.length) {
      const at = stack.pop()!;
      part.push(at);
      const [x, y] = [at % width, Math.floor(at / width)];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const [nx, ny] = [x + dx, y + dy];
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const next = ny * width + nx;
          if (cells[next] && !seen[next]) {
            seen[next] = 1;
            stack.push(next);
          }
        }
    }
    out.push(part);
  }
  return out;
}
function elongation(part: number[], width: number) {
  const xs = part.map((c) => c % width);
  const ys = part.map((c) => Math.floor(c / width));
  const mx = xs.reduce((s, v) => s + v, 0) / xs.length;
  const my = ys.reduce((s, v) => s + v, 0) / ys.length;
  let sxx = 0,
    syy = 0,
    sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    sxx += (xs[i]! - mx) ** 2;
    syy += (ys[i]! - my) ** 2;
    sxy += (xs[i]! - mx) * (ys[i]! - my);
  }
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l1 = tr / 2 + disc;
  const l2 = Math.max(tr / 2 - disc, 0.25 * xs.length);
  return Math.sqrt(l1 / l2);
}

const versions = process.argv.slice(2).map(Number);
if (!versions.length) versions.push(5);
const SCALES = ["region", "realm", "world"] as const;
const SEEDS = Array.from({ length: 12 }, (_, i) => 2000 + i * 7919);
for (const version of versions) {
  const sums: Record<string, number[]> = {};
  const perKit: Record<string, Record<string, number[]>> = {};
  const add = (kit: string, key: string, value: number) => {
    if (!Number.isFinite(value)) return;
    (sums[key] ??= []).push(value);
    ((perKit[kit] ??= {})[key] ??= []).push(value);
  };
  for (const kit of kits) {
    for (const scale of SCALES) {
      for (const seed of SEEDS) {
        const world = compileWorld({ seed, kit: { ...kit, scale }, generatorVersion: version });
        const { width, height } = world;
        const terrain = world.terrain.map((id) => kit.terrain!.find((t) => t.id === id)!);
        const cls = Array.from(world.ground, (c) => terrain[parseInt(c, 36)]!);
        const near = (at: number, r: number, test: (t: (typeof cls)[number]) => boolean) => {
          const [x, y] = [at % width, Math.floor(at / width)];
          for (let dy = -r; dy <= r; dy++)
            for (let dx = -r; dx <= r; dx++) {
              const [nx, ny] = [x + dx, y + dy];
              if (nx >= 0 && ny >= 0 && nx < width && ny < height && test(cls[ny * width + nx]!)) return true;
            }
          return false;
        };
        const water = components(
          cls.map((t) => t.kind === "water"),
          width,
          height,
        );
        const waterCells = water.reduce((s, p) => s + p.length, 0);
        if (waterCells) {
          add(kit.id, "waterBlobs", (water.length / cls.length) * 1000);
          add(kit.id, "bigWater", Math.max(...water.map((p) => p.length)) / waterCells);
        }
        const barrier = components(
          cls.map((t) => t.kind === "barrier"),
          width,
          height,
        );
        if (barrier.length) {
          const big = barrier.filter((p) => p.length >= 4);
          const total = big.reduce((s, p) => s + p.length, 0);
          if (total) add(kit.id, "rangeLen", big.reduce((s, p) => s + elongation(p, width) * p.length, 0) / total);
          add(kit.id, "peaks", (barrier.length / cls.length) * 1000);
          const hills = cls.map((t, at) => ({ t, at })).filter(({ t }) => HILL.test(t.id));
          if (hills.length)
            add(
              kit.id,
              "foothills",
              hills.filter(({ at }) => near(at, 2, (t) => t.kind === "barrier")).length / hills.length,
            );
        }
        const marsh = cls.map((t, at) => ({ t, at })).filter(({ t }) => MARSH.test(t.id));
        if (marsh.length && waterCells)
          add(
            kit.id,
            "marshWater",
            marsh.filter(({ at }) => near(at, 2, (t) => t.kind === "water")).length / marsh.length,
          );
        const openIds = [...new Set(cls.filter((t) => t.kind === "open").map((t) => t.id))];
        const sizes = openIds.flatMap((id) =>
          components(
            cls.map((t) => t.id === id),
            width,
            height,
          ).map((p) => p.length),
        );
        add(kit.id, "patch", sizes.reduce((s, v) => s + v, 0) / sizes.length);
      }
    }
  }
  const mean = (xs: number[] = []) => (xs.length ? (xs.reduce((s, x) => s + x, 0) / xs.length).toFixed(2) : "-");
  const keys = ["waterBlobs", "bigWater", "rangeLen", "peaks", "foothills", "marshWater", "patch"];
  console.log(`\ngenerator ${version}  (${kits.length} kits x ${SCALES.length} scales x ${SEEDS.length} seeds)`);
  console.log(["kit".padEnd(22), ...keys.map((k) => k.padStart(11))].join(""));
  for (const [id, values] of Object.entries(perKit))
    console.log([id.padEnd(22), ...keys.map((k) => mean(values[k]).padStart(11))].join(""));
  console.log(["ALL".padEnd(22), ...keys.map((k) => mean(sums[k]).padStart(11))].join(""));
}
