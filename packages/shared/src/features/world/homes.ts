// ──────────────────────────────────────────────
// Homes the players own (fork): a house in a settlement that belongs to one or more of the players'
// characters, bought, rented, given, inherited, or theirs from the start. The Game Master records it in
// the world's ledger ([world: owned=...]); the Engine writes the same tag for a buy at a house's door, so
// the ledger stays the one record. A home is told to the Game Master wherever the party is, and the 3D
// town draws it as lived in (its house found by the words and the owner's standing).
// ──────────────────────────────────────────────

/** How a home comes to its owners. */
export const WORLD_HOME_GAINS = Object.freeze(["start", "bought", "rented", "given", "inherited"] as const);
/** How a home stops being theirs. */
export const WORLD_HOME_ENDS = Object.freeze(["sold", "lost"] as const);
export const WORLD_HOME_HOWS = Object.freeze([...WORLD_HOME_GAINS, ...WORLD_HOME_ENDS] as const);
export type WorldHomeHow = (typeof WORLD_HOME_HOWS)[number];
/** The kind of house it is, by its owners' wealth and standing: a merchant's or a gentleman's, a
 *  craftsman's or a yeoman's, a labourer's cottage or rooms. */
export const WORLD_HOME_STATUSES = Object.freeze(["rich", "common", "poor"] as const);
export type WorldHomeStatus = (typeof WORLD_HOME_STATUSES)[number];

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
    status?: WorldHomeStatus;
    day: number;
  },
): WorldHome[] {
  const rest = homes.filter((home) => !(home.placeId === change.placeId && same(home.words, change.words)));
  if ((WORLD_HOME_ENDS as readonly string[]).includes(change.how)) return rest;
  if (!change.owners.length) return homes;
  const before = homes.find((home) => home.placeId === change.placeId && same(home.words, change.words));
  return [
    ...rest,
    {
      placeId: change.placeId,
      // The house keeps the words it was first named by.
      words: before?.words ?? change.words,
      owners: change.owners,
      how: change.how as WorldHome["how"],
      ...(change.price !== undefined
        ? { price: change.price }
        : before?.price !== undefined
          ? { price: before.price }
          : {}),
      ...(change.status ? { status: change.status } : before?.status ? { status: before.status } : {}),
      day: change.day,
      ...(before?.key ? { key: before.key } : {}),
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
  const cost =
    home.price !== undefined
      ? home.how === "rented"
        ? ` for ${home.price}${money ? ` ${money}` : ""} a month`
        : home.how === "bought"
          ? ` for ${home.price}${money ? ` ${money}` : ""}`
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
      ? [`- Homes the party has here: ${local.map((home) => worldHomeLine(home, money)).join("; ")}.`]
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
    `- A home that belongs to the players' characters: [world: owned="the house in a few words, e.g. a house on Bell Street" place="Settlement" owner="Character name" how="${WORLD_HOME_GAINS.join('" | "')}" price="what it cost, or a month's rent" status="${WORLD_HOME_STATUSES.join('" | "')}"]. Several owners: owner="Name, Name". When it stops being theirs: how="sold" or how="lost". status is the kind of house it is, by its owners' wealth and standing.`,
    `- At the start of a game (or when a character joins), when it makes sense that a character already has a home, or the player says where they live, record it with how="start": a house that fits their wealth and standing, in the settlement they live in.`,
  ];
}
