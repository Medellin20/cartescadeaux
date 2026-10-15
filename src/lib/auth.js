import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE = "p2p_admin";
const key = () => new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET);

export const createSession = (email) =>
  new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(key());

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key())).payload; } catch { return null; }
}
