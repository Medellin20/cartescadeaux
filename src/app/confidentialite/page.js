import { T } from "@/components/LanguageProvider";
import Page from "@/components/Page";
export const metadata = { title: "Politique de confidentialité — Cartes cadeaux" };
export default function Confidentialite() {
  return (
    <Page title="Politique de confidentialité">
      <p><T>Nous collectons uniquement les données nécessaires à l’émission de votre carte cadeau : nom, adresse e-mail (acheteur et destinataire) et message éventuel.</T></p>
      <p><T>Les paiements sont traités par SumUp ; aucune donnée bancaire n’est stockée sur nos serveurs. Vos données sont hébergées chez Supabase et ne sont pas revendues.</T></p>
      <p><T>Vous pouvez exercer vos droits d’accès, de rectification et de suppression via la page</T>{" "}<a className="underline" href="/contact"><T>Contact</T></a>.</p>
      <p><em><T>[Texte à faire valider par Cartes cadeaux (RGPD).]</T></em></p>
    </Page>
  );
}
