"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import { T, useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#offrir", label: "Offrir une carte" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/solde", label: "Vérifier mon solde" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="container-p flex min-h-16 items-center justify-between gap-3 py-2">
        <Link href="/" className="min-w-0 text-base font-extrabold tracking-tight text-brand-900 sm:text-xl">
          Cartes <span className="text-accent-600">cadeaux</span>
        </Link>
        <nav className="hidden min-w-0 items-center gap-5 xl:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-stone-700 hover:text-brand-600"><T>{l.label}</T></Link>
          ))}
          <Link href="/#offrir" className="btn-primary !py-2 text-sm"><T>Acheter</T></Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <button type="button" className="xl:hidden rounded-lg p-2 min-h-11 min-w-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500" aria-label={t(open ? "Fermer le menu" : "Ouvrir le menu")} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label={t("Navigation principale")} className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-stone-200 bg-white px-4 pb-4 xl:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-stone-100 py-3 font-medium"><T>{l.label}</T></Link>
          ))}
          <Link href="/#offrir" className="btn-primary mt-4 w-full" onClick={() => setOpen(false)}><T>Acheter</T></Link>
        </nav>
      )}
    </header>
  );
}
