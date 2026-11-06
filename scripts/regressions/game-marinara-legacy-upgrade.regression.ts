/**
 * A Legacy game's party moves to Classic classes from the Journal (owner 2026-11-06): one class each
 * (the tree picked, else the card's guess), the sister tree from their temperament (kept on the card,
 * else read from their Description, else drawn), their Legacy level carried over as class XP, and their
 * Legacy stats left on the card. A game already on Classic, or on a ruleset, isn't offered it.
 */
import assert from "node:assert/strict";
import {
  applyMarinaraLegacyUpgrade,
  marinaraLegacyNeedsTemperament,
  marinaraLegacyTemperamentPrompt,
  marinaraLegacyUpgradeBlock,
  readMarinaraLegacyTemperaments,
} from "../../packages/server/src/services/game/marinara-legacy-upgrade.service.js";
import { marinaraLegacyLevel, marinaraTrees, readMarinaraCardProgression } from "../../packages/shared/src/index.js";

const legacy = () => ({
  gameSetupConfig: { genre: "fantasy" },
  gameSessionNumber: 6,
  gameCharacterCards: [
    {
      name: "Kara",
      class: "Knight",
      shortDescription: "A stern knight.",
      temperament: "protective",
      temperamentInitial: "protective",
      rpgStats: { attributes: [{ name: "Level", value: 12 }], hp: { value: 40, max: 40 } },
    },
    { name: "Wren", class: "Thief", shortDescription: "Quick hands, quicker feet." },
    { name: "Ossian", class: "Wizard", shortDescription: "An old scholar." },
  ],
});

// Offered only to a Legacy game with a party.
assert.equal(marinaraLegacyUpgradeBlock(legacy()), null);
assert.ok(marinaraLegacyUpgradeBlock({ ...legacy(), gameSetupConfig: { marinaraClasses: true } }));
assert.ok(marinaraLegacyUpgradeBlock({ ...legacy(), gameRuleset: { id: "srd" } }));
assert.ok(marinaraLegacyUpgradeBlock({ ...legacy(), gameCharacterCards: [] }));

// Only the cards without a temperament are read, from their Descriptions.
const needed = marinaraLegacyNeedsTemperament(legacy());
assert.deepEqual(
  needed.map((card) => card.name),
  ["Wren", "Ossian"],
);
const prompt = marinaraLegacyTemperamentPrompt(needed, new Map([["wren", "Wren runs from every fair fight."]]));
assert.match(prompt.user, /Wren runs from every fair fight/);
assert.match(prompt.system, /reckless\|cautious/);
const read = readMarinaraLegacyTemperaments({ Wren: "Cowardly", Ossian: "not a temperament" });
assert.equal(read.get("wren"), "cowardly");
assert.equal(read.has("ossian"), false, "a wrong answer is left out, and drawn instead");

// Levels: the card's Level stat, else the session number, capped at 30.
assert.equal(marinaraLegacyLevel(legacy().gameCharacterCards[0], 6), 12);
assert.equal(marinaraLegacyLevel(legacy().gameCharacterCards[1], 6), 6);
assert.equal(marinaraLegacyLevel({ rpgStats: { attributes: [{ name: "lvl", value: 99 }] } }, 1), 30);

const meta = legacy();
const result = applyMarinaraLegacyUpgrade(meta, {
  gameId: "chat-1",
  members: [{ name: "kara", primary: "blade" }],
  read,
  classic: new Map(),
  sessionNumber: 6,
  at: "2026-11-06T13:00:00Z",
});
assert.ok("patch" in result);
const patched = result.patch as {
  gameCharacterCards: Array<Record<string, unknown>>;
  gameSetupConfig: Record<string, unknown>;
};
assert.equal(patched.gameSetupConfig.marinaraClasses, true, "the game turns Classic on");
assert.equal(patched.gameSetupConfig.genre, "fantasy", "the rest of its setup is kept");
const [kara, wren, ossian] = patched.gameCharacterCards.map((card) => ({
  card,
  progression: readMarinaraCardProgression(card.marinara)!,
}));
// Kara: the tree picked (by any spelling of her name), her kept temperament, level 12 in one class.
assert.equal(kara!.progression.primary, "blade");
assert.equal(kara!.progression.temperament, "protective");
assert.equal(kara!.progression.level, 12);
assert.deepEqual(Object.keys(kara!.progression.classLevels), [kara!.progression.activeClass], "one class");
assert.equal(kara!.progression.classLevels[kara!.progression.activeClass], 12, "class level carried too");
assert.ok(kara!.card.rpgStats, "Legacy stats stay on the card");
// Wren: the guessed tree, the temperament read from the Description now kept on the card.
assert.equal(wren!.progression.primary, "scout");
assert.equal(wren!.card.temperament, "cowardly");
assert.equal(wren!.card.temperamentInitial, "cowardly");
assert.equal(wren!.progression.level, 6, "the session number when the card has no level");
// Ossian: the model's answer was wrong, so a temperament was drawn and kept.
assert.ok(typeof ossian!.card.temperament === "string");
assert.deepEqual(
  result.upgraded.map((one) => one.temperamentFrom),
  ["card", "description", "drawn"],
);
assert.equal(result.upgraded[1]!.secondary, marinaraTrees("scout", "cowardly").secondary);
// Stats grew along the class, as level-ups would.
const fresh = applyMarinaraLegacyUpgrade(
  {
    ...legacy(),
    gameSessionNumber: 1,
    gameCharacterCards: [{ name: "Wren", class: "Thief", temperament: "cowardly" }],
  },
  { gameId: "chat-1", members: [], read: new Map(), classic: new Map(), sessionNumber: 1, at: "x" },
);
assert.ok("patch" in fresh);
const level1 = readMarinaraCardProgression(
  (fresh.patch.gameCharacterCards as Array<Record<string, unknown>>)[0]!.marinara,
)!;
assert.equal(level1.level, 1);
assert.ok(wren!.progression.stats.hp > level1.stats.hp, "a level-6 upgrade has grown past a level-1 start");

// Once upgraded it can't be done again.
assert.ok(
  "refusal" in
    applyMarinaraLegacyUpgrade(
      { ...meta, ...result.patch },
      {
        gameId: "chat-1",
        members: [],
        read: new Map(),
        classic: new Map(),
        at: "x",
      },
    ),
);

console.log("game-marinara-legacy-upgrade: ok");
