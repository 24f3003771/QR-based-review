import type { Lang } from "@/lib/i18n";

const BLACKLIST = [
  "ai", "artificial intelligence", "generated", "chatgpt", "claude",
  "competitor", "http://", "https://", "www.", ".com", ".in",
];

// Rough Devanagari Unicode range: U+0900–U+097F
const DEVANAGARI_REGEX = /[\u0900-\u097F]/g;

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateReview(text: string, lang: Lang, length: "short" | "medium" | "detailed"): ValidationResult {
  if (!text || text.trim().length < 10) {
    return { valid: false, reason: "empty or too short" };
  }

  const lower = text.toLowerCase();

  // Check blacklist
  for (const word of BLACKLIST) {
    if (lower.includes(word)) {
      return { valid: false, reason: `contains blacklisted word: ${word}` };
    }
  }

  // For Hindi, check that >50% of letters are Devanagari
  if (lang === "hi") {
    const devanagariMatches = text.match(DEVANAGARI_REGEX) ?? [];
    const allLetters = text.replace(/[^a-zA-Z\u0900-\u097F]/g, "");
    if (allLetters.length > 0) {
      const ratio = devanagariMatches.length / allLetters.length;
      if (ratio < 0.3) {
        return { valid: false, reason: `not enough Devanagari (ratio: ${ratio.toFixed(2)})` };
      }
    }
  }

  // Check approximate word count
  const wordCount = text.trim().split(/\s+/).length;
  const lengthRanges: Record<string, [number, number]> = {
    short: [10, 60],
    medium: [30, 100],
    detailed: [60, 160],
  };
  const [min, max] = lengthRanges[length];
  if (wordCount < min || wordCount > max) {
    return { valid: false, reason: `word count ${wordCount} out of range [${min}, ${max}]` };
  }

  // Check it's not a refusal
  const refusals = ["i cannot", "i'm unable", "as an ai", "i don't", "i won't"];
  for (const r of refusals) {
    if (lower.startsWith(r) || lower.includes(r)) {
      return { valid: false, reason: "appears to be a refusal" };
    }
  }

  return { valid: true };
}
