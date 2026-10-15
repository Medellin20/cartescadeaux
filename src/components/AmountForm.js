"use client";
import { useState } from "react";
import { CARD_AMOUNTS } from "@/lib/catalog";
import GiftCardPreview from "./GiftCardPreview";
import { CARD_PAYMENT_ENABLED } from "@/lib/payment";

const PRESETS = CARD_AMOUNTS;

export default function AmountForm({ brand, initialAmount = 100, initialQuantity = 1 }) {
  const [amount, setAmount] = useState(initialAmount);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [custom, setCustom] = useState("");
  const [f, setF] = useState({ buyerName: "", buyerEmail: "", recipientName: "", recipientEmail: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const value = custom !== "" ? Number(custom) : amount;
  const valid = Number.isInteger(value) && value >= 50 && value <= 1000;

  async function submit(e) {
    e.preventDefault();
    if (!CARD_PAYMENT_ENABLED) return;
    setError("");
    if (!valid) return setError("Le montant doit être un nombre entier entre 50 € et 1 000 €.");
    setLoading(true);
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, brand, amount: value, quantity }) });
      const d = await r.json();
      if (!r.ok || !d.url) throw new Error(d.error || "Une erreur est survenue.");
      window.location.href = d.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <div className="lg:sticky lg:top-24">
        <GiftCardPreview brand={brand} amount={valid ? value : NaN} />
        <p className="mt-4 text-sm text-stone-600">Livraison instantanée par e-mail après confirmation du paiement.</p>
      </div>

      <form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
        <fieldset>
          <legend className="label">Choisissez le montant</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <button type="button" key={p} onClick={() => { setAmount(p); setCustom(""); }}
                className={`rounded-xl border px-3 py-3 font-semibold transition ${custom === "" && amount === p ? "border-brand-600 bg-brand-600 text-white" : "border-stone-300 hover:border-brand-500"}`}>
                {p} €
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="custom">Ou saisissez un montant (50 – 1 000 €)</label>
            <input id="custom" type="number" min="50" max="1000" step="1" inputMode="numeric" className="input" placeholder="Ex. 250" value={custom} onChange={(e) => setCustom(e.target.value)} />
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="quantity">Quantité de cartes</label>
          <select id="quantity" className="input" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>{Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select>
          <p className="mt-3 font-semibold" aria-live="polite">{valid ? `${quantity} × ${value.toLocaleString("fr-FR")} € = ${(value * quantity).toLocaleString("fr-FR")} €` : "Choisissez un montant valide."}</p>
          <p className="mt-1 text-sm text-stone-600">Un code distinct par carte, envoyé aux adresses indiquées ci-dessous.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="bn">Votre nom</label><input id="bn" className="input" value={f.buyerName} onChange={set("buyerName")} maxLength={100} /></div>
          <div><label className="label" htmlFor="be">Votre e-mail *</label><input id="be" type="email" required className="input" value={f.buyerEmail} onChange={set("buyerEmail")} /></div>
          <div><label className="label" htmlFor="rn">Nom du destinataire</label><input id="rn" className="input" value={f.recipientName} onChange={set("recipientName")} maxLength={100} /></div>
          <div><label className="label" htmlFor="re">E-mail du destinataire</label><input id="re" type="email" className="input" value={f.recipientEmail} onChange={set("recipientEmail")} /></div>
        </div>
        <div>
          <label className="label" htmlFor="msg">Message personnel (facultatif)</label>
          <textarea id="msg" rows={3} maxLength={300} className="input" value={f.message} onChange={set("message")} />
        </div>
        {/* Honeypot anti-bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={f.website} onChange={set("website")} aria-hidden="true" />

        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
          <p className="font-semibold text-brand-900">Paiement par carte</p>
          <p id="payment-availability" className="mt-1 text-sm text-stone-600">
            {CARD_PAYMENT_ENABLED ? "Vous serez redirigé vers SumUp pour régler votre commande." : "Bientôt disponible. Le paiement par carte sera accessible dès son activation."}
          </p>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full text-lg disabled:cursor-not-allowed" disabled={loading || !CARD_PAYMENT_ENABLED} aria-describedby="payment-availability">
          {!CARD_PAYMENT_ENABLED ? "Paiement par carte — bientôt disponible" : loading ? "Redirection vers le paiement…" : `Payer ${valid ? (value * quantity).toLocaleString("fr-FR") + " €" : ""} en toute sécurité`}
        </button>
        <p className="text-center text-xs text-stone-500">{CARD_PAYMENT_ENABLED ? "🔒 Paiement sécurisé SumUp. Le code est envoyé par e-mail une fois le paiement confirmé." : "Aucune commande ni aucun paiement ne sont enregistrés pour le moment."}</p>
      </form>
    </div>
  );
}
