"use client";

import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export type ReviewLength = "short" | "medium" | "detailed";

interface LengthOption {
  key: ReviewLength;
  labelKey: string;
  descKey: string;
  icon: string;
  wordCount: { en: string; hi: string };
}

const LENGTH_OPTIONS: LengthOption[] = [
  {
    key: "short",
    labelKey: "length.short",
    descKey: "length.short.desc",
    icon: "✦",
    wordCount: { en: "~20–35 words", hi: "~20–35 शब्द" },
  },
  {
    key: "medium",
    labelKey: "length.medium",
    descKey: "length.medium.desc",
    icon: "✦✦",
    wordCount: { en: "~45–70 words", hi: "~45–70 शब्द" },
  },
  {
    key: "detailed",
    labelKey: "length.detailed",
    descKey: "length.detailed.desc",
    icon: "✦✦✦",
    wordCount: { en: "~80–110 words", hi: "~80–110 शब्द" },
  },
];

interface LengthPickerProps {
  lang: Lang;
  onSelect: (length: ReviewLength) => void;
}

export default function LengthPicker({ lang, onSelect }: LengthPickerProps) {
  return (
    <div className="length-screen">
      <h1 className="screen-title">{t("length.title", lang)}</h1>

      <div className="length-options">
        {LENGTH_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            id={`length-${opt.key}`}
            className={`length-card ${opt.key === "medium" ? "length-card-default" : ""}`}
            onClick={() => onSelect(opt.key)}
          >
            <div className="length-card-left">
              <div className="length-icon">{opt.icon}</div>
              <div className="length-text">
                <span className="length-label">{t(opt.labelKey, lang)}</span>
                <span className="length-desc">{t(opt.descKey, lang)}</span>
              </div>
            </div>
            <div className="length-card-right">
              {opt.key === "medium" && (
                <span className="length-recommended">
                  {lang === "hi" ? "सुझाव" : "Recommended"}
                </span>
              )}
              <span className="length-word-count">
                {lang === "hi" ? opt.wordCount.hi : opt.wordCount.en}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
