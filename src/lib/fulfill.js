import "server-only";
import { db } from "./supabase";
import { getCheckout } from "./sumup";
import { generateCode } from "./codes";
import { sendGiftCardEmail } from "./email";

/**
 * Traitement idempotent d'une commande. Appelé par le webhook ET par la page de retour.
 * 1) Vérifie le paiement auprès de SumUp (jamais sur la foi du navigateur ou du corps du webhook)
 * 2) Passe la commande en "paid" (mise à jour conditionnelle = verrou)
 * 3) Crée la carte (order_id unique => jamais en double)
 * 4) Envoie l'e-mail une seule fois
 */
export async function fulfillOrder(orderId) {
  const supa = db();
  let { data: order } = await supa.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return { status: "not_found" };

  if (order.status === "pending") {
    if (!order.sumup_checkout_id) return { status: "pending" };
    const checkout = await getCheckout(order.sumup_checkout_id);

    if (checkout.status === "FAILED") {
      await supa.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
      return { status: "failed" };
    }
    if (checkout.status !== "PAID") return { status: "pending" };

    const ok =
      Math.round(Number(checkout.amount) * 100) === order.amount_cents &&
      checkout.currency === order.currency &&
      checkout.checkout_reference === order.id &&
      (!checkout.merchant_code || checkout.merchant_code === process.env.SUMUP_MERCHANT_CODE);
    if (!ok) {
      await supa.from("orders").update({ status: "mismatch" }).eq("id", order.id).eq("status", "pending");
      return { status: "mismatch" };
    }

    const tx = checkout.transaction_id || checkout.transactions?.[0]?.id || null;
    await supa.from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), sumup_transaction_id: tx })
      .eq("id", order.id).eq("status", "pending");
    ({ data: order } = await supa.from("orders").select("*").eq("id", orderId).single());
  }

  if (order.status !== "paid") return { status: order.status };

  // Carte (créée si absente ; la contrainte unique sur order_id empêche les doublons)
  let { data: card } = await supa.from("gift_cards").select("*").eq("order_id", order.id).maybeSingle();
  if (!card) {
    const ins = await supa.from("gift_cards")
      .insert({ code: generateCode(), order_id: order.id, initial_cents: order.amount_cents, balance_cents: order.amount_cents })
      .select().maybeSingle();
    card = ins.data;
    if (!card) ({ data: card } = await supa.from("gift_cards").select("*").eq("order_id", order.id).maybeSingle());
    if (!card) return { status: "paid", emailed: false };
  }

  // E-mail : on "réserve" l'envoi, et on le libère en cas d'échec pour permettre un nouvel essai
  const { data: claim } = await supa.from("orders")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("id", order.id).is("email_sent_at", null).select("id").maybeSingle();
  if (claim) {
    try {
      const to = [...new Set([order.buyer_email, order.recipient_email].filter(Boolean))];
      await sendGiftCardEmail({
        to, code: card.code, amountCents: card.initial_cents,
        recipientName: order.recipient_name, senderName: order.buyer_name, message: order.message,
      });
    } catch (e) {
      await supa.from("orders").update({ email_sent_at: null }).eq("id", order.id);
      return { status: "paid", emailed: false, order };
    }
  }
  return { status: "paid", emailed: true, order };
}
