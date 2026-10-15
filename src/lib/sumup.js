import "server-only";

const API = "https://api.sumup.com/v0.1";
const headers = () => ({ Authorization: `Bearer ${process.env.SUMUP_API_KEY}`, "Content-Type": "application/json" });

/** Crée un checkout SumUp hébergé. `amount` en euros (décimal). */
export async function createCheckout({ reference, amountCents, description, returnUrl, redirectUrl }) {
  const res = await fetch(`${API}/checkouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      checkout_reference: reference,
      amount: amountCents / 100,
      currency: "EUR",
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description,
      return_url: returnUrl,       // webhook serveur
      redirect_url: redirectUrl,   // retour navigateur
      hosted_checkout: { enabled: true },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("SumUp: création du checkout impossible");
  return data; // { id, hosted_checkout_url, ... }
}

/** Source de vérité : relit l'état du paiement directement chez SumUp. */
export async function getCheckout(id) {
  const res = await fetch(`${API}/checkouts/${encodeURIComponent(id)}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error("SumUp: lecture du checkout impossible");
  return res.json();
}
