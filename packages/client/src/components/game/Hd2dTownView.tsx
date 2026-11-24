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
import { useOverworld, useTown, useTownHd2dSave, useTownVisit } from "../../hooks/use-game";
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
  const specKey = spec ? JSON.stringify(spec) + JSON.stringify(chron) : "";
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
        const kept = live.current.spots.find((spot) => spot.settlementId === settlementId);
        api = await mountHd2dTown(host, {
          spec: { ...spec, chron } as unknown as Record<string, unknown>,
          hour: live.current.hour,
          season: live.current.season,
          weather: live.current.sceneWeather,
          clock: false,
          tcell: kept ? kept.c : -1,
          arriveAt: kept ? [Math.floor(kept.x), Math.floor(kept.y)] : null,
          busyText: t("game.town3d.building"),
          debug: true,
          onWhere: (next) => setWhere(next),
          onEnter: (door) => {
            const placing = placingRef.current;
            const walked = walkedRef.current + (apiRef.current?.takeWalked() ?? 0);
            walkedRef.current = 0;
            keepSpot();
            if (!placing || !live.current.canWalk) return;
            const worldId = placing.byKey.get(door.key);
            visitMutation.mutate(
              worldId
                ? { chatId, to: worldId, walked }
                : { chatId, to: WORLD_TOWN_SPOT, label: placing.spotWords(door.key, door), walked },
              {
                onSuccess: () =>
                  toast.success(
                    t("game.town.walked", {
                      name: worldId
                        ? (live.current.town?.buildings.find((each) => each.id === worldId)?.name ?? door.label)
                        : placing.spotWords(door.key, door),
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
                const index = indexLib.townIndex(indexLib.g2specOf(spec as unknown as Record<string, unknown>));
                const { byKey } = indexLib.placeWorldTown(index, live.current.town, chron);
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
