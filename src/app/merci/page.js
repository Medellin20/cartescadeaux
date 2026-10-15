import Link from "next/link";
import { fulfillOrder } from "@/lib/fulfill";
import { maskEmail } from "@/lib/format";
import Refresher from "@/components/Refresher";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirmation — Cartes cadeaux", robots: { index: false } };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function Merci({ searchParams }) {
  const id = searchParams?.order;
  let r = { status: "not_found" };
  if (id && UUID.test(id)) { try { r = await fulfillOrder(id); } catch { r = { status: "pending" }; } }

  const views = {
    paid: { icon: "✅", title: "Paiement confirmé", text: r.emailed
      ? `Votre carte cadeau a été envoyée à ${maskEmail(r.order?.buyer_email)}${r.order?.recipient_email ? " et au destinataire" : ""}. Pensez à vérifier vos courriers indésirables.`
      : "Votre paiement est bien confirmé. L’envoi de l’e-mail rencontre un retard ; vous le recevrez très bientôt (sinon, contactez-nous)." },
    pending: { icon: "⏳", title: "Vérification du paiement…", text: "Nous attendons la confirmation de SumUp. Cette page s’actualise automatiquement." },
    failed: { icon: "❌", title: "Paiement refusé", text: "Le paiement n’a pas abouti. Aucun montant n’a été débité. Vous pouvez réessayer." },
    mismatch: { icon: "⚠️", title: "Vérification requise", text: "Une incohérence a été détectée sur ce paiement. Contactez-nous en indiquant votre numéro de commande." },
    not_found: { icon: "❓", title: "Commande introuvable", text: "Nous ne retrouvons pas cette commande." },
  };
  const v = views[r.status] || views.not_found;

  return (
    <section className="container-p max-w-xl py-20 text-center">
      {r.status === "pending" && <Refresher />}
      <div className="text-6xl">{v.icon}</div>
      <h1 className="mt-4 text-3xl font-extrabold text-brand-900">{v.title}</h1>
      <p className="mt-3 text-stone-600">{v.text}</p>
      {id && <p className="mt-2 text-xs text-stone-400">Commande : {id}</p>}
      <Link href="/" className="btn-dark mt-8">Retour à l’accueil</Link>
    </section>
  );
}
