import type { Lang } from "@/lib/i18n";
import type { VisitTypeKey } from "@/config/chips";

type RatingBand = "high" | "mid" | "low";
type LengthKey = "short" | "medium" | "detailed";

function getBand(rating: number): RatingBand {
  if (rating >= 4) return "high";
  if (rating === 3) return "mid";
  return "low";
}

// ─── Snippet banks ────────────────────────────────────────────────────────────

const SNIPPETS: Record<
  VisitTypeKey,
  Record<RatingBand, Record<Lang, Record<LengthKey, string[]>>>
> = {
  bought_phone: {
    high: {
      en: {
        short: [
          "Picked up a refurbished phone here and was really impressed. The condition matched the description perfectly.",
          "Great experience buying a refurbished phone. Everything was transparent and the staff was helpful.",
          "Bought a phone here and couldn't be happier — fair deal, great condition, no surprises.",
        ],
        medium: [
          "Bought a refurbished phone from here and the experience was very good. The phone's condition was exactly as described and nothing was hidden. The staff was polite and answered all my questions. Would definitely recommend.",
          "Had a smooth experience buying a refurbished phone. The price was fair, the condition matched what was shown, and I got a warranty too. The whole process was quick and transparent.",
          "Really satisfied with my purchase. The phone was in exactly the condition they described, the paperwork was clear, and the team was genuinely helpful. Good place to trust for refurbished phones.",
        ],
        detailed: [
          "I was a bit nervous buying a refurbished phone, but this store completely changed my mind. The phone's condition was exactly as described — no scratches they hadn't mentioned, battery was as promised. The staff explained everything clearly and never tried to push me toward something I didn't need. I also got a proper warranty, which gave me confidence. The whole process was smooth, the billing was transparent, and I walked out satisfied. Highly recommend to anyone looking for a trustworthy place to buy refurbished phones.",
          "Bought a refurbished phone here and the experience exceeded my expectations. From the moment I walked in, the staff was welcoming and knowledgeable. They showed me multiple options at fair prices and were honest about each phone's condition. The one I chose matched the description exactly — battery health, condition, everything. Got a proper warranty and clear paperwork. Service was fast too. Will definitely come back and recommend this place to friends and family.",
        ],
      },
      hi: {
        short: [
          "यहाँ से refurbished phone लिया और बहुत अच्छा लगा। phone की हालत बिल्कुल वैसी ही थी जैसा बताया गया था।",
          "phone खरीदने का अनुभव बढ़िया रहा। दाम उचित था और staff ने अच्छे से help की।",
          "बहुत अच्छा experience रहा — fair deal, सही हालत, कोई छुपी बात नहीं।",
        ],
        medium: [
          "यहाँ से refurbished phone खरीदा और अनुभव बहुत अच्छा रहा। phone की हालत बिल्कुल वैसी थी जैसा describe किया गया था, कुछ भी छुपाया नहीं गया था। warranty भी मिली जिससे confidence बढ़ा। staff का व्यवहार भी अच्छा था।",
          "phone खरीदने का पूरा process smooth रहा। दाम सही था, condition match किया, और warranty भी मिली। billing भी clear थी। दोबारा आना पसंद करूंगा।",
          "काफी satisfy हुआ खरीदारी से। phone की हालत exactly वैसी ही थी, staff ने सब कुछ अच्छे से समझाया, और पूरी प्रक्रिया transparent थी। refurbished phone के लिए यह एक भरोसेमंद जगह है।",
        ],
        detailed: [
          "refurbished phone खरीदने में थोड़ी हिचकिचाहट थी, लेकिन इस दुकान ने सोच बदल दी। phone की हालत बिल्कुल वैसी थी — battery health, condition, सब कुछ। staff ने सब कुछ clearly समझाया और कोई pressure नहीं दिया। warranty भी मिली जो बहुत ज़रूरी है। billing transparent थी और पूरा process जल्दी हुआ। यह दुकान refurbished phone के लिए सच में भरोसेमंद है। ज़रूर recommend करूंगा।",
        ],
      },
    },
    mid: {
      en: {
        short: [
          "The phone and the price were both okay, but the wait was a bit longer than expected. Overall an average experience.",
          "Decent experience buying a refurbished phone. A few things could be smoother, but overall okay.",
        ],
        medium: [
          "Bought a phone here — the price was reasonable and the condition was fine. However, the wait time was longer than I hoped and I felt the options were a bit limited. Not bad overall, but there's room for improvement.",
          "The experience was average. The phone I got is working well, and the staff was helpful enough, but the process could have been quicker and the explanation about the phone's condition could have been clearer.",
        ],
        detailed: [
          "Had a mixed experience buying a refurbished phone here. On the positive side, the price was fair and the staff was polite. The phone seems to be in decent condition. However, the wait time was quite long and I felt the variety of options was limited compared to what I expected. The explanation about the phone's history could also have been more detailed. Overall, it's an okay place, but I hope they can improve on these areas.",
        ],
      },
      hi: {
        short: [
          "phone और दाम दोनों ठीक थे, लेकिन इंतज़ार थोड़ा ज़्यादा लगा। कुल मिलाकर average experience रहा।",
          "ठीक-ठाक अनुभव रहा। कुछ चीज़ें बेहतर हो सकती थीं, लेकिन overall okay था।",
        ],
        medium: [
          "यहाँ से phone खरीदा — दाम उचित था और हालत भी ठीक थी। लेकिन इंतज़ार थोड़ा ज़्यादा हुआ और options कम लगे। बुरा नहीं था, लेकिन सुधार की गुंजाइश है।",
          "average experience रहा। phone सही है और staff helpful था, लेकिन process थोड़ा slower था और phone की हालत के बारे में जानकारी और clear हो सकती थी।",
        ],
        detailed: [
          "यहाँ phone खरीदने का mixed experience रहा। अच्छी बात यह थी कि दाम सही था और staff polite था। phone की हालत ठीक है। लेकिन इंतज़ार काफी लंबा था और options उम्मीद से कम थे। phone की history के बारे में और detail में बताया जाता तो अच्छा होता। कुल मिलाकर ठीक जगह है, उम्मीद है कि ये चीज़ें बेहतर होंगी।",
        ],
      },
    },
    low: {
      en: {
        short: [
          "The phone's condition wasn't quite what I was told. Disappointed with the experience.",
          "Unfortunately didn't have a great experience. The condition differed from what was described.",
        ],
        medium: [
          "The phone's condition was not quite what I expected based on what I was told. I felt the explanation from the staff could have been clearer. I hope this can be improved for future customers.",
          "I had a disappointing experience. The phone I received had issues that weren't mentioned beforehand, and getting clarity from the staff was difficult. I hope the store improves its transparency.",
        ],
        detailed: [
          "I was really disappointed with my experience here. The phone's condition was noticeably different from what was described to me before the purchase. When I raised concerns, the response wasn't very satisfying. I feel the store needs to be more transparent about the actual condition of their phones and improve how they handle customer concerns. I'd also suggest clearer after-sales support. I'm sharing this honestly so future customers have a better experience.",
        ],
      },
      hi: {
        short: [
          "phone की हालत वैसी नहीं थी जैसा बताया गया था। निराशाजनक अनुभव रहा।",
          "अच्छा अनुभव नहीं रहा। जो condition बताई थी वह match नहीं हुई।",
        ],
        medium: [
          "phone की हालत उम्मीद से अलग निकली। staff से जानकारी लेना मुश्किल था। उम्मीद है कि आगे के customers के लिए यह बेहतर होगा।",
          "निराशाजनक अनुभव रहा। phone में कुछ दिक्कतें थीं जो पहले नहीं बताई गई थीं। दुकान को अपनी transparency सुधारनी चाहिए।",
        ],
        detailed: [
          "यहाँ का अनुभव काफी निराशाजनक रहा। phone की हालत उससे काफी अलग थी जो खरीदने से पहले बताई गई थी। जब concern रखा तो response satisfying नहीं था। दुकान को अपने phones की असली condition के बारे में transparent होना चाहिए और customer की बात को बेहतर तरीके से handle करना चाहिए। यह feedback इसलिए share कर रहा हूं ताकि आगे के customers को बेहतर अनुभव मिले।",
        ],
      },
    },
  },
  sold_phone: {
    high: {
      en: {
        short: [
          "Sold my old phone here — got a fair price and quick payment. Really smooth process.",
          "Hassle-free experience selling my phone. Honest evaluation and fast payment.",
        ],
        medium: [
          "Sold my phone here and had a great experience. The evaluation was honest, the price offered was fair, and the payment was processed quickly. The staff made the whole process easy and transparent.",
          "Really impressed with how smooth the selling process was. They gave me a fair evaluation, explained everything clearly, and paid quickly. Would definitely sell here again.",
        ],
        detailed: [
          "Selling my old phone here was one of the smoothest experiences I've had. The staff evaluated the phone honestly, didn't lowball me, and explained exactly how they arrived at the price. Payment was processed quickly with no drama. The paperwork was clear and straightforward. I felt like I was dealing with trustworthy people throughout. Will definitely come back next time I need to sell a device.",
        ],
      },
      hi: {
        short: [
          "यहाँ पुराना phone बेचा — उचित दाम मिला और payment जल्दी हुई। बहुत smooth process था।",
          "phone बेचने का अच्छा अनुभव रहा। honest evaluation और जल्दी payment।",
        ],
        medium: [
          "यहाँ phone बेचा और बहुत अच्छा अनुभव रहा। evaluation honest था, दाम fair था, और payment जल्दी हुई। staff ने पूरा process आसान बना दिया।",
          "phone बेचने का process बहुत smooth रहा। fair evaluation, साफ जानकारी, और जल्दी payment। दोबारा यहाँ आना पसंद करूंगा।",
        ],
        detailed: [
          "यहाँ पुराना phone बेचना बहुत अच्छा अनुभव रहा। staff ने honestly evaluate किया, price कैसे decide हुई वो explain किया, और payment जल्दी हुई। कागज़ात भी clear थे। पूरे process में trust feel हुआ। अगली बार device बेचना हो तो यहीं आऊंगा।",
        ],
      },
    },
    mid: {
      en: {
        short: [
          "Sold my phone here — price was okay but the process took longer than I expected.",
          "Average experience selling my phone. Got a fair enough price but the wait was long.",
        ],
        medium: [
          "Sold my phone here and the experience was average. The price was reasonable, but the process was slower than expected and the evaluation could have been explained more clearly. Overall okay.",
        ],
        detailed: [
          "Had a mixed experience selling my phone here. The price offered was acceptable, and the staff was polite. However, the whole process took considerably longer than I anticipated, and I felt the evaluation process could have been explained more transparently. There's room for improvement, but it wasn't a bad experience overall.",
        ],
      },
      hi: {
        short: [
          "यहाँ phone बेचा — दाम ठीक था लेकिन process उम्मीद से ज़्यादा समय लगा।",
          "average अनुभव रहा। दाम okay था लेकिन इंतज़ार लंबा था।",
        ],
        medium: [
          "phone बेचने का experience average रहा। दाम reasonable था, लेकिन process slow था और evaluation और clearly explain हो सकती थी। कुल मिलाकर ठीक।",
        ],
        detailed: [
          "यहाँ phone बेचने का mixed experience रहा। दाम acceptable था और staff polite था। लेकिन process काफी लंबा था और evaluation को और transparently explain किया जा सकता था। कुल मिलाकर बुरा नहीं, लेकिन सुधार की गुंजाइश है।",
        ],
      },
    },
    low: {
      en: {
        short: [
          "The price offered for my phone was too low and the process was frustrating.",
          "Disappointing experience. Felt the evaluation wasn't fair and the process was confusing.",
        ],
        medium: [
          "Was disappointed with the price offered for my phone — it felt much lower than what the phone was worth. The evaluation process also wasn't explained clearly. I hope they improve transparency for future customers.",
        ],
        detailed: [
          "Had a frustrating experience trying to sell my phone here. The price they offered felt significantly lower than the actual market value, and when I asked for a breakdown of how they arrived at that price, the explanation wasn't satisfying. The process was also quite slow and confusing. I'd encourage the store to be more transparent about their evaluation criteria so customers can make informed decisions.",
        ],
      },
      hi: {
        short: [
          "phone के लिए जो दाम दिया वो बहुत कम था। निराशाजनक अनुभव रहा।",
          "निराशाजनक। evaluation fair नहीं लगी और process confusing था।",
        ],
        medium: [
          "phone के लिए मिला दाम उम्मीद से काफी कम था। evaluation process clearly explain नहीं हुई। उम्मीद है आगे के customers को बेहतर अनुभव मिलेगा।",
        ],
        detailed: [
          "यहाँ phone बेचने का अनुभव frustrating रहा। जो दाम ऑफर हुआ वो market value से काफी कम था, और जब breakdown मांगी तो जवाब satisfying नहीं था। process भी slow और confusing था। दुकान को अपने evaluation criteria के बारे में transparent होना चाहिए।",
        ],
      },
    },
  },
  repair: {
    high: {
      en: {
        short: [
          "Fast and quality repair at a fair price. Very satisfied with the service.",
          "Got my phone repaired here — excellent work, reasonable charges, quick turnaround.",
        ],
        medium: [
          "Had my phone repaired here and was really impressed. The repair was done quickly, the charges were fair, and the work quality is great. The staff explained what the issue was and what they'd do to fix it. Very happy with the result.",
          "Great repair experience. Brought my phone in with a serious issue and they fixed it efficiently at a fair price. The staff was knowledgeable and the turnaround time was quick. Will definitely come back for any future repairs.",
        ],
        detailed: [
          "Really glad I chose this place for my phone repair. The staff diagnosed the issue quickly and explained what needed to be done without overcomplicating it. The charges were transparent and fair — no hidden costs. The repair quality is excellent; the phone feels as good as new. They also finished the work faster than I expected. Very professional service overall. This will be my go-to place for all phone repairs going forward.",
        ],
      },
      hi: {
        short: [
          "जल्दी और quality repair, उचित शुल्क पर। service से बहुत खुश हूं।",
          "यहाँ phone की repair करवाई — बेहतरीन काम, सही charges, जल्दी हुई।",
        ],
        medium: [
          "यहाँ phone repair करवाई और बहुत प्रभावित हुआ। repair जल्दी हुई, charges fair थे, और काम की quality अच्छी है। staff ने problem और solution clearly बताया। result से बहुत खुश हूं।",
          "अच्छा repair अनुभव रहा। phone में serious problem था, उन्होंने efficiently fix किया और fair price लिया। staff knowledgeable था और जल्दी काम हुआ। आगे भी यहीं आऊंगा।",
        ],
        detailed: [
          "यहाँ phone repair के लिए लाया और बहुत अच्छा किया। staff ने जल्दी diagnose किया और बिना confusion के समझाया। charges transparent और fair थे — कोई hidden cost नहीं। repair quality excellent है, phone बिल्कुल नया जैसा लगता है। उम्मीद से जल्दी काम हुआ। बहुत professional service। यह जगह आगे के लिए मेरी पहली choice होगी।",
        ],
      },
    },
    mid: {
      en: {
        short: [
          "Phone got repaired okay, but the wait was longer than expected. Charges were reasonable.",
          "Decent repair experience. Work was done but took more time than I'd hoped.",
        ],
        medium: [
          "Got my phone repaired here. The quality of work seems fine and the charges were reasonable. However, it took longer than I expected and I felt the explanation of what exactly was done could have been clearer. Overall okay experience.",
        ],
        detailed: [
          "Mixed experience getting my phone repaired here. The actual repair work is decent quality and the pricing was fair. But the wait time was considerably longer than quoted, and the staff could have communicated better about the progress. I'd appreciate more transparency about what exactly was done. Not a bad place, but there's room to improve the overall customer experience.",
        ],
      },
      hi: {
        short: [
          "phone repair हो गया, लेकिन इंतज़ार ज़्यादा था। charges ठीक थे।",
          "ठीक-ठाक repair अनुभव। काम हुआ लेकिन समय ज़्यादा लगा।",
        ],
        medium: [
          "यहाँ phone repair हुई। काम की quality ठीक लगती है और charges reasonable थे। लेकिन उम्मीद से ज़्यादा समय लगा और क्या-क्या हुआ यह और clearly बताया जा सकता था। कुल मिलाकर okay experience।",
        ],
        detailed: [
          "यहाँ phone repair का mixed experience रहा। repair quality ठीक है और pricing fair था। लेकिन wait time बताए गए से काफी ज़्यादा था और staff progress के बारे में better communicate कर सकता था। क्या exactly हुआ उसकी और transparency होनी चाहिए। बुरी जगह नहीं, लेकिन customer experience बेहतर हो सकता है।",
        ],
      },
    },
    low: {
      en: {
        short: [
          "Disappointed with the repair. The issue wasn't fully resolved and charges felt high.",
          "Unfortunately the repair didn't meet my expectations. The problem still persists.",
        ],
        medium: [
          "Had a disappointing repair experience. The charges were higher than quoted and the issue with my phone wasn't fully resolved. The staff could have been more transparent about what they could and couldn't fix. I hope they improve.",
        ],
        detailed: [
          "Really disappointed with the repair service here. The charges ended up being higher than what was initially quoted, and despite paying, the original issue with my phone still persists. When I raised this concern, the response wasn't satisfactory. I believe the store should be more upfront about repair limitations and should honor their initial quotes. Sharing this so others can make an informed decision.",
        ],
      },
      hi: {
        short: [
          "repair से निराश हूं। दिक्कत पूरी तरह ठीक नहीं हुई और charges ज़्यादा लगे।",
          "repair से उम्मीद पूरी नहीं हुई। समस्या अभी भी है।",
        ],
        medium: [
          "repair का अनुभव निराशाजनक रहा। charges बताए से ज़्यादा लिए और phone की दिक्कत पूरी तरह ठीक नहीं हुई। staff को ज़्यादा transparent होना चाहिए था। उम्मीद है सुधार होगा।",
        ],
        detailed: [
          "यहाँ repair service से काफी निराश हूं। charges पहले बताए से ज़्यादा निकले, और payment के बावजूद phone की दिक्कत अभी भी है। concern रखने पर जवाब satisfying नहीं था। दुकान को अपनी limitations के बारे में पहले से बताना चाहिए और quotes honor करने चाहिए। यह इसलिए share कर रहा हूं ताकि बाकी लोग informed decision ले सकें।",
        ],
      },
    },
  },
  accessories: {
    high: {
      en: {
        short: [
          "Great selection of accessories at fair prices. Very happy with my purchase.",
          "Found exactly what I needed at a good price. Staff was helpful too.",
        ],
        medium: [
          "Bought some accessories here and had a great experience. They had a good variety to choose from, the prices were fair, and the quality seems genuine. The staff helped me pick the right option without any pressure.",
          "Really satisfied with the accessories I bought here. Good variety, reasonable prices, and the quality is original. Staff was friendly and knowledgeable. Will definitely shop here again.",
        ],
        detailed: [
          "Came here looking for phone accessories and left very satisfied. The store had a great variety of genuine accessories at fair prices. The staff was helpful in guiding me to what I actually needed rather than pushing expensive options. The quality of what I bought is clearly original. The whole shopping experience was smooth and pleasant. Will definitely come back for future accessory needs and recommend this place to others.",
        ],
      },
      hi: {
        short: [
          "accessories का अच्छा selection, fair price पर। खरीदारी से बहुत खुश हूं।",
          "सही चीज़ सही दाम पर मिली। staff ने अच्छे से help की।",
        ],
        medium: [
          "यहाँ से accessories खरीदीं और बहुत अच्छा अनुभव रहा। अच्छी variety थी, दाम fair थे, और quality genuine लगती है। staff ने बिना pressure के सही option choose करने में मदद की।",
          "यहाँ से खरीदी accessories से बहुत satisfy हूं। अच्छी variety, reasonable price, और quality original है। staff friendly और knowledgeable था। दोबारा यहाँ आऊंगा।",
        ],
        detailed: [
          "यहाँ accessories लेने आया और बहुत satisfy होकर गया। genuine accessories का अच्छा selection fair price पर था। staff ने actual ज़रूरत के हिसाब से guide किया, expensive options push नहीं किए। quality clearly original है। पूरा shopping experience smooth और pleasant था। आगे भी यहाँ आऊंगा और दूसरों को भी recommend करूंगा।",
        ],
      },
    },
    mid: {
      en: {
        short: [
          "Average experience buying accessories. Got what I needed but the variety was limited.",
          "Okay experience. Prices were fine but didn't have everything I was looking for.",
        ],
        medium: [
          "Bought accessories here and the experience was average. The prices were reasonable and the staff was helpful, but the variety was more limited than I expected. Got what I needed but had to compromise on choices.",
        ],
        detailed: [
          "Mixed experience buying accessories here. The prices were fair and the staff was courteous. However, the variety of accessories available was more limited than I'd hoped — they didn't carry everything I was looking for. The quality of what I did buy seems okay. Overall an average experience with room for improvement in their stock variety.",
        ],
      },
      hi: {
        short: [
          "accessories खरीदने का average अनुभव। काम की चीज़ मिली लेकिन variety कम थी।",
          "ठीक-ठाक अनुभव। दाम ठीक थे लेकिन जो चाहिए था वो नहीं था।",
        ],
        medium: [
          "यहाँ accessories खरीदीं — experience average रहा। दाम reasonable थे और staff helpful था, लेकिन variety उम्मीद से कम थी। ज़रूरत की चीज़ मिली लेकिन choice कम था।",
        ],
        detailed: [
          "यहाँ accessories खरीदने का mixed experience रहा। दाम fair थे और staff courteous था। लेकिन accessories की variety उम्मीद से कम थी — सब कुछ नहीं मिला। जो खरीदा उसकी quality ठीक लगती है। कुल मिलाकर average experience — stock variety बेहतर हो सकती है।",
        ],
      },
    },
    low: {
      en: {
        short: [
          "Disappointed with the accessories. Quality didn't seem original and the price felt high.",
          "Not a great experience. The quality was questionable and the staff wasn't very helpful.",
        ],
        medium: [
          "Had a disappointing experience buying accessories here. The quality of what I bought seems questionable — it doesn't feel like original product. The price was also higher than what I'd expect for the quality. I'd recommend being more transparent about the quality of accessories sold.",
        ],
        detailed: [
          "Really disappointed with my purchase of accessories here. The quality doesn't match what was implied at the time of sale — it doesn't seem like genuine product. The price felt high given the quality. When I raised concerns, the response wasn't satisfactory. I think the store should be more transparent about the authenticity and quality of their accessories so customers aren't misled.",
        ],
      },
      hi: {
        short: [
          "accessories से निराश हूं। quality original नहीं लगी और दाम ज़्यादा था।",
          "अच्छा अनुभव नहीं रहा। quality संदिग्ध थी और staff बहुत helpful नहीं था।",
        ],
        medium: [
          "यहाँ accessories खरीदने का निराशाजनक अनुभव रहा। quality questionable लग रही है — original product नहीं लगता। quality के हिसाब से दाम भी ज़्यादा था। accessories की quality के बारे में ज़्यादा transparent होना चाहिए।",
        ],
        detailed: [
          "accessories की खरीदारी से काफी निराश हूं। जो बेचते वक्त imply हुआ था, quality उससे match नहीं करती — genuine product नहीं लगती। quality के हिसाब से price ज़्यादा था। concern raise करने पर जवाब satisfying नहीं था। दुकान को accessories की authenticity और quality के बारे में transparent होना चाहिए ताकि customers को सही जानकारी मिले।",
        ],
      },
    },
  },
};

export interface FallbackInput {
  lang: Lang;
  rating: number;
  visitType: VisitTypeKey;
  length: LengthKey;
}

export function getFallbackReview(input: FallbackInput): string {
  const band = getBand(input.rating);
  const pool = SNIPPETS[input.visitType][band][input.lang][input.length];
  // Truly random pick — never the same twice in a row
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
