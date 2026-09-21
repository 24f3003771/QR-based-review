"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { STORE_CONFIG } from "@/config/store";

interface ReviewPreviewProps {
  lang: Lang;
  rating: number;
  review: string;
  regenCount: number;
  customMapsUrl?: string;
  onRegenerate: () => void;
  sessionId: string;
  onGoogleOpened: () => void;
}

const MAX_REGEN = 3;

function StarDisplay({ rating, lang }: { rating: number; lang: Lang }) {
  return (
    <div className="preview-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          className={`preview-star ${s <= rating ? "preview-star-filled" : "preview-star-empty"}`}
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={s <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
      <span className="preview-star-label">{t("preview.stars_reminder", lang)}</span>
    </div>
  );
}

export default function ReviewPreview({
  lang,
  rating,
  review,
  regenCount,
  customMapsUrl,
  onRegenerate,
  sessionId,
  onGoogleOpened,
}: ReviewPreviewProps) {
  const [text, setText] = useState(review);
  const [copyState, setCopyState] = useState<"idle" | "success" | "failed">("idle");
  const [isEdited, setIsEdited] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update text when review prop changes
  useEffect(() => {
    setText(review);
    setIsEdited(false);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [review]);

  // Save to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("rt_preview_text", text);
    } catch {}
  }, [text]);

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    setIsEdited(true);
    // Auto-grow
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";

    // Log edit event (fire-and-forget)
    fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, event: "review_edited", lang }),
    }).catch(() => {});
  }

  async function handleCopyAndPost() {
    const reviewText = text.trim();

    // Log copy event
    fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, event: "review_copied", lang, rating }),
    }).catch(() => {});

    try {
      await navigator.clipboard.writeText(reviewText);
      setCopyState("success");

      // After 700ms, open Google
      setTimeout(() => {
        const url = customMapsUrl || STORE_CONFIG.googleReviewUrl();
        window.open(url, "_blank", "noopener,noreferrer");
        onGoogleOpened();

        // Log google_opened
        fetch("/api/event", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId, event: "google_opened", lang, rating }),
        }).catch(() => {});
      }, 700);
    } catch {
      setCopyState("failed");
      // Auto-select textarea
      if (textareaRef.current) {
        textareaRef.current.select();
      }
      // Log failure
      fetch("/api/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, event: "clipboard_failed", lang }),
      }).catch(() => {});
    }
  }

  function handleOpenGoogleManually() {
    const url = customMapsUrl || STORE_CONFIG.googleReviewUrl();
    window.open(url, "_blank", "noopener,noreferrer");
    onGoogleOpened();
  }

  const canRegen = regenCount < MAX_REGEN;

  return (
    <div className="preview-screen">
      <h1 className="screen-title">{t("preview.title", lang)}</h1>
      <StarDisplay rating={rating} lang={lang} />

      {/* Editable textarea */}
      <div className="review-box-wrap">
        {isEdited && (
          <div className="edited-badge">
            ✏️ {lang === "hi" ? "संपादित" : "Edited"}
          </div>
        )}
        <textarea
          ref={textareaRef}
          id="review-textarea"
          className="review-textarea"
          value={text}
          onChange={handleTextChange}
          rows={5}
          lang={lang}
          dir={lang === "hi" ? "auto" : "ltr"}
          aria-label={lang === "hi" ? "रिव्यू टेक्स्ट" : "Review text"}
        />
      </div>

      {/* Copy failed fallback */}
      {copyState === "failed" && (
        <div className="copy-failed-banner">
          <p>{t("preview.copy_failed", lang)}</p>
          <button id="open-google-manual" className="open-google-btn" onClick={handleOpenGoogleManually}>
            {t("preview.open_google", lang)}
          </button>
        </div>
      )}

      {/* Tip */}
      <div className="preview-tip">
        <span className="tip-icon">📸</span>
        {t("preview.tip", lang)}
      </div>

      {/* Footer */}
      <p className="preview-footer">{t("preview.footer", lang)}</p>

      {/* Google sign-in tip */}
      <p className="preview-signin-tip">
        💡 {t("preview.google_signed_in_tip", lang)}
      </p>

      {/* Private feedback */}
      <a
        href={STORE_CONFIG.privateFeedbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="private-feedback-link"
        onClick={() => {
          fetch("/api/event", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ sessionId, event: "private_feedback_clicked", lang }),
          }).catch(() => {});
        }}
      >
        {t("preview.private_feedback", lang)}
      </a>

      {/* Sticky bottom actions */}
      <div className="preview-actions">
        <button
          id="regen-btn"
          className={`regen-btn ${!canRegen ? "regen-btn-disabled" : ""}`}
          onClick={canRegen ? onRegenerate : undefined}
          disabled={!canRegen}
          aria-disabled={!canRegen}
        >
          {canRegen ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="regen-icon">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              {t("preview.regenerate", lang)}
              <span className="regen-count">{MAX_REGEN - regenCount} left</span>
            </>
          ) : (
            t("preview.regenerate_limit", lang)
          )}
        </button>

        <button
          id="copy-post-btn"
          className={`cta-btn ${copyState === "success" ? "cta-btn-success" : ""}`}
          onClick={handleCopyAndPost}
        >
          {copyState === "success" ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cta-icon">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("preview.copied_toast", lang)}
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cta-icon">
                <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M16 10l-4 4-2-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("preview.cta", lang)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
