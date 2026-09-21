"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getChips, type Chip } from "@/config/chips";
import type { VisitTypeKey } from "@/config/chips";

interface HighlightChipsProps {
  lang: Lang;
  visitType: VisitTypeKey;
  rating: number;
  customChipsData?: string[];
  onContinue: (selected: string[], labels: string[]) => void;
}

const MAX_SELECT = 4;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HighlightChips({ lang, visitType, rating, customChipsData, onContinue }: HighlightChipsProps) {
  // Chips are shuffled once on mount using useMemo
  const chips = useMemo<Chip[]>(() => {
    let raw: Chip[] = [];
    if (customChipsData && customChipsData.length > 0) {
      raw = customChipsData.map((c, i) => ({ id: `custom_${i}`, en: c, hi: c }));
    } else {
      raw = getChips(visitType, rating);
    }
    return shuffleArray(raw);
  }, [visitType, rating, customChipsData]);

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
    // Pass both IDs (for tracking) and human-readable labels (for the prompt)
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

      {/* Hint */}
      {!canContinue && (
        <p className="chips-hint">{t("chips.hint", lang)}</p>
      )}

      {/* Sticky Continue */}
      <div className="chips-footer">
        <button
          id="chips-continue"
          className={`continue-btn ${canContinue ? "continue-btn-active" : "continue-btn-disabled"}`}
          onClick={handleContinue}
          disabled={!canContinue}
          aria-disabled={!canContinue}
        >
          {t("chips.continue", lang)}
          {canContinue && (
            <span className="continue-count">{selected.size}</span>
          )}
        </button>
      </div>
    </div>
  );
}
