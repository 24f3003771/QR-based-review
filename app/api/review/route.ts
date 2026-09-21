import { NextRequest, NextResponse } from "next/server";

import { buildPrompt } from "@/lib/prompt";
import { validateReview } from "@/lib/validate";
import { getFallbackReview } from "@/lib/fallback";
import { checkRateLimit } from "@/lib/ratelimit";
import { logEvent } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";

const VALID_VISIT_TYPES: VisitTypeKey[] = ["bought_phone", "sold_phone", "repair", "accessories"];
const VALID_LENGTHS = ["short", "medium", "detailed"] as const;
const VALID_LANGS: Lang[] = ["en", "hi"];

// Using NVIDIA deepseek endpoint instead of Anthropic

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  const { lang, rating, visitType, highlights, length, extraNote, sessionId, regenCount, customName } = body;

  if (!VALID_LANGS.includes(lang as Lang)) {
    return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }
  if (!VALID_VISIT_TYPES.includes(visitType as VisitTypeKey)) {
    return NextResponse.json({ error: "Invalid visitType" }, { status: 400 });
  }
  if (!Array.isArray(highlights) || highlights.length === 0) {
    return NextResponse.json({ error: "highlights required" }, { status: 400 });
  }
  if (!VALID_LENGTHS.includes(length as typeof VALID_LENGTHS[number])) {
    return NextResponse.json({ error: "Invalid length" }, { status: 400 });
  }

  const typedLang = lang as Lang;
  const typedVisitType = visitType as VisitTypeKey;
  const typedLength = length as "short" | "medium" | "detailed";

  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  // ── AI Generation ────────────────────────────────────────────────────────────
  let review = "";
  let source: "ai" | "fallback" = "fallback";

  const { system, user } = buildPrompt({
    lang: typedLang,
    rating: rating as number,
    visitType: typedVisitType,
    highlights: highlights as string[],
    length: typedLength,
    extraNote: typeof extraNote === "string" ? extraNote : undefined,
    regenCount: typeof regenCount === "number" ? regenCount : 0,
    customName: typeof customName === "string" ? customName : undefined,
  });

  // Try AI, then retry once, then fallback
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-v4-flash-0731",
          messages: [
            { role: "system", "content": system },
            { role: "user", "content": user }
          ],
          temperature: 1.1 + Math.random() * 0.4, // Between 1.1 and 1.5 for high creativity
          top_p: 0.95,
          max_tokens: 16384,
          stream: false,
          chat_template_kwargs: {
            thinking: true,
            reasoning_effort: "high"
          }
        }),
        signal: AbortSignal.timeout(12000) // 12 second timeout
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      let candidate = data.choices?.[0]?.message?.content?.trim() || "";
      
      // Post-processing to strictly remove any hyphens or common bullet points
      candidate = candidate.replace(/[-*•]/g, "");

      const validation = validateReview(candidate, typedLang, typedLength);
      if (validation.valid) {
        review = candidate;
        source = "ai";
        break;
      }
    } catch (e) {
      // Retry or fall through to fallback
      console.error("AI Generation error:", e);
    }
  }

  // Use fallback if AI failed or not configured
  if (!review) {
    review = getFallbackReview({
      lang: typedLang,
      rating: rating as number,
      visitType: typedVisitType,
      length: typedLength,
    });
    source = "fallback";
  }

  const latency = Date.now() - startTime;
  const reviewId = `rv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // ── Analytics ─────────────────────────────────────────────────────────────
  logEvent({
    session_id: typeof sessionId === "string" ? sessionId : "unknown",
    event: "review_generated",
    lang: typedLang,
    rating: rating as number,
    visit_type: typedVisitType,
    highlights: highlights as string[],
    length: typedLength,
    source,
    utm: req.nextUrl.searchParams.get("utm") ?? undefined,
    props: { latency },
  }).catch(() => {});

  return NextResponse.json({ review, source, reviewId });
}
