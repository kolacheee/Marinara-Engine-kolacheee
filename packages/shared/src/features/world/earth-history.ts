// ──────────────────────────────────────────────
// The Earth seed in a year (historical eras): the cities that stood then, how many lived in each and what
// they were called, and the realms that held the land, from the baked past (scripts/earth/bake-earth-history.py:
// Chandler and Modelski's city populations as Reba, Reitsma and Seto digitised them, and Seshat's Cliopatria
// polities). Read where the data is (the server), when an Earth world's area is sampled.
// ──────────────────────────────────────────────
import type { WorldEarthFeatures } from "./earth-sample.js";

type City = WorldEarthFeatures["cities"][number];

export interface WorldEarthPolity {
  name: string;
  union?: true;
  from: number;
  to: number;
  /** The union it is a member of ("Holy Roman Empire"). */
  of?: string;
  area: number;
  /** Its mask's box on the polity grid: x, y, width, height. */
  box: [number, number, number, number];
  at: number;
  size: number;
}

export interface WorldEarthHistory {
  cities: Array<{
    name: string;
    alt?: string[];
    lon: number;
    lat: number;
    /** [year, people], by year. */
    pops: Array<[number, number]>;
    /** The Natural Earth city it is today, by its index among them. */
    today?: number;
    /** It is today's city by name, not only nearby (Carthage beside Tunis is not). */
    named?: true;
  }>;
  /** Today's name: [from, to, name] spans, years inclusive. */
  renames: Record<string, Array<[number, number, string]>>;
  polities: {
    step: number;
    width: number;
    height: number;
    polities: WorldEarthPolity[];
    masks: Uint8Array;
    /** Inflates one mask (a zlib stream): the reader's own, since the shared code has no zlib. */
    inflate: (bytes: Uint8Array) => Uint8Array;
  };
}

/** What a city was called in a year, by today's name; undefined when it was called the same. */
export function worldEarthNameIn(history: WorldEarthHistory, today: string, year: number) {
  return history.renames[today]?.find(([from, to]) => from <= year && year <= to)?.[2];
}

/** How far the world's towns had grown by a year, against today's: a city of the year is weighed against
 *  the cities of its own time when the kit's sizes are given (London's 45,000 in 1300 a great city). */
export function worldEarthEraScale(year: number | undefined) {
  if (year === undefined || year >= 2000) return 1;
  const points: Array<[number, number]> = [
    [-3000, 0.01],
    [0, 0.025],
    [1000, 0.025],
    [1500, 0.03],
    [1800, 0.05],
    [1900, 0.2],
    [1950, 0.45],
    [2000, 1],
  ];
  if (year <= points[0]![0]) return points[0]![1];
  for (let index = 1; index < points.length; index++) {
    const [y1, v1] = points[index]!;
    const [y0, v0] = points[index - 1]!;
    if (year <= y1) return Math.exp(Math.log(v0) + ((Math.log(v1) - Math.log(v0)) * (year - y0)) / (y1 - y0));
  }
  return 1;
}

const interpolate = (a: [number, number], b: [number, number], year: number) =>
  Math.exp(Math.log(a[1]) + ((Math.log(b[1]) - Math.log(a[1])) * (year - a[0])) / Math.max(1, b[0] - a[0]));

/** Between two counts: the curve between them, but where the records fall silent for centuries (Ao, Shang
 *  Zhengzhou, unrecorded from 1360 BC until 1975) the city was too small for them: it falls from its count
 *  to a small town and rises again to the next one. */
function peopleBetween(a: [number, number], b: [number, number], year: number) {
  const ramp = b[0] === 2015 ? Math.max(150, 2015 - 1850) : 150;
  if (b[0] - a[0] <= 300 || (year - a[0] <= 150 && b[0] - year <= ramp)) return Math.round(interpolate(a, b, year));
  const lull = Math.max(1000, Math.min(10000, Math.round(Math.min(a[1], b[1]) / 3)));
  if (year - a[0] <= 150) return Math.round(interpolate(a, [a[0] + 150, lull], year));
  if (b[0] - year <= ramp) return Math.round(interpolate([b[0] - ramp, lull], b, year));
  return lull;
}

/**
 * A dated city's people in a year: between two counts, the curve between them; just before its first
 * count, a smaller town; after its last, growing toward today's where it still stands, else as it was for a
 * while and then gone (Babylon, Angkor). Zero when it did not stand.
 */
export function worldEarthPeopleIn(pops: Array<[number, number]>, year: number, today?: number) {
  if (!pops.length) return 0;
  const first = pops[0]!;
  const last = pops[pops.length - 1]!;
  if (year < first[0]) return first[0] - year <= 150 ? Math.round(first[1] * 0.5) : 0;
  if (year > last[0]) {
    if (today && today > 0) return peopleBetween(last, [2015, today], year);
    return year - last[0] <= 150 ? last[1] : 0;
  }
  for (let index = 1; index < pops.length; index++)
    if (year <= pops[index]![0]) return peopleBetween(pops[index - 1]!, pops[index]!, year);
  return last[1];
}

/** Whether a town the records do not count (too small for them) likely stood in a year, by where it is:
 *  the old world's towns from the year 1000, the Americas' as they were settled, Australia's last. Before
 *  1000 only the towns the records count: today's names for the small places of antiquity would be wrong. */
export function worldEarthTownStood(lon: number, lat: number, year: number) {
  if (year >= 1900) return true;
  const americas = lon < -30;
  if (americas) return lat < 30 ? year >= 1600 : lon > -90 ? year >= 1700 : year >= 1870;
  if (lon > 110 && lat < -10) return year >= 1850;
  if (lat < 12 && lon > -20 && lon < 52) return year >= 1880;
  if (lat > 50 && lon > 60) return year >= 1700;
  return year >= 1000;
}

/** The people of a town the records do not count, from today's: a village or a small town in the past. */
function estimatedPeople(today: number, year: number) {
  const scale = worldEarthEraScale(year);
  if (year < 1800) return Math.max(300, Math.min(1500, Math.round(today * scale * 0.1)));
  return Math.max(1000, Math.min(year < 1900 ? 60000 : Infinity, Math.round(today * scale * 0.6)));
}

function polityAtCell(history: WorldEarthHistory, x: number, y: number, year: number, cache: Map<number, Uint8Array>) {
  const { polities, masks, inflate } = history.polities;
  let member: WorldEarthPolity | undefined;
  let union: WorldEarthPolity | undefined;
  polities.forEach((polity, index) => {
    if (polity.from > year || polity.to < year) return;
    const [x0, y0, w, h] = polity.box;
    if (x < x0 || y < y0 || x >= x0 + w || y >= y0 + h) return;
    let bits = cache.get(index);
    if (!bits) {
      bits = inflate(masks.subarray(polity.at, polity.at + polity.size));
      cache.set(index, bits);
    }
    const bit = (y - y0) * w + (x - x0);
    if (!((bits[bit >> 3]! >> (7 - (bit & 7))) & 1)) return;
    if (polity.union) {
      if (!union || polity.area < union.area) union = polity;
    } else if (!member || polity.area < member.area) member = polity;
  });
  if (!member && !union) return null;
  const top = union?.name ?? member?.of ?? member!.name;
  return { union: top, member: member?.name ?? top };
}

/** The realm that held a point in a year, and the union it was part of ({union, member}); null where none
 *  is recorded. The smallest realm there is the member; its union the one holding it, if any. A point on a
 *  coast the borders' grid misses takes the realm of the land beside it. */
export function worldEarthPolityAt(
  history: WorldEarthHistory,
  lon: number,
  lat: number,
  year: number,
  cache = new Map<number, Uint8Array>(),
) {
  const { step, width, height } = history.polities;
  const x = Math.floor(((((lon + 180) % 360) + 360) % 360) / step) % width;
  const y = Math.floor((90 - lat) / step);
  for (const [dx, dy] of [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ] as const) {
    const ny = y + dy;
    if (ny < 0 || ny >= height) continue;
    const held = polityAtCell(history, (x + dx + width) % width, ny, year, cache);
    if (held) return held;
  }
  return null;
}

/** Where no realm is recorded: today's country as the name of the land, but for the states made late (the new
 *  world's, Britain's union, the partition's), which name the land as it was known before. */
function landOf(country: string | undefined, year: number) {
  const late: Record<string, [number, string]> = {
    "United States of America": [1776, "North America"],
    Canada: [1867, "North America"],
    Mexico: [1821, "New Spain"],
    Brazil: [1822, "South America"],
    Argentina: [1816, "South America"],
    Chile: [1818, "South America"],
    Australia: [1901, "Australia"],
    "United Kingdom": [1707, "Britain"],
    Pakistan: [1947, "India"],
    Bangladesh: [1971, "Bengal"],
    "Saudi Arabia": [1932, "Arabia"],
  };
  if (!country) return "Unclaimed lands";
  const rule = late[country];
  return rule && year < rule[0] ? rule[1] : country;
}

/**
 * The cities of an area in a year, in the shape of today's (WorldEarthFeatures cities): the dated ones the
 * records count, in their names of the year, and the smaller towns that likely stood, estimated from
 * today's; each in the realm that held it then (its union as the country, the realm itself as the state,
 * else today's state as the province). The biggest city of each realm in the area is its seat. One city a
 * name: a second of the same name (another Allentown) is left out.
 */
export function worldEarthCitiesIn(
  history: WorldEarthHistory,
  today: City[],
  year: number,
  inside: (lon: number, lat: number) => boolean,
): City[] {
  const counted = new Set<number>();
  const out: City[] = [];
  const cache = new Map<number, Uint8Array>();
  const realm = (lon: number, lat: number, now: City | undefined) => {
    const held = worldEarthPolityAt(history, lon, lat, year, cache);
    const state = held && held.member !== held.union ? held.member : now?.state;
    return {
      country: held ? held.union : landOf(now?.country, year),
      ...(state ? { state } : {}),
    };
  };
  const nearestToday = (lon: number, lat: number) =>
    today.reduce<City | undefined>(
      (best, city) =>
        !best || Math.hypot(city.lon - lon, city.lat - lat) < Math.hypot(best.lon - lon, best.lat - lat) ? city : best,
      undefined,
    );
  for (const city of history.cities) {
    // A city under today's name stands for today's town in every year; one only beside it (Yin by Anyang)
    // stands for it only while it stood, and does not grow into it.
    const now = city.today !== undefined ? today[city.today] : undefined;
    const pop = worldEarthPeopleIn(city.pops, year, city.named ? now?.pop : undefined);
    if (city.today !== undefined && (city.named || pop > 0)) counted.add(city.today);
    if (!inside(city.lon, city.lat)) continue;
    if (pop <= 0) continue;
    // Today's name only for the same city under it; a city beside a later one keeps its own (Carthage).
    const base = now && city.named ? now.name : city.name;
    out.push({
      name: worldEarthNameIn(history, base, year) ?? base,
      lon: city.lon,
      lat: city.lat,
      pop,
      rank: now?.rank ?? 5,
      ...realm(city.lon, city.lat, now ?? nearestToday(city.lon, city.lat)),
    });
  }
  today.forEach((city, index) => {
    if (counted.has(index) || !inside(city.lon, city.lat) || !worldEarthTownStood(city.lon, city.lat, year)) return;
    out.push({
      name: worldEarthNameIn(history, city.name, year) ?? city.name,
      lon: city.lon,
      lat: city.lat,
      pop: estimatedPeople(city.pop, year),
      rank: city.rank + 2,
      ...realm(city.lon, city.lat, city),
    });
  });
  out.sort((a, b) => b.pop - a.pop);
  const names = new Set<string>();
  const seats = new Set<string>();
  return out
    .filter((city) => {
      if (names.has(city.name)) return false;
      names.add(city.name);
      return true;
    })
    .map((city) => {
      if (seats.has(city.country) || city.country === "Unclaimed lands" || city.pop < 20000) return city;
      seats.add(city.country);
      return { ...city, capital: true };
    });
}

/** A historical name of a place (Constantinople, Edo, Tenochtitlan) and where it is. */
export function worldEarthHistoricalPlace(
  history: WorldEarthHistory,
  today: City[],
  name: string,
  fold: (text: string) => string,
) {
  const key = fold(name);
  for (const [now, spans] of Object.entries(history.renames))
    if (spans.some(([, , old]) => fold(old) === key)) {
      const city = today.find((each) => each.name === now);
      if (city) return { lon: city.lon, lat: city.lat };
    }
  const dated = history.cities.find((city) => fold(city.name) === key || city.alt?.some((alt) => fold(alt) === key));
  return dated ? { lon: dated.lon, lat: dated.lat } : null;
}
