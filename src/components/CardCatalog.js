"use client";
import { useState } from "react";
import { CARD_BRANDS, CARD_AMOUNTS } from "@/lib/catalog";
import GiftCardPreview from "./GiftCardPreview";
import AmountForm from "./AmountForm";

export default function CardCatalog() {
  const [amounts, setAmounts] = useState({});
  const [selection, setSelection] = useState(null);
  const [search, setSearch] = useState("");
  function choose(brand, amount) {
    setSelection({ brand, amount });
    requestAnimationFrame(() => document.getElementById("personnaliser")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  }
  const brands = CARD_BRANDS.filter((brand) => brand.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr").trim()));
  return (
    <>
      <section id="offrir" className="catalog-section scroll-mt-16">
        <div className="container-p py-14">
          <div className="catalog-heading"><div><p className="catalog-eyebrow">28 enseignes · De 50 à 1 000 €</p><h2>Choisissez votre carte cadeau</h2><p>Vos marques préférées, un montant à votre choix.</p></div><div><label className="sr-only" htmlFor="catalog-search">Rechercher une carte</label><input id="catalog-search" type="search" className="catalog-search" placeholder="Rechercher une enseigne…" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
          <div className="catalog-grid">
            {brands.map((brand) => {
              const amount = amounts[brand] || 50;
              return <article key={brand} className="catalog-item">
                <GiftCardPreview brand={brand} amount={amount} />
                <h3>{brand}</h3>
                <label className="sr-only" htmlFor={`amount-${CARD_BRANDS.indexOf(brand)}`}>Montant pour {brand}</label>
                <select id={`amount-${CARD_BRANDS.indexOf(brand)}`} className="catalog-amount" value={amount} onChange={(e) => setAmounts({ ...amounts, [brand]: Number(e.target.value) })}>{CARD_AMOUNTS.map((value) => <option key={value} value={value}>{value.toLocaleString("fr-FR")} €</option>)}</select>
                <button type="button" className="catalog-buy" onClick={() => choose(brand, amount)}>Acheter — {amount.toLocaleString("fr-FR")} €<span className="sr-only"> · {brand}</span></button>
              </article>;
            })}
          </div>
          {!brands.length && <p className="py-12 text-center text-stone-600" role="status">Aucune carte ne correspond à votre recherche.</p>}
        </div>
      </section>
      {selection && <section id="personnaliser" className="container-p scroll-mt-24 py-14"><h2 className="mb-8 text-3xl font-extrabold text-brand-900">Votre carte {selection.brand}</h2><AmountForm key={`${selection.brand}-${selection.amount}`} brand={selection.brand} initialAmount={selection.amount} /></section>}
    </>
  );
}
