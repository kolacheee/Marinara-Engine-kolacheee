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
  type GameInventoryCoin,
  type GameInventoryStack,
  type WorldHomeHouse,
} from "@marinara-engine/shared";
import type { DB } from "../../db/connection.js";
import { createChatsStorage } from "../storage/chats.storage.js";
import { createCharactersStorage } from "../storage/characters.storage.js";
import { resolveChatUserIdentity } from "../chat-user-identity.js";
import { roomHostIdentity } from "../multiplayer/generation-policy.js";
import { loadGameInventoryItemBook, readMetadata } from "./game-inventory.service.js";

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
