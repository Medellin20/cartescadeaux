import { CARD_BRANDS } from "@/lib/catalog";
import { CARD_PAYMENT_ENABLED } from "@/lib/payment";
import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { createCheckout } from "@/lib/sumup";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (s, n) => String(s || "").trim().slice(0, n);
const err = (m, status = 400) => NextResponse.json({ error: m }, { status });

export async function POST(req) {
  if (!CARD_PAYMENT_ENABLED) return err("Paiement par carte bientôt disponible.", 503);
  if (!rateLimit("checkout:" + clientIp(req), 10, 10 * 60_000)) return err("Trop de tentatives, réessayez plus tard.", 429);
  let b;
  try { b = await req.json(); } catch { return err("Requête invalide"); }
  if (b.website) return err("Requête invalide"); // honeypot anti-bots

  const brand = b.brand;
  if (!CARD_BRANDS.includes(brand)) return err("Veuillez choisir une carte du catalogue.");
  const amount = Number(b.amount);
  if (!Number.isInteger(amount) || amount < 50 || amount > 1000) return err("Montant invalide (50 € à 1 000 €).");
  const quantity = b.quantity === undefined ? 1 : Number(b.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return err("Quantité invalide (1 à 20 cartes).");
  const buyerEmail = clean(b.buyerEmail, 200);
  const recipientEmail = clean(b.recipientEmail, 200);
  if (!EMAIL.test(buyerEmail)) return err("Adresse e-mail invalide.");
  if (recipientEmail && !EMAIL.test(recipientEmail)) return err("E-mail du destinataire invalide.");

  const supa = db();
  const { data: order, error } = await supa.from("orders").insert({
    brand,
    quantity,
    amount_cents: amount * quantity * 100,
    buyer_name: clean(b.buyerName, 100) || null,
    buyer_email: buyerEmail,
    recipient_name: clean(b.recipientName, 100) || null,
    recipient_email: recipientEmail || null,
    message: clean(b.message, 300) || null,
  }).select("id").single();
  if (error) return err("Erreur serveur", 500);

  try {
    const site = process.env.SITE_URL;
    const checkout = await createCheckout({
      reference: order.id,
      amountCents: amount * quantity * 100,
      description: `${quantity} carte(s) cadeau ${brand} de ${amount} €`,
      returnUrl: `${site}/api/webhooks/sumup?token=${process.env.SUMUP_WEBHOOK_SECRET}`,
      redirectUrl: `${site}/merci?order=${order.id}`,
    });
    if (!checkout.hosted_checkout_url) throw new Error("no url");
    await supa.from("orders").update({ sumup_checkout_id: checkout.id }).eq("id", order.id);
    return NextResponse.json({ url: checkout.hosted_checkout_url });
  } catch {
    await supa.from("orders").update({ status: "failed" }).eq("id", order.id);
    return err("Paiement momentanément indisponible.", 502);
  }
}
