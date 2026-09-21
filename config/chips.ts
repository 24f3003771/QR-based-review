// Chip configuration: visit type × rating band → chips
// Rating bands: "high" (4-5), "mid" (3), "low" (1-2)

export type RatingBand = "high" | "mid" | "low";
export type VisitTypeKey = "bought_phone" | "sold_phone" | "repair" | "accessories";

export interface Chip {
  id: string;
  en: string;
  hi: string;
}

export const CHIPS: Record<VisitTypeKey, Record<RatingBand, Chip[]>> = {
  bought_phone: {
    high: [
      { id: "fair_price", en: "Fair price", hi: "उचित दाम" },
      { id: "honest_condition", en: "Condition exactly as described", hi: "जैसा बताया वैसा ही हालत" },
      { id: "warranty", en: "Warranty provided", hi: "वारंटी मिली" },
      { id: "battery_health", en: "Battery health as promised", hi: "बैटरी हेल्थ जैसा बताया" },
      { id: "staff_behaviour", en: "Helpful staff", hi: "अच्छा स्टाफ" },
      { id: "good_variety", en: "Good variety", hi: "अच्छी वैरायटी" },
      { id: "fast_service", en: "Fast service", hi: "जल्दी सेवा" },
      { id: "clear_paperwork", en: "Clear bill and paperwork", hi: "साफ बिल और कागज़" },
    ],
    mid: [
      { id: "price_fine", en: "Price was fine", hi: "दाम ठीक था" },
      { id: "staff_helpful", en: "Staff was helpful", hi: "स्टाफ मददगार था" },
      { id: "long_wait", en: "Wait time was long", hi: "इंतज़ार ज्यादा था" },
      { id: "fewer_options", en: "Fewer options than expected", hi: "उम्मीद से कम ऑप्शन" },
      { id: "condition_clearer", en: "Condition details could be clearer", hi: "हालत की जानकारी और साफ हो सकती थी" },
      { id: "honest_condition", en: "Condition as described", hi: "जैसा बताया वैसा" },
      { id: "warranty", en: "Warranty provided", hi: "वारंटी मिली" },
    ],
    low: [
      { id: "price_high", en: "Price felt high", hi: "दाम ज्यादा लगा" },
      { id: "condition_differed", en: "Condition differed from expectation", hi: "हालत उम्मीद से अलग थी" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "long_wait", en: "Long wait", hi: "लंबा इंतज़ार" },
      { id: "warranty_missing", en: "Warranty or after-sales unclear", hi: "वारंटी या आफ्टर-सेल्स अस्पष्ट" },
      { id: "phone_issue", en: "Phone developed an issue", hi: "फ़ोन में दिक्कत आई" },
    ],
  },
  sold_phone: {
    high: [
      { id: "fair_price", en: "Fair price offered", hi: "उचित दाम मिला" },
      { id: "quick_payment", en: "Quick payment", hi: "जल्दी पेमेंट" },
      { id: "easy_process", en: "Easy process", hi: "आसान प्रक्रिया" },
      { id: "honest_evaluation", en: "Honest evaluation", hi: "ईमानदारी से जांच" },
      { id: "staff_behaviour", en: "Helpful staff", hi: "अच्छा स्टाफ" },
    ],
    mid: [
      { id: "fair_price", en: "Price was okay", hi: "दाम ठीक था" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "process_slow", en: "Process was slow", hi: "प्रक्रिया धीमी थी" },
      { id: "evaluation_unclear", en: "Evaluation could be clearer", hi: "जांच और साफ हो सकती थी" },
      { id: "easy_process", en: "Easy process", hi: "आसान प्रक्रिया" },
    ],
    low: [
      { id: "price_low", en: "Offered price was too low", hi: "दिया गया दाम बहुत कम था" },
      { id: "payment_delayed", en: "Payment was delayed", hi: "पेमेंट में देरी हुई" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "evaluation_unfair", en: "Evaluation felt unfair", hi: "जांच सही नहीं लगी" },
      { id: "process_confusing", en: "Process was confusing", hi: "प्रक्रिया समझ नहीं आई" },
    ],
  },
  repair: {
    high: [
      { id: "fast_repair", en: "Fast repair", hi: "जल्दी मरम्मत" },
      { id: "fair_charges", en: "Fair charges", hi: "उचित शुल्क" },
      { id: "quality_work", en: "Quality work", hi: "अच्छा काम" },
      { id: "clear_explanation", en: "Clear explanation", hi: "साफ जानकारी" },
      { id: "staff_behaviour", en: "Helpful staff", hi: "अच्छा स्टाफ" },
    ],
    mid: [
      { id: "fair_charges", en: "Charges were okay", hi: "शुल्क ठीक था" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "repair_slow", en: "Repair took longer than expected", hi: "मरम्मत में ज्यादा समय लगा" },
      { id: "explanation_missing", en: "Explanation could be clearer", hi: "जानकारी और स्पष्ट हो सकती थी" },
      { id: "quality_work", en: "Good work quality", hi: "अच्छी क्वालिटी" },
    ],
    low: [
      { id: "charges_high", en: "Charges felt too high", hi: "शुल्क बहुत ज्यादा लगा" },
      { id: "quality_poor", en: "Quality was not good", hi: "क्वालिटी अच्छी नहीं थी" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "repair_slow", en: "Repair took very long", hi: "मरम्मत में बहुत देर लगी" },
      { id: "issue_persists", en: "Issue still persists", hi: "दिक्कत अभी भी है" },
    ],
  },
  accessories: {
    high: [
      { id: "fair_price", en: "Fair price", hi: "उचित दाम" },
      { id: "original_quality", en: "Original quality", hi: "असली क्वालिटी" },
      { id: "good_variety", en: "Good variety", hi: "अच्छी वैरायटी" },
      { id: "staff_behaviour", en: "Helpful staff", hi: "अच्छा स्टाफ" },
    ],
    mid: [
      { id: "fair_price", en: "Price was okay", hi: "दाम ठीक था" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "limited_variety", en: "Limited variety", hi: "सीमित वैरायटी" },
      { id: "original_quality", en: "Good quality", hi: "अच्छी क्वालिटी" },
    ],
    low: [
      { id: "price_high", en: "Price felt high", hi: "दाम ज्यादा लगा" },
      { id: "quality_poor", en: "Quality was not good", hi: "क्वालिटी अच्छी नहीं थी" },
      { id: "staff_behaviour", en: "Staff behavior", hi: "स्टाफ का व्यवहार" },
      { id: "limited_variety", en: "Very limited options", hi: "बहुत कम ऑप्शन" },
    ],
  },
};

export function getRatingBand(rating: number): RatingBand {
  if (rating >= 4) return "high";
  if (rating === 3) return "mid";
  return "low";
}

export function getChips(visitType: VisitTypeKey, rating: number): Chip[] {
  const band = getRatingBand(rating);
  return CHIPS[visitType][band];
}
