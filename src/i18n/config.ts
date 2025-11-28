import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, ja } from "./locales";
import type { Language } from "@/domain/settings/models/settings";

export const defaultNS = "translation";

export const resources = {
  en: { translation: en },
  ja: { translation: ja },
} as const;

export const supportedLanguages: { code: Language; name: string; nativeName: string }[] = [
  { code: "system", name: "System", nativeName: "System" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
];

// Get browser/system language
const getSystemLanguage = (): string => {
  // Try chrome.i18n first (available in extension context)
  if (typeof chrome !== "undefined" && chrome.i18n?.getUILanguage) {
    const lang = chrome.i18n.getUILanguage();
    return lang.startsWith("ja") ? "ja" : "en";
  }

  // Fallback to navigator.language
  if (typeof navigator !== "undefined") {
    const lang = navigator.language;
    return lang.startsWith("ja") ? "ja" : "en";
  }

  return "en";
};

// Resolve language setting to actual language code
export const resolveLanguage = (setting: Language): string => {
  if (setting === "system") {
    return getSystemLanguage();
  }
  return setting;
};

// Change language dynamically
export const changeLanguage = (language: Language): void => {
  const resolvedLang = resolveLanguage(language);
  i18n.changeLanguage(resolvedLang);
};

// Initialize with system language, will be updated when settings are loaded
i18n.use(initReactI18next).init({
  resources,
  lng: getSystemLanguage(),
  fallbackLng: "en",
  defaultNS,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for Chrome extension compatibility
  },
});

export default i18n;
