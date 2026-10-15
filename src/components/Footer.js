import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-stone-300">
      <div className="container-p grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold text-white">Carte <span className="text-accent-400">cadeau</span></p>
          <p className="mt-3 text-sm">Cartes cadeaux valables dans tous nos magasins en Europe.</p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/solde" className="hover:text-white">Vérifier mon solde</Link></li>
          <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          <li><Link href="/conditions" className="hover:text-white">Conditions d’utilisation</Link></li>
        </ul>
        <ul className="space-y-2 text-sm">
          <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
          <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
          <li className="pt-2 text-xs text-stone-400">Paiement sécurisé par SumUp</li>
        </ul>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-stone-400">© {new Date().getFullYear()} Carte cadeau</div>
    </footer>
  );
}
