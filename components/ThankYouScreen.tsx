"use client";

import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { STORE_CONFIG } from "@/config/store";

interface ThankYouScreenProps {
  lang: Lang;
}

export default function ThankYouScreen({ lang }: ThankYouScreenProps) {
  function handleRetry() {
    const url = `https://search.google.com/local/writereview?placeid=${STORE_CONFIG.placeId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="thankyou-screen">
      <div className="thankyou-icon">
        <div className="thankyou-checkmark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
      </div>

      <h1 className="thankyou-title">{t("thankyou.title", lang)}</h1>
      <p className="thankyou-subtitle">{t("thankyou.subtitle", lang)}</p>

      <div className="thankyou-hearts">
        {["❤️", "⭐", "🙏"].map((emoji, i) => (
          <span key={i} className="thankyou-emoji" style={{ animationDelay: `${i * 0.2}s` }}>
            {emoji}
          </span>
        ))}
      </div>

      <button id="retry-google-btn" className="retry-btn" onClick={handleRetry}>
        {t("thankyou.retry", lang)}
      </button>
    </div>
  );
}
