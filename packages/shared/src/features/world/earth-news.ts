// ──────────────────────────────────────────────
// The Earth seed's news (owner 2026-11-08: "if the user has explored New York City before but they are
// currently in Tokyo on Sept 11 2001 they still would hear the news"; then: "it's important the GM isn't
// getting bombarded with events ... If the GM would search for current events for whatever reason then it can
// pull from the feed"; and: "I don't think we need to add any data beyond the name of major real world events,
// Game Mode kind of requires a SOTA model and those are knowledgeable enough"). The names of each day's real
// events, from English Wikipedia's year articles, baked by scripts/earth/bake-earth-news.py. Nothing puts them
// in the story by itself: the Game Master looks them up (the world_news tool) when a character follows the
// news, and never sees a day after the story's own.
// ──────────────────────────────────────────────

/** One event: month and day (0 when the article gives none) and its name. */
export type WorldEarthNewsRow = [number, number, string];

/** Each year's events, by date. */
export type WorldEarthNewsData = Record<string, WorldEarthNewsRow[]>;

export interface WorldEarthNewsItem {
  /** "11 September 2001", "March 44 BC", "1066". */
  date: string;
  name: string;
}

export interface WorldEarthNewsResult {
  today: string;
  items: WorldEarthNewsItem[];
  /** How many more matched than are listed. */
  more: number;
  note?: string;
}

export interface WorldEarthNewsQuery {
  year: number;
  /** 1-12; the end of the year when left out. */
  month?: number;
  day?: number;
  /** How far back to look: 7 days, or a year when `about` is given. */
  days?: number;
  /** Words an event's name must have, all of them. */
  about?: string;
  /** The most events to list. */
  limit?: number;
}

export const WORLD_EARTH_NEWS_MAX_DAYS = 3660;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const fold = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** A day as a number, the same scale for every era (no calendar reform minded): for "days back". */
const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const dayNumber = (year: number, month: number, day: number) =>
  Math.floor(year * 365.25) + MONTH_STARTS[Math.min(12, Math.max(1, month)) - 1]! + Math.min(31, day) - 1;

const yearWords = (year: number) => (year <= 0 ? `${1 - year} BC` : String(year));
export function worldEarthNewsDate(year: number, month = 0, day = 0): string {
  if (!month) return yearWords(year);
  if (!day) return `${MONTH_NAMES[month - 1]} ${yearWords(year)}`;
  return `${day} ${MONTH_NAMES[month - 1]} ${yearWords(year)}`;
}

/**
 * The events up to a day of the story, newest first.
 * Never an entry after that day; an entry with no day counts once its month is over, one with no month once
 * its year is.
 */
export function worldEarthNews(data: WorldEarthNewsData, query: WorldEarthNewsQuery): WorldEarthNewsResult {
  const month = query.month && query.month >= 1 && query.month <= 12 ? Math.floor(query.month) : undefined;
  const day = month && query.day && query.day >= 1 && query.day <= 31 ? Math.floor(query.day) : undefined;
  const year = Math.floor(query.year);
  const words = fold(query.about ?? "")
    .split(" ")
    .filter((word) => word.length > 1);
  const span = Math.max(1, Math.min(WORLD_EARTH_NEWS_MAX_DAYS, Math.floor(query.days ?? (words.length ? 366 : 7))));
  const today = dayNumber(year, month ?? 12, day ?? 31);
  const from = today - span + 1;
  const limit = Math.max(1, Math.min(40, Math.floor(query.limit ?? 15)));

  const found: Array<{ at: number; item: WorldEarthNewsItem }> = [];
  const firstYear = Math.floor((from - 31) / 365.25);
  for (let each = year; each >= firstYear; each--) {
    const rows = data[String(each)];
    if (!rows) continue;
    for (const [rowMonth, rowDay, name] of rows) {
      // When it is known: its day, else the end of its month, else the end of its year.
      const at = dayNumber(each, rowMonth || 12, rowDay || 31);
      if (at > today || at < from) continue;
      if (words.length && !words.every((word) => fold(name).includes(word))) continue;
      found.push({ at, item: { date: worldEarthNewsDate(each, rowMonth, rowDay), name } });
    }
  }
  found.sort((a, b) => b.at - a.at);
  const items = found.slice(0, limit).map((each) => each.item);
  const note =
    year < 1850
      ? "Before the telegraph, news travels as fast as a rider or a ship: far places' news reaches a town weeks or months late, if at all, and as rumour."
      : year < 1920
        ? "News of far places comes by telegraph and the papers, a day or more late."
        : undefined;
  return {
    today: worldEarthNewsDate(year, month ?? 0, day ?? 0),
    items,
    more: Math.max(0, found.length - items.length),
    ...(note ? { note } : {}),
  };
}
