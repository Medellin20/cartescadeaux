import "./globals.css";
import RevealEffects from "@/components/RevealEffects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cartes cadeaux",
  description: "Offrez une carte cadeau. De 50 € à 1 000 €, livraison instantanée par e-mail, valable dans tous nos magasins en Europe.",
  robots: { index: true, follow: true },
  openGraph: { title: "Cartes cadeaux", type: "website", locale: "fr_FR", siteName: "Cartes cadeaux" },
};
export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 antialiased">
        <RevealEffects />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
