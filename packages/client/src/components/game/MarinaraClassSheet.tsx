// A party member's Classic Marinara class, between fights (combat overhaul): level, XP, stats, the
// classes their two trees open, and the skills they carry from other classes.
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  MARINARA_ARCHETYPE_TRAITS,
  MARINARA_CARRY_SLOTS,
  MARINARA_STATS,
  MARINARA_XP_PER_LEVEL,
  MARINARA_ACCESSORY_SLOTS,
  marinaraBelowStandard,
  marinaraCanEquip,
  marinaraClass,
  marinaraClassBlock,
  marinaraGameItemPlace,
  marinaraItemName,
  marinaraOwnedGear,
  marinaraStandardEquipment,
  marinaraTierForLevel,
  normalizeGameInventoryStacks,
  type MarinaraEquipment,
  marinaraLearnedSkills,
  marinaraOpenClasses,
  marinaraSecondaryFits,
  marinaraTrees,
  readMarinaraCardProgression,
  MARINARA_PROMOTION_LEVEL,
} from "@marinara-engine/shared";
import { api } from "../../lib/api-client";
import { chatKeys, useChat } from "../../hooks/use-chats";

const blockKey = (block: string) => block.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

type Props = { chatId: string; name: string; stored: unknown };

export function MarinaraClassSheet({ chatId, name, stored }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: chat } = useChat(chatId);
  const progression = readMarinaraCardProgression(stored);
  if (!progression)
    return <p className="text-xs text-[var(--muted-foreground)]">{t("game.combat.marinara.sheet.none")}</p>;
  const active = marinaraClass(progression.activeClass);
  const trees = marinaraTrees(progression.primary, progression.temperament);
  // A tree trait the active class already keeps (Cover, Hold the Line for a Guard line) needs no slot.
  const kept = active ? (MARINARA_ARCHETYPE_TRAITS[active.archetype] ?? []) : [];
  // What a promotion still needs, for the class-level refusal: "needs Bloodsworn 20 (now 19)".
  const blockParams = (def: { from?: string; tier: string }) =>
    def.from
      ? {
          parent: marinaraClass(def.from)?.label ?? def.from,
          needed: MARINARA_PROMOTION_LEVEL[def.tier as "advanced" | "master"] ?? 0,
          level: progression.classLevels[def.from] ?? 0,
        }
      : {};
  const learned = marinaraLearnedSkills(progression).filter(
    (skill) =>
      skill.classId !== progression.activeClass &&
      !(kept.includes(skill.id) && marinaraClass(skill.classId)?.archetype === active?.archetype),
  );
  const save = async (change: { classId?: string; carried?: string[]; equipment?: MarinaraEquipment }) => {
    setBusy(true);
    try {
      const result = await api.post<{ dropped?: string[] }>("/game/combat/director/marinara/progression", {
        chatId,
        name,
        ...change,
      });
      await qc.invalidateQueries({ queryKey: chatKeys.detail(chatId) });
      // Say what a class change or carry change took away (playtest 2026-11-01).
      if (result?.dropped?.length)
        toast.warning(t("game.combat.marinara.sheet.dropped", { skills: result.dropped.join(", ") }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("game.combat.marinara.sheet.failed"));
    } finally {
      setBusy(false);
    }
  };
  const toggleCarry = (id: string) => {
    const carried = progression.carried.includes(id)
      ? progression.carried.filter((one) => one !== id)
      : [...progression.carried, id];
    if (carried.length > MARINARA_CARRY_SLOTS) {
      toast.error(t("game.combat.marinara.sheet.carryFull", { count: MARINARA_CARRY_SLOTS }));
      return;
    }
    void save({ carried });
  };
  // Gear from the party's bags that this class can use, by its name in the game's setting.
  const metadata = (chat?.metadata ?? {}) as Record<string, unknown>;
  const place = marinaraGameItemPlace(metadata);
  const owned = marinaraOwnedGear(normalizeGameInventoryStacks(metadata.gameInventory), place);
  const equipment = progression.equipment ?? {};
  // An empty weapon or armour slot fights with the class's standard piece for their tier; a piece worth
  // less than it is marked, so a looted dagger isn't worn by mistake (items playtest I1).
  const archetype = marinaraClass(progression.activeClass)?.archetype ?? progression.primary;
  const tier = marinaraTierForLevel(progression.level);
  const standard = marinaraStandardEquipment(archetype, tier);
  const options = (slot: "weapon" | "armor" | "accessory", current: string | undefined) => {
    const ids = owned
      .filter((gear) => gear.slot === slot && marinaraCanEquip(progression.activeClass, gear.id, slot))
      .map((gear) => gear.id);
    return current && !ids.includes(current) ? [current, ...ids] : ids;
  };
  const wear = (next: MarinaraEquipment) => {
    const accessories = (next.accessories ?? []).filter(Boolean);
    void save({
      equipment: {
        ...(next.weapon ? { weapon: next.weapon } : {}),
        ...(next.armor ? { armor: next.armor } : {}),
        ...(accessories.length ? { accessories } : {}),
      },
    });
  };
  const slotSelect = (
    label: string,
    value: string | undefined,
    ids: string[],
    pick: (id: string) => void,
    slot?: "weapon" | "armor",
  ) => (
    <label key={label} className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[var(--muted-foreground)]">{label}</span>
      <select
        className="min-h-9 min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--secondary)] px-2"
        value={value ?? ""}
        disabled={busy}
        onChange={(event) => pick(event.target.value)}
      >
        <option value="">
          {slot && standard[slot]
            ? t("game.combat.marinara.sheet.gearStandardPiece", { name: marinaraItemName(standard[slot]!, place) })
            : t("game.combat.marinara.sheet.gearNothing")}
        </option>
        {ids.map((id) => (
          <option key={id} value={id}>
            {slot && marinaraBelowStandard(id, slot, archetype, tier, progression.stats.strength)
              ? t("game.combat.marinara.sheet.gearBelowStandard", { name: marinaraItemName(id, place) })
              : marinaraItemName(id, place)}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="space-y-3 text-xs" data-testid="marinara-class-sheet">
      <div>
        <p className="text-sm font-semibold">
          {active?.label ?? progression.activeClass} · {t("game.combat.marinara.level", { level: progression.level })}
          {progression.fallen ? [" · ", t("game.combat.marinara.sheet.fallen")].join("") : ""}
        </p>
        <p className="text-[var(--muted-foreground)]">
          {t("game.combat.marinara.sheet.xp", { xp: progression.xp, next: MARINARA_XP_PER_LEVEL })} ·{" "}
          {t("game.combat.marinara.sheet.classLevel", {
            level: progression.classLevels[progression.activeClass] ?? 1,
          })}{" "}
          ·{" "}
          {trees.pure
            ? t("game.combat.marinara.sheet.pure", {
                tree: t(`game.combat.marinara.archetype.${trees.primary}`),
              })
            : t("game.combat.marinara.sheet.trees", {
                primary: t(`game.combat.marinara.archetype.${trees.primary}`),
                secondary: t(`game.combat.marinara.archetype.${trees.secondary}`),
              })}
        </p>
        {!progression.fallen && marinaraSecondaryFits(progression).length > 0 && (
          <div className="mt-1 text-[var(--muted-foreground)]">
            <p className="font-medium">{t("game.combat.marinara.sheet.secondaryFits")}</p>
            <ul className="list-disc pl-4">
              {marinaraSecondaryFits(progression).map((fit) => (
                <li key={fit.skillId}>
                  {t("game.combat.marinara.sheet.secondaryFit", {
                    skill: fit.label,
                    className: fit.classLabel,
                    level: fit.learnedAt,
                    reason: fit.reason,
                  })}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <dl className="grid grid-cols-4 gap-1 tabular-nums">
        {MARINARA_STATS.map((stat) => (
          <div key={stat} className="rounded border border-[var(--border)] px-1.5 py-0.5">
            <dt className="text-[var(--muted-foreground)]">{t(`game.combat.marinara.stat.${stat}`)}</dt>
            <dd className="font-semibold">{Math.round(progression.stats[stat])}</dd>
          </div>
        ))}
      </dl>
      {!progression.fallen && (
        <>
          <div>
            <p className="mb-1 font-medium">{t("game.combat.marinara.sheet.classes")}</p>
            <div className="flex flex-wrap gap-1">
              {marinaraOpenClasses(progression).map((def) => {
                const block = marinaraClassBlock(progression, def.id);
                const current = def.id === progression.activeClass;
                const trained = progression.classLevels[def.id];
                return (
                  <button
                    key={def.id}
                    type="button"
                    disabled={busy || current || !!block}
                    title={
                      block
                        ? t(`game.combat.marinara.sheet.block.${blockKey(block)}`, {
                            defaultValue: block,
                            ...blockParams(def),
                          })
                        : def.role
                    }
                    onClick={() => void save({ classId: def.id })}
                    className={
                      "min-h-9 rounded-md border px-2 py-1 text-left disabled:opacity-60 " +
                      (current
                        ? "border-[var(--primary)]"
                        : !block && def.from && trained === undefined
                          ? "border-[var(--primary)] bg-[var(--primary)]/10"
                          : "border-[var(--border)] bg-[var(--secondary)]")
                    }
                  >
                    <span className="font-medium">{def.label}</span>
                    <span className="ml-1 text-[var(--muted-foreground)]">
                      {trained !== undefined
                        ? t("game.combat.marinara.sheet.classLevel", { level: trained })
                        : block
                          ? t(`game.combat.marinara.sheet.block.${blockKey(block)}`, {
                              defaultValue: block,
                              ...blockParams(def),
                            })
                          : def.from
                            ? t("game.combat.marinara.sheet.promotionOpen")
                            : t(`game.combat.marinara.sheet.tier.${def.tier}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1" data-testid="marinara-gear">
            <p className="font-medium">{t("game.combat.marinara.sheet.gear")}</p>
            <p className="text-[var(--muted-foreground)]">{t("game.combat.marinara.sheet.gearStandard")}</p>
            {slotSelect(
              t("game.combat.marinara.sheet.slot.weapon"),
              equipment.weapon,
              options("weapon", equipment.weapon),
              (id) => wear({ ...equipment, weapon: id || undefined }),
              "weapon",
            )}
            {slotSelect(
              t("game.combat.marinara.sheet.slot.armor"),
              equipment.armor,
              options("armor", equipment.armor),
              (id) => wear({ ...equipment, armor: id || undefined }),
              "armor",
            )}
            {Array.from({ length: MARINARA_ACCESSORY_SLOTS }, (_, n) => {
              const current = equipment.accessories?.[n];
              return slotSelect(
                t("game.combat.marinara.sheet.slot.accessory", { n: n + 1 }),
                current,
                options("accessory", current),
                (id) => {
                  const accessories = [...(equipment.accessories ?? [])];
                  accessories[n] = id;
                  wear({ ...equipment, accessories });
                },
              );
            })}
          </div>
          <div>
            <p className="mb-1 font-medium">
              {t("game.combat.marinara.sheet.carried", {
                count: progression.carried.length,
                max: MARINARA_CARRY_SLOTS,
              })}
            </p>
            {learned.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">{t("game.combat.marinara.sheet.nothingToCarry")}</p>
            ) : (
              <ul className="space-y-1">
                {learned.map((skill) => (
                  <li key={skill.id}>
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 accent-[var(--primary)]"
                        checked={progression.carried.includes(skill.id)}
                        disabled={busy}
                        onChange={() => toggleCarry(skill.id)}
                      />
                      <span>
                        <span className="font-medium">{skill.label}</span>{" "}
                        <span className="text-[var(--muted-foreground)]">
                          ({marinaraClass(skill.classId)?.label}) {skill.summary}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
