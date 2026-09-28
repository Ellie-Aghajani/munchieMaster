import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";
import en from "./en.json";
import fa from "./fa.json";

const STORAGE_KEY = "language";
export const LANGUAGES = ["en", "fa"];

// The saved choice wins; otherwise use Persian when the browser prefers it
const initialLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch (error) {
    // Storage can be unavailable (e.g. private browsing); fall through
  }
  return navigator.language?.toLowerCase().startsWith("fa") ? "fa" : "en";
};

// Keep <html lang/dir> in sync so the browser, screen readers and CSS agree
const applyToDocument = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = i18n.dir(language);
  // The server sends recipes translated into this language
  axios.defaults.headers.common["Accept-Language"] = language;
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fa: { translation: fa } },
  lng: initialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React already escapes
});

applyToDocument(i18n.language);
i18n.on("languageChanged", (language) => {
  applyToDocument(language);
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    // Not saving the preference is fine
  }
});

export default i18n;
