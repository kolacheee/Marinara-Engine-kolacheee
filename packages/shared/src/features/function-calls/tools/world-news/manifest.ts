import type { ToolDefinition } from "../../tool-definitions.js";

/** Real-world news, for a game on the real Earth (the Earth seed): see features/world/earth-news.ts. */
export const worldNewsToolManifest = {
  name: "world_news",
  description:
    "Look up the real news up to today in the story, for a game set on the real Earth. Call it only when a character follows the news: reads a paper, turns on the TV or radio, checks their phone, asks what is going on in the world, or hears talk of it. Ordinary days are not about the news; never bring it into a scene that is not about it. Lists the names of the major real events up to today, newest first, never a day after it; tell them as the people there would hear them.",
  parameters: {
    type: "object",
    properties: {
      date: {
        type: "string",
        description: "Today's date in the story, as YYYY-MM-DD (a year before 1 AD is negative: -0043-03-15).",
      },
      days: {
        type: "integer",
        description: "How many days back to look (default 7, or a year when 'about' is given).",
        minimum: 1,
        maximum: 3660,
      },
      about: {
        type: "string",
        description: "Optional words the event's name must have, such as 'election' or 'attacks'.",
      },
    },
    required: ["date"],
  },
} satisfies ToolDefinition;
