import Page from "@/components/Page";
export const metadata = { title: "Contact — Carte cadeau" };
export default function Contact() {
  return (
    <Page title="Contact">
      <p>Une question sur votre carte cadeau ? Écrivez-nous en précisant votre numéro de commande (visible sur la page de confirmation).</p>
      <p><a className="btn-dark" href="mailto:contact@votre-domaine.com">contact@votre-domaine.com</a></p>
      <p className="text-sm"><em>Remplacez cette adresse par celle de Carte cadeau.</em></p>
    </Page>
  );
}
