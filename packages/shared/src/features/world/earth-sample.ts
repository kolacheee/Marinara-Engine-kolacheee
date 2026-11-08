// ──────────────────────────────────────────────
// The Earth seed's sampling (earth.ts): an area of the baked Earth grid (scripts/earth/bake-earth.py) read
// at the size a scale's map is, with its real rivers and cities, into the WorldEarth a brief keeps; and
// where on Earth a setting is, from the real places its brief and lore name, or a named area. Run where
// the grid is (the server); the compile never needs it.
// ──────────────────────────────────────────────
import { worldBriefSchema, type WorldBrief, type WorldEarth } from "../../schemas/world-brief.schema.js";
import type { WorldKit } from "../../schemas/world-kit.schema.js";
import { WORLD_DAYS_PER_CELL, WORLD_GROUND_SIZE } from "./compile.js";
import { WORLD_EARTH_KM_PER_DAY, worldEarthCellDegrees, worldEarthEncode } from "./earth.js";
import { worldEarthCitiesIn, worldEarthHistoricalPlace, type WorldEarthHistory } from "./earth-history.js";

/** The baked grid: 3600 x 1800 cells of 0.1 degrees, row 0 at 90N, column 0 at 180W, three byte planes
 *  (surface, height in metres / 32, dryness). */
export interface WorldEarthGrid {
  width: number;
  height: number;
  planes: Uint8Array;
}

export interface WorldEarthFeatures {
  rivers: Array<{ name: string; rank: number; line: Array<[number, number]> }>;
  cities: Array<{
    name: string;
    country: string;
    state?: string;
    lon: number;
    lat: number;
    pop: number;
    rank: number;
    capital?: boolean;
  }>;
  regions: Array<{ name: string; kind: string; rank: number; box: [number, number, number, number] }>;
}

/** The coast and lakes five times finer than the grid (0.02 degrees): two bit planes, land then lake,
 *  each row by row from 90N and 180W, most significant bit first. */
export interface WorldEarthCoast {
  width: number;
  height: number;
  bits: Uint8Array;
}

export interface WorldEarthData {
  grid: WorldEarthGrid;
  features: WorldEarthFeatures;
  coast?: WorldEarthCoast;
  /** The past (historical eras): dated cities and the realms that held the land. */
  history?: WorldEarthHistory;
}

/** Named areas, for a setting on Earth that names no real place the grid knows. */
export const WORLD_EARTH_AREAS: ReadonlyArray<{ id: string; label: string; lon: number; lat: number }> = Object.freeze([
  { id: "british_isles", label: "British Isles", lon: -3.5, lat: 54 },
  { id: "france", label: "France", lon: 2.5, lat: 46.5 },
  { id: "germany", label: "Germany and the Low Countries", lon: 8.5, lat: 51.5 },
  { id: "iberia", label: "Iberia", lon: -4, lat: 40 },
  { id: "italy", label: "Italy", lon: 12.5, lat: 42.5 },
  { id: "greece", label: "Greece and the Aegean", lon: 23.5, lat: 38.5 },
  { id: "scandinavia", label: "Scandinavia", lon: 13, lat: 61 },
  { id: "central_europe", label: "Central Europe", lon: 17, lat: 48.5 },
  { id: "russia", label: "Western Russia", lon: 37.5, lat: 55.5 },
  { id: "mediterranean", label: "The Mediterranean", lon: 16, lat: 38 },
  { id: "levant", label: "The Levant", lon: 35.5, lat: 32.5 },
  { id: "egypt", label: "Egypt and the Nile", lon: 31, lat: 28 },
  { id: "mesopotamia", label: "Mesopotamia", lon: 44, lat: 33 },
  { id: "persia", label: "Persia", lon: 53, lat: 32.5 },
  { id: "north_india", label: "Northern India", lon: 78, lat: 26.5 },
  { id: "south_india", label: "Southern India", lon: 78, lat: 13 },
  { id: "north_china", label: "Northern China", lon: 114, lat: 36 },
  { id: "south_china", label: "Southern China", lon: 113, lat: 25 },
  { id: "korea", label: "Korea", lon: 127.5, lat: 37 },
  { id: "japan", label: "Japan", lon: 137.5, lat: 36 },
  { id: "southeast_asia", label: "Southeast Asia", lon: 103, lat: 14 },
  { id: "us_northeast", label: "US Northeast", lon: -74, lat: 41 },
  { id: "us_south", label: "US South", lon: -88, lat: 33 },
  { id: "great_lakes", label: "Great Lakes", lon: -84, lat: 43 },
  { id: "texas", label: "Texas", lon: -98, lat: 31 },
  { id: "california", label: "California", lon: -120, lat: 36.5 },
  { id: "pacific_northwest", label: "Pacific Northwest", lon: -122, lat: 46.5 },
  { id: "mexico", label: "Central Mexico", lon: -100, lat: 20 },
  { id: "caribbean", label: "The Caribbean", lon: -73, lat: 19 },
  { id: "andes", label: "The Andes", lon: -75, lat: -12 },
  { id: "brazil", label: "Southeast Brazil", lon: -45, lat: -22.5 },
  { id: "river_plate", label: "The River Plate", lon: -59, lat: -34 },
  { id: "west_africa", label: "West Africa", lon: -2, lat: 8 },
  { id: "east_africa", label: "East Africa", lon: 37, lat: -2 },
  { id: "southern_africa", label: "Southern Africa", lon: 27, lat: -27 },
  { id: "australia_southeast", label: "Southeast Australia", lon: 149, lat: -34.5 },
  { id: "new_zealand", label: "New Zealand", lon: 174, lat: -41 },
]);

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .trim();

/** Small deterministic noise over the Earth (by longitude and latitude), for a coast drawn finer than the
 *  grid: the same place has the same coast whichever map it falls on. */
function earthNoise(lon: number, lat: number, frequency: number) {
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const [fx, fy] = [lon * frequency, lat * frequency];
  const [x0, y0] = [Math.floor(fx), Math.floor(fy)];
  const [tx, ty] = [fx - x0, fy - y0];
  const [sx, sy] = [tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)];
  const top = hash(x0, y0) * (1 - sx) + hash(x0 + 1, y0) * sx;
  const bottom = hash(x0, y0 + 1) * (1 - sx) + hash(x0 + 1, y0 + 1) * sx;
  return top * (1 - sy) + bottom * sy;
}

const promptSafe = (text: string) => !/[\r\n\u0000-\u001F\u007F[\]]|\{\{|\}\}/.test(text) && text.trim().length > 0;

/**
 * The real Earth over an area at a scale: each map cell the majority of the grid within it (the land or the
 * water, then which), its average height and dryness; a map finer than the grid (a town or a region) reads
 * the grid through a little noise, so its coast is a coast and not the grid's steps. Then the rivers the
 * map is big enough to show and the cities in the area, biggest first.
 */
export function sampleWorldEarth(
  data: WorldEarthData,
  options: { lon: number; lat: number; scale: WorldKit["scale"]; area?: string; year?: number },
): WorldEarth {
  const [width, height] = WORLD_GROUND_SIZE[options.scale];
  const kmPerCell = WORLD_DAYS_PER_CELL[options.scale] * WORLD_EARTH_KM_PER_DAY;
  const lat = Math.max(-78, Math.min(78, options.lat));
  const lon = ((((options.lon + 180) % 360) + 360) % 360) - 180;
  const degrees = worldEarthCellDegrees(kmPerCell, lat);
  const grid = data.grid;
  const gridCells = grid.width * grid.height;
  const gridStep = 360 / grid.width;
  const fine = degrees.lon < gridStep * 1.5;
  const coast = data.coast;
  const at = (x: number, y: number) => {
    const gx = ((Math.floor(x) % grid.width) + grid.width) % grid.width;
    const gy = Math.max(0, Math.min(grid.height - 1, Math.floor(y)));
    return gy * grid.width + gx;
  };
  const toGrid = (pointLon: number, pointLat: number) => ({
    x: (pointLon + 180) / gridStep,
    y: (90 - pointLat) / gridStep,
  });
  // Heights and dryness read between the grid's cells, so a fine map is smooth.
  const smooth = (plane: number, pointLon: number, pointLat: number) => {
    const { x, y } = toGrid(pointLon, pointLat);
    const [x0, y0] = [Math.floor(x - 0.5), Math.floor(y - 0.5)];
    const [tx, ty] = [x - 0.5 - x0, y - 0.5 - y0];
    const v = (xx: number, yy: number) => grid.planes[plane * gridCells + at(xx, yy)]!;
    return (
      (v(x0, y0) * (1 - tx) + v(x0 + 1, y0) * tx) * (1 - ty) + (v(x0, y0 + 1) * (1 - tx) + v(x0 + 1, y0 + 1) * tx) * ty
    );
  };

  const count = width * height;
  const out = new Uint8Array(count * 3);
  const samples = Math.max(3, Math.min(6, Math.ceil(degrees.lon / gridStep)));
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const cell = y * width + x;
      const votes = [0, 0, 0, 0];
      let metres = 0;
      let dry = 0;
      let landSamples = 0;
      for (let sy = 0; sy < samples; sy++)
        for (let sx = 0; sx < samples; sx++) {
          let pointLon = lon + (x + (sx + 0.5) / samples - width / 2) * degrees.lon;
          let pointLat = lat + (height / 2 - y - (sy + 0.5) / samples) * degrees.lat;
          if (fine) {
            // Warp the point by up to about half a cell of the data it reads, at two frequencies.
            const warp = (coast ? 360 / coast.width : gridStep) * 1.2;
            pointLon +=
              (earthNoise(pointLon, pointLat, 9) - 0.5) * warp +
              (earthNoise(pointLon, pointLat, 31) - 0.5) * warp * 0.5;
            pointLat +=
              (earthNoise(pointLon + 71.3, pointLat, 9) - 0.5) * warp +
              (earthNoise(pointLon + 71.3, pointLat, 31) - 0.5) * warp * 0.5;
          }
          const { x: gx, y: gy } = toGrid(pointLon, pointLat);
          const coarse = grid.planes[at(gx, gy)]!;
          let surface = coarse;
          if (fine && coast) {
            // The fine coast read between its cells, and cut where the noise says: a diagonal shore is a
            // diagonal, not the steps of the data.
            const fx = ((pointLon + 180) / 360) * coast.width - 0.5;
            const fy = ((90 - pointLat) / 180) * coast.height - 0.5;
            const [x0, y0] = [Math.floor(fx), Math.floor(fy)];
            const [tx, ty] = [fx - x0, fy - y0];
            const plane = (coast.width * coast.height) / 8;
            const bitAt = (offset: number, xx: number, yy: number) => {
              const cx = ((xx % coast.width) + coast.width) % coast.width;
              const cy = Math.max(0, Math.min(coast.height - 1, yy));
              const bit = cy * coast.width + cx;
              return (coast.bits[offset + (bit >> 3)]! >> (7 - (bit & 7))) & 1;
            };
            const share = (offset: number) =>
              (bitAt(offset, x0, y0) * (1 - tx) + bitAt(offset, x0 + 1, y0) * tx) * (1 - ty) +
              (bitAt(offset, x0, y0 + 1) * (1 - tx) + bitAt(offset, x0 + 1, y0 + 1) * tx) * ty;
            const cut = 0.5 + (earthNoise(pointLon, pointLat, 140) - 0.5) * 0.6;
            surface = share(0) < cut ? 0 : share(plane) >= cut ? 1 : coarse === 3 ? 3 : 2;
          }
          votes[surface]!++;
          if (surface >= 2) {
            metres += fine ? smooth(1, pointLon, pointLat) : grid.planes[gridCells + at(gx, gy)]!;
            dry += fine ? smooth(2, pointLon, pointLat) : grid.planes[gridCells * 2 + at(gx, gy)]!;
            landSamples++;
          }
        }
      const wet = votes[0]! + votes[1]!;
      const surface = wet * 2 > samples * samples ? (votes[1]! > votes[0]! ? 1 : 0) : votes[3]! > votes[2]! ? 3 : 2;
      out[cell] = surface;
      out[count + cell] = surface >= 2 ? Math.round(metres / Math.max(1, landSamples)) : 0;
      out[count * 2 + cell] = surface >= 2 ? Math.round(dry / Math.max(1, landSamples)) : 0;
    }

  // Map coordinates of a point, or null outside the map.
  const cellOf = (pointLon: number, pointLat: number) => {
    let dx = pointLon - lon;
    if (dx > 180) dx -= 360;
    if (dx < -180) dx += 360;
    const fx = dx / degrees.lon + width / 2;
    const fy = height / 2 - (pointLat - lat) / degrees.lat;
    return { fx, fy, inside: fx >= 0 && fy >= 0 && fx < width && fy < height };
  };
  const water = (cell: number) => out[cell]! <= 1;

  // Rivers the map is big enough to show (the scale's smallest), each cell it runs through in order.
  const smallest = { site: 99, town: 99, region: 99, realm: 8, world: 6, sector: -1 }[options.scale];
  const rivers: WorldEarth["rivers"] = [];
  for (const river of data.features.rivers) {
    if (river.rank > smallest) continue;
    const width5 = Math.max(1, Math.min(5, 5 - Math.floor(river.rank / 2)));
    let path: number[] = [];
    const flush = () => {
      if (path.length >= 2)
        rivers.push({ ...(promptSafe(river.name) ? { name: river.name.slice(0, 80) } : {}), path, width: width5 });
      path = [];
    };
    for (let index = 0; index < river.line.length; index++) {
      const [pointLon, pointLat] = river.line[index]!;
      const here = cellOf(pointLon, pointLat);
      const previous = index > 0 ? cellOf(...river.line[index - 1]!) : here;
      const steps = Math.max(
        1,
        Math.ceil(Math.max(Math.abs(here.fx - previous.fx), Math.abs(here.fy - previous.fy)) * 2),
      );
      for (let step = index > 0 ? 1 : 0; step <= steps; step++) {
        const fx = previous.fx + ((here.fx - previous.fx) * step) / steps;
        const fy = previous.fy + ((here.fy - previous.fy) * step) / steps;
        if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
          flush();
          continue;
        }
        const cell = Math.floor(fy) * width + Math.floor(fx);
        if (path[path.length - 1] === cell) continue;
        // Steps through a corner go round it, so the river is one unbroken line of cells.
        const last = path[path.length - 1];
        if (
          last !== undefined &&
          last % width !== cell % width &&
          Math.floor(last / width) !== Math.floor(cell / width)
        )
          path.push(Math.floor(last / width) * width + (cell % width));
        path.push(cell);
      }
    }
    flush();
  }
  // Each from its source to its mouth: toward the water, else downhill.
  for (const river of rivers) {
    const end = (cell: number) => {
      const [x, y] = [cell % width, Math.floor(cell / width)];
      let near = water(cell) ? 2 : 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && water(ny * width + nx)) near = Math.max(near, 1);
      }
      return near;
    };
    const [first, last] = [river.path[0]!, river.path[river.path.length - 1]!];
    const flip = end(first) > end(last) || (end(first) === end(last) && out[count + first]! < out[count + last]!);
    if (flip) river.path.reverse();
    const tail = river.path[river.path.length - 1]!;
    if (!water(tail)) {
      const [x, y] = [tail % width, Math.floor(tail / width)];
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && water(ny * width + nx)) {
          river.path.push(ny * width + nx);
          break;
        }
      }
    }
    if (river.path.length > 800) river.path.length = 800;
  }
  rivers.sort((a, b) => b.width - a.width || b.path.length - a.path.length);

  // In a year before today's, the cities of that year, in their names then and the realms that held them.
  const past = options.year !== undefined && options.year < 2000 && data.history ? options.year : undefined;
  const source =
    past !== undefined
      ? worldEarthCitiesIn(
          data.history!,
          data.features.cities,
          past,
          (pointLon, pointLat) => cellOf(pointLon, pointLat).inside,
        )
      : data.features.cities;
  const cities: WorldEarth["cities"] = [];
  for (const city of [...source].sort((a, b) => b.pop - a.pop || a.rank - b.rank)) {
    const where = cellOf(city.lon, city.lat);
    if (!where.inside || !promptSafe(city.name) || city.name.length > 60 || !promptSafe(city.country)) continue;
    cities.push({
      name: city.name,
      country: city.country.slice(0, 80),
      ...(city.state && promptSafe(city.state) ? { state: city.state.slice(0, 80) } : {}),
      cell: Math.floor(where.fy) * width + Math.floor(where.fx),
      pop: Math.max(0, Math.round(city.pop)),
      ...(city.capital ? { capital: true as const } : {}),
    });
    if (cities.length >= 400) break;
  }

  return {
    lon: Math.round(lon * 1000) / 1000,
    lat: Math.round(lat * 1000) / 1000,
    scale: options.scale,
    ...(options.area ? { area: options.area.slice(0, 120) } : {}),
    ...(options.year !== undefined ? { year: options.year } : {}),
    ground: worldEarthEncode(out),
    rivers: rivers.slice(0, 400),
    cities,
  };
}

/** The middle of an area at a scale: on a map of a town or a site, the biggest city near the point (a
 *  named area's middle may be in the hills, and a town's map should hold its town). */
export function worldEarthCentre(data: WorldEarthData, scale: WorldKit["scale"], lon: number, lat: number) {
  if (scale !== "town" && scale !== "site") return { lon, lat };
  const km = (city: { lon: number; lat: number }) =>
    Math.hypot((city.lon - lon) * 111.32 * Math.cos((lat * Math.PI) / 180), (city.lat - lat) * 110.57);
  const best = data.features.cities
    .filter((city) => km(city) < 400)
    .sort((a, b) => b.pop / (1 + km(b) / 50) - a.pop / (1 + km(a) / 50))[0];
  return best ? { lon: best.lon, lat: best.lat } : { lon, lat };
}

/**
 * Where on Earth a setting is: the real places it names. Each name is looked up among the cities (the
 * biggest of that name), the countries and the named lands (ranges, deserts, plains); the place the party
 * starts in, else the first found, is the middle, moved toward the others that fit on the map with it.
 * Null when it names nowhere real, for a named area to stand in.
 */
export function worldEarthLocate(
  data: WorldEarthData,
  scale: WorldKit["scale"],
  names: Array<{ name: string; start?: boolean }>,
): { lon: number; lat: number; area: string } | null {
  const cities = new Map<string, WorldEarthFeatures["cities"][number]>();
  const countries = new Map<string, WorldEarthFeatures["cities"][number]>();
  for (const city of [...data.features.cities].sort((a, b) => b.pop - a.pop)) {
    if (!cities.has(fold(city.name))) cities.set(fold(city.name), city);
    const country = fold(city.country);
    const known = countries.get(country);
    if (!known || (city.capital && !known.capital)) countries.set(country, city);
  }
  const lands = new Map(
    data.features.regions
      .filter((region) => !/island|continent|ocean|sea/i.test(region.kind))
      .map((region) => [fold(region.name), region] as const),
  );
  const areas = new Map(WORLD_EARTH_AREAS.map((area) => [fold(area.label), area] as const));
  const found: Array<{ name: string; lon: number; lat: number; start: boolean }> = [];
  for (const { name, start } of names) {
    const key = fold(name);
    const city = cities.get(key);
    const country = countries.get(key);
    const land = lands.get(key);
    const area = areas.get(key);
    const old =
      !city && !country && !land && !area && data.history
        ? worldEarthHistoricalPlace(data.history, data.features.cities, name, fold)
        : null;
    const point = old
      ? old
      : city
        ? { lon: city.lon, lat: city.lat }
        : country
          ? { lon: country.lon, lat: country.lat }
          : land
            ? { lon: (land.box[0] + land.box[2]) / 2, lat: (land.box[1] + land.box[3]) / 2 }
            : area
              ? { lon: area.lon, lat: area.lat }
              : null;
    if (point) found.push({ name, ...point, start: !!start });
  }
  if (!found.length) return null;
  const middle = found.find((each) => each.start) ?? found[0]!;
  const [width, height] = WORLD_GROUND_SIZE[scale];
  const degrees = worldEarthCellDegrees(WORLD_DAYS_PER_CELL[scale] * WORLD_EARTH_KM_PER_DAY, middle.lat);
  const fits = found.filter(
    (each) =>
      Math.abs(each.lon - middle.lon) < (width / 2 - 2) * degrees.lon &&
      Math.abs(each.lat - middle.lat) < (height / 2 - 2) * degrees.lat,
  );
  // Halfway toward the others' middle, so the start stays well inside the map.
  const lon = middle.lon + (fits.reduce((sum, each) => sum + each.lon, 0) / fits.length - middle.lon) / 2;
  const lat = middle.lat + (fits.reduce((sum, each) => sum + each.lat, 0) / fits.length - middle.lat) / 2;
  return {
    lon,
    lat,
    area: fits
      .map((each) => each.name)
      .join(", ")
      .slice(0, 120),
  };
}

/** The real places a brief names, the starting place marked, for worldEarthLocate. */
export function worldEarthNames(brief: Pick<WorldBrief, "places"> | null | undefined, extra: string[] = []) {
  return [
    ...(brief?.places ?? []).map((place) => ({ name: place.name, start: !!place.start })),
    ...extra.map((name) => ({ name })),
  ];
}

/** A brief made an Earth world over an area, checked against the brief's own schema. */
export function withWorldEarth(brief: WorldBrief, earth: WorldEarth | null): WorldBrief {
  const { earth: _old, ...rest } = brief;
  void _old;
  if (!earth) return rest as WorldBrief;
  return worldBriefSchema.parse({ ...rest, earth });
}
