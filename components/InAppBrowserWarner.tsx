"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface InAppBrowserWarnerProps {
  lang: Lang;
}

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    ua.includes("FBAN") ||          // Facebook
    ua.includes("FBAV") ||
    ua.includes("Instagram") ||
    ua.includes("WhatsApp") ||
    ua.includes("Line/") ||
    ua.includes("Twitter") ||
    (ua.includes("wv") && ua.includes("Android")) // generic Android WebView
  );
}

export default function InAppBrowserWarner({ lang }: InAppBrowserWarnerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isInAppBrowser());
  }, []);

  if (!show) return null;

  return (
    <div className="inapp-banner">
      <div className="inapp-content">
        <span className="inapp-icon">⚠️</span>
        <p className="inapp-text">{t("inapp.warning", lang)}</p>
      </div>
      <button
        id="inapp-open-btn"
        className="inapp-btn"
        onClick={() => {
          // Try to open in default browser
          window.open(window.location.href, "_blank");
        }}
      >
        {t("inapp.button", lang)}
      </button>
    </div>
  );
}
