/** Draws Earth worlds (the Earth seed) for a few settings and areas, as an HTML page of SVG maps.
 *    tsx scripts/worldgen-lab/earth.ts EARTH_DIR out.html [kit:area:scale[:year] ...]
 *  with the land past the edge round each (dimmed); area "drawn" for a world drawn from the seed. */
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync, inflateSync } from "node:zlib";
import {
  WORLD_EARTH_AREAS,
  WORLD_STARTER_KITS,
  compileWorld,
  parseWorldKit,
  sampleWorldEarth,
  worldBeyondGround,
  worldBeyondText,
  worldBriefSchema,
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
{
  const raw = readFileSync(`${dir}/earth-polities.bin`);
  const length = raw.readUInt32LE(0);
  const header = JSON.parse(gunzipSync(raw.subarray(4, 4 + length)).toString("utf8"));
  const history = JSON.parse(gunzipSync(readFileSync(`${dir}/earth-history.json.gz`)).toString("utf8"));
  data.history = {
    ...history,
    polities: {
      ...header,
      masks: new Uint8Array(raw.subarray(4 + length)),
      inflate: (bytes: Uint8Array) => new Uint8Array(inflateSync(bytes)),
    },
  };
}
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
  const [kitId, areaId, scale, yearText] = run.split(":");
  const year = yearText ? Number(yearText) : undefined;
  const parsed = parseWorldKit(WORLD_STARTER_KITS.find((kit) => kit.id === kitId)!);
  if (!parsed.ok) throw new Error(kitId);
  const kit = { ...parsed.kit, scale: (scale ?? parsed.kit.scale) as typeof parsed.kit.scale };
  // "drawn" for a world drawn from the seed (no Earth), to see its land past the edge.
  const area = WORLD_EARTH_AREAS.find((each) => each.id === areaId) ?? { id: "drawn", label: "drawn", lon: 0, lat: 0 };
  const earth =
    area.id === "drawn"
      ? undefined
      : sampleWorldEarth(data, {
          ...worldEarthCentre(data, kit.scale, area.lon, area.lat),
          scale: kit.scale,
          area: area.label,
          year,
        });
  const brief = worldBriefSchema.parse({
    briefVersion: 1 as const,
    premise: "x",
    placeNames: [
      { culture: "x", names: ["Valdmark", "Orrin", "Kesh", "Thalor", "Brenn", "Ystra", "Morrow", "Calder"] },
    ],
    ...(earth ? { earth } : {}),
  });
  const world = compileWorld({ seed: Number(process.env.SEED ?? 7), kit, brief });
  const beyond = worldBeyondGround({ kit, seed: 7, grounding: "expand", brief, world });
  const P = beyond.pad * S;
  const looks = world.terrain.map((id) => worldTerrainLook(kit.terrain!.find((t) => t.id === id)!));
  let body = "";
  for (let i = 0; i < beyond.cells.length; i++) {
    const index = beyond.cells[i]!;
    const fill = /ruin/.test(world.terrain[index] ?? "") ? "#4b2a6b" : (COLORS[looks[index]!] ?? "#999");
    body += `<rect x="${(i % beyond.width) * S}" y="${Math.floor(i / beyond.width) * S}" width="${S}" height="${S}" fill="${fill}"/>`;
  }
  const outerCentre = (cell: number) => [
    (cell % beyond.width) * S + S / 2,
    Math.floor(cell / beyond.width) * S + S / 2,
  ];
  for (const river of beyond.rivers)
    for (let i = 0; i < river.path.length - 1; i++) {
      const [[x1, y1], [x2, y2]] = [outerCentre(river.path[i]!), outerCentre(river.path[i + 1]!)];
      body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2f6fb0" stroke-width="${0.8 + river.width[i]! * 0.6}" stroke-linecap="round"/>`;
    }
  // The margin dimmed, as the Overworld draws it.
  body += `<path fill="#000" fill-opacity="0.35" fill-rule="evenodd" d="M0 0H${beyond.width * S}V${beyond.height * S}H0Z M${P} ${P}V${P + world.height * S}H${P + world.width * S}V${P}Z"/>`;
  body += `<g transform="translate(${P} ${P})">`;
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
  body += "</g>";
  const lands = [worldBeyondText({ kit, seed: 7, grounding: "expand", brief, world }).replace(/; /g, "\n  ")];
  const tops = world.places
    .filter((place) => place.depth <= settlementsDepth)
    .sort((a, b) => a.depth - b.depth)
    .map(
      (place) =>
        `${"  ".repeat(place.depth)}${place.name}${place.size ? ` (${place.size}) in ${world.places.find((p) => p.id === place.parentId)?.name ?? ""}` : ""}`,
    )
    .slice(0, 60);
  html += `<h3>${kitId} · ${area.label} · ${kit.scale}${year !== undefined ? ` · ${year}` : ""} (${world.width}×${world.height}${earth ? `, ${earth.rivers.length} rivers, ${earth.cities.length} cities, ground ${earth.ground.length} chars, beyond ${earth.beyond?.ground.length ?? 0} chars` : ""})</h3><div style="display:flex;gap:12px"><svg style="flex-shrink:0" width="${beyond.width * S}" height="${beyond.height * S}">${body}</svg><pre style="white-space:pre-wrap">${[...lands, "", ...tops].join("\n")}</pre></div>`;
}
writeFileSync(out, html + "</body>");
console.log("wrote", out);
