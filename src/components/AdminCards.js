"use client";
import { useRouter } from "next/navigation";
import { euro } from "@/lib/format";

export default function AdminCards({ cards }) {
  const router = useRouter();

  async function call(body) {
    const r = await fetch("/api/admin/cards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) alert(d.error || "Erreur");
    else router.refresh();
  }
  const money = (action, c) => {
    const v = window.prompt(action === "debit" ? "Montant à débiter (€)" : "Montant à créditer (€)");
    if (!v) return;
    const note = window.prompt("Note (ex. n° de ticket magasin)") || "";
    call({ action, id: c.id, amount: v.replace(",", "."), note });
  };
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase text-stone-500">
            <tr><th className="p-3">Code</th><th className="p-3">Acheteur</th><th className="p-3">Initial</th><th className="p-3">Solde</th><th className="p-3">Statut</th><th className="p-3">E-mail</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id} className="border-t border-stone-100 align-top">
                <td className="p-3 font-mono">{c.code}</td>
                <td className="p-3">{c.orders?.buyer_email}</td>
                <td className="p-3">{euro(c.initial_cents)}</td>
                <td className="p-3 font-bold">{euro(c.balance_cents)}</td>
                <td className="p-3">{c.status === "active" ? "Active" : "Désactivée"}</td>
                <td className="p-3">{c.orders?.email_sent_at ? "Envoyé" : "Non envoyé"}</td>
                <td className="flex flex-wrap gap-1 p-3">
                  <button className="rounded-lg bg-brand-900 px-2 py-1 text-xs text-white" onClick={() => money("debit", c)}>Débiter</button>
                  <button className="rounded-lg bg-stone-200 px-2 py-1 text-xs" onClick={() => money("credit", c)}>Créditer</button>
                  <button className="rounded-lg bg-stone-200 px-2 py-1 text-xs" onClick={() => call({ action: "resend", id: c.id })}>Renvoyer</button>
                  <button className="rounded-lg bg-red-100 px-2 py-1 text-xs text-red-800" onClick={() => call({ action: "toggle", id: c.id })}>{c.status === "active" ? "Désactiver" : "Activer"}</button>
                </td>
              </tr>
            ))}
            {!cards.length && <tr><td className="p-6 text-center text-stone-500" colSpan={7}>Aucune carte.</td></tr>}
          </tbody>
        </table>
      </div>
      <button onClick={logout} className="mt-4 text-sm underline">Se déconnecter</button>
    </div>
  );
}
