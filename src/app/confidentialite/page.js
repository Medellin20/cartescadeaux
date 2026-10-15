import Page from "@/components/Page";
export const metadata = { title: "Politique de confidentialité — Cartes cadeaux" };
export default function Confidentialite() {
  return (
    <Page title="Politique de confidentialité">
      <p>Nous collectons uniquement les données nécessaires à l’émission de votre carte cadeau : nom, adresse e-mail (acheteur et destinataire) et message éventuel.</p>
      <p>Les paiements sont traités par SumUp ; aucune donnée bancaire n’est stockée sur nos serveurs. Vos données sont hébergées chez Supabase et ne sont pas revendues.</p>
      <p>Vous pouvez exercer vos droits d’accès, de rectification et de suppression via la page <a className="underline" href="/contact">Contact</a>.</p>
      <p><em>[Texte à faire valider par Cartes cadeaux (RGPD).]</em></p>
    </Page>
  );
}
