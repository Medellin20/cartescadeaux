import BalanceForm from "@/components/BalanceForm";
export const metadata = { title: "Vérifier mon solde — Carte cadeau" };
export default function Solde() {
  return (
    <section className="container-p max-w-lg py-14">
      <h1 className="mb-2 text-3xl font-extrabold text-brand-900">Vérifier le solde</h1>
      <p className="mb-6 text-stone-600">Saisissez le code reçu par e-mail pour consulter le solde de votre carte cadeau.</p>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200"><BalanceForm /></div>
    </section>
  );
}
