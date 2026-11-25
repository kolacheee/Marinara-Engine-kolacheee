// ──────────────────────────────────────────────
// Game: the HD-2D town (fork). A settlement of a fantasy game opens as a walkable 3D town or city, made by
// the town generator (lib/hd2d) from the settlement's spec (worldTownHd2dSpec). The world's own town (its
// named places, hall, workplaces, homes and people) is placed on fitting 3D buildings; walking through a
// door is a town visit, told on the next turn as the 2D town's are, and a building the world never named
// is told by its own words. Where the party stands is kept with the game, and the town's layout is given
// to the Game Master while the party walks it.
// ──────────────────────────────────────────────
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  WORLD_TOWN_SPOT,
  WORLD_TOWN_HD2D_CELLS_PER_MINUTE,
  worldDrawnSeason,
  worldTownHd2dSpec,
  type GameWorld,
  type WeatherType,
  type WorldTownHd2dSpot,
} from "@marinara-engine/shared";
import {
  townHomeAsk,
  townHomeStore,
  useTownHomeEnd,
  useTownHomeStore,
  type TownHomeStore,
  useOverworld,
  useTown,
  useTownHd2dSave,
  useTownHome,
  useTownVisit,
  type TownHomeQuote,
} from "../../hooks/use-game";
import { ApiError } from "../../lib/api-client";
import { useOverworldClock, type OverworldClockHandle } from "../../hooks/use-overworld-view";
import type { Hd2dDoor, Hd2dTownApi, Hd2dWhere } from "../../lib/hd2d/town-scene";
import type { Hd2dTownIndex } from "../../lib/hd2d/town-index";
import { loadOverworldWeatherArt, overworldWeatherIcon, type OverworldWeatherArt } from "./overworld-weather";

interface Hd2dTownViewProps {
  chatId: string;
  game: GameWorld;
  turnKey: string | null;
  time: { day: number; hour: number; minute: number } | null;
  clockRunning: boolean;
  canWalk: boolean;
  /** Where the party stood in each settlement's 3D town, as the game keeps it. */
  spots: WorldTownHd2dSpot[];
  /** The weather where the party is, as the chat has it (a scene may have set it). */
  partyWeather?: WeatherType | null;
  /** Weather drawn in the town (the player's weather effects setting). */
  weatherEffects?: boolean;
  handleRef?: MutableRefObject<OverworldClockHandle | null>;
  onLeave: () => void;
}

/** The town's textures, sprites and models (public/hd2d, fork only). */
const ASSETS = "/hd2d/assets/";
/** How often the party's spot is kept while it walks. */
const SAVE_EVERY_MS = 6000;

const SCENE_CSS = `
.hd2d-host{position:absolute;inset:0;overflow:hidden;background:#0b0c10}
.hd2d-host canvas{display:block;touch-action:none}
.hd2d-where{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);z-index:3;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:rgba(22,19,24,.82);color:#efe8de;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:5px 14px;font:600 13px/1.3 system-ui,sans-serif;pointer-events:none}
.hd2d-where small{font-weight:400;color:#a49a8e;margin-left:8px}
.hd2d-sky{position:absolute;left:50%;top:8px;transform:translateX(-50%);width:min(640px,70%);height:auto;pointer-events:none;z-index:2}
.hd2d-fade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:5}
.hd2d-prompt{position:absolute;left:50%;bottom:52px;transform:translateX(-50%);z-index:6;background:rgba(22,19,24,.86);color:#efe8de;border-radius:10px;padding:5px 12px;font:600 13px system-ui,sans-serif}
.hd2d-tap{display:none}
.hd2d-busy{position:absolute;inset:0;display:grid;place-items:center;color:#d8cfc4;background:#0b0c10;font:15px system-ui,sans-serif;z-index:4;transition:opacity .3s}
.hd2d-busy.off{opacity:0;pointer-events:none}
`;

/** The scene's season from the world's: the town generator draws summer, autumn and winter. */
const sceneSeason = (season: string | undefined) => (season === "autumn" || season === "winter" ? season : "summer");

export function Hd2dTownView({
  chatId,
  game,
  turnKey,
  time,
  clockRunning,
  canWalk,
  spots,
  partyWeather = null,
  weatherEffects = true,
  handleRef,
  onLeave,
}: Hd2dTownViewProps) {
  const { t } = useTranslation();
  const { data: town } = useTown(chatId, turnKey, true);
  const { data: overworld } = useOverworld(chatId, turnKey, true);
  const visitMutation = useTownVisit();
  const saveMutation = useTownHd2dSave();
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Hd2dTownApi | null>(null);
  const movingRef = useRef(false);
  const walkedRef = useRef(0);
  const placingRef = useRef<{
    index: Hd2dTownIndex;
    byKey: Map<string, string>;
    spotWords: (key: string, info: Hd2dDoor) => string;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [where, setWhere] = useState<Hd2dWhere | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  // Homes (fork): an empty house for sale, its card shown while the party is inside it.
  const [forSale, setForSale] = useState<{
    door: Hd2dDoor & { house: NonNullable<Hd2dDoor["house"]> };
    words: string;
    quote: TownHomeQuote | null;
    error: string | null;
    /** Who will own it (homes step 4): the player's character unless more are picked. */
    owners: string[];
  } | null>(null);
  const homeMutation = useTownHome();
  // Storage at home: the Home card, while the party is inside one of its homes.
  const [atHome, setAtHome] = useState<{
    words: string;
    door: Hd2dDoor;
    store: TownHomeStore | null;
    error: string | null;
  } | null>(null);
  const storeMutation = useTownHomeStore();
  const endMutation = useTownHomeEnd();
  /** The party's homes in the 3D town: house key -> the home's words. */
  const homeWordsRef = useRef<Map<string, string>>(new Map());
  const { pendingMinutes, addMinutes } = useOverworldClock(chatId, clockRunning, () => movingRef.current, handleRef);

  const settlementId = town?.settlementId ?? null;
  const settlement = settlementId ? game.world.places.find((place) => place.id === settlementId) : undefined;
  // The town as first seen (the server keeps it), else as the world lays it out now.
  const spec = useMemo(
    () => town?.hd2d?.spec ?? (settlementId ? worldTownHd2dSpec(game, settlementId) : null),
    [game, settlementId, town?.hd2d?.spec],
  );
  // Its chronicle, drawn over the plan: empty houses, burned plots, a camp, a burial ground, the market.
  const chron = town?.hd2d?.chron ?? null;
  // The party's homes here (fork, homes step 3): lived in again whatever the past left them, with a sign.
  const homesKey = JSON.stringify((town?.homes ?? []).map((home) => [home.words, home.key ?? "", home.status ?? ""]));
  const specKey = spec ? JSON.stringify(spec) + JSON.stringify(chron) + homesKey : "";
  const clockMinutes = time ? (time.day * 24 + time.hour) * 60 + time.minute + pendingMinutes : null;
  const hour = clockMinutes === null ? 11 : (clockMinutes / 60) % 24;
  const held = overworld?.seasons;
  const season = sceneSeason(
    (settlementId && held?.[settlementId]) || held?.["*"] || (time ? worldDrawnSeason(game, time.day) : undefined),
  );
  // The weather where the party stands: the Game Master's hold on this town, else the chat's, else a hold on
  // the whole world. Drawn in the scene (sky, light, fog, what falls, fewer people out) and shown in the corner.
  const heldWeather = overworld?.weathers;
  const weather: WeatherType | null =
    (settlementId && heldWeather?.[settlementId]) || partyWeather || heldWeather?.["*"] || null;
  const sceneWeather = weatherEffects ? (weather ?? "clear") : "clear";
  const [weatherArt, setWeatherArt] = useState<OverworldWeatherArt | null>(null);
  useEffect(() => {
    let alive = true;
    void loadOverworldWeatherArt().then((art) => alive && setWeatherArt(art));
    return () => {
      alive = false;
    };
  }, []);
  const weatherIcon = weatherArt && weather ? weatherArt.frames[overworldWeatherIcon(weather, Math.floor(hour))] : null;
  // Read once a town is mounted, never to remount it.
  const live = useRef({ hour, season, canWalk, town, spots, sceneWeather });
  live.current = { hour, season, canWalk, town, spots, sceneWeather };

  const keepSpot = useCallback(() => {
    const at = apiRef.current?.position();
    if (!at || !settlementId) return;
    saveMutation.mutate({
      chatId,
      spot: {
        settlementId,
        c: Math.max(-1, Math.min(4096, at.tcell ?? -1)),
        x: Math.max(-64, Math.min(128, at.x)),
        y: Math.max(-64, Math.min(128, at.y)),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, settlementId]);

  // A door's words for the Game Master: a home of the party's is told as theirs ("Mara's home, the house on …").
  const doorWords = (door: Hd2dDoor) => {
    const words = homeWordsRef.current.get(door.key);
    if (words) {
      const home = (live.current.town?.homes ?? []).find((each) => each.words === words);
      const owners = home?.owners ?? [];
      const whose =
        owners.length === 0
          ? "the party's"
          : owners.length === 1
            ? `${owners[0]}'s`
            : `${owners.slice(0, -1).join(", ")} and ${owners.at(-1)}'s`;
      return `${whose} home, ${words}`.slice(0, 120);
    }
    return placingRef.current?.spotWords(door.key, door) ?? door.label;
  };

  // ── Homes for sale (fork): an empty house's door offers it, priced by the Engine ──
  const offerHome = (door: Hd2dDoor) => {
    const house = door.house;
    if (!door.empty || !house || !/^p\d+$/.test(door.key) || !live.current.canWalk) return;
    const homes = live.current.town?.homes ?? [];
    if (door.owned || homeWordsRef.current.has(door.key) || homes.some((home) => home.key === door.key)) return;
    // Its words, unique among the party's homes here: "the house on Bell Street", "the second house on …".
    const placing = placingRef.current;
    const where = (placing ? placing.spotWords(door.key, { ...door, empty: false, inn: false, shop: false }) : "a house")
      .replace(/^a house/, "house");
    const ordinals = ["", "second ", "third ", "fourth ", "fifth "];
    const taken = new Set(homes.map((home) => home.words.toLowerCase()));
    const words =
      ordinals.map((each) => `the ${each}${where}`).find((each) => !taken.has(each.toLowerCase())) ?? `the ${where}`;
    const ask = { key: door.key, house, empty: true };
    setForSale({ door: { ...door, house }, words, quote: null, error: null, owners: [] });
    townHomeAsk(chatId, ask).then(
      (quote) =>
        setForSale((now) =>
          now?.door.key === door.key ? { ...now, quote, owners: quote.party?.slice(0, 1) ?? [] } : now,
        ),
      (error) =>
        setForSale((now) =>
          now?.door.key === door.key
            ? { ...now, error: error instanceof Error && error.message ? error.message : t("game.town3d.home.noMoney") }
            : now,
        ),
    );
  };
  const loadHome = (words: string) =>
    townHomeStore(chatId, words).then(
      (store) => setAtHome((now) => (now?.words === words ? { ...now, store, error: null } : now)),
      (error) =>
        setAtHome((now) =>
          now?.words === words
            ? { ...now, error: error instanceof Error && error.message ? error.message : t("game.town3d.home.failed") }
            : now,
        ),
    );
  const openHome = (door: Hd2dDoor) => {
    const words = homeWordsRef.current.get(door.key);
    if (!words || !live.current.canWalk) return;
    setAtHome({ words, door, store: null, error: null });
    void loadHome(words);
  };
  const endHome = (how: "sold" | "left") => {
    if (!atHome) return;
    const { words, door } = atHome;
    endMutation.mutate(
      { chatId, home: words, how, ...(door.house ? { house: door.house } : {}) },
      {
        onSuccess: (res) => {
          setAtHome(null);
          toast.success(
            t(how === "sold" ? "game.town3d.home.sold" : "game.town3d.home.left", { words, price: res.said ?? "" }),
          );
        },
        onError: (error) =>
          toast.error(error instanceof Error && error.message ? error.message : t("game.town3d.home.failed")),
      },
    );
  };
  const moveStack = (id: string, take: boolean) => {
    if (!atHome) return;
    const words = atHome.words;
    storeMutation.mutate(
      { chatId, home: words, id, take },
      {
        onSuccess: () => void loadHome(words),
        onError: (error) =>
          toast.error(error instanceof Error && error.message ? error.message : t("game.town3d.home.failed")),
      },
    );
  };
  const takeHome = (how: "bought" | "rented") => {
    if (!forSale) return;
    const { door, words, owners } = forSale;
    homeMutation.mutate(
      { chatId, key: door.key, house: door.house, empty: true, how, words, ...(owners.length ? { owners } : {}) },
      {
        onSuccess: (res) => {
          setForSale(null);
          toast.success(t(how === "bought" ? "game.town3d.home.bought" : "game.town3d.home.rented", { owner: res.owner, words, price: res.said }));
        },
        onError: (error) =>
          toast.error(
            error instanceof ApiError && error.status === 402
              ? t("game.town3d.home.cannotAfford")
              : error instanceof Error && error.message
                ? error.message
                : t("game.town3d.home.failed"),
          ),
      },
    );
  };

  // ── The town, built once a settlement ──
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !spec || !settlementId) return;
    let cancelled = false;
    let api: Hd2dTownApi | null = null;
    setReady(false);
    setFailed(null);
    void (async () => {
      try {
        (globalThis as { HD2D_ASSETS?: string }).HD2D_ASSETS = ASSETS;
        const [{ mountHd2dTown }, indexLib] = await Promise.all([
          import("../../lib/hd2d/town-scene.js"),
          import("../../lib/hd2d/town-index.js"),
        ]);
        if (cancelled) return;
        // Each home's house: the one bought at its door, else (a home from the start) one of its kind.
        const homes = live.current.town?.homes ?? [];
        const plots = new Map<number, string>();
        for (const home of homes) if (home.key?.startsWith("p")) plots.set(Number(home.key.slice(1)), home.words);
        let earlyIndex: Hd2dTownIndex | null = null;
        const keyless = homes.filter((home) => !home.key);
        if (keyless.length) {
          earlyIndex = indexLib.townIndex(indexLib.g2specOf(spec as unknown as Record<string, unknown>));
          for (const found of indexLib.homeLots(earlyIndex, keyless, chron, [...plots.keys()])) {
            plots.set(found.plot, found.words);
          }
        }
        homeWordsRef.current = new Map([...plots].map(([plot, words]) => [`p${plot}`, words]));
        const sceneChron = plots.size ? { ...(chron ?? {}), owned: [...plots.keys()] } : chron;
        const kept = live.current.spots.find((spot) => spot.settlementId === settlementId);
        api = await mountHd2dTown(host, {
          spec: { ...spec, chron: sceneChron } as unknown as Record<string, unknown>,
          hour: live.current.hour,
          season: live.current.season,
          weather: live.current.sceneWeather,
          clock: false,
          tcell: kept ? kept.c : -1,
          arriveAt: kept ? [Math.floor(kept.x), Math.floor(kept.y)] : null,
          busyText: t("game.town3d.building"),
          debug: true,
          onWhere: (next) => setWhere(next),
          onExit: () => {
            setForSale(null);
            setAtHome(null);
          },
          onEnter: (door) => {
            offerHome(door);
            openHome(door);
            const placing = placingRef.current;
            const walked = walkedRef.current + (apiRef.current?.takeWalked() ?? 0);
            walkedRef.current = 0;
            keepSpot();
            if (!live.current.canWalk) return;
            // Before the world's buildings are placed (the first moments of a town), a door is told by its words.
            const worldId = placing?.byKey.get(door.key);
            visitMutation.mutate(
              worldId
                ? { chatId, to: worldId, walked }
                : { chatId, to: WORLD_TOWN_SPOT, label: doorWords(door), walked },
              {
                onSuccess: () =>
                  toast.success(
                    t("game.town.walked", {
                      name: worldId
                        ? (live.current.town?.buildings.find((each) => each.id === worldId)?.name ?? door.label)
                        : doorWords(door),
                    }),
                  ),
                onError: (error) =>
                  toast.error(error instanceof Error && error.message ? error.message : t("game.town.walkFailed")),
              },
            );
          },
          onSave: () => keepSpot(),
          onReady: () => {
            if (cancelled) return;
            setReady(true);
            // The world's town on the 3D buildings, and the layout for the Game Master, off the first frame.
            window.setTimeout(() => {
              if (cancelled) return;
              try {
                const index =
                  earlyIndex ?? indexLib.townIndex(indexLib.g2specOf(spec as unknown as Record<string, unknown>));
                const { byKey } = indexLib.placeWorldTown(index, live.current.town, sceneChron);
                placingRef.current = { index, byKey, spotWords: (key, info) => indexLib.spotWords(index, key, info) };
                // For the end-to-end check: where the world's buildings stand.
                (window as unknown as { __hd2dPlacing?: unknown }).__hd2dPlacing = { byKey: [...byKey] };
                saveMutation.mutate({
                  chatId,
                  brief: { settlementId, text: indexLib.townBrief(index) },
                  // The town's plan kept as first seen, so its streets never move.
                  ...(live.current.town?.hd2d && !live.current.town.hd2d.kept ? { kept: { settlementId, spec } } : {}),
                });
                keepSpot();
              } catch (error) {
                console.warn("[hd2d] town index", error);
              }
            }, 400);
          },
        });
        if (cancelled) {
          api.dispose();
          return;
        }
        apiRef.current = api;
      } catch (error) {
        console.error("[hd2d] town", error);
        if (!cancelled) setFailed(error instanceof Error ? error.message : String(error));
      }
    })();
    return () => {
      cancelled = true;
      if (apiRef.current) {
        keepSpot();
        apiRef.current.dispose();
      } else api?.dispose();
      apiRef.current = null;
      placingRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey, settlementId]);

  // The hour and season follow the game's clock.
  useEffect(() => {
    apiRef.current?.setHour(hour);
  }, [Math.floor(hour * 4)]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    apiRef.current?.setSeason(season);
  }, [season]);
  useEffect(() => {
    apiRef.current?.setWeather(sceneWeather);
  }, [sceneWeather]);

  // The clock holds while the party walks (a walk's minutes go on the clock with the visit), and the
  // party's spot is kept now and then.
  useEffect(() => {
    if (!ready) return;
    let lastSave = Date.now();
    let moved = 0;
    const timer = window.setInterval(() => {
      const step = apiRef.current?.takeWalked() ?? 0;
      walkedRef.current = Math.min(20000, walkedRef.current + step);
      // A walk about town that goes through no door still takes its time: whole minutes go on the clock as
      // they are walked, and a door visit tells only what is left over.
      const minutes = Math.floor(walkedRef.current / WORLD_TOWN_HD2D_CELLS_PER_MINUTE);
      if (minutes > 0 && !movingRef.current) {
        walkedRef.current -= minutes * WORLD_TOWN_HD2D_CELLS_PER_MINUTE;
        addMinutes(minutes);
      }
      movingRef.current = step > 0.05;
      moved += step;
      if (moved > 0.5 && Date.now() - lastSave > SAVE_EVERY_MS) {
        lastSave = Date.now();
        moved = 0;
        keepSpot();
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [ready, keepSpot, addMinutes]);

  const leave = () => {
    keepSpot();
    // The walk since the last door, on the clock before the party leaves town.
    const walked = walkedRef.current + (apiRef.current?.takeWalked() ?? 0);
    walkedRef.current = 0;
    addMinutes(Math.round(walked / WORLD_TOWN_HD2D_CELLS_PER_MINUTE));
    onLeave();
  };

  return (
    <div
      className="absolute inset-0 z-20 overflow-hidden"
      role="region"
      aria-label={t("game.town.region")}
      data-testid="hd2d-town"
    >
      <style>{SCENE_CSS}</style>
      <div ref={hostRef} className="hd2d-host" />
      <div className="pointer-events-none absolute left-3 top-14 z-10 flex max-w-[45%] flex-col items-start gap-1">
        <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/65 px-3 py-1.5 shadow-lg backdrop-blur-md">
          <span className="truncate text-sm font-semibold text-white">{settlement?.name ?? ""}</span>
          {where?.quarter && (
            <span className="truncate text-xs text-white/60">
              {where.quarter}
              {where.trade ? `, ${where.trade}` : ""}
            </span>
          )}
          {!ready && !failed && <Loader2 size={13} className="animate-spin text-white/60" />}
        </div>
        {weatherArt && weather && weatherIcon && (
          <div
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/65 py-0.5 pl-1 pr-2.5 text-xs font-semibold text-white/85 shadow-lg backdrop-blur-md"
            data-component="Hd2dTownView.Weather"
            role="status"
          >
            <span
              aria-hidden
              className="block shrink-0"
              style={{
                width: weatherIcon[2] * 2,
                height: weatherIcon[3] * 2,
                backgroundImage: `url(${weatherArt.image.src})`,
                backgroundPosition: `${-weatherIcon[0] * 2}px ${-weatherIcon[1] * 2}px`,
                backgroundSize: `${weatherArt.image.naturalWidth * 2}px ${weatherArt.image.naturalHeight * 2}px`,
                imageRendering: "pixelated",
              }}
            />
            {t(`game.combat.weather.type.${weather}`)}
          </div>
        )}
        {ready && (
          <div className="rounded-md bg-black/50 px-2 py-1 text-[0.6875rem] text-white/75 max-sm:hidden">
            {t("game.town3d.help")}
          </div>
        )}
      </div>
      <div className="pointer-events-auto absolute right-3 top-14 z-10">
        <button
          type="button"
          onClick={leave}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/15 bg-black/65 px-3 py-1.5 text-xs font-semibold text-white/85 shadow-lg backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white max-sm:px-2"
        >
          <ArrowLeft size={13} />
          {t("game.town.leave")}
        </button>
      </div>
      {atHome && (
        <div
          className="pointer-events-auto absolute bottom-16 left-1/2 z-20 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-emerald-200/25 bg-black/80 p-3 text-white shadow-2xl backdrop-blur-md"
          data-component="Hd2dTownView.Home"
          role="dialog"
          aria-label={t("game.town3d.home.home")}
        >
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-emerald-200/90">
            {t("game.town3d.home.home")}
          </div>
          <div className="mt-0.5 text-sm font-semibold first-letter:uppercase">{atHome.words}</div>
          <p className="mt-0.5 text-xs text-white/55">{t("game.town3d.home.rest")}</p>
          {atHome.error ? (
            <p className="mt-1.5 text-xs text-white/70">{atHome.error}</p>
          ) : !atHome.store ? (
            <Loader2 size={14} className="mt-2 animate-spin text-white/60" />
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  ["kept", atHome.store.kept, true],
                  ["carried", atHome.store.carried, false],
                ] as const
              ).map(([which, list, take]) => (
                <div key={which} className="min-w-0">
                  <div className="mb-1 font-semibold text-white/70">{t(`game.town3d.home.${which}`)}</div>
                  <ul className="max-h-36 space-y-0.5 overflow-y-auto pr-1">
                    {list.length === 0 && <li className="text-white/40">{t("game.town3d.home.nothing")}</li>}
                    {list.map((stack) => (
                      <li key={stack.id} className="flex items-center gap-1">
                        <span className="min-w-0 flex-1 truncate" title={stack.name}>
                          {stack.quantity > 1 ? `${stack.quantity} ` : ""}
                          {stack.name}
                        </span>
                        <button
                          type="button"
                          disabled={storeMutation.isPending}
                          onClick={() => moveStack(stack.id, take)}
                          className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[0.6875rem] hover:bg-white/20 disabled:opacity-40"
                        >
                          {t(take ? "game.town3d.home.take" : "game.town3d.home.leave")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            {atHome.store && (
              <button
                type="button"
                disabled={endMutation.isPending}
                onClick={() => endHome(atHome.store!.home.how === "rented" ? "left" : "sold")}
                className="rounded-md bg-white/10 px-2.5 py-1 text-xs transition-colors hover:bg-white/20 disabled:opacity-40"
              >
                {t(atHome.store.home.how === "rented" ? "game.town3d.home.giveUp" : "game.town3d.home.sell")}
              </button>
            )}
            <button
              type="button"
              onClick={() => setAtHome(null)}
              className="ml-auto rounded-md px-2 py-1 text-xs text-white/65 transition-colors hover:bg-white/10 hover:text-white"
            >
              {t("game.town3d.home.close")}
            </button>
          </div>
        </div>
      )}
      {forSale && (
        <div
          className="pointer-events-auto absolute bottom-16 left-1/2 z-20 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-amber-200/25 bg-black/80 p-3 text-white shadow-2xl backdrop-blur-md"
          data-component="Hd2dTownView.ForSale"
          role="dialog"
          aria-label={t("game.town3d.home.forSale")}
        >
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-amber-200/90">
            {t("game.town3d.home.forSale")}
          </div>
          <div className="mt-0.5 text-sm font-semibold first-letter:uppercase">{forSale.words}</div>
          {forSale.error ? (
            <p className="mt-1.5 text-xs text-white/70">{forSale.error}</p>
          ) : !forSale.quote ? (
            <Loader2 size={14} className="mt-2 animate-spin text-white/60" />
          ) : forSale.quote.owned ? (
            <p className="mt-1.5 text-xs text-white/70">{t("game.town3d.home.owned")}</p>
          ) : (
            <>
              <p className="mt-1.5 text-xs text-white/85">
                {t("game.town3d.home.asking", { price: forSale.quote.priceSaid, rent: forSale.quote.rentSaid })}
              </p>
              <p className="mt-0.5 text-xs text-white/55">{t("game.town3d.home.purse", { purse: forSale.quote.purseSaid })}</p>
              {(forSale.quote.party?.length ?? 0) > 1 && (
                <fieldset className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs" data-component="Hd2dTownView.Owners">
                  <legend className="mb-0.5 text-white/60">{t("game.town3d.home.owners")}</legend>
                  {forSale.quote.party!.map((name) => (
                    <label key={name} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={forSale.owners.includes(name)}
                        onChange={(event) =>
                          setForSale((now) =>
                            now
                              ? {
                                  ...now,
                                  owners: event.target.checked
                                    ? [...now.owners, name]
                                    : now.owners.length > 1
                                      ? now.owners.filter((each) => each !== name)
                                      : now.owners,
                                }
                              : now,
                          )
                        }
                      />
                      {name}
                    </label>
                  ))}
                </fieldset>
              )}
            </>
          )}
          <div className="mt-2.5 flex gap-2">
            {forSale.quote && !forSale.quote.owned && !forSale.error && (
              <>
                <button
                  type="button"
                  disabled={homeMutation.isPending || forSale.quote.purse < forSale.quote.price}
                  title={forSale.quote.purse < forSale.quote.price ? t("game.town3d.home.cannotAfford") : undefined}
                  onClick={() => takeHome("bought")}
                  className="rounded-md bg-amber-500/85 px-3 py-1 text-xs font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("game.town3d.home.buy")}
                </button>
                <button
                  type="button"
                  disabled={homeMutation.isPending || forSale.quote.purse < forSale.quote.rent}
                  title={forSale.quote.purse < forSale.quote.rent ? t("game.town3d.home.cannotAfford") : undefined}
                  onClick={() => takeHome("rented")}
                  className="rounded-md bg-white/15 px-3 py-1 text-xs font-semibold transition-colors hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("game.town3d.home.rent")}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setForSale(null)}
              className="ml-auto rounded-md px-2 py-1 text-xs text-white/65 transition-colors hover:bg-white/10 hover:text-white"
            >
              {t("game.town3d.home.notNow")}
            </button>
          </div>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/80 p-6 text-center text-sm text-white/80">
          <div>
            <p>{t("game.town3d.failed")}</p>
            <p className="mt-1 text-xs text-white/50">{failed}</p>
            <button type="button" onClick={onLeave} className="mt-3 rounded-md bg-white/10 px-3 py-1 hover:bg-white/20">
              {t("game.town.leave")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
