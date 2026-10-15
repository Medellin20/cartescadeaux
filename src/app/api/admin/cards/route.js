import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { sendGiftCardEmail } from "@/lib/email";

export async function POST(req) {
  if (!(await getSession())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { action, id, amount, note } = await req.json().catch(() => ({}));
  const supa = db();
  const bad = (m, s = 400) => NextResponse.json({ error: m }, { status: s });

  if (action === "debit" || action === "credit") {
    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents <= 0 || cents > 100000) return bad("Montant invalide.");
    const { data, error } = await supa.rpc("adjust_card", {
      p_card_id: id, p_delta: action === "debit" ? -cents : cents,
      p_type: action === "debit" ? "redeem" : "adjust", p_note: String(note || "").slice(0, 200) || null,
    });
    if (error) return bad(error.message.includes("balance_cents_check") ? "Solde insuffisant." : "Opération impossible (carte désactivée ?).");
    return NextResponse.json({ balance_cents: data });
  }

  if (action === "toggle") {
    const { data: c } = await supa.from("gift_cards").select("status").eq("id", id).single();
    const status = c?.status === "active" ? "disabled" : "active";
    await supa.from("gift_cards").update({ status }).eq("id", id);
    return NextResponse.json({ status });
  }

  if (action === "resend") {
    const { data: c } = await supa.from("gift_cards").select("*, orders(*)").eq("id", id).single();
    if (!c) return bad("Carte introuvable.", 404);
    const o = c.orders;
    try {
      await sendGiftCardEmail({
        to: [...new Set([o.buyer_email, o.recipient_email].filter(Boolean))], code: c.code,
        amountCents: c.initial_cents, recipientName: o.recipient_name, senderName: o.buyer_name, message: o.message,
      });
      await supa.from("orders").update({ email_sent_at: new Date().toISOString() }).eq("id", o.id);
      return NextResponse.json({ ok: true });
    } catch { return bad("Échec de l'envoi.", 502); }
  }
  return bad("Action inconnue.");
}
