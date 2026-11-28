import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  BACKGROUND_TIME_VERSIONS,
  BACKGROUND_WEATHER_VERSIONS,
  parseBackgroundWeatherVersionName,
  type BackgroundTimeOfDay,
} from "@marinara-engine/shared";
import { api } from "../../lib/api-client";
import { cn } from "../../lib/utils";
import { useChatStore } from "../../stores/chat.store";
import { useUIStore } from "../../stores/ui.store";
import { SETTINGS_BUTTON_CLASS } from "../../components/panels/settings/SettingControls";
import { Select } from "../../components/ui/Select";

const FIELD_CLASS =
  "w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[0.6875rem] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)]/50 max-sm:!text-base";

const WEATHER_CHOICES = ["clear", ...BACKGROUND_WEATHER_VERSIONS] as const;
type WeatherChoice = "" | (typeof WEATHER_CHOICES)[number];
type TimeChoice = "" | BackgroundTimeOfDay;

/** The parts of a background name that this picker can show again ("" for anything else). */
function shownParts(background: string): { weather: WeatherChoice; time: TimeChoice } {
  const { version, time } = parseBackgroundWeatherVersionName(background);
  return {
    weather: (WEATHER_CHOICES as readonly string[]).includes(version) ? (version as WeatherChoice) : "",
    time,
  };
}

/**
 * Make a weather and/or time of day version of the chat's current background by hand, without
 * waiting for the Illustrator: the story starts in the bedroom at night in the rain, and the only
 * bedroom picture is a daytime one. A version made before is shown at once instead of made again.
 */
export function MakeBackgroundVersion({ chatId, background }: { chatId: string; background: string }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const debugMode = useUIStore((state) => state.debugMode);
  const [weather, setWeather] = useState<WeatherChoice>(() => shownParts(background).weather);
  const [time, setTime] = useState<TimeChoice>(() => shownParts(background).time);
  const [making, setMaking] = useState(false);

  // Start from what the chat shows now whenever the background changes.
  useEffect(() => {
    const parts = shownParts(background);
    setWeather(parts.weather);
    setTime(parts.time);
  }, [background]);

  const unchanged = (() => {
    const parts = shownParts(background);
    return parts.weather === weather && parts.time === time;
  })();

  const make = async () => {
    setMaking(true);
    try {
      const result = await api.post<{ filename: string; shown?: boolean; existed?: boolean }>(
        "/backgrounds/weather-art/remake",
        { chatId, part: "version", weather, time, debugMode },
      );
      if (result.shown !== false && useChatStore.getState().activeChatId === chatId) {
        const url = result.filename.startsWith("/")
          ? result.filename
          : `/api/backgrounds/file/${encodeURIComponent(result.filename)}?v=${Date.now()}`;
        useUIStore.getState().setChatBackground(url);
      }
      qc.invalidateQueries({ queryKey: ["chats"] });
      qc.invalidateQueries({ queryKey: ["backgrounds"] });
      toast.success(
        t(
          result.shown === false
            ? "chat.settings.makeVersion.doneNotShown"
            : result.existed
              ? "chat.settings.makeVersion.shownExisting"
              : "chat.settings.makeVersion.done",
        ),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setMaking(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 border-t border-[var(--border)] pt-2" data-testid="make-background-version">
      <span className="text-[0.6875rem] font-medium text-[var(--foreground)]">
        {t("chat.settings.makeVersion.title")}
      </span>
      <div className="grid grid-cols-2 gap-1.5">
        <Select<WeatherChoice>
          value={weather}
          options={[
            { value: "", label: t("chat.settings.makeVersion.asPainted") },
            ...WEATHER_CHOICES.map((choice) => ({
              value: choice as WeatherChoice,
              label: t(`chat.settings.makeVersion.weather.${choice}`),
            })),
          ]}
          onChange={setWeather}
          label={t("chat.settings.makeVersion.weatherLabel")}
          className={FIELD_CLASS}
          disabled={making}
        />
        <Select<TimeChoice>
          value={time}
          options={[
            { value: "", label: t("chat.settings.makeVersion.asPainted") },
            ...BACKGROUND_TIME_VERSIONS.map((choice) => ({
              value: choice as TimeChoice,
              label: t(`chat.settings.makeVersion.time.${choice}`),
            })),
          ]}
          onChange={setTime}
          label={t("chat.settings.makeVersion.timeLabel")}
          className={FIELD_CLASS}
          disabled={making}
        />
      </div>
      <button
        type="button"
        disabled={making || unchanged}
        onClick={() => void make()}
        className={cn(SETTINGS_BUTTON_CLASS, "w-full")}
      >
        {making ? t("chat.settings.makeVersion.making") : t("chat.settings.makeVersion.make")}
      </button>
      <span className="text-[0.625rem] leading-snug text-[var(--muted-foreground)]">
        {t("chat.settings.makeVersion.help")}
      </span>
    </div>
  );
}
