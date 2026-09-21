"use client";

import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface LoadingScreenProps {
  lang: Lang;
}

export default function LoadingScreen({ lang }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <div className="loading-animation">
        <div className="loading-spinner" />
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
      <div className="loading-skeleton">
        <div className="skeleton-line skeleton-line-full" />
        <div className="skeleton-line skeleton-line-three-quarters" />
        <div className="skeleton-line skeleton-line-half" />
        <div className="skeleton-line skeleton-line-full" />
        <div className="skeleton-line skeleton-line-two-thirds" />
      </div>
      <p className="loading-text">{t("loading.text", lang)}</p>
      <p className="loading-subtitle">{t("loading.subtitle", lang)}</p>
    </div>
  );
}
