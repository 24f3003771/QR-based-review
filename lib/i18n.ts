import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

export type Lang = "en" | "hi";

const locales: Record<Lang, Record<string, string>> = { en, hi };

/**
 * Translate a key into the given language, interpolating {vars}.
 * Falls back to English if the key is missing in the target language.
 */
export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const dict = locales[lang];
  let str = dict[key] ?? locales["en"][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("hi")) return "hi";
  return "en";
}
