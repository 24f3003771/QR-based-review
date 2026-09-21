import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { getFallbackReview } from "@/lib/fallback";
import { checkRateLimit } from "@/lib/ratelimit";
import { logEvent } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";

const VALID_VISIT_TYPES: VisitTypeKey[] = ["bought_phone", "sold_phone", "repair", "accessories"];
const VALID_LENGTHS = ["short", "medium", "detailed"] as const;
const VALID_LANGS: Lang[] = ["en", "hi"];

// Post-process AI output — strip bullets, hyphens, dashes, collapse newlines
function cleanOutput(text: string): string {
  return text
    .replace(/^[\s\t]*[-–—*•◦▪▸►◆\d+\.]+[\s\t]+/gm, "") // strip list-like line starts
    .replace(/\s*[-–—]\s*/g, " ")   // replace inline dashes with space
    .replace(/\*/g, "")              // strip asterisks
    .replace(/\n{2,}/g, " ")         // collapse paragraph breaks
    .replace(/\n/g, " ")             // collapse single newlines
    .replace(/\s{2,}/g, " ")         // collapse multiple spaces
    .trim();
}

// Minimal validation — just ensure it's not empty / a refusal
function isAcceptable(text: string, lang: Lang): boolean {
  if (!text || text.trim().length < 15) return false;
  const lower = text.toLowerCase();
  const refusals = ["i cannot", "i'm unable", "as an ai", "i don't generate", "i won't"];
  if (refusals.some((r) => lower.includes(r))) return false;
  // For Hindi, at least 20% Devanagari
  if (lang === "hi") {
    const deva = (text.match(/[\u0900-\u097F]/g) ?? []).length;
    const letters = text.replace(/[^a-zA-Z\u0900-\u097F]/g, "").length;
    if (letters > 0 && deva / letters < 0.2) return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  const { lang, rating, visitType, highlights, length, extraNote, sessionId, regenCount, customName, previousReviews } = body;

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

  // ── Build prompt ─────────────────────────────────────────────────────────────
  const genSeed = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const { system, user } = buildPrompt({
    lang: typedLang,
    rating: rating as number,
    visitType: typedVisitType,
    highlights: highlights as string[],
    length: typedLength,
    extraNote: typeof extraNote === "string" ? extraNote : undefined,
    regenCount: typeof regenCount === "number" ? regenCount : 0,
    customName: typeof customName === "string" ? customName : undefined,
    previousReviews: Array.isArray(previousReviews) ? (previousReviews as string[]).slice(-3) : [],
    seed: genSeed,
  });

  // ── AI Generation (NVIDIA — fast model, no thinking) ──────────────────────
  let review = "";
  let source: "ai" | "fallback" = "fallback";

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000); // 15s hard timeout

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-r1-distill-llama-70b", // fast distilled model
        messages: [
          { role: "system", content: system },
          { role: "user",   content: user   },
        ],
        temperature: 0.9 + Math.random() * 0.3, // 0.9–1.2 for variety without chaos
        top_p: 0.9,
        max_tokens: 512,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      let candidate = data.choices?.[0]?.message?.content?.trim() ?? "";

      // Strip <think>…</think> reasoning blocks that distilled models sometimes emit
      candidate = candidate.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      candidate = cleanOutput(candidate);

      if (isAcceptable(candidate, typedLang)) {
        review = candidate;
        source = "ai";
      } else {
        console.warn("AI output failed acceptability check:", candidate.slice(0, 80));
      }
    } else {
      const errText = await response.text();
      console.error(`NVIDIA API error ${response.status}:`, errText);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("AI generation failed:", msg);
  }

  // ── Fallback (random pick, never the same one twice in a row) ───────────────
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
