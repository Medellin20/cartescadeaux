"use client";

import { createContext, useContext, useEffect, useState } from "react";
import translations from "@/lib/i18n/translations.json";

export const LANGUAGES = [
  { code: "fr", name: "Français" }, { code: "en", name: "English" },
  { code: "de", name: "Deutsch" }, { code: "es", name: "Español" },
  { code: "it", name: "Italiano" }, { code: "nl", name: "Nederlands" },
];
const LanguageContext = createContext({ language: "fr", setLanguage: () => {}, t: (text) => text });
const STORAGE_KEY = "cartes-cadeaux-language";
const supported = (code) => LANGUAGES.some((item) => item.code === code);

export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState("fr");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (supported(saved)) updateLanguage(saved);
    } catch { /* Language selection also works when browser storage is unavailable. */ }
    const sync = (event) => {
      if (event.key === STORAGE_KEY) updateLanguage(supported(event.newValue) ? event.newValue : "fr");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function setLanguage(code) {
    if (!supported(code)) return;
    updateLanguage(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }
  function t(text, values = {}) {
    const source = typeof text === "string" ? text : "";
    const translated = translations[language]?.[source] ?? source;
    return translated.replace(/\{(\w+)\}/g, (match, key) => values[key] === undefined ? match : String(values[key]));
  }
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export function T({ children, values = {}, translatedValues = {} }) {
  const { t } = useLanguage();
  if (typeof children !== "string") return children;
  const localized = Object.fromEntries(Object.entries(translatedValues).map(([key, value]) => [key, t(value)]));
  return t(children, { ...values, ...localized });
}
