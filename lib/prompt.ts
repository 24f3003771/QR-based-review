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
  seed?: string; // Unique seed per generation to prevent repeats
}

const LENGTH_INSTRUCTIONS: Record<string, string> = {
  short: "1 to 2 sentences (about 20 to 35 words)",
  medium: "3 to 4 sentences (about 45 to 70 words)",
  detailed: "5 to 6 sentences (about 80 to 110 words)",
};

const VISIT_LABELS_EN: Record<VisitTypeKey, string> = {
  bought_phone: "bought a refurbished phone",
  sold_phone: "sold their phone",
  repair: "got a phone repaired",
  accessories: "bought phone accessories",
};

const VISIT_LABELS_HI: Record<VisitTypeKey, string> = {
  bought_phone: "refurbished phone kharida",
  sold_phone: "phone becha",
  repair: "phone ki repair karwai",
  accessories: "accessories kharidi",
};

// Many varied random openers to force the model to start differently each time
const EN_OPENERS = [
  "Start with a time reference like 'Last week' or 'A few days ago'.",
  "Start with the outcome, e.g. 'Walked out happy...' or 'Left satisfied...'.",
  "Start with what you were looking for, e.g. 'Needed a reliable phone and...'.",
  "Start with a personal observation about the store or staff.",
  "Start with the price or value aspect first.",
  "Start with how the experience compared to expectations.",
  "Start mid-thought, like 'Honestly, wasn't expecting much but...'.",
  "Start with a specific detail like how quickly you were attended to.",
  "Start with how you found out about the store or what brought you in.",
  "Start with the result of the visit and then explain why.",
];

const HI_OPENERS = [
  "Shuru karo ek time reference se jaise 'Pichle hafte' ya 'Kuch din pehle'.",
  "Result se shuru karo jaise 'Khush hokar nikla...' ya 'Santusht hokar gaya...'.",
  "Apni zaroorat se shuru karo jaise 'Ek acha phone chahiye tha aur...'.",
  "Dukaan ya staff ke baare mein ek personal observation se shuru karo.",
  "Pehle price ya value ki baat karo.",
  "Batao ke experience umeed se alag kaise tha.",
  "Seedha baat se shuru karo jaise 'Sach mein, zyada umeed nahi thi par...'.",
  "Ek chhoti si detail se shuru karo jaise kitni jaldi service mili.",
  "Likho ke kya cheez le gayi dukaan tak.",
  "Pehle result batao phir wajah.",
];

function pickRandom<T>(arr: T[], seed?: string): T {
  // Use seed for deterministic pick during regen, pure random otherwise
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
    }
    return arr[Math.abs(hash) % arr.length];
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildPrompt(input: PromptInput): { system: string; user: string } {
  const storeName = input.customName || STORE_CONFIG.name;

  // Unique entropy string injected into each request so the model never repeats
  const entropy = input.seed || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const openerInstruction =
    input.lang === "hi"
      ? pickRandom(HI_OPENERS, entropy)
      : pickRandom(EN_OPENERS, entropy);

  const toneMap: Record<number, string> = {
    5: "warm and genuinely enthusiastic",
    4: "positive and satisfied",
    3: "balanced and honest, note both good things and one small area to improve",
    2: "politely disappointed",
    1: "politely but clearly dissatisfied and direct about the issue",
  };
  const tone = toneMap[input.rating] ?? "honest";

  const highlightList = input.highlights.join(", ");
  const extraLine = input.extraNote
    ? `The customer also mentioned: "${input.extraNote}". Weave it in naturally.`
    : "";

  // Language block — extremely explicit to prevent code-switching
  const langBlock =
    input.lang === "hi"
      ? `LANGUAGE RULES (MANDATORY — failure = wrong output):
- Write the ENTIRE review in Devanagari Hindi script only.
- ZERO English words are allowed. Not even "phone", "repair", "service", "battery", "screen", "staff", "store", "review", "quality", "price". Translate every single word.
- Do NOT transliterate Roman into Hindi (e.g. do not write "phone" in Devanagari as "फ़ोन" — use "मोबाइल" instead, "मरम्मत" for repair, "सेवा" for service, "दुकान" for store, "कीमत" for price, "कर्मचारी" for staff).
- The output must feel like a normal Hindi-speaking customer wrote it on their own.`
      : `LANGUAGE RULES (MANDATORY):
- Write the ENTIRE review in English only.
- Zero Hindi or other language words.`;

  const system = `You are a real customer writing a short, authentic Google Maps review.

${langBlock}

FORMATTING RULES (MANDATORY):
- Write as ONE single continuous flowing paragraph. Absolutely no hyphens (-), dashes (–), bullet points, asterisks (*), numbered lists, or any other list symbols anywhere in the text. If you use any of these characters, the output is invalid.
- No emojis, no hashtags, no exaggerated words like "best ever" or "world class".

CONTENT RULES:
- Tone: ${tone}. Match the rating exactly. Do not force positivity on low ratings.
- Length: strictly ${LENGTH_INSTRUCTIONS[input.length]}.
- Use ONLY the facts given. Do not invent staff names, phone models, prices, repair details, or dates.
- Mention "${storeName}" at most once if it fits naturally.
- Output ONLY the review text. No intro, no quotes, no labels.

UNIQUENESS (CRITICAL):
- This is generation token: ${entropy}
- Opener instruction for this generation: ${openerInstruction}
- You MUST follow the opener instruction above. Every generation must sound completely different.`;

  const user = `Customer info:
Rating: ${input.rating} out of 5
Visit reason: ${input.lang === "hi" ? VISIT_LABELS_HI[input.visitType] : VISIT_LABELS_EN[input.visitType]}
What stood out: ${highlightList}
${extraLine}

Write the review now.`;

  return { system, user };
}
