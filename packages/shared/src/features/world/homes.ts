// ──────────────────────────────────────────────
// Homes the players own (fork): a house in a settlement that belongs to one or more of the players'
// characters, bought, rented, given, inherited, or theirs from the start. The Game Master records it in
// the world's ledger ([world: owned=...]); the Engine writes the same tag for a buy at a house's door, so
// the ledger stays the one record. A home is told to the Game Master wherever the party is, and the 3D
// town draws it as lived in (its house found by the words and the owner's standing).
// ──────────────────────────────────────────────

/** How a home comes to its owners. */
export const WORLD_HOME_GAINS = Object.freeze(["start", "bought", "rented", "given", "inherited"] as const);
/** How a home stops being theirs: sold, given up (a rent), or lost. */
export const WORLD_HOME_ENDS = Object.freeze(["sold", "left", "lost"] as const);
export const WORLD_HOME_HOWS = Object.freeze([...WORLD_HOME_GAINS, ...WORLD_HOME_ENDS] as const);
export type WorldHomeHow = (typeof WORLD_HOME_HOWS)[number];
/** The kind of house it is, by its owners' wealth and standing: a merchant's or a gentleman's, a
 *  craftsman's or a yeoman's, a labourer's cottage or rooms. */
export const WORLD_HOME_STATUSES = Object.freeze(["rich", "common", "poor"] as const);
export type WorldHomeStatus = (typeof WORLD_HOME_STATUSES)[number];

import { z } from "zod";

export interface WorldHome {
  /** The settlement it stands in. */
  placeId: string;
  /** The house in words, as the story names it ("a house on Bell Street"). */
  words: string;
  /** The characters who own (or rent) it. */
  owners: string[];
  how: (typeof WORLD_HOME_GAINS)[number];
  /** What it cost, or for a rented home what it costs a month, in the game's money. */
  price?: number;
  /** The price as the tag said it, coins and all ("61 gold"), when it names them. */
  priceWords?: string;
  status?: WorldHomeStatus;
  /** The game day it became theirs. */
  day: number;
  /** The 3D town's house for it (town-wide key), once the town has found it one. */
  key?: string;
}

/** The owners a tag names: one, or several joined with commas or "and". */
export function worldHomeOwners(text: string | undefined): string[] {
  return (text ?? "")
    .split(/,|\band\b|&/i)
    .map((each) => each.trim())
    .filter(Boolean)
    .slice(0, 8);
}

/** A price as the tag writes it: the first number in it. */
export function worldHomePrice(text: string | undefined): number | undefined {
  const match = /\d+(?:\.\d+)?/.exec(text ?? "");
  const value = match ? Number(match[0]) : NaN;
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** The homes with one change folded in: a gain makes (or hands on) the home, an end takes it away. */
export function worldHomesWith(
  homes: WorldHome[],
  change: {
    placeId: string;
    words: string;
    how: WorldHomeHow;
    owners: string[];
    price?: number;
    priceWords?: string;
    status?: WorldHomeStatus;
    day: number;
    key?: string;
  },
): WorldHome[] {
  // The same house: by the 3D town's house where both name one, else by its words.
  const isIt = (home: WorldHome) =>
    home.placeId === change.placeId &&
    (home.key && change.key ? home.key === change.key : same(home.words, change.words));
  const rest = homes.filter((home) => !isIt(home));
  if ((WORLD_HOME_ENDS as readonly string[]).includes(change.how)) return rest;
  if (!change.owners.length) return homes;
  const before = homes.find(isIt);
  return [
    ...rest,
    {
      placeId: change.placeId,
      // The house keeps the words it was first named by.
      words: before?.words ?? change.words,
      owners: change.owners,
      how: change.how as WorldHome["how"],
      ...(change.price !== undefined
        ? { price: change.price, ...(change.priceWords ? { priceWords: change.priceWords } : {}) }
        : before?.price !== undefined
          ? { price: before.price, ...(before.priceWords ? { priceWords: before.priceWords } : {}) }
          : {}),
      ...(change.status ? { status: change.status } : before?.status ? { status: before.status } : {}),
      day: change.day,
      ...(change.key ? { key: change.key } : before?.key ? { key: before.key } : {}),
    },
  ];
}

const HOW_WORDS: Record<WorldHome["how"], string> = {
  start: "has lived in",
  bought: "bought",
  rented: "rents",
  given: "was given",
  inherited: "inherited",
};

/** One home in words, for the Game Master. */
export function worldHomeLine(home: WorldHome, money?: string): string {
  const who =
    home.owners.length > 1 ? `${home.owners.slice(0, -1).join(", ")} and ${home.owners.at(-1)}` : home.owners[0];
  const said = home.priceWords ?? `${home.price}${money ? ` ${money}` : ""}`;
  const cost =
    home.price !== undefined
      ? home.how === "rented"
        ? ` for ${said} a month`
        : home.how === "bought"
          ? ` for ${said}`
          : ""
      : "";
  return `${who} ${HOW_WORDS[home.how]} ${home.words}${cost}`;
}

/** The party's homes, for the Game Master: those in this settlement, then the rest by settlement name. */
export function worldHomesLines(
  homes: readonly WorldHome[] | undefined,
  here: string | undefined,
  nameOf: (placeId: string) => string | undefined,
  money?: string,
): string[] {
  if (!homes?.length) return [];
  const local = homes.filter((home) => home.placeId === here);
  const away = homes.filter((home) => home.placeId !== here);
  return [
    ...(local.length
      ? [
          `- Homes the party has here: ${local.map((home) => worldHomeLine(home, money)).join("; ")}. A night's rest at home costs nothing.`,
        ]
      : []),
    ...(away.length
      ? [
          `- The party's homes elsewhere: ${away
            .map((home) => `${worldHomeLine(home, money)} in ${nameOf(home.placeId) ?? "another settlement"}`)
            .join("; ")}.`,
        ]
      : []),
  ];
}

/** How the Game Master records a home, and when a character starts with one. */
export function worldHomesInstructions(): string[] {
  return [
    `- A home that belongs to the players' characters: [world: owned="the house in a few words, e.g. a house on Bell Street" place="Settlement" owner="Character name" how="${WORLD_HOME_GAINS.join('" | "')}" price="what it cost, or a month's rent" status="${WORLD_HOME_STATUSES.join('" | "')}"]. Several owners: owner="Name, Name". When it stops being theirs: how="sold", how="left" (a rented home given up) or how="lost". status is the kind of house it is, by its owners' wealth and standing.`,
    `- At the start of a game (or when a character joins), when it makes sense that a character already has a home, or the player says where they live, record it with how="start": a house that fits their wealth and standing, in the settlement they live in.`,
  ];
}

// ── For sale at the door (homes step 2) ──

/** The 3D town's house as its door tells it: the footprint in cells, its storeys, and its district's kind. */
export const worldHomeHouseSchema = z
  .object({
    w: z.number().int().min(1).max(12),
    d: z.number().int().min(1).max(12),
    st: z.number().int().min(1).max(5),
    dist: z.enum(["rich", "ware", "common", "craft", "poor", "cottage"]),
  })
  .strict();
export type WorldHomeHouse = z.infer<typeof worldHomeHouseSchema>;

const STOREYS = ["one storey", "two storeys", "three storeys", "four storeys", "five storeys"];
const DIST_WORDS: Record<WorldHomeHouse["dist"], string> = {
  rich: "a wealthy street",
  ware: "a merchants' street",
  common: "an ordinary street",
  craft: "a craftsmen's street",
  poor: "a poor street",
  cottage: "a cottage on the edge of town",
};
/** The house in words for the Game Master, told only once it is bought or rented. */
export function worldHomeHouseWords(house: WorldHomeHouse, empty: boolean): string {
  return `${STOREYS[house.st - 1] ?? `${house.st} storeys`}, ${house.w} by ${house.d} bays, ${DIST_WORDS[house.dist]}${empty ? ", left empty for a while" : ""}`;
}

/** A 3D town house's key: "p<plot>" (a house), as the scene names it. */
export const WORLD_HOME_KEY = /^p\d{1,6}$/;

/** The kind of house a district's house is, by its owners' wealth and standing. */
export function worldHomeStatusOf(dist: WorldHomeHouse["dist"]): WorldHomeStatus {
  return dist === "rich" || dist === "ware" ? "rich" : dist === "poor" || dist === "cottage" ? "poor" : "common";
}

/**
 * An everyday price in the game's money (its smallest coin): the middle of the cheapest third of what
 * a market sells, a meal or a mug of ale. A day's labour is about ten of it, the yardstick a house is
 * priced by (a craftsman's town house of the 1400s cost some two years of a labourer's wages).
 */
export function worldHomeEverydayPrice(prices: readonly number[]): number {
  const cheap = [...prices].filter((each) => Number.isFinite(each) && each > 0).sort((a, b) => a - b);
  if (!cheap.length) return 1;
  const third = cheap.slice(0, Math.max(1, Math.ceil(cheap.length / 3)));
  return Math.max(1, third[Math.floor((third.length - 1) / 2)]!);
}

const DIST_TIMES: Record<WorldHomeHouse["dist"], number> = {
  rich: 1.7,
  ware: 1.4,
  common: 1,
  craft: 1,
  poor: 0.65,
  cottage: 0.55,
};
const PROSPERITY_TIMES: Record<string, number> = { thriving: 1.25, modest: 1, struggling: 0.7 };
/** Days of a labourer's wage one cell of floor is worth, on each storey. */
const DAYS_PER_CELL = 25;
/** A month's rent is about a hundredth of the price. */
export const WORLD_HOME_RENT_SHARE = 0.01;

/** A round price: two figures, so 6,134 is 6,100 and 87 is 87. */
function roundPrice(value: number): number {
  if (value < 100) return Math.max(1, Math.round(value));
  const step = 10 ** (Math.floor(Math.log10(value)) - 1);
  return Math.round(value / step) * step;
}

/**
 * What a house costs to buy, and a month's rent, in the game's smallest coin: by its floor (cells on
 * each storey), its district, how the town is doing now, and an everyday price of the game's money. A
 * house left empty by the town's past sells for less: it needs work.
 */
export function worldHomeAsk(
  house: WorldHomeHouse,
  prosperity: string | undefined,
  everyday: number,
  empty = false,
): { price: number; rent: number } {
  const floor = house.w * house.d * Math.min(house.st, 4);
  const wage = Math.max(1, everyday) * 10;
  const raw =
    floor * DAYS_PER_CELL * wage * DIST_TIMES[house.dist] * (PROSPERITY_TIMES[prosperity ?? ""] ?? 1) * (empty ? 0.85 : 1);
  const price = roundPrice(raw);
  return { price, rent: roundPrice(Math.max(1, price * WORLD_HOME_RENT_SHARE)) };
}

/** An amount of the smallest coin said in a family's coins, largest first ("61 gold", "6 gold 5 silver"). */
export function worldHomeSaid(
  amount: number,
  family: ReadonlyArray<{ name: string; value: number; one?: string }>,
): string {
  const coins = [...family].filter((coin) => coin.value > 0).sort((a, b) => b.value - a.value);
  if (!coins.length) return String(amount);
  let rest = Math.round(amount);
  const parts: string[] = [];
  for (const coin of coins) {
    const count = Math.floor(rest / coin.value);
    if (count > 0) parts.push(`${count} ${count === 1 && coin.one ? coin.one : coin.name}`);
    rest -= count * coin.value;
    if (parts.length === 2) break;
  }
  return parts.join(" ") || `0 ${coins.at(-1)!.name}`;
}

const quoted = (text: string) => text.replace(/["\[\]]/g, "").trim();

/** The tag the Engine writes for a home bought or rented at its door, told with the next reply. */
export function worldHomeTag(home: {
  words: string;
  place: string;
  owners: readonly string[];
  how: WorldHomeHow;
  /** The price as said, coins and all ("61 gold"). */
  price?: string;
  status?: WorldHomeStatus;
  key?: string;
  /** The house for the Game Master, in a few words ("two storeys, 3 by 4 bays, a merchants' street"). */
  note?: string;
}): string {
  return `[world: owned="${quoted(home.words)}" place="${quoted(home.place)}" owner="${home.owners
    .map(quoted)
    .join(", ")}" how="${home.how}"${home.price ? ` price="${quoted(home.price)}"` : ""}${home.status ? ` status="${home.status}"` : ""}${
    home.key ? ` house="${home.key}"` : ""
  }${home.note ? ` note="${quoted(home.note)}"` : ""}]`;
}

/** The home tags the Engine has written and the next reply tells, kept on the game. */
export const WORLD_HOMES_PENDING_MAX = 8;
export function worldHomesPendingFromMetadata(metadata: Record<string, unknown>): string[] {
  const raw = metadata.gameHomesPending;
  return Array.isArray(raw)
    ? raw.filter((each): each is string => typeof each === "string" && each.startsWith("[world: owned=")).slice(0, WORLD_HOMES_PENDING_MAX)
    : [];
}

// ── Storage at home (homes step 3): what the party leaves in a home stays there ──

/** The stacks left at each home, by `worldHomeStoreKey`, kept on the game (`gameHomeStores`). */
export type WorldHomeStores = Record<string, Array<{ id: string; name: string; quantity: number } & Record<string, unknown>>>;
export const WORLD_HOME_STORE_MAX = 60;
export function worldHomeStoreKey(home: { placeId: string; words: string }): string {
  return `${home.placeId}:${home.words.trim().toLowerCase()}`;
}
export function worldHomeStoresFromMetadata(metadata: Record<string, unknown>): WorldHomeStores {
  const raw = metadata.gameHomeStores;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: WorldHomeStores = {};
  for (const [key, list] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(list)) continue;
    out[key] = list.filter(
      (each): each is WorldHomeStores[string][number] =>
        !!each &&
        typeof each === "object" &&
        typeof (each as { id?: unknown }).id === "string" &&
        typeof (each as { name?: unknown }).name === "string" &&
        Number.isInteger((each as { quantity?: unknown }).quantity) &&
        (each as { quantity: number }).quantity > 0,
    );
  }
  return out;
}

/** What is kept at the party's homes, for the Game Master: one line, or none. */
export function worldHomeStoresLine(
  homes: readonly WorldHome[] | undefined,
  stores: WorldHomeStores,
  nameOf: (placeId: string) => string | undefined,
): string | undefined {
  const parts = (homes ?? []).flatMap((home) => {
    const kept = stores[worldHomeStoreKey(home)] ?? [];
    if (!kept.length) return [];
    const things = kept.map((each) => `${each.quantity > 1 ? `${each.quantity} ` : ""}${each.name}`).join(", ");
    return [`${home.words} (${nameOf(home.placeId) ?? "another settlement"}): ${things}`];
  });
  return parts.length
    ? `- Kept at the party's homes (only to be used or taken there): ${parts.join("; ")}.`
    : undefined;
}

// ── Rent due (homes step 4): a rented home's rent comes due each month of game days ──

/** Days in a month of rent. */
export const WORLD_HOME_RENT_DAYS = 30;
/** The rented homes whose next month's rent is due by `day`: the home and the months owed. */
export function worldHomesRentDue(
  homes: readonly WorldHome[] | undefined,
  day: number,
): Array<{ home: WorldHome; months: number }> {
  return (homes ?? []).flatMap((home) => {
    if (home.how !== "rented" || home.price === undefined) return [];
    const months = Math.floor((day - home.day) / WORLD_HOME_RENT_DAYS);
    return months >= 1 ? [{ home, months }] : [];
  });
}
