"use client";

import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";

interface VisitOption {
  key: VisitTypeKey;
  labelKey: string;
  icon: React.ReactNode;
  description: { en: string; hi: string };
}

const VISIT_OPTIONS: VisitOption[] = [
  {
    key: "bought_phone",
    labelKey: "visit.bought",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="visit-icon-svg">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
        <path d="M9 7h6M9 11h4" />
        <path d="M16 14l2-2-2-2" />
      </svg>
    ),
    description: { en: "Purchased a refurbished device", hi: "एक refurbished device खरीदा" },
  },
  {
    key: "sold_phone",
    labelKey: "visit.sold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="visit-icon-svg">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
        <path d="M9 7h6M9 11h4" />
        <path d="M16 14l-2-2 2-2" />
      </svg>
    ),
    description: { en: "Exchanged your old device for cash", hi: "पुराना device बेचा" },
  },
  {
    key: "repair",
    labelKey: "visit.repair",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="visit-icon-svg">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    description: { en: "Fixed a screen, battery or issue", hi: "screen, battery या कोई दिक्कत ठीक की" },
  },
  {
    key: "accessories",
    labelKey: "visit.accessories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="visit-icon-svg">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    description: { en: "Cases, chargers, cables and more", hi: "case, charger, cable वगैरह" },
  },
];

interface VisitTypeProps {
  lang: Lang;
  onSelect: (type: VisitTypeKey) => void;
}

export default function VisitType({ lang, onSelect }: VisitTypeProps) {
  return (
    <div className="visit-screen">
      <h1 className="screen-title">{t("visit.title", lang)}</h1>

      <div className="visit-grid">
        {VISIT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            id={`visit-${opt.key}`}
            className="visit-card"
            onClick={() => onSelect(opt.key)}
          >
            <div className="visit-icon">{opt.icon}</div>
            <div className="visit-text">
              <span className="visit-label">{t(opt.labelKey, lang)}</span>
              <span className="visit-desc">{lang === "hi" ? opt.description.hi : opt.description.en}</span>
            </div>
            <svg className="visit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
