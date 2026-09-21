"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ScreenWrapper from "@/components/ScreenWrapper";
import LanguageSelect from "@/components/LanguageSelect";
import RatingStars from "@/components/RatingStars";
import VisitType from "@/components/VisitType";
import HighlightChips from "@/components/HighlightChips";
import LengthPicker, { type ReviewLength } from "@/components/LengthPicker";
import LoadingScreen from "@/components/LoadingScreen";
import ReviewPreview from "@/components/ReviewPreview";
import ThankYouScreen from "@/components/ThankYouScreen";
import InAppBrowserWarner from "@/components/InAppBrowserWarner";
import type { Lang } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";
import { getFallbackReview } from "@/lib/fallback";

// Steps:  0=lang  1=rating  2=visit  3=chips  4=length  5=loading  6=preview  7=thankyou
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const SESSION_KEY = "rt_session";
const SESSION_PREVIEW_KEY = "rt_preview_text";

function getOrCreateSession(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = uuidv4();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return uuidv4();
  }
}

function logEvent(sessionId: string, event: string, props?: Record<string, unknown>) {
  fetch("/api/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId, event, ...props }),
  }).catch(() => {});
}

export default function Home() {
  const [step, setStep] = useState<Step>(0);
  const [lang, setLang] = useState<Lang>("en");
  const [rating, setRating] = useState(0);
  const [visitType, setVisitType] = useState<VisitTypeKey>("bought_phone");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightLabels, setHighlightLabels] = useState<string[]>([]);
  const [reviewLength, setReviewLength] = useState<ReviewLength>("medium");
  const [review, setReview] = useState("");
  const [shownReviews, setShownReviews] = useState<string[]>([]); // de-dup tracker
  const [regenCount, setRegenCount] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [utm, setUtm] = useState("");

  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [customChipsData, setCustomChipsData] = useState<string[] | undefined>(undefined);

  // Pull UTM + session on mount, check session storage for return detection
  useEffect(() => {
    const sid = getOrCreateSession();
    setSessionId(sid);

    const params = new URLSearchParams(window.location.search);
    const utmParam = params.get("utm") ?? params.get("u") ?? "";
    setUtm(utmParam);

    try {
      const urlParam = params.get("url");
      if (urlParam) setCustomUrl(decodeURIComponent(atob(urlParam)));
      
      const nameParam = params.get("name");
      if (nameParam) setCustomName(decodeURIComponent(atob(nameParam)));
      
      const chipsParam = params.get("chips");
      if (chipsParam) setCustomChipsData(JSON.parse(decodeURIComponent(atob(chipsParam))));
    } catch (e) {
      console.error("Failed to parse custom parameters", e);
    }

    // Log QR scan
    logEvent(sid, "qr_scanned", { utm: utmParam });

    // Check if returning from Google (visibilitychange)
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && step === 6) {
        setStep(7);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Re-register visibility handler when step changes to 6
  useEffect(() => {
    if (step !== 6) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // Small delay to avoid triggering immediately on step transition
        setTimeout(() => {
          setStep(7);
        }, 1500);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [step]);

  // ── Step handlers ────────────────────────────────────────────────────────────

  function handleLangSelect(l: Lang) {
    setLang(l);
    logEvent(sessionId, "lang_selected", { lang: l });
    setStep(1);
  }

  function handleRatingSelect(r: number) {
    setRating(r);
    logEvent(sessionId, "rating_selected", { lang, rating: r });
    setStep(2);
  }

  function handleVisitSelect(v: VisitTypeKey) {
    setVisitType(v);
    logEvent(sessionId, "visit_selected", { lang, visit_type: v });
    setStep(3);
  }

  function handleChipsContinue(chips: string[], labels: string[]) {
    setHighlights(chips);
    setHighlightLabels(labels);
    logEvent(sessionId, "highlights_selected", { lang, highlights: labels });
    setStep(4);
  }

  async function handleLengthSelect(len: ReviewLength) {
    setReviewLength(len);
    setRegenCount(0);
    logEvent(sessionId, "length_selected", { lang, length: len });
    setStep(5); // Go to loading

    await generateReview(len, 0);
  }

  async function generateReview(len: ReviewLength, regen: number) {
    setStep(5);

    // 12s fallback timeout
    const timeout = new Promise<{ review: string; source: string }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            review: getFallbackReview({ lang, rating, visitType: visitType, length: len }),
            source: "fallback",
          }),
        12000
      )
    );

    const fetchReview = fetch("/api/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lang,
        rating,
        visitType,
        highlights: highlightLabels.length > 0 ? highlightLabels : highlights,
        length: len,
        sessionId,
        regenCount: regen,
        customName,
        previousReviews: shownReviews.slice(-3), // last 3 shown reviews for de-dup
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .catch(() => ({
        review: getFallbackReview({ lang, rating, visitType: visitType, length: len }),
        source: "fallback",
      }));

    const result = await Promise.race([fetchReview, timeout]);

    // Save to session storage for refresh resilience
    try {
      sessionStorage.setItem(SESSION_PREVIEW_KEY, result.review);
    } catch {}

    setReview(result.review);
    // Track this review so it is never shown again
    setShownReviews((prev) => [...prev, result.review]);
    setStep(6);
  }

  async function handleRegenerate() {
    if (regenCount >= 3) return;
    const next = regenCount + 1;
    setRegenCount(next);
    logEvent(sessionId, "review_regenerated", { lang, regen_count: next });
    await generateReview(reviewLength, next);
  }

  function handleGoogleOpened() {
    // visibilitychange will fire when they come back; already wired up
  }

  function goBack() {
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 6) setStep(4); // back from preview → length
  }

  // ── Restore review on page refresh ──────────────────────────────────────────
  useEffect(() => {
    if (step === 6) {
      try {
        const saved = sessionStorage.getItem(SESSION_PREVIEW_KEY);
        if (saved && !review) setReview(saved);
      } catch {}
    }
  }, [step]);

  // ── Render ───────────────────────────────────────────────────────────────────

  // S0: Language select (no header chrome)
  if (step === 0) {
    return (
      <div className="app-root">
        <InAppBrowserWarner lang="en" />
        <LanguageSelect onSelect={handleLangSelect} />
      </div>
    );
  }

  // S7: Thank you
  if (step === 7) {
    return (
      <div className="app-root">
        <ScreenWrapper lang={lang}>
          <ThankYouScreen lang={lang} />
        </ScreenWrapper>
      </div>
    );
  }

  // Steps 1–6 (with header/progress)
  const stepNumber = step as number;
  const displayStep = stepNumber <= 4 ? stepNumber : stepNumber === 6 ? 5 : undefined;

  return (
    <div className="app-root">
      <InAppBrowserWarner lang={lang} />
      <ScreenWrapper
        lang={lang}
        step={displayStep}
        totalSteps={5}
        onBack={step > 1 && step !== 5 ? goBack : undefined}
      >
        {step === 1 && (
          <RatingStars lang={lang} onSelect={handleRatingSelect} />
        )}
        {step === 2 && (
          <VisitType lang={lang} onSelect={handleVisitSelect} />
        )}
        {step === 3 && (
          <HighlightChips
            lang={lang}
            visitType={visitType}
            rating={rating}
            customChipsData={customChipsData}
            onContinue={handleChipsContinue}
          />
        )}
        {step === 4 && (
          <LengthPicker lang={lang} onSelect={handleLengthSelect} />
        )}
        {step === 5 && (
          <LoadingScreen lang={lang} />
        )}
        {step === 6 && (
          <ReviewPreview
            lang={lang}
            rating={rating}
            review={review}
            regenCount={regenCount}
            customMapsUrl={customUrl}
            onRegenerate={handleRegenerate}
            sessionId={sessionId}
            onGoogleOpened={handleGoogleOpened}
          />
        )}
      </ScreenWrapper>
    </div>
  );
}
