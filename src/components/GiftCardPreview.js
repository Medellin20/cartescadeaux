export default function GiftCardPreview({ amount = 50, brand = "Cartes cadeaux" }) {
  return (
    <div className="gift-card">
      <div className="gift-card-top"><span className="gift-card-logo">◎ Cartes cadeaux</span><span className="gift-card-label">CARTE CADEAU</span></div>
      <div className="gift-card-chip" aria-hidden="true"><span /></div>
      <p className="gift-card-brand">{brand}</p>
      <div className="gift-card-bottom"><span className="gift-card-digits" aria-hidden="true">•••• •••• •••• ••••</span><div className="gift-card-value">{Number.isFinite(amount) ? amount.toLocaleString("fr-FR") : "—"} €<small>EUR</small></div></div>
    </div>
  );
}
