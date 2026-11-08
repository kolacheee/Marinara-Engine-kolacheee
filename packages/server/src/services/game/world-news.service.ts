// ──────────────────────────────────────────────
// The world_news tool (the Earth seed's news, shared features/world/earth-news.ts): the names of the real
// events up to the story's day, for a Game Master whose game is on the real Earth. Pulled when a character follows
// the news, never pushed into the story.
// ──────────────────────────────────────────────
import {
  gameWorldMapHere,
  worldEarthNews,
  type WorldEarthNewsData,
  type WorldEarthNewsResult,
} from "@marinara-engine/shared";
import { loadWorldEarthNews } from "./earth-data.js";

/** Whether the map the party is on is the real Earth (the Earth seed): its brief has an Earth sample. */
export function worldEarthOfGame(metadata: Record<string, unknown> | null | undefined): boolean {
  const stored = metadata?.gameWorld as
    { brief?: { earth?: unknown }; maps?: Array<{ id?: unknown; brief?: { earth?: unknown } }> } | null | undefined;
  const here = gameWorldMapHere(metadata);
  const brief = here ? stored?.maps?.find((map) => map.id === here)?.brief : stored?.brief;
  return !!brief?.earth && typeof brief.earth === "object";
}

/** Whether the world_news tool fits this game: a game on the real Earth. */
export function gameHasEarthNews(metadata: Record<string, unknown> | null | undefined): boolean {
  return !!worldEarthOfGame(metadata);
}

/** A date as the Game Master wrote it: YYYY-MM-DD (negative years before 1 AD), YYYY-MM, YYYY, or words. */
export function readNewsDate(text: unknown): { year: number; month?: number; day?: number } | null {
  if (typeof text !== "string" || !text.trim()) return null;
  const numeric = /^\s*(-?\d{1,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?\s*$/.exec(text);
  if (numeric) {
    const year = Number(numeric[1]);
    const month = numeric[2] ? Number(numeric[2]) : undefined;
    const day = numeric[3] ? Number(numeric[3]) : undefined;
    return { year: year < 0 ? year + 1 : year, ...(month ? { month } : {}), ...(day ? { day } : {}) };
  }
  const parsed = Date.parse(text);
  if (Number.isNaN(parsed)) return null;
  const date = new Date(parsed);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

/** The tool's answer, from the news and the game's metadata. */
export function worldNewsAnswer(
  data: WorldEarthNewsData,
  metadata: Record<string, unknown> | null | undefined,
  args: Record<string, unknown>,
): WorldEarthNewsResult | { error: string } {
  if (!worldEarthOfGame(metadata)) return { error: "This game is not set on the real Earth, so it has no real news." };
  const date = readNewsDate(args.date);
  if (!date) return { error: "Give today's date in the story as YYYY-MM-DD." };
  return worldEarthNews(data, {
    ...date,
    ...(typeof args.days === "number" ? { days: args.days } : {}),
    ...(typeof args.about === "string" ? { about: args.about } : {}),
  });
}

export async function worldNewsTool(
  args: Record<string, unknown>,
  metadata: Record<string, unknown> | undefined,
): Promise<unknown> {
  if (!gameHasEarthNews(metadata)) return { error: "This game is not set on the real Earth, so it has no real news." };
  return worldNewsAnswer(await loadWorldEarthNews(), metadata, args);
}
