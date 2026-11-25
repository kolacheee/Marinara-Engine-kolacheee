// Figures (fork): a look read from words, a named person's look from their role and traits, and the
// layers a look stacks.
import assert from "node:assert/strict";
import {
  worldFigureFromWords,
  worldFigureLayers,
  worldFigureLookSchema,
  worldPersonFigure,
  worldFigureLooksFromMetadata,
} from "../../packages/shared/src/index.js";

const mara = worldFigureFromWords(
  "Mara is a slender woman with long red hair tied back, freckles across her nose, and a hooded green cloak. She carries a yew bow.",
  "Mara",
  "Ranger",
);
assert.equal(mara.body, "woman");
assert.equal(mara.build, "slight");
assert.equal(mara.hairColour, "red");
assert.equal(mara.hair, "tied");
assert.equal(mara.head, "hood");
assert.equal(mara.held, "bow");
assert.equal(mara.outfit, "ranger");
assert.equal(mara.mark, "freckles");
assert.ok(worldFigureLookSchema.safeParse(mara).success);

const bram = worldFigureFromWords("A broad, bearded old man, grey-haired, who wields a longsword.", "Bram", "Fighter");
assert.equal(bram.body, "man");
assert.equal(bram.age, "old");
assert.equal(bram.build, "sturdy");
assert.equal(bram.hairColour, "grey");
assert.equal(bram.mark, "beard");
assert.equal(bram.held, "sword");
assert.equal(bram.outfit, "fighter");
// "longsword" is not long hair, a tailor is not a ponytail.
assert.notEqual(bram.hair, "long");
assert.notEqual(worldFigureFromWords("He works as a tailor.", "T").hair, "tied");

// Unsaid things are drawn from the seed: the same every time, different between people.
assert.deepEqual(worldFigureFromWords("someone", "Ilse"), worldFigureFromWords("someone", "Ilse"));
const many = new Set(Array.from({ length: 30 }, (_, i) => JSON.stringify(worldFigureFromWords("someone", `p${i}`))));
assert.ok(many.size > 25);

// A named person: the smith wears a labourer's clothes and carries a tool; the old priest's hair is grey.
const smith = worldPersonFigure({
  id: "x-1",
  name: "Jorg",
  role: "smith",
  age: "in their prime",
  build: "broad-shouldered",
  hair: "dark hair",
  mark: "a scar",
});
assert.equal(smith.outfit, "labourer");
assert.equal(smith.held, "tool");
assert.equal(smith.build, "sturdy");
assert.equal(smith.hairColour, "black");
assert.equal(smith.mark, "scar");
const priest = worldPersonFigure(
  {
    id: "x-2",
    name: "Ansel",
    role: "priest",
    age: "old",
    build: "tall and thin",
    hair: "short hair",
    mark: "a tired look",
  },
  "man",
);
assert.equal(priest.body, "man");
assert.equal(priest.age, "old");
assert.equal(priest.hairColour, "grey");
assert.equal(priest.outfit, "priest");

// Layers stack bottom first: body (skin), outfit, hair, head, held.
const layers = worldFigureLayers(mara).map((each) => each.layer);
assert.equal(layers[0], "body/woman-slight");
assert.ok(layers.indexOf("outfit/ranger") < layers.indexOf("hair/tied"));
assert.ok(layers.indexOf("hair/tied") < layers.indexOf("head/hood"));
assert.equal(layers.at(-1), "held/bow");
assert.equal(
  worldFigureLayers({ ...mara, hair: "bald" }).some((each) => each.layer.startsWith("hair/")),
  false,
);

assert.deepEqual(worldFigureLooksFromMetadata({ gameFigureLooks: { mara } }), { mara });
assert.deepEqual(worldFigureLooksFromMetadata({ gameFigureLooks: { mara: { body: "x" } } }), {});

console.log("world-figures: ok");
