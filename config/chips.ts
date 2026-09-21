// ─── Master chip pool ─────────────────────────────────────────────────────────
// 50 chips total across 4 visit types. On every screen render,
// 6 are picked at random from the relevant category.

export type VisitTypeKey = "bought_phone" | "sold_phone" | "repair" | "accessories";

export interface Chip {
  id: string;
  en: string;
  hi: string;
}

// ─── All chips by visit type (12-15 each) ────────────────────────────────────

const POOL: Record<VisitTypeKey, Chip[]> = {
  bought_phone: [
    { id: "bp_01", en: "Fair price",                 hi: "उचित दाम" },
    { id: "bp_02", en: "Condition as described",     hi: "बताई हुई हालत" },
    { id: "bp_03", en: "Warranty given",             hi: "वारंटी मिली" },
    { id: "bp_04", en: "Good battery health",        hi: "बैटरी ठीक थी" },
    { id: "bp_05", en: "Helpful staff",              hi: "अच्छा व्यवहार" },
    { id: "bp_06", en: "Good variety",               hi: "अच्छा चुनाव" },
    { id: "bp_07", en: "Fast service",               hi: "जल्दी सेवा" },
    { id: "bp_08", en: "Clear paperwork",            hi: "साफ कागज़ात" },
    { id: "bp_09", en: "Genuine product",            hi: "असली माल" },
    { id: "bp_10", en: "No hidden charges",          hi: "कोई छुपा शुल्क नहीं" },
    { id: "bp_11", en: "Easy exchange policy",       hi: "आसान बदलाव नीति" },
    { id: "bp_12", en: "Trustworthy store",          hi: "भरोसेमंद दुकान" },
    { id: "bp_13", en: "Good after-sales support",  hi: "बिक्री के बाद सहायता" },
    { id: "bp_14", en: "Multiple options shown",     hi: "कई विकल्प दिखाए" },
    { id: "bp_15", en: "Quick checkout",             hi: "जल्दी बिलिंग" },
  ],
  sold_phone: [
    { id: "sp_01", en: "Fair price offered",         hi: "उचित दाम मिला" },
    { id: "sp_02", en: "Quick payment",              hi: "जल्दी पेमेंट" },
    { id: "sp_03", en: "Easy process",              hi: "आसान प्रक्रिया" },
    { id: "sp_04", en: "Honest evaluation",          hi: "ईमानदारी से जांच" },
    { id: "sp_05", en: "Helpful staff",              hi: "अच्छा व्यवहार" },
    { id: "sp_06", en: "No unnecessary deductions",  hi: "बेकार कटौती नहीं" },
    { id: "sp_07", en: "Transparent pricing",        hi: "साफ दाम बताए" },
    { id: "sp_08", en: "Safe data handling",         hi: "डेटा सुरक्षित" },
    { id: "sp_09", en: "UPI / online payment",       hi: "UPI से पेमेंट" },
    { id: "sp_10", en: "Clear evaluation steps",     hi: "जांच की जानकारी" },
    { id: "sp_11", en: "Respectful staff",           hi: "इज़्ज़त से बात" },
    { id: "sp_12", en: "No pressure tactics",        hi: "दबाव नहीं डाला" },
    { id: "sp_13", en: "Immediate offer given",      hi: "तुरंत ऑफर मिला" },
  ],
  repair: [
    { id: "rp_01", en: "Fast repair",               hi: "जल्दी मरम्मत" },
    { id: "rp_02", en: "Fair charges",              hi: "उचित शुल्क" },
    { id: "rp_03", en: "Quality work",              hi: "अच्छा काम" },
    { id: "rp_04", en: "Clear explanation",         hi: "साफ जानकारी" },
    { id: "rp_05", en: "Helpful staff",             hi: "अच्छा व्यवहार" },
    { id: "rp_06", en: "Genuine spare parts",       hi: "असली पुर्ज़े" },
    { id: "rp_07", en: "No hidden charges",         hi: "कोई छुपा शुल्क नहीं" },
    { id: "rp_08", en: "Phone works like new",      hi: "मोबाइल बिल्कुल नया लगा" },
    { id: "rp_09", en: "Ready on time",             hi: "समय पर तैयार" },
    { id: "rp_10", en: "Diagnosed correctly",       hi: "सही से पहचान की" },
    { id: "rp_11", en: "Warranty on repair",        hi: "मरम्मत पर वारंटी" },
    { id: "rp_12", en: "Polite communication",      hi: "शालीनता से बात" },
    { id: "rp_13", en: "Affordable",               hi: "किफायती" },
  ],
  accessories: [
    { id: "ac_01", en: "Fair price",               hi: "उचित दाम" },
    { id: "ac_02", en: "Original quality",         hi: "असली गुणवत्ता" },
    { id: "ac_03", en: "Good variety",             hi: "अच्छा चुनाव" },
    { id: "ac_04", en: "Helpful staff",            hi: "अच्छा व्यवहार" },
    { id: "ac_05", en: "Fast service",             hi: "जल्दी सेवा" },
    { id: "ac_06", en: "Packed well",              hi: "अच्छी पैकिंग" },
    { id: "ac_07", en: "No pressure to buy",       hi: "ज़बरदस्ती नहीं" },
    { id: "ac_08", en: "Return policy explained",  hi: "वापसी नीति बताई" },
    { id: "ac_09", en: "Branded accessories",      hi: "ब्रांडेड सामान" },
    { id: "ac_10", en: "Good recommendation",      hi: "सही सुझाव मिला" },
    { id: "ac_11", en: "No hidden charges",        hi: "कोई छुपा शुल्क नहीं" },
    { id: "ac_12", en: "Wide range available",     hi: "कई तरह का सामान" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Shuffle an array in place (Fisher-Yates) and return it */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Return COUNT randomly picked chips for a given visit type.
 * The same session always sees a fresh random draw.
 */
export function getRandomChips(visitType: VisitTypeKey, count = 6): Chip[] {
  return shuffle(POOL[visitType]).slice(0, count);
}

/** Legacy compat – kept for any imports still using getChips */
export function getChips(visitType: VisitTypeKey, _rating: number): Chip[] {
  return getRandomChips(visitType, 6);
}
