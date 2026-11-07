/** Draws Earth worlds (the Earth seed) for a few settings and areas, as an HTML page of SVG maps.
 *    tsx scripts/worldgen-lab/earth.ts EARTH_DIR out.html [kit:area:scale ...] */
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import {
  WORLD_EARTH_AREAS,
  WORLD_STARTER_KITS,
  compileWorld,
  parseWorldKit,
  sampleWorldEarth,
  worldEarthCentre,
  worldTerrainLook,
  type WorldEarthData,
} from "../../packages/shared/src/index.js";

const [dir = "packages/server/src/assets/earth", out = "earth.html", ...wanted] = process.argv.slice(2);
const data: WorldEarthData = {
  grid: { width: 3600, height: 1800, planes: new Uint8Array(gunzipSync(readFileSync(`${dir}/earth-grid.bin`))) },
  features: JSON.parse(gunzipSync(readFileSync(`${dir}/earth-features.json.gz`)).toString("utf8")),
  coast: { width: 18000, height: 9000, bits: new Uint8Array(gunzipSync(readFileSync(`${dir}/earth-coast.bin`))) },
};
const runs = wanted.length
  ? wanted
  : [
      "high_fantasy:british_isles:realm",
      "the_1920s:us_northeast:region",
      "modern_day:japan:town",
      "wuxia_xianxia:north_china:realm",
      "post_apocalyptic:california:region",
      "high_fantasy:mediterranean:world",
    ];
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
let html = "<body style='background:#222;color:#eee;font:13px sans-serif'>";
for (const run of runs) {
  const [kitId, areaId, scale] = run.split(":");
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((kit) => kit.id === kitId)!);
  if (!parsed.ok) throw new Error(kitId);
  const kit = { ...parsed.kit, scale: (scale ?? parsed.kit.scale) as typeof parsed.kit.scale };
  const area = WORLD_EARTH_AREAS.find((each) => each.id === areaId)!;
  const middle = worldEarthCentre(data, kit.scale, area.lon, area.lat);
  const earth = sampleWorldEarth(data, { ...middle, scale: kit.scale, area: area.label });
  const brief = {
    briefVersion: 1 as const,
    premise: "x",
    places: [],
    placeNames: [],
    events: [],
    groups: [],
    peoples: [],
    folk: [],
    faiths: [],
    peopleNames: [],
    earth,
  };
  const world = compileWorld({ seed: 7, kit, brief });
  const looks = world.terrain.map((id) => worldTerrainLook(kit.terrain!.find((t) => t.id === id)!));
  let body = "";
  for (let i = 0; i < world.ground.length; i++) {
    const index = parseInt(world.ground[i]!, 36);
    const fill = /ruin/.test(world.terrain[index] ?? "") ? "#4b2a6b" : (COLORS[looks[index]!] ?? "#999");
    body += `<rect x="${(i % world.width) * S}" y="${Math.floor(i / world.width) * S}" width="${S}" height="${S}" fill="${fill}"/>`;
  }
  const centre = (cell: number) => [(cell % world.width) * S + S / 2, Math.floor(cell / world.width) * S + S / 2];
  for (const river of world.rivers ?? [])
    for (let i = 0; i < river.path.length - 1; i++) {
      const [[x1, y1], [x2, y2]] = [centre(river.path[i]!), centre(river.path[i + 1]!)];
      body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2f6fb0" stroke-width="${0.8 + river.width[i]! * 0.6}" stroke-linecap="round"/>`;
    }
  for (const link of world.links)
    if (link.path)
      body += `<polyline fill="none" stroke="#7a4b2a" stroke-width="1.2" opacity="0.8" points="${link.path.map((c) => centre(c).join(",")).join(" ")}"/>`;
  const settlementsDepth = kit.layers.findIndex((layer) => layer.settlements);
  for (const place of world.places) {
    if (place.depth !== settlementsDepth) continue;
    const [x, y] = [place.at.x * S + S / 2, place.at.y * S + S / 2];
    body += `<circle cx="${x}" cy="${y}" r="${2 + (place.rank ?? 0)}" fill="#fff" stroke="#000"/><text x="${x + 5}" y="${y - 3}" font-size="10" fill="#000" stroke="#fff" stroke-width="2" paint-order="stroke">${place.name}</text>`;
  }
  const tops = world.places
    .filter((place) => place.depth < settlementsDepth)
    .map((place) => `${"  ".repeat(place.depth)}${place.name}`);
  html += `<h3>${kitId} · ${area.label} · ${kit.scale} (${world.width}×${world.height}, ${earth.rivers.length} rivers, ${earth.cities.length} cities, ground ${earth.ground.length} chars)</h3><div style="display:flex;gap:12px"><svg width="${world.width * S}" height="${world.height * S}">${body}</svg><pre>${tops.join("\n")}</pre></div>`;
}
writeFileSync(out, html + "</body>");
console.log("wrote", out);
