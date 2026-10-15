"use client";
import { useState } from "react";
import { euro } from "@/lib/format";

export default function BalanceForm() {
  const [code, setCode] = useState("");
  const [res, setRes] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setRes(null); setLoading(true);
    try {
      const r = await fetch("/api/balance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Erreur");
      setRes(d);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="code" className="label">Code de la carte</label>
        <input id="code" className="input font-mono uppercase tracking-widest" placeholder="P2P-XXXX-XXXX-XXXX" value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <button className="btn-dark w-full" disabled={loading}>{loading ? "Vérification…" : "Vérifier le solde"}</button>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {res && (
        <div className="rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
          <p className="text-sm text-emerald-800">Solde disponible</p>
          <p className="text-4xl font-extrabold text-emerald-900">{euro(res.balance_cents)}</p>
          <p className="mt-1 text-xs text-emerald-800">Montant initial : {euro(res.initial_cents)}{res.status === "disabled" && " · Carte désactivée"}</p>
        </div>
      )}
    </form>
  );
}
