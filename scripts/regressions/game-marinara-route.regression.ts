/**
 * Classic Marinara through the fight routes (2026-11-01): a game with the Classic Marinara classes
 * toggle starts a Classic fight with progressions made from the party's cards and written back, plays
 * it out through the command route, and once it is won writes XP onto the cards and the summary.
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DirectedCombatView, DirectedCommand } from "../../packages/shared/src/features/combat-director.js";
const dataDir = mkdtempSync(join(tmpdir(), "marinara-classes-route-"));
process.env.DATA_DIR = dataDir;
process.env.FILE_STORAGE_DIR = join(dataDir, "storage");
const { default: Fastify } = await import("../../packages/server/node_modules/fastify/fastify.js");
const { getDB, closeDB } = await import("../../packages/server/src/db/connection.js");
const { createChatsStorage } = await import("../../packages/server/src/services/storage/chats.storage.js");
const { combatDirectorRoutes } = await import("../../packages/server/src/routes/combat-director.routes.js");
const db = await getDB(),
  app = Fastify(),
  chats = createChatsStorage(db);
app.decorate("db", db);
await app.register(combatDirectorRoutes, { prefix: "/combat", chooseBoss: async () => "fallback" });
const unit = (id: string, name: string, side: "player" | "enemy", hp = 30) => ({
  id,
  name,
  side,
  hp,
  maxHp: hp,
  mp: 0,
  maxMp: 0,
  attack: 5,
  defense: 5,
  speed: 5,
  level: 1,
  skills: [],
});
const post = (url: string, payload: unknown) => app.inject({ method: "POST", url, payload });
try {
  const chat = await chats.create({ name: "Classic Marinara route proof", mode: "game", characterIds: [] });
  const anchor = await chats.createMessage({ chatId: chat.id, role: "assistant", content: "[state: combat]" });
  await chats.patchMetadata(chat.id, {
    gameSetupConfig: { combatDirector: true, marinaraClasses: true, difficulty: "normal" },
    gameCharacterCards: [
      { name: "Ayla", class: "Knight", temperament: "protective", temperamentInitial: "protective" },
      { name: "Corin", class: "Hedge mage", abilities: ["Firebolt"], temperament: "reckless" },
      { name: "Dessa", class: "Healer", temperament: "supportive" },
    ],
  });
  const started = await post("/combat/start", {
    chatId: chat.id,
    anchor: anchor.id,
    style: "classic",
    party: [unit("p1", "Ayla", "player"), unit("p2", "Corin", "player"), unit("p3", "Dessa", "player")],
    enemies: [unit("e1", "Bandit", "enemy", 12), unit("e2", "Bandit Archer", "enemy", 12)],
  });
  assert.equal(started.statusCode, 200, started.body);
  let s = started.json().session as DirectedCombatView;
  assert.ok(
    s.party.every((u) => u.marinara),
    "every party member fights as a Classic Marinara fighter",
  );
  const cardsAfterStart = JSON.parse((await chats.getById(chat.id))!.metadata || "{}").gameCharacterCards;
  assert.ok(
    cardsAfterStart.every((card: { marinara?: unknown }) => card.marinara),
    "each card was given its progression on its first fight",
  );
  assert.equal(cardsAfterStart[0].marinara.primary, "guard", "a knight's sheet reads as the Guard tree");

  const cmd = (command: DirectedCommand) =>
    post("/combat/command", {
      chatId: chat.id,
      anchor: anchor.id,
      id: s.id,
      instanceId: s.instanceId,
      revision: s.revision,
      requestId: crypto.randomUUID(),
      command,
    });
  for (let step = 0; step < 600 && !s.outcome; step++) {
    let command: DirectedCommand;
    if (s.stage === "action" && s.actorId) {
      const foe = s.enemies.find((u) => u.hp > 0)!;
      command = { type: "classic", action: { type: "attack", targetId: foe.id } };
    } else if (s.window) command = { type: "fallback" };
    else command = { type: "continue" };
    const response = await cmd(command);
    assert.equal(response.statusCode, 200, `${JSON.stringify(command)}: ${response.body}`);
    s = response.json().session;
  }
  assert.equal(s.outcome, "victory", "three heroes beat two bandits");
  assert.ok(s.summary?.marinara?.length, "the summary says what the party gained");
  const cardsAfter = JSON.parse((await chats.getById(chat.id))!.metadata || "{}").gameCharacterCards;
  assert.ok(
    cardsAfter.some(
      (card: { marinara: { xp: number; level: number } }) => card.marinara.xp > 0 || card.marinara.level > 1,
    ),
    "the XP is on the cards",
  );

  // Between fights a party member switches to another open class; a class not open is refused.
  const { marinaraClassBlock, marinaraOpenClasses } =
    await import("../../packages/shared/src/features/marinara-classes.js");
  const corin = cardsAfter.find((card: { name: string }) => card.name === "Corin").marinara;
  const other = marinaraOpenClasses(corin).find(
    (def) => def.id !== corin.activeClass && !marinaraClassBlock(corin, def.id),
  );
  assert.ok(other, "a character opens a second tree's base class from the start");
  const switched = await post("/combat/marinara/progression", { chatId: chat.id, name: "Corin", classId: other!.id });
  assert.equal(switched.statusCode, 200, switched.body);
  assert.equal(switched.json().progression.activeClass, other!.id);
  const refused = await post("/combat/marinara/progression", { chatId: chat.id, name: "Corin", classId: "nope" });
  assert.equal(refused.statusCode, 400, "an unknown class is refused");
  const stored = JSON.parse((await chats.getById(chat.id))!.metadata || "{}").gameCharacterCards;
  assert.equal(stored.find((card: { name: string }) => card.name === "Corin").marinara.activeClass, other!.id);

  // The setup's bestiary families reach the fight through the start route, fitted to the fight's difficulty.
  const { marinaraBestiaryFor } = await import("../../packages/shared/src/features/marinara-bestiary.js");
  const family = marinaraBestiaryFor("high_fantasy", 1).find((one) => one.tiers.includes("standard"))!;
  const beastChat = await chats.create({ name: "Bestiary route proof", mode: "game", characterIds: [] });
  const beastAnchor = await chats.createMessage({
    chatId: beastChat.id,
    role: "assistant",
    content: "[state: combat]",
  });
  await chats.patchMetadata(beastChat.id, {
    gameSetupConfig: { combatDirector: true, marinaraClasses: true, difficulty: "normal", genre: "High Fantasy" },
    gameCharacterCards: [{ name: "Ayla", class: "Knight", temperament: "protective" }],
  });
  const beasts = await post("/combat/start", {
    chatId: beastChat.id,
    anchor: beastAnchor.id,
    style: "classic",
    party: [unit("p1", "Ayla", "player")],
    enemies: [0, 1, 2, 3, 4, 5].map((i) => ({
      ...unit(`b${i}`, `Beast ${i}`, "enemy"),
      marinara: { family: { familyId: family.id, tier: "standard" }, encounter: "easy" },
    })),
  });
  assert.equal(beasts.statusCode, 200, beasts.body);
  const fought = beasts.json().session as DirectedCombatView;
  assert.ok(fought.enemies.length < 6, "six beasts are too many for one hero on an easy fight");
  console.log("game-marinara-route: ok");
} finally {
  await app.close();
  await closeDB();
  rmSync(dataDir, { recursive: true, force: true });
}
