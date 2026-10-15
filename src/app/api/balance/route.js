import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { normalizeCode } from "@/lib/codes";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req) {
  if (!rateLimit("balance:" + clientIp(req), 10, 10 * 60_000))
    return NextResponse.json({ error: "Trop de tentatives, réessayez dans quelques minutes." }, { status: 429 });
  const { code } = await req.json().catch(() => ({}));
  const { data } = await db().from("gift_cards")
    .select("balance_cents,initial_cents,status").eq("code", normalizeCode(code)).maybeSingle();
  if (!data) return NextResponse.json({ error: "Code introuvable." }, { status: 404 });
  return NextResponse.json(data);
}
