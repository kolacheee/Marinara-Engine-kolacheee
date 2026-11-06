// ──────────────────────────────────────────────
// UI overhaul: the Classic half of a card's Game Mode section (owner's pick 2026-11-05, mockup "Card B")
//
// Classic stats are rolled fresh for every game, so the card holds no numbers: only the starting
// tree (or Auto, read from the game card) and up to two stats the character is strong in and one
// they are weak in, which lean the hidden growth. The story stats for games without Classic sit
// folded below.
// ──────────────────────────────────────────────
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  MARINARA_ARCHETYPES,
  MARINARA_ARCHETYPE_BASES,
  MARINARA_ARCHETYPE_ROWS,
  MARINARA_CLASSIC_STRONG_PICKS,
  MARINARA_STATS,
  marinaraArchetypeInText,
  marinaraBaseClass,
  marinaraFightHpMultiplier,
  marinaraMaxMp,
  marinaraMaxStamina,
  readMarinaraCardClassic,
  type MarinaraArchetype,
  type MarinaraCardClassic,
  type MarinaraStat,
} from "@marinara-engine/shared";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import "../../styles/classic-card.css";

export function ClassicCardSection({
  value,
  onChange,
  description,
  storyStats,
  storyOpen = false,
}: {
  /** What the card stores (extensions.classic, or personaStats.classic). */
  value: unknown;
  /** Called with undefined once nothing is picked, so the card stores no empty record. */
  onChange: (next: MarinaraCardClassic | undefined) => void;
  /** The card text an Auto starting tree is read from. */
  description: string;
  /** The story-stat editor for games without Classic, folded below. A persona leaves it out: its
   *  tracker bars count in every game, so its sheet stays open under this section. */
  storyStats?: ReactNode;
  storyOpen?: boolean;
}) {
  const { t } = useTranslation();
  const classic = readMarinaraCardClassic(value) ?? {};
  const [showStory, setShowStory] = useState(storyOpen);
  const guessed = marinaraArchetypeInText(description);
  const tree: MarinaraArchetype = classic.tree ?? guessed ?? "blade";
  const strong = classic.strong ?? [];
  const save = (next: MarinaraCardClassic) => onChange(readMarinaraCardClassic(next));
  const treeName = (one: MarinaraArchetype) => t(`game.combat.marinara.archetype.${one}`);
  const statName = (stat: MarinaraStat) => t(`game.combat.marinara.card.statName.${stat}`);

  const toggleStrong = (stat: MarinaraStat) => {
    let next = strong.includes(stat) ? strong.filter((one) => one !== stat) : [...strong, stat];
    // A third pick replaces the oldest, so a tap always does what it shows.
    if (next.length > MARINARA_CLASSIC_STRONG_PICKS) next = next.slice(next.length - MARINARA_CLASSIC_STRONG_PICKS);
    save({ ...classic, strong: next, ...(classic.weak === stat ? { weak: undefined } : {}) });
  };
  const toggleWeak = (stat: MarinaraStat) =>
    save({
      ...classic,
      weak: classic.weak === stat ? undefined : stat,
      strong: strong.filter((one) => one !== stat),
    });

  // What a new game starts them as: the base class of the tree at level 1, before any growth.
  const start = MARINARA_ARCHETYPE_BASES[tree].start;
  const preview: Array<[string, number]> = [
    [t("game.combat.marinara.stat.hp"), Math.round(start.hp * marinaraFightHpMultiplier(1))],
    ...MARINARA_STATS.filter((stat) => stat !== "hp").map(
      (stat) => [t(`game.combat.marinara.stat.${stat}`), start[stat]] as [string, number],
    ),
    [t("game.combat.marinara.sheet.resource.mp"), marinaraMaxMp(start)],
    [t("game.combat.marinara.sheet.resource.stamina"), marinaraMaxStamina(start)],
  ];

  return (
    <div className="ov-classic" data-component="ClassicCardSection">
      <div className="ov-sheet__eyebrow">
        <span>{t("game.combat.marinara.card.title")}</span>
        <small>· {t("game.combat.marinara.card.note")}</small>
      </div>

      <div className="ov-classic__field">
        <div className="ov-classic__label">{t("game.combat.marinara.card.tree")}</div>
        <div className="ov-classic__trees" role="radiogroup" aria-label={t("game.combat.marinara.card.tree")}>
          <button
            type="button"
            role="radio"
            aria-checked={!classic.tree}
            className="ov-classic__tree is-auto"
            onClick={() => save({ ...classic, tree: undefined })}
          >
            <b>{t("game.combat.marinara.card.auto")}</b>
            <small>
              {guessed
                ? t("game.combat.marinara.card.autoGuess", { tree: treeName(guessed) })
                : t("game.combat.marinara.card.autoNone", { tree: treeName("blade") })}
            </small>
          </button>
          {MARINARA_ARCHETYPES.map((one) => (
            <button
              key={one}
              type="button"
              role="radio"
              aria-checked={classic.tree === one}
              className="ov-classic__tree"
              onClick={() => save({ ...classic, tree: one })}
            >
              <b>{treeName(one)}</b>
              <small>{t(`game.combat.marinara.card.role.${one}`)}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="ov-classic__field">
        <div className="ov-classic__label">
          <span>{t("game.combat.marinara.card.strong")}</span>
          <small>{t("game.combat.marinara.card.strongHint", { count: MARINARA_CLASSIC_STRONG_PICKS })}</small>
        </div>
        <div className="ov-classic__picks">
          {MARINARA_STATS.map((stat) => (
            <button
              key={stat}
              type="button"
              aria-pressed={strong.includes(stat)}
              className="ov-classic__pick"
              onClick={() => toggleStrong(stat)}
            >
              {statName(stat)}
            </button>
          ))}
        </div>
      </div>

      <div className="ov-classic__field">
        <div className="ov-classic__label">
          <span>{t("game.combat.marinara.card.weak")}</span>
          <small>{t("game.combat.marinara.card.weakHint")}</small>
        </div>
        <div className="ov-classic__picks">
          {MARINARA_STATS.map((stat) => (
            <button
              key={stat}
              type="button"
              aria-pressed={classic.weak === stat}
              className="ov-classic__pick is-weak"
              onClick={() => toggleWeak(stat)}
            >
              {statName(stat)}
            </button>
          ))}
        </div>
        <p className="ov-classic__help">{t("game.combat.marinara.card.help")}</p>
      </div>

      <div className="ov-classic__preview">
        <div className="ov-classic__label">
          <span>{t("game.combat.marinara.card.preview")}</span>
          <small>
            {t("game.combat.marinara.card.previewClass", {
              name: marinaraBaseClass(tree).label,
              row: t(`game.combat.marinara.row.${MARINARA_ARCHETYPE_ROWS[tree]}`),
            })}
          </small>
        </div>
        <div className="ov-classic__line">
          {preview.map(([label, amount]) => (
            <span key={label}>
              <small>{label}</small>
              {amount}
            </span>
          ))}
        </div>
      </div>

      {storyStats ? (
        <button
          type="button"
          className={cn("ov-classic__fold", showStory && "is-open")}
          aria-expanded={showStory}
          onClick={() => setShowStory((open) => !open)}
        >
          <span>{t("game.combat.marinara.card.story")}</span>
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      ) : null}
      {storyStats && showStory ? <div className="ov-classic__story">{storyStats}</div> : null}
    </div>
  );
}
