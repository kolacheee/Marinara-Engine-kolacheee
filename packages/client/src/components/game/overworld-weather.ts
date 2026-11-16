// ──────────────────────────────────────────────
// Weather drawn on the overworld (owner, 2026-11-16: "there's no art to render weather in an Overworld game").
// The map reads the weather a block of cells at a time (worldWeatherBlocks: the climate under each block,
// drifting east with the game's clock), so a storm one region over shows where it is. A place the Game
// Master holds at a weather (environment.ts) and the party's own spot (the chat's weather, which a scene
// can set) draw over it. The art is round 16's (BRIEF-16), the same for every setting: falling weather as
// animated tiles, clouds with their shadows drifting east, lightning, wind; fog is drawn from the clouds and
// the fog edges, as its own tile failed its critic.
// ──────────────────────────────────────────────
import { WORLD_WEATHER_BLOCK, type WeatherType } from "@marinara-engine/shared";

const ART_URL = "/images/overworld-weather/weather";
/** World units a cell (OVERWORLD_TILE), and the art's pixels a cell. */
const CELL = 16;
const ART_CELL = 48;
const TILE_CELLS = 4;

export interface OverworldWeatherArt {
  image: HTMLImageElement;
  frames: Record<string, [number, number, number, number]>;
}

let loading: Promise<OverworldWeatherArt | null> | null = null;

/** The weather sheet, loaded once for every overworld. */
export function loadOverworldWeatherArt(): Promise<OverworldWeatherArt | null> {
  loading ??= (async () => {
    try {
      const response = await fetch(`${ART_URL}.json`);
      if (!response.ok) return null;
      const sheet = (await response.json()) as { frames?: OverworldWeatherArt["frames"] };
      if (!sheet.frames) return null;
      const image = new Image();
      image.src = `${ART_URL}.png`;
      await image.decode();
      return { image, frames: sheet.frames };
    } catch {
      return null;
    }
  })();
  return loading;
}

/** The icon of the "weather here" badge (round 16 part E): a clear sky shows the sun by day and the moon by night. */
export function overworldWeatherIcon(weather: WeatherType, hour: number): string {
  if (weather === "clear") return hour >= 6 && hour < 20 ? "icon-clear-day" : "icon-clear-night";
  return `icon-${weather}`;
}

/** A small, steady hash of whole numbers: the same cell or block always draws the same way. */
function hash(a: number, b: number, c = 0): number {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/** A tint over the ground for each weather (a storm darkens it, a sandstorm browns it, fog greys it). */
const HAZE: Partial<Record<WeatherType, string>> = {
  overcast: "rgba(90, 100, 118, 0.14)",
  rain: "rgba(50, 66, 92, 0.12)",
  heavy_rain: "rgba(40, 54, 82, 0.2)",
  storm: "rgba(22, 26, 46, 0.32)",
  snow: "rgba(222, 230, 245, 0.1)",
  blizzard: "rgba(236, 241, 248, 0.34)",
  hail: "rgba(130, 140, 162, 0.16)",
  fog: "rgba(222, 228, 234, 0.3)",
  sandstorm: "rgba(190, 142, 72, 0.3)",
  heat_wave: "rgba(255, 214, 140, 0.07)",
};

/** The animated tile each weather falls as, and how long a frame shows (ms). */
const FALLING: Partial<Record<WeatherType, { tile: string; ms: number }>> = {
  rain: { tile: "rain", ms: 110 },
  heavy_rain: { tile: "heavy_rain", ms: 90 },
  storm: { tile: "heavy_rain", ms: 90 },
  snow: { tile: "snow", ms: 260 },
  blizzard: { tile: "blizzard", ms: 120 },
  hail: { tile: "hail", ms: 90 },
  sandstorm: { tile: "sandstorm", ms: 140 },
  heat_wave: { tile: "heat_wave", ms: 320 },
};

/** The clouds over a block of each weather: how many, light or dark, and how opaque. */
const CLOUDS: Partial<Record<WeatherType, { count: number; dark: boolean; alpha: number }>> = {
  // Light enough that a town or the party under one can still be told: the map must stay readable.
  cloudy: { count: 1, dark: false, alpha: 0.75 },
  overcast: { count: 2, dark: false, alpha: 0.6 },
  rain: { count: 1, dark: false, alpha: 0.6 },
  heavy_rain: { count: 1, dark: true, alpha: 0.55 },
  storm: { count: 2, dark: true, alpha: 0.6 },
  snow: { count: 1, dark: false, alpha: 0.6 },
  blizzard: { count: 1, dark: false, alpha: 0.5 },
  hail: { count: 1, dark: true, alpha: 0.55 },
  fog: { count: 2, dark: false, alpha: 0.4 },
};

export interface OverworldWeatherScene {
  /** The map's size in cells. */
  width: number;
  height: number;
  /** The weather block by block (worldWeatherBlocks). */
  blocks: { cols: number; rows: number; types: WeatherType[] };
  /** A weather held over each cell by the Game Master, if any (environmentHeldCells). */
  held: ReadonlyArray<WeatherType | null> | null;
  /** The party's cell and the weather there (the chat's own), drawn over the block it stands in. */
  party: { x: number; y: number; weather: WeatherType } | null;
}

/** The weather drawn at a cell: a hold, else the party's own block, else its block's, with ragged edges. */
export function overworldCellWeather(scene: OverworldWeatherScene, x: number, y: number): WeatherType {
  const held = scene.held?.[y * scene.width + x];
  if (held) return held;
  // A cell near a block's edge may take its neighbour's weather, so a weather's edge is ragged, not square.
  const jitter = hash(x, y);
  const jx = x + ((jitter & 3) - 1.5) * 0.6;
  const jy = y + (((jitter >>> 2) & 3) - 1.5) * 0.6;
  const col = Math.max(0, Math.min(scene.blocks.cols - 1, Math.floor(jx / WORLD_WEATHER_BLOCK)));
  const row = Math.max(0, Math.min(scene.blocks.rows - 1, Math.floor(jy / WORLD_WEATHER_BLOCK)));
  const party = scene.party;
  if (party && col === Math.floor(party.x / WORLD_WEATHER_BLOCK) && row === Math.floor(party.y / WORLD_WEATHER_BLOCK))
    return party.weather;
  return scene.blocks.types[row * scene.blocks.cols + col] ?? "clear";
}

/**
 * Draws the weather over the map, in world units (the canvas already set to them), for the cells in view.
 * `now` is real time in ms: the frames and the clouds' drift follow it; `still` draws one steady frame (the
 * player asked for less motion).
 */
export function drawOverworldWeather(
  ctx: CanvasRenderingContext2D,
  art: OverworldWeatherArt,
  scene: OverworldWeatherScene,
  view: { x0: number; y0: number; x1: number; y1: number },
  now: number,
  still: boolean,
) {
  const t = still ? 0 : now;
  const cx0 = Math.max(0, Math.floor(view.x0 / CELL) - 1);
  const cy0 = Math.max(0, Math.floor(view.y0 / CELL) - 1);
  const cx1 = Math.min(scene.width - 1, Math.ceil(view.x1 / CELL) + 1);
  const cy1 = Math.min(scene.height - 1, Math.ceil(view.y1 / CELL) + 1);
  if (cx1 < cx0 || cy1 < cy0) return;
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= scene.width || y >= scene.height ? null : overworldCellWeather(scene, x, y);
  const piece = (name: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number) => {
    const frame = art.frames[name];
    if (!frame) return;
    ctx.drawImage(
      art.image,
      frame[0] + sx,
      frame[1] + sy,
      sw,
      sh,
      dx,
      dy,
      (sw / ART_CELL) * CELL,
      (sh / ART_CELL) * CELL,
    );
  };
  const sprite = (name: string, dx: number, dy: number) => {
    const frame = art.frames[name];
    if (!frame) return;
    ctx.drawImage(
      art.image,
      frame[0],
      frame[1],
      frame[2],
      frame[3],
      dx,
      dy,
      (frame[2] / ART_CELL) * CELL,
      (frame[3] / ART_CELL) * CELL,
    );
  };

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  // ── The ground's tint, the falling weather, and the fog's edges, cell by cell ──
  for (let y = cy0; y <= cy1; y++)
    for (let x = cx0; x <= cx1; x++) {
      const weather = at(x, y)!;
      const haze = HAZE[weather];
      if (haze) {
        ctx.fillStyle = haze;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
      const falling = FALLING[weather];
      if (falling) {
        const frame = Math.floor(t / falling.ms) % 4;
        piece(
          `${falling.tile}-f${frame}`,
          (x % TILE_CELLS) * ART_CELL,
          (y % TILE_CELLS) * ART_CELL,
          ART_CELL,
          ART_CELL,
          x * CELL,
          y * CELL,
        );
      }
      if (weather !== "fog") {
        // A fog bank beside this cell feathers into it.
        const strip = (x % TILE_CELLS) * ART_CELL;
        const column = (y % TILE_CELLS) * ART_CELL;
        if (at(x, y + 1) === "fog") piece("fog-edge-n", strip, 0, ART_CELL, ART_CELL, x * CELL, y * CELL);
        if (at(x, y - 1) === "fog") piece("fog-edge-s", strip, 0, ART_CELL, ART_CELL, x * CELL, y * CELL);
        if (at(x - 1, y) === "fog") piece("fog-edge-e", 0, column, ART_CELL, ART_CELL, x * CELL, y * CELL);
        if (at(x + 1, y) === "fog") piece("fog-edge-w", 0, column, ART_CELL, ART_CELL, x * CELL, y * CELL);
      }
    }

  // ── Clouds, with their shadows, drifting east over each block; lightning and wind ──
  const span = WORLD_WEATHER_BLOCK * CELL;
  const bx0 = Math.floor(cx0 / WORLD_WEATHER_BLOCK) - 1;
  const by0 = Math.floor(cy0 / WORLD_WEATHER_BLOCK) - 1;
  const bx1 = Math.floor(cx1 / WORLD_WEATHER_BLOCK) + 1;
  const by1 = Math.floor(cy1 / WORLD_WEATHER_BLOCK) + 1;
  const blockWeather = (col: number, row: number) =>
    at(
      Math.min(scene.width - 1, Math.max(0, col * WORLD_WEATHER_BLOCK + 2)),
      Math.min(scene.height - 1, Math.max(0, row * WORLD_WEATHER_BLOCK + 2)),
    );
  const clouds: Array<{ name: string; x: number; y: number; alpha: number }> = [];
  for (let row = by0; row <= by1; row++)
    for (let col = bx0; col <= bx1; col++) {
      if (col < 0 || row < 0) continue;
      const weather = blockWeather(col, row);
      if (!weather) continue;
      const cloud = CLOUDS[weather];
      for (let n = 0; cloud && n < cloud.count; n++) {
        const seed = hash(col, row, n + 1);
        const kind = seed % 6;
        const frame = art.frames[`cloud-light-${kind}`];
        if (!frame) continue;
        const w = (frame[2] / ART_CELL) * CELL;
        // Drift east through the block and come round again, faded in and out so none pops.
        const speed = weather === "fog" ? 1.2 : 3 + (seed % 3);
        const phase = ((seed % 997) / 997 + t / 1000 / ((span + w) / speed)) % 1;
        const x = col * span - w / 2 + phase * (span + w / 2) - w / 4;
        const y = row * span + ((seed >>> 8) % span) - (frame[3] / ART_CELL) * CELL * 0.5;
        clouds.push({
          name: `${cloud.dark ? "cloud-dark" : "cloud-light"}-${kind}`,
          x,
          y,
          alpha: cloud.alpha * Math.sin(Math.PI * phase) ** 0.5,
        });
      }
    }
  for (const each of clouds) {
    ctx.globalAlpha = each.alpha * 0.28;
    sprite(each.name.replace(/cloud-(light|dark)/, "cloud-shadow"), each.x + 6, each.y + 8);
  }
  for (const each of clouds) {
    ctx.globalAlpha = each.alpha;
    sprite(each.name, each.x, each.y);
  }
  ctx.globalAlpha = 1;
  for (let row = by0; row <= by1; row++)
    for (let col = bx0; col <= bx1; col++) {
      if (col < 0 || row < 0) continue;
      const weather = blockWeather(col, row);
      const seed = hash(col, row, 77);
      if (weather === "storm" && !still) {
        // A strike every few seconds, somewhere in the block: the bolt, dimming, over a flash.
        const period = 5000 + (seed % 4000);
        const since = (t + (seed % period)) % period;
        if (since < 360) {
          const frame = Math.min(2, Math.floor(since / 120));
          const x = col * span + (seed % (span - CELL));
          const y = row * span + ((seed >>> 6) % CELL);
          if (frame === 0) {
            ctx.globalAlpha = 0.55;
            sprite("lightning-flash", x + CELL / 2 - 32, y + 2 * CELL - 32);
            ctx.globalAlpha = 1;
          }
          sprite(`lightning-${seed % 3}-f${frame}`, x, y);
        }
      }
      if (weather === "wind" || weather === "blizzard" || weather === "sandstorm") {
        const period = 3200 + (seed % 1600);
        const since = still ? 0 : (t + (seed % period)) % period;
        if (since < 1600) {
          const frame = Math.min(3, Math.floor(since / 400));
          sprite(`wind-${seed % 4}-f${frame}`, col * span + (seed % CELL), row * span + ((seed >>> 5) % (span - CELL)));
        }
      }
    }
  ctx.restore();
}

/** Whether any weather in view moves, so the overworld keeps drawing frames for it. */
export function overworldWeatherMoves(scene: OverworldWeatherScene): boolean {
  return (
    scene.blocks.types.some((type) => type !== "clear") ||
    Boolean(scene.held?.some((type) => type && type !== "clear")) ||
    Boolean(scene.party && scene.party.weather !== "clear")
  );
}
