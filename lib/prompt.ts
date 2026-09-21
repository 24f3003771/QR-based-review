import type { Lang } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";
import { STORE_CONFIG } from "@/config/store";

interface PromptInput {
  lang: Lang;
  rating: number;
  visitType: VisitTypeKey;
  highlights: string[];
  length: "short" | "medium" | "detailed";
  extraNote?: string;
  regenCount: number;
  customName?: string;
}

const LENGTH_INSTRUCTIONS: Record<string, string> = {
  short: "1 to 2 sentences (about 20–35 words)",
  medium: "3 to 4 sentences (about 45–70 words)",
  detailed: "5 to 6 sentences (about 80–110 words)",
};

const VISIT_LABELS: Record<VisitTypeKey, string> = {
  bought_phone: "bought a refurbished phone",
  sold_phone: "sold their phone",
  repair: "got a phone repaired",
  accessories: "bought phone accessories",
};

const REGEN_OPENERS = [
  "Write a completely different version with a different opening.",
  "Use a fresh angle and different sentence structure than before.",
  "Vary the phrasing significantly — different opening word, different flow.",
];

export function buildPrompt(input: PromptInput): { system: string; user: string } {
  const storeName = input.customName || STORE_CONFIG.name;
  const langInstruction =
    input.lang === "hi"
      ? `Write ONLY in pure, natural Devanagari Hindi. Do NOT mix English words unless they are very common brand terms. The entire output MUST be in Hindi script. Do NOT sound translated.`
      : `Write ONLY in pure, natural English. The entire output MUST be in English.`;

  const toneMap: Record<number, string> = {
    5: "warm and enthusiastic",
    4: "positive and satisfied",
    3: "balanced and honest — acknowledge both good and areas for improvement",
    2: "polite but clearly disappointed",
    1: "polite but clearly disappointed and direct about the issue",
  };
  const tone = toneMap[input.rating] ?? "honest";

  const highlightList = input.highlights.join(", ");
  const extraLine = input.extraNote
    ? `The customer added this note: "${input.extraNote}". Incorporate naturally if relevant.`
    : "";

  const regenLine =
    input.regenCount > 0 && input.regenCount <= 3
      ? `\n${REGEN_OPENERS[(input.regenCount - 1) % REGEN_OPENERS.length]}`
      : "";

  const system = `You write short Google Maps reviews on behalf of a customer of a refurbished phone store.

RULES:
1. Use ONLY the facts provided (rating, visit type, highlights, optional note). Never invent details.
2. Tone must match the rating: ${tone}. Never force positivity on low ratings.
3. Language: ${langInstruction}
4. Length: STRICTLY follow — ${LENGTH_INSTRUCTIONS[input.length]}.
5. Formatting: Write as a single continuous paragraph. ABSOLUTELY NO hyphens (-), bullet points, or numbered lists. Do not use symbols that look AI-generated.
6. Creativity: Be highly creative and vary your phrasing significantly each time. DO NOT follow a fixed template. Sound like a real, casual human customer. Do NOT start with "I recently visited". Avoid marketing language and clichés.
7. No emojis, no hashtags, no exaggerated superlatives, no mention of AI.
8. Mention the store name "${storeName}" at most once, only if it fits naturally.
9. Output ONLY the review text. No quotes, no preface, no explanation.`;

  const user = `Customer details:
Rating: ${input.rating}/5
Visit Type: ${VISIT_LABELS[input.visitType]}
Highlights: ${highlightList}
${extraLine}${regenLine}

Write the review now.`;

  return { system, user };
}
