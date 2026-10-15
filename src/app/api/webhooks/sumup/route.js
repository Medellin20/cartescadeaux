import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/supabase";
import { fulfillOrder } from "@/lib/fulfill";

export const dynamic = "force-dynamic";

const safeEqual = (a = "", b = "") => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export async function POST(req) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!process.env.SUMUP_WEBHOOK_SECRET || !safeEqual(token, process.env.SUMUP_WEBHOOK_SECRET))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  // Le corps sert UNIQUEMENT à retrouver l'identifiant du checkout ; le statut est relu chez SumUp.
  const checkoutId = body?.payload?.checkout_id || body?.id;
  if (!checkoutId) return NextResponse.json({ ok: true });

  const { data: order } = await db().from("orders").select("id").eq("sumup_checkout_id", String(checkoutId)).maybeSingle();
  if (order) {
    try { await fulfillOrder(order.id); }
    catch { return NextResponse.json({ error: "retry" }, { status: 500 }); } // SumUp réessaiera
  }
  return NextResponse.json({ ok: true });
}
