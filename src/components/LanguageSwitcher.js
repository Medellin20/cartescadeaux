"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div ref={root} className="language-switcher" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button ref={trigger} type="button" className="language-trigger" aria-label={`${t("Choisir la langue")} (${LANGUAGES.find((item) => item.code === language).name})`} aria-expanded={open} aria-controls="language-options" onClick={() => setOpen(!open)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z" /></svg>
        <span className="text-xs font-semibold uppercase">{language}</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      {open && <div id="language-options" className="language-options" role="group" aria-label={t("Choisir la langue")}>
        <p className="px-3 pb-2 pt-1 text-xs font-medium text-stone-500">{t("Langue du site")}</p>
        {LANGUAGES.map((item) => <button key={item.code} type="button" lang={item.code} className="language-option" aria-pressed={language === item.code} onClick={() => { setLanguage(item.code); setOpen(false); trigger.current?.focus(); }}>
          <span>{item.name}</span><span aria-hidden="true" className="text-brand-600">{language === item.code ? "✓" : ""}</span>
        </button>)}
      </div>}
    </div>
  );
}
