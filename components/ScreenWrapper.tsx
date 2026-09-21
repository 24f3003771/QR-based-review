"use client";

import Image from "next/image";
import { STORE_CONFIG } from "@/config/store";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface ScreenWrapperProps {
  children: React.ReactNode;
  lang: Lang;
  step?: number;       // 1-based, undefined = no progress bar
  totalSteps?: number;
  onBack?: () => void;
  className?: string;
}

export default function ScreenWrapper({
  children,
  lang,
  step,
  totalSteps = 5,
  onBack,
  className = "",
}: ScreenWrapperProps) {
  return (
    <div className={`screen-wrapper ${className}`}>
      {/* Header */}
      <header className="screen-header">
        <div className="store-brand">
          <div className="store-logo-wrap">
            <Image
              src={STORE_CONFIG.logo}
              alt={STORE_CONFIG.name}
              width={40}
              height={40}
              className="store-logo-img"
              priority
            />
          </div>
          <span className="store-name">{STORE_CONFIG.name}</span>
        </div>

        {/* Progress bar */}
        {step !== undefined && (
          <div className="progress-bar-wrap">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <span className="progress-label">
              {t("progress.step", lang, { current: step, total: totalSteps })}
            </span>
          </div>
        )}
      </header>

      {/* Back button */}
      {onBack && (
        <button className="back-btn" onClick={onBack} aria-label={t("back", lang)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span>{t("back", lang)}</span>
        </button>
      )}

      {/* Main content */}
      <main className="screen-main">{children}</main>
    </div>
  );
}
