import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { COOKIE, createSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

// Hash factice : le temps de réponse reste le même si la configuration est absente
const DUMMY = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5Z0o9m8d9sPpP8aWQ9mJ0mY3x4Zz3Yy";

export async function POST(req) {
  if (!rateLimit("login:" + clientIp(req), 5, 15 * 60_000))
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans 15 minutes." }, { status: 429 });
  const { email, password } = await req.json().catch(() => ({}));
  const hash = Buffer.from(process.env.ADMIN_PASSWORD_HASH || "", "base64").toString() || DUMMY;
  const okPwd = await bcrypt.compare(String(password || ""), hash).catch(() => false);
  const okEmail = String(email || "").toLowerCase() === String(process.env.ADMIN_EMAIL || "").toLowerCase();
  if (!okPwd || !okEmail) return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await createSession(email), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600,
  });
  return res;
}
