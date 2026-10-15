import Comments from "@/components/Comments";
import Link from "next/link";
import CardCatalog from "@/components/CardCatalog";
import GiftCardPreview from "@/components/GiftCardPreview";

const steps = [
  { n: "1", t: "Choisissez le montant", d: "De 50 € à 1 000 €, parmi nos montants proposés ou le vôtre." },
  { n: "2", t: "Payez en ligne", d: "Paiement sécurisé via SumUp, directement sur une page de paiement protégée." },
  { n: "3", t: "Recevez le code", d: "Le code est envoyé par e-mail dès que le paiement est confirmé." },
];
const perks = [
  ["⚡", "Livraison instantanée", "Votre carte arrive par e-mail en quelques instants."],
  ["🎁", "28 enseignes", "Du divertissement au shopping, trouvez la carte qui vous plaît."],
  ["🔒", "Paiement sécurisé", "Transactions protégées, aucune donnée bancaire stockée chez nous."],
  ["💶", "Solde consultable", "Vérifiez votre solde à tout moment en ligne."],
];

export default function Home() {
  return (
    <>
      <section className="hero-section bg-gradient-to-b from-brand-50 to-stone-50">
        <div className="container-p grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div data-reveal>
            <p className="mb-3 inline-block rounded-full bg-accent-400/30 px-3 py-1 text-sm font-semibold text-brand-900">Cartes cadeaux</p>
            <h1 className="text-4xl font-extrabold leading-tight text-brand-900 sm:text-5xl">Toutes vos envies, une carte cadeau</h1>
            <p className="mt-4 max-w-lg text-lg text-stone-600">Découvrez nos 28 cartes cadeaux : divertissement, jeux vidéo, shopping et sport. Choisissez votre enseigne et un montant de 50 € à 1 000 €.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#offrir" className="btn-primary">Offrir une carte cadeau</Link>
              <Link href="/solde" className="btn bg-white ring-1 ring-stone-300 hover:bg-stone-100">Vérifier mon solde</Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end"><div className="hero-card w-full max-w-md">
            <GiftCardPreview brand="Votre enseigne préférée" amount={100} /></div></div>
        </div>
      </section>

      <section className="container-p grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(([i, t, d]) => (
          <div key={t} data-reveal className="feature-card rounded-2xl bg-white p-5 ring-1 ring-stone-200"><div className="text-3xl">{i}</div><h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm text-stone-600">{d}</p></div>
        ))}
      </section>

      <CardCatalog />

      <section id="comment" className="container-p scroll-mt-20 py-14">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-brand-900">Comment ça marche ?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} data-reveal className="rounded-2xl bg-white p-6 text-center ring-1 ring-stone-200">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-xl font-extrabold text-brand-900">{s.n}</span>
              <h3 className="mt-4 font-bold">{s.t}</h3><p className="mt-1 text-sm text-stone-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Comments />
    </>
  );
}
