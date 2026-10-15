import "server-only";
import crypto from "crypto";

// Alphabet sans caractères ambigus (0/O, 1/I/L)
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateCode() {
  const bytes = crypto.randomBytes(12);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  return "P2P-" + [0, 4, 8].map((i) => chars.slice(i, i + 4).join("")).join("-");
}

export const normalizeCode = (s = "") => String(s).toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^P2P/, "P2P-").replace(/^(P2P-)(.{4})(.{4})(.{4}).*$/, "$1$2-$3-$4");
