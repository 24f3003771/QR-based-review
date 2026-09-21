import type { Lang } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";
import { STORE_CONFIG } from "@/config/store";

export interface PromptInput {
  lang: Lang;
  rating: number;
  visitType: VisitTypeKey;
  highlights: string[];
  length: "short" | "medium" | "detailed";
  extraNote?: string;
  regenCount: number;
  customName?: string;
  seed?: string;
  previousReviews?: string[]; // texts already shown this session
}

// ─── Length targets ────────────────────────────────────────────────────────────

const LENGTH_EN: Record<string, string> = {
  short:    "1–2 sentences (roughly 20–35 words)",
  medium:   "3–4 sentences (roughly 45–70 words)",
  detailed: "5–6 sentences (roughly 80–110 words)",
};

const LENGTH_HI: Record<string, string> = {
  short:    "1–2 वाक्य (लगभग 20–35 शब्द)",
  medium:   "3–4 वाक्य (लगभग 45–70 शब्द)",
  detailed: "5–6 वाक्य (लगभग 80–110 शब्द)",
};

// ─── Visit labels ──────────────────────────────────────────────────────────────

const VISIT_EN: Record<VisitTypeKey, string> = {
  bought_phone: "bought a refurbished phone",
  sold_phone:   "sold a phone",
  repair:       "got a phone repaired",
  accessories:  "bought phone accessories",
};

const VISIT_HI: Record<VisitTypeKey, string> = {
  bought_phone: "पुराना मोबाइल खरीदा",
  sold_phone:   "मोबाइल बेचा",
  repair:       "मोबाइल की मरम्मत करवाई",
  accessories:  "मोबाइल का सामान खरीदा",
};

// ─── Diverse opening seeds ─────────────────────────────────────────────────────

const OPENERS_EN = [
  "Start with how long the process took or how quick things were.",
  "Start with what you were expecting before you came in.",
  "Start with the price or value for money.",
  "Start with what the staff did or said.",
  "Open with something you noticed as soon as you walked in.",
  "Start with the outcome — how you felt leaving the store.",
  "Open with 'Honestly,' or 'To be fair,' and go from there.",
  "Start with how this place compared to somewhere else you've been.",
  "Start with one specific thing that stood out to you.",
  "Open mid-action, e.g. 'Walked in not sure what to expect…'",
];

const OPENERS_HI = [
  "इस बार कितना समय लगा, उससे शुरू करो।",
  "पहले क्या उम्मीद थी, वहाँ से शुरू करो।",
  "दाम या पैसे की बात से शुरू करो।",
  "कर्मचारी ने क्या किया या कहा, उससे शुरू करो।",
  "दुकान में घुसते ही जो पहली बात नज़र आई, उससे शुरू करो।",
  "आखिर में कैसा महसूस हुआ, वहाँ से शुरू करो।",
  "'सच कहूं तो' या 'ईमानदारी से' से शुरू करो।",
  "किसी एक खास बात को पहले बताओ।",
  "'गया तो बिना सोचे था, लेकिन...' जैसे शुरुआत करो।",
  "दुकान का माहौल बताते हुए शुरू करो।",
];

function pickByEntropy(arr: string[], entropy: string): string {
  let h = 5381;
  for (let i = 0; i < entropy.length; i++) h = (h * 33 ^ entropy.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

// ─── Main builder ──────────────────────────────────────────────────────────────

export function buildPrompt(input: PromptInput): { system: string; user: string } {
  const storeName = input.customName || STORE_CONFIG.name;
  const entropy   = input.seed || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const isHindi   = input.lang === "hi";

  const opener = isHindi
    ? pickByEntropy(OPENERS_HI, entropy)
    : pickByEntropy(OPENERS_EN, entropy);

  const prevBlock =
    input.previousReviews && input.previousReviews.length > 0
      ? isHindi
        ? `\nये रिव्यू पहले दिखाए जा चुके हैं — इनसे बिल्कुल अलग लिखो:\n${input.previousReviews.map((r, i) => `${i + 1}. ${r.slice(0, 60)}…`).join("\n")}\n`
        : `\nThese reviews were already shown — write something completely different:\n${input.previousReviews.map((r, i) => `${i + 1}. ${r.slice(0, 60)}…`).join("\n")}\n`
      : "";

  // ── HINDI prompt (written in Hindi to prevent code-switching) ─────────────
  if (isHindi) {
    const toneHi: Record<number, string> = {
      5: "बहुत खुश और उत्साहित",
      4: "संतुष्ट और सकारात्मक",
      3: "संतुलित — अच्छी और सुधार वाली बात दोनों बताओ",
      2: "विनम्र लेकिन निराश",
      1: "विनम्र लेकिन स्पष्ट रूप से असंतुष्ट",
    };

    const system = `तुम एक असली ग्राहक हो जो Google Maps पर हिंदी में रिव्यू लिख रहे हो।

भाषा नियम (सख्त):
- पूरा रिव्यू केवल हिंदी में लिखो। एक भी अंग्रेज़ी शब्द नहीं आना चाहिए।
- "मोबाइल" लिखो, "phone" नहीं। "मरम्मत" लिखो, "repair" नहीं। "दुकान" लिखो, "store" नहीं। "कीमत" या "दाम" लिखो, "price" नहीं। "सेवा" लिखो, "service" नहीं। "गुणवत्ता" लिखो, "quality" नहीं। "कर्मचारी" लिखो, "staff" नहीं। "वारंटी" की जगह "गारंटी" लिखो।
- रोमन लिपि का एक भी अक्षर नहीं आना चाहिए।

फॉर्मेटिंग नियम:
- एक ही पैराग्राफ में लिखो। कोई हाइफन (-), बुलेट, नंबर या लिस्ट नहीं।
- कोई इमोजी, हैशटैग नहीं।

सामग्री नियम:
- टोन: ${toneHi[input.rating] ?? "ईमानदार"}। रेटिंग के अनुसार भाव रखो।
- लंबाई: ${LENGTH_HI[input.length]}।
- केवल दी गई जानकारी का उपयोग करो। कुछ मत गढ़ो।
- दुकान का नाम "${storeName}" एक बार से ज़्यादा मत लिखो।
- केवल रिव्यू टेक्स्ट लिखो — कोई शीर्षक, उद्धरण या प्रस्तावना नहीं।

विविधता (ज़रूरी):
- अनोखापन टोकन: ${entropy}
- शुरुआत: ${opener}
- हर बार अलग तरीके से शुरू करो, अलग वाक्य संरचना उपयोग करो।
${prevBlock}`;

    const user = `ग्राहक की जानकारी:
रेटिंग: ${input.rating}/5
दुकान पर क्यों आए: ${VISIT_HI[input.visitType]}
क्या पसंद आया: ${input.highlights.join(", ")}
${input.extraNote ? `ग्राहक ने यह भी कहा: "${input.extraNote}"` : ""}

अब रिव्यू लिखो।`;

    return { system, user };
  }

  // ── ENGLISH prompt ────────────────────────────────────────────────────────
  const toneEn: Record<number, string> = {
    5: "warm and genuinely enthusiastic",
    4: "positive and satisfied",
    3: "balanced — mention something good and one thing to improve",
    2: "politely disappointed",
    1: "politely but clearly dissatisfied, direct about the issue",
  };

  const system = `You are a real customer writing a short, authentic Google Maps review in plain English.

LANGUAGE: English only. Zero words from any other language.

FORMATTING:
- One continuous paragraph. Absolutely no hyphens (-), dashes (–), bullet points, asterisks (*), or numbered lists.
- No emojis or hashtags.

CONTENT:
- Tone: ${toneEn[input.rating] ?? "honest"}.
- Length: ${LENGTH_EN[input.length]}.
- Use only the facts given. Do not invent names, prices, models, or dates.
- Mention "${storeName}" at most once, only if it fits naturally.
- Output ONLY the review text — no intro, no quotes, no labels.

UNIQUENESS (critical):
- Entropy token: ${entropy}
- Opening instruction for this generation: ${opener}
- Never start with "I recently visited". Each generation must sound completely different.
${prevBlock}`;

  const user = `Customer details:
Rating: ${input.rating}/5
Reason for visit: ${VISIT_EN[input.visitType]}
What stood out: ${input.highlights.join(", ")}
${input.extraNote ? `Customer also noted: "${input.extraNote}"` : ""}

Write the review now.`;

  return { system, user };
}
