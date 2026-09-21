"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { t, detectLang } from "@/lib/i18n";

interface LanguageSelectProps {
  onSelect: (lang: Lang) => void;
}

export default function LanguageSelect({ onSelect }: LanguageSelectProps) {
  // Pre-highlight based on browser language (visual hint only)
  const suggestedLang = typeof window !== "undefined" ? detectLang() : "en";

  return (
    <div className="lang-select-screen">
      <div className="lang-hero">
        <div className="lang-icon">🌐</div>
        <h1 className="lang-title">{t("lang.title", "en")} / {t("lang.title", "hi")}</h1>
        <p className="lang-subtitle">{t("lang.subtitle", "en")} / {t("lang.subtitle", "hi")}</p>
      </div>

      <div className="lang-buttons">
        <button
          id="lang-hindi"
          className={`lang-btn lang-btn-hindi ${suggestedLang === "hi" ? "lang-btn-suggested" : ""}`}
          onClick={() => onSelect("hi")}
        >
          <span className="lang-btn-native">हिंदी</span>
          <span className="lang-btn-sub">Hindi</span>
        </button>
        <button
          id="lang-english"
          className={`lang-btn lang-btn-english ${suggestedLang === "en" ? "lang-btn-suggested" : ""}`}
          onClick={() => onSelect("en")}
        >
          <span className="lang-btn-native">English</span>
          <span className="lang-btn-sub">अंग्रेज़ी</span>
        </button>
      </div>
    </div>
  );
}
