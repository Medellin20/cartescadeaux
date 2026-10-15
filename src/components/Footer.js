import { T } from "@/components/LanguageProvider";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-stone-300">
      <div className="container-p grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold text-white">Cartes <span className="text-accent-400">cadeaux</span></p>
          <p className="mt-3 text-sm"><T>Cartes cadeaux valables dans tous nos magasins en Europe.</T></p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/solde" className="hover:text-white"><T>Vérifier mon solde</T></Link></li>
          <li><Link href="/contact" className="hover:text-white"><T>Contact</T></Link></li>
          <li><Link href="/conditions" className="hover:text-white"><T>Conditions d’utilisation</T></Link></li>
        </ul>
        <ul className="space-y-2 text-sm">
          <li><Link href="/confidentialite" className="hover:text-white"><T>Confidentialité</T></Link></li>
          <li><Link href="/mentions-legales" className="hover:text-white"><T>Mentions légales</T></Link></li>
          <li className="pt-2 text-xs text-stone-400"><T>Paiement sécurisé par SumUp</T></li>
        </ul>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-stone-400">© {new Date().getFullYear()}{" "}<T>Cartes cadeaux</T></div>
    </footer>
  );
}
