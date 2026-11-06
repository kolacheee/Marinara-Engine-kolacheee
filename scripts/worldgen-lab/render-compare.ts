/** Draws one world as generator 4 and generator 5 side by side, as an HTML page of two SVG maps. */
import { writeFileSync } from "node:fs";
import { WORLD_STARTER_KITS, compileWorld, parseWorldKit, worldTerrainLook } from "../../packages/shared/src/index.js";

const [kitId = "high_fantasy", seedText = "4242", out = "compare.html", left = "4", right = "5", scale = ""] =
  process.argv.slice(2);
const parsed = parseWorldKit(WORLD_STARTER_KITS.find((kit) => kit.id === kitId)!);
if (!parsed.ok) throw new Error("kit");
const kit = scale ? { ...parsed.kit, scale: scale as typeof parsed.kit.scale } : parsed.kit;
const COLORS: Record<string, string> = {
  grass: "#9cc46b",
  plains: "#c8cf86",
  farmland: "#e0c35a",
  forest: "#3f7a3a",
  hills: "#a99a6a",
  marsh: "#6f8f78",
  paddies: "#9fd0c0",
  bamboo: "#5f9a4a",
  sea: "#4a7fb8",
  lake: "#5b93c8",
  mountains: "#7d7066",
  suburb: "#d9a088",
  conifer_forest: "#2f5f3a",
  desert: "#e3cf96",
  snow: "#f2f2f2",
  scrub: "#b7a77a",
  wasteland: "#a08a6a",
};
const S = Number(process.env.CELL ?? 9);
function svg(version: number) {
  const world = compileWorld({ seed: Number(seedText), kit, generatorVersion: version });
  const looks = world.terrain.map((id) => worldTerrainLook(kit.terrain!.find((t) => t.id === id)!));
  let body = "";
  for (let i = 0; i < world.ground.length; i++) {
    const look = looks[parseInt(world.ground[i]!, 36)]!;
    body += `<rect x="${(i % world.width) * S}" y="${Math.floor(i / world.width) * S}" width="${S}" height="${S}" fill="${COLORS[look] ?? "#999"}"/>`;
  }
  const byId = new Map(world.places.map((p) => [p.id, p]));
  for (const link of world.links) {
    const a = byId.get(link.from)!,
      b = byId.get(link.to)!;
    body += `<line x1="${a.at.x * S + S / 2}" y1="${a.at.y * S + S / 2}" x2="${b.at.x * S + S / 2}" y2="${b.at.y * S + S / 2}" stroke="#5a3d1e" stroke-width="1.5" opacity="0.7"/>`;
  }
  for (const p of world.places.filter((p) => p.rank !== undefined)) {
    const r = 2 + p.rank! * 1.6;
    const port = p.tags.includes("port");
    body += `<circle cx="${p.at.x * S + S / 2}" cy="${p.at.y * S + S / 2}" r="${r}" fill="${port ? "#fff" : "#c0392b"}" stroke="#111" stroke-width="1.2"/>`;
  }
  return `<figure style="margin:0 12px;font:14px sans-serif"><svg width="${world.width * S}" height="${world.height * S}">${body}</svg><figcaption>Generator ${version}</figcaption></figure>`;
}
writeFileSync(
  out,
  `<html><body style="background:#fff;display:flex;padding:12px">${svg(Number(left))}${svg(Number(right))}</body><p style="font:13px sans-serif;padding:0 24px">Dots sized by rank; white dots are tagged port. Lines are links.</p></html>`,
);
