"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#offrir", label: "Offrir une carte" },
  { href: "/#comment", label: "Comment ça marche" },
  { href: "/solde", label: "Vérifier mon solde" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="container-p flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-900">
          Cartes <span className="text-accent-600">cadeaux</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-stone-700 hover:text-brand-600">{l.label}</Link>
          ))}
          <Link href="/#offrir" className="btn-primary !py-2 text-sm">Acheter</Link>
        </nav>
        <button className="md:hidden rounded-lg p-2" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-stone-200 bg-white px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-stone-100 py-3 font-medium">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
