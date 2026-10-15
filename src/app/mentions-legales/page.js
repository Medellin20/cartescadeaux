import { T } from "@/components/LanguageProvider";
import Page from "@/components/Page";
export const metadata = { title: "Mentions légales — Cartes cadeaux" };
export default function Mentions() {
  return (
    <Page title="Mentions légales">
      <p><T>Éditeur : Cartes cadeaux — [raison sociale, forme juridique, capital, adresse, numéro d’immatriculation, TVA].</T></p>
      <p><T>Directeur de la publication : [à compléter].</T></p>
      <p><T>Hébergement : [hébergeur à compléter].</T></p>
    </Page>
  );
}
