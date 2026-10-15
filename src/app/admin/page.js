import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { euro } from "@/lib/format";
import AdminCards from "@/components/AdminCards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administration — Cartes cadeaux", robots: { index: false, follow: false } };

export default async function Admin({ searchParams }) {
  if (!(await getSession())) redirect("/admin/login"); // double contrôle en plus du middleware
  const supa = db();
  const q = (searchParams?.q || "").toString().trim().toUpperCase().replace(/[%,()]/g, "");

  let cardsQ = supa.from("gift_cards").select("*, orders(buyer_email,recipient_email,email_sent_at,paid_at)").order("created_at", { ascending: false }).limit(200);
  if (q) cardsQ = cardsQ.ilike("code", `%${q}%`);
  const [{ data: cards = [] }, { data: all = [] }, { data: orders = [] }] = await Promise.all([
    cardsQ,
    supa.from("gift_cards").select("initial_cents,balance_cents"),
    supa.from("orders").select("id,status,brand,quantity,amount_cents,buyer_email,created_at").order("created_at", { ascending: false }).limit(30),
  ]);
  const sold = all.reduce((s, c) => s + c.initial_cents, 0);
  const outstanding = all.reduce((s, c) => s + c.balance_cents, 0);

  return (
    <section className="container-p py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-brand-900">Administration</h1>
        <form action="/admin" className="flex gap-2"><input name="q" defaultValue={q} placeholder="Rechercher un code" className="input !w-56" /><button className="btn-dark !py-2">OK</button></form>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[["Cartes émises", all.length], ["Montant vendu", euro(sold)], ["Solde restant dû", euro(outstanding)]].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200"><p className="text-sm text-stone-500">{l}</p><p className="text-2xl font-extrabold">{v}</p></div>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-bold">Cartes cadeaux</h2>
      <AdminCards cards={cards} />

      <h2 className="mb-3 mt-10 text-lg font-bold">Dernières commandes</h2>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase text-stone-500"><tr><th className="p-3">Date</th><th className="p-3">Acheteur</th><th className="p-3">Enseigne</th><th className="p-3">Quantité</th><th className="p-3">Total</th><th className="p-3">Statut</th></tr></thead>
          <tbody>{orders.map((o) => (
            <tr key={o.id} className="border-t border-stone-100"><td className="p-3">{new Date(o.created_at).toLocaleString("fr-FR")}</td><td className="p-3">{o.buyer_email}</td><td className="p-3">{o.brand || "Cartes cadeaux"}</td><td className="p-3">{o.quantity || 1}</td><td className="p-3">{euro(o.amount_cents)}</td><td className="p-3">{o.status}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
