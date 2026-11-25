// ──────────────────────────────────────────────
// Homes the players own (fork), step 2: a house for sale at its door in the 3D town. The Engine prices it
// in the game's own money, takes the price (or a month's rent) out of the party's purses as a payment is
// taken, and writes the home's ledger tag for the next reply to tell, so the Game Master narrates it and
// the ledger stays the one record.
// ──────────────────────────────────────────────
import {
  gameInventoryBagKey,
  gameInventoryCoinRef,
  gameInventoryCoinWorth,
  normalizeGameInventoryStacks,
  payGameInventoryCoinsTogether,
  worldHomeAsk,
  worldHomeEverydayPrice,
  worldHomeSaid,
  worldHomeLine,
  worldHomeTag,
  worldHomesPendingFromMetadata,
  worldHomesRentDue,
  WORLD_HOMES_PENDING_MAX,
  type WorldHome,
  type GameInventoryCoin,
  type GameInventoryStack,
  type WorldHomeHouse,
} from "@marinara-engine/shared";
import type { DB } from "../../db/connection.js";
import { createChatsStorage } from "../storage/chats.storage.js";
import { createCharactersStorage } from "../storage/characters.storage.js";
import { resolveChatUserIdentity } from "../chat-user-identity.js";
import { roomHostIdentity } from "../multiplayer/generation-policy.js";
import { commitGameInventoryChange, loadGameInventoryItemBook, readMetadata } from "./game-inventory.service.js";

export interface GameHomeMoney {
  /** The family prices are paid in, largest coin first. */
  family: GameInventoryCoin[];
  /** The coins change comes back in where they make it. */
  usual?: readonly string[];
  /** An everyday price, in the family's smallest coin. */
  everyday: number;
}

/** The game's money for a house: its main family of coins (the one most prices are written in) and an
 *  everyday price of it. Null for a game with no coins. */
export async function gameHomeMoney(db: DB, chatId: string): Promise<GameHomeMoney | null> {
  const book = await loadGameInventoryItemBook(db, { chatId }, "player");
  if (!book?.coinNamed || !book.coins.length) return null;
  const familyOf = new Map(book.coins.map((coin) => [coin.item, coin.coin!.family]));
  const valueOf = new Map(book.coins.map((coin) => [coin.item, coin.coin!.value]));
  const priced = new Map<string, number[]>();
  for (const one of book.entries) {
    const item = one.entry.item;
    if (!item?.cost || item.service) continue;
    const ref = gameInventoryCoinRef(item.cost.unit);
    const family = familyOf.get(ref);
    if (!family) continue;
    priced.set(family, [...(priced.get(family) ?? []), item.cost.amount * (valueOf.get(ref) ?? 1)]);
  }
  const main =
    [...priced].sort((a, b) => b[1].length - a[1].length)[0]?.[0] ?? book.coins[0]!.coin!.family;
  const first = book.coins.find((coin) => coin.coin!.family === main)!;
  const named = book.coinNamed(first.entry.id) ?? book.coinNamed(first.name);
  if (!named) return null;
  return {
    family: [...named.family],
    ...(named.usual ? { usual: named.usual } : {}),
    everyday: worldHomeEverydayPrice(priced.get(main) ?? []),
  };
}

/** The bags that pay for a house: the player's first, then each companion's. */
export function gameHomePayers(stacks: readonly GameInventoryStack[]): Array<string | undefined> {
  const others = new Map<string, string>();
  for (const stack of stacks) {
    if (stack.holder && !others.has(gameInventoryBagKey(stack.holder))) {
      others.set(gameInventoryBagKey(stack.holder), stack.holder);
    }
  }
  return [undefined, ...others.values()];
}

/** A house's asking price and rent, said in the game's coins, and what the party's purses hold. */
export function gameHomeQuote(
  money: GameHomeMoney,
  house: WorldHomeHouse,
  prosperity: string | undefined,
  empty: boolean,
  stacks: readonly GameInventoryStack[],
) {
  const ask = worldHomeAsk(house, prosperity, money.everyday, empty);
  const purse = gameHomePayers(stacks).reduce(
    (sum, holder) => sum + gameInventoryCoinWorth(stacks, holder, money.family),
    0,
  );
  return {
    price: ask.price,
    rent: ask.rent,
    priceSaid: worldHomeSaid(ask.price, money.family),
    rentSaid: worldHomeSaid(ask.rent, money.family),
    purse,
    purseSaid: worldHomeSaid(purse, money.family),
  };
}

/** Pay `owed` out of the party's purses, as a change to the saved stacks. */
export function gameHomePay(stacks: readonly GameInventoryStack[], money: GameHomeMoney, owed: number) {
  return payGameInventoryCoinsTogether(stacks, gameHomePayers(stacks), money.family, owed, money.usual);
}

/** The player's character's name, as a turn reads it. */
export async function gameHomePlayerName(db: DB, chatId: string): Promise<string | null> {
  const host = roomHostIdentity();
  if (host?.name) return host.name;
  const chat = await createChatsStorage(db).getById(chatId);
  if (!chat) return null;
  const identity = await resolveChatUserIdentity(createCharactersStorage(db), {
    personaId: chat.personaId,
    personaCharacterId: chat.personaCharacterId,
    mode: chat.mode,
  });
  return identity?.name ?? null;
}

export function gameHomeStacks(metadata: unknown): GameInventoryStack[] {
  return normalizeGameInventoryStacks(readMetadata(metadata).gameInventory);
}

/**
 * Rent due (homes step 4): each rented home whose month is up is paid out of the party's purses, as many
 * months as are owed, and its tag written again for the reply to tell (the month starts anew). A rent the
 * purses cannot meet is left owed, for the Game Master to deal with. Returns the tags now waiting to be
 * told (those already waiting first) and the rents left owed, in words.
 */
export async function collectGameHomeRent(
  db: DB,
  chatId: string,
  homes: readonly WorldHome[],
  day: number,
  placeName: (placeId: string) => string | undefined,
): Promise<{ owed: string[] }> {
  const due = worldHomesRentDue(homes, day);
  if (!due.length) return { owed: [] };
  const money = await gameHomeMoney(db, chatId);
  if (!money) return { owed: [] };
  const owed: string[] = [];
  for (const { home, months } of due) {
    const place = placeName(home.placeId);
    if (!place || home.price === undefined) continue;
    // The rent as the tag said it, in the family's smallest coin when it said only a number.
    const monthly = home.priceWords ? gameHomeWorth(home.priceWords, money) ?? home.price : home.price;
    const total = monthly * months;
    const said = worldHomeSaid(total, money.family);
    const tag = worldHomeTag({
      words: home.words,
      place,
      owners: home.owners,
      how: "rented",
      price: home.priceWords ?? worldHomeSaid(monthly, money.family),
      ...(home.status ? { status: home.status } : {}),
      ...(home.key ? { key: home.key } : {}),
      note: `rent paid for ${months === 1 ? "another month" : `${months} months`}: ${said}`,
    });
    const committed = await commitGameInventoryChange<boolean>(db, chatId, (stacks, metadata) => {
      const pending = worldHomesPendingFromMetadata(metadata);
      if (pending.length >= WORLD_HOMES_PENDING_MAX) return { stacks, journal: [], value: false };
      const paid = gameHomePay(stacks, money, total);
      if (!paid.ok) return { stacks, journal: [], value: false };
      return {
        stacks: paid.stacks,
        journal: [
          ...paid.paid.map((each) => ({ item: each.name, action: "used" as const, quantity: each.count })),
          ...paid.change.map((each) => ({ item: each.name, action: "acquired" as const, quantity: each.count })),
        ],
        events: [{ title: "Rent paid", content: `Rent for ${home.words} in ${place}: ${said}.` }],
        metadata: { gameHomesPending: [...pending, tag] },
        value: true,
      };
    });
    if (!committed?.value) owed.push(`${worldHomeLine(home)} in ${place}: ${said} is owed and the party's purses cannot pay it`);
  }
  return { owed };
}

/** A price said in a family's coins ("2 silver 3 copper") as its worth in the smallest coin. */
export function gameHomeWorth(words: string, money: GameHomeMoney): number | undefined {
  let worth = 0;
  let found = false;
  for (const [, count, name] of words.matchAll(/(\d+)\s+([^\d]+?)(?=\s+\d|$)/g)) {
    const coin = money.family.find(
      (each) => each.name.toLowerCase() === name!.trim().toLowerCase() || each.one?.toLowerCase() === name!.trim().toLowerCase(),
    );
    if (!coin) return undefined;
    worth += Number(count) * coin.value;
    found = true;
  }
  return found ? worth : undefined;
}
