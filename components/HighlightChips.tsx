"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getRandomChips, type Chip, type VisitTypeKey } from "@/config/chips";

interface HighlightChipsProps {
  lang: Lang;
  visitType: VisitTypeKey;
  rating: number;
  customChipsData?: string[];
  onContinue: (ids: string[], labels: string[]) => void;
}

const CHIPS_TO_SHOW = 6;
const MAX_SELECT = 4;

export default function HighlightChips({
  lang,
  visitType,
  rating: _rating,
  customChipsData,
  onContinue,
}: HighlightChipsProps) {
  // Randomly pick CHIPS_TO_SHOW chips fresh on every mount
  const chips = useMemo<Chip[]>(() => {
    if (customChipsData && customChipsData.length > 0) {
      const all = customChipsData.map((c, i) => ({ id: `custom_${i}`, en: c, hi: c }));
      // Shuffle and slice
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      return all.slice(0, CHIPS_TO_SHOW);
    }
    return getRandomChips(visitType, CHIPS_TO_SHOW);
  // Deliberately omitting rating/visitType from deps so chips only regenerate on component remount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleChip(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECT) {
        next.add(id);
      }
      return next;
    });
  }

  const canContinue = selected.size >= 1;

  function handleContinue() {
    if (!canContinue) return;
    const selectedChips = chips.filter((c) => selected.has(c.id));
    const labels = selectedChips.map((c) => (lang === "hi" ? c.hi : c.en));
    onContinue(Array.from(selected), labels);
  }

  return (
    <div className="chips-screen">
      <h1 className="screen-title">{t("chips.title", lang)}</h1>
      <p className="screen-subtitle">{t("chips.subtitle", lang)}</p>

      <div className="chips-wrap">
        {chips.map((chip: Chip) => (
          <button
            key={chip.id}
            id={`chip-${chip.id}`}
            className={`chip ${selected.has(chip.id) ? "chip-selected" : ""}`}
            onClick={() => toggleChip(chip.id)}
            aria-pressed={selected.has(chip.id)}
          >
            {selected.has(chip.id) && (
              <svg className="chip-check" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
              </svg>
            )}
            {lang === "hi" ? chip.hi : chip.en}
          </button>
        ))}
      </div>

      {!canContinue && (
        <p className="chips-hint">{t("chips.hint", lang)}</p>
      )}

      <div className="chips-footer">
        <button
          id="chips-continue"
          className={`continue-btn ${canContinue ? "continue-btn-active" : "continue-btn-disabled"}`}
          onClick={handleContinue}
          disabled={!canContinue}
          aria-disabled={!canContinue}
        >
          {t("chips.continue", lang)}
          {canContinue && <span className="continue-count">{selected.size}</span>}
        </button>
      </div>
    </div>
  );
}
