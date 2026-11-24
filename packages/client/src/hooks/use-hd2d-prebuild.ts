// ──────────────────────────────────────────────
// HD-2D towns (fork): a city's plan takes seconds to make the first time, so it is made in the background
// (a worker, then kept in the browser) while the party is on the overworld near it: the settlement it
// stands at, those within a couple of cells, and the one it is walking to. Towns build fast enough on entry.
// ──────────────────────────────────────────────
import { useEffect } from "react";
import { worldTownHd2d, worldTownHd2dSpec, type GameWorld } from "@marinara-engine/shared";

/** How near (overworld cells) a city is made ahead. */
const NEAR = 2;
/** Cities already asked for this page's life, by spec. */
const asked = new Set<string>();

export function useHd2dPrebuild(game: GameWorld | null | undefined, here: string | null, goingTo: string | null) {
  useEffect(() => {
    if (!game || !worldTownHd2d(game) || (!here && !goingTo)) return;
    const places = game.world.places;
    const at = places.find((place) => place.id === (here ?? goingTo));
    const wanted = places.filter(
      (place) =>
        place.rank !== undefined &&
        (place.id === here ||
          place.id === goingTo ||
          (at && Math.max(Math.abs(place.at.x - at.at.x), Math.abs(place.at.y - at.at.y)) <= NEAR)),
    );
    const specs = wanted
      .map((place) => worldTownHd2dSpec(game, place.id))
      .filter((spec): spec is NonNullable<typeof spec> => !!spec && spec.cpop > 0);
    if (!specs.length) return;
    let cancelled = false;
    const idle = (fn: () => void) => {
      const win = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (win.requestIdleCallback) win.requestIdleCallback(fn, { timeout: 4000 });
      else window.setTimeout(fn, 1500);
    };
    idle(() => {
      if (cancelled) return;
      void (async () => {
        const [{ prepareCity }, { g2specOf }] = await Promise.all([
          import("../lib/hd2d/gen2/adapt.js"),
          import("../lib/hd2d/town-index.js"),
        ]);
        // One city at a time, nearest first (the list is in the world's order; the party's own first).
        for (const spec of specs) {
          const key = JSON.stringify(spec);
          if (cancelled || asked.has(key)) continue;
          asked.add(key);
          try {
            await prepareCity(g2specOf(spec as unknown as Record<string, unknown>));
          } catch (error) {
            console.warn("[hd2d] city made ahead", error);
          }
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, [game, here, goingTo]);
}
