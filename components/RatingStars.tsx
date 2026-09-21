"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { STORE_CONFIG } from "@/config/store";

interface RatingStarsProps {
  lang: Lang;
  onSelect: (rating: number) => void;
}

const STAR_LABELS: Record<number, "rating.1" | "rating.2" | "rating.3" | "rating.4" | "rating.5"> = {
  1: "rating.1",
  2: "rating.2",
  3: "rating.3",
  4: "rating.4",
  5: "rating.5",
};

const STAR_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
const STAR_BG = ["#fef2f2", "#fff7ed", "#fefce8", "#f7fee7", "#f0fdf4"];

export default function RatingStars({ lang, onSelect }: RatingStarsProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const active = hovered || selected;

  function handleTap(rating: number) {
    setSelected(rating);
    // Haptic feedback
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(30);
    }
    // 300ms delay then advance
    setTimeout(() => onSelect(rating), 300);
  }

  return (
    <div className="rating-screen">
      <h1 className="screen-title">
        {t("rating.title", lang, { store: STORE_CONFIG.name })}
      </h1>

      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            id={`star-${star}`}
            className={`star-btn ${star <= active ? "star-filled" : "star-empty"} ${star === selected ? "star-selected" : ""}`}
            style={
              star <= active
                ? { color: STAR_COLORS[active - 1], filter: "drop-shadow(0 0 8px " + STAR_COLORS[active - 1] + "80)" }
                : {}
            }
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleTap(star)}
            aria-label={`${star} star${star !== 1 ? "s" : ""} — ${t(STAR_LABELS[star], lang)}`}
          >
            <svg viewBox="0 0 24 24" className="star-svg">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={star <= active ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Label */}
      <div
        className="rating-label"
        style={active ? { color: STAR_COLORS[active - 1], background: STAR_BG[active - 1] } : {}}
      >
        {active ? t(STAR_LABELS[active], lang) : "\u00A0"}
      </div>
    </div>
  );
}
