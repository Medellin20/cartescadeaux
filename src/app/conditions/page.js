import { T } from "@/components/LanguageProvider";
import Page from "@/components/Page";
export const metadata = { title: "Conditions d’utilisation — Cartes cadeaux" };
export default function Conditions() {
  return (
    <Page title="Conditions d’utilisation des cartes cadeaux">
      <p><T>Les cartes cadeaux Cartes cadeaux sont émises pour un montant compris entre 20 € et 1 000 € et sont valables dans tous les magasins Cartes cadeaux en Europe.</T></p>
      <p><T>Le code est envoyé par e-mail après confirmation du paiement. Il est strictement personnel : en cas de perte ou de vol, Cartes cadeaux ne peut être tenu responsable de son utilisation par un tiers.</T></p>
      <p><T>Les cartes cadeaux ne sont ni remboursables, ni échangeables contre des espèces. Le solde restant peut être consulté en ligne.</T></p>
      <p><em><T>[Texte à faire valider et compléter par Cartes cadeaux : durée de validité, droit de rétractation, etc.]</T></em></p>
    </Page>
  );
}
