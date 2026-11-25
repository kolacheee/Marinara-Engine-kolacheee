// ──────────────────────────────────────────────
// Figures (fork): how a person looks walking a 3D town. Every figure is built from layers drawn once
// (a body, then clothes, hair, headwear, something held, a mark) and stacked; each layer is a sheet of
// 32 x 48 frames, four directions by a four-frame walk. A look is a small record of which layers and
// colours a person wears: drawn from a named person's role, age, build, hair and mark; read once from a
// player's or companion's card; and edited by the player on the sheet.
// ──────────────────────────────────────────────
import { z } from "zod";

/** One frame of a figure, in pixels. */
export const WORLD_FIGURE_FRAME = Object.freeze({ w: 32, h: 48 });
/** Rows of a layer sheet, top to bottom. Left is drawn, not mirrored, so a sword stays in one hand. */
export const WORLD_FIGURE_DIRS = Object.freeze(["down", "left", "right", "up"] as const);
/** Columns of a layer sheet: the walk, frame 0 also standing. */
export const WORLD_FIGURE_WALK = 4;
/** A layer sheet is WALK frames wide and one row per direction. */
export const WORLD_FIGURE_SHEET = Object.freeze({
  w: WORLD_FIGURE_FRAME.w * WORLD_FIGURE_WALK,
  h: WORLD_FIGURE_FRAME.h * WORLD_FIGURE_DIRS.length,
});

export const WORLD_FIGURE_BODIES = Object.freeze(["man", "woman"] as const);
export const WORLD_FIGURE_AGES = Object.freeze(["child", "adult", "old"] as const);
export const WORLD_FIGURE_BUILDS = Object.freeze(["slight", "sturdy", "heavy"] as const);
/** Skin tones, lightest first: one body drawn once, recoloured. */
export const WORLD_FIGURE_SKINS = 5;
/** Colourways each outfit or headwear comes in. */
export const WORLD_FIGURE_COLOURWAYS = 4;

/** Clothes: townsfolk by their work, adventurers by their calling. */
export const WORLD_FIGURE_OUTFITS = Object.freeze([
  "labourer",
  "farmer",
  "trader",
  "wealthy",
  "cleric",
  "guard",
  "sailor",
  "child",
  "fighter",
  "knight",
  "mage",
  "rogue",
  "priest",
  "ranger",
  "bard",
  "monk",
] as const);
export const WORLD_FIGURE_HAIRS = Object.freeze([
  "bald",
  "cropped",
  "short",
  "curly",
  "long",
  "braid",
  "tied",
  "bun",
] as const);
export const WORLD_FIGURE_HAIR_COLOURS = Object.freeze([
  "black",
  "brown",
  "chestnut",
  "blond",
  "red",
  "grey",
  "white",
  "dyed",
] as const);
export const WORLD_FIGURE_HEADS = Object.freeze(["hood", "hat", "cap", "coif", "helmet", "circlet"] as const);
export const WORLD_FIGURE_HELD = Object.freeze([
  "staff",
  "sword",
  "bow",
  "book",
  "basket",
  "tool",
  "lantern",
  "lute",
] as const);
export const WORLD_FIGURE_MARKS = Object.freeze(["scar", "beard", "moustache", "eyepatch", "freckles"] as const);

export const worldFigureLookSchema = z.object({
  body: z.enum(WORLD_FIGURE_BODIES),
  age: z.enum(WORLD_FIGURE_AGES),
  build: z.enum(WORLD_FIGURE_BUILDS),
  skin: z
    .number()
    .int()
    .min(0)
    .max(WORLD_FIGURE_SKINS - 1),
  outfit: z.enum(WORLD_FIGURE_OUTFITS),
  colour: z
    .number()
    .int()
    .min(0)
    .max(WORLD_FIGURE_COLOURWAYS - 1),
  hair: z.enum(WORLD_FIGURE_HAIRS),
  hairColour: z.enum(WORLD_FIGURE_HAIR_COLOURS),
  head: z.enum(WORLD_FIGURE_HEADS).optional(),
  held: z.enum(WORLD_FIGURE_HELD).optional(),
  mark: z.enum(WORLD_FIGURE_MARKS).optional(),
});
export type WorldFigureLook = z.infer<typeof worldFigureLookSchema>;

/** The layers a look stacks, bottom first, each as `<kind>/<id>` (the sheet's file), with the colourway
 *  or skin it is recoloured to. A child or an old body is its own drawn body. */
export function worldFigureLayers(look: WorldFigureLook): Array<{ layer: string; tint?: number | string }> {
  const body = look.age === "adult" ? `${look.body}-${look.build}` : `${look.body}-${look.age}`;
  const out: Array<{ layer: string; tint?: number | string }> = [{ layer: `body/${body}`, tint: look.skin }];
  if (look.mark === "scar" || look.mark === "freckles") out.push({ layer: `mark/${look.mark}` });
  out.push({ layer: `outfit/${look.outfit}`, tint: look.colour });
  if (look.mark === "beard" || look.mark === "moustache")
    out.push({ layer: `mark/${look.mark}`, tint: look.hairColour });
  // A hat sits on the hair; a hood or helmet covers it, so only what shows below is drawn (the
  // hair sheet's own "under" rows are not needed: the head layer covers the rest).
  if (look.hair !== "bald") out.push({ layer: `hair/${look.hair}`, tint: look.hairColour });
  if (look.mark === "eyepatch") out.push({ layer: "mark/eyepatch" });
  if (look.head) out.push({ layer: `head/${look.head}`, tint: look.colour });
  if (look.held) out.push({ layer: `held/${look.held}` });
  return out;
}

/** A stable number from text, for looks that must be the same every visit. */
function seeded(text: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
const pickOf = <T>(list: readonly T[], random: () => number): T => list[Math.floor(random() * list.length)]!;
// Whole words; a word ending in * is a stem ("sorcer*" finds sorcerer and sorceress).
const has = (text: string, ...words: string[]) =>
  words.some((word) => new RegExp(`\\b${word.endsWith("*") ? word.slice(0, -1) : `${word}\\b`}`, "i").test(text));

/** Clothes by role or calling, from the words a kit or a card uses. */
export function worldFigureOutfitOf(words: string): (typeof WORLD_FIGURE_OUTFITS)[number] | undefined {
  const w = words.toLowerCase();
  if (has(w, "paladin", "knight", "templar", "cavalier")) return "knight";
  if (has(w, "fighter", "warrior", "barbarian", "soldier", "mercenary", "sellsword", "gladiator")) return "fighter";
  if (has(w, "wizard", "mage", "sorcer*", "warlock", "witch", "magus", "arcan*", "necroman*")) return "mage";
  if (has(w, "rogue", "thief", "assassin", "scout", "spy", "smuggler")) return "rogue";
  if (has(w, "cleric", "priest", "priestess")) return "priest";
  if (has(w, "ranger", "hunter", "druid", "archer", "trapper")) return "ranger";
  if (has(w, "bard", "minstrel", "musician", "player", "jester")) return "bard";
  if (has(w, "monk", "nun", "friar", "abbot", "hermit")) return "monk";
  if (has(w, "guard", "watch", "constable", "sergeant", "gaoler", "jailer")) return "guard";
  if (has(w, "sailor", "fisher", "boatman", "ferry", "mariner", "dock")) return "sailor";
  if (has(w, "farmer", "shepherd", "herder", "peasant", "miller", "swineherd", "yeoman")) return "farmer";
  if (has(w, "merchant", "trader", "shopkeep*", "innkeep*", "baker", "butcher", "chandler", "clerk", "scribe"))
    return "trader";
  if (has(w, "noble", "lord", "lady", "elder", "mayor", "reeve", "alderman", "banker", "magistrate", "count"))
    return "wealthy";
  if (has(w, "healer", "herbalist", "physician", "midwife", "apothecar*")) return "cleric";
  if (has(w, "smith", "crafter", "carpenter", "mason", "tanner", "weaver", "potter", "labourer", "miner", "porter"))
    return "labourer";
  return undefined;
}

const HAIR_COLOUR_WORDS: Array<[(typeof WORLD_FIGURE_HAIR_COLOURS)[number], string[]]> = [
  ["white", ["white hair", "white-haired", "snow-white", "platinum"]],
  [
    "grey",
    [
      "grey hair",
      "gray hair",
      "grey-haired",
      "gray-haired",
      "silver hair",
      "silver-haired",
      "grizzled",
      "greying",
      "graying",
    ],
  ],
  ["red", ["red hair", "red-haired", "redhead", "ginger", "auburn", "copper hair", "flame-haired"]],
  ["blond", ["blond", "fair-haired", "fair hair", "golden hair", "golden-haired", "flaxen", "straw-coloured"]],
  ["chestnut", ["chestnut", "light brown", "light hair", "sandy", "honey"]],
  ["black", ["black hair", "black-haired", "raven", "jet-black", "dark hair", "ebony hair"]],
  ["brown", ["brown hair", "brown-haired", "brunette", "dark-haired"]],
  ["dyed", ["blue hair", "green hair", "pink", "purple", "violet", "teal", "dyed"]],
];

/** A look read from words that describe someone (a card's description, a person's line). Whatever the
 *  words do not say is drawn from `seed`, so the same character always looks the same. */
export function worldFigureFromWords(words: string, seed: string, calling = ""): WorldFigureLook {
  const random = seeded(`${seed}\u0000figure`);
  const w = ` ${words.toLowerCase()} `;
  const she = (w.match(/\b(she|her|hers|herself|woman|girl|lady|female|mother|daughter|wife|queen|princess)\b/g) ?? [])
    .length;
  const he = (w.match(/\b(he|him|his|himself|man|boy|lord|male|father|son|husband|king|prince)\b/g) ?? []).length;
  const body = she > he ? "woman" : he > she ? "man" : pickOf(WORLD_FIGURE_BODIES, random);
  const age = has(w, "child", "kid", "boy", "girl", "young child")
    ? "child"
    : has(w, "old", "elderly", "aged", "ancient", "wizened")
      ? "old"
      : "adult";
  const build = has(w, "heavy", "heavyset", "fat", "plump", "stout", "portly", "large", "big")
    ? "heavy"
    : has(w, "stocky", "broad", "muscular", "burly", "brawny", "strong")
      ? "sturdy"
      : has(w, "slight", "slim", "slender", "thin", "wiry", "lithe", "petite", "small")
        ? "slight"
        : pickOf(WORLD_FIGURE_BUILDS, random);
  const skin = has(w, "pale", "fair-skinned", "pallid", "ivory")
    ? 0
    : has(w, "fair skin", "fair-skinned", "light skin", "light-skinned", "rosy")
      ? 1
      : has(w, "olive", "tan", "tanned", "sun-browned", "bronze")
        ? 2
        : has(w, "brown skin", "brown-skinned", "dusky")
          ? 3
          : has(w, "dark skin", "dark-skinned", "black skin", "ebony", "deep brown")
            ? 4
            : Math.floor(random() * WORLD_FIGURE_SKINS);
  const hairColour =
    HAIR_COLOUR_WORDS.find(([, list]) => list.some((word) => w.includes(word)))?.[0] ??
    (age === "old" ? "grey" : pickOf(WORLD_FIGURE_HAIR_COLOURS.slice(0, 5), random));
  const hair = has(w, "bald", "shaven head", "shaved head")
    ? "bald"
    : has(w, "braid", "plait")
      ? "braid"
      : has(w, "ponytail", "tied back")
        ? "tied"
        : has(w, "bun", "topknot")
          ? "bun"
          : has(w, "curl*")
            ? "curly"
            : has(w, "long hair", "long-haired", "flowing hair")
              ? "long"
              : has(w, "cropped", "close-cropped", "buzz")
                ? "cropped"
                : has(w, "short")
                  ? "short"
                  : pickOf(
                      body === "woman"
                        ? (["long", "braid", "tied", "bun", "curly"] as const)
                        : (["cropped", "short", "curly", "long"] as const),
                      random,
                    );
  const outfit =
    (age === "child" ? "child" : undefined) ?? worldFigureOutfitOf(calling) ?? worldFigureOutfitOf(words) ?? "labourer";
  const head = has(w, "helm", "helmet")
    ? "helmet"
    : has(w, "hood", "cowl", "hooded")
      ? "hood"
      : has(w, "circlet", "crown", "tiara", "diadem")
        ? "circlet"
        : has(w, "hat")
          ? "hat"
          : has(w, "cap")
            ? "cap"
            : undefined;
  const held = has(w, "staff", "stave", "quarterstaff")
    ? "staff"
    : has(w, "bow", "archer")
      ? "bow"
      : has(w, "lute", "harp", "fiddle")
        ? "lute"
        : has(w, "tome", "book", "grimoire")
          ? "book"
          : has(w, "sword", "blade", "longsword", "sabre", "saber")
            ? "sword"
            : has(w, "lantern")
              ? "lantern"
              : undefined;
  const mark = has(w, "eyepatch", "eye patch", "one eye")
    ? "eyepatch"
    : has(w, "scar")
      ? "scar"
      : body === "man" && has(w, "beard", "bearded")
        ? "beard"
        : body === "man" && has(w, "moustache", "mustache")
          ? "moustache"
          : has(w, "freckle*")
            ? "freckles"
            : undefined;
  return {
    body,
    age,
    build,
    skin,
    outfit,
    colour: Math.floor(random() * WORLD_FIGURE_COLOURWAYS),
    hair,
    hairColour,
    ...(head ? { head } : {}),
    ...(held ? { held } : {}),
    ...(mark ? { mark } : {}),
  };
}

/** The tools of a trade a named person carries about town, by their role. */
function worldFigureHeldOf(role: string): (typeof WORLD_FIGURE_HELD)[number] | undefined {
  if (has(role, "smith", "carpenter", "mason", "crafter", "labourer", "miner", "farmer")) return "tool";
  if (has(role, "scribe", "clerk", "scholar", "priest", "cleric", "elder")) return "book";
  if (has(role, "trader", "merchant", "baker", "healer", "herbalist")) return "basket";
  if (has(role, "guard", "watch")) return "sword";
  return undefined;
}

/**
 * A named person's look: their role dresses them, their age, build, hair and mark are as the game
 * already tells them, and the rest is drawn from who they are, the same every visit. `body` is the
 * person's recorded body when the world records it; otherwise it is read from the words, or drawn.
 */
export function worldPersonFigure(
  person: { id: string; name: string; role: string; age: string; build: string; hair: string; mark: string },
  body?: (typeof WORLD_FIGURE_BODIES)[number],
): WorldFigureLook {
  const look = worldFigureFromWords(
    [body ?? "", person.age, person.build, person.hair, person.mark].join(", "),
    `${person.id}:${person.name}`,
    person.role,
  );
  const held = look.held ?? worldFigureHeldOf(person.role);
  return {
    ...look,
    ...(body ? { body } : {}),
    ...(look.age === "child" ? {} : { outfit: worldFigureOutfitOf(person.role) ?? look.outfit }),
    ...(held ? { held } : {}),
  };
}

/** Saved looks by character name (lower case), for the party and the people the player restyled. */
export const worldFigureLooksSchema = z.record(z.string().max(160), worldFigureLookSchema);
export type WorldFigureLooks = z.infer<typeof worldFigureLooksSchema>;

export function worldFigureLooksFromMetadata(metadata: unknown): WorldFigureLooks {
  const raw =
    metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>).gameFigureLooks : undefined;
  const parsed = worldFigureLooksSchema.safeParse(raw);
  return parsed.success ? parsed.data : {};
}
