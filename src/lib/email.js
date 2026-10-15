import "server-only";
import { euro } from "./format";

const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function sendGiftCardEmail({ to, code, codes = [code], amountCents, recipientName, senderName, message }) {
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#1c1917">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#10294a;color:#fff;padding:24px;border-radius:16px 16px 0 0;text-align:center">
      <h1 style="margin:0;font-size:22px">Cartes cadeaux</h1><p style="margin:6px 0 0;opacity:.8">${codes.length > 1 ? "Vos cartes cadeaux" : "Votre carte cadeau"}</p></div>
    <div style="background:#fff;padding:28px;border-radius:0 0 16px 16px">
      <p>Bonjour${recipientName ? " " + esc(recipientName) : ""},</p>
      <p>${senderName ? esc(senderName) + " vous offre" : "Voici"} ${codes.length} carte${codes.length > 1 ? "s" : ""} cadeau d'une valeur unitaire de <strong>${euro(amountCents)}</strong>.</p>
      ${message ? `<blockquote style="border-left:4px solid #f2b01e;margin:16px 0;padding:8px 16px;background:#fafaf9">${esc(message)}</blockquote>` : ""}
      <p style="text-align:center;margin:28px 0 6px">${codes.length > 1 ? "Vos codes :" : "Votre code :"}</p>
      ${codes.map((cardCode) => `<p style="text-align:center;font-size:26px;letter-spacing:2px;font-weight:bold;font-family:monospace;background:#fef3c7;padding:16px;border-radius:12px">${esc(cardCode)}</p>`).join("")}
      <p style="font-size:13px;color:#57534e">Valable dans tous nos magasins en Europe. Conservez ce code précieusement : il est strictement personnel. Vous pouvez vérifier votre solde à tout moment sur ${esc(process.env.SITE_URL)}/solde</p>
    </div></div></body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject: codes.length > 1 ? "Vos cartes cadeaux" : "Votre carte cadeau", html }),
  });
  if (!res.ok) throw new Error("Envoi e-mail impossible");
}
